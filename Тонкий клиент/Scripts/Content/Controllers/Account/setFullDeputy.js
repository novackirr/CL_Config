$(document).ready(function () {
    
    setAssistant.init();
   
    $('#Type').on('change', function (e) {
     
        var retUrl = '';      
        if ($("[name='returnUrl']").val() != "")
            retUrl = "&returnUrl=" + encodeURIComponent($("[name='returnUrl']").val());
        var url = $(this).attr('action') + "?type=" + this.value + retUrl;      
        window.open(url, '_top');
      
    });


  

});


var setAssistant = {
    init: function () {
        addParsleyValidation("form");
        this.addEventHandlers();
    },

    addEventHandlers: function () {
       
        this.addFormSubmitEvent();
        this.addCancelEvent();   

    },   
   
    addFormSubmitEvent: function () {
        var self = this;
        $(".btn-save").click(function () {

            var form = $("#content-set-assistant-form");         
            form.parsley().whenValidate().done(function () {
                waitingDialog.showWaiting();
                ajaxFormSubmit(form[0], function (response) {               
                    self.showSuccess();
                    waitingDialog.hide();
                    $(".btn-cancel").click();
                }, function (error) {
                    self.showError(error.responseText);
                    waitingDialog.hide();
                });
            });
        });
    },

    addCancelEvent: function () {

        $(".btn-cancel").click(function () {
          
            //Делаем невозожным множественное нажатие кнопки
            $(".btn").prop('disabled', true);
            showLoadingIndicator("#content-set-assistant-loading-image");
           
            window.location.href = $("[name='returnUrl']").val();
            return false;
        });
    },

    showError: function showError(error) {
        var alertElement = $("#message");
        alertElement.html("");
        alertElement.removeClass('alert-success');
        if (!alertElement.hasClass('alert-danger')) {
            alertElement.addClass('alert-danger');
        }

        alertElement.text(error);
        alertElement.show();
    },

    showSuccess: function showSuccess() {
        var alertElement = $("#message");
        alertElement.html("");
        alertElement.removeClass('alert-danger');
        if (!alertElement.hasClass('alert-success')) {
            alertElement.addClass('alert-success');
        }

        alertElement.text("Изменения в профиле успешно сохранены.");
        alertElement.show();
    }
}

function gridItemSelectedHandler(grid) {
    
    var dictButtonId = $dictButton.attr("id");
    var $table = $dictButton.closest(".table-edit");
    var isTable = $table.length > 0;
    var tableName = $table.attr('data-name');
    var tableRowIndex = $dictButton.closest(".table-edit-row").attr('data-rowkey');

    var fillSelected = function (selRows) {
        if (multipleSelection) {
            fillMultipleDictFields(selRows, dictButtonId, isTable, tableName, tableRowIndex);
        } else {
            fillSelectionFields(selRows[0], dictButtonId, isTable, tableName, tableRowIndex);
        }
    };

    if (typeof ExtContractorManager !== 'undefined') {
        if (selectedRowsDebug.length >= 1) {
            var selectedRow = selectedRowsDebug[0];
            if (selectedRow.data.hasOwnProperty("source") && (dictButtonId == "orgpost2" || dictButtonId == "orgposttable")) {
                var selectedItemCode = selectedRow.get(model.CodeKey);
                var manager = ExtContractorManager(store, treePanel, win);
                var inn = selectedRow.data["ИНН"];
                var name = selectedRow.data["Наименование"];
                manager.saveChoosenContractor(selectedItemCode,
                    selectedRowsDebug,
                    fillSelected,
                    inn,
                    name,
                    loadDictionaryDataRow,
                    function () {
                        closeWin();
                    },
                    function () {
                        fillDictFields(true, dictButtonId, isTable, tableName, tableRowIndex, fillSelected);
                        deferred.resolve(selectedRowsDebug);
                    },
                    function () {
                        fillDictFields(false, dictButtonId, isTable, tableName, tableRowIndex, fillSelected);
                        deferred.resolve(selectedRowsDebug);
                    });
            } else {
                fillDictFields(true, dictButtonId, isTable, tableName, tableRowIndex, fillSelected);
                closeWin();
                deferred.resolve(selectedRowsDebug);
            }
        } else {
            fillDictFields(false, dictButtonId, isTable, tableName, tableRowIndex, fillSelected);
            closeWin();
            deferred.resolve(selectedRowsDebug);
        }
    } else {
        fillDictFields(true, dictButtonId, isTable, tableName, tableRowIndex, fillSelected);
        closeWin();
        deferred.resolve(selectedRowsDebug);
    }
}

