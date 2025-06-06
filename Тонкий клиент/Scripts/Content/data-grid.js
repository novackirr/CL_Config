

(function () { }(window.ct = window.ct || {}));
/**
 * ct.dataGrid - модуль с различными утилитами для работы DevExtreme DataGrid.
 * Понемногу переносим функции в этот модуль.
 */
(function (dataGrid) {
    /**
     * Устанавливает ширину видимых колонок в гриде по их содержимому.
     * grid Селектор грида, jQuery-объект или же сам инстанс dx-грида.
     */
    dataGrid.fitColumnsWidth = function(grid) {
        grid = grid.jquery ? grid.dxDataGrid("instance") : grid;
        var columns = grid.getVisibleColumns();
        for (var i = 0; i < columns.length; i++) {
            grid.columnOption(columns[i].index, "width", "auto");
        }
        grid.option("columnAutoWidth", true);
    }
}((window.ct = window.ct || {}, window.ct.dataGrid = window.ct.dataGrid || {})));

function findNestedGridBySelector(e, key, selector) {
    var row = findRowByKey(e, key);
    return findNestedGridInJQObjectBySelector(row, selector);
}

function findNestedGridInJQObjectBySelector(jqObj, selector) {
    var nestedGrid = jqObj.next("tr.dx-master-detail-row").find(selector);
    return nestedGrid;
}

function hideExpandButton($row) {
    $row.find("td.dx-datagrid-expand>div").remove();
    $row.find("td.dx-datagrid-expand").removeClass("dx-datagrid-expand");
}

function findRowByKey(grid, key) {
    return grid.getRowElement(grid.getRowIndexByKey(key));
}

function deleteAttachment(control, event, arg) {
    
    if ($('#' + control).data('dxDataGrid')) {

        if (window.docChangeObserver) window.docChangeObserver.pause();
        
        var decodedUrl = decodeURIComponent(arg);
        var arr = decodedUrl.split("uniqueIds=");
        var keys = arr[arr.length - 1].split("&")[0];
        var grid = $('#' + control).dxDataGrid('instance');
        var key;
        var keyCount;
        var store = grid.getDataSource().store();

        if (keys.indexOf(',') === -1 && keys.indexOf('/') === -1) {

            key = keys;
            keyCount = 1;
            store.remove(key);

        } else {

            var keyParts = keys.indexOf(',') !== -1 ? keys.split(',') : [keys];
            keyCount = 0;
            for (var i = 0; i < keyParts.length; i++) {

                key = keyParts[i];

                if (key.indexOf('/') !== -1)
                    key = key.split('/')[1];
                keyCount++;
                store.remove(key); 
            }    
        }

        setTimeout(function () { grid.refresh() }, 100);  

        if (decodedUrl.indexOf("clientGuid=") !== -1) {
            var clientGuid = decodedUrl.split("clientGuid=")[1].split('&')[0];
            if (clientGuid)
                $("[data-attachment-client-guid='" + clientGuid + "']").html('');
        }

        try {
            var badge = $(".regcard-sidenav .tabs-left .active .badge");
            var badgeValue = badge.text() * 1 - keyCount;
            if (badgeValue >= 0)
                badge.text(badgeValue);
        } catch (e) {
            
        }
        
        var pathArr = window.location.pathname.split('/');
        var docKey = pathArr[pathArr.length - 1];

        if (window.docChangeObserver) window.docChangeObserver.doHashRefresh(docKey);
    }
}

function addRowAttachment() {

    if (typeof window.deleteTableRowAttachmentElement !== "undefined" && window.deleteTableRowAttachmentElement.is(":visible"))
        _deleteTableRowAttachment(window.deleteTableRowAttachmentElement);
    
    if (window.files) {
        $("[name='" + window.attachmentName + "']").val(window.files);
        $("[name='" + window.attachmentKeyName + "']").val(window.fileKeys);
        window.files = "";
        window.fileKeys = "";
        window.deleteTableRowAttachmentElement.show();
    }
}

function dxGridRowAttachmentCellPrepare(param) {
    var field = this.dataField.replace(/^Fields./, "");
    if (param.Fields[field]) {
        var docKey = window.location.pathname.split("/").pop();
        var baseUrl = getBaseUrl();
        var clientGuid = param.Fields[field + '_ИД'];
        return '<a target="_blank" class="search-result-cell-value" data-attachment-client-guid="' + clientGuid + '" href="' + baseUrl + '/Attachment/View?clientGuid=' + clientGuid + '&amp;documentKey=' + docKey + '"><img class="search-result-value-image vertical-middle" src="' + baseUrl + '/Images/attachmentIcons/text.png"><span>' + param.Fields[field] + '</span></a>';
    }

    return param.Fields[field];
}

function gridReady(apiTableName, parent) {
    var def = $.Deferred();

    if (parent) {
        apiTableName = parent + ":" + apiTableName;
    }

    var eventName = apiTableName + ":initialized";
    var selector = "[data-api-table-name='" + apiTableName + "'] > div";

    try {
        var grid = $(selector).dxDataGrid("instance");
        if (!grid) {
            throw "грид не найден";
        }

        def.resolve(grid);
    }
    catch (ex) {
        $(document).on(eventName, function (event, grid) {
            def.resolve(grid);
            $(document).off(eventName);
        });
    }

    return def.promise();
}

function findNestedGrid(grid, key, apiTableName) {
    return findNestedGridBySelector(grid, key, "[data-api-table-name='" + apiTableName + "']");
}

function hideColumnByCaptionName(grid, captionName) {
    for (var i = 0; i < grid.columnCount(); i++) {
        var col = grid.columnOption(i);
        if (col.caption === captionName) {
            grid.columnOption(i, "visible", false);
        }
    }
}

var customState = (function () {
    function customState(name, state) {
        this.Name = name;
        this.State = state;
        this.Selected = false;
        this.Default = false;
    }

    return customState;
})();


// ReSharper disable once InconsistentNaming
var customStateService = (function (CustomState) {
    "use strict";

    function customStateService() {
        var self = this;
        self.Base = $("base").attr("href");
        if (self.Base === "/") self.Base = "";
    }

    customStateService.prototype.ReceiveDxGridCustomState = function (stateKey, before, complete) {
        var self = this;
        var defer = $.Deferred();
        $.ajax({
            type: "get", dataType: "json", url: self.Base + "/TableSettings/Load", cache: false,
            data: {
                'key': stateKey
            },
            error: function (error) {
                console.log("state_key=" + stateKey + ": load error: " + error);
                defer.reject(error);
            },
            success: function (data) {
                if (data === "") {
                    defer.resolve([]);
                    return;
                }

                var parsed = JSON.parse(data);

                if (!Array.isArray(parsed)) {
                    var stateItem = new CustomState("По умолчанию", parsed);
                    stateItem.Selected = true;
                    parsed = [stateItem];
                }

                defer.resolve(parsed);
            },
            complete: function () {
                if (complete)
                    complete();
            },
            beforeSend: function () {
                if (before) before();
            }
        });

        return defer.promise();
    }

    customStateService.prototype.GetStateKeyFromGrid = function (element) {
        return element.parent("div[data-state-key]").attr("data-state-key");
    }

    customStateService.prototype.ApplyStateToGrid = function (grid, state) {
        var self = this;
        grid.state({});
        grid.refresh().then(function () {
            grid.state(state);

            //ручная установка видимости столбцов, т.к. ошибка в штатном функционале
            state.columns.forEach(function (col) {
                grid.columnOption(col.dataField, "visible", col.visible);
            });

            //устанавливаем соотвествующие галки в диалоге выбора столбцов
            self.GridColChooserSyncSelectedColumns(grid);
        });
    }

    customStateService.prototype.GridColChooserSyncSelectedColumns = function (grid) {
        var colList = grid.colChooserList;
        if (colList) {
            var visibleColumnItems = colList.option("items").filter(function (elem) {
                return grid.columnOption(elem.dataField, "visible");
            });
            colList.beginUpdate();
            colList.option("selectedItems", visibleColumnItems);
            colList.endUpdate();
        }
    }

    // кэш для запросов состояния гридов
    var stateCache = {
        data: {},
        remove: function (key) {
            delete stateCache.data[key];
        },
        exist: function (key) {
            return stateCache.data.hasOwnProperty(key) && stateCache.data[key] !== null;
        },
        get: function (key) {
            return stateCache.data[key];
        },
        set: function (key, data) {
            stateCache.remove(key);
            stateCache.data[key] = data;
        }
    };

    customStateService.prototype.GridCustomStateLoad = function (grid) {
        var self = this;
        var key = self.GetStateKeyFromGrid(grid.element);
        if (!key) return;

        var receiveStatePromise;

        if (!stateCache.exist(key)) {
            // сохраняем промис в кэш, если запроса по данному ключу еще не было
            receiveStatePromise = self.ReceiveDxGridCustomState(key, grid.component.beginCustomLoading, grid.component.endCustomLoading);
            stateCache.set(key, receiveStatePromise);
        }
        else {
            // достаем промис из кэша по ключу
            receiveStatePromise = stateCache.get(key);
        }

        receiveStatePromise.then(
            function (state) {
                var promise = $.when();
                var itemToLoad = state.filter(function (i) {
                    return i.Selected;
                })[0];

                if (!itemToLoad) {
                    itemToLoad = state.filter(function (i) { return i.Default; })[0];
                } else {
                    $.each(state,
                        function (i, item) {
                            item.Selected = item.Default;
                        });
                    //console.log("Want saving state.....");
                    //promise = self.SaveChanges(key, state);
                }

                if (itemToLoad) {
                    promise = promise.then(function () { self.ApplyStateToGrid(grid.component, itemToLoad.State); });
                }

                return promise;
            });
    }

    customStateService.prototype.GridCustomStateReset = function (ev) {
        var self = this;
        ev.state({});
        self.GridColChooserSyncSelectedColumns(ev);
    }

    customStateService.prototype.SaveChanges = function (stateKey, state, before, complete) {
        var self = this;
        var defer = $.Deferred();
        $.ajax({
            type: "post", dataType: "json", url: self.Base + "/TableSettings/Save", cache: false,
            data: {
                'key': stateKey,
                'state': JSON.stringify(state)
            },
            error: function (error) {
                console.log("state_key=" + stateKey + ": save error");
                console.log(error);
                defer.reject(error);
            },
            success: function (data) {
                console.log("state_key=" + stateKey + ": saved successfully");
                defer.resolve(data);
            },
            complete: function () {
                if (complete)
                    complete();
            },
            beforeSend: function () {
                if (before)
                    before();
            }
        });

        return defer.promise();
    }

    return customStateService;
})(customState);

