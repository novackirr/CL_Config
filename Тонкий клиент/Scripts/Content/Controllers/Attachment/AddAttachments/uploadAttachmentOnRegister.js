var UploadAttachment = (function () {

    //инстансы гридов
    var _grids = [];

    //текстовые константы
    var _attributeName = "data-attachment-grid-index";

    //елементы страницы, с которыми гриды взаимодействуют
    var _submitButton = null,
        _form = null; // текущая форма

    //инициализация гридов
    function init() {        
        console.info("Initialization of uploadAttachmentOnRegister.js");

        $('body').off('change', 'input[type="file"]');
        $("body").on('change', 'input[type="file"]', onFileEditorChange);

        if (_grids.length > 0)
            return;

        //находим все контейнеры гридов на странице
        var gridContainers = $(".js-attachment-grid-containter");

        if (gridContainers.length === 0)
            return;

        //форма, которая содержит гриды(пока поддерживается только одна)
        _form = gridContainers.closest('form');

        //кнопка сабмита
        _submitButton = _form.find("a.btn:contains('Сохранить')");

        var sign = gridContainers.first().find("[name='DigitalSignature']").length > 0;

        if (sign) {
            //подписываемся на сохранение
            subscribeAfterSubmitEvent(gridContainers);
        }

        $.each(gridContainers, function (index, element) {

            //находим настройки для грида
            var current = $(element);

            var gridErrorElement = current.find(".error-message");

            //отображаем выбор сертификатов для каждой категории отдельно
            if (sign) {
                UploadAttachmentHelper.disableFileSelector(current);
                EDS.GetCertificates(current, getCategoryName(current)).then(function () {
                    var hasCertificates = EDS.TryToSelectDefaultCertificate(current);
                    if (!hasCertificates) {
                        UploadAttachmentHelper.disableFileSelector(current);
                        gridErrorElement.removeClass("hide");
                        gridErrorElement.text("Нет доступных сертификатов для подписи файлов, невозможно присоединить файлы.");
                    } else {
                        UploadAttachmentHelper.enableFileSelector(current);
                    }
                });
            }

            var categories = UploadAttachmentHelper.getCategories(current);
            var columnDefinitions = UploadAttachmentHelper.getColumnDefenitions(current);

            //находим элемент, где будет грид
            var gridElement = current.find(".js-attachmentsGrid");

            //почемаем инпут, которые соответствует этому гриду
            var input = current.find("input[type='file']");
            input.attr(_attributeName, index);

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

            var grid = new AttachmentGrid();
            grid.init(gridElement, columnDefinitions, categories, gridErrorElement, currentCategory);
            grid.onValidating = onValidating;
            grid.onRemoving = onFileRemove;
            _grids.push(grid);
        });

        window.grids = _grids;
    }

    function subscribeAfterSubmitEvent(gridContainers) {

        _form.on("afterFormSubmit", function (event, eventData) {
            var defer = jQuery.Deferred();

            getUploadedFiles(eventData.docKey).then(function (fileGroups) {
                if (fileGroups) {
                    signDocumentFiles(eventData.docKey, gridContainers, fileGroups).then(function () {
                        defer.resolve();
                    }, function (error) {
                        console.info(error);
                        removeDocument(eventData.docKey).always(function () {
                            defer.reject(error);
                        });
                    });
                } else {
                    defer.resolve();
                }
            }, function () {
                console.info(error);
                removeDocument(eventData.docKey).always(function () {
                    defer.reject(error);
                });
            });
            return defer.promise();
        });
    }

    function getUploadedFiles(docKey) {
        var defer = jQuery.Deferred();
        var url = UploadAttachmentHelper.getBaseUrl();
        url += "/ContextAction/GetAttachmentsInfo?docKey=" + docKey + "&withoutSign=true";

        var promise = $.ajax({
            url: url,
            type: 'GET',
            contentType: false,
            cache: false,
            processData: false,
        });

        promise.then(function (response) {
            if (response && response.trim() !== "") {
                var responseData = JSON.parse(response);
                if (responseData.status === "OK") {
                    var attachsInfo = JSON.parse(responseData.responseMessage);
                    var attachGroups = groupAttachmentInfos(attachsInfo);
                    defer.resolve(attachGroups);
                }
            } else {
                defer.resolve();
            }
        }, function (error) {
            console.info(error);
            defer.reject(error);
        });

        return defer.promise();
    }

    function signDocumentFiles(docKey, gridContainers, attachGroups) {
        var defer = jQuery.Deferred();

        var signPromise = $.when();
        $.each(gridContainers, function (index, element) {
            var current = $(element);
            var categoryName = getCategoryName(current);

            var files = attachGroups[categoryName];

            signPromise = signPromise.then(function () {
                return signAttachments(current, docKey, files);
            }).then(function () {
                console.info("Подписан файлы в категории " + categoryName + ".");
            }, function (error) {
                if (error)
                    defer.reject(error);
            });
        });

        signPromise.then(function () {
            defer.resolve();
        }, function (error) {
            defer.reject(error ? error : "");
        });

        return defer.promise();
    }

    function signAttachments(container, documentKey, files) {
        if (files && files.length > 0) {
            var signService = new SignAttachmentService(container);
            return signService.signDocumentFiles(documentKey, files);
        } else {
            var tempDefer = jQuery.Deferred();
            tempDefer.resolve();
            return tempDefer.promise();
        }
    }

    function removeDocument(documentKey) {
        var url = UploadAttachmentHelper.getBaseUrl() + "/ContextAction/DeleteDocumentHandler";

        var formData = new FormData();
        formData.append("uniqueIds", documentKey);

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
    }

    function getCategoryName(gridContainer) {
        var parentTab = gridContainer.parents(".tab-pane");
        return $("[data-target='#" + parentTab.attr("id") + "']").text();
    }

    function groupAttachmentInfos(infos) {
        var l = infos.length;

        var grouped = {};

        for (var i = 0; i < infos.length; i++) {
            var current = infos[i];

            if (grouped[current.category]) {
                grouped[current.category].push(current.key);
            } else {
                grouped[current.category] = [current.key];
            }
        }

        return grouped;
    }

    function onValidating() {
        var l = _grids.length;
        var isValid = true;
        for (var i = 0; i < l; i++) {
            var current = _grids[i];
            if (!current.isValid) {
                isValid = false;
                break;
            }
        }

        if (isValid) {
            _submitButton.removeAttr("disabled");
        } else {
            _submitButton.attr("disabled", "disabled");
        }
    }

    function onFileRemove(fileKey, clientGuid) {
        removeAjaxFile(_form[0], fileKey);

        var inputItem = _form.find("input[type='file']");
        var isEmpty = !getAjaxFiles(_form).length;
        inputItem.prop('required', inputItem.attr('data-required').toLowerCase() == 'true' && isEmpty);
        inputItem.closest('.file-drop-area').toggleClass('empty', isEmpty);

        if (clientGuid) {
            var newDoc = window.location.pathname.toLowerCase().indexOf("/BasedOn".toLowerCase()) !== -1;
            if (newDoc) {
                var el = $(".table-edit-column input[name*='-attachment_key-'][value='" + clientGuid + "']")
                    .closest(".table-edit-row")
                    .find(".delete-table-row-attachment").children(":first");

                deleteTableRowAttachment(el, null, true);
            }
        }
    }

    //добавить файл в грид
    function addFile(input, fileKey, originFileName) {
        var gridIndexStr = input.attr(_attributeName);
        var index = parseInt(gridIndexStr);
        _grids[index].addFile(fileKey, originFileName);
    }

    //получить все установленные свойства для файла
    function getFileProps(fileKey) {
        if (!fileKey)
            return;

        fileKey = parseInt(fileKey);

        var l = _grids.length;
        for (var i = 0; i < l; i++) {
            var current = _grids[i];
            var props = current.getFileProps(fileKey);
            if (props)
                return props;
        }
        return null;
    }

    return {
        init: init,
        addFile: addFile,
        getFileProps: getFileProps
    }
})();


(function () {
    $(document).ready(function () {
        UploadAttachment.init();
    });
})();
