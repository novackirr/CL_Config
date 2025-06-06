"use strict";

var GlobalProtocols = []; // глобальная переменная где хранятся доступные протоколы
var GlobalProcedureType = []; // глобальная переменная где хранится инфорамция о типе процедуры
var GlobalAdditionalStep = []; // глобальная переменная где хранятся дополнительные этапы по процедуре
var GlobalPurchaseDeliveryPlace = []; // глобальная переменная где хранятся места поставок по обычным этапам

// выполнение асинхронных запросов
var AsyncResponse = function() {
	
	var naimETP = $("input[name='naimETP']").val(); // площадка
	var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
	
	
	if (naimETP == 'АО "Сбербанк - АСТ"' && CreateIsNotice.is(':checked')) {
		
		waitingDialog.show('Загрузка данных'); // отображаем модалку загрузки
		$.when(FindSupplierForSberAST(), FindProtocolForSberAST(), CheckAdditionalStepForSberAST(), CheckPurchaseDeliveryPlace(), GetProcedureType()).then(function() {			
			waitingDialog.hide(); // скрываем модалку загрузки
			HideWaitingDialog; // вешаем setInterval, если по какой-то причине WaitingDialog не завершился
		});
	}
	
}

// Сбербанк-АСТ поиск заявок участников
function FindSupplierForSberAST() {
	var defer = jQuery.Deferred();
	var LotsTab = $("div[data-name='LotsTab']");
	var LotsTabParentRow = $(LotsTab).children().children("[data-rowkey]");
	var uniqueIds = $("input[name='uniqueIds']"); // если есть, то значит документ на редактировании
	var amendment = $("input[name='amendment']"); // создание версии
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	var ID_Izv = $("input[name='ID_Izv']").val(); // ИД извещения в Е1
	var registerProtocol = $("input[name='registerProtocol']");
	var formValues = '{ID_Izv: '+ID_Izv+'}';
	/* if (amendment.val() != 1) { */
		if (uniqueIds.length == 0 ) {	
			FormDictionaryHelperModule.getFormDictionaryItemsIds("СбербанкАСТ_ЗУ", dictFieldsInfo, formValues, function (data) {
				var parseData = JSON.parse(data.data);
				var Applic = parseData.children;
				if (LotsTabParentRow.length > 0) {
					LotsTabParentRow.each(function(index, Row){
						var ParentRowLotID = $(Row).find("input[name*='-LotIdOnEETP-']").val();
						var ParentRowAddButton = $(Row).find('.table-add-row-button')[0];
						if (Applic.length > 0){
							Applic.forEach(function(item, i){
								var LotId = item['Ид_лота_на_ЭТП']; // ИД лота на ЭТП
								if (ParentRowLotID == LotId) {
									addNewTableRow(ParentRowAddButton, event); // создать новую строку
									var CurrentSubRow = $(Row).find('[data-rowkey]').last(); // Определяем последнюю созданную строчку
									CurrentSubRow.find("input[name*='-LOTSapplicId-']").val(item['code']);
									CurrentSubRow.find("input[name*='-LOTSapplicNumber-']").val(item['Номер_заявки']);
									CurrentSubRow.find("input[name*='-LOTSapplicName-']").val(item['Участник_заявки_наименование']);
									/* CurrentSubRow.find("input[name*='-LOTSpriceNDS-']").autoNumeric('set', item['Окончательная_цена_с_НДС']);
									CurrentSubRow.find("input[name*='-LOTSpriceOutNDS-']").autoNumeric('set', item['Окончательная_цена_без_НДС']); */
									CurrentSubRow.find("input[name*='-LOTSSupplierPrice-']").autoNumeric('set', item['Цена_участника']);
									CurrentSubRow.find("input[name*='-LOTSRequestPrice-']").autoNumeric('set', item['Цена_участника']);
									CurrentSubRow.find("input[name*='-LOTSofferOutOfStepWithVAT-']").autoNumeric('set', item['ЦП_вне_шага_с_НДС']);
									CurrentSubRow.find("input[name*='-LOTSofferOutOfStepWithoutVAT-']").autoNumeric('set', item['ЦП_вне_шага_без_НДС']);
									CurrentSubRow.find("input[name*='-LOTScpNds-']").autoNumeric('set', item['ЦП_с_НДС']);
									CurrentSubRow.find("input[name*='-LOTSpriceWithoutVAT-']").autoNumeric('set', item['ЦП_без_НДС']);
									CurrentSubRow.find("input[name*='-LOTSpercentageReduction-']").val(item['Процент_снижения_от_НМЦ']);
									CurrentSubRow.find("input[name*='-LOTSnds-']").val(item['НДС']);
									CurrentSubRow.find("input[name*='-LOTSdate_offer-']").val(item['Дата_подачи_ЦП']);
									CurrentSubRow.find("input[name*='-LOTSapplicDate-']").val(item['Дата_подачи_заявки']);
									/* Валюта */
									CurrentSubRow.find("input[name*='-LOTSCurrency_kod-']").val(item['Код_валюты']);
									CurrentSubRow.find("input[data-field-name*='-LOTSCurrency_kod-']").val(item['Валюта']);
									CurrentSubRow.find("input[name*='-LOTSCurrency-']").val(item['Валюта']);
									CurrentSubRow.find("input[name*='-LOTSCurrency_dig_kod-']").val(item['Цифровой_код_валюты']);
								}
								
							})
						}
						
					})
					
				}
				declineReasonHandling();  // Отображение поля Причина отказа в допуске
				HideSupplierPriceIFEmptyOnEdit();  // скрываем Цену участника 
				SberAstPlaceFilter(); // СберАСТ кнопка фильтрации места
				SberAstAllowedFilter(); // кнопка фильтрации допусков
				
				// Если Наименование протокола уже заполнена
				if (registerProtocol.val()) {
					applicTableHandling(); // вызов функции, валидации столбцов и полей
					// Если версия документа
					if (amendment.val() == 1) {
						$("button[id='registerProtocol']").prop('disabled', true)
					}
				}
				
				defer.resolve(); // положительный ответ промиса
			}, function (error) {
				
				defer.reject();  // отрицательный ответ промиса
				showCommonErrors(error);
			});
			return defer.promise();
		}
	/* } */
	
}

// Сбербанк-АСТ загрузка информации о протоколах по форме торгов
function FindProtocolForSberAST() {
	var defer = jQuery.Deferred();
	var OrgZakupkiINN = $("input[name='OrgZakupkiINN']").val();
	var OrgZakupkiKPP = $("input[name='OrgZakupkiKPP']").val();
	var formacode = $("input[name='formacode']").val();
	var forma = $("input[name='forma']").val();
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	var formValues = '{formacode: '+formacode+', OrgZakupkiINN: '+OrgZakupkiINN+', OrgZakupkiKPP: '+OrgZakupkiKPP+'}';
	
	FormDictionaryHelperModule.getFormDictionaryItemsIds("СберАСТ Протоколы по форме торгов", dictFieldsInfo, formValues, function (data) {
		var parseData = JSON.parse(data.data);
		GlobalProtocols = parseData.children; // добавляем протоколы в глобальную перемнную
		
		// кастомная логика
		// Запрос котировок (заявка из 2-х частей)
		if (forma == 'Запрос котировок (заявка из 2-х частей)') {
			GlobalProtocols.push({
				'id'						   : '17',
				'code'                         : '17',
				'Наименование_протокола_в_ЕИС' : 'Протокол рассмотрения 2-х частей заявок',
				'Наименование_протокола_на_ЭТП': 'Протокол рассмотрения 2-х частей заявок',
				'Направить_протокол_в_ЕИС'     : 'Да'
			})
		}
		
		
		defer.resolve(); // положительный ответ промиса
	}, function (error) {
		console.log(error);
		defer.reject();  // отрицательный ответ промиса
		showCommonErrors(error);
	});
	
	return defer.promise();		
}

// Сбербанк-АСТ  тут проверяем дополнительные этапы на процедуре
function CheckAdditionalStepForSberAST(){
	var defer = jQuery.Deferred();
	var ID_Izv = $("input[name='ID_Izv']").val();
	var formValues = '{ID_Izv: '+ID_Izv+'}';
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	FormDictionaryHelperModule.getFormDictionaryItemsIds("СберАСТ Дополнительные этапы по процедуре", dictFieldsInfo, formValues, function (data) {
		var parseData = JSON.parse(data.data).children;
		
		if (parseData.length > 0) {
			parseData.forEach(function(item, i) {
				if (item['ДопЭтап_Наименование_этапа'] == 'Квалификационный отбор') {
					item['Наименование протокола'] = 'Протокол квалификации';
					item['Код протокола'] = 'ancorProtocolQualification';
				}
				GlobalAdditionalStep.push(item);
			})
		}
						
		defer.resolve(); // положительный ответ промиса
	}, function (error) {
		console.log(error);
		defer.reject();  // отрицательный ответ промиса
		showCommonErrors(error);
	});
	
	return defer.promise();	
}

// Сбербанк-АСТ  тут вытаскиваем и кладем в массив информацию о типе процедуры
function GetProcedureType(){
	var defer = jQuery.Deferred();
	var OrgZakupkiINN = $("input[name='OrgZakupkiINN']").val();
	var OrgZakupkiKPP = $("input[name='OrgZakupkiKPP']").val();
	var formacode = $("input[name='formacode']").val();
	var forma = $("input[name='forma']").val();
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	var formValues = '{formacode: '+formacode+', OrgZakupkiINN: '+OrgZakupkiINN+', OrgZakupkiKPP: '+OrgZakupkiKPP+'}';
	
	FormDictionaryHelperModule.getFormDictionaryItemsIds("СберАСТ Сведения о типе процедуры", dictFieldsInfo, formValues, function (data) {
		var parseData = JSON.parse(data.data);
		GlobalProcedureType = parseData.children; // добавляем протоколы в глобальную перемнную
		
		defer.resolve(); // положительный ответ промиса
	}, function (error) {
		console.log(error);
		defer.reject();  // отрицательный ответ промиса
		showCommonErrors(error);
	});
	
	return defer.promise();	
}

function CheckPurchaseDeliveryPlace(){
	var defer = jQuery.Deferred();
	var ID_Izv = $("input[name='ID_Izv']").val();
	var formValues = '{ID_Izv: '+ID_Izv+'}';
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	FormDictionaryHelperModule.getFormDictionaryItemsIds("СберАСТ Места поставок", dictFieldsInfo, formValues, function (data) {
		var parseData = JSON.parse(data.data);
		GlobalPurchaseDeliveryPlace = parseData.children; // добавляем протоколы в глобальную перемнную
						
		defer.resolve(); // положительный ответ промиса
	}, function (error) {
		console.log(error);
		defer.reject();  // отрицательный ответ промиса
		showCommonErrors(error);
	});
	
	return defer.promise();	
}

// функция по вызову функций по условию
var functionCall = function() {
	var naimETP = $("input[name='naimETP']").val(); // площадка
	var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
	if (naimETP == 'АО "Сбербанк - АСТ"' && CreateIsNotice.is(':checked')) {
		HideSupplierPriceIFEmptyOnEdit(); // скрываем Цену участника  
	}
}
// скрываем Цену участника если оно пустое СберАСТ
function HideSupplierPriceIFEmptyOnEdit() {
	var Table = $("div[data-name='LotsTab']");
	var TableParentRows = $(Table).children().children("[data-rowkey]");
	TableParentRows.each(function(i, item){
		var LOTSSupplierPriceArr = $(item).find("input[name*='-LOTSSupplierPrice']").toArray();
		if (LOTSSupplierPriceArr.length > 0) {
			// проверяем, что хотя бы у одной строки заполнена цена, если нет то скрываем
			if (!LOTSSupplierPriceArr.some(ArrSome)) {
				HideTableColumnAndNotRequired(item, ['LOTSSupplierPrice']); // скрыть столбцы и сделать необязательными
			}
		}
	})
	
	function ArrSome(elem) {
		return $(elem).val();
	}
}

function HideWaitingDialog() {
	let Interval = setInterval(function(time){
		if (waitingDialogIsVisible()) {
			waitingDialog.hide();
		} else {
			clearInterval(Interval);
		}
	}, 3000);
		
	function waitingDialogIsVisible() {
		return waitingDialog.isVisible()
	}
}

$(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
	/* var item = $(value); */
	var item = $("input[data-field-name*='applicTab-koefSnizNoNDS']");
	if (item.length > 0) {
		item.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.0000',
			vMax: "99999999999999999999999999999999999999999.9999",
			mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
			wEmpty: '',
			mRound: 'B'
		});
	}
});

$("input[name='registerProtocol']").on('change', function(){
	applicTableHandling(); // отображение скрытие полей
	Izmenenie(); // логика при "Несостоявшаяся закупка"
	GetDeliveryPlace(); // тут проставляем место поставки с извещения, если не выбрано
})

var editreg = function () {
	$("li:has(:contains('Скрытые поля'))").hide();
	$("div[data-field-name='Дата подписания протокола']").parent().attr("class","col-xs-3 column-container");
	$("div[data-related-field='zak_nesost']").closest(".column-container").attr("class","col-xs-5 column-container");
	
}

var DocumentViewLogick = function () {
	var EETPID = $(".documentView-field-value[data-name='ИД ЭТП']").attr("title");
	var ProcolCode = $(".documentView-field-value[data-name='Код протокола']").attr("title");
	var CreateIsProcedure = $(".documentView-field-value[data-name='Создана из процедуры']").attr("title");
	var ArrHide = ['Попозиционная закупка', 'Создана из процедуры', 'Код протокола', 'Коэффициент снижения', 'ИД ЭТП'];
	ViewfiledHide(ArrHide);
	// Если НЕ СберАСТ
	if (EETPID != 2) {
		if (EETPID != 1) {
			ViewfiledHide(['Дата этапа процедуры']);
		}
		ViewfiledHide(['Направить в ЕИС', 'Место проведения этапа', 'Тип протокола', 'Комментарий к описанию события', 'Завершить проведение процедуры и публикацию протоколов']); // скрыть поля
		$($("div.documentView-field-value[data-name='Дополнительная информация']")[0]).closest(".column-container").hide(); // кастомно скрываю
		LegendAndNextEmptyRowHide(['Информация о комиссии']); // скрываю вкладку
	} else {
		//Протокол в свободной форме
		if (ProcolCode == 'ancorFreeProtocol') {
			LegendAndNextEmptyRowHide(['Информация о комиссии']); // скрываю вкладку
		}
		else {
			ViewfiledHide(['Тип протокола', 'Комментарий к описанию события']); // скрыть поля
		}
		
		//Протокол рассмотрения 2-х частей заявок
		if (ProcolCode == 'ancorProtocolRZ2') {
			LegendAndNextEmptyRowHide(['Информация о комиссии']); // скрываю вкладку
		}
		//Протокол квалификации
		if (ProcolCode == 'ancorProtocolQualification') {
			LegendAndNextEmptyRowHide(['Информация о комиссии']); // скрываю вкладку
			ViewfiledHide(['Несостоявшаяся закупка']); // скрыть поля
		}
	}
}

// Краткое содержание, редактирование
var summary = function () {
                /* var ktatkoe = $("input[name='ktatkoe']");
                var name = $("input[name='registerProtocolName']");
                var sposobZak = $("input[name='registerSpZakupName']");
                var resultString = function () {

                               var result = "Способ закупки: " + sposobZak.val().trim() + " Наименование протокола: " + name.val().trim();

                               return result;
                };
                ktatkoe.val(resultString());

                name.change(function () {
                               ktatkoe.val(resultString());
                });
                sposobZak.change(function () {
                               ktatkoe.val(resultString());
                }); */
};

//фильтрация Протоколов
//нужно для фильтрации протокола по способу закупки и по организации
/* var FilterSposob = function () {
                var CodeEIS = $("input[name='orgzakuoEISCode']"); //считываем Код_в_ЕИС организатора закупки
                var CodeSprav = $("input[name='OrgZakKodSprav']"); //получаем поле, куда записать Код_в_ЕИС
				var formacode = $("input[name='formacode']").val();
				var ID_ETP = $("input[name='ID_ETP']").val();
                addParentIdToDic(CodeEIS, CodeSprav);

                function addParentIdToDic(sourceDictionaryField, targetDictionaryField) {
                               var sourceValue = sourceDictionaryField.val();
                               var dictionaryName = "Организации заказчики223";

                                var button = $("#Namekomissii");
								if((formacode !='6' && ID_ETP == '999') || ID_ETP != '999') {
									button.prop("disabled", true);
							    }
							   
                               getDictionaryItemIdByName(dictionaryName, sourceValue,
                                               function (data) {
                                                               var kodElement = $("[name='OrgZakKodSprav']");
                                                               kodElement.attr("data-parent-name","OrgZakKodSpravparent");
                                                               kodElement.val(data.data);
                                                               kodElement.change();
                                                               //button.prop("disabled", false);
                                               },
                                               function (data) {
                                                               console.log(data);
                                                               //button.prop("disabled", false);
                                               });
                }
}; */

var Izmenenie = function () {
	var flag = $("input[data-field-name='zak_nesost']");
	var naimETP = $("input[name='naimETP']").val();
	var Prich_nesost = $("input[name='Prich_nesost']").val();
	var registerProtocol = $("input[name='registerProtocol']").val();
	if ($(flag).is(":checked")) {
		filedShowAndRequired(['Prich_nesost', 'Date_nesost']);  // отобразить поля и сделать обязательными 
		DogovorZakluch();
		
		if (naimETP == 'АО "Сбербанк - АСТ"') {	
		
			if (['ancorReviewProtocol', 'ancorProtocolRZ1', 'ancorProtocolRZ2', 'ancorOpenEnvelopeProtocol'].indexOf(registerProtocol) > -1) {
				// ancorReviewProtocol - Протокол рассмотрения заявок
				// ancorProtocolRZ1 - Протокол рассмотрения 1-х частей заявок
				// ancorProtocolRZ2 - Протокол рассмотрения 2-х частей заявок
				filedShowAndRequired(['MissedPurchaseStopCode']);  // отобразить поля и сделать обязательными 
			} 
			else {
				filedClearAndHide(['MissedPurchaseStopCode']); // скрываем и чистим
			}
		}
		else {
			filedClearAndHide(['MissedPurchaseStopCode']); // скрываем и чистим
		}
		
	}
	else {
	   filedHideAndNotRequired(['Prich_nesost', 'Date_nesost', 'contractagree', 'MissedPurchaseStopCode']); // скрыть поля и сделать необязательными  
	    $("input[data-field-name='contractagree']").prop('checked', false);
	}
}

$(document).on('change', "input[data-field-name='zak_nesost']", function (e) {
	Izmenenie();
	Desicion();
	var flag = $("input[data-field-name='zak_nesost']");
	let naimETP = $("input[name='naimETP']").val();
	let registerProtocol = $("input[name='registerProtocol']").val();
	let ProtocolCode = ['4270','4504','4249','4369'];
	
	if ( ($(flag).is(":checked")) && (naimETP == 'АО "МСП-ЕЭТП"') && (!ProtocolCode.some(function(elem){return elem == registerProtocol}))) {
		$("div[data-related-field='go_archive']").closest(".column-container").show();
	}
	else{
		$("input[data-field-name='go_archive']").prop("checked", false);
		$("div[data-related-field='go_archive']").closest(".column-container").hide();
	}
	
	if ( ($(flag).is(":checked")) && (naimETP == 'АО "МСП-ЕЭТП"') && (registerProtocol == "4150" || registerProtocol == "4149" || registerProtocol == "4523")) {
		$("div[data-related-field='one_zay']").closest(".column-container").show();
	}
	else{
		$("input[data-field-name='one_zay']").prop("checked", false);
		$("div[data-related-field='one_zay']").closest(".column-container").hide();
	}
});

