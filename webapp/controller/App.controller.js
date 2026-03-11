sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("sapui5project1.controller.App", {
        onInit: function () {
            // Apply advanced custom styles via CSS classes if needed at the root
            this.getView().addStyleClass("sapUiSizeCompact");
        }
    });
});
