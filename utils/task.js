const taskModel = require("../models/task.model");

const checkTask = async (task, userId) => {
    let data = await taskModel.findOne({task, userId: userId})
    return data; 
}  

module.exports = {
    checkTask
}