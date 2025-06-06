"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}

 //Скрыть блок Протоколы
var protoView = function() {

    // Бизнес-логика
    // protoElem  - блок "Протоколы", селектор.
   // statusElem - "Статус", селектор
    function logic(protoElem,  statusElem) {

        // Получает либо текст внутри div либо значение input
        function getText(elem) {
            if (elem.prop("value") == undefined) {
                return elem.text();
            } else {
                return elem.val();
            }
        }

     
        var statuses = [
            "Заключение договора",
            "Исполнение договора",
            "Договор расторгнут",
            "Договор исполнен",
            "Заключение договора с ЕП",
            "Опубликовано в ЕИС",
            "Рассмотрение заявок",
            "Переторжка",
            "Определен победитель",
            "Процедура не состоялась",
            "Процедура завершена досрочно",
            "Процедура завершена без выбора победителя",
            "Отменен выбор победителя",
            "Подведение итогов"
        ];

        var status = getText(statusElem);
        var cond3 = $.inArray(status, statuses) == -1;

        if (cond3) {
            protoElem.hide();
        } else {
            protoElem.show();
        }
    }

		var proto = $("li:has(:contains('Протоколы'))").hide();
		var regstatus = $("*.documentView-field-value[data-name='Статус'], input[name='regstatus']");

    logic(proto,  regstatus);
  
};


//Скрыть  блок "Закупка у ЕП"
//на редактирование
var registerZakupkaEPEdit = function() {
    var registerSpZakupPosition = $("#editView input[name='registerSpZakupPosition']");
	var block = $("#editView li:has(:contains('Закупка у ЕП'))");
	
	
    function ScrPol() {
        var registerOsnZakEP = $("#editView input[name='registerOsnZakEP']");
        var registerOsnZakEPName = $("#editView input[name='registerOsnZakEPName']");
		var nameEP = $("#editView input[name='nameEP']");
        var datereshEP = $("#editView input[name='datereshEP']");
		var numreshEP = $("#editView input[name='numreshEP']");

        var SpZakup_Edit = registerSpZakupPosition.val();
        var codes = [
            "ЕП",
			"ЗА ЕП",
			"ЗЗП ЕП",
			"ЗЗЦ ЕП",
			"ЗМК ЕП",
			"ЗОК ЕП",
			"ЗП ООК РС ЕП",
			"ЗЦ ООК РС ЕП",
			"ОА ЕП",
			"ОЗП ЕП",
			"ОЗЦ ЕП",
			"ОМК ЕП",
			"ООК ЕП",
				""
        ];

        if ($.inArray(SpZakup_Edit, codes) != -1) {
           
           block.show();
		   registerOsnZakEP.closest(".clearfix").find(".dict-display-field").prop("required", true);
		   
        } else {
           
            block.hide();
            registerOsnZakEP.val("");
            registerOsnZakEPName.val("");
			nameEP.val("");
            datereshEP.val("");
			numreshEP.val("");
			registerOsnZakEP.closest(".clearfix").find(".dict-display-field").prop("required", false);
			registerOsnZakEP.closest(".clearfix").find(".dict-display-field").val("");
        }
    }

    ScrPol();
    registerSpZakupPosition.change(function() {
        ScrPol();
    });
};

//на регистрацию
var registerZakupkaEPReg = function() {
	
    var registerSpZakupPosition = $("input[name='registerSpZakupPosition']");
	var block = $("li:has(:contains('Закупка у ЕП'))");
    function ScrPol() {
        var registerOsnZakEP = $("input[name='registerOsnZakEP']");
        var registerOsnZakEPName = $("input[name='registerOsnZakEPName']");
		var nameEP = $("input[name='nameEP']");
        var datereshEP = $("input[name='datereshEP']");
		var numreshEP = $("input[name='numreshEP']");
        var SpZakup_Edit = registerSpZakupPosition.val();
        var codes = [
            "ЕП",
			"ЗА ЕП",
			"ЗЗП ЕП",
			"ЗЗЦ ЕП",
			"ЗМК ЕП",
			"ЗОК ЕП",
			"ЗП ООК РС ЕП",
			"ЗЦ ООК РС ЕП",
			"ОА ЕП",
			"ОЗП ЕП",
			"ОЗЦ ЕП",
			"ОМК ЕП",
			"ООК ЕП"
        ];

        if ($.inArray(SpZakup_Edit, codes) != -1) {
            
           block.show();
           registerOsnZakEP.closest(".clearfix").find(".dict-display-field").prop("required", true);
        } else {
            
             block.hide();
           
            registerOsnZakEP.val("");
            registerOsnZakEPName.val("");
			nameEP.val("");
            datereshEP.val("");
			numreshEP.val("");
			registerOsnZakEP.closest(".clearfix").find(".dict-display-field").prop("required", false);
			registerOsnZakEP.closest(".clearfix").find(".dict-display-field").val("");
        }
    }

    ScrPol();
    registerSpZakupPosition.change(function() 
	{
        ScrPol();
    }
	);

    registerSpZakupPosition.change();
};

