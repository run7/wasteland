#!/usr/bin/env python
#
#       iso2grub.py
#       
#       Copyright 2009 muzuiget <http://code.google.com/p/muzuiget-toolbox/>
#       
#       This program is free software; you can redistribute it and/or modify
#       it under the terms of the GNU General Public License as published by
#       the Free Software Foundation; either version 2 of the License, or
#       (at your option) any later version.
#       
#       This program is distributed in the hope that it will be useful,
#       but WITHOUT ANY WARRANTY; without even the implied warranty of
#       MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#       GNU General Public License for more details.
#       
#       You should have received a copy of the GNU General Public License
#       along with this program; if not, write to the Free Software
#       Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston,
#       MA 02110-1301, USA.

import sys
import getopt
import re
import os
import gettext
APP_NAME="iso2grub"
LOCALE_DIR=os.path.abspath("locale")
if not os.path.exists(LOCALE_DIR):
    LOCALE_DIR="/usr/share/locale"
gettext.bindtextdomain(APP_NAME, LOCALE_DIR)
gettext.textdomain(APP_NAME)
_ = gettext.gettext

def usage():
    print '''iso2grub is a python script to convert isolinux configfile "isolinux.cfg" to 
grub4dos configfile "menu.lst". There are a gui frontends "iso2grub_gui"
usage:
    iso2grub [options] file
options:
    -h  --help                  print this help
    -v  --version               print this script version
    -n  --number                print a index number for each title
    -s  --splash    <String>    convert the splash image file
    -t  --title     <String>    add a string as the menu first title
    -r  --redirect  <String>    redirect the boot file path
example:
    iso2grub.py isolinux.cfg > menu.lst
    iso2grub.py -n /mnt/boot/isolinux/isolinux.cfg > ~/menu.lst
    iso2grub.py -s ~ /mnt/boot/isolinux/isolinux.cfg > ~/menu.lst
    iso2grub.py -s . -r '/boot/grub' isolinux.cfg > menu.lst
    iso2grub.py -n -t 'My Linux Bootdisk Menu' isolinux.cfg > menu.lst
note:
    Redirect the result to a file after confirm.
    If you use "-s" option, You must have a "convert" command on your system,
you can find it in "imagemagick" package, check your distribution repository.
The argument "<String>" is a folder path, make sure it is writeable.'''
 
def version():
    print 'iso2grub 0.4 muzuiget <http://code.google.com/p/muzuiget-toolbox/>'

# default option, can change by command line arguments
PRINT_NUMBER = False
SPLASH_FOLDER = ''
REDIRECT_FOLDER = ''
INPUT_FILE = ''
MENU_TITLE = ''

def handleArgv():
    ''' handle commandline arguments, save the result to global variable'''
    global PRINT_NUMBER
    global SPLASH_FOLDER
    global REDIRECT_FOLDER
    global INPUT_FILE
    global MENU_TITLE

    # no arguments, print usage
    argv = sys.argv[1:]
    if len(argv) == 0:
        usage()
        sys.exit(2)

    try:
        short = 'hvns:t:r:'
        long = ['help', 'version', 'number', 'splash=', 'title=', 'redirect=']
        opts, args = getopt.getopt(argv, short, long)
    except getopt.GetoptError:
        usage()
        sys.exit(2)

    for opt, arg in opts:
        if opt in ('-h', '--help'):
            usage()
            sys.exit()
        elif opt in ('-v', '--version'):
            version()
            sys.exit()
        elif opt in ('-n', '--number'):
            PRINT_NUMBER = True
        elif opt in ('-s', '--splash'):
            SPLASH_FOLDER = arg
        elif opt in ('-t', '--title'):
            MENU_TITLE = arg
        elif opt in ('-r', '--redirect'):
            REDIRECT_FOLDER = arg
        #else:
            #assert False, "unhandled option"

    # no input file
    if len(args) == 0:
        usage()
        sys.exit(2)
    elif len(args) == 1:
        INPUT_FILE = args[0]
    elif len(args) > 1:
        print >> sys.stderr, _('Error: Current version can only convert a file once')
        sys.exit(2)

