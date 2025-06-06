
$("#documentView-controlCard-accordion").hide();

$("#registerView-controlCard-accordion").hide();
/* $("#registerView-documentLinks-accordion").hide(); */
var EditReg = function () {

	$("li:has(:contains('Скрытые поля'))").hide();

}



//Обязательность полей в таблице

var TableReq  = function () {
	
	var table = $("div[data-name='ItemTab']");

	table.on('onTableRowAdded', function(event, rowKey) {
	var Godrov = $("div[data-name='ItemTab'] input[name='ItemTab-Godrov-" + rowKey + "']");
	var DatePublSv = $("div[data-name='ItemTab'] input[name='ItemTab-DatePublSv-" + rowKey + "']");
	var VidPlanObslKod = $("div[data-name='ItemTab'] input[name='ItemTab-VidPlanObslKod-" + rowKey + "']");
	var VidPlanKontrKod = $("div[data-name='ItemTab'] input[name='ItemTab-VidPlanKontrKod-" + rowKey + "']");
	var TipSubProverka = $("div[data-name='ItemTab'] input[name='ItemTab-TipSubProverka-" + rowKey + "']");
	var MesNachPerkod = $("div[data-name='ItemTab'] input[name='ItemTab-MesNachPerkod-" + rowKey + "']");
		var CelOsn = $("div[data-name='ItemTab'] input[name='ItemTab-CelOsn-" + rowKey + "']");
	
	var VidProverki = $("input[name='VidProverki']");
		VidProverki.change(function () {
		if (VidProverki.val()=="Плановые проверки") {
			
			Godrov.prop("required", true); 
			DatePublSv.prop("required", true); 
			VidPlanObslKod.closest(".column-container").find(".dict-display-field").prop("required", true); 
			VidPlanKontrKod.closest(".column-container").find(".dict-display-field").prop("required", true); 
			TipSubProverka.closest(".column-container").find(".dict-display-field").prop("required", true); 
			MesNachPerkod.closest(".column-container").find(".dict-display-field").prop("required", true); 
			CelOsn.prop("required", true); 
		} else {
			
			Godrov.prop("required", false); 
			DatePublSv.prop("required", false); 
			VidPlanObslKod.closest(".column-container").find(".dict-display-field").prop("required", false); 
			VidPlanKontrKod.closest(".column-container").find(".dict-display-field").prop("required", false); 
			TipSubProverka.closest(".column-container").find(".dict-display-field").prop("required", false); 
			MesNachPerkod.closest(".column-container").find(".dict-display-field").prop("required", false); 
			CelOsn.prop("required", false); 
		}
	});
		VidProverki.change();
	
	});
};
	
	
	
	

