var editreg = function() {     
	$("li:has(:contains('Тип запроса'))").find("a").click();
	$("li:has(:contains('Скрытые поля'))").hide();	
	$("li:has(:contains('Ответ'))").hide();	
	$("input[data-field-name='CountryCodeTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CountryCodeTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='CityCodeTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CityCodeTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='Tel']").inputmask({ mask: '9{1,8}', greedy: false });
	$("input[data-field-name='Tel']").attr("data-parsley-pattern", "\\d{1,8}");
	$("input[data-field-name='AdditionalTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='AdditionalTel']").attr("data-parsley-pattern", "\\d{1,4}");
}

var hideReqType = function() {
	var flag = $("input[name='reqType']");
	if (flag.val() == "Запрос контрагентам по почте") {
		$("li:has(:contains('Запрос на ЭТП'))").hide();	
		$("li:has(:contains('Запрос контрагентам по почте'))").show();
		$("input[data-field-name='orgpost2']").prop("required", true);
		$("input[data-field-name='executionDate']").prop("required", true);
		$("textarea[data-field-name='request']").prop("required", true);
		$("input[data-field-name='dateokonpod']").prop("required", false);
		$("textarea[data-field-name='mestorasmpredl']").prop("required", false);
		$("textarea[data-field-name='registerNaimDogov']").prop("required", false);
		$("input[data-field-name='plandaterazm']").prop("required", false);
		
	} else {
		$("li:has(:contains('Запрос на ЭТП'))").show();	
		$("li:has(:contains('Запрос контрагентам по почте'))").hide();
		$("input[data-field-name='orgpost2']").prop("required", false);
		$("input[data-field-name='executionDate']").prop("required", false);
		$("textarea[data-field-name='request']").prop("required", false);
		$("input[data-field-name='dateokonpod']").prop("required", true);
		$("textarea[data-field-name='mestorasmpredl']").prop("required", true);
		$("textarea[data-field-name='registerNaimDogov']").prop("required", true);
		$("input[data-field-name='plandaterazm']").prop("required", true);
		
	}
	if (flag.val() == "Запрос на ЭТП с рассылкой приглашений") {
		$("li:has(:contains('Запрос на ЭТП'))").show();	
		$("li:has(:contains('Запрос контрагентам по почте'))").show();
		$("input[data-field-name='orgpost2']").prop("required", true);
		$("input[data-field-name='executionDate']").prop("required", true);
		$("textarea[data-field-name='request']").prop("required", true);
		$("input[data-field-name='dateokonpod']").prop("required", true);
		$("textarea[data-field-name='mestorasmpredl']").prop("required", true);
		$("textarea[data-field-name='registerNaimDogov']").prop("required", true);
		$("input[data-field-name='plandaterazm']").prop("required", true);
	}

	if (flag.val() == "") {
		$("li:has(:contains('Запрос на ЭТП'))").hide();	
		$("li:has(:contains('Запрос контрагентам по почте'))").hide();
	}
}

$(document).on('change', "input[name='reqType']", function (e) {
	hideReqType();
});

var hideReqTypeView = function() {
	var type = $(".documentView-field-value[data-name='Тип запроса']").text().toLowerCase();
	if (!~type.indexOf('этп')) {
		
		$("li:has(:contains('Запрос на ЭТП'))").hide();	
		$("li:has(:contains('Запрос контрагентам по почте'))").show();
	} else {
		$("li:has(:contains('Запрос на ЭТП'))").show();	
		$("li:has(:contains('Запрос контрагентам по почте'))").hide();
	}
	if (~type.indexOf('рассылк')) {
		$("li:has(:contains('Запрос на ЭТП'))").show();	
		$("li:has(:contains('Запрос контрагентам по почте'))").show();
	}
}

var Svedcen = function() {
	
	var flag = $("input[name='Kodcen']").val();
	
        if (flag=='2') {
			$("input[data-field-name='formula']").closest(".column-container").show();
			$("[data-related-field=formula]").closest(".column-container").show();
			$("input[data-field-name='formula']").prop("required", true);
			$("[data-related-field=formula]").addClass("label-required");
			$("input[name='cened']").autoNumeric('wipe');
			$("input[data-field-name='cened']").closest(".column-container").hide();
			$("[data-related-field=cened]").closest(".column-container").hide();
			$("input[data-field-name='cened']").prop("required", false);
			$("[data-related-field=cened]").removeClass("label-required");
		}
		else if (flag=='3') {
			$("input[data-field-name='cened']").closest(".column-container").show();
			$("[data-related-field=cened]").closest(".column-container").show();
			$("input[data-field-name='cened']").prop("required", true);
			$("[data-related-field=cened]").addClass("label-required");
			$("input[name='formula']").val('');
			$("input[data-field-name='formula']").closest(".column-container").hide();
			$("[data-related-field=formula]").closest(".column-container").hide();
			$("input[data-field-name='formula']").prop("required", false);
			$("[data-related-field=formula]").removeClass("label-required");
		}
		else {
			$("input[name='formula']").val('');
			$("input[name='cened']").autoNumeric('wipe');
			$("input[data-field-name='formula']").prop("required", false);
			$("[data-related-field=formula]").removeClass("label-required");
			$("input[data-field-name='cened']").prop("required", false);
			$("[data-related-field=cened]").removeClass("label-required");
			$("input[data-field-name='cened']").closest(".column-container").hide();
			$("input[data-field-name='formula']").closest(".column-container").hide();
			$("[data-related-field=formula]").closest(".column-container").hide();
			$("[data-related-field=cened]").closest(".column-container").hide();
		}

}

