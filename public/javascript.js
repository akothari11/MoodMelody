var trackURIs = "";

function setMood() {
  var mood = $(".same-as-selected").text();

  if (mood.indexOf("Happy") >= 0) {
    $("#popularity").val("5");
    $("#energy").val("7");
    $("#valence").val("10");
    $("#instrumentalness").val("5");
  } else if (mood.indexOf("Sad") >= 0) {
    $("#popularity").val("5");
    $("#energy").val("3");
    $("#valence").val("2");
    $("#instrumentalness").val("7");
  } else if (mood.indexOf("Mellow") >= 0) {
    $("#popularity").val("5");
    $("#energy").val("1");
    $("#valence").val("5");
    $("#instrumentalness").val("8");
  } else if (mood.indexOf("Motivational") >= 0) {
    $("#popularity").val("5");
    $("#energy").val("10");
    $("#valence").val("7");
    $("#instrumentalness").val("5");
  } else if (mood.indexOf("Party") >= 0) {
    $("#popularity").val("10");
    $("#energy").val("10");
    $("#valence").val("3");
    $("#instrumentalness").val("3");
  }
}

function retrieveRecommendations() {
  var genreValue = $("#genre").val();

  var popularityValue = parseInt($("#popularity").val()) * 10;
  var energyValue = parseInt($("#energy").val()) / 10;
  var valenceValue = parseInt($("#valence").val()) / 10;
  var instrumentalValue = parseInt($("#instrumentalness").val()) / 10;
  var param = "limit=50&seed_genres=" + genreValue + "&energy=" + energyValue.toString() + "&valence=" + valenceValue.toString() + "&instrumentalness=" + instrumentalValue.toString() + "&popularity=" + popularityValue.toString();

  //Handle error cases by showing an alert describing error
  if ((popularityValue < 0 || isNaN(popularityValue) || energyValue < 0 || isNaN(energyValue) || valenceValue < 0 || isNaN(valenceValue) || instrumentalValue < 0 || isNaN(instrumentalValue)) && genreValue == "") {
    swal({
      type: 'error',
      title: 'Oops...',
      text: 'Please select a genre and enter a value between 0-10'
    });
  } else if (popularityValue < 0 || isNaN(popularityValue) || energyValue < 0 || isNaN(energyValue) || valenceValue < 0 || isNaN(valenceValue) || instrumentalValue < 0 || isNaN(instrumentalValue)) {
    swal({
      type: 'error',
      title: 'Oops...',
      text: 'Please enter a value between 0-10'
    });
    param = "";
  } else if (genreValue == "") {
    swal({
      type: 'error',
      title: 'Oops...',
      text: 'Please select a genre'
    });
  }


  var accessToken = $("#accessToken").val();
  $.ajax({
    url: 'https://api.spotify.com/v1/recommendations?' + param,
    type: 'GET',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    success: function(data) {
      $("#recommendationDiv").empty();
      var outerDiv = $('<div/>', {
        class: "col-xs-12"
      });
      var playlistInputDiv = $('<div/>', {
        class: "col-xs-6"
      });
      var playlistInput = $('<input/>', {
        id: "playlistName",
        attr: {
          "type": "text",
          "placeholder":"Enter Playlist Name",
          "style":"border:0; border-radius:4px; padding:8px;"
        }
      });
      playlistInputDiv.append(playlistInput);
      var createButtonDiv = $('<div/>', {
        class: "col-xs-6"
      });
      var createButton = $('<button/>', {
        class:"btn btn-lg",
        attr: {
          "type": "button",
          "onclick":"createPlaylist();"
        },
        text:"Add Songs to Playlist"
      });
      createButtonDiv.append(createButton);
      outerDiv.append(playlistInputDiv);
      outerDiv.append(createButtonDiv);
      $("#recommendationDiv").append(outerDiv);
      $("#recommendationDiv").css("display", "block");
      $("#informationDiv").css("display", "none");
      console.log(data);
      for (var i = 0; i < data.tracks.length; i++) {
        trackName = data.tracks[i].name;
        artistName = data.tracks[i].artists[0].name;
        albumName = data.tracks[i].album.name;
        imageURL = data.tracks[i].album.images[2].url;
        openURL = data.tracks[i].external_urls.spotify;
        trackURIs += data.tracks[i].uri + ",";
        addTrackUI(trackName, artistName, albumName, imageURL, openURL);
      }
    }
  });
}

