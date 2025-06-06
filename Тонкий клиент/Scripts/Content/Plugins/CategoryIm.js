
$(document).ready(function() {
	$("input[name='KatIm']").prop('checked', true);
	$("input[name='KatIm']").val('1');
	var table = $("div[data-name='ItemTab']");
	table.find("[class*='table-row-actions-']").hide();
	table.find('.right-actions-offset').css('margin-right', '0');
	table.find('.right-actions-offset').css('padding-right', '0');
}())