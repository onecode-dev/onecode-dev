(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoNotasCreateController', CasoNotasCreateController);

    /** @ngInject */
    function CasoNotasCreateController(
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
            vm.nota = {
                num_sesion: 1,
                caso: vm.caso.id,
                avance_terapeutico: "",
                comentario_paciente: "",
                eventos_relevantes: "",
                evolucion_fisica: "",
                evolucion_psicologica: "",
                notas: "",
                observaciones: "",
                tarea_anterior: "",
                tarea_proxima: "",
                vario: "",
            }
            vm.fecha = new Date()

            getPrevio()
        }

        function getPrevio() {
            vm.loading = true
            CasoNotasService
                .previo({ caso: vm.caso.id }, function(response) {
                    if (response.num_sesion)
                        vm.nota.num_sesion = +response.num_sesion + 1
                    vm.nota.tarea_anterior = response.tarea_proxima || ""

                    vm.loading = false
                }, function(error) {
                    vm.loading = false
                })
        }

        vm.save = function() {
            swal({
                title: "¿Nueva nota evolutiva?",
                text: "Se guardará una nueva nota evolutiva",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, guardar!",
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

                CasoNotasService
                    .create(vm.nota, function(response) {
                        swal("¡Éxito!", "La nota evolutiva fue creada exitosamente", "success")
                        return $scope.confirm(response)
                    }, function(error) {
                        swal("¡Error!", "Ocurrió un error al guardar. Por favor intenta más tarde.", "error")
                    })
            });
        }

    }
})();
