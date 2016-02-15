'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginDesign')
        .controller('DesignHomeCtrl', ['$scope', '$timeout','COLLECTIONS','DB','DEFAULT_DATA','Buildfire',
            function ($scope, $timeout,COLLECTIONS,DB,DEFAULT_DATA,Buildfire) {
                console.log('DesignHome Controller Loaded-------------------------------------');
                var DesignHome = this;
                var timerDelay,masterInfo;
                DesignHome.layouts = [{name: "list-layout1"}, {name: "list-layout2"}, {name: "list-layout3"}, {name: "list-layout4"}];
                var soundCloud=new DB(COLLECTIONS.SoundCloudInfo);

                DesignHome.changeLayout = function (layoutName) {
                    if (layoutName && DesignHome.info.data.design) {
                        DesignHome.info.data.design.itemListLayout = layoutName;
                    }
                };

                var background = new Buildfire.components.images.thumbnail("#background");

                background.onChange = function (url) {
                    DesignHome.info.data.design.bgImage = url;
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };

                background.onDelete = function () {
                    DesignHome.info.data.design.bgImage = "";
                    if (!$scope.$$phase && !$scope.$root.$$phase) {
                        $scope.$apply();
                    }
                };

                function init(){
                    var success=function(data){
                        if(data && data.data && (data.data.content || data.data.design)){
                            //console.log('Info got---------------');
                            updateMasterInfo(data.data);
                            DesignHome.info=data;
                            if(data.data.design && data.data.design.bgImage){
                                background.loadbackground(DesignHome.info.data.design.bgImage);
                            }
                        }
                        else{
                            updateMasterInfo(DEFAULT_DATA.SOUND_CLOUD_INFO);
                            DesignHome.info=DEFAULT_DATA.SOUND_CLOUD_INFO;
                        }
                        //console.log('Got soundcloud info successfully-----------------',data.data);
                    };
                    var error=function(err){
                        //console.error('Error while getting data from db-------',err);
                    };
                    soundCloud.get().then(success,error);
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
                        soundCloud.save(_info.data).then(saveSuccess,saveError);
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