function one_zay(){//скрывает чекбокс "продолжить рассмотрение единственной заявки". нужен для протокола мсп
	var flag = $("input[data-field-name='zak_nesost']");
	var one_zay = $("input[name='one_zay']");
	var naimETP = $("input[name='naimETP']").val();
	var registerProtocol = $("input[name='registerProtocol']").val();
	var Prich_nesost = $("input[name='Prich_nesost']").val();
	if ( ($(flag).is(":checked")) && (naimETP == 'АО "МСП-ЕЭТП"') && Prich_nesost=="ONE_APPLICATION" && (registerProtocol == "4150" || registerProtocol == "4149" || registerProtocol == "4523")) {
		$("div[data-related-field='one_zay']").closest(".column-container").show();
	}
	else{
		$("input[data-field-name='one_zay']").prop("checked", false);
		$("div[data-related-field='one_zay']").closest(".column-container").hide();
	}
	if ($(one_zay).is(":checked")){
		$("input[data-field-name='go_archive']").prop("checked", false);
		$("input[name='go_archive']").readonly()
	}
	else {
		$("input[name='go_archive']").readonly(false)
	}
}

$(document).on('change', "input[name='one_zay']", function (e) {
	one_zay();
});

$(document).on('change', "textarea[data-field-name='Prich_nesost']", function (e) {
	one_zay();
});

function one_zayView(){
	let zak_nesost = $(".documentView-field-value[data-name='Несостоявшаяся закупка']").attr("title");
	let EETPName = $(".documentView-field-value[data-name='Наименование ЭТП']");
	let prich = $(".documentView-field-value[data-name='Причина признания несостоявшейся']");
	let nameProt = $(".documentView-field-value[data-name='Наименование протокола']");
	if (zak_nesost=="1" && EETPName.text() == 'АО &quot;МСП-ЕЭТП&quot;' && prich.text() == 'На участие в закупке была подана только одна заявка' && nameProt.text() == 'протокол рассмотрения первых частей заявок') {
		$("div[data-name='Продолжить рассмотрение единственной заявки']").closest(".column-container").show();
	}
	else{
		$("div[data-name='Продолжить рассмотрение единственной заявки']").closest(".column-container").hide();
	}
}

function go_archive(){//скрывает чекбокс "отправить лот в архив". нужен для протокола мсп
	let flag = $("input[data-field-name='zak_nesost']");
	let naimETP = $("input[name='naimETP']").val();
	let registerProtocol = $("input[name='registerProtocol']").val();
	let ProtocolCode = ['4270','4504','4249','4369'];
	/* if ( ($(flag).is(":checked")) && (naimETP == 'АО "МСП-ЕЭТП"') && (!ProtocolCode.includes(registerProtocol))) { */
	if ( ($(flag).is(":checked")) && (naimETP == 'АО "МСП-ЕЭТП"') && (!ProtocolCode.some(function(elem){return elem == registerProtocol}))) {
		$("div[data-related-field='go_archive']").closest(".column-container").show();
	}
	else{
		$("input[data-field-name='go_archive']").prop("checked", false);
		$("div[data-related-field='go_archive']").closest(".column-container").hide();
	}
}

function go_archiveView(){//скрывает чекбокс "отправить лот в архив". нужен для протокола мсп
	let zak_nesost = $(".documentView-field-value[data-name='Несостоявшаяся закупка']").attr("title");
	let EETPName = $(".documentView-field-value[data-name='Наименование ЭТП']");
	let nameProt = $(".documentView-field-value[data-name='Наименование протокола']");
	if (zak_nesost=="1" && EETPName.text() == 'АО &quot;МСП-ЕЭТП&quot;' && nameProt.text()!='протокол подведения итогов') {
		$("div[data-name='Отправить лот в архив']").closest(".column-container").show();
	}
	else{
		$("div[data-name='Отправить лот в архив']").closest(".column-container").hide();
	}
}

var IzmenemieView = function () {
    var flag = $("div[data-name='Несостоявшаяся закупка']").find("input[type='checkbox']");

    var CodeProtocol = $(".documentView-field-value[data-name='Код протокола']").text();
	var EETPName = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var ProtocolName = $(".documentView-field-value[data-name='Наименование протокола']").text();
    var dogovor = $("div[data-name='Договор заключается']");

        if (!$(flag).is(":checked")) {
            ViewfiledHide(['Дата признания несостоявшейся', 'Причина признания несостоявшейся', 'Договор заключается', 'Завершить проведение процедуры и публикацию протоколов']); // скрыть поля
        } else {
			
			if (!(CodeProtocol == '2' && (EETPName == "АО &quot;ЕЭТП&quot;" || EETPName == "АО &quot;РТ-ЕЭТП&quot;"))) {
				ViewfiledHide(['Договор заключается']); // скрыть поля
			} 
			if ((EETPName == "АО &quot;Сбербанк - АСТ&quot;") && ['Протокол рассмотрения заявок', 'Протокол рассмотрения 1-х частей заявок', 'Протокол рассмотрения 2-х частей заявок', 'Протокол открытия доступа к заявкам'].indexOf(ProtocolName) == -1) {
				ViewfiledHide(['Завершить проведение процедуры и публикацию протоколов']); // скрыть поля
			}
		}
		
		

}

var VnesIzm = function () {
    var amendment = $("input[name='amendment']");
    if (amendment.val() == '1') {
        $("li:has(:contains('Изменения'))").show();
        $("textarea[name='obosnov']").prop("required", true);
        $("textarea[name='obosnov']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=obosnov]").addClass("label-required");
    } else {
        $("li:has(:contains('Изменения'))").hide();
        $("textarea[name='obosnov']").prop("required", false);
        $("textarea[name='obosnov']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=obosnov]").removeClass("label-required");
    }
}

var VnesIzmView = function () {
    var amendment = $(".documentView-field-value[data-name='Обоснование внесения изменений']");
    if (amendment.attr('title')) {
          $("li:has(:contains('Изменения'))").show();
    } else {
        $("li:has(:contains('Изменения'))").hide();
    }
}

var Soglas = function () {
                //объявляю переменные
                var trebSogl = $("input[name='trebSogl']");
                var Sogl = $("input[name='Sogl']");
                //по умолчанию скрываю поле "Согласующий"
                Sogl.closest(".column-container").hide();
                $("[data-related-field-name=Sogl]").hide();
                trebSogl.change(function () {
                               if ($(trebSogl).is(":checked")) {
                                               Sogl.closest(".column-container").show();
                                               $("[data-related-field=Sogl").closest(".column-container").show();
                                               Sogl.prop("required", true);
                                               Sogl.closest(".column-container").find(".documentView-field-label").addClass("label-required");
                                               $("[data-related-field=Sogl]").addClass("label-required");

                               } else {
                                               Sogl.val("");
                                               Sogl.prop("required", false);
                                               Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
                                               $("[data-related-field=Sogl]").removeClass("label-required");

                                               Sogl.closest(".column-container").hide();
                                               $("[data-related-field=Sogl").closest(".column-container").hide();
                                               Sogl.closest(".clearfix").removeClass("label-required");
                                               Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
                                               $("[data-related-field=Sogl]").removeClass("label-required");

                                }
                });
                trebSogl.change();
};
//Требуется согласование , просмотр
var SoglasovView = function () {
	var Soglasov = $("div[data-name='Согласующий']");
	var flag = $("div[data-name='Требуется согласование']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		Soglasov.show();
		/* $("div[data-name='Требуется согласование']").hide(); */

	} else {
				   Soglasov.hide();

	}
};

var FormTorg = function () {
	var forma = $("input[name='forma']").val();
	var sposob = $("input[name='registerSpZakup']").val();
	if (forma != "") {
	   $("input[data-field-name='ProtocolEIS']").closest(".column-container").hide();
	   $("input[data-field-name='ProtocolEIS']").prop("required", false);
	   $("input[name='ProtocolEIS']").prop("required", false);
	   $("div[data-related-field='ProtocolEIS']").closest(".column-container").hide();
	   $("textarea[data-field-name='mesto_etap']").closest(".column-container").hide();
	   $("div[data-related-field='mesto_etap']").closest(".column-container").hide();
	   $("input[data-field-name='zayvEIS']").closest(".row").hide();
	   $("input[data-field-name='cenaEIS']").closest(".row").hide();
	   $("input[data-field-name='date_etap']").closest(".column-container").hide();
	   $("div[data-related-field='date_etap']").closest(".column-container").hide(); 
	} else {
	   if (sposob=="169" || sposob =="3363") {
		   $("input[data-field-name='ProtocolEIS']").closest(".column-container").hide();
		   $("input[data-field-name='ProtocolEIS']").prop("required", false);
		   $("input[name='ProtocolEIS']").prop("required", false);
		   $("div[data-related-field='ProtocolEIS']").closest(".column-container").hide();
		   $("textarea[data-field-name='mesto_etap']").closest(".column-container").hide();
		   $("div[data-related-field='mesto_etap']").closest(".column-container").hide();
		   $("input[data-field-name='date_etap']").closest(".column-container").hide();
		   $("div[data-related-field='date_etap']").closest(".column-container").hide();
	   }
	   $("input[data-field-name='zayvEIS']").closest(".row").hide();
	   $("input[data-field-name='cenaEIS']").closest(".row").hide();
	   //$("div[data-field-name='Наименование протокола']").parent().attr("class", "col-xs-0 column-container");
	   $("div[data-field-name='Тип_протокола_код']").parent().attr("class", "col-xs-12 column-container");
	}
 }

function FormTorgView() {
	var forma = $(".documentView-field-value[data-name='Форма_торгов']").text();
	var sposob = $(".documentView-field-value[data-name='Способ_закупки_код']").text();

	$("div[data-name='Способ_закупки_код']").closest(".column-container").hide();
	$("div[data-name='Адрес_ЭТП']").closest(".column-container").hide();
	if (forma != " ") {
	   $("div[data-name='Основание для решения']").closest(".column-container").show();
	   $("li:has(:contains('Информация о комиссии'))").show();
	   $("div[data-name='Наименование протокола']").closest(".column-container").show();
	   $($("div.documentView-field-value[data-name='Дополнительная информация']")[1]).closest(".column-container").hide();
	} else {
	   if (sposob=="169" || sposob=="3363") {
		   $("div[data-name='Тип протокола по классификатору ЕИС']").closest(".column-container").hide();
		   $("div[data-name='Дата и время проведения этапа процедуры']").closest(".column-container").hide();
		   $("div[data-name='Место проведения этапа процедуры']").closest(".column-container").hide();
	   }
	   $("div[data-name='Основание для решения']").closest(".column-container").hide();
	   $("li:has(:contains('Информация о комиссии'))").hide();
	   $("div[data-name='Наименование протокола']").closest(".column-container").hide();
	   $("div[data-name='Не отправлять данные о заявителях в ЕИС']").closest(".column-container").hide();
	   $("div[data-name='Не отправлять ценовые предложения заявителей в ЕИС']").closest(".column-container").hide();
	}
}

$("div[data-name='Uch_Kom']").on('onTableRowRemoved', function (rowKey) {
	var colComission = $("input[name='colComission']");
	colComission.val($("div[data-name='Uch_Kom']").find("[data-rowkey]").length)
});

$("div[data-name='Uch_Kom'] .table-add-row-button").click(function () {
	var colComission = $("input[name='colComission']");
	colComission.val($("div[data-name='Uch_Kom']").find("[data-rowkey]").length)
});

var ETP = function () {
	var naimETP = $("input[name='naimETP']");
	var registerProtocol = $("input[name='registerProtocol']");
	var DopInfo = $("textarea[name='DopInfo']");
	var registerProtocolName = $("input[name='registerProtocolName']");
	var utverPerson = $("input[name='utverPerson']");
	var Sogl = $("data-field-name[name='trebSogl']");

	if (naimETP.val() == "") {
	   registerProtocol.closest(".column-container").hide();
	   registerProtocol.prop("required", false);
	   registerProtocolName.prop("required", false);
	   registerProtocol.closest(".column-container").find(".dict-display-field").prop("required", false);
	   $("[data-related-field='registerProtocol']").removeClass("label-required");
	   $("[data-related-field='registerProtocol']").closest(".column-container").hide();
	   DopInfo.closest(".column-container").show();
	   $("[data-related-field='DopInfo']").closest(".column-container").show();
	} else {
	   utverPerson.prop("required", false);                   
	   utverPerson.closest(".column-container").hide();
	   $("[data-related-field='utverPerson']").removeClass("label-required");
	   $("[data-related-field='utverPerson']").closest(".column-container").hide();
	   $("input[name='trebSogl']").closest(".column-container").hide();
	   $("[data-related-field='trebSogl']").closest(".column-container").hide();
	   Sogl.prop('checked', false);
	   DopInfo.closest(".column-container").hide();
	   $("[data-related-field='DopInfo']").closest(".column-container").hide();
	}              
};

var ProtocolButton = function () {
	var button = $("#registerProtocol");
	var registerProtocol = $("input[name='registerProtocol']");
	var registerProtocolName = $("input[name='registerProtocolName']");             
	var ProtocolArray = ['1', '2']; // Код протокола
	var naimETP = $("input[name='naimETP']").val();
	switch(naimETP) {        
	   case "АО \"ЕЭТП\"":                      
	   if ($.inArray(registerProtocol.val(), ProtocolArray) !== -1) {
					   //button.prop("disabled", true);                                                                                                                                                                          
	   }
	   break;
	   case "ЗАО \"Сбербанк-АСТ\"":                               
	   break;
	   case "ОАО \"Россети\"":                            
	   break;
	   case "ОАО \"Холдинг МРСК\"":                             
	   break;
	   case "ОАО «ЕЭТП»":                     
	   break;
	   case "Система электронных торгов B2B-Center":                        
	   break;   
	   case "ЭТП \"ТЗС Электра\"":                    
	   break;                  
	   default:                               
				   
	};

};

