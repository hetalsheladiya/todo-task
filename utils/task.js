const taskModel = require("../models/task.model");

const checkTask = async (task, userId) => {
    const data = await taskModel.findOne({task, userId: userId})
    return data; 
} 

const taskList = async($query) => {    
    const data = await taskModel.aggregate([
        {
            $match: $query
        },{
            $lookup: {
                from: 'users',
                foreignField: '_id',
                localField: 'userId',
                as: 'user'
            }
        },
        {
            $unwind: "$user"
        },
        {
            $project: {
                "_id": 1,
                "task": 1,
                "status": 1,
                "userId": 1,
                "assignedTo" : 1,
                "createdAt": 1,
                "user._id" : 1,
                "user.username" : 1
            }
        }
    ])
    return data;
}

module.exports = {
    checkTask,
    taskList
}