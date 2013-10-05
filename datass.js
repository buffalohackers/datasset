chrome.webRequest.onBeforeRequest.addListener(function(r) {
    p.console.log(r.url);
    return {redirectUrl: "chrome://blank"}
}, {"urls": ["http://*/*", "https://*/*"], "types": ["image"]}, ["blocking"]);
