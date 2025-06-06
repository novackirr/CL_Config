var createDocumentTemplate = {

    init: function () {
        
        this.addEventHandlers();
    },

    addEventHandlers: function () {

        this.addFormSubmitEvent();
    },


    clickFunc: function () {

        var form = $("form");
        form
            .parsley()
            .whenValidate()
            .done(function () {

                var loading = $(".modal-loading-wrapper");
                loading.show();

                var docKey = window.location.pathname.split("/").pop();
                var templateName = $("#templateName").val();

                $.ajax({
                    url: form.attr("action"),
                    data: { uniqueIds: docKey, templateName: templateName },
                    type: 'POST',
                    cache: false,
                    success: function (data) {

                        loading.hide();
                        $('button:contains("Закрыть")').click();
                        $(".fade.in").click();
                    },
                    error: function () {

                        loading.hide();
                    }
                });
            });
    },

    addFormSubmitEvent: function () {

        var submitButton = $(".btn-submit");
        submitButton.unbind("click");

        $("#templateName").keypress(function (e) {
            if (e.which == 13) {
                e.preventDefault();
                createDocumentTemplate.clickFunc();
            }
        });

        submitButton.click(createDocumentTemplate.clickFunc);
    }
}

$(document).ready(function () {
    
    createDocumentTemplate.init();
});