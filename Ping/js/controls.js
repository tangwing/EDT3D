var date;

$(function() {
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