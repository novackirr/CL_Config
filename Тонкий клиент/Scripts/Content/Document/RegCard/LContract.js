"use strict";

var EditReg = function () {
	
	$("li:has(:contains('Скрытые поля'))").hide();
	
}



//скрыть кнопку Добавить строку на вкладке Исполнение
var knopka=function() {
	$("div[data-deleted-attachment-keys='EtapIspolnenie_deletedAttachments'] div.table-add-row-button").hide(); 
}

//скрытие полей
var CurrrencyReg = function () {
	var flag = $(" input[name='currency']");
	var CurrencyCurs = $(" input[name='curs']");
	var CurrencyNominal = $(" input[name='nominal']");
	var CurrencyPriceRub = $(" input[name='pricerub']");
	var CurrencyNDSRub = $(" input[name='ndsrub']");
	var CurrencyPrice = $(" input[name='price']");
	flag.change(function () {
		if ($(this).val() == "RUB") {
			CurrencyCurs.val("");
			CurrencyNominal.val("");
			CurrencyPriceRub.val("");
			CurrencyNDSRub.val("");
			CurrencyCurs.prop("required", false);
			CurrencyCurs.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			CurrencyCurs.closest(".column-container").hide();
			$("[data-related-field=curs]").hide();
			$("[data-related-field=curs]").removeClass("label-required");
			CurrencyNominal.closest(".column-container").hide();
			$("[data-related-field=nominal]").hide();
			CurrencyPriceRub.closest(".column-container").hide();
			$("[data-related-field=pricerub]").hide();
			CurrencyNDSRub.closest(".column-container").hide();
			$("[data-related-field=ndsrub]").hide();		
			} else {
			CurrencyNominal.val("1");
			CurrencyCurs.prop("required", true);
			CurrencyCurs.closest(".column-container").show();
			CurrencyCurs.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=curs]").show();
			$("[data-related-field=curs]").addClass("label-required");
			CurrencyNominal.closest(".column-container").show();
			$("[data-related-field=nominal]").show();
			CurrencyPriceRub.closest(".column-container").show();
			$("[data-related-field=pricerub]").show();
			CurrencyNDSRub.closest(".column-container").show();
			$("[data-related-field=ndsrub]").show();
			calculatePriceReg();
		}
		
	});
	flag.change();
}

//проставлять текущий год в таблицу Этапы исполнения
var god_reg = function() {	
	var god = $("input[data-field-name*='PlatejEtapbudjet-YearBudjet']");
    var Data = new Date();
	var Year = Data.getFullYear();	
    god.val( Year ); 
};

var god_reg1 = function() {	
	var god1 = $("input[data-field-name*='PlatejEtapVnebudjet-YearVnebudjet']");
    var Data = new Date();
	var Year = Data.getFullYear();	
    god1.val( Year ); 
};

//на просмотр
var CurrrencyView = function () {
	var CurrrencyCurs1 = $("div[data-name='Курс валюты']");
	var CurrencyNominal1 = $("div[data-name='Номинал валюты']");
	var CurrencyPriceRub1 = $("div[data-name='Цена контракта в руб.']");
	var CurrencyNDSRub1 = $("div[data-name='НДС в руб.']");
	var Valuta = $(".documentView-field-value[data-name='Валюта']").text();
	if (Valuta!=="Российский рубль") {
		CurrrencyCurs1.show();
		CurrencyNominal1.show();
		CurrencyPriceRub1.show();
		CurrencyNDSRub1.show();
		} else {
		CurrrencyCurs1.hide();
		CurrencyNominal1.hide();
		CurrencyPriceRub1.hide();
		CurrencyNDSRub1.hide();
	}
};

//скрыть поле "Формула цены"
var FormulaReg = function () {
	var flag = $(" input[name='sposob']");
	var Formul = $(" textarea[name='formula']");
	flag.change(function () {
		if ($(this).val() !== "MP") {
			Formul.val("");
			Formul.closest(".clearfix").find(".form-control").prop("required", false);
			Formul.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			Formul.closest(".column-container").hide();
			Formul.closest(".clearfix").find(".dict-display-field").val("");
			$("[data-related-field=formula]").hide();
			$("[data-related-field=formula]").removeClass("label-required");
			
			} else {
			Formul.closest(".column-container").show();
			Formul.closest(".clearfix").find(".form-control").prop("required", true);
			Formul.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=formula]").show();
			$("[data-related-field=formula]").addClass("label-required");
		}
		
	});
	flag.change();
}

var FormulaEdit = function () {
	var flag = $("#editView input[name='sposob']");
	var Formul = $("#editView textarea[name='formula']");
	flag.change(function () {
		if ($(this).val() !== "MP") {
			Formul.val("");
			Formul.closest(".clearfix").find(".form-control").prop("required", false);
			Formul.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			Formul.closest(".column-container").hide();
			Formul.closest(".clearfix").find(".dict-display-field").val("");
			$("[data-related-field=formula]").hide();
			$("[data-related-field=formula]").removeClass("label-required");
			
			} else {
			Formul.closest(".column-container").show();
			Formul.closest(".clearfix").find(".form-control").prop("required", true);
			Formul.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=formula]").show();
			$("[data-related-field=formula]").addClass("label-required");
		}
		
	});
	flag.change();
}

//на просмотр
var FormulaView = function () {
	var Formul1 = $("div[data-name='Формула цены']");
	var SposobPrice = $(".documentView-field-value[data-name='Способ указания цены']").text();
	var codes = [
		"MP",
	];
	if ($.inArray(SposobPrice, codes) == 1) {
		Formul1.show();
		} else {
		Formul1.hide();
	}
};

var calculatePriceReg = function () {
	
	function calculatePrice() {
		var priceElement = $("input[name='price']");
		var cursElement = $("input[name='curs']");
		var nominalElement = $("input[name='nominal']");
		
/* 		var p = priceElement.val();
		var s = cursElement.val();
		var m = nominalElement.val();
		var Price = p.replace(/ /g, '').replace(/,/g, '.')*1; 
        var val =  parseFloat(Price ? Price : 0);
		var curs = s.replace(/ /g, '').replace(/,/g, '.')*1; 
		var val1 =  parseFloat(curs ? curs : 0);
		var nominal = m.replace(/ /g, '').replace(/,/g, '.')*1; 
		var val2 =  parseFloat(nominal ? nominal : 0); */
var k=priceElement.val().replace(/ /g, '').replace(/,/g, '.')/nominalElement.val().replace(/ /g, '').replace(/,/g, '.')*cursElement.val().replace(/ /g, '').replace(/,/g, '.');
var w=k.toFixed(2);

		$("input[name='pricerub']").val(w);
	
var m = $("input[name='pricerub']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='pricerub']").val(Sum2); 
}
else{
   var str=",00";
		var u=w+str;
		$("input[name='pricerub']").val(u);
}
		}
	
	
	$("input[name='price']").change(function () {
		calculatePrice();
	});
	
	$("input[name='pricerub']").change(function () {
		calculatePrice();
	});
	
	$("input[name='curs']").change(function () {
		calculatePrice();
	});
	
	$("input[name='nominal']").change(function () {
		calculatePrice();
	});
	
	$("input[data-field-name='currency']").change(function () {
		calculatePrice();
	});
	
}

var calculateVolume = function () {
	function calculateVolumePercent() {
		
		var priceForVolumeElement;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var priceForVolumeElement = $("input[name='price']");   
		} 
		else {
			var priceForVolumeElement = $("input[name='pricerub']");
		}
		
		// В поле ожидается либо стандартный float 123.12 либо формат с разделителями 12 345,12
		// Надо привести все к штатному виду
		//var flVolume = volume.val().replace(/ /g, '').replace(/,/g, '.');  
		
		//var Price2 = priceForVolumeElement.autoNumeric('get')*1;
		var Price2 = priceForVolumeElement.val().replace(/ /g, '').replace(/,/g, '.')*1; 
		var obemRubElement = $("input[name='obemrub']");
		
		//var ObemRub2 = obemRubElement.autoNumeric('get')*1;
		var ObemRub2 = obemRubElement.val().replace(/ /g, '').replace(/,/g, '.')*1; 
		var c=ObemRub2 / Price2 * 100;
		var ObemElement=c.toFixed(2);
		
		$("input[name='obem']").val(ObemElement);
	}
	
	
	calculateVolumePercent();
	
	function calculateVolumeRubl() {
		
		
		var priceForVolumeRubElement;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var priceForVolumeElement = $("input[name='price']");   
		} 
		else {
			var priceForVolumeElement = $("input[name='pricerub']");
		}
		
		// В поле ожидается либо стандартный float 123.12 либо формат с разделителями 12 345,12
		// Надо привести все к штатному виду
		//var flVolume = volume.val().replace(/ /g, '').replace(/,/g, '.');  
		
		//var Price2 = priceForVolumeElement.autoNumeric('get')*1;
		var Price2 = priceForVolumeElement.val().replace(/ /g, '').replace(/,/g, '.')*1; 
		var obemElement = $("input[name='obem']");
		
		
		//var ObemRub2 = obemRubElement.autoNumeric('get')*1;
		var Obem2 = parseFloat(obemElement.val() ? obemElement.val() : 0);
		
		var ObemRubElement = $("input[name='obemrub']");
		
		var r=Obem2 * Price2 / 100;
		var j=r.toFixed(2);
		ObemRubElement.val(j);
	
var m = ObemRubElement.val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=ObemRubElement.val(Sum2); 
}else{
   var str=",00";
		var u=j+str;
		ObemRubElement.val(u);
		}
	}
	
	
	calculateVolumeRubl();

function clear() {	
	var  price = $("input[name='price']");
	var  pricerub = $("input[name='pricerub']");
	var  obem = $("input[name='obem']");
	var  obemrub = $("input[name='obemrub']");
	obem.val("");
	obem.closest(".clearfix").find(".number").val("");
	obemrub.val("");
	obemrub.closest(".clearfix").find(".money").val("");
}
	
	$("input[name='price']").change(function () {
		calculateVolumePercent();
		calculateVolumeRubl();
		clear();
	});
	
	$("input[name='pricerub']").change(function () {
		calculateVolumePercent();
		calculateVolumeRubl();
		clear();
	}); 
	
	$("input[name='obem']").change(function () {
		calculateVolumeRubl();
	});
	
	$("input[name='obemrub']").change(function () {
		calculateVolumePercent();
	});
	
	
	
	$("input[name='currency']").change(function () {
		calculateVolumePercent();
		calculateVolumeRubl();
	}); 
	
}

