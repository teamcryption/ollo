@echo off
rem Starts the ollo site on http://localhost:3100 (the Figma plugin reads icons from it).
cd /d "%~dp0"
echo Starting ollo on http://localhost:3100 ... keep this window open while you use the Figma plugin.
node apps\web\scripts\dev.mjs
pause