function applicTableHandling(){
	var applicTab = $("div[data-name='applicTab']");
	var applicTabPKO = $("div[data-name='applicTabPKO']");
	var LotsTab = $("div[data-name='LotsTab']");
	var naimETP = $("input[name='naimETP']").val();
	applicTab.find(".table-remove-row-button").closest(".table-edit-column").hide();
	applicTab.find(".table-add-row-button").closest(".table-edit-column").hide();
	applicTabPKO.find(".table-remove-row-button").closest(".table-edit-column").hide();
	applicTabPKO.find(".table-add-row-button").closest(".table-edit-column").hide();
	applicTabPKO.find(".table-add-row-button").closest(".table-edit-column").hide();
	LotsTab.find("[class*='table-row-actions-']").hide(); // скрыть кнопки действий у таблицы лотов
	$("input[data-field-name*='applicTab-qualCode-']").closest(".table-edit-column").hide();
	$("div[title='Результат допуска квалификационного отбора']").hide();
	/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").hide();
	$("div[title='Причина отказа в допуске']").hide(); */
	$("input[data-field-name*='applicTabPKO-declineReasonCode-']").closest(".table-edit-column").hide();
	
	var registerProtocol = $("input[name='registerProtocol']").val();
	var ID_ETP = $("input[name='ID_ETP']").val();
	var formacode = $("input[name='formacode']").val();
	var koefSniz = $("input[data-field-name='koefSniz']");
	var ArrHideColumn = []; // массив колонок для скрытия
	var ArrSberAstField = ['ProcedureDate', 'SendOOS', 'ProcedurePlace', 'AdditionalInfo']; // поля нужные для Сбербанк АСТ
	
	// Коэффициент снижения цен без НДС
	$("input[data-field-name*='applicTab-koefSnizNoNDS']").closest(".table-edit-column").hide();
	$("div[title='Коэффициент снижения цен без НДС']").hide();
	$("input[data-field-name*='applicTab-date_offer']").closest(".table-edit-column").hide();
	$("div[title='Дата подачи ЦП']").hide();
	
	// Сбербанк АСТ
	LegendAndPrevEmptyRowHide(['Общие параметры этапов/стадий по лоту', 'Параметры торгового этапа/стадии переторжки', 'Параметры неторговых этапов/стадий запроса информации'])// по дефолту скрваю блоки
	LegendAndNextEmptyRowHide(['Информация о комиссии'])// по дефолту скрваю блоки
	filedHideAndNotRequired(ArrSberAstField) // по дефолту скрываю поля
	filedHideAndNotRequired(['FreeProtocolType', 'TextForComment']) // по дефолту скрываю кастомные поля поля
	TableHide(['LotsTab']); // по дефолту скрыть таблицу
	
	if (ID_ETP == 999) {
		$("div[title='Причина отказа в допуске']").hide();
	}
	//подведение итогов ПКО
	if (naimETP != 'АО "Сбербанк - АСТ"') {
		if(registerProtocol === '6'){
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Место заявки']").hide();
			$("input[data-field-name*='applicTab-allowedCode-']").prop('required', true);
			$("input[data-field-name*='applicTab-reason-']").prop('required', true);                               
			$("[data-related-field='DesCode']").closest(".column-container").hide();                     
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false); 
		}
		else if( (registerProtocol == '1') && (formacode == '60') ){//рассмотрение заявок ПКО
			applicTab.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', true);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', true);
			$("input[data-field-name*='applicTabPKO-place-']").parent().hide();
			$("div[title='Место заявки']").hide();				   
			$("[data-related-field='DesCode']").closest(".column-container").hide();                     
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
		}
		else if (registerProtocol === '1' ) { 
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Место заявки']").hide();
			$("input[data-field-name*='applicTab-allowedCode-']").prop('required', true);
			$("input[data-field-name*='applicTab-reason-']").prop('required', true);                               
			$("[data-related-field='DesCode']").closest(".column-container").hide();                     
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '49') { 
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Место заявки']").hide();
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("div[title='Основание для решения']").hide();
			$("button[id='allowedCode']").prop('disabled', true); 
			$("[data-related-field='DesCode']").closest(".column-container").hide();                  
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			/* if (ID_ETP == 113) {
					$("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
					$("div[title='Причина отказа в допуске']").show();
					$("button[id='declineReasonCode']").prop('disabled', true);
			} */
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '2') { 
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("input[data-field-name*='applicTab-allowedCode-']").prop('required', true);
			$("input[data-field-name*='applicTab-reason-']").prop('required', true);
			$("input[data-field-name*='applicTab-place-']").prop('required', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();                  
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").show();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			if ($("input[data-field-name*='applicTab-percentageReduction-1']").val()){
				$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").show();	
				$("div[title='% снижения от НМЦ']").show();
				$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();	
				$("div[title='Ставка НДС']").hide();
			}
			else{
				$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
				$("div[title='% снижения от НМЦ']").hide();
				$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").show();	
				$("div[title='Ставка НДС']").show();
			}
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			/* $("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide(); */
			/* $("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide(); */
			/* if (ID_ETP == 113) {
					$("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
					$("div[title='Причина отказа в допуске']").show();
					$("button[id='declineReasonCode']").prop('disabled', true);
			} */
				//Если Коэффициент снижения = 1
				if (koefSniz.is(':checked')) {
					$("div[title='Цена с НДС']").hide();
					$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
					$("div[title='Цена без НДС']").hide();
					$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
					$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
					$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
					$("input[data-field-name*='applicTab-koefSnizNoNDS']").closest(".table-edit-column").show();
					$("div[title='Коэффициент снижения цен без НДС']").show();
					$("input[data-field-name*='applicTab-date_offer']").closest(".table-edit-column").show();
					$("div[title='Дата подачи ЦП']").show();
				}
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '5') { 
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("[data-related-field='DesCode']").closest(".column-container").hide();                  
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").show();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Место заявки']").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '7') { 
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("[data-related-field='DesCode']").closest(".column-container").hide();                  
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").show();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Место заявки']").hide();
			/* if (ID_ETP == 113) {
				$("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
				$("div[title='Причина отказа в допуске']").show();
				$("button[id='declineReasonCode']").prop('disabled', true);
			} */
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '4523') {// конкурс рассмотрения первых частей
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Место заявки']").hide();
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			/* $("input[data-field-name*='applicTab-applicName-']").closest(".table-edit-column").hide(); */
			/* $("div.table-edit-column[title='Наименование']").hide(); */
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false); 
			$("input[data-field-name*='applicTab-firstPartsCode-']").prop('required', true);
			/* Причина отказа в допуске */
			/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
			$("div[title='Причина отказа в допуске']").show();
			$("button[id='declineReasonCode']").prop('disabled', true); */
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
		}
		else if (registerProtocol === '4150') {// протокол рассмотрения первых частей заявок МСП запрос предложений
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Место заявки']").hide();
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			/* $("input[data-field-name*='applicTab-applicName-']").closest(".table-edit-column").hide();
			$("div.table-edit-column[title='Наименование']").hide(); */
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false); 
			$("input[data-field-name*='applicTab-firstPartsCode-']").prop('required', true);
			
			/* Причина отказа в допуске */
			/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
			$("div[title='Причина отказа в допуске']").show();
			$("button[id='declineReasonCode']").prop('disabled', true); */
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
		}
		else if (registerProtocol === '4111') {// конкурс рассмотрения вторых частей
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Место заявки']").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("button[id='firstPartsCode']").prop('disabled', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			// $("input[name='contractagree']").closest(".column-container").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").prop('required', true);
			/* $("input[data-field-name*='applicTab-reason-']").prop('required', true);  */
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			/* $("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide(); */
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			/* $("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide(); */
			$("div[title='% снижения от НМЦ']").hide();
			/* $("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide(); */
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
			
			/* Причина отказа в допуске */
			/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
			$("div[title='Причина отказа в допуске']").show();
			$("button[id='declineReasonCode']").prop('disabled', true); */
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
		}
		else if (registerProtocol === '4171') {// протокол рассмотрения вторых частей заявок МСП запрос предложений
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Место заявки']").hide();
			$("button[id='firstPartsCode']").prop('disabled', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-secondPartsCode-']").prop('required', true);
			/* $("input[data-field-name*='applicTab-reason-']").prop('required', true);  */
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			/* $("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide(); */
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			/* $("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide(); */
			$("div[title='% снижения от НМЦ']").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			/* $("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide(); */
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
			
			/* Причина отказа в допуске */
			/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
			$("div[title='Причина отказа в допуске']").show();
			$("button[id='declineReasonCode']").prop('disabled', true); */
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
		}
		else if (registerProtocol === '4666') {// Протокол квалификационного отбора
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-qualCode-']").closest(".table-edit-column").show();
			$("div[title='Результат допуска квалификационного отбора']").show();
			$("div[title='Результат допуска']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Место заявки']").hide();
			$("button[id='firstPartsCode']").prop('disabled', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '4270') {// протокол подведения итогов МСП запрос предложений 
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("button[id='firstPartsCode']").prop('disabled', true);
			$("button[id='secondPartsCode']").prop('disabled', true);
			$("input[data-field-name*='applicTab-place-']").prop('required', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").show();
			$("div[title='ЦП без НДС']").show();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Основание для решения']").hide();
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").show();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").show();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '4504') {// конкурс подведения итогов
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("button[id='firstPartsCode']").prop('disabled', true);
			$("button[id='secondPartsCode']").prop('disabled', true);
			$("input[data-field-name*='applicTab-place-']").prop('required', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").show();
			$("div[title='ЦП без НДС']").show();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[title='Основание для решения']").hide();
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
		}
		else if (registerProtocol === '4209') {// протокол рассмотрения заявок МСП запрос котировок
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("div[title='Место заявки']").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);  
			
			/* Причина отказа в допуске */
			/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
			$("div[title='Причина отказа в допуске']").show();
			$("button[id='declineReasonCode']").prop('disabled', true); */
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
		}
		else if (registerProtocol === '4249') {// протокол подведения итогов МСП запрос котировок
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			$("button[id='secondPartsCode']").prop('disabled', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();	
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").show();
			$("div[title='ЦП без НДС']").show();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").show();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").show();
			$("div[title='Основание для решения']").hide();
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").prop('required', true);
			$("div[title='Результат допуска вторых частей']").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);	
		}
		else if (registerProtocol === '4149') {// протокол рассмотрения первых частей заявок МСП аукцион
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			/* $("input[data-field-name*='applicTab-reason-']").prop('required', true); */
			$("div[title='Результат допуска']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Место заявки']").hide();
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide();
			$("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			/* $("input[data-field-name*='applicTab-applicName-']").closest(".table-edit-column").hide();
			$("div.table-edit-column[title='Наименование']").hide(); */
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false); 
			$("input[data-field-name*='applicTab-firstPartsCode-']").prop('required', true);
			
			/* Причина отказа в допуске */
			/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
			$("div[title='Причина отказа в допуске']").show();
			$("button[id='declineReasonCode']").prop('disabled', true); */
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
		}
		else if (registerProtocol === '4170') {// протокол рассмотрения вторых частей заявок МСП аукцион
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-place-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("div[title='Место заявки']").hide();
			$("button[id='firstPartsCode']").prop('disabled', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-secondPartsCode-']").prop('required', true);
			/* $("input[data-field-name*='applicTab-reason-']").prop('required', true);  */
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
		/* 	$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").hide(); */
			/* $("div[title='ЦП вне шага с НДС']").hide();
			$("div[title='ЦП вне шага без НДС']").hide();
			$("div[title='ЦП с НДС']").hide();
			$("div[title='ЦП без НДС']").hide();
			$("div[title='% снижения от НМЦ']").hide(); */
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").hide();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").hide();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();
			
			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false); 
			
			/* Причина отказа в допуске */
			/* $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
			$("div[title='Причина отказа в допуске']").show();
			$("button[id='declineReasonCode']").prop('disabled', true); */
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").prop('required', false);
			$("div[title='Основание для решения']").hide();
		}
		else if (registerProtocol === '4369') {// протокол подведения итогов МСП аукцион
			filedShowAndRequired(['ProcedureDate']);
			$("input[data-field-name*='applicTab-allowedCode-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска']").hide();
			$("button[id='firstPartsCode']").prop('disabled', true);
			$("button[id='secondPartsCode']").prop('disabled', true);
			$("input[data-field-name*='applicTab-place-']").prop('required', true);
			$("[data-related-field='DesCode']").closest(".column-container").hide();
			$("input[data-field-name='DesCode']").closest(".column-container").hide();
			/* $("input[name='contractagree']").closest(".column-container").hide(); */
			$("input[data-field-name*='applicTab-firstPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-secondPartsCode-']").closest(".table-edit-column").hide();
			$("input[data-field-name*='applicTab-reason-']").closest(".table-edit-column").hide();
			$("div[title='Результат допуска первых частей']").hide();
			$("div[title='Результат допуска вторых частей']").hide();
			$("div[title='Основание для решения']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-offerOutOfStepWithVAT-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-offerOutOfStepWithoutVAT-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-cpNds-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-priceWithoutVAT-']").closest(".table-edit-column").show();
			$("input[data-field-name*='applicTab-percentageReduction-']").closest(".table-edit-column").show();
			$("div[title='ЦП вне шага с НДС']").show();
			$("div[title='ЦП вне шага без НДС']").show();
			$("div[title='ЦП с НДС']").show();
			$("div[title='ЦП без НДС']").show();
			$("div[title='% снижения от НМЦ']").show();
			$("div[data-name='applicTab']").find("div[title='Ставка НДС']").show();
			$("input[data-field-name*='applicTab-nds-']").closest(".table-edit-column").show();
			$("div[title='Цена с НДС']").hide();
			$("input[data-field-name*='applicTab-priceNDS-']").closest(".table-edit-column").hide();
			$("div[title='Цена без НДС']").hide();
			$("input[data-field-name*='applicTab-priceOutNDS-']").closest(".table-edit-column").hide();

			applicTabPKO.hide();
			$("input[data-field-name*='applicTabPKO-allowedCode-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-reason-']").prop('required', false);
			$("input[data-field-name*='applicTabPKO-place-']").prop('required', false);
		}
	}
	else if (naimETP == 'АО "Сбербанк - АСТ"') {
		// Сбербанк-АСТ
		var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
		var SendOOS = $("input[data-field-name='SendOOS']"); // Чекбокс "Направить в ЕИС"
		var MspFormTorg = ['20', '21', '22', '25'];
		// 20 Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 21 Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 22 Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 25 Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		
		TableHide(['applicTab', 'applicTabPKO']); // скрыть таблицу Заявок участников
		
		// Скрыть лишние столбцы
		var SubTable = $("div[data-name*='-LOTSapplicTab']"); // подчиненная таблица заявок участников
		
		if (registerProtocol) {
			TableShow(['LotsTab']); // Отобразить таблицу Лотов
			LegendAndEmptyNextRowShow(['Информация о комиссии']); // отобразить блоки для Сбербанк АСТ
			filedShow(ArrSberAstField); // отобразить поля для Сбербанк АСТ
			filedShowAndRequired(['ProcedurePlace']); // отобразить поля и сделать обязательными для Сбербанк АСТ
			
			
			// Протокол рассмотрения заявок
			if (registerProtocol == 'ancorReviewProtocol') {
				HideAndClearTableColumn(SubTable, ['LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode', 'LOTSplace', 'NeedContractConclusion', 'LOTSRequestPriceInfo']); // скрыть столбцы
				HideTableColumnAndNotRequired(SubTable, ['LOTSCurrency_kod', 'LOTSRequestPrice']); // скрыть столбцы и сделать необязательными
				HideAndClearTableColumn(LotsTab, ['LOTSResultCode', 'LOTSResultName', 'LOTSRequestAssessmentResult']); // скрыть и очистить столбцы
				ShowAndRequiredTableColumn(SubTable, ['LOTSallowedCode']); // отобразить и сделать обязательными
				ShowTableColumn(SubTable, ['LOTSapplicName', 'LOTSpriceNDS', 'LOTSpriceOutNDS']); // отобразить столбцы
				
				filedShowAnd_NotRequired(['ProcedureDate']); // отобразить и сделать не обязателным
				filedClearAndHide(['FreeProtocolType', 'TextForComment']) // список полей для скрытия
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.prop('checked', true);
				SendOOS.readonly(true);
				
				LotsRadioLogick(); // раскрываю подчиненную таблицу
			} 
			else if (registerProtocol == 'BidStageProtocol') {
				
			} 
			// Протокол открытия доступа к заявкам
			else if (registerProtocol == 'ancorOpenEnvelopeProtocol') {
				
				HideAndClearTableColumn(SubTable, ['LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode', 'LOTSplace', 'NeedContractConclusion', 'LOTSallowedCode', 'LOTSreason', 'LOTSRequestPriceInfo']); // скрыть столбцы
				HideAndClearTableColumn(LotsTab, ['LOTSResultCode', 'LOTSResultName', 'LOTSRequestAssessmentResult']); // скрыть и очистить столбцы
				HideTableColumnAndNotRequired(SubTable, ['LOTSpriceNDS', 'LOTSpriceOutNDS', 'LOTSCurrency_kod', 'LOTSRequestPrice']); // скрыть и сделать не обязательными
				ShowTableColumn(SubTable, ['LOTSapplicName']); // отобразить столбцы
				
				filedShowAnd_NotRequired(['ProcedureDate']); // отобразить и сделать не обязателным
				filedClearAndHide(['FreeProtocolType', 'TextForComment']) // список полей для скрытия
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.prop('checked', true);
				SendOOS.readonly(true);
				
				LotsRadioLogick(); // раскрываю подчиненную таблицу
			} 
			// Протокол подведения итогов
			else if (registerProtocol == 'ancorResultProtocol') {
				HideTableColumnAndNotRequired(SubTable, ['LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode', 'LOTSRequestPriceInfo', 'LOTSRequestPrice', 'LOTSCurrency_kod']); // скрыть столбцы
				ShowAndRequiredTableColumn(SubTable, ['LOTSallowedCode', 'LOTSplace', 'NeedContractConclusion']); // отобразить и сделать обязательными
				ShowAndRequiredTableColumn(LotsTab, ['LOTSResultCode']); // отобразить и сделать обязательными
				ShowTableColumn(SubTable, ['LOTSapplicName', 'LOTSpriceNDS', 'LOTSpriceOutNDS', 'LOTSRequestAssessmentResult']); // отобразить столбцы
				
				
				filedClearAndHide(['FreeProtocolType', 'TextForComment']) // список полей для скрытия
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.prop('checked', true);
				SendOOS.readonly(true);
				
				if (['20', '21', '25'].indexOf(formacode) > -1) {
					filedShowAndRequired(['ProcedureDate']); // отобразить поля и сделать обязательными
					HideTableColumnAndNotRequired(SubTable, ['LOTSallowedCode', 'LOTSreason']); // скрыть столбцы
				} 
				else if (['22'].indexOf(formacode) > -1) {
					filedShowAndRequired(['ProcedureDate']); // отобразить поля и сделать обязательными
				}
				else {
					filedShowAnd_NotRequired(['ProcedureDate']); // отобразить и сделать не обязателным
				}
				
				LotsRadioLogick(); // раскрываю подчиненную таблицу
			}
			// Протокол в свободной форме
			else if (registerProtocol == 'ancorFreeProtocol') {
				HideAndClearTableColumn(SubTable, ['LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode', 'LOTSplace', 'NeedContractConclusion', 'LOTSallowedCode', 'LOTSreason', 'LOTSRequestPriceInfo']); // скрыть столбцы
				HideAndClearTableColumn(LotsTab, ['LOTSResultCode', 'LOTSResultName', 'LOTSRequestAssessmentResult']); // скрыть и очистить столбцы
				LegendAndNextEmptyRowHide(['Информация о комиссии'])// скрыть блок
				
				filedShow(['FreeProtocolType', 'TextForComment']); // список полей для скрытия
				filedShowAnd_NotRequired(['ProcedureDate', 'ProcedurePlace']); // отобразить и сделать не обязателным
				
				TableHide(['LotsTab']); // скрыть таблицу
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.readonly(false);
			}
			// Протокол рассмотрения 1-х частей заявок
			else if (registerProtocol == 'ancorProtocolRZ1') {
				HideAndClearTableColumn(SubTable, ['LOTSqualCode', 'LOTSsecondPartsCode', 'LOTSplace', 'NeedContractConclusion', 'LOTSallowedCode', 'LOTSRequestPriceInfo']); // скрыть столбцы
				HideAndClearTableColumn(LotsTab, ['LOTSResultCode', 'LOTSResultName', 'LOTSRequestAssessmentResult']); // скрыть и очистить столбцы
				HideTableColumnAndNotRequired(SubTable, ['LOTSCurrency_kod', 'LOTSRequestPrice']); // скрыть и сделать не обязательными
				HideTableColumnAndNotRequired(SubTable, ['LOTSapplicName', 'LOTSpriceNDS', 'LOTSpriceOutNDS']); // скрыть и сделать не обязательными
				ShowAndRequiredTableColumn(SubTable, ['LOTSfirstPartsCode']); // отобразить и сделать обязательными
				
				filedShowAndRequired(['ProcedureDate']); // отобразить поля и сделать обязательными
				filedClearAndHide(['FreeProtocolType', 'TextForComment']); // список полей для скрытия
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.prop('checked', true);
				SendOOS.readonly(true);
				
				LotsRadioLogick(); // раскрываю подчиненную таблицу
			}
			// Протокол рассмотрения 2-х частей заявок
			else if (registerProtocol == 'ancorProtocolRZ2') {
				HideAndClearTableColumn(SubTable, ['LOTSqualCode', 'LOTSplace', 'NeedContractConclusion', 'LOTSallowedCode', 'LOTSfirstPartsCode', 'LOTSRequestPriceInfo']); // скрыть столбцы
				HideAndClearTableColumn(LotsTab, ['LOTSResultCode', 'LOTSResultName', 'LOTSRequestAssessmentResult']); // скрыть и очистить столбцы
				HideTableColumnAndNotRequired(SubTable, ['LOTSCurrency_kod', 'LOTSRequestPrice']); // скрыть и сделать не обязательными
				ShowAndRequiredTableColumn(SubTable, ['LOTSsecondPartsCode']); // отобразить и сделать обязательными
				ShowTableColumn(SubTable, ['LOTSapplicName', 'LOTSpriceNDS', 'LOTSpriceOutNDS']); // отобразить столбцы
				LegendAndNextEmptyRowHide(['Информация о комиссии'])// скрыть блок
				
				filedShowAndRequired(['ProcedureDate']); // отобразить поля и сделать обязательными
				filedClearAndHide(['FreeProtocolType', 'TextForComment']); // список полей для скрытия
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.prop('checked', true);
				SendOOS.readonly(true);
				
				LotsRadioLogick(); // раскрываю подчиненную таблицу
			}
			// Протокол изменений условий договора
			else if (registerProtocol == 'ancorProtocolContractConditionChange') {
				HideAndClearTableColumn(SubTable, ['LOTSqualCode', 'LOTSplace', 'NeedContractConclusion', 'LOTSallowedCode', 'LOTSfirstPartsCode', 'LOTSsecondPartsCode', 'LOTSreason']); // скрыть столбцы
				HideAndClearTableColumn(LotsTab, ['LOTSResultCode', 'LOTSResultName', 'LOTSRequestAssessmentResult']); // скрыть и очистить столбцы
				ShowTableColumn(SubTable, ['LOTSapplicName', 'LOTSpriceNDS', 'LOTSpriceOutNDS', 'LOTSRequestPriceInfo', 'LOTSCurrency_kod', 'LOTSRequestPrice']); // отобразить столбцы
				
				filedShowAndRequired(['ProcedureDate']); // отобразить поля и сделать обязательными
				filedClearAndHide(['FreeProtocolType', 'TextForComment', 'zak_nesost', 'Date_nesost', 'Prich_nesost', 'MissedPurchaseStopCode']); // список полей для скрытия
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.readonly(false);
				
				// логика заполнения поля "Сведения о предложении о цене"
				IfContractConditionChange(LotsTab);
				
				LotsRadioLogick(); // раскрываю подчиненную таблицу
				
			}
			// Протокол квалификации
			else if (registerProtocol == 'ancorProtocolQualification') {
				HideAndClearTableColumn(SubTable, ['LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode', 'LOTSplace', 'NeedContractConclusion', 'LOTSRequestPriceInfo']); // скрыть столбцы
				HideTableColumnAndNotRequired(SubTable, ['LOTSCurrency_kod', 'LOTSRequestPrice', 'LOTSapplicName']); // скрыть столбцы и сделать необязательными
				HideAndClearTableColumn(LotsTab, ['LOTSResultCode', 'LOTSResultName', 'LOTSRequestAssessmentResult']); // скрыть и очистить столбцы
				ShowAndRequiredTableColumn(SubTable, ['LOTSallowedCode']); // отобразить и сделать обязательными
				ShowTableColumn(SubTable, ['LOTSpriceNDS', 'LOTSpriceOutNDS']); // отобразить столбцы
				
				LegendAndNextEmptyRowHide(['Информация о комиссии'])// скрыть блок
				
				filedHideAndNotRequired(['ProcedureDate', 'zak_nesost']); // отобразить поля и сделать обязательными
				filedClearAndHide(['FreeProtocolType', 'TextForComment']); // список полей для скрытия
				
				// Чекбокс "Направить в ЕИС"
				SendOOS.prop('checked', false);
				SendOOS.readonly(true);
				
				LotsRadioLogick(); // раскрываю подчиненную таблицу
			}							
		} else {
			filedHideAndNotRequired(ArrSberAstField); // скрыть поля для Сбербанк АСТ
		}
		
		if (registerProtocol && GlobalAdditionalStep.length >0) {
			SetAdditionalStepForProtocol(); // ЗАполнение полей при наличие доп этапов на процедуре
		}
	}
}

