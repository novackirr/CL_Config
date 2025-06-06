function afterEisLoad(event, form) {
    // скрываем текст сообщений
    var dialog = $(".context-action-page-body");
    var dialogMessage = dialog.find(".dialog-message");
    if (dialogMessage.length > 0) {
        dialogMessage.hide();
    }
    var errorMessage = dialog.find("#error-message");
    if (errorMessage.length > 0) {
        if ((errorMessage[0].innerText.indexOf("User with login") > -1)
            || (errorMessage[0].innerText.indexOf("Password check for user with login") > -1)) {
            var credentialsBlock = dialog.find("#credentials-block");
            credentialsBlock.show();
        }
    }
}