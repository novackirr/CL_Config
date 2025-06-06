(function () {

    console.log("empty-submit");

    
    var dialog = $("#actionDialog");
  var submitButton = dialog.find("#btn-ok_from_modal");

    //убираем стандартный сабмит
    submitButton.unbind("click");

    submitButton.on("click",
        function (event) {
            $("[data-dismiss='modal']").click();
            return false;
        });

}());