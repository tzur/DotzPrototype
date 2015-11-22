
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
            if ( Meteor.loggingIn() ) {
              FlowRouter.go('/' + Meteor.user().profile.userSlug);
            }
            else {
              FlowRouter.go('index');
            }
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
      }
    }
  });
});

Template.dotShow.onRendered(function(){
  window.scrollTo(0,0);
});

Template.dotShow.onDestroyed(function(){

});


Template.dotShow.helpers({

  backToLastPath: function(){
    return Session.get('lastPath');
  },
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

    return (this.dot.dotType === "List")
  },

  isMyDot: function() {

    return (this.dot.ownerUserId === Meteor.userId())
  },

  actionDate: function(){
    return (moment(this.dot.createdAtDate).fromNow())
  },

  eventDate: function(){

    return ( moment(this.dot.startDateAndHour).fromNow());

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
      else {
        return ("+ " + connectedDotz );
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
    return (this.dot.isOpen || (this.dot.ownerUserId === Meteor.userId) )
  }
});

Template.dotShow.events({

  'click #_createDotFromList':function(){
    Session.set('parentDot', this.dot._id);
    //let parentDot = this.dot;
    //let parentInfo = {slug: FlowRouter.current().path, title: parentDot.title, coverImage: parentDot.coverImageUrl};
    Modal.show('createDotModal');

  },

  'click #_createListFromList':function(){
    //Session.set('parentDot', this.dot._id);
    //let parentDot = this.dot;
    //let parentInfo = {slug: FlowRouter.current().path, title: parentDot.title, coverImage: parentDot.coverImageUrl};
    Session.set('parentDot', this.dot._id);
    Modal.show('createListModal');

  },

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

  'click .delete':function(event){
      Modules.both.Dotz.deleteDot(this.dot, this.dot.inDotz[0]);
      FlowRouter.go("/" + Meteor.user().profile.userSlug);
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
  }

});




