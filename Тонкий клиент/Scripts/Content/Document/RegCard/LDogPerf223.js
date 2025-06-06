"use strict";

$(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
        /* var item = $(value); */
		var item = $("input[data-field-name*='PaymentInfos-Curs']");
        item.autoNumeric('init', {
            aSep: '',
            aDec: '.',
            vMin: '0.0000',
            vMax: "99999999999999999999999999999999999999999.9999",
            mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
            wEmpty: '',
            mRound: 'B'
        });
		var item1 = $("input[data-field-name*='Documents-PositionCurrency-']");
        item1.autoNumeric('init', {
            aSep: '',
            aDec: '.',
            vMin: '0.0000',
            vMax: "99999999999999999999999999999999999999999.9999",
            mDec: item1.attr('data-accuracy') ? item1.attr('data-accuracy') : '4',
            wEmpty: '',
            mRound: 'B'
        });
    });

var editreg = function () {
	$("li:has(:contains('Скрытые поля'))").hide();
	$("input[name='NumberSved']").parent().parent().attr("class", "col-xs-8 column-container");
	$("input[name='Neust']").parent().parent().parent().parent().parent().attr("class", "col-xs-4 column-container");
	$("input[data-field-name*='Documents-NamePozicii']").prop('readonly', true)
	var count = $("div[data-name='Positions'] div[data-rowkey]").length;
	if (count < 1) {
		$("div[data-name='Positions']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
		TableNum();
		$("div[data-name='Positions-1-Documents']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
		$("input[name='Positions-1-Documents-DocNumber-1']").val('1');		
		//$("input[name='Positions-1-Documents-PaymentNumber-1']").val('1');
		$("div[data-name='Positions-1-PaymentInfos']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
		$("input[name='Positions-1-PaymentInfos-PaymentNumber-1']").val('1');		
	};
	var rad = $("input[name='Positions-PosotionNumber-1']").closest(".table-edit-row").find(".table-row-selector-radio");
	rad.click();
	rad.prop('checked', true);
	$("div[data-name='Positions']").find(".table-edit-columns").css("cssText", "margin-right: 0px; padding-right: 0px");
	$("div[data-name='Positions']").closest('.table-edit-wrapper').css("cssText", "padding-bottom: 0px;");
}

$("div[data-name='Positions']").on('onTableRowRemoved', function (rowKey) {
	var count = $("div[data-name='Positions'] div[data-rowkey]").length;
	if (count < 1) {
		showCommonErrors('В таблице Позиции сведений об исполнении должна быть хотя бы одна строка');
		$("div[data-name='Positions']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
		$("div[data-name='Positions-1-Documents']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
		$("div[data-name='Positions-1-PaymentNumber']").children().children(".table-edit-row").children(".table-row-actions-left").children(".table-add-row-button").click();
		TableNum();
	};
});

$("div[data-name='Positions'] .table-add-row-button").click(function () {
	TableNum();
});

var TableNum = function () {
	var table = $("input[data-field-name*='Positions-PosotionNumber']").closest("div.table-content");
	var num = 0;
	table.children("div.table-edit-row").each(function () {
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='Positions-PosotionNumber-" + id + "']").val(num)
		}
	});
}

//на просмотр
var hideblockchangeview = function () {
	var Numberreg = $(".documentView-field-value[data-name='Номер редакции']").text();
	var ChangeView = $("li:has(:contains('Изменения'))");
	var forinput = ['Обоснование внесения изменений', 'Причина отмены сведений'];
	
	if (Numberreg > '1') {
		ChangeView.show();
		forinput.forEach(function(item, i, forinput) {
			$("input[name='"+item+"']").val('');
			$("input[name='"+item+"']").attr('value','');
			if (!$(".documentView-field-value[data-name='"+item+"']").attr("title")) {	
				$("div[data-name='"+item+"']").closest(".column-container").hide();	
			 } 
			 else {
				$("div[data-name='"+item+"']").closest(".column-container").show();
			 }
		});
	} else {
		ChangeView.hide();
	}
}

var neust = function () {
	var flag = $("input[data-field-name='Neust']");
	var InfNeust = $("textarea[name='InfNeust']");
	if ($(flag).is(":checked")) {
		InfNeust.closest(".column-container").show();
		InfNeust.prop("required", true);
		$("[data-related-field=InfNeust]").addClass("label-required");
		$("[data-related-field=InfNeust]").closest(".column-container").show();
	}
	else {
		InfNeust.closest(".column-container").hide();
		InfNeust.prop("required", false);
		$("[data-related-field=InfNeust]").removeClass("label-required");
		$("[data-related-field=InfNeust]").closest(".column-container").hide();
	}
}

$(document).on('change', "input[data-field-name='Neust']", function (e) {
	var flag = $("input[data-field-name='Neust']");
	var InfNeust = $("textarea[name='InfNeust']");
	if ($(flag).is(":checked")) {
		InfNeust.closest(".column-container").show();
		InfNeust.prop("required", true);
		$("[data-related-field=InfNeust]").addClass("label-required");
		$("[data-related-field=InfNeust]").closest(".column-container").show();
	}
	else {
		InfNeust.closest(".column-container").hide();
		InfNeust.prop("required", false);
		$("[data-related-field=InfNeust]").removeClass("label-required");
		$("[data-related-field=InfNeust]").closest(".column-container").hide();
		InfNeust.val("");
	}
});

/* $(document).on('change', "input[data-field-name*='Documents-Ostatok']", function (e) {	
	var q = $(this).val().replace(/ /g, '')*1;
	var w = parseFloat(q).toFixed(5);	
	$(this).autoNumeric('init', {
        aSep: '',
        aDec: '.',
        vMin: '0.00000',
        vMax: "99999999999999999999999999999999999999999.99999",
        wEmpty: '',
        mRound: 'B'
	});
	$(this).autoNumeric('set', w); 
	var IdPozicii = $(this).closest(".table-edit-row").find("input[name*='Documents-IdPozicii']").val();
	var Colvo = $(this).closest(".table-edit-row").find("input[name*='Documents-Colvo']").val();
	var s = $("div[data-name='Positions']").find(".table-row-row-view").find(".table-edit-row");
	var ost = 0;
	
	s.each(function () {
		var id = $(this).attr("data-rowkey");
		if (id != undefined) {
			var vvodost = $(this);
			var elem = $(this).closest(".table-edit-row").find("input[name*='Documents-IdPozicii']").val();
			if (elem == IdPozicii) {
				
				var vvod = vvodost.closest(".table-edit-row").find("input[name*='Documents-Ostatok']").val();
				var SumOst = vvod.replace(/ /g, '') * 1;
				var val = parseFloat(SumOst ? SumOst : 0);
				ost = ost + val;
				
			}
			
			var ostatok = ost
			if (ostatok > Colvo && elem == IdPozicii) {
				$(this).closest(".table-edit-row").find("input[name*='Documents-Ostatok']").val("");
				$(this).closest(".table-edit-row").find("input[name*='Documents-Ostatok']").autoNumeric('wipe');
				showCommonErrors('Превышен допустимый остаток по позиции')
			}
		}
		
	});
});
 */
var SumOpl = function () {
	var ps1 = $("input[data-field-name*='PaymentInfos-PaymentNumber']").closest("div.table-content");
	var summ = 0;
	
	ps1.children("div.table-edit-row").each(function () {
		var elemen = $(this).find("input[data-field-name*='PaymentInfos-SumOplRub']")
		
		if ($(elemen).length) {
			var s1 = elemen.val();
			var Price = s1.replace(/ /g, '') * 1;
			var val = parseFloat(Price ? Price : 0);
			summ = summ + val;
		}
	});
	
	$("input[name='itog']").val(summ);
}

$(document).on('change', "input[data-field-name*='PaymentInfos-Curs']", function (e) {
	SumOpl();
});


$("div[data-name='PaymentInfos']").on('onTableRowRemoved', function () {
	SumOpl();
});

/* $("div[data-deleted-attachment-keys='Positions_deletedAttachments'] div.table-add-row-button").click(function (ev, rowKey) {
	SumOpl();
	Valuta();
	$("input[name='Positions-Curs-"+rowKey.rowKey+"']").autoNumeric('init', {
	aSep: '',
	aDec: '.',
	vMin: '0.0000',
	vMax: "99999999999999999999999999999999999999999.99999",
	wEmpty: '',
	mRound: 'B'
    });
}); */

var nered = function() {
	var table = $("div[data-name='Positions']");
	var rows = table.find(".table-edit-row");
	rows.each(function (index, row) {
		mask(index);
	});
	$(table).on('onTableRowAdded', function (ev, rowKey) {
		mask(rowKey.rowKey); 
	});
var nestedrows = table.find(".table-row-row-view .table-edit-row[data-rowkey]");
nestedrows.each(function (index, row) {
});
}

function mask(rowKey) {
	SumOpl();
	//Valuta();
	$("input[name='PaymentInfos-Curs-"+rowKey+"']").autoNumeric('init', {
        aSep: '',
        aDec: '.',
        vMin: '0.00000',
        vMax: "99999999999999999999999999999999999999999.99999",
        wEmpty: '',
        mRound: 'B'
	});
}

function mask2() {
	$("input[name*='Documents-Ostatok']").autoNumeric('init', {
        aSep: '',
        aDec: '.',
        vMin: '0.00000',
        vMax: "99999999999999999999999999999999999999999.99999",
        wEmpty: '',
        mRound: 'B'
	});
}

$(document).on('change', "input[data-field-name*='PaymentInfos-SumOpl']", function (e) {
	var SumOpl1 = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOpl']").val();
	var Curs = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").val();
	var Currency_kod = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Currency_kod']").val();
	var SumOplRub = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']");
	
	if (Currency_kod == "RUB") {
		$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']").val(SumOpl1);
		} else {
		var SumOpl2 = SumOpl1.replace(/ /g, '') * 1;
		var val = parseFloat(SumOpl2 ? SumOpl2 : 0);
		var Curs1 = Curs.replace(/ /g, '') * 1;
		var val1 = parseFloat(Curs1 ? Curs1 : 0);
		var sumrub = val * val1;
		SumOplRub.autoNumeric('set', sumrub);
	}
	
	SumOpl()
	
});

$(document).on('change', "input[data-field-name*='PaymentInfos-Currency_kod']", function (e) {
	var SumOpl = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOpl']").val();
	var Curs = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").val();
	var Currency_kod = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Currency_kod']").val();
	var SumOplRub = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']").val();
	
	if (Currency_kod == "RUB") {
		$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']").val(SumOpl);
		$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").prop('readonly', true);
		$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").val("");
		$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").autoNumeric('wipe');
		} else {
		if (Curs != "") {
			var SumOpl1 = SumOpl.replace(/ /g, '') * 1;
			var val = parseFloat(SumOpl1 ? SumOpl1 : 0);
			var Curs1 = Curs.replace(/ /g, '') * 1;
			var val1 = parseFloat(Curs1 ? Curs1 : 0);
			var sumrub = val * val1;
			var SumOplRub1 = SumOplRub.replace(/ /g, '') * 1
			$(SumOplRub).autoNumeric('set', sumrub);
		}
		$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").prop('readonly', false);
	}
	//Valuta();
	CalculatePositionSumInRub();
	
});


$(document).on('change', "input[data-field-name*='PaymentInfos-Curs']", function (e) {
	var SumOpl = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOpl']").val();
	var Curs = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").val();
	var Currency_kod = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Currency_kod']").val();
	var SumOplRub = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']");
	
	if (Currency_kod == "RUB") {
		$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']").val(SumOpl);
		} else {
		if (Curs != "") {
			var SumOpl1 = SumOpl.replace(/ /g, '') * 1;
			var val = parseFloat(SumOpl1 ? SumOpl1 : 0);
			var Curs1 = Curs.replace(/ /g, '') * 1;
			var val1 = parseFloat(Curs1 ? Curs1 : 0);
			var sumrub = val * val1;
			SumOplRub.autoNumeric('set', sumrub);
		}
	}
	
	CalculatePositionSumInRub();
	
});

var SumRegEdit = function () {
	var s = $("div[data-name='PaymentInfos']").children().children(".table-edit-row");
	
	s.each(function () {
		var id = $(this).attr("data-rowkey");
		if (id != undefined) {
			var vvodost = $(this);
			var SumOpl = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOpl']").val();
			var Curs = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']").val();
			var Currency_kod = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Currency_kod']").val();
			var SumOplRub = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']").val();
			if (Currency_kod == "RUB") {
				$(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']").val(SumOpl);
				} else {
				if (Curs != "") {
					var SumOpl1 = SumOpl.replace(/ /g, '') * 1;
					var val = parseFloat(SumOpl1 ? SumOpl1 : 0);
					var Curs1 = Curs.replace(/ /g, '') * 1;
					var val1 = parseFloat(Curs1 ? Curs1 : 0);
					var sumrub = val * val1;
					var SumOplRub1 = SumOplRub.replace(/ /g, '') * 1
					$(SumOplRub).autoNumeric('set', sumrub);
				}
			}
			
		}
	});
	
}

$(document).on('change', "input[data-field-name*='Documents-registerPrice-']", function (e) {
	var registerPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-registerPrice-']").val();
	var PositionCurrency = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrency-']").val();
	var PositionCurrencyKod = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyKod-']").val();
	var PositionCurrencyPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyPrice-']");
	
	if (PositionCurrencyKod == "RUB") {
		$(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyPrice-']").val(registerPrice);
		} else {
		var SumOpl2 = registerPrice.replace(/ /g, '') * 1;
		var val = parseFloat(SumOpl2 ? SumOpl2 : 0);
		var Curs1 = PositionCurrency.replace(/ /g, '') * 1;
		var val1 = parseFloat(Curs1 ? Curs1 : 0);
		var sumrub = val * val1;
		PositionCurrencyPrice.autoNumeric('set', sumrub);
	}
	
});

$(document).on('change', "input[data-field-name*='Documents-PositionCurrency-']", function (e) {
	var registerPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-registerPrice-']").val();
	var PositionCurrency = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrency-']").val();
	var PositionCurrencyKod = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyKod-']").val();
	var PositionCurrencyPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyPrice-']");
	
	if (PositionCurrencyKod == "RUB") {
		$(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyPrice-']").val(registerPrice);
		} else {
		var SumOpl2 = registerPrice.replace(/ /g, '') * 1;
		var val = parseFloat(SumOpl2 ? SumOpl2 : 0);
		var Curs1 = PositionCurrency.replace(/ /g, '') * 1;
		var val1 = parseFloat(Curs1 ? Curs1 : 0);
		var sumrub = val * val1;
		PositionCurrencyPrice.autoNumeric('set', sumrub);
	}
	
});

$(document).on('change', "input[data-field-name*='Documents-Ostatok-']", function (e) {
	var Ostatok = $(this).closest(".table-edit-row").find("input[name*='Documents-Ostatok-']").val();
	var registerPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-registerPrice-']").val();
	var PositionCurrencyPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyPrice-']").val();
	var sumPozitionInRub = $(this).closest(".table-edit-row").find("input[name*='Documents-sumPozitionInRub-']");
	var sumPozition = $(this).closest(".table-edit-row").find("input[name*='Documents-sumPozition-']");
	
	var Ostatok1 = Ostatok.replace(/ /g, '') * 1;
	var val = parseFloat(Ostatok1 ? Ostatok1 : 0);
	var PositionCurrencyPrice1 = PositionCurrencyPrice.replace(/ /g, '') * 1;
	var val1 = parseFloat(PositionCurrencyPrice1 ? PositionCurrencyPrice1 : 0);
	var registerPrice1 = registerPrice.replace(/ /g, '') * 1;
	var val2 = parseFloat(registerPrice1 ? registerPrice1 : 0);
	var sumrub = val * val1;
	var sum = val * val2;
	sumPozitionInRub.autoNumeric('set', sumrub);
	sumPozition.autoNumeric('set', sum);
	
});

$(document).on('change', "input[data-field-name*='Documents-registerPrice-']", function (e) {
	var Ostatok = $(this).closest(".table-edit-row").find("input[name*='Documents-Ostatok-']").val();
	var registerPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-registerPrice-']").val();
	var PositionCurrencyPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyPrice-']").val();
	var sumPozitionInRub = $(this).closest(".table-edit-row").find("input[name*='Documents-sumPozitionInRub-']");
	var sumPozition = $(this).closest(".table-edit-row").find("input[name*='Documents-sumPozition-']");
	
	var Ostatok1 = Ostatok.replace(/ /g, '') * 1;
	var val = parseFloat(Ostatok1 ? Ostatok1 : 0);
	var PositionCurrencyPrice1 = PositionCurrencyPrice.replace(/ /g, '') * 1;
	var val1 = parseFloat(PositionCurrencyPrice1 ? PositionCurrencyPrice1 : 0);
	var registerPrice1 = registerPrice.replace(/ /g, '') * 1;
	var val2 = parseFloat(registerPrice1 ? registerPrice1 : 0);
	var sumrub = val * val1;
	var sum = val * val2;
	sumPozitionInRub.autoNumeric('set', sumrub);
	sumPozition.autoNumeric('set', sum);
	
});

$(document).on('change', "input[data-field-name*='Documents-PositionCurrency-']", function (e) {
	var Ostatok = $(this).closest(".table-edit-row").find("input[name*='Documents-Ostatok-']").val();
	var registerPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-registerPrice-']").val();
	var PositionCurrencyPrice = $(this).closest(".table-edit-row").find("input[name*='Documents-PositionCurrencyPrice-']").val();
	var sumPozitionInRub = $(this).closest(".table-edit-row").find("input[name*='Documents-sumPozitionInRub-']");
	var sumPozition = $(this).closest(".table-edit-row").find("input[name*='Documents-sumPozition-']");
	
	var Ostatok1 = Ostatok.replace(/ /g, '') * 1;
	var val = parseFloat(Ostatok1 ? Ostatok1 : 0);
	var PositionCurrencyPrice1 = PositionCurrencyPrice.replace(/ /g, '') * 1;
	var val1 = parseFloat(PositionCurrencyPrice1 ? PositionCurrencyPrice1 : 0);
	var registerPrice1 = registerPrice.replace(/ /g, '') * 1;
	var val2 = parseFloat(registerPrice1 ? registerPrice1 : 0);
	var sumrub = val * val1;
	var sum = val * val2;
	sumPozitionInRub.autoNumeric('set', sumrub);
	sumPozition.autoNumeric('set', sum);
	
});

$("div[data-deleted-attachment-keys*='Documents_deletedAttachments']").on('onTableRowRemoved', function (rowKey) {
	var e = $(this)
	var idBoss = $(this).closest(".table-edit-wrapper").parent().parent().attr("data-rowkey");
	var table = $(this).children(".table-content").children("div.table-edit-row");
	var num = 0;
	table.each(function () {
		var row = $(this);
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='Positions-" + idBoss + "-Documents-DocNumber-" + id + "']").val(num)
		}
	});
});

$("div[data-deleted-attachment-keys*='Documents_deletedAttachments'] .table-add-row-button").click(function () {
	mask2();
	var idBoss = $(this).closest(".table-content").closest(".table-edit-wrapper").parent().parent().attr("data-rowkey");
	var table = $(this).closest(".table-content").children("div.table-edit-row")
	var num = 0;
	table.each(function () {
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='Positions-" + idBoss + "-Documents-DocNumber-" + id + "']").val(num)
		}
	});
	validateFields();
});

$("div[data-deleted-attachment-keys*='PaymentInfos_deletedAttachments']").on('onTableRowRemoved', function (rowKey) {
	var e = $(this)
	var idBoss = $(this).closest(".table-edit-wrapper").parent().parent().attr("data-rowkey");
	var table = $(this).children(".table-content").children("div.table-edit-row");
	var num = 0;
	table.each(function () {
		var row = $(this);
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='Positions-" + idBoss + "-PaymentInfos-PaymentNumber-" + id + "']").val(num)
		}
	});
});