// ReSharper disable once InconsistentNaming
var CustomStateDialog = (function (CustomState, CustomStateService, appendTooltip) {
    "use strict";
    function customStateDialog(ev, btn) {
        var self = this;
        self.GridId = ev.element[0].id;
        var _popup = $("#stateSavePopup_" + self.GridId);
        self.Service = new CustomStateService();
        self.State = [];
        self.Button = btn;
        self.Grid = ev.component;
        self.Element = ev.element;
        self.StateKey = self.Service.GetStateKeyFromGrid(ev.element);
        self.Popup = null;

        self.Popup = _popup.dxPopup({
            showCloseButton: true,
            visible: false,
            title: "Список состояний",
            width: 450,
            height: 520,
            onHiding: function () {
                self.List.remove();
            }
        });

        self.PopupContent = this.Popup.find(".dx-popup-content");
        self.SaveButtonComponent = null;
        self.NameTextBoxComponent = null;
        self.List = null;
    }

    customStateDialog.prototype.BuildCreateNewPanel = function () {
        var self = this;
        var form = $("<div class='row dx-add-new-state-form'><div class='col-sm-9'><div id='stateNameTextBox'></div></div><div class='col-sm-3'><div id='addStateButton'></div></div></div>");
        self.PopupContent.append(form);
        var saveButton = $("#addStateButton").dxButton({
            icon: "save",
            hint: "Добавить элемент",
            disabled: true
        });

        var nameTextBoxElement = $("#stateNameTextBox").dxTextBox({
            value: "",
            placeholder: "Имя текущего состояния...",
            showClearButton: true,
            valueChangeEvent: "keyup"
        }).dxValidator({
            validationRules: [{
                type: "stringLength",
                min: 3,
                message: "Имя должно содержать не менее 3 символов"
            }]
        });

        self.SaveButtonComponent = saveButton.dxButton("instance");
        self.NameTextBoxComponent = nameTextBoxElement.dxTextBox("instance");
        self.NameTextBoxComponent.option("onValueChanged", function (data) {
            var text = data.value;
            self.SaveButtonComponent.option("disabled", text.length < 3);
        });

        self.PopupContent.append(form);
    }

    function CreateRowTemplateHTML(name) {
        return $("<div>" +
            "<div data-selection-checkbox class='col-sm-1 dx-states-list-checkbox'>" +
            "</div>" +
            "<label class='col-sm-7 dx-states-list-label'>" +
            name +
            "</label>" +
            "<div class='col-sm-4'>" +
            "<div data-delete-item-button>" +
            "</div>" +
            "<div data-save-changes-button>" +
            "</div>" +
            "<div data-set-default-item-button>" +
            "</div>" +
            "</div>" +
            "</div>");
    }

    customStateDialog.prototype.Confirm = function (message) {
        var self = this;
        var defer = $.Deferred();

        $("#confirmLabel_" + self.GridId).text(message);
        $("#confirm_" + self.GridId).modal("show");
        $("#confirm_modal-yes_" + self.GridId).on("click",
            function () {
                $("#confirm_" + self.GridId).modal("hide");
                defer.resolve();
            });
        $("#confirm_modal-no_" + self.GridId).on("click",
            function () {
                $("#confirm_" + self.GridId).modal("hide");
                defer.reject();
            });

        return defer.promise();
    }

    customStateDialog.prototype.Alert = function (message) {
        var self = this;
        $("#alertLabel_" + self.GridId).text(message);
        $("#alert_" + self.GridId).modal("show");
        var timeoutId = setTimeout(function () {
            $("#alert_" + self.GridId).modal("hide");
        }, 3000);

        $("#alert_modal-yes_" + self.GridId).on("click", function () {
            $("#alert_" + self.GridId).modal("hide");
            clearTimeout(timeoutId);
        });
    }

    customStateDialog.prototype.BuildRowTemplate = function (itemData, itemIndex, itemElement) {
        var self = this;
        var template = CreateRowTemplateHTML(itemData.Name);
        appendTooltip("<span>" + itemData.Name + "</span>", itemElement);
        itemElement.append(template);
        //связывает шаблон со стейтом за который он отвечает
        template.data("state", itemIndex);

        template.find("[data-selection-checkbox]").dxCheckBox({
            value: itemData.Selected,
            onOptionChanged: function (e) {

                $.each(self.State, function (index, item) {
                    item.Selected = false;
                });

                var stateIndex = template.data("state");
                var currentState = self.State[stateIndex];
                currentState.Selected = e.value;
                if (currentState.Selected) {
                    self.ApplyStatesChanges().then(function () {
                        self.Service.ApplyStateToGrid(self.Grid, itemData.State);
                    });
                } else {
                    dxGridCustomStateReset(self.Grid);
                }
            }
        });
        template.find("[data-delete-item-button]").dxButton({
            icon: "remove",
            hint: "Удалить элемент",
            onClick: function () {
                //self.Confirm... // EUPDEV-164
                showConfirmEx("Удаление состояния", "Вы уверены, что хотите удалить состояние '" + itemData.Name + "'?", "OK", "Закрыть", itemElement)
                    .then(function () {
                        var index = self.State.indexOf(itemData);
                        if (index > -1) {
                            self.State.splice(index, 1);
                            template.remove();
                            self.ApplyStatesChanges();
                        }
                    });
                },
            });

        template.find("[data-save-changes-button]").dxButton({
            icon: "save",
            hint: "Сохранить изменения",
            disabled: !itemData.Selected,
            onClick: function () {
                itemData.State = self.Grid.state();
                self.ApplyStatesChanges().then(function () {
                    //self.Alert("Элемент '" + itemData.Name + "' успешно сохранен"); // EUPDEV-164
                    showAlertEx("Сохранение состояния", "Элемент '" + itemData.Name + "' успешно сохранен", "OK", itemElement);
                });
            }
        });

        template.find("[data-set-default-item-button]").dxButton({
            icon: "check",
            hint: "Сделать элементом по умолчанию",
            disabled: itemData.Default,
            onClick: function () {
                $.each(self.State,
                    function (index, item) {
                        item.Default = item === itemData;
                    });
                self.ApplyStatesChanges().then(function () {
                    //self.Alert("Элемент '" + itemData.Name + "' установлен как элемент по умолчанию"); // EUPDEV-164
                    showAlertEx("Изменение состояния", "Элемент '" + itemData.Name + "' установлен как элемент по умолчанию", "OK", itemElement);
                });
            }
        });
    }

    customStateDialog.prototype.BuildStatesList = function () {
        var self = this;

        return self.Service.ReceiveDxGridCustomState(self.StateKey, self.Grid.beginCustomLoading, self.Grid.endCustomLoading).then(function (state) {
            self.State = state;
            if (self.List) {
                self.List.remove();
            }

            self.List = $("<div data-grid-states-list></div>")
                .dxList({
                    items: self.State,
                    searchEnabled: true,
                    selectionMode: "none",
                    itemTemplate: function (itemData, itemIndex, itemElement) {
                        self.BuildRowTemplate(itemData, itemIndex, itemElement);
                    }
                });

            self.PopupContent.append(self.List);

            self.SaveButtonComponent.option("onClick", function () {
                var newitem = new CustomState(self.NameTextBoxComponent.option("value"), self.Grid.state());
                $.each(self.State,
                    function (index, item) {
                        item.Selected = false;
                    });
                newitem.Selected = true;
                newitem.Default = false;
                self.State.push(newitem);
                self.ApplyStatesChanges()
                    .then(function () {
                        self.NameTextBoxComponent.option("value", "");
                    });
            });

            return self.State;
        });
    }

    customStateDialog.prototype.ApplyStatesChanges = function () {
        var self = this;
        return self.Service.SaveChanges(self.StateKey, self.State, self.Grid.beginCustomLoading, self.Grid.endCustomLoading).then(function () {
            return self.BuildStatesList();
        });
    }

    customStateDialog.prototype.Init = function () {
        var self = this;
        self.BuildCreateNewPanel();
        self.BuildStatesList().then(function () {
            self.Popup.dxPopup("instance").option({
                showCloseButton: true,
                visible: true,
                position: {
                    my: "right top",
                    at: "left bottom",
                    of: self.Button.element
                }
            });
        });
    }

    return customStateDialog;
})(customState, customStateService, appendTooltip);

