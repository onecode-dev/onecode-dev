(function () {
    'use strict';

    angular.module('BlurAdmin.pages.auth')
        .controller('LogoutController', LoginController);

    /** @ngInject */
    function LoginController($scope, $rootScope, $window, $state) {
        var vm = this;

        activate();
        function activate() {

        }
        vm.logout = function() {
            swal({
                title: "¿Cerrar sesión?",
                text: "Estás a punto de cerrar sesión",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, cerrar sesión!",
                cancelButtonText: "No, aún no",
                closeOnConfirm: true,
                //showLoaderOnConfirm: true
            }, function() {
                /////////////////////////////////////////////////
                //  FIX DE TECLA TABULADOR
                /////////////////////////////////////////////////
                window.onkeydown = null
                window.onfocus = null
                /////////////////////////////////////////////////
                $window.localStorage.removeItem('token');
                $rootScope.user = null
                $state.go('login')
            })
        }

    }
})();
