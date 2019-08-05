const Discord = require("discord.js");
const client = new Discord.Client();
const guild = new Discord.Guild();
//const EventEmitter = require('events');
// ADD CHANNEL TYPES BACK
//class MyEmitter extends EventEmitter {};

//const myEmitter = new MyEmitter();
const config = require("./config.json");
const ranks = require("./ranks.json");
const secret = require("./secret.json");
const sql = require("sqlite");
const trustedUser = require("./trustedusers.json");
sql.open("./score.sqlite");

// I am certain that none of these are used anymore, but at this point i'm too scared to delete them
// TODO delete these
var curLevel = 1;
var curLevel2 = 1;
var lockBeginner = false;
var lockAdvanced = false;
var needVerifyAdvanced = false;
var needVerifyBeginner = false;
var moo = false;
var hasAdmin = false;
var rankLock = false;
var commander;
var curRank;
var verifyChallengerBeginner;
var verifyChallengerAdvanced;
var challengerAdvanced;
var challengerBeginner;
var role1;
var role2;
var role3;
var rankInNum;
var challengerAdvancedId;
var challengerBeginnerId;
var verifyChallengerAdvancedAdmin;
var verifyChallengerBeginnerAdmin;
var hasLockAdvanced;

// This function is run once whenever the bot is started, use it to set the playing game on the bots profile
client.on("ready", () => {
  client.user.setActivity(config.playingGame);
  //client.user.setUsername("Explore bot");
  /*
  sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, rank INTEGER, name TEXT)").then(row => {
    sql.run("INSERT INTO scores (userId, points, rank, name) VALUES (?, ?, ?, ?)", [author.message.id, 0, 0, ranks.rank0]);
    let curLevel = row.points;

  });
  */

  //var channel = client.channels.get('458331720547303424');
  //var devchan = client.channels.get('468427413165047819');
  //channel.send("I have restarted");
  //devchan.send("Restarted");

  console.log(`Bot Activated! Logged in as: ${client.user.tag}`);
  console.log("You are running version: " + config.botVersion + " of the ExplorationBot")
  //console.log(myRole);
});

// This function adds the UnknownZone role whenever a new user joins
client.on("guildMemberAdd", member =>{
  //console.log("User " + member.user.username + " has joined")
  var roleNew = member.guild.roles.find("name", "UnknownZone");
  member.addRole(roleNew)
});

// Ping, Help and Challenge Info function
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix + "ping")) {
    message.channel.send("pong!");
  }
  if (message.content.startsWith(config.prefix + "help")){
    if (message.member.roles.some(r=>["Admin", "Bot"].includes(r.name))){
      message.author.send({
        embed:{
          title: "Debug Commands (Admin only)",
          color: 16711680,
          description: "addpoint <user> <amount>- Adds a specified amount of points to a person's point total\n\nremove point <user> <amount> - Removes a specified amount of points from a user\n\nverify advanced/beginner - Overrides a current challenge\n\nchallenge info - Information about the challenges"
          }
        });
      }
    message.author.send({
      embed:{
        title: "Bot commands",
        color: 3447003,
        description: "ping - Pings the bot to see if it's alive\n\nhelp - This help menu\n\nchallenge beginner - Starts a beginner challenge if there is not already one taking place\n\nchallenge advanced - Starts an advanced challenge if there is not already one taking place\n\nchallenge extreme - Starts an extreme challenge if there is not already one taking place\n\npoints - Shows your current amount of points and your current rank\n\nsolve advanced - Ask the challenge poster to confirm your challenge\n\nsolve beginner - Ask the challenge poster to confirm your challenge\n\nsolve extreme - Ask the challenge poster to confirm your challenge\n\naccept/decline, advanced/beginner/extreme - Either accepts or declines the user's challenge\n\ncancel advance/beginner/extreme - Cancel's the current challenge (only useable by the challenge author or an admin)"
      }


    });

  }
  if (message.content.startsWith(config.prefix + "challenge info")){
    sql.get(`SELECT * FROM scores`).then(row => {
      message.channel.send({
        embed:{
          title: "Challenge Information",
          color: 16711680,
          description: `Beginner challenge holder = ${row.setBeginner}\n
                        BeginnerLock = ${row.beginnerLock}\n
                        Advanced challenge holder = ${row.setAdvance}\n
                        AdvancedLock = ${row.advanceLock}\n
                        Extreme challenge holder = ${row.setExtreme}\n
                        ExtremeLock = ${row.extremeLock}
                        `
        }
      })
    })
  }



});

// TODO continue with the leaderboard function
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith(config.prefix + "leaderboard")){
    sql.get(`SELECT * FROM scores WHERE userId = * ORDER BY points DESC`).then(row => {
      console.log(row.points)
    })
  }
})

// Uhh i can explain...
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.content.startsWith("say!")) {
    const args = message.content.slice("say!").trim().split(/ +/g);
    let text = args.slice(1).join(" ");
      var channel = client.channels.get('512695051424497664');
    channel.send(text);
  }
});


