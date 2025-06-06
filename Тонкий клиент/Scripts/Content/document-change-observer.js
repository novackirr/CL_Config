//Модуль мониторинга изменения документа (на основе смены хэша)
var DocumentChangeObserver = function(url, refreshUrl, callback, initDelay, interval, maxIterCount) {
    //URL по которому будет обращение для запроса смены хэша документа
    var urlToCheck = url;
    //URL по которому будет обращение для запроса актуального хэша документа
    var refreshUrlToCheck = refreshUrl;
    //Callback, который необходимо вызвать при обнаружении смены хэша документа
    var hashChangedCallback = callback;
    //Интервал для опроса сервера
    var queryInterval = interval;
    //Маскимальное кол-во итераций запросов проверки хэша (чтобы процесс не был бесконечным)
    var maxIterationCount = maxIterCount;
    var iterationCount = 0;
    //timeout для запроса = 180 сек.(на случай дальнейшней реализации long pooling)
    var timeout = 180000;
    //timeout до следующего запроса проверки хэша = 180 сек. Для кейса удаления атачмента.
    var pauseTimeout = 180000;

    var initialDelay = initDelay;

    var lastDocKey, lastDocHash;

    var isTabActive = true;

    var paused = false;

    //запуск мониторинга смены хэша
    function startObserveDocumentChanged(docKey, currentDocHash) {
        lastDocHash = currentDocHash;
        lastDocKey = docKey;
        //Первоначальный запуск мониторинга изменения хэша - спустя 10 сек.
        setTimeout(doHashChaeckRequest, initialDelay);
        window.onfocus = function () {
            isTabActive = true;
        };

        window.onblur = function () {
            isTabActive = false;
        };
    }

    function disable() {
        iterationCount = maxIterationCount;
        console.log("disable observer");
    }

    function restart() {
        iterationCount = 0;
        doHashChaeckRequest();
        console.log("restart observer");
    }

    function pause() {
        if (!paused) {
            paused = true;
        }
    }

    //Отправляет запрос на проверку хэша
    function doHashChaeckRequest() {
        
        if (paused)
            return;
        
        //Если кол-во итераций запроса превысило максимальную заданную - выходим и останавливаем процесс опроса сервера.
        iterationCount++;
        if (iterationCount > maxIterationCount) return;

        if (isTabActive) {

            $.ajax({
                    url: urlToCheck,
                    dataType: "json",
                    timeout: timeout,
                    cache: false,
                    data: { docKey: lastDocKey, currentDocHash: lastDocHash },
                    beforeSend: function (request) {
                        request.setRequestHeader("RemoveAuthDialog", "true");
                    }
                })
                .done(function(hashWasChanged) {
                    if (hashWasChanged) {
                        //обнаружена смена хэша, вызываем callback и ничего более не делаем
                        hashChangedCallback();
                    } else {
                        //хэш не поменялся, запускаем запрос на проверку хэша снова
                        setTimeout(doHashChaeckRequest, queryInterval);
                    }
                })
                .fail(function() {
                    console.log("Произошла ошибка при запросе смены хэша документа");
                    setTimeout(doHashChaeckRequest, queryInterval);
                });
        } else {
            setTimeout(doHashChaeckRequest, queryInterval);
        }
    }

    function doHashRefresh(docKey) {
        
        $.ajax({
                url: refreshUrlToCheck,
                dataType: "json",
                timeout: timeout,
                cache: false,
                data: { docKey: docKey }
            })
            .done(function (hash) {
                lastDocHash = hash;
                paused = false;
                restart();
            })
            .fail(function () {
                lastDocHash = "";
                paused = false;
                restart();
            });
    }

    return {
        startObserveDocumentChanged: startObserveDocumentChanged,
        disable: disable,
        restart: restart,
        pause: pause,
        doHashRefresh: doHashRefresh
    }

};