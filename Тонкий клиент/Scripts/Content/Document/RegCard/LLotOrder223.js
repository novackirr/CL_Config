"use strict";

// подгружаем справочник ВалютаСбер
var SberASTCurrensyDictionaries ; // массив где находится справочник СберАСт

var LoadSberAstCurrensyDict = function() {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	if (ETPid == 2) {
		getDictionaryItems('ВалютаСбер', '', '', '', ["code"],
			function(data){
				SberASTCurrensyDictionaries = data.children;
			},
			function(data){
				console.log(data);
			}
		)
	}
}

var reg = function() {
	let Currency_kodOb = $("#Currency_kodOb");
	$("li:has(:contains('Скрытые поля'))").hide();
	$("li:has(:contains('Замечания и предложения от УО'))").hide();
	$("li:has(:contains('Победители таблица'))").hide();
	//$("li:has(:contains('Позиции таблица'))").hide();
	$("li:has(:contains('Критерии оценки'))").hide();
	$("li:has(:contains('Требования к участникам'))").hide();
	$("li:has(:contains('Особенности размещения'))").hide();
	$("input[data-field-name='planDateIsp']").closest(".column-container").hide();
	$("textarea[data-field-name='registerObIzm']").closest(".column-container").hide();
	$("div[data-label-name='Обоснование внесения изменений']").closest(".column-container").hide();
	Currency_kodOb.prop("disabled", true);
	$("button[id='Currency_kod']").attr('disabled', true);
	$("input[data-field-name='registerPlasePos']").prop('required', false);
	$("textarea[name='registerPlasePos']").prop("required", false);
	$("button[id='registerOKDP']").attr('disabled', true);
}

/* $("li:has(:contains('Маршруты'))").hide(); */

var edit = function() {
	
	$("li:has(:contains('Скрытые поля'))").hide();
	$("li:has(:contains('Замечания и предложения от УО'))").hide();
	$("textarea[data-field-name='registerObIzm']").closest(".column-container").hide();
	$("div[data-label-name='Обоснование внесения изменений']").closest(".column-container").hide();
	$("input[data-field-name='registerPlasePos']").prop('required', false);
	$("textarea[name='registerPlasePos']").prop("required", false);
	$("li:has(:contains('Победители таблица'))").hide();
	//$("li:has(:contains('Позиции таблица'))").hide();
	$("button[id='Currency_kod']").attr('disabled', true);
	$("div[data-name='ItemTab']").find('.table-add-row-button').closest('.table-edit-column').hide();
	$("div[data-name='ItemTab']").find('.table-remove-row-button').closest('.table-edit-column').hide();
	$("button[id='registerOKDP']").attr('disabled', true);
}

var hideblockchangeedit=function() {
	var regstatus = $("input[name='regstatus']");
	var otmena = $("input[name='otmena']");
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	
	var Change = $("li:has(:contains('Отмена'))");
	if($(otmena).is(":checked" && ETPid != 2)){
		Change.show();
	}
	else{
		Change.hide();
	}
}

function CancelHideView(){
	let naimETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	let otmena = $(".documentView-field-value[data-name='Отмена лота']");
	let otmenaForceMajeure = $(".documentView-field-value[data-name='Закупка отменяется вследствие возникновения обстоятельств непреодолимой силы в соответствии с гражданским законодательством']");
	if($(otmena).attr("title") == "1"){
		$("li:has(:contains('Отмена'))").show();
		if(naimETP === "АО &quot;МСП-ЕЭТП&quot;"){
			$(otmenaForceMajeure).closest(".column-container").show();
		}
		else{
			$(otmenaForceMajeure).closest(".column-container").hide();
		}
	}
	else{
		$(otmena).closest(".row").hide();
		$("li:has(:contains('Отмена'))").hide();
	}
}

var hidecategoryview = function() {
    var KatZak = $("div[data-name='Категория закупки, которая не учитывается при расчёте совокупного годового стоимостного объёма договоров']");
    var flag = $("div[data-name='Закупка не учитывается при расчёте совокупного годового стоимостного объёма договоров']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        showViewElementColumn(KatZak);
		} else {
        hideViewElementColumn(KatZak);;		
	}
};

var hidesizepurchasereg = function() {
	var flag = $("input[data-field-name='registerObZa']");
	var registerBG = $("input[data-field-name='registerBG']");
	var flag1 = $("input[data-field-name='registerUchZakSMP']");
	var SposobPredOb=$("input[name='SposobPredOb']");
	var PerechDS=$("textarea[data-field-name='PerechDS']");
	var VidPoluch=$("textarea[data-field-name='VidPoluch']");
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	
	if (ETPid != 2) {
	
		if ($(flag).is(":checked")) {
			
			filedShowAndRequired(['registerRazmOb', 'RazmObProc', 'Currency_kodOb']);
			filedShow(['registerBG', 'SposobPredOb']);
			
			if($(registerBG).is(":checked")) {
				$("input[data-field-name='SposobPredOb']").prop("required", false);
				$("[data-related-field=SposobPredOb]").removeClass("label-required");
			} else {
				filedShowAndRequired(['SposobPredOb']);
			}
			
			if (SposobPredOb.val()=="Путем перечисления денежных средств на реквизиты заказчика") {
				
				filedShowAndRequired(['PerechDS']);
				filedHideAndNotRequired(['VidPoluch']);
				
				if (PerechDS.val()=="Перечисление денежных средств осуществляется на указанные ниже реквизиты") {
					filedShowAndRequired(['VidPoluch']);

					if (VidPoluch.val()=="Бюджетное учреждение (перевод средств осуществляется в одно из подразделений Центрального банка РФ)") {
						filedShowAndRequired(['PoluchBIK', 'PoluchRS', 'Poluch', 'PoluchBank', 'PoluchBankAddress', 'PoluchINN', 'PoluchKPP', 'PoluchOKTMO', 'PoluchKBK', 'PoluchUIN', 'PoluchKS']);
						filedShow(['PoluchLS']);
					} 
					else if (VidPoluch.val()=="Небюджетное учреждение (перевод средств осуществляется на счет кредитной организации)")  {
						filedShowAndRequired(['PoluchBIK', 'PoluchRS', 'Poluch', 'PoluchBank', 'PoluchBankAddress', 'PoluchINN', 'PoluchKPP', 'PoluchOKTMO', 'PoluchKBK', 'PoluchUIN', 'PoluchKS']);
						filedHideAndNotRequired(['PoluchLS']);

					}
					else if (VidPoluch.val()=="") {
						filedHideAndNotRequired(['PoluchBIK', 'PoluchRS', 'Poluch', 'PoluchBank', 'PoluchBankAddress', 'PoluchINN', 'PoluchKPP', 'PoluchOKTMO', 'PoluchKBK', 'PoluchUIN', 'PoluchKS', 'PoluchLS']);
						
					}
				} else {
					filedHideAndNotRequired(['PoluchBIK', 'PoluchRS', 'Poluch', 'PoluchBank', 'PoluchBankAddress', 'PoluchINN', 'PoluchKPP', 'PoluchOKTMO', 'PoluchKBK', 'PoluchUIN', 'PoluchKS', 'PoluchLS', 'VidPoluch']);
				}
			} else {
				filedHideAndNotRequired(['PoluchBIK', 'PoluchRS', 'Poluch', 'PoluchBank', 'PoluchBankAddress', 'PoluchINN', 'PoluchKPP', 'PoluchOKTMO', 'PoluchKBK', 'PoluchUIN', 'PoluchKS', 'PoluchLS', 'VidPoluch', 'PerechDS']);
			}
		} else {
			filedClearAndHide(['registerRazmOb', 'RazmObProc']);
			filedHideAndNotRequired(['PoluchBIK', 'PoluchRS', 'Poluch', 'PoluchBank', 'PoluchBankAddress', 'PoluchINN', 'PoluchKPP', 'PoluchOKTMO', 'PoluchKBK', 'PoluchUIN', 'PoluchKS', 'PoluchLS', 'VidPoluch', 'SposobPredOb', 'PerechDS', 'Currency_kodOb','registerBG']);
		}
		
		if ($(flag).is(":checked") && $(flag1).is(":checked")) {
			filedShowAndRequired(['otherTreb']);
			filedHideAndNotRequired(['SposobPredOb']);
			filedClearAndHide(['registerBG']);

		} else {
			filedClearAndHide(['otherTreb']);
		}
	}
	else if(ETPid == 2){
		filedHideAndNotRequired(['PoluchBIK', 'PoluchRS', 'Poluch', 'PoluchBank', 'PoluchBankAddress', 'PoluchINN', 'PoluchKPP', 'PoluchOKTMO', 'PoluchKBK', 'PoluchUIN', 'PoluchKS', 'PoluchLS', 'VidPoluch', 'SposobPredOb', 'PerechDS','registerBG']);
	}
}

// Если валюта обеспечения пустое то по дефолту копирую основную валюту лота
function Currency_kodObDefaultLogic() {
	var Currency_kodOb = $("input[data-field-name='Currency_kodOb']");
	var bidcompletingsupplyneededcode = $("input[data-field-name='bidcompletingsupplyneededcode']"); // валюта Обеспечение исполнения договора
	if (!Currency_kodOb.val()) {
		$("input[data-field-name='Currency_kodOb']").val($("input[data-field-name='Currency_kod']").val());
		$("input[name='Currency_kodOb']").val($("input[name='Currency_kod']").val());
		$("input[name='CurrencyOb']").val($("input[name='Currency']").val());
		$("input[name='Currency_dig_kodOb']").val($("input[name='Currency_dig_kod']").val());
	}
	
	if (!bidcompletingsupplyneededcode.val()) {
		$("input[data-field-name='bidcompletingsupplyneededcode']").val($("input[data-field-name='Currency_kod']").val());
		$("input[name='bidcompletingsupplyneededcode']").val($("input[name='Currency_kod']").val());
		$("input[name='bidcompletingsupplyneededname']").val($("input[name='Currency']").val());
		$("input[name='bidcompletingsupplyneeded_dig_kod']").val($("input[name='Currency_dig_kod']").val());
	}
}

$(document).on('change', "input[data-field-name='registerObZa']", function (e) {
	hidesizepurchasereg();	
});

$(document).on('change', "input[data-field-name='registerBG']", function (e) {
	hidesizepurchasereg();	
});

$(document).on('change', "input[data-field-name='SposobPredOb']", function (e) {
	hidesizepurchasereg();
});

$(document).on('change', "textarea[data-field-name='PerechDS']", function (e) {
	hidesizepurchasereg();
});

$(document).on('change', "textarea[data-field-name='VidPoluch']", function (e) {
	hidesizepurchasereg();
});

var hidesizecontractview= function() {
	var flag = $("div[data-name='Обеспечение исполнения договора']").find("input[type='checkbox']");
	var nameETP = $("div.documentView-field-value[data-name='Наименование ЭТП']").attr('title');
	if (!$(flag).attr("checked")) {	
		ViewfiledHide(['Размер обеспечения договора', 'Размер обеспечения договора в процентах', 'Валюта обеспечения исполнения договора', 'Иные требования к обеспечению исполнения договора', 'Иные требования к обеспечению исполнения договора']);
	} 
	
	if (['АО "Сбербанк - АСТ"'].indexOf(nameETP) > -1) {
		ViewfiledHide(['Размер обеспечения договора', 'Размер обеспечения договора в процентах']);
	} else {
		ViewfiledHide(['Валюта обеспечения исполнения договора']);
	}
}

var hidesizecontractreg = function() {
	
	function CheckboxLogic() {
		var flag = $("input[name='registerObDog']");
		var registerUchZakSMP=$("input[data-field-name='registerUchZakSMP']");
		var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
		
			if (flag.is(":checked") && ETPid != 2) {
				
				//Сбер-АСТ
			/* 	if (ETPid == 2) {
					filedShowAndRequired(['bidcompletingsupplyneededcode', 'bidcompletingsupplyinfoextra', 'BidCompletingSupplyInfoSum']);
					filedClearAndHide(['registerRazmObDog', 'RazmObDogProc']);
				} 
				else { */
					filedShowAndRequired(['registerRazmObDog', 'RazmObDogProc', 'BidCompletingSupplyInfoSum', 'bidcompletingsupplyinfoextra']);
					filedClearAndHide(['bidcompletingsupplyneededcode']);
				}
				else if (flag.is(":checked") && ETPid == 2) {
					filedShowAndRequired(['bidcompletingsupplyneededcode', 'bidcompletingsupplyinfoextra', 'BidCompletingSupplyInfoSum']);
					filedClearAndHide(['registerRazmObDog', 'RazmObDogProc']);
				}		
				else {
					filedClearAndHide(['registerRazmObDog', 'RazmObDogProc', 'bidcompletingsupplyinfoextra', 'BidCompletingSupplyInfoSum']); // чистим и скрываем поля
					filedHideAndNotRequired(['bidcompletingsupplyneededcode']); //скрыть и сделать необязательными
				}
	}
	
	CheckboxLogic();
	
	$("input[name='registerObDog']").change(function() {
       CheckboxLogic();
	});
}	

