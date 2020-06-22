(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .factory('CasoNotasService', CasoNotasService);

    /** @ngInject */
    function CasoNotasService($resource) {
        var url = '/api/notas_evolutivas/';
        return $resource(url + ':id/', {}, {
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params: { id: '@id' } },
            previo: { url: url + 'previo/', method: 'GET' },
            create: { method: 'POST' },
            update: { method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params: { id: '@id' } },
        }, { stripTrailingSlashes: false });
    }

}());
