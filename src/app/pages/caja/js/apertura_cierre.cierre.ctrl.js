(function () {
    'use strict';

    angular.module('BlurAdmin.pages.caja')
        .controller('CerrarCajaController', CerrarCajaController);

    /** @ngInject */
    function CerrarCajaController(
        $scope,
        $rootScope,
        $window,
        $state,
        AuthService,
        UtilsService,
        AperturaCierreService,
        item,
        ingresos_egresos
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.apertura_cierre_caja = item
            vm.ingresos_egresos = ingresos_egresos

            vm.ESTADOS_CAJA = UtilsService.getEstadosCaja()

            vm.total_cierre_form = ""
        }

        function _validate() {
            var title = "Error"
            var msg = "Campos incompletos. Por favor verifica."
            var error = false

            if (vm.total_cierre_form == null || vm.total_cierre_form == undefined) {
                title = "Sin total de cierre"
                msg = "Por favor, escribe el total del cierre de caja"
                error = true
            }
            else if (vm.total_cierre_form != vm.apertura_cierre_caja.total_actual && !vm.apertura_cierre_caja.notas) {
                title = "Incoherencia encontrada"
                msg = "Escriba una observación en el apartado de notas para especificar porqué no coincide"
                        + " el efectivo en sistema y el efectivo real en caja."
                error = true
            }

            if (error)
                swal(title, msg, "error")
            return !error
        }

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            return swal("¡Error!", msg, "error")
        }
        function _onSave(response) {
            AuthService
                .me()
                .then(function(response) {
                    $rootScope.user.caja_activa = response.caja_activa
                    $rootScope.user.id_apertura_caja = response.id_apertura_caja

                    swal("¡Éxito!", "La caja se cerró exitosamente.", "success")
                    $scope.confirm(response)
                    return $state.go('caja')
                })
                .catch(function(err){ })
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Cerrar caja?",
                    text: "Se cerrará la caja actual.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e74c3c",
                    confirmButtonText: "¡Sí, cerrar caja!",
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
                        id: vm.apertura_cierre_caja.id,
                        estado: vm.ESTADOS_CAJA[1].id,
                        total_cierre: vm.total_cierre_form,
                        fecha_cierre: new Date(),
                        notas: vm.apertura_cierre_caja.notas
                    }

                    return AperturaCierreService.update(json, _onSave, _onError)

                })
            }
        }

    }
})();
