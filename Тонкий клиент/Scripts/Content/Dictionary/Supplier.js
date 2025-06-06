$(document).ready(function () {	
	PochtAdress();
	var inn = $("input[name='inn']");
	var nerezident = $("input[name='nerezident']");
	var smp = $("input[name='smp']");
	var sostuch = $("input[name='sostuch']");
	var TaxDate = $("input[name='TaxDate']");
	var kpp = $("input[name='kpp']");
	var ogrn = $("input[name='ogrn']");
	var okopf = $("input[name='okopf']");
	var oktmocode = $("input[name='oktmocode']");
	var okpo = $("input[name='okpo']");
	var Type = $("input[name='Type']");
	var TypeVal = $("input[name='Type']").val();
	var Strana = $("input[name='Strana']");
	var IdNumber = $("input[name='IdNumber']");
	var DopIdNumber = $("input[name='DopIdNumber']");
	var surname = $("input[name='surname']");
	var name = $("input[name='name']");
	var patronymic = $("input[name='patronymic']");	
	var regionCodee = $("input[name='regionCodee']");
	var Pnone = $("input[name='Pnone']");	
	var Email = $("input[name='Email']");
	var agent = $("input[name='code']");
	var catSMP = $("input[name='catSMP']");
	var CountryCode = $("input[data-field-name='CountryCode']");
	var RegionCode = $("input[data-field-name='RegionCode']");
	var NumberPhone = $("input[data-field-name='NumberPhone']");
	var AddPhone = $("input[data-field-name='AddPhone']");
	var Pnone = $("input[data-field-name='Pnone']");
	var Address = $("textarea[data-field-name='MailAddress']");
    var indeks = $("input[data-field-name='indeks']");
	var region = $("input[data-field-name='region']");
	var area1 = $("input[data-field-name='area']");
	var city = $("input[data-field-name='city']");
	var punct = $("input[data-field-name='punct']");
	var street = $("input[data-field-name='street']");
	var house = $("input[data-field-name='house']");
	var corpus = $("input[data-field-name='corpus']");
	var office = $("input[data-field-name='office']");
	var IDEETP = $("input[name='naimETPID']").val()
	
	
	
	/* inn.inputmask({ mask: '9{1,12}', greedy: false }); */
	inn.inputmask({ mask: '(9999999999)|(999999999999)', greedy: false });
	inn.attr("data-parsley-pattern", "\\d{1,12}");
	//indeks.inputmask({ mask: '(9)|(99)|(999)|(9999)|(99999)|(999999)|(9999999)', greedy: false });
	indeks.attr("maxlength",6);
	kpp.inputmask({ mask: '999999999', greedy: false });
	kpp.attr("data-parsley-pattern", "\\d{9}");
	ogrn.inputmask({ mask: '(9999999999999)|(999999999999999)', greedy: false });	
	ogrn.attr("data-parsley-pattern", "\\d{13}|\\d{15}");
	okpo.inputmask({ mask: '(99999999)|(9999999999)', greedy: false });
	okpo.attr("data-parsley-pattern", "\\d{1,10}");
	oktmocode.inputmask({ mask: '(99999999)|(99999999999)', greedy: false });
	oktmocode.attr("data-parsley-pattern", "\\d{1,11}");
	IdNumber.inputmask({ mask: '9{1,20}', greedy: false });	
	IdNumber.attr("data-parsley-pattern", "\\d{1,20}");
	surname.inputmask({ mask: '*{1,50}', greedy: false});
	name.inputmask({ mask: '*{1,50}', greedy: false});
	patronymic.inputmask({ mask: '*{1,50}', greedy: false });
	
	CountryCode.inputmask({ mask: '9{1,4}', greedy: false });
	CountryCode.attr("data-parsley-pattern", "\\d{1,4}");
	RegionCode.inputmask({ mask: '9{1,4}', greedy: false });
	RegionCode.attr("data-parsley-pattern", "\\d{1,4}");
	NumberPhone.inputmask({ mask: '9{1,8}', greedy: false });
	NumberPhone.attr("data-parsley-pattern", "\\d{1,8}");
	AddPhone.inputmask({ mask: '9{1,4}', greedy: false });
	AddPhone.attr("data-parsley-pattern", "\\d{1,4}");	
/* 	Email.attr("data-parsley-type", "email"); */

	ChangeTypeCusomerLogic(); // Вызов основной функции
	
	$(document).on('change', "input[data-field-name='Type']", function (e) {	
		ChangeTypeCusomerLogic()
		if (inn.val()!='' || kpp.val()!=''){
			agent.val((inn.val() + kpp.val()).replace(/_/g, ''));
		}
		else{
			agent.val($("textarea[name='nameagent']").val());
		}
	});
	$(document).on('change', "input[data-field-name='nerezident']", function (e) {	
		IndividalLogic();
		sostuchLogic();
		nerezidentLogic();
	});
	$(document).on('change', "input[data-field-name='sostuch']", function (e) {	
		IndividalLogic();
		sostuchLogic();
		nerezidentLogic();
	});		
	
	function ChangeTypeCusomerLogic() {
		var Type = $("input[name='Type']").val();
		//ЕСли юридическое или физическое лицо РФ
		if (['U', 'P'].indexOf(Type) > -1) {
			filedShow(['okpo', 'okopf', 'ogrn', 'oktmocode']);
			filedShowAndRequired(['regionCodee', 'area']);
			filedNotRequired(['surname', 'name', 'patronymic']);
			
			$("input[data-field-name='nerezident']").prop('checked', false);
			$("input[data-field-name='nerezident']").readonly(false);
			$("input[data-field-name='sostuch']").prop('checked', true);
			$("input[data-field-name='sostuch']").readonly();	
			
			// Если сбер АСТ
			if (IDEETP == 2) {
				if (['U'].indexOf(Type) > -1) {
					filedShowAndRequired(['oktmocode', 'street', 'office']);
				}
				else {
					filedNotRequired(['oktmocode', 'street', 'office']);
				}
			}
		}
		else if (['UF', 'PF'].indexOf(Type) > -1) {
			
			$("input[data-field-name='nerezident']").prop('checked', true);
			$("input[data-field-name='nerezident']").readonly();
			$("input[data-field-name='sostuch']").readonly(false);
			
			filedClearAndHide(['okpo', 'okopf', 'ogrn', 'oktmocode', 'regionCodee', 'region', 'area']);
			filedNotRequired([ 'street', 'office']);
			okopf.change();
			
			if (['PF'].indexOf(Type) > -1) {
				filedShowAndRequired(['surname', 'name', 'patronymic']);
			}
		}
		
		IndividalLogic();
		sostuchLogic();
		nerezidentLogic();
	}
	function IndividalLogic() {
		// Физические лица
		if( $("input[name='Type']").val()  == 'PF' || $("input[name='Type']").val()  == 'P'){	
			okopf.prop("required", false);
			$("input[data-field-name='okopf']").prop("required", false);
			$("[data-related-field=okopf]").removeClass("label-required");
			okpo.prop("required", false);
			$("[data-related-field=okpo]").removeClass("label-required");
			kpp.prop("required", false);
			$("input[data-field-name='kpp']").prop("required", false);
			$("div[data-related-field='kpp']").removeClass("label-required");
		} else {
			kpp.prop("required", true);
			$("div[data-related-field='kpp']").addClass("label-required");
			okopf.prop("required", true);
			$("input[data-field-name='okopf']").prop("required", true);
			$("[data-related-field=okopf]").addClass("label-required");
			okpo.prop("required", true);
			$("[data-related-field=okpo]").addClass("label-required");
		}
	}

	function nerezidentLogic() {
		if ($("input[name='nerezident']").is(":checked")){
			IdNumber.prop("required", true);
			$("[data-related-field=IdNumber]").addClass("label-required");
			IdNumber.closest(".column-container").closest(".column-container").show();
			$("[data-related-field=IdNumber]").closest(".column-container").show();
			DopIdNumber.closest(".column-container").closest(".column-container").show();
			$("[data-related-field=DopIdNumber]").closest(".row-container").show();
			okopf.prop("required", false);
			$("input[data-field-name='okopf']").prop("required", false);
			$("[data-related-field=okopf]").removeClass("label-required");
			okpo.prop("required", false);
			$("[data-related-field=okpo]").removeClass("label-required");
		}
		else{
			IdNumber.prop("required", false);
			$("[data-related-field=IdNumber]").removeClass("label-required");
			IdNumber.val('');
			DopIdNumber.closest(".column-container").closest(".column-container").hide();
			$("[data-related-field=DopIdNumber]").closest(".row-container").hide();
			DopIdNumber.val('')
		}
	}
			
	function sostuchLogic() {
		if ($("input[name='sostuch']").is(":checked")){
			TaxDate.prop("required", true);
			$("[data-related-field=TaxDate]").addClass("label-required");
			TaxDate.closest(".column-container").closest(".column-container").show();
			inn.prop("required", true);
			$("[data-related-field=inn]").addClass("label-required");
			inn.closest(".column-container").closest(".column-container").show();
			if ($("input[name='Type']").val()  != 'PF' && $("input[name='Type']").val()  != 'P') {
				kpp.prop("required", true);
				$("[data-related-field=kpp]").addClass("label-required");
				kpp.closest(".column-container").closest(".column-container").show();
			} else{
				kpp.prop("required", false);
				$("[data-related-field=kpp]").removeClass("label-required");
				kpp.closest(".column-container").closest(".column-container").hide();
				kpp.val('')
			}
		}
		else{
			TaxDate.prop("required", false);
			$("[data-related-field=TaxDate]").removeClass("label-required");
			TaxDate.closest(".column-container").closest(".column-container").hide();
			TaxDate.val('')
			inn.prop("required", false);
			$("[data-related-field=inn]").removeClass("label-required");
			inn.closest(".column-container").closest(".column-container").hide();
			inn.val('')
			kpp.prop("required", false);
			$("[data-related-field=kpp]").removeClass("label-required");
			kpp.closest(".column-container").closest(".column-container").hide();
			kpp.val('')
		}
	}
	
	
	surname.change(function () {
		var surnameVal = $(this).val();
		if( surnameVal != "" && surnameVal != " "){
			name.prop("required", true);
			$("[data-related-field=name]").addClass("label-required");	
		}else{
			name.prop("required", false);
			$("[data-related-field=name]").removeClass("label-required");	
		};	
	});
	name.change(function () {
		var nameVal = $(this).val();
		if( nameVal != "" && nameVal != " "){
			surname.prop("required", true);
			$("[data-related-field=surname]").addClass("label-required");	
		}else{
			surname.prop("required", false);
			$("[data-related-field=surname]").removeClass("label-required");	
		};	
	});
	
	
	smp.change(function () {
		if(smp.is(":checked")){
			$("input[data-field-name=catSMP]").prop("required", true);
			$("[data-related-field=catSMP]").addClass("label-required");
			catSMP.closest(".column-container").closest(".column-container").show();
			$("[data-related-field=catSMP]").closest(".column-container").show();
		} else{
			catSMP.closest(".column-container").closest(".column-container").hide();
			$("[data-related-field=catSMP]").closest(".column-container").hide();
			catSMP.val('');
			$("input[data-field-name='catSMP']").val('');
			$("input[data-field-name=catSMP]").prop("required", false);
			$("[data-related-field=surname]").removeClass("label-required");
		}
	});
	smp.change();
	inn.change(function () {
		if (inn.val()!='' || kpp.val()!=''){
			agent.val((inn.val() + kpp.val()).replace(/_/g, ''));
		}
		else{
			agent.val($("textarea[name='nameagent']").val());
		}
		
	});
	
	kpp.change(function () {
		if (inn.val()!='' || kpp.val()!=''){
			agent.val((inn.val() + kpp.val()).replace(/_/g, ''));
		}
		else{
			agent.val($("textarea[name='nameagent']").val());
		}
	});	
	
	$("textarea[name='nameagent']").change(function () {
		if (inn.val()!='' || kpp.val()!=''){
			agent.val((inn.val() + kpp.val()).replace(/_/g, ''));
		}
		else{
			agent.val($("textarea[name='nameagent']").val());
		}
	});	

    function rebuildField() {
        var result = [];

        if (indeks.val()) {
            result.push("" + indeks.val());
        }
		
		if (region.val()) {
            result.push(", " + region.val());
        }
		
		if (area1.val()) {
            result.push(", " + area1.val() + " район");
        }
		
		if (city.val()) {
            result.push(", г." + city.val());
        }
		
		if (punct.val()) {
            result.push(", " + punct.val());
        }
		
		if (street.val()) {
            result.push(", " + street.val());
        }
		
		if (house.val()) {
            result.push(", д." + house.val());
        }
		
		if (corpus.val()) {
            result.push("-" + corpus.val());
        }
		
		if (office.val()) {
            result.push(", офис " + office.val());
        }

        Address.val(result.join(""));
		var flag = $("input[data-field-name='PriznakAddress']");
	    if ($(flag).is(":checked")) {
	    var Post = $("textarea[data-field-name='MailAddress']").val();
	    $("textarea[data-field-name='ActualAddress']").val(Post);
		}
    }
	
	$(document).on('change', "input[data-field-name='indeks']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='region']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='area']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='city']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='punct']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='street']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='house']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='corpus']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "input[data-field-name='office']", function (e) {	
		rebuildField()
	});
	
	$(document).on('change', "textarea[data-field-name='Address']", function (e) {	
	PochtAdress();	
	});
	
	$(document).on('change', "input[data-field-name='PriznakAddress']", function (e) {	
	PochtAdress();	
	});

function PochtAdress() {
	var flag = $("input[data-field-name='PriznakAddress']");
		if ($(flag).is(":checked")) {
		$("textarea[data-field-name='ActualAddress']").closest(".column-container").hide();
		var Post = $("textarea[data-field-name='MailAddress']").val();
		$("textarea[data-field-name='ActualAddress']").val(Post);
	} else {
		$("textarea[data-field-name='ActualAddress']").closest(".column-container").show();
		//$("textarea[data-field-name='ActualAddress']").val("");
	}
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

//отобразить и сделать необязательным
function filedNotRequired (Arr) {
	if (Arr.length>0) {
		Arr.forEach(function(item, i){
			var current = $("[data-field-name='"+item+"']")
			current.prop('required', false);
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
			
			// Если поле типа Справочник
			if (current.hasClass('dict-display-field')) {
				current.closest('.column-container').find("[class*='has-error']").removeClass('has-error')
			}
		})
	}
}

// скрываем поля
function filedHideAndNotRequired(Arr) {
	Arr.forEach(function(item, i) {
		$("[data-field-name='"+item+"']").closest('.column-container').hide();
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide();
		$("[data-field-name='"+item+"']").prop('required', false);
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
	});
}

// чистим и скрываем поля
function filedClearAndHide(Arr) {
	Arr.forEach(function(item, i) {
		var current = $("[data-field-name='"+item+"']"); // текущий элемент
		current.closest('.column-container').hide();  // скрываем текущий элемент
		$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide(); // скрываем label
		$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
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
	});	
}

   /*  function rebuildFieldPhone() {
        var result = [];

        if (CountryCode.val()) {
            result.push("" + CountryCode.val());
        }
		
		if (RegionCode.val()) {
            result.push("-" + RegionCode.val());
        }
		
		if (NumberPhone.val()) {
            result.push("-" + NumberPhone.val());
        }
		
		if (AddPhone.val()) {
            result.push("-" + AddPhone.val());
        }
		
        Pnone.val(result.join(""));
    }
	
	$(document).on('change', "input[data-field-name='CountryCode']", function (e) {	
		rebuildFieldPhone()
	});
	
	$(document).on('change', "input[data-field-name='RegionCode']", function (e) {	
		rebuildFieldPhone()
	});
	
	$(document).on('change', "input[data-field-name='NumberPhone']", function (e) {	
	rebuildFieldPhone();	
	});
	
	$(document).on('change', "input[data-field-name='AddPhone']", function (e) {	
	rebuildFieldPhone();	
	});
	 */
});

