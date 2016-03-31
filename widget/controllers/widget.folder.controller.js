'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginWidget')
        .controller('WidgetFolderCtrl', ['$scope', '$timeout', 'DEFAULT_DATA', 'COLLECTIONS', 'DB', 'Buildfire',
            '$rootScope', 'ViewStack',
            function ($scope, $timeout, DEFAULT_DATA, COLLECTIONS, DB, Buildfire, $rootScope, ViewStack) {
                console.log('WidgetFolderCtrl Controller Loaded-------------------------------------');
                var WidgetHome = this;
                $scope.layout12TotalItem=0;

                WidgetHome.noCarouselBody = true;

                var vs = ViewStack.getCurrentView();
                console.log('vs>>>>', vs);
                if (vs) {
                    console.log('got folder', vs.info);
                    var tempInfo = angular.copy(vs.info);
                    tempInfo.data.content.entity = vs.folderItems;

                        if(tempInfo.data.design.itemListLayout=="list-layout12"){

                                var currentCount =Number(tempInfo.data.content.entity.length);
                                preparePluginsData(tempInfo.data.content.entity);
                                if(currentCount){
                                    $scope.layout12TotalItem=currentCount;
                                }

                                WidgetHome.info = tempInfo;
                                //$scope.$digest();

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

                $scope.$on('LastRepeaterElement', function(){
                    // $('.plugin-slider.text-center.owl-carousel').trigger("destroy.owl.carousel");
                    $scope.layout12Height= $('.plugin-slider .plugin-slide').first().height()+17+'px';
                    var slides = $('.plugin-slider .plugin-slide').length;
                    $scope.layout12TotalItem=$scope.layout12TotalItem+1;
                    // Slider needs at least 2 slides or you'll get an error.
                    if(slides > 1){
                        $('.plugin-slider').owlCarousel({
                            loop:false,
                            nav:false,
                            items:1
                        });
                    }
                });

            }]);
})(window.angular);