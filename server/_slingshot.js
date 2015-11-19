/**
 * Created by avivhatzir on 26/10/2015.
 */
Slingshot.fileRestrictions( "uploadToAmazonS3", {
  allowedFileTypes: [ "image/png", "image/jpeg", "image/gif" ],
  maxSize: 1 * 1024 * 1024
});

let amazonBucket;
if(process.env.NODE_ENV === "production") {
  amazonBucket = "dotz-deployment"
}
else{
  amazonBucket= "dotz-dev-images"
}
Slingshot.createDirective( "uploadToAmazonS3", Slingshot.S3Storage, {
  bucket: amazonBucket,
  acl: "public-read",
  authorize: function () {
    //let userFileCount = Files.find( { "userId": this.userId } ).count();
    //return userFileCount < 3 ? true : false;
    if(Meteor.userId()){
      return true
    }
    else{
      return false
    }
  },
  key: function ( file ) {
    var user = Meteor.users.findOne( this.userId );
    return user._id + "/" + file.name;
  }
});
