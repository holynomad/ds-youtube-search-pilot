$(document).ready(function(){
  var API_KEY = "Your API Key"
  var video = ""
  var videos = $("#videos")

  $("#form").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");

    var search = $("#search").val();

    videoSearch(API_KEY, search, 50);
  })
  

  function videoSearch(key, search, maxResults){

    $("#videos").empty()

    $.get("https://www.googleapis.com/youtube/v3/search?key="+key
    + "&type=video&part=snippet&maxResults="+maxResults+ "&q="+search, function(data){
      console.log(data)

      data.items.forEach(item => {
        video = `
          <iframe src="https://www.youtube.com/embed/${item.id.videoId}" height="315" width="420" frameboarder="0" allowfullscreen></iframe>

        `

        $("#videos").append(video)
      });
    })
      
  }
})