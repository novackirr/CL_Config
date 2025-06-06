"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}

 //Скрыть блок Изменения
var ChangeView = function() {

    // Бизнес-логика
    // ChangeElem  - блок "Изменения", селектор.
   // statusElem - "Статус", селектор
    function logic(ChangeElem,  statusElem) {

        // Получает либо текст внутри div либо значение input
        function getText(elem) {
            if (elem.prop("value") == undefined) {
                return elem.text();
            } else {
                return elem.val();
            }
        }
     
        var statuses = [
            "Отправлено в ЕИС",
            "Отправлено на ЭТП",
           "Подготовка извещения",
		   ""
        ];

        var status = getText(statusElem);
        var cond3 = $.inArray(status, statuses) !== -1;
		var obocnizm = $("input[name='obocnizm']");
        if (cond3) {
           ChangeElem.hide();
		   obocnizm.val("");
        } else {
            ChangeElem.show();
        }
    }

		var Change = $("li:has(:contains('Изменения'))").hide();
		var regstatus = $("*.documentView-field-value[data-name='Статус'], input[name='regstatus']");

    logic(Change,  regstatus);
  
};


////////////////////////////////////////////////////////////////////////
/*
 * Отобразить на форме и сделать обязательными поля при выполнении следующих условий:
 * Дата вскрытия конвертов: /Document/Способ_закупки_код != 
 * Дата рассмотрения заявок: /Document/Способ_закупки_код !=
 * Дата рассмотрения вторых частей заявок: /Document/Многоэтапная = "1"
 * Место рассмотрения заявок: /Document/Способ_закупки_код =
 * Место вскрытия конвертов: /Document/Способ_закупки_код = 
 * Место подведения итогов: /Document/Закупка_в_электронной_форме != "1"
 * Место проведения аукциона: /Document/Способ_закупки_код =  И /Document/Закупка_в_электронной_форме != "1"
 */
//////////////////////////////////////////////////////////////////////

// Функция перечесления возможных значений для скрытия блоков на редактирование и регистрацию
var ScrBlockRegEdit = function() {
    function ScrBlock() {
        var SpZakup_Edit = $("input[name='sposzakPosition']").val();
        var Zakup_El_Edit = -1;
        if ($("input[name='zakelform']").attr("checked") == "checked") {
            Zakup_El_Edit = 1;
        }

        // Дата вскрытия конвертов
        var datevskrkonv = $("input[name='datevskrkonv']");

        if (($.inArray(SpZakup_Edit, ["ЕП"]) == -1)) {
            datevskrkonv.closest(".column-container").show();            
            datevskrkonv.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", true)
        } else {
            datevskrkonv.closest(".column-container").hide();            
            datevskrkonv.closest(".documentView-field-value").find(".datetime-edit-control").val("");
            datevskrkonv.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", false);
        }

        // Дата рассмотрения заявок
        var daterassm = $("input[name='daterassm']");

        if (($.inArray(SpZakup_Edit, ["ЕП"]) == -1)) {
            daterassm.closest(".column-container").show();            
            daterassm.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", true);
        } else {
            daterassm.closest(".column-container").hide();            
            daterassm.closest(".documentView-field-value").find(".datetime-edit-control").val("");
            daterassm.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", false);
        }

        // Место рассмотрения заявок mestorasm
        var mestorasm = $("input[name='mestorasm']");
        if (($.inArray(SpZakup_Edit, ["ЕП"]) == -1)) {                      
			mestorasm.closest(".documentView-field-value").prev().show();
			mestorasm.closest(".documentView-field-value").show();  
            mestorasm.prop("required", true);
        } else {            		
			mestorasm.closest(".documentView-field-value").prev().hide();
			mestorasm.closest(".documentView-field-value").hide();
            mestorasm.val("");
            mestorasm.prop("required", false);
        }

        // Дата окончания подачи заявок
        var dateokonpod = $("input[name='dateokonpod']");

        if (($.inArray(SpZakup_Edit, ["ЕП"]) == -1)) {
            dateokonpod.closest(".column-container").show();            
            dateokonpod.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", true);
        } else {
            dateokonpod.closest(".column-container").hide();            
            dateokonpod.closest(".documentView-field-value").find(".datetime-edit-control").val("");
            dateokonpod.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", false);
        }
	   
        // Дата подведения итогов
        var datepoditog = $("input[name='datepoditog']");
        if (($.inArray(SpZakup_Edit, ["ЕП"]) == -1)) {
            datepoditog.closest(".column-container").show();            
            datepoditog.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", true);
        } else {
            datepoditog.closest(".column-container").hide();            
            datepoditog.closest(".documentView-field-value").find(".datetime-edit-control").val("");
            datepoditog.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", false);
        }

        // Дата проведения торгов
        var datetorg = $("input[name='datetorg']");
        if (($.inArray(SpZakup_Edit, ["ЕП"]) == -1)) {
            datetorg.closest(".column-container").show();            
            datetorg.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", true);
        } else {
            datetorg.closest(".column-container").hide();            
            datetorg.closest(".documentView-field-value").find(".datetime-edit-control").val("");
            datetorg.closest(".documentView-field-value").find(".datetime-edit-control").prop("required", false);
        }


    }

    ScrBlock();

    $("input[name='sposzakPosition']").change(function() {
        ScrBlock();
    });

    $("input[name='sposzakPosition']").change();

    $("input[name='zakelform']").change(function() {
        ScrBlock();
    });

    $("input[name='zakelform']").change();
};