// сброс состояния грида
function dxGridCustomStateReset(ev) {
    new customStateService().GridCustomStateReset(ev);
}

// ================================================================================================================================
// ================================================================================================================================

//синхронизирует чекбоксы диалога выбора столбцов в соотвествии с видимыми столбцами в гриде
function dxGridColShooserSyncSelectedColumns(grid) {
    new customStateService().GridColChooserSyncSelectedColumns(grid);
}

// ================================================================================================================================
// ================================================================================================================================


// отключение разворачивания строки, если во вложенном гриде нет данных
function onDxGridCellPrepared(options) {
    if (options.rowType === "data" && options.column.command !== "expand" && options.column.command !== "select" && options.value !== undefined) {
        var html = options.value;
        if (options.data.Url && options.column.dataType !== "boolean") {
            var targetString = options.data.OpenLinksOnBlankPage ? "target='_blank'" : "";
            html = $("<div><a class='search-result-cell-value' href='" + options.data.Url + "'" + targetString + " >" + html + "</a></div>");
        } else if (options.column.cssClass == "view-in-form"){
            html = $("<div style='height: 34px;' class='btn btn-default btn-sm glyphicon glyphicon-list-alt vertical-middle hidden-xs table-edit-row-button' title='Просмотр' onclick='viewTableRow(this, event)'></div><span class='btn btn-default btn-sm visible-xs-inline-block' onclick='viewTableRow(this, event)'>Просмотр</span>");
        }
        else {
            html = $("<div><span class='search-result-cell-value'>" + html + "</span></div>");
        }

        if (options.column.cell_classes) {
            for (var i = 0; i < options.column.cell_classes.length; i++) {
                html.addClass(options.column.cell_classes[i]);
            }
        }

        options.cellElement.html(html);
    }

    if (options.rowType === "data" && options.column.command === "expand" && !options.data.Expandable) {
        options.cellElement.removeClass("dx-datagrid-expand");
        options.cellElement.empty();
    }

    if (options.rowType === "group") {
        switch (options.column.dataType) {
            case "number": {
                if (options.cellElement.find(".money").length > 0) {
                    if (options.value && options.value !== "") {
                        var spans = options.cellElement.find(".search-result-cell-value");
                        $.each(spans, function (index, element) {
                            var current = $(element);
                            var text = current.text();
                            var isNumber = !isNaN(parseFloat(text));
                            if (isNumber) {
                                current.text(formatMoney(options.value));
                            }
                        });
                    }
                    break;
                }
            }
        }
    }

    if (options.rowType === "data") {
        switch (options.column.dataType) {
            case "number": {
                if (options.cellElement.find(".double").length > 0) {
                    var j = $(options.cellElement.html());
                    var value = j.find('span').first().text();
                    if (value && value.trim() !== "" && value.indexOf(".") === -1) {
                        j.find('span').first().text(value + ".00");
                        options.cellElement.html(j);
                    }
                } else if (options.cellElement.find(".money").length > 0) {
                    if (options.value && options.value !== "") {
                        options.cellElement.find(".search-result-cell-value").text(formatMoney(options.value));
                    }
                }
                break;
            }
            case "boolean": {
                transformBooleanCellElement(options);
                break;
            }
        }
		
		if (options.column.caption == "Срок исполнения")
		{
			if (options.value && options.value !== "" && options.value.indexOf("31.12.9999") != -1)
			{
				options.cellElement.find(".search-result-cell-value").text("Бессрочно");
			}
		}
		
    }
}


function transformBooleanCellElement(option) {
    var j = $(option.cellElement.html());
    if (j.find("input").length === 0) {
        var span = j.find('span').first().empty();
        var checked = option.value === "0" ? false : true;
        $("<input type='checkbox' disabled/>").attr("checked", checked).appendTo(span);
        option.cellElement.html(j);
    }
}

function onDxGridRowPrepared(e) {
    if (e.data === undefined) {
        return;
    }

    for (var key in e.data.Classes) {
        e.rowElement.addClass(e.data.Classes[key]);
    }

    var table = $("[data-grid-id='" + e.element.attr("id") + "']").attr("data-table-path");
    e.rowElement.attr('data-row-path', table + ":" + e.data.Key);
}

// действия, выполняемые при инициализации грида
function onDxGridInitialized(e) { 
    new customStateService().GridCustomStateLoad(e);

    checkForNestedLinkGrid(e);

    e.component.option("onRowClick", function (ev) { onDxGridRowClick(ev, e.component) });
    e.component.option("onToolbarPreparing", function (ev) { onDxToolbarPreparing(ev, e.component) });
    e.component.option("onSelectionChanged", function (event) { onDxGridSelectionChanged(event, e.component) });

    var option = e.component.option();

    $.each(e.component.option().columns, function (index, columnOption) {
        e.component.columnOption(columnOption.dataField,
            {
                groupCellTemplate: function (groupCell, info) {
                    groupCellTemplate(groupCell, info);
                },

                calculateFilterExpression: function (filterValue, selectedFilterOperation) {
                    if (typeof (filterValue) == "string") {
                        filterValue = filterValue.trim();
                    }
                    // Implementation for the "between" comparison operator
                    if (selectedFilterOperation === "between" && $.isArray(filterValue)) {
                        var filterExpression = [];
                        if (filterValue[0])
                            filterExpression.push([this.dataField, ">=", filterValue[0]]);
                        if (filterValue[1])
                            filterExpression.push([this.dataField, "<=", filterValue[1]]);

                        if (filterExpression.length === 2)
                            filterExpression.splice(1, 0, "and");
                        return filterExpression;
                    } else if (this.dataType === "boolean") {
                        return [this.dataField, filterValue ? '=' : '<>', 1];
                    }

                    // Invokes the default filtering behavior
                    return this.defaultCalculateFilterExpression.apply(this, arguments);
                }
            });

        if (!option.remoteOperations) {
            e.component.columnOption(columnOption.dataField, {
                calculateSortValue: function (data) {
                    var value = this.calculateCellValue(data);
                    return value;
                }
            });
        }
        /*n.volosatov - грид ставит для колонок с типом datetime serializationFormat равный "yyyy/MM/dd", причем для одной и
        той же колонки, в одном случае может поставить правильный формат, а в другом некорректный. Закономерность не нашел. 
        Поэтому жестко задаем формат.
        */
		// Разделяем формат для datetime и nosecdatetime + проверка, чтобы не ломалась колонка действий
		if (columnOption.cell_classes != undefined) {
		
			if (columnOption.cell_classes.indexOf("nosecdatetime") !== -1) {
				columnOption.dataType = "datetime";
				columnOption.format = "dd.MM.yyyy HH:mm";
			}
			if (columnOption.dataType === "datetime") {

				e.component.columnOption(columnOption.dataField, {
						serializationFormat: "yyyy/MM/dd HH:mm:ss"
					});
			}
			
			if (columnOption.dataType === "date") {
				e.component.columnOption(columnOption.dataField, {
					serializationFormat: "yyyy/MM/dd"
				});
			}
		}
		
    });
    dxGridAddTablePath(e);

    var existingOnContentReadyHandler = e.component.option("onContentReady");
    e.component.option("onContentReady", function (ev) {

        var rowsToCollapse = e.component.option("rowsToCollapse");
        if (rowsToCollapse) {
            debugger;//ТУТ схлопываем строки!!!!
        }

        if (existingOnContentReadyHandler) {
            existingOnContentReadyHandler(ev);
        }

        addDxGridPagerButtons(e.component, e.element);
        if (!ct.utils.isLowScreenWidth()) {
            scaleWidthVisibleColumns(e.component, e.element);
        }
        
        updateCountBadge(ev);
        expandRowsIfNeeded(ev.component, ev.element);
        dxGridRemoveTitles(e.element);

        try {
            var parent = e.element.closest("tr[data-row-path]").attr('data-row-path');
            var table = $("[data-grid-id='" + e.element.attr("id") + "']").attr("data-api-table-name");
            if (parent) {
                console.log(parent + ":" + table + ":initialized");
                $(document).trigger(parent + ":" + table + ":initialized", [e.component, e.element]);
            }
            else {
                $(document).trigger(table + ":initialized", [e.component, e.element]);
            }
        }
        catch (exc) {
            console.log(exc);
        }

        // выравниваем дочерние гриды по родительскому
        dxGridSyncMasterDetailColumns(ev);
    });

    // Некорректная работа при форматировании ширины столбцов в таком случае
    //if (ct.utils.isLowScreenWidth()) {
    //    ct.dataGrid.fitColumnsWidth(e.component);
    //}

    //инвалидация грида, т.к. при первоначальной загрузке он ведет себя некорректно, а именно - не показывает текст при отсутствии данных и так до ресайза
    //костыляка для devexpress в виде updateDimensions хоть как-то решает проблему
    e.component.updateDimensions();
}