//Размер беспечение  возврата аванса
//на просмотр
var hidesizerefundview= function() {
	var flag = $("div[data-name='Обеспечение возврата аванса']").find("input[type='checkbox']");
	var RazmObVozv = $("div[data-name='Размер обеспечения возврата аванса']");
	var RazmObVozvProc = $("div[data-name='Размер обеспечения возврата аванса в процентах']");
	var SrokPredOb = $("div[data-name='Срок предоставления обеспечения возврата аванса']");
	if (!$(flag).attr("checked")) {
        hideViewElementColumn(RazmObVozv);
		hideViewElementColumn(RazmObVozvProc);
		hideViewElementColumn(SrokPredOb);
		} else {
        showViewElementColumn(RazmObVozv);
		showViewElementColumn(RazmObVozvProc);
		showViewElementColumn(SrokPredOb);
	}
}

//на редактирование
var hidesizerefundedit = function() {
	
	var flag = $("input[name='registerObVozv']");
	var VozvAv=$("input[name='registerVozvAv']");
        if ($(flag).is(":checked")) {
			filedShowAndRequired(['registerRazmObVozv', 'registerVozvAv', 'RazmObVozvProc']);
		}
		else{
			filedHideAndNotRequired(['registerRazmObVozv', 'registerVozvAv', 'RazmObVozvProc']);
		}
}

$(document).on('change', "input[data-field-name='registerObVozv']", function (e) {
	hidesizerefundedit();
});

var hideGarant = function() {
	var flag = $("input[data-field-name='registerGarant']");
	var nullstroka1=$("input[name='nullstroka1']");
	var nullstroka2=$("input[name='nullstroka2']");
	var RazmerGarant=$("input[name='registerRazmerGarant']");
	var RazmerGarantProc = $("input[data-field-name='RazmerGarantProc']");
        if ($(flag).is(":checked")) {		
			RazmerGarant.closest(".column-container").show();
			RazmerGarant.prop("required", true);		
			$("[data-related-field=registerRazmerGarant]").addClass("label-required");
			$("[data-related-field=registerRazmerGarant]").closest(".column-container").show();
			RazmerGarantProc.closest(".column-container").show();
			$("[data-related-field=RazmerGarantProc]").closest(".column-container").show();
			nullstroka1.closest(".column-container").show();
			$("[data-related-field=nullstroka1]").closest(".column-container").show();
			nullstroka2.closest(".column-container").show();
			$("[data-related-field=nullstroka2]").closest(".column-container").show();
			
		} else {
			RazmerGarant.closest(".column-container").hide();
			RazmerGarant.prop("required", false);		
			$("[data-related-field=registerRazmerGarant]").removeClass("label-required");
			$("[data-related-field=registerRazmerGarant]").closest(".column-container").hide();
			RazmerGarantProc.closest(".column-container").hide();
			$("[data-related-field=RazmerGarantProc]").closest(".column-container").hide();
			nullstroka1.closest(".column-container").hide();
			$("[data-related-field=nullstroka1]").closest(".column-container").hide();
			nullstroka2.closest(".column-container").hide();
			$("[data-related-field=nullstroka2]").closest(".column-container").hide();
		}
}	

$(document).on('change', "input[data-field-name='registerGarant']", function (e) {
var flag = $("input[name='registerObVozv']");
	var flag = $("input[data-field-name='registerGarant']");
	var RazmerGarant=$("input[name='registerRazmerGarant']");
	var RazmerGarantProc = $("input[data-field-name='RazmerGarantProc']");
         if ($(flag).is(":checked")) {		
			RazmerGarant.closest(".column-container").show();
			RazmerGarant.prop("required", true);		
			$("[data-related-field=registerRazmerGarant]").addClass("label-required");
			$("[data-related-field=registerRazmerGarant]").closest(".column-container").show();
			RazmerGarantProc.closest(".column-container").show();
			$("[data-related-field=RazmerGarantProc]").closest(".column-container").show();
		} else {
			RazmerGarant.closest(".column-container").hide();
			RazmerGarant.prop("required", false);
			RazmerGarant.autoNumeric('wipe');
			$("[data-related-field=registerRazmerGarant]").removeClass("label-required");
			$("[data-related-field=registerRazmerGarant]").closest(".column-container").hide();
			RazmerGarantProc.closest(".column-container").hide();
			$("[data-related-field=RazmerGarantProc]").closest(".column-container").hide();
			RazmerGarantProc.autoNumeric('wipe');	
		}
});

var hidegarantview= function() {
	var flag = $("div[data-name='Обеспечение гарантийных обязательств']").find("input[type='checkbox']");
	var garant = $("div[data-name='Размер обеспечения гарантийных обязательств']");
	var garantproc = $("div[data-name='Размер обеспечения гарантийных обязательств в процентах']");
	if (!$(flag).attr("checked")) {
        hideViewElementColumn(garant);
		hideViewElementColumn(garantproc);
		} else {
        showViewElementColumn(garant);
		showViewElementColumn(garantproc);
	}
}

$(document).on('change', "input[data-field-name='registerRazmOb']", function (e) {
	PersentCalculate('registerRazmOb', 'RazmObProc', false);
});

$(document).on('change', "input[data-field-name='RazmObProc']", function (e) {
	PersentCalculate('registerRazmOb', 'RazmObProc', true);
});

$(document).on('change', "input[data-field-name='registerRazmObDog']", function (e) {
	PersentCalculate('registerRazmObDog', 'RazmObDogProc', false);
});

$(document).on('change', "input[data-field-name='RazmObDogProc']", function (e) {
	PersentCalculate('registerRazmObDog', 'RazmObDogProc', true);
});

$(document).on('change', "input[data-field-name='registerRazmObVozv']", function (e) {
	PersentCalculate('registerRazmObVozv', 'RazmObVozvProc', false);
});

$(document).on('change', "input[data-field-name='RazmObVozvProc']", function (e) {
	PersentCalculate('registerRazmObVozv', 'RazmObVozvProc', true);
});

$(document).on('change', "input[data-field-name='registerRazmerGarant']", function (e) {
	PersentCalculate('registerRazmerGarant', 'RazmerGarantProc', false);
});

$(document).on('change', "input[data-field-name='RazmerGarantProc']", function (e) {
	PersentCalculate('registerRazmerGarant', 'RazmerGarantProc', true);
});

function PersentCalculate(result, percent, isPercent) {
	// result - результат размера обеспечения
	// percent - результат расчета в процентах
	// isPercent - текущее поле процент
	var initialSumWithVAT = $("input[data-field-name='initialSumWithVAT']"); //Передать на ЭТП цену с НДС
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	var nmc ;
	var result = $("input[name='"+result+"']");
	var percent = $("input[name='"+percent+"']");
	var total = 0;
	
	if (initialSumWithVAT.is(':checked')) {
		nmc = $("input[name='registerNMCS']"); // НМЦ (с НДС)
	}
	else {
		nmc = $("input[name='NMCDnoNDS']"); // НМЦ (без НДС)
	}
	
	if (result.autoNumeric('get') > 0 || percent.autoNumeric('get') > 0) {
		// Если редактируется поле процента
		if (isPercent) {
			total = (parseFloat(percent.autoNumeric('get'))/100)*parseFloat(nmc.autoNumeric('get'));
			
			if (percent.autoNumeric('get') > 100) {
				result.autoNumeric('wipe');
				percent.autoNumeric('wipe');
				showCommonErrors("Обратите внимание! Процент обеспечения не может быть выше 100");
			}
			else if (ETPid == 2 && percent.autoNumeric('get') >5) {
				result.autoNumeric('wipe');
				percent.autoNumeric('wipe');
				showCommonErrors('Обратите внимание! Процент обеспечения для "Сбер-АСТ" не может быть выше 5');
			}
			else {
				result.autoNumeric('set', total);
			}
			
		}
		// Если редактируется поле размера обеспечения
		else {
			total = (parseFloat(result.autoNumeric('get'))/parseFloat(nmc.autoNumeric('get')))*100;
			
			if (total > 100) {
				result.autoNumeric('wipe');
				percent.autoNumeric('wipe');
				showCommonErrors("Обратите внимание! Процент обеспечения не может быть выше 100");
			}
			else if (ETPid == 2 && total >5) {
				result.autoNumeric('wipe');
				percent.autoNumeric('wipe');
				showCommonErrors('Обратите внимание! Процент обеспечения для "Сбер-АСТ" не может быть выше 5. Текущий рассчитанный процент - '+total.toFixed(2)+'');
			}
			else {
				percent.autoNumeric('set', total);
			}
		}
	}
}

var izmememie = function() {
	
	var flag = $("input[data-field-name='registerZakNeSost']");
	
        if ($(flag).is(":checked")) {
			$("div[data-field-name='Дата признания несостоявшейся']").closest(".column-container").show();
			$("div[data-field-name='Причина признания несостоявшейся']").closest(".column-container").show();
			$("div[data-label-name='Дата признания несостоявшейся']").closest(".column-container").show();
			$("div[data-label-name='Причина признания несостоявшейся']").closest(".column-container").show();
			$("input[name='registerDateOtmLot']").parent().parent().parent().attr("class", "column-container col-xs-2");
			$("input[name='registerCause']").parent().parent().attr("class", "column-container col-xs-10");
			$("div[data-label-name='Дата признания несостоявшейся']").parent().attr("class", "column-container col-xs-2");
		} else {
			$("div[data-field-name='Дата признания несостоявшейся']").closest(".column-container").hide();
			$("div[data-field-name='Причина признания несостоявшейся']").closest(".column-container").hide();
			$("div[data-label-name='Дата признания несостоявшейся']").closest(".column-container").hide();
			$("div[data-label-name='Причина признания несостоявшейся']").closest(".column-container").hide();
		}
}

$(document).on('change', "input[data-field-name='registerZakNeSost']", function () {
	izmememie();
});
	
var Izmenenie = function() {
    var Obosnovanie = $("div[data-name='Обоснование внесения изменений']");
	$("div[data-name='Код способа закупки']").hide();
    var flag = $("div[data-name='Изменение']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {
		Obosnovanie.show();
	} else {
		Obosnovanie.hide();
	}
}
	
var Otmena = function() {
    var Date = $("div[data-name='Дата признания несостоявшейся']");
	var Prichina = $("div[data-name='Причина признания несостоявшейся']");
    var flag = $("div[data-name='Закупка не состоялась']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {
		Date.show();
		Prichina.show();
	} else {
		Date.hide();
		Prichina.hide();
	}
}
	
$(document).on('change', "input[data-field-name='izmenenie']", function () {
    var flag = $("input[data-field-name='izmenenie']");
    if ($(flag).is(":checked")) {
	$("textarea[data-field-name='registerObIzm']").closest(".column-container").show();
	$("div[data-label-name='Обоснование внесения изменений']").closest(".column-container").show();
	} 
	else {
	$("textarea[data-field-name='registerObIzm']").closest(".column-container").hide();
	$("div[data-label-name='Обоснование внесения изменений']").closest(".column-container").hide();
	}
});

var torgedinView = function () {
	var flag=$("div[data-name='Торги за единицу']").find("input[type='checkbox']");
	if (!$(flag).attr("checked")) {	
		gridReady("|Document|Позиции").then(function (grid) {
			hideColumnByCaptionName(grid, "Цена за единицу ТРУ");
		}) 
	} 
}


