"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}
var resident_view = function() {

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

    ShortName.change(function() {
        KratSod.val("Реквизиты организации заказчика : " + $(this).val());
    });
};

// Нерезидент редактирование
var resident_edit = function() {
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
            OGRN.prop("required", false);
            KPP.prop("required", false);
            INN.prop("required", false);
            DopSved.hide();
            DopSvedOrg.val("");
        } else {
            IKO.prop("required", true);
            OGRN.prop("required", true);
            KPP.prop("required", true);
            INN.prop("required", true);
            DopSved.show();
        }
    });
};

// Нерезидент создание
var resident_reg = function() {
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
            OGRN.prop("required", false);
            KPP.prop("required", false);
            INN.prop("required", false);
            DopSved.hide();
            DopSvedOrg.val("");
        } else {
            IKO.prop("required", true);
            OGRN.prop("required", true);
            KPP.prop("required", true);
            INN.prop("required", true);
            DopSved.show();
        }
    });

    Nres.change();
};

//Почтовый адрес совпадает с Юридическим редактирование
var asd_edit = function() {
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
var asd_reg = function() {
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
var asd_view = function() {
    var PostAdd = $("div[data-name='Почтовый адрес']");
    var AddSovp = $("div[data-name='Почтовый адрес совпадает с Юридическим']").find("input[type='checkbox']");
    if ($(AddSovp).attr("checked")) {	
        PostAdd.hide();
    } else {
        PostAdd.show();		
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

scopes.onView(asd_view);

scopes.onEdit(register);
scopes.onEdit(EditReg);
scopes.onEdit(resident_edit);
scopes.onEdit(asd_edit);
scopes.onEdit(validateFields);

scopes.onRegister(register);
scopes.onRegister(EditReg);
scopes.onRegister(resident_reg);
scopes.onRegister(asd_reg);
scopes.onRegister(validateFields);