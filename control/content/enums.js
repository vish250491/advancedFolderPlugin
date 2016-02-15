(function (angular) {
    "use strict";
    angular
        .module('advancedFolderContentEnums', [])
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
                    content: {
                        images: [],
                        description: '',
                        advancedFolderClientID: '',
                        link: ''
                    },
                    design: {
                        itemListLayout: "list-layout1",
                        bgImage: ""
                    }
                }
            }
        });

})(window.angular);