//скрыть дата прекращения банковской гарантии
var BankGarantiaReg = function() {
	var flag = $("input[name='PrekraschenieBG']");
	var Data=$("input[name='DatePrekraschenieBG']");
	flag.change(function() {
        if ($(this).is(":checked")) {		
			Data.closest(".column-container").show();		
			$("[data-related-field=DatePrekraschenieBG]").show();
		}
		else
		{   
		    Data.val("");		
			Data.closest(".column-container").hide();
			Data.closest(".clearfix").find(".dict-display-field").val("");
			$("[data-related-field=DatePrekraschenieBG]").hide();
		}
		
	});
	flag.change ();
}	

//на редактирование	

var BankGarantiaEdit = function() {
	var flag = $("#editView input[name='PrekraschenieBG']");
	var Data=$("#editView input[name='DatePrekraschenieBG']");
	flag.change(function() {
        if (!$(this).is(":checked")) {
			Data.closest(".column-container").hide();
			Data.val("");		
			Data.closest(".clearfix").find(".dict-display-field").val("");
			$("[data-related-field=DatePrekraschenieBG]").hide();
		}
		else
		{
			Data.closest(".column-container").show();					
			$("[data-related-field=DatePrekraschenieBG").show();
		}
		
	});
	flag.change ();
}

//на просмотр

var BankGarantiaView = function() {
    var Data1 = $("div[data-name='Дата прекращения банковской гарантии']");
    var flag = $("div[data-name='Прекращение банковской гарантии']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        Data1.show();
		} else {
        Data1.hide();		
	}
};

//поле Основание для изменений обязательное
var OsnovanieReg = function() {
	var flag = $("input[name='CorrectMistake']");
	var Izmenenie=$("textarea[name='IzmenenieOsnovanie']");
	flag.change(function() {
        if ($(this).is(":checked")) {		
			Izmenenie.prop("required", true);
			Izmenenie.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=IzmenenieOsnovanie]").addClass("label-required");
		}
		else
		{   
			Izmenenie.prop("required", false);
			Izmenenie.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=IzmenenieOsnovanie]").removeClass("label-required");
		}
		
	});
	flag.change ();
}	

//на редактирование	

var OsnovanieEdit = function() {
	var flag = $("#editView input[name='CorrectMistake']");
	var Izmenenie=$("#editView textarea[name='IzmenenieOsnovanie']");
	flag.change(function() {
        if (!$(this).is(":checked")) {	
			Izmenenie.prop("required", false);
			Izmenenie.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=IzmenenieOsnovanie]").removeClass("label-required");
		}
		else
		{
			Izmenenie.prop("required", true);
			Izmenenie.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=IzmenenieOsnovanie]").addClass("label-required");
		}
		
	});
	flag.change ();
}

//Если вид документа Изменение сделать обязательными поля Дата документа основания изменения, Причина изменений контракта, Реквизиты документа основания изменений, Документ основания изменения контракта
var VidReg = function() {
	var viddocument=$("input[name='viddocument']");
	var block = $("li:has(:contains('Изменения'))");
	if ($(viddocument).val() == "Изменение") {
	 block.show();
	}
	else{
	block.hide();
	}
}

var VidDocIzmenenie = function() {
	var viddocument=$("input[name='viddocument']");
	var DateDocIzmen=$("input[name='DateDocIzmen']");
	var Prichina=$("input[name='Prichina']");
	var IzmenenieRekvizity=$("textarea[name='IzmenenieRekvizity']");
	var CodeDocOsnovanie=$("input[name='CodeDocOsnovanie']");
	var CorrectMistake=$("input[name='CorrectMistake']");
	var block = $("li:has(:contains('Изменения'))");
	viddocument.change(function() {
		if ($(viddocument).val() == "Изменение") {
		   block.show();
			DateDocIzmen.closest(".clearfix").find(".date-field").prop("required", true);
            DateDocIzmen.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=DateDocIzmen]").addClass("label-required");
			Prichina.closest(".clearfix").find(".dict-display-field").prop("required", true);
			Prichina.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=Prichina]").addClass("label-required");
			IzmenenieRekvizity.closest(".clearfix").find(".form-control").prop("required", true);
			IzmenenieRekvizity.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field= IzmenenieRekvizity]").addClass("label-required");
			CodeDocOsnovanie.closest(".clearfix").find(".dict-display-field").prop("required", true);
			CodeDocOsnovanie.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=CodeDocOsnovanie]").addClass("label-required");
		}
		else
		{   	
	block.hide();
			DateDocIzmen.closest(".clearfix").find(".date-field").prop("required", false);
			DateDocIzmen.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=DateDocIzmen]").removeClass("label-required");
			Prichina.closest(".clearfix").find(".dict-display-field").prop("required", false);
			Prichina.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=Prichina]").removeClass("label-required");
			IzmenenieRekvizity.closest(".clearfix").find(".form-control").prop("required", false);
			IzmenenieRekvizity.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field= IzmenenieRekvizity]").removeClass("label-required");
			CodeDocOsnovanie.closest(".clearfix").find(".dict-display-field").prop("required", false);
			CodeDocOsnovanie.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=CodeDocOsnovanie]").removeClass("label-required");
			
		}
	});
}

var VidDocIzmenenieView = function() {
 var Vid = $(".documentView-field-value[data-name='Вид документа']").text();
 var block = $("li:has(:contains('Изменения'))");

    if  (Vid=="Изменение") {
        block.show();
    } else {
        block.hide();
    }
}
//вкладка Обеспечение исполнения
var ObespechIspol = function() {
	var  trebov = $("input[data-field-name='trebov']");
	var  bankgarantia = $("input[name='bankgarantia']");
	var  vnesenieds = $("input[name='vnesenieds']");
	var  reestrnumber = $("input[name='reestrnumber']");
	var  CodeValut = $("input[name='CodeValut']");
	var  sumbankrub = $("input[name='sumbankrub']");
	var  razmerobes = $("input[name='razmerobes']");
	var  kursvalut = $("input[name='kursvalut']");
	var  valuta = $("input[name='valuta']");
	var  sumbank = $("input[name='sumbank']");
	var  nomerdocreestr = $("input[name='nomerdocreestr']");
	var  kursvaluta = $("input[name='kursvaluta']");
	var  razmerobesrub = $("input[name='razmerobesrub']");
	var  ValutName = $("input[name='ValutName']");
	var  ValutaName = $("input[name='ValutaName']");
	trebov.change(function() {
        if (!$(this).is(":checked")) {
			bankgarantia.prop('checked', false);
			vnesenieds.prop('checked', false);
			bankgarantia.closest(".column-container").hide();
			vnesenieds.closest(".column-container").hide();
			reestrnumber.val("");
			CodeValut.val("");
			CodeValut.closest(".clearfix").find(".dict-display-field").val("");
			ValutName.val("");
			ValutName.closest(".clearfix").find(".dict-display-field").val("");
			valuta.val("");
			valuta.closest(".clearfix").find(".dict-display-field").val("");
			ValutaName.val("");
			ValutaName.closest(".clearfix").find(".dict-display-field").val("");
			reestrnumber.closest(".clearfix").find(".form-control").val("");
			sumbankrub.val("");
			sumbankrub.closest(".clearfix").find(".form-control").val("");
			razmerobes.val("");
			razmerobes.closest(".clearfix").find(".form-control").val("");
			reestrnumber.closest(".column-container").hide();
			sumbank.closest(".column-container").hide();
			CodeValut.closest(".column-container").hide();
			kursvalut.closest(".column-container").hide();
			sumbankrub.closest(".column-container").hide();
			nomerdocreestr.closest(".column-container").hide();
			razmerobes.closest(".column-container").hide();
			valuta.closest(".column-container").hide();
			kursvaluta.closest(".column-container").hide();
			razmerobesrub.closest(".column-container").hide();
			$("[data-related-field=reestrnumber]").hide();
			$("[data-related-field=sumbank]").hide();
			$("[data-related-field=CodeValut]").hide();
			$("[data-related-field=kursvalut]").hide();
			$("[data-related-field=sumbankrub]").hide();
			$("[data-related-field=nomerdocreestr]").hide();
			$("[data-related-field=razmerobes]").hide();
			$("[data-related-field=valuta]").hide();
			$("[data-related-field=kursvaluta]").hide();
			$("[data-related-field=razmerobesrub]").hide();
			reestrnumber.prop("required", false);
			reestrnumber.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=reestrnumber]").removeClass("label-required");
			CodeValut.closest(".clearfix").find(".dict-display-field").prop("required", false);
			CodeValut.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=CodeValut]").removeClass("label-required");
			sumbank.prop("required", false);
			sumbank.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=sumbank]").removeClass("label-required");
			razmerobes.prop("required", false);
			razmerobes.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=razmerobes]").removeClass("label-required");
			valuta.closest(".clearfix").find(".dict-display-field").prop("required", false);
			valuta.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=valuta]").removeClass("label-required");
			kursvalut.prop("required", false);
			kursvalut.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=kursvalut]").removeClass("label-required");
			sumbankrub.prop("required", false);
			sumbankrub.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=sumbankrub]").removeClass("label-required");
		}
		else
		{ 
			bankgarantia.closest(".column-container").show();
			BankGarantChecked();
			vnesenieds.closest(".column-container").show();
		}
	});
	trebov.change ();
}

