@echo off
echo ========================================
echo UniHub Project Startup Script
echo ========================================
echo.

echo Starting MongoDB (if installed locally)...
echo Note: If you're using MongoDB Atlas, skip this step
echo.

echo Installing server dependencies...
cd server
call npm install
echo.

echo Creating .env file from template...
if not exist .env (
    copy env.example .env
    echo .env file created! Please edit it with your configuration.
) else (
    echo .env file already exists.
)
echo.

echo Starting server...
start "UniHub Server" cmd /k "npm run dev"
echo.

echo Installing client dependencies...
cd ..\client
call npm install
echo.

echo Starting client...
start "UniHub Client" cmd /k "npm start"
echo.

echo ========================================
echo Project started successfully!
echo ========================================
echo.
echo Server: http://localhost:5000
echo Client: http://localhost:3000
echo.
echo Press any key to exit...
pause > nul
