(function () {
    'use strict';

    angular.module('BlurAdmin.pages.citas')
        .factory('CitaService', CitaService);

    /** @ngInject */
    function CitaService($resource) {
        var url = '/api/citas/';
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
