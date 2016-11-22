
 var TINY={};

 function T$(i){return document.getElementById(i)}
 function T$$(e,p){return p.getElementsByTagName(e)}




 TINY.table=function(){
 function sorter(n){this.n=n; this.pagesize=20; this.paginate=0}
 sorter.prototype.init=function(id_tbl,f){

 var t=ge(id_tbl), i=0; this.e=id_tbl; this.l=t.r.length; t.a=[];
 t.h=T$$('thead',T$(id_tbl))[0].rows[0]; t.w=t.h.cells.length;

 for(i;i<t.w;i++){
 var c=t.h.cells[i];
 if(c.className!='nosort'){c.className=this.head; c.onclick=new Function(this.n+'.wk(this.cellIndex)')}
 }

 for(i=0;i<this.l;i++){t.a[i]={}}
 if(f!=null){var a=new Function(this.n+'.wk('+f+')'); a()}
 if(this.paginate){this.g=1; this.pages()}
 };


 sorter.prototype.wk=function(y){
 var t=ge(this.e), x=t.h.cells[y], i=0;
 for(i;i<this.l;i++){
 t.a[i].o=i; var v=t.r[i].cells[y]; t.r[i].style.display='';
 while(v.hasChildNodes()){v=v.firstChild}
 t.a[i].v=v.nodeValue?v.nodeValue:''
 }
 for(i=0;i<t.w;i++){var c=t.h.cells[i]; if(c.className!='nosort'){c.className=this.head}}

 if(t.p==y){t.a.reverse(); x.className=t.d?this.asc:this.desc; t.d=t.d?0:1}
 else{t.p=y; t.a.sort(cp); t.d=0; x.className=this.asc}


 var n=document.createElement('tbody'); n.id = 'id_Alarm_List_Tbody';
 for(i=0;i<this.l;i++){
 var r=t.r[t.a[i].o].cloneNode(true); n.appendChild(r);
 r.className=i%2==0?this.even:this.odd; var cells=T$$('td',r);
 for(var z=0;z<t.w;z++){cells[z].className=y==z?i%2==0?this.evensel:this.oddsel:''}
 }
 t.replaceChild(n,t.b); if(this.paginate){this.size(this.pagesize)}
 };
 sorter.prototype.page=function(s){
 var t=ge(this.e), i=0, l=s+parseInt(this.pagesize);
 if(this.currentid&&this.limitid){T$(this.currentid).innerHTML=this.g}
 for(i;i<this.l;i++){t.r[i].style.display=i>=s&&i<l?'':'none'}
 };
 sorter.prototype.move=function(d,m){
 var s=d==1?(m?this.d:this.g+1):(m?1:this.g-1);
 if(s<=this.d&&s>0){this.g=s; this.page((s-1)*this.pagesize)}
 };
 sorter.prototype.size=function(s){
 this.pagesize=s; this.g=1; this.pages(); this.page(0);
 if(this.currentid&&this.limitid){T$(this.limitid).innerHTML=this.d}
 };

sorter.prototype.pages=function(){this.d=Math.ceil(this.l/this.pagesize)};

 function ge(e){var tabl=T$(e); tabl.b=T$$('tbody',tabl)[0]; tabl.r=tabl.b.rows; return tabl};


 function cp(f,c){
 var g,h; f=g=f.v.toLowerCase(), c=h=c.v.toLowerCase();
 var i=parseFloat(f.replace(/(\$|\,)/g,'')), n=parseFloat(c.replace(/(\$|\,)/g,''));
 if(!isNaN(i)&&!isNaN(n)){g=i,h=n}
 i=Date.parse(f); n=Date.parse(c);
 if(!isNaN(i)&&!isNaN(n)){g=i; h=n}
 return g>h?1:(g<h?-1:0)
 };
 return{sorter:sorter}
 }();

 $(window).on('load', function() {
  alarm_history_tbl.init();
 });

 var alarm_history_tbl = new function () {
  this.init = function (){
 };


     // Вешаем обработчик на элемент управления кол-вом строк
     this.add_row = function (rows,fl_highlight,alarm_zone,time,object_type,object_id,distance_x,distance_y) {
         var rowTpl = document.createElement("TR"),
             tbl = document.getElementById("id_Alarm_List_Tbody"),
             rowNum = 0,
             fields = {1:"val1", 2:"val2", 3:"val3", 4:"val4",5:"val5", 6:"val6", 7:"val7"},
             TD;

         for (var field in fields) {
             if (false === fields.hasOwnProperty(field)) {
                 continue;
             }
             TD = document.createElement("TD");
             rowTpl.appendChild(TD);
             rowNum += 1;
         }

         //if(fl_sort==false){fl_sort=true; $(rowTpl).delay(1100).queue(function(next1){alarm_history_tbl.sort(1); alarm_history_tbl.sort(1); next1();});}

         for (var i = 0; i < rows; i++) {var elem=rowTpl.cloneNode(true);tbl.insertBefore(elem,tbl.children[0]);if(fl_highlight){$(elem).addClass('highlight').delay(1000).queue(function(next){ $(this).removeClass('highlight'); next();});}}

         return (function() {

             var tableRows = tbl.rows;

             tableRows[0].cells[0].innerText = alarm_zone;
             tableRows[0].cells[1].innerText = time;
             tableRows[0].cells[2].innerText = object_type;
             tableRows[0].cells[3].innerText = object_id;
             tableRows[0].cells[4].innerText = distance_x;
             tableRows[0].cells[5].innerText = distance_y;
             tableRows[0].cells[6].innerText = "ff";
             //tableRows[tableRows.length-1].cells[6].innerText = distance_y;
             tableRows[0].cells[6].innerHTML = "<a onclick='DelRowAlarmHistory(this)'> Delete </a><input id='this_id' type='hidden'><div class='clear'></div>";




             alarm_history_tbl.sort(1); alarm_history_tbl.sort(1);
             //alarm_history_tbl.sort(1);
         }());
     };


     // Вешаем обработчик на элемент управления кол-вом строк
     this.add_row_arr = function (fl_highlight, tbl_arr) {
         var rowTpl = document.createElement("TR"),
             tbl = document.getElementById("id_Alarm_List_Tbody"),
             rowNum = 0,
             fields = {1:"val1", 2:"val2", 3:"val3", 4:"val4",5:"val5", 6:"val6", 7:"val7"},
             TD,i;

         for (var field in fields) {
             if (false === fields.hasOwnProperty(field)) {continue;}
             TD = document.createElement("TD");
             rowTpl.appendChild(TD);
         }

         for (i in tbl_arr){
             var elem=rowTpl.cloneNode(true);

             elem.cells[0].innerText = tbl_arr[i]["alarm_zone"];
             elem.cells[1].innerText = tbl_arr[i]["time_alarm"];
             elem.cells[2].innerText = tbl_arr[i]["object_type"];
             elem.cells[3].innerText = tbl_arr[i]["object_id"];
             elem.cells[4].innerText = tbl_arr[i]["distance_x"];
             elem.cells[5].innerText = tbl_arr[i]["distance_y"];
             elem.cells[6].innerHTML = "<a onclick='DelRowAlarmHistory(this,"+tbl_arr[i]['id_row_db']+")'> Delete </a><div class='clear'></div>";

             tbl.insertBefore(elem,tbl.children[0]);

             if(fl_highlight){
                 if(rowNum){
                     $(elem).addClass('highlight').delay(1000).queue(function(next){
                         $(this).removeClass('highlight');
                         next();});
                 }else{
                     $(elem).addClass('highlight').delay(1000).queue(function(next){
                         $(this).removeClass('highlight');
                         alarm_history_tbl.sort(1);
                         alarm_history_tbl.sort(1);
                         next();});
                 }
             }
             rowNum++;
         }

     };


  this.sort = function (coll) {
   var sort_size = document.getElementById("id_Sorter_Size_Select");
   sorter = new TINY.table.sorter("sorter");
   sorter.head = "head";
   sorter.asc = "asc";
   sorter.desc = "desc";
   sorter.even = "evenrow";
   sorter.odd = "oddrow";
   sorter.evensel = "evenselected";
   sorter.oddsel = "oddselected";
   sorter.paginate = true;
   sorter.currentid = "currentpage";
   sorter.limitid = "pagelimit";
   sorter.init("id_Alarm_List_Table",coll);
   sorter.size(sort_size.value);
  }


 };