client.on("message", (message) => {
  if (message.channel.type === "dm") return;
  if (message.author.bot) return;

  // Why is this here? Delete this, future self
/*
  if (message.content.startsWith(config.prefix + "init database")){
    message.channel.send("Database initialized. Point and Ranking systems ready to use.");
    sql.get(`SELECT * FROM scores WHERE userId = ${message.author.id}`).then(row => {
      if (!row) {
        sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock, setAdvance, setAdvanceId, isVerifyAdvance, advancedChallenger, advancedChallengerId, beginnerLock, setBeginner, setBeginnerId, isVerifyBeginner, beginnerChallenger, beginnerChallengerId, extremeLock, setExtreme, setExtremeId, isVerifyExtreme, extremeChallenger, extremeChallengerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.author.id, 0, 0, ranks.rank0, 0, "nobody", "nobodytwo", 0, "nobodythree", "nobodyfour", 0, "nobodyfive", "nobodysix", 0, "nobodyseven", "nobodyeight", 0, "nobodynine", "nobodyten", 0, "nobodyeleven", "nobodytwelve"]);
        //curLevel = row.points + 1;
        //hasLockAdvanced = row.advanceLock;
        //commander = row.userId;
        //curRank = row.rank + 1;
      } else {
        //sql.run(`UPDATE scores SET points = ${row.points + 1}`);
        //curLevel = row.points + 1;
        //commander = row.userId;
        //curRank = row.rank + 1;

        //console.log(curLevel);
      }


    }).catch(() => {
      console.error;
      sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, rank INTEGER, name TEXT, advanceLock INTEGER, setAdvance TEXT, setAdvanceId TEXT, isVerifyAdvance INTEGER, advancedChallenger TEXT, advancedChallengerId TEXT, beginnerLock INTEGER, setBeginner TEXT, setBeginnerId TEXT, isVerifyBeginner INTEGER, beginnerChallenger TEXT, beginnerChallengerId TEXT, extremeLock INTEGER, setExtreme TEXT, setExtremeId TEXT, isVerifyExtreme INTEGER, extremeChallenger TEXT, extremeChallengerId TEXT)").then(() => {
        sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock, setAdvance, setAdvanceId, isVerifyAdvance, advancedChallenger, advancedChallengerId, beginnerLock, setBeginner, setBeginnerId, isVerifyBeginner, beginnerChallenger, beginnerChallengerId, extremeLock, setExtreme, setExtremeId, isVerifyExtreme, extremeChallenger, extremeChallengerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [message.author.id, 0, 0, ranks.rank0, 0, "nobody", "nobodytwo", 0, "nobodythree", "nobodyfour", 0, "nobodyfive", "nobodysix", 0, "nobodyseven", "nobodyeight", 0, "nobodynine", "nobodyten", 0, "nobodyeleven", "nobodytwelve"]);
      });
    });
  };

  /*
  if (message.content.startsWith(config.prefix + "rank")){
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      //commander = row.userId;
      if (!row) return message.reply("It seems you are not in the database. Please add yourself to it by using the !add user command.");
      message.reply(`Your current rank is: ${row.name}`);
      rankInNum = row.rank;






      //console.log("CurLevel = " + curLevel);
      console.log("rankInNum = " + rankInNum);
})};
*/
  // Point command
  if (message.content.startsWith(config.prefix + "point")){
    sql.get(`SELECT * FROM scores WHERE userId ="${message.author.id}"`).then(row => {
      if (!row) return message.reply("Your current points are: 0, and your rank is : Unranked");
      message.reply(`Your current points are: ${row.points} and your rank is: ${row.name}`);
      //console.log(hasLockAdvanced);
      //console.log("curLevel = " + curLevel);
})};
//var curLevel;

});



// Addpoint command
client.on("message", (message) => {
  //TODO clean this travesty up
  if (message.content.startsWith(config.prefix + "addpoint")){
    if (message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
      let member2 = message.mentions.members.first();
      const args = message.content.slice(config.prefix).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      var argtoint = parseInt(args[1], 10);
      sql.get(`SELECT * FROM scores WHERE userId = ${member2.id}`).then(row => {
        message.channel.send("Added "+ (argtoint) + " point(s) to " + (member2) + " sucessfully!");
        sql.run(`UPDATE scores SET points = ${row.points + argtoint} WHERE userid = ${member2.id}`)
        //console.log(args)
      }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, rank INTEGER, name TEXT, advanceLock INTEGER, setAdvance TEXT, setAdvanceId TEXT, isVerifyAdvance INTEGER, advancedChallenger TEXT, advancedChallengerId TEXT, beginnerLock INTEGER, setBeginner TEXT, setBeginnerId TEXT, isVerifyBeginner INTEGER, beginnerChallenger TEXT, beginnerChallengerId TEXT)").then(() => {
          sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock, setAdvance, setAdvanceId, isVerifyAdvance, advancedChallenger, advancedChallengerId, beginnerLock, setBeginner, setBeginnerId, isVerifyBeginner, beginnerChallenger, beginnerChallengerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [member2.id, 1, 0, ranks.rank0, 0, "nobody", "nobodytwo", 0, "nobodythree", "nobodyfour", 0, "nobodyfive", "nobodysix", 0, "nobodyseven", "nobodyeight"]);
        });
      });

    }
  }
});

