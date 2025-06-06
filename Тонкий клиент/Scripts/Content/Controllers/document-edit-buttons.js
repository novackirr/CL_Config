"use strict";
;(function () {
    init();

    function init() {
        bindSaveButton($("form.edit-form button.save-editing-doc"), ct.document.edit.save);
        bindSaveButton($("form.edit-form button.save-editing-project"), ct.document.edit.saveProject);
        bindCancelButton();
    }
    
    function bindSaveButton($button, func) {
        $button.click(function (e) {

            //Не даем пользователю случайно сделать несколько кликов подряд.
            if (!ct.common.delayPassed(this, 3))
                return;

            // При клике по "Сохранить как документ" меняем статус на "Черновик"
            var fromProjectToDoc = $(e.target).attr("from-project-to-doc");
            if (fromProjectToDoc !== undefined) {
                changeDocStatus("Черновик");
            }

            var ensureLockUrl = $(e.target).attr("ensure-lock-url");
            var lockOverridenUrl = $(e.target).attr("lock-was-overriden-url");
            var documentKey = getQueryStringParameterByName("uniqueIds");
            $.post(ensureLockUrl, { documentKey: documentKey }, function (data) {
                if (data && data.success) {
                    if (data.haveLock) {
                        func();
                    } else {
                        ModalHelper({
                            dialog: '#modalInfo',
                            url: lockOverridenUrl,
                            isTargetBlank: false,
                            dontSubmit: true,
                            control: e.target,
                            event: e,
                        }).openWindow();
                    }
                }
            });
        });
    }

    function bindCancelButton() {
        $("form.edit-form button.cancel-editing-doc").click(function (e) {
            var unlockUrl = $(e.target).attr("unlock-url");
            var id = getQueryStringParameterByName("uniqueIds");
            ct.document.edit.cancel(unlockUrl, id);
        });
    }
})();