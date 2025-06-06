var tmplTable = (function () {
    var dialog = null,
        searchForm = null,
        btnSearch = null,
        btnReset = null,
        loadingImage = null,
        fieldsDefaultValuesDictionary = [];

    $(document).ready(function () {
        console.info("tmplTable");
        init();
        updateDatepickers();

        subscribeOnSelection();

        btnSearch.click(function (event) {
            setPreventDefault(event);
            search('.context-search-documents-result', '#selected-targetUniqueIds');
        });

        if (searchForm.length > 0) {
            fieldsDefaultValuesDictionary = collectHiddenFieldsDefaultValues(searchForm);
        }

        btnReset.click(function(event) {
            setPreventDefault(event);
            searchForm[0].reset();

            searchForm.find(".column-container input[type='hidden'][name]").each(function(index, elem) {
                var field = $(elem);
                var value = fieldsDefaultValuesDictionary[field.attr('name')];
                field.val(value);
            });

            searchForm.find("ul.multiple-editor-list").empty();

            searchForm.find(".dict-dropdown ul li").remove();
            searchForm.find(".mult-dict-display").closest(".dict-modal-control").each(function (index, elem) {
                var field = $(elem);
                var name = field.attr("data-edit-name");
                $("[data-parent-name='" + name + "parent']").val('');
            });

            fillDictDisplayValues();
        });
    });

    function init() {
        dialog = $("#actionDialog");
        searchForm = dialog.find("#content-search-documents-form");
        btnSearch = searchForm.find("button.search-btn");
        btnReset = searchForm.find("button.reset-button");
        loadingImage = searchForm.find(".loading-image");
    }

    function subscribeOnSelection(){
        var gridId =  dialog.find("[data-state-key='templates-table']").attr("data-grid-id");
        var grid = $("#" + gridId).dxDataGrid('instance');
        grid.option("onSelectionChanged", function (event) {
            console.info("selected " + event.selectedRowKeys);
            dialog.find("input[name='template']").val(event.selectedRowKeys);
        });
    }

    function search(tableContainerSelector, selectedOutputSelector) {

        loadingImage.each(function () {
            showLoadingIndicator($(this).get(0));
        });

        searchForm.find(".checkbox-wrapper input[type=checkbox]").each(function (num, element) {
            var chBox = $(element);
            if (chBox.is(":checked")) {
                chBox.siblings().removeAttr("name");
            } else {
                chBox.siblings().attr("name", chBox.attr("name"));
            }
        });

        $.ajax({
            url: searchForm.attr('action'),
            type: searchForm.attr('method'),
            data: searchForm.serializeArray(),
            success: function (data) {

                var block = $('<div>');
                block.html($.parseHTML(data, document, true));

                var errorMessages = block.find('.application-errors');
                var searchResultBlock = block.find('.search-result').parent();

                if (errorMessages.length)
                    $(tableContainerSelector).html(errorMessages.html());
                else if (searchResultBlock.length)
                    $(tableContainerSelector).html(searchResultBlock.html());
                else
                    $(tableContainerSelector).html(block.find('.page-body').html());

                var searchResult = $(tableContainerSelector).find('.search-result');
                if (searchResult.length)
                    searchResult.attr('data-selectionResult', selectedOutputSelector);

                reinitialiseScripts();

                loadingImage.each(function () {
                    hideLoadingIndicator($(this).get(0));
                });

                subscribeOnSelection();
            },
            error: function (data) {
                var errorMessage = dialog.find('.error-message');
                errorMessage.text(data.responseText);
                errorMessage.removeClass("hide");

                loadingImage.each(function () {
                    hideLoadingIndicator($(this).get(0));
                });
            }
        });
    }

    function collectHiddenFieldsDefaultValues(form) {
        var result = [];
        form.find(".column-container input[name][type='hidden']").each(function(index, elem) {
            var field = $(elem);
            result[field.attr('name')] = field.val();
        });

        return result;
    }
}());