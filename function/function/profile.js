const { MessageEmbed } = require('discord.js');
const { settings } = require('../../index');

const Canvas = require('@napi-rs/canvas')

/**
 * @typedef {Object} CanvasDrawParams
 * @property {string} profileImage - The URL of the image to be displayed on the canvas
 * @property {string} color - The color to be used for text on the canvas
 * @property {Object} textData - An object containing text data
 * @property {string} textData.UserName - The username text
 * @property {string} textData.UserOld - The user's age text
 * @property {string} textData.UserWareFrome - The user's location text
 * @property {string} textData.UserStatus - The user's status text
 * @property {string} textData.Trusted - The trusted status text
 * @property {string} textData.UserWork - The user's work text
 */

/**
 * Function to draw on a canvas
 * @param {CanvasDrawParams} params - The parameters for drawing on the canvas
 * @returns {Buffer} - The buffer containing the drawn canvas
 */
async function drawOnCanvas(params) {
    const { profileImage, color, textData } = params;

    const canvas = Canvas.createCanvas(604, 604);
    const context = canvas.getContext('2d');
    const background = await Canvas.loadImage(profileImage);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
    const fontPath = path.join(__dirname, "..", "..", 'font', 'Rubik-Regular.ttf');
    Canvas.GlobalFonts.registerFromPath(fontPath, 'Rubik');

    context.fillStyle = color;
    context.font = '30px Rubik'; 
    context.textBaseline = "middle";
    context.textAlign = "right"; 

    context.fillText(textData.UserName, 470, 320); 
    context.fillText(textData.UserOld, 475, 365); 
    context.fillText(textData.UserWareFrome, 493, 405); 
    context.fillText(textData.UserStatus, 473, 447); 
    context.fillText(textData.Trusted, 480, 489); 
    context.fillText(textData.UserWork, 468, 535); 

    const attachment = new MessageAttachment(await canvas.encode('png'), 'profile-image.png');

    return attachment



}

module.exports = drawOnCanvas




