$(document).ready(function() {
	

	
    $("#documentView-controlCard-accordion").hide();

    setDefaultDictionaryColumnValue("PreimUch", "PreimKodSposoba", "SpOprPostKod");
    setDefaultDictionaryColumnValue("TrebKUch", "TrebKodSposoba", "SpOprPostKod");
	
	$("a:contains('Создать извещение')").each(function() {
        var button = $(this);

        var pubDateValue = $(".documentView-field-value[data-name='Дата публикации позиции']").text();
        function parseDate(input) {
            var parts = input.split('.');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            return new Date(parts[2], parts[1]-1, parts[0]); // Note: months are 0-based
        }
		var pubDate = parseDate(pubDateValue);

        var nowDate = new Date();
        var diffDays = parseInt((nowDate - pubDate) / (24 * 3600 * 1000));

        if (diffDays < 10) {
          /*  button.css('background', 'red');            */

            button.attr('onclick', '');
            button.click(function(ev) {
                preventDefault(ev);
                stopEvent(ev);
                
                alert('Публикация извещения не возможна для позиций опубликованных менее 10 дней назад');
            });
            
        } else {
         /*   button.css('background', '#66CDAA'); */
        }
    });
	
	
	var nmckTab = $("div [data-tabname='НМЦК']");
 var tabContentId = nmckTab.children("a").attr("data-target");
 
 var attach = $(tabContentId).find(".panel-body");
	
    var textInfo = $("<div>");
                textInfo.html(" <div class='attachment-info'> <b>Направляемая заявка на закупку должна содержать следующие документы: обоснование начальной (максимальной) цены контракта (договора) </b>  </div>");
    attach.prepend(textInfo);	

	$("a:contains('Изменить заявку')").each(function () {
        var button = $(this);
        var pubDateValue = $(".documentView-field-value[data-name='Срок внесения изменений']").text();
        function parseDate(input) {
            var parts = input.split('.');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            return new Date(parts[2], parts[1] - 1, parts[0]); // Note: months are 0-based
        }
        var pubDate = parseDate(pubDateValue);
        var nowDate = new Date();
        var diffDays = parseInt((nowDate - pubDate) / (24 * 3600 * 1000));
        if (diffDays > 0 ) {
            /*  button.css('background', 'red');            */
            button.attr('onclick', '');
            button.click(function (ev) {
                preventDefault(ev);
                stopEvent(ev);
                alert('Внесение изменений невозможно.');
            });
        }
    });
	$("a:contains('Отказ от размещения')").each(function () {
        var button = $(this);
        var pubDateValue = $(".documentView-field-value[data-name='Срок отмены закупки']").text();
        function parseDate(input) {
            var parts = input.split('.');
            // new Date(year, month [, day [, hours[, minutes[, seconds[, ms]]]]])
            return new Date(parts[2], parts[1] - 1, parts[0]); // Note: months are 0-based
        }
        var pubDate = parseDate(pubDateValue);
        var nowDate = new Date();
        var diffDays = parseInt((nowDate - pubDate) / (24 * 3600 * 1000));
        if (diffDays > 0 ) {
            /*  button.css('background', 'red');            */
            button.attr('onclick', '');
            button.click(function (ev) {
                preventDefault(ev);
                stopEvent(ev);
                alert('Отказ от размещения не возможен.');
            });
        }
    });
	

	
	
});

function setDefaultDictionaryColumnValue(tableName, columnName, sourceElementName) {

    var value = $("input[name='" + sourceElementName +"']").val();
    if (value == undefined)
        return;

    var valueId = $("input[data-parent-name = '" + sourceElementName + "parent" + "']").val();

    var table = $("div[data-name='" + tableName + "']");
    var templateRow = table.find(".table-row-template");
    
    var columnName = tableName + "-" + columnName;
    var column = templateRow.find("input[name='" + columnName + "']");

    column.parent().find(".dict-display-field").val(value).change();
    column.parent().find("input[data-parent-name='" + columnName + "parent" + "']").val(valueId).change();

    column.val(value).change();
}

//скрытие Оргнаизации-заказчика и Организатора торгов
var EditReg = function() {
     	    
	var OrganizatorZak=$("input[name='registerOrganizator']");
	var OrgZakazchik=$("input[name='registerOrgZa']");
	OrganizatorZak.closest(".column-container").hide();
	OrgZakazchik.closest(".column-container").hide();
}

//Скрытие Организатор совместных торгов, если не стоит флаг Совместная закупка, просмотр
   var SovmZakView = function() {
   var OrgSovmTorg = $("div[data-name='Организатор совместных торгов']");
   var OtvSovmTorg = $("div[data-name='Ответственное лицо Организатора совместных торгов']");
   var flag = $("div[data-name='Совместные торги']").find("input[type='checkbox']");
   	  if ($(flag).attr("checked")) {	
         OrgSovmTorg.show();					
    } else {
		OrgSovmTorg.hide();
		OtvSovmTorg.hide();
       //	$("div[data-name='Совместные торги']").hide();
    }
};
	

var Soglas = function () {
        //объявляю переменные
		var trebSogl = $("input[name='soglasovanie']");
        var Sogl = $("input[name='soglasPerson']");
		//по умолчанию скрываю поле "Согласующий"
		Sogl.closest(".column-container").hide();
		$("[data-related-field-name=soglasPerson]").hide();
	   trebSogl.change(function() {
            if ($(trebSogl).is(":checked")) {
			  Sogl.closest(".column-container").show();
				 $("[data-related-field=soglasPerson").show(); 
				Sogl.prop("required", true);
		Sogl.closest(".column-container").find(".documentView-field-label").addClass("label-required");
		$("[data-related-field=soglasPerson]").addClass("label-required");
					
            } else {
			Sogl.val("");
			Sogl.prop("required", false);
		Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
		$("[data-related-field=soglasPerson]").removeClass("label-required");
		
           	 Sogl.closest(".column-container").hide();
				$("[data-related-field=soglasPerson").hide(); 
			  Sogl.closest(".clearfix").removeClass("label-required");
             				Sogl.closest(".column-container").find(".documentView-field-label").removeClass("label-required");
			 $("[data-related-field=soglasPerson]").removeClass("label-required"); 
				  
            }
       });
	trebSogl.change();
}
//Требуется согласование , просмотр
var SoglasovView = function () {
	var Soglasov = $("div[data-name='Согласующий']");
	var flag = $("div[data-name='Требуется согласование']").find("input[type='checkbox']");
	if ($(flag).attr("checked")) {
		Soglasov.show();
		/* $("div[data-name='Требуется согласование']").hide(); */
		
	} else {
		Soglasov.hide();
			
	}
};
scopes.onView(SoglasovView);
scopes.onView(SovmZakView);

scopes.onRegister(EditReg);
scopes.onRegister(Soglas);

scopes.onEdit(EditReg);
scopes.onEdit(Soglas);

  
