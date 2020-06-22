(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pacientes')
        .controller('PacienteDialogController', PacienteDialogController);

    /** @ngInject */
    function PacienteDialogController(
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
        item,
        create
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.paciente = item
        }

        vm.create = function() {
            $scope.closeThisDialog()
            return create(vm.paciente)
        }

    }
})();
