chrome.browserAction.onClicked.addListener(function(tab) {
	//chrome.tabs.update(tab.id, {"url":"http://baidu.com"}, function(tab){});
	var url = chrome.extension.getURL('test.html');
	chrome.tabs.update(tab.id, {"url":url}, function(tab){});
});

var calurl = "http://ade.univ-tours.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?data=8241fc38732002144f7500da3c723b46e0fa50826f0818af2370d544632bbb83906f45af276f59aec18424f8595af9f973866adc6bb17503";

var fileContent = document.getElementById('parseResult');
var getTxt = function (){
	  $.ajax({
	  url:calurl,
	  success: function (data){
	  alert(data)
	  //parse ur data
	  //you can split into lines using data.split('\n') 
	  //use regex functions to effectivley parse
	  fileContent.innerText = data;
  	}
  });
}

if(typeof(Storage)!=="undefined")
  {
  // Code for localStorage/sessionStorage.
  var test = localStorage.getItem("test");
  alert("test="+test);
    localStorage.setItem("test", "hehe");
  }
else
  {
  // Sorry! No Web Storage support..
  alert("not support")
  }
