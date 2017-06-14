/**
 * Open text editor to edit PAC file.
 */

var EDITOR = '/usr/bin/gvim';
var PAC = '~/.pac.js';

var xpcomFactory = {
    file: function() {
        return Cc['@mozilla.org/file/local;1']
               .createInstance(Ci.nsILocalFile);
    },
    process: function() {
        return Cc['@mozilla.org/process/util;1']
               .createInstance(Ci.nsIProcess);
    },
    dirService: function() {
        return Cc['@mozilla.org/file/directory_service;1']
               .getService(Ci.nsIProperties);
    }
};

var xpcomUtil = {

    openFile: function(filePath) {
        var expandHome = function(path) {
            if (path.indexOf('~') === -1) {
                return path;
            }
            var dirService = xpcomFactory.dirService();
            var home = dirService.get('Home', Ci.nsIFile).path;
            return path.replace('~', home);
        };
        var createFileObject = function(path) {
            var file = xpcomFactory.file();
            file.initWithPath(path);
            return file;
        };
        return createFileObject(expandHome(filePath));
    },

    runCommand: function(command, args) {
        var process = xpcomFactory.process();
        process.init(command);
        process.run(false, args, args.length);
    }
};

var editorFile = xpcomUtil.openFile(EDITOR);
var pacFile = xpcomUtil.openFile(PAC);

var errors = [];
if (!editorFile.exists()) {
    errors.push('Editor does not exist: ' + EDITOR);
}
if (!pacFile.exists()) {
    errors.push('Pac file does not exist: ' + PAC);
}

if (errors.length === 0) {
    xpcomUtil.runCommand(editorFile, [pacFile.path]);
} else {
    alert(errors.join('\n'));
}
