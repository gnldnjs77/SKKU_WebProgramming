
$('#btn_login').on('click', function() {
    $.ajax({
        url:'/login/process',
        method:'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify({'login_id':$('#login_id').val(),
                              'login_pwd':$('#login_pwd').val()  }),
        success:function(data) {
            console.log(data);
            if(data.status == 'OK') {
                window.location.replace('/');
            } else {
                $('#message').text(data.err_msg);
            }
        },
        error:function(err) {
            console.log(err);
            $('#message').text(err.responseText);
        }
    });
});

$('#btn_leave').on('click', function(){
    var check = confirm("정말로 탈퇴하시겠습니까?");
    if (!check) return;    
    $.ajax({
        url:'/login/leave?uid='+$('#uid').val(),
        method:'GET',
        success:function(data) {
            if(data.status == 'OK') {
                alert("탈퇴 완료");
                window.location.replace('/');   
            } else {
                alert("오류 발생. 다시 시도하세요");
                window.location.replace('/');
            }
        },
        error:function(err) {
            alert("오류 발생. 다시 시도해세요");
            window.location.replace('/');
        }
    });
});


$('#btn_board').on('click', function(){
    window.location.replace("/board/list");
});