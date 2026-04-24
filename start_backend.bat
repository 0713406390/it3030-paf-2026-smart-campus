@echo off
echo ===========================================
echo       Smart Campus Hub - Startup Script
echo ===========================================
echo.
echo Starting Spring Boot Backend API...
start "Backend Server" cmd /k "cd backend && mvnw.cmd spring-boot:run"
echo.
echo Please wait for the backend window to say "Tomcat started on port 8081".
echo Then, you can try logging in again via Google at http://localhost:3000 !!
echo.
pause
