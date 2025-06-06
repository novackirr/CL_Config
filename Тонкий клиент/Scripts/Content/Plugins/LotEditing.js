updateDatepickers();

$("input[data-field-name='Currency_kodOb']").parent().children(".input-group-btn").children().prop('disabled', true);

var ArrNMCDRub = [];; // глобальная переменная где хранится НМЦД по лотам


// тут подгружаем НМЦ по всем выделенным в линках лотам
(function LoadAsyncRequest() {
	var dictFieldsInfo = '{"DictionaryFieldInfoList":[]}';
	var Id_Lots = $("input[name='uniqueIds']").val().replace(',', '\',\''); // ИД лотов	
	var formValues = '{lot_Id: "'+Id_Lots+'"}';
	
	FormDictionaryHelperModule.getFormDictionaryItemsIds("LotsPrice", dictFieldsInfo, formValues, function (data) {
		var parseData = JSON.parse(data.data);
		var Lots = parseData.children;
		
		if (Lots.length > 0) {
			Lots.forEach(function(Lot, i) {
				ArrNMCDRub.push({
					'LotNum': Lot['code'],
					'NMCDRub': Lot['НМЦД_в_рублях']
				})
			})
		}
		
	}, function (error) {
		console.log(error);
	});
})()


function checkkrit() {
    let krit = $("input[name='krit']");
    krit.prop('checked', false);
}

checkkrit();

