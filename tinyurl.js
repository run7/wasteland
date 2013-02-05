/**
 * Use tinyurl to shorten current url.
 */

var xpcomFactory = {
    clipboard: function() {
        return Cc['@mozilla.org/widget/clipboardhelper;1']
               .getService(Ci.nsIClipboardHelper);
    }
};

var xpcomUtil = {

    writeClipboard: function(text) {
        xpcomFactory.clipboard().copyString(text);
    }

};

var confirmCopy = function(longUrl, shortenUrl) {
    var message = 'long url:\n' +
                  longUrl + '\n\n' +
                  'shorten url:\n' +
                  shortenUrl + '\n\n' +
                  'Copy to clipboard?';
    if (confirm(message)) {
        xpcomUtil.writeClipboard(shortenUrl);
        FireGestures.setStatusText('Shorten url' + shortenUrl +
                                   'have copied to clipboard.');
    }
};

var shortenUrl = function(longUrl) {
    var prefix = 'http://tinyurl.com/api-create.php?url=';
    var apiUrl = prefix + encodeURIComponent(longUrl);

    var request = new XMLHttpRequest();
    request.open('GET', apiUrl, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function() {
        var shortenUrl = request.responseText;
        confirmCopy(longUrl, shortenUrl);
    };
    request.onerror = function() {
        FireGestures.setStatusText('Shorten url fail, maybe network error.');
    };

    FireGestures.setStatusText('Shortening url...');
    request.send();
};

var currentUrl = content.window.location.href;
shortenUrl(currentUrl);
