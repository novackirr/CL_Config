var StateManager = (function () {

    function StateManager() { }

    StateManager.prototype = {
        getState: function getState() {
            var location = window.location;
            if (location.hash && location.hash !== "") {
                var hash = location.hash.substring(1);
                hash = decodeURIComponent(hash);
                return JSON.parse(hash);
            }
            else
                return this.getInitialState();
        },

        setState: function setState(state) {
            var location = window.location;
            var json = encodeURIComponent(JSON.stringify(state));
            location.hash = json;
        },

        getInitialState: function getInitialState() {
            return {
                d: null,
                s: [],
                p: []
            };
        },

        getBreadcrumpsItems: function getBreadcrumpsItems() {
            var state = this.getState();
            var items = [
                {
                    name: dictionaryStrings.rootBreadcrumbName,
                    state: {
                        d: null,
                        p: [],
                        s: []
                    }
                }
            ];

            if (state.d && state.d !== "") {
                items.push({
                    name: state.d,
                    state: {
                        d: state.d,
                        p: [],
                        s: []
                    }
                });
            }

            var l = state.s.length;
            for (var i = 0; i < l; i++) {
                var current = state.s[i];
                items.push({
                    name: current + "(" + state.p[i].code + ")",
                    state: {
                        d: state.d,
                        p: state.p.slice(0, i + 1),
                        s: state.s.slice(0, i + 1)
                    }
                });
            }

            return items;
        },

        toQueryString: function toQueryString(state) {
            if(!state)
                state = this.getState();
                
            var subDictionariesEncodedQueries = $.map(state.s, function (current) {
                return "&subDictionaryNames=" + encodeURIComponent(current);
            });
            if (subDictionariesEncodedQueries.length === 0)
                subDictionariesEncodedQueries.push("&subDictionaryNames=");

            return "?dictionaryName=" + encodeURIComponent(state.d) + subDictionariesEncodedQueries.join("")
                + "&parent=" + (state.p.length > 0 ? state.p[state.p.length - 1].key : null);
        }
    };

    return {
        createInstance: function createInstance() {
            return new StateManager();
        }
    }
}());