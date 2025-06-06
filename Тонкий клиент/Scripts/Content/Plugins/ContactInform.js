var editreg = function () {
	var naimETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text() 	
	$("input[data-field-name='CountryCodeTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CountryCodeTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='CityCodeTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CityCodeTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='Tel']").inputmask({ mask: '9{5,8}', greedy: false });
	$("input[data-field-name='Tel']").attr("data-parsley-pattern", "\\d{5,8}");
	$("input[data-field-name='AdditionalTel']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='AdditionalTel']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='CountryCodeFax']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CountryCodeFax']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='CityCodeFax']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='CityCodeFax']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='Fax']").inputmask({ mask: '9{5,8}', greedy: false });
	$("input[data-field-name='Fax']").attr("data-parsley-pattern", "\\d{5,8}");
	$("input[data-field-name='AdditionalFax']").inputmask({ mask: '9{1,4}', greedy: false });
	$("input[data-field-name='AdditionalFax']").attr("data-parsley-pattern", "\\d{1,4}");
	$("input[data-field-name='naimETP']").hide();
	if ($(".documentView-field-value[data-name='Наименование ЭТП']").text() == 'АО "МСП-ЕЭТП"')  {
		$("textarea[data-field-name='kontDop']").prop("required", true);
		$("[data-related-field=kontDop]").addClass("label-required");
	}
	$("input[data-field-name='naimETP']").val(naimETP);
}

editreg();

var rebuildFieldPhone = function () {
	var CountryCodeTel = $("input[data-field-name='CountryCodeTel']");
	var CityCodeTel = $("input[data-field-name='CityCodeTel']");
	var Tel = $("input[data-field-name='Tel']");
	var AdditionalTel = $("input[data-field-name='AdditionalTel']");
	var kontTel = $("input[data-field-name='kontTel']");
	var kontTelETP = $("input[data-field-name='kontTelETP']");
        var result = [];
		var resultETP = [];

        if (CountryCodeTel.val()) {
            result.push("" + CountryCodeTel.val());
			resultETP.push("" + CountryCodeTel.val());
        }
		
		if (CityCodeTel.val()) {
            result.push("-" + CityCodeTel.val());
			resultETP.push("-" + CityCodeTel.val());
        }
		
		if (Tel.val()) {
            result.push("-" + Tel.val());
			resultETP.push("-" + Tel.val());
        }
		
		if (AdditionalTel.val()) {
            result.push("-" + AdditionalTel.val());
        }
		
        kontTel.val(result.join(""));
		kontTelETP.val(resultETP.join(""));
    }
	
	$(document).on('change', "input[data-field-name='CountryCodeTel']", function (e) {	
		rebuildFieldPhone()
	});
	
	$(document).on('change', "input[data-field-name='CityCodeTel']", function (e) {	
		rebuildFieldPhone()
	});
	
	$(document).on('change', "input[data-field-name='Tel']", function (e) {	
	rebuildFieldPhone();	
	});
	
	$(document).on('change', "input[data-field-name='AdditionalTel']", function (e) {	
	rebuildFieldPhone();	
	});

var splitPhone = function () {
	var CountryCodeTel = $("input[data-field-name='CountryCodeTel']");
	var CityCodeTel = $("input[data-field-name='CityCodeTel']");
	var Tel = $("input[data-field-name='Tel']");
	var AdditionalTel = $("input[data-field-name='AdditionalTel']");
	var kontTel = $("input[data-field-name='kontTel']");
	var kontTelETP = $("input[data-field-name='kontTelETP']");
	
	if (kontTel.val()!="") {
	var array = $("input[data-field-name='kontTel']").val().split('-');
	
	if (array[0]!=undefined) {
	CountryCodeTel.val(array[0]);
	}
	if (array[1]!=undefined) {
	CityCodeTel.val(array[1]);
	}
	if (array[2]!=undefined) {
    Tel.val(array[2]);
	}
	if (array[3]!=undefined) {
	AdditionalTel.val(array[3]);
	}
	}
    }
    
    splitPhone();
	
var rebuildFieldFax = function () {
	var CountryCodeFax = $("input[data-field-name='CountryCodeFax']");
	var CityCodeFax = $("input[data-field-name='CityCodeFax']");
	var Fax = $("input[data-field-name='Fax']");
	var AdditionalFax = $("input[data-field-name='AdditionalFax']");
	var kontFax = $("input[data-field-name='kontFax']");
	var kontFaxETP = $("input[data-field-name='kontFaxETP']");
        var result = [];
		var resultETP = [];

        if (CountryCodeFax.val()) {
            result.push("" + CountryCodeFax.val());
			resultETP.push("" + CountryCodeFax.val());
        }
		
		if (CityCodeFax.val()) {
            result.push("-" + CityCodeFax.val());
			resultETP.push("-" + CityCodeFax.val());
        }
		
		if (Fax.val()) {
            result.push("-" + Fax.val());
			resultETP.push("-" + Fax.val());
        }
		
		if (AdditionalFax.val()) {
            result.push("-" + AdditionalFax.val());
        }
		
        kontFax.val(result.join(""));
		kontFaxETP.val(resultETP.join(""));
    }
	
	$(document).on('change', "input[data-field-name='CountryCodeFax']", function (e) {	
		rebuildFieldFax()
	});
	
	$(document).on('change', "input[data-field-name='CityCodeFax']", function (e) {	
		rebuildFieldFax()
	});
	
	$(document).on('change', "input[data-field-name='Fax']", function (e) {	
	rebuildFieldFax();	
	});
	
	$(document).on('change', "input[data-field-name='AdditionalFax']", function (e) {	
	rebuildFieldFax();	
    });
    

var splitFax = function () {
	var CountryCodeFax = $("input[data-field-name='CountryCodeFax']");
	var CityCodeFax = $("input[data-field-name='CityCodeFax']");
	var Fax = $("input[data-field-name='Fax']");
	var AdditionalFax = $("input[data-field-name='AdditionalFax']");
	var kontFax = $("input[data-field-name='kontFax']");
	var kontFaxETP = $("input[data-field-name='kontFaxETP']");
	
	if (kontFax.val()!="") {
	var array = $("input[data-field-name='kontFax']").val().split('-');
	
	if (array[0]!=undefined) {
	CountryCodeFax.val(array[0]);
	}
	if (array[1]!=undefined) {
	CityCodeFax.val(array[1]);
	}
	if (array[2]!=undefined) {
    Fax.val(array[2]);
	}
	if (array[3]!=undefined) {
	AdditionalFax.val(array[3]);
	}
	}
    }
    
    splitFax();