/*
Этот файл предназначен для тонкой настройки скриптов под конкретную работу с системой
Вы можете вносить любые необходимые доработки скриптов с помощью данного файла
 */

$("#documentView-controlCard-accordion").hide();

$("#registerView-controlCard-accordion").hide();
/* $("#registerView-documentLinks-accordion").hide(); */
var EditReg = function () {
	$("li:has(:contains('Скрытые поля'))").hide();
}

var EditRegCol = function () {
	$("li:has(:contains('Количество (объем)'))").hide();
}
var EditRegSum = function () {
	$("li:has(:contains('Сумма'))").hide();
}
// показать таблицу Случай заключения контракта жизн.цикла, просмотр
var LifeCicleView = function () {
	var flag = $("div[data-name='Контракт жизненного цикла']").find("input[type='checkbox']");
	var table = $("div[title='Контракт жизненного цикла наименование']").closest('.clearfix');
	if ($(flag).attr("checked")) {
		table.show();
	} else {
		table.hide();
	}
};

//невозможно применить метод определения НМЦК, просмотр
var flagNMCK = function () {
	var ObosnNmck = $("div[data-name='Обоснование невозможности применения метода определения НМЦК']");
	var flag = $("div[data-name='Невозможно применить метод определения НМЦК']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		ObosnNmck.show();
	} else {
		ObosnNmck.hide();
	}
};

//значение ОКПД2 не определено, просмотр
var registerOKPDView = function () {
	var regOKPD = $("div[data-name='ОКПД2']");
	var regOKPDName = $("div[data-name='ОКПД2 наименование']");
	var flag = $("div[data-name='Содержит несколько ОКПД2']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		regOKPD.hide();
		regOKPDName.hide();
	} else {
		regOKPD.show();
		regOKPDName.show();
		$("div[data-name='Содержит несколько ОКПД2']").hide();
	}
};

//значение КВР не определено, просмотр
var registerKVRView = function () {
	var regKVRV = $("div[data-name='КВР']");
	var regKVRVName = $("div[data-name='КВР наименование']");
	var flag = $("div[data-name='Значение КВР не определено']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		regKVRV.hide();
		regKVRVName.hide();
	} else {
		regKVRV.show();
		regKVRVName.show();
		$("div[data-name='Значение КВР не определено']").hide();
	}
};

/*

$("[data-field-name='Организация-заказчик']").closest(".clearfix").hide();
$("[data-field-name='Организатор закупки']").closest(".clearfix").hide();
//подсвечиваем обязательные поля красной рамочкой
var Reqiered = function() {
var modifyInputs = function() {
if(!$(this).val()) {
$(this).css('border', '1px solid red');
}
}
//$("input").on('change',modifyInputs  );
//$("textarea").on('change',modifyInputs  );
$(".form-group .form-control[required]").each(modifyInputs );
} */

//Способ определения поставщика на ред/регистрационное

var sposobPostkod = function () {
	var sposobPostkod = $("input[name='sposobPostkod']");
	var ObosnEdPostPunkt = $("input[name='ObosnEdPostPunkt']");
	var ObosnEdPostPunktCode = $("input[name='ObosnEdPostPunktCode']");
	var ObosnEdPostName = $("textarea[name='ObosnEdPostName']");
	var ObosnZaprPredl = $("input[name='ObosnZaprPredl']");
	var ObosnZaprPredlButton = $("#ObosnZaprPredl");
	sposobPostkod.change(function () {
		if ($(sposobPostkod).val() == "EP44") {
			ObosnEdPostPunktCode.closest(".column-container").show();
			$("[data-related-field=ObosnEdPostPunkt").show();
			ObosnEdPostPunkt.closest(".column-container").find(".documentView-field-label").addClass("label-required");

			ObosnEdPostName.closest(".column-container").show();
			$("[data-related-field=ObosnEdPostName").show();
			ObosnEdPostName.closest(".column-container").find(".documentView-field-label").addClass("label-required");

			ObosnEdPostPunktCode.closest(".column-container").find(".dict-display-field").prop("required", true);
			ObosnEdPostName.closest(".column-container").find(".dict-display-field").prop("required", true);
			ObosnZaprPredl.closest(".column-container").find(".dict-display-field").prop("required", false)

			ObosnZaprPredl.closest(".column-container").find(".dict-display-field").hide();
			ObosnZaprPredl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=ObosnZaprPredl").hide();
			ObosnZaprPredlButton.hide();

		} else if ($(sposobPostkod).val() == "ZP44") {

			ObosnEdPostPunktCode.closest(".column-container").hide();
			ObosnEdPostPunkt.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=ObosnEdPostPunkt").hide();

			ObosnEdPostName.closest(".column-container").hide();
			ObosnEdPostName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=ObosnEdPostName").hide();

			ObosnZaprPredl.closest(".column-container").find(".dict-display-field").show();
			ObosnZaprPredl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=ObosnZaprPredl").show();
			ObosnZaprPredlButton.show();

			ObosnEdPostPunktCode.closest(".column-container").find(".dict-display-field").prop("required", false);
			ObosnEdPostName.closest(".column-container").find(".dict-display-field").prop("required", false);
			ObosnZaprPredl.closest(".column-container").find(".dict-display-field").prop("required", true)
		} else {
			ObosnEdPostPunktCode.closest(".column-container").hide();
			ObosnEdPostPunkt.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=ObosnEdPostPunkt").hide();

			ObosnEdPostName.closest(".column-container").hide();
			ObosnEdPostName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=ObosnEdPostName").hide();

			ObosnZaprPredl.closest(".column-container").find(".dict-display-field").hide();
			ObosnZaprPredl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=ObosnZaprPredl").hide();
			ObosnZaprPredlButton.hide();

			ObosnEdPostPunktCode.closest(".column-container").prop("required", false);
			ObosnEdPostName.closest(".column-container").prop("required", false);
			ObosnZaprPredl.closest(".column-container").prop("required", false)
		}
	});
	sposobPostkod.change();
};
//Способ определения поставщика на просмотр

