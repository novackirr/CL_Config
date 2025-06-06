"use strict";

var Route = function() {
	var BlockRoute= $("li:has(:contains('Маршруты'))");
	//var BlockFiles= $("li:has(:contains('Присоединенные файлы'))");
	BlockRoute.hide();
	//BlockFiles.hide();
};
var EditReg = function() {
	
	$("li:has(:contains('Скрытые поля'))").hide();
	
}

var Visible = function() {
	
	$("li:has(:contains('Международное группировочное или химическое наименование лекарственного препарата'))").hide();
	
}

// год на регистрации 
var god_reg = function() {	
	var god = $("input[name='god']");
    var Data = new Date();
	var Year = Data.getFullYear();	
    god.val( Year ); 
};

//значение КВР не определено, просмотр
var registerKVRView = function() {
	var regKVRV = $("div[data-name='КВР']");
	var regKVRVName = $("div[data-name='КВР по статье расхода']");
	var flag = $("div[data-name='Значение КВР неопределено']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {	
		regKVRV.hide();
		regKVRVName.hide();  		
		} else {
		regKVRV.show();
        regKVRVName.show();
		$("div[data-name='Значение КВР неопределено']").hide();
	}
};

//значение КВР не определено, редактирование
var registerKVRReg = function() {
	var flag = $("input[name='notKVR']");
	var regKVR = $("input[data-field-name='registerKVR']");
	var regKVRName = $("textarea[name='registerKVRName']");	
	flag.change(function() {
		if ($(this).is(":checked")) {				
			regKVRName.val("");
			regKVR.val("");
			regKVRName.closest(".clearfix").find(".dict-display-field").val("");
			regKVR.closest(".column-container").hide();					
			regKVR.prop("required",false );
			regKVRName.prop("required", false);
			regKVR.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			regKVRName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=registerKVR]").removeClass("label-required");		
            $("[data-related-field=regKVRName]").removeClass("label-required");		
			regKVRName.closest(".column-container").hide();		
			$("[data-related-field=registerKVR]").hide();
			$("[data-related-field=registerKVRName]").hide();			
			} else {			
			regKVR.closest(".column-container").show();	
			regKVRName.closest(".column-container").show();	
			 $("[data-related-field=registerKVR]").show();
			$("[data-related-field=registerKVRName]").show();
			regKVR.closest(".clearfix").find(".dict-display-field").prop("required", true);	
			regKVRName.prop("required", true);
			regKVRName.addClass("label-required");
            $("[data-related-field=registerKVRName]").addClass("label-required");
			regKVR.addClass("label-required");
			$("[data-related-field=registerKVR]").addClass("label-required");
		}		
	});
	flag.change ();
}	


//невозможно определить количество
// просмотр
var PriceView = function() {
    var PriceRez = $("div[data-name='Цена запасных частей']");
	var PriceMid = $("div[data-name='Средняя цена за единицу']");
    var flag = $("div[data-name='Невозможно определить количество']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
 		PriceMid.hide();
		PriceRez.show();
		} else {
  		PriceMid.show();
		PriceRez.hide();		
	}
};
//на регистрацию 
var PriceReg = function() {
	var flag = $("input[name='notcol']");
	var PriceMid=$("input[name='PriceMid']");
	var PriceRez=$("input[name='PriceRez']");
	var okei=$("input[name='okei']");
	var Сolcur=$("input[name='сolcur']");
	var colfirst=$("input[name='colfirst']");
	var colsec=$("input[name='colsec']");
	var collast=$("input[name='collast']");
	var sumcur = $("input[name='sumcur']");
	var sumfirst = $("input[name='sumfirst']");
	var sumsec = $("input[name='sumsec']");
	var sumlast = $("input[name='sumlast']");
	flag.change(function() {
        if ($(flag).is(":checked")) {	
			sumfirst.val("");
			sumfirst.closest(".clearfix").find(".number").val("");
			sumsec.val("");
			sumsec.closest(".clearfix").find(".number").val("");
			sumlast.val("");
			sumlast.closest(".clearfix").find(".number").val("");
			PriceMid.closest(".column-container").hide();
			$("[data-related-field=PriceMid]").hide();	
			PriceMid.prop("required", false);
			PriceMid.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=PriceMid]").removeClass("label-required");	
			PriceMid.val("");
			PriceMid.closest(".clearfix").find(".number").val("");
			PriceRez.closest(".column-container").show();	
			$("[data-related-field=PriceRez]").show();	
			PriceRez.prop("required", true);
			PriceRez.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=PriceRez]").addClass("label-required");						
			Сolcur.val="1";
			okei.closest(".clearfix").find(".dict-display-field").prop("required", false);
			okei.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=okei]").removeClass("label-required");	
			okei.val("");
			Сolcur.closest(".clearfix").find(".number").prop("readonly", true);	
			colfirst.closest(".clearfix").find(".number").prop("readonly", true);	
			colsec.closest(".clearfix").find(".number").prop("readonly", true);	
			collast.closest(".clearfix").find(".number").prop("readonly", true);	
			calculateAll();
		}
		else
		{   	
			sumfirst.val("");
			sumfirst.closest(".clearfix").find(".number").val("");
			sumsec.val("");
			sumsec.closest(".clearfix").find(".number").val("");
			sumlast.val("");
			sumlast.closest(".clearfix").find(".number").val("");
			PriceRez.closest(".column-container").hide();		
			$("[data-related-field=PriceRez]").hide();		
			PriceRez.prop("required", false);
			PriceRez.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=PriceRez]").removeClass("label-required");	
			PriceRez.val("");
			PriceRez.closest(".clearfix").find(".number").val("");		
			PriceMid.closest(".column-container").show();	
			$("[data-related-field=PriceMid]").show();
			PriceMid.prop("required", true);
			PriceMid.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=PriceMid]").addClass("label-required");	
			okei.closest(".clearfix").find(".dict-display-field").prop("required", true);
			okei.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=okei]").addClass("label-required");
			Сolcur.closest(".clearfix").find(".number").prop("readonly", false);	
			colfirst.closest(".clearfix").find(".number").prop("readonly", false);	
			colsec.closest(".clearfix").find(".number").prop("readonly", false);	
			collast.closest(".clearfix").find(".number").prop("readonly", false);
			calculateAll();
		}		
	});
	flag.change ();
}	

