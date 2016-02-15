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
        }]);
})(window.angular, window.buildfire, window.location);