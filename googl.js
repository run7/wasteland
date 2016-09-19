/**
 * Use goo.gl to shorten current url.
 */

var HISTORY = false;

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
    var apiUrl = 'https://www.googleapis.com/urlshortener/v1/url';
    var dataString = JSON.stringify({longUrl: longUrl});

    var request = new XMLHttpRequest();
    request.open('POST', apiUrl, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.onload = function() {
        var json = JSON.parse(request.responseText);
        if (json.id) {
            confirmCopy(longUrl, json.id);
        } else {
            FireGestures.setStatusText('Shorten url fail, return #' +
                                        json.error.code + ' "' +
                                        json.error.message + '" error.');
        }
    };
    request.onerror = function() {
        FireGestures.setStatusText('Shorten url fail, maybe network error.');
    };

    FireGestures.setStatusText('Shortening url...');
    request.send(dataString);
};

var shortenUrlWithHistory = function(longUrl) {

    var fetchSecurityToken = function(callback) {
        var url = 'http://goo.gl/';
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        request.onload  = function() {
            var tokenReg = /name="security_token" type="hidden" value="([^"]+)"/;
            var match = request.responseText.match(tokenReg);
            if (match === null) {
                FireGestures.setStatusText(
                    'Get token fail, not signin goo.gl?');
                return;
            }
            callback(match[1]);
        };
        request.onerror  = function() {
            FireGestures.setStatusText('Get token fail, maybe network error.');
        };

        FireGestures.setStatusText('Getting security token...');
        request.send();
    };

    fetchSecurityToken(function(token) {
        var apiUrl = 'http://goo.gl/api/shorten';
        var dataString = 'url=' + encodeURIComponent(longUrl) +
                         '&security_token=' + token;

        var request = new XMLHttpRequest();
        request.open('POST', apiUrl, true);
        request.setRequestHeader(
            'Content-Type',
            'application/x-www-form-urlencoded; charset=UTF-8');
        request.onload = function() {
            var json = JSON.parse(request.responseText);
            if (json.short_url) {
                confirmCopy(longUrl, json.short_url);
            } else {
                FireGestures.setStatusText('Shorten url fail, return "' +
                                           json.error_message + '" error.');
            }
        };
        request.onerror = function() {
            FireGestures.setStatusText(
                'Shorten url fail, maybe network error.');
        };

        FireGestures.setStatusText('Shortening url...');
        request.send(dataString);
    });
};

var currentUrl = content.window.location.href;
if (HISTORY) {
    shortenUrlWithHistory(currentUrl);
} else {
    shortenUrl(currentUrl);
}