$("div[data-deleted-attachment-keys*='PaymentInfos_deletedAttachments'] .table-add-row-button").click(function () {
	var idBoss = $(this).closest(".table-content").closest(".table-edit-wrapper").parent().parent().attr("data-rowkey");
	var table = $(this).closest(".table-content").children("div.table-edit-row")
	var num = 0;
	table.each(function () {
		var current = $(this);
		var row = current.closest(".table-edit-row");
		var id = row.attr("data-rowkey");
		if (id != undefined) {
			num = num + 1;
			$("input[name='Positions-" + idBoss + "-PaymentInfos-PaymentNumber-" + id + "']").val(num)
		}
	});
	validateFields();
});

/* var Valuta = function () {
	var s = $("div[data-name='PaymentInfos']").children().children(".table-edit-row");
	
	s.each(function () {
		var id = $(this).attr("data-rowkey");
		if (id != undefined) {
			var Curs = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Curs']");
			var Currency_kod = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-Currency_kod']").val();
			var SumOplRub = $(this).closest(".table-edit-row").find("input[name*='PaymentInfos-SumOplRub']");
			if (Currency_kod == "RUB") {
				Curs.prop('readonly', true);
				Curs.val("");
				} else {
				Curs.prop('readonly', false);
			}
			
		}
	});
	
} */

