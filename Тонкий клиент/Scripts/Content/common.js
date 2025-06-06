; (function ($) {
    String.prototype.replaceAll = function (search, replace) {
        return this.split(search).join(replace);
    }
    $.fn.removeStyle = function (style) {
        var search = new RegExp(style + '[^;]+;?', 'g');

        return this.each(function () {
            $(this).attr('style', function (i, style) {
                return style && style.replace(search, '');
            });
        });
    };
}(jQuery));

; (function () { }(window.ct = window.ct || {}));

// Понемногу переносим функционал в модуль, чтобы не засирать глобальный объект.
// Во избежание конфликтов с уже имеющимися библиотеками именуем модули с префиксом "ct.".
; (function (common) {
    /* Webshims Html5 Polyfill */
    webshim.setOptions('basePath', getRelativeUrl("Scripts/External/js-webshim/minified/shims/"));
    webshim.polyfill("es6");
    webshim.setOptions('forms', {
        customDatalist: 'auto',
        list: {
            "popover": {
                "appendTo": "body"
            }
        }
    });

    /**
     * Работа со словарями и связанными с ними элементами.
     */
    common.calc = {

        getMinClientWidth: function () {
            return Math.min(
                window.innerWidth,
                document.documentElement.clientWidth,
                document.body.clientWidth
            );
        },

        getMinClientHeight: function () {
            return Math.min(
                window.innerHeight,
                document.documentElement.clientHeight,
                document.body.clientHeight
            );
        },

    }

    /**
     * Проверяем, прошел ли таймаут delayInSeconds между кликами по контролу control.
     * Помогает не дать пользователю случайно сделать несколько кликов подряд, без необходимости блокировать и потом разблокировать контрол.
     * @param {HTMLElement|jQuery} control Контрол, нажатие на который необходимо проверять.
     * @param {number} delayInSeconds Задержка между кликами в секундах.     
     */
    common.delayPassed = function (control, delayInSeconds) {

        var ctrl = $(control);
        if (ctrl.data("last-click-time")) {

            var seconds = (Date.now() - ctrl.data("last-click-time")) / 1000;
            if (seconds <= delayInSeconds)
                return false;
        }
        ctrl.data("last-click-time", Date.now());
        return true;
    };

    /**
     * Отправляет форму на сервер.
     * @param {HTMLElement|jQuery} form Отправляемая форма.
     * @param {function} success Коллбэк, вызываемый при успешном запросе.
     * @param {function} error Коллбэк, вызываемый при ошибке запроса.
     * @param {function} beforeSend Коллбэк, вызываемый перед запросом.
     */
    common.ajaxFormSubmit = function (form, success, error, beforeSend) {
        //TODO: Обязательно добавить блокировку кнопок перед ajax запросом, и разблокировку кнопок после запроса
        var $form = $(form);
        var actionUrl = $form.attr("action");
        var method = $form.attr('method').toUpperCase();

        if (method == 'GET') {
            $.ajax({
                url: actionUrl,
                type: 'GET',
                data: $form.serialize(),
                contentType: false,
                cache: false,
                processData: false,
                success: success,
                error: error
            });

            return;
        }

        var extractJsonPart = function (responseMessage) {
            var openBrace = "{";
            var closeBrace = "}";
            var jsonExtract = "";

            if (responseMessage[0] == "{") {
                var openBracesCnt = 1;

                for (var i = 1; i < responseMessage.length; i++) {
                    if (responseMessage[i] == openBrace) {
                        openBracesCnt++;
                    }
                    if (responseMessage[i] == closeBrace) {
                        openBracesCnt--;
                    }
                    if (openBracesCnt == 0) {
                        jsonExtract = responseMessage.substring(0, i + 1);
                        break;
                    }
                }
            }

            return jsonExtract;
        }

        var handleSuccessCall = function (data) {
            var jSonExtractString = extractJsonPart(data);
            if (jSonExtractString) {
                var jsonExtract = JSON.parse(jSonExtractString);
                if (jsonExtract.status == "ERROR") {
                    error({
                        responseText: jsonExtract.responseMessage,
                        allMessages: jsonExtract.allMessages
                    });
                }
                if (jsonExtract.status == "OK") {
                    success(jsonExtract.responseMessage, jsonExtract.afterSubmitJs, jsonExtract.allMessages, jsonExtract);
                }
            } else {
                if (!data) {
                    success(data);
                } else {
                    error({ responseText: data });
                }
            }
        };

        var handleErrorCall = function (data) {
            error(data);
        };

        //событие перед отправкой формы
        $(form).trigger("beforeSubmit");

        // check HTML5 support
        if (window.FormData !== undefined) {
            var formData = new FormData(form);

            //n.volosatov
            var isUploadAttachment = typeof UploadAttachment !== "undefined" && $(".modal-title:visible:contains('Создать версию')").length == 0;
            var ajaxFiles = getAjaxFiles(form);
            var ajaxFilesLength = ajaxFiles.length;
            var ajaxFilesProps = {};
            for (var i = 0; i < ajaxFilesLength; i++) {
                var current = ajaxFiles[i];
                var item = current.data;

                if (isUploadAttachment) {
                    var fileKey = current.key;
                    var fileProps = UploadAttachment.getFileProps(fileKey);
                    if (fileProps !== null) {
                        ajaxFilesProps[fileKey] = fileProps;
                        formData.append(item.name, item.file, fileKey);
                    } else {
                        formData.append(item.name, item.file, item.file.name);
                    }


                } else {
                    formData.append(item.name, item.file, item.file.name);
                }


            }

            if (isUploadAttachment && ajaxFilesLength > 0)
                formData.append("attachmentFilesProps", JSON.stringify(ajaxFilesProps));


            $.ajax({
                url: actionUrl,
                type: 'POST',
                data: formData,
                mimeType: "multipart/form-data",
                contentType: false,
                cache: false,
                processData: false,
                beforeSend: beforeSend,
                success: handleSuccessCall,
                error: handleErrorCall
            });
        } else {
            // generate unique iframe
            var iframeId = 'unique' + (new Date().getTime());
            var iframe = $('<iframe src="javascript:false;" name="' + iframeId + '" ></iframe>');
            iframe.hide();

            // set form target to iframe
            $form.attr('target', iframeId);

            var preloadHandler;
            preloadHandler = function () {
                iframe.unbind('load', preloadHandler);
                iframe.load(function (e) {
                    var doc = getFrameDocument(iframe[0]);
                    var docRoot = doc.body ? doc.body : doc.documentElement;
                    var data = docRoot.innerHTML;

                    handleSuccessCall(data);
                    iframe.remove();
                });

                $form.submit();
            };

            // add iframe to body
            iframe.bind('load', preloadHandler);
            iframe.appendTo('body');
        }
    };

    /**
     * Какая-то каштомная отмена действия браузера. Хз зачем, но вот так.
     * @param {Event} event Отменяемое событие.
     */
    common.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

    /**
     * Работа со словарями и связанными с ними элементами.
     */
    common.dictionary = {

        DATA_SEPARATOR: '|',
        VIEW_DATA_SEPARATOR: ', ',

        /**
         * Заполняет отображаемые поля (из данных в соседнем скрытом поле).
         */
        fillDisplayFields: function () {
            var elementsToChange = [];
            $(".dict-modal-control").each(function (index, dictionaryControl) {
                var el = common.dictionary.fillSingleDisplayField($(dictionaryControl));
                if (el) elementsToChange.push(el);
            })

            setTimeout(function () {
                for (var i = 0; i < elementsToChange.length; i++) {
                    elementsToChange[i].change();
                }
            }, 100);
        },

        /**
         * Заполняет отображаемое поле (из данных в соседнем скрытом поле, single-selection).
         * @param {jQuery} $dictionaryModalControl Контрол, в котором надо заполнить отображаемое поле.
         */
        fillSingleDisplayField: function ($dictionaryModalControl) {
            var dictEditName = $dictionaryModalControl.attr("data-edit-name");
            var isTable = $dictionaryModalControl.closest(".table-edit").length > 0;

            var parentContainerSelector = isTable ? ".table-edit-row" : ".column-container";
            var hiddenDictFields = $dictionaryModalControl.closest(parentContainerSelector)
                .find(".display-field-part[dictionary-edit-name=" + dictEditName + "]");
            if (!hiddenDictFields.length) {
                hiddenDictFields = $dictionaryModalControl.closest(parentContainerSelector)
                    .parent().find(".display-field-part[dictionary-edit-name=" + dictEditName + "]");
            }
            var displayText = hiddenDictFields
                .map(function () {  // берем значения
                    return this.value;
                })
                .get()  // преобразуем в массив
                .filter(function (element) {  // фильтруем невалидные
                    return (element && $.trim(element).length);
                })
                .join(", ");  //склеиваем в строку

            var dictionaryDisplayField = $dictionaryModalControl.find(".dict-display-field");
            if (dictionaryDisplayField.val() !== displayText) {
                dictionaryDisplayField.val(displayText);//.change();

                return dictionaryDisplayField;
            }
        },

        /**
         * Заполняет отображаемые поля (из данных в ближайших скрытых полях, multi-selection).
         * @param {jQuery} $dictionaryModalControl Контрол, в котором надо заполнить отображаемые поля.
         */
        fillMultipleDisplayFields: function ($dictControl) {
            var hiddenDictRows = $dictControl.find("ul li");
            var displayTextArr = [];
            hiddenDictRows.each(function (num, row) {
                var columnTextArr = $(row).find("input.display-field-part")
                    .map(function () { //берем значения
                        return this.value;
                    })
                    .get() //преобразуем в массив
                    .filter(function (element) { //фильтруем невалидные
                        return !(element == null || $.trim(element).length === 0);
                    }); //склеиваем в строку
                var columnText = columnTextArr.length > 1 ? "(" + columnTextArr.join(",") + ")" : columnTextArr[0];
                displayTextArr.push(columnText);
            });

            var displayText = displayTextArr.
                filter(function (element) {
                    return (element != null) && $.trim(element).length !== 0;
                })
                .join(", ");

            $dictControl.find(".mult-dict-display").val(displayText).change();
        },

        fillMultipleDisplayFieldsEx: function ($dictControl) {
            var hiddenDictRows = $dictControl.find("ul.multiple-editor-list li");
            var displayTextArr = [];
            hiddenDictRows.each(function (num, row) {
                var columnTextArr = $(row).find("input.display-field-part")
                    .map(function () { //берем значения
                        return this.value;
                    })
                    .get() //преобразуем в массив
                    .filter(function (element) { //фильтруем невалидные
                        return !(element == null || $.trim(element).length === 0);
                    }); //склеиваем в строку
                var columnText = columnTextArr.length > 1 ? "(" + columnTextArr.join(this.DATA_SEPARATOR) + ")" : columnTextArr[0];
                displayTextArr.push(columnText);
            });

            var displayText = displayTextArr.
                filter(function (element) {
                    return (element != null) && $.trim(element).length !== 0;
                })
                .join(this.VIEW_DATA_SEPARATOR);

            $dictControl.find(".mult-dict-display").val(displayText)
                .change();

        },

        fillMultipleDictFieldsByList: function ($dictControl, dictionaryName) {
            var that = this;

            var hiddenDictRows = $dictControl.find("ul.multiple-editor-list li");
            var commaData = [];
            hiddenDictRows.each(function (num, row) {
                $(row).find("input")
                    .each(function (num, element) {
                        var input = $(element);
                        var value = input.attr('value');
                        if (value == undefined) {
                            value = "";
                        }

                        var d = { name: getInputName(input.attr('name')), value: value, isDisplay: input.hasClass('display-field-part'), displayValue: value };
                        var found = false;
                        for (var i = 0; i < commaData.length; i++) {
                            var commaDatum = commaData[i];
                            if (commaDatum.name == d.name) {
                                commaDatum.value = commaDatum.value + that.DATA_SEPARATOR + d.value;
                                if (commaDatum.isDisplay) {
                                    commaDatum.displayValue = commaDatum.displayValue + that.VIEW_DATA_SEPARATOR + d.displayValue;
                                }
                                found = true;
                                break;
                            }
                        };
                        if (!found) {
                            commaData.push(d);
                        }
                    })
            });


            // это был последний элемент, нужно сбросить оставшиеся значения
            if (commaData.length == 0) {
                if (dictionaryName) {
                    $dictControl.find("input[dictionary-edit-name='" + dictionaryName + "']")
                        .each(function (num, control) {
                            var input = $(control);
                            var d = { name: input.attr('name'), value: "", isDisplay: input.hasClass('display-field-part'), displayValue: "" };
                            commaData.push(d);
                        });
                }
            }

            var displayText = '';

            for (var i = 0; i < commaData.length; i++) {
                var commaDatum = commaData[i];
                var re = /:/gi;
                var newStr = commaDatum.name.replace(re, '-');
                var inputElement = $dictControl.find("input[name='" + newStr + "']");
                if (inputElement) {
                    inputElement.val(commaDatum.value);
                    if (commaDatum.isDisplay) {
                        displayText += (displayText != '') ? that.VIEW_DATA_SEPARATOR + commaDatum.displayValue : commaDatum.displayValue;
                    }
                } else {
                    console.log("Элемент с id: " + commaDatum.name + " не найден! (значение: " + commaDatum.displayValue + ")");
                }
            }

            $dictControl.find(".mult-dict-display").val(displayText).change();
        },


        /**
         * Удаляет значение из списка выбранных в справочнике элементов.
         * @param {HTMLElement} removeGlyph Элемент с кнопкой (символом) удаления.
         */
        removeFromMultipleDisplayFields: function (removeGlyph) {
            var dictControl = $(removeGlyph).closest(".dict-modal-control");
            var splittedName = $(removeGlyph).siblings("input").first().attr("name").split("-");
            var removedRowIndex = parseInt(splittedName[splittedName.length - 1]);
            var inputName = splittedName[0] + "_deleted";
            var deleteRowInput;

            if ($("[name='" + inputName + "']").length > 0) {
                deleteRowInput = $("[name='" + inputName + "']");
            } else {
                var deleteContainer = $("<div data-name='deletedTableElements'></div>");
                deleteRowInput = $("<input type='hidden' name='" + inputName + "' value='' />");
                deleteContainer.append(deleteRowInput);
                $(removeGlyph).closest("ul").parent().append(deleteContainer);
            }

            deleteRowInput.val(deleteRowInput.val() + removedRowIndex + ",");
            $(removeGlyph).closest("li").remove();

            this.fillMultipleDisplayFields(dictControl);
        },


        removeFromMultipleDisplayFieldsEx: function (removeGlyph) {

            var dictControl = $(removeGlyph).closest(".dict-modal-control");
            var hiddenDictRows = dictControl.find("ul.multiple-editor-list li");

            if ($(hiddenDictRows).length === 1) {
                this.removeAllEx(removeGlyph);
            } else {
                var splittedName = $(removeGlyph).siblings("input").first().attr("name").split("-");
                var removedRowIndex = parseInt(splittedName[splittedName.length - 1]);
                var inputName = splittedName[0] + "_deleted";
                var deleteRowInput;

                if ($("[name='" + inputName + "']").length > 0) {
                    deleteRowInput = $("[name='" + inputName + "']");
                } else {
                    var deleteContainer = $("<div data-name='deletedTableElements'></div>");
                    deleteRowInput = $("<input type='hidden' name='" + inputName + "' value='' />");
                    deleteContainer.append(deleteRowInput);
                    $(removeGlyph).closest("ul").parent().append(deleteContainer);
                }

                deleteRowInput.val(deleteRowInput.val() + removedRowIndex + this.DATA_SEPARATOR);
                $(removeGlyph).closest("li").remove();

                this.fillMultipleDictFieldsByList(dictControl, splittedName[0]);
            }
        },

        removeAllEx: function (removeGlyph) {
            var dictControl = $(removeGlyph).closest(".dict-modal-control");
            var hiddenDictRows = dictControl.find("ul.multiple-editor-list li");
            var dictFooter = dictControl.find("ul.multiple-editor-list div");
            var commaData = [];
            var dictionaryName = "";
            hiddenDictRows.each(function (num, row) {
                $(row).find("input")
                    .each(function (num, element) {
                        var input = $(element);
                        dictionaryName = input.attr("name").split("-")[0];
                        input.closest("li").remove();
                        input.remove();
                    });
            });
            $(dictFooter).remove();

            this.fillMultipleDictFieldsByList(dictControl, dictionaryName);
        }

    };

    /**
     * Отображает диалог с перечнем ошибок.
     * @param {string|Array<string>} errorMessages Текст ошибки / массив текстов ошибок.
     * @param {function} onHidden Коллбэк, вызываемый после закрытия диалога.
     * @param {boolean} isWarning Определяет заголовок модалки (Предупреждение или ошибка)
     */
    common.showCommonErrors = function (errorMessages, onHidden, isWarning) {

        var isErrorPage = false;

        if (typeof (errorMessages) !== "undefined") {

            if (typeof (errorMessages) === "string" && errorMessages.indexOf("application-errors") !== -1) {

                errorMessages = $(errorMessages).find('.application-errors .alert.alert-danger');
                isErrorPage = true;

            } else if (typeof (errorMessages) !== "string" && !Array.isArray(errorMessages)) {

                errorMessages = "Необходимо выполнить вход в систему.";
            }
        }
        //если прошел не массив ошибок, а всего одна - считаем ее как массив из 1 элемента
        if (!Array.isArray(errorMessages)) {
            errorMessages = [errorMessages];
        }

        var $dialog = $('#commonErrorsDialog');
        if (isWarning) $(".error-dlg-header").text("Предупреждение:");
        $dialog.modal('show');

        var htmlMessages = [];
        $.each(errorMessages, function (i, item) {
            if (isErrorPage)
                htmlMessages.push(item);
            else
                htmlMessages.push('<li><p class="form-control-static">' + item + '</p></li>');
        });

        var $messagesList = $dialog.find("ul");

        if (isErrorPage) {

            $messagesList.parent().html(htmlMessages);
        } else {

            $messagesList.html(htmlMessages);
        }

        if (onHidden != null) {
            $dialog.on('hidden.bs.modal', onHidden);
        }
    }

    /**
     * Экранирует не-ASCII символы в строке.
     * @param {string} str Экранируемая строка.
     * @returns {string}
     */
    common.safeAscii = function (str) {
        return str.replace(/[\u007F-\uFFFF]/g, function (chr) {
            return "\\u" + ("0000" + chr.charCodeAt(0).toString(16)).substr(-4)
        });
    };

    /**
     * Декодируем ранее закодированное значение строки на вьюхе.
     * @param {string} htmlStr 
     * @returns {string} 
     */
    common.decodeHTML = function decodeHTML(htmlStr) {
        var txt = document.createElement('textarea');
        txt.innerHTML = htmlStr;
        return txt.value;
    };

    /**
     * Создаёт уникальный (более или менее) идентификатор заданной длины с нужным префиксом.
     * @param {number} length Длина идентификатора (количество генерируемых символов).
     * @param {string} prefix Префикс для идентификатора (по умолчанию - без префикса).
     * @returns {string}
     */
    common.createId = function (length, prefix) {
        length = length || 8;
        prefix = prefix || "";
        var id = prefix;
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++) {
            id += possible.charAt(Math.floor(Math.random() * possible.length));
        }

        return id;
    }

    common.routesGrid = {

        refresh: function () {

            //Обновляем грид с маршрутами, т.к. некоторые действия в маршрутах зависят от того, прикреплен файл или нет (выводится или сообщение о необходимости прикрепить файл, или диалог с действием).
            var routesGrid = $('div[id^="routes-table"]');
            if (routesGrid.length === 1)
                routesGrid.dxDataGrid("instance").refresh();
        }
    }

}((window.ct = window.ct || {}, window.ct.common = window.ct.common || {})));

/* Common */
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (!String.prototype.indexOfInsensitive) {
    String.prototype.indexOfInsensitive = function (s, b) {
        return this.toLowerCase().indexOf(s.toLowerCase(), b);
    }
}

if (!String.prototype.containsInsensitive) {
    String.prototype.containsInsensitive = function (s) {
        return this.indexOfInsensitive(s) !== -1;
    }
}

// костыльные функции, которые нужны, чтобы колонки, скрываемые аналитиками при просмотре документа,
// замещались другими. работают только с двумя колонками
function hideViewElementColumn(element) {
    var elementColumn = element.closest(".column-container");
    elementColumn.addClass("hidden-column");
    placeElementsInTwoColumns(elementColumn.parent());
}

function showViewElementColumn(element) {
    var elementColumn = element.closest(".column-container");
    elementColumn.removeClass("hidden-column");
    placeElementsInTwoColumns(elementColumn.parent());
}

function placeElementsInTwoColumns(container) {
    container.find("> div:not(.hidden-column)").filter(":even").css("clear", "left");
    container.find("> div:not(.hidden-column)").filter(":odd").css("clear", "none");
}