var sposobPostkodView = function () {
	var ObosnEdPostPunkt = $("div[data-name='Обоснование закупки у единственного поставщика пункт']");
	var ObosnEdPostName = $("div[data-name='Обоснование закупки у единственного поставщика']");
	var ObosnZaprPredl = $("div[data-name='Основание для проведения запроса предложений']");
	var sposobPostkod = $("div .documentView-field-value[data-name='Способ определения поставщика']");
	if ($(sposobPostkod).html() == "Закупка у единственного поставщика (подрядчика, исполнителя)") {
		ObosnEdPostPunkt.show();
		ObosnEdPostName.show();
		ObosnZaprPredl.hide();
	} else {
		if ($(sposobPostkod).html() == "Запрос предложений") {
			ObosnEdPostPunkt.hide();
			ObosnEdPostName.hide();
			ObosnZaprPredl.show();
		} else {
			ObosnEdPostPunkt.hide();
			ObosnEdPostName.hide();
			ObosnZaprPredl.hide();
		}
	}
};

//Зависимость от типа особой закупки
var TipOsobZakReg = function () {
	var TipOsobZakName = $("input[name='TipOsobZakCode']");
	var FinIKZ = $("input[name='FinIKZ']"); /*Объем обеспечения по ИКЗ*/
	/*var PerZakOpis= $("textarea[name='PerZakOpis']");*/
	var NameObZak = $("textarea[name='NameObZak']"); /*наименование объекта закупки*/
	//var RazmObKont = $("input[name='RazmObKont']"); /*Размер_обеспечения_контракта*/
	//var OrgBIK = $("input[name='OrgBIK']"); /*БИК_обеспечение_контракта_закупки*/
	//var OrgRS = $("input[name='OrgRS']"); /*РС_обеспечение_контракта_закупки*/
	//var OrgLS = $("input[name='OrgLS']"); /*ЛС_обеспечение_контракта_закупки*/
	//var UslObKontr = $("input[name='UslObKontr']"); /*Условия_обеспечения_контракта*/
	//var PorVnecObKontr = $("textarea[name='PorVnecObKontr']"); /*Порядок_внесения_денежных_средств_обеспечение_контракта*/
	var sposobPostkod = $("input[name='sposobPostkod']"); /*Способ_определения_поставщика_код*/
	var sposobPost = $("input[name='sposobPost']"); /*Способ_определения_поставщика наименование*/
	var ObosnEdPostName = $("input[name='ObosnEdPostName']");
	var ObosnEdPostPunkt = $("input[name='ObosnEdPostPunkt']");
	var ObosnEdPostPunktCode = $("input[name='ObosnEdPostPunktCode']");
	var ObosnEdPostPunktCodeButton = $("#ObosnEdPostPunktCode");
	var sposobPostkodButton = $("#sposobPostkod");
	var OrgBIKButton = $("#OrgBank");
	var registerOrganizatorName = $("input[name='registerOrganizatorName']");
	var BankSopr = $("input[name='BankSopr']");
	TipOsobZakName.change(function () {
		if ($(this).val() == "") {
			FinIKZ.prop("required", false);
			FinIKZ.val();

			NameObZak.prop("required", true);
			NameObZak.closest(".column-container").show();
			$("[data-related-field=NameObZak").show();
			NameObZak.closest(".column-container").find(".documentView-field-label").addClass("label-required");

			/* RazmObKont.closest(".column-container").show();
			$("[data-related-field=RazmObKont").show();
			RazmObKont.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			RazmObKont.prop("required", true);

			OrgBIK.closest(".column-container").show();
			$("[data-related-field=OrgBIK").show();
			OrgBIK.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			OrgBIK.prop("required", true);

			OrgRS.closest(".column-container").show();
			$("[data-related-field=OrgRS").show();
			OrgRS.closest(".column-container").find(".documentView-field-label").addClass("label-required");

			OrgLS.closest(".column-container").show();
			$("[data-related-field=OrgLS").show();
			OrgLS.closest(".column-container").find(".documentView-field-label").addClass("label-required"); */

			/* UslObKontr.closest(".column-container").show();
			$("[data-related-field=UslObKontr").show();
			UslObKontr.closest(".column-container").find(".documentView-field-label").addClass("label-required");

			PorVnecObKontr.closest(".column-container").show();
			$("[data-related-field=PorVnecObKontr").show();
			PorVnecObKontr.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			PorVnecObKontr.prop("required", true); */

			BankSopr.closest(".column-container").show();
			$("[data-related-field=BankSopr").show();
			BankSopr.closest(".column-container").find(".documentView-field-label").addClass("label-required");

			/* 	RazmObKont.prop("required", true); */

		}

		if ($(this).val() != "") {

			FinIKZ.prop("required", true);
			FinIKZ.show();

			NameObZak.prop("required", false);
			NameObZak.val();
			NameObZak.closest(".column-container").hide();
			NameObZak.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=NameObZak").hide();

			/* RazmObKont.prop("readonly", true);
			RazmObKont.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			RazmObKont.prop("required", false);
			RazmObKont.val();

			OrgBIK.prop("readonly", true);
			OrgBIKButton.prop("disabled", true);
			OrgBIK.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			OrgBIK.prop("required", false);
			OrgBIK.val();

			OrgRS.prop("readonly", true);
			OrgRS.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			OrgRS.prop("required", false);
			OrgRS.val();; */

			/* 	PorVnecObKontr.prop("readonly", true);
			PorVnecObKontr.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			PorVnecObKontr.prop("required", false);

			PorVnecObKontr.val(); */
			BankSopr.prop("readonly", true);

		}

		//TipOsobZak= "P7_2_83"
		if ($(this).val() == "P7_2_83") {
			sposobPostkod.val("ZP44");
			sposobPost.val("Запрос предложений");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Запрос предложений");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnZaprPredl.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			registerOrganizatorName.closest(".clearfix").find(".dict-display-field").prop("required", false);
			registerOrganizatorName.closest(".column-container").hide();
			$("[data-related-field=registerOrganizatorName").hide();

		}
		// TipOsobZak= "P4_1_93"
		if ($(this).val() == "P4_1_93") {
			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostName.val("Осуществление закупки товара, работы или услуги на сумму, не превышающую ста тысяч рублей");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 4 статьи 93");
			//	ObosnEdPostPunktCode.val("20300"); нет кода в словаре
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 4 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);

		}

		// TipOsobZak= "P5_1_93"
		if ($(this).val() == "P5_1_93") {
			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostName.val("Осуществление закупки товара, работы или услуги государственным или муниципальным учреждением культуры, уставными целями деятельности которого являются сохранение, использование и популяризация объектов культурного наследия, а также иным государственным или муниципальным учреждением");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 5 статьи 93");
			//ObosnEdPostPunktCode.val("20300"); нет кода в словаре
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 5 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);
		}

		// TipOsobZak= "P26_1_93"
		if ($(this).val() == "P26_1_93") {
			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.prop("readonly", true);
			ObosnEdPostName.val("Закупка услуг, связанных с направлением работника в служебную командировку, а также с участием в проведении фестивалей, концертов, представлений и подобных культурных мероприятий (в том числе гастролей) на основании приглашений на посещение указанных мероприятий");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 26 статьи 93");
			ObosnEdPostPunktCode.val("20300");
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 26 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);
		}

		// TipOsobZak= "P33_1_93"
		if ($(this).val() == "P33_1_93") {
			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostName.val("Закупка преподавательских услуг, а также услуг экскурсовода (гида), оказываемых физическими лицами");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 33 статьи 93");
			ObosnEdPostPunktCode.val("20360");
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 33 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);
		}
		// TipOsobZak= "P33_1_93_G"
		if ($(this).val() == "P33_1_93_G") {

			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Закупка преподавательских услуг, а также услуг экскурсовода (гида), оказываемых физическими лицами");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostName.val("Закупка преподавательских услуг, а также услуг экскурсовода (гида), оказываемых физическими лицами");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 33 статьи 93");
			ObosnEdPostPunktCode.val("20360");
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 33 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);
		}

		// TipOsobZak= "P23_1_93"
		if ($(this).val() == "P23_1_93") {
			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Закупка услуг по содержанию и ремонту одного или нескольких нежилых помещений, переданных в безвозмездное пользование или оперативное управление заказчику, в случае, если данные услуги оказываются другому лицу или другим лицам, пользующимся нежилыми помещениями, находящимися в здании, в котором расположены помещения, переданные заказчику в безвозмездное пользование или оперативное управление");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostName.val("Закупка преподавательских услуг, а также услуг экскурсовода (гида), оказываемых физическими лицами");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 23 статьи 93");
			ObosnEdPostPunktCode.val("20210");
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 23 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);
		}
		// TipOsobZak= "P42_1_93"
		if ($(this).val() == "P42_1_93") {
			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Заключение федеральным органом исполнительной власти, осуществляющим функции по выработке и реализации государственной политики и нормативно-правовому регулированию в сфере официального статистического учета, и его территориальными органами контрактов с физическими лицами на выполнение работ, связанных со сбором и с обработкой первичных статистических данных при проведении на территории Российской Федерации федерального статистического наблюдения в соответствии с законодательством Российской Федерации об официальном статистическом учете");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostName.val("Закупка преподавательских услуг, а также услуг экскурсовода (гида), оказываемых физическими лицами");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 42 статьи 93");
			//ObosnEdPostPunktCode.val("?");
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 42 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);
		}

		// TipOsobZak= "P44_1_93"
		if ($(this).val() == "P44_1_93") {
			sposobPostkod.val("EP44");
			sposobPost.val("Закупка у единственного поставщика (подрядчика, исполнителя)");
			sposobPostkod.closest(".clearfix").find(".dict-display-field").val("Закупка государственными и муниципальными библиотеками, организациями, осуществляющими образовательную деятельность, государственными и муниципальными научными организациями услуг по предоставлению права на доступ к информации, содержащейся в документальных, документографических, реферативных, полнотекстовых зарубежных базах данных и специализированных базах данных международных индексов научного цитирования у операторов указанных баз данных, включенных в перечень, утверждаемый Правительством Российской Федерации");
			sposobPost.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			sposobPostkod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sposobPostkod").show();
			ObosnEdPostName.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostName.val("Закупка преподавательских услуг, а также услуг экскурсовода (гида), оказываемых физическими лицами");
			ObosnEdPostPunkt.closest(".clearfix").find(".dict-display-field").prop("readonly", true);
			ObosnEdPostPunkt.val("Часть 1 пункт 44 статьи 93");
			//ObosnEdPostPunktCode.val("?");
			ObosnEdPostPunktCode.closest(".clearfix").find(".dict-display-field").val("Часть 1 пункт 44 статьи 93")
			ObosnEdPostPunktCodeButton.prop("disabled", true);
			sposobPostkodButton.prop("disabled", true);
		}
	});
	TipOsobZakName.change();
};

