function commonFunc() {
	$("input[data-field-name='naimETP']").hide()
	$("input[data-field-name='formTorgCode']").hide()
	$("textarea[data-field-name='registerOPos']").css("height", '70px')
	$("textarea[data-field-name='registerPlasePos']").css("height", '70px')
	$("textarea[data-field-name='registerUslPos']").css("height", '70px')
}
commonFunc()

function checkkrit() {
	let krit = $("input[name='krit']");
	krit.prop('checked', false);
}
checkkrit();


RequirednameETP();
$("input[data-field-name='NMK']").hide();
$("[data-related-field=formula]").hide();
$("[data-related-field=NMK]").hide();
$("textarea[data-field-name='formula']").hide();
$("input[data-field-name='cened']").hide();
$("[data-related-field=cened]").hide();

$("input[data-field-name='cened']").closest(".column-container.col-xs-4").removeClass("col-xs-4").addClass("col-xs-6")
$("input[data-field-name='NMK']").closest(".column-container.col-xs-4").removeClass("col-xs-4").addClass("col-xs-6")
$("textarea[data-field-name='formula']").closest(".column-container.col-xs-4").removeClass("col-xs-4").addClass("col-xs-6")

function RequirednameETP() {
	var naimETP = $("input[name='naimETP']").val();
	var ETPArr = ['АО "ЕЭТП"', 'АО "МСП-ЕЭТП"', 'АО "Сбербанк - АСТ"'];
	if (ETPArr.indexOf(naimETP) > -1)  {
			$("input[data-field-name='Kodcen']").prop("required", true);
			$("[data-related-field=Kodcen]").addClass("label-required");
			$("textarea[data-field-name='registerPlasePos']").prop("required", true);
			$("[data-related-field=registerPlasePos]").addClass("label-required");
	}
}

