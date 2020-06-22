(function () {
    'use strict';

    angular.module('BlurAdmin.pages.casos')
        .factory('CasoService', CasoService);

    /** @ngInject */
    function CasoService($resource) {
        var url = '/api/casos/';
        return $resource(url + ':id/', {}, {
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params: { id: '@id' } },
            create: { method: 'POST' },
            status: { method: 'POST', url: url + 'status/' },
            update: { method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params: { id: '@id' } },
        }, { stripTrailingSlashes: false });
    }

}());
