#!/usr/bin/env python3
# -*- coding: utf8 -*-

# ----------
# Merge two subtitles to a ass file.
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


def merge_subtitles(in_filename1, in_filename2, out_filename):
    # create aeidon project
    project1 = aeidon.Project()
    project2 = aeidon.Project()
    project1.open_main(in_filename1, 'UTF-8')
    project2.open_main(in_filename2, 'UTF-8')

    # setup output format
    out_format = aeidon.files.new(aeidon.formats.ASS, out_filename, 'utf_8')
    out_format.header = header.strip()

    # motify event entries
    for subtitle in project1.subtitles:
        subtitle.main_text = subtitle.main_text.replace('\n', ' ')
    for subtitle in project2.subtitles:
        subtitle.main_text = subtitle.main_text.replace('\n', ' ')
        subtitle.ssa.style = 'Alternate'

    project1.subtitles.extend(project2.subtitles)
    project1.save_main(out_format)


def usage():
    print('./merge-subtitles sub1_file sub2_file out.ass')


def main():
    if len(sys.argv) != 4:
        usage()
    else:
        merge_subtitles(*sys.argv[1:])


if __name__ == '__main__':
    main()
