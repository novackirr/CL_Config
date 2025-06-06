"use strict";

var editreg = function() {     
	    $("li:has(:contains('Скрытые поля'))").hide();	
}
$(document).ready(function () {
	var count = $("div[data-name='ItemTab'] div[data-rowkey]").length;

	if (count < 1) {
		$("div[data-name='ItemTab'] .table-add-row-button").click();
	};

});
// Краткое содержание
var summary = function() {
	
	var ktatkoe = $("input[name='ktatkoe']");
	var namePlZak = $("input[name='Name_pl_zak']");
	
	var god = $("input[name='god']");
	var innprod = $("input[name='innprod']");
	var name = $("input[name='registerOrgZa']");
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
var hideextendedplanview = function() {
    var Sum_Lot = $("div[data-name='Объем закупок']");
	var Sum_Lot_SMP = $("div[data-name='Объем закупок СМП']");
	var Col_Lot = $("div[data-name='Количество лотов']");
	var Sum_Lot_Iskl = $("div[data-name='Объем закупок, исключенных при расчете']");
    var flag = $("div[data-name='Расширенный план']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        hideViewElementColumn(Sum_Lot);	
        hideViewElementColumn(Sum_Lot_SMP);
		hideViewElementColumn(Col_Lot);
        hideViewElementColumn(Sum_Lot_Iskl);			
    } else {
        showViewElementColumn(Sum_Lot);
        showViewElementColumn(Sum_Lot_SMP);
		showViewElementColumn(Col_Lot);
        showViewElementColumn(Sum_Lot_Iskl);		
    }
};

var Soglas = function () {
        //объявляю переменные
		var trebSogl = $("input[name='trebSogl']");
        var Sogl = $("input[name='Sogl']");
		//по умолчанию скрываю поле "Согласующий"
		Sogl.closest(".column-container").hide();
		$("[data-related-field-name=Sogl]").hide();
	   trebSogl.change(function() {
            if ($(trebSogl).is(":checked")) {
			  Sogl.closest(".column-container").show();
				 $("[data-related-field=Sogl").show(); 
				Sogl.prop("required", true);
		Sogl.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=Sogl]").addClass("label-required");
					
            } else {
			Sogl.val("");
			Sogl.prop("required", false);
		Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=Sogl]").removeClass("label-required");
		
           	 Sogl.closest(".column-container").hide();
				$("[data-related-field=Sogl").hide(); 
			  Sogl.closest(".clearfix").removeClass("label-required");
             				Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			 $("[data-related-field=Sogl]").removeClass("label-required"); 
				  
            }
       });
	trebSogl.change();
}
//Требуется согласование , просмотр
var SoglasovView = function () {
	var Soglasov = $("div[data-name='Согласующий']");
	var flag = $("div[data-name='Требуется согласование']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		Soglasov.show();
		/* $("div[data-name='Требуется согласование']").hide(); */
		
	} else {
		Soglasov.hide();
			
	}
};

var ras = function () {
        //объявляю переменные
		var Rasauto = $("input[name='Rasauto']");
        var SGOZpredyear = $("input[name='SGOZpredyear']");
		var SGOZIPVPpredyear = $("input[name='SGOZIPVPpredyear']");
		var SGOZIPVPMSPpredyear = $("input[name='SGOZIPVPMSPpredyear']");
		//по умолчанию скрываю поле "Согласующий"
		Rasauto.change(function() {
            if ($(Rasauto).is(":checked")) {
				SGOZpredyear.autoNumeric('set','0');
				SGOZpredyear.prop("required", false);
				SGOZpredyear.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
				$("[data-related-field=SGOZpredyear]").removeClass("label-required");
				SGOZpredyear.closest(".column-container").hide();
				$("[data-related-field=SGOZpredyear").hide(); 
				SGOZpredyear.closest(".clearfix").removeClass("label-required");
				SGOZpredyear.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
				$("[data-related-field=SGOZpredyear]").removeClass("label-required"); 
				
				SGOZIPVPpredyear.autoNumeric('set','0');
				SGOZIPVPpredyear.prop("required", false);
				SGOZIPVPpredyear.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
				$("[data-related-field=SGOZIPVPpredyear]").removeClass("label-required");
				SGOZIPVPpredyear.closest(".column-container").hide();
				$("[data-related-field=SGOZIPVPpredyear").hide(); 
				SGOZIPVPpredyear.closest(".clearfix").removeClass("label-required");
				SGOZIPVPpredyear.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
				$("[data-related-field=SGOZIPVPpredyear]").removeClass("label-required");

				SGOZIPVPMSPpredyear.autoNumeric('set','0');
				SGOZIPVPMSPpredyear.prop("required", false);
				SGOZIPVPMSPpredyear.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
				$("[data-related-field=SGOZIPVPMSPpredyear]").removeClass("label-required");
				SGOZIPVPMSPpredyear.closest(".column-container").hide();
				$("[data-related-field=SGOZIPVPMSPpredyear").hide(); 
				SGOZIPVPMSPpredyear.closest(".clearfix").removeClass("label-required");
				SGOZIPVPMSPpredyear.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
				$("[data-related-field=SGOZIPVPMSPpredyear]").removeClass("label-required"); 
            } 
			else {
				SGOZpredyear.closest(".column-container").show();
				$("[data-related-field=SGOZpredyear").show(); 
				SGOZpredyear.prop("required", true);
				SGOZpredyear.closest(".column-container").find(".documentView-field-label").addClass("label-required");
				$("[data-related-field=SGOZpredyear]").addClass("label-required");
				
				SGOZIPVPpredyear.closest(".column-container").show();
				$("[data-related-field=SGOZIPVPpredyear").show(); 
				SGOZIPVPpredyear.prop("required", true);
				SGOZIPVPpredyear.closest(".column-container").find(".documentView-field-label").addClass("label-required");
				$("[data-related-field=SGOZIPVPpredyear]").addClass("label-required");
				
				SGOZIPVPMSPpredyear.closest(".column-container").show();
				$("[data-related-field=SGOZIPVPMSPpredyear").show(); 
				SGOZIPVPMSPpredyear.prop("required", true);
				SGOZIPVPMSPpredyear.closest(".column-container").find(".documentView-field-label").addClass("label-required");
				$("[data-related-field=SGOZIPVPMSPpredyear]").addClass("label-required");
            }
       });
	Rasauto.change();
}

