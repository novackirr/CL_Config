"use strict";

var editreg = function() {     
	$("li:has(:contains('Скрытые поля'))").hide();	
	/* $("li:has(:contains('Маршруты'))").hide(); */
	$("input[data-field-name*='SvedSMP-PokCode']").parent().children(".input-group-btn").children().prop('disabled', true);
	$("input[data-field-name*='SvedSMPPercent-PokCode']").parent().children(".input-group-btn").children().prop('disabled', true);
}

var god_reg = function () {
	var god = $("input[name='Year']");
	var Data = new Date();
	var Year = Data.getFullYear();
 	$(god).autoNumeric('update', {			
		vMax: "9999"
		
	}); 
	god.attr("data-parsley-range", "[1900, 2099]");
};

var YearReg = function() {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var month1 = month-1;
	$("input[name='Year']").val(year);
	$("input[name='Month_kod']").val(month);
	var arr=[
		'январь',
		'февраль',
		'март',
		'апрель',
		'май',
		'июнь',
		'июль',
		'август',
		'сентябрь',
		'октябрь',
		'ноябрь',
		'декабрь',
	];
	$("input[name='Month']").val(arr[month1]);
	$("input[data-field-name='Month_kod']").val(arr[month1]);
}

$(document).on('change', "input[data-field-name='Year']", function (e) {
	ControlDate();
	rebuildField();
	rebuildField1();
	var RepType_kod = $("input[name='RepType_kod']").val();
	if ((RepType_kod==5) || (RepType_kod==6)) {
		var DateFrom = $("input[name='DateFrom']");
		var DateTo = $("input[name='DateTo']");
		var Year = $("input[name='Year']").val();
		DateFrom.val('01.01.'+Year);
		DateTo.val('31.12.'+Year);
	}
});

$(document).on('change', "input[data-field-name='Month_kod']", function (e) {
	ControlDate();
	rebuildField();
	rebuildField1();
});

function rebuildField() {
	var DateFrom = $("input[name='DateFrom']")
	var Year = $("input[name='Year']")
	var Month_kod = $("input[name='Month_kod']")
	var result = [];
	
	if (Month_kod.val()) {
		if (Month_kod.val().length==2) {
            result.push("01." + Month_kod.val());
		}
		if (Month_kod.val().length==1) {
            result.push("01.0" + Month_kod.val());
		}
	}
	
	if (Year.val()) {
		result.push("." + Year.val());
	}
	
	DateFrom.val(result.join(""));
}

function rebuildField1() {
	var DateTo = $("input[name='DateTo']")
	var Year = $("input[name='Year']")
	var Month_kod = $("input[name='Month_kod']")
	var result = [];
	
	if (Month_kod.val()) {
		if ((Month_kod.val()=="1") || (Month_kod.val()=="3") || (Month_kod.val()=="5") || (Month_kod.val()=="7") || (Month_kod.val()=="8") || (Month_kod.val()=="10") || (Month_kod.val()=="12")) {
			if (Month_kod.val().length==2) {
				result.push("31." + Month_kod.val());
			}
			if (Month_kod.val().length==1) {
				result.push("31.0" + Month_kod.val());
			}
		}
		if ((Month_kod.val()=="4") || (Month_kod.val()=="6") || (Month_kod.val()=="9") || (Month_kod.val()=="11")) {
			if (Month_kod.val().length==2) {
				result.push("30." + Month_kod.val());
			}
			if (Month_kod.val().length==1) {
				result.push("30.0" + Month_kod.val());
			}
		}
		if (Month_kod.val()=="2") {
			if (Month_kod.val().length==2) {
				result.push("28." + Month_kod.val());
			}
			if (Month_kod.val().length==1) {
				result.push("28.0" + Month_kod.val());
			}
		}
	}
	
	if (Year.val()) {
		result.push("." + Year.val());
	}
	
	DateTo.val(result.join(""));
}


var ControlDate = function () {
	var now = new Date();
	var year = now.getFullYear();
	var month = now.getMonth();
	var month1 = month-1;
	var Repyear = $("input[name='Year']");
	var Repmonth = $("input[name='Month_kod']");
	if ((Repyear.val()>year) || ((Repmonth.val()>month) && (Repyear.val()>=year))) {
		showCommonErrors('Отчетный период не может быть больше текущей даты');
		if (Repyear.val()>year) {
			Repyear.val(year);
			Repyear.autoNumeric('set', year); 
		}
		if (Repmonth.val()>month) {
			Repmonth.val(month);
			var arr=[
				'январь',
				'февраль',
				'март',
				'апрель',
				'май',
				'июнь',
				'июль',
				'август',
				'сентябрь',
				'октябрь',
				'ноябрь',
				'декабрь',
			];
			$("input[name='Month']").val(arr[month1]);
			$("input[data-field-name='Month_kod']").val(arr[month1]);
		}
	}
}

var Change = function () {
	var statusRas = $("input[name='regstatus']").val();
	var Obosn = $("textarea[data-field-name='Obosn']");
	if (statusRas=="Внесение изменений") {
		$("li:has(:contains('Изменения'))").show();	
		Obosn.prop("required", true);
		$("[data-related-field=Obosn]").addClass("label-required");
		$("[data-related-field=Obosn]").closest(".column-container").show();
		$("input[data-field-name='RepType_kod']").parent().children(".input-group-btn").children().prop('disabled', true);
		$("input[data-field-name='Month_kod']").parent().children(".input-group-btn").children().prop('disabled', true);
		$("input[data-field-name='Year']").prop('readonly', true);	
	}
	else {
		$("li:has(:contains('Изменения'))").hide();	
		Obosn.prop("required", false);
		$("[data-related-field=Obosn]").removeClass("label-required");
		$("[data-related-field=Obosn]").closest(".column-container").hide();
		$("input[data-field-name='RepType_kod']").parent().children(".input-group-btn").children().prop('disabled', false);
		$("input[data-field-name='Month_kod']").parent().children(".input-group-btn").children().prop('disabled', false);
		$("input[data-field-name='Year']").prop('readonly', false);
	}
}

