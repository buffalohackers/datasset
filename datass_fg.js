chrome.runtime.onMessage.addListener(function(msg, sender, sendMessage) {
    // Local cache image
    if(msg.type === "local") {
        chrome.storage.local.get(msg.key, function(item) {
            console.log(item);
            console.log(item[msg.key].data);
            // Swap the img src with bytes
            var i = $("img[src$='" + item[msg.key].filename + "']").attr("src", item[msg.key].data);
            console.log(i);
        });
    } else if(msg.type === "remote") {
        console.log('hfdfksadlfklsdkl;fad');
        // Image was fetched from a remote server 
        var store = {},
            url = msg.key,
            urlParts = url.split("/"),
            filename = urlParts[urlParts.length - 1],
            
            img = new Image(),
            imgWidth = 0,
            imgHeight = 0,

            imgCanvas = document.createElement("canvas"),
            imgContext = imgCanvas.getContext("2d");

            console.log('WAITING');
            img.onload = function() {
                console.log('test');
                // YOLO
                imgWidth = this.width;
                imgHeight = this.height;
                console.log(imgWidth);
                console.log(imgHeight);
                console.log("created canvas");
                $(imgCanvas).addClass("datass");
                imgCanvas.width = imgWidth;
                imgCanvas.height = imgHeight;
                console.log("about to draw");
                imgContext.drawImage(this, 0, 0, imgWidth, imgHeight);
                console.log("drawn");
                // Convert to base64
                var data = imgCanvas.toDataURL("image/png");
                console.log("data: " + data);
                var raw = {};
                store["key"] = url;
                store["data"] = data;
                store["filename"] = filename;
                raw[url] = store;
                console.log("Storing: " + JSON.stringify(store));
                // Store in local storage
                chrome.storage.local.set(raw);
                store["type"] = "update";
                // Send message to update backend keys
                chrome.runtime.sendMessage(store);
            };
            img.src = url;
    }
});
