$(document).ready(function(){
  var API_KEY = ""
  var video = ""
  //var nextPageToken = ""
  var videos = $("#videos")

  $("#form").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");
 
    var search = $("#search").val();


    console.log(search)
    videoSearch(API_KEY, search, 10, "");
  })
  
  $("#channelInfo").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");
 
    var search = $("#search").val();
    var nextPageToken = $("#nextPageToken").val();


    console.log(nextPageToken)
    videoSearch(API_KEY, search, 10, nextPageToken);
  })

  function videoSearch(key, search, maxResults, nextPageToken){

    //$("#nextPageToken").empty()
    $("#totalResults").empty()
    $("#videos").empty()

    $.get("https://www.googleapis.com/youtube/v3/search?key="+key
    + "&type=video&part=snippet&maxResults="+maxResults+ "&q="+search+"&pageToken="+nextPageToken, function(data){
      console.log(data)

      //$("#nextPageToken").append(data.nextPageToken)
      
      document.getElementById("nextPageToken").value = data.nextPageToken;

      $("#totalResults").append("totalResults : " + data.pageInfo.totalResults)

      data.items.forEach(item => {
        
        video = `
          <iframe src="https://www.youtube.com/embed/${item.id.videoId}" height="315" width="420" frameboarder="0" allowfullscreen></iframe>
          <h6>채널ID : ${item.snippet.channelId}</h6>
          <h6>채널명 : ${item.snippet.channelTitle}</h6>
          <h6>제목 : ${item.snippet.title}</h6>
          <h6>Desc. : ${item.snippet.description}</h6>
          <h6>게시일시 : ${item.snippet.publishedAt}</h6> 
        `

        $("#videos").append(video)
      });
    })
      
  }
})