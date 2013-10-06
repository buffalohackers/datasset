var cached = true;
var keys = [];
setInterval(function() {
    sendCommand('getKeys');
}, 4000);

var peerKeys = {}; // {key: [peer, peer...], ...}

onmessagecallback = function(message) {
    console.log('DATA' + message.data);
    if (message.data == "getKeys") {
        console.log('SENDNIG KEYS');
        sendCommand(keys.join(','));
    } else if (message.data.split(':').length > 1) {
        var mess = message.data.split(':', 3);
        if (mess[0] == 'getImage') {
            sendLarge('image:' + mess[1] + ':' + chrome.storage.local.get(mess[1]));
        } else if (mess[0] == 'image') {
            var url = mess[1],
            urlParts = url.split("/"),
            filename = urlParts[urlParts.length - 1],
            data = mess[2];

            var store = {},
                raw = {};
            store["key"] = url;
            store["data"] = data;
            store["filename"] = filename;
            raw[url] = store;
            console.log("Storing: " + JSON.stringify(store));
            chrome.storage.local.set(raw);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.tabs.sendMessage(tabs[0].id, {key: url, type: "local"});
            });
        }

    } else {
        console.log(message.data);
        peerKeys = message.data.split(',');
        console.log('GOT PEER KEYS');
        console.log(peerKeys);
    }
}
chrome.storage.local.get(null, function(items) {
    keys = Object.keys(items);
    makeConnection('omgdoesitwork', function (id) {
        console.log('first attempt conn');
    });
});


chrome.webRequest.onBeforeRequest.addListener(function(r) {
    var url = r.url;
    var inCache = false;
    for(var i = 0; i < keys.length; i++) {
        if(keys[i] === url) {
            inCache = true;
            break;
        }
    }
    console.log("Request: " + url + "\t" + keys);
    if (inCache) {
        console.log("Local cache hit.");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("sending message to: " + tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, {key: url, type: "local"});
        });
        return {redirectUrl: "chrome://blank"};
    } else if (peerKeys != undefined && url != undefined && hasOwnProperty(peerKeys, url)) { //if in someone elses peer
        //send a request for it to the peer
        sendCommand('getImage:' + url);
        console.log("Peer cache hit.");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("sending message to: " + tabs[0].id);
            chrome.tabs.sendMessage(tabs[0].id, {key: url, type: "local"}); // send other peer info
        });
        return {redirectUrl: "chrome://blank"};
    } else {
        console.log("Hitting remote server.");
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            console.log("inside");
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
