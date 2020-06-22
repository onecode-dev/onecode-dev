(function () {
    'use strict';

    angular.module('BlurAdmin.pages.caja')
        .controller('MovimientosCajaCreateController', MovimientosCajaCreateController);

    /** @ngInject */
    function MovimientosCajaCreateController(
        $scope,
        $rootScope,
        $window,
        $state,
        AuthService,
        NotificationsService,
        MovimientosCajaService,
        item
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.movimiento_caja = {
                apertura_cierre_caja: item.id,
                cantidad: null,
                tipo: null,
                tipo_documento: null,
                num_documento: null,
                concepto: ""
            }

            vm.activar_cantidad = true
            vm.activar_egreso = true
        }

        vm.changeType = function() {
            vm.movimiento_caja.tipo_documento = null
            vm.movimiento_caja.num_documento = null
        }

        function _validate() {
            var title = "Error"
            var msg = "Campos incompletos. Por favor verifica."
            var error = false

            if (!vm.movimiento_caja.cantidad) {
                title = "Sin cantidad"
                msg = "Por favor, escribe la cantidad del movimiento"
                error = true
            }
            else if (!vm.movimiento_caja.tipo) {
                title = "Sin tipo"
                msg = "Por favor, selecciona el tipo de movimiento"
                error = true
            }
            else if (!vm.movimiento_caja.concepto) {
                title = "Sin concepto"
                msg = "Por favor, escribe el concepto del movimiento"
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
            swal("¡Éxito!", "El movimiento fue registrado exitosamente.", "success")
            $scope.confirm(response)
            //return $state.go('users')
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Registrar movimiento?",
                    text: "Será registrado un movimiento de caja.",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e74c3c",
                    confirmButtonText: "¡Sí, registrar!",
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

                    return MovimientosCajaService.create(vm.movimiento_caja, _onSave, _onError)

                })
            }
        }

    }
})();
