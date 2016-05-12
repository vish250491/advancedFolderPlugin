'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginWidget')
        .controller('WidgetFolderCtrl', ['$scope', '$timeout', 'DEFAULT_DATA', 'COLLECTIONS', 'DB', 'Buildfire',
            '$rootScope', 'ViewStack','LocalStorage',
            function ($scope, $timeout, DEFAULT_DATA, COLLECTIONS, DB, Buildfire, $rootScope, ViewStack ,LocalStorage) {
                console.log('WidgetFolderCtrl Controller Loaded-------------------------------------');
                var WidgetHome = this;

                WidgetHome.noCarouselBody = true;

                var vs = ViewStack.getCurrentView();
                console.log('vs>>>>', vs);
                if (vs) {
                    console.log('got folder', vs.info);
                    var tempInfo = angular.copy(vs.info);
                    tempInfo.data.content.entity = vs.folderItems;


                        if(tempInfo.data.design.itemListLayout=="list-layout12"){

                                preparePluginsData(tempInfo.data.content.entity);

                                WidgetHome.info = tempInfo;


                        }else{
                            WidgetHome.info = tempInfo;
                        }


                    console.log('folder deep info',WidgetHome.info);
                    $rootScope.$emit('lazyImg:refresh');
                }

                function preparePluginsData(plugins) {

                    var matrix = [], i, k;
                    var matrix = []
                    for (i = 0, k = -1; i < plugins.length; i++) {
                        if (i % 8 === 0) {
                            k++;
                            matrix[k] = [];
                        }
                        matrix[k].push(plugins[i]);
                    }
                    $scope.layout12Plugins = matrix;

                }

                WidgetHome.goToFolder = function (plugin) {
                    ViewStack.push({
                        template: "folder",
                        folderItems: plugin.items,
                        info: WidgetHome.info});
                    LocalStorage.set({
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
                    $rootScope.$emit("CallHomeMethod", {method:'navigateToPlugin', data:plugin});
                };


            }]);
})(window.angular);