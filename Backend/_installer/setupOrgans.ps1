$ErrorActionPreference = "Stop"

$USER_NAME = $env:USERNAME
$HOME_DIR = $env:USERPROFILE
$APP_DIR = "$HOME_DIR\application"

$BACKEND = "https://github.com/MichalKlyz-s/Program.git"

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
$env:Path += ";$env:ProgramFiles\nodejs"
$env:Path += ";$env:APPDATA\npm"

npm install -g pm2
Start-Sleep -Seconds 5  # krótka pauza, by system zaktualizował PATH

Write-Host "Aktualna zmienna PATH: $env:Path"

Write-Host "Stage 2 - Create app directory"

New-Item -ItemType Directory -Force -Path $APP_DIR
Set-Location $APP_DIR

Write-Host "Stage 3 - Clone repositories"

git clone --branch Mix --single-branch $BACKEND

Write-Host "Stage 4 - Build Backend"

Set-Location "$APP_DIR\Program\Backend"

npm install
npm run build


Write-Host "Stage 5 - Set static IP"

$adapter = Get-NetAdapter | Where-Object {$_.Status -eq "Up" -and $_.InterfaceDescription -match "Ethernet|LAN"} | Select-Object -First 1

Start-Sleep -Seconds 5

New-NetIPAddress `
-InterfaceIndex $adapter.InterfaceIndex `
-IPAddress 10.20.20.20 `
-PrefixLength 24 `
-DefaultGateway 10.20.20.1

Set-DnsClientServerAddress `
-InterfaceIndex $adapter.InterfaceIndex `
-ServerAddresses 8.8.8.8,1.1.1.1

Write-Host "Stage 6 - Start backend"

Set-Location "$APP_DIR\Program\Backend"

pm2 start pm2.config.js --env production
pm2 save
pm2 startup powershell -u $USER_NAME --hp $APP_DIR

Write-Host "Installation completed"