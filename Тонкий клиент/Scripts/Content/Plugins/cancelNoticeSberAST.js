// Плагин загрузки добавил в скрипт, т.к. не работает в плагинах
var waitingDialogForPlugin = waitingDialogForPlugin || (function ($) {
    'use strict';
    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-sm">' +
        '<div class="modal-content">' +
        '<div class="modal-body" style="text-align:center;">' +
        '<div><h3 class="loading-message"></h3></div>' +
        '<div class="loading-image loading-image-shown">' +
        '</div>' +
        '</div></div></div>');

    return {

        dlg: $dialog,

        show: function (message, options) {
            var it = this;
            if ($(".modal-backdrop:visible").length === 1) {

                $dialog.find("h3").text(message);
                $dialog.find(".modal-content").css("visibility", "visible");
                $dialog.find(".loading-image.loading-image-shown").removeAttr("style");
                $dialog.modal();
            } else {

                setTimeout(function () {
                    it.show(message, options);
                }, 350);
            }
        },
        hide: function () {         
            $dialog.modal('hide');
        },
        isVisible: function () {
            return $(".modal-backdrop:visible").length > 1;
        }
    };

})(jQuery);

function HideWaitingDialog() {
	let Interval = setInterval(function(time){
		if (waitingDialogIsVisible()) {
			waitingDialogForPlugin.hide();
		} else {
			clearInterval(Interval);
		}
	}, 3000);
		
	function waitingDialogIsVisible() {
		return waitingDialogForPlugin.isVisible()
	}
}

(function () {
	$("#actionDialog > .modal-dialog").addClass("modal-large"); // увеличиваем размер модального окна
	
	DefaultLogic(); // дефолтная логика по отмене процедуры
	AsyncResponse(); // выполнение асинхронных запросов
    
}());

function DefaultLogic() {
	$(".checkbox-label-right").css("width","auto")
	$(".checkbox-label-right").css("margin-left","0px")
	$(".modal-body .form-group label").css("margin-top","3px")
	let ApproveCommission = $("input[data-field-name='ApproveCommission']");
	let ApproveLeader = $("input[data-field-name='ApproveLeader']");
	ApproveCommission.prop("checked", true)
	ApproveLeader.prop("checked", true)
	function ckeckFullApprove(obj){
		let ApproveCommission = $("input[data-field-name='ApproveCommission']");
		let ApproveLeader = $("input[data-field-name='ApproveLeader']");
		
		if ( !ApproveCommission.is(":checked") && !ApproveLeader.is(":checked")){
			$(obj).prop("checked", true)
			showCommonErrors('Для запуска маршрута согласования должен быть заполнен как минимум один чекбокс');
		}
	}
	$(document).on('change', "input[data-field-name='ApproveCommission']", function (e) {
		ckeckFullApprove(this)
	})
	$(document).on('change', "input[data-field-name='ApproveLeader']", function (e) {
		ckeckFullApprove(this)
	})
}

// выполнение асинхронных запросов
function AsyncResponse() {
	var docIdObj = parseInt(window.location.pathname.split('/').pop());
    var docIdStr = isNaN(docIdObj) ? '' : docIdObj;
	
		
	waitingDialogForPlugin.show('Загрузка данных'); // отображаем модалку загрузки
	$.when(CreatelotsTable(docIdStr)).then(function() {			
		
		LotsTabLogic(); // логика работы таблицы лотов
		EventHandler(); // тут вешаем обработчики событий
		LotsTabIfCancel(); // тут чистим содержимое таблицы в завсисимотсти от условий
		
		waitingDialogForPlugin.hide(); // скрываем модалку загрузки
		HideWaitingDialog; // вешаем setInterval, если по какой-то причине WaitingDialog не завершился
	});
}

// формирование таблицы лотов
function CreatelotsTable(CurrentDocId) {
	var defer = jQuery.Deferred();
	var LotsTab = $("div[data-name='LotsTab']");
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	var formValues = '{CurrentDocId: '+CurrentDocId+'}';
		if (CurrentDocId) {	
			FormDictionaryHelperModule.getFormDictionaryItemsIds("LotsLink", dictFieldsInfo, formValues, function (data) {
				var parseData = JSON.parse(data.data);
				var Lots = parseData.children;
				var AddRowButton = $(LotsTab).find('.table-add-row-button')[0];
				
				if (Lots.length > 0) {
					Lots.forEach(function(item, i){
						addNewTableRow(AddRowButton, event); // создать новую строку
						var lastRow = $(LotsTab).find('[data-rowkey]').last(); // Определяем последнюю созданную строчку
							lastRow.find("input[name*='-Lot_IDonETP-']").val(item["Лот_ИД_Лота_на_ЭТП"]);
							lastRow.find("input[name*='-Lot_NumberInPurchsase-']").val(item["Лот_Номер_лота_в_извещении"]);
							lastRow.find("input[name*='-Lot_PurchsaseName-']").val(item["Лот_Предмет_договора"]);
						
					})
				}

				defer.resolve(); // положительный ответ промиса
			}, function (error) {
				
				defer.reject();  // отрицательный ответ промиса
				showCommonErrors(error);
			});
			
			LotsTab.find("div[class*='table-row-actions']").hide(); // скрываем кнопки дейсвтия у таблицы
			
			return defer.promise();
		}
	
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
	var LotsTab = $("div[data-name='LotsTab']");
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
function ColumnClearAndReadonly(Table, Arr) {
	Arr.forEach(function(item, i) {
		var current = $(Table).find("[data-field-name*='"+item+"']"); // текущий элемент

		current.prop('required', false);
		current.prop('checked', false);
		
		// убираем крсную полоску обязательности
		current.closest(".documentView-field-value").removeClass('has-error');
		
		if (current.attr('type') != 'checkbox') {
			$(Table).find("[name*='"+item+"']").val('');
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
		$("button[id='Lot_CancelLot']").prop('disabled', true);
		current.css({
			"background-color": "whitesmoke"
		})
		
		
	});	
}

// делаем кнопку редактируемым в таблице
function ColumnNotDisabled(Table, Arr) {
	Arr.forEach(function(item, i) {
		var current = $(Table).find("[data-field-name*='"+item+"']"); // текущий элемент

		$("button[id='Lot_CancelLot']").prop('disabled', false);
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