//Скрыть блок "проверки"
//на редактирование
var Plan = function () {
	var VidProverki = $("input[name='VidProverki']");
	var VnePlan = $("li:has(:contains('Внеплановые проверки'))");
	var Plan = $("li:has(:contains('Плановые проверки'))");
	
	var ProvPeriodS= $("input[name='ProvPeriodS']");
	var ProvPeriodPo= $("input[name='ProvPeriodPo']");
	var DateTimeProv= $("input[name='DateTimeProv']");
	var TipSubProv	= $("input[name='TipSubProv']");
	var OrgProvName= $("input[name='OrgProv']");
	var CelProv= $("textarea[name='CelProv']");
	var OpisPredZak= $("textarea[name='OpisPredZak']");
	
	
	
	var MesNachZak = $("input[name='MesNachZak']");
	var CodNachZak = $("input[name='CodNachZak']");
	var MesOkonZak=$("input[name='MesOkonZak']");
	var CodOkonZak=$("input[name='CodOkonZak']");
	var VladPlanaName=$("input[name='VladPlana']");
	
	VidProverki.change(function () {
		if (VidProverki.val()=="Внеплановые проверки") {
			VnePlan.show();
			Plan.hide();
			
			
		ProvPeriodS.prop("required", true);
			// ProvPeriodS.parent().find("input.datetime-edit-control").prop("required", true);
			ProvPeriodS.closest(".control-label").addClass("label-required");
			$("[data-related-field=ProvPeriodS]").addClass("label-required");
			ProvPeriodPo.prop("required", true);
			// ProvPeriodPo.parent().find("input.datetime-edit-control").prop("required", true);
			ProvPeriodPo.closest(".control-label").addClass("label-required");
			$("[data-related-field=ProvPeriodPo]").addClass("label-required");
			DateTimeProv.parent().find("input.datetime-edit-control").prop("required", true);
			DateTimeProv.closest(".control-label").addClass("label-required");
			$("[data-related-field=DateTimeProv]").addClass("label-required");
			TipSubProv.closest(".column-container").find(".dict-display-field").prop("required", true);
			TipSubProv.closest(".control-label").addClass("label-required");
			$("[data-related-field=TipSubProv]").addClass("label-required");
			OrgProvName.closest(".column-container").find(".dict-display-field").prop("required", true);
			OrgProvName.closest(".control-label").addClass("label-required");
			$("[data-related-field=OrgProv]").addClass("label-required");
			CelProv.prop("required", true);
			CelProv.closest(".control-label").addClass("label-required");
			$("[data-related-field=CelProv]").addClass("label-required");
			OpisPredZak.prop("required", true);
			OpisPredZak.closest(".control-label").addClass("label-required");
			$("[data-related-field=OpisPredZak]").addClass("label-required");
			
			
			
			MesNachZak.closest(".column-container").find(".dict-display-field").prop("required", false);
			MesNachZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=MesNachZak]").removeClass("label-required");
			MesOkonZak.closest(".column-container").find(".dict-display-field").prop("required", false);
			MesOkonZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=MesOkonZak]").removeClass("label-required");
			CodNachZak.prop("required", false);
			CodNachZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=CodNachZak]").removeClass("label-required");
			CodOkonZak.prop("required", false);
			CodOkonZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=CodOkonZak]").removeClass("label-required");
			VladPlanaName.closest(".column-container").find(".dict-display-field").prop("required", false);
			VladPlanaName.closest(".control-label").removeClass("label-required");
			$("[data-related-field=VladPlana]").removeClass("label-required");
					
		} 
		
		if (VidProverki.val()=="Плановые проверки") {
		
			VnePlan.hide();
			Plan.show();
				
			ProvPeriodS.prop("required", false);
			ProvPeriodS.closest(".control-label").removeClass("label-required");
			$("[data-related-field=ProvPeriodS]").removeClass("label-required");
			ProvPeriodPo.prop("required", false);
			ProvPeriodPo.closest(".control-label").removeClass("label-required");
			$("[data-related-field=ProvPeriodPo]").removeClass("label-required");
			DateTimeProv.parent().find("input.datetime-edit-control").prop("required", false);
			DateTimeProv.closest(".control-label").removeClass("label-required");
			$("[data-related-field=DateTimeProv]").removeClass("label-required");
			TipSubProv.closest(".column-container").find(".dict-display-field").prop("required", false);
			TipSubProv.closest(".control-label").removeClass("label-required");
			$("[data-related-field=TipSubProv]").removeClass("label-required");
			OrgProvName.closest(".column-container").find(".dict-display-field").prop("required", false);
			OrgProvName.closest(".control-label").removeClass("label-required");
			$("[data-related-field=OrgProv]").removeClass("label-required");
			CelProv.prop("required", false);
			CelProv.closest(".control-label").removeClass("label-required");
			$("[data-related-field=CelProv]").removeClass("label-required");
			OpisPredZak.prop("required", false);
			OpisPredZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=OpisPredZak]").removeClass("label-required");
			
		
			
			MesNachZak.closest(".column-container").find(".dict-display-field").prop("required", true);
			MesNachZak.closest(".control-label").addClass("label-required");
			$("[data-related-field=MesNachZak]").addClass("label-required");
			MesOkonZak.closest(".column-container").find(".dict-display-field").prop("required", true);
			MesOkonZak.closest(".control-label").addClass("label-required");
			$("[data-related-field=MesOkonZak]").addClass("label-required");
			CodNachZak.prop("required", true);
			CodNachZak.closest(".control-label").addClass("label-required");
			$("[data-related-field=CodNachZak]").addClass("label-required");
			CodOkonZak.prop("required", true);
			CodOkonZak.closest(".control-label").addClass("label-required");
			$("[data-related-field=CodOkonZak]").addClass("label-required");
			VladPlanaName.closest(".column-container").find(".dict-display-field").prop("required", true);
			VladPlanaName.closest(".control-label").addClass("label-required");
			$("[data-related-field=VladPlana]").addClass("label-required");
		} 
			
			if (VidProverki.val()=="") {
			VnePlan.hide();
			Plan.hide();
			
			ProvPeriodS.prop("required", false);
			ProvPeriodS.closest(".control-label").removeClass("label-required");
			$("[data-related-field=ProvPeriodS]").removeClass("label-required");
			ProvPeriodPo.prop("required", false);
			ProvPeriodPo.closest(".control-label").removeClass("label-required");
			$("[data-related-field=ProvPeriodPo]").removeClass("label-required");
			DateTimeProv.parent().find("input.datetime-edit-control").prop("required", false);
			DateTimeProv.closest(".control-label").removeClass("label-required");
			$("[data-related-field=DateTimeProv]").removeClass("label-required");
			TipSubProv.closest(".column-container").prop("required", false);
			TipSubProv.closest(".control-label").removeClass("label-required");
			$("[data-related-field=TipSubProv]").removeClass("label-required");
			OrgProvName.closest(".column-container").find(".dict-display-field").prop("required", false);
			OrgProvName.closest(".control-label").removeClass("label-required");
			$("[data-related-field=OrgProv]").removeClass("label-required");
			CelProv.closest(".column-container").prop("required", false);
			CelProv.closest(".control-label").removeClass("label-required");
			$("[data-related-field=CelProv]").removeClass("label-required");
			OpisPredZak.closest(".column-container").prop("required", false);
			OpisPredZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=OpisPredZak]").removeClass("label-required");
			
			MesNachZak.closest(".column-container").find(".dict-display-field").prop("required", false);
			MesNachZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=MesNachZak]").removeClass("label-required");
			MesOkonZak.closest(".column-container").find(".dict-display-field").prop("required", false);
			MesOkonZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=MesOkonZak]").removeClass("label-required");
			CodNachZak.closest(".column-container").prop("required", false);
			CodNachZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=CodNachZak]").removeClass("label-required");
			CodOkonZak.closest(".column-container").prop("required", false);
			CodOkonZak.closest(".control-label").removeClass("label-required");
			$("[data-related-field=CodOkonZak]").removeClass("label-required");
			VladPlanaName.closest(".column-container").find(".dict-display-field").prop("required", false);
			VladPlanaName.closest(".control-label").removeClass("label-required");
			$("[data-related-field=VladPlana]").removeClass("label-required");
			
		} 
		
	});
	VidProverki.change();
	
}
//на просмотр

	var Plan_View = function () {
	var VnePlan = $("li:has(:contains('Внеплановые проверки'))");
	var Plan = $("li:has(:contains('Плановые проверки'))");

	
	var VidProverki_view = $(".documentView-field-value[data-name='Вид проверки']");
	if ($.trim($(VidProverki_view).text()) == "Внеплановые проверки"){
	 VnePlan.show();
			Plan.hide();
	}
	if ($.trim($(VidProverki_view).text()) == "Плановые проверки"){
	VnePlan.hide();
			Plan.show();
	}
	
		
}



scopes.onView(Plan_View);
scopes.onRegister(Plan);
scopes.onRegister(TableReq);
scopes.onEdit(TableReq);
scopes.onRegister(EditReg);
scopes.onEdit(EditReg);
scopes.onEdit(Plan);

	