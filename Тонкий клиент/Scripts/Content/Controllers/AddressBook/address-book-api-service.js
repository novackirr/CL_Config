; (function () { }(window.ct = window.ct || {}));

; (function (api) {
    api.AddressBookApiService = AddressBookApiService;

    function AddressBookApiService(baseUrl) {
        this._baseUrl = baseUrl[baseUrl.length - 1] === "/" ? baseUrl : baseUrl + "/";
    }

    AddressBookApiService.prototype = Object.create(ct.api.ApiService.prototype);
    AddressBookApiService.prototype.constructor = AddressBookApiService;

    /**
     * Возвращает элементы адресной книги.
     * @param {object} filter Фильтр элементов.
     * @returns {Array<AddressBookItem>} 
     */
    AddressBookApiService.prototype.getItems = function (filter) {
        var url = this._baseUrl + "GetItems";
        return this.post(url, filter, function() {}, "json").then(function (resInfo) { return resInfo.response; });
    };

    /**
     * Возвращает доп. свойства элементов адресной книги.
     * @param {object} filter Фильтр для элементов.
     * @returns {Array<AddressBookItem>} 
     */
    AddressBookApiService.prototype.getItemProperties = function (filter) {
        var url = this._baseUrl + "GetItemProperties2";
        return this.post(url, filter).then(function (resInfo) { return resInfo.response.data; });
    };

    /**
     * Устанавливает (или добавляет, при отсутствии) новые значения доп. свойств элементов адресной книги.
     * @param {Array<AddressBookItem>} addressBookItemProperties 
     * @returns {} 
     */
    AddressBookApiService.prototype.setItemProperties = function (addressBookItemProperties) {
        var url = this._baseUrl + "SetItemProperties";
        return this.post(url, addressBookItemProperties).then(function (resInfo) { return resInfo.response.data; });
    };

    /**
     * Удаляет доп. свойства из элементов адресной книги.
     * @param {Array<AddressBookItem>} addressBookItemProperties 
     * @returns {} 
     */
    AddressBookApiService.prototype.removeItemProperties = function (addressBookItemProperties) {
        var url = this._baseUrl + "RemoveItemProperties";
        return this.post(url, addressBookItemProperties).then(function (resInfo) { return resInfo.response.data; });
    };

    AddressBookApiService.create = function (baseUrl) {
        return new AddressBookApiService(baseUrl);
    }
}((window.ct = window.ct || {}, window.ct.api = window.ct.api || {})));