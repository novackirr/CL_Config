"use strict";

var View = function() {
	$("div[data-name='Код протокола']").hide();	
	$("div[data-name='Коэффициент снижения']").hide();	
	$("li:has(:contains('Решение комиссии'))").hide();
	$("li:has(:contains('Маршруты'))").hide();
	$("div[data-name='RFI']").hide();
	var poPosZak = $(".documentView-field-value[data-name='Попозиционная закупка']");
	poPosZak.closest('.column-container').hide(); // скрываю чекбокс Попозиционная закупка
	var hideElement = ['Результат допуска первых частей', 'Результат допуска вторых частей', 'Основание для решения', 'Место заявки, присвоенное комиссией'];
	var PriceNDS = $(".documentView-field-value[data-name='Окончательная цена с НДС']");
	let rfi = $("div[data-name='RFI']").find("input[type='checkbox']");
	if ($(rfi).attr("checked")) {
		$("li:has(:contains('Требуемая документация'))").hide();
		$("li:has(:contains('Критерии оценки'))").hide();
		$("div[data-name='Тип объекта закупки']").hide();
		$("div[data-name='Страна происхождения товара']").hide();
	}	
	$(hideElement).each(function(index, current){
		var CurrentElement = $(".documentView-field-value[data-name='"+current+"']");
			if (!CurrentElement.attr('title')) {
				CurrentElement.closest('.column-container').hide();
			}
	})
	if (PriceNDS.attr('title')){
		$(".documentView-field-value[data-name='Цена участника с НДС']").closest('.column-container').hide();
		$(".documentView-field-value[data-name='Цена участника без НДС']").closest('.column-container').hide();
	} else {
		$(".documentView-field-value[data-name='Окончательная цена с НДС']").closest('.column-container').hide();
		$(".documentView-field-value[data-name='Окончательная цена без НДС']").closest('.column-container').hide();		
	}
	
	function hideItemIfPoPosZak() {
		var ItemArray = ['Цена участника с НДС', 'Цена участника без НДС', 'ЦП вне шага с НДС', 'ЦП вне шага без НДС', 'ЦП с НДС', 'ЦП без НДС', 'НДС, %', '% снижения от НМЦ'];
		// Если это попозиционная закупка
		if (poPosZak.attr('title') == 1) {
			// Переименую text Legend
			$("legend").each(function(index, item){
				var current = $(item);
				if (current.text() == 'Характеристики поставляемых товаров') {
					current.text('Предложение поставщика');
				}
			})
			// Скрываю столбц таблицы
			gridReady("characteristicstable").then(function(grid) {			   
			   hideColumnByCaptionName(grid, "Торговая марка");
			});
			// Скрытие цен и процентов
			ItemArray.forEach(function(current, index){
				$(".documentView-field-value[data-name='"+current+"']").closest('.column-container').hide();
			})
		} else {
			// Скрываю столбц таблицы
			gridReady("characteristicstable").then(function(grid) {			   
			  /*  hideColumnByCaptionName(grid, "Соответствующее наименование Товара/Услуги"); */
			   hideColumnByCaptionName(grid, "Цена за единицу без НДС");
			   hideColumnByCaptionName(grid, "Ставка НДС");
			   hideColumnByCaptionName(grid, "Цена за единицу с НДС");
			   hideColumnByCaptionName(grid, "Комментарий");
			});
		}
	}
	hideItemIfPoPosZak(); // проверка на попозиционную закупку
	
	$("div[data-name='Коэффициент снижения цен без НДС']").hide();
	let koef = $("div[data-name='Коэффициент снижения']").find("input[type='checkbox']");
	if ($(koef).attr("checked")) {
		$("div[data-name='Окончательная цена с НДС']").hide();
		$("div[data-name='Окончательная цена без НДС']").hide();
		$("div[data-name='НДС, %']").hide();
		$("div[data-name='Коэффициент снижения цен без НДС']").show();
	}
	/* if ($(".documentView-field-value[data-name='% снижения от НМЦ']").text()!=' ') {
		$("div[data-name='НДС, %']").closest(".column-container").hide();
	} */
}
var EditReg = function() {   
		$("input[data-field-name='noAuctionOffer']").closest(".column-container").hide();
	    $("li:has(:contains('Скрытые поля'))").hide();													   
	    $("li:has(:contains('Решение комиссии'))").hide();													   
		$("#uchzayav").prop("disabled", true);
		var datezayav = $("input[name='datezayav']");
		datezayav.prop("readonly", true);
	    var price_NDS = $("input[name='price_NDS']");
	    var formtorg = $("input[name='formtorg']");
		var MestoZayavki = $("input[name='MestoZayavki']");
		if (formtorg.val() == "6") {	
		price_NDS.closest(".column-container").hide();
		$("[data-related-field=price_NDS]").closest(".column-container").hide();
		MestoZayavki.closest(".column-container").hide();
		$("[data-related-field=MestoZayavki]").closest(".column-container").hide();
		}
		let rfi = $("input[name='RFI']");
		if (rfi.is(":checked")) {
			$("li:has(:contains('Требуемая документация'))").hide();
			$("li:has(:contains('Критерии оценки'))").hide();
		}
}
// Краткое содержание
var summary = function() {
	var ktatkoe = $("input[name='ktatkoe']");
	var name = $("input[name='registerNomberZ']");
	var numZay = $("input[name='nomerzayav']");
	var resultString = function() {
		var result = "Номер заявки: " + numZay.val() + " Номер закупки: " +  name.val();	
		return result;
	};	
	ktatkoe.val(resultString());
	
	name.change(function() {
	    ktatkoe.val(resultString());
	});
	numZay.change(function() {
	    ktatkoe.val(resultString());
	});
};

