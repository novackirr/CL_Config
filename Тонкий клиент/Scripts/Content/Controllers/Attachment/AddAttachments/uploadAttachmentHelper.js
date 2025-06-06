var UploadAttachmentHelper = (function () {

    return {
        getColumnDefenitions: function getColumnDefenitions(container) {
            var columnsDefElement = container.find("[name='attachment-column-definitions']");
            var columnOptions = [];

            if (columnsDefElement.length > 0 && columnsDefElement.val()) {
                columnOptions = JSON.parse(columnsDefElement.val());
            }
            return columnOptions;
        },

        getCategories: function getCategories(container) {

            var categoriesDefElement = container.find("[name='attachment-categories-definitions']");
            if (categoriesDefElement.length > 0 && categoriesDefElement.val().trim() !== "")
                return categories = JSON.parse(categoriesDefElement.val());
            return null;
        },

        trimTrailingSlash: function trimTrailingSlash(str) {
            if (!str)
                return str;
            if (str.substr(str.length - 1) === '/') {
                return str.substr(0, str.length - 1);
            }
            return str;
        },

        getBaseUrl: function getBaseUrl() {
            return this.trimTrailingSlash($("base").attr("href"));
        },

        disableFileSelector: function disableFileSelector(wrapper) {

            var fileButton = wrapper.find(".file-drop-area-title");
            fileButton.css("pointer-events", "none");
            fileButton.css("background-color", "#e6e6e6");
            fileButton.css("border-color", "#adadad");
            fileButton.css("opacity", "0.6");
        },

        enableFileSelector: function enableFileSelector(wrapper){
            var fileButton = wrapper.find(".file-drop-area-title");
            fileButton.css("pointer-events", "auto");
            fileButton.css("background-color", "");
            fileButton.css("border-color", "");
            fileButton.css("opacity", "");
        }
    }
})();