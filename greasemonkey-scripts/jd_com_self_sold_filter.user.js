// ==UserScript==
// @name        jd.com self sold filter
// @namespace   qixinglu.com
// @include     https://list.jd.com/list.html*
// @version     1
// @grant       none
// ==/UserScript==

let config = {
    selfSold: true,
    thirdParty: false,
};

let loadConfig = function() {
    let value;
    value = localStorage.getItem('gm.selfSoldEnabled');
    if (value !== null) {
        config.selfSold = value === 'true';
    }
    value = localStorage.getItem('gm.thirdPartyEnabled');
    if (value !== null) {
        config.thirdParty = value === 'true';
    }
};

let saveConfig = function() {
    localStorage.setItem('gm.selfSoldEnabled', String(config.selfSold));
    localStorage.setItem('gm.thirdPartyEnabled', String(config.thirdParty));
};

let refreshItemList = function() {
    let nodes = document.querySelectorAll('.gl-item');
    for (let node of nodes) {
        let isSelfSold = node.querySelector('#js-jdzy');
        let isThridParty = !isSelfSold;

        if (isSelfSold && config.selfSold) {
            node.style.display = 'inherit';
            continue;
        }

        if (isThridParty && config.thirdParty) {
            node.style.display = 'inherit';
            continue;
        }

        node.style.display = 'none';
    }
};

let addFilterBarCheckboxes = function() {
    let selfSoldLink = document.createElement('a');
    selfSoldLink.innerHTML = '<i></i>自营';
    selfSoldLink.href = 'javascript:void(0);';
    selfSoldLink.classList.toggle('selected', config.selfSold);
    selfSoldLink.addEventListener('click', function() {
        selfSoldLink.classList.toggle('selected');
        config.selfSold = selfSoldLink.classList.contains('selected');
        saveConfig();
        refreshItemList();
    });

    let thirdPartyLink = document.createElement('a');
    thirdPartyLink.innerHTML = '<i></i>第三方';
    thirdPartyLink.href = 'javascript:void(0);';
    thirdPartyLink.classList.toggle('selected', config.thirdParty);
    thirdPartyLink.addEventListener('click', function() {
        thirdPartyLink.classList.toggle('selected');
        config.thirdParty = thirdPartyLink.classList.contains('selected');
        saveConfig();
        refreshItemList();
    });

    let selfSoldCheckbox = document.createElement('li');
    selfSoldCheckbox.id = 'self_sold';
    selfSoldCheckbox.appendChild(selfSoldLink);
    let thirdPartyCheckbox = document.createElement('li');
    thirdPartyCheckbox.id = 'third_party';
    thirdPartyCheckbox.appendChild(thirdPartyLink);
    let filterBar = document.querySelector('.f-feature ul');
    filterBar.appendChild(selfSoldCheckbox);
    filterBar.appendChild(thirdPartyCheckbox);
};

loadConfig();
addFilterBarCheckboxes();
refreshItemList();