var hidecategoryview = function() {
	var flag = $("div[data-name='СМП']").find("input[type='checkbox']");
	 var hidecategoryviewSMP = $("div[data-name='Категория СМП']");	 
	  if (!$(flag).attr("checked")) {
        hideViewElementColumn(hidecategoryviewSMP);				
    } else {
        showViewElementColumn(hidecategoryviewSMP);		 
    }
}

var DopuskView = function() {
	var result = $(".documentView-field-value[data-name='Результат допуска']").text();
	var MestoZayavki = $(".documentView-field-value[data-name='Место заявки, присвоенное комиссией']").text();
	var formtorg = $(".documentView-field-value[data-name='Форма торгов']").text();
	var objectprotocol = $(".documentView-field-value[data-name='Код протокола']");
	
	var ProtocolViewCodes = [
		"4149", "4170", "4503", "4111", 
		"4209", "4150", "4171", "161910",
		"161913", "161916", "161909",
		"161912", "200622", "161907"
	];
	var ProtocolItogCodes = [
		"4369", "4249", "4270","4333",
		"161918", "161917",
		"161908", "200623"
	];
	var ProtocolCode = objectprotocol.text();							  
	if (result=="Допущен") {
		$("div[data-name='Причина отказа в допуске']").closest(".column-container").hide();
		$("div[data-name='Этап отклонения заявки']").closest(".column-container").hide();
	}else if (result=="Не допущен") {
		$("div[data-name='Причина отказа в допуске']").closest(".column-container").show();
		$("div[data-name='Этап отклонения заявки']").closest(".column-container").show();
	} else {
		$("div[data-name='Причина отказа в допуске']").closest(".column-container").hide();
		$("div[data-name='Этап отклонения заявки']").closest(".column-container").hide();
	}
	
	if($.inArray(ProtocolCode, ProtocolViewCodes) != -1) {
		/* $("div[data-name='Результат допуска первых частей']").closest(".column-container").show();
		$("div[data-name='Результат допуска вторых частей']").closest(".column-container").show(); */
		$("div[data-name='Результат допуска']").closest(".column-container").hide();
		if (ProtocolCode!="4209"){
			$("div[data-name='НДС, %']").closest(".column-container").hide();
		}
		$("div[data-name='Цена участника с НДС']").closest(".column-container").hide();
		$("div[data-name='Цена участника без НДС']").closest(".column-container").hide();
		$("div[data-name='Окончательная цена с НДС']").closest(".column-container").hide();
		$("div[data-name='Окончательная цена без НДС']").closest(".column-container").hide();	
	} 
	else if ($.inArray(ProtocolCode, ProtocolItogCodes) != -1) {
		$("div[data-name='Результат допуска']").closest(".column-container").hide();
		/* $("div[data-name='Результат допуска первых частей']").closest(".column-container").show();
		$("div[data-name='Результат допуска вторых частей']").closest(".column-container").show(); */
		/* $("div[data-name='НДС, %']").closest(".column-container").show(); */
/* 			$("div[data-name='Цена участника с НДС']").closest(".column-container").show();
		$("div[data-name='Цена участника без НДС']").closest(".column-container").show();
		$("div[data-name='Окончательная цена с НДС']").closest(".column-container").show();
		$("div[data-name='Окончательная цена без НДС']").closest(".column-container").show(); */
	} 
	else {
	/* 	$("div[data-name='Результат допуска первых частей']").closest(".column-container").hide();
		$("div[data-name='Результат допуска вторых частей']").closest(".column-container").hide(); */
		$("div[data-name='Результат допуска']").closest(".column-container").show();
		/* $("div[data-name='НДС, %']").closest(".column-container").show(); */
/* 			$("div[data-name='Цена участника с НДС']").closest(".column-container").show();
		$("div[data-name='Цена участника без НДС']").closest(".column-container").show();
		$("div[data-name='Окончательная цена с НДС']").closest(".column-container").show();
		$("div[data-name='Окончательная цена без НДС']").closest(".column-container").show(); */
		if (MestoZayavki =='' || MestoZayavki==" ") {
			$("div[data-name='Место заявки, присвоенное комиссией']").closest(".column-container").hide();
		};

		if (objectprotocol.text() == "6") {		
			$("div[data-name='Цена участника с НДС']").closest(".column-container").hide();
			$("div[data-name='НДС, %']").closest(".column-container").hide();
			$("div[data-name='Место заявки, присвоенное комиссией']").closest(".column-container").hide();
			$("div[data-name='Цена участника без НДС']").closest(".column-container").hide();
		}
		if (objectprotocol.text() == "1") {		
			$("div[data-name='Место заявки, присвоенное комиссией']").closest(".column-container").hide();
		}	
	}
	if (formtorg=='Запрос о предоставлении ценовой информации'){
		$("div[data-name='Результат допуска']").closest(".column-container").hide();
		$("div[data-name='Результат после подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Не подано ценовое предложение']").closest(".column-container").hide();
	}
}