var BankGarantChecked = function() {
	var  trebov = $("input[name='trebov']");
	var  bankgarantia = $("input[data-field-name='bankgarantia']");
	var  vnesenieds = $("input[name='vnesenieds']");
	var  reestrnumber = $("input[name='reestrnumber']");
	var  CodeValut = $("input[name='CodeValut']");
	var  sumbankrub = $("input[name='sumbankrub']");
	var  sumbank = $("input[name='sumbank']");
	var  razmerobes = $("input[name='razmerobes']");
	var  razmerobesrub = $("input[name='razmerobesrub']");
	var  valuta = $("input[name='valuta']");
	var  kursvalut = $("input[name='kursvalut']");
	var  kursvaluta = $("input[name='kursvaluta']");
	var  nomerdocreestr = $("input[name='nomerdocreestr']");
	var  ValutName = $("input[name='ValutName']");
	var  ValutaName = $("input[name='ValutaName']");
	bankgarantia.change(function() {
        if (!$(this).is(":checked")) {
			CodeValut.val("");
			CodeValut.closest(".clearfix").find(".dict-display-field").val("");
			ValutName.val("");
			ValutName.closest(".clearfix").find(".dict-display-field").val("");
			reestrnumber.val("");
			reestrnumber.closest(".clearfix").find(".form-control").val("");
			sumbankrub.val("");
			sumbankrub.closest(".clearfix").find(".form-control").val("");
			reestrnumber.closest(".column-container").hide();
			sumbank.closest(".column-container").hide();
			CodeValut.closest(".column-container").hide();
			nomerdocreestr.closest(".column-container").hide();
			$("[data-related-field=reestrnumber]").hide();
			$("[data-related-field=sumbank]").hide();
			$("[data-related-field=CodeValut]").hide();
			$("[data-related-field=nomerdocreestr]").hide();
			/* 		razmerobes.closest(".column-container").show();
				valuta.closest(".column-container").show();
				$("[data-related-field=razmerobes]").show();
			$("[data-related-field=valuta]").show(); */
			reestrnumber.prop("required", false);
			reestrnumber.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=reestrnumber]").removeClass("label-required");
			CodeValut.closest(".clearfix").find(".dict-display-field").prop("required", false);
			CodeValut.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=CodeValut]").removeClass("label-required");
			sumbank.prop("required", false);
			sumbank.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=sumbank]").removeClass("label-required");
			razmerobes.prop("required", true);
			razmerobes.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=razmerobes]").addClass("label-required");
			valuta.closest(".clearfix").find(".dict-display-field").prop("required", true);
			valuta.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=valuta]").addClass("label-required");
			BankCursChecked();
		}
		else
		{ 
			valuta.val("");
			valuta.closest(".clearfix").find(".dict-display-field").val("");
			ValutaName.val("");
			ValutaName.closest(".clearfix").find(".dict-display-field").val("");
			vnesenieds.prop('checked', false);
			razmerobes.val("");
			razmerobes.closest(".clearfix").find(".form-control").val("");
			reestrnumber.closest(".column-container").show();
			sumbank.closest(".column-container").show();
			CodeValut.closest(".column-container").show();
			nomerdocreestr.closest(".column-container").show();
			$("[data-related-field=reestrnumber]").show();
			$("[data-related-field=sumbank]").show();
			$("[data-related-field=CodeValut]").show();
			$("[data-related-field=nomerdocreestr]").show();
			razmerobes.closest(".column-container").hide();
			valuta.closest(".column-container").hide();
			$("[data-related-field=razmerobes]").hide();
			$("[data-related-field=valuta]").hide();
			reestrnumber.prop("required", true);
			reestrnumber.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=reestrnumber]").addClass("label-required");
			CodeValut.closest(".clearfix").find(".dict-display-field").prop("required", true);
			CodeValut.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=CodeValut]").addClass("label-required");
			sumbank.prop("required", true);
			sumbank.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sumbank]").addClass("label-required");		
			razmerobes.prop("required", false);
			razmerobes.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=razmerobes]").removeClass("label-required");
			valuta.closest(".clearfix").find(".dict-display-field").prop("required", false);
			valuta.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=valuta]").removeClass("label-required");
			DSCursChecked();
		}
	});
	bankgarantia.change ();
}

var vneseniedsChecked = function() {
	var  trebov = $("input[name='trebov']");
	var  bankgarantia = $("input[data-field-name='bankgarantia']");
	var  vnesenieds = $("input[data-field-name='vnesenieds']");
	var  razmerobes = $("input[name='razmerobes']");
	var  valuta = $("input[name='valuta']");
	var  reestrnumber = $("input[name='reestrnumber']");
	var  CodeValut = $("input[name='CodeValut']");
	var  sumbankrub = $("input[name='sumbankrub']");
	var  sumbank = $("input[name='sumbank']");
	var  kursvaluta = $("input[name='kursvaluta']");
	var  kursvalut = $("input[name='kursvalut']");
	var  nomerdocreestr = $("input[name='nomerdocreestr']");
	var  razmerobesrub = $("input[name='razmerobesrub']");
	var  ValutName = $("input[name='ValutName']");
	var  ValutaName = $("input[name='ValutaName']");
	vnesenieds.change(function() {
        if (!$(this).is(":checked")) {
			valuta.val("");
			valuta.closest(".clearfix").find(".dict-display-field").val("");
			ValutaName.val("");
			ValutaName.closest(".clearfix").find(".dict-display-field").val("");
			razmerobes.val("");
			razmerobes.closest(".clearfix").find(".form-control").val("");
			reestrnumber.closest(".column-container").show();
			sumbank.closest(".column-container").show();
			CodeValut.closest(".column-container").show();
			nomerdocreestr.closest(".column-container").show();
			$("[data-related-field=reestrnumber]").show();
			$("[data-related-field=sumbank]").show();
			$("[data-related-field=CodeValut]").show();
			$("[data-related-field=nomerdocreestr]").show();
			razmerobes.closest(".column-container").hide();
			valuta.closest(".column-container").hide();
			$("[data-related-field=razmerobes]").hide();
			$("[data-related-field=valuta]").hide();
			reestrnumber.prop("required", true);
			reestrnumber.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=reestrnumber]").addClass("label-required");
			CodeValut.closest(".clearfix").find(".dict-display-field").prop("required", true);
			CodeValut.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=CodeValut]").addClass("label-required");
			sumbank.prop("required", true);
			sumbank.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sumbank]").addClass("label-required");		
			razmerobes.prop("required", false);
			razmerobes.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=razmerobes]").removeClass("label-required");
			valuta.closest(".clearfix").find(".dict-display-field").prop("required", false);
			valuta.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=valuta]").removeClass("label-required");
			DSCursChecked();
			
		}
		else
		{ 
			CodeValut.val("");
			ValutName.val("");
			reestrnumber.val("");
			sumbankrub.val("");
			bankgarantia.prop('checked', false);
			reestrnumber.closest(".column-container").hide();
			sumbank.closest(".column-container").hide();
			CodeValut.closest(".column-container").hide();
			nomerdocreestr.closest(".column-container").hide();
			$("[data-related-field=reestrnumber]").hide();
			$("[data-related-field=sumbank]").hide();
			$("[data-related-field=CodeValut]").hide();
			$("[data-related-field=nomerdocreestr]").hide();
			razmerobes.closest(".column-container").show();
			valuta.closest(".column-container").show();
			$("[data-related-field=razmerobes]").show();
			$("[data-related-field=valuta]").show();
			reestrnumber.prop("required", false);
			reestrnumber.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=reestrnumber]").removeClass("label-required");
			CodeValut.closest(".clearfix").find(".dict-display-field").prop("required", false);
			CodeValut.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=CodeValut]").removeClass("label-required");
			sumbank.prop("required", false);
			sumbank.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=sumbank]").removeClass("label-required");
			razmerobes.prop("required", true);
			razmerobes.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=razmerobes]").addClass("label-required");
			valuta.closest(".clearfix").find(".dict-display-field").prop("required", true);
			valuta.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=valuta]").addClass("label-required");
			BankCursChecked();
		}	
	});
}

var BankCursChecked= function() {
	var  CodeValut = $("input[name='CodeValut']");
	var  kursvalut = $("input[name='kursvalut']");
	var  sumbankrub = $("input[name='sumbankrub']");
	CodeValut.change(function () {
		if ($(CodeValut).val() == "RUB" ||  ($(CodeValut).val().length==0 && $(CodeValut).val()!==null)){	
			kursvalut.val("");
			sumbankrub.val("");
			kursvalut.closest(".column-container").hide();
			sumbankrub.closest(".column-container").hide();
			$("[data-related-field=kursvalut]").hide();
			$("[data-related-field=sumbankrub]").hide();
			kursvalut.prop("required", false);
			kursvalut.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=kursvalut]").removeClass("label-required");
			sumbankrub.prop("required", false);
			sumbankrub.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=sumbankrub]").removeClass("label-required");
		}
		else
		{ 
			kursvalut.closest(".column-container").show();
			sumbankrub.closest(".column-container").show();
			$("[data-related-field=kursvalut]").show();
			$("[data-related-field=sumbankrub]").show();
			kursvalut.prop("required", true);
			kursvalut.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=kursvalut]").addClass("label-required");
			sumbankrub.prop("required", true);
			sumbankrub.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=sumbankrub]").addClass("label-required");
		}
	});
	CodeValut.change ();
}

var DSCursChecked= function() {
	var  valuta = $("input[name='valuta']");
	var kursvaluta = $("input[name='kursvaluta']");
	var  razmerobesrub = $("input[name='razmerobesrub']");
	valuta.change(function () {
		if ($(valuta).val() == "RUB" ||  ($(valuta).val().length==0 && $(valuta).val()!==null)){	
			kursvaluta.val("");
			razmerobesrub.val("");
			kursvaluta.closest(".column-container").hide();
			razmerobesrub.closest(".column-container").hide();
			$("[data-related-field=kursvaluta]").hide();
			$("[data-related-field=razmerobesrub]").hide();
			kursvaluta.prop("required", false);
			kursvaluta.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=kursvaluta]").removeClass("label-required");
			razmerobesrub.prop("required", false);
			razmerobesrub.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=razmerobesrub]").removeClass("label-required");
		}
		else
		{ 
			kursvaluta.closest(".column-container").show();
			razmerobesrub.closest(".column-container").show();
			$("[data-related-field=kursvaluta]").show();
			$("[data-related-field=razmerobesrub]").show();
			kursvaluta.prop("required", true);
			kursvaluta.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=kursvaluta]").addClass("label-required");
			razmerobesrub.prop("required", true);
			razmerobesrub.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=razmerobesrub]").addClass("label-required");
		}
	});
	valuta.change ();
}


var calculateSumBank = function () {
	
	function calculateSumbankrub() {
		var kursvalut = $("input[name='kursvalut']");
		var sumbank = $("input[name='sumbank']");
		
		var sumbank1 = sumbank.autoNumeric('get') * 1;
		var kursvalut1 = parseFloat(kursvalut.val() ? kursvalut.val() : 0);
		
		var sumbankrub = $("input[name='sumbankrub']");
		sumbankrub.autoNumeric('set', sumbank1  * kursvalut1);
		sumbankrub.change();
	}
	
	$("input[name='kursvalut']").change(function () {
		calculateSumbankrub();
	});
	
	$("input[name='sumbank']").change(function () {
		calculateSumbankrub();
	});
	
	$("input[name='sumbankrub']").change(function () {
		calculateSumbankrub();
	});
}