//на просмотр
var registerZakupkaEPView = function() {
    var SposZak_view = $(".documentView-field-value[data-name='Способ закупки по положению']").text();
    var codes = [
        "ЕП",
		"ЗА ЕП",
		"ЗЗП ЕП",
		"ЗЗЦ ЕП",
		"ЗМК ЕП",
		"ЗОК ЕП",
		"ЗП ООК РС ЕП",
		"ЗЦ ООК РС ЕП",
		"ОА ЕП",
		"ОЗП ЕП",
		"ОЗЦ ЕП",
		"ОМК ЕП",
		"ООК ЕП"
    ];

     var block = $("li:has(:contains('Закупка у ЕП'))");

    if ($.inArray(SposZak_view, codes) != -1) {
        block.show();
    } else {
        block.hide();
    }
};


//Скрыть блок "Изменения"
//на редактирование
var Change=function() {
 var regstatus = $("input[name='regstatus']");
 var Change = $("li:has(:contains('Изменения'))");
 function ScrBlock() {
	   var Status_Edit = regstatus.val();
	  var statuses = [
            "Включено в проект плана закупок",
            "Отклонено",
            "Подготовка лота",
            "Согласование",
            "Согласовано",
			 "Согласовано для вынесения на ЦЗК",
            "Согласовано руководителем инициатора",
			 "Утверждено ЦЗК"
        ];
		if (($.inArray(Status_Edit, statuses) != -1)) {
            Change.hide();
        } else {
            Change.show();
        }
	}
 ScrBlock();
	 regstatus.change(function() {
        ScrBlock();
    });
}
//на просмотр

var Change_View = function() {
    
    var Status_view = $(".documentView-field-value[data-name='Статус']").text();
     var ChangeView = $("li:has(:contains('Изменения'))");
   
    var  ChangeStatuses = [
         "Включено в проект плана закупок",
            "Отклонено",
            "Подготовка лота",
            "Согласование",
            "Согласовано",
			 "Согласовано для вынесения на ЦЗК",
            "Согласовано руководителем инициатора",
			 "Утверждено ЦЗК"
    ];
    if ( ($.inArray(Status_view, ChangeStatuses) != -1)) {
        ChangeView.hide();
    } else {
        ChangeView.show();
    }
}

	
// Функция перечесления возможных значений для скрытия блоков на редактирование
var hideEditBlocksEdit = function() {

    var registerSpZakupPosition = $("input[name='registerSpZakupPosition']");
    var regstatus = $("input[name='regstatus']");    

    function ScrBlock() {
        var SpZakup_Edit = registerSpZakupPosition.val();
        var Status_Edit = regstatus.val();
		
		//Скрытие блока Победитель
		var winner = $("li:has(:contains('Победитель'))");			
        var wincodes = [
            "ЕП",
            "МЗ",
            "ПЗ"
        ];
   
        var winstatuses = [
            "Заключение договора",
            "Исполнение договора",
            "Договор расторгнут",
            "Договор исполнен",
            "Определен победитель"
        ];

        if (($.inArray(SpZakup_Edit, wincodes) != -1) ||
            ($.inArray(Status_Edit, winstatuses) != -1)) {
            winner.show();
        } else {
            winner.hide();
        }		
		
		//Скрыть блок "Итоги закупки"
		var itog = $("li:has(:contains('Итоги закупки'))");		
		var itogCodes = [
			"ЕП",
			"МЗ",
			"ПЗ"
		];		
		var itogStatuses = [
		"Вскрытие конвертов",
		"Договор исполнен",		
        "Договор расторгнут",        
		"Исполнение договора",
        "Определен победитель",
		"Заключение договора",
		"Заключение договора с ЕП",
		"Опубликовано в ЕИС",
		"Отказ от размещения",
		"Отменен выбор победителя",
		"Переторжка",
		"Подведение итогов",
		"Процедура завершена без выбора победителя",
		"Процедура завершена досрочно",
		"Процедура не состоялась",
		"Рассмотрение заявок"
        ];
		if (($.inArray(SpZakup_Edit, itogCodes) == -1) &&
			($.inArray(Status_Edit, itogStatuses) != -1) )   {
			itog.show();
		} else {
			itog.hide();
		}
    }

    //Скрытие блоков
    ScrBlock();

    registerSpZakupPosition.change(function() {
        ScrBlock();
    });

    registerSpZakupPosition.change();

    regstatus.change(function() {
        ScrBlock();
    });

    regstatus.change();
};

