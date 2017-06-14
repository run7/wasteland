/**
 * Reload browser PAC file.
 */

Cc['@mozilla.org/network/protocol-proxy-service;1'].getService().reloadPAC();
FireGestures.setStatusText('PAC file has reloaded.');
