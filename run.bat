@echo off
set day=day16
set problem=1

set cmnd=node out\%day%\problem%problem%.js

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
    %cmnd%
) else (
    echo Build and run
    tsc
    %cmnd%
)