var PriceEdit = function() {
	var flag = $("#editView input[name='notcol']");
	var PriceMid=$("#editView input[name='PriceMid']");
	var PriceRez=$("#editView input[name='PriceRez']");
	var okei=$("#editView input[name='okei']");
	var Сolcur=$("#editView input[name='сolcur']");
	var colfirst=$("#editView input[name='colfirst']");
	var colsec=$("#editView input[name='colsec']");
	var collast=$("#editView input[name='collast']");
	var sumcur = $("#editView input[name='sumcur']");
	var sumfirst = $("#editView input[name='sumfirst']");
	var sumsec = $("#editView input[name='sumsec']");
	var sumlast = $("#editView input[name='sumlast']");
	flag.change(function() {
		if ($(flag).is(":checked")) {		
			sumfirst.val("");
			sumfirst.closest(".clearfix").find(".number").val("");
			sumsec.val("");
			sumsec.closest(".clearfix").find(".number").val("");
			sumlast.val("");
			sumlast.closest(".clearfix").find(".number").val("");
			PriceMid.closest(".column-container").hide();
			$("[data-related-field=PriceMid]").hide();	
			PriceMid.prop("required", false);
			PriceMid.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=PriceMid]").removeClass("label-required");	
			PriceMid.val("");
			PriceMid.closest(".clearfix").find(".number").val("");
			PriceRez.closest(".column-container").show();	
			$("[data-related-field=PriceRez]").show();	
			PriceRez.prop("required", true);
			PriceRez.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=PriceRez]").addClass("label-required");						
			Сolcur.val="1";
			okei.closest(".clearfix").find(".dict-display-field").prop("required", false);
			okei.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=okei]").removeClass("label-required");	
			okei.val("");
			Сolcur.closest(".clearfix").find(".number").prop("readonly", true);	
			colfirst.closest(".clearfix").find(".number").prop("readonly", true);	
			colsec.closest(".clearfix").find(".number").prop("readonly", true);	
			collast.closest(".clearfix").find(".number").prop("readonly", true);	
			calculateAll();
		}
		else
		{   	
			sumfirst.val("");
			sumfirst.closest(".clearfix").find(".number").val("");
			sumsec.val("");
			sumsec.closest(".clearfix").find(".number").val("");
			sumlast.val("");
			sumlast.closest(".clearfix").find(".number").val("");
			PriceRez.closest(".column-container").hide();		
			$("[data-related-field=PriceRez]").hide();		
			PriceRez.prop("required", false);
			PriceRez.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=PriceRez]").removeClass("label-required");	
			PriceRez.val("");
			PriceRez.closest(".clearfix").find(".number").val("");		
			PriceMid.closest(".column-container").show();	
			$("[data-related-field=PriceMid]").show();
			PriceMid.prop("required", true);
			PriceMid.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=PriceMid]").addClass("label-required");	
			okei.closest(".clearfix").find(".dict-display-field").prop("required", true);
			okei.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=okei]").addClass("label-required");
			Сolcur.closest(".clearfix").find(".number").prop("readonly", false);	
			colfirst.closest(".clearfix").find(".number").prop("readonly", false);	
			colsec.closest(".clearfix").find(".number").prop("readonly", false);	
			collast.closest(".clearfix").find(".number").prop("readonly", false);
			calculateAll();
		}		
	});
	flag.change ();	
}	

