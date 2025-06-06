"use strict";
$(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
	/* var item = $(value); */
	var step = $("input[data-field-name='step']");
	if (!$(step).is(":checked")) {
		var item = $("input[name='stepFrom']");
		item.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.0000',
			vMax: "99999999999999999999999999999999999999999.9999",
			mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
			wEmpty: '',
			mRound: 'B'
		});
		
		var item2 = $("input[name*='stepTo']");
		item2.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.0000',
			vMax: "99999999999999999999999999999999999999999.9999",
			mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '4',
			wEmpty: '',
			mRound: 'B'
		});
	}
});

var EtpFilterDictionary = function () {
	var zakelform = $("input[data-field-name='zakelform']");
	var UchSMP = $("input[name='UchSMP']");
	var naimETP = $("button[id='naimETP']");
	var eventName = "DicDialogOpened";
	
	naimETP.each(function (index, btn) {
		
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var items = args.items;
			var l = items.length;
			for (var i = 0; i < l; i++) {
				var currentItem = items[i].data['Идентификатор'];
				var current = items[i];
				if (currentItem == '999') {
					current.remove();
				}
				// Закупка в электронной форме
				if (zakelform.is(':checked')) {
					// Признак МСП
					if (UchSMP.is(':checked')) {
						
						//Удаляем НЕ МСП площадки
						if (['1', '2'].indexOf(currentItem) == -1) {
							current.remove();
						}
						
					} else {
						
						// Удаляем МСП площадку
						if (['1'].indexOf(currentItem) > -1) {
							current.remove();
						}
					}
				}
				
			};
		});
	});
	
	
};

var editreg = function() {     
	$("li:has(:contains('Скрытые поля'))").hide();
	/* $("li:has(:contains('Изменения'))").hide(); */
	$("input[data-field-name='CountryCodeTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CountryCodeTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='CityCodeTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CityCodeTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='Tel']").inputmask({ mask: '9{5,8}', greedy: false });
	$("input[data-field-name='Tel']").attr("data-parsley-pattern", "\\d{5,8}");
	$("input[data-field-name='AdditionalTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='AdditionalTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='CountryCodeFax']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CountryCodeFax']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='CityCodeFax']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CityCodeFax']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='Fax']").inputmask({ mask: '9{5,8}', greedy: false });
	$("input[data-field-name='Fax']").attr("data-parsley-pattern", "\\d{5,8}");
	$("input[data-field-name='AdditionalFax']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='AdditionalFax']").attr("data-parsley-pattern", "\\d{1,4}");
}

function documentCancelHide(){
	$("li:has(:contains('Документы об отказе от проведения процедуры'))").hide();
}

var ChangeHeights = function() {
	$("textarea[name='mestorasmpredl']").css("height", "34px"); // изменить высоту у поля "Место рассмотрения предложений"
}

// Функция перечесления возможных значений для скрытия блоков на просмотр  
var hideblocksview = function() {
	$("div[data-name='Способ закупки код']").hide();
	$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
	$("div[data-name='Этап рассмотрения 2х частей']").closest(".column-container").hide();
	var SposZak_view = $(".documentView-field-value[data-name='Способ закупки']").text().toLowerCase();

    // Дата вскрытия конвертов
    var datevskrkonv = $("div[data-name='Дата вскрытия конвертов']");
	
    if (!~SposZak_view.indexOf('един')) {
        datevskrkonv.show();        
		} else {
	    datevskrkonv.hide();      
	}
	
    // Дата рассмотрения заявок
    var daterassm = $("div[data-name='Дата рассмотрения заявок']");
	
    if (!~SposZak_view.indexOf('един')) {
        daterassm.show();
		} else {
        daterassm.hide();
	}
	
    // Место рассмотрения заявок
	
    var mestorasm = $("div[data-name='Место рассмотрения заявок']");
	
    if (!~SposZak_view.indexOf('един')) {
        mestorasm.show();
		} else {
        mestorasm.hide();
	}
	
    // Дата окончания подачи заявок
	
    var dateokonpod = $("div[data-name='Дата окончания подачи заявок']");
	
    if (!~SposZak_view.indexOf('един')) {
        dateokonpod.show();
		} else {
        dateokonpod.hide();
	}
	
    // Дата проведения торгов
	
    var datetorg = $("div[data-name='Дата проведения торгов']");
	
    if (!~SposZak_view.indexOf('един')) {
        datetorg.show();
		} else {
        datetorg.hide();
	}
    // Дата подведения итогов
	
    var datepoditog = $("div[data-name='Дата подведения итогов']");
	
    if (!~SposZak_view.indexOf('един')) {
        datepoditog.show();
		} else {
        datepoditog.hide();
	}
};

// Добавление строки в таблица Заказчик_подразделение_таблица
var addrowCustomerTable = function() {
	var count = $("div[data-name='CustomerTab'] div[data-rowkey]").length;
	
	if ( count < 1 ) {  
		$("div[data-name='CustomerTab'] .table-add-row-button").click();
	}; 
};

//Кваликационный отбор на проcмотр
var hidequalificationview = function() {
	
    var otbor = $("div[data-name='Квалификационный отбор']").find("input[type='checkbox']");
    if (!$(otbor).attr("checked")) {
        $("li:has(:contains('Квалификационный отбор'))").hide();
	}
	izmenView();
};

//Квалификационный отбор на регистрацию
var hidequalificationreg = function() {
	
    var kvalotb = $("input[data-field-name='kvalotb']");
    var block = $("li:has(:contains('Квалификационный отбор'))");
	var datevskrkonvKO = $("input[name='datevskrkonvKO']");
    var daterasmzayaKO = $("input[name='daterasmzayaKO']");
    var dateokonpodzayaKO = $("input[name='dateokonpodzayaKO']");
	var porpodzayOK = $("textarea[name='porpodzayOK']");
	var porvskrOK = $("textarea[name='porvskrOK']");
	var poryadpasmokOK = $("textarea[name='poryadpasmokOK']");
	var mestopodzayOK = $("textarea[name='mestopodzayOK']");
	var mestovskrOK = $("textarea[name='mestovskrOK']");
	var mestoramzayOK = $("textarea[name='mestoramzayOK']");
	if ($(kvalotb).is(":checked")) {
		block.show();
		$("input[data-field-name='datevskrkonvKO']").prop('required', true);
		datevskrkonvKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=datevskrkonvKO]").addClass("label-required");
		$("input[data-field-name='daterasmzayaKO']").prop('required', true);
		daterasmzayaKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=daterasmzayaKO]").addClass("label-required");
		$("input[data-field-name='dateokonpodzayaKO']").prop('required', true);
		dateokonpodzayaKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=dateokonpodzayaKO]").addClass("label-required");
		porpodzayOK.closest(".column-container").show();
		$("[data-related-field=porpodzayOK]").show();
		porpodzayOK.prop("required", true);
		porpodzayOK.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porpodzayOK]").addClass("label-required");
		porvskrOK.closest(".column-container").show();
		$("[data-related-field=porvskrOK]").show();
		porvskrOK.prop("required", true);
		porvskrOK.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porvskrOK]").addClass("label-required");
		poryadpasmokOK.closest(".column-container").show();
		$("[data-related-field=poryadpasmokOK]").show();
		poryadpasmokOK.prop("required", true);
		poryadpasmokOK.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadpasmokOK]").addClass("label-required");
        } else {
		block.hide();
		$("input[name='datevskrkonvKO']").prop('required', false);
		datevskrkonvKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=datevskrkonvKO]").addClass("label-required");
		$("input[name='daterasmzayaKO']").prop('required', false);
		daterasmzayaKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=daterasmzayaKO]").addClass("label-required");
		$("input[name='dateokonpodzayaKO']").prop('required', false);
		dateokonpodzayaKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=dateokonpodzayaKO]").addClass("label-required");
		porpodzayOK.closest(".column-container").hide();
		$("[data-related-field=porpodzayOK]").hide();
		porpodzayOK.prop("required", false);
		$("[data-related-field=porpodzayOK]").removeClass("label-required");
		porvskrOK.closest(".column-container").hide();
		$("[data-related-field=porvskrOK]").hide();
		porvskrOK.prop("required", false);
		$("[data-related-field=porvskrOK]").removeClass("label-required");
		poryadpasmokOK.closest(".column-container").hide();
		$("[data-related-field=poryadpasmokOK]").hide();
		poryadpasmokOK.prop("required", false);
		$("[data-related-field=poryadpasmokOK]").removeClass("label-required");
	}
	IzmenenieReg();
	IzmenenieEdit();
};

//Квалификационный отбор на редактирование
$(document).on('change', "input[data-field-name='kvalotb']", function (e) {
    var kvalotb = $("input[data-field-name='kvalotb']");
    var block = $("li:has(:contains('Квалификационный отбор'))");
    var datevskrkonvKO = $("input[name='datevskrkonvKO']");
    var daterasmzayaKO = $("input[name='daterasmzayaKO']");
    var dateokonpodzayaKO = $("input[name='dateokonpodzayaKO']");
	var porpodzayOK = $("textarea[name='porpodzayOK']");
	var porvskrOK = $("textarea[name='porvskrOK']");
	var poryadpasmokOK = $("textarea[name='poryadpasmokOK']");
	var mestopodzayOK = $("textarea[name='mestopodzayOK']");
	var mestovskrOK = $("textarea[name='mestovskrOK']");
	var mestoramzayOK = $("textarea[name='mestoramzayOK']");
	if ($(this).is(":checked")) {
		block.show();
		$("input[data-field-name='datevskrkonvKO']").prop('required', true);
		datevskrkonvKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=datevskrkonvKO]").addClass("label-required");
		$("input[data-field-name='daterasmzayaKO']").prop('required', true);
		daterasmzayaKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=daterasmzayaKO]").addClass("label-required");
		$("input[data-field-name='dateokonpodzayaKO']").prop('required', true);
		dateokonpodzayaKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=dateokonpodzayaKO]").addClass("label-required");
		porpodzayOK.closest(".column-container").show();
		$("[data-related-field=porpodzayOK]").show();
		porpodzayOK.prop("required", true);
		porpodzayOK.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porpodzayOK]").addClass("label-required");
		porvskrOK.closest(".column-container").show();
		$("[data-related-field=porvskrOK]").show();
		porvskrOK.prop("required", true);
		porvskrOK.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porvskrOK]").addClass("label-required");
		poryadpasmokOK.closest(".column-container").show();
		$("[data-related-field=poryadpasmokOK]").show();
		poryadpasmokOK.prop("required", true);
		poryadpasmokOK.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadpasmokOK]").addClass("label-required");
        } else {
		block.hide();
		$("input[name='datevskrkonvKO']").prop('required', false);
		datevskrkonvKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=datevskrkonvKO]").addClass("label-required");
		$("input[name='daterasmzayaKO']").prop('required', false);
		daterasmzayaKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=daterasmzayaKO]").addClass("label-required");
		$("input[name='dateokonpodzayaKO']").prop('required', false);
		dateokonpodzayaKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=dateokonpodzayaKO]").addClass("label-required");
		datevskrkonvKO.closest(".documentView-field-value").find(".date-field").val("");
		daterasmzayaKO.closest(".documentView-field-value").find(".date-field").val("");
		dateokonpodzayaKO.closest(".documentView-field-value").find(".date-field").val("");
		porpodzayOK.closest(".column-container").hide();
		$("[data-related-field=porpodzayOK]").hide();
		porpodzayOK.prop("required", false);
		$("[data-related-field=porpodzayOK]").removeClass("label-required");
		porpodzayOK.text('');
		porpodzayOK.val('');
		porvskrOK.closest(".column-container").hide();
		$("[data-related-field=porvskrOK]").hide();
		porvskrOK.prop("required", false);
		$("[data-related-field=porvskrOK]").removeClass("label-required");
		porvskrOK.text('');
		porvskrOK.val('');
		poryadpasmokOK.closest(".column-container").hide();
		$("[data-related-field=poryadpasmokOK]").hide();
		poryadpasmokOK.prop("required", false);
		$("[data-related-field=poryadpasmokOK]").removeClass("label-required");
		poryadpasmokOK.text('');
		poryadpasmokOK.val('');
		datevskrkonvKO.parent().data("DateTimePicker").clear();
		daterasmzayaKO.parent().data("DateTimePicker").clear();
		dateokonpodzayaKO.parent().data("DateTimePicker").clear();
		mestopodzayOK.text('');
		mestopodzayOK.val('');
		mestovskrOK.text('');
		mestovskrOK.val('');
		mestoramzayOK.text('');
		mestoramzayOK.val('');
	}
	IzmenenieReg();
	IzmenenieEdit();
});

$(document).on('change', "input[data-field-name='porRassmZa']", function (e) {
    Obyazetap();
});


// отображение полей формы торгов РТК на регистрацию и редактирование
var rtkhide = function () {
	var naimETP = $("input[name='naimETP']");
	var formTorg = $("input[name='formTorgName']");
	var zakldog = $("input[name='zakldog']");
	var vremyojidrt = $("input[name='vremyojidrt']");
	var vremyojidpervrt = $("input[name='vremyojidpervrt']");
	var vremyojiddoprt = $("input[name='vremyojiddoprt']");
	var svedToEIS = $("input[name='svedToEIS']");
	var valdog = $("input[name='valdog']");
	var stepToRT = $("input[name='stepToRT']");
	var stepFromRT = $("input[name='stepFromRT']");
	var plandaterazm = $("input[name='plandaterazm']");
	var reTorg = $("input[name='reTorg']");
	var poPosZak = $("input[name='poPosZak']");
	var koefsn = $("input[name='koefsn']");
	var dateregtorgrt = $("input[name='dateregtorgrt']");
	var stepPercent = $("input[name='stepPercent']");
	var accredReason = $("input[name='accredReason']");
	var datenachprrt = $("input[name='datenachprrt']");
	var mestorasmrt = $("textarea[name='mestorasmrt']");
	var mestoprovtorgrt = $("textarea[name='mestoprovtorgrt']");
	var mestorasmpredl = $("textarea[name='mestorasmpredl']");
	var zayavkadvart = $("input[name='zayavkadvart']");
	var predlpovrt = $("input[name='predlpovrt']");
	var Konksposob = $("input[name='Konksposob']");
	var VskKonvertov = $("input[name='VskKonvertov']");
	var RasmZay = $("input[name='RasmZay']");
	var vremyojidpervrt = $("input[name='vremyojidpervrt']");
	var vremyojiddoprt = $("input[name='vremyojiddoprt']");
	var statusnotice = $("input[name='statusnotice']").val();
	var poryadokpodzayrt = $("textarea[name='poryadokpodzayrt']");
	var porrasmzayrt = $("textarea[name='porrasmzayrt']");
	var porprovtorgrt = $("textarea[name='porprovtorgrt']");
	var porpodvitogrt = $("textarea[name='porpodvitogrt']");
	var prUlCp = $("input[name='prUlCp']");
	var poryadoknachobshar = $("textarea[name='poryadoknachobshar']");

	if (naimETP.val() == 'АО "РТ-ЕЭТП"') {
		if (formTorg.val() == "Аукцион на повышение (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").show();
			vremyojidrt.closest(".column-container").show();
			vremyojidrt.prop("required", true);
			$("[data-related-field=vremyojidrt]").addClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");

			$("[data-related-field=stepFromRT]").closest(".column-container").show();
			stepFromRT.closest(".column-container").show();
			stepFromRT.prop("required", true);
			$("div[data-related-field=stepFromRT]").addClass("label-required");

			$("[data-related-field=stepToRT]").closest(".column-container").show();
			stepToRT.closest(".column-container").show();
			stepToRT.prop("required", true);
			$("div[data-related-field=stepToRT]").addClass("label-required");

			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);

			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").addClass("label-required");
			porrasmzayrt.prop("required", true);
			$("[data-related-field=porpodvitogrt]").removeClass("label-required");
			porpodvitogrt.prop("required", false);

			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			$("[data-related-field=stepPercent]").removeClass("label-required");
			stepPercent.prop("required", false);
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			$("[data-related-field=mestorasmrt]").closest(".column-container").show();
			mestorasmrt.closest(".column-container").show();
			$("[data-related-field=mestoprovtorgrt]").closest(".column-container").show();
			mestoprovtorgrt.closest(".column-container").show();
			zakldog.closest(".column-container").hide();

			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").show();
			$("[data-related-field=valdog]").closest(".column-container").show();
			zayavkadvart.closest(".column-container").show();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide();
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=daterassmrt]").addClass("label-required");
			$("input[name='daterassmrt']").prop("required", true);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datetorgrt]").addClass("label-required");
			$("input[name='datetorgrt']").prop("required", true);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datepoditogrt]").removeClass("label-required");
			$("input[name='datepoditogrt']").prop("required", false);
			$("[data-related-field=porprovtorgrt]").addClass("label-required");
			porprovtorgrt.prop("required", true);
			$("[data-related-field=mestorasmpredl]").closest(".column-container").hide();
			mestorasmpredl.closest(".column-container").hide();
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			Konksposob.closest(".column-container").hide();
			VskKonvertov.closest(".column-container").hide();
			RasmZay.closest(".column-container").hide();
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			$("[data-related-field=porrasmzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porrasmzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=porprovtorg]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porprovtorg]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if (formTorg.val() == "Открытый аукцион (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").show();
			vremyojidrt.closest(".column-container").show();
			vremyojidrt.prop("required", true);
			$("[data-related-field=vremyojidrt]").addClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").show();
			vremyojidpervrt.closest(".column-container").show();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").show();
			vremyojiddoprt.closest(".column-container").show();
			vremyojiddoprt.prop("required", true);
			$("[data-related-field=vremyojiddoprt]").addClass("label-required");
			$("[data-related-field=stepFromRT]").closest(".column-container").show();
			stepFromRT.closest(".column-container").show();
			stepFromRT.prop("required", true);
			$("div[data-related-field=stepFromRT]").addClass("label-required");
			$("[data-related-field=stepToRT]").closest(".column-container").show();
			stepToRT.closest(".column-container").show();
			stepToRT.prop("required", true);
			$("div[data-related-field=stepToRT]").addClass("label-required");
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);
			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").addClass("label-required");
			porrasmzayrt.prop("required", true);
			$("[data-related-field=porpodvitogrt]").addClass("label-required");
			porpodvitogrt.prop("required", true);
			$("[data-related-field=porprovtorgrt]").addClass("label-required");
			porprovtorgrt.prop("required", true);
			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			$("[data-related-field=stepPercent]").removeClass("label-required");
			stepPercent.prop("required", false);
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			$("[data-related-field=mestorasmrt]").closest(".column-container").show();
			mestorasmrt.closest(".column-container").show();
			zakldog.closest(".column-container").hide();
			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").show();
			$("[data-related-field=valdog]").closest(".column-container").show();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=daterassmrt]").addClass("label-required");
			$("input[name='daterassmrt']").prop("required", true);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datetorgrt]").addClass("label-required");
			$("input[name='datetorgrt']").prop("required", true);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datepoditogrt]").addClass("label-required");
			$("input[name='datepoditogrt']").prop("required", true);
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").show();
			vremyojidpervrt.closest(".column-container").show();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").show();
			vremyojiddoprt.closest(".column-container").show();
			$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=porpodvitog]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porpodvitog]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=porrasmzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porrasmzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=porvskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porvskrkonv]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if ((formTorg.val() == "Открытый конкурс (РТ)") || (formTorg.val() == "Открытый запрос предложений (РТ)") || (formTorg.val() == "Открытый запрос котировок (РТ)") || (formTorg.val() == "Упрощенная закупка (РТ)")) {
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
			vremyojidrt.closest(".column-container").hide();
			vremyojidrt.prop("required", false);
			$("[data-related-field=vremyojidrt]").removeClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");
			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");
			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");
			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);
			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").addClass("label-required");
			porrasmzayrt.prop("required", true);
			$("[data-related-field=porpodvitogrt]").addClass("label-required");
			porpodvitogrt.prop("required", true);
			$("[data-related-field=porprovtorgrt]").removeClass("label-required");
			porprovtorgrt.prop("required", false);
			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			$("[data-related-field=stepPercent]").removeClass("label-required");
			stepPercent.prop("required", false);
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			$("[data-related-field=mestorasmrt]").closest(".column-container").show();
			mestorasmrt.closest(".column-container").show();
			zakldog.closest(".column-container").hide();
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").show();
			poPosZak.closest(".column-container").show();
			koefsn.closest(".column-container").show()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=daterassmrt]").addClass("label-required");
			$("input[name='daterassmrt']").prop("required", true);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datetorgrt]").removeClass("label-required");
			$("input[name='datetorgrt']").prop("required", false);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datepoditogrt]").addClass("label-required");
			$("input[name='datepoditogrt']").prop("required", true);
			$("[data-related-field=mestorasmpredl]").closest(".column-container").hide();
			mestorasmpredl.closest(".column-container").hide();
			Konksposob.closest(".column-container").hide();
			RasmZay.closest(".column-container").hide();
			VskKonvertov.closest(".column-container").hide();
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=porpodvitog]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porpodvitog]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=porrasmzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porrasmzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=porvskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=porvskrkonv]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if (formTorg.val() == "Запрос RFI (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
			vremyojidrt.closest(".column-container").hide();
			vremyojidrt.prop("required", false);
			$("[data-related-field=vremyojidrt]").removeClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");
			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");
			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");
			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").removeClass("label-required");
			porrasmzayrt.prop("required", false);
			$("[data-related-field=porpodvitogrt]").addClass("label-required");
			porpodvitogrt.prop("required", true);
			$("[data-related-field=porprovtorgrt]").removeClass("label-required");
			porprovtorgrt.prop("required", false);
			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			$("[data-related-field=stepPercent]").removeClass("label-required");
			stepPercent.prop("required", false);
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			zakldog.closest(".column-container").hide();
			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=daterassmrt]").removeClass("label-required");
			$("input[name='daterassmrt']").prop("required", false);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datetorgrt]").removeClass("label-required");
			$("input[name='datetorgrt']").prop("required", false);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datepoditogrt]").addClass("label-required");
			$("input[name='datepoditogrt']").prop("required", true);
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if (formTorg.val() == "Квалификационный отбор (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
			vremyojidrt.closest(".column-container").hide();
			vremyojidrt.prop("required", false);
			$("[data-related-field=vremyojidrt]").removeClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");
			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");

			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");

			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);

			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").addClass("label-required");
			porrasmzayrt.prop("required", true);
			$("[data-related-field=porpodvitogrt]").addClass("label-required");
			porpodvitogrt.prop("required", true);
			$("[data-related-field=porprovtorgrt]").removeClass("label-required");
			porprovtorgrt.prop("required", false);
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			$("[data-related-field=stepPercent]").removeClass("label-required");
			stepPercent.prop("required", false);
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			zakldog.closest(".column-container").hide();

			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").show()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=daterassmrt]").addClass("label-required");
			$("input[name='daterassmrt']").prop("required", true);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datetorgrt]").removeClass("label-required");
			$("input[name='datetorgrt']").prop("required", false);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datepoditogrt]").addClass("label-required");
			$("input[name='datepoditogrt']").prop("required", true);
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if (formTorg.val() == "Конкурентный отбор со стартовой ценой (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").show();
			vremyojidrt.closest(".column-container").show();
			vremyojidrt.prop("required", true);
			$("[data-related-field=vremyojidrt]").addClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");

			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");

			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");

			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);

			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").addClass("label-required");
			porrasmzayrt.prop("required", true);
			$("[data-related-field=porpodvitogrt]").addClass("label-required");
			porpodvitogrt.prop("required", true);
			$("[data-related-field=porprovtorgrt]").addClass("label-required");
			porprovtorgrt.prop("required", true);
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			$("[data-related-field=dateregtorgrt]").closest(".column-container").show();
			dateregtorgrt.closest(".column-container").show();
			$("[data-related-field=dateregtorgrt]").addClass("label-required");
			dateregtorgrt.prop("required", true);
			$("[data-related-field=stepPercent]").closest(".column-container").show();
			stepPercent.closest(".column-container").show();
			stepPercent.prop("required", true);
			$("[data-related-field=stepPercent]").addClass("label-required");
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			zakldog.closest(".column-container").hide();

			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=daterassmrt]").addClass("label-required");
			$("input[name='daterassmrt']").prop("required", true);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datetorgrt]").addClass("label-required");
			$("input[name='datetorgrt']").prop("required", true);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datepoditogrt]").addClass("label-required");
			$("input[name='datepoditogrt']").prop("required", true);
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if (formTorg.val() == "Предквалификационный отбор (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
			vremyojidrt.closest(".column-container").hide();
			vremyojidrt.prop("required", false);
			$("[data-related-field=vremyojidrt]").removeClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");

			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");

			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");

			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);
			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").removeClass("label-required");
			porrasmzayrt.prop("required", false);
			$("[data-related-field=porpodvitogrt]").addClass("label-required");
			porpodvitogrt.prop("required", true);
			$("[data-related-field=porprovtorgrt]").removeClass("label-required");
			porprovtorgrt.prop("required", false);
			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			stepPercent.prop("required", false);
			$("[data-related-field=stepPercent]").removeClass("label-required");
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			zakldog.closest(".column-container").hide();
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=daterassmrt]").removeClass("label-required");
			$("input[name='daterassmrt']").prop("required", false);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datetorgrt]").removeClass("label-required");
			$("input[name='datetorgrt']").prop("required", false);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datepoditogrt]").addClass("label-required");
			$("input[name='datepoditogrt']").prop("required", true);
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if (formTorg.val() == "Аккредитационный отбор (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
			vremyojidrt.closest(".column-container").hide();
			vremyojidrt.prop("required", false);
			$("[data-related-field=vremyojidrt]").removeClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");

			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");

			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");

			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);

			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").addClass("label-required");
			porrasmzayrt.prop("required", true);
			$("[data-related-field=porpodvitogrt]").addClass("label-required");
			porpodvitogrt.prop("required", true);
			$("[data-related-field=porprovtorgrt]").removeClass("label-required");
			porprovtorgrt.prop("required", false);




			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			stepPercent.prop("required", false);
			$("[data-related-field=stepPercent]").removeClass("label-required");
			$("[data-related-field=accredReason]").closest(".row-container").show();
			accredReason.closest(".row-container").show();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			zakldog.closest(".column-container").hide();
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			svedToEIS.closest(".column-container").show();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=dateokonprrt]").addClass("label-required");
			$("input[name='dateokonprrt']").prop("required", true);
			$("[data-related-field=dateokonprrt]").show();
			$("input[name='dateokonprrt']").closest(".column-container").show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=daterassmrt]").addClass("label-required");
			$("input[name='daterassmrt']").prop("required", true);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datetorgrt]").removeClass("label-required");
			$("input[name='datetorgrt']").prop("required", false);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datepoditogrt]").addClass("label-required");
			$("input[name='datepoditogrt']").prop("required", true);
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)

		} else if (formTorg.val() == "Подтверждение стандартных условий (РТ)") {
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
			vremyojidrt.closest(".column-container").hide();
			vremyojidrt.prop("required", false);
			$("[data-related-field=vremyojidrt]").removeClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");

			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");

			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");

			$("[data-related-field=plandaterazm]").closest(".row-container").show();
			$("[data-related-field=plandaterazm]").addClass("label-required");
			plandaterazm.closest(".row-container").show();
			plandaterazm.prop("required", true);

			$("[data-related-field=poryadokpodzayrt]").addClass("label-required");
			poryadokpodzayrt.prop("required", true);
			$("[data-related-field=porrasmzayrt]").removeClass("label-required");
			porrasmzayrt.prop("required", false);
			$("[data-related-field=porpodvitogrt]").removeClass("label-required");
			porpodvitogrt.prop("required", false);
			$("[data-related-field=porprovtorgrt]").removeClass("label-required");
			porprovtorgrt.prop("required", false);




			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			stepPercent.prop("required", false);
			$("[data-related-field=stepPercent]").removeClass("label-required");
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").closest(".column-container").show();
			$("[data-related-field=datenachprrt]").addClass("label-required");
			datenachprrt.closest(".column-container").show();
			datenachprrt.prop("required", true);
			zakldog.closest(".column-container").hide();
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
			svedToEIS.closest(".column-container").hide();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=daterassmrt]").removeClass("label-required");
			$("input[name='daterassmrt']").prop("required", false);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datetorgrt]").removeClass("label-required");
			$("input[name='datetorgrt']").prop("required", false);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datepoditogrt]").removeClass("label-required");
			$("input[name='datepoditogrt']").prop("required", false);
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").removeClass("label-required");
			$("input[name='dateokonprrt']").prop("required", false);
			$("[data-related-field=dateokonprrt]").hide();
			$("input[name='dateokonprrt']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)
		} else if (formTorg.val() == "Запрос цен (РТ)") {
			koefsn.closest(".column-container").show()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			reTorg.closest(".column-container").hide()
			poPosZak.closest(".column-container").hide()
			predlpovrt.closest(".column-container").hide()
			prUlCp.closest(".column-container").show()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)
			$("[data-related-field=daterassmrt]").removeClass("label-required")
			$("input[name='daterassmrt']").prop("required", false)
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().hide()
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().hide()
			$("[data-related-field=datetorgrt]").removeClass("label-required")
			$("input[name='datetorgrt']").prop("required", false)
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide()
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide()
			zayavkadvart.closest(".column-container").hide()
			$("[data-related-field=stepFromRT]").closest(".column-container").hide()
			stepFromRT.closest(".column-container").hide()
			stepFromRT.prop("required", false)
			$("div[data-related-field=stepFromRT]").removeClass("label-required")
			$("[data-related-field=stepToRT]").closest(".column-container").hide()
			stepToRT.closest(".column-container").hide()
			stepToRT.prop("required", false)
			$("div[data-related-field=stepToRT]").removeClass("label-required")
			$("[data-related-field=stepPercent]").closest(".column-container").hide()
			stepPercent.closest(".column-container").hide()
			stepPercent.prop("required", false);
			$("[data-related-field=stepPercent]").removeClass("label-required");
			$("[data-related-field=accredReason]").closest(".row-container").hide()
			accredReason.closest(".row-container").hide()
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide()
			vremyojidrt.closest(".column-container").hide()
			vremyojidrt.prop("required", false)
			$("[data-related-field=vremyojidrt]").removeClass("label-required")
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide()
			vremyojidpervrt.closest(".column-container").hide()
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide()
			vremyojiddoprt.closest(".column-container").hide()
			vremyojiddoprt.prop("required", false)
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required")
			zakldog.closest(".column-container").hide()
			svedToEIS.closest(".column-container").show()
			
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().show()
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().show()
			$("[data-related-field=dateokonprrt]").addClass("label-required")
			$("input[name='dateokonprrt']").prop("required", true)
			$("[data-related-field=dateokonprrt]").show()
			$("input[name='dateokonprrt']").closest(".column-container").show()
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show()
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show()
			$("[data-related-field=datepoditogrt]").addClass("label-required")
			$("input[name='datepoditogrt']").prop("required", true)
			$("[data-related-field=datenachprrt]").closest(".column-container").show()
			$("[data-related-field=datenachprrt]").addClass("label-required")
			datenachprrt.closest(".column-container").show()
			datenachprrt.prop("required", true)
			$("[data-related-field=plandaterazm]").closest(".row-container").show()
			$("[data-related-field=plandaterazm]").addClass("label-required")
			plandaterazm.closest(".row-container").show()
			plandaterazm.prop("required", true)
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
		}
		else {
			$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
			vremyojidrt.closest(".column-container").hide();
			vremyojidrt.prop("required", false);
			$("[data-related-field=vremyojidrt]").removeClass("label-required");
			$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
			vremyojidpervrt.closest(".column-container").hide();
			$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
			vremyojiddoprt.closest(".column-container").hide();
			vremyojiddoprt.prop("required", false);
			$("[data-related-field=vremyojiddoprt]").removeClass("label-required");

			$("[data-related-field=stepFromRT]").closest(".column-container").hide();
			stepFromRT.closest(".column-container").hide();
			stepFromRT.prop("required", false);
			$("div[data-related-field=stepFromRT]").removeClass("label-required");

			$("[data-related-field=stepToRT]").closest(".column-container").hide();
			stepToRT.closest(".column-container").hide();
			stepToRT.prop("required", false);
			$("div[data-related-field=stepToRT]").removeClass("label-required");

			$("[data-related-field=plandaterazm]").removeClass("label-required");
			$("[data-related-field=plandaterazm]").closest(".row-container").hide();
			plandaterazm.prop("required", false);
			plandaterazm.closest(".row-container").hide();

			$("[data-related-field=poryadokpodzayrt]").removeClass("label-required");
			poryadokpodzayrt.prop("required", false);
			$("[data-related-field=porrasmzayrt]").removeClass("label-required");
			porrasmzayrt.prop("required", false);
			$("[data-related-field=porpodvitogrt]").removeClass("label-required");
			porpodvitogrt.prop("required", false);


			$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
			dateregtorgrt.closest(".column-container").hide();
			$("[data-related-field=dateregtorgrt]").removeClass("label-required");
			dateregtorgrt.prop("required", false);
			$("[data-related-field=stepPercent]").closest(".column-container").hide();
			stepPercent.closest(".column-container").hide();
			stepPercent.prop("required", false);
			$("[data-related-field=stepPercent]").removeClass("label-required");
			$("[data-related-field=accredReason]").closest(".row-container").hide();
			accredReason.closest(".row-container").hide();
			$("[data-related-field=datenachprrt]").removeClass("label-required");
			$("[data-related-field=datenachprrt]").closest(".column-container").hide();
			datenachprrt.prop("required", false);
			datenachprrt.closest(".column-container").hide();
			zakldog.closest(".column-container").hide();

			svedToEIS.closest(".column-container").hide();
			
			valdog.closest(".column-container").hide();
			$("[data-related-field=valdog]").closest(".column-container").hide();
			reTorg.closest(".column-container").hide();
			poPosZak.closest(".column-container").hide();
			koefsn.closest(".column-container").hide()
			$("[data-related-field=koefsn]").removeClass("label-required")
			$("input[name='koefsn']").prop("required", false)
			zayavkadvart.closest(".column-container").hide();
			predlpovrt.closest(".column-container").hide();
			$("[data-related-field=dateokonprrt]").removeClass("label-required");
			$("input[name='dateokonprrt']").prop("required", false);
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=daterassmrt]").removeClass("label-required");
			$("input[name='daterassmrt']").prop("required", false);
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datetorgrt]").removeClass("label-required");
			$("input[name='datetorgrt']").prop("required", false);
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datepoditogrt]").removeClass("label-required");
			$("input[name='datepoditogrt']").prop("required", false);
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadrasmfirstzay]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoksecondpod]").closest("fieldset").parent().parent().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			// $("[data-related-field=poryadokprovkvaloybr]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobshar]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonobspredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadoknachpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=poryadokprovsopost]").closest("fieldset").parent().parent().hide();
			$("input[name='predkvalotbr']").closest(".column-container").hide();
			$("input[name='obsfuncfar']").closest(".column-container").hide();
			$("input[name='obspredlofuncfar']").closest(".column-container").hide();
			$("input[name='okonpredl']").closest(".column-container").hide();
			$("input[name='doppredl']").closest(".column-container").hide();
			$("input[name='sopostcenpredl']").closest(".column-container").hide();
			prUlCp.closest(".column-container").hide()
			$("[data-related-field=prUlCp]").removeClass("label-required")
			$("input[name='prUlCp']").prop("required", false)
		}
	}

	IzmenenieReg();
	IzmenenieEdit();
}

