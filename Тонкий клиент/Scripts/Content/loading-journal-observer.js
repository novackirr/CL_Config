//Модуль мониторинга изменения документа (на основе смены хэша)
var LoadingJournalObserver = function(url, callback, interval) {
    //URL по которому будет обращение для запроса смены хэша документа
    var urlToCheck = url;
    //Callback, который необходимо вызвать при обнаружении смены хэша документа
    var observerCallback = callback;
    //timeout для запроса = 180 сек.(на случай дальнейшней реализации long pooling)
    var timeout = interval;

    function onWaitForDataSuccess(response, textStatus, jqXHR) {
        observerCallback(response);
        waitForData();
    };

    function onWaitForDataError(jqXHR, textStatus, errorThrown) {
        waitForData();
    };

    //Отправляет запрос на проверку хэша
    function waitForData() {
        setTimeout(requestAjax, timeout);
    }

    function requestAjax() {
        $.ajax({
            url: urlToCheck,
            dataType: "json",
            //timeout: timeout,
            cache: false,
            async: true,
            success: onWaitForDataSuccess,
            error: onWaitForDataError
        });

    }

   waitForData();

};