var hidesizepurchasereg = function () {
    var flag = $("input[data-field-name='registerObZa']");
    var flag1 = $("input[name='acceptMSP']");
    var RazmOb = $("input[name='registerRazmOb']");
    var RazmObProc = $("input[name='RazmObProc']");
    var Currency_kodOb = $("input[name='Currency_kodOb']");
    var CurrencyOb = $("input[name='CurrencyOb']");
    var curs = $("input[name='curs']");
    var dateCurs = $("input[name='dateCurs']");
    var SposobPredOb = $("input[name='SposobPredOb']");
    var otherTreb = $("textarea[data-field-name='otherTreb']");
    var PerechDS = $("textarea[data-field-name='PerechDS']");
    var VidPoluch = $("textarea[data-field-name='VidPoluch']");
    var Poluch = $("input[name='Poluch']");
    var PoluchBank = $("input[name='PoluchBank']");
    var PoluchBankAddress = $("input[name='PoluchBankAddress']");
    var PoluchINN = $("input[name='PoluchINN']");
    var PoluchKPP = $("input[name='PoluchKPP']");
    var PoluchOKTMO = $("input[name='PoluchOKTMO']");
    var PoluchKBK = $("input[name='PoluchKBK']");
    var PoluchBIK = $("input[name='PoluchBIK']");
    var PoluchRS = $("input[name='PoluchRS']");
    var PoluchKS = $("input[name='PoluchKS']");
    var PoluchLS = $("input[name='PoluchLS']");
    var PoluchUIN = $("input[name='PoluchUIN']");
    var naimETP = $("input[name='naimETP']");
    var registerBG = $("input[data-field-name='registerBG']");
    if ($(flag).is(":checked")) {
        RazmOb.closest(".column-container").show();
        RazmOb.prop("required", true);
        RazmOb.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=registerRazmOb]").closest(".column-container").show();
        $("[data-related-field=registerRazmOb]").addClass("label-required");
        RazmObProc.closest(".column-container").show();
        RazmObProc.prop("required", true);
        $("[data-related-field=RazmObProc]").closest(".column-container").show();
        $("[data-related-field=RazmObProc]").addClass("label-required");
        Currency_kodOb.closest(".column-container").show();
        $("input[data-field-name='Currency_kodOb']").prop("required", true);
        $("[data-related-field=Currency_kodOb]").closest(".column-container").show();
        $("[data-related-field=Currency_kodOb]").addClass("label-required");
        if ((CurrencyOb !== "Российский рубль") && (CurrencyOb !== "")) {
            curs.closest(".column-container").show();
            $("[data-related-field=curs]").closest(".column-container").show();
            $("input[data-field-name='curs']").prop("required", true);
            $("[data-related-field=curs]").addClass("label-required");
            dateCurs.closest(".column-container").show();
            $("[data-related-field=dateCurs]").closest(".column-container").show();
            $("input[data-field-name='dateCurs']").prop("required", true);
            $("[data-related-field=dateCurs]").addClass("label-required");
        }
        if (CurrencyOb.val() === "Российский рубль") {
            curs.val("1");
            curs.closest(".column-container").hide();
            $("[data-related-field=curs]").closest(".column-container").hide();
            $("input[data-field-name='curs']").prop("required", false);
            $("[data-related-field=curs]").removeClass("label-required");
            dateCurs.closest(".column-container").hide();
            $("[data-related-field=dateCurs]").closest(".column-container").hide();
            $("input[data-field-name='dateCurs']").prop("required", false);
            $("[data-related-field=dateCurs]").removeClass("label-required");
        }
        if (naimETP.val() === 'АО "ЕЭТП"') {
            SposobPredOb.closest(".column-container").show();
            $("[data-related-field=SposobPredOb]").closest(".column-container").show();
            $("input[data-field-name='SposobPredOb']").prop("required", true);
            SposobPredOb.prop("required", true);
            $("[data-related-field=SposobPredOb]").addClass("label-required");
        } else {
            SposobPredOb.closest(".column-container").hide();
            $("[data-related-field=SposobPredOb]").closest(".column-container").hide();
            $("input[data-field-name='SposobPredOb']").prop("required", false);
            SposobPredOb.prop("required", false);
            $("[data-related-field=SposobPredOb]").removeClass("label-required");
        }
		if (naimETP.val() === 'АО "РТ-ЕЭТП"') {
            registerBG.closest(".column-container").show();
			$("[data-related-field=registerBG]").closest(".column-container").show();
        }
		/* if (naimETP.val() != 'АО "МСП-ЕЭТП"') {
			registerBG.closest(".column-container").show();
			$("[data-related-field=registerBG]").closest(".column-container").show();
		} else {
			registerBG.prop("checked", false);
			registerBG.closest(".column-container").hide();
			$("[data-related-field=registerBG]").closest(".column-container").hide();
		} */    
        if (SposobPredOb.val() == "Путем перечисления денежных средств на реквизиты заказчика") {
            PerechDS.closest(".column-container").show();
            PerechDS.prop("required", true);
            $("[data-related-field=PerechDS]").addClass("label-required");
            $("[data-related-field=PerechDS]").closest(".column-container").show();
            VidPoluch.closest(".column-container").hide();
            $("[data-related-field=VidPoluch]").closest(".column-container").hide();
            if (PerechDS.val() == "Перечисление денежных средств осуществляется на указанные ниже реквизиты") {
                VidPoluch.closest(".column-container").show();
                VidPoluch.prop("required", true);
                $("[data-related-field=VidPoluch]").addClass("label-required");
                $("[data-related-field=VidPoluch]").closest(".column-container").show();
                if (VidPoluch.val() == "Бюджетное учреждение (перевод средств осуществляется в одно из подразделений Центрального банка РФ)") {
                    PoluchBIK.closest(".column-container").show();
                    PoluchBIK.prop("required", true);
                    $("[data-related-field=PoluchBIK]").addClass("label-required");
                    $("[data-related-field=PoluchBIK]").closest(".column-container").show();
                    PoluchRS.closest(".column-container").show();
                    PoluchRS.prop("required", true);
                    $("[data-related-field=PoluchRS]").addClass("label-required");
                    $("[data-related-field=PoluchRS]").closest(".column-container").show();
                    Poluch.closest(".column-container").show();
                    Poluch.prop("required", true);
                    $("[data-related-field=Poluch]").addClass("label-required");
                    $("[data-related-field=Poluch]").closest(".column-container").show();
                    PoluchBank.closest(".column-container").show();
                    PoluchBank.prop("required", true);
                    $("[data-related-field=PoluchBank]").addClass("label-required");
                    $("[data-related-field=PoluchBank]").closest(".column-container").show();
                    PoluchBankAddress.closest(".column-container").show();
                    PoluchBankAddress.prop("required", true);
                    $("[data-related-field=PoluchBankAddress]").addClass("label-required");
                    $("[data-related-field=PoluchBankAddress]").closest(".column-container").show();
                    PoluchINN.closest(".column-container").show();
                    PoluchINN.prop("required", true);
                    $("[data-related-field=PoluchINN]").addClass("label-required");
                    $("[data-related-field=PoluchINN]").closest(".column-container").show();
                    PoluchKPP.closest(".column-container").show();
                    PoluchKPP.prop("required", true);
                    $("[data-related-field=PoluchKPP]").addClass("label-required");
                    $("[data-related-field=PoluchKPP]").closest(".column-container").show();
                    PoluchOKTMO.closest(".column-container").show();
                    PoluchOKTMO.prop("required", true);
                    $("[data-related-field=PoluchOKTMO]").addClass("label-required");
                    $("[data-related-field=PoluchOKTMO]").closest(".column-container").show();
                    PoluchKBK.closest(".column-container").show();
                    PoluchKBK.prop("required", true);
                    $("[data-related-field=PoluchKBK]").addClass("label-required");
                    $("[data-related-field=PoluchKBK]").closest(".column-container").show();
                    PoluchUIN.closest(".column-container").show();
                    PoluchUIN.prop("required", true);
                    $("[data-related-field=PoluchUIN]").addClass("label-required");
                    $("[data-related-field=PoluchUIN]").closest(".column-container").show();
                    PoluchKS.closest(".column-container").hide();
                    PoluchKS.prop("required", false);
                    $("[data-related-field=PoluchKS]").removeClass("label-required");
                    $("[data-related-field=PoluchKS]").closest(".column-container").hide();
                    PoluchLS.closest(".column-container").show();
                    $("[data-related-field=PoluchLS]").closest(".column-container").show();
                    $("div[data-field-name=Получатель_Лиц_счет]").parent().attr("class", "col-xs-3 column-container");
                }
                if (VidPoluch.val() == "Небюджетное учреждение (перевод средств осуществляется на счет кредитной организации)") {
                    PoluchBIK.closest(".column-container").show();
                    PoluchBIK.prop("required", true);
                    $("[data-related-field=PoluchBIK]").addClass("label-required");
                    $("[data-related-field=PoluchBIK]").closest(".column-container").show();
                    PoluchRS.closest(".column-container").show();
                    PoluchRS.prop("required", true);
                    $("[data-related-field=PoluchRS]").addClass("label-required");
                    $("[data-related-field=PoluchRS]").closest(".column-container").show();
                    Poluch.closest(".column-container").show();
                    Poluch.prop("required", true);
                    $("[data-related-field=Poluch]").addClass("label-required");
                    $("[data-related-field=Poluch]").closest(".column-container").show();
                    PoluchBank.closest(".column-container").show();
                    PoluchBank.prop("required", true);
                    $("[data-related-field=PoluchBank]").addClass("label-required");
                    $("[data-related-field=PoluchBank]").closest(".column-container").show();
                    PoluchBankAddress.closest(".column-container").show();
                    PoluchBankAddress.prop("required", true);
                    $("[data-related-field=PoluchBankAddress]").addClass("label-required");
                    $("[data-related-field=PoluchBankAddress]").closest(".column-container").show();
                    PoluchINN.closest(".column-container").show();
                    PoluchINN.prop("required", true);
                    $("[data-related-field=PoluchINN]").addClass("label-required");
                    $("[data-related-field=PoluchINN]").closest(".column-container").show();
                    PoluchKPP.closest(".column-container").hide();
                    PoluchKPP.prop("required", false);
                    $("[data-related-field=PoluchKPP]").removeClass("label-required");
                    $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
                    PoluchOKTMO.closest(".column-container").hide();
                    PoluchOKTMO.prop("required", false);
                    $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
                    $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
                    PoluchKBK.closest(".column-container").hide();
                    PoluchKBK.prop("required", false);
                    $("[data-related-field=PoluchKBK]").removeClass("label-required");
                    $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
                    PoluchUIN.closest(".column-container").hide();
                    PoluchUIN.prop("required", false);
                    $("[data-related-field=PoluchUIN]").removeClass("label-required");
                    $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
                    PoluchKS.closest(".column-container").show();
                    PoluchKS.prop("required", true);
                    $("[data-related-field=PoluchKS]").addClass("label-required");
                    $("[data-related-field=PoluchKS]").closest(".column-container").show();
                    PoluchLS.closest(".column-container").hide();
                    $("[data-related-field=PoluchLS]").closest(".column-container").hide();
                }
                if (VidPoluch.val() == "") {
                    PoluchBIK.closest(".column-container").hide();
                    PoluchBIK.prop("required", false);
                    $("[data-related-field=PoluchBIK]").removeClass("label-required");
                    $("[data-related-field=PoluchBIK]").closest(".column-container").hide();
                    PoluchRS.closest(".column-container").hide();
                    PoluchRS.prop("required", false);
                    $("[data-related-field=PoluchRS]").removeClass("label-required");
                    $("[data-related-field=PoluchRS]").closest(".column-container").hide();
                    Poluch.closest(".column-container").hide();
                    Poluch.prop("required", false);
                    $("[data-related-field=Poluch]").removeClass("label-required");
                    $("[data-related-field=Poluch]").closest(".column-container").hide();
                    PoluchBank.closest(".column-container").hide();
                    PoluchBank.prop("required", false);
                    $("[data-related-field=PoluchBank]").removeClass("label-required");
                    $("[data-related-field=PoluchBank]").closest(".column-container").hide();
                    PoluchBankAddress.closest(".column-container").hide();
                    PoluchBankAddress.prop("required", false);
                    $("[data-related-field=PoluchBankAddress]").removeClass("label-required");
                    $("[data-related-field=PoluchBankAddress]").closest(".column-container").hide();
                    PoluchINN.closest(".column-container").hide();
                    PoluchINN.prop("required", false);
                    $("[data-related-field=PoluchINN]").removeClass("label-required");
                    $("[data-related-field=PoluchINN]").closest(".column-container").hide();
                    PoluchKPP.closest(".column-container").hide();
                    PoluchKPP.prop("required", false);
                    $("[data-related-field=PoluchKPP]").removeClass("label-required");
                    $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
                    PoluchOKTMO.closest(".column-container").hide();
                    PoluchOKTMO.prop("required", false);
                    $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
                    $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
                    PoluchKBK.closest(".column-container").hide();
                    PoluchKBK.prop("required", false);
                    $("[data-related-field=PoluchKBK]").removeClass("label-required");
                    $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
                    PoluchUIN.closest(".column-container").hide();
                    PoluchUIN.prop("required", false);
                    $("[data-related-field=PoluchUIN]").removeClass("label-required");
                    $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
                    PoluchKS.closest(".column-container").hide();
                    PoluchKS.prop("required", false);
                    $("[data-related-field=PoluchKS]").removeClass("label-required");
                    $("[data-related-field=PoluchKS]").closest(".column-container").hide();
                    PoluchLS.closest(".column-container").hide();
                    $("[data-related-field=PoluchLS]").closest(".column-container").hide();
                }
            }
        } else {
            VidPoluch.text('');
            $("input[name='VidPoluch']").val("");
            VidPoluch.closest(".column-container").hide();
            $("[data-related-field=VidPoluch]").closest(".column-container").hide();
            Poluch.val("");
            Poluch.closest(".column-container").hide();
            $("[data-related-field=Poluch]").closest(".column-container").hide();
            PoluchBank.val("");
            PoluchBank.closest(".column-container").hide();
            $("[data-related-field=PoluchBank]").closest(".column-container").hide();
            PoluchBankAddress.val("");
            PoluchBankAddress.closest(".column-container").hide();
            $("[data-related-field=PoluchBankAddress]").closest(".column-container").hide();
            PoluchINN.val("");
            PoluchINN.closest(".column-container").hide();
            $("[data-related-field=PoluchINN]").closest(".column-container").hide();
            PoluchKPP.val("");
            PoluchKPP.closest(".column-container").hide();
            $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
            PoluchOKTMO.val("");
            PoluchOKTMO.closest(".column-container").hide();
            $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
            PoluchKBK.val("");
            PoluchKBK.closest(".column-container").hide();
            $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
            PoluchBIK.val("");
            PoluchBIK.closest(".column-container").hide();
            $("[data-related-field=PoluchBIK]").closest(".column-container").hide();
            PoluchRS.val("");
            PoluchRS.closest(".column-container").hide();
            $("[data-related-field=PoluchRS]").closest(".column-container").hide();
            PoluchKS.val("");
            PoluchKS.closest(".column-container").hide();
            $("[data-related-field=PoluchKS]").closest(".column-container").hide();
            PoluchUIN.val("");
            PoluchUIN.closest(".column-container").hide();
            $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
            PerechDS.prop("required", false);
            $("[data-related-field=PerechDS]").removeClass("label-required");
            VidPoluch.prop("required", false);
            $("[data-related-field=VidPoluch]").removeClass("label-required");
            Poluch.prop("required", false);
            $("[data-related-field=Poluch]").removeClass("label-required");
            PoluchBank.prop("required", false);
            $("[data-related-field=PoluchBank]").removeClass("label-required");
            PoluchBankAddress.prop("required", false);
            $("[data-related-field=PoluchBankAddress]").removeClass("label-required");
            PoluchINN.prop("required", false);
            $("[data-related-field=PoluchINN]").removeClass("label-required");
            PoluchKPP.prop("required", false);
            $("[data-related-field=PoluchKPP]").removeClass("label-required");
            PoluchOKTMO.prop("required", false);
            $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
            PoluchBIK.prop("required", false);
            $("[data-related-field=PoluchBIK]").removeClass("label-required");
            PoluchRS.prop("required", false);
            $("[data-related-field=PoluchRS]").removeClass("label-required");
            PoluchKS.prop("required", false);
            $("[data-related-field=PoluchKS]").removeClass("label-required");
            PoluchUIN.prop("required", false);
            $("[data-related-field=PoluchUIN]").removeClass("label-required");
            PoluchKBK.prop("required", false);
            $("[data-related-field=PoluchKBK]").removeClass("label-required");
            PerechDS.val("");
            PerechDS.closest(".column-container").hide();
            PerechDS.prop("required", false);
            $("[data-related-field=PerechDS]").removeClass("label-required");
            $("[data-related-field=PerechDS]").closest(".column-container").hide();
            PoluchLS.val("");
            PoluchLS.closest(".column-container").hide();
            $("[data-related-field=PoluchLS]").closest(".column-container").hide();
        }
    } 
	else {
        RazmOb.closest(".column-container").hide();
        RazmOb.prop("required", false);
        RazmOb.autoNumeric('wipe');
        RazmOb.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=registerRazmOb]").closest(".column-container").hide();
        $("[data-related-field=registerRazmOb]").removeClass("label-required");
        RazmObProc.val("");
        RazmObProc.prop("required", false);
        $("[data-related-field=RazmObProc]").removeClass("label-required");
        RazmObProc.closest(".column-container").hide();
        $("[data-related-field=RazmObProc]").closest(".column-container").hide();
        Currency_kodOb.closest(".column-container").hide();
        $("input[name='Currency_kodOb']").closest(".column-container").hide();
        $("input[data-field-name='Currency_kodOb']").prop("required", false);
        Currency_kodOb.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
        $("[data-related-field=Currency_kodOb]").closest(".column-container").hide();
        $("[data-related-field=Currency_kodOb]").removeClass("label-required");
        curs.closest(".column-container").hide();
        $("[data-related-field=curs]").closest(".column-container").hide();
        dateCurs.closest(".column-container").hide();
        $("[data-related-field=dateCurs]").closest(".column-container").hide();
        $("input[data-field-name='SposobPredOb']").val("");
        SposobPredOb.val("");
        SposobPredOb.closest(".column-container").hide();
        $("[data-related-field=SposobPredOb]").closest(".column-container").hide();
        $("input[data-field-name='SposobPredOb']").prop("required", false);
        SposobPredOb.prop("required", false);
        $("[data-related-field=SposobPredOb]").removeClass("label-required");
        PerechDS.text('');
        $("input[name='PerechDS']").val("");
        PerechDS.closest(".column-container").hide();
        $("[data-related-field=PerechDS]").closest(".column-container").hide();
        VidPoluch.val("");
        $("input[name='VidPoluch']").val("");
        VidPoluch.closest(".column-container").hide();
        $("[data-related-field=VidPoluch]").closest(".column-container").hide();
        Poluch.val("");
        Poluch.closest(".column-container").hide();
        $("[data-related-field=Poluch]").closest(".column-container").hide();
        PoluchBank.val("");
        PoluchBank.closest(".column-container").hide();
        $("[data-related-field=PoluchBank]").closest(".column-container").hide();
        PoluchBankAddress.val("");
        PoluchBankAddress.closest(".column-container").hide();
        $("[data-related-field=PoluchBankAddress]").closest(".column-container").hide();
        PoluchINN.val("");
        PoluchINN.closest(".column-container").hide();
        $("[data-related-field=PoluchINN]").closest(".column-container").hide();
        PoluchKPP.val("");
        PoluchKPP.closest(".column-container").hide();
        $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
        PoluchOKTMO.val("");
        PoluchOKTMO.closest(".column-container").hide();
        $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
        PoluchKBK.val("");
        PoluchKBK.closest(".column-container").hide();
        $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
        PoluchBIK.val("");
        PoluchBIK.closest(".column-container").hide();
        $("[data-related-field=PoluchBIK]").closest(".column-container").hide();
        PoluchRS.val("");
        PoluchRS.closest(".column-container").hide();
        $("[data-related-field=PoluchRS]").closest(".column-container").hide();
        PoluchKS.val("");
        PoluchKS.closest(".column-container").hide();
        $("[data-related-field=PoluchKS]").closest(".column-container").hide();
        PoluchUIN.val("");
        PoluchUIN.closest(".column-container").hide();
        $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
        registerBG.prop("checked", false);
        registerBG.closest(".column-container").hide();
        $("[data-related-field=registerBG]").closest(".column-container").hide();
        SposobPredOb.prop("required", false);
        $("[data-related-field=SposobPredOb]").removeClass("label-required");
        PerechDS.prop("required", false);
        $("[data-related-field=PerechDS]").removeClass("label-required");
        VidPoluch.prop("required", false);
        $("[data-related-field=VidPoluch]").removeClass("label-required");
        Poluch.prop("required", false);
        $("[data-related-field=Poluch]").removeClass("label-required");
        PoluchBank.prop("required", false);
        $("[data-related-field=PoluchBank]").removeClass("label-required");
        PoluchBankAddress.prop("required", false);
        $("[data-related-field=PoluchBankAddress]").removeClass("label-required");
        PoluchINN.prop("required", false);
        $("[data-related-field=PoluchINN]").removeClass("label-required");
        PoluchKPP.prop("required", false);
        $("[data-related-field=PoluchKPP]").removeClass("label-required");
        PoluchOKTMO.prop("required", false);
        $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
        PoluchBIK.val("");
        PoluchBIK.prop("required", false);
        $("[data-related-field=PoluchBIK]").removeClass("label-required");
        PoluchRS.prop("required", false);
        $("[data-related-field=PoluchRS]").removeClass("label-required");
        PoluchKS.prop("required", false);
        $("[data-related-field=PoluchKS]").removeClass("label-required");
        PoluchUIN.prop("required", false);
        $("[data-related-field=PoluchUIN]").removeClass("label-required");
        PoluchKBK.prop("required", false);
        $("[data-related-field=PoluchKBK]").removeClass("label-required");
        PoluchLS.val("");
        PoluchLS.closest(".column-container").hide();
        $("[data-related-field=PoluchLS]").closest(".column-container").hide();
    }
    if ($(flag).is(":checked") && (naimETP.val() == 'АО "МСП-ЕЭТП"')) {
        otherTreb.closest(".column-container").show();
        otherTreb.prop("required", true);
        $("[data-related-field=otherTreb]").addClass("label-required");
        $("[data-related-field=otherTreb]").closest(".row-container").show();
       /*  $("input[data-field-name='RazmObProc']").closest(".column-container").hide();
        $("[data-related-field=RazmObProc]").closest(".column-container").hide(); */
        $("input[data-field-name='registerBG']").closest(".column-container").hide();
        $("[data-related-field=registerBG]").closest(".column-container").hide();
        $("input[data-field-name='SposobPredOb']").closest(".column-container").hide();
        $("[data-related-field=SposobPredOb]").closest(".column-container").hide();
        $("input[data-field-name='SposobPredOb']").prop("required", false);
        $("[data-related-field=SposobPredOb]").removeClass("label-required");
        Currency_kodOb.closest(".column-container").show();
        $("input[data-field-name='Currency_kodOb']").prop("required", true);
        Currency_kodOb.closest(".column-container").find(".documentView-field-label").addClass("label-required");
        $("[data-related-field=Currency_kodOb]").closest(".column-container").show();
        $("[data-related-field=Currency_kodOb]").addClass("label-required");
    }
    else if (naimETP.val() != 'АО "Сбербанк - АСТ"'){
        otherTreb.prop("required", false);
        $("[data-related-field=otherTreb]").removeClass("label-required");
        otherTreb.closest(".column-container").hide();
        $("[data-related-field=otherTreb]").closest(".row-container").hide();
        otherTreb.text('');
        otherTreb.val('');
        /* $("input[data-field-name='RazmObProc']").closest(".column-container").show();
        $("[data-related-field=RazmObProc]").closest(".column-container").show();
        registerBG.closest(".column-container").show();
        $("[data-related-field=registerBG]").closest(".column-container").show();	
        $("input[data-field-name='SposobPredOb']").closest(".column-container").show();
        $("[data-related-field=SposobPredOb]").closest(".column-container").show();
        $("input[data-field-name='SposobPredOb']").prop("required", true);
        $("[data-related-field=SposobPredOb]").addClass("label-required"); */
    }
}


