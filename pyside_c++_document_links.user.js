// ==UserScript==
// @name           PySide - Qt Document Links
// @namespace      http://qixinglu.com
// @description    Add PySide/Qt document cross reference link
// @include        http://qt-project.org/doc/qt-4.8/*.html*
// @include        http://www.pyside.org/docs/pyside/PySide/*.html*
// ==/UserScript==

function pyside_link() {
    var url_perfix = 'http://www.pyside.org/docs/pyside/PySide/'
    var product_nodes = document.querySelectorAll('.product');
    var module_name = product_nodes[1].textContent.trim();
    var object_name = product_nodes[2].textContent.trim();
    var url = url_perfix + module_name + '/' + object_name + '.html';
    var link = document.createElement('a');
    link.href = url;
    link.textContent = 'Pyside document page';
    var breadcrumbs_node = document.querySelector('li.breadcrumbs-docscontainer');
    breadcrumbs_node.replaceChild(link, breadcrumbs_node.firstElementChild);
}

function qt_link() {
    var url_perfix = 'http://qt-project.org/doc/qt-4.8/'
    var object_name = document.querySelector('title').textContent.split(' ')[0];
    var url = url_perfix + object_name.toLowerCase() + '.html';
    var link = document.createElement('a');
    link.href = url;
    link.textContent = 'QT document page';
    link.style.cssText = 'float: right; margin-right: 10px;';
    var h1_node = document.getElementsByTagName('h1')[0];
    h1_node.appendChild(link);
}

if (location.href.indexOf('pyside.org') === -1) {
    pyside_link();
} else {
    qt_link();
}