var ObesZayvView = function() {
	var flag = $("div.documentView-field-value[data-name='Обеспечение заявки']").attr('title');
	var ContractProvision = $("div.documentView-field-value[data-name='Обеспечение исполнения договора']").attr('title');
	var RefundPaiment = $("div.documentView-field-value[data-name='Обеспечение возврата аванса']").attr('title');
	var WarrantyObligations = $("div.documentView-field-value[data-name='Обеспечение гарантийных обязательств']").attr('title');
	var ProvisionMethod = $("div.documentView-field-value[data-name='Способ предоставления обеспечения']").attr('title');
	var TransferDetails = $("div.documentView-field-value[data-name='Реквизиты перечисления денежных средств']").attr('title');
	var Recipient = $("div.documentView-field-value[data-name='Получателем является']").attr('title');
	var MSP = $("div.documentView-field-value[data-name='Участник закупки МСП']").attr('title');
	var nameETP = $("div.documentView-field-value[data-name='Наименование ЭТП']").attr('title');
	var Arr = [];
	
	ViewfiledHide(['Вид обеспечения заявки на участие']); //скрывю поля для Сбер АСТ
	if (['АО "Сбербанк - АСТ"'].indexOf(nameETP) == -1) {
		// Обеспечение заявки
		if (flag != 1) {
			Arr = ['Размер обеспечения заявки', 'Валюта обеспечения заявки', 'Иные требования к обеспечению заявки', 'Предоставление банковской гарантии', 'Способ предоставления обеспечения', 'Реквизиты перечисления денежных средств', 'Получателем является', 'Получатель', 'Банк', 'Адрес банка', 'ОКТМО', 'ИНН', 'КПП', 'КБК', 'УИН', 'БИК', 'Расчетный счет', 'Корреспондентский счет', 'Лицевой счет']
			Arr.forEach(function(item, i){
				$("div.documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
			})
			
		} 
		else if (MSP == '1') {
			Arr = ['Предоставление банковской гарантии', 'Способ предоставления обеспечения', 'Реквизиты перечисления денежных средств', 'Получателем является', 'Получатель', 'Банк', 'Адрес банка', 'ОКТМО', 'ИНН', 'КПП', 'КБК', 'УИН', 'БИК', 'Расчетный счет', 'Корреспондентский счет', 'Лицевой счет']
			Arr.forEach(function(item, i){
				$("div.documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
			})
		} 
		else if (ProvisionMethod != 'Путем перечисления денежных средств на реквизиты заказчика') {
			Arr = ['Иные требования к обеспечению заявки', 'Реквизиты перечисления денежных средств', 'Получателем является', 'Получатель', 'Банк', 'Адрес банка', 'ОКТМО', 'ИНН', 'КПП', 'КБК', 'УИН', 'БИК', 'Расчетный счет', 'Корреспондентский счет', 'Лицевой счет']
			Arr.forEach(function(item, i){
				$("div.documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
			})
		} 
		else if (TransferDetails != 'Перечисление денежных средств осуществляется на указанные ниже реквизиты') {
			Arr = ['Иные требования к обеспечению заявки', 'Получателем является', 'Получатель', 'Банк', 'Адрес банка', 'ОКТМО', 'ИНН', 'КПП', 'КБК', 'УИН', 'БИК', 'Расчетный счет', 'Корреспондентский счет', 'Лицевой счет']
			Arr.forEach(function(item, i){
				$("div.documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
			})
		} 
		else if (Recipient != 'Бюджетное учреждение (перевод средств осуществляется в одно из подразделений Центрального банка РФ)') {
			Arr = ['Иные требования к обеспечению заявки', 'ОКТМО', 'КПП', 'КБК', 'УИН', 'Лицевой счет']
			Arr.forEach(function(item, i){
				$("div.documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
			})
		} 
		else if (Recipient != 'Небюджетное учреждение (перевод средств осуществляется на счет кредитной организации)') {
			Arr = ['Иные требования к обеспечению заявки',  'Корреспондентский счет']
			Arr.forEach(function(item, i){
				$("div.documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
			})
		}
		
		// Обеспечение исполнения договора
		/* if (ContractProvision != 1 || MSP == 1) {
			ViewfiledHide(['Размер обеспечения договора', 'Размер обеспечения договора в процентах']);
		} */
		
		// Обеспечение возврата аванса
		if (RefundPaiment != 1) {
			ViewfiledHide(['Размер обеспечения возврата аванса', 'Предоставление обеспечения возврата аванса', 'Размер обеспечения возврата аванса в процентах от НМЦ']);
		}
		
		// Обеспечение гарантийных обязательств
		if (WarrantyObligations != 1) {
			ViewfiledHide(['Размер обеспечения гарантийных обязательств', 'Размер обеспечения гарантийных обязательств в процентах']);
		}
		
		if (MSP == '1') {
			LegendAndPrevEmptyRowHide(['Обеспечение гарантийных обязательств', 'Обеспечение возврата аванса']);
		} 
	} 
	else if (['АО "Сбербанк - АСТ"'].indexOf(nameETP) > -1) {
		var BidApplicationSupplyTypeName = $("div.documentView-field-value[data-name='Вид обеспечения заявки на участие']").attr('title');
		ViewfiledHide(['Обеспечение заявки', 'Иные требования к обеспечению заявки', 'Предоставление банковской гарантии', 'Способ предоставления обеспечения', 'Реквизиты перечисления денежных средств', 'Получателем является', 'Получатель', 'Банк', 'Адрес банка', 'ОКТМО', 'ИНН', 'КПП', 'КБК', 'УИН', 'БИК', 'Расчетный счет', 'Корреспондентский счет', 'Лицевой счет']);
		
		$($("div.documentView-field-value[data-name='Иные требования к обеспечению заявки']")[0]).closest('.column-container').show(); // кастомно отображаем
		
		ViewfiledShow(['Вид обеспечения заявки на участие']);
		if (['', 'Не установлено'].indexOf(BidApplicationSupplyTypeName) > -1) {
			ViewfiledHide(['Иные требования к обеспечению заявки', 'Размер обеспечения заявки', 'Размер обеспечения заявки в процентах от НМЦ', 'Валюта обеспечения заявки', 'Размер обеспечения заявки в процентах']);
		}
		
	}
}

var WinnerHide = function () {
	var winner=$("input[name='registerSpZakupName']").val();
	var spzak=$("input[name='registerSpZakup']").val();
	var vozOtkDney =$("input[name='vozOtkDney']");
	var Documents = $("div[data-name='Documents']");
	/* if (winner.indexOf("у единственного") != -1){ */
	if (spzak == "240548" || spzak == "2464" || spzak == "33505" || spzak == "3363" || spzak == "103765" || spzak == "285643" || spzak == "533003"){
		$("li:has(:contains('Победитель'))").show();
		$("textarea[data-field-name='orgpost2']").prop("required", true);
		$("[data-related-field=orgpost2]").addClass("label-required");
		$("textarea[data-field-name='orgpost2']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("textarea[data-field-name='orgpostdog_kod']").prop("required", true);
		$("[data-related-field=orgpostdog_kod]").addClass("label-required");
		$("textarea[data-field-name='FirmName']").prop("required", true);
		$("[data-related-field=FirmName]").addClass("label-required");
		$("input[data-field-name='orgpostdogINN']").prop("required", true);
		$("[data-related-field=orgpostdogINN]").addClass("label-required");
		$("input[data-field-name='orgpostdogKPP']").prop("required", true);
		$("[data-related-field=orgpostdogKPP]").addClass("label-required");
		$("input[data-field-name='orgpostdogCountry']").prop("required", true);
		$("[data-related-field=orgpostdogCountry]").addClass("label-required");
		$("input[data-field-name='orgpostdogRegion']").prop("required", true);
		$("[data-related-field=orgpostdogRegion]").addClass("label-required");
		$("input[data-field-name='orgpostdogPostCode']").prop("required", true);
		$("[data-related-field=orgpostdogPostCode]").addClass("label-required");
		$("textarea[data-field-name='orgpost2']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("textarea[data-field-name='FirmName']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("input[data-field-name='orgpostdogINN']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("input[data-field-name='orgpostdogKPP']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("input[data-field-name='orgpostdogCountry']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("input[data-field-name='orgpostdogRegion']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("input[data-field-name='orgpostdogPostCode']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
		vozOtkDney.closest(".column-container").hide();
		$("[data-related-field=vozOtkDney").closest(".column-container").hide(); 
		Documents.closest(".column-container").hide();
	} else {
		$("li:has(:contains('Победитель'))").hide();
		$("textarea[data-field-name='orgpost2']").prop("required", false);
		$("[data-related-field=orgpost2]").removeClass("label-required");
		$("textarea[data-field-name='orgpost2']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("textarea[data-field-name='orgpostdog_kod']").prop("required", false);
		$("[data-related-field=orgpostdog_kod]").removeClass("label-required");
		$("textarea[data-field-name='FirmName']").prop("required", false);
		$("[data-related-field=FirmName]").removeClass("label-required");
		$("input[data-field-name='orgpostdogINN']").prop("required", false);
		$("[data-related-field=orgpostdogINN]").removeClass("label-required");
		$("input[data-field-name='orgpostdogKPP']").prop("required", false);
		$("[data-related-field=orgpostdogKPP]").removeClass("label-required");
		$("input[data-field-name='orgpostdogCountry']").prop("required", false);
		$("[data-related-field=orgpostdogCountry]").removeClass("label-required");
		$("input[data-field-name='orgpostdogRegion']").prop("required", false);
		$("[data-related-field=orgpostdogRegion]").removeClass("label-required");
		$("input[data-field-name='orgpostdogPostCode']").prop("required", false);
		$("[data-related-field=orgpostdogPostCode]").removeClass("label-required");
		$("textarea[data-field-name='orgpost2']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("textarea[data-field-name='FirmName']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("input[data-field-name='orgpostdogINN']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("input[data-field-name='orgpostdogKPP']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("input[data-field-name='orgpostdogCountry']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("input[data-field-name='orgpostdogRegion']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("input[data-field-name='orgpostdogPostCode']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
	}
}	

var SvedcennView = function () {
	var flag = $(".documentView-field-value[data-name='Сведения о начальной (максимальной) цене договора (цене заявки)']").text();
	var NameEETP = $(".documentView-field-value[data-name='Наименование ЭТП").text();
	var PositionTable = $("div[data-api-table-name='|Document|Позиции']");
	var BidTradeType = $(".documentView-field-value[data-name='Детализация предложения о цене']").text();
	var flag2 = $(".documentView-field-value[data-name='Указать логику снижения предложения о цене договора']");
	var FormTorg = $(".documentView-field-value[data-name='Форма торгов']").text();
	if (flag == "Формула цены и максимальное значение цены договора (цены лота)") {	
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").show();
		$("div[data-name='Цена единицы товара, работы, услуги (в рамках лота)").hide();	
		$("div[data-name='Начальная цена комплекта без НДС").hide();
		if (NameEETP == 'АО &quot;МСП-ЕЭТП&quot;') {
			if ($(flag2).attr("title") != '1'){
				$("div[data-name='Снижение цены от НМЦ с НДС").hide();
			}
		} 
		else {
			$("div[data-name='Указать логику снижения предложения о цене договора").hide();
			$("div[data-name='Снижение цены от НМЦ с НДС").hide();
		}
	} 
	else if(flag == "Цена единицы товара, работы, услуги и максимальное значение цены договора (цены лота)") {
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").hide();
		if (NameEETP == 'АО &quot;РТ-ЕЭТП&quot;') {
			$("div[data-name='Цена единицы товара, работы, услуги (в рамках лота)").hide();	
			$("div[data-name='Начальная цена комплекта без НДС").show();
		} 
		else {
			$("div[data-name='Цена единицы товара, работы, услуги (в рамках лота)").show();	
			$("div[data-name='Начальная цена комплекта без НДС").hide();
		}
		$("div[data-name='Указать логику снижения предложения о цене договора").hide();
		$("div[data-name='Снижение цены от НМЦ с НДС").hide();
	} 
	else {
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
		$("div[data-name='Цена единицы товара, работы, услуги (в рамках лота)").closest(".column-container").hide();	
		$("div[data-name='Начальная цена комплекта без НДС").closest(".column-container").hide();
		if (NameEETP == 'АО &quot;МСП-ЕЭТП&quot;') {
			if ($(flag2).attr("title") != '1'){
				$("div[data-name='Снижение цены от НМЦ с НДС").hide();
			}
		} 
		else {
			$("div[data-name='Указать логику снижения предложения о цене договора").hide();
			$("div[data-name='Снижение цены от НМЦ с НДС").hide();
		}
	}
	
	gridReady("|Document|Позиции").then(function (grid) {
		// логика отображения таблицы позиций
		if (NameEETP == 'АО &quot;Сбербанк - АСТ&quot;' && FormTorg == 'Запрос цен (коммерческих предложений)') {
			
			if (['По позициям лота', 'По части позиций лота'].indexOf(BidTradeType) == -1) {
				PositionTable.closest('.column-container').hide();
			}
			else {
				hideColumnByCaptionName(grid, "Цена за единицу ТРУ");
			}
			
			
		}
		else if (NameEETP == 'АО &quot;Сбербанк - АСТ&quot;' && flag != "Цена единицы товара, работы, услуги и максимальное значение цены договора (цены лота)") {
			PositionTable.closest('.column-container').hide();
		}
		else if (['По позициям лота', 'По части позиций лота'].indexOf(BidTradeType) == -1) {
			hideColumnByCaptionName(grid, "Дополнительная информация");
		}
		
		if (FormTorg != 'Запрос о предоставлении ценовой информации'){
			hideColumnByCaptionName(grid, "Номенклатурный номер");
			hideColumnByCaptionName(grid, "Дата поставки");
		}
		
		if (NameEETP == 'АО &quot;МСП-ЕЭТП&quot;'){
			hideColumnByCaptionName(grid, "Предпочтительная торговая марка");
		}
	})
}

var winerhide = function () {
	var flag = $(".documentView-field-value[data-name='Статус']").attr("title");
	var flag3 = $(".documentView-field-value[data-name='Способ закупки']").attr("title");
	var flag2 = $("div[data-name='Централизованная закупка']").find("input[type='checkbox']");
	var statuses = [
		"Закупка завершена",
		"Закупка завершена(одна заявка)",
		"Закупка завершена, один победитель",
		"Заключение договора"
    ];
	if(flag3 && flag){
		if ($.inArray(flag, statuses) === -1 && flag3.indexOf("у единственного") != -1 ) {
			$("li:has(:contains('Победитель'))").show();
		} else {
			$("li:has(:contains('Победитель'))").hide();
		}	
	}
	//$("li:has(:contains('Отмена'))").hide();
	var MSPtype = $("div[data-name='Тип МСП']");
    var flag = $("div[data-name='МСП']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        showViewElementColumn(MSPtype);
	} else {
        hideViewElementColumn(MSPtype);;		
	}
};

/*var FieldETPViewHide = function () {
	var flag = $(".documentView-field-value[data-name='Статус']").attr("title");
	var statuses = [
		"Черновик"
    ];
	if ($.inArray(flag, statuses) != -1) { 
	if (flag != "Черновик") {
		$("div fieldset legend:contains('Особенности размещения')").closest(".column-container").show();
		$("div[data-name='Начальная(максимальная) цена договора, без НДС']").show();
		$("div[data-name='Размер НДС']").show();
	} else {
		$("div fieldset legend:contains('Особенности размещения')").closest(".column-container").hide();
		$("div[data-name='Начальная(максимальная) цена договора, без НДС']").hide();
		$("div[data-name='Размер НДС']").hide();
	}
	$("div[data-name='Наименование ЭТП']").hide();
	$("div[data-name='Год планируемого периода']").hide();
};*/

var hideelements = function () {
	var forinput = ['Ответственный исполнитель', 'Ответственный руководитель', 'Порядок предоставления обеспечения договора', 'Требования к обеспечению договора', 'Торги за единицу товара', 'Ответственный УЗД договорной деятельности', 'Ответственный УЗД конкурентных процедур', 'Ответственный УЗД планирования', 'Торги на процент снижения'];
	forinput.forEach(function(item, i, forinput) {
		$("input[name='"+item+"']").val('');
		$("input[name='"+item+"']").attr('value','');
		if (!$(".documentView-field-value[data-name='"+item+"']").attr("title")) {	
			$("div[data-name='"+item+"']").closest(".column-container").hide();	
		 } else {
			$("div[data-name='"+item+"']").closest(".column-container").show();
		 }
	});
}

// Краткое содержание
var summary = function() {
	var ktatkoe = $("input[name='ktatkoe']");
	var name = $("textarea[name='registerNaimDogov']");
	var nameOrg = $("input[name='registerOrgZa']");
	var resultString = function() {
		var result = "Организация-заказчик: " + nameOrg.val().trim() + " Предмет договора: " +  name.val().trim();	
		return result;
	};	
	ktatkoe.val(resultString());
	
	name.change(function() {
	    ktatkoe.val(resultString());
	});
	nameOrg.change(function() {
	    ktatkoe.val(resultString());
	});
};

var Svedcen = function() {
	var flag = $("input[name='Kodcen']").val();
	var formTorgCode = $("input[name='formTorgCode']").val();
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	var Table = $("div[data-name='ItemTab']");
	var priceTax = $("input[name^='ItemTab-priceTaxTRU']");
	var BidTradeTypeName = $("input[name='BidTradeTypeName']").val(); //Детализация предложения о цене
    if (flag=='2') {
		$("input[data-field-name='formula']").closest(".column-container").show();
		$("[data-related-field=formula]").closest(".column-container").show();
		$("input[data-field-name='formula']").prop("required", true);
		$("[data-related-field=formula]").addClass("label-required");
		$("input[name='cened']").autoNumeric('wipe');
		$("input[data-field-name='cened']").closest(".column-container").hide();
		$("[data-related-field=cened]").closest(".column-container").hide();
		$("input[data-field-name='cened']").prop("required", false);
		$("[data-related-field=cened]").removeClass("label-required");
		//$("div[data-name='ItemTab']").closest('.column-container').hide();
		$("input[name='TorgEd']").prop('checked', false);
		HideAndClearTableColumn(Table, ['priceTaxTRU', 'PositionFopInfo']);
		if (['3'].indexOf(formTorgCode) == -1) {
			filedClearAndHide(['logikCenDog', 'withNDSForMSP']);
		} 
		else if (formTorgCode == 3) {
			filedShow(['logikCenDog']);
		}
	} else if (flag=='3') {
		$("input[data-field-name='cened']").closest(".column-container").show();
		$("[data-related-field=cened]").closest(".column-container").show();
		$("input[data-field-name='cened']").prop("required", true);
		$("[data-related-field=cened]").addClass("label-required");
		$("input[name='formula']").val('');
		$("input[data-field-name='formula']").closest(".column-container").hide();
		$("[data-related-field=formula]").closest(".column-container").hide();
		$("input[data-field-name='formula']").prop("required", false);
		$("[data-related-field=formula]").removeClass("label-required");
		$("input[name='TorgEd']").prop('checked', true);
		ShowAndRequiredTableColumn(Table, ['priceTaxTRU']);
		// Сбер АСт
		if (ETPid == 2 && ['По позициям лота', 'По части позиций лота'].indexOf(BidTradeTypeName) > -1) {
			ShowAndRequiredTableColumn(Table, ['PositionFopInfo']);
		} else {
			HideAndClearTableColumn(Table, ['PositionFopInfo']);
		}
		filedClearAndHide(['logikCenDog', 'withNDSForMSP']);
		
	}
	//26-  Запрос цен (коммерческих предложений)
	else if (ETPid == 2 && formTorgCode == 26) {
		filedClearAndHide(['formula', 'cened']);
		$("input[name='TorgEd']").prop('checked', false);
		HideAndClearTableColumn(Table, ['priceTaxTRU']);
		/* HideTableColumnAndNotRequired(Table, ['priceTaxTRU']); */

		if (['По позициям лота', 'По части позиций лота'].indexOf(BidTradeTypeName) > -1) {
			ShowAndRequiredTableColumn(Table, ['PositionFopInfo']);
			$("div[data-name='ItemTab']").closest('.column-container').show();
		} 
		else {
			HideAndClearTableColumn(Table, ['PositionFopInfo']);
			$("div[data-name='ItemTab']").closest('.column-container').hide();
		}
		
	}	
	else {
		//$("div[data-name='ItemTab']").closest('.column-container').hide();
		HideAndClearTableColumn(Table, ['priceTaxTRU', 'PositionFopInfo']);
		$("input[name='formula']").val('');
		$("input[name='cened']").autoNumeric('wipe');
		$("input[data-field-name='formula']").prop("required", false);
		$("[data-related-field=formula]").removeClass("label-required");
		$("input[data-field-name='cened']").prop("required", false);
		$("[data-related-field=cened]").removeClass("label-required");
		$("input[data-field-name='cened']").closest(".column-container").hide();
		$("input[data-field-name='formula']").closest(".column-container").hide();
		$("[data-related-field=formula]").closest(".column-container").hide();
		$("[data-related-field=cened]").closest(".column-container").hide();
		$("input[name='TorgEd']").prop('checked', false);
		if (['3'].indexOf(formTorgCode) == -1) {
			filedClearAndHide(['logikCenDog', 'withNDSForMSP']);
		} 
		else if (formTorgCode == 3) {
			filedShow(['logikCenDog']);
		}
	}

}

function CalculatePosition() {
	var sum;
	var naimETP = $("input[name='naimETP']").val();
	var Table = $("div[data-name='ItemTab']");
	Table.find("div[data-rowkey]").each(function() {
		var element = $(this).find("input[data-field-name*='ItemTab-priceTaxTRU-']");
		if (element.val()) {
			sum = parseFloat(sum ? sum : 0) + parseFloat(element.autoNumeric('get'));
		}
	})	
	$("input[name='cened']").autoNumeric('wipe');
	//initAutonumeric();
	$("input[name='cened']").autoNumeric('set', parseFloat(sum ? sum : 0));
}

$(document).on('change', "input[data-field-name*='ItemTab-priceTaxTRU-']", function (e) {
	CalculatePosition();
});

$(document).on('change', "input[type='hidden'][name='Kodcen']", function (elem) {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	Svedcen();
	/* Сбер-АСТ */
	if (ETPid == 2) {
		BidTradeType(elem.currentTarget); // проверяем обеспечение заявки
	}
});

function SummaKrit() {   
	var ps1 = $("input[data-field-name*='CritTab-critName']").closest("div.table-content");
	var summ = 0;
	
	ps1.children("div.table-edit-row").each(function() {
		var elemen = $(this).find("input[data-field-name*='CritTab-widthCrit']")
		
		if($(elemen).length){
			var s1 = elemen.val();
			var Price = s1.replace(/ /g, '')*1; 
			var val =  parseFloat(Price ? Price : 0);
			summ = summ + val;
		}
	}); 
	
	$("input[name='sumcrit']").val(summ); 
}

$(document).on('change', "input[data-field-name*='CritTab-widthCrit']", function (e) {
	SummaKrit();
});


$("div[data-deleted-attachment-keys='CritTab_deletedAttachments'] div.table-add-row-button").click(function() {
	SummaKrit();
	TableNum();
	var table = $("div[data-name='CritTab']");
	$(table).on('onTableRowAdded', function (ev, rowKey) {
		
		$("input[name='CritTab-widthCrit-" + rowKey.rowKey + "']").autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.00', 
			vMax: "1.00",
			wEmpty: '',
			mRound: 'B'
		});
		
		$("input[name='CritTab-maxCrit-" + rowKey.rowKey + "']").autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.00', 
			vMax: "99999999999999999999999999.99",
			wEmpty: '',
			mRound: 'B'
		}); 
		
	});
});

$("div[data-name='CritTab']").on('onTableRowRemoved', function () {
	SummaKrit();
	TableNum();
});

var TableNum = function () {
	var table = $("input[data-field-name*='CritTab-critName']").closest("div.table-content");
	var num = -1;
	table.children("div.table-edit-row").each(function () {
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='CritTab-Numbercrit-" + id + "']").val(num)
		}
	});
}

var epCritTrebHide = function () {
	var sposob = $(".documentView-field-value[data-name='Способ закупки']").text();
	if (sposob.indexOf("у единственного") != -1 || sposob.indexOf("безальтернативная") != -1) {
		//$("li:has(:contains('Требования к участникам'))").hide();
		//$("li:has(:contains('Критерии оценки'))").hide();
		$("li:has(:contains('Требования к документации'))").hide();
	} else if (sposob.indexOf("Аукцион") != -1) {
		//$("li:has(:contains('Критерии оценки'))").hide();
		$("li:has(:contains('Требования к документации'))").show();
	}
	//hideTrebKritonView ();
}

var ifSMPreg = function () {
	var isDigital = $("input[name='registerZakElForm']");
	var isSMP = $("input[name='registerUchZakSMP']");
	var dictCodeColumnName = "moment";// Кнопка словаря
	var ETPid = $("input[name='ETPid']").val();
	if (ETPid != 2) {
		if (isDigital.is(":checked") && isSMP.is(":checked")) {
			//$("input[data-field-name='registerObDog']").closest(".column-container").hide();
			$("input[data-field-name*='DocsTab-Osnovanie-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='DocsTab-needDoc-']").closest(".table-edit-column").hide();
			$("div[title='Основание требования']").hide();
			$("div[title='Необходимость']").hide();
			filterDictionaryItems(dictCodeColumnName, ["1","2","3"], true);
			$("div[data-field-name='Наименование']").parent().prop('style','width: 830px; min-width: 39%;' );
			$("div[data-field-name='Где рассматривается']").parent().prop('style','width: 400px; min-width: 24.4%;' );
			$("div[title='Наименование']").prop('style','width: 830px; min-width: 39%;' );
			$("div[title='Где рассматривается']").prop('style','width: 400px; min-width: 39%;' );
		} else {
			$("input[data-field-name='registerObDog']").closest(".column-container").show();
			$("div[title='Где рассматривается']").children(".column-tooltip-left-sibling").prop('innerText', 'Момент предоставления');
			filterDictionaryItems(dictCodeColumnName, ["4","5"], true);
		}
	}
}

$("div[data-name='DocsTab'] .table-add-row-button").click(function () {
	var isDigital = $("input[name='registerZakElForm']");
	var isSMP = $("input[name='registerUchZakSMP']");
	if (isDigital.is(":checked") && isSMP.is(":checked")) {
		$("input[data-field-name*='DocsTab-Osnovanie-']").closest(".table-edit-column").hide();
		$("input[data-field-name*='DocsTab-needDoc-']").closest(".table-edit-column").hide();
		$("div[data-field-name='Наименование']").parent().prop('style','width: 830px; min-width: 39%;' );
		$("div[data-field-name='Где рассматривается']").parent().prop('style','width: 400px; min-width: 24.4%;' );
	}
});

var ifSMPview = function () {
	var isDigital = $("div[data-name='Закупка в электронной форме']").find("input[type='checkbox']");
	var isSMP = $("div[data-name='Участник закупки СМП']").find("input[type='checkbox']");
	gridReady("Требования").then(function (grid) {
		if (isDigital.is(":checked") && isSMP.is(":checked")) {
			hideColumnByCaptionName(grid, "Основание требования");
			hideColumnByCaptionName(grid, "Необходимость");
		}
		if (isDigital.is(":checked") && !(isSMP.is(":checked"))) {
			$("td[aria-label='Где рассматривается Столбец']").children().prop('innerText','Момент предоставления')
		}
	});
	if (isDigital.is(":checked") && isSMP.is(":checked")) {
		$("div[data-name='Обеспечение исполнения договора']").closest(".column-container").hide();
	} else {
		$("div[data-name='Обеспечение исполнения договора']").closest(".column-container").show();
	}
}

var valutaView = function() { 
	var flag=$(".documentView-field-value[data-name='Валюта']").text();
	if (flag!=="Российский рубль") {
		$("div[data-name='Начальная(максимальная) цена договора, в руб.']").closest(".column-container").show();
		$("div[data-name='Курс валюты']").closest(".column-container").show();
		$("div[data-name='Дата, на которую установлен курс валюты']").closest(".column-container").show();
	} else {
		$("div[data-name='Начальная(максимальная) цена договора, в руб.']").closest(".column-container").hide();
		$("div[data-name='Курс валюты']").closest(".column-container").hide();
		$("div[data-name='Дата, на которую установлен курс валюты']").closest(".column-container").hide();
	}
}

/*var NMCnoNDSView = function() {    
	var flag=$(".documentView-field-value[data-name='Сведения о начальной (максимальной) цене договора (цене заявки)']").text();
	if (flag === "Сведения о начальной (максимальной) цене договора (цене лота)") {
		$("div[data-name='Начальная(максимальная) цена договора, без НДС']").closest(".column-container").show();
		$("div[data-name='Размер НДС']").closest(".column-container").show();
	} else {
		$("div[data-name='Начальная(максимальная) цена договора, без НДС']").closest(".column-container").hide();
		$("div[data-name='Размер НДС']").closest(".column-container").hide();
	}
} */

var hideTrebKritonEditReg = function() {
	var registerSpZakup = $("input[name='registerSpZakup']").val();
	if (registerSpZakup == '240548' || registerSpZakup == '2464' || registerSpZakup == '33505' || registerSpZakup == '3363' || registerSpZakup == '103765' || registerSpZakup == '285643' || registerSpZakup == "533003"){
		$("li:has(:contains('Критерии оценки'))").hide();
		$("li:has(:contains('Требования к участникам'))").hide();		
		$("li:has(:contains('Особенности размещения'))").hide();
		filedHideAndNotRequired(['initialSumWithVAT', 'SetPriorityRF', 'TredCity', 'SetTrebRF', 'ImportZam', 'ParalelImport', 'TorgiProcent', 'ReestrNymTreb', 'KROpisPredmetZak', 'poPosZak']);
	}
}

var hideTrebKritonView = function() { // скрывает вкладки, блоки, поля в т.ч. из FieldETPViewHide
	var registerSpZakup = $(".documentView-field-value[data-name='Код способа закупки']").attr("title");
	if (registerSpZakup == '240548' || registerSpZakup == '2464' || registerSpZakup == '33505' || registerSpZakup == '3363' || registerSpZakup == '103765' || registerSpZakup == '285643' || registerSpZakup == "533003"){
		$("li:has(:contains('Критерии оценки'))").hide();	
		$("li:has(:contains('Требования к участникам'))").hide();
		$("div fieldset legend:contains('Особенности размещения')").closest(".column-container").hide();
		ViewfiledHide(['Номер лота в заявке', 'Номер заявки в ЕИС', 'Форма торгов', 'Наименование ЭТП', 'Идентификатор лота на ЭТП', 'Передать на ЭТП цену с НДС', 'Товар нуждается в импортозамещении', 'Возможен параллельный импорт', 'Торги на процент снижения', 'Установить приоритет товаров российского производства', 'Установить обязательным указание страны-производителя'])
	}
	$("div[data-name='Год планируемого периода']").hide();
	//hideKrifromETPView();
}

var NumLotNoticeViewHide = function () { // скрывает номер лота в извещении, после того, как заявка была отправлена в архив
	var flag1 = $(".documentView-field-value[data-name='Статус']").attr("title");
	if (flag1 == "Черновик") {
		$(".documentView-field-value[data-name='Номер лота в извещении']").hide("title");
	} 
}

function findRequiredInput(){
	let findinput = $(document).find("input[type='text'][required]")
	findinput.each(function() {
		if($(this)[0].value ==''){
			//console.log($(this)[0].outerHTML)//отображает все обязатеьные незаполненные поля
		}
	}); 
}

var HideAdditionalInformation = function () {
	var AdditionalInformation  =  $(".documentView-field-value[data-name='Дополнительные сведения о цене договора']");
	var naimETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	
		if (AdditionalInformation.attr("title")) {
			AdditionalInformation.closest('.column-container').show();
		} else {
			AdditionalInformation.closest('.column-container').hide();
		}
		
		if (naimETP != 'АО &quot;ЕЭТП&quot;') {
			$(".documentView-field-value[data-name='Указать дополнительные сведения о цене договора']").closest('.column-container').hide();
			$(".documentView-field-value[data-name='Приоритет товаров российского происхождения']").closest('.column-container').hide();
		} else {
			$(".documentView-field-value[data-name='Указать дополнительные сведения о цене договора']").closest('.column-container').show();
			$(".documentView-field-value[data-name='Приоритет товаров российского происхождения']").closest('.column-container').show();
		}
}
function initialSumWithVATview() {
	let spzak  =  $(".documentView-field-value[data-name='Способ закупки']").text()
	let sposobMSP = [
 		'единствен'
	]
	if ( $.inArray(spzak, sposobMSP) != -1 )  {
		$(".documentView-field-value[data-name='Передать на ЭТП цену с НДС']").closest('.column-container').hide()
	}
	else{
		$(".documentView-field-value[data-name='Передать на ЭТП цену с НДС']").closest('.column-container').show()
	}
}

var hideifnull = function () {
var forinput = ['Сведения о начальной (максимальной) цене договора (цене заявки)', 'Альтернативные предложения', 'Возможность отказаться от проведения процедуры за (дней)', 'Максимальное количество победителей по лоту', 'Срок заключения договора', 'Количество заключаемых договоров', 'Регион местонахождения объекта'];
	forinput.forEach(function(item, i, forinput) {
		$("input[name='"+item+"']").val('');
		$("input[name='"+item+"']").attr('value','');
		if (!$(".documentView-field-value[data-name='"+item+"']").attr("title")) {	
			$("div[data-name='"+item+"']").closest(".column-container").hide();	
		 } 
		 else {
			$("div[data-name='"+item+"']").closest(".column-container").show();
		 }
	});
}

var sumLot = function () {
	var registerNMCS = $("input[name='registerNMCS']").val()
	var RazmNDS = $("input[name='RazmNDS']").val()
	if (RazmNDS!='' && registerNMCS!=''){
		registerNMCS = registerNMCS.replace(/\s/g, '')
		registerNMCS = parseFloat(registerNMCS)
		RazmNDS = RazmNDS.replace(/\s/g, '')
		RazmNDS = parseFloat(RazmNDS)
		$("input[name='NMCDnoNDS']").autoNumeric('set', registerNMCS / ( (100 + RazmNDS)/100 ))	
	}
	if (RazmNDS > 20) {
		showCommonErrors("Процент НДС не может быть больше 20");
		$("input[name='RazmNDS']").autoNumeric('wipe')
		$("input[name='NMCDnoNDS']").autoNumeric('wipe')
	}
}

var valuta = function () { 
	var flag = $("input[name='Currency_kod']").val();
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	var formTorgCode = $("input[name='formTorgCode']").val() // код формы торгов
	
	if (flag!=="RUB") {
		// 26 -Запрос цен (коммерческих предложений)
		if (ETPid == 2 && formTorgCode == 26) {
			filedShowAndRequired(['dateCurs']);
			filedHideAndNotRequired(['NMCD', 'curs']);
		}
		else {
			filedShowAndRequired(['NMCD', 'curs', 'dateCurs']);
		}
	} else {
		filedClearAndHide(['curs', 'dateCurs']);
		filedHideAndNotRequired(['NMCD']);
	}
}

$(document).on('change', "input[name='registerNMCS']", function (e) {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	sumLot();
	nmcRub();
	/* Сбер-АСТ */
	if (ETPid == 2) {
		BidApplicationSupplyTypeCheck(); // проверяем обеспечение заявки
	}
	
	// начало пересчет обеспечений 
	$("input[data-field-name='RazmObProc']").trigger('change');
	$("input[data-field-name='RazmObDogProc']").trigger('change');
	$("input[data-field-name='RazmObVozvProc']").trigger('change');
	$("input[data-field-name='RazmerGarantProc']").trigger('change');
	//Конец
	
})
$(document).on('change', "input[name='MaxWinners']", function (e) {
	var MaxWinners = $("input[name='MaxWinners']").val(); // ИД ЭТП
	if (MaxWinners=='0'){
		showCommonErrors("Обратите внимание! Максимальное количество победителей не может быть рано 0");
		$("input[name='MaxWinners']").autoNumeric('wipe');
	}
})
$(document).on('change', "input[name='curs']", function (e) {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	nmcRub();
	/* Сбер-АСТ */
	if (ETPid == 2) {
		BidApplicationSupplyTypeCheck(); // проверяем обеспечение заявки
	}
	
	// начало пересчет обеспечений 
	$("input[data-field-name='RazmObProc']").trigger('change');
	$("input[data-field-name='RazmObDogProc']").trigger('change');
	$("input[data-field-name='RazmObVozvProc']").trigger('change');
	$("input[data-field-name='RazmerGarantProc']").trigger('change');
	//Конец
})

$(document).on("change", "input[data-field-name='initialSumWithVAT']", function (e) {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	/* Сбер-АСТ */
	if (ETPid == 2) {
		BidApplicationSupplyTypeCheck(); // проверяем обеспечение заявки
	}
	
	// начало пересчет обеспечений 
	$("input[data-field-name='RazmObProc']").trigger('change');
	$("input[data-field-name='RazmObDogProc']").trigger('change');
	$("input[data-field-name='RazmObVozvProc']").trigger('change');
	$("input[data-field-name='RazmerGarantProc']").trigger('change');
	//Конец
})

function nmcRub(){
	var curs = $("input[data-field-name='curs']");
	var registerNMCS = $("input[data-field-name='registerNMCS']");
	var NMCD = $("input[name='NMCD']");
	var flag=$("input[name='Currency_kod']").val();
	if (flag!=="RUB") {
		if( curs.val() && registerNMCS.val() ){
			var s2 = curs.autoNumeric('get');
			var s4 = registerNMCS.autoNumeric('get');
			var val2 =  parseFloat(s2? s2 : 0);
			var val4 =  parseFloat(s4? s4 : 0);
			NMCD.autoNumeric('set', val4*val2);
		}
		if (($("input[name='NMCD']").val()== 0) || ($("input[name='NMCD']").val()== 0.00)) {
			$("input[name='NMCD']").val("");
		}
		
	}else{
		NMCD.val(registerNMCS.val())
	} 
}

var EETPLogicOnEdit = function() {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	var othOffersCode = $("input[name='othOffersCode']"); // ИД ЭТП
	var formTorgCode = $("input[name='formTorgCode']").val() // код формы торгов
	var Table = $("div[data-name='ItemTab']");
	//скрываем по дефолту поля
	filedHideAndNotRequired(['BidTradeTypeCode', 'BidComment', 'BidAnalogValid', 'BidExceedStartPrice', 'BidSpecifyContractPositionObject', 'BidAuctionStepMinPercent', 'BidAuctionStepMaxPercent', 'BidContractConditionDemandTradeSession', 'BidContractConditionDemandPeriodTradeSession', 'registerOKATO', 'BidApplicationSupplyTypeCode', 'BidPriceDate', 'bidgroup', 'BidAccreditationStartDate', 'BidAccreditationEndDate']);
	//скрываю блоки
	LegendAndPrevEmptyRowHide(['Сведения о торгах', 'Сведения об аккредитации в квалификационном реестре']);
	
	// Сбербанк АСТ
	if (ETPid == 2) {
		filedNotRequired(['PriceOrderForm']);
		filedHideAndNotRequired(['othOffersCode', 'MaxWinners', 'vozmotk', 'registerUslPos', 'registerOPos', 'registerObZa']); // список полей которые скрываются при сбер-АСТ
		filedClearAndHide(['SetPriorityRF', 'TredCity', 'SetTrebRF', 'ImportZam', 'ParalelImport', 'TorgiProcent', 'ReestrNymTreb', 'KROpisPredmetZak', 'poPosZak', 'DlitStepAuk', 'logikCenDog', 'withNDSForMSP', 'registerMestoObject', 'registerMestoObjectName']);
		filedShow(['BidComment', 'BidAnalogValid', 'BidSpecifyContractPositionObject']); // список полей которые отображаются при сбер-АСТ
		filedShowAndRequired(['registerOKATO', 'Kodcen', 'BidTradeTypeCode', 'BidApplicationSupplyTypeCode']); // поля которые отображаем и делаем обязательными
		LegendAndPrevEmptyRowHide(['Обеспечение возврата аванса', 'Обеспечение гарантийных обязательств']);
		HideAndClearTableColumn(Table, ['datePost', 'NumNumber']);
		
		// Разрешить предложение о цене участника выше НМЦ
		if (['11', '13', '14', '61'].indexOf(formTorgCode) > -1) {
			// 11 Конкурс 
			// 13 Запрос предложений
			// 14 Запрос котировок
			// 61 Конкурентные переговоры
			
			filedShow(['BidExceedStartPrice']);
		}
		
		// Если аукцион
		if (['12', '16', '20', '63', '68'].indexOf(formTorgCode) > -1) {
			// (16)Аукцион (заявка из 2-х частей)
			// (12)Аукцион	
			// (63)Аукцион с двумя частями заявок	
			// (68)Аукцион в электронной форме
			
			LegendAndEmptyPrevRowShow(['Сведения о торгах']);
			filedShow(['BidContractConditionDemandTradeSession', 'BidContractConditionDemandPeriodTradeSession']); // поля которые отображаем
			
			// Минимальный шаг, %
			$("input[name='BidAuctionStepMinPercent']").change(function(elem){
				BidAuctionStep(elem.currentTarget);		
			});
			
			// максимальный шаг, %
			$("input[name='BidAuctionStepMaxPercent']").change(function(elem){
				BidAuctionStep(elem.currentTarget);		
			});
			
			
			if (['20'].indexOf(formTorgCode) == -1) {
				filedShowAndRequired(['BidAuctionStepMinPercent','BidAuctionStepMaxPercent']); // поля которые отображаем и делаем обязательными
			}
			
		}
		// (26)Запрос цен (коммерческих предложений)
		else if (['26'].indexOf(formTorgCode) > -1) {
			filedClearAndHide(['Kodcen', 'PriceOrderForm', 'BidSpecifyContractPositionObject', 'BidApplicationSupplyTypeCode', 'BidComment']);
			filedHideAndNotRequired(['registerOKATO', 'registerPlasePos', 'initialSumWithVAT', 'registerNMCS', 'RazmNDS', 'NMCDnoNDS']);
			LegendAndPrevEmptyRowHide(['Сведения о поставке']);
			filedShowAndRequired(['BidPriceDate']);
			$("li[data-tabname='Требования к участникам']").hide();
			$("li[data-tabname='Критерии оценки']").hide();
			
			customMovingFields(); // кастомное пермещение полей
		}
		// Квалификационный отбор в электронной форме
		else if (['59'].indexOf(formTorgCode) > -1) {
			filedClearAndHide(['BidApplicationSupplyTypeCode', 'BidApplicationSupplyTypeName', 'BidSpecifyContractPositionObject', 'BidAnalogValid']);
			LegendAndNextEmptyRowHide(['Обеспечение заявки']);
			LegendAndEmptyPrevRowShow(['Сведения об аккредитации в квалификационном реестре']);
			filedShowAndRequired(['BidAccreditationStartDate', 'BidAccreditationEndDate']); // поля которые отображаем
			filedShow(['bidgroup']);
		}
		
		// Вид обеспечения заявки на участие
		$("input[name='BidApplicationSupplyTypeName']").on('change', function(){
			BidApplicationSupplyTypeLogic(); // вызов функции
		});
		
		function BidApplicationSupplyTypeLogic() {
			var BidApplicationSupplyTypeName = $("input[name='BidApplicationSupplyTypeName']").val();
			
			if (BidApplicationSupplyTypeName != '' && BidApplicationSupplyTypeName != 'Не установлено') {
				filedShowAndRequired(['RazmObProc', 'registerRazmOb','Currency_kodOb', 'otherTreb']);
			} else {
				filedClearAndHide(['RazmObProc', 'registerRazmOb', 'otherTreb']); // чистим и скрываем поля
				filedHideAndNotRequired(['Currency_kodOb']); //скрыть и сделать необязательными
			}
			
		}
		
		function customMovingFields() {
			var Div = "<div class=\"col-sm-6 column-container nomargin nopadding\">\n    <div class=\"row row-container clearfix\">\n   </div>\n   </div>"
			var LabelArray = [];
			var FieldArray = [];
			
			['Currency_kod', 'dateCurs'].forEach(function(item, i){
				var Currentlabel = $("div[data-related-field='"+item+"']").closest('.column-container');
				var CurrentField = $("input[data-field-name='"+item+"']").closest('.column-container');
				
				// меняем класс у Дата курс валюты
				if (item == 'dateCurs') {
					Currentlabel.removeClass('col-sm-2 col-sm-3 nomargin nopadding');
					CurrentField.removeClass('col-sm-2 nomargin nopadding');
					Currentlabel.addClass('col-xs-6');
					CurrentField.addClass('col-xs-6');
				}
				
				
				LabelArray.push(Currentlabel); // массив label
				FieldArray.push(CurrentField); // массив label
			})
			
			var registerNaimDogov_label_Div = $("div[data-related-field='registerNaimDogov']").closest('.row'); // label Предмет договора
			var registerNaimDogov_Div = $("textarea[data-field-name='registerNaimDogov']").closest('.row');  // Field Предмет договора
			
			
			registerNaimDogov_label_Div.append(Div);
			var LastColumnLabel = registerNaimDogov_label_Div.find(".column-container").last().find('.row-container'); // наш созданный элемент label
			
			registerNaimDogov_Div.append(Div);
			var LastColumnFiled = registerNaimDogov_Div.find(".column-container").last().find('.row-container'); // наш созданный элемент label
			
			
			// Добавляем наши элементы на новое место
			LabelArray.forEach(function(item, i){
				item.appendTo(LastColumnLabel);
			})
			
			FieldArray.forEach(function(item, i){
				item.appendTo(LastColumnFiled);
			})

		}
		
		function BidContractConditionDemandTradeSessionLogic() {
			var BidContractConditionDemandTradeSession = $("input[data-field-name='BidContractConditionDemandTradeSession']");
			
			if (BidContractConditionDemandTradeSession.is(':checked')) {
				filedShowAndRequired(['BidContractConditionDemandPeriodTradeSession']);
			}
			else {
				filedClearAndHide(['BidContractConditionDemandPeriodTradeSession']);
			}
			
		}
		
		// Направить запрос КП участникам после завершения торгов
		$("input[data-field-name='BidContractConditionDemandTradeSession']").change(function(){
			BidContractConditionDemandTradeSessionLogic();
		})
		
		// Детализация предложения о цене
		$("input[type='hidden'][name='BidTradeTypeName']").change(function(){
			BidTradeType();	
			Svedcen(); // отображение таблицы позиций
		})
		
		// Вид обеспечения заявки на участие
		$("input[type='hidden'][name='BidApplicationSupplyTypeName']").change(function(){
			BidApplicationSupplyTypeCheck();		
		})
		
		BidContractConditionDemandTradeSessionLogic(); // логика работы чекбокса "Направить запрос КП участникам после завершения торгов"
		BidApplicationSupplyTypeLogic(); // вызов функции
		SelectOkatoOnSberAst(); // фильтрация словаря ОКАТО
		BidTradeTypeFilter(); //фильтрация справочника "Детализация предложений о цене"
	} 
	else if(ETPid == 113){
		filedShowAndRequired(['othOffersCode', 'Kodcen']); // поля которые отображаем и делаем обязательными
		filedClearAndHide(['vozmotk', 'KROpisPredmetZak', 'poPosZak', 'DlitStepAuk', 'logikCenDog', 'withNDSForMSP']);
		filedNotRequired(['PriceOrderForm']);
		if (['1','2'].indexOf(formTorgCode) != -1){
			filedClearAndHide(['TorgiProcent']);
		} else{
			filedShow(['TorgiProcent']);
		}
		if (['4', '3'].indexOf(formTorgCode) == -1){
			filedClearAndHide(['MaxWinners']);
		} else{
			filedShowAndRequired(['MaxWinners']);
		}
		if (formTorgCode == '33'){
			filedShowAndRequired(['registerOKATO']);
			filedClearAndHide(['SetPriorityRF', 'TorgiProcent', 'othOffersCode', 'othOffers']);
			LegendAndPrevEmptyRowHide(['Обеспечение заявки', 'Обеспечение исполнения договора', 'Обеспечение возврата аванса', 'Обеспечение гарантийных обязательств']);
			$("li[data-tabname='Критерии оценки']").hide();
		} 
		else{
			HideAndClearTableColumn(Table, ['datePost', 'NumNumber']);
		}
		if (othOffersCode.val()=="" && formTorgCode!='33'){
			$("input[name='othOffersCode']").val('0');
			$("input[name='othOffers']").val('Не принимать');
			$("input[data-field-name='othOffersCode']").val('Не принимать');
		}
		if ((formTorgCode == '3' || formTorgCode == '4') && $("input[name='predlpov']").is(":checked")){
			filedShowAndRequired(['registerMestoObject']);
		} 
		else {
			filedClearAndHide(['registerMestoObject', 'registerMestoObjectName']);
		}
	}
	else if(ETPid == 1){
		filedClearAndHide(['vozmotk', 'MaxWinners', 'TredCity', 'ImportZam', 'ParalelImport', 'TorgiProcent', 'othOffersCode', 'registerUslPos', 'registerOPos', 'registerMestoObject', 'registerMestoObjectName']);
		filedShowAndRequired(['PriceOrderForm', 'Kodcen']);
		HideAndClearTableColumn(Table, ['PositionMark', 'datePost', 'NumNumber']);
		$("div fieldset legend:contains('Обеспечение возврата аванса')").closest(".column-container").hide();
		$("div fieldset legend:contains('Обеспечение возврата аванса')").closest(".column-container").parent().prev().hide();
		$("div fieldset legend:contains('Обеспечение гарантийных обязательств')").closest(".column-container").hide();
		$("div fieldset legend:contains('Обеспечение гарантийных обязательств')").closest(".column-container").parent().prev().hide();
		if (['3'].indexOf(formTorgCode) != -1) {
			filedClearAndHide(['poPosZak']);
		}
		if (['3'].indexOf(formTorgCode) == -1) {
			filedClearAndHide(['DlitStepAuk']);
		} 
		else if (formTorgCode == 3) {
			filedShowAndRequired(['DlitStepAuk']);
		}
	}
}

// Выбор справчоника окато при сбер АСТ
function SelectOkatoOnSberAst() {
	var eventName = "DicDialogOpened";
	var registerOKATO = $("button[id='registerOKATO']");
	var registerOKATOName = $("input[type='hidden'][name='registerOKATOName']");
	var Arr = [];
	
	registerOKATO.each(function (index, btn) {
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var items = args.items;
			var l = items.length;
			items.forEach(function(item, i){	
				if (!item.data['parentid']) {
					Arr.push(item.data['code'])
				}
			})
		});
	});
	registerOKATOName.on('change', function(elem){
		if (Arr.length > 0) {
			var OKATO =  $("input[type='hidden'][name='registerOKATO']").val();
			if (Arr.indexOf(OKATO) == -1) {
				filedClear(['registerOKATO', 'registerOKATOName']);
				showCommonErrors('Для Сбер-АСТ можно выбирать только из первого уровня в справочнике ОКАТО')
			}
			
		}
		Arr = [];
	})
}

function BidAuctionStep(current) {
	var current = $(current);
	var BidAuctionStepMinPercent = $("input[name='BidAuctionStepMinPercent']");
	var BidAuctionStepMaxPercent = $("input[name='BidAuctionStepMaxPercent']");
	
	if (current.val()) {
		if (current.autoNumeric('get') > 25 || current.autoNumeric('get') <=0) {
			$(current).autoNumeric('wipe');
			showCommonErrors('Минимальный и максимальный шаг должен быть больше нуля и не может быть больше 25%');
		} 
		else if (BidAuctionStepMinPercent.val() && BidAuctionStepMaxPercent.val()) {
			if (BidAuctionStepMinPercent.autoNumeric('get') > BidAuctionStepMaxPercent.autoNumeric('get')) {
				$(current).autoNumeric('wipe');
				showCommonErrors('Минимальный шаг не может быть больше максимального шага');
			}
		}
	}
}

function BidTradeType() {
	var Kodcen = $("input[name='Kodcen']").val();
	var BidTradeTypeName = $("input[name='BidTradeTypeName']").val();
	var formTorgCode = $("input[name='formTorgCode']").val() // код формы торгов
	
	// (59)Квалификационный отбор в электронной форме
	/* Если не квалификационный отбор */
	if (['59'].indexOf(formTorgCode) == -1) {
		if (Kodcen && BidTradeTypeName) {
			// Цена единицы товара, работы, услуги и максимальное значение цены договора (цены лота)
			if (Kodcen == 3 && ['По позициям лота', 'По части позиций лота'].indexOf(BidTradeTypeName) == -1) {
				filedClear(['BidTradeTypeCode', 'BidTradeTypeName'])
				showCommonErrors('При выборе сведений о начальной НМЦ - "Цена единицы товара, работы, услуги и максимальное значение цены договора (цены лота)" необходимо установить детализацию предложений о цене "По позициям лота" или "По части позиций лота".');
			}
			else if (Kodcen == 2 && ['По лоту в целом'].indexOf(BidTradeTypeName) == -1) {
				filedClear(['BidTradeTypeCode', 'BidTradeTypeName'])
				showCommonErrors('При выборе сведений о начальной НМЦ - "Формула цены и максимальное значение цены договора (цены лота)" необходимо установить детализацию предложений о цене "По лоту в целом".');
			}
			else if (Kodcen == 1 && ['По лоту в целом'].indexOf(BidTradeTypeName) == -1) {
				filedClear(['BidTradeTypeCode', 'BidTradeTypeName'])
				showCommonErrors('При выборе сведений о начальной НМЦ - "Сведения о начальной (максимальной) цене договора (цене лота)" необходимо установить детализацию предложений о цене "По лоту в целом".');
			}
			else if (['12', '16', '20', '63', '68'].indexOf(formTorgCode) > -1 && ['По части позиций лота'].indexOf(BidTradeTypeName) > -1) {
				// (16)Аукцион (заявка из 2-х частей)
				// (12)Аукцион	
				// (20)Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства	
				// (63)Аукцион с двумя частями заявок	
				// (68)Аукцион в электронной форме
				filedClear(['BidTradeTypeCode', 'BidTradeTypeName'])
				showCommonErrors('Для аукциона детализация по части позиций невозможна. Необходимо выбрать другое значение в поле "Детализация предложения о цене"');
			}
		}
	}
}

// фильтрация справочника "Детализация предложений о цене"
function BidTradeTypeFilter() {
	var eventName = "DicDialogOpened";
	var buttons = $("button[data-dict-name='Детализация предложений о цене']");
	var formTorgCode = $("input[name='formTorgCode']").val() // код формы торгов
	buttons.each(function (index, btn) {
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var items = args.items;
			var l = items.length;
			/* 59 - Квалификационный отбор в электронной форме */
			if (['59'].indexOf(formTorgCode) > -1) {
				for (var i = 0; i < l; i++) {
					var  currentItem = items[i].data.code;
					var  current = items[i];
					if (['1'].indexOf(currentItem) == -1) {
						current.remove();
					}
				};
			}
			
			
		});
	});
}

function BidApplicationSupplyTypeCheck() {
	var initialSumWithVAT = $("input[data-field-name='initialSumWithVAT']"); //Передать на ЭТП цену с НДС
	var acceptMSP = $("input[data-field-name='acceptMSP']"); //|Document|Участник_закупки_СМП
	var BidApplicationSupplyTypeName = $("input[name='BidApplicationSupplyTypeName']").val(); //|Document|Участник_закупки_СМП
	var NMC;
	// определяем какое из НМЦ будем использовать
	if (initialSumWithVAT.is(':checked')) {
		NMC = $("input[name='registerNMCS']"); //НМЦ (с НДС)
	} else {
		NMC = $("input[name='NMCDnoNDS']"); //НМЦ (без НДС) 
	}
	
	if (['', 'Не установлено'].indexOf(BidApplicationSupplyTypeName) == -1) {
		/* Если меньше 5000000 */
		if (NMC.autoNumeric('get') < 5000000) {
			clearBidApplicationSupply();
			showCommonErrors('При НМЦ < 5 000 000 в поле "Вид обеспечения заявки на участие" допускается выбрать только пункт "Не установлено".');
		} else if (acceptMSP.is(':checked')) {
			if (['Денежные средства; независимая (для закупок СМСП, размещенных после 01.07.2022 г.) / банковская гарантия'].indexOf(BidApplicationSupplyTypeName) == -1) {
				clearBidApplicationSupply();
				showCommonErrors('Для МСП процедур допускается выбор среди пунктов "Не установлено" или "Денежные средства; независимая (для закупок СМСП, размещенных после 01.07.2022 г.) / банковская гарантия"');
			}
			
		}
	}
	
	function clearBidApplicationSupply() {
		filedClear(['BidApplicationSupplyTypeCode', 'BidApplicationSupplyTypeName']); // чистим поля
		filedClearAndHide(['RazmObProc', 'registerRazmOb', 'otherTreb']); // чистим и скрываем поля
		filedHideAndNotRequired(['Currency_kodOb']); //скрыть и сделать необязательными
	}
}

var EETPLogicOnView = function() {
	var nameETP = $("div.documentView-field-value[data-name='Наименование ЭТП']").attr('title');
	var FormTorg = $("div.documentView-field-value[data-name='Форма торгов']").attr('title');
	var BidContractConditionDemandTradeSession = $("div.documentView-field-value[data-name='Направить запрос КП участникам после завершения торгов']").attr('title');
	
	ViewfiledHide(['Детализация предложения о цене', 'Дополнительная информация/Ключевые слова', 'Порядок формирования цены договора', 'Возможны аналоги', 'Разрешить предложение о цене участника выше НМЦ', 'В заявке требуется указать страну происхождения товара', 'Регион поставки'])
	LegendAndPrevEmptyRowHide(['Сведения о торгах']);
	// Сбербанк АСТ
	if (['АО "Сбербанк - АСТ"'].indexOf(nameETP) > -1) {
		ViewfiledShow(['Детализация предложения о цене', 'Дополнительная информация/Ключевые слова', 'Порядок формирования цены договора', 'Возможны аналоги', 'В заявке требуется указать страну происхождения товара', 'Регион поставки']);
		ViewfiledHide(['Условия поставки', 'Объем поставки', 'Товар нуждается в импортозамещении', 'Возможен параллельный импорт', 'Торги на процент снижения', 'Установить приоритет товаров российского производства', 'Установить обязательным указание страны-производителя', 'Установлено требование о закупке товаров российского происхождения', 'Указание реестровых номеров товаров в заявке', 'Краткое описание предмета закупки', 'Попозиционная закупка', 'Длительность шага аукциона', 'Указать логику снижения предложения о цене договора', 'Снижение цены от НМЦ с НДС', 'Срок действия цены', 'Максимальное количество победителей по лоту']);
		
		// Разрешить предложение о цене участника выше НМЦ
		if (['Конкурс', 'Запрос предложений', 'Запрос котировок', 'Конкурентные переговоры'].indexOf(FormTorg) > -1) {
			// 11 Конкурс 
			// 13 Запрос предложений
			// 14 Запрос котировок
			// 61 Конкурентные переговоры
			
			ViewfiledShow(['Разрешить предложение о цене участника выше НМЦ']); // поля которые отображаем и делаем обязательными
		}
		
		if (['Квалификационный отбор в электронной форме'].indexOf(FormTorg) == -1) {
			LegendAndPrevEmptyRowHide(['Сведения об аккредитации в квалификационном реестре']);
		}
		
		// Если аукцион
		if (['Аукцион (заявка из 2-х частей)', 'Аукцион', 'Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства', 'Аукцион с двумя частями заявок', 'Аукцион в электронной форм'].indexOf(FormTorg) > -1) {
			// (16)Аукцион (заявка из 2-х частей)
			// (12)Аукцион	
			// (63)Аукцион с двумя частями заявок	
			// (68)Аукцион в электронной форме			
			LegendAndEmptyPrevRowShow(['Сведения о торгах']);
			
			if (['Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства'].indexOf(FormTorg) > -1) {
				ViewfiledHide(['Минимальный шаг, %', 'Максимальный шаг, %']); 
			}
			
			if (BidContractConditionDemandTradeSession != '1') {
				ViewfiledHide(['Регламентированный срок направления обновленного КП участником (час)']); 
			}
		}
		// 26 -Запрос цен (коммерческих предложений)
		else if (['Запрос цен (коммерческих предложений)'].indexOf(FormTorg) > -1) {
			$("li[data-tabname='Требования к участникам']").hide();
			$("li[data-tabname='Критерии оценки']").hide();
			LegendAndPrevEmptyRowHide(['Сведения о поставке']);
			ViewfiledShow(['Срок действия цены']); // поля которые отображаем
			ViewfiledHide(['Начальная(максимальная) цена договора, в руб.', 'Курс валюты', 'Начальная(максимальная) цена договора', 'Начальная(максимальная) цена договора, без НДС', 'Ставка НДС, %', 'Передать на ЭТП цену с НДС', 'Торги за единицу', 'Дополнительная информация/Ключевые слова', 'Порядок формирования цены договора']); 
		}
		else if (['Квалификационный отбор в электронной форме'].indexOf(FormTorg) > -1) {
			LegendAndPrevEmptyRowHide(['Обеспечение исполнения договора']);
			ViewfiledHide(['Торги за единицу', 'Возможны аналоги']); 
		}
		
	} 
	else if(nameETP == 'АО "МСП-ЕЭТП"') {
		ViewfiledHide(['Условия поставки', 'Объем поставки', 'Товар нуждается в импортозамещении', 'Возможен параллельный импорт', 'Торги на процент снижения', 'Установить обязательным указание страны-производителя', 'Установлено требование о закупке товаров российского происхождения', 'Указание реестровых номеров товаров в заявке', 'Срок действия цены']);
		ViewfiledShow(['Порядок формирования цены договора']);
		if (FormTorg == 'Аукцион') {
			ViewfiledHide(['Попозиционная закупка'])
		} else {
			ViewfiledHide(['Длительность шага аукциона']);
		}
		LegendAndPrevEmptyRowHide(['Сведения об аккредитации в квалификационном реестре']);
	} else{
		ViewfiledHide(['Краткое описание предмета закупки', 'Попозиционная закупка', 'Длительность шага аукциона', 'Указать логику снижения предложения о цене договора', 'Снижение цены от НМЦ с НДС', 'Срок действия цены']);
		ViewfiledShow(['Порядок формирования цены договора']);
		if (FormTorg == 'Запрос о предоставлении ценовой информации') {
			ViewfiledShow(['Регион поставки']);
			LegendAndPrevEmptyRowHide(['Обеспечение заявки', 'Обеспечение исполнения договора', 'Обеспечение возврата аванса', 'Обеспечение гарантийных обязательств']);
			$("li[data-tabname='Критерии оценки']").hide();
			ViewfiledHide(['Торги на процент снижения', 'Установить приоритет товаров российского производства'])
		}
		if (FormTorg == 'Аукцион' || FormTorg == 'Аукцион на повышение'){
			ViewfiledHide(['Торги на процент снижения'])
		}
		LegendAndPrevEmptyRowHide(['Сведения об аккредитации в квалификационном реестре']);
	}
}

function LegendAndPrevEmptyRowHide(Arr) {
	
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.hide();
		
		if ($(legend).closest(".row-container").length >0) {
			$(legend).closest(".row-container").prev().hide();
		} else {
			$(legend).prev().hide();
		}
	});	
}
function LegendAndNextEmptyRowHide(Arr) {
	
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.hide();
		
		if ($(legend).closest(".row-container").length >0) {
			$(legend).closest(".row-container").next().hide();
		} else {
			$(legend).next().hide();
		}
	});	
}

function LegendAndEmptyPrevRowShow(Arr) {
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.show();
		
		if ($(legend).closest(".row-container").length >0) {
			$(legend).closest(".row-container").prev().show();
		} else {
			$(legend).prev().show();
		}
		
	});	
}

