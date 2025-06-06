; (function () { }(window.ct = window.ct || {}));

; (function (ui) {
    /**
     * Колхоз основной панели с вертикальными вкладками.
     */
    ui.VerticalTabPanel = VerticalTabPanel;
    
    function VerticalTabPanel(config) {
        var self = this;
        var SELECTED_ITEM_CLASS = "active";
        var HANDLERS = {
            ON_INITIALIZED: "onInitialized",
            ON_SELECTION_CHANGED: "onSelectionChanged"
        };
        var _config = $.extend({
            selector: null,
            tabs: [],
            selectedTabKey: null,
            tabContentTemplate: null,
            onInitialized: null,
            onSelectionChanged: null
        }, config);

        var _$widget = _config.selector ? $(_config.selector) : $("<div />");
        var _$container = $("<div />").addClass("search-menu-tabs");
        var _$tabsList = $("<ul />").addClass("nav nav-tabs tabs-left");
        var _$tabsContainer = $("<div />").addClass("nav nav-tabs tabs-left panel-collapse collapse in report-element");
        var _$contentContainer = $("<div />").addClass("tab-content search-menu-content");
        var _$content = _config.tabContentTemplate ? $(_config.tabContentTemplate) : $("<div />");
        var _tabs = _config.tabs.map(createTab);
        var _selectedTab;

        /**
         * jQuery-объект с контейнером компонента.
         */
        this.$widget = function() {
            return _$container;
        }

        /**
         * Возвращает выбранную вкладку.
         */
        this.getSelectedTab = function() {
            return _selectedTab;
        }

        /**
         * Выбрать вкладку.
         * @param {number} key Идентификатор (ключ) вкладки.
         */
        this.selectTab = function (key) {
            deselectTab(_selectedTab);
            var tabToSelect = _tabs.find(function (x) { return x.key === key; });
            selectTab(tabToSelect);
        }

        /**
         * Убрать выбор с вкладки.
         * @param {number} key Идентификатор (ключ) вкладки.
         */
        this.deselectTab = function (key) {
            var tabToDeselect = _tabs.find(function (x) { return x.key === key; });
            deselectTab(tabToDeselect);
        }

        /**
         * Обработчик, выполняющийся после инициализации компонента.
         */
        this[HANDLERS.ON_INITIALIZED] = _config[HANDLERS.ON_INITIALIZED];

        /**
         * Обработчик, выполняющийся после смены выделения.
         */
        this[HANDLERS.ON_SELECTION_CHANGED] = _config[HANDLERS.ON_SELECTION_CHANGED];

        init();

        function init() {
            _$container.append(_$tabsList);
            _$tabsList.append(_$tabsContainer);
            _tabs.forEach(function (tab) {
                _$tabsContainer.append(tab.$template);
            });
            if (_config.id) {
                _$widget.attr("id", _config.id);
            }
            _$widget.append(_$container);
            _$widget.append(_$contentContainer);

            if (_tabs.length) {
                var tabToSelect = _config.selectedTabKey
                    ? _tabs.find(function (x) { return x.key === _config.selectedTabKey; }) || _tabs[0]
                    : _tabs[0];
                selectTab(tabToSelect);
            }

            invokeHandler(HANDLERS.ON_INITIALIZED, { component: self });
        }

        function selectTab(tab) {
            if (_selectedTab) {
                deselectTab(_selectedTab);
            }
            setTabSelected(tab);
            _selectedTab = tab;

            if (_selectedTab.$content) {
                renderContent(_selectedTab.$content);
            } else {
                renderContent(_$content);
            }

            invokeHandler(HANDLERS.ON_SELECTION_CHANGED, { component: self, selectedTab: _selectedTab });
        }

        function deselectTab(tab) {
            if (tab) {
                setTabDeselected(tab);
                _selectedTab = null;
            }
        }

        function setTabSelected(tab) {
            if (tab && !isTabSelected(tab)) {
                tab.$template.addClass(SELECTED_ITEM_CLASS);
            }
        }

        function setTabDeselected(tab) {
            if (tab && isTabSelected(tab)) {
                tab.$template.removeClass(SELECTED_ITEM_CLASS);
            }
        }

        function isTabSelected(tab) {
            if (!tab) return false;
            return tab.$template.hasClass(SELECTED_ITEM_CLASS);
        }

        function createTab(data) {
            var tab = {
                key: data.key,
                title: data.title,
                $content: data.contentTemplate ? $(data.contentTemplate) : null
            };
            tab.$template = $("<li />").attr("role", "presentation")
                .append($("<a>").attr("href", "#").attr("title", tab.title).text(tab.title).click(tab, onTabClick));
            return tab;
        }

        function onTabClick(e) {
            e.preventDefault();
            selectTab(e.data);
        }

        function renderContent($content) {
            _$contentContainer.children().detach();
            _$contentContainer.append($content);
        }

        /**
         * Вызывает методы жизненного цикла объекта (если они есть).
         * @param {string} handlerName Название обработчика (из HANDLERS).
         * @param {*} payload Параметры, передаваемые в обработчик.
         */
        function invokeHandler(handlerName, payload) {
            if (self[handlerName]) {
                self[handlerName](payload);
            }
        }
    }

    VerticalTabPanel.create = function (config) {
        return new VerticalTabPanel(config);
    }
}((window.ct = window.ct || {}, window.ct.ui = window.ct.ui || {})));