/**
 * @deprecated Use ct.common.alert(title, message)
 */
function showAlert(header, message) {
    ct.common.alert(header, message);
}


function showReplacingContentError(container, errorMessage) {
    var errorTemplate = $("<div class='page-body'><h2>Во время работы приложения произошла ошибка</h2></div>");
    var errorStandartMessage = $("<small>При необходимости получить дополнительную информацию обратитесь к администратору</small>");
    var errorPanel = $("<div class='application-errors'></div>");
    var errorBody = $("<div class='alert alert-danger' role='alert'></div>");
    errorBody.text(errorMessage);
    errorPanel.append(errorBody);
    errorTemplate.append(errorPanel);
    errorTemplate.append(errorStandartMessage);
    $(container).last().empty();
    $(container).last().append(errorTemplate);
}

function replaceContent(url,
    srcElementSelector,
    postLoadFunction,
    postLoadErrorFunction,
    errorUrl,
    preLoadScriptPath,
    postLoadScriptPath) {
    var srcContainer = $(srcElementSelector).last();
    setPreventDefault(event);

    var loadFunction = function () {
        srcContainer.load(url,
            function (response, status, xHr) {
                var errorResponse = false;
                var responseObject = $($.parseHTML(response));
                var authForm = responseObject.find("#content-login-form");

                if (authForm.length !== 0) {
                    document.location = errorUrl; // логин с переходом на главную поиска
                } else {
                    if (!$(this).html()) {
                        if (response.includes('ERROR:')) {
                            document.location = errorUrl;
                        } else {
                            var errorMessage = responseObject.attr('data-empty-body-error-message');
                            if (!errorMessage)
                                errorMessage = responseObject.find('div.application-errors > div').text();
                            if (!errorMessage)
                                errorMessage = "Во время выполнения приложения произошла ошибка.";
                            postLoadErrorFunction(errorMessage);
                        }
                    } else {
                        if (status === "error") {
                            errorResponse = true;
                            postLoadErrorFunction("Error occured: " + xHr.status + " " + xHr.statusText);
                        }

                        if (!errorResponse) {
                            if (postLoadFunction) {
                                postLoadFunction();
                            }

                            if (postLoadScriptPath) {
                                $.getScript(postLoadScriptPath);
                            }
                        }
                    }
                }
            });
    }
    if (preLoadScriptPath) {
        $.getScript(preLoadScriptPath, loadFunction);
    } else {
        loadFunction();
    }

}

function shiftModalScrollToAnchor(anchorId) {
    $('div.modal-body').animate(
        {
            scrollTop: $('div.modal-body #' + anchorId + '-accordion').offset().top - $('div.modal-body').offset().top
        }, 10);
}

function getUrlAnchor() {
    return window.location.hash.substr(1);
}
function getQueryStringParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
function getAbsoluteUrl(relativeUrl) {
    var baseUrl = $('base').attr('href');
    if (baseUrl && baseUrl.lastIndexOf('/') == baseUrl.length - 1)
        baseUrl = baseUrl.substr(0, baseUrl.length - 1);
    if (relativeUrl && relativeUrl.indexOf('/') == 0)
        relativeUrl = relativeUrl.substr(1);

    return baseUrl + '/' + relativeUrl;
}

/**
 * @deprecated Use ct.utils.preventDefault(event)
 */
function setPreventDefault(evt) {
    if (evt) {
        if (evt.preventDefault)
            evt.preventDefault();
        else
            evt.returnValue = false;
    }
}

function stopEvent(evt) {
    if (evt && evt.stopPropagation)
        evt.stopPropagation();
    else
        window.event.cancelBubble = true;
}

function toggleVisibility(element, shown) {
    var items = jQuery(element);

    if (shown)
        items.removeClass("js-hidden");
    else
        items.addClass("js-hidden");

    items.each(function (index, item) {
        if (item.tagName != 'OPTION')
            return;

        if (shown) {
            if (jQuery(element).parent('span.toggleOption').length)
                jQuery(element).unwrap();
        } else {
            if (jQuery(element).parent('span.toggleOption').length == 0)
                jQuery(element).wrap('<span class="toggleOption" style="display: none;" />');
        }
    });
}

function getFrameDocument(frame) {
    var doc = null;

    // IE8 cascading access check
    try {
        if (frame.contentWindow) {
            doc = frame.contentWindow.document;
        }
    } catch (err) {
    }

    if (doc) {
        return doc;
    }

    try {
        // simply checking may throw in ie8 under ssl or mismatched protocol
        doc = frame.contentDocument ? frame.contentDocument : frame.document;
    } catch (err) {
        // last attempt
        doc = frame.document;
    }

    return doc;
}

function getDoc(frame) {
    var doc = null;

    // IE8 cascading access check
    try {
        if (frame.contentWindow) {
            doc = frame.contentWindow.document;
        }
    } catch (err) {
    }

    if (doc) { // successful getting content
        return doc;
    }

    try { // simply checking may throw in ie8 under ssl or mismatched protocol
        doc = frame.contentDocument ? frame.contentDocument : frame.document;
    } catch (err) {
        // last attempt
        doc = frame.document;
    }
    return doc;
}

function getTimeStamp() {
    return (new Date()).getTime();
}

// return date as YYYY-MM-DD string
function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}

function formatMoney(value) {
    if (!jQuery.isNumeric(value))
        return value;
    var moneyPrecision = 2;
    if (window.moneyPrecision)
        moneyPrecision = window.moneyPrecision;
    return value.toFixed(moneyPrecision).replace(/\d(?=(\d{3})+\.)/g, '$& ');
}

function appendUrlArgument(url, parameterName, parameterValue, replaceDuplicates, atStart /*Add param before others*/) {
    replaceDuplicates = replaceDuplicates || true;
    atStart = atStart || false;

    var cl, urlhash;
    if (url.indexOf('#') > 0) {
        cl = url.indexOf('#');
        urlhash = url.substring(cl, url.length);
    } else {
        cl = url.length;
        urlhash = '';
    }

    var sourceUrl = url.substring(0, cl);
    var urlParts = sourceUrl.split("?");
    var newQueryString = "";

    if (urlParts.length > 1 && urlParts[1] != '') {
        var parameters = urlParts[1].split("&");
        for (var i = 0; i < parameters.length; i++) {
            var parameterParts = parameters[i].split("=");
            if (!(replaceDuplicates && parameterParts[0] == parameterName)) {
                if (newQueryString == "")
                    newQueryString = "?";
                else
                    newQueryString += "&";
                newQueryString += parameterParts[0] + "=" + (parameterParts[1] ? parameterParts[1] : '');
            }
        }
    }

    if (newQueryString == "")
        newQueryString = "?";

    if (atStart) {
        newQueryString = '?' + parameterName + "=" + parameterValue + (newQueryString.length > 1 ? '&' + newQueryString.substring(1) : '');
    } else {
        if (newQueryString !== "" && newQueryString != '?')
            newQueryString += "&";
        newQueryString += parameterName + "=" + (parameterValue ? parameterValue : '');
    }

    return urlParts[0] + newQueryString + urlhash;
}



function addNewTableRow(elem, event) {
    setPreventDefault(event);

    var table = $(elem).closest('.table-edit > .table-content');

    var templateRow = table.children(".templates").children('.table-row-template').children('.table-edit-row');
    var isNestedTable = templateRow.length === 0;

    if (isNestedTable) {
        var nestedTableName = $(elem).closest(".table-row-row-view").data("table-name");
        nestedTableName = $(nestedTableName.split("-")).last()[0];

        templateRow = table.parents().find(".templates").children('.table-row-row-view').closest(".table-edit-wrapper").children('.table-edit')
            .find('.nested-table-row-template').children('.table-edit-row').filter(function () {
                return $(this).closest(".nested-table-row-template").data("table-name") === nestedTableName;
            });
    }

    var templateNestedTable = table.children(".templates").children('.table-row-row-view');
    if (!templateNestedTable || templateNestedTable.length === 0) {
        templateNestedTable = table.parents().find(".templates").children('.table-row-row-view');
    }

    var newRow = templateRow.clone(false);

    var keys = table.children('.table-edit-row').map(function () {
        return $(this).attr('data-rowkey');
    });

    var currentMaxkey;
    if (keys.length > 0) {
        currentMaxkey = Math.max.apply(Math, jQuery.map(keys, function (e) {
            return e;
        }));
    } else {
        currentMaxkey = 0;
    }

    newRow.attr('data-rowkey', currentMaxkey + 1);
    newRow.addClass('new-table-row');

    var tableName = table.parent().attr('data-name');
    var newRowKey = currentMaxkey + 1;
    var wrapper = $(elem).closest(".table-edit-wrapper");

    var parentTablePrefix = "";
    var tablePrefix = "";
    if (isNestedTable) {
        parentTablePrefix = wrapper.children(".table-edit").attr("data-name") + "-";
        tablePrefix = parentTablePrefix.split("-");
        tablePrefix = tablePrefix[tablePrefix.length - 2] + "-";
    }

    newRow.find('input:not([type=radio]), select, checkbox, textarea, ul, button[is-addressbook=true]').each(function () {

        if ($(this).attr('name')) {
            if (isNestedTable)
                $(this).attr('name', parentTablePrefix + $(this).attr('name').replace(tablePrefix, '') + "-" + newRowKey);
            else
                $(this).attr('name', $(this).attr('name') + '-' + newRowKey);
        }

        // data-field-name используется в контроле адресной книги
        if ($(this).attr('data-field-name')) {
            if (isNestedTable)
                $(this).attr('data-field-name', parentTablePrefix + $(this).attr('data-field-name').replace(tablePrefix, '') + "-" + newRowKey);
            else
                $(this).attr('data-field-name', $(this).attr('data-field-name') + '-' + newRowKey);
        }

        if ($(this).attr('data-name')) {

            if (isNestedTable)
                $(this).attr('data-name', parentTablePrefix + newRowKey);
            else
                $(this).attr('data-name', parentTablePrefix + $(this).attr('data-name') + '-' + newRowKey);
        }

        if ($(this).attr('data-parent-name')) {
            var currentValue = $(this).attr('data-parent-name');

            if (isNestedTable) {
                currentValue = currentValue.replace('parent', '').replace(tablePrefix, '');
                currentValue = parentTablePrefix + currentValue + "-" + newRowKey + "parent";
            }
            else
                currentValue = currentValue.substring(0, currentValue.length - 6) + "-" + newRowKey + "parent";
            $(this).attr('data-parent-name', currentValue);
        }

        if ($(this).attr('data-edit-required') === 'true') {
            $(this).removeAttr('data-edit-required');
            $(this).attr("required", true);
        }

        if ($(this).attr('data-dictionarygroup')) {
            $(this).attr('data-dictionarygroup',
                tableName + "-" + $(this).attr('data-dictionarygroup') + "-" + newRowKey);
        }
        if ($(this).attr('data-dictionaryParent')) {
            $(this).attr('data-dictionaryParent',
                tableName + "-" + $(this).attr('data-dictionaryparent') + "-" + newRowKey);
        }
        if ($(this).attr('data-addressbook-main-field')) {
            $(this).attr('data-addressbook-main-field',
                tableName + "-" + $(this).attr('data-addressbook-main-field') + "-" + newRowKey);
        }
    });

    newRow.find(".show-dict-btn").each(function () {
        if ($(this).attr('parent-id')) {
            $(this).attr('parent-id', tableName + "-" + $(this).attr('parent-id') + "-" + newRowKey);
        }
    });


    newRow.find("[data-dg-group]").each(function () {
        $(this).attr('data-dg-group', tableName + "-" + newRowKey + "-" + $(this).attr('data-dg-group'));
    });

    table.append(newRow);

    // если есть шаблон для вложенной таблицы, рендерим его внутри контейнера вложенной таблицы как шаблон для новой строки
    var nestedTables = templateNestedTable;
    if (nestedTables != undefined && nestedTables.length > 0) {
        var newRowRowViewDataKey = newRow.attr("data-rowkey");

        var parentTableName = wrapper.children(".table-edit").attr("data-name");

        newRow.children(".table-row-row-view").each(function () {
            $(this).remove();
        });

        nestedTables.each(function (index, table) {

            var nestedTable = $(table);

            var parentName = $(elem).closest(".table-row-row-view").data("table-name");//вложенная таблица
            // Если у нас parentName/parentTableName не из шаблонов, а из самой таблицы, то их имя будет с полным путём, в виде <grandparent_table_name>-<grandparent_row_id>-<parent_table_name>
            // а в шаблоне в data-parent-name указан только относительный путь, так что обрезаем всё лишнее.
            parentName = parentName ? parentName.split("-").pop() : parentTableName.split("-").pop(); //не вложенная таблица

            if (nestedTable.find('.table-edit').attr('data-parent-name') != parentName) return;

            var newRowRowView = nestedTable.clone(true);
            newRowRowView.find('input:not([type=radio]), select, checkbox, textarea').each(function () {
                $(this).attr('name', parentTableName + "-" + newRowRowViewDataKey + "-" + $(this).attr('name'));
                $(this).attr('data-field-name', parentTableName + "-" + newRowRowViewDataKey + "-" + $(this).attr('data-field-name')); // data-field-name используется в контроле адресной книги
                if ($(this).attr('data-dictionarygroup'))
                    $(this).attr('data-dictionarygroup', parentTableName + "-" + $(this).attr('data-dictionarygroup') + "-" + newRowRowViewDataKey);
                if ($(this).attr('data-dictionaryparent'))
                    $(this).attr('data-dictionaryparent', parentTableName + "-" + $(this).attr('data-dictionaryparent') + "-" + newRowRowViewDataKey);
            });

            newRowRowView.attr("data-rowkey", newRowRowViewDataKey);
            newRowRowView.attr("data-table-name", nestedTable.find(".table-edit").attr("data-name"));

            newRowRowView.find(".table-edit").each(function () {
                $(this).attr("data-deleted-rows-field", parentTableName + "-" + newRowRowViewDataKey + "-" + nestedTable.find(".table-edit").attr("data-deleted-rows-field"));
                $(this).attr("data-name", parentTableName + "-" + newRowRowViewDataKey + "-" + nestedTable.find(".table-edit").attr("data-name"));
            });
            newRowRowView.insertAfter(newRow.children().last());

            // чтобы сразу шаблон подчиненной таблицы появился
            var radioButton = newRow.find(".table-row-selector-radio")[0];
            if (radioButton != undefined) {
                changeNestedEditTableVisibility(radioButton);
            }
        });
    }

    newRow.find(".form-dictionary-control").each(function () {
        var item = $(this);
        if (item.attr("data-dictionaryparent") == "")
            setDictionaryField(item);
    });

    setEditTableRowVisibility('.table-edit-wrapper', table.closest('.table-edit-wrapper').parent());

    var datalistName = newRow.find('[data-wslist]').attr('data-wslist');
    newRow.find('[data-wslist]').attr('list', datalistName);
    reinitialiseScriptShort();

    var paramsObj = {
        rowKey: newRowKey,
        innerTableContainer: newRow
    };
    calcTableNUM(table);
    $(table).trigger("onTableRowAdded", paramsObj);

    window.adjustNewRowTextAreaHeight(newRow);
}


function copyTableRow(elem, event) {
    setPreventDefault(event);

    var table = $(elem).closest('.table-edit > .table-content');
    var oldRow = $(elem).closest(".table-edit-row");

    var newRow = $(elem).closest(".table-edit-row").clone(false);

    var templateRow = table.children(".templates").children('.table-row-template').children('.table-edit-row');
    var isNestedTable = templateRow.length === 0;

    if (isNestedTable) {
        var nestedTableName = $(elem).closest(".table-row-row-view").data("table-name");
        nestedTableName = $(nestedTableName.split("-")).last()[0];

    }

    var templateNestedTable = table.children(".templates").children('.table-row-row-view');
    if (!templateNestedTable || templateNestedTable.length === 0) {
        templateNestedTable = table.parents().find(".templates").children('.table-row-row-view');
    }


    lastKey = newRow.attr('data-rowkey');
    console.log(lastKey);

    var keys = table.children('.table-edit-row').map(function () {
        return $(this).attr('data-rowkey');
    });

    var currentMaxkey;
    if (keys.length > 0) {
        currentMaxkey = Math.max.apply(Math, jQuery.map(keys, function (e) {
            return e;
        }));
    } else {
        currentMaxkey = 0;
    }

    newRow.attr('data-rowkey', currentMaxkey + 1);

    var tableName = table.parent().attr('data-name');
    var newRowKey = currentMaxkey + 1;
    var wrapper = $(elem).closest(".table-edit-wrapper");

    var parentTablePrefix = "";
    var tablePrefix = "";
    if (isNestedTable) {
        parentTablePrefix = wrapper.children(".table-edit").attr("data-name") + "-";
        tablePrefix = parentTablePrefix.split("-");
        tablePrefix = tablePrefix[tablePrefix.length - 2] + "-";

        console.log(parentTablePrefix);
        console.log(tableName);
    }

    newRow.find('input:not([type=radio]), select, checkbox, textarea, ul, button[is-addressbook=true], div').each(function () {

        if ($(this).attr('name')) {
            if (isNestedTable)
                $(this).attr('name', parentTablePrefix + $(this).attr('name').replace(parentTablePrefix, '').replace('-' + lastKey, '-' + newRowKey));
            else
                $(this).attr('name', $(this).attr('name').replace('-' + lastKey, '-' + newRowKey));
        }

        if ($(this).attr('data-table-name')) {
            if (isNestedTable)
                $(this).attr('data-table-name', parentTablePrefix + $(this).attr('data-table-name').replace(parentTablePrefix, '').replace('-' + lastKey, '-' + newRowKey));
            else
                $(this).attr('data-table-name', $(this).attr('data-table-name').replace('-' + lastKey, '-' + newRowKey));
        }

        if ($(this).attr('data-deleted-rows-field')) {
            if (isNestedTable)
                $(this).attr('data-deleted-rows-field', parentTablePrefix + $(this).attr('data-deleted-rows-field').replace(parentTablePrefix, '').replace('-' + lastKey, '-' + newRowKey));
            else
                $(this).attr('data-deleted-rows-field', $(this).attr('data-deleted-rows-field').replace('-' + lastKey, '-' + newRowKey));
        }

        if ($(this).attr('data-deleted-attachment-keys')) {
            if (isNestedTable)
                $(this).attr('data-deleted-attachment-keys', parentTablePrefix + $(this).attr('data-deleted-attachment-keys').replace(parentTablePrefix, '').replace('-' + lastKey, '-' + newRowKey));
            else
                $(this).attr('data-deleted-attachment-keys', $(this).attr('data-deleted-attachment-keys').replace('-' + lastKey, '-' + newRowKey));
        }
        // data-field-name используется в контроле адресной книги
        if ($(this).attr('data-field-name')) {
            if (isNestedTable)
                $(this).attr('data-field-name', parentTablePrefix + $(this).attr('data-field-name').replace(parentTablePrefix, '').replace('-' + lastKey, '-' + newRowKey));
            else
                $(this).attr('data-field-name', $(this).attr('data-field-name').replace('-' + lastKey, '-' + newRowKey));
        }

        if ($(this).attr('data-name')) {
            console.log("FDATANAME");
            console.log(parentTablePrefix + newRowKey);
            if (isNestedTable)
                $(this).attr('data-name', parentTablePrefix + newRowKey);
            else
                $(this).attr('data-name', parentTablePrefix + $(this).attr('data-name').replace('-' + lastKey, '-' + newRowKey));
        }

        if ($(this).attr('data-parent-name')) {
            var currentValue = $(this).attr('data-parent-name');

            if (isNestedTable) {
                currentValue = currentValue.replace('parent', '').replace(tablePrefix, '');
                currentValue = parentTablePrefix + currentValue + "-" + newRowKey + "parent";
            }
            else
                currentValue = currentValue.substring(0, currentValue.length - 6).replace('-' + lastKey, '-' + newRowKey) + "parent";
            $(this).attr('data-parent-name', currentValue);
        }

        if ($(this).attr('data-edit-required') === 'true') {
            $(this).removeAttr('data-edit-required');
            $(this).attr("required", true);
        }

        if ($(this).attr('data-dictionarygroup')) {
            $(this).attr('data-dictionarygroup',
                tableName + "-" + $(this).attr('data-dictionarygroup').replace('-' + lastKey, '-' + newRowKey));
        }
        if ($(this).attr('data-dictionaryParent')) {
            $(this).attr('data-dictionaryParent',
                tableName + "-" + $(this).attr('data-dictionaryparent').replace('-' + lastKey, '-' + newRowKey));
        }
        if ($(this).attr('data-addressbook-main-field')) {
            $(this).attr('data-addressbook-main-field',
                tableName + "-" + $(this).attr('data-addressbook-main-field').replace('-' + lastKey, '-' + newRowKey));
        }
    });



    newRow.find(".show-dict-btn").each(function () {
        if ($(this).attr('parent-id')) {
            $(this).attr('parent-id', tableName + "-" + $(this).attr('parent-id').replace('-' + lastKey, '-' + newRowKey));
        }
    });

    newRow.find("span").each(function () {
        if ($(this).attr('data-related-field')) {
            $(this).attr('data-related-field', $(this).attr('data-related-field').replace('-' + lastKey, '-' + newRowKey));
        }
    });


    newRow.find("[data-dg-group]").each(function () {
        $(this).attr('data-dg-group', tableName.replace('-' + lastKey, '-' + newRowKey) + "-" + $(this).attr('data-dg-group'));
    });

    table.append(newRow);

    newRow.find(".bool-sel-ctl").each(function () {
        var item = $(this);
        var name = item.attr('name').substring(0, item.attr('name').lastIndexOf('-'));
        item.val($(oldRow[0]).find('[name^="' + name + '"]').val());
    });

    newRow.find(".form-dictionary-control").each(function () {
        var item = $(this);
        if (item.attr("data-dictionaryparent") == "")
            setDictionaryField(item);
    });

    setEditTableRowVisibility('.table-edit-wrapper', table.closest('.table-edit-wrapper').parent());

    var datalistName = newRow.find('[data-wslist]').attr('data-wslist');
    newRow.find('[data-wslist]').attr('list', datalistName);
    reinitialiseScriptShort();

    var paramsObj = {
        rowKey: newRowKey,
        innerTableContainer: newRow
    };
    calcTableNUM(table);
    $(table).trigger("onTableRowAdded", paramsObj);
}

