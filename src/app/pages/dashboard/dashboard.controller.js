(function () {
    'use strict';

    angular.module('BlurAdmin.pages.dashboard')
        .controller('DashboardController', DashboardController);

    /** @ngInject */
    function DashboardController($scope, $rootScope, $location, $state, NotificationsService, TestService) {
        var vm = this;

        activate();
        function activate() {

        }

    }
})();
