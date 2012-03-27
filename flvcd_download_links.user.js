// ==UserScript==
// @name           Flvcd Download Links
// @namespace      http://qixinglu.com
// @description    替换在线视频的下载链接为 flvcd.com 的解析链接
// @include        http://v.youku.com/v_show/*.html
// @include        http://v.youku.com/v_playlist/*.html
// ==/UserScript==

function create_flvcd_url() {
    return 'http://www.flvcd.com/parse.php?kw=' + encodeURIComponent(document.URL) + '&flag=&format=super';
}

var sites = [
    {
        domain: 'youku.com',
        handler: function() {
            var source_link_node = document.getElementById('fn_favodownload').lastElementChild;
            var new_link_node = document.createElement('a');
            new_link_node.text = '下载';
            new_link_node.href = create_flvcd_url();
            source_link_node.parentNode.replaceChild(new_link_node, source_link_node);
        }
    }
];

var url = document.URL;
var i, site;
for (i = 0; i < sites.length; i += 1) {
    site = sites[i];
    if (url.indexOf(site.domain) != -1) {
        site.handler();
        break;
    }
}
