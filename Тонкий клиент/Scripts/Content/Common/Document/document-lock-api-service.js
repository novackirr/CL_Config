; (function () { }(window.ct = window.ct || {}));

; (function (api) {
    api.DocumentLockApiService = DocumentLockApiService;

    function DocumentLockApiService(baseUrl) {
        this._baseUrl = baseUrl[baseUrl.length - 1] === "/" ? baseUrl : baseUrl + "/";
    }

    DocumentLockApiService.prototype = Object.create(ct.api.ApiService.prototype);
    DocumentLockApiService.prototype.constructor = DocumentLockApiService;

    /**
     * Проверяет, заблокирован ли документ.
     * @param {number} documentKey Идентификатор (ключ) документа.
     * @returns {Promise<boolean>} 
     */
    DocumentLockApiService.prototype.isLocked = function (documentKey) {
        var url = this._baseUrl + "IsLocked";
        return this.get(url, { documentKey: documentKey }, function () { }, "json").then(function (resInfo) { return resInfo.response.data[0].isLocked; });
    };

    /**
     * Блокирует документ на редактирование.
     * @param {number} documentKey Идентификатор (ключ) документа.
     * @returns {Promise<boolean>} 
     */
    DocumentLockApiService.prototype.lock = function (documentKey) {
        var url = this._baseUrl + "TryToLock";
        return this.post(url, { documentKey: documentKey }, function () { }, "json").then(function (resInfo) { return resInfo.response.success; });
    };

    /**
     * Снимает блокировку с документа.
     * @param {number} documentKey Идентификатор (ключ) документа.
     * @returns {Promise<boolean>} 
     */
    DocumentLockApiService.prototype.unlock = function (documentKey) {
        var url = this._baseUrl + "UnLock";
        return this.post(url, { documentKey: documentKey }, function () { }, "json").then(function (resInfo) { return resInfo.response.success; });
    };

    /**
     * Принудительно снимает блокировку с документа.
     * @param {number} documentKey Идентификатор (ключ) документа.
     * @returns {Promise<boolean>} 
     */
    DocumentLockApiService.prototype.forceUnlock = function (documentKey) {
        var url = this._baseUrl + "TryToForceUnLock";
        return this.post(url, { documentKey: documentKey }, function () { }, "json").then(function (resInfo) { return resInfo.response.success; });
    };
    
    DocumentLockApiService.create = function (baseUrl) {
        return new DocumentLockApiService(baseUrl);
    }
}((window.ct = window.ct || {}, window.ct.api = window.ct.api || {})));