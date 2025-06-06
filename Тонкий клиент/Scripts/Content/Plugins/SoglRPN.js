
hideRPN();
function hideRPN(){
		let flag = $("input[data-field-name='SoglRPN']");
		let SoglRPN = $("input[name='RPN']");
		if ($(flag).is(":checked")) {
			SoglRPN.prop("required", true);
			SoglRPN.closest(".column-container").show();
			$("[data-related-field=RPN]").addClass("label-required");
			$("[data-related-field=RPN]").closest(".column-container").show();
		} else {
			SoglRPN.clear();
			SoglRPN.prop("required", false);	
			SoglRPN.closest(".column-container").hide();
			$("[data-related-field=RPN]").removeClass("label-required");
			$("[data-related-field=RPN]").closest(".column-container").hide();	
		}
	}
	
	
	$(document).on('change', "input[data-field-name='SoglRPN']", function (e) {
        hideRPN();        
    });
