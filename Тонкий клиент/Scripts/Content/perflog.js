navigator.sayswho = (function () {
    var ua = navigator.userAgent, tem,
        M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
        if (tem != null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();

var pageLoadTime;
var pageLoadCounter = 0;
var pageAjaxCompleteCounters;
var firstPageLoad = true;

window.onload = function () {
    pageLoadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
}

function perflog(msg) {
    
    var finishTime = Date.now() - window.performance.timing.navigationStart;

    if (pageLoadMonitoringAfterSeconds > finishTime / 1000.0)
        return;
    
    $.ajax({
        url: getAbsoluteUrl("PerfLog/Log"),
        type: "POST",
        data: {
            elapsedMilliseconds: finishTime,
            message: msg,
            url: window.location.href,
            usr: $(".header-menu-user-name").attr("data-user-sid"),
            browserInfo: navigator.sayswho,
            pageLoad: pageLoadTime
        }
    });
}

function perflogAction(msg, ajaxSendDate, pageBeforeAjaxUrl) {

    if (!pageBeforeAjaxUrl)
        pageBeforeAjaxUrl = window.location.href;

    $.ajax({
        url: getAbsoluteUrl("PerfLog/Log"),
        type: "POST",
        data: {
            elapsedMilliseconds: Date.now() - ajaxSendDate,
            message: msg,
            url: pageBeforeAjaxUrl,
            usr: $(".header-menu-user-name").attr("data-user-sid"),
            browserInfo: navigator.sayswho
        }
    });
}

function pageLoadMonitoring(settingsUrl) {

    var pageUrl = window.location.pathname.toLowerCase();

    if (pageUrl.indexOf('/folderstructure') !== -1) {

        if (settingsUrl.indexOf('getfolderitemscount') !== -1)
            pageLoadCounter++;
        else
            return;

        if (!pageAjaxCompleteCounters)
            pageAjaxCompleteCounters = $("#search-horizontal-menu li>a[href*='FolderStructure'],.search-menu-tabs li>a[href*='FolderStructure']").length - 1;

        if (pageLoadCounter == pageAjaxCompleteCounters)
            perflog(window.location.pathname);

    } else if (pageUrl.indexOf('/performer') !== -1 ||
        pageUrl.indexOf('/control') !== -1 ||
        pageUrl.indexOf('/complete') !== -1) {

        if (settingsUrl.indexOf('lookforscount') !== -1)
            perflog(window.location.pathname);
        else
            return;

    } else if (pageUrl.indexOf('/search/search') !== -1) {

        if (settingsUrl.indexOf('/search/searchcount') !== -1)
            pageLoadCounter++;
        else
            return;

        if (!pageAjaxCompleteCounters)
            pageAjaxCompleteCounters = $("#search-horizontal-menu li>a[href*='/Search/Search']").length;

        if (pageLoadCounter == pageAjaxCompleteCounters)
            perflog(window.location.pathname);

    } else if (pageUrl.indexOf('/documentview') !== -1) {

        if (settingsUrl.indexOf('routesjson') !== -1 && firstPageLoad) {
			perflog(window.location.pathname);
			firstPageLoad = false;
		}
            
        else
            return;
    }
}

function clientActionsMonitoring(url, lowerUrl, ajaxSendDate, pageBeforeAjaxUrl) {

    if (lowerUrl.indexOf('/deleteattachmenthandler') !== -1 ||
        lowerUrl.indexOf('/createattachmenthandler') !== -1 ||
        (lowerUrl.indexOf('/edit') !== -1 && lowerUrl.indexOf('/editlock') === -1) ||
        lowerUrl.indexOf('/registerhandler') !== -1) {
        
        perflogAction(url, ajaxSendDate, pageBeforeAjaxUrl);
    }
}

$(document).ajaxSend(function (ev, jqXHR, settings) {
    var ajaxSendDate = Date.now();
    var pageBeforeAjaxUrl = window.location.href;

    jqXHR.always(function () {

        var url = settings.url;
        var lowerUrl = url.toLowerCase();

        if (pageLoadMonitoringEnabled)
            pageLoadMonitoring(lowerUrl);

        if (clientActionsMonitoringEnabled)
            clientActionsMonitoring(url, lowerUrl, ajaxSendDate, pageBeforeAjaxUrl);

    });
});