var calculateAll = function() {		
	function calculateTotalSum() {
		var sumcurElement = $("input[name='sumcur']");
		var sumfirstElement = $("input[name='sumfirst']");
		var sumsecElement = $("input[name='sumsec']");
		var sumlastElement = $("input[name='sumlast']");
		var sumElement = $("input[name='sum']");		
		var sumCur = sumcurElement.autoNumeric('get') * 1;
		var sumFirst = sumfirstElement.autoNumeric('get') * 1;
		var sumSecond = sumsecElement.autoNumeric('get') * 1;
		var sumLast = sumlastElement.autoNumeric('get') * 1;		
		sumElement.autoNumeric('set', sumCur + sumFirst + sumSecond + sumLast);
		sumElement.change();
	}
	
	function calculateTotalCount() {
		var colcurElement = $("input[name='colcur']");
		var colfirstElement = $("input[name='colfirst']");
		var colsecElement = $("input[name='colsec']");
		var collastElement = $("input[name='collast']");		
		var totalCountElement = $("input[name='col']");		
		var colCur = parseFloat(colcurElement.val() ? colcurElement.val() : 0);
		var colFirst = parseFloat(colfirstElement.val() ? colfirstElement.val() : 0);
		var colSecond =parseFloat(colsecElement.val() ? colsecElement.val() : 0);
		var colLast = parseFloat(collastElement.val() ? collastElement.val() : 0);		
		totalCountElement.val(colCur + colFirst + colSecond + colLast);
		//totalCountElement.change();
	}
	function calculateSum() {	
		var priceElement;
		var notcol = $("input[name='notcol']");		
		if (notcol.is(":checked")) {
			priceElement = $("input[name='PriceRez']")
			} else {
			priceElement = $("input[name='PriceMid']");
		}		
		var price = priceElement.autoNumeric('get');		
		var colcurElement = $("input[name='colcur']");
		var colfirstElement = $("input[name='colfirst']");
		var colsecElement = $("input[name='colsec']");
		var collastElement = $("input[name='collast']");		
		var colCur = parseFloat(colcurElement.val() ? colcurElement.val() : 0);
		var colFirst = parseFloat(colfirstElement.val() ? colfirstElement.val() : 0);
		var colSecond =parseFloat(colsecElement.val() ? colsecElement.val() : 0);
		var colLast = parseFloat(collastElement.val() ? collastElement.val() : 0);		
		var sumcurElement = $("input[name='sumcur']");
		var sumfirstElement = $("input[name='sumfirst']");
		var sumsecElement = $("input[name='sumsec']");
		var sumlastElement = $("input[name='sumlast']");		
		sumcurElement.autoNumeric('set', price * colCur);
		sumfirstElement.autoNumeric('set', price * colFirst);
		sumsecElement.autoNumeric('set', price * colSecond);
		sumlastElement.autoNumeric('set', price * colLast);
	}
	
	$("input[name='PriceRez'], input[name='PriceMid']").change(function() {
		calculateSum();
		calculateTotalSum();
	});
	
	$("input[name='sumcur'], input[name='sumfirst'], input[name='sumfirst'], input[name='sumsec'], input[name='sumlast']").change(function() {
		calculateTotalSum();
	});
	
	$("input[name='colcur'], input[name='colfirst'], input[name='colsec'], input[name='collast']").change(function() {
		calculateTotalCount();
		calculateSum();
		calculateTotalSum();
	});
	
	$("input[name='notcol']").change(function() {
		if (this.checked){
			$("input[name='col']").val(1).change();
			$("input[name='colcur']").val(1);
			$("input[name='colfirst']").val("");
			$("input[name='colsec']").val("");
			$("input[name='collast']").val("");			
		}
	});
}


//КБК обязательно,если источник финансирования бюджет
var KBKReg = function() {
	var flag = $("input[name='registerIF']");
	var KBKRashod=$("input[name='registerKBK']");
	flag.change(function() {
        if ($(this).val() == "Бюджетные средства") {
			KBKRashod.closest(".clearfix").find(".dict-display-field").prop("required", true);
			KBKRashod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=registerKBK]").addClass("label-required");
		}
		else
		{   	
	        KBKRashod.val("");
			KBKRashod.closest(".clearfix").find(".dict-display-field").val("");
			KBKRashod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			KBKRashod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=registerKBK]").removeClass("label-required");
			KBKRashod.closest(".clearfix").find(".dict-display-field").val("");			
		}		
	});
	flag.change ();
}	

//на редактирование	

var KBKEdit = function() {
	var flag = $("#editView input[name='registerIF']");
	var KBKRashod=$("#editView input[name='registerKBK']");
	flag.change(function() {
        if ($(this).val() == "Бюджетные средства") {	
			KBKRashod.closest(".clearfix").find(".dict-display-field").prop("required", true);
			KBKRashod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=registerKBK]").addClass("label-required");
		}
		else
		{
			KBKRashod.val("");
			KBKRashod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			KBKRashod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=registerKBK]").removeClass("label-required");
			KBKRashod.closest(".clearfix").find(".dict-display-field").val("");
		}
	});
	flag.change ();
}

//записать значение ОКПД2 в скрыте поле ОКПД2_ЛП

var OKPD2_LP = function() {   
	function  OKPDChange() {
		var OKPD= $("input[name='registerOKDP']").val();
		var OKPD2LP = $("input[name='OKPD2LP']");
		OKPD2LP.val(OKPD);
		
		OKPD2LP.change();
	}
	$("input[name='registerOKDP']").change(function () {
		OKPDChange();
	});
}

var OKPD2_LP_Edit = function() { 
	function  OKPDChange() {
		var OKPD= $("#editView input[name='registerOKDP']").val();
		var OKPD2LP = $("#editView input[name='OKPD2LP']");
		OKPD2LP.val(OKPD);
		OKPD2LP.change();		
	}
	$("input[name='registerOKDP']").change(function () {
		OKPDChange();
	});
}

