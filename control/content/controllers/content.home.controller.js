'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginContent')
        .controller('ContentHomeCtrl', ['$scope', '$timeout', 'DB', 'COLLECTIONS', 'Buildfire', 'DEFAULT_DATA', 'Modals',
            function ($scope, $timeout, DB, COLLECTIONS, Buildfire, DEFAULT_DATA, Modals) {
                console.log('ContentHomeCtrl Controller Loaded-------------------------------------');
                var ContentHome = this;
              /*  ContentHome.list = [{title: 'a', items: [{title: 'aa'}]}, {title: 'b'}, {title: 'c'}];
                ContentHome.treeOptions = {
                    accept: function (sourceNodeScope, destNodesScope, destIndex) {
                        return true;
                    },
                    removed: function (node) {

                    },
                    dropped: function (event) {

                    }

                }*/


                var timerDelay, masterInfo;
                ContentHome.advancedFolderInfo = new DB(COLLECTIONS.advancedFolderInfo);

                //option for wysiwyg
                ContentHome.bodyWYSIWYGOptions = {
                    plugins: 'advlist autolink link image lists charmap print preview',
                    skin: 'lightgray',
                    trusted: true,
                    theme: 'modern'
                };

                // create a new instance of the buildfire carousel editor
                ContentHome.editor = new Buildfire.components.carousel.editor("#carousel");

                // this method will be called when a new item added to the list
                ContentHome.editor.onAddItems = function (items) {
                    console.log('Content info==========================', ContentHome.info);
                    if (ContentHome.info && ContentHome.info.data && ContentHome.info.data.content && !ContentHome.info.data.content.images)
                        ContentHome.info.data.content.images = [];
                    ContentHome.info.data.content.images.push.apply(ContentHome.info.data.content.images, items);
                    if (!$scope.$$phase)$scope.$digest();
                };
                // this method will be called when an item deleted from the list
                ContentHome.editor.onDeleteItem = function (item, index) {
                    ContentHome.info.data.content.images.splice(index, 1);
                    if (!$scope.$$phase)$scope.$digest();
                };
                // this method will be called when you edit item details
                ContentHome.editor.onItemChange = function (item, index) {
                    ContentHome.info.data.content.images.splice(index, 1, item);
                    if (!$scope.$$phase)$scope.$digest();
                };
                // this method will be called when you change the order of items
                ContentHome.editor.onOrderChange = function (item, oldIndex, newIndex) {
                    var temp = ContentHome.info.data.content.images[oldIndex];
                    ContentHome.info.data.content.images[oldIndex] = ContentHome.info.data.content.images[newIndex];
                    ContentHome.info.data.content.images[newIndex] = temp;
                    if (!$scope.$$phase)$scope.$digest();
                };

                ContentHome.addNewFolderToRootPopup = function () {
                    Modals.addFolderModal().then(function (title) {
                        ContentHome.info.data.content.entity.push({title:title,items:[]});
                    }, function (err) {

                    });
                };

                ContentHome.addPluginInstancePopup = function () {
                    Buildfire.pluginInstance.showDialog({
                        prop1:""
                    },function(instances){
                        console.log('<<<<<<<<< PLUGIN INSTANCE ERROR CALLBACK >>>>>>>>>>',instances);
                      //  console.log('<<<<<<<<< PLUGIN INSTANCE TITLE>>>>>>>>>>',instances.title);
                       // console.log('<<<<<<<<< PLUGIN INSTANCE iconUrl>>>>>>>>>>',instances.iconUrl);
                    },function(instances){
                        console.log('<<<<<<<<< PLUGIN INSTANCE INSTACE CALLBACK>>>>>>>>>>',instances);
                        //  console.log('<<<<<<<<< PLUGIN INSTANCE TITLE>>>>>>>>>>',instances.title);
                        // console.log('<<<<<<<<< PLUGIN INSTANCE iconUrl>>>>>>>>>>',instances.iconUrl);
                    });
                };


                ContentHome.deleteRootFolder = function(ind){
                    ContentHome.info.data.content.entity.splice(ind, 1);
                };

                function init() {
                    var success = function (data) {
                        if (data && data.data && (data.data.content || data.data.design)) {
                            updateMasterInfo(data.data);
                            ContentHome.info = data;
                            if (data.data.content && data.data.content.images) {
                                ContentHome.editor.loadItems(data.data.content.images);
                            }
                        }
                        else {
                            updateMasterInfo(DEFAULT_DATA.ADVANCED_FOLDER_INFO);
                            ContentHome.info = DEFAULT_DATA.ADVANCED_FOLDER_INFO;
                        }
                    };
                    var error = function (err) {
                        console.error('Error while getting data from db-------', err);
                    };
                    ContentHome.advancedFolderInfo.get().then(success, error);
                }

                init();

                function isUnchanged(info) {
                    console.log('info------------------------------------------', info);
                    console.log('Master info------------------------------------------', masterInfo);
                    return angular.equals(info, masterInfo);
                }

                function updateMasterInfo(info) {
                    masterInfo = angular.copy(info);
                }

                function saveData(_info) {
                    var saveSuccess = function (data) {
                        console.log('Data saved successfully---------------from content-----------', data);
                    };
                    var saveError = function (err) {
                        console.error('Error while saving data------------------------------', err);
                    };
                    if (_info && _info.data)
                        ContentHome.advancedFolderInfo.save(_info.data).then(saveSuccess, saveError);
                }

                function updateInfoData(_info) {
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
                    return ContentHome.info;
                }, updateInfoData, true);

            }]);
})(window.angular);