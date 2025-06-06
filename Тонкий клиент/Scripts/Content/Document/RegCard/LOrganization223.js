"use strict";

var editreg = function() {     
	    $("li:has(:contains('Скрытые поля'))").hide();	
}
var hideresidentview = function() {
    var nerez = $("div[data-name='Нерезидент']").find("input[type='checkbox']");
    var DopSv = $("li:has(:contains('Дополнительные сведения'))");
    if ($(nerez).attr("checked")) {
        DopSv.hide();		
    } else {
        DopSv.show();
    }
};

///////////////////////////////////////////Регистрация и редактирования//////////////////////////////////////////

// Краткое содержание
var register = function() {
    var ShortName = $("input[name='OrgKratkoeName']");
    var KratSod = $("input[name='ktatkoe']");
	var ShortNameBusiness = $("input[name='OrgKratkoe']");
	var CountryName = $("input[name='stranaNaim']");

    ShortName.change(function() {
        KratSod.val("Реквизиты организации заказчика : " + $(this).val());
    });
	ShortNameBusiness.closest(".column-container").find(".documentView-field-label").addClass("label-required");
	CountryName.closest(".column-container").find(".documentView-field-label").addClass("label-required");
};

// Нерезидент редактирование
var validateresidentedit = function() {
    var Nres = $("#editView input[name='nerez']");
    var DopSved = $("#editView li:has(:contains('Дополнительные сведения'))");
    var INN = $("#editView input[name='INN']");
    var IKO = $("#editView input[name='IKO']");
    var OGRN = $("#editView input[name='OGRN']");
    var KPP = $("#editView input[name='KPP']");
    var DopSvedOrg = $("#editView textarea[name='dopsvedorg']");

    Nres.change(function() {
        if ($(this).is(":checked")) {
            IKO.prop("required", false);
			IKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            OGRN.prop("required", false);
			OGRN.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            KPP.prop("required", false);
			KPP.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            INN.prop("required", false);
			INN.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            DopSved.hide();
            DopSvedOrg.val("");
        } else {
            IKO.prop("required", true);
			IKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            OGRN.prop("required", true);
			OGRN.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            KPP.prop("required", true);
			KPP.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            INN.prop("required", true);
			INN.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            DopSved.show();
        }
    });
};

// Нерезидент создание
var validateresidentreg = function() {
    var Nres = $("input[name='nerez']");
    var DopSved = $("li:has(:contains('Дополнительные сведения'))");
    var INN = $("input[name='INN'] ");
    var IKO = $("input[name='IKO']");
    var OGRN = $("input[name='OGRN']");
    var KPP = $("input[name='KPP']");
    var DopSvedOrg = $("textarea[name='dopsvedorg']");

    Nres.change(function() {
        if ($(this).is(":checked")) {
            IKO.prop("required", false);
			IKO.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            OGRN.prop("required", false);
			OGRN.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            KPP.prop("required", false);
			KPP.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            INN.prop("required", false);
			INN.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            DopSved.hide();
            DopSvedOrg.val("");
        } else {
            IKO.prop("required", true);
			IKO.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            OGRN.prop("required", true);
			OGRN.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            KPP.prop("required", true);
			KPP.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            INN.prop("required", true);
			INN.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            DopSved.show();
        }
    });
    Nres.change();
};


//Почтовый адрес совпадает с Юридическим редактирование
var adreessedit = function() {
    var AddSovp = $("#editView input[name='POSTADDsovp']");
    var PostAdd = $("#editView textarea[name='POSTADD'] ");

    AddSovp.change(function() {
        if ($(this).is(":checked")) {
            PostAdd.closest(".column-container").hide();
            PostAdd.val("");
        } else {
            PostAdd.closest(".column-container").show();
        }
    });
};

// Почтовый адрес совпадает с Юридическим создание
var adreessreg = function() {
    var AddSovp = $("input[name='POSTADDsovp']");
    var PostAdd = $("textarea[name='POSTADD']");

    AddSovp.change(function() {
        if ($(this).is(":checked")) {
            PostAdd.closest(".column-container").hide();
            PostAdd.val("");
        } else {
            PostAdd.closest(".column-container").show();
        }
    });

    AddSovp.change();
};

// Почтовый адрес совпадает с Юридическим просмотр
var adreessview = function() {
    var PostAdd = $("div[data-name='Почтовый адрес']");
    var AddSovp = $("div[data-name='Почтовый адрес совпадает с Юридическим']").find("input[type='checkbox']");
    if ($(AddSovp).attr("checked")) {	
        hideViewElementColumn(PostAdd);
    } else {
        showViewElementColumn(PostAdd);		
    }
};

var validateFields = function() {
    var ogrn =  $("[name='OGRN']");
    var inn =   $("[name='INN']");
    var kpp =   $("[name='KPP']");
    var okpo =  $("[name='OKPO']");
    var okopf = $("[name='OKPF']");

    ogrn.inputmask({ mask: '9999999999999'});
    ogrn.attr("data-parsley-ogrn", "");

    inn.inputmask({ mask: '9999999999[99]', greedy: false });
    inn.attr("data-parsley-inn", "");

    kpp.inputmask({ mask: '999999999'});
    kpp.attr("data-parsley-kpp", "");
    
    okpo.inputmask({ mask: '99999999[99]', greedy: false});
    okpo.attr("data-parsley-okpo", "");

    okopf.inputmask({ mask: '99[999]', greedy: false});
    okopf.attr("data-parsley-okopf", "");
}

scopes.onView(adreessview);

scopes.onEdit(register);
scopes.onEdit(editreg);
scopes.onEdit(validateresidentedit);
scopes.onEdit(adreessedit);
scopes.onEdit(validateFields);

scopes.onRegister(register);
scopes.onRegister(editreg);
scopes.onRegister(validateresidentreg);
scopes.onRegister(adreessreg);
scopes.onRegister(validateFields);