$(document).on('change', "input[data-field-name='formTorg']", function (e) {
	rtkhide();
});


function stepRT() {

	var step = $("input[name='valdog']");
	if ($(step).is(":checked")) {
		$("div[data-related-field='stepFromRT']").attr("data-label-name", "Шаг ценовых предложений от, в валюте договора");
		$("div[data-related-field='stepFromRT']").find('label').text("Шаг ценовых предложений от, в валюте договора");
		$("div[data-related-field='stepToRT']").attr("data-label-name", "Шаг ценовых предложений до, в валюте договора");
		$("div[data-related-field='stepToRT']").find('label').text("Шаг ценовых предложений до, в валюте договора");
	} else {
		$("div[data-related-field='stepFromRT']").attr("data-label-name", "Шаг ценовых предложений от, в %");
		$("div[data-related-field='stepToRT']").attr("data-label-name", "Шаг ценовых предложений до, в %");
		$("div[data-related-field='stepFromRT']").find('label').text("Шаг ценовых предложений от, в %");
		$("div[data-related-field='stepToRT']").find('label').text("Шаг ценовых предложений до, в %");
	}

}

$(document).on('change', "input[data-field-name='valdog']", function (e) {
	stepRT();
});

function CheckboxReadonly() {
	let koefsn = $("input[name='koefsn']");
	let predlpovrt = $("input[name='predlpovrt']");
	if (koefsn.is(":checked")) {
		predlpovrt.attr('disabled', true);
		predlpovrt.prop('checked', false);
	} else {
		predlpovrt.attr('disabled', false);
	}
}

$(document).on('change', "input[data-field-name='koefsn']", function (e) {
	CheckboxReadonly();
});


function dvechasti() {
	let formTorg = $("input[name='formTorgName']");
	let zayavkadvart = $("input[name='zayavkadvart']");
	if ((formTorg.val() == "Аукцион на повышение (РТ)") && $(zayavkadvart).is(":checked")) {
		$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().show();
	} else if ((formTorg.val() == "Аукцион на повышение (РТ)") && !$(zayavkadvart).is(":checked")) {
		$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().hide();
	}
}

$(document).on('change', "input[data-field-name='zayavkadvart']", function (e) {
	dvechasti();
});


function dvechastiView() {
	let formTorgText = $(".documentView-field-value[data-name='Форма торгов']").text();
	let zayavkadvart = $("div[data-name='Заявка в двух частях']").find("input[type='checkbox']");
		if ((formTorgText == "Аукцион на повышение (РТ)") && ($(zayavkadvart).is(":checked"))) {
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		} else if ((formTorgText == "Аукцион на повышение (РТ)") && (!$(zayavkadvart).is(":checked"))) {
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
		}
}

// скрытае полей РТК после смены значения в поле "Наименование ЭТП" на регистрацию и редактирование
function rtkhideall() {
	var naimETP = $("input[name='naimETP']");
	var zakldog = $("input[name='zakldog']");
	var vremyojidrt = $("input[name='vremyojidrt']");
	var vremyojidpervrt = $("input[name='vremyojidpervrt']");
	var vremyojiddoprt = $("input[name='vremyojiddoprt']");
	var vremyojid = $("input[name='vremyojid']");
	var stepFrom = $("input[name='stepFrom']");
	var stepTo = $("input[name='stepTo']");
	var step = $("input[name='step']");

	var svedToEIS = $("input[name='svedToEIS']");
	
	var valdog = $("input[name='valdog']");
	var stepToRT = $("input[name='stepToRT']");
	var stepFromRT = $("input[name='stepFromRT']");
	var plandaterazm = $("input[name='plandaterazm']");
	var reTorg = $("input[name='reTorg']");
	var poPosZak = $("input[name='poPosZak']");
	var koefsn = $("input[name='koefsn']");
	var dateregtorgrt = $("input[name='dateregtorgrt']");
	var stepPercent = $("input[name='stepPercent']");
	var accredReason = $("input[name='accredReason']");
	var datenachprrt = $("input[name='datenachprrt']");
	var mestorasmrt = $("textarea[name='mestorasmrt']");
	var mestoprovtorgrt = $("textarea[name='mestoprovtorgrt']");
	var zayavkadvart = $("input[name='zayavkadvart']");
	var predlpovrt = $("input[name='predlpovrt']");
	var prUlCp = $("input[name='prUlCp']");
	var poryadokpodzayrt = $("textarea[name='poryadokpodzayrt']");
	var porrasmzayrt = $("textarea[name='porrasmzayrt']");
	var porprovtorgrt = $("textarea[name='porprovtorgrt']");
	var porpodvitogrt = $("textarea[name='porpodvitogrt']");
	
	var mestorasmpredl = $("textarea[name='mestorasmpredl']");
	var dateokonpod = $("input[name='dateokonpod']");
	var datevskrkonv = $("input[name='datevskrkonv']");
	var porvskrkonv = $("textarea[name='porvskrkonv']");
	var daterassm = $("input[name='daterassm']");
	var datetorg = $("input[name='datetorg']");
	var datepoditog = $("input[name='datepoditog']");

	if (naimETP.val() != 'АО "РТ-ЕЭТП"') {
		$("[data-related-field=vremyojidrt]").closest(".column-container").hide();
		vremyojidrt.closest(".column-container").hide();
		vremyojidrt.prop("required", false);
		$("[data-related-field=vremyojidrt]").removeClass("label-required");
		$("[data-related-field=vremyojidpervrt]").closest(".column-container").hide();
		vremyojidpervrt.closest(".column-container").hide();
		$("[data-related-field=vremyojiddoprt]").closest(".column-container").hide();
		vremyojiddoprt.closest(".column-container").hide();
		vremyojiddoprt.prop("required", false);
		$("[data-related-field=vremyojiddoprt]").removeClass("label-required");
		$("[data-related-field=stepFromRT]").closest(".column-container").hide();
		stepFromRT.closest(".column-container").hide();
		stepFromRT.prop("required", false);
		$("div[data-related-field=stepFromRT]").removeClass("label-required");
		$("[data-related-field=stepToRT]").closest(".column-container").hide();
		stepToRT.closest(".column-container").hide();
		stepToRT.prop("required", false);
		$("div[data-related-field=stepToRT]").removeClass("label-required");
		$("[data-related-field=plandaterazm]").closest(".column-container").hide();
		plandaterazm.closest(".column-container").hide();
		$("[data-related-field=vremyojid]").closest(".column-container").hide();
		vremyojid.closest(".column-container").hide();
		$("[data-related-field='stepFrom']").closest(".column-container").hide();
		$("[data-related-field='stepFrom']").removeClass("label-required");
		stepFrom.closest(".column-container").hide();
		$("[data-related-field='stepTo']").closest(".column-container").hide();
		$("[data-related-field='stepTo']").removeClass("label-required");
		stepTo.closest(".column-container").hide();
		$("[data-related-field=step]").closest(".column-container").hide();
		step.closest(".column-container").hide();


		$("[data-related-field=dateregtorgrt]").closest(".column-container").hide();
		dateregtorgrt.closest(".column-container").hide();
		$("[data-related-field=dateregtorgrt]").removeClass("label-required");
		dateregtorgrt.prop("required", false);
		$("[data-related-field=stepPercent]").closest(".column-container").hide();
		stepPercent.closest(".column-container").hide();
		stepPercent.prop("required", false);
		$("[data-related-field=stepPercent]").removeClass("label-required");
		$("[data-related-field=accredReason]").closest(".column-container").hide();
		accredReason.closest(".column-container").hide();
		$("[data-related-field=datenachprrt]").removeClass("label-required");
		datenachprrt.prop("required", false);
		$("[data-related-field=datenachprrt]").closest(".column-container").hide();
		datenachprrt.closest(".column-container").hide();
		zakldog.closest(".column-container").hide();

		svedToEIS.closest(".column-container").hide();
		
		valdog.closest(".column-container").hide();
		$("[data-related-field=valdog]").closest(".column-container").hide();
		reTorg.closest(".column-container").hide();
		poPosZak.closest(".column-container").hide();
		koefsn.closest(".column-container").hide();
		zayavkadvart.closest(".column-container").hide();
		//predlpovrt.closest(".column-container").hide();
		prUlCp.closest(".column-container").hide();
		prUlCp.prop('checked', false);
		$("[data-related-field=dateokonprrt]").removeClass("label-required");
		$("input[name='dateokonprrt']").prop("required", false);
		$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonprrt]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=daterassmrt]").removeClass("label-required");
		$("input[name='daterassmrt']").prop("required", false);
		$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassmrt]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datetorgrt]").removeClass("label-required");
		$("input[name='datetorgrt']").prop("required", false);
		$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorgrt]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datepoditogrt]").removeClass("label-required");
		$("input[name='datepoditogrt']").prop("required", false);
		$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoditogrt]").closest("fieldset").parent().parent().hide();

		$("[data-related-field=plandaterazm]").removeClass("label-required");
		$("[data-related-field=plandaterazm]").closest(".row-container").hide();
		plandaterazm.prop("required", false);
		plandaterazm.closest(".row-container").hide();

		$("[data-related-field=poryadokpodzayrt]").removeClass("label-required");
		poryadokpodzayrt.prop("required", false);
		$("[data-related-field=porrasmzayrt]").removeClass("label-required");
		porrasmzayrt.prop("required", false);
		$("[data-related-field=porpodvitogrt]").removeClass("label-required");
		porpodvitogrt.prop("required", false);
		$("[data-related-field=porprovtorgrt]").removeClass("label-required");
		porprovtorgrt.prop("required", false);

	}
	else {
		mestorasmpredl.prop("required", false);
		$("[data-related-field=mestorasmpredl]").removeClass("label-required");
		porvskrkonv.prop("required", false);
		$("[data-related-field=porvskrkonv]").removeClass("label-required");
		dateokonpod.prop("required", false);
		$("[data-related-field=dateokonpod]").removeClass("label-required");
		datevskrkonv.prop("required", false);
		$("[data-related-field=datevskrkonv]").removeClass("label-required");
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		datetorg.prop("required", false);
		$("[data-related-field=datetorg]").removeClass("label-required");
		datepoditog.prop("required", false);
		$("[data-related-field=datepoditog]").removeClass("label-required");
	}

}

function naizmnameETP() { 
$(document).on('change', "input[data-field-name='naimETP']", function (e) {

	//$("input[name='accessType']").val('Для всех');    // Меняю тип доступа при смене площадки(т.к. список в справочнике разница у разных площадок)
	//$("input[data-field-name='accessType']").val('Для всех'); // Меняю тип доступа при смене площадки(т.к. список в справочнике разница у разных площадок)
	
	
	
	rtkhideall()
	hideProcedure()
	FilterOrg()
	showEditKvalOtbor()
	NDACheck()		
	})
	longSrokProcedure()
	MaxCountQuery()
	porRassmZa()
}	
// отображение полей РТК в зависимости от формы торгов на просмотр
function rtkhideview() {
	var naimETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var formTorg = $("div[data-name='Форма торгов']");
	var formTorgText = $(".documentView-field-value[data-name='Форма торгов']").text();

	if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Аукцион на повышение (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").show();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").show();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").show();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").show();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Открытый аукцион (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").show();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").show();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").show();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").show();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").show();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Открытый конкурс (РТ)") || (formTorgText == "Открытый запрос предложений (РТ)") || (formTorgText == "Открытый запрос котировок (РТ)") || (formTorgText == "Упрощенная закупка (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").show();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").show();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").show();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").show();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Запрос RFI (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Квалификационный отбор (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").show();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").show();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();;
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();;
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Конкурентный отбор со стартовой ценой (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").show();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").show();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Предквалификационный отбор (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").hide();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").show();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Аккредитационный отбор (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").show();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	} else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Подтверждение стандартных условий (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show();
		$("div[data-name='Срок заключения договора']").closest(".column-container").show();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
	}
	else if ((naimETP == "АО &quot;РТ-ЕЭТП&quot;") && (formTorgText == "Запрос цен (РТ)")) {
		$("div[data-name='Наименование процедуры']").closest(".column-container").show()
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide()
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide()
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide()
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide()
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").show()
		$("div[data-name='Срок заключения договора']").closest(".column-container").show()
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide()
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide()
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide()
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide()
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide()
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide()
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide()
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide()
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").show()
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show()
		$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show()
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide()
		$("div[data-name='Коэффициент снижения']").closest(".column-container").show()
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide()
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide()
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide()
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide()
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide()
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide()
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide()
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").show()
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide()
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide()
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").show()
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide()
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide()
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide()
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide()
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().show()
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide()
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide()
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().show()
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide()
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide()
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide()
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide()
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide()
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide()
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide()
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide()
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide()
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide()
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide()
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide()
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide()
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide()
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide()
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide()
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide()
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide()
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide()
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide()
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide()
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide()
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide()
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide()
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide()
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide()
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide()
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide()
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide()
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide()
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").show()
	} else {
		$("div[data-name='Наименование процедуры']").closest(".column-container").hide();
		$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
		$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
		$("div[data-name='Планируемая дата размещения']").closest(".column-container").hide();
		$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
		$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
		$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
		$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
		$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
		$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").show();
		//$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").hide();
		$("div[data-name='Закупка в электронной форме']").closest(".column-container").hide();
		//$("div[data-name='Доступ к процедуре']").closest(".column-container").hide();
		$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").hide();
		$("div[data-name='Перечень ПКО']").closest(".column-container").hide();
		$("div[data-api-table-name='Список заявителей с доступом к процедуре']").hide();
		$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
		$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
		$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
		$("div[data-name='Дата регистрации участников торгов']").closest(".column-container").hide();
		$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
		$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
		$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
		$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
		$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
		$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
		$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
		$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
		$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
		$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
		$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").prev().closest(".column-container").hide();
		$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
		$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
		$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
		$("div[data-name='Прием улучшенных ЦП']").closest(".column-container").hide()
    }
}

function rtkcheckview() {
	let step = $("div[data-name='Шаг ценовых предложений в валюте']").find("input[type='checkbox']");
	if ($(step).attr("checked")) {
		$("div[data-name='Шаг ценовых предложений (от)'] > .documentView-field-label").text('Шаг ценовых предложений (от), в валюте договора');
		$("div[data-name='Шаг ценовых предложений (до)'] > .documentView-field-label").text('Шаг ценовых предложений (до), в валюте договора');
	} else {
		$("div[data-name='Шаг ценовых предложений (от)'] > .documentView-field-label").text('Шаг ценовых предложений (от), в %');
		$("div[data-name='Шаг ценовых предложений (до)'] > .documentView-field-label").text('Шаг ценовых предложений (до), в %');
	}
}

//Закупка в электронной форме на регистрацию
var hideetpreg = function() {
    var zakelform = $("input[name='zakelform']");
    var naimETP = $("input[name='naimETP']");
	var naimETPName = $("input[name='naimETPName']");
	var naimETPID = $("input[name='naimETPID']");
	var formTorg = $("input[name='formTorgName']");	
	var step=$("input[data-field-name='step']");
	if ($(zakelform).is(":checked")) {
		$("input[name='mestorasm']").parent().parent().attr("class", "column-container col-xs-6")
		naimETP.closest(".clearfix").find(".dict-display-field").prop("required", true);
		naimETP.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=naimETP]").show();
		$("[data-related-field=naimETP]").addClass("label-required");
		naimETPName.prop("required", true);
		naimETPName.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=naimETPName]").show();
		$("[data-related-field=naimETPName]").addClass("label-required");
		naimETP.closest(".column-container").show();
		naimETPName.closest(".column-container").show();
		formTorg.closest(".column-container").show();	
		$("[data-related-field=formTorg]").closest(".column-container").show();
		$("input[name='maxZapros']").closest(".column-container").show();
		$("[data-related-field=maxZapros]").closest(".column-container").show();
		$("input[data-field-name='formTorg']").prop('required', true); // перенесено из hideKPblocksedit
		$("[data-related-field=formTorg]").addClass("label-required");
		if ((formTorg.val()=="Аукцион на повышение") || (formTorg.val()=="Аукцион") || (formTorg.val()=="Аукцион по размещению нестационарных торговых объектов/Аукцион на право заключения договора на размещение семейного (родового) захоронения") || (formTorg.val()=="Торги тест "))	{		
			if (naimETPID.val() != 1){
				$("input[name='vremyojid']").prop("required", true);
				$("input[name='stepFrom']").prop("required", true);
				$("input[name='stepTo']").prop("required", true);
				$("[data-related-field=vremyojid]").addClass("label-required");
				$("[data-related-field=vremyojid]").closest(".row-container").show();
				$("[data-related-field=vremyojid]").closest(".column-container").show();
				$("input[name='vremyojid']").closest(".column-container").show();
				$("input[name='stepFrom']").closest(".column-container").show();
				$("input[name='stepTo']").closest(".row-container").show();
				$("input[name='stepTo']").closest(".column-container").show();
				$("input[data-field-name='step']").closest(".column-container").show();
				$("[data-related-field='stepFrom']").closest(".column-container").show();
				$("[data-related-field='stepTo']").closest(".row-container").show();
				$("[data-related-field='stepTo']").closest(".column-container").show();
				$("[data-related-field=step]").closest(".column-container").show();
				$("[data-related-field='stepFrom']").addClass("label-required");
				$("[data-related-field='stepTo']").addClass("label-required");
			}
			$("input[name='MaxCountQuery']").closest(".column-container").show();
			$("[data-related-field='MaxCountQuery']").closest(".column-container").show();
			if ($(step).is(":checked")) {
				$("div[data-related-field='stepFrom']").attr("data-label-name", "Шаг ценовых предложений от, в валюте договора");
				$("div[data-related-field='stepFrom']").find('label').text("Шаг ценовых предложений от, в валюте договора");
				$("div[data-related-field='stepTo']").attr("data-label-name", "Шаг ценовых предложений до, в валюте договора");
				$("div[data-related-field='stepTo']").find('label').text("Шаг ценовых предложений до, в валюте договора");
				var item = $("input[name='stepFrom']");
				item.autoNumeric('update', {
					aSep: '',
					aDec: '.',
					vMin: '0.00',
					vMax: "99999999999999999999999999999999999999999.99",
					mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '2',
					wEmpty: '',
					mRound: 'B'
				});
				
				var item2 = $("input[name*='stepTo']");
				item2.autoNumeric('update', {
					aSep: '',
					aDec: '.',
					vMin: '0.00',
					vMax: "99999999999999999999999999999999999999999.99",
					mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '2',
					wEmpty: '',
					mRound: 'B'
				});
			} else {
				$("div[data-related-field='stepFrom']").attr("data-label-name", "Шаг ценовых предложений от, в %");
				$("div[data-related-field='stepTo']").attr("data-label-name", "Шаг ценовых предложений до, в %");
				$("div[data-related-field='stepFrom']").find('label').text("Шаг ценовых предложений от, в %");
				$("div[data-related-field='stepTo']").find('label').text("Шаг ценовых предложений до, в %");
				var item = $("input[name='stepFrom']");
				item.autoNumeric('update', {
					aSep: '',
					aDec: '.',
					vMin: '0.0000',
					vMax: "99999999999999999999999999999999999999999.9999",
					mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
					wEmpty: '',
					mRound: 'B'
				});
				
				var item2 = $("input[name*='stepTo']");
				item2.autoNumeric('update', {
					aSep: '',
					aDec: '.',
					vMin: '0.0000',
					vMax: "99999999999999999999999999999999999999999.9999",
					mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '4',
					wEmpty: '',
					mRound: 'B'
				});
			}
		} else {
			$("input[name='vremyojid']").closest(".column-container").hide();
			$("input[name='stepFrom']").closest(".column-container").hide();
			$("input[name='stepTo']").closest(".row-container").hide();
			$("input[data-field-name='step']").closest(".column-container").hide();
			$("[data-related-field=vremyojid]").closest(".column-container").hide();
			$("[data-related-field='stepFrom']").closest(".column-container").hide();
			$("[data-related-field='stepTo']").closest(".row-container").hide();
			$("[data-related-field=step]").closest(".column-container").hide();
			$("input[name='vremyojid']").prop("required", false);
			$("input[name='stepFrom']").prop("required", false);
			$("input[name='stepTo']").prop("required", false);
		    $("[data-related-field=vremyojid]").removeClass("label-required");
		    $("[data-related-field='stepFrom']").removeClass("label-required");
			$("[data-related-field='stepTo']").removeClass("label-required");
		}
    } else{
		naimETPName.val("");
		naimETPID.val("");
		naimETP.val("");
		naimETP.closest(".clearfix").find(".dict-display-field").val("");
		naimETP.closest(".clearfix").find(".dict-display-field").prop("required", false);			
		naimETP.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=naimETP]").hide();
		$("[data-related-field=naimETP]").removeClass("label-required");
		naimETPName.prop("required", false);	
		naimETPName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=naimETPName]").hide();
		$("[data-related-field=naimETPName]").removeClass("label-required");
		naimETP.closest(".column-container").hide();
		naimETPName.closest(".column-container").hide();
		formTorg.closest(".column-container").hide();
		$("[data-related-field=formTorg]").hide();
		naimETP.change();
	}
	IzmenenieReg();
};

$(document).on('change', "input[data-field-name='vremyojid']", function (e) {
	var step=parseInt($("input[data-field-name='vremyojid']").val());
	if (step > 1440) {
        showCommonErrors('Время ожидания ценовых предложений не может превышать 1440 минут');
		$("input[data-field-name='vremyojid']").autoNumeric('wipe');	
	} 
});

// Закупка в электронной форме на редактирование
$(document).on('change', "input[data-field-name='formTorg']", function (e) {
	hideetpreg();
	longSrokProcedure()
	MaxCountQuery()
	porRassmZa()
});

$(document).on('change', "input[data-field-name='step']", function (e) {
	var step=$("input[data-field-name='step']");
	if ($(step).is(":checked")) {
		$("div[data-related-field='stepFrom']").attr("data-label-name", "Шаг ценовых предложений от, в валюте договора");
		$("div[data-related-field='stepFrom']").find('label').text("Шаг ценовых предложений от, в валюте договора");
		$("div[data-related-field='stepTo']").attr("data-label-name", "Шаг ценовых предложений до, в валюте договора");
		$("div[data-related-field='stepTo']").find('label').text("Шаг ценовых предложений до, в валюте договора");
		var item = $("input[name='stepFrom']");
		item.autoNumeric('update', {
			aSep: '',
			aDec: '.',
			vMin: '0.00',
			vMax: "99999999999999999999999999999999999999999.99",
			mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '2',
			wEmpty: '',
			mRound: 'B'
		});
		var item2 = $("input[name*='stepTo']");
		item2.autoNumeric('update', {
			aSep: '',
			aDec: '.',
			vMin: '0.00',
			vMax: "99999999999999999999999999999999999999999.99",
			mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '2',
			wEmpty: '',
			mRound: 'B'
		});
		} else {
		$("div[data-related-field='stepFrom']").attr("data-label-name", "Шаг ценовых предложений от, в %");
		$("div[data-related-field='stepTo']").attr("data-label-name", "Шаг ценовых предложений до, в %");
		$("div[data-related-field='stepFrom']").find('label').text("Шаг ценовых предложений от, в %");
		$("div[data-related-field='stepTo']").find('label').text("Шаг ценовых предложений до, в %");
		var item = $("input[name='stepFrom']");
		item.autoNumeric('update', {
			aSep: '',
			aDec: '.',
			vMin: '0.0000',
			vMax: "99999999999999999999999999999999999999999.9999",
			mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
			wEmpty: '',
			mRound: 'B'
		});
		var item2 = $("input[name*='stepTo']");
		item2.autoNumeric('update', {
			aSep: '',
			aDec: '.',
			vMin: '0.0000',
			vMax: "99999999999999999999999999999999999999999.9999",
			mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '4',
			wEmpty: '',
			mRound: 'B'
		});
	}
});

$(document).on('change', "input[name='stepFrom']", function (e) {
	var step=$("input[data-field-name='step']");
	var stepFrom = $("input[data-field-name='stepFrom']").autoNumeric('get');
	if (!$(step).is(":checked")) {
		if (stepFrom < 0.0001 || stepFrom > 15.0000){
		showCommonErrors('Поле "Шаг ценовых предложений от, в %" не может быть меньше 0.0001 и не может быть больше 15.0000');
		$("input[data-field-name='stepFrom']").autoNumeric('wipe');
		}
	} else {
		if (stepFrom < 0.01){
			showCommonErrors('Поле "Шаг ценовых предложений от, в валюте договора" не может быть меньше 0.01');
			$("input[data-field-name='stepFrom']").autoNumeric('wipe');
		}
	}
});

$(document).on('change', "input[name='stepTo']", function (e) {
	var step=$("input[data-field-name='step']");
	var stepTo = $("input[data-field-name='stepTo']").autoNumeric('get');
	if (!$(step).is(":checked")) {
		if (stepTo < 0.0001 || stepTo > 50.0000){
		showCommonErrors('Поле "Шаг ценовых предложений до, в %" не может быть меньше 0.0001 и не может быть больше 50.0000');
		$("input[data-field-name='stepTo']").autoNumeric('wipe');
		}
	} else {
		if (stepTo < 0.01){
			showCommonErrors('Поле "Шаг ценовых предложений до, в валюте договора" не может быть меньше 0.01');
			$("input[data-field-name='stepTo']").autoNumeric('wipe');
		}
	}
});

$(document).on('change', "input[name='vremyojid']", function (e) {
	var vremyojid=$("input[data-field-name='vremyojid']");
	var vremyojid = $("input[data-field-name='vremyojid']").autoNumeric('get');
	if (vremyojid < 1 || vremyojid > 1400){
		showCommonErrors('Поле "Время ожидания ценовых предложений (минут)" не может быть меньше 1 и не может быть больше 1400');
		$("input[data-field-name='vremyojid']").autoNumeric('wipe');
	}
});