// чистим и скрываем поля
function filedClearAndHide(Arr) {
	Arr.forEach(function(item, i) {
		var current = $("[data-field-name='"+item+"']"); // текущий элемент
		current.closest('.column-container').hide();  // скрываем текущий элемент
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide(); // скрываем label
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
		current.prop('required', false);
		current.prop('checked', false);
		
		if (current.attr('type') != 'checkbox') {
			$("[name='"+item+"']").val('');
			current.val('');
			current.text('');
		}
		
		// проверка на maoney
		if (current.attr('class') != undefined) {
			if (current.attr('class').indexOf('money') > -1 || current.attr('class').indexOf('number') > -1 ) {
				current.autoNumeric('wipe');
			}
		}
		
		// проверка на дату
		if (current.parent().data("DateTimePicker") != undefined) {
			current.parent().data("DateTimePicker").clear();
		}
	});	
}

// чистим поля
function filedClear(Arr) {
	Arr.forEach(function(item, i) {
		var current = $("[data-field-name='"+item+"']"); // текущий элемент
		current.prop('checked', false);
		
		if (current.attr('type') != 'checkbox') {
			$("[name='"+item+"']").val('');
			current.val('');
			current.text('');
		}
		
		// проверка на maoney
		if (current.attr('class') != undefined) {
			if (current.attr('class').indexOf('money') > -1) {
				current.autoNumeric('wipe');
			}
		}
		
		// проверка на дату
		if (current.parent().data("DateTimePicker") != undefined) {
			current.parent().data("DateTimePicker").clear();
		}
	});	
}