function cursHide() {
    let Currency_kodOb = $("input[name='Currency_kodOb']").val();
    let curs = $("input[name='curs']");
    let dateCurs = $("input[name='dateCurs']");
    if ((Currency_kodOb !== "RUB") && (Currency_kodOb !== "")) {
        curs.closest(".column-container").show();
        $("[data-related-field=curs]").closest(".column-container").show();
        $("input[data-field-name='curs']").prop("required", true);
        $("[data-related-field=curs]").addClass("label-required");
        dateCurs.closest(".column-container").show();
        $("[data-related-field=dateCurs]").closest(".column-container").show();
        $("input[data-field-name='dateCurs']").prop("required", true);
        $("[data-related-field=dateCurs]").addClass("label-required");
    } else {
        curs.val("1");
        curs.closest(".column-container").hide();
        $("[data-related-field=curs]").closest(".column-container").hide();
        $("input[data-field-name='curs']").prop("required", false);
        $("[data-related-field=curs]").removeClass("label-required");
        dateCurs.closest(".column-container").hide();
        $("[data-related-field=dateCurs]").closest(".column-container").hide();
        $("input[data-field-name='dateCurs']").prop("required", false);
        $("[data-related-field=dateCurs]").removeClass("label-required");
    }

}

$(document).on('change', "input[name='Currency_kodOb']", function (e) {
    cursHide();
});



