$('#btn_user_new').on('click', function() {
    window.location.replace("/users/register");
});

var isCheckedId = false;
function validEmail(Email) {
    var filter = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
    if (filter.test(Email)) {
        return true;
    } else {
        return false;
    }
}

$('#login_id').keyup(function(){
    if(isCheckedId) {
        isCheckedId = false;
    }
    console.log($('#login_id').val());
});

$('#btn_check_id').on('click', function() {
    
    if($('#login_id').val().length < 5) {
        alert('5자 이상');
    } else {
        $.ajax({
            url:'/login/checkid?login_id='+$('#login_id').val(),
            method:'GET',
            success:function(data) {
                if(data == 'OK') {
                    isCheckedId = true;
                    $('#message_id').text('id 사용 가능');
                } else if(data == 'DUPLICATED') {
                    isCheckedId = false;
                    $('#message_id').text('id 사용 불가');    
                } else {
                    isCheckedId = false;
                    $('#message_id').text('error 발생, 재시도..');
                }
            },
            error:function(err) {
                isCheckedId = false;
                $('#message_id').text('error 발생, 재시도..');
            }
        });
    }
});

$('#btn_signup').on('click', function() {
    if(!isCheckedId) {
        alert('ID 중복 체크 필요');
        return;
    }
    if($('#user_name').val().length < 3) {
        alert('이름을 3글자 이상 입력해주세요');
        $('#user_name').focus();
        return;
    }
    if($('#login_pwd').val().length < 3) {
        alert('비밀번호를 3자 이상 입력해주세요');
        $('#login_pwd').focus();
        return;
    }
    if(!$('#email').val()) {
        alert('이메일을 입력해주세요');
        $('#email').focus();
        return;
    }

    //이메일 형식 확인
    if(!validEmail($('#email').val())) {
        alert('이메일 형식이 틀립니다');
        $('#email').focus();
        return;
    }

    $.ajax({
        url:'/users/register/process',
        method:'POST',
        dataType:'json',
        contentType:'application/json',
        data:JSON.stringify({
            'user_name':$('#user_name').val(),
            'login_id':$('#login_id').val(),
            'login_pwd':$('#login_pwd').val(),//애초에 string형 return하기에 따옴표 쓰면 error
            'email':$('#email').val()
        }),//필드에서는 timeout도 꼭 넣어야
        success:function(data) {
            if(data.status == 'OK') {
                window.location.replace('/users/list');
            } else {
                $('#message').text('error 발생, 재시도..');    
            }
            
        },
        error:function(err) {
            console.log(err);
            $('#message').text('error 발생, 재시도..');
        }
    });
})

$('#btn_user_register').on('click', function() {
    // window.location.replace("/user/register");
    if(!isCheckedId) {
        alert('ID 중복 체크 필요');
        return;
    }
    if($('#user_name').val().length < 3) {
        alert('이름을 3글자 이상 입력해주세요');
        $('#user_name').focus();
        return;
    }
    if($('#login_pwd').val().length < 3) {
        alert('비밀번호를 3자 이상 입력해주세요');
        $('#login_pwd').focus();
        return;
    }
    if(!$('#email').val()) {
        alert('이메일을 입력해주세요');
        $('#email').focus();
        return;
    }

    //이메일 형식 확인
    if(!validEmail($('#email').val())) {
        alert('이메일 형식이 틀립니다');
        $('#email').focus();
        return;
    }

    $.ajax({
        url: '/users/register/process',
        method: 'POST', //첨부파일도 post로 보내야 함
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({'login_id':$('#login_id').val(), 'login_pwd':$('#login_pwd').val(), 'user_name':$('#user_name').val(), 'email':$('#email').val()}),
        success: function(data){//db에서 오류 나면 여기로 온다
            if(data.status == 'OK'){
                alert('등록에 성공했습니다.');
                window.location.replace('/users/list');
            } else {
                alert('등록에 실패했습니다. 다시 시도하세요.');
            }
        },
        error: function(err){//데이터를 받지 못한 것. 네트워크 오류 등의 이류
            alert('등록에 실패했습니다. 다시 시도하세요.');//
        }
    });
});

$('#btn_user_list').on('click', function() {
    window.location.replace("/users/list");
});

$('#btn_user_update').on('click', function() {//수정하는 부분, ajax로 실행하기

    if($('#user_name').val().length < 3) {
        alert('이름을 3글자 이상 입력해주세요');
        $('#user_name').focus();
        return;
    }
    if($('#login_pwd').val().length < 3) {
        alert('비밀번호를 3자 이상 입력해주세요');
        $('#login_pwd').focus();
        return;
    }
    if(!$('#email').val()) {
        alert('이메일을 입력해주세요');
        $('#email').focus();
        return;
    }

    //이메일 형식 확인
    if(!validEmail($('#email').val())) {
        alert('이메일 형식이 틀립니다');
        $('#email').focus();
        return;
    }

    $.ajax({
        url: '/users/update/process',
        method: 'POST', //첨부파일도 post로 보내야 함
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({'uid':$('#uid').val(), 'login_pwd':$('#login_pwd').val(), 'user_name':$('#user_name').val(), 'email':$('#email').val()}),
        success: function(data){//db에서 오류 나면 여기로 온다
            if(data.status == 'OK'){
                alert('수정에 성공했습니다.');
                window.location.replace('/users/list');
            } else {
                alert('수정에 실패했습니다. 다시 시도하세요.');
            }
        },
        error: function(err){//데이터를 받지 못한 것. 네트워크 오류 등의 이류
            console.log(err);
            alert('수정에 실패했습니다. 다시 시도하세요.');//
        }
    });
    window.location.replace("/users/list");
});

$('#btn_user_delete').on('click', function() {//삭제하는 부분, ajax로 실행하기
    var check = confirm("정말로 삭제하시겠습니까?");
    if (!check) return;
    $.ajax({
        url:'/users/delete?uid='+$('#uid').val(),
        method:'GET',
        success: function(data){//db에서 오류 나면 여기로 온다
            if(data.status == 'OK'){
                alert('삭제에 성공했습니다.');
                window.location.replace('/users/list');
            } else {
                alert('삭제에 실패했습니다. 다시 시도하세요.');
            }
        },
        error: function(err){//데이터를 받지 못한 것. 네트워크 오류 등의 이류
            alert('삭제에 실패했습니다. 다시 시도하세요.')//
        }
    });
    window.location.replace("/users/list");
});




