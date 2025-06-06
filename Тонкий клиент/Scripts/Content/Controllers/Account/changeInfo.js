$(document).ready(function () {
    changeInfo.init();
});

var changeInfo = {

    init: function () {
        $('#Phone').inputmask("9-9{1,4}-9{1,6}");
        $('#Fax').inputmask("9-9{1,4}-9{1,6}");
        addParsleyValidation("form");
        this.addEventHandlers();

        if($("#EdsThumbprint").length > 0)
            window.ExpectedEdsCert = true;
            window.register = {
                organizations: []
            };
    },

    addEventHandlers: function () {

        this.addFormSubmitEvent();
        this.addCancelEvent();
    },

    addFormSubmitEvent: function () {
        var self = this;
        $(".btn-save").click(function () {

            var form = $("#content-change-info-form");
            form.parsley().whenValidate().done(function () {
                waitingDialog.showWaiting();
                ajaxFormSubmit(form[0], function (response) {
                    self.showSuccess();
                    waitingDialog.hide();
                    $(".btn-cancel").click();
                }, function (error) {
                    self.showError(error.responseText);
                    waitingDialog.hide();
                });
            });
        });
    },

    disableAndShowLoading: function () {
        //Делаем невозожным множественное нажатие кнопки
        $(".btn").prop('disabled', true);
        //Отображаем лоадинг при submit'е формы
        showLoadingIndicator("#content-change-info-loading-image");
    },

    addCancelEvent: function () {

        $(".btn-cancel").click(function () {

            //Делаем невозожным множественное нажатие кнопки
            $(".btn").prop('disabled', true);
            showLoadingIndicator("#content-change-info-loading-image");
            window.location.href = $("[name='returnUrl']").val();
            return false;
        });
    },

    showError: function showError(error) {
        var alertElement = $("#message");
        alertElement.html("");
        alertElement.removeClass('alert-success');
        if (!alertElement.hasClass('alert-danger')) {
            alertElement.addClass('alert-danger');
        }

        alertElement.text(error);
        alertElement.show();
    },

    showSuccess: function showSuccess() {
        var alertElement = $("#message");
        alertElement.html("");
        alertElement.removeClass('alert-danger');
        if (!alertElement.hasClass('alert-success')) {
            alertElement.addClass('alert-success');
        }

        alertElement.text("Изменения в профиле успешно сохранены.");
        alertElement.show();
    }
}