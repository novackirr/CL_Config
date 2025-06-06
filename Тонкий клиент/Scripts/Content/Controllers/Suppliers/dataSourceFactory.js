var dataSourceFactory = (function () {

    function createDictionaryStore(stateManager) {
        var state = stateManager.getState();
        var queryParameters = stateManager.toQueryString(state);

        var dataUrl = getRelativeUrl("/Administration/GetDictionaryItems") + queryParameters;
        var deleteUrl = getRelativeUrl("/Administration/RemoveDictionaryItem") + queryParameters;
        var updateUrl = getRelativeUrl("/Administration/UpdateDictionaryItem") + queryParameters;
        var addUrl = getRelativeUrl("/Administration/AddDictionaryItem") + queryParameters;
        

        var store = DevExpress.data.AspNet.createStore({
            key: "key",
            loadUrl: dataUrl,
            deleteUrl: deleteUrl,
            deleteMethod: "POST",
            updateUrl :updateUrl,
            updateMethod: "POST",
            insertUrl:addUrl,
            insertMethod :"POST"
        });

        return store;
    }

    return {
        createDictionaryStore: createDictionaryStore
    };
}());