def handleFile(file):
    '''Handle isolinux.cfg file, and return a list object argument file 
is a file object and must be open outside, the function rerutn a tuple
settings dirctionary (global setting) and entries list (boot entry)'''

    # 'command regular expressions'
    reTimeout = re.compile(r'^timeout ', re.IGNORECASE)
    reMenuBg = re.compile(r'^menu background ', re.IGNORECASE)
    reColor = re.compile(r'^menu color sel', re.IGNORECASE)

    reDeafult = re.compile(r'^default /?', re.IGNORECASE)
    reLabel = re.compile(r'^label ', re.IGNORECASE)
    reMenuLabel = re.compile(r'^menu label ', re.IGNORECASE)
    reKernel = re.compile(r'^kernel /?', re.IGNORECASE)
    reAppend = re.compile(r'^append', re.IGNORECASE)
    LocalBoot = re.compile(r'^localboot ', re.IGNORECASE)
    reTextHelp = re.compile(r'^text help', re.IGNORECASE)
    reEndText = re.compile(r'^endtext', re.IGNORECASE)
    reInitrd = re.compile(r'^initrd=/?', re.IGNORECASE)
 
    # entries list container 
    settings = {}   # global command settings
    entry = {}      # each entry (or title in grub4dos)
    entries = []    # the list of entry
    default = ''    # default label

    # handle the line
    while True:
        line = file.readline()
        # EOF
        if len(line) == 0:
            break

        # remove the leading whitespace
        line = line.strip()

        # isolinux global setting

        # 'timeout'
        if reTimeout.search(line):
            settings['timeout'] = reTimeout.sub('', line) 
            continue

        # 'menu background'
        if reMenuBg.search(line):
            settings['splash'] = reMenuBg.sub('', line) 
            continue

        # 'menu color sel'
        if reColor.search(line):
            colors = reColor.sub('', line) 
            settings['background'] = colors.split()[1][3:]
            settings['foreground'] = colors.split()[2][3:]
            continue

        # boot entry commands

        # 'default' command
        if reDeafult.search(line):
            default = reDeafult.sub('', line) 
            continue

        # 'label' command
        if reLabel.search(line):
            # if entry is not empty, append it to entries list
            if bool(entry):
                entries.append(entry)

            # create a new entry
            entry = {}
            entry['label'] = reLabel.sub('', line) 
            entry['title'] = '%s\n' % entry['label']
            continue

        # 'menu label' command 
        if reMenuLabel.search(line):
            entry['title'] = '%s\n' % reMenuLabel.sub('', line)
            continue

        # 'kernel' command
        if reKernel.search(line):
            entry['command'] = reKernel.sub('kernel /', line)
            continue

        # 'append' command
        if reAppend.search(line):
            line = reAppend.sub('', line)

            # check if have kernel command existed
            if not 'command' in entry:
                # construct commands from label key
                entry['command'] = 'kernel /%s' % default
                entry['title'] = 'Deafult Setting\n'

            # find the initrd position
            start = line.find('initrd')
            end = line.find(' ', start)
            if start == 1 and end == -1:
                # initrd is the only parameter
                initrd = reInitrd.sub('initrd /', 'initrd')
                entry['command'] += '\n%s' % initrd
            else:
                if end == -1:
                    # initrd is the last parameter
                    initrd = line[start:]
                    line = line.replace(' ' + initrd, '')
                    initrd = reInitrd.sub('initrd /', initrd) + '\n'
                else:
                    # initrd is not the last parameter
                    initrd = line[start:end]
                    line = line.replace(' ' + initrd, '')
                    initrd = reInitrd.sub('initrd /', initrd) + '\n'
                entry['command'] = removeNewline(entry['command'])
                entry['command'] += '%s\n%s' % (line, initrd)
            continue

        # 'localboot' command
        if LocalBoot.search(line):
            dev = LocalBoot.sub('', line)
            if len(dev) == 4:
                # convert the driver number '0x80' is harddisk, '0x00' is floppy
                if dev[2] == '0':
                    dev = '(fd%s)+1' % dev[3]
                else:
                    # dev[2] == '8'
                    dev = '(hd%s)+1' % dev[3]
            else:
                dev = '(hd0)+1'
            entry['command'] = 'chainloader %s\n' % dev 

        # 'text help' command
        if reTextHelp.search(line):
            help = ''
            while True:
                line = file.readline()
                # EOF, should not happen
                if len(line) == 0:
                    break
                # find a new label, also should not happen
                if reLabel.search(line):
                    break
                # 'endtext'
                if reEndText.search(line):
                    break

                line = line.strip()
                help += '%s\\n' % line

            # append help text to title command
            help = formatHelp(help)
            entry['title'] = removeNewline(entry['title'])
            entry['title'] += '%s\n' % help

    # append the last entry
    if bool(entry):
        entries.append(entry)

    return settings, entries 

def removeNewline(line):
    '''remove the newline character'''
    if line.endswith('\r\n'):
        # dos format
        newline = line.replace('\r\n', '')
    elif line.endswith('\n'):
        # unix format
        newline = line.replace('\n', '')
    else:
        # mac format
        newline = line.replace('\r', '')
    return newline

