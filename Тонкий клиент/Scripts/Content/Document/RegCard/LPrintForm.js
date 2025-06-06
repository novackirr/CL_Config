var EditReg = function() {
	$("li:has(:contains('Скрытые поля'))").hide();
};

var view = function () {
	$("li:has(:contains('Маршруты'))").hide();
};

// меняем разметку для Дата создания и Организация-заказчик
var edit_display = function () {
	var DateCreate = $("input[name='DateCreate']");
	var flowName = $("select[name='flowName']");
	
	$("[data-related-field=DateCreate]").closest(".column-container").attr('class','col-xs-5 column-container');
	DateCreate.closest(".column-container").attr('class','col-xs-5 column-container');
	$("[data-related-field=flowName]").closest(".column-container").attr('class','col-xs-7 column-container');
	flowName.closest(".column-container").attr('class','col-xs-7 column-container');
};

scopes.onView(view);

scopes.onRegister(EditReg);
scopes.onRegister(edit_display);

scopes.onEdit(EditReg);
scopes.onEdit(edit_display);
