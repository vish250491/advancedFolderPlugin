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
                    "_buildfire":[

                    ],
                    "content": {
                        "images": [
                            {
                                "action": "noAction",
                                "iconUrl": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/4f6c85e0-fa2e-11e5-a163-758fec3c9ebe.jpg",
                                "title": "image"
                            },
                            {
                                "action": "noAction",
                                "iconUrl": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/50e0af50-fa2e-11e5-a163-758fec3c9ebe.jpg",
                                "title": "image"
                            }
                        ],
                        "description": "<p>&nbsp;Instant way to group all applications into group wise.</p>",
                        "entity": [
                            {
                                "title": "A",
                                "iconUrl": "",
                                "fileUrl": "",
                                "items": []
                            },
                            {
                                "title": "B",
                                "iconUrl": "",
                                "fileUrl": "",
                                "items": []
                            },
                            {
                                "title": "C",
                                "iconUrl": "",
                                "fileUrl": "",
                                "items": []
                            },
                            {
                                "title": "D",
                                "iconUrl": "",
                                "fileUrl": "",
                                "items": []
                            }
                        ]
                    },
                    "design": {
                        "itemListLayout": "list-layout1",
                        "bgImage": {
                            "i16x9": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/08facfd0-fa2f-11e5-a163-758fec3c9ebe.jpg",
                            "i3x2": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/08facfd0-fa2f-11e5-a163-758fec3c9ebe.jpg",
                            "i4x3": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/08facfd0-fa2f-11e5-a163-758fec3c9ebe.jpg",
                            "i16x10": "http://imageserver.prod.s3.amazonaws.com/b55ee984-a8e8-11e5-88d3-124798dea82d/08facfd0-fa2f-11e5-a163-758fec3c9ebe.jpg"
                        }
                    }

                }
            }
        });

})(window.angular);