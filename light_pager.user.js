// ==UserScript==
// @name           Light Pager
// @namespace      http://qixinglu.com
// @description    Append next page content to current page.
// @resource       rule https://raw.github.com/gist/2904550/rule.json
// @include        http://www.google.com/search?*
// @include        https://www.google.com/search?*
// ==/UserScript==

// load outside rule
var RULE = JSON.parse(GM_getResourceText('rule'));
var DEFAULT = RULE["default"];
var SITES = RULE["sites"];

var light_pager = function(site) {
    var appending = false; // lock

    if (site.height <= 1) {
        if (window.scrollMaxY === 0) {
            site.height = window.innerHeight * (1 - site.height);
        } else {
            site.height = window.scrollMaxY * (1 - site.height);
        }
    }
    if (site.count <= 0) {
        site.count = 999; // not really endless
    }

    site.appended_count = 0;
    site.next_append_url = document.querySelector(site.next).href;

    var querySelectorLast = function(selector) {
        var nodes = document.querySelectorAll(selector);
        if (nodes.length === 0) {
            return null;
        }
        return nodes[nodes.length - 1];
    };

    var append_next_callback = function(response) {
        var temp_document, temp_next_url_node, temp_content_node, temp_remove_nodes;
        var content_node;

        temp_document = document.createElement('html');
        temp_document.innerHTML = response.responseText;

        temp_next_url_node = temp_document.querySelector(site.next);
        if (temp_next_url_node !== null) {
            site.next_append_url = temp_next_url_node.href;
        } else {
            site.next_append_url = null;
        }
        temp_content_node = temp_document.querySelector(site.content);

        if (site.removes !== undefined) {
            temp_remove_nodes = temp_content_node.querySelectorAll(site.removes);
            var i, remove_node;
            for (i = 0; i < temp_remove_nodes.length; i += 1) {
                remove_node = temp_remove_nodes[i];
                remove_node.parentNode.removeChild(remove_node);
            }
        }

        content_node = querySelectorLast(site.content);
        content_node.parentNode.insertBefore(temp_content_node, content_node.nextSibling);

        site.appended_count += 1;
        appending = false;
    };

    var append_next = function() {
        appending = true;
        if (site.appended_count >= site.count || site.next_append_url === null) {
            stop_scroll_listener();
            return;
        }
        GM_xmlhttpRequest({
            method: "GET",
            url: site.next_append_url,
            onload: function(response) {
                try {
                    append_next_callback(response);
                } catch (e) {
                    stop_scroll_listener();
                }
            }
        });
    };

    var reach_append_height = function() {
        var current_height = window.scrollMaxY - window.scrollY;
        return site.height > current_height;
    };

    var scroll_listener = function() {
        if (appending) {
            return;
        }
        if (reach_append_height()) {
            append_next();
        }
    };

    var start_scroll_listener = function() {
        if (reach_append_height()) {
            append_next();
        }
        window.addEventListener("scroll", scroll_listener, false);
    }

    var stop_scroll_listener = function() {
        appending = false;
        window.removeEventListener("scroll", scroll_listener, false);
    };

    var control = {
        'start_paging' : function() {
            site.appended_count = 0;
            start_scroll_listener();
        },
        'continue_paging' : function() {
            start_scroll_listener();
        },
        'stop_paging' : function() {
            stop_scroll_listener();
        }
    };

    start_scroll_listener();
    return control;
}

var select_site = function(sites) {
    var url = document.URL;
    var i, j, reg, site, site_urls, site_url;
    for (i = 0; i < sites.length; i += 1) {
        site = sites[i];
        if (typeof(site.urls) === 'string') {
            site_urls = [site.urls];
        } else {
            site_urls = site.urls;
        }
        for (j = 0; j < site_urls.length; j += 1) {
            site_url = site_urls[j];
            reg = new RegExp(site_url);
            if (url.search(reg) != -1) {
                return site;
            }
        }
    }
    return null;
};

var site = select_site(SITES);
if (site !== null) {
    if (site.height === undefined) {
        site.height = DEFAULT.height
    }
    if (site.count === undefined) {
        site.count = DEFAULT.count;
    }
    control = light_pager(site);
    GM_registerMenuCommand("Start", control.start_paging, "s");
    GM_registerMenuCommand("Continue", control.continue_paging, "c");
    GM_registerMenuCommand("Stop", control.stop_paging, "t");
}

