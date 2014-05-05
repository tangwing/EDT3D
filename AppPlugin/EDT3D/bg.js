if(chrome.browserAction){
	chrome.browserAction.onClicked.addListener(function(tab) {
		//chrome.tabs.update(tab.id, {"url":"http://baidu.com"}, function(tab){});
		var url = chrome.extension.getURL('index.html');
		chrome.tabs.update(tab.id, {"url":url}, function(tab){});
	});
}