var Dopusk = function () {
	var rezDop = $("input[name='rezDop']");
	var rezDopName = $("input[name='rezDopName']").val();
	var AcceptedFirstPartCode = $("input[name='AcceptedFirstPartCode']");
	var AcceptedFirstPart = $("input[name='AcceptedFirstPart']").val();
	var AcceptedSecPartCode = $("input[name='AcceptedSecPartCode']");
	var AcceptedSecPart = $("input[name='AcceptedSecPart']").val();
	var PrichPred = $("textarea[name='PrichPred']");
	var OsnovanieResh = $("textarea[name='OsnovanieResh']");
	var PrichPredName = $("textarea[name='PrichPredName']");
	var MestoZayavki = $("input[name='MestoZayavki']"); 
	var ID_ETP = $("input[name='ID_ETP']").val();									  
	var ProtocolObject = $("input[name='registerProtocol']"); //код протокола
	var price_NDS = $("input[name='price_NDS']"); 
	if ($(rezDop).val() != "F") { 
		$("[data-edit-name=PrichPred]").closest(".column-container").hide();
		$("textarea[data-field-name='OsnovanieResh']").val("Состав документов заявителя соответствует требованиям документации");
		$("[data-related-field=PrichPredName]").closest(".column-container").hide();
		$("[data-related-field=PrichPredName]").removeClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", false);
		$("textarea[data-field-name='PrichPred']").val("");
		$("input[name=PrichPred").val("");
		$("input[name=PrichPredName").val("");	
		$("input[data-parent-name=PrichPredparent").val("");
		var ProtocolCode = ProtocolObject.val();
		PrichPred.find(".dict-display-field").prop("required", false);
		if (ProtocolObject.val() == "" || ProtocolObject.val() == "1") {
			MestoZayavki.closest(".column-container").hide();
			$("[data-related-field=MestoZayavki]").hide();	
			$("input[data-field-name='MestoZayavki']").val("");
			MestoZayavki.val("");
		}
		if (ProtocolObject.val() == "6") {
			price_NDS.closest(".column-container").hide();
			$("[data-related-field=price_NDS]").closest(".column-container").hide();	
			MestoZayavki.closest(".column-container").hide();
			$("[data-related-field=MestoZayavki]").hide();
			$("input[data-field-name='MestoZayavki']").val("");
			MestoZayavki.val("");
		}
		if (ProtocolObject.val() == "2") {
			MestoZayavki.closest(".column-container").show();
			MestoZayavki.val("");
			$("input[data-field-name='MestoZayavki']").val("");
			$("[data-related-field=MestoZayavki]").show();
			//$("input[data-field-name=MestoZayavki").prop('required', true);
			$("[data-related-field=MestoZayavki]").addClass("label-required");
		}
	} else {
		
		MestoZayavki.val(rezDopName);
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		if ( (ID_ETP != '113') && (ID_ETP != '999') ) {				
		$("[data-edit-name=PrichPred]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").addClass("label-required");
	/* 	$("textarea[data-field-name='PrichPred']").prop("required", true);
		PrichPred.find(".dict-display-field").prop("required", true); */
		OsnovanieResh.closest(".column-container").show();	
		$("[data-related-field=OsnovanieResh]").show();
		MestoZayavki.closest(".column-container").hide();
		$("[data-related-field=MestoZayavki]").hide();		
		if (ProtocolObject.val() == "6") {
			price_NDS.closest(".column-container").hide();
			$("[data-related-field=price_NDS]").closest(".column-container").hide();
		}		
	}
	
}	
}

