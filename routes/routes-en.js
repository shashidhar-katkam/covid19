const routes = require('express').Router();
const UserNewsService = require('../services/user/dataService');
const RoutesURL = require('../costants/constants');
const URLs = RoutesURL.RoutesURL;

routes.post(URLs.getNewsForUserHomePage, function (req, res) {
    UserNewsService.getNewsForUserHomePage(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getLatestNews, function (req, res) {
    UserNewsService.getLatestNews(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getNewsByFilter, function (req, res) {
    UserNewsService.getNewsByFilter(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getNewsById, function (req, res) {
    UserNewsService.getNewsById(req.body, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getHeadLines, function (req, res) {
    UserNewsService.getHeadlines({}, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getTopNews, function (req, res) {
    UserNewsService.getTopNews(req.body, (message) => {
        console.log("shashidhar");
        res.json(message);
    });
});

routes.post(URLs.getAllNewsByUserId, function (req, res) {
    UserNewsService.getAllNewsByUserId(req.body, (message) => {
        res.json(message);
    });
});

module.exports = routes;