function GetDeliveryPlace() {
	var registerProtocol = $("input[name='registerProtocol']").val();
	var ProcedurePlace = $("textarea[name='ProcedurePlace']");
	//Если указано наименование протокола и место поставки пусто
	/* if (registerProtocol && !ProcedurePlace.val()) { */
	if (registerProtocol) {
		// ancorOpenEnvelopeProtocol - Протокол открытия доступа к заявкам
		// ancorProtocolRZ1 - Протокол рассмотрения 1-х частей заявок
		// ancorProtocolRZ2 - Протокол рассмотрения 2-х частей заявок
		// ancorReviewProtocol - Протокол рассмотрения заявок
		// ancorResultProtocol - Протокол подведения итогов
		if (['ancorOpenEnvelopeProtocol', 'ancorProtocolRZ1', 'ancorProtocolRZ2', 'ancorReviewProtocol', 'ancorResultProtocol'].indexOf(registerProtocol) > -1) {
			if (GlobalPurchaseDeliveryPlace.length > 0) {
				switch(registerProtocol){
					case 'ancorOpenEnvelopeProtocol':
						ProcedurePlace.val(GlobalPurchaseDeliveryPlace[0]["Место_начала_подачи_заявок"]);
						break;
					case 'ancorProtocolRZ1':
						ProcedurePlace.val(GlobalPurchaseDeliveryPlace[0]["Место_рассмотрения_1х_частей"]);
						break;
					case 'ancorProtocolRZ2': 
						ProcedurePlace.val(GlobalPurchaseDeliveryPlace[0]["Место_рассмотрения_2х_частей"]);
						break;
					case 'ancorReviewProtocol': 
						ProcedurePlace.val(GlobalPurchaseDeliveryPlace[0]["Место_рассмотрения_заявок"]);
						break;
					case 'ancorResultProtocol': 
						ProcedurePlace.val(GlobalPurchaseDeliveryPlace[0]["Место_подведения_итогов"]);
						break;
				}
			}
			
		}
		// ancorProtocolQualification - Протокол квалификации
		else if (['ancorProtocolQualification'].indexOf(registerProtocol) > -1) {
			if (GlobalAdditionalStep.length > 0) {
				for (var i = 0; i<GlobalAdditionalStep.length; i++) {
					if (GlobalAdditionalStep[i]["Код протокола"] == registerProtocol) {
						ProcedurePlace.val(GlobalAdditionalStep[i]["ДопЭтап_Место_проведения"]);
					}
				}
			}
		}
	}
}

// Проставляем ИД доп этапов если таковые существуют
function SetAdditionalStepForProtocol() {
	var purchasestageid = $("input[name='purchasestageid']");
	var purchasestagetypename = $("input[name='purchasestagetypename']");
	var registerProtocol = $("input[name='registerProtocol']").val();
	if (GlobalAdditionalStep.length >0) {
		var object = findProtocol(GlobalAdditionalStep);
		if (object) {
			purchasestageid.val(object["ДопЭтап_ИД_строки_на_ЭТП"]);
			purchasestagetypename.val(object["ДопЭтап_Наименование_этапа"]);
		}
		else {
			purchasestageid.val('');
			purchasestagetypename.val('');
		}
	}
	
	function findProtocol(array) {
		var object;
		
		array.forEach(function(item, i){
			if (item["Код протокола"] == registerProtocol) {
				object = item;
			}
		})
		
		return object;
	}
}

// раскрываю подчиненную таблицу
function LotsRadioLogick() {
	var LotsRadio = $("div[data-name='LotsTab'] [data-rowkey]").find("input[type='radio']");
	LotsRadio.each(function(i, item) {
		var hiddenChBox = $(item).siblings(".nested-tables-visibility").is(":checked");
		if (!$(item).is(":checked")) {
			item.click();
		}
	})
}

// Сбер АСТ Протокол изменений условий договора
function IfContractConditionChange(Table) {
	var LOTSRequestPriceInfo = $(Table).find("input[name*='-LOTSRequestPriceInfo']");

	LOTSRequestPriceInfo.on('change', function(Current){
		var Current = $(Current.currentTarget);
		var CurrentRow = $(Current).closest('[data-rowkey]');
		if (Current.val().trim()) {
			ClearTableColumn(CurrentRow, ['LOTSRequestPrice', 'LOTSCurrency_kod', 'LOTSCurrency']);
		}
		ReadonlyColumns(Current) // вызов функции
	})
	
	ReadonlyColumns(LOTSRequestPriceInfo); // вызов функции
	
	function ReadonlyColumns(Columns) {
		
		if (Columns.length > 0) {
			Columns.each(function(i, item){
				var CurrentRow = $(item).closest('[data-rowkey]');
				if ($(item).val().trim()) {
					CurrentRow.find("input[name*='-LOTSRequestPrice-']").prop('readonly', true);
					CurrentRow.find("button[id='LOTSCurrency_kod']").prop('disabled', true);
				} 
				else {
					CurrentRow.find("input[name*='-LOTSRequestPrice-']").prop('readonly', false);
					CurrentRow.find("button[id='LOTSCurrency_kod']").prop('disabled', false);
				}
			})
		}
	}
}

