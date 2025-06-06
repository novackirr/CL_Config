(function ($) {
	
    function getFalse(e) {
		
		//n.volosatov - грязный хак для старой версии ИЕ11
		var $target = $(e.target);
		if($target.attr("type") === "checkbox") {
			$target.attr("disabled","disabled");
			setTimeout(function() {
				$target.removeAttr("disabled","disabled");
			},1000);
		}
		
		return false;
    }
	
    var methods = {

        activate: function (target) {

            return target.each(function () {

                var $target = $(this);

                $target.attr("readonly", "readonly")
					.on("mousedown",getFalse)
                    .on("click", getFalse)
                    .on("focus", getFalse)
                    .on("keydown", getFalse)
                    .css("cursor", "not-allowed");

                if ($target.attr("type") === "checkbox") {
                    methods.activate($("[for='" + $target.attr("id") + "']"));
                }
            });
        },

        deactivate: function (target) {

            return target.each(function () {

                var $target = $(this);

                $target.removeAttr("readonly")
                    .off("mousedown",getFalse)
                    .off("click", getFalse)
                    .off("focus", getFalse)
                    .off("keydown", getFalse)
                    .css("cursor", "default");

                if ($target.attr("type") === "checkbox") {
					methods.deactivate($("[for='" + $target.attr("id") + "']"));
                }
            });
        }
    };

    $.fn.readonly = function (action) {

        if (action == undefined)
            action = true;

        if (action) {
            return methods.activate(this);
        }
        else {
            return methods.deactivate(this);
        }
    };

})(jQuery);