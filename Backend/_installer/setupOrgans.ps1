$ErrorActionPreference = "Stop"

$USER_NAME = $env:USERNAME
$HOME_DIR = $env:USERPROFILE
$APP_DIR = "$HOME_DIR\application"
$ssid = "MyDevice"
$key  = "12345678"

$BACKEND = "https://github.com/MichalKlyz-s/Program.git"
$FRONTEND = "https://github.com/MichalKlyz-s/frontend.git"

if (-not ([Security.Principal.WindowsPrincipal] `
[Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole(`
[Security.Principal.WindowsBuiltInRole] "Administrator")) {

    Start-Process powershell `
    -ArgumentList "-ExecutionPolicy Bypass -File `"$PSCommandPath`"" `
    -Verb RunAs

    exit
}
Write-Host "Stage 1 - Install packages"


if (-not (Get-Package -Name "Microsoft.WindowsAppRuntime.1.8" -ErrorAction SilentlyContinue)) {
    Invoke-WebRequest -Uri "https://aka.ms/windowsapparuntime1.8x64" -OutFile "$env:TEMP\WindowsAppRuntime1.8.msi"
    Start-Process msiexec.exe -ArgumentList "/i `"$env:TEMP\WindowsAppRuntime1.8.msi`" /quiet /norestart" -Wait
}
if (-not (Get-Command winget -ErrorAction SilentlyContinue)) {
Invoke-WebRequest -Uri "https://github.com/microsoft/winget-cli/releases/latest/download/Microsoft.DesktopAppInstaller_8wekyb3d8bbwe.msixbundle" -OutFile "$HOME_DIR\Downloads\AppInstaller.msixbundle"

Add-AppxPackage -Path "$HOME_DIR\Downloads\AppInstaller.msixbundle"
}
winget install --id Git.Git -e --silent
winget install --id OpenJS.NodeJS.LTS -e --silent
winget install --id CaddyServer.Caddy -e --silent
Start-Sleep 5
$caddyPath = Split-Path (Get-Command caddy).Source
$env:Path += ";$env:ProgramFiles\nodejs"
$env:Path += ";$env:APPDATA\npm"
$env:Path += ";$caddyPath"
npm config set fund false
npm config set audit false
npm install -g pm2


Write-Host "Stage 2 - Create app directory"

New-Item -ItemType Directory -Force -Path $APP_DIR
Set-Location $APP_DIR

Write-Host "Stage 3 - Clone repositories"

git clone --branch Windows --single-branch $BACKEND
git clone --branch Windows/Linux --single-branch $FRONTEND

Write-Host "Stage 4 - Build Backend"

Set-Location "$APP_DIR\Program\Backend"

npm install
npm run build

Write-Host "Stage 5 - Build Frontend"

Set-Location "$APP_DIR\frontend"

npm install
npm run build

Write-Host "Stage 6 - Configure Caddy"

$caddyDir = "C:\caddy"
New-Item -ItemType Directory -Force -Path $caddyDir

$caddyConfig = @"
:80 {

    encode gzip zstd

handle_path /api/* {
    reverse_proxy localhost:3000 {
        transport http {
            dial_timeout 5s
        }
        lb_try_duration 30s
        try_duration 30s
    }
}
    root * $APP_DIR\frontend\dist
    file_server

    try_files {path} {path}/ /index.html
}
"@
$caddyConfigPath = "$caddyDir\Caddyfile"

$caddyConfig | Out-File "$caddyConfigPath" -Encoding ascii

Write-Host "Stage 7 - Install Caddy service"
$caddyExe = (Get-Command caddy).Source

if (-not (Get-Service -Name "Caddy" -ErrorAction SilentlyContinue)) {
    $bin = "`"$caddyExe`" run --config `"$caddyConfigPath`" --adapter caddyfile"
    New-Service -Name "Caddy" `
                -BinaryPathName $bin `
                -DisplayName "Caddy Server" `
                -StartupType Automatic

    sc.exe failure Caddy reset= 0 actions= restart/5000
}

Start-Service -Name "Caddy"

Write-Host "Stage 8 - Set static IP"

$adapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up" -and $_.InterfaceDescription -match "Wi-Fi|Wireless|WLAN"} | Select-Object -First 1

Start-Sleep -Seconds 5
if (-not (Get-NetIPAddress -IPAddress 10.50.50.10 -ErrorAction SilentlyContinue)) {
New-NetIPAddress `
-InterfaceIndex $adapter.InterfaceIndex `
-IPAddress 10.50.50.10 `
-PrefixLength 24 `
-DefaultGateway 10.50.50.1
}
Set-DnsClientServerAddress `
-InterfaceIndex $adapter.InterfaceIndex `
-ServerAddresses 8.8.8.8,1.1.1.1

Write-Host "Stage 9 - Enable WiFi hotspot"

netsh wlan set hostednetwork mode=allow ssid=$ssid key=$key
$result = netsh wlan start hostednetwork
if ($LASTEXITCODE -ne 0) {
    Write-Host "Hosted network could not be started. Your Wi-Fi adapter may not support it."
}
Write-Host "Stage 10 - Start backend"

Set-Location "$APP_DIR\Program\Backend"

pm2 start pm2.config.js --env production
pm2 save
pm2 startup powershell -u $USER_NAME --hp $HOME_DIR

Write-Host "Installation completed"