function calculateCurs() {
    let curs = $("input[name='curs']");
    let registerRazmOb = $("input[name='registerRazmOb']");
    let Currency_kodOb = $("input[name='Currency_kodOb']").val();
    if (Currency_kodOb !== "RUB") {
        var s2 = curs.autoNumeric('get');
        var nmc2 = registerRazmOb.autoNumeric('init', {
            aSep: ' ',
            aDec: '.',
            vMin: '0.00',
            vMax: "99999999999999999999999999999999999999999.99",
            wEmpty: '',
            mRound: 'B'
        });
        var s4 = registerRazmOb.autoNumeric('get');
        var val2 = parseFloat(s2 ? s2 : 0);
        var val4 = parseFloat(s4 ? s4 : 0);
        registerRazmOb.autoNumeric('set', val4 * val2);
    }
}

$(document).on('change', "input[name='curs']", function (e) {
    calculateCurs();
});


$(document).on('change', "input[data-field-name='registerObZa']", function (e) {
    hidesizepurchasereg();
});

hidesizepurchasereg();

$(document).on('change', "input[data-field-name='SposobPredOb']", function (e) {
    var SposobPredOb = $("input[name='SposobPredOb']");
    var PerechDS = $("textarea[data-field-name='PerechDS']");
    var VidPoluch = $("textarea[data-field-name='VidPoluch']");
    var Poluch = $("input[name='Poluch']");
    var PoluchBank = $("input[name='PoluchBank']");
    var PoluchBankAddress = $("input[name='PoluchBankAddress']");
    var PoluchINN = $("input[name='PoluchINN']");
    var PoluchKPP = $("input[name='PoluchKPP']");
    var PoluchOKTMO = $("input[name='PoluchOKTMO']");
    var PoluchKBK = $("input[name='PoluchKBK']");
    var PoluchBIK = $("input[name='PoluchBIK']");
    var PoluchRS = $("input[name='PoluchRS']");
    var PoluchKS = $("input[name='PoluchKS']");
    var PoluchLS = $("input[name='PoluchLS']");
    var PoluchUIN = $("input[name='PoluchUIN']");
    if (SposobPredOb.val() == "Путем перечисления денежных средств на реквизиты заказчика") {
        PerechDS.closest(".column-container").show();
        PerechDS.prop("required", true);
        $("[data-related-field=PerechDS]").addClass("label-required");
        $("[data-related-field=PerechDS]").closest(".column-container").show();
    }
    else {
        PerechDS.clear();
        PerechDS.closest(".column-container").hide();
        PerechDS.prop("required", false);
        $("input[name='PerechDS']").clear();
        PerechDS.text('');
        $("[data-related-field=PerechDS]").removeClass("label-required");
        $("[data-related-field=PerechDS]").closest(".column-container").hide();
        Poluch.closest(".column-container").hide();
        $("[data-related-field=Poluch]").closest(".column-container").hide();
        PoluchBank.closest(".column-container").hide();
        $("[data-related-field=PoluchBank]").closest(".column-container").hide();
        PoluchBankAddress.closest(".column-container").hide();
        $("[data-related-field=PoluchBankAddress]").closest(".column-container").hide();
        PoluchINN.closest(".column-container").hide();
        $("[data-related-field=PoluchINN]").closest(".column-container").hide();
        PoluchKPP.closest(".column-container").hide();
        $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
        PoluchOKTMO.closest(".column-container").hide();
        $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
        PoluchKBK.closest(".column-container").hide();
        $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
        PoluchBIK.closest(".column-container").hide();
        $("[data-related-field=PoluchBIK]").closest(".column-container").hide();
        PoluchRS.closest(".column-container").hide();
        $("[data-related-field=PoluchRS]").closest(".column-container").hide();
        PoluchKS.closest(".column-container").hide();
        $("[data-related-field=PoluchKS]").closest(".column-container").hide();
        PoluchUIN.closest(".column-container").hide();
        $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
        SposobPredOb.prop("required", false);
        $("[data-related-field=SposobPredOb]").removeClass("label-required");
        PerechDS.prop("required", false);
        $("[data-related-field=PerechDS]").removeClass("label-required");
        VidPoluch.clear();
        VidPoluch.closest(".column-container").hide();
        VidPoluch.prop("required", false);
        $("[data-related-field=VidPoluch]").removeClass("label-required");
        $("[data-related-field=VidPoluch]").closest(".column-container").hide();
        VidPoluch.text('');
        $("input[name='VidPoluch']").val('');
        Poluch.prop("required", false);
        $("[data-related-field=Poluch]").removeClass("label-required");
        PoluchBank.prop("required", false);
        $("[data-related-field=PoluchBank]").removeClass("label-required");
        PoluchBankAddress.prop("required", false);
        $("[data-related-field=PoluchBankAddress]").removeClass("label-required");
        PoluchINN.prop("required", false);
        $("[data-related-field=PoluchINN]").removeClass("label-required");
        PoluchKPP.prop("required", false);
        $("[data-related-field=PoluchKPP]").removeClass("label-required");
        PoluchOKTMO.prop("required", false);
        $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
        PoluchBIK.prop("required", false);
        $("[data-related-field=PoluchBIK]").removeClass("label-required");
        PoluchRS.prop("required", false);
        $("[data-related-field=PoluchRS]").removeClass("label-required");
        PoluchKS.prop("required", false);
        $("[data-related-field=PoluchKS]").removeClass("label-required");
        PoluchUIN.prop("required", false);
        $("[data-related-field=PoluchUIN]").removeClass("label-required");
        PoluchKBK.prop("required", false);
        $("[data-related-field=PoluchKBK]").removeClass("label-required");
        PoluchLS.clear();
        PoluchLS.closest(".column-container").hide();
        $("[data-related-field=PoluchLS]").closest(".column-container").hide();
    }
});

