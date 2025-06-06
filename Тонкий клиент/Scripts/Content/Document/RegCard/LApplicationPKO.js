"use strict";

var View = function() {
	 $("li:has(:contains('Маршруты'))").hide();	
	 $("div[data-name='Код протокола']").hide();													 
}
var EditReg = function() {     
	    $("li:has(:contains('Скрытые поля'))").hide();	
	/* 	$("li:has(:contains('Решение комиссии'))").hide();	 */													   
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
		// CopyResult();
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

//Категория СМП
//на просмотр
var hidecategoryview = function() {
	var flag = $("div[data-name='СМП']").find("input[type='checkbox']");
	 var hidecategoryviewSMP = $("div[data-name='Категория СМП']");	 
	  if (!$(flag).attr("checked")) {
        hideViewElementColumn(hidecategoryviewSMP);				
    } else {
        showViewElementColumn(hidecategoryviewSMP);		 
    }
}

//вывод поля Процент снижения, если Торги на процент снижения = 1
var hideDownPerc = function() {
	$("div[data-name='Торги на процент снижения']").closest(".column-container").hide();
	var TProcent = $("div[data-name='Торги на процент снижения']").find("input[type='checkbox']");
	var DownPerc = $("div[data-name='Процент снижения, %']");	
	if (!$(TProcent).attr("checked")) {
		hideViewElementColumn(DownPerc);	
	} else {
		showViewElementColumn(DownPerc);			 
	}
}

var DopuskView = function() {
	var result = $(".documentView-field-value[data-name='Результат допуска']").text();
	var MestoZayavki = $(".documentView-field-value[data-name='Место заявки, присвоенное комиссией']").text();
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
			$("div[data-name='Результат допуска первых частей']").closest(".column-container").show();
			$("div[data-name='Результат допуска вторых частей']").closest(".column-container").show();
			$("div[data-name='Результат допуска']").closest(".column-container").hide();
			$("div[data-name='НДС, %']").closest(".column-container").hide();
			$("div[data-name='Цена участника с НДС']").closest(".column-container").hide();
			$("div[data-name='Цена участника без НДС']").closest(".column-container").hide();
			$("div[data-name='Окончательная цена с НДС']").closest(".column-container").hide();
			$("div[data-name='Окончательная цена без НДС']").closest(".column-container").hide();	
		} else if ($.inArray(ProtocolCode, ProtocolItogCodes) != -1) {
			$("div[data-name='Результат допуска']").closest(".column-container").hide();
			$("div[data-name='Результат допуска первых частей']").closest(".column-container").show();
			$("div[data-name='Результат допуска вторых частей']").closest(".column-container").show();
			$("div[data-name='НДС, %']").closest(".column-container").show();
			$("div[data-name='Цена участника с НДС']").closest(".column-container").show();
			$("div[data-name='Цена участника без НДС']").closest(".column-container").show();
			$("div[data-name='Окончательная цена с НДС']").closest(".column-container").show();
			$("div[data-name='Окончательная цена без НДС']").closest(".column-container").show();
		} else {
			$("div[data-name='Результат допуска первых частей']").closest(".column-container").hide();
			$("div[data-name='Результат допуска вторых частей']").closest(".column-container").hide();
			$("div[data-name='Результат допуска']").closest(".column-container").show();
			$("div[data-name='НДС, %']").closest(".column-container").show();
			$("div[data-name='Цена участника с НДС']").closest(".column-container").show();
			$("div[data-name='Цена участника без НДС']").closest(".column-container").show();
			$("div[data-name='Окончательная цена с НДС']").closest(".column-container").show();
			$("div[data-name='Окончательная цена без НДС']").closest(".column-container").show();
		if (MestoZayavki =='' || MestoZayavki==" ") {
			$("div[data-name='Место заявки, присвоенное комиссией']").closest(".column-container").hide();
		};

		if (objectprotocol.text() == "6") {		
			$("div[data-name='Цена участника с НДС']").closest(".column-container").hide();
			$("div[data-name='НДС, %']").closest(".column-container").hide();
			// $("div[data-name='Место заявки, присвоенное комиссией']").closest(".column-container").hide();
			$("div[data-name='Цена участника без НДС']").closest(".column-container").hide();
		}
		if (objectprotocol.text() == "1") {		
			$("div[data-name='Место заявки, присвоенное комиссией']").closest(".column-container").hide();
		}	
	}
}
//скрытие/отображение Причины отказа в допуске
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
			$("input[data-field-name=MestoZayavki").prop('required', true);
			$("[data-related-field=MestoZayavki]").addClass("label-required");
		}
	} else {
		$("textarea[data-field-name='OsnovanieResh']").val("");
		MestoZayavki.val(rezDopName);
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		$("[data-edit-name=PrichPred]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").addClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", true);
		PrichPred.find(".dict-display-field").prop("required", true);
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
	var ProtocolObject = $("input[name='registerProtocol']"); //код протокола
	var price_NDS = $("input[name='price_NDS']");
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
			$("input[data-field-name=rezDop").prop('required', true);
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
			$("input[data-field-name=AcceptedFirstPartCode").prop('required', true);
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
			$("input[data-field-name=MestoZayavki").prop('required', true);
			$("[data-related-field=MestoZayavki]").addClass("label-required");
			rezDop.closest(".column-container").hide();
			$("[data-related-field=rezDop]").closest(".column-container").hide();
			$("[data-related-field=rezDop]").hide();
			$("input[data-field-name=rezDop").prop('required', false);
			$("[data-related-field=rezDop]").removeClass("label-required");
		} 
		if (ProtocolObject.val() == "2") {
			MestoZayavki.closest(".column-container").show();
			/* MestoZayavki.val("");
			$("input[data-field-name='MestoZayavki']").val(""); */
			$("[data-related-field=MestoZayavki]").show();
			$("input[data-field-name=MestoZayavki").prop('required', true);
			$("[data-related-field=MestoZayavki]").addClass("label-required");
			rezDop.closest(".column-container").show();
			$("[data-related-field=rezDop]").show();
			$("input[data-field-name=rezDop").prop('required', true);
			$("[data-related-field=rezDop]").addClass("label-required");
			AcceptedFirstPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedFirstPartCode]").hide();
			$("input[data-field-name=AcceptedFirstPartCode").prop('required', false);
			$("[data-related-field=AcceptedFirstPartCode]").removeClass("label-required");
			AcceptedSecPartCode.closest(".column-container").hide();
			$("[data-related-field=AcceptedSecPartCode]").hide();
			$("input[data-field-name=AcceptedSecPartCode").prop('required', false);
			$("[data-related-field=AcceptedSecPartCode]").removeClass("label-required");
		}
	} else {			    
		MestoZayavki.val(rezDopName);
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		$("[data-edit-name=PrichPred]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").addClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", true);
		PrichPred.find(".dict-display-field").prop("required", true);
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

var TablesView = function() {
	// 
	var objectprotocol = $(".documentView-field-value[data-name='Код протокола']");
	$("div[data-name='Код протокола']").hide();
	if (objectprotocol.text() == " ") {
		gridReady("|Document|Переторжки").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		$("li:has(:contains('Решение комиссии'))").hide();
	}
}

// работа с таблицей Выбор комиссии, редактирование
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
			//return;
			
		});
	//скрываем возможность добавления и удаления строк из таблицы
	$("div[data-name='Vibor_komissii']").find("div.table-add-row-button").hide();
	$("div[data-name='Vibor_komissii']").find("div.table-remove-row-button").hide();
	$("div[data-name='CritTab']").find("div.table-add-row-button").parent().hide();
	$("div[data-name='CritTab']").find("div.table-remove-row-button").parent().hide();	
};

