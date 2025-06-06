//подпись файла
function SignAttachmentService(formWrapper, failCallback) {
    if (!formWrapper)
        throw new Error("formWrapper");

    this._formWrapper = formWrapper;
    this._failCallback = failCallback;

}

SignAttachmentService.prototype = {
    _formWrapper: null,
    _failCallback: null,

    signDocumentFiles: function signDocumentFiles(docKey, fileKeys) {
        if (!docKey || docKey.trim() === "")
            throw new Error("docKey");

        var self = this;
        var defer = jQuery.Deferred();

        if (!fileKeys || !fileKeys.length || fileKeys.length === 0) {
            defer.resolve();
            return defer.promise();
        }



        var signPromise = $.when();

        $.each(fileKeys, function (index, fileKey) {
            signPromise = signPromise.then(function () {
                return self.signAttachment(docKey, fileKey);
            }).then(function () {
                console.info("Подписан файла с ключом " + fileKey + " у документа с ключом " + docKey + ".");
            }, function (error) {
                if (error) {
                    console.log(error);
                    if (self._failCallback) {
                        self._failCallback(docKey, fileKeys).always(function () {
                            defer.reject(error);
                        });
                    } else {
                        defer.reject(error);
                    }
                }
            });
        });

        signPromise.then(function () {
            defer.resolve();
        }, function(error){
            defer.reject(error);
        });

        return defer.promise();
    },

    signAttachment: function signAttachment(docKey, attachmentKey) {

        if (!docKey || docKey.trim() === "")
            throw new Error("docKey");

        if (!attachmentKey || attachmentKey.trim() === "")
            throw new Error("attachmentKey");

        if (EDS.ClearCache) {
            EDS.ClearCache();
        }

        console.info("Подписываем приложенного файла с ключом " + attachmentKey + " у документа с ключом " + docKey);

        var defer = jQuery.Deferred();

        var container = this._formWrapper.find("#signBlockData");

        var attachHashUrl = $("[name='attachHashUrl']").val();
        var docActionUrl = $("[name='docActionUrl']").val();

        this._createCheckBox("isSignEDS").appendTo(container);
        this._createCheckBox("isAttachEDS").appendTo(container);
        this._createCheckBox("isContext").appendTo(container);
        this._createCheckBox("isEisExport").appendTo(container);

        this._createHiddenInput("documentAttachHashUrl",
            attachHashUrl + "?documentId=" + docKey + "&attachKey=" + attachmentKey,
            true).appendTo(container);
        this._createHiddenInput("documentActionUrl",
            docActionUrl + "?uniqueIds=" + docKey + "/" + attachmentKey + "&activityId=",
            true).appendTo(container);
        this._createHiddenInput("activitySignature", "", true).appendTo(container);

        var self = this;
        EDS.SignCreate(function () {
            container.empty();
            defer.resolve();
        },
            function (message, isError) {
                container.empty();
                if (isError)
                    defer.reject(message);
            },
            true, self._formWrapper);

        return defer.promise();
    },

    _createCheckBox: function createCheckBox(name, addId) {
        var input = $('<input />', { type: 'checkbox', name: name, checked: 'checked', hidden: 'hidden' });
        if (addId) {
            input.attr("id", name);
        }
        return input;
    },

    _createHiddenInput: function createHiddenInput(name, value, addDataName) {
        var input = $('<input />',
            { type: 'hidden', name: name, value: value, hidden: 'hidden', disabled: "disabled" });

        if (addDataName) {
            input.attr("data-name", name);
        }
        return input;
    }
};
