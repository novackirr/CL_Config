// Хелпер для работы с модальными окнами
function ModalHelper(options) {

    options = options || {};

    // модальное окно и его запчасти
    var dialog = $(options.dialog);
    // div, в который выводятся ошибки
    var errors = dialog.find(".modal-errors-wrapper");
    // div, в который выводятся сообщения
    var infos = dialog.find(".modal-info-wrapper");
    // div, в котором отображается контент
    var content = dialog.find(".modal-content-wrapper");
    // div, в котором индикатор-загрузки лежит
    var loading = dialog.find(".modal-loading-wrapper");

    // Очистить модальное окно от ранее загруженного контента
    var clearWindow = function () {

        // очистить список ошибок
        errors.empty();
        errors.hide();

        // очистить список сообщений
        infos.empty();
        infos.hide();

        // очистить контент
        content.empty();
        content.hide();

        // показать индикатор загрузки
        loading.show();
    }

    // Показать модальное окно
    var showWindow = function () {
        // Костылик для EETPZKP-227, чтобы скролл у больших модалок не исчезал.
        // Подробности: https://stackoverflow.com/questions/27646787/bootstrap-scrollbar-disappears-after-closing-modal/27647455
        dialog.css("overflow-y", "scroll");
        dialog.modal('show');
        // ROSTEL-1297 Не закрывать модальное окно при клике вне окна
        dialog.data('bs.modal').options.backdrop = 'static';
    }

    // Обработчик для submit модального окна
    var onModalSubmit = function (event) {

        // ROSTEL-1297 Не закрывать модальное окно при клике вне окна
        dialog.data('bs.modal').options.backdrop = true;

        // очистить список ошибок
        errors.empty();
        errors.hide();

        // очистить список сообщений
        infos.empty();
        infos.hide();
       

        setPreventDefault(event);
        FormHelper.submit({
            document: dialog,
            isTargetBlank: options.isTargetBlank,
            dontSubmit: options.dontSubmit,
            onStart: function () {
                loading.show();
            },
            onFinish: function () {
                loading.hide();

                dialog.find("button[data-dismiss='modal']").click();
            },
            onMessage: function(message, isError) {
                if (isError) {
                    errors.text(message);
                    errors.show();
                    loading.hide();
                } else {
                    infos.text(message);
                    infos.show();
                    loading.hide();
                }
            }
        });
    }

    var onModalClose = function(event) {
        FormHelper.close();
    }


    // Добавить подписки на события модального окна
    var addSubscriptions = function () {
        var submitButton = dialog.find(".btn-submit");

        submitButton.prop('disabled', false);
        submitButton.click(onModalSubmit);
        dialog.on('hidden.bs.modal', function () {
            submitButton.unbind("click", onModalSubmit);
            dialog.children(".modal-dialog").removeClass("modal-large");
            dialog.children(".modal-dialog").removeClass("modal-medium");
            onModalClose();
        });
    }
    
    // todo
    var handleErrors = function() {
        var errorMessage = $('.modal-body-wrapper').attr('data-empty-body-error-message');
        if (errorMessage) {
            errors.text(errorMessage);

            var closeHandler = function (event) {
                setPreventDefault(event);
                dialog.modal('hide');
            };

            dialog.find(".btn-submit").click(closeHandler);
            dialog.on('hidden.bs.modal', function () {
                dialog.find(".btn-submit").unbind("click", closeHandler);
            });

            errors.show();
            dialog.modal('show');
            return;
        }
    }

    var loadContentWithScripts = function(content, url, callback) {
        if (typeof url !== "string") {
            return content;
        }

        var selector,
            response,
            off = url.indexOf(" .");

        if (off > -1) {
            selector = jQuery.trim(url.slice(off));
            url = url.slice(0, off);
        }

        if (content.length > 0) {
            jQuery.ajax({
                url: url,
                type: "GET",
                dataType: "html"
            }).done(function(responseText) {
                response = arguments;
                content.html(selector
                    ? jQuery("<div>").append(jQuery.parseHTML(responseText, undefined, true)).find(selector)
                    : responseText);

                // If the request succeeds, this function gets "data", "status", "jqXHR"
                // but they are ignored because response was set above.
                // If it fails, this function gets "jqXHR", "status", "error"
            }).always(callback &&
                function(jqXHR, status) {
                    content.each(function() {
                        callback.apply(this, response || [jqXHR.responseText, status, jqXHR]);
                    });
                });
        }

        return this;
    }

    // Загрузить документ
     // onDocumentLoad - функция, вызываемая при загрузке документа
    var loadDocument = function (onDocumentLoad) {
        // url для загрузки
        var url = appendUrlArgument(options.url, "rand", getTimeStamp());
        url = url + " .context-action-page-body";

        // загрузка документа, елси есть параметр keepScripts вызываем свой лоадер и сохраняем скрипты
        if (options.keepScripts) {
            loadContentWithScripts(content, url, onDocumentLoad);
        } else {
            content.load(url, onDocumentLoad);
        }

    }

 

    // обработка загруженного документа
    var onLoadDocument = function () {
        errors.hide();
        loading.hide();

        // todo
        if (!$(this).html()) {
            handleErrors();
            return;
        }

        // инициализация скриптов в загруженном документе
        DocumentHelper.init(dialog);

        // подписка на события
        addSubscriptions();

        // инициализация формы в загруженном документе
        FormHelper.init({
            document: dialog,
            isTargetBlank: options.isTargetBlank,
            useDefaultSubmit: options.useDefaultSubmit,
            dontSubmit: options.dontSubmit,
            beforeSubmit: options.beforeSubmit,
            afterSubmit: options.afterSubmit,
            control: options.control,
            event: options.event,
            onStart: function () {
                dialog.find(".btn-submit").prop('disabled', true);
                loading.show();
            },
            onFinish: function () {
                dialog.find(".btn-submit").prop('disabled', false);
                loading.hide();
            },
            onMessage: function(message, isError) {
                if (isError) {
                    errors.text(message);
                    errors.show();
                    loading.hide();
                } else {
                    infos.text(message);
                    infos.show();
                    loading.hide();
                }
            }
        });

        // событие загрузки модального окна
        var onModalWindowLoadedParamsObj = {
            validatedFormSelector: ".action-form",
            innerTableContainer: content
        };
        $(document).trigger('onDocumentModalWindowLoaded', onModalWindowLoadedParamsObj);

        updateSubmitButton();
        content.show();
    }

    // Костыль для выключения кнопки, если приходит сообщение, что документ заблокирован на редактировние.
    function updateSubmitButton() {
        var $title = dialog.find(".modal-title");
        if ($title.text() === "Документ редактируется другим пользователем") {
            dialog.find(".btn-submit").prop("disabled", true);
        }
    }

    // Загрузить документ и открыть его в модальном окне
    var openWindow = function () {

        // чистим модальное окно от всего, что было загружено раньше
        clearWindow();

        // показываем модальное окно с индикатором загрузки
        showWindow();

        // загружаем документ
        loadDocument(onLoadDocument);
    };

    return {
        openWindow: openWindow
    };
}