var Neustoyka = function () {
	var info = $("div[data-name='Информация о неустойках']");
	var flag = $("div[data-name='Начисление неустоек']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		info.show();
		} else {
		info.hide();
	}
};

// Краткое содержание
var summary = function() {
	
	var ktatkoe = $("input[name='ktatkoe']");
	
	var name = $("input[name='preddog']");
	var nameOrg = $("input[name='registerOrgZa']");
	var resultString = function() {
		
		var result = "Организация-заказчик: " + nameOrg.val().trim() + " Предмет договора: " +  name.val().trim();		
		
		return result;
	};	
	ktatkoe.val(resultString());
	
	name.change(function() {
	    ktatkoe.val(resultString());
	});
	nameOrg.change(function() {
	    ktatkoe.val(resultString());
	});
};

var izmemenia = function() {
	var regstatus = $("input[name='regstatus']").val();
	var Obosn = $("textarea[name='Obosn']");
	var Revision = $("input[name='Revision']").val();
	var flag = $("input[data-field-name='otmenasved']");
	var Prich = $("textarea[name='Prich']");
	
	if ((regstatus == "Внесение изменений" || Revision >'1') && ($(flag).is(":checked")==false)){
		$("li:has(:contains('Изменения'))").show();
		Prich.closest(".column-container").hide();
		$("[data-related-field=Prich]").closest(".column-container").hide();
		Obosn.closest(".column-container").show();
		$("[data-related-field=Obosn]").show();
		Obosn.prop("required", true);
		Obosn.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=Obosn]").addClass("label-required");
	}
	else if ((regstatus == "Внесение изменений" || Revision >'1') && $(flag).is(":checked")){
		$("li:has(:contains('Изменения'))").show();
		Obosn.closest(".column-container").hide();
		$("[data-related-field=Obosn]").closest(".column-container").hide();
		Prich.closest(".column-container").show();
		$("[data-related-field=Prich]").show();
		Prich.prop("required", true);
		Prich.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=Prich]").addClass("label-required");
	}
	else{
		$("li:has(:contains('Изменения'))").hide();
	}
}