//Аванс на ред/регистрационное
var AvansRed = function () {
	var TipOsobZakName = $("input[name='TipOsobZakName']");
	var Avans = $("input[name='Avans']");

	TipOsobZakName.change(function () {
		if ($(this).val() == "") {
			Avans.prop("required", true);
		} else {
			Avans.prop("required", false);
		}
	});
	TipOsobZakName.change();
}

//Информация о возможности одностороннего отказа

var InfoOtkaza = function () {

	var sposobPostkod = $("input[name='sposobPostkod']");
	var InfoOtkaza = $("input[name='InfoOtkaza']");

	sposobPostkod.change(function () {
		if ($(this).val() == "ZK44") {

			InfoOtkaza.prop("required", true);

		} else {

			InfoOtkaza.prop("required", false);
		}
	});
	sposobPostkod.change();
};

//Случаи заключения контракта ЖЦ, редактирование
var Contract = function () {
	var flag = $("input[name='Contract']");

	var ContractTab = $("div[data-name='ContractTab']");

	flag.change(function () {
		if ($(flag).is(":checked")) {

			ContractTab.closest(".column-container").show();

		} else {

			ContractTab.closest(".column-container").hide();

		}

	});
	flag.change();
}
//на просмотр
//Внесение изменений на просмотр
var ChangeView = function () {
	var OsnVnChange = $("div[data-name='Основание внесения изменений']");
	var OpisChange = $("div[data-name='Содержание изменений']");
	var ZakIzm = $("div[data-name='Закупка изменена']").find("input[type='checkbox']");
	var ZakOtm = $("div[data-name='Закупка отменена']").find("input[type='checkbox']");

	if ($(ZakIzm).attr("checked") || $(ZakOtm).attr("checked")) {
		OsnVnChange.show();
		OpisChange.show();
		/* $("div[data-name='Закупка изменена']").hide();
		$("div[data-name='Закупка отменена']").hide(); */

	} else {
		OsnVnChange.hide();
		OpisChange.hide();

	}
};

