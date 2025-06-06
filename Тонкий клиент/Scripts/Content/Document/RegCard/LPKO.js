var editreg = function () {
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
	$("div[data-name='ItemTab']").find(".table-add-row-button").closest(".table-edit-column").hide();
	$("div[data-name='ItemTab']").find(".table-remove-row-button").closest(".table-edit-column").hide();
}

var hideReqType = function () {
	var flag = $("input[name='reqType']");
	if (flag.val() == "Запрос контрагентам по почте") {
		$("li:has(:contains('Запрос на ЭТП'))").hide();
		$("li:has(:contains('Запрос контрагентам по почте'))").show();
	} else {
		$("li:has(:contains('Запрос на ЭТП'))").show();
		$("li:has(:contains('Запрос контрагентам по почте'))").hide();
	}
}

var hideReqTypeView = function () {
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
}


var splitPhone = function () {
	var CountryCodeTel = $("input[data-field-name='CountryCodeTel']");
	var CityCodeTel = $("input[data-field-name='CityCodeTel']");
	var Tel = $("input[data-field-name='Tel']");
	var AdditionalTel = $("input[data-field-name='AdditionalTel']");
	var kontTel = $("input[data-field-name='kontTel']");
	var kontTelETP = $("input[data-field-name='kontTelETP']");

	if (kontTel.val() != "") {
		var array = $("input[data-field-name='kontTel']").val().split('-');

		if (array[0] != undefined) {
			CountryCodeTel.val(array[0]);
		}
		if (array[1] != undefined) {
			CityCodeTel.val(array[1]);
		}
		if (array[2] != undefined) {
			Tel.val(array[2]);
		}
		if (array[3] != undefined) {
			AdditionalTel.val(array[3]);
		}
	}
}