function addNewTableRow(elem, event) {  

    setPreventDefault(event);

    var table = $(elem).closest('.table-edit > .table-content');

    // var templateRow = table.children(".templates").children('.table-row-template').children('.table-edit-row');
    var templateRow = table.children(".templates").children('.table-edit-row');


    var templateNestedTable = table.children(".templates").children('.table-row-row-view');
    if (!templateNestedTable || templateNestedTable.length === 0) {
        templateNestedTable = table.parents().find(".templates").children('.table-row-row-view');
    }

    var newRow = templateRow.clone(false);

    var keys = table.children('.table-edit-row').map(function () {
        return $(this).attr('data-rowkey');
    });



    var currentMaxkey;
    if (keys.length > 0) {
        currentMaxkey = Math.max.apply(Math, jQuery.map(keys, function (e) {
            return e;
        }));
    } else {
        currentMaxkey = 0;
    }
   

    // data-field-name используется в контроле адресной книги
   
       
        newRow.attr('data-rowkey', currentMaxkey + 1);

        var tableName = table.parent().attr('data-name');
        var newRowKey = currentMaxkey + 1;
 /*
        var newRowKey = Number(currentMaxkey) + Number(newRow.find("input[name='ModelKey']")[0].value);


       newRow.find('input:not([type=radio]), select, checkbox, textarea, ul, button[is-addressbook=true]').each(function () {


            if ($(this).attr('name')) {
                $(this).attr('name', '[' + newRowKey + '].' + $(this).attr('name'));
            }

            if ($(this).attr('data-field-name')) {              
                    $(this).attr('data-field-name', $(this).attr('data-field-name') + '-' + newRowKey);
            }
            if ($(this).attr('data-parent-name')) {
                var currentValue = $(this).attr('data-parent-name');


                currentValue = currentValue.substring(0, currentValue.length - 6) + "-" + newRowKey + "parent";
                $(this).attr('data-parent-name', currentValue);
            }

            if ($(this).attr('data-edit-required') === 'true') {
                $(this).removeAttr('data-edit-required');
                $(this).attr("required", true);
            }

            if ($(this).attr('data-dictionarygroup')) {
                $(this).attr('data-dictionarygroup',
                    tableName + "-" + $(this).attr('data-dictionarygroup') + "-" + newRowKey);
            }
            if ($(this).attr('data-dictionaryParent')) {
                $(this).attr('data-dictionaryParent',
                    tableName + "-" + $(this).attr('data-dictionaryparent') + "-" + newRowKey);
            }
            if ($(this).attr('data-addressbook-main-field')) {
                $(this).attr('data-addressbook-main-field',
                    tableName + "-" + $(this).attr('data-addressbook-main-field') + "-" + newRowKey);
            }
        });*/

        newRow.find(".show-dict-btn").each(function () {
            if ($(this).attr('parent-id')) {
                $(this).attr('parent-id', tableName + "-" + $(this).attr('parent-id') + "-" + newRowKey);
            }
        });


    
        newRow.find("input[name='IdSeconds']").attr('required', true);
        newRow.find("input[name='DateFrom']").attr('required', true);
        newRow.find("[data-dg-group]").each(function () {
            $(this).attr('data-dg-group', tableName + "-" + newRowKey + "-" + $(this).attr('data-dg-group'));
        });

        table.append(newRow);

        // если есть шаблон для вложенной таблицы, рендерим его внутри контейнера вложенной таблицы как шаблон для новой строки


        newRow.find(".form-dictionary-control").each(function () {
            var item = $(this);
            if (item.attr("data-dictionaryparent") == "")
                setDictionaryField(item);
        });

    setEditTableRowVisibility('.table-edit-wrapper-deputy', table.closest('.table-edit-wrapper-deputy').parent());

        var datalistName = newRow.find('[data-wslist]').attr('data-wslist');
        newRow.find('[data-wslist]').attr('list', datalistName);
        reinitialiseScriptShort();

        var paramsObj = {
            rowKey: newRowKey,
            innerTableContainer: newRow
    };
   
    calcTableNUM(table.children(".table-edit-row[data-rowkey]"));
        $(table).trigger("onTableRowAdded", paramsObj);

        window.adjustNewRowTextAreaHeight(newRow);
   
}


