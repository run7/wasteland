#!/usr/bin/env python
# -*- coding: utf8 -*-

import sys
import chardet
import aeidon

def corrent_chs_symbol(text):
    lines = text.split('\n');

    if len(lines) != 2:
        return text

    chs, eng = lines
    chs = chs.replace('...', '……')
    chs = chs.replace('.', '。')
    chs = chs.replace(',', '，')
    chs = chs.replace('!', '！')
    chs = chs.replace(':', '：')
    chs = chs.replace('?', '？')
    chs = chs.replace('(', '（')
    chs = chs.replace(')', '）')

    return '\n'.join([chs, eng])

def main():
    filename = sys.argv[1]

    encoding = chardet.detect(open(filename).read())['encoding']
    project = aeidon.Project()
    project.open_main(filename, encoding)

    for subtitle in project.subtitles:
        text = subtitle.main_text.encode('UTF-8')
        subtitle.main_text = corrent_chs_symbol(text).decode('UTF-8')

    project.save_main()

if __name__ == '__main__':
    main()

