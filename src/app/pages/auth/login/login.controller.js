(function () {
    'use strict';

    angular.module('BlurAdmin.pages.auth')
        .controller('LoginController', LoginController);

    /** @ngInject */
    function LoginController($scope, $rootScope, $window, $state, AuthService, NotificationsService) {
        var vm = this;

        activate();
        function activate() {
            vm.account = {}
            vm.loading = false
            $rootScope.user = null
            $rootScope.utils_template = $state.current.templateUrl
            $rootScope.utils_app = true
            $window.localStorage.removeItem('token')
        }
        function deactivate() {
            $rootScope.utils_template = null
            $rootScope.utils_app = null
        }

        vm.logout = function() {
            $window.localStorage.removeItem('token');
            $state.go('login')
        }

        var login_validate = function() {
            if (!vm.account.username || !vm.account.password) {
                var title = "Campos vacíos o incorrectos"
                var msg = "Por favor, llena los campos correctamente."
                NotificationsService.default_toast(title, msg, NotificationsService.ERROR)
                return false
            }
            return true
        }
        function onError(error) {
            var title = "Error en la autenticación"
            var msg = "Usuario y/o contraseña inválidos"
            NotificationsService.default_toast(title, msg, NotificationsService.ERROR)
            vm.loading = false
            vm.logout()
            return false
        }
        vm.login = function() {
            //  DESACTIVA EL BOTÓN MIENTRAS ESTÁ CARGANDO LA AUTENTICACIÓN
            //  PARA EVITAR QUE EL USUARIO MANDE MÁS DE UNA PETICIÓN
            //  MIENTRAS SE ESTÁ PROCESANDO UNA PETICIÓN EN BACKEND
            vm.loading = true

            if (login_validate()) {
                return AuthService
                    .login({ username: (vm.account.username || ""), password: (vm.account.password || "") })
                    .then(function(data) {
                        //  IR A DASHBOARD Y GUARDAR EL TOKEN EN LA SESSION STORAGE
                        deactivate()
                        $window.localStorage.setItem('token', data.token);
                        //return $state.go('dashboard')
                        var title = "Bienvenido/a"
                        //var msg = "Usuario y/o contraseña inválidos"
                        NotificationsService.default_toast(title, '', NotificationsService.SUCCESS)

                        return AuthService
                            .me()
                            .then(function(response) {
                                if (!response.eliminado)
                                    return $state.go('citas')
                                else
                                    return onError(null)
                            })
                            .catch(onError)

                    })
                    .catch(onError)
            } else {
                vm.loading = false
                vm.logout()
                return false
            }
        }


    }
})();
