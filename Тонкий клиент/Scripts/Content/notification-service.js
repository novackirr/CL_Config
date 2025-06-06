//Сервис уведомлений. Получает количество уведомлений и обновляет счетчик уведомлений в верхнем правом углу.
var NotificationService = (function ($) {
    "use strict";

    function NotificationService() {
        var self = this;

        self.base = $("base").attr("href");
        if (self.Base === "/") self.base = "";
    }

    //Получает количество уведомлений (прочитанных или непрочитанных).
    NotificationService.prototype.GetCount = function (readed, useMaxCount) {
        var self = this;
        var defer = $.Deferred();

        $.ajax({
            type: "get",
            url: getRelativeUrl("Notification/Count"),
            cache: false,
            data: { readed: readed, useMaxCount: useMaxCount },
            error: function (error) { defer.reject(error) },
            success: function (data) { defer.resolve(data) }
        });

        return defer.promise();
    }

    //Форматирует текст который выводится в счетчике уведомлений.
    NotificationService.prototype.CountToText = function (count) {
        if (count < 1) return "";
        if (count > 99) return "99+";

        return count;
    }

    //Возвращает разный css стиль счетчика уведомлений в правом верхнем углу, для разного количества уведомлений.
    NotificationService.prototype.CountToClass = function (count) {
        if (count < 1)   return "empty";
        if (count < 10)  return "small";
        if (count < 100) return "middle";

        return "large";
    }

    NotificationService.prototype.AllClasses = function () {
        return "empty small middle large";
    }

    //Получает количество непрочитанных уведомлений и обновляем счетчик уведомлений в правом верхнем углу.
    NotificationService.prototype.ShowCount = function () {
        var self = this;
        
        self.GetCount(false, true).then(function (count) {
            self.ShowEnvelopeCount(count);
        });
    }

    //Обновляет счетчик уведомлений в верхнем правом углу.
    NotificationService.prototype.ShowEnvelopeCount = function (count) {
        var self = this;
        var number = parseInt(count);

        //Обновляем стиль счетчика в верхнем правом углу
        var newClass = self.CountToClass(number);
        var notificationItem = $("#notifications-item");
        var classes = notificationItem.attr("class");

        if (classes.indexOf(newClass) === -1) {
            notificationItem
                .removeClass(self.AllClasses())
                .addClass(newClass);
        }

        //Обновляем счетчик уведомлений в верхнем правом углу
        $("#notifications-badge").text(self.CountToText(number));        
    }

    return NotificationService;
})($);

