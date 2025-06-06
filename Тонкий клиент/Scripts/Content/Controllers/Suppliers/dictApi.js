var dictApi = (function () {

    function callApiLongOperation(url) {
        var promise = callApi(url);
        longRunningOperation(promise);
        return promise;
    }

    function postApiLongOperation(url, data) {
        var promise = postApi(url, data);
        longRunningOperation(promise);
        return promise;
    }

    function longRunningOperation(promise) {
        waitingDialog.showWaiting();
        return promise.always(function () {
            waitingDialog.hide();
        });
    }

    function callApi(url) {
        var defer = jQuery.Deferred();
        $.ajax({
            url: url,
            type: 'GET',
            contentType: false,
            cache: false,
            processData: false,
        }).then(function (response) {
            var data = JSON.parse(response);
            if (data.status === "OK") {
                var data = JSON.parse(data.responseMessage);
                defer.resolve(data);
            } else {
                showCommonErrors([data.responseMessage]);
                defer.reject(data.responseMessage);
            }
        }, function (error) {
            showCommonErrors([error.responseText]);
            defer.reject(error.responseText);
        });

        return defer.promise();
    }

    function postApi(url, data) {
        var defer = jQuery.Deferred();

        var formData = new FormData();
        $.each(data, function (name, value) {
            formData.append(name, value);
        });

        $.ajax({
            url: url,
            type: 'POST',
            mimeType: "multipart/form-data",
            cache: false,
            data: formData,
            contentType: false,
            cache: false,
            processData: false
        }).then(function (response) {
            var data = JSON.parse(response);
            if (data.status === "OK") {
                defer.resolve();
            } else {
                showCommonErrors([data.responseMessage]);
                defer.reject(data.responseMessage);
            }
        }, function (error) {
            showCommonErrors([error.responseText]);
            defer.reject(error.responseText);
        });

        return defer.promise();
    }

    return {
        callApi: callApiLongOperation,
        postApi: postApiLongOperation
    };
}());