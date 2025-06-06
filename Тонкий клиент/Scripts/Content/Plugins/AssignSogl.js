$( document ).ready(function() {
	var Upravl = $("input[name='Upravl']").val();
	var vidzak = $("input[name='vidzak']").val();
	var NMCD = $("input[name='NMCD']").val();
	if(Upravl!="УСС по г. Санкт-Петербургу и ЛО"){
		$("div fieldset legend:contains('Согласующие РУСС')").closest(".column-container").hide();
	}
	if (vidzak=="Центральный аппарат"){
		$("div fieldset legend:contains('Согласующие филиала')").closest(".column-container").hide();
		$("div fieldset legend:contains('Согласующие РУСС')").closest(".column-container").hide();
	}
	if (vidzak=="Филиал" && Number(NMCD)<=100000){
		$("div fieldset legend:contains('Согласующие РУСС')").closest(".column-container").show();
	}
});