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
import os
import gettext
APP_NAME="iso2grub"
LOCALE_DIR=os.path.abspath("locale")
if not os.path.exists(LOCALE_DIR):
    LOCALE_DIR="/usr/share/locale"
gettext.bindtextdomain(APP_NAME, LOCALE_DIR)
gettext.textdomain(APP_NAME)
_ = gettext.gettext

class Mainwindow(gtk.Window):

    def __init__(self):

        ### setup window ###
        gtk.Window.__init__(self, gtk.WINDOW_TOPLEVEL)
        self.set_title("iso2grub_gui")
        self.set_default_size(640, 480)
        self.set_position(gtk.WIN_POS_CENTER)
        self.connect("destroy", self.destroy)

        vbox = gtk.VBox();

        ### actions frame ###
        frame_actions = gtk.Frame(_("Actions"))
        actions_table = gtk.Table(4, 2)
        actions_table.set_col_spacings(5)
        actions_table.set_border_width(3)

        self.entry_openfilepath = gtk.Entry()
        self.button_openfilepath = gtk.Button(_("Browse"))
        self.button_about = gtk.Button(_("About"))
        self.entry_savefilepath = gtk.Entry()
        self.button_savefilepath = gtk.Button(_("Browse"))
        self.button_exit = gtk.Button(_("Exit"))
        self.entry_openfilepath.set_editable(False)
        self.entry_savefilepath.set_editable(False)
        self.entry_savefilepath.set_sensitive(False)
        self.button_savefilepath.set_sensitive(False)

        # event connect
        self.button_about.connect("clicked", self.button_about_clicked)
        self.button_exit.connect("clicked", self.button_exit_clicked)
        self.button_openfilepath.connect("clicked", self.button_openfilepath_clicked)
        self.button_savefilepath.connect("clicked", self.button_savefilepath_clicked)

        # do layout
        actions_table.attach(gtk.Label(_("Open File:")), 0, 1, 0, 1, gtk.FILL)
        actions_table.attach(self.entry_openfilepath, 1, 2, 0, 1, gtk.EXPAND | gtk.FILL)
        actions_table.attach(self.button_openfilepath, 2, 3, 0, 1, gtk.FILL)
        actions_table.attach(self.button_about, 3, 4, 0, 1, gtk.FILL)
        actions_table.attach(gtk.Label(_("Save File:")), 0, 1, 1, 2, gtk.FILL)
        actions_table.attach(self.entry_savefilepath, 1, 2, 1, 2, gtk.EXPAND | gtk.FILL)
        actions_table.attach(self.button_savefilepath, 2, 3, 1, 2, gtk.FILL)
        actions_table.attach(self.button_exit, 3, 4, 1, 2, gtk.FILL)
        frame_actions.add(actions_table)

        ### options frame ###
        frame_options = gtk.Frame(_("Options"))
        options_table = gtk.Table(4, 2)
        options_table.set_col_spacings(5)
        options_table.set_border_width(3)

        self.checkbutton_number = gtk.CheckButton(_("Print title number"))
        self.checkbutton_number.set_tooltip_text(
_('''If it checked, print a index number for each title.
title menu1 --> title [01] menu1'''))
        self.checkbutton_redirect = gtk.CheckButton(_("Redirect the folder path:"))
        self.checkbutton_redirect.set_tooltip_text(
_('''If it checked, redirect the boot file path.
kernel /vmlinuz --> kernel /grub/vmlinuz'''))
        self.entry_redirect = gtk.Entry()
        self.entry_redirect.set_text("/grub")
        self.button_convert = gtk.Button(_("Convert"))
        self.checkbutton_splash = gtk.CheckButton(_("Convert splash image"))
        self.checkbutton_splash.set_tooltip_text(
_('''If it checked, convert the splash image file.
it will save in the same folder with the menu file.
you must have a "convert" command on your system.'''))
        self.checkbutton_title = gtk.CheckButton(_("Custom menu first title:"))
        self.checkbutton_title.set_tooltip_text(
_('''If it checked, add a string as the menu first title.'''))
        self.entry_title = gtk.Entry()
        self.entry_title.set_text(_("My Linux Bootdisk"))
        self.button_save = gtk.Button(_("Save"))
        self.entry_redirect.set_sensitive(False)
        self.button_convert.set_sensitive(False)
        self.entry_title.set_sensitive(False)
        self.button_save.set_sensitive(False)

        self.checkbutton_number.connect("toggled", self.checkbutton_number_toggled)
        self.checkbutton_redirect.connect("toggled", self.checkbutton_redirect_toggled)
        self.entry_redirect.connect("changed", self.entry_redirect_changed)
        self.checkbutton_splash.connect("toggled", self.checkbutton_splash_toggled)
        self.checkbutton_title.connect("toggled", self.checkbutton_title_toggled)
        self.entry_title.connect("changed", self.entry_title_changed)
        self.button_convert.connect("clicked", self.button_convert_clicked)
        self.button_save.connect("clicked", self.button_save_clicked)

        # do layout
        options_table.attach(self.checkbutton_number, 0, 1, 0, 1, gtk.FILL)
        options_table.attach(self.checkbutton_redirect, 1, 2, 0, 1, gtk.FILL)
        options_table.attach(self.entry_redirect, 2, 3, 0, 1, gtk.EXPAND | gtk.FILL)
        options_table.attach(self.button_convert, 3, 4, 0, 1, gtk.FILL)
        options_table.attach(self.checkbutton_splash, 0, 1, 1, 2, gtk.FILL)
        options_table.attach(self.checkbutton_title, 1, 2, 1, 2, gtk.FILL)
        options_table.attach(self.entry_title, 2, 3, 1, 2, gtk.EXPAND | gtk.FILL)
        options_table.attach(self.button_save, 3, 4, 1, 2, gtk.FILL)
        frame_options.add(options_table)

        ### preview frame ###
        frame_preview = gtk.Frame(_("Preview"))
        preview_scrollwindow = gtk.ScrolledWindow()
        preview_scrollwindow.set_policy(gtk.POLICY_AUTOMATIC, gtk.POLICY_AUTOMATIC)
        preview_scrollwindow.set_shadow_type(gtk.SHADOW_IN)
        preview_scrollwindow.set_border_width(3)

        self.textview_result = gtk.TextView()
        self.textview_result.modify_font(pango.FontDescription("Mono"))
        self.textbuffer_result = self.textview_result.get_buffer()

        self.textview_result.set_editable(False)

        self.textbuffer_result.connect("changed", self.textbuffer_result_changed)

        # do layout
        preview_scrollwindow.add(self.textview_result)
        frame_preview.add(preview_scrollwindow)

        ### statusbar ###
        self.statusbar = gtk.Statusbar()
        context_id = self.statusbar.get_context_id("step1")
        self.statusbar.push(context_id, _("Step 1: Open a isolinux file"))

        ### do main window layout ###
        self.add(vbox)
        vbox.pack_start(frame_actions, False)
        vbox.pack_start(frame_options, False)
        vbox.pack_start(frame_preview, True)
        vbox.pack_end(self.statusbar, False)

        self.show_all()

        ### Variables for later use
        self.convert_option = ConvertOption()
        self.Converted = False     

    ### event connect functions ###
    def button_about_clicked(self, widget, data=None):
        dialog = AboutDialog()
        dialog.show()

    def button_openfilepath_clicked(self, widget, data=None):
        dialog = gtk.FileChooserDialog(_("Select a file"), None,
                               gtk.FILE_CHOOSER_ACTION_OPEN,
                               (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                gtk.STOCK_OPEN, gtk.RESPONSE_OK))
        dialog.set_default_response(gtk.RESPONSE_OK)
        response = dialog.run()
        if response == gtk.RESPONSE_OK:
            filepath = dialog.get_filename()
            if filepath:
                self.convert_option.set_openfilepath(filepath)
                self.entry_openfilepath.set_text(filepath)
                file = open(filepath, "r")
                self.textbuffer_result.set_text(file.read())
                file.close()
                context_id = self.statusbar.get_context_id("step2")
                self.statusbar.push(context_id, _("Step 2: Select a file to save"))
                self.entry_savefilepath.set_sensitive(True)
                self.button_savefilepath.set_sensitive(True)
        dialog.destroy()

    def button_savefilepath_clicked(self, widget, data=None):
        dialog = gtk.FileChooserDialog(_("Select a file"), None,
                               gtk.FILE_CHOOSER_ACTION_SAVE,
                               (gtk.STOCK_CANCEL, gtk.RESPONSE_CANCEL,
                                gtk.STOCK_SAVE, gtk.RESPONSE_OK))
        dialog.set_default_response(gtk.RESPONSE_OK)
        response = dialog.run()
        if response == gtk.RESPONSE_OK:
            filepath = dialog.get_filename()
            if filepath:
                self.convert_option.set_savefilepath(filepath)
                self.entry_savefilepath.set_text(filepath)
                context_id = self.statusbar.get_context_id("step3")
                self.statusbar.push(context_id, 'Step 3: Change the options and click "Convert" button')
        self.button_convert.set_sensitive(True)
        dialog.destroy()

    def button_convert_clicked(self, widget, data=None):
        if self.do_convert():
            context_id = self.statusbar.get_context_id("converted")
            self.statusbar.push(context_id, _('Convert finished, reconvert or edit it if you need'))
            self.button_save.set_sensitive(False)
            self.textview_result.set_editable(True)
            self.Converted = True
        else:
            context_id = self.statusbar.get_context_id("error")
            self.statusbar.push(context_id, _('Ooh, something wrong'))

    def checkbutton_number_toggled(self, widget, data=None):
        self.convert_option.set_print_number(widget.get_active())

    def checkbutton_redirect_toggled(self, widget, data=None):
        self.entry_redirect.set_sensitive(widget.get_active())
        if widget.get_active():
            self.convert_option.set_redirect_string(self.entry_redirect.get_text())
        else:
            self.convert_option.set_redirect_string(None)

    def entry_redirect_changed(self, widget, data=None):
        self.convert_option.set_redirect_string(widget.get_text())

    def entry_title_changed(self, widget, data=None):
        self.convert_option.set_title_string(widget.get_text())

    def checkbutton_splash_toggled(self, widget, data=None):
        self.convert_option.set_convert_splash(widget.get_active())

    def checkbutton_title_toggled(self, widget, data=None):
        self.entry_title.set_sensitive(widget.get_active())
        if widget.get_active():
            self.convert_option.set_title_string(self.entry_title.get_text())
        else:
            self.convert_option.set_title_string(None)

    def textbuffer_result_changed(self, widget, data=None):
        if self.Converted:
            self.button_save.set_sensitive(True)
            content_id = self.statusbar.get_context_id("edited")
            self.statusbar.push(content_id, 'Click "Save" button when finish editing')

    def button_save_clicked(self, widget, data=None):
        self.save_file()
        self.button_save.set_sensitive(False)

    def button_exit_clicked(self, widget, data=None):
        self.destroy(widget)

    def destroy(self, widget, data=None):
        gtk.main_quit()

    ### event functions end ###

    ### tools functions ###

    def do_convert(self):
        command = self.convert_option.get_command()

        # get result text through pipe
        pipe = os.popen(command, "r")
        text = pipe.read()
        if text:
            self.textbuffer_result.set_text(text)
            self.save_file()
            return True
        else:
            return False

    def save_file(self): 
        file = open(self.convert_option.get_savefilepath(), "w")
        startiter, enditer = self.textbuffer_result.get_bounds()
        file.write(self.textbuffer_result.get_text(startiter, enditer))
        file.close()

    ### tools functions end ### 