function groupCellTemplate(cellElement, cellInfo) {
    var classes = cellInfo.column.cell_classes;
    var wrapper = $("<div/>");

    var createSpanText = function (value, cssClass) {
        var span = $("<span class='search-result-cell-value'/>");
        span.html(value);
        if (cssClass)
            span.addClass(cssClass);
        return span;
    };

    wrapper.addClass(classes.join(" "));

    createSpanText(cellInfo.column.caption + ": ").appendTo(wrapper);

    var groupValueHtml = createSpanText(cellInfo.data.key);
    if (cellInfo.data.caption)
        groupValueHtml = $($.parseHTML(cellInfo.data.caption));

    groupValueHtml.appendTo(wrapper);

    if (cellInfo.data.count)
        createSpanText(" (" + cellInfo.data.count + ") ").appendTo(wrapper);

    if (cellInfo.groupContinuedMessage)
        createSpanText("(" + cellInfo.groupContinuedMessage + ")", "secondary").appendTo(wrapper);
    if (cellInfo.groupContinuesMessage)
        createSpanText("(" + cellInfo.groupContinuesMessage + ")", "secondary").appendTo(wrapper);

    cellElement.append(wrapper);
}

function checkForNestedLinkGrid(e) {

    // Для вложенных гридов в линках генерируем новый id при инициализации, иначе они подгружаются неверно (т.к. все строятся по одной модели)
    var parent = e.element.closest("tr[data-row-path]").attr('data-row-path');
    if (parent && e.element.attr("id").indexOf("links-table") !== -1)
            e.element.attr("id", "links-table-" + createGuid());
}



function dxGridAddTablePath(e) {
    var parent = e.element.closest("tr[data-row-path]").attr('data-row-path');
    var table = $("[data-grid-id='" + e.element.attr("id") + "']").attr("data-api-table-name");

    if (parent) {
        $("[data-grid-id='" + e.element.attr("id") + "']").attr("data-table-path", parent + ":" + table);
    }
    else {
        $("[data-grid-id='" + e.element.attr("id") + "']").attr("data-table-path", table);
    }
}


function expandRowsIfNeeded(component) {
    //берем все отображаемые строки
    var rows = component.getVisibleRows();

    //ключи строк, которые надо экспандить
    var expandedKeys = [];

    //ключи строк, которые являются вложенными
    var childKeys = [];
    var l = rows.length;
    for (var i = 0; i < l; i++) {
        var current = rows[i];

        if (current.data.IsExpanded)
            expandedKeys.push(current.key);

        if (current.rowType === "detail")
            childKeys.push(current.key);
    }

    //если нет вложенных видимых строк, разворачиваем те которые надо
    if (childKeys.length === 0) {
        var eLength = expandedKeys.length;
        for (var j = 0; j < eLength; j++) {
            component.expandRow(expandedKeys[j]);
        }
    }
}


// обновляем значок с количеством элементов в меню
function updateCountBadge(e) {
    var id = e.element.closest(".tab-pane").attr("id");
	var menuItem = $('[data-target="#' + id + '"]');
	var loadingSpan = menuItem.find(".loading-image-small");
	// Доп. логика, если обрабатываем гриды для вкладки "Связанные документы"
	if (id != "links-view-docs") {		
		// Для обычных гридов
		if (loadingSpan.length > 0) {
			var count = e.component.totalCount();
			loadingSpan.remove();
			menuItem.append('<span class="badge">' + count + '</span>');
			if (count == 0) {
				menuItem.parent().hide();
			} else {
				menuItem.parent().show();
			}
		}
		
	} else {
		var count = e.component.totalCount();
		if (count > 0) {
			menuItem.parent().show();
			//Показываем грид и обновляем значок только при первой загрузке
			var linksTable = $(e.element[0]).closest(".column-container");
			if (linksTable.css('display') == 'none') {
				linksTable.show();
				if ($(linksTable).prev().hasClass("column-container")) {
					$(linksTable).prev().show();
				}
				//Вместо спана загрузки подставляем количество элементов в гриде, если бадж с счетчиком уже загружен, то прибавляем к нему
				if (loadingSpan.length > 0) {
					
					loadingSpan.remove();
					menuItem.append('<span class="badge">' + count + '</span>');			
				} else {
					var badgeSpan = menuItem.find(".badge");
					if (badgeSpan.length > 0) {
						var currentCount = badgeSpan[0].textContent;
						if (!isNaN(currentCount)) {
							count += Number(currentCount);
						}
						$(badgeSpan[0]).text(count);
					}
				}
				
			}
			
			
		}
	}
    
}

// при нажатии на строку в гриде разворачиваем ее
function onDxGridRowClick(ev, grid) {
    ev.rowElement.toggleClass("dx-datagrid-wrap");
}

// изменение тулбара грида
function onDxToolbarPreparing(ev, grid) {
    addDxGridToolbarMenuItems(ev, grid);

    //если для грида разрешено отображение настроек кнопок - добавляем их в тулбар
    if (!GetGridElementBoolProperty(ev.element, "hide-grid-sett-buttons")) {
        addDxGridToolbarCustomColumnChooser(ev, grid);
        addDxGridToolbarStateItems(ev, grid);
        addCreateExportButton(ev, grid);
    }
}

//добавление кастомной кнопки для выгрузки excel
function addCreateExportButton(ev, grid) {
    ev.toolbarOptions.items.unshift(
        {
            location: "after",
            widget: "dxButton",
            options: {
                hint: "Экспортировать данные в формате Excel",
                icon: "download",
                visible: grid.option("excel_format") ? grid.option("excel_format") : 0,
                disable: true,
                onClick: function () {
                    createExportHandler(ev, grid, grid.option("excel_format"));
                }
            }
        });
    ev.toolbarOptions.items.unshift(
        {
            location: "after",
            widget: "dxButton",
            options: {
                hint: "Экспортировать данные в формате ODS",
                icon: "download",
                visible: grid.option("ods_format") ? grid.option("ods_format") : 0,
                disable: true,
                onClick: function () {
                    createExportHandler(ev, grid, grid.option("ods_format"));
                }
            }
        });
    ev.toolbarOptions.items.unshift(
        {
            location: "after",
            widget: "dxButton",
            options: {
                hint: "Добавить узел",
                icon: "repeat",
                visible: grid.option("add_roadmap") ? grid.option("add_roadmap") : 0,
                disable: false,
                onClick: function () {
                    addActivityHandler(ev, grid);
                }
            }
        });
}

function addActivityHandler(event, grid) {

    var url = grid.option("addactivity_url");
    $("#btn-ok_from_modal").unbind("click");
    console.log("handleLinkAction1");

    var openResultOnBlankPage = false;
    var useDefaultSubmit = false;
    var dontSubmit = false;
    var beforeSubmit = undefined;

    var beforeHandler = function (e, form) {
        //запоминаем текущую вкладку
        saveCurrentHash();

        if (beforeSubmit)
            return beforeSubmit(e, form);
    }


    setPreventDefault(event);

    ModalHelper({
        dialog: '#actionDialog',
        url: url,
        isTargetBlank: openResultOnBlankPage,
        beforeSubmit: beforeHandler,
        afterSubmit: undefined,
        control: null,
        event: null,
        useDefaultSubmit: useDefaultSubmit,
        dontSubmit: dontSubmit,
        keepScripts: null
    }).openWindow();
}

function createExportHandler(ev, grid, exportFormat) {
    waitingDialog.showWaiting();
    var columns = JSON.stringify(grid.state().columns);
    var loadOptionsObj = grid.getDataSource().loadOptions();
    loadOptionsObj['filter'] = grid.getCombinedFilter();
    var loadOptions = JSON.stringify(loadOptionsObj);

    var data =
    {
        'columns': columns,
        'loadOptions': loadOptions
    };

    var form = $('form').serializeArray();
    $.each(form, function (i, v) {
        var d = data[v.name];
        if (d === undefined || d === "") {
            data[v.name] = v.value;
        } else {
            data[v.name] = d + "," + v.value;
        }
    });

    var yearReq = urlParam('yearRequisite');
    var selectedYear = urlParam('selectedYear');
    var finalUrl = appendUrlArgument(grid.option("export_url"), "format", exportFormat);

    finalUrl = appendUrlArgument(finalUrl, "yearRequisite", encodeURIComponent(yearReq));
    finalUrl = appendUrlArgument(finalUrl, "selectedYear", selectedYear);

    $.ajax({
        url: finalUrl,
        type: "POST",
        cache: false,
        data: data,
        success: function (data) {
            waitingDialog.hide();
            window.location.href = getRelativeUrl("GridExport/DownloadFile?fileGuid=" + data.FileGuid + "&fileName=" + data.FileName);
        },
        error: function (error) {
            waitingDialog.hide();
            showCommonErrors([error.responseText]);
        }
    });
}

//добавление кастомной кнопки выбора столбцов
function addDxGridToolbarCustomColumnChooser(ev, grid) {
    if (GetGridElementBoolProperty(ev.element, "allow-column-chooser")) { //тут проверка на разный регистр и строковые значения "True" и "False"
        ev.toolbarOptions.items.unshift({
            location: "after",
            widget: "dxButton",
            options: {
                hint: "Выбор столбцов",
                icon: "column-chooser",
                onClick: function (btn) { dxGridCustomColumnsChooser(ev, btn); }
            }
        });
    }
}