$(document).on('change', "textarea[data-field-name='PerechDS']", function (e) {
    var PerechDS = $("textarea[data-field-name='PerechDS']");
    var VidPoluch = $("textarea[data-field-name='VidPoluch']");
    var Poluch = $("input[name='Poluch']");
    var PoluchBank = $("input[name='PoluchBank']");
    var PoluchBankAddress = $("input[name='PoluchBankAddress']");
    var PoluchINN = $("input[name='PoluchINN']");
    var PoluchKPP = $("input[name='PoluchKPP']");
    var PoluchOKTMO = $("input[name='PoluchOKTMO']");
    var PoluchKBK = $("input[name='PoluchKBK']");
    var PoluchBIK = $("input[name='PoluchBIK']");
    var PoluchRS = $("input[name='PoluchRS']");
    var PoluchKS = $("input[name='PoluchKS']");
    var PoluchLS = $("input[name='PoluchLS']");
    var PoluchUIN = $("input[name='PoluchUIN']");
    if (PerechDS.val() == "Перечисление денежных средств осуществляется на указанные ниже реквизиты") {
        VidPoluch.closest(".column-container").show();
        VidPoluch.prop("required", true);
        $("[data-related-field=VidPoluch]").addClass("label-required");
        $("[data-related-field=VidPoluch]").closest(".column-container").show();
    }
    else {
        $("input[name='VidPoluch']").clear();
        VidPoluch.closest(".column-container").hide();
        VidPoluch.prop("required", false);
        $("[data-related-field=VidPoluch]").removeClass("label-required");
        $("[data-related-field=VidPoluch]").closest(".column-container").hide();
        PoluchBIK.closest(".column-container").hide();
        PoluchBIK.prop("required", false);
        $("[data-related-field=PoluchBIK]").removeClass("label-required");
        $("[data-related-field=PoluchBIK]").closest(".column-container").hide();
        PoluchRS.closest(".column-container").hide();
        PoluchRS.prop("required", false);
        $("[data-related-field=PoluchRS]").removeClass("label-required");
        $("[data-related-field=PoluchRS]").closest(".column-container").hide();
        Poluch.closest(".column-container").hide();
        Poluch.prop("required", false);
        $("[data-related-field=Poluch]").removeClass("label-required");
        $("[data-related-field=Poluch]").closest(".column-container").hide();
        PoluchBank.closest(".column-container").hide();
        PoluchBank.prop("required", false);
        $("[data-related-field=PoluchBank]").removeClass("label-required");
        $("[data-related-field=PoluchBank]").closest(".column-container").hide();
        PoluchBankAddress.closest(".column-container").hide();
        PoluchBankAddress.prop("required", false);
        $("[data-related-field=PoluchBankAddress]").removeClass("label-required");
        $("[data-related-field=PoluchBankAddress]").closest(".column-container").hide();
        PoluchINN.closest(".column-container").hide();
        PoluchINN.prop("required", false);
        $("[data-related-field=PoluchINN]").removeClass("label-required");
        $("[data-related-field=PoluchINN]").closest(".column-container").hide();
        PoluchKPP.closest(".column-container").hide();
        PoluchKPP.prop("required", false);
        $("[data-related-field=PoluchKPP]").removeClass("label-required");
        $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
        PoluchOKTMO.closest(".column-container").hide();
        PoluchOKTMO.prop("required", false);
        $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
        $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
        PoluchKBK.closest(".column-container").hide();
        PoluchKBK.prop("required", false);
        $("[data-related-field=PoluchKBK]").removeClass("label-required");
        $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
        PoluchUIN.closest(".column-container").hide();
        PoluchUIN.prop("required", false);
        $("[data-related-field=PoluchUIN]").removeClass("label-required");
        $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
        PoluchKS.closest(".column-container").hide();
        PoluchKS.prop("required", false);
        $("[data-related-field=PoluchKS]").removeClass("label-required");
        $("[data-related-field=PoluchKS]").closest(".column-container").hide();
        PoluchLS.closest(".column-container").hide();
        $("[data-related-field=PoluchLS]").closest(".column-container").hide();
        VidPoluch.clear();
        PoluchKPP.clear();
        PoluchOKTMO.clear();
        PoluchKBK.clear();
        PoluchUIN.clear();
        PoluchINN.clear();
        PoluchBIK.clear();
        PoluchRS.clear();
        PoluchKS.clear();
        PoluchLS.clear();
        Poluch.clear();
        PoluchBank.clear();
        PoluchBankAddress.clear();
    }
});



