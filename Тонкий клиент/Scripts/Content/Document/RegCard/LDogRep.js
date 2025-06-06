"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}

// Краткое содержание, редактирование и регистрация
var summary = function() {

    var kratkoe = $("input[name='ktatkoe']");

    var RepType = $("input[name='RepType']");
	var registerOrgZaName = $("input[name='registerOrgZaName']");
    var DateFrom = $("input[name='DateFrom']");
    var DateTo = $("input[name='DateTo']");

    function rebuildField() {
        var result = [];

        if (RepType.val()) {
            result.push("Отчетность о договорах: " + RepType.val().trim());
        }
		
        if (registerOrgZaName.val()) {
            result.push("организация: " + registerOrgZaName.val().trim());
        }
		
        if (DateFrom.val() &&  DateTo.val() ) {
            result.push("период сведений " + DateFrom.val().trim() + " - " + DateTo.val().trim());
        }

        kratkoe.val(result.join(", "));
    }

    rebuildField();

    RepType.change(function() {
        rebuildField();
    });

    registerOrgZaName.change(function() {
        rebuildField();
    });

    DateFrom.change(function() {
        rebuildField();
    });

    DateTo.change(function() {
        rebuildField();
    });

};

scopes.onRegister(EditReg);
scopes.onRegister(summary);

scopes.onEdit(EditReg);
scopes.onEdit(summary);