// получение списка колонок грида для column chooser
function dxGridGetCustomChooserColumns(grid) {
    var columns = [];
    var checked = [];
    var length = grid.columnCount();
    for (var i = 0; i < length; i++) {
        var col = grid.columnOption(i);
        var dto = {
            visible: true,
            index: col.index,
            caption: col.caption,
            dataField: col.dataField
        };

        //if (col.caption !== "Действия") {
            if (col.visible) {
                checked.push(dto);
            }
            columns.push(dto);
        //}
    }

    return {
        columns: columns,
        checked: checked
    }
}

// сортировка списка колонок в column chooser
// сначала сортируется выбрана-не выбран, потом по алфавиту
function dxGridSortCustomChooserColumns(control) {
    control.beginUpdate();

    var beforeSort = control.option("items");
    var items = beforeSort.sort(function (one, two) {
        var checked1 = control.option("selectedItems").indexOf(one) !== -1;
        var checked2 = control.option("selectedItems").indexOf(two) !== -1;

        if (checked1 && !checked2) return -1;
        if (checked2 && !checked1) return 1;

        if (one.caption < two.caption) return -1;
        if (one.caption > two.caption) return 1;

        return 0;
    });
    control.option("items", items);

    control.endUpdate();
}

function appendTooltip(template, itemElement) {
    var tooltip = $("<div data-item-tooltip></div>");
    $(tooltip).dxTooltip({
        target: itemElement,
        showEvent: {
            name: "mouseenter",
            delay: 800
        },
        hideEvent: "mouseleave",
        position: "top",
        contentTemplate: function (data) {
            data.html(template);
        },
        animation: {
            show: {
                type: "pop",
                from: {
                    scale: 0.1,
                    opacity: 0
                },
                to: {
                    opacity: 1,
                    scale: 1
                }
            },
            hide: {
                type: "pop",
                from: {
                    scale: 1,
                    opacity: 1
                },
                to: {
                    opacity: 0,
                    scale: 0.1
                }
            }
        }
    });

    itemElement.append(tooltip);
    return tooltip;
}

// клик по кнопке пользовательского выбора столбцов
function dxGridCustomColumnsChooser(ev, btn) {
    var grid = ev.component;

    //инициализация popup для своего column chooser
    var popup = grid.colChooserPopup;
    if (!popup) {
        popup = grid.colChooserPopup = $("#colChooserPopup_" + ev.element[0].id).dxPopup({
            showCloseButton: true,
            visible: false,
            title: "Выбор столбцов",
            width: 350,
            height: 520,
        });
    }

    var data = dxGridGetCustomChooserColumns(grid);

    //инициализируем popup с перечнем столбцов
    var popupContent = popup.find(".dx-popup-content");
    var tooltips = popup.find("[data-item-tooltip]");
    if (popupContent.is(':empty') && !tooltips.length) {
        var listElement = document.createElement("div");
        $(listElement).addClass("grid-columns-list");

        var list = $(listElement).dxList({
            items: data.columns,
            selectionMode: "multiple",
            selectedItems: data.checked,
            showSelectionControls: true,
            itemTemplate: function (itemData, itemIndex, itemElement) {
                appendTooltip("<span>" + itemData.caption + "</span>", itemElement);
                itemElement.append("<b>" + itemData.caption + "</b>");
            },
            onSelectionChanged: function (e) {
                grid.beginUpdate();

                var length = e.addedItems.length;
                for (var i = 0; i < length; i++) {
                    grid.columnOption(e.addedItems[i].index, "visible", true);
                }

                var removedLength = e.removedItems.length;				
                for (var i = 0; i < removedLength; i++) {
					if (list._getSelectedItemIndices().length > 0) {
						grid.columnOption(e.removedItems[i].index, "visible", false);
					} else {
						list.selectItem(e.removedItems[i]);
					}
                }

                //debugger;
      
                
                grid.endUpdate();

                dxGridSortCustomChooserColumns(e.component);
                scaleWidthVisibleColumns(grid, ev.element);
                // Net6 - при вызове grid.getDataSource().load() в грид добавляется дубликат строки
                //grid.getDataSource().load();
                setTimeout(100);
                grid.refresh();
            },
            onInitialized: function (e) {
                dxGridSortCustomChooserColumns(e.component);
            }
        }).dxList("instance");

        var textElement = document.createElement("div");

        var timeoutID = null;

        $(textElement).dxTextBox({
            value: "",
            placeholder: "Поиск...",
            showClearButton: true,
            valueChangeEvent: "keyup",
            onValueChanged: function (data) {

                if (timeoutID) {
                    window.clearTimeout(timeoutID);
                    timeoutID = null;
                }

                timeoutID = window.setTimeout(function () {
                    var list = grid.colChooserList;
                    var items = list.option("items");
                    var length = items.length;

                    // фильтрация колонок в column chooser
                    for (var i = 0; i < length; i++) {
                        var item = items[i];
                        var searchQuery = data.value.toLowerCase();

                        var visible = true;
                        if (searchQuery && searchQuery.trim() !== "") {
                            visible = item.caption.toLowerCase().search(data.value.toLowerCase()) >= 0;
                        }

                        item.visible = visible;
                    }

                    list.repaint();
                }, 200);
            }
        });

        popupContent.append(textElement);
        popupContent.append(listElement);

        grid.colChooserList = list;
    }

    //делаем popup видимым
    popup.dxPopup("instance").option({
        showCloseButton: true,
        visible: true,
        position: {
            my: "right top",
            at: "left bottom",
            of: btn.element
        }
    });
}

function scaleWidthVisibleColumns(grid, gridElem) {
    if (grid.option('masterDetail') && grid.option('masterDetail').enabled) {
        return;
    }

    var total = grid.getVisibleColumns().length;
    if (total < 2) { return; }

    var column = grid.getVisibleColumns()[total - 1];
    var general_width = grid.columnOption(column.index, 'width');
    var visible_width = grid.columnOption(column.index, 'visibleWidth');

    if (general_width && StringEndsWith(general_width, "px")) {
        grid.columnOption(column.index, 'width', general_width);
        grid.columnOption(column.index, 'visibleWidth', general_width);
    }

    if (visible_width && StringEndsWith(visible_width, "px")) {
        grid.columnOption(grid.getVisibleColumns()[total - 1].index, 'width', visible_width);
        grid.columnOption(grid.getVisibleColumns()[total - 1].index, 'visibleWidth', visible_width);
    }
}


// добавление дополнительных кнопок в пэйджер
function addDxGridPagerButtons(grid, elem) {

    if (!grid.option("paging").enabled) 
        return;
    
    if (elem.find(".dx-pages").length === 0 ) 
        return;
    
    if (elem.find(".dx-pages .grid-pager-nums").length !== 0) {
        elem.find(".dx-pages .grid-pager-nums").find(".dx-numberbox").dxNumberBox("instance").option('max', grid.pageCount());
        return;
    }


    var numeric = document.createElement("div");
    var button = document.createElement("div");

    var goto = function () {
        var control = $(numeric).dxNumberBox("instance");
        var index = control.option("text") || control.option("value");
        if (index <= 0) {
            index = 1;
        }
        grid.pageIndex(index - 1);
    }

    $(numeric).dxNumberBox({
        min: 1,
        max: grid.pageCount(),
        value: grid.pageIndex() + 1,
        showSpinButtons: true,
        onKeyUp: function (ev) {
            if (ev.jQueryEvent.key === "Enter") { goto(); }
        },
        onKeyPress: function (ev) {
            var value = Number(ev.jQueryEvent.key);
            if (typeof value !== "number" || !isFinite(value) || Math.floor(value) !== value) {
                ev.jQueryEvent.preventDefault();
            }
        }
    });

    $(button).dxButton({
        icon: "spinright",
        hint: "Перейти",
        onClick: function () { goto() }
    });

    var wrapper = document.createElement("div");
    $(wrapper).addClass("grid-pager-nums");

    $(wrapper).append(numeric);
    $(wrapper).append(button);
    elem.find(".dx-pages").append(wrapper);
}

// добавление меню "действия" в тулбар
function addDxGridToolbarMenuItems(ev, grid) {
    
    if (ev.element.parent("div[data-allow-actions]").attr("data-allow-actions") !== "True") {
        return;
    }

    if (ev.element.parent("div[data-allow-selection]").attr("data-allow-selection") !== "True") {
        return;
    }
    
    var gridId = getDxGridId(ev.element);
    ev.toolbarOptions.items.unshift({
        location: "before",
        widget: "dxMenu",
        options: {
            visible: false,
            onItemClick: function (ev) {
                ev.event.stopPropagation();
                onDxGridActionClick(ev, gridId)
            },
            items: [{ text: 'Действия', id: 'root' }],
            elementAttr: { id: gridId + "-toolbar-menu" }
        }
    });
}


