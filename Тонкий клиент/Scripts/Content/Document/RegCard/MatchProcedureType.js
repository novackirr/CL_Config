"use strict";

function OnEditLogic() {
	$("li:has(:contains('Скрытые поля'))").hide();
	$("button[id='naimETP']").prop('disabled', true)
}

function OnViewLogic() {
	$("li:has(:contains('Маршруты '))").hide();
}

scopes.onRegister(OnEditLogic);

scopes.onEdit(OnEditLogic);

scopes.onView(OnViewLogic);