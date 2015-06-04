$(document).ready(function(){
  $('#register-user').on("click", function(event){
    $('#new-user').show();
  })

  $('#login').on("click", function(event){
    $('#login-user').show();
  })

  $('#upload-picture').on("click", function(event){
    $('#new-picture').show();
  })

  $.ajax({
    method: 'GET',
    url: 'http://localhost:3000/users'
  })
  .done(function(user_data){
    console.log(user_data);
    user_data.forEach(function(user){
      $("#users").append("<li id='" + user.id + "'>" + user.name + "</li>");
    })

  })
  .fail(function(){
    console.log("failed when going to get all user data");
    alert("failed");
  });

  $("#users").on("click", function(event){
    alert("clicked " + event.target.id);
    $.ajax({
      method: 'GET',
      url: 'http://localhost:3000/users/' + event.target.id
    })
    .done(function(user_data){
      console.log(user_data);
      $("#user").html("");
      var picturesList = user_data.pictures;
      picturesList.forEach(function(index) {
        console.log(index.picture);
        var html = "<dl id='current_user' data-current-user='" + user_data.id + "' ><dt>name</dt><dd>" + user_data.name + '</dd><dt>pictures</dt><dd><img src="' + index.picture + '"/>' + user_data.picture_count + "</dd></dl>"
        $("#user").append(html);
      });

    })
    .fail(function(){
      alert("failed");
    });

  });

  $("#new-pic-button").on("click", function(event){
    var fd = new FormData();
    fd.append('image', $("#new-pic")[0].files[0]);
    fd.append('comment', $("#new-pic-comment").val());

    var currentUserID = $('#current_user').data('current-user');
    console.log('creating picture for user with an id of ' + currentUserID);

    $.ajax({
      method: 'POST',
      processData: false,
      contentType: false,
      cache: false,
      url: 'http://localhost:3000/users/' + currentUserID + '/pictures',
      data: fd
    })
    .done(function(){
      console.log('Added picture');
      alert('Added picture');
    });

  });

    // *** To hide and show different things
 //  var selectDiv = function(divName) {
 //    var allDivs = ['users', 'new-picture'];
 //   allDivs.forEach(function(div){
 //     $('#' + div).hide();
 //     console.log("hiding " + div);
 //   });
 //   $('#' + divName).show();
 //   console.log("showing " + divName);
 // };

 // selectDiv('new-user-button');


  $("#new-user-button").on("click", function(event){
    var newUser = {
      name: $('#new-user-name').val(),
      email: $('#new-user-email').val(),
      password: $('#new-user-password').val(),
      password_confirmation: $('#new-user-password-confirmation').val()
    };

    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/register',
      data: {credentials: newUser}
    })
    .done(function(response){
      debugger;
      $('#new-user').hide();
  //       console.log('Created a new user');
  //      newUser.append("<li id='" + user.id + "'>" + user.name + "</li>");
    });
  });

});

// //jquery authenticate and get
// $(function(){
//   $('#login').on('click', function(){
//     $.ajax('http://localhost:3000/login',{
//       contentType: 'application/json',
//       processData: false,
//       data: JSON.stringify({
//         credentials: {
//           // name: $('#name').val(),
//           // email: $('#email').val(),
//           username: $('#username').val(),
//           password: $('#password').val()
//         }
//       }),
//       dataType: "json",
//       method: "POST"
//     }).done(function(data, textStatus) {
//       $('#token').val(textStatus == 'nocontent' ? 'login failed' : data['token']);
//       console.log(data);
//     }).fail(function(jqxhr, textStatus, errorThrown){
//       console.log(textStatus);
//     });
//   });
//   $('#get-index').on('click', function(){
//     $.ajax('http://localhost:3000/hello',{
//       dataType: "json",
//       method: "GET",
//       headers: { Authorization: 'Token token=' + $("#token").val() }
//     }).done(function(data, textStatus) {
//       $('#result').val(JSON.stringify(data));
//       console.log(data);
//     }).fail(function(jqxhr, textStatus, errorThrown){
//       console.log(textStatus);
//     });
//   });
//   $('#get-by-id').on('click', function(){
//     $.ajax('http://localhost:3000/hello/' +
//       $('#id').val(), {
//       dataType: "json",
//       method: "GET",
//       headers: { Authorization: 'Token token=' + $("#token").val() }
//     }).done(function(data, textStatus) {
//       $('#result').val(JSON.stringify(data));
//       console.log(data);
//     }).fail(function(jqxhr, textStatus, errorThrown){
//       console.log(textStatus);
//     });
//   });
// });
