
FullDeputyViewer = function (logViewer) {
    var _html = {
        containerId: "log-viewer-" + logViewer + "-container",
        dataGridId: "log-viewer-" + logViewer + "-datagrid",
        startSelector: "#log-viewer-" + logViewer + "-start",
        endSelector: "#log-viewer-" + logViewer + "-end",
        refreshSelector: "#log-viewer-" + logViewer + "-refresh",
        containerSelector: "#log-viewer-" + logViewer + "-container",
        dataGridSelector: "#log-viewer-" + logViewer + "-datagrid",
        jsonInput: "#log-viewer-json-" + logViewer
    };


    var _$logViewerContainer;
    var _$logViewerDataGrid;
    var _logViewer = logViewer;

    var _store;
    var _dataSource;
    var _items = [];


    function init() {

        _$logViewerContainer = $(_html.containerSelector).dxResponsiveBox({
            rows: [
                { ratio: 1 }
            ],
            cols: [
                { ratio: 1 }
            ]
        });
        _dataSource = JSON.parse($(_html.jsonInput).val());;
       
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
                    caption: "Тип",
                    dataField: "Type",
                    allowEditing: false,
                    allowGrouping: true

                },
                {
                    caption: "Сотрудник",
                    dataField: "Person",
                    allowEditing: false,
                    allowGrouping: true

                }
                ,
                {
                    caption: "Роль",
                    dataField: "Role",
                    allowEditing: false,
                    allowGrouping: true

                },
                {
                    caption: "Дата начала замещения",
                    dataField: "DateFrom",
                    allowEditing: false,
                    allowGrouping: true

                }
                ,
                {
                    caption: "Дата окончания замещения",
                    dataField: "DateTo",
                    allowEditing: false,
                    allowGrouping: true

                }

            ],
            dataSource: _dataSource,
            paging: {
                pageSize: 10
            },
            pager: {
                showPageSizeSelector: true,
                allowedPageSizes: [5, 10, 20],
                showInfo: true
            },
            export: {
                enabled: true,
                fileName: "FullDeputy"
            },
            width: "100%"
        });
    }
    return {
        init: init
    }
};