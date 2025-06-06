"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}
var summary = function() {
	
	var ktatkoe = $("input[name='ktatkoe']");
	var namePlZak = $("input[name='Name_pl_zak']");
	
	var god = $("input[name='god']");
	var innprod = $("input[name='innprod']");
	var name = $("input[name='registerOrgZaName']");
	var godokon = $("input[name='godokon']");
	
	var resultString = function() {
		var innovative = false;
		
		if (innprod.attr('checked')) {
			innovative = true;
		}
		
		var result = "План закупок";
		
		if (innovative) {
			result += " инновационной продукции";
		}
		
		result += " организации " + name.val().trim() + " на " + god.val().trim();
		
		if (innovative) {
			result += " - " + godokon.val().trim() +  ' гг.';
		}
		else {
			result += " г.";
		}
		
		return result;
	};
	
	ktatkoe.val(resultString());
	// Наименование плана закупок  = Краткое содержание
	namePlZak.val(ktatkoe.val());
	
	innprod.change(function() {
	    ktatkoe.val(resultString());
		namePlZak.val(ktatkoe.val());
	});
	
	name.change(function() {
	    ktatkoe.val(resultString());
		namePlZak.val(ktatkoe.val());
	});
	
	god.change(function() {
	    ktatkoe.val(resultString());
		namePlZak.val(ktatkoe.val());
	});
	
	godokon.change(function() {
	    ktatkoe.val(resultString());
		namePlZak.val(ktatkoe.val());
	});	
};


//"Изменен раздел СМП" = 1, если Объем закупок СМП != Объем закупок СМП предыдущей версии

 //На состояние 19.04.2017 не работает, нужно уточнить требования.
var CMP_reg = function() {
	
	var regnum = $("input[name='num_red']");
	var volume = $(" input[name='Sum_Lot_SMP']");
	var lastvolume = $(" input[name='Sum_Lot_SMP_Last']");
	var check = $(" input[name='CMP']");
    
	if (regnum.val() == 1 || regnum.val() == "") {
		check.val(1);
		return;
	}

	// В поле ожидается либо стандартный float 123.12 либо формат с разделителями 12 345,12
	// Надо привести все к штатному виду
	var flVolume = volume.val().replace(/ /g, '').replace(/,/g, '.');
	var flLastVolume = lastvolume.val().replace(/ /g, '').replace(/,/g, '.');
	
	if (flVolume != flLastVolume) {
		check.val(1);
	}
};

//"Расширенный_план" = 1 на просмотр 
var ExtendedView = function() {
    var Sum_Lot = $("div[data-name='Объем закупок']");
	var Sum_Lot_SMP = $("div[data-name='Объем закупок СМП']");
	var Col_Lot = $("div[data-name='Количество лотов']");
	var Sum_Lot_Iskl = $("div[data-name='Объем закупок, исключенных при расчете']");
    var flag = $("div[data-name='Расширенный план']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        Sum_Lot.hide();	
        Sum_Lot_SMP.hide();
		Col_Lot.hide();
        Sum_Lot_Iskl.hide();			
    } else {
        Sum_Lot.show();
        Sum_Lot_SMP.show();
		Col_Lot.show();
        Sum_Lot_Iskl.show();		
    }
};

scopes.onView(ExtendedView);

scopes.onRegisterTemp(EditReg);
scopes.onRegisterTemp(summary);
scopes.onRegisterTemp(CMP_reg);

scopes.onEditTemp(summary);
scopes.onEditTemp(EditReg);