var url = 'http://bit.ly/?u='+encodeURIComponent(gBrowser.currentURI.spec);
gBrowser.loadOneTab(url, null, null, null, false, false);
