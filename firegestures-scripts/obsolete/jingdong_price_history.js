gBrowser.loadOneTab(get_history_url(), null, null, null, false, false);

function get_history_url() {
    current_url = gBrowser.currentURI.spec;
    if (current_url.indexOf('http://www.360buy.com/product/') != -1) {
        return current_url.replace('360buy', '360444');
    }

reg = new RegExp("http://.+\.360buy\.com/\(\\d+\).html");
matches = current_url.match(reg);
if (matches == null) {
    return null;
}
product_uid = matches[1];
history_url = "http://www.360444.com/product/" + product_uid + ".html";
return history_url;
}

