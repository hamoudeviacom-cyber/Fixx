const mongoose = require('mongoose');

const serverSettingsSchema = new mongoose.Schema({
    memberPrice: {
        type: Number,
        default: 0 
    },

    bankId: {
        type: String,
    }, 
    feedbackChannel: {
        type: String,
        default: null 
    },
    logChannel: {
        type: String,
        default: null 
    },
    memberPriceReseller: {
        type: Number,
        default: 0
    },
    resellerPrice : {
        type : Number,
        default : 1
    }, 
    orders : [{
        state : String,
        amount : Number,
        Type : String,
        UserBuyer : String,
        Channel : String , 
        addedCount : Number, 
        serverId : String,
        status: { type : Boolean, default : true},
        remainingCount : Number, 
        join : { type: Boolean, default : false}
    }], 

    resellerData : [{
        resellerId : String,
        ownerId : String,
        botToken : String,
        botId : String,
        guildId : String,
        priceMember : Number,
        bankId : String,
        feedbackChannel : String,
        coins : Number,
        logChannel : String,
    }]

}, { timestamps: true });

module.exports = mongoose.model('ServerSettings', serverSettingsSchema);
