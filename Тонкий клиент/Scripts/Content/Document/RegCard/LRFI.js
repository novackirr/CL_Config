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
	/* $("div[data-name='ItemTab']").find(".table-add-row-button").closest(".table-edit-column").hide();
	$("div[data-name='ItemTab']").find(".table-remove-row-button").closest(".table-edit-column").hide(); */
	$("input[name='kontTel']").inputmask({"mask": "+9{1,5}(9{1,6})9{5,12}"});
}

var editView = function() {	

}

var hideReqType = function() {
	var flag = $("input[name='reqType']");
	if (flag.val() == "Запрос контрагентам по почте") {
		$("li:has(:contains('Запрос на ЭТП'))").hide();	
		$("li:has(:contains('Запрос контрагентам по почте'))").show();
	} else {
		$("li:has(:contains('Запрос на ЭТП'))").show();	
		$("li:has(:contains('Запрос контрагентам по почте'))").hide();
	}
}

var hideReqTypeView = function() {
	var type = $(".documentView-field-value[data-name='Тип запроса']").text().toLowerCase();
	if (!~type.indexOf('этп')) {
		
		$("li:has(:contains('Запрос на ЭТП'))").hide();	
		$("li:has(:contains('Запрос контрагентам по почте'))").show();
	} else {
		$("li:has(:contains('Запрос на ЭТП'))").show();	
		$("li:has(:contains('Запрос контрагентам по почте'))").hide();
	}
}

var Svedcen = function () {

	var flag = $("input[name='Kodcen']").val();

	if (flag == '2') {
		$("input[data-field-name='formula']").closest(".column-container").show();
		$("[data-related-field=formula]").closest(".column-container").show();
		$("input[data-field-name='formula']").prop("required", true);
		$("[data-related-field=formula]").addClass("label-required");
		$("input[name='cened']").autoNumeric('wipe');
		$("input[data-field-name='cened']").closest(".column-container").hide();
		$("[data-related-field=cened]").closest(".column-container").hide();
		$("input[data-field-name='cened']").prop("required", false);
		$("[data-related-field=cened]").removeClass("label-required");
		$("[data-related-field=Currency_kod_kit]").closest(".column-container").hide();
	}
	else if (flag == '3') {
		$("input[data-field-name='cened']").closest(".column-container").show();
		$("[data-related-field=cened]").closest(".column-container").show();
		$("input[data-field-name='cened']").prop("required", true);
		$("[data-related-field=cened]").addClass("label-required");
		$("input[name='formula']").val('');
		$("input[data-field-name='formula']").closest(".column-container").hide();
		$("[data-related-field=formula]").closest(".column-container").hide();
		$("input[data-field-name='formula']").prop("required", false);
		$("[data-related-field=formula]").removeClass("label-required");
		$("[data-related-field=Currency_kod_kit]").closest(".column-container").show();
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
		$("[data-related-field=Currency_kod_kit]").closest(".column-container").hide();
	}
}

$(document).on('change', "input[data-field-name='Kodcen']", function (e) {
	Svedcen();
});

