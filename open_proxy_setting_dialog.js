/*
 * Open proxy setting dialog.
 *
 * For Windows users: to make this script work, you need to set the 
 * about:config entry "browser.preferences.instantApply" value to "true",
 * otherwise, your change will not save after the dialog close.
 */

openDialog('chrome://browser/content/preferences/connection.xul', '', null);
