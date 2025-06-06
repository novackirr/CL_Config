"use strict";
$(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
        /* var item = $(value); */
		var item = $("input[name='curs']");
        item.autoNumeric('init', {
            aSep: '',
            aDec: '.',
            vMin: '0.0000',
            vMax: "99999999999999999999999999999999999999999.9999",
            mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
            wEmpty: '',
            mRound: 'B'
        });
		
		var item2 = $("input[data-field-name*='ItemTab-PositionCurrency-']");
        item2.autoNumeric('init', {
            aSep: '',
            aDec: '.',
            vMin: '0.0000',
            vMax: "99999999999999999999999999999999999999999.9999",
            mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '4',
            wEmpty: '',
            mRound: 'B'
        });
});

var editreg = function() {     
	$("li:has(:contains('Скрытые поля'))").hide();
	//$("li:has(:contains('Cведения об исполнении'))").hide();
	$("input[data-field-name='registerOrgZa']").prev().hide();
	$("input[data-field-name='Currency_kod']").parent().children(".input-group-btn").children().prop('disabled', true);
	$("input[data-field-name='Currency_kod_change']").parent().children(".input-group-btn").children().prop('disabled', true);
	$("div[data-name='ItemTab']").find(".table-edit-columns").css("cssText", "margin-right: 0px; padding-right: 0px");
	$("div[data-name='ItemTab']").closest('.table-edit-wrapper').css("cssText", "padding-bottom: 0px;");
	
	var item = $("input[name='curs']");
    item.autoNumeric('update', {
        aSep: '',
        aDec: '.',
        vMin: '0.0000',
        vMax: "99999999999999999999999999999999999999999.9999",
        mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
        wEmpty: '',
         mRound: 'B'
    });
		
	var item2 = $("input[data-field-name*='ItemTab-PositionCurrency-']");
    item2.autoNumeric('update', {
        aSep: '',
        aDec: '.',
        vMin: '0.0000',
        vMax: "99999999999999999999999999999999999999999.9999",
        mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '4',
        wEmpty: '',
        mRound: 'B'
    }); 
}

var summary = function() {
	
    var kratkoe = $("input[name='ktatkoe']");
	
    var numberdog = $("input[name='nomerdog']");
    var datedog = $("input[name='datezakldog']");
    var preddog = $("textarea[name='preddog']");
    var postav = $("input[name='orgpost2Name']");
    var price = $("input[name='cenasNDSdog']");
	
    function rebuildField() {
        var result = [];
		
        if (numberdog.val()) {
            result.push("Договор №: " + numberdog.val());
		}
		
        if (datedog.val()) {
            result.push("от " + datedog.val());
		}
		
        if (preddog.val()) {
            result.push("предмет договора: " + preddog.val());
		}
		
        if (postav.val()) {
            result.push("поставщик " + postav.val());
		}
		
        if (price.val()) {
            result.push("цена договора: " + price.autoNumeric("get"));
		}
		
        kratkoe.val(result.join(", "));
	}
	
    rebuildField();
	
    numberdog.change(function() {
        rebuildField();
	});
	
    datedog.change(function() {
        rebuildField();
	});
	
    preddog.change(function() {
        rebuildField();
	});
	
    postav.change(function() {
        rebuildField();
	});
	
    price.change(function() {
        rebuildField();
	});
};

var validatesubcontractorsreg = function() {
	var flag = $("input[data-field-name='subpodr']");
    var dogsmpcol = $("input[name='dogsmpcol']");
	var subpodrCost = $("input[name='subpodrCost']");
	
	if ($(flag).is(":checked")) {
		$("input[data-field-name='subpodrCost']").closest(".column-container").show();
		$("[data-related-field='subpodrCost']").closest(".column-container").show();
		$("input[data-field-name='subpodrCost']").prop("required", true);
		$("[data-related-field=subpodrCost]").addClass("label-required");
		$("input[data-field-name='dogsmpcol']").closest(".column-container").show();
		$("[data-related-field='dogsmpcol']").closest(".column-container").show();
		$("input[data-field-name='dogsmpcol']").prop("required", true);
		$("[data-related-field=dogsmpcol]").addClass("label-required");
		} else {
		$("input[data-field-name='subpodrCost']").closest(".column-container").hide();
		$("[data-related-field='subpodrCost']").closest(".column-container").hide();
		$("input[data-field-name='subpodrCost']").autoNumeric('wipe');
		$("input[data-field-name='subpodrCost']").prop("required", false);
		$("[data-related-field=subpodrCost]").removeClass("label-required");
		$("input[data-field-name='dogsmpcol']").closest(".column-container").hide();
		$("[data-related-field='dogsmpcol']").closest(".column-container").hide();
		$("input[data-field-name='dogsmpcol']").val('');
		$("input[data-field-name='dogsmpcol']").prop("required", false);
		$("[data-related-field=dogsmpcol]").removeClass("label-required");
	}		
}; 

$(document).on('change', "input[data-field-name='subpodr']", function (e) {
	var flag = $("input[data-field-name='subpodr']");
    var dogsmpcol = $("input[name='dogsmpcol']");
	var subpodrCost = $("input[name='subpodrCost']");
	
	if ($(flag).is(":checked")) {
			$("input[data-field-name='subpodrCost']").closest(".column-container").show();
			$("[data-related-field='subpodrCost']").closest(".column-container").show();
			$("[data-related-field='subpodrCost']").show();
			$("input[data-field-name='subpodrCost']").prop("required", true);
			$("[data-related-field=subpodrCost]").addClass("label-required");
			$("input[data-field-name='dogsmpcol']").closest(".column-container").show();
			$("[data-related-field='dogsmpcol']").closest(".column-container").show();
			$("[data-related-field='dogsmpcol']").show();
			$("input[data-field-name='dogsmpcol']").prop("required", true);
			$("[data-related-field=dogsmpcol]").addClass("label-required");								
		} else {
			subpodrCost.prop("required", false);
			subpodrCost.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			dogsmpcol.prop("required", false);
			dogsmpcol.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			dogsmpcol.closest(".column-container").hide();
			dogsmpcol.val("");
			subpodrCost.closest(".column-container").hide();
			subpodrCost.val("");
			$("[data-related-field=subpodrCost]").hide();
			$("[data-related-field=subpodrCost]").removeClass("label-required");
			$("[data-related-field=dogsmpcol]").hide();
			$("[data-related-field=dogsmpcol]").removeClass("label-required");
	}		
});	   
   
//Привлечены субподрядчики на редактирование
var validatesubcontractorsedit = function() {
    var subpodr = $("#editView input[name='subpodr']");
    var dogsmpcol = $("#editView input[name='dogsmpcol']");
	var subpodrCost = $("#editView input[name='subpodrCost']");
	
    subpodr.change(function() {
        if ($(this).is(":checked")) {
			subpodrCost.prop("required", true);
			subpodrCost.closest(".column-container").find(".documentView-field-label").addClass("label-required");
            dogsmpcol.prop("required", true);
			dogsmpcol.closest(".column-container").find(".documentView-field-label").addClass("label-required");
			dogsmpcol.closest(".column-container").show();			
			subpodrCost.closest(".column-container").show();		
			$("[data-related-field=subpodrCost]").show();
            $("[data-related-field=subpodrCost]").addClass("label-required");
			$("[data-related-field=dogsmpcol]").show();
            $("[data-related-field=dogsmpcol]").addClass("label-required");
			} else {
			subpodrCost.prop("required", false);
			subpodrCost.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
            dogsmpcol.prop("required", false);
			dogsmpcol.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			dogsmpcol.closest(".column-container").hide();
			dogsmpcol.val("");
			subpodrCost.closest(".column-container").hide();
			subpodrCost.val("");
			$("[data-related-field=subpodrCost]").hide();
            $("[data-related-field=subpodrCost]").removeClass("label-required");
			$("[data-related-field=dogsmpcol]").hide();
		    $("[data-related-field=dogsmpcol]").removeClass("label-required");
		}		
	});              
};

//на просмотр
var validatesubcontractorsview = function() {
	var flag = $("div[data-name='Привлечены субподрядчики']").find("input[type='checkbox']");
	var dogsmpcol = $("div[data-name='Количество договоров с субподрядчиками СМП']");
	var subpodrCost = $("div[data-name='Стоимость договоров с субподрядчиками СМП']");
	if (!$(flag).attr("checked")) {
        hideViewElementColumn(dogsmpcol);
		hideViewElementColumn(subpodrCost); 
		
		} else {
        showViewElementColumn(dogsmpcol);
		showViewElementColumn(subpodrCost);
	}
}

//Скрыть блок "Изменения"
//на редактирование
var hideblockchangeedit=function() {
	var regstatus = $("input[name='regstatus']");
	var Change = $("li:has(:contains('Изменения'))");
	var numRed = $("input[name='numberRed']").val();
	function ScrBlock() {
		var Status_Edit = regstatus.val();
		var statuses = [
            "Внесение изменений"
		];
		var NumDogPred = $("input[name='numPredVer']").val();
		if (NumDogPred == -1) {
            Change.hide();
			$("textarea[data-field-name='obosnvnizm']").closest(".column-container").find(".date-field").prop("required", false);
			$("[data-related-field=obosnvnizm]").removeClass("label-required");
			$("textarea[data-field-name='obosnvnizm']").closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			} else{
            Change.show();
			$("textarea[data-field-name='obosnvnizm']").prop("required", true);
			$("[data-related-field=obosnvnizm]").addClass("label-required");
			$("textarea[data-field-name='obosnvnizm']").closest(".column-container").find(".documentView-field-label").addClass("label-required");
			
		}
	}
	ScrBlock();
	regstatus.change(function() {
        ScrBlock();
	});
}

//на просмотр
var hideblockchangeview = function() {    
	var ChangeView = $("li:has(:contains('Изменения'))");
	var osnIzm = $(".documentView-field-value[data-name='Обоснование внесения изменений']");
	var flag = $("div[data-name='Изменение сведений']").find("input[type='checkbox']");
	var date = $("div[data-name='Дата утверждения изменений']");
	var izmTRU = $("div[data-name='Изменение ТРУ']");
	if ($.trim($(osnIzm).text())) {
		ChangeView.show();
		if (flag.attr("checked")){
			if(izmTRU.find("input[type='checkbox']").attr("checked")){
			}
			else{
				$("div[data-name='Обоснование внесения изменений']").parent().parent().next().hide();
			}
		}
		else{
			hideViewElementColumn(date);
			hideViewElementColumn(izmTRU);
			$("div[data-name='Обоснование внесения изменений']").parent().parent().next().hide();
		}
	} else {
		ChangeView.hide();
	}
		
}