var Svedcen = function() { 
	let naimETP = $("input[name='naimETP']").val();
	var Table = $("div[data-name='ItemTab']");
	var flag = $("input[name='Kodcen']").val();
	Table.find('.table-add-row-button').closest('.table-edit-column').hide();
	Table.find('.table-remove-row-button').closest('.table-edit-column').hide();
		if (flag=='2') {
			$("textarea[data-field-name='formula']").css("height", '70px')
			$("textarea[data-field-name='formula']").closest(".row-container").show()
			$("textarea[data-field-name='formula']").closest(".column-container").show();
			$("textarea[data-field-name='formula']").show();
			$("[data-related-field=formula]").show();
			$("textarea[data-field-name='formula']").prop("required", true);
			$("textarea[data-field-name='formula']").prop("readonly", false);
			$("[data-related-field=formula]").addClass("label-required");
			$("input[name='NMK']").autoNumeric('wipe');
			$("input[data-field-name='NMK']").hide();
			$("[data-related-field=NMK]").hide();
			$("input[data-field-name='NMK']").prop("required", false);
			$("[data-related-field=NMK]").removeClass("label-required");
			$("input[data-field-name='NMK']").closest(".column-container").hide();
			
			$("input[name='cened']").autoNumeric('wipe');
			$("input[data-field-name='cened']").hide();
			$("[data-related-field=cened]").hide();
			$("input[data-field-name='cened']").prop("required", false);
			$("[data-related-field=cened]").removeClass("label-required");
			$("input[data-field-name='cened']").closest(".column-container").hide();
			$("input[data-field-name='TorgEd']").closest(".column-container").hide();
			$("[data-related-field=TorgEd]").closest(".column-container").hide();
			$("input[name='TorgEd']").prop('checked', false);
			Table.closest('.row-container').hide();
			$("input[data-field-name*='ItemTab-priceTaxTRU-']").prop("required", false);
			$("input[data-field-name*='ItemTab-priceTaxTRU-']").autoNumeric('wipe');
		} else if (flag=='3')  {
			if (naimETP == 'АО "ЕЭТП"' || naimETP == 'АО "МСП-ЕЭТП"')  
			{ 
				$("input[data-field-name='NMK']").prop("required", false);
				$("input[data-field-name='NMK']").prop("readonly", false);
				$("[data-related-field=NMK]").removeClass("label-required");
				$("input[data-field-name='NMK']").closest(".row-container").hide()
				$("input[data-field-name='NMK']").closest(".column-container").hide()
				$("input[data-field-name='NMK']").hide();
				$("[data-related-field=NMK]").hide();
				
				/* $("input[data-field-name='cened']").closest(".row-container").show()
				$("input[data-field-name='cened']").closest(".column-container").show()
				$("input[data-field-name='cened']").show();
				$("[data-related-field=cened]").show();
				$("input[data-field-name='cened']").prop("required", true);
				$("[data-related-field=cened]").addClass("label-required"); */
			}
			else
			{	
				$("input[data-field-name='cened']").prop("required", false);
				$("input[data-field-name='cened']").prop("readonly", false);
				$("[data-related-field=cened]").removeClass("label-required");
				$("input[data-field-name='cened']").closest(".row-container").hide()
				$("input[data-field-name='cened']").closest(".column-container").hide()
				$("input[data-field-name='cened']").hide();
				$("[data-related-field=cened]").hide();
				
				/* $("input[data-field-name='NMK']").closest(".row-container").show()
				$("input[data-field-name='NMK']").closest(".column-container").show()
				$("input[data-field-name='NMK']").show();
				$("[data-related-field=NMK]").show();
				$("input[data-field-name='NMK']").prop("required", true);
				$("input[data-field-name='NMK']").prop("readonly", true);
				$("[data-related-field=NMK]").addClass("label-required"); */
			}	
			/* $("input[data-field-name='TorgEd']").closest(".column-container").show();
			$("[data-related-field=TorgEd]").closest(".column-container").show();
			$("input[name='TorgEd']").prop('checked', true); */
			$("input[name='formula']").val('');
			$("textarea[data-field-name='formula']").hide();
			$("[data-related-field=formula]").hide();
			$("textarea[data-field-name='formula']").prop("required", false);
			$("[data-related-field=formula]").removeClass("label-required");
			$("textarea[data-field-name='formula']").closest(".column-container").hide();
			/* Table.closest('.row-container').show();
			Table.find("[data-rowkey]").find(".table-edit-columns").css("cssText", "margin-right: 0px; padding-right: 0px") // обнуляю отступы у строки
			Table.closest('.table-edit-wrapper').css("cssText", "padding-bottom: 0px;") // обнуляю отступы у таблицы
			Table.css("overflow","hidden"); // Убираю скролл у таблицы
			$("input[data-field-name*='ItemTab-priceTaxTRU-']").prop("required", true);
			initAutonumeric(); // вызов Autonumeric перед расчетами
			CalculatePosition(); */
			Table.closest('.row-container').hide();
		} else if (flag=='' || flag=='1') {
			$("input[name='formula']").val('');
			$("input[name='NMK']").autoNumeric('wipe');
			$("textarea[data-field-name='formula']").prop("required", false);
			$("[data-related-field=formula]").removeClass("label-required");
			$("input[data-field-name='NMK']").prop("required", false);
			$("[data-related-field=NMK]").removeClass("label-required");
			$("input[data-field-name='NMK']").hide();
			$("textarea[data-field-name='formula']").hide();
			$("[data-related-field=formula]").hide();
			$("[data-related-field=NMK]").hide();
			$("input[data-field-name='TorgEd']").closest(".column-container").hide();
			$("[data-related-field=TorgEd]").closest(".column-container").hide();
			$("input[name='TorgEd']").prop('checked', false);
			
			$("input[name='cened']").autoNumeric('wipe');
			$("input[data-field-name='cened']").prop("required", false);
			$("[data-related-field=cened]").removeClass("label-required");
			$("input[data-field-name='cened']").hide();
			$("[data-related-field=cened]").hide();
			Table.closest('.row-container').hide();
			$("input[data-field-name*='ItemTab-priceTaxTRU-']").prop("required", false);
			$("input[data-field-name*='ItemTab-priceTaxTRU-']").autoNumeric('wipe');
		}
	
			
		
}

$(document).on('change', "input[data-field-name='Kodcen']", function (e) {
	Svedcen();
});


Svedcen();

	function CalculatePosition() {
		var sum;
		var naimETP = $("input[name='naimETP']").val();
		var Table = $("div[data-name='ItemTab']");
		Table.find("div[data-rowkey]").each(function() {
			var element = $(this).find("input[data-field-name*='ItemTab-priceTaxTRU-']");
			if (element.val()) {
				sum = parseFloat(sum ? sum : 0) + parseFloat(element.autoNumeric('get'));
			}
		})	
		if (naimETP == 'АО "МСП-ЕЭТП"' || naimETP == 'АО "ЕЭТП"') {
			$("input[name='cened']").autoNumeric('wipe');
			$("input[name='cened']").autoNumeric('set', parseFloat(sum ? sum : 0));
			$("input[name='NMK']").autoNumeric('set', parseFloat(sum ? sum : 0)); // Заполняю, чтобы было заполнено если поменяли на РТ секцию. В Выгрузке не участвует
		} else if (naimETP == 'АО "РТ-ЕЭТП"') {
			$("input[name='NMK']").autoNumeric('wipe');
			$("input[name='NMK']").autoNumeric('set', parseFloat(sum ? sum : 0));
			$("input[name='cened']").autoNumeric('set', parseFloat(sum ? sum : 0)); // Заполняю, чтобы было заполнено если поменяли с РТ секции на другую. В Выгрузке не участвует
		}
	}
	
	$(document).on('change', "input[data-field-name*='ItemTab-priceTaxTRU-']", function (e) {
		CalculatePosition();
	});
	

