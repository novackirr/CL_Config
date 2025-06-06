$( document ).ready(function() {
	$("input[name='EditFromPlugin1']").val('1'); // признак того, что редактируется из плагина
	
	$(document).on('change', "input[name='RazmNDS']", function (e) {
		NMCD()
		let registerNMCS = $("input[name='registerNMCS']").val()
		registerNMCS = registerNMCS.replace(/\s/g, '')
		registerNMCS = parseFloat(registerNMCS)
		let RazmNDS = $(this).val()
		RazmNDS = RazmNDS.replace(/\s/g, '')
		RazmNDS = parseFloat(RazmNDS)
		if (RazmNDS > 20) {
			showCommonErrors("Процент НДС не может быть больше 20");
			$("input[name='RazmNDS']").clear();
		}
		let NoNDS = registerNMCS / ( (100 + RazmNDS)/100 )
		$("input[name='NMCDnoNDS']").autoNumeric('set', NoNDS)	
		nmcRub()
	})
	
	$(document).on('change', "input[name='NMCDnoNDS']", function (e) {
		NMCD()
		nmcRub()
	})

	function NMCD() {
		let RazmNDS = $("input[name='RazmNDS']").val()
		RazmNDS = RazmNDS.replace(/\s/g, '')
		RazmNDS = parseFloat(RazmNDS)
		let registerNMCS = $("input[name='registerNMCS']").val()
		registerNMCS = registerNMCS.replace(/\s/g, '')
		registerNMCS = parseFloat(registerNMCS)
		let NoNDS = registerNMCS / ( (100 + RazmNDS)/100 )
		$("input[name='NMCDnoNDS']").autoNumeric('set', NoNDS)	
	}

	$(document).on('change', "input[name='registerNMCS']", function (e) {
		let registerNMCS = $(this).val()
		registerNMCS = registerNMCS.replace(/\s/g, '')
		registerNMCS = parseFloat(registerNMCS)
		let RazmNDS = $("input[name='RazmNDS']").val()
		RazmNDS = RazmNDS.replace(/\s/g, '')
		RazmNDS = parseFloat(RazmNDS)
		var val1 = $("input[name='FirstNMC']").autoNumeric('get')
		var val2 = $("input[name='ID_Plan_IIS']").val()
		if (val2 == ""){
			$("input[name='FirstNMC']").val(registerNMCS)
		}	
		if ((((registerNMCS/val1) < (9/10)) || ((registerNMCS/val1) > (11/10))) && (val2 !== "")){
			showCommonErrors("Изменения цены возможны не более, чем на 10%");
			$("input[name='registerNMCS']").clear();
			$("input[name='registerNMCS']").val(val1);
		}
		if (RazmNDS > 20) {
			showCommonErrors("Процент НДС не может быть больше 20");
			$("input[name='RazmNDS']").clear();
		}
		let NoNDS = registerNMCS / ( (100 + RazmNDS)/100 )
		$("input[name='NMCDnoNDS']").autoNumeric('set', NoNDS)	
		nmcRub()
	})
	
	$(document).on('change', "input[name='Currency_dig_kodOb']", function (e) {
		valuta()
	})
	$(document).on('change', "input[name='curs']", function (e) {
		nmcRub()
	})
	valuta()
	//nmcRub()
	/* отображение/скрытие в зависимости от валюты */
	function valuta() { 
		$("button[id='Currency_kodOb']").attr('disabled', true);
		var flag = $("input[name='Currency_kodOb']").val();
		var Currency_dig_kodOb = $("input[name='Currency_dig_kodOb']").val();
		if ( (flag!=="RUB") && (Currency_dig_kodOb != "643")  ) {
			$("input[data-field-name='NMCD']").closest(".column-container").show();
			$("div[data-related-field='NMCD']").closest(".column-container").show();
			$("input[data-field-name='curs']").closest(".column-container").show();
			$("div[data-related-field='curs']").closest(".column-container").show();
			$("input[data-field-name='dateCurs']").closest(".column-container").show();
			$("div[data-related-field='dateCurs']").closest(".column-container").show();
			$("input[data-field-name='NMCD']").prop('required', true);
			$("div[data-related-field='NMCD']").addClass("label-required");
			$("input[data-field-name='curs']").prop('required', true);
			$("div[data-related-field='curs']").addClass("label-required");
			$("input[data-field-name='dateCurs']").prop('required', true);
			$("div[data-related-field='dateCurs']").addClass("label-required");	
		} else {
			$("input[data-field-name='NMCD']").closest(".column-container").hide();
			$("div[data-related-field='NMCD']").closest(".column-container").hide();
			$("div[data-related-field='emptyLabel']").closest(".column-container").hide();
			$("input[data-field-name='curs']").closest(".column-container").hide();
			$("div[data-related-field='curs']").closest(".column-container").hide();
			$("input[data-field-name='dateCurs']").closest(".column-container").hide();
			$("div[data-related-field='dateCurs']").closest(".column-container").hide();
			$("input[data-field-name='NMCD']").prop('required', false);
			$("div[data-related-field='NMCD']").removeClass("label-required");
			$("input[data-field-name='curs']").prop('required', false);
			$("div[data-related-field='curs']").removeClass("label-required");
			$("input[data-field-name='dateCurs']").prop('required', false);
			$("div[data-related-field='dateCurs']").removeClass("label-required");
		}
	}
	/* END отображение/скрытие в зависимости от валюты */
	
	/* подсчет нмц в рублях */
	function nmcRub(){
		let curs = $("input[data-field-name='curs']");
		let registerNMCS = $("input[data-field-name='registerNMCS']");
		let NMCD = $("input[name='NMCD']");
		let flag=$("input[name='Currency_kodOb']").val();
		if (flag!=="RUB") {
			if( curs.val() && registerNMCS.val() ){
				let s2 = curs.autoNumeric('get');
				let s4 = registerNMCS.autoNumeric('get');
				let val2 =  parseFloat(s2? s2 : 0);
				let val4 =  parseFloat(s4? s4 : 0);
				NMCD.autoNumeric('set', val4*val2);
			}
			if (($("input[name='NMCD']").val()== 0) || ($("input[name='NMCD']").val()== 0.00)) {
				$("input[name='NMCD']").val("");
			}
			if( (val4 == "1") || (val4 == "1.00") ){
				NMCD.autoNumeric('set', val4);
			}
			
		}else{
			NMCD.val(registerNMCS.val())
		}
	}
	/* END подсчет нмц в рублях */
});
$("input[name='FirstNMC']").hide();

/* function initialSumWithVAT() {
	let spzak = $("input[name='registerSpZakup']").val()
	let sposobMSP = [
 		'4489', '4490', '4491', '4492',
		'200608', '200609', '200610', '200611'
	]
	if ( $.inArray(spzak, sposobMSP) != -1 )  {
		$("input[data-field-name='initialSumWithVAT']").closest(".row-container").show();
	}
	else{
		$("input[data-field-name='initialSumWithVAT']").closest(".row-container").hide();
	}
}
initialSumWithVAT() */