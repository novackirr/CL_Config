$(document).ready(function () {
    var notificationFilteringViewer = NotificationFilteringViewer("viewnotificationfiltering");
    notificationFilteringViewer.init();
});

NotificationFilteringViewer = function (incViewer) {

    var personNoticeFlagEditPopup;
    var currentEditingGroup;

    var _html = {
        containerId: "inc-viewer-" + incViewer + "-container",
        dataGridId: "inc-viewer-" + incViewer + "-datagrid",
        startSelector: "#inc-viewer-" + incViewer + "-start",
        endSelector: "#inc-viewer-" + incViewer + "-end",
        refreshSelector: "#inc-viewer-" + incViewer + "-refresh",
        containerSelector: "#inc-viewer-" + incViewer + "-container",
        dataGridSelector: "#inc-viewer-" + incViewer + "-datagrid",
        jsonInput: "#inc-viewer-json-" + incViewer,
        popupId: "#inc-viewer-" + incViewer + "-popup"
    };

    function init() {

        _dataSource = {
            load: function (options) {

                var d = $.Deferred();
                $.ajax({
                    url: getAbsoluteUrl("Account/GetNotificationFiltering"),
                    type: "GET",
                    cache: false,
                    data: { filterText: options.searchValue },
                    success: function (data) {
                        d.resolve(data);
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        showAlert("Ошибка полуечния групп доступа", errorThrown);
                    }
                });
                return d.promise();
            }
        }

        var _$logViewerDataGrid;

        DevExpress.localization.locale("ru");
        _$logViewerDataGrid = $(_html.dataGridSelector).dxDataGrid({
            allowColumnResizing: true,
            columnResizingMode: 'nextColumn',
            columnMinWidth: 100,
            hoverStateEnabled: true,
            selection: {
                mode: 'single'
            },
            columns: [
                {
                    width: "25%",
                    caption: "Группа доступа",
                    dataField: "AccessGroup.Name",
                    allowEditing: false,
                },
                {
                    width: "25%",
                    caption: "Закупающие департаменты",
                    dataField: "ExecDepartments.Name",
                    allowEditing: false,
                    cellTemplate: function (container, options) {
                        if (options.data.PurchasingDepartments) {
                            options.data.PurchasingDepartments.forEach(function (x) {
                                if (x) container.append("<div>" + x.Name + "</div>");
                            });
                        }
                    }
                },
                {
                    width: "25%",
                    caption: "Исполняющие департаменты",
                    dataField: "PurchDepartments",
                    allowEditing: false,
                    cellTemplate: function (container, options) {
                        if (options.data.ExecutingDepartments) {
                            options.data.ExecutingDepartments.forEach(function (x) {
                                if (x) container.append("<div>" + x.Name + "</div>");
                            });
                        }
                    }
                },
                {
                    width: "12%",
                    caption: "МВП",
                    dataField: "Mvps",
                    allowEditing: false,
                    cellTemplate: function (container, options) {
                        if (options.data.IsMvpInverse && options.data.Mvps && options.data.Mvps.length > 0) {
                            container.append("<div>Инверсия:</div>");
                        }

                        if (options.data.Mvps) {
                            options.data.Mvps.forEach(function (x) {
                                if (x) container.append("<div>" + x + "</div>");
                            });
                        }

                        if (container.children().size() === 0) {
                            container.append("<div>Не задано</div>");
                        }
                    }
                },
                {
                    width: "12%",
                    caption: "Уведомления",
                    dataField: "IsNoticeOff",
                    allowEditing: false,
                    cellTemplate: function (container, options) {

                        var noticeHref = $("<a />");

                        if (options.data.IsNoticeOff) {
                            noticeHref.append("<div>Уведомления отключены</div>")
                        }
                        else {
                            noticeHref.append("<div>Уведомления включены, согласно настройке</div>")
                        }

                        noticeHref.addClass('dx-link')
                            .on('dxclick',
                                function () {
                                    editPersonNoticeFlagPopup(options.data);
                                })
                            .appendTo(container);
                    }
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
            width: "100%"
        });

    }

    //Тут всё что с модалькой связано для редактирования фильтрации адресатов
    function editPersonNoticeFlagPopup(selectedItem) {

        currentEditingGroup = selectedItem;

        currentGroupNoticeOffFlag = currentEditingGroup.IsNoticeOff;

        var popupOptions = {
            width: 750,
            height: 'auto',
            showTitle: true,
            title: "Фильтр адресатов",
            visible: false,
            dragEnabled: false,
            closeOnOutsideClick: true,
            contentTemplate: function () {
                var resultContainer = $("<div/>");

                var personFilterCheckDiv = $('<div/>').appendTo(resultContainer);

                personFilterCheckDiv.dxCheckBox({
                    value: currentGroupNoticeOffFlag > 0,
                    text: "Отключить уведомления группы для данного пользователя",
                    onValueChanged: function (data) {
                        currentGroupNoticeOffFlag = data.value;
                    }
                }).dxCheckBox("instance");

                $("<br><br>").appendTo(resultContainer);

                var okButton = $("<div style='margin:5px;'/>").appendTo(resultContainer);
                okButton.dxButton({
                    text: "Сохранить",
                    onClick: function () {
                        $.ajax({
                            url: getAbsoluteUrl("Account/EditNotificationFiltering"),
                            type: "POST",
                            data: {
                                accessGroupId: currentEditingGroup.AccessGroup.Id,
                                isReadOnlyExecuting: currentEditingGroup.IsReadOnlyExecutingDepartment,
                                isReadOnlyPurchasing: currentEditingGroup.IsReadOnlyPurchasingDepartment,
                                readOnlyDepartmentId: currentEditingGroup.ReadOnlyDepartmentId,
                                isNoticeOff: currentGroupNoticeOffFlag ? 1 : 0,
                            },
                            traditional: true,
                            success: function (data) {
                                currentEditingGroup.IsNoticeOff = currentGroupNoticeOffFlag;

                                $(_html.dataGridSelector).dxDataGrid("instance").refresh();
                            },
                            error: function (jqXHR, textStatus, errorThrown) {
                                showAlert("Ошибка при установке подразделений", errorThrown);
                            }
                        });

                        personNoticeFlagEditPopup.hide();
                    }
                }).dxButton("instance");

                var cancelButton = $("<div style='margin:5px;'/>").appendTo(resultContainer);
                cancelButton.dxButton({
                    text: "Отмена",
                    onClick: function () {
                        personNoticeFlagEditPopup.hide();
                    }
                }).dxButton("instance");

                return resultContainer;
            }
        }

        if (personNoticeFlagEditPopup) {
            personNoticeFlagEditPopup.option("contentTemplate", popupOptions.contentTemplate.bind(this));
        } else {
            personNoticeFlagEditPopup = $(_html.popupId).dxPopup(popupOptions).dxPopup("instance");
        }

        

        personNoticeFlagEditPopup.show();
    }

    return {
        init: init
    }

};