function SvedcennView() {
	var flag = $(".documentView-field-value[data-name='Сведения о цене").attr("title");
	if (flag == "Формула цены и максимальное значение цены договора (цены лота)") {
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").closest(".column-container").show();
		$("div[data-name='Цена единицы товара, работы, услуги и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
		$("div[data-name='Валюта комплекта']").closest(".column-container").hide();
		$("div[data-name='Начальная цена комплекта без НДС']").closest(".column-container").hide();
	}
	else if (flag == "Цена единицы товара, работы, услуги и максимальное значение цены договора (цены лота)") {
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
		$("div[data-name='Цена единицы товара, работы, услуги и максимальное значение цены договора (цены заявки)']").closest(".column-container").show();
		$("div[data-name='Валюта комплекта']").closest(".column-container").show();
		$("div[data-name='Начальная цена комплекта без НДС']").closest(".column-container").show();
	}
	else {
		$("div[data-name='Формула цены и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
		$("div[data-name='Цена единицы товара, работы, услуги и максимальное значение цены договора (цены заявки)']").closest(".column-container").hide();
		$("div[data-name='Валюта комплекта']").closest(".column-container").hide();
		$("div[data-name='Начальная цена комплекта без НДС']").closest(".column-container").hide();
	}
}

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
	
/* 	$(document).on('change', "input[data-field-name='CountryCodeTel']", function (e) {	
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
		$(".documentView-field-value[data-name='Ссылка на процедуру']").text("https://rt.roseltorg.ru/#com/procedure/edit/id/" + flag);
	}
}

var ItemTabDefaultRow = function () {
	
	var count = $("div[data-name='ItemTab'] div[data-rowkey]").length;

	if (count < 1) {
		$("div[data-name='ItemTab'] .table-add-row-button")[0].click();
	};
}

$(document).on('change', "input[name='NMCSNoNDS']", function (e) {
	let NMCD = $("input[name='registerNMCS']").val()
	NMCD = NMCD.replace(/\s/g, '')
	NMCD = parseFloat(NMCD)
	let NoNDS = $(this).val()
	NoNDS = NoNDS.replace(/\s/g, '')
	NoNDS = parseFloat(NoNDS)
	if (NoNDS > NMCD) {
		showCommonErrors("Начальная максимальная цена без НДС не должна превышать НМЦ с НДС");
		$("input[name='NMCSNoNDS']").clear();
		$("input[name='RazmNDS']").clear();
		$("input[name='registerNMCS']").clear();
		$("input[name='NMCD']").clear();
	}
	let RazmNDS = NMCD - NoNDS
	$("input[name='RazmNDS']").autoNumeric('set', RazmNDS)	
})

$(document).on('change', "input[name='registerNMCS']", function (e) {
	calculateNmcs();
	let NMCD = $(this).val()
	NMCD = NMCD.replace(/\s/g, '')
	NMCD = parseFloat(NMCD)
	let NoNDS = $("input[name='NMCSNoNDS'").val()
	NoNDS = NoNDS.replace(/\s/g, '')
	NoNDS = parseFloat(NoNDS)
	if (NoNDS > NMCD) {
		showCommonErrors("Начальная максимальная цена без НДС не должна превышать НМЦ с НДС");
		$("input[name='NMCSNoNDS']").clear();
		$("input[name='RazmNDS']").clear();
		$("input[name='registerNMCS']").clear();
		$("input[name='NMCD']").clear();
		$("input[name='curs']").clear();
	}
	let RazmNDS = NMCD - NoNDS
	$("input[name='RazmNDS']").autoNumeric('set', RazmNDS)
})

$(document).on('change', "input[name='RFImax']", function (e) {
	let Max = $(this).val()
	Max = Max.replace(/\s/g, '')
	Max = parseFloat(Max)
	let Min = $("input[name='RFImin'").val()
	Min = Min.replace(/\s/g, '')
	Min = parseFloat(Min)
		if (Min > Max) {
			showCommonErrors("Максимальное количество участников для включения в перечень не может быть меньше минимального");
			$("input[name='RFIFmax']").clear();
			$("input[name='RFImin']").clear();
		}
})

$(document).on('change', "input[name='RFImin']", function (e) {
	let Max = $("input[name='RFImax'").val()
	Max = Max.replace(/\s/g, '')
	Max = parseFloat(Max)
	let Min = $(this).val()
	Min = Min.replace(/\s/g, '')
	Min = parseFloat(Min)
		if (Min > Max) {
			showCommonErrors("Максимальное количество участников для включения в перечень не может быть меньше минимального");
			$("input[name='RFImax']").clear();
			$("input[name='RFImin']").clear();
		}
})


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
});

function valuta() {    
	var flag=$("input[name='Currency_kod']").val();
	if (flag!=="RUB") {
		$("input[data-field-name='NMCD']").closest(".column-container").show();
		$("div[data-related-field='NMCD']").closest(".column-container").show();
		$("input[data-field-name='curs']").closest(".column-container").show();
		$("div[data-related-field='curs']").closest(".column-container").show();
		$("input[data-field-name='dateCurs']").closest(".column-container").show();
		$("div[data-related-field='dateCurs']").closest(".column-container").show();
		$("input[data-field-name='NMCD']").prop('required', true);
		$("div[data-related-field='NMCD']").addClass("label-required");
		$("input[data-field-name='curs']").prop('required', true);
		$("div[data-related-field='curs']").addClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', true);
		$("div[data-related-field='dateCurs']").addClass("label-required");
	} else {
		$("input[data-field-name='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='NMCD']").closest(".column-container").hide();
		$("input[data-field-name='curs']").closest(".column-container").hide();
		$("div[data-related-field='curs']").closest(".column-container").hide();
		$("input[data-field-name='dateCurs']").closest(".column-container").hide();
		$("div[data-related-field='dateCurs']").closest(".column-container").hide();
		$("input[data-field-name='NMCD']").prop('required', false);
		$("div[data-related-field='NMCD']").removeClass("label-required");
		$("input[data-field-name='curs']").prop('required', false);
		$("div[data-related-field='curs']").removeClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', false);
		$("div[data-related-field='dateCurs']").removeClass("label-required");
	}
}


$(document).on('change', "input[name='Currency_kod']", function (e) {
	valuta();
})

function calculateNmcs() {
	var curs = $("input[name='curs']");
	var registerNMCS = $("input[name='registerNMCS']");
	var NMCD = $("input[name='NMCD']");
	var flag=$("input[name='Currency_kod']").val();
	if (flag!=="RUB") {
		var s2 = curs.autoNumeric('get');
		var s4 = registerNMCS.autoNumeric('get');
		var val2 =  parseFloat(s2? s2 : 0);
		var val4 =  parseFloat(s4? s4 : 0);
		NMCD.autoNumeric('set', val4*val2);
	}
} 

$(document).on('change', "input[name='curs']", function (e) {
	calculateNmcs();	
})

function valutaView() {
	let Currency = $(".documentView-field-value[data-name='Валюта']").text();
		if (Currency == "Российский рубль") {
			$("div[data-name='Курс валюты'").closest(".column-container").hide()
			$("div[data-name='Дата, на которую установлен курс валюты'").closest(".column-container").hide()
			$("div[data-name='Начальная(максимальная цена) в рублях']").closest(".column-container").hide()
		} else {
			$("div[data-name='Курс валюты'").closest(".column-container").show()
			$("div[data-name='Дата, на которую установлен курс валюты'").closest(".column-container").show()
			$("div[data-name='Начальная(максимальная цена) в рублях']").closest(".column-container").show()
		}
}

$(document).on('change', "input[name*='ItemTab-typeObject-']", function (e) {
	typeObject(this);
})

$("div[data-name='ItemTab']").on("onTableRowAdded", function () {
	typeObjectEdit();
})

function typeObject(element) {
	let RowKey = $(element).parents('.table-edit-row').attr('data-rowkey');
	let typeObjectName = $("input[name*='ItemTab-typeObject-" + RowKey + "']");
	let ZayavProd = $("input[name='ItemTab-ZayavProd-" + RowKey + "']");
	let ZayavStr = $("input[name='ItemTab-ZayavStr-" + RowKey + "']");
	if ((typeObjectName.val() == "G")) {
		ZayavProd.prop('checked', false);
		ZayavStr.prop('checked', false);
		ZayavProd.attr('disabled', false);
		ZayavStr.attr('disabled', false);
	} else {
		ZayavProd.prop('checked', false);
		ZayavStr.prop('checked', false);
		ZayavProd.attr('disabled', true);
		ZayavStr.attr('disabled', true);
	}
}

function typeObjectReg(element) {
	let RowKey = $(element).parents('.table-edit-row').attr('data-rowkey');
	let ZayavStr1 = $("input[name*='ItemTab-ZayavStr']");
	let ZayavProd1 = $("input[name*='ItemTab-ZayavProd']");
	let typeObjectName = $("input[name*='ItemTab-typeObject-" + RowKey + "']");
	if ((typeObjectName.val() == "G")) {
		ZayavProd1.attr('disabled', false);
		ZayavStr1.attr('disabled', false);
	} else {
		ZayavProd1.attr('disabled', true);
		ZayavStr1.attr('disabled', true);
	}
}

function typeObjectEdit() {
	let Tab = $("input[name*='ItemTab-typeObject-']").length;
	for (var i = 1; i <= Tab; i++) {
		if ($("input[name='ItemTab-typeObject-" + i + "']").val() == "G") {

			$("input[name='ItemTab-ZayavProd-" + i + "']").attr('disabled', false);
			$("input[name='ItemTab-ZayavStr-" + i + "']").attr('disabled', false);

		} else {

			$("input[name='ItemTab-ZayavProd-" + i + "']").attr('disabled', true);
			$("input[name='ItemTab-ZayavStr-" + i + "']").attr('disabled', true);

		}
	}
}


function setOKP2andOKVED2Code() {
	let table = $("[data-name='ItemTab']");
	
	function setCode(selectedItem, selectedrow) {	
		let okpd2 = selectedItem.raw["ОКПД2"];
		let okved2 = selectedItem.raw["ОКВЭД2"];	
		
		
		let spzak=$("input[name='registerSpZakup']").val();

		if ( (spzak != "200608" && spzak != "200609" && spzak != "200610" && spzak != "200611") ) {
			findDictionaryItemByKey("ОКПД2", okpd2, "", function (data) {
				if (data.data) {
					let okpd2Code = JSON.parse(data.data).Name;
					let okpdName = JSON.parse(data.data).Attributes["Наименование"];
					$("[name='ItemTab-registerOKDP-" + selectedrow +"']").val(okpd2Code);
					$("input[name='ItemTab-registerOKPDName-" + selectedrow +"']").val(okpdName);
				}
				if(data.error){
					console.log(data.error);					
				}
				$("[name='ItemTab-registerOKDP-" + selectedrow +"']").change();
			});
		
		
		}
		else{
			findDictionaryItemByKey("ОКПД2", okpd2, null, function (data) {
				if (data.data) {
					let okpd2Code = JSON.parse(data.data).Name;
					let okpdName = JSON.parse(data.data).Attributes["Наименование"];
					let indexTRU = TRUDictArr.indexOf(okpd2Code)
					indexTRU += 1;
					if( okpd2Code in TRUDict ){
						$("[name='ItemTab-OKDPUMSP-" + selectedrow +"']").val(indexTRU);
						$("input[name='ItemTab-OKDPUMSPname-" + selectedrow +"']").val(okpdName);
						$("input[name='ItemTab-OKDPUMSPkod-" + selectedrow +"']").val(okpd2Code);
					}
					else{
						showCommonErrors('ОКПД2 выбранной позиции не соответствует способу закупки')
						$("[name='ItemTab-positionDirectoryName-" + selectedrow +"']").val("");
						$("[name='ItemTab-positionDirectory-" + selectedrow +"']").val("");
						$("[name='ItemTab-positionDirectory-" + selectedrow +"']").change();
						$("[name='ItemTab-positionDirectoryName-" + selectedrow +"']").change();
					}
					
				}
				if(data.error){
					console.log(data.error);					
				}
				$("[name='ItemTab-OKDPUMSPkod-" + selectedrow +"']").change();
			});
		}
		
		
		findDictionaryItemByKey("ОКВЭД2", okved2, "", function (data) {
			if (data.data) {
				let okved2Code = JSON.parse(data.data).Name;
				let okved2Key = JSON.parse(data.data).Key;
				let okvedName = JSON.parse(data.data).Attributes["Наименование"];
				
				$("[name='ItemTab-registerOKVED-" + selectedrow +"']").val(okved2Code);	
				$("[data-parent-name='ItemTab-registerOKVED-" + selectedrow +"parent']").val(okved2Key);
				$("input[name='ItemTab-registerOKVEDName-" + selectedrow +"']").val(okvedName);
			}
			if(data.error){
				console.log(data.error);					
			}
			$("[name='ItemTab-registerOKVED-" + selectedrow +"']").change();
		});
	}
	
	function subscribeOnEvent(row) {
		let dicButton = $("button[data-dict-name='Номенклатурные позиции']");
		dicButton.on("DicItemSelected", function (event, args) {
			let row = $(event.currentTarget).parents('.table-edit-row').attr('data-rowkey');
			setCode(args.items[0],row);
		});
	}
	
	table.on("onTableRowAdded", function (event, args) {
		let newRow = args.innerTableContainer;
		subscribeOnEvent(newRow);
	});
	
	let dicButton = $("button[data-dict-name='Номенклатурные позиции']");
	dicButton.on("DicItemSelected", function (event, args) {
		let row = $(event.currentTarget).parents('.table-edit-row').attr('data-rowkey');
		setCode(args.items[0],row);	
	});
}

$(document).on('change', "input[name='Kodcen']", function (e) {
	svedcen();
})

function svedcen() {
	let kodcen = $("input[name='Kodcen']");
	let torgEd = $("input[name='torgEd']");
	console.log(kodcen.val())
	console.log("123")
	if (kodcen.val() === '3') {
		torgEd.prop('checked', true);
		$("input[type='hidden'][name='Currency_dig_kod_kit']").val("643")
		$("input[type='hidden'][name='Currency_kod_kit']").val("RUB")
		$("input[type='hidden'][name='Currency_kit']").val("Российский рубль")
		$("input[type='hidden'][name='Currency_kit']").change()
	} else {
		$("input[type='hidden'][name='Currency_dig_kod_kit']").val("")
		$("input[type='hidden'][name='Currency_kod_kit']").val("")
		$("input[type='hidden'][name='Currency_kit']").val("")
		$("input[data-field-name='cened']").val("")
		torgEd.prop('checked', false);
	}
}

function checkPositionDirectory() {
	if ($("input[data-field-name='checkPositionDirectory']").is(":checked")) {
		//раскрываем наимен-е позиции из справочника
		$("div[data-field-name='Наименование позиции из справочника']").parent().show()
		$("div[title='Наименование позиции из справочника']").show()
		$("input[name^='ItemTab-itemName']").val("")

		//обязательноть заполнения позиции из справочника
		$("input[data-field-name^='ItemTab-positionDirectory']").prop("required", true);
		$("input[data-field-name^='ItemTab-itemName']").prop("required", false);


		//скрываем наимен-е позиции 
		$("div.documentView-field-value[data-field-name='Наименование позиции']").parent().hide()
		$("div[title='Наименование позиции']").hide()


	} else {

		//очищаем поле наимен-е позиции справочника
		$("input[name^='ItemTab-positionDirectoryName']").val("")
		$("input[name^='ItemTab-positionDirectory']").val("")
		$("input[data-field-name^='ItemTab-positionDirectoryName']").val("")
		$("input[data-field-name^='ItemTab-positionDirectory']").val("")

		//скрываем наимен-е позиции из справочника
		$("div[data-field-name='Наименование позиции из справочника']").parent().hide()
		$("div[title='Наименование позиции из справочника']").hide()

		//убираю обязательноть заполнения позиции из справочника
		$("input[data-field-name^='ItemTab-positionDirectory']").prop("required", false);
		$("input[data-field-name^='ItemTab-itemName']").prop("required", true);

		//раскрываем наимен-е позиции 
		$("div.documentView-field-value[data-field-name='Наименование позиции']").parent().show()
		$("div[title='Наименование позиции']").show()





		let tableItemTab = $("div.table-edit[data-name='ItemTab']")
		tableItemTab.children().children("div.table-edit-row[data-rowkey]").each(function () { //прохожу по каждой строке
			let i = $(this).attr("data-rowkey")
			if ($("[name='ItemTab-itemName-" + i + "']").val() == "") {
				$("[name='ItemTab-registerOKDP-" + i + "']").val("")
				$("input[name='ItemTab-registerOKDPName-" + i + "']").val("")
				$("[name='ItemTab-registerOKVED-" + i + "']").val("")
				$("[data-parent-name='ItemTab-registerOKVED-" + i + "parent']").val("")
				$("input[name='ItemTab-registerOKVEDName-" + i + "']").val("")
				$("input[name='ItemTab-registerOKDP-" + i + "']").change()
				$("input[name='ItemTab-registerOKVED-" + i + "']").change()
			}
		})
	}

}

$(document).on('change', "input[name^='ItemTab-positionCode']", function (e) {
	let current = $(this).val()
	$(this).closest("div.table-edit-row").find("input[name^='ItemTab-itemName']").val(current)
})

$(document).on('change', ("input[data-field-name='checkPositionDirectory']"), function () {
	//условие if отделено от функции checkPositionDirectory() , чтобы при взятии на редактирование не очищалось поле Наименование позиции
	if (!$("input[data-field-name='checkPositionDirectory']").is(":checked")) {
		//очищаем поле наимен-е позиции 
		$("input[name^='ItemTab-itemName']").val("")
	}
	checkPositionDirectory()

})

function positionView() {
	let flag = $("div[data-name='Выбрать позицию из справочника']").find("input[type='checkbox']");
	gridReady("Позиции").then(function (grid) {
		if ($(flag).attr("checked")) {
			hideColumnByCaptionName(grid, "Наименование позиции");
		} else {
			hideColumnByCaptionName(grid, "Наименование позиции из справочника");
		}
	})
};

var CalculateYearPurchase = function() {
	var godzak = $("input[name='godzak']");
	var plandaterazm = $("input[name='plandaterazm']");
	
	function WriteDate() {
		if (plandaterazm.val()) {
			var Yearplandaterazm = plandaterazm.val().split(".");
			godzak.val(Yearplandaterazm[2]); //Записываю год планируемой даты размещения
		}
	}
	plandaterazm.closest(".input-group.date").on("dp.change", function() {
		WriteDate();
	})
	
	WriteDate();
}
function concatName(){
	kont_F = $("input[data-field-name='kont_F']").val()
	kont_I = $("input[data-field-name='kont_I']").val()
	kont_O = $("input[data-field-name='kont_O']").val()
	$("input[data-field-name='kontFace']").val(kont_F+" "+kont_I+" "+kont_O)
}
function resizeTextarea(){
	$("textarea[data-field-name='nameProcedure']").attr("rows","3")
	$("textarea[data-field-name='orgzakAdress']").attr("rows","3")
	$("textarea[data-field-name='porpodzayav']").attr("rows","3")
	$("textarea[data-field-name='porpodvitog']").attr("rows","3")
	$("textarea[data-field-name='locationitog']").attr("rows","3")
	$("textarea[data-field-name='registerNaimDogov']").attr("rows","3")
}
var FilterSposob = function () {
	var CodeEIS = $("input[name='OrgZakupkiEIS']"); //считываем Код_в_ЕИС организатора закупки
	var CodeSprav = $("input[name='OrgZakKodSprav']"); //получаем поле, куда записать Код_в_ЕИС
	addParentIdToDic(CodeEIS, CodeSprav);

	function addParentIdToDic(sourceDictionaryField, targetDictionaryField) {
	   var sourceValue = sourceDictionaryField.val();
	   
	   var dictionaryName = "Организации заказчики223";

	   var button = $("#Namekomissii");
	
	   button.prop("disabled", true);
	   getDictionaryItemIdByName(dictionaryName, sourceValue,
	   function (data) {
		   var kodElement = $("[name='OrgZakKodSprav']");
		   kodElement.attr("data-parent-name","OrgZakKodSpravparent");
		   kodElement.val(data.data);
		   kodElement.change();
		   button.prop("disabled", false);
	   },
	   function (data) {
					   console.log(data);
					   button.prop("disabled", false);
	   });
	}
};

var RolesTable = (function () {
                var thrirdLevelFields = ["Члены комиссии", "Фамилия", "Имя", "Отчество", "Код роли", "Роль", "Присутствует"],
                               roleDicItems = {},
                               membersTable = $("div[data-name='Uch_Kom']");


				console.log("1");
               function hideAddButtonForTable() {
                               //membersTable.find("div.table-add-row-button").hide();
                }

                function hideRemoveRowButton() {
                               //membersTable.find("div.table-remove-row-button").hide();
                }

                function disabledButton() {
                              // membersTable.find("span.input-group-btn").find("button[is-addressbook='true']").prop("disabled", true);
                }              
                
                function processTable() {

                               /* hideAddButtonForTable();
                               hideRemoveRowButton();
                               disabledButton(); */
                               var dicButton = $("#Namekomissii");
                               //подписываемся на выбор значения в словаре
                               dicButton.on("DicItemSelected", function (event, payload) {
                                               console.log(payload);
                                               if (payload.items && payload.items.length) {
                                                               
                                                               onDicItemSelected(payload.dicName, payload.items[0].data.id);
                                               }
											   console.log("2");
                               });
                }

                function onDicItemSelected(dicName, selectedItemId) {
                               //получаем детей выбранного элемента словаря
                               waitingDialog.showWaiting();
							   console.log("3");
                               getDictionaryItems(dicName, ",Комиссия", selectedItemId, 3, thrirdLevelFields, function (data) {
								   var l = data.children.length;
								   var users = [];
								   var promises = [];
								   if (l === 0) {
									   createRows(event, []);
								   } else {
									   //создаем модельку юзера
									   var users = [];
									   var promises = [];
									   for (var i = 0; i < l; i++) {
										  var current = data.children[i];
										  var user = createUserModel(current);

										  user.roles.push({
											  codeRole: current["Код роли"],
											  /* exist: current["Присутствует"] === "1" || current["Присутствует"] === "True" ? true : false, */
											  exist: true,
											  roleName: current["Роль"],
										  });
										  //нам надо получить для каждого пользователя его идентификатор по имени
										  promises.push(bindUserID(user));
										  users.push(user);
									   }

									   $.when.apply($, promises).then(function () {
													  createRows(event, users, roleDicItems);                            
													  waitingDialog.hide();                                                                    
									   }, function (error) {
													  waitingDialog.hide();
													  console.log(error);
									   });

								   }
                               }, function (error) {
                                               ct.ui.alert('title', 'message');
                                               waitingDialog.hide();
                               });
                }

                function createRows(event, users, codesDic) {

                               //находим табличку
                               //var membersTable = $("div[data-name='Uch_Kom']");

                               //удалем существующие строки
                               //membersTable.find("[data-rowkey]").remove();
							   console.log("4")
                               membersTable.find("[data-rowkey]").each(function(index, element) {
                                               removeTableRow(element);
                               });

                               var addButton = membersTable.find(".table-add-row-button");
                               var errors = [],
                                               l = users.length;

                               var columnNumber = 0;
							   console.log("5")
                               for (var i = 0; i < l; i++) {
                                               var current = users[i];
                                               if (current.id == null) {
                                                               errors.push(current.reason);
                                                               continue;
                                               }
                                               columnNumber++;
                                               addNewTableRow(addButton, event);

                                               var newRow = membersTable.find("[data-rowkey='" + columnNumber + "']");

                                               // newRow.find("[name='Uch_Kom-Num-" + columnNumber + "']").val(columnNumber);

                                               newRow.find("[name='Uch_Kom-FioUch-" + columnNumber + "']").first().val(current.fullName);
                                               newRow.find("[name='Uch_Kom-FioUch-Id-" + columnNumber + "']").val(current.id);
                                               newRow.find("[name='FioUch-Id-" + columnNumber + "']").val(current.id);

                                               newRow.find("[name='Uch_Kom-FamUch-" + columnNumber + "']").val(current.secondName);
                                               newRow.find("[name='Uch_Kom-NameUch-" + columnNumber + "']").val(current.name);
                                               newRow.find("[name='Uch_Kom-OtUch-" + columnNumber + "']").val(current.patronymic);
                                               newRow.find("[name='Uch_Kom-Uchastnik-" + columnNumber + "']").val(current.code);


                                               //если у пользователя одна роль проставляем ее
                                               if (current.roles.length === 1) {
                                                               var role = current.roles[0];

                                                               var voteInput = newRow.find("[name='Uch_Kom-Prisutstvie-" + columnNumber + "'][type='checkbox']");

                                                               voteInput.prop('checked', role.exist);

                                                               newRow.find("[name='Uch_Kom-RoleUch-" + columnNumber + "']").val(role.roleName);
                                                               newRow.find("[name='Uch_Kom-RoleUchCode-" + columnNumber + "']").val(role.codeRole);
															   
                                               }
                                               $("[data-parent-name='Uch_Kom-Uchastnik-" + columnNumber + "parent']").val(current.dicId);
                               }
								ct.common.dictionary.fillDisplayFields();
                               if (errors.length > 0) {
                                               ct.ui.alert('Ошибка:', errors);
                               }

                               var rows = membersTable.find("[data-rowkey]");
                               var rowLength = rows.length;
                               var countNeededRows = 3 - rowLength;
                               if (countNeededRows > 0) {
                                               for (let j = 0; j < countNeededRows; j++) {
                                                               addNewTableRow(addButton, event);
                                                               var columnNumberForEmpty = j + rowLength + 1;
                                                               membersTable.find("[name='Uch_Kom-Num-" + columnNumberForEmpty + "']").val(columnNumberForEmpty);
                                               }
                               }

                               hideRemoveRowButton();
                }


                function createUserModel(dicItem) {

                               var nameParts = dicItem["Фамилия"].split(" ");
                               var secondName = nameParts[0];
                               var name = nameParts[1];
                               var patronymic = nameParts[2];

								console.log("6")
                               var fullName = secondName + " " + getFirstLetter(name) + "." + getFirstLetter(patronymic) + ".";


                               return {
                                               name: name,
                                               secondName: secondName,
                                               patronymic: patronymic,
                                               fullName: fullName,
                                               title: dicItem["Фамилия"],
                                               dicId: dicItem["id"],
                                               code: dicItem["code"],
                                               id: null,
                                               reason: null,
                                               roles: []
                               };
                }

                //загрузить ид пользователя
                function bindUserID(user) {
				   var defer = jQuery.Deferred();
				   
				   var url = "AddressBook/GetUserIdByFullNameAndOrg?firstName=" + user.name + "&surname=" + user.secondName + "&patronymic=" + user.patronymic + "&orgKey=" + $("[name='OrgZakupkiId']").val();
				   url = encodeURI(url);

				   $.ajax({
					   url: getAbsoluteUrl(url),
					   type: "get",
					   cache: false,
					   success: function (response) {
						   var json = JSON.parse(response);
						   if (json.status === "ERROR") {
							  console.log(json.responseMessage);
							  user.reason = "<br/>Участник комиссии " + user.fullName + " не зарегистрирован в системе.";
							  //user.reason = json.responseMessage;
						   }
						   else
							  user.id = json.responseMessage;
						   defer.resolve();
					   },
					   error: function (jqXHR, textStatus, errorThrown) {
						   user.error = errorThrown;
						   defer.resolve();
					   }
				   });
				   return defer.promise();
                }
                //получить первую букву строке в аперкейсе
                function getFirstLetter(str) {
                               if (!str || str.length === 0 || str.trim().length === 0) {
                                               return "";
                               } else {
                                               var trimmed = str.trim();
                                               return str[0].toUpperCase();
                               }

                }

                function filterRoles() {
                               var rows = membersTable.find("[data-rowkey]");
								console.log("7")
                               $.each(rows, function (index, row) {
                                               var columnNumber = index + 1,
                                                               currentRow = $(row);

                                               var dicId = currentRow.find("[name='Uch_Kom-Uchastnik-" + columnNumber + "']").val();
                                               if (dicId && dicId.trim() !== "") {
                                                               currentRow.find("[data-parent-name='Uch_Kom-Uchastnik-" + columnNumber + "parent']").val(dicId);
                                               }
                               });

                }

                return {
                               processTable: processTable,
                               filterRoles: filterRoles
                }
}());
function ChangeRFI(){
	let regstatus = $("input[name='regstatus']").val()
	if( regstatus=="Внесение изменений" ){
		$("input[name='DateChange']").prop("required", true)
		$("div[data-related-field='DateChange']").addClass("label-required");
		$("textarea[name='reasonChange']").prop("required", true)
		$("div[data-related-field='reasonChange']").addClass("label-required");
		$("input[data-field-name='goProcedureEIS']").readonly()
		$("textarea[data-field-name='registerNaimDogov']").prop("readonly",true)
	}
	else{
		$("input[name='DateChange']").prop("required", false)
		$("div[data-related-field='DateChange']").removeClass("label-required");
		$("textarea[name='reasonChange']").prop("required", false)
		$("div[data-related-field='reasonChange']").removeClass("label-required");
		$("li:has(:contains('Изменения'))").hide();
	}
}
function changeView(){
	let reasonChange = $("div.documentView-field-value[data-name='Причина внесения изменений']");
	if(reasonChange.attr('title')){
		$("li:has(:contains('Изменения'))").show();
	}else{
		$("li:has(:contains('Изменения'))").hide();
	}
}

