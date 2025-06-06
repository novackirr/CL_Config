; (function () { }(window.ct = window.ct || {}));

/**
 * Взаимодействие с API заданий автоимпорта / автоэкспорта.
 */
; (function (api) {
    api.AutoTaskApiService = AutoTaskApiService;

    function AutoTaskApiService(baseUrl) {
        this._baseUrl = baseUrl[baseUrl.length - 1] === "/" ? baseUrl : baseUrl + "/";
    }

    AutoTaskApiService.prototype = Object.create(ct.api.ApiService.prototype);
    AutoTaskApiService.prototype.constructor = AutoTaskApiService;

    /**
     * Получение источников (плагинов) заданий автоимпорта / автоэкспорта.
     * @param {string} taskType Тип заданий (импорт / экспорт).
     */
    AutoTaskApiService.prototype.getAutoTaskSources = function (taskType) {
        var url = this._baseUrl + "GetAutoTaskSources";
        var params = { taskType: taskType };
        return this.get(url, params).then(function (resInfo) { return resInfo.response.data; });
    };

    AutoTaskApiService.prototype.getAutoTasks = function (type, sourceName) {
        var url = this._baseUrl + "GetAutoTasks";
        var params = { type: type, sourceName: sourceName };
        return this.get(url, params).then(function (resInfo) { return resInfo.response.data; });
    };

    AutoTaskApiService.prototype.runAutoTask = function (autoTask) {
        var url = this._baseUrl + "RunAutoTask";
        return this.post(url, autoTask).then(function (resInfo) { return resInfo.response; });
    };

    AutoTaskApiService.create = function (baseUrl) {
        return new AutoTaskApiService(baseUrl);
    }
}((window.ct = window.ct || {}, window.ct.api = window.ct.api || {})));