var ChangeView = function () {
	var statusRas = $(".documentView-field-value[data-name='Статус']").text()
	if (statusRas=="Внесение изменений") {
		$("li:has(:contains('Изменения'))").show();	
		} else {
		$("li:has(:contains('Изменения'))").hide();	
	}
};

var autoReg = function() {
	var auto = $("input[data-field-name='auto']");
	var CoutDog =$("input[name='CoutDog']");
	var SumDog =$("input[name='SumDog']");
	var CoutInnDog =$("input[name='CoutInnDog']");
	var SumInnDog= $("input[name='SumInnDog']");
	var RepType_kod = $("input[name='RepType_kod']").val();
	if (!$(auto).is(":checked")) {	
		
		if ((RepType_kod!=5) && (RepType_kod!=6)) {
			CoutDog.closest(".column-container").show();		
			$("[data-related-field=CoutDog]").closest(".column-container").show();
			SumDog.closest(".column-container").show();		
			$("[data-related-field=SumDog]").closest(".column-container").show();
			CoutInnDog.closest(".column-container").show();		
			$("[data-related-field=CoutInnDog]").closest(".column-container").show();
			SumInnDog.closest(".column-container").show();		
			$("[data-related-field=SumInnDog]").closest(".column-container").show();
			CoutDog.prop("required", true);
			CoutDog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=CoutDog]").addClass("label-required");
			SumDog.prop("required", true);
			SumDog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=SumDog]").addClass("label-required");
		}
	}
	
	else
	{   	
		if ((RepType_kod!=5) && (RepType_kod!=6)) {
			CoutDog.closest(".column-container").hide();
			$("[data-related-field=CoutDog]").closest(".column-container").hide();
			SumDog.closest(".column-container").hide();
			$("[data-related-field=SumDog]").closest(".column-container").hide();
			CoutInnDog.closest(".column-container").hide();
			$("[data-related-field=CoutInnDog]").closest(".column-container").hide();
			SumInnDog.closest(".column-container").hide();
			$("[data-related-field=SumInnDog]").closest(".column-container").hide();
			CoutDog.prop("required", false);
			CoutDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=CoutDog]").removeClass("label-required");
			SumDog.prop("required", false);
			SumDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=SumDog]").removeClass("label-required");
		}
	}
};

$(document).on('change', "input[data-field-name='auto']", function (e) {
	var auto = $("input[data-field-name='auto']");
	var CoutDog =$("input[name='CoutDog']");
	var SumDog =$("input[name='SumDog']");
	var CoutInnDog =$("input[name='CoutInnDog']");
	var SumInnDog= $("input[name='SumInnDog']");
	var RepType_kod = $("input[name='RepType_kod']").val();
	if (!$(auto).is(":checked")) {
		if ((RepType_kod!=5) && (RepType_kod!="") && (RepType_kod!=6)) {
			CoutDog.closest(".column-container").show();		
			$("[data-related-field=CoutDog]").closest(".column-container").show();
			SumDog.closest(".column-container").show();		
			$("[data-related-field=SumDog]").closest(".column-container").show();
			CoutInnDog.closest(".column-container").show();		
			$("[data-related-field=CoutInnDog]").closest(".column-container").show();
			SumInnDog.closest(".column-container").show();		
			$("[data-related-field=SumInnDog]").closest(".column-container").show();
			CoutDog.prop("required", true);
			CoutDog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=CoutDog]").addClass("label-required");
			SumDog.prop("required", true);
			SumDog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=SumDog]").addClass("label-required");
		}
		if (RepType_kod==5) {
			$("div[data-related-field='SvedSMP']").closest(".row-container").show();
			$("div[data-related-field='SvedSMPPercent']").closest(".row-container").show();
			$("div[data-name='SvedSMP']").closest(".row-container").show();
			$("div[data-name='SvedSMPPercent']").closest(".row-container").show();
			$("div[title='Добавить новую строку']").parent().hide();
			$("div[title='Удалить строку']").parent().hide();
		}
		if (RepType_kod==6) {
			$("div[data-related-field='SvedInnov']").closest(".row-container").show();
			$("div[data-related-field='SvedSMPInnovac']").closest(".row-container").show();
			$("div[data-name='SvedInnov']").closest(".row-container").show();
			$("div[data-name='SvedSMPInnovac']").closest(".row-container").show();
			$("div[title='Добавить новую строку']").parent().hide();
			$("div[title='Удалить строку']").parent().hide();
		}
	}
	else
	{   	
		if ((RepType_kod!=5) && (RepType_kod!="") && (RepType_kod!=6)) {
			CoutDog.closest(".column-container").hide();
			$("[data-related-field=CoutDog]").closest(".column-container").hide();
			SumDog.closest(".column-container").hide();
			$("[data-related-field=SumDog]").closest(".column-container").hide();
			CoutInnDog.closest(".column-container").hide();
			$("[data-related-field=CoutInnDog]").closest(".column-container").hide();
			SumInnDog.closest(".column-container").hide();
			$("[data-related-field=SumInnDog]").closest(".column-container").hide();
			CoutDog.prop("required", false);
			CoutDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=CoutDog]").removeClass("label-required");
			SumDog.prop("required", false);
			SumDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=SumDog]").removeClass("label-required");
			CoutDog.autoNumeric('wipe');
			SumDog.autoNumeric('wipe');
			CoutInnDog.autoNumeric('wipe');
			SumInnDog.autoNumeric('wipe');
		}
		if (RepType_kod==5) {
			$("div[data-related-field='SvedSMP']").closest(".row-container").hide();
			$("div[data-related-field='SvedSMPPercent']").closest(".row-container").hide();
			$("div[data-name='SvedSMP']").closest(".row-container").hide();
			$("div[data-name='SvedSMPPercent']").closest(".row-container").hide();
			$("div[title='Добавить новую строку']").parent().hide();
			$("div[title='Удалить строку']").parent().hide();
		}
		if (RepType_kod==6) {
			$("div[data-related-field='SvedInnov']").closest(".row-container").hide();
			$("div[data-related-field='SvedSMPInnovac']").closest(".row-container").hide();
			$("div[data-name='SvedInnov']").closest(".row-container").hide();
			$("div[data-name='SvedSMPInnovac']").closest(".row-container").hide();
			$("div[title='Добавить новую строку']").parent().hide();
			$("div[title='Удалить строку']").parent().hide();
		}
	}
});

