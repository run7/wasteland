#!/usr/bin/env python
# -*- coding: utf8 -*-

# ----------
# Merge two subtitles to a ass file.
# ----------

import sys
import chardet
import aeidon

header = """[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, BackColour, OutlineColour, Bold, Italic, Alignment, BorderStyle, Outline, Shadow, MarginL, MarginR, MarginV
Style: Default,WenQuanYi Micro Hei,54,&H00ffffff,&H00000000,&H00000000,0,0,2,1,2,0,20,20,140
Style: Alternate,WenQuanYi Micro Hei,36,&H00ffffff,&H00000000,&H00000000,0,0,2,1,2,0,20,20,104"""

def merge_subtitles(in_filename1, in_filename2, out_filename):
    # detect file encodings
    encoding1 = chardet.detect(open(in_filename1).read())['encoding']
    encoding2 = chardet.detect(open(in_filename2).read())['encoding']

    # create aeidon project
    project1 = aeidon.Project()
    project2 = aeidon.Project()
    project1.open_main(in_filename1, encoding1)
    project2.open_main(in_filename2, encoding2)

    # setup output format
    out_format = aeidon.files.new(aeidon.formats.ASS, out_filename, "utf_8")
    out_format.header = header

    # motify event entries
    for subtitle in project1.subtitles:
        subtitle.main_text = subtitle.main_text.replace('\n', ' ')
    for subtitle in project2.subtitles:
        subtitle.main_text = subtitle.main_text.replace('\n', ' ')
        subtitle.ssa.style = 'Alternate'

    project1.subtitles.extend(project2.subtitles)
    project1.save_main(out_format)

def usage():
    print './merge-subtitles sub1_file sub2_file out.ass'

def main():
    if len(sys.argv) != 4:
        usage()
    else:
        merge_subtitles(*sys.argv[1:])

if __name__ == '__main__':
    main()
