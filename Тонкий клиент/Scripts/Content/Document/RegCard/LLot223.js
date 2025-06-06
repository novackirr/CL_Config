"use strict";
var TRUDict = {};
var TRUDictArr = [];
	function initTruData() {
		var defer = jQuery.Deferred();
		var registerOrgZa = $("input[name='registerOrgZaId']").val();
		var orgzakINN = $("input[name='orgzakINN']").val();
		var fields = ["code"]
		var base = $("base").attr("href") === "/" ? "" : $("base").attr("href");
		var url = base + "/FormdataDict/GetJson?formdataDictKey=" + encodeURI("Перечни ТРУ")+"&formValues=%7B%22orgzakINN%22:%22"+orgzakINN+"%22%7D";

		var dicFields = [],
			l = fields.length;
		for (var i = 0; i < l; i++) {
			var current = fields[i];
			dicFields.push({
				DictColumnName: current,
				EditName: i
			});
		}

		var postData = {
			DictionaryFieldInfoList: dicFields
		};

		var encodedFields = encodeURI("=&dictFieldsInfo=" + JSON.stringify(postData));

		$.ajax({
			url: url,
			type: 'POST',
			data: encodedFields,
		}).then(function (responseData) {
			if (responseData.data) {
				var json = JSON.parse(responseData.data);
				var children = json.children;


				$.each(children, function (index, item) {
					var currentOkpd = item['ОКПД2'];
					if (currentOkpd && !TRUDict[currentOkpd]) {
						TRUDict[currentOkpd] = true;
						TRUDictArr.push(currentOkpd)
					}
				});
				defer.resolve(TRUDict);
			} else {
				var errorResponse = JSON.parse(responseText);
				defer.reject(errorResponse.error);
			}
		}, function (error) {
			defer.reject(error);
		});

		return defer.promise();
	}

var editreg = function() {
	$("li:has(:contains('Скрытые поля'))").hide();
	$("li:has(:contains('Требования к участникам'))").hide();
	$("li:has(:contains('Протокол разногласий'))").hide();
	$("li:has(:contains('Протокол отказа'))").hide();
	$("li:has(:contains('Контактная информация'))").hide();
	$("li:has(:contains('Протокол бюджетного комитета'))").hide();
	$("input[data-field-name='kont_FIO']").prop("required", false);	
	$("input[data-field-name='kontEmail']").prop("required", false);	
	$("input[data-field-name='kontTel']").prop("required", false);	
	$("input[data-field-name='kontfax']").prop("required", false);	
	$("input[data-field-name='kontpost']").prop("required", false);	
	$("textarea[data-field-name='kontadress']").prop("required", false);	
	var Currency_kod_dolg = $("#Currency_kod_dolg");
	var Currency_kod_smp = $("#Currency_kod_smp");
	Currency_kod_dolg.prop("disabled", true);
	Currency_kod_smp.prop("disabled", true);
	$("button[name='RukInic']").attr('disabled', true);
	$("button[name='OrgZakupki']").prop("disabled", true);
	initTruData();
};
//автоматическое заполнение текущего года
var fillYear = function() {
	var input = $("input[data-field-name='PlanGod']");
	var registerNomPlanEIS = $("input[data-field-name='registerNomPlanEIS']").val();
	var year = new Date();
	year = year.getFullYear();
	if(registerNomPlanEIS ==''){
		input.val(parseInt((year).toString(),10));
	}
	var val = $("input[name='PlanGod']").val();
	var godzak = $("input[name='godzak']");
	var planyearcurrent = $("input[name='planyearcurrent']") ;
    if(val != "" && registerNomPlanEIS==""){
		godzak.val(val);
		planyearcurrent.val(val);
		/* functionchageyear(); */
		checkYear();
		checkMonth();
	}
}

//скрытие\открытие полей окпд,окпд у мсп,оквэд,чекбокса МСП
var okpdhide = function() {
	var flag1=$("[name='CMP'][type='checkbox']");
	var flag2=$("[name='registerUchZakSMP'][type='checkbox']");
	var nameOrg = $("input[name='registerOrgZa']");
	if (flag2.is(":checked")) {
		$("input[data-field-name^='ItemTab-OKDPUMSP-']").prop("required", true);
		$("div[data-edit-name='OKDPUMSP']").parent().parent().show();
		$("div[title='ОКПД2 для МСП']").show();
		$("input[data-field-name^='ItemTab-registerOKDP-']").prop("required", false);	
		$("div[data-edit-name='registerOKDP']").parent().parent().hide();
		$("div[title='ОКПД2']").hide();
	} else {
		$("input[data-field-name^='ItemTab-registerOKDP-']").prop("required", true);	
		$("div[data-edit-name='registerOKDP']").parent().parent().show();
		$("div[title='ОКПД2']").show();
		$("input[data-field-name^='ItemTab-OKDPUMSP-']").prop("required", false);
		$("div[data-edit-name='OKDPUMSP']").parent().parent().hide();
		$("div[title='ОКПД2 для МСП']").hide(); 
	}
	$("input[data-field-name^='ItemTab-registerOKVED-']").prop("required", true);
	$("div[data-edit-name='registerOKVED']").parent().parent().show();	
	$("div[title='ОКВЭД2']").show();
	$("[name='registerUchZakSMP'][type='checkbox']").show();
	$("[data-related-field=registerUchZakSMP]").show();
	$("[name='registerInnProd'][type='checkbox']").show();
	$("[data-related-field=registerInnProd]").show();
	$("[name='registerInnProd'][type='checkbox']").prop("readonly", true);
	$("[name='registerZakNoUch'][type='checkbox']").show();
	$("[data-related-field=registerZakNoUch]").show();
	$("div[title='Установите чекбокс при наличии иновационной продукции']").show();
	$("div[title='Заполняется автоматически в зависимости от выбранного ОКПД2']").show();
	$("div[title='Автоматически проставляется при выборе способа определения поставщика. Доступен для редактирования при ед. поставщике, если не указан Победитель']").show();
	$("div[title='Установите чекбокс, если закупка не учитывается при расчёте совокупного годового стоимостного объёма договоров']").show();
	$("div[title='В соответствии с пунктом 13 части 4 статьи 1 Федерального закона О закупках товаров, работ, услуг отдельными видами юридических лиц от 18.07.2011 N 223-ФЗ. Закон не регулирует отношения, связанные с осуществление закупок у юридических лиц, являющихся взаимозависимыми с ООО Центр Хранения Данных.']").show();
	changeOKPDforMSP();
}
 
function proverkaOKPD2forMSP () {
	var smallPurch = $("input[data-field-name='smallPurch']");
	$(document).on('change', "input[name*='ItemTab-registerOKDPName-']", function (e) {
		var registerSpZakup = $("input[name='registerSpZakup']");
		var row = $(e.currentTarget).parents('.table-edit-row').attr('data-rowkey');
		var codeForFind = $("input[data-field-name='ItemTab-registerOKDP-" + row +"']").val();
		if ((TRUDict[codeForFind]) && $("input[data-field-name='registerUchZakSMP']").prop("checked", false) && registerSpZakup.val() && !smallPurch.is(":checked")){
			showCommonErrors('Выбранный ОКПД2 относится для закупок проводимых только у МСП');
			$("input[data-field-name='ItemTab-registerOKDP-" + row +"']").val('');
			$("input[name='ItemTab-registerOKDP-" + row +"']").val('');
			$("input[name='ItemTab-registerOKDPName-" + row +"']").val('');
			$("input[name='ItemTab-positionDirectoryName-" + row +"']").val('');
		}
	})
}

//Скрыть блок "Изменения"
//на редактирование
var hideblockchangeedit=function() {
	var regstatus = $("input[name='regstatus']");
	var Change = $("li:has(:contains('Изменения'))");
	function ScrBlock() {
		var Status_Edit = regstatus.val();
		var statuses = [
            "Внесение изменений",
            "Изменения подготовлены для включения в план",
			"Внесение изменений в проект плана закупок"
		];
		if (($.inArray(Status_Edit, statuses) != -1)) {
            Change.show();
			$("textarea[name='registerObIzm']").prop("required", true);
			$("textarea[name='registerObIzm']").closest(".column-container").addClass("label-required");
            $("[data-related-field=registerObIzm]").addClass("label-required");
			$("li:has(:contains('Проект договора'))").hide();
			$("button[name='registerOrgZa']").attr('disabled', true);
			$("button[name='OrgZakupki']").attr('disabled', true);
		} else if (Status_Edit == "Аннулирование утверждено"){
			Change.show();
			$("li:has(:contains('Основные сведения'))").hide();
			$("li:has(:contains('Предмет закупки'))").hide();
			$("li:has(:contains('Условия поставки'))").hide();
			$("li:has(:contains('Контрагент'))").hide();
			$("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))").hide();
			$("li:has(:contains('Проект договора'))").hide();
			$("li:has(:contains('Иное'))").hide();
			$("li:has(:contains('Документация'))").hide();
			$("textarea[name='registerObIzm']").closest(".column-container").hide();
			$("[data-related-field=registerObIzm]").hide();
			$("input[name='changeInyi']").closest(".column-container").hide();
			$("input[name='changeTRU']").closest(".column-container").hide();
			$("input[name='changeNMCD']").closest(".column-container").hide();
			$("[data-target='#regcard-tlcZamLot']").text('Изменения');
			$("li:has(:contains('Изменения'))").find("a").click();
			$("input[name^='ItemTab-priceTax']").prop("required", false);
				
		} else{
            Change.hide();
			$("textarea[name='registerObIzm']").prop("required", false);
			$("textarea[name='registerObIzm']").closest(".column-container").removeClass("label-required");
            $("[data-related-field=registerObIzm]").removeClass("label-required");
			$("li:has(:contains('Проект договора'))").hide();
		}
	}
	ScrBlock();
	regstatus.change(function() {
        ScrBlock();
	});
};

//на просмотр
var hideblockchangeview = function() {    
    var Status_view = $(".documentView-field-value[data-name='Статус']").text();
	var ChangeView = $("li:has(:contains('Изменения'))");	
    var  ChangeStatuses = [
		"Внесение изменений",
		"Внесение изменений в проект плана закупок",
		"Аннулирование",
		"Предложение об аннулировании",
		"Аннулирована",
		"На утверждении аннулирования",
		"На доработке аннулирования",
		"На утверждении изменений",
		"На доработке изменений",
		"Изменения утверждены",
	];
    if ( ($.inArray(Status_view, ChangeStatuses) != -1)) {
        ChangeView.show();
	} else {
        ChangeView.hide();
	}
	if (Status_view == "Аннулирование утверждено") {
		ChangeView.show();
		$("div[data-name='Обоснование внесения изменений']").closest(".column-container").hide();
		$("div[data-name='Изменение ТРУ и сроков']").closest(".column-container").hide();
		$("div[data-name='Изменение НМЦД более чем на 10%']").closest(".column-container").hide();
		$("div[data-name='Иные случаи изменения']").closest(".column-container").hide();
		$("li:has(:contains('Маршруты'))").hide();
	}
	if (Status_view == "Изменения подготовлены для включения в план") {
		ChangeView.show();
		$("div[data-name='Причина аннулирования']").closest(".column-container").hide();
	}
	if ($(".documentView-field-value[data-name='Причина аннулирования']").text() == " "){
		$("div[data-name='Причина аннулирования']").closest(".column-container").hide();
	}
};
	
// год закупки и год потребности на регистрации 
var yearsreg = function() {
    // Плановая дата заключения договора    
	$("input[name='registerDateRazm']").closest(".input-group.date").on("dp.change", 
	function() {
        var val = $(this).find("input[name='registerDateRazm']").val();
        var date = moment(val, "DD.MM.YYYY");
		var godzak = $("input[name='godzak']") ;
        /* $("input[name='datepodTZ']").val(date.clone().subtract(30, "days").format("DD.MM.YYYY"));
        $("input[name='dateotprTZ']").val(date.clone().subtract(10, "days").format("DD.MM.YYYY")); */
		var registerNomPlanEIS = $("input[data-field-name='registerNomPlanEIS']").val();
		if (registerNomPlanEIS==""){
			godzak.val(date.year()); 
		}
	});
};

var checkYear = function() {
	var val = $("input[name='PlanGod']").val();
	var val1 = $("input[name='month']").val();
	var registerPlDateOI = $("input[name='registerPlDateOI']").val();
	var registerNomPlanEIS = $("input[data-field-name='registerNomPlanEIS']").val();
	var currentYear = new Date().getFullYear();
	var today=new Date()
	var day=today.getDate();
		if (day < 10) {
			day = '0' + day;
		}
		var month=(today.getMonth()+1);
		if (month < 10) {
			month = '0' + month;
		}
	if (val==""){
		return;
	}
	if (val<currentYear && registerNomPlanEIS==''){
		showCommonErrors('Год планируемого периода не может быть раньше текущего года');
		$("input[name='PlanGod']").autoNumeric('wipe');
		$("input[name='PlanGod']").prop("readonly", false);
	}
	var sNow = day + "." + month + "." + today.getFullYear();
	if(registerPlDateOI =="")
		return;
    var date = moment(registerPlDateOI, "DD.MM.YYYY");
	if (val>date.year() && sNow != registerPlDateOI){
		showCommonErrors('Год планируемого периода не может быть позже срока исполнения договора');
		$("input[name='PlanGod']").autoNumeric('wipe');
		$("input[name='PlanGod']").prop("readonly", false);
	}
	
	
	if(val1!=""){
		checkMonth();
	}
};

var checkMonth = function() {
	var val = $("input[name='month']").val();
	var val1 = $("input[name='PlanGod']").val();
	var PlanMonthName = $("input[name='PlanMonthName']").val();
	var registerPlDateOI = $("input[name='registerPlDateOI']").val();
	var today=new Date()
	var day=today.getDate();
		if (day < 10) {
			day = '0' + day;
		}
		var month=(today.getMonth()+1);
		if (month < 10) {
			month = '0' + month;
		}
		
	var sNow = day + "." + month + "." + today.getFullYear();
	if(registerPlDateOI =="")
		return;
    var date = moment(registerPlDateOI, "DD.MM.YYYY");
	if (val>(date.month()+1) && val1==date.year() && sNow != registerPlDateOI){
		var ololo = function (e) {
			$("input[name='PlanMonthName']").val('');
			$("input[name='month']").val('');
			$("input[data-field-name='month']").val('');
		}
		showCommonErrors('Месяц планируемого периода не может быть позже срока исполнения договора', ololo);
	}	
};



$(document).on('change', "input[name='month']", function (e) {
    var val = $("input[name='month']").val();
    if(val != ""){
		checkMonth();
	}
});