$(document).on('change', "input[data-field-name='RepType_kod']", function (e) {
	var RepType_kod = $("input[name='RepType_kod']").val();
	var DateFrom = $("input[name='DateFrom']");
	var auto = $("input[data-field-name='auto']");
	var DateTo = $("input[name='DateTo']");
	var CoutDog =$("input[name='CoutDog']");
	var SumDog =$("input[name='SumDog']");
	var CoutInnDog =$("input[name='CoutInnDog']");
	var SumInnDog= $("input[name='SumInnDog']");
	if (RepType_kod==5) {
		CoutDog.closest(".column-container").hide();
		$("[data-related-field=CoutDog]").closest(".column-container").hide();
		SumDog.closest(".column-container").hide();
		$("[data-related-field=SumDog]").closest(".column-container").hide();
		CoutInnDog.closest(".column-container").hide();
		$("[data-related-field=CoutInnDog]").closest(".column-container").hide();
		SumInnDog.closest(".column-container").hide();
		$("[data-related-field=SumInnDog]").closest(".column-container").hide();
		CoutDog.prop("required", false);
		CoutDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=CoutDog]").removeClass("label-required");
		SumDog.prop("required", false);
		SumDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=SumDog]").removeClass("label-required");
		CoutDog.autoNumeric('wipe');
		SumDog.autoNumeric('wipe');
		CoutInnDog.autoNumeric('wipe');
		SumInnDog.autoNumeric('wipe');
		$("input[data-field-name='Month_kod']").closest(".column-container").hide();
		$("div[data-related-field='Month_kod']").closest(".column-container").hide();
		$("input[name='Month_kod']").val('1');
		$("input[name='Month']").val('январь');
		var Year = $("input[name='Year']").val();
		DateFrom.val('01.01.'+Year);
		DateTo.val('31.12.'+Year);
		$("input[data-field-name='Month_kod']").val('январь');
		$("div[data-related-field='SvedSMP']").closest(".row-container").show();
		$("div[data-related-field='SvedSMPPercent']").closest(".row-container").show();
		$("div[data-name='SvedSMP']").closest(".row-container").show();
		$("div[data-name='SvedSMPPercent']").closest(".row-container").show();
		$("div[data-related-field='SvedInnov']").closest(".row-container").hide();
		$("div[data-related-field='SvedSMPInnovac']").closest(".row-container").hide();
		$("div[data-name='SvedInnov']").closest(".row-container").hide();
		$("div[data-name='SvedSMPInnovac']").closest(".row-container").hide();
		$("div[title='Добавить новую строку']").parent().hide();
		$("div[title='Удалить строку']").parent().hide(); 
		// var i=0;
		// for (var i = 0; i < 35; i) {
		// $("div[data-name='SvedSMP'] .table-add-row-button").click();
		// i=i+1
		// }
		// var y=0;
		// for (var y = 0; y < 4; y) {
		// $("div[data-name='SvedSMPPercent'] .table-add-row-button").click();
		// y=y+1
		// }
		$("input[data-field-name='auto']").change();
		bindTable();
		$("input[data-field-name*='SvedSMP-PokCode']").parent().children(".input-group-btn").children().prop('disabled', true);
		$("input[data-field-name*='SvedSMPPercent-PokCode']").parent().children(".input-group-btn").children().prop('disabled', true);
	}
	
	if (RepType_kod==6) {
		CoutDog.closest(".column-container").hide();
		$("[data-related-field=CoutDog]").closest(".column-container").hide();
		SumDog.closest(".column-container").hide();
		$("[data-related-field=SumDog]").closest(".column-container").hide();
		CoutInnDog.closest(".column-container").hide();
		$("[data-related-field=CoutInnDog]").closest(".column-container").hide();
		SumInnDog.closest(".column-container").hide();
		$("[data-related-field=SumInnDog]").closest(".column-container").hide();
		CoutDog.prop("required", false);
		CoutDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=CoutDog]").removeClass("label-required");
		SumDog.prop("required", false);
		SumDog.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=SumDog]").removeClass("label-required");
		CoutDog.autoNumeric('wipe');
		SumDog.autoNumeric('wipe');
		CoutInnDog.autoNumeric('wipe');
		SumInnDog.autoNumeric('wipe');
		$("input[data-field-name='Month_kod']").closest(".column-container").hide();
		$("div[data-related-field='Month_kod']").closest(".column-container").hide();
		$("input[name='Month_kod']").val('1');
		$("input[name='Month']").val('январь');
		var Year = $("input[name='Year']").val();
		DateFrom.val('01.01.'+Year);
		DateTo.val('31.12.'+Year);
		$("input[data-field-name='Month_kod']").val('январь');
		$("div[data-related-field='SvedSMP']").closest(".row-container").hide();
		$("div[data-related-field='SvedSMPPercent']").closest(".row-container").hide();
		$("div[data-name='SvedSMP']").closest(".row-container").hide();
		$("div[data-name='SvedSMPPercent']").closest(".row-container").hide();
		$("div[data-related-field='SvedInnov']").closest(".row-container").show();
		$("div[data-related-field='SvedSMPInnovac']").closest(".row-container").show();
		$("div[data-name='SvedInnov']").closest(".row-container").show();
		$("div[data-name='SvedSMPInnovac']").closest(".row-container").show();
		$("div[title='Добавить новую строку']").parent().hide();
		$("div[title='Удалить строку']").parent().hide(); 
		// var i=0;
		// for (var i = 0; i < 35; i) {
		// $("div[data-name='SvedSMP'] .table-add-row-button").click();
		// i=i+1
		// }
		// var y=0;
		// for (var y = 0; y < 4; y) {
		// $("div[data-name='SvedSMPPercent'] .table-add-row-button").click();
		// y=y+1
		// }
		$("input[data-field-name='auto']").change();
		CreateTable();
	}
	
	if ((RepType_kod!=5) && (RepType_kod!="") && (RepType_kod!=6)) {
		if (!$(auto).is(":checked")) {
			CoutDog.closest(".column-container").show();		
			$("[data-related-field=CoutDog]").closest(".column-container").show();
			SumDog.closest(".column-container").show();		
			$("[data-related-field=SumDog]").closest(".column-container").show();
			CoutInnDog.closest(".column-container").show();		
			$("[data-related-field=CoutInnDog]").closest(".column-container").show();
			SumInnDog.closest(".column-container").show();		
			$("[data-related-field=SumInnDog]").closest(".column-container").show();
			CoutDog.prop("required", true);
			CoutDog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=CoutDog]").addClass("label-required");
			SumDog.prop("required", true);
			SumDog.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=SumDog]").addClass("label-required");
		}
		$("div[data-related-field='SvedSMP']").closest(".row-container").hide();
		$("div[data-related-field='SvedSMPPercent']").closest(".row-container").hide();
		$("div[data-name='SvedSMP']").closest(".row-container").hide();
		$("div[data-name='SvedSMPPercent']").closest(".row-container").hide();
		$("div[data-related-field='SvedInnov']").closest(".row-container").hide();
		$("div[data-related-field='SvedSMPInnovac']").closest(".row-container").hide();
		$("div[data-name='SvedInnov']").closest(".row-container").hide();
		$("div[data-name='SvedSMPInnovac']").closest(".row-container").hide();
		$("input[data-field-name='Month_kod']").closest(".column-container").show();
		$("div[data-related-field='Month_kod']").closest(".column-container").show();
		var rows = $("div[data-name=SvedSMP] [data-rowkey]");
		DateFrom.val('');
		DateTo.val('');
		rebuildField();
		rebuildField1();
		rows.each(function (index, element) {
			removeTableRow(element);
		});
		var rows1 = $("div[data-name=SvedSMPPercent] [data-rowkey]");
		rows1.each(function (index, element) {
			removeTableRow(element);
		});
	}
	
});

