'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginWidget')
        .controller('WidgetHomeCtrl', ['$scope', '$timeout', 'DEFAULT_DATA', 'COLLECTIONS', 'DB', 'Buildfire',
            '$rootScope',
            function ($scope, $timeout, DEFAULT_DATA, COLLECTIONS, DB, Buildfire, $rootScope) {
                console.log('WidgetHomeCtrl Controller Loaded-------------------------------------');

                var WidgetHome = this;
                var matchedBackgroundName = undefined;
                var deviceHeight = window.innerHeight;;
                var deviceWidth = window.innerWidth;

                WidgetHome.view = null;

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

                function setBackgroundImage() {
                    var backgroundImages =WidgetHome.info.data.design.bgImage;
                    var backgroundImage = undefined;

                    if (!backgroundImages) return;

                    if (typeof(WidgetHome.info.data.design.bgImage) === "string") {
                        backgroundImage = WidgetHome.cropImage(WidgetHome.info.data.design.bgImage, {width: deviceWidth, height: deviceHeight});
                    }
                    else {
                        if (!matchedBackgroundName) {
                            matchedBackgroundName = getByMediaQuery(backgroundImages);

                            if (!matchedBackgroundName) {
                                matchedBackgroundName = calcMatchedBackgroundImage();
                            }
                        }
                        console.log('matchedBackgroundName: ', matchedBackgroundName);

                        if(matchedBackgroundName){
                            backgroundImage = WidgetHome.cropImage(backgroundImages[matchedBackgroundName], {
                                width: deviceWidth,
                                height: deviceHeight
                            });
                        }
                    }

                    $scope.bgImage = backgroundImage;
                }


                function getByMediaQuery(){
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

                function calcMatchedBackgroundImage(){
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
                    buildfire.datastore.getWithDynamicData(function (err, result) {
                        if (err) {
                            console.error("Error: ", err);
                            return;
                        }
                      //  dataLoadedHandler(result);
                    });
                }

                loadData();

                /**
                 * when a refresh is triggered get reload data
                 */

                buildfire.datastore.onRefresh(loadData);

                /**
                 * Buildfire.datastore.onUpdate method calls when Data is changed.
                 */

                WidgetHome.onUpdateCallback = function (event) {
                    if (event.data) {
                        WidgetHome.info = event;
                        if (WidgetHome.info.data && WidgetHome.info.data.design)
                            $rootScope.bgImage = WidgetHome.info.data.design.bgImage;
                            setBackgroundImage();
                        $timeout(function () {
                            WidgetHome.initCarousel();
                        }, 500);
                        $scope.$apply();
                    }

                };

                var listener = Buildfire.datastore.onUpdate(WidgetHome.onUpdateCallback);

            }]);
})(window.angular);