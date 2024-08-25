import os
import shutil
from pathlib import Path
import subprocess
import argparse
import json


def render_video(config_directory, filename):
    id = filename.removeprefix("config_").removesuffix(".json")
    print(f"Rendering {id}...")
    props_path = config_directory / filename
    output_path = Path(".") / "tmp" / "output_{id}"
    with open(props_path) as f:
        props = json.load(f)
    render_command = [
        "npx",
        "remotion",
        "render",
        "ReactionCardOnly",
        output_path,
        f"--props={props_path}",
        "--enable-multi-process-on-linux",
        "--image-format=png",
        "--sequence" "--concurrency=1",
    ]
    subprocess.run(render_command, stdout=subprocess.DEVNULL)
    processed_directory = config_directory / "processed"
    os.makedirs(processed_directory, exist_ok=True)
    shutil.move(config_directory / filename, processed_directory / filename)
    print(f"Rendered {id}.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("config_directory", help="Path to the configuration directory")
    parser.add_argument("filename", help="Name of the file to render")
    args = parser.parse_args()
    render_video(Path(args.config_directory), args.filename)
