'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$timeout', 'DEFAULT_DATA', 'COLLECTIONS', 'DB', 'Buildfire',
            '$rootScope', 'ViewStack', 'Messaging', '$q',
            function ($scope, $timeout, DEFAULT_DATA, COLLECTIONS, DB, Buildfire, $rootScope, ViewStack, Messaging, $q) {
                console.log('WidgetHomeCtrl Controller Loaded-------------------------------------');

                var WidgetHome = this;
                WidgetHome.noCarouselBody = false;
                var matchedBackgroundName = undefined;
                var deviceHeight = window.innerHeight;
                var detailedPluginInfoArray = [];
                var deviceWidth = window.innerWidth;
                WidgetHome.firstTime=true;

                WidgetHome.view = null;
                //Default initialise
                WidgetHome.info = DEFAULT_DATA.ADVANCED_FOLDER_INFO;
                WidgetHome.initData=[
                    {   title:'Restau',
                        iconUrl:'glyphicon glyphicon-glass',
                        items:[]
                    },
                    {
                        title:'Music',
                        iconUrl:'glyphicon glyphicon-music',
                        items:[]
                    },
                    {
                        title:'Search',
                        iconUrl:'glyphicon glyphicon-search',
                        items:[]
                    },
                    {
                        title:'Favourite',
                        iconUrl:'glyphicon glyphicon-star',
                        items:[]
                    }
                ]


                /*declare the device width heights*/
                $rootScope.deviceHeight = window.innerHeight;
                $rootScope.deviceWidth = window.innerWidth;

                WidgetHome.advancedFolderInfo = new DB(COLLECTIONS.advancedFolderInfo);


                WidgetHome.showDescription = function () {
                    if (WidgetHome.info.data.content.description == '<p>&nbsp;<br></p>' || WidgetHome.info.data.content.description == '<p><br data-mce-bogus="1"></p>')
                        return false;
                    else
                        return true;
                };

                /// load items
                WidgetHome.loadItems = function (carouselItems) {
                    // create an instance and pass it the items if you don't have items yet just pass []
                    if (WidgetHome.view)
                        WidgetHome.view.loadItems(carouselItems);
                };

                WidgetHome.initCarousel = function () {
                    if (angular.element('#carousel').hasClass('plugin-slider') == false || WidgetHome.view == null) {
                        WidgetHome.view = new Buildfire.components.carousel.view("#carousel", []);  ///create new instance of buildfire carousel viewer
                        console.log('came heer');
                    }
                    if (WidgetHome.info && WidgetHome.info.data && WidgetHome.info.data.content && WidgetHome.info.data.content.images && WidgetHome.info.data.content.images.length) {
                        WidgetHome.view.loadItems(WidgetHome.info.data.content.images);
                    } else {
                        WidgetHome.view.loadItems([]);
                    }

                };

                WidgetHome.advancedFolderInfo.get().then(function success(result) {
                        console.log('>>result<<', result);
                        if (result && result.data && result.id) {
                            WidgetHome.info = result;
                            loadData();
                            if (WidgetHome.info.data && WidgetHome.info.data.design)
                                $rootScope.bgImage = WidgetHome.info.data.design.bgImage;

                            $timeout(function () {
                                WidgetHome.initCarousel();
                            }, 1500);
                        }
                        else {
                            WidgetHome.info = DEFAULT_DATA.ADVANCED_FOLDER_INFO;
                        }
                    },
                    function fail() {
                        WidgetHome.info = DEFAULT_DATA.ADVANCED_FOLDER_INFO;
                    }
                );


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

                    var pluginDetailInfo = getDetailedInfoOfPlugin(plugin);
                    pluginDetailInfo.then(function (plugin) {
                        var fName = '';
                        if (plugin && plugin.pluginType && plugin.pluginType.folderName)
                            fName = plugin.pluginType.folderName;
                        else if (plugin && plugin.folderName)
                            fName = plugin.folderName;

                        buildfire.navigation.navigateTo({
                            pluginId: plugin.pluginTypeId,
                            instanceId: plugin.instanceId,
                            title: plugin.title,
                            folderName: fName
                        });
                    })

                };

                function getDetailedInfoOfPlugin(plugin) {
                    var deferred = $q.defer();
                    detailedPluginInfoArray.forEach(function (detailInfo) {
                        if (plugin.instanceId == detailInfo.instanceId) {
                            plugin = detailInfo;
                            deferred.resolve(plugin);
                        }
                    });
                    return deferred.promise;
                }


                WidgetHome.goToFolder = function (obj) {

                    console.log('selected folder', obj);
                    ViewStack.push({
                        template: "folder",
                        folderItems: obj.items,
                        info: WidgetHome.info
                    });
                };

                function setBackgroundImage() {
                    var backgroundImages = WidgetHome.info.data.design.bgImage;
                    var backgroundImage = undefined;

                    if (!backgroundImages) return;

                    if (typeof(WidgetHome.info.data.design.bgImage) === "string") {
                        backgroundImage = WidgetHome.cropImage(WidgetHome.info.data.design.bgImage, {
                            width: deviceWidth,
                            height: deviceHeight
                        });
                    }
                    else {
                        if (!matchedBackgroundName) {
                            matchedBackgroundName = getByMediaQuery(backgroundImages);

                            if (!matchedBackgroundName) {
                                matchedBackgroundName = calcMatchedBackgroundImage();
                            }
                        }
                        console.log('matchedBackgroundName: ', matchedBackgroundName);

                        if (matchedBackgroundName) {
                            backgroundImage = WidgetHome.cropImage(backgroundImages[matchedBackgroundName], {
                                width: deviceWidth,
                                height: deviceHeight
                            });
                        }
                    }

                    $scope.bgImage = $rootScope.bgImage = backgroundImage;
                }


                function getByMediaQuery() {
                    var devicesAspectRatios = [
                        {
                            mediaQueries: ['screen and (device-aspect-ratio:3/2)'],
                            imageName: 'i3x2'
                        },
                        {
                            mediaQueries: [
                                'screen and (device-aspect-ratio:16/9)',
                                'screen and (device-aspect-ratio: 40/71)',
                                'screen and (device-aspect-ratio: 667/375)'
                            ],
                            imageName: 'i16x9'
                        },
                        {
                            mediaQueries: ['screen and (device-aspect-ratio:4/3)', 'screen and (device-aspect-ratio: 3/4)'],
                            imageName: 'i4x3'
                        },
                        {
                            mediaQueries: ['screen and (device-aspect-ratio:16/10)'],
                            imageName: 'i16x10'
                        }
                    ];

                    var backgroundImage = undefined;
                    devicesAspectRatios.forEach(function (aspectRatio) {

                        aspectRatio.mediaQueries.forEach(function (mediaQuery) {
                            if (window.matchMedia(mediaQuery).matches) {
                                console.log('match media query: ', mediaQuery);
                                backgroundImage = aspectRatio.imageName;
                            }
                        });
                    });

                    return backgroundImage;
                }

                function calcMatchedBackgroundImage() {
                    console.log('calc best aspect ratio');
                    var aspectRatios = [
                        {w: 4, h: 3},
                        {w: 3, h: 2},
                        {w: 16, h: 10},
                        {w: 16, h: 9}
                    ];
                    var aspectRatio = getAspectRatio();
                    aspectRatios.forEach(function (ratio) {
                        ratio.diff = Math.abs((ratio.w / ratio.h) - aspectRatio);
                    });

                    aspectRatios.sort(function (a, b) {
                        return a.diff - b.diff;
                    });

                    return "i" + aspectRatios[0].w + "x" + aspectRatios[0].h;
                }

                function getAspectRatio() {
                    var w = screen.width;
                    var h = screen.height;
                    var r = gcd(w, h);
                    w = w / r;
                    h = h / r;
                    if (w < h) {
                        w = h;
                        h = w;
                    }

                    return w / h;
                }

                function gcd(a, b) {
                    return (b == 0) ? a : gcd(b, a % b);
                }

                /*
                 * Go pull saved data
                 * */
                function loadData() {
                    console.log('dynamic store fetching');
                    buildfire.datastore.getWithDynamicData('advancedFolderInfo', function (err, result) {
                        if (err) {
                            console.log('eror in dynamic store fetching');
                            console.error("Error: ", err);
                            return;
                        }
                        dataLoadedHandler(result);
                    });
                }



                /**
                 * when a refresh is triggered get reload data
                 */

                buildfire.datastore.onRefresh(loadData);

                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */

                WidgetHome.onUpdateCallback = function (event) {
                    WidgetHome.firstTime=false;
                    if (event.data) {
                        WidgetHome.info = event;
                        ViewStack.popAllViews();
                        if (WidgetHome.info.data && WidgetHome.info.data.design)
                            $rootScope.bgImage = WidgetHome.info.data.design.bgImage;
                        setBackgroundImage();
                        $timeout(function () {
                            WidgetHome.initCarousel();
                        }, 500);
                        $scope.$apply();
                    }
                    loadData();

                };


                function dataLoadedHandler(result) {
                    console.log('success in dynamic store fetching',result);
                    var pluginsList = null;
                    if (result && result.data && result.data._buildfire && result.data._buildfire.plugins && result.data._buildfire.plugins.result) {
                        pluginsList = result.data._buildfire.plugins;

                        if (result.data._buildfire && pluginsList && pluginsList.result && pluginsList.data) {
                            detailedPluginInfoArray = getPluginDetails(result.data._buildfire.plugins.result, result.data._buildfire.plugins.data);
                        }
                        if (WidgetHome.info.data.content.entity.length) {
                            result.data._buildfire.plugins.result.forEach(function (pluginDetailData) {
                                traverse(WidgetHome.info.data.content.entity, 1, pluginDetailData);
                            })
                        }


                        // WidgetHome.info.data.content.entity = result.data._buildfire.plugins.result;
                    }
                    $scope.$digest();
                    console.log('success in dynamic store fetching post',WidgetHome.info);
                }

                function traverse(x, level, pluginDetailData) {
                    if (isArray(x)) {
                        traverseArray(x, level, pluginDetailData);
                    } else if ((typeof x === 'object') && (x !== null)) {
                        traverseObject(x, level, pluginDetailData);
                    } else {
                        console.log(level + x);
                    }
                }

                function isArray(o) {
                    return Object.prototype.toString.call(o) === '[object Array]';
                }

                function traverseArray(arr, level, pluginDetailData) {
                    console.log(level + "<array>");
                    arr.forEach(function (x) {
                        traverse(x, level + "  ", pluginDetailData);
                    });
                }

                function traverseObject(obj, level, pluginDetailData) {
                    console.log(level + "<object>");

                    if (obj.hasOwnProperty('items')) {
                        if (obj.items.length) {
                            //   console.log(level + "  " + key + ":");
                            traverse(obj['items'], level + "    ", pluginDetailData);
                        }
                    }
                    else {
                        if (obj.instanceId == pluginDetailData.data.instanceId)
                            obj.data = pluginDetailData.data;
                    }

                }

                function getPluginDetails(pluginsInfo, pluginIds) {
                    var returnPlugins = [];
                    var tempPlugin = null;
                    for (var id = 0; id < pluginIds.length; id++) {
                        for (var i = 0; i < pluginsInfo.length; i++) {
                            tempPlugin = {};
                            var obj = pluginsInfo[i].data ? pluginsInfo[i].data : pluginsInfo[i];
                            if (pluginIds[id] == obj.instanceId) {
                                tempPlugin.instanceId = obj.instanceId;
                                if (obj) {
                                    tempPlugin.iconUrl = obj.iconUrl;
                                    tempPlugin.iconClassName = obj.iconClassName;
                                    tempPlugin.title = obj.title;
                                    if (obj.pluginType) {
                                        tempPlugin.pluginTypeId = obj.pluginType.token;
                                        tempPlugin.folderName = obj.pluginType.folderName;
                                    }
                                    else {
                                        tempPlugin.pluginTypeId = obj.pluginTypeId;
                                        tempPlugin.folderName = obj.folderName;
                                    }
                                } else {
                                    tempPlugin.iconUrl = "";
                                    tempPlugin.title = "[No title]";
                                }
                                returnPlugins.push(tempPlugin);
                            }
                            tempPlugin = null;
                        }
                    }
                    return returnPlugins;
                };


                var listener = Buildfire.datastore.onUpdate(WidgetHome.onUpdateCallback);

                Messaging.onReceivedMessage = function (event) {
                    if (event) {
                        if (event.name == 'OPEN_FOLDER') {
                            var folder = event.message.selectedFolder;
                            for (var i = 0; i < folder.items.length; i++) {
                                if (!folder.items[i].items) {

                                    for(var j = 0; j< WidgetHome.info.data._buildfire.plugins.result.length;j++){
                                        if(folder.items[i].instanceId === WidgetHome.info.data._buildfire.plugins.result[j].data.instanceId)
                                        {
                                            folder.items[i].data = WidgetHome.info.data._buildfire.plugins.result[j].data;
                                        }
                                    }
                                }
                            }
console.log('folder>>',folder);
                            WidgetHome.goToFolder(folder);
                            $scope.$apply();
                        }
                        if (event.name == 'OPEN_PLUGIN') {
                            console.log('came here plugin', event.message.data);
                            WidgetHome.navigateToPlugin(event.message.data);
                            //$scope.$apply();
                        }
                    }

                };

            }]);
})(window.angular);