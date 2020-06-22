
// To run this code, edit file index.html or index.jade and change
// html data-ng-app attribute from angle to myAppName
// ----------------------------------------------------------------------

(function() {
    'use strict';

    angular
        .module('BlurAdmin.pages.auth')
        .factory('authInterceptor', authInterceptor);

    authInterceptor.$inject = ['$q', '$location', '$window'];
    function authInterceptor($q, $location, $window) {
      return {
          request: function (config) {
              config.headers = config.headers || {};
              if ($window.localStorage.getItem('token')) {
                  config.headers.Authorization = 'Token ' + $window.localStorage.getItem('token');
              }
              return config || $q.when(config);
          },
          responseError: function (response) {
              if (response.status === 401 || response.status === 403) {
                  $window.localStorage.removeItem('token');
                  $location.path('/login');
              }
              return $q.reject(response);
          }
      };
    }
})();