function calcTableNUM(table) {
    var nums = table.closest(".table-edit").children(".table-content").children(".table-edit-row[data-rowkey]")
        .children(".table-edit-columns").find("input[type=hidden][name*='-NUM-']");
    var i = 1;

    nums.each(function () {
        var num = $(this);
        num.val(i);
        i++;
    });
}

function editTableRow(elem, event, js) {
    event.preventDefault();
    TableEditForm(elem, js);
}


function editTableRowByColumn(elem, event, js) {
    event.preventDefault();
    if ($(elem).closest(".table-content").find(".selector-all-row").filter(function () {
        return $(this).is(':checked');
    }).length == 0) {
        alert("Необходимо выбрать хотя бы одну строку.")
    } else {
        TableEditRowsByColumn(elem, js);
    }
}


function viewTableRow(elem, event, js) {
    event.preventDefault();
    TableViewForm(elem, js);
}


function removeTableRow(elem, event) {
    //для программного удаления 
    if (event !== undefined) {
        setPreventDefault(event);
    }

    var table = $(elem).closest('.table-edit');
    var deletingRowsField = table.find("input[type=hidden][name='" + table.attr('data-deleted-rows-field') + "']");
    var deletingRowKeys = deletingRowsField.val();
    if ($(elem).attr('groupedTable')) {
        $(elem).closest('.table-edit-row').find('.table-edit-row[data-rowkey]').each(function (index, value) {
            var deletingRowKeys = deletingRowsField.val();
            var rowGroupKey = $(value).attr('data-rowkey').split("-").pop();
            deletingRowsField.val(deletingRowKeys +
                rowGroupKey +
                ",");
        });

    } else {
        deletingRowsField.val(deletingRowKeys +
            $(elem).closest('.table-edit-row').attr('data-rowkey').split("-").pop() +
            ",");
    }
    //mark attachment keys on row to delete
    var deletingAttachmentsField = table.find("input[type=hidden][name='" + table.attr('data-deleted-attachment-keys') + "']");
    $(elem).closest('.table-edit-row').find('.attachment').each(function (index, value) {
        var attachmentKey = $(value).attr('data-attachmentKey');
        var deletingAttachmentKeys = deletingAttachmentsField.val();
        deletingAttachmentsField.val(deletingAttachmentKeys + attachmentKey + ",");
    });

    var row = $(elem).closest('.table-edit-row');
    row.find(".delete-table-row-attachment:visible").children(":first").click();

    var rowKey = row.attr("data-rowkey");
    $(table).trigger("onTableRowRemoving", rowKey);
    // Ищем нашу форму, в случае если у нас есть хотя бы одно поле типа money, то на форме висит событие submit.autoNumeric
    // Дальше мы удаляем строку из DOM, и плагин падает, т.к. он внутри себя запоминает настройки каждого поля с помощью jquery.data()
    // Поэтому удалим эвент, удалим строку и инициализируем плагин заново
    row.closest('form').off('submit.autoNumeric');
    row.remove();
    initAutonumeric();

    setEditTableRowVisibility('.table-edit-wrapper', table.closest(".table-edit-wrapper").parent());
    calcTableNUM(table);
    $(table).trigger("onTableRowRemoved", rowKey);
}

function removeAttachment(elem, event) {
    setPreventDefault(event);

    var table = $(elem).closest('.table-edit');
    var deletingAttachmentsField = table.find("input[type=hidden][name='" + table.attr('data-deleted-attachment-keys') + "']");
    var values = deletingAttachmentsField.val();

    var attachmentWrapper = $(elem).closest('.attachment-field-wrapper');

    var deletingAttachmentKey = attachmentWrapper.find(".attachment").attr("data-attachmentKey");
    deletingAttachmentsField.val(values + deletingAttachmentKey + ",");

    attachmentWrapper.find('.select-file-control').removeClass('hidden');
    attachmentWrapper.find('.view-file-control').addClass('hidden');
}

function urlParam(name) {
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results == null) {
        return null;
    }
    else {
        return decodeURI(results[1]) || 0;
    }
}

function createGuid() {
    function _p8(s) {
        var p = (Math.random().toString(16) + "000000000").substr(2, 8);
        return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
    }
    return _p8() + _p8(true) + _p8(true) + _p8();
}

function addTableRowAttachHandler() {

    setTimeout(function () {

        var attachInput = $('input[name="file-drop-area-hidden-attachmentFiles"]');

        if (attachInput.length > 0) {
            $('input[name="file-drop-area-hidden-attachmentFiles"]').click(function () {

                $('input[name^="file-drop-area-hidden-attachmentFiles"]:first').trigger("click");

                return false;
            });
        } else {
            addTableRowAttachHandler();
        }

    }, 100);
}

function addTableRowAttachment(elem, event) {
    setPreventDefault(event);

    //запоминаем идентификатор input'а, куда будет записываться
    var rowElement = elem.closest(".table-edit-row");
    var row = $(rowElement);
    var fileSelector = "[name$='-attachment-" + row.data("rowkey") + "']";
    var fileInput = row.find(fileSelector);
    //TODO: Завернуть все эти свойства в один объект
    window.attachmentName = fileInput.attr("name");
    window.attachmentKeyName = window.attachmentName.replace("attachment", "attachment_key");
    window.deleteTableRowAttachmentElement = row.find(".delete-table-row-attachment");
    window.doNotReload = true;
    window.files = "";
    window.fileKeys = "";
    window.addTableRowAttachmentWasClicked = true;
    window.filterGridColumnEnabled = true;
    window.filterGridColumn = "AttachmentDocType";
    window.filterGridColumnValue = "Документация процедуры закупки";

    var flowKey = urlParam('flowKey');
    var uniqueIds = urlParam('uniqueIds');
    var url = flowKey == null ?
        getBaseUrl() + "/ContextAction/CreateAttachment?isMultiple=false&allowedCategories=" + encodeURIComponent("Документация") + "&uniqueIds=" + uniqueIds :
        getBaseUrl() + "/ContextAction/CreateAttachment?isMultiple=false&allowedCategories=" + encodeURIComponent("Документация") + "&flowKey=" + flowKey;

    ModalHelper({
        dialog: "#actionDialog",
        url: url,
        isTargetBlank: false,
        afterSubmit: "addRowAttachment#" + url
    }).openWindow();

    if (window.location.pathname.toLowerCase().indexOf("/Edit".toLowerCase()) === -1) {
        addTableRowAttachHandler();
    }
}

function deleteTableRowAttachment(elem, event, smallDelete) {

    //скрываем кнопку удаления вложения в строку таблицы
    $(elem).parent().hide();

    //очищаем поля
    _deleteTableRowAttachment($(elem), smallDelete);
}

function _deleteTableRowAttachment(element, smallDelete) {
    //очищаем поля
    var row = element.closest(".table-edit-row");
    var rowKey = row.data("rowkey");
    var fileSelector = "[name$='-attachment-" + rowKey + "']";
    var fileInput = row.find(fileSelector);
    fileInput.val("");
    var fileKeySelector = "[name$='-attachment_key-" + rowKey + "']";
    var fileKeyInput = row.find(fileKeySelector);
    var key = fileKeyInput.val();
    fileKeyInput.val("");

    if (smallDelete)
        return;

    if (window.location.pathname.toLowerCase().indexOf("/Edit".toLowerCase()) !== -1) {

        $.ajax({
            url: getBaseUrl() + "/ContextAction/DeleteAttachmentHandler",
            type: 'POST',
            data: { clientGuid: key, uniqueIds: urlParam('uniqueIds') },
            cache: false
        });

    } else {

        //удаляем вложение
        var grid = window.grids[0]._gridInstance;
        var rows = grid.getVisibleRows();

        for (var i = 0; i < rows.length; i++) {
            var r = rows[i];
            if (r.data["AttachmentClientGuid"] == key) {
                grid.deleteRow(r.rowIndex);
                break;
            }
        }
    }
}

function disableTemplateRowValidation() {
    $('.table-row-template').find('input, select, checkbox, textarea').filter('[required]').each(function () {
        $(this).attr('data-edit-required', true);
        $(this).removeAttr('required');
    });
}

function loadLinks(control, event) {

    setPreventDefault(event);
    stopEvent(event);

    var plusMinus = $(control);

    var container = $(plusMinus.attr("data-collapse-selector"));
    if ($.trim(container.html()) === "") {

        container.addClass("text-center");
        container.append("<div class=\"loading-image\"></div>");
        var loadingImage = container.children(".loading-image").get(0);
        showLoadingIndicator(loadingImage);

        var url = plusMinus.attr("data-load-url");
        $.ajax({
            url: url,
            success: function (data) {

                container.empty();
                container.removeClass("text-center");
                container.append(data);
            },
            error: function () {
                var errorPanel = $("<div class='alert alert-danger'></div>");
                errorPanel.text("Не удалось загрузить связанные документы");
                var errorBody = $("<div class='modal-body'></div>");
                errorBody.append(errorPanel);
                container.append(errorBody);
            }
        });
    }
}


/* Ajax File Storage */

var ajaxFileStorage = {};
var ajaxFileStorageCounter = 0;

function isAjaxFileStorageSupported() {
    return window.FormData !== undefined;
}

function appendAjaxFile(form, name, file) {
    var formObj = $(form);

    var forms = $("form");
    if (forms.length > 1 && window.location.pathname.toLowerCase().indexOf("/Edit".toLowerCase()) === -1 && window.addTableRowAttachmentWasClicked)
        formObj = forms.first();

    var storage;
    var storageKey = formObj.attr('data-ajaxFileStorageKey');
    if (!storageKey) {
        storageKey = ++ajaxFileStorageCounter;
        formObj.attr('data-ajaxFileStorageKey', storageKey);

        storage = {};
        storage.counter = 0;
        storage.data = [];
        ajaxFileStorage[storageKey] = storage;
    } else
        storage = ajaxFileStorage[storageKey];

    var key = ++storage.counter;

    var item = {};
    item.name = name;
    item.file = file;
    item.id = id;
    storage.data[key] = item;
    return key;
}

function removeAjaxFile(form, key) {
    var formObj = $(form);

    var storageKey = formObj.attr('data-ajaxFileStorageKey');
    if (!storageKey)
        return;

    var storage = ajaxFileStorage[storageKey];
    if (!storage)
        return;

    var data = storage.data;
    if (data[key])
        delete data[key];

    formObj.trigger("onRemoveAjaxFile");
}

function getAjaxFiles(form) {
    var formObj = $(form);

    var storageKey = formObj.attr('data-ajaxFileStorageKey');
    if (!storageKey)
        return [];

    var storage = ajaxFileStorage[storageKey];
    if (!storage)
        return [];

    var result = [];
    for (var key in storage.data) {
        result.push({ key: key, data: storage.data[key] });
    }
    return result;
}

/* Ajax Forms */

function ajaxCall(url, method, success, error) {
    var actionUrl = url;
    method = method.toUpperCase();

    if (method == 'GET') {
        $.ajax({
            url: actionUrl,
            type: 'GET',
            contentType: false,
            cache: false,
            processData: false,
            success: success,
            error: error
        });

        return;
    }

    var extractJsonPart = function (responseMessage) {
        var openBrace = "{";
        var closeBrace = "}";
        var jsonExtract = "";

        if (responseMessage[0] == "{") {
            var openBracesCnt = 1;

            for (var i = 1; i < responseMessage.length; i++) {
                if (responseMessage[i] == openBrace) {
                    openBracesCnt++;
                }
                if (responseMessage[i] == closeBrace) {
                    openBracesCnt--;
                }
                if (openBracesCnt == 0) {
                    jsonExtract = responseMessage.substring(0, i + 1);
                    break;
                }
            }
        }

        return jsonExtract;
    }

    var handleSuccessCall = function (data) {
        var jSonExtractString = extractJsonPart(data);
        if (jSonExtractString) {
            var jsonExtract = JSON.parse(jSonExtractString);
            if (jsonExtract.status == "ERROR") {
                error({
                    responseText: jsonExtract.responseMessage,
                    allMessages: jsonExtract.allMessages
                });
            }
            if (jsonExtract.status == "OK") {
                success(jsonExtract.responseMessage, jsonExtract.afterSubmitJs);
            }
        } else {
            if (!data) {
                success(data);
            } else {
                error({ responseText: data });
            }
        }
    };

    var handleErrorCall = function (data) {
        error(data);
    };

    $.ajax({
        url: actionUrl,
        type: 'POST',
        contentType: false,
        cache: false,
        processData: false,
        success: handleSuccessCall,
        error: handleErrorCall
    });
}

function ajaxFormSubmit(form, success, error, beforeSend) {
    //TODO: Обязательно добавить блокировку кнопок перед ajax запросом, и разблокировку кнопок после запроса
    var formObj = $(form);
    var actionUrl = formObj.attr("action");
    var method = formObj.attr('method').toUpperCase();

    if (method == 'GET') {
        $.ajax({
            url: actionUrl,
            type: 'GET',
            data: formObj.serialize(),
            contentType: false,
            cache: false,
            processData: false,
            success: success,
            error: error
        });

        return;
    }

    var extractJsonPart = function (responseMessage) {
        var openBrace = "{";
        var closeBrace = "}";
        var jsonExtract = "";

        if (responseMessage[0] == "{") {
            var openBracesCnt = 1;

            for (var i = 1; i < responseMessage.length; i++) {
                if (responseMessage[i] == openBrace) {
                    openBracesCnt++;
                }
                if (responseMessage[i] == closeBrace) {
                    openBracesCnt--;
                }
                if (openBracesCnt == 0) {
                    jsonExtract = responseMessage.substring(0, i + 1);
                    break;
                }
            }
        }

        return jsonExtract;
    }

    var handleSuccessCall = function (data) {
        var jSonExtractString = extractJsonPart(data);
        if (jSonExtractString) {
            var jsonExtract = JSON.parse(jSonExtractString);
            console.log(jsonExtract);
            if (jsonExtract.status == "ERROR") {
                error({
                    responseText: jsonExtract.responseMessage,
                    allMessages: jsonExtract.allMessages,
                    fileName: jsonExtract.downloadFileName,
                    messageForUser: jsonExtract.messageForUser
                });
            }
            if (jsonExtract.status == "OK") {
                success(jsonExtract.responseMessage, jsonExtract.afterSubmitJs, jsonExtract.allMessages, jsonExtract);
            }
        } else {
            if (!data) {
                success(data);
            } else {
                error({
                    responseText: data
                });
            }
        }
    };

    var handleErrorCall = function (data) {
        error(data);
    };

    //событие перед отправкой формы
    $(form).trigger("beforeSubmit");

    // check HTML5 support
    if (window.FormData !== undefined) {
        var formData = new FormData(form);

        //n.volosatov
        var isUploadAttachment = typeof UploadAttachment !== "undefined" && $(".modal-title:visible:contains('Создать версию')").length == 0;
        var ajaxFiles = getAjaxFiles(form);
        var ajaxFilesLength = ajaxFiles.length;
        var ajaxFilesProps = {};

        for (var i = 0; i < ajaxFilesLength; i++) {
            var current = ajaxFiles[i];
            var item = current.data;

            if (isUploadAttachment) {

                var fileKey = current.key;
                var fileProps = UploadAttachment.getFileProps(fileKey);
                if (fileProps !== null) {
                    ajaxFilesProps[fileKey] = fileProps;
                    formData.append(item.name, item.file, fileKey);
                } else {
                    formData.append(item.name, item.file, item.file.name);
                }


            } else {
                formData.append(item.name, item.file, item.file.name);
            }
        }

        if (isUploadAttachment && ajaxFilesLength > 0)
            formData.append("attachmentFilesProps", JSON.stringify(ajaxFilesProps));


        $.ajax({
            url: actionUrl,
            type: 'POST',
            data: formData,
            mimeType: "multipart/form-data",
            contentType: false,
            cache: false,
            processData: false,
            beforeSend: beforeSend,
            success: handleSuccessCall,
            error: handleErrorCall
        }).then(function () {
            //resetActionsCache();
        });
    } else {
        // generate unique iframe
        var iframeId = 'unique' + (new Date().getTime());
        var iframe = $('<iframe src="javascript:false;" name="' + iframeId + '" ></iframe>');
        iframe.hide();

        // set form target to iframe
        formObj.attr('target', iframeId);

        var preloadHandler;
        preloadHandler = function () {
            iframe.unbind('load', preloadHandler);
            iframe.load(function (e) {
                var doc = getFrameDocument(iframe[0]);
                var docRoot = doc.body ? doc.body : doc.documentElement;
                var data = docRoot.innerHTML;

                handleSuccessCall(data);
                iframe.remove();
            });

            formObj.submit();
        };

        // add iframe to body
        iframe.bind('load', preloadHandler);
        iframe.appendTo('body');
    }
}

/* Loading Indicator */

function showLoadingIndicator(selector) {
    $(selector).addClass('loading-image-shown');
}

function hideLoadingIndicator(selector) {
    $(selector).removeClass('loading-image-shown');
}

/* hide block */
function hideBlock(block) {
    $(block).hide();
}
function showBlock(block) {
    $(block).show();
}

/* Navigation */

function onSelectNavigate(control) {
    document.location = control.options[control.selectedIndex].value;
}

/* Search result */

function getSearchResultSelectedUniqueIds(searchResultTable) {
    var result = [];
    var table = $(searchResultTable);

    var checkedInputs = table.find(".search-result-selector-checkbox:checked");
    checkedInputs.each(function (index, item) {
        var row = $(item).closest(".search-result-row");
        var menuItems = row.find(".search-result-column-actions li[data-itemUniqueId]");
        if (!menuItems.length)
            return;

        var uniqueId = menuItems.first().attr("data-itemUniqueId");
        if (uniqueId && $.inArray(uniqueId, result) < 0)
            result.push(uniqueId);
    });

    return result;
}

function getSearchResultSelectedUniqueIdsWithoutActionCheck(searchResultTable) {
    var result = [];
    var table = $(searchResultTable);

    var checkedInputs = table.find(".search-result-selector-checkbox:checked");
    checkedInputs.each(function (index, item) {
        var row = $(item).closest(".search-result-row");
        var uniqueId = row.attr("data-itemUniqueId");
        if (uniqueId && $.inArray(uniqueId, result) < 0)
            result.push(uniqueId);
    });

    return result;
}

function getSearchResultSelectedActionKeys(searchResultTable) {
    var result = [];
    var resultInitialised = false;
    var table = $(searchResultTable);

    var checkedInputs = table.find(".search-result-selector-checkbox:checked");
    checkedInputs.each(function (index, item) {
        var row = $(item).closest(".search-result-row");
        var menuItems = row.find(".search-result-column-actions li[data-actionKey]");

        if (!resultInitialised) {
            menuItems.each(function (actionIndex, actionItem) {
                var actionKey = $(actionItem).attr("data-actionKey");
                if (actionKey && $.inArray(actionKey, result) < 0)
                    result.push(actionKey);
            });

            resultInitialised = true;
        } else {
            var intersection = [];
            menuItems.each(function (actionIndex, actionItem) {
                var actionKey = $(actionItem).attr("data-actionKey");
                if (actionKey && $.inArray(actionKey, result) >= 0)
                    intersection.push(actionKey);
            });
            result = intersection;
        }
    });

    return result;
}

