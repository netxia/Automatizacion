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
echo.RPA Valor Moneda ...

echo off

C:\RPA\UiPath\app-19.9.0\UiRobot.exe -file "C:\Users\rbriones\Documents\UiPath\valorMoneda\indicadoresDiarios.xaml"