// Функция перечесления возможных значений для скрытия блоков на просмотр  
var hideViewBlocksView = function() {
    var SposZak_view = $(".documentView-field-value[data-name='Способ закупки по положению']").text();
    var Status_view = $(".documentView-field-value[data-name='Статус']").text();

    // Победитель
    var winner = $("li:has(:contains('Победитель'))");
    var winnerCodes = [
        "ЕП",
        "МЗ",
        "ПЗ"
    ];
    var winnerStatuses = [
        "Заключение договора",
        "Исполнение договора",
        "Договор расторгнут",
        "Договор исполнен",
        "Определен победитель"
    ];
    if (($.inArray(SposZak_view, winnerCodes) != -1) ||
        ($.inArray(Status_view, winnerStatuses) != -1)) {
        winner.show();
    } else {
        winner.hide();
    }

    // Заявки участников
    var application = $("li:has(:contains('Заявки участников'))");
    var applicationCodes = [
        "ЕП",
        "МЗ",
        "ПЗ"
    ];
    var applicationStatuses = [
		"Вскрытие конвертов",
		"Договор исполнен",		
        "Договор расторгнут",
		"Заключение договора",
		"Заключение договора с ЕП",
		"Исполнение договора",
        "Определен победитель",
		"Опубликовано в ЕИС",
		"Отказ от размещения",
		"Отменен выбор победителя",
		"Переторжка",
		"Подведение итогов",
		"Процедура завершена без выбора победителя",
		"Процедура завершена досрочно",
		"Процедура не состоялась",
		"Рассмотрение заявок"
    ];

    if (($.inArray(SposZak_view, applicationCodes) == -1) &&
        ($.inArray(Status_view, applicationStatuses) != -1)) {
        application.show();
    } else {
        application.hide();
    }

    // Протоколы	
    var protocol = $("li:has(:contains('Протоколы'))");
    var protocolStatuses = [
		"Вскрытие конвертов",
		"Договор исполнен",		
        "Договор расторгнут",
		"Заключение договора",
		"Заключение договора с ЕП",
		"Исполнение договора",
        "Определен победитель",
		"Опубликовано в ЕИС",
		"Отказ от размещения",
		"Отменен выбор победителя",
		"Переторжка",
		"Подведение итогов",
		"Процедура завершена без выбора победителя",
		"Процедура завершена досрочно",
		"Процедура не состоялась",
		"Рассмотрение заявок"
    ];

    if ($.inArray(Status_view, protocolStatuses) != -1) {
        protocol.show();
    } else {
        protocol.hide();
    }
    
    //"Договоры"	 	
    var contract = $("li:has(:contains('Договоры'))");
    var contractCodes = [
        "ЕП",
        "МЗ",
        "ПЗ"
    ];
    var contractStatuses = [
        "Заключение договора",
        "Исполнение договора",
        "Договор расторгнут",
        "Договор исполнен",
        "Определен победитель"
    ];

    if (($.inArray(SposZak_view, contractCodes) != -1) ||
        ($.inArray(Status_view, contractStatuses) != -1)) {
        contract.show();
    } else {
        contract.hide();
    }
	
	//"Переторжки"		
    var per = $("li:has(:contains('Переторжки'))");
    var perCodes = [
        "ЕП",
        "МЗ",
        "ПЗ"
    ];
    var perStatuses = [
        "Заключение договора",
        "Исполнение договора",
        "Договор расторгнут",
        "Договор исполнен",
        "Определен победитель",
		"Заключение договора с ЕП",
		"Опубликовано в ЕИС",
		"Отказ от размещения",
		"Отменен выбор победителя",
		"Переторжка",
		"Подведение итогов",
		"Процедура завершена без выбора победителя",
		"Процедура завершена досрочно",
		"Процедура не состоялась"
		
    ];
    
    if (($.inArray(SposZak_view, perCodes) == -1) &&
        ($.inArray(Status_view, perStatuses) != -1) )   {
        per.show();
    } else {
        per.hide();
    }
	
	//"Запросы на разъяснение"		
    var zapr = $("li:has(:contains('Запросы на разъяснение'))");
    var zaprCodes = [
        "ЕП",
        "МЗ",
        "ПЗ"
    ];
    var zaprStatuses = [
		"Вскрытие конвертов",
        "Заключение договора",
        "Исполнение договора",
        "Договор расторгнут",
        "Договор исполнен",
        "Определен победитель",
		"Заключение договора с ЕП",
		"Опубликовано в ЕИС",
		"Отказ от размещения",
		"Отменен выбор победителя",
		"Переторжка",
		"Подведение итогов",
		"Процедура завершена без выбора победителя",
		"Процедура завершена досрочно",
		"Процедура не состоялась",
		"Рассмотрение заявок"
    ];
    
    if (($.inArray(SposZak_view, zaprCodes) == -1) &&
        ($.inArray(Status_view, zaprStatuses) != -1) )   {
        zapr.show();
    } else {
        zapr.hide();
    }
	
	//"Итоги закупки"		
    var itog = $("li:has(:contains('Итоги закупки'))");
    var itogCodes = [
        "ЕП",
        "МЗ",
        "ПЗ"
    ];
    var itogStatuses = [
		"Вскрытие конвертов",
		"Договор исполнен",		
        "Договор расторгнут",        
		"Исполнение договора",
        "Определен победитель",
		"Заключение договора",
		"Заключение договора с ЕП",
		"Опубликовано в ЕИС",
		"Отказ от размещения",
		"Отменен выбор победителя",
		"Переторжка",
		"Подведение итогов",
		"Процедура завершена без выбора победителя",
		"Процедура завершена досрочно",
		"Процедура не состоялась",
		"Рассмотрение заявок"
    ];
    
    if (($.inArray(SposZak_view, itogCodes) == -1) &&
        ($.inArray(Status_view, itogStatuses) != -1) )   {
        itog.show();
    } else {
        itog.hide();
    }
};

