/**
 * В данном файле собраны методы которые используются в afterSubmitJs параметрах разных кнопок
 */

//Уменьшаем счетчик оповещений после нажатия "Удалить", "Пометить прочитанным" на уведомлении. Обновляем грид.
function afterSubmit_UpdateNotification(gridId) {

    new NotificationHub().NotifyCurrentUserGroup();
}