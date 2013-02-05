/**
 * Translate selected text through Google Translate.
 */

var LANG = 'zh-CN';

var translateText = function(text, lang) {

    var fixJSON = function(jsonText) {
        var result = jsonText;
        while (result.indexOf(',,') !== -1) {
            result = result.replace(/,,/g, ',"",');
        }
        return result;
    };

    var mergeTranslatedString = function(lines) {
        var filteredLines = [];
        var i;
        for (i = 0; i < lines.length; i += 1) {
            filteredLines.push(lines[i][0]);
        }
        return filteredLines.join('');
    };

    var apiUrl = 'http://translate.google.com/translate_a/t';
    var dataString = 'client=t&hl=' + lang +
                     '&text=' + encodeURIComponent(text);
    var requestOptions = {mozAnon: true}; // mozAnon mean don't use cookies

    var request = new XMLHttpRequest(requestOptions);
    request.open('POST', apiUrl, true);
    request.setRequestHeader('Content-Type',
                             'application/x-www-form-urlencoded');
    request.onload = function() {
        var resposeJson;
        try {
            resposeJson = JSON.parse(fixJSON(request.responseText));
        } catch (e) {
            FireGestures.setStatusText(
                'Translate fail, return unexpected result.');
            return;
        }
        alert(mergeTranslatedString(resposeJson[0]));
    };
    request.onerror = function() {
        FireGestures.setStatusText('Translate fail, maybe network error.');
    };

    FireGestures.setStatusText('Requesting Google Translate...');
    request.send(dataString);
};

var text = FireGestures.getSelectedText();
if (text) {
    translateText(text, LANG);
}