// отображение полей
function filedShow(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').show();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
	});
}

//отобразить и сделать обязательным
function filedShowAndRequired (Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			$("[data-field-name='"+item+"']").prop('required', true);
			$("div.documentView-field-label[data-related-field='"+item+"']").addClass('label-required');
			$("[data-field-name='"+item+"']").closest('.column-container').show();
			$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
		})
	}
}

// скрываем поля
function filedHideAndNotRequired(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').hide();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide();
		$("[data-field-name='"+item+"']").prop('required', false);
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
	});
}

// скрываем поля
function filedNotRequired(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").prop('required', false);
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
	});
}

// View отобразить поля
function ViewfiledShow(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').show();
	});
}

// View скрыть поля
function ViewfiledHide(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
	});
}

function HideTableColumnAndNotRequired(table, Columns) {
	if (Columns.length > 0) {
		Columns.forEach(function(item, i){
			$(table).find("div[data-colname*=-"+item+"]").hide();
			$(table).find("input[data-field-name*=-"+item+"-]").closest('.table-edit-column').hide();
			$(table).find("input[data-field-name*=-"+item+"-]").prop('required', false);
		})
	}
}

function HideAndClearTableColumn(table, Columns) {
	if (Columns.length > 0) {
		Columns.forEach(function(item, i){
			var current = $(table).find("input[data-field-name*=-"+item+"-]") // текущий элемент
			
			$(table).find("div[data-colname*="+item+"]").hide();
			current.closest('.table-edit-column').hide();
			current.prop('required', false);
			current.prop('checked', false);
			
			$(table).find("[data-field-name*=-"+item+"-]").val('');
			$(table).find("[name*=-"+item+"-]").val('');
			
			// проверка на money
			if (current.attr('class') != undefined) {
				if (current.attr('class').indexOf('money') > -1) {
					current.autoNumeric('wipe');
				}
			}
			
			// проверка на дату
			if (current.parent().data("DateTimePicker") != undefined) {
				current.parent().data("DateTimePicker").clear();
			}
		})
	}		
}