// Скрываем поля инфо о поставщике, если пусто	
var view_hide = function () {
	$("div[data-name='ИД ЭТП']").hide();
	function hidefield(field) {
		if (field.text() == " " || field.text() == "") {
			field.parent().hide()
		}
	};
	hidefield($("div .documentView-field-value[data-name='Идентификационный номер']"));
	hidefield($("div .documentView-field-value[data-name='Дополнительный идентификационный номер']"));
	hidefield($("div .documentView-field-value[data-name='ОКПО']"));
	hidefield($("div .documentView-field-value[data-name='ОКОПФ']"));
	hidefield($("div .documentView-field-value[data-name='ОКОПФ наименование']"));
	hidefield($("div .documentView-field-value[data-name='Фирменное наименование']"));
	hidefield($("div .documentView-field-value[data-name='Дата постановки на учет']"));
	hidefield($("div .documentView-field-value[data-name='Район']"));
	hidefield($("div .documentView-field-value[data-name='Населенный пункт']"));
	hidefield($("div .documentView-field-value[data-name='Офис (квартира)']"));
	hidefield($("div .documentView-field-value[data-name='Корпус (строение)']"));
	var MSPtype = $("div[data-name='Тип МСП']");
    var flag = $("div[data-name='МСП']").find("input[type='checkbox']");
    if ($(flag).attr("checked")) {	
        showViewElementColumn(MSPtype);
	} else {
        hideViewElementColumn(MSPtype);;		
	}
};

// Скрываем конвертацию валюты, если == Российский рубль
// на регистрацию/редактирование 
var CurrencyEdit = function() {
	var Currency= $("input[name='Currency']");
	if(Currency.val() == "Российский рубль") {
		//$("input[data-field-name='Currency']").closest(".column-container").hide();
		//$("div[data-related-field='Currency']").closest(".column-container").hide();
		$("input[data-field-name='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='NMCD']").closest(".column-container").hide();
		$("input[data-field-name='curs']").closest(".column-container").hide();
		$("div[data-related-field='curs']").closest(".column-container").hide();
		$("input[data-field-name='dateCurs']").closest(".column-container").hide();
		$("div[data-related-field='dateCurs']").closest(".column-container").hide();
	} else {
		//$("input[data-field-name='Currency']").closest(".column-container").show();
		//$("div[data-related-field='Currency']").closest(".column-container").show();
		$("input[data-field-name='NMCD']").closest(".column-container").show();
		$("div[data-related-field='NMCD']").closest(".column-container").show();
		$("input[data-field-name='curs']").closest(".column-container").show();
		$("div[data-related-field='curs']").closest(".column-container").show();
		$("input[data-field-name='dateCurs']").closest(".column-container").show();
		$("div[data-related-field='dateCurs']").closest(".column-container").show();
	}
}


// Конвертируем, если валюта != Российский рубль
var PriceRub = {

	CalculateSumma:function (obj) {
		var curs = $("input[name='curs']");
		var cenasNDSdog = $("input[name='cenasNDSdog']");
		var NMCD = $("input[name='NMCD']");
		var flag=$("input[name='Currency_kod']").val();
		if (flag!=="RUB" && curs.val()!="") {
		    curs.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			//vMin: '0.00000',
			vMax: "999999999999999999999.9999",
			wEmpty: '',
			mRound: 'B'
		});
		cenasNDSdog.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			//vMin: '0.00000',
			vMax: "999999999999999999999.99",
			wEmpty: '',
			mRound: 'B'
		});
		NMCD.autoNumeric('init', {
			aSep: '',
			aDec: '.',
			//vMin: '0.00000',
			vMax: "999999999999999999999.99",
			wEmpty: '',
			mRound: 'B'
		});
			var s2 = curs.autoNumeric('get');
			var s4 = cenasNDSdog.autoNumeric('get');
			var val2 =  parseFloat(s2? s2 : 0);
			var val4 =  parseFloat(s4? s4 : 0);
			NMCD.autoNumeric('set', val4*val2);
			if (($("input[name='NMCD']").val()== 0) || ($("input[name='NMCD']").val()== 0.00)) {
				$("input[name='NMCD']").val("");
			}
		}
		else{
			NMCD.val(cenasNDSdog.val());
		}
	}
}

$(document).on('change', "input[data-field-name='curs']", function (e) {
	PriceRub.CalculateSumma(this);
	});
	
$(document).on('change', "input[data-field-name='cenasNDSdog']", function (e) {
	var valuta = $("input[name='Currency_kod']").val();
	var NMCS = $("input[name='cenasNDSdog']").val();
	var NMCD = $("input[name='NMCD']");
	if (valuta=='RUB'){
		NMCD.val(NMCS);
	}
	PriceRub.CalculateSumma(this);
	/* NDSRub.CalculateNDS(this); */
});

var Summinrub = function() {

	var cenasNDSdog = $("input[name='cenasNDSdog']");
	var NMCD = $("input[name='NMCD']");
	var flag=$("input[name='Currency']").val();
	if (flag!=="Российский рубль") {
		$("input[data-field-name='NMCD']").closest(".column-container").show();
		$("div[data-related-field='NMCD']").closest(".column-container").show();
		$("input[data-field-name='curs']").closest(".column-container").show();
		$("div[data-related-field='curs']").closest(".column-container").show();
		$("input[data-field-name='dateCurs']").closest(".column-container").show();
		$("div[data-related-field='dateCurs']").closest(".column-container").show();
		//$("input[data-field-name='Currency']").closest(".column-container").show();
		//$("div[data-related-field='Currency']").closest(".column-container").show();
		$("input[data-field-name='NMCD']").prop('required', true);
		$("div[data-related-field='NMCD']").addClass("label-required");
		$("input[data-field-name='curs']").prop('required', true);
		$("div[data-related-field='curs']").addClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', true);
		$("div[data-related-field='dateCurs']").addClass("label-required");
	}
	else {
		$("input[data-field-name='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='NMCD']").closest(".column-container").hide();
		$("div[data-related-field='emptyLabel']").closest(".column-container").hide();
		$("input[data-field-name='curs']").closest(".column-container").hide();
		$("div[data-related-field='curs']").closest(".column-container").hide();
		$("input[data-field-name='dateCurs']").closest(".column-container").hide();
		$("div[data-related-field='dateCurs']").closest(".column-container").hide();
		//$("input[data-field-name='Currency']").closest(".column-container").hide();
		//$("div[data-related-field='Currency']").closest(".column-container").hide(); 
		$("input[data-field-name='NMCD']").prop('required', false);
		$("div[data-related-field='NMCD']").removeClass("label-required");
		$("input[data-field-name='curs']").prop('required', false);
		$("div[data-related-field='curs']").removeClass("label-required");
		$("input[data-field-name='dateCurs']").prop('required', false);
		$("div[data-related-field='dateCurs']").removeClass("label-required");
		NMCD.val(cenasNDSdog.val());
	}

}

var osnEP = function () {
	var spzak = $("input[name='Sposob_code']").val();
	if (spzak == "533003"){
		$("input[data-field-name='osnEP']").closest(".column-container").show();
		$("[data-related-field=osnEP]").show();
		$("input[data-field-name='osnEP']").prop("required", true);
		$("[data-related-field=osnEP]").addClass("label-required");	
	}
	else {
		$("input[data-field-name='osnEP']").prop("required", false);
		$("[data-related-field=osnEP]").removeClass("label-required");
		$("input[data-field-name='osnEP']").closest(".column-container").hide();
		$("[data-related-field=osnEP]").hide();
		$("input[data-field-name='osnEP']").closest(".clearfix").find(".dict-display-field").val("");
		$("input[name='osnEP']").val('');
		$("textarea[data-field-name='osnEPName']").text('');
		$("textarea[data-field-name='osnEPName']").val('');
		$("input[name='osnEPName']").attr('value','');
		$("input[data-field-name='soglUpravPoZa']").closest(".column-container").hide();
		$("[data-related-field=soglUpravPoZa]").hide();
	}
}

function filterWorgpostdogINNersDic() {
	var eventName = "DicDialogOpened",
		dicName = "Контрагенты";

	var buttons = $("button[data-dict-name='" + dicName + "']");
	buttons.each(function (index, btn) {
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
		
			var ps1 = $("input[data-field-name*='TableOrgpost1-orgpostTable']").closest("div.table-content");
			var arr = [];
			var n = 0;
			ps1.children("div.table-edit-row").each(function () {
				var curent = $(this);
				var row = curent.closest(".table-edit-row");
				var id = row.attr("data-rowkey");
				if (id != undefined) {
					arr[n] = $("input[name='TableOrgpost1-orgpostTable-"+id+"']").val();
					n=n+1;
				}
			});
			if(arr.length !=0){
				var items = args.items;
				var l = items.length;
				var n = true;
				for (var i = 0; i < arr.length; i++) {
					if(items.find(function(item){return item.data.code === arr[i]}) == undefined){
						n = false; 
					}
				}
				if (n == true){
					$(".dialogAddBtn").hide();

					if(items.length != 0)
					{
						// Фильтруем элементы
						var parent = items[0].parentNode;
						var exist = [];
						for (var i = 0; i < l; i++) {
							var current = items[i];
							if ($.inArray(current.data.code, arr) !== -1){
								exist.push(current); 
							}						
						}
					
						// Восстанавливаем нужные элементы
						parent.removeAll();
						exist.forEach(function(element) {
							parent.appendChild(element);
						})
					}					
				}
			}
		});

	});
}

var ValutaView = function() {
    var Valuta = $(".documentView-field-value[data-name='Валюта']").text(); 
	if (Valuta != "Российский рубль") {
	 $("div[data-name='Курс валюты']").closest(".column-container").show();
	 $("div[data-name='Цена договора в рублях']").closest(".column-container").show();
	 $("div[data-name='Дата, на которую установлен курс валюты']").closest(".column-container").show();
	}
	else {
	 $("div[data-name='Курс валюты']").closest(".column-container").hide();
	 $("div[data-name='Цена договора в рублях']").closest(".column-container").hide();
	 $("div[data-name='Дата, на которую установлен курс валюты']").closest(".column-container").hide();
	}

}	

