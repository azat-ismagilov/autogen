# ruff: noqa

from PIL import Image, ImageDraw, ImageFont
from enum import Enum
import math
import argparse


def get_ordinal(n: int) -> str:
    ord = "th"
    if n % 10 == 1 and n % 100 != 11:
        ord = "st"
    elif n % 10 == 2 and n % 100 != 12:
        ord = "nd"
    elif n % 10 == 3 and n % 100 != 13:
        ord = "rd"
    return ord


class Easing(Enum):
    EASE_IN_OUT_QUAD = "easeInOutQuad"
    EASE_IN_OUT_SIN = "easeInOutSin"


def interpolate(
    value: float,
    range_values: list[float],
    output_range: list[float],
    easing: Easing | None = None,
) -> float:
    if len(range_values) != len(output_range):
        raise ValueError("Range and output_range must have the same length")

    if value <= range_values[0]:
        return output_range[0]
    elif value >= range_values[-1]:
        return output_range[-1]

    for i in range(len(range_values) - 1):
        if range_values[i] <= value <= range_values[i + 1]:
            t = (value - range_values[i]) / (range_values[i + 1] - range_values[i])
            if easing == Easing.EASE_IN_OUT_QUAD:
                t = t * t * (3 - 2 * t)
            elif easing == Easing.EASE_IN_OUT_SIN:
                t = 0.5 - 0.5 * math.cos(t * math.pi)
            return output_range[i] + t * (output_range[i + 1] - output_range[i])

    raise ValueError("Value is outside the specified range")


def render_frame(
    title: str,
    subtitle: str,
    hashtag: str,
    logoPath: str,
    task: str,
    time: int,
    outcome: str,
    success: bool,
    rankBefore: int,
    rankAfter: int,
    color: str,
    animationStart: int,
    frame: int,
    fps: int,
) -> Image.Image:
    opacityOut = interpolate(frame, [animationStart - 10, animationStart + 5], [1, 0])

    realtime = time + min(frame - animationStart, 0) / fps * 1000

    hours = int(realtime / (60 * 60 * 1000))
    minutes = int((realtime % (60 * 60 * 1000)) / (60 * 1000))
    seconds = int((realtime % (60 * 1000)) / 1000)
    timer = f"{hours:02d}:{minutes:02d}:{seconds:02d}"

    place = round(
        interpolate(
            frame,
            [animationStart - 20, animationStart],
            [rankBefore, rankAfter],
        )
        if success
        else interpolate(
            frame,
            [animationStart - 30, animationStart - 10, animationStart - 4],
            [rankBefore, 1, rankBefore],
        )
    )

    image = Image.new("RGB", (1920, 1080), color)
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype("arial.ttf", 40)
    draw.text(
        (100, 100),
        f"{place}{get_ordinal(place)} place",
        font=font,
        fill=(255, 255, 255),
    )

    logo = Image.open(logoPath)
    image.paste(logo, (200, 200))

    return image


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--title", default="Default Title", help="Title of the frame")
    parser.add_argument(
        "--subtitle", default="Default Subtitle", help="Subtitle of the frame"
    )
    parser.add_argument(
        "--hashtag", default="Default Hashtag", help="Hashtag of the frame"
    )
    parser.add_argument("--logoPath", default="logo.png", help="Path to the logo image")
    parser.add_argument("--task", default="Default Task", help="Task description")
    parser.add_argument("--time", type=int, default=0, help="Time in milliseconds")
    parser.add_argument(
        "--outcome", default="Default Outcome", help="Outcome description"
    )
    parser.add_argument("--success", type=bool, default=False, help="Success flag")
    parser.add_argument(
        "--rankBefore", type=int, default=0, help="Rank before animation"
    )
    parser.add_argument("--rankAfter", type=int, default=0, help="Rank after animation")
    parser.add_argument("--color", default="black", help="Background color")
    parser.add_argument(
        "--animationStart",
        type=int,
        default=0,
        help="Frame number when animation starts",
    )
    parser.add_argument("--frame", type=int, default=0, help="Current frame number")
    parser.add_argument("--fps", type=int, default=30, help="Frames per second")

    args = parser.parse_args()

    frame_image = render_frame(
        args.title,
        args.subtitle,
        args.hashtag,
        args.logoPath,
        args.task,
        args.time,
        args.outcome,
        args.success,
        args.rankBefore,
        args.rankAfter,
        args.color,
        args.animationStart,
        args.frame,
        args.fps,
    )

    frame_image.save(f"frame_{args.frame}.png")
