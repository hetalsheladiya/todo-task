const mongooose = require("mongoose");

const taskSchema = mongooose.Schema({
    userId: {
        type: mongooose.Schema.Types.ObjectId,
        ref: 'user'
    },
    task: {
        type: String
    },    
    status: {
        type: Number,
        default: 0  // 0 for pending , 1 for completed
    },
    is_deleted: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

const taskModel = mongooose.model('task', taskSchema);

module.exports = taskModel