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
            'ngTouch',
            'angularLazyImg'
        ])
        //injected ngRoute for routing
        //injected ui.bootstrap for angular bootstrap component
        .config(['$httpProvider','$compileProvider','lazyImgConfigProvider', function ($httpProvider,$compileProvider,lazyImgConfigProvider) {

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

            var scrollable = document.querySelector('#scrolledDiv');
            lazyImgConfigProvider.setOptions({
                offset: 100, // how early you want to load image (default = 100)
                errorClass: 'error', // in case of loading image failure what class should be added (default = null)
                successClass: 'success', // in case of loading image success what class should be added (default = null)
                onError: function(image){}, // function fired on loading error
                onSuccess: function(image){}, // function fired on loading success
                container: angular.element(scrollable) // if scrollable container is not $window then provide it here
            });

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
