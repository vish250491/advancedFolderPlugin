'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginDesign')
        .controller('DesignHomeCtrl', ['$scope', '$timeout', 'COLLECTIONS', 'DB', 'DEFAULT_DATA', 'Buildfire',
            function ($scope, $timeout, COLLECTIONS, DB, DEFAULT_DATA, Buildfire) {
                console.log('DesignHome Controller Loaded-------------------------------------');
                var DesignHome = this;
                var timerDelay;
                var _data={
                    _buildfire: {
                        plugins: {
                            dataType: "pluginInstance",
                            data: []
                        }
                    },
                    content: {
                        images: [],
                        description: '',
                        entity:[]
                    },
                    design: {
                        itemListLayout: "list-layout1",
                        bgImage: [],
                        hideText : false
                    }
                };


                DesignHome.layouts = [{name: "list-layout1"}, {name: "list-layout2"}, {name: "list-layout3"}, {name: "list-layout4"}, {name: "list-layout5"}, {name: "list-layout6"}, {name: "list-layout7"}, {name: "list-layout8"}, {name: "list-layout9"}, {name: "list-layout10"}, {name: "list-layout11"}, {name: "list-layout12"}];
                var advanceFolder = new DB(COLLECTIONS.advancedFolderInfo);
                var masterInfo;
                DesignHome.changeLayout = function (layoutName) {
                    if (layoutName && DesignHome.info.data.design) {
                        if(DesignHome.info.data.default){
                            _data.design.itemListLayout = layoutName;
                        }
                        DesignHome.info.data.design.itemListLayout = layoutName;
                    }
                };

                /*
                 * Open a dailog to change the background image
                 * */
                DesignHome.changeBackground = function (imageName) {
                    buildfire.imageLib.showDialog({showIcons: false, multiSelection: false}, function (err, result) {
                        if (err) {
                            return console.err('Error:', error);
                        }
                        if (result.selectedFiles && result.selectedFiles.length) {

                            if(DesignHome.info.data.default){
                                _data.design.bgImage[imageName] = result.selectedFiles[0];
                            }

                            DesignHome.info.data.design = DesignHome.info.data.design || {};
                            DesignHome.info.data.design.bgImage = DesignHome.info.data.design.bgImage || {};
                            DesignHome.info.data.design.bgImage[imageName] = result.selectedFiles[0];
                            if (!$scope.$$phase && !$scope.$root.$$phase) {
                                $scope.$apply();
                            }
                        }
                    });
                };

                /*
                 * Delete the background and back to the default white background
                 * */
                DesignHome.deleteBackground = function (imageName) {
                    DesignHome.info.data.design = DesignHome.info.data.design || {};
                    DesignHome.info.data.design.bgImage = DesignHome.info.data.design.bgImage || {};
                    DesignHome.info.data.design.bgImage[imageName] = undefined;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };

                /*
                 * Get background image thumbnail
                 * */
                DesignHome.resizeImage = function (url) {
                    if (!url) {
                        return "";
                    }
                    else {
                        return buildfire.imageLib.resizeImage(url, {width: 88});
                    }
                };


                function init() {
                    var success = function (data) {
                        if (data && data.data && data.id && (data.data.content || data.data.design)) {

                            updateMasterInfo(data);
                            DesignHome.info = data;

                        }
                        else {
                            updateMasterInfo(DEFAULT_DATA.ADVANCED_FOLDER_INFO);
                            DesignHome.info = DEFAULT_DATA.ADVANCED_FOLDER_INFO;
                        }
                        console.log('Got soundcloud info successfully-----------------', data.data);
                    };
                    var error = function (err) {
                        console.error('Error while getting data from db-------', err);
                    };
                    advanceFolder.get().then(success, error);
                }

                init();

                function isUnchanged(info) {
                    console.log('design data info------------------------------------------',info);
                    console.log('design data Master info------------------------------------------',masterInfo);
                    console.log('design data change',angular.equals(info, masterInfo));
                    return angular.equals(info, masterInfo);
                }

                function updateMasterInfo(info) {
                    masterInfo = angular.copy(info);
                }

                function saveData(_info) {
                    var updateSuccess = function (data) {
                        updateMasterInfo(data);
                        console.log('Data updated successfully---------------from content-----------', data);
                    };
                    var saveSuccess = function (data) {
                        advanceFolder.get().then(function (d) {
                            console.log('d>>>>',d);
                            updateMasterInfo(d);
                            DesignHome.info = d;
                        }, function () {

                        });

                        console.log('Data saved successfully---------------from content-----------', data);
                    };
                    var saveError = function (err) {
                        console.error('Error while saving data------------------------------', err);
                    };
                    if (_info.id)
                        advanceFolder.update(_info.id,_info.data).then(updateSuccess, saveError);
                    else
                        advanceFolder.save(_info.data).then(saveSuccess, saveError);
                }

                function updateInfoData(_info) {
                    $timeout.cancel(timerDelay);
                    if (_info && _info.data && !isUnchanged(_info)) {
                        if(_info.data.default) {
                            _info.data = _data;
                        }
                        timerDelay = $timeout(function () {
                            saveData(_info);
                        }, 1000);
                    }
                }

                $scope.$watch(function () {
                    return DesignHome.info;
                }, updateInfoData, true);
            }]);
})(window.angular);