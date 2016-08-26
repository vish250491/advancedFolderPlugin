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
        .factory('LocalStorage', [ function () {

            return {
                get: function () {
                    var data= JSON.parse(localStorage.getItem(buildfire.context.instanceId));
                    return data;
                },
                set: function (data) {
                    localStorage.setItem(buildfire.context.instanceId, JSON.stringify(data));
                }
            };
        }])
        .factory('PluginType', ['Buildfire', function (Buildfire) {
                var status=false;
            if(Buildfire.getFrameType()==="LAUNCHER_PLUGIN  ")
                status=true;
            return {
                isHomePlugin: function () {

                    return status;
                }
            };
        }])
        .factory('ViewStack', ['$rootScope','LocalStorage', function ($rootScope ,LocalStorage) {
            var views = [];
            var viewMap = {};
            return {
                init : function(viewObject){
                    if(viewObject && viewObject.viewMap && viewObject.views){
                        viewMap=viewObject.viewMap;
                        views=viewObject.views;
                        $rootScope.$broadcast('VIEW_CHANGED', 'PUSH', views[views.length-1  ]);
                    }

                },
                push: function (view) {
                    if (viewMap[view.template] && false) {
                        this.pop();
                    }
                    else {
                        viewMap[view.template] = 1;
                        views.push(view);
                        $rootScope.$broadcast('VIEW_CHANGED', 'PUSH', view);
                    }
                    LocalStorage.set({"views" : views,"viewMap" : viewMap});
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
        }])
   ;
})(window.angular, window.buildfire, window.location);