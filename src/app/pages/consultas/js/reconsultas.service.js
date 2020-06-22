(function () {
    'use strict';

    angular.module('BlurAdmin.pages.consultas')
        .factory('ReconsultaService', ReconsultaService);

    /** @ngInject */
    function ReconsultaService($resource) {
        var url = '/api/reconsultas/';
        return $resource(url + ':id/', {}, {
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params: { id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params: { id: '@id' } },
        }, { stripTrailingSlashes: false });
    }

}());
