(function (angular, buildfire) {
    'use strict';
    if (!buildfire) {
        throw ("buildfire not found");
    }
    angular
        .module('advancedFolderModals', ['ui.bootstrap'])
        .factory('Modals', ['$modal', '$q', function ($modal, $q) {
            return {
                addFolderModal: function (title) {
                    var addFolderDeferred = $q.defer();
                    var addFolderPopupModal = $modal
                        .open({
                            templateUrl: 'add-folder-modal.html',
                            controller: 'AddFolderPopupCtrl',
                            controllerAs: 'AddFolderPopup',
                            size: 'sm',
                            resolve:{
                                title:function(){return title;}
                            }
                        });
                    addFolderPopupModal.result.then(function (imageInfo) {
                        addFolderDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        addFolderDeferred.reject(err);
                    });
                    return addFolderDeferred.promise;
                },
                removePopupModal: function () {
                    var removePopupDeferred = $q.defer();
                    var removePopupModal = $modal
                        .open({
                            templateUrl: 'rm-item-modal.html',
                            controller: 'RemovePopupCtrl',
                            controllerAs: 'RemovePopup',
                            size: 'sm'
                        });
                    removePopupModal.result.then(function (imageInfo) {
                        removePopupDeferred.resolve(imageInfo);
                    }, function (err) {
                        //do something on cancel
                        removePopupDeferred.reject(err);
                    });
                    return removePopupDeferred.promise;
                }

            };
        }])
        .controller('AddFolderPopupCtrl', ['$scope', '$modalInstance','title', function ($scope, $modalInstance,title) {
            if(title)
                $scope.folderTitle = title;
            else
            $scope.folderTitle = '';
            $scope.ok = function () {
                $modalInstance.close($scope.folderTitle);
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };
        }])
        .controller('RemovePopupCtrl', ['$scope', '$modalInstance',  function ($scope, $modalInstance) {
            var RemovePopup = this;

            RemovePopup.ok = function () {
                $modalInstance.close('yes');
            };
            RemovePopup.cancel = function () {
                $modalInstance.dismiss('no');
            };
        }]);
})(window.angular, window.buildfire);