function setSearchResultTableMenuVisibility(searchResultTable) {
    var table = $(searchResultTable);
    var actionKeys = getSearchResultSelectedActionKeys(searchResultTable);

    var anyAllowedMenuItem = false;
    var anyAllowedSelectOption = false;

    table.find(".search-result-actions li[data-actionKey]").each(function (actionIndex, actionItem) {
        var actionKey = $(actionItem).attr("data-actionKey");
        var contains = $.inArray(actionKey, actionKeys) >= 0;
        anyAllowedMenuItem = anyAllowedMenuItem || contains;
        toggleVisibility(actionItem, contains);
    });

    table.find(".search-result-actions option[data-actionKey]").each(function (actionIndex, actionItem) {
        var actionKey = $(actionItem).attr("data-actionKey");
        var contains = $.inArray(actionKey, actionKeys) >= 0;
        anyAllowedSelectOption = anyAllowedSelectOption || contains;
        toggleVisibility(actionItem, contains);
    });

    toggleVisibility(table.find(".search-result-actions-selectorMenu"), anyAllowedMenuItem);
    toggleVisibility(table.find(".search-result-actions-selectorSelect"), anyAllowedSelectOption);

    table.each(function (index, item) {
        var selectionResultSelector = $(item).attr('data-selectionResult');
        if (selectionResultSelector) {
            var selectionResult = $(selectionResultSelector);
            selectionResult.val(getSearchResultSelectedUniqueIdsWithoutActionCheck(item));
        }
    });
}

function setSearchResultTableRowViewVisibility(searchResultTable) {
    var table = $(searchResultTable + ' > .search-result-table');

    table.find('.search-result-row').each(function () {
        var showTables = $(this).find('.nested-tables-visibility').is(":checked");
        var nestedTables = $(this).find('.table-row-row-view');
        if (showTables)
            nestedTables.show();
        else
            nestedTables.hide();
    });
}

function changeNestedViewTableVisibility(visibilityrBtn) {
    var nestedTables = $(visibilityrBtn).closest(".search-result-row").find("> .search-result-row-view");
    changeNestedTablesVisibility(visibilityrBtn, nestedTables);
}

function changeNestedEditTableVisibility(visibilityrBtn) {
    var nestedTables = $(visibilityrBtn).closest(".table-edit-row").find("> .table-row-row-view");
    changeNestedTablesVisibility(visibilityrBtn, nestedTables);
}

function changeNestedTablesVisibility(visibilityrBtn, nestedTables) {
    var hiddenChBox = $(visibilityrBtn).siblings(".nested-tables-visibility");
    var nestedTablesVisible = hiddenChBox.is(":checked");
    if (nestedTablesVisible) {
        hiddenChBox.prop("checked", false);
        visibilityrBtn.checked = false;
        nestedTables.hide();
        $(visibilityrBtn).trigger("checked:after", false);
    } else {
        hiddenChBox.prop("checked", true);
        visibilityrBtn.checked = true;
        nestedTables.show();
        $(visibilityrBtn).trigger("checked:after", true);
    }
}

function setEditTableRowVisibility(editTable, parentElement) {
    var table;
    if (parentElement)
        table = parentElement.find(editTable + ' > .table-edit').not(parentElement.find('.nested-table-row-template ' + editTable + ' > .table-edit'));
    else
        table = $(editTable + ' > .table-edit');

    table.find('.table-content > .table-edit-row').each(function () {
        var showTables = $(this).find('.nested-tables-visibility').is(":checked");
        var nestedTables = $(this).find('.table-row-row-view');
        if (showTables)
            nestedTables.show();
        else
            nestedTables.hide();
    });
}

function initialiseSearchResultTableScripts(searchResultTable) {

    function initialise(searchResultTable) {
        $(document).on('change', searchResultTable + " .search-result-actions-checkbox",
            function () {
                var checked = $(this).prop('checked');
                var selector = ":checked";
                if (checked) {
                    selector = ":not(:checked)";
                }
                $(searchResultTable + " .search-result-selector-checkbox" + selector).click();
                //$(searchResultTable + " .search-result-selector-checkbox").prop('checked', checked);

                setSearchResultTableMenuVisibility(searchResultTable);
            });

        $(document).on('change', searchResultTable + " .search-result-selector-checkbox",
            function () {
                var table = $(this).closest(".search-result");
                var selectedItemsDiv = table.find(".search-result-selected");
                var selectedItemsArray = selectedItemsDiv.val().split(',');
                var docId = $(this).closest(".search-result-row").attr("data-itemuniqueid");
                var newSelectedItemsString = "";

                if (!$(this).prop('checked')) {
                    $(searchResultTable + " .search-result-actions-checkbox").prop('checked', false);
                    var index = selectedItemsArray.indexOf(docId);
                    var firstPart = selectedItemsArray.slice(0, index);
                    var secondPart = selectedItemsArray.slice(index + 1, selectedItemsArray.length);
                    selectedItemsArray = firstPart.concat(secondPart);
                } else {
                    if (selectedItemsArray[0] !== "") {
                        selectedItemsArray.push(docId);
                    } else {
                        selectedItemsArray[0] = docId;
                    }
                }

                $.each(selectedItemsArray,
                    function (index, item) {
                        newSelectedItemsString += item;
                        if (index !== selectedItemsArray.length - 1) {
                            newSelectedItemsString += ",";
                        }
                    });

                selectedItemsDiv.val(newSelectedItemsString);

                var externalSelector = table.attr('data-selectionResult');
                if (externalSelector)
                    $(externalSelector).val(newSelectedItemsString);

                setSearchResultTableMenuVisibility(searchResultTable);

                // дизейбл кнопки создания извещения, если нет выбранных лотов. переподписка при загрузке новых результатов
                var table = $(this).closest(".search-result");
                var selectedItemsDiv = table.find(".search-result-selected");
                var btnDisabled = selectedItemsDiv.val() === "";
                $("#search-result-control-actions a.btn:first").attr("disabled", btnDisabled);
            });

        $(document).on('change', searchResultTable + " .search-result-selector-radio",
            function () {
                setSearchResultTableRowViewVisibility(searchResultTable);
            });
    }

    initialise(searchResultTable);
}

function initialiseTableEditScripts(innerTableContainer) {

    function initialize(innerTableContainer) {
        function invertClasses() {
            if ($(this).hasClass("show-nested-table-button")) {
                $(this).removeClass("glyphicon-th-list").removeClass("show-nested-table-button");
                $(this).addClass("hide-nested-table-button").addClass("glyphicon-pushpin");
            } else {
                $(this).removeClass("glyphicon-pushpin").removeClass("hide-nested-table-button");
                $(this).addClass("glyphicon-th-list").addClass("show-nested-table-button");
            }
        }

        $(innerTableContainer).find(".show-nested-table-button").click(invertClasses);
        $(innerTableContainer).find(".hide-nested-table-button").click(invertClasses);
    }

    $(document).on("onTableRowAdded", function (e, params) {
        if (params.innerTableContainer != null) {
            initialize(params.innerTableContainer);
        }
    });

    $(document).on("onDocumentModalWindowLoaded", function (e, params) {
        if (params.innerTableContainer != null) {
            initialize(params.innerTableContainer);
        }
    });

    initialize(innerTableContainer);
}

function onSearchResultTableMenuClick(searchResultTable, control, dialog, event) {
    var href = $(control).attr("href");
    var uniqueIds = getSearchResultSelectedUniqueIds(searchResultTable);
    var uniqueIdsUrl = encodeURIComponent(uniqueIds.join());

    setPreventDefault(event);
    openActionUrlAsModal(dialog, href + "&uniqueIds=" + uniqueIdsUrl, false);
}

function onSearchResultTableMenuClick(searchResultTable, control, event) {
    var href = $(control).attr("href");
    var uniqueIds = getSearchResultSelectedUniqueIds(searchResultTable);
    var uniqueIdsUrl = encodeURIComponent(uniqueIds.join());

    setPreventDefault(event);

    var url = href + "&uniqueIds=" + uniqueIdsUrl;

    var windowType;
    var actionName = $(control).text(); //$(control).parent().attr("data-actionkey");
    var objectType = $(searchResultTable).find(".search-result-table").attr("data-objecttype");

    var result = checkAccess(actionName, uniqueIds, objectType);

    if (!result.isPassed) {
        showUserNotification("Ошибка при проверке доступности действия для группы объектов", result.notificationMessage);
    } else {
        windowType = $(control).attr("data-windowtype");
        handleUrl(url, windowType);
    }
}

function showUserNotification(notifTitle, notifText) {
    var notificationDialog = $('#modalNotification');
    if (notificationDialog) {
        var messageContent = notificationDialog.find('#notificationWindowText');
        if (messageContent) messageContent.text(notifText);
        var messageTitle = notificationDialog.find('#notificationWindowTitle');
        if (messageTitle) messageTitle.text(notifTitle);
        notificationDialog.modal('show');
    }
}

function handleUrl(url, windowType, afterSubmit, control) {
    $("#btn-ok_from_modal").unbind("click");

    switch (windowType) {
        case "NoWindow":
            {
                TryAjaxHandleUrl(url, function (readyUrl) {
                    document.location = readyUrl;
                });
                break;
            }
        case "NoWindowWithBlank":
            {
                TryAjaxHandleUrl(url, function (readyUrl) {
                    openUrlInNewTab(readyUrl);
                });
                break;
            }
        case "DialogWindowWithResultOnBlank":
            {
                ModalHelper({
                    dialog: '#actionDialog',
                    url: url,
                    isTargetBlank: true,
                    afterSubmit: afterSubmit,
                    control: control
                }).openWindow();
                break;
            }
        case "InfoWindow":
            {
                ModalHelper({
                    dialog: '#modalInfo',
                    url: url,
                    isTargetBlank: false,
                    afterSubmit: afterSubmit,
                    control: control,
                    keepScripts: true
                }).openWindow();
                break;
            }
        case "DialogWindowDeleteAttachment":
        case "DialogWindow":
        default:
            {
                //запоминаем текущую вкладку
                saveCurrentHash();
                ModalHelper({
                    dialog: '#actionDialog',
                    url: url,
                    isTargetBlank: false,
                    afterSubmit: windowType === "DialogWindowDeleteAttachment" ? "deleteAttachment#" + url : afterSubmit,
                    control: control,
                    keepScripts: true
                }).openWindow();
                break;
            }
    }
}

//открываем урл и добавляем в querystring текущий урл
function openWindowWithReturnUrl(url) {
    var currentUrl = encodeURIComponent(document.location.pathname + document.location.search);
    document.location = url + "?returnUrl=" + currentUrl;
}

function openWindowWithReturnUrlAdditional(url) {
    var currentUrl = encodeURIComponent(document.location.pathname + document.location.search);
    document.location = url + "&returnUrl=" + currentUrl;
}

//Пробует выполнить ajax запрос с указанным url. Если все хорошо - запускаем обработку с полученным в ответе url (например, открываем в текущей либо новой вкладке).
//Если не получилось прочитать json в отчете - действуем по старому, т.е. работаем с оригинальным url
function TryAjaxHandleUrl(url, urlActionCallback) {
    $.ajax({
        url: url,
        type: 'GET',
        contentType: false,
        cache: false,
        processData: false,
        beforeSend: function (request) {
            request.setRequestHeader("NeedToReturnJson", true);
        }
    })
        .done(function (data, ttt) {
            if (data) {
                try {
                    var res = JSON.parse(data);
                    if (res) {
                        if (res.status === "ERROR") showCommonErrors(res.responseMessage);
                        else if (res.status === "OK") urlActionCallback(res.responseMessage);
                        return;
                    }
                } catch (e) {
                    //если не получилось распарсить json, сичтаем что все ок и ошибки не было
                }

                //работаем с оригинальным url (если никакого json в отвкете не пришло)
                urlActionCallback(url);
            }
        })
        .fail(function (data) {
            showCommonErrors(data);
        });
}

function checkAccess(actionName, selectedItems, objectType) {
    var isPassed = true;
    var notificationMessage;

    var url = getAbsoluteUrl("GroupActionAccessibility/VerifyAccess");
    var data = { 'uniqueIds': selectedItems, 'actionName': actionName, 'objectType': objectType };

    $.ajax({
        url: url,
        type: "POST",
        async: false,
        data: data,
        success: function (data) {
            isPassed = data.result;
            notificationMessage = data.errorMessage;
        },
        error: function (data) {
            isPassed = false;
        },
        traditional: true   // чтобы массив передался как надо
    });

    return {
        isPassed: isPassed,
        notificationMessage: notificationMessage
    }
}

function openUrlInNewTab(url) {
    window.open(url, '_blank');
}

function onSearchResultTableMenuClickNoWindow(searchResultTable, control, event) {
    var href = $(control).attr("href");
    var uniqueIds = getSearchResultSelectedUniqueIds(searchResultTable);
    var uniqueIdsUrl = encodeURIComponent(uniqueIds.join());

    setPreventDefault(event);

    if (uniqueIds.length === 0) {
        document.location = href;
    } else {
        document.location = href + "&uniqueIds=" + uniqueIdsUrl;
    }
}

function onSearchResultTableMenuSelect(searchResultTable, control, event) {
    var href = control.options[control.selectedIndex].value;
    var uniqueIds = getSearchResultSelectedUniqueIds(searchResultTable);
    var uniqueIdsUrl = encodeURIComponent(uniqueIds.join());

    setPreventDefault(event);
    document.location = href + "&uniqueIds=" + uniqueIdsUrl;
}

function toggleSearchResultRowEllipsis(control) {
    $(control).find(".search-result-ellipsis-cell").toggleClass("search-result-noellipsis-cell");
}

function toggleSearchResultCellEllipsis(control) {
    $(control).toggleClass("search-result-noellipsis-cell");
}

function toggleSearchResultParentRowEllipsis(control, event) {
    if ($(control).hasClass("search-result-row")) {
        $(control).find(".search-result-ellipsis-cell").toggleClass("search-result-noellipsis-cell");
    } else {
        $(control).closest(".search-result-row").find(".search-result-ellipsis-cell").toggleClass("search-result-noellipsis-cell");
    }

    stopEvent(event);
}

function openXmlData(control, event) {
    if ($(control).length > 0) {
        var data = $(control)[0].attributes["data"].value;
        saveTextAs(data, "download.xml");
    }

    stopEvent(event);
}

function resendToEis(control, attemptId) {
    var par = $(control).parent();
    par.empty();
    var loadingPane = $('<div style="visibility: visible;" class="loading-image-small"></div>');
    loadingPane.appendTo(par);

    var getUrl = window.location;
    var baseUrl = getUrl.protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    baseUrl += '/ContextAction/ReSendToEISHandler?attemptsId=' + attemptId;

    $.ajax({
        url: baseUrl,
        type: 'POST',
        contentType: false,
        cache: false,
        processData: false,
        timeout: 60 * 60 * 1000
    }).then(function (res) {
        var parsedRes = JSON.parse(res);
        if (parsedRes.status == 'OK') {
            alert('Повторная отправка в ЕИС прошло успешно');
        } else {
            alert('Ошибка приповторной отправке в ЕИС ' + parsedRes.message);
        }
        window.location.reload();
    });
}

function toggleRoutesViewCollapse(control, event) {
    setPreventDefault(event);
    stopEvent(event);

    var item = $(control);
    var processRow = item.closest(".routesView-process-row");

    var activityRow;
    if (processRow.hasClass("routesView-collapsed")) {
        activityRow = processRow.next();
        while (activityRow.length && activityRow.hasClass("routesView-activity-row")) {
            activityRow.removeClass("routesView-collapsed");
            activityRow = activityRow.next();
        }

        processRow.removeClass("routesView-collapsed");
    } else {
        activityRow = processRow.next();
        while (activityRow.length && activityRow.hasClass("routesView-activity-row")) {
            activityRow.addClass("routesView-collapsed");
            activityRow = activityRow.next();
        }

        processRow.addClass("routesView-collapsed");
    }
}

function openActionUrlAsModal(dialog, url, openResultOnBlankPage, preAjaxSubmitFunction, useDefaultSubmit) {

    var modal = $(dialog);
    var modalBody = modal.find(".modal-body-wrapper");
    var pageUrl = appendUrlArgument(url, "rand", getTimeStamp());

    modalBody.load(pageUrl + " .context-action-page-body", function () {
        if (!$(this).html()) {
            var errorUrl = $(this).attr('data-empty-body-error-url');
            if (errorUrl) {
                document.location = errorUrl;
                return;
            }

            var errorMessage = $(this).attr('data-empty-body-error-message');
            if (errorMessage) {
                var errorPanel = $("<div class='alert alert-danger'></div>");
                errorPanel.text(errorMessage);
                var errorBody = $("<div class='modal-body'></div>");
                errorBody.append(errorPanel);
                $(this).append(errorBody);

                var closeClickHandler = function (event) {
                    setPreventDefault(event);
                    modal.modal('hide');
                };

                modal.find(".btn-submit").click(closeClickHandler);
                modal.on('hidden.bs.modal', function () {
                    modal.find(".btn-submit").unbind("click", closeClickHandler);
                });

                modal.modal('show');
                return;
            }
        }

        resetDictionaryFields();
        modal.find(".action-page-scripts .action-page-script").each(function (index, item) {
            var scriptUrl = $(item).attr("data-url");
            $.getScript(scriptUrl);
        });

        reinitialiseScripts();
        modal.find(".action-page-buttons").hide();

        var form = modal.find(".action-form");

        var _hasParsleyValidation;
        //Свойство показывает есть ли у формы, parsley валидация
        var hasParsleyValidation = function () {

            if (_hasParsleyValidation == null)
                _hasParsleyValidation = form.hasClass("parsley-validation");

            return _hasParsleyValidation;
        }

        //Обработчик клика на кнопку submit формы
        var clickHandler = function (event) {
            setPreventDefault(event);

            //Если есть parsley валидация то прежде чем отправлять форму на сервер, проверяем что валидация пройдена
            if (hasParsleyValidation()) {
                var formValidator = form.parsley();
                formValidator.whenValidate().done(submitDocument);
                return false;
            }


            submitDocument();

            function submitDocument() {
                if (!openResultOnBlankPage) {
                    if ($('[name="isSignEDS"]').is(':checked')) {
                        if ($('[name="certificateList"]').find("input:checked").val() == undefined) {
                            $('[name="signInfo"]').html("<FONT color='red'>Выберите сертификат для создания подписи</FONT>");
                        }
                        else {
                            if ($('#signAttachments').is(':checked')) {
                                EDS.SignDocumentWithAtachments(
                                    function () {
                                        form.attr("target", "_blank");
                                        modal.find("button[data-dismiss='modal']").click();
                                    });
                            }
                            else {
                                var isSignAllAttachment = $('[data-name="isSignAllAttachment"]').val();
                                if (isSignAllAttachment) {
                                    EDS.SignAttachments(
                                        function () {
                                            form.attr("target", "_blank");
                                            modal.find("button[data-dismiss='modal']").click();
                                        });
                                }
                                else {
                                    var isAttachEDS = $('[name="isAttachEDS"]').is(':checked');
                                    if (isAttachEDS) {
                                        EDS.SignCreate(function () {
                                            form.attr("target", "_blank");
                                            modal.find("button[data-dismiss='modal']").click();
                                        });
                                    }
                                    else {
                                        EDS.SignCreate(function () {
                                            var isApproval = $("[data-name='activitySignature']").val();
                                            if (isApproval !== undefined) {
                                                form.find("[type='submit']").click();
                                            } else {
                                                form.attr("target", "_blank");
                                                modal.find("button[data-dismiss='modal']").click();
                                            }
                                        });
                                    }
                                }
                            }
                        }

                    }
                    else {
                        form.find("[type='submit']").click();
                    }
                }
                else {
                    form.attr("target", "_blank");
                    modal.find("button[data-dismiss='modal']").click();
                    form.find("[type='submit']").click();
                }
            }
        };

        modal.find(".btn-submit").prop('disabled', false); // Mozilla Fix
        modal.find(".btn-submit").click(clickHandler);
        modal.on('hidden.bs.modal', function () {
            modal.find(".btn-submit").unbind("click", clickHandler);
            modal.find(".modal-dialog").removeClass("modal-large");
            modal.find(".modal-dialog").removeClass("modal-medium");
        });

        var loadingImage = modal.find(".modal-footer .loading-image");
        var operationStart = function () {
            form.find("[type='submit']").prop('disabled', true);
            modal.find(".btn-submit").prop('disabled', true);

            loadingImage.each(function () {
                showLoadingIndicator($(this).get(0));
            });
        };
        var operationFinish = function () {
            form.find("[type='submit']").prop('disabled', false);
            modal.find(".btn-submit").prop('disabled', false);

            loadingImage.each(function () {
                hideLoadingIndicator($(this).get(0));
            });
        };

        //прячет/показывает разде div html-разметки
        function ChangeVisibility(divId) {
            var x = document.getElementById(divId);
            if (x.style.display === 'none') {
                x.style.display = 'block';
            } else {
                x.style.display = 'none';
            }
        }

        var operationSuccessFinish = function () {
            ChangeVisibility('div-context-submit');
            ChangeVisibility('div-context-modal');
            ChangeVisibility('send-to-eis-question');

            loadingImage.each(function () {
                hideLoadingIndicator($(this).get(0));
            });
        };

        var submitHandler;
        var formDomObject = form.get(0);
        var formDomObjectAddHandler = function () {
            $(formDomObject).bind("submit", submitHandler);
        };
        var formDomObjectRemoveHandler = function () {
            $(formDomObject).unbind("submit", submitHandler);
        };

        submitHandler = function (event) {

            if (useDefaultSubmit)
                return;

            setPreventDefault(event);
            operationStart();

            formDomObjectRemoveHandler();
            if (typeof preAjaxSubmitFunction != 'undefined') {
                preAjaxSubmitFunction();
            }
            //$("input[hidden][data-parent-name]").remove(); включить для очистки формы от фантомных записей         
            ajaxFormSubmit(
                formDomObject,
                function (data) {
                    if (data) {
                        var successMessage = modal.find(".success-message");
                        successMessage.text(data);
                        successMessage.removeClass("hide");

                        formDomObjectAddHandler();
                        operationSuccessFinish();
                    } else {
                        var returnUrl = $(formDomObject).find("input[name='returnUrl']").val();
                        if (returnUrl)
                            window.location = returnUrl;
                        else
                            window.location.reload();
                    }
                },
                function (data) {
                    var errorMessage = modal.find(".error-message");
                    errorMessage.text(data.responseText);
                    errorMessage.removeClass("hide");

                    formDomObjectAddHandler();
                    operationFinish();
                });
        };

        if (!openResultOnBlankPage)
            formDomObjectAddHandler();

        // событие загрузки модального окна
        var onModalWindowLoadedParamsObj = {
            validatedFormSelector: ".action-form",
            innerTableContainer: modal
        };
        $(document).trigger('onDocumentModalWindowLoaded', onModalWindowLoadedParamsObj);

        modal.modal('show');
    });
}

