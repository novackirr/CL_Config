
$(document).ready(function() {
	$("input[name='Popozition']").prop('checked', true);
	$("input[name='Popozition']").val('1');
	var table = $("div[data-name='ItemTab']");
	table.find("[class*='table-row-actions-']").hide();
	table.find('.right-actions-offset').css('margin-right', '0');
	table.find('.right-actions-offset').css('padding-right', '0');
	noPriceForEdit();
	// вызов функции при изменении цены без НДС
	$("input[data-field-name*='ItemTab-priceTaxNoNDS-']").on('change', function(){
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		var NDS = $("input[data-field-name='ItemTab-NDS-" + id + "']").val();
		var priceTaxNoNDS = $("input[data-field-name='ItemTab-priceTaxNoNDS-" + id + "']").val();
		var registerCount = $("input[data-field-name='ItemTab-registerCount-" + id + "']").val();
		registerCount = registerCount.replace(/\s/g, '')
		registerCount = parseFloat(registerCount)
		var finalPriceTaxNoNDS = $("input[data-field-name='ItemTab-finalPriceTaxNoNDS-" + id + "']");
		var finalPriceTaxWithNDS = $("input[data-field-name='ItemTab-finalPriceTaxWithNDS-" + id + "']");
		var priceTaxWithNDS = $("input[data-field-name='ItemTab-priceTaxWithNDS-" + id + "']")
		if (NDS!='' && priceTaxNoNDS!=''){
			NDS = NDS.replace(/\s/g, '')
			NDS = parseFloat(NDS)
			priceTaxNoNDS = priceTaxNoNDS.replace(/\s/g, '')
			priceTaxNoNDS = parseFloat(priceTaxNoNDS)
			var sum = priceTaxNoNDS * ((100 + NDS) / 100);
			priceTaxWithNDS.autoNumeric('set', sum)
			finalPriceTaxNoNDS.autoNumeric('set', priceTaxNoNDS * registerCount)
			finalPriceTaxWithNDS.autoNumeric('set', sum * registerCount)
		}
	})
	// вызов функции при изменении НДС
	$("input[data-field-name*='ItemTab-NDS-']").on('change', function(){
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		var NDS = $("input[data-field-name='ItemTab-NDS-" + id + "']").val();
		var priceTaxNoNDS = $("input[data-field-name='ItemTab-priceTaxNoNDS-" + id + "']").val();
		var registerCount = $("input[data-field-name='ItemTab-registerCount-" + id + "']").val();
		registerCount = registerCount.replace(/\s/g, '')
		registerCount = parseFloat(registerCount)
		var finalPriceTaxNoNDS = $("input[data-field-name='ItemTab-finalPriceTaxNoNDS-" + id + "']");
		var finalPriceTaxWithNDS = $("input[data-field-name='ItemTab-finalPriceTaxWithNDS-" + id + "']");
		var priceTaxWithNDS = $("input[data-field-name='ItemTab-priceTaxWithNDS-" + id + "']")
		if (NDS!='' && priceTaxNoNDS!=''){
			NDS = NDS.replace(/\s/g, '')
			NDS = parseFloat(NDS)
			priceTaxNoNDS = priceTaxNoNDS.replace(/\s/g, '')
			priceTaxNoNDS = parseFloat(priceTaxNoNDS)
			if (NDS > 20) {
				showCommonErrors("Процент НДС не может быть больше 20");
				$("input[data-field-name='ItemTab-NDS-" + id + "']").clear();
			}
			else{
				var sum = priceTaxNoNDS * ((100 + NDS) / 100);
				priceTaxWithNDS.autoNumeric('set', sum)
				finalPriceTaxNoNDS.autoNumeric('set', priceTaxNoNDS * registerCount)
				finalPriceTaxWithNDS.autoNumeric('set', sum * registerCount)
			}
		}
	})
	$("input[data-field-name*='ItemTab-noPrice-']").on('change', function(){
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		var noPrice = $("input[data-field-name='ItemTab-noPrice-" + id + "']")
		var NDS = $("input[data-field-name='ItemTab-NDS-" + id + "']")
		var priceTaxNoNDS = $("input[data-field-name='ItemTab-priceTaxNoNDS-" + id + "']")
		var finalPriceTaxNoNDS = $("input[data-field-name='ItemTab-finalPriceTaxNoNDS-" + id + "']");
		var finalPriceTaxWithNDS = $("input[data-field-name='ItemTab-finalPriceTaxWithNDS-" + id + "']");
		var priceTaxWithNDS = $("input[data-field-name='ItemTab-priceTaxWithNDS-" + id + "']")
		if ($(noPrice).is(":checked")){
			NDS.autoNumeric('wipe')
			NDS.prop("readonly", true);
			NDS.prop("required", false);
			priceTaxNoNDS.autoNumeric('wipe')
			priceTaxNoNDS.prop("readonly", true);
			priceTaxNoNDS.prop("required", false);
			finalPriceTaxNoNDS.autoNumeric('wipe')
			finalPriceTaxNoNDS.prop("required", false);
			finalPriceTaxWithNDS.autoNumeric('wipe')
			finalPriceTaxWithNDS.prop("required", false);
			priceTaxWithNDS.autoNumeric('wipe')
			priceTaxWithNDS.prop("required", false);
		}
		else{
			NDS.prop("readonly", false);
			NDS.prop("required", true);
			priceTaxNoNDS.prop("readonly", false);
			priceTaxNoNDS.prop("required", true);
			finalPriceTaxNoNDS.prop("required", true);
			finalPriceTaxWithNDS.prop("required", true);
			priceTaxWithNDS.prop("required", true);
		}
	})
}())

 function noPriceForEdit() {
	var Table = $("div[data-name='ItemTab']").find('[data-rowkey]');
	 Table.each(function(i, elem) {
		var noPrice = $(elem).find("input[data-field-name*='ItemTab-noPrice-']");
		var NDS = $(elem).find("input[data-field-name*='ItemTab-NDS-']");
		var priceTaxNoNDS = $(elem).find("input[data-field-name*='ItemTab-priceTaxNoNDS-']");
		var finalPriceTaxNoNDS = $(elem).find("input[data-field-name*='ItemTab-finalPriceTaxNoNDS-']");
		var finalPriceTaxWithNDS = $(elem).find("input[data-field-name*='ItemTab-finalPriceTaxWithNDS-']");
		var priceTaxWithNDS = $(elem).find("input[data-field-name*='ItemTab-priceTaxWithNDS-']");
		if ($(noPrice).is(":checked")){
			NDS.prop("readonly", true);
			NDS.prop("required", false);
			priceTaxNoNDS.prop("readonly", true);
			priceTaxNoNDS.prop("required", false);
			finalPriceTaxNoNDS.prop("required", false);
			finalPriceTaxWithNDS.prop("required", false);
			priceTaxWithNDS.prop("required", false);
		}
		else{
			NDS.prop("readonly", false);
			NDS.prop("required", true);
			priceTaxNoNDS.prop("readonly", false);
			priceTaxNoNDS.prop("required", true);
			finalPriceTaxNoNDS.prop("required", true);
			finalPriceTaxWithNDS.prop("required", true);
			priceTaxWithNDS.prop("required", true);
		}
		})
 }