var procedureLinkView = function () {
	var flag = $(".documentView-field-value[data-name='Ссылка на процедуру']").attr("title");
	if (flag) {
		var url = "https://rt.roseltorg.ru/#com/procedure/view/procedure/" + flag;
		/* $(".documentView-field-value[data-name='Ссылка на процедуру']").attr('title', "url"); */
		$(".documentView-field-value[data-name='Ссылка на процедуру']").find('a').attr('href', url);
		$(".documentView-field-value[data-name='Ссылка на процедуру']").find('a').text(url);
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
		/* $("input[name='registerNMCS']").clear(); */
		/* $("input[name='NMCD']").clear(); */
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

$(document).on('change', "input[name='PKOmax']", function (e) {
	let Max = $(this).val()
	Max = Max.replace(/\s/g, '')
	Max = parseFloat(Max)
	let Min = $("input[name='PKOmin'").val()
	Min = Min.replace(/\s/g, '')
	Min = parseFloat(Min)
	if (Min > Max) {
		showCommonErrors("Максимальное количество участников для включения в перечень не может быть меньше минимального");
		$("input[name='PKOmax']").clear();
		$("input[name='PKOmin']").clear();
	}
})

$(document).on('change', "input[name='PKOmin']", function (e) {
	let Max = $("input[name='PKOmax'").val()
	Max = Max.replace(/\s/g, '')
	Max = parseFloat(Max)
	let Min = $(this).val()
	Min = Min.replace(/\s/g, '')
	Min = parseFloat(Min)
	if (Min > Max) {
		showCommonErrors("Максимальное количество участников для включения в перечень не может быть меньше минимального");
		$("input[name='PKOmax']").clear();
		$("input[name='PKOmin']").clear();
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
	var flag = $("input[name='Currency_kod']").val();
	if (flag !== "RUB") {
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
	var flag = $("input[name='Currency_kod']").val();
	if (flag !== "RUB") {
		var s2 = curs.autoNumeric('get');
		var s4 = registerNMCS.autoNumeric('get');
		var val2 = parseFloat(s2 ? s2 : 0);
		var val4 = parseFloat(s4 ? s4 : 0);
		NMCD.autoNumeric('set', val4 * val2);
	}
}

$(document).on('change', "input[name='curs']", function (e) {
	calculateNmcs();
})

$(document).on('change', "input[name='Currency_kod']", function (e) {
	let valuta = $("input[name='Currency_kod']").val();
	if (valuta == 'RUB') {
		$("input[name='curs']").clear();
		$("input[name='dateCurs']").clear();
		$("input[name='NMCD']").clear();
	}
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

$(document).on('change', "input[name='Kodcen']", function (e) {
	svedcen();
})

function svedcen() {
	let kodcen = $("input[name='Kodcen']");
	let torgEd = $("input[name='torgEd']");
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


$(document).on('change', "input[name^='ItemTab-positionCode']", function (e) {
	let current = $(this).val()
	$(this).closest("div.table-edit-row").find("input[name^='ItemTab-itemName']").val(current)
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

var DisableButtonOnFortable = function() {
	$("button[id='registerOKDP']").prop('disabled', true);
	$("button[id='registerOKVED']").prop('disabled', true);
	$("button[id='Ed_izm']").prop('disabled', true);
	$("button[id='typeObject']").prop('disabled', true);
	$("button[id='Currency_kod']").prop('disabled', true); // валюта
	
}  

function InputOrgZakupkiId() {

	var registerOrgZa = $("input[name='registerOrgZa']").val();
	var registerOrgZaId = $("input[name='registerOrgZaId']").val();
		
	findDictionaryItemByKey("Агентский договор", registerOrgZa, 1, function (data) {

		if (data.data) {

			$("input[type='hidden'][name='OrgDocId']").val(registerOrgZaId)
			$("input[type='text'][name='OrgDoc']").val(registerOrgZa)

        }
		if (data.error) {
			findDictionaryItemByKey("Агентский договор", registerOrgZa, 2, function (data2) {
				if (data2.data) {
					let datakey = JSON.parse(data2.data).Key;
					getParentFor("Агентский договор", datakey).then(function (data) {

						getDepartmentKey(data.Name, function (key) {

							$("input[type='hidden'][name='OrgDocId']").val(key)
							$("input[type='text'][name='OrgDoc']").val(data.Name)


						});
					}, function (error) {
						console.log(error);
					});
				}
			});

        }
		
	});
}
function ChangePKO(){
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
function resizeTextarea(){
	$("textarea[data-field-name='nameProcedure']").attr("rows","3")
	$("textarea[data-field-name='orgzakAdress']").attr("rows","3")
	$("textarea[data-field-name='porpodzayav']").attr("rows","3")
	$("textarea[data-field-name='porpodvitog']").attr("rows","3")
	$("textarea[data-field-name='locationitog']").attr("rows","3")
	$("textarea[data-field-name='registerNaimDogov']").attr("rows","3")
}
function concatName(){
	kont_F = $("input[data-field-name='kont_F']").val()
	kont_I = $("input[data-field-name='kont_I']").val()
	kont_O = $("input[data-field-name='kont_O']").val()
	$("input[data-field-name='kontFace']").val(kont_F+" "+kont_I+" "+kont_O)
}
function maskKontTel() {
	$("input[name='kontTel']").one('click', function() {
	 $("input[name='kontTel']").inputmask({"mask": "+9{1,5}(9{1,6})9{5,12}"});
	});
}
function checkedRNP() {
	$("input[data-field-name='rnp']").prop("checked",true)
}
function send_to_oosRegister(){
	let goProcedureEIS = $("input[type='checkbox'][name='goProcedureEIS']");
	let orgzakCommercial = $("input[type='checkbox'][name='orgzakCommercial']");
	let numberPKO = $("input[data-field-name='numberPKO']").val();
	let regstatus = $("input[name='regstatus']").val();
	console.log("numberPKO"+numberPKO)
	if( numberPKO>=1 || regstatus == "Внесение изменений"){	
	}
	else{
		if ( (orgzakCommercial.is(":checked")) ){
			goProcedureEIS.prop('checked', false);
		}
		else{
			goProcedureEIS.prop('checked', true);
		}
	}
}
function fillingFormTorg(){
	$("input[data-field-name='formTorg']").val("Предквалификационный отбор");
}
function changeView(){
	let reasonChange = $("div.documentView-field-value[data-name='Причина внесения изменений']");
	if(reasonChange.attr('title')){
		$("li:has(:contains('Изменения'))").show();
	}else{
		$("li:has(:contains('Изменения'))").hide();
	}
}


var ValidateOrderItemTable = function(){
	var validateTable = function(){
		var table = $("div[data-name='Uch_Kom'] div[data-rowkey]").length;
		var result = true;
			if (table < 1) {
				result = false;
			}
		return result;
	}

	var form = $("form");
	form.on("beforeSubmit", function (args) {
		$(".loading-image.loading-image-shown").show();
		if(validateTable()) return;
		/* AddRow(); */
		showCommonErrors('На вкладке "Информация о комиссии" должен быть указан хотя бы один член комиссии');
		$(".loading-image.loading-image-shown").hide();
		$(".btn-toolbar > .btn").attr("disabled", false);
		form.find("[type='submit']").attr("disabled", false);	
		throw new Error("beforeSave");		
	});
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
scopes.onRegister(ItemTabDefaultRow);
scopes.onRegister(valuta);
scopes.onRegister(typeObjectReg);
scopes.onRegister(RolesTable.processTable);
scopes.onRegister(FilterSposob);
scopes.onRegister(DisableButtonOnFortable);
scopes.onRegister(typeObjectEdit);
scopes.onRegister(InputOrgZakupkiId);
scopes.onRegister(ChangePKO);
scopes.onRegister(resizeTextarea);
scopes.onRegister(concatName);
scopes.onRegister(maskKontTel);
scopes.onRegister(checkedRNP);
scopes.onRegister(send_to_oosRegister);
scopes.onRegister(fillingFormTorg);
scopes.onRegister(ValidateOrderItemTable);

scopes.onEdit(editreg);
scopes.onEdit(hideReqType);
scopes.onEdit(svedcen);
scopes.onEdit(splitPhone);
scopes.onEdit(ItemTabDefaultRow);
scopes.onEdit(valuta);
scopes.onEdit(typeObjectEdit);
scopes.onEdit(RolesTable.processTable);
scopes.onEdit(FilterSposob);
scopes.onEdit(DisableButtonOnFortable);
scopes.onEdit(ChangePKO);
scopes.onEdit(resizeTextarea);
/* scopes.onEdit(concatName); */
scopes.onEdit(maskKontTel);
scopes.onEdit(checkedRNP);
scopes.onEdit(fillingFormTorg);
scopes.onEdit(ValidateOrderItemTable);

scopes.onView(hideReqTypeView);
scopes.onView(ParseUrlOnEETPView);
scopes.onView(SvedcennView);
scopes.onView(procedureLinkView);
scopes.onView(valutaView);
scopes.onView(positionView);
scopes.onView(changeView);