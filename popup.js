window.onload = function (e) {
    try {
        chrome.tabs.query({ currentWindow: true }, async function (result) {
            result.forEach(async function (tab) {
                var i = 0;
                if (tab.active === true) {
                    if (i === 0) {
                        chrome.cookies.getAll({ domain: "medium.com" }, function (cookies) {
                            for (var i = 0; i < cookies.length; i++) {
                                chrome.cookies.remove({ url: "https://medium.com" + cookies[i].path, name: cookies[i].name });
                            }
                            chrome.storage.local.set({
                                url: tab.url
                            }, function () {
                            });
                            chrome.tabs.executeScript(
                                tab.id, {
                                code: `
                                localStorage.clear();
                                chrome.storage.local.get('url', function (items) {
                                    window.location.href = items.url;
                                  });
                                `},
                                function () {
                                    window.close();
                                }
                            );
                        });
                    }
                    i++;
                }
            });
        });
    }
    catch (err) {
        alert(err);
    }
}