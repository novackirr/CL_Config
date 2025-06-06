"use strict";
$(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
	var item = $("input[name='peretorgStepMin']");
	item.autoNumeric('init', {
		aSep: '',
		aDec: '.',
		vMin: '0.0000',
		vMax: "99999999999999999999999999999999999999999.9999",
		mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '4',
		wEmpty: '',
		mRound: 'B'
	});
	
	var item2 = $("input[name*='peretorgStepMax']");
	item2.autoNumeric('init', {
		aSep: '',
		aDec: '.',
		vMin: '0.0000',
		vMax: "99999999999999999999999999999999999999999.9999",
		mDec: item2.attr('data-accuracy') ? item2.attr('data-accuracy') : '4',
		wEmpty: '',
		mRound: 'B'
	});
});

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
		var applicTab = $("div[data-name='applicTab']");
		applicTab.find(".table-remove-row-button").closest(".table-edit-column").hide();
        applicTab.find(".table-add-row-button").closest(".table-edit-column").hide();
		$("div[title='Причина отказа в допуске']").hide();		
		$("input[data-field-name*='applicTab-declineReasonCode-']").closest(".table-edit-column").hide();
}

var formPeretorg = function () {
	var ETPName = $("input[name='ETPName']").val();
	if (ETPName == 'АО "РТ-ЕЭТП"'){
		var peretorgTypeCode = $("input[name='peretorgTypeCode']").val();

		if (peretorgTypeCode == '1') {
			$("input[name='hide_members_name']").prop("checked", false);
			$("input[name='hide_members_name']").closest(".column-container").hide();
			$("div[data-related-field='hide_members_name']").closest(".column-container").hide();
			$("input[name='hide_members_name']").closest(".column-container").show();
			$("div[data-related-field='hide_members_name']").closest(".column-container").show();
			$("input[name='peretorgStepMax']").closest(".column-container").show(); 
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").show();
			$("input[data-field-name='dateokonpod']").prop('required', false);
			$("input[name='dateokonpod']").closest(".column-container").hide();
			$("input[name='dateokonpod']").val('');
			$("[data-related-field=dateokonpod]").removeClass("label-required");
			$("div[data-related-field='dateokonpod']").closest(".column-container").hide();
			$("input[name='daterassm']").closest(".column-container").hide();
			$("div[data-related-field='daterassm']").closest(".column-container").hide();
			$("input[name='daterassm']").val('');
			$("input[name='dateperetorg']").closest(".column-container").show();
			$("div[data-related-field='dateperetorg']").closest(".column-container").show();
			$("input[name='dateperetorg']").prop('required', true);
			$("[data-related-field=dateperetorg]").addClass("label-required");
			$("input[name='peretorgStepMin']").prop('required', true);
			$("[data-related-field=peretorgStepMin]").addClass("label-required");
			$("input[name='peretorgStepMax']").prop('required', true);
			$("[data-related-field=peretorgStepMax]").addClass("label-required");
			$("input[name='trebovanieTKPcode']").closest(".column-container").show();
			$("input[data-field-name='trebovanieTKPcode']").closest(".column-container").show();
			$("div[data-related-field='trebovanieTKPcode']").closest(".column-container").show();
			$("input[name='trebovanieTKPcode']").prop('required', true);
			$("input[data-field-name='trebovanieTKPcode']").prop('required', true);
			$("[data-related-field=trebovanieTKPcode]").addClass("label-required");
			$("input[name='longTimeCode']").closest(".column-container").show();
			$("input[data-field-name='longTimeCode']").closest(".column-container").show();
			$("div[data-related-field='longTimeCode']").closest(".column-container").show();
			$("input[name='longTimeCode']").prop('required', true);
			$("input[data-field-name='longTimeCode']").prop('required', true);
			$("[data-related-field=longTimeCode]").addClass("label-required");
			$("div.documentView-field-label[data-related-field='peretorgStepMin'] label").text("Шаг переторжки от, %");
			$("input[name='maxCountWinLot']").prop("readonly", true);
			$("input[name='timePriceOffer']").closest(".column-container").show(); 
			$("div[data-related-field='timePriceOffer']").closest(".column-container").show();
			$("input[name='timePriceOffer']").prop('required', true);
			$("[data-related-field=timePriceOffer]").addClass("label-required");
			$("input[name='datepoditog']").closest(".column-container").show();
			$("div[data-related-field='datepoditog']").closest(".column-container").show();
			$("input[name='datepoditog']").prop('required', true);
			$("[data-related-field=datepoditog]").addClass("label-required");
		}
		else if (peretorgTypeCode == '2') {
			$("input[name='hide_members_name']").prop("checked", false);
			$("input[name='hide_members_name']").closest(".column-container").hide();
			$("div[data-related-field='hide_members_name']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").val('');
			$("div[data-related-field='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").closest(".column-container").hide(); 
			$("input[name='peretorgStepMax']").val('');
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='dateperetorg']").prop('required', false);
			$("[data-related-field=dateperetorg]").removeClass("label-required");
			$("input[name='dateperetorg']").closest(".column-container").hide();
			$("input[name='dateperetorg']").val('');
			$("div[data-related-field='dateperetorg']").closest(".column-container").hide();
			$("input[name='dateokonpod']").closest(".column-container").show();
			$("div[data-related-field='dateokonpod']").closest(".column-container").show();
			$("[data-related-field=dateokonpod]").addClass("label-required");
			$("input[data-field-name='dateokonpod']").prop('required', true);
			$("input[name='daterassm']").closest(".column-container").hide();
			$("div[data-related-field='daterassm']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").prop('required', false);
			$("[data-related-field=peretorgStepMin]").removeClass("label-required");
			$("input[name='peretorgStepMax']").prop('required', false);
			$("[data-related-field=peretorgStepMax]").removeClass("label-required");
			$("input[name='trebovanieTKPcode']").val('');
			$("[data-field-name='trebovanieTKPcode']").val('');
			$("input[name='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[data-field-name='trebovanieTKPcode']").closest(".column-container").hide();
			$("div[data-related-field='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[name='trebovanieTKPcode']").prop('required', false);
			$("input[data-field-name='trebovanieTKPcode']").prop('required', false);
			$("[data-related-field=trebovanieTKPcode]").removeClass("label-required");
			$("input[name='longTimeCode']").val('');
			$("[data-field-name='longTimeCode']").val('');
			$("input[name='longTimeCode']").closest(".column-container").hide();
			$("input[data-field-name='longTimeCode']").closest(".column-container").hide();
			$("div[data-related-field='longTimeCode']").closest(".column-container").hide();
			$("input[name='longTimeCode']").prop('required', false);
			$("input[data-field-name='longTimeCode']").prop('required', false);
			$("[data-related-field=longTimeCode]").removeClass("label-required");
			$("input[name='timePriceOffer']").closest(".column-container").hide(); 
			$("input[name='timePriceOffer']").val('');
			$("div[data-related-field='timePriceOffer']").closest(".column-container").hide();
			$("input[name='timePriceOffer']").prop('required', false);
			$("[data-related-field=timePriceOffer]").removeClass("label-required");
			$("input[name='maxCountWinLot']").prop("readonly", true);
			$("input[name='datepoditog']").closest(".column-container").show();
			$("div[data-related-field='datepoditog']").closest(".column-container").show();
			$("input[name='datepoditog']").prop('required', true);
			$("[data-related-field=datepoditog]").addClass("label-required");
		}
		else if (peretorgTypeCode == '3') {
			$("input[name='hide_members_name']").prop("checked", false);
			$("input[name='hide_members_name']").closest(".column-container").hide();
			$("div[data-related-field='hide_members_name']").closest(".column-container").hide();
			$("input[data-field-name='dateokonpod']").prop('required', false);
			$("input[name='dateokonpod']").closest(".column-container").hide();
			$("input[name='dateokonpod']").val('');
			$("[data-related-field=dateokonpod]").removeClass("label-required");
			$("div[data-related-field='dateokonpod']").closest(".column-container").hide();
			$("input[name='daterassm']").closest(".column-container").hide();
			$("div[data-related-field='daterassm']").closest(".column-container").hide();
			$("input[name='daterassm']").val('');
			$("input[name='dateperetorg']").closest(".column-container").show();
			$("div[data-related-field='dateperetorg']").closest(".column-container").show();
			$("input[name='dateperetorg']").prop('required', true);
			$("[data-related-field=dateperetorg]").addClass("label-required");
			$("input[name='peretorgStepMin']").closest(".column-container").show();
			$("div[data-related-field='peretorgStepMin']").closest(".column-container").show();
			$("input[name='peretorgStepMin']").prop('required', true);
			$("[data-related-field=peretorgStepMin]").addClass("label-required");
			$("input[name='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").val('');
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").prop('required', false);
			$("[data-related-field=peretorgStepMax]").removeClass("label-required");
			$("div.documentView-field-label[data-related-field='peretorgStepMin'] label").text("Шаг переторжки, в %");
			$("input[name='maxCountWinLot']").prop("readonly", true);
			$("input[name='timePriceOffer']").closest(".column-container").show(); 
			$("div[data-related-field='timePriceOffer']").closest(".column-container").show();
			$("input[name='timePriceOffer']").prop('required', true);
			$("[data-related-field=timePriceOffer]").addClass("label-required");
			$("input[name='trebovanieTKPcode']").val('');
			$("[data-field-name='trebovanieTKPcode']").val('');
			$("input[name='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[data-field-name='trebovanieTKPcode']").closest(".column-container").hide();
			$("div[data-related-field='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[name='trebovanieTKPcode']").prop('required', false);
			$("input[data-field-name='trebovanieTKPcode']").prop('required', false);
			$("[data-related-field=trebovanieTKPcode]").removeClass("label-required");
			$("input[name='longTimeCode']").val('');
			$("[data-field-name='longTimeCode']").val('');
			$("input[name='longTimeCode']").closest(".column-container").hide();
			$("input[data-field-name='longTimeCode']").closest(".column-container").hide();
			$("div[data-related-field='longTimeCode']").closest(".column-container").hide();
			$("input[name='longTimeCode']").prop('required', false);
			$("input[data-field-name='longTimeCode']").prop('required', false);
			$("[data-related-field=longTimeCode]").removeClass("label-required");
		}
		else if (peretorgTypeCode == '4') {
			$("input[name='hide_members_name']").prop("checked", false);
			$("input[name='hide_members_name']").closest(".column-container").hide();
			$("div[data-related-field='hide_members_name']").closest(".column-container").hide();
			$("input[data-field-name='dateokonpod']").prop('required', false);
			$("input[name='dateokonpod']").closest(".column-container").hide();
			$("input[name='dateokonpod']").val('');
			$("[data-related-field=dateokonpod]").removeClass("label-required");
			$("div[data-related-field='dateokonpod']").closest(".column-container").hide();
			$("input[name='daterassm']").closest(".column-container").hide();
			$("div[data-related-field='daterassm']").closest(".column-container").hide();
			$("input[name='daterassm']").val('');
			$("input[name='dateperetorg']").closest(".column-container").show();
			$("div[data-related-field='dateperetorg']").closest(".column-container").show();
			$("input[name='dateperetorg']").prop('required', true);
			$("[data-related-field=dateperetorg]").addClass("label-required");
			$("input[name='maxCountWinLot']").prop("readonly", true);
			$("input[name='timePriceOffer']").closest(".column-container").show(); 
			$("div[data-related-field='timePriceOffer']").closest(".column-container").show();
			$("input[name='timePriceOffer']").prop('required', true);
			$("[data-related-field=timePriceOffer]").addClass("label-required");
			$("input[name='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").val('');
			$("div[data-related-field='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").prop('required', false);
			$("[data-related-field=peretorgStepMin]").removeClass("label-required");
			$("input[name='trebovanieTKPcode']").val('');
			$("[data-field-name='trebovanieTKPcode']").val('');
			$("input[name='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[data-field-name='trebovanieTKPcode']").closest(".column-container").hide();
			$("div[data-related-field='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[name='trebovanieTKPcode']").prop('required', false);
			$("input[data-field-name='trebovanieTKPcode']").prop('required', false);
			$("[data-related-field=trebovanieTKPcode]").removeClass("label-required");
			$("input[name='longTimeCode']").val('');
			$("[data-field-name='longTimeCode']").val('');
			$("input[name='longTimeCode']").closest(".column-container").hide();
			$("input[data-field-name='longTimeCode']").closest(".column-container").hide();
			$("div[data-related-field='longTimeCode']").closest(".column-container").hide();
			$("input[name='longTimeCode']").prop('required', false);
			$("input[data-field-name='longTimeCode']").prop('required', false);
			$("[data-related-field=longTimeCode]").removeClass("label-required");
			$("input[name='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").val('');
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").prop('required', false);
			$("[data-related-field=peretorgStepMax]").removeClass("label-required");
		}
		else {
			$("input[name='hide_members_name']").prop("checked", false);
			$("input[name='hide_members_name']").closest(".column-container").hide();
			$("div[data-related-field='hide_members_name']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").val('');
			$("div[data-related-field='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").closest(".column-container").hide(); 
			$("input[name='peretorgStepMax']").val('');
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='dateperetorg']").prop('required', false);
			$("[data-related-field=dateperetorg]").removeClass("label-required");
			$("input[name='dateperetorg']").closest(".column-container").hide();
			$("input[name='dateperetorg']").val('');
			$("div[data-related-field='dateperetorg']").closest(".column-container").hide();
			$("input[data-field-name='dateokonpod']").prop('required', false);
			$("input[name='dateokonpod']").closest(".column-container").hide();
			$("input[name='dateokonpod']").val('');
			$("[data-related-field=dateokonpod]").removeClass("label-required");
			$("div[data-related-field='dateokonpod']").closest(".column-container").hide();
			$("input[name='daterassm']").closest(".column-container").hide();
			$("div[data-related-field='daterassm']").closest(".column-container").hide();
			$("input[name='daterassm']").val('');
			$("input[name='peretorgStepMin']").prop('required', false);
			$("[data-related-field=peretorgStepMin]").removeClass("label-required");
			$("input[name='peretorgStepMax']").prop('required', false	);
			$("[data-related-field=peretorgStepMax]").removeClass("label-required");
			$("input[name='trebovanieTKPcode']").val('');
			$("[data-field-name='trebovanieTKPcode']").val('');
			$("input[name='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[data-field-name='trebovanieTKPcode']").closest(".column-container").hide();
			$("div[data-related-field='trebovanieTKPcode']").closest(".column-container").hide();
			$("input[name='trebovanieTKPcode']").prop('required', false);
			$("input[data-field-name='trebovanieTKPcode']").prop('required', false);
			$("[data-related-field=trebovanieTKPcode]").removeClass("label-required");
			$("input[name='longTimeCode']").val('');
			$("[data-field-name='longTimeCode']").val('');
			$("input[name='longTimeCode']").closest(".column-container").hide();
			$("input[data-field-name='longTimeCode']").closest(".column-container").hide();
			$("div[data-related-field='longTimeCode']").closest(".column-container").hide();
			$("input[name='longTimeCode']").prop('required', false);
			$("input[data-field-name='longTimeCode']").prop('required', false);
			$("[data-related-field=longTimeCode]").removeClass("label-required");
			$("input[name='maxCountWinLot']").prop("readonly", true);
			$("input[name='timePriceOffer']").closest(".column-container").hide(); 
			$("input[name='timePriceOffer']").val('');
			$("div[data-related-field='timePriceOffer']").closest(".column-container").hide();
			$("input[name='timePriceOffer']").prop('required', false);
			$("[data-related-field=timePriceOffer]").removeClass("label-required");
			$("input[name='datepoditog']").prop('required', false);
			$("[data-related-field=datepoditog]").removeClass("label-required");
			$("input[name='datepoditog']").closest(".column-container").hide();
			$("input[name='datepoditog']").val('');
			$("div[data-related-field='datepoditog']").closest(".column-container").hide();
		}
	}
	else if(ETPName == 'АО "ЕЭТП"'){
		var peretorgTypeCode = $("input[name='peretorgTypeCode']").val();
		$("input[name='trebovanieTKPcode']").val('');
		$("[data-field-name='trebovanieTKPcode']").val('');
		$("input[name='trebovanieTKPcode']").closest(".column-container").hide();
		$("input[data-field-name='trebovanieTKPcode']").closest(".column-container").hide();
		$("div[data-related-field='trebovanieTKPcode']").closest(".column-container").hide();
		$("input[name='trebovanieTKPcode']").prop('required', false);
		$("input[data-field-name='trebovanieTKPcode']").prop('required', false);
		$("[data-related-field=trebovanieTKPcode]").removeClass("label-required");
		$("input[name='longTimeCode']").val('');
		$("[data-field-name='longTimeCode']").val('');
		$("input[name='longTimeCode']").closest(".column-container").hide();
		$("input[data-field-name='longTimeCode']").closest(".column-container").hide();
		$("div[data-related-field='longTimeCode']").closest(".column-container").hide();
		$("input[name='longTimeCode']").prop('required', false);
		$("[data-related-field=longTimeCode]").removeClass("label-required");
		$("input[data-field-name='longTimeCode']").prop('required', false);
		$("input[name='timePriceOffer']").closest(".column-container").hide(); 
		$("input[name='timePriceOffer']").val('');
		$("div[data-related-field='timePriceOffer']").closest(".column-container").hide();
		$("input[name='timePriceOffer']").prop('required', false);
		$("[data-related-field=timePriceOffer]").removeClass("label-required");
		$("input[name='maxCountWinLot']").closest(".column-container").hide(); 
		$("input[name='maxCountWinLot']").val('');
		$("div[data-related-field='maxCountWinLot']").closest(".column-container").hide();
		$("input[name='maxCountWinLot']").prop('required', false);
		$("[data-related-field=maxCountWinLot]").removeClass("label-required");
		if (peretorgTypeCode == '1') {
			$("input[name='peretorg_doc_demand']").prop("checked", false);
			$("input[name='peretorg_doc_demand']").closest(".column-container").hide();
			$("div[data-related-field='peretorg_doc_demand']").closest(".column-container").hide();
			$("input[name='hide_members_name']").closest(".column-container").show();
			$("div[data-related-field='hide_members_name']").closest(".column-container").show();
			$("input[name='peretorgStepMin']").closest(".column-container").show();
			$("div[data-related-field='peretorgStepMin']").closest(".column-container").show();
			$("input[name='peretorgStepMax']").closest(".column-container").show(); 
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").show();
			$("input[name='dateokonpod']").closest(".column-container").hide();
			$("input[name='dateokonpod']").val('');
			$("div[data-related-field='dateokonpod']").closest(".column-container").hide();
			$("input[name='daterassm']").closest(".column-container").hide();
			$("div[data-related-field='daterassm']").closest(".column-container").hide();
			$("input[name='daterassm']").val('');
			$("input[name='dateperetorg']").closest(".column-container").show();
			$("div[data-related-field='dateperetorg']").closest(".column-container").show();
			$("input[name='dateperetorg']").prop('required', true);
			$("[data-related-field=dateperetorg]").addClass("label-required");
			$("input[name='peretorgStepMin']").prop('required', true);
			$("[data-related-field=peretorgStepMin]").addClass("label-required");
			$("input[name='peretorgStepMax']").prop('required', true);
			$("[data-related-field=peretorgStepMax]").addClass("label-required");
		}
		else if (peretorgTypeCode == '2') {
			$("input[name='peretorg_doc_demand']").closest(".column-container").show();
			$("div[data-related-field='peretorg_doc_demand']").closest(".column-container").show();
			$("input[name='hide_members_name']").prop("checked", false);
			$("input[name='hide_members_name']").closest(".column-container").hide();
			$("div[data-related-field='hide_members_name']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").val('');
			$("div[data-related-field='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").closest(".column-container").hide(); 
			$("input[name='peretorgStepMax']").val('');
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='dateperetorg']").prop('required', false);
			$("[data-related-field=dateperetorg]").removeClass("label-required");
			$("input[name='dateperetorg']").closest(".column-container").hide();
			$("input[name='dateperetorg']").val('');
			$("div[data-related-field='dateperetorg']").closest(".column-container").hide();
			$("input[name='dateokonpod']").closest(".column-container").show();
			$("div[data-related-field='dateokonpod']").closest(".column-container").show();
			$("input[name='dateokonpod']").prop('required', true);
			$("[data-related-field=dateokonpod]").addClass("label-required");
			$("input[name='daterassm']").closest(".column-container").show();
			$("div[data-related-field='daterassm']").closest(".column-container").show();
			$("input[name='daterassm']").prop('required', true);
			$("[data-related-field=daterassm]").addClass("label-required");
			$("input[name='peretorgStepMin']").prop('required', false);
			$("[data-related-field=peretorgStepMin]").removeClass("label-required");
			$("input[name='peretorgStepMax']").prop('required', false	);
			$("[data-related-field=peretorgStepMax]").removeClass("label-required");
		}
		else {
			$("input[name='hide_members_name']").prop("checked", false);
			$("input[name='hide_members_name']").closest(".column-container").hide();
			$("div[data-related-field='hide_members_name']").closest(".column-container").hide();
			$("input[name='peretorg_doc_demand']").prop("checked", false);
			$("input[name='peretorg_doc_demand']").closest(".column-container").hide();
			$("div[data-related-field='peretorg_doc_demand']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMin']").val('');
			$("div[data-related-field='peretorgStepMin']").closest(".column-container").hide();
			$("input[name='peretorgStepMax']").closest(".column-container").hide(); 
			$("input[name='peretorgStepMax']").val('');
			$("div[data-related-field='peretorgStepMax']").closest(".column-container").hide();
			$("input[name='dateperetorg']").prop('required', false);
			$("[data-related-field=dateperetorg]").removeClass("label-required");
			$("input[name='dateperetorg']").closest(".column-container").hide();
			$("input[name='dateperetorg']").val('');
			$("div[data-related-field='dateperetorg']").closest(".column-container").hide();
			$("input[name='dateokonpod']").closest(".column-container").hide();
			$("input[name='dateokonpod']").val('');
			$("div[data-related-field='dateokonpod']").closest(".column-container").hide();
			$("input[name='daterassm']").closest(".column-container").hide();
			$("div[data-related-field='daterassm']").closest(".column-container").hide();
			$("input[name='daterassm']").val('');
			$("input[name='peretorgStepMin']").prop('required', false);
			$("[data-related-field=peretorgStepMin]").removeClass("label-required");
			$("input[name='peretorgStepMax']").prop('required', false	);
			$("[data-related-field=peretorgStepMax]").removeClass("label-required");
		}
	}
}