// Remove point command
client.on("message", (message) => {
  // TODO and this one...
  if (message.content.startsWith(config.prefix + "remove point")){
    if (message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
      let member2 = message.mentions.members.first();
      const args = message.content.slice(config.prefix).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      var argtoint2 = parseInt(args[2], 10);
      sql.get(`SELECT * FROM scores WHERE userId = ${member2.id}`).then(row => {
        message.channel.send("Removed " + (argtoint2) + " point(s) from " + (member2) + " sucessfully!");
        sql.run(`UPDATE scores SET points = ${row.points - argtoint2} WHERE userid = ${member2.id}`)
        //console.log(args)
      }).catch(() => {
        console.error;
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, rank INTEGER, name TEXT, advanceLock INTEGER, setAdvance TEXT, setAdvanceId TEXT, isVerifyAdvance INTEGER, advancedChallenger TEXT, advancedChallengerId TEXT, beginnerLock INTEGER, setBeginner TEXT, setBeginnerId TEXT, isVerifyBeginner INTEGER, beginnerChallenger TEXT, beginnerChallengerId TEXT)").then(() => {
          sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock, setAdvance, setAdvanceId, isVerifyAdvance, advancedChallenger, advancedChallengerId, beginnerLock, setBeginner, setBeginnerId, isVerifyBeginner, beginnerChallenger, beginnerChallengerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [member2.id, 1, 0, ranks.rank0, 0, "nobody", "nobodytwo", 0, "nobodythree", "nobodyfour", 0, "nobodyfive", "nobodysix", 0, "nobodyseven", "nobodyeight"]);
        });
      });

    }
  }
});




// Create Beginner challenge
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.channel.id !== '421094563436822529') return; // comment this line for command to work in dev server
  if (message.content.startsWith(config.prefix + "challenge beginner")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (!row) {
        //sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock) VALUES (?, ?, ?, ?, ?)", [challengerBeginner, 1, 0, ranks.rank0, 0]);

      } else {
        sql.run(`UPDATE scores SET beginnerLock = ${row.beginnerLock + 1}`);

      }
      if(row.beginnerChallengerId === null){
        if(row.beginnerLock < 1){
          message.reply("Has set a beginner challenge! Solve this challenge by posting a picture of your character in the same place, and earn 3 points!")

          //verifyChallengerAdvanced = message.author;
          //role1 = message.guild.roles.find("name", "Admin");
          //verifyChallengerAdvancedAdmin = role1;
          //row.advanceLock = 1;
          //console.log("curLevel = " + curLevel);
          sql.run(`UPDATE scores SET setBeginner = "${message.author}"`);
          sql.run(`UPDATE scores SET setBeginnerId = ${message.author.id}`);
          sql.run(`UPDATE scores SET beginnerLock = ${row.beginnerLock + 1}`);
        }else {
          message.reply("You cannot post another challenge at this time.");
        }
      }
      if(row.beginnerChallengerId !== null){
        if(row.beginnerLock < 1 && message.author.id === row.beginnerChallengerId){
          message.reply("Has set a beginner challenge! Solve this challenge by posting a picture of your character in the same place, and earn 3 points!")

          //verifyChallengerAdvanced = message.author;
          //role1 = message.guild.roles.find("name", "Admin");
          //verifyChallengerAdvancedAdmin = role1;
          //row.advanceLock = 1;
          //console.log("curLevel = " + curLevel);
          sql.run(`UPDATE scores SET setBeginner = "${message.author}"`);
          sql.run(`UPDATE scores SET setBeginnerId = ${message.author.id}`);
          sql.run(`UPDATE scores SET beginnerLock = ${row.beginnerLock + 1}`);
        }else{
          message.reply("You cannot post another challenge at this time.");
        }
      }


  })};

});

// Create Advanced challenge
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.channel.id !== '421094764809814016') return; // comment this line for command to work in dev server
  if (message.content.startsWith(config.prefix + "challenge advanced")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (!row) {
        //sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock) VALUES (?, ?, ?, ?, ?)", [challengerBeginner, 1, 0, ranks.rank0, 0]);

      } else {


      }
      if(row.advancedChallengerId === null){
        if(row.advanceLock < 1){
          message.reply("Has set an advanced challenge! Solve this challenge by posting a picture of your character in the same place, and earn 5 points!")

          //verifyChallengerAdvanced = message.author;
          //role1 = message.guild.roles.find("name", "Admin");
          //verifyChallengerAdvancedAdmin = role1;
          //row.advanceLock = 1;
          //console.log("curLevel = " + curLevel);
          sql.run(`UPDATE scores SET setAdvance = "${message.author}"`);
          sql.run(`UPDATE scores SET setAdvanceId = ${message.author.id}`);
          sql.run(`UPDATE scores SET advanceLock = ${row.advanceLock + 1}`);
        }else {
          message.reply("You cannot post another challenge at this time.");
        }
      }
      if(row.advancedChallengerId !== null){
        if(row.advanceLock < 1 && message.author.id === row.advancedChallengerId){
          message.reply("Has set an advanced challenge! Solve this challenge by posting a picture of your character in the same place, and earn 5 points!")

          //verifyChallengerAdvanced = message.author;
          //role1 = message.guild.roles.find("name", "Admin");
          //verifyChallengerAdvancedAdmin = role1;
          //row.advanceLock = 1;
          //console.log("curLevel = " + curLevel);
          sql.run(`UPDATE scores SET setAdvance = "${message.author}"`);
          sql.run(`UPDATE scores SET setAdvanceId = ${message.author.id}`);
          sql.run(`UPDATE scores SET advanceLock = ${row.advanceLock + 1}`);
        }else{
          message.reply("You cannot post another challenge at this time.");
        }
      }



  })};
});

