var actionBuilder = (function () {

    function build(gridInstance) {

        //gridInstance.option("onToolbarPreparing", function (args) {
        //    var toolbarItems = args.toolbarOptions.items;
        //    toolbarItems.push({
        //        location: "after"
        //    });
        //});
        //gridInstance.option("onToolbarPreparing", function (ev) { $.getScript("\\LiteClient\\Scripts\\Content\\data-grid.js", onDxToolbarPreparing(ev, gridInstance)); });

        gridInstance.option("onToolbarPreparing", function (ev) { onDictToolbarPreparing(ev, gridInstance); });

        var columns = gridInstance.option("columns");

        gridInstance.option("columns", columns);
    }


    function onDictToolbarPreparing(ev, grid) {

        addDictToolbarCustomColumnChooser(ev, grid);
        addDxGridToolbarStateItems(ev, grid);
        grid.option("export_url", getRelativeUrl("/GridExport/ExportSuppliers?fileName=Контрагенты"));
        addCreateExportButton(ev, grid);
    }



    function addDictToolbarCustomColumnChooser(ev, grid) {
        ev.toolbarOptions.items.unshift({
                location: "after",
                widget: "dxButton",
                options: {
                    hint: "Выбор столбцов",
                    icon: "column-chooser",
                    onClick: function (btn) { dictCustomColumnsChooser(ev, btn); }
                }
        });
    }

    // получение списка колонок грида для column chooser
    function dictGetCustomChooserColumns(grid) {
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

            if (col.visible) {
                checked.push(dto);
            }
            columns.push(dto);
        }

        return {
            columns: columns,
            checked: checked
        }
    }

    // клик по кнопке пользовательского выбора столбцов
    function dictCustomColumnsChooser(ev, btn) {
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

        var data = dictGetCustomChooserColumns(grid);

        //инициализируем popup с перечнем столбцов
        var popupContent = popup.find(".dx-popup-content");
        var tooltips = popup.find("[data-item-tooltip]");
        if (popupContent.is(':empty') && !tooltips.length) {
            var listElement = document.createElement("div");
            $(listElement).addClass("grid-columns-list");

            var list = $(listElement).dxList({
                items: data.columns,
                selectionMode: "all",
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
                        grid.columnOption(e.removedItems[i].index, "visible", false);
                    }

                    grid.endUpdate();

                    dxGridSortCustomChooserColumns(e.component);
                    scaleWidthVisibleColumns(grid, ev.element);
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


    return {
        build: build
    };
}());