//jquery authenticate and get
$(function(){
  $('#login').on('click', function(){
    $.ajax('http://localhost:3000/login',{
      contentType: 'application/json',
      processData: false,
      data: JSON.stringify({
        credentials: {
          // name: $('#name').val(),
          // email: $('#email').val(),
          username: $('#username').val(),
          password: $('#password').val()
        }
      }),
      dataType: "json",
      method: "POST"
    }).done(function(data, textStatus) {
      $('#token').val(textStatus == 'nocontent' ? 'login failed' : data['token']);
      console.log(data);
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log(textStatus);
    });
  });
  $('#get-index').on('click', function(){
    $.ajax('http://localhost:3000/hello',{
      dataType: "json",
      method: "GET",
      headers: { Authorization: 'Token token=' + $("#token").val() }
    }).done(function(data, textStatus) {
      $('#result').val(JSON.stringify(data));
      console.log(data);
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log(textStatus);
    });
  });
  $('#get-by-id').on('click', function(){
    $.ajax('http://localhost:3000/hello/' +
      $('#id').val(), {
      dataType: "json",
      method: "GET",
      headers: { Authorization: 'Token token=' + $("#token").val() }
    }).done(function(data, textStatus) {
      $('#result').val(JSON.stringify(data));
      console.log(data);
    }).fail(function(jqxhr, textStatus, errorThrown){
      console.log(textStatus);
    });
  });
});