//ответственное лицо орг совместных торгов
var SovTorg = function () {
	var SovTorgChek = $("input[name='SovTorgChek']");
	var OtvLicoCT = $("input[name='OtvLicoCT']");

	SovTorgChek.change(function () {
		if ($(SovTorgChek).is(":checked")) {

			OtvLicoCT.prop("required", true);
			OtvLicoCT.addClass("label-required");
			$("[data-related-field=soglasPerson]").addClass("label-required");

		} else {
			OtvLicoCT.val("");
			OtvLicoCT.prop("required", false);
			OtvLicoCT.removeClass("label-required");
			$("[data-related-field=soglasPerson]").removeClass("label-required");

		}
	});
	SovTorgChek.change();
}

var calculateProcentZayv = function () {

	function calculateSum() {
		var NMCKElement = $("input[name='NMCK']");
		var ProcentZayv = $("input[name='ProcentZayv']")
			var RazmObElement = $("input[name='RazmOb']");
		//ProcentZayv.val(Math.round(RazmObElement.val().replace(/ /g, '').replace(/,/g, '.') / (NMCKElement.val().replace(/ /g, '').replace(/,/g, '.')) * 100).toFixed(2));
		ProcentZayv.val((RazmObElement.val().replace(/ /g, '').replace(/,/g, '.') / (NMCKElement.val().replace(/ /g, '').replace(/,/g, '.')) * 100).toFixed(2));

	}
	$("input[name='RazmOb']").change(function () {
		calculateSum();
	});

}

// расчет обеспечения заявки от процента обеспечения
var calculateRazmZayv = function () {
	function calculateSum() {
		var NMCKElement = $("input[name='NMCK']");
		var RazmObElement = $("input[name='RazmOb']")
			var ProcentZayv = $("input[name='ProcentZayv']");
		RazmObElement.val((ProcentZayv.val().replace(/ /g, '').replace(/,/g, '.') * (NMCKElement.val().replace(/ /g, '').replace(/,/g, '.')) / 100).toFixed(2));
	}
	$("input[name='ProcentZayv']").change(function () {
		calculateSum();
	});
}

var calculateProcentKont = function () {

	function calculateSum() {
		var NMCKElement = $("input[name='NMCK']");
		var ProcentKont = $("input[name='ProcentKont']")
			var RazmObKont = $("input[name='RazmObKont']");
		ProcentKont.val((RazmObKont.val().replace(/ /g, '').replace(/,/g, '.') / (NMCKElement.val().replace(/ /g, '').replace(/,/g, '.')) * 100).toFixed(2));

	}
	$("input[name='RazmObKont']").change(function () {
		calculateSum();
	});

}

// расчет обеспечения контракта от процента обеспечения
var calculateRazmKont = function () {
	function calculateSum() {
		var NMCKElement = $("input[name='NMCK']");
		var RazmObKont = $("input[name='RazmObKont']")
			var ProcentKont = $("input[name='ProcentKont']");
		RazmObKont.val((ProcentKont.val().replace(/ /g, '').replace(/,/g, '.') * (NMCKElement.val().replace(/ /g, '').replace(/,/g, '.')) / 100).toFixed(2));
	}
	$("input[name='ProcentKont']").change(function () {
		calculateSum();
	});
}

