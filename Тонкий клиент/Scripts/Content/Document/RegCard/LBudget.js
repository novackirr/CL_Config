"use strict";
var EditReg = function () {
	$("li:has(:contains('Скрытые поля'))").hide();
}

var addCalculationHandlers = function () {
	var table = $("div[data-name='ist_fin']");
	$.merge(getInputs(table, /ist_fin-limit-\d+/), getInputs(table, /ist_fin-plan-\d+/)).each(function (index) {
		var item = $(this);
		$(this).on('paste input change propertychange', function () {
			var input = $(this);
			calculate(input);
		});
	});

	function calculate(input) {
		var inputName = input.attr('name');
		var rowkey = inputName.substring(inputName.lastIndexOf('-') + 1, inputName.lenght);

		var totalSumElem = "div[data-name='ist_fin'] input[name=ist_fin-ostatok-" + rowkey + "]";
		var price = "div[data-name='ist_fin'] input[name=ist_fin-limit-" + rowkey + "]";
		var col = "div[data-name='ist_fin'] input[name=ist_fin-plan-" + rowkey + "]";

		$(totalSumElem).autoNumeric('set', ((parseFloat($(price).autoNumeric('get')) || 1) - (parseFloat($(col).val()) || 1)));
	}

	getInputs(table, /ist_fin-ostatok-\d+/).each(function (index) {
		$(this).on('paste input change propertychange', function () {
			var sum = 0;
			getInputs(table, /ist_fin-ostatok-\d+/).each(function (index) {
				sum = sum + (parseFloat($(this).autoNumeric('get')) || 0);
			});
			$("input[name='registerNMCS']").autoNumeric('set', sum);
		});
	});

	function getInputs(table, pattern) {
		return table.find('.form-control').filter(function (index) {
			var name = $(this).attr("name");
			return pattern.test(name);
		});
	}
	
	function getInputsByName(table, name) {
		return table.find('.form-control').filter(function (index) {
			var inputName = $(this).attr("name");
			return inputName == name;
		});
	}

	$(table).on('onTableRowAdded', function (ev, rowKey) {
		
		var elems = [$("input[name=" + "ist_fin-limit-" + rowKey + "]"), $("input[name=" + "ist_fin-plan-" + rowKey + "]")];
		
		$(elems).each(function (index) {
		var item = $(this);
		$(this).on('paste input change propertychange', function () {
			var input = $(this);
			calculate(input);
		});
	});
	});

}

scopes.onRegister(EditReg);
scopes.onRegister(addCalculationHandlers);

scopes.onEdit(EditReg);
scopes.onEdit(addCalculationHandlers);
