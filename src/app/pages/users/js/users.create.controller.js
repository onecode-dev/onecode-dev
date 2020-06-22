(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .controller('UserCreateController', UserCreateController);

    /** @ngInject */
    function UserCreateController(
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

            vm.departamentos = UtilsService.getDepartamentos()

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
                    nacionalidad: "Guatemalteco",
                    departamento: "",
                    direccion: "",
                    correo: "",
                    foto: ""
                },
                profesion: "",
                colegiado: "",
                roles: [],

                password: "",
                password_confirm: ""
            }

            //  BANDERA VALIDADORA DEL PASSWORD
            vm.password_confirm = false

            //  ROLES
            vm.roles = UtilsService.getRoles()

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

        vm.viewImg = function() {
            $rootScope.actual_user_foto = vm.perfil.persona.foto
            return ngDialog.open({
                template: 'app/pages/users/templates/img.dialog.html',
                width: '90%'
                //controller: 'ProfesionCreateController',
                //controllerAs: 'ctrl'
            })
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
            if (vm.form.$valid && vm.password_confirm) {
                return true

            } else {
                //  SI EL FORM NO ESTÁ VALIDADO RETORNA LOS CAMPOS SUCIOS
                vm.form.persona.$dirty = true;
                vm.form.email.$dirty = true;
                vm.form.roles.$dirty = true;
                vm.form.password.$dirty = true;
                vm.form.password_confirm.$dirty = true;

                /*
                swal(
                    "¡!",
                    "Por favor verifica que todos los campos estén completados correctamente",
                    "error"
                )
                */

                return false
            }
        }

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            return swal("¡Error!", msg, "error")
        }
        function _onSave(response) {
            swal("¡Éxito!", "El colaborador fue agregado exitosamente.", "success")
            return $state.go('users')
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Agregar colaborador?",
                    text: "Será agregado el colaborador: " + vm.perfil.persona.persona,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e74c3c",
                    confirmButtonText: "¡Sí, agregar!",
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

                    var perfil = {
                        //  INFORMACIÓN DEL USUARIO
                        username: vm.perfil.persona.correo,
                        password: vm.perfil.password_confirm,

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
                        profesion: vm.perfil.profesion.id,
                        colegiado: vm.perfil.colegiado || ""
                    }

                    if (vm.departamento) {
                        perfil.departamento = vm.departamento.name || vm.departamento
                    }

                    return Upload
                        .upload({
                            url: '/api/perfiles/',
                            method: 'POST',
                            data: perfil
                        })
                        .then(_onSave)
                        .catch(_onError)

                    //return UsersService.create(perfil, _onSave, _onError)

                })
            }
        }

    }
})();
