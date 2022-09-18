const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
//const { clientId, guildId} = require('./config.json');
const { clientId, guildId} = require('./config2.json'); // For ER
//const { clientId, guildId} = require('./config3.json');

//const { token } = require("./secret.json");
const { token } = require("./secret2.json");  // waltuh, theres a second secret waltuh
//const { token } = require("./secret3.json");

const commands = [
	new SlashCommandBuilder().setName('pints').setDescription('How many pints do you have?'),
	new SlashCommandBuilder().setName('ping').setDescription('Bat Soup'),
	//new SlashCommandBuilder().setName('teststars').setDescription('Bat Soup'),
	//new SlashCommandBuilder().setName('init').setDescription('Bat Soup'),
	new SlashCommandBuilder().setName('leaderboard').setDescription('Bat Soup'),
	new SlashCommandBuilder().setName('points').setDescription('How many points do you have?'),
	new SlashCommandBuilder().setName('addpoint').setDescription("Add specified number of points to a user")
							 .addUserOption(user =>
								user.setName("user")
									.setDescription("User to give points to")
									.setRequired(true))
							 .addNumberOption(numPoints =>
								numPoints.setName("points")
										 .setDescription("Amount of points to give")
										 .setRequired(true)),

	new SlashCommandBuilder().setName('removepoint').setDescription('Bat Soup')
							 .addUserOption(user =>
								user.setName("user")
									.setDescription("User to remove points from")
									.setRequired(true))
							 .addNumberOption(numPoints =>
								numPoints.setName("points")
										 .setDescription("Amount of points to remove")
										 .setRequired(true)),

	new SlashCommandBuilder().setName('challenge').setDescription('Start a challenge')
							.addSubcommand(info =>
								info.setName("info")
									.setDescription("View challenge info"))
							.addSubcommand(basic =>
								basic.setName("basic")
									.setDescription("Start a basic challenge")
									.addAttachmentOption(attach =>
										attach.setName("image")
											  .setDescription("Attach an image of your challenge")
											  .setRequired(true)))
							.addSubcommand(advanced =>
								advanced.setName("advanced")
									.setDescription("Start an advanced challenge")
									.addAttachmentOption(attach =>
										attach.setName("image")
											  .setDescription("Attach an image of your challenge")
											  .setRequired(true)))
							.addSubcommand(extreme =>
								extreme.setName("extreme")
									.setDescription("Start an extreme challenge")
									.addAttachmentOption(attach =>
										attach.setName("image")
											  .setDescription("Attach an image of your challenge")
											  .setRequired(true)))
							.addSubcommand(classic =>
								classic.setName("wotlk")
									.setDescription("Start a classic challenge")
									.addStringOption(option =>
										option.setName("type")
										.setDescription("Challenge type (basic, advanced, extreme)")
										.setRequired(true)
										.addChoices(
											{ name: "basic", value: "basic" },
											{ name: "advanced", value: "advanced" },
											{ name: "extreme", value: "extreme"},
										))
									.addAttachmentOption(attach =>
										attach.setName("image")
												.setDescription("Attach an image of your challenge")
												.setRequired(true))),
										
							
									

	new SlashCommandBuilder().setName('solve').setDescription('Solve a challenge')
							.addSubcommand(basic =>
								basic.setName("basic")
									.setDescription("Solve a basic challenge")
									.addAttachmentOption(attach =>
										attach.setName("image")
											  .setDescription("Attach an image of your challenge")
											  .setRequired(true)))
							.addSubcommand(advanced =>
								advanced.setName("advanced")
									.setDescription("Solve an advanced challenge")
									.addAttachmentOption(attach =>
										attach.setName("image")
											  .setDescription("Attach an image of your challenge")
											  .setRequired(true)))
							.addSubcommand(extreme =>
								extreme.setName("extreme")
									.setDescription("Solve an extreme challenge")
									.addAttachmentOption(attach =>
										attach.setName("image")
											  .setDescription("Attach an image of your challenge")
											  .setRequired(true)))
							.addSubcommand(classic =>
								classic.setName("wotlk")
									.setDescription("Solve a classic challenge")
									.addStringOption(option =>
										option.setName("type")
										.setDescription("Challenge type (basic, advanced, extreme)")
										.setRequired(true)
										.addChoices(
											{ name: "basic", value: "basic" },
											{ name: "advanced", value: "advanced" },
											{ name: "extreme", value: "extreme"},
										))
									.addAttachmentOption(attach =>
										attach.setName("image")
												.setDescription("Attach an image of your challenge")
												.setRequired(true))),
	
	
	// new SlashCommandBuilder().setName('accept').setDescription('Accept a challenge')
	// 						.addSubcommand(basic =>
	// 							basic.setName("basic")
	// 								.setDescription("Accept a basic challenge"))
	// 						.addSubcommand(advanced =>
	// 							advanced.setName("advanced")
	// 								.setDescription("Accept an advanced challenge"))
	// 						.addSubcommand(extreme =>
	// 							extreme.setName("extreme")
	// 								.setDescription("Accept an extreme challenge"))
	// 						.addSubcommand(classic =>
	// 							classic.setName("wotlk")
	// 								.setDescription("Accept a classic challenge")
	// 								.addStringOption(option =>
	// 									option.setName("type")
	// 									.setDescription("Challenge type (basic, advanced, extreme)")
	// 									.setRequired(true)
	// 									.addChoices(
	// 										{ name: "basic", value: "basic" },
	// 										{ name: "advanced", value: "advanced" },
	// 										{ name: "extreme", value: "extreme"},
	// 									))),									

	// new SlashCommandBuilder().setName('decline').setDescription('Decline a challenge')
	// 						.addSubcommand(basic =>
	// 							basic.setName("basic")
	// 								.setDescription("Decline a basic challenge"))
	// 						.addSubcommand(advanced =>
	// 							advanced.setName("advanced")
	// 								.setDescription("Decline an advanced challenge"))
	// 						.addSubcommand(extreme =>
	// 							extreme.setName("extreme")
	// 								.setDescription("Decline an extreme challenge"))
	// 						.addSubcommand(classic =>
	// 							classic.setName("wotlk")
	// 								.setDescription("Decline a classic challenge")
	// 								.addStringOption(option =>
	// 									option.setName("type")
	// 									.setDescription("Challenge type (basic, advanced, extreme)")
	// 									.setRequired(true)
	// 									.addChoices(
	// 										{ name: "basic", value: "basic" },
	// 										{ name: "advanced", value: "advanced" },
	// 										{ name: "extreme", value: "extreme"},
	// 									))),
	
	new SlashCommandBuilder().setName('cancel').setDescription('Cancel a challenge')
							.addSubcommand(basic =>
								basic.setName("basic")
									.setDescription("Cancel a basic challenge"))
							.addSubcommand(advanced =>
								advanced.setName("advanced")
									.setDescription("Cancel an advanced challenge"))
							.addSubcommand(extreme =>
								extreme.setName("extreme")
									.setDescription("Cancel an extreme challenge"))
							.addSubcommand(classic =>
								classic.setName("wotlk")
									.setDescription("Cancel a classic challenge")
									.addStringOption(option =>
										option.setName("type")
										.setDescription("Challenge type (basic, advanced, extreme)")
										.setRequired(true)
										.addChoices(
											{ name: "basic", value: "basic" },
											{ name: "advanced", value: "advanced" },
											{ name: "extreme", value: "extreme"},
										))),									

										

]
	.map(command => command.toJSON());

const rest = new REST({ version: '10' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then((data) => console.log(`Successfully registered ${data.length} application commands.`))
	.catch(console.error);