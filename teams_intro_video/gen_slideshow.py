import cv2
import numpy as np
import os
import math
import argparse
import sys

def create_frame(images, width, height, cols, rows, zoom=1):
    if (len(images) != cols*rows):
      print ("assert len(images) != cols*rows", len(images), cols, rows)
      exit
        
    w = width//cols
    h = height//rows
    original_h, original_w, _  = images[0].shape
    scale = max(w/original_w, h/original_h)
    frame = np.zeros((height, width, 3), dtype=np.uint8)
    for i, img in enumerate(images):
        img = cv2.resize(img, (int(original_w*scale*zoom),int(original_h*scale*zoom)), cv2.INTER_AREA)
        intermediate_h, intermediate_w, _ = img.shape
        r, c = divmod(i, cols)
        x_offset = int((intermediate_w - w)//2) 
        y_offset = 0 
        img = img[y_offset:y_offset+h, x_offset:x_offset + w]
        frame[r*h:(r+1)*h, c*w:(c+1)*w] = img
    
    return frame                                                                                         

def generate_section(output_path, photos, width, height, cols, rows, time, zoom=1, fps=30):  
#    print ("generating ", output_path, photos, width, height, cols, rows, time, zoom, fps)
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(output_path, fourcc, fps, (width, height))
    for i in range (0, len(photos), cols*rows):
        print (int(i/len(photos)*10))
        imgs = [cv2.imread(photos[j]) for j in range (i, i+cols*rows)]
        frame = create_frame(imgs, width, height, cols, rows)
        for t in range(fps * time):
            if (zoom != 1):
                frame = create_frame(imgs, width, height, cols, rows, t/(fps*time)*(zoom-1)+1)
            out.write(frame)
    out.release()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Advanced slideshow for team photos.")
    parser.add_argument("--source", default="input.txt", help=".txt file with the list of photos in correct order")
    parser.add_argument("-s", "--script", action='store_true', help="read input file as script")
    parser.add_argument("-o", "--output-file", default="output.mp4", help="Output file, default output.mp4")
    parser.add_argument("-x", "--width", type=int, default=1920, help="Target width")
    parser.add_argument("-y", "--height", type=int, default=1080, help="Target height")
    parser.add_argument("-c", "--cols", type=int, default=1, help="Target number of columns")
    parser.add_argument("-t", "--time", type=int, default=2, help="Duration of each shot")
    parser.add_argument("-r", "--rows", type=int, default=1, help="Target number or rows")
    parser.add_argument("-z", "--zoom", type=float, default=1.0, help="Zoom speed")
    parser.add_argument("-fps", "--framerate", type=int, default="30", help="Framerate")

    args = parser.parse_args()
    print (args)

    if (args.script):
        with open(args.source, "r") as file:
            script = [line.strip() for line in file]
        pics = []
        index = 0
        folder = args.source.split(".")[0]
        try:
            os.mkdir(folder) 
        except Exception as e:
            pass
        for line in script:
            if line == "": continue
            if line.startswith("-") and (len(pics)!=0) :
                #execute
                print ("executing", len(pics))
                result = generate_section(folder+"/"+str(index)+".mp4", pics, args.width, args.height, args.cols, args.rows, args.time, args.zoom, args.framerate)
                index = index + 1
                pics = []
            if line.startswith("-"):
                #apply new settings
                args = parser.parse_args(line.split())
                print ("config loaded", args)
                continue
            pics.append(line)
        result = generate_section(folder+"/"+str(index)+".mp4", pics, args.width, args.height, args.cols, args.rows, args.time, args.zoom, args.framerate)

    else:
        with open(args.source, "r") as file:
            pics = [line.strip() for line in file]       
    #    try:
        result = generate_section(args.output_file, pics, args.width, args.height, args.cols, args.rows, args.time, args.zoom, args.framerate)
        print(result)
#    except Exception as e:
#        print(f"Error: {e}", file=sys.stderr)
#        sys.exit(1)


#    generate_section("output1.mp4", [f"photos/Team-{j:03d}.jpg" for j in range (1,9)], 1920, 1080, 1, 1, 2)
#    generate_section("output2.mp4", [f"photos/Team-{j:03d}.jpg" for j in range (9,41)], 1920, 1080, 2, 2, 2)
#    generate_section("output3.mp4", [f"photos/Team-{j:03d}.jpg" for j in range (41,137)], 1920, 1080, 2, 2, 1, 1.2)
#    generate_section("output4.mp4", [f"photos/Team-{j:03d}.jpg" for j in range (41,137)], 1080, 1920, 1, 3, 1, 1.2)