var Izmen = function(){
	var ispSved = $("input[data-field-name='ispSved']");
	var izmSved = $("input[data-field-name='izmSved']");
	var izmTRU = $("input[data-field-name='izmTRU']");
	if (ispSved.is(":checked")) {
		$("[data-related-field='izmTRU']").closest(".column-container").hide();
		$("input[data-field-name='dateUtver']").closest(".column-container").hide();
		$("[data-related-field='dateUtver']").closest(".column-container").hide();
		$("input[data-field-name='dateUtver']").parent().data("DateTimePicker").clear();
		$("[data-name='DocChange']").parent().parent().parent().hide();
		$("div[data-name='DocChange']").find("[data-rowkey]").each(function(index, element) {
			removeTableRow(element);
		});
	}
	else if (izmSved.is(":checked")) {
		$("[data-related-field='izmTRU']").closest(".column-container").show();
		$("input[data-field-name='dateUtver']").closest(".column-container").show();
		$("[data-related-field='dateUtver']").closest(".column-container").show();
		$("input[data-field-name='dateUtver']").prop("required", true);
		$("[data-related-field=dateUtver]").addClass("label-required");
		if (izmTRU.is(":checked")) {
			$("[data-name='DocChange']").parent().parent().parent().show();
			$("input[name='DocChange-numDoc']").prop('required', true);
			$("input[name='DocChange-dateDoc']").prop('required', true);
			$("input[name='DocChange-dopInfo']").prop('required', true);
		}
		else{
			$("[data-name='DocChange']").parent().parent().parent().hide();
		}
	}
	else{
		$("[data-related-field='izmTRU']").closest(".column-container").hide();
		$("input[data-field-name='dateUtver']").closest(".column-container").hide();
		$("[data-related-field='dateUtver']").closest(".column-container").hide();
		$("input[data-field-name='dateUtver']").parent().data("DateTimePicker").clear();
		$("[data-name='DocChange']").parent().parent().parent().hide();
	}
	
}
$(document).on('change', "input[data-field-name='izmSved']", function (e) {
	$("input[data-field-name='ispSved']").prop('checked', false);
	$("[data-related-field='izmTRU']").closest(".column-container").show();
	$("input[data-field-name='dateUtver']").closest(".column-container").show();
	$("[data-related-field='dateUtver']").closest(".column-container").show();
	$("input[data-field-name='dateUtver']").prop("required", true);
	$("[data-related-field=dateUtver]").addClass("label-required");
});
$(document).on('change', "input[data-field-name='ispSved']", function (e) {
	$("input[data-field-name='izmSved']").prop('checked', false);
	$("input[data-field-name='izmTRU']").prop('checked', false);
	$("[data-related-field='izmTRU']").closest(".column-container").hide();
	$("input[data-field-name='dateUtver']").closest(".column-container").hide();
	$("[data-related-field='dateUtver']").closest(".column-container").hide();
	$("input[data-field-name='dateUtver']").parent().data("DateTimePicker").clear();
	$("input[data-field-name='dateUtver']").prop("required", false);
	$("[data-related-field=dateUtver]").removeClass("label-required");
	$("div[data-name='DocChange']").find("[data-rowkey]").each(function(index, element) {
			removeTableRow(element);
	});
	$("[data-name='DocChange']").parent().parent().parent().hide();
});
$(document).on('change', "input[data-field-name='izmTRU']", function (e) {
	var izmTRU = $("input[data-field-name='izmTRU']");
	if (izmTRU.is(":checked")) {
		$("[data-name='DocChange']").parent().parent().parent().show();
		$("input[name='DocChange-numDoc']").prop('required', true);
		$("input[name='DocChange-dateDoc']").prop('required', true);
		$("input[name='DocChange-dopInfo']").prop('required', true);
	}
	else{
		$("[data-name='DocChange']").parent().parent().parent().hide();
		$("input[name='DocChange-numDoc']").prop('required', false);
		$("input[name='DocChange-dateDoc']").prop('required', false);
		$("input[name='DocChange-dopInfo']").prop('required', false);
		$("div[data-name='DocChange']").find("[data-rowkey]").each(function(index, element) {
			removeTableRow(element);
		});
	}
});

var contrAg = function() {
	var TypeVal = $("input[name='orgpostdog_kod']").val();
	var orgpostdogOKOPF = $("input[name='orgpostdogOKOPF']");
	var orgpostdogOKOPFName = $("input[name='orgpostdogOKOPFName']");
	var orgpostdogOKOPO = $("input[name='orgpostdogOKOPO']");
	var nerezdog = $("input[name='nerezdog']");
	var orgpostdogIdentNum = $("input[name='orgpostdogIdentNum']");
	var orgpostdogIdentNumAd = $("input[name='orgpostdogIdentNumAd']");
	var datepostnauch = $("input[name='datepostnauch']");
	var orgpostdogINN = $("input[name='orgpostdogorgpostdogINN']");
	var orgpostdogKPP = $("input[name='orgpostdogorgpostdogKPP']");
	var orgpostdogRegion = $("input[name='orgpostdogRegion']");
	var orgpostdogDistrict = $("input[name='orgpostdogDistrict']");
	var orgpostdogRegRus = $("input[name='orgpostdogRegRus']");
	var CMP = $("input[name='CMP']");
	var SMPType = $("input[name='SMPType']");
	var naimETPID = $("input[name='naimETPID']").val(); // ИД площадки
	
	
	// физическое лицо
	// физическое лицо иностранного государства
	if (['PF', 'P'].indexOf(TypeVal) > -1) {
		filedNotRequired(['orgpostdogOKOPF', 'orgpostdogOKOPFName', 'orgpostdogOKOPO']);
		
		if (nerezdog.is(":checked")){
			
			filedShow(['orgpostdogIdentNumAd']); // отобразить
			filedShowAndRequired(['orgpostdogIdentNum']); // отобразить и сдлеать обязательным
			filedNotRequired(['orgpostdogKPP', 'orgpostdogRegion', 'orgpostdogDistrict', 'orgpostdogStreet', 'orgpostdogApartment', 'orgpostdogOKTMO']); // скрыть и сделать необязательным
			
			if (orgpostdogRegRus.is(":checked")){
				filedShowAndRequired(['datepostnauch', 'orgpostdogINN']);	
			}
			else {
				filedNotRequired(['datepostnauch', 'orgpostdogINN']);
			}
			
		}
		else {
			filedShowAndRequired(['datepostnauch', 'orgpostdogINN']);
			filedNotRequired(['orgpostdogKPP']);
			filedHideAndNotRequired(['orgpostdogIdentNum', 'orgpostdogIdentNumAd']);
		}
	}
	else {
		
		if (nerezdog.is(":checked")){
			filedShowAndRequired(['orgpostdogIdentNum']);
			filedShow(['orgpostdogIdentNumAd']);
			filedNotRequired(['orgpostdogOKOPF', 'orgpostdogOKOPFName', 'orgpostdogOKOPO', 'orgpostdogRegion', 'orgpostdogDistrict', 'orgpostdogStreet', 'orgpostdogApartment', 'orgpostdogOKTMO']);
			if (orgpostdogRegRus.is(":checked")){
				filedShowAndRequired(['datepostnauch', 'orgpostdogINN', 'orgpostdogKPP']);	
			}
			else{
				filedNotRequired(['datepostnauch', 'orgpostdogINN', 'orgpostdogKPP']);
			}
		}
		else {
			filedShowAndRequired(['orgpostdogOKOPF', 'orgpostdogOKOPFName', 'orgpostdogOKOPO', 'orgpostdogRegion', 'orgpostdogDistrict', 'datepostnauch', 'orgpostdogINN', 'orgpostdogKPP']);
			filedHideAndNotRequired(['orgpostdogIdentNum', 'orgpostdogIdentNumAd']);
			
			if (naimETPID == 2) {
				filedShowAndRequired(['orgpostdogOKTMO', 'orgpostdogStreet', 'orgpostdogApartment']);
			}
		}
	}
	

	if (CMP.is(":checked")){
		SMPType.prop("required", true);
		$("[data-related-field=SMPType]").addClass("label-required");
		$("input[data-field-name='SMPType']").closest(".column-container").show();
		$("[data-related-field=SMPType]").closest(".column-container").show();
	}
	else{
		SMPType.prop("required", false);
		$("[data-related-field=SMPType]").removeClass("label-required");
		$("input[data-field-name='SMPType']").closest(".column-container").hide();
		$("[data-related-field=SMPType]").closest(".column-container").hide();
	}
}

$(document).on('change', "input[data-field-name='orgpost2']", function (e) {
	contrAg();
});

$(document).on('change', "input[data-field-name='orgpostdog_kod']", function (e) {
	contrAg();
});

$(document).on('change', "input[data-field-name='CMP']", function (e) {
	contrAg();
});

$(document).on('change', "input[data-field-name='nerezdog']", function (e) {
	contrAg();
});

$(document).on('change', "input[data-field-name='orgpostdogRegRus']", function (e) {
	contrAg();
});

var CurrencyEditChange = function () {
	var Currency_change = $("input[name='Currency_change']");
	var curschange = $("input[name='curschange']");
	if (Currency_change.val() == "Российский рубль" || Currency_change.val() === "") {
		$("input[data-field-name='Currency_change']").closest(".column-container").hide();
		$("div[data-related-field='Currency_change']").closest(".column-container").hide();
		$("input[data-field-name='curschange']").closest(".column-container").hide();
		$("div[data-related-field='curschange']").closest(".column-container").hide();
		$("input[data-field-name='dateCurschange']").closest(".column-container").hide();
		$("div[data-related-field='dateCurschange']").closest(".column-container").hide();
		curschange.autoNumeric('wipe');
		$("input[name='dateCurschange']").val('');;
	} else {
		$("input[data-field-name='Currency_change']").closest(".column-container").show();
		$("div[data-related-field='Currency_change']").closest(".column-container").show();
		$("input[data-field-name='curschange']").closest(".column-container").show();
		$("div[data-related-field='curschange']").closest(".column-container").show();
		$("input[data-field-name='dateCurschange']").closest(".column-container").show();
		$("div[data-related-field='dateCurschange']").closest(".column-container").show();
		$("input[data-field-name='dateCurschange']").prop("required", true);
		var d = new Date();

		var month = d.getMonth() + 1;
		var day = d.getDate();

		var result = (day < 10 ? '0' : '') + day + '.' + (month < 10 ? '0' : '') + month + '.' + d.getFullYear();
		$("input[data-field-name='dateCurschange']").val(result);

	}
}

$(document).on('change', "input[data-field-name='Currency_kod_change']", function (e) {
	CurrencyEditChange();
	Summinrubchange();
});