//Записать значения 2  уровня словаря Лекарственные препараты в таблицу
var Table_LP = function() {   
	function  TableChange() {
		var NameLF= $("input[name='NameLF']").val();
		var LecFormName = $("input[name='PozTab-LecFormName']");		
		var NameDoz= $("input[name='NameDoz']").val();
		var DosNAme = $("input[name='PozTab-DosNAme']");		
		var DozName= $("input[name='DozName']").val();
		var EdIzmDosName = $("input[name='PozTab-EdIzmDosName']");		
		var ZnachDoz= $("input[name='ZnachDoz']").val();
		var ZnachDos = $("input[name='PozTab-ZnachDos']");		
		var FullDoz= $("input[name='FullDoz']").val();
		var FullFormDos = $("input[name='PozTab-FullFormDos']");
		
		LecFormName.val(NameLF);
		LecFormName.change();			
		DosNAme.val(NameDoz);
		DosNAme.change();				
		EdIzmDosName.val(DozName);
		EdIzmDosName.change();			
		ZnachDos.val(ZnachDoz);
		ZnachDos.change();			
		FullFormDos.val(FullDoz);
		FullFormDos.change();			
	}
	
	function  TableChange1() {
		var VidNametmp = $("input[name='PozTab-VidNametmp-1']").val();
		var ColPervUptmp = $("input[name='PozTab-ColPervUptmp-1']").val();
		var ColPervInVtorUptmp = $("input[name='PozTab-ColPervInVtorUptmp-1']").val();
		
		
		var VidName = $("input[data-field-name='SvedTab-VidName']");
		var ColPervUp = $("input[data-field-name='SvedTab-ColPervUp']");
		var ColPervInVtorUp = $("input[data-field-name='SvedTab-ColPervInVtorUp']");
		
		VidName.val(VidNametmp);
		VidName.change();	
		ColPervUp.val(ColPervUptmp);
		ColPervUp.change();	
		ColPervInVtorUp.val(ColPervInVtorUptmp);
		ColPervInVtorUp.change();	
	}
	
	function ClearTable_LP() {
		var Megdun= $("input[name='Megdun']");
		var Table= $("[data-name='PozTab']");
		Table.find(".table-edit-row[data-rowkey]").remove();		
	}	 
	
	function ClearTable_Pod() {
		var TorgNameKod1= $("[data-field-name='PozTab-TorgNameKod']");
		var Table= $("[data-name='PozTab']");
		var stroka = Table.find("div.table-edit-row[data-rowkey]");
		var id1 = stroka.attr("data-rowkey");
		
		$("[data-name='PozTab-"+id1+"-SvedTab']").remove();
	}
	
	$("input[data-edit-name='TorgNameKod']").change(function () {
	    ClearTable_Pod();
	});
	$("input[name='Megdun']").change(function () {
	    ClearTable_Pod();
		ClearTable_LP();
	});
	
	
	$("input[name='NameLF'], input[name='NameDoz'], input[name='DozName'], input[name='ZnachDoz'], input[name='FullDoz']").change(function () {
		TableChange();
	});
	
	$("input[data-field-name='PozTab-VidNametmp'], input[data-field-name='PozTab-ColPervUptmp'], input[data-field-name='PozTab-ColPervInVtorUptmp']").change(function () {
		TableChange1();
	});
	
	
	$("div[data-deleted-attachment-keys='SvedTab_deletedAttachments'] div.table-add-row-button").click(function() {
		TableChange1();
	});
	
	$("input[data-edit-name='TorgNameKod']").change(function () {
	    ClearTable_Pod();
	});
}	


var Table_LP_Edit = function() {   
	function  TableChange() {
		var NameLF= $("#editView input[name='NameLF']").val();
		var LecFormName = $("#editView input[name='PozTab-LecFormName']");		
		var NameDoz= $("#editView input[name='NameDoz']").val();
		var DosNAme = $("#editView input[name='PozTab-DosNAme']");		
		var DozName= $("#editView input[name='DozName']").val();
		var EdIzmDosName = $("#editView input[name='PozTab-EdIzmDosName']");		
		var ZnachDoz= $("#editView input[name='ZnachDoz']").val();
		var ZnachDos = $("#editView input[name='PozTab-ZnachDos']");		
		var FullDoz= $("#editView input[name='FullDoz']").val();
		var FullFormDos = $("#editView input[name='PozTab-FullFormDos']");
		
		LecFormName.val(NameLF);
		LecFormName.change();			
		DosNAme.val(NameDoz);
		DosNAme.change();				
		EdIzmDosName.val(DozName);
		EdIzmDosName.change();			
		ZnachDos.val(ZnachDoz);
		ZnachDos.change();			
		FullFormDos.val(FullDoz);
		FullFormDos.change();			
	}
	
	function ClearTable_LP() {
		var Megdun= $("#editView input[name='Megdun']");
		var Table= $("[data-name='PozTab']");
		Table.find(".table-edit-row[data-rowkey]").remove();
	}	 
	
	$("input[name='Megdun']").change(function () {
		ClearTable_LP();
	});
	$("input[name='NameLF'], input[name='NameDoz'], input[name='DozName'], input[name='ZnachDoz'], input[name='FullDoz']").change(function () {
		TableChange();
	});
}