function removeTableRow(elem, event) {
    //для программного удаления 
    if (event !== undefined) {
        setPreventDefault(event);
    }

    var table = $(elem).closest('.table-edit');
   
    var deletingRowsField = table.find("input[type=hidden][name='" + table.attr('data-deleted-rows-field') + "']");    
    var deletingRowKeys = deletingRowsField.val();
    
    if ($(elem).attr('groupedTable')) {
        $(elem).closest('.table-edit-row').find('.table-edit-row[data-rowkey]').each(function (index, value) {
            var deletingRowKeys = deletingRowsField.val();
            var rowGroupKey = $(value).attr('data-rowkey').split("-").pop();
            deletingRowsField.val(deletingRowKeys +
                rowGroupKey +
                ",");
        });

    } else {
        deletingRowsField.val(deletingRowKeys +
            $(elem).closest('.table-edit-row').attr('data-rowkey').split("-").pop() +
            ",");
    }
    //mark attachment keys on row to delete
    var deletingAttachmentsField = table.find("input[type=hidden][name='" + table.attr('data-deleted-attachment-keys') + "']");
    $(elem).closest('.table-edit-row').find('.attachment').each(function (index, value) {
        var attachmentKey = $(value).attr('data-attachmentKey');
        var deletingAttachmentKeys = deletingAttachmentsField.val();
        deletingAttachmentsField.val(deletingAttachmentKeys + attachmentKey + ",");
    });

    var row = $(elem).closest('.table-edit-row');
    row.find(".delete-table-row-attachment:visible").children(":first").click();

    var rowKey = row.attr("data-rowkey");
    $(table).trigger("onTableRowRemoving", rowKey);
    // Ищем нашу форму, в случае если у нас есть хотя бы одно поле типа money, то на форме висит событие submit.autoNumeric
    // Дальше мы удаляем строку из DOM, и плагин падает, т.к. он внутри себя запоминает настройки каждого поля с помощью jquery.data()
    // Поэтому удалим эвент, удалим строку и инициализируем плагин заново
    row.closest('form').off('submit.autoNumeric');
    row.remove();
    initAutonumeric();

  
    var tbl = table.find('.table-content');
  
    rows = tbl.children(".table-edit-row[data-rowkey]");
   
    setEditTableRowVisibility('.table-edit-wrapper-deputy', table.closest(".table-edit-wrapper-deputy").parent());
    calcTableNUM(rows);
    $(table).trigger("onTableRowRemoved", rowKey);
}

function CheckRights(idsCodes, roleId) {
    
    winAddressbook = createWin(idsCodes, roleId);    
    winAddressbook.show();


}

var createWin = function (idsCodes, roleId) {
    var tabPanelPadding = 10;

    var tabpanel = Ext.createWidget('tabpanel', {
        activeTab: 0,
        autoWidth: true,
        autoHeight: true,
        minWidth: 350,
        plain: true,
        layout: 'fit',
        deferredRender: false,
        defaults: {
            autoScroll: false,
            bodyPadding: tabPanelPadding
        },
        items: []
    });

    
   

    

    var windowDefaultMinWidth = 840;
    var windowDefaultMinHeight = 520;//610;
    var strWindow = '<div>Предупреждение</div>';

    strWindow = strWindow + '<p>Недоступно назначение замещения для выбранного сотрудника ввиду несовпадения прав, для назначения замещения необходимо оформить и согласовать заявку';
    strWindow = strWindow + ' на дополнительные права через Реестр Задач: '
    strWindow = strWindow + '<p> </p>'
    strWindow = strWindow + '<p>Ссылка на завявку в Реестр Задач - sso.vtb.grp/RZ/Task/Index/12995</p>'
    winAddressbook = Ext.create('widget.window', {
        title: '',
        html: strWindow,

        width: 400,
        autoHeight: true,       
        maximizable: false,
        resizable: false,
        draggable: false,
        closable: false,

        modal: true,

        bodyPadding: '10px 5px 5px 5px',
        bodyStyle: "background-color:white",

        buttons: [
            {
                text: 'Направить уведомление',
                handler: function () {                                      
                    url = getAbsoluteUrl("Account/NotifyUsers");                      
                    $.post(url, { Ids: idsCodes, RoleId: roleId }, function (data) {                    
                    }); this.up('window').close();
                        },
            },

            {
                text: 'Закрыть',
                handler: function () { this.up('window').close(); },
            }
        ]//,

        //autoShow: true,
    });

    //win.show();
//}
  //  });

    return winAddressbook;
};