// Функция перечесления возможных значений для скрытия блоков на просмотр  
var ScrBlockView = function() {

    var SposZak_view = $(".documentView-field-value[data-name='Способ закупки положение']").text();

    // Дата вскрытия конвертов
    var datevskrkonv = $("div[data-name='Дата вскрытия конвертов']");

    if (($.inArray(SposZak_view, ["ЕП"]) == -1)) {
        datevskrkonv.show();        
    } else {
	    datevskrkonv.hide();      
    }

    // Дата рассмотрения заявок
    var daterassm = $("div[data-name='Дата рассмотрения заявок']");

    if (($.inArray(SposZak_view, ["ЕП"]) == -1)) {
        daterassm.show();
    } else {
        daterassm.hide();
    }

    // Место рассмотрения заявок

    var mestorasm = $("div[data-name='Место рассмотрения заявок']");

    if (($.inArray(SposZak_view, ["ЕП"])== -1)) {
        mestorasm.show();
    } else {
        mestorasm.hide();
    }

    // Дата окончания подачи заявок
	
    var dateokonpod = $("div[data-name='Дата окончания подачи заявок']");

    if (($.inArray(SposZak_view, ["ЕП"]) == -1)) {
        dateokonpod.show();
    } else {
        dateokonpod.hide();
    }
   
    // Дата проведения торгов

    var datetorg = $("div[data-name='Дата проведения торгов']");

    if (($.inArray(SposZak_view, ["ЕП"]) == -1)) {
        datetorg.show();
    } else {
        datetorg.hide();
    }
    // Дата подведения итогов

    var datepoditog = $("div[data-name='Дата подведения итогов']");

    if (($.inArray(SposZak_view, ["ЕП"]) == -1)) {
        datepoditog.show();
    } else {
        datepoditog.hide();
    }
};

//Формирование краткого содержания
var summary = function() {

    var kratkoe = $("input[name='ktatkoe']");

    var nazzak = $("input[name='nazzak']");
    var sposzakPosition = $("input[name='sposzakPosition']");
    var plandaterazm = $("input[name='plandaterazm']");
    var NMC_NDS = $("input[name='NMC_NDS']");

    function rebuildField() {
        var result = [];

        if (nazzak.val()) {
            result.push("Извещение о закупке: " + nazzak.val().trim());
        }

        if (sposzakPosition.val()) {
            result.push("способ закупки положение: " + sposzakPosition.val().trim());
        }

        if (plandaterazm.val()) {
            result.push("плановая дата размещения: " + plandaterazm.val().trim());
        }

        if (NMC_NDS.val()) {
            result.push("НМЦ: " + NMC_NDS.autoNumeric("get"));
        }

        kratkoe.val(result.join(", "));
    }

    rebuildField();

    nazzak.change(function() {
        rebuildField();
    });

    sposzakPosition.change(function() {
        rebuildField();
    });

    plandaterazm.change(function() {
        rebuildField();
    });

    NMC_NDS.change(function() {
        rebuildField();
    });
};

//Кваликационный отбор на промотр
var KvalOtborView = function() {

    var otbor = $("div[data-name='Квалификационный отбор']").find("input[type='checkbox']");
    if (!$(otbor).attr("checked")) {
        $("li:has(:contains('Квалификационный отбор'))").hide();
    }
};

//Квалификационный отбор на регистрацию
var KvalOtbor = function() {

    var kvalotb = $("input[name='kvalotb']");
    var block = $("li:has(:contains('Квалификационный отбор'))");
	var datevskrkonvKO = $("input[name='datevskrkonvKO']");
    var daterasmzayaKO = $("input[name='daterasmzayaKO']");
    var dateokonpodzayaKO = $("input[name='dateokonpodzayaKO']");

    kvalotb.change(function() {
        if ($(this).is(":checked")) {
            block.show();
        } else {
            block.hide();
		datevskrkonvKO.closest(".documentView-field-value").find(".date-field").val("");
        daterasmzayaKO.closest(".documentView-field-value").find(".date-field").val("");
        dateokonpodzayaKO.closest(".documentView-field-value").find(".date-field").val("");
        }
    });
    kvalotb.change();
};

