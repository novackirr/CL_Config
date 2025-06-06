"use strict";

var EditReg = function () {
	
	$("li:has(:contains('Скрытые поля'))").hide();
	
}


//скрыть поле 
var BGEndhide = function () {
	var flag = $("input[name='BGend']");
	var basisEndBG = $("textarea[name='basisEndBG']");
	var dateEndBG = $("input[name='dateEndBG']");
	flag.change(function () {
		if ($(this).is(":checked")) {
			basisEndBG.closest(".column-container").show();
			$("[data-related-field=basisEndBG]").show();
			dateEndBG.closest(".column-container").show();
			$("[data-related-field=dateEndBG]").show();
			} else {
			
					basisEndBG.val("");
			dateEndBG.val("");
			basisEndBG.closest(".clearfix").find(".form-control").val("");
			dateEndBG.closest(".clearfix").find(".form-control").val("");
			basisEndBG.closest(".column-container").hide();
			dateEndBG.closest(".column-container").hide();
			$("[data-related-field=basisEndBG]").hide();
			$("[data-related-field=dateEndBG]").hide();


		}
	});
	flag.change();
}

var CloseEtap = function () {
	var flag = $("select[name='Tipdoc']");

	var EndEtapClose = $("input[name='EndEtapClose']");
	flag.change(function () {
		if ($(this).val() == "Информация об исполнении") {	
			EndEtapClose.closest(".column-container").show();
			$("li:has(:contains('Исполнение контракта'))").show();
			$("li:has(:contains('Рассторжение контракта'))").hide();
			// CurrencyCurs.prop("required", false);
			// CurrencyCurs.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			// $("[data-related-field=curs]").addClass("label-required");


			} else {
			EndEtapClose.closest(".column-container").hide();
			$("li:has(:contains('Исполнение контракта'))").hide();
			if ($(this).val() == "Информация о расторжении") {	
						$("li:has(:contains('Рассторжение контракта'))").show();
						}else {
							$("li:has(:contains('Рассторжение контракта'))").hide();
					}
					} 
	});
	flag.change();
}


var  ViewTerm= function () {
	var flag = $(".documentView-field-value[data-name='Тип документа']");
	

    if ($(flag).text() == "Информация об исполнении") {	
			$("li:has(:contains('Исполнение контракта'))").show();
			$("li:has(:contains('Рассторжение контракта'))").hide();
			} else {
			$("li:has(:contains('Исполнение контракта'))").hide();
			if ($(flag).text() == "Информация о расторжении") {	
						$("li:has(:contains('Рассторжение контракта'))").show();
						}else {
						$("li:has(:contains('Рассторжение контракта'))").hide();
					}
					} ;
	
	
}


// Расторжение договора на регистрацию
var Term_reg = function() {    
    var Tipdoc = $("select[name='Tipdoc']");
    var datetermination = $("input[name='datetermination']");
	var basistermination = $("input[name='basistermination']");
	var basisterminationKod = $("input[name='basisterminationKod']");
	var doctermination = $("input[name='doctermination']");
	var docterminationKod = $("input[name='docterminationKod']");
	var docdatetermination = $("input[name='docdatetermination']");    
    var docnumtermination = $("input[name='docnumtermination']");	
    var reasontermination = $("textarea[name='reasontermination']");	
    var realypaid = $("input[name='realypaid']");    
    var suddatetermination = $("input[name='suddatetermination']");	
    var TipIsp= $("input[name='TipIsp']");
	
    Tipdoc.change(function() {
        if ($(this).val() === "Информация о расторжении") {   
            realypaid.prop("required", true);	
            $("[data-related-field=realypaid]").addClass("label-required");			
            datetermination.prop("required", true);
            $("[data-related-field=datetermination]").addClass("label-required");				
			docdatetermination.prop("required", true);	
            $("[data-related-field=docdatetermination]").addClass("label-required");				
			basistermination.closest(".clearfix").find(".dict-display-field").prop("required", true);
            $("[data-related-field=basistermination]").addClass("label-required");				
			reasontermination.prop("required", true);
            $("[data-related-field=reasontermination]").addClass("label-required");							
			doctermination.closest(".clearfix").find(".dict-display-field").prop("required", true);
            $("[data-related-field=doctermination]").addClass("label-required");				
        } else {
			TipIsp.closest(".clearfix").find(".dict-display-field").prop("required", true);
			TipIsp.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=TipIsp]").addClass("label-required");	

            realypaid.prop("required", false);		
            $("[data-related-field=realypaid]").removeClass("label-required");					
			realypaid.val("");
            datetermination.prop("required", false);
            $("[data-related-field=datetermination]").removeClass("label-required");				
			datetermination.val("");
			docdatetermination.prop("required", false);		
			$("[data-related-field=docdatetermination]").removeClass("label-required");
			docdatetermination.val("");
			basistermination.closest(".clearfix").find(".dict-display-field").prop("required", false);
            $("[data-related-field=basistermination]").removeClass("label-required");
			basistermination.closest(".clearfix").find(".dict-display-field").val("");
			basisterminationKod.closest(".clearfix").find(".dict-display-field").val("");
			basisterminationKod.val("");
			reasontermination.prop("required", false);
            $("[data-related-field=reasontermination]").removeClass("label-required");
			reasontermination.val("");
			doctermination.closest(".clearfix").find(".dict-display-field").prop("required", false);
            $("[data-related-field=doctermination]").removeClass("label-required");
			doctermination.closest(".clearfix").find(".dict-display-field").val("");			
			docterminationKod.val("");	
			docterminationKod.closest(".clearfix").find(".dict-display-field").val("");			
			docnumtermination.val("");		
			suddatetermination.val("");	
			var rows  =  $("[data-name=Sumdamage] [data-rowkey]");
			rows.each(function(index, element) {
				removeTableRow(element);
			});	
        }
    });   
	Tipdoc.change();
};


