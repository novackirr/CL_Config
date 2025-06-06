"use strict";

$(document).ready(function () {  
      $("div[id='attachments-view--1209138819']").find('.dx-menu-item-wrapper').hide();
});

var EditReg = function() {      
	    $("li:has(:contains('Скрытые поля'))").hide();
		/* $("div[data-name='Отклонение']").closest(".column-container").hide();
		if ($("input[name='idetp']").val()=='1') {
			$("input[data-field-name='otklonenie']").closest(".column-container").hide();
			$("div[data-related-field='otklonenie']").closest(".column-container").hide();
		} */
}

var Otklonenie = function() {
	var flag = $("input[data-field-name='otklonenie']");
	var dateOtklon=$("input[name='dateOtklon']");
	var PrichinaOtklon=$("textarea[name='PrichinaOtklon']");
	var dateRaz=$("input[name='dateRaz']");
	var OisanieRaz=$("textarea[name='OisanieRaz']");
        if ($(flag).is(":checked")) {		
			dateOtklon.closest(".column-container").show();		
			$("[data-related-field=dateOtklon]").closest(".column-container").show();
            $("[data-related-field=dateOtklon]").addClass("label-required");
			dateOtklon.prop('required', true);
			PrichinaOtklon.closest(".column-container").show();		
			$("[data-related-field=PrichinaOtklon]").closest(".column-container").show();
            $("[data-related-field=PrichinaOtklon]").addClass("label-required");
			PrichinaOtklon.prop('required', true);
			dateRaz.closest(".column-container").hide();		
			$("[data-related-field=dateRaz]").closest(".column-container").hide();
            $("[data-related-field=dateRaz]").removeClass("label-required");
			dateRaz.prop('required', false);
			OisanieRaz.closest(".column-container").hide();		
			$("[data-related-field=OisanieRaz]").closest(".column-container").hide();
            $("[data-related-field=OisanieRaz]").removeClass("label-required");
			OisanieRaz.prop('required', false);
		}
		else
		{   		
			dateOtklon.closest(".column-container").hide();		
			$("[data-related-field=dateOtklon]").closest(".column-container").hide();
            $("[data-related-field=dateOtklon]").removeClass("label-required");
			dateOtklon.prop('required', false);
			PrichinaOtklon.closest(".column-container").hide();		
			$("[data-related-field=PrichinaOtklon]").closest(".column-container").hide();
            $("[data-related-field=PrichinaOtklon]").removeClass("label-required");
			PrichinaOtklon.prop('required', false);
			dateRaz.closest(".column-container").show();		
			$("[data-related-field=dateRaz]").closest(".column-container").show();
            $("[data-related-field=dateRaz]").addClass("label-required");
			dateRaz.prop('required', true);
			OisanieRaz.closest(".column-container").show();		
			$("[data-related-field=OisanieRaz]").closest(".column-container").show();
            $("[data-related-field=OisanieRaz]").addClass("label-required");
			OisanieRaz.prop('required', true);
		}
}	


var OtklonenieView = function() {
	var flag = $("div[data-name='Отклонение']").find("input[type='checkbox']");
	var dateOtklon=$("div[data-name='Дата отклонения']");
	var PrichinaOtklon=$("div[data-name='Причина отклонения']");
	var dateRaz=$("div[data-name='Дата публикации разъяснения']")
	var OisanieRaz=$("div[data-name='Текст разъяснения']");
        if ($(flag).is(":checked")) {		
			dateOtklon.closest(".column-container").show();		
			PrichinaOtklon.closest(".column-container").show();	
			dateRaz.closest(".column-container").hide();		
			OisanieRaz.closest(".column-container").hide();	
		}
		else
		{   		
			dateOtklon.closest(".column-container").hide();		
			PrichinaOtklon.closest(".column-container").hide();	
			dateRaz.closest(".column-container").show();		
			OisanieRaz.closest(".column-container").show();	
		}
}

