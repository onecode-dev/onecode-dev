(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoNotasDetailsController', CasoNotasDetailsController);

    /** @ngInject */
    function CasoNotasDetailsController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        CasoService,
        AuthService,
        CasoNotasService,
        item
    ) {
        var vm = this;

        activate();
        function activate() {

            vm.nota = item

        }

    }
})();