function handleLinkActionAndDisable(control, dialog, event) {
    $("#btn-ok_from_modal").unbind("click");

    function disableButton() {
        $(control).attr("style", "display:none");
    }

    var link = $(control);
    var url = link.attr("href");
    var openResultOnBlankPage = link.attr("target") == "_blank";

    setPreventDefault(event);

    ModalHelper({
        dialog: dialog,
        url: url,
        isTargetBlank: openResultOnBlankPage,
        beforeSubmit: disableButton,
        useDefaultSubmit: undefined
    }).openWindow();
}

function handleDynamicLinkAction(control, dialog, event, preprocessorFunction, param) {
    if (preprocessorFunction) preprocessorFunction(control, dialog, event, param);
}

function handleLinkAction(control, dialog, event, beforeSubmit, afterSubmit, keepScripts) {
    $("#btn-ok_from_modal").unbind("click");
    console.log("handleLinkAction1");
    var link = $(control);
    var url = link.attr("href");
    var openResultOnBlankPage = link.attr("target") == "_blank";
    var useDefaultSubmit = link.attr("data-useDefaultSubmit") == "true";
    var dontSubmit = link.attr("dontSubmit") == "true";

    var beforeHandler = function (e, form) {
        //запоминаем текущую вкладку
        saveCurrentHash();

        if (beforeSubmit)
            return beforeSubmit(e, form);
    }


    setPreventDefault(event);

    ModalHelper({
        dialog: dialog,
        url: url,
        isTargetBlank: openResultOnBlankPage,
        beforeSubmit: beforeHandler,
        afterSubmit: afterSubmit,
        control: control,
        event: event,
        useDefaultSubmit: useDefaultSubmit,
        dontSubmit: dontSubmit,
        keepScripts: keepScripts
    }).openWindow();

    //openActionUrlAsModal(dialog, url, openResultOnBlankPage, undefined, useDefaultSubmit);
}

function saveCurrentHash(hash) {
    var name = decodeURIComponent(window.location.pathname);
    var value = window.location.hash;
    updateSessionStorage(name, value);
}

function getSavedHash() {
    var name = decodeURIComponent(window.location.pathname);
    return getFromSessionStorage(name);
}

function removeSavedHash() {
    var name = decodeURIComponent(window.location.pathname);
    return removeFromSessionStorage(name);
}

function removeFromSessionStorage(name) {
    if (!sessionStorage || !name)
        return;
    return sessionStorage.removeItem(name);
}

function updateSessionStorage(name, value) {
    if (!sessionStorage)
        return;

    sessionStorage.setItem(name, value);
}

function getFromSessionStorage(name) {
    if (!sessionStorage || !name)
        return;
    return sessionStorage.getItem(name);
}

//cookies helper
function readCookie(name) {
    var nameEQ = name + "=",
        ca = document.cookie.split(';'),
        i = 0,
        c = '';
    for (i; i < ca.length; i += 1) {
        c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) === 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function createCookie(name, value, days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
}

function createCookieMinutes(name, value, minutes) {
    if (minutes) {
        var date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";

    document.cookie = name + "=" + value + expires + "; path=/";
}

function deleteCookie(name) {
    var date = new Date();
    date.setTime(date.getTime() + (-1 * 24 * 60 * 60 * 1000));
    var expires = "; expires=" + date.toGMTString();
    document.cookie = name + '="" ;' + expires + '; path=/';
}

//можно ли создать план. если нельзя - возвращает текст ошибки
function checkCreatePlanPossible(event, form) {
    return checkOpenFormPossible(event, form);
}

function checkOpenFormPossible(event, form) {
    var deferred = jQuery.Deferred();

    var formObj = $(form);
    var actionUrl = formObj.attr("action");

    $.ajax({
        url: actionUrl,
        async: true,
        data: formObj.serialize(),
        contentType: false,
        cache: false,
        processData: false
    }).done(function (xhr, textStatus, data) {
        var resultErrors;
        try {
            var res = JSON.parse(xhr);
            if (res && res.status === "ERROR") {
                resultErrors = res.responseMessage;
            }
        } catch (e) {
            //если не получилось распарсить json, сичтаем что все ок и ошибки не было
        }

        deferred.resolve(resultErrors);
    });

    return deferred;
}

//При переходе по ссылке добавляет якорь текущего активного таба (например, требуется при редактировании переходить на такой же таб, как и при просмотре)
function appendActiveTabAnchorToLink(control, linkHashPrefix, event) {
    //определяем id блока текущего выделенного элемента
    var blockId = $("#viewNavigationTabs").find('li.active').find('a').data("block-id");

    if (blockId) {
        //Если определили id блока - перенаправляем вручную на страницу с якорем
        event.preventDefault();
        window.location.href = $(control).attr("href") + linkHashPrefix + blockId;
    } else {
        window.location.href = $(control).attr("href");
    }
}

function refreshSearchResult(control, event) {
    if ($('#' + control).data('dxDataGrid')) {
        dxGridReloadData(control);
    } else {
        var currentPageUrl = $(".current.navigation-item").data("url");
        if (currentPageUrl) searchResultLoad(control, currentPageUrl);
    }
}

function searchResultSort(control, event) {
    setPreventDefault(event);
    var url = $(control).parent("div").find(".sortUrl").val();
    if (!(control.dataset.sorttype === "AZ" && $(control).hasClass("search-result-header-asc"))) {
        var urlSym = url.indexOf('?') > -1 ? '&' : '?';
        url = url + urlSym + "sortKey=" + encodeURIComponent(control.dataset.fieldkey) + "&sort=" + control.dataset.sorttype;
    }

    searchResultLoad(control, url);
}

function searchResultNavigate(control, event) {
    setPreventDefault(event);
    var url = $(control).attr('href');
    searchResultLoad(control, url);
}

function searchResultLoad(control, url) {
    url = url + "&r=" + Math.random() * 99999;
    var navigation = $(control).closest('.search-result-navigation');
    if (navigation.hasClass('loading'))
        return;
    var searchResult = $(control).closest('.search-result');
    if (searchResult.length > 0) {

        navigation.addClass('loading');
        waitingDialog.show('Поиск');
        var selectedItemsString = $(control).closest(".search-result").find(".search-result-selected").val();
        var selectedItemsArray = selectedItemsString ? selectedItemsString.split(',') : [];

        /*n.volosatov: поиск с get'а на пост. берем сохраненные данные формы и передаем в метод load, 
        если значения будут то load сделает пост + обрезаем урл до queryString'a и добавлем страницу в пост дату
        */
        var formdata = $("#hfSearchFormData").val() ? JSON.parse($("#hfSearchFormData").val()) : null;
        if (formdata) {
            var page = getQueryStringParameterByName("page", url);
            if (page) {
                formdata.push({
                    "name": "page",
                    "value": page
                });
            }
            //url = url.split("?")[0];
        }
        /*end*/

        searchResult.load(url + " .search-result", formdata,
            function () {
                var selectedItemsDiv = searchResult.find(".search-result-selected");
                selectedItemsDiv.val(selectedItemsString);
                var searchResultRows = $(".search-result-table > div.search-result-row");
                $.each(searchResultRows,
                    function (index, row) {
                        var rowCheckBox = $(row).find(".search-result-selector-checkbox");
                        var docId = $(row).attr("data-itemuniqueid");
                        if (selectedItemsArray.indexOf(docId) !== -1) {
                            rowCheckBox.attr("checked", true);
                        }
                    });
                waitingDialog.hide();
                navigation.removeClass('loading');
                reinitialiseScripts();
            });
    }
}

function getSelectedSearchResultIds(searchResultTable) {
    var selectedItemsDiv = $(searchResultTable).find(".search-result-selected");
    return selectedItemsDiv.val().split(',');
}

//функция для блокировки при взятии на редактирование

function editButtonCustomLogicPreprocessorFunction(control, dialog, event, param) {

    var overrideLockHandler = function () {
        $.post(param.TryToForceUnLockUrl, { documentKey: param.DocumentKey }, function (data) {
            if (data && data.success) {
                editButtonCustomLogicPreprocessorFunction(control, dialog, event, param);
            }
        });
    };
    event.preventDefault();

    //Не даем пользователю случайно сделать несколько кликов подряд.
    if (!ct.common.delayPassed(control, 6))
        return;

    $.post(param.TryToLockUrl, { documentKey: param.DocumentKey }, function (data) {
        if (data && data.success) {
            appendActiveTabAnchorToLink(control, '#regcard-', event);
        } else { //id dfadmin
            if (param.CanOverrideEditLock) {
                ModalHelper({
                    dialog: dialog,
                    url: param.FailToLockWithOverrideUrl,
                    isTargetBlank: false,
                    beforeSubmit: overrideLockHandler,
                    control: control,
                    event: event,
                    useDefaultSubmit: false,
                    dontSubmit: true,
                }).openWindow();
            } else { //normal user
                ModalHelper({
                    dialog: '#modalInfo',
                    url: param.FailToLockUrl,
                    isTargetBlank: false,
                    beforeSubmit: null,
                    control: control,
                    event: event,
                    useDefaultSubmit: false,
                    dontSubmit: true,
                }).openWindow();
            }
        }
    });
}


/* Mobile */

function bootstrapForceCollapse(control) {
    var item = $(control);

    var headerLink = item.find('.panel-heading a[data-toggle=collapse]');
    var bodyBlock = item.find('.panel-collapse');

    if (headerLink.length)
        headerLink.addClass('collapsed');

    if (bodyBlock.length) {
        bodyBlock.removeClass('in');
        bodyBlock.css('height', '0px');
    }
}

function setMobileDefaults() {
    var xsMaxWidth = 767;
    var width = $(window).width();

    if (width <= xsMaxWidth) {
        bootstrapForceCollapse('#documentView-controlCard-accordion');
        bootstrapForceCollapse('#documentView-documentLinks-accordion');
        bootstrapForceCollapse('#documentView-attachments-accordion');

        var anchor = getUrlAnchor();
        if (anchor.indexOf('activity-') != 0)
            bootstrapForceCollapse('#documentView-routes-accordion');

        bootstrapForceCollapse('#registerView-controlCard-accordion');
        bootstrapForceCollapse('#registerView-documentLinks-accordion');
        bootstrapForceCollapse('#registerView-attachments-accordion');
    }
}

function reinitialiseMobileSettings() {
    var smMaxWidth = 991;
    var width = $(window).width();

    if (width <= smMaxWidth) {
        $('input[type="file"][multiple]').prop('multiple', false);
    }
}

setMobileDefaults();

/* Scripts */

function setReadOnlyWithCheckbox() {
    $("input[type='checkbox'][readonly]").readonly();
    $("select.bool-sel-ctl[readonly]").readonly();
    $("select.bool-sel-ctl[readonly]").addClass('readonly-field');
}

function onSelectBoolChange() {
    var item = $(this);
    var checked = item.is(':checked');
    if (checked) {
        item.next().val('1');
    } else {
        item.next().val('0');
    }
}

function onSelectTableChange() {
    var item = $(this);
    var checked = item.is(':checked');
    if (checked) {
        item.closest(".table-content").find(".selector-all-row").prop("checked", true);;
    } else {
        item.closest(".table-content").find(".selector-all-row").prop("checked", false);;
    }
}

function setEnabledWithRadios() {
    $(".enabled-with-radio").each(function () {
        var item = $(this);
        var radioId = item.attr("data-radio");
        var radio = $("#" + radioId);
        var disabled = !radio.is(':checked');

        item.prop("disabled", disabled);

        var isRequired = item.attr("data-required");
        var isRequiredValue = isRequired && (isRequired.toLowerCase() == "true" || isRequired.toLowerCase() == "required");
        if (isRequiredValue)
            item.prop("required", !disabled);

        $(this).find("input, select, textarea").each(function () {
            var childItem = $(this);
            childItem.prop("disabled", disabled);
            if (isRequiredValue)
                childItem.prop("required", !disabled);
        });
    });
}

function setEnabledWithSelect() {
    $(".enabled-with-select").each(function () {
        var item = $(this);
        var selectId = item.attr("data-select");
        var selectValues = item.attr("data-select-value").split(',');
        var select = $("#" + selectId);
        var value = select.val();

        var disabled = true;
        for (var i = 0; i < selectValues.length; i++) {
            if ($.trim(selectValues[i]) == value) {
                disabled = false;
                break;
            }
        }

        item.prop("disabled", disabled);

        var isRequired = item.attr("data-required");
        var isRequiredValue = isRequired && (isRequired.toLowerCase() == "true" || isRequired.toLowerCase() == "required");
        if (isRequiredValue)
            item.prop("required", !disabled);

        $(this).find("input, select, textarea").each(function () {
            var childItem = $(this);
            childItem.prop("disabled", disabled);
            if (isRequiredValue)
                childItem.prop("required", !disabled);
        });
    });
}

function setVisibleWithSelect() {
    var hidden = true;

    function checkVisibility(item) {
        var selectId = item.attr("data-select");
        var selectValues = item.attr("data-select-value").split(',');
        var select = $("#" + selectId);
        var value = select.val();

        for (var i = 0; i < selectValues.length; i++) {
            if ($.trim(selectValues[i]) == value) {
                hidden = false;
                break;
            }
            hidden = true;
        }
    }

    $(".visible-with-select").each(function () {
        var item = $(this);
        if (!item.attr("data-select-value")) {
            // надо определить видимость блока
            var itemInBlock = item.find("[data-select-value]").first();
            checkVisibility(itemInBlock);
        } else {
            checkVisibility(item);
        }

        if (!hidden)
            item.removeClass("js-hidden");
        else
            item.addClass("js-hidden");
    });
}

function setRequiredWithRadios() {
    $(".required-with-radio").each(function () {
        var item = $(this);
        var radioSelector = item.attr("data-radio-selector");

        var isRequired = false;
        $(radioSelector).each(function () {
            if ($(this).is(':checked'))
                isRequired = true;
        });

        item.prop("required", isRequired);
        item.removeClass('user-error');

        $(this).find("input, select, textarea").each(function () {
            var childItem = $(this);
            childItem.prop("required", isRequired);
            childItem.removeClass('user-error');
        });
    });
}

function cloneJObject(obj) {
    var clone = obj.clone(false);

    var sourceElements = obj.find('input, select, textarea');
    var clonedElements = clone.find('input, select, textarea');
    clonedElements.each(function (index) {
        var sourceElement = $(sourceElements.get(index));

        var inputType = sourceElement.attr('type');
        if (sourceElement.get(0).tagName != 'INPUT' || inputType != 'file')
            $(this).val(sourceElement.val());
    });

    return clone;
}

function activateMultipleEditors() {
    $(".multiple-editor:not(.inited)").each(function () {
        var editor = $(this);

        var appendButton = $('<div class="multiple-editor-append btn btn-default btn-sm glyphicon glyphicon-plus"></div>');
        appendButton.insertAfter(editor);

        var buttonParent = appendButton.parent();
        if (!buttonParent.hasClass('clearfix'))
            buttonParent.addClass('clearfix');

        var input = editor.find("input, select, textarea");
        input.attr('data-required', input.prop('required'));

        editor.toggleClass('empty', !input.val());
        editor.addClass("inited");
    });
}

function multipleEditorAppend() {
    var item = $(this);
    var itemWrapper = item.prev();

    var input = itemWrapper.find("input, select, textarea");
    var inputVal = $.trim(input.val());
    if (!inputVal)
        return;

    var existValues = [];

    var editorList = null;
    editorList = itemWrapper.nextAll('.multiple-editor-list');

    if (editorList.length === 0) {
        editorList = $("<ul class='multiple-editor-list'></ul>").insertAfter(item);
    }

    editorList.children().each(function () {
        $(this).children('input[type="hidden"]').each(function () {
            existValues.push($(this).val());
        });
    });

    if (existValues.indexOf(inputVal) >= 0)
        return;

    var listItem = $("<li></li>");

    var hiddenField = $("<input type='hidden'>");
    hiddenField.attr('name', input.attr('name'));
    hiddenField.val(inputVal);
    hiddenField.appendTo(listItem);

    var textField = $("<span></span>");
    if (input.get(0).tagName == 'SELECT')
        textField.text(input.children(':selected').text());
    else
        textField.text(inputVal);

    textField.appendTo(listItem);

    var removeItem = $('<div class="multiple-editor-remove glyphicon glyphicon-remove-circle"></div>');
    removeItem.appendTo(listItem);

    listItem.appendTo(editorList);

    input.prop('required', false);
    input.closest('.multiple-editor').toggleClass('empty', false);
    input.val('');
}

function multipleEditorRemove() {
    var removeItem = $(this);
    var listItem = removeItem.closest('.multiple-editor-list li');
    var editorList = removeItem.closest('.multiple-editor-list');
    var editor = editorList.parent();
    listItem.remove();

    var displayField = editor.find(".mult-dict-display");
    var displayName = editor.
        find('input[data-name="name"]').
        map(function () {
            return $(this).val();
        }).
        get().
        join(", ");
    displayField.val(displayName);
}

function activateCollapseButtons() {
    $(".collapse-button").each(function () {
        var item = $(this);
        if (item.hasClass('collapse-button-inited'))
            return;

        if (!item.hasClass('glyphicon'))
            item.addClass('glyphicon');

        //item.live('click', function (event) {
        item.on('click', function (event) {
            setPreventDefault(event);
            stopEvent(event);

            item.toggleClass('collapse-button-collapsed');
            setCollapseButton(this);
        });

        setCollapseButton(this);
        item.addClass('collapse-button-inited');
    });
}

function onFileEditorAppendFiles(editor, files) {
    var item = $(editor);
    var maxFileSize = item.attr('data-maxFileSize');
    var errorSelector = item.attr('data-errorSelector');
    var errorMessage = item.attr('data-errorMessage');

    if (!window.FileReader)
        return;

    if (!$(errorSelector).hasClass('hide'))
        $(errorSelector).addClass('hide');

    var filteredFiles = [];
    var isOverflow = false;

    for (var sourceIndex = 0; sourceIndex < files.length; sourceIndex++) {
        var sourceFile = files[sourceIndex];
        if (maxFileSize > 0 && sourceFile.size > maxFileSize)
            isOverflow = true;
        else
            filteredFiles.push(sourceFile);
    }

    var showOverflowError = function () {
        if (!isOverflow)
            return;

        $(errorSelector).html(errorMessage);
        $(errorSelector).removeClass('hide');
    };

    if (!filteredFiles.length) {
        item.val('');
        showOverflowError();
        return;
    }

    if (!isAjaxFileStorageSupported())
        return;

    var form = item.closest('form').get(0);
    var name = item.attr('data-name');
    var list = item.parent().find('.file-drop-area-list');
    var newDoc = window.location.pathname.toLowerCase().indexOf("/BasedOn".toLowerCase()) !== -1;
    var isDialog = (newDoc && !$("#" + name).is(":visible")) ||
        (!newDoc && window.addTableRowAttachmentWasClicked);

    for (var filteredIndex = 0; filteredIndex < filteredFiles.length; filteredIndex++) {

        if (isDialog && filteredIndex > 0)
            break;

        if (!item.prop('multiple')) {
            var ajaxFileKeys = [];
            list.find('.file-drop-area-remove-icon').each(function () { ajaxFileKeys.push($(this).attr("data-ajaxFileKey")); });
            list.empty();

            for (var index = 0; index < ajaxFileKeys.length; index++) {
                removeAjaxFile(form, ajaxFileKeys[index]);
            }
        }

        var filteredFile = filteredFiles[filteredIndex];


        //n.volosatov        
        if (typeof UploadAttachment !== "undefined" && $(".modal-title:visible:contains('Создать версию')").length == 0) {
            var ajaxFileKey = appendAjaxFile(form, name, filteredFile);

            if (isDialog && typeof window.files !== 'undefined') {
                window.files = files[0].name;
            }

            UploadAttachment.addFile(item, ajaxFileKey, filteredFile.name);

            //в задачке EUPDEV-2913 сказано, что если док новы и диалоговое окно - ничего закрывать автоматом не надо
            //if (isDialog && newDoc) {
            //    $("#actionDialog").modal('hide');
            //    addRowAttachment();
            //}

        } else {

            var ajaxFileKey = appendAjaxFile(form, name, filteredFile);
            var listItem = $("<li></li>");

            var fileNameItem = $("<span class='file-drop-area-file-name'></span>");
            fileNameItem.text(filteredFile.name);
            listItem.append(fileNameItem);

            var removeItem = $('<div class="glyphicon glyphicon-remove-circle file-drop-area-remove-icon"></div>');
            removeItem.attr("data-ajaxFileKey", ajaxFileKey);

            removeItem.click(function (event) {
                setPreventDefault(event);
                stopEvent(event);

                var key = $(this).attr("data-ajaxFileKey");
                var itemForm = item.closest('form').get(0);
                removeAjaxFile(itemForm, key);
                $(this).closest('li').remove();

                var inputItem = $(itemForm).find("input[type='file']");
                var isEmpty = !getAjaxFiles(itemForm).length;
                inputItem.prop('required', inputItem.attr('data-required').toLowerCase() == 'true' && isEmpty);
                inputItem.closest('.file-drop-area').toggleClass('empty', isEmpty);
            });

            listItem.append(removeItem);
            list.append(listItem);
        }
    }

    // вызываем только 1 раз после добавления всех выбранных файлов
    $(form).trigger("onAppendAjaxFiles");

    var isDropAreaEmpty = !getAjaxFiles(form).length;
    item.prop('required', item.attr('data-required').toLowerCase() == 'true' && isDropAreaEmpty);
    item.closest('.file-drop-area').toggleClass('empty', isDropAreaEmpty);
    item.val('');
    showOverflowError();
}

function onFileEditorChange(event) {
    onFileEditorAppendFiles(this, event.target.files);
}

function onFileDropAreaDrop(control, event) {
    setPreventDefault(event);
    stopEvent(event);

    var editor = $(control).find("input[type='file']").get(0);
    onFileEditorAppendFiles(editor, event.dataTransfer.files);
}

function activateAjaxFileEditors() {
    if (!isAjaxFileStorageSupported())
        return;

    $('body').off('change', 'input[type="file"]');
    $("body").on('change', 'input[type="file"]', onFileEditorChange);

    var onDropAreaClick = function () {
        var dropArea = $(this).closest('.file-drop-area');
        var input = dropArea.find("input[type='file']");
        input.click();
    };

    $(".file-drop-area:not(.inited)").each(function () {
        var dropArea = $(this);

        if (dropArea.closest(".table-row-template").length > 0)
            return;

        var input = dropArea.find("input[type='file']");
        var id = input.attr('id');
        input.attr('id', '');
        dropArea.attr('id', id);
        input.attr('data-name', input.attr('name'));
        input.attr('name', 'file-drop-area-hidden-' + input.attr('name'));
        input.attr('data-required', input.prop('required'));

        input.click(stopEvent);
        dropArea.find('.file-drop-area-title').click(onDropAreaClick);

        if (window.FileReader) {
            var areaControl = dropArea.get(0);

            areaControl.ondragover = function () {
                $(this).toggleClass('hover', true);
                return false;
            };

            areaControl.ondragleave = function () {
                $(this).toggleClass('hover', false);
                return false;
            };

            areaControl.ondrop = function (event) {
                $(this).toggleClass('hover', false);
                onFileDropAreaDrop(this, event);
            };
        }

        dropArea.toggleClass('empty', true);
        dropArea.addClass("inited");
    });
}

function activateDataListIcons() {
    $('[list], [data-wslist]').each(function () {
        var item = $(this);
        var parent = item.parent();
        if (parent.hasClass('ui-wrapper'))
            return;

        item.wrap("<div></div>");
        parent = item.parent();
        parent.addClass('ui-wrapper');

        var tool = $("<div></div>");
        tool.addClass('ui-tool-button');
        tool.addClass('ui-tool-dropdown');
        tool.prependTo(parent);
    });
}

function setCollapseButton(control) {
    var item = $(control);
    var selector = item.attr('data-collapse-selector');

    if (item.hasClass('collapse-button-collapsed')) {
        item.addClass('glyphicon-plus');
        item.removeClass('glyphicon-minus');
        $(selector).addClass('js-hidden');
    } else {
        item.removeClass('glyphicon-plus');
        item.addClass('glyphicon-minus');
        $(selector).removeClass('js-hidden');
    }
}

function resetDictionaryFields() {
    var dictionaryControls = $(".form-dictionary-control");
    dictionaryControls.each(function () {
        var item = $(this);
        if (item.attr("data-dictionaryparent") == "")
            setDictionaryField(item);
    });
}

function setDictionaryField(item) {
    var selectedDictItem;
    var childDictControls = $(".form-dictionary-control[data-dictionaryparent='" + item.attr('name') + "']");

    if (childDictControls.length > 0) {
        if (item.is('select')) {
            selectedDictItem = item.find(":selected")[0];
        } else if (item.is('input')) {
            var datalist = $("datalist[id='" + item.attr('list') + "']");
            selectedDictItem = datalist.find("option[value='" + item.val() + "']")[0];
        }

        childDictControls.each(function () {
            var child = $(this);
            if (child.is('select')) {
                var dataEntryParent = $(selectedDictItem).attr('data-entryid');
                child.find("option").each(function () {
                    var option = $(this);
                    var parentEntryAttr = option.attr("data-entryparent");
                    if (parentEntryAttr == null || parentEntryAttr == false) {
                        option.toggleOption(true);
                    } else if (parentEntryAttr == dataEntryParent) {
                        option.toggleOption(true);
                    } else {
                        option.toggleOption(false);
                    }
                });
            } else if (child.is('input')) {
                child.removeAttr('list');
                child.attr('list', $(selectedDictItem).attr('data-entryid'));
            }
            child.change();
        });

        reinitialiseScripts();
    }

    //n.volosatov - хак для возможности писать новые значения в поле словаря при редактирование атачмента
    if (item.parents(".modal").length > 0) {
        var currentValue = item.val();
        var autocompleteElementID = item.attr("list");
        if (autocompleteElementID) {
            var autocompleteElement = $("#" + autocompleteElementID);
            var hasValue = false;
            $.each(autocompleteElement.children(), function (i, element) {
                hasValue = currentValue === $(element).val();
                if (hasValue)
                    return false;
            });
            if (!hasValue) {
                var random = Math.floor((Math.random() * 9999999) + 1000000);
                var entryId = autocompleteElementID + "-" + random;
                var optionsStr = "<option data-entrykey='" + currentValue + "' data-entryid='" + entryId + "' data-entryparent='" + autocompleteElementID + "' value='" + currentValue + "'>" + currentValue + "</option>";
                var newOption = $(optionsStr);
                autocompleteElement.append(newOption);
            }
        }
    }
}

jQuery.fn.toggleOption = function (show) {
    jQuery(this).toggle(show);
    if (show) {
        if (jQuery(this).parent('span.toggleOption').length)
            jQuery(this).unwrap();
    } else {
        if (jQuery(this).parent('span.toggleOption').length == 0)
            jQuery(this).wrap('<span class="toggleOption" style="display: none;" />');
    }
};

function onFormDictionaryControlChange() {
    var item = $(this);

    setDictionaryField(item);

    var dictionaryGroup = item.attr('data-dictionaryGroup');
    if (!dictionaryGroup)
        return;

    if (item.hasClass('form-dictionary-control-changing'))
        return;

    item.addClass('form-dictionary-control-changing');

    var selectedOption;
    if (item.is("select")) {
        selectedOption = item.children('option[value="' + item.val() + '"]');
    } else {
        var datalistId = item.attr("list");
        selectedOption = $("#" + datalistId).find('option[value="' + item.val() + '"]');
    }
    var selectedEntryKey = selectedOption.attr('data-entryKey');

    var groupDictionaries = $('.form-dictionary-control[data-dictionaryGroup="' + dictionaryGroup + '"]');
    groupDictionaries.each(function () {
        var groupDictionary = $(this);
        if (groupDictionary.hasClass('form-dictionary-control-changing'))
            return;

        var groupDictionarySelectedOption;
        if (groupDictionary.is("select")) {
            groupDictionarySelectedOption = groupDictionary.children('option[data-entryKey="' + selectedEntryKey + '"]');
        } else {
            var listId = groupDictionary.attr("list");
            groupDictionarySelectedOption = $("#" + listId).find('option[data-entryKey="' + selectedEntryKey + '"]');
        }
        //var groupDictionarySelectedOption = groupDictionary.find('option[data-entryKey="' + selectedEntryKey + '"]');
        var value = groupDictionarySelectedOption.attr('value');
        groupDictionary.val(value);
    });

    item.removeClass('form-dictionary-control-changing');
}

function wrapUrls() {
    var urlPattern = /((http(s)?:\/\/)(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6})?)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/g;
    var wrappedLinkPattern = /((<a href.+)(http(s)?:\/\/)(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,6})?)\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)<\/a>)/g;

    $('.documentView').find('.documentView-field-value, .search-result-cell-value').html(function (_, html) {
        if (wrappedLinkPattern.test(html))
            return html;
        return html.replace(urlPattern, '<a href="$1" title="$1" target="_blank">$1</a>');
    });
}

