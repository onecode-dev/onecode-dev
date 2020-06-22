(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pacientes')
        .controller('PacientesController', PacientesController);

    /** @ngInject */
    function PacientesController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        PacienteService,
        ngDialog,
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
                search: ""
            }


            //  SI ES PSICOLOGO SE MUESTRA EL BOTON DE NUEVA CONSULTA, DE LO CONTRARIO NO
            //  PORQUE UNA SECRETARIA O UN ADMIN NO PUEDE CREAR CASOS A PACIENTES PORQUE NO SON
            //  NI MEDICOS NI PSICOLOGOS, SOLO PODRÁN VISUALIZAR EL HISTORIAL DE CONSULTAS
            vm.esPsicologo = false
            vm.esMedico = false
            AuthService
                .me()
                .then(function(response) {
                    var user = response
                    var esPsicologo = AuthService.hasPermission(user, AuthService.PSICOLOGIA)
                    if (esPsicologo)
                        vm.esPsicologo = true

                    if (AuthService.hasPermission(user, AuthService.MEDICINA))
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
            return PacienteService
                .list({
                    page: vm.pagination.current_page,
                    search: vm.pagination.search
                }, function(data) {
                    vm.pagination.total_items = data.count

                    _.forEach(data.results, function(item) {
                        if (item.fecha_nacimiento)
                            item.edad = moment().diff(moment(item.fecha_nacimiento), 'years')
                    })

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
                title: "¿Eliminar paciente?",
                text: "Se eliminará al paciente: " + item.persona.persona,
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

                return PacienteService.delete({ id: item.id }, _onDelete, _onError);
            });
        }

        //  DIALOGO DE DETALLES DE PACIENTE
        vm.details = function(item) {
            return ngDialog.openConfirm({
                template: 'app/pages/pacientes/templates/pacientes.dialog.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                controller: 'PacienteDialogController',
                controllerAs: 'ctrl',
                width: '90%',
                resolve: {
                    item: function() {
                        return item
                    },
                    create: function() {
                        return vm.create
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
        //  CITA
        //////////////////////////////////////////////////////////////////////////////
        vm.create = function(paciente) {
            if ($rootScope.user) {
                if (AuthService.hasPermission($rootScope.user, AuthService.ADMIN) ||
                    AuthService.hasPermission($rootScope.user, AuthService.SECRETARIA)) {

                    return ngDialog.openConfirm({
                        template: 'app/pages/citas/templates/citas.dialog.grid.pacientes.html',
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
                                return paciente
                            }
                        }
                    })
                    .then(function(data) {
                        // return vm.list()
                    })
                    .catch(function(error) {})
                } else {
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
                                return paciente
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
