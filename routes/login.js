var express = require('express');
var connection= require('../db/mysql');
var router = express.Router();

router.get('/checkid', function(req, res, next) {
    console.log(req.query.login_id);//sql에서 string쓸 때 꼭 따옴표!
    connection.query('select uid from t_user where login_id=\''+req.query.login_id + '\'', 
            function(err, row, field) {
                if(err){
                    res.send('ERROR');//send하면 딱 문자열만 날라감
                } else {
                    if(row.length > 0) {
                        res.send('DUPLICATED');
                    } else {
                        res.send('OK');
                    }
                }
    });
});

router.post('/create', function(req, res, next) {//여기서는 따옴표 있어야 함: db가 쓸 따옴표야!
    var sql= 'INSERT INTO board_db.t_user' +
            '(login_id, login_pwd, user_name, email)' +
            'VALUES (?,?,?,?)';
    var values= [req.body.login_id, req.body.login_pwd, req.body.user_name, req.body.email];
    connection.query('select * from t_user where login_id=?',
        [req.body.login_id], 
        function(err, row, field){
            if(err) {
                console.log(err);
                res.json({'status':'ERROR'});
            } else {
                if(row.length > 0) {
                    res.json({'status':'ERROR'});
                } else {
                    connection.query(sql, values, function(err, rows, field) {
                        console.log(rows);

                        if(err) {
                            console.log(err);
                            res.json({'status':'ERROR'});
                        } else {
                            req.session.logined= true;
                            req.session.uid= rows.insertId;
                            req.session.login_id= req.body.login_id;
                            req.session.user_name=  req.body.user_name;
                            res.json({'status':'OK'});
                        }
                    });
                }
            }//post는 json형식으로 넘기기
        });

});

router.get('/leave', function(req, res, next) {
    var sql = 'delete from t_user where uid = ?';
    var values = [req.query.uid];
    console.log(req.query.uid);
    connection.query(sql, values, function(err, result){
        console.log(values);
        console.log(result);
        if (err) {
            console.log(err);
            res.json({'status':'Error'});
        } else {
            console.log(result);
            req.session.destroy();
            res.json({'status':'OK'});
        }
    });
});



/* signup page */
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

/* login ajax process */
router.post('/process', function(req, res, next) {
    console.log(req.body);

    var sql= "select * from t_user where login_id=? and login_pwd=?";
    var values=[req.body.login_id, req.body.login_pwd];
    connection.query(sql, values, function(err, rows){
        if (err) {
            res.json({'status':'Fail', 'err_msg': 'error please retry'});
        } else {
            if(rows.length==1){
                req.session.logined= true; //logined는 우리가 정의하는 값
                req.session.uid= rows[0].uid; //게시물 삭제 시 써먹을 것
                req.session.login_id= req.body.login_id;
                req.session.user_name=  rows[0].user_name;
                res.json({'status':'OK'});
            } else {
                console.log(err);
                res.json({'status':'Fail', 'err_msg':'no user'});
            }
        }
    });
});

router.get('/logout', function(req, res, next){
    // console.log(req.session.login_id);
    if (req.session.logined){
        req.session.destroy();
    }
    res.redirect('/');
});

module.exports = router;
