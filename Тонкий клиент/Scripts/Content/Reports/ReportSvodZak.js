$(document).on('change', "input[name='month']", function (e) {
	var quarterPlanFrom=$("input[name='quarterPlanFrom']");
	var quarterPlanTo=$("input[name='quarterPlanTo']");
    var val = $("input[name='month']").val();
    if(val != ""){
		quarterPlanFrom.closest(".column-container").hide();
		quarterPlanTo.closest(".column-container").hide();
	}
	else{
		quarterPlanFrom.closest(".column-container").show();
		quarterPlanTo.closest(".column-container").show();
	}
});

$(document).on('change', "input[name='quarterPlanFrom']", function (e) {
	var quarterPlanFrom=$("input[name='quarterPlanFrom']");
	var quarterPlanTo=$("input[name='quarterPlanTo']");
	var month=$("input[name='month']");
    if(quarterPlanFrom.val() != ""){
		month.closest(".column-container").hide();
		$("input[data-field-name='quarterPlanFrom']").prop("required", true);
		quarterPlanFrom.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=quarterPlanFrom]").addClass("label-required");
		$("input[data-field-name='quarterPlanTo']").prop("required", true);
		quarterPlanTo.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=quarterPlanTo]").addClass("label-required");
		/* month.closest(".clearfix").find(".dict-display-field").prop("required", false); */
	}
	else if (quarterPlanFrom.val() == "" && quarterPlanTo.val() == ""){
		month.closest(".column-container").show();
		$("input[data-field-name='quarterPlanFrom']").prop("required", false);
		quarterPlanFrom.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=quarterPlanFrom]").removeClass("label-required");
		$("input[data-field-name='quarterPlanTo']").prop("required", false);
		quarterPlanTo.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=quarterPlanTo]").removeClass("label-required");
	}
});

$(document).on('change', "input[name='quarterPlanTo']", function (e) {
	var quarterPlanFrom=$("input[name='quarterPlanFrom']");
	var quarterPlanTo=$("input[name='quarterPlanTo']");
	var month=$("input[name='month']");
    if(quarterPlanTo.val() != ""){
		month.closest(".column-container").hide();
		$("input[data-field-name='quarterPlanFrom']").prop("required", true);
		quarterPlanFrom.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=quarterPlanFrom]").addClass("label-required");
		$("input[data-field-name='quarterPlanTo']").prop("required", true);
		quarterPlanTo.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=quarterPlanTo]").addClass("label-required");
	}
	else if (quarterPlanFrom.val() == "" && quarterPlanTo.val() == ""){
		month.closest(".column-container").show();
		$("input[data-field-name='quarterPlanFrom']").prop("required", false);
		quarterPlanFrom.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=quarterPlanFrom]").removeClass("label-required");
		$("input[data-field-name='quarterPlanTo']").prop("required", false);
		quarterPlanTo.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=quarterPlanTo]").removeClass("label-required");
	}
});