var calculateRazmObes = function () {
	function calculateRazmerobesrub() {
		var kursvaluta = $("input[name='kursvaluta']");
		var razmerobes = $("input[name='razmerobes']");
		
		var razmerobes1 = razmerobes.autoNumeric('get') * 1;
		var kursvaluta1 = parseFloat(kursvaluta.val() ? kursvaluta.val() : 0);
		
		var razmerobesrub = $("input[name='razmerobesrub']");
		razmerobesrub.autoNumeric('set', razmerobes1  * kursvaluta1);
		razmerobesrub.change();
	}
	
	$("input[name='razmerobes']").change(function () {
		calculateRazmerobesrub();
	});
	
	$("input[name='kursvaluta']").change(function () {
		calculateRazmerobesrub();
	});
	
	$("input[name='razmerobesrub']").change(function () {
		calculateRazmerobesrub();
	});
}


var ObespechIspolView = function() {
    var reestrnumber = $("div[data-name='Реестровый номер банковской гарантии']");
    var sumbank = $("div[data-name='Сумма банковской гарантии']");
	var CodeValut = $("div[data-name='Валюта БГ']");
	var nomerdocreestr = $("div[data-name='Номер документа реестровой записи БГ']");
	var kursvalut = $("div[data-name='Курс валюты БГ']");
	var sumbankrub = $("div[data-name='Сумма банковской гарантии в руб.']");
	var razmerobes = $("div[data-name='Размер обеспечения']");
	var valuta = $("div[data-name='Валюта обеспечения исполнения']");
	var kursvaluta = $("div[data-name='Курс валюты исполнения']");
	var razmerobesrub = $("div[data-name='Размер обеспечения в руб']");
    var trebov = $("div[data-name='Требование об обеспечении исполнения контракта']").find("input[type='checkbox']");
	var bankgarantia = $("div[data-name='Банковская гарантия, выданная банком в соответствии со статьей 45 Федерального закона']");
	var vnesenieds = $("div[data-name='Внесение денежных средств на указанный заказчиком счет']");
    if ($(trebov).attr("checked")) {	
		bankgarantia.show();
		vnesenieds.show();
		BankGarantView();
		} else {
		bankgarantia.hide();
		vnesenieds.hide();	
		$("div[data-name='Размер обеспечения']").closest("fieldset").hide();
		$("div[data-name='Реестровый номер банковской гарантии']").closest("fieldset").hide();	
	}
};

var BankGarantView = function() {
    var reestrnumber = $("div[data-name='Реестровый номер банковской гарантии']");
    var sumbank = $("div[data-name='Сумма банковской гарантии']");
	var CodeValut = $("div[data-name='Валюта БГ']");
	var nomerdocreestr = $("div[data-name='Номер документа реестровой записи БГ']");
	var kursvalut = $("div[data-name='Курс валюты БГ']");
	var kursvaluta = $("div[data-name='Курс валюты исполнения']");
	var sumbankrub = $("div[data-name='Сумма банковской гарантии в руб.']");
	var razmerobes = $("div[data-name='Размер обеспечения']");
	var razmerobesrub = $("div[data-name='Размер обеспечения в руб.']");
	var valuta = $("div[data-name='Валюта обеспечения исполнения']");
    var trebov = $("div[data-name='Требование об обеспечении исполнения контракта']").find("input[type='checkbox']");
	var bankgarantia = $("div[data-name='Банковская гарантия, выданная банком в соответствии со статьей 45 Федерального закона']").find("input[type='checkbox']");
	var vnesenieds = $("div[data-name='Внесение денежных средств на указанный заказчиком счет']").find("input[type='checkbox']");
    if ($(bankgarantia).attr("checked")) {	
    $("div[data-name='Реестровый номер банковской гарантии']").closest("fieldset").show();
	 $("div[data-name='Размер обеспечения']").closest("fieldset").hide();
		} else {
    $("div[data-name='Реестровый номер банковской гарантии']").closest("fieldset").hide();
	 $("div[data-name='Размер обеспечения']").closest("fieldset").show();	
		
	}
};

var BankGarantValutaView = function() {
	var CodeValut = $("div[data-name='Валюта БГ']");
	var kursvalut = $("div[data-name='Курс валюты БГ']");
	var sumbankrub = $("div[data-name='Сумма банковской гарантии в руб.']");
    var codes = [
		"RUB"
	];
	if ($.inArray(CodeValut, codes) != 1){	
		kursvalut.show();
		sumbankrub.show();
		
		} else {
		kursvalut.hide();
		sumbankrub.hide();
	}
};

var VnesenieDSValutaView = function() {
	var valuta = $("div[data-name='Валюта обеспечения исполнения']");
	var kursvaluta = $("div[data-name='Курс валюты исполнения']");
	var razmerobesrub = $("div[data-name='Размер обеспечения в руб.']");
    var codes = [
		"RUB"
	];
	if ($.inArray(valuta, codes) != 1) {	
		kursvaluta.show();
		razmerobesrub.show();
		
		} else {
		kursvaluta.hide();
		razmerobesrub.hide();
	}
};
// Финансирование обязательность полей
var Financy = function() {
	function sumchange() {
	var sumfinanbudjet=$("input[name='sumfinanbudjet']");
	var Codebudjet=$("input[name='Codebudjet']");
	var OKTMObudjet=$("input[name='OKTMObudjet']");
	var urovenbudjet=$("input[name='urovenbudjet']");				
	    var sumfinanbudjet1 = sumfinanbudjet.autoNumeric('get') * 1;
		var sumfinanbudjet1 = parseFloat(sumfinanbudjet.val() ? sumfinanbudjet.val() : 0);
		if (sumfinanbudjet1>0) {
			Codebudjet.closest(".clearfix").find(".dict-display-field").prop("required", true);
            Codebudjet.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=Codebudjet]").addClass("label-required");
			OKTMObudjet.closest(".clearfix").find(".dict-display-field").prop("required", true);
			OKTMObudjet.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=OKTMObudjet]").addClass("label-required");
/*             urovenbudjet.closest(".clearfix").find(".dict-display-field").prop("required", true);
			urovenbudjet.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field= urovenbudjet]").addClass("label-required"); */
		}
		else
		{   	
			Codebudjet.closest(".clearfix").find(".dict-display-field").prop("required", false);
            Codebudjet.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=Codebudjet]").removeClass("label-required");
			OKTMObudjet.closest(".clearfix").find(".dict-display-field").prop("required", false);
			OKTMObudjet.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=OKTMObudjet]").removeClass("label-required");
			urovenbudjet.closest(".clearfix").find(".dict-display-field").prop("required", false);
			urovenbudjet.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field= urovenbudjet]").removeClass("label-required");			
		}
	}
	    $(document).on('change', "input[name='sumfinanbudjet']", function (e) {
			sumchange();
	});
	
	$(document).on('change', "input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjet']", function (e) {
			sumchange();
	});
	
	$(document).on('change', "input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjetRub']", function (e) {
			sumchange();
	});
	
}

var FinancyUroven = function() {
	var urovenbudjet=$("input[name='urovenbudjet']");
	var urovenbudjetfond=$("input[name='urovenbudjetfond']");
	urovenbudjet.change(function() {
		var urovenbudjet1=$("input[name='urovenbudjet']").val();
		var uroven = [
            "41",
			"42",
			"43",
            "50"
		];
		if (($.inArray(urovenbudjet1, uroven) == -1)) {
			urovenbudjetfond.closest(".clearfix").find(".dict-display-field").prop("required", false);
			urovenbudjetfond.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=urovenbudjetfond]").removeClass("label-required");
		}
		else
		{   	
			urovenbudjetfond.closest(".clearfix").find(".dict-display-field").prop("required", true);
			urovenbudjetfond.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=urovenbudjetfond]").addClass("label-required");			
		}
	});
}

var FinancyVnebudjet = function() {
	function sumvnechange() {
	var sumfinanvnebudjet=$("input[name='sumfinanvnebudjet']");
	var CodeVnebudjet=$("input[name='CodeVnebudjet']");
		var sumfinanvnebudjet1 = parseFloat(sumfinanvnebudjet.val() ? sumfinanvnebudjet.val() : 0);
		if (sumfinanvnebudjet1>0) {
			CodeVnebudjet.closest(".clearfix").find(".dict-display-field").prop("required", true);
            CodeVnebudjet.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=CodeVnebudjet]").addClass("label-required");
		}
		else
		{   	
			CodeVnebudjet.closest(".clearfix").find(".dict-display-field").prop("required", false);
			CodeVnebudjet.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=CodeVnebudjet]").removeClass("label-required");	
		}
	}
	
	$(document).on('change', "input[name='sumfinanvnebudjet']", function (e) {
			sumvnechange();
	});
	
	$(document).on('change', "input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjetRub']", function (e) {
			sumvnechange();
	});
	
	$(document).on('change', "input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjet']", function (e) {
			sumvnechange();
	});
}

//Подсчет суммы в подчиненной таблице Бюджет

 var Summa=function() {
 
	$(document).on('change', "input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjet']", function (e) {
		SummaTest1.Calc(this);
	});
		
	$(document).on('change', "input[name='currency']", function (e) {
		SummaTest1.Calc(this);
	});
		
	$("div[data-deleted-attachment-keys='PlatejEtapbudjet_deletedAttachments'] div.table-add-row-button").click(function() {
		SummaTest1.Calc(this);
	});
	
/* 	$(".table-edit-wrapper>.table-edit[data-deleted-attachment-keys='PlatejEtapbudjet_deletedAttachments'] div.table-remove-row-button").each(function( index ) {
	$( this ).attr("onclick",$( this ).attr("onclick") + ";SummaTest.Calc(this);");
});  */

 $(".table-edit-wrapper > .table-row-row-view .table-remove-row-button, .nested-table-row-template .table-remove-row-button").each(function( index ) {
	$( this ).attr("onclick",$( this ).attr("onclick") + ";FullTable.PodTable();"+";FullTableVne.PodTableVne();"+";SummaOsnTest.Calculate();"+";SummaOsnVne.Calculate();");
}); 

} 

var SummaTest1 = {
	Calc:function (obj) {
	var s = $(obj).closest("div.table-row-row-view");
/* 	var t=s.closest("div.table-edit-wrapper");
	var q=t.closest("div.table-row-row-view"); */
	var id = s.attr("data-rowkey");
	var ps = $("[data-name=Etapbudjet-"+id+"-PlatejEtapbudjet] [data-rowkey]");
		var summ = 0;
	
		ps.each(function() {
		var sumcontr;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var sumcontr = $("input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjet']");   
		} 
		else {
			var sumcontr = $("input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjetRub']");
		}
			var elem = $(this).find(sumcontr);
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
				
			}
		}); 
		
		var nm = $(" [data-name=Etapbudjet-"+id+"-PlatejEtapbudjet] [data-rowkey]").closest("div.table-row-row-view");
		var id = nm.attr("data-rowkey");
		
		$("input[name='Etapbudjet-SumPlatejEtap-"+id+"']").val(summ);
		if (id === undefined ) {
		$("input[name='Etapbudjet-SumPlatejEtap-"+id+"']").val(summ);
		}
		else{	
var m = $("input[name='Etapbudjet-SumPlatejEtap-"+id+"").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='Etapbudjet-SumPlatejEtap-"+id+"").val(Sum2); 
}else{
   var str=",00";
		var u=summ+str;
		$("input[name='Etapbudjet-SumPlatejEtap-"+id+"']").val(u);
}
		}
}
}

