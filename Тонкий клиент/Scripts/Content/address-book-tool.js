
var removeAllAddressBook = function (removeGlyph, registerName) {
    var dictControl = $(removeGlyph).closest(".dict-modal-control");
    var hiddenRows = dictControl.find("ul.multiple-editor-list li");
    var dictFooter = dictControl.find("ul.multiple-editor-list div[name='removeItemsFooter']");
    
    hiddenRows.each(function (num, row) {
        $(row).find("input")
            .each(function (num, element) {
                var input = $(element);
                input.closest("li").remove();
                input.remove();
            });
    });    

    $(dictFooter).remove(); 
    
    dictControl.find("[name='" + registerName + "DictId']").first().val("");
    dictControl.find("[name='" + registerName + "DictName']").first().val("");
    dictControl.find("input[data-field-name='" + registerName + "']").first().val("").change();
};

var removeItemAddressBook = function (removeGlyph, registerName) {
    var dictControl = $(removeGlyph).closest(".dict-modal-control");
    var hiddenDictRows = dictControl.find("ul.multiple-editor-list li");
    var dictFooter = dictControl.find("ul.multiple-editor-list div[name='removeItemsFooter']");

    if ($(hiddenDictRows).length === 1) {
        $(dictFooter).remove();
    }

    var currentItemKeyVal = $(removeGlyph).siblings("input[data-name=\"key\"]").first().val();
    var currentItemNameVal = $(removeGlyph).siblings("input[data-name=\"name\"]").first().val();
    
    var idsVal = dictControl.find("[name='" + registerName + "DictId']").first().val();
    var namesVal = dictControl.find("[name='" + registerName + "DictName']").first().val();

    var splittedIds = idsVal.split(ct.common.dictionary.DATA_SEPARATOR);
    var splittedNames = namesVal.split(ct.common.dictionary.DATA_SEPARATOR);

    splittedIds.splice(splittedIds.indexOf(currentItemKeyVal),1);
    splittedNames.splice(splittedNames.indexOf(currentItemNameVal),1);
    
    dictControl.find("[name='" + registerName + "DictId']").first().val(splittedIds.join(ct.common.dictionary.DATA_SEPARATOR));
    dictControl.find("[name='" + registerName + "DictName']").first().val(splittedNames.join(ct.common.dictionary.DATA_SEPARATOR));
    dictControl.find("input[data-field-name='" + registerName + "']").first().val(splittedNames.join(ct.common.dictionary.VIEW_DATA_SEPARATOR)).change();

    $(removeGlyph).closest("li").remove();
};