$(document).on('change', "input[data-field-name='otklonenie']", function (e) {
	var flag = $("input[data-field-name='otklonenie']");
	var dateOtklon=$("input[name='dateOtklon']");
	var PrichinaOtklon=$("textarea[name='PrichinaOtklon']");
	var dateRaz=$("input[name='dateRaz']");
	var OisanieRaz=$("textarea[name='OisanieRaz']");
        if ($(flag).is(":checked")) {		
			dateOtklon.closest(".column-container").show();		
			$("[data-related-field=dateOtklon]").closest(".column-container").show();
            $("[data-related-field=dateOtklon]").addClass("label-required");
			dateOtklon.prop('required', true);
			PrichinaOtklon.closest(".column-container").show();		
			$("[data-related-field=PrichinaOtklon]").closest(".column-container").show();
            $("[data-related-field=PrichinaOtklon]").addClass("label-required");
			PrichinaOtklon.prop('required', true);
			dateRaz.closest(".column-container").hide();		
			$("[data-related-field=dateRaz]").closest(".column-container").hide();
            $("[data-related-field=dateRaz]").removeClass("label-required");
			dateRaz.prop('required', false);
			OisanieRaz.closest(".column-container").hide();		
			$("[data-related-field=OisanieRaz]").closest(".column-container").hide();
            $("[data-related-field=OisanieRaz]").removeClass("label-required");
			OisanieRaz.prop('required', false);
			dateRaz.val('');
			OisanieRaz.val('');
		}
		else
		{   		
			dateOtklon.closest(".column-container").hide();		
			$("[data-related-field=dateOtklon]").closest(".column-container").hide();
            $("[data-related-field=dateOtklon]").removeClass("label-required");
			dateOtklon.prop('required', false);
			PrichinaOtklon.closest(".column-container").hide();		
			$("[data-related-field=PrichinaOtklon]").closest(".column-container").hide();
            $("[data-related-field=PrichinaOtklon]").removeClass("label-required");
			PrichinaOtklon.prop('required', false);
			dateRaz.closest(".column-container").show();		
			$("[data-related-field=dateRaz]").closest(".column-container").show();
            $("[data-related-field=dateRaz]").addClass("label-required");
			dateRaz.prop('required', true);
			OisanieRaz.closest(".column-container").show();		
			$("[data-related-field=OisanieRaz]").closest(".column-container").show();
            $("[data-related-field=OisanieRaz]").addClass("label-required");
			OisanieRaz.prop('required', true);
			dateOtklon.val('');
			PrichinaOtklon.val('');
		}
});	

