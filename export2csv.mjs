jQuery("#export").on('click', function (event) { 
  $('#links').table2csv({
   file_name:  'test.csv',
   header_body_space:  0
  });
   
});

// JQuery Plugin 
/**
* @description: Plugin to export HTML table to CSV file.
* @author: VenkataRamanaB
* @link: https://github.com/venkataramanab/table2csv
* Feel free to use or modify this plugin as far as my full name is kept
*/

(function ($) {
const _trim_text = (text) => {
   return text.trim();
};
const _quote_text = (text) => {
   return '"' + text + '"';
};
const _export = (lines, file_name) => {
   /* CSV변환시 한글인코딩 utf-8 bom 개선위한 ,%EF%BB%BF 추가 @ 2021.10.25.*/
   const uri = 'data:text/csv;charset=utf-8,%EF%BB%BF' + encodeURIComponent(lines.join('\n'));
   const el_a = document.createElement('a');
   el_a.href = uri;
   el_a.download = file_name;
   document.body.appendChild(el_a);
   el_a.click();
   document.body.removeChild(el_a);
};



const init = (tb, options) => {
   let lines = [];
   $(tb).find('thead>tr').each(function () {
       let line = [];
       $(this).find('th').each(function () {
           line.push(_quote_text(_trim_text($(this).text())));
       });
       lines.push(line.splice(0).toString());
   })
   
   
   
   for (let i = 0; i < options.header_body_space; i++) lines.push('\n');
   $(tb).find('tbody>tr').each(function () {
       let line = [];
       $(this).find('td').each(function () {
          
          //This is what I tried to import but it is not working
          /*if($(this).find('select').each(function(){
               line.push(_quote_text($(this).find("option:selected").text()));
           }));*/
           if($(this).find('select').length){
            line.push(_quote_text($(this).find('option:selected').text()));
           }else{
            line.push(_quote_text(_trim_text($(this).text())));
           } 
           
       });
       lines.push(line.splice(0).toString());
   })
   _export(lines, options.file_name)
};



$.fn.extend({
   table2csv: function (options) {
       const default_options = {
           file_name: 'table_records.csv',
           header_body_space: 1
       };
       options = $.extend(default_options, options);
       init(this, options);
   }
})
})(jQuery);






