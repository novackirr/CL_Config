function commonFunc() {
	$("input[data-field-name='naimETP']").hide()
	$("input[data-field-name='formTorgCode']").hide()
	$("button[id='Kodcen']").attr('disabled', true);
}
commonFunc()

function checkkrit() {
	let krit = $("input[name='krit']");
	krit.prop('checked', false);
}
checkkrit();

$("input[data-field-name='NMK']").hide();
$("[data-related-field=NMK]").hide();
$("input[data-field-name='cened']").hide();
$("[data-related-field=cened]").hide();

$("input[data-field-name='cened']").closest(".column-container.col-xs-4").removeClass("col-xs-4").addClass("col-xs-6")
$("input[data-field-name='NMK']").closest(".column-container.col-xs-4").removeClass("col-xs-4").addClass("col-xs-6")

var Svedcen = function() { 
	let naimETP = $("input[name='naimETP']").val();
	var Table = $("div[data-name='ItemTab']");
	Table.find('.table-add-row-button').closest('.table-edit-column').hide();
	Table.find('.table-remove-row-button').closest('.table-edit-column').hide();
	if (naimETP == 'АО "ЕЭТП"' || naimETP == 'АО "МСП-ЕЭТП"'){ 
		$("input[data-field-name='NMK']").prop("required", false);
		$("input[data-field-name='NMK']").prop("readonly", false);
		$("[data-related-field=NMK]").removeClass("label-required");
		$("input[data-field-name='NMK']").closest(".row-container").hide()
		$("input[data-field-name='NMK']").closest(".column-container").hide()
		$("input[data-field-name='NMK']").hide();
		$("[data-related-field=NMK]").hide();
				
		$("input[data-field-name='cened']").closest(".row-container").show()
		$("input[data-field-name='cened']").closest(".column-container").show()
		$("input[data-field-name='cened']").show();
		$("[data-related-field=cened]").show();
		$("input[data-field-name='cened']").prop("required", true);
		/* $("input[data-field-name='cened']").prop("readonly", false); */
		$("[data-related-field=cened]").addClass("label-required");
	}
	else{	
		$("input[data-field-name='cened']").prop("required", false);
		$("input[data-field-name='cened']").prop("readonly", false);
		$("[data-related-field=cened]").removeClass("label-required");
		$("input[data-field-name='cened']").closest(".row-container").hide()
		$("input[data-field-name='cened']").closest(".column-container").hide()
		$("input[data-field-name='cened']").hide();
		$("[data-related-field=cened]").hide();
				
		$("input[data-field-name='NMK']").closest(".row-container").show()
		$("input[data-field-name='NMK']").closest(".column-container").show()
		$("input[data-field-name='NMK']").show();
		$("[data-related-field=NMK]").show();
		$("input[data-field-name='NMK']").prop("required", true);
		$("input[data-field-name='NMK']").prop("readonly", true);
		$("[data-related-field=NMK]").addClass("label-required");
	}	
	$("input[data-field-name='TorgEd']").closest(".column-container").show();
	$("[data-related-field=TorgEd]").closest(".column-container").show();
	$("input[name='TorgEd']").prop('checked', true);
	$("input[name='formula']").val('');
	$("textarea[data-field-name='formula']").hide();
	$("[data-related-field=formula]").hide();
	$("textarea[data-field-name='formula']").prop("required", false);
	$("[data-related-field=formula]").removeClass("label-required");
	$("textarea[data-field-name='formula']").closest(".column-container").hide();
	Table.closest('.row-container').show();
	Table.find("[data-rowkey]").find(".table-edit-columns").css("cssText", "margin-right: 0px; padding-right: 0px") // обнуляю отступы у строки
	Table.closest('.table-edit-wrapper').css("cssText", "padding-bottom: 0px;") // обнуляю отступы у таблицы
	Table.css("overflow","hidden"); // Убираю скролл у таблицы
	$("input[data-field-name*='ItemTab-priceTaxTRU-']").prop("required", true);
	initAutonumeric(); // вызов Autonumeric перед расчетами
	CalculatePosition();
}

Svedcen();

	function CalculatePosition() {
		var sum;
		var naimETP = $("input[name='naimETP']").val();
		var Table = $("div[data-name='ItemTab']");
		Table.find("div[data-rowkey]").each(function() {
			var element = $(this).find("input[data-field-name*='ItemTab-priceTaxTRU-']");
			if (element.val()) {
				sum = parseFloat(sum ? sum : 0) + parseFloat(element.autoNumeric('get'));
			}
		})	
		if (naimETP == 'АО "МСП-ЕЭТП"' || naimETP == 'АО "ЕЭТП"') {
			$("input[name='cened']").autoNumeric('wipe');
			$("input[name='cened']").autoNumeric('set', parseFloat(sum ? sum : 0));
			$("input[name='NMK']").autoNumeric('set', parseFloat(sum ? sum : 0)); // Заполняю, чтобы было заполнено если поменяли на РТ секцию. В Выгрузке не участвует
		} else if (naimETP == 'АО "РТ-ЕЭТП"') {
			$("input[name='NMK']").autoNumeric('wipe');
			$("input[name='NMK']").autoNumeric('set', parseFloat(sum ? sum : 0));
			$("input[name='cened']").autoNumeric('set', parseFloat(sum ? sum : 0)); // Заполняю, чтобы было заполнено если поменяли с РТ секции на другую. В Выгрузке не участвует
		}
	}
	
$(document).on('change', "input[data-field-name*='ItemTab-priceTaxTRU-']", function (e) {
	CalculatePosition();
});