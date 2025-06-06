/*

смотри hierar-dictionary-multi.js

var HierarDictionary = function (buttonElement, json, config) {
    var deferred = $.Deferred();

    var store;
    var treePanel;
    var itemForm;
    var searchInExternalSystemForm;
    var win;
    var dataUrl;
    var dataFields;
    var dataTemplate;
    var $dictButton = $(buttonElement);
    var formSelected;
    var currentSelected;
    var sortable;
    var buttons;
    var pickElem;

    var pageSize; // Размер страницы при постраничной загрузке
    //var COLUMN_NAME_INDEX = 0;
    //var FIELD_NAME_INDEX = 1;


    var model;
    var treeWidth = 779;
    var panelWidth = 800;
    var panelHeight = 700;
    var modelColumns;
    var selectedNodes = [];
    var filterInput;

    //выбранные строки
    var selectedRowsDebug = [];

    var multipleSelection = false;
    var uniqId;
    var rootIds;
    var dictBuilder;

    var isSearchPanelLoaded = false;
    var isButtonExternalSystemClick = false;

    // [{ property: 'Код КПГЗ',   value: '3204978'}]
    var permanentFilters = [];

    var childrenSelection = false;

    var gridExtJsBuilder = {
        reader: {
            type: 'json',
            root: 'children',
            totalProperty: 'virtualizeCount'
        },
        createStore: function (proxy, pageSize) {
            return Ext.create('Ext.data.Store',
                {
                    model: 'Dictionary',
                    proxy: proxy,
                    remoteFilter: true,
                    pageSize: (pageSize || 200),
                    buffered: true,
                    leadingBufferZone: (pageSize || 200),
                    autoLoad: true,
                    remoteGroup: true,
                    listeners: {
                        load: function (store, records, success, operation) {
                            //При подгрузке очередной порции - проверять, если есть выбранные элементы - выделять их
                            var isFind = false;
                            if (success && selectedRowsDebug.length > 0) {
                                selectedRowsDebug.forEach(function(selRow) {
                                    records.forEach(function (rec) {
                                        if (rec.get(model.CodeKey) === selRow.get(model.CodeKey)) {
                                            isFind = true;
                                            var indexToReplace = selectedRowsDebug.indexOf(selRow);
                                            if (indexToReplace > -1) selectedRowsDebug[indexToReplace] = rec;
                                            rec.set('checked', true);
                                            rec.modified = {};
                                            treePanel.view.refreshNode(rec);
                                            treePanel.view.focusRow(rec);
                                        }
                                    });
                                });
                                //Если не находит в выборке ранее отмеченного контрагента, то Добавляет его первым в список.
                                if (!isFind) {
                                    if (typeof selectedRowsDebug[0] != "undefined") {
                                        if (typeof (selectedRowsDebug[0].data) != "undefined") {
                                            store.data.map[1].value[0].data = selectedRowsDebug[0].data;
                                        } else {
                                            store.data.map[1].value[0].data = selectedRowsDebug[0];
                                        }
                                    }
                                    selectedRowsDebug.forEach(function (selRow) {
                                        records.forEach(function (rec) {
                                            if (rec.get(model.CodeKey) === selRow.get(model.CodeKey)) {
                                                var indexToReplace = selectedRowsDebug.indexOf(selRow);
                                                if (indexToReplace > -1) selectedRowsDebug[indexToReplace] = rec;
                                                rec.set('checked', true);
                                                rec.modified = {};
                                                treePanel.view.refreshNode(rec);
                                                treePanel.view.focusRow(rec);
                                            }
                                        });
                                    });
                                }
                            }

                            }
                    }
                });
        },
        panelType: 'Ext.grid.Panel',
        columnXtype: 'gridcolumn',
        //Обработчик диалоговой кнопки "Выбрать"
        chooseButtonHandler: function() {
            var grid = this.up('grid');
            gridItemSelectedHandler(grid);
        }
    };

    var treeExtJsBuilder = {
        reader: 'json',
        createStore: function(proxy) {
            return Ext.create('Ext.data.TreeStore',
                {
                    model: 'Dictionary',
                    proxy: proxy,
                    remoteFilter: true
                });
        },
        panelType: 'Ext.tree.Panel',
        columnXtype: 'treecolumn',
        //Обработчик диалоговой кнопки "Выбрать"
        chooseButtonHandler: function() {
            var tree = this.up('treepanel');
            itemSelectedHandler(tree);
        }
    };

    function generateStore() {
        Ext.define('LiteClient.Proxy',{
            extend: 'Ext.data.proxy.Ajax',

            getExtraParams: function() {
                var params = parseParamString(dataFields);
                params.selectedNodes = selectedNodes;
                if (rootIds) params.rootId = rootIds;
                return params;
            },

            processResponse: function (success, operation, request, response, callback, scope) {
                if (filterInput) filterInput.prop('disabled', false);

                if (response.aborted) {
                    return;
                }
                response.responseText =
                    JSON.stringify(handleDictionary(filterDictionaryItemsIfNeeded(JSON.parse(JSON.parse(response.responseText).data))));
                this.superclass.superclass[arguments.callee.$name].apply(this,
                    [success, operation, request, response]);
            },
        });

        var proxy = Ext.create('LiteClient.Proxy',
            {
                reader: dictBuilder.reader,
                url: encodeURI(dataUrl),
                timeout: 60000,
                paramOrder: 'parentId',
                filterParam: 'filterParams',
                actionMethods: {
                    read: 'POST'
                }
            }
        );

        store = dictBuilder.createStore(proxy, pageSize);
    }

    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 5; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    function init() {
        sortable = true;
        localize();

        Ext.define('OverrideHeaderResizer',
            {
                override: 'Ext.grid.plugin.HeaderResizer',
                maxColWidth: 9999
            });

        uniqId = makeid();
        disableDictButton();
        Ext.getBody().mask("Загрузка словаря...");

        dataUrl = $dictButton.attr("data-url");
        dataFields = $dictButton.attr("data-fields");
        dataTemplate = $dictButton.attr("data-edit-template");
        rootIds = $dictButton.attr("data-root-ids");

        var virtGridAttr = $dictButton.attr("data-is-virtual-grid");
        if (virtGridAttr && virtGridAttr.toUpperCase() === 'TRUE') {
            sortable = true;
            dictBuilder = gridExtJsBuilder;
            pageSize = $dictButton.attr("data-vg-page-size") ? parseInt($dictButton.attr("data-vg-page-size")) : 200;
        } else {
            dictBuilder = treeExtJsBuilder;
        }

        var filterString = $dictButton.attr("data-permanent-filters");
        if (filterString) {
            var filterObj = JSON.parse(filterString);

            for (var j = 0; j < filterObj.length; j++) {
                var currentFilterObj = filterObj[j];
                var filter = permanentFilters.filter(function(obj) { return obj.property == currentFilterObj.property })[0];
                if (filter != undefined) {
                    filter.value.push(currentFilterObj.value);
                } else {
                    permanentFilters.push({ property: currentFilterObj.property, value: [currentFilterObj.value] });
                };
            }
        }

        var multipleSelectionAttr = $dictButton.attr("data-multiple");
        if (multipleSelectionAttr) {
            multipleSelection = true;
        }

        var childrenSelectionAttr = $dictButton.data('childrenselection');
        if (multipleSelection && childrenSelectionAttr) {
            childrenSelection = true;
        }

        if (!(dataUrl === undefined)) {
            var $table = $dictButton.closest(".table-edit");
            var isTable = $table.length > 0;
            var form = $dictButton.closest("form");

            var selector = '[name="' + $dictButton.attr("id") + '"]';
            var findElem = '[name="' + $dictButton.attr("id") + 'Name"]';
            if (isTable) {
                var tableName = $table.attr('data-name');
                var tableRowIndex = $dictButton.closest(".table-edit-row").attr('data-rowkey');
                selector = '[name="' + tableName + "-" + $dictButton.attr("id") + "-" + tableRowIndex + '"]';
            }

            if (config && config.selectedNodes) {
                selectedNodes = config.selectedNodes;
            } else {
                //инициализация ранее выбранного значения присутствующего на форме
                if (multipleSelection === false) {
                    var initValue = $(form).find(selector).val();
                    selectedNodes.push(initValue);
                pickElem = $(form).find(findElem).val();
                } else {
                    var dictElementsList = $dictButton.closest("div").find("ul li input");
                    var initValues = dictElementsList.filter(function(num, element) {
                        var name = $(element).attr("name").split("-")[1];
                        return $(element).val() !== "" && name === $dictButton.attr("id");
                    });

                    $(initValues)
                        .each(function(index, element) {
                            selectedNodes.push($(element).val());
                        });
                }
            }

            var parentElementName = $dictButton.attr("parent-id");
            if (parentElementName !== undefined && parentElementName != null) {

                var parentElement = getParentElement(parentElementName);

                var idToFilter = parentElement ? parentElement.val() : undefined;
                if (!(idToFilter === undefined)) {
                    dataUrl += "&parentId=" + idToFilter;
                }

                //n.volosatov - очищение выбранного значения, если выбранное значение в парент словарике поменялось
                if (parentElement && parentElement.length > 0) {
                    parentElement.on("change",
                        function(clearNotRequired) {
                            // Костыль для обхода очистки текущего значения, если изменилось выбранное значение из родительского словаря.
                            // Нужно, если заполняем данными из родительского словаря на основе данных из дочернего.
                            if (clearNotRequired) {
                                return;
                            }

                            var $table = $dictButton.closest(".table-edit");
                            var isTable = $table.length > 0;
                            var tableName = $table.attr('data-name');
                            var tableRowIndex = $dictButton.closest(".table-edit-row").attr('data-rowkey');
                            var dictButtonId = $dictButton.attr("id");
                            clearDictionaryField(dictButtonId, isTable, tableName, tableRowIndex);
                        });
                }
                //n.volosatov - end


                // дополнительно передаем названия подчиненных словарей
                var subdictionaries = getSubDictionaries($dictButton);
                dataUrl += "&subDictionaries=" + subdictionaries + ""; // what a magic?
            }
            // если мы редактируем документ, то передаем дополнительно ид документа.
            var documentKey = $("input[name='uniqueIds']").val();
            var objectType = $("input[name='objectType']").val();
            if (documentKey !== undefined && (objectType === undefined || objectType === "document"))
                dataUrl += "&documentKey=" + documentKey;

            var level = $dictButton.attr("dictionary-selection-start-level");
            if (level !== undefined && level !== null)
                dataUrl += "&selectionStartLevel=" + level;

            var output = {};
            // собираем данные полей формы, если требуется
            var vals = $dictButton.attr("data-form-values");
            if (vals !== undefined && vals !== null) {

                var editNames = vals.split(",");
                var row = $dictButton.closest('.table-edit-row');

                for (i in editNames) {
                    var val = $("[name='" + editNames[i] + "']").map(function(index, elem) {
                        var element = $(elem);
                        var value = element.val();
                        return value;
                    }).filter(function(index, elem) {
                        return elem !== "";
                    }).toArray().join();

                    // если такое поле впрямую не найдено, попробуем рассмотреть как поиск в текущей строке таблицы
                    if (!val && row.length > 0) {
                        var fnd = row.find('input')
                            .filter(function(index) {
                                var name = $(this).attr("name");
                                var expr = new RegExp(".+-" + editNames[i] + "-\\d+");
                                return expr.test(name);
                            });
                        if (fnd.length > 0)
                            val = fnd.val();
                    }
                    output[editNames[i]] = val;
                }
            }
            //для псевдосправочников подтаблиц (передается значение ключа родительской таблицы)
            var table = $dictButton.closest('.table-edit > .table-content');
            if (table.length > 0) {
                var parentRow = table.closest('.table-edit-row');
                if (parentRow.length > 0) {

                    var parentRowKey = parentRow.attr('data-rowKey');
                    var parentTableEditName = $dictButton.attr("parent-table-edit-name");
                    var parentTableKeyAttr = $dictButton.attr("parent-table-key-attr");

                    var inputName = "input[name='" +
                        parentTableEditName +
                        '-' +
                        parentTableKeyAttr +
                        '-' +
                        parentRowKey +
                        "']";
                    var input = parentRow.find(inputName);
                    output.Code = input.val();
                }
            }

            if (!isEmpty(output))
                dataUrl += "&formValues=" + JSON.stringify(output);

            if (json != null) {
                loadDictionaryDataFromJSON(afterInitialDataLoadHandler);
            } else {
                beforeLoadDictionaryData(selectedNodes, afterInitialDataLoadHandler);
            }

        }
    }

    function parseParamString(encodedParams) {
        return encodedParams.split('&').reduce(function(s, c) {
            var t = c.split('=');
            s[t[0]] = t[1];
            return s;
        },
            {});
    }


    //проверяет объект на пустоту
    function isEmpty(obj) {
        for (var prop in obj) {
            if (obj.hasOwnProperty(prop))
                return false;
        }

        return JSON.stringify(obj) === JSON.stringify({});
    }

    // этот код заставляет искать родительские элементы из дочерних таблиц выше по уровням
    function getParentElement(parentElementName) {
        var parentId = parentElementName + "parent";
        var parentElement = $("[data-parent-name='" + parentId + "']");

        while (!parentElement.length) {
            var parts = parentElementName.split('-');
            var partsLength = parts.length;
            if (partsLength <= 3) {
                if (partsLength <= 1)
                    return null;
                parentId = parts[1] + "parent";
                parentElement = $("[data-parent-name='" + parentId + "']");
                break;
            } else {
                var partsToJoin = parts.slice(0, partsLength - 4);
                var joinedParts = partsToJoin.join('-');
                parentElementName = joinedParts + '-' + parts[partsLength - 2] + '-' + parts[partsLength - 4];
                parentId = parentElementName + "parent";
                parentElement = $("[data-parent-name='" + parentId + "']");
            }
        }

        return parentElement;
    }

    // этот код заставляет искать родительские элементы из дочерних таблиц выше по уровням
    function getParentElement2(parentId) {
        var parentElement = $("input[name='" + parentId + "'], textarea[name='" + parentId + "']");

        while (!parentElement.length) {
            var parts = parentId.split('-');
            var partsLength = parts.length;
            if (partsLength <= 3) {
                if (partsLength <= 1)
                    return null;
                parentId = parts[1];
                parentElement = $("input[name='" + parentId + "'], textarea[name='" + parentId + "']");
                break;
            } else {
                var partsToJoin = parts.slice(0, partsLength - 4);
                var joinedParts = partsToJoin.join('-');
                parentId = joinedParts + '-' + parts[partsLength - 2] + '-' + parts[partsLength - 4];
                parentElement = $("input[name='" + parentId + "'], textarea[name='" + parentId + "']");
            }
        }

        return parentElement;
    }

    function getSubDictionaries(button) {

        var result = [];

        while (button != undefined) {
            var subDictionary = button.attr("data-subdictionary-name");
            result.push(subDictionary == undefined ? "" : subDictionary);
            button = getParentDictionaryButton(button);
        }

        result.pop(); // для  при выборе из первого уровня у нас всегда 1 подчиненный словарь, и который не надо учитывать

        return result; // возвращаем  названия от подчиненного к родительскому
    }

    function getParentDictionaryButton(button) {
        var parentElementId = button.attr("parent-id");
        if (parentElementId == undefined)
            return undefined;
        var parentInputElement = getParentElement2(parentElementId);
        if (!parentInputElement)
            return undefined;

        var parentButton = parentInputElement.parent().find("button")[0];
        return $(parentButton);
    }

    function disableDictButton() {
        $dictButton.prop("disabled", true);
    }

    function enableDictButton() {
        $dictButton.prop("disabled", false);
    }

    function saveFormData() {
        var tree = treePanel;
        var form = itemForm;
        var formElm = $(".dictionary-item-form").first();
        var formValidator = formElm.parsley();
        formValidator.whenValidate()
            .done(function() {
                ajaxFormSubmit($(".dictionary-item-form")[0],
                    function(data) {
                        var obj = JSON.parse(data);
                        Ext.getCmp('DictWind' + uniqId).unmask();
                        var node = tree.store.getRootNode();
                        var currentNode = tree.store.getNodeById(obj.id);
                        var needScroll = false;
                        if (currentNode == undefined) {
                            node.appendChild(obj);
                            currentNode = tree.store.getNodeById(obj.id);
                            needScroll = true;
                        } else {
                            for (var i in obj) {
                                if (currentNode.data.hasOwnProperty(i)) {
                                    currentNode.set(i, obj[i]); //works
                                }
                            }
                        }
                        if (currentNode != null) {
                            node.cascadeBy(function(child) {
                                var cheked = child.get('checked');
                                if (cheked) {
                                    child.set('checked', false);
                                }
                            });
                            currentNode.set('checked', true);
                        }
                        itemForm.setHidden(true);
                        treePanel.setVisible(true);
                        //$(form.ariaEl.dom.previousSibling).show();
                        if (needScroll) {
                            var treeView = tree.body.dom.firstElementChild;
                            treeView.scrollTop = treeView.scrollHeight - treeView.clientHeight;
                        }

                    },
                    function(data) {
                        Ext.getCmp('DictWind' + uniqId).unmask();
                        showAlert('Произошла ошибка', data.responseText);
                    },
                    function() {
                        Ext.getCmp('DictWind' + uniqId).mask('Сохранение...');
                    }
                );
            });
    }

    //Перед загрузкой данных словаря необходимо получить по коду выбранных ранее полей в словаре
    function beforeLoadDictionaryData(codes, onSuccess) {
        if (filterInput) filterInput.prop('disabled', true);

        //Если виртуальный грид - делаем загрузку выбранных ранее элементов по кодам
        var anyNonEmptyCode = codes.some(function(code) {
            if (code) return true;
            return false;
        });
        if (dictBuilder === gridExtJsBuilder && anyNonEmptyCode) {

            var encodedUrl = encodeURI(dataUrl);
            //вынужден получать один элемент потому что какая-то странная логика отчистки кеша зависит от этого
            var encodedFields = encodeURI(dataFields + '&code=' + codes.join(','));

            $.ajax(
                {
                    type: "POST",
                    dataType: "json",
                    url: encodedUrl,
                    data: encodedFields
                })
                .done(function(response) {
                    if (response.error || (response.status && response.status.toLowerCase() === 'error')) {
                        showAlert('Произошла ошибка', response.error || response.responseMessage);
                        enableDictButton();
                        Ext.getBody().unmask();
                        return;
                    }
                    var result = JSON.parse(response.data);
                    selectedRowsDebug = result.children;
                    selectedRowsDebug.forEach(function (record) {

                        record.raw = record;
                        record.get = function(field) {
                            return record[field];
                        };
                    });

                    loadDictionaryData(onSuccess);
                });
        } else {
            loadDictionaryData(onSuccess);
        }
    }

    function loadDictionaryData(onSuccess) {
        var encodedUrl = encodeURI(dataUrl);
        //вынужден получать один элемент потому что какая-то странная логика отчистки кеша зависит от этого
        var encodedFields = encodeURI(dataFields + '&start=0&limit=1');

        // console.log(encodedFields);
        $.ajax(
            {
                type: "POST",
                dataType: "json",
                url: encodedUrl,
                data: encodedFields
            })
            .done(function(response) {
                if (response.error || (response.status && response.status.toLowerCase() === 'error')) {
                    showAlert('Произошла ошибка', response.error || response.responseMessage);
                    enableDictButton();
                    Ext.getBody().unmask();
                    return;
                }

                var result = JSON.parse(response.data);

                if (result.children == null || result.children.length === 0) {
                    showAlert('Данный словарь пуст', "Данный словарь не содержит ни одного значения");
                    enableDictButton();
                    Ext.getBody().unmask();
                    return;
                }

                model = removeUnnecessaryColumns(result);
                Ext.getBody().unmask();
                onSuccess();
            })
            .fail(function() {
                showAlert("Ошибка", "Произошла непредвиденная ошибка");
                enableDictButton();
                Ext.getBody().unmask();
            });
    }

    function loadDictionaryDataFromJSON(onSuccess) {
        if (json.data.children == null || json.data.children.length === 0) {
            showAlert('Данный словарь пуст', "Данный словарь не содержит ни одного значения");
            enableDictButton();
            Ext.getBody().unmask();
            return;
        }

        model = removeUnnecessaryColumns(json.data);
        Ext.getBody().unmask();
        onSuccess();
    }

    function removeUnnecessaryColumns(data) {
        var columnsInfo = data.fieldsInfo.DictionaryFieldInfoList;
        var filteredColumns = columnsInfo
            .filter(function(element) {
                return element != null && element.DictColumnName !== "code" && element.ShowAsDictionaryColumn === true;
            });

        modelColumns = filteredColumns;
        return data;
    }

    function getDictionaryName(responseFromServer) {
        var dictionaryName = null,
            fieldLength = responseFromServer.fieldsInfo.DictionaryFieldInfoList.length;
        if (fieldLength === 1) {
            dictionaryName = responseFromServer.fieldsInfo.DictionaryFieldInfoList[0].EditName;
        } else {
            for (var i = 0; i < fieldLength; i++) {
                var current = responseFromServer.fieldsInfo.DictionaryFieldInfoList[i];
                if (current.DictColumnName === responseFromServer.CodeKey) {
                    dictionaryName = current.EditName;
                    break;
                }
            }
        }
        return dictionaryName;
    }

    function filterPredicate(currentItem, allowedImtesHiddenInputValue, codeKey) {
        var compareValue =
            allowedImtesHiddenInputValue.codes.indexOf(currentItem[allowedImtesHiddenInputValue.columnName || codeKey]);
        return (compareValue !== -1 && allowedImtesHiddenInputValue.isShow) ||
            (compareValue === -1 && !allowedImtesHiddenInputValue.isShow);
    }

    function filterRecursive(originalItems, childrenKey, codeKey, allowedImtesHiddenInputValue, level) {
        if (!originalItems) return null;
        var filteredObject = {};
        if (level === 0 || filterPredicate(originalItems, allowedImtesHiddenInputValue, codeKey)) {
            filteredObject = originalItems;
            if (originalItems[childrenKey] != null) {
                var children = [];
                for (var j = 0; j < originalItems[childrenKey].length; j++) {
                    var currentChild = originalItems[childrenKey][j];
                    var filteredChild = filterRecursive(currentChild,
                        childrenKey,
                        codeKey,
                        allowedImtesHiddenInputValue,
                        level + 1);
                    if (filteredChild != null) children.push(filteredChild);
                }
                filteredObject[childrenKey] = children;
            }
            return filteredObject;
        }
        return null;
    }


    //фильтрует элементы словаря согласно полученным настройкам из скрытого инпута,
    //позволяет показать или скрыть определенные элемента словаря по коду из яваскрипта на карте документа 

    function filterDictionaryItemsIfNeeded(responseFromServer) {
        var dictionaryName = getDictionaryName(responseFromServer);
        var result = null;
        if (dictionaryName) {
            var allowedImtesHiddenInput = $("#" + dictionaryName + "_allowed_items");
            if (allowedImtesHiddenInput.length === 1) {
                var allowedImtesHiddenInputValue = JSON.parse(allowedImtesHiddenInput.val());
                result = filterRecursive(responseFromServer,
                    responseFromServer.ChildrenKey,
                    responseFromServer.CodeKey,
                    allowedImtesHiddenInputValue,
                    0);
            }
        }

        // a.medvedev - компонент чувствителен к значению virtualizeCount. В случае, если количество полученных записей (или отфильтрованных)
        // меньше virtualizeCount, grid падает в вечную загрузку
        if (responseFromServer.virtualizeCount > responseFromServer.children.length)
            responseFromServer.virtualizeCount = responseFromServer.children.length;

        return result !== null ? result : responseFromServer;
    }

    function showAlert(header, message) {
        Ext.Msg.alert(header, message);
    }

    function afterInitialDataLoadHandler() {
        configureAsyncTree();
        showModalWindow();
    }

    function handleDictionary(dict) {
        if (dict && dict.children && config && config.disabledNodes && config.disabledNodes.length) {
            dict.children.forEach(function (item) {
                if (~config.disabledNodes.indexOf(item[model.CodeKey])) {
                    item.enabled = false;
                }
            });
        }
        return dict;
    }

    function configureAsyncTree() {
        var treeModel = generateTreeModel();
        Ext.define('Dictionary', treeModel);

        if (json == undefined) {
            generateStore();
        } else {
            store = Ext.create(dictBuilder.storeType,
                {
                    model: 'Dictionary',
                    data: json.data.children,
                    root: {
                    },
                    proxy: {
                        type: 'memory',
                        reader: {
                            type: 'json'
                        }
                    }
                });
        }


        addPermanentFilters(store);

        //метод проверки переданного значения на предмет присутствия в словаре и выбора этого значения в дереве
        function expandParent(node) {
            if (node !== null &&
                node.parentNode !== undefined &&
                node.id !== "root") {
                node.expand();
                expandParent(node.parentNode);
            }
        }

        var loadnode = function(self, nodes, eOpts) {
            //console.log("load node event");


            var rootNode = store.getRootNode();

            rootNode.cascadeBy(function(child) {

                //n.volosatov - ставим выключеным нодам 'checked' to null
                if (!child.get("enabled")) {
                    child.set("checked", null);
                }
                if (selectedNodes.indexOf(child.data.code) > -1) {
                    child.set('checked', true);

                    var ownerTree = child.getOwnerTree();
                    if (!ownerTree.wasFocusedOnce)
                        setTimeout(function() { child.getOwnerTree().getView().focusRow(child); }, 0);
                    ownerTree.wasFocusedOnce = true;

                    formSelected = child;
                    currentSelected = child;
                    expandParent(child);
                } else {
                    //если есть нод, который уже содержит детей - делаем expand (например в результатах поиска)
                    if (child.data.children && child.data.children.length > 0) expandParent(child);
                }
            });

            throwOpenDialogEvent(nodes);
        }

        //buttons
        buttons = [
            {
                text: 'Выбрать',
                cls: 'dialogChooseBtn',
                handler: dictBuilder.chooseButtonHandler
            },
            {
                text: 'Отмена',
                cls: 'dialogCancelBtn',
                handler: function() {
                    //Нет необходимости очищать фильтр при закрытии окна словаря, так как для него выбрано значение destroy
                    //store.clearFilter();
                    //Ext.getCmp('dictionarySearchField').setValue("");
                    closeWin();
                }
            }
        ];

        if (dataTemplate != undefined) {
            buttons.unshift({
                text: 'Добавить',
                cls: 'dialogAddBtn',
                align: 'left',
                handler: function() {
                    var tree = this.up('treepanel');
                    formDictionaryHandler(tree);
                }
            });
        }

        treePanel = Ext.define('Ext.filteredTree',
            {
                id: 'treePanel' + uniqId,
                extend: dictBuilder.panelType,
                store: store,
                autoWidth: true,
                autoHeight: false,
                //width: treeWidth,
                height: 555,
                rootVisible: false,
                hideHeaders: false,
                useArrows: true,
                //selType: 'checkboxmodel',
                //selModel: {
                //    injectCheckbox: 0,
                //    pruneRemoved: false
                //}, //Модель для выбора с чекбоксами
                disableSelection: true, //выключает стандартную модель выбора
                listeners: {
                    load: loadnode,
                    checkchange: itemCheckHandler,
                },
                buttons: buttons,
                initComponent: function() {
                    initTreePanel(this);
                },

                filterStore: filterStoreHandler,

                strMarkRedPlus: function (search, subject) {
                    return subject.replace(
                        new RegExp('(' + search + ')', "gi"),
                        "<span style='color: red;'><b>$1</b></span>");
                }
            });
    }


    var itemCheckHandler = function (node, checked) {
        if (node) {
            if (childrenSelection) {
                node.cascadeBy(function(child) {
                    child.set("checked", checked);
                    itemCheckInternal(child);
                });
            } else {
                itemCheckInternal(node, checked);
            }
        }
    }

    function itemCheckInternal(node) {
        var store = node.getTreeStore();
        var rootNode = store.getRootNode();
        if (multipleSelection == false) {
            selectedNodes = [];
            rootNode.cascadeBy(function(child) {
                //n.volosatov - не даем поставить false рутовому и выключенным нодам
                if (child.id !== node.id && child.get("enabled")) {
                    child.set('checked', false);
                } else if (child.isRoot()) {
                    child.set('checked', null);
                }
            });
        } else {
            if (selectedNodes && selectedNodes.indexOf(node.get("code")) > -1) {
                node.set('checked', false);
                var nodeIndex = selectedNodes.indexOf(node.get("code"));
                selectedNodes.splice(nodeIndex, 1);
            } else {
                if (!node.get("enabled")) {
                    var nodeId = node.get("code");
                    var messages = model.disabledTextDictionary;

                    var message = getSelectionDisabledMessage(messages, nodeId);
                    showAlert("Невозможно выбрать элемент",
                        message == null ? "Элемент недоступен для выбора" : message);
                }

                var nodeCode = node.get("code");
                node.set('checked', true);
                selectedNodes.push(nodeCode);
            }
        }
    }

    function formDictionaryHandler(tree) {
        tree.setHidden(true);
        var dataUrl = $dictButton.attr("data-edit-url");
        OpenDictionaryForm(dataUrl);
    }

    function OpenDictionaryForm(url) {
        itemForm.body.load({
            url: url,
            scripts: true,
            callback:
                function(data) {
                    itemForm.setVisible(true);
                    enableToolTips();
                    updateDatepickers();
                    fillDictDisplayValues();
                    bindDictionaryDisplayField();
                    addParsleyValidation(".dictionary-item-form");
                }
        });
    }

    function onSearchInExternalSystemClick() {
        var url = getAbsoluteUrl('/Dictionary/GetDictionaryForm?template=SupSearchForm.xml');
        if (!isSearchPanelLoaded) {
            searchInExternalSystemForm.body.load({
                url: url,
                scripts: true,
                callback:
                    function(data) {
                        enableToolTips();
                        updateDatepickers();
                        fillDictDisplayValues();
                        bindDictionaryDisplayField();
                        addParsleyValidation(".dictionary-item-form");

                        searchInExternalSystemForm.setHidden(false);
                        isSearchPanelLoaded = true;
                        searchInExternalSystemForm.setHeight(searchInExternalSystemForm.height + 100);
                    }
            });
        } else {
            searchInExternalSystemForm.setVisible(true);
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

        if (selectedRowsDebug.length !== 0 && !(selectedRowsDebug[0].id === 'root' && selectedRowsDebug.length === 1)) {
            throwSelectEvent(dictButtonId, selectedRowsDebug);
            fillSelected(selectedRowsDebug);
        } else {
            if (multipleSelection) {
                clearMultipleDictionaryFields(dictButtonId);
            } else {
                clearDictionaryField(dictButtonId, isTable, tableName, tableRowIndex);
            }

            // очищение поля со списком значений, к которому обращаются зависимые словарные поля
            $(getColumnFieldParentSelector(dictButtonId, isTable, tableName, tableRowIndex))
                .val('')
                .change();
        }

        if (typeof ExtContractorManager !== 'undefined') {
            if (selectedRowsDebug.length === 1) {
                var selectedRow = selectedRowsDebug[0];
                if (selectedRow.data.hasOwnProperty("source")) {
                    var selectedItemCode = selectedRow.get(model.CodeKey);
                    if (selectedItemCode) {
                        var manager = ExtContractorManager(store, treePanel, win);
                        manager.saveChoosenContractor(selectedItemCode, selectedRowsDebug[0], dictButtonId, fillSelected);
                    }
                }
            }
        }

        closeWin();

        deferred.resolve(selectedRowsDebug);
    }

    function itemSelectedHandler(tree) {
        var store = tree.getStore();
        var rootNode = store.getRootNode();
        var selectedNodes = [];
        var dictButtonId = $dictButton.attr("id");
        var $table = $dictButton.closest(".table-edit");
        var isTable = $table.length > 0;
        var tableName = $table.attr('data-name');
        var tableRowIndex = $dictButton.closest(".table-edit-row").attr('data-rowkey');

        rootNode.cascadeBy(function(child) {
            var cheked = child.get('checked');
            if (cheked) {
                selectedNodes.push(child);
            }
        });


        if (selectedNodes.length !== 0 && !(selectedNodes[0].id === 'root' && selectedNodes.length === 1)) {
            throwSelectEvent(dictButtonId, selectedNodes);
            $(selectedNodes).each(function(index, node) {
                if (!node.get("enabled")) {
                    var nodeId = node.get("id");
                    var messages = model.disabledTextDictionary;

                    var message = getSelectionDisabledMessage(messages, nodeId);
                    showAlert("Невозможно выбрать элемент с id",
                        message == null ? "Элемент недоступен для выбора" : message);

                    return;
                }

            });

            if (multipleSelection) {
                fillMultipleDictFields(selectedNodes, dictButtonId, isTable, tableName, tableRowIndex);
            } else {
                fillSelectionFields(selectedNodes[0], dictButtonId, isTable, tableName, tableRowIndex);
            }
        } else {
            if (multipleSelection) {
                clearMultipleDictionaryFields(dictButtonId);
            } else {
                clearDictionaryField(dictButtonId, isTable, tableName, tableRowIndex);
            }

            // очищение поля со списком значений, к которому обращаются зависимые словарные поля
            $(getColumnFieldParentSelector(dictButtonId, isTable, tableName, tableRowIndex))
                .val('')
                .change();
        }

        closeWin();

        deferred.resolve(selectedNodes);
    }

    //n.volosatov - создает событие клика на кнопку выбор
    function throwSelectEvent(dictButtonId, selectedItems) {

        var eventData = {
            dicName: $dictButton.attr("data-dict-name"),
            items: selectedItems.slice()
        };

        $dictButton.trigger("DicItemSelected", eventData);
    }

    //n.volosatov - создает событие открытия диалога словаря, с возможностью изменить элементы словаря
    function throwOpenDialogEvent(items) {
        var eventData = {
            dictButton: $dictButton,
            items: items
        };

        $dictButton.trigger("DicDialogOpened", eventData);
    }

    function closeWin() {
        win.close();

        if ($dictButton.parents(".modal").length > 0) {
            $("body").addClass("modal-open");
        } else {
            $("body").removeClass("modal-open");
        }
    }

    function clearDictionaryField(dictButtonId, isTable, tableName, tableRowIndex) {
        if (!model || !model.fieldsInfo || !model.fieldsInfo.DictionaryFieldInfoList) return;
        $.each(model.fieldsInfo.DictionaryFieldInfoList,
            function(index, element) {
                var columnFieldName = element.EditName;
                var columnDictName = element.DictColumnName;

                var columnField = $(getColumnFieldSelector(columnFieldName, isTable, tableName, tableRowIndex));
                if (columnField != null) {
                    if (columnField.is(":checkbox") && formSelected !== undefined) {
                        if (formSelected.get(columnDictName) === "1")
                            columnField.prop("checked", columnField.prop("checked") === true ? false : true).change();
                    } else {
                        columnField
                            .val("")
                            .change();
                    }
                }
            });
    }

    function clearMultipleDictionaryFields(dictButtonId) {
        var dictControl = $("#" + dictButtonId).closest(".dict-modal-control");
        dictControl.find(".mult-dict-display").val("").change();
        dictControl.find("ul").html("");
    }

    function getSelectionDisabledMessage(messagesDictionary, searchValue) {
        for (var key in messagesDictionary) {
            if (messagesDictionary.hasOwnProperty(key)) {
                var elem = messagesDictionary[key];
                if ($.inArray(searchValue, elem) !== -1)
                    return key;
            }
        }

        return null;
    }

    function fillSelectionFields(node, dictButtonId, isTable, tableName, tableRowIndex) {

        //Заполнить значениями колонок выбранного элемента соответствующие поля на форме если они есть
        $.each(model.fieldsInfo.DictionaryFieldInfoList,
            function(index, element) {
                //var columnName = element[COLUMN_NAME_INDEX];
                //var columnFieldName = element[FIELD_NAME_INDEX];
                var columnDictName = element.DictColumnName;
                var columnFieldName = element.EditName;

               //var container = $dictButton.closest(".column-container"); //Cелектор для нахождения контейнера элементов словаря
               // var columnField = container
               //     .find(getColumnFieldSelector(columnFieldName, isTable, tableName, tableRowIndex));//Закомментировано для возможности поиска элементов не только внутри контейнера, а в произвольном месте на странице
                var columnField = $(getColumnFieldSelector(columnFieldName, isTable, tableName, tableRowIndex));
                if (columnField != null) {
                    if (columnField.is(":checkbox")) {
                        columnField.prop("checked", node.get(columnDictName) === "1" ? true : false).change();
                    } else if (columnField.hasClass("money") || columnField.hasClass("number")) {
                        var val = node.get(columnDictName);
                        if (val) {
                            var parsed = columnField.hasClass("money") ? parseFloat(val).toFixed(2) : parseInt(val, 10);
                            if (!isNaN(parsed))
                                columnField.autoNumeric('set', parsed);
                            else {
                                window.alert("Ошибка! Неверный тип значения");
                                return;
                            }
                        }
                        columnField.change();
                    } else {
                        columnField
                            .val(node.get(columnDictName))
                            .change();
                    }
                }
            });

        //заполняем Display field
        fillDipslayValueForDict($dictButton.closest(".dict-modal-control"));

        //Сохраняем id выбранного элемента, другие словари фильтруются по нему
        $(getColumnFieldParentSelector(dictButtonId, isTable, tableName, tableRowIndex))
            .val(node ? node.get('id') : '')
            .change();
    }

    function fillMultipleDictFields(selectedNodes, dictButtonId, isTable, tableName, tableRowIndex) {
        var dropList = $dictButton.closest("div").find("ul");
        var editToolName = $dictButton.attr('data-dict-name');
        var dictTableName = $dictButton.attr("data-dictTableName");
        var elementIds = [];

        dropList.html("");
        var rowNumber = 1;
        $(selectedNodes).each(function(index, node) {
            elementIds.push(node.get("id"));
            var listElement = $("<li></li>");
            var displayElement = $('<a href="#" onclick="setPreventDefault(event);"></a>');
            var itemDisplayText = "";
            var removeSign =
                $('<span onclick="removeFromMultipleDict(this);" class="glyphicon glyphicon-remove"></span>');

            //Заполнить значениями колонок выбранного элемента соответствующие поля на форме если они есть
            $.each(model.fieldsInfo.DictionaryFieldInfoList,
                function(index, element) {
                    var columnDictName = element.DictColumnName;
                    var columnFieldName = dictTableName + '-' + element.EditName + '-' + rowNumber;

                    var elementHiddenInput = $('<input type="hidden" readonly/>');
                    elementHiddenInput.val(node.get(columnDictName));
                    elementHiddenInput.attr('dictionary-edit-name', editToolName);

                    if (element.ShowAsDisplayText === true) {
                        elementHiddenInput.addClass("display-field-part");
                        if (itemDisplayText === "") {
                            itemDisplayText = node.get(columnDictName);
                        } else {
                            itemDisplayText += ", " + node.get(columnDictName);
                        }
                    }

                    var inputName = isTable
                        ? tableName + "-" + columnFieldName + "-" + tableRowIndex
                        : columnFieldName;
                    elementHiddenInput.attr('name', inputName);
                    elementHiddenInput
                        .val(node.get(columnDictName))
                        .change();

                    listElement.append(elementHiddenInput);
                });

            displayElement.append(itemDisplayText);
            listElement.append(displayElement);
            listElement.append(removeSign);
            dropList.append(listElement);
            rowNumber++;
        });

        //заполняем Display field
        fillDisplayVlaueForMultipleDict($dictButton.closest(".dict-modal-control"));

        var selectedIds = elementIds.length > 0 ? elementIds.join(",") : '';
        //Сохраняем id выбранных элементов, другие словари фильтруются по ним
        $(getColumnFieldParentSelector(dictButtonId, isTable, tableName, tableRowIndex))
            .val(selectedIds)
            .change();
    }

    function getColumnFieldSelectorBase(columnFieldName, isParentSelector, isTable, tableName, tableRowIndex) {
        //table: tableName-fieldName-rowIndex
        //tableParent: tableName-fieldName-rowIndex + "parent"
        //field: fieldName
        //fieldParent: fieldName + "parent"
        var dictButtonId = $dictButton.attr("id");

        var fullFieldName = isTable
            ? tableName + "-" + columnFieldName + "-" + tableRowIndex
            : columnFieldName;

        return isParentSelector
            ? "input[data-parent-name='" +
            fullFieldName +
            "parent" +
            "'], textarea[data-parent-name='" +
            fullFieldName +
            "parent" +
            "']" //Удалил [dictionary-edit-name='" + dictButtonId + "']
            : "input[name='" +
            fullFieldName +
            "'][dictionary-edit-name='" +
            dictButtonId +
            "'], textarea[name='" +
            fullFieldName +
            "'][dictionary-edit-name='" +
            dictButtonId +
            "']"; //[dictionary-edit-name='" + dictButtonId  + "'] добавлено для возможности поиска элементов не только внутри контейнера, а в произвольном месте на странице
    }

    function getColumnFieldSelector(columnFieldName, isTable, tableName, tableRowIndex) {
        return getColumnFieldSelectorBase(columnFieldName, false, isTable, tableName, tableRowIndex);
    }

    function getColumnFieldParentSelector(columnFieldName, isTable, tableName, tableRowIndex) {
        return getColumnFieldSelectorBase(columnFieldName, true, isTable, tableName, tableRowIndex);
    }

    //сортировка дерева
    function sortTree(tryFindValue, fieldName, treestore) {
        var sorters1 = [{
            property: fieldName,
            sorterFn: function(o1, o2) {
                var getRank = function(o) {
                        var name = o.get(fieldName).toLowerCase();
                        var startIndex = name.search(tryFindValue);
                        if (name.substring(0, tryFindValue.length) === tryFindValue &
                            name.substring(tryFindValue.length, tryFindValue.length + 1) === ' ') {
                            return 1;
                        } else if (name.substring(0, tryFindValue.length) === tryFindValue) {
                            return 2;
                        } else if (name.substring(startIndex - 1, startIndex) === ' ' &
                            name.substring(startIndex + tryFindValue.length,
                                startIndex + tryFindValue.length + 1) ===
                            ' ') {
                            return 3;
                        } else {
                            return 4;
                        }
                    },
                    hierarGetRank = function(o) {
                        var childnodes = o.childNodes,
                            isRankOne,
                            isRankTwo,
                            isRankThree;
                        var rank = getRank(o);
                        if (rank === 1) {
                            isRankOne = 1;
                        }
                        if (rank === 2) {
                            isRankTwo = 2;
                        }
                        if (rank === 3) {
                            isRankThree = 3;
                        }
                        for (var node in childnodes) {
                            var childnodessecond = childnodes[node].childNodes;
                            rank = getRank(childnodes[node]);
                            if (rank === 1) {
                                isRankOne = 1;
                            }
                            if (rank === 2) {
                                isRankTwo = 2;
                            }
                            if (rank === 3) {
                                isRankThree = 3;
                            }
                            if (childnodessecond !== []) {
                                rank = hierarGetRank(childnodes[node]);
                                if (rank === 1) {
                                    isRankOne = 1;
                                }
                                if (rank === 2) {
                                    isRankTwo = 2;
                                }
                                if (rank === 3) {
                                    isRankThree = 3;
                                }
                            }
                        }
                        if (isRankOne === 1) {
                            return 1;
                        }
                        if (isRankTwo === 2) {
                            return 2;
                        }
                        if (isRankThree === 3) {
                            return 3;
                        } else {
                            return 4;
                        }
                    },
                    rank1 = hierarGetRank(o1),
                    rank2 = hierarGetRank(o2);

                    if (rank1 === rank2) {
                        return 0;
                    }

                    return rank1 < rank2 ? -1 : 1;
                }
            }
        ];
        store.sort(sorters1);
    }

    function getPermanentFilters() {
        var filters = [];
        if (permanentFilters && permanentFilters.length > 0) {
            for (i = 0; i < permanentFilters.length; i++) {
                var curFilter = new Ext.util.Filter(permanentFilters[i]);
                filters.push(curFilter);
            }
        }
        return filters;
    }

    function addPermanentFilters(store) {
        var filters = getPermanentFilters();
        store.getFilters().add(filters);
    }

    function clearSearchFilter(store) {
        var searchFilterItems = store.getFilters().items;
        var filteredItems = searchFilterItems.filter(function(it) { return it.config.property === "search"; });
        if (filteredItems && filteredItems.length && filteredItems[0]) {
            treePanel.store.getFilters().remove(filteredItems[0]);
        }
    }

    function setSearchFilter(store, filter) {
        var filters = getPermanentFilters();
        filters.push(filter);
        store.filter(filters);
    }

    //Создание фильтра по поисковому запросу
    //и применение фильтра к store
    function filterStoreHandler(value) {
        var treePanel = this;

        var searchString = value.toLowerCase();

        if (searchString.length === 0) {
            clearSearchFilter(treePanel.store);
        }

        var filter = new Ext.util.Filter({
            property: 'search',
            value: searchString
        });

        //Применяем фильтр
        setSearchFilter(treePanel.store, filter);
        //Сортируем
        if (sortable)
            sortStore(treePanel.store);


        function sortStore(store) {
            for (var j = 0; j < treePanel.columns.length; j++) {
                sortTree(searchString, treePanel.columns[j].dataIndex, store);
            }
        }
    }

    function generateTreeModel() {
        var treeModel = {
            extend: 'Ext.data.TreeModel',
            fields: [
                { name: model.IdKey, type: 'string' },
                { name: model.CodeKey, type: 'string' },
                { name: 'checked', defaultValue: false },
            ]
        };

        $.each(modelColumns,
            function(index, value) {
                treeModel.fields.push({ name: value.DictColumnName, type: 'string' });
            });
        return treeModel;
    }

    function addColumns(scope) {
        var dictNameAttr = $dictButton.attr("data-dict-name");
        var columns = [];
        if (model.codeColumnVisible) {
            var columnHeader = dictNameAttr != null && dictNameAttr.length > 0
                ? dictNameAttr
                : "Код";
            columns.push(
                {
                    //Временное решение, ROSSETIZ-481
                    header: columnHeader,
                    flex: 2,
                    sortable: sortable,
                    width: parseInt(model.codeColumnWidth) / 100 * treeWidth,
                    hideable: false,
                    dataIndex: model.CodeKey,
                    renderer: getColumnRenderer(columnHeader),
                    scope: scope,
                });
        };

        $.each(modelColumns,
            function (index, value) {
                columns.push({
                    text: value.DictColumnName,
                    flex: parseInt(value.DictColumnWidth / 10),
                    hideable: false,
                    sortable: sortable,
                    dataIndex: value.DictColumnName,
                    renderer: getColumnRenderer(value.DictColumnName),
                    scope: scope,
                    width: parseInt(value.DictColumnWidth) / 100 * treeWidth
                });
            });

        if (columns.length > 0) {
            columns[0].xtype = dictBuilder.columnXtype;
            //заменяем шаблон первой колонки, добавляем чекбокс
            columns[0].cellTpl = getFirstColumnTemplateString();
        }

        //Если это грид а не дерево - добавляем столбец с чекбоксом
        if (dictBuilder === gridExtJsBuilder) {
            columns.splice(0,
                0,
                {
                    xtype: 'templatecolumn',
                    dataIndex: 'checked',
                    width: 40,
                    tpl: getGridCheckTemplateString(),
                    listeners: {
                        click: function(ctrl, t, rowIndex) {
                            var grid = ctrl.up('grid');
                            var checked = grid.getStore().getAt(rowIndex).get('checked');
                            var row = grid.getStore().getAt(rowIndex);
                            row.set('checked', !checked);
                            row.modified = {};

                            //Записываем в коллекцию выбранных элементов
                            var rowCode = row.get(model.CodeKey);
                            if (!checked) {
                                if (multipleSelection) {
                                    selectedRowsDebug.push(row);
                                } else {
                                    selectedRowsDebug.forEach(function(r) {
                                        if (r.get(model.CodeKey) !== rowCode) {
                                            if (r.set) {
                                                r.set('checked', false);
                                                r.modified = {};
                                                treePanel.view.refreshNode(r);
                                            }
                                        }
                                    });

                                    selectedRowsDebug = [row];
                                }
                            } else {
                                var foundItemsToDelete = selectedRowsDebug.filter(function(r) {
                                    return r.get(model.CodeKey) === rowCode;
                                });
                                foundItemsToDelete.forEach(function(item) {
                                    var index = selectedRowsDebug.indexOf(item);
                                    if (index !== -1) selectedRowsDebug.splice(index, 1);
                                });
                            }
                            treePanel.view.refreshNode(row);
                        }
                    },
                    editor: {
                        xtype: 'checkbox',
                        cls: 'x-grid-checkheader-editor'
                    }
                });
        }

        return columns;
    }

    function getGridCheckTemplateString() {
        return '<div>' +
            '<tpl if="checked !== null">' +
            '<div role="button" class=" x-tree-checkbox x-tree-checkbox<tpl if="checked">-checked</tpl>"></div>' +
            '</tpl>' +
            '<tpl if="checked === null">' +
            '<div role="presentation" class=" x-tree-checkbox x-tree-checkbox disabled"/>' +
            '</tpl>' +
            '</div>';
    }

    function getFirstColumnTemplateString() {
        var editButton;

        if (dataTemplate != undefined) {
            editButton =
                '<div role="button" class="edit-btn-' + uniqId + '  x-tree-icon x-tree-icon-edit"/></div>';
        }

        //n.volosatov - шаблон для включенного чекбокса
        var checkboxTmplArray = [
            '<tpl if="checked !== null">',
            '<div role="button" {ariaCellCheckboxAttr}',
            ' class="{childCls} {checkboxCls}<tpl if="checked"> {checkboxCls}-checked</tpl>"></div>',
            editButton,
            "</tpl>"
        ];

        //n.volosatov - шаблон для выключенного чекбокса
        var disabledCheckboxTmplArray = [
            '<tpl if="checked === null">',
            '<div role="presentation" {ariaCellCheckboxAttr}',
            ' class="{childCls} {checkboxCls} disabled"></div>',
            "</tpl>"
        ];

        return [
            '<tpl for="lines">', '<div class="{parent.childCls} {parent.elbowCls}-img ',
            '{parent.elbowCls}-<tpl if=".">line<tpl else>empty</tpl>" role="presentation"></div>',
            "</tpl>",
            '<div class="{childCls} {elbowCls}-img {elbowCls}',
            '<tpl if="isLast">-end</tpl><tpl if="expandable">-plus {expanderCls}</tpl>" role="presentation"></div>',
            checkboxTmplArray.join(""),
            disabledCheckboxTmplArray.join(""),
            '<tpl if="icon"><img src="{blankUrl}"<tpl else><div</tpl>',
            ' role="presentation" class="{childCls} {baseIconCls} {customIconCls} ',
            '{baseIconCls}-<tpl if="leaf">leaf<tpl else><tpl if="expanded">parent-expanded<tpl else>parent</tpl></tpl> {iconCls}" ',
            '<tpl if="icon">style="background-image:url({icon})"/><tpl else>></div></tpl>', '<tpl if="href">',
            '<a href="{href}" role="link" target="{hrefTarget}" class="{textCls} {childCls}">{value}</a>',
            "<tpl else>",
            '<span class="{textCls} {childCls}">{value}</span>',
            "</tpl>"
        ].join("");
    }

    function getColumnRenderer(columnName) {
        return function(value, metadata, record) {
            value = highlightSearchValue(value, this);
            var url = record.get("url");
            if (url && (record.get("urlAttributes").indexOf(columnName) !== -1)) {
                value = wrapToLink(value, url);
            }
            return value;
        }
    }

    function wrapToLink(value, url) {
        return "<a href='" + url + "' target='_blank'>" + value + "</a>";
    }

    function highlightSearchValue(value, self) {
        var searchString = self.searchField.getValue();
        if (searchString.length > 0) {
            return self.strMarkRedPlus(searchString, value);
        }
        return value;
    }

    function initTreePanel(treePanel) {

        var lastFilterValue = "";
        var uId = uniqId;
        Ext.apply(treePanel,
            {
                store: store,
                columns: addColumns(treePanel),
                dockedItems: [
                    {
                        xtype: 'textfield',
                        id: 'dictionarySearchField' + uniqId,
                        dock: 'top',
                        emptyText: 'Поиск',
                        value: '',
                        enableKeyEvents: true,
                        triggers: {
                            clear: {
                                cls: 'x-form-clear-trigger',
                                handler: 'onClearTriggerClick',
                                hidden: false,
                                scope: 'this'
                            },
                            search: {
                                cls: 'x-form-search-trigger',
                                weight: 1,
                                handler: 'onSearchTriggerClick',
                                scope: 'this'
                            }
                        },

                        onClearTriggerClick: function() {
                            this.setValue();
                            clearSearchFilter(treePanel.store);
                        },

                        onSearchTriggerClick: function() {

                            var that = this;
                            var filterFunc = function() {
                                var value = that.getValue();

                                lastFilterValue = value;
                                treePanel.filterStore(value);
                                Ext.getCmp('DictWind' + uniqId).unmask();
                            };

                            Ext.getCmp('DictWind' + uniqId).mask('Поиск');
                            setTimeout(filterFunc, 100);
                        },

                        listeners: {
                            //Добавил для работы поиска по нажатию на Enter
                            specialkey: enterKeyListener,

                            keyup: {
                                fn: debounce(keyUpListener, 500)
                            },

                            render: function (field) {
                                this.searchField = field;
                                field.focus(false, 10);
                            },

                            scope: treePanel
                        }
                    }
                ]
            });

        treePanel.callParent(arguments);

        

        function enterKeyListener(field, e) {
            //Фильтрация по нажатию enter
            if (e.getKey() == e.ENTER) {
                var value = field.getValue();
                if (value === '') {
                    clearSearchFilter(treePanel.store);
                    lastFilterValue = value;
                } else if (value && value !== lastFilterValue) {
                    var filterFunc = function() {
                        treePanel.filterStore(value);
                        lastFilterValue = value;
                        Ext.getCmp('DictWind' + uniqId).unmask();
                    };

                    Ext.getCmp('DictWind' + uniqId).mask('Поиск');
                    setTimeout(filterFunc, 1000);
                }
            }
        }

        function keyUpListener(field) {
            filterInput = $("#" + field.inputId);
            filterInput.prop('disabled', true);

            //Очистка фильтрации при пустом поле
            var value = field.getValue();
            if (value === '' && value !== lastFilterValue) {
                clearSearchFilter(treePanel.store);
                lastFilterValue = value;
            } else if (value && value !== lastFilterValue) {
                treePanel.filterStore(value);
                lastFilterValue = value;
            }
        }

    }

    function showModalWindow() {
        var dictNameAttr = $dictButton.attr("data-dict-name");

        if (dictNameAttr === "Контрагенты" && isButtonExternalSystemShow.toLowerCase() === "true") {
            buttons.unshift({
                text: 'Поиск в смежных системах',
                cls: 'dialogFindBtn',
                handler: function() {
                    onSearchInExternalSystemClick();
                    isButtonExternalSystemClick = true;
                    var treePanelHeight = isSearchPanelLoaded 
                                        ? win.height - searchInExternalSystemForm.height - 45 
                                        : win.height - searchInExternalSystemForm.height - 145
                    treePanel.setHeight(treePanelHeight);
                },
            });
        }

        searchInExternalSystemForm = Ext.create('Ext.panel.Panel',
            {
                id: 'itemFormPanel-suppliers',
                height: 220,
                bodyCls: "x-body x-webkit x-chrome",
                hidden: true,
                autoDestroy: false,
                layout: 'container',
                buttons: [
                    {
                        text: 'Найти',
                        handler: function () {
                            //Если у нас где-то определен обработчик внешних контрагентов
                            if (typeof ExtContractorManager !== 'undefined') {
                                var manager = ExtContractorManager(store, treePanel, win);
                                manager.findExternalContractor();
                            } else {
                                alert('Нет обработчика для поиска внешних контрагентов - необходимо проверить js файлы конфигурации');
                            }
                        }
                    },
                    {
                        text: 'Отмена',
                        cls: 'on-external-search-cancel-button',
                        handler: function () {
                            var form = this.up('panel');
                            $(form.ariaEl.dom).hide();
                            form.setHidden(true);
                            treePanel.setHeight(win.height - 45);
                            isButtonExternalSystemClick = false;

                            store.clearData();
                            treePanel.view.refresh();
                            generateStore();
                            treePanel.reconfigure(store);
                            treePanel.view.refresh();
                        }
                    }
                ],
            });


        var windowCurrentHeightPanel = ($(window).height() - 16) / 2;

        itemForm = Ext.create('Ext.panel.Panel',
            {
                id: 'itemFormPanel' + uniqId,
                minHeight: Math.min(350, windowCurrentHeightPanel),
                maxHeight: 555,
                rootVisible: false,
                hideHeaders: false,
                hidden: true,
                layout: 'container',
                bodyCls: "x-body x-webkit x-chrome",
                buttons: [
                    {
                        text: 'Сохранить',
                        handler: saveFormData
                    },
                    {
                        text: 'Отмена',
                        handler: function () {
                            itemForm.setHidden(true);
                            treePanel.setVisible(true);
                        }
                    }
                ],
                autoScroll: true
            });

        treePanel = Ext.create('Ext.filteredTree');

        // оставляем только вертикальный скролл
        if (dictNameAttr === "Контрагенты" && isButtonExternalSystemShow.toLowerCase() === "true") {
            treePanel.applyScrollable('vertical')
            panelWidth = undefined;
        }

        var dictModalWinItems = dictNameAttr == "Контрагенты"
            ? [
                searchInExternalSystemForm,
                treePanel,
                itemForm
            ]
            : [treePanel, itemForm]

        //var cmp = Ext.getCmp("DictWind");
        //if (cmp == undefined ) {
        var scrollDefaultSize = 16;
        var windowDefaultMinWidth = 350;
        var windowDefaultMinHeight = 700; // 700

        var windowCurrentWidth = $(window).width() - scrollDefaultSize; //у ExtJS бага при разворачивании на весь экран - появляются скрулы и кнопки частично ими перекрываются
        var windowCurrentHeight = $(window).height() - scrollDefaultSize; //у ExtJS бага при разворачивании на весь экран - появляются скрулы и кнопки частично ими перекрываются

        win = Ext.create('widget.window',
            {
                title: dictNameAttr != null && dictNameAttr.length > 0
                    ? dictNameAttr
                    : 'Выбор значения из словаря',
                header: {
                    titleAlign: 'center'
                },
                closable: false,
                id: 'DictWind' + uniqId,
                closeAction: 'destroy',
                maximizable: true,
                maxWidth: windowCurrentWidth, 
                maxHeight: $(window).height() - scrollDefaultSize,
                autoWidth: false,
                width: panelWidth,
                minWidth: Math.min(windowDefaultMinWidth, windowCurrentWidth),
                minHeight: Math.min(windowDefaultMinHeight, windowCurrentHeight),
                layout: {
                    type: 'vbox',
                    align: 'stretch'
                },
                modal: true,
                items: dictModalWinItems,
                autoDestroy: false,
                listeners: {
                    close: enableDictButton,
                    resize: function(el, newWidth, newHeight, oldWidth, oldHeight) {
                        if ($('#editView').length > 0 || $('#registerView').length > 0 || $('#address-book-container').length > 0) {
                            el.setHeight(newHeight);
                            el.setWidth(newWidth);
                            var treePanelHeight = isButtonExternalSystemClick 
                                                ? newHeight - searchInExternalSystemForm.height - 45 
                                                : el.height - 45
                            treePanel.setHeight(treePanelHeight);
                        }
                    }
                },
            });

        // hierar.win = win;
        // hierar.treePanel = treePanel;
        // hierar.store = store;

        win.show();


        filterInput = $('[data-componentid="dictionarySearchField' + uniqId + '"]');
        if (filterInput) filterInput.prop('disabled', true);

        //} else {
        //    win = cmp;
        //    win.items.add(treePanel);
        //    win.show();
        //}
        setSelectedData();
        bindCellToolTips(treePanel);
        fnAddButtons(treePanel, $dictButton, uniqId);
    }

    function setSelectedData() {
        var tree = treePanel;
    }

    function fnAddButtons(cmp, button, uniqId) {
        var _button = button;
        var _uniqId = uniqId;
        $(document).on("click",
            ".edit-btn-" + _uniqId,
            function(event) {
                event.preventDefault();
                fnClickAddButtons(event.target, cmp, _button, _uniqId);
            });

    };

    function fnClickAddButtons(e, cmp, button, uniqId) {
        cmp.hide();
        var id = $(e).closest('table').first().attr('data-recordindex');
        var code = cmp.store.data.items[id].data.id;
        var dataUrl = button.attr("data-edit-url");
        dataUrl = dataUrl + "&key=" + code;
        OpenDictionaryForm(dataUrl);
    };

    function bindCellToolTips(treePanel) {
        var treePanelView = treePanel.getView();
        //configure tooltips
        Ext.create('Ext.tip.ToolTip',
            {
                // The overall target element.
                target: treePanelView.getId(),
                // Each grid cell causes its own separate show and hide.
                delegate: treePanelView.cellSelector,
                // Render immediately so that tip.body can be referenced prior to the first show.
                renderTo: Ext.getBody(),
                listeners: {
                    // Change content dynamically depending on which element triggered the show.
                    beforeshow: function updateTipBody(tip) {
                        var cellText = $(tip.triggerElement).find(".x-grid-cell-inner").text();

                        //not showing if ther's no text 
                        if (cellText == null || $.trim(cellText).length === 0) {
                            return false;
                        }

                        tip.update(cellText);
                    }
                }
            });
    }

    function localize() {
        Ext.define('Ext.grid.header.Container',
            {
                override: 'Ext.grid.header.Container',
                sortAscText: 'Сортировать по возрастанию',
                sortDescText: 'Сортировать по убыванию'
            });
    }

    init();
    return deferred;
}

// "легкая" реализация debounce. Нужня для того, чтобы компонент не ddos'ил backend при вводе строки для поиска
function debounce(fn, delay) {
    var timeoutID = null;
    return function() {
        clearTimeout(timeoutID);
        var args = arguments;
        var that = this;
        timeoutID = setTimeout(function () {
            fn.apply(that, args);
        }, delay);
    };
}
*/