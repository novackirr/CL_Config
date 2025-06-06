$(document).ready(function () {

    var checkboxes = $("input[type='checkbox'][name='categories']");
    checkboxes.change(function () {
        setButtonEnabled(checkboxes);
    });

    setButtonEnabled(checkboxes);

    function setButtonEnabled(checkboxes) {
        var checkedItems = $.grep(checkboxes, function (element, index) {
            return $(element).is(":checked");
        });

        var submitButton = $(".delete-attachments-action").closest(".modal-content").find(".btn-submit");
        if (checkedItems.length > 0) {
            submitButton.prop("disabled", false);
        } else {
            submitButton.prop("disabled", true);
        }
    }
});
