(function (angular) {
    angular
        .module('advancedFolderPluginWidget')
        .directive("buildFireCarousel", ["$rootScope", '$timeout', function ($rootScope, $timeout) {
            return {
                restrict: 'A',
                link: function (scope, elem, attrs) {
                    $timeout(function () {
                        $rootScope.$broadcast("Carousel:LOADED");
                    }, 0);
                }
            };
        }])
        .directive("viewSwitcher", ["ViewStack", "$rootScope", '$compile', "$templateCache",
            function (ViewStack, $rootScope, $compile, $templateCache) {
                return {
                    restrict: 'AE',
                    link: function (scope, elem, attrs) {
                        var views = 0;
                        manageDisplay();
                        $rootScope.$on('VIEW_CHANGED', function (e, type, view) {
                            if (type === 'PUSH') {
                                var newScope = $rootScope.$new();
                                newScope.currentItemListLayout = "templates/" + view.template + ".html";

                                var _newView = '<div  id="' + view.template + '" ><div style="background-color: white" class="slide content dynamic-view" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout"></div></div>';
                                if (view.params && view.params.controller) {
                                    _newView = '<div id="' + view.template + '" ><div  style="background-color: white" class="slide content dynamic-view" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout" ng-controller="' + view.params.controller + '" ></div></div>';
                                }
                                var parTpl = $compile(_newView)(newScope);
                                if (view.params && view.params.shouldUpdateTemplate) {
                                    newScope.$on("ITEM_LIST_LAYOUT_CHANGED", function (evt, layout, needDigest) {
                                        newScope.currentItemListLayout = "templates/" + layout + ".html";
                                        if (needDigest) {
                                            newScope.$digest();
                                        }
                                    });
                                }
                                $(elem).append(parTpl);
                                views++;

                            } else if (type === 'POP') {
                                views--;
                                var _elToRemove = $('div[view-switcher]').find('div#folder:last'),
                                    _child = _elToRemove.children("div").eq(0);

                                _child.addClass("ng-leave ng-leave-active");
                                _child.on("webkitTransitionEnd transitionend oTransitionEnd", function (e) {
                                    _elToRemove.remove();

                                });

                                //$(elem).find('#' + view.template).remove();
                            }
                            else if (type === 'POPALL') {
                                console.log(view);
                                angular.forEach(view, function (value, key) {
                                    $(elem).find('#' + value.template).remove();
                                });
                                views = 0;
                            }
                            manageDisplay();
                        });

                        function manageDisplay() {
                            if (views) {
                                //$('body').addClass('no-scroll');
                                $(elem).removeClass("ng-hide");
                            } else {
                                //$('body').removeClass('no-scroll');
                                //$(elem).addClass("ng-hide");
                            }


                        }

                    }
                };
            }])
        .directive('imageCarousel', function ($timeout) {
            return {
                restrict: 'A',
                scope: {},
                link: function (scope, elem, attrs) {
                    scope.carousel = null;
                    scope.timeout = null;
                    function initCarousel() {
                        if (scope.timeout) {
                            $timeout.cancel(scope.timeout);
                        }
                        if (scope.carousel) {
                            scope.carousel.trigger("destroy.owl.carousel");
                            $(elem).find(".owl-stage-outer").remove();
                        }
                        scope.carousel = null;
                        scope.timeout = $timeout(function () {
                            var obj = {
                                loop:false,
                                nav:false,
                                items:1
                            };
                            scope.carousel = $(elem).owlCarousel(obj);
                        }, 100);
                    }

                    initCarousel();
                    attrs.$observe("imageCarousel", function (newVal, oldVal) {
                        if (parseInt(newVal)) {
                            if (scope.carousel) {
                                initCarousel();
                            }
                        }
                    });
                }
            }
        })
        .directive('emitLastRepeaterElement', function() {
            return function(scope) {
                if (scope.$last){
                    scope.$emit('LastRepeaterElement');
                }
            };
        })
        .directive('backImg', ["$filter", "$rootScope", "$window" , function ($filter, $rootScope, $window) {
            return function (scope, element, attrs) {
                attrs.$observe('backImg', function (value) {
                    var img = '';
                    if (value) {
                        img = $filter("cropImage")(value, $window.innerWidth, $window.innerHeight, true);
                        element.attr("style", 'background:url(' + img + ') !important ;background-size: cover !important;');
                        element.css({
                            'background-size': 'cover'
                        });
                    }
                    else {
                        img = "";
                        element.attr("style", '');
                        element.css({
                            'background-size': 'cover'
                        });
                    }
                });
            };
        }])
        .directive("loadImage", ['Buildfire', function (Buildfire) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element.attr("src", "../../../styles/media/holder-" + attrs.loadImage + ".gif");

                    var _img = attrs.finalSrc;
                    if (attrs.cropType == 'resize') {
                        Buildfire.imageLib.local.resizeImage(_img, {
                            width: attrs.cropWidth,
                            height: attrs.cropHeight
                        }, function (err, imgUrl) {
                            _img = imgUrl;
                            replaceImg(_img);
                        });
                    } else {
                        Buildfire.imageLib.local.cropImage(_img, {
                            width: attrs.cropWidth,
                            height: attrs.cropHeight
                        }, function (err, imgUrl) {
                            _img = imgUrl;
                            replaceImg(_img);
                        });
                    }

                    function replaceImg(finalSrc) {
                        var elem = $("<img>");
                        elem[0].onload = function () {
                            element.attr("src", finalSrc);
                            elem.remove();
                        };
                        elem.attr("src", finalSrc);
                    }
                }
            };
        }])
        .directive('backImg', ["$rootScope", function ($rootScope) {
            return function (scope, element, attrs) {
                attrs.$observe('backImg', function (value) {
                    var img = '';
                    if (value) {
                        buildfire.imageLib.local.cropImage(value, {
                            width: $rootScope.deviceWidth,
                            height: $rootScope.deviceHeight
                        }, function (err, imgUrl) {
                            if (imgUrl) {
                                img = imgUrl;
                                element.attr("style", 'background:url(' + img + ') !important');
                            } else {
                                img = '';
                                element.attr("style", 'background-color:white');
                            }
                            element.css({
                                'background-size': 'cover'
                            });
                        });
                        // img = $filter("cropImage")(value, $rootScope.deviceWidth, $rootScope.deviceHeight, true);
                    }
                    else {
                        img = "";
                        element.attr("style", 'background-color:white');
                        element.css({
                            'background-size': 'cover'
                        });
                    }
                });
            };
        }]);
})(window.angular);