(function () {
    'use strict';

    angular.module('BlurAdmin.pages.profesiones')
        .factory('ProfesionService', ProfesionService);

    /** @ngInject */
    function ProfesionService($resource) {
        var url = '/api/profesiones/';
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
