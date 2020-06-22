(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pacientes')
        .controller('CobrosPacienteController', CobrosPacienteController);

    /** @ngInject */
    function CobrosPacienteController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        AuthService,
        CajaService,
        UtilsService,
        PacienteService,
        CobrosPacienteService
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading = false
            vm.loadingIngEng = false
            vm.array = []

            //  OBTENDRA LOS INGRESOS Y EGRESOS DE LA APERTURA CIERRE ACTUAL
            vm.ingresos_egresos = {}

            vm.pagination = {
                max_size: 10,
                total_items: 0,
                current_page: 1,
                search: "",
            }

            vm.paciente = {}

            vm.ESTADOS_CAJA = UtilsService.getEstadosCaja()

            vm.query = {
                pendientes: 10,
                pagados: 20,
                anulados: 30,
                todas: 40
            }

            vm.query.filterby = vm.query.todas

            //  OBTENER EL ITEM DE CAJA
            getItem()

        }

        function getItem() {
            if (!$state.params.id)
                return $state.go("caja")
            else {
                vm.loading = true
                PacienteService
                    .get({ id: $state.params.id }, function(data) {
                        vm.paciente = data
                        vm.loading = false
                        vm.list()
                    }, function(error) { })
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

            var query_json = {
                paciente: $state.params.id,
                search: vm.pagination.search,
                page: vm.pagination.current_page
            }

            if (vm.query.filterby == vm.query.pendientes) {
                query_json.anulado = false
                query_json.pagado = false
            }
            else if (vm.query.filterby == vm.query.pagados) {
                query_json.anulado = false
                query_json.pagado = true
            }
            else if (vm.query.filterby == vm.query.anulados) {
                query_json.anulado = true
                query_json.pagado = false
            }
            else if (vm.query.filterby == vm.query.todas) {
                query_json.anulado = null
                query_json.pagado = null
            }

            vm.loading = true
            return CobrosPacienteService
                .list(query_json, function(data) {
                    vm.pagination.total_items = data.count

                    vm.array = data.results
                    vm.loading = false
                }, function(error) {
                    //console.log(error)
                })
        }
        // vm.list()

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            vm.loading = false
            return swal("¡Error!", msg, "error")
        }

        vm.registrarCobro = function() {
            return ngDialog.openConfirm({
                template: 'app/pages/pacientes/templates/cobros.create.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                controller: 'CobrosPacienteCreateController',
                controllerAs: 'ctrl',
                resolve: {
                    item: function getItem() {
                        return vm.paciente
                    }
                },
                closeByDocument: false,
                closeByEscape: false
            })
            .then(function(data) {
                // return vm.list()
                getItem()
            })
            .catch(function(error) {
                //console.log("error", error)
            })
        }

        vm.anularCobro = function(item) {
            return swal({
                title: "¿Anular cobro?",
                text: "Se anulará este cobro",
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

                return CobrosPacienteService
                    .delete({ id: item.id }, function(response) {
                        //  SI SE ANULO CORRECTAMENTE, VOLVER A SOLICITAR EL LISTADO
                        swal("¡Éxito!", "El cobro fue anulado exitosamente", "success")
                        return getItem();

                    }, _onError);
            });
        }

        vm.realizarCobro = function(item) {
            //  SI NO TIENE CAJA ABIERTA NO SE PODRÁ REALIZAR EL COBRO
            if (!$rootScope.user.caja_activa)
                swal(
                    "Sin apertura de caja",
                    "Usted no tiene una apertura de caja activa en este momento. Para realizar el cobro debe tener una caja aperturada",
                    "error"
                )
            else {

                return ngDialog.openConfirm({
                    template: 'app/pages/caja/templates/movimientos_caja.create.html',
                    className: 'ngdialog-theme-default ngdialog-theme-custom',
                    controller: 'MovimientosCajaCreateCobroPacienteController',
                    controllerAs: 'ctrl',
                    resolve: {
                        item: function getItem() {
                            return item
                        }
                    },
                    closeByDocument: false,
                    closeByEscape: false
                })
                .then(function(data) {
                    // return vm.list()
                    getItem()
                })
                .catch(function(error) {
                    //console.log("error", error)
                })

            }
        }

        vm.registrarAbono = function() {
            //  SI NO TIENE CAJA ABIERTA NO SE PODRÁ REALIZAR EL COBRO
            if (!$rootScope.user.caja_activa)
                swal(
                    "Sin apertura de caja",
                    "Usted no tiene una apertura de caja activa en este momento. Para realizar el cobro debe tener una caja aperturada",
                    "error"
                )
            else {

                return ngDialog
                    .openConfirm({
                        template: 'app/pages/caja/templates/movimientos_caja.create.html',
                        className: 'ngdialog-theme-default ngdialog-theme-custom',
                        controller: 'MovimientosCajaCreateAbonoPacienteController',
                        controllerAs: 'ctrl',
                        resolve: {
                            paciente: function getItem() {
                                return vm.paciente
                            }
                        },
                        closeByDocument: false,
                        closeByEscape: false
                    })
                    .then(function(data) {
                        getItem()
                    })
                    .catch(function(error) {

                    })

            }
        }

    }
})();
