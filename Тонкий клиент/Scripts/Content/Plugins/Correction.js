$("div[data-name='planPayment1']").closest('.row-container').hide();
var GlobalShowMessage = true; // глобальная переменная
var GlobalregisterNMCS = $("input[data-field-name='registerNMCS1']").val(); // глобальная переменная содержащая значение НМЦД в момент вызова плагина
var ArrayOfTablePositionArray = []; // Массив в массиве, который содержит все измененеия по таблице позиций

$(document).ready(function() {
	debugger;
	HideTablePosition(); // Логика отображения таблицы позиций
	HideIfCurrency() // Логика отображения полей при валюте
	initAutonumeric(); // вызов функции Autonumeric
	ArrayOfTableData(); // При вызове плагина, пробегаемся по таблице и добавляем данные в массив
	CalculateStartPrice(); // Рассчитывается первоначальная стоимость и проставляется признак корректировки
	// вызов функции при изменении количества
	$("input[data-field-name*='ItemTab1-registerCount-']").on('change', function(elem){
		CalculateTablePosition(elem);
	})
	// вызов функции при изменении цены
	$("input[data-field-name*='ItemTab1-priceTax-']").on('change', function(elem){
		CalculateTablePosition(elem);
	})
	// вызов функции при изменении НМЦД
	$("input[data-field-name='registerNMCS1']").on('change', function(){
		// Если функция limitationNMCD вернул false, то не пересчитываем суммы
		if (limitationNMCD() == true) {
			if (CheckCurrency()) { // если валюта
			    CalculateIfCurrensy(); //пересчет НМЦД в рублях
			}
			ArrayOfTableData(); // Добавляем валидные текущие значения в массив
			CalculateDolgPrice();
		}
	})
}())

function CalculateIfCurrensy() {
	var registerNMCS = $("input[data-field-name='registerNMCS1']").autoNumeric('get');
	var curs = $("input[name='curs1']").autoNumeric('get'); // курс валюты
	var NMCDRub = $("input[name='NMCD1']"); // НМЦД в рублевом эквиваленте
	NMCDRub.autoNumeric('set', ConvertToDoble(registerNMCS)*ConvertToDoble(curs));
}

function HideIfCurrency() {
	var currency = $("input[name='Currency1']");
	if (currency.val() == 'Российский рубль') {
		$("input[name='curs1']").closest('.row-container').hide();
		$("input[name='NMCD1']").closest('.row-container').hide();	
	} else {
		$("button[id='Currency_kod1']").prop('disabled', true);
		$("input[data-field-name='Currency_kod1']").css('background-color', 'whitesmoke');
	}
}
// Проверка на валюту
function CheckCurrency() {
	var result = true;
	var currency = $("input[name='Currency1']");
	if (currency.val() == 'Российский рубль') {
		result = false;
	} 
	return result;
}


// прерывает сохранение формы
/* function DisabledSave() {
	var form = $("form");
	form.on("beforeSubmit", function (args) {
		$(".loading-image.loading-image-shown").hide();
		$(".btn-toolbar > .btn").attr("disabled", false);
		form.find("[type='submit']").attr("disabled", false);
		throw new Error("beforeSave");
	});
} */


function CalculateStartPrice() {
	var correction = $("input[name='correction1']");
	var firstPrice = $("input[name='firstPrice1']");
	if (correction.val() != 1){		
		correction.prop('checked', true);
		correction.val('1');
		// Если поле не заполнено, то заполняем значением текущего НМЦД
		if(!firstPrice.val()){
			firstPrice.autoNumeric('set', GlobalregisterNMCS);
		}
		
	}
}


function limitationNMCD() {
	var NewPrice = $("input[data-field-name='registerNMCS1']");
	var firstPrice = $("input[name='firstPrice1']");
	var ChangePrice = true;
	if ((ConvertToDoble(NewPrice.val()) > ConvertToDoble(firstPrice.val())*1.2) || (ConvertToDoble(NewPrice.val()) < ConvertToDoble(firstPrice.val())*0.8)) {
		NewPrice.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1][ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1].length-1].SummAll);
		ChangePrice = false;
		showCommonErrors('Разница между новой и первоначальной НМЦД составляет более 20%. Значение первоначальной НМЦД = ' + firstPrice.val());
	}
	
	var flag=$("input[name='Currency_kod1']").val();
	var spzak=$("input[name='registerSpZakup']").val();
		
	if ((flag === "RUB") && (NewPrice.autoNumeric('get')>15000000) && (spzak === "200611")) {
		NewPrice.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1][ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1].length-1].SummAll);
		ChangePrice = false;
		showCommonErrors('Внимание! Максимальная допустимая сумма НМЦ для данного способа закупки 15 млн. рублей.');
	} else if ((flag === "RUB") && (NewPrice.autoNumeric('get')>7000000) && (spzak === "200610")) {
		NewPrice.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1][ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1].length-1].SummAll);
		ChangePrice = false;
		showCommonErrors('Внимание! Максимальная допустимая сумма НМЦ для данного способа закупки 7 млн. рублей.');
	}
	return ChangePrice;
	
}

