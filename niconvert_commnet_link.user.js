// ==UserScript==
// @name           Niconvert Commnet Link
// @namespace      qixinglu.com
// @description    显示Acfun和Bilibili的弹幕评论地址
// @include        http://www.bilibili.tv/video/*
// @include        http://bilibili.kankanews.com/video/*
// @include        http://www.acfun.tv/v/*
// ==/UserScript==

var create_link = function(commnet_url) {
    var link = document.createElement('a');
    link.href = commnet_url;
    link.text = '评论地址';
    return link;
}

var do_bilibili = function() {
    var reg = new RegExp('id="bofqi"(.|\n)+?(?:ykid|qid|vid|uid|cid)=(.+?)"');
    var matches = document.documentElement.innerHTML.match(reg);
    unsafeWindow.console.log(document.documentElement.innerHTML);
    var commnet_uid = matches[matches.length - 1];
    var commnet_url = "http://comment.bilibili.tv/" + commnet_uid + '.xml';
    var link = create_link(commnet_url);
    document.getElementsByClassName('tminfo')[0].appendChild(link);
}

var do_acfun = function() {
    var reg = new RegExp("\\[Video\\](\\d\+)\\[/Video\\]");
    unsafeWindow.console.log(document.querySelector('#area-player').innerHTML.match(reg));
    var vid = document.querySelector('#area-player').innerHTML.match(reg)[1];
    var info_url = 'http://www.acfun.tv/api/getVideoByID.aspx?vid=' + vid;
    GM_xmlhttpRequest({
        method: "GET",
        url: info_url,
        onload: function(response) {
            var commnet_uid = JSON.parse(response.responseText).cid;
            var commnet_url = "http://comment.acfun.tv/" + commnet_uid + ".json";
            var link = create_link(commnet_url);
            link.style.marginLeft = "15px";
            document.getElementById('subtitle-article').appendChild(link);
        }
    });

}

if (location.href.indexOf("http://www.acfun.tv") === 0) {
    do_acfun();
} else {
    do_bilibili();
}
