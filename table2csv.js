// 출처 : https://zzznara2.tistory.com/189
// 정규식을 활용한 html 태그 제거 @ 2020.11.28.
function removeTag( str ) {
  // 모든 종류의 html 태그 제거
  //return str.replace(/(<([^>]+)>)/gi, "");

  // iframe 태그를 갖고 있다면, 아래통해 src url만 추출 : https://stackoverflow.com/questions/20594258/javascript-regular-expression-to-replace-iframe-to-clickable-youtube-link
  if (str.indexOf('iframe') > -1) {
    
    // 아래 iframe 필터링 테스트 중....일단 주석 !
    
    //let match = data.match(/\embed\/([0-9]+)\//i);
    //let result = match[1];
    
    //alert(match)
    //var url = match[1];
    //alert(url)
    
    /*
    var pattern = /<iframe.*?src="(.*?)".*?<\/iframe>/;
    var match = str.exec(pattern)
    var result = match[1];
    */
    
    // 출처: https://webdir.tistory.com/490 [WEBDIR]
    //alert($('iframe').attr('src'));
    //var vurl = $('iframe').attr('src').match(/www.youtube.com\/embed\/?([0-9]+)/i);

    return str;

  } else {
    //alert(str + "--> is not")
    // 그 외 태그(h6 등)인 경우, 내가 지정한 특정 html 태그만 제거 : https://webisfree.com/2015-12-22/[%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8]-%EC%A0%95%EA%B7%9C%ED%91%9C%ED%98%84%EC%8B%9D%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%98%EC%97%AC-%ED%83%9C%EA%B7%B8%EB%A7%8C-%EC%A0%9C%EA%B1%B0%ED%95%98%EA%B8%B0
    return str.replace(/<(\/h6|h6)([^>]*)>/gi,"");
  }
}

// 출처: https://extbrain.tistory.com/115 
// Table 형식 CSV export 추출
function exportTableToCsv(tableId, filename) {
    if (filename == null || typeof filename == undefined)
        filename = tableId;

    filename += ".csv";

    var BOM = "\uFEFF"; // 파일이 UTF-8 BOM이 되도록 처리

    var table = document.getElementById(tableId);
    var csvString = BOM;

    for (var rowCnt = 0; rowCnt < table.rows.length; rowCnt++) {
        var rowData = table.rows[rowCnt].cells;
        for (var colCnt = 0; colCnt < rowData.length; colCnt++) {
            var columnData = rowData[colCnt].innerHTML;
            if (columnData == null || columnData.length == 0) {
                columnData = "".replace(/"/g, '""');
            }
            else {
                columnData = columnData.toString().replace(/"/g, '""'); // escape double quotes
            }
            csvString = csvString + '"' + removeTag(columnData) + '",'; // html tag 제거 추가
        }
        csvString = csvString.substring(0, csvString.length - 1);
        csvString = csvString + "\r\n";
    }
    csvString = csvString.substring(0, csvString.length - 1);

    // IE 10, 11, Edge Run
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {

        var blob = new Blob([decodeURIComponent(csvString)], {
            type: 'text/csv;charset=utf8'
        });

        window.navigator.msSaveOrOpenBlob(blob, filename);

    } else if (window.Blob && window.URL) {
        // HTML5 Blob
        var blob = new Blob([csvString], { type: 'text/csv;charset=utf8' });
        var csvUrl = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        a.setAttribute('href', csvUrl);
        a.setAttribute('download', filename);
        document.body.appendChild(a);

        a.click()
        a.remove();
    } else {
        // Data URI
        var csvData = 'data:application/csv;charset=utf-8,' + encodeURIComponent(csvString);
        var blob = new Blob([csvString], { type: 'text/csv;charset=utf8' });
        var csvUrl = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.setAttribute('style', 'display:none');
        a.setAttribute('target', '_blank');
        a.setAttribute('href', csvData);
        a.setAttribute('download', filename);
        document.body.appendChild(a);
        a.click()
        a.remove();
    }
}




