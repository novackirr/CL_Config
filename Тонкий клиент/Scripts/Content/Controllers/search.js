"use strict";
(function () {

    var fieldsDefaultValuesDictionary = [],
        formDataInputID = "hfSearchFormData";
    function init() {

        var searchForm = $(".search-form-container").find("form").first();
        var searchButton = searchForm.find(".search-content-buttons button.search-btn");
        var resetButton = searchForm.find(".reset-button");
        var extendedSearchButton = searchForm.find(".search-content-buttons button.extended-search-button");
        var loadingImageSelector = "#content-search-loading-image";
        var extraFieldsSelector = "#extra-search-fields";

        addParsleyValidation(searchForm);

        searchButton.click(function(event) {
            setPreventDefault(event);
            searchForm
                .parsley()
                .whenValidate()
                .done(function() {
                    showLoadingIndicator(loadingImageSelector);

                    // если чекбокс true, скрытое поле с false надо убрать
                    $("form")
                        .find(".checkbox-wrapper input[type=checkbox]")
                        .each(function(num, element) {
                            var chBox = $(element);
                            if (chBox.is(":checked")) {
                                chBox.siblings().removeAttr("name");
                            } else {
                                chBox.siblings().attr("name", chBox.attr("name"));
                            }
                        });

                    var searchResult = $(".search-result-container")[0];
                    var url = $(searchForm).attr('action');
                    var method = $(searchForm).attr('method');

                    /*n.volosatov: поиск с get'а на пост. создал хиден инпут и добавил на форму для сохранения данных формы после нажатия на найти.
                        они понадобятся при переключение страницы, чтобы не потерять текущий фильтр под которым пагинг
                    */
                   var formData = null;
                    if (method && method.toLocaleLowerCase() === "post") {
                        var formArray = searchForm.serializeArray();
                        var formDataHiddenInput = $("#" + formDataInputID);
                        if (formDataHiddenInput.length === 0) {
                            formDataHiddenInput = $('<input>').attr({
                                type: 'hidden',
                                id: formDataInputID,
                                name: formDataInputID,
                                disabled: true
                            }).appendTo(searchForm);
                        }

                        formDataHiddenInput.val(JSON.stringify(formArray));
                        formData = formArray;
                    }

                    if (!formData) {
                       formData = searchForm.serialize();
                   }
                   /*end*/

                    $.ajax({
                        url: url,
                        type: method,
                        data: formData,
                        cache: false,
                        success: function (data) {
                            var block = $('<div>');
                            block.html($.parseHTML(data, document, true));

                            var errorMessages = block.find('.application-errors');
                            var searchResultBlock = block.find('.search-result').parent();
                            var emptySearchResultBlock = block.find('.search-result-empty').parent();
                            var loginFormBlock = block.find("#content-login-form");

                            if (errorMessages.length)
                                $(searchResult).html(errorMessages.html());
                            else if (searchResultBlock.length)
                                $(searchResult).html(searchResultBlock.html());
                            else if (emptySearchResultBlock.length)
                                $(searchResult).html(emptySearchResultBlock.html());
                            else if (loginFormBlock.length)
                                location.reload();
                            else
                                
                                $(searchResult).html(block.find('.page-body').html());

                            hideLoadingIndicator(loadingImageSelector);
                            reinitialiseScripts();
                        },
                        error: function(data) {
                            searchResult.html(data.responseText);
                            hideLoadingIndicator(loadingImageSelector);
                        }
                    });
                });

            return false;
        });

        extendedSearchButton.click(function(ev) {
            var button = $(this);
            button.toggleClass("active");

            toogleExtraFilterFieldsState(button, extraFieldsSelector);
        });

        resetButton.click(function(ev) {
            resetForm(searchForm);
        });

        initExtraFieldsState(extraFieldsSelector);
        toogleExtraFilterFieldsState(extendedSearchButton, extraFieldsSelector);

        fieldsDefaultValuesDictionary = collectHiddenFieldsDefaultValues(searchForm);
    }

    function resetForm(form) {
        form[0].reset();
        if (ChronoGroups) {
            ChronoGroups.ResetPickers();
        }

        $(form).find(".column-container input[type='hidden'][name]").each(function(index, elem) {
            var field = $(elem);

            var name = field.attr('name');
            var value = fieldsDefaultValuesDictionary[name];
            $(elem).val(value);
        });

        $(form).find("input[data-number-type='integer'],input.money").each(function (index, elem) {
            var field = $(elem);
            field.autoNumeric('wipe');
        });

        fillDictDisplayValues();

      /*n.volosatov: поиск с get'а на пост. при ресете удаляем хиден инпут и очищаем словари с мульти выбором*/
        form.find(".dropdown-menu.multiple-editor-list").empty();
        form.find(".dict-dropdown ul li").remove();
        form.find(".mult-dict-display").closest(".dict-modal-control").each(function (index, elem) {
            var field = $(elem);
            var name = field.attr("data-edit-name");
            $("[data-parent-name='" + name + "parent']").val('');
        });

        $(form).find("#" + formDataInputID).remove();
      /*end*/
    }

    function toogleExtraFilterFieldsState(button, extraFieldsSelector) {
        if (button.hasClass('active')) {
            enableExtraFields(extraFieldsSelector);
        } else {
            disableExtraFields(extraFieldsSelector);
        }
    }

    function initExtraFieldsState(selector) {
        $(selector).find('input, select, textarea, button').filter('[disabled]').each(function() {
            $(this).attr('data-edit-disabled', true);
        });
    }

    function enableExtraFields(selector) {
        $(selector).find('input, select, textarea, button').each(function() {
            if (!$(this).attr('data-edit-disabled')) {
                $(this).removeAttr('disabled');
            }
        });
    }

    function disableExtraFields(selector) {
        $(selector).find('input, select, checkbox, textarea, button').each(function() {
            $(this).attr("disabled", true);
        });
    }

    function collectHiddenFieldsDefaultValues(formSelector) {

        var result = [];

        $(formSelector).find(".column-container input[name][type='hidden']").each(function(index, elem) {
            var field = $(elem);

            var value = field.val();
            var name = field.attr('name');
            result[name] = value;
        });

        return result;
    }

    //Добавляет клиентскую валидацию формы поиска
    function addParsleyValidation(documentSearchForm) {
        if (!documentSearchForm || documentSearchForm.length === 0) {
            return;
        }

        documentSearchForm.parsley({
                excluded: "input[type=button], input[type=submit], input[type=reset], input[type=hidden], [disabled]",
                triggerAfterFailure: 'input change',
                validationThreshold: 3,
                uiEnabled: true,
                errorsWrapper: null
            })
            .on("field:validated",
                function() {
                    var parsleyField = this;
                    displayError(parsleyField);
                }
            );
    }

    function displayError(parsleyField) {

        var fieldFormGroupEl = parsleyField.$element.closest(".documentView-field-value");
        var labelFormGroupEl = getLabelContainer(parsleyField.$element);

        if (!parsleyField.isValid()) {
            fieldFormGroupEl.addClass("has-error");
            labelFormGroupEl.addClass("has-error");
        } else {
            fieldFormGroupEl.removeClass("has-error");
            labelFormGroupEl.removeClass("has-error");
        }
    }

    init();

    $(document)
        .on("onDocumentAjaxLoaded",
            function (e) {
                init();
            });
})();