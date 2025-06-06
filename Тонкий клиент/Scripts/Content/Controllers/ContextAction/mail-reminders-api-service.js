; (function () { }(window.ct = window.ct || {}));

; (function (api) {
    api.MailRemindersApiService = MailRemindersApiService;

    function MailRemindersApiService(baseUrl) {
        this._baseUrl = baseUrl[baseUrl.length - 1] === "/" ? baseUrl : baseUrl + "/";
    }

    MailRemindersApiService.prototype = Object.create(ct.api.ApiService.prototype);
    MailRemindersApiService.prototype.constructor = MailRemindersApiService;

    /**
     * Возвращает напоминания пользователя.
     */
    MailRemindersApiService.prototype.getItems = function () {
        var url = this._baseUrl + "GetUserRemindersJson";
        return this.post(url, null, function () { }, "json").then(function (resInfo) { return resInfo.response; });
    };

    /**
     * Удаляет напоминание по id
     */
    MailRemindersApiService.prototype.removeItem = function (remId) {
        var url = this._baseUrl + "DeleteMailReminderJson";
        return this.post(url, remId).then(function (resInfo) { return resInfo.response.data; });
    };

    MailRemindersApiService.create = function (baseUrl) {
        return new MailRemindersApiService(baseUrl);
    }
}((window.ct = window.ct || {}, window.ct.api = window.ct.api || {})));