#!/usr/bin/env python3
# -*- coding: utf8 -*-

# ----------
# Convert srt subtitle to a ass format.
# ----------

import sys
import aeidon

header = '''
[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,WenQuanYi Micro Hei,54,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0.00,0.00,1,2.00,0.00,2,30,30,120,0
Style: Alternate,WenQuanYi Micro Hei,36,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0.00,0.00,1,2.00,0.00,2,30,30,84,0
Style: Danmaku,WenQuanYi Micro Hei,32,&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,0,0,0,0,100,100,0.00,0.00,1,1.00,0.00,2,30,30,30,0
'''


def convert(input_filename, output_filename):

    # create aeidon project
    project = aeidon.Project()
    project.open_main(input_filename, 'UTF-8')

    # setup output format
    output_format = aeidon.files.new(aeidon.formats.ASS,
                                     output_filename, 'utf_8')
    output_format.header = header.strip()

    project.save_main(output_format)


def usage():
    print('./srt2ass subtitle.srt')


def main():
    if len(sys.argv) != 2:
        usage()
        return

    input_filename = sys.argv[1]
    if input_filename.endswith('.ass'):
        output_filename = input_filename
    elif input_filename.endswith('.srt'):
        output_filename = input_filename[:-4] + '.ass'
    else:
        output_filename = input_filename + '.ass'
    convert(input_filename, output_filename)


if __name__ == '__main__':
    main()