var TypeReport = function() {
	var RepType_kod = $("input[name='RepType_kod']").val();
	var DateFrom = $("input[name='DateFrom']");
	var auto = $("input[data-field-name='auto']");
	var DateTo = $("input[name='DateTo']");
	if ((RepType_kod==5) && (!$(auto).is(":checked"))) {
		$("div[data-related-field='SvedSMP']").closest(".row-container").show();
		$("div[data-related-field='SvedSMPPercent']").closest(".row-container").show();
		$("div[data-name='SvedSMP']").closest(".row-container").show();
		$("div[data-name='SvedSMPPercent']").closest(".row-container").show();
		$("div[title='Добавить новую строку']").parent().hide();
		$("div[title='Удалить строку']").parent().hide();
		var Year = $("input[name='Year']").val();
		DateFrom.val('01.01.'+Year);
		DateTo.val('31.12.'+Year);
	} 
	
	if ((RepType_kod==6) && (!$(auto).is(":checked"))) {
		$("div[data-related-field='SvedInnov']").closest(".row-container").show();
		$("div[data-related-field='SvedSMPInnovac']").closest(".row-container").show();
		$("div[data-name='SvedInnov']").closest(".row-container").show();
		$("div[data-name='SvedSMPInnovac']").closest(".row-container").show();
		$("div[title='Добавить новую строку']").parent().hide();
		$("div[title='Удалить строку']").parent().hide();
		var Year = $("input[name='Year']").val();
		DateFrom.val('01.01.'+Year);
		DateTo.val('31.12.'+Year);
	}
	
	if ((RepType_kod!=6)&& (RepType_kod!=5)) {
		$("div[data-related-field='SvedSMP']").closest(".row-container").hide();
		$("div[data-related-field='SvedSMPPercent']").closest(".row-container").hide();
		$("div[data-name='SvedSMP']").closest(".row-container").hide();
		$("div[data-name='SvedSMPPercent']").closest(".row-container").hide();
		$("div[data-related-field='SvedInnov']").closest(".row-container").hide();
		$("div[data-related-field='SvedSMPInnovac']").closest(".row-container").hide();
		$("div[data-name='SvedInnov']").closest(".row-container").hide();
		$("div[data-name='SvedSMPInnovac']").closest(".row-container").hide();
	}
}

