webpackJsonp([25],{EcwC:function(t,e,n){"use strict";function a(t){n("vPaX")}Object.defineProperty(e,"__esModule",{value:!0});var o=n("bOdI"),r=n.n(o),i=n("bWJ8"),l=n("qqG0"),s={name:"HelloWorld",components:{Button:i.a,Toast:l.a},computed:{defaultErrImg:function(){return'this.src="'+this.$store.state.Common.defaultErrImg+'"'}},data:function(){var t,e,n;return n={daterange:[],sections:[{value:"1",label:"产品"},{value:"2",label:"设计"},{value:"3",label:"技术"},{value:"4",label:"人事"},{value:"5",label:"财务"}],section:"",mySearch:"",tableData:[(t={userName:"王小二",userNo:"102365632",className:"2015级三班",recordTime:"2017-12-02 08:23",checkTime:"08:00"},r()(t,"checkTime","2017-12-02 08:23"),r()(t,"placeName","校北门"),r()(t,"dicFmtMap",{recordDirectioncn:"进校"}),r()(t,"photoPath",""),t),(e={userName:"王小二",userNo:"102365632",className:"2015级三班",recordTime:"2017-12-02 08:25",checkTime:"08:00"},r()(e,"checkTime","2017-12-02 08:25"),r()(e,"placeName","校北门"),r()(e,"dicFmtMap",{recordDirectioncn:"进校"}),r()(e,"photoPath",""),e),{userName:"王小二",userNo:"102365632",className:"2015级三班",recordTime:"2017-12-03 09:25",checkTime:"2017-12-03 09:25",placeName:"校北门",dicFmtMap:{recordDirectioncn:"进校"},photoPath:""}]},r()(n,"tableData",[]),r()(n,"transferState",!1),r()(n,"treeData",[{id:10003,pid:10001,label:"班级",lv:2,group:102,isLeaf:0,children:[{id:10009,pid:10003,label:"高中部",lv:3,group:103,isLeaf:0,children:[{id:10013,pid:10009,label:"高三",lv:4,group:104,isLeaf:1,children:[]},{id:10011,pid:10009,label:"高一",lv:4,group:104,isLeaf:0,children:[{id:10014,pid:10011,label:"一班",lv:5,group:105,isLeaf:1,children:[]},{id:100017,pid:10011,label:"二班",lv:5,group:105,isLeaf:1,children:[]}]},{id:10012,pid:10009,label:"高二",lv:4,group:104,isLeaf:1,children:[]}]},{id:10010,pid:10003,label:"初中部",lv:3,group:103,isLeaf:1,children:[]}]}]),r()(n,"treeData",[]),r()(n,"defaultProps",{children:"children",label:"label"}),r()(n,"depExpandedKeys",[]),r()(n,"deparment",""),r()(n,"depId",""),r()(n,"onTime",1),r()(n,"onAll",1),r()(n,"showIndex",!1),r()(n,"allNum",0),r()(n,"currentPage",1),r()(n,"isToast",!1),r()(n,"toast",""),r()(n,"tableLoading",!1),r()(n,"pageItem",20),n},methods:{search:function(){this.getTableData()},exportExcel:function(){$("#exportForm").submit()},depChangeClick:function(){var t=this;this.transferState=!this.transferState,this.depExpandedKeys=[],this.classExpandedKeys=[],this.treeData.length>0&&this.treeData.forEach(function(e){t.depExpandedKeys.push(e.id)})},selectDeparment:function(t){if(105==t.group){var e=this.getClassName(this.treeData,t.id);this.deparment=e,this.depId=t.id,this.onAll="",this.currentPage=1,this.getTableData()}else this.$message({showClose:!0,message:"请选择班级",type:"warning",duration:this.msgDuration});this.transferState=!1},getClassName:function(t,e,n){function a(t,e){for(var l=0;l<t.length;l++)if(t[l].children instanceof Array)if(t[l].children.length>0){for(var s=0;s<t[l].children.length;s++)0==t[l].children[s].children.length&&t[l].children[s].id==e&&104==t[l].group&&(i=t[l].label);a(t[l].children,e)}else t[l].id==e&&105==t[l].group&&(o=t[l].label,n&&(r.oneNameId=t[l].id));return-1}var o="",r=this,i="";return a(t,e),o=i+" "+o},selectAll:function(t){this.onAll=1,this.deparment="",this.getTableData()},selectToday:function(t){this.onTime=1,this.daterange=[],this.getTableData()},changeDateRange:function(t){this.onTime="",this.getTableData()},getTableData:function(){var t=this,e=void 0;if(1==this.onTime){var n=(new Date).getFullYear(),a=(new Date).getMonth()+1;a=a<10?"0"+a:a;var o=(new Date).getDate();o=o<10?"0"+o:o;var r=(new Date).getHours();r=r<10?"0"+r:r;var i=(new Date).getMinutes();i=i<10?"0"+i:i;var l=(new Date).getSeconds();l=l<10?"0"+l:l;e=[n+"-"+a+"-"+o+" 00:00:00",n+"-"+a+"-"+o+" 23:59:59"]}else e=this.daterange;var s={count:!0,page_index:this.currentPage,page_size:this.pageItem,beginDate:e[0],endDate:e[1],depStr:1==this.onAll?"":this.depId,userNameLike:this.mySearch};this.tableLoading=!0,this.$api.DataCount.studentInRecord(s).then(function(e){if(t.tableLoading=!1,600==e.data.code||0==e.data.code){null!=e.data.data?t.allNum=e.data.data.total_record:t.allNum=0,t.tableData=e.data.data.records,t.getSpanArr(t.tableData);for(var n=0,a=0;a<t.tableData.length;a++)0===a?n=1:t.tableData[a].userNo!=t.tableData[a-1].userNo&&(n+=1),t.$set(t.tableData[a],"indexID",(t.currentPage-1)*t.pageItem+1*n)}else t.allNum=0,t.isToast=!0,t.toast=e.data.msg}).catch(function(e){t.allNum=0,t.tableLoading=!1})},loadStructure:function(){var t=this,e={schoolId:localStorage.getItem("schoolId")};this.$api.Common.getTreeListStudent(e).then(function(e){600==e.data.code?t.treeData=e.data.data:(t.isToast=!0,t.toast=e.data.msg)})},objectSpanMethod:function(t){var e=(t.row,t.column,t.rowIndex);if(t.columnIndex<=3){var n=this.spanArr[e];return{rowspan:n,colspan:n>0?1:0}}},getSpanArr:function(t){this.spanArr=[];for(var e=0;e<t.length;e++)0==e?(this.spanArr.push(1),this.pos=0):t[e].userNo==t[e-1].userNo&&t[e].recordTime.substring(0,10)==t[e-1].recordTime.substring(0,10)?(this.spanArr[this.pos]+=1,this.spanArr.push(0)):(this.spanArr.push(1),this.pos=e)},handleSelectionChange:function(t){this.multipleSelection=t},toggleSelection:function(t){this.$refs.multipleTable.toggleRowSelection(t)},handleSizeChange:function(t){this.pageItem=t,this.currentPage=1,this.changePage(this.pageItem,this.currentPage)},handleCurrentChange:function(t){this.currentPage=t,this.getTableData()},hideToast:function(){this.isToast=!1}},mounted:function(){setTimeout(function(){var t=$(".index > .m-cen").height(),e=$(".turn-top").height(),n=$(".operate-box").height(),a=$(".pagination-box").height(),o=t-e-n-a-15;$(".table-box").height(o)},15);var t=this;document.body.onclick=function(e){0==$(e.target).closest(".deparment").length&&(t.transferState=!1)},this.getTableData(),this.loadStructure()}},d=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"turnover"},[a("div",{staticClass:"turn-top"},[a("div",{staticClass:"turn-box"},[a("span",[t._v("时间范围：")]),t._v(" "),a("el-button",{class:{on:1==t.onTime},attrs:{type:"text"},on:{click:t.selectToday}},[t._v("今天")]),t._v(" "),a("el-date-picker",{attrs:{type:"datetimerange","range-separator":"至","start-placeholder":"开始日期","end-placeholder":"结束日期","value-format":"yyyy-MM-dd HH:mm:ss","default-time":["00:00:00","23:59:59"]},on:{change:t.changeDateRange},model:{value:t.daterange,callback:function(e){t.daterange=e},expression:"daterange"}})],1),t._v(" "),a("div",{staticClass:"turn-box"},[a("span",[t._v("学生范围：")]),t._v(" "),a("el-button",{class:{on:1==t.onAll},attrs:{type:"text"},on:{click:t.selectAll}},[t._v("全部")]),t._v(" "),a("div",{staticClass:"deparment transfer-content"},[a("div",{staticClass:"transfer-top",on:{click:t.depChangeClick}},[a("span",[t._v(t._s(t.deparment))]),t._v(" "),a("img",{class:{"arrow-up":t.transferState},attrs:{src:n("0+L1"),alt:""}})]),t._v(" "),t.transferState?a("div",{staticClass:"inner-tree"},[a("el-tree",{attrs:{data:t.treeData,props:t.defaultProps,"node-key":"id","default-expanded-keys":t.depExpandedKeys,"expand-on-click-node":!1},on:{"node-click":t.selectDeparment}})],1):t._e()])],1)]),t._v(" "),a("div",{staticClass:"turn-bottom"},[a("div",{staticClass:"operate-box"},[a("span",[t._v(t._s(t.allNum)+"位学生")]),t._v(" "),a("div",{staticClass:"search-box"},[a("el-input",{attrs:{size:"small",placeholder:"请输入姓名或者学号"},on:{change:t.search},model:{value:t.mySearch,callback:function(e){t.mySearch=e},expression:"mySearch"}},[a("i",{staticClass:"el-input__icon el-icon-search",attrs:{slot:"suffix"},on:{click:t.search},slot:"suffix"})])],1)]),t._v(" "),a("div",{staticClass:"table-box"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.tableLoading,expression:"tableLoading"}],ref:"multipleTable",staticStyle:{width:"100%"},attrs:{id:"table",height:"100%",data:t.tableData,border:"","highlight-current-row":"","span-method":t.objectSpanMethod},on:{"row-click":t.toggleSelection,"selection-change":t.handleSelectionChange}},[t.showIndex?a("el-table-column",{attrs:{prop:"deviceinfo_id"}}):t._e(),t._v(" "),a("el-table-column",{attrs:{prop:"userName",label:"姓名",align:"center","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"userNo",label:"学号",align:"center","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"className",label:"班级",align:"center","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"recordTime",label:"签到日期",align:"center","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.recordTime?a("span",[t._v("\n                            "+t._s(e.row.recordTime.substring(0,10))+"\n                        ")]):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"recordTime",label:"签到时间",align:"center","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.recordTime?a("span",[t._v("\n                            "+t._s(e.row.recordTime.substring(e.row.recordTime.lastIndexOf(" ")+1,e.row.recordTime.lastIndexOf(" ").length))+"\n                        ")]):t._e()]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"placeName",label:"签到楼宇",align:"center","show-overflow-tooltip":""}}),t._v(" "),a("el-table-column",{attrs:{prop:"dicFmtMap",label:"进出方向",align:"center","show-overflow-tooltip":""},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.dicFmtMap.customDirectioncn?a("span",[t._v(t._s(e.row.dicFmtMap.customDirectioncn))]):a("span",[t._v("——")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"photoPath",label:"照片抓拍"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.photoPath?a("el-popover",{attrs:{trigger:"hover",placement:"bottom"}},[a("img",{staticStyle:{width:"auto"},attrs:{src:t.uploadPicUrl+e.row.photoPath+"?imageView2/1/w/480/h/270",onerror:t.defaultErrImg}}),t._v(" "),a("div",{staticClass:"name-wrapper",attrs:{slot:"reference"},slot:"reference"},[a("el-tag",{staticStyle:{background:"none",color:"#1cab7d",border:"none"},attrs:{size:"medium"}},[t._v("查看")])],1)]):a("span",[t._v("无")])]}}])})],1)],1),t._v(" "),a("div",{staticClass:"pagination-box"},[a("el-pagination",{attrs:{background:"",layout:" prev, pager, next",total:t.allNum,"page-size":t.pageItem,"current-page":t.currentPage},on:{"update:currentPage":function(e){t.currentPage=e},"update:current-page":function(e){t.currentPage=e},"current-change":t.handleCurrentChange}})],1)]),t._v(" "),t.isToast?a("Toast",{attrs:{"modal-title":t.toast,duration:"1000"},on:{toastCancel:t.hideToast}}):t._e()],1)},c=[],p={render:d,staticRenderFns:c},u=p,h=n("VU/8"),g=a,f=h(s,u,!1,g,"data-v-d397fc48",null);e.default=f.exports},VQZJ:function(t,e,n){e=t.exports=n("FZ+f")(!1),e.push([t.i,"\n.turnover[data-v-d397fc48] {\n  width: 100%;\n  height: 100%;\n  margin: 0 auto;\n}\n.turnover .turn-top[data-v-d397fc48] {\n    width: 100%;\n    height: auto;\n    background: #fff;\n    margin-bottom: 15px;\n    padding: 0 35px;\n}\n.turnover .turn-top .turn-box[data-v-d397fc48] {\n      width: 100%;\n      height: 50px;\n      border-bottom: 1px solid #E1E1E1;\n      line-height: 50px;\n      font-size: 12px;\n      color: #333;\n}\n.turnover .turn-top .turn-box span[data-v-d397fc48] {\n        margin: 0 20px;\n        margin-left: 0;\n}\n.turnover .turn-top .turn-box button[data-v-d397fc48] {\n        color: #AAAAAA;\n}\n.turnover .turn-top .turn-box button.on[data-v-d397fc48] {\n        color: #333;\n}\n.turnover .turn-top .turn-box[data-v-d397fc48] .el-date-editor {\n        margin: 0 20px;\n}\n.turnover .turn-top .turn-box[data-v-d397fc48] .el-date-editor span {\n          margin: 0;\n}\n.turnover .turn-top .turn-box[data-v-d397fc48] .el-date-editor input:focus {\n          border: 0 !important;\n}\n.turnover .turn-top .turn-box .el-select .el-input input[data-v-d397fc48] {\n        height: 40px !important;\n}\n.turnover .turn-top .turn-box .el-select .el-input span[data-v-d397fc48] {\n        margin: 0;\n}\n.turnover .turn-top .turn-box .transfer-content[data-v-d397fc48] {\n        height: auto !important;\n        min-height: 0 !important;\n        text-align: center;\n        display: inline-block !important;\n        position: relative;\n        margin-left: 20px;\n        vertical-align: middle;\n}\n.turnover .turn-top .turn-box .transfer-content .transfer-top[data-v-d397fc48] {\n          width: 123px;\n          height: 40px;\n          line-height: 40px;\n          position: relative;\n          margin-bottom: 3px;\n          padding-left: 15px;\n          border-radius: 5px;\n          border: 1px solid #E5E5E5;\n          text-align: left;\n          cursor: pointer;\n          background: #fff;\n}\n.turnover .turn-top .turn-box .transfer-content .transfer-top span[data-v-d397fc48] {\n            font-size: 12px;\n            display: inline-block;\n            width: 75px;\n            overflow: hidden;\n            white-space: nowrap;\n}\n.turnover .turn-top .turn-box .transfer-content .transfer-top img[data-v-d397fc48] {\n            position: absolute;\n            top: 0;\n            bottom: 0;\n            right: 12px;\n            margin: auto;\n            -webkit-transition: 0.3s;\n            transition: 0.3s;\n            width: 12px;\n}\n.turnover .turn-top .turn-box .transfer-content .transfer-top .arrow-up[data-v-d397fc48] {\n            -webkit-transform: rotate(-180deg);\n            transform: rotate(-180deg);\n}\n.turnover .turn-top .turn-box .transfer-content .inner-tree[data-v-d397fc48] {\n          width: 150px;\n          width: auto;\n          min-width: 123px;\n          height: auto;\n          max-height: 250px;\n          overflow-y: auto;\n          padding: 15px 10px;\n          background: #fff;\n          position: absolute;\n          top: 50px;\n          left: 0px;\n          z-index: 20;\n          border: 1px solid #E1E1E1;\n          border-radius: 5px;\n          -webkit-box-sizing: content-box;\n          box-sizing: content-box;\n}\n.turnover .turn-top .turn-box[data-v-d397fc48]:last-child {\n        border: 0;\n}\n.turnover .turn-bottom[data-v-d397fc48] {\n    width: 100%;\n    height: auto;\n    background: #fff;\n}\n.turnover .turn-bottom .operate-box[data-v-d397fc48] {\n      width: 100%;\n      height: 60px;\n      line-height: 60px;\n      -webkit-box-sizing: content-box;\n              box-sizing: content-box;\n      border-bottom: 1px solid #e1e1e1;\n}\n.turnover .turn-bottom .operate-box span[data-v-d397fc48] {\n        font-size: 18px;\n        font-weight: bold;\n        color: #333;\n        margin-left: 35px;\n}\n.turnover .turn-bottom .operate-box .exportBtn[data-v-d397fc48] {\n        width: 90px;\n        margin: 5px 20px;\n        background: #F5F6F5 !important;\n        border: 1px solid #E6E6E6 !important;\n        color: #333;\n}\n.turnover .turn-bottom .operate-box .exportBtn[data-v-d397fc48]:hover {\n        background: #1cab7d !important;\n        color: #fff !important;\n}\n.turnover .turn-bottom .operate-box .search-box[data-v-d397fc48] {\n        width: 200px;\n        height: 36px;\n        float: right;\n        margin: 0px 80px 0px 20px;\n        margin-right: 10px;\n        background: #fff;\n        position: relative;\n}\n.turnover .turn-bottom .operate-box .search-box .el-input i[data-v-d397fc48] {\n          cursor: pointer;\n}\n.turnover .turn-bottom .operate-box #exportForm[data-v-d397fc48] {\n        display: none;\n}\n.turnover .turn-bottom .table-box .el-table[data-v-d397fc48] {\n      border-left: 0;\n      border-right: 0;\n}\n.turnover .turn-bottom .pagination-box[data-v-d397fc48] {\n      width: 100%;\n      height: 60px;\n      background: #fff;\n      -webkit-box-sizing: content-box;\n              box-sizing: content-box;\n}\n.turnover .turn-bottom .pagination-box .el-pagination[data-v-d397fc48] {\n        padding-top: 15px;\n}\n.el-popover[data-v-d397fc48] {\n  padding: 36px 50px 16px;\n}\n.el-popover .user-box[data-v-d397fc48] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n    -webkit-box-orient: horizontal;\n    -webkit-box-direction: normal;\n        -ms-flex-direction: row;\n            flex-direction: row;\n    border-bottom: 1px solid #EEEEEE;\n}\n.el-popover .user-box dl[data-v-d397fc48] {\n      width: 140px;\n      height: 240px;\n      margin-right: 50px;\n}\n.el-popover .user-box dl dt[data-v-d397fc48] {\n        height: 175px;\n        margin-bottom: 8px;\n}\n.el-popover .user-box dl dt img[data-v-d397fc48] {\n          width: 100%;\n          height: 100%;\n}\n.el-popover .user-box dl dd[data-v-d397fc48] {\n        font-size: 12px;\n        line-height: 25px;\n        text-align: center;\n}\n.el-popover .user-box dl[data-v-d397fc48]:nth-of-type(2) {\n      margin-right: 0;\n}\n.el-popover p[data-v-d397fc48] {\n    line-height: 40px;\n    font-size: 12px;\n}\n.el-popover p span[data-v-d397fc48]:nth-of-type(2) {\n      margin-left: 30px;\n}\n.el-popover img[data-v-d397fc48] {\n    width: auto !important;\n}\n",""])},vPaX:function(t,e,n){var a=n("VQZJ");"string"==typeof a&&(a=[[t.i,a,""]]),a.locals&&(t.exports=a.locals);n("rjj0")("289ec6e8",a,!0,{})}});