var DopuskEdit = function () {
	var rezDop = $("input[name='rezDop']");
	var rezDopName = $("input[name='rezDopName']").val();
	var AcceptedFirstPartCode = $("input[name='AcceptedFirstPartCode']");
	var AcceptedFirstPart = $("input[name='AcceptedFirstPart']").val();
	var AcceptedSecPartCode = $("input[name='AcceptedSecPartCode']");
	var AcceptedSecPart = $("input[name='AcceptedFirstPart']").val();
	var PrichPred = $("textarea[name='PrichPred']");
	var OsnovanieResh = $("textarea[name='OsnovanieResh']");
	var PrichPredName = $("textarea[name='PrichPredName']");
	var MestoZayavki = $("input[name='MestoZayavki']"); 
	var ProtocolObject = $("input[name='registerProtocol']"); 
	var price_NDS = $("input[name='price_NDS']");
	var ID_ETP = $("input[data-field-name='ID_ETP']").val();		 
	var ProtocolFirstViewCodes = [
		"4149", "4503", "4150",
		"161910", "161909", "200622", 
	];
	var ProtocolSecViewCodes = [
		"4170",  "4111", "4209", "4171",
		"161913", "161916", 
		"161912", "161907"
	]
	var ProtocolItogCodes = [
		"4369", "4249", "4270", "4333",
		"161918", "161917",
		"161908", "200623"
	];
	if ($(rezDop).val() != "F" || $(AcceptedFirstPartCode).val() != "F" || $(AcceptedSecPartCode).val() != "F") { 
		$("[data-edit-name=PrichPred]").closest(".column-container").hide();
		$("[data-related-field=PrichPredName]").closest(".column-container").hide();
		$("[data-related-field=PrichPredName]").removeClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", false);	
		$("div[data-name='Vibor_komissii'] [data-field-name^='Vibor_komissii-story']").prop("readonly", true);	
		PrichPred.find(".dict-display-field").prop("required", false);
		var ProtocolCode = ProtocolObject.val()
		if (ProtocolObject.val() == "" || ProtocolObject.val() == "1") {
			MestoZayavki.closest(".column-container").hide();
			$("[data-related-field=MestoZayavki]").hide();
			$("input[data-field-name='MestoZayavki']").val("");
			MestoZayavki.val("");
			rezDop.closest(".column-container").show();
			$("[data-related-field=rezDop]").show();
			//$("input[data-field-name=rezDop").prop('required', true);
			$("[data-related-field=rezDop]").addClass("label-required");
			AcceptedFirstPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedFirstPartCode]").closest(".column-container").hide();
			$("[data-related-field=AcceptedFirstPartCode]").hide();
			$("input[data-field-name=AcceptedFirstPartCode").prop('required', false);
			$("[data-related-field=AcceptedFirstPartCode]").removeClass("label-required");
			AcceptedSecPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedSecPartCode]").hide();
			$("[data-related-field=AcceptedSecPartCode]").closest(".column-container").hide();
			$("input[data-field-name=AcceptedSecPartCode").prop('required', false);
			$("[data-related-field=AcceptedSecPartCode]").removeClass("label-required");
		}
		if ($.inArray(ProtocolCode, ProtocolFirstViewCodes) != -1) {
			price_NDS.closest(".column-container").hide();
			$("[data-related-field=price_NDS]").closest(".column-container").hide();
			MestoZayavki.closest(".column-container").hide();
			$("[data-related-field=MestoZayavki]").hide();
			$("input[data-field-name='MestoZayavki']").val("");
			MestoZayavki.val("");
			rezDop.closest(".column-container").hide();
			$("[data-related-field=rezDop]").hide();
			$("input[data-field-name=rezDop").prop('required', false);
			$("[data-related-field=rezDop]").removeClass("label-required");
			AcceptedSecPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedSecPartCode]").hide();
			$("[data-related-field=AcceptedSecPartCode]").closest(".column-container").hide();
			$("input[data-field-name=AcceptedSecPartCode").prop('required', false);
			$("[data-related-field=AcceptedSecPartCode]").removeClass("label-required");
			//$("input[data-field-name=AcceptedFirstPartCode").prop('required', true);
			$("[data-related-field=AcceptedFirstPartCode]").addClass("label-required");
		}
		if ($.inArray(ProtocolCode, ProtocolSecViewCodes) != -1) {
			price_NDS.closest(".column-container").hide();
			$("[data-related-field=price_NDS]").closest(".column-container").hide();
			MestoZayavki.closest(".column-container").hide();
			$("[data-related-field=MestoZayavki]").hide();
			$("input[data-field-name='MestoZayavki']").val("");
			MestoZayavki.val("");
			rezDop.closest(".column-container").hide();
			$("[data-related-field=rezDop]").hide();
			$("input[data-field-name=rezDop").prop('required', false);
			$("[data-related-field=rezDop]").removeClass("label-required");
			AcceptedFirstPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedFirstPartCode]").closest(".column-container").hide();
			$("[data-related-field=AcceptedFirstPartCode]").hide();
			$("input[data-field-name=AcceptedFirstPartCode").prop('required', false);
			$("[data-related-field=AcceptedFirstPartCode]").removeClass("label-required");
			AcceptedSecPartCode.closest(".column-container").show();
			$("[data-related-field=AcceptedSecPartCode]").show();
			$("input[data-field-name=AcceptedSecPartCode").prop('required', true);
			$("[data-related-field=AcceptedSecPartCode]").addClass("label-required");
		}
		if (ProtocolObject.val() == "6") {
			price_NDS.closest(".column-container").hide();
			$("[data-related-field=price_NDS]").closest(".column-container").hide();	
			MestoZayavki.closest(".column-container").hide();
			$("[data-related-field=MestoZayavki]").hide();
		}		
		if ($.inArray(ProtocolCode, ProtocolItogCodes) != -1){	
			MestoZayavki.closest(".column-container").show();
			$("[data-related-field=MestoZayavki]").show();
			//$("input[data-field-name=MestoZayavki").prop('required', true);
			$("[data-related-field=MestoZayavki]").addClass("label-required");
			rezDop.closest(".column-container").hide();
			$("[data-related-field=rezDop]").closest(".column-container").hide();
			$("[data-related-field=rezDop]").hide();
			$("input[data-field-name=rezDop").prop('required', false);
			$("[data-related-field=rezDop]").removeClass("label-required");
			//$("input[data-field-name=ItogOcenka").prop('required', true);
			$("[data-related-field=ItogOcenka]").addClass("label-required");
		} 
		if (ProtocolObject.val() == "2") {
			MestoZayavki.closest(".column-container").show();
			
			$("[data-related-field=MestoZayavki]").show();
			//$("input[data-field-name=MestoZayavki").prop('required', true);
			$("[data-related-field=MestoZayavki]").addClass("label-required");
			rezDop.closest(".column-container").show();
			$("[data-related-field=rezDop]").show();
			//$("input[data-field-name=rezDop").prop('required', true);
			$("[data-related-field=rezDop]").addClass("label-required");
			AcceptedFirstPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedFirstPartCode]").hide();
			$("input[data-field-name=AcceptedFirstPartCode").prop('required', false);
			$("[data-related-field=AcceptedFirstPartCode]").removeClass("label-required");
			AcceptedSecPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedSecPartCode]").hide();
			$("input[data-field-name=AcceptedSecPartCode").prop('required', false);
			$("[data-related-field=AcceptedSecPartCode]").removeClass("label-required");
			//$("input[data-field-name=ItogOcenka").prop('required', true);
			$("[data-related-field=ItogOcenka]").addClass("label-required");
		}
	} else {			    
		MestoZayavki.val(rezDopName);
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		if ((ID_ETP != '113') && (ID_ETP != '999')) {				
			$("[data-edit-name=PrichPred]").closest(".column-container").show();
			$("[data-related-field=PrichPredName]").closest(".column-container").show();
			$("[data-related-field=PrichPredName]").addClass("label-required");
			/* $("textarea[data-field-name='PrichPred']").prop("required", true);
			PrichPred.find(".dict-display-field").prop("required", true); */
			OsnovanieResh.closest(".column-container").show();	
			$("[data-related-field=OsnovanieResh]").show();
			MestoZayavki.closest(".column-container").hide();
			$("[data-related-field=MestoZayavki]").hide();
			if (ProtocolObject.val() == "6") {
				price_NDS.closest(".column-container").hide();
				$("[data-related-field=price_NDS]").closest(".column-container").hide();	
			}		
		}
	}
}
var TablesView = function() {
	// 
	var objectprotocol = $(".documentView-field-value[data-name='Код протокола']");
	var FormTorg = $(".documentView-field-value[data-name='Форма торгов']");
	$("div[data-name='Код протокола']").hide();
	if (objectprotocol.text() == " ") {
		gridReady("|Document|Переторжки").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		$("li:has(:contains('Решение комиссии'))").hide();
	}
	var flag = false;
	var kolvo = 0;
	gridReady("characteristicstable").then(function(grid) {
        $.each(grid.getDataSource()._items, function(index, item) {
			if (item.Fields["|Страна_происхождения_товара"] == ''){
				hideColumnByCaptionName(grid, "Страна происхождения товара");
			}
			if (item.Fields["|Соответствующее_наименование_ТУ"] == ''){
				hideColumnByCaptionName(grid, "Соответствующее наименование Товара/Услуги");
			}
			if (FormTorg.text()!='Запрос о предоставлении ценовой информации') {
				hideColumnByCaptionName(grid, "Цена позиции без НДС");
				hideColumnByCaptionName(grid, "Ставка НДС позиции");
				hideColumnByCaptionName(grid, "Цена позиции с НДС");
				hideColumnByCaptionName(grid, "Дата поставки");
			}
			if (item.Fields["|Реестровый_номер"] != ''){
				flag = true;
			}
			kolvo = kolvo + 1;
        })
		if (flag != true) {
			hideColumnByCaptionName(grid, "Реестровый номер");
		}
		if (kolvo > 1 && FormTorg.text()=='Запрос о предоставлении ценовой информации'){
			$("fieldset legend:contains('Сведения о результате рассмотрения заявки')").closest('.column-container').hide();
		}
    });
}

