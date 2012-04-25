#!/usr/bin/env python
#
#       iso2grub_gui.py
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

import gtk
import pango
import iso2grub_gui
import os
import gtk.glade
import gettext
APP_NAME="iso2grub"
LOCALE_DIR=os.path.abspath("locale")
if not os.path.exists(LOCALE_DIR):
    LOCALE_DIR="/usr/share/locale"
gtk.glade.bindtextdomain(APP_NAME, LOCALE_DIR)
gtk.glade.textdomain(APP_NAME)
gettext.bindtextdomain(APP_NAME, LOCALE_DIR)
gettext.textdomain(APP_NAME)
_ = gettext.gettext

class Gladewindow(iso2grub_gui.Mainwindow):

    def __init__(self):

        builder = gtk.Builder()
        builder.add_from_file("iso2grub.glade")
        
        # interactive widgets
        self.window1 = builder.get_object("window1")
        self.button_about = builder.get_object("button_about")
        self.button_exit = builder.get_object("button_exit")
        self.button_openfilepath = builder.get_object("button_openfilepath")
        self.entry_openfilepath = builder.get_object("entry_openfilepath")
        self.entry_savefilepath = builder.get_object("entry_savefilepath")
        self.button_savefilepath = builder.get_object("button_savefilepath")
        self.checkbutton_number = builder.get_object("checkbutton_number")
        self.checkbutton_redirect = builder.get_object("checkbutton_redirect")
        self.entry_redirect = builder.get_object("entry_redirect")
        self.checkbutton_splash = builder.get_object("checkbutton_splash")
        self.checkbutton_title = builder.get_object("checkbutton_title")
        self.entry_title = builder.get_object("entry_title")
        self.button_convert = builder.get_object("button_convert")
        self.button_save = builder.get_object("button_save")
        self.textview_result = builder.get_object("textview_result")
        self.textbuffer_result = builder.get_object("textbuffer_result")
        self.statusbar = builder.get_object("statusbar")
              
        # some properties that glade doesn't support, setup them here
        self.textview_result.modify_font(pango.FontDescription("Mono"))
        context_id = self.statusbar.get_context_id("step1")
        self.statusbar.push(context_id, _("Step 1: Open a isolinux file"))
        
        builder.connect_signals(self)
        self.window1.show_all()

        ### Variables for later use
        self.convert_option = iso2grub_gui.ConvertOption()
        self.Converted = False

if __name__ == "__main__":
    win = Gladewindow()
    gtk.main()
