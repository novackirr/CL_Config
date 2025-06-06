function postEETPCustomAction(eetpID, orgID, action, method, data) {

    var url = getRelativeUrl("/EETP/GetCustomJson");

    var formData = {
        "eetpID": eetpID,
        "orgID": orgID,
        "action": action,
        "method": method,
        "data": data
    };

    var defer = jQuery.Deferred();
    $.ajax({
        url: url,
        type: 'POST',
        data: JSON.stringify(formData),
        contentType: "application/json; charset=utf-8",
        success: function (response) {
            var response = JSON.parse(response.data);
            defer.resolve(response);
        },
        error: function (response) {
            console.error(error);
            defer.reject();
        },
    });

    return defer.promise();
}
