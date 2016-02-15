(function (angular, buildfire) {
    "use strict";
    //created mediaCenterWidget module
    angular
        .module('soundCloudPluginWidgetFilters', [])
        .filter('resizeImage', [function () {
            return function (url, width, height, type) {
                return buildfire.imageLib.resizeImage(url, {
                    width: width,
                    height: height
                });
            };
        }])
        .filter('cropImage', [function () {
            return function (url, width, height, type) {
                return buildfire.imageLib.cropImage(url, {
                    width: width,
                    height: height
                });
            };
        }])
        .filter('safeHtml', ['$sce', function ($sce) {
            return function (html) {
                if (html) {
                    return $sce.trustAsHtml(html);
                }
                else {
                    return "";
                }
            };
        }])
        .filter('millisecondsToDateTime', [function() {
            return function(milliseconds) {
                var seconds = milliseconds / 1000;
                return new Date(1970, 0, 1).setSeconds(seconds);
            };
        }])
        .filter('secondsToDateTime', [function() {
            return function(seconds) {
                return new Date(1970, 0, 1).setSeconds(seconds);
            };
        }]);
})(window.angular,window.buildfire);