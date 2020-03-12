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


$('#confirm_pwd').keyup(function(){
    if($('#login_pwd').val()==$('#confirm_pwd').val()){
        $('#message2').text('패스워드 일치');
    } else{
        $('#message2').text('패스워드 불일치');
    }
});

$('#login_pwd').keyup(function(){
    if($('#login_pwd').val()==$('#confirm_pwd').val()){
        $('#message2').text('패스워드 일치');
    } else{
        $('#message2').text('패스워드 불일치');
    }
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

$('#btn_signup').on('click', function() {//return 이용해서 if로 잇는게 좋음, else if로 잇는 것 나쁜 습관
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
    if($('#login_pwd').val() != $('#confirm_pwd').val() ) {
        alert('비밀번호가 다릅니다');
        $('#confirm_pwd').focus();
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
        url:'/login/create',
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
                alert('회원가입 성공');
                window.location.replace('/');
            } else {
                $('#message_error').text('error 발생, 재시도..');    
            }
            
        },
        error:function(err) {
            console.log(err);
            $('#message_error').text('error 발생, 재시도..');
        }
    });
    
});