Template.desktopDotCard.onCreated(function(){
  Session.set('spinnerOn', false);

  //TBD:
  Session.set('dotInsideToListsBug', false);


  let self = this;

  //TBD: this IF check if this is dot from Algolia:
  if ( !self.data.algolisSearchResult) {
    self.subs = new SubsManager({
      // maximum number of cache subscriptions
      cacheLimit: 10,
      // any subscription will be expire after 5 minute, if it's not subscribed again
      expireIn: 5
    });
    self.subs.subscribe('mobileDotCard', self.data.dot._id, self.data.dot.ownerUserId, self.data.connection.connectedByUserId);
    //self.subs.subscribe('user', self.data.dot.ownerUserId);
    //self.subs.subscribe('user', self.data.connection.connectedByUserId);
  }

});


Template.desktopDotCard.onDestroyed(function(){
  $('.disConnect').removeClass('active');
  $('.fa').removeClass('transparent');
});

Template.desktopDotCard.onRendered(function(){

    //$('[data-toggle="tooltip"]').tooltip();

});


Template.desktopDotCard.helpers({

  //subscriptionsReady: function(){
  //  return (Template.instance().dotCardReady.get() && Template.instance().ownerUserReady.get()
  //                              && Template.instance().connectedUserReady.get());
  //},
  dataCard: function(){

    if (this.algolisSearchResult) {
      console.log("this.algolisSearchResult in dotCard >>>>>>>>>>> " + this.algolisSearchResult.title)
      let data = {
        dot: this.algolisSearchResult,
        smartRef: this,
        ownerUser: Meteor.users.findOne(this.dot.ownerUserId),
        connectedByUser: Meteor.users.findOne(this.connection.connectedByUserId)
      };
    return data;

    } else if (this.dot){

      let data = {
        dot: Dotz.findOne(this.dot._id),
        smartRef: this,
        ownerUser: Meteor.users.findOne(this.dot.ownerUserId),
        connectedByUser: Meteor.users.findOne(this.connection.connectedByUserId)
      };

      let subsManager = Template.instance();
      if(!data.dot){
        subsManager.subs.subscribe('mobileDotCard', this.dot._id, this.dot.ownerUserId, this.connection.connectedByUserId);
        //subsManager.subs.subscribe('dotCard', this.dot._id);
        //subsManager.subs.subscribe('user', this.dot.ownerUserId);
        //subsManager.subs.subscribe('user', this.connection.connectedByUserId);
      }
      return data;

    }
  },

  //UI helpers:
  listShowOrDotShowClass: function() {
    if ( Template.parentData(2).dot &&
      (Template.parentData(2).dot.dotType === "List" || Template.parentData(2).dot.dotType === "shareList") ) {
      return ("inListShow")
    } else if ( Template.parentData(1).inSearchResults ) {
      return (Template.parentData(1).inSearchResults);
    } else {
      return ("inDotShow")
    }
  },

  dotCoverImageUrlOrFb: function() {
    if ( this.dot && this.dot.dotType === "FBDot" ) {
      //authorFbProfile:
      //console.log("this.dot.facebookAuthorId >>>>> " + this.dot.facebookAuthorId)
      return 'http://graph.facebook.com/'+ this.dot.facebookAuthorId + '/picture/?type=large';
    } else if (this.dot) {
      return this.dot.coverImageUrl;
    }
  },


  isInDotShow: function() {
    if ( Template.parentData(2).dot ) {
      return (Template.parentData(2).dot.dotType === "Dot");
    }
  },

  isInListShow: function() {
    if ( Template.parentData(2).dot && Template.parentData(2).dot.dotType ) {
      return (Template.parentData(2).dot.dotType === "List" || Template.parentData(2).dot.dotType === "shareList");
    }
    //else if ( Template.parentData(1).inSearchResults ) {
    //  return (Template.parentData(1).inSearchResults);
    //}
  },

  inDotParentSearchResults: function() {
    if ( Template.parentData(1).inDotParentSearchResults ) {
      return ("-inSearch");
    }
  },
  //end UI helpers

  //create specific SESSION!!!! TBD
  isInOpenList: function() {
    //The big if is for Feed that doesn't have these data.
    if (Template.parentData(2).username || Template.parentData(2).dot){
      if (Template.parentData(2).username) {
        return false;
      }
      else if (Template.parentData(2).dot.isOpen) {
        return true;
      }
    }

  },

  isInClosedList: function() {
    // We are at parent USER: so it's close list.
    if (Template.parentData(2).username || Template.parentData(2).dot) {
      if (Template.parentData(2).username) {
        return true;
      }
      //NEED TO FIX IT FOR DOT SHOW
      else if (!Template.parentData(2).dot.isOpen) {
        return true;
      }
    }
  },

  isListCard: function() {
    return (this.dot && this.dot.dotType === "List" || this.dot && this.dot.dotType === "shareList");
  },

  isMyDot: function() {
    return (this.dot && this.dot.ownerUserId === Meteor.userId())
  },

  isConnected: function() {
    return ( this.smartRef.connection.connectedByUserId === Meteor.userId() )
  },

  isMyDotOrMyConnection: function() {
    return ( (this.dot && this.dot.ownerUserId === Meteor.userId()) || (this.smartRef.connection.connectedByUserId === Meteor.userId()) );
  },

  sortIsAvailable: function() {
    let parentDot = Dotz.findOne(this.smartRef.connection.toParentDotId);
    if (parentDot && !parentDot.isOpen) {
      return ( parentDot.ownerUserId === Meteor.userId() )
    }
  },



  actionNameIsConnect: function(){
    if (this.smartRef && this.smartRef.connection) {
      return (this.smartRef.connection.actionName === 'Connect');
    }
  },

  actionDate: function(){
    if (this.dot && this.dot.createdAtDate) {
      return (moment(this.dot.createdAtDate).fromNow())
    }
  },

  eventDate: function(){
    //if ( this.dot && this.dot.startRepeatedDate && this.dot.endRepeatedDate ) {
    //  return ("Multiple Events (" + moment(this.dot.startRepeatedDate).format('ddd DD MMM')
    //  + " - " + moment(this.dot.endRepeatedDate).format('ddd DD MMM') + ")");
    //}
    //else if (this.dot && this.dot.multipleEventsNote ) {
    //  return ("Multiple Events (" + this.dot.multipleEventsNote + ")");
    //}
    //else if ( this.dot && this.dot.endRepeatedDate ) {
    //  return ("Multiple Events (until " + moment(this.dot.endRepeatedDate).format('ddd DD MMM') + ")");
    //}
    //else if ( this.dot && this.dot.startRepeatedDate ) {
    //  return ("Multiple Events (from " + moment(this.dot.startRepeatedDate).format('ddd DD MMM') + ")");
    //}
    //else if (this.dot && this.dot.startDateAndHour) {
    //  return ( moment(this.dot.startDateAndHour).format('ddd DD MMMM, h:mm A') );
    //}
    if (this.dot && this.dot.multipleEventsNote && this.dot.startDateAndHour && this.dot.endDateAndHour ) {
      return ("Multiple Events (" + moment(this.dot.startDateAndHour).format('DD MMM') + " - " + moment(this.dot.endDateAndHour).format('DD MMM') + ")");
    }
    else if (this.dot && this.dot.multipleEventsNote ) {
      return ("Multiple Events (" + this.dot.multipleEventsNote + ")");
    }
    else if ( this.dot && this.dot.startDateAndHour ) {
      return ( moment(this.dot.startDateAndHour).format('ddd DD MMMM, h:mm A') );
    }
  },

  shortenAddress: function(){
    if (this.dot && this.dot.location && this.dot.location.address) {
      return s.prune(this.dot.location.address, 30);
    }
  },

  placeOrEvent: function(){
    if ((this.dot.dotSubType === "Place") || (this.dot.dotSubType === "Event"))  {
      return true;
    }
  },

  isLink: function(){
    if (this.dot && ( (this.dot.dotSubType === "Link") || (this.dot.dotSubType === "Media") ) )  {
      return ("-Link");
    }
  },

  userIsTheDotCreator: function() {
    if (this.ownerUser && this.connectedByUser){
      return (this.ownerUser.username === this.connectedByUser.username)
    }
  },

  personalDescriptionOrBodyText: function() {
    if (this.dot){
      if (this.smartRef.connection.personalDescription) {
        return ( ' " ' + s.prune(this.smartRef.connection.personalDescription, 100) + ' " ');
      }
      else {
        return s.prune(this.dot.bodyText, 100);
      }
    }
  },

  title: function() {
    if (this.dot && this.smartRef.connection.personalDescription){
      return this.smartRef.connection.personalDescription;
    }
    else if (this.dot && this.dot.title) {
      return this.dot.title;
    }

  },

  shortenBodyText: function() {
    if (this.dot){
      return s.truncate(this.dot.bodyText, 110);
    }
  },

  dotzNum: function() {
    if (this.dot && this.dot.showDotzCounter === false) {
      return false;
    }
    let connectedDotz = 0;
    if (this.dot && this.dot.connectedDotzArray) {
      connectedDotz = this.dot.connectedDotzArray.length;
    }
    if (connectedDotz == 0){
      return false;
    }
    else{
      return (connectedDotz );
    }


  },

  dotOrDotz: function() {
    let connectedDotz = 0;
    if (this.dot && this.dot.connectedDotzArray) {
      connectedDotz = this.dot.connectedDotzArray.length;
    }

    if ( connectedDotz === 1 ) {
      return ("Dot");
    }
    else {
      return ("Dotz");
    }
  },

  connectCounter: function() {
    //check if this dot is exist (to avoid some errors during delete action)
    let counter;
    if (this.dot) {
      let dot = Dotz.findOne(this.dot._id);
      if (dot) {
        counter = dot.inDotz.length + dot.totalUpvotes.length;
      }

      //counter show:
      if (counter && counter === 0) {
        return ("");
      }
      else if (counter) {
        return ( "(" + counter + ")" );
      }
    }
  },

  likeCounter: function(){
    if (this.smartRef.connection.likes.length > 0) {
      return this.smartRef.connection.likes.length;
    }
  },

  isLikedByMe: function(){
    let likersArray = this.smartRef.connection.likes;
    if ( likersArray.indexOf( Meteor.userId() ) >= 0 ) {
      return true
    }

  },

  shareList: function(){
    return Session.get('shareListActive');
  },

  alreadyShared: function(){
    let sharedDot = Dotz.findOne(Session.get('shareListActive'));
    let alreadyAdded = false;
    let self = this;
    if (self.dot && sharedDot && sharedDot.connectedDotzArray){
      sharedDot.connectedDotzArray.forEach(function(smartRef){
        if (smartRef.dot._id === self.dot._id){
          alreadyAdded = true;
        }
      });
    }
    return alreadyAdded;
  },

  omgAllowed: function(){
    if (Meteor.userId()) {
      let username = Meteor.user().username;
      if ( username === "Dotz" || username === "Otni" || username === "Aviv Hatzir" || username === "Yoav Sibony" || username === "Zur Tene" ) {
        return true
      }
    }
  }

});

