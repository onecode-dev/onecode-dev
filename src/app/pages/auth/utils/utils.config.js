(function() {
    'use strict';

    angular
        .module('BlurAdmin.pages.auth')
        .config(authConfig);

    authConfig.$inject = ['$httpProvider'];
    function authConfig($httpProvider){
        $httpProvider.interceptors.push('authInterceptor');
    }

})();