function ClearTableColumn(table, Columns) {
	if (Columns.length > 0) {
		Columns.forEach(function(item, i){
			var current = $(table).find("input[data-field-name*=-"+item+"-]") // текущий элемент
			
			current.prop('required', false);
			current.prop('checked', false);
			
			$(table).find("[data-field-name*=-"+item+"-]").val('');
			$(table).find("[name*=-"+item+"-]").val('');
			
			// проверка на money
			if (current.attr('class') != undefined) {
				if (current.attr('class').indexOf('money') > -1) {
					current.autoNumeric('wipe');
				}
			}
			
			// проверка на дату
			if (current.parent().data("DateTimePicker") != undefined) {
				current.parent().data("DateTimePicker").clear();
			}
		})
	}		
}

function ShowAndRequiredTableColumn(table, Columns) {
	if (Columns.length > 0) {
		Columns.forEach(function(item, i){
			$(table).find("div[data-colname*=-"+item+"]").show();
			$(table).find("input[data-field-name*=-"+item+"-]").closest('.table-edit-column').show();
			$(table).find("input[data-field-name*=-"+item+"-]").prop('required', true);
		})
	}
}

$(document).on('change', "input[name='RazmNDS']", function (e) {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	sumLot();	
	//nmcRub()
	/* Сбер-АСТ */
	if (ETPid == 2) {
		BidApplicationSupplyTypeCheck(); // проверяем обеспечение заявки
	}
	
	// начало пересчет обеспечений 
	$("input[data-field-name='RazmObProc']").trigger('change');
	$("input[data-field-name='RazmObDogProc']").trigger('change');
	$("input[data-field-name='RazmObVozvProc']").trigger('change');
	$("input[data-field-name='RazmerGarantProc']").trigger('change');
	//Конец
})