// Create Extreme Challenge
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.channel.id !== '498890419048939530') return; // comment this line for command to work in dev server
  if (message.content.startsWith(config.prefix + "challenge extreme")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (!row) {
        //sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock) VALUES (?, ?, ?, ?, ?)", [challengerBeginner, 1, 0, ranks.rank0, 0]);

      } else {


      }
      if(row.extremeChallengerId === null){
        if(row.extremeLock < 1){
          message.reply("Has set an extreme challenge! Solve this challenge by posting a picture of your character in the same place, and earn 10 points!")

          //verifyChallengerAdvanced = message.author;
          //role1 = message.guild.roles.find("name", "Admin");
          //verifyChallengerAdvancedAdmin = role1;
          //row.advanceLock = 1;
          //console.log("curLevel = " + curLevel);
          sql.run(`UPDATE scores SET setExtreme = "${message.author}"`);
          sql.run(`UPDATE scores SET setExtremeId = ${message.author.id}`);
          sql.run(`UPDATE scores SET extremeLock = ${row.extremeLock + 1}`);
        }else {
          message.reply("You cannot post another challenge at this time.");
        }
      }
      if(row.extremeChallengerId !== null){
        if(row.extremeLock < 1 && message.author.id === row.extremeChallengerId){
          message.reply("Has set an extreme challenge! Solve this challenge by posting a picture of your character in the same place, and earn 10 points!")

          //verifyChallengerAdvanced = message.author;
          //role1 = message.guild.roles.find("name", "Admin");
          //verifyChallengerAdvancedAdmin = role1;
          //row.advanceLock = 1;
          //console.log("curLevel = " + curLevel);
          sql.run(`UPDATE scores SET setExtreme = "${message.author}"`);
          sql.run(`UPDATE scores SET setExtremeId = ${message.author.id}`);
          sql.run(`UPDATE scores SET extremeLock = ${row.extremeLock + 1}`);
        }else{
          message.reply("You cannot post another challenge at this time.");
        }
      }


  })};
});

// Solve Beginner challenge
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '421094563436822529') return; // comment this line for command to work in dev server
  if (message.channel.type === "dm") return;
  //if (lockBeginner == false) return;
  if (message.content.startsWith(config.prefix + "solve beginner")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.beginnerLock > 0 && row.isVerifyBeginner < 1 && message.author.id !== row.setBeginnerId){
        message.channel.send(`A challenger has solved this challenge ${row.setBeginner} or an Admin will need to verify it is correct by typing !accept beginner or !decline beginner if it's not correct`)
        //role1 = message.guild.roles.find("name", "Admin");
        //verifyChallengerAdvancedAdmin = role1;
        //needVerifyAdvanced = true;
        //challengerAdvanced = message.author;
        //challengerAdvancedId = message.author.id;
        //console.log("curLevel = " + curLevel);
        sql.run(`UPDATE scores SET isVerifyBeginner = ${row.isVerifyBeginner + 1}`);
        sql.run(`UPDATE scores SET beginnerChallenger = "${message.author}"`);
        sql.run(`UPDATE scores SET beginnerChallengerId = ${message.author.id}`);


      }else{
        message.channel.send(`You must wait until ${row.setBeginner} has verified the current query`);
      }
    });


  }
});

// Solve advanced challenge
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '421094764809814016') return; // comment this line for command to work in dev server
  if (message.channel.type === "dm") return;
  //if (lockAdvanced == false) return;
  if (message.content.startsWith(config.prefix + "solve advanced")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.advanceLock > 0 && row.isVerifyAdvance < 1 && message.author.id !== row.setAdvanceId){
        message.channel.send(`A challenger has solved this challenge ${row.setAdvance} or an Admin will need to verify it is correct by typing !accept advanced or !decline advanced if it's not correct`)
        //role1 = message.guild.roles.find("name", "Admin");
        //verifyChallengerAdvancedAdmin = role1;
        //needVerifyAdvanced = true;
        //challengerAdvanced = message.author;
        //challengerAdvancedId = message.author.id;
        //console.log("curLevel = " + curLevel);
        sql.run(`UPDATE scores SET isVerifyAdvance = ${row.isVerifyAdvance + 1}`);
        sql.run(`UPDATE scores SET advancedChallenger = "${message.author}"`);
        sql.run(`UPDATE scores SET advancedChallengerId = ${message.author.id}`);


      }else{
        message.channel.send(`You must wait until ${row.setAdvance} has verified the current query`);
      }
    });


  }
});

