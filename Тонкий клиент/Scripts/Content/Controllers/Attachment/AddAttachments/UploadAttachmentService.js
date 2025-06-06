//подпись файла
function UploadAttachmentService(failCallback) {
    this._failCallback = failCallback;
}

UploadAttachmentService.prototype = {

    upload: function (form) {

        var ajaxFiles = getAjaxFiles(form);
        var ajaxFilesLength = ajaxFiles.length;

        if (ajaxFilesLength === 0) {
            var defer = jQuery.Deferred();
            defer.resolve();
            return defer.promise();
        }

        var formData = new FormData();

        //в случаях, когда загружаем файлы с диалога экшена, который привязан к узлу, ключ документа храниться в другом инпуте
        var documentKeysElement = form.find("input[name='documentKeys']");
        if (documentKeysElement.length === 0)
            documentKeysElement = form.find("input[name='uniqueIds']");

        if (documentKeysElement.length === 0) {
            console.log(documentKeysElement.length);
            throw new Error("Не найден элемент с идентификатором документов");
        }
        
        formData.append("uniqueIds", documentKeysElement.val());

        var ajaxFilesProps = {};

        for (var i = 0; i < ajaxFilesLength; i++) {
            var current = ajaxFiles[i];
            var item = current.data;

            var fileKey = current.key;
            var fileProps = UploadAttachment.getFileProps(fileKey);
            if (fileProps !== null) {
                ajaxFilesProps[fileKey] = fileProps;
                formData.append(item.name, item.file, fileKey);
            } else {
                formData.append(item.name, item.file, item.file.name);
            }
        }
        formData.append("attachmentFilesProps", JSON.stringify(ajaxFilesProps));
        return this._call(formData);
    },

    _call: function (formData) {
        if (window.docChangeObserver) window.docChangeObserver.pause();
        var defer = jQuery.Deferred();
        var url = UploadAttachmentHelper.getBaseUrl() + "/ContextAction/CreateAttachmentHandler";

        $.ajax({
            url: url,
            type: 'POST',
            mimeType: "multipart/form-data",
            cache: false,
            data: formData,
            contentType: false,
            processData: false
        }).then(function (response) {
            
            var responseData = JSON.parse(response);
            if (responseData.status === "OK") {
                var uploadedDic = JSON.parse(responseData.responseMessage);                               
                defer.resolve(uploadedDic);
            } else {
                defer.reject(responseData.responseMessage);
            }
        }, function (errorResponse) {
            defer.reject(errorResponse);
        });

        return defer.promise();
    }
};