// добавление кнопок для управления состояниемв тулбар
function addDxGridToolbarStateItems(ev, grid) {
    var stateKey = getDxGridStateKey(ev.element);
    if (!stateKey) return;
    
    ev.toolbarOptions.items.unshift(
        {
            location: "after",
            widget: "dxButton",
            options: {
                hint: "Список состояний",
                icon: "menu",
                onClick: function (btn) {
                    var customStateDialog = new CustomStateDialog(ev, btn);
                    customStateDialog.Init();
                }
            }
        },
        {
            location: "after",
            widget: "dxButton",
            options: {
                hint: "Сбросить состояние",
                icon: "refresh",
                onClick: function () { dxGridCustomStateReset(ev.component); }
            }
        });
}


// обработка клика по элементу в меню "действия"
function onDxGridActionClick(ev, gridId) {
    if (ev.itemData.id === "root" || ev.itemData.text === "нет доступных действий") {
        return;
    }
    
    handleUrl(ev.itemData.url, ev.itemData.dialog, ev.itemData.afterSubmit, gridId);
}

// заполнения меню действия в тулбаре при изменении выбранных строк в гриде
function onDxGridSelectionChanged(ev, grid) {
    
    var menu = $("#" + getDxGridId(ev.element) + "-toolbar-menu").dxMenu("instance");

    //Отфильтровываем выделенные - удаленные строки
    var rows = ev.selectedRowsData.filter(function () {
        return grid.getSelectedRowKeys();
    });
    if (menu) {
        if (menu.lastAjaxRequest) {
            menu.lastAjaxRequest.abort();
        }

        if (rows.length > 1) {
            var isFilesTable = $(ev.element).attr("id").indexOf("files-table") !== -1;
            var isMultiEditableTable = $(ev.element).attr("id").indexOf("multieditable") !== -1;

            // Кнопка действия
            var ajaxAction = grid._options._optionManager._options.isAjax;
            if (ajaxAction) {
                var action = $(ev.element).find("div[class*='dx-actions-menu']:first");
                if (action.length) {
                    if (!$(ev.element).find("div[class*='dx-actions-menu'][data-is-ajax-act*='true']").length
						&& !$(ev.element).find("[class*='dx-datagrid-rowsview']").find("[class*='dx-menu-item'][aria-haspopup*='true']").length) {								
							ajaxAction = false;						
                    }
                }
            }

            if (ajaxAction) {
                menu.lastAjaxRequest = getContextActionsForRowsAjax(grid, menu, ev);
                return;
            } else {
                var items = getContextActionsForRows(grid, isFilesTable, isMultiEditableTable);
                menu.option("items", [{ text: 'Действия', id: 'root', items: items }]);
                menu.option("visible", true);
            }
        }
        else {
            menu.option("items", []);
            menu.option("visible", false);
        }
    }

    //Не удалять, переопределяется и используется в другом файле (create-document-link.js)
    //TODO: заменить на подписку на событие
    onDxGridSelectionChanged_CustomAction(ev, grid);
}

//Не удалять, переопределяется и используется в другом файле (create-document-link.js)
//TODO: заменить на подписку на событие
function onDxGridSelectionChanged_CustomAction(ev, grid) {
}

function dxGridRowNumberCellTemplate(container, options) {
    var rowNumber = options.row.dataIndex + 1;
    $("<div class='search-result-cell text'><a class='search-result-cell-value static'>" + rowNumber + "</a></div>").appendTo(container);
}
function dxGridRowActivityStatusCellTemplate(container, options) {
    if (typeof container.Fields !== 'undefined') {
        var field = this.dataField.replace(/^Fields./, "");
        var baseUrl = getBaseUrl();
        if(container.Fields[field] == "running") {
            return '<img src="' + baseUrl + '/Images/activityState/16-Yellow.png" title="выполняется" alt="выполняется"/>';
        }
        if (container.Fields[field] == "finish") {
            return '<img src="' + baseUrl + '/Images/activityState/16-Green.png" title="выполнен" alt="выполнен"/>';
        }

    }
    return "";    
}

function dxGridDateCellPrepare(param) {
    if (typeof param.Fields !== 'undefined') {
        var field = this.dataField.replace(/^Fields./, "");
        return param.Fields[field];
    }

    return "";
}

function loadActionAjax(docKey, gridId, container, objType) {
    // добавляем параметры searchType и searchBlock для корректной работы фильтра WhenHttpGetParamEquals
    var url = getBaseUrl() + '/Search/GetAvailableActions?docKeys=' + docKey + '&objType=' + objType + "&rnd=" + Math.random() +
        "&searchType=" + getUrlParameter('searchType') + "&searchBlock=" + getUrlParameter('searchBlock');

    $.ajax({
        url: url,
        type: 'GET',
        contentType: false,
        cache: false,
        processData: false,
    }).then(function (actions) {
        
        $(container).empty();
        if (actions && actions.length > 0) {
            var items = actions.map(function(action) {
                return {
                    text: action.Title,
                    dialog: action.Options.dialog,
                    afterSubmit: action.AfterSubmit,
                    url: joinGridActionUrl(action.Options.url,
                        "uniqueIds=" +
                        docKey +
                        "&returnUrl=" +
                        encodeURIComponent(window.location.href) +
                        (action.Options.tableId ? "&tableId=" + action.Options.tableId : ""))
                };
            });
          
            //var gridId = getDxGridId(options.component.element());

            var menuElement = $("<div class='dx-actions-menu'/>").dxMenu({
                onItemClick: function(ev) {
                    ev.event.stopPropagation();
                    onDxGridActionClick(ev, gridId);
                },
                items: [{ icon: 'menu', id: 'root', items: items }]
            });

            menuElement.find(".dx-menu-item-popout-container").remove();
            menuElement.appendTo(container);
         
            setTimeout(function() {
                $(menuElement.find(".dx-menu-item")[0]).click();
            } , 100);

            //setTimeout($(menuElement.find(".dx-menu-item")[0]).click(), 1000);
        }
       
        if (actions.length === 0) {      
            var items =[ {
                    text: "нет доступных действий",
                    dialog: "DialogWindow",
                    afterSubmit: null                  
                }];
          
            var menuElement = $("<div class='dx-actions-menu'/>").dxMenu({               
                items: [{
                    icon: 'menu', id: 'root', items:items }]
            });
            console.log(items);      
            menuElement.find(".dx-menu-item-popout-container").remove();
            menuElement.appendTo(container);
         
            setTimeout(function () {
                $(menuElement.find(".dx-menu-item")[0]).click();
            }, 100);
        }


        //var data = JSON.parse(response);
        //if (data.status === "OK") {
            
        //} else {
        //    console.error(error);
        //}
    }, function (error) {
        console.error(error);
    });
}

function dxGridRowMenuCellTemplateAjax(container, options) {
    
    //var actions = options.data.Actions;
    //var items = actions.map(function (action) {
    //    return {
    //        text: action.Title,
    //        dialog: action.Options.dialog,
    //        afterSubmit: action.AfterSubmit,
    //        url: joinGridActionUrl(action.Options.url, "uniqueIds=" + options.data.Key + "&returnUrl=" + encodeURIComponent(window.location.href) + (action.Options.tableId ? "&tableId=" + action.Options.tableId : ""))
    //    };
    //});

    //if (items.length === 0) {
    //    return;
    //}



    //var gridId = getDxGridId(options.component.element());
    //var onClickJs = 'loadActionAjax(' + options.data.Key + ',\'' + gridId + '\')';
    //var ajaxMenu = $('<i style="cursor: pointer" class="dx-icon dx-icon-menu" onclick="' + onClickJs + '"></i>');
    //ajaxMenu.appendTo(container);
    //return;


    var gridId = getDxGridId(options.component.element());
    var menuElement = $("<div class='dx-actions-menu' data-is-ajax-act='true'/>").dxMenu({
        onItemClick: function (ev) {
            ev.event.stopPropagation();
            onDxGridActionClick(ev, gridId);
        },
        items: [{ icon: 'menu', id: 'root', items: []}]
    });
    menuElement.find(".dx-menu-item-popout-container").remove();
    menuElement.appendTo(container);

    menuElement.on("click", function () {
        
        var par = menuElement.parent();
        par.empty();
        var loadingPane = $('<div style="visibility: visible;" class="loading-image-small"></div>');
        loadingPane.appendTo(par);
        loadActionAjax(options.data.Key, gridId, container, options.column.objType);

        //console.log( $( this ).text() );
    });

    //setTimeout($(menuElement.find(".dx-menu-item")[0]).click(), 1000);

    //var gridId = getDxGridId(options.component.element());

    //var menuElement = $("<div class='dx-actions-menu'/>").dxMenu({
    //    onItemClick: function (ev) {
    //        ev.event.stopPropagation();
    //        onDxGridActionClick(ev, gridId);
    //    },
    //    items: [{ icon: 'menu', id: 'root', items: items }]
    //});

    //menuElement.find(".dx-menu-item-popout-container").remove();
    //menuElement.appendTo(container);
}

// создание меню действий в строке грида. сделано в js,
// т.к. при использовании mvc wrapper возникают проблемы 
// с созданием шаблона меню для вложенных гридов :(
function dxGridRowMenuCellTemplate(container, options) {
    var actions = options.data.Actions;
    var items = actions.map(function (action) {
        return {
            text: action.Title,
            dialog: action.Options.dialog,
            afterSubmit: action.AfterSubmit,
            url: joinGridActionUrl(action.Options.url, "uniqueIds=" + options.data.Key + "&returnUrl=" + encodeURIComponent(window.location.href) + (action.Options.tableId ? "&tableId=" + action.Options.tableId : ""))
        };
    });

    if (items.length === 0) {
        return;
    }

    var gridId = getDxGridId(options.component.element());

    var menuElement = $("<div class='dx-actions-menu'/>").dxMenu({
        onItemClick: function (ev) {
            
            ev.event.stopPropagation();
            onDxGridActionClick(ev, gridId)
        },
        items: [{ icon: 'menu', id: 'root', items: items }]
    });

    menuElement.find(".dx-menu-item-popout-container").remove();
    menuElement.appendTo(container);
}


