@ECHO OFF
Title Process Control
mode con cols=46 lines=9
COLOR 1F
ECHO Algunas variables de entorno
echo.
echo S.O actual:                   %OS% 
echo Fecha actual:                 %DATE% 
echo Hora actual:                  %TIME%    
echo Nombre del equipo:            %COMPUTERNAME% 
echo Nombre del usuario:           %USERNAME% 	
echo.RPA Ejecuta Bots...


echo.RPA - Ejecuta fondos Pension...
Call fondosPension.bat


echo.RPA - Ejecuta valor Moneda...
Call valorMoneda.bat

echo off