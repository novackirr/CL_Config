var EditReg = function() {     
	$("li:has(:contains('Скрытые поля'))").hide();	
	$("li:has(:contains('Присоединенные файлы'))").hide();	
	$("input[data-field-name='registerOrgZa']").parent().children(".input-group-btn").children().prop('disabled', true);
};
$("div[data-name='PositionsTRY']").on('onTableRowRemoved', function (rowKey) {
	TableNum1();
});

$("div[data-name='PositionsTRY'] .table-add-row-button").click(function () {
	TableNum1();
});

var TableNum1 = function () {
	var table = $("input[data-field-name*='PositionsTRY-NumPos']").closest("div.table-content");
	var num = 0;
	table.find("div.table-edit-row").each(function () {
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='PositionsTRY-NumPos-" + id + "']").val(num)
		}
	});
}




scopes.onView(EditReg);
//scopes.onRegister(GRBS_edit);
scopes.onRegister(EditReg);
/*scopes.onRegister(SetSubOrg);
scopes.onRegister(SetSetSubOrg);

scopes.onEdit(GRBS_edit); */
scopes.onEdit(EditReg); 
/*scopes.onEdit(SetSubOrg);
scopes.onEdit(SetSetSubOrg);*/