def formatHelp(help):
    '''format the help make it look better in grub4dos'''
    # grub4dos interface width is 80, 3 char for border
    width = 77
    # grub4dos only can display 4 help lines, 2 case
    # 1. if more than 4 lines 
    # such as slax, each line is short, so join each line in oneline
    # and wrap them each 77 characters; blank line to a newline
    # 2. if less than 4 lines (most case)
    # such as parted magic , just print them
    # and hope each line not longer than 77 characters 
    # it is bother I don't want to do any more

    helpList = help.split('\\n')
    # last oboject in helpList is empty, ingron it
    helpList = helpList[:-1]
    newHelp = ''

    if len(helpList) > 4:
        # more than 4 lines
        # join lines together
        for line in helpList:
            # blank line to a new line
            if len(line) == 0:
                newHelp += '\\n'
                continue
            newHelp += line + ' '
        # Split again, this time should less than 4 lines
        helpList = newHelp.split('\\n')
        newHelp = ''
        # wrap them each for specify width
        for line in helpList:
            if len(line) <= width:
                newHelp += '\\n %s' % line
            else:
                newHelp += breakline(line, width)
    else:
        # less than 4 lines
        for line in helpList:
            if len(line) == 0:
                # remove blank line
                continue
            newHelp += '\\n %s' % line

    return newHelp

def breakline(line, width):
    '''break the line in specify width'''
    start = 0
    newline = ''
    lenght = len(line)
    while (lenght - start) > 0:
        end = start + width
        # do no break the word, find the space
        if end < lenght:
            while (not line[end].isspace()) and (end > 0):
                end -= 1
        # the end position is space, so break from next word 
        end += 1
        newline += '\\n %s' % line[start:end]
        start = end
    return newline

if __name__ == '__main__':

    # get argument from commandline
    handleArgv()

    # open the files on disk
    try:
        file = open(INPUT_FILE, 'r')
    except IOError:
        print >> sys.stderr, _('Error: Could not open the file, does the filename correct ?')
        sys.exit(2)
 
    # handle the file, return a tuple
    settings, entries = handleFile(file)

    # convert the splash image
    convertFinish = False
    if SPLASH_FOLDER and 'splash' in settings:
        splash_name = os.path.basename(settings['splash'])
        splash_folder = os.path.dirname(os.path.abspath(INPUT_FILE))
        splashpath = '%s/%s' % (splash_folder, splash_name)
        splashopath = '%s/splash.xpm' % SPLASH_FOLDER
        # check image file and  convert command whether exist
        if os.path.exists(splashopath):
            # if converted, skip it
            convertFinish = True
        elif os.path.exists(splashpath): 
            convert = 'convert %s -resize 640x480 -colors 14 -depth 8 %s' % (splashpath, splashopath)
            if os.system(convert) == 0:
                convertFinish = True
                settings['splash'] = '%s/splash.xpm' % os.path.split(settings['splash'])[0]
            else:
                print >> sys.stderr, _('Error: Could not convert the splash image')
        else:
            print >> sys.stderr, _('Error: Could not find splash image, output folder or convert command')

    # redirect folder
    if len(REDIRECT_FOLDER) != 0:
        # remove the leading '/' character
        if REDIRECT_FOLDER.startswith('/'):
            REDIRECT_FOLDER = REDIRECT_FOLDER[1:]

        # repace the splash path
        if convertFinish:
            splash = os.path.split(settings['splash'])[1]
            settings['splash'] = '/%s/%s' % (REDIRECT_FOLDER, splash)

        # replace the path each entry
        for i in range(len(entries)):
            entry = entries[i]
            path = entry['command'].splitlines()
            # get the kernel file name, remove path
            kn = 'kernel %s' % '/'.join(path[0].split()[1].split('/')[:-1])
            path[0] = path[0].replace(kn, 'kernel /%s' % REDIRECT_FOLDER)
            # have initrd command ?
            if len(path) < 2:
                entry['command'] = '%s\n' % path[0]
            else:
                # get the initrd file name, remove path
                ig = 'initrd %s' % '/'.join(path[1].split()[1].split('/')[:-1])
                path[1] = path[1].replace(ig, 'initrd /%s' % REDIRECT_FOLDER)
                # join back
                entry['command'] = '%s\n' % '\n'.join([path[0], path[1]])

    # custom title
    if len(MENU_TITLE) != 0:
        MENU_TITLE += '\n'
        titleEntry = {'title':MENU_TITLE, 'command':'root\n'}
        entries.insert(0, titleEntry)

    # grub4dos global command
    print '# grub4dos global command'
    print 'default 1'
    # timeout
    if settings['timeout'].isdigit():
        print 'timeout %s' % settings['timeout']
    # splash
    if convertFinish:
        print 'splashimage %s/splash.xpm' % os.path.dirname(settings['splash'])
        # if have color command
        if 'foreground' in settings:
            print 'foreground %s' % settings['foreground']
        if 'background' in settings:
            print 'background %s' % settings['background']
    print

    # print the entries list content
    for i in range(len(entries)):
        entry = entries[i]
        if PRINT_NUMBER:
            print 'title [%02d] %s' % (i, entry['title']),
        else:
            print 'title %s' % entry['title'],

        print entry['command']

    # close the file
    file.close()

    sys.exit()
