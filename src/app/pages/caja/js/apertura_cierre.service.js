(function () {
    'use strict';

    angular.module('BlurAdmin.pages.caja')
        .factory('AperturaCierreService', AperturaCierreService);

    /** @ngInject */
    function AperturaCierreService($resource) {
        var url = '/api/aperturas_cierres_caja/';
        return $resource(url + ':id/', {}, {
            //list: { method: 'GET' },
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params: { id: '@id' } },
            ingresos_egresos: { url: url + "ingresos_egresos/", method: 'GET', params: { id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT', params: { id: '@id' } },
            // delete: { method: 'DELETE', params: { id: '@id' } },
        },{ stripTrailingSlashes: false });
    }

}());