function customDropDownHandle(){
	$(".document-view-actions").find("a:contains('Отправить на ЭТП')").each(function() {
		var button = $(this);
		var onclickFunc = button.attr('onclick');
		button.attr('onclick', 'return false;');
		button.click(function(ev) {
			var idDocs =  $("li[data-tabname='Документы разъяснения']").find('a').attr('data-target');
			var CreateOnE1 = $("div .documentView-field-value[data-name='Создана в Е1']");
			var Otkl = $("div .documentView-field-value[data-name='Отклонение']");
			var IDETP = $("div .documentView-field-value[data-name='ИД ЭТП']");
			var CreateOnEETP = $("div .documentView-field-value[data-name='Сгенерировать файл на площадке']");
			var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
			var getNameAndDiscObj = $.grep(dxDataGridDocs._items, function(item){
				return item.Fields.VidDoc == "Документы разъяснения";
			});
			var errorMessage = '';
			var textErrors = [];
			
			if($("li:has(:contains('Документы разъяснения'))").find(".badge").text()<1 && (CreateOnE1.attr('title') != '1') && (Otkl.attr('title') != '1' || IDETP.attr('title') == '1')){
				errorMessage = "Для отправки на ЭТП необходимо присоединить файлы во вкладку Документы разъяснения";
				showCommonErrors(errorMessage);
				return;
				
			} 
			/* Если "МСП плоощадка" и "Создана в Е1" и не  "Сгенерировать файл на площадке"*/
			else if (IDETP.attr('title') == '1' && CreateOnE1.attr('title') == '1' && CreateOnEETP.attr('title') != '1' && FindDocumentRequest() <= 0) {
				errorMessage = 'Для отправки на ЭТП необходимо присоединить файлы во вкладку "Документы запроса" с признаком "Публикуется" или проставить чекбокс "Сгенерировать файл на площадке"';
				showCommonErrors(errorMessage);
				return;
			}
			 /* Если СберАСТ и не создана в Е1 и нет доков с "Публикуется"*/
			else if (IDETP.attr('title') == '2' && CreateOnE1.attr('title') != '1' && FindDocumentResponse() <= 0) {
				errorMessage = 'Для отправки на ЭТП необходимо присоединить файлы во вкладку "Документы разъяснения" с признаком "Публикуется"';
				showCommonErrors(errorMessage);
				return;
			}
			/* Если СберАСТ и создана в Е1 и нет доков с "Публикуется"*/
			else if (IDETP.attr('title') == '2' && CreateOnE1.attr('title') == '1' && CreateOnEETP.attr('title') != '1' && FindDocumentRequest() <= 0) {
				errorMessage = 'Для отправки на ЭТП необходимо присоединить файлы во вкладку "Документы запроса" с признаком "Публикуется"';
				showCommonErrors(errorMessage);
				return;
			}
			else{
				eval(onclickFunc);
			}
			
			// Проверка на документы разъяснения и признак "Публикация"
			function FindDocumentResponse() {
				var countPublicResponse = 0;	
				var idDocsResponse =  $("li[data-tabname='Документы разъяснения']").find('a').attr('data-target');
				var dxDataGridDocsResponse = $(idDocsResponse).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
				var getNameAndDiscObjResponse = $.grep(dxDataGridDocsResponse._items, function(item){
					if (item.Fields.AttachmentPublication == "Публикуется"){
						countPublicResponse++
					}
				});
				return countPublicResponse;
			}
			
			// Проверка на документы запроса и признак "Публикация"
			function FindDocumentRequest() {
				var countPublicResponse = 0;	
				var idDocsResponse =  $("li[data-tabname='Документы запроса']").find('a').attr('data-target');
				var dxDataGridDocsResponse = $(idDocsResponse).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
				var getNameAndDiscObjResponse = $.grep(dxDataGridDocsResponse._items, function(item){
					if (item.Fields.AttachmentPublication == "Публикуется"){
						countPublicResponse++
					}
				});
				return countPublicResponse;
			} 
			
		});
		
	});
}

/* function createOnE1(){
	if ($("input[name='idetp']").val()=='') {
		$("input[name='NumRequest']").removeAttr("readonly")
		$("input[name='DateRequest']").removeAttr("readonly")
		$("textarea[name='OpisReq']").removeAttr("readonly")
	}
} */

