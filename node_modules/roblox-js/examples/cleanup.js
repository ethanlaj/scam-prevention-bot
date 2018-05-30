// Exile specific members in a group, including by rank and by name. Useful for cleaning up bots.
var rbx = require('roblox-js');
var ProgressBar = require('progress');
var prompt = require('prompt');

prompt.message = '';
var schema = {
  properties: {
    group: {
      description: 'Enter group ID',
      required: true,
      type: 'integer',
      message: 'Group ID must be an integer'
    },
    username: {
      description: 'Enter ROBLOX account username',
      required: true
    },
    password: {
      description: 'Enter ROBLOX account password',
      hidden: true,
      replace: '*',
      required: true
    },
    rank: {
      description: 'Enter rank (leave blank for all ranks)',
      type: 'integer',
      message: 'Rank must be an integer'
    },
    find: {
      description: 'Enter a string to find, this will only exile players that have the specific string in their username (optional)'
    },
    startPage: {
      description: 'Enter starting page (leave blank for all pages)',
      type: 'integer',
      message: 'Page must be an integer'
    },
    endPage: {
      description: 'Enter ending page',
      type: 'integer',
      message: 'Page must be an integer',
      ask: function () {
        return prompt.history('startPage').value > 0;
      }
    },
    virtual: {
      message: 'When checking the player pages, were you in the group or not? (This must be checked because the pages display differently if you are in the group, the script will automatically compensate for this) y/n',
      validator: /^y|n$/,
      required: true,
      warning: 'You must respond with "y" or "n"',
      ask: function () {
        return prompt.history('startPage').value > 0;
      },
      before: function (v) {
        return v === 'y';
      }
    }
  }
};

function exile (group, plrs) {
  rbx.getGeneralToken()
  .then(function () {
    rbx.getRolesetInGroupWithJar(group)
    .then(function (roleset) {
      var exile = new ProgressBar('Exiling [:bar] :current/:total = :percent :etas remaining ', {total: 10000});
      console.time('Time: ');
      var thread = rbx.threaded(function (i) {
        return rbx.exile({group: group, target: plrs[i].id, senderRolesetId: roleset});
      }, 0, plrs.length);
      var ivl = setInterval(function () {
        exile.update(thread.getStatus() / 100);
      }, 1000);
      thread.then(function () {
        clearInterval(ivl);
        console.timeEnd('Time: ');
      });
    });
  });
}

function init (group, username, password, rank, find, startPage, endPage, virtual) {
  rbx.login(username, password)
  .then(function () {
    var pages;
    if (startPage && endPage) {
      pages = [];
      var startPageVirtual = startPage;
      var endPageVirtual = endPage;
      if (virtual) {
        console.log('Because you viewed the player pages while still in the group, a few players will not be retrieved. You will not get any players that you didn\'t see originally but you may there may be some missing (this will only be a few, less than 10 players)');
        startPageVirtual = Math.ceil(((startPage) * 10) / 12);
        endPageVirtual = Math.floor(((endPage) * 10) / 12);
      }
      for (var i = startPageVirtual; i <= endPageVirtual; i++) {
        pages.push(i);
      }
    }
    var getPlayers = new ProgressBar('Getting players [:bar] :current/:total = :percent :etas remaining ', {total: 10000, clear: true});
    var promise = rbx.getPlayers(group, rank, pages);
    promise.then(function (res) {
      var plrs = res.players;
      if (find) {
        for (var i = plrs.length - 1; i >= 0; i--) {
          var plr = plrs[i];
          if (!plr.name.includes(find)) {
            plrs.splice(i, 1);
          }
        }
      }
      if (plrs.length === 0) {
        console.log('There are no players to exile!');
        return;
      }
      console.log('You are about to exile ' + plrs.length + ' players selected from ' + (startPage && endPage ? ('page ' + startPage + ' to ' + endPage) : ('ALL pages')));
      console.log('The list starts from the player "' + plrs[0].name + '" and ends with the player "' + plrs[plrs.length - 1].name + '"');
      prompt.get({
        name: 'yesno',
        message: 'Are you sure you want to do this? y/n',
        validator: /^y|n$/,
        required: true,
        warning: 'You must respond with "y" or "n"'
      }, function (err, result) {
        if (err) {
          console.error('Prompt error: ' + err.message);
          return;
        }
        if (result.yesno === 'y') {
          exile(group, plrs);
        } else {
          console.log('Aborted');
          process.exit();
        }
      });
    });
    var ivl = setInterval(function () {
      getPlayers.update(promise.getStatus() / 100);
    }, 1000);
    promise.then(function () {
      clearInterval(ivl);
    });
  });
}

prompt.start();
prompt.get(schema, function (err, result) {
  if (err) {
    console.error('Prompt error: ' + err.message);
    return;
  }
  init(result.group, result.username, result.password, result.rank, result.find, result.startPage, result.endPage, result.virtual);
});
