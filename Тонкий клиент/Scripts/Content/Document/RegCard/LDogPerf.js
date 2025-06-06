"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}

// Краткое содержание, редактирование и регистрация
var summary = function() {

    var kratkoe = $("input[name='kratkoe']");

    var Num_dog = $("input[name='Num_dog']");
	var Etap = $("input[name='Etap']");
    var DateZaklDog = $("input[name='DateZaklDog']");

    function rebuildField() {
        var result = [];

        if (Num_dog.val()) {
            result.push("Исполнение договора №" + Num_dog.val().trim());
        }
		
        if (DateZaklDog.val()) {
            result.push("от " + DateZaklDog.val().trim() + ",");
        }
		
        if (Etap.val()) {
            result.push("номер этапа " + Etap.val().trim() );
        }

        kratkoe.val(result.join(" "));
    }

    rebuildField();

    Num_dog.change(function() {
        rebuildField();
    });

    DateZaklDog.change(function() {
        rebuildField();
    });

    Etap.change(function() {
        rebuildField();
    });

};


scopes.onRegister(EditReg);
scopes.onRegister(summary);

scopes.onEdit(EditReg);
scopes.onEdit(summary);