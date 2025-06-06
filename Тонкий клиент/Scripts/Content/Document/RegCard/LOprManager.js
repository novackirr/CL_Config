"use strict";

var EditReg = function() {
    $("li:has(:contains('Скрытые поля'))").hide();	 
}

var ConvertTableColumnName = function() {
	var Table = $("div[data-name='ManagersDistribution']");
	var TableView = $("div[data-api-table-name='|Document|Распределение_менеджеров']");
	var ColumnNameArray = ['Billing', 'Commercial', 'Marketing'];
	var ColumnNameConvertArray = [{
		'Billing': 'Billing&IT',
		'Commercial': 'Commercial&GA',
		'Marketing': 'Marketing&Media'
	}]
	//Если создании и редактирование
	if (Table.length > 0) {
		ColumnNameArray.forEach(function(item, i){
			var Column = $(Table).find("div.table-edit-column[title='"+item+"']");
			if (Column.length > 0){
				Column.text(ColumnNameConvertArray[ColumnNameConvertArray.length-1][item]);
				Column.attr('title', ColumnNameConvertArray[ColumnNameConvertArray.length-1][item]);
			}
		})
	}
	//Если просмотр
	if (TableView.length > 0) {
			gridReady("|Document|Распределение_менеджеров").then(function (grid) {
			ColumnNameArray.forEach(function(item, i){
				var ColumnView = $(TableView).find("td[aria-label*='"+item+"']");
				if (ColumnView.length > 0){
					ColumnView.find("div.dx-datagrid-text-content").text(ColumnNameConvertArray[ColumnNameConvertArray.length-1][item]);
					$("li:has(:contains('Маршруты'))").hide();
				}
			})
		})
	}	
}

// проверка на дубли в таблице распределения менеджеров

var MatchChecking = function() {
		
	$("div[data-name='ManagersDistribution']").on('change', function(elem){
		var Table = $("div[data-name='ManagersDistribution']");
		var CurrentRow = $(elem.target).closest("[data-rowkey]"); // текущая строка
		var CurrentRowBoolean = CurrentRow.find("input[type='checkbox'][data-field-name]"); // все Boolean у текущей строки
		var CurrentRowAttribute = []; // массив где хранятся все проставленные признаки boolean у текущей строки
		var currentrRegionId = CurrentRow.find("input[name*='-MacroregionCode-Id-']").val(); // ИД регион у текущей изменяемой строки
		var currentrRegionName = CurrentRow.find("input[data-field-name*='-MacroregionCode-']").val(); // Наименование региона у текущей изменяемой строки
		var MatchRows = $(Table).find("input[name*='-MacroregionCode-Id-'][value='"+currentrRegionId+"']").closest("[data-rowkey]").not(CurrentRow).toArray(); // находим все строки, у которых такой же id региона как у текущей изменяемой строки, кроме текущей строки
		var errorMessage = [];
		var ColumnNameConvertArray = [{
			'Billing': 'Billing&IT',
			'Commercial': 'Commercial&GA',
			'Marketing': 'Marketing&Media', 
			'Construction': 'Construction',
			'Network': 'Network'
		}]
		
			
		if(CurrentRowBoolean.length > 0 && MatchRows.length > 0){
			
			// формируем массив из проставленных признак на редактируемой строке
			CurrentRowBoolean.each(function(i, item){
				if ($(item).is(':checked')) {
					CurrentRowAttribute.push($(item).closest("div.documentView-field-value").attr('data-field-name'));
				}
			})
			
			// Проверяем в найденных строках значения чекбоксов
			MatchRows.find(function(item){
				var i = $(item).attr('RowIndex');
				var DirectionsPurchasingArray = [];
				var result = false;
				// проверяем признаки чекбоксов с признаками на редактируемой строке
				CurrentRowAttribute.forEach(function(arg) {
					var CurrentBoolean = $(item).find("div[data-field-name='"+arg+"']").find("input[type='checkbox'][data-field-name]");
					 if(CurrentBoolean.is(":checked")) {
						
						result = true
						DirectionsPurchasingArray.push(ColumnNameConvertArray[ColumnNameConvertArray.length - 1][arg])
						CurrentRow.find("div[data-field-name='"+arg+"']").find("input[type='checkbox'][data-field-name]").prop('checked', false); // обнуляем признак
					 }
					
				})
				// Если нашли хотя бы одно совпадение чекбоксов
				if (result) {
					var AdditionallyErrorMessage = '';
					var ArrayLength = DirectionsPurchasingArray.length;
					if (ArrayLength > 0) {
						DirectionsPurchasingArray.forEach(function(elem, index){
							if (Number(index) == (Number(ArrayLength)-1)) {
								AdditionallyErrorMessage = AdditionallyErrorMessage + ' '+elem+'.';
							} else {
								AdditionallyErrorMessage = AdditionallyErrorMessage + ' '+elem+',';
							}
						})
					}
					
					errorMessage.push('В строке №'+i+' у макрорегиона '+currentrRegionName+' уже указаны следующие направления закупок:'+AdditionallyErrorMessage+'');
					ShowErrors(errorMessage);
					/* return true; */
				}
			})
			
			
			
		}
		
		function ShowErrors(errorMessage) {
			showCommonErrors(errorMessage);
		}
		
	})
	
}

var VisualOfManagersTable = function() {
	// Добавляю атрибут RowIndex каждой строке, чтобы знать какая это по счету строка. 
	// Используется при отображении сообщения в MatchChecking
		$("div[data-name='ManagersDistribution']").find("[data-rowkey]").each(function(i, item){
			$(item).attr('RowIndex', Number(i)+1); // добавляю атрибут
			/* $(item).find('.right-actions-offset').css({
				'margin-right' : '0px',
				'padding-right' : '0px'
			}) */
		})
		
		$("div[data-name='ManagersDistribution'] div.right-actions-offset").css({
			'margin-right' : '0px',
			'padding-right' : '0px'
		})
	
}

	// вызов при удалении строки
	$("div[data-name='ManagersDistribution']").on('onTableRowRemoved', function (elem) {
		VisualOfManagersTable()
	});
	// вызов при добавлении строки
	$("div[data-name='ManagersDistribution']").on('onTableRowAdded', function (elem) {
		VisualOfManagersTable()
	});



scopes.onRegister(EditReg);
scopes.onRegister(ConvertTableColumnName);
scopes.onRegister(MatchChecking);
scopes.onRegister(VisualOfManagersTable);

scopes.onEdit(EditReg);
scopes.onEdit(ConvertTableColumnName);
scopes.onEdit(MatchChecking);
scopes.onEdit(VisualOfManagersTable);

scopes.onView(ConvertTableColumnName);