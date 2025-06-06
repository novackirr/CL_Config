"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}
// Краткое содержание, редактирование и регистрация
var summary = function() {

    var kratkoe = $("input[name='ktatkoe']");

    var nomdog = $("input[name='nomdog']");
    var datezakldog = $("input[name='datezakldog']");
    var nomosndog = $("input[name='nomosndog']");
    var preddog = $("input[name='preddog']");
    var orgpost2Name = $("input[name='orgpost2Name']");
    var pricedogsNDS = $("input[name='pricedogsNDS']");

    function rebuildField() {
        var result = [];

        if (nomdog.val()) {
            result.push("Дополнительные соглашения №: " + nomdog.val().trim());
        }

        if (datezakldog.val()) {
            result.push("от " + datezakldog.val().trim());
        }

        if (nomosndog.val()) {
            result.push("к договору №" + nomosndog.val().trim());
        }

        if (preddog.val()) {
            result.push("предмет договора: " + preddog.val().trim());
        }

        if (orgpost2Name.val()) {
            result.push("поставщик: " + orgpost2Name.val().trim());
        }

        if (pricedogsNDS.val()) {
            result.push("цена договора: " + pricedogsNDS.autoNumeric("get"));
        }

        kratkoe.val(result.join(", "));
    }

    rebuildField();

    datezakldog.change(function() {
        rebuildField();
    });

    nomdog.change(function() {
        rebuildField();
    });

    nomosndog.change(function() {
        rebuildField();
    });

    preddog.change(function() {
        rebuildField();
    });

    orgpost2Name.change(function() {
        rebuildField();
    });

    pricedogsNDS.change(function() {
        rebuildField();
    });
};

//Начисление неустоек, редактирование и регистрация
var nach_neust_edit = function() {

    var nach = $("input[name='nachneust']");
    var inforaz = $("input[name='inforaz']");
    var inforazlabel = $(".documentView-field-label:contains('Информация о неустойках')");

    nach.change(function() {
        if ($(this).is(":checked")) {
            inforaz.show();
            inforazlabel.show();
        } else {
            inforaz.hide();
            inforazlabel.hide();
            inforaz.val("");
        }
    });
    nach.change();
};

// Расторжение договора, общее
var rastorgBase = function(tlRastorz) {

    var viddopsogl = $("input[name='viddopzakl']");
    var daterastdog = $("input[name='daterastdog']");
	var DateDocBasis = $("input[name='DateDocBasis']");
    var osnrast_kod = $("input[name='osnrast_kod']");
    var osnrast_kodName = $("input[name='osnrast_kodName']");
    var docosn_kod = $("input[name='docosn_kod']");
    var docosn_kodName = $("input[name='docosn_kodName']");
    var Namedocosn = $("textarea[name='Namedocosn']");
    var nachneust = $("input[name='nachneust']");
    var inforaz = $("input[name='inforaz']");

    viddopsogl.change(function() {
        if ($(this).val() === "Расторжение") {
            tlRastorz.show();
            daterastdog.prop("required", true);
			DateDocBasis.prop("required", true);		
			osnrast_kod.closest(".clearfix").find(".dict-display-field").prop("required", true);
			docosn_kod.closest(".clearfix").find(".dict-display-field").prop("required", true);
            Namedocosn.prop("required", true);
        } else {
            tlRastorz.hide();
            daterastdog.val("");
			DateDocBasis.val("");
            osnrast_kod.val("");
            osnrast_kodName.val("");
			osnrast_kod.closest(".clearfix").find(".dict-display-field").val("");
            docosn_kod.val("");
            docosn_kodName.val("");
			docosn_kod.closest(".clearfix").find(".dict-display-field").val("");
            Namedocosn.val("");
            nachneust.attr("checked", false);
            inforaz.val("");
			osnrast_kod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			docosn_kod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			Namedocosn.prop("required", false);
			daterastdog.prop("required", false);  
			DateDocBasis.prop("required", false);		
        }
    });

    viddopsogl.change();
};

// Расторжение договора на редактирование
var rastorgEdit = function() {
    var tlRastorz = $("#editView li:has(:contains('Расторжение договора'))");
    rastorgBase(tlRastorz);
};

// Расторжение договора на регистрацию
var rastorgRegister = function() {
    var tlRastorz = $("li:has(:contains('Расторжение договора'))");
    rastorgBase(tlRastorz);
};

// Расторжение договора на отображение
var rastorgView = function() {
    var vid = $(".documentView-field-value[data-name='Вид дополнительного соглашения']").text();
    var tlc = $("li:has(:contains('Расторжение договора'))").hide();

    if (vid === "Расторжение") {
        tlc.show();
    } else {
        tlc.hide();
    }
};



// Поставщик нерезидент на регистрации
var nerezdog_reg = function() {

    var nerezdog = $("input[name='nerezdog']");
    var orgpostdogIdentNum = $("input[name='orgpostdogIdentNum']");
	var orgpostdogIdentNumAd = $("input[name='orgpostdogIdentNumAd']");

    nerezdog.change(function() {
        if ($(this).is(":checked")) {
			orgpostdogIdentNumAd.prop("required", true);
            orgpostdogIdentNum.prop("required", true);
        } else {
			orgpostdogIdentNumAd.prop("required", false);
            orgpostdogIdentNum.prop("required", false);
        }
		
    });
    nerezdog.change();           
};

// Поставщик нерезидент на редактировании
var nerezdog_edit = function() {

    var nerezdog = $("#editView input[name='nerezdog']");
    var orgpostdogIdentNum = $("#editView input[name='orgpostdogIdentNum']");
	var orgpostdogIdentNumAd = $("#editView input[name='orgpostdogIdentNumAd']");

    nerezdog.change(function() {
        if ($(this).is(":checked")) {
			orgpostdogIdentNumAd.prop("required", true);
            orgpostdogIdentNum.prop("required", true);
        } else {
			orgpostdogIdentNumAd.prop("required", false);
            orgpostdogIdentNum.prop("required", false);
        }
		
    });
    nerezdog.change();           
};


scopes.onRegister(summary);
scopes.onRegister(nach_neust_edit);
scopes.onRegister(rastorgRegister);
scopes.onRegister(EditReg);
scopes.onRegister(nerezdog_reg);


scopes.onEdit(EditReg);
scopes.onEdit(summary);
scopes.onEdit(nach_neust_edit);
scopes.onEdit(rastorgEdit);
scopes.onEdit(nerezdog_edit);


scopes.onView(rastorgView);