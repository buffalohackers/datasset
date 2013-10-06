chrome.webRequest.onBeforeRequest.addListener(function(r) {
    var url = r.url;
    console.log("Request: " + url);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("Sending a message to: " + tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {imgSlug: "thing", type: "request"}, function(resp) {
            if (!resp.cached) {
                console.log("Not cached. Attempting to get from peer.");
                return;
            }
            if(resp.failed) {
                console.log("Not in cache and not near peers. Hitting server.");
                return;
            }
            return {redirectUrl: "chrome://blank"};
        });
    });
}, {"urls": ["http://*/*", "https://*/*"], "types": ["image"], "tabId": null}, ["blocking"]);

chrome.webRequest.onCompleted.addListener(function(r) {
    var url = r.url;
    console.log("Response: " + url);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        console.log("Sending a resp message to: " + tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {imgSlug: "thing", type: "response"});
    });
}, {"urls": ["http://*/*", "https://*/*"], "types": ["image"], "tabId": null}, ["blocking"]);
