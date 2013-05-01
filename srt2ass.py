#!/usr/bin/env python
# -*- coding: utf8 -*-

# ----------
# Convert srt subtitle to a ass format.
# ----------

import sys
import chardet
import aeidon

header = '''[Script Info]
ScriptType: v4.00+
Collisions: Normal
PlayResX: 1920
PlayResY: 1080

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, BackColour, OutlineColour, Bold, Italic, Alignment, BorderStyle, Outline, Shadow, MarginL, MarginR, MarginV
Style: Default,WenQuanYi Micro Hei,54,&H00ffffff,&H00000000,&H00000000,0,0,2,1,2,0,20,20,140
Style: Alternate,WenQuanYi Micro Hei,36,&H00ffffff,&H00000000,&H00000000,0,0,2,1,2,0,20,20,104'''

def convert(input_filename, output_filename):

    # detect file encodings
    encoding = chardet.detect(open(input_filename).read())['encoding']

    # create aeidon project
    project = aeidon.Project()
    project.open_main(input_filename, encoding)

    # setup output format
    output_format = aeidon.files.new(aeidon.formats.ASS, output_filename, 'utf_8')
    output_format.header = header

    project.save_main(output_format)

def usage():
    print './srt2ass subtitle.srt'

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
