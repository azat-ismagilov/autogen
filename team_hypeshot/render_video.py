import glob
import os
import shutil
import logging
import re
import random
import torch
from typing import List
from PIL import Image
from iptcinfo3 import IPTCInfo
import json
import subprocess
from carvekit.api.high import HiInterface
from pathlib import Path

# Disable IPTCInfo logger
iptcinfo_logger = logging.getLogger('iptcinfo')
iptcinfo_logger.setLevel(logging.ERROR)


def get_iptc_instance(path):
    return IPTCInfo(path)


def try_decode(s):
    try:
        return s.decode()
    except:
        return ''


def find_photos_in_directory(dir) -> List:
    result = []
    for path in glob.glob(os.path.join(dir, '**/*'), recursive=True):
        if not path.lower().endswith(('.png', '.jpg', '.jpeg')):
            continue
        result.append(path)
    return result


def get_tags_from_photo(path) -> List[str]:
    info = get_iptc_instance(path)
    return [try_decode(s) for s in info['keywords']]


def rectangle_format(picasa_format):
    left, top, right, bottom = [int(picasa_format[i:i+4], 16) / 65535
                                for i in range(0, len(picasa_format), 4)]
    return left, top, right, bottom


for image_path in sorted(find_photos_in_directory("team_pictures")):
    print("Starting on", image_path)
    tags = get_tags_from_photo(image_path)

    names = []
    rectangles = []
    team_name = 'Unknown team'

    # Extract team names and face rectangles from tags
    for tag in tags:
        if tag.startswith("team$"):
            team_name = tag.removeprefix("team$")
        match = re.match(r'(.*)\(([a-f0-9]{16})\)', tag)
        if match:
            name, picasa_format = match.groups()

            if name == "":
                name = str(random.randint(1, 10000))
            names.append(name)
            rectangles.append(rectangle_format(picasa_format))

    # Open team image
    team_image = Image.open(image_path)
    cropped = []

    # Crop faces from the team image
    for name, rectangle in zip(names, rectangles):
        left, top, right, bottom = rectangle
        width, height = team_image.size
        left *= width
        top *= height
        right *= width
        bottom *= height

        face_width = right - left
        face_height = round(face_width * 1.1568943765281174)

        crop_padding_width = round(face_width * 1.2)

        cropped.append(team_image.crop((
            left - crop_padding_width,
            top - face_height * 2,
            right + crop_padding_width,
            bottom + face_height * 3
        )))

    print("Background removal started")

    # Initialize HiInterface for background removal
    interface = HiInterface(object_type="hairs-like",
                            batch_size_seg=5,
                            batch_size_matting=1,
                            device='cuda' if torch.cuda.is_available() else 'cpu',
                            seg_mask_size=320,
                            matting_mask_size=2048,
                            trimap_prob_threshold=231,
                            trimap_dilation=30,
                            trimap_erosion_iters=10,
                            fp16=False)

    # Remove background from team image and cropped faces
    images_without_background = interface([team_image] + cropped)

    print("Background removal finished")

    paths = []

    # Save the images without background
    for index, image in enumerate(images_without_background):
        path = f'photos/{index}.png'
        paths.append(path)
        image.save(Path("video/public")/path)

    colors = ['#1A63D8', '#95C0D4', '#DC8232', '#2C8170', '#8B3A3A']
    subtitles = ['cool person', 'very smart', 'young genius', 'fearless adventurer', 'master strategist', 'creative visionary', 'charismatic leader',
                 'unstoppable force', 'brilliant innovator', 'inspiring mentor', 'natural-born talent', 'exceptional problem solver', 'dynamic trailblazer']

    team = {
        'title': team_name,
        'subtitle': '#icpcwfdhaka',
        'path': paths[0]
    }
    participants = []
    for name, path in zip(names, paths[1:]):
        participants.append({
            'title': name,
            'subtitle': random.choice(subtitles),
            'path': path
        })
    data = {
        'team': team,
        'participants': participants[0:3],
        'color': random.choice(colors)
    }

    with open('video/public/team.json', "w") as file:
        json.dump(data, file)

    p = subprocess.Popen(["npm", "run", "build"], cwd="video", shell=True)
    p.wait()

    output_directory = Path('rendered_videos')

    os.makedirs(output_directory, exist_ok=True)
    output_video = Path(image_path).stem + '.mp4'
    shutil.move(Path('video/out/video.mp4'), output_directory/output_video)
