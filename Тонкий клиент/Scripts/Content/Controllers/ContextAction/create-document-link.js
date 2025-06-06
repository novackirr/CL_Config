function onContextSearch(control, targetControl, selectedOutputControl, event) {
    ct.utils.preventDefault(event);

    var form = $(control).closest('form');
    var loadingImage = form.find(".loading-image");

    loadingImage.each(function () {
        showLoadingIndicator($(this).get(0));
    });
    //$("input[hidden][data-parent-name]").remove(); включить для очистки формы от фантомных записей
    // если чекбокс true, скрытое поле с false надо убрать

    $("form")
        .find(".checkbox-wrapper input[type=checkbox]")
        .each(function (num, element) {
            var chBox = $(element);
            if (chBox.is(":checked")) {
                chBox.siblings().removeAttr("name");
            } else {
                chBox.siblings().attr("name", chBox.attr("name"));
            }
        });

    ajaxFormSubmit(
        form.get(0),
        function (data) {
            var block = $('<div>');
            block.html($.parseHTML(data, document, true));

            var errorMessages = block.find('.application-errors');
            var searchResultBlock = block.find('.search-result').parent();

            if (errorMessages.length)
                $(targetControl).html(errorMessages.html());
            else if (searchResultBlock.length)
                $(targetControl).html(searchResultBlock.html());
            else
                $(targetControl).html(block.find('.page-body').html());

            var searchResult = $(targetControl).find('.search-result');
            if (searchResult.length)
                searchResult.attr('data-selectionResult', selectedOutputControl);

            reinitialiseScripts();

            loadingImage.each(function() {
                hideLoadingIndicator($(this).get(0));
            });
        },
        function(data) {
            var errorMessage = form.closest('.context-action-page-body').find('.error-message');
            errorMessage.text(data.responseText);
            errorMessage.removeClass("hide");

            loadingImage.each(function() {
                hideLoadingIndicator($(this).get(0));
            });
        });
    return;
}

function onDxGridSelectionChanged_CustomAction(ev, grid) {

    var targetUniqueIds = "";
    var rows = ev.selectedRowsData;
    
    if (rows && rows.length > 0) {

        for (var i = 0; i < rows.length; i++) {

            if (targetUniqueIds) {
                targetUniqueIds += ",";
            }

            targetUniqueIds += rows[i].Key;
        }
    }
    
    $("#selected-targetUniqueIds").val(targetUniqueIds);
}

$(document).ready(function () {
    $("#actionDialog > .modal-dialog").addClass("modal-large");
    var form = $("#content-search-documents-form");


    var btnSearch = form.find(".search-btn");
    btnSearch.click(function (event) {
        onContextSearch(this, '.context-search-documents-result', '#selected-targetUniqueIds', event);
    });
    if (form.has("[autosearch]")) {
        btnSearch.click();
    }
});