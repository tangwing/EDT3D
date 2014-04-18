var eventList = []; //global
var class_status = [];
var file;
var reader;
window.onload = function()
{
	var fileInput=window.top.document.getElementById('fileInput');
	//var fileContent = document.getElementById('parseResult');
	fileInput.addEventListener('change', function(e){
		eventList = [];
		file = fileInput.files[0];
		if(true)
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
			window.top.$("#path_start").removeAttr("disabled"); 
			window.top.$("#path_end").removeAttr("disabled"); 
			
			initialPathControl();
			
		}else{
			fileContent.innerText = "File type not supported!"
			
			window.top.$("#datepicker").attr("disabled","disabled"); 
			window.top.$("#path_start").attr("disabled","disabled"); 
			window.top.$("#path_end").attr("disabled","disabled"); 
		}
		//Not testing file type
	});
}

function getEventList(reader, file, date)
{
	var regEvent = new RegExp("BEGIN:VEVENT[\\s\\S]{1,40}DTSTART:"+date+"[\\s\\S]{1,500}END:VEVENT", "g");
					
	//fileContent.innerText = reader.result.match(regEvent);
						
	var regTmp = new RegExp("(,?\"[A-Z-]*):","g");
	var result = reader.result.match(regEvent);
	if(result != null)
	{
		eventList = []; 
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
						
		//Now we get all event of today in the list
		log(eventList.length);
		//Now we have eventList, attaching it to rooms
		eventList.forEach(function(v, ind){
			class_status.push(getClassStatus(v.TBEGIN, v.TEND));
			log("Cours "+ind +":");
			log(v.TBEGIN.getHours()-1 +":"+v.TBEGIN.getMinutes()+ " -> " + (v.TEND.getHours()-1)+":"+v.TEND.getMinutes());
			log(v.TBEGIN);
			log(v.SUMMARY);
			log(v.LOCATION);
		});
				
		if(class_status.indexOf("class") == -1)
		{
			var index = class_status.indexOf("NotStarted");
			if(index != -1)
				class_status[index] = "class";
		}
			
		eventList.forEach(function(value,index){
			change_salle_stats(value.LOCATION, class_status[index]);
		});
		
		setPathControl();
	}
		
}

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

function changeClassStatus(startTime, endTime){
	var now = new Date();
	eventList.forEach(function(value,index){
		class_status[index] = getClassStatus(value.TBEGIN, value.TEND);
	});
}

function initialPathControl(){
	salles.forEach(function(value){
		if(value.name != ""){
			window.top.$("#path_start").append("<option value="+value.name+">"+value.name+"</option>"); 
			window.top.$("#path_end").append("<option value="+value.name+">"+value.name+"</option>"); 
		}
	});
}

function setPathControl(){

	var start, end;
	
	var index = class_status.indexOf("Finished");
	if( index != -1 ) 
		start = eventList[index].LOCATION;
	if(start == null || start == "")
		start = "Entrance";
		
	index = class_status.indexOf("Class");
	if( index != -1 ) 
		end = eventList[index].LOCATION;
	if(end == null || end == "")
	{
		index = class_status.indexOf("NotStarted");
		if( index != -1 ) 
			end = eventList[index].LOCATION;
	}
	
	if(end == null || end == "")
	{
		end = "Entrance";
	}
	
	if( start != "Entrance" || end != "Entrance"){
		var indexStart = search_point_by_name(start);
		var indexEnd = search_point_by_name(end);
		
		if(indexStart != -1 && indexEnd != -1)
		{
			window.top.$("#path_start").val(start);
			window.top.$("#path_end").val(end); 			
			var graph = getRoomGraph();
			var path = graph.dijkstra(indexStart,indexEnd); //从oc到turing怎么走？！
			log(path.toString());
			draw_path(path)
		}
	}
	
}