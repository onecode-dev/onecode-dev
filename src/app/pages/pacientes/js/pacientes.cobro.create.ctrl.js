(function () {
    'use strict';

    angular.module('BlurAdmin.pages.caja')
        .controller('CobrosPacienteCreateController', CobrosPacienteCreateController);

    /** @ngInject */
    function CobrosPacienteCreateController(
        $scope,
        $rootScope,
        $window,
        $state,
        AuthService,
        NotificationsService,
        CobrosPacienteService,
        item
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.cobro = {
                paciente: item.id,
                monto: null,
                tipo: 10,   //  TIPO 10 ES COBRO
                motivo: ""
            }
        }

        function _validate() {
            var title = "Error"
            var msg = "Campos incompletos. Por favor verifica."
            var error = false

            if (!vm.cobro.monto) {
                title = "Sin monto"
                msg = "Por favor, escribe la cantidad del cobro"
                error = true
            }
            else if (!vm.cobro.motivo) {
                title = "Sin motivo"
                msg = "Por favor, escribe el motivo del cobro"
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

            swal("¡Error!", msg, "error")
            $scope.confirm(response)
        }
        function _onSave(response) {
            swal("¡Éxito!", "El cobro fue registrado exitosamente.", "success")
            $scope.confirm(response)
            //return $state.go('users')
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Registrar cobro?",
                    text: "Será registrado un cobro al paciente",
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

                    vm.cobro.colaborador = $rootScope.user.id
                    return CobrosPacienteService.create(vm.cobro, _onSave, _onError)

                })
            }
        }

    }
})();
