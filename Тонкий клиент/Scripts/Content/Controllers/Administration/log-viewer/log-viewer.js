

LogViewer = function(logViewer) {
    var _html = {
        containerId: "log-viewer-"+logViewer+"-container",
        dataGridId: "log-viewer-" + logViewer + "-datagrid",
        startSelector: "#log-viewer-" + logViewer + "-start",
        endSelector: "#log-viewer-" + logViewer + "-end",
        refreshSelector: "#log-viewer-" + logViewer + "-refresh",
        containerSelector: "#log-viewer-" + logViewer + "-container",
        dataGridSelector: "#log-viewer-" + logViewer + "-datagrid"
    };


    var _$logViewerContainer;
    var _$logViewerDataGrid;
    var _logViewerApiService;
    var _logViewer = logViewer;

    var _store;
    var _dataSource;
    var _items = [];

    function init() {
        var logViewerUrl = $(_html.containerSelector).attr("data-base-url");
        _logViewerApiService = ct.api.LogViewerApiService.create(logViewerUrl);
        _$logViewerContainer = $(_html.containerSelector).dxResponsiveBox({
            rows: [
                { ratio: 1 }
            ],
            cols: [
                { ratio: 1 }
            ]
        });

        $(_html.refreshSelector).click(function() {
            $(_html.dataGridSelector).dxDataGrid("getDataSource").reload();
        });

        _store = new DevExpress.data.CustomStore({
            key: "id",
            load: function(options) {
                var start = $(_html.startSelector).val();
                var end = $(_html.endSelector).val();
                return _logViewerApiService.getItems(_logViewer, start, end).then(function (itemsResult) {
                    _items = itemsResult;
                    return itemsResult;
                });
            },
            insert: function(item) {
                console.log("-- INSERT");
            },
            update: function(key, item) {
                console.log("-- UPDATE");
            },
            remove: function(key) {
                console.log("-- REMOVE");
            }
        });

        _dataSource = new DevExpress.data.DataSource({
            store: _store,
            pageSize: 3
        });
        DevExpress.localization.locale("ru");
        _$logViewerDataGrid = $(_html.dataGridSelector).dxDataGrid({
            grouping: {
                contextMenuEnabled: true,
                expandMode: "buttonClick",
                allowCollapsing: true
            },
            groupPanel: {
                visible: false // or "auto"
            },
            columns: [
                {
                    caption: "Имя файла",
                    dataField: "Name",
                    allowEditing: false,
                    allowGrouping: false
                },
                {
                    caption: "Папка",
                    dataField: "Folder",
                    allowEditing: false,
                    allowGrouping: true,
                    groupIndex: 0
                },
                {
                    caption: "Дата создания",
                    dataField: "Date",
                    allowEditing: false,
                    allowGrouping: false
                },
                {
                    caption: "Дата изменения",
                    dataField: "LastDate",
                    allowEditing: false,
                    allowGrouping: false
                },
                {
                    caption: "Размер",
                    dataField: "Size",
                    allowEditing: false,
                    allowGrouping: false
                },
                {
                    caption: "Действие",
                    dataField: "id",
                    cellTemplate: function(container, options) {
                        $("<div>")
                            .append($("<a>",
                                    {
                                        "href": window.location.href.replace("LogViewer", "GetFile?file=") +
                                            options.value,
                                        "title": "Скачать файл"
                                    })
                                .html("Скачать файл"))
                            .appendTo(container);
                    },
                    allowEditing: false
                }
            ],
            dataSource: _dataSource,
            scrolling: {
                mode: "infinite",
                rowRenderingMode: "virtual"
            },
            paging: {
                pageSize: 200
            },
            selection: {
                mode: "single"
            },
            repaintChangesOnly: true,
            width: "1024px"
        });
    }
    return {
        init: init
    }
};