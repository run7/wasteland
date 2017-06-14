/**
 * Save page to Pocket.
 */

var EDIT_MODE = false;

var addAsEditMode = function(url, title) {
    var prefix = 'https://getpocket.com/edit?';
    var openUrl = prefix + 'url=' + url + '&title=' + title;
    gBrowser.loadURI(openUrl);
};

var addAsQuickMode = function(url, title) {

    var fetchToken = function(callback) {
        var apiUrl = 'https://getpocket.com/edit';
        var request = new XMLHttpRequest();
        request.open('GET', apiUrl, true);
        request.onload  = function() {
            var tokenReg = new RegExp(
                            '<input type="hidden" name="ct" value="(.+?)" />');
            var match = request.responseText.match(tokenReg);
            if (match === null) {
                FireGestures.setStatusText(
                    'Get token fail, not signin getpocket.com?');
                return;
            }
            callback(match[1]);
        };
        request.onerror  = function() {
            FireGestures.setStatusText('Get token fail, maybe network error.');
        };

        FireGestures.setStatusText('Getting token...');
        request.send();
    };

    fetchToken(function(token) {
        var apiUrl = 'https://getpocket.com/edit_process.php?BL=';
        var dataString = 'url=' + url + '&title=' + title +
                         '&tags=&ref=&ct=' + token;

        var request = new XMLHttpRequest();
        request.open('POST', apiUrl, true);
        request.setRequestHeader('Content-Type',
                                 'application/x-www-form-urlencoded');
        request.onload = function() {
            alert('Save\n\n' + url + '\n\nto Pocket successful.');
        };
        request.onerror = function() {
            FireGestures.setStatusText(
                'Save page to Pocket fail, maybe network error.');
        };

        FireGestures.setStatusText('Saving page to Pocket url...');
        request.send(dataString);
    });
};

var url = encodeURIComponent(content.window.location.href);
var title = encodeURIComponent(content.window.document.title);
if (EDIT_MODE) {
    addAsEditMode(url, title);
} else {
    addAsQuickMode(url, title);
}