// Краткое содержание, редактирование
var summary = function() {

    var ktatkoe = $("input[name='ktatkoe']");
    var registerNaimLot = $("textarea[name='registerNaimLot']");
    var registerSpZakupPosition = $("input[name='registerSpZakupPosition']");
    var registerDateRazm = $("input[name='registerDateRazm']");
    var registerNMCS = $("input[name='registerNMCS']");

    function rebuildField() {
        var result = [];

        if (registerNaimLot.val()) {
            result.push("Лот: " + registerNaimLot.val().trim());
        }

        if (registerSpZakupPosition.val()) {
            result.push("Способ закупки по положению: " + registerSpZakupPosition.val().trim());
        }

        if (registerDateRazm.val()) {
            result.push("Плановая дата размещения: " + registerDateRazm.val().trim());
        }

        if (registerNMCS.val()) {
            result.push("НМЦ: " + registerNMCS.val().trim());
        }

        ktatkoe.val(result.join(", "));
    }

    rebuildField();

    registerNaimLot.change(function() {
        rebuildField();
    });

    registerSpZakupPosition.change(function() {
        rebuildField();
    });

    registerDateRazm.change(function() {
        rebuildField();
    });

    registerNMCS.change(function() {
        rebuildField();
    });
};


// год закупки и год потребности на регистрации 
var PlDateZD_reg = function() {
    // Плановая дата заключения договора 
    $("input[name='registerPlDateZD']").change(function() {
        var val = $(this).val();
        var date = moment(val, "DD.MM.YYYY");
		var godzak = $("input[name='godzak']")		
        $("input[name='datepodTZ']").val(date.clone().subtract(30, "days").format("DD.MM.YYYY"));
        $("input[name='dateotprTZ']").val(date.clone().subtract(10, "days").format("DD.MM.YYYY"));
        godzak.val(date.year()); 
		$("input[name='godpotr']").val(godzak.val());
    });
};

// год закупки на редактировании
var PlDateZD_edit = function() {
    // Плановая дата заключения договора 
    $("#editView input[name='registerPlDateZD']").change(function() {
        var val = $(this).val();
        var date = moment(val, "DD.MM.YYYY");
		var godzak = $("#editView input[name='godzak']")		
        $("#editView input[name='datepodTZ']").val(date.clone().subtract(30, "days").format("DD.MM.YYYY"));
        $("#editView input[name='dateotprTZ']").val(date.clone().subtract(10, "days").format("DD.MM.YYYY"));
        godzak.val(date.year()); 		
    });
};


/* Временно убрать(Наташа)
//на просмотр
var PlDatePIView = function() {
    var datepl = $("div[data-name='Плановая дата размещения'] div[data-name='Плановая дата размещения']").text();
	var yearzak = $("div[data-name='Год закупки']");
    if ( datepl == "" || datepl == " ") {
			yearzak.show();
        } else {
			yearzak.hide();
        }
};
*/

//Флаг "Не требует корректировки"
//на просмотр
var registerKorrView = function() {
    var regstatus = $("div[data-name='Статус']").text();
    var flag = $("div[data-name='Не требует корректировки']");
   
    function ScrBlock() {
	   
	  var statuses = [
            "Необходима корректировка ЦЗК",
            "Подготовка документации"
        ];
		if (($.inArray(regstatus, statuses) != -1)) {
            flag.show();
        } else {
            flag.hide();
        }
	}
 ScrBlock();
};

// на редактирование
var registerKorrEdit = function() {

    var regstatus = $("#editView input[name='regstatus']");
    var flag = $("#editView input[name='registerKorr']");
   	
	 function ScrBlock() {
	   var Status_Edit = regstatus.val();
	  var statuses = [
            "Необходима корректировка ЦЗК",
            "Подготовка документации"
        ];
		if (($.inArray(Status_Edit, statuses) != -1)) {
            flag.show();
        } else {
           flag.closest(".clearfix").hide();
		   flag.removeAttr('checked');
        }
	}
 ScrBlock();
	
};