var VidProtokola = (function () {	
	var ProtocolObject = $("input[name='registerProtocol']"); //код протокола
	var OsnovanieResh = $("textarea[name='OsnovanieResh']");
	var PrichPredName = $("textarea[name='PrichPredName']");
	var rezDop = $("input[name='rezDop']");
	var MestoZayavki = $("input[name='MestoZayavki']"); //обычное поле на карточке
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
	/* if (ProtocolObject.val() == "") {
		$("li:has(:contains('Решение комиссии'))").hide();
	} */
	if ($.inArray(ProtocolCode, ProtocolsCodes) != -1) {
		if ($("input[data-field-name='rezDop']").val()=="Подана, не рассмотрена") { 
			$("input[data-field-name='rezDop']").val("")
			$("input[name='rezDopName']").val("")
		}
		$("[data-related-field=rezDop]").addClass("label-required");
		$("input[data-field-name='rezDop']").prop("required", true);
		rezDop.find(".dict-display-field").prop("required", true);
		$("[data-related-field=OsnovanieResh]").addClass("label-required");
		$("textarea[data-field-name='OsnovanieResh']").prop("required", true);
		$("input[data-field-name*='Vibor_komissii-NomerMesta']").prop("required", true);
	}
	
	if ($.inArray(ProtocolCode, ProtocolItogCodes) != -1) {
		if ($("input[data-field-name='rezDop']").val()=="Подана, не рассмотрена") { 
			$("input[data-field-name='rezDop']").val("")
			$("input[name='rezDopName']").val("")
		}
		$("[data-related-field=rezDop]").addClass("label-required");
		$("input[data-field-name='rezDop']").prop("required", true);
		rezDop.find(".dict-display-field").prop("required", true);
		$("[data-related-field=OsnovanieResh]").addClass("label-required");
		$("textarea[data-field-name='OsnovanieResh']").prop("required", true);
		$("input[data-field-name*='Vibor_komissii-NomerMesta']").prop("required", true);
	}
});