function addTrackUI(trackName, artistName, albumName, albumImg, openURL) {

  var anchor = $('<a/>', {
    attr: {
      "href": openURL,
      "target": "_blank"
    }
  });
  var outerDiv = $('<div/>', {
    class: "col-xs-12"
  });
  var trackDiv = $('<div/>', {
    class: "trackDiv"
  });
  var imgDiv = $('<div/>', {
    class: "imgDiv"
  });
  var imgElem = $('<img/>', {
    class: "col-xs-12",
    src: albumImg
  });
  imgDiv.append(imgElem);

  var trackInfo = $('<div/>', {
    class: "trackInfo"
  });
  var songName = $('<div/>', {
    class: "trackDetail songName",
    attr: {
      "title": trackName
    },
    text: trackName
  });
  anchor.append(songName);
  var trackArtist = $('<div/>', {
    class: "trackDetail artistAlbum",
    attr: {
      "title": artistName
    },
    text: artistName
  });
  var trackAlbum = $('<div/>', {
    class: "trackDetail artistAlbum",
    attr: {
      "title": albumName
    },
    text: albumName
  });
  trackInfo.append(anchor);
  trackInfo.append(trackArtist);
  trackInfo.append(trackAlbum);
  trackDiv.append(imgDiv);
  trackDiv.append(trackInfo);
  outerDiv.append(trackDiv);


  $("#recommendationDiv").append(outerDiv);


}

function displayInstruction() {
  $("#recommendationDiv").css("display", "none");
  $("#informationDiv").css("display", "block");
}

function getUserID() {
  var accessToken = $("#accessToken").val();
  $.ajax({
    url: 'https://api.spotify.com/v1/me',
    headers: {
      'Authorization': 'Bearer ' + accessToken,
      'Content-Type': 'application/json'
    },
    success: function(response) {
      console.log(response.id);
    },
    error: function() {
      alert('there was an error');
    }
  });
}

function createPlaylist() {

  var accessToken = $("#accessToken").val();
  var userID = $("#userID").val();
  //var playllistName = $("#genre").val() + $("#mood").val();
  var playlistName = $("#playlistName").val();
  if(playlistName){
    var data = {
      name: playlistName
    };
    var playlistID = "";
    $.ajax({
      type: 'POST',
      url: 'https://api.spotify.com/v1/users/' + userID + '/playlists',
      data: JSON.stringify(data),
      dataType: 'json',
      headers: {
        'Authorization': 'Bearer ' + accessToken
      },
      contentType: 'application/json',
      success: function(result) {
        console.log(result);
        playlistID = result.id;
        addToPlaylist(playlistID);
      },
      error: function(e) {
        console.log(e);
      }
    });
  }
  else{
    swal({
      type: 'error',
      title: 'Oops...',
      text: 'Please enter a name for the playlist'
    });
  }
}

function addToPlaylist(playlistID){
  var accessToken = $("#accessToken").val();
  console.log(trackURIs);
  var u = 'https://api.spotify.com/v1/playlists/'+ playlistID + '/tracks?uris=' + trackURIs;
  console.log(u);

  $.ajax({
    type: 'POST',
    url: 'https://api.spotify.com/v1/playlists/'+ playlistID + '/tracks?uris=' + trackURIs,
    dataType: 'text',
    headers: {
      'Authorization': 'Bearer ' + accessToken
    },
    contentType: 'application/json',
    success: function(result) {
      console.log(result);
      $("#playlistName").val("");
    },
    error: function(e) {
      console.log(e);
    }
  });


}
