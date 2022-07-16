const { validationResult } = require("express-validator");
const taskModel = require("../models/task.model");
const ErrorHandler = require("../utils/ErrorHandler");
const { checkTask, taskList } = require("../utils/task");

module.exports = {
    addTask: async (req, res, next) => {
        try{
            const errors = validationResult(req);            
            if(!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    errors: errors.errors
                })
            }            
            let { task } = req.body;
            let taskData = await checkTask(task, req.user._id);
            if(taskData) {
                throw new ErrorHandler(`Task already exist`, 400)
            }                
            let data = await taskModel.create({task, userId: req.user._id})
            if(!data) {
                throw new ErrorHandler(`Failed! Error occured while adding task`, 400)
            }
            return res.status(201).json({
                success: true,
                data: data,
                message: `Task created`
            })           
        }
        catch(e) {                     
            next(e)
        }
    },
    list: async(req, res, next) => {
        try {
            const errors = validationResult(req);            
            if(!errors.isEmpty()) {
                return res.status(400).json({success: false, errors: errors.errors})
            }            
            const { _id, usertype } = req.user; 
            console.log(req.user); 
            if(usertype.usertype.indexOf('user') > -1)
                $query = {$or: [{userId: _id},{assignedTo: _id}], is_deleted: false} 
            else 
                $query = {is_deleted: false}                     
            const data = await taskList($query);
            return res.status(200).json({
                success: true, 
                data: data
            })           
        }
        catch(e) {
            next(e)
        }
    },
    deleteTask: async(req, res, next) => {
        try {            
            const errors = validationResult(req);            
            if(!errors.isEmpty()) {
                return res.status(400).json({success: false, errors: errors.errors})
            }            
            const { taskId } = req.params;
            const { _id, usertype } = req.user;
            if(usertype.usertype.indexOf('user') > -1)
                $query = await taskModel.updateOne({_id: taskId, userId: _id},{is_deleted: true})
            else {
                $query = await taskModel.updateOne({_id: taskId}, {is_deleted: true})
            }
            if($query.modifiedCount == 0) {
                throw new ErrorHandler(`Failed! Error occured while deleting task`, 400)
            }
            return res.status(200).json({success: true,  message: `Task Deleted`, data: $query})            
        }
        catch(e) {
            next(e)
        }
    },
    updateTask: async(req, res, next) => {
        try {
            const errors = validationResult(req);            
            if(!errors.isEmpty()) {
                return res.status(400).json({success: false, errors: errors.errors})
            }            
            const { task, taskId } = req.body;
            const { _id, usertype } = req.user;
            $query = {
                task: new RegExp(["^", task, "$"].join(""),"i"),
                _id: {$nin: [taskId]},                     
                is_deleted: false
            }            
            if(usertype.usertype.indexOf('user') > -1) 
                $query['userId'] = _id;
                
            console.log($query);
            let getTask = await taskModel.findOne($query);            
            if(getTask) {
                throw new ErrorHandler(`Failed! Task already exist`, 400)
            } 
            let data = await taskModel.findByIdAndUpdate(taskId, {task}, {new: true})
            if(!data) {
                throw new ErrorHandler(`Failed! Error occured while updating task`, 400)
            }
            return res.status(200).json({success: true, data: data, message: `Task Updated`})                       
        }
        catch(e) {
            next(e)
        }
    }, 
    statusUpdate: async(req, res, next) => {
        try {
            const errors = validationResult(req);            
            if(!errors.isEmpty()) {
                return res.status(400).json({success: false, errors: errors.errors})
            }  
            const { status, taskId } = req.body;
            let data = await taskModel.findByIdAndUpdate(taskId, {status}, {new: true})
            if(!data) {
                throw new ErrorHandler(`Failed! Error occured while updating status`, 400)
            }
            return res.status(200).json({success: true, data: data, message: `Task Status Updated`})  
        }
        catch(e) {
            next(e)
        }
    },
    assignTask: async(req, res, next) => {
        try {
            const errors = validationResult(req);            
            if(!errors.isEmpty()) {
                return res.status(400).json({success: false, errors: errors.errors})
            }
            const { taskId, userId } = req.body;
            const data = await taskModel.findByIdAndUpdate(taskId, {assignedTo: userId}, {new: true}).populate("assignedTo", 'username');            
            return res.status(200).json({
                success: true,
                data: data,
                message: `Task is assigned to ${data.assignedTo.username}`
            })
        }
        catch(e) {
            next(e)
        }
    }     
}