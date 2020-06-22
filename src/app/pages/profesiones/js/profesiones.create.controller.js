(function () {
    'use strict';

    angular.module('BlurAdmin.pages.profesiones')
        .controller('ProfesionCreateController', ProfesionCreateController);

    /** @ngInject */
    function ProfesionCreateController(
        $scope,
        $rootScope,
        $window,
        $state,
        AuthService,
        NotificationsService,
        ProfesionService
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.profesion = {
                profesion: ""
            }
        }

        function _validate() {
            if (vm.form.$valid) {
                return true

            } else {
                //  SI EL FORM NO ESTÁ VALIDADO RETORNA LOS CAMPOS SUCIOS
                vm.form.profesion.$dirty = true;
                return false
            }
        }

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            return swal("¡Error!", msg, "error")
        }
        function _onSave(response) {
            swal("¡Éxito!", "La profesión fue agregada exitosamente.", "success")
            $scope.confirm(response)
            //return $state.go('users')
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Agregar profesión?",
                    text: "Será agregada la profesión: " + vm.profesion.profesion,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e74c3c",
                    confirmButtonText: "¡Sí, agregar!",
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

                    return ProfesionService.create(vm.profesion, _onSave, _onError)

                })
            }
        }

    }
})();
