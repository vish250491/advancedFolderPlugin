

#1. Architecture/Technology stacks:

* [BuildFire APIs](https://github.com/BuildFire/sdk/blob/master/scripts/buildfire.js)
* [AngularJS](https://docs.angularjs.org/guide)
* [angular-ui-tree] (https://github.com/angular-ui-tree/angular-ui-tree)

BuildFire will provide us with methods for fetching and updating information on the server.
Advance Folder API will provide us with verification and streaming of the Advance Folder tracks.
In AngularJS, we will follow MVVM design pattern.

Included methods of BuildFire’s API are
* [buildfire.datastore](https://github.com/BuildFire/sdk/wiki/How-to-use-Datastore)
* [buildfire.imageLib](https://github.com/BuildFire/sdk/wiki/How-to-use-ImageLib)
* [buildfire.navigation](https://github.com/BuildFire/sdk/wiki/How-to-use-Navigation)
* [buildfire.spinner](https://github.com/BuildFire/sdk/wiki/Spinners)
* [buildfire.components.carousel](https://github.com/BuildFire/sdk/wiki/BuildFire-Carousel-Component)
* [buildfire.messaging](https://github.com/BuildFire/sdk/wiki/How-to-use-Messaging-to-sync-your-Control-to-Widget)

For more information refer to BuildFire Wiki.

Angular-Animate is the angularjs module that will help us on performing animations. Angular-Route is used to navigate to different view in app.


#2.  Standardization:

* **Lazy Loading**: We will use ngInfiniteScroll for lazy loading. We will fetch 15 items on every single hit.

* **Caching**: Caching will be done by buildfire API mainly. It includes Image caching API buildfire.imageLib.

* **Refreshing**: Refreshing will be disabled for this plugin. We are using
* **buildfire.datastore.onUpdate**: to subscribe to changes in buildfire database. Whenever there is change in the data, it will be updated in the widget/simulator.

* **Styling**: UI Design will be done using [BuildFire-Style-Helper-Documentation](https://github.com/BuildFire/sdk/wiki/BuildFire-Style-Helper-Documentation). It has pre build style classes that we can use to improve UX of the plugin.



#3. DataBase Model:


Database model is not directly exposed to the user. BuildFire provides buildfire.datastore to fetch and update data on server. It is a black box for user.

The database should be unique as appId,pluginId, instanceId, tag and obj. Here the composite key of appId and pluginId should be every single app.

The Database schema is as follows:
Tag Name - “AdvanceFolderInfo”

    {
    "content": {
    "carouselImages": [{
            "url": "",
            "title": "",
            "link": ""
        }],
        "body": "",
        "entity": [{
                "id": 1,
                "title": "folder1",
                link: ‘’ "items": [{
                    "id": 11,
                    "title": "folder1.1",
                    "items": [{
                        "id": 111,
                        "title": "plugin1.1.1",
                        "items": []
                    }]
                }, {
                    "id": 12,
                    "title": "plugin1.2",
                    "items": []
                }]
            }

        ],

        "design": {
            "itemListLayout": "",
            "bgImageMostDevices": "",
            "bgImageIphone": "",
            "bgImageIpad": "",
            "bgImageTablet": ""
        }
    }


#4. Front-end:

The plugin is divided into two main sections:

##a. Control Panel(CP) :
This will provide user with basic CRUD operations for the data to be shown on the widget section.

CP is further divided into two sections:

###1 Content section




This section contains CRUD for carousel images to be shown on widget part. Images can be sorted manually. It also provides a “wysiwyg” text editor for body content. Last part is the “Plugin Details”, where a user can create a new folder and Add a new plugin instance.
On clicking create folder , user is asked to enter a title for newly created folder.
Created folder can be placed anywhere inside another folder. These folder list can be dragged and dropped for doing the same operation. Each item (folder ) can be deleted or moved upside hierarchy or downside hierarchy.


###2 . Design section



This section lets user to choose the appearance of the data in widget section.

There are two options to modify the look and feel of the widget:
* Item List Layout
* Item List Background Image


















## b. Widget Panel(App):
Widget: This is the basic Emulator where user can see the real-time changes whenever there is any change in control panel. User can see containers and plugins list inside a listLayout.
user can navigate inside the folder. By clicking on plugin user can navigate to that particular plugin.
after that on pressing back button, it again get back to Advance Folder Root layout.



#5. Unit Testing Framework and Test Runner:

Karma : A test runner.
Jasmine : A behavior-driven development framework for testing JavaScript code  mostly used in angularJS unit testing.


#6. FAQ
## APP
* Q1. What happens when you click on a container?
 The container you’ve clicked on will transition in like a normal page and will show you all of the plugins and other containers that exist inside of it.

* Q2. What happens when you are in a container and you click the back button?
 It will take you back to the page from which you came.
If you came from another container, it should take you back to the previous container.
If you came from the first tier of the advanced folder, it should take you back to it.

* Q3. Does the container have the same carousel and wysiwyg information as the master folder?
 No. At this time, the containers will not have carousel or wysiwyg information. It will only show a list of the plugins or containers inside of it.

* Q4. What layout should the containers use?
 The containers will use the same layout as what the user has selected in the “design tab”


## CONTROL PANEL
* Q5. What happens when you click on a container?
It will take you inside that container in the CP emulator and show you all of the plugins and other containers that exist inside of it.
However, It WILL NOT take you to a different page in the CP.
Note: If the container is collapsed when the user clicks on it either through the CP or emulator, expand it to reveal the contents inside of it.

* Q6. Can you have containers inside of other containers?
Yes

* Q7. Can you place a folder inside a plugin instance?
You should definitely be able to place plugin instances (of any kind) inside containers. If it is possible to make it so that the user can drag plugins into other folders, that would be great, but it is not absolutely necessary for phase 1

* Q8. How does drag and drop work?
It should work as close to the menu in this video as possible: https://www.youtube.com/watch?v=lrJuV6CUxlc

