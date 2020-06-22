/**
 * @author v.lugovsky
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.pages', [
    'ui.router',

    'BlurAdmin.pages.routes',
    'BlurAdmin.pages.auth',
    'BlurAdmin.pages.dashboard',
    'BlurAdmin.pages.notifications',
    'BlurAdmin.pages.utils',
    'BlurAdmin.pages.loader',

    'BlurAdmin.pages.users',
    'BlurAdmin.pages.profesiones',
    'BlurAdmin.pages.pacientes',
    'BlurAdmin.pages.citas',
    'BlurAdmin.pages.casos',
    'BlurAdmin.pages.consultas',
    'BlurAdmin.pages.caja',
  ])
      .config(routeConfig)
      .config(function($provide){

        //  CONFIGURACION DEL TEXT EDITOR DE TRATAMIENTOS PARA MOSTRAR SOLO ALGUNOS ITEMS DEL MISMO
        $provide.decorator('taOptions', ['taRegisterTool', '$delegate', function(taRegisterTool, taOptions){

            taOptions.keyMappings = []
            taOptions.toolbar = [
                // ['undo', 'redo'],
                ['bold', 'italics', 'underline'],
                ['ul', 'ol'],
                ['justifyLeft', 'justifyCenter', 'justifyRight'],
                ['indent', 'outdent'],
            ];

            return taOptions;
        }]);
      });

  /** @ngInject */
  function routeConfig($urlRouterProvider, baSidebarServiceProvider) {
    $urlRouterProvider.otherwise('/citas');
  }

})();
