(function (angular, buildfire) {
    "use strict";
    //created soundCloudWidget module
    angular
        .module('advancedFolderPluginWidget',
        [
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'advancedFolderWidgetEnums',
            'advancedFolderPluginWidgetFilters',
            'advancedFolderWidgetServices',
            'infinite-scroll',
            'ngTouch'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        .config(['$httpProvider','$compileProvider', function ($httpProvider,$compileProvider) {

            /**
             * To make href urls safe on mobile
             */
            $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|cdvfile|file):/);


            var interceptor = ['$q', function ($q) {
                var counter = 0;

                return {

                    request: function (config) {
                        buildfire.spinner.show();
                        //NProgress.start();

                        counter++;
                        return config;
                    },
                    response: function (response) {
                        counter--;
                        if (counter === 0) {

                            buildfire.spinner.hide();
                        }
                        return response;
                    },
                    responseError: function (rejection) {
                        counter--;
                        if (counter === 0) {

                            buildfire.spinner.hide();
                        }

                        return $q.reject(rejection);
                    }
                };
            }];
            $httpProvider.interceptors.push(interceptor);

        }])
        .run(['ViewStack', function (ViewStack) {
            buildfire.navigation.onBackButtonClick = function () {
                if (ViewStack.hasViews()) {
                    ViewStack.pop();
                } else {
                    buildfire.navigation._goBackOne();
                }
            };
        }])
})
(window.angular, window.buildfire);
