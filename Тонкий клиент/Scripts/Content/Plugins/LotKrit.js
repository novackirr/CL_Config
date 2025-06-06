// function krit() {        
//     var Tab = $("input[name*='CritTab-widthCrit-']").length;
//     var CritTab = $("input[name*='CritTab-widthCrit-']");
//     var summ = 0;       
//         for (var i = 0; i < Tab; i++) {
//             var s2 = $(CritTab[i]).autoNumeric('get');    
//                     var Crit = parseFloat(s2 ? s2 : 0);
//                     summ = summ + Crit;
//                         if (summ!=1) {
//                             showCommonErrors("Сумма весов всех критериев должна быть равна 1");
//                             $("input[name*='CritTab-widthCrit-']").clear();
//                         }
//                 }
//             }

// $(document).on('change', "input[name*='CritTab-widthCrit-']", function (e) {
//     krit();
// });
$("input[name='krit']").prop('checked', true);
$("input[name='krit']").val('1');
function checkkrit() {
    let krit = $("input[name='krit']");
    krit.prop('checked', true);
	 $("input[name='ColvoKrit']").val($("div[data-name='CritTab']").find("[data-rowkey]").length)
}

checkkrit();

function SummaKrit() {
    var ps1 = $("input[data-field-name*='CritTab-critName']").closest("div.table-content");
    var summ = 0;

    ps1.children("div.table-edit-row").each(function () {
        var elemen = $(this).find("input[data-field-name*='CritTab-widthCrit']")

        if ($(elemen).length) {
            var s1 = elemen.val();
            var Price = s1.replace(/ /g, '') * 1;
            var val = parseFloat(Price ? Price : 0);
            summ = summ + val;
        }
    });

    $("input[name='sumcrit']").val(summ);

    var itogsum = $("input[name='sumcrit']").val(summ);
    var test = parseFloat(itogsum ? itogsum : 0)
}

SummaKrit();

$(document).on('change', "input[data-field-name*='CritTab-widthCrit']", function (e) {
    var ves = $(this).autoNumeric('get');
	if (ves == '0'){
		$(this).autoNumeric('wipe');
		showCommonErrors('Вес критерия не может быть равен нулю');
	}
	SummaKrit();
});

$("div[data-name='CritTab']").on('onTableRowRemoved', function () {
    SummaKrit();
	$("input[name='ColvoKrit']").val($("div[data-name='CritTab']").find("[data-rowkey]").length)
});

$("div[data-name='CritTab'] .table-add-row-button").click(function () {
	$("input[name='ColvoKrit']").val($("div[data-name='CritTab']").find("[data-rowkey]").length)
});