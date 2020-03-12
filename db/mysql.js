var express = require('express');
var mysql = require('mysql');
module.exports = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:'board_user',
    password:'skkutest',
    database:'board_db'
});