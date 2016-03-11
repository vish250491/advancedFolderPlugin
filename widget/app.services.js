(function (angular, buildfire, location) {
    'use strict';
    //created mediaCenterWidget module
    angular
        .module('advancedFolderWidgetServices', ['advancedFolderWidgetEnums'])
        .provider('Buildfire', [function () {
            this.$get = function () {
                return buildfire;
            };
        }])
        .provider('Messaging', [function () {
            this.$get = function () {
                return buildfire.messaging;
            };
        }])
        .factory("DB", ['Buildfire', '$q', 'MESSAGES', 'CODES', function (Buildfire, $q, MESSAGES, CODES) {
            function DB(tagName) {
                this._tagName = tagName;
            }

            DB.prototype.get = function () {
                var that = this;
                var deferred = $q.defer();
                Buildfire.datastore.get(that._tagName, function (err, result) {
                    if (err && err.code == CODES.NOT_FOUND) {
                        return deferred.resolve();
                    }
                    else if (err) {
                        return deferred.reject(err);
                    }
                    else {
                        return deferred.resolve(result);
                    }
                });
                return deferred.promise;
            };
            return DB;
        }])
        .factory('ViewStack', ['$rootScope', function ($rootScope) {
            var views = [];
            var viewMap = {};
            return {
                push: function (view) {
                    if (viewMap[view.template] && false) {
                        this.pop();
                    }
                    else {
                        viewMap[view.template] = 1;
                        views.push(view);
                        $rootScope.$broadcast('VIEW_CHANGED', 'PUSH', view);
                    }
                    return view;
                },
                pop: function () {
                    $rootScope.$broadcast('BEFORE_POP', views[views.length - 1]);
                    var view = views.pop();
                    delete viewMap[view.template];
                    $rootScope.$broadcast('VIEW_CHANGED', 'POP', view);
                    return view;
                },
                hasViews: function () {
                    return !!views.length;
                },
                getCurrentView: function () {
                    return views.length && views[views.length - 1] || {};
                },
                popAllViews: function () {
                    $rootScope.$broadcast('VIEW_CHANGED', 'POPALL', views);
                    views = [];
                    viewMap = {};
                }
            };
        }]);
})(window.angular, window.buildfire, window.location);