// Solve Extreme
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== '498890419048939530') return; // comment this line for command to work in dev server
  if (message.channel.type === "dm") return;
  //if (lockAdvanced == false) return;
  if (message.content.startsWith(config.prefix + "solve extreme")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.extremeLock > 0 && row.isVerifyExtreme < 1 && message.author.id !== row.setExtremeId){
        message.channel.send(`A challenger has solved this challenge ${row.setExtreme} or an Admin will need to verify it is correct by typing !accept extreme or !decline extreme if it's not correct`)
        //role1 = message.guild.roles.find("name", "Admin");
        //verifyChallengerAdvancedAdmin = role1;
        //needVerifyAdvanced = true;
        //challengerAdvanced = message.author;
        //challengerAdvancedId = message.author.id;
        //console.log("curLevel = " + curLevel);
        sql.run(`UPDATE scores SET isVerifyExtreme = ${row.isVerifyExtreme + 1}`);
        sql.run(`UPDATE scores SET extremeChallenger = "${message.author}"`);
        sql.run(`UPDATE scores SET extremeChallengerId = ${message.author.id}`);


      }else{
        message.channel.send(`You must wait until ${row.setExtreme} has verified the current query`);
      }
    });


  }
});

// Cancel Advanced challenge
client.on("message", (message) => {
  //if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //if (lockAdvanced == false) return;
  if (message.content.startsWith(config.prefix + "cancel advanced")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyAdvance > 0 && row.setAdvanceId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`The advanced challenge has been canceled.`);
        //lockAdvanced = false;
        sql.run(`UPDATE scores SET advanceLock = ${row.advanceLock} - ${row.advanceLock}`);
        sql.run(`UPDATE scores SET isVerifyAdvance = ${row.isVerifyAdvance} - ${row.isVerifyAdvance}`);
        sql.run(`UPDATE scores SET advancedChallengerId = ${row.advancedChallengerId = null}`);
        sql.run(`UPDATE scores SET advancedChallenger = ${row.advancedChallenger = null}`);
        //needVerifyAdvanced = fals
      }else{
        // Nothing is needed here, so i'll just dump a comment here for no reason
      }
    })};

});

// cancel extreme
client.on("message", (message) => {
  //if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //if (lockAdvanced == false) return;
  if (message.content.startsWith(config.prefix + "cancel extreme")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyExtreme > 0 && row.setExtremeId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`The extreme challenge has been canceled.`);
        //lockAdvanced = false;
        sql.run(`UPDATE scores SET extremeLock = ${row.extremeLock} - ${row.extremeLock}`);
        sql.run(`UPDATE scores SET isVerifyExtreme = ${row.isVerifyExtreme} - ${row.isVerifyExtreme}`);
        sql.run(`UPDATE scores SET extremeChallengerId = ${row.extremeChallengerId = null}`);
        sql.run(`UPDATE scores SET extremeChallenger = ${row.extremeChallenger = null}`);
        //needVerifyAdvanced = fals
      }else{

      }
    })};

});