var PriceRubChange = {

	CalculateSummaChange: function (obj) {		
		var curschange = $("input[name='curschange']");
		var cenasNDSchange = $("input[name='cenasNDSchange']");
		var NMCDrubchange = $("input[name='NMCDrubchange']");
		var flag = $("input[name='Currency_kod_change']").val();
		if (flag !== "RUB" && curschange.val() != "") {
			curschange.autoNumeric('init', {
				aSep: '',
				aDec: '.',
				//vMin: '0.00000',
				vMax: "999999999999999999999.9999",
				wEmpty: '',
				mRound: 'B'
			});
			cenasNDSchange.autoNumeric('init', {
				aSep: '',
				aDec: '.',
				//vMin: '0.00000',
				vMax: "999999999999999999999.99",
				wEmpty: '',
				mRound: 'B'
			});
			NMCDrubchange.autoNumeric('init', {
				aSep: '',
				aDec: '.',
				//vMin: '0.00000',
				vMax: "999999999999999999999.99",
				wEmpty: '',
				mRound: 'B'
			});
			var s2 = curschange.autoNumeric('get');
			var s4 = cenasNDSchange.autoNumeric('get');
			var Price = s4.replace(/ /g, '') * 1;
			var val2 = parseFloat(s2 ? s2 : 0);
			var val4 = parseFloat(Price ? Price : 0);
			NMCDrubchange.autoNumeric('set', val4 * val2);
			if (($("input[name='NMCDrubchange']").val() == 0) || ($("input[name='NMCDrubchange']").val() == 0.00)) {
				$("input[name='NMCDrubchange']").val("");
			}
		}
		else {
			NMCDrubchange.val(cenasNDSchange.val());
		}
	}
}

$(document).on('change', "input[data-field-name='curschange']", function (e) {
	PriceRubChange.CalculateSummaChange(this);
});

$(document).on('change', "input[data-field-name='cenasNDSchange']", function (e) {
	var valuta = $("input[name='Currency_kod_change']").val();
	var cenasNDSchange = $("input[name='cenasNDSchange']").val();
	var NMCDrubchange = $("input[name='NMCDrubchange']");
	if (valuta == 'RUB') {
		NMCDrubchange.val(cenasNDSchange);
	}
	PriceRubChange.CalculateSummaChange(this);
});

$(document).on('change', "input[data-field-name='cenasNoNDSchange']", function (e) {
	NDSRas();
	PriceRubChange.CalculateSummaChange(this);
});

$(document).on('change', "input[data-field-name='NDS']", function (e) {
	NDSRas();
	PriceRubChange.CalculateSummaChange(this);
});

var NDSRas = function () {
	var cenasNoNDSchange = $("input[name='cenasNoNDSchange']").autoNumeric('get');
	var NDS = $("input[name='NDS']").autoNumeric('get');
	var val1 = parseFloat(cenasNoNDSchange ? cenasNoNDSchange : 0);
	var val2 = parseFloat(NDS ? NDS : 0);
	$("input[name='cenasNDSchange']").autoNumeric('set', val1 * ((100 + val2) / 100));
}

var Summinrubchange = function () {

	var cenasNDSchange = $("input[name='cenasNDSchange']");
	var NMCDrubchange = $("input[name='NMCDrubchange']");
	var flag = $("input[name='Currency_kod_change']").val();
	if (flag == "RUB" || flag == "") {
		$("div[data-related-field='emptyLabel']").closest(".column-container").hide();
		$("input[data-field-name='curschange']").closest(".column-container").hide();
		$("div[data-related-field='curschange']").closest(".column-container").hide();
		$("input[data-field-name='dateCurschange']").closest(".column-container").hide();
		$("div[data-related-field='dateCurschange']").closest(".column-container").hide();
		//$("input[data-field-name='Currency_kod']").closest(".column-container").hide();
		//$("div[data-related-field='Currency_kod']").closest(".column-container").hide();
		$("input[data-field-name='NMCDrubchange']").closest(".column-container").hide();
		$("div[data-related-field='NMCDrubchange']").closest(".column-container").hide();
		$("input[data-field-name='NMCDrubchange']").prop('required', false);
		$("div[data-related-field='NMCDrubchange']").removeClass("label-required");
		$("input[data-field-name='curschange']").prop('required', false);
		$("div[data-related-field='curschange']").removeClass("label-required");
		$("input[data-field-name='dateCurschange']").prop('required', false);
		$("div[data-related-field='dateCurschange']").removeClass("label-required");
		NMCDrubchange.val(cenasNDSchange.val());

	}
	else {
		$("input[data-field-name='curschange']").closest(".column-container").show();
		$("div[data-related-field='curschange']").closest(".column-container").show();
		$("input[data-field-name='dateCurschange']").closest(".column-container").show();
		$("div[data-related-field='dateCurschange']").closest(".column-container").show();
		$("input[data-field-name='NMCDrubchange']").closest(".column-container").show();
		$("div[data-related-field='NMCDrubchange']").closest(".column-container").show();
		//$("input[data-field-name='Currency_kod']").closest(".column-container").show();
		//$("div[data-related-field='Currency_kod']").closest(".column-container").show();
		$("input[data-field-name='NMCDrubchange']").prop('required', true);
		$("div[data-related-field='NMCDrubchange']").addClass("label-required");
		$("input[data-field-name='curschange']").prop('required', true);
		$("div[data-related-field='curschange']").addClass("label-required");
		$("input[data-field-name='dateCurschange']").prop('required', true);
		$("div[data-related-field='dateCurschange']").addClass("label-required");
	}

}

var IzmeneniePriceEdit = function () {
	var ChangePriceCheck = $("input[name='changeprice']");
	var reasonchangeprice = $("textarea[data-field-name='reasonchangeprice']");
	var ExportMSPReasonChangePrice = $("input[name='ExportMSPReasonChangePrice']");
	if (ChangePriceCheck.is(":checked")) {
		$("[data-related-field='cenasNDSchange']").closest("fieldset").parent().parent().show();
		$("input[data-field-name='NMCDrubchange']").closest(".column-container").show();
		$("div[data-related-field='NMCDrubchange']").closest(".column-container").show();
		$("div[data-related-field='emptyLabel']").closest(".column-container").show();
		$("input[data-field-name='cenasNDSchange']").prop('required', true);
		$("[data-related-field=cenasNDSchange]").addClass("label-required");
		$("textarea[data-field-name='reasonchangeprice']").prop('required', true);
		$("[data-related-field='reasonchangeprice']").addClass("label-required");
		$("input[data-field-name='cenasNoNDSchange']").prop('required', true);
		$("[data-related-field=cenasNoNDSchange]").addClass("label-required");
		$("input[data-field-name='NDS']").prop('required', true);
		$("[data-related-field=NDS]").addClass("label-required");
		HideReasonchangeprice();
		Summinrubchange();
		PriceRubChange.CalculateSummaChange(this);
	} else {
		$("[data-related-field='cenasNDSchange']").closest("fieldset").parent().parent().hide();
		$("input[data-field-name='NMCDrubchange']").closest(".column-container").hide();
		$("div[data-related-field='NMCDrubchange']").closest(".column-container").hide();
		$("div[data-related-field='emptyLabel']").closest(".column-container").hide();
		$("input[data-field-name='cenasNDSchange']").prop('required', false);
		$("[data-related-field=cenasNDSchange]").removeClass("label-required");
		$("textarea[data-field-name='reasonchangeprice']").prop('required', false);
		$("[data-related-field='reasonchangeprice']").removeClass("label-required");
		$("input[data-field-name='NDS']").prop('required', false);
		$("[data-related-field=NDS]").removeClass("label-required");
		$("input[data-field-name='ExportMSPReasonChangePrice']").prop('required', false);
		$("[data-related-field=ExportMSPReasonChangePrice]").removeClass("label-required");
		$("input[data-field-name='cenasNoNDSchange']").prop('required', false);
		$("[data-related-field=cenasNoNDSchange]").removeClass("label-required");
		Summinrubchange();
	}
	
	function HideReasonchangeprice() {
		var naimETP = $("input[name='naimETP']").val();
		
		 if (naimETP == 'АО "МСП-ЕЭТП"') {
			$("input[data-field-name='ExportMSPReasonChangePrice']").prop('required', true);
			$("[data-related-field=ExportMSPReasonChangePrice]").addClass("label-required");
			$("[data-related-field=ExportMSPReasonChangePrice]").closest(".column-container").show();
			$("input[data-field-name='ExportMSPReasonChangePrice']").closest(".column-container").show();
				if (ExportMSPReasonChangePrice.val() == 'Другое') {
					$("textarea[data-field-name='reasonchangeprice']").prop('required', true);
					$("[data-related-field='reasonchangeprice']").addClass("label-required");
					$("textarea[data-field-name='reasonchangeprice']").closest(".column-container").show();
					$("[data-related-field='reasonchangeprice']").closest(".column-container").show();
				} else {
					$("textarea[data-field-name='reasonchangeprice']").prop('required', false);
					$("[data-related-field='reasonchangeprice']").removeClass("label-required");
					$("textarea[data-field-name='reasonchangeprice']").closest(".column-container").hide();
					$("[data-related-field='reasonchangeprice']").closest(".column-container").hide();
					
				}
		 } else{
			$("input[data-field-name='ExportMSPReasonChangePrice']").prop('required', false);
			$("[data-related-field=ExportMSPReasonChangePrice]").removeClass("label-required");
			$("input[data-field-name='ExportMSPReasonChangePrice']").closest(".column-container").hide();
			$("[data-related-field=ExportMSPReasonChangePrice]").closest(".column-container").hide();
		 }	 
	}
	
	$("input[name='ExportMSPReasonChangePrice']").on('change', function(){
		if (ExportMSPReasonChangePrice.val() == 'Другое') {
			reasonchangeprice.val('');
		} else {
			reasonchangeprice.val($("input[name=ExportMSPReasonChangePrice]").val());// Копирую при изменении поля "Основание изменения цены договора"
		}		
		HideReasonchangeprice();
	});
	
}

var CopyChangePrice = function () {
	var cenasNDSdog = $("input[name='cenasNDSdog']");
	var NMCD = $("input[name='NMCD']");
	var changeprice = $("input[name='changeprice']");
	var cenasNDSchange = $("input[name='cenasNDSchange']");
	var cenasNoNDSchange = $("input[name='cenasNoNDSchange']");
	var NDS = $("input[name='NDS']");
	var Currency_kod = $("input[name='Currency_kod']");
	var Currency_kod_change = $("input[name='Currency_kod_change']");
	var Currency_change = $("input[name='Currency_change']");
	var Currency = $("input[name='Currency']");
	var Currency_dig_kod_change = $("input[name='Currency_dig_kod_change']");
	var Currency_dig_kod = $("input[name='Currency_dig_kod']");
	var curschange = $("input[name='curschange']");
	var curs = $("input[name='curs']");
	var dateCurschange = $("input[name='dateCurschange']");
	var dateCurs = $("input[name='dateCurs']");
	var reasonchangeprice = $("textarea[name='reasonchangeprice']");
	if ($(changeprice).is(":checked")) {
		Currency_kod_change.val(Currency_kod.val());
		Currency_change.val(Currency.val());
		Currency_dig_kod_change.val(Currency_dig_kod.val());
		// curschange.val(curs.val());
		// dateCurschange.val(dateCurs.val());
		$("input[name='Currency_change']").parent().find(".dict-display-field").val($("input[name='Currency']").parent().find(".dict-display-field").val());
	} else {
		cenasNDSchange.val("");
		cenasNoNDSchange.val("");
		//NDS.val("");
		Currency_kod_change.val("");
		Currency_change.val("");
		Currency_dig_kod_change.val("");
		curschange.val("");
		dateCurschange.val("");
		reasonchangeprice.val("");
		$("input[name=ExportMSPReasonChangePrice]").val("");
		$("input[data-field-name=ExportMSPReasonChangePrice]").val("");
		$("input[name='Currency_change']").parent().find(".dict-display-field").val("");
	}
}