$(document).on('change', "input[name='peretorgTypeCode']", function (e) {
	formPeretorg();
});


var formTorgView = function() {
	var naimETP = $(".documentView-field-value[data-name='Наименование ЭТП']").text();
	if (naimETP == "АО &quot;РТ-ЕЭТП&quot;") {
		var formTorg = $(".documentView-field-value[data-name='Форма переторжки']").attr("title");
		if (formTorg === "Переторжка в очной форме") {
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Дата окончания приема заявок']").closest(".column-container").hide();
		}
		if (formTorg === "Переторжка в заочной форме") {
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Шаг переторжки от, %']").closest(".column-container").hide();
			$("div[data-name='Шаг переторжки до, %']").closest(".column-container").hide();
			$("div[data-name='Дата проведения переторжки']").closest(".column-container").hide();
			$("div[data-name='Требование подачи ТКП участниками']").closest(".column-container").hide();
			$("div[data-name='Продлевать время']").closest(".column-container").hide();
			$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
		}
		if (formTorg === "Переторжка с одной ценой") {
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Дата окончания приема заявок']").closest(".column-container").hide();
			$("div[data-name='Шаг переторжки от, %'] > .documentView-field-label").text("Шаг переторжки в, %");
			$("div[data-name='Шаг переторжки до, %']").closest(".column-container").hide();
			$("div[data-name='Дата проведения переторжки']").closest(".column-container").hide();
			$("div[data-name='Требование подачи ТКП участниками']").closest(".column-container").hide();
			$("div[data-name='Продлевать время']").closest(".column-container").hide();
		}
		if (formTorg === "Переторжка с одним шагом") {
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Дата окончания приема заявок']").closest(".column-container").hide();
			$("div[data-name='Шаг переторжки от, %']").closest(".column-container").hide();
			$("div[data-name='Шаг переторжки до, %']").closest(".column-container").hide();
			$("div[data-name='Дата проведения переторжки']").closest(".column-container").hide();
			$("div[data-name='Требование подачи ТКП участниками']").closest(".column-container").hide();
			$("div[data-name='Продлевать время']").closest(".column-container").hide();
		}
	}
	else if(naimETP == 'АО "ЕЭТП"' || naimETP == 'АО &quot;ЕЭТП&quot;'){
		var formTorg = $(".documentView-field-value[data-name='Форма переторжки']").attr("title");
		$("div[data-name='Требование подачи ТКП участниками']").closest(".column-container").hide();
		$("div[data-name='Продлевать время']").closest(".column-container").hide();
		$("div[data-name='Время ожидания ценовых предложений (минут)']").closest(".column-container").hide();
		$("div[data-name='Максимальное количество победителей по лоту']").closest(".column-container").hide();
		if (formTorg === "Переторжка в очной форме") {
			$("div[data-name='Обязательное приложение документов со стороны Заявителя']").closest(".column-container").hide();
			$("div[data-name='Дата рассмотрения заявок']").closest(".column-container").hide();
			$("div[data-name='Дата окончания приема заявок']").closest(".column-container").hide();	
		}
		if (formTorg === "Переторжка в заочной форме") {
			$("div[data-name='Скрыть имя участников в протоколе проведения очной переторжки']").closest(".column-container").hide();
			$("div[data-name='Шаг переторжки от, %']").closest(".column-container").hide();
			$("div[data-name='Шаг переторжки до, %']").closest(".column-container").hide();
			$("div[data-name='Дата проведения переторжки']").closest(".column-container").hide();
		}
	}
}