function joinGridActionUrl(url, url2) {

    var fixedUrl = url;
    if (fixedUrl) {
        if (fixedUrl.indexOf("?") !== -1)
            fixedUrl += "&";
        else
            fixedUrl += "?";
    }

    return fixedUrl + url2;
}

// получение списка действий для выбранных строк
// берутся действия, которые есть в каждой строке
function getContextActionsForRowsAjax(grid, menu, ev) {
    
    //var actions = {}; var action; var total = 0;

    //Отфильтровываем выделенные - удаленные строки
    var rows = grid.getSelectedRowsData().filter(function () {
        return grid.getSelectedRowKeys();
    });

    var keys = rows.map(function (x) { return x.Key; });// forEach(x=>x.Key)
    var keysString = keys.join(',');

    //var objTypeStr = "";
    //for (var j = 0; j < grid._options.columns.length; j++) {
     
    //    var col = grid._options.columns[j];
        
    //    if (col.caption === "Действия")
    //        objTypeStr = "&objType=" + col.objType;      
    //    }  
    var objTypeStr = "&objType=" + grid._options._optionManager._options.objType;

    // добавляем параметры searchType и searchBlock для корректной работы фильтра WhenHttpGetParamEquals
    var url = getBaseUrl() + '/Search/GetAvailableActions?docKeys=' + keysString + objTypeStr + "&rnd=" + Math.random() +
        "&searchType=" + getUrlParameter('searchType') + "&searchBlock=" + getUrlParameter('searchBlock');
    
    var req = $.ajax({
        url: url,
        type: 'GET',
        contentType: false,
        cache: false,
        processData: false,
    });

    req.then(function (actions) {
        //$(container).empty();

        if (actions && actions.length > 0) {
            var items = [];

            for (var j = 0; j < actions.length; j++) {
                var action = actions[j];

                items.push({
                    text: action.Title,
                    dialog: action.Options.dialog,
                    afterSubmit: action.AfterSubmit,
                    url: joinGridActionUrl(action.Options.url,
                        "uniqueIds=" +
                        keysString +
                        "&returnUrl=" +
                        encodeURIComponent(window.location.href) +
                        (action.Options.tableId ? "&tableId=" + action.Options.tableId : ""))
                });
            }

            menu.option("items", [{ text: 'Действия', id: 'root', items: items }]);
            menu.option("visible", true);
        }

      
        if (actions.length === 0) {         
                var items = [{
                    text: "нет доступных действий",
                    dialog: "DialogWindow",
                    afterSubmit: null
                }];

            menu.option("items", [{ text: 'Действия', id: 'root', items: items }]);
            menu.option("visible", true);
         }

        

        //Не удалять, переопределяется и используется в другом файле (create-document-link.js)
        //TODO: заменить на подписку на событие
        onDxGridSelectionChanged_CustomAction(ev, grid);
    });

    return req;
}

// получение параметра из URL
function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return typeof sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
    return false;
};

// получение списка действий для выбранных строк
// берутся действия, которые есть в каждой строке
function getContextActionsForRows(grid, isFilesTable, isMultiEditableTable) {
    
    var actions = {}; var action; var total = 0;

    //Отфильтровываем выделенные - удаленные строки
    var rows = grid.getSelectedRowsData().filter(function () {
        return grid.getSelectedRowKeys();
    });
    for (var i = 0; i < rows.length; i++) {
        for (var j = 0; j < rows[i].Actions.length; j++) {
            action = rows[i].Actions[j];

            if (isFilesTable) {
                
                if (action.Title !== 'Удалить' && !(isMultiEditableTable && action.Title === "Редактировать")) { continue; }
                
                if (action.Title in actions) {
                    actions[action.Title].keys.push(rows[i].Key);
                    var count = ++actions[action.Title].count;
                } else {
                    actions[action.Title] = { data: action, count: 1, keys: [rows[i].Key] }
                }

            } else {

                if (action.Type === 1 || action.Title === "Отложить") { continue; }

                if (action.Options.key in actions) {
                    actions[action.Options.key].keys.push(rows[i].Key);
                    var count = ++actions[action.Options.key].count;
                    //total = total > count ? total : count;
                } else {
                    actions[action.Options.key] = { data: action, count: 1, keys: [rows[i].Key] }
                    //total = total > 1 ? total : 1;
                }
            }
        }
    }

    var items = [];
    for (var key in actions) {
        action = actions[key];

        // Убрала проверку, так как при массовом выделении строк
        // отображается действие только для первой выбранной строчки.
        //if (action.count !== total) {
        //    continue;
        //}

        if (isFilesTable) {

            var urlParts = action.data.Options.url.split('uniqueIds=');
            var docId = decodeURIComponent(urlParts[1]).split('/')[0];
            var ids = '';
            for (var k = 0; k < action.keys.length; k++) {
                if (ids)
                    ids += ',';

                ids += docId + '/' + action.keys[k];
            }
            var url = urlParts[0] + 'uniqueIds=' + encodeURIComponent(ids);

            items.push({
                text: action.data.Title,
                dialog: action.data.Options.dialog,
                afterSubmit: action.data.AfterSubmit,
                url: joinGridActionUrl(url, "returnUrl=" + encodeURIComponent(window.location.href) + (action.data.Options.tableId ? "&tableId=" + action.data.Options.tableId : ""))
            });

        } else {

            items.push({
                text: action.data.Title,
                dialog: action.data.Options.dialog,
                afterSubmit: action.data.AfterSubmit,
                url: joinGridActionUrl(action.data.Options.url, "uniqueIds=" + action.keys.join() + "&returnUrl=" + encodeURIComponent(window.location.href) + (action.data.Options.tableId ? "&tableId=" + action.data.Options.tableId : ""))
            });
        }
    }

    return items;
}



function getDxGridId(e) {
    return e.parent("div[data-grid-id]").attr("data-grid-id");
}

function getDxGridStateKey(e) {
    return e.parent("div[data-state-key]").attr("data-state-key");
}

//возвращает булевый флаг в свойстве элемента
function GetGridElementBoolProperty(elem, propertyName) {
    var stringProp = elem.parent().data(propertyName);
    return $.parseJSON(stringProp.toLowerCase()); //тут проверка на разный регистр и строковые значения "True" и "False"
}

//аналог endsWith для поддержки IE. Проверяет закзачивается ли строка указанным суффиксом
function StringEndsWith(str, suffix) {
    return typeof str === 'string' && str.indexOf(suffix, str.length - suffix.length) !== -1;
}


// синхронизация родительского и дочерних гридов
function dxGridSyncMasterDetailColumns(ev) {

    var current = ev.element.dxDataGrid('instance');

    // если мастер грид
    if (current.option('masterDetail') && current.option('masterDetail').enabled && !current.option('detail-grid')) {

        var callback = function () { dxGridSyncMasterDetails(ev); };
        ev.component.getView("columnHeadersView").resizeCompleted.remove(callback);
        ev.component.getView("columnHeadersView").resizeCompleted.add(callback);
    }
    // если дочерний грид
    else if (current.option('detail-grid')) {

        var detailElement = ev.element;
        var masterElement = ev.element.closest('.dx-datagrid').parent();

        var master = masterElement.dxDataGrid('instance');
        var detail = detailElement.dxDataGrid('instance');

        if (master.columnCount() !== detail.columnCount()) return;
        if (!detail.option('detail-grid')) { return; }

        //var padding = detail.option('master-grid') && detail.option('detail-grid') ? 30 : 0;
        //dxGridSyncMasterDetailGrid(master, detail, padding);
        dxGridSyncMasterDetailGridFix(master, detail, 1);
    }
}

// синхронизация родительского и дочерних гридов
function dxGridSyncMasterDetails(ev) {
    var master = ev.element.dxDataGrid("instance");
    var containers = master.element().find('.sync-detail-grid > div');

    if (!containers.length) { return; }

    for (var j = 0; j < containers.length; j++) {
        var detail = $(containers.get(j)).dxDataGrid('instance');
        //var padding = detail.option('master-grid') && detail.option('detail-grid') ? 30 : 0;
        //dxGridSyncMasterDetailGrid(master, detail, padding);
        dxGridSyncMasterDetailGridFix(master, detail, 1);
    }
}

// синхронизация родительского и дочернего грида (жесткое выставление ширины столбцов)
function dxGridSyncMasterDetailGridFix(master, detail, slice) {

    detail.beginUpdate();

    for (var i = 0; i < master.columnCount(); i++) {
        detail.columnOption(i, 'visibleIndex', master.columnOption(i, 'visibleIndex'));

        if (detail.option('detail-grid')) {
            detail.columnOption(i, 'visible', master.columnOption(i, 'visible'));
        }
    }

    detail.endUpdate();

    // выставляем ширину столбцов в px
    var masterCols = $(master.element()).find("tr").first().children("td").slice(slice);
    var detailCols = $(detail.element()).find("colgroup").first().children("col");

    masterCols.each(function (index) {
        detailCols.eq(index).attr("style", "width: " + masterCols.eq(index).outerWidth() + "px");
    });
}