//$("input[type='radio']").live("change", setEnabledWithRadios);
//$("input[type='radio']").live("change", setRequiredWithRadios);
$("body").on('change', 'input[type="radio"]', setEnabledWithRadios);
$("body").on('change', 'input[type="radio"]', setRequiredWithRadios);

//$("select").live("change", setEnabledWithSelect);
//$("select").live("change", setVisibleWithSelect);
$(document).on('change', 'select', setEnabledWithSelect);
$(document).on('change', 'select', setVisibleWithSelect);

//$(".multiple-editor-append").live("click", multipleEditorAppend);
//$(".multiple-editor-remove").live("click", multipleEditorRemove);
$("body").on('click', '.multiple-editor-append', multipleEditorAppend);
$("body").on('click', '.multiple-editor-remove', multipleEditorRemove);


//$("input[type='file']").live('change', onFileEditorChange);
$("body").on('change', 'input[type="file"]', onFileEditorChange);

$(".multiple-editor-append").on('change', 'click', multipleEditorRemove);

//$(".form-dictionary-control").live('change', onFormDictionaryControlChange);
$("body").on('change', '.form-dictionary-control', onFormDictionaryControlChange);

/*initialiseSearchResultTableScripts('.search-result');*/


/**
 * Назначает контролы выбора календарей и ввода времени.
 * Зависит от Modernizr, JQuery, JQuery.UI.Datepicker, Inputmask
 * Аккуратно, здесь очень много хардкода под генератор форм легкого клиента. 
 */
function updateDatepickers() {

    var update = function () {

        if ($.fn.datetimepicker) {

            function hasNonStaticParent(el) {

                var parent = el;
                if (parent) {
                    if (parent.css('position') === 'static') {
                        parent = parent.parents().filter(function () {
                            return $(this).css('position') !== 'static';
                        }).first();
                    }
                }

                return parent.length !== 0;
            }

            function resolveWrapper(el) {
                var wrapper = el.closest(".table-edit-wrapper, .modal-content-wrapper");
                return wrapper && hasNonStaticParent(wrapper) ? wrapper : null;
            }

            $("div.input-group.date[data-type='date']").each(function () {

                $(this).datetimepicker({
                    format: 'DD.MM.YYYY',
                    locale: 'ru',
                    widgetPositioning: {
                        // принудительно выставляем правое выравнивание календаря, чтобы не выходил за границу окна
                        horizontal: "right"
                    },
                    disabledTimeIntervals: [[moment({ h: 0, m: 0, s: 1 }), moment({ h: 23, m: 59, s: 59 })]],
                    widgetParent: resolveWrapper($(this))
                });
            });

            $("div.input-group.date[data-type='datetime']").each(function () {

                $(this).datetimepicker({
                    format: 'DD.MM.YYYY HH:mm:ss',
                    locale: 'ru',
                    widgetPositioning: {
                        // принудительно выставляем правое выравнивание календаря, чтобы не выходил за границу окна
                        horizontal: "right"
                    },
                    widgetParent: resolveWrapper($(this))
                });
            });

            $("div.input-group.date[data-type='nosecdatetime']").each(function () {

                $(this).datetimepicker({
                    format: 'DD.MM.YYYY HH:mm',
                    locale: 'ru',
                    widgetPositioning: {
                        // принудительно выставляем правое выравнивание календаря, чтобы не выходил за границу окна
                        horizontal: "right"
                    },
                    widgetParent: resolveWrapper($(this))
                });
            });

            $("div.input-group.date[data-type='time']").each(function () {

                $(this).datetimepicker({
                    format: 'hh:mm:ss',
                    locale: 'ru',
                    widgetPositioning: {
                        // принудительно выставляем правое выравнивание календаря, чтобы не выходил за границу окна
                        horizontal: "right"
                    },
                    widgetParent: resolveWrapper($(this))
                });
            });

            $("div.input-group.year[data-type='year']").each(function () {

                $(this).datetimepicker({
                    format: "YYYY",
                    locale: 'ru',
                    widgetPositioning: {
                        // принудительно выставляем правое выравнивание календаря, чтобы не выходил за границу окна
                        horizontal: "right"
                    },
                    widgetParent: resolveWrapper($(this))
                });
            });
        }

        try {
            if (typeof ChronoGroups !== 'undefined')
                ChronoGroups.Init();
        }
        catch (ex) {
            console.log(ex);
        }

        //хак для отобарадения датапикера в таблице, при редактирование документа.
        //у таблицы и у ячейки может стоять overflow, что не дает отобразить окошко выбора пикеру.
        //ломает календарь, input'ы исчезают
        /*var pickers = $("div.input-group.date[data-type='date']");
        $.each(pickers,
            function (index, element) {
                var current = $(element);
                if (current.parents(".table-edit-row").length > 0) {
                    current.on('dp.show',
                        function () {
                            var parent = $(this).parent();
                            var originPosition = parent.position().left;
                            parent.addClass("date-fix-position");
                            parent.css({ 'left': originPosition });

                            var parentCell = parent.parents(".table-edit-column.date.search-result-no-ellipsis-cell");

                            if (parentCell.length > 0)
                                parentCell.css("overflow-x", "visible");
                        });

                    current.on('dp.hide',
                        function () {
                            var parent = $(this).parent();
                            parent.removeClass("date-fix-position");

                            var parentCell = parent.parents(".table-edit-column.date.search-result-no-ellipsis-cell");

                            if (parentCell.length > 0)
                                parentCell.css("overflow-x", "hidden");

                        });
                } else if (current.parents(".modal-body").length > 0) {
                    var modalBodyElement = $(".modal-body");
                    if (modalBodyElement.find("form").height() < 250) {
                        //modalBodyElement.css("overflow-y", "visible"); //ломает модалку CreateDocumentLink
                    } else {
                        modalBodyElement.css("overflow-y", "auto");
                    }
                }
            });*/
    };

    // Событие появления модального окна редактирования, ищем элементы повторно
    $(document).on('shown.bs.modal', function () {
        update();
    });

    // Событие добавления строки в таблицу, ищем элементы повторно
    $(document).on('onTableRowAdded', function () {
        update();
    });

    // Событие загрузки документа через Ajax
    $(document).on('onDocumentAjaxLoaded', function () {
        update();
    });

    // Событие происходит когда в селекте выбирается элемент, 
    // который должен поставить disabled на другие элементы
    $(document).on('change', "input[type='checkbox'][hidden-ctl='true']", onSelectBoolChange);

    $(document).on('change', "input[type='checkbox'].selector-all-rows", onSelectTableChange);

    $(document).on('change', 'select', function () {


        if ($(this).hasClass("bool-sel-ctl")) {

            //  $(this).children('option[selected]').removeAttr("selected");
            //  $(this).children('option[value="' + $(this).val() + '"]').attr("selected", "selected");


            if ($(this).val() == "1") {
                $(this).prev().prop("checked", true);
            } else {
                $(this).prev().prop("checked", false);
            }
        }
        // Постараемся не ломать поведение по-умолчанию если на странице нет полей которые надо 
        // скрывать в зависимости от значения селекта
        if ($(".enabled-with-select".length > 0)) {
            update();
        }
    });

    update();
}

/* dynamic loading */

var dynamicLoading = {
    elements: [],
    isRunning: false,

    getUniqueSelector: function (selector) {
        var spaceIndex = selector.indexOf(' ');

        var urlPart, selectorPart;
        if (spaceIndex < 0) {
            urlPart = selector;
            selectorPart = '';
        } else {
            urlPart = selector.substr(0, spaceIndex);
            selectorPart = selector.substr(spaceIndex + 1);
        }

        var randDelimiter = urlPart.indexOf('?') >= 0 ? "&" : "?";
        var randPart = "rand=" + new Date().getTime();

        var result = urlPart + randDelimiter + randPart;
        if (spaceIndex >= 0)
            result += ' ' + selectorPart;

        return result;
    },

    loadOne: function (callback) {
        if (this.elements.length < 1)
            return false;

        var element = this.elements[0];
        this.elements.shift();

        var item = $(element.node);
        var wrapper = $("<div>");

        var selector = this.getUniqueSelector(element.url);
        wrapper.load(selector, function () {
            item.after(wrapper.html());
            item.remove();

            callback();
        });

        return true;
    },

    loadNext: function () {
        var _ = this;
        if (_.isRunning)
            return;

        _.isRunning = _.loadOne(function () {
            _.isRunning = false;
            _.loadNext();
        });
    },

    push: function (node, url) {
        this.elements.push({ node: node, url: url });
        this.loadNext();
    }
};

function startReplaceScripts() {
    $("[data-replace-url]").each(function () {
        var item = $(this);

        var url = item.attr('data-replace-url');
        item.removeAttr('data-replace-url');

        dynamicLoading.push(item.get(0), url);
    });

    $("[data-badge-url]").each(function () {
        var item = $(this);

        var url = item.attr('data-badge-url');
        item.removeAttr('data-badge-url');
        url = dynamicLoading.getUniqueSelector(url);

        setTimeout(function () { delayedLoadBadgeCount(url, item) }, 1000);
    });
}


function delayedLoadBadgeCount(url, item) {
    if ($(".dx-loadpanel.dx-state-invisible").length == 0 && $(".dx-loadpanel").length == 1) {
        setTimeout(function () { delayedLoadBadgeCount(url, item) }, 1000);
        return;
    }

    $.get(url,
        function (data) {
            if (data && data > 0) {
                var badge = $("<span class='badge'></span>");
                badge.html(data);

                item.after(badge);
                item.after("<span> </span>");
                item.remove();
            } else {
                item.remove();
            }
        });
}


