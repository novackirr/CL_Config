(function () {

    console.log("pluginReport");

    var dialog = $("#actionDialog");
    var errorBlock = dialog.find(".modal-errors-wrapper");
    var submitButton = dialog.find("#btn-ok_from_modal");
    var form = dialog.find("form");
    var loading = dialog.find(".modal-loading-wrapper");

    //убираем стандартный сабмит
    submitButton.unbind("click");

    submitButton.on("click",
        function (event) {
            setPreventDefault(event);
            hideError();

            startOperation();
            handleClick();
        });

    function handleClick() {
        debugger;
        console.info("handleClick");

        var promise = submitForm();

        promise.then(function (data) {
            var json = JSON.parse(data);
            if (json.status == 'OK') {
                operationFinish();

                var reportKeys = json.responseMessage;
                if (!reportKeys || reportKeys.trim() === "") {

                }

                var reportKeysArr = reportKeys.split(",");

                $.each(reportKeysArr, function (index, reportKey) {
                    var url = getRelativeUrl("/Reports/DownloadReportResult");
                    url += "?key=" + encodeURIComponent(reportKey);

                    Download(url);
                });

                window.location.reload();
            };
            operationFinish();
            }, function (error) {
                showError(error);
                throw new Error(error);
            });
    }

    function Download(url) {
        document.getElementById('download_report').src = url;
    };

    function makeReport() {
        updateAction("report");
        return submitForm();
    }  

    function showError(text) {
        operationFinish();
        errorBlock.show();
        errorBlock.html(text);
    }

    function hideError() {
        errorBlock.hide();
        errorBlock.empty();
    }

    function startOperation() {
        form.find("[type='submit']").prop('disabled', true);
        dialog.find(".btn-submit").prop('disabled', true);

        loading.show();
    }

    function operationFinish() {
        form.find("[type='submit']").prop('disabled', false);
        dialog.find(".btn-submit").prop('disabled', false);

        loading.hide();
    }

    function submitForm() {
        var actionUrl = form.attr("action");
        var data = form.serializeArray();
        return $.ajax({
            url: actionUrl,
            type: "POST",
            data: data,
            cache: false
        });
    }
}());