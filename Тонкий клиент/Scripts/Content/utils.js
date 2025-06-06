var utils = (function () {

    function initExtenders() {
        extendRegExp();
    }

    /* public Методы 
     * Сюда добавлять новые public утилит методы
     */
    
    function escapeRegExp(regExp) {
        return regExp.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    }
    /* public Методы */

    /* private Методы 
     * Сюда добалять методы только для использование в пределах utils.js
     */
    

    function extendRegExp() {
        RegExp.escape = escapeRegExp;
    }
    /* private Методы */

    initExtenders();

    return {
        escapeRegExp: escapeRegExp
    };
})()