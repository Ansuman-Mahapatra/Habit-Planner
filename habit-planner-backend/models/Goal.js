const mongoose = require('mongoose');

const goalSchema = mongoose.Schema(
    {
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: 'User' 
        },
        name: { 
            type: String, 
            required: true 
        },
        description: { 
            type: String 
        },
        startDate: { 
            type: String
        }, // YYYY-MM-DD
        endDate: { 
            type: String
        }, // YYYY-MM-DD
    },
    { timestamps: true }
);

const Goal = mongoose.model('Goal', goalSchema);
module.exports = Goal;