$(document).on('change', "input[name='changeprice']", function (e) {
	CopyChangePrice();
	IzmeneniePriceEdit();
	PriceRubChange.CalculateSummaChange(this);
	Summinrubchange();
});

var changePriceView = function () {
	var flag = $("div[data-name='Изменение цены']").find("input[type='checkbox']");
	var valuta = $(".documentView-field-value[data-name='Валюта']").text(); 

	if ($(flag).attr("checked")) {
		$("div fieldset legend:contains('Изменение цены договора')").closest(".column-container").show();
		if (valuta != "Российский рубль") {
			$("div[data-name='Курс валюты изм']").closest(".column-container").show();
			$("div[data-name='Первоначальная цена в рублях(с НДС)']").closest(".column-container").show();
		} else {
			$("div[data-name='Курс валюты изм']").closest(".column-container").hide();
			$("div[data-name='Первоначальная цена в рублях(с НДС)']").closest(".column-container").hide();
		}
	}
	else {
		$("div fieldset legend:contains('Изменение цены договора')").closest(".column-container").hide();
	}

}

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

function ClearOrgPost() {
	let Tab = $("input[name*='multicontracts-supplier-']").length;
	let orgpost2 = $("input[name='orgpost2']");
	for (let i = 1; i <= Tab; i++) {
		if (i > 1) {
			orgpost2.clear();
		}
	}
}

var oneRowTableReq = function () {
	var hideDeleteButton = function () {
		var count = $("div[data-name='ItemTab'] div[data-rowkey]").length;
		if (count == 1) {
			$("div[data-name='ItemTab']").children().children("div[data-rowkey]").find(".table-remove-row-button").hide();
		} else {
			$("div[data-name='ItemTab']").children().children("div[data-rowkey]").find(".table-remove-row-button").show();
		}
	}

	hideDeleteButton();

	$("div[data-name='ItemTab']").on("onTableRowAdded", function (e) {
		hideDeleteButton();
		PositionCurrensyLogic(e);
	})
	$("div[data-name='ItemTab']").on('onTableRowRemoved', function (e) {
		hideDeleteButton();
		PositionCurrensyLogic(e);
	});

};

// Вызов функции при изменении валюты
$(document).on('change', "input[data-field-name*='ItemTab-PositionCurrencyKod-']", function (ChangeCurrensy) {	
	// Иначе функция при создании и взятии на редактировании вызывается столько раз, сколько строк в таблице
	if (document.readyState == 'complete') {
		PositionCurrensyLogic(ChangeCurrensy);
	}
});
// Вызов функции при изменении курса
$(document).on('change', "input[data-field-name*='ItemTab-PositionCurrency-']", function (ChangeCurrensy) {
	PositionCurrensyLogic(ChangeCurrensy);	
});
// Вызов функции при изменении цены за единицу
$(document).on('change', "input[data-field-name*='ItemTab-priceTax-']", function (ChangeCurrensy) {
	PositionCurrensyLogic(ChangeCurrensy);	
});

var PositionCurrensyLogic = function(ChangeCurrensy) {
	var CurrensyDogovor = $("input[name='Currency']").val();
	var Currency_dig_kod = $("input[name='Currency_dig_kod']").val();
	var Currency_kod = $("input[name='Currency_kod']").val();
	var TableRow = $("div[data-name='ItemTab'] div[data-rowkey]");
	var result = false;
		HideCurrensy(result); // Скрываю столбцы Цена за единицу в рублях и Курс
	var ArrayCurrency =  $("input[name*='ItemTab-PositionCurrencyName-']");
	// При изменении Валюты, обрабатываться будет только одна строка
	if (ChangeCurrensy != undefined){
		// ЕСли вызвов был при событии добавления новой строки
		if (ChangeCurrensy.handleObj.type == "onTableRowAdded"){
			TableRow = TableRow.last();
			var item2 = $("input[data-field-name*='ItemTab-PositionCurrency-"+TableRow.last().prevObject.prevObject.length+"']");
			item2.autoNumeric('update', {
				aSep: '',
				aDec: '.',
				vMin: '0.0000',
				vMax: "99999999999999999999999999999999999999999.9999",
				mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '4',
				wEmpty: '',
				mRound: 'B'
			});
			// ЕСли вызвов был при событии удаления строки
		} else if (ChangeCurrensy.handleObj.type == "onTableRowRemoved") {
			TableRow = $();
		} else {
			TableRow = $(ChangeCurrensy.currentTarget).closest("div[data-rowkey]");
		}
	}
		TableRow.each(function(index, value) {
			var PositionCurrency = $(value).children(".table-edit-columns").children().find("input[data-field-name*='ItemTab-PositionCurrencyKod-']");
			var PositionCurrencyKod = $(value).children(".table-edit-columns").children().find("input[name*='ItemTab-PositionCurrencyKod-']");
			var PositionCurrencyDigKod = $(value).children(".table-edit-columns").children().find("input[name*='ItemTab-PositionCurrencyDigKod-']");
			var PositionCurrencyName = $(value).children(".table-edit-columns").children().find("input[name*='ItemTab-PositionCurrencyName-']");
			var PositionCurrencyCourse = $(value).children(".table-edit-columns").children().find("input[data-field-name*='ItemTab-PositionCurrency-']"); //курс валют
			var PositionCurrencyPrice = $(value).children(".table-edit-columns").children().find("input[data-field-name*='ItemTab-PositionCurrencyPrice-']"); //цена за единицу в рублях
			var priceTax = $(value).children(".table-edit-columns").children().find("input[data-field-name*='ItemTab-priceTax-']"); //цена за единицу
			/* var NevCol = $(value).children(".table-edit-columns").children().find("input[data-field-name*='ItemTab-NevCol-']"); */
			
			PositionCurrencyCourse.prop('required', false); //курс валют
			PositionCurrencyCourse.prop('readonly', true); //курс валют		
			PositionCurrencyCourse.css({backgroundColor: 'whitesmoke'}); //курс валют		
			
			 if (!PositionCurrencyName.val()) {
				 PositionCurrency.val(CurrensyDogovor);
				 PositionCurrencyKod.val(Currency_kod);
				 PositionCurrencyDigKod.val(Currency_dig_kod);
				 PositionCurrencyName.val(CurrensyDogovor);
			 }
				 if (PositionCurrencyName.val() == 'Российский рубль') {
					 PositionCurrencyCourse.autoNumeric('wipe');
					 PositionCurrencyPrice.autoNumeric('wipe');			 
				 } else {
					PositionCurrencyCourse.prop('required', true); //курс валют
					PositionCurrencyCourse.prop('readonly', false); //курс валют
					PositionCurrencyCourse.css({backgroundColor: 'white'}); //курс валют
					/* HideCurrensy(result=true); */
					if (priceTax.val() && PositionCurrencyCourse.val() && PositionCurrencyName.val()) {
						//не работает в IE
						/* if (document.readyState == 'complete') {
							PositionCurrencyPrice.autoNumeric('set', PositionCurrencyCourse.autoNumeric('get')*registerPrice.autoNumeric('get'));
						} */
						$(document).ready(function() {
							PositionCurrencyPrice.autoNumeric('set', PositionCurrencyCourse.autoNumeric('get')*priceTax.autoNumeric('get'));
						})
					}
				 }
			
		})
	
	// Вызываем функцию, если валюта не Российский рубль
	ArrayCurrency.each(function(i, item) {
		if (this.defaultValue != 'Российский рубль') {
			HideCurrensy(result=true);
			return false; // выход из цикла при совпадении
		}
	})
	
	
	function HideCurrensy(result) {
		if (result == true) {
			$("div[data-name='ItemTab'] div[data-rowkey]").find("input[data-field-name*='ItemTab-PositionCurrencyPrice-']").closest(".table-edit-column").show();
			$("div[data-name='ItemTab'] div[data-rowkey]").find("input[data-field-name*='ItemTab-PositionCurrency-']").closest(".table-edit-column").show();
			$("div[data-name='ItemTab']").find("div .table-edit-column[title='Цена за единицу в рублях']").show();
			$("div[data-name='ItemTab']").find("div .table-edit-column[title='Курс валюты']").show();
		} else{
			$("div[data-name='ItemTab'] div[data-rowkey]").find("input[data-field-name*='ItemTab-PositionCurrencyPrice-']").closest(".table-edit-column").hide();
			$("div[data-name='ItemTab'] div[data-rowkey]").find("input[data-field-name*='ItemTab-PositionCurrency-']").closest(".table-edit-column").hide();
			$("div[data-name='ItemTab']").find("div .table-edit-column[title='Цена за единицу в рублях']").hide();
			$("div[data-name='ItemTab']").find("div .table-edit-column[title='Курс валюты']").hide();
		}	
	}
		
}

$(document).on('change', "input[data-field-name*='ItemTab-PurchType-']", function (e) {
	// Иначе функция при создании и взятии на редактировании вызывается столько раз, сколько строк в таблице
	if (document.readyState == 'complete') {
		var that = $(this);
		PositionCountryLogic(that);
	}
});

