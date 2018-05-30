var js = require('JSONStream');
var stream = require('stream');
var rbx = require('roblox-js');
var fs = require('fs');
var group = 3140851;
var read, json;

function clearPage (wall) {
  console.log('Clear page ' + wall.page);
  var jobs = [];
  var posts = wall.posts;
  for (var i = 0; i < posts.length; i++) {
    var post = posts[i];
    jobs.push(rbx.deleteWallPost({
      group: group,
      post: {
        parent: {
          index: post.parent.index
        },
        view: wall.view
      }
    }));
  }
  return Promise.all(jobs).then(function () { console.log('Finished clear page ' + wall.page); });
}

var clear = new stream.Writable({
  objectMode: true,
  highWaterMark: 5
});
clear._write = function (chunk, encoding, done) {
  /* done();
  var wait = chunk.page % 5 === 0;
  if (wait) {
    console.log('Pause read');
    json.pause();
  } */
  clearPage(chunk)
  .catch(function (err) {
    console.error('Clear page error: ' + err.message);
  })
  .then(function () {
    /* if (wait) {
      console.log('Resume read');
      json.resume();
    } */
    done();
  });
};

rbx.login('iu8', 'cxxbc1518').then(function () {
  read = fs.createReadStream('./wall.json');
  json = js.parse('*');
  read.pipe(json).pipe(clear);
});
