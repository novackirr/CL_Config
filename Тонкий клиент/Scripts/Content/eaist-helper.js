function getSPGZCrud(key) {

    var url = getRelativeUrl("/EAIST/GetCrudJson");
    url += "?key=" + encodeURIComponent(key);

    var defer = jQuery.Deferred();
    $.ajax({
        url: url,
        type: 'GET',        
        success: function (response) {
            var data = JSON.parse(response);
            if (data.status === "OK") {                
                defer.resolve(data.responseMessage);
            } else {
                showCommonErrors([data.responseMessage]);
                defer.reject(data.responseMessage);
            }
        },
        error: function (response) {
            defer.reject(response);
        },
    });

    return defer.promise();
}

function getSPGZCharacteristics(key) {

    var url = getRelativeUrl("/EAIST/GetCharacteristicsJson");
    url += "?key=" + encodeURIComponent(key);

    var defer = jQuery.Deferred();
    $.ajax({
        url: url,
        type: 'GET',
        success: function (response) {
            var data = JSON.parse(response);
            if (data.status === "OK") {
                defer.resolve(data.responseMessage);
            } else {
                showCommonErrors([data.responseMessage]);
                defer.reject(data.responseMessage);
            }
        },
        error: function (response) {
            defer.reject(response);
        },
    });

    return defer.promise();
}