//Если ОКПД2 начинается на 21 автоматически ставится галочка "Лекарственный препарат"
var LecPrepReg = function() {
	var OKPD2 = $("input[name='registerOKDP']");
	var Preparat= $("input[data-field-name='LecPrep']");
	
	function LecPepFunction() {
		var OKPD2 = $("input[name='registerOKDP']");
		var block = $("li:has(:contains('Международное группировочное или химическое наименование лекарственного препарата'))");
		var Megdun= $("input[name='Megdun']");
		var SrockGodnosti= $("input[name='SrockGodnosti']");
		var TorgNameKod= $("input[name='PozTab-TorgNameKod']");
		var RegNumber= $("input[name='PozTab-RegNumber']");
		var LecFormName= $("input[name='PozTab-LecFormName']");
		var DosNAme= $("input[name='PozTab-DosNAme']");
		var EdIzmDosKod= $("input[name='PozTab-EdIzmDosKod']");
		var EdIzmDosName= $("input[name='PozTab-EdIzmDosName']");
		var ZnachDos= $("input[name='PozTab-ZnachDos']");
		var FullFormDos= $("input[name='PozTab-FullFormDos']");
		var Vladelec= $("input[name='PozTab-Vladelec']");
		var StanaProizv= $("input[name='PozTab-StanaProizv']");
		var StanaProizvKod= $("input[name='StanaProizvKod']");
		var NameProizvPrep= $("input[name='PozTab-NameProizvPrep']");
		var VidName= $("input[name='PozTab-1-SvedTab-VidName']");
		var ColPervUp= $("input[name='PozTab-1-SvedTab-ColPervUp']");
		var ColPervInVtorUp= $("input[name='PozTab-1-SvedTab-ColPervInVtorUp']");
		var ColVtorUp= $("input[name='PozTab-1-SvedTab-ColVtorUp']");
		var ComplUpack= $("input[name='PozTab-1-SvedTab-ComplUpack']");
		var NotMNN= $("input[name='NotMNN']");
		var GNVLP= $("input[name='GNVLP']");
		var OKPD2Change=OKPD2.val();
		var OKPD2_Cod=OKPD2Change.substr(0,2);
		if ((OKPD2_Cod == "21") || (Preparat.is(":checked"))) {
			Preparat.prop('checked', true);
            block.show();
			SrockGodnosti.closest(".clearfix").find(".date-field").prop("required", true);
			SrockGodnosti.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=SrockGodnosti]").addClass("label-required");
			TorgNameKod.closest(".clearfix").find(".dict-display-field").prop("required", true);
			TorgNameKod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=PozTab-TorgNameKod]").addClass("label-required");	
		}
		else
		{ 
			Preparat.prop('checked', false);
        	block.hide();
			Megdun.val("");
			Megdun.closest(".clearfix").find(".dict-display-field").val("");
			Megdun.closest(".clearfix").find(".dict-display-field").prop("required", false);
			Megdun.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=Megdun]").removeClass("label-required");
			SrockGodnosti.val("");
			SrockGodnosti.closest(".clearfix").find(".date-field").val("");
			SrockGodnosti.closest(".clearfix").find(".date-field").prop("required", false);
			SrockGodnosti.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=SrockGodnosti]").removeClass("label-required");
			TorgNameKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			TorgNameKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-TorgNameKod]").removeClass("label-required");
			RegNumber.val("");
			RegNumber.closest(".clearfix").find(".form-control").val("");
			RegNumber.closest(".clearfix").find(".form-control").prop("required", false);
			RegNumber.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-RegNumber]").removeClass("label-required");
			LecFormName.closest(".clearfix").find(".dict-display-field").prop("required", false);
			LecFormName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-LecFormName]").removeClass("label-required");
			DosNAme.closest(".clearfix").find(".dict-display-field").prop("required", false);
			DosNAme.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-DosNAme]").removeClass("label-required");
			EdIzmDosKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			EdIzmDosKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-EdIzmDosKod]").removeClass("label-required");
			EdIzmDosName.closest(".clearfix").find(".dict-display-field").prop("required", false);
			EdIzmDosName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-EdIzmDosName]").removeClass("label-required");
			ZnachDos.closest(".clearfix").find(".dict-display-field").prop("required", false);
			ZnachDos.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-ZnachDos]").removeClass("label-required");
			FullFormDos.closest(".clearfix").find(".dict-display-field").prop("required", false);
			FullFormDos.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-FullFormDos]").removeClass("label-required");
			Vladelec.closest(".clearfix").find(".dict-display-field").prop("required", false);
			Vladelec.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-Vladelec]").removeClass("label-required");
			StanaProizv.closest(".clearfix").find(".dict-display-field").prop("required", false);
			StanaProizv.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-StanaProizv]").removeClass("label-required");
			StanaProizvKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			StanaProizvKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field= StanaProizvKod]").removeClass("label-required");
			NameProizvPrep.closest(".clearfix").find(".dict-display-field").prop("required", false);
			NameProizvPrep.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-NameProizvPrep]").removeClass("label-required");
			VidName.closest(".clearfix").find(".dict-display-field").prop("required", false);
			VidName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-1-SvedTab-VidName]").removeClass("label-required");
			ColPervUp.closest(".clearfix").find(".dict-display-field").prop("required", false);
			ColPervUp.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-1-SvedTab-ColPervUp]").removeClass("label-required");
			ColPervInVtorUp.closest(".clearfix").find(".dict-display-field").prop("required", false);
			ColPervInVtorUp.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field= PozTab-1-SvedTab-ColPervInVtorUp]").removeClass("label-required");
			ColVtorUp.closest(".clearfix").find(".dict-display-field").prop("required", false);
			ColVtorUp.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			$("[data-related-field=PozTab-1-SvedTab-ColVtorUp]").removeClass("label-required");
			NotMNN.prop('checked', false);
			GNVLP.prop('checked', false);
		}
	}
	
	OKPD2.change(function () {
		LecPepFunction();
	});
	
	Preparat.change(function () {
		LecPepFunction();
	});
}

