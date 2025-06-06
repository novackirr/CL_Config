"use strict";

var EditReg = function() {
     
	    $("li:has(:contains('Скрытые поля'))").hide();
	
}
// Краткое содержание, редактирование
var summary = function() {
    
var kratkoe = $("input[name='ktatkoe']");
					
	var nameprot = $("input[name='registerProtocolName']");
	var numizvEIS = $("input[name='Num_Izv_IIS']");
	

	function rebuildField() {
		var result = [];
	
		if (nameprot.val()) {
			result.push(nameprot.val());
		}
		
		if (numizvEIS.val()) {
			result.push('к извещению: номер в ЕИС ' + numizvEIS.val());
		}
		
			
		kratkoe.val(result.join(', '));
	}
	
	rebuildField();
	
	nameprot.change(function() {
		rebuildField();
	});
	
	numizvEIS.change(function() {
		rebuildField();
	});

	
	
}
scopes.onRegister(EditReg);
scopes.onRegister(summary);
scopes.onEdit(summary);
scopes.onEdit(EditReg);	


scopes.onView(function() {
 
});