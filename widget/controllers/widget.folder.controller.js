'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginWidget')
        .controller('WidgetFolderCtrl', ['$scope', '$timeout', 'DEFAULT_DATA', 'COLLECTIONS', 'DB', 'Buildfire',
            '$rootScope', 'ViewStack',
            function ($scope, $timeout, DEFAULT_DATA, COLLECTIONS, DB, Buildfire, $rootScope, ViewStack) {
                console.log('WidgetFolderCtrl Controller Loaded-------------------------------------');
                var WidgetHome = this;

                WidgetHome.noCarouselBody = true;

                var vs = ViewStack.getCurrentView();
                console.log('vs>>>>', vs);
                if (vs) {
                    console.log('got folder', vs.info);
                    var tempInfo = angular.copy(vs.info);
                    var currentFolder = tempInfo.data.content.entity[vs.folderIndex];
                    tempInfo.data.content.entity = currentFolder.items;
                    WidgetHome.info = tempInfo;
                }
            }]);
})(window.angular);