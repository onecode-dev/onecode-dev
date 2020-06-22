/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
    'use strict';

    var $urlRouterProviderRef = null;
    var $stateProviderRef = null;

    var ADMIN = "100"
    var MEDICINA = "40"
    var PSICOLOGIA = "30"
    var SECRETARIA = "20"

    angular
        .module('BlurAdmin.pages.routes', [])
        .config(routeConfig)
        .run(runConfig);

    /** @ngInject */
    function routeConfig($locationProvider, $urlRouterProvider, $stateProvider) {
        $urlRouterProviderRef = $urlRouterProvider;
        $locationProvider.html5Mode(false);
        $stateProviderRef = $stateProvider;

        $stateProvider
            ///////////////////////////////////////////
            //  AUTH
            ///////////////////////////////////////////
            .state('login', {
                url: '/login',
                templateUrl: 'app/pages/auth/login/login.html',
            })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  DASHBOARD
            ///////////////////////////////////////////
            // .state('dashboard', {
            //     url: '/dashboard',
            //     templateUrl: 'app/pages/dashboard/templates/dashboard.html',
            //     title: 'Dashboard',
            //     sidebarMeta: {
            //         icon: 'fa fa-dashboard fa-lg',
            //         order: 0,
            //     },
            //     permissions: [ ADMIN, MEDICINA, PSICOLOGIA, SECRETARIA ]
            // })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  CITAS
            ///////////////////////////////////////////
            .state('citas', {
                url: '/citas',
                templateUrl: 'app/pages/citas/templates/citas.html',
                title: 'Citas',
                sidebarMeta: {
                    icon: 'fa fa-clock-o fa-lg',
                    order: 0,
                },
                permissions: [ ADMIN, MEDICINA, PSICOLOGIA, SECRETARIA ]
            })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  PACIENTES
            ///////////////////////////////////////////
            .state('pacientes', {
                url: '/pacientes',
                templateUrl: 'app/pages/pacientes/templates/pacientes.html',
                title: 'Pacientes',
                sidebarMeta: {
                    icon: 'ion-android-contacts f24',
                    order: 0,
                },
                permissions: [ ADMIN, MEDICINA, PSICOLOGIA, SECRETARIA ]
            })
            .state('pacientes_create', {
                url: '/pacientes/nuevo',
                templateUrl: 'app/pages/pacientes/templates/pacientes.create.html',
                title: 'Agregar paciente'
            })
            .state('pacientes_edit', {
                url: '/pacientes/editar/:id',
                templateUrl: 'app/pages/pacientes/templates/pacientes.edit.html',
                title: 'Editar paciente'
            })
            .state('cobros_paciente', {
                url: '/pacientes/cobros/:id',
                templateUrl: 'app/pages/pacientes/templates/cobros.html',
                title: 'Abonos y cobros del paciente',
                permissions: [ ADMIN, SECRETARIA, MEDICINA, PSICOLOGIA ]
            })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  CASOS -> SOLO PSICOLOGÍA
            ///////////////////////////////////////////
            .state('casos', {
                url: '/casos',
                templateUrl: 'app/pages/casos/templates/casos.html',
                title: 'Casos',
                sidebarMeta: {
                    icon: 'fa fa-lg fa-file-text',
                    order: 0,
                },
                permissions: [ PSICOLOGIA ]
            })
            .state('casos_notas', {
                url: '/casos/notas/:id',
                templateUrl: 'app/pages/casos/templates/casos.notas.html',
                title: 'Notas evolutivas',
                permissions: [ PSICOLOGIA ]
            })
            .state('casos_create', {
                url: '/casos/nuevo/:id',
                templateUrl: 'app/pages/casos/templates/casos.create.html',
                title: 'Nuevo caso',
                permissions: [ PSICOLOGIA ]
            })
            .state('casos_edit', {
                url: '/casos/editar/:id',
                templateUrl: 'app/pages/casos/templates/casos.edit.html',
                title: 'Información del caso',
                permissions: [ PSICOLOGIA ]
            })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  CONSULTAS -> SOLO MEDICINA
            ///////////////////////////////////////////
            .state('consultas', {
                url: '/consultas',
                templateUrl: 'app/pages/consultas/templates/consultas.html',
                title: 'Consultas',
                sidebarMeta: {
                    icon: 'fa fa-lg fa-user-md',
                    order: 0,
                },
                permissions: [ MEDICINA ]
            })
            .state('consultas_create', {
                url: '/consultas/nuevo/:id',
                templateUrl: 'app/pages/consultas/templates/consultas.create.html',
                title: 'Nueva consulta',
                permissions: [ MEDICINA ]
            })
            .state('consultas_edit', {
                url: '/consultas/editar/:id',
                templateUrl: 'app/pages/consultas/templates/consultas.edit.html',
                title: 'Información de la consulta',
                permissions: [ MEDICINA ]
            })
            //  RECONSULTAS
            .state('reconsultas', {
                url: '/reconsultas/:id',
                templateUrl: 'app/pages/consultas/templates/reconsultas.html',
                title: 'Reconsultas',
                permissions: [ MEDICINA ]
            })
            .state('reconsultas_create', {
                url: '/reconsultas/nuevo/:id',
                templateUrl: 'app/pages/consultas/templates/reconsultas.create.html',
                title: 'Nueva reconsulta',
                permissions: [ MEDICINA ]
            })
            .state('reconsultas_edit', {
                url: '/reconsultas/editar/:id',
                templateUrl: 'app/pages/consultas/templates/reconsultas.edit.html',
                title: 'Información de la reconsulta',
                permissions: [ MEDICINA ]
            })
            //  VISTA DE ARCHIVOS
            .state('archivos_consulta', {
                url: '/consultas/archivos/:id',
                templateUrl: 'app/pages/consultas/templates/archivos.consulta.html',
                title: 'Archivos adjuntos',
                permissions: [ MEDICINA ]
            })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  CAJA
            ///////////////////////////////////////////
            .state('caja', {
                url: '/caja',
                templateUrl: 'app/pages/caja/templates/caja.html',
                title: 'Caja',
                sidebarMeta: {
                    icon: 'fa fa-archive fa-lg',
                    order: 0,
                },
                permissions: [ ADMIN, SECRETARIA ]
            })
            .state('movimientos_caja', {
                url: '/caja/movimientos_caja/:id',
                templateUrl: 'app/pages/caja/templates/movimientos_caja.html',
                title: 'Movimientos de caja',
                permissions: [ ADMIN, SECRETARIA ]
            })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  COLABORADORES
            ///////////////////////////////////////////
            .state('users', {
                url: '/users',
                templateUrl: 'app/pages/users/templates/users.html',
                title: 'Colaboradores',
                sidebarMeta: {
                    icon: 'fa fa-group fa-lg',
                    order: 0,
                },
                permissions: [ ADMIN ]
            })
            .state('users_create', {
                url: '/users/new',
                templateUrl: 'app/pages/users/templates/users.create.html',
                title: 'Agregar colaborador',
                permissions: [ ADMIN ]
            })
            .state('users_edit', {
                url: '/users/edit/:id',
                templateUrl: 'app/pages/users/templates/users.edit.html',
                title: 'Editar colaborador',
                permissions: [ ADMIN ]
            })
            .state('users_profile', {
                url: '/users/profile/:id',
                templateUrl: 'app/pages/users/templates/users.profile.html',
                title: 'Editar perfil',
                permissions: [ ADMIN, MEDICINA, PSICOLOGIA, SECRETARIA ]
            })
            ///////////////////////////////////////////


            ///////////////////////////////////////////
            //  PROFESIONES
            ///////////////////////////////////////////
            .state('profesiones', {
                url: '/profesiones',
                templateUrl: 'app/pages/profesiones/templates/profesiones.html',
                title: 'Profesiones',
                access: 'admin',
                sidebarMeta: {
                    icon: 'fa fa-university fa-lg',
                    order: 0,
                },
                permissions: [ ADMIN ]
            })
            ///////////////////////////////////////////


    }

    function runConfig($q, $rootScope, $state, $http, AuthService, $window) {
        $rootScope.$on('$stateChangeStart', function(event, selectedState) {
            var token = $window.localStorage.getItem('token')
            if (token != null){
                AuthService
                    .me()
                    .then(function (data) {

                        $rootScope.esPsicologo = false
                        $rootScope.esMedico = false
                        $rootScope.esSecretaria = false
                        $rootScope.esAdmin = false

                        //  SETEAR PERMISOS GLOBALES PARA SABER EL NIVEL DE AUTORIZACIÓN QUE TIENE EL USUARIO LOGUEADO
                        if (AuthService.hasPermission(data, AuthService.PSICOLOGIA))
                            $rootScope.esPsicologo = true
                        if (AuthService.hasPermission(data, AuthService.MEDICINA))
                            $rootScope.esMedico = true
                        if (AuthService.hasPermission(data, AuthService.SECRETARIA))
                            $rootScope.esSecretaria = true
                        if (AuthService.hasPermission(data, AuthService.ADMIN))
                            $rootScope.esAdmin = true

                        var user = data
                        var permitted = false
                        if(selectedState.permissions){
                            _.forEach(selectedState.permissions, function (permission) {
                                if (_.indexOf(user.roles, permission) !== -1) {
                                    permitted = true
                                    return false
                                }
                            })
                        } else {
                            permitted = true
                        }

                        if (!permitted) {
                            event.preventDefault()
                            $state.go('login')
                        }
                    })
            }
        });
    }

  })();
