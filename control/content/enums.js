(function (angular) {
    "use strict";
    angular
        .module('advancedFolderContentEnums', [])
        .constant('CODES', {
            NOT_FOUND: 'NOTFOUND',
            SUCCESS: 'SUCCESS'
        })
        .constant('EVENTS', {
            OPEN_FOLDER: 'OPENFOLDER'
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
                    "_buildfire": {
                        "plugins" :{
                            "dataType" : "pluginInstance",
                            "data": []
                        }

                    },
                    "content": {
                        "images": [
                            {
                                "action": "noAction",
                                "iconUrl": "http://imageserver.prod.s3.amazonaws.com/1460958791423-042123055388219655/e116e1b0-0529-11e6-ad9d-6f08d19b7913.jpg",
                                "title": "image"
                            },
                            {
                                "action": "noAction",
                                "iconUrl": "http://imageserver.prod.s3.amazonaws.com/1460958791423-042123055388219655/e1729640-0529-11e6-aae4-45742639c60d.jpg",
                                "title": "image"
                            }
                        ],
                        "description": "<p>With the Advanced Folder plugin you can add existing plugins, create new plugins, or create groups so that you can group your plugins together in a hierarchy. Check out our tutorial in our knowledge base for more information. HINT: You'll also want to check out our article on the WYSIWYG</p>",
                        "entity": [
                            {
                                "title": "This is a group",
                                "iconUrl": "",
                                "fileUrl": "",
                                "items": [
                                    {
                                        "title": "You can add contents inside",
                                        "iconUrl": "",
                                        "fileUrl": "",
                                        "items": []
                                    }
                                ]
                            },
                            {
                                "title": "This is another group",
                                "iconUrl": "",
                                "fileUrl": "",
                                "items": [
                                    {
                                        "title": "Add plugins or other groups",
                                        "iconUrl": "",
                                        "fileUrl": "",
                                        "items": []
                                    }
                                ]
                            }
                        ]
                    },
                    "design": {
                        "itemListLayout": "list-layout1",
                        "bgImage": {
                            "i16x9": "",
                            "i3x2": "",
                            "i4x3": "",
                            "i16x10": ""
                        },
                        "hideText" : false
                    },
                    'default' : 'true'

                }
            }
        });

})(window.angular);