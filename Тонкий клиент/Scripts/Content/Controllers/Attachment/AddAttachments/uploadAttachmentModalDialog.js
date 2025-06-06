var UploadAttachment = (function () {
    
    //инстанс грида
    var _grid = null;

    var _postUploadAction = null;

    //елементы страницы, с которыми гриды взаимодействуют
    var _submitButton = null,
        _form = null; // текущая форма

    //инициализация гридов
    function init() {
        console.info("Initialization of uploadAttachmentModalDialog.js");

        $('body').off('change', 'input[type="file"]');
        $("body").on('change', 'input[type="file"]', onFileEditorChange);

        if (_grid != null)
            return;

        //находим все контейнеры гридов на странице
        var gridContainers = $(".js-attachment-grid-containter");

        //форма, которая содержит гриды(пока поддерживается только одна)
        _form = gridContainers.closest('form');

        //кнопка сабмита
        _submitButton = $("#btn-ok_from_modal");

        var isInModalWindow = $(_submitButton).parents(".modal-dialog").length > 0;
        var isNewDoc = window.location.pathname.toLowerCase().indexOf("/BasedOn".toLowerCase()) !== -1;

        if (gridContainers.length === 0)
            return;

        var gridContainer = gridContainers.last();

        var sign = gridContainers.last().find("[name='DigitalSignature']").length > 0;
        if (sign) {
            _submitButton.attr("disabled", "disabled");
            UploadAttachmentHelper.disableFileSelector(_form);
            EDS.GetCertificates().then(function () {
                var hasCertificates = EDS.TryToSelectDefaultCertificate();

                if (!hasCertificates) {
                    showError("Нет доступных сертификатов для подписи файлов, невозможно присоединить файлы.");
                } else {
                    _submitButton.removeAttr("disabled");
                    UploadAttachmentHelper.enableFileSelector(_form);
                }
            });
        }

        bindSubmitHandler(gridContainers.last(), sign);

        var categories = UploadAttachmentHelper.getCategories(gridContainer);
        var columnDefinitions = UploadAttachmentHelper.getColumnDefenitions(gridContainer);

        //находим элемент, где будет грид
        var gridElement = gridContainer.find(".js-attachmentsGrid");
        var gridErrorElement = gridContainer.find(".error-message");

        var currentCategory = null;
        var currentTab = $("#viewNavigationTabs li.active > a").contents().first();
        var currentTabText = currentTab.text().trim();

        // проверяем, что находимся в закладке категории
        // чтобы выставить категорию по умолчанию и аттач улетел в нужный грид
        categories.forEach(function(category) {
            if (category.name === currentTabText) {
                currentCategory = category;
            }
        });

        if (isInModalWindow && isNewDoc) {
            //если новый док и модалька - в  window.grids какой-то ломающий всё борщ
            _grid = new AttachmentGrid();
            _grid.init(gridElement, columnDefinitions, categories, gridErrorElement, currentCategory);
            _grid.onValidating = onValidating;
            _grid.onRemoving = onFileRemove;

            //+ надо вырубить валидацию на input в котором ничего никогда не появится
            $(_form).last().find("[name='attachmentFiles']").removeAttr('required');
        } else {
            if (typeof window.grids !== 'undefined' &&
                window.grids.length > 0 &&
                window.addTableRowAttachmentWasClicked) {
                _grid = window.grids[0];
            } else {
                _grid = new AttachmentGrid();
                _grid.init(gridElement, columnDefinitions, categories, gridErrorElement, currentCategory);
                _grid.onValidating = onValidating;
                _grid.onRemoving = onFileRemove;
            }
        }
    }

    //обработка клика кнопки
    function bindSubmitHandler(container, sign) {
        //убираем стандартный сабмит
        _submitButton.unbind("click");

        //биндим свой обработчик
        _submitButton.on("click", function (event) {
            setPreventDefault(event);
            //проверяем форму
            var formValidator = _form.parsley();
            if (formValidator.length > 1)
                formValidator = formValidator[formValidator.length - 1];

            if (window.addTableRowAttachmentWasClicked &&
                window.location.pathname.toLowerCase().indexOf("/Edit".toLowerCase()) !== -1 &&
                $("#actionDialog").is(":visible")) {

                startOperation();
                submitAttachmentForm(container, sign).then(function () {

                    if (typeof window.doNotReload !== "undefined" && window.doNotReload) {
                        addRowAttachment();
                        $("#actionDialog").modal('hide');
                        window.doNotReload = false;
                        operationFinish();
                    } else {
                        window.location.reload();
                    }

                }, function (error) {
                    if (error.responseText) {
                        showError(error.responseText);
                    } else {
                        showError(error);
                    }
                });
                
            } else {
             
                formValidator.whenValidate().done(function () {
                    startOperation();
                    submitAttachmentForm(container, sign).then(function () {

                        if (typeof window.doNotReload !== "undefined" && window.doNotReload) {
                            addRowAttachment();
                            $("#actionDialog").modal('hide');
                            window.doNotReload = false;
                            operationFinish();
                        } else if (window.location.pathname.toLowerCase().indexOf("DocumentView".toLowerCase()) !== -1) {
                            
                            //Обновляем грид c файлами, без перезагрузки страницы.
                            var docKey = window.location.pathname.split("/").pop();
                            $.ajax({
                                url: UploadAttachmentHelper.getBaseUrl() + "/Document/GetFilesTableDataSource?docKey=" + docKey + "&originalUrl=" + window.location.href,
                                type: 'GET',
                                cache: false
                            }).then(function (response) {
                                var dataSourceNames = response.DataSourceNames;
                                var dataSources = response.DataSources;
                                var versionsDataSorces = response.VersionsDataSorces;
                                var docKey = window.location.pathname.split("/").pop();

                                var grids = [];

                                //Обновляем гриды.                                
                                for (var i = 0; i < dataSources.length; i++) {

                                    var tabName = dataSourceNames[i];
                                    var newStore = dataSources[i].Data;
                                    var newVersionsStore = versionsDataSorces[i].Data;

                                    var tabLink = $("#viewNavigationTabs li[data-tabname='" + tabName + "'] > a");
                                    var tabSelector = tabLink.data("target");
                                    var gridElement = $(tabSelector + " div[data-grid-id^='files-table-'] > div");
                                    var grid = gridElement.dxDataGrid("instance");

                                    if (!grid)
                                        continue;

                                    var store = grid.getDataSource().store();

                                    let Grid = {
                                        tabName: tabName,
                                        element: gridElement,
                                        ref: grid,
                                        pages: grid.pageCount(),
                                        rows: 0,
                                        page: grid.pageIndex(),
                                        rowPerPage: grid.pageSize(),
                                        items: []
                                    };

                                    if (store._array.length != newStore.length) {
                                        var newRowCnt = newStore.length - store._array.length;
                                        var newVersionsCnt = newVersionsStore.length;
                                        // заполняем массив добавленных айтемов
                                        for (var j = newRowCnt; j > 0; j--) {
                                            Grid.items.push(newVersionsStore[newVersionsCnt - j]);
                                        }
                                        // добавляем строки в таблицу
                                        for (var j = store._array.length; j < newStore.length; j++) {
                                            var itm = newStore[j];
                                            store._array.push(itm);
                                        }
                                        Grid.rows = newStore.length;

                                        // если находимся не на последней странице или новые аттачи выходят за ее предел
                                        // выключаем постраничный режим, иначе отображение будет кривым
                                        if (Grid.page != Grid.pages - 1 ||
                                            Grid.pages * Grid.rowPerPage < newStore.length)
                                        {
                                            grid.pageIndex(0);
                                            grid.pageSize(newStore.length);
                                            grid.option("paging.enabled", "false");
                                            Grid.page = 0;
                                            Grid.pages = 1;
                                            Grid.rowPerPage = newStore.length;
                                        }

                                        grids.push(Grid);

                                        grid.refresh()
                                            .done(function () {
                                                // обновляем вложенные гриды (версии файлов)
                                                for (var i = 0; i < grids.length; i++) {
                                                    if (grids[i].items.length == 0) continue;
                                                    var grid = grids[i];
                                                    var gridElement = grids[i].element;
                                                    grid.ref.collapseAll(-1);

                                                    var rowKeys = [];
                                                    for (var j = 0; j < grid.items.length; j++) {
                                                        var key = grid.ref.getKeyByRowIndex(grid.rows - (grid.pages - 1) * grid.rowPerPage - (j + 1))
                                                        rowKeys.push(key);
                                                        grid.ref.expandRow(key);
                                                    }

                                                    var versionsGridElement = gridElement.find("div[data-grid-id^='files-version-table-'] > div");

                                                    for (var j = 0; j < grid.items.length; j++) {
                                                        var versionsGrid = $(versionsGridElement[j]).dxDataGrid("instance");
                                                        var versionsStore = versionsGrid.getDataSource().store();
                                                        versionsStore._array.push(grid.items[j]);
                                                        
                                                    }
                                                    for (var j = 0; j < rowKeys.length; j++) {
                                                        grid.ref.collapseRow(rowKeys[j]);
                                                    }
                                                    grids[i].items = [];
                                                }
                                            });

                                        //Обновляем счетчик.
                                        var count = store._array.length;
                                        var countText = count ? count : "";
                                        var badge = tabLink.children(".badge");
                                        if (badge.length) {
                                            //Если счетчик есть, обновляем текст
                                            badge.text(countText);
                                        } else {
                                            //Если счетчика нет, то прицепляем его
                                            tabLink.append("<span></span><span class='badge'>" + countText + "</span>");
                                        }
                                    }
                                }

                                //Включить отслеживание обратно.
                                if (window.docChangeObserver) window.docChangeObserver.doHashRefresh(docKey);

                                //Закрываем диалоговое окно.
                                $("#actionDialog").modal('hide');

                                operationFinish();

                                //Обновляем грид с маршрутами, т.к. некоторые действия в маршрутах зависят от того, прикреплен файл или нет (выводится или сообщение о необходимости прикрепить файл, или диалог с действием).
                                window.ct.common.routesGrid.refresh();

                            });

                        } else {
                            window.location.reload();
                        }

                    }, function (error) {
                        if (error.responseText) {
                            showError(error.responseText);
                        } else {
                            showError(error);
                        }
                    });
                });
            }

        });
    }

    function submitAttachmentForm(container, sign) {
        var defer = jQuery.Deferred();

        //1-ый шаг: должны загрузить файлы и если надо подписываем. При любой ошибке, отменяем действие, то есть удаляем файлы 
        uploadFiles(container, sign).then(function (uploadedDic) {
            //2-ой шаг: выполняем postUploadAction если задано
            if (_postUploadAction) {
                _postUploadAction().then(function () {
                    resetActionsCache();
                    defer.resolve();
                }, function (error) {
                    discardUpload(uploadedDic).always(function () {
                        defer.reject(error);
                    });
                });
            } else {
                resetActionsCache();

                defer.resolve();
            }
        }, function (error) {
            defer.reject(error);
        });

        return defer.promise();
    }

    function uploadFiles(container, sign) {
        var defer = jQuery.Deferred();
        var uploadService = new UploadAttachmentService();
        
        if (_grid.isRowsValid()) {
            
            //загружаем файлы
            uploadService.upload(_form).then(function (uploadedFiles) {
                
                    if (!uploadedFiles)
                        defer.resolve();

                    //если надо подписываем 
                    if (sign) {
                        signDocumentFiles(container, uploadedFiles).then(function() {
                                defer.resolve(uploadedFiles);
                            },
                            function(error) {
                                discardUpload(uploadedFiles).always(function() {
                                    defer.reject(error);
                                });
                            });
                    } else {
                        defer.resolve(uploadedFiles);
                    }
                },
                function(error) {
                    defer.reject(error);
                });

            return defer.promise();
        }

        defer.reject("Заполните обязательные поля");
        return defer.promise();
    }

    function discardUpload(uploadedDic) {
        var defer = jQuery.Deferred();

        var discardPromise = $.when();

        $.each(uploadedDic, function (documentKey, files) {
            discardPromise = discardPromise.then(function () {
                return removeFilesFromDocument(documentKey, files);
            }).then(function () {
                console.info("Документ с ключом " + documentKey + " обработан.");
            }, function (dataError) {
                var error = dataError.responseText ? dataError.responseText : dataError;
                defer.reject(error);
            });
        });

        discardPromise.then(function () {
            defer.resolve();
        }, function (error) {
            defer.resolve(error);
        });

        return defer.promise();
    }

    //удаление файлов с документа
    function removeFilesFromDocument(docKey, fileKeys) {
        var defer = jQuery.Deferred();

        var url = UploadAttachmentHelper.getBaseUrl() + "/ContextAction/DeleteAttachmentHandler";

        var removePromise = $.when();

        $.each(fileKeys, function (index, fileKey) {
            var formData = new FormData();
            formData.append("uniqueIds", docKey + "/" + fileKey)
            removePromise = removePromise.then(function () {
                return $.ajax({
                    url: url,
                    type: 'POST',
                    mimeType: "multipart/form-data",
                    cache: false,
                    data: formData,
                    contentType: false,
                    cache: false,
                    processData: false
                });
            }).then(function () {

            }, function (dataError) {
                console.info(dataError);
            });
        });

        removePromise.always(function () {
            defer.resolve();
        });


        return defer.promise();
    }

    function signDocumentFiles(container, uploadedFiles) {
        var defer = jQuery.Deferred();

        var signPromise = $.when();
        var signService = new SignAttachmentService(container);

        $.each(uploadedFiles, function (documentKey, files) {
            signPromise = signPromise.then(function () {
                return signService.signDocumentFiles(documentKey, files);
            }).then(function () {
                console.info("Файлы документа с ключом " + documentKey + " подписаны.");
            }, function (dataError) {
                var error = dataError.responseText ? dataError.responseText : dataError;
                defer.reject(error);
            });
        });

        signPromise.then(function () {
            defer.resolve();
        }, function (error) {
            defer.reject(error);
        });

        return defer.promise();
    }

    function onValidating() {
        if (_grid.isValid) {
            _submitButton.removeAttr("disabled");
        } else {
            _submitButton.attr("disabled", "disabled");
        }
    }

    function onFileRemove(fileKey) {
        removeAjaxFile(_form[0], fileKey);

        var inputItem = _form.find("input[type='file']");
        var isEmpty = !getAjaxFiles(_form).length;
        inputItem.prop('required', inputItem.attr('data-required').toLowerCase() == 'true' && isEmpty);
        inputItem.closest('.file-drop-area').toggleClass('empty', isEmpty);
    }

    //добавить файл в грид
    function addFile(input, fileKey, originFileName) {        
        _grid.addFile(fileKey, originFileName).then(function() {});
    }

    //получить все установленные свойства для файла
    function getFileProps(fileKey) {        
        if (!fileKey)
            return null;

        fileKey = parseInt(fileKey);
        return _grid.getFileProps(fileKey);
    }

    function showError(text) {
        operationFinish();

        //эта ошибка отоюражается гридом, убираем чтобы не было дублирования
        if (text !== "Имя файла не может быть пустым.") {
            var errorBlock = $("#actionDialog").find(".modal-errors-wrapper");
            errorBlock.show();
            errorBlock.html(text);
        }
    }

    function startOperation() {
        _form.find("[type='submit']").prop('disabled', true);
        $("#actionDialog").find(".btn-submit").prop('disabled', true);
        $("#actionDialog").find(".modal-loading-wrapper").show();
    }

    function operationFinish() {
        _form.find("[type='submit']").prop('disabled', false);
        $("#actionDialog").find(".btn-submit").prop('disabled', false);
        $("#actionDialog").find(".modal-loading-wrapper").hide();
    }

    return {
        init: init,
        addFile: addFile,
        getFileProps: getFileProps,

        setPostUploadAction: function setPostUploadAction(action) {
            _postUploadAction = action;
        }
    };

})();


(function () {
    $(document).ready(function () {
        UploadAttachment.init();
    });
})();
