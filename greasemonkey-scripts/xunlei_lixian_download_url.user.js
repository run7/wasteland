// ==UserScript==
// @name        Xunlei Lixian Download Url
// @namespace   qixinglu.com
// @description 导出迅雷离线下载地址
// @include     http://dynamic.cloud.vip.xunlei.com/*
// @grant       none
// ==/UserScript==

'ues strict';

let getUrl = function(ele) {
    let node = $(ele);
    if (node.attr('name').startsWith('bt')) {
        return _$('bt_list' + node.attr('_i')).value;
    } else {
        return get_downloadurl(node.attr('value'));
    }
};

$('<a>').text('下载地址').click(function() {
    let urls = $('input.in_ztclick:checked')
                .toArray()
                .map(getUrl)
                .filter((v) => v && v.startsWith('http://'))
                .join('\n');
    window.open('data:text/plain,' + encodeURIComponent(urls));
}).appendTo($('.user_info > div:first-child'));
