(function (angular, buildfire) {
    'use strict';
    if (!buildfire) {
        throw ("buildfire not found");
    }
    angular
        .module('advancedFolderModals', ['ui.bootstrap'])
        .factory('Modals', ['$modal', '$q', function ($modal, $q) {
            return {
                addFolderModal: function () {
                    var addFolderDeferred = $q.defer();
                    var addFolderPopupModal = $modal
                        .open({
                            templateUrl: 'add-folder-modal.html',
                            controller: 'AddFolderPopupCtrl',
                            controllerAs: 'AddFolderPopup',
                            size: 'sm'
                        });
                    addFolderPopupModal.result.then(function (imageInfo) {
                        addFolderDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        addFolderDeferred.reject(err);
                    });
                    return addFolderDeferred.promise;
                }

            };
        }])
        .controller('AddFolderPopupCtrl', ['$scope', '$modalInstance', function ($scope, $modalInstance) {
            $scope.folderTitle = '';
            $scope.ok = function () {
                $modalInstance.close($scope.folderTitle);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };
        }]);
})(window.angular, window.buildfire);
