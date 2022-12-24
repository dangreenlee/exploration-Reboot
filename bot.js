const SQLite = require("better-sqlite3");
const sql = new SQLite('./score.sqlite');
const config = require("./config.json");
// const secret = require("./secret.json");
//const secret = require("./secret2.json");
const fs = require('fs');

// New update stuff 
const { EmbedBuilder, ActionRowBuilder, ButtonStyle, InteractionCollector, Message } = require('discord.js');
const { Client, GatewayIntentBits } = require('discord.js');
const { ButtonBuilder } = require("@discordjs/builders");
const client = new Client({ intents: [
                                GatewayIntentBits.Guilds,
                                GatewayIntentBits.GuildMessages,
                                GatewayIntentBits.MessageContent,
                                GatewayIntentBits.GuildMembers,
                                GatewayIntentBits.GuildEmojisAndStickers,
                                GatewayIntentBits.GuildPresences,
                                GatewayIntentBits.GuildMessageReactions,
                                GatewayIntentBits.DirectMessages                   
                            ] });




// READY
client.on("ready", () => {

    const table = sql.prepare("SELECT count(*) FROM sqlite_master WHERE type='table';").get();
    if(!table['count(*)']) {
        // If the table isn't there, create it and setup the database correctly.
        sql.prepare("CREATE TABLE scores (userId TEXT PRIMARY KEY, points INTEGER);").run();
        sql.prepare("CREATE TABLE retail_extreme (extremeLock INTEGER, setExtremeId TEXT, isVerifyExtreme INTEGER, extremeChallengerId INTEGER);").run();
        sql.prepare("CREATE TABLE retail_basic (beginnerLock INTEGER, setBeginnerId TEXT, isVerifyBeginner INTEGER, beginnerChallengerId INTEGER);").run();
        sql.prepare("CREATE TABLE retail_advanced (advanceLock INTEGER, setAdvanceId TEXT, isVerifyAdvance INTEGER, advancedChallengerId INTEGER);").run();
        sql.prepare("CREATE TABLE classic_advanced (ClassicLock INTEGER, setClassicId TEXT, isVerifyClassic INTEGER, classicChallengerId INTEGER);").run(); //advanced
        sql.prepare("CREATE TABLE classic_basic (ClassicBasicLock INTEGER, setClassicBasicId TEXT, isVerifyClassicBasic INTEGER, classicBasicChallengerId INTEGER);").run();
        sql.prepare("CREATE TABLE classic_extreme (classicExtremeLock INTEGER, setClassicExtremeId TEXT, isVerifyClassicExtreme INTEGER, classicExtremeChallengerId INTEGER);").run();

        // Ensure that the "id" row is always unique and indexed.

    }
  
    // And then we have two prepared statements to get and set the score data.
    client.getScore = sql.prepare("SELECT * FROM scores WHERE userId = ?");
    client.getLeaderboard = sql.prepare("SELECT * FROM scores ORDER BY points DESC LIMIT 10");
    //client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (userId, points)VALUES (@userId, @points);");
    client.setScore = sql.prepare("INSERT OR REPLACE INTO scores (userId, points) VALUES (@userId, @points);");


   // client.setstar = sql.prepare("INSERT OR REPLACE INTO biweek (userId, stars, frames) VALUES (); ")


    client.getDatabase = sql.prepare("SELECT * FROM scores");
    client.getAllDatabase = sql.prepare("SELECT * FROM RETAIL_BASIC, RETAIL_ADVANCED, RETAIL_EXTREME, CLASSIC_BASIC, CLASSIC_ADVANCED, CLASSIC_EXTREME");
    client.getRetailBasicDatabase = sql.prepare("SELECT * FROM RETAIL_BASIC");
    client.getRetailAdvancedDatabase = sql.prepare("SELECT * FROM RETAIL_ADVANCED");
    client.getRetailExtremeDatabase = sql.prepare("SELECT * FROM RETAIL_EXTREME");
    client.getClassicBasicDatabase = sql.prepare("SELECT * FROM CLASSIC_BASIC");
    client.getClassicAdvancedDatabase = sql.prepare("SELECT * FROM CLASSIC_ADVANCED");
    client.getClassicExtremeDatabase = sql.prepare("SELECT * FROM CLASSIC_EXTREME");

    // BASIC CHALLENGES
    client.beginnerLockOn = sql.prepare("UPDATE retail_basic SET beginnerLock = 1");
    client.beginnerLockOff = sql.prepare("UPDATE retail_basic SET beginnerLock = 0");
    client.beginnerId = sql.prepare("UPDATE retail_basic SET setBeginnerId = ?");
    client.isVerifyBeginnerOn = sql.prepare("UPDATE retail_basic SET isVerifyBeginner = 1");
    client.isVerifyBeginnerOff = sql.prepare("UPDATE retail_basic SET isVerifyBeginner = 0");
    client.beginnerChallengerId = sql.prepare("UPDATE retail_basic SET beginnerChallengerId = ?");

    // ADVANCED CHALLENGES retail_advanced
    client.advanceLockOn = sql.prepare("UPDATE retail_advanced SET advanceLock = 1");
    client.advanceLockOff = sql.prepare("UPDATE retail_advanced SET advanceLock = 0");
    client.advanceId = sql.prepare("UPDATE retail_advanced SET setAdvanceId = ?");
    client.isVerifyAdvanceOn = sql.prepare("UPDATE retail_advanced SET isVerifyAdvance = 1");
    client.isVerifyAdvanceOff = sql.prepare("UPDATE retail_advanced SET isVerifyAdvance = 0");
    client.advancedChallengerId = sql.prepare("UPDATE retail_advanced SET advancedChallengerId = ?");

    // EXTREME CHALLENGES
    client.extremeLockOn = sql.prepare("UPDATE retail_extreme SET extremeLock = 1");
    client.extremeLockOff = sql.prepare("UPDATE retail_extreme SET extremeLock = 0");
    client.extremeId = sql.prepare("UPDATE retail_extreme SET setExtremeId = ?");
    client.isVerifyExtremeOn = sql.prepare("UPDATE retail_extreme SET isVerifyExtreme = 1");
    client.isVerifyExtremeOff = sql.prepare("UPDATE retail_extreme SET isVerifyExtreme = 0");
    client.extremeChallengerId = sql.prepare("UPDATE retail_extreme SET extremeChallengerId = ?");

    // CLASSIC BASIC CHALLENGES classic_basic
    client.ClassicBasicLockOn = sql.prepare("UPDATE classic_basic SET ClassicBasicLock = 1");
    client.ClassicBasicLockOff = sql.prepare("UPDATE classic_basic SET ClassicBasicLock = 0");
    client.ClassicBasicId = sql.prepare("UPDATE classic_basic SET setClassicBasicId = ?");
    client.isVerifyClassicBasicOn = sql.prepare("UPDATE classic_basic SET isVerifyClassicBasic = 1");
    client.isVerifyClassicBasicOff = sql.prepare("UPDATE classic_basic SET isVerifyClassicBasic = 0");
    client.classicBasicChallengerId = sql.prepare("UPDATE classic_basic SET classicBasicChallengerId = ?");

    // CLASSIC ADVANCED CHALLENGES classic_advanced
    client.ClassicLockOn = sql.prepare("UPDATE classic_advanced SET ClassicLock = 1");
    client.ClassicLockOff = sql.prepare("UPDATE classic_advanced SET ClassicLock = 0");
    client.ClassicId = sql.prepare("UPDATE classic_advanced SET setClassicId = ?");
    client.isVerifyClassicOn = sql.prepare("UPDATE classic_advanced SET isVerifyClassic = 1");
    client.isVerifyClassicOff = sql.prepare("UPDATE classic_advanced SET isVerifyClassic = 0");
    client.classicChallengerId = sql.prepare("UPDATE classic_advanced SET classicChallengerId = ?");

    // CLASSIC EXTREME CHALLENGES classic_extreme
    client.ClassicExtremeLockOn = sql.prepare("UPDATE classic_extreme SET classicExtremeLock = 1");
    client.ClassicExtremeLockOff = sql.prepare("UPDATE classic_extreme SET classicExtremeLock = 0");
    client.ClassicExtremeId = sql.prepare("UPDATE classic_extreme SET setClassicExtremeId = ?");
    client.isVerifyClassicExtremeOn = sql.prepare("UPDATE classic_extreme SET isVerifyClassicExtreme = 1");
    client.isVerifyClassicExtremeOff = sql.prepare("UPDATE classic_extreme SET isVerifyClassicExtreme = 0");
    client.classicExtremeChallengerId = sql.prepare("UPDATE classic_extreme SET classicExtremeChallengerId = ?");



    client.user.setActivity(config.playingGame, { type: 'WATCHING' });  // Dosen't work anymore for some reason?
    
    
    console.log(`Bot Activated! Logged in as: ${client.user.tag}`);
    console.log("You are running version: " + config.botVersion + " of the ExplorationBot");
    console.log("");
    
});
//BUTTONS
const basic_buttons =  new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId('accept_button_basic')
    .setLabel('Accept')
    .setStyle(ButtonStyle.Primary),
   new ButtonBuilder()
    .setCustomId('decline_button_basic')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger)
)
const advanced_buttons_retail =  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId('accept_button_advance')
    .setLabel('Accept')
    .setStyle(ButtonStyle.Primary),
   new ButtonBuilder()
    .setCustomId('decline_button_advance')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger)
)
const extreme_buttons_retail =  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId('accept_button_extreme')
    .setLabel('Accept')
    .setStyle(ButtonStyle.Primary),
   new ButtonBuilder()
    .setCustomId('decline_button_extreme')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger)
)
const basic_buttons_classic =  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId('accept_button_classic')
    .setLabel('Accept')
    .setStyle(ButtonStyle.Primary),
   new ButtonBuilder()
    .setCustomId('decline_button_classic')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger)
)
const advanced_buttons_classic =  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId('accept_button_classic_advanced')
    .setLabel('Accept')
    .setStyle(ButtonStyle.Primary),
   new ButtonBuilder()
    .setCustomId('decline_button_classic_advanced')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger)
)
const extreme_buttons_classic =  new ActionRowBuilder().addComponents(
    new ButtonBuilder()
    .setCustomId('accept_button_classic_extreme')
    .setLabel('Accept')
    .setStyle(ButtonStyle.Primary),
   new ButtonBuilder()
    .setCustomId('decline_button_classic_extreme')
    .setLabel('Decline')
    .setStyle(ButtonStyle.Danger)
)
   