$(document).on('change', "input[name='Currency_kod']", function (e) {
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	valuta();
	nmcRub();
	
	/* Сбер-АСТ */
	if (ETPid == 2) {
		BidApplicationSupplyTypeCheck(); // проверяем обеспечение заявки
	}
})

var CurrensyEventCheck = function() {
	var Arr = ['CurrencyOb', 'bidcompletingsupplyneededname'];
	var ETPid = $("input[name='ETPid']").val(); // ИД ЭТП
	
	if (ETPid == 2) {
		Arr.forEach(function(item, i) {
			$("input[type='hidden'][name='"+item+"']").on('change', function() {
				var current = $(this).val();
				var MessageCurrensy = [];
				var errorMessage;
				// Если не пусто
				if (current) {
					if (!SberASTCurrensyDictionaries.some(function(item, i){return item["Наименование"] == current})) {
						SberASTCurrensyDictionaries.forEach(function(item, i){ 
							MessageCurrensy.push(' '+item["Наименование"]+'');
						})
						$(this).closest('.column-container').find("input").val('');
						
						showCommonErrors('Выбрана неподходящая валюта для площадки СберАСТ. Доступные валюты - '+MessageCurrensy+'');
					}
				}
				
			})
		})
	}
}
	
var hideRF = function() {
	var TredCity = $("input[data-field-name='TredCity']");
	var SetTrebRF = $("input[data-field-name='SetTrebRF']");
	var ReestrNymTreb=$("input[name='ReestrNymTreb']");
	if ($(TredCity).is(":checked")) {		
		filedShow(['SetTrebRF']);
		if ($(SetTrebRF).is(":checked")) {
			filedShowAndRequired(['ReestrNymTreb']);
		} else{
			filedClearAndHide(['ReestrNymTreb']);
		}

	} else {
		SetTrebRF.closest(".column-container").hide();
		SetTrebRF.prop('checked', false);
		filedClearAndHide(['ReestrNymTreb']);
	}
}