//Закупка в электронной форме на просмотр
var hideetpview = function () {
	var zakelform = $("div[data-name='Закупка в электронной форме']").find("input[type='checkbox']");
	var step = $("div[data-name='Шаг ценовых предложений в валюте договора']").find("input[type='checkbox']");
	var porrasmZa = $(".documentView-field-value[data-name='Порядок рассмотрения заявок']").text()
	var naimETP = $("div[data-name='Наименование ЭТП']");
	var naimETPName = $("div[data-name='Адрес ЭТП']");
	var formTorg = $("div[data-name='Форма торгов']");
	var formTorgText = $(".documentView-field-value[data-name='Форма торгов']").text();
	var test123 = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var por = $(".documentView-field-value[data-name='Порядок рассмотрения  заявок']").text();
	var vskrkonv = $("div[data-name='Этап вскрытие конвертов']").find("input[type='checkbox']");
	var second = $("div[data-name='Этап рассмотрения 2х частей']").find("input[type='checkbox']");
	var podvitog = $("div[data-name='Этап подведения итогов']").find("input[type='checkbox']");
	var rasmzav = $("div[data-name='Этап рассмотрение заявок']").find("input[type='checkbox']");
	var kvalotb = $("div[data-name='Этап квалификационного отбора']").find("input[type='checkbox']");
	var NereglZak = $("div[data-name='Нерегламентная закупка']").find("input[type='checkbox']");
	var funchar = $("div[data-name='Этап обсуждения функциональных характеристик']").find("input[type='checkbox']");
	var okonpred = $("div[data-name='Этап подачи окончательных предложений']").find("input[type='checkbox']");
	var soppred = $("div[data-name='Этап сопоставления ценовых предложений']").find("input[type='checkbox']");
	var predfunc = $("div[data-name='Этап обсуждения предложений о функ. характеристиках']").find("input[type='checkbox']");
	var dopcen = $("div[data-name='Этап подачи доп. ценовых предложений']").find("input[type='checkbox']");
	var DefaultHide = ['Требуется плата за предоставление документации', 'Сумма оплаты за документацию', 'Сроки и порядок внесения платы', 'Валюта платежа', 'Дата и время окончания срока подачи предложений', 'Дата окончания срока подачи предложений'];
	
	ViewfiledHide(DefaultHide); // скрываем по умолчанию
	LegendAndEmptyRowHide(['Дополнительная информация', 'Подача предложений о цене', 'Дополнительные этапы']);
	
	if (!$(zakelform).attr("checked")) {
		hideViewElementColumn(naimETP);
		hideViewElementColumn(naimETPName);
		hideViewElementColumn(formTorg);
		
		//$("div[data-name='Максимальное количество запросов от одного участника']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
		$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
		$("li:has(:contains('Порядок проведения'))").hide();
	} 
	else {
		showViewElementColumn(naimETP);
		showViewElementColumn(naimETPName);
		showViewElementColumn(formTorg);
		//$("div[data-name='Максимальное количество запросов от одного участника']").closest(".column-container").show();
		if ((test123 == 'АО "ЕЭТП"') && ((formTorgText == "Аукцион на повышение") || (formTorgText == "Аукцион"))) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Рамочная закупка']);
			if (!$(NereglZak).attr("checked")) {
				ViewfiledHide(['Подписание договора ЭП заказчика']);
			}
			$("div fieldset legend:contains('Приём заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Приём заявок')").closest(".column-container").prev().hide();
			$("[id='regcard-view-RasmZav']").find("fieldset:contains('Рассмотрение заявок')").closest(".column-container").show();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").show();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения предложений']").closest(".column-container").show();
			$("div[data-name='Место проведения торгов']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения заявок']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
			$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
			$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
			$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
			$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
			$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
			$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
			$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").hide();
			$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
			$("div[data-name='Наименование процедуры']").closest(".column-container").hide();
			$("div[data-name='Планируемая дата размещения']").closest(".column-container").hide();
			$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
			$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
			$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").show();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			if ($(step).attr("checked")) {
				$("div[data-related-field='stepFrom']").attr("data-label-name", "Шаг ценовых предложений от, в валюте договора");
				$("div[data-related-field='stepFrom']").find('label').text("Шаг ценовых предложений от, в валюте договора");
				$("div[data-related-field='stepTo']").attr("data-label-name", "Шаг ценовых предложений до, в валюте договора");
				$("div[data-related-field='stepTo']").find('label').text("Шаг ценовых предложений до, в валюте договора");
				} else {
				$("div[data-related-field='stepFrom']").attr("data-label-name", "Шаг ценовых предложений от, в %");
				$("div[data-related-field='stepTo']").attr("data-label-name", "Шаг ценовых предложений до, в %");
				$("div[data-related-field='stepFrom']").find('label').text("Шаг ценовых предложений от, в %");
				$("div[data-related-field='stepTo']").find('label').text("Шаг ценовых предложений до, в %");
			} 
			if ($(vskrkonv).attr("checked")) {
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").show();
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().show();
				$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").show();
				$("div[data-name='Место вскрытия конвертов']").closest(".column-container").show();
				$("div[data-name='Порядок вскрытия конвертов']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
				$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").hide();
				$("div[data-name='Место вскрытия конвертов']").closest(".column-container").hide();
				$("div[data-name='Порядок вскрытия конвертов']").closest(".column-container").hide();
			}
			if ($(podvitog).attr("checked") || porrasmZa=='Заявки в двух частях (аналогично 94-ФЗ)') {
				$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
				$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
				$("div[data-name='Дата подведения итогов']").closest(".column-container").show();
				$("div[data-name='Место подведения итогов']").closest(".column-container").show();
				$("div[data-name='Порядок подведения итогов']").closest(".column-container").show();
				$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
				$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			} else {
				$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
				$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
				$("div[data-name='Дата подведения итогов']").closest(".column-container").hide();
				$("div[data-name='Место подведения итогов']").closest(".column-container").hide();
				$("div[data-name='Порядок подведения итогов']").closest(".column-container").hide();
			}
			if(porrasmZa=='Заявки в двух частях (аналогично 94-ФЗ)'){
				$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
				$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			}
			else{
				$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").show();
				$("div[data-name='Этап подведения итогов']").closest(".column-container").show();
			}
		} 
		else if ((test123 == 'АО "ЕЭТП"') && (formTorgText == "Конкурс")) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Рамочная закупка', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']);
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").show();
			$("div[data-name='Этап рассмотрения 2х частей']").closest(".column-container").hide();
			$("div[data-name='Место рассмотрения предложений']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
			$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
			$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
			$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
			$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
			$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
			$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").show();
			$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").hide();
			$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
			$("div[data-name='Наименование процедуры']").closest(".column-container").hide();
			$("div[data-name='Планируемая дата размещения']").closest(".column-container").hide();
			$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
			$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
			$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").show();
			$("div[data-name='Место вскрытия конвертов']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения заявок']").closest(".column-container").show();
			$("div[data-name='Место подведения итогов']").closest(".column-container").show();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").show();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().show();
			if ($(vskrkonv).attr("checked")) {
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").show();
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().show();
				$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").show();
				$("div[data-name='Место вскрытия конвертов']").closest(".column-container").show();
				$("div[data-name='Порядок вскрытия конвертов']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
				$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").hide();
				$("div[data-name='Место вскрытия конвертов']").closest(".column-container").hide();
				$("div[data-name='Порядок вскрытия конвертов']").closest(".column-container").hide();
			}
			if (porrasmZa=='Заявки в двух частях (аналогично 94-ФЗ)') {
				$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").show();
				$("div fieldset legend:contains('Рассмотрение 2х частей)").closest(".column-container").prev().show();
				$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").show();
				$("div[data-name='Дата направления 2х частей']").closest(".column-container").show();
				$("div[data-name='Порядок рассмотрения 2х частей']").closest(".column-container").show();
				$("div[data-name='Место рассмотрения 2х частей']").closest(".column-container").show();
				$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
				$("div[data-name='Дата направления 2х частей']").closest(".column-container").hide();
			} else {
				$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
				$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
				$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").hide();
				$("div[data-name='Дата направления 2х частей']").closest(".column-container").hide();
				$("div[data-name='Порядок рассмотрения 2х частей']").closest(".column-container").hide();
				$("div[data-name='Место рассмотрения 2х частей']").closest(".column-container").hide();
				$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").show();
			}
			if ($(okonpred).attr("checked")) {
				$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").show();
				$("div fieldset legend:contains('Начало подачи окончательных предложений)").closest(".column-container").prev().show();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").next().show();
				$("div[data-name='Дата начала подачи окончательных предложений']").closest(".column-container").show();
				$("div[data-name='Порядок начала подачи окончательных предложений']").closest(".column-container").show();
				$("div[data-name='Место начала подачи окончательных предложений']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
				$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").next().hide();
				$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").hide();
				$("div[data-name='Дата начала подачи окончательных предложений']").closest(".column-container").hide();
				$("div[data-name='Порядок начала подачи окончательных предложений']").closest(".column-container").hide();
				$("div[data-name='Место начала подачи окончательных предложений']").closest(".column-container").hide();
			}
		} 
		else if ((test123 == 'АО "ЕЭТП"') && (formTorgText == "Запрос предложений") || (test123 == 'АО "ЕЭТП"') && (formTorgText == "Запрос котировок") || (test123 == 'АО "ЕЭТП"') && (formTorgText == "Квалификационный отбор")) {
			if (!$(NereglZak).attr("checked")) {
				ViewfiledHide(['Подписание договора ЭП заказчика']);
			}
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Рамочная закупка']);
			$("div[data-name='Место рассмотрения предложений']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
			$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
			$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
			$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
			$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
			$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
			$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
			$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").hide();
			$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
			$("div[data-name='Наименование процедуры']").closest(".column-container").hide();
			$("div[data-name='Планируемая дата размещения']").closest(".column-container").hide();
			$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
			$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
			$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").show();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").hide();
			$("div[data-name='Место вскрытия конвертов']").closest(".column-container").hide();
			$("div[data-name='Место рассмотрения заявок']").closest(".column-container").show();
			$("div[data-name='Место подведения итогов']").closest(".column-container").show();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
			$("div[data-name='Этап рассмотрения 2х частей']").closest(".column-container").hide();
			if ($(vskrkonv).attr("checked")) {
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").show();
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().show();
				$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").show();
				$("div[data-name='Место вскрытия конвертов']").closest(".column-container").show();
				$("div[data-name='Порядок вскрытия конвертов']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
				$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
				$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").hide();
				$("div[data-name='Место вскрытия конвертов']").closest(".column-container").hide();
				$("div[data-name='Порядок вскрытия конвертов']").closest(".column-container").hide();
			}
			if ($(rasmzav).attr("checked")) {
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").show();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().show();
				$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
				$("div[data-name='Место рассмотрения заявок']").closest(".column-container").show();
				$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").show();
				$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
				$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
			} else {
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
				$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
				$("div[data-name='Место рассмотрения заявок']").closest(".column-container").hide();
				$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").hide();
			}
			if(formTorgText == "Запрос предложений"){
				$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").show();
				$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").show();
			}
			else{
				$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
				$("div[data-name='Порядок рассмотрения заявок']").closest(".column-container").hide();
			}
			if ($(okonpred).attr("checked")) {
				$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").show();
				$("div fieldset legend:contains('Начало подачи окончательных предложений)").closest(".column-container").prev().show();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").next().show();
				$("div[data-name='Дата начала подачи окончательных предложений']").closest(".column-container").show();
				$("div[data-name='Порядок начала подачи окончательных предложений']").closest(".column-container").show();
				$("div[data-name='Место начала подачи окончательных предложений']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
				$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").next().hide();
				$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").hide();
				$("div[data-name='Дата начала подачи окончательных предложений']").closest(".column-container").hide();
				$("div[data-name='Порядок начала подачи окончательных предложений']").closest(".column-container").hide();
				$("div[data-name='Место начала подачи окончательных предложений']").closest(".column-container").hide();
			}
			if (porrasmZa=='Заявки в двух частях (аналогично 94-ФЗ)') {
				$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").show();
				$("div fieldset legend:contains('Рассмотрение 2х частей)").closest(".column-container").prev().show();
				$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").show();
				$("div[data-name='Дата направления 2х частей']").closest(".column-container").show();
				$("div[data-name='Порядок рассмотрения 2х частей']").closest(".column-container").show();
				$("div[data-name='Место рассмотрения 2х частей']").closest(".column-container").show();
				$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
				$("div[data-name='Дата направления 2х частей']").closest(".column-container").hide();
				$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").show();
				$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().show();
				$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
				$("div[data-name='Место рассмотрения заявок']").closest(".column-container").show();
				$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").show();
			}
		} 
		else if ((test123 == 'АО "ЕЭТП"') && (formTorgText == "Переторжка в заочной форме") || (formTorgText == "Переторжка в очной форме") || (formTorgText == "Закупка у единственного поставщика") || (formTorgText == "Аукцион на повышение в бумажной форме") || (formTorgText == "Аукцион на понижение в бумажной форме") || (formTorgText == "Конкурс в бумажной форме") || (formTorgText == "Запрос предложений в бумажной форме") || (formTorgText == "Запрос котировок в бумажной форме") || (formTorgText == "Попозиционная закупка") || (formTorgText == "Аукцион по размещению нестационарных торговых объектов") || (formTorgText == "Продажа посредством публичного предложения")) {
			hideallview();
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Рамочная закупка', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']);
		} 
		else if ((test123 == 'АО "ЕЭТП"') && (formTorgText == "Конкурентные переговоры")) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Рамочная закупка', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']);
			$("div[data-name='Место рассмотрения предложений']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
			$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
			$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
			$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
			$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
			$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
			$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
			$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
			$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
			$("div[data-name='Наименование процедуры']").closest(".column-container").hide();
			$("div[data-name='Планируемая дата размещения']").closest(".column-container").hide();
			$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
			$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
			$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").show();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения заявок']").closest(".column-container").show();
			$("div[data-name='Место подведения итогов']").closest(".column-container").show();
			$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();

		} 
		else if ((test123 == 'АО "ЕЭТП"') && (formTorgText == "Запрос о предоставлении ценовой информации")) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Рамочная закупка', 'Закупка осуществляется вследствие аварии или иных чрезвычайных ситуаций', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика', 'Указать отложенную дату начала приема заявок', 'Максимальное количество запросов от одного участника']);
			$("div[data-name='Место рассмотрения предложений']").closest(".column-container").show();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").show();
			$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
			$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
			$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
			$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
			$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
			$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
			$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
			$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
			$("div[data-name='Наименование процедуры']").closest(".column-container").hide();
			$("div[data-name='Планируемая дата размещения']").closest(".column-container").hide();
			$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
			$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
			$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Место рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Место подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").hide();
			$("div[data-name='Порядок рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
			$("li:has(:contains('Предоставление документации'))").hide();
		} 
		else if ((test123 == 'АО "МСП-ЕЭТП"') && (formTorgText == "Запрос предложений")) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Порядок рассмотрения заявок', 'Рамочная закупка', 'Основание для проведения закупки', 'Непубличная процедура', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']);
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").show();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().show();
			$("div[data-name='Дата начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок начала подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().show();
			$("div[data-name='Дата рассмотрения 1х частей']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения 1х частей']").closest(".column-container").show();
			$("div[data-name='Порядок рассмотрения 1х частей']").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().show();
			$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения 2х частей']").closest(".column-container").show();
			$("div[data-name='Порядок рассмотрения 2х частей']").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
			$("div[data-name='Дата подведения итогов']").closest(".column-container").show();
			$("div[data-name='Место подведения итогов']").closest(".column-container").show();
			$("div[data-name='Порядок подведения итогов']").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
			$("div[data-name='Дата начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Место начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Порядок начала срока подачи ценовых предложений']").closest(".column-container").hide();
			if ($(kvalotb).attr("checked")) {
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").show();
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().show();
				$("div[data-name='Дата проведения квалификационного отбора']").closest(".column-container").show();
				$("div[data-name='Место проведения квалификационного отбора']").closest(".column-container").show();
				$("div[data-name='Порядок проведения квалификационного отбора']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
				$("div[data-name='Дата проведения квалификационного отбора']").closest(".column-container").hide();
				$("div[data-name='Место проведения квалификационного отбора']").closest(".column-container").hide();
				$("div[data-name='Порядок проведения квалификационного отбора']").closest(".column-container").hide();
			}

		} 
		else if ((test123 == 'АО "МСП-ЕЭТП"') && (formTorgText == "Запрос котировок")) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Порядок рассмотрения заявок', 'Рамочная закупка', 'Основание для проведения закупки', 'Непубличная процедура', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']);
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().show();
			$("div[data-name='Дата начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок начала подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
			$("div[data-name='Дата рассмотрения 1х частей']").closest(".column-container").hide();
			$("div[data-name='Место рассмотрения 1х частей']").closest(".column-container").hide();
			$("div[data-name='Порядок рассмотрения 1х частей']").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
			$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").hide();
			$("div[data-name='Место рассмотрения 2х частей']").closest(".column-container").hide();
			$("div[data-name='Порядок рассмотрения 2х частей']").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
			$("div[data-name='Дата подведения итогов']").closest(".column-container").show();
			$("div[data-name='Место подведения итогов']").closest(".column-container").show();
			$("div[data-name='Порядок подведения итогов']").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Место рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
			$("div[data-name='Дата начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Место начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Порядок начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
			$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();

		} 
		else if ((test123 == 'АО "МСП-ЕЭТП"') && (formTorgText == "Аукцион")) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Порядок рассмотрения заявок', 'Рамочная закупка', 'Основание для проведения закупки', 'Непубличная процедура', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']);
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").show();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().show();
			$("div[data-name='Дата начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок начала подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().show();
			$("div[data-name='Дата рассмотрения 1х частей']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения 1х частей']").closest(".column-container").show();
			$("div[data-name='Порядок рассмотрения 1х частей']").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().show();
			$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения 2х частей']").closest(".column-container").show();
			$("div[data-name='Порядок рассмотрения 2х частей']").closest(".column-container").show();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").show();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().show();
			$("div[data-name='Дата начала срока подачи ценовых предложений']").closest(".column-container").show();
			$("div[data-name='Место начала срока подачи ценовых предложений']").closest(".column-container").show();
			$("div[data-name='Порядок начала срока подачи ценовых предложений']").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
			$("div[data-name='Дата подведения итогов']").closest(".column-container").show();
			$("div[data-name='Место подведения итогов']").closest(".column-container").show();
			$("div[data-name='Порядок подведения итогов']").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			if ($(kvalotb).attr("checked")) {
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").show();
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().show();
				$("div[data-name='Дата проведения квалификационного отбора']").closest(".column-container").show();
				$("div[data-name='Место проведения квалификационного отбора']").closest(".column-container").show();
				$("div[data-name='Порядок проведения квалификационного отбора']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
				$("div[data-name='Дата проведения квалификационного отбора']").closest(".column-container").hide();
				$("div[data-name='Место проведения квалификационного отбора']").closest(".column-container").hide();
				$("div[data-name='Порядок проведения квалификационного отбора']").closest(".column-container").hide();
			}

		} 
		else if ((test123 == 'АО "МСП-ЕЭТП"') && (formTorgText == "Конкурс")) {
			ViewfiledHide(['Требование подписания NDA', 'Конкурентный способ', 'Порядок рассмотрения заявок', 'Рамочная закупка', 'Основание для проведения закупки', 'Непубличная процедура', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']);
			$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
			$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
			$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
			$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
			$("div[data-name='Закупка в электронной форме']").closest(".column-container").show();
			$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").show();
			$("div[data-name='Этап квалификационного отбора']").closest(".column-container").show();
			$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").show();
			$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").show();
			$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").show();
			$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").show();
			$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").show();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().show();
			$("div[data-name='Дата начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место начала подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок начала подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").show();
			$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
			$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Место окончания подачи заявок']").closest(".column-container").show();
			$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().show();
			$("div[data-name='Дата рассмотрения 1х частей']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения 1х частей']").closest(".column-container").show();
			$("div[data-name='Порядок рассмотрения 1х частей']").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").show();
			$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().show();
			$("div[data-name='Дата рассмотрения 2х частей']").closest(".column-container").show();
			$("div[data-name='Место рассмотрения 2х частей']").closest(".column-container").show();
			$("div[data-name='Порядок рассмотрения 2х частей']").closest(".column-container").show();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
			$("div[data-name='Дата начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Место начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div[data-name='Порядок начала срока подачи ценовых предложений']").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().show();
			$("div[data-name='Дата подведения итогов']").closest(".column-container").show();
			$("div[data-name='Место подведения итогов']").closest(".column-container").show();
			$("div[data-name='Порядок подведения итогов']").closest(".column-container").show();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
			$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
			$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
			$("div[data-name='Дата начала подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Место начала подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Порядок начала подачи окончательных предложений']").closest(".column-container").hide();
			$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
			$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
			$("div[data-name='Дата окончания подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Место окончания подачи окончательных предложений']").closest(".column-container").hide();
			$("div[data-name='Порядок окончания подачи окончательных предложений']").closest(".column-container").hide();
			if ($(kvalotb).attr("checked")) {
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").show();
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().show();
				$("div[data-name='Дата проведения квалификационного отбора']").closest(".column-container").show();
				$("div[data-name='Место проведения квалификационного отбора']").closest(".column-container").show();
				$("div[data-name='Порядок проведения квалификационного отбора']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
				$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
				$("div[data-name='Дата проведения квалификационного отбора']").closest(".column-container").hide();
				$("div[data-name='Место проведения квалификационного отбора']").closest(".column-container").hide();
				$("div[data-name='Порядок проведения квалификационного отбора']").closest(".column-container").hide();
			}
			if ($(funchar).attr("checked")) {
				$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").show();
				$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().show();
				$("div[data-name='Дата начала обсуждения функциональных характеристик']").closest(".column-container").show();
				$("div[data-name='Место начала обсуждения функциональных характеристик']").closest(".column-container").show();
				$("div[data-name='Порядок начала обсуждения функциональных характеристик']").closest(".column-container").show();
				$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").show();
				$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().show();
				$("div[data-name='Дата окончания обсуждения функциональных характеристик']").closest(".column-container").show();
				$("div[data-name='Место окончания обсуждения функциональных характеристик']").closest(".column-container").show();
				$("div[data-name='Порядок окончания обсуждения функциональных характеристик']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
				$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
				$("div[data-name='Дата начала обсуждения функциональных характеристик']").closest(".column-container").hide();
				$("div[data-name='Место начала обсуждения функциональных характеристик']").closest(".column-container").hide();
				$("div[data-name='Порядок начала обсуждения функциональных характеристик']").closest(".column-container").hide();
				$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
				$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
				$("div[data-name='Дата окончания обсуждения функциональных характеристик']").closest(".column-container").hide();
				$("div[data-name='Место окончания обсуждения функциональных характеристик']").closest(".column-container").hide();
				$("div[data-name='Порядок окончания обсуждения функциональных характеристик']").closest(".column-container").hide();
			}
			if ($(okonpred).attr("checked")) {
				$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").show();
				$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().show();
				$("div[data-name='Дата рассмотрения и оценки подачи окончательных предложений']").closest(".column-container").show();
				$("div[data-name='Место рассмотрения и оценки окончательных предложений']").closest(".column-container").show();
				$("div[data-name='Порядок рассмотрения и оценки подачи окончательных предложений']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
				$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
				$("div[data-name='Дата рассмотрения и оценки подачи окончательных предложений']").closest(".column-container").hide();
				$("div[data-name='Место рассмотрения и оценки окончательных предложений']").closest(".column-container").hide();
				$("div[data-name='Порядок рассмотрения и оценки подачи окончательных предложений']").closest(".column-container").hide();
			}
			if ($(soppred).attr("checked")) {
				$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").show();
				$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().show();
				$("div[data-name='Дата проведения сопоставления дополнительных ценовых предложений']").closest(".column-container").show();
				$("div[data-name='Место проведения сопоставления дополнительных ценовых предложений']").closest(".column-container").show();
				$("div[data-name='Порядок проведения сопоставления дополнительных ценовых предложений']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
				$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
				$("div[data-name='Дата проведения сопоставления дополнительных ценовых предложений']").closest(".column-container").hide();
				$("div[data-name='Место проведения сопоставления дополнительных ценовых предложений']").closest(".column-container").hide();
				$("div[data-name='Порядок проведения сопоставления дополнительных ценовых предложений']").closest(".column-container").hide();
			}
			if ($(dopcen).attr("checked")) {
				$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").show();
				$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().show();
				$("div[data-name='Дата подачи дополнительных ценовых предложений']").closest(".column-container").show();
				$("div[data-name='Место подачи дополнительных ценовых предложений']").closest(".column-container").show();
				$("div[data-name='Порядок подачи дополнительных ценовых предложений']").closest(".column-container").show();
				$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").show();
				$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().show();
				$("div[data-name='Дата окончания подачи дополнительных ценовых предложений']").closest(".column-container").show();
				$("div[data-name='Место окончания подачи дополнительных ценовых предложений']").closest(".column-container").show();
				$("div[data-name='Порядок окончания подачи дополнительных ценовых предложений']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
				$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
				$("div[data-name='Дата подачи дополнительных ценовых предложений']").closest(".column-container").hide();
				$("div[data-name='Место подачи дополнительных ценовых предложений']").closest(".column-container").hide();
				$("div[data-name='Порядок подачи дополнительных ценовых предложений']").closest(".column-container").hide();
				$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
				$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
				$("div[data-name='Дата окончания подачи дополнительных ценовых предложений']").closest(".column-container").hide();
				$("div[data-name='Место окончания подачи дополнительных ценовых предложений']").closest(".column-container").hide();
				$("div[data-name='Порядок окончания подачи дополнительных ценовых предложений']").closest(".column-container").hide();
			}
			if ($(predfunc).attr("checked")) {
				$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").show();
				$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().show();
				$("div[data-name='Дата начала обсуждения предложений о функциональных характеристиках']").closest(".column-container").show();
				$("div[data-name='Место начала обсуждения предложений о функциональных характеристиках']").closest(".column-container").show();
				$("div[data-name='Порядок начала обсуждения предложений о функциональных характеристиках']").closest(".column-container").show();
				$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").show();
				$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().show();
				$("div[data-name='Дата окончания обсуждения предложений о функциональных характеристиках']").closest(".column-container").show();
				$("div[data-name='Место окончания обсуждения предложений о функциональных характеристиках']").closest(".column-container").show();
				$("div[data-name='Порядок окончания обсуждения предложений о функциональных характеристиках']").closest(".column-container").show();
			} else {
				$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
				$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
				$("div[data-name='Дата начала обсуждения предложений о функциональных характеристиках']").closest(".column-container").hide();
				$("div[data-name='Место начала обсуждения предложений о функциональных характеристиках']").closest(".column-container").hide();
				$("div[data-name='Порядок начала обсуждения предложений о функциональных характеристиках']").closest(".column-container").hide();
				$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
				$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
				$("div[data-name='Дата окончания обсуждения предложений о функциональных характеристиках']").closest(".column-container").hide();
				$("div[data-name='Место окончания обсуждения предложений о функциональных характеристиках']").closest(".column-container").hide();
				$("div[data-name='Порядок окончания обсуждения предложений о функциональных характеристиках']").closest(".column-container").hide();
			}
		} 
		else if ((test123 == 'АО "Сбербанк - АСТ"')) {
			var UnionArr = []; // результат конкатенации масивов
			var BlocksHide = ['Начало подачи заявок', 'Начало обсуждения функциональных характеристик', 'Окончание обсуждения функциональных характеристик', 'Начало обсуждения предложений о функциональных характеристиках', 'Окончание обсуждения предложений о функциональных характеристиках', 'Окончание подачи заявок', 'Приём заявок', 'Рассмотрение и оценка окончательных предложений', 'Вскрытие конвертов', 'Рассмотрение 1х частей', 'Подача дополнительных ценовых предложений', 'Окончание подачи дополнительных ценовых предложений', 'Проведение сопоставления ценовых предложений', 'Подача ценовых предложений', 'Рассмотрение заявок', 'Подача предложений о цене','Начало подачи окончательных предложений', 'Рассмотрение 2х частей', 'Проведение торгов', 'Подведение итогов']; // скрываем все блоки
			var FiledHide = ['Время ожидания ценовых предложений (минут)', 'Требование подписания NDA', 'Рамочная закупка', 'Соответствие требованию к отсутствию участника в РНП', 'Не отправлять сведения в ЕИС', 'Указать отложенную дату начала приема заявок', 'Отложенная дата начала приема заявок', 'Порядок рассмотрения заявок', 'Закупка осуществляется вследствие аварии или иных чрезвычайных ситуаций', 'Основание для проведения закупки', 'Непубличная процедура', 'Нерегламентная закупка', 'Подписание договора ЭП заказчика']; // поля которые скрываются
			
			
			// Скрываю лишние поля
			// Начало
				// скрываем все блоки
				BlocksHide.forEach(function(item, i){
					var CurrentLegend = $($("div fieldset legend:contains('"+item+"')")).closest(".column-container");
					CurrentLegend.hide();
					CurrentLegend.closest('.column-container').prev().hide();
				});
				
				FiledHide.forEach(function(item, i){
					var CurrentFiled= $("div.documentView-field-value[data-name='"+item+"']").closest('.column-container');
					CurrentFiled.hide();
				});
			
			// Конец
			// Блок начала подачи заявок
			var ApplicationSubmissionStartLegend = $($("div fieldset legend:contains('Начало подачи заявок')")[0]).closest(".column-container");
			var ApplicationSubmissionStartLegendEmptyRow = ApplicationSubmissionStartLegend.closest(".column-container").prev();
			var ArrApplicationSubmissionStart = ['datenachpod', 'mestonachpodzay', 'poryadoknachpodzay']; // Все поля в блоке
			var RequiredArrApplicationSubmissionStart = ['datenachpod', 'dateokonpodSingleBlock', 'poryadoknachpodzay'];  // обязательны поля в блоке
			
			// Блок Рассмотрение 1х частей
			var ApplicationSubmissionFirstReviewLegend = $($("div fieldset legend:contains('Рассмотрение 1х частей')")[0]).closest(".column-container");
			var ApplicationSubmissionFirstReviewLegendEmptyRow = ApplicationSubmissionFirstReviewLegend.closest(".column-container").prev();
			var ArrApplicationSubmissionFirstReview = ['datefirstpod', 'mestorasmfirstzay', 'poryadrasmfirstzay']; // Все поля в блоке
			var RequiredArrApplicationSubmissionFirstReview = ['datefirstpod', 'poryadrasmfirstzay'];  // обязательны поля в блоке
			
			// Блок Подача ценовых предложений
			var ApplicationSubmissionPriceOffersLegend = $($("div fieldset legend:contains('Подача предложений о цене')")[0]).closest(".column-container");
			var ApplicationSubmissionPriceOffersLegendEmptyRow = ApplicationSubmissionPriceOffersLegend.closest(".column-container").prev();
			var ArrApplicationSubmissionPriceOffers = ['PricesProvisionStartDate', 'PricesProvisionEndDate', 'PricesProvisionPlace', 'PricesProvisionOrder']; // Все поля в блоке
			var RequiredArrApplicationSubmissionPriceOffers = ['PricesProvisionStartDate', 'PricesProvisionOrder'];  // обязательны поля в блоке
			
			// Блок Рассмотрение заявок
			var ApplicationSubmissionReviewLegend = $($("div fieldset legend:contains('Рассмотрение заявок')")[1]).closest(".column-container");
			var ApplicationSubmissionReviewLegendEmptyRow = ApplicationSubmissionReviewLegend.closest(".column-container").prev();
			var ArrApplicationSubmissionReview = ['daterassm', 'mestorasm', 'porrasmzay', 'OpenEnvelopeDate']; // Все поля в блоке
			var RequiredArrApplicationSubmissionReview = ['daterassm', 'porrasmzay']; // обязательны поля в блоке
			
			// Блок Рассмотрение 2х частей
			var ApplicationSubmissionSecondReviewLegend = $($("div fieldset legend:contains('Рассмотрение 2х частей')")[0]).closest(".column-container");
			var ApplicationSubmissionSecondReviewLegendEmptyRow = ApplicationSubmissionSecondReviewLegend.closest(".column-container").prev();
			var ArrApplicationSubmissionSecondReview = ['datesecondpod', 'datesecondnapr', 'mestosecondpod', 'poryadoksecondpod']; // Все поля в блоке
			var RequiredArrApplicationSubmissionSecondReview = ['datesecondpod', 'poryadoksecondpod'];  // обязательны поля в блоке
			
			// Блок Подведение итогов
			var ApplicationSubmissionSummingUpLegend = $($("div fieldset legend:contains('Подведение итогов')")[1]).closest(".column-container");
			var ApplicationSubmissionSummingUpLegendEmptyRow = ApplicationSubmissionSummingUpLegend.closest(".column-container").prev();
			var ArrApplicationSubmissionSummingUp = ['datepoditog', 'mestopodvitog', 'porpodvitog'];  // Все поля в блоке
			var RequiredArrApplicationSubmissionSummingUp = ['datepoditog', 'porpodvitog'];  // обязательны поля в блоке
			
			
			//Кастомная логика для Сбербанк - АСТ
			//Начало
				ViewfiledShowOnLegend(['Дата вскрытия конвертов', 'Порядок рассмотрения  заявок'], ApplicationSubmissionReviewLegend) // отобразить поле  в блоке Рассмотрение заявок
				ViewfiledShowOnLegend(['Дата окончания подачи заявок'], ApplicationSubmissionStartLegend) // отобразить поле  в блоке начала подачи заявок
			
			//Конец
			
			if (formTorgText != undefined ) {
				if (['Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства', 
					 'Аукцион (заявка из 2-х частей)'].indexOf(formTorgText) > -1) {
					// (20)Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
					// (16)Аукцион (заявка из 2-х частей)
					
					// Блок начала подачи заявок
					ApplicationSubmissionStartLegend.show();
					ApplicationSubmissionStartLegendEmptyRow.show();
					/* $("textarea[data-field-name='mestonachpodzay']").closest(".column-container").hide();	// скрыть место начала подачи заявок
					$("div.documentView-field-label[data-related-field='mestonachpodzay']").closest(".column-container").hide();	// скрыть место начала подачи заявок */
					
					// Блок Рассмотрение 1х частей
					ApplicationSubmissionFirstReviewLegend.show();
					ApplicationSubmissionFirstReviewLegendEmptyRow.show();
					
					// Блок Подача ценовых предложений
					ApplicationSubmissionPriceOffersLegend.show();
					ApplicationSubmissionPriceOffersLegendEmptyRow.show();
					
					// Блок Рассмотрение 2х частей
					ApplicationSubmissionSecondReviewLegend.show();
					ApplicationSubmissionSecondReviewLegendEmptyRow.show();
					
					// Блок Подведение итогов
					ApplicationSubmissionSummingUpLegend.show();
					ApplicationSubmissionSummingUpLegendEmptyRow.show();
					
				} 
				else if(['Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						   'Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						   'Конкурс (заявка из 2-х частей)',
						   'Запрос предложений (заявка из 2-х частей)'].indexOf(formTorgText) > -1) {
					// (21)Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
					// (25)Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
					// (15)Конкурс (заявка из 2-х частей)
					// (18)Запрос предложений (заявка из 2-х частей)
					
					// Блок начала подачи заявок
					ApplicationSubmissionStartLegend.show();
					ApplicationSubmissionStartLegendEmptyRow.show();
					
					// Блок Рассмотрение 1х частей
					ApplicationSubmissionFirstReviewLegend.show();
					ApplicationSubmissionFirstReviewLegendEmptyRow.show();
					
					// Блок Рассмотрение 2х частей
					ApplicationSubmissionSecondReviewLegend.show();
					ApplicationSubmissionSecondReviewLegendEmptyRow.show();
					
					// Блок Подведение итогов
					ApplicationSubmissionSummingUpLegend.show();
					ApplicationSubmissionSummingUpLegendEmptyRow.show();
					
				} 
				else if (['Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства'].indexOf(formTorgText) > -1) {
					// (22)Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства	
					
					// Блок начала подачи заявок
					ApplicationSubmissionStartLegend.show();
					ApplicationSubmissionStartLegendEmptyRow.show();
					
					// Блок Подведение итогов
					ApplicationSubmissionSummingUpLegend.show();
					ApplicationSubmissionSummingUpLegendEmptyRow.show();
				} 
				else if(['Конкурс',
						   'Запрос предложений',
						   'Запрос котировок',
						   'Запрос котировок (заявка из 2-х частей)',
						   'Квалификационный отбор в электронной форме'].indexOf(formTorgText) > -1) {
					// (11)Конкурс	
					// (13)Запрос предложений	
					// (14)Запрос котировок	
					// (17)Запрос котировок (заявка из 2-х частей)		
					// (59)Квалификационный отбор в электронной форме
					
					// Блок начала подачи заявок
					ApplicationSubmissionStartLegend.show();
					ApplicationSubmissionStartLegendEmptyRow.show();
					
					// Блок Рассмотрение заявок
					ApplicationSubmissionReviewLegend.show();
					ApplicationSubmissionReviewLegendEmptyRow.show();
					
					// Блок Подведение итогов
					ApplicationSubmissionSummingUpLegend.show();
					ApplicationSubmissionSummingUpLegendEmptyRow.show();
					
				} 
				else if (['Аукцион',
							'Аукцион с двумя частями заявок'].indexOf(formTorgText) > -1) {
					// (12)Аукцион	
					// (63)Аукцион с двумя частями заявок	
					
					// Блок начала подачи заявок
					ApplicationSubmissionStartLegend.show();
					ApplicationSubmissionStartLegendEmptyRow.show();
					
					// Блок Подача ценовых предложений
					ApplicationSubmissionPriceOffersLegend.show();
					ApplicationSubmissionPriceOffersLegendEmptyRow.show();
					
					// Блок Рассмотрение заявок
					ApplicationSubmissionReviewLegend.show();
					ApplicationSubmissionReviewLegendEmptyRow.show();
					
					// Блок Подведение итогов
					ApplicationSubmissionSummingUpLegend.show();
					ApplicationSubmissionSummingUpLegendEmptyRow.show();
					
				} 
				else if (['Аукцион в электронной форме'].indexOf(formTorgText) > -1) {
					// (68)Аукцион в электронной форме
					
					// Блок начала подачи заявок
					ApplicationSubmissionStartLegend.show();
					ApplicationSubmissionStartLegendEmptyRow.show();
					
					// Блок Подача ценовых предложений
					ApplicationSubmissionPriceOffersLegend.show();
					ApplicationSubmissionPriceOffersLegendEmptyRow.show();
					
					// Блок Подведение итогов
					ApplicationSubmissionSummingUpLegend.show();
					ApplicationSubmissionSummingUpLegendEmptyRow.show();
					
				} 
				else if (['Запрос цен (коммерческих предложений)'].indexOf(formTorgText) > -1) {
					// (26)Запрос цен (коммерческих предложений)
					// Блок Подача ценовых предложений
					ViewfiledHide(['НМЦ с НДС', 'НМЦ (без НДС)', 'Место подачи предложений о цене', 'Порядок подачи предложений о цене']);
					ApplicationSubmissionPriceOffersLegend.show();
					ApplicationSubmissionPriceOffersLegendEmptyRow.show();
					
					ViewfiledShowOnLegend(['Дата окончания срока подачи предложений'], ApplicationSubmissionPriceOffersLegend) // отобразить поле 'Дата и время окончания срока подачи предложений' в блоке Рассмотрение заявок
				}
				
				
				if (['Запрос цен (коммерческих предложений)'].indexOf(formTorgText) == -1) {
					LegendAndEmptyRowShow(['Дополнительная информация']); // отображаем блок
				}
				
				// отображение полей в зависимости от формы торгов
				
				var legend =  $($("div fieldset legend:contains('Дополнительная информация')")[0]).closest(".column-container");
				
				if (['Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
						'Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства'].indexOf(formTorgText) > -1) {
					
					var ArrlegenFieldhide = ['Автоматическое формирование протокола', 'Отсутствие в РНП', 'Перечисление обеспечения в случае уклонения'];
					
					ViewfiledHideOnLegend(ArrlegenFieldhide, legend); // скрываем поля внутри блока
					
				}
				else if (['Квалификационный отбор в электронной форме'].indexOf(formTorgText) > -1) {
					ViewfiledHideOnLegend(['Перечисление обеспечения в случае уклонения'], legend); // скрываем поля внутри блока
				}
				
				// Дата курса валюты заявок
				var purchaseforeignrequestincurrency = $("div .documentView-field-value[data-name='Подача заявок в валюте отличной от валюты лота']");
				if (purchaseforeignrequestincurrency.attr('title') != 1) {
					ViewfiledHideOnLegend(['Дата курса валюты заявок'], legend); // скрываем поля внутри блока
				}
				
				// предоставлени документации
				// Требуется плата за предоставление документации
				var PurchaseDocumentationPayment = $("div .documentView-field-value[data-name='Требуется плата за предоставление документации']");
				if (PurchaseDocumentationPayment.attr('title') != 1) {
					ViewfiledShow(['Требуется плата за предоставление документации']); // отображаем только чекбокс, т.к. по умолчанию все скрываем
				} else {
					ViewfiledShow(['Сумма оплаты за документацию', 'Сроки и порядок внесения платы', 'Валюта платежа', 'Требуется плата за предоставление документации']); // отображаем поля 
				}
				
				// Дополнительные этапы
				if (['Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства', 
					 'Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства',
					 'Конкурс (заявка из 2-х частей)',
					 'Аукцион (заявка из 2-х частей)',
					 'Запрос предложений (заявка из 2-х частей)'].indexOf(formTorgText) > -1) {
						 
						LegendAndEmptyRowShow(['Дополнительные этапы']); 
					
				}
				
			}
				
		}
		else {
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
			$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();

		}
	}
	izmenView();
};

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
// View скрыть поля внутри legend
function ViewfiledHideOnLegend(Arr, legend, UseLegendName) {
	if (Arr.length > 0 && legend != undefined) {
		if (UseLegendName) {
			legend = $($("div fieldset legend:contains('"+legend+"')")[0]).closest(".column-container");
		}
		
		Arr.forEach(function(item, i) {
			$(legend).find($("div .documentView-field-value[data-name='"+item+"']").closest('.column-container')).hide();
		});
	}
}
// View Отобразить поля внутри legend
function ViewfiledShowOnLegend(Arr, legend, UseLegendName) {
	if (Arr.length > 0 && legend != undefined) {
		if (UseLegendName) {
			legend = $($("div fieldset legend:contains('"+legend+"')")[0]).closest(".column-container");
		}
		
		Arr.forEach(function(item, i) {
			$(legend).find($("div .documentView-field-value[data-name='"+item+"']").closest('.column-container')).show();
		});
	}
}

var LegendAndEmptyRowHide =  function (Arr) {
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.hide();
		$(legend).closest(".column-container").prev().hide();;
	});	
}

var LegendAndEmptyRowShow =  function (Arr) {
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.show();
		$(legend).closest(".column-container").prev().show();;
		
	});	
}

function hideallview() {
	$("div[data-name='Место рассмотрения предложений']").closest(".column-container").hide();
	$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
	$("div[data-name='Попозиционная закупка']").closest(".column-container").hide();
	$("div[data-name='Возможность проведения процедуры переторжки']").closest(".column-container").hide();
	$("div[data-name='Соответствие требованию к отсутствию участника в РНП']").closest(".column-container").show();
	$("div[data-name='Заявка в двух частях']").closest(".column-container").hide();
	$("div[data-name='Причина аккредитационного отбора']").closest(".column-container").hide();
	$("div[data-name='Передать сведения о процедуре в ЕИС']").closest(".column-container").hide();
	$("div[data-name='Принимать предложения только на повышение']").closest(".column-container").hide();
	$("div[data-name='Цена лота выражена в денежном эквиваленте']").closest(".column-container").hide();
	$("div[data-name='Коэффициент снижения']").closest(".column-container").hide();
	$("div[data-name='Наименование процедуры']").closest(".column-container").hide();
	$("div[data-name='Планируемая дата размещения']").closest(".column-container").hide();
	$("div[data-name='Срок заключения договора']").closest(".column-container").hide();
	$("div[data-name='Шаг повышения стартовой цены в %']").closest(".column-container").hide();
	$("div[data-name='Время ожидания дополнительных ценовых предложений, мин.']").closest(".column-container").hide();
	$("div[data-name='Время ожидания первого ценового предложения, мин.']").closest(".column-container").hide();
	$("div[data-name='Время ожидания ценовых предложений, мин.']").closest(".column-container").hide();
	$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
	$("div[data-name='Шаг ценовых предложений от']").closest(".column-container").hide();
	$("div[data-name='Шаг ценовых предложений до']").closest(".column-container").hide();
	$("div[data-name='Шаг ценовых предложений (от)']").closest(".column-container").hide();
	$("div[data-name='Шаг ценовых предложений (до)']").closest(".column-container").hide();
	$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
	$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").hide();
	$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").hide();
	$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").hide();
	$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").hide();
	$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").hide();
	$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").hide();
	$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").hide();
	$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").hide();
	$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").hide();
	$("div fieldset legend:contains('Рассмотрение заявок')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Проведение торгов')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Вскрытие конвертов')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Подведение итогов')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Приём заявок (РТ)')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Рассмотрение заявок (РТ)')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Проведение торгов (РТ)')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Подведение итогов (РТ)')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Окончание подачи заявок')").closest(".column-container").prev().hide();
	$("div[data-name='Шаг ценовых предложений в валюте договора']").closest(".column-container").hide();
	$("div[data-name='Шаг ценовых предложений в валюте']").closest(".column-container").hide();
	$("div[data-name='Этап вскрытие конвертов']").closest(".column-container").hide();
	$("div[data-name='Этап рассмотрение заявок']").closest(".column-container").hide();
	$("div[data-name='Конкурентный способ']").closest(".column-container").hide();
	$("div[data-name='Этап подведения итогов']").closest(".column-container").hide();
	$("div[data-name='Место окончания подачи заявок']").closest(".column-container").hide();
	$("div[data-name='Порядок окончания подачи заявок']").closest(".column-container").hide();
	$("div[data-name='Дата окончания подачи заявок']").closest(".column-container").hide();
	$("div[data-name='Дата вскрытия конвертов']").closest(".column-container").hide();
	$("div[data-name='Место вскрытия конвертов']").closest(".column-container").hide();
	$("div[data-name='Место рассмотрения заявок']").closest(".column-container").hide();
	$("div[data-name='Место подведения итогов']").closest(".column-container").hide();
	$("div[data-name='Этап квалификационного отбора']").closest(".column-container").hide();
	$("div[data-name='Этап обсуждения функциональных характеристик']").closest(".column-container").hide();
	$("div[data-name='Этап обсуждения предложений о функ. характеристиках']").closest(".column-container").hide();
	$("div[data-name='Этап подачи доп. ценовых предложений']").closest(".column-container").hide();
	$("div[data-name='Этап подачи окончательных предложений']").closest(".column-container").hide();
	$("div[data-name='Этап сопоставления ценовых предложений']").closest(".column-container").hide();
	$("div[data-name='Дата и время окончания срока подачи предложений']").closest(".column-container").hide();
	$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").hide();
	$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").hide();
	$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").hide();
	$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").hide();
	$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
	$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").hide();
	$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").hide();
	$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").hide();
	$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").hide();
	$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").hide();
	$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").hide();
	$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").hide();
	$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").hide();
	$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").hide();
	$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").hide();
	$("div fieldset legend:contains('Начало подачи заявок')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Рассмотрение 1х частей')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Рассмотрение 2х частей')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Подача ценовых предложений')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Окончание обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Окончание подачи дополнительных ценовых предложений')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Проведение сопоставления ценовых предложений')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Начало подачи окончательных предложений')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Окончание подачи окончательных предложений')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Рассмотрение и оценка окончательных предложений')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Начало обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Окончание обсуждения функциональных характеристик')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Квалификационный отбор')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Начало обсуждения предложений о функциональных характеристиках')").closest(".column-container").prev().hide();
	$("div fieldset legend:contains('Подача дополнительных ценовых предложений')").closest(".column-container").prev().hide();
	$("div[data-name='Закупка в электронной форме']").closest(".column-container").hide();
	$("div[data-name='На согласование руководителю профильного подразделения']").closest(".column-container").hide();

}

// Форма торгов обязательное, если Наименование ЭТП заполнено
//на регистрацию
var validateformtraidingreg = function() {
	var naimETP = $("input[name='naimETP']");
	var formTorg = $("input[name='formTorg']");
	var formTorgName = $("input[name='formTorgName']"); 
	naimETP.change(function() {
        var naimETP = $(this).val();
        if (naimETP === "") {
			formTorg.val("");
			formTorgName.val("");	
			formTorg.closest(".column-container").find(".dict-display-field").val("");		
			
			}			
		})
	naimETP.change();
};


//на редактирование
var validateformtraidingedit = function() {
	var naimETP = $("#editView input[name='naimETP']");
	var formTorg = $("#editView input[name='formTorg']");
	var formTorgName = $("#editView input[name='formTorgName']");
	
	naimETP.change(function() {
        var naimETP = $(this).val();
        if (naimETP === "") {
			formTorg.val("");
			formTorgName.val("");
			formTorg.closest(".column-container").find(".dict-display-field").val("");	
			}
	});	
};

//Поле "Количество этапов"
//на просмотр
var hidecountstepview = function() {
    var flag = $("div[data-name='Количество этапов']");
    var val = $("div[data-name='Количество этапов'] div[data-name='Количество этапов']").text();
	
	if (val == "0" || val ==" "|| val == "") {
        hideViewElementColumn(flag);
		} else {
        showViewElementColumn(flag);
	}	
	
};

var IzmenenieReg = function () {
	var statusnotice=$("input[name='statusnotice']").val();
	var zakelform = $("input[name='zakelform']");
	if (statusnotice=="Внесение изменений") {
		$("li:has(:contains('Контактное лицо'))").hide();	
		$("li:has(:contains('Документация'))").show();		
	} 
	if ((statusnotice=="Внесение изменений") && ($(zakelform).is(":checked"))) {
		$("li:has(:contains('Порядок проведения'))").show();
		$("li:has(:contains('Документация'))").show();		
	}

	hideProcedure();
	procedureAccess();
}
var IzmenenieEdit = function () {
	var statusnotice=$("input[name='statusnotice']").val();
	if (statusnotice=="Внесение изменений") {
		$("li:has(:contains('Контактное лицо'))").show();
		var otmena=$("input[data-field-name='otmena']");
		var Change=$("input[data-field-name='Change']");
		if ($(Change).is(":checked")) {
			$("textarea[data-field-name='obocnizm']").show();
			$("div[data-related-field='obocnizm']").show();
			$("textarea[data-field-name='obocnizm']").prop('required', true)
			$("[data-related-field=obocnizm]").addClass("label-required");
			$("input[data-field-name='DateChange']").closest(".column-container").show();
			$("div[data-related-field='DateChange']").closest(".column-container").show();
			$("input[data-field-name='DateChange']").prop('required', true)
			$("[data-related-field=DateChange]").addClass("label-required");
		}
		if (!$(Change).is(":checked")) {
			$("textarea[data-field-name='obocnizm']").hide();
			$("div[data-related-field='obocnizm']").hide();
			$("textarea[data-field-name='obocnizm']").prop('required', false)
			$("[data-related-field=obocnizm]").removeClass("label-required");
			$("input[data-field-name='DateChange']").closest(".column-container").hide();
			$("div[data-related-field='DateChange']").closest(".column-container").hide();
			$("input[data-field-name='DateChange']").prop('required', false)
			$("[data-related-field=DateChange]").removeClass("label-required");
		}
	}
	$("[data-related-field='zakelform']").closest(".column-container").hide(); 
	$("[data-related-field='otsutuchvRNP']").closest(".column-container").hide();
	hideProcedure();
	procedureAccess();
}

$(document).on('change', "input[data-field-name='Change']", function (e) {
	var Change=$("input[data-field-name='Change']");
	var otmena=$("input[data-field-name='otmena']");
	if ($(Change).is(":checked")) {
	   /*  otmena.prop('checked', false);
		otmena.change(); */
		$("textarea[data-field-name='obocnizm']").show();
		$("div[data-related-field='obocnizm']").show();
		$("textarea[data-field-name='obocnizm']").prop('required', true)
		$("[data-related-field=obocnizm]").addClass("label-required");
		$("input[data-field-name='DateChange']").closest(".column-container").show();
		$("div[data-related-field='DateChange']").closest(".column-container").show();
		$("input[data-field-name='DateChange']").prop('required', true)
		$("[data-related-field=DateChange]").addClass("label-required");
	}
	else {
		$("textarea[data-field-name='obocnizm']").hide();
		$("div[data-related-field='obocnizm']").hide();
		$("textarea[data-field-name='obocnizm']").prop('required', false)
		$("[data-related-field=obocnizm]").removeClass("label-required");
		$("textarea[data-field-name='obocnizm']").val('');
		$("input[data-field-name='DateChange']").clear();
		$("input[data-field-name='DateChange']").closest(".column-container").hide();
		$("div[data-related-field='DateChange']").closest(".column-container").hide();
		$("input[data-field-name='DateChange']").prop('required', false)
		$("[data-related-field=DateChange]").removeClass("label-required");
	}
});

function izmenView() {
	var numRed = $("div.documentView-field-value[data-name='Номер редакции']").text();
	if(numRed>1){		
		$("li:has(:contains('Контактное лицо'))").show();		
		$("li:has(:contains('Документация'))").show();	
		var flag = $("div[data-name='Отмена закупки']").find("input[type='checkbox']");
		var flag1 = $("div[data-name='Изменение']").find("input[type='checkbox']");
		var zakelform = $("div[data-name='Закупка в электронной форме']").find("input[type='checkbox']");

		if ($(zakelform).attr("checked")) {
			$("li:has(:contains('Порядок проведения'))").show();
		}
	}
};

 var DateItog = function () {
	var plandaterazm = $("input[name='plandaterazm']"); //планируемая дата размещения
	var today = new Date;//дата окончания подачи заявок
	
	function parseDate(input) {
	var parts = input.val().split('.');
	// new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
	return new Date(parts[2], parts[1] - 1, parts[0]); // Note: months are 0-based
	}
	
	function parseDateTime(input) {
	
	var dt = input.split(' ');
	var d = dt[0];
    var t = dt[1];
	var dparts = d.split('.');
	var tparts = t.split(':');
	return new Date(dparts[2], dparts[1]-1, dparts[0], tparts[0], tparts[1], 0);
	
	}
	
	plandaterazm.parent().on('dp.change', function (e) {
	var plandaterazmRezult = parseDate(plandaterazm);
	var diffDays = parseInt((plandaterazmRezult - today) / (24 * 3600 * 1000));
	if (diffDays < 0) {
                showCommonErrors('Планируемая дата размещения должна быть больше текущей даты');
				plandaterazm.parent().data("DateTimePicker").clear();
            }
	
	});
	
} 

var Obyazetap = function () {
	var flag = $("input[name='Obetap']").val();
	var flag2 = $("input[name='naimETPID']").val();
	var flag3 = $("input[name='formTorg']").val();

	var VskKonvertov = $("input[name='VskKonvertov']");
	var RasmZay = $("input[name='RasmZay']");
	var PodvItog = $("input[name='PodvItog']");
	var Konksposob = $("input[name='Konksposob']");
	var Secondpart = $("input[name='Secondpart']");
	var predkvalotbr = $("input[name='predkvalotbr']");
	var UkazOtlDate = $("input[name='UkazOtlDate']");
	var predlpovrt = $("input[name='predlpovrt']");
	var emergencyZak = $("input[name='emergencyZak']");
	var NereglZak = $("input[name='NereglZak']");
	var PodpDogEp = $("input[name='PodpDogEp']");
	var send_to_oos = $("input[name='send_to_oos']");
	var notPablikZak = $("input[name='notPablikZak']");

	var mestopodzay = $("textarea[name='mestopodzay']");
	var poryadokpodzay = $("textarea[name='poryadokpodzay']");
	var mestoprovtorg = $("textarea[name='mestoprovtorg']");
	var porprovtorg = $("textarea[name='porprovtorg']");
	var mestorasm = $("textarea[name='mestorasm']");
	var porrasmzay = $("textarea[name='porrasmzay']");
	var mestopodvitog = $("textarea[name='mestopodvitog']");
	var porpodvitog = $("textarea[name='porpodvitog']");
	var mestovskrkonv = $("textarea[name='mestovskrkonv']");
	var porvskrkonv = $("textarea[name='porvskrkonv']");

	var mestopodsrokcenpredl = $("textarea[name='mestopodsrokcenpredl']");
	var poryadoksrokpodcenpredl = $("textarea[name='poryadoksrokpodcenpredl']");
	// var mestoprovkvaloybr = $("textarea[name='mestoprovkvaloybr']");
	// var poryadokprovkvaloybr = $("textarea[name='poryadokprovkvaloybr']");
	var mestosecondpod = $("textarea[name='mestosecondpod']");
	var poryadoksecondpod = $("textarea[name='poryadoksecondpod']");

	var dateokonpod = $("input[name='dateokonpod']");
	var datevskrkonv = $("input[name='datevskrkonv']");
	var daterassm = $("input[name='daterassm']");
	var datetorg = $("input[name='datetorg']");
	var datepoditog = $("input[name='datepoditog']");

	var plandaterazm = $("input[name='plandaterazm']");
	var datenachpod = $("input[name='datenachpod']");
	var dateokonpod = $("input[name='dateokonpod']");
	var datefirstpod = $("input[name='datefirstpod']");
	var datenachsrokpodpredl = $("input[name='datenachsrokpodpredl']");
	// var dateprovkvaloybr = $("input[name='dateprovkvaloybr']");
	var datesecondpod = $("input[name='datesecondpod']");
	var datesecondnapr = $("input[name='datesecondnapr']");

	var sopostcenpredl = $("input[name='sopostcenpredl']");
	var doppredl = $("input[name='doppredl']");
	var okonpredl = $("input[name='okonpredl']");
	var obspredlofuncfar = $("input[name='obspredlofuncfar']");
	var obsfuncfar = $("input[name='obsfuncfar']");

	var dateprovsopost = $("input[name='dateprovsopost']");
	var dateokonpoddoppredl = $("input[name='dateokonpoddoppredl']");
	var datepoddoppredl = $("input[name='datepoddoppredl']");
	var daterasmpodokonpredl = $("input[name='daterasmpodokonpredl']");
	var dateokonpodokonpredl = $("input[name='dateokonpodokonpredl']");
	var datenachpodokonpredl = $("input[name='datenachpodokonpredl']");
	var dateokonobspredl = $("input[name='dateokonobspredl']");
	var datenachobspredl = $("input[name='datenachobspredl']");
	var dateokonobshar = $("input[name='dateokonobshar']");
	var datenachobshar = $("input[name='datenachobshar']");
	var ramZakup = $("input[name='ramZakup']");
	var notRNP = $("input[name='notRNP']");

	var mestorasmfirstzay = $("textarea[name='mestorasmfirstzay']");
	var poryadrasmfirstzay = $("textarea[name='poryadrasmfirstzay']");
	var mestonachpodzay = $("textarea[name='mestonachpodzay']");
	var poryadoknachpodzay = $("textarea[name='poryadoknachpodzay']");
	var mestoprovsopost = $("textarea[name='mestoprovsopost']");
	var poryadokprovsopost = $("textarea[name='poryadokprovsopost']");
	var poryadokokonpoddoppredl = $("textarea[name='poryadokokonpoddoppredl']");
	var mestookonpoddoppredl = $("textarea[name='mestookonpoddoppredl']");
	var poryadokpoddoppredl = $("textarea[name='poryadokpoddoppredl']");
	var mestopoddoppredl = $("textarea[name='mestopoddoppredl']");
	var poryadokrasmpodokonpredl = $("textarea[name='poryadokrasmpodokonpredl']");
	var mestorasmpodokonpredl = $("textarea[name='mestorasmpodokonpredl']");
	var poryadokokonpodokonpredl = $("textarea[name='poryadokokonpodokonpredl']");
	var mestookonpodokonpredl = $("textarea[name='mestookonpodokonpredl']");
	var poryadoknachpodokonpredl = $("textarea[name='poryadoknachpodokonpredl']");
	var mestonachpodokonpredl = $("textarea[name='mestonachpodokonpredl']");
	var poryadokokonobspredl = $("textarea[name='poryadokokonobspredl']");
	var mestookonobspredl = $("textarea[name='mestookonobspredl']");
	var mestonachobspredl = $("textarea[name='mestonachobspredl']");
	var poryadoknachobspredl = $("textarea[name='poryadoknachobspredl']");
	var poryadokokonobshar = $("textarea[name='poryadokokonobshar']");
	var mestookonobshar = $("textarea[name='mestookonobshar']");
	var poryadoknachobshar = $("textarea[name='poryadoknachobshar']");
	var mestonachobshar = $("textarea[name='mestonachobshar']");
	var mestorasmpredl = $("textarea[name='mestorasmpredl']");
	var statusnotice = $("input[name='statusnotice']").val();
	var porRassmZa = $("[data-field-name='porRassmZa']");
	var poryadoknachobshar = $("textarea[name='poryadoknachobshar']");
	var numRed=$("input[name='numRed']").val();
	
	var ArrfieldsNeedForSber = ['dateokonpodSingleBlock', 'SendToEISCode', 'PurchaseEmergency', 'createprotocolopenenvelope', 'purchaseforeignrequestincurrency', 'purchaseforeignrequestcurrencydate', 'PurchaseNotDishonestSber', 'PurchaseTransferCoverAmountSber', 'PurchaseDocumentationPayment', 'PurchaseDocumentationPaymentAmount', 'PurchaseDocumentationPaymentCurrencyCode', 'PurchaseDocumentationPaymentCurrencyName', 'PurchaseDocumentationPaymentOrder','OpenEnvelopeDate', 'PurchaseAntimonopolyDecisionTaken', 'PricesProvisionStartDate', 'PricesProvisionEndDateSber', 'PricesProvisionPlace', 'PricesProvisionOrder'];
	var NotArrfieldsNeedForSber = ['datesecondnapr', 'UkazOtlDate', 'Otldatepod'];
	// скрытие/отображение отдельных полей при Сбербанк-АСТ
	
	AdditionalPurchaseStageTableLogic(flag2, flag3); // логика работы таблицы доп этапов для Сбер АСТ
	
	if (flag2 == 2) {
		
		// отображаем поля
		filedShow(ArrfieldsNeedForSber); // вызов функции
		
		// чистим и скрываем поля
		filedClearAndHide(NotArrfieldsNeedForSber);	
		
	} else {
		// отображаем поля
		filedShow(NotArrfieldsNeedForSber)
		
		// чистим и скрываем поля
		filedClearAndHide(ArrfieldsNeedForSber);
		
		// скрываю блок "Подача предложений о цене"
		
		$($("div fieldset legend:contains('Подача предложений о цене')")).closest(".column-container").hide();
		$($("div fieldset legend:contains('Подача предложений о цене')")).closest(".column-container").closest('.row-container').next().hide();
	}

	if (flag == '1' && flag2 == '113') {
		filedClearAndHide(['predlpovrt']);
		filedShow(['UkazOtlDate', 'emergencyZak', 'OsnZak', 'notPablikZak', 'NereglZak', 'MaxCountQuery', 'send_to_oos']);
		if (flag3=="2"){
			filedShow(['NereglZak', 'emergencyZak']);
		}
		else{
			filedClearAndHide(['NereglZak', 'emergencyZak', 'PodpDogEp']);
		}
		if (UkazOtlDate.is(":checked")){
			filedShowAndRequired(['Otldatepod']);
		} else{
			filedClearAndHide(['Otldatepod']);
		}
		if (send_to_oos.is(":checked")){
			$("input[data-field-name='NereglZak']").readonly(false)
		} 
		else {
			$("input[data-field-name='NereglZak']").readonly()
			NereglZak.prop('checked', false);
			PodpDogEp.prop('checked', false);
			filedHide(['PodpDogEp']);
		}
		if (NereglZak.is(":checked")){
			filedShow(['PodpDogEp']);
		} else{
			filedClearAndHide(['PodpDogEp']);
		}
		if (notPablikZak.is(":checked")){
			$("input[data-field-name='send_to_oos']").readonly()
			send_to_oos.prop('checked', true);
		} else if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		mestorasmpredl.prop("required", true);
		$("[data-related-field=mestorasmpredl]").addClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").show();
		mestorasmpredl.closest(".column-container").show();
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		/* $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide(); */
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
		Konksposob.closest(".column-container").show();
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		poryadokpodzay.prop("required", true);
		poryadokpodzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		porprovtorg.prop("required", true);
		porprovtorg.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porprovtorg]").addClass("label-required");
		porrasmzay.prop("required", true);
		porrasmzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porrasmzay]").addClass("label-required");
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().show();
		daterassm.prop("required", true);
		$("[data-related-field=daterassm]").addClass("label-required");
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().show();
		datetorg.prop("required", true);
		$("[data-related-field=datetorg]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		poryadokpodzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		if (VskKonvertov.is(":checked")) {
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().show();
			datevskrkonv.prop("required", true);
			$("[data-related-field=datevskrkonv]").addClass("label-required");
			porvskrkonv.prop("required", true);
			porvskrkonv.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porvskrkonv]").addClass("label-required");
		}
		else {
			mestovskrkonv.text('');
			mestovskrkonv.val('');
			porvskrkonv.prop("required", false);
			$("[data-related-field=porvskrkonv]").removeClass("label-required");
			porvskrkonv.text('');
			porvskrkonv.val('');
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
			datevskrkonv.prop("required", false);
			$("[data-related-field=datevskrkonv]").removeClass("label-required");
			datevskrkonv.parent().data("DateTimePicker").clear();
		}
		if (porRassmZa.val() == "Заявки в двух частях (аналогично 94-ФЗ)") {
			$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
			datepoditog.prop("required", true);
			$("[data-related-field=datepoditog]").addClass("label-required");
			porpodvitog.prop("required", true);
			porpodvitog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porpodvitog]").addClass("label-required");
			PodvItog.closest(".column-container").hide();
			PodvItog.prop('checked', false);
			mestovskrkonv.text('');
			mestovskrkonv.val('');
			porvskrkonv.prop("required", false);
			$("[data-related-field=porvskrkonv]").removeClass("label-required");
			porvskrkonv.text('');
			porvskrkonv.val('');
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
			datevskrkonv.prop("required", false);
			$("[data-related-field=datevskrkonv]").removeClass("label-required");
			datevskrkonv.parent().data("DateTimePicker").clear();
			VskKonvertov.closest(".column-container").hide();
			VskKonvertov.prop('checked', false);
		}
		else if(PodvItog.is(":checked")){
			$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
			datepoditog.prop("required", true);
			$("[data-related-field=datepoditog]").addClass("label-required");
			porpodvitog.prop("required", true);
			porpodvitog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porpodvitog]").addClass("label-required");
		}
		else {
			mestopodvitog.text('');
			mestopodvitog.val('');
			porpodvitog.prop("required", false);
			$("[data-related-field=porpodvitog]").removeClass("label-required");
			porpodvitog.text('');
			porpodvitog.val('');
			$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().hide();
			datepoditog.prop("required", false);
			$("[data-related-field=datepoditog]").removeClass("label-required");
			datepoditog.parent().data("DateTimePicker").clear();
			PodvItog.closest(".column-container").show();
			VskKonvertov.closest(".column-container").show();
		}
	}
	else if (flag == '2' && flag2 == '113' && flag3 == '19') {
		filedClearAndHide(['predlpovrt']);
		filedShow(['UkazOtlDate', 'emergencyZak', 'OsnZak', 'notPablikZak', 'NereglZak', 'MaxCountQuery', 'send_to_oos']);
		if (UkazOtlDate.is(":checked")){
			filedShowAndRequired(['Otldatepod']);
		} else{
			filedClearAndHide(['Otldatepod']);
		}
		if (NereglZak.is(":checked")){
			filedShow(['PodpDogEp']);
		} else{
			filedClearAndHide(['PodpDogEp']);
		}
		if (send_to_oos.is(":checked")){
			$("input[data-field-name='NereglZak']").readonly(false)
		} 
		else {
			$("input[data-field-name='NereglZak']").readonly()
			NereglZak.prop('checked', false);
			PodpDogEp.prop('checked', false);
			filedHide(['PodpDogEp']);
		}
		if (notPablikZak.is(":checked")){
			$("input[data-field-name='send_to_oos']").readonly()
			send_to_oos.prop('checked', true);
		} else if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		mestorasmpredl.prop("required", true);
		$("[data-related-field=mestorasmpredl]").addClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").show();
		mestorasmpredl.closest(".column-container").show();
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		/* $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide(); */
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
		Konksposob.closest(".column-container").show();
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		VskKonvertov.closest(".column-container").show();
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		mestoprovtorg.text('');
		mestoprovtorg.val('');
		porprovtorg.text('');
		porprovtorg.val('');
		porprovtorg.prop("required", false);
		$("[data-related-field=porprovtorg]").removeClass("label-required");
		porrasmzay.prop("required", true);
		porrasmzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porrasmzay]").addClass("label-required");
		porpodvitog.prop("required", true);
		porpodvitog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porpodvitog]").addClass("label-required");
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		datetorg.prop("required", false);
		$("[data-related-field=datetorg]").removeClass("label-required");
		datetorg.parent().data("DateTimePicker").clear();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		poryadokpodzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		if (VskKonvertov.is(":checked")) {
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().show();
			datevskrkonv.prop("required", true);
			$("[data-related-field=datevskrkonv]").addClass("label-required");
			porvskrkonv.prop("required", true);
			porvskrkonv.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porvskrkonv]").addClass("label-required");
		}
		else {
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
			mestovskrkonv.text('');
			mestovskrkonv.val('');
			porvskrkonv.prop("required", false);
			$("[data-related-field=porvskrkonv]").removeClass("label-required");
			porvskrkonv.text('');
			porvskrkonv.val('');
			datevskrkonv.prop("required", false);
			$("[data-related-field=datevskrkonv]").removeClass("label-required");
			datevskrkonv.parent().data("DateTimePicker").clear();
		}
	}
	else if (flag == '3' && flag2 == '113') {
		filedShow(['UkazOtlDate', 'predlpovrt', 'emergencyZak', 'OsnZak', 'notPablikZak', 'MaxCountQuery', 'send_to_oos']);
		filedClearAndHide(['NereglZak', 'PodpDogEp']);
		if (UkazOtlDate.is(":checked")){
			filedShowAndRequired(['Otldatepod']);
		} else{
			filedClearAndHide(['Otldatepod']);
		}
		if (notPablikZak.is(":checked")){
			$("input[data-field-name='send_to_oos']").readonly()
			send_to_oos.prop('checked', true);
		} else if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		mestorasmpredl.prop("required", true);
		$("[data-related-field=mestorasmpredl]").addClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").show();
		mestorasmpredl.closest(".column-container").show();
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").show();
		//okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		/* mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val(''); */
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide();
		/* $("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide(); */
		Konksposob.closest(".column-container").show();
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		VskKonvertov.closest(".column-container").show();
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		mestoprovtorg.text('');
		mestoprovtorg.val('');
		porprovtorg.text('');
		porprovtorg.val('');
		porprovtorg.prop("required", false);
		$("[data-related-field=porprovtorg]").removeClass("label-required");
		porrasmzay.prop("required", true);
		porrasmzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porrasmzay]").addClass("label-required");
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");
		porpodvitog.prop("required", true);
		porpodvitog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porpodvitog]").addClass("label-required");
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		datetorg.prop("required", false);
		$("[data-related-field=datetorg]").removeClass("label-required");
		datetorg.parent().data("DateTimePicker").clear();
		poryadokpodzay.prop("required", true);
		poryadokpodzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().show();
		daterassm.prop("required", true);
		$("[data-related-field=daterassm]").addClass("label-required");
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		filedShow(['UkazOtlDate', 'predlpovrt']);
		if (porRassmZa.val() == "Заявки в двух частях (аналогично 94-ФЗ)") {
			$("[data-related-field=datesecondnapr]").closest(".column-container").hide();
			datesecondnapr.closest(".column-container").hide();
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().show();
			datesecondpod.prop("required", true);
			$("[data-related-field=datesecondpod]").addClass("label-required");
			poryadoksecondpod.prop("required", true);
			$("[data-related-field=poryadoksecondpod]").addClass("label-required");
			VskKonvertov.closest(".column-container").hide();
			VskKonvertov.prop('checked', false);
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
			mestovskrkonv.text('');
			mestovskrkonv.val('');
			porvskrkonv.prop("required", false);
			$("[data-related-field=porvskrkonv]").removeClass("label-required");
			porvskrkonv.text('');
			porvskrkonv.val('');
			datevskrkonv.prop("required", false);
			$("[data-related-field=datevskrkonv]").removeClass("label-required");
			datevskrkonv.parent().data("DateTimePicker").clear();
		}
		else {
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
			datesecondpod.prop("required", false);
			$("[data-related-field=datesecondpod]").removeClass("label-required");
			poryadoksecondpod.prop("required", false);
			$("[data-related-field=poryadoksecondpod]").removeClass("label-required");
			datesecondpod.parent().data("DateTimePicker").clear();
			datesecondnapr.parent().data("DateTimePicker").clear();
			mestosecondpod.text('');
			mestosecondpod.val('');
			poryadoksecondpod.text('');
			poryadoksecondpod.val('');
			VskKonvertov.closest(".column-container").show();
		}
		if (VskKonvertov.is(":checked")) {
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().show();
			datevskrkonv.prop("required", true);
			$("[data-related-field=datevskrkonv]").addClass("label-required");
			porvskrkonv.prop("required", true);
			porvskrkonv.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porvskrkonv]").addClass("label-required");
		}
		else {
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
			mestovskrkonv.text('');
			mestovskrkonv.val('');
			porvskrkonv.prop("required", false);
			$("[data-related-field=porvskrkonv]").removeClass("label-required");
			porvskrkonv.text('');
			porvskrkonv.val('');
			datevskrkonv.prop("required", false);
			$("[data-related-field=datevskrkonv]").removeClass("label-required");
			datevskrkonv.parent().data("DateTimePicker").clear();
		}
		if (okonpredl.is(":checked")) {
			/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().show();
			dateokonpodokonpredl.prop("required", true);
			$("[data-related-field=dateokonpodokonpredl]").addClass("label-required"); */
			poryadoknachpodokonpredl.prop("required", true);
			poryadoknachpodokonpredl.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=poryadoknachpodokonpredl]").addClass("label-required");
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().show();
			datenachpodokonpredl.prop("required", true);
			$("[data-related-field=datenachpodokonpredl]").addClass("label-required");
		} 
		else {
			poryadoknachpodokonpredl.prop("required", false);
			$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		/* 	$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			dateokonpodokonpredl.prop("required", false);
			$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
			dateokonpodokonpredl.parent().data("DateTimePicker").clear();
			mestookonpodokonpredl.text('');
			mestookonpodokonpredl.val('');
			poryadokokonpodokonpredl.text('');
			poryadokokonpodokonpredl.val(''); */
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
			datenachpodokonpredl.prop("required", false);
			$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
			datenachpodokonpredl.parent().data("DateTimePicker").clear();
			mestonachpodokonpredl.text('');
			mestonachpodokonpredl.val('');
			poryadoknachpodokonpredl.text('');
			poryadoknachpodokonpredl.val('');
		}
	}
	else if ((flag == '4' && flag2 == '113' && flag3 == '4') || (flag == '4' && flag2 == '113' && flag3 == '5') || (flag == '4' && flag2 == '113' && flag3 == '6')) {
		filedShow(['UkazOtlDate', 'emergencyZak', 'OsnZak', 'notPablikZak', 'NereglZak', 'MaxCountQuery', 'send_to_oos']);
		if (UkazOtlDate.is(":checked")){
			filedShowAndRequired(['Otldatepod']);
		} else{
			filedClearAndHide(['Otldatepod']);
		}
		if (NereglZak.is(":checked")){
			filedShow(['PodpDogEp']);
		} else{
			filedClearAndHide(['PodpDogEp']);
		}
		if (send_to_oos.is(":checked")){
			$("input[data-field-name='NereglZak']").readonly(false)
		} 
		else {
			$("input[data-field-name='NereglZak']").readonly()
			NereglZak.prop('checked', false);
			PodpDogEp.prop('checked', false);
			filedHide(['PodpDogEp']);
		}
		if (notPablikZak.is(":checked")){
			$("input[data-field-name='send_to_oos']").readonly()
			send_to_oos.prop('checked', true);
		} else if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		mestorasmpredl.prop("required", true);
		$("[data-related-field=mestorasmpredl]").addClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").show();
		mestorasmpredl.closest(".column-container").show();
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		/* Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false); */
		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		/* $("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear(); */
		/* mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val(''); */
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		/* poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required"); */
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide();
		/* $("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide(); */
		Konksposob.closest(".column-container").show();
		RasmZay.closest(".column-container").show();
		VskKonvertov.closest(".column-container").show();
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		poryadokpodzay.prop("required", true);
		poryadokpodzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		mestoprovtorg.text('');
		mestoprovtorg.val('');
		porprovtorg.text('');
		porprovtorg.val('');
		porprovtorg.prop("required", false);
		$("[data-related-field=porprovtorg]").removeClass("label-required");
		porpodvitog.prop("required", true);
		porpodvitog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porpodvitog]").addClass("label-required");
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		datetorg.prop("required", false);
		$("[data-related-field=datetorg]").removeClass("label-required");
		datetorg.parent().data("DateTimePicker").clear();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		poryadokpodzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		if (VskKonvertov.is(":checked")) {
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().show();
			datevskrkonv.prop("required", true);
			$("[data-related-field=datevskrkonv]").addClass("label-required");
			porvskrkonv.prop("required", true);
			porvskrkonv.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porvskrkonv]").addClass("label-required");
		}
		else {
			mestovskrkonv.text('');
			mestovskrkonv.val('');
			porvskrkonv.prop("required", false);
			$("[data-related-field=porvskrkonv]").removeClass("label-required");
			porvskrkonv.text('');
			porvskrkonv.val('');
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
			datevskrkonv.prop("required", false);
			$("[data-related-field=datevskrkonv]").removeClass("label-required");
			datevskrkonv.parent().data("DateTimePicker").clear();
		}
		if (RasmZay.is(":checked")) {
			$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassm]").closest("fieldset").parent().parent().show();
			daterassm.prop("required", true);
			$("[data-related-field=daterassm]").addClass("label-required");
			porrasmzay.prop("required", true);
			porrasmzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porrasmzay]").addClass("label-required");
		}
		else if(porRassmZa.val() != "Заявки в двух частях (аналогично 94-ФЗ)"){
			$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
			mestorasm.text('');
			mestorasm.val('');
			porrasmzay.prop("required", false);
			$("[data-related-field=porrasmzay]").removeClass("label-required");
			// porrasmzay.text('');
			// porrasmzay.val('');
			daterassm.prop("required", false);
			$("[data-related-field=daterassm]").removeClass("label-required");
			daterassm.parent().data("DateTimePicker").clear();
		}
		if(flag3=='4'){
			okonpredl.closest(".column-container").show();
			predlpovrt.closest(".column-container").show();
		}
		else{
			okonpredl.closest(".column-container").hide();
			okonpredl.prop('checked', false);
			filedClearAndHide(['predlpovrt']);
		}
		if (okonpredl.is(":checked")) {
			poryadoknachpodokonpredl.prop("required", true);
			poryadoknachpodokonpredl.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=poryadoknachpodokonpredl]").addClass("label-required");
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().show();
			datenachpodokonpredl.prop("required", true);
			$("[data-related-field=datenachpodokonpredl]").addClass("label-required");
		} else {
			poryadoknachpodokonpredl.prop("required", false);
			$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
			datenachpodokonpredl.prop("required", false);
			$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
			datenachpodokonpredl.parent().data("DateTimePicker").clear();
			mestonachpodokonpredl.text('');
			mestonachpodokonpredl.val('');
			poryadoknachpodokonpredl.text('');
			poryadoknachpodokonpredl.val('');
		}
		if (porRassmZa.val() == "Заявки в двух частях (аналогично 94-ФЗ)") {
			$("[data-related-field=datesecondnapr]").closest(".column-container").hide();
			datesecondnapr.closest(".column-container").hide();
			PodvItog.closest(".column-container").hide();
			PodvItog.prop('checked', false);
			mestovskrkonv.text('');
			mestovskrkonv.val('');
			porvskrkonv.prop("required", false);
			$("[data-related-field=porvskrkonv]").removeClass("label-required");
			porvskrkonv.text('');
			porvskrkonv.val('');
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
			datevskrkonv.prop("required", false);
			$("[data-related-field=datevskrkonv]").removeClass("label-required");
			datevskrkonv.parent().data("DateTimePicker").clear();
			VskKonvertov.closest(".column-container").hide();
			VskKonvertov.prop('checked', false);
			RasmZay.closest(".column-container").hide();
			RasmZay.prop('checked', false);
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().show();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().show();
			datesecondpod.prop("required", true);
			$("[data-related-field=datesecondpod]").addClass("label-required");
			poryadoksecondpod.prop("required", true);
			$("[data-related-field=poryadoksecondpod]").addClass("label-required");
			$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterassm]").closest("fieldset").parent().parent().show();
			daterassm.prop("required", true);
			$("[data-related-field=daterassm]").addClass("label-required");
			porrasmzay.prop("required", true);
			porrasmzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=porrasmzay]").addClass("label-required");
		} else{
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
			$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
			datesecondpod.prop("required", false);
			$("[data-related-field=datesecondpod]").removeClass("label-required");
			poryadoksecondpod.prop("required", false);
			$("[data-related-field=poryadoksecondpod]").removeClass("label-required");
			datesecondpod.parent().data("DateTimePicker").clear();
			datesecondnapr.parent().data("DateTimePicker").clear();
			mestosecondpod.text('');
			mestosecondpod.val('');
			poryadoksecondpod.text('');
			poryadoksecondpod.val('');
		}
	}
	else if (flag == '5' && flag2 == '113') {
		filedShow(['OsnZak', 'notPablikZak']);
		filedClearAndHide(['predlpovrt', 'UkazOtlDate', 'Otldatepod', 'send_to_oos', 'emergencyZak', 'NereglZak', 'PodpDogEp', 'MaxCountQuery']);
		if (notPablikZak.is(":checked")){
			$("input[data-field-name='send_to_oos']").readonly()
			send_to_oos.prop('checked', true);
		} else if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		mestorasmpredl.prop("required", true);
		$("[data-related-field=mestorasmpredl]").addClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").show();
		mestorasmpredl.closest(".column-container").show();
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		porrasmzay.prop("required", false);
		$("[data-related-field=porrasmzay]").removeClass("label-required");
		daterassm.parent().data("DateTimePicker").clear();
		mestorasm.text('');
		mestorasm.val('');
		porrasmzay.text('');
		porrasmzay.val('');
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().hide();
		datepoditog.prop("required", false);
		$("[data-related-field=datepoditog]").removeClass("label-required");
		porpodvitog.prop("required", false);
		$("[data-related-field=porpodvitog]").removeClass("label-required");
		datepoditog.parent().data("DateTimePicker").clear();
		mestopodvitog.text('');
		mestopodvitog.val('');
		porpodvitog.text('');
		porpodvitog.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		/* $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide(); */
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
		Konksposob.closest(".column-container").hide();
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		VskKonvertov.closest(".column-container").hide();
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		mestoprovtorg.text('');
		mestoprovtorg.val('');
		porprovtorg.text('');
		porprovtorg.val('');
		porprovtorg.prop("required", false);
		$("[data-related-field=porprovtorg]").removeClass("label-required");
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		datetorg.prop("required", false);
		$("[data-related-field=datetorg]").removeClass("label-required");
		datetorg.parent().data("DateTimePicker").clear();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().hide();
		datepoditog.prop("required", false);
		$("[data-related-field=datepoditog]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		poryadokpodzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
		mestovskrkonv.text('');
		mestovskrkonv.val('');
		porvskrkonv.prop("required", false);
		$("[data-related-field=porvskrkonv]").removeClass("label-required");
		porvskrkonv.text('');
		porvskrkonv.val('');
		datevskrkonv.prop("required", false);
		$("[data-related-field=datevskrkonv]").removeClass("label-required");
		datevskrkonv.parent().data("DateTimePicker").clear();
	}
	else if (flag2 == '1' && flag3 == '1') {
		filedShow(['emergencyZak']);
		filedClearAndHide(['UkazOtlDate', 'Otldatepod', 'predlpovrt', 'OsnZak', 'notPablikZak', 'NereglZak', 'PodpDogEp']);
		if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		poryadrasmfirstzay.prop("required", true);
		$("[data-related-field=poryadrasmfirstzay]").addClass("label-required");
		poryadoksecondpod.prop("required", true);
		$("[data-related-field=poryadoksecondpod]").addClass("label-required");
		porpodvitog.prop("required", true);
		$("[data-related-field=porpodvitog]").addClass("label-required");
		porrasmzay.prop("required", false);
		$("[data-related-field=porrasmzay]").removeClass("label-required");
		// porrasmzay.text('');
		// porrasmzay.val('');
		mestorasmpredl.prop("required", false);
		$("[data-related-field=mestorasmpredl]").removeClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").hide();
		mestorasmpredl.closest(".column-container").hide();
		poryadoknachpodzay.prop("required", true);
		$("[data-related-field=poryadoknachpodzay]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		poryadoksrokpodcenpredl.prop("required", false);
		$("[data-related-field=poryadoksrokpodcenpredl]").removeClass("label-required");
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		VskKonvertov.closest(".column-container").hide();
		VskKonvertov.prop('checked', false);
		Konksposob.closest(".column-container").hide();
		Konksposob.prop('checked', false);
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().show();
		datenachpod.prop("required", true);
		$("[data-related-field=datenachpod]").addClass("label-required");
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().show();
		datefirstpod.prop("required", true);
		$("[data-related-field=datefirstpod]").addClass("label-required");
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		daterassm.parent().data("DateTimePicker").clear();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		datenachsrokpodpredl.prop("required", false);
		$("[data-related-field=datenachsrokpodpredl]").removeClass("label-required");
		datenachsrokpodpredl.parent().data("DateTimePicker").clear();
		mestopodsrokcenpredl.text('');
		mestopodsrokcenpredl.val('');
		poryadoksrokpodcenpredl.text('');
		poryadoksrokpodcenpredl.val('');

		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		/* if (predkvalotbr.is(":checked")) {
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().show();
			dateprovkvaloybr.prop("required", true);
			$("[data-related-field=dateprovkvaloybr]").addClass("label-required");
		}
		else {
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide();
			dateprovkvaloybr.prop("required", false);
			$("[data-related-field=dateprovkvaloybr]").removeClass("label-required");
			dateprovkvaloybr.parent().data("DateTimePicker").clear();
			mestoprovkvaloybr.text('');
			mestoprovkvaloybr.val('');
			poryadokprovkvaloybr.text('');
			poryadokprovkvaloybr.val('');
		} */
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().show();
		datesecondpod.prop("required", true);
		$("[data-related-field=datesecondpod]").addClass("label-required");

		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");
	}
	else if (flag2 == '1' && flag3 == '2') {
		filedShow(['emergencyZak']);
		filedClearAndHide(['UkazOtlDate', 'Otldatepod', 'predlpovrt', 'OsnZak', 'notPablikZak', 'NereglZak', 'PodpDogEp']);
		if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		mestorasmpredl.prop("required", false);
		$("[data-related-field=mestorasmpredl]").removeClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").hide();
		mestorasmpredl.closest(".column-container").hide();
		poryadoknachpodzay.prop("required", true);
		$("[data-related-field=poryadoknachpodzay]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		porrasmzay.prop("required", false);
		$("[data-related-field=porrasmzay]").removeClass("label-required");
		porrasmzay.text('');
		porrasmzay.val('');
		mestorasm.text('');
		mestorasm.val('');
		porpodvitog.prop("required", true);
		$("[data-related-field=porpodvitog]").addClass("label-required");
		poryadrasmfirstzay.prop("required", false);
		$("[data-related-field=poryadrasmfirstzay]").removeClass("label-required");
		poryadoksrokpodcenpredl.prop("required", false);
		$("[data-related-field=poryadoksrokpodcenpredl]").removeClass("label-required");
		poryadoksecondpod.prop("required", false);
		$("[data-related-field=poryadoksecondpod]").removeClass("label-required");
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		VskKonvertov.closest(".column-container").hide();
		VskKonvertov.prop('checked', false);
		Konksposob.closest(".column-container").hide();
		Konksposob.prop('checked', false);
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().show();
		datenachpod.prop("required", true);
		$("[data-related-field=datenachpod]").addClass("label-required");
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().hide();
		datefirstpod.prop("required", false);
		$("[data-related-field=datefirstpod]").removeClass("label-required");
		datefirstpod.parent().data("DateTimePicker").clear();
		mestorasmfirstzay.text('');
		mestorasmfirstzay.val('');
		poryadrasmfirstzay.text('');
		poryadrasmfirstzay.val('');
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		daterassm.parent().data("DateTimePicker").clear();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		datenachsrokpodpredl.prop("required", false);
		$("[data-related-field=datenachsrokpodpredl]").removeClass("label-required");
		datenachsrokpodpredl.parent().data("DateTimePicker").clear();
		mestopodsrokcenpredl.text('');
		mestopodsrokcenpredl.val('');
		poryadoksrokpodcenpredl.text('');
		poryadoksrokpodcenpredl.val('');

		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide();
		// dateprovkvaloybr.prop("required", false);
		// $("[data-related-field=dateprovkvaloybr]").removeClass("label-required");
		// dateprovkvaloybr.parent().data("DateTimePicker").clear();
		// mestoprovkvaloybr.text('');
		// mestoprovkvaloybr.val('');

		// poryadokprovkvaloybr.text('');
		// poryadokprovkvaloybr.val('');;

		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
		datesecondpod.prop("required", false);
		$("[data-related-field=datesecondpod]").removeClass("label-required");
		datesecondpod.parent().data("DateTimePicker").clear();
		datesecondnapr.parent().data("DateTimePicker").clear();
		mestosecondpod.text('');
		mestosecondpod.val('');
		poryadoksecondpod.text('');
		poryadoksecondpod.val('');

		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");
		datepoditog.closest(".column-container").show();
		$("[data-related-field=datepoditog]").closest(".column-container").show();
		mestopodvitog.closest(".column-container").show();
		$("[data-related-field=mestopodvitog]").show();
		porpodvitog.closest(".column-container").show();
		$("[data-related-field=porpodvitog]").show();
	}
	else if (flag2 == '1' && flag3 == '3') {
		filedShow(['emergencyZak']);
		filedClearAndHide(['UkazOtlDate', 'Otldatepod', 'predlpovrt', 'OsnZak', 'notPablikZak', 'NereglZak', 'PodpDogEp']);
		if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		porrasmzay.prop("required", false);
		$("[data-related-field=porrasmzay]").removeClass("label-required");
		// porrasmzay.text('');
		// porrasmzay.val('');
		porpodvitog.prop("required", true);
		$("[data-related-field=porpodvitog]").addClass("label-required");
		mestorasmpredl.prop("required", false);
		$("[data-related-field=mestorasmpredl]").removeClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").hide();
		mestorasmpredl.closest(".column-container").hide();
		poryadoknachpodzay.prop("required", true);
		$("[data-related-field=poryadoknachpodzay]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		VskKonvertov.closest(".column-container").hide();
		VskKonvertov.prop('checked', false);
		Konksposob.closest(".column-container").hide();
		Konksposob.prop('checked', false);
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().show();
		datenachpod.prop("required", true);
		$("[data-related-field=datenachpod]").addClass("label-required");
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().show();
		datefirstpod.prop("required", true);
		$("[data-related-field=datefirstpod]").addClass("label-required");
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		daterassm.parent().data("DateTimePicker").clear();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().show();
		datenachsrokpodpredl.prop("required", true);
		$("[data-related-field=datenachsrokpodpredl]").addClass("label-required");

		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		/* if (predkvalotbr.is(":checked")) {
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().show();
			dateprovkvaloybr.prop("required", true);
			$("[data-related-field=dateprovkvaloybr]").addClass("label-required");
		} else {
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide();
			dateprovkvaloybr.prop("required", false);
			$("[data-related-field=dateprovkvaloybr]").removeClass("label-required");
			dateprovkvaloybr.parent().data("DateTimePicker").clear();
			mestoprovkvaloybr.text('');
			mestoprovkvaloybr.val('');
			poryadokprovkvaloybr.text('');
			poryadokprovkvaloybr.val('');
		} */
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().show();
		datesecondpod.prop("required", true);
		$("[data-related-field=datesecondpod]").addClass("label-required");

		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");

		poryadrasmfirstzay.prop("required", true);
		$("[data-related-field=poryadrasmfirstzay]").addClass("label-required");
		poryadoksrokpodcenpredl.prop("required", true);
		$("[data-related-field=poryadoksrokpodcenpredl]").addClass("label-required");
		poryadoksecondpod.prop("required", true);
		$("[data-related-field=poryadoksecondpod]").addClass("label-required");
	}
	else if (flag2 == '1' && flag3 == '4') {
		filedShow(['emergencyZak']);
		filedClearAndHide(['UkazOtlDate', 'Otldatepod', 'predlpovrt', 'OsnZak', 'notPablikZak', 'NereglZak', 'PodpDogEp']);
		if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		notRNP.closest(".column-container").show();
		ramZakup.closest(".column-container").hide();
		ramZakup.prop('checked', false);
		poryadrasmfirstzay.prop("required", true);
		$("[data-related-field=poryadrasmfirstzay]").addClass("label-required");
		porpodvitog.prop("required", true);
		$("[data-related-field=porpodvitog]").addClass("label-required");
		porrasmzay.prop("required", false);
		$("[data-related-field=porrasmzay]").removeClass("label-required");
		// porrasmzay.text('');
		// porrasmzay.val('');
		mestorasmpredl.prop("required", false);
		$("[data-related-field=mestorasmpredl]").removeClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").hide();
		mestorasmpredl.closest(".column-container").hide();
		poryadoknachpodzay.prop("required", true);
		$("[data-related-field=poryadoknachpodzay]").addClass("label-required");
		poryadokpodzay.prop("required", true);
		$("[data-related-field=poryadokpodzay]").addClass("label-required");
		poryadoksrokpodcenpredl.prop("required", false);
		$("[data-related-field=poryadoksrokpodcenpredl]").removeClass("label-required");
		poryadoksecondpod.prop("required", false);
		$("[data-related-field=poryadoksecondpod]").removeClass("label-required");
		sopostcenpredl.closest(".column-container").show();
		doppredl.closest(".column-container").show();
		okonpredl.closest(".column-container").show();
		obspredlofuncfar.closest(".column-container").show();
		obsfuncfar.closest(".column-container").show();
		VskKonvertov.closest(".column-container").hide();
		VskKonvertov.prop('checked', false);
		Konksposob.closest(".column-container").hide();
		Konksposob.prop('checked', false);
		RasmZay.closest(".column-container").hide();
		RasmZay.prop('checked', false);
		PodvItog.closest(".column-container").hide();
		PodvItog.prop('checked', false);
		$("input[name='doppredl']").parents('.column-container').removeClass('col-xs-1').addClass('col-xs-2');
		$("input[name='sopostcenpredl']").parents('.column-container').removeClass('col-xs-1').addClass('col-xs-2');
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().show();
		datenachpod.prop("required", true);
		$("[data-related-field=datenachpod]").addClass("label-required");
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().show();
		dateokonpod.prop("required", true);
		$("[data-related-field=dateokonpod]").addClass("label-required");
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().show();
		datefirstpod.prop("required", true);
		$("[data-related-field=datefirstpod]").addClass("label-required");
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		daterassm.parent().data("DateTimePicker").clear();
		daterassm.parent().data("DateTimePicker").clear();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		datenachsrokpodpredl.prop("required", false);
		$("[data-related-field=datenachsrokpodpredl]").removeClass("label-required");
		datenachsrokpodpredl.parent().data("DateTimePicker").clear();
		mestopodsrokcenpredl.text('');
		mestopodsrokcenpredl.val('');
		poryadoksrokpodcenpredl.text('');
		poryadoksrokpodcenpredl.val('');
		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		/* if (predkvalotbr.is(":checked")) {
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().show();
			dateprovkvaloybr.prop("required", true);
			$("[data-related-field=dateprovkvaloybr]").addClass("label-required");
		} else {
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide();
			dateprovkvaloybr.prop("required", false);
			$("[data-related-field=dateprovkvaloybr]").removeClass("label-required");
			dateprovkvaloybr.parent().data("DateTimePicker").clear();
			mestoprovkvaloybr.text('');
			mestoprovkvaloybr.val('');
			poryadokprovkvaloybr.text('');
			poryadokprovkvaloybr.val('');
		} */
		Secondpart.closest(".column-container").hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().show();
		datesecondpod.prop("required", true);
		$("[data-related-field=datesecondpod]").addClass("label-required");
		poryadoksecondpod.prop("required", true);
		$("[data-related-field=poryadoksecondpod]").addClass("label-required");
		/* if(Secondpart.is(":checked")){
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().show();
			datesecondpod.prop("required", true);
			$("[data-related-field=datesecondpod]").addClass("label-required");
			poryadoksecondpod.prop("required", true);
			$("[data-related-field=poryadoksecondpod]").addClass("label-required");
		} else {
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
			poryadoksecondpod.prop("required", false);
			$("[data-related-field=poryadoksecondpod]").removeClass("label-required");
			datesecondpod.prop("required", false);
			$("[data-related-field=datesecondpod]").removeClass("label-required");
			datesecondpod.parent().data("DateTimePicker").clear();
			mestosecondpod.text('');
			mestosecondpod.val('');
			poryadoksecondpod.text('');
			poryadoksecondpod.val('');
		} */
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		if (sopostcenpredl.is(":checked")) {
			$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().show();
			dateprovsopost.prop("required", true);
			$("[data-related-field=dateprovsopost]").addClass("label-required");
		} else {
			$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
			dateprovsopost.prop("required", false);
			$("[data-related-field=dateprovsopost]").removeClass("label-required");
			dateprovsopost.parent().data("DateTimePicker").clear();
			mestoprovsopost.text('');
			mestoprovsopost.val('');
			poryadokprovsopost.text('');
			poryadokprovsopost.val('');
		}
		if (doppredl.is(":checked")) {
			$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().show();
			datepoddoppredl.prop("required", true);
			$("[data-related-field=datepoddoppredl]").addClass("label-required");
			$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().show();
			dateokonpoddoppredl.prop("required", true);
			$("[data-related-field=dateokonpoddoppredl]").addClass("label-required");
		} else {
			$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
			datepoddoppredl.prop("required", false);
			$("[data-related-field=datepoddoppredl]").removeClass("label-required");
			datepoddoppredl.parent().data("DateTimePicker").clear();
			mestopoddoppredl.text('');
			mestopoddoppredl.val('');
			poryadokpoddoppredl.text('');
			poryadokpoddoppredl.val('');
			$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
			dateokonpoddoppredl.prop("required", false);
			$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
			dateokonpoddoppredl.parent().data("DateTimePicker").clear();
			mestookonpoddoppredl.text('');
			mestookonpoddoppredl.val('');
			poryadokokonpoddoppredl.text('');
			poryadokokonpoddoppredl.val('');
		}
		if (okonpredl.is(":checked")) {
			$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().show();
			daterasmpodokonpredl.prop("required", true);
			$("[data-related-field=daterasmpodokonpredl]").addClass("label-required");
		} else {
			$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
			daterasmpodokonpredl.prop("required", false);
			$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
			daterasmpodokonpredl.parent().data("DateTimePicker").clear();
			poryadokrasmpodokonpredl.text('');
			poryadokrasmpodokonpredl.val('');
			mestorasmpodokonpredl.text('');
			mestorasmpodokonpredl.val('');
		/* 	$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
			dateokonpodokonpredl.prop("required", false);
			$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
			dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		}
		if (obspredlofuncfar.is(":checked")) {
			$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().show();
			dateokonobspredl.prop("required", true);
			$("[data-related-field=dateokonobspredl]").addClass("label-required");
			$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().show();
			datenachobspredl.prop("required", true);
			$("[data-related-field=datenachobspredl]").addClass("label-required");
		} else {
			$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
			dateokonobspredl.prop("required", false);
			$("[data-related-field=dateokonobspredl]").removeClass("label-required");
			dateokonobspredl.parent().data("DateTimePicker").clear();
			poryadokokonobspredl.text('');
			poryadokokonobspredl.val('');
			mestookonobspredl.text('');
			mestookonobspredl.val('');
			$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
			datenachobspredl.prop("required", false);
			$("[data-related-field=datenachobspredl]").removeClass("label-required");
			datenachobspredl.parent().data("DateTimePicker").clear();
			mestonachobspredl.text('');
			mestonachobspredl.val('');
			poryadoknachobspredl.text('');
			poryadoknachobspredl.val('');
		}
		if (obsfuncfar.is(":checked")) {
			$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().show();
			dateokonobshar.prop("required", true);
			$("[data-related-field=dateokonobshar]").addClass("label-required");
			$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().show();
			datenachobshar.prop("required", true);
			$("[data-related-field=datenachobshar]").addClass("label-required");
			$("[data-related-field=poryadoknachobshar]").addClass("label-required");
			poryadoknachobshar.prop("required", true);
		} else {
			$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
			dateokonobshar.prop("required", false);
			$("[data-related-field=dateokonobshar]").removeClass("label-required");
			dateokonobshar.parent().data("DateTimePicker").clear();
			poryadokokonobshar.text('');
			poryadokokonobshar.val('');
			mestookonobshar.text('');
			mestookonobshar.val('');
			$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
			$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
			datenachobshar.prop("required", false);
			$("[data-related-field=datenachobshar]").removeClass("label-required");
			datenachobshar.parent().data("DateTimePicker").clear();
			mestonachobshar.text('');
			mestonachobshar.val('');
			poryadoknachobshar.text('');
			poryadoknachobshar.val('');
			$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
			poryadoknachobshar.prop("required", false);
		}
	} 	
	else if (flag2 == 2 && flag3 != '') {
		
		var UnionArr = []; // результат конкатенации масивов
		var CustomArr = []; // кастомный массив для тех случаев, когда не ложится под общую логику
		var UnionArrClearField = []; // тут хранится конкатенация массивов по очистке содержимых полей
		var BlocksHide = ['Начало подачи заявок', 'Начало обсуждения функциональных характеристик', 'Окончание обсуждения функциональных характеристик', 'Начало обсуждения предложений о функциональных характеристиках', 'Окончание обсуждения предложений о функциональных характеристиках', 'Окончание подачи заявок', 'Приём заявок', 'Рассмотрение и оценка окончательных предложений', 'Вскрытие конвертов', 'Рассмотрение 1х частей', 'Подача дополнительных ценовых предложений', 'Окончание подачи дополнительных ценовых предложений', 'Проведение сопоставления ценовых предложений', 'Подача ценовых предложений', 'Рассмотрение заявок', 'Подача предложений о цене', 'Начало подачи окончательных предложений', 'Рассмотрение 2х частей', 'Проведение торгов', 'Подведение итогов']; // скрываем все блоки
		var FieldHide = ['Konksposob', 'VskKonvertov', 'RasmZay', 'PodvItog', 'Secondpart', 'obsfuncfar', 'obspredlofuncfar', 'okonpredl', 'doppredl', 'sopostcenpredl', 'ramZakup', 'bazisNds', 'send_to_oos', 'notRNP', 'predlpovrt', 'emergencyZak']; // чекбоксы, которые не используются для Сбербанк-АСТ
		
		var RequiredFieldForSber = ['SendToEISCode']; // список полей обязательных для сбера
		
		if (statusnotice=="Внесение изменений" || numRed >1){
			$("input[data-field-name='send_to_oos']").readonly()
		} else {
			$("input[data-field-name='send_to_oos']").readonly(false)
		}
		
		// обязательные поля
			filedShowAndRequired(RequiredFieldForSber);
		// обязательные поля
		
		
		// Скрываю лишние поля
		// Начало
			// скрываем лишние поля
			filedClearAndHide(['mestorasmpredl', 'emergencyZak', 'OsnZak', 'notPablikZak', 'NereglZak', 'PodpDogEp']);
			filedClearAndDoNotRequired(['datenachsrokpodpredl', 'mestopodsrokcenpredl', 'poryadoksrokpodcenpredl', 'ricesProvisionEndDate']); // чистим и делаем не обязательными
			
			// скрываем лишние блоки
			BlocksHide.forEach(function(item, i){
				var CurrentLegend = $($("div fieldset legend:contains('"+item+"')")).closest(".column-container");
				CurrentLegend.hide();
				CurrentLegend.closest('.row-container').next().hide();
			});
			
			// скрываем лишние элементы
			FieldHide.forEach(function(item, i){
				var CurrentField= $("input[data-field-name='"+item+"']").closest('.column-container');
				CurrentField.prop('checked', false);
				CurrentField.hide();
			});
			
		
		// Конец
		
		// Блок начала подачи заявок
		var ApplicationSubmissionStartLegend = $($("div fieldset legend:contains('Начало подачи заявок')")[0]).closest(".column-container");
		var ArrApplicationSubmissionStart = ['datenachpod', 'mestonachpodzay', 'poryadoknachpodzay', 'dateokonpodSingleBlock']; // Все поля в блоке
		var RequiredArrApplicationSubmissionStart = ['datenachpod', 'dateokonpodSingleBlock', 'poryadoknachpodzay'];  // обязательны поля в блоке
		
		// Блок Рассмотрение 1х частей
		var ApplicationSubmissionFirstReviewLegend = $($("div fieldset legend:contains('Рассмотрение 1х частей')")[0]).closest(".column-container");
		var ArrApplicationSubmissionFirstReview = ['datefirstpod', 'mestorasmfirstzay', 'poryadrasmfirstzay']; // Все поля в блоке
		var RequiredArrApplicationSubmissionFirstReview = ['datefirstpod', 'poryadrasmfirstzay'];  // обязательны поля в блоке
		
		// Блок Подача ценовых предложений
		var ApplicationSubmissionPriceOffersLegend = $($("div fieldset legend:contains('Подача предложений о цене')")[0]).closest(".column-container");
		var ArrApplicationSubmissionPriceOffers = ['PricesProvisionStartDate', 'PricesProvisionEndDateSber', 'PricesProvisionPlace', 'PricesProvisionOrder']; // Все поля в блоке
		var RequiredArrApplicationSubmissionPriceOffers = ['PricesProvisionStartDate', 'PricesProvisionOrder'];  // обязательны поля в блоке
		
		// Блок Рассмотрение заявок
		var ApplicationSubmissionReviewLegend = $($("div fieldset legend:contains('Рассмотрение заявок')")[0]).closest(".column-container");
		var ArrApplicationSubmissionReview = ['daterassm', 'mestorasm', 'porrasmzay', 'OpenEnvelopeDate']; // Все поля в блоке
		var RequiredArrApplicationSubmissionReview = ['daterassm', 'porrasmzay']; // обязательны поля в блоке
		
		// Блок Рассмотрение 2х частей
		var ApplicationSubmissionSecondReviewLegend = $($("div fieldset legend:contains('Рассмотрение 2х частей')")[0]).closest(".column-container");
		var ArrApplicationSubmissionSecondReview = ['datesecondpod', 'datesecondnapr', 'mestosecondpod', 'poryadoksecondpod']; // Все поля в блоке
		var RequiredArrApplicationSubmissionSecondReview = ['datesecondpod', 'poryadoksecondpod'];  // обязательны поля в блоке
		
		// Блок Подведение итогов
		var ApplicationSubmissionSummingUpLegend = $($("div fieldset legend:contains('Подведение итогов')")[0]).closest(".column-container");
		var ArrApplicationSubmissionSummingUp = ['datepoditog', 'mestopodvitog', 'porpodvitog'];  // Все поля в блоке
		var RequiredArrApplicationSubmissionSummingUp = ['datepoditog', 'porpodvitog'];  // обязательны поля в блоке
		

		// логика вскрытия/отображения этапов
		if (['20', '16'].indexOf(flag3) > -1) {
		// (20)Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// (16)Аукцион (заявка из 2-х частей)
			
			// Блок начала подачи заявок
			ApplicationSubmissionStartLegend.show();
			ApplicationSubmissionStartLegend.closest('.row-container').next().show();
			/* $("textarea[data-field-name='mestonachpodzay']").closest(".column-container").hide();	// скрыть место начала подачи заявок
			$("div.documentView-field-label[data-related-field='mestonachpodzay']").closest(".column-container").hide();	// скрыть место начала подачи заявок */
			
			// Блок Рассмотрение 1х частей
			ApplicationSubmissionFirstReviewLegend.show();
			ApplicationSubmissionFirstReviewLegend.closest('.row-container').next().show();
			
			// Блок Подача ценовых предложений
			ApplicationSubmissionPriceOffersLegend.show();
			ApplicationSubmissionPriceOffersLegend.closest('.row-container').next().show();
			
			// Блок Рассмотрение 2х частей
			ApplicationSubmissionSecondReviewLegend.show();
			ApplicationSubmissionSecondReviewLegend.closest('.row-container').next().show();
			
			// Блок Подведение итогов
			ApplicationSubmissionSummingUpLegend.show();
			
			
			UnionArr = [].concat(RequiredArrApplicationSubmissionStart, RequiredArrApplicationSubmissionFirstReview, RequiredArrApplicationSubmissionPriceOffers, RequiredArrApplicationSubmissionSecondReview, RequiredArrApplicationSubmissionSummingUp); // формируем список полей, которые должны быть обяазтельными
			filedShowAndRequired(UnionArr); // вызываем функцию
			
			UnionArrClearField = [].concat(ArrApplicationSubmissionReview); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
		
		} 
		else if (['21', '25', '15', '18'].indexOf(flag3) > -1) {
			// (21)Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
			// (25)Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
			// (15)Конкурс (заявка из 2-х частей)
			// (18)Запрос предложений (заявка из 2-х частей)
			
			// Блок начала подачи заявок
			ApplicationSubmissionStartLegend.show();
			ApplicationSubmissionStartLegend.closest('.row-container').next().show();
			
			// Блок Рассмотрение 1х частей
			ApplicationSubmissionFirstReviewLegend.show();
			ApplicationSubmissionFirstReviewLegend.closest('.row-container').next().show();
			
			// Блок Рассмотрение 2х частей
			ApplicationSubmissionSecondReviewLegend.show();
			ApplicationSubmissionSecondReviewLegend.closest('.row-container').next().show();
			
			// Блок Подведение итогов
			ApplicationSubmissionSummingUpLegend.show();
			
			UnionArr = [].concat(RequiredArrApplicationSubmissionStart, RequiredArrApplicationSubmissionFirstReview, RequiredArrApplicationSubmissionSecondReview, RequiredArrApplicationSubmissionSummingUp) ; // формируем список полей, которые должны быть обяазтельными
			filedShowAndRequired(UnionArr); // вызываем функцию
			
			UnionArrClearField = [].concat(ArrApplicationSubmissionPriceOffers, ArrApplicationSubmissionReview); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
				
		} 
		else if(['22'].indexOf(flag3) > -1) {
			// (22)Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства	
			
			// Блок начала подачи заявок
			ApplicationSubmissionStartLegend.show();
			ApplicationSubmissionStartLegend.closest('.row-container').next().show();
			
			// Блок Подведение итогов
			ApplicationSubmissionSummingUpLegend.show();
			
			UnionArr = [].concat(RequiredArrApplicationSubmissionStart, RequiredArrApplicationSubmissionSummingUp); // формируем список полей, которые должны быть обяазтельными
			filedShowAndRequired(UnionArr); // вызываем функцию
			
			UnionArrClearField = [].concat(ArrApplicationSubmissionFirstReview, ArrApplicationSubmissionPriceOffers, ArrApplicationSubmissionReview, ArrApplicationSubmissionSecondReview); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
			
		} 
		else if (['11', '13', '14', '17', '59'].indexOf(flag3) > -1) {
			// (11)Конкурс	
			// (13)Запрос предложений	
			// (14)Запрос котировок	
			// (17)Запрос котировок (заявка из 2-х частей)		
			// (59)Квалификационный отбор в электронной форме	
			
			// Блок начала подачи заявок
			ApplicationSubmissionStartLegend.show();
			ApplicationSubmissionStartLegend.closest('.row-container').next().show();
			
			// Блок Рассмотрение заявок
			ApplicationSubmissionReviewLegend.show();
			ApplicationSubmissionReviewLegend.closest('.row-container').next().show();
			
			// Блок Подведение итогов
			ApplicationSubmissionSummingUpLegend.show();
			
			UnionArr = [].concat(RequiredArrApplicationSubmissionStart, RequiredArrApplicationSubmissionReview, RequiredArrApplicationSubmissionSummingUp); // формируем список полей, которые должны быть обяазтельными
			filedShowAndRequired(UnionArr); // вызываем функцию
			
			UnionArrClearField = [].concat(ArrApplicationSubmissionFirstReview, ArrApplicationSubmissionPriceOffers, ArrApplicationSubmissionSecondReview); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
			
		} 
		else if (['12', '63'].indexOf(flag3) > -1) {
			// (12)Аукцион	
			// (63)Аукцион с двумя частями заявок	
			
			// Блок начала подачи заявок
			ApplicationSubmissionStartLegend.show();
			ApplicationSubmissionStartLegend.closest('.row-container').next().show();
			
			// Блок Подача ценовых предложений
			ApplicationSubmissionPriceOffersLegend.show();
			ApplicationSubmissionPriceOffersLegend.closest('.row-container').next().show();
			
			// Блок Рассмотрение заявок
			ApplicationSubmissionReviewLegend.show();
			ApplicationSubmissionReviewLegend.closest('.row-container').next().show();
			
			// Блок Подведение итогов
			ApplicationSubmissionSummingUpLegend.show();
			
			UnionArr = [].concat(RequiredArrApplicationSubmissionStart, RequiredArrApplicationSubmissionPriceOffers, RequiredArrApplicationSubmissionReview, RequiredArrApplicationSubmissionSummingUp); // формируем список полей, которые должны быть обяазтельными
			filedShowAndRequired(UnionArr); // вызываем функцию
			
			UnionArrClearField = [].concat(ArrApplicationSubmissionFirstReview, ArrApplicationSubmissionSecondReview); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
			
		} 
		else if (['68'].indexOf(flag3) > -1) {
			// (68)Аукцион в электронной форме
			
			// Блок начала подачи заявок
			ApplicationSubmissionStartLegend.show();
			ApplicationSubmissionStartLegend.closest('.row-container').next().show();
			
			// Блок Подача ценовых предложений
			ApplicationSubmissionPriceOffersLegend.show();
			ApplicationSubmissionPriceOffersLegend.closest('.row-container').next().show();			
			
			// Блок Подведение итогов
			ApplicationSubmissionSummingUpLegend.show();
			
			UnionArr = [].concat(RequiredArrApplicationSubmissionStart, RequiredArrApplicationSubmissionPriceOffers, RequiredArrApplicationSubmissionSummingUp); // формируем список полей, которые должны быть обяазтельными
			filedShowAndRequired(UnionArr); // вызываем функцию
			
			UnionArrClearField = [].concat(ArrApplicationSubmissionFirstReview,  ArrApplicationSubmissionReview, ArrApplicationSubmissionSecondReview); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
			
		} 
		else if (['26'].indexOf(flag3) > -1) {
			// (26)Запрос цен (коммерческих предложений)
			
			// Блок Подача ценовых предложений
			ApplicationSubmissionPriceOffersLegend.show();
			ApplicationSubmissionPriceOffersLegend.closest('.row-container').next().show();
			
			
			// custom
			UnionArr.push('PricesProvisionEndDateSber', 'PricesProvisionStartDate'); // добавляем кастомное поле
			filedHide(['PricesProvisionPlace', 'PricesProvisionOrder']);
			// custom
			
			filedShowAndRequired(UnionArr); // вызываем функцию
			
			UnionArrClearField = [].concat(ArrApplicationSubmissionStart, ArrApplicationSubmissionFirstReview, ArrApplicationSubmissionReview, ArrApplicationSubmissionSecondReview, ArrApplicationSubmissionSummingUp); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
			
		} 
		else {
			UnionArrClearField = [].concat(ArrApplicationSubmissionStart, ArrApplicationSubmissionFirstReview, ArrApplicationSubmissionPriceOffers, ArrApplicationSubmissionReview, ArrApplicationSubmissionSecondReview, ArrApplicationSubmissionSummingUp); // формируем список полей, которые должны быть очищены
			filedClearAndDoNotRequired(UnionArrClearField); // вызываем функцию
		}
		
		// логика  вскрытия/отображения полей
		
		if (['20', '21', '22', '25'].indexOf(flag3) > -1) {
			// (20)Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
			// (21)Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
			// (22)Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства	
			// (25)Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
			
			
			// чистим и скрываем поля
			filedClearAndHide(['createprotocolopenenvelope', 'PurchaseNotDishonestSber' , 'PurchaseTransferCoverAmountSber']);
		} 
		else if (['26'].indexOf(flag3) > -1) {
			// (26)Запрос цен (коммерческих предложений)
			
			CustomArr = ['SendToEISCode', 'SendToEISName', 'PurchaseEmergency', 'createprotocolopenenvelope', 'purchaseforeignrequestincurrency', 'purchaseforeignrequestcurrencydate', 'PurchaseNotDishonestSber', 'PurchaseTransferCoverAmountSber'];
			// чистим и скрываем поля
			filedClearAndHide(CustomArr);
		}
		else if (['59'].indexOf(flag3) > -1) {
			CustomArr = ['PurchaseTransferCoverAmountSber'];
			// чистим и скрываем поля
			filedClearAndHide(CustomArr);
		}
		else {
			
			// отображение полей
			filedShow(['createprotocolopenenvelope', 'PurchaseNotDishonestSber' , 'PurchaseTransferCoverAmountSber']);
			
		}
		
		// убираем кастомнон поле  "Дата и время окончания срока подачи предложений"
		if (['26'].indexOf(flag3) == -1) {
			
			filedClearAndHide(['PricesProvisionEndDateSber']); // чистим кастомное поле
			filedShowAndRequired(['SendToEISCode']); // возвращаем обязательность  "Направить в ЕИС в ЛК организации"
		}
		
		// hideCurs Подача заявок в валюте отличной от валюты лота
		// НАЧАЛО
		function hideCurs() {
			var purchaseforeignrequestincurrency = $("input[data-field-name='purchaseforeignrequestincurrency']");
			if (purchaseforeignrequestincurrency.is(':checked')) {
				filedShowAndRequired(['purchaseforeignrequestcurrencydate']);
			} 
			else {
				filedClearAndHide(['purchaseforeignrequestcurrencydate']);
			}
		}
		
		$("input[data-field-name='purchaseforeignrequestincurrency']").on('change', function() {
			hideCurs();
		})
		
		hideCurs();
		// КОНЕЦ
		// hideCurs 
		
		// hideDocPaiment Требуется плата за предоставление документации
		// НАЧАЛО
		function hideDocPaiment() {
			var PurchaseDocumentationPayment = $("input[data-field-name='PurchaseDocumentationPayment']"); 
			var ArrDocPaiment = ['PurchaseDocumentationPaymentAmount', 'PurchaseDocumentationPaymentCurrencyCode' , 'PurchaseDocumentationPaymentCurrencyName', 'PurchaseDocumentationPaymentOrder']
			if (PurchaseDocumentationPayment.is(':checked')) {
				filedShowAndRequired(ArrDocPaiment);
			} 
			else {
				filedClearAndHide(ArrDocPaiment);
			}
			
		}
		
		$("input[data-field-name='PurchaseDocumentationPayment']").on('change', function() {
			hideDocPaiment();
		});
		
		hideDocPaiment();
		// КОНЕЦ
		// hideDocPaiment
		
				
	}
	else {
		filedClearAndHide(['UkazOtlDate', 'Otldatepod', 'predlpovrt', 'OsnZak', 'notPablikZak', 'NereglZak', 'PodpDogEp', 'longSrokProcedure', 'emergencyZak', 'MaxCountQuery']);
		mestorasmpredl.prop("required", false);
		$("[data-related-field=mestorasmpredl]").removeClass("label-required");
		$("[data-related-field=mestorasmpredl]").closest(".column-container").hide();
		mestorasmpredl.closest(".column-container").hide();
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		poryadoknachpodzay.prop("required", false);
		$("[data-related-field=poryadoknachpodzay]").removeClass("label-required");
		RasmZay.closest(".column-container").hide();
		$("[data-related-field=RasmZay]").closest(".column-container").hide();
		RasmZay.prop('checked', false);
		Konksposob.closest(".column-container").hide();
		$("[data-related-field=Konksposob]").closest(".column-container").hide();
		Konksposob.prop('checked', false);
		VskKonvertov.closest(".column-container").hide();
		$("[data-related-field=VskKonvertov]").closest(".column-container").hide();
		VskKonvertov.prop('checked', false);
		PodvItog.closest(".column-container").hide();
		$("[data-related-field=PodvItog]").closest(".column-container").hide();
		PodvItog.prop('checked', false);
		poryadrasmfirstzay.prop("required", false);
		$("[data-related-field=poryadrasmfirstzay]").removeClass("label-required");
		poryadoksrokpodcenpredl.prop("required", false);
		$("[data-related-field=poryadoksrokpodcenpredl]").removeClass("label-required");
		poryadoksecondpod.prop("required", false);
		$("[data-related-field=poryadoksecondpod]").removeClass("label-required");
		mestopodzay.text('');
		mestopodzay.val('');
		$("[data-related-field=poryadokpodzay]").removeClass("label-required");
		poryadokpodzay.prop("required", false);
		mestoprovtorg.text('');
		mestoprovtorg.val('');
		porprovtorg.text('');
		porprovtorg.val('');
		porprovtorg.prop("required", false);
		$("[data-related-field=porprovtorg]").removeClass("label-required");
		mestorasm.text('');
		mestorasm.val('');
		mestorasm.prop("required", false);
		$("[data-related-field=mestorasm]").removeClass("label-required");
		porrasmzay.prop("required", false);
		$("[data-related-field=porrasmzay]").removeClass("label-required");
		mestopodvitog.text('');
		mestopodvitog.val('');
		porpodvitog.prop("required", false);
		$("[data-related-field=porpodvitog]").removeClass("label-required");
		mestovskrkonv.text('');
		mestovskrkonv.val('');
		porvskrkonv.prop("required", false);
		$("[data-related-field=porvskrkonv]").removeClass("label-required");
		porvskrkonv.text('');
		porvskrkonv.val('');
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datetorg]").closest("fieldset").parent().parent().hide();
		datetorg.prop("required", false);
		$("[data-related-field=datetorg]").removeClass("label-required");
		datetorg.parent().data("DateTimePicker").clear();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
		datevskrkonv.prop("required", false);
		$("[data-related-field=datevskrkonv]").removeClass("label-required");
		datevskrkonv.parent().data("DateTimePicker").clear();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		daterassm.parent().data("DateTimePicker").clear();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().hide();
		datepoditog.prop("required", false);
		$("[data-related-field=datepoditog]").removeClass("label-required");
		datepoditog.parent().data("DateTimePicker").clear();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpod]").closest("fieldset").parent().parent().hide();
		datenachpod.prop("required", false);
		$("[data-related-field=datenachpod]").removeClass("label-required");
		datenachpod.parent().data("DateTimePicker").clear();
		mestonachpodzay.text('');
		mestonachpodzay.val('');
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpod]").closest("fieldset").parent().parent().hide();
		dateokonpod.prop("required", false);
		$("[data-related-field=dateokonpod]").removeClass("label-required");
		dateokonpod.parent().data("DateTimePicker").clear();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datefirstpod]").closest("fieldset").parent().parent().hide();
		datefirstpod.prop("required", false);
		$("[data-related-field=datefirstpod]").removeClass("label-required");
		datefirstpod.parent().data("DateTimePicker").clear();
		mestorasmfirstzay.text('');
		mestorasmfirstzay.val('');
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachsrokpodpredl]").closest("fieldset").parent().parent().hide();
		datenachsrokpodpredl.prop("required", false);
		$("[data-related-field=datenachsrokpodpredl]").removeClass("label-required");
		datenachsrokpodpredl.parent().data("DateTimePicker").clear();
		mestopodsrokcenpredl.text('');
		mestopodsrokcenpredl.val('');
		predkvalotbr.closest(".column-container").hide();
		predkvalotbr.prop('checked', false);
		Secondpart.closest(".column-container").hide();
		Secondpart.prop('checked', false);
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
		datesecondpod.prop("required", false);
		$("[data-related-field=datesecondpod]").removeClass("label-required");
		datesecondpod.parent().data("DateTimePicker").clear();
		datesecondnapr.parent().data("DateTimePicker").clear();
		mestosecondpod.text('');
		mestosecondpod.val('');
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().parent().prev().hide();
		// $("[data-related-field=dateprovkvaloybr]").closest("fieldset").parent().parent().hide();
		// dateprovkvaloybr.prop("required", false);
		// $("[data-related-field=dateprovkvaloybr]").removeClass("label-required");
		// dateprovkvaloybr.parent().data("DateTimePicker").clear();
		// mestoprovkvaloybr.text('');
		// mestoprovkvaloybr.val('');
		// poryadokprovkvaloybr.text('');
		// poryadokprovkvaloybr.val('');
		// mestoprovkvaloybr.text('');
		// mestoprovkvaloybr.val('');
		sopostcenpredl.closest(".column-container").hide();
		sopostcenpredl.prop('checked', false);
		doppredl.closest(".column-container").hide();
		doppredl.prop('checked', false);
		okonpredl.closest(".column-container").hide();
		okonpredl.prop('checked', false);
		obspredlofuncfar.closest(".column-container").hide();
		obspredlofuncfar.prop('checked', false);
		obsfuncfar.closest(".column-container").hide();
		obsfuncfar.prop('checked', false);
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		
		filedHide(['send_to_oos', 'ramZakup', 'notRNP']);
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

