/**
 * Show cookie dialog.
 */

var xpcomFactory = {
    windowMediator: function() {
        return Cc['@mozilla.org/appshell/window-mediator;1']
               .getService(Components.interfaces.nsIWindowMediator);
    },
    eTLDService: function() {
        return Cc['@mozilla.org/network/effective-tld-service;1']
               .getService(Components.interfaces.nsIEffectiveTLDService);
    }
};

var xpcomUtil = {
    getMostRecentWindow: function(name) {
        var mediator = xpcomFactory.windowMediator();
        return mediator.getMostRecentWindow(name);
    },
    getDomain: function(uri) {
        var host;
        try {
            host = xpcomFactory.eTLDService().getBaseDomain(uri);
        } catch (e) {
            host = uri.asciiHost;
        }
        return host;
    }
};

var cookieDialog = xpcomUtil.getMostRecentWindow('Browser:Cookies');
var filterString = xpcomUtil.getDomain(content.document.documentURIObject);
if (cookieDialog) {
    cookieDialog.gCookiesWindow.setFilter(filterString);
    cookieDialog.focus();
} else {
    openDialog('chrome://browser/content/preferences/cookies.xul',
               'Browser:Cookies', '', {filterString: filterString});
}
