@echo off
chcp 65001 > nul
 
if "%BACKEND_URL%"=="" echo Backend url is not set. Please set using `set BACKEND_URL=http://icpclive.backend.host.and.optional.port` ^
  && exit 1

set RUN_ID=%1
set OUTPUT_VIDEO_FILE=out/video_%RUN_ID%.mp4

echo Render reaction video for run %RUN_ID% from %BACKEND_URL%
call python load_data.py "%BACKEND_URL%" %RUN_ID% ^
  && call npx remotion render ReactionVideo --video-bitrate 2000k --props "%OUTPUT_VIDEO_FILE%" -o ^
  && echo Reaction video saved to %OUTPUT_VIDEO_FILE%