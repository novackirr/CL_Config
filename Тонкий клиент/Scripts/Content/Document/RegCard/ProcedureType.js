"use strict";

function OnEditLogic() {
	$("li:has(:contains('Скрытые поля'))").hide();
}

function OnViewLogic() {
	$("li:has(:contains('Маршруты '))").hide();
}

scopes.onRegister(OnEditLogic);

scopes.onEdit(OnEditLogic);

scopes.onView(OnViewLogic);