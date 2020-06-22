(function () {
    'use strict';

    angular.module('BlurAdmin.pages.auth')
        .factory('AuthService', AuthService);

    /** @ngInject */
    function AuthService($http) {
        var me = function() {
            return $http.get('/api/perfiles/me/').then(function(response) { return response.data; });
        };
        //  LOGIN RECIBE COMO PARAMETRO LAS CREDENCIALES, CORREO Y SU PASSWORD
        var login = function(credentials) {
            return $http.post('/api/login/', credentials).then(function(response) { return response.data; });
        };

        var ADMIN = "100"
        var MEDICINA = "40"
        var PSICOLOGIA = "30"
        var SECRETARIA = "20"

        var hasPermission = function(user, rol) {
            var value = _.indexOf(user.roles, rol)
            if (value !== -1)
                return true
            return false
        }

        return {
            ADMIN: ADMIN,
            MEDICINA: MEDICINA,
            PSICOLOGIA: PSICOLOGIA,
            SECRETARIA: SECRETARIA,
            hasPermission: hasPermission,

            me: me,
            login: login,
        };

    }
})();
