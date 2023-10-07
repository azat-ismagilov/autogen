# Team video

## Getting started

Requires python 3.9, sorry about that.

```
python39 -m pip install -r requirements.txt --extra-index-url https://download.pytorch.org/whl/cpu

cd src
npm ci
``` 


## Running

```
python39 render_video.py
```

Put photo with tags into team_pictures folder. Then, install all dependencies for and run ```render_video.py```. 

This script will generate images of participants without background in ```video/public/photos```, and put metadata into ```video/public/team.json```. Then, it will start rendering.