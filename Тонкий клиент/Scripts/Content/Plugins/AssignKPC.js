$("input[name='trebKPC']").prop('checked', true);
$("input[name='trebKPC']").val('1');

$(document).on('change', "input[name*='KPC-KPCFio-']", function (e) {
   var rowkey = $(this).closest(".table-edit-row").attr('data-rowkey');
   var currentFIO = $(this).val(); //ФИО текущего пользователя
   var CurrentID = $("input[name='KPC-KPCFio-Id-" + rowkey+ "']").val();
   var table = $("div[data-name='KPC']")
   var KPC = $(table).find("input[name*='KPC-KPCFio-Id']");
   if (CurrentID != ''){
		KPC.each(function(i,item){
			var CurrentRows = $(item).closest(".table-edit-row").attr('data-rowkey');
			if ($(item).val() != '' && CurrentRows != rowkey){
				if ($(item).val() == CurrentID) {
					showCommonErrors('Пользователь с ФИО: '+ currentFIO + " уже был добавлен");
					$("input[name='KPC-KPCFio-" + rowkey+ "']").val('')
					$("input[name='KPC-KPCFio-Id-" + rowkey+ "']").val('')
				} 
			}
		})
    }
});
