@echo off
echo ================================================
echo  LeapMoney -- Push Research Reports to GitHub
echo  Branch: develop
echo  Commit: 80b30f9577658aac7f5aa1dd02695b015e57d8c5
echo ================================================
echo.

cd /d "C:\Users\amit\Desktop\LeapMoney PRD SetUP\platform"

echo Pushing to origin/develop...
echo.
git push origin develop

echo.
if %ERRORLEVEL% == 0 (
    echo ================================================
    echo  SUCCESS - Files pushed to GitHub
    echo  https://github.com/mtmishra/platform/tree/develop/docs/research
    echo ================================================
) else (
    echo ================================================
    echo  PUSH FAILED - Check your GitHub credentials
    echo  Run manually: git push origin develop
    echo ================================================
)
echo.
pause
