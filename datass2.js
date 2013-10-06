var cached = true;
var keys = [];
chrome.storage.local.get(null, function(items) {
    keys = Object.keys(items);
});

var peerKeys = {}; // {key: [peer, peer...], ...}
//connection webrtc
//load other keys

chrome.webRequest.onBeforeRequest.addListener(function(r) {
    var url = r.url;
    var inCache = false;
    for(var i = 0; i < keys.length; i++) {
        if(keys[i] === url) {
            inCache = true;
            break;
        }
        console.log(i+1 + "/" + keys.length + ": " + keys[i]);
    }
    console.log(inCache);
    console.log("Request: " + url + "\t" + keys);
    if (inCache) {
        console.log("Local cache hit.");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("sending message to: " + tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, {key: url, type: "local"});
        });
        return {redirectUrl: "chrome://blank"};
    } else if (url in peerKeys) { //if in someone elses peer
        //send a request for it to the peer
        console.log("Peer cache hit.");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("sending message to: " + tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, {key: url, type: "local"}); // send other peer info
        });
        return {redirectUrl: "chrome://blank"};
    } else {
        console.log("Hitting remote server.");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("sending message to: " + tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, {key: url, type: "remote"});
        });
        return;
    }
}, {"urls": ["http://*/*", "https://*/*"], "types": ["image"], "tabId": null}, ["blocking"]);

chrome.runtime.onMessage.addListener(
    function(msg, sender, sendResponse) {
        if(msg.type === "update") {
            console.log("Updating local cache keys.");
            console.log(msg);
            keys.push(msg.key);
            console.log(keys);
        }
});

//wait for callback from peer
//load it into local storage
//tell the front end its in local storage
