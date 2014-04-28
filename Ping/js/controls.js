var date;
var salle_changed;

$(function() {
	window.top.$("#fileInput").filestyle({classInput: "input-small", icon: false, buttonText: "file"});
	
	window.top.$("#datepicker").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "dd-mm-yy",
		onClose: function(dateText) {
					clear_salle();
					scene.remove(tubeMesh);
					if(dateText != date){
						if(file != null){
							getEventList(reader,file,yyyymmdd(dateText));
						}
						date = dateText;
					}
				}
    });
	
	window.top.$("#refresh_classroom").click(function(){
		clear_salle_find();
		salle_changed = window.top.$("#classroom").find("option:selected").text();
		change_salle_stats(salle_changed,"Finded");
	});

	window.top.$("select").change(function(){
		clear_salle_find();
		salle_changed = window.top.$("#classroom").find("option:selected").text();
		change_salle_stats(salle_changed,"Finded");
	});
	
	window.top.$("#clear_classroom").click(function(){
		clear_salle_find();
	});
	
	window.top.$("#refresh_path").click(function(){
		
		var start = window.top.$("#path_start").find("option:selected").text();
		var end = window.top.$("#path_end").find("option:selected").text();
		
		var indexStart = search_point_by_name(start);
		var indexEnd = search_point_by_name(end);
		
		if(indexStart != -1 && indexEnd != -1)
		{		
			var graph = getRoomGraph();
			var path = graph.dijkstra(indexStart,indexEnd); 
			log(path.toString());
			draw_path(path);
		}
	});
	
	window.top.$('#anim_path').click(function(){
		log(animCamEnabled)
		animCamEnabled = true;
	});
	initSelectControl();
});

function clear_salle_find(){
	if(salle_changed != null){
		for(var i=0; i<eventList.length ; i++){
			if(salle_changed == eventList.LOCATION){
				change_salle_stats(salle_changed, class_status[i]);
				break;
			}
		}
		if(i == eventList.length)
			change_salle_stats(salle_changed, "Blank");
		salle_changed = null;
	}
}

function clear_salle(){
	eventList.forEach(function(value){
		change_salle_stats(value.LOCATION, "Blank");
	});
}

function initSelectControl(){
	salles.forEach(function(value){
		if(value.name != ""){
			window.top.$("#path_start").append("<option value="+value.name+">"+value.name+"</option>"); 
			window.top.$("#path_end").append("<option value="+value.name+">"+value.name+"</option>"); 
			window.top.$("#classroom").append("<option value="+value.name+">"+value.name+"</option>"); 
		}
	});
}