function ArrayOfTableData() {
	var TableRows = $("div[data-name='ItemTab1'] [data-rowkey]");
	var registerNMCS = $("input[data-field-name='registerNMCS1']").autoNumeric('get');
	var curs = $("input[name='curs1']").autoNumeric('get'); // курс валюты
	var NMCDRub = $("input[name='NMCD1']").autoNumeric('get'); // НМЦД в рублевом эквиваленте
	var SumArray = [];	
	var SummAll;
		TableRows.each(function(i, item){
			var registerCount = $(item).find("input[data-field-name*='ItemTab1-registerCount-']").autoNumeric('get');
			var priceTax = $(item).find("input[data-field-name*='ItemTab1-priceTax-']").autoNumeric('get');
			var summaTax = $(item).find("input[data-field-name*='ItemTab1-summaTax-']").autoNumeric('get');
			SumArray.push({i:i, registerCount:registerCount, priceTax:priceTax, summaTax:summaTax, curs:curs, NMCDRub:NMCDRub, SummAll: registerNMCS})
		})
	ArrayOfTablePositionArray.push(SumArray); // Текущие поля таблицы добавляем в массив
}


 function CalculateTablePosition(elem) {
	var TableRows = $("div[data-name='ItemTab1'] [data-rowkey]");
	var registerNMCS = $("input[data-field-name='registerNMCS1']");
	var CurrentRows = $(elem.currentTarget).closest("[data-rowkey]"); // Строка которая редактируется на данный момент
	var CurrentIndex; // индекс редактируемой строки
	var curs = $("input[name='curs1']").autoNumeric('get'); // курс валюты
	var NMCDRub = $("input[name='NMCD1']"); // НМЦД в рублевом эквиваленте
	var SumArray = [];	
	var SummAll, SummAllRub;
		TableRows.each(function(i, item){
			var registerCount = $(item).find("input[data-field-name*='ItemTab1-registerCount-']").autoNumeric('get');
			var priceTax = $(item).find("input[data-field-name*='ItemTab1-priceTax-']").autoNumeric('get');
			var summaTax = $(item).find("input[data-field-name*='ItemTab1-summaTax-']");			
			summaTax.autoNumeric('set', ConvertToDoble(registerCount)*ConvertToDoble(priceTax));			
			SummAll = ConvertToDoble(SummAll) + ConvertToDoble(summaTax.autoNumeric('get'));
			// Проверяем на валюту
			if (CheckCurrency()) {
				 SummAllRub = ConvertToDoble(SummAll)*ConvertToDoble(curs);
			 }
			SumArray.push({i:i, registerCount:registerCount, priceTax:priceTax, summaTax: summaTax.autoNumeric('get'), curs:curs, NMCDRub: ConvertTwoSigns(ConvertToDoble(SummAllRub)), SummAll:SummAll});
				// Находим индекс изменяемой строки
				if ($(CurrentRows).attr('data-rowkey') == $(item).attr('data-rowkey')) {
					CurrentIndex = i;
				}
		})	
	registerNMCS.autoNumeric('set', ConvertToDoble(SummAll));
	// Проверяем на валюту
	 if (CheckCurrency()) {
		 NMCDRub.autoNumeric('set', ConvertToDoble(SummAll)*ConvertToDoble(curs));
	 }
	 // проверяем на непревышение разницы в 20%. Если превышает на 20%, то возвращаем в таблицу старые значения
	 if (limitationNMCD() == false) {
		 
		 var ChangeRegisterCount = $(TableRows[CurrentIndex]).find("input[data-field-name*='ItemTab1-registerCount-']");
		 var ChangePriceTax = $(TableRows[CurrentIndex]).find("input[data-field-name*='ItemTab1-priceTax-']");
		 var ChangesummaTax = $(TableRows[CurrentIndex]).find("input[data-field-name*='ItemTab1-summaTax-']");
		 /* ChangeRegisterCount.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-2][CurrentIndex].registerCount) // Количество */
		 ChangePriceTax.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1][CurrentIndex].priceTax); // цена за единицу
		 ChangesummaTax.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1][CurrentIndex].summaTax); // сумма
		 registerNMCS.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1][ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1].length-1].SummAll); // НМЦД
	 // Проверяем на валюту
	 if (CheckCurrency()) {
		 NMCDRub.autoNumeric('set', ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1][ArrayOfTablePositionArray[ArrayOfTablePositionArray.length-1].length-1].NMCDRub); // НМЦД в рублях
	 }
	 } else {
		 ArrayOfTablePositionArray.push(SumArray); // Текущие поля таблицы добавляем в массив
		CalculateDolgPrice(); // вызываем пересчет таблицы долгосрочек
	 }
	 console.log(ArrayOfTablePositionArray);
 }

 function HideTablePosition() {
	 var table = $("div[data-name='ItemTab1']");
	 var checkBoxNMCS = $("input[data-field-name='checkBoxNMCS1']");
	 var registerNMCS = $("input[data-field-name='registerNMCS1']");
	 /* table.find('.table-add-row-button').closest('.table-edit-column').hide();
	 table.find('.table-remove-row-button').closest('.table-edit-column').hide(); */
	 table.find("[class*='table-row-actions-']").hide();
	 table.find('.right-actions-offset').css('margin-right', '0');
	 table.find('.right-actions-offset').css('padding-right', '0');
	  if (checkBoxNMCS.is(':checked')) {
		  table.closest('.row-container').hide();
	  } else {
		  registerNMCS.prop('readonly', true);
		  registerNMCS.css('background-color', 'whitesmoke');
		  table.closest('.row-container').show();
	  }
	 
 }

