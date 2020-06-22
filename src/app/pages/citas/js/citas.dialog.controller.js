(function () {
    'use strict';

    angular.module('BlurAdmin.pages.citas')
        .controller('CitasDialogController', CitasDialogController);

    /** @ngInject */
    function CitasDialogController(
        $scope,
        $rootScope,
        UsersService,
        PacienteService,
        WizardHandler,
        UtilsService,
        CitaService,
        AuthService,
        colaborador,
        paciente
    ) {
        var vm = this;

        activate();
        function activate() {


            ///////////////////////////////////////////
            //  GRID DE PACIENTES
            ///////////////////////////////////////////
            vm.loading = false
            vm.colaboradores = []
            vm.colaborador = null
            vm.pagination = {
                max_size: 10,
                total_items: 0,
                current_page: 1,
                search: ""
            }
            //  SI SE MANDO UN COLABORADOR, ES PORQUE ESTÁ EN LA VISTA DE COLABORADORES
            if (colaborador)
                vm.colaborador = colaborador
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  GRID DE PACIENTES
            ///////////////////////////////////////////
            vm.loadingPac = true
            vm.pacientes = []
            vm.paciente = {}
            resetPaciente()
            vm.paginationPac = {
                max_size: 10,
                total_items: 0,
                current_page: 1,
                search: ""
            }
            //  SI SE MANDO UN PACIENTE, ES PORQUE ESTÁ EN LA VISTA DE PACIENTES
            if (paciente)
                vm.paciente = paciente
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  SELECTS DE FECHA
            ///////////////////////////////////////////
            // vm.anios = UtilsService.getYears()
            var actualYear = (new Date()).getFullYear()
            vm.anios = [
                { id: actualYear, value: actualYear },
                { id: (actualYear + 1), value: (actualYear + 1) }
            ]
            vm.meses = UtilsService.getMonths()
            vm.dias = UtilsService.getDays()
            vm.horas = UtilsService.getHours()
            vm.minutos = UtilsService.getMinutes()
            vm.fechaCita = null
            vm.descripcion = ""
            //  SETEAR UNA HORA DESPUÉS DE LA ACTUAL Y UN DÍA DESPUES DEL ACTUAL
            var now = new Date()
            now.setDate(now.getDate() + 1)
            vm.fecha = {
                anios: _.find(vm.anios, { id: now.getFullYear() }),
                meses: _.find(vm.meses, { id: now.getMonth() }),
                dias: _.find(vm.dias, { id: now.getDate() }),
                hora: _.find(vm.horas, { id: 9 }),
                minuto: vm.minutos[0]
            }
            ///////////////////////////////////////////


        }


        ///////////////////////////////////////////
        //  GRID DE COLABORADORES
        ///////////////////////////////////////////
        vm.page_changed = function() {
            return vm.listColaboradores()
        }
        vm.search = function() {
            vm.pagination.current_page = 1
            vm.listColaboradores()
        }
        vm.listColaboradores = function() {
            vm.loading = true
            return UsersService
                .list({
                    page: vm.pagination.current_page,
                    search: vm.pagination.search,
                    roles: (AuthService.PSICOLOGIA + "," + AuthService.MEDICINA)
                }, function(data) {
                    vm.pagination.total_items = data.count
                    vm.colaboradores = data.results
                    vm.loading = false
                }, function(error) {
                    vm.loading = false
                    //console.log(error)
                })
        }
        vm.listColaboradores()
        vm.seleccionarColaborador = function(colaborador) {
            vm.colaborador = colaborador
        }
        ///////////////////////////////////////////


        ///////////////////////////////////////////
        //  GRID DE PACIENTES
        ///////////////////////////////////////////
        function resetPaciente() {
            //  PACIENTE GENERICO DE LA VISTA
            vm.paciente = {
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
                    foto: null
                },
                genero: "",

                tipos: [],
                contacto_referencia: "",
                telefono_referencia: "",
                religion: "",
                tipo_de_sangre: "---",
                num_hermanos: 0,
                nivel_academico: "Educación Media Superior",
                ocupacion: "",
                lugar_nacimiento: "",
                fecha_nacimiento: null,
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
        }
        vm.resetPaciente = resetPaciente
        vm.page_changed_pac = function() {
            return vm.listPacientes()
        }
        vm.searchPac = function() {
            vm.paginationPac.current_page = 1
            vm.listPacientes()
        }
        vm.listPacientes = function() {
            vm.loadingPac = true
            return PacienteService
                .list({
                    page: vm.paginationPac.current_page,
                    search: vm.paginationPac.search
                }, function(data) {
                    vm.paginationPac.total_items = data.count
                    vm.pacientes = data.results
                    vm.loadingPac = false
                }, function(error) {
                    //console.log(error)
                })
        }
        vm.listPacientes()
        vm.seleccionarPaciente = function(paciente) {
            if (paciente)
                vm.paciente = paciente
        }
        ///////////////////////////////////////////


        ///////////////////////////////////////////
        //  GRID DE CITAS
        ///////////////////////////////////////////
        function validate() {
            var title = "¡Error!"
            var msg = "Ocurrió un error, por favor intenta más tarde."
            var error = false

            //  COMPROBAR QUE NO SE ESTÁ SETEANDO UNA FECHA MENOR A LA ACTUAL
            var now = new Date()
            vm.fechaCita = new Date(
                vm.fecha.anios.id,
                vm.fecha.meses.id,
                vm.fecha.dias.id,
                vm.fecha.hora.id,
                vm.fecha.minuto.id
            )
            if (vm.fechaCita <= now) {
                title = "Fecha no admitida"
                msg = "La fecha debe ser mayor a la fecha actual"
                error = true
            }

            if (error) {
                swal(title, msg, 'error')
            }
            return !error
        }
        function guardarPaciente() {
            vm.paciente.notas_medicas = JSON.stringify(vm.paciente.notas_medicas)
            vm.paciente.notas_psicologicas = JSON.stringify(vm.paciente.notas_psicologicas)

            PacienteService
                .create(vm.paciente, function(response) {
                    vm.paciente.id = response.id
                    return guardarCita()
                }, function(error) {
                    swal(
                        "¡Error!",
                        "Ocurrió un error al reservar la cita. Por favor intenta más tarde.",
                        "error"
                    )
                    return $scope.closeThisDialog(error)
                })
        }
        function guardarCita() {
            var cita = {
                colaborador: vm.colaborador.id,
                paciente: vm.paciente.id,
                fecha_cita: vm.fechaCita,
                descripcion: vm.descripcion
            }
            CitaService
                .create(cita, function(response) {
                    swal(
                        "¡Éxito!",
                        "La cita fué reservada exitosamente.",
                        "success"
                    )
                    return $scope.confirm(response)

                }, function(error) {
                    swal(
                        "¡Error!",
                        "Ocurrió un error al reservar la cita. Por favor intenta más tarde.",
                        "error"
                    )
                    return $scope.closeThisDialog(error)
                })
        }
        vm.save = function() {
            if (validate()) {
                swal({
                    title: "¿Reservar cita?",
                    text: "Será registrada una cita para el paciente: " + vm.paciente.persona.persona,
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#e74c3c",
                    confirmButtonText: "¡Sí, reservar!",
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

                    if (vm.paciente.id) {
                        //  HACER SOLAMENTE EL POST DE CITAS
                        return guardarCita()
                    } else {
                        //  HACER ANTES UN POST DE CREAR PACIENTE Y LUEGO HACER EL POST DE CITAS
                        return guardarPaciente()
                    }

                })
            }
        }
        ///////////////////////////////////////////


    }
})();
