(function () {
    'use strict';

    angular.module('BlurAdmin.pages.consultas')
        .controller('ConsultaCreateController', ConsultaCreateController);

    /** @ngInject */
    function ConsultaCreateController(
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
        ConsultaService,
        ngDialog
    ) {
        var vm = this;

        activate();
        function activate() {
            vm.loading = false

            vm.departamentos = UtilsService.getDepartamentos()
            vm.religiones = UtilsService.getReligiones()

            vm.foto = null
            vm.genograma = null

            vm.panelPacienteOculto = true
            vm.panelMotivoOculto = false
            vm.panelAntecedentesOculto = true
            vm.panelExamenFisicoOculto = true
            vm.panelPlanDiagnosticoOculto = true
            vm.panelImpresionClinicaOculto = true
            vm.panelTratamientoOculto = false

            setTimeout(function() {
                $('#motivo').focus()
            }, 250)

            //  CONSULTA
            vm.consulta = {
                motivo: "",

                //  SE DEBERÁ CONVERTIR A STRING PARA AHORRAR CAMPOS EN BD
                //  DEBIDO A LA GRAN CANTIDAD DE INFORMACIÓN A ALMACENAR
                notas: {
                    historia: "",
                    examen_fisico: "",
                    plan_diagnostico: "",
                    impresion_clinica: "",
                    tratamiento: ""
                }
            }

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

                notas_medicas: {
                    notas: {
                        antecedentes: {
                            medicos: "",
                            quirurgicos: "",
                            traumaticos: "",
                            alergicos: "",
                            vicios: "",
                            pediatricos: "",
                            familiares: "",
                            ginecologicos: {
                                fur: "",
                                gestas: "",
                                partos: "",
                                abortos: "",
                                pf: ""
                            }
                        }
                    }
                },
                notas_psicologicas: {
                    historia_clinica: {
                        historia_prenatal: "",
                        desarrollo_psicomotriz: "",
                        desenvolvimiento_escolar: "",
                        adolescencia: "",
                        historia_psico_sexual: "",
                        vida_social: "",
                        historia_medica: "",
                        trastornos_familiares: "",
                        otros: ""
                    },
                    historia_familiar: ""
                }
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

            getPaciente()
        }

        vm.listenUploaders = function() {
            setTimeout(function() {
                angular.element(document.querySelector('#imageInput')).on('change', handleFileSelect);
            }, 1000)
        }
        vm.listenUploaders()
        vm.showPanel = function(panel) {
            vm.listenUploaders()

            return !panel
        }

        function getPaciente() {
            if (!$state.params.id) {
                // return $state.go('pacientes')
                vm.panelPacienteOculto = false
                vm.panelMotivoOculto = true
                setTimeout(function() {
                    $('#persona').focus()
                    $(document).ready(function(){
                        $(this).scrollTop(0);
                    });
                }, 50)

            } else {
                vm.loading = true
                PacienteService.get({ id: $state.params.id }, function(response) {
                    response.nivel_academico = _.find(vm.grados, { value: response.nivel_academico })
                    response.tipo_de_sangre = _.find(vm.tiposDeSangre, { value: response.tipo_de_sangre })

                    var nacimiento = new Date(response.fecha_nacimiento)
                    nacimiento.setMinutes(nacimiento.getMinutes() + nacimiento.getTimezoneOffset())
                    vm.nacimiento.anios = _.find(vm.anios, { id: nacimiento.getFullYear() })
                    vm.nacimiento.meses = _.find(vm.meses, { id: nacimiento.getMonth() })
                    vm.nacimiento.dias = _.find(vm.dias, { id: nacimiento.getDate() })

                    response.tipos = []

                    response.notas_medicas = JSON.parse(response.notas_medicas)
                    response.notas_psicologicas = JSON.parse(response.notas_psicologicas)

                    vm.paciente = response
                    vm.loading = false
                }, function(error) {
                    return $state.go('pacientes')
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

        // setTimeout(function() {
        //     angular.element(document.querySelector('#imageInput')).on('change', handleFileSelect);
        // }, 1000)
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
            else if (!vm.consulta.motivo) {
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
        function _guardarConsulta(response) {
            var consulta = _.clone(vm.consulta)

            consulta.paciente = vm.paciente.id
            consulta.colaborador = $rootScope.user.id
            consulta.notas = JSON.stringify(consulta.notas)

            ConsultaService
                .create(consulta, function(response) {
                    swal("¡Éxito!", "La consulta fue registrada exitosamente.", "success")
                    return $state.go('consultas')

                }, function(error) {
                    swal("¡Error!", "La consulta no pudo ser registrada. Por favor, intenta más tarde.", "error")
                    return $state.go('pacientes')
                })
        }
        function _onSave(response) {
            vm.paciente.id = response.id
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
                    return _guardarConsulta(response)
                })
                .catch(function(response) {
                    return _guardarConsulta(response)
                })
        }
        vm.save = function() {
            if (_validate()) {
                swal({
                    title: "¿Registrar consulta?",
                    text: "Será registrada una nueva consulta para el paciente: " + vm.paciente.persona.persona,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e74c3c",
                    confirmButtonText: "¡Sí, registrar!",
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

                    paciente.notas_medicas = JSON.stringify(paciente.notas_medicas) || ""
                    paciente.notas_psicologicas = JSON.stringify(paciente.notas_psicologicas) || ""

                    //  BORRANDO FOTO, NO VA EN EL RESPONSE
                    delete paciente.persona.foto

                    if (paciente.id)
                        return PacienteService.update(paciente, _onSave, _onError)
                    else
                        return PacienteService.create(paciente, _onSave, _onError)
                })
            }
        }

    }
})();