$(document).on('change', "input[data-field-name='Kodcen']", function (e) {
	Svedcen();
});

var SvedcennView = function () {
	var flag=$(".documentView-field-value[data-name='Сведения о начальной (максимальной) цене договора (цене заявки)']").attr("title");
	 if (flag=="Формула цены и максимальное значение цены договора (цены лота)") {	
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").closest(".column-container").show();
		$("div[data-name='Цена единицы товара, работы, услуги и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide(); 	
	 } 
	 else if(flag=="Цена единицы товара, работы, услуги и максимальное значение цены договора (цены лота)") {
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
		$("div[data-name='Цена единицы товара, работы, услуги и максимальное значение цены договора (цены заявки)']").closest(".column-container").show(); 	
	 }
	 else {
		 $("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
		$("div[data-name='Цена единицы товара, работы, услуги и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
	 }
}

var Summa = function (current) {
	var row = $(current).closest(".table-edit-row");
	var id =  $(row).attr("data-rowkey");

	var sum = 0;
	var elem1 = $(row).find("input[data-field-name='ItemTab-registerCount-" + id + "']")
	var elem2 = $(row).find("input[data-field-name='ItemTab-PozPrice-" + id + "']")

	if ($(elem1).length || $(elem2).length) {
        var val1 =  elem1.autoNumeric('get')
		var val2 =  elem2.autoNumeric('get')
		$("input[name='ItemTab-PozSum-" + id + "']").autoNumeric('set' , parseFloat(val1)*parseFloat(val2));
		$("input[name='ItemTab-PozSum-" + id + "']").change();
	}

} 

$("div[data-name='ItemTab']").on('change', "input[data-field-name^='ItemTab-NevCol-']", function () {

	var current = $(this);

	var row = current.closest(".table-edit-row");
	var id = row.attr("data-rowkey");

	if (id != undefined) {
		if (current.is(":checked")) {
			$("input[name='ItemTab-registerCount-" + id + "']").autoNumeric('set', '1.00000');
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").val("Условная единица");
			$("input[name='ItemTab-Ed_izmName-" + id + "']").val("Условная единица");
			$("input[name='ItemTab-Ed_izm-" + id + "']").val("876");
			$("input[data-parent-name='ItemTab-Ed_izm-" + id + "parent']").val("52075");
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").parent().children(".input-group-btn").children().prop('disabled', true);
			$("input[name='ItemTab-registerCount-" + id + "']").prop('readonly', true)
		} else {
			$("input[name='ItemTab-registerCount-" + id + "']").autoNumeric('set', '0.00000');
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").val("");
			$("input[name='ItemTab-Ed_izm-" + id + "']").val("");
			$("input[name='ItemTab-Ed_izmName-" + id + "']").val("");
			$("input[data-field-name='ItemTab-Ed_izm-" + id + "']").parent().children(".input-group-btn").children().prop('disabled', false);
			$("input[data-parent-name='ItemTab-Ed_izm-" + id + "parent']").val("");
			$("input[name='ItemTab-registerCount-" + id + "']").prop('readonly', false)
		}
	}  
	Summa(this);
	SumNMC.CalculateSumma(this);
	PriceRub.CalculateSumma(this);

});

var SumNMC = {
	CalculateSumma: function (obj) {
		var table = $("div[data-name='ItemTab']");
		var nmc = 0;
		table.find("div.table-edit-row").each(function () {
			var id = $(this).attr("data-rowkey");
			var elem1 = $(this).find("input[data-field-name='ItemTab-PozSum-" + id + "']")

			if ($(elem1).length) {
				var s1 = elem1.autoNumeric('get');

				nmc = parseFloat(nmc) + parseFloat(s1);;

			}
		});
		$("input[name='registerNMCS']").autoNumeric('set', nmc);
		$("input[name='SummaBudg']").autoNumeric('set', nmc);
		$("input[name='registerNMCS']").change();
		$("input[name='registerNMCScopy']").autoNumeric('set', nmc);
		$("input[name='registerNMCScopy']").change();

		if (($("input[name='registerNMCS']").val() == 0) || ($("input[name='registerNMCS']").val() == 0.00)) {
			$("input[name='registerNMCS']").val("");
			$("input[name='registerNMCScopy']").val("");
		}
	}
}
	
$(document).on('change', "input[data-field-name='curs']", function (e) {
	PriceRub.CalculateSumma(this);
	AlloplataSMPinrub();
	Alloplatainrub();
});

$(document).on('change', "input[data-field-name='registerNMCS']", function (e) {		
	PriceRub.CalculateSumma(this);	
});

 
 $(document).on('change', "input[data-field-name*='ItemTab-registerCount']", function (e) {
	var current = $(this);
	Summa(current);
	SumNMC.CalculateSumma(this);
	/* NMC.CalculateNMC(this); */
	PriceRub.CalculateSumma(this);
});

$(document).on('change', "input[data-field-name*='ItemTab-PozPrice']", function (e) {
	var current = $(this);
	Summa(current);
	SumNMC.CalculateSumma(this);
	/* NMC.CalculateNMC(this); */
	PriceRub.CalculateSumma(this);
});

var rebuildFieldPhone = function () {
	/* var CountryCodeTel = $("input[data-field-name='CountryCodeTel']");
	var CityCodeTel = $("input[data-field-name='CityCodeTel']");
	var Tel = $("input[data-field-name='Tel']");
	var AdditionalTel = $("input[data-field-name='AdditionalTel']");
	var kontTel = $("input[data-field-name='kontTel']");
	var kontTelETP = $("input[data-field-name='kontTelETP']");
        var result = [];
		var resultETP = [];

        if (CountryCodeTel.val()) {
            result.push("" + CountryCodeTel.val());
			resultETP.push("" + CountryCodeTel.val());
        }
		
		if (CityCodeTel.val()) {
            result.push("-" + CityCodeTel.val());
			resultETP.push("-" + CityCodeTel.val());
        }
		
		if (Tel.val()) {
            result.push("-" + Tel.val());
			resultETP.push("-" + Tel.val());
        }
		
		if (AdditionalTel.val()) {
            result.push("-" + AdditionalTel.val());
        }
		
        kontTel.val(result.join(""));
		kontTelETP.val(resultETP.join("")); */
    }
	
	/* $(document).on('change', "input[data-field-name='CountryCodeTel']", function (e) {	
		rebuildFieldPhone()
	});
	
	$(document).on('change', "input[data-field-name='CityCodeTel']", function (e) {	
		rebuildFieldPhone()
	});
	
	$(document).on('change', "input[data-field-name='Tel']", function (e) {	
	rebuildFieldPhone();	
	});
	
	$(document).on('change', "input[data-field-name='AdditionalTel']", function (e) {	
	rebuildFieldPhone();	
	}); */

var splitPhone = function () {
	var CountryCodeTel = $("input[data-field-name='CountryCodeTel']");
	var CityCodeTel = $("input[data-field-name='CityCodeTel']");
	var Tel = $("input[data-field-name='Tel']");
	var AdditionalTel = $("input[data-field-name='AdditionalTel']");
	var kontTel = $("input[data-field-name='kontTel']");
	var kontTelETP = $("input[data-field-name='kontTelETP']");
	
	if (kontTel.val()!="") {
	var array = $("input[data-field-name='kontTel']").val().split('-');
	
	if (array[0]!=undefined) {
	CountryCodeTel.val(array[0]);
	}
	if (array[1]!=undefined) {
	CityCodeTel.val(array[1]);
	}
	if (array[2]!=undefined) {
    Tel.val(array[2]);
	}
	if (array[3]!=undefined) {
	AdditionalTel.val(array[3]);
	}
	}
	}

var procedureLinkView = function () {
	var flag=$(".documentView-field-value[data-name='Ссылка на процедуру']").attr("title");
	if (flag) {
		$(".documentView-field-value[data-name='Ссылка на процедуру']").text("https://dev-vtb.roseltorg.ru/#com/procedure/edit/id/" + flag);
	}
}

scopes.onRegisterTemp(editreg);
scopes.onRegister(hideReqType);
scopes.onRegister(Svedcen);
scopes.onRegister(splitPhone);
scopes.onRegister(rebuildFieldPhone);

scopes.onEdit(editreg);
scopes.onEdit(hideReqType);
scopes.onEdit(Svedcen);
scopes.onEdit(rebuildFieldPhone);
scopes.onEdit(splitPhone);

scopes.onView(hideReqTypeView);
scopes.onView(SvedcennView);
scopes.onView(procedureLinkView);