$(document).on('change', "input[data-field-name*='PaymentInfos-SumOpl']", function (e) {
	CalculatePositionSumInRub();
	//alert(summ);
});

function CalculatePositionSumInRub() {
	var s = $("div[data-name='Positions']").children().children(".table-edit-row");
	s.each(function () {
		var summ = 0;
		var id = $(this).attr("data-rowkey");
		if (id != undefined) {
			var table=$("div[data-name='Positions-"+id+"-PaymentInfos']");
			var row = table.children().children(".table-edit-row");
			row.each(function (index, element) {
				var idrow = $(this).attr("data-rowkey");
				if (idrow != undefined) {
				var s1 = $("input[name='Positions-" + id + "-PaymentInfos-SumOplRub-" + idrow + "']").val();
				var Price = s1.replace(/ /g, '') * 1;
				var val = parseFloat(Price ? Price : 0);
				summ = summ + val;
				}
			});
			$("input[name='Positions-PositionSumInRub-" + id + "']").autoNumeric('set', summ);
		}
	})
}

var validateFields = function () {
    $(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
        /* var item = $(value); */
		var item = $("input[data-field-name*='PaymentInfos-Curs']");
        item.autoNumeric('update', {
            aSep: '',
            aDec: '.',
            vMin: '0.0000',
            vMax: "99999999999999999999999999999999999999999.9999",
            mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
            wEmpty: '',
            mRound: 'B'
        });
		var item1 = $("input[data-field-name*='Documents-PositionCurrency-']");
        item1.autoNumeric('update', {
            aSep: '',
            aDec: '.',
            vMin: '0.0000',
            vMax: "99999999999999999999999999999999999999999.9999",
            mDec: item1.attr('data-accuracy') ? item1.attr('data-accuracy') : '4',
            wEmpty: '',
            mRound: 'B'
        });
    }); 
	var s = $("div[data-name='PaymentInfos']").children().children(".table-edit-row");
	
};

