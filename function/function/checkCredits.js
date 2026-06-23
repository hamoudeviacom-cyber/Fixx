const { MessageCollector , Interaction  } = require('discord.js');


/**
 * @param {Object} data - The data object containing information for the embed
 * @param {Message | Interaction} data.messageOrInteraction - The message or interaction object
 * @param {number} data.price - The price
 * @param {number} data.time - The time
 * @param {string} data.bank - The bank string
 * @param {string} data.probot - The probot string
 * @returns {Promise<{ success: boolean, collected?: CollectedMessage }>}
 */
async function checkCredits(data) {
    const { messageOrInteraction, price, time, bank, probot } = data;
    
    let user;
    if (messageOrInteraction instanceof Interaction) {
        user = messageOrInteraction.user;
    } else {
        user = messageOrInteraction.author;
    }

    const filter = ({ content, author: { id } }) => {
        return (
            content.startsWith(`**:moneybag: | ${user.username}, has transferred `) &&
            content.includes(bank) &&
            id === probot &&
            (Number(content.match(/\$([\d,]+)`/)[1]) >= price)
        );
    };

    const collector = messageOrInteraction.channel.createMessageCollector({
        filter,
        max: 1,
        time,
    });

    return new Promise((resolve, reject) => {
        collector.on('collect', (collected) => resolve({ success: true, collected }));
        collector.on('end', (_, reason) => {
            if (reason === 'time') {
                reject({ success: false });
            }
        });
    })
    .finally(() => collector.stop());
}

module.exports = checkCredits;
