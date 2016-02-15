(function (angular, buildfire) {
    "use strict";
    //created soundCloudDesign module
    angular
        .module('advancedFolderPluginDesign',
        [
            'ngAnimate',
            'ui.bootstrap',
            'advancedFolderPluginDesignServices',
            'advancedFolderPluginDesignEnums'

        ])
        //injected ui.bootstrap for angular bootstrap component
        .config(['$httpProvider', function ($httpProvider) {
            console.log('AppConfig loaded--------------------------------------------------in Design');
            var interceptor = ['$q', function ($q) {
                var counter = 0;

                return {

                    request: function (config) {
                        buildfire.spinner.show();
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

        }]);
})
(window.angular, window.buildfire);