var Preimushstva = function () {
	var table = $("div[data-name='PreimUch']");
	table.on('onTableRowAdded', function (event, rowKey) {
		var SposobOpredPost = $("input[name='sposobPostkod']");
		var Sposob = $(SposobOpredPost).parent().find("[data-parent-name='sposobPostkodparent']").val();
		var PreimUch = $("div[data-name='PreimUch'] input[name='PreimUch-PreimKodSposoba-" + rowKey + "']");
		var PreimUchKod = $(PreimUch).parent().find("[data-parent-name='PreimUch-PreimKodSposoba-" + rowKey + "parent']");
		PreimUchKod.val(Sposob);
		SposobOpredPost.change(function () {
			if ($(SposobOpredPost).val() != "") {
				var rows = $("#editView [data-name=PreimUch] [data-rowkey]");
				rows.each(function (index, element) {
					removeTableRow(element);
				});
			}
		});

	});
};

var Trebovan = function () {
	var table = $("div[data-name='TrebKUch']");
	table.on('onTableRowAdded', function (event, rowKey) {
		var SposobOpredPost = $("input[name='sposobPostkod']");
		var Sposob = $(SposobOpredPost).parent().find("[data-parent-name='sposobPostkodparent']").val();
		var TrebKUch = $("div[data-name='TrebKUch'] input[name='TrebKUch-TrebKodSposoba-" + rowKey + "']");
		var TrebKod = $(TrebKUch).parent().find("[data-parent-name='TrebKUch-TrebKodSposoba-" + rowKey + "parent']");
		TrebKod.val(Sposob);
		SposobOpredPost.change(function () {
			if ($(SposobOpredPost).val() != "") {
				var rows = $("#editView [data-name=TrebKUch] [data-rowkey]");
				rows.each(function (index, element) {
					removeTableRow(element);
				});
			}
		});

	});
};

var LimitUch = function () {
	var table = $("div[data-name='LimitUch']");
	table.on('onTableRowAdded', function (event, rowKey) {
		var SposobOpredPost = $("input[name='sposobPostkod']");

		var Sposob = $(SposobOpredPost).parent().find("[data-parent-name='sposobPostkodparent']").val();
		var LimitUch = $("div[data-name='LimitUch'] input[name='LimitUch-LimKodSposoba-" + rowKey + "']");
		var LimitUchKod = $(LimitUch).parent().find("[data-parent-name='LimitUch-LimKodSposoba-" + rowKey + "parent']");
		LimitUchKod.val(Sposob);
		SposobOpredPost.change(function () {
			if ($(SposobOpredPost).val() != "") {
				var rows = $("#editView [data-name=LimitUch] [data-rowkey]");
				var SMP = $("input[name='SMP']");
				rows.each(function (index, element) {
					removeTableRow(element);
					SMP.prop('checked', false);
				});
			}
		});

	});
};

//нормативная база

var NormBaseEdit = function () {
	var orgzakOkopf = $("select[name='orgzakOkopf']");
	var NormBase = $("input[name='NormBas_kod']");
	function ScrBlock() {
		var Status_Edit = orgzakOkopf.val();
		var statuses = [
			"65141",
			"65241",
			"75101",
			"75103",
			"75104"
		];
		if (($.inArray(Status_Edit, statuses) != -1)) {
			NormBase.val("PPF553");
		} else {
			NormBase.val("PPF554");
		}
	}
	ScrBlock();
	orgzakOkopf.change(function () {
		ScrBlock();
	});
}

//метод определения НМЦК

//скрытие колонки Метода определения цены
var ChangeMetodTab = function () {

	var table = $("div[data-name='MetodTab']");

	table.on('onTableRowAdded', function (event, rowKey) {

		var ObosnNotPrim = $("div[data-name='MetodTab'] input[name='MetodTab-ObosnNotPrim-" + rowKey + "']");
		var MetodNMCKkod = $("div[data-name='MetodTab'] input[name='MetodTab-MetodOpredId-" + rowKey + "']");
		var MetodNMCKName = $("div[data-name='MetodTab'] input[name='MetodTab-MetodOpred-" + rowKey + "']");
		var MetodOpredOpis = $("div[data-name='MetodTab'] input[name='MetodTab-MetodOpredOpis-" + rowKey + "']");
 var MetodOpredId = $("#MetodOpredId");
		var flag = $("input[data-field-name='notMetod']");

		MetodNMCKName.closest(".column-container").find(".dict-display-field").hide();
		MetodNMCKkod.closest(".column-container").find(".dict-display-field").hide();
		MetodOpredId.hide();

		$(MetodNMCKkod).closest(".table-edit-column").hide();
		$(MetodNMCKkod).parent().find(".dict-display-field").val("");
		$("div[title='Метод определения НМЦК']").hide();

		$(ObosnNotPrim).closest(".table-edit-column").hide();
		$(ObosnNotPrim).parent().find(".dict-display-field").val("");
		$("div[title='Обоснование невозможности применения']").hide();

		$(MetodOpredOpis).closest(".table-edit-column").hide();
		$(MetodOpredOpis).parent().find(".dict-display-field").val("");
		$("div[title='Метод определения НМЦК описание']").hide();

		flag.change(function () {
			if (flag.is(":checked")) {

				ObosnNotPrim.closest(".column-container").find(".dict-display-field").show();
				$(ObosnNotPrim).closest(".table-edit-column").show();
				$("div[title='Обоснование невозможности применения']").show();

				MetodOpredOpis.closest(".column-container").find(".dict-display-field").show();
				$(MetodOpredOpis).closest(".table-edit-column").show();
				$("div[title='Метод определения НМЦК описание']").show();

				MetodNMCKName.closest(".column-container").find(".dict-display-field").hide();
				MetodNMCKkod.closest(".column-container").find(".dict-display-field").hide();
				$(MetodNMCKkod).closest(".table-edit-column").hide();
						$(MetodNMCKName).closest(".table-edit-column").hide();
				$(MetodNMCKkod).parent().find(".dict-display-field").val("");
				$("div[title='Метод определения НМЦК']").hide();
					MetodOpredId.hide();;

			} else {

				ObosnNotPrim.closest(".column-container").find(".dict-display-field").hide();
				$(ObosnNotPrim).closest(".table-edit-column").hide();
				$(ObosnNotPrim).parent().find(".dict-display-field").val("");
				$("div[title='Обоснование невозможности применения']").hide();

				MetodOpredOpis.closest(".column-container").find(".dict-display-field").hide();
				$(MetodOpredOpis).closest(".table-edit-column").hide();
				$(MetodOpredOpis).parent().find(".dict-display-field").val("");
				$("div[title='Метод определения НМЦК описание']").hide();

				MetodNMCKName.closest(".column-container").find(".dict-display-field").show();
				MetodNMCKkod.closest(".column-container").find(".dict-display-field").show();
				$(MetodNMCKkod).closest(".table-edit-column").show();
				$(MetodNMCKName).closest(".table-edit-column").show();
				$(MetodNMCKkod).parent().find(".dict-display-field").val("");
				$("div[title='Метод определения НМЦК']").show();
					MetodOpredId.show();

			}
		});
		flag.change();

	});
	
};