var CalculateDolgPrice = function(){
	var Table = $("div[data-name='planPayment1']").find('[data-rowkey]');
	var MspTable = $("div[data-name='planPaymentSMP1']").find('[data-rowkey]');
	var longTermcategorie = $("input[data-field-name='longTermcategorie1']");
	var registerNMCS = $("input[data-field-name='registerNMCS1']");
	var Alloplata = $("input[data-field-name='Alloplata1']");
	var AlloplataSMP = $("input[data-field-name='AlloplataSMP1']");
	var ChangeTabel = false;
	var ChangeTabelMSP = false;
	var Sum, SumMSP;
	var PercentageTable = []; // Массив содержащий индекс строки таблицы Долгосрочек
	var PercentageMspTable = []; // Массив содержащий индекс строки таблицы Долгосрочек МСП
	// Поля для валюты
	var Alloplatainrub = $("input[data-field-name='Alloplatainrub1']");
	var AlloplataSMPinrub = $("input[data-field-name='AlloplataSMPinrub1']");
	var curs_dolg = $("input[data-field-name='curs_dolg1']").autoNumeric('get');
	var curs_smp = $("input[data-field-name='curs_smp1']").autoNumeric('get');;
	var SumRub, SumMSPRub;
	// Пересчет таблицы позиций
/* 	var PositionTable = $("div[data-name='ItemTab1']").find('[data-rowkey]'); 
	var checkBoxNMCS = $("input[data-field-name='checkBoxNMCS1']"); 
	var PercentagePositionTable =[]; // Массив содержащий индекс строки таблицы позиций
	var PositionRowsSumm; */
	// Если закупка Долгосрочная
	if (longTermcategorie.is(':checked')) {
		// Если НМЦ не пустая
		if (registerNMCS.val()) {
			/* initAutonumeric(); // вызов функции Autonumeric */
			// Если сумма по всем строкам таблицы больше 0
			if(ConvertToDoble(Alloplata.val()) > 0) {
				Table.each(function(i, elem) {
					var column = $(elem).find("input[data-field-name*='planPayment1-summaPayment-']");
					var columnRub = $(elem).find("input[data-field-name*='planPayment1-summaPaymentRub-']");
					if (parseFloat(column.val() ? ConvertToDoble(column.val()) : 0) > 0) {
						var Price = ConvertToDoble(column.val());
						var Percentage = Price / ConvertToDoble(Alloplata.val()); // Доля строки в общей сумме
						PercentageTable.push({i:i, Percentage:Percentage}); // Записываю в массив индекс строки
						var result = ConvertTwoSigns(ConvertToDoble(registerNMCS.val())*Percentage); // Новая цена для строки: новая НМЦД * доля
						column.autoNumeric('set', result);
						Sum = ConvertTwoSigns(ConvertToDoble(Sum) + ConvertToDoble(result)); // общая сумма по строке
						// Проверяем на валюту
						 if (CheckCurrency()) {
							 columnRub.autoNumeric('set', ConvertToDoble(result)*ConvertToDoble(curs_dolg));
							 SumRub = ConvertTwoSigns(ConvertToDoble(Sum)*ConvertToDoble(curs_dolg)); // общая сумма по строке в рублях
						 }
					}
				})
				// Если сумма по всем строкам не равна новой НМЦД, то разницу добавляем к последней ненулевой строке
				if (ConvertToDoble(Sum) != ConvertToDoble(registerNMCS.val())) {
					var difference = ConvertTwoSigns(ConvertToDoble(registerNMCS.val()) - ConvertToDoble(Sum));
					var LastRow = $(Table.find("input[data-field-name*='planPayment1-summaPayment-']")[PercentageTable[PercentageTable.length - 1].i]);
					var LastRowRub = $(Table.find("input[data-field-name*='planPayment1-summaPaymentRub-']")[PercentageTable[PercentageTable.length - 1].i]);
					var NewPrice = ConvertTwoSigns(ConvertToDoble(difference) + ConvertToDoble(LastRow.val()));
					LastRow.autoNumeric('set', NewPrice);
					Sum = ConvertTwoSigns(ConvertToDoble(Sum) + ConvertToDoble(difference));
					// Проверяем на валюту
					if (CheckCurrency()) {
						LastRowRub.autoNumeric('set', NewPrice*ConvertToDoble(curs_dolg))
					}
				}
				Alloplata.autoNumeric('set', Sum);
				// Проверяем на валюту
				if (CheckCurrency()) {
					Alloplatainrub.autoNumeric('set', SumRub);
				}	
				ChangeTabel = true;
			}
			// Если сумма по всем строкам таблицы МСП больше 0
			if (ConvertToDoble(AlloplataSMP.val()) > 0) {
				MspTable.each(function(i, elem) {
					var columnMSP = $(elem).find("input[data-field-name*='planPaymentSMP1-summaPaymentSMP-']");
					var columnMSPRub = $(elem).find("input[data-field-name*='planPaymentSMP1-summaPaymentRubSMP-']");
					if (parseFloat(columnMSP.val() ? ConvertToDoble(columnMSP.val()) : 0) > 0) {
						var PriceMSP = ConvertToDoble(columnMSP.val());
						var PercentageMSP = PriceMSP / ConvertToDoble(AlloplataSMP.val()); // Доля строки в общей сумме
						PercentageMspTable.push({i:i, PercentageMSP:PercentageMSP}); // Записываю в массив индекс строки
						var resultMSP = ConvertTwoSigns(ConvertToDoble(registerNMCS.val())*PercentageMSP); // Новая цена для строки: новая НМЦД * доля
						columnMSP.autoNumeric('set', resultMSP);
						SumMSP = ConvertTwoSigns(parseFloat(ConvertToDoble(SumMSP)) + parseFloat(ConvertToDoble(resultMSP)));
						// Проверяем на валюту
						 if (CheckCurrency()) {
							 columnMSPRub.autoNumeric('set', ConvertToDoble(resultMSP)*ConvertToDoble(curs_smp));
							 SumMSPRub = ConvertTwoSigns(ConvertToDoble(SumMSP)*ConvertToDoble(curs_smp)); // общая сумма по строке в рублях
						 }
					}
				})
				// Если сумма по всем строкам не равна новой НМЦД, то разницу добавляем к последней ненулевой строке
				if (ConvertToDoble(SumMSP) != ConvertToDoble(registerNMCS.val())) {
					var differenceMSP = ConvertTwoSigns(ConvertToDoble(registerNMCS.val()) - ConvertToDoble(SumMSP));
					var LastRowMSP = $(MspTable.find("input[data-field-name*='planPaymentSMP1-summaPaymentSMP-']")[PercentageMspTable[PercentageMspTable.length - 1].i]);
					var NewPriceMSP = ConvertTwoSigns(ConvertToDoble(differenceMSP) + ConvertToDoble(LastRowMSP.val()));
					LastRowMSP.autoNumeric('set', NewPriceMSP);
					SumMSP = ConvertTwoSigns(ConvertToDoble(SumMSP) + ConvertToDoble(differenceMSP));
					// Проверяем на валюту
					if (CheckCurrency()) {
						LastRowRub.autoNumeric('set', NewPriceMSP*ConvertToDoble(curs_smp))
					}
				}
				AlloplataSMP.autoNumeric('set', SumMSP);
				// Проверяем на валюту
				if (CheckCurrency()) {
					AlloplataSMPinrub.autoNumeric('set', SumMSPRub);
				}
				ChangeTabelMSP = true;
			}		
		}
	}
	
	// Если НЕ стоит чекбокс "Ввести сумму по строке"
/* 	if (!checkBoxNMCS.is(':checked')) {
		// Если НМЦ не пустая
		if (registerNMCS.val()) {
		debugger;	
			PositionTable.each(function(i, item){
				var priceTax = $(item).find("input[data-field-name*='ItemTab1-priceTax-']");
				var registerCount = $(item).find("input[data-field-name*='ItemTab1-registerCount-']");
				var summaTax = $(item).find("input[data-field-name*='ItemTab1-summaTax-']");
				if (parseFloat(summaTax.val() ? ConvertToDoble(summaTax.val()) : 0) > 0) {
					var PercentagePosition = ConvertToDoble(summaTax.val()) / ConvertToDoble(GlobalregisterNMCS);
					PercentagePositionTable.push({i, PercentagePosition}); // Записываю в массив индекс строки
					summaTax.autoNumeric('set', ConvertTwoSigns(ConvertToDoble(registerNMCS.val()) * ConvertToDoble(PercentagePosition)));
					priceTax.autoNumeric('set', ConvertTwoSigns(ConvertToDoble(summaTax.val()) / ConvertToDoble(registerCount.val())));
					PositionRowsSumm = ConvertTwoSigns(ConvertToDoble(PositionRowsSumm) + ConvertToDoble(summaTax.val()))
					GlobalregisterNMCS = ConvertToDoble(registerNMCS.val());
				}
			})
			if (ConvertToDoble(PositionRowsSumm) != ConvertToDoble(registerNMCS.val())) {
				var TablePositionDifference = ConvertTwoSigns(ConvertToDoble(registerNMCS.val()) - ConvertToDoble(PositionRowsSumm));
				var LastRowPriceTax = $(PositionTable.find("input[data-field-name*='ItemTab1-priceTax-']")[PercentagePositionTable[PercentagePositionTable.length - 1].i]);
				var LastRowRegisterCount = $(PositionTable.find("input[data-field-name*='ItemTab1-registerCount-']")[PercentagePositionTable[PercentagePositionTable.length - 1].i]);
				var LastRowSummaTax = $(PositionTable.find("input[data-field-name*='ItemTab1-summaTax-']")[PercentagePositionTable[PercentagePositionTable.length - 1].i]);
				var TablePositionNewPrice = ConvertTwoSigns(ConvertToDoble(TablePositionDifference) + ConvertToDoble(LastRowSummaTax.val()));
				LastRowSummaTax.autoNumeric('set', TablePositionNewPrice);
				LastRowPriceTax.autoNumeric('set', ConvertTwoSigns(ConvertToDoble(LastRowSummaTax.val()) / ConvertToDoble(LastRowRegisterCount.val())));
			}
			6
		}
	} */
	
	if ((ChangeTabel == true || ChangeTabelMSP == true) && GlobalShowMessage == true) {
		showCommonErrors('Таблица долгосрочных платежей была пересчитана при изменении НМЦД. Пожалуйста, проверьте корректность расчетов');
		GlobalShowMessage = false; // обнуляю признак, чтобы сообщение отображалось только один раз
	}
	
}

	// Парсит строку в тип doble
	function ConvertToDoble(filed) {
		if (typeof filed != 'number') {
			filed = parseFloat(filed ? filed.replace(/ /g, '').trim() : 0);
		}
		return filed;
	}
	// округляет до двух знаков посл запятой
	function ConvertTwoSigns(filed) {	
		/* (Math.floor(filed * 100) / 100); */
		filed = filed.toFixed(2);
		return filed;
	}