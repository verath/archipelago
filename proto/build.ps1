#
# Script for building the backend (.pb.go) and frontend (.d.ts, .js) files
# from the protobuf definitions.
# Based on https://github.com/cockroachdb/cockroach/blob/0ba0af9ed345ecd645efb4743b8d3100a2a78955/build/protobuf.mk

$ErrorActionPreference = "Stop"
$project_root = (Resolve-Path (Join-Path $PSScriptRoot "\..\")).Path

$js_out_dir = (Resolve-Path "$project_root\web\src\wire").Path
$js_bundle = "$js_out_dir\proto_bundle.js"
$ts_bundle = "$js_out_dir\proto_bundle.d.ts"

$pbjs = (Resolve-Path "$project_root\web\node_modules\.bin\pbjs.cmd").Path
$pbts = (Resolve-Path "$project_root\web\node_modules\.bin\pbts.cmd").Path

# Run from the project root
Push-Location -Path $project_root

# Relative paths to each subdirectory in the proto directory, each containing
# .proto files for a package. This is for the protoc-gen-go plugin, as it requires
# a single go package to be processed at a time.
$proto_packages = Get-ChildItem -Recurse -Directory .\proto | Resolve-Path -Relative

# List the found proto packages, for easier troubleshooting
Write-Host "Protobuf definitions:"
foreach($package in $proto_packages) {
    Write-Host "`t $package"
    Get-ChildItem -File -Filter *.proto $package | ForEach-Object {
        Write-Host "`t`t $_"
    }
}
Write-Host ""

# Remove old .pb.go files, in case we removed some .proto file
Write-Host "Removing previously generated go files:"
Get-ChildItem -File -Recurse lib\*.pb.go | ForEach-Object {
    Write-Host "`t $(Resolve-Path -Relative $_.FullName)" -ForegroundColor Red
    Remove-Item $_
}
Write-Host ""

# Build new .pb.go files from the found proto packages.
Write-Host "Generating go files:"
foreach($package in $proto_packages) {
    $package_files = Get-ChildItem $package\*.proto | Resolve-Path -Relative
    $protoc_opts = @("--proto_path=proto", "--go_out=paths=source_relative:lib")
    $protoc_opts += $package_files
    &protoc $protoc_opts
    if (-not $?) {
        Pop-Location
        exit
    }
}
Get-ChildItem -File -Recurse lib\*.pb.go | ForEach-Object {
    Write-Host "`t $(Resolve-Path -Relative $_.FullName)" -ForegroundColor Green
}
Write-Host ""

# Run gofmt on the generated .go files 
Get-ChildItem -File -Recurse lib\*.pb.go | ForEach-Object {
    &gofmt -s -w $_
}

Write-Host "Generating .js bundle"
&$pbjs --target static-module --wrap es6 --out $js_bundle .\proto\**\*.proto | Out-Host
Write-Host "`t $(Resolve-Path -Relative $js_bundle)" -ForegroundColor Green
Write-Host ""

Write-Host "Generating .d.ts bundle (TypeScript definitions)"
&$pbts --out $ts_bundle $js_bundle | Out-Host
Write-Host "`t $(Resolve-Path -Relative $ts_bundle)" -ForegroundColor Green
Write-Host ""
Pop-Location
