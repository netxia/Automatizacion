Set WshShell = WScript.CreateObject("WScript.Shell")
Return = WshShell.Run("cmd.exe /C forever node index.js", 0, true)