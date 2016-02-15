(function (angular, buildfire) {
    "use strict";
    //created soundCloudWidget module
    angular
        .module('soundCloudPluginWidget',
        [
            'ngAnimate',
            'ngRoute',
            'ui.bootstrap',
            'soundCloudWidgetEnums',
            'soundCloudPluginWidgetFilters',
            'soundCloudWidgetServices',
            'infinite-scroll',
            'soundCloudModals',
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
        .run(['$location', '$rootScope','$timeout', function ($location, $rootScope,$timeout) {
            buildfire.navigation.onBackButtonClick = function () {
                if($rootScope.playTrack){
                    $timeout(function () {
                        $rootScope.playTrack=false;
                        $rootScope.$broadcast("destroy currentTrack");
                    }, 100);
                    if($rootScope.$$phase){$rootScope.$digest();}
                }
                else{
                    buildfire.navigation.navigateHome();
                }
            };

        }]);
})
(window.angular, window.buildfire);
