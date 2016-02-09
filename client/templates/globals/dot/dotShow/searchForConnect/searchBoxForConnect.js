
Template.searchBoxForConnect.onCreated(function(){
  //Session.set('googleResults',[{
  //  googleImg:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT6EF2spkVH7zbM97BU_lIf8Tc2YsNk_I7mXT2PduNznOmVFNjYp2Der-E6',
  //  googleTitle: 'example',
  //  googleWebsiteName: 'www.example.com',
  //  googleDescription:"Example description",
  //  googleLinkUrl: "example.com/blablabla"
  //}]);
});

Template.searchBoxForConnect.helpers({

  //userCanAutoGenerateDotz: function(){
  //  let data = Template.parentData();
  //  if ( data.dot.ownerUserId === Meteor.userId() && data.dot.quickStartListId && data.dot.connectedDotzArray.length === 0 ) {
  //    return "colCenter";
  //  }
  //},
  googleResults: function(){
    return Session.get('googleResults');
  },
  dotzResult: function(){
    return Session.get('dotzResult');
  },

  dotzResultNumber: function(){
    if(Session.get('dotzResult')){
      return ("(" + Session.get('dotzResult').length + ")");
    }
  },
  getDataForGoogleCard: function(){
    console.log("dsfdsfsdf");
    return {
      parentDotId:Template.parentData().dot._id,
      googleDot: this
    };
  },
  isNotAlreadyConnected: function(){
    return Modules.client.Dotz.canBeConnectedToDot(Template.parentData().dot._id, this._id)
  },
  dataForDotCard: function() {
    //
    //let connection = {
    //  ownerUserId: this.ownerUserId,
    //  likes: "none"
    //};

    // @params for >>>subscribe('mobileDotCard', self.data.dot._id, self.data.dot.ownerUserId, self.data.connection.connectedByUserId);

    console.log("this._id >> " + this._id)
    console.log("this.ownerUserId >> " + this.ownerUserId)


    let data = {

      algolisSearchResult: this,

      dot: {
        _id: this._id,
        ownerUserId: this.ownerUserId,
        title: this.title
      },

      //dot: this,
      //ownerUser: Meteor.users.findOne(this.ownerUserId),
      connection: {
        connectedByUserId: this.ownerUserId,
        likes: "none"
      },

      //dot: {
      //  _id: this._id,
      //  ownerUserId: this.ownerUserId
      //},
      ////dot: this,
      ////ownerUser: Meteor.users.findOne(this.ownerUserId),
      //connection: {
      //  connectedByUserId: this.ownerUserId,
      //  likes: "none"
      //},
      //TBD:
      inSearchResults: true
    };
    return data;
  }

});

Template.searchBoxForConnect.events({
  'submit ._googleSearch': function(e){
    e.preventDefault();

    Modules.client.googleCustomSearch($('#_searchBoxInput').val(), function(error, result){
      if (error){
        Bert.alert("We are poor and have only 100 queries per day, please do something with it.",'danger')
      }else{
        Session.set('googleResults', Modules.client.googleResultToCard(result));
      }
    });

    //Meteor.user().roles.firstGroup[0] +
    Modules.client.searchByAlgolia("Dotz", $('#_searchBoxInput').val() , function(error, content){
      if(content){
        Session.set('dotzResult', content.hits);
      }
      else{
        console.log("Error, dotz search failed : " + error)
      }
    });
    //if(Session.get('dotzResult')){
    //  return Session.get('dotzResult').hits;
    //}



  },

  'click ._createNewDotHere':function(){
    Modules.client.editAndCreateSessionsCleaner();
    Session.set('parentDot', this.dot._id);
    let parentDotId = this.dot._id;
    Modal.show('createNewDot_Modal',{
      parentDotId: parentDotId
    });
  },

  'click ._createNewListHere':function(){
    Modules.client.editAndCreateSessionsCleaner();
    Session.set('parentDot', this.dot._id);
    let parentDotId = this.dot._id;
    Modal.show('createNewList_modal',{
      parentDotId: parentDotId
    });
  },

  'click #searchSubmit':function(){
    $('#searchTabs').removeClass('hidden');
  }
});