client.on("interactionCreate", async message => {
   // if (!message.isChatInputCommand() || !message.isButton()) return;  // No more needing try catch for bad inputs!
        if (message.customId === 'decline_button'){
            message.reply('test2');
        }

    // PING COMMAND
    if (message.commandName === "ping") {

        message.reply("Pong!");

    }
    function checkDate(){
  
        let data = fs.readFileSync('./biweekly.txt', 'utf8');
        var currentdate = new Date(Date.now());
        var fortnightAway = new Date(Date.now() + 12096e5); // 2 weeks.
        console.log("Checking date..");
        if(currentdate.toDateString() === data){
        message.channel.send("Previous contest ending on " + data + " has ended, starting new contest ending on " + fortnightAway.toDateString())
        fs.writeFileSync('./biweekly.txt', fortnightAway.toDateString())
        }
    
        else
        {
        return console.log("Current contest ends on " + data + " Current date is: " + currentdate.toDateString()); //dbg
    
        }       
    }
    if (message. commandName === "pints")
    {
        let pints = Math.floor(Math.random() * 1000)
        message.reply(`You have ${pints} pints.`)

    }
    if (message.commandName === "teststars"){

     await message.reply({content: 'test', components: [accept]});
    }
     if(message.commandName === "init")
     {
        checkDate();
        setInterval(checkDate, 1*1000); // check every day
        let data = fs.readFileSync('./biweekly.txt', 'utf8');
        message.reply("Biweekly tracker initialized, Challenge Bot will post here on " + data);
     }
    //POINTS COMMAND    
    if(message.commandName === "points"){
        let score = client.getScore.get(message.user.id);
        try{
            message.reply(`You have ${score.points} points`);
        }catch (error){
            message.reply("You have 0 points")
        }
         
    }
    
        
    // ADD POINT
    if(message.commandName === "addpoint"){
        
        let pointsToAdd = message.options.getNumber("points");
        let user = message.options.getUser("user");
        let starscore = client.getScore.get(user.id);
        // Get their current points.
        let userscore = client.getScore.get(user.id); 
        
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!userscore) {
            userscore = { userId: user.id, points: 0}
        }
        userscore.points += pointsToAdd;

        // And we save it to the database
        client.setScore.run(userscore);
        message.reply(`${user} has received ${pointsToAdd} points!`);

    };


    // REMOVE POINT
    if(message.commandName === "removepoint"){

        let pointsToRemove = message.options.getNumber("points");
        let user = message.options.getUser("user");

        // Get current points
        let userscore = client.getScore.get(user.id);
        
        // It's possible to give points to a user we haven't seen, so we need to initiate defaults here too!
        if (!userscore) {
            userscore = { userId: user.id, points: 0 }
        }
        userscore.points -= pointsToRemove;
        
        // And we save it to the database
        client.setScore.run(userscore);
        message.reply(`Removed ${pointsToRemove} point(s) from ${user} successfully`);

    }
    
    // LEADERBOARD
    if(message.commandName === "leaderboard"){
        //const top10 = sql.prepare("SELECT * FROM scores ORDER BY points DESC LIMIT 10;");
        let top10 = client.getLeaderboard.all();
        //console.log(top10.points)
        const embed = new EmbedBuilder()
            .setTitle("Leaderboard [451 version]")
            .setDescription("Top 10 points (wow this sure looks ugly pls fix)")
            .setColor(0x00AE86);
    
        
        for( data of top10) {
            
           
            embed.addFields({ name: `${data.points} points`, value: `<@${data.userId}>`, inline: true});
            //embed.setDescription(`<@${data.userId}> ${data.points} points`);
        }
        message.reply({ embeds: [embed] });
            
    }
//################################### CHALLENGES BELOW ###########################################################
    // CHALLENGE INFO
    if(message.commandName === "challenge"){
        
        if (message.options.getSubcommand() === 'info') {   
            let info = client.getAllDatabase.get();
	        const challengeInfoEmbed = new EmbedBuilder()
                .setColor(16711680)
	            .setTitle('Challenge Information')        
	            .setDescription(`Beginner challenge holder = <@${info.setBeginnerId}>\n
                    BeginnerLock = ${info.beginnerLock}\n
                    Advanced challenge holder = <@${info.setAdvanceId}>\n
                    AdvancedLock = ${info.advanceLock}\n
                    Extreme challenge holder = <@${info.setExtremeId}>\n
                    ExtremeLock = ${info.extremeLock}\n
                    Classic challenge holder = <@${info.setClassicId}>\n
                    ClassicLock = ${info.ClassicLock}\n
                    ClassicBasic challenge holder = <@${info.setClassicBasicId}>\n
                    ClassicBasicLock = ${info.ClassicBasicLock}
                    `)

            message.reply({ embeds: [challengeInfoEmbed] });
        }

        // CHALLENGE BASIC
        if(message.options.getSubcommand() === "basic"){
            let basicLock = client.getRetailBasicDatabase.get();
            let file = message.options.getAttachment("image")

            const challengeEmbed = new EmbedBuilder()            
                .setTitle('Basic Challenge')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp()                              
    
            if(basicLock.beginnerLock === 1){
                message.reply("You must solve the current challenge before posting your own, alternatively you may instead post your challenge in <#546846689399668747>");
            }

            if(basicLock.beginnerLock === 0){
                client.beginnerLockOn.run();
                client.beginnerId.run(message.user.id);

                await message.reply({ embeds: [challengeEmbed] });  
                await message.channel.send(`<@${message.user.id}> Has set a basic challenge! Solve this challenge by posting a picture of your character in the same place, and earn 3 points!`)
            
            }
        }

        // CHALLENGE ADVANCED
        if(message.options.getSubcommand() === "advanced"){
            let basicLock = client.getRetailAdvancedDatabase.get();
            let file = message.options.getAttachment("image")

            const challengeEmbed = new EmbedBuilder()            
                .setTitle('Advanced Challenge')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp()  

            if(basicLock.advanceLock === 1){
                message.reply("You must solve the current challenge before posting your own, alternatively you may instead post your challenge in <#546846689399668747>");
            } 
            
            if(basicLock.advanceLock === 0){
                client.advanceLockOn.run();
                client.advanceId.run(message.user.id);
    
                await message.reply({ embeds: [challengeEmbed] });
                await message.channel.send(`<@${message.user.id}> Has set an advanced challenge! Solve this challenge by posting a picture of your character in the same place, and earn 5 points!`)
    
            }
        }

        // CHALLENGE EXTREME
        if(message.options.getSubcommand() === "extreme"){
            let basicLock = client.getRetailExtremeDatabase.get();
            let file = message.options.getAttachment("image")
    
            const challengeEmbed = new EmbedBuilder()            
                .setTitle('Extreme Challenge')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp()  

            if(basicLock.extremeLock === 1){
                message.reply("You must solve the current challenge before posting your own, alternatively you may instead post your challenge in <#546846689399668747>");
            }
            
            if(basicLock.extremeLock === 0){
                client.extremeLockOn.run();
                client.extremeId.run(message.user.id);
    
                await message.reply({ embeds: [challengeEmbed] });
                await message.channel.send(`<@${message.user.id}> Has set an extreme challenge! Solve this challenge by posting a picture of your character in the same place, and earn 5 points + 5 more for every week the challenge stays up! (Max 20 points)`)
    
            }    
        }

        // CHALLENGE CLASSIC 
        if(message.options.getSubcommand() === "wotlk"){
            let challengeType = message.options.getString("type");  // Get challenge type (basic, advanced, extreme)

            // CLASSIC BASIC
            if(challengeType === "basic"){  
                let basicLock = client.getClassicBasicDatabase.get();
                let file = message.options.getAttachment("image")
                
                const challengeEmbed = new EmbedBuilder()            
                    .setTitle('WotLK Basic Challenge')
                    .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                    .setImage(file.url)
                    .setTimestamp()  
                
                         

                if(basicLock.ClassicBasicLock === 1){
                    message.reply("You must solve the current challenge before posting your own, alternatively you may instead post your challenge in <#546846689399668747>");       
                }

                if(basicLock.ClassicBasicLock === 0){
                    
                                    
                    client.ClassicBasicLockOn.run();
                    client.ClassicBasicId.run(message.user.id);
        
                    await message.reply({ embeds: [challengeEmbed] });                    
                    await message.channel.send(`<@${message.user.id}> Has set a WOTLK basic challenge! Solve this challenge by posting a picture of your character in the same place, and earn 3 points!`)
        
                }
            }

            // CLASSIC ADVANCED
            if(challengeType === "advanced"){
                let basicLock = client.getClassicAdvancedDatabase.get();
                let file = message.options.getAttachment("image")

                const challengeEmbed = new EmbedBuilder()            
                .setTitle('WotLK Advanced Challenge')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp()                  

                if(basicLock.ClassicLock === 1){
                    message.reply("You must solve the current challenge before posting your own, alternatively you may instead post your challenge in <#546846689399668747>");
                }

                if(basicLock.ClassicLock === 0){
                    client.ClassicLockOn.run();
                    client.ClassicId.run(message.user.id);

                    await message.reply({ embeds: [challengeEmbed] });
                    await message.channel.send(`<@${message.user.id}> Has set a wotlk advanced challenge! Solve this challenge by posting a picture of your character in the same place, and earn 5 points!`)

                }
            }

            // CLASSIC EXTREME
            if(challengeType === "extreme"){
                let basicLock = client.getClassicExtremeDatabase.get();
                let file = message.options.getAttachment("image")

                const challengeEmbed = new EmbedBuilder()            
                .setTitle('WotLK Extreme Challenge')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp()  

                if(basicLock.classicextremeLock === 1){
                    message.channel.send("You must solve the current challenge before posting your own, alternatively you may instead post your challenge in <#546846689399668747>");
                }
                
                if(basicLock.classicExtremeLock === 0){
                    client.ClassicExtremeLockOn.run();
                    client.ClassicExtremeId.run(message.user.id);
        
                    await message.reply({ embeds: [challengeEmbed] });
                    await message.channel.send(`<@${message.user.id}> Has set a WOTLK extreme challenge! Solve this challenge by posting a picture of your character in the same place, and earn 5 points + 5 more for every week the challenge stays up! (Max 20 points)`)
        
                }

            }
        }

    }
    

//################################### CHALLENGE SOLVES ###########################################################

    // SOLVE COMMAND
    if(message.commandName === "solve"){

        // BASIC SOLVE
        if(message.options.getSubcommand() === "basic"){
            let basicSolve = client.getRetailBasicDatabase.get();
            let file = message.options.getAttachment("image")

            const challengeSolveEmbed = new EmbedBuilder()            
                .setTitle('Basic Solve')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp()  

            if(basicSolve.beginnerLock === 1 && basicSolve.isVerifyBeginner === 0 && message.user.id !== basicSolve.setBeginnerId){
                client.isVerifyBeginnerOn.run();
                client.beginnerChallengerId.run(message.user.id);
    
                await message.reply({ embeds: [challengeSolveEmbed] });
             await message.channel.send({content:`A challenger has solved this challenge <@${basicSolve.setBeginnerId}> or an Admin will need to verify it is correct by clicking the accept or decline buttons below.`, components:[basic_buttons]});
        
   
    
    
            } 
            //else{
                //await message.reply(`You must wait untill <@${basicSolve.setBeginnerId}> has verified the current challenge`);
            //}
            
    
            if(basicSolve.beginnerLock === 0){
                await message.reply("There is no active challenge right now");
            }
        }
        
        // ADVANCED SOLVE
        if(message.options.getSubcommand() === "advanced"){
            let basicSolve = client.getRetailAdvancedDatabase.get();
            let file = message.options.getAttachment("image")

            const challengeSolveEmbed = new EmbedBuilder()            
                .setTitle('Advanced Solve')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp() 
        
            if(basicSolve.advanceLock === 1 && basicSolve.isVerifyAdvance === 0 && message.user.id !== basicSolve.setAdvanceId){
                client.isVerifyAdvanceOn.run();
                client.advancedChallengerId.run(message.user.id);
        
                await message.reply({ embeds: [challengeSolveEmbed] });
                await message.channel.send({content:`A challenger has solved this challenge <@${basicSolve.setAdvanceId}> or an Admin will need to verify it is correct by clicking the accept or decline buttons below.`, components:[advanced_buttons_retail]});
        
        
        
            } else{
                message.reply(`You must wait untill <@${basicSolve.setAdvanceId}> has verified the current challenge`);
            }
        
            if(basicSolve.advanceLock === 0){
                message.reply("There is no active challenge right now");
            }
        }

        // EXTREME SOLVE
        if(message.options.getSubcommand() === "extreme"){
            let basicSolve = client.getRetailExtremeDatabase.get();
            let file = message.options.getAttachment("image")

            const challengeSolveEmbed = new EmbedBuilder()            
                .setTitle('Extreme Solve')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp() 

            if(basicSolve.extremeLock === 1 && basicSolve.isVerifyExtreme === 0 && message.user.id !== basicSolve.setExtremeId){
                client.isVerifyExtremeOn.run();
                client.extremeChallengerId.run(message.user.id);

                await message.reply({ embeds: [challengeSolveEmbed] });
                await message.channel.send({content: `A challenger has solved this challenge <@${basicSolve.setExtremeId}> or an Admin will need to verify it is correct by clicking the accept or decline buttons below.`, components:[extreme_buttons_retail]});



            } else{
                message.reply(`You must wait untill <@${basicSolve.setExtremeId}> has verified the current challenge`);
            }

            if(basicSolve.extremeLock === 0){
                message.reply("There is no active challenge right now");
            }
        }    

        // CLASSIC SOLVES
        if(message.options.getSubcommand() === "wotlk"){
            let challengeType = message.options.getString("type");  // Get challenge type (basic, advanced, extreme)

            // CLASSIC BASIC SOLVE
            if(challengeType === "basic"){
                let basicSolve = client.getClassicBasicDatabase.get();
                let file = message.options.getAttachment("image")

                const challengeSolveEmbed = new EmbedBuilder()            
                .setTitle('WotLK Basic Solve')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp() 
    
                if(basicSolve.ClassicBasicLock === 1 && basicSolve.isVerifyClassicBasic === 0 && message.user.id !== basicSolve.setClassicBasicId){
                    //await interaction.deferReply();
                    await client.isVerifyClassicBasicOn.run();
                    await client.classicBasicChallengerId.run(message.user.id);
    
                    await message.reply({ embeds: [challengeSolveEmbed] });
                    await message.channel.send({content:`A challenger has solved this challenge <@${basicSolve.setClassicBasicId}> or an Admin will need to verify it is correct by clicking the accept or decline buttons below.`, components:[basic_buttons_classic]});
    
    
    
                } else{
                    message.reply(`You must wait untill <@${basicSolve.setClassicBasicId}> has verified the current challenge`);
                }
    
                if(basicSolve.ClassicBasicLock === 0){
                    message.reply("There is no active challenge right now");
                }
            }

            // CLASSIC ADVANCED SOLVE
            if(challengeType === "advanced"){

                let basicSolve = client.getClassicAdvancedDatabase.get();
                let file = message.options.getAttachment("image")

                const challengeSolveEmbed = new EmbedBuilder()            
                .setTitle('WotLK Advanced Solve')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp() 

                if(basicSolve.ClassicLock === 1 && basicSolve.isVerifyClassic === 0 && message.user.id !== basicSolve.setClassicId){
                    
                    await client.isVerifyClassicOn.run();
                    await client.classicChallengerId.run(message.user.id);

                    await message.reply({ embeds: [challengeSolveEmbed] });
                    await message.channel.send({content:`A challenger has solved this challenge <@${basicSolve.setClassicId}> or an Admin will need to verify it is correct by clicking the accept or decline buttons below.`, components:[advanced_buttons_classic]});



                } else{
                message.reply(`You must wait untill <@${basicSolve.setClassicId}> has verified the current challenge`);
                }

                if(basicSolve.ClassicLock === 0){
                    message.reply("There is no active challenge right now");
                }
            }

            // CLASSIC EXTREME SOLVE
            if(challengeType === "extreme"){
                let basicSolve = client.getClassicExtremeDatabase.get();
                let file = message.options.getAttachment("image")

                const challengeSolveEmbed = new EmbedBuilder()            
                .setTitle('WotLK Extreme Solve')
                .setAuthor({ name: message.member.displayName, iconURL: message.user.displayAvatarURL(), url: 'https://www.youtube.com/watch?v=TKfS5zVfGBc' })       
                .setImage(file.url)
                .setTimestamp() 

                if(basicSolve.classicExtremeLock === 1 && basicSolve.isVerifyClassicExtreme === 0 && message.user.id !== basicSolve.setClassicExtremeId){
                    
                    await client.isVerifyClassicExtremeOn.run();
                    await client.classicExtremeChallengerId.run(message.user.id);
        
                    await message.reply({ embeds: [challengeSolveEmbed] });
                    await message.channel.send({content:`A challenger has solved this challenge <@${basicSolve.setClassicExtremeId}> or an Admin will need to verify it is correct by clicking the accept or decline buttons below.`, components:[extreme_buttons_classic]});
        
        
        
                } else{
                    message.reply(`You must wait untill <@${basicSolve.setClassicExtremeId}> has verified the current challenge`);
                }
        
                if(basicSolve.classicExtremeLock === 0){
                    message.reply("There is no active challenge right now");
                }
            }
        }

    } 
    

//################################### CHALLENGE ACCEPT ###########################################################
if(message.customId === 'accept_button_basic')
{
    let basicAccept = client.getRetailBasicDatabase.get();
    let userscore2 = client.getScore.get(basicAccept.beginnerChallengerId);

    if (!userscore2) {
        userscore2 = { userId: basicAccept.beginnerChallengerId, points: 0, }
    }

    if(basicAccept.isVerifyBeginner === 1 && basicAccept.setBeginnerId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){


        client.beginnerLockOff.run();
        client.isVerifyBeginnerOff.run();

        userscore2.points += 3;

        client.setScore.run(userscore2);
        message.channel.send(`Congratulations <@${basicAccept.beginnerChallengerId}> your challenge solve has been accepted and you have earned 3 points! Your current point total is: ${userscore2.points}`)
        message.message.delete();
    } else{
        message.reply({content:"You cannot accept this challenge", ephemeral: true });
    }          
}
if (message.customId === 'accept_button_advance')
{
    let basicAccept = client.getRetailAdvancedDatabase.get();
    let userscore2 = client.getScore.get(basicAccept.advancedChallengerId);

    if (!userscore2) {
        userscore2 = { userId: basicAccept.advancedChallengerId, points: 0 }
    }

    if(basicAccept.isVerifyAdvance === 1 && basicAccept.setAdvanceId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){


        client.advanceLockOff.run();
        client.isVerifyAdvanceOff.run();

        userscore2.points += 5;

        client.setScore.run(userscore2);
        message.channel.send(`Congratulations <@${basicAccept.advancedChallengerId}> your challenge solve has been accepted and you have earned 5 points! Your current point total is: ${userscore2.points}`)
        message.message.delete();
    } else{
        message.reply({content:"You cannot accept this challenge", ephemeral: true });
    }        
}
if (message.customId === 'accept_button_extreme'){
    let basicAccept = client.getRetailExtremeDatabase.get();
    let userscore2 = client.getScore.get(basicAccept.extremeChallengerId);

    if (!userscore2) {
        userscore2 = { userId: basicAccept.extremeChallengerId, points: 0 }
    }

    if(basicAccept.isVerifyExtreme === 1 && basicAccept.setExtremeId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){


        client.extremeLockOff.run();
        client.isVerifyExtremeOff.run();

        userscore2.points += 5;

        client.setScore.run(userscore2);
        message.channel.send(`Congratulations <@${basicAccept.extremeChallengerId}> your challenge solve has been accepted and you have earned 5 points! Your current point total is: ${userscore2.points}`)
        message.message.delete();
    } else{
        message.reply({content:"You cannot accept this challenge", ephemeral: true });
    }
}
if(message.customId === 'accept_button_classic'){
    let basicAccept = client.getClassicBasicDatabase.get();
    let userscore2 = client.getScore.get(basicAccept.classicBasicChallengerId);

    if (!userscore2) {
        userscore2 = { userId: basicAccept.classicBasicChallengerId, points: 0 }
    }

    if(basicAccept.isVerifyClassicBasic === 1 && basicAccept.setClassicBasicId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){


        client.ClassicBasicLockOff.run();
        client.isVerifyClassicBasicOff.run();

        userscore2.points += 3;

        client.setScore.run(userscore2);
       
        message.channel.send(`Congratulations <@${basicAccept.classicBasicChallengerId}> your challenge solve has been accepted and you have earned 3 points! Your current point total is: ${userscore2.points}`)
        message.message.delete();
    } else{
        message.reply({content:"You cannot accept this challenge", ephemeral: true });
    }                
}
if(message.customId === 'accept_button_classic_advanced'){
    let basicAccept = client.getClassicAdvancedDatabase.get();
    let userscore2 = client.getScore.get(basicAccept.classicChallengerId);

    if (!userscore2) {
        userscore2 = { userId: basicAccept.classicChallengerId, points: 0}
    }

    if(basicAccept.isVerifyClassic === 1 && basicAccept.setClassicId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){


        client.ClassicLockOff.run();
        client.isVerifyClassicOff.run();

        userscore2.points += 5;

        client.setScore.run(userscore2);
        message.channel.send(`Congratulations <@${basicAccept.classicChallengerId}> your challenge solve has been accepted and you have earned 5 points! Your current point total is: ${userscore2.points}`)
        message.message.delete();
    } else{
        message.reply({content:"You cannot accept this challenge", ephemeral: true });
    }                           
}
if(message.customId === 'accept_button_classic_extreme'){
    let basicAccept = client.getClassicExtremeDatabase.get();
    let userscore2 = client.getScore.get(basicAccept.classicExtremeChallengerId);

    if (!userscore2) {
        userscore2 = { userId: basicAccept.classicExtremeChallengerId, points: 0}
    }

    if(basicAccept.isVerifyClassicExtreme === 1 && basicAccept.setClassicExtremeId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){


        client.ClassicExtremeLockOff.run();
        client.isVerifyClassicExtremeOff.run();

        userscore2.points += 5;

        client.setScore.run(userscore2);
        message.channel.send(`Congratulations <@${basicAccept.classicExtremeChallengerId}> your challenge solve has been accepted and you have earned 5 points! Your current point total is: ${userscore2.points}`)
        message.message.delete();
    } else{
        message.reply({content:"You cannot accept this challenge", ephemeral: true });
    }                                        
}
  //################################### CHALLENGE DECLINE ###########################################################
if(message.customId === 'decline_button_basic'){
        let basicAccept = client.getRetailBasicDatabase.get();
        if(basicAccept.isVerifyBeginner === 1 && basicAccept.setBeginnerId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
            message.channel.send(`Bad news <@${basicAccept.beginnerChallengerId}> your challenge solve has been declined. Please try again.`);
            message.message.delete(); 
            client.isVerifyBeginnerOff.run();   
             
    }
}
if(message.customId === 'decline_button_advance'){
    let basicAccept = client.getRetailAdvancedDatabase.get();
    if(basicAccept.isVerifyAdvance === 1 && basicAccept.setAdvanceId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news <@${basicAccept.advancedChallengerId}> your challenge solve has been declined. Please try again.`);
        message.message.delete();
        client.isVerifyAdvanceOff.run();
       
    }                    
}
if(message.customId === 'decline_button_extreme'){
    let basicAccept = client.getRetailExtremeDatabase.get();
    if(basicAccept.isVerifyExtreme === 1 && basicAccept.setExtremeId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news <@${basicAccept.extremeChallengerId}> your challenge solve has been declined. Please try again.`);
        message.message.delete();
        client.isVerifyExtremeOff.run();
   
    }          
}
if(message.customId === 'decline_button_classic'){
    let basicAccept = client.getClassicBasicDatabase.get();
    if(basicAccept.isVerifyClassicBasic === 1 && basicAccept.setClassicBasicId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news <@${basicAccept.classicBasicChallengerId}> your challenge solve has been declined. Please try again.`);
        message.message.delete();
        client.isVerifyClassicBasicOff.run();
      
    }
}
if(message.customId === 'decline_button_classic_advanced'){
    let basicAccept = client.getClassicAdvancedDatabase.get();
    if(basicAccept.isVerifyClassic === 1 && basicAccept.setClassicId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news <@${basicAccept.classicChallengerId}> your challenge solve has been declined. Please try again.`);
        message.message.delete();
        client.isVerifyClassicOff.run();
   
    }
}
if(message.customId === 'decline_button_classic_extreme'){
    let basicAccept = client.getClassicExtremeDatabase.get();
    if(basicAccept.isVerifyClassicExtreme === 1 && basicAccept.setClassicExtremeId === message.user.id || message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
        message.channel.send(`Bad news <@${basicAccept.classicExtremeChallengerId}> your challenge solve has been declined. Please try again.`);
        message.message.delete();
        client.isVerifyClassicExtremeOff.run();
 
    }
}
   

    
//################################### CHALLENGE CANCEL ###########################################################    
    if(message.commandName === "cancel"){

        // BASIC DECLINE
        if(message.options.getSubcommand() === "basic"){
            if(message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
                message.reply("The basic challenge has been canceled.");
     
                client.isVerifyBeginnerOff.run();
                client.beginnerLockOff.run();
                client.beginnerChallengerId.run("???");
                client.beginnerId.run("???");
     
             }                          
        }

        // ADVANCED DECLINE
        if(message.options.getSubcommand() === "advanced"){
            if(message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
                message.reply("The Advanced challenge has been canceled.");
     
                client.isVerifyAdvanceOff.run();
                client.advanceLockOff.run();
                client.advancedChallengerId.run("???");
                client.advanceId.run("???");
     
             }                              
        }        

        // EXTREME DECLINE
        if(message.options.getSubcommand() === "extreme"){
            if(message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
                message.reply("The Extreme challenge has been canceled.");
     
                client.isVerifyExtremeOff.run();
                client.extremeLockOff.run();
                client.extremeChallengerId.run("???");
                client.extremeId.run("???");
     
             }                                  
        }

        // CLASSIC DECLINES
        if(message.options.getSubcommand() === "wotlk"){
            let challengeType = message.options.getString("type");  // Get challenge type (basic, advanced, extreme)

            // CLASSIC BASIC
            if(challengeType === "basic"){
                if(message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
                    message.reply("The WOTLK Basic challenge has been canceled.");
         
                    client.isVerifyClassicBasicOff.run();
                    client.ClassicBasicLockOff.run();
                    client.classicBasicChallengerId.run("???");
                    client.ClassicBasicId.run("???");
         
                 }                
            } 

            // CLASSIC ADVANCED
            if(challengeType === "advanced"){
                if(message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
                    message.reply("The WOTLK Advanced challenge has been canceled.");
         
                    client.isVerifyClassicOff.run();
                    client.ClassicLockOff.run();
                    client.classicChallengerId.run("???");
                    client.ClassicId.run("???");
         
                 }                
            }             

            // CLASSIC EXTREME
            if(challengeType === "extreme"){
                if(message.member.roles.cache.some(r=>["Admin", "Bot", "Community Mod"].includes(r.name))){
                    message.reply("The Classic extreme challenge has been canceled.");
         
                    client.isVerifyClassicExtremeOff.run();
                    client.ClassicExtremeLockOff.run();
                    client.classicExtremeChallengerId.run("???");
                    client.ClassicExtremeId.run("???");
         
                 }                
            } 
        }

    }

        });

























//Client login token from ENV
client.login(process.env.TOKEN);
