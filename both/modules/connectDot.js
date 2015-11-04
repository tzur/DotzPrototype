/*
  This module responsible to connect dot, he does all the needed actions, can be used
  at connect action and create action.
 */


// This private method simply checks if we are the owner of the parent dot
// So we would know where to add "connectByOther" or "connectByOwner".
let _isConnectToOwner = (currentUserId, parentDotId) => {
  let parentDot = Dotz.findOne(parentDotId);
  return (currentUserId === parentDot.ownerUserId);
};

// This private method simply adds the new connected dot to the target dot inDotz field.
let _updateInDotz = (toBeAddedDotId, targetDotId) => {
  //to add callback to catch errors.
    Meteor.call('addDotToInDotz',toBeAddedDotId, targetDotId );
};
/*
 * This function receive smartRef of a needed to be connected dot, and does all the logic
 * in order to makes the connections.
 */
let connectDot = (smartRef) => {
  //PLEASE MAKE IT SMARTER...COULD BE  BETTER
  /// Probably one module with private functions.
  console.log("in connectDot" + smartRef);
  if (_isConnectToOwner(smartRef.connectedByUserId, smartRef.parentDot)){
    // We are connecting to OWNER case.
    smartRef.isConnectedToOthers = false;
     Meteor.call('addDotConnectedByOwner', smartRef, function(error, result){
        if (!error){
          //Connected to dot owner was successful, now check if we need to update ourself
          //Pay attention that's is only in connect action. (because create action will already have inDotz in it).
          if (smartRef.actionName === CONNECT_ACTION){
            _updateInDotz(smartRef.dotId, smartRef.parentDot);
          }
        }
       else{
          console.log("Error" + error);
        }
     });
  }
  else{
    // We are connecting to OTHER case.
    smartRef.isConnectedToOthers = true;
    Meteor.call('addDotConnectedByOther', smartRef, function(error, result){
      if (!error){
        //Connected to dot owner was successful, now check if we need to update ourself
        //Pay attention that's is only in connect action. (because create action will already have inDotz in it).
        if (smartRef.actionName === CONNECT_ACTION){
          _updateInDotz(smartRef.dotId, smartRef.parentDot);
        }
      }
      else{
        console.log("Error" + error);
      }
    });
  }

};

Modules.both.Dotz.connectDot = connectDot;