$(document).on('change', "input[name='PlanGod']", function (e) {
    var val = $("input[name='PlanGod']").val();
	var registerNomPlanEIS = $("input[data-field-name='registerNomPlanEIS']").val();
    if(val != "" && registerNomPlanEIS==""){
		checkYear();
		//fillYear();
		var val = $("input[name='PlanGod']").val();
		var godzak = $("input[name='godzak']");
		godzak.val(val);
		var planyearcurrent = $("input[name='planyearcurrent']") ;
		planyearcurrent.val(val);
	}
	functionchageyear();
});
var registerPlDateOIChange = function() {
	$("input[name='registerPlDateOI']").parent().on('dp.change', function (e) {
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
		let periodOfExecution  = $("input[name='registerPlDateOI']").val() //спец создана переменная, чтоб использовать в условии ниже new Date 
		let yearOfExecution = periodOfExecution.slice(-4)//берем год
		let dayOfExecution = periodOfExecution.slice(0,2)//берем день
		let monthOfExecution = periodOfExecution.slice(3,5)//берем месяц
		periodOfExecution = yearOfExecution+"."+monthOfExecution+"."+dayOfExecution
		periodOfExecution = new Date(periodOfExecution)
		
		
		if ($("input[name='registerPlDateOI']").val() !="") {
			if (today1Spec > periodOfExecution) {
				showCommonErrors('Дата исполнения договора не может быть раньше текущей');
				$("input[name='registerPlDateOI']").parent().data("DateTimePicker").clear();
				return;
			}
		}

		var registerPlDateOI = $("input[name='registerPlDateOI']").val();
		if(registerPlDateOI ==""){
			return;
		}
		
		checkYear();
		checkMonth();
	});
};
//Флаг "Закупка не учитывается" 
//скрытие поля Категория закупки на регистрацию
var hidecategoryreg = function() {
	var flag = $("input[data-field-name='registerZakNoUch']");
	var KatZakKod=$("input[name='registerKZ']");
	var KatZakName=$("input[name='registerKZName']");
        if ($(flag).is(":checked")) {		
			KatZakKod.closest(".column-container").show();		
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", true);
			KatZakKod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=registerKZ]").show();
            $("[data-related-field=registerKZ]").addClass("label-required");
		} else {   		
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			KatZakKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			KatZakKod.closest(".column-container").hide();
			$("[data-related-field=registerKZ]").hide();
            $("[data-related-field=registerKZ]").removeClass("label-required");
		}
};	

$(document).on('change', "input[data-field-name='registerZakNoUch']", function (e) {
	var flag = $("input[name='registerZakNoUch']");
	var KatZakKod=$("input[name='registerKZ']");
	var KatZakName=$("input[name='registerKZName']");			 
        if ($(this).is(":checked")) {		
			KatZakKod.closest(".column-container").show();		
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", true);
			KatZakKod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=registerKZ]").show();
            $("[data-related-field=registerKZ]").addClass("label-required");
		} else {
			$("input[name='registerKZ']").closest(".clearfix").find(".dict-display-field").val('');
			KatZakKod.val('');
			KatZakName.val('');	
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			KatZakKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			KatZakKod.closest(".column-container").hide();
			$("[data-related-field=registerKZ]").hide();
            $("[data-related-field=registerKZ]").removeClass("label-required");
		}
});	

//на просмотр
var hidecategoryview = function() {
    var KatZak = $("div[data-name='Категория закупки, которая не учитывается при расчёте совокупного годового стоимостного объёма договоров']");
    var flag = $("div[data-name='Закупка не учитывается при расчёте совокупного годового стоимостного объёма договоров']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        showViewElementColumn(KatZak);
	} else {
        hideViewElementColumn(KatZak);;		
	}
};

//
var validatewinner = function() {
	var registerWinNerez = $("#editView input[name='registerWin2Nerez']");
    var registerWinIdentNum = $("#editView input[name='registerWin2IdentNum']");
	var registerWinIdentNumAd = $("#editView input[name='registerWin2IdentNumAd']");
	if (!registerWinNerez.is(":checked")) {
		registerWinIdentNumAd.prop("required", false);
		registerWinIdentNum.prop("required", false);
		registerWinIdentNum.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		registerWinIdentNumAd.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=registerWinIdentNum]").hide();
		$("[data-related-field=registerWinIdentNum]").removeClass("label-required");
		$("[data-related-field=registerWinIdentNumAd]").hide();
		$("[data-related-field=registerWinIdentNumAd]").removeClass("label-required");
	} else {
		registerWinIdentNumAd.prop("required", true);
		registerWinIdentNum.prop("required", true);
		registerWinIdentNumAd.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		registerWinIdentNum.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=registerWinIdentNum").show();
		$("[data-related-field=registerWinIdentNum]").addClass("label-required");
		$("[data-related-field=registerWinIdentNumAd").show();
		$("[data-related-field=registerWinIdentNumAd]").addClass("label-required");
	}
}

var validatelongTerm = function() {
	var longTermcategorie = $("#editView input[name='longTermcategorie']");
	var DataLongTerm = $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))"); 
	var rowsplanPayment  =  $("#editView [data-name=planPayment] [data-rowkey]");
	var rowsplanPaymentSMP  =  $("#editView [data-name=planPaymentSMP] [data-rowkey]");
	if (!longTermcategorie.is(":checked")) {
		DataLongTerm.hide();
		$("input[data-field-name='Currency_kod_dolg']").prop("required", false);
		$("input[data-field-name='Currency_kod_smp']").prop("required", false);
		$("[data-related-field=Currency_kod_dolg]").removeClass("label-required");
		$("[data-related-field=Currency_kod_smp]").removeClass("label-required");
		rowsplanPayment.each(function(index, element) {
			removeTableRow(element);
		});	
		rowsplanPaymentSMP.each(function(index, element) {
			removeTableRow(element);
		});	
	} else {
		DataLongTerm.show();
		$("input[data-field-name='Currency_kod_dolg']").prop("required", true);
		$("input[data-field-name='Currency_kod_smp']").prop("required", true);
		$("[data-related-field=Currency_kod_dolg]").addClass("label-required");
		$("[data-related-field=Currency_kod_smp]").addClass("label-required");
	};
}

//Флаг Долгосрочный
//блок Информация об объемах оплаты долгосрочного договора на регистрацию
var hidetablelongTermreg = function() {	
	var flag = $("input[data-field-name='longTermcategorie']");
	var DataLongTerm= $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))"); 
	
	flag.change(function() {
		var rowsplanPayment  =  $("[data-name=planPayment] [data-rowkey]");
		var rowsplanPaymentSMP  =  $("[data-name=planPaymentSMP] [data-rowkey]");
        if ($(this).is(":checked")) {
			DataLongTerm.show();
			$("input[data-field-name='Currency_kod_dolg']").prop("required", true);
			$("input[data-field-name='Currency_kod_smp']").prop("required", true);
			$("[data-related-field=Currency_kod_dolg]").addClass("label-required");
			$("[data-related-field=Currency_kod_smp]").addClass("label-required");
			readonlyplanPaymentSMP()
		} else {
			DataLongTerm.hide();	
			$("input[data-field-name='Currency_kod_dolg']").prop("required", false);
			$("input[data-field-name='Currency_kod_smp']").prop("required", false);
			$("[data-related-field=Currency_kod_dolg]").removeClass("label-required");
			$("[data-related-field=Currency_kod_smp]").removeClass("label-required");
			var rowsplanPayment  =  $("#editView [data-name=planPayment] [data-rowkey]");
			rowsplanPayment.each(function(index, element) {
				removeTableRow(element);
			});	
			var rowsplanPaymentSMP  =  $("#editView [data-name=planPaymentSMP] [data-rowkey]");
			rowsplanPaymentSMP.each(function(index, element) {
				removeTableRow(element);
			});	
		}
	});
	flag.change ();
}
//блок Информация об объемах оплаты долгосрочного договора на редактирование
var hidetablelongTermedit = function() {
	
	var flag = $("#editView input[name='longTermcategorie']");
	var DataLongTerm = $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))"); 
	var rowsplanPayment  =  $("#editView [data-name=planPayment] [data-rowkey]");
	var rowsplanPaymentSMP  =  $("#editView [data-name=planPaymentSMP] [data-rowkey]");
	
	flag.change(function() {
        if ($(this).is(":checked")) {
			DataLongTerm.show();
			$("input[data-field-name='Currency_kod_dolg']").prop("required", true);
			$("input[data-field-name='Currency_kod_smp']").prop("required", true);
			$("[data-related-field=Currency_kod_dolg]").addClass("label-required");
			$("[data-related-field=Currency_kod_smp]").addClass("label-required");
			readonlyplanPaymentSMP()
		} else {
			DataLongTerm.hide();
			$("input[data-field-name='Currency_kod_dolg']").prop("required", false);
			$("input[data-field-name='Currency_kod_smp']").prop("required", false);
			$("[data-related-field=Currency_kod_dolg]").removeClass("label-required");
			$("[data-related-field=Currency_kod_smp]").removeClass("label-required");
			rowsplanPayment.each(function(index, element) {
				removeTableRow(element);
			});	
			rowsplanPaymentSMP.each(function(index, element) {
				removeTableRow(element);
			});	
			}
	});	
}

//блок Информация об объемах оплаты долгосрочного договора на просмотр
var hidetablelongTermview = function() {
	var flag = $("div[data-name='Долгосрочный договор']").find("input[type='checkbox']");
	var DataLongTerm= $("li:has(:contains('Информация об  объемах оплаты долгосрочного договора'))");
	if (!$(flag).attr("checked")) {
        DataLongTerm.hide();
	} else {
        DataLongTerm.show();
	}
}

var izmememie = function() {
	
	var flag = $("input[data-field-name='registerZakNeSost']");
	if ($(flag).is(":checked")){
		$("input[data-field-name='cancelReason']").prop("required", true);
		$("[data-related-field=cancelReason]").addClass("label-required");
		$("input[data-field-name='cancelReason']").closest(".column-container").show();
		$("[data-related-field=cancelReason]").show();
	} else{
		$("input[data-field-name='cancelReason']").prop("required", false);
		$("[data-related-field=cancelReason]").removeClass("label-required");
		$("input[data-field-name='cancelReason']").closest(".column-container").hide();
		$("[data-related-field=cancelReason]").hide();
		$("input[data-field-name='cancelReason']").closest(".clearfix").find(".dict-display-field").val("");
		$("input[name='cancelReasonName']").val('');
		$("input[name='cancelReasonName']").attr('value','');
		$("input[name='cancelReason']").val('');
		$("input[name='cancelReason']").attr('value','');
	}

}

$(document).on('change', "input[data-field-name='registerZakNeSost']", function () {
	izmememie();
	});
	
// проверка на наличие Долгосрочного договора при регистрации
// отображается/скрывается вкладка "Информация об объемах оплаты долгосрочного договора"
// автоматически добавляются строки в таблицу на каждый год от года Планируемой даты размещения до года Окончания исполнения
// проверка на Общую сумму в таблице, сравнивается с НМЦ с НДС
var checklongtermcontract = function () {
    var DataLongTerm= $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))");
    var registerDateRazm = $("input[name='registerDateRazm']");	
	var registerPlDateOI = $("input[name='registerPlDateOI']");	
	var initialmaximumprice = $("input[name='registerNMCS']");
	var longTermcategorie = $("input[name='longTermcategorie']");
	var columnsummaPayment = $("input[data-field-name*='planPayment-summaPayment']");
	var columnsummaPaymentSMP = $("input[data-field-name*='planPaymentSMP-summaPaymentSMP']");
	$("input[data-field-name='Currency_kod_dolg']").prop("required", false);
	$("input[data-field-name='Currency_kod_smp']").prop("required", false);
	$("[data-related-field=Currency_kod_dolg]").removeClass("label-required");
	$("[data-related-field=Currency_kod_smp]").removeClass("label-required");
	initialmaximumprice.change( function() {
	  SummaOsnTest.Calculate(columnsummaPayment);
      SummaOsnTestSMP.Calculate(columnsummaPaymentSMP); 	  
	});	   
	registerDateRazm.closest(".input-group.date").on("dp.change", 
	function() {
		var registerDateRazm = $("input[name='registerDateRazm']");	
		functionchagedate(DataLongTerm, registerDateRazm,registerPlDateOI, longTermcategorie);	
		if (initialmaximumprice.val()) {
			SummaOsnTest.Calculate(columnsummaPayment);
			SummaOsnTestSMP.Calculate(columnsummaPaymentSMP);	
		};
	 //validatesumcontractpay(columnsummaPayment, columnsummaPaymentSMP);   
	});
	registerPlDateOI.closest(".input-group.date").on("dp.change", 
	function() {
		var registerPlDateOI = $("input[name='registerPlDateOI']");	
		if(registerDateRazm.val()){
			functionchagedate(DataLongTerm, registerDateRazm,registerPlDateOI, longTermcategorie);
		} else {
			functionchageyear();
		}
		if (initialmaximumprice.val()) { 
			SummaOsnTest.Calculate(columnsummaPayment);
			SummaOsnTestSMP.Calculate(columnsummaPaymentSMP);	
		};
		 //validatesumcontractpay(columnsummaPayment, columnsummaPaymentSMP);
	});
	//validatesumcontractpay(columnsummaPayment, columnsummaPaymentSMP);
}

//
var validatesumcontractpay = function(columnsummaPayment,columnsummaPaymentSMP) {
 var kol = $("div[data-name='planPayment'] div[data-rowkey]").length;
	if (kol>0) {
      $(document).on('change', "input[data-field-name*='planPaymentSMP-summaPayment']", function (e) {
      SummaOsnTest.Calculate(this);
	  SumDolgRub.CalculateSumma(this);
	  Alloplatainrub();
      });
      $(document).on('change', "input[data-field-name*='planPayment-summaPaymentSMP']", function (e) {
       SummaOsnTestSMP.Calculate(this);
	   SumSMPRub.CalculateSumma(this);
	   AlloplataSMPinrub();
      });
    };	
}

$(document).on('change', "input[data-field-name*='planPaymentSMP-summaPaymentSMP']", function (e) {
    SummaOsnTestSMP.Calculate(this);
	SumSMPRub.CalculateSumma(this);
	AlloplataSMPinrub();
});

$(document).on('change', "input[data-field-name*='planPayment-summaPayment']", function (e) {
    SummaOsnTest.Calculate(this);
	SumDolgRub.CalculateSumma(this);
	Alloplatainrub();
	summary();
}); 

