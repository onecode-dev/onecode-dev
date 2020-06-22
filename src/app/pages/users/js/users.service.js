(function () {
    'use strict';

    angular.module('BlurAdmin.pages.users')
        .factory('UsersService', UsersService);

    /** @ngInject */
    function UsersService($resource) {
        var url = '/api/perfiles/';
        return $resource(url + ':id/', {}, {
            //list: { method: 'GET' },
            list: { method: 'GET', params: { query: '@query'} },
            get: { method: 'GET', params:{ id: '@id' } },
            create: { method: 'POST' },
            update: { method: 'PUT', params: { id: '@id' } },
            restore: { url: url + 'restore/', method: 'PUT', params: { id: '@id' } },
            delete: { method: 'DELETE', params:{ id: '@id' } },
        },{ stripTrailingSlashes: false });
    }

}());

/*
(function() {
    'use strict';
    angular
        .module('BlurAdmin.pages.users')
        .factory('UsersServiceHttp', UsersServiceHttp);

    //UsersServiceHttp.$inject = ['$http'];
    function UsersServiceHttp ($http) {
        var url_api_vale = '/api/perfiles/'
        //  RECIBE UN PARÁMETRO DE TIPO FILE IMG PARA MANDARLA EN EL POST A BACKEND
        var post_img = function(img, idvale) {
            var fd = new FormData();
            fd.append('idvale', idvale);
            fd.append('img', img);
            return $http.post('/api/img/vale', fd, {
                transformRequest: angular.identity,
                headers: { 'Content-Type': undefined }
            }).then(function(response) { return response; });
        };

        return {
            post_img: post_img,
            //borrarImg: borrarImg
        };
    };
})();
*/