// на регистрацию
var registerKorrReg = function() {

    var regstatus = $("input[name='regstatus']");
    var flag = $("input[name='registerKorr']");
   	
	 function ScrBlock() {
	   var Status_Edit = regstatus.val();
	  var statuses = [
            "Необходима корректировка ЦЗК",
            "Подготовка документации"
        ];
		if (($.inArray(Status_Edit, statuses) != -1)) {
           flag.show();
        } else {
           flag.closest(".clearfix").hide();
		   flag.removeAttr('checked');
        }
	}
 ScrBlock();
	 regstatus.change(function() {
        ScrBlock();
    });
	
	
};


//Флаг "Закупка не учитывается" 
//скрытие поля Категория закупки

var KatZakReg = function() {
	 var flag = $("input[name='registerZakNoUch']");
	 var KatZakKod=$("input[name='registerKZ']");
	 var KatZakName=$("input[name='registerKZName']");
	 flag.change(function() {
        if ($(this).is(":checked")) {		
			KatZakKod.closest(".column-container").show();		
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", true);
		}
		else
		{   
		    KatZakKod.val("");
			KatZakName.val("");			
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			KatZakKod.closest(".column-container").hide();
			KatZakKod.closest(".clearfix").find(".dict-display-field").val("");
		}
	
});
	 flag.change ();
}	
	
//на редактирование	
	
	var KatZakEdit = function() {
	 var flag = $("#editView input[name='registerZakNoUch']");
	 var KatZakKod=$("#editView input[name='registerKZ']");
	 var KatZakName=$("#editView input[name='registerKZName']");
	 flag.change(function() {
        if (!$(this).is(":checked")) {
			KatZakKod.closest(".column-container").hide();
			KatZakKod.val("");
			KatZakName.val("");			
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", false);
			KatZakKod.closest(".clearfix").find(".dict-display-field").val("");
		}
		else
		{
			KatZakKod.closest(".column-container").show();					
			KatZakKod.closest(".clearfix").find(".dict-display-field").prop("required", true);			
		}
	
});
	flag.change ();
}

//на просмотр

var KatZakView = function() {
    var KatZak = $("div[data-name='Категория закупки, которая не учитывается при расчёте совокупного годового стоимостного объёма договоров']");
    var flag = $("div[data-name='Закупка не учитывается при расчёте совокупного годового стоимостного объёма договоров']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        KatZak.show();
    } else {
        KatZak.hide();		
    }
};


//Флаг Инвестиционная программа
//блок Данные ИПР на регистрацию


var DataIPR = function() {
	
 var flag = $("input[name='investprogt']");
 var DataIPR= $("li:has(:contains('Данные из ИПР'))"); 
  
 flag.change(function() {
		var rows  =  $("[data-name=IPRTab] [data-rowkey]");
        if ($(this).is(":checked"))
			{
		DataIPR.show();
			}
		else {
			DataIPR.hide();			
			var rows  =  $("#editView [data-name=IPRTab] [data-rowkey]");
			rows.each(function(index, element) {
                 removeTableRow(element);
            });	
		}
});
	flag.change ();
}

//блок Данные ИПР на редактирование

var DataIPR_Edit = function() {
	
 var flag = $("#editView input[name='investprogt']");
 var DataIPR= $("li:has(:contains('Данные из ИПР'))"); 
  
 flag.change(function() {
        if ($(this).is(":checked"))
			{
				DataIPR.show();		
			}
		else {
			DataIPR.hide();			
			var rows  =  $("#editView [data-name=IPRTab] [data-rowkey]");
			rows.each(function(index, element) {
                 removeTableRow(element);
            });		
			
		}
});
	flag.change ();
}

//блок Данные ИПР на просмотр

var DataIPR_View = function() {
var flag = $("div[data-name='Инвестиционная программа']").find("input[type='checkbox']");
 var DataIPR= $("li:has(:contains('Данные из ИПР'))");
 if (!$(flag).attr("checked")) {
        DataIPR.hide();
    } else {
        DataIPR.show();
    }
}


//Размер беспечение заявки
//на просмотр

var RazmOb_View= function() {
	var flag = $("div[data-name='Обеспечение заявки']").find("input[type='checkbox']");
	 var RazmOb = $("div[data-name='Размер обеспечения заявки']");
	  if (!$(flag).attr("checked")) {
        RazmOb.hide();
		
    } else {
        RazmOb.show();
    }
}

