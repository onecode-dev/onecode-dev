(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UserEditController', UserEditController);

    /** @ngInject */
    function UserEditController(
        $scope,
        $rootScope,
        $window,
        $state,
        AuthService,
        NotificationsService,
        UsersService,
        UtilsService,
        $http,
        Upload,
        ngDialog
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading = false

            vm.departamentos = UtilsService.getDepartamentos()

            //  ROLES
            vm.roles = UtilsService.getRoles()

            //  PERFIL GENERICO DE LA VISTA
            vm.perfil = {
                user: {
                    username: ""
                },
                persona: {
                    persona: "",
                    apellido_casada: "",
                    cui: "",
                    telefono: "",
                    celular: "",
                    nacionalidad: "",
                    departamento: "",
                    direccion: "",
                    correo: "",
                    foto: ""
                },
                profesion: "",
                colegiado: "",
                roles: []
            }

            _get()
        }

        function _get() {
            vm.loading = true
            if (!$state.params.id)
                if ($state.current.name == "users_profile") {
                    $rootScope.user = null
                    return $state.go('citas')
                } else
                    return $state.go('users')
            else {
                return UsersService
                    .get({ id: $state.params.id }, function(response) {
                        var perfil = response

                        if (perfil.persona.persona) {
                            vm.departamento = _.find(vm.departamentos, { name: perfil.persona.departamento })

                            if (!vm.departamento)
                                vm.departamento = perfil.persona.departamento
                        }

                        //  BUSCAR CUALES SON LOS ROLES QUE TIENE EL USUARIO
                        var roles = []
                        perfil.roles.forEach(function(item) {
                            roles.push(_.find(vm.roles, { value: item }))
                        })
                        perfil.roles = roles

                        vm.perfil = perfil
                        vm.perfil.colegiado = parseInt(perfil.colegiado)
                        vm.loading = false

                    }, function(error) {
                        vm.loading = false
                        if ($state.current.name == "users_profile") {
                            $rootScope.user = null
                            return $state.go('citas')
                        } else
                            return $state.go('users')
                    })
            }
        }

        vm.onChange = function(files){
            if(files[0] == undefined) return;

            $scope.fileExt = files[0].name.split(".").pop();

            if($scope.fileExt.match(/^(jpg|jpeg|gif|png)$/))
            {
                $scope.isImage = true;
            }
            else
            {
                $scope.isImage = false;
            }

        }

        vm.viewImg = function() {
            $rootScope.actual_user_foto = vm.perfil.persona.foto
            return ngDialog.open({
                template: 'app/pages/users/templates/img.dialog.html',
                width: '90%'
                //controller: 'ProfesionCreateController',
                //controllerAs: 'ctrl'
            })
        }

        function cleanString(string) {
            var str = string.toString()
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        }

        vm.getDepartamentos = function(val) {
            var results = _.filter(vm.departamentos, function(item) {
                var field = cleanString(val).toLowerCase()
                var name = cleanString(item.name).toLowerCase()
                return name.indexOf(field) !== -1
            })
            return results
        }

        vm.getProfesiones = function(item) {
            var json = {
                params: {
                    search: item
                }
            }

            return $http
                .get('/api/profesiones/', json)
                .then(function(response) {
                    return response.data
                })
                .then(function(data) {
                    return data.results
                })
                .catch(function(error) {})
        }

        vm.validate_password = function() {
            if (vm.perfil.password == vm.perfil.password_confirm)
                vm.password_confirm = true
            else
                vm.password_confirm = false
        }

        //////////////////////////////////////////////////////////////////
        //  FILE HANDLER
        //////////////////////////////////////////////////////////////////
        var handleFileSelect = function(evt) {
            var file = evt.currentTarget.files[0];
            vm.perfil.persona.foto = file;
            $scope.$apply()
            //angular.element(document.querySelector('#imageInput')).val("")
        };

        setTimeout(function() {
            angular.element(document.querySelector('#imageInput')).on('change', handleFileSelect);
        }, 1000)
        //////////////////////////////////////////////////////////////////

        function _validate() {
            if (vm.form.$valid) {
                return true

            } else {
                //  SI EL FORM NO ESTÁ VALIDADO RETORNA LOS CAMPOS SUCIOS
                vm.form.persona.$dirty = true;
                vm.form.email.$dirty = true;
                vm.form.roles.$dirty = true;

                return false
            }
        }
        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.details) {
                msg = error.data.details.toString()
            }

            return swal("¡Error!", msg, "error")
        }
        function _onSave(response) {
            swal("¡Éxito!", vm.msg, "success")
            if ($state.current.name == "users_profile") {
                $rootScope.user = null
                return $state.go('citas')
            } else
                return $state.go('users')
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Editar información?",
                    text: "Será editada la información del colaborador",
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

                    var roles = []
                    vm.perfil.roles.forEach(function(rol) {
                        roles.push(rol.value)
                    })

                    var profesion = vm.perfil.profesion
                    if (!profesion)
                        profesion = ""
                    else
                        profesion = profesion.id

                    var perfil = {
                        id: vm.perfil.id,

                        //  INFORMACIÓN DEL USUARIO
                        username: vm.perfil.persona.correo,
                        //password: vm.perfil.password_confirm,

                        //  INFORMACIÓN PERSONA
                        persona: vm.perfil.persona.persona || "",
                        apellido_casada: vm.perfil.persona.apellido_casada || "",
                        telefono: vm.perfil.persona.telefono || "",
                        celular: vm.perfil.persona.celular || "",
                        nacionalidad: vm.perfil.persona.nacionalidad || "",
                        //departamento: vm.departamento.name || vm.departamento,
                        direccion: vm.perfil.persona.direccion || "",
                        foto: vm.perfil.persona.foto,

                        //  INFORMACIÓN DEL PERFIL
                        roles: JSON.stringify(roles),
                        profesion: profesion,
                        colegiado: vm.perfil.colegiado || ""
                    }

                    if (vm.departamento) {
                        perfil.departamento = vm.departamento.name || vm.departamento
                    }

                    vm.msg = "Información del colaborador editada exitosamente"

                    return Upload
                        .upload({
                            url: '/api/perfiles/' + perfil.id + "/",
                            method: 'PUT',
                            data: perfil
                        })
                        .then(_onSave)
                        .catch(_onError)

                    //return UsersService.update({ id: vm.perfil.id }, fd, _onSave, _onError)

                })
            }
        }

        //  FORM PASSWORD
        function _validate_password() {
            if (vm.form_password.$valid && vm.password_confirm) {
                return true

            } else {
                //  SI EL FORM NO ESTÁ VALIDADO RETORNA LOS CAMPOS SUCIOS
                vm.form_password.password.$dirty = true;
                vm.form_password.password_confirm.$dirty = true;

                return false
            }
        }

        vm.restore_password = function() {
            if (_validate_password()) {
                swal({
                    title: "¿Restablecer contraseña?",
                    text: "Se restablecerá la contraseña del colaborador: " + vm.perfil.persona.persona,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e74c3c",
                    confirmButtonText: "¡Sí, restablecer!",
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

                    var json = {
                        id: vm.perfil.id,
                        password: vm.perfil.password_confirm
                    }

                    vm.msg = "Contraseña restablecida exitosamente"
                    return UsersService.restore(json, _onSave, _onError)

                })
            }
        }

    }
})();
