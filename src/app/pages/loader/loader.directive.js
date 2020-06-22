(function() {
    'use strict';

    angular.module('BlurAdmin.pages.loader')
    .directive('miLoader', miLoader)

    //miLoader.$inject = ['$rootScope'];
    function miLoader ($rootScope) {
        return {
            restrict: "EA",
            transclude: true,
            templateUrl: 'app/pages/loader/loader.html'
        };
    };
})();
