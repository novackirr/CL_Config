$(document).ready(function () {	
	var dicName = "Требуемые документы",
	fields = ["Требуемые документы", "Наименование"];
	getDictionaryItems(dicName, "", "", 1, fields, function (data) {
		var l = data.children.length;
		var num = l+1;
		$("input[name='code']").val(num);
	})
});