$(document).on('change', "textarea[data-field-name='VidPoluch']", function (e) {
    var VidPoluch = $("textarea[data-field-name='VidPoluch']");
    var Poluch = $("input[name='Poluch']");
    var PoluchBank = $("input[name='PoluchBank']");
    var PoluchBankAddress = $("input[name='PoluchBankAddress']");
    var PoluchINN = $("input[name='PoluchINN']");
    var PoluchKPP = $("input[name='PoluchKPP']");
    var PoluchOKTMO = $("input[name='PoluchOKTMO']");
    var PoluchKBK = $("input[name='PoluchKBK']");
    var PoluchBIK = $("input[name='PoluchBIK']");
    var PoluchRS = $("input[name='PoluchRS']");
    var PoluchKS = $("input[name='PoluchKS']");
    var PoluchLS = $("input[name='PoluchLS']");
    var PoluchUIN = $("input[name='PoluchUIN']");
    if (VidPoluch.val() == "Бюджетное учреждение (перевод средств осуществляется в одно из подразделений Центрального банка РФ)") {
        PoluchBIK.closest(".column-container").show();
        PoluchBIK.prop("required", true);
        $("[data-related-field=PoluchBIK]").addClass("label-required");
        $("[data-related-field=PoluchBIK]").closest(".column-container").show();
        PoluchRS.closest(".column-container").show();
        PoluchRS.prop("required", true);
        $("[data-related-field=PoluchRS]").addClass("label-required");
        $("[data-related-field=PoluchRS]").closest(".column-container").show();
        Poluch.closest(".column-container").show();
        Poluch.prop("required", true);
        $("[data-related-field=Poluch]").addClass("label-required");
        $("[data-related-field=Poluch]").closest(".column-container").show();
        PoluchBank.closest(".column-container").show();
        PoluchBank.prop("required", true);
        $("[data-related-field=PoluchBank]").addClass("label-required");
        $("[data-related-field=PoluchBank]").closest(".column-container").show();
        PoluchBankAddress.closest(".column-container").show();
        PoluchBankAddress.prop("required", true);
        $("[data-related-field=PoluchBankAddress]").addClass("label-required");
        $("[data-related-field=PoluchBankAddress]").closest(".column-container").show();
        PoluchINN.closest(".column-container").show();
        PoluchINN.prop("required", true);
        $("[data-related-field=PoluchINN]").addClass("label-required");
        $("[data-related-field=PoluchINN]").closest(".column-container").show();
        PoluchKPP.closest(".column-container").show();
        PoluchKPP.prop("required", true);
        $("[data-related-field=PoluchKPP]").addClass("label-required");
        $("[data-related-field=PoluchKPP]").closest(".column-container").show();
        PoluchOKTMO.closest(".column-container").show();
        PoluchOKTMO.prop("required", true);
        $("[data-related-field=PoluchOKTMO]").addClass("label-required");
        $("[data-related-field=PoluchOKTMO]").closest(".column-container").show();
        PoluchKBK.closest(".column-container").show();
        PoluchKBK.prop("required", true);
        $("[data-related-field=PoluchKBK]").addClass("label-required");
        $("[data-related-field=PoluchKBK]").closest(".column-container").show();
        PoluchUIN.closest(".column-container").show();
        PoluchUIN.prop("required", true);
        $("[data-related-field=PoluchUIN]").addClass("label-required");
        $("[data-related-field=PoluchUIN]").closest(".column-container").show();
        PoluchKS.closest(".column-container").hide();
        PoluchKS.prop("required", false);
        $("[data-related-field=PoluchKS]").removeClass("label-required");
        $("[data-related-field=PoluchKS]").closest(".column-container").hide();
        PoluchLS.closest(".column-container").show();
        $("[data-related-field=PoluchLS]").closest(".column-container").show();
        $("div[data-field-name=Получатель_Лиц_счет]").parent().attr("class", "col-xs-3 column-container");
    }
    if (VidPoluch.val() == "Небюджетное учреждение (перевод средств осуществляется на счет кредитной организации)") {
        PoluchBIK.closest(".column-container").show();
        PoluchBIK.prop("required", true);
        $("[data-related-field=PoluchBIK]").addClass("label-required");
        $("[data-related-field=PoluchBIK]").closest(".column-container").show();
        PoluchRS.closest(".column-container").show();
        PoluchRS.prop("required", true);
        $("[data-related-field=PoluchRS]").addClass("label-required");
        $("[data-related-field=PoluchRS]").closest(".column-container").show();
        Poluch.closest(".column-container").show();
        Poluch.prop("required", true);
        $("[data-related-field=Poluch]").addClass("label-required");
        $("[data-related-field=Poluch]").closest(".column-container").show();
        PoluchBank.closest(".column-container").show();
        PoluchBank.prop("required", true);
        $("[data-related-field=PoluchBank]").addClass("label-required");
        $("[data-related-field=PoluchBank]").closest(".column-container").show();
        PoluchBankAddress.closest(".column-container").show();
        PoluchBankAddress.prop("required", true);
        $("[data-related-field=PoluchBankAddress]").addClass("label-required");
        $("[data-related-field=PoluchBankAddress]").closest(".column-container").show();
        PoluchINN.closest(".column-container").show();
        PoluchINN.prop("required", true);
        $("[data-related-field=PoluchINN]").addClass("label-required");
        $("[data-related-field=PoluchINN]").closest(".column-container").show();
        PoluchKPP.closest(".column-container").hide();
        PoluchKPP.prop("required", false);
        $("[data-related-field=PoluchKPP]").removeClass("label-required");
        $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
        PoluchOKTMO.closest(".column-container").hide();
        PoluchOKTMO.prop("required", false);
        $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
        $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
        PoluchKBK.closest(".column-container").hide();
        PoluchKBK.prop("required", false);
        $("[data-related-field=PoluchKBK]").removeClass("label-required");
        $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
        PoluchUIN.closest(".column-container").hide();
        PoluchUIN.prop("required", false);
        $("[data-related-field=PoluchUIN]").removeClass("label-required");
        $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
        PoluchKS.closest(".column-container").show();
        PoluchKS.prop("required", true);
        $("[data-related-field=PoluchKS]").addClass("label-required");
        $("[data-related-field=PoluchKS]").closest(".column-container").show();
        PoluchLS.closest(".column-container").hide();
        $("[data-related-field=PoluchLS]").closest(".column-container").hide();
        PoluchKPP.clear();
        PoluchOKTMO.clear();
        PoluchKBK.clear();
        PoluchUIN.clear();
    }
    if (VidPoluch.val() == "") {
        PoluchBIK.closest(".column-container").hide();
        PoluchBIK.prop("required", false);
        $("[data-related-field=PoluchBIK]").removeClass("label-required");
        $("[data-related-field=PoluchBIK]").closest(".column-container").hide();
        PoluchRS.closest(".column-container").hide();
        PoluchRS.prop("required", false);
        $("[data-related-field=PoluchRS]").removeClass("label-required");
        $("[data-related-field=PoluchRS]").closest(".column-container").hide();
        Poluch.closest(".column-container").hide();
        Poluch.prop("required", false);
        $("[data-related-field=Poluch]").removeClass("label-required");
        $("[data-related-field=Poluch]").closest(".column-container").hide();
        PoluchBank.closest(".column-container").hide();
        PoluchBank.prop("required", false);
        $("[data-related-field=PoluchBank]").removeClass("label-required");
        $("[data-related-field=PoluchBank]").closest(".column-container").hide();
        PoluchBankAddress.closest(".column-container").hide();
        PoluchBankAddress.prop("required", false);
        $("[data-related-field=PoluchBankAddress]").removeClass("label-required");
        $("[data-related-field=PoluchBankAddress]").closest(".column-container").hide();
        PoluchINN.closest(".column-container").hide();
        PoluchINN.prop("required", false);
        $("[data-related-field=PoluchINN]").removeClass("label-required");
        $("[data-related-field=PoluchINN]").closest(".column-container").hide();
        PoluchKPP.closest(".column-container").hide();
        PoluchKPP.prop("required", false);
        $("[data-related-field=PoluchKPP]").removeClass("label-required");
        $("[data-related-field=PoluchKPP]").closest(".column-container").hide();
        PoluchOKTMO.closest(".column-container").hide();
        PoluchOKTMO.prop("required", false);
        $("[data-related-field=PoluchOKTMO]").removeClass("label-required");
        $("[data-related-field=PoluchOKTMO]").closest(".column-container").hide();
        PoluchKBK.closest(".column-container").hide();
        PoluchKBK.prop("required", false);
        $("[data-related-field=PoluchKBK]").removeClass("label-required");
        $("[data-related-field=PoluchKBK]").closest(".column-container").hide();
        PoluchUIN.closest(".column-container").hide();
        PoluchUIN.prop("required", false);
        $("[data-related-field=PoluchUIN]").removeClass("label-required");
        $("[data-related-field=PoluchUIN]").closest(".column-container").hide();
        PoluchKS.closest(".column-container").hide();
        PoluchKS.prop("required", false);
        $("[data-related-field=PoluchKS]").removeClass("label-required");
        $("[data-related-field=PoluchKS]").closest(".column-container").hide();
        PoluchLS.closest(".column-container").hide();
        $("[data-related-field=PoluchLS]").closest(".column-container").hide();
        PoluchKPP.clear();
        PoluchOKTMO.clear();
        PoluchKBK.clear();
        PoluchUIN.clear();
        PoluchINN.clear();
        PoluchBIK.clear();
        PoluchRS.clear();
        PoluchKS.clear();
        PoluchLS.clear();
        Poluch.clear();
        PoluchBank.clear();
        PoluchBankAddress.clear();
    }
});




