var actionBuilder = (function () {

    function build(gridInstance, details, stateManager) {
        var hasCustomForm = details.customForm && details.customForm.trim() !== "";

        if (!hasCustomForm) {
            var editingOptions = gridInstance.option("editing");
            editingOptions.mode = "form";
            editingOptions.allowAdding = details.canCreate;
            gridInstance.option("editing", editingOptions);
            gridInstance.option("onToolbarPreparing", null);
        } else {
            if (details.canCreate) {
                gridInstance.option("onToolbarPreparing", function (args) {
                    var toolbarItems = args.toolbarOptions.items;
                    toolbarItems.push({
                        widget: "dxButton",
                        options: {
                            icon: "add",
                            onClick: function () {
                                openCustomForm(stateManager.getState().d, "", details.customForm).then(function (data) {
                                    gridInstance.beginUpdate();
                                    gridInstance.addRow();
                                    gridInstance.endUpdate();

                                    gridInstance.beginUpdate();
                                    $.each(data, function (name, value) {
                                        gridInstance.cellValue(0, name, value);
                                    });

                                    gridInstance.endUpdate();

                                    gridInstance.saveEditData().then(function () {
                                    }, function () {
                                        gridInstance.deleteRow(0);
                                    });
                                }, function () {

                                });
                            }
                        },
                        location: "after"
                    });
                });
            } else {
                gridInstance.option("onToolbarPreparing", function (args) {
                    args.toolbarOptions.items.pop();
                });
            }
        }

        var columns = gridInstance.option("columns");

        var column = createActionColumn(gridInstance, details.canDelete, details.canEdit ? function (grid, cellInfo) {
            if (hasCustomForm)
                onCustomFormClickHandler(grid, cellInfo, stateManager.getState().d, details.customForm);
            else
                onStandardFormClickHandler(grid, cellInfo);

        } : null);
        columns.push(column);
        gridInstance.option("columns", columns);
    }

    function onStandardFormClickHandler(gridInstance, cellInfo) {
        gridInstance.editRow(cellInfo.rowIndex);
    }

    function onCustomFormClickHandler(gridInstance, cellInfo, dictName, customForm) {
        openCustomForm(dictName, cellInfo.data["key"], customForm).then(function (data) {
            gridInstance.beginUpdate();

            $.each(data, function (name, value) {
                gridInstance.cellValue(cellInfo.rowIndex, name, value);
            });
            gridInstance.saveEditData();

           gridInstance.endUpdate();
        }, function () {

        });
    }

    function createActionColumn(gridInstance, canDelete, editCallback) {
        return {
            caption: "",
            allowEditing: false,
            formItem: {
                visible: false
            },
            width: 100,
            cellTemplate: function (cellElement, cellInfo) {
                var container = $("<div class='dx-command-edit dictionary-item-commands'></div>");

                if (editCallback) {
                    var editBtn = $("<div/>").dxButton({
                        icon: "edit",
                        type: "normal",
                        onClick: function (args) {
                            args.event.stopPropagation();
                            editCallback(gridInstance, cellInfo);
                        }
                    });
                    container.append(editBtn);
                }

                if (canDelete) {
                    var removeBtn = $("<div/>").dxButton({
                        icon: "remove",
                        type: "normal",
                        onClick: function (args) {
                            args.event.stopPropagation();
                            confirmDelete().then(function () {
                                gridInstance.deleteRow(cellInfo.rowIndex);
                            });
                        }
                    });
                    container.append(removeBtn);
                }
                return container;
            }
        }
    }

    function confirmDelete() {
        var defer = jQuery.Deferred();

        var temp = $("<div>");
        $("body").append(temp);
        var popup = temp.dxPopup({
            width: 320,
            height: 135,
            showTitle: false,
            position: "center",
            resizeEnabled: false,
            visible: false,
            showCloseButton: false,

            contentTemplate: function (contentElement) {
                var text = $("<p/>").text(dictionaryStrings.deleteItemConfirmDialogText);
                var buttonContainerElement = $("<div />").addClass("popup-buttons-container").css("width", "200px");
                buttonContainerElement.append(
                    $("<div />").addClass("popup-button").dxButton({
                        stylingMode: "contained",
                        text: dictionaryStrings.deleteItemConfirmDialogOk,
                        onClick: function () {
                            defer.resolve();
                            popup.hide();
                        }
                    }),
                    $("<div />").addClass("popup-button").dxButton({
                        stylingMode: "contained",
                        text: dictionaryStrings.deleteItemConfirmDialogCancel,
                        onClick: function () {
                            defer.reject();
                            popup.hide();
                        }
                    })
                );
                contentElement.append($("<div />"), text, buttonContainerElement);
            },
        }).dxPopup("instance");
        popup.show();
        return defer.promise();
    }

    function openCustomForm(dictName, itemKey, customForm) {
        var formUrl = getRelativeUrl("/Dictionary/GetDictionaryForm") + "?name=" + encodeURIComponent(dictName) + "&template=" + encodeURIComponent(customForm) + "&key=" + itemKey;
        var defer = jQuery.Deferred();
        var temp = $("<div>");

        $("body").append(temp);
        var popup = temp.dxPopup({
            title: dictionaryStrings.customEditFormTitle,
            position: "center",
            resizeEnabled: false,
            visible: false,
            showCloseButton: false,

            contentTemplate: function (contentElement) {
                var scrollView = $("<div/>");

                var loadingPanelElement = $("<div/>").dxLoadPanel({
                    visible: false
                });

                var loadingPanel = loadingPanelElement.dxLoadPanel("instance");

                var formBody = $("<div/>");

                var buttonContainerElement = $("<div />").addClass("popup-buttons-container dictionary-item-form-buttons").hide();

                buttonContainerElement.append(
                    $("<div />").addClass("popup-button").dxButton({
                        stylingMode: "contained",
                        text: dictionaryStrings.customEditFormSaveText,
                        type: "success",
                        width: 125,
                        onClick: function () {
                            var jForm = $(".dictionary-item-form").first();

                            var withoutUpdateElement = jForm.find("input[name='doUpdate']");
                            if (withoutUpdateElement.length === 0) {
                                $("<input type='hidden' value='false' name='doUpdate'>").appendTo(jForm);
                            }

                            jForm.parsley().whenValidate().then(function () {

                                loadingPanel.option("message", dictionaryStrings.customEditFormSavingText);
                                loadingPanel.show();
                                scrollView.dxScrollView("instance").scrollTo(loadingPanelElement);

                                ajaxFormSubmit(jForm[0], function (data) {
                                    var obj = JSON.parse(data);
                                    popup.hide();
                                    temp.remove();
                                    defer.resolve(obj);
                                }, function (data) {
                                    console.error(data);
                                    Ext.Msg.alert("Ошибка", data.responseText);
                                }, function () {
                                    loadingPanel.hide();
                                });
                            });
                        }
                    }),

                    $("<div />").addClass("popup-button").dxButton({
                        stylingMode: "contained",
                        text: dictionaryStrings.customEditFormCancelText,
                        type: "normal",
                        width: 100,
                        onClick: function () {
                            defer.reject();
                            popup.hide();
                            temp.remove();
                        }
                    })
                );

                scrollView.append($("<div />"), formBody, loadingPanelElement, buttonContainerElement);
                contentElement.append(scrollView);

                scrollView.dxScrollView({
                    height: '100%',
                    width: '100%',
                });


                loadingPanel.option("message", dictionaryStrings.customEditFormLoadingText);
                loadingPanel.show();
                console.log(formUrl);
                formBody.load(formUrl, function (response, status, xhr) {
                    loadingPanel.hide();

                    var resposeElement = $(response);
                    if (resposeElement.find(".application-errors").length > 0 || resposeElement.find("input[name='login']").length > 0) {
                        formBody.hide();
                        window.location = formUrl;
                    } else {
                        buttonContainerElement.show();
                        enableToolTips();
                        updateDatepickers();
                        fillDictDisplayValues();
                        bindDictionaryDisplayField();
                        addParsleyValidation(".dictionary-item-form");
                    }
                });
            },
        }).dxPopup("instance");

        var bodyOverflow = $("body").css("overflow");
        popup.on("showing", function () {
            $("body").css("overflow", "hidden");
        });

        popup.on("hiding", function () {
            $("body").css("overflow", bodyOverflow);
        });

        popup.show();



        return defer.promise();
    }

    return {
        build: build
    };
}());