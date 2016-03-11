(function (angular, buildfire, location) {
    'use strict';
    //created mediaCenterWidget module
    angular
        .module('advancedFolderContentServices', ['advancedFolderContentEnums'])
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
        .service('Utility', function(){
            this.getPluginDetails = function(pluginsInfo,pluginIds) {
                var returnPlugins = [];
                var tempPlugin = null;
                for (var id = 0; id < pluginIds.length; id++) {
                    for (var i = 0; i < pluginsInfo.length; i++) {
                        tempPlugin = {};
                        if (pluginIds[id] == pluginsInfo[i].data.instanceId) {
                            tempPlugin.instanceId = pluginsInfo[i].data.instanceId;
                            if (pluginsInfo[i].data) {
                                tempPlugin.iconUrl = pluginsInfo[i].data.iconUrl;
                                tempPlugin.iconClassName = pluginsInfo[i].data.iconClassName;
                                tempPlugin.title = pluginsInfo[i].data.title;
                                tempPlugin.pluginTypeId = pluginsInfo[i].data.pluginType.token;
                                tempPlugin.pluginTypeName = pluginsInfo[i].data.pluginType.name;
                                tempPlugin.folderName = pluginsInfo[i].data.pluginType.folderName;
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
            }
        })
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
            DB.prototype.save = function (item) {
                var that = this;
                var deferred = $q.defer();
                if (typeof item == 'undefined') {
                    return deferred.reject(new Error(MESSAGES.ERROR.DATA_NOT_DEFINED));
                }
                Buildfire.datastore.save(item, that._tagName, function (err, result) {
                    if (err) {
                        return deferred.reject(err);
                    }
                    else if (result) {
                        return deferred.resolve(result);
                    } else {
                        return deferred.reject(new Error(MESSAGES.ERROR.NOT_FOUND));
                    }
                });
                return deferred.promise;
            };
            return DB;
        }]);
})(window.angular, window.buildfire, window.location);