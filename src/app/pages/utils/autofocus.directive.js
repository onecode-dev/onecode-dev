(function() {
    'use strict'

    angular
        .module('BlurAdmin.pages.utils')
        .directive('autofocus', autofocus);

    //autofocus.$inject = ['$timeout'];
    function autofocus ($timeout) {
        return {
            restrict: 'A',
            link : function($scope, $element) {
                $timeout(function() {
                    $element[0].focus();
                });
            }
        }
    };
})();