var PositionCountryLogic = function(that) {
	var TableRow = $("div[data-name='ItemTab'] div[data-rowkey]").find("input[data-field-name*='ItemTab-PurchType-']");
	// Изменять только ту строку, где был change
	if (that != undefined){
		TableRow = that;
	}
		TableRow.each(function(index, value) {
			var registerContruProduct = $(value).closest(".table-edit-column").siblings("div").find("input[data-field-name*='ItemTab-registerContruProduct-']");
			var registerContruProductcode = $(value).closest(".table-edit-column").siblings("div").find("input[name*='ItemTab-registerContruProduct-']");
			var registerContruProductName = $(value).closest(".table-edit-column").siblings("div").find("input[name*='ItemTab-registerContruProductName-']");
			var registerContruProductcode1 = $(value).closest(".table-edit-column").siblings("div").find("input[name*='registerContruProduct-registerContruProduct']"); //множественный выбор из справочника
			var registerContruProductName1 = $(value).closest(".table-edit-column").siblings("div").find("input[name*='registerContruProduct-ItemTabregisterContruProductName']"); //множественный выбор из справочника
			var countryManufacturer = $(value).closest(".table-edit-column").siblings("div").find("input[data-field-name*='ItemTab-countryManufacturerCode-']");
			var countryManufacturerCode = $(value).closest(".table-edit-column").siblings("div").find("input[name*='ItemTab-countryManufacturerCode-']");
			var countryManufacturerName = $(value).closest(".table-edit-column").siblings("div").find("input[name*='ItemTab-countryManufacturerName-']");
			var registerContruProductButton = $(value).closest(".table-edit-column").siblings("div").find("button[id='registerContruProduct']");
			var countryManufacturerButton = $(value).closest(".table-edit-column").siblings("div").find("button[id='countryManufacturerCode']");
			if ($(value).val() == 'Товар') {
				registerContruProduct.prop('required', true);
				registerContruProductButton.prop('disabled', false);
				countryManufacturerButton.prop('disabled', false);				
				/* registerContruProductButton.css({backgroundColor: 'white'});			
				countryManufacturerButton.css({backgroundColor: 'white'}); */				
			} else {
				registerContruProduct.prop('required', false);
				registerContruProduct.val('');
				registerContruProductcode.val('');
				registerContruProductName.val('');
				countryManufacturer.val('');
				countryManufacturerCode.val('');
				countryManufacturerName.val('');
				registerContruProductcode1.val('');
				registerContruProductName1.val('');
				registerContruProductButton.prop('disabled', true);
				countryManufacturerButton.prop('disabled', true);
				/* registerContruProductButton.css({backgroundColor: 'whitesmoke'});			
				countryManufacturerButton.css({backgroundColor: 'whitesmoke'});	 */		
			}
		})
}

var clearWiner = function(){
	var regstatus = $("input[name='regstatus']").val();
	var count = $("div[data-name='TableOrgpost1'] div[data-rowkey]").length;
	if (regstatus != 'Внесение изменений') {
		if (count > 1) {
			$("input[data-field-name='cenasNDSdog']").autoNumeric('wipe');
			$("input[data-field-name='NMCD']").autoNumeric('wipe');
			var fortextarea = ['orgpostdog_kod', 'FirmName', 'orgpostdogOKOPFName', 'dopinfo', 'orgpost2', 'osnEPName'];	
			var forinput = ['orgpost2Name', 'orgpostdogINN', 'orgpostdogKPP', 'orgpostdogOGRN', 'orgpostdogOKOPO', 'orgpostdogIdentNum', 'orgpostdogIdentNumAd', 'orgpostdogOKTMO', 'orgpostdog_kod', 'orgpostdog_kodName', 'orgpostdogOKOPF', 'datepostnauch',  'registerCountSNDS', 'registerCountNoNDS', 'dateContractFact',  'orgpostdogEmail', 'orgpostdogPhone', 'orgpostdogCountry', 'orgpostdogCountryCode', 'orgpostdogRegion', 'orgpostdogSity', 'orgpostdoglocality', 'orgpostdogDistrict', 'orgpostdogPostCode', 'orgpostdogStreet', 'orgpostdogHouse', 'orgpostdogCorpus', 'orgpostdogApartment', 'orgpost2', 'status'];
			forinput.forEach(function (item, i, forinput) {
				$("input[name='" + item + "']").val('');
				$("input[name='" + item + "']").attr('value', '');
			});

			var forinputNer = ['CMP', 'nerezdog'];
			forinputNer.forEach(function (item, i, forinput) {		
				$("input[name='" + item + "']").prop('checked', false);			
			});
			fortextarea.forEach(function(item, i, forinput) {
				$("textarea[data-field-name='"+item+"']").text('');
				$("textarea[data-field-name='"+item+"']").val('');
			});
		}
	}
}

var EditMspfieldHideLogic = function() {
	var naimETP = $("input[name='naimETP']").val();
	var ExportMSPProcedureConclusionCode = $("input[data-field-name='ExportMSPProcedureConclusionCode']"); //Порядок заключения договора код
	var ExportMSPProcedureConclusionName = $("input[name='ExportMSPProcedureConclusionName']"); //Порядок заключения договора наименование
	var ExportMSPSecurityRequirement = $("input[data-field-name='ExportMSPSecurityRequirement']"); //Требование к обеспечению исполнения договора
	var ExportMSPIndicatedWinner = $("input[data-field-name='ExportMSPIndicatedWinner']"); //  Чекбокс Информация о ТРУ указывается победителем
	
	if (naimETP == 'АО "МСП-ЕЭТП"') {
		ExportMSPProcedureConclusionCode.closest('.column-container').show();
		ExportMSPProcedureConclusionCode.prop('required', true);
		$("div.documentView-field-label[data-related-field='ExportMSPProcedureConclusionCode']").addClass("label-required");
		ExportMSPSecurityRequirement.closest('.column-container').show();
		ExportMSPSecurityRequirement.prop('required', true);
		$("div.documentView-field-label[data-related-field='ExportMSPSecurityRequirement']").addClass("label-required");
		ExportMSPIndicatedWinner.closest('.column-container').show();
	} else {
		ExportMSPProcedureConclusionCode.closest('.column-container').hide();
		ExportMSPSecurityRequirement.closest('.column-container').hide();
		ExportMSPIndicatedWinner.closest('.column-container').hide();
		ExportMSPSecurityRequirement.prop('required', false);
		$("div.documentView-field-label[data-related-field='ExportMSPSecurityRequirement']").removeClass("label-required");
		ExportMSPProcedureConclusionCode.prop('required', false);
		$("div.documentView-field-label[data-related-field='ExportMSPProcedureConclusionCode']").removeClass("label-required");
	}
}

var ViewMspfieldHideLogic = function() {
	
	var naimETP = $("div.documentView-field-value[data-name='Наименование ЭТП']").attr('title');
		if (naimETP != 'АО "МСП-ЕЭТП"') {
			$("div.documentView-field-value[data-name='Порядок заключения договора']").closest('.column-container').hide()
			$("div.documentView-field-value[data-name='Требование к обеспечению исполнения договора']").closest('.column-container').hide()
			$("div.documentView-field-value[data-name='Информация о ТРУ указывается победителем']").closest('.column-container').hide()
		}
}

// Логика отображения поля "Наименование договора на ЭТП"
var HideNameEETPOnView = function() {
	var DogovorNameOnEETP = $(".documentView-field-value[data-name='Наименование договора на ЭТП']");
	var Url = $(".documentView-field-value[data-name='Ссылка на торговой площадке']");
	var UrlOnEIS = $(".documentView-field-value[data-name='Ссылка на документ в ЕИС-е']");
	if (!DogovorNameOnEETP.attr('title')) {
		DogovorNameOnEETP.closest('.column-container').hide();
	}
	if (!Url.attr('title')){
		Url.closest('.column-container').hide();
	}
	if (!UrlOnEIS.attr('title')){
		UrlOnEIS.closest('.column-container').hide();
	}
}

function customDropDownHandle(){
	
	$(".document-view-actions").find("a:contains('Отправить на ЭТП')").each(function() { 
		var IDETP = $(".documentView-field-value[data-name='ИД ЭТП']").attr("title")
		if (IDETP=='1'){
			var button = $(this);
			var onclickFunc = button.attr('onclick');		
			button.attr('onclick', 'return false;');
			
			button.click(function(ev) {
				var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
				var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
		
				var getProject = $.grep(dxDataGridDocs._store._array, function(item){
					if(item.Fields.AttachmentPublication == "Публикуется" && item.Fields.VidDoc == "Проект договора"){
						return item.Fields.AttachmentPublication;
					}
				});

				if(getProject.length == 0){
					showCommonErrors('Для отправки договора на ЭТП необходимо приложить файл категории "Проект договора" с признаком "Публикуется" в формате ".docx" или ".pdf"');
				}
				else{
					getProject = $.grep(dxDataGridDocs._store._array, function(item){
						if((item.Fields.AttachmentTitle.indexOf(".pdf") != -1 && item.Fields.AttachmentPublication == "Публикуется" && item.Fields.VidDoc == "Проект договора") || (item.Fields.AttachmentTitle.indexOf(".docx") != -1 && item.Fields.AttachmentPublication == "Публикуется" && item.Fields.VidDoc == "Проект договора") || ((item.Fields.AttachmentTitle.indexOf(".pdf") != -1 || item.Fields.AttachmentTitle.indexOf(".docx") != -1) && item.Fields.AttachmentPublication == "Публикуется" && item.Fields.VidDoc == "Печатная форма договора")){
							return item.Fields.AttachmentPublication;
						}
					});
					if(getProject.length == 0){
						showCommonErrors('Для отправки договора на ЭТП необходимо приложить файл категории "Печатная форма договора" с признаком "Публикуется" в формате ".docx" или ".pdf"');
					}
					else{
						eval(onclickFunc);
					}
				}
			});
		} else {
			var button = $(this);
			var onclickFunc = button.attr('onclick');
			button.attr('onclick', 'return false;');
			button.click(function(ev) {
				/* var countPublic = 0;	
				var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
				var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
				var getNameAndDiscObj = $.grep(dxDataGridDocs._items, function(item){
					if (item.Fields.AttachmentPublication == "Публикуется" && item.Fields.AttachmentDocType == "Проект договора"){
						countPublic++
					}
				});
					
				if( countPublic == 0 ){
					var errorMessage = 'Для отправки на ЭТП необходимо присоединить файлы в категорию "Документация" с видом документа "Проект договора" и с признаком публикации - "Публикуется"';
					showCommonErrors(errorMessage);
					return;
					} */
				var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
				var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
		
				var getProject = $.grep(dxDataGridDocs._store._array, function(item){
					if(item.Fields.AttachmentPublication == "Публикуется" && item.Fields.AttachmentDocType == "Проект договора"){
						return item.Fields.AttachmentPublication;
					}
				});
				
				var datepodpkartdog = $("div.documentView-field-value[data-name='Cрок подписания карточки договора Участником']").attr('title');
				var today=new Date()
					var day=today.getDate();
					if (day < 10) {
						//day = '0' + day;
					}
					var month=(today.getMonth()+1);
					if (month < 10) {
						month = '0' + month;
					}
					var year=today.getFullYear();
					var today1= day+"."+month+"."+year;
					let today1Spec= year+"."+month+"."+day; //спец создана переменная, чтоб использовать в условии ниже new Date 
					today1Spec = new Date(today1Spec);
				
				function parseDateTime(date) { 
					var dt = date.split(' ');
					var d = dt[0];
					// var t = dt[1];
					var dprovision = d.split('.');
					return new Date(dprovision[2], dprovision[1]-1, dprovision[0]); // берем только дату без времени
				}

				if (datepodpkartdog) { // Cрок подписания карточки договора Участником не пустое поле
					
					var datepodpkartdog1 = parseDateTime(datepodpkartdog);
					if (today1Spec > datepodpkartdog1){
					showCommonErrors('"Cрок подписания карточки договора Участником" не может быть в прошлом.');		
					return;
					}
				}

				if(getProject.length == 0){
					showCommonErrors('Для отправки на ЭТП необходимо присоединить файлы в категорию "Документация" с видом документа "Проект договора" и с признаком публикации - "Публикуется"');
				}
					else{
					eval(onclickFunc);
				}

			});
		}
		
	});
	
}