var RepView = function () {
	var RepType = $(".documentView-field-value[data-name='Тип отчетности']").text()
	if ((RepType=="Договоры по результатам закупок") || (RepType=="Договоры, заключенные заказчиком по результатам закупки у единственного поставщика (исполнителя, подрядчика)") || (RepType=="Договоры, заключенные заказчиком по результатам закупки, сведения о которой составляют государственную тайну или в отношении которой приняты решения Правительства Российской Федерации") || (RepType=="Договоры, заключенные заказчиком по результатам закупки у субъектов малого и среднего предпринимательства")  || (RepType=="Договоры, заключенные заказчиком с единственным поставщиком (исполнителем, подрядчиком) по результатам несостоявшейся конкурентной закупки")) {
		$("div[data-name='Количество заключенных договоров']").closest("fieldset").show();
		gridReady("|Document|Показатели").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		gridReady("|Document|Показатели_проценты").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		gridReady("|Document|Показатели_инновационные").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		gridReady("|Document|Показатели_инновационные_смп").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		/*$("div[data-table-path='|Document|Показатели']").closest("fieldset").hide();
		$("div[data-table-path='|Document|Показатели_проценты']").closest("fieldset").hide();
		$("div[data-table-path='|Document|Показатели_инновационные']").closest("fieldset").hide();
		$("div[data-table-path='|Document|Показатели_инновационные_смп']").closest("fieldset").hide();*/
	} 
	if (RepType=="Годовой отчет о закупке товаров, работ, услуг у субъектов малого и среднего предпринимательства") {
		$("div[data-name='Месяц сдачи отчетности']").closest(".column-container").hide();
		$("div[data-name='Количество заключенных договоров']").closest("fieldset").hide();
		/*$("div[data-table-path='|Document|Показатели']").closest("fieldset").show();
		$("div[data-table-path='|Document|Показатели_проценты']").closest("fieldset").show();
		$("div[data-table-path='|Document|Показатели_инновационные']").closest("fieldset").hide();
		$("div[data-table-path='|Document|Показатели_инновационные_смп']").closest("fieldset").hide();*/
		gridReady("|Document|Показатели_инновационные").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		gridReady("|Document|Показатели_инновационные_смп").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
	}
	if (RepType=="Годовой отчет о закупке инновационной продукции, высокотехнологичной продукции") {
		$("div[data-name='Месяц сдачи отчетности']").closest(".column-container").hide();
		$("div[data-name='Количество заключенных договоров']").closest("fieldset").hide();
			gridReady("|Document|Показатели").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		gridReady("|Document|Показатели_проценты").then(function(grid) {
			var block = grid.element().closest("div.field-group-view");
			block.hide();
		});
		/*$("div[data-table-path='|Document|Показатели']").closest("fieldset").hide();
		$("div[data-table-path='|Document|Показатели_проценты']").closest("fieldset").hide();
		$("div[data-table-path='|Document|Показатели_инновационные']").closest("fieldset").show();
		$("div[data-table-path='|Document|Показатели_инновационные_смп']").closest("fieldset").show();*/
	}
};

//n.volosatov
function bindTable() {
	var dicName = "Показатели годового отчета 223",
	fields = ["Показатели годового отчета 223", "Наименование"];
	
	var secondTablesCodes = ["11", "12", "13", "14"];
	
	var existingRowFirstTableTableCount = $("div[data-name='SvedSMP'] div[data-rowkey]").length;
	var existingRowSecondTableCount = $("div[data-name='SvedSMPPercent'] div[data-rowkey]").length;
	
	if(existingRowFirstTableTableCount !== 0 || existingRowSecondTableCount !== 0)
	return;
	
	getDictionaryItems(dicName, "", "", 1, fields, function (data) {
		var l = data.children.length;
		if (l > 0) {
			var itemIDs = [];
			for (var i = 0; i < l; i++) {
				var current = data.children[i];
				var code = current["code"];
				if (secondTablesCodes.indexOf(code) === -1) {
					//$("div[data-name='SvedSMP'] .table-add-row-button").click();
					$("div[data-name='SvedSMP']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
					$("input[name='SvedSMP-PokCode-" + (i + 1) + "']").val(current["code"]);
					$("input[name='SvedSMP-PokName-" + (i + 1) + "']").val(current["Наименование"]);
					} else {
					var existingRowsCount = $("div[data-name='SvedSMPPercent'] div[data-rowkey]").length;
					
					//$("div[data-name='SvedSMPPercent'] .table-add-row-button").click();
					$("div[data-name='SvedSMPPercent']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
					$("input[name='SvedSMPPercent-PokCode-" + (existingRowsCount + 1) + "']").val(code);
					$("input[data-field-name='SvedSMPPercent-PokCode-"+ (existingRowsCount + 1) + "']").val(code);
					
					$("input[name='SvedSMPPercent-PokName-" + (existingRowsCount + 1) + "']").val(current["Наименование"]);
				}
			}
			
			//$("input[data-field-name='auto']").change();
		}
		}, function (error) {
		showCommonErrors([error]);
	});
}
//end n.volosatov

var Row11 = function () {
	var row32 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-32']").val();
	var row34 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-34']").val();
	var row36 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-36']").val();
	var row38 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-38']").val();
	var row31 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-31']").val();
	var result = $("input[data-field-name='SvedSMPPercent-PartPercent-1']");
	var row321 = row32.replace(/ /g, '')*1; 
	var val1 =  parseFloat(row321 ? row321 : 0);
	var row341 = row34.replace(/ /g, '')*1; 
	var val2 =  parseFloat(row341 ? row341 : 0);
	var row361 = row36.replace(/ /g, '')*1; 
	var val3 =  parseFloat(row361 ? row361 : 0);
	var row381 = row38.replace(/ /g, '')*1; 
	var val4 =  parseFloat(row381 ? row381 : 0);
	var row311 = row31.replace(/ /g, '')*1; 
	var val5 =  parseFloat(row311 ? row311 : 0);
	if (val5!=0) {
		var percent = ((val1+val2+val3+val4)/val5*100).toFixed(2);
		if (percent>100) {
			showCommonErrors('Показатель Годовой объем закупок у субъектов малого и среднего предпринимательства не может превышать 100%')
			} else {
			result.val(percent);
		}
	}
}

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-32']", function (e) {
	Row11();
});

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-34']", function (e) {
	Row11();
	Row12();
});

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-36']", function (e) {
	Row11();
});

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-38']", function (e) {
	Row11();
});

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-31']", function (e) {
	Row11();
	Row12();
	Row3();
	Row14();
});

