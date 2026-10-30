@echo off
title Push to GitHub: G-Aarshi-ino/SIH26
echo ========================================================
echo   Pushing AICTE-APAARSutra to https://github.com/G-Aarshi-ino/SIH26
echo ========================================================
echo.

set GIT_EXE=C:\Users\User\.gemini\antigravity-ide\scratch\mingit\cmd\git.exe

"%GIT_EXE%" status
echo.
echo Attempting to push to branch 'main'...
"%GIT_EXE%" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================================
    echo   SUCCESS! All files pushed to https://github.com/G-Aarshi-ino/SIH26
    echo ========================================================
) else (
    echo.
    echo ========================================================
    echo   Authentication required by GitHub!
    echo   If prompted, sign in via browser or enter your
    echo   GitHub Personal Access Token (PAT).
    echo ========================================================
)

echo.
pause