//на регистрацию
var RazmObReg = function() {
	 var flag = $("input[name='registerObZa']");
	 var RazmOb=$("input[name='registerRazmOb']");
	 
	 flag.change(function() {
        if ($(this).is(":checked")) {
		
			RazmOb.closest(".column-container").show();
			RazmOb.prop("required", true);
		}
		else
		{
			RazmOb.closest(".column-container").hide();
			RazmOb.prop("required", false);
			RazmOb.val("");
			
		}
	
});
	 flag.change ();
}	

//на редактирование
var RazmObEdit = function() {
	 var flag = $("#editView input[name='registerObZa']");
	 var RazmOb=$("#editView input[name='registerRazmOb']");
	 
	 flag.change(function() {
        if ($(this).is(":checked")) {
		
			RazmOb.closest(".column-container").show();
			RazmOb.prop("required", true);
		}
		else
		{
			RazmOb.closest(".column-container").hide();
			RazmOb.val("");
			RazmOb.prop("required", false);
			
		}
	
});
	 flag.change ();
}	

//Размер беспечение договора
//на просмотр

var RazmObDog_View= function() {
	var flag = $("div[data-name='Обеспечение исполнения договора']").find("input[type='checkbox']");
	 var RazmObDog = $("div[data-name='Размер обеспечения договора']");
	  if (!$(flag).attr("checked")) {
        RazmObDog.hide();
		
    } else {
        RazmObDog.show();
    }
}

//на регистрацию
var RazmObDogReg = function() {
	 var flag = $("input[name='registerObDog']");
	 var RazmObDog=$("input[name='registerRazmObDog']");
	 
	 flag.change(function() {
        if ($(this).is(":checked")) {
		
			RazmObDog.closest(".column-container").show();
			RazmObDog.prop("required", true);
		}
		else
		{
			RazmObDog.closest(".column-container").hide();
			RazmObDog.val("");
			RazmObDog.prop("required", false);
		}
	});
	 flag.change ();
}	

//на редактирование
var RazmObDogEdit = function() {
	 var flag = $("#editView input[name='registerObDog']");
	 var RazmObDog=$("#editView input[name='registerRazmObDog']");
	 
	 flag.change(function() {
        if ($(this).is(":checked")) {
		
			RazmObDog.closest(".column-container").show();
			RazmObDog.prop("required", true);
		}
		else
		{
			RazmObDog.closest(".column-container").hide();
			RazmObDog.val("");
			RazmObDog.prop("required", false);
		}
	
});
 flag.change ();
}	

//Размер беспечение  возврата аванса
//на просмотр

var RazmObVozv_View= function() {
	var flag = $("div[data-name='Обеспечение возврата аванса']").find("input[type='checkbox']");
	 var RazmObVozv = $("div[data-name='Размер обеспечения возврата аванса']");
	 var VozvAv = $("div[data-name='Предоставление обеспечения возврата аванса']");
	  if (!$(flag).attr("checked")) {
        RazmObVozv.hide();
		VozvAv.hide();
		
    } else {
        RazmObVozv.show();
		 VozvAv.show();
    }
}

//на регистрацию
var RazmObVozvReg = function() {
	 var flag = $("input[name='registerObVozv']");
	 var RazmObVozv=$("input[name='registerRazmObVozv']");
	  var VozvAv=$("input[name='registerVozvAv']");
	 
	 flag.change(function() {
        if ($(this).is(":checked")) {
		
			RazmObVozv.closest(".clearfix").show();						
			RazmObVozv.prop("required", true);
			VozvAv.closest(".clearfix").show();
			VozvAv.closest(".clearfix").find(".dict-display-field").prop("required", true);
		}
		else
		{
			RazmObVozv.closest(".clearfix").hide();			
			RazmObVozv.val("");
			RazmObVozv.prop("required", false);
			VozvAv.closest(".clearfix").hide();
			VozvAv.val("");			
			VozvAv.closest(".clearfix").find(".dict-display-field").prop("required", false);
			VozvAv.closest(".clearfix").find(".dict-display-field").val("");	
		}
	});
	 flag.change ();
}	

//на редактирование
var RazmObVozvEdit = function() {
	 var flag = $("#editView input[name='registerObVozv']");
	 var RazmObVozv=$("#editView input[name='registerRazmObVozv']");
	 var VozvAv=$("#editView input[name='registerVozvAv']");
	 flag.change(function() {
        if ($(this).is(":checked")) {
		
			RazmObVozv.closest(".clearfix").show();
			RazmObVozv.prop("required", true);			
			VozvAv.closest(".clearfix").show();
			VozvAv.closest(".clearfix").find(".dict-display-field").prop("required", true);
		}
		else
		{
			RazmObVozv.closest(".clearfix").hide();			
			RazmObVozv.val("");
			RazmObVozv.prop("required", false);
			VozvAv.closest(".clearfix").hide();
			VozvAv.closest(".clearfix").find(".dict-display-field").prop("required", false);
			VozvAv.closest(".clearfix").find(".dict-display-field").val("");	
			VozvAv.val("");
		
		}
	
});
flag.change ();
}	


