var eventList = []; //global
var class_status = []; //Class, Finished, NotStarted
var file;
var reader;
window.onload = function()
{//Deal with file change event
	var fileInput=window.top.document.getElementById('fileInput');
	//var fileContent = document.getElementById('parseResult');
	fileInput.addEventListener('change', function(e){
		eventList = [];
		class_status = [];
		file = fileInput.files[0];
		if(true)	//always
		{	
			reader = new FileReader();
			reader.onload = function(){
				if(date == null)
					getEventList(this, file,new Date().yyyymmdd());
				else
					getEventList(this, file,yyyymmdd(date));
			}
			reader.readAsText(file);
			
			window.top.$("#datepicker").removeAttr("disabled"); 
			
		}else{
			fileContent.innerText = "File type not supported!"
			window.top.$("#datepicker").attr("disabled","disabled"); 
		}
	});
}

///
/// Analyse the ics file and reture the eventlist of the specified date
///
function getEventList(reader, file, date)
{
	var regEvent = new RegExp("BEGIN:VEVENT[\\s\\S]{1,40}DTSTART:"+date+"[\\s\\S]{1,500}END:VEVENT", "g");
	//fileContent.innerText = reader.result.match(regEvent);
	var regTmp = new RegExp("(,?\"[A-Z-]*):","g");
	var result = reader.result.match(regEvent);
	if(result != null)
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
		eventList.forEach(function(v, ind){
			class_status.push(getClassStatus(v.TBEGIN, v.TEND));
			log("Cours "+ind +":");
			log(v.TBEGIN.getHours()+":"+v.TBEGIN.getMinutes()+ " -> " + (v.TEND.getHours())+":"+v.TEND.getMinutes());
			//log(v.TBEGIN);
			log(v.SUMMARY);
			log(v.LOCATION);
		});

		//If no class under way
		// if(class_status.indexOf("Class") == -1)
		// {
		// 	var index = class_status.indexOf("NotStarted");
		// 	if(index != -1)
		// 		class_status[index] = "Class"; //?Case insensitive?
		// }
			
		//Update room colors
		eventList.forEach(function(v,index){
			log($.trim(v.LOCATION) == "")
			log($.trim(v.LOCATION) === "")
			if($.trim(v.LOCATION) === ""){ //Show in text
				var info = window.top.$("#classinfo").text() + 
					v.TBEGIN.getHours()+":"+v.TBEGIN.getMinutes()+ " -> " + 
					(v.TEND.getHours())+":"+v.TEND.getMinutes() + "\n" + v.SUMMARY + "\n" +v.LOCATION +
					"\n\n=======\n\n";
				window.top.$("#classinfo").text(info);
			}else	change_salle_stats(v.LOCATION, class_status[index]); //?
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
	else if(now.getHours()< endTime.getHours() || ( now.getHours() == endTime.getHours() && now.getMinutes()< endTime.getMinutes())){
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