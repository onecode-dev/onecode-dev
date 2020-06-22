(function () {
    'use strict';

    angular.module('BlurAdmin.pages.profesiones')
        .controller('ProfesionController', ProfesionController);

    /** @ngInject */
    function ProfesionController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ProfesionService,
        ngDialog
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading = false
            vm.array = []

            vm.pagination = {
                max_size: 10,
                total_items: 0,
                current_page: 1,
                search: ""
            }

        }

        vm.page_changed = function() {
            return vm.list()
        }

        vm.search = function() {
            vm.pagination.current_page = 1
            vm.list()
        }

        vm.list = function() {
            vm.loading = true
            return ProfesionService
                .list({
                    page: vm.pagination.current_page,
                    search: vm.pagination.search
                }, function(data) {
                    vm.pagination.total_items = data.count
                    vm.array = data.results
                    vm.loading = false
                }, function(error) {
                    //console.log(error)
                })
        }
        vm.list()

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            vm.loading = false
            return swal("¡Error!", msg, "error")
        }
        function _onDelete(response) {
            swal("¡Éxito al eliminar!", "Registro eliminado exitosamente", "success")
            return vm.list()
        }
        vm.delete = function (item) {
            swal({
                title: "¿Eliminar profesión?",
                text: "Se eliminará la profesión: " + item.profesion,
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, eliminar!",
                cancelButtonText: "No, aún no",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function() {
                /////////////////////////////////////////////////
                //  FIX DE TECLA TABULADOR
                /////////////////////////////////////////////////
                window.onkeydown = null
                window.onfocus = null
                /////////////////////////////////////////////////

                return ProfesionService.delete({ id: item.id }, _onDelete, _onError);
            });
        }


        //////////////////////////////////////////////////////////////////////////////
        //  CREATE AND UPDATE
        //////////////////////////////////////////////////////////////////////////////
        vm.create = function() {
            return ngDialog.openConfirm({
                template: 'app/pages/profesiones/templates/profesiones.dialog.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                controller: 'ProfesionCreateController',
                controllerAs: 'ctrl'
                //closeByDocument: false,
                //closeByEscape: false
            })
            .then(function(data) {
                return vm.list()
            })
            .catch(function(error) {
                //console.log("error", error)
            })
        }
        vm.update = function(item) {
            return ngDialog.openConfirm({
                template: 'app/pages/profesiones/templates/profesiones.dialog.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                controller: 'ProfesionEditController',
                controllerAs: 'ctrl',
                resolve: {
                    item: function getItem() {
                        return item
                    }
                }
                //closeByDocument: false,
                //closeByEscape: false
            })
            .then(function(data) {
                return vm.list()
            })
            .catch(function(error) {
                //console.log("error", error)
            })
        }
        //////////////////////////////////////////////////////////////////////////////


    }
})();
