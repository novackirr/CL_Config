"use strict";

var EditReg = function() {
    $("li:has(:contains('Скрытые поля'))").hide();	 
}


scopes.onRegister(EditReg);


scopes.onEdit(EditReg);


/* scopes.onView(ConvertTableColumnName); */