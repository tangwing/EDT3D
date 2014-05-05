if(chrome.browserAction){
	chrome.browserAction.onClicked.addListener(function(tab) {
		//chrome.tabs.update(tab.id, {"url":"http://baidu.com"}, function(tab){});
		var url = chrome.extension.getURL('index.html');
		chrome.tabs.update(tab.id, {"url":url}, function(tab){});
	});
}

var eventList = []; //global
var class_status = []; //Class, Finished, NotStarted
var file;
var reader;
var DATA = "";
window.onload = function()
{//Deal with file change event
	var fileInput=window.top.document.getElementById('fileInput');
	//var fileContent = document.getElementById('parseResult');
	fileInput.addEventListener('change', function(e){
		file = fileInput.files[0];
		//alert(file)
		if(file)	//always
		{	//alert("in")
			reader = new FileReader();
			reader.onload = function(){
				DATA = this.result;
				if(date == null)
					getEventList(this.result,new Date().yyyymmdd());
				else
					getEventList(this.result, yyyymmdd(date));
			}
			reader.readAsText(file);
			
			window.top.$("#datepicker").removeAttr("disabled"); 
			
		}else{
			//fileContent.innerText = "File type not supported!"
			//window.top.$("#datepicker").attr("disabled","disabled"); 
		}
	});
	//url logic
	var urlInput=window.top.$('#urlInput');
	var btnUrl=window.top.$('#btnUrl');
	//var fileContent = document.getElementById('parseResult');
	btnUrl.click(function(e){
		calurl = urlInput.val().replace(/\s/g, "");

		if(calurl){
			//alert("/getcal.php?u='"+calurl+"'")
			$.ajax({
			  async: false,
			  url:"/getcal.php?u="+calurl,
			  success: function (data){
			  	if(data.indexOf("BEGIN") != 0)//not good
			  		alert("Failed to download data : "+data)
			  	else{
			  		DATA = data;
			  		if(date == null)
			  			getEventList(data,new Date().yyyymmdd());
			  		else
			  			getEventList(data,yyyymmdd(date));
			  		window.top.$("#datepicker").removeAttr("disabled"); 
			  		localStorage.setItem("calurl", calurl);
			  	}
			  },
			  error: function(err, status, exception){
			  		alert("Failed to download data :"+err+"!");
			  		window.top.$("#datepicker").attr("disabled","disabled"); 
			  	}
			  });				
		}
	});

	//Load file(not supported!)/url from localstorage
	var calurl = localStorage.getItem("calurl");
	//alert(calurl)
	if(calurl){
		window.top.$("#urlInput").val(calurl);
		btnUrl.click();
	}
}

///
/// Analyse the ics file and reture the eventlist of the specified date
/// ! use str first if possible. This means the calendar file content.
function getEventList(str, date)
{
	var regEvent = new RegExp("BEGIN:VEVENT[\\s\\S]{1,40}DTSTART:"+date+"[\\s\\S]{1,500}END:VEVENT", "g");
	//fileContent.innerText = reader.result.match(regEvent);
	var regTmp = new RegExp("(,?\"[A-Z-]*):","g");
	var result = str.match(regEvent);
	if(result != null && result != "")
	{
		eventList = []; 
		class_status = [];
		result.forEach(function(e){
			var json = "{"+
							e.replace(/BEGIN:VEVENT\r?\n/g,"\"") //remove the beginning
							.replace(/\r?\nEND:VEVENT/g,"\"")	 //remove the end
							.replace(/\r?\n([^A-Z])/g, "$1")	 //remove illegal new line
							.replace(/\r?\n/g,"\",\"")			 //new line to ,
							.replace(regTmp, "$1\":\"")		 //: to ":"
					+"}";
			log(json);
			var cours = JSON.parse(json);
			cours.TBEGIN = new Date().fromStampICS(cours.DTSTART);
			cours.TEND = new Date().fromStampICS(cours.DTEND);
			eventList.push(cours);
		});
						
		eventList.sort(function(a,b){
			return a.TBEGIN.getHours() - b.TBEGIN.getHours();
		});
		//Now we get all event of today in the list
		log(eventList.length);
		//Now we have eventList, attaching it to rooms
		window.top.$("#classinfo").text("")
		eventList.forEach(function(v, ind){
			//debugger
			class_status.push(getClassStatus(v.TBEGIN, v.TEND));
			log("Cours "+ind +":");
			log(v.TBEGIN.getHours()+":"+v.TBEGIN.getMinutes()+ " -> " + (v.TEND.getHours())+":"+v.TEND.getMinutes());
			log(v.SUMMARY);
			log(v.LOCATION);
			var info = window.top.$("#classinfo").text() + "=======\n" +
				v.TBEGIN.getHours()+":"+v.TBEGIN.getMinutes()+ " -> " + 
				(v.TEND.getHours())+":"+v.TEND.getMinutes() + "\n" + v.SUMMARY + "\n" +v.LOCATION +
				"\n\n";
			window.top.$("#classinfo").text(info);
			log(class_status)
			change_salle_stats(v.LOCATION, class_status[ind]); //?
		});

		//Show shortest path
		setPathControl();
	}
}

/// Get the realtime status of a class event
function getClassStatus(startTime, endTime){
	var now = new Date();
	if(now.getHours()< startTime.getHours() || ( now.getHours() == startTime.getHours() && now.getMinutes()< startTime.getMinutes())){
		return "NotStarted";
	}
	else if(now.getHours()< endTime.getHours() ||  
			(now.getHours() == endTime.getHours() && now.getMinutes()< endTime.getMinutes())){
		return "Class";
	}
	else {
		return "Finished";
	}
}

/// Get class status according to current time
function changeClassStatus(startTime, endTime){
	var now = new Date();
	eventList.forEach(function(value, index){
		class_status[index] = getClassStatus(value.TBEGIN, value.TEND);
	});
}

/// Draw path to the next classroom
function setPathControl(){
	var start, end, index;
	index = class_status.lastIndexOf("Class");
	if( index != -1 ) 
		start = eventList[index].LOCATION;					//Start from the current room
	else {
		index = class_status.lastIndexOf("Finished");
		if(index != -1) start = eventList[index].LOCATION;  //Start from last room
		else start = "Entrance";							//Start from entrance
	}

	index = class_status.indexOf("NotStarted");
	if( index != -1 ) 
		end = eventList[index].LOCATION;				//To next room
	else	end = "Entrance";							//No more classes !!!
	
	
	if( start != "Entrance" || end != "Entrance"){
		var indexStart = search_point_by_name(start);
		var indexEnd = search_point_by_name(end);
		
		if(indexStart != -1 && indexEnd != -1)
		{
			setSelected("path_start",start);	
			setSelected("path_end",end);
			//window.top.$("#path_start option[text='"+start+"']").attr("selected",true);
			//window.top.$("#path_end option[text='"+end+"']").attr("selected",true);			
			var graph = getRoomGraph();
			var path = graph.dijkstra(indexStart,indexEnd); 
			log(path.toString());
			draw_path(path);
		}
	}
}

//Update select list
function setSelected(id,name){
	var options = window.top.$("#"+id+" option");
	for(var i=0; i<options.length; i++){
		if(options[i].text == name){
			window.top.$("#"+id).get(0).selectedIndex=i;
			break;
		}
	}
}