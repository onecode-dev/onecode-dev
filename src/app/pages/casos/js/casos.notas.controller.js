(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoNotasController', CasoNotasController);

    /** @ngInject */
    function CasoNotasController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        CasoService,
        AuthService,
        CasoNotasService
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading = false
            vm.loading_item = false

            vm.array = []

            vm.pagination = {
                max_size: 10,
                total_items: 0,
                current_page: 1,
                search: "",
            }

            vm.query = {
                cerrado: false
            }

            if (!$state.params.id)
                $state.go('casos')

            getItem()
        }

        function getItem() {
            vm.loading_item = true
            CasoService
                .get({ id: $state.params.id }, function(response) {
                    vm.caso = response

                    vm.loading_item = false
                }, function(error) {
                    vm.loading_item = false

                    return $state.go('casos')
                })
        }

        vm.gotoCaso = function() {
            $state.go('casos_edit', { id: $state.params.id })
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
            return CasoNotasService
                .list({
                    page: vm.pagination.current_page,
                    search: vm.pagination.search,
                    caso: $state.params.id
                }, function(data) {
                    vm.pagination.total_items = data.count
                    vm.array = data.results
                    vm.loading = false
                }, function(error) {
                    //console.log(error)
                })
        }
        vm.list()

        vm.viewImg = function(img) {
            $rootScope.actual_user_foto = img
            return ngDialog.open({
                template: 'app/pages/users/templates/img.dialog.html',
                width: '90%'
            })
        }

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            vm.loading = false
            return swal("¡Error!", msg, "error")
        }
        function _onDelete(response) {
            swal("¡Éxito al eliminar!", "Nota eliminada exitosamente", "success")
            return vm.list()
        }
        vm.delete = function (item) {
            swal({
                title: "¿Eliminar la nota?",
                text: "Se eliminará la nota",
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

                return CasoNotasService.delete({ id: item.id }, _onDelete, _onError);
            });
        }

        vm.edit = function (item) {
            return ngDialog
                .openConfirm({
                    template: 'app/pages/casos/templates/casos.notas.dialog.edit.html',
                    width: '80%',
                    controller: 'CasoNotasEditController',
                    controllerAs: 'ctrl',
                    closeByDocument: true,
                    closeByEscape: true,
                    resolve: {
                        item: function() {
                            return item
                        },
                    }
                })
                .then(function(data) {
                    return vm.list()
                })
                .catch(function(error) {})
        }

        vm.create = function() {
            return ngDialog
                .openConfirm({
                    template: 'app/pages/casos/templates/casos.notas.dialog.html',
                    width: '80%',
                    controller: 'CasoNotasCreateController',
                    controllerAs: 'ctrl',
                    closeByDocument: true,
                    closeByEscape: true,
                    resolve: {
                        item: function() {
                            return vm.caso
                        },
                    }
                })
                .then(function(data) {
                    return vm.list()
                })
                .catch(function(error) {})
        }

        vm.details = function(item) {
            return ngDialog
                .open({
                    template: 'app/pages/casos/templates/casos.notas.dialog.dt.html',
                    width: '80%',
                    controller: 'CasoNotasDetailsController',
                    controllerAs: 'ctrl',
                    closeByDocument: true,
                    closeByEscape: true,
                    resolve: {
                        item: function() {
                            return item
                        },
                    }
                })
        }

        //////////////////////////////////////////////////////////////////////////////
        //  CITA
        //////////////////////////////////////////////////////////////////////////////
        vm.createCita = function() {
            if ($rootScope.user) {
                return ngDialog.openConfirm({
                    template: 'app/pages/citas/templates/citas.dialog.grid.pacientes.users.html',
                    width: '80%',
                    controller: 'CitasDialogController',
                    controllerAs: 'ctrl',
                    closeByDocument: false,
                    closeByEscape: false,
                    resolve: {
                        colaborador: function() {
                            return $rootScope.user
                        },
                        paciente: function() {
                            return vm.caso.paciente
                        }
                    }
                })
                .then(function(data) {})
                .catch(function(error) {})
            }
        }
        //////////////////////////////////////////////////////////////////////////////


    }
})();
