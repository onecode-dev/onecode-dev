(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoEditController', CasoEditController);

    /** @ngInject */
    function CasoEditController(
        $scope,
        $rootScope,
        UsersService,
        PacienteService,
        WizardHandler,
        UtilsService,
        CitaService,
        AuthService,
        $state,
        Upload,
        CasoService,
        ngDialog
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading = false
            vm.disabled = false

            vm.departamentos = UtilsService.getDepartamentos()
            vm.religiones = UtilsService.getReligiones()

            vm.foto = null
            vm.genograma = null

            vm.panelPacienteOculto = true
            vm.panelMotivoOculto = false
            vm.panelHistoriaActualOculto = true
            vm.panelHistoriaClinicaOculto = true
            vm.panelHistoriaFamiliarOculto = true
            vm.panelExamenMentalOculto = true
            vm.panelFuentesSecundariasOculto = true
            vm.panelDiscernimientoDiagnosticoOculto = true
            vm.panelObjetivoTerapeuticoOculto = true
            vm.panelEvaluacionPronosticaOculto = true
            vm.panelPlanTerapeuticoOculto = true
            vm.panelGenogramaOculto = true

            setTimeout(function() {
                $('#motivo').focus()
            }, 250)


            //  CASO
            vm.caso = {
                motivo: "",

                //  SE DEBERÁ CONVERTIR A STRING PARA AHORRAR CAMPOS EN BD
                //  DEBIDO A LA GRAN CANTIDAD DE INFORMACIÓN A ALMACENAR
                notas: {}
            }
            vm.colaborador = {}

            //  PACIENTE GENERICO DE LA VISTA
            vm.paciente = {
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
                genero: "Femenino",

                tipos: [],
                contacto_referencia: "",
                telefono_referencia: "",
                religion: "",
                tipo_de_sangre: "",
                num_hermanos: 0,
                nivel_academico: "",
                ocupacion: "",
                lugar_nacimiento: "",
                fecha_nacimiento: "",
                nombres_padres: "",
                ocupacion_padres: "",
                info_padres: "",

                notas_psicologicas: {},
            }

            //  GRADOS ACADEMICOS
            vm.grados = UtilsService.getGrados()
            vm.paciente.nivel_academico = vm.grados[3]

            //  TIPOS DE SANGRE
            vm.tiposDeSangre = UtilsService.getBloodTypes()
            vm.paciente.tipo_de_sangre = vm.tiposDeSangre[0]

            //  SELECTS DE FECHA DE NACIMIENTO
            vm.anios = UtilsService.getYears()
            vm.meses = UtilsService.getMonths()
            vm.dias = UtilsService.getDays()
            vm.nacimiento = {
                dias: vm.dias[0],
                meses: vm.meses[0],
                anios: vm.anios[0]
            }

            getItem()
        }

        vm.listenUploaders = function() {
            setTimeout(function() {
                angular.element(document.querySelector('#imageInput')).on('change', handleFileSelect);
                angular.element(document.querySelector('#genogramInput')).on('change', handleFileSelectGenogram);
            }, 1000)
        }
        vm.listenUploaders()
        vm.showPanel = function(panel) {
            vm.listenUploaders()

            return !panel
        }

        function getItem() {
            vm.loading = true
            if (!$state.params.id)
                return $state.go('casos')
            else {
                CasoService
                    .get({ id: $state.params.id }, function(response) {
                        if (response.cerrado)
                            vm.disabled = true

                        vm.genograma = response.genograma

                        response.paciente.nivel_academico = _.find(vm.grados, { value: response.nivel_academico })
                        response.paciente.tipo_de_sangre = _.find(vm.tiposDeSangre, { value: response.tipo_de_sangre })

                        if (!response.paciente.nivel_academico)
                            response.paciente.nivel_academico = vm.grados[0]
                        if (!response.paciente.tipo_de_sangre)
                            response.paciente.tipo_de_sangre = vm.tiposDeSangre[0]

                        var nacimiento = new Date(response.paciente.fecha_nacimiento)
                        nacimiento.setMinutes(nacimiento.getMinutes() + nacimiento.getTimezoneOffset())
                        vm.nacimiento.anios = _.find(vm.anios, { id: nacimiento.getFullYear() })
                        vm.nacimiento.meses = _.find(vm.meses, { id: nacimiento.getMonth() })
                        vm.nacimiento.dias = _.find(vm.dias, { id: nacimiento.getDate() })

                        response.paciente.tipos = []

                        response.paciente.notas_psicologicas = JSON.parse(response.paciente.notas_psicologicas || "{}")

                        vm.paciente = response.paciente
                        vm.colaborador = response.colaborador

                        response.notas = JSON.parse(response.notas)
                        vm.caso = response

                        vm.loading = false
                    }, function(error) {
                        return $state.go('casos')
                    })
            }
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

        vm.getReligiones = function(val) {
            var results = _.filter(vm.religiones, function(item) {
                var field = cleanString(val).toLowerCase()
                var name = cleanString(item).toLowerCase()
                return name.indexOf(field) !== -1
            })
            return results
        }

        vm.viewImg = function(img) {
            $rootScope.actual_user_foto = img
            if (!img)
                $rootScope.actual_user_foto = vm.paciente.persona.foto
            return ngDialog.open({
                template: 'app/pages/users/templates/img.dialog.html',
                width: '90%'
            })
        }

        //////////////////////////////////////////////////////////////////
        //  FILE HANDLER
        //////////////////////////////////////////////////////////////////
        var handleFileSelect = function(evt) {
            vm.foto = evt.currentTarget.files[0];
            vm.paciente.persona.foto = evt.currentTarget.files[0];
            $scope.$apply()
            //angular.element(document.querySelector('#imageInput')).val("")
        };
        var handleFileSelectGenogram = function(evt) {
            vm.genograma = evt.currentTarget.files[0];
            // vm.caso.genograma = evt.currentTarget.files[0];
            $scope.$apply()
        };

        setTimeout(function() {
            angular.element(document.querySelector('#imageInput')).on('change', handleFileSelect);
        }, 1000)
        //////////////////////////////////////////////////////////////////

        function _validate() {
            var title = "¡Campos incompletos!"
            var msg = "Verifica que todos los campos obligatorios estén completados."
            var error = false

            if (!vm.paciente.persona.persona) {
                title = "Persona sin nombre"
                msg = "La persona no tiene asignado un nombre. Por favor completa ese campo."
                error = true
            }
            else if (!vm.caso.motivo) {
                title = "Motivo de la consulta"
                msg = "No fue asignado un motivo a la consulta. Por favor completa ese campo."
                error = true
            }

            if (error) {
                swal(title, msg, 'error')
            }
            return !error
            // if (vm.form.$valid) {
            //     return true

            // } else {
            //     //  SI EL FORM NO ESTÁ VALIDADO RETORNA LOS CAMPOS SUCIOS
            //     vm.form.persona.$dirty = true;

            //     return false
            // }
        }

        function _onError(error) {
            var msg = "Ocurrió un error al realizar la petición. Por favor intenta más tarde."
            if (error.data.detail) {
                msg = error.data.detail.toString()
            }

            return swal("¡Error!", msg, "error")
        }
        function _guardarCaso(response) {
            vm.caso.paciente = vm.paciente.id
            // vm.caso.colaborador = $rootScope.user.id
            vm.caso.colaborador = vm.colaborador.id
            vm.caso.notas = JSON.stringify(vm.caso.notas)

            if (vm.caso.genograma)
                delete vm.caso.genograma
            else
                vm.caso.genograma = null

            CasoService
                .update(vm.caso, function(response) {
                    // swal("¡Éxito!", "El caso fue editado exitosamente.", "success")
                    // return $state.go('casos')

                    Upload
                        .upload({
                            url: '/api/casos/genograma/',
                            method: 'POST',
                            data: {
                                id: response.id,
                                genograma: vm.genograma
                            }
                        })
                        .then(function(response_img) {
                            swal("¡Éxito!", "El caso fue editado exitosamente.", "success")
                            // return $state.go('casos')
                            return $state.go('casos_notas', { id: response.id })
                        })
                        .catch(function(error_img) {
                            swal("¡Éxito!", "El caso fue editado exitosamente.", "success")
                            // return $state.go('casos')
                            return $state.go('casos_notas', { id: response.id })
                        })

                }, function(error) {
                    swal("¡Error!", "El caso no pudo ser editado. Por favor, intenta más tarde.", "error")
                    return $state.go('casos')
                })
        }
        function _onSave(response) {
            var data = {
                id: vm.paciente.id,
                foto: vm.foto
            }
            return Upload
                .upload({
                    url: '/api/pacientes/guardar_foto/',
                    method: 'POST',
                    data: data
                })
                .then(function(response) {
                    return _guardarCaso(response)
                    // swal("¡Éxito!", "El paciente fue editado exitosamente.", "success")
                    // return $state.go('casos')
                })
                .catch(function(response) {
                    return _guardarCaso(response)
                    // swal("¡Éxito!", "El paciente fue editado exitosamente.", "success")
                    // return $state.go('casos')
                })
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Editar caso?",
                    text: "Será editado el caso del paciente: " + vm.paciente.persona.persona,
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

                    var paciente = _.clone(vm.paciente)

                    var fecha_nacimiento = new Date(
                        vm.nacimiento.anios.id,
                        vm.nacimiento.meses.id,
                        vm.nacimiento.dias.id
                    )
                    paciente.fecha_nacimiento = (fecha_nacimiento.getFullYear()).toString() + "-" +
                        (fecha_nacimiento.getMonth() + 1).toString() + "-" +
                        (fecha_nacimiento.getDate()).toString()

                    if (paciente.persona.departamento)
                        paciente.persona.departamento = paciente.persona.departamento.name || paciente.persona.departamento
                    else
                        paciente.persona.departamento = ""

                    paciente.tipo_de_sangre = paciente.tipo_de_sangre.value
                    paciente.num_hermanos = paciente.num_hermanos || 0
                    paciente.nivel_academico = paciente.nivel_academico.value

                    //  BORRANDO FOTO, NO VA EN EL RESPONSE
                    delete paciente.persona.foto

                    paciente.notas_psicologicas = JSON.stringify(paciente.notas_psicologicas)

                    return PacienteService.update(paciente, _onSave, _onError)
                })
            }
        }

    }
})();
