// ==UserScript==
// @name           Light Pager
// @namespace      qixinglu.com
// @description    Append next page content to current page.
// @resource       rule https://raw.github.com/gist/2904550/rule.json
// @include        http://www.google.com/search?*
// @include        https://www.google.com/search?*
// ==/UserScript==

/* eXtend querySelector */

var querySelectorLast = function(element, selector) {
    var nodes = element.querySelectorAll(selector);
    if (nodes.length === 0) {
        return null;
    }
    return nodes[nodes.length - 1];
};

var queryXSelectorAll = function(element, xselector) {
    if (xselector.indexOf(':contains') !== -1) {
        var parts = xselector.split(':contains');
        var selector = parts[0];
        var text = parts[1].slice(2, -2);

        var nodes = element.querySelectorAll(selector);
        var filtered_nodes = [];
        var i, node;
        for (i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            if (node.textContent.indexOf(text) !== -1) {
                filtered_nodes.push(node);
            }
        }
        return filtered_nodes;

    } else if (xselector.indexOf(':eq') !== -1) {
        var parts = xselector.split(':eq');
        var selector = parts[0];
        var text = parts[1].slice(2, -2);
        var index = parseInt(text);

        var nodes = element.querySelectorAll(selector);
        return [nodes[index]];
    }

    return element.querySelectorAll(xselector);
};

var queryXSelector = function(element, xselector) {
    var nodes = queryXSelectorAll(element, xselector);
    return nodes[0];
}

var queryXSelectorLast = function(element, xselector) {
    var nodes = queryXSelectorAll(element, selector);
    if (nodes.length === 0) {
        return null;
    }
    return nodes[nodes.length - 1];
}

/* ligher pager core */

var light_pager = function(site) {

    var absolute_site_attrs = function() {
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
    };

    var get_document_mimetype = function() {
        var mime_type = document.contentType;
        mime_type += '; charset=' + document.characterSet;
        return mime_type;
    };

    var reach_append_height = function() {
        var current_height = window.scrollMaxY - window.scrollY;
        return site.height > current_height;
    };

    var remove_elements = function(parent_node, selector) {
        var nodes = parent_node.querySelectorAll(selector);
        var i, node;
        for (i = 0; i < nodes.length; i += 1) {
            node = nodes[i];
            node.parentNode.removeChild(node);
        }
    };

    var get_next_append_url = function(the_document, selector) {
        var next_url_node = queryXSelector(the_document, site.next);
        if (next_url_node !== undefined) {
            next_append_url = next_url_node.href;
        } else {
            next_append_url = null;
        }
        return next_append_url;
    }

    var dispatch_appended_event = function(count, url) {
        var evt = document.createEvent("HTMLEvents");
        evt.initEvent("LightPagerAppended", false, true);
        evt.count = count
        evt.url = url;
        document.dispatchEvent(evt);
    };

    var runtime = {
        appending: false, // lock
        mime_type: get_document_mimetype(),
        appended_count: 0,
        next_append_url: get_next_append_url(document, site.next)
    };

    var append_next_callback = function(response) {
        var temp_document = document.createElement('html');
        temp_document.innerHTML = response.responseText;
        runtime.next_append_url = get_next_append_url(temp_document, site.next);

        var temp_content_nodes = temp_document.querySelectorAll(site.content);
        if (site.removes !== undefined) {
            var i, temp_content_node;
            for (i = 0; i < temp_content_nodes.length; i += 1) {
                temp_content_node = temp_content_nodes[i];
                remove_elements(temp_content_node, site.removes);
            }
        }

        if (site.position !== undefined) {
            var position_node = querySelectorLast(document, site.position);
        } else {
            var last_content_node = querySelectorLast(document, site.content);
            var position_node = last_content_node.nextSibling;
        }

        var i, temp_content_node;
        for (i = 0; i < temp_content_nodes.length; i += 1) {
            temp_content_node = temp_content_nodes[i];
            position_node.parentNode.insertBefore(temp_content_node,
                                                  position_node);
        }

        runtime.appended_count += 1;
        runtime.appending = false;

        dispatch_appended_event(runtime.appended_count, response.finalUrl);
    };

    var append_next = function() {
        runtime.appending = true;
        var has_remain_count = runtime.appended_count >= site.count;
        var has_next_url = runtime.next_append_url === null;
        if (has_remain_count || has_next_url) {
            stop_scroll_listener();
            return;
        }
        GM_xmlhttpRequest({
            method: "GET",
            overrideMimeType: runtime.mime_type,
            url: runtime.next_append_url,
            onload: function(response) {
                try {
                    append_next_callback(response);
                } catch (e) {
                    stop_scroll_listener();
                }
            }
        });
    };

    var scroll_listener = function() {
        if (runtime.appending) {
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
        runtime.appending = false;
        window.removeEventListener("scroll", scroll_listener, false);
    };

    var control = {
        'start_paging' : function() {
            runtime.appended_count = 0;
            start_scroll_listener();
        },
        'continue_paging' : function() {
            start_scroll_listener();
        },
        'stop_paging' : function() {
            stop_scroll_listener();
        }
    };

    absolute_site_attrs();
    start_scroll_listener();
    return control;
}

/* rule setup functions */

var select_site = function(sites) {
    var url = location.href;
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

var setup_site_default = function(site, site_default) {
    if (site.height === undefined) {
        site.height = site_default.height
    }
    if (site.count === undefined) {
        site.count = site_default.count;
    }
}

var register_menus = function(control) {
    GM_registerMenuCommand("Start", control.start_paging, "s");
    GM_registerMenuCommand("Continue", control.continue_paging, "c");
    GM_registerMenuCommand("Stop", control.stop_paging, "t");
}

// only run as main file
if (GM_info.script.name === 'Light Pager') {
    var rule = JSON.parse(GM_getResourceText('rule'));
    var site_default = rule["default"];
    var sites = rule["sites"];
    var site = select_site(sites);
    if (site !== null) {
        setup_site_default(site);
        var control = light_pager(site);
        register_menus(control);
    }
}

