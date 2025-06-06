"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}

// Краткое содержание, редактирование
var summary = function() {

    var kratkoe = $("input[name='ktatkoe']");

    var numberdog = $("input[name='nomerdog']");
    var datedog = $("input[name='datezakldog']");
    var preddog = $("input[name='preddog']");
    var postav = $("input[name='orgpost2Name']");
    var price = $("input[name='cenasNDSdog']");

    function rebuildField() {
        var result = [];

        if (numberdog.val()) {
            result.push("Договор №: " + numberdog.val());
        }

        if (datedog.val()) {
            result.push("от " + datedog.val());
        }

        if (preddog.val()) {
            result.push("предмет договора: " + preddog.val());
        }

        if (postav.val()) {
            result.push("поставщик " + postav.val());
        }

        if (price.val()) {
            result.push("цена договора: " + price.autoNumeric("get"));
        }

        kratkoe.val(result.join(", "));
    }

    rebuildField();

    numberdog.change(function() {
        rebuildField();
    });

    datedog.change(function() {
        rebuildField();
    });

    preddog.change(function() {
        rebuildField();
    });

    postav.change(function() {
        rebuildField();
    });

    price.change(function() {
        rebuildField();
    });
};


// Победитель нерезидент на регистрация
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

// Победитель нерезидент на редактирование
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

//Привлечены субподрядчики на регистрация
var subpodr_reg = function() {

    var subpodr = $("input[name='subpodr']");
    var dogsmpcol = $("input[name='dogsmpcol']");
	var subpodrCost = $("input[name='subpodrCost']");

    subpodr.change(function() {
        if ($(this).is(":checked")) {
			subpodrCost.prop("required", true);
            dogsmpcol.prop("required", true);
			dogsmpcol.closest(".column-container").show();			
			subpodrCost.closest(".column-container").show();					
        } else {
			subpodrCost.prop("required", false);
            dogsmpcol.prop("required", false);
			dogsmpcol.closest(".column-container").hide();
			dogsmpcol.val("");
			subpodrCost.closest(".column-container").hide();
			subpodrCost.val("");
        }
		
    });
    subpodr.change();           
};

//Привлечены субподрядчики на редактирование
var subpodr_edit = function() {

    var subpodr = $("input[name='subpodr']");
    var dogsmpcol = $("input[name='dogsmpcol']");
	var subpodrCost = $("input[name='subpodrCost']");

    subpodr.change(function() {
        if ($(this).is(":checked")) {
			subpodrCost.prop("required", true);
            dogsmpcol.prop("required", true);
			dogsmpcol.closest(".column-container").show();			
			subpodrCost.closest(".column-container").show();					
        } else {
			subpodrCost.prop("required", false);
            dogsmpcol.prop("required", false);
			dogsmpcol.closest(".column-container").hide();
			dogsmpcol.val("");
			subpodrCost.closest(".column-container").hide();
			subpodrCost.val("");
        }
		
    });
    subpodr.change();           
};

//на просмотр
var subpodr_view = function() {
	var flag = $("div[data-name='Привлечены субподрядчики']").find("input[type='checkbox']");
	 var dogsmpcol = $("div[data-name='Количество договоров с субподрядчиками СМП']");
	 var subpodrCost = $("div[data-name='Стоимость договоров с субподрядчиками СМП']");
	  if (!$(flag).attr("checked")) {
        dogsmpcol.hide();
		subpodrCost.hide(); 
		
    } else {
        dogsmpcol.show();
		subpodrCost.show();
    }
}

scopes.onRegister(EditReg);
scopes.onRegister(summary);
scopes.onRegister(nerezdog_reg);
scopes.onRegister(subpodr_reg);

scopes.onEdit(EditReg);
scopes.onEdit(summary);
scopes.onEdit(nerezdog_edit);
scopes.onEdit(subpodr_edit);

scopes.onView(subpodr_view);