/* 
function onReg(){
	$("[data-related-field=dateRaz]").closest("fieldset").parent().parent().hide();
	$("[data-related-field=OisanieRaz]").removeClass("label-required");
	$("textarea[data-field-name='OisanieRaz']").prop('required', false);
	$("input[data-field-name=dateRaz]").prop("required", false);
	$("[data-related-field=dateRaz]").removeClass("label-required");
} */
// Если запрос на разъяснение создается в Е1
var CreateOnE1Logic = function() {
	var CreateOnE1 = $("input[data-field-name='CreateOnE1']"); // Проставляется хуком в момент создания карточки
	var requestChange = $("input[data-field-name='requestChange']")
	var Supllier = $("input[data-field-name='SupplierCode']");
	var SupplierINN = $("input[data-field-name='SupplierINN']");
	var SupplierMobile = $("input[data-field-name='SupplierMobile']");
	var SupplierMail = $("input[data-field-name='SupplierMail']");
	var DateRequest = $("input[data-field-name='DateRequest']"); 
	var dueData = $("input[data-field-name='dueData']"); 
	var idetp = $("input[name='idetp']").val(); 
	var BlockCustomer = $("input[name='BlockCustomer']"); 
	var CreateOnEETP = $("input[name='CreateOnEETP']"); 
	var ClarificationWithoutRequest = $("input[data-field-name='ClarificationWithoutRequest']"); 
	var ArrDefaultHide = ['RequestTitle', 'ResponseTitle', 'ShowRequestFile', 'RequestDataExplanationResponsePlanDate', 'RequestDataExplanationAdditionalEmails', 'RequestDataExplanationIsChangeableName', 'RequestInformation'];
	
	filedHideAndNotRequired(ArrDefaultHide); // поумолчанию скрываю поля
	
	if (CreateOnE1.is(':checked')) {
		
		if (['2'].indexOf(idetp) == -1) {
			
			Supllier.prop('required', true);
			$("div .documentView-field-label[data-related-field='SupplierCode']").addClass("label-required");
			// Делаем дату публикации запроса не обязательным
			DateRequest.prop('required', false); 
			$("div .documentView-field-label[data-related-field='DateRequest']").removeClass("label-required");
			//
			$("div fieldset legend:contains('Сведения о поставщике')").closest(".row-container").show();
			$($("div fieldset legend:contains('Сведения о поставщике')").closest(".row-container").siblings(".row-container")[0]).show(); // отображаю пустую строку после блока "Сведения о поставщике"
			$("textarea[name='OpisReq']").prop("readonly", false);
			$("textarea[name='OpisReq']").prop("required", true);
			$("div .documentView-field-label[data-related-field='OpisReq']").addClass("label-required");
			// 
			$("input[data-field-name='NumRequest']").closest('.column-container').hide();
			$("input[data-field-name='DateRequest']").closest('.column-container').hide();
			$("div .documentView-field-label[data-related-field='NumRequest']").closest('.column-container').hide();
			$("div .documentView-field-label[data-related-field='DateRequest']").closest('.column-container').hide();
			// Крайни срок предоставления ответа
			dueData.prop('required', true);
			$("div .documentView-field-label[data-related-field='dueData']").addClass("label-required");
			dueData.closest(".column-container").show();
			$("div .documentView-field-label[data-related-field='dueData']").closest(".column-container").show();
			// Вскртыие блока разъяснения
			$("div fieldset legend:contains('Разъяснение')").closest(".row-container").hide();
			$("[data-related-field=OisanieRaz]").removeClass("label-required");
			$("textarea[data-field-name='OisanieRaz']").prop('required', false);
			$("input[data-field-name=dateRaz]").prop("required", false);
			$("[data-related-field=dateRaz]").removeClass("label-required");
			$("li[data-tabname='Документы разъяснения']").hide();
				if (idetp == '1') {
					BlockCustomer.closest('.column-container').show();
					CreateOnEETP.closest('.column-container').show();
				} else {
					BlockCustomer.closest('.column-container').hide();
					CreateOnEETP.closest('.column-container').hide();
				}
			
		}
		// Если это Сбер АСТ
		else if (['2'].indexOf(idetp) > -1) {
			LegendAndPrevEmptyRowHide(['Разъяснение']);
			$("li[data-tabname='Документы разъяснения']").hide();
			filedHideAndNotRequired(['OisanieRaz', 'dateRaz', 'otklonenie', 'BlockCustomer', 'CreateOnEETP', 'NumRequest', 'DateRequest']);
			filedShow(['RequestDataExplanationAdditionalEmails', 'RequestDataExplanationResponsePlanDate']);
			filedShowAndRequiredAndNotReadonly(['RequestTitle', 'OpisReq']);
			filedShowAndRequired(['RequestDataExplanationIsChangeableName', 'SupplierCode']);
			// custom
			$("textarea[name='RequestDataExplanationAdditionalEmails']").css({
				'height': '68px'
			});
			
			$("input[name='RequestDataExplanationIsChangeableName']").on('change', function() {
				RequiredDateIfChangeTrue();// вызов функции
			})
			
			RequiredDateIfChangeTrue();// вызов функции
		}
		
	}  
	// Если запрос загружен из Сбер-АСТ
	else if(idetp =='2') {
		// Разъяснение без запроса
		if (ClarificationWithoutRequest.is(':checked')) {
			
			LegendAndNextEmptyRowHide(['Сведения о поставщике', 'Запрос']);
			$("li[data-tabname='Документы запроса']").hide();
			filedClearAndHide(['otklonenie', 'dateRaz', 'SupplierCode', 'SupplierINN', 'SupplierMobile', 'SupplierMail', 'dueData', 'BlockCustomer', 'CreateOnEETP', 'EmptyLabel', 'OisanieRaz']); // скрываем поля которые не нужны для Сбер-АСТ
			filedNotRequired(['DateRequest']); // делаем не обязательными
			
			if (requestChange.is(':checked')) {
				filedShowAndRequired(['ResponseTitle']); // отобразить и сделать обязательным
				filedShow(['ShowRequestFile'])
			}
			else {

				filedShowAndRequired(['ResponseTitle', 'RequestInformation']); // отобразить и сделать обязательным
			}
			
			
		}
		else {
			var ArrfiledHide = ['otklonenie', 'dateRaz', 'SupplierCode', 'SupplierINN', 'SupplierMobile', 'SupplierMail', 'dueData', 'BlockCustomer', 'CreateOnEETP', 'EmptyLabel'];
			$("div fieldset legend:contains('Сведения о поставщике')").closest(".row-container").hide();
			$($("div fieldset legend:contains('Сведения о поставщике')").closest(".row-container").siblings(".row-container")[0]).hide(); // скрываю пустую строку после скрытия блока "Сведения о поставщике"
			filedClearAndHide(ArrfiledHide); // скрываем поля которые не нужны для Сбер-АСТ
			filedHideAndNotRequired(['NumRequest']); // скрываем и делаем не обязательным
			filedNotRequired(['DateRequest']); // делаем не обязательными
			filedShowAndRequired(['ResponseTitle']); // отобразить и сделать обязательным
			filedShowAndReadonly(['RequestTitle']); // отобразить и сделать не редактируемым
			filedShow(['ShowRequestFile']); // отобразить и сделать не редактируемым
		}	
	} 
	else {
		Supllier.prop('required', false);
		$("div .documentView-field-label[data-related-field='SupplierCode']").removeClass('label-required');
		$("div fieldset legend:contains('Сведения о поставщике')").closest(".row-container").hide();
		$($("div fieldset legend:contains('Сведения о поставщике')").closest(".row-container").siblings(".row-container")[0]).hide(); // скрываю пустую строку после скрытия блока "Сведения о поставщике"
		//
		/* $("input[data-field-name='NumRequest']").closest('.column-container').show();
		$("input[data-field-name='DateRequest']").closest('.column-container').show();
		$("div .documentView-field-label[data-related-field='NumRequest']").closest('.column-container').show();
		$("div .documentView-field-label[data-related-field='DateRequest']").closest('.column-container').show(); */
		// Крайни срок предоставления ответа
		dueData.prop('required', false);
		$("div .documentView-field-label[data-related-field='dueData']").removeClass("label-required");
		dueData.closest(".column-container").hide();
		$("div .documentView-field-label[data-related-field='dueData']").closest(".column-container").hide();
		// Отображение блока разъяснения
		/* $("div fieldset legend:contains('Разъяснение')").closest(".row-container").show(); */
		/* $("[data-related-field=OisanieRaz]").addClass("label-required");
		$("textarea[data-field-name='OisanieRaz']").prop('required', true);
		$("input[data-field-name=dateRaz]").prop("required", true);
		$("[data-related-field=dateRaz]").addClass("label-required"); */
		BlockCustomer.closest('.column-container').hide();
		CreateOnEETP.closest('.column-container').hide();
	}
	
	//Сбер-АСТ
	function RequiredDateIfChangeTrue() {
		var RequestDataExplanationIsChangeableName = $("input[name='RequestDataExplanationIsChangeableName']").val();
		
		if (RequestDataExplanationIsChangeableName == 'Да') {
			filedShowAndRequired(['dueData']);
		}
		else {
			filedNotRequired(['dueData']);
		}
	}
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

// скрываем и делаем не обязательными
function filedHideAndNotRequired(Arr) {
	Arr.forEach(function(item, i) {
		var current = $("[data-field-name='"+item+"']"); // текущий элемент
		current.closest('.column-container').hide();  // скрываем текущий элемент
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide(); // скрываем label
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
		current.prop('required', false);
	});	
}

// делаем не обязательными
function filedNotRequired(Arr) {
	Arr.forEach(function(item, i) {
		var current = $("[data-field-name='"+item+"']"); // текущий элемент
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
		current.prop('required', false);
	});	
}

//отобразить и сделать обязательным и редактируемым
function filedShowAndRequiredAndNotReadonly (Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			$("[data-field-name='"+item+"']").prop('required', true);
			$("[data-field-name='"+item+"']").prop('readonly', false);
			$("div.documentView-field-label[data-related-field='"+item+"']").addClass('label-required');
			$("[data-field-name='"+item+"']").closest('.column-container').show();
			$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
		})
	}
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

