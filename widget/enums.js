(function (angular) {
    "use strict";
    angular
        .module('advancedFolderWidgetEnums', [])
        .constant('CODES', {
            NOT_FOUND: 'NOTFOUND',
            SUCCESS: 'SUCCESS'
        })
        .constant('MESSAGES', {
            ERROR: {
                NOT_FOUND: "No result found",
                CALLBACK_NOT_DEFINED: "Callback is not defined",
                ID_NOT_DEFINED: "Id is not defined",
                DATA_NOT_DEFINED: "Data is not defined",
                OPTION_REQUIRES: "Requires options"
            }
        })
        .constant('COLLECTIONS', {
            advancedFolderInfo: "advancedFolderInfo"
        })
        .constant('DEFAULT_DATA', {
            ADVANCED_FOLDER_INFO: {
                data: {
                    _buildfire: {
                        plugins: {
                            dataType: "pluginInstance",
                            data: [],
                        }
                    },
                    content: {
                        images: [],
                        description: '',
                        entity:[]
                    },
                    design: {
                        itemListLayout: "list-layout1",
                        bgImage: ""
                    }
                }
            }
        });

})(window.angular);