var viewSizeInfo = function () {
	var field1 = $("div[data-name='Совокупный годовой объем договоров, заключенных по результатам закупки товаров, работ, услуг']");
	var field2 = $("div[data-name='Совокупный годовой объем договоров, заключенных по результатам закупки инновационной продукции, высокотехнологичной продукции']");
	var field3 = $("div[data-name='Совокупный годовой объем договоров, заключенных по результатам закупки инновационной продукции, высокотехнологичной продукции у субъектов МСП']");
	
	function sizing(field) {
		var label = field.children(".documentView-field-label");
		var value = field.children(".documentView-field-value");
		
		label.attr('class','col-sm-10 documentView-field-label');
		value.attr('class','col-sm-2 documentView-field-value');		
	};
	
	sizing(field1);	
	sizing(field2);
	sizing(field3);		
};

$(document).on('change', "input[name='god']", function (e) {
      var val = $("input[name='god']").val();
	  var godzak = $("input[name='godokon']").val();
        if(val != "" && godzak !="" && val > godzak){
			$("input[name='godokon']").autoNumeric('wipe');
			showCommonErrors('Год окончания не может быть раньше года начала');
		}
});
$(document).on('change', "input[name='godokon']", function (e) {
      var val = $("input[name='god']").val();
	  var godzak = $("input[name='godokon']").val();
        if(val != "" && godzak !="" && val > godzak){
			$("input[name='godokon']").autoNumeric('wipe');
			showCommonErrors('Год окончания не может быть раньше года начала');
		}
});

var MSPGod = function() {
	var godEndingMSP = $("input[name='godEndingMSP']"); 	
	var godzak = $("input[name='god']");
	godEndingMSP.val(parseInt(godzak.val())+2); 	
};

var CurrentUserAccess = function() {
	var CurrentUserName = $(".header-menu-user-name").text(); // текущий юзер из заголовка меню
	var CurrentUserId;	
	var flag = false;
	var registerOrgZa = $("input[name='registerOrgZa']");
	var OrgZakupki = $("input[name='OrgZakupki']");
	
	// Возвращаем ID юзера по атрибуту name	
	var url = "AddressBook/GetAddressBookJson?editAddressBookTypes=Person&addressBookDataType=Person";			
		
	$.getJSON(  getRelativeUrl(url) , function (data) {					
		$(data.children).each(function(index, row){
			if (row.name == CurrentUserName) { 																		
				CurrentUserId = row.key;												
				if (row.role.indexOf("Ответственный за размещение ПЗ ЦХД") !=-1) {
					registerOrgZa.closest(".column-container").show();
					OrgZakupki.closest(".column-container").show();
					$("[data-related-field=registerOrgZa]").show();
					$("[data-related-field=OrgZakupki]").show();
				} else if (row.role.indexOf("Ответственный за размещение плана закупок") !=-1) {
					$("button[name='registerOrgZa']").attr('disabled', true);
					$("button[name='OrgZakupki']").attr('disabled', true);
					registerOrgZa.closest(".column-container").show();
					OrgZakupki.closest(".column-container").show();
					$("[data-related-field=registerOrgZa]").show();
					$("[data-related-field=OrgZakupki]").show();
				} else {
					registerOrgZa.closest(".column-container").hide();
					OrgZakupki.closest(".column-container").hide();
					$("[data-related-field=registerOrgZa]").hide();
					$("[data-related-field=OrgZakupki]").hide();
				}
			}			
		});
				
	})	
};

