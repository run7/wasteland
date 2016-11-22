// ==UserScript==
// @name        GitHub NPM Package Link
// @namespace   qixinglu.com
// @description Add npmjs package link for package.json
// @include     https://github.com/*/package.json
// @version     1
// @grant       none
// ==/UserScript==

(function() {
    const createLink = (pkgName) => {
        const link = document.createElement('a');
        link.setAttribute('href', 'https://www.npmjs.com/package/' + pkgName);
        link.textContent = pkgName;
        return link;
    };

    const codeNode = document.querySelector('.js-file-line-container');
    const pkgJson = JSON.parse(codeNode.textContent);

    const pkgNames = [];
    if (pkgJson.dependencies) {
        const keys = Object.keys(pkgJson.dependencies);
        pkgNames.push(...keys);
    }
    if (pkgJson.devDependencies) {
        const keys = Object.keys(pkgJson.devDependencies);
        pkgNames.push(...keys);
    }

    const links = new Map();
    pkgNames.forEach((pkgName) => {
        links.set(pkgName, createLink(pkgName));
    });

    const keyNodes = codeNode.querySelectorAll('.pl-s');
    for (let i = 0; i < keyNodes.length; i++) {
        const keyNode = keyNodes[i];
        const pkgName = keyNode.textContent.replace(/^"|"$/g, '');
        const link = links.get(pkgName);
        if (link) {
            keyNode.replaceChild(link, keyNode.childNodes[1]);
        }
    }
})();
