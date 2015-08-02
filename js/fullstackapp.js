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

  var app = {
    $home: $("#home"),
    $loginUser: $("#login-user"),
    $newUser: $("#new-user"),
    $newPicture: $("#new-picture"),
    $userDiv: $("#userDiv"),
    $pictures: $("#pictures"),
    $uploadPicture: $("#upload-picture"),
    $logoutUser: $("#logout-user"),
    $welcome: $("#welcome"),
    $heroImage: $("#hero-image"),
    $registerUser: $("#register-user"),
    $login: $("#login"),
    $newPicButton: $("#new-pic-button"),
    $newUserButton: $("#new-user-button"),
    $loginButton: $("#login-button")
  };

  app.$home.on("click", function(event) {
    // app.$loginUser.hide();
    // app.$newUser.hide();
    // app.$newPicture.hide();
    // app.$userDiv.hide();
    // app.$pictures.hide();
    // app.$uploadPicture.hide();
    // app.$logoutUser.hide();
    app.$welcome.show();
    app.$heroImage.show();
  })

  app.$registerUser.on("click", function(event) {
    app.$loginUser.hide();
    app.$newUser.show();
    app.$welcome.hide();
    app.$heroImage.hide();

  });

  app.$login.on("click", function(event) {
    app.$loginUser.show();
    app.$registerUser.hide();
    app.$login.hide();
    app.$welcome.hide();
    app.$heroImage.hide();
  });

  app.$uploadPicture.on("click", function(event) {
    app.$newPicture.show();
    app.$newPicButton.show();
    app.$pictures.hide();
    app.$userDiv.show();
  });

  app.$newPicButton.on("click", function(event) {
    app.$newPicButton.hide();
    app.$newPicture.hide();
    // app.$pictures.show();
    // app.$userDiv.show();
  })

  app.$logoutUser.on("click", function(event) {
    app.$welcome.show();
    app.$heroImage.show();
    app.$loginUser.hide();
    app.$newUser.hide();
    app.$newPicture.hide();
    app.$userDiv.hide();
    app.$pictures.hide();
    app.$newPicButton.hide();
    app.$registerUser.show();
    app.$login.show();
  })

  app.$newUserButton.on("click", function(event) {
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
      .done(function(data) {
        app.$newUser.hide();

        simpleStorage.set("token", data.token, {
          TTL: 43200000
        })
        renderUserData();
        getUserPictures();
      });
  });

  app.$loginButton.on("click", function() {
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
        app.$loginUser.hide();

        simpleStorage.set("token", data.token, {
          TTL: 43200000
        })

        simpleStorage.set("userID", data.id, {
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
  app.$logoutUser.on("click", function() {
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

  app.$newPicButton.on("click", function(event) {
    var fd = new FormData();
    fd.append('image', $("#new-pic")[0].files[0]);
    fd.append('comment', $("#new-pic-comment").val());

    var currentUserID = $('#current_user').data('current-user');
    console.log('creating picture for user with an id of ' + currentUserID); // userIdSpecial

    var userID = simpleStorage.get("userID");

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
        app.$newPicture.hide();
        app.$pictures.empty();
        getUserPictures();
      })
      .fail(function(error, textStatus, errorThrown) {
        console.log('error in login' + error + textStatus + errorThrown);
        console.log($('#token').val());

      });

  });

  var renderUserData = function(data) {
    app.$userDiv.html("welcome back, " + data.name);
  };

  function getUserPictures(userID) {
    $.ajax({
      method: 'GET',
      url: baseURL() + '/users/' + userID + '/pictures',
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
