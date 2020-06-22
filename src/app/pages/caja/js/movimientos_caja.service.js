(function () {
    'use strict';

    angular.module('BlurAdmin.pages.caja')
        .factory('MovimientosCajaService', MovimientosCajaService);

    /** @ngInject */
    function MovimientosCajaService($resource) {
        var url = '/api/movimientos_caja/';
        return $resource(url + ':id/', {}, {
            //list: { method: 'GET' },
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params: { id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT', params: { id: '@id' } },
            // delete: { method: 'DELETE', params: { id: '@id' } },
        },{ stripTrailingSlashes: false });
    }

}());
