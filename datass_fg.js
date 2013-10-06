chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log(msg.imgSlug);
    var slug = msg.imgSlug;
    if(msg.type === "request") {
        chrome.storage.local.get("thing", function(r) {
            console.log("Stoarge Get: " + JSON.stringify(r));
            if($.isEmptyObject(r)) {
                console.log("Empty object in cache.");
                sendResponse({cached: true});
                return true;
            }
        });
    } else if(msg.type === "response") {
        console.log("Saving " + slug + " to local storage.");
        chrome.storage.local.set({slug: "thing"});
    }
    return true;
    //sendResponse({exists: true});
});

/*var port = chrome.runtime.connect({name: "datass"});

port.onMessage.addListener(function(msg) {
    console.log(msg);
    var slug = msg.imgSlug;
    if(slug != "") {
        console.log(slug);
        chrome.storage.local.set({slug: "test"}, function() {
            port.postMessage({added: slug});   
        });
        chrome.storage.local.get(slug, function(q) {
            console.log("get");
            console.log(q);
        });
    }
});*/

/*console.log("hey");
chrome.storage.local.set({"test": "value"});
chrome.storage.local.get("test", function(res) {
    console.log(res);
});
chrome.runtime.onMessage.addListener(function(req, sender, cb) {
    console.log(req);
    console.log(req.imgUrl);
    var url = req.imgUrl,
        img = $("img[src$='" + url + "']");
        imgCanvas = document.createElement("canvas"),
        imgContext = imgCanvas.getContext("2d");
    cb("image length: " + img.length);
    if(img.length != 0) {
        for(var i = 0; i < img.length; i++) {
            console.log(img);
            console.log(img.width);
            console.log(img.height);
            console.log("created canvas");
            $(imgCanvas).addClass("datass");
            $(".datass").hide();
            imgCanvas.width = img.width;
            imgCanvas.height = img.height;
            console.log("about to draw");
            imgContext.drawImage(img, 0, 0, img.width, img.height);
            console.log("drawn");
            var data = imgCanvas.toDataURL("image/png");
            console.log("data: " + data);
            chrome.storage.local.set({url: data}, function() {
                console.log("Saved image: " + url + " :: " + data);
            });
            $(".datass").remove();
        }
    } else {
        alert("WHAT THE HELL");
    }
});*/