function reformButton(storeBookTpl, regName, form) {
    
    regName = regName.replace("Role", "IdSeconds");
    var button =($(form.find("button[name='" + regName + "']").first()));
   
    if (storeBookTpl.length === 0) {
        button.prop('disabled',true);
    }
    else {
        button.prop('disabled', false);
        button.attr('data-url', button.attr('data-url-half') + "&findSameRights=" + storeBookTpl[0].key);
        button.data('url', button.attr('data-url-half') + "&findSameRights=" + storeBookTpl[0].key);
    }
    ($(form.find("input[name='" + regName + "']").first())).val('');
    ($(form.find("input[name='" + regName + "DictId']").first())).val('');
    ($(form.find("input[name='" + regName + "DictName']").first())).val('');
    var formlist = ($(form.find("ul[name='" + regName + "List']").first()));
    formlist.val('');
    formlist.find("li").remove();
    button.val('');
}

function calcTableNUM(rows) {
  
      
    var i = 0;
    
    rows.each(function () {
        var row = $(this);
        row.find('input[additionalName]').each(function () {
            if ($(this).attr('name')) {
                $(this).attr('name', '[' + i + '].' + $(this).attr('additionalName'));
            }
            if ($(this).attr('data-field-name')) {
                $(this).attr('data-field-name', '[' + i + '].' + $(this).attr('additionalName'));
            }

        });
        row.find('ul[additionalName]').each(function () {
            if ($(this).attr('name')) {
                $(this).attr('name', '[' + i + '].' + $(this).attr('additionalName'));
            }

        });
        row.find('button[additionalName]').each(function () {
            if ($(this).attr('name')) {
                $(this).attr('name', '[' + i + '].' + $(this).attr('additionalName'));
            }

        });
        row.find("input[name='currentindex']").each(function () {
            $(this).val(i);
        });
        i++;
    });
}

function setoldvalue(element) {    
    
    element.setAttribute("oldvalue", element.value);
   
}

function IndefiniteChange(element) {
    
    var dtEnd = $(element).closest('.table-edit-row').find("input[additionalName='DateEnd']");
    if (element.checked) {
    
        dtEnd.prop('disabled', true);
        dtEnd.val('');

    }
    else {
    
        dtEnd.prop('disabled', false);

    }
}


