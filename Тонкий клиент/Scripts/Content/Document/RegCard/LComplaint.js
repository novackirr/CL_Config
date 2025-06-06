
$("#documentView-controlCard-accordion").hide();

$("#registerView-controlCard-accordion").hide();
/* $("#registerView-documentLinks-accordion").hide(); */
var EditReg = function () {

	$("li:has(:contains('Скрытые поля'))").hide();

}

var Change = function () {
	var predgaolob = $("input[name='predgaolob']");
	var NumIzvesh = $("input[name='NumIzvesh']");
	var Numlot = $("input[name='Numlot']");
	var OpisLot = $("textarea[name='OpisLot']");
	var PeriodPlan = $("input[name='PeriodPlan']");
	var OpisPlanZak = $("textarea[name='OpisPlanZak']");
	var OpisPlanGraph = $("textarea[name='OpisPlanGraph']");
	predgaolob.change(function () {
		if (predgaolob.val() == "Закупка") {
			NumIzvesh.show();
			NumIzvesh.prop("required", true);
			NumIzvesh.closest(".control-label").addClass("label-required");
			$("[data-related-field=NumIzvesh").show();
			$("[data-related-field=NumIzvesh]").addClass("label-required");

			Numlot.show();
			$("[data-related-field=Numlot").show();

			OpisLot.show();
			$("[data-related-field=OpisLot").show();

		} else {
			NumIzvesh.hide();
			NumIzvesh.prop("required", false);
			NumIzvesh.closest(".control-label").removeClass("label-required");
			$("[data-related-field=NumIzvesh").hide();
			$("[data-related-field=NumIzvesh]").removeClass("label-required");

			Numlot.hide();
			$("[data-related-field=Numlot").hide();

			OpisLot.hide();
			$("[data-related-field=OpisLot").hide();

		}

		if (predgaolob.val() == "План закупки") {

			PeriodPlan.show();
			PeriodPlan.prop("required", true);
			PeriodPlan.closest(".control-label").addClass("label-required");
			$("[data-related-field=PeriodPlan").show();
			$("[data-related-field=PeriodPlan]").addClass("label-required");

			OpisPlanZak.show();
			OpisPlanZak.prop("required", true);

			OpisPlanZak.closest(".control-label").addClass("label-required");
			$("[data-related-field=OpisPlanZak").show();
			$("[data-related-field=OpisPlanZak]").addClass("label-required");

		} else {

			PeriodPlan.hide();
			PeriodPlan.prop("required", false);
			PeriodPlan.closest(".control-label").removeClass("label-required");
			$("[data-related-field=PeriodPlan").hide();
			$("[data-related-field=PeriodPlan]").removeClass("label-required");

			OpisPlanZak.hide();
			OpisPlanZak.prop("required", false);
			OpisPlanZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=OpisPlanZak").hide();
			$("[data-related-field=OpisPlanZak]").removeClass("label-required");

		}

		if (predgaolob.val() == "План-график") {
			OpisPlanGraph.show();
			OpisPlanGraph.prop("required", true);
			OpisPlanGraph.closest(".control-label").addClass("label-required");
			$("[data-related-field=OpisPlanGraph").show();
			$("[data-related-field=OpisPlanGraph]").addClass("label-required");

		} else {
			OpisPlanGraph.hide();
			OpisPlanGraph.prop("required", false);
			OpisPlanGraph.closest(".control-label").removeClass("label-required");
			$("[data-related-field=OpisPlanGraph").hide();
			$("[data-related-field=OpisPlanGraph]").removeClass("label-required");

		}

	});
	predgaolob.change();

}

scopes.onEdit(Change);

scopes.onRegister(EditReg);
scopes.onRegister(Change);

scopes.onEdit(EditReg);
