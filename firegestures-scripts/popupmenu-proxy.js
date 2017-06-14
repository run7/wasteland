/**
 * Firegestures popup menu for switch proxy.
 */

var PAC = '~/.pac.js';

FireGestures.generatePopup(event, [
    {
        label: 'direct',
        oncommand: 'FireGestures.switchProxy("direct");'
    },
    {
        label: 'polipo',
        oncommand: 'FireGestures.switchProxy("polipo");'
    },
    {
        label: 'ssh',
        oncommand: 'FireGestures.switchProxy("ssh");'
    },
    {
        label: 'test',
        oncommand: 'FireGestures.switchProxy("test");'
    }
]);

var xpcomFactory = {
    file: function() {
        return Cc['@mozilla.org/file/local;1']
               .createInstance(Ci.nsILocalFile);
    },
    fileInputStream: function() {
        return Cc['@mozilla.org/network/file-input-stream;1']
               .createInstance(Ci.nsIFileInputStream);
    },
    convertInputStream: function() {
        return Cc['@mozilla.org/intl/converter-input-stream;1']
               .createInstance(Ci.nsIConverterInputStream);
    },
    unicodeConverter: function () {
        return Cc["@mozilla.org/intl/scriptableunicodeconverter"]
               .createInstance(Ci.nsIScriptableUnicodeConverter);
    },
    dirService: function() {
        return Cc['@mozilla.org/file/directory_service;1']
               .getService(Ci.nsIProperties);
    },
    proxyService: function() {
        return Cc['@mozilla.org/network/protocol-proxy-service;1']
               .getService();
    }
};

Components.utils.import('resource://gre/modules/NetUtil.jsm');
Components.utils.import('resource://gre/modules/FileUtils.jsm');

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

    reloadPacFile: function() {
        xpcomFactory.proxyService().reloadPAC();
    },

    readFileToString: function(fileObject, callback) {
        NetUtil.asyncFetch(fileObject, function(inputStream, statusCode) {
            if (!Components.isSuccessCode(statusCode)) {
                alert('Read file fail:' + fileObject.path);
                return;
            }
            var text = NetUtil.readInputStreamToString(
                           inputStream, inputStream.available());
            callback(text);
        });
    },

    writeStringToFile: function(fileObject, text, callback) {
        var outputStream = FileUtils.openSafeFileOutputStream(fileObject);
        var converter = xpcomFactory.unicodeConverter();
        converter.charset = "UTF-8";
        var inputStream = converter.convertToInputStream(text);

        NetUtil.asyncCopy(inputStream, outputStream, function(statusCode) {
            if (!Components.isSuccessCode(statusCode)) {
                alert('Write file fail:' + fileObject.path);
                return;
            }
            callback();
        });
    }

};

FireGestures.switchProxy = function(proxyName) {

    var replaceProxyName = function(text) {
        var reg = /(var default_proxy = proxies\.).+?;/;
        return text.replace(reg, '$1' + proxyName + ';');
    };

    var successChanged = function(text) {
        xpcomUtil.reloadPacFile();
        FireGestures.setStatusText('PAC file global proxy have changed to "' + 
                                   proxyName + '".');
    };

    var pacFile = xpcomUtil.openFile(PAC);
    if (!pacFile.exists()) {
        FireGestures.setStatusText('Pac file does not exist: ' + PAC);
        return;
    }

    xpcomUtil.readFileToString(pacFile, function(text) {
        var replacedText = replaceProxyName(text);
        xpcomUtil.writeStringToFile(pacFile, replacedText, successChanged);
    });
};
