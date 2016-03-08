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
                    tempInfo.data.content.entity = vs.folderItems;
                    WidgetHome.info = tempInfo;
                    console.log('folder deep info',WidgetHome.info);
                }

                WidgetHome.goToFolder = function (plugin) {
                    ViewStack.push({
                        template: "folder",
                        folderItems: plugin.items,
                        info: WidgetHome.info});
                };

                WidgetHome.cropImage = function (url, settings) {
                    var options = {};
                    if (!url) {
                        return "";
                    }
                    else {
                        if (settings.height) {
                            options.height = settings.height;
                        }
                        if (settings.width) {
                            options.width = settings.width;
                        }
                        return buildfire.imageLib.cropImage(url, options);
                    }
                };

                WidgetHome.navigateToPlugin = function (plugin) {

                    buildfire.navigation.navigateTo({
                        pluginId: plugin.pluginTypeId,
                        instanceId: plugin.instanceId,
                        title: plugin.title,
                        folderName: plugin.pluginType.folderName
                    });
                };
            }]);
})(window.angular);