var LecPrepEdit = function() {
	var OKPD2 = $("#editView input[name='registerOKDP']");
	var Preparat= $("#editView input[name='LecPrep']");
	
	
	OKPD2.change(function () {
		LecPepFunctionEdit();
	});
	
	Preparat.change(function () {
		LecPepFunctionEdit();
	});
}

function LecPepFunctionEdit() {
	var OKPD2 = $("#editView input[name='registerOKDP']");
	var Preparat= $("#editView input[data-field-name='LecPrep']");
	var block = $("li:has(:contains('Международное группировочное или химическое наименование лекарственного препарата'))");
	var Megdun= $("#editView input[name='Megdun']");
	var SrockGodnosti= $("#editView input[name='SrockGodnosti']");
	var TorgNameKod= $("#editView input[name='PozTab-TorgNameKod']");
	var RegNumber= $("#editView input[name='PozTab-RegNumber']");
	var LecFormName= $("#editView input[name='PozTab-LecFormName']");
	var DosNAme= $("#editView input[name='PozTab-DosNAme']");
	var EdIzmDosKod= $("#editView input[name='PozTab-EdIzmDosKod']");
	var EdIzmDosName= $("#editView input[name='PozTab-EdIzmDosName']");
	var ZnachDos= $("#editView input[name='PozTab-ZnachDos']");
	var FullFormDos= $("#editView input[name='PozTab-FullFormDos']");
	var Vladelec= $("#editView input[name='PozTab-Vladelec']");
	var StanaProizv= $("#editView input[name='PozTab-StanaProizv']");
	var StanaProizvKod= $("#editView input[name='StanaProizvKod']");
	var NameProizvPrep= $("#editView input[name='PozTab-NameProizvPrep']");
	var VidName= $("#editView input[name='PozTab-1-SvedTab-VidName']");
	var ColPervUp= $("#editView input[name='PozTab-1-SvedTab-ColPervUp']");
	var ColPervInVtorUp= $("#editView input[name='PozTab-1-SvedTab-ColPervInVtorUp']");
	var ColVtorUp= $("#editView input[name='PozTab-1-SvedTab-ColVtorUp']");
	var ComplUpack= $("#editView input[name='PozTab-1-SvedTab-ComplUpack']");
	var NotMNN= $("#editView input[name='NotMNN']");
	var GNVLP= $("#editView input[name='GNVLP']");
	var OKPD2Change=OKPD2.val();
	var OKPD2_Cod=OKPD2Change.substr(0,2);
	if ((OKPD2_Cod == "21") || (Preparat.is(":checked"))) {
		Preparat.prop('checked', true);
		block.show();
		SrockGodnosti.closest(".clearfix").find(".date-field").prop("required", true);
		SrockGodnosti.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=SrockGodnosti]").addClass("label-required");
		TorgNameKod.closest(".clearfix").find(".dict-display-field").prop("required", true);
		TorgNameKod.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=PozTab-TorgNameKod]").addClass("label-required");
	}
	else
	{ 
		Preparat.prop('checked', false);
		block.hide();
		Megdun.val("");
		Megdun.closest(".clearfix").find(".dict-display-field").val("");
		Megdun.closest(".clearfix").find(".dict-display-field").prop("required", false);
		Megdun.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=Megdun]").removeClass("label-required");
		SrockGodnosti.val("");
		SrockGodnosti.closest(".clearfix").find(".date-field").val("");
		SrockGodnosti.closest(".clearfix").find(".date-field").prop("required", false);
		SrockGodnosti.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=SrockGodnosti]").removeClass("label-required");
		TorgNameKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
		TorgNameKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-TorgNameKod]").removeClass("label-required");
		RegNumber.val("");
		RegNumber.closest(".clearfix").find(".form-control").val("");
		RegNumber.closest(".clearfix").find(".form-control").prop("required", false);
		RegNumber.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-RegNumber]").removeClass("label-required");
		LecFormName.closest(".clearfix").find(".dict-display-field").prop("required", false);
		LecFormName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-LecFormName]").removeClass("label-required");
		DosNAme.closest(".clearfix").find(".dict-display-field").prop("required", false);
		DosNAme.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-DosNAme]").removeClass("label-required");
		EdIzmDosKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
		EdIzmDosKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-EdIzmDosKod]").removeClass("label-required");
		EdIzmDosName.closest(".clearfix").find(".dict-display-field").prop("required", false);
		EdIzmDosName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-EdIzmDosName]").removeClass("label-required");
		ZnachDos.closest(".clearfix").find(".dict-display-field").prop("required", false);
		ZnachDos.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-ZnachDos]").removeClass("label-required");
		FullFormDos.closest(".clearfix").find(".dict-display-field").prop("required", false);
		FullFormDos.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-FullFormDos]").removeClass("label-required");
		Vladelec.closest(".clearfix").find(".dict-display-field").prop("required", false);
		Vladelec.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-Vladelec]").removeClass("label-required");
		StanaProizv.closest(".clearfix").find(".dict-display-field").prop("required", false);
		StanaProizv.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-StanaProizv]").removeClass("label-required");
		StanaProizvKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
		StanaProizvKod.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field= StanaProizvKod]").removeClass("label-required");
		NameProizvPrep.closest(".clearfix").find(".dict-display-field").prop("required", false);
		NameProizvPrep.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-NameProizvPrep]").removeClass("label-required");
		VidName.closest(".clearfix").find(".dict-display-field").prop("required", false);
		VidName.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-1-SvedTab-VidName]").removeClass("label-required");
		ColPervUp.closest(".clearfix").find(".dict-display-field").prop("required", false);
		ColPervUp.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-1-SvedTab-ColPervUp]").removeClass("label-required");
		ColPervInVtorUp.closest(".clearfix").find(".dict-display-field").prop("required", false);
		ColPervInVtorUp.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field= PozTab-1-SvedTab-ColPervInVtorUp]").removeClass("label-required");
		ColVtorUp.closest(".clearfix").find(".dict-display-field").prop("required", false);
		ColVtorUp.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=PozTab-1-SvedTab-ColVtorUp]").removeClass("label-required");
		NotMNN.prop('checked', false);
		GNVLP.prop('checked', false);	
	}
}

