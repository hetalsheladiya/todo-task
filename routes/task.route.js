const express = require("express");
const taskRoute = express.Router();
const { check } = require("express-validator");
const { addTask, checkTask, list, deleteTask, updateTask, statusUpdate } = require("../controller/task.controller");
const {isAuthorized} = require("../middleware/auth");

taskRoute.route("/task/add").post(isAuthorized, [
    check("task").trim().not().isEmpty().withMessage(`Task can not be null`)                   
], addTask)

taskRoute.route("/task/list").get(isAuthorized, list)

taskRoute.route("/task/delete/:taskId").delete(isAuthorized, [
    check("taskId").not().isEmpty().withMessage("Please provide task id")
], deleteTask)

taskRoute.route("/task/update").put(isAuthorized, [
    check("task").trim().not().isEmpty().withMessage(`Task can not be null`),
    check("taskId").not().isEmpty().withMessage("Please provide task id")
], updateTask)

taskRoute.route("/task/status-update").put(isAuthorized, [
    check("taskId").not().isEmpty().withMessage("Please provide task id"),
    check("status").not().isEmpty().withMessage("Please provide status")
], statusUpdate)

module.exports = taskRoute