$('#btn_board_new').on('click', function() {
    window.location.replace("/board/register");
});

$('#btn_board_register').on('click', function() {
    // window.location.replace("/board/register");
    $.ajax({
        url: '/board/register/process',
        method: 'POST', //첨부파일도 post로 보내야 함
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({'board_title':$('#board_title').val(), 'board_content':$('#board_content').val()}),
        success: function(data){//db에서 오류 나면 여기로 온다
            if(data.status == 'OK'){
                alert('저장에 성공했습니다.');
                window.location.replace('/board/list');
            } else {
                alert('저장에 실패했습니다. 다시 시도하세요.');
            }
        },
        error: function(err){//데이터를 받지 못한 것. 네트워크 오류 등의 이류
            alert('저장에 실패했습니다. 다시 시도하세요.');//
        }
    });
});

$('#btn_board_list').on('click', function() {
    window.location.replace("/board/list");
});

$('#btn_board_update').on('click', function() {//수정하는 부분, ajax로 실행하기
    $.ajax({
        url: '/board/update/process',
        method: 'POST', //첨부파일도 post로 보내야 함
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({'board_title':$('#board_title').val(), 'board_content':$('#board_content').val(), 'board_bid':$('#bid').val()}),
        success: function(data){//db에서 오류 나면 여기로 온다
            if(data.status == 'OK'){
                alert('수정에 성공했습니다.');
                window.location.replace('/board/list');
            } else {
                alert('수정에 실패했습니다. 다시 시도하세요.');
            }
        },
        error: function(err){//데이터를 받지 못한 것. 네트워크 오류 등의 이류
            console.log(err);
            alert('수정에 실패했습니다. 다시 시도하세요.');//
        }
    });
    window.location.replace("/board/list");
});

$('#btn_board_delete').on('click', function() {//삭제하는 부분, ajax로 실행하기
    var check = confirm("정말로 삭제하시겠습니까?");
    if (!check) return;
    $.ajax({
        url:'/board/delete?bid='+$('#bid').val(),
        method:'GET',
        success: function(data){//db에서 오류 나면 여기로 온다
            if(data.status == 'OK'){
                alert('삭제에 성공했습니다.');
                window.location.replace('/board/list');
            } else {
                alert('삭제에 실패했습니다. 다시 시도하세요.')
            }
        },
        error: function(err){//데이터를 받지 못한 것. 네트워크 오류 등의 이류
            alert('삭제에 실패했습니다. 다시 시도하세요.')//
        }
    });
    window.location.replace("/board/list");
});