// отображение полей
function filedShow(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').show();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
	});
}

// отобразить поле и сделать их нередактируемыми
function filedShowAndReadonly(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').show();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
		$("[data-field-name='"+item+"']").prop('readonly', true);
		$("[data-field-name='"+item+"']").addClass('readonly-field');
	});
}

// View скрыть поля
function ViewfiledHide(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
	});
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

// View отобразить поля
function ViewfiledShow(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').show();
	});
}

var CreateOnE1LogicView = function() {
	var CreateOnE1 = $("div .documentView-field-value[data-name='Создана в Е1']");
	var IDETP = $("div .documentView-field-value[data-name='ИД ЭТП']");
	var BlockAnswer = $("div .documentView-field-value[data-name='Блокировать ответ по истечению срока']");
	var CreateOnEETP = $("div .documentView-field-value[data-name='Сгенерировать файл на площадке']");
	var ClarificationWithoutRequest = $("div .documentView-field-value[data-name='Разъяснение без запроса']").attr('title') ;
	var RequestChange = $("div .documentView-field-value[data-name='Внесение изменений']").attr('title') ;
	var ClarificationText =  $("div .documentView-field-value[data-name='Текст разъяснения']");
	var cancelText =  $("div .documentView-field-value[data-name='Причина отклонения']");
	var Arr = ['Номер запроса', 'Дата публикации запроса', 'Дата отклонения', 'Основания внесения изменений', 'Дата публикации разъяснения'];
	var ArrDefaultHide = ['Тема запроса', 'Тема разъяснения', 'Создана в Е1', 'ИД ЭТП', 'Разместить файл запроса участника при ответе?', 'Регламентный срок ответа на запрос', 'Возможно внесение корректировок в ответ', 'Дополнительный e-mail', 'Разъяснение без запроса', 'Сведения о предмете запроса', 'Внесение изменений', 'Номер редакции'];
	
	ViewfiledHide(ArrDefaultHide); // поля которые скрываем по умолчанию
	
	Arr.forEach(function(currentelement, i) {
		var requisite = $("div .documentView-field-value[data-name='"+currentelement+"']");
		if (!(requisite.attr('title'))){
			requisite.closest('.column-container').hide();
		}
	})
	
	if (CreateOnE1.attr('title') == '1') {
		
		if (['2'].indexOf(IDETP.attr('title')) == -1) {
			
			$("div fieldset legend:contains('Сведения о поставщике')").closest(".column-container").show();
			$("div fieldset legend:contains('Сведения о поставщике')").closest(".column-container").prev(".column-container").show();
			$("div .documentView-field-value[data-name='Срок предоставления ответа']").closest('.row').show();
			if (IDETP.attr('title') == '1') {
				BlockAnswer.closest('.column-container').show();
				CreateOnEETP.closest('.column-container').show();
			} else {
				BlockAnswer.closest('.column-container').hide();
				CreateOnEETP.closest('.column-container').hide();
			}
			
			if (!(ClarificationText.attr('title')) && !(cancelText.attr('title'))) {
				$("div fieldset legend:contains('Разъяснение')").closest(".column-container").hide();
			}
		}
		else if (['2'].indexOf(IDETP.attr('title')) > -1) {

			ViewfiledHide(['Блокировать ответ по истечению срока', 'Сгенерировать файл на площадке', 'Текст разъяснения', 'Отклонение']);
			ViewfiledShow(['Тема запроса', 'Регламентный срок ответа на запрос', 'Возможно внесение корректировок в ответ', 'Дополнительный e-mail']); // отобразить поля на View
			
			var ClarificationDate = $("div .documentView-field-value[data-name='Дата публикации разъяснения']").attr('title');
			if (!(ClarificationDate)) {
				$("div fieldset legend:contains('Разъяснение')").closest(".column-container").hide();
			}
		}
		
		
	} 
	else if (IDETP.attr('title') == '2') {
		
		if (ClarificationWithoutRequest == '1') {
			
			LegendAndNextEmptyRowHide(['Сведения о поставщике', 'Запрос', 'Документы запроса']);
			ViewfiledHide(['Срок предоставления ответа', 'Блокировать ответ по истечению срока', 'Сгенерировать файл на площадке', 'Отклонение', 'Текст разъяснения']); // скрыть поля на View
			ViewfiledShow(['Тема разъяснения', 'Сведения о предмете запроса']);
			
			if (RequestChange == '1') {
				ViewfiledShow(['Номер редакции', 'Разместить файл запроса участника при ответе?']);
			}
			
		}
		else {
			var ArrfiledHide = ['Срок предоставления ответа', 'Блокировать ответ по истечению срока', 'Сгенерировать файл на площадке', 'Отклонение'];
			$("div fieldset legend:contains('Сведения о поставщике')").closest(".column-container").hide();
			$("div fieldset legend:contains('Сведения о поставщике')").closest(".column-container").prev(".column-container").hide();
			
			ViewfiledHide(ArrfiledHide); // скрыть поля на View
			ViewfiledShow(['Тема запроса', 'Тема разъяснения', 'Разместить файл запроса участника при ответе?']); // отобразить поля на View
		}
		
	}
	else {
		$("div fieldset legend:contains('Сведения о поставщике')").closest(".column-container").hide();
		$("div fieldset legend:contains('Сведения о поставщике')").closest(".column-container").prev(".column-container").hide();
		$("div .documentView-field-value[data-name='Срок предоставления ответа']").closest('.row').hide();
		BlockAnswer.closest('.column-container').hide();
		CreateOnEETP.closest('.column-container').hide();
	}
	
}


  
scopes.onRegister(Otklonenie);
scopes.onRegister(EditReg);
/* scopes.onRegister(createOnE1); */
/* scopes.onRegister(onReg); */
scopes.onRegister(CreateOnE1Logic);


scopes.onEdit(Otklonenie);
scopes.onEdit(EditReg);
scopes.onEdit(CreateOnE1Logic);
/* scopes.onEdit(createOnE1); */

scopes.onView(EditReg);
scopes.onView(OtklonenieView);
scopes.onView(CreateOnE1LogicView);
scopes.onView(customDropDownHandle);