function handleCustomDictionary(dict, dictname) {
	
	if(dictname === 'Документы исполнения')
	{
		var table = $('.table-content:first');        
        var newRows = table.find('[data-table-name*="Documents"]').find('.new-table-row');
        newRows.each(function () {
            var newRow = {};// = JSON.parse(JSON.stringify(dict.children[0]));

            var docId = $(this).find('[data-field-name="Номер документа"]:first').children(':first').prop("value");
            var rowId = $(this).find('[data-field-name="Номер"]:first').children(':first').prop("value");
            var sum = $(this).closest(".table-content").closest(".table-edit-row").find('[data-field-name="Номер"]:first').children(':first').prop("value")

            if (docId !== '') {
				newRow.leaf = true;
				newRow.enabled = true;
                newRow.expanded = false;
				
				newRow.id = docId;
                newRow.code = docId;
                newRow["Номер строки"] = rowId;
                newRow["Номер документа"] = docId;
                newRow["Номер"] = sum;

                dict.children.push(newRow);
            }

        });
	}
}

function ViewfiledHide(Arr) {
	Arr.forEach(function(item, i) {
		$("div .documentView-field-value[data-name='"+item+"']").closest('.column-container').hide();
	});
}

function notpulicView(){
	var notpulic = $(".documentView-field-value[data-name='Не публиковать в ЕИС']").attr("title");
	if (notpulic=="1") {
		ViewfiledHide(['Номер договора в ЕИС', 'Фактическая дата размещения', 'Ссылка на документ в ЕИС-е', 'Номер сведений о завершении договора']);
	}
}

//scopes.onRegister(processPosition);
scopes.onRegister(neust);
scopes.onRegister(SumRegEdit);
scopes.onRegister(nered);
scopes.onRegister(editreg);
scopes.onRegister(SumOpl);
//scopes.onRegister(Valuta);
scopes.onRegister(summary);
scopes.onRegister(izmemenia);
scopes.onRegister(validateFields);

scopes.onEdit(izmemenia);
//scopes.onEdit(processPosition);
scopes.onEdit(nered);
scopes.onEdit(editreg);
scopes.onEdit(SumRegEdit);
scopes.onEdit(SumOpl);
scopes.onEdit(neust);
//scopes.onEdit(Valuta);
scopes.onEdit(mask2);
scopes.onEdit(summary);
//scopes.onEdit(AvansPro);
scopes.onEdit(validateFields);

scopes.onView(hideblockchangeview);
scopes.onView(Neustoyka);	
scopes.onView(notpulicView);	