@echo off
echo 🚀 Deenly v2 - GitHub Setup Script
echo ====================================
echo.

echo 📋 Checking if git is installed...
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first:
    echo https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git is installed!
echo.

echo 📝 Please make sure you have:
echo   1. Created a GitHub repository named 'deenly-v2'
echo   2. Have your GitHub username ready
echo.

set /p USERNAME="Enter your GitHub username: "
if "%USERNAME%"=="" (
    echo ❌ Username cannot be empty
    pause
    exit /b 1
)

echo.
echo 🔧 Initializing git repository...
git init

echo 📦 Adding all files...
git add .

echo 💾 Creating initial commit...
git commit -m "Initial commit: Deenly v2 - Islamic Mosque Community Platform"

echo 🌿 Setting main branch...
git branch -M main

echo 🔗 Adding remote origin...
git remote add origin https://github.com/%USERNAME%/deenly-v2.git

echo 🚀 Pushing to GitHub...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ❌ Push failed. This might be because:
    echo   1. Repository doesn't exist on GitHub
    echo   2. Wrong username
    echo   3. Need to authenticate
    echo.
    echo Please create the repository on GitHub first:
    echo https://github.com/new
    echo.
    pause
    exit /b 1
)

echo.
echo ✅ Success! Your project is now on GitHub!
echo 🌐 Repository URL: https://github.com/%USERNAME%/deenly-v2
echo.
echo 📋 Next steps:
echo   1. Go to your repository on GitHub
echo   2. Add a description and topics
echo   3. Set up Supabase database using database-schema.sql
echo   4. Deploy to Vercel or your preferred platform
echo.
pause
