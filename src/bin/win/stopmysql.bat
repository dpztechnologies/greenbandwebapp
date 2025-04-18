@echo off
echo Killing all MySQL processes...

for /f "tokens=2" %%a in ('tasklist ^| findstr mysqld') do (
    echo Killing process ID %%a ...
    taskkill /F /PID %%a
)

echo Done.
pause
