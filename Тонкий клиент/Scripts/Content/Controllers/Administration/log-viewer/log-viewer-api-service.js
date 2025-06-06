; (function () { }(window.ct = window.ct || {}));

/**
 * Взаимодействие с API.
 */
; (function (api) {
    api.LogViewerApiService = LogViewerApiService;

    function LogViewerApiService(baseUrl) {
        this._baseUrl = baseUrl[baseUrl.length - 1] === "/" ? baseUrl : baseUrl + "/";
    }

    LogViewerApiService.prototype = Object.create(ct.api.ApiService.prototype);
    LogViewerApiService.prototype.constructor = LogViewerApiService;

    /**
     * Получение списка лог файлов.
     * @param {string} taskType Тип заданий (импорт / экспорт).
     */

    LogViewerApiService.prototype.getItems = function (path, start, end) {
        var url = this._baseUrl + "GetLogs" + "?path=" + path.replace(/_/g,'%') + "&start=" + start + "&end=" + end;
        return this.get(url).then(function(resInfo) {
             return resInfo.response;
        });
    };

    LogViewerApiService.prototype.getFile = function (file) {
        var url = this._baseUrl + "GetFile?file"+file;
        return url;
    };

    LogViewerApiService.create = function (baseUrl) {
        return new LogViewerApiService(baseUrl);
    }
}((window.ct = window.ct || {}, window.ct.api = window.ct.api || {})));