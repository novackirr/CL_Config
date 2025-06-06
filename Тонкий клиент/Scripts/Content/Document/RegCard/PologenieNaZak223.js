"use strict";

function showRequisite(nameTag, editname, valempty = false, requiredRequisite = false){
	$(`${nameTag}[name=${editname}]`).closest(".column-container").show()
	$(`[data-related-field=${editname}`).show()
	if(requiredRequisite == true){
		$(`${nameTag}[name=${editname}]`).prop("required", true)
		$(`${nameTag}[name=${editname}]`).closest(".column-container").find(".documentView-field-label").addClass("label-required")
		$(`[data-related-field=${editname}]`).addClass("label-required")
	}
	if(valempty == true){
		$(`${nameTag}[name=${editname}]`).val("")
	}
}//функция отображения реквизита и его лейбла в режиме редактирования

function hideRequisite(nameTag, editname, valempty = false){
	$(`${nameTag}[name=${editname}]`).closest(".column-container").hide()
	$(`[data-related-field=${editname}`).hide()
	$(`${nameTag}[name=${editname}]`).prop("required", false)
	$(`${nameTag}[name=${editname}]`).closest(".column-container").find(".documentView-field-label").removeClass("label-required")
	$(`[data-related-field=${editname}]`).removeClass("label-required")
	$(`${nameTag}[name=${editname}]`).closest(".clearfix").removeClass("label-required");
	if(valempty == true){
		$(`${nameTag}[name=${editname}]`).val("")
	}
}//функция скрытия реквизита и его лейбла в режиме редактирования

var editreg = function () {
	$("li:has(:contains('Скрытые поля'))").hide()
	$("li:has(:contains('Маршруты'))").hide()
	var count = $("div[data-name='OsnOneWinner'] div[data-rowkey]").length
	if (count < 1) {
		$("div[data-name='OsnOneWinner'] div.table-row-actions-left .table-add-row-button").click()
	}
}

var view = function () {
	$("li:has(:contains('Маршруты'))").hide();
	function hidefield(field) {
		if (field.text() == " " || field.text() == "") {
			field.closest(".column-container").hide()
		}
	};
	hidefield($("div .documentView-field-value[data-name='Порядок заключения и исполнения договоров']"));
	hidefield($("div .documentView-field-value[data-name='Дополнительные сведения']"));
	hidefield($("div .documentView-field-value[data-name='Обоснование внесения изменений']"));
}

//Использовать положение другой организации, редактирование
var Drorg = function () {
		var Ispdrpol = $("input[name='Ispdrpol']"); //Используется положение другой организации
		var table = $("div[data-name='Spzak']");//Способы_закупок

		Ispdrpol.change(function() {
            if ($(Ispdrpol).is(":checked")) {
				showRequisite("textarea", "Osnpris", false, false )//Основание_присоединения_к_положению_другой_организации
            } else {
				hideRequisite("textarea", "Osnpris", true )
            }
       });
	Ispdrpol.change();
}
//ручной ввод способов закупки
var armSposob = function () {
	var armSposob = $("input[name='armSposob']"); //Используется положение другой организации
	var table = $("div[data-name='Spzak']");//Способы_закупок
	table.hide();

	armSposob.change(function() {
		if ($(armSposob).is(":checked")) {
			table.show();
			var count = $("div[data-name='Spzak'] div[data-rowkey]").length
			if (count < 1) {
					$("div[data-name='Spzak'] div.table-row-actions-left .table-add-row-button").click()
			}
			hideRequisite("input", "reestnumber", true )
			hideRequisite("input", "dateraz", true )
		} else {
			var rows = $("div[data-name=Spzak] [data-rowkey]");
			var status = $("input[name='regstatus']").val();
			
			// rows.each(function (index, element) {
			// 	removeTableRow(element);
			// });
			table.hide();
			showRequisite("input", "reestnumber", false, true )
			showRequisite("input", "dateraz", false, true )
			
		}
   });
   armSposob.change();
}

scopes.onView(view);
 
scopes.onRegister(Drorg);
scopes.onRegister(editreg);
scopes.onRegister(armSposob);

scopes.onEdit(armSposob);
scopes.onEdit(Drorg);
scopes.onEdit(editreg);