var LecPrepView = function() {
	var InternView = $("li:has(:contains('Международное группировочное или химическое наименование лекарственного препарата'))");
	var OKPD21 = $("div[data-name='ОКПД2']");
    var Preparat1 = $("div[data-name='Лекарственный препарат']").find("input[type='checkbox']");
	var InternView = $("li:has(:contains('Международное группировочное или химическое наименование лекарственного препарата'))");
	if ($(Preparat1).attr("checked")) {
		InternView.show();	
	}
	else
	{ 
		InternView.hide();	
	}
}

var MNN = function() {
	var  flag = $("input[data-field-name='NotMNN']");
	var Megdun= $("input[name='Megdun']");
	var  MegdunName= $("input[name='MegdunName']");
	var  MegdunNameRed= $("input[name='MegdunNameRed']");
	var Table= $("[data-name='PozTab']");
	flag.change(function() {
        if (!$(this).is(":checked")) {
		MegdunNameRed.val("");
		MegdunNameRed.closest(".clearfix").val("");
		MegdunNameRed.prop("required", false);
		MegdunNameRed.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=MegdunNameRed]").removeClass("label-required");	
		$("[data-field-name=MegdunNameRed]").hide();
		$("[data-related-field=MegdunNameRed]").hide();	
		Megdun.closest(".column-container").show();
		$("[data-related-field=Megdun]").show();	
		Megdun.prop("required", true);
		Megdun.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=Megdun]").addClass("label-required");	
		Megdun.closest(".clearfix").find(".dict-display-field").prop("readonly", true);				
		}
		else
		{				
			Megdun.val("");
			MegdunName.val("");					
			Megdun.closest(".clearfix").find(".dict-display-field").val("");
			MegdunName.closest(".clearfix").find(".dict-display-field").val("");
			Megdun.prop("required", false);
		    Megdun.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=Megdun]").removeClass("label-required");
			Megdun.closest(".column-container").hide();
		$("[data-related-field=Megdun]").hide();	
		$("[data-field-name=MegdunNameRed]").prop("readonly", false);
		$("[data-field-name=MegdunNameRed]").show();
		$("[data-related-field=MegdunNameRed]").show();	
		MegdunNameRed.prop("required", true);
		MegdunNameRed.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=MegdunNameRed]").addClass("label-required");	
	        Table.find(".table-edit-row[data-rowkey]").remove();
		}		
	});
	flag.change ();
}


