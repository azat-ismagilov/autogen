@echo off
(
  for %%i in (*.jpg) do (echo file '%%i'
echo duration 5 )) > images.txt
