/**
 * Created by avivhatzir on 02/11/2015.
 */
Template.connectDotModal.onCreated(function(){
  let self = this;
  self.autorun(function () {
    self.subscribe('createByUserDotz');
  });

  });

Template.connectDotModal.helpers({

  currentUserImageUrl: function() {
    return Meteor.user().profile.profileImage;
  },

  currentUserUsername: function() {
    return Meteor.user().username;
  },

  dotTarget: function() {
    return this.data;
  },

  userProfileDotzArray: function(){
    Session.set('dotIdWishedToBeConnected', this.data.dotId);
    Session.set('dotOwnerUserId', this.data.dot.ownerUserId);
    if(Session.get('dotIdWishedToBeConnected')) {
      return Modules.client.Dotz.getConnectedByOwnerDotz(Meteor.user().profile.profileDotId, Session.get('dotIdWishedToBeConnected'))
    }
  },
  isConnectedToUserProfileDot: function(){
      return Modules.client.Dotz.isConnectedToDot(Meteor.user().profile.profileDotId, Session.get('dotIdWishedToBeConnected'))
  }
});

Template.connectDotModal.events({
  'click .connectToUserProfile': function () {
    let personalDescription = $('#personalDescription').val();
    let smartRef = new Modules.both.Dotz.smartRef(Session.get('dotIdWishedToBeConnected'), Session.get('dotOwnerUserId'),
                  Meteor.user().profile.profileDotId, CONNECT_ACTION, Meteor.userId(),personalDescription);
    Modules.both.Dotz.connectDot(smartRef);

  }
});
