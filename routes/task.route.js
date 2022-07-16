const express = require("express");
const taskRoute = express.Router();
const { check } = require("express-validator");
const { addTask, list, deleteTask, updateTask, statusUpdate, assignTask } = require("../controller/task.controller");
const {isAuthorized, isAdminAuthorized} = require("../middleware/auth");

taskRoute.route("/add").post(isAuthorized, [
    check("task").trim().not().isEmpty().withMessage(`Task can not be null`)                   
], addTask)

taskRoute.route("/list").get(isAuthorized, list)

taskRoute.route("/delete/:taskId").delete(isAuthorized, [
    check("taskId").not().isEmpty().withMessage("Please provide task id")
], deleteTask)

taskRoute.route("/update").put(isAuthorized, [
    check("task").trim().not().isEmpty().withMessage(`Task can not be null`),
    check("taskId").not().isEmpty().withMessage("Please provide task id")
], updateTask)

taskRoute.route("/status-update").put(isAuthorized, [
    check("taskId").not().isEmpty().withMessage("Please provide task id"),
    check("status").not().isEmpty().withMessage("Please provide status")
], statusUpdate)

taskRoute.route("/assignTaskToUser").post(isAuthorized, isAdminAuthorized, [
    check("taskId").not().isEmpty().withMessage("Please provide task id"),
    check("userId").not().isEmpty().withMessage("Please provide Assignee user id")
], assignTask)

module.exports = taskRoute