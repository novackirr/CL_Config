"use strict";

var editreg = function() {     
	$("li:has(:contains('Скрытые поля'))").hide();
	$("div[data-name='LotsTab']").find("div[class*='table-row-actions']").hide(); // скрываем кнопки дейсвтия у таблицы
}

// тут находятся все обработчики событий 
function EventHandler() {
	// изменение поля "Отменить процедуру в целом"
	$(document).on('change', "input[data-field-name='purchasetotalcancel']", function() {
		LotsTabLogic();
	});
	// изменение столбца "отменить лот"
	$(document).on('change', "input[data-field-name*='-Lot_CancelLot-']", function() {
		var CurrentRow = $(this).closest('[data-rowkey]')
		LotsTabIfCancel(CurrentRow);
	});
}

// логика работы таблицы лотов
function LotsTabLogic() {
	var LotsTab = $("div[data-name='LotsTab'] [data-rowkey]");
	var purchasetotalcancel = $("input[data-field-name='purchasetotalcancel']").val();
	
	if (purchasetotalcancel == 'Да') {
		ColumnClearAndReadonly(LotsTab, ['Lot_CancelLot', 'Lot_DateCancelLot', 'Lot_ReasonCancelLot']);
		
		filedShowAndRequired(['datereshenie1', 'osnovreshenie1']);
	}
	else if (purchasetotalcancel == 'Нет'){
		ColumnRequired(LotsTab, ['Lot_CancelLot']); // делаем редактируемым в таблице
		ColumnNotDisabled(LotsTab, ['Lot_CancelLot']) // делаем кнопку редактируемым в таблице
		
		filedClearAndReadonly(['datereshenie1', 'osnovreshenie1']);
	}
	//Если пусто
	else if(!purchasetotalcancel) {
		ColumnClearAndReadonly(LotsTab, ['Lot_CancelLot', 'Lot_DateCancelLot', 'Lot_ReasonCancelLot']);
		filedClearAndReadonly(['datereshenie1', 'osnovreshenie1']);
	}
}

function LotsTabIfCancel(CurrentRow) {
	var LotsTab = $("div[data-name='LotsTab']");
	var Rows;
	if (CurrentRow) {
		Rows = CurrentRow;
	}
	else {
		Rows =  $(LotsTab).find("[data-rowkey]");
	}
	
	if (Rows.length>0) {
		Rows.each(function(i, item) {
			var CancelLot = $(item).find("input[data-field-name*='-Lot_CancelLot-']").val();
			
			if (CancelLot == 'Да') {
				CurrentRowRequired(item, ['Lot_DateCancelLot', 'Lot_ReasonCancelLot']);
			}
			else {
				CurrentRowClearAndNotRequired(item, ['Lot_DateCancelLot', 'Lot_ReasonCancelLot'])
			}
			
		})
	}
	
}

function CurrentRowClearAndNotRequired(Row, Arr) {
	$(Row).each(function(r, row) {
		Arr.forEach(function(item, i) {
			var CurrentColumn = $(row).find("input[data-field-name*='"+item+"']");
			CurrentColumn.prop('required', false);
			CurrentColumn.prop('readonly', true);
			
			CurrentColumn.closest(".documentView-field-value").removeClass('has-error');
			
			if (CurrentColumn.attr('type') != 'checkbox') {
				$(row).find("[name*='"+item+"']").val('');
				CurrentColumn.val('');
				CurrentColumn.text('');
			}
			
			// проверка на money
			if (CurrentColumn.attr('class') != undefined) {
				if (CurrentColumn.attr('class').indexOf('money') > -1) {
					CurrentColumn.autoNumeric('wipe');
				}
			}
			
			// проверка на дату
			if (CurrentColumn.parent().data("DateTimePicker") != undefined) {
				CurrentColumn.parent().data("DateTimePicker").clear();
			}
			
			
			CurrentColumn.css({
				"background-color": "whitesmoke"
			})
		})
	})
	
}

function CurrentRowRequired(Row, Arr) {
	$(Row).each(function(r, row) {
		Arr.forEach(function(item, i) {
			var CurrentColumn = $(row).find("input[data-field-name*='"+item+"']");
			CurrentColumn.prop('required', true);
			CurrentColumn.prop('readonly', false);
			CurrentColumn.css({
				"background-color": "#fff"
			})
		})
	})
	
}


