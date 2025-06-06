(function () {

    //end stateManager

    var _instance = null;
    var _stateManager = StateManager.createInstance();

    function makeBreadcrumps() {
        var breadcrumpsList = $("#dictionary-breadcrumb");
        breadcrumpsList.empty();
        var items = _stateManager.getBreadcrumpsItems();

        $.each(items, function (index, item) {
            var isLast = index === items.length - 1;

            var li = null;
            if (isLast) {
                li = $("<li/>").addClass("breadcrumb-item active").text(item.name);
            } else {
                li = $("<li/>").addClass("breadcrumb-item");
                $("<a href='javascript:' />").text(item.name).on("click", function () {
                    _stateManager.setState(item.state);
                }).appendTo(li);
            }

            breadcrumpsList.append(li);
        });
    }

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



        createGrid().then(function () {
            makeBreadcrumps();
        });
    }

    $(window).bind('hashchange', function () {
        createGrid().then(function () {
            makeBreadcrumps();
        });
    });

    function createGrid() {
        var state = _stateManager.getState();
        var promise = state.d ? createDictionaryGrid() : createDictionariesGrid();
        return promise;
    }

    function createDictionariesGrid() {
        var defer = jQuery.Deferred();
        var promise = dictApi.callApi(getRelativeUrl("/Administration/GetDictionaryList"));

        _instance.refresh();

        promise.then(function (names) {
            _instance.option("columns", [{
                caption: dictionaryStrings.dictionaryColumnName,
                dataField: "name"
            }]);

            var editingOptions = _instance.option("editing");
            editingOptions.allowAdding = false;
            _instance.option("editing", editingOptions);

            var filterRowOption = _instance.option("filterRow");
            filterRowOption.visible = true;
            _instance.option("filterRow", filterRowOption);

            _instance.option("onToolbarPreparing", null);

            _instance.option("dataSource", jQuery.map(names, function (current, index) {
                return { name: current };
            }));

            enableGridHoverable(true);

            _instance.option("onRowClick", function (e) {
                var state = _stateManager.getState();
                state.d = e.data['name'];
                _stateManager.setState(state);
            });

            defer.resolve();
        }, function (error) {
            defer.reject(error);
        });
        return defer.promise();
    }

    function createDictionaryGrid() {
        var defer = jQuery.Deferred();

        var state = _stateManager.getState();
        var url = getRelativeUrl("/Administration/GetDictionaryDetails");
        url += _stateManager.toQueryString(state);

        _instance.refresh();

        dictApi.callApi(url).then(function (details) {

            var columns = jQuery.map(details.attributes, function (current, index) {
                if (current.name === "code") {
                    return {
                        caption: state.d,
                        dataField: "code",
                        validationRules: [{ type: "required" }],
                        allowSorting: false,
                        allowFiltering: true,
                        visible: current.visible
                    }
                }
                return {
                    caption: current.name,
                    dataField: current.name,
                    allowSorting: false,
                    allowFiltering: true,
                    visible: current.visible,
                    minWidth: 10,
                };
            });

            enableGridHoverable(true);

            if (details.subDictionaries.length === 0) {
                enableGridHoverable(false);
                _instance.option("onRowClick", function () { });
            } else if (details.subDictionaries.length === 1) {
                _instance.option("onRowClick", function (e) {
                    state.p.push(
                        {
                            key: e.data["key"],
                            code: e.data["code"]
                        }
                    );
                    state.s.push(details.subDictionaries[0]);
                    _stateManager.setState(state);
                });
            } else {
                _instance.option("onRowClick", function (e) {
                    selectSubDictionary(details.subDictionaries).then(function (value) {
                        state.p.push(
                            {
                                key: e.data["key"],
                                code: e.data["code"]
                            }
                        );
                        state.s.push(value);
                        _stateManager.setState(state);
                    }, function () {

                    });
                });
            }
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

            actionBuilder.build(_instance, details, _stateManager);



            _instance.option("dataSource", dataSourceFactory.createDictionaryStore(_stateManager));
            defer.resolve();
        }, function (error) {
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

    function selectSubDictionary(subDictionaries) {
        var defer = jQuery.Deferred();

        var temp = $("<div>");
        $("body").append(temp);
        var popup = temp.dxPopup({
            width: 300,
            height: "auto",
            title: dictionaryStrings.subdictionariesSelectDialogTitle,
            position: "center",
            resizeEnabled: false,
            visible: false,
            showCloseButton: false,

            contentTemplate: function (contentElement) {
                var radiobuttonContainers = $("<div/>").dxRadioGroup({
                    items: subDictionaries,
                    value: subDictionaries[0]
                });

                var radioGroupInstance = radiobuttonContainers.dxRadioGroup("instance");

                var buttonContainerElement = $("<div />").addClass("popup-buttons-container");
                buttonContainerElement.append(
                    $("<div />").addClass("popup-button").dxButton({
                        stylingMode: "contained",
                        text: dictionaryStrings.subdictionariesSelectDialogOk,
                        type: "success",
                        width: 100,
                        onClick: function () {
                            defer.resolve(radioGroupInstance.option("value"));
                            popup.hide();
                        }
                    }),
                    $("<div />").addClass("popup-button").dxButton({
                        stylingMode: "contained",
                        text: dictionaryStrings.subdictionariesSelectDialogCancel,
                        type: "normal",
                        width: 100,
                        onClick: function () {
                            defer.reject();
                            popup.hide();
                        }
                    })
                );
                contentElement.append($("<div />"), radiobuttonContainers, buttonContainerElement);
            },
        }).dxPopup("instance");
        popup.show();
        return defer.promise();
    }


    init();
})();