var Row12 = function () {
	var row31 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-31']").val();
	var row34 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-34']").val();
	var result = $("input[data-field-name='SvedSMPPercent-PartPercent-2']");
	var row311 = row31.replace(/ /g, '')*1; 
	var val1 =  parseFloat(row311 ? row311 : 0);
	var row341 = row34.replace(/ /g, '')*1; 
	var val2 =  parseFloat(row341 ? row341 : 0);
	if (val1!=0) {
		var percent = (val2/val1*100).toFixed(2);
		if (percent>100) {
			showCommonErrors('Показатель Годовой объем закупок у субъектов малого и среднего предпринимательства по результатам проведения торгов, иных способов закупки, предусмотренных положением о закупке, в которых участниками закупок являются только субъекты малого и среднего предпринимательства не может превышать 100%')
			} else {
			result.val(percent);
		}
	}
}

var Row3 = function () {
	var row33 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-33']").val();
	var row35 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-35']").val();
	var row37 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-37']").val();
	var row39 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-39']").val();
	var row31 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-31']").val();
	var result = $("input[data-field-name='SvedSMPPercent-PartPercent-3']");
	var row331 = row33.replace(/ /g, '')*1; 
	var val1 =  parseFloat(row331 ? row331 : 0);
	var row351 = row35.replace(/ /g, '')*1; 
	var val2 =  parseFloat(row351 ? row351 : 0);
	var row371 = row37.replace(/ /g, '')*1; 
	var val3 =  parseFloat(row371 ? row371 : 0);
	var row391 = row39.replace(/ /g, '')*1; 
	var val4 =  parseFloat(row391 ? row391 : 0);
	var row311 = row31.replace(/ /g, '')*1; 
	var val5 =  parseFloat(row311 ? row311 : 0);
	if (val5!=0) {
		var percent = ((val1+val2+val3+val4)/val5*100).toFixed(2);
		if (percent>100) {
			showCommonErrors('Показатель Годовой объем закупок у субъектов малого предпринимательства не может превышать 100%')
			} else {
			result.val(percent);
		}
	}
}

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-33']", function (e) {
	Row3();
});

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-35']", function (e) {
	Row3();
	Row14();
});

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-37']", function (e) {
	Row3();
});

$(document).on('change', "input[data-field-name='SvedSMP-StoimVolumeOtchet-39']", function (e) {
	Row3();
});

var Row14 = function () {
	var row31 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-31']").val();
	var row34 = $("input[data-field-name='SvedSMP-StoimVolumeOtchet-35']").val();
	var result = $("input[data-field-name='SvedSMPPercent-PartPercent-4']");
	var row311 = row31.replace(/ /g, '')*1; 
	var val1 =  parseFloat(row311 ? row311 : 0);
	var row341 = row34.replace(/ /g, '')*1; 
	var val2 =  parseFloat(row341 ? row341 : 0);
	if (val1!=0) {
		var percent = (val2/val1*100).toFixed(2);
		if (percent>100) {
			showCommonErrors('Показатель Годовой объем закупок у субъектов малого предпринимательства по результатам проведения торгов, иных способов закупки, предусмотренных положением о закупке, в которых участниками закупок являются только субъекты малого и среднего предпринимательства не может превышать 100%')
			} else {
			result.val(percent);
		}
	}
}

var nered = function() {
	var table = $("div[data-name='SvedSMP']");
	$(table).on('onTableRowAdded', function (ev, rowKey) {
		
		$("input[name='SvedSMP-StoimVolume-"+rowKey.rowKey+"']").autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.00000',
			vMax: "99999999999999999999999999999999999999999.99999",
			wEmpty: '',
			mRound: 'B'
		});
		
	});
}

