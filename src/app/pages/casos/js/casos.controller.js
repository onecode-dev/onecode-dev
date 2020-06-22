(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoController', CasoController);

    /** @ngInject */
    function CasoController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        CasoService,
        AuthService
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading = false
            vm.array = []

            vm.pagination = {
                max_size: 10,
                total_items: 0,
                current_page: 1,
                search: "",
            }

            vm.query = {
                cerrado: null
            }

        }

        vm.page_changed = function() {
            return vm.list()
        }

        vm.search = function() {
            vm.pagination.current_page = 1
            vm.list()
        }

        vm.list = function() {
            vm.loading = true
            return CasoService
                .list({
                    page: vm.pagination.current_page,
                    search: vm.pagination.search,
                    cerrado: vm.query.cerrado
                }, function(data) {
                    vm.pagination.total_items = data.count
                    vm.array = data.results
                    vm.loading = false
                }, function(error) {
                    //console.log(error)
                })
        }
        vm.list()

        vm.viewImg = function(img) {
            $rootScope.actual_user_foto = img
            return ngDialog.open({
                template: 'app/pages/users/templates/img.dialog.html',
                width: '90%'
            })
        }

        vm.goToUrl = function(url) {
            window.open(url.toString(), "_blank")
        }

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            vm.loading = false
            return swal("¡Error!", msg, "error")
        }
        function _onDelete(response) {
            swal("¡Éxito al eliminar!", "Caso eliminado exitosamente", "success")
            return vm.list()
        }
        vm.delete = function (item) {
            swal({
                title: "¿Eliminar el caso?",
                text: "Se eliminará el caso",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, eliminar!",
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

                return CasoService.delete({ id: item.id }, _onDelete, _onError);
            });
        }

        vm.status = function(item, value) {

            return ngDialog.openConfirm
                ({
                    template: 'app/pages/casos/templates/casos.cerrar.html',
                    width: '80%',
                    controller: 'CasoNotasCerrarController',
                    controllerAs: 'ctrl',
                    closeByDocument: true,
                    closeByEscape: true,
                    resolve: {
                        item: function() {
                            return item
                        },
                    }
                })
                .then(function(data) {
                    return vm.list()
                })
                .catch(function(error) {
                    return vm.list()
                })

            // var title = ""
            // var msg = ""

            // if (value) {
            //     title = "¿Cerrar caso?"
            //     msg = "Se cerrará el caso."
            // }
            // else {
            //     title = "¿Abrir caso?"
            //     msg = "Se abrirá el caso."
            // }

            // swal({
            //     title: title,
            //     text: msg,
            //     type: "warning",
            //     showCancelButton: true,
            //     confirmButtonColor: "#e74c3c",
            //     confirmButtonText: "¡Sí!",
            //     cancelButtonText: "No, aún no",
            //     closeOnConfirm: false,
            //     showLoaderOnConfirm: true
            // }, function() {
            //     /////////////////////////////////////////////////
            //     //  FIX DE TECLA TABULADOR
            //     /////////////////////////////////////////////////
            //     window.onkeydown = null
            //     window.onfocus = null
            //     /////////////////////////////////////////////////

            //     return CasoService
            //         .status({ id: item.id }, function(response) {
            //             if (value) {
            //                 title = "Cerrado"
            //                 msg = "El caso fue cerrado."
            //             } else {
            //                 title = "Abierto"
            //                 msg = "El caso fue nuevamente abierto."
            //             }

            //             swal(title, msg, "success")
            //             return vm.list()

            //         }, function(error) {
            //             swal("¡Error!", "Ocurrió un error. Por favor intente más tarde", "error")
            //             return vm.list()

            //         });
            // })

        }

        // vm.details = function(item) {
        //     return ngDialog.open({
        //         template: 'app/pages/citas/templates/citas.dialog.details.html',
        //         width: '80%',
        //         controller: 'CitaDetailsDialogController',
        //         controllerAs: 'ctrl',
        //         closeByDocument: true,
        //         closeByEscape: true,
        //         resolve: {
        //             item: function() {
        //                 return item
        //             },
        //         }
        //     })
        // }


    }
})();