var CriterionTable = function () {
		var tableKomission = function () {
			return $("[data-name=Vibor_komissii] [data-rowkey] input[name^='Vibor_komissii-NomerMesta-")
		};
		tableKomission().each(function (index, element) {
			var row = $(this).parents('.table-edit-row').attr('data-rowkey');
			$(element).on("change");
			$(element).change(function () {
				var NomerMestaVal = $("[data-name=Vibor_komissii] [data-rowkey] input[name='Vibor_komissii-NomerMesta-" + row + "']").val();
				var story = $("[data-name=Vibor_komissii] [data-rowkey] input[name='Vibor_komissii-story-" + row + "']").val();
				if (NomerMestaVal !="Не допущен") {
					$("[data-name=Vibor_komissii] [data-rowkey] input[name='Vibor_komissii-story-" + row + "']").prop("readonly", true);
					$("[data-name=Vibor_komissii] [data-rowkey] input[name='Vibor_komissii-story-" + row + "']").val('');
				} else {
					$("[data-name=Vibor_komissii] [data-rowkey] input[name='Vibor_komissii-story-" + row + "']").prop("readonly", false);
				}
			});
			$(element).change();
		
			
		});

	$("div[data-name='Vibor_komissii']").find("div.table-add-row-button").hide();
	$("div[data-name='Vibor_komissii']").find("div.table-remove-row-button").hide();
	$("div[data-name='CritTab']").find("div.table-add-row-button").parent().hide();
	$("div[data-name='CritTab']").find("div.table-remove-row-button").parent().hide();	
};

var VidProtokola = (function () {	
	var ProtocolObject = $("input[name='registerProtocol']"); 
	var OsnovanieResh = $("textarea[name='OsnovanieResh']");
	var PrichPredName = $("textarea[name='PrichPredName']");
	var rezDop = $("input[name='rezDop']");
	var MestoZayavki = $("input[name='MestoZayavki']"); 
	var ProtocolsCodes = [
		'4149', '4170', '4503', '4111',
		'4209', '4150', '4171', '1',
		'161910',
		'161913', '161916', '161909',
		'161912', '200622', '161907', '6'
	];
	var ProtocolItogCodes = [
		"4369", "4249",
		"4270", "4333", "2",
		"161918", "161917",
		"161908", "200623"
	]
	var ProtocolCode = ProtocolObject.val();
	
	if ($.inArray(ProtocolCode, ProtocolsCodes) != -1) {
		if ($("input[data-field-name='rezDop']").val()=="Подана, не рассмотрена") { 
			$("input[data-field-name='rezDop']").val("")
			$("input[name='rezDopName']").val("")
		}
		$("[data-related-field=rezDop]").addClass("label-required");
		/* $("input[data-field-name='rezDop']").prop("required", true);
		rezDop.find(".dict-display-field").prop("required", true); */
		$("[data-related-field=OsnovanieResh]").addClass("label-required");
		/* $("textarea[data-field-name='OsnovanieResh']").prop("required", true);
		$("input[data-field-name*='Vibor_komissii-NomerMesta']").prop("required", true); */
	}
	
	if ($.inArray(ProtocolCode, ProtocolItogCodes) != -1) {
		if ($("input[data-field-name='rezDop']").val()=="Подана, не рассмотрена") { 
			$("input[data-field-name='rezDop']").val("")
			$("input[name='rezDopName']").val("")
		}
		$("[data-related-field=rezDop]").addClass("label-required");
		/* $("input[data-field-name='rezDop']").prop("required", true);
		rezDop.find(".dict-display-field").prop("required", true); */
		$("[data-related-field=OsnovanieResh]").addClass("label-required");
		/* $("textarea[data-field-name='OsnovanieResh']").prop("required", true);
		$("input[data-field-name*='Vibor_komissii-NomerMesta']").prop("required", true); */
	}
});

