(function () {
    'use strict';

    angular.module('BlurAdmin.pages.consultas')
        .controller('ReconsultaController', ReconsultaController);

    /** @ngInject */
    function ReconsultaController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        ConsultaService,
        AuthService,
        ReconsultaService
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

            vm.consulta = {}

            vm.query = {}

            getItem()

        }

        function getItem() {
            if (!$state.params.id)
                return $state.go('consultas')
            else {
                vm.loading_item = true
                ConsultaService
                    .get({ id: $state.params.id }, function(response) {
                        vm.consulta = response
                        vm.loading_item = false
                        vm.list()

                    }, function(error) {
                        return $state.go('consultas')
                    })
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
            return ReconsultaService
                .list({
                    consulta: vm.consulta.id,
                    page: vm.pagination.current_page,
                    search: vm.pagination.search,
                }, function(data) {
                    vm.pagination.total_items = data.count
                    vm.array = data.results
                    vm.loading = false
                }, function(error) {
                    //console.log(error)
                })
        }
        // vm.list()

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
            swal("¡Éxito al eliminar!", "Consulta eliminada exitosamente", "success")
            return vm.list()
        }
        vm.delete = function (item) {
            swal({
                title: "¿Eliminar la consulta?",
                text: "Se eliminará la consulta",
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

                return ConsultaService.delete({ id: item.id }, _onDelete, _onError);
            });
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
                            return vm.consulta.paciente
                        }
                    }
                })
                .then(function(data) {})
                .catch(function(error) {})
            }
        }
        //////////////////////////////////////////////////////////////////////////////

        // vm.details = function(item) {
        //     return ngDialog.open({
        //         template: 'app/pages/citas/templates/citas.dialog.details.html',
        //         width: '80%',
        //         controller: 'CitaDetailsDialogController',
        //         controllerAs: 'ctrl',
        //         closeByDocument: true,
        //         closeByEscape: true,
        //         resolve: {
        //             item: function() {
        //                 return item
        //             },
        //         }
        //     })
        // }


    }
})();