//сделать НЕобязательным
function filedNotRequired (Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			$("[data-field-name='"+item+"']").prop('required', false);
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
		})
	}
}
	
//очистить и сделать необязательными
function filedClearAndDoNotRequired(Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			var filed = $("[data-field-name='"+item+"']");
			filed.val('');
			filed.text('');
			$("[data-field-name='"+item+"']").prop('required', false);
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
			
			// Если это дата 
			if (filed.parent().data("DateTimePicker") != undefined) {
				filed.parent().data("DateTimePicker").clear();
			}
			
			
		})
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

// отображение полей
function filedShow(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').show();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
	});
}

// отображение полей
function filedHide(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').hide();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide();
	});
}
// скрыть на View если пусто
function HideIfEmptyOnView(Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			var filed = $("div.documentView-field-value[data-name='"+item+"']");
			
			if (!filed.attr('title')) {
				filed.closest('.column-container').hide();
			}
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

	
// Логика работы таблицы дополнительных этапов для сбер АСТ	
function AdditionalPurchaseStageTableLogic(ETPID, formTorg) {
	var Table = $("div[data-name='AdditionalPurchaseStage']");
	
	if (ETPID == 2) {
		// 21 - Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 25 - Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
		// 15 - Конкурс (заявка из 2-х частей)
		// 16 - Аукцион (заявка из 2-х частей)
		// 18 - Запрос предложений (заявка из 2-х частей)
		if (['21', '25', '15', '16', '18'].indexOf(formTorg) > -1) {
			LegendAndEmptyNextRowShow(['Дополнительные этапы']);
			// css стиль таблицы
			Table.find("div[class*='right-actions-offset']").css({
				'margin-right': '0px'
			})
			
			CheckTableRows(ReturnStageToTheFormTorg(formTorg));	// проверяем, строки таблицы, на соответствие форме торгов
			
		}
		else {
			HideAndClearTable(); // скрыть и очистить таблицу
		}
		
	}
	else {
		HideAndClearTable(); // скрыть и очистить таблицу
	}
	
	// скрываем и чистим таблицу
	function HideAndClearTable() {
		var TableRows = $(Table).find("[data-rowkey]");
		LegendAndNextEmptyRowHide(['Дополнительные этапы']);
		if (TableRows.length > 0) {
			TableRows.each(function(i, item){
				var RemoveButton = $($(item).find("[class*='table-remove-row-button']")[0]);
				removeTableRow(RemoveButton, event);
			})
		}
	}
	
	// чистим таблицу по условию
	function CheckTableRows(param) {
		var TableRows = $(Table).find("[data-rowkey]");
		if (TableRows.length > 0) {
			TableRows.each(function(i, item){
				var AdditionalStageCode = $(item).find("input[name*='-AdditionalStageCode-']").val();
				var RemoveButton = $($(item).find("[class*='table-remove-row-button']")[0]);
				if (param.indexOf(AdditionalStageCode) == -1) {
					removeTableRow(RemoveButton, event);
				}
			})
		}
	}
	
	// тут определяем у какой формы торгов какие этапы должны быть
	function ReturnStageToTheFormTorg(formTorg) {
		// 10 - Обсуждение функциональных характеристик
		// 15 - Подача окончательных предложений (после обсуждения функциональных характеристик)
		// 20 - Обсуждение предложений по функциональным характеристикам
		// 25 - Подача окончательных предложений (после обсуждения предложений функциональных характеристик)
		// 30 - Рассмотрение и оценка (после обсуждения)
		// 40 - Квалификационный отбор
		// 50 - Подача дополнительных ценовых предложений
		// 60 - Сопоставление дополнительных ценовых предложений
		switch(formTorg) {
			case '21':
				return ['10', '15', '20', '25', '30', '50', '60'];
				break;
			case '25':
				return ['10', '20'];
				break;
			case '15': 
				return ['10', '15', '20', '25', '30', '40', '50'];
				break;
			// группировка case
			case '16':
			case '18':
				return ['40'];
				break;
			default:
				return [];
				break;
		}
	}
	
	// возвращает коды всех ранеее выбранных этапов
	function TableRowsCodeArray (CurrentRow) {
		var TableRows = $(Table).find('[data-rowkey]');
		var CurrentStageCode = $(CurrentRow).find("input[name*='-AdditionalStageCode-']").val();
		var arr = [];
		if (TableRows.length > 0) {
			TableRows.each(function(i, item){
				var AdditionalStageCode = $(item).find("input[name*='-AdditionalStageCode-']").val();
				// не добавляем в массив текущий выбранный код
				if (CurrentStageCode != AdditionalStageCode) {
					arr.push(AdditionalStageCode);
				}
				
			})
		}
		return arr;
	}
	
	// тут фильтруем справочник в зависимости от формы торгов
	$(document).on('DicDialogOpened', "div[data-name='AdditionalPurchaseStage'] button[id='AdditionalStageCode']", function (current, args) {
		var CurrentRow = $(current.currentTarget).closest('[data-rowkey]');
		var items = args.items;
		var l = items.length;
		var formTorg = $("input[name='formTorg']").val();
		var DictFilter = ReturnStageToTheFormTorg(formTorg); // возвращает этапы которые должны отображаться у формы торгов
		var PreviouslySelected = TableRowsCodeArray(CurrentRow);  // возвращает коды всех ранеее выбранных этапов 
		for (var i = 0; i < l; i++) {
			var currentItem = items[i].data.code;
			var current = items[i];
			
			if (DictFilter.indexOf(currentItem) == -1) {
				current.remove();
			}
			// Если этап уже была выбран раньше
			else if (PreviouslySelected.indexOf(currentItem) > -1) {
				current.remove();
			}
			
		};
	})
};

$(document).on('change', "input[name='Obetap']", function (e) {
	Obyazetap();
	showEditKvalOtbor();
	DocumentationProvision();
	MaxCountQuery();
});

$(document).on('change', "input[name='naimETPID']", function (e) {
	let naimETPID = $("input[name='naimETPID']");
	let sposzak = $("input[name='sposzak']");
	$("input[type='checkbox'][name='kvalotb']").prop('checked', false);
	$("li:has(:contains('Квалификационный отбор'))").hide();	
	$("input[name='accessType']").val('Для всех');    // Меняю тип доступа при смене площадки(т.к. список в справочнике разница у разных площадок)
	$("input[data-field-name='accessType']").val('Для всех'); // Меняю тип доступа при смене площадки(т.к. список в справочнике разница у разных площадок)
	$("input[name='accessType']").change();
	if (naimETPID.val() === "113" && (sposzak.val() === "201180" || sposzak.val() === "58930" || sposzak.val() === "68478" || sposzak.val() === "200857" || sposzak.val() === "108587")) {
		$("input[name='formTorg']").val("3");
		$("input[name='formTorgName']").val("Конкурс");
		$("input[name='Obetap']").val("3");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		Obyazetap();
	} else if (naimETPID.val() === "999" && (sposzak.val() === "201180" || sposzak.val() === "58930" || sposzak.val() === "68478" || sposzak.val() === "200857" || sposzak.val() === "108587")) {
		$("input[name='formTorg']").val("3");
		$("input[name='formTorgName']").val("Открытый конкурс (РТ)");
		$("input[name='Obetap']").val("");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		rtkhide();
	} else if (naimETPID.val() === "113" && (sposzak.val() === "32321" || sposzak.val() === "200611" || sposzak.val() === "58934" || sposzak.val() === "127" || sposzak.val() === "200843" || sposzak.val() === "200851" || sposzak.val() === "4460" || sposzak.val() === "11709" || sposzak.val() === "871" || sposzak.val() === "108585" || sposzak.val() === "410214" || sposzak.val() === "410225")) {
		$("input[name='formTorg']").val("4");
		$("input[name='formTorgName']").val("Запрос предложений");
		$("input[name='Obetap']").val("4");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		Obyazetap();
	} else if (naimETPID.val() === "999" && (sposzak.val() === "32321" || sposzak.val() === "200611" || sposzak.val() === "58934" || sposzak.val() === "127" || sposzak.val() === "200843" || sposzak.val() === "200851" || sposzak.val() === "4460" || sposzak.val() === "11709" || sposzak.val() === "871" || sposzak.val() === "108585" || sposzak.val() === "410214" || sposzak.val() === "410225")) {
		$("input[name='formTorg']").val("4");
		$("input[name='formTorgName']").val("Открытый запрос предложений (РТ)");
		$("input[name='Obetap']").val("");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		rtkhide();
	} else if (naimETPID.val() === "113" && (sposzak.val() === "32318" || sposzak.val() === "200610" || sposzak.val() === "93898" || sposzak.val() === "11710" || sposzak.val() === "200847" || sposzak.val() === "70485" || sposzak.val() === "108584" || sposzak.val() === "410213" || sposzak.val() === "410224")) {
		$("input[name='formTorg']").val("5");
		$("input[name='formTorgName']").val("Запрос котировок");
		$("input[name='Obetap']").val("4");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		Obyazetap();
	} else if (naimETPID.val() === "999" && (sposzak.val() === "32318" || sposzak.val() === "200610" || sposzak.val() === "93898" || sposzak.val() === "11710" || sposzak.val() === "200847" || sposzak.val() === "70485" || sposzak.val() === "108584" || sposzak.val() === "410213" || sposzak.val() === "410224")) {
		$("input[name='formTorg']").val("5");
		$("input[name='formTorgName']").val("Открытый запрос котировок (РТ)");
		$("input[name='Obetap']").val("");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		rtkhide();
	} else if (naimETPID.val() === "113" && (sposzak.val() === "200813" || sposzak.val() === "200609" || sposzak.val() === "3361" || sposzak.val() === "47525" || sposzak.val() === "45760" || sposzak.val() === "108586" || sposzak.val() === "200607" || sposzak.val() === "410223")) {
		$("input[name='formTorg']").val("1");
		$("input[name='formTorgName']").val("Аукцион на повышение");
		$("input[name='Obetap']").val("1");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		Obyazetap();
		hideetpreg();
	} else if (naimETPID.val() === "999" && (sposzak.val() === "200813" || sposzak.val() === "200609" || sposzak.val() === "3361" || sposzak.val() === "47525" || sposzak.val() === "45760" || sposzak.val() === "108586" || sposzak.val() === "200607" || sposzak.val() === "410223")) {
		$("input[name='formTorg']").val("1");
		$("input[name='formTorgName']").val("Аукцион на повышение (РТ)");
		$("input[name='Obetap']").val("");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		Obyazetap();
		rtkhide();
		hideetpreg();
		rtkhideall();
	} else if (naimETPID.val() === "999" && (sposzak.val() === "433946")) {
		$("input[name='formTorg']").val("51");
		$("input[name='formTorgName']").val("Запрос цен (РТ)");
		$("input[name='Obetap']").val("");
		ct.common.dictionary.fillSingleDisplayField($("div#formTorgtree"));
		rtkhide();
		hideetpreg();
	}
	else {
		$("input[name='formTorg']").val('');
		$("input[name='formTorgName']").val('');
		$("input[name='Obetap']").val('');
		$("input[name='formTorg']").closest(".column-container").find(".dict-display-field").val("");
		Obyazetap();
		send_to_oosRegisterEdit();
	}
	
	DocumentationProvision(); // вкладка предоставление документации при изменении площадки
	showEditBazis();
});

$(document).on('change', "input[data-field-name='NereglZak']", function (e) {
	var NereglZak = $("input[name='NereglZak']");
	if (NereglZak.is(":checked")){
		filedShow(['PodpDogEp']);
	} else{
		filedClearAndHide(['PodpDogEp']);
	}
});

$(document).on('change', "input[data-field-name='notPablikZak']", function (e) {
	var notPablikZak = $("input[name='notPablikZak']");
	var send_to_oos = $("input[name='send_to_oos']");
	var statusnotice=$("input[name='statusnotice']").val();
	var numRed=$("input[name='numRed']").val();
	if (notPablikZak.is(":checked")){
		$("input[data-field-name='send_to_oos']").readonly()
		send_to_oos.prop('checked', true);
	} else if (statusnotice=="Внесение изменений" || numRed >1){
		$("input[data-field-name='send_to_oos']").readonly()
	} else {
		$("input[data-field-name='send_to_oos']").readonly(false)
		$("input[data-field-name='send_to_oos']").removeClass("readonly")
	}
	DocumentationProvision();
});

$(document).on('change', "input[data-field-name='VskKonvertov']", function (e) {
	var VskKonvertov = $("input[name='VskKonvertov']");
	var datevskrkonv = $("input[name='datevskrkonv']");
	var mestovskrkonv = $("textarea[name='mestovskrkonv']");
	var porvskrkonv = $("textarea[name='porvskrkonv']");
	if(VskKonvertov.is(":checked")){
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().show();
		datevskrkonv.prop("required", true);
		$("[data-related-field=datevskrkonv]").addClass("label-required");
		datevskrkonv.closest(".column-container").show();
		$("[data-related-field=datevskrkonv]").closest(".column-container").show();
		mestovskrkonv.closest(".column-container").show();
		$("[data-related-field=mestovskrkonv]").show();
		porvskrkonv.closest(".column-container").show();
		$("[data-related-field=porvskrkonv]").show();
		porvskrkonv.prop("required", true);
		porvskrkonv.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porvskrkonv]").addClass("label-required");
	}
	else{
		mestovskrkonv.closest(".column-container").hide();
		$("[data-related-field=mestovskrkonv]").hide();
		mestovskrkonv.text('');
		mestovskrkonv.val('');
		porvskrkonv.closest(".column-container").hide();
		$("[data-related-field=porvskrkonv]").hide();
		porvskrkonv.prop("required", false);
		$("[data-related-field=porvskrkonv]").removeClass("label-required");
		porvskrkonv.text('');
		porvskrkonv.val('');
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datevskrkonv]").closest("fieldset").parent().parent().hide();
		datevskrkonv.prop("required", false);
		$("[data-related-field=datevskrkonv]").removeClass("label-required");
		datevskrkonv.closest(".column-container").hide();
		$("[data-related-field=datevskrkonv]").closest(".column-container").hide();
		datevskrkonv.parent().data("DateTimePicker").clear();
	}
});

