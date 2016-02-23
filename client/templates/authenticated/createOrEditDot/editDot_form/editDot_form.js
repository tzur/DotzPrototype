

Template.editDot_form.onRendered( () => {

  Modules.client.editDot({
    form: "#editDot",
    template: Template.instance()
  });

  let dotToEdit = Session.get('editAction_docToEdit');
  let parentDotId, personalDescription;
  if (dotToEdit.smartRef) {
      parentDotId = dotToEdit.smartRef.parentDotId,
      personalDescription = dotToEdit.smartRef.personalDescription
  }
  let fields = {
    _id: dotToEdit.dot._id,
    toParentDotId: parentDotId,
    personalDescription: personalDescription,
    //
    title: dotToEdit.dot.title,
    description: dotToEdit.dot.bodyText,
    coverImageUrl: dotToEdit.dot.coverImageUrl,
    linkUrl: dotToEdit.dot.linkUrl
  };
  Modules.client.createDotLoading(); //Start to loading.
  Modules.client.updateCreateDotFields(fields);

  //prevent send by enter (exclude the textarea):
  Modules.client.preventEnterByElementId('#editDot');

});



Template.editDot_form.onDestroyed(function(){
  _clearSessions();
  Session.set('editAction_dot', undefined);
  Session.set('editAction_docToEdit', undefined);
  Session.set('dotCoverImg', undefined);
});




Template.editDot_form.helpers({

  publicSelectedClass: function() {
    if (Session.get('publicList')) {return "selectedPrivacyBtn";}
  },

  closedSelectedClass: function() {
    if (Session.get('closedList')) {return "selectedPrivacyBtn";}
  },

  secretSelectedClass: function() {
    if (Session.get('secretList')) {return "selectedPrivacyBtn";}
  },

  editAction_list: function() {
    if (Session.get('editAction_list')) {return true;}
  }

});


Template.editDot_form.events({

  'submit form': (e) => {
    //Prevent form from submitting.
    e.preventDefault()
  },

  'click #_publicList': function() {
    _clearSessions();
    Session.set('publicList', "Public");
  },

  'click #_closedList': function() {
    _clearSessions();
    Session.set('closedList', "Closed");
  },

  'click #_secretList': function() {
    _clearSessions();
    Session.set('secretList', "Secret");
  },


  'click #createNewListButton': function(event){
    // //event.preventDefault();

    //Modules.client.createNewList({
    //  form: "#createNewList",
    //  template: Template.instance()
    //});
  }

  //'submit #createNewListButton': function(event){
  //   event.preventDefault();
  //}


  //'submit #createNewListButton': function(event){
  //  event.preventDefault();
  //  //let self = this;
  //  //Modules.client.handleCreateSubmit(self.parentDotId, Session.get('dotCoverImg'), Session.get('locationObject'))
  //
  //  //TODO: add the embedly session? @otni
  //  Modules.client.createNewList(Session.get('dotCoverImg'), Session.get('locationObject'));
  //}

});

//private function:
function _clearSessions(){
  Session.set('publicList', undefined);
  Session.set('closedList', undefined);
  Session.set('secretList', undefined);
}
