(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoNotasCerrarController', CasoNotasCerrarController);

    /** @ngInject */
    function CasoNotasCerrarController(
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
            vm.loading = false

            vm.caso = item
            vm.sesiones = 0

            if (vm.caso.paciente.fecha_nacimiento)
                vm.edad = moment().diff(moment(vm.caso.paciente.fecha_nacimiento), 'years')

            vm.fecha = new Date()

            getSesiones()

        }

        function getSesiones() {
            CasoNotasService
                .list({ caso: vm.caso.id }, function(response) {
                    vm.sesiones = response.count
                }, function(error) {})
        }

        vm.save = function() {
            swal({
                title: "¿Cerrar el caso?",
                text: "Se cerrará el caso",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, cerrar!",
                cancelButtonText: "No, aún no",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function() {
                /////////////////////////////////////////////////
                //  FIX DE TECLA TABULADOR
                /////////////////////////////////////////////////
                window.onkeydown = null
                window.onfocus = null
                /////////////////////////////////////////////////

                var caso = {
                    id: vm.caso.id,
                    paciente: vm.caso.paciente.id,
                    colaborador: vm.caso.colaborador.id,
                    cerrado: true,
                    diagnostico: vm.caso.diagnostico || "---",
                    plan_terapeutico: vm.caso.plan_terapeutico || "---",
                    instrumentos: vm.caso.instrumentos || "---",
                    resultados: vm.caso.resultados || "---",
                    pronostico: vm.caso.pronostico || "---",
                    observaciones: vm.caso.observaciones || "---",
                    fecha_cierre: new Date(),
                }

                CasoService
                    .update(caso, function(response) {
                        vm.caso.cerrado = response.cerrado
                        vm.caso.fecha_cierre = response.fecha_cierre
                        swal("¡Éxito!", "El caso ha sido cerrado exitosamente.", "success")
                    }, function(error) {
                        swal("¡Error!", "Ocurrió un error al guardar. Por favor intenta más tarde.", "error")
                    })
            });
        }

        vm.abrirCaso = function() {
            swal({
                title: "¿Abrir el caso?",
                text: "Se volverá a aperturar el caso",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, abrir!",
                cancelButtonText: "No, aún no",
                closeOnConfirm: false,
                showLoaderOnConfirm: true
            }, function() {
                /////////////////////////////////////////////////
                //  FIX DE TECLA TABULADOR
                /////////////////////////////////////////////////
                window.onkeydown = null
                window.onfocus = null
                /////////////////////////////////////////////////

                var caso = {
                    id: vm.caso.id,
                    paciente: vm.caso.paciente.id,
                    colaborador: vm.caso.colaborador.id,
                    cerrado: false
                }

                CasoService
                    .update(caso, function(response) {
                        vm.caso.cerrado = response.cerrado
                        vm.fecha = new Date()
                        swal("¡Éxito!", "El caso ha sido abierto exitosamente.", "success")
                    }, function(error) {
                        swal("¡Error!", "Ocurrió un error al guardar. Por favor intenta más tarde.", "error")
                    })
            });
        }

    }
})();
