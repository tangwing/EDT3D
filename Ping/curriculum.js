var eventList = []; //global

window.onload = function()
{
	
	var fileInput=document.getElementById('fileInput');
	//var fileContent = document.getElementById('parseResult');
	fileInput.addEventListener('change', function(e){
		eventList = [];
		var file = fileInput.files[0];
		//Not testing file type
		if(true)
		{
			var reader = new FileReader();
			reader.onload = function(){
				var regEvent = new RegExp("BEGIN:VEVENT[\\s\\S]{1,40}DTSTART:"+new Date().yyyymmdd()+"[\\s\\S]{1,500}END:VEVENT", "g");
					
					//fileContent.innerText = reader.result.match(regEvent);
						
					var regTmp = new RegExp("(,?\"[A-Z-]*):","g");
					reader.result.match(regEvent).forEach(function(e){
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
					log("Cours "+ind +":");
					log(v.TBEGIN.getHours()-1 +":"+v.TBEGIN.getMinutes()+ " -> " + (v.TEND.getHours()-1)+":"+v.TEND.getMinutes());
					log(v.TBEGIN);
					log(v.SUMMARY);
					log(v.LOCATION);
					})
				};
				reader.readAsText(file);
				
				/*------------------ping----------------------*/
				
				
		}else fileContent.innerText = "File type not supported!"
	});
}

class_status = function(location, startTime, endTime, status){
	this
};

function getClassStatus(startTime, endTime){
	var now = new Date();
	if(now.getHours()<= startTime.getHours() && now.getMinutes()< startTime.getMinutes()){
		return "NotStarted";
	}
	else if(now.getHours()<= endTime.getHours() && now.getMinutes()< endTime.getMinutes()){
		return "Class";
	}
	else return "Finished";
}