function reinitialiseScripts() {

    function reinitialise() {
        reinitialiseMobileSettings();
        setReadOnlyWithCheckbox();
        setEnabledWithRadios();
        setRequiredWithRadios();
        setEnabledWithSelect();
        setVisibleWithSelect();
        setSearchResultTableMenuVisibility('.search-result');
        setSearchResultTableRowViewVisibility('.search-result');
        setEditTableRowVisibility('.table-edit-wrapper');
        activateMultipleEditors();
        activateCollapseButtons();
        activateAjaxFileEditors();
        activateDataListIcons();
        ct.common.dictionary.fillDisplayFields();
        startReplaceScripts();

        wrapUrls();
        disableTemplateRowValidation();

        $.fn.modal.Constructor.prototype.enforceFocus = function () {
            var modal_this = this;

            $(document)
                .on('focusin.modal',
                    function (e) {
                        if (!modal_this.$element.has(e.target).length) {
                            //modal_this.$element.focus();
                        }
                    });
        };

        initAutonumeric();

        $(document).updatePolyfill();
    }

    // подписки
    $(document).on("onDocumentAjaxLoaded",
        function () {
            reinitialise();
        });

    reinitialise();
}



function reinitialiseScriptShort() {
    reinitialiseMobileSettings();

    setEnabledWithRadios();
    setRequiredWithRadios();
    setReadOnlyWithCheckbox();
    setEnabledWithSelect();
    setVisibleWithSelect();
    setSearchResultTableMenuVisibility('.search-result');
    setSearchResultTableRowViewVisibility('.search-result');
    setEditTableRowVisibility('.table-edit-wrapper');
    activateMultipleEditors();
    activateCollapseButtons();
    activateAjaxFileEditors();
    activateDataListIcons();
    ct.common.dictionary.fillDisplayFields();
    startReplaceScripts();
    //wrapUrls();
    disableTemplateRowValidation();
    enableToolTips();

    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        var modal_this = this;

        $(document).on('focusin.modal', function (e) {


            if (!modal_this.$element.has(e.target).length) {
                //modal_this.$element.focus();
            }
        });
    };

    initAutonumeric();

    $(document).updatePolyfill();
}

var waitingDialog = waitingDialog || (function ($) {
    'use strict';

    // Creating modal dialog's DOM
    var $dialog = $(
        '<div class="modal fade" data-backdrop="static" data-keyboard="false" tabindex="-1" role="dialog" aria-hidden="true" style="padding-top:15%; overflow-y:visible;">' +
        '<div class="modal-dialog modal-sm">' +
        '<div class="modal-content">' +
        '<div class="modal-body" style="text-align:center;">' +
        '<div><h3 class="loading-message"></h3></div>' +
        '<div class="loading-image loading-image-shown">' +
        '</div>' +
        '</div></div></div>');

    return {

        dlg: $dialog,

        show: function (message, options) {
            var it = this;
            if ($(".modal-backdrop:visible").length === 0) {

                $dialog.find("h3").text(message);
                $dialog.find(".modal-content").css("visibility", "visible");
                $dialog.find(".loading-image.loading-image-shown").removeAttr("style");
                $dialog.modal();
            } else {

                setTimeout(function () {
                    it.show(message, options);
                }, 350);
            }
        },
        showCtrlShiftSkip: function (event, message, options) {
            var it = this;
            if (!event.ctrlKey && !event.shiftKey) {
                it.show(message, options);
            }
        },
        showWaiting: function (force) {
            var it = this;
            if (force || $(".modal-backdrop:visible").length === 0) {

                $dialog.find("h3").text("");
                $dialog.find(".modal-content").css("visibility", "hidden");
                $dialog.find(".loading-image.loading-image-shown").css("opacity", 0.15);
                $dialog.modal();
            } else {

                setTimeout(function () {
                    it.showWaiting();
                }, 350);
            }
        },
        hide: function () {
            $dialog.modal('hide');
        },
        hideWithCheck: function () {
            var it = this;
            if (it.isVisible()) {
                it.hide();

                setTimeout(function () {
                    it.hideWithCheck();
                }, 350);
            }
        },
        isVisible: function () {
            return $(".modal-backdrop:visible").length > 0;
        }
    };

})(jQuery);

function initAutonumeric() {
    $(".form-control.money:not([data-edit-required])").autoNumeric('init', {
        aSep: ' ',
        aDec: '.',
        vMin: '0.00',
        vMax: "99999999999999999999999999999999999999999.99",
        wEmpty: '',
        mRound: 'B',
        mDec: window.moneyPrecision
    });

    $(".form-control[data-number-type='integer']:not([data-edit-required])").autoNumeric('init', {
        aSep: '',
        aDec: '.',
        vMin: '0',
        vMax: "99999999999999999999999999999999999999999",
        wEmpty: 'zero',
        lZero: 'keep',
        mRound: 'B'
    });

    $(".form-control[data-number-type='double']:not([data-edit-required])").each(function (index, value) {
        var item = $(value);
        item.autoNumeric('init', {
            aSep: '',
            aDec: '.',
            vMin: '0.00',
            vMax: "99999999999999999999999999999999999999999.99",
            mDec: item.attr('data-accuracy') ? item.attr('data-accuracy') : '2',
            wEmpty: '',
            mRound: 'B'
        });
    });
}

/*Begin - Parsley validation*/
function addParsleyValidation(formSelector) {

    function addValidation(formSelector) {
        var form = $(formSelector).first();
        var parsleyForm = form.parsley({
            inputs: '[required]',
            excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled], [data-parsley-disabled], [data-parsley-disabled] *",
            triggerAfterFailure: 'input change',
            validationThreshold: 3,
            focus: 'none',
            uiEnabled: true,
            errorsWrapper: '<ul class="parsley-errors-list help-block tooltip-text"></ul>'
        })
            .on("form:error",
                function () {
                    var parsleyForm = this;
                    openTabAndFocusField(getFirstErrorField(parsleyForm));
                })
            .on("field:validated",
                function () {
                    var parsleyField = this;
                    displayError(parsleyField);
                })
            .on("form:validated",
                function () {
                    var parsleyForm = this;
                    highlightTabsWithErrorFields(parsleyForm);
                });


        addRequiredForLabels(parsleyForm.fields);
        turnOffBrowserValidation(formSelector);
    }

    addValidation(formSelector);

    $(document).on("onDocumentAjaxLoaded",
        function (event, params) {
            if (params && params.validatedFormSelector) {
                addValidation(params.validatedFormSelector);
            }
        });
}

//window.addEventListener('load', checkDateField, true);
function checkDateField() {
    $('[data-type="date"]').attr('data-parsley-date', '');
}

function turnOffBrowserValidation(formSelector) {
    var form = $(formSelector).first();

    if (!form.hasClass("parsley-validation")) {
        form.addClass("parsley-validation");
        //отключаем для формы стандартную валидацию
        form.attr('novalidate', 'novalidate');
    }
}

function addRequiredForLabels(parsleyFields) {
    if (parsleyFields == undefined)
        return;

    $.each(parsleyFields,
        function (index, field) {
            if (field.constraintsByName.required != null) {
                var labelEl = getLabelContainer(field.$element);
                labelEl.addClass("label-required");
            }
        });
}

function displayError(parsleyField) {

    var fieldFormGroupEl = parsleyField.$element.closest(".documentView-field-value");
    var labelFormGroupEl = getLabelContainer(parsleyField.$element);

    if (parsleyField.$element.is("input[type='file']")) {
        var container = parsleyField.$element.parent();
        var button = container.find(".file-drop-area-title");
        if (!parsleyField.isValid()) {
            container.addClass("has-error");
            //button.addClass("form-control");
        } else {
            container.removeClass("has-error");
            //button.removeClass("form-control");
        }
    }

    if (!parsleyField.isValid()) {
        fieldFormGroupEl.addClass("has-error");
        labelFormGroupEl.addClass("has-error");
    } else {
        fieldFormGroupEl.removeClass("has-error");
        labelFormGroupEl.removeClass("has-error");
    }
}

function getLabelContainer($field) {
    /*    return $(".documentView-field-label[data-related-field='" + $field.attr("data-field-name") + "']").first();*/
    return $("#rel-" + $field.attr("data-field-name")).first();
    //return $field.closest(".tab-pane")
    //    .find(".documentView-field-label[data-related-field='" + $field.attr("data-field-name") + "']").first();
}

function getFirstErrorField(parsleyForm) {
    var firstErrorField = null;
    for (var i = 0; i < parsleyForm.fields.length; i++) {
        if (parsleyForm.fields[i].isValid() !== true) { //TODO: it also could return null !
            firstErrorField = parsleyForm.fields[i].$element;
            break;
        }
    }
    return firstErrorField;
}

function openTabAndFocusField($field) {
    if ($field == null)
        return;

    var tab = $field.closest(".tab-pane");

    var tabId = tab.attr("id");
    //открываем вкладку с полем
    $("a[href*=" + tabId + "]").first().tab("show");

    //фокус на поле; таймаут на случай если вкладка не успела открыться
    setTimeout(function () { $field.focus(); }, 100);
}

function highlightTabsWithErrorFields(parsleyForm) {
    parsleyForm.$element
        .find(".tab-pane")
        .each(function (index, tabContent) {
            var tabContentId = tabContent.id;
            var $tabContent = $(tabContent);

            var tabButton = $("a[href*=" + tabContentId + "]");

            if ($tabContent.find(".parsley-error").length > 0 && !tabButton.hasClass("tab-has-error")) {
                tabButton.addClass("tab-has-error");
            } else if (!$tabContent.has(".parsley-error").length > 0 && tabButton.hasClass("tab-has-error")) {
                tabButton.removeClass("tab-has-error");
            }
        });
}

function addRegEditValidations() {
    scopes.onRegister(function () {
        addParsleyValidation(".register-form");
    });

    scopes.onEdit(function () {
        addParsleyValidation("form.edit-form");
    });

    addViewDecodeHtml();
}
/*End- Parsley validation*/

function addViewDecodeHtml() {
    scopes.onView(function () {

        var fields = $(".documentView-field-value");
        $.each(fields, function (index, element) {
            var current = $(element);
            if (current.find("input").length === 0) {
                if (element.className.indexOf("field-type-url") === -1) {
                    current.text(ct.common.decodeHTML(current.text()));
                }
            }
        });
    });
}
/**
 * @deprecated Use ct.common.dictionary.fillDisplayFields
 */
function fillDictDisplayValues() {
    $(".dict-modal-control").each(function (index, dictControl) {
        fillDipslayValueForDict($(dictControl));
    });
}

/**
 * @deprecated Use ct.common.dictionary.fillSingleDisplayField
 */
function fillDipslayValueForDict($dictControl) {
    var dictEditName = $dictControl.attr("data-edit-name");
    var isTable = $dictControl.closest(".table-edit").length > 0;

    var parentContainerSelector = isTable ? ".table-edit-row" : ".column-container";
    var hiddenDictFields = $dictControl.closest(parentContainerSelector).find(".display-field-part[dictionary-edit-name=" + dictEditName + "]");
    if (hiddenDictFields.length == 0) {
        hiddenDictFields = $dictControl.closest(parentContainerSelector).parent().find(".display-field-part[dictionary-edit-name=" + dictEditName + "]");
    }
    var displayText = hiddenDictFields
        .map(function () {       //берем значения
            return this.value;
        })
        .get()                  //преобразуем в массив
        .filter(function (element) {//фильтруем невалидные
            return element == null || $.trim(element).length === 0
                ? false
                : true;
        })
        .join(", ");            //склеиваем в строку

    var dictDisplayField = $dictControl.find(".dict-display-field");
    if (dictDisplayField.val() !== displayText) {
        dictDisplayField.val(displayText).change();
    }
}

/**
 * @deprecated Use ct.common.dictionary.fillMultipleDisplayFields
 */
function fillDisplayVlaueForMultipleDict($dictControl) {
    var hiddenDictRows = $dictControl.find("ul.multiple-editor-list li");
    var displayTextArr = [];
    hiddenDictRows.each(function (num, row) {
        var columnTextArr = $(row).find("input.display-field-part")
            .map(function () { //берем значения
                return this.value;
            })
            .get() //преобразуем в массив
            .filter(function (element) { //фильтруем невалидные
                return !(element == null || $.trim(element).length === 0);
            }); //склеиваем в строку
        var columnText = columnTextArr.length > 1 ? "(" + columnTextArr.join(",") + ")" : columnTextArr[0];
        displayTextArr.push(columnText);
    });

    var displayText = displayTextArr.
        filter(function (element) {
            return (element != null) && $.trim(element).length !== 0;
        })
        .join(", ");

    $dictControl.find(".mult-dict-display").val(displayText).change();
}




/**
 * @deprecated Use ct.common.dictionary.removeFromMultipleDisplayFields
 */
function removeFromMultipleDict(removeGlyph) {
    var dictControl = $(removeGlyph).closest(".dict-modal-control");
    var splittedName = $(removeGlyph).siblings("input").first().attr("name").split("-");
    var removedRowIndex = parseInt(splittedName[splittedName.length - 1]);
    var inputName = splittedName[0] + "_deleted";
    var deleteRowInput;

    if ($("[name='" + inputName + "']").length > 0) {
        deleteRowInput = $("[name='" + inputName + "']");
    } else {
        var deleteContainer = $("<div data-name='deletedTableElements'></div>");
        deleteRowInput = $("<input type='hidden' name='" + inputName + "' value='' />");
        deleteContainer.append(deleteRowInput);
        $(removeGlyph).closest("ul").parent().append(deleteContainer);
    }

    deleteRowInput.val(deleteRowInput.val() + removedRowIndex + ",");
    $(removeGlyph).closest("li").remove();

    fillDisplayVlaueForMultipleDict(dictControl);
}

function verticalTabs() {

    // Открывает первую вкладку и записывает хеш в урл
    var openFirstTab = function (viewTabs, updateHash) {
        var foundTab = viewTabs.find('a:first');
        foundTab.click();

        if (updateHash === false) {
            return;
        }

        if (updateHash === undefined || updateHash === true) {
            var hash = foundTab.attr('data-target');

            if (hash) {
                window.location.hash = hash;
            }
        }
    };

    // Автоматическое открытие вкладки при отображении и регистрации
    var onViewAndRegister = function () {
        // При обновлении страницы сохраняем анкор таба в url через хэш
        var viewTabs = $('#registerView .nav-tabs, #documentView .nav-tabs, #editView .nav-tabs');

        // Если табов нет, то и делать нечего
        if (viewTabs.length == 0) {
            return;
        }

        // При клике на любой из табов перезаписываем хеш в строке урла  
        $(viewTabs).on("click", "a[data-toggle]", function () {
            var href = $(this).attr('href');

            if (!href) {
                return;
            }

            var hash = href.split('#')[1];

            if (!hash) {
                return;
            }

            location.hash = hash;
        });


        var hash = location.hash;
        //если нет хэша в урле, попробуем найти сохраненный в sessionStorage и сразу удалем его
        if (!hash) {
            hash = getSavedHash();
            if (hash)
                removeSavedHash();
        }
        // Если нет хеша, то открываем первую вкладку
        if (!hash) {
            openFirstTab(viewTabs);
            return;
        }

        var foundTab = viewTabs.find("a[data-target='" + hash + "']");
        if (foundTab.length > 0) {
            // Хеш есть, пытаемся найти вкладку и перейти на неё
            foundTab.click();
        } else {
            // Нужного хеша нет, открываем первую вкладку
            openFirstTab(viewTabs);
        }
    }

    onViewAndRegister();
}

function toTopButton() {
    var button = $("#back-to-top");

    $(window).scroll(function () {
        if ($(this).scrollTop() > 50) {
            button.fadeIn();
        } else {
            button.fadeOut();
        }
    });

    button.click(function () {
        button.tooltip("hide");
        $("body,html").animate({
            scrollTop: 0
        }, 800);
        return false;
    });

    button.tooltip("show");
}

function bindDictionaryButtons() {
    // Смотрим на появление новых элементов button.show-dict-btn т.к.
    // при редактировании разметка с кнопками загружается позже и кнопок ещё не существует
    $(document).on("click", "button.show-dict-btn", function (event) {
        event.preventDefault();
        HierarDictionary(event.target);
        //hierar = HierarDictionary(event.target);
    });
}

function bindDictionaryDisplayField() {
    $(document).on("change", ".display-field-part",
        function (ev) {
            var $inputToDisplay = $(ev.target);
            var dictionaryName = $inputToDisplay.attr("dictionary-edit-name");
            var isTable = $inputToDisplay.closest(".table-edit").length > 0;
            var containerSelector = isTable ? ".table-edit-row" : ".column-container";
            var $dictControl = $inputToDisplay.closest(containerSelector).find(".dict-modal-control[data-edit-name=" + dictionaryName + "]");
            if ($dictControl.length == 0)
                $dictControl = $inputToDisplay.closest(containerSelector).parent().find(".dict-modal-control[data-edit-name=" + dictionaryName + "]");
            fillDipslayValueForDict($dictControl);
        }
    );

    $(document).on("change", ".dict-display-field",
        function (ev) {
            var field = $(ev.target);
            var isTable = field.closest(".table-edit").length > 0;
            var containerSelector = isTable ? ".form-group" : ".column-container";
            var group = field.closest(containerSelector);
            var input = group.find(".display-field-part");
            //если поле для отображение собирается из нескольких частей то восстановить части уже невозможно, поэтому в поля ничего не пишем.
            if (input.legth === 0) {
                input.val(field.val());
            }
        }
    );
}

function enableToolTips() {
    $('body').tooltip({ selector: '[data-toggle="tooltip"]', container: "body" });
}

function initReportSections() {
    $('.report-element').on('show.bs.collapse',
        function () {
            $(this).prev('.report-section').addClass('active');
        });

    $('.report-element').on('hide.bs.collapse',
        function () {
            $(this).prev('.report-section').removeClass('active');
        });
}

function filterDictionaryItems(dictionaryName, itemKeys, iShow, columnName) {
    if (!dictionaryName) {
        console.warn("не задано имя массива. FilterDictionaryItems");
        return;
    }

    if (!itemKeys || !Array.isArray(itemKeys)) {
        console.warn("не задан массив разрешенных значений. FilterDictionaryItems");
        return;
    }

    if (typeof iShow === 'undefined') {
        iShow = false;
    }

    var id = dictionaryName + "_allowed_items";

    var value = {
        codes: itemKeys,
        isShow: iShow,
        columnName: columnName
    };

    var dictionayAllowItems = $("#" + id);
    if (dictionayAllowItems.length === 0) {
        dictionayAllowItems = $('<input>').attr({
            type: 'hidden',
            id: id,
            name: id,
            disabled: true
        }).appendTo($(document.body));
    }

    dictionayAllowItems.val(JSON.stringify(value));
}

/**
 * Отображает диалог с перечнем ошибок.
 * @deprecated Use ct.common.showCommonErrors instead.
 */
function showCommonErrors(errors, callback) {
    ct.common.showCommonErrors(errors, callback);
}

function showNotification(dialogTitle, messages) {
    var dlg = $('#notificationDialog');
    var dlgBody = dlg.find(".modal-body");
    dlg.modal('show');

    if (dialogTitle)
        dlg.find(".modal-title").text(dialogTitle);

    if (messages instanceof jQuery) {
        dlgBody.append(messages);
    } else {

        if (!Array.isArray(messages))
            messages = [messages];

        if (messages.length === 1) {
            var p = $("<p class='form-control-static'></p>");
            p.text(messages[0]);
            dlgBody.append(p);
        } else {
            var items = [];
            $.each(messages, function (i, message) {
                items.push('<li><p class="form-control-static">' + message + '</p></li>');
            });
            var list = $("<ul>");
            list.html(items);
            dlgBody.empty().append(list);
        }
    }
}

function showConfirmEx(dialogTitle, message, yesText, noText, itemElement) {
    var self = this;
    var defer = $.Deferred();

    var dlg = $('#notificationDialog');

    var container = $(itemElement).closest(".dx-overlay-wrapper");

    setContainerStyles(container);

    if (dlg) {

        var dlgBody = dlg.find(".modal-body");
        var dlgButtons = dlg.find(".modal-footer");

        if (dlgButtons) {
            var buttons;
            if (noText != "") {
                buttons = $("<button type='button' class='btn btn-primary' data-dismiss='modal' id='btnYes'>" + yesText + "</button>" +
                    "<button type='button' class='btn btn-default' data-dismiss='modal' id='btnNo'>" + noText + "</button>");
            } else {
                buttons = $("<button type='button' class='btn btn-primary' data-dismiss='modal' id='btnYes'>" + yesText + "</button>");
            }
            dlgButtons.empty();
            dlgButtons.append(buttons);
        }

        dlg.modal('show');

        dlgButtons.find("#btnYes").click(function () {
            resetContainerStyles(container);
            defer.resolve();
        });
        if (noText != "") {
            dlgButtons.find("#btnNo").click(function () {
                resetContainerStyles(container);
                defer.reject();
            });
        }

        if (dialogTitle) {
            dlg.find(".modal-title").text(dialogTitle).addClass("dialog-modal-title");
        }

        if (dlgBody) {
            dlgBody.empty();
            var p = $("<p class='form-control-static dialog-text'></p>");
            p.text(message);
            dlgBody.append(p);
        }
    } else {
        //alert("Элемент с id = notificationDialog не найден!")
        resetContainerStyles(container);
        defer.fail("Элемент с id = notificationDialog не найден!");
    }

    return defer.promise();
}

