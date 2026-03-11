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
$caddyPath = Split-Path (Get-Command caddy).Source
$env:Path += ";$env:ProgramFiles\nodejs"
$env:Path += ";$env:APPDATA\npm"
$env:Path += ";$caddyPath"

npm install -g pm2
Start-Sleep -Seconds 5  # krótka pauza, by system zaktualizował PATH

$caddyPath = (Get-Command caddy.exe -ErrorAction SilentlyContinue).Source

if (-not $caddyPath) {
    # Jeśli nie znaleziono w PATH, spróbuj standardowych lokalizacji
    $possiblePaths = @(
        "$env:ProgramFiles\Caddy\caddy.exe",
        "$env:ProgramFiles(x86)\Caddy\caddy.exe",
        "$env:LocalAppData\Programs\Caddy\caddy.exe"
    )
    foreach ($p in $possiblePaths) {
        if (Test-Path $p) {
            $caddyPath = $p
            break
        }
    }
}

if (-not $caddyPath) {
    Write-Error "Nie można znaleźć caddy.exe po instalacji. Upewnij się, że Caddy został poprawnie zainstalowany."
    exit 1
}

# Dodaj folder z caddy.exe do PATH w bieżącej sesji
$env:Path += ";" + (Split-Path $caddyPath)

Write-Host "Znaleziono caddy.exe w: $caddyPath"
Write-Host "Aktualna zmienna PATH: $env:Path"


Write-Host "Stage 2 - Create app directory"

New-Item -ItemType Directory -Force -Path $APP_DIR
Set-Location $APP_DIR

Write-Host "Stage 3 - Clone repositories"

git clone --branch Windows --single-branch $BACKEND
git clone --branch Windows/Linux --single-branch $FRONTEND

Write-Host "Stage 4 - Build Backend"

Set-Location "$APP_DIR\Program\Backend"

npm install
npm run buildfirst

Write-Host "Stage 5 - Build Frontend"

Set-Location "$APP_DIR\frontend"

npm install
npm run build

Write-Host "Stage 6 - Configure Caddy"

$caddyDir = "C:\caddy"
New-Item -ItemType Directory -Force -Path $caddyDir

$caddyConfig = @"
:80 {
    root * $APP_DIR\frontend\dist
    file_server

    try_files {path} {path}/ /index.html

    handle_path /api/* {
       uri strip_prefix /api
       reverse_proxy localhost:3000
    }
}
"@

$caddyConfig | Out-File "$caddyDir\Caddyfile" -Encoding ascii

Write-Host "Stage 7 - Install Caddy service"
if (Get-Service -Name "Caddy" -ErrorAction SilentlyContinue) {
    Stop-Service Caddy -Force
    sc.exe delete Caddy | Out-Null
    Start-Sleep -Seconds 2
}
New-Service -Name "Caddy" `
    -BinaryPathName "`"$caddyPath`" run --config `"$caddyDir\Caddyfile`"" `
    -DisplayName "Caddy Web Server" `
    -StartupType Automatic
Start-Service caddy

Write-Host "Stage 8 - Set static IP"

$adapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up" -and $_.InterfaceDescription -match "Wi-Fi|Wireless|WLAN"} | Select-Object -First 1

Start-Sleep -Seconds 5

New-NetIPAddress `
-InterfaceIndex $adapter.InterfaceIndex `
-IPAddress 10.50.50.15 `
-PrefixLength 24 `
-DefaultGateway 10.50.50.1

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
pm2 startup powershell -u $USER_NAME --hp $APP_DIR

Write-Host "Installation completed"