var AddressBookTool = function (buttonElement, selectedElements) {
    var winAddressbook,
        isMultiple,
        showVacationField,
        IsTable,
        TableName,
        registerName = buttonElement.name,
        addressBookDataUrl = buttonElement.name,
        form = $(buttonElement).closest("form"),

        tabs = [],
        addressBookGroups = [],
        trees = [],
        storebookTpl = [],
        currentTree,
        childrenSelection = true,
        buttons,
        searchInExternalSystemForm,
        wasExternalExpertChoosen = false,
        isInitSearch = false;

    function initSelectedValues() {
        if (selectedElements != undefined) {
            var elements = selectedElements.name.split(",");
            if (elements.length > 0) {
                var values = $(form).find("[name='" + elements[0] + "']").val();
                for (var i = 1; i < elements.length; i++) {
                    values += "," + $(form).find("[name='" + elements[i] + "']").val();
                }
                return encodeURIComponent(values);
            }
        }
        return null;
    }

    function initUniqueIds() {
        return $(form).find("[name='uniqueIds']").val();
    }

    function initObjectType() {
        var objectTypeElem = $(form).find("input[name='objectType']");

        var objectType;
        if (objectTypeElem != undefined)
            objectType = objectTypeElem.val();

        return objectType == undefined ? null : objectType;
    }

    var uniqueIds = initUniqueIds();
    var objectType = initObjectType();
    var selectedValues = initSelectedValues();

    Ext.define('Tree', {
        extend: 'Ext.data.TreeModel',
        fields: [
            { name: 'name', type: 'string' },
            { name: 'key', type: 'string', sortType: 'asNatural' },
            { name: 'selectable', type: 'string' },
            { name: 'checked', defaultValue: false },
            { name: 'mailbox', type: 'string' }
        ],
        idProperty: 'key'
    });

    Ext.apply(Ext.data.SortTypes, {
        asNatural: function (str) {
            // Pad all the numbers we can find with 10 zeros to the left, then trim
            // down to the last 10 digits. A primitive natural sort occurs.
            // WARN: May do odd things to any numbers longer than 10 digits. It will
            // also not work as you might expect on decimals.
            return str.replace(/(\d+)/g, "0000000000$1").replace(/0*(\d{10,})/g, "$1");
        }
    });



    var itemCheckHandler = function (node, checked) {
        if (node) {
            if (childrenSelection && isMultiple) {              
                node.cascadeBy(function (child) {
                    //if (child.get("visible")) {
                    child.set("checked", checked);
                    itemCheckInternal(child, checked);
                    //}
                });
            } else {
                itemCheckInternal(node, checked);
            }
        }
    }

    function itemCheckInternal(node, checked) {
        if (node != undefined) {
            var contains;
            var current = { key: node.data.key, name: node.data.name, selectable: node.data.selectable };
            if (current.selectable === 'true') {
                for (var key in storebookTpl) {
                    if (storebookTpl.hasOwnProperty(key)) {
                        if (storebookTpl[key].key == current.key) {
                            contains = true;
                            if (checked === false) {
                                storebookTpl.splice(key, 1);
                            }
                        }
                    }
                }
                if (!contains) {
                    if (isMultiple == undefined) {                      
                        storebookTpl = [];
                        var store = node.getTreeStore();
                        var rootNode = store.getRootNode();
                        rootNode.cascadeBy(function (child) {
                            var oldChecked = child.get('checked');
                            child.set('checked', false);
                            if (oldChecked === true) refreshNode(child);
                        });
                        node.set('checked', true);
                    }
                    storebookTpl.push({ key: node.data.key, name: node.data.name });
                }
            }
			else {
				node.set('checked', false);
			}

            refreshNode(node);
        }
    }

    function refreshNode(node) {
        var tree = trees[0].tree;
        if (tree) tree.view.refreshNode(node);
    }

    //Функция генерации дерева адресной книги
    function generateAddresBookTree(name, store, tabName) {
        return Ext.define(name, {
            extend: 'Ext.tree.Panel',
            store: store,
            layout: 'fit',
            rootVisible: false,
            hideHeaders: false,
            useArrows: true,
            listeners: {
				// Не обрабатываем событие клика по элементу, если сброшен флаг выбора
				beforeitemclick: function (view, record, item, index, e, eOpts) {
                    if ((record.data.selectable === 'false') && !record.data.checked) {
                        return false;
                    }
                },
                checkchange: itemCheckHandler,
                itemclick: itemClickHandler
            },

            initComponent: function () {
                var me = this,
                    lastFilterValue = "";
                me.columns = [
                    {
                        xtype: 'treecolumn',
                        dataIndex: 'selectable',
                        flex: 1,
                        scope: me,
                        hidden: true
                    },
                    {
                        xtype: 'treecolumn',
                        flex: 1,
                        dataIndex: 'key',
                        scope: me,
                        renderer: function (value) {
                            var searchString = this.searchField.getValue();
                            if (searchString.length > 0) {
                                return this.strMarkRedPlus(searchString, value);
                            }
                            return value;
                        },
                        hidden: true
                    },
                    {
                        xtype: 'treecolumn',
                        dataIndex: 'name',
                        header:'Наименование',
                        flex: 3,
                        scope: me,
                        renderer: function (value) {
                            var searchString = this.searchField.getValue();
                            if (searchString.length > 0) {
                                return this.strMarkRedPlus(searchString, value);
                            }
                            return value;
                        }
                    },
                ];

                if (tabName === "Person") {
                    me.columns.push(
                        {
                            xtype: 'gridcolumn',
                            header: 'Email',
                            dataIndex: 'mailbox',
                            flex: 2,
                            scope: me,
                            renderer: function (value) {
                                var searchString = this.searchField.getValue();
                                if (searchString.length > 0) {
                                    return this.strMarkRedPlus(searchString, value);
                                }
                                return value;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            header: 'Подразделение',
                            dataIndex: 'dept2',
                            flex: 3,
                            scope: me,
                            renderer: function (value) {
                                var searchString = this.searchField.getValue();
                                if (searchString.length > 0) {
                                    return this.strMarkRedPlus(searchString, value);
                                }
                                return value;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            header: 'Должность',
                            dataIndex: 'pos',
                            flex: 3,
                            scope: me,
                            renderer: function (value) {
                                var searchString = this.searchField.getValue();
                                if (searchString.length > 0) {
                                    return this.strMarkRedPlus(searchString, value);
                                }
                                return value;
                            }
                        },
                        {
                            xtype: 'gridcolumn',
                            header: 'Роль',
                            dataIndex: 'role',
                            flex: 3,
                            scope: me,
                            renderer: function (value) {
                                var searchString = this.searchField.getValue();
                                if (searchString.length > 0) {
                                    return this.strMarkRedPlus(searchString, value);
                                }
                                return value;
                            }
                        }
                    );
					
					if (showVacationField) {
						me.columns.push(
							{
								xtype: 'checkcolumn',
								header: 'В отпуске',
								dataIndex: 'isvacation',
								flex: 3,
								scope: me,
								sortable: true,
								listeners: {
									beforecheckchange: function() {
										return false;
									}
								}
							}
						);
					}
					
                }

                Ext.apply(me, {
                    store: store,
                    dockedItems: [
                        {
                            xtype: 'textfield',
                            id: 'addrBookDictionarySearchField' + name,
                            dock: 'top',
                            emptyText: 'Поиск',
                            value: '',
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

                            onClearTriggerClick: function () {
                                this.setValue();
                                me.store.clearFilter();
                                me.collapseAll();
                            },

                            onSearchTriggerClick: function () {
                                var values = this.getValue().trim();
                                me.filterStore(values);
                                if (!(values === undefined) & !(values === "")) {
                                    me.expandAll();
                                }
                            },

                            listeners: {
                                //Добавил для работы поиска по нажатию на Enter
                                specialkey: function (field, e) {
                                    if (e.getKey() == e.ENTER) {
                                        var value = field.getValue().trim();
                                        if (value == '') {
                                            me.filterStore(value);
                                            lastFilterValue = value;
                                        } else if (value && value !== lastFilterValue) {
                                            field.getTrigger('clear')[(value.length > 0) ? 'show' : 'hide']();
                                            me.filterStore(value);
                                            lastFilterValue = value;
                                            me.expandAll();
                                        }
                                    }
                                },
                                keyup: {
                                    fn: function (field, event, eOpts) {
                                        var value = field.getValue().trim();
                                        if (value == '') {
                                            me.filterStore(value);
                                            lastFilterValue = value;
                                        } else if (value && value !== lastFilterValue) {
                                            field.getTrigger('clear')[(value.length > 0) ? 'show' : 'hide']();
                                            me.filterStore(value);
                                            lastFilterValue = value;
                                        }
                                    },
                                    buffer: 300
                                },

                                render: function (field) {
                                    this.searchField = field;
                                    field.focus(false, 1000);
                                },

                                scope: me
                            }
                        }
                    ]
                });

                me.callParent(arguments);
            },

            filterStore: function (value) {
                var me = this,
                    searchString = value.toLowerCase(),

                    filterFn = function (node) {

                        var children = node.childNodes,
                            len = children && children.length,
                            visible = v.test(node.get('name')),
                            i;

                        if (!visible) {

                            for (i = 0; i < len; i++) {
                                if (children[i].isLeaf()) {
                                    visible = children[i].get('visible');
                                } else {
                                    visible = filterFn(children[i]);
                                }
                                if (visible) {
                                    break;
                                }
                            }

                        } else {
                            for (i = 0; i < len; i++) {
                                children[i].set('visible', true);
                            }
                        }

                        return visible;
                    },

                    v;
                //Сортируем
                sortTree(searchString, 'name', me.store);
                //
                if (searchString.length < 1) {
                    me.store.clearFilter();
                } else {
                    v = new RegExp(searchString, 'i');
                    me.store.getFilters().replaceAll({
                        filterFn: filterFn
                    });
                }
            },

            strMarkRedPlus: function (search, subject) {
                return subject.replace(
                    new RegExp('(' + search.trim() + ')', "gi"), "<span style='color: red;'><b>$1</b></span>");
            }
        });
    }

    var itemClickHandler = function (node, record, item, index, e, eOpts) {
        if (e.target.className.indexOf("x-tree-checkbox") == -1) {
            if (record.get("enabled") == undefined || record.get("enabled") == true) {
                var status = record.get("checked");
                record.set("checked", !status);
                itemCheckInternal(record, !status);
            }
        }
    }

    // Генерация окна и вспомогательные функции работы с окном
    function updateTreeTab(addressBookDataType, tree, successFunc) {

        function setNodeKeyByName(tuple) {
            var rootNode = store.getRootNode();
            rootNode.cascadeBy(function (child) {
                var key;
                if (child.data.name === tuple.name) {
                    key = child.data.key;
                }

                if (key) {
                    tuple.key = key;
                }
            });
        }

        currentTree = tree;
        var store = tree.store;
        store.clearFilter();
        var url = addressBookDataUrl + "&addressBookDataType=" + addressBookDataType;
        if (uniqueIds != null)
            url += "&uniqueIds=" + uniqueIds;

        if (selectedValues != null)
            url += "&selectedValue=" + selectedValues;
        else {
            //Если отсутствует selectedValues, но выбранные элементы есть в storebookTpl, добавляем их оттуда
            if (storebookTpl) {
                var ids = [];
                for (var i = 0; i < storebookTpl.length; i++) {
                    ids.push(storebookTpl[i].key);
                }
                url += "&selectedValue=" + ids.join();
            }
        }

        if (objectType != null)
            url += "&objectType=" + objectType;

        store.proxy.url = url;
        store.load({
            callback: function (records) {

                store.loadRecords(records);
                // для значений, которые получены со страницы, ключи не получены, их надо получить из дерева, чтобы не вводить доп. поля на форму
                for (var i = 0; i < storebookTpl.length; i++) {
                    if (!storebookTpl[i].key) {
                        setNodeKeyByName(storebookTpl[i]);
                    }
                }

                tree.setRootNode(store.getRootNode());

                // добавила проверку, т.к. при переходе м/у вкладками
                // с видимым searchInExternalSystemForm
                // плыли размеры отображаемого контейнера tree панели
                if (isInitSearch) {
                    tree.setHeight(tree.getMaxHeight() - 120);
                } else {
                    tree.setHeight(tree.getMaxHeight());
                }

                successFunc();
            }
        });
    }

    var createWin = function () {
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

        searchInExternalSystemForm = Ext.create('Ext.panel.Panel', {
            id: 'itemFormPanel-expert',
            bodyCls: "x-body x-webkit x-chrome",
            hidden: true,
            autoDestroy: false,
            layout: 'fit',
            maxHeight: 120,
            buttons: [
                {
                    text: 'Найти',
                    handler: function () {
                        var tree = trees[0].tree;
                        var store = tree.store;
                        //Если у нас где-то определен обработчик внешних контрагентов
                        if (typeof ExpertsManager !== "undefined") {
                            var manager = ExpertsManager(store, tree);
                            manager.findExpert();
                            wasExternalExpertChoosen = true;
                        } else {
                            alert('Нет обработчика для поиска внешних контрагентов - необходимо проверить js файлы конфигурации');
                        }

                        if (tabpanel.activeTab) {
                            resizeTree(tabpanel.activeTab.down(), isInitSearch);
                        } else {
                            resizeTree(tabpanel.down('panel').down(), isInitSearch);
                        }
                    }
                },
                {
                    text: 'Отмена',
                    handler: function () {
                        var form = this.up('panel');
                        $(form.ariaEl.dom).hide();
                        form.setHidden(true);
						

                        if (tabpanel.activeTab) {
                            tabpanel.activeTab.down().setHeight(tabpanel.activeTab.down().getHeight() + 120);
                        } else {
                            tabpanel.down('panel').down().setHeight(tabpanel.down('panel').down().getHeight() + 120);
                        }          
                        
                        isInitSearch = false;
                        if (registerName === "expert" || (registerName === "performerName" && ($(".modal-title:visible").text() === "Создать этап" || $(".modal-title:visible").text() === "Делегировать")) || (registerName === "performerNames" && $(".modal-title:visible").text() === "Запрос дополнительного согласования")) {
							$(".dialogFindBtn2").toggle()
							$(".dialogFindBtn2").css("width",'')
							$(".dialogFindBtn2").css("top",'')
						}
                    }
                }
            ],
            items: [
                new Ext.form.FormPanel({
                    layout: 'anchor',
                    defaults: {
                        xtype: 'form',
                        labelAlign: 'top',
                        anchor: '100%'
                    },
                    items: [{
                        name: 'typedSearchField',
                        xtype: 'textfield',
                        fieldLabel: 'Наименование'
                    }]
                })
            ],
            defaults: {
                bodyPadding: tabPanelPadding
            },
            autoScroll: true
        });

        addressBookGroups.forEach(function (group) {
            var tree = $.grep(trees, function (e) { return e.name == group.AddressBookTypeName; });
            var tab = {
                title: group.AddressBookDisplayName,
                single: true,
                listeners: {
                    activate: function (tab) {
                        updateTreeTab(group.AddressBookTypeName, tree[0].tree, markSelectedElement);
                    },
                    // Нужно, чтобы при скролле не пролистывалась строка поиска, т.к. она представляет собой элемент дерева
                    // и c этой штукой скроллится именно дерево, а не вкладка из TabPanel.                    
                    // (см. EUPDEV-51)
                    resize: function(el, newWidth, newHeight, oldWidth, oldHeight) {
                        if (el.items && el.items.length) {
                            el.items.each(function(item) {
                                item.setHeight(newHeight - tabPanelPadding);
                                item.setMaxHeight(newHeight - tabPanelPadding);
                            });
                        }
                    } // TODO maximize, restore (смотри hierar-dictionary-multi)
                },
                items: tree[0].tree
            };
            tabs.push(tab);
            tabpanel.add(tab);
        });

        buttons = [
            {
                text: 'Выбрать',
                handler: function () {
                    function setSelectedItems() {
                        var registerNameSelector = '[data-field-name="' + registerName + '"]';                        
                        var registerNameIdSelector = '[name="' + registerName + 'Id' + '"]';                        
                        var registerNameListSelector = '[name="' + registerName + 'List"]';
                        var commaIds = "";
                        var commaDescs = "";
                        var MAX_ITEMS = 5;
                        var strAdd = "";
                        var strRegisterName = registerName;
                      
                        var match = /(.*)-(\d*)/g.exec(registerName);                       
                        var registerNameId = strRegisterName + "Id";                       
                        if (match != null) {                            
                            registerNameSelector = '[data-field-name="' + match[1] + '-' + match[2] + '"]';
                            registerNameIdSelector = '[name="' + match[1] + 'Id' + '-' + match[2] + '"]';
                            registerNameListSelector = '[name="' + match[1] + 'List' + '-' + match[2] + '"]';                            
                            registerNameId = match[1] + "-Id-" + match[2];                                                    
                            strRegisterName = match[1];
                            strAdd = "-" + match[2];
                        }
                       
                        $(form).find(registerNameSelector).val("");
                        $(form).find(registerNameIdSelector).val("");
                        $(form).find(registerNameListSelector).html("");

                        var dropList = $(form).find(registerNameListSelector);

                        var storebookTplFixed = [];
                        for (var idx in storebookTpl) {
                            if (storebookTpl[idx].key) {
                                storebookTplFixed.push(storebookTpl[idx]);
                            }
                        }
                        storebookTpl = storebookTplFixed;

                        if (storebookTpl.length > 0) {
                            var displayName = '';

                            // почему-то связанные поля со свойствами заполняем только по первому элементу
                            $(form).find(registerNameIdSelector).val(storebookTpl[0].key).change();
                            fillLinkedFields(registerName, storebookTpl[0].key);

                            var removeSign =
                            $('<div name=\'removeItemsFooter\'><hr class="action-separator"/>'
                                + '<span class="action-container">'
                                + '<button title="очистить список" id="removeItemsAll-bottom" type="button" class="btn btn-default action-container--delete" onclick="removeAllAddressBook(this, \''
                                + registerName + '\'); setPreventDefault(event);">'
                                + '<i class="glyphicon glyphicon-trash"></i>'
                                + '</button>'
                                + '</span>'
                                + '</div>');

                            for (var i = 0; i < storebookTpl.length; i++) {
                                if (i === 0) {
                                    displayName = storebookTpl[i].name;
                                    commaIds = storebookTpl[i].key;
                                    commaDescs = storebookTpl[i].name;                                  
                                } else {
                                    displayName += ", " + storebookTpl[i].name;
                                    commaIds += ct.common.dictionary.DATA_SEPARATOR + storebookTpl[i].key;
									if (registerName === "performerNames") {
										commaIds = storebookTpl[i].key;
									}
                                    commaDescs += ct.common.dictionary.DATA_SEPARATOR + storebookTpl[i].name;                                
                                }

                                var liElement = $('<li>'
                                    + '<input type="hidden" data-name="name" name="' +
                                    registerName +
                                    '" /><input type="hidden" data-name="key" name="' +
                                    registerNameId +
                                    '" />' +
                                    '<a href="#" onclick="stopEvent(event); setPreventDefault(event); return false;">' +
                                    storebookTpl[i].name
                                    + '</a>' 
                                    + '</li>');                               
                                liElement.find("[name=" + registerName + "]").val(storebookTpl[i].name);                                                        
                                liElement.find("[name=" + registerNameId + "]").val(storebookTpl[i].key);

                                var removeElement = $('<div onclick="removeItemAddressBook(this, \''
                                + registerName + '\'); stopEvent(event);" class="multiple-editor-remove glyphicon glyphicon-remove"></div>');
                                liElement.append(removeElement);

								/*if(registerName!=="performerNames")
								{								
									$($(form).find("[name='" + registerNameId + "']").first()).val(storebookTpl[i].key);
								}*/
                                // теперь работает и в случае множественного выбора внутри таблиц
                                
                                dropList.append(liElement);
                            }
                            
                            if (storebookTpl.length > 0) {
                                dropList.append(removeSign);
                            }

                            if ($($(form).find("[name='" + strRegisterName + "DictId" + strAdd + "']")).length>0) {                              
                                $($(form).find("[name='" + strRegisterName + "DictId" + strAdd + "']").first()).val(commaIds);
                                $($(form).find("[name='" + strRegisterName + "DictName" + strAdd + "']").first()).val(commaDescs);
                            }
                            else {
								if(registerName!=="performerNames"){                                
									$($(form).find("[name='" + registerNameId + "']").first()).val(commaIds);
								}
                                $($(form).find("[name='" + registerName + "']").first()).val(commaDescs);                                
                            }
                            $($(form).find(registerNameSelector).first()).val(displayName).change();
                        }
                        else {
                            if ($($(form).find("[name='" + strRegisterName + "DictId" + strAdd + "']")).length>0) {                              
                                $($(form).find("[name='" + strRegisterName + "DictId" + strAdd + "']").first()).val("");
                                $($(form).find("[name='" + strRegisterName + "DictName" + strAdd + "']").first()).val("");
                            }

                            $($(form).find(registerNameSelector).first()).val("").change();
                            $($(form).find(registerNameIdSelector).first()).val("").change();
                        }
                    };

                    //Если был выбран внешний эксперт  - делегируем ему чатсь логики
                    if (typeof ExpertsManager !== "undefined" && wasExternalExpertChoosen) {
                        var manager = ExpertsManager();
                        manager.saveChoosenExpert(storebookTpl, registerName, setSelectedItems);
                    } else setSelectedItems();

                    var store = currentTree.store;
                    store.clearFilter();
                    winAddressbook.close();

                    isInitSearch = false;
                }
            },
            {
                text: 'Отмена',
                handler: function () {
                    isInitSearch = false;

                    var store = currentTree.store;
                    store.clearFilter();
                    for (var i = 0; i < trees.length; i++) {
                        Ext.getCmp('addrBookDictionarySearchField' + 'adrTree' + i).setValue("");

                    }
                    winAddressbook.close();
                }
            }
        ]

        var items = [
            tabpanel
        ]

        if (registerName === "expert" ||
           ((registerName === "performerNames" || registerName === "performerName") && ($(".modal-title:visible").text() === "Создать этап" || $(".modal-title:visible").text() === "Делегировать") && (typeof isButtonExternalSystemShow !== "undefined") && isButtonExternalSystemShow.toLowerCase() === "true") ||
           (registerName === "performerNames" && $(".modal-title:visible").text() === "Запрос дополнительного согласования"))  {
            buttons.unshift({
                text: 'Поиск в смежных системах',
                cls: 'dialogFindBtn dialogFindBtn2',
                handler: function () {

                    $(".dialogFindBtn2").toggle()

                    //if (storebookTpl.length > 0) {
                    //    storebookTpl = [];
                    //    var store = currentTree.store;
                    //    store.clearFilter();
                    //}

                    var searchField = $(".x-form-text[id^='addrBookDictionarySearchFieldadrTree']");
                    if (searchField.val()) {
                        //очищаем поиск
                        searchField.val("");
                        currentTree.store.clearFilter();
                    }

                    searchInExternalSystemForm.setHidden(false);

                    // такая сложная штука для вычисления высоты панели,
                    // т.к. почему-то в разных контейнерах тип панели разный
                    if (tabpanel.activeTab) {
                        resizeTree(tabpanel.activeTab.down(), isInitSearch);
                    }
                    else {
                        resizeTree(tabpanel.down('panel').down(), isInitSearch);
						//deletesCheckOnElements();
						//storebookTpl=[];
                    }

                    isInitSearch = true;
                },
            });
            
            items.unshift(searchInExternalSystemForm);
        }

        var windowDefaultMinWidth = 1200;
        var windowDefaultMinHeight = 600;//610;

        winAddressbook = Ext.create('widget.window', {
            title: 'Адресная книга',
            id: 'winAddressbook',
            name: 'winAddressbook',
            header: {
                titleAlign: 'center'
            },
            closable: false,
            //closeAction: 'hide',
            maximizable: true,
            width: windowDefaultMinWidth,
            height: windowDefaultMinHeight,
            layout: 'fit',
            monitorResize: true,
            modal: true,
            //autoWidth: false,
            buttons: buttons,
            items: items,
            listeners: {
                // событие изменения размера окна,
                // так же вычисляет и изменяет высоту отображаемого контейнера
                // в зависимости от типа активной панели
                resize: function(el, newWidth, newHeight, oldWidth, oldHeight) {
                    if ($('#editView').length > 0 || $('#registerView').length > 0 || $('#address-book-container').length > 0
                        || $('#build-report-form').length > 0) {

                        newWidth = Math.min(newWidth, ct.common.calc.getMinClientWidth());

                        el.setHeight(newHeight);
                        el.setWidth(newWidth);

                        var treePanelHeight = isInitSearch
                                            ? newHeight - searchInExternalSystemForm.getHeight() - 140 
                                            : el.height - 140;
                        if (tabpanel.activeTab) {
                            tabpanel.activeTab.down().setHeight(treePanelHeight);
                        } else {
                            tabpanel.down('panel').down().setHeight(treePanelHeight);
                        }
                    }
                },
                maximize: function (window, opts) {
                    window.anchorTo('winAddressbook', 'bl-bl?', [0, 0], true, 50, function () {
                    });
                },
                restore: function (window, opts) {
                    window.anchorTo(Ext.getBody(), 'c-c', [0, 0], true, 50, function () {
                    });
                }

            },
        });

        return winAddressbook;
    };

    function fillLinkedFields(mainFieldName, selectedItemKey) {       
        var linkedFields = $(form).find("input[data-addressbook-main-field='" + mainFieldName + "']");
        if (linkedFields == undefined || linkedFields.length === 0) {

            linkedFields = $(form).find("input[name='" + mainFieldName + "']");

            if (linkedFields == undefined || linkedFields.length === 0)
                return;
        }

        var fieldsDictionary = [];  // пары атрибут - связанное с атрибутом поле

        var properties = $.map(linkedFields, function (elem, index) {
            var key = $(elem).attr("data-addressbook-property");
            fieldsDictionary[key] = $(elem);

            return key;
        });

        $.ajax({
            url: getAbsoluteUrl("AddressBook/GetItemProperties"),
            type: "POST",
            data: { key: selectedItemKey, properties: properties },
            success: function (data) {
                $.each(properties, function (index, elem) {
                    var field = fieldsDictionary[elem];
                    
                    //Для полей типа адресная книга, инициализируем два свойства Id и Text
                    var next = field.next();
                    if (next.hasClass("parsley-errors-list")) {
                        next = next.next();
                    }
                    if (next) {

                        var nextName = next.attr("name");
                        var fieldName = field.attr("name");

                        if (nextName && fieldName && (nextName === fieldName + "Id")) {
                            var key = data[elem + "Id"];
                            next.val(key);                           
                            field.attr("value", data[elem]);
                            //Заполняем связанные поля (цепочка полей типа адресная книга, более 2 полей в цепочке)                                
                            fillLinkedFields(fieldName, key);
                        }
                    }                
                   
                    if (field[0].type === "checkbox") {                      
                        if (data[elem] === "True") {
                            field[0].checked = true;
                        }
                        else {
                            field[0].checked = false;
                        }
                    }
                    if (field[0].type != "checkbox") {
                        field.val(data[elem]).change();
                    }
                });
            },
            error: function (jqXHR, textStatus, errorThrown) {
                showAlert("Ошибка заполнения связанных полей", errorThrown);
            },
            traditional: true   // чтобы массив передался как надо
        });
    }

    function sortTree(tryFindValue, fieldName, treestore) {
        var sorters1 = [
            {
                property: fieldName,
                direction: 'ASC',
                sorterFn: function (o1, o2) {

                    
                    
                    /*var isVisible1 = treestore.isVisible(treestore.getNodeById(o1.id)),
                        isVisible2 = treestore.isVisible(treestore.getNodeById(o2.id));
                    if (!isVisible1 || !isVisible2) {
                        return 0;
                    }*/
                    var getRank = function (o) {
                        var name = o.get(fieldName).toLowerCase();
                        var startIndex = name.search(tryFindValue);
                        if (name.substring(0, tryFindValue.length) === tryFindValue & name.substring(tryFindValue.length, tryFindValue.length + 1) === ' ') {
                            return 1;
                        } else if (name.substring(0, tryFindValue.length) === tryFindValue) {
                            return 2;
                        } else if (name.substring(startIndex - 1, startIndex) === ' ' & name.substring(startIndex + tryFindValue.length, startIndex + tryFindValue.length + 1) === ' ') {
                            return 3;
                        } else {
                            return 4;
                        }
                    },
                        hierarGetRank = function (o) {
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
        treestore.sort(sorters1);
    }

    function markSelectedElement() {

        function expandParent(node) {
            if (node !== null &&
                node.parentNode !== undefined &&
                node.id !== "root") {
                node.expand();
                expandParent(node.parentNode);
            }
        }

        var store = currentTree.store;
        var rootNode = store.getRootNode();

        var wasFocusedOnce = false;

        for (var key in storebookTpl) {
            rootNode.cascadeBy(function (child) {
                if (child.data.key === storebookTpl[key].key) {
                    child.set('checked', true);
                    expandParent(child.parentNode);

                    if (!wasFocusedOnce) setTimeout(function () { currentTree.getView().focusRow(child); }, 0);
                    wasFocusedOnce = true;
                }
            });
        }
    }

 function deletesCheckOnElements() {

		function expandParent(node) {
            if (node !== null &&
                node.parentNode !== undefined &&
                node.id !== "root") {
                node.expand();
                expandParent(node.parentNode);
            }
        }

        var store = currentTree.store;
        var rootNode = store.getRootNode();

        var wasFocusedOnce = false;

        for (var key in storebookTpl) {
            rootNode.cascadeBy(function (child) {
                if (child.data.key === storebookTpl[key].key) {
                    child.set('checked', false);
                    expandParent(child.parentNode);
                }
            });
        }
    }

    function generateTreeStore(name) {
        var store = Ext.create('Ext.data.TreeStore', {
            model: 'Tree',
            proxy: {
                type: 'ajax',
                timeout: 1200000,
            },
            root: {
                expanded: false
            },
            storeId: 'key',
            sortRoot: 'key',
            sortOnLoad: false,
            remoteSort: false,
            folderSort: true,
            autoLoad: true
        });
        return store;
    }

    //Генерация деревьев адресной книги для использования в окне адресной книги
    var generateAddresBookTrees = function () {
        var store;
        for (var i = 0; i < addressBookGroups.length; i++) {
            store = generateTreeStore("adrTree" + i);
            var abTypeName = addressBookGroups[i].AddressBookTypeName;
            if (addressBookGroups[i].SelectableList != null) {
                abTypeName = addressBookGroups[i].SelectableList.SelectableListType;
            }
            generateAddresBookTree("adrTree" + i, store, abTypeName);
            var tree = {
                'name': addressBookGroups[i].AddressBookTypeName,
                'tree': Ext.create(
                    'adrTree' + i,
                    {
                        root: {

                        }
                    }
                )
            }
            trees.push(tree);
        }
    };

    // изменение высоты отображаемой tree панели
    function resizeTree(tree, isInit) {
        var currentHeight = tree.getHeight();
        var newHeight = isInit ? currentHeight : currentHeight - 120;
        tree.setHeight(newHeight);
    };

    function setAddressBookdataUrl(id) {
        addressBookDataUrl = $(form).find('button[name="' + registerName + '"]').first().data('url');
        addressBookDataUrl = replaceFieldValues(addressBookDataUrl);
    };

    //Динамическая подстановка полей из карточки в url. 
    //Заменяем TTTDataFieldNameTTT на зачение из поля $("[data-field-name='DataFieldName']").val()
    function replaceFieldValues(url) {
        
        var newUrl = url;
        var fieldTag = "TTT";
        var j = 1;
        
        while (newUrl.indexOf(fieldTag) !== -1) {

            var startIdx = newUrl.indexOf(fieldTag);
            var buf = "";
            for (var i = startIdx + fieldTag.length; i < newUrl.length - 3; i++) {

                if (newUrl[i] === "T" && newUrl[i + 1] === "T" && newUrl[i + 2] === "T")
                    break;

                buf += newUrl[i];
            }

            var val = encodeURIComponent($("[data-field-name='" + buf.trim() + "']").val());

            newUrl = newUrl.replace(fieldTag + buf + fieldTag, val);

            if (j++ > 20)
                break;
        }
        
        return newUrl;
    }

    function init() {
        isMultiple = $(form).find('button[name="' + registerName + '"]').first().data('multiple');
       
        childrenSelection = $(form).find('button[name="' + registerName + '"]').first().data('childrenselection') && isMultiple;

		showVacationField = $(form).find('button[name="' + registerName + '"]').first().data('showvacationfield');

        var url = $(form).find('button[name="' + registerName + '"]').first().data('url');                

        url = url.replace('GetAddressBookJson', 'GetAdressBookTypes');
        if (uniqueIds != null) {
            url += "&uniqueIds=" + uniqueIds;
        }
        if (selectedValues != null)
            url += "&selectedValue=" + selectedValues;
        if (objectType != null)
            url += "&objectType=" + objectType;

        url = replaceFieldValues(url);

        $.get(url, function (result) {
            addressBookGroups = result;
          
            setAddressBookdataUrl(registerName);

            generateAddresBookTrees();
            winAddressbook = createWin();
            retrieveSelectedNodesFromPage();

            winAddressbook.show();
        });
    }

    function retrieveSelectedNodesFromPage() {
        var depId;
        var name;

        // == null || === false
        if (isMultiple !== true) {
            // добавляем в список начальные значения
            var dep = $(form).find('[name="' + registerName + '"]').first();
            depId = $(form).find('[name="' + registerName + 'Id"]');           
            name = dep.val();

            if (name !== "") {
                var depKey = depId.val();

                if (depKey) {
                    storebookTpl.push({ key: depKey, name: name });
                } else {
                    storebookTpl.push({ key: null, name: name });
                }
            }
        }       
        var registerNameSelector = '[name="' + registerName + '"]';
        var registerNameIdSelector = '[name="' + registerName + 'Id' + '"]';        
        var registerNameListSelector = '[name="' + registerName + 'List"]';
        var match = /(.*)-(\d*)/g.exec(registerName);
        if (match != null) {
            registerNameSelector = '[name="' + match[1] + '-' + match[2] + '"]';
            registerNameIdSelector = '[name="' + match[1] + 'Id' + '-' + match[2] + '"]';
            registerNameListSelector = '[name="' + match[1] + 'List' + '-' + match[2] + '"]';
            strRegisterName = match[1];
            strAdd = "-" + match[2];
        }    
        var addrBookElements = $(form).find(registerNameListSelector+" li");
        for (var key = 0; key < addrBookElements.length; key++) {
            name = $(addrBookElements[key]).find("input"+registerNameSelector).val();
            depId = $(addrBookElements[key]).find("input" + registerNameIdSelector).val();
          
            if (depId) {
                storebookTpl.push({ key: depId, name: name });
            } else {
                storebookTpl.push({ key: null, name: name });
            }
        }
    }

    init();
    // Возвращаемый API объекта
    return {
        winAddressbook: winAddressbook,
        createWin: createWin,
        generateAddresBookTrees: generateAddresBookTrees
    }
}