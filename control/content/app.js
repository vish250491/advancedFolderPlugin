(function (angular, buildfire) {
    "use strict";
    //created advancedFolderContent module
    angular
        .module('advancedFolderPluginContent',
        [
            'ngAnimate',
            'ui.bootstrap',
            'advancedFolderContentServices',
            'advancedFolderContentEnums',
            'ui.tinymce',
            'ui.tree',
            'advancedFolderModals'
        ])
        .directive("loadImage",['dynamicData' ,function (dynamicData) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                   element.attr("src", JSON.parse(attrs.finalsrc).iconUrl);

                    var _img = JSON.parse(attrs.finalsrc).iconUrl;
                    var instanceId=JSON.parse(attrs.finalsrc).instanceId;
                   var widthIcon= parseInt(attrs.cropwidth);
                    var heightIcon =parseInt(attrs.cropheight);

                  //  buildfire.datastore.getWithDynamicData('advancedFolderInfo', function (err, result) {
                        //    console.log(result.data._buildfire.pluginsresult.result);
                    dynamicData.getDynamicData().forEach(function(obj){
                            if(instanceId==obj.data.instanceId){

                                _img= obj.data.iconUrl;
                                replaceImg (buildfire.imageLib.cropImage(_img, {
                                    width: widthIcon,
                                    height: heightIcon
                                }));

                              //  return Buildfire.imageLib.cropImage(obj.data.iconUrl, options);
                            }
                        })
                   // });


                    function replaceImg(finalSrc) {
                        var elem = $("<img>");
                        elem[0].onload = function () {
                            element.attr("src", finalSrc);
                            elem.remove();
                        };
                        elem.attr("src", finalSrc);
                    }
                }
            };
        }])
        .directive("updateTitle",['dynamicData', function (dynamicData) {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    element[0].textContent= JSON.parse(attrs.updateTitle).title;

                    console.log('updateTitle-------------------',scope,element,attrs);
                    var instanceId=attrs.updateTitle && JSON.parse(attrs.updateTitle).instanceId;


                    dynamicData.getDynamicData().forEach(function(obj){
                            if(instanceId==obj.data.instanceId){
                             //   out=obj.data.title;
                                replaceTitle(obj.data.title);
                            }
                        });

                    function replaceTitle(finalSrc) {

                        element[0].textContent=finalSrc;
                    }
                }
            };
        }])
        //injected ui.bootstrap for angular bootstrap component
        .config(['$httpProvider', function ($httpProvider) {
            var interceptor = ['$q', function ($q) {
                var counter = 0;

                return {
                    request: function (config) {
                        buildfire.spinner.show();
                        counter++;
                        return config;
                    },
                    response: function (response) {
                        counter--;
                        if (counter === 0) {

                            buildfire.spinner.hide();
                        }
                        return response;
                    },
                    responseError: function (rejection) {
                        counter--;
                        if (counter === 0) {

                            buildfire.spinner.hide();
                        }

                        return $q.reject(rejection);
                    }
                };
            }];
            $httpProvider.interceptors.push(interceptor);

        }]);
})
(window.angular, window.buildfire);