var filterDictionary = function(){
	var ProtocolObject = $("input[name='registerProtocol']"); 
	var dictCodeColumnName = "NomerMesta";
	var ProtocolsCodes = [
		'4149', '4170', '4503', '4111',
		'4209', '4150', '4171', '1',
		'161910',
		'161913', '161916', '161909',
		'161912', '200622', '161907'
	];
	var ProtocolItogCodes = [
		"4369", "4249",
		"4270", "4333", "2",
		"161918", "161917",
		"161908", "200623"
	]
	var ProtocolCode = ProtocolObject.val();
	if($.inArray(ProtocolCode, ProtocolsCodes) != -1) {
		filterDictionaryItems(dictCodeColumnName, ["Допущен", "Не допущен"],true);
	}
	if($.inArray(ProtocolCode, ProtocolItogCodes) != -1) {
		filterDictionaryItems(dictCodeColumnName, ["Допущен"],false);
	}	
	if(ProtocolObject.val() == '6') {
		filterDictionaryItems(dictCodeColumnName, ["Допущен", "Не допущен"],true);
	}
}

$(document).on('change', "input[data-field-name='MestoZayavki']", function (e) {
 
   if ($("input[name='MestoZayavki']").val()=="Место не присвоено") {
	   $("textarea[data-field-name='OsnovanieResh']").val("Комиссией не присвоено место участнику");
   }
   if ($("input[name='MestoZayavki']").val()!="Место не присвоено" && $("input[name='rezDop']").val()=="T") {
	   $("textarea[data-field-name='OsnovanieResh']").val("Состав документов заявителя соответствует требованиям документации");
   }
   if ($("input[name='MestoZayavki']").val()!="Место не присвоено" && ($("input[name='AcceptedFirstPartCode']").val()=="T" || $("input[name='AcceptedSecPartCode']").val()=="T")) {
	   // $("input[data-field-name=rezDop").prop('required', false);
		$("[data-related-field=rezDop]").removeClass("label-required");
   }
});

$(document).on('change', "input[name='rezDopName']", function (e) {
   Dopusk();
 
   CriterionTable();
});

$(document).on('change', "input[name='AcceptedFirstPart']", function (e) {
	var rezDop = $("input[name='rezDop']");
	var rezDopName = $("input[name='rezDopName']").val();
	var AcceptedFirstPartCode = $("input[name='AcceptedFirstPartCode']");
	var AcceptedFirstPart = $("input[name='AcceptedFirstPart']").val();
	var PrichPred = $("textarea[name='PrichPred']");
	var OsnovanieResh = $("textarea[name='OsnovanieResh']");
	var PrichPredName = $("textarea[name='PrichPredName']");
	var MestoZayavki = $("input[name='MestoZayavki']"); 
	var ProtocolObject = $("input[name='registerProtocol']").val();
	rezDop.closest(".column-container").hide();
	$("[data-related-field=rezDop]").hide();
	$("input[data-field-name=rezDop").prop('required', false);
	$("[data-related-field=rezDop]").removeClass("label-required");
	if ($(AcceptedFirstPartCode).val() != "F"){
		$("[data-edit-name=PrichPred]").closest(".column-container").hide();
		$("textarea[data-field-name='OsnovanieResh']").val("");
		$("textarea[data-field-name='OsnovanieResh']").val("Состав документов заявителя соответствует требованиям документации");												
		$("[data-related-field=PrichPredName]").closest(".column-container").hide();
		$("[data-related-field=PrichPredName]").removeClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", false);
		$("textarea[data-field-name='PrichPred']").val("");
		$("input[name=PrichPred").val("");
		$("input[name=PrichPredName").val("");	
		$("input[data-parent-name=PrichPredparent").val("");
	} else {
		$("textarea[data-field-name='OsnovanieResh']").val("Заявка на участие в конкурентной процедуре закупки и Участник, подавший заявку,  признаны несоответствующими требованиям пункта/пунктов ____ извещения о проведении конкурентной процедуры закупки, а именно _______  и требованиям пункта/пунктов _______ Положения о закупках товаров, работ, услуг в ______, а именно______ ");
		MestoZayavki.val("");
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		$("[data-edit-name=PrichPred]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").addClass("label-required");
		/* $("textarea[data-field-name='PrichPred']").prop("required", true);
		PrichPred.find(".dict-display-field").prop("required", true); */
		OsnovanieResh.closest(".column-container").show();	
		$("[data-related-field=OsnovanieResh]").show();
		MestoZayavki.closest(".column-container").hide();
		$("[data-related-field=MestoZayavki]").hide();
	}
	
});

