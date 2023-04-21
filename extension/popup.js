document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get(['inputValue'], function(result) {
        if (result.inputValue) {
            document.getElementById('textInput').value = result.inputValue;
        }
    });

    document.getElementById('addButton').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var currentUrl = tabs[0].url;
            var text = document.getElementById('textInput').value;

            chrome.storage.local.get('urls', function(result) {
                var urls = result.urls || [];

                urls.push({currentUrl, text});

                chrome.storage.local.set({'urls': urls}, function() {
                    console.log('URL added to list');
                    setStatusMessage("URL added to list");
                });
            });
        });
    });

    document.getElementById('clearButton').addEventListener('click', function() { 
        var urls = [];
        chrome.storage.local.set({ 'urls': urls });

        setStatusMessage("Data Cleared");
    });

    document.getElementById('exportButton').addEventListener('click', function() {
        chrome.storage.local.get('urls', function(result) {
            var urls = result.urls || [];

            var json = JSON.stringify(urls);
            var blob = new Blob([json], {type: 'application/json'});

            chrome.downloads.download({
                url: URL.createObjectURL(blob),
                filename: 'urls.json',
                saveAs: true
            }, function(downloadId) {
                setStatusMessage("JSON file downloaded with ID: " + downloadId);
                console.log('JSON file downloaded with ID: ' + downloadId);
            });
        });
    });

    document.getElementById('textInput').addEventListener('input', function() {
        chrome.storage.local.set({inputValue: document.getElementById('textInput').value});
    });
      

    function setStatusMessage(message) {
        document.getElementById('statusMessage').textContent = message;

        setTimeout(function() {
            document.getElementById('statusMessage').textContent = '';
        }, 3000);
    }
});