function changeHideRegEdit(){
	var arendaNed=$("input[data-field-name='arendaNed']");
	var sekretKPC=$("input[name='sekretKPC']");
	if($(arendaNed).is(":checked") ){
		$("li:has(:contains('КПЦ'))").show();
		sekretKPC.prop("required", true);
		sekretKPC.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=sekretKPC]").addClass("label-required");
		
	}
	else{
		$("li:has(:contains('КПЦ'))").hide();
	}
}

function CheckDocumentSave() {
	var form = $("form");
	form.on("beforeSubmit", function (args) {
		var flag = true;
		var errorMessage; // Сообщение об ошибке
		var ItemTabRows = $("div[data-name='ItemTab'] [data-rowkey]" );
		var cenasNDSdog = $("input[name='cenasNDSdog']");
		var naimETPID = $("input[name='naimETPID']").val(); // ИД площадки
		var AgreedUprav = $("input[data-field-name='AgreedUprav']"); // признак того, что ППЗ будет согласовать у руководителя руководителя управления
			// Проверка цены договора на совпадение с суммой таблицы позиций
			if (flag) {
				//проверка для СберАСТ
				if (naimETPID == '2') {
					if (ItemTabRows.length > 0) {
						var RowsSumm = 0;
						ItemTabRows.each(function(i, item){
							var registerCount = $(item).find("input[name*='-registerCount']").autoNumeric('get');
							var priceTax = $(item).find("input[name*='-priceTax']").autoNumeric('get');
							RowsSumm = parseFloat(RowsSumm) + (parseFloat(registerCount) * parseFloat(priceTax));
						}) 
						RowsSumm = RowsSumm.toFixed(2)
						
						if (parseFloat(cenasNDSdog.autoNumeric('get')) != parseFloat(RowsSumm)) {
							flag = false;
							errorMessage = 'Сумма цен позиций ('+RowsSumm+') должна быть равна цене договора ('+cenasNDSdog.autoNumeric('get')+')';
							ShowErrors(errorMessage);
						}
						
						
					}
				}
			}

		function ShowErrors(errorMessage) {
			showCommonErrors(errorMessage);
			$(".loading-image.loading-image-shown").hide();
			$(".btn-toolbar > .btn").attr("disabled", false);
			form.find("[type='submit']").attr("disabled", false);		
			throw new Error("beforeSave");
		}
		
		/* Если ничего не упало то отображаем гифку загрузки */
		if (flag){
			$(".loading-image.loading-image-shown").show();
		}
	})
	
}

var validatelongTerm = function() {
	var longTermcategorie = $("#editView input[name='longTermcategorie']");
	var DataLongTerm = $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))"); 
	var rowsplanPayment  =  $("#editView [data-name=planPayment] [data-rowkey]");
	if (!longTermcategorie.is(":checked")) {
		DataLongTerm.hide();
		rowsplanPayment.each(function(index, element) {
			removeTableRow(element);
		});	
	} 
	else {
		DataLongTerm.show();
	};
}

var hidetablelongTermreg = function() {	
	var flag = $("input[data-field-name='longTermcategorie']");
	var DataLongTerm= $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))"); 
	
	flag.change(function() {
		var rowsplanPayment  =  $("[data-name=planPayment] [data-rowkey]");
        if ($(this).is(":checked")) {
			DataLongTerm.show();
		} 
		else {
			DataLongTerm.hide();	
			var rowsplanPayment  =  $("#editView [data-name=planPayment] [data-rowkey]");
			rowsplanPayment.each(function(index, element) {
				removeTableRow(element);
			});	
		}
	});
	flag.change ();
}
//блок Информация об объемах оплаты долгосрочного договора на редактирование
var hidetablelongTermedit = function() {
	
	var flag = $("#editView input[name='longTermcategorie']");
	var DataLongTerm = $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))"); 
	var rowsplanPayment  =  $("#editView [data-name=planPayment] [data-rowkey]");
	
	flag.change(function() {
        if ($(this).is(":checked")) {
			DataLongTerm.show();
		} 
		else {
			DataLongTerm.hide();
			rowsplanPayment.each(function(index, element) {
				removeTableRow(element);
			});		
		}
	});	
}

//блок Информация об объемах оплаты долгосрочного договора на просмотр
var hidetablelongTermview = function() {
	var flag = $("div[data-name='Долгосрочный договор']").find("input[type='checkbox']");
	var DataLongTerm= $("li:has(:contains('Информация об  объемах оплаты долгосрочного договора'))");
	if (!$(flag).attr("checked")) {
        DataLongTerm.hide();
	} else {
        DataLongTerm.show();
	}
}

var checklongtermcontract = function () {
    var DataLongTerm= $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))");
    var datenachispdog = $("input[name='datenachispdog']");	
	var dateokonispdog = $("input[name='dateokonispdog']");	
	var initialmaximumprice = $("input[name='cenasNDSdog']");
	var longTermcategorie = $("input[name='longTermcategorie']");
	var columnsummaPayment = $("input[data-field-name*='planPayment-summaPayment']");
	initialmaximumprice.change( function() {
	  SummaOsnTest.Calculate(columnsummaPayment);	  
	});	   
	datenachispdog.closest(".input-group.date").on("dp.change", 
	function() {
		var datenachispdog = $("input[name='datenachispdog']");	
		functionchagedate(DataLongTerm, datenachispdog,dateokonispdog, longTermcategorie);	
		if (initialmaximumprice.val()) {
			SummaOsnTest.Calculate(columnsummaPayment);	
		};  
	});
	dateokonispdog.closest(".input-group.date").on("dp.change", 
	function() {
		var dateokonispdog = $("input[name='dateokonispdog']");	
		if(datenachispdog.val()){
			functionchagedate(DataLongTerm, datenachispdog,dateokonispdog, longTermcategorie);
		}
		if (initialmaximumprice.val()) { 
			SummaOsnTest.Calculate(columnsummaPayment);
		};
	});
}

var validatesumcontractpay = function(columnsummaPayment,columnsummaPaymentSMP) {
 var kol = $("div[data-name='planPayment'] div[data-rowkey]").length;
	if (kol>0) {
      $(document).on('change', "input[data-field-name*='planPayment-summaPayment']", function (e) {
      SummaOsnTest.Calculate(this);
	  SumDolgRub.CalculateSumma(this);
	  Alloplatainrub();
      });
    };	
}

$(document).on('change', "input[data-field-name*='planPayment-summaPayment']", function (e) {
    SummaOsnTest.Calculate(this);
	SumDolgRub.CalculateSumma(this);
	Alloplatainrub();
	summary();
}); 

var SummaOsnTest = {
	Calculate: function () {
		var ps1 = $("input[data-field-name*='planPayment-summaPayment']").closest("div.table-content");
		var summ = 0;
		ps1.children("div.table-edit-row").each(function() {
			var elemen = $(this).find("input[data-field-name*='planPayment-summaPayment']")
			if($(elemen).length){
				var s1 = elemen.val();
				var Price = s1.replace(/ /g, '').replace(/,/g, '.')*1; 
				var val =  parseFloat(Price ? Price : 0);
				summ = summ + val;
			}
		}); 
		if( (summ) || (summ==0) ){
			$("input[name='Alloplata']").autoNumeric('set', summ);
		}
		if (($("input[name='cenasNDSdog']").val()) && summ != 0){
			var beginmaxprice = $("input[name='cenasNDSdog']").autoNumeric('get');
		};
	}
}

