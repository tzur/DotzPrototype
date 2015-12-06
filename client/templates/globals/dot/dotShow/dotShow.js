
Template.dotShow.onCreated(function() {

  let self = this;
  self.subs = new SubsManager({
    // maximum number of cache subscriptions
    cacheLimit: 10,
    // any subscription will be expire after 5 minute, if it's not subscribed again
    expireIn: 5
  });
  self.autorun(function() {
    if(!GoogleMaps.loaded()){
      GoogleMaps.load({key: "AIzaSyC35BXkB-3zxK89xynEq038-mE6Ts9Dg-0", libraries: 'places', language: 'en'});
    }
    FlowRouter.watchPathChange();
    let dotSlug = FlowRouter.current().path.slice(1);
    if (dotSlug) {
      self.subs.subscribe('dotShowByDotSlug', dotSlug, function(){
          let dotShow = Dotz.findOne({dotSlug: dotSlug});
          if (!dotShow){
            FlowRouter.go('/');
            Bert.alert('Page does not exist', 'danger');
          }
        }
      );
    }
    let currentDot = Dotz.findOne({"dotSlug": dotSlug});
    if (currentDot) {
      DocHead.setTitle("Dotz: " + currentDot.title);
      if (currentDot) {
        self.subs.subscribe('user', currentDot.ownerUserId);
        if(currentDot.dotType === "List"){
          analytics.page('List Show');
        }
        else{
          analytics.page('Dot Show')
        }
      }
    }





  });
});

Template.dotShow.onRendered(function(){

  Tracker.autorun(function () {
    FlowRouter.watchPathChange();
    window.scrollTo(0,0);


  });
});

Template.dotShow.onDestroyed(function(){

});


Template.dotShow.helpers({

  dotShow: function() {
    FlowRouter.watchPathChange();
    let dot = Dotz.findOne({ "dotSlug": FlowRouter.current().path.slice(1)});
    if (dot){
      let ownerUser = Meteor.users.findOne(dot.ownerUserId);
      let data = {
        dot: dot,
        ownerUser: ownerUser
      };
      return data;
    }
  },
  isOpenDot: function() {
    return this.dot.isOpen;
  },

  isListShow: function() {

    return (this.dot.dotType === "List" || this.dot.dotType ==="shareList");
  },

  userCanAutoGenerateDotz: function(){
    return ( this.dot.ownerUserId === Meteor.userId() && this.dot.quickStartListId )
  },

  isEmptyList: function() {
    return ( (this.dot.dotType === "List") && (this.dot.connectedDotzArray.length === 0) )
  },

  isMyDot: function() {
    return (this.dot.ownerUserId === Meteor.userId())
  },

  actionDate: function(){
    return (moment(this.dot.createdAtDate).fromNow())
  },

  eventDate: function(){
    if (this.dot.startDateAndHour) {
        return ( moment(this.dot.startDateAndHour).fromNow());
    }
  },

  connectCounter: function() {
    //check if this dot is exist (to avoid some errors during delete action)

      let counter = this.dot.inDotz.length;
      //counter show:
      if (counter && counter === 0) {
        return ("");
      }
      else if (counter) {
        return ( "(" + counter + ")" );
      }

  },
  dotzNum: function() {

      let connectedDotz = 0;
      if (this.dot.connectedDotzArray) {
        connectedDotz = this.dot.connectedDotzArray.length;
      }
      if (connectedDotz === 0) {
        return false;
      }
      else if (connectedDotz === 1) {
        return ("1 Dot")
      }
      else if (connectedDotz > 1) {
        return ( connectedDotz + " Dotz" );
      }

  },

  dotShowMapOptions: function(){
    if (GoogleMaps.loaded() && this.dot.locationLat) {
      // Map initialization options
      loc[0] = this.dot.location.latLng[0];
      loc[1] = this.dot.location.latLng[1];
      return {
        center: new google.maps.LatLng(loc[0], loc[1]),
        zoom: 13
      };
    }
  },

  connectedDotzArray: function() {
    return this.dot.connectedDotzArray;
  },

  addDotIsAvailable: function() {
    return ( Meteor.user() && ( this.dot.isOpen || (this.dot.ownerUserId === Meteor.userId()) ) )
  },

  dataForCreateHere: function() {
      return ( {
        dot: {_id: this.dot._id}
      });
  },

  workingOnQuickStart: function() {
    return Session.get('workingOnQuickStart');
  },
  dataForShare: function() {
    return {
      title: this.dot.title,
      author: "The author",
      summary: "Something",
      thumbnail: this.dot.coverImageUrl
    };
  }

});
Template.dotShow.events({

  //

  'click .connect': function(){
    if(Meteor.user()) {
      Modal.show('connectDotModal', {
        data: {
          dotId: this.dot._id,
          dot: this.dot
        }
      });
    }
    else{
      Modal.show('signUpModal');
    }
  },

  'click .editBtn': function(){
    Modal.show('editDotModal', {
      data:{
        'dot':this.dot,
        'actionTypeEdit': true
      }
    });
  },

  'click .deleteShow':function(event){
      Modules.both.Dotz.deleteDot(this.dot, this.dot.inDotz[0]);
      window.history.back();
  },

  'click #addUserConnection': function(){
    if ( Meteor.user() ) {
      Modal.show('connectDotBySreachModal');
    }
    else{
      Modal.show('signUpModal');
    }
  },

  'click #_lastPathBtn': function(){
    window.history.back();
  },
  'click .closeToOpen': function(){
    Meteor.call('closeToOpen', this.dot, function(error,result){
      if (error){
        console.log(error);
      }
    });
  },
  'click .openToClose': function(){
    Meteor.call('openToClose', this.dot, function(error,result){
      if (error){
        console.log(error);
      }
    })
  },

  'click #_generateAutoDotz': function() {
    Session.set('workingOnQuickStart', true);

    let self = this;

    setTimeout(function(){

      Meteor.call('autoGenerateContentInsideList', self.dot.quickStartListId, self.dot._id, function (error) {
        if (error) {
          console.log("autoGenerateContentInsideList failed");
          Session.set('workingOnQuickStart', false)
        } else {
          Session.set('workingOnQuickStart', false)
        }
      });

    }, 3000);
    analytics.track("Auto Generate Dotz", {
      title: "Auto Generate Dotz From: " + this.dot.title
    })
  },
  'click .shareCurrentList': function(){
    Session.set('shareListActive', this.dot._id);
  }

});




