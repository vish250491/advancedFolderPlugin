(function (angular, buildfire) {
    'use strict';
    if (!buildfire) {
        throw ("buildfire not found");
    }
    angular
        .module('advancedFolderModals', ['ui.bootstrap'])
        .factory('Modals', ['$modal', '$q', function ($modal, $q) {
            return {
                addFolderModal: function (info) {
                    var addFolderDeferred = $q.defer();
                    var addFolderPopupModal = $modal
                        .open({
                            templateUrl: 'add-folder-modal.html',
                            controller: 'AddFolderPopupCtrl',
                            controllerAs: 'AddFolderPopup',
                            size: 'sm',
                            resolve:{
                                Info:function(){return info;},

                            }
                        });
                    addFolderPopupModal.result.then(function (folderInfo) {
                        addFolderDeferred.resolve(folderInfo);
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
        .controller('AddFolderPopupCtrl', ['$scope', '$modalInstance','Info', function ($scope, $modalInstance,Info) {
            if(Info && Info.title)
                $scope.folderTitle = Info.title;
            else
                $scope.folderTitle = '';

            if(Info && Info.iconUrl)
                $scope.folderIconUrl = Info.iconUrl;
            else
                $scope.folderIconUrl = '';

            $scope.ok = function () {
                $modalInstance.close({title : $scope.folderTitle,iconUrl : $scope.folderIconUrl});
            };
            $scope.cancel = function () {
                $modalInstance.dismiss('no');
            };

            $scope.selectIcon = function () {
                buildfire.imageLib.showDialog ( {showIcons:true, multiSelection:false } , function(err,result){
                    if (result && result.selectedIcons && result.selectedIcons.length > 0) {
                        $scope.folderIconUrl = result.selectedFiles[0];
                        $scope.$apply();
                    }
                    if (result && result.selectedFiles && result.selectedFiles.length > 0) {
                        $scope.folderIconUrl = result.selectedFiles[0];
                        $scope.$apply();
                    }
                });
            };

            $scope.removeIcon = function () {
                $scope.folderIconUrl='';
            }
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