//Квалификационный отбор на редактирование
var KvalOtborEdit = function() {

    var kvalotb = $("#editView input[name='kvalotb']");
    var block = $("#editView li:has(:contains('Квалификационный отбор'))");
    var datevskrkonvKO = $("#editView input[name='datevskrkonvKO']");
    var daterasmzayaKO = $("#editView input[name='daterasmzayaKO']");
    var dateokonpodzayaKO = $("#editView input[name='dateokonpodzayaKO']");	

    kvalotb.change(function() {
        if ($(this).is(":checked")) {
            block.show();
        } else {
            block.hide();
			datevskrkonvKO.closest(".documentView-field-value").find(".date-field").val("");
			daterasmzayaKO.closest(".documentView-field-value").find(".date-field").val("");
			dateokonpodzayaKO.closest(".documentView-field-value").find(".date-field").val("");
        }
    });
    kvalotb.change();

};

//Закупка в электронной форме на регистрацию
var zakelform_reg = function() {

    var zakelform = $("input[name='zakelform']");
    var naimETP = $("input[name='naimETP']");
	var naimETPName = $("input[name='naimETPName']");
	var naimETPID = $("input[name='naimETPID']");
	var formTorg = $("input[name='formTorg']");	
	var formTorgName = $("input[name='formTorg']");	

    zakelform.change(function() {
        if ($(this).is(":checked")) {
            naimETP.closest(".clearfix").find(".dict-display-field").prop("required", true);
			naimETPName.prop("required", true);
			naimETP.closest(".column-container").show();
			naimETPName.closest(".column-container").show();
			formTorg.closest(".column-container").show();	
        } else {
			naimETPName.val("");
			naimETPID.val("");
			naimETP.val("");
			naimETP.closest(".clearfix").find(".dict-display-field").val("");
            naimETP.closest(".clearfix").find(".dict-display-field").prop("required", false);
			naimETPName.prop("required", false);			
			naimETP.closest(".column-container").hide();
			naimETPName.closest(".column-container").hide();
			formTorg.closest(".column-container").hide();
			naimETP.change();
        }
    });
    zakelform.change();
};

// Закупка в электронной форме на редактирование
var zakelform_edit = function() {

    var zakelform = $("#editView input[name='zakelform']");
    var naimETP = $("#editView input[name='naimETP']");
	var naimETPName = $("#editView input[name='naimETPName']");
	var naimETPID = $("#editView input[name='naimETPID']");
	var formTorg = $("#editView input[name='formTorg']");	
	var formTorgName = $("#editView input[name='formTorg']");	

    zakelform.change(function() {
        if ($(this).is(":checked")) {
            naimETP.closest(".column-container").find(".dict-display-field").prop("required", true);
			naimETPName.prop("required", true);
			naimETP.closest(".column-container").show();
			naimETPName.closest(".column-container").show();
			formTorg.closest(".column-container").show();			
        } else {
			naimETPName.val("");
			naimETPID.val("");
			naimETP.val("");
			naimETP.closest(".clearfix").find(".dict-display-field").val("");
            naimETP.closest(".clearfix").find(".dict-display-field").prop("required", false);
			naimETPName.prop("required", false);			
			naimETP.closest(".column-container").hide();
			naimETPName.closest(".column-container").hide();
			formTorg.closest(".column-container").hide();
			naimETP.change();
        }
    });
	zakelform.change();
};

//Закупка в электронной форме на просмотр
var zakelform_View = function() {
    var zakelform = $("div[data-name='Закупка в электронной форме']").find("input[type='checkbox']");
	var naimETP = $("div[data-name='Наименование ЭТП']");
	var naimETPName = $("div[data-name='Адрес ЭТП']");
	var formTorg = $("div[data-name='Форма торгов']");
	
    if (!$(zakelform).attr("checked")) {	
        naimETP.hide();
		naimETPName.hide();
		formTorg.hide();
    } else {
        naimETP.show();
		naimETPName.show();		
		formTorg.show();		
	}
	
};


// Форма торгов обязательное, если Наименование ЭТП заполнено
//на регистрацию
var formTorg_reg = function() {
var naimETP = $("input[name='naimETP']");
var formTorg = $("input[name='formTorg']");
var formTorgName = $("input[name='formTorgName']");
 
 naimETP.change(function() {
        var naimETP = $(this).val();

        if (naimETP === "") {
			formTorg.val("");
			formTorgName.val("");	
			formTorg.closest(".column-container").find(".dict-display-field").val("");			
            formTorg.closest(".column-container").find(".dict-display-field").prop("required", false);
			formTorgName.prop("required", false);			
        } else {	
            formTorg.closest(".column-container").find(".dict-display-field").prop("required", true);
			formTorgName.prop("required", true);		
        }
    });
	naimETP.change();
};

