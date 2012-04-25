#!/usr/bin/env python
#
#       iso2grub_gui_wx.py
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

import wx
import os
import gettext
APP_NAME="iso2grub"
LOCALE_DIR=os.path.abspath("locale")
if not os.path.exists(LOCALE_DIR):
    LOCALE_DIR="/usr/share/locale"
gettext.bindtextdomain(APP_NAME, LOCALE_DIR)
gettext.textdomain(APP_NAME)
_ = gettext.gettext

class MainFrame(wx.Frame):
    def __init__(self):
        wx.Frame.__init__(self, None, -1, 'iso2grub_gui_wx', size=(640, 480))
        self.CenterOnScreen()

        ### Create GUI widget ###

        ## Actions Panel ##
        st_openpath = wx.StaticText(self, -1, _('Open File:'))
        self.tc_openpath = wx.TextCtrl(self, -1)
        bt_openpath = wx.Button(self, -1, _('Browse'))
        bt_about = wx.Button(self, -1, _('About'))

        st_savepath = wx.StaticText(self, -1, _('Save File:'))
        self.tc_savepath = wx.TextCtrl(self, -1)
        self.bt_savepath = wx.Button(self, -1, _('Browse'))
        self.bt_savepath.Enable(False)
        bt_exit = wx.Button(self, -1, _('Exit'))

        ## Options Panel ##
        self.cb_number = wx.CheckBox(self, -1, _('Print title number'))
        self.cb_number.SetToolTipString(
_('''If it checked, print a index number for each title.
title menu1 --> title [01] menu1'''))
        self.cb_redirect = wx.CheckBox(self, -1, _('Redirect the folder path:'))
        self.cb_redirect.SetToolTipString(
_('''If it checked, redirect the boot file path.
kernel /vmlinuz --> kernel /grub/vmlinuz'''))
        self.tc_redirect = wx.TextCtrl(self, -1, '/grub')
        self.tc_redirect.Enable(False)
        self.cb_splash = wx.CheckBox(self, -1, _('Convert splash image'))
        self.cb_splash.SetToolTipString(
_('''If it checked, convert the splash image file.
it will save in the same folder with the menu file.
you must have a "convert" command on your system.'''))
        self.cb_title = wx.CheckBox(self, -1, _('Custom menu first title:'))
        self.cb_title.SetToolTipString(
_('''If it checked, add a string as the menu first title.'''))
        self.tc_title = wx.TextCtrl(self, -1, _('My Linux Bootdisk'))
        self.tc_title.Enable(False)
        self.bt_convert = wx.Button(self, -1, _('Convert'))
        self.bt_convert.Enable(False)
        self.bt_save = wx.Button(self, -1, _('Save'))
        self.bt_save.Enable(False)

        ## Preview Panel ##
        self.tc_preview = wx.TextCtrl(self, -1, style=wx.TE_MULTILINE)
        font = wx.Font(10, wx.TELETYPE, wx.NORMAL, wx.NORMAL)
        self.tc_preview.SetFont(font)

        ## Setting a statusbar ##
        self.statusbar = self.CreateStatusBar()
        self.statusbar.SetStatusText(_('Step 1: Open a isolinux file'))

        ### Do the layout ###

        actions_sizer = wx.FlexGridSizer(cols=4, hgap=5)
        actions_sizer.Add(st_openpath, flag=wx.ALIGN_CENTER_VERTICAL)
        actions_sizer.Add(self.tc_openpath, flag=wx.EXPAND)
        actions_sizer.Add(bt_openpath)
        actions_sizer.AddGrowableCol(1)
        actions_sizer.Add(bt_about)
        actions_sizer.Add(st_savepath, flag=wx.ALIGN_CENTER_VERTICAL)
        actions_sizer.Add(self.tc_savepath, flag=wx.EXPAND)
        actions_sizer.Add(self.bt_savepath)
        actions_sizer.Add(bt_exit)
        # add a border label
        actions_staticbox = wx.StaticBox(self, -1, _("Actions"))
        actions_sizer_border = wx.StaticBoxSizer(actions_staticbox, wx.VERTICAL)
        actions_sizer_border.Add(actions_sizer, flag=wx.EXPAND)

        options_sizer = wx.FlexGridSizer(cols=4, hgap=5)
        options_sizer.Add(self.cb_number, flag=wx.ALIGN_CENTER_VERTICAL)
        options_sizer.Add(self.cb_redirect, flag=wx.ALIGN_CENTER_VERTICAL)
        options_sizer.Add(self.tc_redirect, flag=wx.EXPAND)
        options_sizer.Add(self.bt_convert)
        options_sizer.Add(self.cb_splash, flag=wx.ALIGN_CENTER_VERTICAL)
        options_sizer.Add(self.cb_title, flag=wx.ALIGN_CENTER_VERTICAL)
        options_sizer.Add(self.tc_title, flag=wx.EXPAND)
        options_sizer.Add(self.bt_save)
        options_sizer.AddGrowableCol(2)
        options_staticbox = wx.StaticBox(self, -1, _("Options"))
        options_sizer_border = wx.StaticBoxSizer(options_staticbox, wx.VERTICAL)
        options_sizer_border.Add(options_sizer, 1, wx.EXPAND)

        preview_staticbox = wx.StaticBox(self, -1, _("Preview"))
        preview_sizer_border = wx.StaticBoxSizer(preview_staticbox, wx.VERTICAL)
        preview_sizer_border.Add(self.tc_preview, 1, wx.EXPAND)

        ## Putting it sizer together ##
        sizer = wx.BoxSizer(wx.VERTICAL)
        sizer.Add(actions_sizer_border, 0, wx.EXPAND)
        sizer.Add(options_sizer_border, 0, wx.EXPAND)
        sizer.Add(preview_sizer_border, 1, wx.EXPAND)
        self.SetSizer(sizer)

        ### Bind event handle
        self.Bind(wx.EVT_BUTTON, self.OnOpenpath, bt_openpath)
        self.Bind(wx.EVT_BUTTON, self.OnSavepath, self.bt_savepath)
        self.Bind(wx.EVT_BUTTON, self.OnAbout, bt_about)
        self.Bind(wx.EVT_BUTTON, self.OnExit, bt_exit)

        self.Bind(wx.EVT_CHECKBOX, self.CheckBoxNumber, self.cb_number)
        self.Bind(wx.EVT_CHECKBOX, self.CheckBoxRedirect, self.cb_redirect)
        self.Bind(wx.EVT_CHECKBOX, self.CheckBoxSplash, self.cb_splash)
        self.Bind(wx.EVT_CHECKBOX, self.CheckBoxTitle, self.cb_title)
        self.Bind(wx.EVT_BUTTON, self.OnConvert, self.bt_convert)
        self.Bind(wx.EVT_BUTTON, self.OnSave, self.bt_save)
        self.Bind(wx.EVT_TEXT, self.TextChange, self.tc_preview)

        ### Variable for later use
        self.Converted = False      

    ### Tools functions ###
    def doConvert(self):
        iso2grub_path = os.path.abspath('iso2grub.py')
        commandlist = [iso2grub_path]
        # get the options
        if self.cb_number.IsChecked():
            commandlist.append('-n')

        if self.cb_splash.IsChecked():
            splash_path = '"%s"' % os.path.split(self.tc_savepath.GetValue())[0]
            commandlist.extend(['-s', splash_path])

        if self.cb_redirect.IsChecked():
            redirect = self.tc_redirect.GetValue()
            if redirect:
                redirect = '"%s"' % redirect
                commandlist.extend(['-r', redirect])

        if self.cb_title.IsChecked():
            title = self.tc_title.GetValue()
            if title:
                title = '"%s"' % title
                commandlist.extend(['-t', title])

        commandlist.append(self.tc_openpath.GetValue())
        command = ' '.join(commandlist)

        #print command        

        # get result text through pipe
        pipe = os.popen(command, 'r')
        text = pipe.read()
        if text:
            self.tc_preview.SetValue(text)
            self.SaveFile()

    def SaveFile(self):
        self.Converted = True
        self.tc_preview.SaveFile(self.tc_savepath.GetValue())
        self.statusbar.SetStatusText(_('Convert finished, reconvert or edit it if you need'))
        self.bt_save.Enable(False)

    def TextChange(self, event):
        if self.Converted:
            self.bt_save.Enable(True)
            self.statusbar.SetStatusText(_('Click "Save" button when finish editing'))

    def OnOpenpath(self, event):
        wc = _('isolinux configfile (*.cfg)|*.cfg|' \
            'All files (*.*)|*.*')
        dlg = wx.FileDialog(self, wildcard=wc, style=wx.OPEN)

        if dlg.ShowModal() == wx.ID_OK:
            path = dlg.GetPath()
            if path:
                self.tc_openpath.SetValue(path)
                self.tc_preview.LoadFile(path)
                self.statusbar.SetStatusText(_('Step 2: Select a file to save'))
                self.bt_savepath.Enable(True)
        dlg.Destroy()

    def OnSavepath(self, event):
        wc = _('grub4dos configfile (*.lst)|*.lst|' \
            'All files (*.*)|*.*')
        dlg = wx.FileDialog(self, wildcard=wc, style=wx.SAVE)

        if dlg.ShowModal() == wx.ID_OK:
            path = dlg.GetPath()
            if path:
                self.tc_savepath.SetValue(path)
                self.bt_convert.Enable(True)
                self.statusbar.SetStatusText('Step 3: Change the options and click "Convert" button')
        dlg.Destroy()

    def OnConvert(self, event):
        self.doConvert()

    def OnSave(self, event):
        self.SaveFile()

    def OnAbout(self, event):
        info = wx.AboutDialogInfo()
        info.Name = 'iso2grub_gui_wx'
        info.Version = '0.4'
        info.Copyright = '(C) 2009 muzuiget'
        info.Description = \
_('''iso2grub_gui_wx is frontend for iso2grub, 
it write with wxPython.
iso2grub is a python script to convert isolinux configfile 
"isolinux.cfg" to grub4dos configfile "menu.lst".''')
        info.WebSite = ('http://code.google.com/p/muzuiget-toolbox/',
            _('iso2grub home page'))
        info.Developers = ['muzuiget']
        info.License = 'GNU General Public License v3'
        wx.AboutBox(info)

    def OnExit(self, event):
        self.Destroy()

    ### Options  hanlder ###
    def CheckBoxNumber(self, event):
        self.Converted = False

    def CheckBoxRedirect(self, event):
        self.tc_redirect.Enable(event.IsChecked())
        self.Converted = False

    def CheckBoxSplash(self, event):
        self.Converted = False

    def CheckBoxTitle(self, event):
        self.tc_title.Enable(event.IsChecked())
        self.Converted = False

def main():
    app = wx.PySimpleApp()
    frame = MainFrame()
    frame.Show()
    app.MainLoop()
    return 0

if __name__ == '__main__':
    main()
