(function () {
    'use strict';

    angular.module('BlurAdmin.pages.consultas')
        .factory('ArchivosConsultaService', ArchivosConsultaService);

    /** @ngInject */
    function ArchivosConsultaService($resource) {
        var url = '/api/archivos_consulta/';
        return $resource(url + ':id/', {}, {
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params: { id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params: { id: '@id' } },
        }, { stripTrailingSlashes: false });
    }

}());
