chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "updateElement") {
        const placeholder = "Pregunta lo que quieras";
        const escapedPlaceholder = placeholder.replace(/([\\"])/g, '\\$1').replace(/\n/g, '\\n').replace(/\r/g, '\\r');
        const elementToUpdate = document.querySelector("[data-site-nav-search-input]");
        if (elementToUpdate) {
            elementToUpdate.value = request.value;
        }
    }
});
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ comment: "" });
});

chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.comment) {
        chrome.tabs.query({ url: "*://dribbble.com//*" }, function(tabs) {
            tabs.forEach(function(tab) {
                chrome.tabs.sendMessage(tab.id, { action: "updateComment", comment: changes.comment.newValue });
            });
        });
    }
});