var nered2 = function() {
	var table = $("div[data-name='SvedSMP']");
	$(table).on('onTableRowAdded', function (ev, rowKey) {
		
		$("input[name='SvedSMP-StoimVolumeOtchet-"+rowKey.rowKey+"']").autoNumeric('init', {
			aSep: '',
			aDec: '.',
			vMin: '0.00000',
			vMax: "99999999999999999999999999999999999999999.99999",
			wEmpty: '',
			mRound: 'B'
		});
		
	});
}

var CreateTable = function() {
	var table = $("div[data-name='SvedInnov']");
	var table2 = $("div[data-name='SvedSMPInnovac']");
	
	if (!$("div[data-name='SvedInnov'] div[data-rowkey]").length && !$("div[data-name='SvedSMPInnovac'] div[data-rowkey]").length) {
		var i;
		for (i = 1; i < 5; i++) {
			$("div[data-name='SvedInnov']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
			//$("div[data-name='SvedInnov'] .table-add-row-button").click();
			$("input[data-field-name='SvedInnov-NumInnov-"+i+"']").val(i);
		} 
		for (i = 1; i < 7; i++) {
		
			$("div[data-name='SvedSMPInnovac']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
			//$("div[data-name='SvedSMPInnovac'] .table-add-row-button").click();
			$("input[data-field-name='SvedSMPInnovac-NumInnovacSMP-"+i+"']").val(i);
		} 
		$("input[data-field-name='SvedInnov-PokCodeIn-1']").val('1');
		$("input[data-field-name='SvedInnov-PokCodeIn-2']").val('2');
		$("input[data-field-name='SvedInnov-PokCodeIn-3']").val('3');
		$("input[data-field-name='SvedInnov-PokCodeIn-4']").val('4');
		
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-1']").val('5');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-2']").val('6');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-3']").val('7');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-4']").val('8');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-5']").val('9');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-6']").val('10');
		/* $("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-5']").val('11');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-6']").val('12');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-7']").val('13');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-8']").val('14');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-9']").val('15');
		$("input[data-field-name='SvedSMPInnovac-PokCodeInSMP-10']").val('16');	 */											 
		$("input[data-field-name='SvedInnov-PokNameInnov-1']").val('Всего договоров, заключенных заказчиком по результатам закупки инновационной продукции, высокотехнологичной продукции за год, предшествующий отчетному');
		$("input[data-field-name='SvedInnov-PokNameInnov-2']").val('Всего договоров, заключенных заказчиком по результатам закупки инновационной продукции, высокотехнологичной продукции за отчетный год');
		$("input[data-field-name='SvedInnov-PokNameInnov-3']").val('Увеличение годового объема закупки инновационной продукции, высокотехнологичной продукции (для сравнения отчетного года с годом, предшествующим отчетному, рассчитывается как частное от деления разницы между показателем, предусмотренным позицией 2 настоящего раздела, и показателем, предусмотренным позицией 1 настоящего раздела, на показатель, предусмотренный позицией 1 настоящего раздела, умноженное на 100) (процентов)');
		$("input[data-field-name='SvedInnov-PokNameInnov-4']").val('Сведения о доле закупки инновационной продукции, высокотехнологичной продукции в совокупном годовом стоимостном объеме всех договоров, заключенных заказчиком по результатам закупки товаров, работ, услуг за отчетный год (рассчитывается как частное от деления показателя, предусмотренного позицией 2 настоящего раздела, на совокупный годовой стоимостный объем всех договоров, заключенных заказчиком по результатам закупки товаров, работ, услуг за отчетный год, умноженное на 100) (процентов)');
		$("input[data-field-name='SvedSMPInnovac-PokNameInnovSMP-1']").val('Всего договоров, заключенных заказчиком по результатам закупок инновационной продукции, высокотехнологичной продукции, указанных в пункте 7 Положения об особенностях участия субъектов малого и среднего предпринимательства в закупках товаров, работ, услуг отдельными видами юридических лиц, годовом объеме таких закупок и порядке расчета указанного объема, утвержденного постановлением Правительства Российской Федерации от 11 декабря 2014 г. N 1352 "Об особенностях участия субъектов малого и среднего предпринимательства в закупках товаров, работ, услуг отдельными видами юридических лиц" (далее - Положение об особенностях участия субъектов малого и среднего предпринимательства в закупках товаров, работ, услуг отдельными видами юридических лиц), за год, предшествующий отчетному');
		$("input[data-field-name='SvedSMPInnovac-PokNameInnovSMP-2']").val('Всего договоров, заключенных заказчиком по результатам закупки инновационной продукции, высокотехнологичной продукции у субъектов малого и среднего предпринимательства за год, предшествующий отчетному');
		$("input[data-field-name='SvedSMPInnovac-PokNameInnovSMP-3']").val('Всего договоров, заключенных заказчиком по результатам закупок инновационной продукции, высокотехнологичной продукции, указанных в пункте 7 Положения об особенностях участия субъектов малого и среднего предпринимательства в закупках товаров, работ, услуг отдельными видами юридических лиц, за отчетный год');
		$("input[data-field-name='SvedSMPInnovac-PokNameInnovSMP-4']").val('Всего договоров, заключенных заказчиком по результатам закупки инновационной продукции, высокотехнологичной продукции у субъектов малого и среднего предпринимательства за отчетный год');
		$("input[data-field-name='SvedSMPInnovac-PokNameInnovSMP-5']").val('Увеличение годового объема закупки инновационной продукции, высокотехнологичной продукции у субъектов малого и среднего предпринимательства (для сравнения отчетного года с годом, предшествующим отчетному, рассчитывается как частное от деления разницы между показателем, предусмотренным позицией 4 настоящего раздела, и показателем, предусмотренным позицией 2 настоящего раздела, на показатель, предусмотренный позицией 2 настоящего раздела, умноженное на 100) (процентов)');
		$("input[data-field-name='SvedSMPInnovac-PokNameInnovSMP-6']").val('Сведения о доле закупки инновационной продукции, высокотехнологичной продукции у субъектов малого и среднего предпринимательства в совокупном годовом стоимостном объеме всех договоров, заключенных заказчиком по результатам закупки товаров, работ, услуг за отчетный год (рассчитывается как частное от деления показателя, предусмотренного позицией 4 настоящего раздела, на совокупный годовой стоимостный объем всех договоров, заключенных заказчиком по результатам закупки товаров, работ, услуг за отчетный год, умноженное на 100) (процентов)');
	}
	
	$("input[data-field-name='SvedInnov-StoimVolumeInnov-1']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-ColDogovorInnov-2']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-StoimVolumeInnov-3']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-ColDogovorInnov-4']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-DolyInnov-1']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-DolyInnov-2']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-DolyInnov-3']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-DolyInnov-4']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-StoimVolumeInnov-5']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-ColDogovorInnov-5']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-StoimVolumeInnov-6']").prop('readonly', true);
	$("input[data-field-name='SvedInnov-ColDogovorInnov-6']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-1']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-2']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-3']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-4']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-5']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-6']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-7']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-8']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-1']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-3']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-5']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-7']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-ColDogovorInnovSMP-2']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-ColDogovorInnovSMP-4']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-ColDogovorInnovSMP-6']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-9']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-10']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-ColDogovorInnovSMP-9']").prop('readonly', true);
	$("input[data-field-name='SvedSMPInnovac-ColDogovorInnovSMP-10']").prop('readonly', true);
	$("div[title='Добавить новую строку']").parent().hide();
	$("div[title='Удалить строку']").parent().hide();
}