var MNNEdit = function() {
	var  flag = $("input[data-field-name='NotMNN']");
	var Megdun= $("input[name='Megdun']");
	var  MegdunName= $("input[name='MegdunName']");
		var  MegdunNameRed= $("input[name='MegdunNameRed']");
	var Table= $("[data-name='PozTab']");
	flag.change(function() {
        if (!$(this).is(":checked")) {
		MegdunNameRed.val("");
		MegdunNameRed.closest(".clearfix").val("");
		MegdunNameRed.prop("required", false);
		MegdunNameRed.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=MegdunNameRed]").removeClass("label-required");	
		$("[data-field-name=MegdunNameRed]").hide();
		$("[data-related-field=MegdunNameRed]").hide();	
		Megdun.closest(".column-container").show();
		$("[data-related-field=Megdun]").show();	
		Megdun.prop("required", true);
		Megdun.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=Megdun]").addClass("label-required");	
		Megdun.closest(".clearfix").find(".dict-display-field").prop("readonly", true);			
		}
		else
		{				
			Megdun.val("");
			MegdunName.val("");					
			Megdun.closest(".clearfix").find(".dict-display-field").val("");
			MegdunName.closest(".clearfix").find(".dict-display-field").val("");
			Megdun.prop("required", false);
		    Megdun.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=Megdun]").removeClass("label-required");
			Megdun.closest(".column-container").hide();
		$("[data-related-field=Megdun]").hide();	
		$("[data-field-name=MegdunNameRed]").prop("readonly", false);
		$("[data-field-name=MegdunNameRed]").show();
		$("[data-related-field=MegdunNameRed]").show();	
		MegdunNameRed.prop("required", true);
		MegdunNameRed.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=MegdunNameRed]").addClass("label-required");	
		}		
	});
	flag.change ();
}

var MNNView = function() {
    var Megdun = $("div[data-name='Международное непатентованное наименование']");
	var MegdunNameRed = $("div[data-name='Международное непатентованное наименование для редактирования']");
    var flag = $("div[data-name='Отсутствует в МНН']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
 		Megdun.hide();
		MegdunNameRed.show();
		} else {
  		Megdun.show();
		MegdunNameRed.hide();		
	}
};

var OKEI= function() {
	var flag = $("input[name='KTRU']");
	var EdIzm1=$("input[name='okei']");
	var Okei=$("input[name='okeiName']");
	var EdIzm2=$("input[name='EDKTRU']");
	var buttonOkei= $("#okei");
	flag.change(function() {
        if   ($(flag).val().length!==0 && $(flag).val()!==null){	 
			EdIzm1.closest(".column-container").find(".dict-display-field").hide();
			$("[data-related-field=okei]").hide();	
			EdIzm1.closest(".column-container").find(".dict-display-field").prop("required", false);
			EdIzm1.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=okei]").removeClass("label-required");	
			EdIzm1.val("");		
			EdIzm1.closest(".column-container").find(".dict-display-field").val("");
			Okei.val("");
			buttonOkei.hide();
			 
			EdIzm2.show();	
			$("[data-related-field=EDKTRU]").show();	
			EdIzm2.prop("required", true);
			EdIzm2.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=EDKTRU]").addClass("label-required");						
		}
		else
		{   	
			EdIzm2.hide();		
			$("[data-related-field=EDKTRU]").hide();		
			EdIzm2.prop("required", false);
			EdIzm2.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            $("[data-related-field=EDKTRU]").removeClass("label-required");	
			EdIzm2.val("");	
			
			EdIzm1.closest(".column-container").find(".dict-display-field").show();	
			$("[data-related-field=okei]").show();
			EdIzm1.closest(".column-container").find(".dict-display-field").prop("required", true);
			EdIzm1.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            $("[data-related-field=okei]").addClass("label-required");
			buttonOkei.show();
			
		}		
	});
	flag.change ();
}

var OKEIView = function() {
    var OKEI = $("div[data-name='Единица измерения']");
	var OKEI2 = $("div[data-name='Единица измерения КТРУ']");
    var flag = $(".documentView-field-value[data-name='Единица измерения']").text();
	if ($.trim(flag)!=="") {
			OKEI.show();
		OKEI2.hide();	
		} else {
		OKEI.hide();
		OKEI2.show();	
	}
};



scopes.onRegister(EditReg);
scopes.onRegister(god_reg);
scopes.onRegister(Route);
scopes.onRegister(Visible);
scopes.onRegister(PriceReg);
scopes.onRegister(LecPrepReg);
scopes.onRegister(OKPD2_LP);
scopes.onRegister(registerKVRReg);
scopes.onRegister(calculateAll);
scopes.onRegister(KBKReg);
scopes.onRegister(MNN);
scopes.onRegister(Table_LP);
scopes.onRegister(OKEI);

scopes.onEdit(EditReg);
scopes.onEdit(god_reg);
scopes.onEdit(Route);
scopes.onEdit(Visible);
scopes.onEdit(PriceEdit);
scopes.onEdit(LecPrepEdit);
scopes.onEdit(LecPepFunctionEdit);
scopes.onEdit(OKPD2_LP_Edit);
scopes.onEdit(registerKVRReg);
scopes.onEdit(calculateAll);
scopes.onEdit(MNNEdit);
scopes.onEdit(KBKEdit);
scopes.onEdit(Table_LP_Edit );
scopes.onEdit(OKEI);

scopes.onView(Visible);
scopes.onView(Route);
scopes.onView(LecPrepView);
scopes.onView(PriceView);
scopes.onView(MNNView);
scopes.onView(registerKVRView);
scopes.onView(OKEIView);