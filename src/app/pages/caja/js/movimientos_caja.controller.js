(function () {
    'use strict';

    angular.module('BlurAdmin.pages.caja')
        .controller('MovimientosCajaController', MovimientosCajaController);

    /** @ngInject */
    function MovimientosCajaController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        AuthService,
        CajaService,
        UtilsService,
        AperturaCierreService,
        MovimientosCajaService
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

            vm.apertura_cierre_caja = {}

            vm.ESTADOS_CAJA = UtilsService.getEstadosCaja()

            //  OBTENER EL ITEM DE CAJA
            getItem()

        }

        function getItem() {
            if (!$state.params.id)
                return $state.go("caja")
            else {
                vm.loading = true
                AperturaCierreService
                    .get({ id: $state.params.id }, function(data) {
                        vm.apertura_cierre_caja = data
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
            vm.loading = true
            return MovimientosCajaService
                .list({
                    apertura_cierre_caja: $state.params.id,
                    page: vm.pagination.current_page,
                    search: vm.pagination.search
                }, function(data) {
                    vm.pagination.total_items = data.count

                    _.forEach(data.results, function(item) {
                        if (item.tipo == 10)
                            item.tipo_nombre = "INGRESO"
                        else if (item.tipo == 20)
                            item.tipo_nombre = "EGRESO"
                    })

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

        vm.registrarMovimiento = function() {
            return ngDialog.openConfirm({
                template: 'app/pages/caja/templates/movimientos_caja.create.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                controller: 'MovimientosCajaCreateController',
                controllerAs: 'ctrl',
                resolve: {
                    item: function getItem() {
                        return vm.apertura_cierre_caja
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

        function getIngresosEgresos() {
            vm.loadingIngEng = true
            AperturaCierreService
                .ingresos_egresos({ id: vm.apertura_cierre_caja.id }, function(response) {
                    vm.ingresos_egresos = response
                    vm.loadingIngEng = false
                }, function(error) { })
        }
        vm.cerrarCaja = function() {
            // getIngresosEgresos()
            vm.loadingIngEng = true

            return AperturaCierreService
                .ingresos_egresos({ id: vm.apertura_cierre_caja.id }, function(response) {
                    vm.ingresos_egresos = response

                    return ngDialog.openConfirm({
                        template: 'app/pages/caja/templates/cerrar_caja.html',
                        // className: 'ngdialog-theme-default ngdialog-theme-custom',
                        width: '50%',
                        controller: 'CerrarCajaController',
                        controllerAs: 'ctrl',
                        resolve: {
                            item: function getItem() {
                                return vm.apertura_cierre_caja
                            },
                            ingresos_egresos: function getIngresosEgresosCtrl() {
                                return vm.ingresos_egresos
                            }
                        },
                        closeByDocument: false,
                        closeByEscape: false
                    })
                    .then(function(data) {
                        // return vm.list()
                        vm.loadingIngEng = false
                        // getItem()
                    })
                    .catch(function(error) {
                        vm.loadingIngEng = false
                        //console.log("error", error)
                    })

                }, function(error) {
                    swal("¡Error!", "Ocurrió un error. Por favor intenta más tarde.", "error")
                })

        }

        vm.detallesMovimiento = function(item) {
            $rootScope.movimiento_caja = item
            return ngDialog.open({
                template: 'app/pages/caja/templates/movimientos_caja.dialog.html',
                className: 'ngdialog-theme-default ngdialog-theme-custom',
                closeByDocument: true,
                closeByEscape: true
            })
        }

        vm.detallesCierreCaja = function() {
            vm.loadingIngEng = true

            return AperturaCierreService
                .ingresos_egresos({ id: vm.apertura_cierre_caja.id }, function(response) {
                    vm.loadingIngEng = false

                    $rootScope.ingresos_egresos_info = response
                    $rootScope.apertura_cierre_caja_info = vm.apertura_cierre_caja
                    return ngDialog.open({
                        template: 'app/pages/caja/templates/cerrar_caja.dialog.html',
                        width: '50%',
                        closeByDocument: true,
                        closeByEscape: true
                    })

                }, function(error) {
                    swal("¡Error!", "Ocurrió un error. Por favor intenta más tarde.", "error")
                })


        }

    }
})();
