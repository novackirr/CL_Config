function maskKontTel() {
	$("input[name='kontTel']").one('click', function() {
	 $("input[name='kontTel']").inputmask({"mask": "+9{1,5}(9{1,6})9{5,12}"});
	});
}
maskKontTel()

var editreg = function () {
	var naimETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text()	
	$("input[data-field-name='naimETP']").hide();	
	$("input[data-field-name='naimETP']").val(naimETP);
}

editreg();