function setContainerStyles(container) {
    if (container && container.length) {
        container.removeStyle('z-index').removeClass("dialog-modal-reset").addClass("dialog-modal-backdrop");
    } else {
        console.log("Container (set) not found!");
    }
}


function resetContainerStyles(container) {
    if (container && container.length) {
        container.removeClass("dialog-modal-backdrop").addClass("dialog-modal-reset");
    } else {
        console.log("Container (reset) not found!");
    }
}


function showAlertEx(dialogTitle, message, okText, itemElement) {
    var self = this;

    var dlg = $('#notificationDialog');

    var container = $(document).find(".dx-overlay-wrapper");

    setContainerStyles(container);

    if (dlg) {

        var dlgBody = dlg.find(".modal-body");
        var dlgButtons = dlg.find(".modal-footer");

        if (dlgButtons) {
            var buttons = $("<button type='button' class='btn btn-primary' data-dismiss='modal' id='btnOk'>" + okText + "</button>");
            dlgButtons.empty();
            dlgButtons.append(buttons);
        }

        dlg.modal('show');

        dlgButtons.find("#btnOk").click(function () {
            resetContainerStyles(container);
            dlg.modal("hide");
            clearTimeout(timeoutId);
        });

        if (dialogTitle) {
            dlg.find(".modal-title").text(dialogTitle).addClass("dialog-modal-title");
        }

        if (dlgBody) {
            dlgBody.empty();
            var p = $("<p class='form-control-static dialog-text'></p>");
            p.text(message);
            dlgBody.append(p);
        }

        var timeoutId = setTimeout(function () {
            resetContainerStyles(container);
            dlg.modal("hide");
        }, 3000);

    } else {
        resetContainerStyles(container);
    }

    return;
}




//Получение базового урл сайта. 
//Пример: В проде вернет "/edo", на дев машине вернет "/".
function getBaseUrl() {

    var str = $("base").attr('href');
    if (!str)
        return str;
    if (str.substr(str.length - 1) === '/') {
        return str.substr(0, str.length - 1);
    }
    return str;
}


//Получить правильный relative путь для url. 
//Пример: getRelativeUrl("/someUrl") и getRelativeUrl("someUrl") вернет "/edo/someUrl" на проде и "/someUrl" на дев машине.
function getRelativeUrl(url) {

    var relativeUrl = getBaseUrl();
    if (url && relativeUrl !== undefined && relativeUrl !== null) {

        if (relativeUrl === "/") {
            relativeUrl = "";
        }

        relativeUrl = url[0] === "/" ? (relativeUrl + url) : (relativeUrl + "/" + url);
    }

    return relativeUrl;
}

//Получить ключ Department по уникальному названию Department
function getDepartmentKey(name, after) {

    if (name) {

        /* addressBookToolSelectable - кастомное значение указывать нельзя согласно требованиям безопасности
         * [EUPDEV-3843] Исправить множественные возможности проведения атаки «Внедрение XPath-операторов» (3.6)
        var url = "/AddressBook/GetAddressBookJson?editAddressBookTypes=dep&addressBookDataType=Department&addressBookToolSelectable=" +
            encodeURIComponent("Department, Department, '" + name + "'") +
            "&selectedValue=" +
            encodeURIComponent(name);
        */
        var url = "/AddressBook/GetAddressBookDepartmentJson?department=" + encodeURIComponent(name);

        $.getJSON(getRelativeUrl(url), function (data) {

            if (data) {

                var key = data.children[0].key;
                after(key);
            }
        });
    }
}

//Получить ключ WorkGroup по уникальному названию WorkGroup
function getWorkGroupKey(name, after) {

    if (name) {

        /* addressBookToolSelectable - кастомное значение указывать нельзя согласно требованиям безопасности*/
        var url = "/AddressBook/GetAddressBookWorkGroupJson?workGroup=" + encodeURIComponent(name);

        $.getJSON(getRelativeUrl(url), function (data) {

            if (data) {

                var key = data.children[0].key;
                after(key);
            }
        });
    }
}

//Получить все WorkGroup текущего пользователя
function getUserWorkGroups(after) {

    /* addressBookToolSelectable - кастомное значение указывать нельзя согласно требованиям безопасности         
    var url = "AddressBook/GetAddressBookJson?editAddressBookTypes=SelectableTypes&addressBookToolSelectable=WorkGroup,WorkGroup,{currentUserParents}&addressBookDataType=WorkGroup";
    */
    var url = "/AddressBook/GetAddressBookUserWorkGroupsJson";

    $.getJSON(getRelativeUrl(url), function (data) {

        if (data) {
            after(data.children);
        }
    });
}

//Получить ключ AccessGroup по уникальному названию AccessGroup
function getAccessGroupKey(name, after) {

    if (name) {

        /* addressBookToolSelectable - кастомное значение указывать нельзя согласно требованиям безопасности*/
        var url = "/AddressBook/GetAddressBookAccessGroupJson?accessGroup=" + encodeURIComponent(name);

        $.getJSON(getRelativeUrl(url), function (data) {

            if (data) {

                var key = data.children[0].key;
                after(key);
            }
        });
    }
}

//Получить все AccessGroup текущего пользователя
function getUserAccessGroups(after) {

    /* addressBookToolSelectable - кастомное значение указывать нельзя согласно требованиям безопасности*/
    var url = "/AddressBook/GetAddressBookUserAccessGroupsJson";

    $.getJSON(getRelativeUrl(url), function (data) {

        if (data) {
            after(data.children);
        }
    });
}

$(document).ready(function () {
    resetDictionaryFields();
    reinitialiseScripts();
    $.fn.modal.Constructor.prototype.enforceFocus = function () {
        var modal_this = this;

        $(document).on('focusin.modal', function (e) {
            //win.focus();

            if (!modal_this.$element.has(e.target).length) {
                //modal_this.$element.focus();
            }
        });
    };

    enableToolTips();
    updateDatepickers();
    verticalTabs();
    toTopButton();
    bindDictionaryButtons();
    bindDictionaryDisplayField();
    initialiseSearchResultTableScripts(".search-result");
    initialiseTableEditScripts($(document));
    initReportSections();

    WorkflowNotificationManager.showNotifications();

    if (typeof scopes !== 'undefined') {
        addRegEditValidations();
        scopes.run();
    }

    // подписка на событие здесь, потому что до выполнения кастомных скриптов из списка
    // должна пройти реинициализация скриптов
    $(document).on('onDocumentAjaxLoaded',
        function (event, params) {
            if (params && params.documentType) {
                scopes.run(params.documentType);
            };
        });

    $(document).on('onDocumentModalWindowLoaded',
        function (event, params) {
            addParsleyValidation(params.validatedFormSelector);
        });
});

function getInputName(inputName) {
    if (inputName.indexOf(":") !== -1) {
        var str = inputName.split('-');
        var allstr = str[0].split(':');

        var newStr = "";
        for (var i = 1; i < allstr.length; i++) {
            newStr = newStr + allstr[i] + "-";
        }
        return newStr + str[1] + "-" + str[2];
    }
    else
        return inputName.split('-')[1];
};

function Scopes() {
    /* Используется в кастомных скриптах потоков, 
     * для применения различных правил при редактирвоании/создании/просмотре документов
     */
    var onRegisterFuncs = [];
    var onEditFuncs = [];
    var onViewFuncs = [];
    var onSearchFuncs = [];

    var onSearchTempFuncs = [];
    var onRegisterTempFuncs = [];
    var onEditTempFuncs = [];
    var onViewTempFuncs = [];

    // добавление функций для конкретных потоков. они могут очищаться для замены на функции другого потока
    this.onRegisterTemp = function (f) {
        onRegisterTempFuncs.push(f);
    };

    this.onEditTemp = function (f) {
        onEditTempFuncs.push(f);
    };

    this.onViewTemp = function (f) {
        onViewTempFuncs.push(f);
    };

    this.onSearchTemp = function (f) {
        onSearchTempFuncs.push(f);
    }

    this.onRegister = function (f) {
        onRegisterFuncs.push(f);
    };

    this.onEdit = function (f) {
        onEditFuncs.push(f);
    };

    this.onView = function (f) {
        onViewFuncs.push(f);
    };

    this.onSearch = function (f) {
        onSearchFuncs.push(f);
    }

    this.onAll = function (f) {
        onRegister(f);
        onEdit(f);
        onView(f);
        onSearch(f);
    }

    this.run = function () {
        var targetFuncsArray = [];
        var targetTempFuncsArray = [];

        if ($("#editView").length > 0) {
            targetFuncsArray = onEditFuncs;
            targetTempFuncsArray = onEditTempFuncs;
        }

        if ($("#registerView").length > 0) {
            targetFuncsArray = onRegisterFuncs;
            targetTempFuncsArray = onRegisterTempFuncs;
        }

        if ($("#documentView").length > 0) {
            targetFuncsArray = onViewFuncs;
            targetTempFuncsArray = onViewTempFuncs;
        }

        if ($("#replaced-search-content").length > 0) {
            $.each(onSearchFuncs,
                function (num, func) {
                    targetFuncsArray.push(func);
                });
            $.each(onSearchTempFuncs,
                function (num, func) {
                    targetTempFuncsArray.push(func);
                });
        }

        if (targetFuncsArray != undefined && targetTempFuncsArray != undefined) {
            $.each(targetFuncsArray,
                function (num, func) {
                    func();
                });

            $.each(targetTempFuncsArray,
                function (num, func) {
                    func();
                });
        }
    };

    // очищение временных функций. на вкладке поиска аяксом вставляются формы для разных потоков.
    // там надо очищать скрипты для ненужных потоков, чтобы избежать конфликтов 
    this.clearTempFuncs = function () {
        onRegisterTempFuncs = [];
        onEditTempFuncs = [];
        onViewTempFuncs = [];
        onSearchTempFuncs = [];
    }
}

var scopes = new Scopes();

var dsc = (function ($) {
    //декларирование переменных
    var
        configMap = {
            extended_title: 'Нажмите чтобы скрыть',
            retracted_title: 'Нажмите чтобы скрыть',
            slider_opened_em: 42,
            slider_closed_em: 0
        },
        stateMap = {
            px_per_em: 0,
            slider_hidden_px: 0,
            slider_closed_px: 0,
            slider_opened_px: 0
        },
        $slider,
        toggleSlider, getEmSize, setPxSizes, initModule;

    //Сервисные функции
    setPxSizes = function (containerSize) {
        var px_per_em, opened_height_em;

        px_per_em = getEmSize($slider.first());

        opened_height_em = configMap.slider_opened_em;
        if (containerSize != undefined) {
            opened_height_em = opened_height_em / 3 * containerSize;
        }

        stateMap.px_per_em = px_per_em;
        stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;
        stateMap.slider_opened_px = opened_height_em * px_per_em;
    };

    getEmSize = function (elem) {
        return Number(
            getComputedStyle(elem[0], '').fontSize.match(/\d*\.?\d*/)[0]
        );
    };
    //Основной функционал
    toggleSlider = function () {
        var
            slider_height = $slider.height();

        if (slider_height <= stateMap.slider_closed_px) {
            $slider
                .animate({ height: stateMap.slider_opened_px })
                .attr('title', configMap.extended_title);
            return true;
        }

        else if (slider_height >= stateMap.slider_opened_px) {
            $slider
                .animate({ height: stateMap.slider_closed_px })
                .attr('title', configMap.retracted_title);
            return true;
        }
        // не срабатывать, если слайдер раздвигается/сдвигается
        return false;
    };
    //Открытые методы и свойства
    initModule = function ($container, containerSize) {
        $slider = $container;
        setPxSizes(containerSize);
        toggleSlider(containerSize);
        return true;
    };

    return { initModule: initModule };

}(jQuery));

// fix "back button" usage with bootstrap tabs
$(document).ready(function () {
    var handler = function (e) {
        var activeTab = $("[data-target='" + location.hash + "']");
        if (activeTab.length) {
            activeTab.tab('show');
        }
    };

    window.onpopstate = handler;
    window.onhashchange = handler;
});

var WorkflowNotificationManager = (function () {

    var propName = "WorkflowNextSteps";

    function getWorkflowNotificationData() {
        var data = getFromSessionStorage(propName);
        if (data) {
            removeFromSessionStorage(propName);
            return JSON.parse(data);
        } else {
            data = readCookie(propName);
            if (data) {
                deleteCookie(propName);
                var encoded = decodeURIComponent(data).split('+').join(' ');
                return JSON.parse(encoded);
            }
        }
        return null;
    }

    function showNotifications() {

        var data = getWorkflowNotificationData();
        if (!data)
            return;

        var messages = data.msgs;
        if (!messages)
            return;

        var l = messages.length;
        var wrapper = $("<div/>");
        for (var i = 0; i < l; i++) {
            var current = messages[i];

            var itemWrapper = $("<div class='panel panel-default'/>");

            var headerWrapper = $("<div class='panel-heading'></div>");
            headerWrapper.html(current.wfname);
            var bodyWrapper = $("<div class='panel-body'/>");
            bodyWrapper.html(current.text);

            itemWrapper.append(headerWrapper);
            itemWrapper.append(bodyWrapper);
            wrapper.append(itemWrapper);
        }
        var title = data.title ? data.title : " ";
        showNotification(title, wrapper);
    }

    function isNotificationData(str) {
        return str.indexOf("wfname") !== -1 && str.indexOf("msgs") !== -1;
    }

    function saveNotificationData(data) {
        var savedData = getFromSessionStorage(propName);
        if (savedData) {
            var dataJson = JSON.parse(savedData);
            var newData = typeof data === "string" ? JSON.parse(data) : data;
            dataJson.msgs = dataJson.msgs.concat(newData.msgs);
            data = JSON.stringify(dataJson);
        }
        updateSessionStorage("WorkflowNextSteps", data);
    }

    return {
        showNotifications: showNotifications,
        isNotificationData: isNotificationData,
        saveNotificationData: saveNotificationData
    }

}());


window.onscroll = function () { stickyBlock(); }

function stickyBlock() {
    var elements = $("div[fixed]");
    elements.each(function (index, elem) {
        var elemOffset = getOffsetRect(elem);
        if (!elem.classList.contains('fixed-block')) {
            if (window.pageYOffset > elemOffset) {
                elem.classList.add("fixed-block");
                $(elem).width($(elem).parent().parent().width());
            }
        }
        else if (window.pageYOffset <= elem.offsetTop) {
            elem.classList.remove("fixed-block");
            elem.style.width = null;
        }
    });
}

function getOffsetRect(elem) {
    var box = elem.getBoundingClientRect();

    var body = document.body;
    var docElem = document.documentElement;

    var scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop;
    var clientTop = docElem.clientTop || body.clientTop || 0;
    var top = box.top + scrollTop - clientTop;

    return Math.round(top);
}

function resetActionsCache() {
    var actMenu = $(".basic-actions .dymanic-actions");
    if (actMenu.length == 0) {
        var isDocView = $('#documentView.panel.panel-default').length > 0;
        if (isDocView) window.location.reload();//перезагружаем страницу только на форме просомтра, а не редактирования
    }

    actMenu.empty();
    actMenu.append('<div class="item-ajax-loading"><div class= "loading-image" id = "content-change-pasword-loading-image">&nbsp;</div></div>');
}

function dropDownHandle(docId) {
    $('.basic-actions').on('show.bs.dropdown',
        function (aaa) {
            if ($(".basic-actions .loading-image").length === 0) return;//если часиков уже нет, значит прогрузили уже

            $(".basic-actions .loading-image").css({ visibility: 'visible' });

            $.ajax({
                url: getAbsoluteUrl("Document/GetDocLazyActions"),
                cache: false,
                type: "GET",
                data: { docId: docId },
                beforeSend: function (request) {
                    request.setRequestHeader("OriginalReturnUrl", window.location.href);
                },
                success: function (actions) {
                    var actMenu = $(".basic-actions .dymanic-actions");
                    actMenu.empty();

                    $.each(actions, function (index, elem) {
                        var linkHtml = '<a title="' + elem.DisplayName + '" href="' + elem.Href + '" class="item-ajax-action" onclick="' + elem.OnClick + '" target="' + elem.Target + '">' + elem.DisplayName + '</a>';
                        actMenu.append(linkHtml);
                    });

                    if (actions.length === 0) actMenu.append('<div class="item-ajax-action">нет доступных действий</div>');

                    if (typeof customDropDownHandle === "function") customDropDownHandle();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showAlert("Ошибка загрузки действий", errorThrown);
                },
                traditional: true
            });
        });

    $('.basic-route-actions').on('show.bs.dropdown',
        function (aaa) {
            if ($(".basic-route-actions .loading-image").length === 0) return;//если часиков уже нет, значит прогрузили уже

            $(".basic-route-actions .loading-image").css({ visibility: 'visible' });

            $.ajax({
                url: getAbsoluteUrl("Document/GetRouteLazyActions"),
                cache: false,
                type: "GET",
                data: { docId: docId },
                beforeSend: function (request) {
                    request.setRequestHeader("OriginalReturnUrl", window.location.href);
                },
                success: function (actions) {
                    var actMenu = $(".basic-route-actions .dymanic-actions");
                    actMenu.empty();

                    $.each(actions, function (index, elem) {
                        var linkHtml = '<a title="' + elem.DisplayName + '" href="' + elem.Href + '" class="item-ajax-action" onclick="' + elem.OnClick + '" target="' + elem.Target + '">' + elem.DisplayName + '</a>';
                        actMenu.append(linkHtml);
                    });

                    if (actions.length === 0) actMenu.append('<div class="item-ajax-action">нет доступных действий</div>');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    showAlert("Ошибка загрузки действий", errorThrown);
                },
                traditional: true
            });
        });
}


function switchYear(year) {
    var newUrl = window.location.toString();

    renewSavedYearSettingsCookie(newUrl, year);

    if (!year) {
        var url = new URL(newUrl);
        url.searchParams.delete('selectedYear');
        window.location = url;
    } else {
        newUrl = newUrl.replace(/(selectedYear=)[^\&]+/, '$1' + year);
        if (newUrl.indexOf('selectedYear') === -1) newUrl = newUrl + '&selectedYear=' + year;
        window.location = newUrl;
    }
}

function renewSavedYearSettingsCookie(url, year) {
    var url = new URL(url);
    var expires = "expires=Sat, 07 Feb 2122 14:30:46 GMT";
    var yearValue = !year ? '0' : year;
    document.cookie = "savedYearSettings=" + yearValue + ';' + expires;
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
        return uri + separator + key + "=" + value;
    }
}

function replaceUrlToNavigate(url) {
    return url.replaceAll("&amp;", '&');
}


function startDisplayHandlingProgress(jsonResponseData) {
    debugger;
    $('#loadingProgressBlock').removeClass('hide');
    $('#loadingProgressImage').css('visibility', 'visible');

    //$('#asyncResultContainer').show();
    var docKey = jsonResponseData.uniqueIds;

    var loadingText = $('#loadingProgressText');
    loadingText.show();
    loadingText.text('Обновление статуса загрузки...');

    UpdateEisAsyncProcStatus(docKey);
}

function UpdateEisAsyncProcStatus(docKey) {
    $.ajax({
        url: getBaseUrl() + "/ContextAction/GetAsyncProcessUploadStatus",
        type: 'GET',
        data: { docKey: docKey },
        cache: false,
        success: function (data) {
            debugger;
            if (data && data.statusCode) {
                var stat = '';

                if (data.statusCode == '0') stat = 'Обработка';
                if (data.statusCode == '1') stat = 'Ошибка';
                if (data.statusCode == '2') stat = 'Успешно';
                if (data.statusCode == '3') stat = 'В очереди';

                var resultText = 'Статус: ' + stat + '.<br/>Детали: ' + data.statusText;

                $('#loadingProgressText').html(resultText);


                if (data.statusCode == '2' || data.statusCode == '1') {
                    //Если статус - ошибка или успешно, значит дальше нет смысла опрашивать сервер
                    $('#loadingProgressImageSpan').hide(); //css('visibility', 'collapse');

                    if (data.statusCode == '2') {
                        $('#loadingProgressBlock').addClass('hide');
                        $('#success-message').text('Асинхронная выгрузка успешно завершена!');
                    }
                }
                else
                    setTimeout(function () { UpdateEisAsyncProcStatus(docKey) }, 5000);
            }

        }
    });
}

function isNullOrWhiteSpace(str) {
    return (!str || str.length === 0 || /^\s*$/.test(str))
}

function changeDocStatus(status) {
    var regstatus = $("*.documentView-field-value[data-name='Статус'], input[name='regstatus']");
    regstatus.val(status);
}