var filterDictionary = function(){
	var ProtocolObject = $("input[name='registerProtocol']"); //код протокола	
	var dictCodeColumnName = "NomerMesta";// Кнопка словаря
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

/* $(document).on('change', "input[data-field-name='AllCommission']", function (e) {
   CopyResult();
}); */

$(document).on('change', "input[data-field-name='MestoZayavki']", function (e) {
   // CopyResult();
   if ($("input[name='MestoZayavki']").val()=="Место не присвоено") {
	   $("textarea[data-field-name='OsnovanieResh']").val("Комиссией не присвоено место участнику");
   }
   if ($("input[name='MestoZayavki']").val()!="Место не присвоено" && $("input[name='rezDop']").val()=="T") {
	   $("textarea[data-field-name='OsnovanieResh']").val("Состав документов заявителя соответствует требованиям документации");
   }
   if ($("input[name='MestoZayavki']").val()!="Место не присвоено" && ($("input[name='AcceptedFirstPartCode']").val()=="T" || $("input[name='AcceptedSecPartCode']").val()=="T")) {
	    $("input[data-field-name=rezDop").prop('required', false);
		$("[data-related-field=rezDop]").removeClass("label-required");
   }
});

$(document).on('change', "input[name='rezDopName']", function (e) {
   Dopusk();
  // CopyResult();
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
		$("[data-related-field=PrichPredName]").closest(".column-container").hide();
		$("[data-related-field=PrichPredName]").removeClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", false);
		$("textarea[data-field-name='PrichPred']").val("");
		$("input[name=PrichPred").val("");
		$("input[name=PrichPredName").val("");	
		$("input[data-parent-name=PrichPredparent").val("");
	} else {
		$("textarea[data-field-name='OsnovanieResh']").val("");
		MestoZayavki.val("");
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		$("[data-edit-name=PrichPred]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").addClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", true);
		PrichPred.find(".dict-display-field").prop("required", true);
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
		$("[data-related-field=PrichPredName]").closest(".column-container").hide();
		$("[data-related-field=PrichPredName]").removeClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", false);
		$("textarea[data-field-name='PrichPred']").val("");
		$("input[name=PrichPred").val("");
		$("input[name=PrichPredName").val("");	
		$("input[data-parent-name=PrichPredparent").val("");
	} else {
		$("textarea[data-field-name='OsnovanieResh']").val("");
		MestoZayavki.val("");
		$("input[data-field-name=MestoZayavki").prop('required', false);
		$("[data-related-field=MestoZayavki]").removeClass("label-required");	
		$("[data-edit-name=PrichPred]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").closest(".column-container").show();
		$("[data-related-field=PrichPredName]").addClass("label-required");
		$("textarea[data-field-name='PrichPred']").prop("required", true);
		PrichPred.find(".dict-display-field").prop("required", true);
		OsnovanieResh.closest(".column-container").show();	
		$("[data-related-field=OsnovanieResh]").show();
		MestoZayavki.closest(".column-container").hide();
		$("[data-related-field=MestoZayavki]").hide();
	}
});

$(document).on('change', "input[data-field-name*='CritTab-markCrit']", function (e) {
	var row = $(this).parents('.table-edit-row').attr('data-rowkey');
	var markCrit = $(this).autoNumeric('get')*1;
	var maxCrit = $("input[name='CritTab-maxCrit-" + row + "']").autoNumeric('get')*1;
	if (markCrit > maxCrit) {
		showCommonErrors("Оценка не может превышать максимальное значение");	
		$("input[name='CritTab-markCrit-" + row + "']").autoNumeric('set', '0.0');
	}
	if ($("input[data-field-name='AutoItog']").is(":checked")) {
		ItogCalculation();
	}
	
});

