// Хелпер для работы с формами
var FormHelper = (function () {

    var toggleVisibility = function (elementId) {
        var x = document.getElementById(elementId);

        if (x != null) {
            if (x.style.display === 'none') {
                x.style.display = 'block';
            } else {
                x.style.display = 'none';
            }
        }
    }

    // инициализация формы
    var init = function (options) {

        // обработчик submit формы
        var submitHandler;

        //отключаем автообновление, потому что надо показать сообщение и оно не покажется если страница обновится.
        if (window.docChangeObserver) window.docChangeObserver.disable();

        // документ, в котором находится форма
        var document1 = options.document;
        // dom-объект формы
        var formDomObj = document1.find(".action-form").get(0);

        // Подписка на события формы
        var subscribe = function () {
            $(formDomObj).bind("submit", submitHandler);
        };

        // Отписка от событий формы
        var unsubscribe = function () {
            $(formDomObj).unbind("submit", submitHandler);
        };

        var call = function (func, control, event) {
            if (func == undefined) return;

            var arg = "";
            if (func.indexOf) {
                if (func.indexOf('#') !== -1) {
                    var arr = func.split('#');
                    func = arr[0];
                    arg = arr[1];
                }
            }

            if (typeof func == 'function') {
                func(control, event, arg);
            }
            
            if (typeof func == 'string') {
                window[func](control, event, arg);
            }
        }

        var onStart = function () {          
            $(formDomObj).find("[type='submit']").prop('disabled', true);

            if (options.onStart !== undefined) {
                options.onStart();
            }
        }

        var onFinish = function () {           
            $(formDomObj).find("[type='submit']").prop('disabled', false);

            if (options.onFinish !== undefined) {
                options.onFinish();
            }

            call(options.afterSubmit, options.control, options.event);
        }

        var onSuccess = function () {            
            toggleVisibility('div-context-submit');
            toggleVisibility('div-context-modal');
            toggleVisibility('send-to-eis-question');
            toggleVisibility('action-form');

            if (options.onFinish !== undefined) {
                options.onFinish();
            }

        }

        var submitHandlerInternal = function () {
            if (options.useDefaultSubmit) {
                formDomObj.submit();
                return;
            }
            else if (options.dontSubmit) {
                onSuccess();
                onFinish();
                if (options.document) options.document.modal('toggle');//закрываем модалку
                return;
            }

            // отписываемся от submit
            unsubscribe();

            // submit формы
            ajaxFormSubmit(formDomObj,
                // в случае успеха
                function (data, afterSubmitJs, warnings, jsonData) {
                 
                    if (data && !WorkflowNotificationManager.isNotificationData(data)) {
                        // выводим сообщение об успехе
                        // todo убрать в onMessage?
                        var successMessage = document1.find(".success-message");
                        successMessage.text(data);
                        successMessage.removeClass("hide");
                        var errorMessage = document1.find(".error-message");
                        errorMessage.addClass("hide");
                        
                        var infoMessage = document1.find(".info-message");
                        
                        if (warnings !== undefined) {                             
                            if (!Array.isArray(warnings)) {
                                warnings = [warnings];
                            }

                            infoMessage.text("");
                            var text = "";
                            $.each(warnings, function (i, item) {
                                text = text + item;
                                text = text + " ";
                            });
                            text=text.trim();                           
                          
                            if (text !== '') {
                                infoMessage.text(text);                              
                                infoMessage.removeClass("hide");
                            }
                        }
                        subscribe();
                        onSuccess();

                        if (jsonData && afterSubmitJs) {
                            window[afterSubmitJs](jsonData);
                        }
                    } else {
                        if (options.afterSubmit) {
                            onSuccess();
                            onFinish();
                            if (options.document) options.document.modal('toggle');//закрываем модалку
                        } else {
                            if (WorkflowNotificationManager.isNotificationData(data)) {
                                WorkflowNotificationManager.saveNotificationData(data);
                            }
                            //по умолчанию - страница обновляется
                            var returnUrl = $(formDomObj).find("input[name='returnUrl']").val();
                            //делаем небольшую каку - если returnUrl совпадает с текущим location - обновляем страницу
                            // т.к. если в returnUrl есть якорь, то просто идет переход к якорю без обновления страницы(перехода на нее)

                            if (afterSubmitJs && typeof (afterSubmitJs) !== "undefined") {

                                if (returnUrl && (window.location.href !== returnUrl && (window.location.pathname + window.location.search) !== returnUrl)) {
                                    $("#actionDialog").click();                                    
                                }

                                window.ct.custom[afterSubmitJs](function () {
                                    if (returnUrl && (window.location.href !== returnUrl && (window.location.pathname + window.location.search) !== returnUrl)) {
                                        window.location.href = returnUrl;
                                    } else {
                                        window.location.reload();
                                    }
                                });
                            }
                            else
                            {
                                if (returnUrl && (window.location.href !== returnUrl && (window.location.pathname + window.location.search) !== returnUrl)) {
                                    $("#actionDialog").click();
                                    window.location.href = returnUrl;

                                    if (returnUrl.toLowerCase().indexOf(window.location.pathname.toLowerCase()) !== -1) {
                                        window.ct.common.routesGrid.refresh();
                                    }
                                    
                                } else {
                                    window.location.reload();
                                }
                            }
                        }
                    }
                },
                // в случае ошибки
                function (data) {                   
                    // todo убрать в onMessage?
                    var errorMessage = document1.find(".error-message:last");

                    if (data.allMessages && Array.isArray(data.allMessages) && data.allMessages.length > 0) {
                       
                        var text = data.responseText.replace('.', ":");
                        var title = $("<span/>").text(text);
                        var errorList = $("<ul/>");
                        var l = data.allMessages.length;
                        for (var i = 0; i < l; i++) {
                            var current = data.allMessages[i];
                            var item = $("<li/>").text(current);
                            item.appendTo(errorList);
                        }

                        var wrapper = $("<div/>");                        
                     
                        title.appendTo(wrapper);
                        errorList.appendTo(wrapper);
                        errorMessage.html(wrapper);
                    } else {
                       
                        if (data.fileName!==null) {
                            download(data.fileName, data.responseText);
                            errorMessage.text(data.messageForUser);
                        }
                        else
                            errorMessage.text(data.responseText);
                    }

                    errorMessage.removeClass("hide");
					$('.modal-body').scrollTop(0);

                    subscribe();
                    onFinish();
                });
        }

        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }

        function download(filename, text) {
            var pom = document.createElement('a');         
            var blob = new Blob([s2ab(atob(text, "utf8"))], {
                type: ''
            });
            console.log(window.navigator.appName);
            if (window.navigator.msSaveBlob) {
                window.navigator.msSaveOrOpenBlob(blob, filename);
             
            }
            else {
                pom.setAttribute('href', URL.createObjectURL(blob));
                // link.href = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + encodeURIComponent(data);
                pom.setAttribute('download', filename);
                
            }
                if (document.createEvent) {
                    var event = document.createEvent('MouseEvents');
                    event.initEvent('click', true, true);
                    pom.dispatchEvent(event);
                }
                else {
                    pom.click();
                }          

        }

        submitHandler = function (event) {
            onStart();

            // дальше не прокидываем event
            setPreventDefault(event);

            if (options.beforeSubmit !== undefined) {
                var form = document1.find(".action-form");
                var beforeSubmitRes = options.beforeSubmit(event, form);
                //вернулся какой-то результат выполнения действия перед submit
                if (beforeSubmitRes) {
                    if (beforeSubmitRes.then) {//если это promise
                        beforeSubmitRes.then(function (beforeSubmitResAsync) {
                            if (beforeSubmitResAsync) {//от промиса пришла ошибка
                                options.onMessage(beforeSubmitResAsync, true);
                                onFinish();
                            } else {//от промиса пусто - значит все хорошо, идем дальше
                                submitHandlerInternal();
                            }

                        });
                        return;//ждем промис
                    } else {
                        //Произошла ошибка в методе beforeSubmit. Вернулась строка с ошибкой
                        options.onMessage(beforeSubmitRes, true);
                        return;
                    }
                }
            }

            submitHandlerInternal();
        }

        // если не открывалась новая вкладка - повторная подписка на события
        if (!options.isTargetBlank) {
            subscribe();
        }
    }

    // требуется ли валидация для формы
    var requireValidation = function (form) {
        return form.hasClass("parsley-validation");
    }

    // требуется ли подписание формы ЭП
    var requireEds = function (form) {
        return form.find('[name="isSignEDS"]').is(':checked');
    }

    // дефолтный submit формы
    var submitDefault = function (form, options) {
        form.find("[type='submit']").click();
    }

    // submit формы с открытием результата в новой вкладке
    var submitBlank = function (form, options) {
        form.attr("target", "_blank");
       
        if (options.onFinish !== undefined) {
            options.onFinish();
        }

        form.find("[type='submit']").click();
    }

    // submit формы с подписанием ЭП
    var submitEds = function (form, options) {
        var onStart = function () {
            if (options.onStart !== undefined) {
                options.onStart();
            }
        }

        var onFinish = function () {
            form.attr("target", "_blank");
            if (options.onFinish !== undefined) {
                options.onFinish();
            }
        }

        var onMessage = function (message, isError) {

            if (options.onMessage !== undefined) {
                options.onMessage(message, isError);
            }
        }

        // если не выбран серитфикат для подписи - ошибка
        var hasCert = form.find('[name="certificateList"]').find("input:checked").val() != undefined;
        if (!hasCert) {
            onMessage('Выберите сертификат для создания подписи', true);
            return;
        }
        onStart();

        if ($('#signAttachments').is(':checked')) {
            EDS.SignDocumentWithAtachments(function () {
                var isExport = $('[name="isEisExport"]').is(':checked');
                if (isExport) {
                    submitDefault(form);
                } else {
                    onFinish();
                }
            }, onMessage);
        }
        else if ($('[data-name="isSignAllAttachment"]').val()) {
            EDS.SignAttachments(onFinish, onMessage);
        }
        else if ($('[name="isAttachEDS"]').is(':checked')) {
            EDS.SignCreate(onFinish, onMessage);
        }
        else if ($('[name="isEDSAuthentication"]').is(':checked')) {
            EDS.SignAuthentication(onFinish, onMessage);
        }
        else if ($('[name="isActivitySign"]').is(':checked')) {
            EDS.SignCreate(function () {
                var isApproval = $("[data-name='activitySignature']").val();
                isApproval !== undefined ? submitDefault(form) : onFinish();
            },
                onMessage);
        }
        else if ($('[name="isEisExport"]').is(':checked')) {
            EDS.SignForEis(function () { submitDefault(form); }, onMessage);
        } else {
            EDS.SignCreate(function () {
                var isApproval = $("[data-name='activitySignature']").val();
                isApproval !== undefined ? submitDefault(form) : onFinish();
            },
                onMessage);
        }
    }

    var submit = function (options) {
        // документ, в котором находится форма
        var document1 = options.document;

        // форма
        var form = document1.find(".action-form");

        // submit формы
        var submit = function () {

            // непонятно, почему в случае открытия результата в новой вкладке
            // ЭП не проверяется. но так было в common.js, пока не стал трогать - 
            // непонятно, баг это или фича, но выглядит странно.

            // submit и открытие в новое вкладке
            if (options.isTargetBlank) {
                submitBlank(form, { onStart: options.onStart, onFinish: options.onFinish, onMessage: options.onMessage });
            }
            // submit и подписание ЭП
            else if (requireEds(form)) {
                submitEds(form, { onStart: options.onStart, onFinish: options.onFinish, onMessage: options.onMessage });
            }
            // submit по-умолчанию
            else {
                submitDefault(form, { onStart: options.onStart, onFinish: options.onFinish, onMessage: options.onMessage });
            }
        }

        // если требуется валидация формы
        if (requireValidation(form)) {
            var formValidator = form.parsley();
            formValidator.whenValidate().done(submit);
            return false;
        } else {
            submit();
        }

        return true;
    };

    var close = function () {       
        if (window.docChangeObserver) window.docChangeObserver.restart();
    };

    return {
        init: init,
        submit: submit,
        close: close
    }

})($)