// чистим и делаем не редактируемым в иаблице
function ColumnClearAndReadonly(Rows, Arr) {
	Arr.forEach(function(item, i) {
		var current = $(Rows).find("[data-field-name*='"+item+"']"); // текущий элемент

		current.prop('required', false);
		current.prop('checked', false);
		
		// убираем крсную полоску обязательности
		current.closest(".documentView-field-value").removeClass('has-error');
		
		if (current.attr('type') != 'checkbox') {
			$(Rows).find("[name*='"+item+"']").val('');
			current.val('');
			current.text('');
		}
		
		// проверка на money
		if (current.attr('class') != undefined) {
			if (current.attr('class').indexOf('money') > -1) {
				current.autoNumeric('wipe');
			}
		}
		
		// проверка на дату
		if (current.parent().data("DateTimePicker") != undefined) {
			current.parent().data("DateTimePicker").clear();
		}
		
		//делаем readonly или disabled
		
		current.prop('readonly', true);
		$(Rows).find("button[id='Lot_CancelLot']").prop('disabled', true);
		current.css({
			"background-color": "whitesmoke"
		})
		
		
	});	
}

// делаем кнопку редактируемым в таблице
function ColumnNotDisabled(Table, Arr) {
	Arr.forEach(function(item, i) {
		var current = $(Table).find("[data-field-name*='"+item+"']"); // текущий элемент

		$(Table).find("button[id='Lot_CancelLot']").prop('disabled', false);
		current.css({
			"background-color": "#fff"
		})
		
		
	});	
}

// делаем редактируемым в таблице
function ColumnRequired(Table, Arr) {
	Arr.forEach(function(item, i) {
		var current = $(Table).find("[data-field-name*='"+item+"']"); // текущий элемент
		current.prop('required', true)		
	});	
}

// чистим и скрываем поля
function filedClearAndReadonly(Arr) {
	Arr.forEach(function(item, i) {
		var current = $("[data-field-name='"+item+"']"); // текущий элемент
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
		
		// убираем крсную полоску обязательности
		current.closest(".documentView-field-value").removeClass('has-error');
		$("div.documentView-field-label[data-related-field='"+item+"']").closest(".documentView-field-label").removeClass('has-error');
		
		current.prop('required', false);
		current.prop('checked', false);
		
		if (current.attr('type') != 'checkbox') {
			$("[name='"+item+"']").val('');
			current.val('');
			current.text('');
		}
		
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
		
		current.prop('readonly', true);
		current.css({
			"background-color": "whitesmoke"
		})
	});	
}

// отображение полей
function filedShowAndRequired(Arr) {
	Arr.forEach(function(item, i) {
		var current = $("[data-field-name='"+item+"']"); // текущий элемент
		current.closest('.column-container').show();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').show();
		
		$("div.documentView-field-label[data-related-field='"+item+"']").addClass('label-required');
		current.prop('required', true);
		
		current.prop('readonly', false);
		current.css({
			"background-color": "#fff"
		})
	});
}

function customDropDownHandle(){
	
	$(".document-view-actions").find("a:contains('Отправить на ЭТП')").each(function() { 

        var button = $(this);
		var onclickFunc = button.attr('onclick');		
		button.attr('onclick', 'return false;');
		
		button.click(function(ev) {
			var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
			var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
			
			
			var getProject = $.grep(dxDataGridDocs._store._array, function(item){
			  return item.Fields.AttachmentPublication == "Публикуется";
			});	
			
			
			var textErrors = [];			
			
			if(getProject.length == 0){
				textErrors.push("Публикуется")
			}			
			if(textErrors.length > 0){
				var files_errorMessage = (textErrors.length > 0) ? 'документа необходимо приложить файл с Признаком публикации: ' + textErrors.join(', ') : '';
				var errorMessage = "Для публикации " + files_errorMessage +".";
				showCommonErrors(errorMessage);
				return;
			} 
			else{
				eval(onclickFunc);
			}

		});

	});
	
}

function DocumentSave() {
	var form = $("form");
	form.on("beforeSubmit", function (args) {
		var flag = true;
		var errorMessage; // Сообщение об ошибке
		var naimETPID=$("input[name='naimETPID']").val(); 
		var ProcedureStatusOnETP=$("input[name='ProcedureStatusOnETP']").val();
		var Emergency1=$("input[data-field-name='Emergency1']");
		
		if (ProcedureStatusOnETP != 'Прием заявок') {
			if (!Emergency1.is(':checked')) {
				errorMessage = 'После окончания приема заявок процедура закупки может быть отменена только при возникновении обстоятельств непреодолимой силы в соответствии с гражданским законодательством';
				ShowErrors(errorMessage);
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


scopes.onRegister(editreg);
scopes.onRegister(EventHandler);
scopes.onRegister(LotsTabLogic);
scopes.onRegister(LotsTabIfCancel);
scopes.onRegister(DocumentSave);

scopes.onEdit(editreg);
scopes.onEdit(EventHandler);
scopes.onEdit(LotsTabLogic);
scopes.onEdit(LotsTabIfCancel);
scopes.onEdit(DocumentSave);

/* scopes.onView(izmenView); */
