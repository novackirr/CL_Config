(function () {

    console.log("approve-plan");

    disableDocHashObserever();

    var dialog = $("#actionDialog");
    var errorBlock = dialog.find(".modal-errors-wrapper");
    var submitButton = dialog.find("#btn-ok_from_modal");
    var form = dialog.find("form");
    var loading = dialog.find(".modal-loading-wrapper");
    var approveSettingsInput = dialog.find("[name='hfApproveSettings']");

    var isAllowSign = dialog.find("[name='DigitalSignature']").length > 0;

    if (isAllowSign) {
        EDS.GetCertificates();
    }

    //убираем стандартный сабмит
    submitButton.unbind("click");

    submitButton.on("click",
        function (event) {
            setPreventDefault(event);
            hideError();

            if (dialog.find('[name="certificateList"]').find("input:checked").val() == undefined && isAllowSign) {
                showError("Выберите сертификат для создания подписи");
            } else {

                startOperation();
                handleClick();
            }
            return false;
        });

    function handleClick() {
        //debugger;
        console.info("handleClick");



        var configs = JSON.parse(approveSettingsInput.val());

        var promise = $.when();
        $.each(configs, function (index, config) {
            promise = promise.then(function () {
                return processActivity(config);
            }).then(function () {
                console.info("Документ с ключом " + config.DocumentId + " обработан.");
            }, function (error) {
                showError(error);
                throw new Error(error);
            });
        });

        promise.then(function () {
            window.location.reload();
        });


    }

    /*
        config = {SignType: тип_подписи, DocumentId: "ключ_документа", Activityid: "ключ_активити"}
        значения SignType:
           -1 - подпись не требуется
            0 - подписать только атачмент
            1 - подписать только документ
            2 - подписать документ и все атачи
     */
    function processActivity(config) {
        console.info("processActivity");
        var defer = jQuery.Deferred();
        if (EDS.ClearCache) {
            EDS.ClearCache();
        }

        updateAction("update");

        //обновляем uniqueIds, чтобы на сервер пришел только один ключик активити, так как выполняем последовательно
        $("[name='uniqueIds']").val(config.Activityid);

        var promise = submitForm();

        promise.then(function (data) {
            var json = JSON.parse(data);
            if (json.status === "ERROR") {
                defer.reject(json.responseMessage);
            } else {
                //если логига работы плагина заменила представителя
                if (json && json.responseMessage) {
                    var form = $('#actionDialog form');
                    $('<input />', { type: 'hidden', name: "representableUserId", value: JSON.parse(json.responseMessage).representableUserId, hidden: 'hidden' }).appendTo(form);
                }
                //если обновили без проблем, генерим отчет
                makeReport().then(function (data) {
                    console.info("makeReport");
                    var json = JSON.parse(data);
                    if (json.status === "ERROR") {
                        defer.reject(json.responseMessage);
                    } else {
                        var promise;
                        switch (config.SignType) {
                            case -1:
                                promise = approve();
                                break;
                            case 0:
                                var attachKey = json.responseMessage;
                                if (!attachKey || attachKey.trim() === "") {
                                    var message = "Необработанное исключение. Отчет для подписи не был создан для документа с ключом " + config.DocumentId;
                                    defer.reject(message);
                                }
                                promise = signAttachment(config.DocumentId, attachKey);
                                break;
                            case 1:
                                promise = signDocument(config.DocumentId, config.Activityid);
                                break;
                            case 2:
                                promise = signDocumentWithAllAtachments(config.DocumentId, config.Activityid);
                                break;
                            default:
                                throw new Error("Не поддерживаемы тип подписи - " + config.SignType);
                        }

                        promise.then(function () {
                            defer.resolve();
                        }, function (error) {
                            defer.reject(error);
                        });
                    }
                }, function (error) {
                    var message = JSON.parse(error).responseMessage;
                    defer.reject(message);
                });
            }
        }, function (error) {
            var message = JSON.parse(error).responseMessage;
            defer.reject(message);
        });

        return defer.promise();
    }

    function makeReport() {
        updateAction("report");
        return submitForm();
    }

    function signAttachment(documentKey, attachmentKey) {
        console.info("Подпись приложенного файла с ключом " + attachmentKey + " у документа с ключом " + documentKey);

        var defer = jQuery.Deferred();

        var container = dialog.find("#signBlockData");

        var attachHashUrl = $("[name='attachHashUrl']").val();
        var docActionUrl = $("[name='docActionUrl']").val();

        createCheckBox("isSignEDS").appendTo(container);
        createCheckBox("isAttachEDS").appendTo(container);
        createCheckBox("isContext").appendTo(container);
        createCheckBox("isEisExport").appendTo(container);

        createHiddenInput("documentAttachHashUrl", attachHashUrl + "?documentId=" + documentKey + "&attachKey=" + attachmentKey, true).appendTo(container);
        createHiddenInput("documentActionUrl", docActionUrl + "?uniqueIds=" + documentKey + "/" + attachmentKey + "&activityId=", true).appendTo(container);
        createHiddenInput("activitySignature", "", true).appendTo(container);

        EDS.SignCreate(function () {
            container.empty();
            approve().then(function () {
                defer.resolve();
            }, function (error) {
                defer.reject(error);
            });
        }, function (message, isError) {
            container.empty();
            if (isError)
                defer.reject(message);
        }, true);

        return defer.promise();
    }

    function signDocumentWithAllAtachments(documentKey, activityKey) {
        console.info("Подпись и всех атачментов документа с ключом " + documentKey);
        //debugger;
        var defer = jQuery.Deferred();

        var container = dialog.find("#signBlockData");

        var attachHashUrl = $("[name='attachHashUrl']").val();
        var docActionUrl = $("[name='documentHashUrl']").val();
        var activityUrl = $("[name='signDocumentActivityHandler']").val();

        createCheckBox("isSignEDS").appendTo(container);
        createCheckBox("signAttachments", true).appendTo(container);
        createHiddenInput("documentAttachHashUrl", attachHashUrl + "?documentId=" + documentKey + "&attachKey=", true).appendTo(container);
        createHiddenInput("documentHashUrl", docActionUrl + "?documentId=" + documentKey + "&attachKey=", true).appendTo(container);
        createHiddenInput("activitySignature", activityUrl + "?documentId=" + documentKey + "&activityId=" + activityKey, true).appendTo(container);


        EDS.SignDocumentWithAtachments(function () {

        }, function (message, isError) {
            container.empty();
            if (isError)
                defer.reject(message);
        }, true, function () {
            container.empty();
            approve().then(function () {
                defer.resolve();
            }, function (error) {
                defer.reject(error);
            });
        });

        return defer.promise();
    }

    function signDocument(documentKey, activityKey) {
        console.info("Подпись документа с ключом " + documentKey);

        var defer = jQuery.Deferred();

        var container = dialog.find("#signBlockData");

        var attachHashUrl = $("[name='attachHashUrl']").val();
        var docActionUrl = $("[name='documentHashUrl']").val();

        var activityUrl = $("[name='signDocumentActivityHandler']").val();

        createCheckBox("isSignEDS").appendTo(container);
        createHiddenInput("documentAttachHashUrl", attachHashUrl + "?documentId=" + documentKey + "&attachKey=", true).appendTo(container);
        createHiddenInput("documentHashUrl", docActionUrl + "?documentId=" + documentKey + "&attachKey=", true).appendTo(container);
        createHiddenInput("activitySignature", activityUrl + "?documentId=" + documentKey + "&activityId=" + activityKey, true).appendTo(container);



        EDS.SignCreate(function () {
            container.empty();
            approve().then(function () {
                defer.resolve();
            }, function (error) {
                defer.reject(error);
            });
        }, function (message, isError) {
            container.empty();
            if (isError)
                defer.reject(message);
        }, true);

        return defer.promise();
    }

    function approve() {

        var defer = jQuery.Deferred();
        updateAction("approve");

        submitForm().then(function (data) {
            var json = JSON.parse(data);
            if (json.status === "ERROR") {
                defer.reject(json.responseMessage);
            } else {
                if(WorkflowNotificationManager.isNotificationData(json.responseMessage)){
                    WorkflowNotificationManager.saveNotificationData(json.responseMessage);
                }

                defer.resolve();
            }
        },
            function (error) {
                var message = JSON.parse(error).responseMessage;
                defer.reject(message);
            });

        return defer.promise();
    }

    function showError(text) {
        operationFinish();
        errorBlock.show();
        errorBlock.html(text);
    }

    function hideError() {
        errorBlock.hide();
        errorBlock.empty();
    }

    function startOperation() {
        form.find("[type='submit']").prop('disabled', true);
        dialog.find(".btn-submit").prop('disabled', true);

        loading.show();
    }

    function operationFinish() {
        form.find("[type='submit']").prop('disabled', false);
        dialog.find(".btn-submit").prop('disabled', false);

        loading.hide();
    }

    function updateAction(action) {
        form.find("#hfAction").val(action);
    }

    function submitForm() {
        var actionUrl = form.attr("action");
        var data = form.serializeArray();
        return $.ajax({
            url: actionUrl,
            type: "POST",
            data: data,
            cache: false
        });
    }

    function createCheckBox(name, addId) {
        var input = $('<input />', { type: 'checkbox', name: name, checked: 'checked', hidden: 'hidden' });
        if (addId) {
            input.attr("id", name);
        }
        return input;
    }

    function createHiddenInput(name, value, addDataName) {
        var input = $('<input />', { type: 'hidden', name: name, value: value, hidden: 'hidden', disabled: "disabled" });

        if (addDataName) {
            input.attr("data-name", name);
        }
        return input;
    }

    function disableDocHashObserever() {
        if (window.docChangeObserver) window.docChangeObserver.disable();
    }
}());