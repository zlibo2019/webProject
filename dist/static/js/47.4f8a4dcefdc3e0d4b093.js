webpackJsonp([47],{NJFl:function(e,t,a){"use strict";function n(e){a("cktT")}Object.defineProperty(t,"__esModule",{value:!0});var i=a("bWJ8"),l=a("qqG0"),o={name:"ClassTimeTable",components:{Button:i.a,Toast:l.a},data:function(){return{isToast:!1,toast:"",allNum:0,currentPage:1,pageItem:20,yearid:"",yearData:[],tableListData:[],weekData:[{week:"1",title:"周一"},{week:"2",title:"周二"},{week:"3",title:"周三"},{week:"4",title:"周四"},{week:"5",title:"周五"},{week:"6",title:"周六"},{week:"7",title:"周日"}],selectWeek:5,selectWeekData:[{id:5,name:"周一~周五"},{id:7,name:"周一~周日"}],isShowTeacher:!!sessionStorage.getItem("showTeacherClass"),tableLoading:!1,checkedKeys:[],filterText:"",treeData:[{id:1e3,pid:101,label:"烟台一中",group:102,isLeaf:0,isSystem:0,children:[{id:1e4,pid:1e3,label:"初中校区",group:103,isLeaf:0,isSystem:1,children:[{id:10010,pid:1e4,label:"校门口",group:104,isLeaf:1,isSystem:1,children:[]},{id:10011,pid:1e4,label:"传达室",group:104,isLeaf:1,isSystem:1,children:[]},{id:10012,pid:1e4,label:"教学楼",group:104,isLeaf:1,isSystem:1,children:[]}]},{id:10001,pid:1e3,label:"高中校区",group:103,isLeaf:0,isSystem:0,children:[{id:10020,pid:10001,label:"校门口",group:104,isLeaf:1,isSystem:0,children:[]},{id:10021,pid:10001,label:"传达室",group:104,isLeaf:1,isSystem:0,children:[]},{id:10022,pid:10001,label:"教学楼",group:104,isLeaf:1,isSystem:0,children:[]}]}]}]}},methods:{resizeLayout:function(){setTimeout(function(){var e=$(".index > .m-cen").height(),t=$(".class-timetable .common-top").height(),a=$(".class-timetable .right-top").height(),n=$(".class-timetable .pagination-box").height(),i=e-t-20;$(".class-timetable .content-box").height(i),$(".class-timetable .el-tree").height(i-a-62),$(".class-timetable .right-content").height(i-a-n)},50)},renderProductId:function(e,t){t.column;return e("div",[e("dd","节次"),e("dd","星期")])},filterNode:function(e,t){return!e||(-1!==String(t.id).indexOf(e)||-1!==t.label.indexOf(e))},getCheckedKeys:function(){this.checkedKeys=[];for(var e=this.$refs.tree.getCheckedNodes(!0),t=0;t<e.length;t++){var a=(this.$refs.tree.getNode(e[t]),{});a.id=e[t].id,a.name=this.$refs.tree.getNode(e[t]).label,this.checkedKeys.push(a)}this.currentPage=1,this.getTableList()},getTeachingList:function(){var e=this,t={schoolid:localStorage.getItem("schoolId")};this.$api.EducationManage.getTeachingList("get",t).then(function(t){600==t.data.code||0==t.data.code?(e.yearData=t.data.data,e.yearData.length>0&&(e.yearid=e.yearData[0].id),e.getTableList()):(e.isToast=!0,e.toast=t.data.msg)})},changeYear:function(e){this.currentPage=1,this.getTableList()},getTableList:function(){var e=this,t={student:[{id:4,name:"张三"}],semester_id:1,week_length:this.selectWeek,page_index:this.currentPage,page_size:this.pageItem,school_id:localStorage.getItem("schoolId")};this.$api.DataCount.getTimetablesStudent("post",t).then(function(t){if(600==t.data.code||0==t.data.code){e.allNum=t.data.data.count;for(var a=t.data.data.data,n=0;n<a.length;n++)for(var i=0;i<a[n].detail.length;i++)for(var l=0;l<a[n].detail[i].detail.length;l++)for(var o=0;o<7;o++)a[n].detail[i].detail[l].detail[o]||(a[n].detail[i].detail[l].detail[o]={});e.tableListData=a}else e.isToast=!0,e.toast=t.data.msg})},changeWeek:function(e){this.getTableList()},showTeacher:function(e){e?sessionStorage.setItem("showTeacherClass",1):sessionStorage.removeItem("showTeacherClass")},handleCurrentChange:function(e){this.currentPage=e,this.getTableList()}},mounted:function(){this.roleActions=this.$store.state.Common.roleActions,this.resizeLayout()},created:function(){this.getTableList()}},s=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"class-timetable"},[a("div",{staticClass:"common-top"},[e._m(0),e._v(" "),a("el-select",{staticStyle:{width:"270px"},attrs:{placeholder:"请选择学年",size:"medium"},on:{change:e.changeYear},model:{value:e.yearid,callback:function(t){e.yearid=t},expression:"yearid"}},e._l(e.yearData,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1)],1),e._v(" "),a("div",{staticClass:"content-box"},[a("div",{staticClass:"m-left"},[a("h4",[e._v("选择学生")]),e._v(" "),a("div",{staticClass:"inner"},[a("el-input",{attrs:{placeholder:"请输入姓名或工号",size:"small"},model:{value:e.filterText,callback:function(t){e.filterText=t},expression:"filterText"}}),e._v(" "),a("el-tree",{ref:"tree",attrs:{data:e.treeData,"node-key":"id","show-checkbox":"","default-expand-all":"","check-on-click-node":!1,"filter-node-method":e.filterNode},on:{check:e.getCheckedKeys},scopedSlots:e._u([{key:"default",fn:function(t){var n=(t.node,t.data);return a("span",{ref:n.id,staticClass:"span",attrs:{title:"工号："+n.id}},[e._v("\n                            "+e._s(n.label)+"\n                        ")])}}])})],1)]),e._v(" "),a("div",{staticClass:"m-right"},[a("div",{staticClass:"right-top"},[a("span",{staticClass:"show-options"},[e._v("显示选项：")]),e._v(" "),a("el-select",{staticStyle:{width:"140px"},attrs:{placeholder:"请选择范围",size:"medium"},on:{change:e.changeWeek},model:{value:e.selectWeek,callback:function(t){e.selectWeek=t},expression:"selectWeek"}},e._l(e.selectWeekData,function(e){return a("el-option",{key:e.id,attrs:{label:e.name,value:e.id}})}),1),e._v(" "),a("el-checkbox",{on:{change:e.showTeacher},model:{value:e.isShowTeacher,callback:function(t){e.isShowTeacher=t},expression:"isShowTeacher"}},[e._v("显示任课教师")]),e._v(" "),a("Button",{attrs:{title:"导出",btnClass:"custom6",btnFontSize:"12px"},on:{click:function(e){}}}),e._v(" "),a("Button",{attrs:{title:"打印",btnClass:"custom8",btnFontSize:"12px"}})],1),e._v(" "),a("div",{staticClass:"right-content"},e._l(e.tableListData,function(t,n){return e.tableListData.length>0?a("div",{key:n,staticClass:"table-list"},e._l(t.detail,function(n,i){return a("div",{key:i,staticClass:"empty-box"},[a("h5",[e._v("班级教室："+e._s(t.student_name)+"课表"),a("span",[e._v("(此课表适用时间："+e._s(n.dateRange)+"）")])]),e._v(" "),a("div",{staticClass:"table-box"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.tableLoading,expression:"tableLoading"}],ref:"multipleTable",refInFor:!0,staticStyle:{width:"100%"},attrs:{id:"table",height:"100%",border:"",align:"center",data:n.detail,"tooltip-effect":"dark","highlight-current-row":""}},[a("el-table-column",{attrs:{"show-overflow-tooltip":"",width:"160",prop:"","render-header":e.renderProductId},scopedSlots:e._u([{key:"default",fn:function(t){return[t.row.detail.length>0?a("dd",[e._v(e._s(t.row.detail[0].section_name))]):e._e(),e._v(" "),t.row.detail.length>0?a("dd",[e._v(e._s(t.row.timeRange))]):e._e()]}}])}),e._v(" "),e._l(e.weekData,function(t,n){return a("el-table-column",{key:n,attrs:{prop:t.week,"min-width":"100",label:t.title,"show-overflow-tooltip":""},scopedSlots:e._u([{key:"default",fn:function(t){return[a("dd",[e._v(e._s(t.row.detail[n].subject_name))]),e._v(" "),e.isShowTeacher&&null!=t.row.detail[n].subject_teacher?a("dd",{staticClass:"teacher-name"},[e._v(e._s(t.row.detail[n].subject_teacher?t.row.detail[n].subject_teacher:"未找到任课教师"))]):e._e(),e._v(" "),e.isShowTeacher&&null==t.row.detail[n].subject_teacher?a("dd"):e._e()]}}])})})],2)],1)])}),0):e._e()}),0),e._v(" "),a("div",{staticClass:"pagination-box"},[a("el-pagination",{attrs:{background:"",layout:" prev, pager, next",total:e.allNum,"page-size":e.pageItem,"current-page":e.currentPage},on:{"update:currentPage":function(t){e.currentPage=t},"update:current-page":function(t){e.currentPage=t},"current-change":e.handleCurrentChange}})],1)])])])},r=[function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("span",{staticClass:"left-title"},[e._v("排课周期："),a("i")])}],d={render:s,staticRenderFns:r},c=d,h=a("VU/8"),g=n,b=h(o,c,!1,g,"data-v-3de5ea0a",null);t.default=b.exports},UYXh:function(e,t,a){t=e.exports=a("FZ+f")(!1),t.push([e.i,"\n.class-timetable[data-v-3de5ea0a] {\n  width: 100%;\n  height: 100%;\n}\n.class-timetable .common-top[data-v-3de5ea0a] {\n    width: 100%;\n    height: 50px;\n    line-height: 50px;\n    background-color: #fff;\n    margin-bottom: 20px;\n}\n.class-timetable .common-top .left-title[data-v-3de5ea0a] {\n      margin-left: 0;\n      margin-right: 40px;\n      width: 85px;\n      height: 50px;\n      overflow: hidden;\n      padding-left: 35px;\n      font-size: 12px;\n      color: #636363;\n}\n.class-timetable .content-box[data-v-3de5ea0a] {\n    display: -webkit-box;\n    display: -ms-flexbox;\n    display: flex;\n}\n.class-timetable .content-box .m-left[data-v-3de5ea0a] {\n      -ms-flex-preferred-size: 270px;\n          flex-basis: 270px;\n      min-width: 270px;\n      text-align: center;\n      background-color: #fff;\n      font-size: 12px;\n      overflow: hidden;\n}\n.class-timetable .content-box .m-left h4[data-v-3de5ea0a] {\n        width: 100%;\n        height: 60px;\n        line-height: 60px;\n        font-size: 18px;\n        font-weight: bold;\n        color: #666;\n        text-align: left;\n        padding-left: 30px;\n        border-bottom: 1px solid #e1e1e1;\n        border-right: 1px solid #e1e1e1;\n        background-color: #eff3f6;\n}\n.class-timetable .content-box .m-left .inner[data-v-3de5ea0a] {\n        width: 100%;\n        height: 100%;\n        overflow: auto;\n        position: relative;\n        border-right: 1px solid #e1e1e1;\n}\n.class-timetable .content-box .m-left .inner .el-input[data-v-3de5ea0a] {\n          width: 90%;\n          margin-top: 10px;\n          margin-bottom: 10px;\n}\n.class-timetable .content-box .m-left .inner .el-tree[data-v-3de5ea0a] {\n          padding-left: 30px;\n          height: 100%;\n          overflow: auto;\n}\n.class-timetable .content-box .m-right[data-v-3de5ea0a] {\n      -webkit-box-flex: 1;\n          -ms-flex: 1;\n              flex: 1;\n      min-width: 1px;\n}\n.class-timetable .content-box .m-right .right-top[data-v-3de5ea0a] {\n        width: 100%;\n        height: 60px;\n        line-height: 60px;\n        background-color: #fff;\n        border-bottom: 1px solid #e1e1e1;\n}\n.class-timetable .content-box .m-right .right-top .show-options[data-v-3de5ea0a] {\n          font-size: 14px;\n          color: #636363;\n          margin-left: 40px;\n          margin-right: 20px;\n}\n.class-timetable .content-box .m-right .right-top[data-v-3de5ea0a] .el-checkbox {\n          margin-left: 36px;\n}\n.class-timetable .content-box .m-right .right-top[data-v-3de5ea0a] .el-checkbox .el-checkbox__inner {\n            border-radius: 50% !important;\n}\n.class-timetable .content-box .m-right .right-top[data-v-3de5ea0a] .el-checkbox .el-checkbox__label {\n            color: #333 !important;\n}\n.class-timetable .content-box .m-right .right-top .button-div[data-v-3de5ea0a] {\n          float: right;\n          margin-right: 12px;\n          margin-top: 11px;\n}\n.class-timetable .content-box .m-right .right-top .button-div[data-v-3de5ea0a]:nth-of-type(2) {\n            margin-right: 55px;\n}\n.class-timetable .content-box .m-right .right-content[data-v-3de5ea0a] {\n        width: 100%;\n        height: 100%;\n        background-color: #fff;\n        padding-left: 40px;\n        padding-right: 70px;\n        overflow-y: auto;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] {\n          width: 100%;\n}\n.class-timetable .content-box .m-right .right-content .table-list h5[data-v-3de5ea0a] {\n            height: 70px;\n            line-height: 70px;\n            font-size: 18px;\n            color: #1cab7d;\n}\n.class-timetable .content-box .m-right .right-content .table-list h5 span[data-v-3de5ea0a] {\n              font-size: 14px;\n              color: #666;\n              font-weight: normal;\n              margin-left: 20px;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table {\n            font-size: 16px;\n            color: #333;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table thead tr th {\n              height: 48px !important;\n              position: relative;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table thead tr th:nth-of-type(1) .cell {\n                padding: 0;\n                width: 100%;\n                height: 100%;\n                position: relative;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table thead tr th:nth-of-type(1) .cell::after {\n                  content: '';\n                  display: block;\n                  width: 180px;\n                  height: 1px;\n                  background: #e1e1e1;\n                  -webkit-transform: rotate(17deg);\n                  transform: rotate(17deg);\n                  position: absolute;\n                  top: 24px;\n                  left: -8px;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table thead tr th:nth-of-type(1) .cell dd {\n                  display: inline-block;\n                  position: absolute;\n                  font-size: 15px;\n                  line-height: 15px;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table thead tr th:nth-of-type(1) .cell dd:nth-of-type(1) {\n                    left: 25px;\n                    top: 28px;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table thead tr th:nth-of-type(1) .cell dd:nth-of-type(2) {\n                    right: 25px;\n                    top: 10px;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table .teacher-name {\n              color: #666;\n              font-size: 12px;\n}\n.class-timetable .content-box .m-right .right-content .table-list[data-v-3de5ea0a] .el-table .no-teacher {\n              color: #ff4e4e;\n}\n.class-timetable .content-box .m-right .pagination-box[data-v-3de5ea0a] {\n        width: 100%;\n        height: 60px;\n        background: #fff;\n        -webkit-box-sizing: content-box;\n                box-sizing: content-box;\n        border-top: 1px solid #e1e1e1;\n}\n.class-timetable .content-box .m-right .pagination-box .el-pagination[data-v-3de5ea0a] {\n          padding-top: 15px;\n}\n",""])},cktT:function(e,t,a){var n=a("UYXh");"string"==typeof n&&(n=[[e.i,n,""]]),n.locals&&(e.exports=n.locals);a("rjj0")("0f9f556f",n,!0,{})}});