//Signalr хаб уведомлений. Используется для оперативного обновления счетчиков уведомлений во всех вкладках браузера клиента.
var NotificationHub = (function ($) {
    "use strict";

    function NotificationHub() {
    }

    //Подписчики на событие - новое уведомление. Подписчиком может быть страница уведомлений, где недостаточно просто обновить один счетчик уведомлений.
    NotificationHub.prototype.OnNewMessageHandlers = [];

    //Подписаться на событие - новое уведомление.
    NotificationHub.prototype.OnNewMessageSubscribe = function (fn) {
        var self = this;

        self.OnNewMessageHandlers.push(fn);
    }

    //Инициализация signalr хаба уведомлений.
    NotificationHub.prototype.InitSignalRHub = function () {
        var self = this;
        
        $.connection.notificationHub.client.newMessage = function () {

            function updateNotifications() {
                //Если есть подписчики, то дергаем их
                if (self.OnNewMessageHandlers.length > 0) {
                    self.OnNewMessageHandlers.forEach(function (item) {
                        item.call();
                    });
                } else { //Если подписчиков нет, то просто обновляем счетчик уведомлений
                    new NotificationService().ShowCount();
                }
            }

            updateNotifications();

            //Некоторые уведомления приходят до изменения в БД (создание сущности), поэтому делаем повторный запрос через setTimeout
            setTimeout(function () {
                updateNotifications();
            }, 4000);
        };

        //Используем longPolling, т.к. остальные транспорты не работают с включенной Анонимной проверкой подлинности без параметра [Authorize] над хабом.
        //Анонимная проверка подлинности нам нужна, а параметр [Authorize] использовать мы не можем, т.к. у нас кастомная аутентификация и Context.User.Identity.Name пустой в хабе (т.е. никто не попадет в хаб, если его [Authorize] пометить).
        //Если перепишут аутентификацию и Context.User.Identity.Name будет не пустым, то пометить .cs класс хаба атрибутом Authorize и отключите в js использование { transport: 'longPolling' }
        $.connection.hub.start({ transport: 'longPolling' });
    }

    //Уведомить текущую группу пользователя о новом уведомлении.
    NotificationHub.prototype.NotifyCurrentUserGroup = function () {
        $.connection.notificationHub.server.notifyCurrentUserGroup();
    }

    return NotificationHub;
})($);

