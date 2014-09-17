/**
 * Create current page QR Code with Google Chart.
 */

var prefix = 'http://chart.googleapis.com/chart?cht=qr&chs=256x256&choe=UTF-8&chld=H|0&chl=';
var url = prefix + encodeURIComponent(content.window.location.href);
gBrowser.loadOneTab(url, {inBackground: false});

