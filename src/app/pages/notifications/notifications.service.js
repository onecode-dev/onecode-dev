(function () {
    'use strict';

    angular.module('BlurAdmin.pages.notifications')
        .factory('NotificationsService', NotificationsService);

    /** @ngInject */
    function NotificationsService(toastr, toastrConfig) {
        var openedToasts = [];
        var defaultConfig = angular.copy(toastrConfig);
        var types = ['success', 'error', 'info', 'warning'];
        var SUCCESS = 'success'
        var ERROR = 'error'
        var INFO = "info"
        var WARNING = "warning"

        /*
        $scope.$on('$destroy', function iVeBeenDismissed() {
            angular.extend(toastrConfig, defaultConfig);
        })
        */

        var insert_toast = function (options) {
            angular.extend(toastrConfig, options);
            openedToasts.push(toastr[options.type](options.msg, options.title));
        }

        var default_options = {
            autoDismiss: false,
            positionClass: 'toast-top-right',
            type: 'info',
            timeOut: '5000',
            extendedTimeOut: '2000',
            allowHtml: true,
            closeButton: true,
            tapToDismiss: true,
            progressBar: true,
            newestOnTop: false,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false,
            title: "",
            msg: ""
        };

        //
        var default_toast = function (title, msg, type) {
            if (!title || !type)
                return false
            //  DEFINE DE TYPE MESSAGE, TITLE AND MESSAGE
            default_options.title = "<strong>" + title + "</strong>"
            default_options.msg = msg
            default_options.type = type
            return insert_toast(default_options)
        };

        var custom_toast = function (options) {
            if (!options)
                return false
            return insert_toast(options)
        };

        return {
            SUCCESS: SUCCESS,
            ERROR: ERROR,
            INFO: INFO,
            WARNING: WARNING,
            types: types,
            default_toast: default_toast,
            custom_toast: custom_toast
        }

        /*
        //  EXAMPLE OF QUOTES
        $scope.quotes = [
          {
            title: 'Come to Freenode',
            message: 'We rock at <em>#angularjs</em>',
            options: {
              allowHtml: true
            }
          },
          {
            title: 'Looking for bootstrap?',
            message: 'Try ui-bootstrap out!'
          },
          {
            title: 'Wants a better router?',
            message: 'We have you covered with ui-router'
          },
          {
            title: 'Angular 2',
            message: 'Is gonna rock the world'
          },
          {
            title: null,
            message: 'Titles are not always needed'
          },
          {
            title: null,
            message: 'Toastr rock!'
          },
          {
            title: 'What about nice html?',
            message: '<strong>Sure you <em>can!</em></strong>',
            options: {
              allowHtml: true
            }
          },
          {
            title: 'Ionic is <em>cool</em>',
            message: 'Best mobile framework ever',
            options: {
              allowHtml: true
            }
          }
        ];
        //  EXAMPLE OF OPTIONS
        $scope.options = {
            autoDismiss: false,
            positionClass: 'toast-top-right',
            type: 'info',
            timeOut: '5000',
            extendedTimeOut: '2000',
            allowHtml: false,
            closeButton: false,
            tapToDismiss: true,
            progressBar: false,
            newestOnTop: true,
            maxOpened: 0,
            preventDuplicates: false,
            preventOpenDuplicates: false,
            title: "Some title here",
            msg: "Type your message here"
        };
        */

    }
})();