$(document).on('change', "input[data-field-name='UkazOtlDate']", function (e) {
	var UkazOtlDate = $("input[name='UkazOtlDate']");
	if (UkazOtlDate.is(":checked")){
		filedShowAndRequired(['Otldatepod']);
	} else{
		filedClearAndHide(['Otldatepod']);
	}
});

$(document).on('change', "input[data-field-name='RasmZay']", function (e) {
	var RasmZay = $("input[name='RasmZay']");
	var daterassm = $("input[name='daterassm']");
	var mestorasm = $("textarea[name='mestorasm']");
	var porrasmzay = $("textarea[name='porrasmzay']");
	if(RasmZay.is(":checked")){
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().show();
		daterassm.prop("required", true);
		$("[data-related-field=daterassm]").addClass("label-required");
		daterassm.closest(".column-container").show();
		$("[data-related-field=daterassm]").closest(".column-container").show();
		mestorasm.closest(".column-container").show();
		$("[data-related-field=mestorasm]").show();
		porrasmzay.closest(".column-container").show();
		$("[data-related-field=porrasmzay]").show();
		porrasmzay.prop("required", true);
		porrasmzay.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porrasmzay]").addClass("label-required");
	}
	else{
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterassm]").closest("fieldset").parent().parent().hide();
		mestorasm.closest(".column-container").hide();
		$("[data-related-field=mestorasm]").hide();
		mestorasm.text('');
		mestorasm.val('');
		porrasmzay.closest(".column-container").hide();
		$("[data-related-field=porrasmzay]").hide();
		porrasmzay.prop("required", false);
		$("[data-related-field=porrasmzay]").removeClass("label-required");
		// porrasmzay.text('');
		// porrasmzay.val('');
		daterassm.prop("required", false);
		$("[data-related-field=daterassm]").removeClass("label-required");
		daterassm.closest(".column-container").hide();
		$("[data-related-field=daterassm]").closest(".column-container").hide();
		daterassm.parent().data("DateTimePicker").clear();
	}
});