$(document).on('change', "input[name*='applicTab-allowedCode-']", function (e) {
   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
   if ($(this).val()=="T") {
	   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val("Состав документов заявителя соответствует требованиям документации");
	   
   } else {
	   $("input[data-field-name='applicTab-reason-" + rowkey+ "']").val('');
   }
});
function customDropDownHandle(){
	$(".document-view-actions").find("a:contains('Отправить на ЭТП')").each(function() {
		var button = $(this);
		var onclickFunc = button.attr('onclick');
		button.attr('onclick', 'return false;');
		button.click(function(ev) {
			var countPublic = 0;	
			var idDocs =  $("li[data-tabname='Документация']").find('a').attr('data-target');
			var dxDataGridDocs = $(idDocs).find(".dx-widget").first().dxDataGrid('instance').getDataSource();
			var getNameAndDiscObj = $.grep(dxDataGridDocs._items, function(item){
				if (item.Fields.AttachmentPublication == "Публикуется"){
					countPublic++
				}
			});
				
			if( countPublic == 0 ){
				var errorMessage = "Для отправки на ЭТП необходимо присоединить файлы с признаком публикации";
				showCommonErrors(errorMessage);
				return;
				}else{
				eval(onclickFunc);
			}

		});
		
	});
}

var filterResult = function() {
	var protocolCode = $("input[name='registerProtocol']").val();
	var ID_ETP = $("input[name='ID_ETP']").val();
	var applicTab = $("div[data-name='applicTab'] [data-rowkey]").length;
	var eventName = "DicDialogOpened",
		dicName = "Результат допуска";
	
	var buttons = $("button[data-dict-name='" + dicName + "']");
	
	buttons.each(function (index, btn) {
		var jBtn = $(btn);
		jBtn.unbind(eventName);
		jBtn.on(eventName, function (event, args) {
			var items = args.items;
			var l = items.length;
			for (var i = 0; i < l; i++) {
				var  currentItem = items[i].data.code;
				var  current = items[i];
				if (currentItem == 'N' || currentItem == 'K') {
					current.remove()
				}
			};
		});
	});
};

scopes.onRegister(EditReg);
scopes.onRegister(formPeretorg);
scopes.onRegister(filterResult);

scopes.onEdit(EditReg);	
scopes.onEdit(formPeretorg);
scopes.onEdit(filterResult);


scopes.onView(formTorgView);