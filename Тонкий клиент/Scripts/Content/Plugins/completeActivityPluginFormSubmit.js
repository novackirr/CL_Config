(function () {
    console.log("completeActivityPluginFormSubmit");
    updateDatepickers();
    if (window.docChangeObserver) window.docChangeObserver.disable();

    if (typeof UploadAttachment !== "undefined") {
        UploadAttachment.setPostUploadAction(function () {
            var defer = jQuery.Deferred();

            var form = $(".modal-dialog form");
            ajaxFormSubmit(form[0], function (response) {
                if (response && response.trim() !== "") {
                    if (WorkflowNotificationManager.isNotificationData(response))
                        WorkflowNotificationManager.saveNotificationData(response);
                    defer.resolve();
                } else {
                    defer.resolve();
                }
            }, function (error) {
                if (error.allMessages && error.allMessages.length && error.allMessages.length > 0) {
                    if (error.allMessages.length === 1)
                        error = error.allMessages[0];
                    else
                        console.error(error.allMessages.join(","));
                }

                defer.reject(error);
            });

            return defer.promise();
        });
    }
}());