/**
 * @author Till Hermsen
 * @date 11.10.12
 */
blogPostScreenContract = {

    init: function() {}

}

blogPostScreen = {

    hub: null,

    // Services
    userService: null,
    blogPostFrontendService: null,
    mainScreenService: null,
    loginScreenService: null,

    // HTML Templates

    // HTML selectors


    /**
     * Method returning the component <b>unique</b>
     * name. Using a fully qualified name is encouraged.
     * @return the component unique name
     */
    getComponentName: function() {
        return 'blogPostScreen';
    },

    /**
     * Configure method. This method is called when the
     * component is registered on the hub.
     * @param theHub the hub
     * @param the object used to configure this component
     */
    configure: function(theHub, configuration) {
        this.hub = theHub;

        // Required services
        this.hub.requireService({
            component: this,
            contract: userServiceContract,
            field: "userService"
        });
        this.hub.requireService({
            component: this,
            contract: blogPostFrontendContract,
            field: "blogPostFrontendService"
        });
        this.hub.requireService({
            component: this,
            contract: mainScreenContract,
            field: "mainScreenService"
        });
        this.hub.requireService({
            component: this,
            contract: loginScreenContract,
            field: "loginScreenService"
        });

        // Provide service
        this.hub.provideService({
            component: this,
            contract: blogPostScreenContract
        });

        // Configuration
    },

    /**
     * The Start function
     * This method is called when the hub starts or just
     * after configure if the hub is already started.
     */
    start: function() {},

    /**
     * The Stop method is called when the hub stops or
     * just after the component removal if the hub is
     * not stopped. No events can be send in this method.
     */
    stop: function() {},


    /**
     * Contract methods.
     */

    init: function(postId) {
        var self = this;

        self.hub.publish(self, "/blogPostScreen/refresh", self.refresh);

        var mainContainer = self.mainScreenService.getMainContainer();

        /**
         * Interaction listeners
         */
        var onAddCommentClicked = function() {
            if (!self.userService.isLoggedIn()) {
                mainContainer.stack.push(self.loginScreenService.init());
            }
            else {
                mainContainer.stack.push(App.AddCommentScreen.get());
                App.AddCommentScreen.refresh(null);
            }
        }


        var view = new joCard([
            new joGroup(
                new joFlexcol([
                    new joHTML("<div id='blogPostContainer' />"),
                    new joDivider(),
                    new joHTML("<h4>Comments</h4>"),
                    new joHTML("<div id='commentList' />"),
                    new joButton("Add comment").selectEvent.subscribe(onAddCommentClicked)
                ])
            )
        ]);

        mainContainer.stack.push(view);

        var data = {
            data: {
                postId: postId
            }
        }

        self.refresh(data);
    },


    /**
     * Private methods.
     */

    refresh: function(event) {
        var postId = (event.data.postId) ? event.data.postId : null;
        if (postId === null) { return; }

        if ($('#blogPostContainer').length > 0) {
            this.blogPostFrontendService.updateWithBlogPost(postId);
        }

        if ($('#commentList').length > 0) {
            this.blogPostFrontendService.updateWithComments(postId);
        }
    }

}
