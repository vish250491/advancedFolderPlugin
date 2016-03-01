'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginDesign')
        .controller('DesignHomeCtrl', ['$scope', '$timeout','COLLECTIONS','DB','DEFAULT_DATA','Buildfire',
            function ($scope, $timeout,COLLECTIONS,DB,DEFAULT_DATA,Buildfire) {
                console.log('DesignHome Controller Loaded-------------------------------------');
                var DesignHome = this;
                var timerDelay,masterInfo;
                DesignHome.layouts = [{name: "list-layout1"}, {name: "list-layout2"}, {name: "list-layout3"}, {name: "list-layout4"},{name: "list-layout5"},{name: "list-layout6"}];
                var advanceFolder=new DB(COLLECTIONS.advancedFolderInfo);

                DesignHome.changeLayout = function (layoutName) {
                    if (layoutName && DesignHome.info.data.design) {
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
                            DesignHome.info.data.design =  DesignHome.info.data.design || {};
                            DesignHome.info.data.design.bgImage =  DesignHome.info.data.design.bgImage || {};
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
                    DesignHome.info.data.design =  DesignHome.info.data.design || {};
                    DesignHome.info.data.design.bgImage =  DesignHome.info.data.design.bgImage || {};
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


                function init(){
                    var success=function(data){
                        if(data && data.data && (data.data.content || data.data.design)){
                            //console.log('Info got---------------');
                            updateMasterInfo(data.data);
                            DesignHome.info=data;
                            if(data.data.design && data.data.design.bgImage){
                            //    background.loadbackground(DesignHome.info.data.design.bgImage);
                            }
                        }
                        else{
                            updateMasterInfo(DEFAULT_DATA.ADVANCED_FOLDER_INFO);
                            DesignHome.info=DEFAULT_DATA.ADVANCED_FOLDER_INFO;
                        }
                        console.log('Got soundcloud info successfully-----------------',data.data);
                    };
                    var error=function(err){
                        console.error('Error while getting data from db-------',err);
                    };
                    advanceFolder.get().then(success,error);
                }

                init();

                function isUnchanged(info) {
                    //console.log('info------------------------------------------',info);
                    //console.log('Master info------------------------------------------',masterInfo);
                    return angular.equals(info,masterInfo);
                }

                function updateMasterInfo(info) {
                    masterInfo = angular.copy(info);
                }
                function saveData(_info){
                    var saveSuccess=function(data){
                        //console.log('Data saved successfully--------------------------',data);
                    };
                    var saveError=function(err){
                       /* console.error('Error while saving data------------------------------',err);*/
                    };
                    if(_info && _info.data)
                        advanceFolder.save(_info.data).then(saveSuccess,saveError);
                }

                function updateInfoData(_info){
                    if (timerDelay) {
                        clearTimeout(timerDelay);
                    }
                    if (_info && _info.data && !isUnchanged(_info)) {
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