//Закупка в электронной форме на регистрацию
var registerZakElForm_reg = function() {

    var registerZakElForm = $("input[name='registerZakElForm']");
    var naimETP = $("input[name='naimETP']");
	var naimETPName = $("input[name='naimETPName']");
	var ID_ETP = $("input[name='ID_ETP']");

    registerZakElForm.change(function() {
        if ($(this).is(":checked")) {
			naimETP.closest(".column-container").show();
			naimETPName.closest(".column-container").show();
		    naimETP.show();
            naimETP.closest(".clearfix").find(".dict-display-field").prop("required", true);
        } else {
			naimETP.closest(".column-container").hide();
			naimETPName.closest(".column-container").hide();
            naimETP.val("");
			naimETPName.val("");
			ID_ETP.val("");
            naimETP.closest(".clearfix").find(".dict-display-field").prop("required", false);
			naimETP.closest(".clearfix").find(".dict-display-field").val("");
        }
    });
    registerZakElForm.change();
	
};

// Закупка в электронной форме на редактирование
var registerZakElForm_edit = function() {

    var registerZakElForm = $("#editView input[name='registerZakElForm']");
    var naimETP = $("#editView input[name='naimETP']");
	var naimETPName = $("#editView input[name='naimETPName']");
	var ID_ETP = $("#editView input[name='ID_ETP']");

   registerZakElForm.change(function() {
        if ($(this).is(":checked")) {
			naimETP.closest(".column-container").show();
			naimETPName.closest(".column-container").show();
		    naimETP.show();
            naimETP.closest(".clearfix").find(".dict-display-field").prop("required", true);
        } else {
			naimETP.closest(".column-container").hide();
			naimETPName.closest(".column-container").hide();
            naimETP.val("");
			naimETPName.val("");
			ID_ETP.val("");
            naimETP.closest(".clearfix").find(".dict-display-field").prop("required", false);
			naimETP.closest(".clearfix").find(".dict-display-field").val("");
        }
    });
    registerZakElForm.change();         
};
 
//Закупка в электронной форме на просмотр
var registerZakElForm_View= function() {
	var registerZakElForm = $("div[data-name='Закупка в электронной форме']").find("input[type='checkbox']");
	 var naimETP = $("div[data-name='Наименование ЭТП']");
	 var naimETPName = $("div[data-name='Адрес ЭТП']");
	  if (!$(registerZakElForm).attr("checked")) {	  	
        naimETP.hide();
		naimETPName.hide();
		
    } else {
        naimETP.show();
		naimETPName.show();
    }
} 


//скрыть поле Количество этапов, если Количество этапов = "" или Количество этапов = 0
// на просмотр
var CountEtap_View= function() {		 
	 var Count = $("div[data-name='Количество этапов'] div[data-name='Количество этапов']").text();
	 var CountEtap = $("div[data-name='Количество этапов']");	 
	  if ( Count ==" "|| Count == "" || Count == "0"  ) {	    
        CountEtap.hide();		
    } else {
        CountEtap.show();
    }
}

// Победитель нерезидент на регистрация
var registerWinNerez_reg = function() {

    var registerWinNerez = $("input[name='registerWinNerez']");
    var registerWinIdentNum = $("input[name='registerWinIdentNum']");
	var registerWinIdentNumAd = $("input[name='registerWinIdentNumAd']");

    registerWinNerez.change(function() {
        if ($(this).is(":checked")) {
			registerWinIdentNumAd.prop("required", true);
            registerWinIdentNum.prop("required", true);
        } else {
			registerWinIdentNumAd.prop("required", false);
            registerWinIdentNum.prop("required", false);
        }
		
    });
    registerWinNerez.change();           
};

// Победитель нерезидент на редактирование
var registerWinNerez_edit = function() {

    var registerWinNerez = $("#editView input[name='registerWinNerez']");
    var registerWinIdentNum = $("#editView input[name='registerWinIdentNum']");
	var registerWinIdentNumAd = $("#editView input[name='registerWinIdentNumAd']");

    registerWinNerez.change(function() {
        if ($(this).is(":checked")) {
			registerWinIdentNumAd.prop("required", true);
            registerWinIdentNum.prop("required", true);
        } else {
			registerWinIdentNumAd.prop("required", false);
            registerWinIdentNum.prop("required", false);
        }
		
    });
    registerWinNerez.change();           
};