// Функция расчета итоговой оценки

var ItogCalculation = function () {
	
	var CritTab = $("div[data-name='CritTab']").find('.table-edit-row[data-rowkey]');
	var itog = 0;
	CritTab.each (function (index, element) {
		var markCrit = $(element).find("input[name*='-markCrit-']").autoNumeric('get')*1;
		var weightCrit = $(element).find("input[name*='-widthCrit-']").autoNumeric('get')*1;
		itog += markCrit*weightCrit;
	});
	$("input[name='ItogOcenka']").autoNumeric('set', itog);
}

$(document).on('change', "input[data-field-name='AutoItog']", function (e) {
	if ($("input[data-field-name='AutoItog']").is(":checked")) {
		ItogCalculation();
		$("input[name='ItogOcenka']").prop("readonly", true);
	}
	else {
		$("input[data-field-name='ItogOcenka']").prop("readonly", false);		
	}
});
/* var CopyResult = function(){
	var AllCommission = $("input[data-field-name='AllCommission']");
	var ProtocolObject = $("input[name='registerProtocol']");
	var rezDop = $("input[name='rezDop']").val();
	var rezDopName = $("input[name='rezDopName']").val();
	var formtorg = $("input[name='formtorg']").val();											  
	if ($(AllCommission).is(":checked")) {
	if (ProtocolObject.val()=="2" && formtorg!="6") {
	var MestoZayavki = $("input[name='MestoZayavki']").val();
	if ((MestoZayavki!="") && (rezDopName!="") && (rezDopName!="Не допущен")) {
	$("input[data-field-name*='Vibor_komissii-NomerMesta']").val(MestoZayavki);
	$("input[  name*='Vibor_komissii-NomerMesta']").val(MestoZayavki);
	CriterionTable();
	}
	if (rezDopName=="Не допущен") {
	$("input[data-field-name*='Vibor_komissii-NomerMesta']").val(rezDopName);
	$("input[  name*='Vibor_komissii-NomerMesta']").val(rezDopName);
	CriterionTable();
	}
	}
	if (ProtocolObject.val()!="2" || (formtorg=="6" && ProtocolObject.val()=="2")) {
	if (rezDop!="") {
	$("input[data-field-name*='Vibor_komissii-NomerMesta']").val(rezDopName);
	$("input[  name*='Vibor_komissii-NomerMesta']").val(rezDopName);
	CriterionTable();
	}
	}
	}
} */



var criterii = function() {
	var formtorg = $("input[name='formtorg']").val();
	var registerProtocol = $("input[name='registerProtocol']").val();
	// Убираем обязательность критериев для ВТБ
	if (((formtorg=="5") || (formtorg=="4") || (formtorg=="3") || (formtorg=="1")) && (registerProtocol=="2")) {
	/* $("li:has(:contains('Критерии оценки'))").show();
	$("input[data-field-name*='CritTab-markCrit']").prop('required', true); */
	$("li:has(:contains('Критерии оценки'))").hide();
	$("input[data-field-name*='CritTab-markCrit']").prop('required', false);
	} else {
	$("li:has(:contains('Критерии оценки'))").hide();
	$("input[data-field-name*='CritTab-markCrit']").prop('required', false);
	}
}

var criteriiview = function() {
	$("div[data-name='Форма торгов']").closest(".row").hide();
    var formtorg = $(".documentView-field-value[data-name='Форма торгов']").text();
	var registerProtocol = $(".documentView-field-value[data-name='Код протокола']").text();
	var ProtocolItogCodes = [
		"4369", "4249",
		"4270", "4333", "2",
		"161918", "161917",
		"161908", "200623"
	]
	if (((formtorg=="3") || (formtorg=="4") || (formtorg=="5") || (formtorg=="1")) && ($.inArray(registerProtocol, ProtocolItogCodes) != -1)) {
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
/* scopes.onEdit(Dopusk); */

scopes.onView(View);
scopes.onView(hideDownPerc);
scopes.onView(DopuskView);
scopes.onView(TablesView);
scopes.onView(criteriiview);
scopes.onView(PeretorgView);