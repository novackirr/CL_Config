function removeReminder(control, reminderId) {

    //Не даем пользователю случайно сделать несколько кликов подряд.
    if (!ct.common.delayPassed(this, 1))
        return;
    
    $.ajax({
        url: getAbsoluteUrl("ContextAction/DeleteMailReminder"),
        data: { id: reminderId },
        type: 'POST',
        cache: false,
        success: function (feedback) {
            var jsonExtract = JSON.parse(feedback);
            if (jsonExtract.status === "ERROR") {
                ct.common.showCommonErrors(jsonExtract.responseMessage);
            }
            if (jsonExtract.status === "OK") {
                onRemoveFinish(control);
            }
        },
        error: function () {
            ct.common.showCommonErrors("Ошибка удаления напоминания");
        }
    });
}

function removeReminderAdmin(control, reminderId) {
    $.ajax({
        url: getAbsoluteUrl("ContextAction/DeleteMailReminderAdmin"),
        data: { id: reminderId },
        type: 'POST',
        cache: false,
        success: function (feedback) {
            var jsonExtract = JSON.parse(feedback);
            if (jsonExtract.status === "ERROR") {
                ct.common.showCommonErrors(jsonExtract.responseMessage);
            }
            if (jsonExtract.status === "OK") {
                onRemoveFinish(control);
            }
        },
        error: function () {
            ct.common.showCommonErrors("Ошибка удаления напоминания");
        }
    });
}

function onRemoveFinish(control) {
    var remindersTable = $(control).closest(".search-result-table");

    $(control).closest(".search-result-row").remove();
    
    if (remindersTable.children(".search-result-row").length <= 1) {
        remindersTable.empty();
        remindersTable.text("Нет назначенных напоминаний");
        remindersTable.css("text-align", "center");
    }

}

$(document).ready(function () {
    $("#deliveryDateTimeGroup").each(function () {

        $(this).datetimepicker({
            format: 'DD.MM.YYYY HH:mm',
            locale: 'ru',
            widgetPositioning: {
                // принудительно выставляем левое выравнивание календаря
                horizontal: "left"
            },
            widgetParent: resolveWrapper($(this)),
            minDate: new Date()
        });
    });

    function hasNonStaticParent(el) {

        var parent = el;
        if (parent) {
            if (parent.css('position') === 'static') {
                parent = parent.parents().filter(function () {
                    return $(this).css('position') !== 'static';
                }).first();
            }
        }

        return parent.length !== 0;
    }

    function resolveWrapper(el) {
        var wrapper = el.closest(".table-edit-wrapper, .modal-content-wrapper");
        return wrapper && hasNonStaticParent(wrapper) ? wrapper : null;
    }
});