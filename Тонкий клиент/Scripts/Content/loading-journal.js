//Модуль мониторинга изменения документа (на основе смены хэша)
var LoadingJournal = function(_docId, _originReturnUrl, _currentProgressUrl,_abortFileLoadingUrl, _abortFileLoadingFromQueueUrl,_currentErrorsUrl,_currentQueueUrl,_processedUrl) {
    //URL по которому будет
    var currentProgressUrl = _currentProgressUrl;
    //URL по которому будет
    var abortFileLoadingUrl = _abortFileLoadingUrl;
    //URL по которому будет
    var abortFileLoadingFromQueueUrl = _abortFileLoadingFromQueueUrl;
    //URL по которому будет
    var currentErrorsUrl = _currentErrorsUrl;
    //URL по которому будет
    var currentQueueUrl = _currentQueueUrl;
    //URL по которому будет
    var processedUrl = _processedUrl;
    //URL по которому будет
    var originReturnUrl = _originReturnUrl;
    //Document type
    var docId = _docId;

    var currentTimer = null;

    var currentFileId = null;


   var service = {
        callGet: function(url, success, error) {
            $.ajax({
                url: url,
                type: 'GET',
                contentType: false,
                cache: false,
                processData: false,
                success: success,
                error: error
            });
        },
        callGetProgress: function(success, error) {
            this.callGet(currentProgressUrl, success, error);
        },
        callAbortFileLoading: function(fileId, success, error) {
            var url = abortFileLoadingUrl + '?fileId=' + fileId;
            this.callGet(url, success, error);
        },
        callAbortFileLoadingFromQueue: function(fileId, success, error) {
            var url = abortFileLoadingFromQueueUrl  + '?fileId=' + fileId;
            this.callGet(url, success, error);
        }
   }


   function startTimer(timeout) {
        if (currentTimer)
            stopTimer();
        currentTimer = setInterval(update, timeout);
        update();
   }

   function stopTimer() {
        if (currentTimer) {
            clearTimeout(currentTimer);
            currentTimer = null;
        }
    }

   function update() {
        service.callGetProgress(
            function(data) {
                $(".loading-journal__current-operation .loading-journal__current-operation-errors")
                    .data('fileid', data ? data.id : null);
                if (!data || !data.id) {
                    $(".loading-journal__current-operation").addClass('js-hidden');
                } else {
                    resolveStatusData(data);
                }
                if (currentFileId != data.id && currentFileId != null) {
                    reloadProcessed();
                    reloadQueue();
                }
                currentFileId = data.id;
            },
            function(data) {
                console.log(data.responseText);
            });
    }
   function resolveStatusData(data) {
        var title = "";
        if (data.canCancel) {
            $(".loading-journal__current-operation-abort").show();
            $(".loading-journal__current-operation .loading-journal__current-operation-errors").show();
            if (data.processed == data.total) {
                title = "Добавление связок и пересчет прав на обработанные документ: ";
                updateProgressBar(100, 0, 100, true, "обработка...");
                $(".loading-journal__current-operation-abort").hide();
            } else if (data.processed == 0) {
                title = "Инициализация обрабатываемого документа: ";
                updateProgressBar(100, 0, 100, true, "инициализация...");
                $(".loading-journal__current-operation-abort").hide();
            } else {
                title = "Строк обработано в ";
                updateProgressBar(data.processed, 0, data.total, false, data.processed + ' / ' + data.total);
            }
        } else {
            title = "Идет загрузка файла ";
            $(".loading-journal__current-operation-abort").hide();
            $(".loading-journal__current-operation .loading-journal__current-operation-errors").hide();
            updateProgressBar(100, 0, 100, true, "загрузка...");
        }

        $(".progress-file-name").text(title + data.originalName);
        $(".loading-journal__current-operation").removeClass('js-hidden');
   }

   function updateProgressBar(now, min, max, isActive, txt) {
        var progressBar = $(".loading-journal__current-operation-progress-bar");
        progressBar.attr('aria-valuenow', now);
        progressBar.attr('aria-valuemin', min);
        progressBar.attr('aria-valuemax', max);
        progressBar.css('width', Math.ceil(now / max * 100) + '%');
        if (isActive) {
            progressBar.addClass("progress-bar-striped active");               
        } else {
            progressBar.removeClass("progress-bar-striped active");
        }
        progressBar.html(txt);
   }

   function getFileId(elem) {
        var fileId = elem.data('fileid');
        return fileId;
    }
   function getLoadingFileId() {
        var fileIdElem = $(".loading-journal__current-operation .loading-journal__current-operation-errors");
        var fileId = getFileId(fileIdElem);
        return fileId;
   }

    function initEvents() {
        $(".loading-journal__current-operation-errors .loading-journal__reload").on('click', function () {
            reloadJournal();
        });
        $(".loading-journal__current-operation-abort").on('click', function () {
            abortFileLoading(this);
        });
        $(".glyphicon-remove-circle").on('click', function () {
            abortFileLoadingFromQueue(this);
        });
    }

   function reloadJournal() {
        var link = $("<a>");
        link.addClass('js-hidden');
        var url =  currentErrorsUrl;
        var fileId = getLoadingFileId();
        url += '?fileId=' + fileId + '&page=1';
        link.attr('href', url);
        link.click(function (event) { searchResultNavigate(link, event); });
        $(".loading-journal__current-operation-errors .search-result").append(link);
        link.click();
    }
   function reloadQueue() {
        var link = $("<a>");
        link.addClass('js-hidden');
        var url = currentQueueUrl;
        url += '?docId=' + docId + '&page=1';
        link.attr('href', url);
        link.click(function (event) { searchResultNavigate(link, event); });
        $(".loading-journal__current-queue .search-result").append(link);
        link.click();
   }

   function reloadProcessed() {
       //восстанавливаем иконку у кнокпи удаления на первоначальную
       $(".loading-journal__current-operation-abort").removeClass('loading-image-small loading-image-active loading-image-shown').addClass("glyphicon glyphicon-remove");

        var link = $("<a>");
        link.addClass('js-hidden');
        var url = processedUrl;
        url += '?docId=' + docId + '&page=1&originReturnUrl='+originReturnUrl;
        link.attr('href', url);
        link.click(function (event) { searchResultNavigate(link, event); });
        $(".loading-journal__history .search-result").append(link);
        link.click();
   }

   function abortFileLoading(elem) {
       //меняем иконку у кнопки удаления на прогресс
       var elm = $(elem);
       elm.removeClass('glyphicon glyphicon-remove').addClass('loading-image-small loading-image-active loading-image-shown');

        var fileId = getLoadingFileId();
        // $(".loading-journal__current-operation .loading-image-small").addClass('loading-image-shown');
        $(".loading-journal__current-operation-abort").hide();
        service.callAbortFileLoading(
            fileId,
            function (data) {
                update();
            },
            function (data) {
                console.log(data.responseText);
            });
   }

   function abortFileLoadingFromQueue(elem) {
        var elm = $(elem);
        var fileId = getFileId(elm);
        elm.removeClass().addClass('loading-image-small loading-image-active loading-image-shown');
        service.callAbortFileLoadingFromQueue(
            fileId,
            function (data) {
                var removeRow = $('[data-fileid="' + data.id + '"]');
                if (removeRow && removeRow.length > 0) {
                    removeRow.closest(".search-result-row").remove();
                }
            },
            function (data) {
                console.log(data.responseText);
            });
    }

    initEvents();

    return {
        startTimer: startTimer
    }
};

 