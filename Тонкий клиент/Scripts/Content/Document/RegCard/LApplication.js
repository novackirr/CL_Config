"use strict";

var View = function() {
    
}
var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}


// Краткое содержание, редактирование
var summary = function() {
	
	var kratkoe = $("input[name='ktatkoe']");
	
	var nomerzayav = $("input[name='nomerzayav']");
	var datezayav = $("input[name='datezayav']");
	var registerNomberEIS = $("input[name='registerNomberEIS']");
	//var registerNomberETP = $("input[name='registerNomberETP']");
	//var Name_Lot = $("input[name='Name_Lot']");
	var sposob = $("input[name='sposob']");
	
	function rebuildField() {
		var result = [];
	
		if (nomerzayav.val()) {
			result.push('Заявка участника №' + nomerzayav.val().trim());
		}
		
		if (datezayav.val()) {
			result.push('от ' + datezayav.val().trim());
		}
		
		if (registerNomberEIS.val()) {
			result.push('номер извещения в ЕИС: ' + registerNomberEIS.val().trim());
		}
	/*	
		if (registerNomberETP.val()) {
			result.push('номер извещения на ЭТП:' + registerNomberETP.val().trim());
		}
		
		if (Name_Lot.val()) {
			result.push('наименование лота:' + Name_Lot.val().trim());
		}
		*/
		if (sposob.val()){
			result.push('способ закупки:' + sposob.val().trim());
		}
		
		kratkoe.val(result.join(', '));
	}
	
	rebuildField();

	nomerzayav.change(function() {
		rebuildField();
	});

	datezayav.change(function() {
		rebuildField();
	});
	registerNomberEIS.change(function() {
		rebuildField();
	});
	/*registerNomberETP.change(function() {
		rebuildField();
	});
	Name_Lot.change(function() {
		rebuildField();
	});*/
	sposob.change(function() {
		rebuildField();
	});
}


//Категория СМП
//на просмотр

var Category= function() {
	var flag = $("div[data-name='СМП']").find("input[type='checkbox']");
	 var CategorySMP = $("div[data-name='Категория СМП']");	 
	  if (!$(flag).attr("checked")) {
        CategorySMP.hide();		
		
    } else {
        CategorySMP.show();		 
    }
}


scopes.onEdit(summary);
scopes.onEdit(EditReg);

scopes.onRegister(summary);
scopes.onRegister(EditReg);

scopes.onView(View);
scopes.onView(Category);