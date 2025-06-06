; (function () { }(window.ct = window.ct || {}));

; (function (api) {
    /**
     * Базовый сервис для взаимодействия с API и обработкой ошибок.
     */
    api.ApiService = ApiService;

    function ApiService() {
        $.ajax
    };

    ApiService.prototype.ajax = function (params) {
        return $.ajax(params).then(this._successResponseHandler, this._errorResponseHandler);
    }

    ApiService.prototype.get = function (url, params) {
        return $.get(url, params).then(this._successResponseHandler, this._errorResponseHandler);
    }

    ApiService.prototype.post = function (url, params) {
        return $.ajax({
            type: "POST",
            url: url,
            contentType: "application/json",
            data: JSON.stringify(params),
            dataType: "json"
        }).then(this._successResponseHandler, this._errorResponseHandler);
        // return $.post(url, params).then(this._successResponseHandler, this._errorResponseHandler);
    }

    ApiService.prototype._successResponseHandler = function (response) {
        var result = {
            response: response
        };
        // Внезапно не все ответы - JSON, поэтому подставляем ещё костыль.
        var errorMessage;
        if (typeof response === "string") {
            if (response.includes("<html")) {
                errorMessage = $(response).find(".application-errors").html();
            } else {
                response = JSON.parse(response);
                errorMessage = response.error
                    || (response.status && response.status.toLowerCase() === "error")
                    ? response.responseMessage
                    : null;
            }
        } else {
            errorMessage = response.status === "error" ? response.statusMessage : undefined;
            if ((response.status === "warning") && response.statusMessage) {
                ct.ui.notify(response.statusMessage, "warning", 5000);
            }
        }
        if (errorMessage) {
            result.alert = ct.ui.alert("Произошла ошибка", errorMessage);
        }

        return result;
    }

    ApiService.prototype._errorResponseHandler = function (response) {
        var errorMessage = typeof response.responseText === "string" ? response.responseText : "Произошла непредвиденная ошибка.";
        var result = {
            response: response,
            alert: ct.ui.alert("Ошибка", errorMessage)
        };
        return result;
    }
}((window.ct = window.ct || {}, window.ct.api = window.ct.api || {})));