'use strict';

(function (angular) {
    angular
        .module('advancedFolderPluginContent')
        .controller('ContentHomeCtrl', ['$scope', '$timeout', 'DB', 'COLLECTIONS', 'Buildfire', 'DEFAULT_DATA', 'Modals', 'Messaging', 'Utility',
            function ($scope, $timeout, DB, COLLECTIONS, Buildfire, DEFAULT_DATA, Modals, Messaging, Utility) {
                console.log('ContentHomeCtrl Controller Loaded-------------------------------------');
                var ContentHome = this;
                var deletePluginArray=[];
                // create a new instance of the buildfire carousel editor
                ContentHome.editor = new Buildfire.components.carousel.editor("#carousel");
                $scope.pluginExist=0;

                var masterInfo = DEFAULT_DATA.ADVANCED_FOLDER_INFO;
                //Default initialise
                ContentHome.info = DEFAULT_DATA.ADVANCED_FOLDER_INFO;


                var timerDelay;
                ContentHome.advancedFolderInfo = new DB(COLLECTIONS.advancedFolderInfo);

                //option for wysiwyg
                ContentHome.bodyWYSIWYGOptions = {
                    plugins: 'advlist autolink link image lists charmap print preview',
                    skin: 'lightgray',
                    trusted: true,
                    theme: 'modern'
                };


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
                    Modals.addFolderModal({
                        title: '',
                        iconUrl: '',
                        fileUrl: '',
                        isEdit: false
                    }).then(function (response) {
                        if(!(response.title === null || response.title.match(/^ *$/) !== null)){
                            ContentHome.info.data.content.entity.unshift({
                                title: response.title,
                                iconUrl: response.iconUrl,
                                fileUrl: response.fileUrl,
                                items: []
                            });
                        }
                    }, function (err) {

                    });
                };

                ContentHome.addPluginInstancePopup = function () {
                    Buildfire.pluginInstance.showDialog({
                        prop1: ""
                    }, function (error, instances) {
                        if (instances) {
                            instances.forEach(function (instance) {
                                if (!ContentHome.pluginExist(instance.instanceId)) {
                                    ContentHome.info.data._buildfire.plugins.data.push(instance.instanceId);
                                    ContentHome.info.data.content.entity.unshift({
                                        title: instance.title,
                                        iconUrl: instance.iconUrl,
                                        instanceId: instance.instanceId,
                                        pluginTypeName : instance.pluginTypeName
                                    });
                                    if (!$scope.$$phase)$scope.$digest();
                                }else{
                                    $scope.pluginExist=1;
                                    if (!$scope.$$phase)$scope.$digest();
                                  setTimeout(function(){
                                      $scope.pluginExist=0;
                                      if (!$scope.$$phase)$scope.$digest();
                                    },2000)
                                }

                            })
                        }
                    });
                };

                ContentHome.createNewPlugin=function(){
                    Buildfire.pluginInstance.showCreatePluginInstancesDialog({
                        prop1:""
                    },function(error,instances){
                        if (instances) {
                            instances.forEach(function (instance) {

                                    ContentHome.info.data._buildfire.plugins.data.push(instance.instanceId);
                                    ContentHome.info.data.content.entity.unshift({
                                        title: instance.title,
                                        iconUrl: instance.iconUrl,
                                        instanceId: instance.instanceId,
                                        pluginTypeName : instance.pluginTypeName
                                    });
                                    if (!$scope.$$phase)$scope.$digest();

                            })
                        }
                    });

                }

                ContentHome.pluginExist = function (instanceId) {
                    var pluginFound = false;
                    ContentHome.info.data._buildfire.plugins.data.forEach(function (pluginId) {
                        if (pluginId == instanceId) {
                            pluginFound = true;
                        }
                    });
                    return pluginFound;
                }

                ContentHome.deleteEntity = function (obj,isFolder) {
                    var nodeData = obj.$modelValue;
                    Modals.removePopupModal(isFolder).then(function (result) {
                        if (result) {
                            if(nodeData.hasOwnProperty('items')){
                                nodeData.items.forEach(function(item){
                                    var index = ContentHome.info.data._buildfire.plugins.data.indexOf(item.instanceId);
                                    ContentHome.info.data._buildfire.plugins.data.splice(index, 1);
                                })

                                //ContentHome.info.data.content.entity.splice(ind, 1);
                                obj.remove();
                            }else{
                                var index = ContentHome.info.data._buildfire.plugins.data.indexOf(nodeData.instanceId);
                                ContentHome.info.data._buildfire.plugins.data.splice(index, 1);

                                //ContentHome.info.data.content.entity.splice(ind, 1);
                                obj.remove();
                            }

                        }
                    });
                };


                ContentHome.editFolder = function (scope) {
                    var nodeData = scope.$modelValue;
                    Modals.addFolderModal({
                        title: nodeData.title,
                        iconUrl: nodeData.iconUrl,
                        fileUrl: nodeData.fileUrl
                        , isEdit: true
                    }).then(function (response) {
                        if(!(response.title === null || response.title.match(/^ *$/) !== null)){
                            nodeData.title = response.title;
                            nodeData.iconUrl = response.iconUrl;
                            nodeData.fileUrl = response.fileUrl;
                        }
                    }, function (err) {

                    });
                };


                ContentHome.deleteRootFolder = function (ind) {
                    ContentHome.info.data.content.entity.splice(ind, 1);
                };

                ContentHome.datastoreInitialized = false;


                ContentHome.openFolderInWidget = function (obj) {
                    var node = obj.$modelValue;
                    Messaging.sendMessageToWidget({
                        name: 'OPEN_FOLDER',
                        message: {
                            selectedFolder: node
                        }
                    });
                };

                ContentHome.openPluginInWidget = function (obj) {
                    var node = obj.$modelValue;
                    Messaging.sendMessageToWidget({
                        name: 'OPEN_PLUGIN',
                        message: {
                            data: node
                        }
                    });
                };

                ContentHome.treeOptions = {
                    accept: function (sourceNodeScope, destNodesScope, destIndex) {
                        if (destNodesScope.depth() >= 3 && sourceNodeScope.$modelValue.items) // this is to allow PI to be dropped inside folders of 3rd level but not folders
                            return false;
                        return true;
                    }
                };

                /*
                 * Go pull any previously saved data
                 * */
                Buildfire.datastore.getWithDynamicData('advancedFolderInfo', function (err, result) {
                    if (!err) {
                        ContentHome.datastoreInitialized = true;
                    } else {
                        console.error("Error: ", err);
                        return;
                    }

                    if (result && result.data && !angular.equals({}, result.data)) {
                        console.log('>>pluginDetailData<<', result);
updateMasterInfo(result);
                        ContentHome.info.data = result.data;
                        ContentHome.info.id = result.id;
                     /*   if (ContentHome.info.data.content && ContentHome.info.data.content.images) {
                            ContentHome.editor.loadItems(ContentHome.info.data.content.images);
                        }*/

                        if (ContentHome.info.data._buildfire && ContentHome.info.data._buildfire.plugins && ContentHome.info.data._buildfire.plugins.result) {
                            var pluginsDetailDataArray = [];
                            pluginsDetailDataArray = Utility.getPluginDetails(ContentHome.info.data._buildfire.plugins.result, ContentHome.info.data._buildfire.plugins.data);
                            //to do to display on content side icon and title of plugin
                            if (pluginsDetailDataArray && pluginsDetailDataArray.length) {

                                pluginsDetailDataArray.forEach(function (pluginDetailDataObject,index) {
                                    traverse(ContentHome.info.data.content.entity, 1, pluginDetailDataObject);
                                    if(index==(pluginsDetailDataArray.length-1))
                                        dltObj(ContentHome.info.data.content.entity);
                                    $scope.$digest();
                                })
                            }
                        }

                        if (!ContentHome.info.data._buildfire) {
                            ContentHome.info.data._buildfire = {
                                plugins: {
                                    dataType: "pluginInstance",
                                    data: []
                                }
                            };
                        }

                        if (!ContentHome.info.data.design) {
                            ContentHome.info.data.design = {
                                bgImage: null,
                                selectedLayout: 1
                            };
                        }

                    }

                });


                function dltObj(itemArr) {
                    setTimeout(function(){
                        for (var i = 0; i < itemArr.length; i++) {
                            if (itemArr[i].title === '') {
                                itemArr.splice(i, 1);
                                $scope.$digest();
                            } else {
                                if (itemArr[i].items) {
                                    dltObj(itemArr[i].items);
                                }else{
                                    delete itemArr[i].found ;
                                }
                            }
                        }
                    },1000)
                }


                function traverse(x, level, pluginDetailData) {
                    if (isArray(x)) {
                        traverseArray(x, level, pluginDetailData);
                    } else if ((typeof x === 'object') && (x !== null)) {
                        traverseObject(x, level, pluginDetailData);
                    } else {
                        console.log(level + x);
                    }
                }

                function isArray(o) {
                    return Object.prototype.toString.call(o) === '[object Array]';
                }

                function traverseArray(arr, level, pluginDetailData) {
                    console.log(level + "<array>");
                    arr.forEach(function (x) {
                        traverse(x, level + "  ", pluginDetailData);
                    });
                }

                function traverseObject(obj, level, pluginDetailData) {
                    console.log(level + "<object>");

                    if (obj.hasOwnProperty('items')) {
                        if (obj.items.length) {
                            //   console.log(level + "  " + key + ":");
                            traverse(obj['items'], level + "    ", pluginDetailData);
                        }
                    }
                    else {
                        if (obj.instanceId == pluginDetailData.instanceId) {
                            console.log('??pluginDetailData', pluginDetailData);
                            obj.title = pluginDetailData.title;
                            obj.iconUrl = pluginDetailData.iconUrl;
                            obj.pluginTypeName = pluginDetailData.pluginTypeName;
                            obj.found=1;
                        } else {
                            if (!(obj.found && obj.found == 1)) {
                                console.log('->>>>>>>>>>>>>>>>>>remove this object :', obj);
                                deletePluginArray.push(obj);
                                obj.title = '';
                                obj.iconUrl = '';
                                obj.pluginTypeName = '';
                                obj.found = 0;

                            }
                        }
                    }
                }

                function init() {
                    var success = function (data) {
                        if (data && data.data && (data.data.content || data.data.design)) {
                            updateMasterInfo(data);
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
                    console.log('info------------------------------------------ change', angular.equals(info, masterInfo));
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
                        ContentHome.advancedFolderInfo.get().then(function (d) {
                            console.log('d>>>>', d);
                            updateMasterInfo(d);
                            ContentHome.info = d;
                        }, function () {

                        });

                        console.log('Data saved successfully---------------from content-----------', data);
                    };
                    var saveError = function (err) {
                        console.error('Error while saving data------------------------------', err);
                    };
                    if (_info.id)
                        ContentHome.advancedFolderInfo.update(_info.id, _info.data).then(updateSuccess, saveError);
                    else
                        ContentHome.advancedFolderInfo.save(_info.data).then(saveSuccess, saveError);
                }

                function updateInfoData(_info) {
                    $timeout.cancel(timerDelay);
                    if (_info && _info.data && !isUnchanged(_info)) {
                        timerDelay = $timeout(function () {
                            saveData(_info);
                        }, 1000);
                    }
                }

                $scope.$watch(function () {
                    return ContentHome.info;
                }, updateInfoData, true);

                $scope.toggle = function (scope) {
                    scope.toggle();
                };

                $scope.collapseAll = function () {
                    $scope.$broadcast('angular-ui-tree:collapse-all');
                };

                $scope.expandAll = function () {
                    $scope.$broadcast('angular-ui-tree:expand-all');
                };

            }]);
})(window.angular);