var ParseUrlOnEETPView = function() {
	var Url = $(".documentView-field-value[data-name='Ссылка на торговой площадке']");
	if (!Url.attr('title')){
		Url.closest('.column-container').hide();
	}
}

scopes.onRegisterTemp(editreg);
scopes.onRegister(hideReqType);
scopes.onRegister(svedcen);
scopes.onRegister(splitPhone);
scopes.onRegister(rebuildFieldPhone);
scopes.onRegister(ItemTabDefaultRow);
scopes.onRegister(valuta);
scopes.onRegister(setOKP2andOKVED2Code);
scopes.onRegister(typeObjectReg);
scopes.onRegister(checkPositionDirectory);
scopes.onRegister(CalculateYearPurchase);
scopes.onRegister(concatName);
scopes.onRegister(resizeTextarea);
scopes.onRegister(RolesTable.processTable);
scopes.onRegister(FilterSposob);
scopes.onRegister(ChangeRFI);

scopes.onEdit(editreg);
scopes.onEdit(hideReqType);
scopes.onEdit(svedcen);
scopes.onEdit(rebuildFieldPhone);
scopes.onEdit(splitPhone);
scopes.onEdit(ItemTabDefaultRow);
scopes.onEdit(valuta);
scopes.onEdit(setOKP2andOKVED2Code);
scopes.onEdit(typeObjectEdit);
scopes.onEdit(checkPositionDirectory);
scopes.onEdit(CalculateYearPurchase);
/* scopes.onEdit(concatName); */
scopes.onEdit(resizeTextarea);
scopes.onEdit(RolesTable.processTable);
scopes.onEdit(FilterSposob);
scopes.onEdit(ChangeRFI);

scopes.onView(hideReqTypeView);
scopes.onView(ParseUrlOnEETPView);
scopes.onView(SvedcennView);
scopes.onView(procedureLinkView);
scopes.onView(editView);
scopes.onView(valutaView);
scopes.onView(positionView);
scopes.onView(changeView);