var CurrentUserAccessEdit = function() {
	var CurrentUserName = $(".header-menu-user-name").text(); // текущий юзер из заголовка меню
	var CurrentUserId;	
	var flag = false;
	var registerOrgZa = $("input[name='registerOrgZa']");
	var OrgZakupki = $("input[name='OrgZakupki']");
	
	// Возвращаем ID юзера по атрибуту name	
	var url = "AddressBook/GetAddressBookJson?editAddressBookTypes=Person&addressBookDataType=Person";			
		
	$.getJSON(  getRelativeUrl(url) , function (data) {					
		$(data.children).each(function(index, row){
			if (row.name == CurrentUserName) { 																		
				CurrentUserId = row.key;												
				if (row.role.indexOf("Ответственный за размещение ПЗ ЦХД") !=-1) {
					$("button[name='registerOrgZa']").attr('disabled', true);
					$("button[name='OrgZakupki']").attr('disabled', true);
					registerOrgZa.closest(".column-container").show();
					OrgZakupki.closest(".column-container").show();
					$("[data-related-field=registerOrgZa]").show();
					$("[data-related-field=OrgZakupki]").show();
				} else if (row.role.indexOf("Ответственный за размещение плана закупок") !=-1) {
					$("button[name='registerOrgZa']").attr('disabled', true);
					$("button[name='OrgZakupki']").attr('disabled', true);
					registerOrgZa.closest(".column-container").show();
					OrgZakupki.closest(".column-container").show();
					$("[data-related-field=registerOrgZa]").show();
					$("[data-related-field=OrgZakupki]").show();
				} else {
					registerOrgZa.closest(".column-container").hide();
					OrgZakupki.closest(".column-container").hide();
					$("[data-related-field=registerOrgZa]").hide();
					$("[data-related-field=OrgZakupki]").hide();
				}
			}			
		});
				
	})	
};

function correctplanOrganization(){
	$(document).on('change', "input[data-field-name='registerOrgZa']", function () {
		var registerOrgZa = $("input[name='registerOrgZa']");
		if (registerOrgZa.val() != "") {
			if ((registerOrgZa.val() != 'ООО "ЦЕНТР ХРАНЕНИЯ ДАННЫХ"') && (registerOrgZa.val() != 'ООО "ЦЕНТР ТЕХНОЛОГИЙ ВИРТУАЛИЗАЦИИ"') && (registerOrgZa.val() != 'ООО "ДАТАЛАЙН"') && (registerOrgZa.val() != 'АО "МОСКОВСКАЯ МЕЖДУГОРОДНАЯ ТЕЛЕФОННАЯ СТАНЦИЯ №9"') && (registerOrgZa.val() != 'АО "НАУЧНО-ПРОИЗВОДСТВЕННОЕ ОБЪЕДИНЕНИЕ СЭМ"')){
				showCommonErrors('Пожалуйста, выберите другую организацию. Для выбранной организации создание плана закупок недоступно.');
				registerOrgZa.clear();
			} 
		}
		
	});
};

var mspProcError = function () {
	var OrgZak = $(".documentView-field-value[data-name='Организация заказчик']").attr("title");
	var procMSP = $(".documentView-field-value[data-name='Процент МСП']").attr("title");
	if(OrgZak != undefined){
		if (OrgZak.indexOf("ЦЕНТР ХРАНЕНИЯ ДАННЫХ") != -1 ) {
			if (procMSP < 18) {
				showCommonErrors('Пожалуйста, обратите внимание - процент МСП меньше 18.');
			} 
		}
	}
};

function changeOrgZa(){
	$(document).on('change', "input[name='registerOrgZa']", function() {
		let registerOrgZaId = $("input[type='hidden'][name='registerOrgZaId']").val()
		let registerOrgZaName = $(this).val()
		$("input[type='hidden'][name='OrgZakupkiId']").val(registerOrgZaId)
		$("input[type='text'][name='OrgZakupki']").val(registerOrgZaName)
	});
	$(document).on('change', "input[name='orgzakINN']", function() {
		$("input[type='text'][name='orgzakupkiINN']").val($(this).val())
	});
	$(document).on('change', "input[name='orgzakKPP']", function() {
		$("input[type='text'][name='orgzakupkiKPP']").val($(this).val())
	});
	$(document).on('change', "input[name='orgzakEISCode']", function() {
		$("input[type='text'][name='OrgZakupkiEIS']").val($(this).val())
	});
	$(document).on('change', "input[name='orgzakOGRN']", function() {
		$("input[type='text'][name='orgzakupkiOGRN']").val($(this).val())
	});
}

scopes.onView(viewSizeInfo); 
scopes.onView(SoglasovView); 
scopes.onRegister(Soglas);
scopes.onView(hideextendedplanview);
scopes.onView(mspProcError);


scopes.onRegisterTemp(editreg);
scopes.onRegisterTemp(summary);
scopes.onRegisterTemp(CMP_reg);
scopes.onRegister(ras);
scopes.onRegister(MSPGod);
scopes.onRegister(CurrentUserAccess);
scopes.onRegister(correctplanOrganization);
scopes.onRegister(changeOrgZa);

scopes.onEdit(ras);
scopes.onEdit(Soglas);
scopes.onEditTemp(summary);
scopes.onEditTemp(editreg);
scopes.onEdit(MSPGod);
scopes.onEdit(CurrentUserAccessEdit);
scopes.onEdit(changeOrgZa);