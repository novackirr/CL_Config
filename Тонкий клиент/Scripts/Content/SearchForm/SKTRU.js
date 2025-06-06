$(document).ready(function () {

	var KTRU = $("input[name='KTRU']");
	var KTRU_Code = $("input[name='KTRU_Code']");
	var KTRUName = $("input[name='KTRUName']");	
	var OKDP = $("input[name='OKDP']");
	var OKDPName = $("input[name='OKDPName']");

	var edit_display = function () {
		var KTRU = $("input[name='KTRU']");
		var KTRUName = $("input[name='KTRUName']");
		var KTRU_Code = $("input[name='KTRU_Code']");
		var OKDPName = $("input[name='OKDPName']");
		
		KTRU.closest(".column-container").attr('class','column-container col-sm-4');
		KTRUName.closest(".column-container").attr('class','column-container col-sm-8');
		KTRU_Code.closest(".column-container").attr('class','column-container col-sm-4');
		OKDPName.closest(".column-container").attr('class','column-container col-sm-8');		
	};		
	
	KTRU.parent().find(".dict-display-field").change(function () {
		if ($(this).val() !== "") {
			KTRU_Code.parent().find(".dict-display-field").val('');
			KTRU_Code.val('');
			OKDP.val('');
			OKDPName.val('');
		}
	});
	
	KTRU_Code.parent().find(".dict-display-field").change(function () {
		if ($(this).val() !== "") {
			KTRU.parent().find(".dict-display-field").val('');
			KTRU.val('');
			KTRUName.val('');
		}
	});

	$("div[data-collapsed-caption='Показать фильтр']").hide();
	edit_display();
});
