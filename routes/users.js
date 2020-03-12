var express = require('express');

var connection= require('../db/mysql');

var router = express.Router();

/* user list page */
router.get('/list', function(req, res, next) {
    connection.query('select *, date_format(cdate, \'%Y-%m-%d %H:%i:%s\') as cdate2 from t_user', function(err,rows){
        if(err){
            console.log(err);
            res.render('usersList', {'status':'Error'});
        } else {
            res.render('usersList', {'status':'OK', 'data':rows});
        }
    });
});

router.post('/list/search', function(req, res, next){
    console.log(req.body.searchKeyword);
    var sql= 'select *, date_format(cdate, \'%Y-%m-%d %H:%i:%s\') as cdate2 from t_user where login_id like ? or user_name like ?';
    var values= ['\%'+req.body.searchKeyword+'\%', '\%'+req.body.searchKeyword+'\%'];
    connection.query(sql, values, function(err, rows){
        if (err){
            console.log(err);
            // alert('검색에 실패하였습니다. 다시 시도하세요');
            res.render('usersList', {'status':'Error'});
        } else {
            res.render('usersList', {'status':'OK', 'data':rows, 'searchword':req.body.searchKeyword});
        }
    });
});

/* user Register page */
router.get('/register', function(req, res, next) {
    res.render('usersRegister');
});

// user register process ajax
router.post('/register/process', function(req, res, next){
    var sql = 'insert into t_user (login_id, login_pwd, user_name, email) values(?,?,?,?)';
    var values = [req.body.login_id, req.body.login_pwd, req.body.user_name, req.body.email];
    connection.query(sql, values, function(err, result){
        if (err) {
            res.json({'status':'Error'});
        } else {
            console.log(result);//insert 안 됐는데 err 안 나는 경우 있어서 확인해주기
            if(result.insertId != 0){
                res.json({'status':'OK'});
            } else {
                res.json({'status':'Error'});
            }
            
        }
    });
});

/* user update page */
router.get('/update', function(req, res, next) {
    // var bid = req.query.bid;
    // console.log(bid);
    var sql = 'select * from t_user where uid= ?';
    var values = [req.query.uid];
    connection.query(sql, values, function(err, rows){
        console.log(rows);
        if (err){
            console.log(err);
            res.render('usersUpdate', {'status':'Error'});
        } else {
            res.render('usersUpdate',{'status': 'OK', 'data':rows});//이미 삭제된 게시물입니다 보너스
        }
    });
    
});

/*user update process ajax*/
router.post('/update/process', function(req, res, next) {
    console.log(req.body.uid);
    console.log(req.body.login_id);
    var sql = 'update t_user set login_pwd = ?, user_name = ?, email = ? where uid= ?';//여기 확인하기
    var values = [req.body.login_pwd, req.body.user_name, req.body.email, req.body.uid];
    console.log(values);
    connection.query(sql, values, function(err, result){
        console.log(result);//result 값 확인하기
        if (err) {
            console.log(err);
            res.json({'status':'Error'});
        } else {
            console.log(result);
            if (result.changedRows !=0){
              if (req.session.uid == req.body.uid){
                  req.session.user_name= req.body.user_name;
              }
              res.json({'status':'OK'});
            } else {
              res.json({'status':'Error'});
            }
        }
    });
});

/*user delete process ajax*/
router.get('/delete', function(req, res, next) {
    console.log(req.query.uid);
    var sql = 'delete from t_user where uid = ?';
    var values = [req.query.uid];
    if (req.session.uid == req.query.uid){
        res.json({'status':'Error'});
    } else{
        connection.query(sql, values, function(err, result){
            console.log(result);//result값 확인하기
            if (err) {
                console.log(err);
                res.json({'status':'Error'});
            } else {
                console.log(result);
                res.json({'status':'OK'});
            }
        });
    }
});

module.exports = router;
