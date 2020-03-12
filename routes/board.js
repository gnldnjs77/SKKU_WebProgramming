var express = require('express');

var connection= require('../db/mysql');

var router = express.Router();

/* board list page */
router.get('/list', function(req, res, next) {
    connection.query('select *, date_format(cdate, \'%Y-%m-%d %H:%i:%s\') as cdate2 from t_board', function(err,rows){
        if(err){
            console.log(err);
            res.render('boardList', {'status':'Error'});
        } else {
            res.render('boardList', {'status':'OK', 'data':rows});
        }
    });
});

router.post('/list/search', function(req, res, next){
    console.log(req.body.searchKeyword);
    var sql= 'select *, date_format(cdate, \'%Y-%m-%d %H:%i:%s\') as cdate2 from t_board where title like ?';
    var values= ['\%'+req.body.searchKeyword+'\%'];
    connection.query(sql, values, function(err, rows){
        if (err){
            console.log(err);
            // alert('검색에 실패하였습니다. 다시 시도하세요');
            res.render('boardList', {'status':'Error'});
        } else {
            res.render('boardList', {'status':'OK', 'data':rows, 'searchword':req.body.searchKeyword});
        }
    });
});

/* board Register page */
router.get('/register', function(req, res, next) {
    res.render('boardRegister');
});

// board register process ajax
router.post('/register/process', function(req, res, next){
    var sql = 'insert into t_board (user_id, user_name, title, content) values(?,?,?,?)';
    var values = [req.session.login_id, req.session.user_name, req.body.board_title, req.body.board_content];
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

/* board update page */
router.get('/update', function(req, res, next) {
    // var bid = req.query.bid;
    // console.log(bid);
    var sql = 'select * from t_board where bid= ?';
    var values = [req.query.bid];
    connection.query(sql, values, function(err, rows){
        console.log(rows);
        if (err){
            console.log(err);
            res.render('boardUpdate', {'status':'Error'});
        } else {
            res.render('boardUpdate',{'status': 'OK', 'data':rows});//이미 삭제된 게시물입니다 보너스
        }
    });
    
});

/*board update process ajax*/
router.post('/update/process', function(req, res, next) {
    console.log(req.body.board_bid);
    var sql = 'update t_board set title = ?, content = ? where bid= ?';//여기 확인하기
    var values = [req.body.board_title, req.body.board_content, req.body.board_bid];
    connection.query(sql, values, function(err, result){
        console.log(result);//result 값 확인하기
        if (err) {
            console.log(err);
            res.json({'status':'Error'});
        } else {
            console.log(result);
            res.json({'status':'OK'});
        }
    });
});

/*board delete process ajax*/
router.get('/delete', function(req, res, next) {
    console.log(req.query.bid);
    var sql = 'delete from t_board where bid = ?';
    var values = [req.query.bid];
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
});

module.exports = router;
