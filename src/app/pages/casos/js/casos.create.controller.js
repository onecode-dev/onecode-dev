(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .controller('CasoCreateController', CasoCreateController);

    /** @ngInject */
    function CasoCreateController(
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

            //  CASO
            vm.caso = {
                motivo: "",

                //  SE DEBERÁ CONVERTIR A STRING PARA AHORRAR CAMPOS EN BD
                //  DEBIDO A LA GRAN CANTIDAD DE INFORMACIÓN A ALMACENAR
                notas: {
                    historia_actual: {
                        fecha_inicio_duracion_evento: "",
                        factores_precipitantes: "",
                        impacto_enfermedad: "",
                    },
                    examen_mental: {
                        apariencia: "",
                        actitud: "",
                        conducta: "",
                        lenguaje: "",
                        curso_contenido_pensamiento: "",
                        percepcion: "",
                        humor: "",
                        afecto: "",
                        inteligencia: "",
                        orientacion: "",
                        memoria: "",
                        control_impulsos: "",
                        capacidad_juicio_critico: "",
                        capacidad_insight: "",
                        confiabilidad: "",
                    },
                    fuentes_secundarias: {
                        informes_medicos: "",
                        test_psicometricos_informe_resultados: "",
                        test_proyectivos_interpretacion_resultados: "",
                    },
                    discernimiento_diag: {
                        criterios_diagnostico: "",
                        diagnostico_semiologico: "",
                        diagnostico_psicodinamico: "",
                    },
                    objetivo_terapeutico: {
                        corto_plazo: "",
                        mediano_plazo: "",
                        largo_plazo: "",
                    }
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
                angular.element(document.querySelector('#genogramInput')).on('change', handleFileSelectGenogram);
            }, 1000)
        }
        vm.listenUploaders()
        vm.showPanel = function(panel) {
            vm.listenUploaders()

            return !panel
        }

        function getPaciente() {
            if (!$state.params.id) {
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

                    setTimeout(function() {
                        $('#motivo').focus()
                    }, 50)

                    response.nivel_academico = _.find(vm.grados, { value: response.nivel_academico })
                    response.tipo_de_sangre = _.find(vm.tiposDeSangre, { value: response.tipo_de_sangre })

                    var nacimiento = new Date(response.fecha_nacimiento)
                    nacimiento.setMinutes(nacimiento.getMinutes() + nacimiento.getTimezoneOffset())
                    vm.nacimiento.anios = _.find(vm.anios, { id: nacimiento.getFullYear() })
                    vm.nacimiento.meses = _.find(vm.meses, { id: nacimiento.getMonth() })
                    vm.nacimiento.dias = _.find(vm.dias, { id: nacimiento.getDate() })

                    response.tipos = []

                    response.notas_psicologicas = JSON.parse(response.notas_psicologicas)
                    response.notas_medicas = JSON.parse(response.notas_medicas)

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
        var handleFileSelectGenogram = function(evt) {
            vm.genograma = evt.currentTarget.files[0];
            // vm.caso.genograma = evt.currentTarget.files[0];
            $scope.$apply()
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
            vm.caso.colaborador = $rootScope.user.id
            vm.caso.notas = JSON.stringify(vm.caso.notas)

            CasoService
                .create(vm.caso, function(response) {

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
                            swal("¡Éxito!", "El caso fue registrado exitosamente.", "success")
                            // return $state.go('casos')
                            return $state.go('casos_notas', { id: response.id })
                        })
                        .catch(function(error_img) {
                            swal("¡Éxito!", "El caso fue registrado exitosamente.", "success")
                            // return $state.go('casos')
                            return $state.go('casos_notas', { id: response.id })
                        })

                }, function(error) {
                    swal("¡Error!", "El caso no pudo ser registrado. Por favor, intenta más tarde.", "error")
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
                    title: "¿Registrar caso?",
                    text: "Será registrado un nuevo caso para el paciente: " + vm.paciente.persona.persona,
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

                    paciente.notas_psicologicas = JSON.stringify(paciente.notas_psicologicas)
                    paciente.notas_medicas = JSON.stringify(paciente.notas_medicas)

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
