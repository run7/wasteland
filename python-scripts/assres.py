#!/usr/bin/env python3
# -*- coding: utf8 -*-

# ----------
# change ass subtitle resolution.
# ----------

import os
import re
import sys
import aeidon


def text2nums(text, cast=float):
    nums = re.split('[^0-9.]+', text)
    return list(map(cast, nums))


def split_by_comma(text):
    return list(map(lambda k: k.strip(), text.split(',')))


class Scaler(object):

    def __init__(self, src_width, src_height,
                 dst_width, dst_height, dst_inner_height):
        self.src_width = src_width
        self.src_height = src_height
        self.dst_width = dst_width
        self.dst_height = dst_height
        self.dst_inner_height = dst_inner_height
        self.dst_margin = (dst_height - dst_inner_height) / 2

    def adjust_scalar(self, text, cast=int):
        size = float(text)
        return cast(size * self.dst_inner_height / self.src_height)

    def adjust_vector(self, text):
        x, y = text2nums(text)
        x = x * self.dst_width / self.src_width
        y = (y * self.dst_inner_height / self.src_height) + self.dst_margin
        return (x, y)

    def adjust_vector2(self, text):
        x1, y1, x2, y2 = text2nums(text)
        x1 = x1 * self.dst_width / self.src_width
        y1 = (y1 * self.dst_inner_height / self.src_height) + self.dst_margin
        x2 = x2 * self.dst_width / self.src_width
        y2 = (y2 * self.dst_inner_height / self.src_height) + self.dst_margin
        return (x1, y1, x2, y2)

    def adjust_vector3(self, text):
        x1, y1, x2, y2, t1, t2 = text2nums(text)
        x1 = x1 * self.dst_width / self.src_width
        y1 = (y1 * self.dst_inner_height / self.src_height) + self.dst_margin
        x2 = x2 * self.dst_width / self.src_width
        y2 = (y2 * self.dst_inner_height / self.src_height) + self.dst_margin
        return (x1, y1, x2, y2, t1, t2)


class ScalarEffect(object):

    def __init__(self, name):
        self.name = name
        self.reg = re.compile(r'\\%s([0-9]+)' % name)

    def adjust_text(self, scaler, text):
        return r'\%s%d' % (self.name, scaler.adjust_scalar(text))


class VectorEffect(object):

    def __init__(self, name):
        self.name = name
        self.reg = re.compile(r'\\%s\((.+?)\)' % name)

    def adjust_text(self, scaler, text):
        count = len(text2nums(text))
        if count == 2:
            nums = scaler.adjust_vector(text)
        elif count == 4:
            nums = scaler.adjust_vector2(text)
        else:
            nums = scaler.adjust_vector3(text)

        tpl = r'\%%s(%s)' % ', '.join(['%.2f'] * len(nums))
        values = [self.name]
        values.extend(nums)
        return tpl % tuple(values)

effects = [
    ScalarEffect('fs'),
    ScalarEffect('bord'),
    ScalarEffect('shad'),
    VectorEffect('pos'),
    VectorEffect('move'),
]


class Converter(object):

    playresx_reg = re.compile('^PlayResX: ?([0-9]+)', re.MULTILINE)
    playresy_reg = re.compile('^PlayResY: ?([0-9]+)', re.MULTILINE)

    def __init__(self, filename, dst_res):
        self.filename = filename
        self.dst_res = dst_res
        self.load_file()
        self.init_scaler()
        self.start_convert()
        self.change_header()
        self.save_file()

    def load_file(self):
        self.project = aeidon.Project()
        self.project.open_main(self.filename, 'UTF-8')

    def save_file(self):
        self.project.save_main()

    def init_scaler(self):
        src_width, src_height = (384, 288)

        header = self.project.main_file.header

        match = re.search(Converter.playresx_reg, header)
        if match:
            value = int(match.groups()[0])
            if value != 0:
                src_width = value

        match = re.search(Converter.playresy_reg, header)
        if match:
            value = int(match.groups()[0])
            if value != 0:
                src_height = value

        self.scaler = Scaler(src_width, src_height,
                             self.dst_res[0], self.dst_res[1], self.dst_res[2])

    def start_convert(self):
        print('Covnert %dx%d --> %dx%d' % (
              self.scaler.src_width, self.scaler.src_height,
              self.scaler.dst_width, self.scaler.dst_height))

        for subtitle in self.project.subtitles:
            subtitle.main_text = self.convert_entry(subtitle.main_text)

    def convert_entry(self, text):
        for effect in effects:
            for match in list(effect.reg.finditer(text)):
                adjuested = effect.adjust_text(self.scaler, match.groups()[0])
                text = text.replace(match.group(), adjuested)
        return text

    def change_header(self):
        header = self.project.main_file.header
        header = self.change_playres(header)
        header = self.change_style(header)
        self.project.main_file.header = header

    def change_playres(self, header):
        playresx_reg = Converter.playresx_reg
        playresy_reg = Converter.playresy_reg
        new_playresx = 'PlayResX: %s' % self.scaler.dst_width
        new_playresy = 'PlayResY: %s' % self.scaler.dst_height
        insert_after = 'ScriptType: v4.00+'

        match = playresy_reg.search(header)
        if match:
            header = header.replace(match.group(), new_playresy)
        else:
            replace = insert_after + os.linesep + new_playresy
            header = header.replace(insert_after, replace)

        match = playresx_reg.search(header)
        if match:
            header = header.replace(match.group(), new_playresx)
        else:
            replace = insert_after + os.linesep + new_playresx
            header = header.replace(insert_after, replace)
        return header

    def change_style(self, header):
        format_reg = re.compile('^Format: (.+)', re.MULTILINE)
        indexes = split_by_comma(format_reg.findall(header)[0])

        style_reg = re.compile('^Style: (.+)', re.MULTILINE)
        for match in list(style_reg.finditer(header)):
            new_style = self.change_style_entry(indexes, match.groups()[0])
            header = header.replace(match.group(), new_style)

        return header

    def change_style_entry(self, indexes, text):
        keys = [
            ('Fontsize', int),
            ('Outline', float),
            ('Shadow', int),
            ('MarginV', int),
        ]
        values = split_by_comma(text)
        for name, type in keys:
            i = indexes.index(name)
            value = self.scaler.adjust_scalar(values[i], type)
            if type is float:
                value = '%.2f' % value
            else:
                value = '%d' % value
            values[i] = value
        return 'Style: %s' % ','.join(values)


def usage():
    print('./assres ass_file width:height:inner_height')


def parse_args():
    args_len = len(sys.argv)
    if args_len < 2:
        return None

    filename = sys.argv[1]
    if args_len == 3:
        resolution = text2nums(sys.argv[2], int)
        if len(resolution) == 2:
            resolution.append(resolution[1])
    else:
        resolution = (1920, 1080, 1080)

    return filename, resolution


def main():
    args = parse_args()
    if args is None:
        usage()
        return
    Converter(*args)

if __name__ == '__main__':
    main()