function fillMultipleDictFieldsToTable(dictButtonId, isTable, tableName, tableRowIndex, $dictButton) {    
    setPreventDefault(event);

    
    $dictButton.closest("div").find("span.action-container").remove();
    $dictButton.closest("div").find("div.multiple-editor-remove").remove();
    //$dictButton.closest("div").find("button").remove();

    //$dictButton.closest("div").removeChild($dictButton.closest("div").find("multiple-editor-remove"));
    // надо будет перенсти на имя 
    var ul = $dictButton.closest("div").find("ul.multiple-editor-list");
    var str1 = $dictButton.closest("div").find("input[name='currentindex']");
    var indexcurrent = str1.val();

    var j = "0";

    var str2 = $dictButton.closest("div").find("input[name='filtersName']");
    var str3 = $dictButton.closest("div").find("input[name='filtersFlow']");
    var str4 = $dictButton.closest("div").find("input[name='Filters']");
    var str5 = $dictButton.closest("div").find("input[name='filtersNameForUser']");
  
    strfilterName = str2.val();
    strfilterFlow = str3.val();
    strfilters = str4.val();
    strfiltersNameForUser = str5.val();

    var filterName = strfilterName.split('|');
    var filterFlow = strfilterFlow.split('|');
    var filterDictId = strfilters.split('|');   
    var filterNameForUser = strfiltersNameForUser.split('|');
    
    
    var table = $dictButton.closest('.table-edit > .table-content');

    // var templateRow = table.children(".templates").children('.table-row-template').children('.table-edit-row');
    var templateRow = table.children(".templatesDict").children('.table-edit-row');
    table = $dictButton.closest('.dummyFilters');
   
   
    var templateNestedTable = table.children(".templatesDict").children('.table-row-row-view');
    if (!templateNestedTable || templateNestedTable.length === 0) {
        templateNestedTable = table.parents().find(".templatesDict").children('.table-row-row-view');
    }
    var dummyindex = 0;
   
    table.children('.table-edit-row').each(function () {
       
        var rowrow = $(this);
     
        var was = false;
       


        for (var fN in filterName) {
            console.log(rowrow.find("input[additionalAttr='DictId'][value='" + filterDictId[fN] + "']"));
            if (rowrow.find("input[additionalAttr='DictId'][value='" + filterDictId[fN] + "']").length > 0) {
                console.log("WAS");
                was = true;
                break;;
            }
        }

        if (was === false) {           
            rowrow.remove();
        }
    });
   
    if (strfilterName !== "") {
        for (var fN in filterName) {

            if (table.children('.table-edit-row').find("input[additionalAttr='DictId'][value='" + filterDictId[fN] + "']").length > 0) {
                dummyindex++;
                continue;
            }
            var newRow = templateRow.clone(false);

            var keys = table.children('.table-edit-row').map(function () {
                return $(this).attr('data-rowkey');
            });


            var currentMaxkey;
            if (keys.length > 0) {
                currentMaxkey = Math.max.apply(Math, jQuery.map(keys, function (e) {
                    return e;
                }));
            } else {
                currentMaxkey = 0;
            }


            // data-field-name используется в контроле адресной книги


            newRow.attr('data-rowkey', currentMaxkey + 1);

            var tableName = table.parent().attr('data-name');
            var newRowKey = currentMaxkey + 1;


            newRow.find(".show-dict-btn").each(function () {
                if ($(this).attr('parent-id')) {
                    $(this).attr('parent-id', tableName + "-" + $(this).attr('parent-id') + "-" + newRowKey);
                }
            });


            newRow.find("[data-dg-group]").each(function () {
                $(this).attr('data-dg-group', tableName + "-" + newRowKey + "-" + $(this).attr('data-dg-group'));
            });

            table.append(newRow);

            // если есть шаблон для вложенной таблицы, рендерим его внутри контейнера вложенной таблицы как шаблон для новой строки


            newRow.find(".form-dictionary-control").each(function () {
                var item = $(this);
                if (item.attr("data-dictionaryparent") == "")
                    setDictionaryField(item);
            });

            setEditTableRowVisibility('.table-edit-wrapper-deputy', table.closest('.table-edit-wrapper-deputy').parent());

            var datalistName = newRow.find('[data-wslist]').attr('data-wslist');
            newRow.find('[data-wslist]').attr('list', datalistName);
            reinitialiseScriptShort();

            var paramsObj = {
                rowKey: newRowKey,
                innerTableContainer: newRow
            };
         
            newRow.find("[name='Field']").val(filterName[fN]);
            newRow.find("[name='NameForUser']").val(filterNameForUser[fN]);
            newRow.find("[name='Flow']").val(filterFlow[fN]);
           
            var id = newRow.find("[name='Id']");
          
            id.val(0);

            var dictId = newRow.find("[name='DictId']");
         
            dictId.val(filterDictId[fN]);
          
            $(table).trigger("onTableRowAdded", paramsObj);
            dummyindex++;
            window.adjustNewRowTextAreaHeight(newRow);
        }
    }
    var dummyindex = 0;
    table.children('.table-edit-row').each(function () {
        var row = $(this);
        var field = row.find("[additionalName='Field']");       
        field.removeAttr('name');        
        field.attr('name', '[' + indexcurrent + "].DummyFilters[" + dummyindex + "].Field");
        field.attr('additionalName', "DummyFilters[" + dummyindex + "].Field");  
        var fieldForUser = row.find("[additionalName='NameForUser']");
        fieldForUser.removeAttr('name');
        fieldForUser.attr('name', '[' + indexcurrent + "].DummyFilters[" + dummyindex + "].NameForUser");
        fieldForUser.attr('additionalName', "DummyFilters[" + dummyindex + "].NameForUser"); 
        var Flow = row.find("[additionalName='Flow']");
        Flow.attr('name', '[' + indexcurrent + "].DummyFilters[" + dummyindex + "].Flow");
        Flow.attr('additionalName', "DummyFilters[" + dummyindex + "].Flow");
        var Value = row.find("[additionalName='Value']");
        Value.attr('name', '[' + indexcurrent + "].DummyFilters[" + dummyindex + "].Value");
        Value.attr('additionalName', "DummyFilters[" + dummyindex + "].Value");
        var id = row.find("[additionalName='Id']");
        id.attr('name', '[' + indexcurrent + "].DummyFilters[" + dummyindex + "].Id");
        id.attr('additionalName', "DummyFilters[" + dummyindex + "].Value");       

        var dictId = row.find("[additionalName='DictId']");

        dictId.attr('name', '[' + indexcurrent + "].DummyFilters[" + dummyindex + "].DictId");
        dictId.attr('additionalName', "DummyFilters[" + dummyindex + "].Value");
        dummyindex++;
    });

    
}
 