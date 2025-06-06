//грид
function AttachmentGrid() {
    //константы
    this._fileNameColumn = "AttachmentFileName";
    this._keyColumnName = "KeyColumn";
    this._extensionColumnName = "ExtensionFileName";
    this._categoryColumnName = "Category";
    this._clientGuidColumnName = "AttachmentClientGuid";
    this._requiredFields = [this._fileNameColumn, this._categoryColumnName];

}

AttachmentGrid.prototype = {
    _gridInstance: null,
    _categories: null,
    _errorElement: null,
    _invalidRowsKeys: [],
    _currentCategory: null,

    init: function (element, columnDefinition, categories, errorElement, currentCategory) {        
        var self = this;

        var columnOptions = this._getColumns(columnDefinition);

        element.dxDataGrid({       
            allowColumnReordering: true,
            allowColumnResizing: true,
            columns: columnOptions,
            dataSource: [],
            editing: {
                allowDeleting: false,
                allowUpdating: true,
                mode: "cell",
                texts: {
                    confirmDeleteMessage: null
                }
            },
            paging: {
                enabled: false
            },
            //onRowValidating: function (e) {
            //    self._onRowValidating(e);
            //},
            onRowRemoving: function (e) {                
                self._onRowRemoving(e);
            },
            // Проводим полную валидацию после любых изменений
            onRowRemoved: function (e) {
                self._validateAll(e);  
            },
            onRowInserted: function (e) {
                self._validateAll(e);
            },
            onRowUpdated: function (e) {
                self._validateAll(e);
            },
            onEditorPrepared: function (e) {
                self._onEditorPrepared(e);
            },
            onEditorPreparing: function (e) {
                if (e.parentType == 'dataRow') {
                    // валидация при потере фокуса редактируемой ячейки
                    e.editorOptions.onFocusOut = function (args) {
                        self._validateAll(e);
                    }
                }
            },
            noDataText: "Файлы не выбраны",
            sorting: {
                mode: "none"
            },
            scrolling: {
                mode: "standard"
            }            

        });

        this._categories = categories;
        this._gridInstance = element.dxDataGrid("instance");
        this._errorElement = errorElement;
        this._currentCategory = currentCategory;
        this.onValidating = null;
        this.onRemoving = null;
        this.isValid = true;
    },    

    _getColumns: function _getColumns(columnDefinitions) {
        var columnOptions = [];

        //колонка содержащая индекс файла, необходима для последующего удаления файла с формы
        columnOptions.push({
            dataField: this._keyColumnName,
            caption: this._keyColumnName,
            visible: false,
            allowResizing: false,
            allowReordering: false,
            allowEditing: false,
        });

        //колонка содержащая оригинальное имя файла
        columnOptions.push({
            dataField: this._extensionColumnName,
            caption: this.__extensionColumnName,
            visible: false,
            allowResizing: false,
            allowReordering: false,
        });
        columnOptions.push({
            dataField: this._clientGuidColumnName,
            caption: this._clientGuidColumnName,
            visible: false,
            allowResizing: false,
            allowReordering: false
        });

        if (!columnDefinitions || !columnDefinitions.length || columnDefinitions.length === 0)
            return columnOptions;

        var l = columnDefinitions.length;

        for (var i = 0; i < l; i++) {
            var current = columnDefinitions[i];

            if (current.key == this._clientGuidColumnName)
                continue;

            var option = {
                dataField: current.key,
                caption: current.header,
                dataType: current.dataType,
                allowSorting: false,
                allowEditing:  true,
                allowResizing: true,
                allowReordering: false,
                minWidth: "40",
                editReadonly: current.editReadonly,
                isEmptyValue: current.isEmptyValue,
                defaultValue: current.defaultValue
            };

            if (current.isRequired) {
                this._requiredFields.push(current.key);
            }

            // встроенная валидация грида
            // выключена, т.к. ломала механизм добавления файлов (см. https://cgnjira.cognitive.ru:8443/browse/EUPDEV-4163)
            /*
            if (this._requiredFields.indexOf(current.key) !== -1) {
                option["validationRules"] = [
                    { type: "required" }
                ];
            }
            */

            if (current.values && current.values.length > 0) {
                option["encodeHtml"] = false;
                option["customizeText"] = function (cellInfo) {
                    if (cellInfo.value) {
                        return cellInfo.value;
                    } else {
                        return '<span style="color: #999999">Выбрать..</span>';
                    }
                };

                this._bindColumnPossibleValues(option, current.values);
                if (option.dataField === this._categoryColumnName && (!current.values || current.values.length < 2)) {
                    option["visible"] = false;
                }
            }
            columnOptions.push(option);
        }

        columnOptions.push({
            cellTemplate: function (container, options) {
                $('<div class="glyphicon glyphicon-remove-circle" style="cursor:pointer"/>').on('dxclick', function () {
                    options.component.deleteRow(options.rowIndex);
                })
                    .appendTo(container);
            },
            width: "40",
            allowResizing: false,
            allowReordering: false,
        });

        return columnOptions;
    },

    //заполнение возможных значений колонок
    _bindColumnPossibleValues: function _bindColumnPossibleValues(targetColumn, values) {
        var l = values.length;
        var data = [];
        for (var i = 0; i < l; i++) {
            var currentValue = values[i];
            data.push({ id: currentValue.id, name: currentValue.name });
        }

        //если нет значений, делаем это поле необязательным
        var isInvalid = l == 1 && !data[0].id;
        if (isInvalid)
            targetColumn["validationRules"] = [];

        var store = new DevExpress.data.ArrayStore({
            key: "id",
            data: data
        });

        targetColumn["lookup"] = {
            dataSource: store,
            valueExpr: "id",
            displayExpr: "name"
        };
        
        if (targetColumn.dataField !== this._categoryColumnName) {
            targetColumn["editorOptions"] = {
                acceptCustomValue: !targetColumn.editReadonly, 
                searchEnabled: true,
                displayCustomValue: true,
                onCustomItemCreating: function (args) {
                    if (window.isNullOrWhiteSpace(args.text))
                        return null;

                    var newItem = {};
                    newItem.id = newItem.name = args.text;
                    store.insert(newItem);
                    return newItem;
                },
                itemTemplate: function (data) {
                    return "<div title='" + data.name + "'>" + data.name + "</div>";
                }  
            };
        }
    },

    _onRowValidating: function (e) {
        if (!e.isValid) {
            this._invalidRowsKeys.push(e.newData.__KEY__);
        } else {
            this._invalidRowsKeys = this._invalidRowsKeys.filter(function(rowKey) {
                rowKey !== e.newData.__KEY__;
            });
        }

        var rowIndex = e.component.getRowIndexByKey(e.key);
        var data = e.component.getVisibleRows()[rowIndex].data;
        this._validate(e, data[this._keyColumnName], data[this._fileNameColumn], data[this._extensionColumnName], data[this._categoryColumnName], rowIndex);

        if (this.onValidating)
            this.onValidating();
    },
    _onRowRemoving: function (e) {
        var fileKey = e.data[this._keyColumnName];        
        var clientGuid = e.data[this._clientGuidColumnName];
        this._subtractError(fileKey);
        this._subtractError(fileKey + "_name");
		this._subtractError(fileKey + "_EmptyColumn");

        if(this.onRemoving)
            this.onRemoving(fileKey, clientGuid);
        
        if (this.onValidating)
            this.onValidating();
    },

    _onEditorPrepared: function (options) {
        if (options.lookup) {
            var self = this;
            options.editorElement.dxSelectBox('instance').option('onValueChanged', function (e) {
                options.setValue(e.value);
                self._gridInstance.closeEditCell();
            });
        }
    },

    addFile: function (fileKey, originFileName) {
        var deferred = $.Deferred();        
        var filterColumn = window.location.pathname.toLowerCase().indexOf("/BasedOn".toLowerCase()) !== -1 && 
                          $("#actionDialog").is(":visible") && 
                          window.filterGridColumnEnabled;

        this._gridInstance.saveEditData();
        this._gridInstance.addRow();
		
        var rows = this._gridInstance.getVisibleRows();
        var rowIdx = 0;

        for (var i = 0; i < rows.length; i++) {
            if (rows[i].isEditing) {
                rowIdx = i;
				break;
            }
        }

        var nameParts = originFileName.split('.');
        var nameWithoutExtension = nameParts.slice(0, -1).join();
        var ext = nameParts[nameParts.length - 1];

        this._gridInstance.cellValue(rowIdx, this._keyColumnName, fileKey);
        this._gridInstance.cellValue(rowIdx, this._extensionColumnName, ext); 
        this._gridInstance.cellValue(rowIdx, this._fileNameColumn, nameWithoutExtension);
        
        var guid = createGuid();
        window.fileKeys = guid;
        this._gridInstance.cellValue(rowIdx, this._clientGuidColumnName, guid);

        var columns = this._gridInstance.getVisibleColumns();
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (column.dataField != this._keyColumnName &&
                column.dataField != this._extensionColumnName &&
                column.dataField != this._fileNameColumn &&
                //column.dataField != this._categoryColumnName && 
                column.dataField != this._clientGuidColumnName) {
                if (this._gridInstance.cellValue(rowIdx, column.dataField) == null && column.lookup) {
                    if (filterColumn && column.dataField == window.filterGridColumn)
                        this._gridInstance.cellValue(rowIdx, column.dataField, window.filterGridColumnValue);
                    else
                        this._gridInstance.cellValue(rowIdx, column.dataField, column.isEmptyValue ? null : (column.defaultValue ? column.defaultValue : column.lookup.items[0].name));
                }
                if (this._gridInstance.cellValue(rowIdx, column.dataField) == null && column.dataType == "boolean") 
                    this._gridInstance.cellValue(rowIdx, column.dataField, column.isEmptyValue ? false : (column.defaultValue ? column.defaultValue.toLowerCase() == "true" : false));
            }
        }

        var category = this._categories.length > 0 ? this._categories[0].name : null;
        if (this._currentCategory != null) {
            category = this._currentCategory.name;
        }
        // необходимо установить значение категории, если оно не соответствует открытой вкладке
        var currentCategoryVal = this._gridInstance.cellValue(rowIdx, this._categoryColumnName);
        if (category && (currentCategoryVal == null || currentCategoryVal != category)) {
            this._gridInstance.cellValue(rowIdx, this._categoryColumnName, category);
        }

        this._gridInstance.saveEditData();
        this._gridInstance.refresh();
        this._gridInstance.closeEditCell();

        //this._validate(fileKey, originFileName, ext, category, rowIndex);

        return deferred.promise();
    },
    getFileProps: function (fileKey) {
        var columns = this._gridInstance.getVisibleRows();
        var l = columns.length;
        for (var i = 0; i < l; i++) {
            var current = columns[i];
            if (current.key[this._keyColumnName] === fileKey) {
                var copy = JSON.stringify(jQuery.extend(current.key, current.data));
                copy = JSON.parse(copy);
                copy[this._fileNameColumn] = copy[this._fileNameColumn] + "." + copy[this._extensionColumnName];
                delete copy["__KEY__"];
                delete copy[this._keyColumnName];
                delete copy[this._extensionColumnName];
                return copy;
            }
        }
        return null;
    },
    _validateAll: function (e)
    {
        var self = this;
        var rows = e.component.getVisibleRows();

        for (var i = 0; i < rows.length; i++) {
            var data = rows[i].data;
            self._validate(e, data[self._keyColumnName], data[self._fileNameColumn], data[self._extensionColumnName], data[self._categoryColumnName], i + 1);
        }

        if (this.onValidating)
            this.onValidating();
    },
    _validate: function (e, fileKey, fileName, extension, categoryName, rowIndex) {

        var rows = this._gridInstance.getVisibleRows();
        rows.forEach(function(row) {
            var validator = null;

            try {
                if (row.rowType == "detailAdaptive")
                    validator = $(e.editorElement).dxValidator("instance");
                else
                    validator = $(e.editorElement).parent().parent().dxValidator("instance");
            }
            catch (e) {

            }

            if (validator)
                validator.validate();
        });

        if (this._requiredFields.indexOf(this._fileNameColumn) !== -1) {
            var isValidName = fileName && fileName.trim() !== "";
            if (!isValidName) {
                window.files = "";
                window.fileKeys = "";
                this._appendError(fileKey + "_name",
                    "В строке " + rowIndex + " поле \"Имя файла\" не может быть пустым");
            } else {
                this._subtractError(fileKey + "_name");
            }
        }

        var columns = this._gridInstance.getVisibleColumns();
		var isValidEmptyColumn = true;
		var isValidEmptyColumnErrorText="";
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            if (this._requiredFields.indexOf(column.dataField) !== -1) {
                if (column.isEmptyValue) {
                    var nRows = this._gridInstance.getVisibleRows();
                    nRows.forEach(function(row) {
                        if (!row.cells[i].value && row.data.KeyColumn === fileKey) {
                            isValidEmptyColumn = false;
                            isValidEmptyColumnErrorText =
                                "В строке " + rowIndex + " поле \"" + column.caption + "\" не может быть пустым";
                        }
                    });
                }
            }
        }
		
		 if (!isValidEmptyColumn) {
            window.files = "";
            window.fileKeys = "";
			this._subtractError(fileKey + "_EmptyColumn");
            this._appendError(fileKey + "_EmptyColumn", isValidEmptyColumnErrorText);
        } else {
            this._subtractError(fileKey + "_EmptyColumn");
        }

        if (categoryName && isValidName) {
            var isValid = true;

            var category = this.getCategory(categoryName);
            var extensions = category.allowedExtensions;
            if (extensions && extensions.length > 0) {
                if (extension) {
                    extension = extension.toLowerCase();
                }

                isValid = extensions.indexOf(extension) !== -1;
            }

            if (!isValid) {
                window.files = "";
                window.fileKeys = "";
                var text = "Недопустимое расширение файла \"" + fileName + "." + extension + "\" для категории \"" + categoryName + "\"";
                this._appendError(fileKey, text);
            } else {
                this._subtractError(fileKey);
            }
        }
    },
    isRowsValid: function() {
        return !this._invalidRowsKeys.length;
    },
    getCategory: function (name) {
        var l = this._categories.length;
        for (var i = 0; i < l; i++) {
            var current = this._categories[i];
            if (current.name === name)
                return current;
        }

        return null;
    },
    //удаление ошибки
    _subtractError: function (errorKey) {

        var hasAnyErrors = true;
        if (this._errorElement.hasClass("hide"))
            hasAnyErrors = false;
        else {
            var errorsListElement = this._errorElement.find("ul");
            if (errorsListElement.length === 0) {
                this._errorElement.empty();
                this._errorElement.addClass("hide");
                hasAnyErrors = false;
            } else {
                this._errorElement.find("[data-error-key='" + errorKey + "']").remove();

                if (errorsListElement.children().length === 0) {
                    this._errorElement.empty();
                    this._errorElement.addClass("hide");
                    hasAnyErrors = false;
                }
            }
        }
        if (!hasAnyErrors) {
            this.isValid = true;
            this._toogleNavLink(false);
        }
    },
    //добавление ошибки
    _appendError: function (errorKey, text) {
        if (this._errorElement.hasClass("hide")) {
            this._errorElement.removeClass("hide");
        }

        var errorsListElement = this._errorElement.find("ul");
        if (errorsListElement.length === 0) {
            errorsListElement = $("<ul>");
            this._errorElement.append(errorsListElement);
        }

        var itemElement = errorsListElement.find("[data-error-key='" + errorKey + "']");
        if (itemElement.length === 0) {
            itemElement = $("<li data-error-key='" + errorKey + "'>");
            errorsListElement.append(itemElement);
        }

        itemElement.html(text);
        this.isValid = false;
        this._toogleNavLink(true);
    },

    _toogleNavLink: function (isError) {
        
        var currentContent = this._errorElement.parents(".tab-pane.active");

        if (currentContent.length === 0) {
            
            currentContent = this._errorElement.parents(".tab-pane");
        }

        if (currentContent.length > 0) {
            var id = currentContent.attr("id");
            var navLink = $("a[data-target='#" + id + "']");
            if (isError) {
                navLink.addClass("tab-has-error");
                if (!navLink.parent().hasClass("active"))
                    navLink.click();
            }
            else
                navLink.removeClass("tab-has-error");
        }
    }
};