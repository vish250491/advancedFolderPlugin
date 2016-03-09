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

                                var _newView = '<div  id="' + view.template + '" ><div class="slide content dynamic-view" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout"></div></div>';
                                if (view.params && view.params.controller) {
                                    _newView = '<div id="' + view.template + '" ><div class="slide content dynamic-view" data-back-img="{{backgroundImage}}" ng-if="currentItemListLayout" ng-include="currentItemListLayout" ng-controller="' + view.params.controller + '" ></div></div>';
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
                                var _elToRemove = $('div[view-switcher]').find('div#folder:last'),
                                    _child = _elToRemove.children("div").eq(0);

                                _child.addClass("ng-leave ng-leave-active");
                                _child.one("webkitTransitionEnd transitionend oTransitionEnd", function (e) {
                                    _elToRemove.remove();
                                    views--;
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
                                $('body').addClass('no-scroll');
                                $(elem).removeClass("ng-hide");
                            } else {
                                $('body').removeClass('no-scroll');
                                $(elem).addClass("ng-hide");
                            }


                        }

                    }
                };
            }])
        .directive('backImg', ["$filter", "$rootScope", "$window" , function ($filter, $rootScope, $window) {
            return function (scope, element, attrs) {
                attrs.$observe('backImg', function (value) {
                    var img = '';
                    if (value) {
                        img = $filter("cropImage")(value, $window.innerWidth, $window.innerHeight, true);
                        element.attr("style", 'background:url(' + img + ') !important');
                        element.css({
                            'background-size': 'cover'
                        });
                    }
                    else {
                        img = "";
                        element.attr("style", 'background-color:white !important');
                        element.css({
                            'background-size': 'cover'
                        });
                    }
                });
            };
        }]);
})(window.angular);