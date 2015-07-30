// path to heroku
var baseURL = function() {
  // return "http://localhost:3000";
  return "http://radiant-castle-7028.herokuapp.com";
};

$(document).ready(function() {
  // var userIdSpecial;

  if (simpleStorage.get('token')) {
    getUserPictures();
  }

  $("#home").on("click", function(event) {
    $("#login-user").hide();
    $("#new-user").hide();
    $("#new-picture").hide();
    $("#userDiv").hide();
    $("#pictures").hide();
    $("#upload-picture").hide();
    $("#logout-user").hide();
    $("#welcome").show();
    $("#hero-image").show();
  })

  $("#register-user").on("click", function(event) {
    $("#login-user").hide();
    $("#new-user").show();
    // $("#register-user").hide();
    $("#welcome").hide();
    $("#hero-image").hide();

  });

  $("#login").on("click", function(event) {
    $("#login-user").show();
    // $("#new-user").hide();
    $("#register-user").hide();
    $("#login").hide();
    // $("#upload-picture").hide();
    $("#welcome").hide();
    $("#hero-image").hide();
  });

  $("#upload-picture").on("click", function(event) {
    $("#new-picture").show();
    $("#new-pic-button").show();
    // $("#register-user").hide();
    // $("#login").hide();
    // $("#upload-picture").hide();
  });

  $("new-pic-button").on("click", function(event) {
    $("#new-pic-button").hide();
    $("#new-picture").hide();
  })

  $("#logout-user").on("click", function(event) {
    $("#login-user").hide();
    $("#new-user").hide();
    $("#new-picture").hide();
    $("#userDiv").hide();
    $("#pictures").hide();
    $("#new-pic-button").hide();
    $("#register-user").show();
    $("#login").show();
  })

  $("#new-user-button").on("click", function(event) {
    var newUser = {
      name: $("#new-user-name").val(),
      email: $("#new-user-email").val(),
      username: $("#new-user-username").val(),
      password: $("#new-user-password").val(),
      password_confirmation: $("#new-user-password-confirmation").val()
    };

    $.ajax({
      method: 'POST',
      url: baseURL() + '/register',
      data: {
        credentials: newUser
      }
    })
      .done(function(response) {
        $("#new-user").hide();

        simpleStorage.set("token", data.token, {
          TTL: 43200000
        })
        renderUserData();
        getUserPictures();
      });
  });

  $("#login-button").on("click", function() {
    var username = $("#returning-username").val();
    var password = $("#returning-password").val();
    var params = {
      credentials: {
        username: username,
        password: password
      }
    };
    $.ajax({
      method: 'POST',
      url: baseURL() + '/login',
      dataType: "json",
      data: params
    })
      .done(function(data) {
        $("#login-user").hide();

        simpleStorage.set("token", data.token, {
          TTL: 43200000
        })

        // set the token in the hidden input field
        // $('#token').val(data.token);

        renderUserData(data);
        getUserPictures(data.id);

        // var html = "<dl id='current_user' data-current-user='" + data.id + "' ><dt>name</dt><dd>" + data.name + '</dd><dt>pictures</dt><dd>'  + data.picture_count + "</dd></dl>";
        //   $("#user").append(html);
        // userIdSpecial = data.id;
      })
      .fail(function(error) {
        console.log('error in login' + error);
      });
  });

  // FROM COURTNEY
  $("#logout-user").on("click", function() {
    $.ajax({
      method: 'DELETE',
      url: baseURL() + '/logout',
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      }
    })
      .done(function() {
        console.log("user logged out");
      })
      .fail(function() {
        alert("Error in logging out");
      }).always(function() {
        simpleStorage.set('token', '');
        // toggle();
      });
  });

  // $.ajax({
  //   method: 'GET',
  //   url: 'http://localhost:3000/users'
  // })
  // .done(function(user_data){
  //   console.log(user_data);
  //   user_data.forEach(function(user){
  //     $("#users").append("<li id='" + user.id + "'>" + user.name + "</li>");
  //   });

  // })
  // .fail(function(){
  //   console.log("failed when going to get all user data");
  //   alert("failed");
  // });

  // $("#users").on("click", function(event){
  //   alert("clicked " + event.target.id);
  //   $.ajax({
  //     method: 'GET',
  //     url: 'http://localhost:3000/users/' + event.target.id
  //   })
  //   .done(function(user_data){
  //     console.log(user_data);
  //     $("#user").html("");
  //     var picturesList = user_data.pictures;
  //     picturesList.forEach(function(index) {
  //       console.log(index.picture);
  //       var html = "<dl id='current_user' data-current-user='" + user_data.id + "' ><dt>name</dt><dd>" + user_data.name + '</dd><dt>pictures</dt><dd><img src="' + index.picture + '"/>' + user_data.picture_count + "</dd></dl>";
  //       $("#user").append(html);
  //     });

  //   })
  //   .fail(function(){
  //     alert("failed");
  //   });

  // });

  $("#new-pic-button").on("click", function(event) {
    var fd = new FormData();
    fd.append('image', $("#new-pic")[0].files[0]);
    fd.append('comment', $("#new-pic-comment").val());

    var currentUserID = $('#current_user').data('current-user');
    console.log('creating picture for user with an id of ' + currentUserID); // userIdSpecial

    $.ajax({
      method: 'POST',
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      },
      processData: false,
      contentType: false,
      cache: false,
      url: baseURL() + '/users/' + userID + '/pictures', //userIdSpecial
      data: fd
    })
      .done(function() {
        // console.log('Added picture');
        $("#new-picture").hide();
        $("#pictures").empty();
        getUserPictures();
      })
      .fail(function(error, textStatus, errorThrown) {
        console.log('error in login' + error + textStatus + errorThrown);
        console.log($('#token').val());

      });

  });

  var renderUserData = function(data) {
    $("#userDiv").html("welcome back, " + data.name);
  };

  function getUserPictures(userID) {

    $.ajax({
      method: 'GET',
      url: baseURL(),
      // url: 'http://localhost:3000/users/' + userID + '/pictures',
      dataType: 'json',
      headers: {
        Authorization: 'Token token=' + simpleStorage.get('token')
      }

    })
      .done(function(userPictures) {
        userPictures.forEach(function(picture) {
          var imgTag = "<img src='" + picture.picture + "'></img>";
          $('#pictures').append("<li>" + imgTag + "</li>");
        })
      });
  }

});

// INDEX USER ACTION
// $.ajax({
//   method: 'GET',
//   url: 'http://localhost:3000/users'
// })
// .done(function(user_data){
//   console.log(user_data);
//   user_data.forEach(function(user){
//     $("#users").append("<li id='" + user.id + "'>" + user.name + "</li>");
//   });

// })
// .fail(function(){
//   console.log("failed when going to get all user data");
//   alert("failed");
// });

// HIDE AND SHOW ACTIONS
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
