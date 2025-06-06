; (function () { }(window.ct = window.ct || {}));

; (function (api) {
    api.DocumentationApiService = DocumentationApiService;

    function DocumentationApiService(baseUrl) {
        this._baseUrl = baseUrl[baseUrl.length - 1] === "/" ? baseUrl : baseUrl + "/";
    }

    DocumentationApiService.prototype = Object.create(ct.api.ApiService.prototype);
    DocumentationApiService.prototype.constructor = DocumentationApiService;

    DocumentationApiService.prototype.getFileCatalogs = function() {
        var url = this._baseUrl + "GetFileCatalogs";
        return this.get(url).then(function(resInfo) { return resInfo.response.data; });
    };

    DocumentationApiService.prototype.getFiles = function (catalogKey) {
        var url = this._baseUrl + "GetFiles";
        var params = { catalogKey: catalogKey, rev: + new Date().getTime() };
        return this.get(url, params).then(function (resInfo) { return resInfo.response.data; });
    };

    DocumentationApiService.create = function (baseUrl) { 
        return new DocumentationApiService(baseUrl);
    }
}((window.ct = window.ct || {}, window.ct.api = window.ct.api || {})));