/* function NoNDSHide() {
	var flag = $("input[name='Kodcen']").val();
		if (flag == "1") {
			$("input[name='NMCD']").closest(".column-container").show();
			$("input[name='NMCDnoNDS']").closest(".column-container").show();
			$("input[name='RazmNDS']").closest(".column-container").show();
		} else {
			$("input[name='NMCD']").closest(".column-container").hide();
			$("input[name='NMCDnoNDS']").closest(".column-container").hide();
			$("input[name='RazmNDS']").closest(".column-container").hide();
			$("input[name='NMCDnoNDS']").clear();
			$("input[name='RazmNDS']").clear();
		}
}

$(document).on('change', "input[name='NMCDnoNDS']", function (e) {
	let NMCD = $("input[name='NMCD']").val()
	NMCD = NMCD.replace(/\s/g, '')
	NMCD = parseFloat(NMCD)
	let NoNDS = $(this).val()
	NoNDS = NoNDS.replace(/\s/g, '')
	NoNDS = parseFloat(NoNDS)
	if (NoNDS > NMCD) {
		showCommonErrors("Начальная максимальная цена без НДС не должна превышать НМЦ с НДС");
		$("input[name='NMCDnoNDS']").clear();
		$("input[name='RazmNDS']").clear();
	}
	let RazmNDS = NMCD - NoNDS
	$("input[name='RazmNDS']").autoNumeric('set', RazmNDS)
}) */

function PodStUsl() {
	let naimETP = $("input[name='naimETP']").val()
	let formTorgCode = $("input[name='formTorgCode']").val()
	if (naimETP == 'АО "РТ-ЕЭТП"' && formTorgCode == 62)  
	{ //Подтверждение стандартных условий
		$("input[data-field-name='othOffersCode']").prop("required", false)
		$("input[data-field-name='othOffersCode']").closest(".column-container").hide()
		$("input[data-field-name='PriceOrderForm']").prop("required", false)
		$("input[data-field-name='PriceOrderForm']").closest(".column-container").hide()
		$("input[data-field-name='PriceOrderForm']").closest(".row-container").hide()
		$("input[data-field-name='vozmotk']").prop("required", false)
		$("input[data-field-name='vozmotk']").closest(".column-container").hide()
		$("input[data-field-name='vozmotk']").closest(".row-container").hide()
		$("input[data-field-name='MaxWinners']").prop("required", false)
		$("input[data-field-name='MaxWinners']").closest(".column-container").hide()
		$("input[data-field-name='NMK']").closest(".row-container").hide()
		$("input[data-field-name='srZaDo']").prop("required", true)
		$("[data-related-field=srZaDo]").addClass("label-required")
		$("input[data-field-name='coZaDo']").prop("required", true)
		$("[data-related-field=coZaDo]").addClass("label-required")
	}
	else
	{
		$("input[data-field-name='srZaDo']").prop("required", false)
		$("[data-related-field=srZaDo]").removeClass("label-required")
		$("input[data-field-name='coZaDo']").prop("required", false)
		$("[data-related-field=coZaDo]").removeClass("label-required")
		$("input[data-field-name='srZaDo']").closest(".column-container").hide()
		$("input[data-field-name='coZaDo']").closest(".column-container").hide()
		$("input[data-field-name='coZaDo']").closest(".row-container").hide()
	}
}
PodStUsl()
function ZapPrice() {
	let naimETP = $("input[name='naimETP']").val()
	let formTorgCode = $("input[name='formTorgCode']").val()
	if (naimETP == 'АО "РТ-ЕЭТП"' && formTorgCode == 51)  
	{ //Запрос цен
		$("input[data-field-name='vozmotk']").prop("required", false)
		$("input[data-field-name='vozmotk']").closest(".column-container").hide()
		$("input[data-field-name='othOffersCode']").prop("required", false)
		$("input[data-field-name='othOffersCode']").closest(".column-container").hide()
	}
}
ZapPrice()


$(document).on('change', "input[name='MaxWinners']", function (e) {
	let MaxWinners = $("input[name='MaxWinners']").val();
	if (MaxWinners > 99) {
		showCommonErrors("Максимальное количество победителей не должно превышать 99");
		$("input[name='MaxWinners']").clear();
	}
});

$(document).on('change', "input[data-field-name='SpecifyAdditionalInformation1']", function () {
	AdditionalInformationLogic();
});

