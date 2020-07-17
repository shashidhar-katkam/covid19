const routes = require('express').Router();
const TeluguNewsService = require('../services/user/dataServiceTe');
const RoutesURL = require('../costants/constants');
const URLs = RoutesURL.RoutesURL;

routes.post(URLs.getNewsForUserHomePage, function (req, res) {
    TeluguNewsService.getNewsForUserHomePage(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getLatestNews, function (req, res) {
    TeluguNewsService.getLatestNews(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getNewsByFilter, function (req, res) {
    TeluguNewsService.getNewsByFilter(req.body, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getNewsById, function (req, res) {
    TeluguNewsService.getNewsById(req.body, (message) => {
        res.json(message);
    });
});

routes.get(URLs.getHeadLines, function (req, res) {
    TeluguNewsService.getHeadlines({}, (message) => {
        res.json(message);
    });
});

routes.post(URLs.getTopNews, function (req, res) {
    TeluguNewsService.getTopNews(req.body, (message) => {
        console.log(message);
        res.json(message);
    });
});

routes.post(URLs.getAllNewsByUserId, function (req, res) {
    TeluguNewsService.getAllNewsByUserId(req.body, (message) => {
        res.json(message);
    });
});

module.exports = routes;