// подсчет суммы по столбцу Сумма платежа для таблицы Планируемые платежи блока по долгосрочному договору
var SummaOsnTest = {
	Calculate: function () {
		var ps1 = $("input[data-field-name*='planPayment-summaPayment']").closest("div.table-content");
		var ps2 = $("input[data-field-name*='planPaymentSMP-summaPaymentSMP']").closest("div.table-content");
		var summ = 0;
		ps1.children("div.table-edit-row").each(function() {
			var elemen = $(this).find("input[data-field-name*='planPayment-summaPayment']")
			if($(elemen).length){
				var s1 = elemen.val();
				var Price = s1.replace(/ /g, '').replace(/,/g, '.')*1; 
				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		if( (summ) || (summ==0) ){
			$("input[name='Alloplata']").autoNumeric('set', summ);
		}
		if (($("input[name='registerNMCS']").val()) && summ != 0){
			var beginmaxprice = $("input[name='registerNMCS']").autoNumeric('get');
		};
	}
}
 
 // подсчет суммы по столбцу Сумма платежа для таблицы Планируемые платежи МСП блока по долгосрочному договору
var SummaOsnTestSMP = {
	Calculate: function () {
		var ps1 = $("input[data-field-name*='planPaymentSMP-summaPaymentSMP']").closest("div.table-content");
		var summ = 0;
		ps1.children("div.table-edit-row").each(function() {
			var elemen = $(this).find("input[data-field-name*='planPaymentSMP-summaPaymentSMP']")
			if($(elemen).length){
				var s1 = elemen.val();
				var Price = s1.replace(/ /g, '').replace(/,/g, '.')*1; 
				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		if( (summ) || (summ==0) ){
			$("input[name='AlloplataSMP']").autoNumeric('set', summ);
			var valuta = $("input[name='Currency_kod_dolg']").val();
			var curs_smp = $("input[name='curs_smp']").val();
			var flag = $("input[name='longTermcategorie']");
			var AlloplataSMPinrub = $("input[name='AlloplataSMPinrub']");
			if(valuta == 'RUB' && !flag.is(":checked")){
				AlloplataSMPinrub.autoNumeric('set', '0.00')
			}
			else{	
				AlloplataSMPinrub.autoNumeric('set', curs_smp*summ)
			}
			
		}
		if ($("input[name='registerNMCS']").val() && summ != 0){
			var beginmaxprice = $("input[name='registerNMCS']").autoNumeric('get');
		};
	}
}

// Добавление/удаление строк в таблицах Планируемые платежи, Планируемые платежи МСП по долгосрочному договору
var functionchagedate = function(DataLongTerm, registerDateRazm, registerPlDateOI, longTermcategorie) {
	var PlanGod = $("input[name='PlanGod']");
    if ((registerDateRazm.val()) && (registerPlDateOI.val()) ) {
	    var year1 = getyear(registerDateRazm.val());
        var year2 = getyear(registerPlDateOI.val());	      
	if (year1 < year2) { 
	    longTermcategorie.prop('checked', true);
		summary();
        DataLongTerm.show(); 
		$("input[data-field-name='Currency_kod_dolg']").prop("required", true);
		$("input[data-field-name='Currency_kod_smp']").prop("required", true);
		$("[data-related-field=Currency_kod_dolg]").addClass("label-required");
		$("[data-related-field=Currency_kod_smp]").addClass("label-required");
		var end = year2-year1+1;
		if(end != $("[data-name=planPayment] [data-rowkey]").length){		
			deleterowtable($("[data-name=planPayment] [data-rowkey]"));		
			deleterowtable($("[data-name=planPaymentSMP] [data-rowkey]"));
			$("div[data-name='planPayment'] div.table-add-row-button").hide();	
			$("div[data-name='planPaymentSMP'] div.table-add-row-button").hide();	
			$("div[data-name='planPayment'] div.table-row-actions").hide();
			$("div[data-name='planPaymentSMP'] div.table-row-actions").hide();		 
			for (var i=1;i<=end;i++) {
			   var plus = year1 + i - 1;
			   $("div[data-name='planPaymentSMP']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
			   $("div[data-name='planPayment']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
			   $("input[name='planPaymentSMP-yearPaymentSMP"+"-"+i+"']").val(plus);
				$("input[name='planPayment-yearPayment"+"-"+i+"']").val(plus);
			  };
			}
			readonlyplanPaymentSMP()
		} else {
			longTermcategorie.prop('checked', false);
			summary();
			$("input[name='AlloplataSMP']").autoNumeric('set', '0');
			$("input[name='Alloplata']").autoNumeric('set', '0');
			
			hidetablecontract(DataLongTerm,$("div[data-name=planPayment] [data-rowkey]"),$("div[data-name=planPaymentSMP] [data-rowkey]"));
        };			  
	} else if (PlanGod.val()) {
	    return;
	} else {
	    hidetablecontract(DataLongTerm,$("div[data-name=planPayment] [data-rowkey]"),$("div[data-name=planPaymentSMP] [data-rowkey]"));
	};
}

var functionchageyear = function() {
		var DataLongTerm= $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))");
		var PlanGod = $("input[name='PlanGod']");	
		var registerPlDateOI = $("input[name='registerPlDateOI']");	
		var longTermcategorie = $("input[name='longTermcategorie']");
		var registerDateRazm = $("input[name='registerDateRazm']");
		if ((PlanGod.val()) && (registerPlDateOI.val()) && PlanGod.val()>2000 ) {
			var year1 = PlanGod.val();
			var year2 = getyear(registerPlDateOI.val());	
		if (year1 < year2) { 
			longTermcategorie.prop('checked', true);
			summary();
			DataLongTerm.show(); 
			$("input[data-field-name='Currency_kod_dolg']").prop("required", true);
			$("input[data-field-name='Currency_kod_smp']").prop("required", true);
			$("[data-related-field=Currency_kod_dolg]").addClass("label-required");
			$("[data-related-field=Currency_kod_smp]").addClass("label-required");
			var end = year2-year1+1; 
			$("div[data-name='planPayment'] div.table-add-row-button").hide();	
			$("div[data-name='planPayment'] div.table-remove-row-button").hide();
			$("div[data-name='planPaymentSMP'] div.table-add-row-button").hide();	
			$("div[data-name='planPaymentSMP'] div.table-remove-row-button").hide();
			$("div[data-name='planPayment'] div.table-row-actions").hide();
			$("div[data-name='planPayment'] div.table-row-actions-left").hide();
			$("div[data-name='planPaymentSMP'] div.table-row-actions").hide();	
			$("div[data-name='planPaymentSMP'] div.table-row-actions-left").hide();	
			if(end != $("[data-name=planPayment] [data-rowkey]").length){
				deleterowtable($("[data-name=planPayment] [data-rowkey]"));		
				deleterowtable($("[data-name=planPaymentSMP] [data-rowkey]")); 
				for (var i=1;i<=end;i++) {
					var plus = parseInt(year1) + i - 1;
					$("div[data-name='planPaymentSMP']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
					$("div[data-name='planPayment']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
					$("input[name='planPaymentSMP-yearPaymentSMP"+"-"+i+"']").val(plus);
					$("input[name='planPayment-yearPayment"+"-"+i+"']").val(plus);
				};
			}
			readonlyplanPaymentSMP()
		} else {
			longTermcategorie.prop('checked', false);
			summary();
			$("input[name='AlloplataSMP']").autoNumeric('set', '0');
			$("input[name='Alloplata']").autoNumeric('set', '0');
			hidetablecontract(DataLongTerm,$("div[data-name=planPayment] [data-rowkey]"),$("div[data-name=planPaymentSMP] [data-rowkey]"));
        };			  
	} else if (registerDateRazm.val()) {
	    return;
	} else {
	    hidetablecontract(DataLongTerm,$("div[data-name=planPayment] [data-rowkey]"),$("div[data-name=planPaymentSMP] [data-rowkey]"));
	};
}

// функция скрытия блока, удаления строк из таблицы Планируемые платежи, Планируемые платежи МСП
var hidetablecontract = function (block, planpay, planpaySMP) {
    planpay.each(function(index, element) {
	removeTableRow(element);});	
	planpaySMP.each(function(index, element) {
	removeTableRow(element);});
	block.hide();	
}  

// функция преобразования даты, выделение года
var getyear = function(date) {
    var dateformat = moment(date, "DD.MM.YYYY");
	var year = dateformat.year();	
    return year		
}

// функция предварительного удаления строк из таблиц 
var deleterowtable = function(table) {
	table.each(function(index, element) {
		removeTableRow(element);
	}); 
}

var checklongtermcontractedit = function () {
    var DataLongTerm= $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))");
    var registerDateRazm = $("#editView input[name='registerDateRazm']");	
	var registerPlDateOI = $("#editView input[name='registerPlDateOI']");	
	var initialmaximumprice = $("#editView input[name='registerNMCS']");
	var longTermcategorie = $("#editView input[name='longTermcategorie']");
	var columnsummaPayment = $("input[data-field-name*='planPayment-summaPayment']");
	var columnsummaPaymentSMP = $("input[data-field-name*='planPaymentSMP-summaPaymentSMP']");	  
	initialmaximumprice.change( function() {
		SummaOsnTest.Calculate(columnsummaPayment);
		SummaOsnTestSMP.Calculate(columnsummaPaymentSMP);	     
	});	   
	registerDateRazm.closest(".input-group.date").on("dp.change", 
	function() {
		var registerDateRazm = $("#editView input[name='registerDateRazm']");
		functionchagedate(DataLongTerm, registerDateRazm,registerPlDateOI, longTermcategorie);	
		if (initialmaximumprice.val()) {
			SummaOsnTest.Calculate(columnsummaPayment);
			SummaOsnTestSMP.Calculate(columnsummaPaymentSMP);	
		};
		//validatesumcontractpay(columnsummaPayment, columnsummaPaymentSMP);   
	});
	registerPlDateOI.closest(".input-group.date").on("dp.change", 
	function() {
		var registerPlDateOI = $("#editView input[name='registerPlDateOI']");
		functionchagedate(DataLongTerm, registerDateRazm,registerPlDateOI, longTermcategorie);	
		functionchageyear();
		if (initialmaximumprice.val()) { 
			SummaOsnTest.Calculate(columnsummaPayment);
			SummaOsnTestSMP.Calculate(columnsummaPaymentSMP);	
			
			$("input[data-field-name='Alloplata']").autoNumeric('set','0');
			$("input[data-field-name='AlloplataSMP']").autoNumeric('set','0');
			AlloplataSMPinrub();
			Alloplatainrub();
			$("input[data-field-name='Alloplatainrub']").autoNumeric('set','0');
			$("input[data-field-name='AlloplataSMPinrub']").autoNumeric('set','0');
		};
	});
}

$(document).on('change', "input[name='godpotr']", function (e) {
	checklongtermcontract();
});
		
$(document).ready(function () {
	var count = $("div[data-name='ItemTab'] div[data-rowkey]").length;

	if (count < 1) {
		$("div[data-name='ItemTab']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
		$("input[name='ItemTab-registerCount-1']").prop('required', true);
		$("input[name='ItemTab-Ed_izm-1']").prop('required', true);
		$("input[name='ItemTab-Ed_izmName-1']").prop('required', true);
		$("input[data-field-name='ItemTab-Ed_izm-1']").prop('required', true);
	} 
});

var oneRowTableReq = function() {
	var hideDeleteButton = function() {
		var count = $("div[data-name='ItemTab'] div[data-rowkey]").length;
		if (count == 1) {
			$("div[data-name='ItemTab']").children().children("div[data-rowkey]").find(".table-remove-row-button").hide();
		} else {
			$("div[data-name='ItemTab']").children().children("div[data-rowkey]").find(".table-remove-row-button").show();
		}
	}
	
	hideDeleteButton();
	
	$("div[data-name='ItemTab']").on("onTableRowAdded", function () {
		hideDeleteButton();
		changeOKPDforMSP();
		okpdhide();
	})
	$("div[data-name='ItemTab']").on('onTableRowRemoved', function () {						
		hideDeleteButton();
	});
	
};

$("div[data-name='ItemTab']").on('change', "input[data-field-name^='ItemTab-NevCol-']", function () {
	var current = $(this);
	var row = current.closest(".table-edit-row");
	var id = row.attr("data-rowkey");
	var val = row.find("input[data-field-name*='ItemTab-priceTax-']").val();
	var checkBoxNMCS = $("input[data-field-name='checkBoxNMCS']");
	if (id != undefined) {
		if (current.is(":checked")) {
			$("input[name='ItemTab-registerCount-" + id + "']").autoNumeric('set', '1.00000');
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").val("Условная единица");
			$("input[name='ItemTab-Ed_izmName-" + id + "']").val("Условная единица");
			$("input[name='ItemTab-Ed_izm-" + id + "']").val("876");
			$("input[data-parent-name='ItemTab-Ed_izm-" + id + "parent']").val("52075");
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").parent().children(".input-group-btn").children().prop('disabled', true);
			$("input[name='ItemTab-registerCount-" + id + "']").prop('readonly', true);
			$("input[data-field-name='ItemTab-summaTax-" + id + "']").val('');
			$("input[data-field-name='ItemTab-summaTax-" + id + "']").val(val);
			if (checkBoxNMCS.prop('checked') == true) {
				ItemTab_logoc();
			} else {
				nmckCalculation();
			}
		} else {
			$("input[name='ItemTab-registerCount-" + id + "']").autoNumeric('set', '0.00000');
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").val("");
			$("input[name='ItemTab-Ed_izm-" + id + "']").val("");
			$("input[name='ItemTab-Ed_izmName-" + id + "']").val("");
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").parent().children(".input-group-btn").children().prop('disabled', false);
			$("input[data-parent-name='ItemTab-Ed_izm-" + id + "parent']").val("");
			$("input[name='ItemTab-registerCount-" + id + "']").prop('readonly', false)
			$("input[data-field-name='ItemTab-summaTax-" + id + "']").val('');
			if (checkBoxNMCS.prop('checked') == true) {
				ItemTab_logoc();
			} else {
				nmckCalculation();
			}
		}
	}
});

var SumNMC = {
	CalculateSumma:function (obj) {
	var table = $("input[data-field-name*='ItemTab-itemName']").closest("div.table-content");
	var nmc = 0;
		table.find("div.table-edit-row").each(function() {
			var elem1 = $(this).find("input[data-field-name*='ItemTab-PozSum']")
                if($(elem1).length){
					var s1 = elem1.val();
					var val1 =  parseFloat(s1? s1 : 0);
					nmc = nmc + val1; ;
				}
		}); 
		$("input[name='registerNMCS']").val(nmc);
		$("input[name='registerNMCS']").change();
		
		if (($("input[name='registerNMCS']").val()== 0) || ($("input[name='registerNMCS']").val()== 0.00)) {
			$("input[name='registerNMCS']").val("");
		}
	}
}
	
$(document).on('change', "input[data-field-name='registerNMCS']", function (e) {
	var valuta = $("input[name='Currency_kod']").val();
	var NMCS = $("input[name='registerNMCS']").autoNumeric('get');
	var NMCD = $("input[name='NMCD']");
	AlloplataSMPinrub();
	Alloplatainrub();
	if (valuta == 'RUB'){
		NMCD.autoNumeric('set', NMCS);
	}
	PriceRub.CalculateSumma(this);
	smallPurchEdit();
});
	
var PriceRub = {
	CalculateSumma:function (obj) {
		var table = $("input[data-field-name*='ItemTab-itemName']").closest("div.table-content");
		var curs = $("input[name='curs']");
		var registerNMCS = $("input[name='registerNMCS']");
		var NMCD = $("input[name='NMCD']");
		var flag=$("input[name='Currency_kod']").val();
		if (flag!=="RUB") {
			var s2 = curs.autoNumeric('get');
			var s4 = registerNMCS.autoNumeric('get');
			var val2 =  parseFloat(s2? s2 : 0);
			var val4 =  parseFloat(s4? s4 : 0);
			NMCD.autoNumeric('set', val4*val2);
			smallPurchEdit();
			if (($("input[name='NMCD']").val()== 0) || ($("input[name='NMCD']").val()== 0.00)) {
				$("input[name='NMCD']").autoNumeric('wipe');
			}
		} 
	}
}
	

var Adress = function () {
	var flag=$("input[data-field-name='AdressPostavki']");
	var OKATOPosition = $("div[data-name='ItemTab'] [data-field-name^='ItemTab-OKATOPosition']");
	var RegionPosition = $("div[data-name='ItemTab'] [data-field-name^='ItemTab-RegionPosition']");
	if ($(flag).is(":checked")) {
		$("input[data-field-name='registerOKATO']").closest(".column-container").show(); 
		$("div[data-related-field='registerOKATO']").closest(".column-container").show(); 
		$("input[data-field-name='registerOKATO']").prop('required', true);
		$("div[data-related-field='registerOKATO']").addClass("label-required");
		$(OKATOPosition).closest(".table-edit-column").hide();
		$(RegionPosition).closest(".table-edit-column").hide();
		$("div[title='ОКТМО']").hide();
		$("div[title='Регион']").hide();
		$("input[data-field-name*='ItemTab-RegionPosition']").val('')
		$("input[data-field-name*='ItemTab-OKATOPosition']").val('')
		$("input[data-field-name*='ItemTab-OKATOPosition']").prop('required', false);
		$("input[name*='ItemTab-OKATOPosition']").val('')
		$("input[data-parent-name*='ItemTab-OKATOPosition-1parent']").val('')
	} else {
		$("input[data-field-name='registerOKATO']").closest(".column-container").hide(); 
		$("div[data-related-field='registerOKATO']").closest(".column-container").hide(); 
		$("input[data-field-name='registerOKATO']").prop('required', false);
		$("div[data-related-field='registerOKATO']").removeClass("label-required");
		$(OKATOPosition).closest(".table-edit-column").show();
		$(RegionPosition).closest(".table-edit-column").show();
		$("div[title='ОКТМО']").show();
		$("div[title='Регион']").show();
		$("input[data-field-name*='ItemTab-OKATOPosition']").prop('required', true);
		$("input[data-field-name*='registerOKATO']").val('')
		$("input[name*='registerOKATO']").val('')
		$("input[data-parent-name*='registerOKATOparent']").val('')
	}
}

var WinnerHideOption = function  () {
	$(document).on('change', "input[data-field-name='registerSpZakup']", function (e) {
		WinnerHide();
		osnEP();
		changeOKPDforMSP();
		smallPurchEdit();
		okpdhide();
		if(TRUDictArr.length != 0){
			TableRowsValidaion(); // Проверка принадлежности позиций к признаку МСП
		}
	});
};

$(document).on('change', "input[data-field-name='AdressPostavki']", function (e) {
	Adress();
});

var WinnerHide = function () {
	var regstatus =$("input[name='regstatus']").val();
	var spzak=$("input[name='registerSpZakup']").val();
	if (spzak == "533003"){
		$("li:has(:contains('Контрагент'))").show();
		$("textarea[data-field-name='orgpost2']").prop("required", true);
		$("[data-related-field=orgpost2]").addClass("label-required");	
	}
	else if (spzak != "533003"){
		$("li:has(:contains('Контрагент'))").hide();
		$("textarea[data-field-name='orgpost2']").prop("required", false);
		$("[data-related-field=orgpost2]").removeClass("label-required");	

	var fortextarea = ['orgpostdog_kod', 'FirmName', 'orgpostdogOKOPFName', 'dopinfo', 'orgpost2', 'osnEPName'];	
	var forinput = ['orgpost2Name', 'orgpostdogINN', 'orgpostdogKPP', 'orgpostdogOGRN', 'orgpostdogOKOPO', 'orgpostdogIdentNum', 'orgpostdogIdentNumAd', 'orgpostdogOKTMO', 'orgpostdog_kod', 'orgpostdog_kodName', 'orgpostdogOKOPF', 'datepostnauch',  'registerCountSNDS', 'registerCountNoNDS', 'dateContractFact',  'orgpostdogEmail', 'orgpostdogPhone', 'orgpostdogCountry', 'orgpostdogCountryCode', 'orgpostdogRegion', 'orgpostdogSity', 'orgpostdoglocality', 'orgpostdogDistrict', 'orgpostdogPostCode', 'orgpostdogStreet', 'orgpostdogHouse', 'orgpostdogCorpus', 'orgpostdogApartment', 'orgpost2', 'status'];
	forinput.forEach(function (item, i, forinput) {
		$("input[name='" + item + "']").val('');
		$("input[name='" + item + "']").attr('value', '');
	});

	var forinputNer = ['CMP', 'nerezdog'];
	forinputNer.forEach(function (item, i, forinput) {		
		$("input[name='" + item + "']").prop('checked', false);			
	});
	fortextarea.forEach(function(item, i, forinput) {
		$("textarea[data-field-name='"+item+"']").text('');
		$("textarea[data-field-name='"+item+"']").val('');
	});
	$("input[data-field-name='orgpostdogRegRus']").prop('checked', false);
	} else{
		$("li:has(:contains('Контрагент'))").hide();
	}
}

function changeOKPDforMSP() { // Чекбокс "Участник закупки МСП" в зависимости от "Способа закупки" и контрагента
	//ПРИ ИЗМЕНЕНИИ ДАННОЙ ФУНКЦИИ НЕ ЗАБЫТЬ ПРО ФУНКЦИЮ callCorrectplanPaymentSMP 
	var spzak=$("input[name='registerSpZakup']").val();
	var flag1=$("[name='CMP'][type='checkbox']");
	var flag2=$("[name='registerUchZakSMP'][type='checkbox']");
	var flag3=$("[name='plannedAfterSecondYear'][type='checkbox']");
	flag2.readonly(true); // Признак МСП не реадктируется
	if (spzak == "200608" || spzak == "200609" || spzak == "200610" || spzak == "200611") {
		flag2.attr("checked", true);
		flag2.prop("checked", true);
		correctplanPaymentSMP();
		SummaOsnTestSMP.Calculate(); //пересчет объема мсп в таблице долгосрочных мсп
	} else if (spzak == "533003") {
		flag2.readonly(false); // Признак МСП редактируется, если это ед поставщик
		SupplierMSPLogic(); // логика работы, если признак мсп=1 у поставщика 
	} else {
		if(!flag3.is(":checked")){
			flag2.attr("checked", false);
			flag2.prop("checked", false);
		}
		readonlyplanPaymentSMP() //обнуление долгосрочных платежей мсп и их readonly
		SummaOsnTestSMP.Calculate() //пересчет объема мсп в таблице долгосрочных мсп
	}
		
}	

$(document).on('change', "[name='CMP'][type='checkbox']", function (e) {
	var spzak=$("input[name='registerSpZakup']").val();
	var nameOrg = $("input[name='registerOrgZa']");
		if (spzak == "533003") {
			SupplierMSPLogic(); // логика работы, если признак мсп=1 у поставщика 
			TableRowsValidaion(); // Проверка принадлежности позиций к признаку МСП
	}
})

// логика работы, если признак мсп=1 у поставщика 
function SupplierMSPLogic() {
	var flag1=$("[name='CMP'][type='checkbox']");
	var flag2=$("[name='registerUchZakSMP'][type='checkbox']");
	var orgpost2=$("textarea[data-field-name='orgpost2']");
	var nameOrg = $("input[name='registerOrgZa']");
	var spzak=$("input[name='registerSpZakup']").val();
	if (orgpost2.val()) {
		if(spzak == "533003"){
			flag2.readonly(false);
		}
		else{
			flag2.readonly(true); // Признак МСП не реадктируется
		}
	}
}

$(document).on('change', "input[data-field-name*='ItemTab-OKDPUMSP-']", function (e) {
	var row = $(e.currentTarget).closest(".table-edit-columns");
	var val = row.find("input[data-field-name*='ItemTab-OKDPUMSP-']").val();
	row.find("input[data-field-name*='ItemTab-registerOKDP-']").val(val);
	row.find("input[name*='ItemTab-registerOKDP-']").val(val);
})

$(document).on('change', "input[name*='ItemTab-OKDPUMSPname-']", function (e) {
	var row = $(e.currentTarget).closest(".table-edit-columns");
	var name = row.find("input[name*='ItemTab-OKDPUMSPname-']").val();
	row.find("input[name*='ItemTab-registerOKDPName-']").val(name);
})

var valuta = function() {    
	var flag=$("input[name='Currency_kod']").val();
	if (flag!=="RUB") {
		$("input[data-field-name='NMCD']").closest(".column-container").show();
		$("div[data-related-field='NMCD']").closest(".column-container").show();
		$("input[data-field-name='curs']").closest(".column-container").show();
		$("div[data-related-field='curs']").closest(".column-container").show();
		$("input[data-field-name='dateCurs']").closest(".column-container").show();
		$("div[data-related-field='dateCurs']").closest(".column-container").show();
		$("input[data-field-name='NMCD']").prop('required', true);
		$("div[data-related-field='NMCD']").addClass("label-required");
		$("input[data-field-name='curs']").prop('required', true);
		$("div[data-related-field='curs']").addClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', true);
		$("div[data-related-field='dateCurs']").addClass("label-required");
	} else {
		$("input[data-field-name='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='emptyLabel']").closest(".column-container").hide();
		$("input[data-field-name='curs']").closest(".column-container").hide();
		$("div[data-related-field='curs']").closest(".column-container").hide();
		$("input[data-field-name='dateCurs']").closest(".column-container").hide();
		$("div[data-related-field='dateCurs']").closest(".column-container").hide();
		$("input[data-field-name='NMCD']").prop('required', false);
		$("div[data-related-field='NMCD']").removeClass("label-required");
		$("input[data-field-name='curs']").prop('required', false);
		$("div[data-related-field='curs']").removeClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', false);
		$("div[data-related-field='dateCurs']").removeClass("label-required");
	}
}
	
$(document).on('change', "input[name='Currency_dig_kod']", function (e) {
	var flag=$("input[name='Currency_kod']").val();
	if (flag!=="RUB") {
		$("input[data-field-name='NMCD']").closest(".column-container").show();
		$("div[data-related-field='NMCD']").closest(".column-container").show();
		$("input[data-field-name='curs']").closest(".column-container").show();
		$("div[data-related-field='curs']").closest(".column-container").show();
		$("input[data-field-name='dateCurs']").closest(".column-container").show();
		$("div[data-related-field='dateCurs']").closest(".column-container").show();
		$("input[data-field-name='NMCD']").prop('required', true);
		$("div[data-related-field='NMCD']").addClass("label-required");
		$("input[data-field-name='curs']").prop('required', true);
		$("div[data-related-field='curs']").addClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', true);
		$("div[data-related-field='dateCurs']").addClass("label-required");
		$("input[data-field-name='curs_dolg']").show();
		$("div[data-related-field='curs_dolg']").show();
		$("input[data-field-name='date_dolg']").parent().show();
		$("div[data-related-field='date_dolg']").show();
		$("input[data-field-name='Alloplatainrub']").show();
		$("div[data-related-field='Alloplatainrub']").show();
		$("input[data-field-name='AlloplataSMPinrub']").show();
		$("div[data-related-field='AlloplataSMPinrub']").show();
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").show();
		$("div[title='Сумма платежа в рублевом эквиваленте']").show();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', true);
		$("input[data-field-name='curs_smp']").show();
		$("div[data-related-field='curs_smp']").show();
		$("input[data-field-name='date_smp']").parent().show();
		$("div[data-related-field='date_smp']").show();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").closest(".table-edit-column").show();
		$("div[title='Сумма платежа в рублевом эквиваленте МСП']").show();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").prop('required', true);
	 } else {
		$("input[data-field-name='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='emptyLabel']").closest(".column-container").hide();
		$("input[data-field-name='curs']").closest(".column-container").hide();
		$("div[data-related-field='curs']").closest(".column-container").hide();
		$("input[data-field-name='dateCurs']").closest(".column-container").hide();
		$("div[data-related-field='dateCurs']").closest(".column-container").hide();
		$("input[data-field-name='NMCD']").prop('required', false);
		$("div[data-related-field='NMCD']").removeClass("label-required");
		$("input[data-field-name='curs']").prop('required', false);
		$("div[data-related-field='curs']").removeClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', false);
		$("div[data-related-field='dateCurs']").removeClass("label-required");
		$("input[name='dateCurs']").val("");
		$("input[name='curs']").val('');
		$("input[name='NMCD']").autoNumeric('set', $("input[name='registerNMCS']").autoNumeric('get'));
		$("input[data-field-name='curs_dolg']").hide();
		$("div[data-related-field='curs_dolg']").hide();
		$("input[data-field-name='date_dolg']").parent().hide();
		$("div[data-related-field='date_dolg']").hide();
		$("input[data-field-name='curs_dolg']").prop('required', false);
		$("div[data-related-field='curs_dolg']").removeClass("label-required");
		$("input[data-field-name='date_dolg']").prop('required', false);
		$("div[data-related-field='date_dolg']").removeClass("label-required");
		$("input[data-field-name='Alloplatainrub']").hide();
		$("div[data-related-field='Alloplatainrub']").hide();
		$("input[data-field-name='AlloplataSMPinrub']").hide();
		$("div[data-related-field='AlloplataSMPinrub']").hide();
		$("div[title='Сумма платежа в рублевом эквиваленте']").hide();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', false);
		$("input[name='date_dolg']").val("");
		$("input[name='curs_dolg']").val("");
		$("input[name='Alloplatainrub']").val("");
		$("input[name='AlloplataSMPinrub']").val("");
		$("input[data-field-name*='planPayment-summaPaymentRub']").val("");
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").hide();
		$("input[data-field-name='curs_smp']").hide();
		$("div[data-related-field='curs_smp']").hide();
		$("input[data-field-name='date_smp']").parent().hide();
		$("div[data-related-field='date_smp']").hide();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").closest(".table-edit-column").hide();
		$("div[title='Сумма платежа в рублевом эквиваленте МСП']").hide();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").prop('required', false);
		$("input[name='date_smp']").val("");
		$("input[name='curs_smp']").val("");
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").val("");
	}
	$("input[name='Currency_kod_dolg']").val($("input[name='Currency_kod']").val());
	$("input[name='Currency_dolg']").val($("input[name='Currency']").val());
	$("input[name='Currency_dig_kod_dolg']").val($("input[name='Currency_dig_kod']").val());
	$("input[name='Currency_kod_smp']").val($("input[name='Currency_kod']").val());
	$("input[name='Currency_smp']").val($("input[name='Currency']").val());
	$("input[name='Currency_dig_kod_smp']").val($("input[name='Currency_dig_kod']").val());
	$("input[name='Currency_kod_dolg']").closest(".clearfix").find(".dict-display-field").val($("input[name='Currency_kod']").closest(".clearfix").find(".dict-display-field").val());
	valutaDolg();
	valutaSMP();
	smallPurchEdit();
});

function changeCurs(){
	$(document).on('change', "input[name='curs']", function (e) {
		$("input[name='curs_dolg']").val($("input[name='curs']").val());
		$("input[name='curs_smp']").val($("input[name='curs']").val());
		SumSMPRub.CalculateSumma(this);
		SumDolgRub.CalculateSumma(this);
		PriceRub.CalculateSumma(this);
		AlloplataSMPinrub();
		Alloplatainrub();
		valutaDolg();
		valutaSMP();
		SumSMPRub.CalculateSumma()
		SummaOsnTestSMP.Calculate()
		SumSMPRub.CalculateSumma()
	});
}

$("input[name='dateCurs']").parent().on('dp.change', function (e) {
  $("input[name='date_dolg']").val($("input[name='dateCurs']").val());
  $("input[name='date_smp']").val($("input[name='dateCurs']").val());   
});

var valutaDolg = function() {    
	var flag=$("input[name='Currency_kod_dolg']").val();
	if (flag!=="RUB") {
		$("input[data-field-name='curs_dolg']").show();
		$("div[data-related-field='curs_dolg']").show();
		$("input[data-field-name='date_dolg']").parent().show();
		$("div[data-related-field='date_dolg']").show();
		$("input[data-field-name='curs_dolg']").prop('required', true);
		$("div[data-related-field='curs_dolg']").addClass("label-required");
		$("input[data-field-name='date_dolg']").prop('required', true);
		$("div[data-related-field='date_dolg']").addClass("label-required");
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").show();
		$("div[title='Сумма платежа в рублевом эквиваленте']").show();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', true);
		$("input[data-field-name='Alloplatainrub']").show();
		$("div[data-related-field='Alloplatainrub']").show();
		$("input[data-field-name='AlloplataSMPinrub']").show();
		$("div[data-related-field='AlloplataSMPinrub']").show();
	} else {
		$("input[data-field-name='curs_dolg']").hide();
		$("div[data-related-field='curs_dolg']").hide();
		$("input[data-field-name='date_dolg']").parent().hide();
		$("div[data-related-field='date_dolg']").hide();
		$("input[data-field-name='curs_dolg']").prop('required', false);
		$("div[data-related-field='curs_dolg']").removeClass("label-required");
		$("input[data-field-name='date_dolg']").prop('required', false);
		$("div[data-related-field='date_dolg']").removeClass("label-required");
		$("div[title='Сумма платежа в рублевом эквиваленте']").hide();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', false);
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").hide();
		$("input[data-field-name='Alloplatainrub']").hide();
		$("div[data-related-field='Alloplatainrub']").hide();
		$("input[data-field-name='AlloplataSMPinrub']").hide();
		$("div[data-related-field='AlloplataSMPinrub']").hide();
	}
}
	
$(document).on('change', "input[data-field-name='Currency_kod_dolg']", function (e) {
	var flag=$("input[name='Currency_kod_dolg']").val();
	if (flag!=="RUB") {
		$("input[data-field-name='curs_dolg']").show();
		$("div[data-related-field='curs_dolg']").show();
		$("input[data-field-name='date_dolg']").parent().show();
		$("div[data-related-field='date_dolg']").show();
		$("input[data-field-name='curs_dolg']").prop('required', true);
		$("div[data-related-field='curs_dolg']").addClass("label-required");
		$("input[data-field-name='date_dolg']").prop('required', true);
		$("div[data-related-field='date_dolg']").addClass("label-required");
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").show();
		$("div[title='Сумма платежа в рублевом эквиваленте']").show();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', true);
	} else {
		$("input[data-field-name='curs_dolg']").hide();
		$("div[data-related-field='curs_dolg']").hide();
		$("input[data-field-name='date_dolg']").parent().hide();
		$("div[data-related-field='date_dolg']").hide();
		$("input[data-field-name='curs_dolg']").prop('required', false);
		$("div[data-related-field='curs_dolg']").removeClass("label-required");
		$("input[data-field-name='date_dolg']").prop('required', false);
		$("div[data-related-field='date_dolg']").removeClass("label-required");
		$("div[title='Сумма платежа в рублевом эквиваленте']").hide();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', false);
		$("input[name='date_dolg']").val("");
		$("input[name='curs_dolg']").val("");
		$("input[data-field-name*='planPayment-summaPaymentRub']").val("");
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").hide();
		$("input[data-field-name='Alloplatainrub']").val("");
		$("input[data-field-name='AlloplataSMPinrub']").val("");
	}
});

var valutaSMP = function() {    
	var flag=$("input[name='Currency_kod_smp']").val();
	if (flag!=="RUB") {
		$("input[data-field-name='curs_smp']").show();
		$("div[data-related-field='curs_smp']").show();
		$("input[data-field-name='date_smp']").parent().show();
		$("div[data-related-field='date_smp']").show();
		$("input[data-field-name='curs_smp']").prop('required', true);
		$("div[data-related-field='curs_smp']").addClass("label-required");
		$("input[data-field-name='date_smp']").prop('required', true);
		$("div[data-related-field='date_smp']").addClass("label-required");
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").closest(".table-edit-column").show();
		$("div[title='Сумма платежа в рублевом эквиваленте МСП']").show();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").prop('required', true);
	} else {
		$("input[data-field-name='curs_smp']").hide();
		$("div[data-related-field='curs_smp']").hide();
		$("input[data-field-name='date_smp']").parent().hide();
		$("div[data-related-field='date_smp']").hide();
		$("input[data-field-name='curs_smp']").prop('required', false);
		$("div[data-related-field='curs_smp']").removeClass("label-required");
		$("input[data-field-name='date_smp']").prop('required', false);
		$("div[data-related-field='date_smp']").removeClass("label-required");
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").closest(".table-edit-column").hide();
		$("div[title='Сумма платежа в рублевом эквиваленте МСП']").hide();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").prop('required', false);
	}
}
	
$(document).on('change', "input[data-field-name='Currency_kod_smp']", function (e) {
	var flag=$("input[name='Currency_kod_smp']").val();
	if (flag!=="RUB") {
		$("input[data-field-name='curs_smp']").show();
		$("div[data-related-field='curs_smp']").show();
		$("input[data-field-name='date_smp']").parent().show();
		$("div[data-related-field='date_smp']").show();
		$("input[data-field-name='curs_smp']").prop('required', true);
		$("div[data-related-field='curs_smp']").addClass("label-required");
		$("input[data-field-name='date_smp']").prop('required', true);
		$("div[data-related-field='date_smp']").addClass("label-required");
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").closest(".table-edit-column").show();
		$("div[title='Сумма платежа в рублевом эквиваленте МСП']").show();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").prop('required', true);
	} else {
		$("input[data-field-name='curs_smp']").hide();
		$("div[data-related-field='curs_smp']").hide();
		$("input[data-field-name='date_smp']").parent().hide();
		$("div[data-related-field='date_smp']").hide();
		$("input[data-field-name='curs_smp']").prop('required', false);
		$("div[data-related-field='curs_smp']").removeClass("label-required");
		$("input[data-field-name='date_smp']").prop('required', false);
		$("div[data-related-field='date_smp']").removeClass("label-required");
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").closest(".table-edit-column").hide();
		$("div[title='Сумма платежа в рублевом эквиваленте МСП']").hide();
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").prop('required', false);
		$("input[name='date_smp']").val("");
		$("input[name='curs_smp']").val("");
		$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").val("");
	}
});


var SumDolgRub = {
	CalculateSumma: function (obj) {
		var table = $("input[data-field-name*='planPayment-yearPayment']").closest("div.table-content");
		var curs_dolg = $("input[name='curs_dolg']");
		var flag = $("input[name='Currency_kod_dolg']").val();
		let spzak=$("input[name='registerSpZakup']").val()
		if ( (spzak != "200608" && spzak != "200609" && spzak != "200610" & spzak != "200611") ) {
			$("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP']").prop('required', false);
		}
		if (flag !== "RUB") {
			table.find("div.table-edit-row[data-rowkey]").each(function () {
				var elem1 = $(this).find("input[data-field-name^='planPayment-summaPayment-']")
				var elem2 = $(this).find("input[data-field-name^='planPayment-summaPaymentRub-']")
				
				if (($(elem1).val() != "") && ($(curs_dolg).val() != "")) {
					var val1 = elem1.autoNumeric('get')*1;
					var val2 = curs_dolg.val()*1;
					var val3 = val1 * val2					
					elem2.autoNumeric('set', val3);
				}
			});
		}
	}
}

var SumSMPRub = {
	CalculateSumma:function (obj) {
	var table = $("input[data-field-name*='planPaymentSMP-yearPaymentSMP']").closest("div.table-content");
	var curs_smp = $("input[name='curs_smp']");
	var flag=$("input[name='Currency_kod_smp']").val();
    if (flag!=="RUB") {
		table.find("div.table-edit-row[data-rowkey]").each(function() {
			var elem1 = $(this).find("input[data-field-name^='planPaymentSMP-summaPaymentSMP-']")
			var elem2 = $(this).find("input[data-field-name^='planPaymentSMP-summaPaymentRubSMP-']")
            if (($(elem1).val()!="") && ($(curs_smp).val()!="")) {
				var val1 =  elem1.autoNumeric('get')*1;
				//var val2 =  curs_smp.autoNumeric('get')*1;
				var val2 =  curs_smp.val()*1;
				var val3 = val1 * val2;
		        elem2.autoNumeric('set', val3);		
			}
		}); 
	}	
	}
}

var valutaView = function() {    
	var flag=$(".documentView-field-value[data-name='Валюта']").text();
	if (flag!=="Российский рубль") {
		$("div[data-name='Начальная(максимальная) цена договора в рублях']").closest(".column-container").show();
		$("div[data-name='Курс валюты']").closest(".column-container").show();
		$("div[data-name='Дата, на которую установлен курс валюты']").closest(".column-container").show();
		$('span:contains(Цена в рублевом эквиваленте)').parent().show();
		$('span:contains(Стоимость в рублевом эквиваленте)').parent().show();
		$("div[title='Цена в рублевом эквиваленте']").show();
		$("div[title='Стоимость в рублевом эквиваленте']").show();
	} else {
		$("div[data-name='Начальная(максимальная) цена договора в рублях']").closest(".column-container").hide();
		$("div[data-name='Курс валюты']").closest(".column-container").hide();
		$("div[data-name='Дата, на которую установлен курс валюты']").closest(".column-container").hide();
		$('span:contains(Цена в рублевом эквиваленте)').parent().hide();
		$('span:contains(Стоимость в рублевом эквиваленте)').parent().hide();
		$("div[title='Цена в рублевом эквиваленте']").hide();
		$("div[title='Стоимость в рублевом эквиваленте']").hide();
	}
}

var valutaDolgView = function() {    
	var flag=$(".documentView-field-value[data-name='Валюта платежей']").text();
	if (flag!=="Российский рубль") {
		$("div[data-name='Курс валюты платежей']").show();
		$("div[data-name='Дата, на которую установлен курс валюты платежей']").show();
		$("div[data-name='Объем оплаты за все года в рублях']").show();
		$('span:contains(Сумма платежа в рублевом эквиваленте)').parent().show();
		$("div[title='Сумма платежа в рублевом эквиваленте']").show();
		$(".documentView-field-value[data-name='Валюта платежей']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Валюта платежей)").attr("class", "col-sm-4 documentView-field-label")
		$(".documentView-field-value[data-name='Курс валюты платежей']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Курс валюты платежей)").attr("class", "col-sm-4 documentView-field-label")
		$(".documentView-field-value[data-name='Дата, на которую установлен курс валюты платежей']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Дата, на которую установлен курс валюты платежей)").attr("class", "col-sm-4 documentView-field-label")
		$(".documentView-field-value[data-name='Объем оплаты за все года в рублях']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Объем оплаты за все года в рублях)").attr("class", "col-sm-4 documentView-field-label")
		$('span:contains(Год)').parent().attr("style", "width: 150px; min-width: 25%;");
		$("div[title='Год']").attr("style", "width: 150px; min-width: 25%;");
		$('span:contains(Сумма платежа)').parent().attr("style", "width: 230px; min-width: 37%;");
		$("div[title='Сумма платежа']").attr("style", "width: 230px; min-width: 37%;");
		$('span:contains(Сумма платежа в рублевом эквиваленте)').parent().attr("style", "width: 230px; min-width: 38%;");
		$("div[title='Сумма платежа в рублевом эквиваленте']").attr("style", "width: 230px; min-width: 38%;");
	} else {
		$("div[data-name='Курс валюты платежей']").hide();
		$("div[data-name='Дата, на которую установлен курс валюты платежей']").hide();
		$("div[data-name='Объем оплаты за все года в рублях']").hide();
		$('span:contains(Год)').parent().attr("style", "width: 250px; min-width: 25%;");
		$("div[title='Год']").attr("style", "width: 250px; min-width: 25%;");
		$('span:contains(Сумма платежа)').parent().attr("style", "width: 350px; min-width: 37%;");
		$("div[title='Сумма платежа']").attr("style", "width: 350px; min-width: 37%;");
	}
}

var HideColumnPlaneSale = function() {
	var flag=$(".documentView-field-value[data-name='Валюта платежей']").text(); 
		gridReady ("|Document|Информация_об_объемах_оплаты_долгосрочного_договора|Планируемые_платежи").then(function (grid) {
			if (flag ==="Российский рубль") {
				hideColumnByCaptionName(grid, "Сумма платежа в рублевом эквиваленте");
			}
		});
}
	
var valutaSMPView = function() {    
	var flag=$(".documentView-field-value[data-name='Валюта платежей МСП']").text();
	if (flag!=="Российский рубль") {
		$("div[data-name='Курс валюты платежей МСП']").show();
		$("div[data-name='Дата, на которую установлен курс валюты платежей МСП']").show();
		$("div[data-name='Объем оплаты за все года в рублях МСП']").show();
		$('span:contains(Сумма платежа в рублевом эквиваленте МСП)').parent().show();
		$("div[title=' Сумма платежа в рублевом эквиваленте МСП']").show();
		$(".documentView-field-value[data-name='Валюта платежей МСП']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Валюта платежей МСП)").attr("class", "col-sm-4 documentView-field-label")
		$(".documentView-field-value[data-name='Курс валюты платежей МСП']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Курс валюты платежей МСП)").attr("class", "col-sm-4 documentView-field-label")
		$(".documentView-field-value[data-name='Дата, на которую установлен курс валюты платежей МСП']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Дата, на которую установлен курс валюты платежей МСП)").attr("class", "col-sm-4 documentView-field-label")
		$(".documentView-field-value[data-name='Объем оплаты за все года в рублях МСП']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Объем оплаты за все года в рублях МСП)").attr("class", "col-sm-4 documentView-field-label")
		$('span:contains(Год МСП)').parent().attr("style", "width: 150px; min-width: 25%;");
		$("div[title='Год МСП']").attr("style", "width: 150px; min-width: 25%;");
		$('span:contains(Сумма платежа МСП)').parent().attr("style", "width: 230px; min-width: 37%;");
		$("div[title='Сумма платежа МСП']").attr("style", "width: 230px; min-width: 37%;");
		$('span:contains(Сумма платежа в рублевом эквиваленте МСП)').parent().attr("style", "width: 230px; min-width: 38%;");
		$("div[title='Сумма платежа в рублевом эквиваленте МСП']").attr("style", "width: 230px; min-width: 38%;");
	} else {
		$("div[data-name='Курс валюты платежей МСП']").hide();
		$("div[data-name='Дата, на которую установлен курс валюты платежей МСП']").hide();
		$("div[data-name='Объем оплаты за все года в рублях МСП']").hide();
		$(".documentView-field-value[data-name='Валюта платежей МСП']").attr("class", "col-sm-8 documentView-field-value")
		$(".documentView-field-label:contains(Валюта платежей МСП)").attr("class", "col-sm-4 documentView-field-label")
		$('span:contains(Год МСП)').parent().attr("style", "width: 250px; min-width: 25%;");
		$("div[title='Год МСП']").attr("style", "width: 250px; min-width: 25%;");
		$('span:contains(Сумма платежа МСП)').parent().attr("style", "width: 350px; min-width: 37%;");
		$("div[title='Сумма платежа МСП']").attr("style", "width: 350px; min-width: 37%;");
	}
}

var HideColumnPlaneSaleMSP = function() {
	var flag=$(".documentView-field-value[data-name='Валюта платежей МСП']").text(); 
		gridReady ("|Document|Информация_об_объемах_привлечения_СМП|Планируемые_платежи_СМП").then(function (grid) {
			if (flag ==="Российский рубль") {
				hideColumnByCaptionName(grid, "Сумма платежа в рублевом эквиваленте МСП");
			}
		});
};

	
var validateFields = function() {
    var curs = $("input[name='curs']");
    var registerCount = $("input[data-field-name*='ItemTab-registerCount']");	
	
	function double_fun1(field) {
		var field;
		
		field.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			//vMin: '0.00000',
			vMax: "999999999999999999999.9999",
			wEmpty: '',
			mRound: 'B'
		});
	
	};
	
	function double_fun2(field) {
		var field;
		
		field.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			//vMin: '0.00000',
			vMax: "99999999999999999999999.99999",
			wEmpty: '',
			mRound: 'B'
		});
	
	};
	
	double_fun1(curs);
	double_fun2(registerCount);
	

	curs.attr("data-parsley-min", "[0]");
	registerCount.attr("data-parsley-min", "[0]");
	
};

var dolgosroch = function() {
	$("div[data-name='planPayment']").children().children(".table-edit-row").children(".table-row-actions-left").hide();
	$("div[data-name='planPayment']").children().children(".table-edit-row").children(".table-row-actions-right").hide();
	$("div[data-name='planPaymentSMP']").children().children(".table-edit-row").children(".table-row-actions-left").hide();
	$("div[data-name='planPaymentSMP']").children().children(".table-edit-row").children(".table-row-actions-right").hide();
}
var Neresident = function(){
	var neres= $("input[name='orgpostdog_kod']")
	if ((neres.val()=="PF") || (neres.val()=="UF")) {
		$("input[data-field-name='orgpostdogIdentNum']").closest(".column-container").show();
		$("div[data-related-field='orgpostdogIdentNum']").closest(".column-container").show();
		$("input[data-field-name='orgpostdogIdentNumAd']").closest(".column-container").show();
		$("div[data-related-field='orgpostdogIdentNumAd']").closest(".column-container").show();
	} else {
	$("input[data-field-name='orgpostdogIdentNum']").closest(".column-container").hide();
		$("div[data-related-field='orgpostdogIdentNum']").closest(".column-container").hide();
		$("input[data-field-name='orgpostdogIdentNumAd']").closest(".column-container").hide();
		$("div[data-related-field='orgpostdogIdentNumAd']").closest(".column-container").hide();
	}

}

$(document).on('change', "input[data-field-name='orgpostdog_kodName']", function (e) {
	Neresident();
});

$(document).on('change', "input[name='month']", function (e) {
	var QuarterMonth = $("input[name='QuarterMonth']");
	var month= $("input[name='month']").val();
	if (month == '1' || month == '2' || month == '3'){
		QuarterMonth.autoNumeric('set', '1');
	}
	else if (month == '4' || month == '5' || month == '6'){
		QuarterMonth.autoNumeric('set', '2');
	}
	else if (month == '7' || month == '8' || month == '9'){
		QuarterMonth.autoNumeric('set', '3');
	}
	else if (month == '10' || month == '11' || month == '12'){
		QuarterMonth.autoNumeric('set', '4');
	}
});

var god_reg = function () {
	var god = $("input[name='PlanGod']");
	var Data = new Date();
	var Year = Data.getFullYear();
 	$(god).autoNumeric('update', {			
            vMax: "9999"
			
		}); 
	god.attr("data-parsley-range", "[1900, 2099]");
};

var nered = function() {
	var table = $("div[data-name='ItemTab']");
	$(table).on('onTableRowAdded', function (ev, rowKey) {

		$("input[name='ItemTab-registerCount-"+rowKey.rowKey+"']").autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.00000',
			vMax: "99999999999999999999999999999999999999999.99999",
			wEmpty: '',
			mRound: 'B'
		});
	});
}	

var Alloplatainrub = function() {
	var valuta = $("input[name='Currency_kod_dolg']").val();
	var Alloplatainrub = $("input[name='Alloplatainrub']");
	var curs_dolg = $("input[name='curs_dolg']").val();
	var Alloplata = $("input[name='Alloplata']").autoNumeric('get');
	var flag = $("input[name='longTermcategorie']");
	if(valuta == 'RUB' && !flag.is(":checked")){
		Alloplatainrub.autoNumeric('set', '0.00')
	}
	else{
		Alloplatainrub.autoNumeric('set', curs_dolg*Alloplata)
	}
}

var AlloplataSMPinrub = function() {
	var valuta = $("input[name='Currency_kod_dolg']").val();
	var AlloplataSMPinrub = $("input[name='AlloplataSMPinrub']");
	var curs_smp = $("input[name='curs_smp']").val();
	var AlloplataSMP = $("input[name='AlloplataSMP']").autoNumeric('get');
	var flag = $("input[name='longTermcategorie']");
	if(valuta == 'RUB' && !flag.is(":checked")){
		AlloplataSMPinrub.autoNumeric('set', '0.00')
	}
	else{
		AlloplataSMPinrub.autoNumeric('set', curs_smp*AlloplataSMP)
	}
}

var winerhide = function () {
	var flag = $(".documentView-field-value[data-name='Статус']").attr("title");
	var flag3 = $(".documentView-field-value[data-name='Способ закупки']").attr("title");
	var flag2 = $("div[data-name='Централизованная закупка']").find("input[type='checkbox']");
	var ProtocolRaznogl = $("li:has(:contains('Протокол разногласий'))").find(".badge").text();
	var ProtocolOtkaz = $("li:has(:contains('Протокол отказа'))").find(".badge").text();
	$("li:has(:contains('Протокол разногласий'))").hide();
	$("li:has(:contains('Протокол отказа'))").hide();
	var statuses = [
		"Закупка завершена",
		"Закупка завершена(одна заявка)",
		"Закупка завершена, один победитель",
		"Заключение договора",
		"Закупка не состоялась",
		"Исполнение договора",
		"Договор исполнен",
		"Договор расторгнут",
		"Создан договор"
    ];
	if (flag3){
		if ($.inArray(flag, statuses) != -1 || flag3.indexOf("у единственного") != -1 ) {
			$("li:has(:contains('Контрагент'))").show();
		} else {
			$("li:has(:contains('Контрагент'))").hide();
		}
		if (flag3.indexOf("у единственного") != -1 ) {
			$("div[data-name='Создана заявка на закупку']").closest(".column-container").hide();
		}
	}
	
	if ($.inArray(flag, statuses) === -1 && ProtocolRaznogl === ""){
		$("li:has(:contains('Протокол разногласий'))").hide();
	} 
	
	if ($.inArray(flag, statuses) === -1 && ProtocolOtkaz === "" ){
		$("li:has(:contains('Протокол отказа'))").hide();
	} 
	var MSPtype = $("div[data-name='Тип МСП']");
    var flag = $("div[data-name='МСП']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        showViewElementColumn(MSPtype);
	} else {
        hideViewElementColumn(MSPtype);;		
	}
};

// Краткое содержание
var summary = function() {
	
	var ktatkoe = $("input[name='ktatkoe']");
	
	var name = $("textarea[name='registerNaimDogov']");
	var nameOrg = $("input[name='registerOrgZa']");
	var longTermcategorie = $("input[name='longTermcategorie']");
	var PlanGod = $("input[name='PlanGod']");
	var PlanMonthName = $("input[name='PlanMonthName']");
	var registerPlDateOI = $("input[name='registerPlDateOI']");
	var registerNMCS = $("input[name='registerNMCS']");
	var CFOName = $("input[name='CFOName']");
	var RashodType = $("input[name='RashodType']");
	var ArticleCode = $("input[name='ArticleCode']");
	var ArticleName = $("input[name='ArticleName']");
	var Project = $("textarea[name='Project']");
	var Currency = $("input[name='Currency']");
	var summaPayment = $("input[name*='planPayment-summaPayment']");
	var resultString = function() {
		var result;
		var dolgplat = "\n Планируемые платежи по годам:";
		result = "Организация-заказчик: " + nameOrg.val().trim() + "\n Предмет договора: " +  name.val().trim();		
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

var osnEP = function () {
	var spzak = $("input[name='registerSpZakup']").val();
	if (spzak == "533003"){
		$("input[data-field-name='osnEP']").closest(".column-container").show();
		$("[data-related-field=osnEP]").show();
		$("input[data-field-name='osnEP']").prop("required", true);
		$("[data-related-field=osnEP]").addClass("label-required");	
	}
	else {
		$("input[data-field-name='osnEP']").prop("required", false);
		$("[data-related-field=osnEP]").removeClass("label-required");
		$("input[data-field-name='osnEP']").closest(".column-container").hide();
		$("[data-related-field=osnEP]").hide();
		$("input[data-field-name='osnEP']").closest(".clearfix").find(".dict-display-field").val("");
		$("input[name='osnEP']").val('');
		$("textarea[data-field-name='osnEPName']").text('');
		$("textarea[data-field-name='osnEPName']").val('');
		$("input[name='osnEPName']").attr('value','');
	}
}

var AdressOKATORegionHideView = function () {
	var flag = $("div[data-name='Единый адрес поставки для всех товаров, работ, услуг']").find("input[type='checkbox']");
	if ($(flag).is(":checked")) {
		gridReady("Позиции").then(function (grid) {
			hideColumnByCaptionName(grid, "ОКТМО");
			hideColumnByCaptionName(grid, "Регион");
		});
	} else {		
		$(".documentView-field-value[data-name='Регион']").hide();
		$("div[data-name='Регион']").closest(".column-container").hide();
		$(".documentView-field-value[data-name='ОКТМО']").hide();
		$("div[data-name='ОКТМО']").closest(".column-container").hide();	
		$("div[title='Регион']").hide();
		$("div[title='ОКТМО']").hide();
	}
}

var hideelements = function () {
var forinput = ['Специалист по закупкам', 'Номер позиции плана', 'Номер заявки на закупку на ЭТП', 'Номер лота в извещении', 'Статус публикации в ЕИС', 'Основание закупки у ЕП', 'Комментарий бюджетного комитета'];
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

$(document).on('change', "input[data-field-name='checkBoxNMCS']", function (event) {
	ItemTab_logoc();
	$("input[name='registerNMCS']").autoNumeric('wipe');
});

var ItemTab_logoc = function () {
	var registerNMCS = $("input[name='registerNMCS']");
	var checkBoxNMCS = $("input[data-field-name='checkBoxNMCS']");
	var table = $("[data-name='ItemTab']");
	var rows = table.children(".table-content").children("[data-rowkey]");
	var addButton = $($("div[data-name='ItemTab'] div.table-add-row-button")[0]);


	addButton.show();
	rows.each(function (index, row) {
		var columnsContainer = $(row).children(".table-edit-columns");
		var priceTax = $("input[name^='ItemTab-priceTax']");
		var summaTax = $("input[name^='ItemTab-summaTax']");
		var itemName = columnsContainer.find("[name^='ItemTab-itemName']");
		var registerCount = columnsContainer.find("[name^='ItemTab-registerCount']");
		var removeButton = $($(row).find("div.table-row-actions")[0]); // только кнопка(без вложений) текущей строчки	


		/* itemName.prop("readonly", false); */
		priceTax.prop("required", true);
		priceTax.prop("readonly", false);
		summaTax.prop("readonly", false);
		//registerCount.prop("readonly", false);
		removeButton.show();
		if (checkBoxNMCS.prop('checked') == true) {
			priceTax.autoNumeric('wipe');
			summaTax.autoNumeric('wipe');
			/* summaTax.hide(600); */
			$("[title='Цена за единицу']").hide(70);
			priceTax.closest(".table-edit-column").hide(70);
			$("[title='Сумма позиции']").hide(70);
			summaTax.closest(".table-edit-column").hide(70);
			//registerNMCS.clear();
			priceTax.prop("required", false);
			registerNMCS.prop("readonly", false);
		}
		else {
			priceTax.autoNumeric('wipe');
			summaTax.autoNumeric('wipe');
			//registerNMCS.clear();
			$("[title='Цена за единицу']").show(30);
			priceTax.closest(".table-edit-column").show(30);
			$("[title='Сумма позиции']").show(30);
			summaTax.closest(".table-edit-column").show(30);
			registerNMCS.prop("readonly", true);
			summaTax.prop("readonly", true);
			priceTax.prop("required", true);
		}
	});



}
ItemTab_logoc();

$(document).on('change', "input[name^='ItemTab-priceTax']", function (e) {
	nmckCalculation();
});

$(document).on('change', "input[name^='ItemTab-registerCount']", function (e) {
	var checkBoxNMCS = $("input[data-field-name='checkBoxNMCS']");
		if (!checkBoxNMCS.is(":checked")) {
			nmckCalculation();
	}
});

$("div[data-name*='ItemTab']").on('onTableRowRemoved', function (e) {
	var flag = $("input[data-field-name='checkBoxNMCS']");
	if (!flag.is(":checked")) {
		nmckCalculation();
	}
});

//расчет суммы по позициям и НМЦК (zakharov)
var nmckCalculation = function () {

	var ItemTab = $("input[name*='ItemTab-priceTax-']").length;
	//поле цены
	var price = $("input[name*='ItemTab-priceTax-']");
	//поле количества
	var col = $("input[name*='ItemTab-registerCount-']");
	//поле суммы
	var sum = $("input[name*='ItemTab-summaTax-']");

	var i = 0;
	while (i < ItemTab) {
		//поле цены
		var price1 = $(price[i]).autoNumeric('get');
		//поле количества
		var col1 = $(col[i]).autoNumeric('get');
		//поле суммы
		var sum1 = $(sum[i]);
		var summ = 0;
		summ = price1 * col1;

	
		sum1.autoNumeric('set', summ);
		i++;
	}
	price.prop("required", true);

	//поле НМЦК
	var nmck = $("input[name='registerNMCS']");
	var nmcd = $("input[name='NMCD']");
	var valuta = $("input[name='Currency_kod']").val();

	var u = 0;
	var summ = 0;
	while (u < ItemTab) {
		//поле суммы
		var sum1 = $(sum[u]).autoNumeric('get');
		sum1 = sum1 * 1;
		summ = summ + sum1;
		u++;
	}
	nmck.autoNumeric('set', summ);
	nmck.change();
	if (valuta == 'RUB') {
		nmcd.val(nmck);
	}
	nmcd.autoNumeric('set', summ);
	PriceRub.CalculateSumma(this);
}

function hidesummview() {
	var checkBoxNMCS = $("div[data-name='Ввести сумму по строке']").find("input[type='checkbox']");
	gridReady("Позиции").then(function (grid) {
		if ($(checkBoxNMCS).is(":checked")) {
			hideColumnByCaptionName(grid, "Цена за единицу");
			hideColumnByCaptionName(grid, "Сумма позиции");
		}
	})
};

function readonlyplanPaymentSMP() {
	let registerUchZakSMP = $("input[data-field-name='registerUchZakSMP']") //Участник_закупки_СМП

	let tablePlanPaymentSMP = $("div.table-edit[data-name='planPaymentSMP']") // таблица Планируемые платежи МСП
	
	tablePlanPaymentSMP.children().children("div.table-edit-row[data-rowkey]").each(function() { //прохожу по каждой строке
		let elemen = $(this).find("input[data-field-name^='planPaymentSMP-summaPaymentSMP-']") //строка сумма платежа мсп для одного года
		let elemen2 = $(this).find("input[data-field-name^='planPaymentSMP-summaPaymentRubSMP-']")
		if ( !$(registerUchZakSMP).is(":checked") ) {
			elemen.autoNumeric('set','0');
			elemen.prop("readonly", true);
			elemen2.autoNumeric('set','0');
			elemen2.prop("readonly", true);
		}
	})
}
function correctplanPaymentSMP() { //применяется в момент, когда чекбокс закупка у смп = 1
	let tablePlanPayment = $("div.table-edit[data-name='planPayment']")
	tablePlanPayment.children().children("div.table-edit-row[data-rowkey]").each(function() { //прохожу по каждой строке
		let i = $(this).attr("data-rowkey")
		let valPlanPayment = $(this).find("input[data-field-name^='planPayment-summaPayment-']").autoNumeric('get')
		let valPlanPaymentRub = $(this).find("input[data-field-name^='planPayment-summaPaymentRub-']").autoNumeric('get')
		let planPaymentSMP = $("input[data-field-name='planPaymentSMP-summaPaymentSMP-"+i+"']")
		let summaPaymentRubSMP = $("input[data-field-name='planPaymentSMP-summaPaymentRubSMP-"+i+"']")
		if(planPaymentSMP){
			planPaymentSMP.autoNumeric('set',valPlanPayment);
			planPaymentSMP.prop("readonly", false);
			summaPaymentRubSMP.autoNumeric('set',valPlanPaymentRub);
		}
	})
}

$(document).on('change', ("input[data-field-name*='planPayment-summaPayment']"), function() {
	if ( $("input[data-field-name='registerUchZakSMP']").is(":checked") ) { 
		let i = $(this).closest("div.table-edit-row").attr("data-rowkey")
		let valPlanPayment = $(this).autoNumeric('get')
		$("input[data-field-name='planPaymentSMP-summaPaymentSMP-"+i+"']").autoNumeric('set',valPlanPayment)
		SummaOsnTestSMP.Calculate()
		SumSMPRub.CalculateSumma()
		Alloplatainrub()
		AlloplataSMPinrub()
	}
})
$(document).on('change', ("input[data-field-name='registerUchZakSMP']"), function() {//если смп, то убрать readonly у таблицы смп
	if ( $(this).is(":checked") ) { 
		correctplanPaymentSMP()
		SummaOsnTestSMP.Calculate()
	}	
	else{
		readonlyplanPaymentSMP()
		SummaOsnTestSMP.Calculate()
		
	}
	changeOKPDforMSP();
	okpdhide();
	TableRowsValidaion(); // Проверка принадлежности позиций к признаку МСП
})

function checkPositionDirectory(){
	if( $("input[data-field-name='checkPositionDirectory']").is(":checked") ){
		//раскрываем наимен-е позиции из справочника
		$("div[data-field-name='Наименование позиции из справочника']").parent().show()
		$("div[title='Наименование позиции из справочника']").show()
		
		//обязательноть заполнения позиции из справочника
		$("input[data-field-name^='ItemTab-positionDirectory']").prop("required", true);
		
		
		//скрываем наимен-е позиции 
		$("div.documentView-field-value[data-field-name='Наименование позиции']").parent().hide()
		$("div[title='Наименование позиции']").hide()
		
			
	} else { 
	
		//очищаем поле наимен-е позиции справочника
		$("input[name^='ItemTab-positionDirectoryName']").val("")
		$("input[name^='ItemTab-positionDirectory']").val("")
		$("input[data-field-name^='ItemTab-positionDirectoryName']").val("")
		$("input[data-field-name^='ItemTab-positionDirectory']").val("")
		
		//скрываем наимен-е позиции из справочника
		$("div[data-field-name='Наименование позиции из справочника']").parent().hide()
		$("div[title='Наименование позиции из справочника']").hide()
			
		//убираю обязательноть заполнения позиции из справочника
		$("input[data-field-name^='ItemTab-positionDirectory']").prop("required", false);
		
		//раскрываем наимен-е позиции 
		$("div.documentView-field-value[data-field-name='Наименование позиции']").parent().show()
		$("div[title='Наименование позиции']").show()
		
		
		
		
		
		let tableItemTab = $("div.table-edit[data-name='ItemTab']")
		tableItemTab.children().children("div.table-edit-row[data-rowkey]").each(function() { //прохожу по каждой строке
			let i = $(this).attr("data-rowkey")
			if( $("[name='ItemTab-itemName-" + i +"']").val() == "" ){
				$("[name='ItemTab-registerOKDP-" + i +"']").val("")
				$("input[name='ItemTab-registerOKDPName-" + i +"']").val("")
				$("[name='ItemTab-registerOKVED-" + i +"']").val("")
				$("[data-parent-name='ItemTab-registerOKVED-" + i +"parent']").val("")
				$("input[name='ItemTab-registerOKVEDName-" + i +"']").val("")
				$("[name='ItemTab-OKDPUMSP-" + i +"']").val("")
				$("[name='ItemTab-OKDPUMSPkod-" + i +"']").val("")
				$("input[name='ItemTab-OKDPUMSPname-" + i +"']").val("")
				$("input[name='ItemTab-registerOKDP-" + i +"']").change()
				$("input[name='ItemTab-registerOKVED-" + i +"']").change()
				$("input[name='ItemTab-OKDPUMSP-" + i +"']").change()
				$("[name='ItemTab-OKDPUMSPkod-" + i +"']").change()
			}
		})
	}	
	
}

$(document).on('change', "input[name^='ItemTab-positionDirectoryName']", function (e) {
	let current = $(this).val()
	$(this).closest("div.table-edit-row").find("input[name^='ItemTab-itemName']").val(current)
})
$(document).on('change', ("input[data-field-name='checkPositionDirectory']"), function() {
	//условие if отделено от функции checkPositionDirectory() , чтобы при взятии на редактирование не очищалось поле Наименование позиции
	if( !$("input[data-field-name='checkPositionDirectory']").is(":checked") ){
		//очищаем поле наимен-е позиции 
		$("input[name^='ItemTab-itemName']").val("")			
	}
	checkPositionDirectory()
	
})
function callCorrectplanPaymentSMP(){
	$(document).on('change', "input[data-field-name='registerSpZakup']", function (e) {
		var spzak=$("input[name='registerSpZakup']").val();
		var orgzak=$("input[data-field-name='registerOrgZa']").val();
		var flag=$("input[name='Currency_kod']").val();
		var flag2=$("[name='registerUchZakSMP'][type='checkbox']")
		if ((spzak == "200608" || spzak == "200609" || spzak == "200610" || spzak == "200611") || (spzak == "211246" && flag2.is(":checked"))) {
			correctplanPaymentSMP() //копирование значений из таблицы долгосрочные платежи в платежи смп
			
			if (flag!=="RUB") {
				SumSMPRub.CalculateSumma()
				
			}
			SummaOsnTestSMP.Calculate()
	
		} else {
			var ps2 = $("input[data-field-name*='planPaymentSMP-summaPaymentSMP']").closest("div.table-content");
			ps2.children("div.table-edit-row").each(function() {
				var elemen2 = $(this).find("input[data-field-name*='planPaymentSMP-summaPaymentRubSMP-']")
				elemen2.autoNumeric('set','0');
			}); 
			$("input[name='AlloplataSMP']").autoNumeric('set','0');
			if (flag!=="RUB") {
				$("input[name='AlloplataSMPinrub']").autoNumeric('set','0');
			}
			
		}
	});
}

var smallPurchEdit = function () {
	var registerSpZakupName = $("input[name='registerSpZakupName']").val();
	var registerOrgZa = $("input[name='registerOrgZa']").val();
	var NMCD = $("input[name='NMCD']").autoNumeric('get');
	if (registerSpZakupName.indexOf("у единственного") != -1){
		if (NMCD<=100000){
			$("[data-field-name='smallPurch']").prop("checked", true);
		} else {
			$("[data-field-name='smallPurch']").prop("checked", false);
		}
	}
	else {
		$("[data-field-name='smallPurch']").prop("checked", false);
	}

};

$(document).on('change', "input[data-field-name='CMP']", function (e) { 
	proverkaOKPD2forMSP();
})


function setOKP2andOKVED2Code() {
	let table = $("[data-name='ItemTab']");
	
	function setCode(selectedItem, selectedrow) {	
		let okpd2 = selectedItem.raw["Код ОКПД2"];	
		
		var flag2=$("[name='registerUchZakSMP'][type='checkbox']")
		let spzak=$("input[name='registerSpZakup']").val();

		/* if  (spzak != "200608" && spzak != "200609" && spzak != "200610" && spzak != "200611" && spzak != "211246" && spzak != "3363") { */
		if  (flag2.is(":checked") == false) {
			findDictionaryItemByKey("ОКПД2", okpd2, "", function (data) {
				if (data.data) {
					let okpd2Code = JSON.parse(data.data).Name;
					let okpdName = JSON.parse(data.data).Attributes["Наименование"];
					if( !(okpd2Code in TRUDict) ) {
						$("[name='ItemTab-registerOKDP-" + selectedrow +"']").val(okpd2Code);
						$("input[name='ItemTab-registerOKDPName-" + selectedrow +"']").val(okpdName);
					} else {
						showCommonErrors('Выбранная позиция из справочника относится к закупкам проводимых только у МСП');
						$("[name='ItemTab-positionDirectoryName-" + selectedrow +"']").val("");
						$("[name='ItemTab-positionDirectory-" + selectedrow +"']").val("");
						$("[name='ItemTab-OKDPUMSP-" + selectedrow +"']").val("");
						$("[name='ItemTab-OKDPUMSPname-" + selectedrow +"']").val("");
						$("[name='ItemTab-OKDPUMSPkod-" + selectedrow +"']").val("");
						$("[name='ItemTab-positionDirectory-" + selectedrow +"']").change();
						$("[name='ItemTab-positionDirectoryName-" + selectedrow +"']").change();
					}
				}
				if(data.error){
					console.log(data.error);					
				}
				$("[name='ItemTab-registerOKDP-" + selectedrow +"']").change();
			});
		
		
		}
		else{
			findDictionaryItemByKey("ОКПД2", okpd2, null, function (data) {
				if (data.data) {
					let okpd2Code = JSON.parse(data.data).Name;
					let okpdName = JSON.parse(data.data).Attributes["Наименование"];
					let indexTRU = TRUDictArr.indexOf(okpd2Code)
					indexTRU += 1;
					if( okpd2Code in TRUDict ){
						$("[name='ItemTab-OKDPUMSP-" + selectedrow +"']").val(indexTRU);
						$("input[name='ItemTab-OKDPUMSPname-" + selectedrow +"']").val(okpdName);
						$("input[name='ItemTab-OKDPUMSPkod-" + selectedrow +"']").val(okpd2Code);
						$("input[name='ItemTab-registerOKDPName-" + selectedrow +"']").val(okpdName);
						$("[name='ItemTab-registerOKDP-" + selectedrow +"']").val(okpd2Code);
					} else {
						showCommonErrors('Выбранная позиция из справочника не относится к закупкам проводимых у МСП');
						$("[name='ItemTab-positionDirectoryName-" + selectedrow +"']").val("");
						$("[name='ItemTab-positionDirectory-" + selectedrow +"']").val("");
						$("[name='ItemTab-OKDPUMSP-" + selectedrow +"']").val("");
						$("[name='ItemTab-OKDPUMSPname-" + selectedrow +"']").val("");
						$("[name='ItemTab-OKDPUMSPkod-" + selectedrow +"']").val("");
						$("[name='ItemTab-positionDirectory-" + selectedrow +"']").change();
						$("[name='ItemTab-positionDirectoryName-" + selectedrow +"']").change();
					}	
				}
				if(data.error){
					console.log(data.error);					
				}
				$("[name='ItemTab-OKDPUMSPkod-" + selectedrow +"']").change();
			});
		}
	}
	
	function subscribeOnEvent(row) {
		let dicButton = $("button[data-dict-name='Номенклатуры']");
		dicButton.on("DicItemSelected", function (event, args) {
			let row = $(event.currentTarget).parents('.table-edit-row').attr('data-rowkey');
			setCode(args.items[0],row);
		});
	}
	
	table.on("onTableRowAdded", function (event, args) {
		let newRow = args.innerTableContainer;
		subscribeOnEvent(newRow);
	});
	
	let dicButton = $("button[data-dict-name='Номенклатуры']");
	dicButton.on("DicItemSelected", function (event, args) {
		let row = $(event.currentTarget).parents('.table-edit-row').attr('data-rowkey');
		setCode(args.items[0],row);	
	});
}
// Проверка принадлежности позиций к признаку МСП
function TableRowsValidaion() {
	var Table = $("[data-name='ItemTab']");
	var SMP = $("input[data-field-name='registerUchZakSMP']");
	var smallPurch = $("input[data-field-name='smallPurch']");
	var Message = false;
	if (SMP.is(":checked")){
		Table.find('[data-rowkey]').each(function(index, elem){
			var OKPD = $(this).find("input[data-field-name*='ItemTab-registerOKDP-']");
			var OKPDCode = $(this).find("input[name*='ItemTab-registerOKDP-']");
			var registerOKDPName = $(this).find("input[data-field-name*='ItemTab-registerOKDPName-']");
			var OKDPUMSP = $(this).find("input[data-field-name*='ItemTab-OKDPUMSP-']");
			var OKDPUMSPname = $(this).find("input[data-field-name*='ItemTab-OKDPUMSPname-']");
			var OKDPUMSPCode = $(this).find("input[data-field-name*='ItemTab-OKDPUMSPkod-']");
			var OKDPUMSPval = $(this).find("input[name*='ItemTab-OKDPUMSP-']");
			var OKDPUMSPnameval = $(this).find("input[name*='ItemTab-OKDPUMSPname-']");
			var OKDPUMSPCodeval = $(this).find("input[name*='ItemTab-OKDPUMSPkod-']");
			var positionDirectoryName = $(this).find("input[data-field-name*='ItemTab-positionDirectoryName-']");
			var positionDirectory = $(this).find("input[data-field-name*='ItemTab-positionDirectory-']");
			var positionDirectoryCode = $(this).find("input[name*='ItemTab-positionDirectory-']");
			 if (OKPD.val()) {
				 if ( !(OKPD.val() in TRUDict) ) {
					positionDirectoryName.val('');
					positionDirectory.val('');
					positionDirectoryCode.val('');
					OKPD.val('');
					OKPDCode.val('');
					registerOKDPName.val('');
					OKDPUMSP.val('');
					OKDPUMSPname.val('');
					OKDPUMSPCode.val('');
					return Message = true;
				 }
				 else{
					OKDPUMSP.val(OKPD.val());
					OKDPUMSPname.val(registerOKDPName.val());
					OKDPUMSPCode.val(OKPDCode.val());	
					OKDPUMSPval.val(OKPD.val());
					OKDPUMSPnameval.val(registerOKDPName.val());
					OKDPUMSPCodeval.val(OKPDCode.val());	
				 }
			 }
		})
		
		if(Message){
			showCommonErrors('В списке позиций присутствуют ОКПД2 не относящиеся к закупкам у МСП');
		}
	} else {
		if (!smallPurch.is(":checked")){
			Table.find('[data-rowkey]').each(function(index, elem){
				var OKPD = $(this).find("input[data-field-name*='ItemTab-registerOKDP-']");
				var OKPDCode = $(this).find("input[name*='ItemTab-registerOKDP-']");
				var registerOKDPName = $(this).find("input[data-field-name*='ItemTab-registerOKDPName-']");
				var OKDPUMSP = $(this).find("input[data-field-name*='ItemTab-OKDPUMSP-']");
				var OKDPUMSPname = $(this).find("input[data-field-name*='ItemTab-OKDPUMSPname-']");
				var OKDPUMSPCode = $(this).find("input[data-field-name*='ItemTab-OKDPUMSPkod-']");
				var positionDirectoryName = $(this).find("input[data-field-name*='ItemTab-positionDirectoryName-']");
				var positionDirectory = $(this).find("input[data-field-name*='ItemTab-positionDirectory-']");
				var positionDirectoryCode = $(this).find("input[name*='ItemTab-positionDirectory-']");
				 if (OKPD.val()) {
					 if ((OKPD.val() in TRUDict) ) {
						positionDirectoryName.val('');
						positionDirectory.val('');
						positionDirectoryCode.val('');
						OKPD.val('');
						OKPDCode.val('');
						registerOKDPName.val('');
						OKDPUMSP.val('');
						OKDPUMSPname.val('');
						OKDPUMSPCode.val('');
						
						return Message = true;
					 }
				 }
			})
		}
		
		if(Message){
			showCommonErrors('В списке позиций присутствуют ОКПД2 относящихся только к МСП');
		}
	}
}

var godnered = function() {
	var registerNomPlanEIS = $("input[data-field-name='registerNomPlanEIS']").val();
	if(registerNomPlanEIS !=''){
		$("input[name='PlanGod']").prop("readonly", true);
		$("[data-field-name='Zakupkanevplan']").readonly()
		$("[data-field-name='smallPurch']").readonly()
	}
}

$(document).on('change', "input[name='plannedAfterSecondYear']", function (e) {
    plannedAfterSecondYearLogic();
});

var plannedAfterSecondYearLogic = function () {
	var plannedAfterSecondYear = $("input[name='plannedAfterSecondYear']");
	var month = $("input[name='month']");
	var monthbutton = $("#month");
	var registerPlDateOI = $("input[name='registerPlDateOI']");
	var registerSpZakup = $("input[name='registerSpZakup']");
	var registerSpZakupbutton = $("#registerSpZakup");
	var registerZakElForm = $("input[name='registerZakElForm']");
	var longTermcategorie = $("input[name='longTermcategorie']");
	var Zakupkanevplan = $("input[name='Zakupkanevplan']");
	var ZaprCen = $("input[name='ZaprCen']");
	var checkBoxNMCS = $("input[name='checkBoxNMCS']");
	var registerUchZakSMP = $("input[name='registerUchZakSMP']");
	var registerNMCS = $("input[name='registerNMCS']");
	var smallPurch = $("input[name='smallPurch']");
	var registerZakNoUch = $("input[name='registerZakNoUch']");
	var registerUslPos = $("textarea[name='registerUslPos']");
	var registerOPos = $("textarea[name='registerOPos']");
	var registerPlasePos = $("textarea[name='registerPlasePos']");
	var izmNotPubl = $("input[name='izmNotPubl']");
	var regstatus = $("input[name='regstatus']").val();
	var correction = $("input[name='correction']");
	// Если документ не корректируется
	if (!correction.is(":checked")){
		if (plannedAfterSecondYear.is(":checked")){
			month.prop("required", false);
			monthbutton.prop("disabled", true);
			$("[data-related-field='month']").removeClass("label-required");
			$("input[data-field-name='month']").prop("required", false);
			month.val('');
			$("input[name='PlanMonthName']").val('');
			$("input[data-field-name='month']").val('');
			registerPlDateOI.prop("required", false);
			registerPlDateOI.prop("readonly", true);
			$("[data-related-field='registerPlDateOI']").removeClass("label-required");
			$("input[name='registerPlDateOI']").parent().data("DateTimePicker").clear();
			registerSpZakup.prop("required", false);
			$("input[data-field-name='registerSpZakup']").prop("required", false);
			registerSpZakupbutton.prop("disabled", true);
			$("[data-related-field='registerSpZakup']").removeClass("label-required");
			registerSpZakup.val('');
			$("input[name='registerSpZakupName']").val('');
			$("input[data-field-name='registerSpZakup']").val('');
			registerZakElForm.prop("checked", false);
			longTermcategorie.prop("checked", false);
			Zakupkanevplan.prop("disabled", true);
			ZaprCen.prop("disabled", true);
			Zakupkanevplan.prop("checked", false);
			registerNMCS.prop("required", false);
			$("[data-related-field='registerNMCS']").removeClass("label-required");
			registerNMCS.autoNumeric('wipe');
			registerUchZakSMP.prop("checked", true);
			checkBoxNMCS.prop("disabled", true);
			checkBoxNMCS.prop("checked", false);
			smallPurch.prop("disabled", true);
			smallPurch.prop("checked", false);
			registerZakNoUch.prop("disabled", true);
			registerZakNoUch.prop("checked", false);
			registerUslPos.prop("readonly", true);
			registerUslPos.val('');
			registerUslPos.text('');
			registerOPos.prop("readonly", true);
			registerOPos.val('');
			registerOPos.text('');
			registerPlasePos.prop("readonly", true);
			registerPlasePos.val('');
			registerPlasePos.text('');
			$("input[data-field-name^='ItemTab-priceTax-']").prop("readonly",true);
			$("input[data-field-name^='ItemTab-priceTax-']").prop("required",false);
			$("input[data-field-name^='ItemTab-registerCount-']").prop("readonly",true);
			$("input[data-field-name^='ItemTab-registerCount-']").prop("required",false);
			$("input[data-field-name^='ItemTab-OKDPUMSP-']").prop("required", true);
			$("div[data-edit-name='OKDPUMSP']").parent().parent().show();
			$("div[title='ОКПД2 для МСП']").show();
			$("input[data-field-name^='ItemTab-registerOKDP-']").prop("required", false);	
			$("div[data-edit-name='registerOKDP']").parent().parent().hide();
			$("div[title='ОКПД2']").hide();
		}
		else{
			month.prop("required", true);
			monthbutton.prop("disabled", false);
			$("[data-related-field='month']").addClass("label-required");
			$("input[data-field-name='month']").prop("required", true);
			registerPlDateOI.prop("required", true);
			registerPlDateOI.prop("readonly", false);
			$("[data-related-field='registerPlDateOI']").addClass("label-required");
			registerSpZakupbutton.prop("disabled", false);
			/* registerSpZakup.prop("required", true);
			registerSpZakupbutton.prop("disabled", false);
			$("[data-related-field='registerSpZakup']").addClass("label-required");
			$("input[data-field-name='registerSpZakup']").prop("required", true); */
			Zakupkanevplan.prop("disabled", false);
			ZaprCen.prop("disabled", false);
			registerNMCS.prop("required", true);
			$("[data-related-field='registerNMCS']").addClass("label-required");
			checkBoxNMCS.prop("disabled", false);
			smallPurch.prop("disabled", false);
			registerZakNoUch.prop("disabled", false);
			registerUslPos.prop("readonly", false);
			registerOPos.prop("readonly", false);
			registerPlasePos.prop("readonly", false);
			$("input[data-field-name^='ItemTab-priceTax-']").prop("readonly",false);
			$("input[data-field-name^='ItemTab-registerCount-']").prop("readonly",false);
			$("input[data-field-name^='ItemTab-registerCount-']").prop("required",true);
		}
		
		$("div[data-name='ItemTab']").on("onTableRowAdded", function () {
			if (plannedAfterSecondYear.is(":checked")){
				$("input[data-field-name^='ItemTab-priceTax-']").prop("readonly",true);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("readonly",true);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("required",false);
				registerNMCS.autoNumeric('wipe');
			}
			else{
				$("input[data-field-name^='ItemTab-priceTax-']").prop("readonly",false);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("readonly",false);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("required",true);
			}
		})
		$("div[data-name='ItemTab']").on('onTableRowRemoved', function () {						
			if (plannedAfterSecondYear.is(":checked")){
				$("input[data-field-name^='ItemTab-priceTax-']").prop("readonly",true);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("readonly",true);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("required",false);
				registerNMCS.autoNumeric('wipe');
			}
			else{
				$("input[data-field-name^='ItemTab-priceTax-']").prop("readonly",false);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("readonly",false);
				$("input[data-field-name^='ItemTab-registerCount-']").prop("required",true);
			}
		});
	}
	if (regstatus != 'Черновик' || izmNotPubl.is(":checked")){
		plannedAfterSecondYear.closest(".column-container").hide();
	}
};

function Ed_IzmEditable () {
	
	var tableItemTab = $("div.table-edit[data-name='ItemTab']");
		tableItemTab.children().children("div.table-edit-row[data-rowkey]").each(function () {
		var i = $(this).attr("data-rowkey")
			if ($("input[data-field-name='ItemTab-NevCol-" + i +"']").is(":checked")) {
				$("input[data-field-name='ItemTab-Ed_izm-" + i +"']").parent().children(".input-group-btn").children().prop('disabled', true);
				$("input[name='ItemTab-registerCount-" + i +"']").prop('readonly', true)
			}
		})
}

var hideProtocolSogl = function() {
	var SectionProtocolKPC = $("li[data-tabname='Протокол бюджетного комитета']");
	if (SectionProtocolKPC.find("span").text() > 0) {
		SectionProtocolKPC.show();
	} else {
		SectionProtocolKPC.hide();
	}
}

var SelectManager = function() {
	var IniciatorDep = $("input[name='IniciatorDepId']").val();
	var zamPredId = $("input[name='zamPredId']");
	var zamPred = $("input[name='zamPred']");
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[{"EditName":"zamPredId","DictColumnName":"code","ShowAsDisplayText":true,"DictColumnWidth":"","ShowAsDictionaryColumn":true}]}';
	var formValues="";
	FormDictionaryHelperModule.getFormDictionaryItemsIds("Распределение председателей", dictFieldsInfo, formValues, function (data) {
		var parseData = JSON.parse(data.data);
		var data = parseData.children;
		var Currentmanager = data.find(function(x){
			// Если регион и Направление закупки совпадают
			if (x['Макрорегион_код'] == IniciatorDep) {
				return true;
			} else {
				return false;
			}
		})
		// Если нашли менеджера
		if (Currentmanager) {
			zamPredId.val(Currentmanager['Менеджер_код']);
			zamPred.val(Currentmanager['Менеджер_наименование']);
		}
	}, function (error) {
		ShowErrors(error);
	});		
}

var SpZakObyaz = function() {
	var registerSpZakup = $("input[name='registerSpZakup']");
	var regstatus = $("input[name='regstatus']").val();
	var DepSotr = $("input[name='DepSotr']").val();
	if (regstatus == "Черновик" || (regstatus=="На доработке" && !DepSotr)){
		registerSpZakup.prop("required", false);
		$("input[data-field-name='registerSpZakup']").prop("required", false);
		$("[data-related-field='registerSpZakup']").removeClass("label-required");
	} else {
		registerSpZakup.prop("required", true);
		$("[data-related-field='registerSpZakup']").addClass("label-required");
		$("input[data-field-name='registerSpZakup']").prop("required", true);
	}
}

var ZaprCenLogic = function () {
	var ZaprCen = $("input[name='ZaprCen']");
	var plannedAfterSecondYear = $("input[name='plannedAfterSecondYear']");
	var registerSpZakup = $("input[name='registerSpZakup']");
	var registerSpZakupbutton = $("#registerSpZakup");
	var correction = $("input[name='correction']");
	var regstatus = $("input[name='regstatus']");
	// Если документ не корректируется
	if (!correction.is(":checked")){
		if (ZaprCen.is(":checked")){
			plannedAfterSecondYear.prop("disabled", true);
			registerSpZakupbutton.prop("disabled", true);
			$("[name='Zakupkanevplan'][type='checkbox']").readonly(true);
			$("input[data-field-name='zamPred']").prop("required", false);
			$("[data-related-field='zamPred']").removeClass("label-required");
		}
		else{
			registerSpZakupbutton.prop("disabled", false);
			plannedAfterSecondYear.prop("disabled", false);
			$("[name='Zakupkanevplan'][type='checkbox']").readonly(false);
			$("input[data-field-name='zamPred']").prop("required", true);
			$("[data-related-field='zamPred']").addClass("label-required");
		}
	} 
	else{
		$("input[name='ZaprCen']").closest(".column-container").hide()
	}
	if (regstatus.val()!="Черновик"){
		$("[name='ZaprCen'][type='checkbox']").readonly(true);
	}
};

$(document).on('change', "input[name='ZaprCen']", function (e) {
	var registerSpZakupbutton = $("#registerSpZakup");
	var ZaprCen = $("input[name='ZaprCen']");
	var plannedAfterSecondYear = $("input[name='plannedAfterSecondYear']");
	if (ZaprCen.is(":checked")){
		registerSpZakupbutton.prop("disabled", true);
		plannedAfterSecondYear.prop("disabled", true);
		$("input[name='registerSpZakup']").val('1');
		$("input[data-field-name='registerSpZakup']").val('Запрос цен');
		$("input[name='registerSpZakupName']").val('Запрос цен');
		$("input[name='registerZakElFormYN']").val('Да');
		$("input[name='registerZakElForm']").prop('checked', true);
		$("input[name='Zakupkanevplan']").prop('checked', true);
		$("[name='Zakupkanevplan'][type='checkbox']").readonly(true);
		$("input[data-field-name='zamPred']").prop("required", false);
		$("[data-related-field='zamPred']").removeClass("label-required");
	}
	else{
		registerSpZakupbutton.prop("disabled", false);
		plannedAfterSecondYear.prop("disabled", false);
		$("input[name='registerSpZakup']").val('');
		$("input[data-field-name='registerSpZakup']").val('');
		$("input[name='registerSpZakupName']").val('');
		$("input[name='registerZakElFormYN']").val('');
		$("input[name='registerZakElForm']").prop('checked', false);
		$("input[name='Zakupkanevplan']").prop('checked', false);
		$("[name='Zakupkanevplan'][type='checkbox']").readonly(false);
		$("input[data-field-name='zamPred']").prop("required", true);
		$("[data-related-field='zamPred']").addClass("label-required");
	}
})

scopes.onView(hidetablelongTermview);
scopes.onView(hidecategoryview);
scopes.onView(hideblockchangeview);
scopes.onView(editreg);;
scopes.onView(valutaView);
scopes.onView(valutaDolgView);
scopes.onView(HideColumnPlaneSale);
scopes.onView(valutaSMPView);
scopes.onView(HideColumnPlaneSaleMSP);
scopes.onView(AdressOKATORegionHideView);
scopes.onView(winerhide);
scopes.onView(hideelements);
scopes.onView(hidesummview);
scopes.onView(hideProtocolSogl);

scopes.onRegister(dolgosroch);
scopes.onRegister(editreg);
scopes.onRegister(hidecategoryreg);
scopes.onRegister(hidetablelongTermreg);
scopes.onRegister(izmememie); 
scopes.onRegister(checklongtermcontract);
scopes.onRegister(WinnerHide);
scopes.onRegister(valuta);
scopes.onRegister(valutaDolg);
scopes.onRegister(valutaSMP);
scopes.onRegister(validateFields);
scopes.onRegister(Neresident);				 
scopes.onRegister(Adress);					 
scopes.onRegister(god_reg);
scopes.onRegister(nered);
scopes.onRegister(summary);
scopes.onRegister(osnEP);
scopes.onRegister(hideblockchangeedit);
scopes.onRegister(okpdhide);
scopes.onRegister(fillYear);
scopes.onRegister(yearsreg);
scopes.onRegister(registerPlDateOIChange);
scopes.onRegister(oneRowTableReq);
scopes.onRegister(readonlyplanPaymentSMP);
scopes.onRegister(checkPositionDirectory);
scopes.onRegister(WinnerHideOption);
scopes.onRegister(callCorrectplanPaymentSMP);
scopes.onRegister(changeCurs);
scopes.onRegister(setOKP2andOKVED2Code);
scopes.onRegister(proverkaOKPD2forMSP);
scopes.onRegister(changeOKPDforMSP);
scopes.onRegister(godnered);
scopes.onRegister(plannedAfterSecondYearLogic);
scopes.onRegister(Ed_IzmEditable);
scopes.onRegister(SelectManager);
scopes.onRegister(SpZakObyaz);
scopes.onRegister(ZaprCenLogic);

scopes.onEdit(osnEP);
scopes.onEdit(checklongtermcontract);
scopes.onEdit(nered);
scopes.onEdit(god_reg);
scopes.onEdit(dolgosroch);
scopes.onEdit(editreg);
scopes.onEdit(yearsreg);
scopes.onEdit(hidecategoryreg);
scopes.onEdit(hidetablelongTermedit);
scopes.onEdit(izmememie); 
scopes.onEdit(checklongtermcontractedit);
scopes.onEdit(Adress);
scopes.onEdit(WinnerHide);
scopes.onEdit(valuta);
scopes.onEdit(valutaDolg);
scopes.onEdit(valutaSMP);
scopes.onEdit(validateFields);
scopes.onEdit(validatelongTerm);
scopes.onEdit(Neresident);		
scopes.onEdit(summary);
scopes.onEdit(hideblockchangeedit);
scopes.onEdit(okpdhide);
scopes.onEdit(registerPlDateOIChange);
scopes.onEdit(oneRowTableReq);
scopes.onEdit(readonlyplanPaymentSMP);
scopes.onEdit(checkPositionDirectory);
scopes.onEdit(WinnerHideOption);
scopes.onEdit(callCorrectplanPaymentSMP);
scopes.onEdit(changeCurs);
scopes.onEdit(setOKP2andOKVED2Code);
scopes.onEdit(proverkaOKPD2forMSP);
scopes.onEdit(changeOKPDforMSP);
scopes.onEdit(godnered);
scopes.onEdit(plannedAfterSecondYearLogic);
scopes.onEdit(Ed_IzmEditable);
scopes.onEdit(SpZakObyaz);
scopes.onEdit(ZaprCenLogic);