// вешаем обработчики событий в отличии от площадки
function EventHadlerDependingOnEETP () {
	var ID_ETP = $("input[name='ID_ETP']").val();
	var CreateIsNotice = $("input[name='CreateIsNotice']");
	if (['1', '113', '999'].indexOf(ID_ETP) > -1 || 
		['2'].indexOf(ID_ETP) > -1 && !CreateIsNotice.is(':checked')) {
		
		$(document).on('change', "input[name*='applicTabPKO-place-']", function (e) {
		   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
		   if ($(this).val() == "Не допущен") {
			  $("input[name='applicTabPKO-allowedCode-" + rowkey + "']").val("F")
			  $("input[data-field-name='applicTabPKO-allowedCode-" + rowkey + "']").val("Не допущен")
			  $("input[name='applicTabPKO-allowed-" + rowkey + "']").val("Не допущен")
			  $("input[data-field-name='applicTabPKO-reason-" + rowkey + "']").val('');
		   } else {
			  $("input[name='applicTabPKO-allowedCode-" + rowkey + "']").val("T")
			  $("input[data-field-name='applicTabPKO-allowedCode-" + rowkey + "']").val("Допущен")
			  $("input[name='applicTabPKO-allowed-" + rowkey + "']").val("Допущен")
			  $("input[data-field-name='applicTabPKO-reason-" + rowkey + "']").val("Состав документов заявителя соответствует требованиям документации");
		   }
		})

		$(document).on('change', "input[name*='applicTab-allowedCode-']", function (e) {
		   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
		   var ID_ETP = $("input[name='ID_ETP']").val();
		   if ($(this).val()=="T") {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val("Состав документов заявителя соответствует требованиям документации");
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReason-" + rowkey+ "']").val('');
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', false);
			   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', true);
		   } else if ($(this).val()=="F") {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").prop('required', true);
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', true);
			   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', false);
		   } 
		   else {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val('');
			   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', false);
				if (ID_ETP == 113) {
					$("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', true);
				}
		   }
		   declineReasonHandling();
		   DogovorZakluch()
		   Desicion()
		});
		//событие изменение допуска в протоколе рассмотрения заявок ПКО
		$(document).on('change', "input[name*='applicTabPKO-allowedCode-']", function (e) {
		   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
		   if ($(this).val()=="T") {
			   $("input[data-field-name='applicTabPKO-reason-" + rowkey+ "']").val("Состав документов заявителя соответствует требованиям документации");
			   $("input[data-field-name='applicTabPKO-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTabPKO-declineReason-" + rowkey+ "']").val('');
		   } else {
			   $("input[data-field-name='applicTabPKO-reason-" + rowkey+ "']").val('');
			  
		   }
		});

		$(document).on('change', "input[name*='applicTab-firstPartsCode-']", function (e) {
		   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
		   if ($(this).val()=="T") {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val("Состав документов заявителя соответствует требованиям документации");
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReason-" + rowkey+ "']").val('');
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', false);
			   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', true);
		   } else {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val('');
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', true);
			   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', false);
		   }
		   declineReasonHandling();
		   NotAllowedStep(this); // функция меняет общий доступ на "Не допущен"
		});

		$(document).on('change', "input[name*='applicTab-qualCode-']", function (e) {
		   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
		   if ($(this).val()=="T") {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val("Состав документов заявителя соответствует требованиям документации");
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReason-" + rowkey+ "']").val('');
			   
		   } else {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val('');
		   }
		   declineReasonHandling();
		   NotAllowedStep(this); // функция меняет общий доступ на "Не допущен"
		});

		$(document).on('change', "input[name*='applicTab-secondPartsCode-']", function (e) {
		   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
		   if ($(this).val()=="T") {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val("Состав документов заявителя соответствует требованиям документации");
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReason-" + rowkey+ "']").val('');
			   $("input[name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', false);
			   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', true);
		   } else {
			   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val('');
			   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', true);
			   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', false);
		   }
		   declineReasonHandling();
		   NotAllowedStep(this); // функция меняет общий доступ на "Не допущен"
		});
		
		$(document).on('change', "input[name*='applicTab-place-']", function (e) {
			var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
			var forma = $("input[name='forma']").val();
			var ID_ETP = $("input[name='ID_ETP']").val();
			if (forma == 'Запрос котировок' && ID_ETP == 1) {
			   if ($(this).val()=="Не допущен") {
				   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', true);
				   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', false);
			   } else {
				   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
				   $("input[name='applicTab-declineReason-" + rowkey+ "']").val('');
				   $("input[name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
				   $("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', false);
				   $(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', true); 
			   }
			}  
		   DogovorZakluch();
		   declineReasonHandling();
		})
		
		//для ком и рт площадок на подведении итогов при изменении допуска меняется автоматически место "не допущен" или "место не присвоено"
		$(document).on('change', "input[type='hidden'][name*='applicTab-allowedCode-']", function (e) {
			let ID_ETP = $("input[name='ID_ETP']").val()
			let registerProtocol = $("input[name='registerProtocol']").val()
			
			var poPosZak = $("input[name='poPosZak']"); // признак попозиционной закупки
			if( (ID_ETP==999 || ID_ETP==113) && registerProtocol==2){
				let rowkey = $(this).closest("div.table-edit-row").attr('data-rowkey')
				let value = $(this).val()
				switch(value){
					case 'F': 
						$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").val("Не допущен");
						$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").change();
						break;
					case 'N': 
						$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").val("Место не присвоено");
						$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").change();
						break;
					case 'T': 
						let valPlace = $("input[type='hidden'][name='applicTab-place-"+rowkey+"']").val();
							if(valPlace=="Не допущен" || valPlace==""){
								if (ID_ETP == 113) {
									$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").val("");
									$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").change();
								} else if(ID_ETP == 999) {
									$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").val("");
									$("input[type='hidden'][name='applicTab-place-"+rowkey+"']").change();
								}
							}
					break;
				}
				if (poPosZak.is(':checked')){
					var applicId = $(this).closest("div.table-edit-row").find("input[name*='applicTab-applicId-']").val();			
					ChangeSubTableIfPoposition(applicId, value);
				}
			}
			
		})
		
		//для ком и рт площадок на подведении итогов при изменении места меняется автоматически допуск на "не допущен" или "допущен"
		$(document).on('change', "input[type='hidden'][name*='applicTab-place-']", function (e) {
			let ID_ETP = $("input[name='ID_ETP']").val()
			let registerProtocol = $("input[name='registerProtocol']").val()
			let rowkey = $(this).closest("div.table-edit-row").attr('data-rowkey')
			let value = $(this).val()
			if( (ID_ETP==999) && registerProtocol==2){
				if(value == 'Не допущен'){
					$("input[type='hidden'][name='applicTab-allowedCode-"+rowkey+"']").val("F");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").val("Не допущен");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").change();
				}
				else if (value == 'Место не присвоено'){
					//ничего не происходит
				}
				else{
					$("input[type='hidden'][name='applicTab-allowedCode-"+rowkey+"']").val("T");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").val("Допущен");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").change();
				}
			}
			if( (ID_ETP==113) && registerProtocol==2){
				if(value == 'Не допущен'){
					$("input[type='hidden'][name='applicTab-allowedCode-"+rowkey+"']").val("F");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").val("Не допущен");
					$("div[title='Причина отказа в допуске']").show();
					$("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
					$("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', true);
					$(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', false);
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").change();
				}
				else if (value == 'Место не присвоено'){
					$("input[type='hidden'][name='applicTab-allowedCode-"+rowkey+"']").val("N");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").val("Место не присвоено");
					$("div[title='Причина отказа в допуске']").show();
					$("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', true);
					$("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
					$(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', false);
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").change();
				}
				else{
					$("input[type='hidden'][name='applicTab-allowedCode-"+rowkey+"']").val("T");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").val("Допущен");
					$("input[type='hidden'][name='applicTab-allowed-"+rowkey+"']").change();
					$("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").prop('required', false);
					$("input[data-field-name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
					$(this).closest(".table-edit-row").find("button[id='declineReasonCode']").prop('disabled', true);
				    $("input[name='applicTab-declineReasonCode-" + rowkey+ "']").val('');
				    $("input[name='applicTab-declineReason-" + rowkey+ "']").val('');
				}
			}
			declineReasonHandling();
		})

	}
	// Сбербанк-АСТ и создана из извещения
	else if (['2'].indexOf(ID_ETP) > -1 && CreateIsNotice.is(':checked')) {
		// Логика достпуности выбора в поле "Причина отказа в допуске"

		var ArrAllowedName = ['LOTSallowedCode', 'LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode'];
		ArrAllowedName.forEach(function(item, i) {
			$(document).on('change', "div[data-name='LotsTab'] input[name*='-"+item+"-']", function (e) {
			   var CurrentRow = $(this).closest("[data-rowkey]");
			   if ($(this).val()=="T") {
				   $(CurrentRow).find("input[data-field-name*='-LOTSreason-']").val("Состав документов заявителя соответствует требованиям документации");
				   $(CurrentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").val('');
				   $(CurrentRow).find("input[name*='-LOTSdeclineReasonCode-']").val('');
				   $(CurrentRow).find("input[name*='-LOTSdeclineReason-']").val('');
				   $(CurrentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").prop('required', false);
				   $(CurrentRow).find("button[id='LOTSdeclineReasonCode']").prop('disabled', true);
				   
				   //Место заявки
				   var LOTSplace = $(CurrentRow).find("input[name*='-LOTSplace-']");
				   if (LOTSplace.val() == 'Не допущен') {
					   LOTSplace.val('') 
					   $(CurrentRow).find("input[data-field-name*='-LOTSplace-']").val('');
				   }
				   
			   } else if ($(this).val()=="F"){
				   
				    //Основание для решения
				    $(CurrentRow).find("input[data-field-name*='-LOTSreason-']").val('');
				   
				    //Причина отказа в допуске
				    $(CurrentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").prop('required', true);
				    $(CurrentRow).find("button[id='LOTSdeclineReasonCode']").prop('disabled', false);
				   
				    //Заключить договор
					$(CurrentRow).find("[name*='-NeedContractConclusion-']").val('Нет');
					$(CurrentRow).find("[data-field-name*='-NeedContractConclusion-']").val('Нет');
					
					//Место заявки
				    $(CurrentRow).find("input[data-field-name*='-LOTSplace-']").val('Не допущен');
				    $(CurrentRow).find("input[name*='-LOTSplace-']").val('Не допущен');
				   
			   }
			   
			   declineReasonHandling(); // Отображение поля Причина отказа в допуске
			    if (['LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode'].indexOf(item) > -1) {
				    var allowedCodefield = $(CurrentRow).find("[data-field-name*='-LOTSallowedCode-']");
					var allowedCode = $(CurrentRow).find("[name*='-LOTSallowedCode-']");
					var allowed = $(CurrentRow).find("[name*='-LOTSallowed-']");
				   
				    if ($(this).val() == 'F'){
						allowedCodefield.val('Не допущен');
						allowedCode.val('F');
						allowed.val('Не допущен')
					} else {
						allowedCodefield.val('');
						allowedCode.val('');
						allowed.val('')
					}
			    }	
			});
		})

		// Логика при изменении поля "Место заявки" на повдедении итогов
		$(document).on('change', "div[data-name='LotsTab'] input[name*='-LOTSplace-']", function (e) {
			var CurrentFiled = $(this).val();
			var CurrentRow = $(this).closest("[data-rowkey]");
			if (CurrentFiled == 'Не допущен') {
				//Результат допуска
				$(CurrentRow).find("[data-field-name*='-LOTSallowedCode-']").val('Не допущен');
				$(CurrentRow).find("[name*='-LOTSallowedCode-']").val('F');
				$(CurrentRow).find("[name*='-LOTSallowed-']").val('Не допущен');
				
				//Основание для решения
				$(CurrentRow).find("input[data-field-name*='-LOTSreason-']").val('');
				
				//Причина отказа в допуске
				$(CurrentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").prop('required', true);
				$(CurrentRow).find("button[id='LOTSdeclineReasonCode']").prop('disabled', false);
				
				//Заключить договор
				$(CurrentRow).find("[name*='-NeedContractConclusion-']").val('Нет');
				$(CurrentRow).find("[data-field-name*='-NeedContractConclusion-']").val('Нет');
				
				
			} else if (Number(CurrentFiled) > -1) {
				//Результат допуска
				$(CurrentRow).find("[data-field-name*='-LOTSallowedCode-']").val('Допущен');
				$(CurrentRow).find("[name*='-LOTSallowedCode-']").val('T');
				$(CurrentRow).find("[name*='-LOTSallowed-']").val('Допущен');
				
				//Основание для решения
				$(CurrentRow).find("input[data-field-name*='-LOTSreason-']").val("Состав документов заявителя соответствует требованиям документации");
				
				//Причина отказа в допуске
				$(CurrentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").prop('required', false);
				$(CurrentRow).find("button[id='LOTSdeclineReasonCode']").prop('disabled', true);
				$(CurrentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").val('');
				$(CurrentRow).find("input[name*='-LOTSdeclineReasonCode-']").val('');
				$(CurrentRow).find("input[name*='-LOTSdeclineReason-']").val('');
				
				//Заключить договор
				if (Number(CurrentFiled) == 1) {
					
					//Заключить договор
					$(CurrentRow).find("[name*='-NeedContractConclusion-']").val('Да');
					$(CurrentRow).find("[data-field-name*='-NeedContractConclusion-']").val('Да');
				}
				
			}
			declineReasonHandling(); // Отображение поля Причина отказа в допуске
		})
		

	}
}

var declineReasonHandling = function () {
	 function isDeclined(element, index, array) {
		return	ArrayCode.some(function(item, i){
			 if (item == element.value) {
				 return item;
			 }
		 })
		 /* return ArrayCode.includes(element.value); */
	 }
	 // для запроса котировок на подведении итогов
	  function isMSPPlace(element, index, array) {
		 return element.value == 'Не допущен';
	 }
	 var firstPartsCodes = $("input[name*='applicTab-firstPartsCode-']").toArray();
	 var secondPartsCode = $("input[name*='applicTab-secondPartsCode-']").toArray();
	 var place = $("input[name*='applicTab-place-']").toArray();
	 var allowedCode = $("input[name*='applicTab-allowedCode-']").toArray();
	 var qualCode = $("input[name*='applicTab-qualCode-']").toArray();
	 var ID_ETP = $("input[name='ID_ETP']").val();
	 var ArrayCode = ['F', 'N'];
	 var result = false;
	 var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
	 if (ID_ETP == 1) {
		 if (firstPartsCodes.some(isDeclined) || secondPartsCode.some(isDeclined) || place.some(isMSPPlace)) {
			result = true;
		 }
		  ShowDeclineReason(result);
	 } 
	 else if (ID_ETP == 113) {
		if (allowedCode.some(isDeclined)) {
			result = true;
		}
		ShowDeclineReason(result);
	 } 
	 else if (ID_ETP == 999) {
		ShowDeclineReason(result);
	 } 
	 // Сбербанк-АСТ
	 else if (ID_ETP == 2 && CreateIsNotice.is(':checked')) {
		 
		var LotsTab = $("div[data-name='LotsTab']");
		var LotsTabParentRow = $(LotsTab).children().children("[data-rowkey]");
		
		LotsTabParentRow.each(function(i, item){
			result = false;
			var RowsAllowedCodeArray = $(item).find("[name*='-LOTSallowedCode-']").toArray();
			var RowsFirstPartsCode = $(item).find("[name*='-LOTSfirstPartsCode-']").toArray();
			var RowsQualCode = $(item).find("[name*='-LOTSqualCode-']").toArray();
			var RowsSecondPartsCode = $(item).find("[name*='-LOTSsecondPartsCode-']").toArray();
			if (RowsAllowedCodeArray.some(isDeclined) ||  
				RowsFirstPartsCode.some(isDeclined)  || 
				RowsQualCode.some(isDeclined)  || 
				RowsSecondPartsCode.some(isDeclined)) {
				result = true;
			}
			
			DeclineReasonOnSubTable(item, result);
		})
		
	 }
	 
	 function ShowDeclineReason (result) {
		 if (result) {
		   $("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").show();
		   $("div[title='Причина отказа в допуске']").show();
		 } else {
			$("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").hide();
		    $("div[title='Причина отказа в допуске']").hide(); 
		 } 
	 }
	
	 function DeclineReasonOnSubTable (ParentRow, result) {
		if (result) {
		   $(ParentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").closest(".table-edit-column").show();
		   $(ParentRow).find("div[title='Причина отказа в допуске']").show();
		 } else {
			$(ParentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").closest(".table-edit-column").hide();
		   $(ParentRow).find("div[title='Причина отказа в допуске']").hide();
		 } 
	 }
}

var ReasonRefusal = function() {
	var LotsTab = $("div[data-name='LotsTab']"); // таблица лотов
	var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
	
	var table = $("div[data-name='applicTab'] [data-rowkey]");
	var ID_ETP = $("input[name='ID_ETP']").val();
	var forma = $("input[name='forma']").val();
	$("button[id='declineReasonCode']").prop('disabled', true);
	$("button[id='LOTSdeclineReasonCode']").prop('disabled', true);
	if (['1', '113', '999'].indexOf(ID_ETP) > -1 || 
		['2'].indexOf(ID_ETP) > -1 && !CreateIsNotice.is(':checked')) {
		table.each(function(i, item){
			var firstPartsCode = $(item).find("input[name*='applicTab-firstPartsCode-']").val();
			var secondPartsCode = $(item).find("input[name*='applicTab-secondPartsCode-']").val();
			var place = $(item).find("input[name*='applicTab-place-']").val();
			var allowedCode = $(item).find("input[name*='applicTab-allowedCode-']").val();
			var declineReasonCode = $(item).find("input[data-field-name*='applicTab-declineReasonCode-']");
			var declineReasonButton = $(item).find("button[id='declineReasonCode']");
			if (firstPartsCode == 'F' || secondPartsCode == 'F' || (forma == 'Запрос котировок' && place == 'Не допущен' && ID_ETP == 1)) {
				declineReasonCode.prop('required', true);
				declineReasonButton.prop('disabled', false);
			} else if (ID_ETP == 113 && (allowedCode == 'F' || allowedCode == 'N')){
				declineReasonCode.prop('required', true);
				declineReasonButton.prop('disabled', false);
			}
		})
	}
	// Сбербанк-АСТ и создана из извещения
	else if (['2'].indexOf(ID_ETP) > -1 && CreateIsNotice.is(':checked')) {
		var Arr = ['LOTSallowedCode', 'LOTSfirstPartsCode', 'LOTSqualCode', 'LOTSsecondPartsCode'];
		Arr.forEach(function(item, i){
			var CurrentRow = $(LotsTab).find("input[name*='-"+item+"-'][value='F']").closest("[data-rowkey]");
			$(CurrentRow).find("button[id='LOTSdeclineReasonCode']").prop('disabled', false)
			$(CurrentRow).find("input[data-field-name*='-LOTSdeclineReasonCode-']").prop('required', true);
		})
	}
}

var ApplicTableView = function () {
	var forma = $(".documentView-field-value[data-name='Форма торгов']").attr("title");
	var CreateIsProcedure = $(".documentView-field-value[data-name='Создана из процедуры']").attr("title");
	var EETPName = $(".documentView-field-value[data-name='Наименование ЭТП']").attr("title");
	var ProcolCode = $(".documentView-field-value[data-name='Код протокола']").attr("title");
	var Applictable = $("div[data-api-table-name='applictable']");
	var ApplictablePKO = $("div[data-api-table-name='applictablePKO']");		
	var LotsTab = $("div[data-api-table-name='LotsTab']");		
	if (forma == "Предквалификационный отбор") {
		Applictable.closest("fieldset").hide();
		LotsTab.closest("fieldset").hide();
	}
	// Если площадка Сбербанк - АСТ
	// и протокол создан из процедуры
	else if ((EETPName == 'АО "Сбербанк - АСТ"') && CreateIsProcedure == 1) {
		Applictable.closest("fieldset").hide();
		ApplictablePKO.closest("fieldset").hide();
		if (ProcolCode == 'ancorFreeProtocol') {
			LotsTab.closest("fieldset").hide();
		}
	}
	else{
		ApplictablePKO.closest("fieldset").hide();
		LotsTab.closest("fieldset").hide();
	}
	
}
function ApplicTablePKOColumnView() {
	var typeprotocol = $(".documentView-field-value[data-name='Код протокола']").attr("title");
	var nameprotocol = $(".documentView-field-value[data-name='Наименование протокола']").attr("title");
	
	gridReady("applictablePKO").then(function (grid) {	
		if(typeprotocol == '1'){
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
		    hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		if(typeprotocol == '6'){
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
		    hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
	});
}
function ApplicTableColumnView() {
	var typeprotocol = $(".documentView-field-value[data-name='Код протокола']").attr("title");
	var nameprotocol = $(".documentView-field-value[data-name='Наименование протокола']").attr("title");
	var NameEETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var koefSniz = $(".documentView-field-value[data-name='Коэффициент снижения']").attr('title');
	
	gridReady("applictable").then(function (grid) {
		var Table = $("div[data-api-table-name='applictable']");
		var ArrayPriceWithVAT= $(Table).find("td[aria-label*='Цена с НДС']").find("span").toArray();
		var ArrayPriceWithoutVAT= $(Table).find("td[aria-label*='Цена без НДС']").find("span").toArray();
		
		/* if (!ArrayPriceWithVAT.some(function(elem){return $(elem).text()})) {
			hideColumnByCaptionName(grid, "Цена с НДС");
		}
		
		if (!ArrayPriceWithoutVAT.some(function(elem){return $(elem).text()})) {
			hideColumnByCaptionName(grid, "Цена без НДС");
		} */
		
		/* hideColumnByCaptionName(grid, "Цена с НДС");
		hideColumnByCaptionName(grid, "Цена без НДС"); */
		hideColumnByCaptionName(grid, "Коэффициент снижения цен без НДС");
		hideColumnByCaptionName(grid, "Дата подачи ЦП");

		if (typeprotocol == '1' ) { 
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
			// if (NameEETP != 'АО &quot;ЕЭТП&quot;') {
				// hideColumnByCaptionName(grid, "Причина отказа в допуске");
			// }
		}
		else if (typeprotocol == '2' ) { 
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			/* hideColumnByCaptionName(grid, "Ставка НДС"); */
			// if (NameEETP != 'АО &quot;ЕЭТП&quot;') {
				// hideColumnByCaptionName(grid, "Причина отказа в допуске");
			// }
			if (koefSniz == '1'){
				hideColumnByCaptionName(grid, "Цена с НДС");
				hideColumnByCaptionName(grid, "Цена без НДС");
				hideColumnByCaptionName(grid, "Ставка НДС");
			}
			else{
				var flagforprice = false;
				var flagforprocent = false;
				$.each(grid.getDataSource()._items, function(index, item) {
					if(item.Fields["|Цена_участника_с_НДС"] != ''){
						flagforprice = true
					}
					if(item.Fields["|Процент_снижения_от_НМЦ"] != ''){
						flagforprocent = true
					}
				})
				if (flagforprice != true) {
					hideColumnByCaptionName(grid, "Цена с НДС");
					hideColumnByCaptionName(grid, "Цена без НДС");
					hideColumnByCaptionName(grid, "Ставка НДС");
				}
				if (flagforprocent != true) {
					hideColumnByCaptionName(grid, "% снижения от НМЦ");
				}
			}
			/* for (var i = 0; i < grid.columnCount(); i++) {
				var col = grid.columnOption(i);
				if (koefSniz != '1') {
					if (col.caption === "Цена с НДС" || col.caption === "Цена без НДС") {
						grid.columnOption(i, "visible", true);
					}
				} else {
					if (col.caption === "Коэффициент снижения цен без НДС" || col.caption === "Дата подачи ЦП") {
						grid.columnOption(i, "visible", true);
						hideColumnByCaptionName(grid, "Ставка НДС");
					}
				}
			} */
		}
		else if (typeprotocol == '6' ) {
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Ставка НДС");
		}
		else if (typeprotocol == '5' ) { 
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Основание для решения");
			// hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		else if (typeprotocol == '7' ) { 
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Основание для решения");
			// hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		else if (typeprotocol == '49' ) {
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			// hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		else if (typeprotocol == '4523') {	// конкурс рассмотрения первых частей							
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Основание для решения");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
		}
		else if (typeprotocol == '4150') {	// протокол рассмотрения первых частей заявок МСП запрос предложений							
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Наименование");
			hideColumnByCaptionName(grid, "Основание для решения");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
		}
		else if (typeprotocol == '4111' || typeprotocol == '4171') {
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			/* hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС"); */
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			/* hideColumnByCaptionName(grid, "Ставка НДС"); */
			/* hideColumnByCaptionName(grid, "Причина отказа в допуске"); */
			hideColumnByCaptionName(grid, "Основание для решения");
		}
		else if (typeprotocol == '4504') {
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			/* hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС"); */
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			/* hideColumnByCaptionName(grid, "Ставка НДС"); */
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Основание для решения");
			// hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		else if (typeprotocol == '4270') {
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Основание для решения");
			// hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		else if (typeprotocol == '4209') {
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			/* hideColumnByCaptionName(grid, "Причина отказа в допуске"); */
			hideColumnByCaptionName(grid, "Основание для решения");
		}
		else if (typeprotocol == '4249') {
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			/* hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС"); */
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			/* hideColumnByCaptionName(grid, "Ставка НДС"); */
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Основание для решения");
			// hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		else if (typeprotocol == '4369') {
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Основание для решения");
			// hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		else if (typeprotocol == '4666') {
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			 // hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		/* if (nameprotocol == 'протокол рассмотрения вторых частей заявок' || nameprotocol == 'протокол рассмотрения первых частей заявок') {
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Основание для решения");
		} */
		else if (typeprotocol == '4149') {
			/* hideColumnByCaptionName(grid, "Причина отказа в допуске"); */
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Наименование");
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Основание для решения");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
		}
		else if (typeprotocol == '4170') {
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Место заявки");
			hideColumnByCaptionName(grid, "Результат допуска");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			/* hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ"); */
			/* hideColumnByCaptionName(grid, "Ставка НДС"); */
			hideColumnByCaptionName(grid, "Основание для решения");
			hideColumnByCaptionName(grid, "Цена с НДС");
			hideColumnByCaptionName(grid, "Цена без НДС");
		}
		
		else if (NameEETP == 'АО &quot;Сбербанк - АСТ&quot;') {
			hideColumnByCaptionName(grid, "ЦП вне шага с НДС");
			hideColumnByCaptionName(grid, "ЦП вне шага без НДС");
			hideColumnByCaptionName(grid, "ЦП с НДС");
			hideColumnByCaptionName(grid, "ЦП без НДС");
			hideColumnByCaptionName(grid, "% снижения от НМЦ");
			hideColumnByCaptionName(grid, "Ставка НДС");
			hideColumnByCaptionName(grid, "Результат допуска первых частей");
			hideColumnByCaptionName(grid, "Результат допуска квалификационного отбора");
			hideColumnByCaptionName(grid, "Результат допуска вторых частей");
			hideColumnByCaptionName(grid, "Место заявки");
		}
		
		//var ArrayDeclineReason = $(Table).find("td[aria-label*='Причина отказа в допуске']").find("span").toArray();
		// ЕСли в поле "Причина отказа в допуске" все значения пустые
		/* if (!ArrayDeclineReason.some(elem => $(elem).text())) {
			hideColumnByCaptionName(grid, "Причина отказа в допуске");
		} */
		var flag = false;
		$.each(grid.getDataSource()._items, function(index, item) {
            if(item.Fields["|Причина_отказа_в_допуске"] != ''){
				flag = true
			}
        })
		if (flag != true) {
			hideColumnByCaptionName(grid, "Причина отказа в допуске");
		}
		

	});				
}
function LotsColumnView() {
	var CreateIsProcedure = $(".documentView-field-value[data-name='Создана из процедуры']").attr("title");
	var typeprotocol = $(".documentView-field-value[data-name='Код протокола']").attr("title");
	var nameprotocol = $(".documentView-field-value[data-name='Наименование протокола']").attr("title");
	var NameEETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var HideColumnArray = []; // массив колонок для скрытия
	var MspformTorgArray = ['Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства'];
	var formTorg = $(".documentView-field-value[data-name='Форма торгов']").text();
	gridReady("LotsTab").then(function (grid) {
		// Если это не протокол подведения итогов
		if (typeprotocol != 'ancorResultProtocol') {
			hideColumnByCaptionName(grid, "Результат по лоту");
		}
		
		// Подчиненная таблица
		
		$.each(grid.getDataSource()._items, function(index, item) {
			var Subtable = "LotsTab:" + item.Key + ":|Заявки_участников";
			gridReady(Subtable).then(function(Subgrid) { 
				// Протокол рассмотрения заявок
				if (typeprotocol == 'ancorReviewProtocol') {
					HideColumnArray = ['Результат допуска первых частей', 'Результат допуска квалификационного отбора', 'Результат допуска вторых частей', 'Место заявки', 'Заключить договор', 'Результат оценки', 'Валюта', 'Сведения о предложении о цене', 'Предложение в составе заявки'];
					TableColumnHide(Subgrid, HideColumnArray);
				}
				// Протокол подведения итогов
				else if (typeprotocol == 'ancorResultProtocol') {
					HideColumnArray = ['Результат допуска первых частей', 'Результат допуска квалификационного отбора', 'Результат допуска вторых частей', 'Валюта', 'Сведения о предложении о цене', 'Предложение в составе заявки'];
					if (MspformTorgArray.indexOf(formTorg) > -1) {
						['Результат допуска', 'Основание для решения'].forEach(function(item, i) {
							HideColumnArray.push(item);
						})
					}
					TableColumnHide(Subgrid, HideColumnArray);
				}
				// Протокол открытия доступа к заявкам
				else if (typeprotocol == 'ancorOpenEnvelopeProtocol') {
					HideColumnArray = ['Результат допуска', 'Основание для решения','Результат допуска первых частей', 'Результат допуска квалификационного отбора', 'Результат допуска вторых частей', 'Место заявки', 'Заключить договор', 'Результат оценки', 'Валюта', 'Сведения о предложении о цене', 'Предложение в составе заявки'];
					TableColumnHide(Subgrid, HideColumnArray);
				}
				// Протокол рассмотрения 1-х частей заявок
				else if (typeprotocol == 'ancorProtocolRZ1') {
					HideColumnArray = ['Наименование', 'Результат допуска', 'Основание для решения', 'Результат допуска квалификационного отбора', 'Результат допуска вторых частей', 'Место заявки', 'Заключить договор', 'Результат оценки', 'Валюта', 'Сведения о предложении о цене', 'Предложение в составе заявки'];
					TableColumnHide(Subgrid, HideColumnArray);
				}
				// Протокол рассмотрения 2-х частей заявок
				else if (typeprotocol == 'ancorProtocolRZ2') {
					HideColumnArray = ['Результат допуска', 'Основание для решения', 'Результат допуска квалификационного отбора', 'Место заявки', 'Заключить договор', 'Результат допуска первых частей', 'Результат оценки', 'Валюта', 'Сведения о предложении о цене', 'Предложение в составе заявки'];
					TableColumnHide(Subgrid, HideColumnArray);
				}
				// Протокол изменений условий договора
				else if (typeprotocol == 'ancorProtocolContractConditionChange') {
					HideColumnArray = ['Результат допуска', 'Основание для решения', 'Результат допуска квалификационного отбора', 'Место заявки', 'Заключить договор', 'Результат допуска первых частей', 'Результат допуска вторых частей', 'Результат оценки'];
					TableColumnHide(Subgrid, HideColumnArray);
				}
				// Протокол квалификации
				else if (typeprotocol == 'ancorProtocolQualification') {
					HideColumnArray = ['Наименование', 'Результат допуска первых частей', 'Результат допуска квалификационного отбора', 'Результат допуска вторых частей', 'Место заявки', 'Заключить договор', 'Результат оценки', 'Валюта', 'Сведения о предложении о цене', 'Предложение в составе заявки'];
					TableColumnHide(Subgrid, HideColumnArray);
				}
				
				
				
				// Причина отказа в допуске
				var ArrayDeclineReason = $(Subgrid._$element[0]).find("td[aria-label*='Столбец Причина отказа в допуске']").find("span").toArray();
				
				if (ArrayDeclineReason.length > 0) {
					if (!ArrayDeclineReason.some(function(elem){return $(elem).text()})) {
						hideColumnByCaptionName(Subgrid, "Причина отказа в допуске");
					}
				}
				
				// Цена участника
				var ArrayNDSPrice = $(Subgrid._$element[0]).find("td[aria-label*='Цена участника']").find("span").toArray();
				
				if (ArrayNDSPrice.length > 0) {
					if (!ArrayNDSPrice.some(function(elem){return $(elem).text()})) {
						hideColumnByCaptionName(Subgrid, "Цена участника");
					}
				}
			
			});
        })
		
	});				
}

function TableColumnHide(grid, Arr) {
	Arr.forEach(function(item, i) {
		hideColumnByCaptionName(grid, ""+item+"");
	})
	
}

function PKOcheckbox() {
   let zak_nesost = $("input[name='zak_nesost']");
   let registerProtocol = $("input[name='registerProtocol']").val();
   let formacode = $("input[name='formacode']").val();
  if( (registerProtocol == '6') || ( (registerProtocol == '1') && (formacode=='60'))){
	 zak_nesost.closest(".column-container").hide();
  }
}
function PKOcheckboxView() {  
   if( $(".documentView-field-value[data-name='Форма торгов']").text() == "Предквалификационный отбор" ){
	   $(".documentView-field-value[data-name='Несостоявшаяся закупка']").closest(".column-container").hide();
   }
}
function RFIcheckbox() {
   let zak_nesost = $("input[name='zak_nesost']");
   let registerProtocol = $("input[name='registerProtocol']").val();
   let formacode = $("input[name='formacode']").val();
  if( (registerProtocol == '2') && (formacode=='6') ){
	 zak_nesost.closest(".column-container").hide();
  }
}
function RFIcheckboxView() {  
   if( $(".documentView-field-value[data-name='Форма торгов']").text() == "Запрос RFI" ){
	   $(".documentView-field-value[data-name='Несостоявшаяся закупка']").closest(".column-container").hide();
   }
}

function Desicion() {
	let zak_nesost = $("input[name='zak_nesost']");
	let allowedCode =  $("input[name*='applicTab-allowedCode-']");
	let DesCode = $("input[data-field-name='DesCode']");
	let registerProtocol = $("input[name='registerProtocol']").val();
	let ID_ETP = $("input[name='ID_ETP']").val();
	let arr_rows = []
	let countT = 0
	let countWrite = 0
	allowedCode.each(function() {
		if( $(this).val() =='T' ){//допущен
			countT++
		}
		if( $(this).val() =='F' ){//не допущен
			countWrite++
		}
	});
	
	//выводим поле "Решение по закупке, если один допущен, а остальные нет"
	if (($(zak_nesost).is(":checked")) && (countT==1) && ( countWrite==(allowedCode.length - 1) ) && (registerProtocol == "1") && (ID_ETP == 999)) {
	 DesCode.closest(".column-container").show();
	 $("[data-related-field='DesCode']").addClass("label-required");
	 DesCode.prop('required', true);
	 $("[data-related-field='DesCode']").show();
	 $("[data-related-field='DesCode']").closest(".column-container").show();                    
	$("input[data-field-name='DesCode']").closest(".column-container").show();
	} else {
	 DesCode.closest(".column-container").hide();
	 $("[data-related-field='DesCode']").removeClass("label-required");
	 DesCode.prop('required', false);
	 $("[data-related-field='DesCode']").hide();
	}
}

function DogovorZakluch(){
	let registerProtocol = $("input[name='registerProtocol']").val();
	let ID_ETP = $("input[name='ID_ETP']").val();
	let zak_nesost = $("input[name='zak_nesost']");
	let place =  $("input[name*='applicTab-place-']");
	let allowedCode =  $("input[name*='applicTab-allowedCode-']");
	let contractagree = $("input[data-field-name='contractagree']");
	let count =0;
	let allowedcount =0;
	place.each(function() {
		if( $(this).val() =='1' ){//место
			count++
		}
	});
	allowedCode.each(function() {
		if( $(this).val() =='F' || $(this).val() =='N' ){//место
			allowedcount++
		}
	});
	if (($(zak_nesost).is(":checked")) && (Itog() || ComNesost())) {
		contractagree.closest(".column-container").show();
	} else {
		contractagree.closest(".column-container").hide();
		contractagree.prop('checked',false)
	}
	
	function Itog() {
		let ItogResult = false;
		if ((registerProtocol == "2") && (count>0)) {
			ItogResult = true;
		}
		return ItogResult;
	}
	
	function ComNesost() {
		let ComNesostResult = false;
		if (ID_ETP == 113 && (Number(allowedCode.length) - 1 == Number(allowedcount))) {
			ComNesostResult = true;
		}
		return ComNesostResult;
	}
}

function result2partToReviewAppView() {
	let registerProtocol = $(".documentView-field-value[data-name='Код протокола']").text();
	//если это протокол рассмотрения заявок на мсп площадке
	 gridReady("applictable").then(function (grid) {
		  if (registerProtocol == '4209') {
				$("td[role='columnheader'][aria-label='Результат допуска вторых частей Столбец'] > div.dx-datagrid-text-content").text("Результат рассмотрения заявок")
			}
	   })
}
function result2partToReviewApp() {
	let registerProtocol = $("input[name='registerProtocol']").val();
	//если это протокол рассмотрения заявок на мсп площадке
	if (registerProtocol == '4209') {
		$(".table-edit-columns > div.table-edit-column[title='Результат допуска вторых частей']").text("Результат рассмотрения заявок")
		$("input[data-field-name*='applicTab-secondPartsCode-']").prop('required', true);
		$("input[data-field-name*='applicTab-reason-']").prop('required', true); 
	}
}

function DesicionView() {
   let zak_nesost = $("div[data-name='Несостоявшаяся закупка']").find("input[type='checkbox']");
   let allowedCode = $("td[dx-datagrid-text-content='Результат допуска']");
   let desicion = $("div[data-name='Решение по закупке']");
   let protocolName = $(".documentView-field-value[data-name='Наименование протокола']").text();
   let playground = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
      if ($(zak_nesost).is(":checked") && (protocolName == 'протокол рассмотрения заявок') && ((playground=='АО &quot;РТ-ЕЭТП&quot;') || (playground=='АО "РТ-ЕЭТП"'))) {
         desicion.show();
         $("div[title='Решение по закупке']").show()
      } else {
         desicion.hide();
         $("div[title='Решение по закупке']").hide()
      }
}

function customDropDownHandle(){
	$(".document-view-actions").find("a:contains('Отправить на ЭТП')").each(function() {
		var button = $(this);
		var onclickFunc = button.attr('onclick');
		button.attr('onclick', 'return false;');
		button.click(function(ev) {
			var countPublic = 0;	
			var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
			var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
			var getNameAndDiscObj = $.grep(dxDataGridDocs._items, function(item){
				if (item.Fields.AttachmentPublication == "Публикуется"){
					countPublic++
				}
			});
				
			if( countPublic == 0 ){
				var errorMessage = "Для отправки на ЭТП необходимо присоединить файлы с признаком публикации";
				showCommonErrors(errorMessage);
				return;
				}else{
				eval(onclickFunc);
			}

		});
		
	});
}

function buttonNamekomissiiHide(){
	$("button#Namekomissii").prop('disabled', true)
}

var hidecomission = function() {
	var OrgDoc = $("input[name='OrgDoc']").val();

	if (OrgDoc== 'АО "РТКОММ.РУ"' || OrgDoc== 'ООО "РТК ИТ"' || OrgDoc== 'АО "РТ ЛАБС"' || OrgDoc== 'ООО "СОЛАР СЕКЬЮРИТИ"' || OrgDoc== 'ООО "РТК ИБ"'){
		$("li:has(:contains('Информация о комиссии'))").hide();
		$("input[data-field-name='Namekomissii']").prop('required', false);
	}
}

var hideblocksview = function() {
	var OrgDoc = $(".documentView-field-value[data-name='Организация заказчик']").attr("title")
	if (OrgDoc== 'АО "РТКОММ.РУ"' || OrgDoc== 'ООО "РТК ИТ"' || OrgDoc== 'АО "РТ ЛАБС"' || OrgDoc== 'ООО "СОЛАР СЕКЬЮРИТИ"' || OrgDoc== 'ООО "РТК ИБ"'){
		$("li:has(:contains('Информация о комиссии'))").hide();
		$("li:has(:contains('Плановые сроки проведения закупки'))").hide();
	}

};
function priceApplic(){
	//функция для скрытия полей с ценой участников, если поля пустые
	let Table = $("div[data-name='applicTab']");
	let priceNDS = $("input[type='text'][name*='applicTab-priceNDS-']")
	let priceOutNDS = $("input[type='text'][name*='applicTab-priceOutNDS-']")
	let countPriceNDS = 0
	let countPriceOutNDS = 0
	priceNDS.each(function(index, element) {
		countPriceNDS +=$(this).val().length
	});
	priceOutNDS.each(function(index, element) {
		countPriceOutNDS +=$(this).val().length
	});
	if(countPriceNDS==0){
		priceNDS.closest("div.table-edit-column").hide()
		$(Table).find("div.table-edit-column[title='Цена с НДС']").hide()
	}
	if(countPriceOutNDS==0){
		priceOutNDS.closest("div.table-edit-column").hide()
		$(Table).find("div.table-edit-column[title='Цена без НДС']").hide()
	}
}

function ChangeSubTableIfPoposition(applicId, value) {
	var RowsSubTable = $("input[name*='-ProductСharacteristics-PСhIdOnEETP-'][value="+applicId+"]").closest("[data-rowkey]");
	if (RowsSubTable.length > 0){
		if (value == 'F'){
			 RowsSubTable.find("input[name*='-ProductСharacteristics-ProductPlace-']").val('Не допущен');
			 RowsSubTable.find("input[data-field-name*='-ProductСharacteristics-ProductPlace-']").val('Не допущен');
			 RowsSubTable.find("[id=ProductPlace]").prop('disabled', true);
		} else if (value == 'T') {
			RowsSubTable.find("[id=ProductPlace]").prop('disabled', false);
			RowsSubTable.each(function(i, item){
				var CurerntRow = $(item).find("input[name*='-ProductСharacteristics-ProductPlace-']");
				var CurerntRowName = $(item).find("input[data-field-name*='-ProductСharacteristics-ProductPlace-']");
				if (CurerntRow.val() == 'Не допущен') {
					CurerntRow.val('');
					CurerntRowName.val('');
				}
			})
		}
	
		
	}
}

var filterResult = function() {
	var protocolCode = $("input[name='registerProtocol']").val();
	var ID_ETP = $("input[name='ID_ETP']").val();
	var applicTab = $("div[data-name='applicTab'] [data-rowkey]").length;
	var eventName = "DicDialogOpened",
		dicName = "Результат допуска";
	
	var buttons = $("button[data-dict-name='" + dicName + "']");
	
	buttons.each(function (index, btn) {
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var items = args.items;
			var l = items.length;
			for (var i = 0; i < l; i++) {
				var  currentItem = items[i].data.code;
				var  current = items[i];
				if (protocolCode == 2 && ID_ETP == 113){
				}
				else{
					if (currentItem == 'N') {
						current.remove()
					}
				}
				if (protocolCode == 1 && ID_ETP == 999 && applicTab== 1){
				}
				else{
					if (currentItem == 'K') {
						current.remove()
					}
				}
			};
		});
	});
};
/* function filterResultPlace() {
	let protocolCode = $("input[name='registerProtocol']").val();
	let ID_ETP = $("input[name='ID_ETP']").val();
	let eventName = "DicDialogOpened",
		dicName = "Количество заявок";
	
	let buttons = $("button[data-dict-name='" + dicName + "']");
	
	buttons.each(function (index, btn) {
		let jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			let items = args.items;
			let l = items.length;
			for (let i = 0; i < l; i++) {
				let  currentItem = items[i].data.code;
				let  current = items[i];
				if(protocolCode == '4369' || protocolCode == '4270' || protocolCode == '4249' || protocolCode == '4504'){//Итоги МСП секции
					if (currentItem == 'Не допущен') {
						current.remove()
					}
				}
				else{
					
				}
			};
		});
	});
}; */

function HideTableIfPoposition() {
	var poPosZak = $("input[name='poPosZak']"); // признак попозиционной закупки
	var registerProtocol = $("input[name='registerProtocol']"); // Код протокола
	var Applictable = $("div[data-name='applicTab']"); // Таблица заяввок участников
	var PopositionalTable = $("div[data-name='ItemTab']"); // Таблица для попозиционных закупок
	var ProductPlace = $("[data-field-name*='ProductСharacteristics-ProductPlace-']"); // место заявки в подчиненной таблице		
		// Если попозиционная и подведение итогов
	 if (poPosZak.is(':checked') && registerProtocol.val() == '2'){
		//Applictable.closest(".row-container").hide();
		//Applictable.closest(".row-container").next().hide(); // пустая строка после таблицы
		PopositionalTable.find("div[class*='table-row-actions']").hide(); // Скрываю кнопки добавить и удалить новую строку у таблицы
		//$("input[data-field-name*='applicTab-allowedCode-']").prop('required', false);
		//$("input[data-field-name*='applicTab-reason-']").prop('required', false);
		$("input[data-field-name*='applicTab-place-']").prop('required', false);
		$("input[data-field-name*='applicTab-place-']").closest('.table-edit-column').hide();
		$("div[data-name='applicTab']").find("div[title='Место заявки']").hide()
		if (ProductPlace.length > 0) {
			ProductPlace.prop('required', true);
		}
		/* filterPlaceIfPopositional(); // фильтрация справочника Место заявки */
	 } else {
		 PopositionalTable.closest(".row-container").hide();
		/*  PopositionalTable.closest(".row-container").prev().hide(); // пустая строка до таблицы */
	 }
} 

function FindSupplierForPopositional() {
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	var ID_Lot = $("input[name='ID_Lot']").val(); // ИД лота в Е1
	var formValues = '{ID_Lot: '+ID_Lot+'}';
	var poPosZak = $("input[name='poPosZak']"); // признак попозиционной закупки
	var registerProtocol = $("input[name='registerProtocol']"); // Код протокола
	var IdUnitArray = [];
	var PopositionalTable = $("div[data-name='ItemTab'] [data-rowkey]").not('[data-table-name*=-ProductСharacteristics] [data-rowkey]'); // Таблица для попозиционных закупок	
	
	if (poPosZak.is(':checked') && registerProtocol.val() == '2'){
		// Формируем массив из Id строки позиции на ЭТП
		 if (PopositionalTable.length > 0) {
			 PopositionalTable.each(function(i, item){
				var PositionIdOnEETP = $(item).find("input[name*='ItemTab-PositionIdOnEETP-']").val(); // Получаем все Id строки позиции на ЭТП
				IdUnitArray.push(PositionIdOnEETP); // Добавляем в массив Id строки позиции на ЭТП
			 })
		 }
		
		FormDictionaryHelperModule.getFormDictionaryItemsIds("ПопозиционнаяЗУ", dictFieldsInfo, formValues, function (data) {
			var parseData = JSON.parse(data.data);
			var Applic = parseData.children;
			if (Applic.length > 0){
				Applic.forEach(function(item, i){
					var IDUnitOnEETP = item['unit_id']; // ИД строки позиции на ЭТП
					var IndexOnArray = IdUnitArray.indexOf(IDUnitOnEETP); // Находим индекс в массиве
					// Если есть совпадение в массиве
					if (IndexOnArray != -1) {
						var TableRows = $("div[data-table-name*='ItemTab-"+(IndexOnArray+1)+"-ProductСharacteristics']"); // находим подходящую строку в таблице
						$(TableRows).find('.table-row-actions-left .table-add-row-button').click(); // Добавляем новую строку в подтаблицу
						var RowsSubTable = $(TableRows).find('[data-rowkey]').last(); // Определяем последнюю созданную строчку 
						// заполняем подчиненную таблицу значениями из json
						RowsSubTable.find('[name*=ProductСharacteristics-PСhUnit_id]').val(item['unit_id']);
						RowsSubTable.find('[name*=ProductСharacteristics-PСhApplicationName]').val(item['Наименование поставщика']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductName]').val(item['Наименование товара']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductManufacturer]').val(item['Производитель']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductCountry]').val(item['Страна происхождения товара']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductAppropriateName]').val(item['Соответствующее наименование Товаров/Услуг']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductPriceNoNDS]').autoNumeric('set', item['Цена за единицу без НДС']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductNDS]').autoNumeric('set', item['Ставка НДС']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductPriceWithNDS]').autoNumeric('set', item['Цена за единицу с НДС']);
						RowsSubTable.find('[name*=ProductСharacteristics-ProductCustomerComment]').val(item['Комментарий']);
						RowsSubTable.find('[name*=ProductСharacteristics-PСhIdOnEETP]').val(item['ХТ_ИД_на_ЭТП']);
						RowsSubTable.find('[name*=ProductСharacteristics-PСhOnApplicatiob]').val(item['ХТ_ид_заявки_участника']);
						RowsSubTable.find('[name*=ProductСharacteristics-PСh_Code_On_EETP]').val(item['ХТ_Участник_код_на_ЭТП']);
						
						var Radiobutton = $(PopositionalTable[IndexOnArray]).find('[type=radio]'); //Ищем Radiobutton у родительской строки
						if (Radiobutton.length > 0) {
							// Если Radiobutton неактивен, то проставляем
							if (!Radiobutton.is(':checked')){
								Radiobutton.click();
							}
						}
					}
				});
				var ProductPlace = $("[data-field-name*='ProductСharacteristics-ProductPlace-']"); // место заявки в подчиненной таблице
				if (ProductPlace.length > 0) {
					ProductPlace.prop('required', true);
				}
			}
			
		}, function (error) {
			console.log(error);
		});		
		
	}
}

// фильтрация справочника Место заявки
/* var filterPlaceIfPopositional = function() {	
	var eventName = "DicDialogOpened",
		dicName = "Количество заявок";
	
	var buttons = $("button[data-dict-name='" + dicName + "']");
		var jBtn = $(buttons);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var items = args.items;
			var l = items.length;
			for (var i = 0; i < l; i++) {
				var  currentItem = items[i].data.code;
				var currentRow = items[i];
				if (currentItem == 'Место не присвоено'){
					$(currentRow).remove();
				}
			};
		});
}; */

/* function HideRowActionsTableUch_Kom() {
	let Table = $("div[data-name='Uch_Kom']"); 
	Table.find("div[class*='table-row-actions']").hide();
} */
/* function DisabledButtonMembersTableUch_Kom() {
	$("button[name^='Uch_Kom-FioUch-']").attr("disabled",true); 
	$("button[id='RoleUchCode']").attr("disabled",true); 
} */
function HideIfPopositionOnView() {
	var Poposition = $("div.documentView-field-value[data-name='Попозиционная закупка']");
	var ProductСharacteristics = $("legend:contains('Предложения поставщиков')")
	var EETPName = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	if (Poposition.attr('title') == '1' && EETPName == "АО &quot;РТ-ЕЭТП&quot;") {
		// Скрываю столбец в таблице "Сведения о заявках участников"
		gridReady("applictable").then(function(grid) {			   
			   hideColumnByCaptionName(grid, "Место заявки");
			});
	} else {
		ProductСharacteristics.closest('.column-container').hide()
		ProductСharacteristics.closest('.column-container').prev().hide()
	}
}

function NotAllowedStep (elem) {
	elem = $(elem);
	var allowedCodefield = elem.closest("div[data-rowkey]").find("[data-field-name*='-allowedCode-']");
	var allowedCode = elem.closest("div[data-rowkey]").find("[name*='-allowedCode-']");
	var allowed = elem.closest("div[data-rowkey]").find("[name*='-allowed-']");
	
	if (elem.val() == 'F'){
		allowedCodefield.val('Не допущен');
		allowedCode.val('F');
		allowed.val('Не допущен')
	} else {
		allowedCodefield.val('');
		allowedCode.val('');
		allowed.val('')
	}
	
}

function RemoveExcessPlace() {
	var eventName = "DicDialogOpened";
	var dicName;
	/* var forma = $("input[name='forma']").val(); */
	var TablePKO = $("div[data-name='applicTabPKO'] [data-rowkey]").length; // Количество строк в таблице
	var Table = $("div[data-name='applicTab'] [data-rowkey]").length; // Количество строк в таблице
	// ПКО
	if (TablePKO > 0) {
		dicName = "Количество заявок ПКО";		
		RemovePlace(dicName, TablePKO);
	}
	if (Table > 0) {
		dicName = "Количество заявок";		
		RemovePlace(dicName, Table);
	}
	function RemovePlace(dicName, Table) {		
		var buttons = $("button[data-dict-name='" + dicName + "']");
		var jBtn = $(buttons);
		var ID_ETP = $("input[name='ID_ETP']").val();
		var registerProtocol = $("input[name='registerProtocol']").val()
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var items = args.items;
			var l = items.length;
			/* Если больше чем Количество строк +2(Не допущен, место не присвоено) */
			/* if ((Number(Table) + 2) < Number(l)) {
				// заполняем индексы в массив которые должны удалить из справочник места
				var arr = [];
				for (var i = Number(Table); i < (Number(l)-2); i++) {
					arr.push(i);
				};
				// Удаляем строки, индексы которых лежат в массиве
				if (arr.length > 0) {
					arr.forEach(function(item, i, collection){
						items[item].remove();
					})
				}
			} */
			$(items).each(function(i, item){
				var current = item['id'];
				// Если номер строки больше чем всего строк в таблице
				if(Number(current) > Number(Table)){
					items[i].remove();
				} else if(ID_ETP == '1' && current == 'Не допущен' && registerProtocol != '4249') {
					items[i].remove();
				} else if (ID_ETP == '999' && dicName == 'Количество заявок' && current == 'Место не присвоено') {
					items[i].remove();
				}
			})
			// скрыть лишние действия для различных площадок
			/* if (ID_ETP == '1') {
				items[l-2].remove(); // предпоследний элемент, 'Не допущен'
			} else if(ID_ETP == '999' && dicName == 'Количество заявок') {
				items[l-1].remove(); // последний элемент элемент, 'Место не присвоено'
			} */
		});
	}
}

function CheckSelectPlace() {
	var form = $("form");
	form.on("beforeSubmit", function (args) {
		var TablePKO = $("div[data-name='applicTabPKO'] [data-rowkey]"); // Количество строк в таблице
		var Table = $("div[data-name='applicTab'] [data-rowkey]"); // Количество строк в таблице
		var MaxWinners = $("input[name='MaxWinners']");
		var poPosZak = $("input[name='poPosZak']");
		var formacode = $("input[name='formacode']").val();
		var registerProtocol = $("input[name='registerProtocol']").val();
		var PlaceArray = []; // Массив где хранятся все места
		var CustomPlaceArray = ['Не допущен', 'Место не присвоено', 'Не выбрано'];
		var count = Number(0); // Счетчик количетсва вхождений в массив CustomPlaceArray
		var flag = true;
		var ArrAllowed = []; // тут хранятся инфорамция о "допуске" или "Не допуске" заявки участников
		var ID_ETP = $("input[name='ID_ETP']").val();
		var zak_nesost = $("input[data-field-name='zak_nesost']");
		var go_archive = $("input[data-field-name='go_archive']"); // Чекбокс "Отправить лот в архив"
		var errorMessage; // Сообщение об ошибке
		var CountPlace; // количество выбранных числовых значений мест
		var CountNotAllowed = Number(0); // количество не допущенных
		var CountWinner = Number(0); // количество победителей
		var DogovorComplete = $("input[data-field-name='DogovorComplete']")
		
		// Сбер АСТ
		var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
		
		if  (['1', '113', '999'].indexOf(ID_ETP) > -1) {
			// ПКО	
			if (TablePKO.length > 0) {
				SelectPlace(TablePKO, TablePKO.length);
			} else if (Table.length > 0) {
				SelectPlace(Table, Table.length);
			}
			
			function SelectPlace(currentTable, len) {
				$(currentTable).each(function(i, item){
					 var CurrentValue = $(item).find("input[name*='-place-']").val();
					 var CurrentAllowed = $(item).find("input[name*='-allowed-']").val(); // Признак допуска заявки участников
					 // Если Признак допуска заявки участников не пусто, то добавляем в массив
					 if (CurrentAllowed) {
						 ArrAllowed.push(CurrentAllowed);
						  if(CurrentAllowed == 'Не допущен') {
							  CountNotAllowed++;
						  }
					 }
					 if (CurrentValue == '1') {
						CountWinner++;
					 }
					 // если место заполнено
					 if (CurrentValue) {
						PlaceArray.push(CurrentValue);
							if (CustomPlaceArray.some(function(elem){return elem == CurrentValue})) {
								count++;
							}
					 }
				})
				// Если закупка не "Несостоявшаяся закупка"
				if (!zak_nesost.is(":checked") && registerProtocol!='6') {
					if (PlaceArray.length > 0) {
						// Находим количество выбранных числовых значений мест
						CountPlace = Number(len)-Number(count);
						// Если выбрано хотя бы одно числовое значение места
						if (Number(CountPlace) > Number(0)){
							for (var place = 1; place <= Number(CountPlace); place++){
								var result = PlaceArray.some(function(elem){return elem == String(place)}); // проверяем место в массиве назначенных мест
								var SomeResult = PlaceArray.some(function(elem) {return Number(elem) > Number(place)});  //Проверяем, есть ли места ниже чем текущее
								// Если не нашли место в массиве, но нашли место ниже текущего place
								if (!result && SomeResult) {
									errorMessage = "Места заявок должны быть последовательны, начиная с 1. Не указано место заявки "+place+"";
									ShowErrors(errorMessage);
									flag = false;
									break;
								}					
							}
						} else if (Number(CountPlace) == Number(0) && ID_ETP == 1) {
							flag = false;
							errorMessage = 'В протоколе не осталось допущенных заявок. Необходимо выбрать признак "Несостоявшаяся закупка"';
							ShowErrors(errorMessage);
						}
					}
					// Проверка на то, все ли заявки допущены
					if (flag) {
						if(len==1){
							flag = false;
							errorMessage = 'Подана только одна заявка, необходимо выбрать признак "Несостоявшаяся закупка"';
							ShowErrors(errorMessage);
						}
						else{
							// Если массив не пустой
							if (ArrAllowed.length > 0){
								var everyResult = ArrAllowed.every(function(elem) {return elem == 'Не допущен'});  //проверяет, все ли заявки "Не допущен"
								// если все заявки не допущены
								if (everyResult && (Number(ArrAllowed.length) == Number(len))) {
									flag = false;
									errorMessage = 'В протоколе не осталось допущенных заявок. Необходимо выбрать признак "Несостоявшаяся закупка"';
									ShowErrors(errorMessage);
								}
							}
						}
					}
					// Если допущено несколько заявок, то нельзя ставить чекбокс "Несостоявшаяся закупка"
				} else if (registerProtocol!='6'){
					if (flag) {
						// Находим количество выбранных числовых значений мест 
						CountPlace = Number(len)-Number(count);
						//Если количество допущенных заявок участников больше одного ИЛИ масиив мест не пуст и выбрано более одного  числового значения места
						if ((Number(len) - Number(CountNotAllowed))>1 && !(PlaceArray.length > 0)|| (CountPlace > 1 && PlaceArray.length > 0)) {
							if (ID_ETP != 1) {
								flag = false;
								errorMessage = 'Закупка признана несостоявшейся: Закупка не может быть признана несостоявшейся, так как решение о допуске выбрано для более чем одного участника закупки';
								ShowErrors(errorMessage);
							} else if (ID_ETP == 1 && go_archive.is(':checked')) {
								flag = false;
								errorMessage = 'Лот не может быть отправлен в архив, так как решение о допуске выбрано для более чем одного участника закупки';
								ShowErrors(errorMessage);
							}
						}
					}
				}
			}
			
			/* if (Table.length == 0 && TablePKO.length == 0) {
				if (!zak_nesost.is(":checked")) {
					flag = false;
					errorMessage = 'Отсутствуют заявки участников, закупка признана несостоявшейся: Необходимо выбрать признак "Несостоявшаяся закупка"';
					ShowErrors(errorMessage);
				}
			} */
			
			if (registerProtocol == '2' && !poPosZak.is(':checked')) {
					// Если количество количество победителей больше макимального количества победителй
					if ((Number(CountWinner) > Number(MaxWinners.val())) && MaxWinners.val()) {
						flag = false;
						errorMessage = 'Количество победителей ('+Number(CountWinner)+') больше Максимального количества победителей по Лоту ('+Number(MaxWinners)+').';
						ShowErrors(errorMessage);		
					}
					
					if ((Number(CountWinner) > 1) && !MaxWinners.val()) {
						flag = false;
						errorMessage = 'Количество победителей ('+Number(CountWinner)+') больше Максимального количества победителей по Лоту (1).';
						ShowErrors(errorMessage);		
					}
			}
		}
		// сбер аст
		else if (ID_ETP == 2 && CreateIsNotice.is(':checked')) {
			var registerProtocol = $("input[name='registerProtocol']").val();
			var SubTable = $("div[data-name*='-LOTSapplicTab']"); // подчиненная таблица заявок участников
			var LotsTable = $("div[data-name='LotsTab']");
			var LotsTableRows = $(LotsTable).children().children("[data-rowkey]");
			
			
			// Протокол изменений условий договора
			if (registerProtocol == 'ancorProtocolContractConditionChange') {
				SubTable.each(function(i, item){
					var Rows = $(item).find("[data-rowkey]");
					
					for (var k = 0; k < Rows.length; k++){
						let LOTSRequestPrice = $(Rows[k]).find("input[name*='-LOTSRequestPrice-']").val(); // Предложение в составе заявки
						let LOTSCurrency_kod = $(Rows[k]).find("input[name*='-LOTSCurrency_kod-']").val(); // Валюта
						let LOTSRequestPriceInfo = $(Rows[k]).find("input[name*='-LOTSRequestPriceInfo-']").val(); // Сведения о предложении о цене
						let LOTSapplicName = $(Rows[k]).find("input[name*='-LOTSapplicName-']").val(); // Наименование
						
						/* все три поля пустые */
						if (!LOTSRequestPrice && !LOTSCurrency_kod && !LOTSRequestPriceInfo) {
							flag = false;
							errorMessage = 'Лот('+(i+1)+'), участник(№'+(k+1)+', '+LOTSapplicName+'): Необходимо указать "Сведения о предложении о цене" или "Предложение в составе заявки" и "Валюта"';
							ShowErrors(errorMessage);
							return false;
						}
						/* "Предложение в составе заявки" заполнено, "Валюта" пустая */
						else if (LOTSRequestPrice && !LOTSCurrency_kod) {
							flag = false;
							errorMessage = 'Лот('+(i+1)+'), участник(№'+(k+1)+', '+LOTSapplicName+'): Необходимо указать "Валюту"';
							ShowErrors(errorMessage);
							return false;
						}
						/* "Предложение в составе заявки" пусто, "Валюта" заполнена */
						else if (!LOTSRequestPrice && LOTSCurrency_kod) {
							flag = false;
							errorMessage = 'Лот('+(i+1)+'), участник(№'+(k+1)+', '+LOTSapplicName+'): Необходимо указать "Предложение в составе заявки"';
							ShowErrors(errorMessage);
							return false;
						}
						
					}
				})
			}
			// протокол подведения итогов
			else if (registerProtocol == 'ancorResultProtocol') {
				// проверяю места на протоколе подведния итогов
				for (var k = 0; k < LotsTableRows.length; k++) {
					var SupplierRows = $(LotsTableRows[k]).find("[data-rowkey]").find("input[name*='-LOTSplace-']"); // заявки по лоту
					var NumericPlaceArr = NumericPlace(SupplierRows); // массив мест в заявке по лоту
					// Если есть числовые места
					if (NumericPlaceArr.length > 0) {
						
						for (var place = 1; place <= NumericPlaceArr.length; place++) {
							var Result = NumericPlaceArr.some(function(elem) {return Number(place) == Number(elem)});  //Проверяем, есть ли места ниже чем текущее
							var SomeResult = NumericPlaceArr.some(function(elem) {return Number(elem) > Number(place)});  //Проверяем, есть ли места ниже чем текущее
							
							//  проверяю на последовательность порядка мест
							if (!Result && SomeResult) {
								errorMessage = "Места заявок должны быть последовательны, начиная с 1. У лота(№"+(k+1)+") не указано место заявки "+place+"";
								ShowErrors(errorMessage);
								flag = false;
								return false;
							}
							// проверяю на одинаковые места
							else if (coincident(NumericPlaceArr, place)) {
								errorMessage = "Места заявок не должны повторяться. У лота(№"+(k+1)+") повторяется место "+place+"";
								ShowErrors(errorMessage);
								flag = false;
								return false;
							}
						}
					}
					
					// ставлю чекбоксы договор заключается на лоте
					var LotCompleteDogovor = $(LotsTableRows[k]).find("input[name*='-LotCompleteDogovor-']"); // чекбокс договор заключается на лоте
					var ApplickCompleteDogovor = $(LotsTableRows[k]).find("[data-rowkey]").find("input[name*='-NeedContractConclusion-']"); // чекбокс договор заключается на заявке участников
					
					if (flag) {
						
						if (ApplickCompleteDogovor.length > 0) {
							ApplickCompleteDogovor = ApplickCompleteDogovor.toArray();
						
							if (ApplickCompleteDogovor.some(function(elem) { return $(elem).val() == 'Да'})) {
								LotCompleteDogovor.val('1');
								LotCompleteDogovor.prop('checked', true);
							}
							else {
								LotCompleteDogovor.val('0');
								LotCompleteDogovor.prop('checked', false);
							}
						}
						else {
							LotCompleteDogovor.val('0');
							LotCompleteDogovor.prop('checked', false);
						}
					}
					
				}
				
				if (flag) {
					// ставлю чекбокс договор заключается в общем на протоколе
					var LotsCompleteDogovor = $(LotsTableRows).find("input[name*='-LotCompleteDogovor-']"); // чекбокс договор заключается на лоте
					LotsCompleteDogovor = LotsCompleteDogovor.toArray();
					if (LotsCompleteDogovor.some(function(elem) { return $(elem).val() == '1'})) {
						DogovorComplete.val('1');
						DogovorComplete.prop('checked', true);
					}
					else {
						DogovorComplete.val('0');
						DogovorComplete.prop('checked', false);
					}
				}
				
			}
			// признак того, что ошибки нет выше
			if (flag) {
				// если это не протокол окрытия доступа или в свободной форме
				if (['ancorOpenEnvelopeProtocol', 'ancorFreeProtocol', 'ancorProtocolContractConditionChange'].indexOf(registerProtocol) == -1) {
					var allowedCode = $(SubTable).find("input[data-field-name*='-LOTSallowedCode']");
					var allowedCodeArr = $(allowedCode).toArray(); // формируем массив
					// проверка на то, чтоне стоит признак "Закупка не состоялась"
					if (!zak_nesost.is(':checked')) {
						// проверка на то, что присутсвуют поданные заявки участников
						if (!allowedCode.length > 0) {
							flag = false;
							errorMessage = 'В системе отсутствуют заявки участников, необходимо указать признак "Несостоявшаяся закупка"';
							ShowErrors(errorMessage);
							return false;
						}
						// проверка на то, что все зяавки были не допущены
						else if (EveryCheck(allowedCodeArr, 'Не допущен')) {
							flag = false;
							errorMessage = 'В протоколе не осталось допущенных заявок. Необходимо выбрать признак "Несостоявшаяся закупка"';
							ShowErrors(errorMessage);
							return false;
						}
					}
				}
			}			
		}
		
		// проверяем, что значение в массиве встречается >1
		function coincident(Arr, Currentitem) {
			var counter = 0;
			Arr.forEach(function(item, i){
				if (Number(item) == Number(Currentitem)) {
					counter++;
				}
			})
			
			if (counter > 1) {
				return true;
			} else {
				return false;
			}
		}
		
		// функция возврщает массив всех чиcловых мест
		function NumericPlace(Arr) {
			var NumericPlaceArr = [];
			Arr.each(function(i, item) {
				var item = $(item).val();
				if (Number(item) > 0) {
					NumericPlaceArr.push(item);
				}
			})
			return NumericPlaceArr;
		}
		
		function EveryCheck(Arr, value) {
			return Arr.every(function(elem){
				return $(elem).val() == value;
			})
		}
			
		function ShowErrors(errorMessage) {
			showCommonErrors(errorMessage);
			$(".loading-image.loading-image-shown").hide();
			$(".btn-toolbar > .btn").attr("disabled", false);
			form.find("[type='submit']").attr("disabled", false);		
			throw new Error("beforeSave");
		}			
	
		/* Если ничего не упало то отображаем гифку загрузки */
		if (flag){
			$(".loading-image.loading-image-shown").show();
		}
	})
	
}

var ReasonForRecognitionAsInvalid = function() {
	var ID_ETP = $("input[name='ID_ETP']").val();
	var form = $("form");
	if (ID_ETP == 113 || ID_ETP == 999) {
		$("textarea[data-field-name='Prich_nesost']").prop('readonly', false); // Делаем textarea "Причина признания несостоявшейся" редактируемым
		form.on("beforeSubmit", function (args) {
			var TextArea_Prich_nesost = $("textarea[data-field-name='Prich_nesost']");
			var input_Prich_nesost = $("input[name='Prich_nesost']");
			var Prich_nesost_name = $("input[name='Prich_nesost_name']");
			var zak_nesost = $("input[data-field-name='zak_nesost']");
			if(zak_nesost.is(':checked')) {
				// Если есть текст TextArea
				if(TextArea_Prich_nesost.val()) {
					 // Если выбрано из справочника, но текс в TextArea не совпадает с Prich_nesost_name
					if (input_Prich_nesost.val() && (TextArea_Prich_nesost.val() != Prich_nesost_name.val())) {
						input_Prich_nesost.val(''); // чистим кодовое имя поля
						Prich_nesost_name.val(TextArea_Prich_nesost.val()); // записываем в Prich_nesost_name текст из TextArea
						// Если TextArea редактируется быз выбора из справочника
					} else if (!Prich_nesost_name.val()){
						Prich_nesost_name.val(TextArea_Prich_nesost.val()); // записываем в Prich_nesost_name текст из TextArea
					}
				}
			}
		})
	}
}

// СберАСТ кнопка фильтрации места
function SberAstPlaceFilter() {
	var ID_ETP = $("input[name='ID_ETP']").val();
	var eventName = "DicDialogOpened",
		dicName = "Место заявки";
	var buttons = $("button[data-dict-name='" + dicName + "']");
	var formacode = $("input[name='formacode']").val();
	var MspFormTorg = ['20', '21', '22', '25'];
		// 20 Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 21 Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 22 Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 25 Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства

	buttons.each(function (index, btn) {
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var CountRows = $(args.dictButton).closest("[data-name*='-LOTSapplicTab']").find("[data-rowkey]").length;
			var items = args.items;
			var Arr = ['Не допущен'];
			var l = items.length;
			for (var i = 0; i < l; i++) {
				var currentItem = items[i].data.code;
				var current = items[i];
				if (Arr.indexOf(currentItem) == -1) {
					if (currentItem > CountRows) {
						current.remove();
					}
				}
				// ЕСЛИ МСП то удаляем пукнт "Не допущен"
				else if (MspFormTorg.indexOf(formacode) > -1) {
					current.remove();
				}
			};
		});
	});
};

// СберАСТ кнопка фильтрации наименований протоколов
function SberAstRegisterProtocolFilter() {
	var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
	var ID_ETP = $("input[name='ID_ETP']").val();
	var eventName = "DicDialogOpened";
	var ProtocolStep = $("input[name='ProtocolStep']").val(); // текущий этап процедуры который заполняется при импорте из Сбер-АСТ
	var RegisterProtocolButton = $("button[id='registerProtocol']");
	var forma = $("input[name='forma']").val();
	var formacode = $("input[name='formacode']").val();
	var ArrAtFirstReview = ['Аукцион', 'Аукцион с двумя частями заявок']; // список форм торгов, где вначале должен отображаться только протокол рассмотрения заявок
	var ArrPriorety = ['Протокол рассмотрения 1-х частей заявок',
					   'Протокол рассмотрения 2-х частей заявок',
					   'Протокол рассмотрения заявок',
					   'Протокол подведения итогов']; // тут отображается список приоритезации протоколов на возрастание
	var MSPFormArr = ['Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства', 
					  'Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
					  'Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
					  'Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
					  'Аукцион (заявка из 2-х частей)',
					  'Конкурс (заявка из 2-х частей)',
					  'Запрос предложений (заявка из 2-х частей)'];
					  
	var AuctionStatus = ['Ожидает начала торгов', 'Идут торги', 'Закрытие торгов', 'Формирование результатов подачи заявок', 'Прием заявок', 'Блокирование денежных средств на спецсчете']; // Статусы аукциона
	var LotStatus = $("div[data-name='LotsTab']").find("input[name*='-LotStatus-']");
	
	if (CreateIsNotice.is(':checked')) {
		// АО "Сбербанк - АСТ"
		if (ID_ETP == '2') {
			RegisterProtocolButton.each(function (index, btn) {
				var jBtn = $(btn);
				jBtn.unbind(eventName);
				jBtn.on(eventName, function (event, args) {
					var items = args.items;
					var l = items.length;
					var ProtocolArr = []; // Список доступных протоколов после фильтрации с GlobalProtocols
					for (var i = 0; i < l; i++) {
						var currentItem = items[i].data['Наименование'];
						var current = items[i];
						
						// проверяем протоколы
						// Если нет в списке GlobalProtocols то удаляем
						if (!protocolSome(currentItem)) {
							current.remove();
						} else {
							ProtocolArr.push({
								'Наименование': currentItem,
								'Объект': current
							})
						}
					};
					// кастомная логика для "Квалификационный отбор в электронной форме"
					// 59 - "Квалификационный отбор в электронной форме"
					if (!ProtocolStep && formacode == '59' && checkLotStatus(['Прием заявок'], LotStatus)) {
						/* CheckPriority(['Протокол рассмотрения заявок', 'Протокол в свободной форме'], ProtocolArr, ArrPriorety); */
						CheckPriority(['Протокол открытия доступа к заявкам', 'Протокол рассмотрения заявок'], ProtocolArr, ArrPriorety);
					}
					
					// Если идут торги для аукционов
					else if (checkLotStatus(AuctionStatus, LotStatus)){ 
						ShowProtocolName(['Протокол в свободной форме'], ProtocolArr);
					}
					
					// Для МСП создается только один протокол изменения условий договора
					else if (ProtocolStep == 'Опубликован протокол изменения условий договора') {
						
						if (FormaIsMsp(formacode)) {
							ShowProtocolName(['Протокол в свободной форме'], ProtocolArr);
						}
						else {
							ShowProtocolName(['Протокол изменений условий договора', 'Протокол в свободной форме'], ProtocolArr);
						}
						
					} 
					else if (ProtocolStep == 'Опубликован протокол подведения итогов') {
						ShowProtocolName(['Протокол изменений условий договора', 'Протокол в свободной форме'], ProtocolArr);
					} 
					else if (ProtocolStep == 'Опубликован протокол рассмотрения вторых частей') {
						ShowProtocolName(['Протокол в свободной форме', 'Протокол подведения итогов'], ProtocolArr);
					}
					// Если МСП
					else if (MSPFormArr.indexOf(forma) > -1) {
						//рассмотрение первых частей если есть протокол квалификационного отбора
						if (ProtocolStep == 'Опубликован протокол рассмотрения заявок/первых частей' && CheckInAdditionalStep('Протокол квалификации')) {
							ShowProtocolName(['Протокол квалификации', 'Протокол в свободной форме'], ProtocolArr);
						}
						// рассмотрение первых частей
						else if (ProtocolStep == 'Опубликован протокол рассмотрения заявок/первых частей') {
							CheckPriority(['Протокол рассмотрения 2-х частей заявок', 'Протокол в свободной форме'], ProtocolArr, ArrPriorety);
						}
						// рассмотрение вторых частей
						else if (ProtocolStep == 'Опубликован протокол квалификации') {
							CheckPriority(['Протокол рассмотрения 2-х частей заявок', 'Протокол в свободной форме'], ProtocolArr, ArrPriorety);
						}
						// еще не опубликованы протоколы
						else {
							CheckPriority(['Протокол рассмотрения 1-х частей заявок', 'Протокол в свободной форме'], ProtocolArr, ArrPriorety);
						}	
					}
					// Если не МСП
					else if (MSPFormArr.indexOf(forma) == -1) {
						//рассмотрение первых частей
						if (ProtocolStep == 'Опубликован протокол рассмотрения заявок/первых частей') {
							ShowProtocolName(['Протокол подведения итогов', 'Протокол в свободной форме'], ProtocolArr);
						}
						else if (ProtocolStep == 'Опубликован протокол открытия доступа к заявкам') {
							// сперва рассмотрение, потом подведение
							if (ArrAtFirstReview.indexOf(forma) > -1) {
								ShowProtocolName(['Протокол рассмотрения заявок', 'Протокол в свободной форме'], ProtocolArr);
							}
							else {
								ShowProtocolName(['Протокол рассмотрения заявок', 'Протокол в свободной форме', 'Протокол подведения итогов'], ProtocolArr);
							}
							
						}
						// сперва рассмотрение, потом подведение
						else if (ArrAtFirstReview.indexOf(forma) > -1) {
							ShowProtocolName(['Протокол открытия доступа к заявкам', 'Протокол рассмотрения заявок', 'Протокол в свободной форме'], ProtocolArr);
						}
						
						// кастомная логика для Запрос котировок (заявка из 2-х частей)
						else if (forma == 'Запрос котировок (заявка из 2-х частей)') {
							ShowProtocolName(['Протокол рассмотрения 2-х частей заявок', 'Протокол в свободной форме'], ProtocolArr);
						}
						// еще не опубликованы протоколы
						else {
							ShowProtocolName(['Протокол открытия доступа к заявкам', 'Протокол рассмотрения заявок', 'Протокол подведения итогов', 'Протокол в свободной форме'], ProtocolArr);
						}
					}
				});
			});
		}
		
	}
	
	function FormaIsMsp(formacode) {
		var result = false;
		if (formacode) {
			if (['20', '21', '22', '25'].indexOf(formacode) > -1) {
				result = true;
			}
		}
		return result;
	}
	
	function CheckInAdditionalStep(currentItem) {
		var result = false;
		if (GlobalAdditionalStep.length > 0) {
			GlobalAdditionalStep.forEach(function(item, i) {
				if (item['Наименование протокола'] == currentItem) {
					result = true;
				}
			})
		}
		return result;
	}
	
	function checkLotStatus(AuctionStatus, LotStatus) {
		var flag = false;
		LotStatus.each(function(i, item){
			if (AuctionStatus.indexOf($(item).val()) > -1) {
				flag = true;
			}
		});
		return flag;
	}
	
	function protocolSome(currentItem) {
		var result = false;
		// проверяем наличие в массиве доступных протоколов
		if (GlobalProtocols.length > 0) {
			GlobalProtocols.forEach(function(item, i) {
				if (item['Наименование_протокола_на_ЭТП'] == currentItem) {
					result = true;
				}
			})
		}
		// проверяем наличие в массиве дополнительных этапов
		if (GlobalAdditionalStep.length > 0) {
			GlobalAdditionalStep.forEach(function(item, i) {
				if (item['Наименование протокола'] == currentItem) {
					result = true;
				}
			})
		}
		
		return result;
	}
	
	function ShowProtocolName (Arr, ProtocolArr) {
		ProtocolArr.forEach(function(item, i){
			if (Arr.indexOf(item['Наименование']) == -1) {
				item['Объект'].remove();
			}
		})
	}
	
	// отображение протокола по приоритету
	function CheckPriority (Arr, ProtocolArr, ArrPriorety) {
		var FindProtocol = false;
		
		
		
		if (checkProtocol(FindProtocol, Arr[0])) {
			ShowProtocolName(Arr, ProtocolArr);	// вызов функции
		}
		// Если первого протокола из Arr нет в ProtocolArr, то проверяем следующий по приоритету из ArrPriorety
		else {
			if (ArrPriorety.indexOf(Arr[0]) != -1) {
				for (let i = 0; Number(ArrPriorety.length) > i; i++) {
					// отбираем протоколы, которые идут после нашего проотокола
					if (i > ArrPriorety.indexOf(Arr[0])) {
						// проверяем, есть наш следующий по приоритету протокол в ProtocolArr
						if (checkProtocol(FindProtocol, ArrPriorety[i])) {
							// если нашли, то передаем в функцию отображения и выходим из цикла
							Arr[0]  = ArrPriorety[i];
							ShowProtocolName(Arr, ProtocolArr);	// вызов функции
							return false; // завершаем перебор цикла
						}
					}
				}
			}
		}
		
		//Проверяем, есть ли первый протокол из Arr в списке протоколов ProtocolArr
		function checkProtocol(FindProtocol, currentProtocolName) {
			for(let i = 0; Number(ProtocolArr.length) > i; i++){
				if (ProtocolArr[i]['Наименование'] == currentProtocolName) {
					FindProtocol = true;
					return FindProtocol; // Возвращаем признак того, что протокол найден
				}
			}
			return FindProtocol; // Возвращаем признак того, что протокол найден
		}
	}
}

// СберАСТ результат допуска, результат допуска первых частей
function SberAstAllowedFilter() {
	var ID_ETP = $("input[name='ID_ETP']").val();
	var eventName = "DicDialogOpened";
	var Arrbuttons = ['LOTSfirstPartsCode', 'LOTSallowedCode', 'LOTSqualCode', 'LOTSsecondPartsCode'];
	Arrbuttons.forEach(function(item, i){
		var buttons = $("button[id='" + item + "']");
		buttons.each(function (index, btn) {
			var jBtn = $(btn);
			jBtn.unbind(eventName);
			jBtn.on(eventName, function (event, args) {
				var items = args.items;
				var Arr = ['Допущен', 'Не допущен'];
				var l = items.length;
				for (var i = 0; i < l; i++) {
					var currentItem = items[i].data['Наименование'];
					var current = items[i];
					if (Arr.indexOf(currentItem) == -1) {
						current.remove();
					}
				};
			});
		});	
	})
	
	
};

// Фильтрация спрачоника "Причина признания несостоявшейся"
function MissedContestFilter() {
	
	var eventName = "DicDialogOpened",
		dicName = "Причина признания несостоявшейся";
	var buttons = $("button[data-dict-name='" + dicName + "']");
	
	buttons.each(function (index, btn) {
		
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var ID_ETP = $("input[name='ID_ETP']").val();
			var items = args.items;
			var l = items.length;
			var CheckCompetitiveResult = CheckCompetitive();
			for (var i = 0; i < l; i++) {
				var currentItem = items[i].data['ИД площадки'];
				var current = items[i];
				
				// Если сбербанк АСТ и тип процедуры конкурентная
				if (ID_ETP == 2 && CheckCompetitiveResult) {
					if (ID_ETP != currentItem) {
						current.remove(); 
					}
					
				} 
				else {
					
					if (currentItem) {
						current.remove(); 
					}
				}
				
			};
		});
		
		function CheckCompetitive() {
			var result = true;
			var registerSpZakup = $("input[name='registerSpZakup']").val(); // код способа закупки
			if (GlobalProcedureType.length > 0) {
				// 0 - "Неконкурентная"
				// 1 - "Конкурентная"
				// 2 - "Конкурентная иная"
				// 3 - "Неконкурентная иная"
				
				if (['0', '3'].indexOf(GlobalProcedureType[0]["Конкурентная_код"]) > -1) {
					if (GlobalProcedureType[0]["Способ_код"] == registerSpZakup) {
						result = false;
					}
				}
			}
			
			
			return result;
		}
	});
};

function RegisterProtocolButtonDisabledLogic() {
	var CreateIsNotice = $("input[name='CreateIsNotice']"); // признак того, что протокол создан из процедуры
	var naimETP = $("input[name='naimETP']").val(); // площадка
	var RegisterProtocolButton = $("button[id='registerProtocol']");
	
	if (!CreateIsNotice.is(':checked')) {
		RegisterProtocolButton.prop('disabled', true)
	}
}
 
function TableHide(ArrTable) {
	if (ArrTable.length >0) {
		ArrTable.forEach(function(item, i){
			$("div[data-name='"+item+"']").closest('.column-container').hide();
		})
	}
}

function TableShow(ArrTable) {
	if (ArrTable.length >0) {
		ArrTable.forEach(function(item, i){
			$("div[data-name='"+item+"']").closest('.column-container').show();
		})
	}
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

function ShowTableColumn(table, Columns) {
	if (Columns.length > 0) {
		Columns.forEach(function(item, i){
			$(table).find("div[data-colname*="+item+"]").show();
			$(table).find("input[data-field-name*=-"+item+"-]").closest('.table-edit-column').show();
		})
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
		$(legend).closest(".row-container").prev().show();
		
	});	
}
function LegendAndEmptyNextRowShow(Arr) {
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.show();
		$(legend).closest(".row-container").next().show();
		
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

//отобразить и сделать необязательным
function filedShowAnd_NotRequired (Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			$("[data-field-name='"+item+"']").prop('required', false);
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
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

// скрываем поля
function filedHideAndNotRequired(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').hide();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide();
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

$(document).on('change', "input[name*='Uch_Kom-FioUch-']", function (e) {
   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
   var currentFIO = $(this).val(); //ФИО текущего пользователя
   var CurrentID = $("input[name='Uch_Kom-FioUch-Id-" + rowkey+ "']").val();
   var table = $("div[data-name='Uch_Kom']")
   var Uch_Kom = $(table).find("input[name*='Uch_Kom-FioUch-Id']");
   if (CurrentID != ''){
		Uch_Kom.each(function(i,item){
			var CurrentRows = $(item).closest(".table-edit-row").attr('data-rowkey');
			if ($(item).val() != '' && CurrentRows != rowkey){
				if ($(item).val() == CurrentID) {
					showCommonErrors('Пользователь с ФИО: '+ currentFIO + " уже был добавлен");
					$("input[name='Uch_Kom-FioUch-" + rowkey+ "']").val('')
					$("input[name='Uch_Kom-FioUch-Id-" + rowkey+ "']").val('')
				} 
			}
		})
    }
});

function customDropDownHandle(){
	
	$(".document-view-actions").find("a:contains('Отправить на ЭТП')").each(function() { 

        var button = $(this);
		var onclickFunc = button.attr('onclick');		
		button.attr('onclick', 'return false;');
		
		button.click(function(ev) {
			var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
			var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
			
			var getProject = $.grep(dxDataGridDocs._store._array, function(item){
			  return item.Fields.AttachmentPublication == "Публикуется";
			});	
			
			var textErrors = [];			
			
			if(getProject.length == 0){
				textErrors.push("Публикуется")
			}			
			if(textErrors.length > 0){
				var files_errorMessage = (textErrors.length > 0) ? 'документа необходимо приложить файл с Признаком публикации: ' + textErrors.join(', ') : '';
				var errorMessage = "Для публикации " + files_errorMessage +".";
				showCommonErrors(errorMessage);
				return;
			}
			else{
				eval(onclickFunc);
			}
		});

	});
}

var ProcedureDateChange = function() {
	$("input[name='ProcedureDate']").parent().on('dp.change', function (e) {
		var today=new Date()
		var day=today.getDate();
		if (day < 10) {
			//day = '0' + day;
		}
		var month=(today.getMonth()+1);
		if (month < 10) {
			month = '0' + month;
		}
		var year=today.getFullYear();
		var today1= day+"."+month+"."+year;
		let today1Spec= year+"."+month+"."+day; //спец создана переменная, чтоб использовать в условии ниже new Date 
		today1Spec = new Date(today1Spec)
		let ProcedureDate  = $("input[name='ProcedureDate']").val() //спец создана переменная, чтоб использовать в условии ниже new Date 
		let yearOfExecution = ProcedureDate.slice(6,10)//берем год
		let dayOfExecution = ProcedureDate.slice(0,2)//берем день
		let monthOfExecution = ProcedureDate.slice(3,5)//берем месяц
		ProcedureDate = yearOfExecution+"."+monthOfExecution+"."+dayOfExecution
		ProcedureDate = new Date(ProcedureDate)
		
		
		if ($("input[name='ProcedureDate']").val() !="") {
			if (today1Spec < ProcedureDate) {
				showCommonErrors('Дата этапа процедуры не может быть раньше текущей');
				$("input[name='ProcedureDate']").parent().data("DateTimePicker").clear();
				return;
			}
		}
	});
};

scopes.onRegister(Soglas);
scopes.onRegister(EventHadlerDependingOnEETP);
scopes.onRegister(editreg);
scopes.onRegister(Izmenenie);
scopes.onRegister(summary);
scopes.onRegister(FormTorg);
//scopes.onRegister(FilterSposob);
scopes.onRegister(VnesIzm);
scopes.onRegister(ETP);
scopes.onRegister(ProtocolButton);
scopes.onRegister(declineReasonHandling);
scopes.onRegister(PKOcheckbox);
scopes.onRegister(Desicion);
scopes.onRegister(result2partToReviewApp);
scopes.onRegister(buttonNamekomissiiHide);
scopes.onRegister(hidecomission);
scopes.onRegister(priceApplic);
scopes.onRegister(applicTableHandling);
scopes.onRegister(filterResult);
scopes.onRegister(go_archive);
/* scopes.onRegister(filterResultPlace); */
scopes.onRegister(HideTableIfPoposition);
scopes.onRegister(FindSupplierForPopositional);
scopes.onRegister(RFIcheckbox);
// scopes.onRegister(HideRowActionsTableUch_Kom);
// scopes.onRegister(DisabledButtonMembersTableUch_Kom);
scopes.onRegister(RemoveExcessPlace);
scopes.onRegister(CheckSelectPlace);
scopes.onRegister(ReasonRefusal);
scopes.onRegister(ReasonForRecognitionAsInvalid);
scopes.onRegister(SberAstPlaceFilter);
scopes.onRegister(MissedContestFilter);
scopes.onRegister(RegisterProtocolButtonDisabledLogic);
scopes.onRegister(SberAstAllowedFilter);
scopes.onRegister(SberAstRegisterProtocolFilter);
scopes.onRegister(AsyncResponse);
scopes.onRegister(ProcedureDateChange);
scopes.onRegister(one_zay);

scopes.onEdit(summary);
scopes.onEdit(EventHadlerDependingOnEETP);
scopes.onEdit(editreg);
scopes.onEdit(Izmenenie);
scopes.onEdit(Soglas);
scopes.onEdit(FormTorg);
//scopes.onEdit(FilterSposob);
scopes.onEdit(VnesIzm);
scopes.onEdit(ETP);
scopes.onEdit(ProtocolButton);
scopes.onEdit(declineReasonHandling);
scopes.onEdit(PKOcheckbox);
scopes.onEdit(result2partToReviewApp);
scopes.onEdit(buttonNamekomissiiHide);
scopes.onEdit(hidecomission);
scopes.onEdit(priceApplic);
scopes.onEdit(applicTableHandling);
scopes.onEdit(filterResult);
scopes.onEdit(go_archive);
/* scopes.onEdit(filterResultPlace); */
scopes.onEdit(HideTableIfPoposition);
scopes.onEdit(RFIcheckbox);
// scopes.onEdit(HideRowActionsTableUch_Kom);
// scopes.onEdit(DisabledButtonMembersTableUch_Kom);
scopes.onEdit(RemoveExcessPlace);
scopes.onEdit(Desicion);
scopes.onEdit(CheckSelectPlace);
scopes.onEdit(ReasonRefusal);
scopes.onEdit(ReasonForRecognitionAsInvalid);
scopes.onEdit(SberAstPlaceFilter);
scopes.onEdit(MissedContestFilter);
scopes.onEdit(RegisterProtocolButtonDisabledLogic);
scopes.onEdit(SberAstAllowedFilter);
scopes.onEdit(SberAstRegisterProtocolFilter);
scopes.onEdit(AsyncResponse);
scopes.onEdit(functionCall);
scopes.onEdit(ProcedureDateChange);
scopes.onEdit(one_zay);

scopes.onView(ApplicTableColumnView);
scopes.onView(DocumentViewLogick);
scopes.onView(IzmenemieView);
scopes.onView(SoglasovView);
scopes.onView(FormTorgView);
scopes.onView(VnesIzmView);
scopes.onView(ApplicTableView);
scopes.onView(result2partToReviewAppView);
scopes.onView(DesicionView);
scopes.onView(ApplicTablePKOColumnView);
scopes.onView(PKOcheckboxView);
scopes.onView(RFIcheckboxView);
scopes.onView(go_archiveView);
scopes.onView(HideIfPopositionOnView);
scopes.onView(LotsColumnView);
scopes.onView(one_zayView);