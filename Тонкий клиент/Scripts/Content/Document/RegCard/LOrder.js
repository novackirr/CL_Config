"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}

// год на регистрации 
var god_reg = function() {
	
	var god = $("input[name='GodZak']");
    var Data = new Date();
	var Year = Data.getFullYear();
		
    god.val( Year ); 
};


   $("a:contains('На согласование')").each(function() {
       var button = $(this);
     
	  var SumPoz =   $(".documentView-field-value[data-name='Сумма заявки']").text();

        if ($.trim(SumPoz).length < 1 ) {
            button.attr('onclick', '');
            button.click(function (ev) {
                setPreventDefault(ev);
                stopEvent(ev);

                showCommonErrors('Нет ниодной позиции');
            });
        } else {
        //$("input[name='OpredelenieDnya']").val("0:00:00");
		//var DateReg =new Date();
		//$("input[name='registerDate']").val(DateReg);
	   }
	
	   }); 
	   
	   


scopes.onRegister(EditReg);
scopes.onRegister(god_reg);

scopes.onEdit(EditReg);