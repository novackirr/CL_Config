LawSwitcher = (function () {

    function getLawSwitcher() {

        return $("#lawSwitcher");
    }

    function getLawTitle() {

        var lawSwitcher = getLawSwitcher();
        var lawTitle = lawSwitcher.prop("checked") ? lawSwitcher.attr("data-on") : lawSwitcher.attr("data-off");

        return lawTitle;
    }

    function Enabled() {

        if (GetLaw()) {
            return true;
        }

        return false;
    }

    function GetLaw() {

        var lawTitle = getLawTitle();
        var law = typeof lawTitle != 'undefined' && lawTitle != null ? lawTitle.split('-')[1] : "";

        return law;
    }

    function Is44Law() {
        return GetLaw() === "44";
    }

    function Is223Law() {
        return GetLaw() === "223";
    }

    function Toggle() {

        waitingDialog.showWaiting();
        var actionUrl = getLawSwitcher().attr("data-action");        
        var law = GetLaw();

        $.ajax({
            url: actionUrl,
            type: "POST",
            dataType: "json",
            cache: false,
            async: true,
            data: { law: law },
            success: function (data) {

                var d = data.data;
                if (d && d.Success) {
                    window.location = buildReloadUrl();
                }
            },
            error: function () {
                waitingDialog.hide();
            }
        });

        function buildReloadUrl() {
            var newUrl = window.location.protocol + "//" + window.location.host;

            var pathParts = window.location.pathname.split("/");

            if (pathParts.length > 1) {
                //TODO: Переписать с использованием одной из функций из common.js: getBaseUrl, getAbsoluteUrl, getRelativeUrl.
                var newPath = "/";
                var controllerName = pathParts[1]; //первый элемент пустой
                // if (controllerName.toLocaleLowerCase() === "edo") {
                    // controllerName = pathParts[2];
                    // newPath += "edo/";
                // }


                switch (controllerName) {
                    case "Administration":
                    case "Reports":
                    case "Performer":
                    case "Control":
                        newPath += controllerName;
                        break;
                    case "Search":
                        {
                            newPath += "Search/Search";
                            var searchTmpl = getQueryStringParameterByName("searchTemplateName", window.location.search);
                            if (searchTmpl)
                                newPath += "?searchTemplateName=" + searchTmpl;
                        }
                        break;
                    case "Document":
                    case "Edit":
                    case "Register":
                        break;
                }
                return newUrl + newPath;
            }
            return newUrl + window.location.pathname;
        }
    }    

    return {
        Enabled: Enabled,
        GetLaw: GetLaw,
        Is44Law: Is44Law,
        Is223Law: Is223Law,        
        Toggle: Toggle
    }

})();
