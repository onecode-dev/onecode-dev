(function () {
    'use strict';

    angular.module('BlurAdmin.pages.caja')
        .controller('CajaController', CajaController);

    /** @ngInject */
    function CajaController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        AuthService,
        CajaService,
        UtilsService,
        AperturaCierreService
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

            vm.caja = {}

            vm.ESTADOS_CAJA = UtilsService.getEstadosCaja()

            vm.query = {
                estado: null
            }

            //  OBTENER EL ITEM DE CAJA
            getItem()

        }

        function getItem() {
            vm.loading = true
            CajaService
                .list({
                    page: 1
                }, function(data) {
                    vm.caja = data.results[0]
                    vm.loading = false
                    vm.list()
                }, function(error) { })
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
            return AperturaCierreService
                .list({
                    page: vm.pagination.current_page,
                    search: vm.pagination.search,
                    estado: vm.query.estado
                }, function(data) {
                    vm.pagination.total_items = data.count
                    vm.array = data.results

                    // if (vm.array.length) {
                    //     if (vm.array[0].colaborador.id == $rootScope.user.id)
                    //         console.log("APERTURA PERTENECIENTE A ESTE USUARIO")
                    // }

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

        vm.aperturarCaja = function() {
            var total_ultimo_cierre = 0
            if (vm.array.length)
                total_ultimo_cierre = vm.array[0].total_cierre

            $rootScope.cierre_anterior = total_ultimo_cierre
            $rootScope.total_apertura_form = 0

            return ngDialog
                .openConfirm({
                    template: "app/pages/caja/templates/aperturar_caja.html",
                    width: '50%',
                    closeByDocument: false,
                    closeByEscape: false,
                    controller: ['$scope', '$rootScope', 'AperturaCierreService', 'AuthService', 'ngDialog',
                        function($scope, $rootScope, AperturaCierreService, AuthService, ngDialog) {

                        var vm = this;
                        activate()
                        function activate() {
                            vm.total_apertura_form = 0
                        }

                        function _validate() {
                            var title = "Error"
                            var msg = "Campos incompletos. Por favor verifica."
                            var error = false

                            if (vm.total_apertura_form == null || vm.total_apertura_form == undefined) {
                                title = "Sin total de apertura"
                                msg = "Por favor, escribe el total de la apertura de caja"
                                error = true
                            }
                            else if (vm.total_apertura_form < 0) {
                                title = "Total de apertura negativo"
                                msg = "No es posible aperturar la caja con una cantidad negativa."
                                error = true
                            }

                            if (error)
                                swal(title, msg, "error")
                            return !error
                        }

                        vm.save = function() {
                            if (_validate()) {

                                // $rootScope.total_apertura = vm.total_apertura_form
                                swal({
                                    title: "¿Aperturar caja?",
                                    text: "Será aperturada la caja con la cantidad monetaria de: Q" + vm.total_apertura_form.toFixed(2),
                                    type: "warning",
                                    showCancelButton: true,
                                    confirmButtonColor: "#e74c3c",
                                    confirmButtonText: "¡Sí, aperturar caja!",
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

                                    var json = {
                                        total_apertura: vm.total_apertura_form,
                                        total_actual: vm.total_apertura_form
                                    }

                                    return AperturaCierreService
                                        .create(json, function(response_caja) {

                                            AuthService
                                                .me()
                                                .then(function(response) {
                                                    $rootScope.user.caja_activa = response.caja_activa
                                                    $rootScope.user.id_apertura_caja = response.id_apertura_caja

                                                    swal("¡Caja aperturada!", "La caja fue aperturada exitosamente.", "success")
                                                    $scope.confirm()
                                                    $state.go('movimientos_caja', { id: response_caja.id })
                                                })
                                                .catch(function(err){ })


                                        }, function(error) {
                                            var msg = "Ocurrió un error al aperturar la caja. Por favor intenta más tarde."
                                            if (error.data.detail)
                                                msg = error.data.detail

                                            swal("Error", msg, "error")
                                            $scope.confirm()

                                        })

                                })

                            }
                        }

                    }],
                    controllerAs: 'ctrl'
                })
                .then(function() {

                })

        }

        vm.reporteMovimientos = function() {
            return ngDialog
            .open({
                template: "app/pages/caja/templates/reporte.mov.dialog.html",
                width: '50%',
                closeByDocument: false,
                closeByEscape: false,
                controller: ['$scope', '$rootScope', 'AperturaCierreService', 'AuthService',
                    function($scope, $rootScope, AperturaCierreService, AuthService) {
                        var vm = this;

                        function activate() {
                            vm.reporte = {}
                            vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd/MM/yyyy', 'shortDate']; //  FORMATOS DE FECHA
                            vm.format = vm.formats[2];  //  SETEANDO FORMATO DE FECHA DEFAULT
                            vm.dateOptions = {  //  OPCIONES DEL DATE PICKER
                                formatYear: 'yy',
                                startingDay: 0
                            };
                        }
                        activate()

                        /////////////////////////////////////////////////////////////////////////////////////////////////////
                        //  DATEPICKER OPTIONS
                        /////////////////////////////////////////////////////////////////////////////////////////////////////
                        vm.clear = function () {
                            vm.reporte.desde = null;    //  LIMPIANDO FECHAS
                            vm.reporte.hasta = null;
                        };
                        vm.openFechaDesde = function($event) {    //  ABRIR DATE PICKER FECHA DESDE
                            $event.preventDefault();
                            $event.stopPropagation();
                            vm.openedFechaDesde = true;
                        };
                        vm.openFechaHasta = function($event) {   //  ABRIR DATE PICKER FECHA HASTA
                            $event.preventDefault();
                            $event.stopPropagation();
                            vm.openedFechaHasta = true;
                        };
                        vm.today = function() { //  SETEANDO FECHA DEL DIA ACTUAL
                            vm.reporte.desde = new Date();
                            vm.reporte.hasta = new Date();
                        };
                        vm.today(); //  LLAMADO A TODAY FUNCTION

                        function _validate() {
                            var title = "Error"
                            var msg = "Campos incompletos. Por favor verifica."
                            var error = false

                            if (!vm.reporte.desde || !vm.reporte.hasta) {
                                error = true
                                title = "Fechas incorrectas"
                                msg = "Verifica que has seleccionado correctamente las fechas"
                            }
                            else if (vm.reporte.desde > vm.reporte.hasta) {
                                error = true
                                title = "Fecha inicial incorrecta"
                                msg = "La fecha inicial no debe ser mayor a la fecha final"
                            }

                            if (error)
                                swal(title, msg, "error")
                            return !error
                        }
                        vm.generate = function() {
                            if (_validate()) {
                                //window.location()
                                var fecha_inicial = vm.reporte.desde
                                fecha_inicial = fecha_inicial.getFullYear() + "-" +
                                    (fecha_inicial.getMonth() + 1) + "-" +
                                    fecha_inicial.getDate()

                                var fecha_final = vm.reporte.hasta
                                fecha_final = fecha_final.getFullYear() + "-" +
                                    (fecha_final.getMonth() + 1) + "-" +
                                    fecha_final.getDate()

                                window.open(
                                    "/api/aperturas_cierres_caja/reporte_movimientos/?" +
                                    "fecha_inicial=" + fecha_inicial + "&" +
                                    "fecha_final=" + fecha_final + "&" +
                                    "usuario=" + $rootScope.user.id
                                    ,
                                    "_blank"
                                );
                                $scope.closeThisDialog(0)
                            }
                        }

                    }],
                    controllerAs: 'ctrl'
                })
        }

        vm.detallesCierreCaja = function(item) {
            item.loadingIngEng = true

            return AperturaCierreService
                .ingresos_egresos({ id: item.id }, function(response) {
                    item.loadingIngEng = false

                    $rootScope.ingresos_egresos_info = response
                    $rootScope.apertura_cierre_caja_info = item

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
