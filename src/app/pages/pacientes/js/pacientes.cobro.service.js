(function () {
    'use strict';

    angular.module('BlurAdmin.pages.pacientes')
        .factory('CobrosPacienteService', CobrosPacienteService);

    /** @ngInject */
    function CobrosPacienteService($resource) {
        var url = '/api/cobros_paciente/';
        return $resource(url + ':id/', {}, {
            //list: { method: 'GET' },
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params: { id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params: { id: '@id' } },
        },{ stripTrailingSlashes: false });
    }

}());
