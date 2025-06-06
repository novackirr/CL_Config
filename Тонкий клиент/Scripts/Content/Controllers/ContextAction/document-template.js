var documentTemplates = (function () {

    function createIframe(scr, iframeLoadedCallback, iframeContentLoadedCallback) {

        $("#iframeContainer").empty();

        $('<iframe>', {
            src: scr,
            id: 'docTemplateFrame',
            name: "docTemplateFrame",
            frameborder: 1,
            scrolling: 'no',
            onload: function () {
                if (iframeLoadedCallback)
                    iframeLoadedCallback();
                this.onload = function (event) {
                    if (iframeContentLoadedCallback)
                        iframeContentLoadedCallback(event.target);
                };
            }
        }).appendTo('#iframeContainer');
    }

    return {
        autoCreatingClick: function (element, e, resultAction) {
            waitingDialog.show('Создание документов');
            e.preventDefault();

            createIframe(element.href,
                function () {
                    if (resultAction === "download") {
                        waitingDialog.hide();
                    }
                },
                function (iframe) {
                    var frameContent = $(iframe.contentDocument);
                    waitingDialog.hide();
                    if (frameContent.find(".application-errors").length > 0)
                        showCommonErrors([frameContent.find(".application-errors").text().trim()]);
                    else if (frameContent.find(".form-control-static").length > 0) {
                        ModalHelper({
                            dialog: "#actionDialog",
                            url: element.href,
                            isTargetBlank: false,
                            beforeSubmit: undefined,
                            useDefaultSubmit: undefined
                        }).openWindow();
                    } else if (resultAction !== "download") {
                        window.location.reload();
                    }
                });
        },

        creatingClick: function (element, event, resultAction) {
            
            handleLinkAction(element, '#actionDialog', event, null, null, true);
            if (resultAction !== "download") {
                return;
            }

            var dialog = $("#actionDialog");

            dialog.ready(function () {
                
                var submitButton = dialog.find("button.btn.btn-primary.btn-submit");
                var cancelButton = dialog.find("button.btn.btn-default");
                var errorBlock = dialog.find(".modal-errors-wrapper");

                var cloneButton = submitButton.clone();
                submitButton.replaceWith(cloneButton);

                cloneButton.off("click");

                cloneButton.click(function (e) {
                    errorBlock.empty();

                    e.stopPropagation();
                    e.preventDefault();

                    createIframe(element.href,
                        function () {
                            waitingDialog.hide();
                        },
                        function (iframe) {
                            if ($(iframe.contentDocument).find("body").children().length === 0) {
                                var errorText = iframe.contentDocument.body.innerText;
                                var error = JSON.parse(errorText);
                                errorBlock.text(error.responseMessage);
                                errorBlock.show();
                            } else {
                                cancelButton.click();
                            }
                        });

                    var form = dialog.find("form");
                    form.unbind("submit");
                    form.attr("target", "docTemplateFrame");
                });

                dialog.on('hidden.bs.modal',
                    function () {
                        cloneButton.replaceWith(submitButton);
                    });
            });
        }
    }
})();