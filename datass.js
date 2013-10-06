var p = chrome.extension.getBackgroundPage();
chrome.webRequest.onBeforeRequest.addListener(function(r) {
    var url = r.url;
    p.console.log("Request: " + url);
    if(url in images) {
       if(!images[url]) {
           return
       } 
    } else {
        // Attempt to get via peers
        images[url] = false;
        return {redirectUrl: "chrome://blank"}
    }
}, {"urls": ["http://*/*", "https://*/*"], "types": ["image"], "tabId": null}, ["blocking"]);

chrome.webRequest.onCompleted.addListener(function(r) {
    p.console.log("oncompleted");
    var urlParts = r.url.split("/");
    var slug = urlParts[urlParts.length - 1];
    p.console.log(slug);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        p.console.log("sending message to: " + tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {imgSlug: slug}, function(resp) {
            console.log(_port);
            p.console.log("Added: " + resp.added);   
        });
    });
}, {"urls": ["http://*/*", "https://*/*"], "types": ["image"], "tabId": null});
