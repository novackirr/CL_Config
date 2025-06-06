var FoldersMenu = (function () {
    //инициализация меню
    function init() {
        //находим все элементы в навбаре помеченные классом "dynamic-menu"
        var headerItems = $(".navbar-nav .folders-menu");

        $.each(headerItems, function (index, element) {
            var current = $(element);
            //создаем меню
            createMenu(current);
        });

        //если находимся в папке надо написать сколько элементов в гриде.
        if (getQueryStringParameterByName("root", window.location.search)) {
            $("div[data-grid-id]").children(".dx-widget").dxDataGrid('instance').on("contentReady", function (e) {
                var grid = e.component;
                var dataSource = grid.getDataSource();
                var totalCount = dataSource.totalCount();

                var header = $(".search-block-capture").find("h3");

                //надо убедиться что мы еще не писали, так как "contentReady" вызывается при каждом изменение грида
                if (header.find("small").length === 0) {
                    var text = "(Всего элементов: " + totalCount + ")";
                    var textElement = $("<small></small>");
                    textElement.text(text);
                    header.append(textElement);
                }

            });
        }
    }

    function createMenu(menuElement) {
        var folderPath = menuElement.attr("data-folder");

        //получаем всю структуру папки
        getMenuItems(folderPath).then(function (menuData) {
            //очищаем заглушку
            menuElement.text("");
            //создаем меню
            var dxMenu = menuElement.dxMenu({
                dataSource: [menuData],
                hideSubmenuOnMouseLeave: false,
                showFirstSubmenuMode: {
                    delay: {
                        hide: 300,
                        show: 50
                    },
                    name: "onHover"
                },
                displayExpr: "name",
                onItemClick: function (data) {
                    //если есть поисковой запрос для папки, то на клик делаем редирект
                    if (data.itemData.hasSearchQuery) {
                        window.location = getBaseUrl() + "/Folders?path=" + encodeURIComponent(data.itemData.path) + "&root=" + encodeURIComponent(menuData.path);
                    }
                },
                itemTemplate: function (itemData, itemIndex, itemElement) {

                    //здесь рисуем элементы меню
                    var container = $("<div class='dx-item-content dx-menu-item-content'></div>");

                    //рисуем текст
                    if (itemData.isRoot) {
                        var textElement = $("<span class='root-menuItem '></span>");
                        textElement.text(itemData.name);
                        container.append(textElement);
                    } else {
                        var textElement = $("<span class='dx-menu-item-text'></span>");
                        textElement.text(itemData.name);
                        container.append(textElement);
                    }

                    if (!itemData.disabled && !itemData.isRoot && itemData.hasSearchQuery) {
                        var spinner = $("<span class='loading-image-small loading-image-shown'></span>");
                        container.append(spinner);
                        //запрашиваем количество элементов в папке
                        getFolderItemCount(itemData.path).then(function (count) {
                            //spinner.remove();
                            var badge = $("<span class='badge'></span>");
                            badge.text(count);
                            spinner.replaceWith(badge);
                            //container.append(badge)
                        }, function (error) {
                            console.error(error);
                            spinner.remove();
                        });
                    }

                    if (itemData.items.length > 0 && !itemData.isRoot) {
                        var popoutElement = $("<span class='dx-menu-item-popout-container'><div class='dx-menu-item-popout'></div></span>");
                        container.append(popoutElement);
                    }

                    return container;
                },
                onSubmenuShowing: function (e) {
                    e.element.addClass("expanded");
                    e.element.find(".dx-context-menu-container-border").remove();
                    e.element.find(".dx-overlay-content.dx-menu-base").hide();
                },
                onSubmenuHiding: function (e) {
                    e.element.removeClass("expanded");
                },
                onSubmenuShown: function (e) {
                    $(".dx-overlay-content.dx-menu-base").css("top", "20px");
                    $(".dx-overlay-content.dx-menu-base").show();
                }
            }).dxMenu("instance");

            var selectedPath = getQueryStringParameterByName("path", window.location.search);
            if (selectedPath) {
                dxMenu.option("selectedItem", findItemByPath(selectedPath, [menuData]));
            }
        }, function (error) {
            console.error(error);
            menuElement.parent("li").remove();
        });
    }

    function getMenuItems(folderPath) {

        var defer = jQuery.Deferred();

        //пытаемся вначале получить значения с кэша, если нет то запрашиваем
        var cacheKey = "dynamicMenu-" + folderPath;
        var json = getFromSessionStorage(cacheKey);
        if (json) {
            defer.resolve(JSON.parse(json));
        } else {

            var url = getBaseUrl() + "/Folders/GetFolderMenuItem?path=" + encodeURIComponent(folderPath);

            $.ajax({
                url: url,
                type: 'GET',
                contentType: false,
                cache: false,
                processData: false,
            }).then(function (data) {

                //сохраняем в кэш
                updateSessionStorage(cacheKey, JSON.stringify(data));

                defer.resolve(data);
            }, function (error) {
                defer.reject(error);
            });
        }

        return defer.promise();
    }

    function getFolderItemCount(path) {
        var defer = jQuery.Deferred();

        var url = getBaseUrl() + "/Folders/GetFolderItemsCount?path=" + encodeURIComponent(path);

        $.ajax({
            url: url,
            type: 'GET',
            contentType: false,
            cache: false,
            processData: false,
        }).then(function (response) {
            var data = JSON.parse(response);
            if (data.status === "OK") {
                defer.resolve(data.responseMessage);
            } else if (typeof data === "number") {
                defer.resolve(data);
            } else {
                defer.reject(data.responseMessage);
            }

        }, function (error) {
            defer.reject(error);
        });

        return defer.promise();
    }

    function getBaseUrl() {
        return $("base").attr("href") === "/" ? "" : $("base").attr("href");
    }

    function findItemByPath(path, items) {
        var l = items.length;
        var retval = null;
        for (var i = 0; i < l; i++) {
            var current = items[i];
            if (current.path === path)
                retval = current;

            if (retval === null) {
                retval = findItemByPath(path, current.items);
            }

            if (retval)
                break;
        }
        return retval;
    }

    return {
        init: init
    }

})();


$(document).on("ready", function () {
    FoldersMenu.init();
});
