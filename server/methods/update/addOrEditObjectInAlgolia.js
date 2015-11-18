/**
 * Created by avivhatzir on 17/11/2015.
 */
Meteor.methods({
  addOrEditObjectInAlgolia(docSlug, isUser){
    let array;
    let docIndex;
    check(docSlug, String);
    check(isUser, Boolean);
    var client = AlgoliaSearch("OE5LQTXY83", "bd14aab9d22ce75c25d286f9821b89c3");

    if (isUser){
      console.log("@@@@@@@@@@@@@@@@@@@" + docSlug);
      let currentDoc = Meteor.users.findOne({"profile.userSlug": docSlug});
      currentDoc.objectID = currentDoc._id;
      array = [{"objectID": currentDoc.objectID,"username": currentDoc.username, "profile": currentDoc.profile, "_id": currentDoc._id}]
      docIndex = "Users"

    }
    else{

      let currentDoc = Dotz.findOne({dotSlug: docSlug});
      currentDoc.objectID = currentDoc._id;
      if(currentDoc.dotType === "Dot"){
        docIndex = "Dotz"
      }
      else{
        docIndex = "Lists"
      }
      array = [currentDoc];
    }



    var index = client.initIndex(docIndex);

// array contains the data you want to save in the index

    index.saveObjects(array, function (error, content) {
      if (error) console.error('Error:', error);
      else console.log('Content:', content);
    });
  },

  deleteDotzFromAlgolia(dotId){
    check(dotId, String);
    var client = AlgoliaSearch("OE5LQTXY83", "bd14aab9d22ce75c25d286f9821b89c3");
    let objectIndex;
    let dot;

    dot = Dotz.findOne(dotId);
    if(dot.dotType === 'List'){
      objectIndex = "Lists"
    }
    else{
      objectIndex = "Dotz"
    }




    var index = client.initIndex('Dotz');

// array contains the data you want to save in the index

    index.deleteObject(dotId, function (error, content) {
      if (error) console.error('Error:', error);
      else console.log('Content:', content);
    });
  }
});