function AdditionalInformationLogic() {
	var AdditionalInformation = $("textarea[name='AdditionalInformation1']");
	var SpecifyAdditionalInformation = $("input[data-field-name='SpecifyAdditionalInformation1']");
	var naimETP = $("input[name='naimETP']");
	
	if (naimETP.val() == 'АО "ЕЭТП"') {
		
		SpecifyAdditionalInformation.closest('.row-container').show;
		
		
		if (SpecifyAdditionalInformation.is(':checked')){
			AdditionalInformation.prop('required', true);
			AdditionalInformation.closest('.row-container').show();
			$("div[data-related-field='AdditionalInformation1']").addClass("label-required");
		} else{
			HideAdditionalInformation()
		}
	} else {
		SpecifyAdditionalInformation.closest('.row-container').hide();
		HideAdditionalInformation()
	}
	
	function HideAdditionalInformation() {
		AdditionalInformation.prop('required', false);
		AdditionalInformation.closest('.row-container').hide();
		$("div[data-related-field='AdditionalInformation1']").removeClass("label-required");
		AdditionalInformation.clear();
	}
}

AdditionalInformationLogic();

// СБЕрбанк-АСТ
(function() {
	function SberAstLogic() {
		var naimETP = $("input[name='naimETP']").val();
		var formTorgCode = $("input[name='formTorgCode']").val()
		var ArrFieldHide = ['registerUslPos', 'registerOPos', 'vozmotk', 'MaxWinners', 'othOffersCode']; // поля которые скрываем при сбербанк АСТ
		var ArrSberASTField = ['registerOKATO', 'registerOKATOName', 'BidAnalogValid', 'BidSpecifyContractPositionObject', 'BidComment', 'BidTradeTypeCode', 'BidTradeTypeName', 'BidContractConditionDemandTradeSession', 'BidContractConditionDemandPeriodTradeSession', 'BidAuctionStepMinPercent', 'BidAuctionStepMaxPercent']; // поля необходимые для сбербанк АСТ
		var ArrRequiredSberASTField = ['BidTradeTypeCode']; // поля обязательные для сбербанк АСТ
		var ArrDefaultHide = ['BidContractConditionDemandTradeSession', 'BidContractConditionDemandPeriodTradeSession', 'BidAuctionStepMinPercent', 'BidAuctionStepMaxPercent']; // список полей, которые скрываем и делаем не обязательными по умолчанию
		
		filedHideAndNotRequired(ArrDefaultHide);
		
		if (naimETP == 'АО "Сбербанк - АСТ"') {
			filedClearAndHide(ArrFieldHide); // скрываем поля которые не нужны для  Сбербанк - АСТ
			filedShowAndRequired(ArrRequiredSberASTField); // Список обязательных полей
			
			// Если аукцион
			if (['12', '16', '20', '63', '68'].indexOf(formTorgCode) > -1) {
				// (20)Аукцион в электронной форме, участниками которого могут являться только субъекты малого и среднего предпринимательства
				// (16)Аукцион (заявка из 2-х частей)
				// (12)Аукцион	
				// (63)Аукцион с двумя частями заявок	
				// (68)Аукцион в электронной форме
				
				if (['12', '16', '20', '63', '68'].indexOf(formTorgCode) > -1) {
					filedShow(['BidContractConditionDemandTradeSession', 'BidContractConditionDemandPeriodTradeSession']); // поля которые отображаем
					filedShowAndRequired(['BidAuctionStepMinPercent','BidAuctionStepMaxPercent']); // поля которые отображаем и делаем обязательными
				} else if (['20'].indexOf(formTorgCode) > -1) {
					filedShow(['BidContractConditionDemandTradeSession', 'BidContractConditionDemandPeriodTradeSession']); // поля которые отображаем
				}
				
			}
			
		} else {
			filedClearAndHide(ArrSberASTField); // скрываем поля  относящиеся к СБЕрбанк-АСТ
		}
	}
	
	SberAstLogic();
	
	// чистим и скрываем поля
	function filedClearAndHide(Arr) {
		Arr.forEach(function(item, i) {
			var current = $("[data-field-name='"+item+"']"); // текущий элемент
			current.closest('.column-container').hide();  // скрываем текущий элемент
			$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide(); // скрываем label
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
			current.prop('required', false);
			current.prop('checked', false);
			
			$("[name='"+item+"']").val('');
			current.val('');
			current.text('');
			
			// проверка на maoney
			if (current.attr('class') != undefined) {
				if (current.attr('class').indexOf('money') > -1) {
					current.autoNumeric('wipe');
				}
			}
			
			// проверка на дату
			if (current.parent().data("DateTimePicker") != undefined) {
				current.parent().data("DateTimePicker").clear();
			}
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
	
	//скрыть и сделать необязательными
	function filedHideAndNotRequired (Arr) {
		Arr.forEach(function(item, i) {
			var current = $("[data-field-name='"+item+"']"); // текущий элемент
			current.closest('.column-container').hide();  // скрываем текущий элемент
			$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide(); // скрываем label
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
			current.prop('required', false);
		});	
	}
})()