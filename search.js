$(document).ready(function(){
  var API_KEY = ""
  var video = ""
  var videos = $("#videos")

  $("#form").submit(function(event){
    event.preventDefault();
 
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
 
    var videoId = $("#videoId").val();
    //var nextPageToken = $("#nextPageToken").val();

    console.log("detail-info.clicked ==>" + videoId)

    videoDetails(API_KEY, videoId, channelId, videoinfo);
  })

  // add "export" button for CSV download @ 2020.11.15.
  $("#printOut").submit(function(event){
    event.preventDefault();
 
    // var jb = $( 'h1' ).html();
    var contents = $('#videos').html();
    
    //var splitCont = contents.split(' ')
    //alert(splitCont)
    
    //console.log(Array.isArray(splitCont))
    //console.log("printOut --> ",splitCont)

    let csvContent = "data:text/csv;charset=utf-8,";
    
    /*
    contents.forEach(function(rowArray) {
        let row = rowArray.join(",");
        csvContent += row + "\r\n";
    });
    */

    csvContent += contents;
    
    var encodedUri = encodeURI(csvContent);
    window.open(encodedUri);
  })

  function videoLists(key, search, maxResults, nextPageToken){

    //$("#nextPageToken").empty()
    $("#totalResults").empty()
    $("#videos").empty()
    $("#contents").empty()

    $.get("https://www.googleapis.com/youtube/v3/search?key="+key
    + "&type=video&part=snippet&maxResults="+maxResults+ "&q="+search+"&pageToken="+nextPageToken, function(data){
      console.log('1')
      console.log(data)

      //$("#nextPageToken").append(data.nextPageToken)
      
      document.getElementById("nextPageToken").value = data.nextPageToken;

      $("#totalResults").append("totalResults : " + data.pageInfo.totalResults)

      data.items.forEach(function(item, index, data) {
        console.log('2-1', index)
        console.log(data[index])
        
        video = `
          <iframe src="https://www.youtube.com/embed/${item.id.videoId}" height="315" width="420" frameboarder="0" allowfullscreen></iframe>
          <h6>ㅁ 채널ID : ${item.snippet.channelId}</h6>
          <h6>ㅁ 채널명 : ${item.snippet.channelTitle}</h6>
          <h6>ㅁ 제목 : ${item.snippet.title}</h6>
          <h6>ㅁ Desc. : ${item.snippet.description}</h6>
          <h6>ㅁ 게시일시 : ${item.snippet.publishedAt}</h6> 
        `

        // test
        /*
        videoString = `
          "https://www.youtube.com/embed/${item.id.videoId}, ${item.snippet.channelId}, ${item.snippet.channelTitle}"
        ` 
        */       

        
        //console.log(Array.isArray(videoString))
        //console.log(videoString)
        

        // videoDetails로 일원화 주석 @ 2020.11.14.
        //$("#videos").append(video);

        //console.log('2-2', data[index].id.videoId, data[index].snippet.channelId, video)

        videoDetails(API_KEY, data[index].id.videoId, data[index].snippet.channelId, video);
        
        //document.getElementsByName('details')[0] = data[index].id.videoId;

        //document.getElementById("details").value = data[index].id.videoId;

        //$.get("https://www.googleapis.com/youtube/v3/videos?id="+item.id.videoId + "&key="+key
        //+ "&part=snippet,contentDetails,statistics,status", function(detail){
          

          //$("#details").append("totalResults : " + detail.snippet.tags[])
          
        //  detail.items.forEach(function(item, index_2, det) {
        //    console.log('3-1', index_2)
        //    console.log(det[index_2])

        //    if (index == index_2 && snippet.channelId == item.snippet.channelId) {
        //      alert(det[index_2].contentDetails.duration)
              
              
              //$("#contents").append("<br>contentDetails.duration : " + det[index_2].contentDetails.duration);
              //$("#contents").append("<br>statistics.viewCount : " + det[index_2].statistics.viewCount);
              //$("#contents").append("<br>statistics.commentCount : " + det[index_2].statistics.commentCount);
              //$("#contents").append("<br>statistics.favoriteCount : " + det[index_2].statistics.favoriteCount);
              //$("#contents").append("<br>snippet.tags : " + det[index_2].snippet.tags);
        //    }
        //  })    
          
        //  $("#contents").append(details);

        //})

      });
    })


  }

  function videoDetails(key, videoId, channelId, videoinfo){
    console.log("called videoDetails") // --> ", videoId, channelId)  

    $("#contents").empty()



    $.get("https://www.googleapis.com/youtube/v3/videos?id="+videoId + "&key="+key
    + "&part=snippet,contentDetails,statistics,status", function(detail){
      console.log("called getting videoDetails")  

      //$("#details").append("totalResults : " + detail.snippet.tags[])
      detail.items.forEach(function(item, index, det) {
        console.log('3-2', index, channelId)

        if (channelId == det[index].snippet.channelId) {
          
          videoDetail = videoinfo + `
            <h6> ㅁ 재생시간 : ${det[index].contentDetails.duration} </h6>
            <h6> ㅁ 조회수 : ${det[index].statistics.viewCount} </h6>
            <h6> ㅁ 댓글수 : ${det[index].statistics.commentCount} </h6>
            <h6> ㅁ Tags : ${det[index].snippet.tags} </h6>
          `
          

          // test
          /*
          videoDetail = videoinfo.split(',')
          console.log(Array.isArray(videoDetail))
          console.log(videoDetail)
          */

          // 구독자수는 channels api 통해 추가작업 필요
          //<h6> ㅁ 구독자수 : ${det[index].statistics.subscriberCount} </h6>

          $("#videos").append(videoDetail);


          //console.log(det[index].contentDetails.duration)
          //console.log(det[index].statistics.viewCount)
          //console.log(det[index].statistics.commentCount)
          //console.log(det[index].snippet.tags)

        }

        //$("#contents").append("<br>contentDetails.duration : " + det[index].contentDetails.duration);
        //$("#contents").append("<br>statistics.viewCount : " + det[index].statistics.viewCount);
        //$("#contents").append("<br>statistics.commentCount : " + det[index].statistics.commentCount);
        //$("#contents").append("<br>statistics.favoriteCount : " + det[index].statistics.favoriteCount);
        //$("#contents").append("<br>snippet.tags : " + det[index].snippet.tags);

      })    
    })
  }

})