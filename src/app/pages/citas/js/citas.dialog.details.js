(function () {
    'use strict';

    angular.module('BlurAdmin.pages.citas')
        .controller('CitaDetailsDialogController', CitaDetailsDialogController);

    /** @ngInject */
    function CitaDetailsDialogController(
        $scope,
        $rootScope,
        $window,
        $state,
        AuthService,
        NotificationsService,
        PacienteService,
        UtilsService,
        $http,
        Upload,
        ngDialog,
        item
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.cita = item
        }

    }
})();
