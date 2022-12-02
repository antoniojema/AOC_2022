@echo off
set day=day02
set problem=2

set /A argC=0
set only=false
for %%x in (%*) do (
    set /A argC+=1
    if "%%x" == "only" (
        set only=true
    )
)

if "%only%" == "true" (
    echo Only run
) else (
    echo Build and run
    tsc
)
node out\%day%\%problem%\main.js
