(function () {
    'use strict';

    angular.module('BlurAdmin.pages.auth')
        .controller('MeController', MeController);

    /** @ngInject */
    function MeController($scope, $rootScope, $window, $state, AuthService, NotificationsService) {
        var vm = this;

        activate();
        function activate() {
            // getMe()
        }

    }
})();
