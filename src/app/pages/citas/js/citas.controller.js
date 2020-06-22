(function () {
    'use strict';

    angular.module('BlurAdmin.pages.citas')
        .controller('CitasController', CitasController);

    /** @ngInject */
    function CitasController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        CitaService,
        AuthService
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
                search: "",
            }

            vm.query = {
                anulada: false
            }

            vm.consultar = false
            vm.esMedico = false
            AuthService
                .me()
                .then(function(response) {
                    var user = response

                    var esPsicologo = AuthService.hasPermission(user, AuthService.PSICOLOGIA)
                    if (esPsicologo)
                        vm.consultar = true

                    var esMedico = AuthService.hasPermission(user, AuthService.MEDICINA)
                    if (esMedico)
                        vm.esMedico = true
                })
                .catch(function(error) {})

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
            return CitaService
                .list({
                    page: vm.pagination.current_page,
                    search: vm.pagination.search,
                    anulada: vm.query.anulada
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
            swal("¡Éxito al anular!", "Cita anulada exitosamente", "success")
            return vm.list()
        }
        vm.delete = function (item) {
            swal({
                title: "¿Anular cita?",
                text: "Se anulará la cita",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, anular!",
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

                return CitaService.delete({ id: item.id }, _onDelete, _onError);
            });
        }

        vm.details = function(item) {
            return ngDialog.open({
                template: 'app/pages/citas/templates/citas.dialog.details.html',
                width: '80%',
                controller: 'CitaDetailsDialogController',
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
        //  CREATE
        //////////////////////////////////////////////////////////////////////////////
        vm.create = function() {
            if ($rootScope.user) {
                if (AuthService.hasPermission($rootScope.user, AuthService.ADMIN) ||
                    AuthService.hasPermission($rootScope.user, AuthService.SECRETARIA)) {

                    return ngDialog.openConfirm({
                        template: 'app/pages/citas/templates/citas.dialog.html',
                        width: '80%',
                        controller: 'CitasDialogController',
                        controllerAs: 'ctrl',
                        closeByDocument: false,
                        closeByEscape: false,
                        resolve: {
                            colaborador: function() {
                                return null
                            },
                            paciente: function() {
                                return null
                            }
                        }
                    })
                    .then(function(data) {
                        return vm.list()
                    })
                    .catch(function(error) {})
                } else {
                    return ngDialog.openConfirm({
                        template: 'app/pages/citas/templates/citas.dialog.users.html',
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
                                return null
                            }
                        }
                    })
                    .then(function(data) {
                        return vm.list()
                    })
                    .catch(function(error) {})
                }
            }


        }
        //////////////////////////////////////////////////////////////////////////////


    }
})();
