(function () {

    //end stateManager

    var _instance = null;
    var _stateManager = StateManager.createInstance();

    function init() {
        DevExpress.localization.locale("ru");

        var container = $("#dictionary-grid");
        _instance = container.dxDataGrid({
            editing: {
                texts: {
                    confirmDeleteMessage: ""
                }
            },
            scrolling: {
                columnRenderingMode: "virtual"
            },
            noDataText: dictionaryStrings.noDataText,
        }).dxDataGrid("instance");


        createGrid();
    }

    $(window).bind('hashchange', function () {
        createGrid();
    });

    function createGrid() {

        var promise = createDictionaryGrid();
        return promise;
    }

    function createDictionaryGrid() {
        var defer = jQuery.Deferred();

        var state = _stateManager.getState();
        state.d = "Контрагенты";
        _stateManager.setState(state);

        var url = getRelativeUrl("/Administration/GetDictionaryDetails?dictionaryName=Контрагенты&subDictionaryNames=");

        _instance.refresh();

        dictApi.callApi(url).then(function (details) {

            var columns = jQuery.map(details.attributes, function (current, index) {
                if (current.name === "code") {
                    return {
                        caption: state.d,
                        dataField: "code",
                        validationRules: [{ type: "required" }],
                        allowEditing: false,
                        allowSorting: true,
                        allowFiltering: true,
                        visible: current.visible
                    }
                }
                return {
                    caption: current.name,
                    dataField: current.name,
                    allowEditing: false,
                    allowSorting: true,
                    allowFiltering: true,
                    visible: current.visible,
                    minWidth: 10,
                };
            });

            enableGridHoverable(true);

            _instance.option("onRowClick", function (cellInfo) {
                onCustomFormClickHandler(_instance, cellInfo, state.d, details.customForm);
            });

            _instance.option("columns", columns);
            _instance.option("remoteOperations", true);
            _instance.option("paging", {
                enabled: true,
                pageIndex: 0,
                pageSize: 20
            });

            var filterRowOption = _instance.option("filterRow");
            filterRowOption.visible = true;
            _instance.option("filterRow", filterRowOption);

            actionBuilder.build(_instance);

            _instance.option("dataSource", dataSourceFactory.createDictionaryStore(_stateManager));
            defer.resolve();
        }, function(error) {
                defer.reject(error);
        });
        return defer.promise();
    }

    function enableGridHoverable(enable) {
        if (enable) {
            _instance.option("hoverStateEnabled", true);
            _instance.$element().addClass("grid-clickable");

        } else {
            _instance.option("hoverStateEnabled", false);
            _instance.$element().removeClass("grid-clickable");
        }
    }


    function onCustomFormClickHandler(gridInstance, cellInfo, dictName, customForm) {
        openCustomForm(dictName, cellInfo.data["key"], customForm).then(function (data) {
            gridInstance.beginUpdate();

            $.each(data, function (name, value) {
                gridInstance.cellValue(cellInfo.rowIndex, name, value);
            });

            gridInstance.endUpdate();
        }, function () {

        });
    }


    function openCustomForm(dictName, itemKey, customForm) {
        var formUrl = getRelativeUrl("/Dictionary/GetDictionaryForm") + "?name=" + encodeURIComponent(dictName) + "&template=" + encodeURIComponent(customForm) + "&key=" + itemKey;
        var defer = jQuery.Deferred();
        var temp = $("<div>");

        $("body").append(temp);
        var popup = temp.dxPopup({
            title: dictionaryStrings.formName,
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

    init();
})();