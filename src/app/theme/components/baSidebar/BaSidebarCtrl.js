/**
 * @author v.lugovksy
 * created on 16.12.2015
 */
(function () {
  'use strict';

  angular.module('BlurAdmin.theme.components')
    .controller('BaSidebarCtrl', BaSidebarCtrl);

  /** @ngInject */
  function BaSidebarCtrl($scope, $rootScope, baSidebarService, AuthService) {

    activate()

    function activate() {
        if (!$rootScope.user)
            getMe()
    }

    function getMe() {
        AuthService
            .me()
            .then(function(response) {
                //  INFORMACIÓN DE LA PERSONA
                $rootScope.user = response

                if (response.persona) {
                    $rootScope.user.persona.name = response.persona.persona.split(" ")[0]

                    if (response.persona.persona.split(" ")[1])
                        $rootScope.user.persona.name += " " + response.persona.persona.split(" ")[1]
                }

                //  LINK DE LA FOTO DEL USUARIO
                $rootScope.user_img = null
                if (response.persona)
                    $rootScope.user_img = response.persona.foto


                // $scope.menuItems = baSidebarService.getMenuItems();
                // $scope.defaultSidebarState = $scope.menuItems[0].stateRef;

                var Items = baSidebarService.getMenuItems();
                var menuItems = []

                _.forEach(Items, function(item) {
                    var founded = false
                    _.forEach($rootScope.user.roles, function(rol) {
                        if (_.indexOf(item.permissions, rol) !== -1) {
                            founded = true
                            return false
                        }
                    })

                    if (founded)
                        menuItems.push(item)
                })

                if (menuItems.length) {
                    $rootScope.menuItems = menuItems
                    $rootScope.defaultSidebarState = menuItems[0].stateRef;
                } else {
                    //  DESLOGUEAR AL USUARIO SI NO TIENE ACCESO A NINGUNA VISTA
                }

                $rootScope.hoverItem = function ($event) {
                    $rootScope.showHoverElem = true;
                    $rootScope.hoverElemHeight =  $event.currentTarget.clientHeight;
                    var menuTopValue = 66;
                    $rootScope.hoverElemTop = $event.currentTarget.getBoundingClientRect().top - menuTopValue;
                };


            })
            .catch(function(error) {

            })
    }



    $scope.$on('$stateChangeSuccess', function () {
      if (baSidebarService.canSidebarBeHidden()) {
        baSidebarService.setMenuCollapsed(true);
      }
    });
  }
})();