var hidesizecontractreg = function () {
    var flag = $("input[name='registerObDog']");
    var RazmObDogProc = $("input[name='RazmObDogProc']");
    var VidObespCode = $("input[name='VidObespCode']");
	var naimETP = $("input[name='naimETP']");
	var PorObDog = $("textarea[name='PorObDog']");

    if (flag.is(":checked") && naimETP.val() != 'АО "МСП-ЕЭТП"') {
        RazmObDogProc.closest(".column-container").show();
        $("[data-related-field=RazmObDogProc]").closest(".column-container").show();
		RazmObDogProc.prop("required", true);
        $("[data-related-field=RazmObDogProc]").addClass("label-required");
		PorObDog.closest(".column-container").show();
        $("[data-related-field=PorObDog]").closest(".column-container").show();
		PorObDog.prop("required", true);
        $("[data-related-field=PorObDog]").addClass("label-required");
		VidObespCodeHide()//скрытие вида обеспечения для ком площадки
    }
    else {
        RazmObDogProc.val("");
        RazmObDogProc.closest(".column-container").hide();
        $("[data-related-field=RazmObDogProc]").closest(".column-container").hide();
        VidObespCode.clear();
        VidObespCode.closest(".column-container").hide();
        $("[data-related-field=VidObespCode]").closest(".column-container").hide();
		RazmObDogProc.prop("required", false);
        $("[data-related-field=RazmObDogProc]").removeClass("label-required");
		PorObDog.val("");
        PorObDog.closest(".column-container").hide();
        $("[data-related-field=PorObDog]").closest(".column-container").hide();
		PorObDog.prop("required", false);
        $("[data-related-field=PorObDog]").removeClass("label-required");
    }

    // flag.change(function() {
    //     if ($(this).is(":checked")) {

    //         RazmObDogProc.closest(".column-container").show();
    //         $("[data-related-field=RazmObDogProc]").closest(".column-container").show();
    //     }
    //     else
    //     {
    //         RazmObDogProc.closest(".column-container").hide();
    //         $("[data-related-field=RazmObDogProc]").closest(".column-container").hide();
    //     }
    // });
}

$(document).on('change', "input[name='registerObDog']", function (e) {
    hidesizecontractreg();
});

hidesizecontractreg();


//на редактирование
var hidesizerefundedit = function () {
    var flag = $("input[name='registerObVozv']");
    var RazmObVozv = $("input[name='registerRazmObVozv']");
    var RazmObVozvProc = $("input[name='RazmObVozvProc']");
    var SrokPredOb = $("input[name='SrokPredOb']");
    var VozvAv = $("input[name='registerVozvAv']");
    if ($(flag).is(":checked")) {
        RazmObVozvProc.closest(".column-container").show();
        $("[data-related-field=RazmObVozvProc]").closest(".column-container").show();
        RazmObVozvProc.prop("required", true);
        $("[data-related-field=RazmObVozvProc]").addClass("label-required");
        SrokPredOb.closest(".column-container").show();
        $("[data-related-field=SrokPredOb]").closest(".column-container").show();
    } else {
        RazmObVozvProc.val("");
        RazmObVozvProc.closest(".column-container").hide();
        $("[data-related-field=RazmObVozvProc]").closest(".column-container").hide();
        RazmObVozvProc.prop("required", false);
        $("[data-related-field=RazmObVozvProc]").removeClass("label-required");
        SrokPredOb.clear();
        SrokPredOb.closest(".column-container").hide();
        $("[data-related-field=SrokPredOb]").closest(".column-container").hide();
    }
}

$(document).on('change', "input[data-field-name='registerObVozv']", function (e) {
    hidesizerefundedit();
});

hidesizerefundedit();

var hideGarant = function () {
    var flag = $("input[data-field-name='registerGarant']");
    var RazmerGarantProc = $("input[data-field-name='RazmerGarantProc']");
    if ($(flag).is(":checked")) {
        RazmerGarantProc.closest(".column-container").show();
        $("[data-related-field=RazmerGarantProc]").closest(".column-container").show();
        RazmerGarantProc.prop("required", true);
        $("[data-related-field=RazmerGarantProc]").addClass("label-required");
    } else {
        RazmerGarantProc.clear();
        RazmerGarantProc.closest(".column-container").hide();
        $("[data-related-field=RazmerGarantProc]").closest(".column-container").hide();
        RazmerGarantProc.prop("required", false);
        $("[data-related-field=RazmerGarantProc]").removeClass("label-required");
    }
}

$(document).on('change', "input[data-field-name='registerGarant']", function (e) {
    hideGarant();
});

hideGarant();