var FullTable = {
	PodTable:function () {
	var ps = $("input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjet']").closest("div.table-row-row-view");
	
	ps.each(function() {
	
		var id = $(this).attr("data-rowkey");

		var summ = 0;
	
		$("[data-name='Etapbudjet-"+id+"-PlatejEtapbudjet']").find("div.table-edit-row").each(function() {
		var sumcontr;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var sumcontr = $("input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjet']");   
		} 
		else {
			var sumcontr = $("input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjetRub']");
		}
			var elem = $(this).find(sumcontr);
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		
		$("input[name='Etapbudjet-SumPlatejEtap-"+id+"']").val(summ);
		
		if (id === undefined ) {
		$("input[name='Etapbudjet-SumPlatejEtap-"+id+"']").val(summ);
		}
		else{	
var m = $("input[name='Etapbudjet-SumPlatejEtap-"+id+"").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='Etapbudjet-SumPlatejEtap-"+id+"").val(Sum2); 
}else{
   var str=",00";
		var u=summ+str;
		$("input[name='Etapbudjet-SumPlatejEtap-"+id+"']").val(u);
}
		}
	});
}
}

var SummaOsnZagruzka = function() {
	var ps1 = $("input[data-field-name*='Etapbudjet-SumPlatejEtap']").closest("div.table-content");
		var summ = 0;
	
		ps1.children("div.table-edit-row").each(function() {
			var elemen = $(this).find("input[data-field-name*='Etapbudjet-SumPlatejEtap']")
			
			if($(elemen).length){
				var s1 = elemen.val();
				

				var Price = s1.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		$("input[name='sumfinanbudjet']").val(summ);	
var m = $("input[name='sumfinanbudjet']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='sumfinanbudjet']").val(Sum2); 
}
else{
   var str=",00";
		var u=summ+str;
		$("input[name='sumfinanbudjet']").val(u);
}
		}

//Подсчет суммы в основной таблице Бюджет
 var SummaOsnTest = {
	Calculate: function () {
	var ps1 = $("input[data-field-name*='Etapbudjet-SumPlatejEtap']").closest("div.table-content");
		var summ = 0;
	
		ps1.children("div.table-edit-row").each(function() {
			var elemen = $(this).find("input[data-field-name*='Etapbudjet-SumPlatejEtap']")
			
			if($(elemen).length){
				var s1 = elemen.val();
				

				var Price = s1.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
				
			}
		}); 
		
		$("input[name='sumfinanbudjet']").val(summ);

var m =$("input[name='sumfinanbudjet']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='sumfinanbudjet']").val(Sum2); 
}
else{
   var str=",00";
		var u=summ+str;
		$("input[name='sumfinanbudjet']").val(u);
}
		}
	}
	
 var SummaOsn =  function() {

	$(document).on('change', "input[data-field-name*='PlatejEtapbudjet-SumPlatejBudjet']", function (e) {
		SummaOsnTest.Calculate(this);
	});

    $(document).on('change', "input[data-field-name*='Etapbudjet-SumPlatejEtap']", function (e) {
		SummaOsnTest.Calculate(this);
	});
	
	$("div[data-deleted-attachment-keys='Etapbudjet_deletedAttachments'] div.table-add-row-button").click(function() {
		SummaOsnTest.Calculate(this);
	});
		
	
 // $(".table-edit-wrapper>.table-edit[data-deleted-attachment-keys='Etapbudjet_deletedAttachments'] div.table-remove-row-button").each(function( index ) {
	// $( this ).attr("onclick", "SummaOsnTest.Calculate(this);" + $( this ).attr("onclick"));
// }); 

$(".table-edit-wrapper .table-remove-row-button:not(.table-edit-wrapper > .table-row-row-view .table-remove-row-button, .nested-table-row-template .table-remove-row-button)").each(function( index ) {
	$( this ).attr("onclick",$( this ).attr("onclick") + ";SummaOsnTest.Calculate(this);"+";SummaOsnVne.Calculate(this);");
}); 
} 

//Подсчет суммы в подчиненной таблице Внебюджет
var SummaVne =  function() {
	
	    $(document).on('change', "input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjet']", function (e) {
		SummaTestVne.CalcVne(this)
		});
		
		$(document).on('change', "input[name='currency']", function (e) {
		SummaTestVne.CalcVne(this)
		});
	
	
	$("div[data-deleted-attachment-keys='PlatejEtapVnebudjet_deletedAttachments'] div.table-add-row-button").click(function() {
		SummaTestVne.CalcVne(this)
		
/* 	$(".table-edit-wrapper > .table-row-row-view .table-remove-row-button, .nested-table-row-template .table-remove-row-button").each(function( index ) {
	$( this ).attr("onclick",$( this ).attr("onclick") + ";FullTableVne.PodTableVne();");
});  */
	});
}

var SummaTestVne = {
	CalcVne:function (obj) {
	var ps = $(obj).closest("div.table-content");
		var summ = 0;
	
		ps.children("div.table-edit-row").each(function() {
		var sumcontr;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var sumcontr = $("input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjet']");   
		} 
		else {
			var sumcontr = $("input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjetRub']");
		}
			var elem = $(this).find(sumcontr);
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		var nm = $(obj).closest("div.table-row-row-view");
		var id = nm.attr("data-rowkey");
		
		$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(summ);
		if (id === undefined ) {
		$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(summ);
		}
		else{	
var m = $("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(Sum2); 
}else{
   var str=",00";
		var u=summ+str;
		$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(u);
}
		}
	}
}

var FullTableVne = {
	PodTableVne:function () {
	var ps = $("input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjet']").closest("div.table-row-row-view");
	
	ps.each(function() {
	
		var id = $(this).attr("data-rowkey");

		var summ = 0;
	
		$("[data-name='EtapVnebudjet-"+id+"-PlatejEtapVnebudjet']").find("div.table-edit-row").each(function() {
		var sumcontr;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var sumcontr = $("input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjet']");   
		} 
		else {
			var sumcontr = $("input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjetRub']");
		}
			var elem = $(this).find(sumcontr);
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		
		$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(summ);
		if (id === undefined ) {
		$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(summ);
		}
		else{	
var m = $("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(Sum2); 
}else{
   var str=",00";
		var u=summ+str;
		$("input[name='EtapVnebudjet-SumPlatejEtapVnebudjet-"+id+"']").val(u);
}
		}
	});
}
}

var SummaVneZagruzka = function() {
	var ps1 = $("input[data-field-name*='EtapVnebudjet-SumPlatejEtapVnebudjet']").closest("div.table-content");
		var summ = 0;
	
		ps1.children("div.table-edit-row").each(function() {
			var elemen = $(this).find("input[data-field-name*='EtapVnebudjet-SumPlatejEtapVnebudjet']")
			
			if($(elemen).length){
				var s1 = elemen.val();
				

				var Price = s1.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		$("input[name='sumfinanvnebudjet']").val(summ);
var m = $("input[name='sumfinanvnebudjet']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='sumfinanvnebudjet']").val(Sum2); 
}
else{
   var str=",00";
		var u=summ+str;
		$("input[name='sumfinanvnebudjet']").val(u);
}
		}


//Подсчет суммы в основной таблице Внебюджет
var SummaVne1 =  function() {
	
	$(document).on('change', "input[data-field-name*='PlatejEtapVnebudjet-SumPlatejVnebudjet']", function (e) {
		SummaOsnVne.Calculate(this);
	});

    $(document).on('change', "input[data-field-name*='EtapVnebudjet-SumPlatejEtapVnebudjet']", function (e) {
		SummaOsnVne.Calculate(this);
	});
	
	$("div[data-deleted-attachment-keys='EtapVnebudjet_deletedAttachments'] div.table-add-row-button").click(function() {
		SummaOsnVne.Calculate(this);
	});

}

 var SummaOsnVne = {
	Calculate: function () {
	var ps1 = $("input[data-field-name*='EtapVnebudjet-SumPlatejEtapVnebudjet']").closest("div.table-content");
		var summ = 0;
	
		ps1.children("div.table-edit-row").each(function() {
			var elemen = $(this).find("input[data-field-name*='EtapVnebudjet-SumPlatejEtapVnebudjet']")
			
			if($(elemen).length){
				var s1 = elemen.val();
				

				var Price = s1.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		$("input[name='sumfinanvnebudjet']").val(summ);	
var m = $("input[name='sumfinanvnebudjet']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='sumfinanvnebudjet']").val(Sum2); 
}
else{
   var str=",00";
		var u=summ+str;
		$("input[name='sumfinanvnebudjet']").val(u);
}
		}
	}

//Подсчет в подчиненной таблице Фактически оплачено
var SummaIspolnenie=  function() {
	
	$(document).on('change', "input[data-field-name*='PlatejiEtap-FactOplacheno']", function (e) {
		SummaTestIsp.CalculateIspolnenie(this);
		});
		
		$(document).on('change', "input[name='currency']", function (e) {
		SummaTestIsp.CalculateIspolnenie(this);
		});
	
	
	$("div[data-deleted-attachment-keys='PlatejiEtap_deletedAttachments'] div.table-add-row-button").click(function() {
		SummaTestIsp.CalculateIspolnenie(this);
	});
	
 $(".table-edit-wrapper > .table-row-row-view .table-remove-row-button, .nested-table-row-template .table-remove-row-button").each(function( index ) {
	$( this ).attr("onclick",$( this ).attr("onclick") + ";FullTableIsp.PodTableIsp();" + ";FullTableIspOst.PodTableIspOst();"+ ";FactSumCalc.Calculate(this);" + ";OstatokCalc.Calculate();");
}); 
}

var SummaTestIsp = {
	CalculateIspolnenie:function (obj) {
	var table = $(obj).closest("div.table-content");
		var summ = 0;
	
		table.children("div.table-edit-row").each(function() {
		var factopl;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var factopl = $("input[data-field-name*='PlatejiEtap-FactOplacheno']");   
		} 
		else {
			var factopl = $("input[data-field-name*='PlatejiEtap-FactOplachenoRub']");
		}
			var elem = $(this).find(factopl);
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		var nm = $(obj).closest("div.table-row-row-view");
		var id = nm.attr("data-rowkey");
		
		$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(summ);

				if (id === undefined ) {
		$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(summ);
		}
		else{	
var m = $("input[name='EtapIspolnenie-FactOplata-"+id+"']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(Sum2); 
}else{
   var str=",00";
		var u=summ+str;
		$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(u);
}
		}
	}
}

var FullTableIsp = {
	PodTableIsp:function () {
	var ps = $("input[data-field-name*='PlatejiEtap-FactOplacheno']").closest("div.table-row-row-view");
	
	ps.each(function() {
	
		var id = $(this).attr("data-rowkey");

		var summ = 0;
	
		$("[data-name='EtapIspolnenie-"+id+"-PlatejiEtap']").find("div.table-edit-row").each(function() {
		var sumcontr;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var sumcontr = $("input[data-field-name*='PlatejiEtap-FactOplacheno']");   
		} 
		else {
			var sumcontr = $("input[data-field-name*='PlatejiEtap-FactOplachenoRub']");
		}
			var elem = $(this).find(sumcontr);
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		
		
		$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(summ);
		if (id === undefined ) {
		$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(summ);
		}
		else{	
var m = $("input[name='EtapIspolnenie-FactOplata-"+id+"']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(Sum2); 
}else{
   var str=",00";
		var u=summ+str;
		$("input[name='EtapIspolnenie-FactOplata-"+id+"']").val(u);
}
		}
	});
}
}


// остаток платежей в основной таблице
var Ostatok =  function() {

	$(document).on('change', "input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']", function (e) {
	OstatokTestIsp.CalculateOstatok(this);
	});

    $(document).on('change', "input[data-field-name*='EtapIspolnenie-FactOplata']", function (e) {
	OstatokTestIsp.CalculateOstatok(this);
	});
	
	$(document).on('change', "input[data-field-name*='PlatejiEtap-FactOplacheno']", function (e) {
	OstatokTestIsp.CalculateOstatok(this);
	});
	
	$("div[data-deleted-attachment-keys='EtapIspolnenie_deletedAttachments'] div.table-add-row-button").click(function() {
	OstatokTestIsp.CalculateOstatok(this);
	});

}

var OstatokTestIsp = {
	CalculateOstatok:function (obj) {
	var table = $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").closest("div.table-content");
		var ost = 0;
	
		table.find("div.table-edit-row").each(function() {
			var elem1 = $(this).find("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']")
			var elem2 = $(this).find("input[data-field-name*='EtapIspolnenie-FactOplata']")

                if($(elem1).length || $(elem2).length){
				var s1 = elem1.val();
				var s2 = elem2.val();
				
/* 		    var Price1 = s1.autoNumeric('get') * 1;
				var Price2 = s2.autoNumeric('get') * 1; */
				var Price1 = s1.replace(/ /g, '').replace(/,/g, '.')*1; 
				var Price2 = s2.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val1 =  parseFloat(Price1? Price1 : 0);
				var val2 =  parseFloat(Price2? Price2 : 0);
				ost = val1 - val2;
				}
		}); 
		
		var nm =$("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").parents("div.table-edit-row");
		var id = nm.attr("data-rowkey");
		
		$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(ost);
		if (id === undefined ) {
		$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(ost);
		}
		else{	
var m = $("input[name='EtapIspolnenie-Ostatok-"+id+"']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(Sum2); 
}else{
   var str=",00";
		var u=ost+str;
		$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(u);
}
		}
	}
}

var FullTableIspOst = {
	PodTableIspOst:function () {
	var table = $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").closest("div.table-content");
	
	table.find("div.table-edit-row").each(function() {
	
		var id = $(this).attr("data-rowkey");

		var ost = 0;
		
		var elem1 = $(this).find("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']")
		var elem2 = $(this).find("input[data-field-name*='EtapIspolnenie-FactOplata']")
		
		if($(elem1).length || $(elem2).length){
				var s1 = elem1.val();
				var s2 = elem2.val();
				
/* 		    var Price1 = s1.autoNumeric('get') * 1;
				var Price2 = s2.autoNumeric('get') * 1; */
				var Price1 = s1.replace(/ /g, '').replace(/,/g, '.')*1; 
				var Price2 = s2.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val1 =  parseFloat(Price1? Price1 : 0);
				var val2 =  parseFloat(Price2? Price2 : 0);
				ost = val1 - val2;
				
				$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(ost);
				if (id === undefined ) {
		$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(ost);
		}
		else{	
var m = $("input[name='EtapIspolnenie-Ostatok-"+id+"']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(Sum2); 
}else{
   var str=",00";
		var u=ost+str;
		$("input[name='EtapIspolnenie-Ostatok-"+id+"']").val(u);
}
		}
				}
		}); 

}
}

var OstatokEvent= function() {
	function OstatokChecked() {
	var table = $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").closest("div.table-content");
	var Ostatok = $("input[name='EtapIspolnenie-Ostatok']");
	var Platej = $("input[name='EtapIspolnenie-SumPlatejIspolnenie']");
	var CloseEtap = $("input[name='EtapIspolnenie-EtapZakryt']");
	
	table.find("div.table-edit-row").each(function() {
	var elem1 = $(this).find("input[data-field-name*='EtapIspolnenie-Ostatok']")
	var elem2 = $(this).find("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']")

    if($(elem1).length || $(elem2).length){
	var s1 = elem1.val();
	var s2 = elem2.val();
	var Price1 = s1.replace(/ /g, '').replace(/,/g, '.')*1; 
	var Price2 = s2.replace(/ /g, '').replace(/,/g, '.')*1; 
	var ostatok1 =  parseFloat(Price1? Price1 : 0);
	var platej1 =  parseFloat(Price2? Price2 : 0);
			
	if(ostatok1 <= 0 && platej1 > 0){
	var nm = $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").parents("div.table-edit-row");
	var id = nm.attr("data-rowkey");
		
	$("input[name='EtapIspolnenie-EtapZakryt-"+id+"']").prop('checked', true);
	}
	else
	{
	var nm1 = $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").parents("div.table-edit-row");
	var id1 = nm1.attr("data-rowkey");
		
	$("input[name='EtapIspolnenie-EtapZakryt-"+id1+"']").prop('checked', false);
	}
	}
	});
	
	}
	
	$(document).on('change', "input[data-field-name*='EtapIspolnenie-Ostatok']", function (e) {
	OstatokChecked(this);
	});
	
	$(document).on('change', "input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']", function (e) {
	OstatokChecked(this);
	});
	
	$(document).on('change', "input[data-field-name*='EtapIspolnenie-FactOplata']", function (e) {
	OstatokChecked(this);
	});
	
	$("div[data-deleted-attachment-keys='EtapIspolnenie_deletedAttachments'] div.table-add-row-button").click(function() {
		OstatokChecked(this);
	});
}

var FactSummaZagruzka = function() {
	var table = $("input[data-field-name*='EtapIspolnenie-FactOplata']").closest("div.table-content");
		var summ = 0;
	
		table.children("div.table-edit-row").each(function() {
			var elem = $(this).find("input[data-field-name*='EtapIspolnenie-FactOplata']")
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
				
		$("input[name='FactSumOplata']").val(summ);	
var m = $("input[name='FactSumOplata']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='FactSumOplata']").val(Sum2); 
}
else{
   var str=",00";
		var u=summ+str;
		$("input[name='FactSumOplata']").val(u);
}
		} 

// факт сумма на вкладке исполнение
var FactSumma =  function() {

	$(document).on('change', "input[data-field-name*='PlatejiEtap-FactOplacheno']", function (e) {
		FactSumCalc.Calculate(this);
	});

    $(document).on('change', "input[data-field-name*='EtapIspolnenie-FactOplata']", function (e) {
		FactSumCalc.Calculate(this);
	});
	
	$("div[data-deleted-attachment-keys='EtapIspolnenie_deletedAttachments'] div.table-add-row-button").click(function() {
		FactSumCalc.Calculate(this);
	});	
	
	$(".table-edit-wrapper .table-remove-row-button:not(.table-edit-wrapper > .table-row-row-view .table-remove-row-button, .nested-table-row-template .table-remove-row-button)").each(function( index ) {
	$( this ).attr("onclick",$( this ).attr("onclick") +";FactSumCalc.Calculate(this);" + ";OstatokCalc.Calculate();");
}); 
}

var FactSumCalc = {
	Calculate: function () {
		var table = $("input[data-field-name*='EtapIspolnenie-FactOplata']").closest("div.table-content");
		var summ = 0;
	
		table.children("div.table-edit-row").each(function() {
			var elem = $(this).find("input[data-field-name*='EtapIspolnenie-FactOplata']")
			
			if($(elem).length){
				var s = elem.val();
				

				var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 				
		$("input[name='FactSumOplata']").val(summ);	
var m =$("input[name='FactSumOplata']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='FactSumOplata']").val(Sum2); 
}
else{
   var str=",00";
		var u=summ+str;
		$("input[name='FactSumOplata']").val(u);
}
		} 
	}

var OstatokZagruzka = function() {
	var priceElement;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var priceElement = $("input[name='price']");   
		} 
		else {
			var priceElement = $("input[name='pricerub']");
		}

		var factElement = $("input[name='FactSumOplata']");
		
		var s = priceElement.val();
		var m =factElement.val();
				
        var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 
		var fact = m.replace(/ /g, '').replace(/,/g, '.')*1; 

		var val =  parseFloat(Price ? Price : 0);
		var val2 =  parseFloat(fact ? fact : 0);
		var ost = val - val2;

        $("input[name='OstatokContract']").val(ost);	
var m = $("input[name='OstatokContract']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y= $("input[name='OstatokContract']").val(Sum2); 
}
else{
   var str=",00";
		var u=ost+str;
		 $("input[name='OstatokContract']").val(u);
}
		} 

//остаток на вкладке Исполнение
var calculateOstatok = function () {

	$("input[name='price']").change(function () {
		OstatokCalc.Calculate();
	});
	
	$("input[name='pricerub']").change(function () {
		OstatokCalc.Calculate();
	});
	
	$("input[name='curs']").change(function () {
		OstatokCalc.Calculate();
	});
	
	$("input[name='nominal']").change(function () {
		OstatokCalc.Calculate();
	});
	
    $(document).on('change', "input[data-field-name*='FactSumOplata']", function (e) {
		OstatokCalc.Calculate();
	});
	
	$(document).on('change', "input[data-field-name*='PlatejiEtap-FactOplacheno']", function (e) {
		OstatokCalc.Calculate();
	});

    $(document).on('change', "input[name='currency']", function (e) {
		OstatokCalc.Calculate();
	});
}

var OstatokCalc = {
	Calculate: function () {
		var priceElement;
		var ValutaX = $(" input[name='currency']");
		var codes = [
			"RUB",
		];
		if (ValutaX.val() === "" ) {
			return;
		} 
		
		if (ValutaX.val() === "RUB" ) {
			var priceElement = $("input[name='price']");   
		} 
		else {
			var priceElement = $("input[name='pricerub']");
		}

		var factElement = $("input[name='FactSumOplata']");
		
		var s = priceElement.val();
		var m =factElement.val();
				
        var Price = s.replace(/ /g, '').replace(/,/g, '.')*1; 
		var fact = m.replace(/ /g, '').replace(/,/g, '.')*1; 

		var val =  parseFloat(Price ? Price : 0);
		var val2 =  parseFloat(fact ? fact : 0);
		var ost = val - val2;

        $("input[name='OstatokContract']").val(ost);	
var m = $("input[name='OstatokContract']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='OstatokContract']").val(Sum2); 
}
else{
   var str=",00";
		var u=ost+str;
		 $("input[name='OstatokContract']").val(u);
}
		}
	}

var calculateValuta = function () {
	
	function calcValuta() {
	var table = $("input[data-field-name*='Vozmeschenie-SummaDocument']").closest("div.table-content");
	var sumrub=0;
	table.find("div.table-edit-row").each(function() {
		var KursDocument = $(this).find("input[data-field-name*='Vozmeschenie-KursDocument']")
		var SummaDocument = $(this).find("input[data-field-name*='Vozmeschenie-SummaDocument']")
		
		if($(KursDocument).length || $(SummaDocument).length){
				var s1 = KursDocument.val();
				var s2 = SummaDocument.val();
				
				var KursDocument1 = s1.replace(/ /g, '').replace(/,/g, '.')*1; 
				var SummaDocument1 = s2.replace(/ /g, '').replace(/,/g, '.')*1; 

				var val1 =  parseFloat(KursDocument1? KursDocument1 : 0);
				var val2 =  parseFloat(SummaDocument1? SummaDocument1 : 0);
				sumrub = val1 * val2;
				}
		}); 
		
		var nm =$("input[data-field-name*='Vozmeschenie-SummaDocument']").parents("div.table-edit-row");
		var id = nm.attr("data-rowkey");
		
		$("input[name='Vozmeschenie-SummaDocumentRub-"+id+"']").val(sumrub);
if (id === undefined ) {
		$("input[name='Vozmeschenie-SummaDocumentRub-"+id+"']").val(sumrub);
		}
		else{	
var m = $("input[name='Vozmeschenie-SummaDocumentRub-"+id+"']").val();	
if(m.indexOf('.') + 1) {
   var Sum2 = m.split('.');  
	var y=$("input[name='Vozmeschenie-SummaDocumentRub-"+id+"']").val(Sum2); 
}else{
   var str=",00";
		var u=sumrub+str;
		$("input[name='Vozmeschenie-SummaDocumentRub-"+id+"']").val(u);
}
		}
	}
	
	$(document).on('change', "input[data-field-name*='Vozmeschenie-KursDocument']", function (e) {
	calcValuta(this);
	});
	
	$(document).on('change', "input[data-field-name*='Vozmeschenie-SummaDocument']", function (e) {
	calcValuta(this);
	});
}


 var dataBudjet = function () {

function dataHide() {
var nm =$("input[data-field-name*='Etapbudjet-DateFinishbudjet']").parents("div.table-edit-row");
var id = nm.attr("data-rowkey");	
var s=$("input[name='Etapbudjet-DateFinishbudjet-"+id+"']").val();
var m=$("input[name='Etapbudjet-DateFinishbudjet-"+id+"']").parents("div.table-edit-row");
m.find(".table-row-selector-radio").prop('checked', true);
}

function fillTable() {
var nm =$("input[data-field-name*='Etapbudjet-DateFinishbudjet']").closest("div.table-edit-row");
nm.each(function() {
var id = $(this).attr("data-rowkey");	
var m=$("input[name='Etapbudjet-DateFinishbudjet-"+id+"']").closest("div.table-edit-row");
if ($(m.find(".table-row-selector-radio")).is(":checked")) {
$("div[data-deleted-rows-field='Etapbudjet-"+id+"-PlatejEtapbudjet_deleted']").parents("div.table-row-row-view").show(); 
	}
	else{
$("div[data-deleted-rows-field='Etapbudjet-"+id+"-PlatejEtapbudjet_deleted']").parents("div.table-row-row-view").hide(); 
}
});
} 
	
	
	$("div[data-deleted-attachment-keys='Etapbudjet_deletedAttachments'] div.table-add-row-button").click(function() {
		dataHide(this);
		fillTable();
	});

} 

var dataVnebudjet = function () {

function VnedataHide() {
var nm =$("input[data-field-name*='EtapVnebudjet-DateFinishVnebudjet']").parents("div.table-edit-row");
var id = nm.attr("data-rowkey");	
var s=$("input[name='EtapVnebudjet-DateFinishVnebudjet-"+id+"']").val();
var m=$("input[name='EtapVnebudjet-DateFinishVnebudjet-"+id+"']").parents("div.table-edit-row");
m.find(".table-row-selector-radio").prop('checked', true);
}

function fillVneTable() {
var nm =$("input[data-field-name*='EtapVnebudjet-DateFinishVnebudjet']").closest("div.table-edit-row");
nm.each(function() {
var id = $(this).attr("data-rowkey");	
var m=$("input[name='EtapVnebudjet-DateFinishVnebudjet-"+id+"']").closest("div.table-edit-row");
if ($(m.find(".table-row-selector-radio")).is(":checked")) {
$("div[data-deleted-rows-field='EtapVnebudjet-"+id+"-PlatejEtapVnebudjet_deleted']").parents("div.table-row-row-view").show(); 
	}
	else{
$("div[data-deleted-rows-field='EtapVnebudjet-"+id+"-PlatejEtapVnebudjet_deleted']").parents("div.table-row-row-view").hide(); 
}
});
}
	
	
$("div[data-deleted-attachment-keys='EtapVnebudjet_deletedAttachments'] div.table-add-row-button").click(function() {
		VnedataHide(this);
		fillVneTable();
});

} 


/* var Okpd2 = function() {
	var nm =$("input[data-field-name*='Pozicii-PozOKPD2']").parents("div.table-edit-row");
	var id = nm.attr("data-rowkey");
	var ok = $("input[name='Pozicii-PozOKPD2-"+id+"']").val();
	var OKPD2Hide = $("input[name='OKPD2Hide']");
	
	if (ok == undefined) {
	OKPD2Hide.val("00");
	OKPD2Hide.change();
	}
	else {
	OKPD2Hide.val(ok);
	OKPD2Hide.change();
	}
}

//открыть таблицу Лекарственные препараты
var LecPrep = function () {
	var table = $("input[data-field-name*='LecPrep-LpNumber']").closest("div.column-container");
	var table2 = $("input[data-field-name*='Pozicii-PozEdIzm']").closest("div.column-container");
	var MNN=$("input[data-field-name='Pozicii-LpMnnName']");
	var Srok=$("input[data-field-name*='Pozicii-LpSrok']");
	var JNVLP=$("input[data-field-name*='Pozicii-LpJNVLP']");
	var Title=$("div[title='Международное непатентованное наименование']");
	var Title2=$("div[title='Срок годности']");
	var Title3=$("div[title='Включено в ЖНВЛП']");
	var OKPD2Hide=$("input[name='OKPD2Hide']");
    var OKPD2=OKPD2Hide.val();
	var OKPD2_Cod=OKPD2.substr(0,2);
		if (OKPD2_Cod == "21") {
		   table.show();
		   var M=MNN.parents("div.table-edit-column");
		   M.show();
		   var K=Srok.parents("div.table-edit-column");
	       K.show();
	       var S=JNVLP.parents("div.table-edit-column");
	       S.show();
		   Title.show();
		   Title2.show();
	       Title3.show();
		}
		else{
		   table.hide();
		   var M=MNN.parents("div.table-edit-column");
		   M.hide();	 
		   	var K=Srok.parents("div.table-edit-column");
	        K.hide();
	        var S=JNVLP.parents("div.table-edit-column");
	       S.hide();
		   Title.hide();
		   Title2.hide();
	       Title3.hide();
		}
		
	$(document).on('change', "input[data-field-name*='Pozicii-PozOKPD2']", function (e) {
	Okpd2();
	LecPrep();
	});
}	 */	

//
/* var copyrow = function() {
var getRowsTableByTableName = function (tableName) {
    return $('[data-name=' + tableName + ']').children('.table-content').children('.table-edit-row[data-rowkey]');
};

var getLastRowTableByTable = function (tableName) {
    return getRowsTableByTableName(tableName).filter(":last")
};

var getRowInputElementsArray = function(rowElement) {
    return rowElement.querySelectorAll("[data-field-name] input");
};

var getRowsDataObject = function (rowInputElements) {
    var dataObject = {};
    rowInputElements.forEach(function (inputElement) {
        if (inputElement.value) {
            dataObject[inputElement.dataset.fieldName] = inputElement.value
        }
    });
    return dataObject;
};


var getDataTable = function (tableName) {
    var dataTable = [];
    var rowsTable = getRowsTableByTableName(tableName);
    rowsTable.each(function (index, row) {
        var rowInputElements = getRowInputElementsArray(row);
        dataTable.push(getRowsDataObject(rowInputElements))
    });
    return dataTable;
};

var toTypeDataTable = function (tableData, toTypeRules) {
    var toTypedTableData = [];
    let rulesObjectArray = [];
    if (toTypeRules) {
        let tempRulesArray = toTypeRules.split(";");
        tempRulesArray.forEach(function (role) {
            let ruleParts = role.split(" => ");
            rulesObjectArray.push({from: ruleParts[0], to: ruleParts[1]})
        });
    }
    tableData.forEach(function (rowData) {
        let rowDataToPush = {};
        for (let propertyName in rowData) {
            let searchRule = rulesObjectArray.filter(rule => rule.from === propertyName);
            if (searchRule.length > 0) {
                rowDataToPush[searchRule[0].to] = rowData[propertyName];
            } else {
                rowDataToPush[propertyName] = rowData[propertyName]
            }
        }
        toTypedTableData.push(rowDataToPush);
    });
    return toTypedTableData;
};

var parseIntFromMoney = function (moneyString) {
    return  parseFloat(moneyString.replace(/[,]+/g, ".").replace(/[ ]+/g, ""));
};

var toMoney = function (float) {

    return float.toString().replace(/[.]+/g, ",")
};

var mergeTableDataByKeyProperty = function (firstTableData, secondTableData, keyPropertyName, sumProperty, isForGetSecond) {

    let mergeFirstSecond = [];
    firstTableData.forEach(function (element) {
        var rowDataToMerge = {};
        rowDataToMerge[sumProperty] = "0";
        for (var propertyName in element) {
            if (element.hasOwnProperty(propertyName)) {
                let propertyValue = element[propertyName];
                if (propertyName !== sumProperty) {
                    rowDataToMerge[propertyName] = propertyValue;
                }
                if (propertyName === keyPropertyName) {
                    secondTableData.forEach(function (elementSecondTable, index) {
                        if (elementSecondTable[propertyName] ===  propertyValue) {
                            if (sumProperty && !isForGetSecond) {
                                rowDataToMerge[sumProperty] = toMoney(parseIntFromMoney(rowDataToMerge[sumProperty]) + parseIntFromMoney(elementSecondTable[sumProperty]));
                                secondTableData.splice(index,index + 1);
                            }
                            if (sumProperty && isForGetSecond) {
                                rowDataToMerge[sumProperty] = elementSecondTable[sumProperty];
                                secondTableData.splice(index,index + 1);
                            }
                        }
                    })
                }
                if (propertyName === sumProperty && !isForGetSecond) {
                    rowDataToMerge[sumProperty] = toMoney(parseIntFromMoney(rowDataToMerge[sumProperty]) + parseIntFromMoney(propertyValue));
                }
            }
        }
        mergeFirstSecond.push(rowDataToMerge);
    });

    mergeFirstSecond = mergeFirstSecond.concat(secondTableData);
    return mergeFirstSecond;
};



var toTypedTableData1 = toTypeDataTable(getDataTable("Etapbudjet"),
    "Etapbudjet-DateFinishbudjet => EtapIspolnenie-DateFinishIspolnenie;" +
    "Etapbudjet-SumPlatejEtap => EtapIspolnenie-SumPlatejIspolnenie");
var toTypedTableData2 = toTypeDataTable(getDataTable("EtapVnebudjet"),
    "EtapVnebudjet-DateFinishVnebudjet => EtapIspolnenie-DateFinishIspolnenie;" +
    "EtapVnebudjet-SumPlatejEtapVnebudjet => EtapIspolnenie-SumPlatejIspolnenie");
var toTypedTableData3 = toTypeDataTable(getDataTable("EtapIspolnenie"));

var mergeFirsrSecond = mergeTableDataByKeyProperty(
    toTypedTableData1,
    toTypedTableData2,
    "EtapIspolnenie-DateFinishIspolnenie",
    "EtapIspolnenie-SumPlatejIspolnenie",
    false
);
var margeTableDataX = mergeTableDataByKeyProperty(
    toTypedTableData3,
    mergeFirsrSecond,
    "EtapIspolnenie-DateFinishIspolnenie",
    "EtapIspolnenie-SumPlatejIspolnenie",
    true
);

var eraseTableRows = function(tableName) {
    var rowsTable = getRowsTableByTableName(tableName);
    rowsTable.each(function (index, row) {
        row.querySelector(".table-remove-row-button").click();
    })
};

var fillTableByTableData = function (tableName, tableData) {
    var tableElement = $('[data-name=' + tableName + ']');
    eraseTableRows(tableName);
    let addButton = tableElement.find(".table-add-row-button");
    tableData.forEach(function (rowData) {
        addButton.click();
        var lastRow = getLastRowTableByTable(tableName);
        for (var propertyName in rowData) {
            if (rowData.hasOwnProperty(propertyName)) {
                var fieldElement = lastRow.find('[data-field-name*="' + propertyName + '"]');
                fieldElement.val(rowData[propertyName]);
                fieldElement.select();

            }
        }
    });
};

fillTableByTableData("EtapIspolnenie", margeTableDataX);
} */

/* var fillTable = function() {
	        var data;
			var summa;
			var table = $("input[data-field-name*='Etapbudjet-SumPlatejEtap']").closest("div.table-content");
			table.find("div.table-edit-row").each(function() {
			var elem3 = $(this).find("input[data-field-name*='Etapbudjet-DateFinishbudjet']");
			var elem4 = $(this).find("input[data-field-name*='Etapbudjet-SumPlatejEtap']");
			if ($(elem4).length) {
			data=elem3.val();
			summa=elem4.val();
			}
			var table2 = $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").closest("div.table-content");
			
			var addButton = table2.find(".table-add-row-button");
			addButton.click();
			
			var elem1 = $(this).find("input[data-field-name*='EtapIspolnenie-DateFinishIspolnenie']");
			var elem2 = $(this).find("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']");
			var nm =$("input[data-field-name*='EtapIspolnenie-DateFinishIspolnenie']").parents("div.table-edit-row");
		    var id = nm.attr("data-rowkey");
			 $("input[name='EtapIspolnenie-DateFinishIspolnenie-"+id+"']").val(data);
			$("input[name='EtapIspolnenie-SumPlatejIspolnenie-"+id+"']").val(summa);
			});	
} */

/* var fillTable2 = function() {
	        var data;
			var summa;
			var table = $("input[data-field-name*='EtapVnebudjet-SumPlatejEtapVnebudjet']").closest("div.table-content");
			
			table.find("div.table-edit-row").each(function() {
			var elem3 = $(this).find("input[data-field-name*='EtapVnebudjet-DateFinishVnebudjet']");
			var elem4 = $(this).find("input[data-field-name*='EtapVnebudjet-SumPlatejEtapVnebudjet']");
			if ($(elem4).length) {
			var data=elem3.val();
			var summa=elem4.val();
			}
			var table2 = $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").closest("div.table-content");
			var addButton = table2.find(".table-add-row-button");
			addButton.click();
			var elem1 = $(this).find("input[data-field-name*='EtapIspolnenie-DateFinishIspolnenie']");
			var elem2 = $(this).find("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']");
			var nm =$("input[data-field-name*='EtapIspolnenie-DateFinishIspolnenie']").parents("div.table-edit-row");
		    var id = nm.attr("data-rowkey");
			 $("input[name='EtapIspolnenie-DateFinishIspolnenie-"+id+"']").val(data);
			$("input[name='EtapIspolnenie-SumPlatejIspolnenie-"+id+"']").val(summa);
			});
		
} */

/* var removerows = function() {
	var getRowsTableByTableName = function () {
    return $('[data-name=EtapIspolnenie]').children('.table-content').children('.table-edit-row[data-rowkey]');
};
 var rowsTable = getRowsTableByTableName();
    rowsTable.each(function (index, row) {
	 if	($("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").val().length==0 && $("input[data-field-name*='EtapIspolnenie-SumPlatejIspolnenie']").val()!==null))
        row.querySelector(".table-remove-row-button").click();
});
}
 */

scopes.onRegister(EditReg);
scopes.onRegister(VidReg);
scopes.onRegister(knopka);
scopes.onRegister(god_reg);
scopes.onRegister(god_reg1);
scopes.onRegister(CurrrencyReg);
scopes.onRegister(FormulaReg);
scopes.onRegister(calculateVolume);
scopes.onRegister(BankGarantiaReg);
scopes.onRegister(vneseniedsChecked);
scopes.onRegister(OsnovanieReg);
scopes.onRegister(VidDocIzmenenie);
scopes.onRegister(ObespechIspol);
scopes.onRegister(BankCursChecked);
scopes.onRegister(DSCursChecked);
scopes.onRegister(calculateSumBank);
scopes.onRegister(calculateRazmObes);
scopes.onRegister(vneseniedsChecked);
scopes.onRegister(Summa);
scopes.onRegister(SummaOsn);
scopes.onRegister(SummaVne);
scopes.onRegister(SummaVne1);
scopes.onRegister(Financy);
scopes.onRegister(FinancyUroven);
scopes.onRegister(FinancyVnebudjet);
scopes.onRegister(SummaIspolnenie);
scopes.onRegister(Ostatok);
scopes.onRegister(OstatokEvent);
scopes.onRegister(FactSumma);
scopes.onRegister(calculateOstatok);
scopes.onRegister(calculateValuta);
 scopes.onRegister(dataBudjet);
scopes.onRegister(dataVnebudjet);

scopes.onEdit(EditReg);
scopes.onEdit(VidReg);
scopes.onRegister(VidReg);
scopes.onEdit(knopka); 
scopes.onEdit(god_reg);
scopes.onEdit(god_reg1);
scopes.onEdit(CurrrencyReg);
scopes.onEdit(FormulaEdit);
scopes.onEdit(calculateVolume);
scopes.onEdit(BankGarantiaEdit);
scopes.onEdit(OsnovanieEdit);
scopes.onEdit(ObespechIspol);
scopes.onEdit(vneseniedsChecked);
scopes.onEdit(BankCursChecked);
scopes.onEdit(DSCursChecked);
scopes.onEdit(calculateSumBank);
scopes.onEdit(calculateRazmObes);
scopes.onEdit(VidDocIzmenenie);
scopes.onEdit(Summa);
scopes.onEdit(SummaOsn);
scopes.onEdit(SummaVne);
scopes.onEdit(SummaVne1);
scopes.onEdit(Financy);
scopes.onEdit(FinancyUroven);
scopes.onEdit(FinancyVnebudjet);
scopes.onEdit(SummaIspolnenie);
scopes.onEdit(Ostatok);
scopes.onEdit(OstatokEvent);
scopes.onEdit(FactSumma);
scopes.onEdit(calculateOstatok);
scopes.onEdit(calculateValuta);
scopes.onEdit(SummaOsnZagruzka);
scopes.onEdit(SummaVneZagruzka);
scopes.onEdit(FactSummaZagruzka);
scopes.onEdit(OstatokZagruzka);
scopes.onEdit(dataBudjet); 
scopes.onEdit(dataVnebudjet);
/* scopes.onEdit(copyrow); */
/* scopes.onEdit(fillTable);
scopes.onEdit(fillTable2);
scopes.onEdit(removerows); */

 scopes.onView(CurrrencyView);
scopes.onView(FormulaView);
scopes.onView(BankGarantiaView);
scopes.onView(ObespechIspolView);
scopes.onView(VidDocIzmenenieView);
/* scopes.onView(BankGarantValutaView);
	scopes.onView(VnesenieDSValutaView); */
