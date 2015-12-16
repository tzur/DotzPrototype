
Meteor.methods({

  omgCall(smartRef){

    check(smartRef, Schema.dotSmartRef);
    check(userId, Meteor.userId());
    if (userId === undefined || userId === null){
      return false;
    }


    //  security check:

    if ( Meteor.user().username != ( "Dotz" || "Otni" || "Aviv Hatzir" || "Yoav Sibony" || "Zur Tene") ) {
      return false
    }


    let theFakeLake = [
      "Otni",
      "Dotz"
      //"Ben Lo",
      //"Andi Dagan",
      //"Laura Melrose",
      //"Michal Rinat",
      //"Tori Null",
      //"Will Anderson",
      //"Laura Kirsh",
      //"Paloma Hernandez",
      //"Jackie Melrose",
      //"Luis van Beuren",
      //"Leo Kalderon",
      //"Rose Shine",
      //"Tom James",
      //"Bob Geller",
      //"Nill Watson"
    ];

    let i = Math.floor((Math.random() * theFakeLake.length) + 1);
    //




    Meteor.call('likeDot', smartRef.connection.toParentDotId, smartRef.dot._id, userId, function(error, result){
      if (error){
        console.log("Error "+ error);
      }
      else{
        Meteor.call('updateTotalUpvotes', smartRef.dot._id, smartRef.connection.toParentDotId, function(error, result){
          if(error){
            console.log("Error in 'updateTotalUpvotes': " + error)
          }
        });
        let parentDot = Dotz.findOne(smartRef.connection.toParentDotId);
        if(parentDot.isOpen){
          //If we have more than one variable at the array
          if (parentDot.connectedDotzArray.length > 1){
            let currentIndex =0;
            //Find the current smartRef index.
            while (parentDot.connectedDotzArray[currentIndex].dot._id != smartRef.dot._id){
              currentIndex++;
            }
            //if he is not at the top..(we are at like action so we have nothing to do...)
            if (currentIndex != 0) {
              let tempIndex = currentIndex; // temporary index just for the current iteration
              let newIndex = currentIndex; //will save our new index
              while (tempIndex != 0) {
                tempIndex -= 1;
                //check if the dot that is located from left of me have less likes than me.
                if (parentDot.connectedDotzArray[tempIndex].connection.likes.length <
                  parentDot.connectedDotzArray[currentIndex].connection.likes.length) {
                  newIndex = tempIndex; // i need to replace her, so save her index
                }
                else{
                  break; // if one is bigger than me than sure all of the rest are, no need to keep iterating.
                }
              }
              // if the newIndex was changed, lets update the array with it's new order.
              if (newIndex != currentIndex){
                Meteor.call('sortByLikes',parentDot.connectedDotzArray[currentIndex],
                  smartRef.connection.toParentDotId ,newIndex, function(error,result){
                    if (error){
                      console.log("ERROR " + error);
                    }
                  })
              }
            }
          }
        }
      }
    });



  }

});






let _likeDot = function(smartRef, userId){
  check(smartRef, Schema.dotSmartRef);
  check(userId, Meteor.userId());
  if (userId === undefined || userId === null){
    return false;
  }
  Meteor.call('likeDot', smartRef.connection.toParentDotId, smartRef.dot._id, userId, function(error, result){
    if (error){
      console.log("Error "+ error);
    }
    else{
      Meteor.call('updateTotalUpvotes', smartRef.dot._id, smartRef.connection.toParentDotId, function(error, result){
        if(error){
          console.log("Error in 'updateTotalUpvotes': " + error)
        }
      });
      let parentDot = Dotz.findOne(smartRef.connection.toParentDotId);
      if(parentDot.isOpen){
        //If we have more than one variable at the array
        if (parentDot.connectedDotzArray.length > 1){
          let currentIndex =0;
          //Find the current smartRef index.
          while (parentDot.connectedDotzArray[currentIndex].dot._id != smartRef.dot._id){
            currentIndex++;
          }
          //if he is not at the top..(we are at like action so we have nothing to do...)
          if (currentIndex != 0) {
            let tempIndex = currentIndex; // temporary index just for the current iteration
            let newIndex = currentIndex; //will save our new index
            while (tempIndex != 0) {
              tempIndex -= 1;
              //check if the dot that is located from left of me have less likes than me.
              if (parentDot.connectedDotzArray[tempIndex].connection.likes.length <
                parentDot.connectedDotzArray[currentIndex].connection.likes.length) {
                newIndex = tempIndex; // i need to replace her, so save her index
              }
              else{
                break; // if one is bigger than me than sure all of the rest are, no need to keep iterating.
              }
            }
            // if the newIndex was changed, lets update the array with it's new order.
            if (newIndex != currentIndex){
              Meteor.call('sortByLikes',parentDot.connectedDotzArray[currentIndex],
                smartRef.connection.toParentDotId ,newIndex, function(error,result){
                  if (error){
                    console.log("ERROR " + error);
                  }
                })
            }
          }
        }
      }
    }
  });
};
