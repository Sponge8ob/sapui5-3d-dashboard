sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast"
], function (Controller, JSONModel, Fragment, MessageToast) {
    "use strict";

    return Controller.extend("sapui5project1.controller.View1", {

        onInit: function () {
            // Data structure ready for backend binding
            var oData = {
                TotalEmployees: 0,
                ActiveEmployees: 0,
                OnLeaveEmployees: 0,
                Employees: [
                    // Data removed as requested. Bind to an OData service or populate dynamically.
                ]
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
        },

        onCreateEmployee: function () {
            var oView = this.getView();

            if (!this._pCreateDialog) {
                this._pCreateDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sapui5project1.fragment.CreateEmployee",
                    controller: this
                }).then(function (oDialog) {
                    // Add 3D classes to the dialog root via style class
                    oDialog.addStyleClass("dialog3D glassPanel");
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pCreateDialog.then(function (oDialog) {
                oDialog.open();
            });
        },

        onCreateCancel: function () {
            this.byId("createEmployeeDialog").close();
        },

        onCreateSave: function () {
            var empId = this.byId("empIdInput").getValue();
            var empName = this.byId("empNameInput").getValue();
            var dept = this.byId("deptInput").getValue();
            var role = this.byId("roleInput").getValue();

            if (!empId || !empName) {
                MessageToast.show("Please enter Employee ID and Employee Name.");
                return;
            }

            // Validation: ID must be numeric
            if (!/^\d+$/.test(empId)) {
                MessageToast.show("Error: Employee ID must contain only numbers.");
                return;
            }

            // Validation: Name must be characters and spaces only
            if (!/^[a-zA-Z\s]+$/.test(empName)) {
                MessageToast.show("Error: Employee Name must contain only letters.");
                return;
            }

            var oModel = this.getView().getModel();
            var oData = oModel.getData();

            oData.Employees.unshift({
                serialNo: oData.TotalEmployees + 1,
                employeeId: empId,
                employeeName: empName,
                department: dept,
                role: role,
                avatar: "sap-icon://employee"
            });

            oData.TotalEmployees++;
            oData.ActiveEmployees++;

            oModel.refresh(true); // efficiently update UI bindings

            // Clear form
            this.byId("empIdInput").setValue("");
            this.byId("empNameInput").setValue("");
            this.byId("deptInput").setValue("");
            this.byId("roleInput").setValue("");

            MessageToast.show("Employee added successfully!");
            this.byId("createEmployeeDialog").close();
        },

        onValueHelpRequest: function (oEvent) {
            var sInputValue = oEvent.getSource().getValue(),
                oView = this.getView();

            // create value help dialog
            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sapui5project1.fragment.ValueHelp",
                    controller: this
                }).then(function (oDialog) {
                    oDialog.addStyleClass("dialog3D glassPanel");
                    oView.addDependent(oDialog);
                    return oDialog;
                });
            }
            this._pValueHelpDialog.then(function (oDialog) {
                oDialog.open(sInputValue);
            });
        },

        onValueHelpClose: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var departmentInput = this.byId("deptInput");
                if (departmentInput) {
                    departmentInput.setValue(oSelectedItem.getTitle());
                }
            }
            oEvent.getSource().getBinding("items").filter([]);
        }
    });
});