//на редактирование
var formTorg_edit = function() {
var naimETP = $("#editView input[name='naimETP']");
var formTorg = $("#editView input[name='formTorg']");
var formTorgName = $("#editView input[name='formTorgName']");
 
 naimETP.change(function() {
        var naimETP = $(this).val();

        if (naimETP === "") {
			formTorg.val("");
			formTorgName.val("");
			formTorg.closest(".column-container").find(".dict-display-field").val("");	
            formTorg.closest(".column-container").find(".dict-display-field").prop("required", false);
			formTorgName.prop("required", false);
        } else {
            formTorg.closest(".column-container").find(".dict-display-field").prop("required", true);
			formTorgName.prop("required", true);           
        }
    });
	naimETP.change();
};

//Поле "Количество этапов"
//на просмотр
var StepCountView = function() {
    var flag = $("div[data-name='Количество этапов']");
    var val = $("div[data-name='Количество этапов'] div[data-name='Количество этапов']").text();
      	   
	if (val == "0" || val ==" "|| val == "") {
        flag.hide();
    } else {
        flag.show();
    }	
	
};

//Контактное лицо: телефон на регистрации
var Phone_reg = function() {

var FullTel = $("input[name='kontTel']");
var CountryCode = $("input[name='CountryCodeTel']");
var CityCode = $("input[name='CityCodeTel']");
var Tel = $("input[name='Tel']");
var Additional = $("input[name='AdditionalTel']");
 
	function Phone() {  
        var result = [];
		
        if (CountryCode.val()) {
            result.push("+" + CountryCode.val().trim());
							
        }		
        if (CityCode.val()) {
            result.push("(" + CityCode.val().trim() + ")");
        }		
        if (Tel.val()) {
            result.push( Tel.val().trim() );
        }
        if (Additional.val()) {
            result.push(" доб. " + Additional.val().trim());
        }		
		
		FullTel.val(result.join(""));						
    }	
	Phone();
	
    CountryCode.change(function() {
        Phone();
    });	
	CityCode.change(function() {
        Phone();
    });
	Tel.change(function() {
        Phone();
    });
	Additional.change(function() {
        Phone();
    });
	
};

//Контактное лицо: телефон на редактирование
var Phone_edit = function() {

var FullTel = $("#editView input[name='kontTel']");
var CountryCode = $("#editView input[name='CountryCodeTel']");
var CityCode = $("#editView input[name='CityCodeTel']");
var Tel = $("#editView input[name='Tel']");
 
function Phone() {  
        var result = [];
		
        if (CountryCode.val()) {
            result.push(CountryCode.val().trim());
        }		
        if (CityCode.val()) {
            result.push("-" + CityCode.val().trim() + "-");
        }		
        if (Tel.val()) {
            result.push( Tel.val().trim() );
        }		
		
		FullTel.val(result.join(""));		
}
	
	Phone();
	
    CountryCode.change(function() {
        Phone();		
    });	
	CityCode.change(function() {
        Phone();		
    });
	Tel.change(function() {
        Phone();		
    });
	
};

var validateFields = function() {
    var Tel = $("input[name='Tel']");
	var CountryCode = $("input[name='CountryCodeTel']");
	var CityCode = $("input[name='CityCodeTel']");
    var FullTel = $("input[name='kontTel']");
	
    Tel.inputmask({ mask: '99999[9999999999999]', greedy: false });
	Tel.attr("data-parsley-phone", "");
	CountryCode.inputmask({ mask: '[+]9[9999]', greedy: false});
	CityCode.inputmask({ mask: '9[99999]', greedy: false});
	
};

scopes.onRegisterTemp(EditReg);
scopes.onRegisterTemp(ScrBlockRegEdit);
scopes.onRegisterTemp(summary);
scopes.onRegisterTemp(KvalOtbor);
scopes.onRegisterTemp(zakelform_reg);
scopes.onRegisterTemp(ChangeView);
scopes.onRegisterTemp(formTorg_reg);
scopes.onRegisterTemp(Phone_reg);
scopes.onRegisterTemp(validateFields);

scopes.onEditTemp(summary);
scopes.onEditTemp(EditReg);
scopes.onEditTemp(formTorg_edit);
scopes.onEditTemp(ChangeView);
scopes.onEditTemp(ScrBlockRegEdit);
scopes.onEditTemp(KvalOtborEdit);
scopes.onEditTemp(zakelform_edit);
scopes.onEditTemp(Phone_edit);
scopes.onEditTemp(validateFields);

scopes.onViewTemp(KvalOtborView);
scopes.onViewTemp(ChangeView);
scopes.onViewTemp(StepCountView);
scopes.onViewTemp(ScrBlockView);
scopes.onViewTemp(zakelform_View);