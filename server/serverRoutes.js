
// LINK TO MUHAMAD CONFIGURE FILE :https://forums.meteor.com/t/facebook-share-setup/12980

var seoPicker = Picker.filter(function(req, res) {
  var isCrawler = [];
  var string = req.headers['user-agent'];
  isCrawler.push(/_escaped_fragment_/.test(req.url));
  if(string){
    isCrawler.push(string.indexOf('facebookexternalhit') >= 0);
    isCrawler.push(string.indexOf('Slack') >= 0);
    isCrawler.push(string.indexOf('Twitterbot') >= 0);
    isCrawler.push(string.indexOf('Googlebot') >= 0);
  }
  return isCrawler.indexOf(true) >= 0;
});
 //Indexing user pages
seoPicker.route('/:userSlug/:dotType/:dotSlug', function(params, req, res){
  var fullSlug = params.userSlug +'/' + params.dotType + '/' + params.dotSlug;
  console.log("im heree SSR render DOT");
  console.log(fullSlug);
  var dot = Dotz.findOne({"dotSlug": fullSlug});
  console.log(dot.title);
  var html = SSR.render('seoLayout',{
    template:'seoDotShow',
    data: {dot: dot}
  });
  res.end(html);
});
seoPicker.route('/:userSlug', function(params, req, res){
  console.log("im heree SSR render USER");
  var user = Meteor.users.findOne({"profile.userSlug": params.userSlug});
  //console.log(user.username);
  var html = SSR.render('seoLayout',{
    template:'seoUserShow',
    data: {user: user}
  });
  res.end(html);
});
