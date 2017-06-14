#!/usr/bin/python
# -*- coding: utf-8 -*-

import re
from argparse import ArgumentParser

class Reg:

    # GlobalSetting
    timeout = re.compile('^timeout (.+)', re.IGNORECASE | re.MULTILINE)
    menu_color_sel = re.compile(
        '^menu color sel (.+)', re.IGNORECASE | re.MULTILINE)

    # Menuitem
    label = re.compile('^\s*label ', re.IGNORECASE | re.MULTILINE)
    menu_label = re.compile('^\s*menu label (.+)', re.IGNORECASE | re.MULTILINE)
    kernel = re.compile('^\s*kernel (.+)', re.IGNORECASE | re.MULTILINE)
    append = re.compile('^\s*append (.+)', re.IGNORECASE | re.MULTILINE)
    text_help = re.compile(
        '^\s*text help(.+?)endtext', re.IGNORECASE | re.DOTALL | re.MULTILINE)
    localboot = re.compile('^\s*localboot (.+)', re.IGNORECASE | re.MULTILINE)
    initrd = re.compile('initrd=(.+?) ', re.IGNORECASE)

class GlobalSetting:

    def __init__(self, lines):
        self.lines = lines
        self.text = '\n'.join(self.lines)
        self.isolinux = {}

        self.create_entries()

    def create_entries(self):
        names = ['timeout', 'menu_color_sel']
        for name in names:
            reg = getattr(Reg, name)
            matches = reg.search(self.text)
            if matches is not None:
                self.isolinux[name] = matches.group(1)

    def output(self):
        text = []

        if 'timeout' in self.isolinux:
            timeout = self.isolinux['timeout']
            text.append('timeout %s' % timeout)

        if 'menu_color_sel' in self.isolinux:
            colors = self.isolinux['menu_color_sel'].split()
            foreground = colors[1][3:]
            background = colors[2][3:]
            text.append('foreground %s' % foreground)
            text.append('background %s' % background)

        text.append('default 1')

        return '\n'.join(text) + '\n'

class Menuitem:

    def __init__(self, lines, root='', number=None):
        self.lines = [line.strip() for line in lines]
        self.root = root.strip('/')
        self.number = number
        self.text = '\n'.join(self.lines)
        self.isolinux = {}

        self.create_isolinux()

    def create_isolinux(self):
        names = ['menu_label', 'text_help', 'kernel', 'append', 'localboot']
        for name in names:
            reg = getattr(Reg, name)
            matches = reg.search(self.text)
            if matches is not None:
                self.isolinux[name] = matches.group(1)

    def output(self):
        # title part
        menu_label = self.isolinux['menu_label']
        if 'text_help' in self.isolinux:
            help_text= self.isolinux['text_help'].strip().replace('\n', '\\n')
            title = 'title %s\\n%s' % (menu_label, help_text)
        else:
            title = 'title %s'  % menu_label

        if self.number is not None:
            number_title = 'title [%s] ' % str(self.number).zfill(2)
            title = title.replace('title ', number_title)

        # command part
        if 'kernel' in self.isolinux:
            kernel_file = self.isolinux['kernel'].strip('/')

            if 'append' in self.isolinux:
                isolinux_append = self.isolinux['append']
                matches = Reg.initrd.search(isolinux_append)
                if matches is None:
                    kernel_args = isolinux_append
                    command = 'kernel /%s/%s %s' % (
                        self.root, kernel_file, kernel_args)
                else:
                    kernel_args = isolinux_append.replace(matches.group(0), '')
                    initrd_file = matches.group(1).strip('/')
                    command = 'kernel /%s/%s %s\ninitrd /%s/%s' % (
                        self.root, kernel_file,
                        kernel_args, self.root, initrd_file)

            else:
                command = 'kernel /%s' % kernel_file
        elif 'append' in self.isolinux:
            isolinux_append = self.isolinux['append']
            kernel_file = isolinux_append.split()[0]
            isolinux_append = isolinux_append.replace(kernel_file + ' ', '')
            kernel_file = kernel_file.strip('/')

            matches = Reg.initrd.search(isolinux_append)
            if matches is None:
                kernel_args = isolinux_append
                command = 'kernel /%s/%s %s' % (
                    self.root, kernel_file, kernel_args)
            else:
                kernel_args = isolinux_append.replace(matches.group(0), '')
                initrd_file = matches.group(1).strip('/')
                command = 'kernel /%s/%s %s\ninitrd /%s/%s' % (
                    self.root, kernel_file,
                    kernel_args, self.root, initrd_file)

        elif 'localboot' in self.isolinux:
            localboot_string = self.isolinux['localboot']

            # convert the driver number '0x80' is harddisk, '0x00' is floppy
            if localboot_string.startswith('0x'):
                device_index = int(localboot_string, 16)
                if device_index < 128: # 0x80 is 128
                    device = '(fd%d)+1' % device_index
                elif device_index < 256: # 0x100 is 256
                    device = '(hd%d)+1' % (device_index - 128)
                else:
                    device = '(hd0)+1'
            else:
                device = '(hd0)+1'

            command = 'chainloader %s' % device
        else:
            command = 'root'

        command = command.replace('kernel //', 'kernel /')
        command = command.replace('initrd //', 'initrd /')
        return '\n'.join([title, command + '\n'])

class Sys2Grub:

    def __init__(self, menu_file, config=None):
        self.lines = open(menu_file).read().split('\n')
        if config is None:
            self.config = {}
        else:
            self.config = config
        self.parts = []
        self.global_setting = None
        self.menuitems = []

        self.init_parts()
        self.create_global_setting()
        self.create_menuitems()

    def init_parts(self):
        indexes = []

        for i, line in enumerate(self.lines):
            if Reg.label.search(line) is not None:
                indexes.append(i)

        self.parts.append(self.lines[:indexes[0]])

        for i in range(len(indexes) - 1):
            start = indexes[i]
            end = indexes[i + 1]
            self.parts.append(self.lines[start:end])

        self.parts.append(self.lines[indexes[-1]:])

    def create_global_setting(self):
        self.global_setting = GlobalSetting(self.parts[0])

    def create_menuitems(self):
        root = self.config.get('root', '/')
        number = self.config.get('number', False)

        if number:
            for i, part in enumerate(self.parts[1:], 1):
                self.menuitems.append(Menuitem(part, root, i))
        else:
            for part in self.parts[1:]:
                self.menuitems.append(Menuitem(part, root))

    def output(self):
        text = [self.global_setting.output()]
        title = self.config.get('title', "My Linux boot disk")
        text.append('title ### %s ###\nroot\n' % title)

        for menuitem in self.menuitems:
            text.append(menuitem.output())
        return '\n'.join(text)

def get_commandline_arguments():
    parser = ArgumentParser(description='isolinux menu to grub4dos menu')
    parser.add_argument('menu_file', help='isolinux menu file',
        metavar='menu_file', type=str)
    parser.add_argument('-n', '--number', help='append number in each title',
        default=False, action='store_true')
    parser.add_argument('-t', '--title', help='custom title',
        metavar='title', type=str, default="My Linux boot disk")
    parser.add_argument('-r', '--root', help='set the file path root',
        metavar='root', type=str, default='/')
    return parser

def main():
    args = get_commandline_arguments().parse_args().__dict__
    menu_file = args.pop('menu_file')
    print Sys2Grub(menu_file, args).output()

if __name__ == '__main__':
    main()