$(document).on('change', "input[data-field-name='PodvItog']", function (e) {
	var PodvItog = $("input[name='PodvItog']");
	var datepoditog = $("input[name='datepoditog']");
	var mestopodvitog = $("textarea[name='mestopodvitog']");
	var porpodvitog = $("textarea[name='porpodvitog']");
	if(PodvItog.is(":checked")){
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().show();
		datepoditog.prop("required", true);
		$("[data-related-field=datepoditog]").addClass("label-required");
		porpodvitog.prop("required", true);
		porpodvitog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=porpodvitog]").addClass("label-required");
	}
	else{
		mestopodvitog.text('');
		mestopodvitog.val('');
		porpodvitog.prop("required", false);
		$("[data-related-field=porpodvitog]").removeClass("label-required");
		porpodvitog.text('');
		porpodvitog.val('');
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoditog]").closest("fieldset").parent().parent().hide();
		datepoditog.prop("required", false);
		$("[data-related-field=datepoditog]").removeClass("label-required");
		datepoditog.parent().data("DateTimePicker").clear();
	}
});

$(document).on('change', "input[data-field-name='Secondpart']", function (e) {
	var Secondpart = $("input[name='Secondpart']");
	var datesecondpod = $("input[name='datesecondpod']");
	var datesecondnapr = $("input[name='datesecondpod']");
	var mestosecondpod = $("textarea[name='mestosecondpod']");
	var poryadoksecondpod = $("textarea[name='poryadoksecondpod']");
	
	if(Secondpart.is(":checked")){
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().show();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().show();
		datesecondpod.prop("required", true);
		$("[data-related-field=datesecondpod]").addClass("label-required");
		poryadoksecondpod.prop("required", true);
		$("[data-related-field=poryadoksecondpod]").addClass("label-required");
	}
	else{
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datesecondpod]").closest("fieldset").parent().parent().hide();
		$("[data-related-field=datesecondnapr]").closest("fieldset").parent().parent().hide();
		datesecondpod.prop("required", false);
		$("[data-related-field=datesecondpod]").removeClass("label-required");
		poryadoksecondpod.prop("required", false);
		$("[data-related-field=poryadoksecondpod]").removeClass("label-required");
		datesecondpod.parent().data("DateTimePicker").clear();
		datesecondnapr.parent().data("DateTimePicker").clear();
		mestosecondpod.text('');
		mestosecondpod.val('');
		poryadoksecondpod.text('');
		poryadoksecondpod.val('');
	}
});

$(document).on('change', "input[data-field-name='sopostcenpredl']", function (e) {
	var sopostcenpredl = $("input[name='sopostcenpredl']");
	var dateprovsopost = $("input[name='dateprovsopost']");
	var mestoprovsopost = $("textarea[name='mestoprovsopost']");
	var poryadokprovsopost = $("textarea[name='poryadokprovsopost']");
	
	if(sopostcenpredl.is(":checked")){
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().show();
		dateprovsopost.prop("required", true);
		$("[data-related-field=dateprovsopost]").addClass("label-required");
		$("[data-related-field=poryadokprovsopost]").addClass("label-required");
		poryadokprovsopost.prop("required", true);
	}
	else{
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateprovsopost]").closest("fieldset").parent().parent().hide();
		dateprovsopost.prop("required", false);
		$("[data-related-field=dateprovsopost]").removeClass("label-required");
		dateprovsopost.parent().data("DateTimePicker").clear();
		mestoprovsopost.text('');
		mestoprovsopost.val('');
		poryadokprovsopost.text('');
		poryadokprovsopost.val('');
		$("[data-related-field=poryadokprovsopost]").removeClass("label-required");
		poryadokprovsopost.prop("required", false);
	}
});

$(document).on('change', "input[data-field-name='obsfuncfar']", function (e) {
	var obsfuncfar = $("input[name='obsfuncfar']");
	var dateokonobshar = $("input[name='dateokonobshar']");
	var mestookonobshar = $("textarea[name='mestookonobshar']");
	var poryadokokonobshar = $("textarea[name='poryadokokonobshar']");
	var datenachobshar = $("input[name='datenachobshar']");
	var mestonachobshar = $("textarea[name='mestonachobshar']");
	var poryadoknachobshar = $("textarea[name='poryadoknachobshar']");
	
	if(obsfuncfar.is(":checked")){
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().show();
		dateokonobshar.prop("required", true);
		$("[data-related-field=dateokonobshar]").addClass("label-required");
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().show();
		datenachobshar.prop("required", true);
		$("[data-related-field=datenachobshar]").addClass("label-required");
		$("[data-related-field=poryadoknachobshar]").addClass("label-required");
		poryadoknachobshar.prop("required", true);
		$("[data-related-field=poryadokokonobshar]").addClass("label-required");
		poryadokokonobshar.prop("required", true)
	}
	else{
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobshar]").closest("fieldset").parent().parent().hide();
		dateokonobshar.prop("required", false);
		$("[data-related-field=dateokonobshar]").removeClass("label-required");
		dateokonobshar.parent().data("DateTimePicker").clear();
		poryadokokonobshar.text('');
		poryadokokonobshar.val('');
		$("[data-related-field=poryadokokonobshar]").removeClass("label-required");
		poryadokokonobshar.prop("required", false);
		mestookonobshar.text('');
		mestookonobshar.val('');
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobshar]").closest("fieldset").parent().parent().hide();
		datenachobshar.prop("required", false);
		$("[data-related-field=datenachobshar]").removeClass("label-required");
		datenachobshar.parent().data("DateTimePicker").clear();
		mestonachobshar.text('');
		mestonachobshar.val('');
		poryadoknachobshar.text('');
		poryadoknachobshar.val('');
		$("[data-related-field=poryadoknachobshar]").removeClass("label-required");
		poryadoknachobshar.prop("required", false);
	}
});

