/**
 * Open current url in other browser.
 */

var BROWSER = '/usr/bin/google-chrome';

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

var browserFile = xpcomUtil.openFile(BROWSER);

if (browserFile.exists()) {
    xpcomUtil.runCommand(browserFile, [content.window.location.href]);
} else {
    alert('Browser file does not exist: ' + BROWSER);
}
