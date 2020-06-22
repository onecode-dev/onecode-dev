(function () {
    'use strict';

    angular.module('BlurAdmin.pages.consultas')
        .controller('ArchivosConsultaController', ArchivosConsultaController);

    /** @ngInject */
    function ArchivosConsultaController(
        $scope,
        $rootScope,
        $window,
        $state,
        NotificationsService,
        ngDialog,
        Upload,
        ConsultaService,
        AuthService,
        ArchivosConsultaService
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading_item = false
            vm.loading = false
            vm.array = []

            vm.consulta = {}

            vm.pagination = {
                max_size: 10,
                total_items: 0,
                current_page: 1,
                search: "",
            }
            vm.archivo = null
            vm.query = {}

            getItem()
        }

        function getItem() {
            if (!$state.params.id)
                return $state.go('consultas')
            else {
                vm.loading = true
                ConsultaService
                    .get({ id: $state.params.id }, function(response) {
                        vm.consulta = response
                        vm.loading = false
                        vm.list()

                    }, function(error) {
                        return $state.go('consultas')
                    })
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
            return ArchivosConsultaService
                .list({
                    consulta: $state.params.id
                    // page: vm.pagination.current_page,
                    // search: vm.pagination.search,
                }, function(data) {
                    vm.pagination.total_items = data.count

                    _.forEach(data.results, function(item) {
                        var split = item.archivo.split("/")
                        item.name = split[split.length - 1]

                        var split_name = item.name.split(".")
                        if (split_name.length >= 2) {
                            var ext = split_name[split_name.length - 1]

                            if (ext == "doc" || ext == "docx") {
                                item.type = "document"
                                item.icon = "mdi mdi-file-word-box color-word"
                            }

                            else if (ext == "ppt" || ext == "pptx") {
                                item.type = "present"
                                item.icon = "mdi mdi-file-powerpoint-box color-present"
                            }

                            else if (ext == "jpg" || ext == "jpeg" || ext == "png" || ext == "gif" || ext == "svg") {
                                item.type = "image"
                                item.icon = "mdi mdi-file-image color-img"
                            }

                            else if (ext == "pdf") {
                                item.type = "pdf"
                                item.icon = "mdi mdi-file-pdf-box color-pdf"
                            }

                            else if (ext == "zip" || ext == "rar") {
                                item.type = "compressed"
                                item.icon = "mdi mdi-zip-box color-zip"
                            }

                            else if (ext == "txt") {
                                item.type = "text"
                                item.icon = "mdi mdi-file-document-box color-file"
                            }

                            else {
                                item.type = "file"
                                item.icon = "mdi mdi-file-outline color-file"
                            }

                        } else {
                            item.type = "file"
                            item.icon = "mdi mdi-file-outline color-file"
                        }
                    })

                    vm.array = data.results
                    vm.loading = false
                }, function(error) {
                    //console.log(error)
                })
        }
        // vm.list()

        //////////////////////////////////////////////////////////////////
        //  FILE HANDLER
        //////////////////////////////////////////////////////////////////
        var handleFileSelect = function(evt) {
            vm.archivo = evt.currentTarget.files[0];
            // console.log(vm.archivo)

            if (vm.archivo)
                vm.uploadFile()
            //angular.element(document.querySelector('#fileInput')).val("")
        };

        setTimeout(function() {
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
        }, 1000)
        //////////////////////////////////////////////////////////////////

        vm.uploadFile = function() {
            swal({
                title: "¿Adjuntar archivo?",
                text: "Será importado el archivo a la lista de archivos adjuntos de esta consulta",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#e74c3c",
                confirmButtonText: "¡Sí, adjuntar!",
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

                var data = {
                    consulta: vm.consulta.id,
                    archivo: vm.archivo
                }
                return Upload
                    .upload({
                        url: '/api/archivos_consulta/guardar_archivo/',
                        method: 'POST',
                        data: data
                    })
                    .then(function(response) {
                        vm.archivo = null
                        vm.list()
                        swal("¡Archivo importado!", "El archivo fue importado exitosamente.", "success")
                    })
                    .catch(function(error) {
                        vm.archivo = null
                        return _onError(error)
                    })
            });

        }

        vm.downloadFile = function(item) {
            var elem = document.createElement('a');
            elem.href = item.archivo;
            elem.download = item.name
            elem.click();
        }
        vm.viewFile = function(item) {
            if (item.type == "image") {
                vm.viewImg(item.archivo)
            } else {
                // vm.downloadFile(item)
                window.open(item.archivo, "_blank")
            }
        }

        vm.viewImg = function(img) {
            $rootScope.actual_user_foto = img
            return ngDialog.open({
                template: 'app/pages/users/templates/img.dialog.html',
                width: '90%'
            })
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
            swal("¡Éxito al eliminar!", "Archivo eliminado exitosamente", "success")
            return vm.list()
        }
        vm.delete = function (item) {
            swal({
                title: "¿Eliminar archivo?",
                text: "Se eliminará un archivo de esta consulta.",
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

                return ArchivosConsultaService.delete({ id: item.id }, _onDelete, _onError);
            });
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