// синхронизация родительского и дочернего грида
function dxGridSyncMasterDetailGrid(master, detail, padding) {
    detail.beginUpdate();
    for (var i = 0; i < master.columnCount(); i++) {
        if (i === 0) {
            dxGridSyncMasterDetailLeadColumn(master, detail, 'width', padding);
            dxGridSyncMasterDetailLeadColumn(master, detail, 'visibleWidth', padding);
        } else {
            detail.columnOption(i, 'width', master.columnOption(i, 'width'));
            detail.columnOption(i, 'visibleWidth', master.columnOption(i, 'visibleWidth'));
        }
        detail.columnOption(i, 'visibleIndex', master.columnOption(i, 'visibleIndex'));

        if (detail.option('detail-grid')) {
            detail.columnOption(i, 'visible', master.columnOption(i, 'visible'));
        }
    }
    detail.endUpdate();
}

// синхронизация первой видимой колонки родительского и дочернего грида
function dxGridSyncMasterDetailLeadColumn(master, detail, option, padding) {
    var value = master.columnOption(0, option);

    if (!value) {
        detail.columnOption(0, option, master.columnOption(0, option));
    }

    if ($.isNumeric(value)) {
        dxGridSyncMasterDetailLeadColumnWithPixelWidth(master, detail, option, padding);
        return;
    }

    if (StringEndsWith(value, '%')) {
        dxGridSyncMasterDetailLeadColumnWithPercentWidth(master, detail, option, padding);
        return;
    }
}

// синхронизация колонки родительского и дочернего грида с шириной в пикселях
function dxGridSyncMasterDetailLeadColumnWithPixelWidth(master, detail, option, padding) {
    var value = parseFloat(master.columnOption(0, option));
    detail.columnOption(0, option, value - padding);
}

// синхронизация колонки родительского и дочернего грида с шириной в процентах
function dxGridSyncMasterDetailLeadColumnWithPercentWidth(master, detail, option, padding) {
    var str = master.columnOption(0, option);
    var value = parseFloat(str.substring(0, str.length - 1));

    detail.columnOption(0, option, Math.floor(value - padding / (detail.element().width() / 100)) + "%");
}


// обновление данных в гриде
function dxGridReloadData(gridId) {
    var grid = $('#' + gridId).dxDataGrid('instance');    
    
    //grid.getDataSource().load().done(function () {
    //    //Снимаем выделение со строк, т.к. грид все ещё хранит старое состояние о выделенных строках, даже если их уже нет (удалили)
    //    //Если по какой-то причине, это вам помешает, то можно удалить, т.к. эта проверка продублирована в методе инициализации кнопок групповых действий. Искать по коменту - "Отфильтровываем выделенные - удаленные строки".
    //    grid.clearSelection();
    //});

    //Старый код перестал работать, воспользовался новым вариантом
    grid.clearSelection();
    grid.refresh();
}

// получить число элементов в гриде
function dxGridTotalCount(gridId) {
    var grid = $('#' + gridId).dxDataGrid('instance');
    return grid.totalCount();
}

// удаляем из таблицы "лишние" тултипы - лечим баг в ie
function dxGridRemoveTitles(element) {
    var cells = element.find("tr.dx-row > td");
    for (var i = 0; i < cells.length; i++) { cells[i].title = ""; }
}

function buildFilter(el) {
    var q = "";
    if (el.columnIndex) {
        q += '["' + el[0] + '","' + el[1] + '","' + el[2] + '"]';
    } else {
        for (var i = 0; i < el.length; i++) {
            var subEl = el[i];
            if (subEl.columnIndex) {
                q += buildFilter(subEl);
                if (i<el.length) {
                    q += ",";
                }
            } else {
                q += '"' + subEl + '",';
            }
        }
    }
    return q;
}

// изменяем в фильтре для булевых столбцов значения, т.к. xnika не умеет
// обрабатывать true/false. используем вместо этого 1 и 0.
// function dxGridCalculateBooleanFilterExpression(filterValue) {
//     return [this.dataField, filterValue ? '=' : '<>', 1];
// }

//отрабатывает перед запросом на сервер, 
//проверяет параметры фильтра - не позволяет отправить на сервер html в querystring
//в данном случае парситься значение addressbook'a
function dxGridBeforeSend(operation, args) {
    if (operation === "load") {
        var grid = $("div[data-state-key='" + args.data.searchType + "']").children("div").dxDataGrid('instance');
        if (grid) {
            var columns = grid.getVisibleColumns();
            var getColumns = "";
            for (var j = 0; j < columns.length; j++) {
                var col = columns[j];
                if (col.colIndexId) {
                    getColumns += col.colIndexId + "||";                        
                }
            }
            args.data.getColumns = getColumns;
        }
    }


    if (operation === "load" && args.data && args.data.filter) {
        if (args.data.take == 1) {
            var grid = $("div[data-state-key='" + args.data.searchType + "']").children("div").dxDataGrid('instance');
            if (grid) {
                var filter = grid.getCombinedFilter();
                if (filter) {
                    var strFilter = buildFilter(filter);

                    //    "[[\"Fields.doc_RegCard/rc_Index/text_Статус\",\"=\",\"Внесение изменений\"],\"and\",[[\"Fields.doc_RegCard/rc_Index/text_Тип_договора\",\"contains\",\"Д\"],\"and\",[\"Fields.doc_RegCard/rc_Index/text_Подразделение\",\"contains\",\"А\"]]]"
                    args.data.filter = '[' + args.data.filter + ',"and",' + strFilter + ']';
                }
            }
        }


        var isHTML = function isHTML(str) {
            var a = document.createElement('div');
            a.innerHTML = str;

            for (var c = a.childNodes, i = c.length; i--;) {
                if (c[i].nodeType == 1) return true;
            }

            return false;
        };

        var processCondition = function processCondition(condition) {
            var result = condition;
            if (isHTML(condition)) {
                var element = $(condition);
                //елси типа адресбудака
                if (element.attr('address-book-item-key')) {
                    var key = element.attr('address-book-item-key');
                    result = key;
                    //если поле - статус деятельности 
                } else if (element.hasClass("activitystatus")) {
                    result = element.find("span").text();
                    //если поле название деятельности
                } else if (element.length === 2 && element.first().hasClass("search-result-activityName-image")) {
                    result = element.last().text();
                }
            }
            if (result && result.split)
                return "\"" + result.split('"').join('\\"').split("'").join('\\"') + "\"";
            else
                return result;
        };

        var processRecursive = function processRecursive(condition) {
			 if((typeof condition) === 'string')
             {
                 condition = condition.replaceAll('\\\\', '\\');
                 //condition = condition.replaceAll('\\"', '\"');
			 }
             var conditionArray = Array.isArray(condition) ? condition : eval(condition);

            var l = conditionArray.length;
            for (var index = 0; index < l; index++) {

                var current = conditionArray[index];
                if (current.replace) {
                    current = current.replace(/^\\+|\\+$/g, ''); // Удаляем \ с начала и конца строки
                }                
                if (current !== conditionArray[index] && current === "") { // Если строка оказалось пустой, то фильтруем по \
                    current = "\\\\";
                }

                if (Array.isArray(current)) {
                    conditionArray[index] = processRecursive(current);
                } else {
                    conditionArray[index] = processCondition(current);
                }
            }
            return "[" + conditionArray.toString() + "]";
        }


        args.data.filter = processRecursive(args.data.filter);
    }
}

// при показе вкладки обновляем гриды на ней, т.к. есть странные 
// "залипания" с ресайзом колонок, если грид был загружен на 
// на неактивной вкладке
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {

    var thash = $(e.target).attr('data-target');

    // для "мелких" разрешений отключаем обновление размеров вкладки с маршрутами в случае, если был развернут хотя бы один маршрут,
    // т.к. это приводит к проблемам с ширинами колонок
    if (ct.utils.isLowScreenWidth()) {
        if (thash.startsWith("#routes-view")) {
            var detailTables = $(thash).find("div[id ^='routes-detail-table-']");
            if (detailTables.length > 0)
                return;
        }
    }
    var grids = $(thash).find("div.dx-widget:has(div.dx-datagrid)");
    for (var i = 0; i < grids.length; i++) {
        $(grids[i]).dxDataGrid('instance').updateDimensions();
    }
});


// добавил проверку на вводимые символы. Только цифры для поля с выбором даты
    function onContentReady(e) {
        var cells = e.element.find('.dx-datagrid-filter-row .dx-datebox');
        if (cells.length > 0) {  
            var valInput;  
            $.each(cells, function (ind, item) {
                valInput = $(item).find('input');
                $.each(valInput,
                    function(i, input) {
                        input.setAttribute("OnKeyDown", "return checkDXKey(event.key)");
                    });
            });
        }
    }

function checkDXKey(key) {
    return (key >= '0' && key <= '9') || key == '.' || key == 'Delete' || key == 'Backspace' || key =='F5';
}

