"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}

// год на регистрации 
var god_reg = function() {
	
	var god = $("input[name='god']");
    var Data = new Date();
	var Year = Data.getFullYear();
		
    god.val( Year ); 
};

scopes.onRegister(EditReg);
scopes.onRegister(god_reg);

scopes.onEdit(EditReg);
