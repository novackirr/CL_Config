; (function () { }(window.ct = window.ct || {}));

; (function (ui) {
    /**
     * Отображает сообщение в модальном окне.
     * @param {string} title Заголовок сообщения.
     * @param {string} message Текст сообщения.
     */
    ui.alert = function (title, message) {
        return DevExpress.ui.dialog.alert(message, title);
    };

    /**
     * Отображает высплывающее уведомление.
     * @param {string} message Текст уведомления.
     * @param {"info"|"warning"|"error"|"success"} type Тип уведомления.
     * @param {number} displayTime Длительность отображения уведомления (в мс).
     */
    ui.notify = function (message, type, displayTime) {
        var opts = {
            closeOnClick: true,
            message: message
        };
        return DevExpress.ui.notify(opts, type, displayTime);
    };

    ui.checkboxThreeStates = function(cb) {
        if (cb.readOnly) cb.checked = cb.readOnly = false;
        else if (!cb.checked) cb.readOnly = cb.indeterminate = true;
        cb.value = cb.checked ? "on" : cb.indeterminate ? "" : "off";
    }

    ui.checkboxTwoStates = function (cb) {
        cb.value = cb.checked ? "on" : "off";
    }

    $(document).ready(function () {
        ui.sideNavigation = new SideNavigation(".sidenav-display-button", [".search-menu-tabs", ".build-report-tabs"], [".search-menu-content", ".build-report-content"]);
    });

    function SideNavigation(toggleButtonContainerSelector, menuSelectors, contentSelectors) {
        // Набор костылей для скрытия бокового меню с навигацией. Магические константы, лютый колхоз, вот это вот всё. Но вроде даже работает.
        var self = this;
        var _isOpened = true;

        var _menuInfo = [];
        var _contentInfo = [];

        var $sidenavContainer = $(".sidenav-container");

        init();

        this.open = function () {
            updateToggleButton("spinleft", "Скрыть меню");

            $sidenavContainer.removeClass("sidenav-menu-hidden");
            $sidenavContainer.addClass("sidenav-menu-visible");

            for (var i in _menuInfo) {
                _menuInfo[i].$element.css("display", "block");
            }
            for (var i in _contentInfo) {
                _contentInfo[i].$element.removeClass("sidenav-menu-hidden");
            }
            
            _isOpened = true;
        }

        this.close = function () {
            updateToggleButton("spinright", "Показать меню");

            $sidenavContainer.removeClass("sidenav-menu-visible");
            $sidenavContainer.addClass("sidenav-menu-hidden");

            for (var i in _menuInfo) {
                _menuInfo[i].$element.css("display", "none");
            }
            for (var i in _contentInfo) {
                _contentInfo[i].$element.addClass("sidenav-menu-hidden");
            }

            _isOpened = false;
        }

        this.toggle = function () {
            if (_isOpened) {
                self.close();
            } else {
                self.open();
            }
        }

        function updateToggleButton(icon, hint, height) {
            var $toggleButton = $(".sidenav-display-button");
            $toggleButton.dxButton({
                focusStateEnabled: false,
                icon: icon,
                hint: hint,
            });

            if (height) {
                $toggleButton.dxButton("instance").option("height", height);
            }

            // Костылик, чтобы сбросить hover при смещении кнопки (т.к. dx работает асинхронно).
            setTimeout(function () {
                $toggleButton.removeClass("dx-state-hover");
            }, 5);
        }

        function init() {
            for (var i = 0; i <= menuSelectors.length; i++) {
                var $menu = $(menuSelectors[i]);
                if ($menu.length) {
                    _menuInfo[menuSelectors[i]] = {
                        width: $menu.width(),
                        $element: $menu
                    };
                }
            }
    
            for (var i = 0; i <= contentSelectors.length; i++) {
                var $content = $(contentSelectors[i]);
                if ($content.length) {
                    _contentInfo[contentSelectors[i]] = {
                        paddingLeft: $content.css("padding-left"),
                        $element: $content
                    };
                }
            }
            
            $(".sidenav-display-button")
                .dxButton({
                    focusStateEnabled: false,
                    icon: "spinleft",
                    hint: "Скрыть меню",
                    onClick: function() {
                        ct.ui.sideNavigation.toggle();
                    }
                });
        }
    }
}((window.ct = window.ct || {}, window.ct.ui = window.ct.ui || {})));