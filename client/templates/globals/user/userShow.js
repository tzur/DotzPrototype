_data = {};
//_data.userShow = {}; //TBD?

Template.userShow.onCreated(function() {

  let self = this;
  self.autorun(function() {

    let username = FlowRouter.getParam('username');
    if (username) {
      self.subscribe('userByUsername', username);
      _data.userShow = Meteor.users.findOne({username: username});
    }

    let dotId = _data.userShow.profile.profileDotId;
    if (dotId) {
      self.subscribe('dotShow', dotId);
      _data.userShowDot = Dotz.findOne(dotId);
    }

    if (_data.userShowDot) {
      //subscribe all the relevant data for dotzConnectedByOwner:
      self.subscribe('smartRefToDotzCursor', _data.userShowDot.dotzConnectedByOwner);
      self.subscribe('smartRefToUsersCursor', _data.userShowDot.dotzConnectedByOwner);
      //send smartRef to module:
      _data.dotzConnectedByOwnerObjectsArray = Modules.both.Dotz.smartRefToDataObject(_data.userShowDot.dotzConnectedByOwner);
    }

  //let self = this;
  //self.autorun(function() {
  //
  //  let username = FlowRouter.getParam('username');
  //  self.subscribe('userByUsername', username);
  //  _data.user = Meteor.users.findOne({username: username});
  //
  //  if (_data.user) {
  //    let dotId = _data.user.profile.profileDotId;
  //    self.subscribe('dotShow', dotId);
  //    _data.dotShow = Dotz.findOne(dotId);
  //
  //    if (_data.dotShow) {
  //      self.subscribe('dotzConnectedByOwner', dotId);
  //      self.subscribe('user', _data.ownerUserId);
  //
  //      if (_data.dotShow.dotzConnectedByOwner) {
  //        _data.dotShow.dotzConnectedByOwner.objectsArray = [];
  //        _data.dotShow.dotzConnectedByOwner.forEach(function (smartRef) {
  //          let dot = Dotz.findOne(smartRef.dotId);
  //          if (dot) {
  //            let object = {};
  //            object.smartRef = smartRef;
  //            object.dot = dot;
  //            _data.dotShow.dotzConnectedByOwner.objectsArray.push(object);
  //          }
  //        });
  //      }
  //    }
  //
  //    //if (_data.dot) {
  //    //  self.subscribe('dotzConnectedByOwner', dotId);
  //    //  let getDotzConnectedByOwnerArray = [];
  //    //
  //    //  if (_data.dot.dotzConnectedByOwner) {
  //    //    _data.dot.dotzConnectedByOwner.forEach(function (smartRef) {
  //    //      getDotzConnectedByOwnerArray.push(smartRef.dotId);
  //    //    });
  //    //  }
  //    //  _data.dot.dotzConnectedByOwner.originalDotObjects = Dotz.find({_id: {$in: getDotzConnectedByOwnerArray}});
  //    //}
  //  }
  //
  //  //self.subscribe('dotzConnectedByOthers', dotId);

  });
});

Template.userShow.helpers({
  data: function() {
    return _data;
  },
  dotzConnectedByOwner: function() {
    return _data.dotzConnectedByOwnerObjectsArray;
  },

  followingCounter: function(){
    return _data.user.profile.following.length;
  },
  followersCounter: function(){
    return _data.user.profile.followers.length;
  },
  myFollow: function(){

    if (Meteor.user().profile.following &&
      Meteor.user().profile.following.indexOf(_data.user._id) > -1){
      return true;
    }
    else{
      return false;
    }
  },

  notMyProfile: function() {
    if (Meteor.userId() === _data.user._id) {
      return false;
    }
    else {
      return true;
    }
  },

  dotNum:  function(){
    return 123;
  },

  connectivityNum:  function(){
    return 456;
  }
});

Template.userShow.events({
  'click .followersNum': function(){
    var userIds = this.user.profile.followers;
    Modal.show('followModal', {
      data:{
        'userIds': userIds
      }
    });
  },
  'click .followingNum': function(){
    var userIds = this.user.profile.following;
    Modal.show('followModal', {
      data:{
        'userIds': userIds
      }
    });
  },
  'click .follow': function(){
    Modules.both.Dotz.followUser(Meteor.userId(), _data.user._id);
  },
  'click .unFollow': function(){
   Modules.both.Dotz.unFollowUser(Meteor.userId(), _data.user._id);
  }
});

