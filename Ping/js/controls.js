var date;

$(function() {
    
	window.top.$("#fileInput").filestyle({classInput: "input-small", icon: false, buttonText: "file"});
	
	window.top.$("#datepicker").datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: "dd-mm-yy",
		onClose: function(dateText) {
					if(dateText != date){
						if(file != null){
							getEventList(reader,file,yyyymmdd(dateText));
						}
						date = dateText;
					}
				}
    });
	
});