Template.desktopDotCard.events({

  'click ._shareFacebookDialog': function(event){
    event.preventDefault();
    FB.ui({
      method: 'share',
      href: 'http://dotz.city/'+ this.dot.dotSlug
    }, function(response){});
  },

  'click ._omgBtn': function(event){
    Meteor.call('omgCall', this.smartRef);
  },

  'click .like': function(event){
    event.preventDefault();

    if ( Meteor.user() ) {
      Modules.both.Dotz.likeDot(this.smartRef, Meteor.userId());
      //Modules.client.Dotz.dotCardAnalyticsEvents('Like', 'Liked: ',this.dot._id, this.dot.title, this.dot.dotType)
    }
    else{
      Modal.show('signUpModal');
      //Modules.client.Dotz.dotCardAnalyticsEvents('Like', 'Liked: ',this.dot._id, this.dot.title, this.dot.dotType);
    }

  },

  'click .unlike': function(event){
    Meteor.call('unLikePost', Meteor.userId(), this._id);
    //Modules.client.Dotz.dotCardAnalyticsEvents('Unliked', 'Unliked: ',this.dot._id, this.dot.title, this.dot.dotType);
  },


  //'click .h2Title': function(event){
  //  Session.set('dotSlug', this.dot.dotSlug);
  //},
  //'click ._setCurrentPath': function(){
  //  if(parentDot = Template.parentData().dot){
  //    let parentDot = Template.parentData().dot;
  //    let parentInfo = {slug: FlowRouter.current().path, title: parentDot.title, coverImage: parentDot.coverImageUrl};
  //    Session.set('lastPath', parentInfo);
  //  }
  //  else{
  //    let parentUser = Template.parentData();
  //    let parentInfo = {slug: FlowRouter.current().path, title: parentUser.username, coverImage: parentUser.profile.coverImage};
  //    Session.set('lastPath', parentInfo);
  //  }
  //},
  'click .connect': function(){

    console.log("this.dot >>>>>> " + this.dot._id)
    if(Meteor.user()) {
      Modal.show('mobileConnectDotModal',{
        data:{
          dot: this.dot,
          connectToMyLists: true
        }
      });
      //Modules.client.Dotz.dotCardAnalyticsEvents('Enter Connect Modal', 'Try to connect: ',this.dot._id, this.dot.title, this.dot.dotType);
    }
    else {
      Modal.show('signUpModal');
      //Modules.client.Dotz.dotCardAnalyticsEvents('Enter Connect Modal', 'Try to connect: ',this.dot._id, this.dot.title, this.dot.dotType);
    }

  },

  'click ._disConnectBtn': function(event){
    $(event.currentTarget).toggleClass('active');
    $(event.currentTarget.childNodes[1]).toggleClass('transparent');
    $(event.currentTarget).css("outline", "none");
    Meteor.call('disConnectDot',this.smartRef);
    //Modules.client.Dotz.dotCardAnalyticsEvents('Disconnect', 'Disconnected: ',this.dot._id, this.dot.title, this.dot.dotType);

  },

  'click .addTags': function(){

    if(Meteor.user()) {
      console.log("addTags: this.dot, this.smartRef >>>> " + this.dot + "and" + this.smartRef);
      Modules.client.tagTheDot_settings(this.dot, this.smartRef.connection.toParentDotId);

      //console.log("addTags>>>>>> here")
      //Modal.show('addTagsModal',{
      //  data:{
      //    "dot._id": this.dot._id,
      //    "dot.selfSuperTags": this.dot._id,
      //    "parentDot._id": this.smartRef.connection.toParentDotId,
      //    "parentDot.superTagsToFilterConnectedDotz": Template.parentData().dot.superTagsToFilterConnectedDotz
      //  }
      //});
      //Modules.client.Dotz.dotCardAnalyticsEvents('Enter Connect Modal', 'Try to connect: ',this.dot._id, this.dot.title, this.dot.dotType);
    }
    else {
      Modal.show('signUpModal');
      //Modules.client.Dotz.dotCardAnalyticsEvents('Enter Connect Modal', 'Try to connect: ',this.dot._id, this.dot.title, this.dot.dotType);
    }

  },

  'click .upBtn':function(event){
    //console.log("UP: ");
    let smartRef = this.smartRef;
    let sortValue = 1;
    Modules.both.Dotz.sortDotz(smartRef, sortValue);
    //Modules.client.Dotz.dotCardAnalyticsEvents('User sort: Up', 'Moved Up: ',this.dot._id, this.dot.title, this.dot.dotType);
  },

  'click .downBtn':function(event){
    //console.log("DOWN: ");
    let smartRef = this.smartRef;
    let sortValue = -1;
    Modules.both.Dotz.sortDotz(smartRef, sortValue);
    //Modules.client.Dotz.dotCardAnalyticsEvents('User sort: Down', 'Moved Down: ',this.dot._id, this.dot.title, this.dot.dotType);
  },

  'click #_editDotCardBtn': function(){
    console.log("this.dot, this.smartRef >>>> " + this.dot + "and" + this.smartRef)
    Modules.client.editDot_settings(this.dot, this.smartRef);
    //Modules.client.Dotz.dotCardAnalyticsEvents('Edit Dot', 'Start Edit: ',this.dot._id, this.dot.title, this.dot.dotType);
  },

  'click .delete':function(event){
    event.preventDefault();

    Meteor.call('deleteDot', this.dot, this.smartRef.connection.toParentDotId);
    //Modules.client.Dotz.dotCardAnalyticsEvents('Delete', 'Deleted: ',this.dot._id, this.dot.title, this.dot.dotType);
  },

  //TBD - reset the search in page result in other way
  'click ._setCurrentPath': function(){
    Session.set('searchInput',undefined);
    $('#searchBoxInput').val("")
  },

  //Add dot from the search results:
  'click #addDotToCurrentDot': function(){
    let currentDot = this.dot;
    let parentDot = Template.parentData(3).dot;
    Meteor.call('checkIfUserAuthoriseForConnect', parentDot._id, function(error, result){
      if(result === true){
        Modal.show('searchForConnectAddPersonalDescriptionModal', {
          data:{
            dot: currentDot,
            parentDot: parentDot
          }
        });
      }
      else{
        Modal.show('signUpModal');
      }
    })
  },

  'click .shareListInstant': function(event){
    event.preventDefault();
    let dotId = this.dot._id;
    if (Session.get('shareListActive')){
      let smartRef = new Modules.both.Dotz.smartRef(dotId,Meteor.userId(),Session.get('shareListActive'), CONNECT_ACTION, Meteor.userId());
      Meteor.call('addDotToConnectedDotzArray', smartRef, function (error, result) {
        if (error) {
          console.log(error);
        }
        else{
          console.log('success');
        }
      });
    }
  },

  'click .shareList': function(event) {
    event.preventDefault();
    let dotId = this.dot._id;
    //Normal process:
    let doc = {
      title: "Share",
      dotType: "shareList",
      createdAtDate: new Date(),
      ownerUserId: Meteor.userId(),
      inDotz: [Meteor.user().profile.shareDotId],
      isOpen: false,
      coverImageUrl: "https://dotz-dev-images.s3.amazonaws.com/jRZGh5cHJ3CmLqopk/SendDotzList.jpg"
    };
    Meteor.call('insertDot', doc, function (error, result) {
      if (error) {
        console.log(error);
      }
      else {
        Session.set('shareListActive', result);
        let shareDotId = result;
        let smartRef = new Modules.both.Dotz.smartRef(result, Meteor.userId(), Meteor.user().profile.shareDotId, CONNECT_ACTION, Meteor.userId());
        if (!error) {
          Meteor.call('addDotToConnectedDotzArray', smartRef, function (error, result) {
            if (error) {
              console.log(error);
            }
            else {
              Meteor.call('updateDotSlug',doc, shareDotId, (Math.random()).toString(),function(error,result){
                if (error){
                  console.log(error);
                }
                else{
                  console.log(result);
                  let smartRef = new Modules.both.Dotz.smartRef(dotId, Meteor.userId(),shareDotId, CONNECT_ACTION, Meteor.userId());
                  Meteor.call('addDotToConnectedDotzArray', smartRef, function (error, result) {
                    if (error) {
                      console.log(error);
                    }
                    else{
                    }
                  });
                }
              })
            }
          });
        }
        else {
          console.log("Error" + error);
        }
      }
    });
  }
});