$(document).on('change', "input[data-field-name='TredCity']", function () {
    hideRF();
});

$(document).on('change', "input[data-field-name='SetTrebRF']", function () {
    hideRF();
});

var hideRFView = function() {
	var flag1=$("div[data-name='Установить обязательным указание страны-производителя']").find("input[type='checkbox']");
	var flag2=$("div[data-name='Установлено требование о закупке товаров российского происхождения']").find("input[type='checkbox']");
	if ($(flag1).attr("checked")) {
		if (!$(flag2).attr("checked")) {
			ViewfiledHide(['Указание реестровых номеров товаров в заявке']);
		}
	} else{
		ViewfiledHide(['Установлено требование о закупке товаров российского происхождения', 'Указание реестровых номеров товаров в заявке']);
	}
}

/* var TorgiProcentLogic = function() {
	var TorgiProcent = $("input[data-field-name='TorgiProcent']");
	var othOffersCode=$("input[name='othOffersCode']");
	var othOffers=$("input[name='othOffers']");
	if ($(TorgiProcent).is(":checked")) {		
		filedClearAndHide(['othOffersCode', 'othOffers']);
	} else {
		filedShowAndRequired(['othOffersCode']);
	}
}

$(document).on('change', "input[data-field-name='TorgiProcent']", function () {
    TorgiProcentLogic();
}); */

$(document).on('change', "input[name='DlitStepAuk']", function (e) {
	var DlitStepAuk = $("input[data-field-name='DlitStepAuk']").autoNumeric('get');
	if (DlitStepAuk < 10 || DlitStepAuk > 60){
		showCommonErrors('Поле "Длительность шага аукциона" не может быть меньше 10 и не может быть больше 60');
		$("input[data-field-name='DlitStepAuk']").autoNumeric('wipe');
	}
});

var logikCenDogLogic = function() {
	var logikCenDog = $("input[data-field-name='logikCenDog']");
	if ($(logikCenDog).is(":checked")) {
		filedShow(['withNDSForMSP']);
	} else {
		filedClearAndHide(['withNDSForMSP']);
	}
}

$(document).on('change', "input[data-field-name='logikCenDog']", function () {
    logikCenDogLogic();
}); 

var HideFieldPole1 = function()
{
	var FieldPole1 = $("div[data-name='Поле 1']");	// поле 'Поле 1'
    var flag = $("div[data-name='Поле 2']").find("input[type='checkbox']");	// чекбокс 'Поле 2'

    if ($(flag).attr("checked")) // проверяем, установлен ли чекбокс
    {	
        showViewElementColumn(FieldPole1);	// показываем поле
    } 
    else 
    {
        hideViewElementColumn(FieldPole1);	// скрываем поле
    }
}

// UI_#7 function
 scopes.onView(HideFieldPole1)

/* scopes.onView(NMCnoNDSView); */
scopes.onView(hidesizecontractview);
scopes.onView(hidecategoryview);
scopes.onView(Izmenenie);
scopes.onView(Otmena);
scopes.onView(torgedinView);
scopes.onView(ObesZayvView);
scopes.onView(SvedcennView);
scopes.onView(winerhide);
scopes.onView(hideelements);
scopes.onView(ifSMPview);
//scopes.onView(FieldETPViewHide);
scopes.onView(NumLotNoticeViewHide);
scopes.onView(valutaView);
scopes.onView(hidegarantview);
scopes.onView(hidesizerefundview);
scopes.onView(epCritTrebHide);
scopes.onView(hideTrebKritonView);
scopes.onView(HideAdditionalInformation);
scopes.onView(initialSumWithVATview);
scopes.onView(hideifnull);
scopes.onView(CancelHideView);
scopes.onView(EETPLogicOnView);
scopes.onView(hideRFView);

scopes.onRegister(reg);
scopes.onRegister(hidesizecontractreg);
scopes.onRegister(hidesizepurchasereg);
scopes.onRegister(hideblockchangeedit);
scopes.onRegister(izmememie);
scopes.onRegister(WinnerHide);
scopes.onRegister(Svedcen);
scopes.onRegister(summary);
// scopes.onRegister(hidecrit);
scopes.onRegister(ifSMPreg);
scopes.onRegister(hidesizerefundedit);
scopes.onRegister(hideGarant);
scopes.onRegister(hideTrebKritonEditReg);
scopes.onRegister(findRequiredInput);
scopes.onRegister(valuta);
scopes.onRegister(LoadSberAstCurrensyDict);
scopes.onRegister(CurrensyEventCheck);
scopes.onRegister(hideRF);
//scopes.onRegister(TorgiProcentLogic);

// scopes.onEdit(hidecrit);
scopes.onEdit(WinnerHide);
scopes.onEdit(hidesizecontractreg);
scopes.onEdit(edit);
scopes.onEdit(hidesizepurchasereg);
scopes.onEdit(hideblockchangeedit);
scopes.onEdit(izmememie);
scopes.onEdit(Svedcen);
scopes.onEdit(summary);
scopes.onEdit(ifSMPreg);
scopes.onEdit(hidesizerefundedit);
scopes.onEdit(hideGarant);
scopes.onEdit(hideTrebKritonEditReg);
scopes.onEdit(findRequiredInput);
scopes.onEdit(valuta);
scopes.onEdit(EETPLogicOnEdit);
scopes.onEdit(Currency_kodObDefaultLogic);
scopes.onEdit(LoadSberAstCurrensyDict);
scopes.onEdit(CurrensyEventCheck);
scopes.onEdit(hideRF);
scopes.onEdit(logikCenDogLogic);
//scopes.onEdit(TorgiProcentLogic);