; (function () { }(window.ct = window.ct || {}));

/**
 * Модуль с различными полезными (и не очень) утилитами.
 */
; (function (utils) {
    /**
     * Приводит размер файла в байтах к человекочитаемому формату.
     */
    utils.formatBytes = function (bytes, decimals) {
        if (bytes === 0) return "0 байт";
        if (!decimals && decimals !== 0) decimals = 2;
    
        var k = 1024;
        var dm = decimals < 0 ? 0 : decimals;
        var sizes = ["байт", "КБ", "МБ", "ГБ", "ТБ", "ПБ", "ЭБ", "ЗБ", "ИБ"];
    
        var i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
    };
    
    /**
     * Какая-то каштомная отмена действия браузера. Хз зачем, но вот так.
     * @param {Event} event Отменяемое событие.
     */
    utils.preventDefault = function (event) {
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }
    };

    /**
     * Возвращает true, если определено мобильное устройство (телефон/планшет).
     */
    utils.isMobileDevice = function () {
        var deviceInfo = DevExpress.device.real();
        return deviceInfo.phone || deviceInfo.tablet;
    };

    var LOW_SCREEN_WIDTH = 800;
    var LOW_SCREEN_HEIGHT = 768;

    /**
     * Возвращает true, если обнаружено низкое значение ширины экрана.
     */
    utils.isLowScreenWidth = function () {
        return window.screen.width <= LOW_SCREEN_WIDTH;
    };

    /**
     * Возвращает true, если обнаружено низкое значение высоты экрана.
     */
    utils.isLowScreenHeight = function () {
        return window.screen.height <= LOW_SCREEN_HEIGHT;
    };

    /**
     * Возвращает true, если обнаружено низкое разрешение экрана.
     */
    utils.isLowScreenSize = function () {
        return utils.isLowScreenWidth() && utils.isLowScreenHeight();
    };
}((window.ct = window.ct || {}, window.ct.utils = window.ct.utils || {})));