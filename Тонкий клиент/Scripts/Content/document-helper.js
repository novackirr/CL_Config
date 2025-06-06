var DocumentHelper = (function () {

    // загрузка и инициализация скриптов документа
    var initScripts = function (document) {

        // инициализация справочников
        resetDictionaryFields();

        
        // scripts.each(function (index, item) {
        //     $.getScript($(item).attr("data-url"));
        // });

        var scripts = document.find(".action-page-scripts .action-page-script");

        var scriptPromise = $.when();

        // загрузка скриптов последовательно
        $.each(scripts, function (index, item) {
            scriptPromise = scriptPromise.then(function () {
                return $.getScript($(item).attr("data-url"));
            }).then(function () {
                console.info("Добавлен скрипт '" + $(item).attr("data-url") + "'.");
            }, function (error) {
                console.log(error);
            });
        });

        scriptPromise.always(function(){
            // инициализация скриптов
            reinitialiseScripts();
        });
    }

    // инициализация документа
    var init = function (document) {

        // инициализация скриптов
        initScripts(document);

        // сокрытие лишних блоков, если есть
        document.find(".action-page-buttons").hide();

        // отображение блоков, если есть
        document.find("#div-context-modal").show();
    }

    return {
        init: init
    }

})($)