//скрыть столбики таблицы в зависимости от флага Невозможно определить метод НМЦК, просмотр
var TableNMCK = function () {

	var tableNMCK = $("div[title='Метод определения НМЦК наименование']");

	var tableNMCKOpis = $("div[title='Метод определения НМЦК описание']");
	var tableNMCKObosn = $("div[title='Обоснование невозможности применения']");

	var flag = $("div[data-name='Невозможно применить метод определения НМЦК']").find("input[type='checkbox']");
	if ($(flag).is(":checked")) {

		tableNMCK.hide();

	} else {
		tableNMCKOpis.hide();
		tableNMCKObosn.hide();
	}
};

// расчет аванса от значение процента

var calculateAvans = function () {
	function calculateSum() {
		var NMCKElement = $("input[name='NMCK']");
		var Avans = $("input[name='Avans']")
			var ProcAvans = $("input[name='ProcAvans']");
		Avans.val((ProcAvans.val().replace(/ /g, '').replace(/,/g, '.') * (NMCKElement.val().replace(/ /g, '').replace(/,/g, '.')) / 100).toFixed(2));
	}
	$("input[name='ProcAvans']").change(function () {
		calculateSum();
	});
}

// расчет процента от аванса
var calculateProcAvans = function () {
	function calculateSum() {
		var NMCKElement = $("input[name='NMCK']");
		var Avans = $("input[name='Avans']")
			var ProcAvans = $("input[name='ProcAvans']");
		ProcAvans.val((Avans.val().replace(/ /g, '').replace(/,/g, '.') / (NMCKElement.val().replace(/ /g, '').replace(/,/g, '.')) * 100).toFixed(2));
	}
	$("input[name='Avans']").change(function () {
		calculateSum();
	});
}

//СМП
var SMP = function () {
	var table = $("div[data-name='LimitUch']");
	var SMP = $("input[name='SMP']");
	SMP.prop('checked', false);
	table.on('onTableRowAdded', function (event, rowKey) {

		var LimitUch = $("div[data-name='LimitUch'] input[name='LimitUch-BiznesKodLim-" + rowKey + "']");
		var LimitUchKod = $(LimitUch).parent().find("[data-parent-name='LimitUch-BiznesKodLim-" + rowKey + "parent']");

		LimitUch.change(function () {
			if (LimitUch.val() == "MB44330") {

				SMP.prop('checked', true);
			} else {
				SMP.prop('checked', false);
			}

		});
	});
};

//Требование обеспечения заявки обязательность
var TrebZayv = function () {
	var RazmOb = $("input[name='RazmOb']");
	var flag = $("input[name='TrebovOb']");
	var registerOrgZaBank = $("input[name='registerOrgZaBank']");
	var registerOrgZaRS = $("input[name='registerOrgZaRS']");
	var registerOrgZaLS = $("input[name='registerOrgZaLS']");
	var PorVnecOb = $("textarea[name='PorVnecOb']");
	var ProcentZayv = $("input[name='ProcentZayv']");

	flag.change(function () {
		if ($(flag).is(":checked")) {

			RazmOb.prop("required", true);
			RazmOb.addClass("label-required");
			$("[data-related-field=RazmOb]").addClass("label-required");

			registerOrgZaBank.closest(".column-container").find(".dict-display-field").prop("required", true);
			registerOrgZaBank.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=registerOrgZaBank]").closest(".column-container").find(".documentView-field-label").addClass("label-required");

			registerOrgZaRS.prop("required", true);
			registerOrgZaRS.addClass("label-required");
			$("[data-related-field=registerOrgZaRS]").addClass("label-required");

			registerOrgZaLS.prop("required", true);
			registerOrgZaLS.addClass("label-required");
			$("[data-related-field=registerOrgZaLS]").addClass("label-required");

			PorVnecOb.prop("required", true);
			PorVnecOb.addClass("label-required");
			$("[data-related-field=PorVnecOb]").addClass("label-required");

		} else {
			ProcentZayv.val("");

			RazmOb.val("");
			RazmOb.prop("required", false);
			RazmOb.removeClass("label-required");
			$("[data-related-field=RazmOb]").removeClass("label-required");

			registerOrgZaBank.closest(".column-container").find(".dict-display-field").val("");
			registerOrgZaBank.closest(".column-container").find(".dict-display-field").prop("required", false);
			registerOrgZaBank.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=registerOrgZaBank]").closest(".column-container").find(".documentView-field-label").removeClass("label-required");

			registerOrgZaRS.val("");
			registerOrgZaRS.prop("required", false);
			registerOrgZaRS.removeClass("label-required");
			$("[data-related-field=registerOrgZaRS]").removeClass("label-required");

			registerOrgZaLS.val("");
			registerOrgZaLS.prop("required", false);
			registerOrgZaLS.removeClass("label-required");
			$("[data-related-field=registerOrgZaLS]").removeClass("label-required");

			PorVnecOb.val("");
			PorVnecOb.prop("required", false);
			PorVnecOb.removeClass("label-required");
			$("[data-related-field=PorVnecOb]").removeClass("label-required");
		}
	});
	flag.change();
}