var functionchagedate = function(DataLongTerm, datenachispdog, dateokonispdog, longTermcategorie) {
    if ((datenachispdog.val()) && (dateokonispdog.val())) {
	    var year1 = getyear(datenachispdog.val());
        var year2 = getyear(dateokonispdog.val());	      
		if (year1 < year2) { 
			longTermcategorie.prop('checked', true);
			summary();
			DataLongTerm.show(); 
			var end = year2-year1+1; 
			if (end!=$("[data-name=planPayment] [data-rowkey]").length) {
				deleterowtable($("[data-name=planPayment] [data-rowkey]"));		
				$("div[data-name='planPayment'] div.table-add-row-button").hide();	
				$("div[data-name='planPayment'] div.table-row-actions").hide();	 
				for (var i=1;i<=end;i++) {
				   var plus = year1 + i - 1;
				   $("div[data-name='planPayment']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
				   $("input[name='planPayment-yearPayment"+"-"+i+"']").val(plus);
				};
			}
		} 
		else {
			longTermcategorie.prop('checked', false);
			summary();
			$("input[name='Alloplata']").autoNumeric('set', '0');
			hidetablecontract(DataLongTerm,$("div[data-name=planPayment] [data-rowkey]"));
		};			  
	}
}

// функция скрытия блока, удаления строк из таблицы Планируемые платежи, Планируемые платежи МСП
var hidetablecontract = function (block, planpay) {
    planpay.each(function(index, element) {
	removeTableRow(element);});	
	block.hide();	
}  

// функция преобразования даты, выделение года
var getyear = function(date) {
    var dateformat = moment(date, "DD.MM.YYYY");
	var year = dateformat.year();	
    return year		
}
// функция предварительного удаления строк из таблиц 
var deleterowtable = function(table) {
	table.each(function(index, element) {
		removeTableRow(element);
	}); 
}

var checklongtermcontractedit = function () {
    var DataLongTerm= $("li:has(:contains('Информация об объемах оплаты долгосрочного договора'))");
    var datenachispdog = $("#editView input[name='datenachispdog']");	
	var dateokonispdog = $("#editView input[name='dateokonispdog']");	
	var initialmaximumprice = $("#editView input[name='cenasNDSdog']");
	var longTermcategorie = $("#editView input[name='longTermcategorie']");
	var columnsummaPayment = $("input[data-field-name*='planPayment-summaPayment']");	  
	initialmaximumprice.change( function() {
		SummaOsnTest.Calculate(columnsummaPayment);	     
	});	   
	datenachispdog.closest(".input-group.date").on("dp.change", 
	function() {
		var datenachispdog = $("#editView input[name='datenachispdog']");
		functionchagedate(DataLongTerm, datenachispdog,dateokonispdog, longTermcategorie);	
		if (initialmaximumprice.val()) {
			SummaOsnTest.Calculate(columnsummaPayment);	
		}; 
	});
	dateokonispdog.closest(".input-group.date").on("dp.change", 
	function() {
		var dateokonispdog = $("#editView input[name='dateokonispdog']");
		functionchagedate(DataLongTerm, datenachispdog,dateokonispdog, longTermcategorie);	
		if (initialmaximumprice.val()) { 
			$("input[data-field-name='Alloplata']").autoNumeric('set','0');
			SummaOsnTest.Calculate(columnsummaPayment);
			$("input[data-field-name='Alloplatainrub']").autoNumeric('set','0');
			Alloplatainrub();
		};
	});
}

var Alloplatainrub = function() {
	var valuta = $("input[name='Currency_kod']").val();
	var Alloplatainrub = $("input[name='Alloplatainrub']");
	var curs_dolg = $("input[name='curs']").val();
	var Alloplata = $("input[name='Alloplata']").autoNumeric('get');
	var flag = $("input[name='longTermcategorie']");
	if(valuta == 'RUB' && !flag.is(":checked")){
		Alloplatainrub.autoNumeric('set', '0.00')
	}
	else{
		Alloplatainrub.autoNumeric('set', curs_dolg*Alloplata)
	}
}

var SumDolgRub = {
	CalculateSumma: function (obj) {
		var table = $("input[data-field-name*='planPayment-yearPayment']").closest("div.table-content");
		var curs = $("input[name='curs']");
		var flag = $("input[name='Currency_kod']").val();
		let spzak=$("input[name='registerSpZakup']").val()
		if (flag !== "RUB") {
			table.find("div.table-edit-row[data-rowkey]").each(function () {
				var elem1 = $(this).find("input[data-field-name^='planPayment-summaPayment-']")
				var elem2 = $(this).find("input[data-field-name^='planPayment-summaPaymentRub-']")
				
				if (($(elem1).val() != "") && ($(curs).val() != "")) {
					var val1 = elem1.autoNumeric('get')*1;
					//var val2 = curs_dolg.autoNumeric('get')*1;
					var val2 = curs.val()*1;
					var val3 = val1 * val2					
					elem2.autoNumeric('set', val3);
				}
			});
		}
	}
}

var valutaDolgView = function() {    
	var flag=$(".documentView-field-value[data-name='Валюта']").text();
	if (flag!=="Российский рубль") {
		$("div[data-name='Объем оплаты за все года в рублях']").show();
		$('span:contains(Сумма платежа в рублевом эквиваленте)').parent().show();
		$("div[title='Сумма платежа в рублевом эквиваленте']").show();
	} else {
		$("div[data-name='Объем оплаты за все года в рублях']").hide();
		$('span:contains(Сумма платежа в рублевом эквиваленте)').parent().hide();
		$("div[title='Сумма платежа в рублевом эквиваленте']").hide();
		gridReady ("|Document|Информация_об_объемах_оплаты_долгосрочного_договора|Планируемые_платежи").then(function (grid) {
			hideColumnByCaptionName(grid, "Сумма платежа в рублевом эквиваленте");
		})
	}
}

var valutaDolg = function() {    
	var flag=$("input[name='Currency_kod']").val();
	if (flag!=="RUB") {
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").show();
		$("div[title='Сумма платежа в рублевом эквиваленте']").show();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', true);
		$("input[data-field-name='Alloplatainrub']").show();
		$("div[data-related-field='Alloplatainrub']").show();
	} else {
		$("div[title='Сумма платежа в рублевом эквиваленте']").hide();
		$("input[data-field-name*='planPayment-summaPaymentRub']").prop('required', false);
		$("input[data-field-name*='planPayment-summaPaymentRub']").closest(".table-edit-column").hide();
		$("input[data-field-name='Alloplatainrub']").hide();
		$("div[data-related-field='Alloplatainrub']").hide();
	}
}

var EETPLogicOnEdit = function () {
	var naimETP = $("input[name='naimETP']").val();
	var zakelform = $("input[data-field-name='zakelform']"); // Закупка осуществлена в электронной форме
	
	// По Умолчанию скрваю поля и  вкладки  
	// Начало
	$("li:has(:contains('Дополнительная информация'))").hide();
	LegendAndNextEmptyRowHide(['Дополнительная информация о ТРУ']);
	
	// Конец
	
	
	if (naimETP == 'АО "Сбербанк - АСТ"') {
		$("li:has(:contains('Дополнительная информация'))").show();
		LegendAndEmptyNextRowShow(['Дополнительная информация о ТРУ']);
		filedShowAndRequired(['ContractPositionAllowEditing', 'BuForOOSPlacerCode', 'ContractExecution']); // отобразить и сделать обязательным
		
		if (zakelform.is(':checked')) {
			filedShowAndRequired(['ContractPlanDate']); // отобразить и сделать обязательным
		}
	}
}

var EETPLogicOnView = function() {
	var naimETP = $("div.documentView-field-value[data-name='Наименование ЭТП']").attr('title');
	if (naimETP != 'АО "Сбербанк - АСТ"') {
		LegendAndNextEmptyRowHide(['Дополнительная информация о ТРУ']);
		$("li:has(:contains('Дополнительная информация'))").hide();
	}
	HideIfEmptyOnView(['Дата последнего обновления']);
}

function LegendAndPrevEmptyRowHide(Arr) {
	
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.hide();
		
		if ($(legend).closest(".row-container").length >0) {
			$(legend).closest(".row-container").prev().hide();
		} else {
			$(legend).prev().hide();
		}
	});	
}

function LegendAndNextEmptyRowHide(Arr) {
	
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.hide();
		
		if ($(legend).closest(".row-container").length >0) {
			$(legend).closest(".row-container").next().hide();
		} else {
			$(legend).next().hide();
		}
		
		
	});	
}

function LegendAndEmptyPrevRowShow(Arr) {
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.show();
		$(legend).closest(".row-container").prev().show();
		
	});	
}

function LegendAndEmptyNextRowShow(Arr) {
	Arr.forEach(function(item, i) {
		var legend = $($("div fieldset legend:contains('"+item+"')")[0]).closest(".column-container");
		legend.show();
		$(legend).closest(".row-container").next().show();
		
	});	
}

// отображение полей
function filedShow(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').show();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
	});
}

//отобразить и сделать обязательным
function filedShowAndRequired (Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			$("[data-field-name='"+item+"']").prop('required', true);
			$("div.documentView-field-label[data-related-field='"+item+"']").addClass('label-required');
			$("[data-field-name='"+item+"']").closest('.column-container').show();
			$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
		})
	}
}

// скрыть на View если пусто
function HideIfEmptyOnView(Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			var filed = $("div.documentView-field-value[data-name='"+item+"']");
			
			if (!filed.attr('title')) {
				filed.closest('.column-container').hide();
			}
		})
	}
}

//отобразить и сделать необязательным
function filedNotRequired (Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			$("[data-field-name='"+item+"']").prop('required', false);
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
		})
	}
}

// скрываем поля
function filedHideAndNotRequired(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').hide();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide();
		$("[data-field-name='"+item+"']").prop('required', false);
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
	});
}

function ViewfiledHide(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
	});
}

function notpulicView(){
	var notpulic = $(".documentView-field-value[data-name='Не публиковать в ЕИС']").attr("title");
	if (notpulic=="1") {
		ViewfiledHide(['Номер сведений о договоре в ЕИС', 'Фактическая дата размещения', 'Реестровый номер договора', 'Наименование ЭТП', 'Номер лота в заявке', 'Номер заявки в ЕИС']);
	}
}

function EPView(){
	var flag = $(".documentView-field-value[data-name='Способ закупки']").attr("title");
	if (flag.indexOf("у единственного") != -1 ) {
		ViewfiledHide(['Наименование ЭТП', 'Номер лота в заявке', 'Номер заявки в ЕИС']);
	}
}

scopes.onRegister(editreg);
scopes.onRegister(summary);
scopes.onRegister(validatesubcontractorsreg);
scopes.onRegister(hideblockchangeedit);
scopes.onRegister(Summinrub);
scopes.onRegister(filterWorgpostdogINNersDic);
scopes.onRegister(osnEP);
scopes.onRegister(Izmen);
scopes.onRegister(contrAg);
scopes.onRegister(IzmeneniePriceEdit);
scopes.onRegister(ClearOrgPost);
scopes.onRegister(oneRowTableReq);
scopes.onRegister(PositionCurrensyLogic);
scopes.onRegister(PositionCountryLogic);
scopes.onRegister(clearWiner);
scopes.onRegister(EditMspfieldHideLogic);
scopes.onRegister(changeHideRegEdit);
scopes.onRegister(CheckDocumentSave);
scopes.onRegister(hidetablelongTermreg);
scopes.onRegister(checklongtermcontract);
scopes.onRegister(valutaDolg);
scopes.onRegister(EETPLogicOnEdit);

scopes.onEdit(editreg);
scopes.onEdit(contrAg);
scopes.onEdit(Izmen);
scopes.onEdit(summary);
scopes.onEdit(validatesubcontractorsedit);
scopes.onEdit(hideblockchangeedit);
//scopes.onEdit(CurrencyEdit);
scopes.onEdit(Summinrub);
scopes.onEdit(osnEP);
scopes.onEdit(filterWorgpostdogINNersDic);
scopes.onEdit(IzmeneniePriceEdit);
scopes.onEdit(oneRowTableReq);
scopes.onEdit(PositionCurrensyLogic);
scopes.onEdit(PositionCountryLogic);
scopes.onEdit(EditMspfieldHideLogic);
scopes.onEdit(changeHideRegEdit);
scopes.onEdit(CheckDocumentSave);
scopes.onEdit(checklongtermcontract);
scopes.onEdit(hidetablelongTermedit);
scopes.onEdit(checklongtermcontractedit);
scopes.onEdit(validatelongTerm);
scopes.onEdit(valutaDolg);
scopes.onEdit(EETPLogicOnEdit);
	
scopes.onView(hideblockchangeview);
scopes.onView(HideNameEETPOnView);
scopes.onView(validatesubcontractorsview);
scopes.onView(view_hide);
scopes.onView(ValutaView);
//scopes.onView(IspolnenieTableView);
scopes.onView(changePriceView);
scopes.onView(customDropDownHandle);
scopes.onView(ViewMspfieldHideLogic);
scopes.onView(hidetablelongTermview);
scopes.onView(valutaDolgView);
scopes.onView(EETPLogicOnView);
scopes.onView(notpulicView);
scopes.onView(EPView);