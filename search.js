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
    videoLists(API_KEY, search, 5, "");
  })
  
  $("#channelInfo").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");
 
    var search = $("#search").val();
    var nextPageToken = $("#nextPageToken").val();

    //console.log(nextPageToken)
    videoLists(API_KEY, search, 5, nextPageToken);
  })

  $("#videoInfo").submit(function(event){
    event.preventDefault();
    //alert("form is submitted");
 
    var videoId = $("#videoId").val();
    //var nextPageToken = $("#nextPageToken").val();

    console.log("detail-info.clicked ==>" + videoId)

    videoDetails(API_KEY, videoId, 0);
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

      data.items.forEach(function(item, index, data) {
        console.log(data[index])
        
        video = `
          <iframe src="https://www.youtube.com/embed/${item.id.videoId}" height="315" width="420" frameboarder="0" allowfullscreen></iframe>
          <h6>ㅁ 채널ID : ${item.snippet.channelId}</h6>
          <h6>ㅁ 채널명 : ${item.snippet.channelTitle}</h6>
          <h6>ㅁ 제목 : ${item.snippet.title}</h6>
          <h6>ㅁ Desc. : ${item.snippet.description}</h6>
          <h6>ㅁ 게시일시 : ${item.snippet.publishedAt}</h6> 
          <input type="text" class="form-control" id="videoId"><h6> ㅁ ${index} : ${data[index].id.videoId}</h6>
          <input type="submit" class="btn btn-primary" value="detail-info">
          <div id="details"></div>
          
        `
        videoDetails(API_KEY, data[index].id.videoId);

        //$("#videoId").append(item.id.videoId);
        $("#videos").append(video);
        
        //document.getElementById("details").value = data[index].id.videoId;
      });
    })
  }

  function videoDetails(key, videoId){
    console.log("called videoDetails !!!!")  
    $("#details").empty()

    $.get("https://www.googleapis.com/youtube/v3/videos?id="+videoId + "&key="+key
    + "&part=snippet,contentDetails,statistics,status", function(detail){
      

      //$("#details").append("totalResults : " + detail.snippet.tags[])
      detail.items.forEach(function(item, index, det) {
        console.log(det[index])

        $("#details").append("<br>contentDetails.duration : " + det[index].contentDetails.duration);
        $("#details").append("<br>statistics.viewCount : " + det[index].statistics.viewCount);
        $("#details").append("<br>statistics.commentCount : " + det[index].statistics.commentCount);
        $("#details").append("<br>statistics.favoriteCount : " + det[index].statistics.favoriteCount);
        $("#details").append("<br>snippet.tags : " + det[index].snippet.tags);
        
    });
  }
})