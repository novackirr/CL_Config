(function () {

    console.log("copy-attacments");
    var selects = $("select");
    selects.change(function (e) {
        var id = $(e.target).closest(".search-result-row").attr("data-itemUniqueId");
        var coll = id.split('/')[2];
        var result = id.replace(coll, e.target.value);
        $(e.target).closest(".search-result-row").attr("data-itemUniqueId", result);
        $(e.target).closest(".search-result-row").find(".search-result-selector-checkbox").change();
    });
}());