// Расторжение договора на редактирование
var Term_edit = function() {    
    var Tipdoc = $("#editView select[name='Tipdoc']");
    var datetermination = $("#editView input[name='datetermination']");
	var basistermination = $("#editView input[name='basistermination']");
	var basisterminationKod = $("#editView input[name='basisterminationKod']");
	var doctermination = $("#editView input[name='doctermination']");
	var docterminationKod = $("#editView input[name='docterminationKod']");
	var docdatetermination = $("#editView input[name='docdatetermination']");    
    var docnumtermination = $("#editView input[name='docnumtermination']");	
    var reasontermination = $("#editView textarea[name='reasontermination']");	
    var realypaid = $("#editView input[name='realypaid']");    
    var suddatetermination = $("#editView input[name='suddatetermination']");	
    var TipIsp= $("input[name='TipIsp']");
	
    Tipdoc.change(function() {
        if ($(this).val() === "Информация о расторжении") {   
            realypaid.prop("required", true);	
            $("[data-related-field=realypaid]").addClass("label-required");			
            datetermination.prop("required", true);
            $("[data-related-field=datetermination]").addClass("label-required");				
			docdatetermination.prop("required", true);	
            $("[data-related-field=docdatetermination]").addClass("label-required");				
			basistermination.closest(".clearfix").find(".dict-display-field").prop("required", true);
            $("[data-related-field=basistermination]").addClass("label-required");				
			reasontermination.prop("required", true);
            $("[data-related-field=reasontermination]").addClass("label-required");							
			doctermination.closest(".clearfix").find(".dict-display-field").prop("required", true);
            $("[data-related-field=doctermination]").addClass("label-required");				
        } else {
        	TipIsp.closest(".clearfix").find(".dict-display-field").prop("required", true);
			TipIsp.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			$("[data-related-field=TipIsp]").addClass("label-required");	


            realypaid.prop("required", false);		
            $("[data-related-field=realypaid]").removeClass("label-required");					
			realypaid.val("");
            datetermination.prop("required", false);
            $("[data-related-field=datetermination]").removeClass("label-required");				
			datetermination.val("");
			docdatetermination.prop("required", false);		
			$("[data-related-field=docdatetermination]").removeClass("label-required");
			docdatetermination.val("");
			basistermination.closest(".clearfix").find(".dict-display-field").prop("required", false);
            $("[data-related-field=basistermination]").removeClass("label-required");
			basistermination.closest(".clearfix").find(".dict-display-field").val("");
			basistermination.val("");
			basisterminationKod.val("");
			reasontermination.prop("required", false);
            $("[data-related-field=reasontermination]").removeClass("label-required");
			reasontermination.val("");
			doctermination.closest(".clearfix").find(".dict-display-field").prop("required", false);
            $("[data-related-field=doctermination]").removeClass("label-required");
			doctermination.closest(".clearfix").find(".dict-display-field").val("");	
			doctermination.val("");			
			docterminationKod.val("");			
			docterminationKod.closest(".clearfix").find(".dict-display-field").val("");		
			docnumtermination.val("");		
			suddatetermination.val("");	
			var rows  =  $("#editView [data-name=Sumdamage] [data-rowkey]");
			rows.each(function(index, element) {
				removeTableRow(element);
			});				
        }
    });   
	Tipdoc.change();
};


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


scopes.onRegister(Term_reg);
scopes.onRegister(EditReg);
scopes.onRegister(BGEndhide);
scopes.onRegister(CloseEtap);


scopes.onEdit(Term_edit);
scopes.onEdit(EditReg);
scopes.onEdit(BGEndhide);
scopes.onEdit(CloseEtap);

scopes.onView(ViewTerm);

