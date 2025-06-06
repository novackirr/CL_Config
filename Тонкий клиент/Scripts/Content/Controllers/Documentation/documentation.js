; (function () {} (window.ct = window.ct || {}));

; (function (documentation, $) {
    var baseUrl = $("#documentation-vertical-tab-panel").attr("data-base-url");
    var documentationApiService = ct.api.DocumentationApiService.create(baseUrl);

    documentationApiService.getFileCatalogs().then(function (catalogs) {
        var tabs = catalogs.map(function (x) {
            return {
                key: x.key,
                title: x.name,
                properties: x.displayedFileProperties,
            };
        });

        var $grid = $("<div />").dxDataGrid({
            allowColumnReordering: true,
            allowColumnResizing: true,
            hoverStateEnabled: true,
            cellHintEnabled: true,
        });
        var grid = $grid.dxDataGrid("instance");

        ct.ui.VerticalTabPanel.create({
            selector: "#documentation-vertical-tab-panel",
            tabs: tabs,
            tabContentTemplate: $grid,
            onInitialized: function (payload) {
                updateGridDataSource(grid, catalogs, payload.component.getSelectedTab().key);
            },
            onSelectionChanged: function (payload) {
                updateGridDataSource(grid, catalogs, payload.selectedTab.key);
            }
        });
    });

    function updateGridDataSource(grid, catalogs, selectedCatalogKey) {
        var catalog = catalogs.find(function(x) { return x.key === selectedCatalogKey; });
        createGridOptions(catalog, documentationApiService).then(function (options) {
            grid.option(options);
        });
    }

    function createGridOptions(catalog, docApiService) {
        var columns = catalog.displayedFileProperties.map(createColumn);
        return docApiService.getFiles(catalog.key).then(function (files) {
            return {
                columns: columns,
                dataSource: files
            }
        });
    }
    
    function createColumn(fileProperty) {
        function getWidth(propName) {
            switch (propName) {
                case "size": return "80";
                case "extension": return "80";
                case "dateCreated": return "130";
                case "dateModified": return "130";
                default: return undefined;
            }
        }

        function getAlignment(propName) {
            switch (propName) {
                case "size": return "right";
                default: return undefined;
            }
        }

        function getType(propName) {
            switch (propName) {
                case "dateCreated":
                case "dateModified": return "datetime";
                default: return undefined;
            }
        }

        function format(propName, text) {
            switch (propName) {
                case "size": return ct.utils.formatBytes(text);
                default: return text;
            }
        }

        var col = {
            dataField: fileProperty.name,
            dataType: getType(fileProperty.name),
            caption: fileProperty.displayName,
            alignment: getAlignment(fileProperty.name),
            width: getWidth(fileProperty.name),
            cellTemplate: function (element, info) {
                var link = $("<a>").attr("href", info.data.link).text(format(fileProperty.name, info.text));
                element.append(link);
            }
        };
        return col;
    }
}((window.ct = window.ct || {}, window.ct.documentation = window.ct.documentation || {}), $));