$(document).on('change', "input[data-field-name='okonpredl']", function (e) {
	var okonpredl = $("input[name='okonpredl']");
	var daterasmpodokonpredl = $("input[name='daterasmpodokonpredl']");
	var mestorasmpodokonpredl = $("textarea[name='mestorasmpodokonpredl']");
	var poryadokrasmpodokonpredl = $("textarea[name='poryadokrasmpodokonpredl']");
	var dateokonpodokonpredl = $("input[name='dateokonpodokonpredl']");
	var mestookonpodokonpredl = $("textarea[name='mestookonpodokonpredl']");
	var poryadokokonpodokonpredl = $("textarea[name='poryadokokonpodokonpredl']");
	var datenachpodokonpredl = $("input[name='datenachpodokonpredl']");
	var mestonachpodokonpredl = $("textarea[name='mestonachpodokonpredl']");
	var poryadoknachpodokonpredl = $("textarea[name='poryadoknachpodokonpredl']");
	var flag2 = $("input[name='naimETPID']").val();
	if(okonpredl.is(":checked")){
		if (flag2 ==  '1'){
			$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().show();
			daterasmpodokonpredl.prop("required", true);
			$("[data-related-field=daterasmpodokonpredl]").addClass("label-required");
			$("[data-related-field=poryadokrasmpodokonpredl]").addClass("label-required");
			poryadokrasmpodokonpredl.prop("required", true);
		}
		if (flag2 !=  '1') {
			poryadoknachpodokonpredl.prop("required", true);
			poryadoknachpodokonpredl.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=poryadoknachpodokonpredl]").addClass("label-required");
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().show();
			$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().show();
			datenachpodokonpredl.prop("required", true);
			$("[data-related-field=datenachpodokonpredl]").addClass("label-required");
			$("[data-related-field=poryadokokonpodokonpredl]").addClass("label-required");
			poryadokokonpodokonpredl.prop("required", true)
		}
	}
	else{
		poryadoknachpodokonpredl.prop("required", false);
		$("[data-related-field=poryadoknachpodokonpredl]").removeClass("label-required");
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=daterasmpodokonpredl]").closest("fieldset").parent().parent().hide();
		daterasmpodokonpredl.prop("required", false);
		$("[data-related-field=daterasmpodokonpredl]").removeClass("label-required");
		daterasmpodokonpredl.parent().data("DateTimePicker").clear();
		poryadokrasmpodokonpredl.text('');
		poryadokrasmpodokonpredl.val('');
		mestorasmpodokonpredl.text('');
		mestorasmpodokonpredl.val('');
		/* $("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpodokonpredl]").closest("fieldset").parent().parent().hide();
		dateokonpodokonpredl.prop("required", false);
		$("[data-related-field=dateokonpodokonpredl]").removeClass("label-required");
		dateokonpodokonpredl.parent().data("DateTimePicker").clear(); */
		mestookonpodokonpredl.text('');
		mestookonpodokonpredl.val('');
		poryadokokonpodokonpredl.text('');
		poryadokokonpodokonpredl.val('');
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachpodokonpredl]").closest("fieldset").parent().parent().hide();
		datenachpodokonpredl.prop("required", false);
		$("[data-related-field=datenachpodokonpredl]").removeClass("label-required");
		datenachpodokonpredl.parent().data("DateTimePicker").clear();
		mestonachpodokonpredl.text('');
		mestonachpodokonpredl.val('');
		poryadoknachpodokonpredl.text('');
		poryadoknachpodokonpredl.val('');
		$("[data-related-field=poryadokokonpodokonpredl]").removeClass("label-required");
		poryadokokonpodokonpredl.prop("required", false);
		$("[data-related-field=poryadokrasmpodokonpredl]").removeClass("label-required");
		poryadokrasmpodokonpredl.prop("required", false);
	}
});

$(document).on('change', "input[data-field-name='doppredl']", function (e) {
	var doppredl = $("input[name='doppredl']");
	var datepoddoppredl = $("input[name='datepoddoppredl']");
	var dateokonpoddoppredl = $("input[name='dateokonpoddoppredl']");
	var mestopoddoppredl = $("textarea[name='mestopoddoppredl']");
	var poryadokpoddoppredl = $("textarea[name='poryadokpoddoppredl']");
	var mestookonpoddoppredl = $("textarea[name='mestookonpoddoppredl']");
	var poryadokokonpoddoppredl = $("textarea[name='poryadokokonpoddoppredl']");
	
	if(doppredl.is(":checked")){
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().show();
		datepoddoppredl.prop("required", true);
		$("[data-related-field=datepoddoppredl]").addClass("label-required");
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().show();
		dateokonpoddoppredl.prop("required", true);
		$("[data-related-field=dateokonpoddoppredl]").addClass("label-required");
		$("[data-related-field=poryadokpoddoppredl]").addClass("label-required");
		poryadokpoddoppredl.prop("required", true);
		$("[data-related-field=poryadokokonpoddoppredl]").addClass("label-required");
		poryadokokonpoddoppredl.prop("required", true);
	}
	else{
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datepoddoppredl]").closest("fieldset").parent().parent().hide();
		datepoddoppredl.prop("required", false);
		$("[data-related-field=datepoddoppredl]").removeClass("label-required");
		datepoddoppredl.parent().data("DateTimePicker").clear();
		mestopoddoppredl.text('');
		mestopoddoppredl.val('');
		poryadokpoddoppredl.text('');
		poryadokpoddoppredl.val('');
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonpoddoppredl]").closest("fieldset").parent().parent().hide();
		dateokonpoddoppredl.prop("required", false);
		$("[data-related-field=dateokonpoddoppredl]").removeClass("label-required");
		dateokonpoddoppredl.parent().data("DateTimePicker").clear();
		mestookonpoddoppredl.text('');
		mestookonpoddoppredl.val('');
		poryadokokonpoddoppredl.text('');
		poryadokokonpoddoppredl.val('');
		$("[data-related-field=poryadokpoddoppredl]").removeClass("label-required");
		poryadokpoddoppredl.prop("required", false);
		$("[data-related-field=poryadokokonpoddoppredl]").removeClass("label-required");
		poryadokokonpoddoppredl.prop("required", false);
	}
});

$(document).on('change', "input[data-field-name='obspredlofuncfar']", function (e) {
	var obspredlofuncfar = $("input[name='obspredlofuncfar']");
	var dateokonobspredl = $("input[name='dateokonobspredl']");
	var datenachobspredl = $("input[name='datenachobspredl']");
	var poryadokokonobspredl = $("textarea[name='poryadokokonobspredl']");
	var mestookonobspredl = $("textarea[name='mestookonobspredl']");
	var mestonachobspredl = $("textarea[name='mestonachobspredl']");
	var poryadoknachobspredl = $("textarea[name='poryadoknachobspredl']");
	
	if(obspredlofuncfar.is(":checked")){
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().show();
		dateokonobspredl.prop("required", true);
		$("[data-related-field=dateokonobspredl]").addClass("label-required");
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().show();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().show();
		datenachobspredl.prop("required", true);
		$("[data-related-field=datenachobspredl]").addClass("label-required");
		$("[data-related-field=poryadoknachobspredl]").addClass("label-required");
		poryadoknachobspredl.prop("required", true);
		$("[data-related-field=poryadokokonobspredl]").addClass("label-required");
		poryadokokonobspredl.prop("required", true);
	}
	else{
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=dateokonobspredl]").closest("fieldset").parent().parent().hide();
		dateokonobspredl.prop("required", false);
		$("[data-related-field=dateokonobspredl]").removeClass("label-required");
		dateokonobspredl.parent().data("DateTimePicker").clear();
		poryadokokonobspredl.text('');
		poryadokokonobspredl.val('');
		mestookonobspredl.text('');
		mestookonobspredl.val('');
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().parent().prev().hide();
		$("[data-related-field=datenachobspredl]").closest("fieldset").parent().parent().hide();
		datenachobspredl.prop("required", false);
		$("[data-related-field=datenachobspredl]").removeClass("label-required");
		datenachobspredl.parent().data("DateTimePicker").clear();
		mestonachobspredl.text('');
		mestonachobspredl.val('');
		poryadoknachobspredl.text('');
		poryadoknachobspredl.val('');
		$("[data-related-field=poryadoknachobspredl]").removeClass("label-required");
		poryadoknachobspredl.prop("required", false);
		$("[data-related-field=poryadokokonobspredl]").removeClass("label-required");
		poryadokokonobspredl.prop("required", false);
	}
});
			
var etapview = function () {
var forinput = ['Место окончания подачи заявок', 'Порядок окончания подачи заявок', 'Место вскрытия конвертов', 'Порядок вскрытия конвертов', 'Место проведения торгов', 'Порядок проведения торгов', 'Место подведения итогов', 'Порядок подведения итогов', 'Место рассмотрения заявок', 'Дата вскрытия конвертов', 'Дата подведения итогов', 'Дата проведения торгов', 'Дата рассмотрения заявок', 'Порядок рассмотрения  заявок', 'Место подачи квалификационных заявок', 'Место рассмотрения квалификационных заявок', 'Место вскрытия квалификационных конвертов', 'Место рассмотрения предложений', 'Дата начала подачи заявок', 'Дата рассмотрения 1х частей', 'Дата начала срока подачи ценовых предложений', 'Дата проведения квалификационного отбора', 'Дата рассмотрения 2х частей', 'Место начала подачи заявок', 'Порядок начала подачи заявок', 'Место начала срока подачи ценовых предложений', 'Порядок начала срока подачи ценовых предложений', 'Место проведения квалификационного отбора', 'Порядок проведения квалификационного отбора', 'Место рассмотрения 2х частей', 'Порядок рассмотрения 2х частей', 'Место рассмотрения 1х частей', 'Порядок рассмотрения 1х частей', 'Дата начала обсуждения функциональных характеристик', 'Дата окончания обсуждения функциональных характеристик', 'Место начала обсуждения функциональных характеристик', 'Порядок начала обсуждения функциональных характеристик', 'Место окончания обсуждения функциональных характеристик', 'Порядок окончания обсуждения функциональных характеристик', 'Место начала обсуждения предложений о функциональных характеристиках', 'Порядок начала обсуждения предложений о функциональных характеристиках', 'Место окончания обсуждения предложений о функциональных характеристиках', 'Порядок окончания обсуждения предложений о функциональных характеристиках', 'Дата начала обсуждения предложений о функциональных характеристиках', 'Дата окончания обсуждения предложений о функциональных характеристиках', 'Дата начала подачи окончательных предложений', 'Дата окончания подачи окончательных предложений', 'Дата рассмотрения и оценки окончательных предложений', 'Место начала подачи окончательных предложений', 'Порядок начала подачи окончательных предложений', 'Место рассмотрения и оценки окончательных предложений', 'Порядок рассмотрения и оценки окончательных предложений', 'Дата подачи дополнительных ценовых предложений', 'Дата окончания подачи дополнительных ценовых предложений', 'Место подачи дополнительных ценовых предложений', 'Порядок подачи дополнительных ценовых предложений', 'Место окончания подачи дополнительных ценовых предложений', 'Порядок окончания подачи дополнительных ценовых предложений', 'Дата проведения сопоставления дополнительных ценовых предложений', 'Место проведения сопоставления дополнительных ценовых предложений', 'Порядок проведения сопоставления дополнительных ценовых предложений', 'Порядок окончания подачи окончательных предложений', 'Место окончания подачи окончательных предложений', 'Сумма БПУ', 'Сумма БДДС', 'Ответственный начальник отдела УЗД', 'Ответственный сотрудник УЗД', 'Ответственный за проведение закупки', 'Ответственный за заключение договора', 'Ответственный отдела планирования', 'Номер статьи БПУ', 'Номер статьи БДДС', 'Основание закупки у ЕП', 'Минимальный размер партии товара', 'Номер несостоявшейся процедуры', 'Срок продления', 'Условие продления'];
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

var FilterOrg = function () {
var OrgZakupkiEIS = $("input[name='OrgZakupkiEIS']").val();
var selectedItemId = $("input[data-parent-name='naimETPparent']").val();
var secondLevelFields = ["Организации", "Код на ЭТП"];

getDictionaryItems("Электронные площадки", "Организации", selectedItemId, 2, secondLevelFields, function (data) {
	
	data.children
	var l = data.children.length;
	for (var i = 0; i < l; i++) {
		var current = data.children[i];
		if (current.code==OrgZakupkiEIS) {
			$("input[name='OrgZakupkiEISSprav']").val(OrgZakupkiEIS);
		    $("input[data-field-name='OrgZakupkiEISSprav']").val(OrgZakupkiEIS);
			$("input[name='IDOrganETP']").val(current['Код на ЭТП']);
		}
	}
},function(error){
console.log(error);
});
};


// Краткое содержание
var summary = function() {
	
	var ktatkoe = $("input[name='ktatkoe']");
	
	var name = $("textarea[name='nazzak']");
	var nameOrg = $("input[name='registerOrgZa']");
	var sposobZak = $("input[name='sposzakName']");
	var resultString = function() {
		
		var result = "Организация-заказчик: " + nameOrg.val().trim() + "\n Способ закупки: " + sposobZak.val().trim() + "\n Название закупки: " +  name.val().trim();	
		
		return result;
	};	
	ktatkoe.val(resultString());
	
	name.change(function() {
	    ktatkoe.val(resultString());
	});
	nameOrg.change(function() {
	    ktatkoe.val(resultString());
	});
	sposobZak.change(function() {
	    ktatkoe.val(resultString());
	});
};

var etpforreg = function() {
    var zakelform = $("input[name='zakelform']");
    var naimETP = $("input[name='naimETP']");
	var naimETPName = $("input[name='naimETPName']");
	var naimETPID = $("input[name='naimETPID']");
	var formTorg = $("input[name='formTorgName']");	
	var step=$("input[data-field-name='step']");
	if ($(zakelform).is(":checked")==false) {
		naimETP.val('');
		naimETPName.val('');
		naimETPID.val('');
	}
};

var EPhide = function () {
	var spzak=$("input[name='sposzak']").val();
	var mestorasmpredl=$("textarea[data-field-name='mestorasmpredl']");
	if (spzak =="202498" || spzak =="202506" || spzak =="3363" || spzak =="202507" || spzak =="6066" || spzak =="169" || spzak == "26646" || spzak == "58932"){
		mestorasmpredl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=mestorasmpredl]").removeClass("label-required");
		mestorasmpredl.closest(".column-container").hide();
		$("[data-related-field=mestorasmpredl").closest(".column-container").hide(); 
		mestorasmpredl.closest(".clearfix").removeClass("label-required");
		mestorasmpredl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		mestorasmpredl.prop("required", false);
		$("input[data-field-name='mestorasmpredl']").prop("required", false);
		$("input[name='kvalotb']").closest(".column-container").hide();
	}
	IzmenenieReg();
	IzmenenieEdit();
	DocumentationProvision(); // вкладка предоставление документации при изменении площадки
}

function DocumentationProvision() {
	var naimETPID=$("input[name='naimETPID']").val();
	var spzak=$("input[name='sposzak']").val();
	var formTorg=$("input[name='formTorg']").val();
	var send_to_oos = $("input[data-field-name='send_to_oos']");
	var notPablikZak = $("input[name='notPablikZak']");
	var flag = $("input[name='Obetap']").val();
	var Arr = ['dateBeginDocumentation', 'dateEndDocumentation', 'placeDocumentation', 'procedureDocumentation'];
	
	if (naimETPID == 2) {
		$("li:has(:contains('Предоставление документации'))").show();
		//26 - Запрос цен (коммерческих предложений)
		//59 - Квалификационный отбор в электронной форме
		if (['26', '59'].indexOf(formTorg) > -1) {
			filedNotRequired(Arr); // Сделать поля не обязательными
		}
		else {
			filedShowAndRequired(Arr); // Сделать поля обязательными
		}
	} 
	else if (naimETPID == 113 && !$(send_to_oos).is(":checked") && !$(notPablikZak).is(":checked") && flag!='5') {
		$("li:has(:contains('Предоставление документации'))").show();
		filedShowAndRequired(Arr); // Сделать поля обязательными
	}
	else if (['202498', '202506', '202507', '6066', '26646', '4489', '4490', '4491', '4492', '200608', '200609', '200610', '200611'].indexOf(spzak) > -1) {
		$("li:has(:contains('Предоставление документации'))").show();
		filedShowAndRequired(Arr); // Сделать поля обязательными
	} 
	else if (['3363', '169', '58932'].indexOf(spzak) > -1) {
		$("li:has(:contains('Предоставление документации'))").hide();
		filedNotRequired(Arr) // Сделать поля необязательными
	}
	else if (['200847', '200851'].indexOf(spzak) > -1) {
		$("li:has(:contains('Предоставление документации'))").show();
		filedNotRequired(Arr) // Сделать поля необязательными
	}
	else {
		$("li:has(:contains('Предоставление документации'))").hide();
		filedClearAndDoNotRequired(Arr);
	}
	
	
	
}

 $(document).on('change', "input[data-field-name='send_to_oos']", function () {
	DocumentationProvision()
	var NereglZak = $("input[name='NereglZak']");
	var PodpDogEp = $("input[name='PodpDogEp']");
	var send_to_oos = $("input[data-field-name='send_to_oos']");
	if (send_to_oos.is(":checked")){
		$("input[data-field-name='NereglZak']").readonly(false)
	} 
	else {
		$("input[data-field-name='NereglZak']").readonly()
		NereglZak.prop('checked', false);
		PodpDogEp.prop('checked', false);
		filedHide(['PodpDogEp']);
	}
})

var PredDocView = function () {
	//if(!$(".documentView-field-value[data-name='Место предоставления документации']").attr("title")){
	var spzak=$(".documentView-field-value[data-name='Способ закупки код']").text()
	var send_to_oos=$("div[data-name='Не отправлять сведения в ЕИС']").find("input[type='checkbox']");
	var EETPNAme = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	//если мы на узле Формирование пакета документации и способ закупи один из МСП или из ед поставщик
	if(spzak =="4489" || spzak =="4490" || spzak =="4491" || spzak =="4492" || spzak =="200608" || spzak =="200609" || spzak =="200610" || spzak =="200611" || spzak =="202498" || spzak =="202506" || spzak =="202507" || spzak =="6066" || spzak == "26646" || spzak =="200847" || spzak =="200851"){
		$("li:has(:contains('Предоставление документации'))").show();
	} 
	else if (EETPNAme == "АО &quot;Сбербанк - АСТ&quot;") {
		$("li:has(:contains('Предоставление документации'))").show();	
	}
	else if (EETPNAme == "АО &quot;ЕЭТП&quot;" && !$(send_to_oos).attr("checked")) {
		$("li:has(:contains('Предоставление документации'))").show();	
	}
	else{
		$("li:has(:contains('Предоставление документации'))").hide();	
	}
	
	if($(".documentView-field-value[data-name='Наименование ЭТП']").attr("title") =='АО "МСП-ЕЭТП"'){
		$("div[data-name='Квалификационный отбор']").closest(".column-container").hide();
	}
	if(spzak != "240548" && spzak != "2464" && spzak != "3363" && spzak != "33505" && spzak != "103765" && spzak != "285643"){
		$("li:has(:contains('Контрагент'))").hide();
	}
	izmenView();
}

function hideProcedure() {
	let naimETP = $("input[name='naimETP']");
	let accessType = $("input[name='accessType']");
	let EETPNameArray = ['АО "РТ-ЕЭТП"', 'АО "ЕЭТП"']; // Для каких площадок отображать таблицу допуска участников
	let Table = $("div[data-name='PKOcontractors'] [data-rowkey]");
	
	let eventName = "DicDialogOpened",
		dicName = "Доступ к процедуре";
	
	let buttons = $("button[data-dict-name='" + dicName + "']");
		
		
			buttons.each(function (index, btn) {
				var jBtn = $(btn);
				jBtn.unbind(eventName);
				jBtn.on(eventName, function (event, args) {
					if (naimETP.val() == 'АО "РТ-ЕЭТП"') {
						var items = args.items;
						var l = items.length;
						for (var i = 0; i < l; i++) {
							var  currentItem = items[i].data.code;
							var  current = items[i];
							
								if (currentItem == 'Для всех, с возможностью пригласить заявителей') {
									 current.remove()
								}
							
						};
					}
				});
			});
	// Если площадка АО "ЕЭТП" то вскрываем столбец  "Наименование" и отображаем "Email"
	if (naimETP.val() == 'АО "ЕЭТП"') {
		Table.find("input[data-field-name*='PKOcontractors-PKOName-']").closest(".table-edit-column").hide();
		$("div[data-name='PKOcontractors']").find("div[title='Наименование']").hide();	
		Table.find("input[data-field-name*='PKOcontractors-PKOEmail-']").closest(".table-edit-column").show();
		$("div[data-name='PKOcontractors']").find("div[title='Email']").show();
	} else if (naimETP.val() == 'АО "РТ-ЕЭТП"') {
		Table.find("input[data-field-name*='PKOcontractors-PKOEmail-']").closest(".table-edit-column").hide();
		$("div[data-name='PKOcontractors']").find("div[title='Email']").hide();
		Table.find("input[data-field-name*='PKOcontractors-PKOName-']").closest(".table-edit-column").show();
		$("div[data-name='PKOcontractors']").find("div[title='Наименование']").show();	
	}

		

	if ($.inArray(naimETP.val(), EETPNameArray) == -1) {
		$("input[name='accessType']").closest(".column-container").hide()
		$("[data-related-field=accessType]").closest(".row-container").hide();
		$("[data-related-field=accessType]").closest(".row-container").prev().hide(); // скрываю пустой row до блока
		$("input[name='inviteListCode']").val('')
		$("input[name='inviteList']").val('')
		$("input[name='inviteList']").closest(".column-container").hide()
		$("[data-related-field=inviteList]").closest(".column-container").hide()
		$("div[data-name='PKOcontractors']").parent().parent().parent().parent().hide();
		$("input[name*='PKOcontractors-PKOINN-']").val('')
		$("input[name*='PKOcontractors-PKOKPP-']").val('')
		$("input[name*='PKOcontractors-PKOName-']").val('')
		$("input[name*='PKOcontractors-PKOEmail-']").val('')
		// Чистим таблицу Доступов к процедуре
		Table.each(function(index, element) { 
			removeTableRow(element)
		});
	} else if (($.inArray(naimETP.val(), EETPNameArray) != -1) && (accessType.val() == 'Для ограниченного круга заявителей')) {
		$("input[name='accessType']").closest(".column-container").show()
		$("[data-related-field=accessType]").closest(".row-container").show();
		$("[data-related-field=accessType]").closest(".row-container").next().show(); // скрываю пустой row после блока
		$("input[name='inviteList']").closest(".column-container").show()
		$("[data-related-field=inviteList]").closest(".column-container").show()
		$("div[data-name='PKOcontractors']").parent().parent().parent().parent().show()
	} else if (($.inArray(naimETP.val(), EETPNameArray) != -1) && (accessType.val() == 'Для всех')) {
		$("input[name='accessType']").closest(".column-container").show()
		$("[data-related-field=accessType]").closest(".row-container").show();
		$("[data-related-field=accessType]").closest(".row-container").next().show(); // скрываю пустой row после блока
	} else if (($.inArray(naimETP.val(), EETPNameArray) != -1) && (accessType.val() == 'Для всех, с возможностью пригласить заявителей')) {
		$("input[name='accessType']").closest(".column-container").show();
		$("[data-related-field=accessType]").closest(".row-container").show();
		$("[data-related-field=accessType]").closest(".row-container").next().show(); // скрываю пустой row после блока
		$("div[data-name='PKOcontractors']").parent().parent().parent().parent().show()
	}
}

 let procedureAccess = function() {
	 let naimETPID = $("input[name='naimETPID']").val()
	 let accessType = $("input[name='accessType']").val()
	 let EETPidArray = ['999', '113']; 
	 let PKOTable = $("div[data-name='PKOcontractors']");
					 
	 if (naimETPID == '1') {
		$("input[name='accessType']").closest(".column-container").hide();
		$("[data-related-field=accessType]").closest(".row-container").hide();
		$("[data-related-field=accessType]").closest(".row-container").prev().hide(); // скрываю пустой row до блока
	 }
	 if ((accessType == "Для всех") && ($.inArray(naimETPID, EETPidArray) != -1)) {
		 $("input[name='inviteListCode']").val('');
		 $("input[name='inviteList']").val('');
		 $("input[data-field-name='inviteListCode']").val('');
		 $("input[name='inviteList']").closest(".column-container").hide()
		 $("[data-related-field=inviteList]").closest(".column-container").hide()
		 $("div[data-name='PKOcontractors']").parent().parent().parent().parent().hide()
		 $("input[name*='PKOcontractors-PKOINN-']").val('')
		 $("input[name*='PKOcontractors-PKOKPP-']").val('')
		 $("input[name*='PKOcontractors-PKOName-']").val('')
		 $("input[name*='PKOcontractors-PKOEmail-']").val('')
		 // Чистим таблицу Доступов к процедуре
		 ClearTable();
	 } else if ((accessType == "Для ограниченного круга заявителей") && ($.inArray(naimETPID, EETPidArray) != -1)) {		 
		 $("input[name='inviteList']").closest(".column-container").show();
		 $("[data-related-field=inviteList]").closest(".column-container").show();
		 $("div[data-name='PKOcontractors']").parent().parent().parent().parent().show();
		 
		  // Чистим таблицу Доступов к процедуре
		  if ($("input[name='inviteListCode']").val() != '') {
			 PKOTable.find(".table-remove-row-button").closest(".table-edit-column").hide();
			PKOTable.find(".table-add-row-button").closest(".table-edit-column").hide();
		  }
	 } else if ((accessType == "Для всех, с возможностью пригласить заявителей") && ($.inArray(naimETPID, EETPidArray) != -1)) {
		  $("input[name='inviteListCode']").val('');
		  $("input[name='inviteList']").val('');
		  $("input[data-field-name='inviteListCode']").val('');
		  $("input[name='inviteList']").closest(".column-container").hide()
		  $("[data-related-field=inviteList]").closest(".column-container").hide()
		   $("div[data-name='PKOcontractors']").parent().parent().parent().parent().show()
		 /*  $("input[name*='PKOcontractors-PKOINN-']").val('')
		  $("input[name*='PKOcontractors-PKOKPP-']").val('')
		  $("input[name*='PKOcontractors-PKOName-']").val('') */
		  PKOTable.find(".table-remove-row-button").closest(".table-edit-column").show();
		  PKOTable.find(".table-add-row-button").closest(".table-edit-column").show();
	 }
	 
	 function ClearTable() {
		 PKOTable.find('[data-rowkey]').each(function(index, element) {
			removeTableRow(element)
		});
	 }
 }
 
  $(document).on('change', "input[name='accessType']", function () {
	procedureAccess()
})

$(document).on('click', "div[data-name='PKOcontractors'] div.table-add-row-button", function (e) {
	hideProcedure();
})

function procedureAccessView(){
	var accessType = $(".documentView-field-value[data-name='Доступ к процедуре']").text();
	var test123 = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var accessTypeField = $("div[data-name='Доступ к процедуре']");
	var inviteListCode = $("div[data-name='Перечень ПКО']");

		if ((accessType == 'Для всех') && test123 !='АО &quot;МСП-ЕЭТП&quot;') {
			accessTypeField.closest(".column-container").show();
			inviteListCode.closest(".column-container").hide();
			$("div[data-api-table-name='Список заявителей с доступом к процедуре']").hide();
		} else if (((accessType == 'Для ограниченного круга заявителей') || (accessType == 'Для всех, с возможностью пригласить заявителей')) && test123 !='АО &quot;МСП-ЕЭТП&quot;') {	
			accessTypeField.closest(".column-container").show();
			inviteListCode.closest(".column-container").hide();
			$("div[data-api-table-name='Список заявителей с доступом к процедуре']").show();
		} else {
			accessTypeField.closest(".column-container").hide();
			inviteListCode.closest(".column-container").hide();
			$("div[data-api-table-name='Список заявителей с доступом к процедуре']").hide();
		}
}

var inviteListHandling = function() {
	 var inviteListCode = $("input[name='inviteListCode']").val();
	 var dictFieldsInfo = '{"DictionaryFieldInfoList":[{"EditName":"pko","DictColumnName":"code","ShowAsDisplayText":true,"DictColumnWidth":"","ShowAsDictionaryColumn":true},{"EditName":"PKOINN1","DictColumnName":"ИНН","ShowAsDisplayText":true,"DictColumnWidth":"","ShowAsDictionaryColumn":true},{"EditName":"PKOKPP1","DictColumnName":"КПП","ShowAsDisplayText":true,"DictColumnWidth":"","ShowAsDictionaryColumn":true},{"EditName":"PKONAME1","DictColumnName":"Наименование","ShowAsDisplayText":true,"DictColumnWidth":"","ShowAsDictionaryColumn":true}, {"EditName":"PKOlot","DictColumnName":"Номер лота","ShowAsDisplayText":true,"DictColumnWidth":"","ShowAsDictionaryColumn":true}]}';
	 var Table = $("div[data-name='PKOcontractors'] [data-rowkey]");
	 var PKOTable = $("div[data-name='PKOcontractors']");
	 
	 if (inviteListCode) {
		FormDictionaryHelperModule.getFormDictionaryItemsIds("Список контрагентов ПКО", dictFieldsInfo, "", function (data) {
			var parseData = JSON.parse(data.data);
			var l = parseData.children.length;
			var PKOapplics = [];			
							
			if (l != 0) {
				for (var i = 0; i < l; i++) {	
					var current = parseData.children[i];
					if (current["Номер лота"] == inviteListCode) {
						PKOapplics.push(current);
					}
				}
				// Удаление содержимого таблицы перед заполнением из псевдосправочника
				Table.each(function(index, element) {
						removeTableRow(element)
					});
				
				buildPKORows(PKOapplics);
				/* $.when.apply($, promises).then(function () {
						createDocRows(event, promises);		
						waitingDialog.hide();					
					}, function (error) {
						waitingDialog.hide();
						console.log(error);
					}); */
			}
		}, function (error) {
			console.log(error);
		});
		//Если очистили поле, то удаляем содержимое таблицы и отображаем кнопки
	 } else {
		 
		 Table.each(function(index, element) {
			removeTableRow(element)
		});
		PKOTable.find(".table-remove-row-button").closest(".table-edit-column").show();
		PKOTable.find(".table-add-row-button").closest(".table-edit-column").show();
	 }
	 
	 
	function buildPKORows(rowsData) {
		var l = rowsData.length;
			if (l != 0) {				
				PKOTable.find(".table-remove-row-button").closest(".table-edit-column").hide();
				PKOTable.find(".table-add-row-button").closest(".table-edit-column").hide();
				for (var i = 0; i < l; i++) {
					var current = rowsData[i];
					var rowKey = i+1;
					PKOTable.children().find('.table-add-row-button')[0].click();
					var newRow = PKOTable.find("[data-rowkey='" + rowKey + "']");
					newRow.find("[name='PKOcontractors-PKOINN-" + rowKey + "']").val(current["ИНН"]);
					newRow.find("[name='PKOcontractors-PKOKPP-" + rowKey + "']").val(current["КПП"]);
					newRow.find("[name='PKOcontractors-PKOName-" + rowKey + "']").val(current["Наименование"]);
					newRow.find("[name='PKOcontractors-PKOEmail-" + rowKey + "']").val(current["Почта"]);
									
				}	
				
			}
	}
 }
 
  $(document).on('change', "input[name='inviteListCode']", function () {
	inviteListHandling();
});

function CursView() {
	/* let nmc = $("div[data-name='НМЦ, вал.']"); */
	let nmc = $("div[data-name='НМЦ с НДС, руб.']");
	let curs = $("div[data-name='Курс валюты']");
	let dateCurs = $("div[data-name='Дата, на которую установлен курс валюты']");
	let currency = $(".documentView-field-value[data-name='Валюта']").text();
	if ((currency == 'Российский рубль')) {
		nmc.closest(".column-container").hide();
		curs.closest(".column-container").hide();
		dateCurs.closest(".column-container").hide();
	} else {
		nmc.closest(".column-container").show();
		curs.closest(".column-container").show();
		dateCurs.closest(".column-container").show();
	}

}

//функция для отображения чекбокса Квалификационный отбор OnRegister OnEdit 
function showEditKvalOtbor(){
	var naimETP = $("input[name='naimETP']");
	var flag = $("input[name='Obetap']").val();
	if (naimETP.val() == 'АО "ЕЭТП"' && flag!='5'){
		$("input[type='checkbox'][name='kvalotb']").closest(".column-container").show()
	}
	else{
		$("input[type='checkbox'][name='kvalotb']").closest(".column-container").hide()
		hidequalificationreg() //функция скрывает вклдку Квалификационный отбор, если чекбокс с edit-name = kvalotb равен 0
	}
	IzmenenieReg();
	IzmenenieEdit();
}

function NDACheck() {
	let naimETP = $("input[name='naimETP']");
		if (naimETP.val() == 'АО "РТ-ЕЭТП"') {
			$("input[name='TrebNDA']").closest(".column-container").show();
		} else {
			$("input[name='TrebNDA']").closest(".column-container").hide();
		}
}

function maskKontTel() {
	$("input[name='kontTel']").one('click', function() {
	 $("input[name='kontTel']").inputmask({"mask": "+9{1,5}(9{1,6})9{5,12}"});
	});
}