function percentRazmObProc() {
    var RazmObProc = $("input[name='RazmObProc']");
	var naimETP = $("input[name='naimETP']").val();
    if (RazmObProc.val() != "") {
        var s2 = RazmObProc.autoNumeric('get');
        var val2 = parseFloat(s2 ? s2 : 0);
        if (val2 > 100) {
            showCommonErrors("Обратите внимание! Процент обеспечения заявки не может быть выше 100");
            RazmObProc.clear();
        } else if (naimETP == 'АО "Сбербанк - АСТ"') {
			if (val2 > 5) {
				showCommonErrors("Обратите внимание! Размер обеспечения заявки в конкурентных процедурах должен быть не более 5%");
				RazmObProc.clear();
			}
		}
    }
}

$(document).on('change', "input[data-field-name='RazmObProc']", function (e) {
    percentRazmObProc();
});


function percentRazmObDogProc() {
    var RazmObDogProc = $("input[name='RazmObDogProc']");
    if (RazmObDogProc.val() != "") {
        var s2 = RazmObDogProc.autoNumeric('get');
        var val2 = parseFloat(s2 ? s2 : 0);
        if (val2 > 100) {
            showCommonErrors("Обратите внимание! Размер обеспечения договора в процентах от НМЦ не может быть выше 100");
            RazmObDogProc.clear();
        }
    }
}

$(document).on('change', "input[data-field-name='RazmObDogProc']", function (e) {
    percentRazmObDogProc();
});



function percentRazmObVozvProc() {
    var RazmObVozvProc = $("input[name='RazmObVozvProc']");
    if (RazmObVozvProc.val() != "") {
        var s2 = RazmObVozvProc.autoNumeric('get');
        var val2 = parseFloat(s2 ? s2 : 0);
        if (val2 > 100) {
            showCommonErrors("Обратите внимание! Размер обеспечения возврата аванса в процентах от НМЦ не может быть выше 100");
            RazmObVozvProc.clear();
        }

    }
}

$(document).on('change', "input[data-field-name='RazmObVozvProc']", function (e) {
    percentRazmObVozvProc();
});


function percentRazmerGarantProc() {
    var RazmerGarantProc = $("input[name='RazmerGarantProc']");
    if (RazmerGarantProc.val() != "") {
        var s2 = RazmerGarantProc.autoNumeric('get');
        var val2 = parseFloat(s2 ? s2 : 0);
        if (val2 > 100) {
            showCommonErrors("Обратите внимание! Размер обеспечения гарантийных обязательств в процентах от НМЦ не может быть выше 100");
            registerRazmerGarant.clear();
            RazmerGarantProc.clear();
        }
    }
}

$(document).on('change', "input[data-field-name='RazmerGarantProc']", function (e) {
    percentRazmerGarantProc();
});

function VidObespCodeHide(){
	var naimETP = $("input[name='naimETP']");
	var VidObespCode = $("input[name='VidObespCode']");
	if (naimETP.val() === 'АО "ЕЭТП"') {
		VidObespCode.clear();
        VidObespCode.closest(".column-container").hide();
        $("[data-related-field=VidObespCode]").closest(".column-container").hide();
	}
    else {
        VidObespCode.closest(".column-container").show();
		$("[data-related-field=VidObespCode]").closest(".column-container").show();
	}
}

// СБЕрбанк-АСТ
(function() {
	function SberAstLogic() {
		var naimETP = $("input[name='naimETP']").val();
		var ArrFieldHide = ['registerObDog', 'registerObVozv', 'registerGarant', 'registerBG']; // поля которые скрываем при сбербанк АСТ
		var ArrSberASTField = ['BidApplicationSupplyTypeCode']; // поля необходимые для сбербанк АСТ
		var ArrRequiredSberASTField = ['BidApplicationSupplyTypeCode']; // поля обязательные для сбербанк АСТ		
		
		if (naimETP == 'АО "Сбербанк - АСТ"') {
			filedClearAndHide(ArrFieldHide); // скрываем поля которые не нужны для  Сбербанк - АСТ
			filedHideAndNotRequired(['registerObZa']) // кастомно скрываем Обеспечение заявки
			filedShowAndRequired(ArrRequiredSberASTField); // Список обязательных полей
			
			
			function BidApplicationSupplyTypeLogic() {
				var BidApplicationSupplyTypeName = $("input[name='BidApplicationSupplyTypeName']").val();
				
				if (BidApplicationSupplyTypeName != '' && BidApplicationSupplyTypeName != 'Не установлено') {
					filedShowAndRequired(['RazmObProc', 'Currency_kodOb', 'otherTreb']);
					$("[data-related-field=otherTreb]").closest(".row-container").show(); // кастомно отображем label
					
					$("input[data-field-name='registerObZa']").prop('checked', true);
				} else {
					filedClearAndHide(['RazmObProc', 'otherTreb']); // чистим и скрываем поля
					$("[data-related-field=otherTreb]").closest(".row-container").hide(); // кастомно скрываем label
					filedHideAndNotRequired(['Currency_kodOb']); //скрыть и сделать необязательными
					$("input[data-field-name='registerObZa']").prop('checked', false);
				}
				
			}
			
			
			// Вид обеспечения заявки на участие
			$("input[name='BidApplicationSupplyTypeName']").on('change', function(){
				BidApplicationSupplyTypeLogic(); // вызов функции
			});
			
			BidApplicationSupplyTypeLogic(); // вызов функции
			
		} 
		else {
			filedClearAndHide(ArrSberASTField); // скрываем поля  относящиеся к СБЕрбанк-АСТ
		}
	}
	
	SberAstLogic();
	
	(function DictionariesFilters() {
		var acceptMSP = $("input[data-field-name='acceptMSP']");
		var eventName = "DicDialogOpened";
		var BidApplicationSupplyTypeCode = $("button[id='BidApplicationSupplyTypeCode']");
		
		BidApplicationSupplyTypeCode.each(function (index, btn) {
			var jBtn = $(btn);
			jBtn.unbind(eventName);
			jBtn.on(eventName, function (event, args) {
				var items = args.items;
				var l = items.length;
				var flag = ArrNMCDRub.every(function(elem) {
					return parseFloat(elem['NMCDRub']) >= 5000000;
				});
				for (var i = 0; i < l; i++) {
					var currentItem = items[i].data['Наименование'];
					var current = items[i];
					// если больше или равен 5млн руб
					if (flag) {
						// Если МСП
						if (acceptMSP.is(':checked')) {
							
							if ([
									'Денежные средства, банковская гарантия', 
									'Не установлено'
								].indexOf(currentItem) == -1) {
								current.remove();
							}
							
						}
					}
					else {
						if (['Не установлено'].indexOf(currentItem) == -1) {
							current.remove();
						}
					}
				};
			});
		});
		
	})()
	
	
	// чистим и скрываем поля
	function filedClearAndHide(Arr) {
		Arr.forEach(function(item, i) {
			var current = $("[data-field-name='"+item+"']"); // текущий элемент
			current.closest('.column-container').hide();  // скрываем текущий элемент
			$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide(); // скрываем label
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
			current.prop('required', false);
			current.prop('checked', false);
			
			$("[name='"+item+"']").val('');
			current.val('');
			current.text('');
			
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
	
	//скрыть и сделать необязательными
	function filedHideAndNotRequired (Arr) {
		Arr.forEach(function(item, i) {
			var current = $("[data-field-name='"+item+"']"); // текущий элемент
			current.closest('.column-container').hide();  // скрываем текущий элемент
			$("div.documentView-field-label[data-related-field='"+item+"']").closest('.column-container').hide(); // скрываем label
			$("div.documentView-field-label[data-related-field='"+item+"']").removeClass('label-required');
			current.prop('required', false);
		});	
	}
})()