$(document).on('change', "input[name='AcceptedSecPart']", function (e) {
	var rezDop = $("input[name='rezDop']");
	var rezDopName = $("input[name='rezDopName']").val();
	var AcceptedSecPartCode = $("input[name='AcceptedSecPartCode']");
	var AcceptedSecPart = $("input[name='AcceptedSecPart']").val();
	var PrichPred = $("textarea[name='PrichPred']");
	var OsnovanieResh = $("textarea[name='OsnovanieResh']");
	var PrichPredName = $("textarea[name='PrichPredName']");
	var MestoZayavki = $("input[name='MestoZayavki']"); 
	var ProtocolObject = $("input[name='registerProtocol']").val();
	rezDop.closest(".column-container").hide();
	$("[data-related-field=rezDop]").hide();
	$("input[data-field-name=rezDop").prop('required', false);
	$("[data-related-field=rezDop]").removeClass("label-required");
	if ($(AcceptedSecPartCode).val() != "F"){
		$("[data-edit-name=PrichPred]").closest(".column-container").hide();
		$("textarea[data-field-name='OsnovanieResh']").val("");
		$("textarea[data-field-name='OsnovanieResh']").val("Состав документов заявителя соответствует требованиям документации");															
		$("[data-related-field=PrichPredName]").closest(".column-container").hide();
		$("[data-related-field=PrichPredName]").removeClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", false);
		$("textarea[data-field-name='PrichPred']").val("");
		$("input[name=PrichPred").val("");
		$("input[name=PrichPredName").val("");	
		$("input[data-parent-name=PrichPredparent").val("");
	} else {
		$("textarea[data-field-name='OsnovanieResh']").val("Заявка на участие в конкурентной процедуре закупки и Участник, подавший заявку,  признаны несоответствующими требованиям пункта/пунктов ____ извещения о проведении конкурентной процедуры закупки, а именно _______  и требованиям пункта/пунктов _______ Положения о закупках товаров, работ, услуг в ______, а именно______ ");
		MestoZayavki.val("");
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		$("[data-edit-name=PrichPred]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").addClass("label-required");
		/* $("textarea[data-field-name='PrichPred']").prop("required", true);
		PrichPred.find(".dict-display-field").prop("required", true); */
		OsnovanieResh.closest(".column-container").show();	
		$("[data-related-field=OsnovanieResh]").show();
		MestoZayavki.closest(".column-container").hide();
		$("[data-related-field=MestoZayavki]").hide();
	}
});

var criterii = function() {
	var formtorg = $("input[name='formtorg']").val();
	var registerProtocol = $("input[name='registerProtocol']").val();
	var ProtocolItogCodes = [
		"4369", "4249",
		"4270", "4333", "2",
		"161918", "161917",
		"161908", "200623"
	]
	if ( ( (formtorg=="5") || (formtorg=="4") || (formtorg=="3") || (formtorg=="1") ) && (($.inArray(registerProtocol, ProtocolItogCodes) != -1)) ) {

	$("input[data-field-name*='CritTab-markCrit']").prop('required', false);
	} else {
	$("input[data-field-name*='CritTab-markCrit']").prop('required', false);
	}
}

var criteriiview = function() {
    var formtorg = $(".documentView-field-value[data-name='Форма торгов']").text();
	var registerProtocol = $(".documentView-field-value[data-name='Код протокола']").text();
	var ProtocolItogCodes = [
		"4369", "4249",
		"4270", "4333", "2",
		"161918", "161917",
		"161908", "200623"
	]
	if ($.inArray(registerProtocol, ProtocolItogCodes) != -1) {
	$("li:has(:contains('Критерии оценки'))").show();
	} else {
	$("li:has(:contains('Критерии оценки'))").hide();
	}
}

var PeretorgView = function() {
	$("div[data-name='Проведена переторжка']").closest(".column-container").hide();
	var PeretorgDone = $("div[data-name='Проведена переторжка']").find("input[type='checkbox']");	
	if (!$(PeretorgDone).attr("checked")) {
		$("li:has(:contains('Сведения о переторжках'))").hide();	
	} else {
		$("li:has(:contains('Сведения о переторжках'))").show();			 
	}
}
var TableNum = function () {
	var table = $("input[data-field-name*='CritTab-critName']").closest("div.table-content");
	var num = -1;
	table.children("div.table-edit-row").each(function () {
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='CritTab-NumberZ-" + id + "']").val(num)
		}
	})
}

var TrebDocTable = function () {
	$("div[data-name='DocsTab']").find("div.table-add-row-button").parent().hide();
	$("div[data-name='DocsTab']").find("div.table-remove-row-button").parent().hide();
	var registerProtocol = $("input[name='registerProtocol']").val();
	var ProtocolItogCodes = [
		"4369", "4249",
		"4270", "4333", "2",
		"161918", "161917",
		"161908", "200623"
	] 
	var ProtocolSecViewCodes = [
		"4170",  "4111", "4209", "4171",
		"161913", "161916", 
		"161912", "161907", "1"
	]
	if (($.inArray(registerProtocol, ProtocolItogCodes) != -1) || ($.inArray(registerProtocol, ProtocolSecViewCodes) != -1)  ) {
		var trebDocsPresented = $("div[data-name='DocsTab']").find("input[data-field-name*='-Presented-']");
		trebDocsPresented.each(function (index, element) {
			//$(this).prop("required", true);
		});
	}
}

var CritFill = function () {
	var CritTabRows = $("div[data-name='CritTab']").find('.table-edit-row[data-rowkey]');
	CritTabRows.each(function (index, element) {
		var rowCritName = $(this).find("input[name*='-critName-']").val();
		var priceCrits = ["Цена договора", "Цена договора, цена за единицу продукции", "Ценовой показатель"];
		var rowCritReason = $(this).find("textarea[name*='-critReason-']");
		if ((rowCritReason.val() === "") || (rowCritReason.val() == undefined)) {
			if (priceCrits.indexOf(rowCritName) != -1) {
				var price = $("input[data-field-name='price_NDS']").val();
				rowCritReason.val("Цена участника: " + price + " с учетом НДС");
			}
			if (rowCritName === "Цена за единицу продукции") {
				rowCritReason.val("Введите цену участника за единицу продукции");
			}
		}	
	});
}

$(document).ready(function () {
	$(".documentView-field-label:contains(Наличие технического предложения)").removeClass('col-sm-4').addClass('col-sm-8').removeClass('col-sm-2');
	$("div[data-name='Наличие технического предложения']").last().removeClass('col-sm-8').addClass('col-sm-4').removeClass('col-sm-10');;
}); 