// Если Способ закупки положение = ЕП, заполнять Фактический способ закупки положение = ЕП. Регистрация
var registerSpZakupPosition_reg = function() {

    var registerSpZakupFactual = $("input[name='registerSpZakupFactual']");
    var registerSpZakupPosition = $("input[name='registerSpZakupPosition']");	

    registerSpZakupPosition.change(function() {
        if ($(this).val() == "ЕП") {
			registerSpZakupFactual.val("ЕП");			
        } else {
			registerSpZakupFactual.val("");
        }		
    });
    registerSpZakupPosition.change();           
};
  
// Редактирование
var registerSpZakupPosition_edit = function() {

    var registerSpZakupFactual = $("#editView input[name='registerSpZakupFactual']");
    var registerSpZakupPosition = $("#editView input[name='registerSpZakupPosition']");	

    registerSpZakupPosition.change(function() {
        if ($(this).val() == "ЕП") {
			registerSpZakupFactual.val("ЕП");			
        } else {
			registerSpZakupFactual.val("");
        }		
    });
    registerSpZakupPosition.change();           
};



// Добавить поля со ссылками на документы в таблицу АСУД на регистрации и редактировании

// добавление новой строки
var AsudTabAdd = function() {

$("div[data-name='AsudTab'] .table-add-row-button").click(function () {
    AsudTabLink();
}); 


};

var AsudTabLink = function () {
 
var table = $("div[data-name='AsudTab']");
getInputs(table, /AsudTab-Asud_Id-\d+/).each(function (index) {

    var item = $(this);
    $(this).change(function() {
        var input = $(this);
        var inputName = item.attr('name');
        var rowkey = inputName.substring(inputName.lastIndexOf('-') + 1, inputName.lenght);
        
        var Asud_Id = "div[data-name='AsudTab'] input[name=AsudTab-Asud_Id-" + rowkey + "]";
        var Asud_link = "div[data-name='AsudTab'] input[name=AsudTab-Asud_link-" + rowkey + "]";
        
		$(Asud_link).val( "http://asud.rosseti.ru/asud_hmrsk/drl.html?objectId=" + $(Asud_Id).val() )
	})
})

function getInputs(table, pattern) {
    return table.find('input').filter(function (index) {
        var name = $(this).attr("name");
        return pattern.test(name);
		
    });
}
};

//Расширенный план на просмотр
var Advanced_plan_View = function() {
	var Advanced_plan = $("div[data-name='Расширенный план']").find("input[type='checkbox']");
	var tab = $("li[data-tabname='Лоты расширенного плана']");
	 
	  if (!$(Advanced_plan).attr("checked")) {	  	
        tab.children("a")[0].innerHTML = "Лоты расширенного плана";
    } else {
		tab.children("a")[0].innerHTML = "Лоты из ЕИС";
    }
} 

scopes.onView(Advanced_plan_View);
scopes.onView(RazmObVozv_View);
scopes.onView(RazmObDog_View);
scopes.onView(RazmOb_View);
scopes.onView(DataIPR_View);
scopes.onView(KatZakView);
scopes.onView(Change_View);
scopes.onView(registerKorrView);
scopes.onView(registerZakupkaEPView);
scopes.onView(hideViewBlocksView);
scopes.onView(protoView);
scopes.onView(registerZakElForm_View);
scopes.onView(CountEtap_View);
//scopes.onView(PlDatePIView);

scopes.onRegister(DataIPR);
scopes.onRegister(EditReg);
scopes.onRegister(RazmObVozvReg);
scopes.onRegister(RazmObDogReg);
scopes.onRegister(RazmObReg);
scopes.onRegister(KatZakReg);
scopes.onRegister(registerZakupkaEPReg);
scopes.onRegister(hideEditBlocksEdit);
scopes.onRegister(summary);
scopes.onRegister(protoView);
scopes.onRegister(Change);
scopes.onRegister(registerKorrReg);
scopes.onRegister(registerZakElForm_reg);
scopes.onRegister(registerWinNerez_reg);
scopes.onRegister(registerSpZakupPosition_reg);
scopes.onRegister(AsudTabAdd); 
scopes.onRegister(AsudTabLink); 
scopes.onRegister(PlDateZD_reg); 


scopes.onEdit(RazmObVozvEdit);
scopes.onEdit(EditReg);
scopes.onEdit(RazmObDogEdit);
scopes.onEdit(RazmObEdit);
scopes.onEdit(DataIPR_Edit);
scopes.onEdit(KatZakEdit);
scopes.onEdit(registerKorrEdit);
scopes.onEdit(registerZakupkaEPEdit);
scopes.onEdit(hideEditBlocksEdit);
scopes.onEdit(summary);
scopes.onEdit(PlDateZD_edit);
scopes.onEdit(Change);
scopes.onEdit(registerZakElForm_edit);
scopes.onEdit(registerWinNerez_edit); 
scopes.onEdit(registerSpZakupPosition_edit); 
scopes.onEdit(AsudTabAdd); 
scopes.onEdit(AsudTabLink); 