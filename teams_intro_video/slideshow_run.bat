ffmpeg -f concat -safe 0 -i images.txt -vf "crop=min(in_w\,in_h*16/9):min(in_h\,in_w*9/16):0:0,scale=1920:1080" -t 5000000 -c:v libx264 -r 60 -pix_fmt yuv420p slideshow.mp4