function longSrokProcedure(){
	var naimETP = $("input[name='naimETP']");
	var statusnotice = $("input[name='statusnotice']").val();
	var longSrokProcedure = $("[name='longSrokProcedure'][type='checkbox']");
	var longSrokCode = $("[data-field-name='longSrokCode']");
	var ConditionLongSrokCode = $("[data-field-name='ConditionLongSrokCode']");
	if (naimETP.val() == 'АО "ЕЭТП"') {
		longSrokProcedure.closest(".column-container").show();
		longSrokCode.closest(".column-container").show();
		ConditionLongSrokCode.closest(".column-container").show();
		$("[data-related-field='longSrokCode']").closest(".column-container").show();
		$("[data-related-field='ConditionLongSrokCode']").closest(".column-container").show();
		
		if( longSrokProcedure.is(":checked") ){
			longSrokCode.closest(".column-container").show();
			ConditionLongSrokCode.closest(".column-container").show();
			$("[data-related-field='longSrokCode']").closest(".row-container").show();
			$("[data-related-field='ConditionLongSrokCode']").closest(".row-container").show();
		}
		else{
			longSrokCode.closest(".column-container").hide();
			ConditionLongSrokCode.closest(".column-container").hide();
			$("[data-related-field='longSrokCode']").closest(".row-container").hide();
			$("[data-related-field='ConditionLongSrokCode']").closest(".row-container").hide();
		}
	}
	else{
		longSrokProcedure.prop('checked', false);
		longSrokCode.val('');
		$("[name='longSrokCode']").val('');
		ConditionLongSrokCode.val('');
		$("[name='ConditionLongSrokCode']").val('');
		longSrokProcedure.closest(".column-container").hide();
		longSrokCode.closest(".column-container").hide();
		ConditionLongSrokCode.closest(".column-container").hide();
		$("[data-related-field='longSrokCode']").closest(".row-container").hide();
		$("[data-related-field='ConditionLongSrokCode']").closest(".row-container").hide();
	}
}

function longSrokProcedureChange(){
	var longSrokProcedure = $("[name='longSrokProcedure'][type='checkbox']");
	var longSrokCode = $("[data-field-name='longSrokCode']");
	var ConditionLongSrokCode = $("[data-field-name='ConditionLongSrokCode']");
	$(document).on('change', "input[data-field-name='longSrokProcedure']", function (e) {
		if( longSrokProcedure.is(":checked") ){
			longSrokCode.closest(".column-container").show();
			ConditionLongSrokCode.closest(".column-container").show();
			$("[data-related-field='longSrokCode']").closest(".row-container").show();
			$("[data-related-field='ConditionLongSrokCode']").closest(".row-container").show();
			if( $("[name='longSrokCode']").val() == ""){
				$("[name='longSrokCode']").val("1")
				longSrokCode.val("1")
			}
			if( $("[name='ConditionLongSrokCode']").val() == ""){
				$("[name='ConditionLongSrokCode']").val("Подано 0 заявок")
				ConditionLongSrokCode.val("Подано 0 заявок")
			}
		}
		else{
		longSrokCode.val('');
		$("[name='longSrokCode']").val('');
		ConditionLongSrokCode.val('');
		$("[name='ConditionLongSrokCode']").val('');
		longSrokCode.closest(".column-container").hide();
		ConditionLongSrokCode.closest(".column-container").hide();
		$("[data-related-field='longSrokCode']").closest(".row-container").hide();
		$("[data-related-field='ConditionLongSrokCode']").closest(".row-container").hide();
		}
	})
}

function longSrokProcedurView(){
	var nameETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var statusnotice = $(".documentView-field-value[data-name='Статус']").text();
	if (nameETP == 'АО "ЕЭТП"' || nameETP == 'АО &quot;ЕЭТП&quot;') {
		$("div[data-name='Автоматическое продление сроков процедуры']").closest(".column-container").show();
	}
	else{
		$("div[data-name='Автоматическое продление сроков процедуры']").closest(".column-container").hide();
	}
}

function MaxCountQuery(){
	var naimETP = $("input[name='naimETP']");
	var statusnotice = $("input[name='statusnotice']").val();
	var MaxCountQuery = $("[data-field-name='MaxCountQuery']");
	var flag = $("input[name='Obetap']").val();
	if (naimETP.val() == 'АО "ЕЭТП"') {
		if (flag=='5'){
			MaxCountQuery.autoNumeric('wipe')
			MaxCountQuery.closest(".column-container").hide()
			$("[data-related-field='MaxCountQuery']").closest(".column-container").hide()
		}
		else{
			MaxCountQuery.closest(".column-container").show()
			$("[data-related-field='MaxCountQuery']").closest(".column-container").show()
			if( MaxCountQuery.val() == "" ){
				MaxCountQuery.val("5")
			}
		}
	}
	else{
		MaxCountQuery.autoNumeric('wipe')
		MaxCountQuery.closest(".column-container").hide()
		$("[data-related-field='MaxCountQuery']").closest(".column-container").hide()
	}
}

function MaxCountQueryView(){
	var nameETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var statusnotice = $(".documentView-field-value[data-name='Статус']").text();
	if (nameETP == 'АО "ЕЭТП"' || nameETP == 'АО &quot;ЕЭТП&quot;') {
		$("div[data-name='Максимальное количество запросов от одного участника']").closest(".column-container").show();
	}
	else{
		$("div[data-name='Максимальное количество запросов от одного участника']").closest(".column-container").hide();
	}
}

function porRassmZa(){
	var naimETP = $("input[name='naimETP']");
	var statusnotice = $("input[name='statusnotice']").val();
	var formTorg = $("input[name='formTorgName']");
	var porRassmZa = $("[data-field-name='porRassmZa']");
	if ( (naimETP.val() == 'АО "ЕЭТП"') && (formTorg.val() == "Аукцион" || formTorg.val() == "Аукцион на повышение" || formTorg.val() == "Аукцион" || formTorg.val() == "Конкурс" || formTorg.val() == "Запрос предложений") ) {
		porRassmZa.closest(".column-container").show()
		$("[data-related-field='porRassmZa']").closest(".column-container").show()
		if( porRassmZa.val() == "" ){
			porRassmZa.val("Заявки в одной части")
			$("input[name='porRassmZa']").val("Заявки в одной части")
		}
	}
	else{
		porRassmZa.val("")
		$("input[name='porRassmZa']").val("")
		porRassmZa.closest(".column-container").hide()
		$("[data-related-field='porRassmZa']").closest(".column-container").hide()
	}
}

function porRassmZaView(){
	var nameETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var formTorg = $(".documentView-field-value[data-name='Форма торгов']").text();
	var statusnotice = $(".documentView-field-value[data-name='Статус']").text();
	if ( ( (nameETP == 'АО "ЕЭТП"' || nameETP == 'АО &quot;ЕЭТП&quot;') && statusnotice != "Черновик") && (formTorg == "Аукцион" || formTorg == "Аукцион на повышение" || formTorg == "Аукцион" || formTorg == "Запрос предложений") ) {
		$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").show();
	}
	else{
		$("div[data-name='Порядок рассмотрения  заявок']").closest(".column-container").hide();
	}
}

function send_to_oosRegisterEdit(){
	var statusnotice = $("input[name='statusnotice']").val();
	var send_to_oos = $("input[type='checkbox'][name='send_to_oos']");
	var flag = $("input[name='Obetap']").val();
	var naimETPID = $("input[name='naimETPID']").val();
	var orgzakCommercial = $("input[type='checkbox'][name='orgzakCommercial']");
	var ARR_EETP_ID = ['1', '2', ''];
	//Не отображаем чекбокс send_to_oos, если это МСП площадка или сбребанк АСТ
		if (ARR_EETP_ID.indexOf(naimETPID) == -1) {
			if(flag=='5'){
				send_to_oos.closest(".column-container").hide()
				$("[data-related-field='send_to_oos']").closest(".column-container").hide()
			}
			else {
				send_to_oos.closest(".column-container").show()
			$("[data-related-field='send_to_oos']").closest(".column-container").show()
			}
		}
		else{
			send_to_oos.closest(".column-container").hide()
			$("[data-related-field='send_to_oos']").closest(".column-container").hide()
		}
}

function send_to_oosRegister(){
	var send_to_oos = $("input[type='checkbox'][name='send_to_oos']");
	var orgzakCommercial = $("input[type='checkbox'][name='orgzakCommercial']");
	if ( (orgzakCommercial.is(":checked")) ){
		send_to_oos.prop('checked', true);
	}
}

function send_to_oosView(){
	var statusnotice = $(".documentView-field-value[data-name='Статус']").text();
	if ( statusnotice != "Черновик" ) {
		$("div[data-name='Не отправлять сведения в ЕИС']").closest(".column-container").show();
	}
	else{
		$("div[data-name='Не отправлять сведения в ЕИС']").closest(".column-container").hide();
	}
}

//функция для отображения чекбокса Базис сравнения OnRegister OnEdit 
function showEditBazis(){
	var naimETP = $("input[name='naimETP']");
	if (naimETP.val() == 'АО "МСП-ЕЭТП"' ){
		$("input[type='checkbox'][name='bazisNds']").closest(".column-container").show()
		$("[data-related-field='bazisNds']").closest('.column-container').show(); // скрываем label
	}
	else{
		$("input[type='checkbox'][name='bazisNds']").closest(".column-container").hide()
		$("[data-related-field='bazisNds']").closest('.column-container').hide(); // скрываем label
	}
}

function showBazisView(){
	var bazisNds = $("div[data-name='Базис сравнения с НДС']");
	var naimETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	if (naimETP == 'АО &quot;МСП-ЕЭТП&quot;') {
		bazisNds.closest(".column-container").show();
	} else {
		bazisNds.closest(".column-container").hide();
	}
}

var dateView = function () {
	if (!$(".documentView-field-value[data-name='Планируемая дата рассмотрения 2-ых частей заявок участников']").attr("title")) {	
		$("div[data-name='Планируемая дата рассмотрения 2-ых частей заявок участников']").closest(".column-container").parent().hide();		
	} 
	else {
		$("div[data-name='Планируемая дата рассмотрения 2-ых частей заявок участников']").closest(".column-container").parent().show();
		$("div[data-name='Планируемая дата рассмотрения заявок участников'] > .documentView-field-label").text('Планируемая дата рассмотрения 1-ых частей заявок участников');
	}
}

function checkedChange(){//по умолчанию при внесении изменения проставляем чекбкос "Изменение"
	let statusnotice = $("input[name='statusnotice']").val();
	let otmena = $("input[name='otmena']");
	let Change = $("input[name='Change']");
	if(statusnotice=="Внесение изменений" && !$(otmena).is(":checked")){
		Change.prop("checked",true)
	}
}
function IzmenenieSettings(){//делаем readonly при внесении изменений для полей подобно тому как реализовано на площадке
	var statusnotice=$("input[name='statusnotice']").val();
	var numRed=$("input[name='numRed']").val();
	if (statusnotice=="Внесение изменений" || numRed >1) {
		$("input[data-field-name='naimETP']").prop("readonly", true)
		$("button#naimETP").prop("disabled", true)
		$("button#accessType").prop("disabled", true)
		$("button#inviteListCode").prop("disabled", true)
		$("div[data-name='PKOcontractors']").find('.table-add-row-button').closest('.table-edit-column').hide();
		$("div[data-name='PKOcontractors']").find('.table-remove-row-button').closest('.table-edit-column').hide();
		$("input[data-field-name='formTorg']").prop("readonly", true)
		$("button#formTorg").prop("disabled", true)
		$("input[data-field-name='send_to_oos']").readonly()
		$("input[data-field-name='koefsn']").readonly()
		$("input[data-field-name='predlpovrt']").readonly()
		$("input[data-field-name='poPosZak']").readonly()
	}
}

function customDropDownHandle(){
	
	$(".document-view-actions").find("a:contains('Отправить на ЭТП')").each(function() { 

        var button = $(this);
		var onclickFunc = button.attr('onclick');		
		button.attr('onclick', 'return false;');
		
		button.click(function(ev) {
			var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
			var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
			var dateOkonPod =  $(".documentView-field-value[data-name='Дата окончания подачи заявок']")[1].title;
			var formTorg =  $(".documentView-field-value[data-name='Форма торгов']").attr("title");
			var nameETP =  $(".documentView-field-value[data-name='Наименование ЭТП']").attr("title");
			var Otmena = $("div.documentView-field-value[data-name='Дата принятия решения об отмене']").attr('title');
			var datenachpr = $("div.documentView-field-value[data-name='Дата начала подачи заявок']").attr('title');
			var dateProcedure = $("div.documentView-field-value[data-name='Дата начала предоставления документации']").attr('title');
			var datePodPredl = $("div.documentView-field-value[data-name='Дата начала срока подачи предложений']").attr('title');
			var DecisionDate = $("div.documentView-field-value[data-name='Дата принятия решения']").attr('title');	

			// чекбоксы внесения изменений и отмены закупки
			var ProcedureChanges = $("div.documentView-field-value[data-name='Изменение']").attr('title');
			var ProcedureCancel = $("div.documentView-field-value[data-name='Отмена закупки']").attr('title');
			
			var numETP = $("div.documentView-field-value[data-name='Номер на ЭТП']").attr('title');
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
			today1Spec = new Date(today1Spec);
			
			var getProject = $.grep(dxDataGridDocs._store._array, function(item){
			  return item.Fields.AttachmentPublication == "Публикуется";
			});	
			// Если не внесение изменений и не отмена процедуры
			if (ProcedureChanges !=1 && ProcedureCancel !=1) {

				// Сравниванием дату начала подачи заявок с текущей датой
				if (datenachpr) { // Дата начала подачи заявок не пустое поле
					
					var datenachpr1 = parseDateTime(datenachpr);
					if (today1Spec > datenachpr1){
					showCommonErrors('"Дата начала подачи заявок" не может быть в прошлом.');		
					return;
					}
				}
				
				// Сравниванием дату начала предоставления документации с текущей датой
				if (dateProcedure){ // Дата начала предоставления документации не пустое поле
					var dateProcedure1 = parseDateTime(dateProcedure);	
					if (today1Spec > dateProcedure1) {	
						showCommonErrors('"Дата начала предоставления документации" не может быть в прошлом.');
						return;
					}
				}
				
				// Сравниванием дату начала срока подачи ценовых предложений с текущей датой
				if ((datePodPredl) && formTorg == 'Запрос цен (коммерческих предложений)'){
					var datePodPredl1 = parseDateTime(datePodPredl);	
					if (today1Spec > datePodPredl1) {	
						showCommonErrors('"Дата начала срока подачи ценовых предложений" не может быть в прошлом.');
						return;
					}
				}
			}
			
			var textErrors = [];			
			
			if(getProject.length == 0){
				textErrors.push("Публикуется")
			}			
			if(textErrors.length > 0){
				var files_errorMessage = (textErrors.length > 0) ? 'документа необходимо приложить файл с Признаком публикации: ' + textErrors.join(', ') : '';
				var errorMessage = "Для публикации " + files_errorMessage +".";
				showCommonErrors(errorMessage);
				return;
			}  else if ((nameETP != 'АО "Сбербанк - АСТ"' && !dateOkonPod) || (nameETP == 'АО "Сбербанк - АСТ"' && !formTorg)){
				showCommonErrors("Для публикации на ЭТП необходимо заполнить обязательные поля. Пожалуйста возьмите карточку на редактирование и внесите недостающую информацию.");
				return;
			}
			else{
				eval(onclickFunc);
			}

			function parseDateTime(date) { 
				var dt = date.split(' ');
				var d = dt[0];
				// var t = dt[1];
				var dprovision = d.split('.');
				return new Date(dprovision[2], dprovision[1]-1, dprovision[0]); // берем только дату без времени
			}

		});

	});
}

var CalculateCurrentDate = function() {
	var CurrentDate = $("input[name='Currentdate']");
	var today=new Date()
	var day=(today.getDate()-1);
		if (day < 10) {
			day = '0' + day;
		}
		var month=(today.getMonth()+1);
		if (month < 10) {
			month = '0' + month;
		}
		
	var sNow = day + "." + month + "." + today.getFullYear();
	CurrentDate.parent().data("DateTimePicker").date(sNow);
}

$(document).ready(function () {
	// Ждем подгрузку линков
	gridReady("").then(function () {
		// Находим линк лота
		var LinkDocument = $("div[data-state-key='LLotOrder223Links']").find("[role = 'menubar']").first();
		var ButtonArray = ['Заполнить цену за единицу товара, работы, услуги', 'Корректировка НМЦ и размера НДС'];
		if (LinkDocument.length > 0) {
			/*  Ждем события клика по кнопке массовго редактирования */ 
			LinkDocument.on('click', function () {
				$(document).on('transitionend', function (doc) {
					/* Находим все формы с кнопками для единичных действий */
					var ButtonSingleAction = $("div[data-state-key='LLotOrder223Links']").find("div.dx-datagrid-rowsview").find("tr.dx-data-row").find("div.dx-overlay-content.dx-resizable.dx-context-menu.dx-menu-base");
					var arr = Array.from(ButtonSingleAction)
					/* Если это не форма с кнопками для единичных действий */
					if(!arr.includes(doc.target)){
						var LinkDocumentChild = $(LinkDocument).find("div.dx-overlay-content.dx-resizable.dx-context-menu.dx-menu-base.dx-state-invisible");
						/* Проверяем, есть ли в дочках у нашей кнопки форма с действиями */
						if (LinkDocumentChild.length < 1 && !LinkDocument.hasClass('dx-state-invisible')) {
							if ($(doc.target).length > 0) {
								var LiRows = $(doc.target).find("li");
								$(LiRows).each(function (index, elem) {
									var RowName = $(elem).find("span.dx-menu-item-text").text();
									if (ButtonArray.includes(RowName)) {
										$(elem).remove();
									}
								})
							}
						}
					}
				})	
			})
		}
	})
})

function changeHideRegEdit(){
	let numRed = $("input[name='numRed']").val();
	let statusnotice=$("input[name='statusnotice']").val();
	let otmena=$("input[data-field-name='otmena']");
	let Change=$("input[data-field-name='Change']");
	Change.closest('.column-container').hide();
	if( (statusnotice=="Внесение изменений") || ($(Change).is(":checked")) ){
		$("li:has(:contains('Изменения'))").show();
	}
	else{
		$("li:has(:contains('Изменения'))").hide();
	}
}

function changeHideView(){
	let numRed = $("div.documentView-field-value[data-name='Номер редакции']").text();
	let ETPName = $("div.documentView-field-value[data-name='Наименование ЭТП']").text();
	let formTorgText =  $(".documentView-field-value[data-name='Форма торгов']").text();
	let Cancel = $("div.documentView-field-value[data-name='Отмена закупки']").attr('title');
	let Change = $("div.documentView-field-value[data-name='Изменение']").attr('title');
	
	ViewfiledHide(['Отменить процедуру в целом', 'Орган, выдавший решение об отмене процедуры', 'Вынесено решение антимонопольного органа']);
	LegendAndEmptyRowHide(['Сведения об отмене лотов']);
	
	if(numRed>1 || Cancel == 1 || Change == 1){
		$("li:has(:contains('Изменения'))").show();

		if (Change != 1) {
			ViewfiledHide(['Изменение', 'Дата принятия решения', 'Обоснование внесения изменений']);
		}
		
		if (Cancel != 1) {
			ViewfiledHide(['Отмена закупки', 'Дата принятия решения об отмене', 'Основание принятия решения об отмене', 'Закупка отменяется вследствие возникновения обстоятельств непреодолимой силы в соответствии с гражданским законодательством']);
		}
		
		if (ETPName == 'АО &quot;Сбербанк - АСТ&quot;') {
			
			if (Cancel == 1) {
				ViewfiledShow(['Отменить процедуру в целом', 'Орган, выдавший решение об отмене процедуры']);
				LegendAndEmptyRowShow(['Сведения об отмене лотов']);
			}
			
			if (Change == 1) {
				if (['Запрос цен (коммерческих предложений)'].indexOf(formTorgText) == -1) {
					ViewfiledShow(['Вынесено решение антимонопольного органа']);
				}
			}
			
		}
		
		
		
	}
	else{
		$("li:has(:contains('Изменения'))").hide();
	}
}

var ParseUrlOnEETPView = function() {
	var Url = $(".documentView-field-value[data-name='Ссылка на торговой площадке']");
	if (Url.attr('title')){
		var arr = Url.attr('title').split(";");
		
		if (arr.length > 1) {
			// Удаляем существующие ссылки
			Url.find("a[href]").remove();
			arr.forEach(function(item, i, aray){
				// Формируем новые ссылки			
				$(Url).append($('<a href='+item+' target=_blank>'+item+'</a><br>'));
			})
		}
	} else {
		Url.closest('.column-container').hide();
	}
	
	HideIfEmptyOnView(['Дата последнего обновления']);
}

var otmenaview = function () {
	if (!$(".documentView-field-value[data-name='Дата принятия решения об отмене']").attr("title")) {	
		$("div fieldset legend:contains('Сведения об отмене закупки')").closest(".column-container").hide();
		$("div fieldset legend:contains('Сведения об отмене закупки')").closest(".column-container").prev().hide();
	} 
	else {
		$("div fieldset legend:contains('Сведения об отмене закупки')").closest(".column-container").show();
		$("div fieldset legend:contains('Сведения об отмене закупки')").closest(".column-container").prev().show();
	}
}

// функция рассчета дат перед сохранением (для СберАст)
function DocumentSaveDate() {
	var form = $("form");
	form.on("beforeSubmit", function (args) {
		var flag = true;
		var errorMessage; // Сообщение об ошибке
		var naimETPID=$("input[name='naimETPID']").val(); 
		var formTorg = $("input[name='formTorgName']").val();
		var statusnotice=$("input[name='statusnotice']").val();
		var PricesProvisionStartDate = $("input[name='PricesProvisionStartDate']"); // Дата начала срока подачи ценовых предложений
		var PricesProvisionEndDateSber = $("input[name='PricesProvisionEndDateSber']"); // Дата и время окончания срока подачи предложений
		var datenachpod = $("input[name='datenachpod']"); // Дата начала подачи заявок
		var dateokonpodSingleBlock = $("input[name='dateokonpodSingleBlock']"); // Дата окончания подачи заявок
		var NMCD = $("input[name='NMCD']");
		var Price = NMCD.autoNumeric('get');
		var dateBeginDocumentation = $("input[name='dateBeginDocumentation']"); // Дата начала предоставления документации
		var AdittionalStepTable = $("div[data-name='AdditionalPurchaseStage'] [data-rowkey]");
		
		//парсим дейттайм (даты с временем).
		function parseDateTime(input) {
			var dt = input[0].value.split(' ');
			var d = dt[0];
			var t = dt[1];
			var dparts = d.split('.');
			return new Date(dparts[2], dparts[1]-1, dparts[0]);
		}
		
		function parseDateTimeReturnDateTime(input) {
			var dt = input[0].value.split(' ');
			var d = dt[0];
			var t = dt[1];
			var dparts = d.split('.');
			var tparts = t.split(':');
			return new Date(dparts[2], dparts[1]-1, dparts[0], tparts[0], tparts[1]);
		}
		
		if (naimETPID == 2) { // СберАст
			if (formTorg == 'Запрос цен (коммерческих предложений)'){
				var PricesProvisionStartDate1 = parseDateTime(PricesProvisionStartDate);
				var ricesProvisionEndDate1 = parseDateTime(PricesProvisionEndDateSber);	
				var diffDays = parseInt((ricesProvisionEndDate1 - PricesProvisionStartDate1) / (24 * 3600 * 1000)); // вычисляем количество дней между датами			
				if (diffDays < 1) { 
					flag = false;
					
					errorMessage = 'Длительность срока подачи ценовых предложений должна составлять не менее, чем 1 день';
					PricesProvisionEndDateSber.parent().data("DateTimePicker").clear();
					ShowErrors(errorMessage);
				}
				if (PricesProvisionStartDate){
				var PricesProvisionStartDate1 = parseDateTime(PricesProvisionStartDate);
				var dateBeginDocumentation1 = parseDateTime(dateBeginDocumentation);				
					if (dateBeginDocumentation1 < PricesProvisionStartDate1) {	
						flag = false;
						
						errorMessage = '"Дата начала предоставления документации" не должна быть раньше "Дата начала срока подачи ценовых предложений"';
						dateBeginDocumentation.parent().data("DateTimePicker").clear();
						ShowErrors(errorMessage);
					}
				}
			} 
			else if (formTorg == 'Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства' || formTorg == 'Конкурс в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства') {
				if (statusnotice != "Внесение изменений" && (Number(Price) < 30000000.00 || Number(Price) == 30000000.00)){
					var datenachpod1 = parseDateTime(datenachpod);
					var dateokonpodSingleBlock1 = parseDateTime(dateokonpodSingleBlock);	
					var diffDays = parseInt((dateokonpodSingleBlock1 - datenachpod1) / (24 * 3600 * 1000));			
					if (diffDays < 7) { 
						flag = false;
						
						errorMessage = 'Длительность этапа подачи заявок должна составлять не менее, чем 7 дней';
						dateokonpodSingleBlock.parent().data("DateTimePicker").clear();
						ShowErrors(errorMessage);
					}
				} else if (statusnotice != "Внесение изменений" && (Number(Price) > 30000000.00)){
					var datenachpod1 = parseDateTime(datenachpod);
					var dateokonpodSingleBlock1 = parseDateTime(dateokonpodSingleBlock);	
					var diffDays = parseInt((dateokonpodSingleBlock1 - datenachpod1) / (24 * 3600 * 1000));			
					if (diffDays < 15) { 
						flag = false;
						
						errorMessage = 'Длительность этапа подачи заявок должна составлять не менее, чем 15 дней';
						dateokonpodSingleBlock.parent().data("DateTimePicker").clear();
						ShowErrors(errorMessage);
					}
				} else if (statusnotice == "Внесение изменений" && (Number(Price) < 30000000.00 || Number(Price) == 30000000.00)){
					var datenachpod1 = parseDateTime(datenachpod);
					var dateokonpodSingleBlock1 = parseDateTime(dateokonpodSingleBlock);	
					var diffDays = parseInt((dateokonpodSingleBlock1 - datenachpod1) / (24 * 3600 * 1000));			
					if (diffDays < 4) { 
						flag = false;
						
						errorMessage = 'Длительность этапа подачи заявок должна составлять не менее, чем 4 дней';
						dateokonpodSingleBlock.parent().data("DateTimePicker").clear();
						ShowErrors(errorMessage);
					}
				} else if (statusnotice == "Внесение изменений" && (Number(Price) > 30000000.00)){
					var datenachpod1 = parseDateTime(datenachpod);
					var dateokonpodSingleBlock1 = parseDateTime(dateokonpodSingleBlock);	
					var diffDays = parseInt((dateokonpodSingleBlock1 - datenachpod1) / (24 * 3600 * 1000));			
					if (diffDays < 8) { 
						flag = false;
						
						errorMessage = 'Длительность этапа подачи заявок должна составлять не менее, чем 8 дней';
						dateokonpodSingleBlock.parent().data("DateTimePicker").clear();
						ShowErrors(errorMessage);
					}
				}
			} 
			else if (formTorg == 'Запрос котировок в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства') {
				if (Number(Price) > 7000000.00){
					flag = false;
						
						errorMessage = 'Начальная (максимальная) цена договора не должна превышать семь миллионов рублей.';
						ShowErrors(errorMessage);
				}
			} 
			else if (formTorg == 'Запрос предложений в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства') {
				if (Number(Price) > 15000000.00){
					flag = false;
						
						errorMessage = 'Начальная (максимальная) цена договора не должна превышать пятнадцать миллионов рублей';
						ShowErrors(errorMessage);
				}
			} /* else if (['Конкурс', 'Аукцион', 'Конкурс (заявка из 2-х частей)', 'Аукцион (заявка из 2-х частей)', 'Аукцион с двумя частями заявок', 'Аукцион в электронной форме'].indexOf(formTorg) > -1) {
				var datenachpod1 = parseDateTime(datenachpod);
					var dateokonpodSingleBlock1 = parseDateTime(dateokonpodSingleBlock);	
					var diffDays = parseInt((dateokonpodSingleBlock1 - datenachpod1) / (24 * 3600 * 1000));			
					if (diffDays < 15) { 
						flag = false;
						
						errorMessage = 'Длительность этапа подачи заявок должна составлять не менее, чем 15 дней';
						dateokonpodSingleBlock.parent().data("DateTimePicker").clear();
						ShowErrors(errorMessage);
					}
			} */
			// тут проверяем доп этапы
			if (flag && AdittionalStepTable.length > 0) {
				for (var i=0; i < AdittionalStepTable.length; i++) {
					var CurrentStep = $(AdittionalStepTable[i]).find("input[data-field-name*='-AdditionalStageCode-']").val();
					var CurrentStartDate = $(AdittionalStepTable[i]).find("input[data-field-name*='-AdditionalStageStartDate-']");
					
					if (CurrentStep == 'Квалификационный отбор') {
						if (parseDateTimeReturnDateTime(CurrentStartDate) < parseDateTimeReturnDateTime(dateokonpodSingleBlock)) {
							flag = false;

							errorMessage = 'Дата начала квалификационного отбора('+CurrentStartDate.val()+') не может быть раньше даты окончания подачи заявок('+dateokonpodSingleBlock.val()+')';
							ShowErrors(errorMessage);
						}
					}
				}
				
			}
			
			if (datenachpod) { // Дата начала подачи заявок не пустое поле
				
				var datenachpod1 = parseDateTime(datenachpod);
				var dateBeginDocumentation1 = parseDateTime(dateBeginDocumentation);				
				if (dateBeginDocumentation1 < datenachpod1) {	
					flag = false;
					
					errorMessage = '"Дата начала предоставления документации" не должна быть раньше "Дата начала подачи заявок"';
					dateBeginDocumentation.parent().data("DateTimePicker").clear();
					ShowErrors(errorMessage);
				}
			}
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

function OtlDatePriem(){
	var nameETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	var flag=$("div[data-name='Установлено требование о закупке товаров российского происхождения']").find("input[type='checkbox']");
	if (nameETP == 'АО "ЕЭТП"' || nameETP == 'АО &quot;ЕЭТП&quot;') {
		if (!$(flag).attr("checked")){
			ViewfiledHide(['Отложенная дата начала приема заявок']);
		}
	}
	else{
		ViewfiledHide(['Указать отложенную дату начала приема заявок', 'Отложенная дата начала приема заявок']);
	}
}

$(document).on('change', "input[name*='PKOcontractors-PKOINN-']", function (e) {
   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
   var currentINN = $(this).val(); //ФИО текущего пользователя
  
   if (currentINN.length < 10 || currentINN.length > 12){
		showCommonErrors("ИНН должен быть больше 10 и меньше 12 символов");
		$("input[name='PKOcontractors-PKOINN-" + rowkey+ "']").val('')
    }
});

scopes.onRegister(FilterOrg);
scopes.onRegister(ChangeHeights);
// scopes.onRegisterTemp(adjustFieldsVisibilityEdit);
scopes.onRegisterTemp(editreg);
scopes.onRegisterTemp(hidequalificationreg);
scopes.onRegisterTemp(hideetpreg);
scopes.onRegisterTemp(validateformtraidingreg);
scopes.onRegisterTemp(addrowCustomerTable);
scopes.onRegister(DateItog); 
scopes.onRegister(IzmenenieReg);
//scopes.onRegister(splitPhone);
//scopes.onRegister(rebuildFieldPhone);
//scopes.onRegister(splitFax);
//scopes.onRegister(rebuildFieldFax);
scopes.onRegister(Obyazetap);
scopes.onRegister(summary);
//scopes.onRegister(etpforreg);
scopes.onRegister(EPhide);
scopes.onRegister(EtpFilterDictionary);
scopes.onRegister(rtkhide);
scopes.onRegister(stepRT);
scopes.onRegister(dvechasti);
scopes.onRegister(rtkhideall);
scopes.onRegister(CheckboxReadonly);
scopes.onRegister(showEditKvalOtbor);
scopes.onRegister(naizmnameETP);
scopes.onRegister(NDACheck);
scopes.onRegister(longSrokProcedure);
scopes.onRegister(longSrokProcedureChange);
scopes.onRegister(MaxCountQuery);
scopes.onRegister(porRassmZa);
// scopes.onRegister(porRassmZaChange);
scopes.onRegister(send_to_oosRegisterEdit);
scopes.onRegister(send_to_oosRegister);
scopes.onRegister(showEditBazis);
/* scopes.onRegister(showEditRnp); */
scopes.onRegister(checkedChange);
scopes.onRegister(IzmenenieSettings);
scopes.onRegister(CalculateCurrentDate);
scopes.onRegister(changeHideRegEdit);
scopes.onRegister(documentCancelHide);
scopes.onRegister(DocumentSaveDate);

scopes.onEdit(rtkhideall);
scopes.onEdit(ChangeHeights);
scopes.onEdit(stepRT);
scopes.onEdit(rtkhide);
scopes.onEdit(FilterOrg);
// scopes.onEditTemp(adjustFieldsVisibilityEdit);
scopes.onEdit(editreg);
scopes.onEdit(validateformtraidingedit);
scopes.onEdit(hidequalificationreg);
scopes.onEdit(hideetpreg);
scopes.onEdit(addrowCustomerTable);
scopes.onEdit(DateItog);
scopes.onEdit(IzmenenieEdit);
//scopes.onEdit(rebuildFieldPhone);
//scopes.onEdit(splitPhone);
//scopes.onEdit(rebuildFieldFax);
//scopes.onEdit(splitFax);
scopes.onEdit(Obyazetap);
scopes.onEdit(summary);
scopes.onEdit(EPhide);
scopes.onEdit(dvechasti);
// scopes.onEdit(hideKPblocksedit);
scopes.onEdit(procedureAccess);
scopes.onEdit(CheckboxReadonly);
scopes.onEdit(showEditKvalOtbor);
scopes.onEdit(naizmnameETP);
scopes.onEdit(NDACheck);
scopes.onEdit(maskKontTel);
scopes.onEdit(longSrokProcedure);
scopes.onEdit(longSrokProcedureChange);
scopes.onEdit(MaxCountQuery);
scopes.onEdit(porRassmZa);
// scopes.onEdit(porRassmZaChange);
scopes.onEdit(send_to_oosRegisterEdit);
scopes.onEdit(showEditBazis);
/* scopes.onEdit(showEditRnp); */
scopes.onEdit(IzmenenieSettings);
scopes.onEdit(CalculateCurrentDate);
scopes.onEdit(EtpFilterDictionary);
scopes.onEdit(DocumentSaveDate);
scopes.onEdit(changeHideRegEdit);

scopes.onViewTemp(hidequalificationview);
scopes.onViewTemp(hidecountstepview);
scopes.onViewTemp(hideblocksview);
scopes.onViewTemp(hideetpview);
scopes.onView(izmenView);
scopes.onView(ParseUrlOnEETPView);
//scopes.onView(hidesvyzView);
scopes.onView(etapview);
scopes.onView(PredDocView);
scopes.onView(rtkhideview);
scopes.onView(procedureAccessView);
scopes.onView(CursView);
scopes.onView(dvechastiView);
scopes.onView(porRassmZaView);
scopes.onView(rtkcheckview);
scopes.onView(longSrokProcedurView);
scopes.onView(MaxCountQueryView);
scopes.onView(send_to_oosView);
scopes.onView(showBazisView);
scopes.onView(dateView);
scopes.onView(changeHideView);
scopes.onView(otmenaview);
scopes.onView(OtlDatePriem);