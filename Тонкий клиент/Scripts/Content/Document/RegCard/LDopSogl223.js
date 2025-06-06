"use strict";

var EditReg = function () {
	
	$("li:has(:contains('Скрытые поля'))").hide();
	$("input[data-field-name='NumberSved']").attr("data-parsley-pattern", "\\d{23}");
	$("input[data-field-name='NumberSved']").inputmask({mask:'9{23}', greedy: false});
}

var Neustoyka = function () {
	var info = $("div[data-name='Информация о неустойках']");
	var flag = $("div[data-name='Начисление неустоек']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		info.show();
		} else {
		info.hide();
	}
};

var neust = function () {
	var flag = $("input[data-field-name='neust']");
	var InfNeust = $("textarea[name='neustName']");
	if ($(flag).is(":checked")) {
		InfNeust.closest(".column-container").show();
		InfNeust.prop("required", true);
		$("[data-related-field=neustName]").addClass("label-required");
		$("[data-related-field=neustName]").closest(".column-container").show();
	}
	else {
		InfNeust.closest(".column-container").hide();
		InfNeust.prop("required", false);
		$("[data-related-field=neustName]").removeClass("label-required");
		$("[data-related-field=neustName]").closest(".column-container").hide();
	}
}

$(document).on('change', "input[data-field-name='neust']", function (e) {
	var flag = $("input[data-field-name='neust']");
	var InfNeust = $("textarea[name='neustName']");
	if ($(flag).is(":checked")) {
		InfNeust.closest(".column-container").show();
		InfNeust.prop("required", true);
		$("[data-related-field=neustName]").addClass("label-required");
		$("[data-related-field=neustName]").closest(".column-container").show();
	}
	else {
		InfNeust.closest(".column-container").hide();
		InfNeust.prop("required", false);
		$("[data-related-field=neustName]").removeClass("label-required");
		$("[data-related-field=neustName]").closest(".column-container").hide();
		InfNeust.val("");
	}
});

var Change = function () {
	var statusRas = $("input[data-field-name='Status']").val();
	var Obosn = $("textarea[data-field-name='Obosn']");
	if (statusRas=="Внесение изменений") {
		$("li:has(:contains('Изменения'))").show();	
		Obosn.prop("required", true);
		$("[data-related-field=Obosn]").addClass("label-required");
		$("[data-related-field=Obosn]").closest(".column-container").show();
	}
	else {
		$("li:has(:contains('Изменения'))").hide();	
		Obosn.prop("required", false);
		$("[data-related-field=Obosn]").removeClass("label-required");
		$("[data-related-field=Obosn]").closest(".column-container").hide();
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

// Краткое содержание
var summary = function() {
	
	var ktatkoe = $("input[name='ktatkoe']");
	
	var name = $("textarea[name='predmetDog']");
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

var Dop = function () {
	var flag = $("input[name='DocOsnovanie']").val();
	var DopDate = $("input[name='DopDate']");
	if (flag =='11') {
		DopDate.closest(".column-container").hide();
		DopDate.prop("required", false);
		$("[data-related-field=DopDate]").removeClass("label-required");
		$("[data-related-field=DopDate]").closest(".column-container").hide();
	}
	else {
		DopDate.closest(".column-container").show();
		DopDate.prop("required", true);
		$("[data-related-field=DopDate]").addClass("label-required");
		$("[data-related-field=DopDate]").closest(".column-container").show();
	}
}

$(document).on('change', "input[name='DocOsnovanie']", function (e) {
	Dop();
});

var hideifnull = function () {
var forinput = ['Дополнительная дата документа-основания расторжения договора', 'Номер документа-основания расторжения договора'];
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

function ViewfiledHide(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
	});
}

function notpulicView(){
	var notpulic = $(".documentView-field-value[data-name='Не публиковать в ЕИС']").attr("title");
	if (notpulic=="1") {
		ViewfiledHide(['Номер договора в ЕИС', 'Фактическая дата размещения', 'Ссылка на документ в ЕИС-е', 'Номер сведений о расторжении договора']);
	}
}

scopes.onRegister(EditReg);
scopes.onRegister(neust);
scopes.onRegister(Change);
scopes.onRegister(summary);
scopes.onRegister(Dop);
	
scopes.onEdit(Dop);
scopes.onEdit(EditReg);
scopes.onEdit(neust);
scopes.onEdit(Change);
scopes.onEdit(summary);
	
scopes.onView(EditReg);
scopes.onView(Neustoyka);
scopes.onView(ChangeView);
scopes.onView(hideifnull);
scopes.onView(notpulicView);