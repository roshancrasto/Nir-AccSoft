@echo off
echo ===================================================
echo             Starting AccSoft Servers
echo ===================================================
echo.

echo [1/2] Launching ASP.NET Core Backend API...
start "AccSoft Backend API" cmd /k "dotnet run --project Backend\DemoProject.API\DemoProject.API.csproj --launch-profile http"

echo [2/2] Launching Angular Frontend App...
start "AccSoft Frontend App" cmd /k "cd Frontend && npm start"

echo.
echo ===================================================
echo Both servers have been launched in separate windows!
echo ===================================================
pause