var techOffer = function() {
	var ProtocolFirstPartCodes = [
		"4149", "4503", "4150",
		"161910", "161909", "200622", 
	];
	var registerProtocol = $("input[name='registerProtocol']").val();
	if ($.inArray(registerProtocol, ProtocolFirstPartCodes) != -1) {
		
		//$("input[data-field-name='NalTexPred']").prop("required", true);
		$("[data-related-field=NalTexPred]").addClass("label-required");
	}
	else {
		$("input[data-field-name='NalTexPred']").closest(".row-container").hide();
		$("[data-related-field=NalTexPred]").closest(".row-container").hide();
	}
	
	
}  
function replaceNdsView(){
	if($(".documentView-field-value[data-name='НДС, %']").text() == -1){
		$(".documentView-field-value[data-name='НДС, %']").text("Без НДС")
	}
	if($(".documentView-field-value[data-name='НДС, %']").text() == -2){
		$(".documentView-field-value[data-name='НДС, %']").text("Смешанный")
	}
}
function CharacteristicsView(){
	let playground = $(".documentView-field-value[data-name='Наименование ЭТП']").text()
	if( playground == 'АО "МСП-ЕЭТП"' || playground == 'АО &quot;МСП-ЕЭТП&quot;' ){
		$("fieldset legend:contains('Характеристики поставляемых товаров')").closest('.column-container').hide();
	}
	if( playground == 'АО "ЕЭТП"' || playground == 'АО &quot;ЕЭТП&quot;' ){
		gridReady("characteristicstable").then(function (grid) {
			hideColumnByCaptionName(grid, "Производитель");
		})
	} 
	
	/* СберАСТ */
    if (playground == 'АО &quot;Сбербанк - АСТ&quot;') {
		gridReady("characteristicstable").then(function (grid) {
			hideColumnByCaptionName(grid, "Соответствующее наименование Товара/Услуги");
			hideColumnByCaptionName(grid, "Торговая марка");
		})
	} 
	else {
		gridReady("characteristicstable").then(function (grid) {
			hideColumnByCaptionName(grid, "Аналог");
			hideColumnByCaptionName(grid, "Тип объекта закупки");
			hideColumnByCaptionName(grid, "Ценовое предложение");
			hideColumnByCaptionName(grid, "Лучшее ценовое предложение");
			hideColumnByCaptionName(grid, "Дата лучшего предложения");
		})
	}
}
function mspAuction(){
	let playground = $(".documentView-field-value[data-name='Наименование ЭТП']").text()
	let formtorg = $(".documentView-field-value[data-name='Форма торгов']").text()
	if( (playground == 'АО "МСП-ЕЭТП"' || playground == 'АО &quot;МСП-ЕЭТП&quot;') && (formtorg=="Аукцион") ){
		$("div[data-name='Окончательная цена с НДС']").closest(".column-container").hide();
		$("div[data-name='Окончательная цена без НДС']").closest(".column-container").hide();
		$("div[data-name='Результат допуска первых частей']").closest(".column-container").show();
	}
}
function hideIfEmptyView(){
	let ItemArray = ['Цена участника с НДС', 'Цена участника без НДС', 'ЦП вне шага с НДС', 'ЦП вне шага без НДС', 'ЦП с НДС', 'ЦП без НДС', 'НДС, %', '% снижения от НМЦ', 'Дополнительная информация о цене договора'];
	$.each( ItemArray, function( key, value ) {
	let textItem = $(".documentView-field-value[data-name='"+value+"']").attr("title")
		if( textItem == undefined ){
			$(".documentView-field-value[data-name='"+value+"']").closest(".column-container").hide();
		}
	});	
}
// Сбер АСТ
function EETPLogick () {
	var EETPName =  $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var FormTorg =  $(".documentView-field-value[data-name='Форма торгов']").text();
	var ArrFormTorg = ['Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства'];
	if (EETPName == "АО &quot;Сбербанк - АСТ&quot;") {
		ViewfiledHide(['Окончательная цена с НДС', 'Окончательная цена без НДС', 'Не подано ценовое предложение']);
		$($("div fieldset legend:contains('Характеристики поставляемых товаров')")).text('Позиции заявки');
		
		/* Вид обеспечения заявки */
		if (ArrFormTorg.indexOf(FormTorg) == -1) {
			ViewfiledHide(['Вид обеспечения заявки']);
		}
		
	}  
	else {
		ViewfiledHide(['Лучшее предложение о цене', 'Валюта', 'Размер обеспечения', 'Номер банковской гарантии', 'Заявка подана в валюте, отличной от валюты лота', 'В качестве обеспечения заявки предоставляется банковская гарантия', 'Вид обеспечения заявки', 'Дата подачи лучшего предложения', 'Предложение о цене']);
	}
}

// View скрыть поля
function ViewfiledHide(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
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

scopes.onRegister(filterDictionary);
scopes.onRegister(summary);
scopes.onRegister(EditReg);
scopes.onRegister(DopuskEdit);
scopes.onRegister(criterii);

scopes.onEdit(filterDictionary);
scopes.onEdit(summary);
scopes.onEdit(EditReg);
scopes.onEdit(DopuskEdit);
scopes.onEdit(CriterionTable);
scopes.onEdit(VidProtokola);
scopes.onEdit(criterii);
scopes.onEdit(TableNum);
scopes.onEdit(TrebDocTable);
scopes.onEdit(CritFill);
scopes.onEdit(techOffer);					 

scopes.onView(View);
scopes.onView(DopuskView);
scopes.onView(TablesView);
scopes.onView(criteriiview);
scopes.onView(PeretorgView);				   
scopes.onView(replaceNdsView);				   
scopes.onView(CharacteristicsView);			   
scopes.onView(mspAuction);			   
scopes.onView(hideIfEmptyView);			   
scopes.onView(EETPLogick);			   