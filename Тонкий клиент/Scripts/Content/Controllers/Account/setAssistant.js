$(document).ready(function () {
    setAssistant.init();
});


function clearAndDisableDate(val) {

    if (val) {
        $("#DummyStartDate").attr("disabled", true);
        $("#DummyEndDate").attr("disabled", true);
        $('#DummyStartDate').val('');
        $('#DummyEndDate').val('');
    } else {
        $("#DummyStartDate").removeAttr("disabled");
        $("#DummyEndDate").removeAttr("disabled");

    }

};

var setAssistant = {
    setRequiredAssistantFields: function (dummyId) {
        if (dummyId) {
            $("#DummyStartDate").attr("required", true);
            $("#DummyEndDate").attr("required", true);
        } else {
            $("#DummyStartDate").removeAttr("required");
            $("#DummyEndDate").removeAttr("required");
        }
    },

    init: function () {
        $('.chosen-select').chosen({ search_contains: true });
        addParsleyValidation("form");
        this.addEventHandlers();

        if ($('#DummyEndDate').length > 0) {
           // $('[data-name="startDate"]').data("DateTimePicker").options({ minDate: moment() });
           // $('[data-name="endDate"]').data("DateTimePicker").options({ minDate: moment() });
            $('[data-name="startDate"]').on('dp.change',
                function() {
                    var startDate = $(this).data("DateTimePicker").date();

                    //$('[data-name="endDate"]').data("DateTimePicker").options({ minDate: startDate });
                });

            var setAssisObj = this;
            var allInitChecked = $('[name="CheckedUsers"]:checked');
            setAssistant.setRequiredAssistantFields(allInitChecked.length > 0);

            $('[name="CheckedUsers"]').on('change', function () {
                var allChecked = $('[name="CheckedUsers"]:checked');

                setAssisObj.setRequiredAssistantFields(allChecked.length > 0);

                if (this.value && !$('#DummyStartDate').val()) {
                    $('#DummyStartDate').val(moment(new Date()).format('DD.MM.YYYY'));
                }
            });

            $(".btn.btn-default.clear-select").click(function () {
                var allChecked = $('[name="CheckedUsers"]:checked');
                allChecked.each(function() {
                    $(this).prop('checked', false);
                });

                $('#DummyStartDate').val('');
                $('#DummyEndDate').val('');

                setAssistant.setRequiredAssistantFields(false);
            });


            if ($('[name="Dummy"]').val() === "") {
              clearAndDisableDate(true);
            }
            else
               clearAndDisableDate(false);

        }
    },

    addEventHandlers: function () {
        this.addClearEvent();
        this.addFormSubmitEvent();
        this.addCancelEvent();
        this.changeDummy();
       
    },

   
    changeDummy: function () {
        $(".chosen-select").chosen().change(function () {
            var select = $(".chosen-select").chosen();    
            console.log($('[name="Dummy"]').val());
            if ($(this).attr('id') === "Dummy") {
                if ($(this).val() === "") {
                    clearAndDisableDate(true);
                }
                else {
                    clearAndDisableDate(false);

                }
            }
    });
    },
    addClearEvent: function () {
        $(".clear-select").click(function () {
            var select = $(this).closest('.column-container').find('.chosen-select');
            select.val('').trigger('chosen:updated').trigger('change');
            if (select.attr('id') === "Dummy") {
                $('#DummyStartDate').val('');
                $('#DummyEndDate').val('');
            }
        });
    },
    addFormSubmitEvent: function () {
        var self = this;
        $(".btn-save").click(function () {

            var form = $("#content-set-assistant-form");
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
        showLoadingIndicator("#content-set-assistant-loading-image");
    },

    addCancelEvent: function () {

        $(".btn-cancel").click(function () {

            //Делаем невозожным множественное нажатие кнопки
            $(".btn").prop('disabled', true);
            showLoadingIndicator("#content-set-assistant-loading-image");
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