//Требование об обеспечении исполнения контракта обязательность
var TrebObKont = function () {
	var RazmObKont = $("input[name='RazmObKont']");
	var flag = $("input[name='TrebObKont']");
	var OrgBank = $("input[name='OrgBank']");
	var OrgRS = $("input[name='OrgRS']");
	var OrgLS = $("input[name='OrgLS']");
	var PorVnecObKontr = $("textarea[name='PorVnecObKontr']");
	var ProcentKont = $("input[name='ProcentKont']");

	flag.change(function () {
		if ($(flag).is(":checked")) {

			RazmObKont.prop("required", true);
			RazmObKont.addClass("label-required");
			$("[data-related-field=RazmObKont]").addClass("label-required");

			OrgBank.closest(".column-container").find(".dict-display-field").prop("required", true);
			OrgBank.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=OrgBank]").closest(".column-container").find(".documentView-field-label").addClass("label-required");

			OrgRS.prop("required", true);
			OrgRS.addClass("label-required");
			$("[data-related-field=OrgRS]").addClass("label-required");

			OrgLS.prop("required", true);
			OrgLS.addClass("label-required");
			$("[data-related-field=OrgLS]").addClass("label-required");

			PorVnecObKontr.prop("required", true);
			PorVnecObKontr.addClass("label-required");
			$("[data-related-field=PorVnecObKontr]").addClass("label-required");

		} else {
			ProcentKont.val("");

			RazmObKont.val("");
			RazmObKont.prop("required", false);
			RazmObKont.removeClass("label-required");
			$("[data-related-field=RazmObKont]").removeClass("label-required");

			OrgBank.closest(".column-container").find(".dict-display-field").val("");
			OrgBank.closest(".column-container").find(".dict-display-field").prop("required", false);
			OrgBank.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=OrgBank]").closest(".column-container").find(".documentView-field-label").removeClass("label-required");

			OrgRS.val("");
			OrgRS.prop("required", false);
			OrgRS.removeClass("label-required");
			$("[data-related-field=OrgRS]").removeClass("label-required");

			OrgLS.val("");
			OrgLS.prop("required", false);
			OrgLS.removeClass("label-required");
			$("[data-related-field=OrgLS]").removeClass("label-required");

			PorVnecObKontr.val("");
			PorVnecObKontr.prop("required", false);
			PorVnecObKontr.removeClass("label-required");
			$("[data-related-field=PorVnecObKontr]").removeClass("label-required");
		}
	});
	flag.change();
}

