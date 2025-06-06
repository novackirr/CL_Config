(function () {
    console.log("etp-settings");

    var currentOrganization = null,
        currentLaw = null;

    function setLaw(newLaw) {
        currentLaw = newLaw;
        onLawChanged();
    }

    function onLawChanged() {
        hideError();
        waitingDialog.showWaiting();

        getData().then(function (data) {
            createGrid(data);
            $(".js-btn-etp").removeClass("invisible");
        }, function (error) {
            clearGrid();
            showError(error);
        }).always(function () {
            waitingDialog.hide();
        });
    }

    function processLawTabs(tabsContainer) {
        var tabs = tabsContainer.find("li");

        $.each(tabs, function (i, el) {
            var j = $(el);
            j.on("click", function () {
                $.each(tabs, function (j, element) {
                    $(element).removeClass("active");
                });
                var current = $(this);
                current.addClass("active");
                setLaw(getLawFromTab(current));
                location.hash = getLawFromTab(current);
            });
        });

        if (tabsContainer.find("li.active").length === 0) {
            var selectedTab = tabs.first();
            if (location.hash) {
                var hashTab = tabsContainer.find("li[data-law='" + location.hash.substr(1) + "']");
                if (hashTab.length > 0)
                    selectedTab = hashTab;
            }
            selectedTab.click();
        }

    }

    function getLawFromTab(tab) {
        return tab.attr("data-law");
    }

    function getData() {
        var defer = jQuery.Deferred();

        var url = getAbsoluteUrl("Administration/GetEtpSettings");

        $.ajax({
            url: url,
            type: "GET",
            cache: false,
            data: { law: currentLaw, organization: currentOrganization },
            success: function (data) {
                var json = JSON.parse(data);
                if (json.status === "OK") {
                    var d = JSON.parse(json.responseMessage);
                    defer.resolve(d);
                }
                else {
                    defer.reject(json.responseMessage);
                }
            },
            error: function (error) {
                defer.reject(error)
            }
        });

        return defer.promise();
    }

    function saveChanges() {
        hideError();
        var instance = $("#js-etp-grid-containter").dxDataGrid("instance");
        instance.closeEditCell();

        //нужно чтобы грид успел потерять фокус
        setTimeout(function () {
            saveChangesInternal(instance);
        }, 250);
    }

    function saveChangesInternal(instance) {
        var data = [];
        var columns = instance.getVisibleRows();
        var l = columns.length;

        var isValid = true;
        for (var i = 0; i < l; i++) {
            var current = columns[i];

            var copy = JSON.stringify(current.data);
            copy = JSON.parse(copy);
            delete copy["__KEY__"];

            if (validate(instance, current)) {
                data.push(copy);
            } else {
                isValid = false;
            }
        }

        if (!isValid) {
            return;
        }

        waitingDialog.showWaiting();

        var url = getAbsoluteUrl("Administration/UpdateEtpSettings");
        url += "?law=" + currentLaw;

        $.ajax({
            url: url,
            type: "POST",
            cache: false,
            data: { etp: JSON.stringify(data) },
            success: function (data) {
                var json = JSON.parse(data);
                if (json.status !== "OK") {
                    showError(json.responseMessage);
                }
            },
            error: function (error) {
                showError(error);
            }
        }).always(function () {
            waitingDialog.hide();
        });
    }
    function validate(instance, row) {
        var l = row.cells.length;
        var cellsWhichAreEmpty = [];
        var editableCellCount = 0;
        for (var i = 0; i < l; i++) {
            var current = row.cells[i];
            if (current.column.allowEditing) {
                editableCellCount++;
                if (!current.value || current.value.trim() === "")
                    cellsWhichAreEmpty.push({
                        name: current.column.caption,
                        index: current.columnIndex
                    });
            }
        }

        if (cellsWhichAreEmpty.length !== 0 && cellsWhichAreEmpty.length !== editableCellCount) {
            var lEmpty = cellsWhichAreEmpty.length;
            for (var j = 0; j < lEmpty; j++) {
                var emptyCell = cellsWhichAreEmpty[j];
                var cellElement = instance.getCellElement(row.rowIndex, emptyCell.index);
                cellElement.css("border", "2px solid #d9534f");
                var span = cellElement.find("span");
                if (span.length > 0) {
                    span.css("color", "#d9534f");
                } else{
                    cellElement.find("input").addClass("error");
                }

            }
            return false;
        } else {
            return true;
        }




    }

    function init() {
        var tabsContainer = $("ul.etp-settings");
        processLawTabs(tabsContainer);

        var selectedTab = tabsContainer.find("li.active");
        setLaw(getLawFromTab(selectedTab));

        $(".js-btn-etp").on("click", function (e) {
            saveChanges();
            e.stopPropagation();

        });
    }

    function createGrid(data) {

        var columnOptions = createColumnOptions(data.columns);

        var gridContainer = $("#js-etp-grid-containter");
        gridContainer.dxDataGrid({
            allowColumnReordering: true,
            allowColumnResizing: true,
            columns: columnOptions,
            dataSource: data.rowsData,
            editing: {
                allowDeleting: false,
                allowUpdating: true,
                mode: "cell",
                texts: {
                    confirmDeleteMessage: null
                }
            },
            onEditorPreparing: function (e) {
                if (e.parentType == "dataRow" && e.dataField == "Пароль")
                    e.editorOptions.mode = 'password';
            }
        });
    }

    function clearGrid() {
        var containter = $("#js-etp-grid-containter");
        if (containter.children().length > 0) {
            containter.removeData();
            containter.empty();
        }

    }

    function createColumnOptions(columnDescriptions) {
        var columnOptions = [];
        var l = columnDescriptions.length;
        for (var i = 0; i < l; i++) {
            var current = columnDescriptions[i];
            var option = {
                dataField: current.key,
                width: current.width + "%",
                caption: current.name,
                visible: current.isVisible,
                allowEditing: !current.isReadOnly
            };

            option["encodeHtml"] = false;
            option["customizeText"] = function (cellInfo) {
                if (cellInfo.value) {
                    return cellInfo.value;
                } else {
                    return '<span style="color: #999999">Указать значение...</span>';
                }
            };
            if (current.key === "Пароль") {
                option["cellTemplate"] = function (container, args) {
                    createEditPasswordControl(container, args);
                };

                option["editCellTemplate"] = function (cellElement, cellInfo) {
                    createEditPasswordControl(cellElement, cellInfo);
                };
            }

            columnOptions.push(option);
        }
        return columnOptions;
    }

    function createEditPasswordControl(container, args) {

        var input = $("<input type='password' class='pswd-input' placeholder='Указать значение...' autocomplete='new-password'/>");
        input.val(args.value);

        input.on("change", function () {
            args.setValue($(this).val())
        });

        input.appendTo(container);

        if (args.value && args.value.trim() !== "") {
            container.css("position", "relative");
            var eyeIcon = $("<i class='glyphicon glyphicon-eye-open' style=''/>");
            eyeIcon.on("mousedown", function (e) {
                var current = $(this);
                current.addClass("glyphicon-eye-close");
                current.removeClass(" glyphicon-eye-open");

                var input = current.prev("input");
                input.attr('type', "text");
                e.stopPropagation();
                e.preventDefault();
            });

            eyeIcon.on("mouseup", function (e) {
                var current = $(this);
                current.addClass("glyphicon-eye-open");
                current.removeClass("glyphicon-eye-close");

                var input = current.prev("input");
                input.attr('type', "password");
                e.stopPropagation();
                e.preventDefault();
            });

            eyeIcon.on("click", function (e) {
                e.stopPropagation();
                e.preventDefault();
            });

            eyeIcon.appendTo(container);
        }
    }

    function showError(error) {
        $("#etp-error-message").text(error);
        $("#etp-error-message").removeClass("invisible");
        $(".js-btn-etp").addClass("invisible");
    }

    function hideError() {
        $("#etp-error-message").text("");
        $("#etp-error-message").addClass("invisible");
    }




    init();
}());