// Accept advanced
client.on("message", (message) => {
  //if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(config.prefix + "accept advanced")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyAdvance > 0 && row.setAdvanceId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        sql.get(`SELECT * FROM scores WHERE userId = ${row.advancedChallengerId}`).then(row => {
          if (!row) {
            sql.get(`SELECT * FROM scores`).then(row => {
              message.channel.send(`Congratulations ${row.advancedChallenger} your challenge solve has been accepted and you have earned 5 points! Your current point total is: 5`);
            })

          } else {
            message.channel.send(`Congratulations ${row.advancedChallenger} your challenge solve has been accepted and you have earned 5 points! Your current point total is: ${row.points + 5}`);
          }

        })

        //lockAdvanced = false;
        sql.run(`UPDATE scores SET advanceLock = ${row.advanceLock} - ${row.advanceLock}`);
        sql.run(`UPDATE scores SET isVerifyAdvance = ${row.isVerifyAdvance} - ${row.isVerifyAdvance}`);
        //needVerifyAdvanced = false;

        // TODO FIX THIS ABSOLUTE SHITE
        // Make this a funciton or SOMETHING. blegh
        sql.get(`SELECT * FROM scores WHERE userId = ${row.advancedChallengerId}`).then(row => {
          if (!row) {
            sql.run("INSERT INTO scores (userId, points, rank, name) VALUES (?, ?, ?, ?)", [row.advancedChallengerId, 1, 0, ranks.rank0]);
            curLevel = row.points + 5;
          } else {
            sql.run(`UPDATE scores SET points = ${row.points + 5} WHERE userId = ${row.advancedChallengerId}`);
            curLevel = row.points + 5;
            //console.log("the curLevel = " + curLevel);
          }

          //console.log("curLevel = " + curLevel);
          if (row.points >= 49 && row.points < 98 && row.rank === 0) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.advancedChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank1}" WHERE userId = ${row.advancedChallengerId}`);
            message.channel.send(row.advancedChallenger + "You've ranked up to rank: " + ranks.rank1);
            rankInNum = row.rank + 1;


          } else{

          }


          if (row.points >= 99 && row.points < 198 && row.rank === 1) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.advancedChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank2}" WHERE userId = ${row.advancedChallengerId}`);
            message.channel.send(row.advancedChallenger + "You've ranked up to rank: " + ranks.rank2);
            rankInNum = row.rank + 1;

          } else{

          }

          if (row.points >= 199 && row.points < 298 && row.rank === 2) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.advancedChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank3}" WHERE userId = ${row.advancedChallengerId}`);
            message.channel.send(row.advancedChallenger + "You've ranked up to rank: " + ranks.rank3);
            rankInNum = row.rank + 1;


          } else{

          }
        }).catch(() => {
          console.error;
          sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, rank INTEGER, name TEXT, advanceLock INTEGER, setAdvance TEXT, setAdvanceId TEXT, isVerifyAdvance INTEGER, advancedChallenger TEXT, advancedChallengerId TEXT, beginnerLock INTEGER, setBeginner TEXT, setBeginnerId TEXT, isVerifyBeginner INTEGER, beginnerChallenger TEXT, beginnerChallengerId TEXT)").then(() => {
            sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock, setAdvance, setAdvanceId, isVerifyAdvance, advancedChallenger, advancedChallengerId, beginnerLock, setBeginner, setBeginnerId, isVerifyBeginner, beginnerChallenger, beginnerChallengerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [row.advancedChallengerId, 5, 0, ranks.rank0, 0, "nobody", "nobodytwo", 0, "nobodythree", "nobodyfour", 0, "nobodyfive", "nobodysix", 0, "nobodyseven", "nobodyeight"]);
          });
        });



      }else{

      }

    })};
  if (message.content.startsWith(config.prefix + "decline advanced")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyAdvance > 0 && row.setAdvanceId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news ${row.advancedChallenger} your challenge solve has been declined. Please try again.`);
        //lockAdvanced = true;
        //needVerifyAdvanced = false;
        sql.run(`UPDATE scores SET isVerifyAdvance = ${row.isVerifyAdvance} - ${row.isVerifyAdvance}`)

      }

    });


  }

});

// Verify extreme challenge
client.on("message", (message) => {
  //if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //if (lockAdvanced == false) return;
  if (message.content.startsWith(config.prefix + "accept extreme")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyExtreme > 0 && row.setExtremeId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        sql.get(`SELECT * FROM scores WHERE userId = ${row.extremeChallengerId}`).then(row => {
          if (!row) {
            sql.get(`SELECT * FROM scores`).then(row => {
              message.channel.send(`Congratulations ${row.extremeChallenger} your challenge solve has been accepted and you have earned 10 points! Your current point total is: 10`);
            })

          } else {
            message.channel.send(`Congratulations ${row.extremeChallenger} your challenge solve has been accepted and you have earned 10 points! Your current point total is: ${row.points + 10}`);
          }

        })
        //lockAdvanced = false;
        sql.run(`UPDATE scores SET extremeLock = ${row.extremeLock} - ${row.extremeLock}`);
        sql.run(`UPDATE scores SET isVerifyExtreme = ${row.isVerifyExtreme} - ${row.isVerifyExtreme}`);
        //needVerifyAdvanced = false;

        //message.channel.send(challengerAdvanced + "Gained 1 point(s)");
        sql.get(`SELECT * FROM scores WHERE userId = ${row.extremeChallengerId}`).then(row => {
          if (!row) {
            sql.run("INSERT INTO scores (userId, points, rank, name) VALUES (?, ?, ?, ?)", [row.extremeChallengerId, 1, 0, ranks.rank0]);
            curLevel = row.points + 10;
          } else {
            sql.run(`UPDATE scores SET points = ${row.points + 10} WHERE userId = ${row.extremeChallengerId}`);
            curLevel = row.points + 10;
            //console.log("the curLevel = " + curLevel);
          }

          // good god its following me
          if (row.points >= 49 && row.points < 98 && row.rank === 0) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.extremeChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank1}" WHERE userId = ${row.extremeChallengerId}`);
            message.channel.send(row.extremeChallenger + "You've ranked up to rank: " + ranks.rank1);
            rankInNum = row.rank + 1;


          } else{

          }


          if (row.points >= 99 && row.points < 198 && row.rank === 1) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.extremeChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank2}" WHERE userId = ${row.extremeChallengerId}`);
            message.channel.send(row.extremeChallenger + "You've ranked up to rank: " + ranks.rank2);
            rankInNum = row.rank + 1;

          } else{

          }

          if (row.points >= 199 && row.points < 298 && row.rank === 2) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.extremeChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank3}" WHERE userId = ${row.extremeChallengerId}`);
            message.channel.send(row.extremeChallenger + "You've ranked up to rank: " + ranks.rank3);
            rankInNum = row.rank + 1;


          } else{

          }
        }).catch(() => {
          console.error;
          sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, rank INTEGER, name TEXT, advanceLock INTEGER, setAdvance TEXT, setAdvanceId TEXT, isVerifyAdvance INTEGER, advancedChallenger TEXT, advancedChallengerId TEXT, beginnerLock INTEGER, setBeginner TEXT, setBeginnerId TEXT, isVerifyBeginner INTEGER, beginnerChallenger TEXT, beginnerChallengerId TEXT, extremeLock INTEGER, setExtreme TEXT, setExtremeId TEXT, isVerifyExtreme INTEGER, extremeChallenger TEXT, extremeChallengerId TEXT)").then(() => {
            sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock, setAdvance, setAdvanceId, isVerifyAdvance, advancedChallenger, advancedChallengerId, beginnerLock, setBeginner, setBeginnerId, isVerifyBeginner, beginnerChallenger, beginnerChallengerId, extremeLock, setExtreme, setExtremeId, isVerifyExtreme, extremeChallenger, extremeChallengerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [row.extremeChallengerId, 10, 0, ranks.rank0, 0, "nobody", "nobodytwo", 0, "nobodythree", "nobodyfour", 0, "nobodyfive", "nobodysix", 0, "nobodyseven", "nobodyeight", 0, "nobodynine", "nobodyten", 0, "nobodyeleven", "nobodytwelve"]);
          });
        });



      }else{

      }
    })};
  if (message.content.startsWith(config.prefix + "decline extreme")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyExtreme > 0 && row.setExtremeId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news ${row.extremeChallenger} your challenge solve has been declined. Please try again.`);
        //lockAdvanced = true;
        //needVerifyAdvanced = false;
        sql.run(`UPDATE scores SET isVerifyExtreme = ${row.isVerifyExtreme} - ${row.isVerifyExtreme}`)

      }

    });


  }

});

// Verify Beginner challenge
client.on("message", (message) => {
  //if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //if (lockBeginner == false) return;
  if (message.content.startsWith(config.prefix + "accept beginner")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyBeginner > 0 && row.setBeginnerId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        sql.get(`SELECT * FROM scores WHERE userId = ${row.beginnerChallengerId}`).then(row => {
          if (!row) {
            sql.get(`SELECT * FROM scores`).then(row => {
              message.channel.send(`Congratulations ${row.beginnerChallenger} your challenge solve has been accepted and you have earned 3 points! Your current point total is: 3`);
            })

          } else {
            message.channel.send(`Congratulations ${row.beginnerChallenger} your challenge solve has been accepted and you have earned 3 points! Your current point total is: ${row.points + 3}`);
          }


        })
        //lockAdvanced = false;
        sql.run(`UPDATE scores SET beginnerLock = ${row.beginnerLock} - ${row.beginnerLock}`);
        sql.run(`UPDATE scores SET isVerifyBeginner = ${row.isVerifyBeginner} - ${row.isVerifyBeginner}`);
        //needVerifyAdvanced = false;

        //message.channel.send(challengerAdvanced + "Gained 1 point(s)");
        sql.get(`SELECT * FROM scores WHERE userId = ${row.beginnerChallengerId}`).then(row => {
          if (!row) {
            sql.run("INSERT INTO scores (userId, points, rank, name) VALUES (?, ?, ?, ?)", [row.beginnerChallengerId, 1, 0, ranks.rank0]);
            curLevel = row.points + 3;
          } else {
            sql.run(`UPDATE scores SET points = ${row.points + 3} WHERE userId = ${row.beginnerChallengerId}`);
            curLevel = row.points + 3;
            //console.log("the curLevel = " + curLevel);


          }
          // i have to look at this three times just to get to the bottom
          if (row.points >= 49 && row.points < 98 && row.rank === 0) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.beginnerChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank1}" WHERE userId = ${row.beginnerChallengerId}`);
            message.channel.send(row.beginnerChallenger + "You've ranked up to rank: " + ranks.rank1);
            rankInNum = row.rank + 1;


          } else{

          }


          if (row.points >= 99 && row.points < 198 && row.rank === 1) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.beginnerChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank2}" WHERE userId = ${row.beginnerChallengerId}`);
            message.channel.send(row.beginnerChallenger + "You've ranked up to rank: " + ranks.rank2);
            rankInNum = row.rank + 1;

          } else{

          }

          if (row.points >= 199 && row.points < 298 && row.rank === 2) {
            sql.run(`UPDATE scores SET rank = ${row.rank + 1} WHERE userId = ${row.beginnerChallengerId}`);
            sql.run(`UPDATE scores SET name = "${ranks.rank3}" WHERE userId = ${row.beginnerChallengerId}`);
            message.channel.send(row.beginnerChallenger + "You've ranked up to rank: " + ranks.rank3);
            rankInNum = row.rank + 1;


          } else{

          }
        }).catch(() => {
          console.error;
          sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, points INTEGER, rank INTEGER, name TEXT, advanceLock INTEGER, setAdvance TEXT, setAdvanceId TEXT, isVerifyAdvance INTEGER, advancedChallenger TEXT, advancedChallengerId TEXT, beginnerLock INTEGER, setBeginner TEXT, setBeginnerId TEXT, isVerifyBeginner INTEGER, beginnerChallenger TEXT, beginnerChallengerId TEXT)").then(() => {
            sql.run("INSERT INTO scores (userId, points, rank, name, advanceLock, setAdvance, setAdvanceId, isVerifyAdvance, advancedChallenger, advancedChallengerId, beginnerLock, setBeginner, setBeginnerId, isVerifyBeginner, beginnerChallenger, beginnerChallengerId) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [row.beginnerChallengerId, 3, 0, ranks.rank0, 0, "nobody", "nobodytwo", 0, "nobodythree", "nobodyfour", 0, "nobodyfive", "nobodysix", 0, "nobodyseven", "nobodyeight"]);
          });
        });



      }else{

      }
    })};
  if (message.content.startsWith(config.prefix + "decline beginner")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyBeginner > 0 && row.setBeginnerId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news ${row.beginnerChallenger} your challenge solve has been declined. Please try again.`);
        //lockAdvanced = true;
        //needVerifyAdvanced = false;
        sql.run(`UPDATE scores SET isVerifyBeginner = ${row.isVerifyBeginner} - ${row.isVerifyBeginner}`)

      }

    });


  }
});

// Cancel Beginner... why is this so far down?
client.on("message", (message) => {
  //if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //if (lockAdvanced == false) return;
  if (message.content.startsWith(config.prefix + "cancel beginner")){
    sql.get(`SELECT * FROM scores`).then(row => {
      if (row.isVerifyBeginner > 0 && row.setBeginnerId === message.author.id || message.member.roles.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`The beginner challenge has been canceled.`);
        //lockAdvanced = false;
        sql.run(`UPDATE scores SET beginnerLock = ${row.beginnerLock} - ${row.beginnerLock}`);
        sql.run(`UPDATE scores SET isVerifyBeginner = ${row.isVerifyBeginner} - ${row.isVerifyBeginner}`);
        sql.run(`UPDATE scores SET beginnerChallengerId = ${row.beginnerChallengerId = null}`);
        sql.run(`UPDATE scores SET beginnerChallenger = ${row.beginnerChallenger = null}`);
        //needVerifyAdvanced = fals
      }else{

      }
    })};

});


// TODO remake this awful system
// Add rank for advanced
client.on("message", (message) =>{
  sql.get(`SELECT * FROM scores`).then(row => {
    if (message.content.startsWith(row.advancedChallenger + "You've ranked up to rank: Challenger")){
      //message.channel.send("lol");
      role1 = message.guild.roles.find("name", "Challenger");
      let member = message.mentions.members.first();
      member.addRole(role1);
      //console.log(member);
    }else {

    }

    if (message.content.startsWith(row.advancedChallenger + "You've ranked up to rank: Elite Challenger")){
      //message.channel.send("lol");
      role2 = message.guild.roles.find("name", "Elite Challenger");
      let member2 = message.mentions.members.first();
      member2.addRole(role2);
      //console.log(member);
    }else {

    }

    if (message.content.startsWith(row.advancedChallenger + "You've ranked up to rank: Legendary Challenger")){
      //message.channel.send("lol");
      role3 = message.guild.roles.find("name", "Legendary Challenger");
      let member = message.mentions.members.first();
      member.addRole(role3);
      //console.log(member);
    }else {

    }

    if (message.content.startsWith(row.beginnerChallenger + "You've ranked up to rank: Challenger")){
      //message.channel.send("lol");
      role1 = message.guild.roles.find("name", "Challenger");
      let member = message.mentions.members.first();
      member.addRole(role1);
      //console.log(member);
    }else {

    }

    if (message.content.startsWith(row.beginnerChallenger + "You've ranked up to rank: Elite Challenger")){
      //message.channel.send("lol");
      role2 = message.guild.roles.find("name", "Elite Challenger");
      let member2 = message.mentions.members.first();
      member2.addRole(role2);
      //console.log(member);
    }else {

    }

    if (message.content.startsWith(row.beginnerChallenger + "You've ranked up to rank: Legendary Challenger")){
      //message.channel.send("lol");
      role3 = message.guild.roles.find("name", "Legendary Challenger");
      let member = message.mentions.members.first();
      member.addRole(role3);
      //console.log(member);
    }else {

    }
  });


});


// #########################
// OLD CODE BELOW DELETE PLS
// #########################

// Verify Beginner override
/*
client.on("message", (message) =>{
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (lockBeginner == false) return;
  if (message.member.roles.some(r=>["Admin", "Bot"].includes(r.name))){
    if (message.content.startsWith(config.prefix + "verify beginner override")){
      verifyChallengerBeginnerAdmin === message.author;
      if (needVerifyBeginner === true){
        message.channel.send("Congratulations " + (challengerBeginner) + " an " + (verifyChallengerBeginnerAdmin) + " has verified your challenge and you have earned 3 points!");
        lockBeginner = false;
        needVerifyBeginner = false;
      }else {
        message.channel.send("Sorry only Admins can override challenges");
      }
    }
  }
});
*/
















/* Debug stuff below
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(config.prefix + "debug add role 1")){
    role1 = message.guild.roles.find("name", "Challenger");
    message.member.addRole(role1);
  }
})
*/
/*
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(config.prefix + "debug remove role 1")){
    role1 = message.guild.roles.find("name", "Challenger");
    message.member.removeRole(role1);
  }
  if (message.content.startsWith(config.prefix + "debug remove role 2")){
    role1 = message.guild.roles.find("name", "Elite Challenger");
    message.member.removeRole(role1);
  }
})
/*
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(config.prefix + "debug add role 2")){
    role1 = message.guild.roles.find("name", "Elite Challenger");
    message.member.addRole(role1);
  }
})
*/
/*
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(config.prefix + "debug remove role 2")){
    role1 = message.guild.roles.find("name", "Elite Challenger");
    message.member.removeRole(role1);
  }
})
/*
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(config.prefix + "debug add role 3")){
    role1 = message.guild.roles.find("name", "Legendary Challenger");
    message.member.addRole(role1);
  }
})
*/
/*
client.on("message", (message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  if (message.content.startsWith(config.prefix + "debug remove role 3")){
    role1 = message.guild.roles.find("name", "Legendary Challenger");
    message.member.removeRole(role1);
  }
})













*/







//Client login token
client.login(secret.token);
