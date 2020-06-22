(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoNotasEditController', CasoNotasEditController);

    /** @ngInject */
    function CasoNotasEditController(
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

            vm.nota = _.clone(item)
            vm.caso = _.clone(item.caso)
            vm.nota.caso = _.clone(item.caso.id)

            // vm.caso = item
            // vm.nota = {
            //     caso: vm.caso.id,
            //     avance_terapeutico: "",
            //     comentario_paciente: "",
            //     eventos_relevantes: "",
            //     evolucion_fisica: "",
            //     evolucion_psicologica: "",
            //     notas: "",
            //     observaciones: "",
            //     tarea_anterior: "",
            //     tarea_proxima: "",
            //     vario: "",
            // }

            vm.fecha = vm.nota.fecha_creacion

            // getPrevio()

        }

        function getPrevio() {
            vm.loading = true
            CasoNotasService
                .previo({ caso: vm.caso.id, id: vm.nota.id }, function(response) {
                    vm.loading = false
                }, function(error) {
                    vm.loading = false
                })
        }

        vm.save = function() {
            swal({
                title: "¿Editar nota evolutiva?",
                text: "Se editará una nota evolutiva",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, editar!",
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
                    .update(vm.nota, function(response) {
                        swal("¡Éxito!", "La nota evolutiva fue editada exitosamente", "success")
                        return $scope.confirm(response)
                    }, function(error) {
                        swal("¡Error!", "Ocurrió un error al guardar. Por favor intenta más tarde.", "error")
                    })
            });
        }

    }
})();