$(document).click("button[class*='save-editing-doc']", function () {
	var Year = $("input[name='Year']").val();
	var yearresult = parseInt(Year)-1;
	var datefrom1 = $("input[name='DateFromPrevious']").val("01.01."+yearresult);
	var dateto1 = $("input[name='DateToPrevious']").val("31.12."+yearresult);
});

var Row5 = function () {
	var row4 = $("input[data-field-name='SvedInnov-StoimVolumeInnov-4']").val();
	var row2 = $("input[data-field-name='SvedInnov-StoimVolumeInnov-2']").val();
	var result = $("input[data-field-name='SvedInnov-DolyInnov-5']");
	var row41 = row4.replace(/ /g, '')*1; 
	var val1 =  parseFloat(row41 ? row41 : 0);
	var row21 = row2.replace(/ /g, '')*1; 
	var val2 =  parseFloat(row21 ? row21 : 0);
	if (val2!=0) {
		var percent = ((val1-val2)/val2*100).toFixed(5);
		if (percent>100) {
			showCommonErrors('Показатель Значение доли в % по показателю не может превышать 100%')
			} else {
			result.val(percent);
		}
	}
}

var Row9 = function () {
	var row8 = $("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-8']").val();
	var row4 = $("input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-4']").val();
	var result = $("input[data-field-name='SvedSMPInnovac-DolyInnovSMP-9']");
	var row41 = row4.replace(/ /g, '')*1; 
	var val1 =  parseFloat(row41 ? row41 : 0);
	var row81 = row8.replace(/ /g, '')*1; 
	var val2 =  parseFloat(row81 ? row81 : 0);
	if (val2!=0) {
		var percent = (val1/val2*100).toFixed(5);
		if (percent>100) {
			showCommonErrors('Показатель Значение доли в % по показателю не может превышать 100%')
			} else {
			result.val(percent);
		}
	}
}

$(document).on('change', "input[data-field-name='SvedInnov-StoimVolumeInnov-4']", function (e) {
	Row5();
});

$(document).on('change', "input[data-field-name='SvedInnov-StoimVolumeInnov-2']", function (e) {
	Row5();
});

$(document).on('change', "input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-8']", function (e) {
	Row9();
});

$(document).on('change', "input[data-field-name='SvedSMPInnovac-StoimVolumeInnovSMP-4']", function (e) {
	Row9();
});

// Краткое содержание
var summary = function() {
	
	var ktatkoe = $("input[name='ktatkoe']");
	
	var RepType = $("input[name='RepType']");
	var resultString = function() {
		
		var result = "Отчетность о договорах, Тип отчетности: " + RepType.val().trim();		
		
		return result;
	};	
	ktatkoe.val(resultString());
	
	RepType.change(function() {
	    ktatkoe.val(resultString());
	});
};

scopes.onRegister(editreg);
scopes.onRegister(Change);
scopes.onRegister(YearReg);
scopes.onRegister(rebuildField);
scopes.onRegister(rebuildField1);
scopes.onRegister(autoReg);
scopes.onRegister(god_reg);
scopes.onRegister(TypeReport);
scopes.onRegister(nered);
scopes.onRegister(nered2);
scopes.onRegister(summary);

scopes.onEdit(editreg);
scopes.onEdit(Change);
/* scopes.onEdit(rebuildField);
scopes.onEdit(rebuildField1); */
scopes.onEdit(autoReg);
scopes.onEdit(god_reg);
scopes.onEdit(TypeReport);
scopes.onEdit(nered);
scopes.onEdit(nered2);
scopes.onEdit(summary);

scopes.onView(ChangeView);
scopes.onView(editreg);
scopes.onView(RepView);