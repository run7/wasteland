/**
 * persistent cookies, make session cookies persistent.
 */

var persistentCookies = function(domain, days) {
    var isSession = false;
    var expires = function() {
        var date = new Date();
        date.setDate(date.getDate() + days);
        return Math.round(date.getTime() / 1000);
    }();    
    var cm = Cc["@mozilla.org/cookiemanager;1"].getService(Ci.nsICookieManager2);
    var em = cm.getCookiesFromHost(domain);
    var c;
    while (em.hasMoreElements()) {
        c = em.getNext().QueryInterface(Ci.nsICookie2);
        cm.add(c.host, c.path, c.name, c.value, 
               c.isSecure, c.isHttpOnly, isSession, expires);
    }
};

var host = content.document.documentURIObject.host;
var days = 30;
var text = prompt('Options format: host,days', host + ',' + days);
var values;
if (text) {
    values = text.split(',');
    persistentCookies(values[0], parseInt(values[1]));
    alert('Modify cookies complete.');
}

