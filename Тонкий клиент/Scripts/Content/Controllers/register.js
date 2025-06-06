function onSelectFlow(control) {
    showLoadingIndicator(".register-flow-selectors .loading-image");
    onSelectNavigate(control);
}

function onSelectFlowUrl(url) {
    showLoadingIndicator(".register-flow-selectors .loading-image");
    document.location = url;
}

function expandBlocksWithRequiredEmptyFields() {
    $('.register-form [required]').each(function () {
        if (!$(this).val()) {
            var collapsingBlock = $(this).closest(".panel-collapse");
            if (collapsingBlock.hasClass("collapse") && !collapsingBlock.hasClass("in")) {
                collapsingBlock.collapse("show");
            }

            // разворачиваем свернутые строки таблиц
            if ($($(this).closest(".table-row-row-view")).css("display") == "none") {
                $(this).closest(".table-row-row-view").parent().find(".table-row-selector-radio").click();
            }
        }
    });
}

function fillFromTemplateSubmitProcessor(e, form, action) {
    var templateId = $('input[name=template]:checked').val();
    if (!templateId) return;
    $('#TemplateIDToFillFrom').val(templateId);
    var mainForm = $('#register-form');
    mainForm.attr('action', action);
    toggleRegisterFormRequired(mainForm, false);
    mainForm.unbind('submit');
    mainForm.find("[type='submit']").click();
}

function submitRegisterForm(modeValue, modeInput, control, event) {
    setPreventDefault(event);

    if ($(control).prop('disabled'))
        return;

    var form = $(control).closest("form");
    var input = form.find("input[name='" + modeInput + "']");
    input.val(modeValue);

    if (modeValue == 'project' || modeValue == 'template')
        toggleRegisterFormRequired(form, false);

    if (modeValue == 'document') {
        var formValidator = $('.register-form').first().parsley();
        expandBlocksWithRequiredEmptyFields();

        formValidator.whenValidate()
            .done(function () {
                // Затираем страницу редактирвоания из истории браузера
                if (document.referrer.indexOf(getBaseURI()) > -1 ) {
                    var url = new URL(document.referrer);
                    if (url.pathname.indexOf('DocumentView') > -1) {
                       history.replaceState({ page: 1 }, "", getBaseURI()); 
                    }
                    
                }
                form.find("[type='submit']").click();                                
           });

        return;
    }

    form.find("[type='submit']").click();
}

// Для совместимости с IE
function getBaseURI() {
    if (document.baseURI) return document.baseURI;
    var base = document.getElementsByTagName('base');
    if (base.length > 0) return base[0].href;
    return document.URL;
}

function toggleRegisterFormRequired(jform, isRequired) {
    if (isRequired) {
        jform.find('[data-register-required]').each(function () {
            var isFieldRequired = $(this).attr('data-register-required').toLowerCase() == 'true';
            $(this).prop('required', isFieldRequired);
            $(this).removeAttr('data-register-required');
        });
    } else {
        jform.find('[required]').each(function () {
            $(this).prop('required', false);
            $(this).attr('data-register-required', true);
        });
    }
}

function subscripeRegisterFormSubmit(returnUrlBase) {
    var getForm = function () { return document.getElementById("register-form"); };
    var getErrorMessage = function () { return document.getElementById("error-message"); };
    var getLoadingImage = function () { return "#register-form .loading-image"; };

    var operationStart = function () {
        showLoadingIndicator(getLoadingImage());
        $(getForm()).find("[type='submit'], .register-form-buttons a").prop('disabled', true);

        // ���� ������� true, ������� ���� � false ���� ������
        $("form")
            .find(".checkbox-wrapper input[type=checkbox]")
            .each(function (num, element) {
                var chBox = $(element);
                if (chBox.is(":checked")) {
                    chBox.siblings().removeAttr("name");
                }
            });
    };
    var operationFinish = function () {
        hideLoadingIndicator(getLoadingImage());
        $(getForm()).find("[type='submit'], .register-form-buttons a").prop('disabled', false);
        $(getForm()).find("input[name='registerMode']").val('');
    };

    var submitHandler;
    var formDomObject = getForm();
    var formDomObjectAddHandler = function () {
        $(formDomObject).bind("submit", submitHandler);
    };
    var formDomObjectRemoveHandler = function () {
        $(formDomObject).unbind("submit", submitHandler);
    };

    submitHandler = function (event) {
        setPreventDefault(event);
        if (!$(getForm()).find("input[name='registerMode']").val() || !$('form').first().parsley().isValid())
            return;

        operationStart();
        ajaxFormSubmit(formDomObject, function (data, submit, messages) {           
            console.log(data);
            if (messages) {
                showCommonErrors(messages, function () {
                    //тригерим событие после сабмита и ждем выполнение обработчиков
                    afterFormSubmitHandler($(formDomObject), data).then(function () {
                        formDomObjectRemoveHandler();
                        if (returnUrlBase.indexOf("?") !== -1) {
                            var parts = returnUrlBase.split("?");
                            document.location = parts[0] + "/" + data + "?" + parts[1];
                        } else {
                            document.location = returnUrlBase + '/' + data;
                        }
                    }, function (error) {
                        showCommonErrors(error);
                        toggleRegisterFormRequired($(getForm()), true);
                        operationFinish();
                    });
                }, true);
            }
            else {
                afterFormSubmitHandler($(formDomObject), data).then(function () {
                    formDomObjectRemoveHandler();
                    if (returnUrlBase.indexOf("?") !== -1) {
                        var parts = returnUrlBase.split("?");
                        document.location = parts[0] + "/" + data + "?" + parts[1];
                    } else {
                        document.location = returnUrlBase + '/' + data;
                    }
                }, function (error) {
                    showCommonErrors(error);
                    toggleRegisterFormRequired($(getForm()), true);
                    operationFinish();
                });


            }
        },
            function (data) {              
                if (data.allMessages) showCommonErrors(data.allMessages);
                else showCommonErrors(data.responseText);

                toggleRegisterFormRequired($(getForm()), true);
                operationFinish();
            },
            beforeAjaxSendRegisterForm);
    };

    formDomObjectAddHandler();
}

function afterFormSubmitHandler(form, docKey) {
    var defer = jQuery.Deferred();

    var eventData = {
        docKey: docKey,
    };

    var promise = form.triggerHandler("afterFormSubmit", eventData);

    if (promise && promise.always) {

        promise.then(function () {
            defer.resolve();
        }, function (error) {
            defer.reject(error);
        });

    } else {
        defer.resolve();
    }
    return defer.promise();
}

function beforeAjaxSendRegisterForm(xhr) {
    if ($("form").find("input[name='DisableLinkDocsLockAndRefresh']").length > 0) {
        xhr.setRequestHeader('DisableLinkDocsLockAndRefresh', '1');
    }


    if ($("form").find("input[name='DisableRightsRecalcForLinks']").length > 0) {
        xhr.setRequestHeader('DisableRightsRecalcForLinks', '1');
    }
}