//Роль организатора закупки
var RollOrgZak = function () {
	var SovTorgChek = $("input[name='SovTorgChek']");
	var CentrTorgChek = $("input[name='CentrTorgChek']");
	var RolOrgZakName = $("input[name='RolOrgZakName']");
	var RolOrgZak = $("textarea[name='RolOrgZak']");
	var SovmTorg= $("input[name='SovmTorg']");//организатор совместных торгов
	var registerOrgZa= $("input[name='registerOrgZa']");//организатор-заказчик
	var registerOrganizator= $("input[name='registerOrganizator']");//организатор закупки
	
	RolOrgZakName.closest(".column-container").find(".dict-display-field").val("Заказчик");
	RolOrgZak.val("CU");
	RolOrgZakName.val("Заказчик");
	
	
	var Check=function(){
		
		if ($(SovTorgChek).is(":checked") && $(CentrTorgChek).is(":checked")) {
			RolOrgZakName.closest(".column-container").find(".dict-display-field").val("Уполномоченный орган в качестве организатора совместного конкурса (аукциона) согласно ст. 25 №44ФЗ");
			RolOrgZak.val("ORA");
			RolOrgZakName.val("Уполномоченный орган в качестве организатора совместного конкурса (аукциона) согласно ст. 25 №44ФЗ");
		}
		//Совместные_торги =0 && Централизованная_закупка =1
		if (!($(SovTorgChek).is(":checked")) && $(CentrTorgChek).is(":checked")) {
			RolOrgZakName.closest(".column-container").find(".dict-display-field").val("Уполномоченный орган");
			RolOrgZak.val("RA");
			RolOrgZakName.val("Уполномоченный орган");
		}
		
		//Совместные_торги =0 && Централизованная_закупка =0 && Организация_заказчик_наименование = Организатор_закупки
		if (!($(SovTorgChek).is(":checked")) && (!$(CentrTorgChek).is(":checked")) && $(registerOrganizator).val()==$(registerOrgZa).val() ) {
			RolOrgZakName.closest(".column-container").find(".dict-display-field").val("Заказчик");
			RolOrgZak.val("CU");
			RolOrgZakName.val("Заказчик");
		}
		if (!($(SovTorgChek).is(":checked")) && (!$(CentrTorgChek).is(":checked")) && $(registerOrganizator).val()!=$(registerOrgZa).val() ) {
			RolOrgZakName.closest(".column-container").find(".dict-display-field").val("");
			RolOrgZak.val("");
			RolOrgZakName.val(""); 
		}
		
		//Совместные_торги =1 && Централизованная_закупка =0 &
		if ($(SovTorgChek).is(":checked") && (!$(CentrTorgChek).is(":checked")) &&  $(SovmTorg).val()!= $(registerOrgZa).val()) {
			RolOrgZakName.closest(".column-container").find(".dict-display-field").val("Уполномоченное учреждение в качестве организатора совместного конкурса (аукциона) согласно ст. 25 №44ФЗ");
			RolOrgZak.val("OAI");
			RolOrgZakName.val("Уполномоченное учреждение в качестве организатора совместного конкурса (аукциона) согласно ст. 25 №44ФЗ");
		}
	//Совместные_торги =1 && Централизованная_закупка =0 &	
		if ($(SovTorgChek).is(":checked") && (!$(CentrTorgChek).is(":checked")) && $(SovmTorg).val()==$(registerOrgZa).val()) {
			RolOrgZakName.closest(".column-container").find(".dict-display-field").val("Заказчик в качестве организатора совместного аукциона");
			RolOrgZak.val("OCU");
			RolOrgZakName.val("Заказчик в качестве организатора совместного аукциона");
		}
	}
	
	  Check();
	   
	   SovTorgChek.change(function() {
        Check();
	});
	    SovTorgChek.change();
	
	CentrTorgChek.change(function () {
		Check();
	});

	CentrTorgChek.change();
	
	SovmTorg.change(function () {
		Check();
	});

	SovmTorg.change();
	
	registerOrganizator.change(function () {
		Check();
	});

	registerOrganizator.change();
	


}

var Osnov = function () {

	var SposobOpredPost = $("input[name='sposobPostkod']");
	var ObosnEdPostPunktCode = $("input[name='ObosnEdPostPunktCode']");
	var Sposob = $(SposobOpredPost).parent().find("[data-parent-name='sposobPostkodparent']").val();
	SposobOpredPost.change(function () {
		if ($(SposobOpredPost).val() == "EP44") {
			ObosnEdPostPunktCode.val("FZ44");
		}

	});

};

/*  if ($(flagChange).is(":checked")){

flagCancel.closest(".column-container").css('visibility', 'hidden')
flagCancel.attr("checked", false)
Status.val('Отмена')
} else {
flagCancel.closest(".column-container").css('visibility', 'visible')
Status.val('Подача заявок')
}
}); */

scopes.onView(EditReg);
scopes.onView(registerOKPDView);
scopes.onView(registerKVRView);
scopes.onView(flagNMCK);
scopes.onView(LifeCicleView);
scopes.onView(TableNMCK);
scopes.onView(sposobPostkodView);
scopes.onView(ChangeView);

scopes.onRegister(calculateRazmKont);
scopes.onRegister(calculateRazmZayv);
scopes.onRegister(Osnov);
scopes.onRegister(RollOrgZak);
scopes.onRegister(TipOsobZakReg);
scopes.onRegister(TrebZayv);
scopes.onRegister(TrebObKont);
scopes.onRegister(SMP);
scopes.onRegister(calculateAvans);
scopes.onRegister(calculateProcAvans);
scopes.onRegister(ChangeMetodTab);
scopes.onRegister(NormBaseEdit);
scopes.onRegister(SovTorg);
scopes.onRegister(Preimushstva);
scopes.onRegister(Trebovan);
scopes.onRegister(LimitUch);
scopes.onRegister(calculateProcentZayv);
scopes.onRegister(calculateProcentKont);
scopes.onRegister(EditRegCol);
scopes.onRegister(EditReg);
scopes.onRegister(EditRegSum);
scopes.onRegister(sposobPostkod);
scopes.onRegister(AvansRed);
scopes.onRegister(InfoOtkaza);
scopes.onRegister(Contract);


scopes.onEdit(calculateRazmKont);
scopes.onEdit(Osnov);
scopes.onEdit(calculateRazmZayv);
scopes.onEdit(RollOrgZak);
scopes.onEdit(TipOsobZakReg);
scopes.onEdit(TrebObKont);
scopes.onEdit(TrebZayv);
scopes.onEdit(SMP);
scopes.onEdit(calculateProcAvans);
scopes.onEdit(calculateAvans);
scopes.onEdit(ChangeMetodTab);
scopes.onEdit(NormBaseEdit);
scopes.onEdit(SovTorg);
scopes.onEdit(Preimushstva);
scopes.onEdit(Trebovan);
scopes.onEdit(LimitUch);
scopes.onEdit(calculateProcentZayv);
scopes.onEdit(calculateProcentKont);
scopes.onEdit(EditRegSum);
scopes.onEdit(EditRegCol);
scopes.onEdit(EditReg);
scopes.onEdit(sposobPostkod);
scopes.onEdit(AvansRed);
scopes.onEdit(InfoOtkaza);
scopes.onEdit(Contract);
