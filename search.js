$(document).ready(function(){
  var API_KEY = ""
  var video = ""
  //var nextPageToken = ""
  var videos = $("#videos")

  $("#form").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");
 
    var search = $("#search").val();


    console.log("search.clicked ==> " + search)
    videoLists(API_KEY, search, 10, "");
  })
  
  $("#channelInfo").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");
 
    var search = $("#search").val();
    var nextPageToken = $("#nextPageToken").val();

    //console.log(nextPageToken)
    videoLists(API_KEY, search, 10, nextPageToken);
  })

  $("#videoInfo").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");
 
    var videoId = $("#videoId").val();
    //var nextPageToken = $("#nextPageToken").val();

    console.log("detail-info.clicked ==>" + videoId)

    videoDetails(API_KEY, videoId, 10, "");
  })

  function videoLists(key, search, maxResults, nextPageToken){

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
          <h6>ㅁ 채널ID : ${item.snippet.channelId}</h6>
          <h6>ㅁ 채널명 : ${item.snippet.channelTitle}</h6>
          <h6>ㅁ 제목 : ${item.snippet.title}</h6>
          <h6>ㅁ Desc. : ${item.snippet.description}</h6>
          <h6>ㅁ 게시일시 : ${item.snippet.publishedAt}</h6> 
          <h6>ㅁ tags : ${item.snippet.tags}</h6> 
          <input type="text" class="form-control" id="videoId">${item.id.videoId}
          <input type="submit" class="btn btn-primary" value="detail-info">
        `

        $("#videos").append(video);

        //document.getElementById("videoId").value = ${item.id.videoId};
      });
    })
  }

  function videoDetails(key, videoId, maxResults, pageToken){
      
    $("#details").empty()

    $.get("https://www.googleapis.com/youtube/v3/videos?id="+videoId + "&key="+key
    + "&part=contentDetails,statistics,status", function(detail){
      console.log(detail)

      //$("#details").append("totalResults : " + detail.snippet.tags[])
      $("#details").append("contentDetails : " + detail);
       
    });
  }
})