class ConvertOption():

    def __init__(self):
        self.openfilepath = None
        self.savefilepath = None
        self.print_number = False
        self.redirect_string = None
        self.convert_splash = False   
        self.title_string = None

    def set_openfilepath(self, filepath):
        self.openfilepath = filepath

    def set_savefilepath(self, filepath):
        self.savefilepath = filepath

    def get_savefilepath(self):
        return self.savefilepath

    def set_print_number(self, enable):
        self.print_number = enable

    def set_convert_splash(self, enable):
        self.convert_splash = enable

    def set_redirect_string(self, redirect):
        self.redirect_string = redirect

    def set_title_string(self, title):
        self.title_string = title

    def get_command(self):

        iso2grub_path = os.path.abspath("iso2grub.py")
        commandlist = [iso2grub_path]

        # get the options
        if self.print_number:
            commandlist.append("-n")

        if self.convert_splash:
            splash_path = '"%s"' % os.path.split(self.savefilepath)[0]
            commandlist.extend(["-s", splash_path])

        if self.redirect_string:
            redirect = self.redirect_string
            if redirect:
                redirect = '"%s"' % redirect
                commandlist.extend(["-r", redirect])

        if self.title_string:
            title = self.title_string
            if title:
                title = '"%s"' % title
                commandlist.extend(["-t", title])

        commandlist.append(self.openfilepath)
        command = ' '.join(commandlist)
        return command

class AboutDialog():

    def __init__(self):
        self.dialog = gtk.AboutDialog()
        self.dialog.set_name("iso2grub_gui")
        self.dialog.set_version("0.4")
        self.dialog.set_copyright("(C) 2009 muzuiget")
        self.dialog.set_comments(\
_('''iso2grub_gui is frontend for iso2grub, it write with pyGTK.
It is a python script to convert isolinux configfile 
"isolinux.cfg" to grub4dos configfile "menu.lst".'''))
        self.dialog.set_website_label(_("iso2grub home page"))
        self.dialog.set_website("http://code.google.com/p/muzuiget-toolbox/")
        self.dialog.set_license("GNU General Public License v3")
        self.dialog.set_authors(["muzuiget"])

        self.dialog.connect('response', self.dialog_response)
        self.dialog.connect('close', self.dialog_close)
        self.dialog.connect('delete_event', self.dialog_close)

    def dialog_response(self, dialog, response, *args):
        if response < 0:
            dialog.hide()
            dialog.emit_stop_by_name("response")

    def dialog_close(self, widget, event=None):
        self.dialog.destroy()
        return True

    def show(self):
        self.dialog.show()

if __name__ == '__main__':
    Mainwindow()
    gtk.main()
