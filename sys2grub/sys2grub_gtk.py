#!/usr/bin/python
# -*- coding: utf-8 -*-

import os
import webbrowser
from gi.repository import Gtk, Pango

from sys2grub import Sys2Grub

__folder__ = os.path.dirname(os.path.abspath(__file__))

class Sys2GrubGtk:

    def __init__(self):
        ui_file_path = os.path.join(__folder__, 'sys2grub_gtk.ui')
        builder = Gtk.Builder()
        builder.add_from_file(ui_file_path)
        builder.connect_signals(self)
        for widget in builder.get_objects():
            if isinstance(widget, Gtk.Buildable):
                name = Gtk.Buildable.get_name(widget)
                setattr(self, name, widget)
        self.init_widgets_status()

    def init_widgets_status(self):
        self.preview_textview.modify_font(Pango.FontDescription("Mono"))

    def alert(self, message_type, message_text):
        dialog = Gtk.MessageDialog(
                self.main_window, 0, message_type,
                Gtk.ButtonsType.OK, message_text)
        dialog.run()
        dialog.destroy()

    def setup_preview_text(self, openpath):
        with open(openpath) as openfile:
            text = openfile.read()
        self.preview_textview.get_buffer().set_text(text)

    def on_open_button_clicked(self, widget):
        filename = 'isolinux.cfg'
        filepath = self.open_entry.get_text().strip()

        dialog = Gtk.FileChooserDialog(
            'Please select a file', self.main_window,
            Gtk.FileChooserAction.SAVE,
            (Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
             Gtk.STOCK_OPEN, Gtk.ResponseType.OK)
        )

        dialog.set_current_name(filename)
        dialog.set_filename(filepath)

        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            openpath = dialog.get_filename()
            self.open_entry.set_text(openpath)
            self.setup_preview_text(openpath)
        dialog.destroy()

    def on_save_button_clicked(self, widget):
        filename = 'menu.lst'
        filepath = self.save_entry.get_text().strip()

        dialog = Gtk.FileChooserDialog(
            'Please select a file', self.main_window,
            Gtk.FileChooserAction.SAVE,
            (Gtk.STOCK_CANCEL, Gtk.ResponseType.CANCEL,
             Gtk.STOCK_SAVE, Gtk.ResponseType.OK)
        )

        dialog.set_current_name(filename)
        dialog.set_filename(filepath)

        response = dialog.run()
        if response == Gtk.ResponseType.OK:
            savepath = dialog.get_filename()
            self.save_entry.set_text(savepath)
        dialog.destroy()

    def on_convert_button_clicked(self, widget):
        openpath = self.open_entry.get_text().strip()
        savepath = self.save_entry.get_text().strip()

        errors = []
        if openpath == '':
            errors.append('Open file path is empty')

        if savepath == '':
            errors.append('Save file path is empty')

        if len(errors) != 0:
            self.alert(Gtk.MessageType.ERROR, '\n'.join(errors))
            return

        number = self.number_checkbutton.get_active()
        if self.root_checkbutton.get_active():
            root = self.root_entry.get_text().strip()
        else:
            root = '/'
        if self.title_checkbutton.get_active():
            title = self.title_entry.get_text().strip()
        else:
            title = 'My Linux boot disk'

        config = dict(number=number, root=root, title=title)
        text = Sys2Grub(openpath, config).output()
        self.preview_textview.get_buffer().set_text(text)

        with open(savepath, 'w') as savefile:
            savefile.write(text)

        message = 'Convert success, menu file save to %s' % savepath
        self.alert(Gtk.MessageType.INFO, message)

    def on_root_checkbutton_toggled(self, widget):
        self.root_entry.set_sensitive(self.root_checkbutton.get_active())

    def on_title_checkbutton_toggled(self, widget):
        self.root_entry.set_sensitive(self.root_checkbutton.get_active())

    def on_quit_imagemenuitem_activate(self, widget):
        Gtk.main_quit()

    def on_about_imagemenuitem_activate(self, widget):
        webbrowser.open('https://github.com/muzuiget/sys2grub#readme')

    def on_main_window_destory(self, widget):
        Gtk.main_quit()

def main():
    Sys2GrubGtk().main_window.show()
    Gtk.main()

if __name__ == '__main__':
    main()
