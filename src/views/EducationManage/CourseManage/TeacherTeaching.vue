<template>
  <div class="teacher-teaching">
    <div class="m-left">
      <h4>教职工档案</h4>
      <div class="inner">
        <el-input placeholder="请输入姓名或工号" v-model="filterText" size="small"></el-input>
        <el-tree :data="treeData" ref="tree" node-key="id" default-expand-all
          :check-on-click-node="true" :filter-node-method="filterNode" @node-click="handleNodeClick"
        >
          <span class="span" :ref="data.id" slot-scope="{ node, data }" :title="'工号：'+data.userNo">
            {{data.label}}
            <!-- <span v-show="data.group == 104">{{data.label}}</span> -->
          </span>
        </el-tree>
      </div>
    </div>
    <div class="m-right">
      <div class="teaching-top">
        <dd>排课周期：</dd>
        <el-select v-model="yearid" placeholder="请选择学年" size="medium" style="width:270px;" @change="changeYear">
          <el-option v-for="item in yearData" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <Button :title="saveShow?'保存':'编辑'" :btnClass="saveShow?'custom8':'custom6'" btnFontSize="12px" @click="editSave"></Button>
        <Button title="复制教师课表" btnClass="custom6" btnFontSize="12px" @click="copyClick"></Button>
        <el-upload class="upload-demo" ref="upload" name="excel"
          :action="`${this.serverUrl}/edu/importTeaching`"
          :data="uploadParams"
          :show-file-list="false"
          :on-change="changeUpload"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <Button title="导入" btnClass="custom6" btnFontSize="12px"></Button>
        </el-upload>
        <Button title="导出" btnClass="custom6" btnFontSize="12px" @click=""></Button>
      </div>
      <div class="table-box">
        <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark"
          highlight-current-row style="width: 100%" @cell-click="cellClick" v-loading="tableLoading">
          <el-table-column fixed="left" label="班级教师课程" align="center" prop="className" min-width="160"></el-table-column>
          <el-table-column :prop="'subjectName'+course.subjectid" min-width="100" :label="course.subjectName" show-overflow-tooltip
            v-for="(course, index) of courseData"
            :key="index"
          >
            <template slot-scope="scope">
              <dd>{{scope.row['subjectName'+course.subjectid+'teacherName']}}</dd>
              <i
                class="iconfont icon-chuyidong"
                v-show="saveShow && scope.row['subjectName'+course.subjectid+'teacherName'] != ''"
                @click.stop="delTeacher(scope.row,'subjectName'+course.subjectid)"
              ></i>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 复制课表 -->
    <el-dialog title="复制课表" :visible.sync="copyShow" width="700px" center class="member-dialog">
      <div class="content">
        <el-form ref="copyForm" label-width="100px" :model="copyForm">
          <el-form-item label="选择课表：" prop="yearid">
            <el-select v-model="copyForm.yearid" placeholder="请选择学年" size="medium" style="width:270px;">
              <el-option
                v-for="item in yearData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                :disabled="item.id == yearid"
              > </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="copyShow = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveCopyClick"></Button>
      </span>
    </el-dialog>
    <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
  </div>
</template>

<script>
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";
import Base from "@/api/base";

export default {
  name: "TeacherTeaching",
  components: {
    Button,
    Toast
  },
  data() {
    return {
      defArrow: this.$store.state.Common.defaultLineArrow, //右侧导航默认箭头
      isToast: false, //toast是否展示
      toast: "", //toast提示内容
      tableLoading: false, //表格loading
      filterText: "", //树筛选
      treeData: [
        {
          id: 1000,
          pid: 101,
          label: "烟台一中",
          group: 102,
          isLeaf: 0,
          isSystem: 0,
          children: [
            {
              id: 10000,
              pid: 1000,
              label: "初中校区",
              group: 103,
              isLeaf: 0,
              isSystem: 1,
              children: [
                {
                  id: 10010,
                  pid: 10000,
                  label: "校门口",
                  group: 104,
                  isLeaf: 1,
                  isSystem: 1,
                  children: []
                },
                {
                  id: 10011,
                  pid: 10000,
                  label: "传达室",
                  group: 104,
                  isLeaf: 1,
                  isSystem: 1,
                  children: []
                },
                {
                  id: 10012,
                  pid: 10000,
                  label: "教学楼",
                  group: 104,
                  isLeaf: 1,
                  isSystem: 1,
                  children: []
                }
              ]
            },
            {
              id: 10001,
              pid: 1000,
              label: "高中校区",
              group: 103,
              isLeaf: 0,
              isSystem: 0,
              children: [
                {
                  id: 10020,
                  pid: 10001,
                  label: "校门口",
                  group: 104,
                  isLeaf: 1,
                  isSystem: 0,
                  children: []
                },
                {
                  id: 10021,
                  pid: 10001,
                  label: "传达室",
                  group: 104,
                  isLeaf: 1,
                  isSystem: 0,
                  children: []
                },
                {
                  id: 10022,
                  pid: 10001,
                  label: "教学楼",
                  group: 104,
                  isLeaf: 1,
                  isSystem: 0,
                  children: []
                }
              ]
            }
          ]
        }
      ],
      yearid: "", //选中的学年
      yearData: [], //排课周期下拉列表数据
      checkedObj: {}, //左侧选中的名字
      courseData: [
        // {
        // 	subjectName:'语文',
        // 	key:'chinese',
        // 	subjectid:1,
        // },
        // {
        // 	subjectName:'数学',
        // 	key:'math',
        // 	subjectid:2,
        // },
        // {
        // 	subjectName:'英语',
        // 	key:'english',
        // 	subjectid:3,
        // },
      ],
      tableData: [
        // {
        // 	id:1,
        // 	className:'初一一班',
        // 	chinese:'语文',
        // 	chineseid:'1',
        // 	math:'数学',
        // 	mathid:'2',
        // 	english:'',
        // 	englishid:'3',
        // },
        // {
        // 	id:2,
        // 	className:'初一er班',
        // 	chinese:'语文1',
        // 	chineseid:'1',
        // 	math:'',
        // 	mathid:'2',
        // 	english:'英语1',
        // 	englishid:'3',
        // },
        // {
        // 	id:3,
        // 	className:'初一san班',
        // 	chinese:'',
        // 	chineseid:'1',
        // 	math:'数学2',
        // 	mathid:'2',
        // 	english:'英语2',
        // 	englishid:'3',
        // },
      ],
      classData: [
        // {
        // 	className:'初一一班',
        // 	classId:'1',
        // 	courseData:[
        // 		{
        // 			subjectName:'数学',
        // 			key:'math',
        // 			subjectid:2,
        // 		},
        // 		{
        // 			subjectName:'英语',
        // 			key:'english',
        // 			subjectid:3,
        // 		}
        // 	]
        // },
        // {
        // 	className:'初一er班',
        // 	classId:'2',
        // 	courseData:[
        // 		{
        // 			subjectName:'语文',
        // 			key:'chinese',
        // 			subjectid:1,
        // 		},
        // 		{
        // 			subjectName:'数学',
        // 			key:'math',
        // 			subjectid:2,
        // 		},
        // 		{
        // 			subjectName:'英语',
        // 			key:'english',
        // 			subjectid:3,
        // 		}
        // 	]
        // },
        // {
        // 	className:'初一san班',
        // 	classId:'3',
        // 	courseData:[
        // 		{
        // 			subjectName:'语文',
        // 			key:'chinese',
        // 			subjectid:1,
        // 		},
        // 		{
        // 			subjectName:'数学',
        // 			key:'math',
        // 			subjectid:2,
        // 		},
        // 		{
        // 			subjectName:'英语',
        // 			key:'english',
        // 			subjectid:3,
        // 		}
        // 	]
        // },
      ],
      saveShow: false, //编辑保存按钮显示
      copyShow: false, //复制按钮显示
      copyForm: {
        yearid: ""
      }, //复制课表form
      placeData: [
        {
          placeNo: "1",
          place_name: "教学楼A"
        },
        {
          placeNo: "2",
          place_name: "教学楼B"
        },
        {
          placeNo: "3",
          place_name: "教学楼C"
        },
        {
          placeNo: "4",
          place_name: "教学楼D"
        }
      ], //所属楼宇数据
      uploadParams: {
        semester_id: 3,
        school_id: localStorage.getItem("schoolId"),
        start_row: 3,
        start_col: 1
      } //上传参数
    };
  },
  methods: {
    /**
     *  @function:toast弹窗隐藏
     *  @author: cs
     *  @date:2018-12-22
     **/
    hideToast() {
      this.isToast = false;
    },
    /**
     *  @function: 重新获取宽高
     *  @author: cs
     *  @date:2018-12-22
     **/
    resizeLayout() {
      setTimeout(() => {
        let icH = $(".index > .m-cen").height();
        let etH = $(".index .education-top").height();
        let ltH = $(".index .m-left h4").height();
        let elInputH = $(".index .m-left .el-input").height();
        let ttH = $(".index .teaching-top").height();
        let tblH = icH - etH - ttH - 10;
        $(".teacher-teaching .table-box").height(tblH);
        console.log(66, icH, etH, ttH, tblH);
        // console.log(66, icH,etH,ltH)
        let leftTreeH = icH - etH - ltH - elInputH - 30;
        $(".teacher-teaching .m-left .inner .el-tree").height(leftTreeH);
      }, 50);
    },
    /**
     *  @function: 树形图点击
     *  @author: cs
     *  @date 2018-07-10
     */
    filterNode(value, data) {
      if (!value) return true;
      return (
        String(data.id).indexOf(value) !== -1 ||
        data.label.indexOf(value) !== -1
      );
    },
    /**
     *  @function: 左侧树点击
     *  @author: cs
     *  @date 2018-12-05
     **/
    handleNodeClick(data, node) {
      console.log(data, node);
      // if(data.group == 104){
      // 	$('.span').removeClass('custom-tree-node')
      // 	this.$refs[data.id].classList.add("custom-tree-node");
      // 	this.checkedObj = data;
      // 	console.log(this.checkedObj.label);
      // }
      if (data.isTeacher == 1) {
        $(".span").removeClass("custom-tree-node");
        this.$refs[data.id].classList.add("custom-tree-node");
        this.checkedObj = data;
        console.log(this.checkedObj.label);
      }
    },
    /**
     *  @function: 单元格点击--新增教师排课
     *  @author: cs
     *  @date 2018-12-24
     **/
    cellClick(row, column, cell, event) {
      // console.log(row, column, cell, event);
      console.log("=====",row,!this.saveShow,JSON.stringify(this.checkedObj),column.property);
      if (!this.saveShow) return;
      if (JSON.stringify(this.checkedObj) == "{}") return;
      if (column.property == "className") return;
      let index = "";
      this.tableData.forEach((item, i) => {
        if (item.classid == row.classid) {
          index = i;
          return;
        }
      });

      if (this.checkedObj.label != row[column.property + "teacherName"]) {
        row[column.property + "teacherName"] = this.checkedObj.label; // 左侧不等于表格值时将表格赋值为左侧
        row[column.property + "teacherid"] = this.checkedObj.id; // 左侧不等于表格值时将表格赋值为左侧
      } else {
        if (
          row[column.property] != this.copyTableData[index][column.property]
        ) {
          // 判断当前表格值跟原值是否相同，不相同则将原值赋给表格中的值
          row[column.property] = this.copyTableData[index][column.property];
        }
      }
      cell.classList.add("add-teacher"); //改变颜色
      console.log(row,column,cell,event,row[column.property],this.copyTableData[index][column.property]
      );
    },
    /**
     *  @function: 删除排课
     *  @author: cs
     *  @date 2018-12-24
     **/
    delTeacher(row, key) {
      console.log(row, key);
      row[key + "teacherName"] = "";
    },
    /**
     *  @function: 表格行点击
     *  @author: cs
     *  @date 2018-12-24
     **/
    customClick(classname, index, item, idx) {
      console.log("表格行点击:", classname, index, item, idx);
    },
    /**
     *  @function: 编辑保存
     *  @author: cs
     *  @date 2018-12-25
     **/
    editSave() {
      this.saveShow = !this.saveShow;
      if (this.saveShow) {
        console.log("编辑:");
        this.copyTableData = JSON.parse(JSON.stringify(this.tableData));
      } else {
        console.log("保存:", this.tableData);
        let subjectArr = []; //给后台参数
        for (let i = 0; i < this.tableData.length; i++) {
          for (let k = 0; k < this.courseData.length; k++) {
            // console.log(999,'subjectName'+this.courseData[k].subjectid,this.tableData[i]['subjectName'+this.courseData[k].subjectid+'teacherName']);
            if (
              this.tableData[i][
                "subjectName" + this.courseData[k].subjectid + "teacherName"
              ]
            ) {
              console.log(999999, this.tableData[i]);
              subjectArr.push({
                // classid:this.courseData[k].subjectid,//班级id
                classid: this.tableData[i].classid, //班级id
                subjectid: this.courseData[k].subjectid, //科目id
                // subjectName:this.courseData[k].subjectName,//科目名称
                teacherid: this.tableData[i][
                  "subjectName" + this.courseData[k].subjectid + "teacherid"
                ] //教师id
                // teacherName:this.tableData[i]['subjectName'+this.courseData[k].subjectid],//教师名称
              });
            }
          }
        }
        console.log("subjectArr", subjectArr);
        this.putTeaching(subjectArr); //修改教师任课信息
      }
    },
    /**
     *  @function: 复制课表点击
     *  @author: cs
     *  @date 2018-12-25
     **/
    copyClick() {
      console.log("复制课表点击:");
      this.getTeachingList("copy");
    },
    /**
     *  @function: 复制课表保存
     *  @author: cs
     *  @date 2018-12-25
     **/
    saveCopyClick() {
      console.log("复制课表保存:");
      this.copyShow = false;
      let params = {
        currentid: this.yearid,
        copyid: this.copyForm.yearid,
        schoolid: localStorage.getItem("schoolId")
      };
      console.log(params);
      this.$loading();
      this.$api.EducationManage.copyTeaching("post", params)
        .then(res => {
          console.log("复制课表保存", res.data);
          this.$loading().close();
          if (res.data.code == 600 || res.data.code == 0) {
            this.getTeaching(this.yearid);
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.$loading().close();
        });
    },
    /**
     *  @function: 上传之前验证
     *  @author: cs
     *  @date 2018-12-14
     */
    beforeUpload(file) {
      console.log("上传之前验证:", file);
      const filePath = file.name.toLowerCase().split(".");
      let fileType = [];
      let isExcel = false;
      let excelType = "xlsx xls";
      if (filePath.length > 0) {
        fileType = filePath[filePath.length - 1]; //获得文件结尾的类型
        isExcel = excelType.indexOf(fileType) > -1;
      }
      console.log(fileType, isExcel);
      if (!isExcel) {
        this.$message({
          showClose: true,
          type: "warning",
          message: "只能上传elcel表格!",
          duration: this.msgDuration
        });
        return false;
      }
    },
    /**
     *  @function: 添加文件、上传成功和上传失败
     *  @author: cs
     *  @date 2018-12-14
     */
    changeUpload(file, fileList) {
      console.log("文件状态改变时", file, fileList);
    },
    /**
     *  @function: 上传成功
     *  @author: cs
     *  @date 2018-12-14
     */
    uploadSuccess(response, file, fileList) {
      console.log("上传成功", response, file, fileList);
      this.uploadSuccessDialog = true;
      // this.$refs.upload.clearFiles();
      // this.uploadDialog = false;
    },
    /**
     *  @function: 上传失败
     *  @author: cs
     *  @date 2018-12-14
     */
    uploadError(err, file, fileList) {
      console.log("上传失败", err, file, fileList);
    },

    /**
     *  @function: 获取教师任课排课周期列表
     *  @author: ly
     *  @date 2019-01-25
     */
    getTeachingList(copy) {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getTeachingList("get", params)
        .then(res => {
          console.log("教师任课排课周期下拉列表数据", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.yearData = res.data.data;
            if (copy) {
              this.copyShow = true;
              this.copyForm = {
                yearid: "" //学年id
              };
              setTimeout(() => {
                this.$refs.copyForm.resetFields();
              }, 20);
              return;
            }
            if (this.yearData.length > 0) {
              this.yearid = this.yearData[0].id;
              //取教师任课信息数据
              this.getTeaching(this.yearid);
            }
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {});
    },
    /**
     *  @function: 获取 教师任课教职工档案结构
     *  @author: ly
     *  @date 2019-01-25
     */
    getTeachingClassList() {
      let params = {
        school_id: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getTeachingClassList("get", params)
        .then(res => {
          console.log("教师任课教职工档案数据", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.treeData = res.data.data;
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {});
    },
    /**
     *  @function: 获取 获取教师任课信息--table
     *  @author: ly
     *  @date 2019-01-25
     */
    getTeaching(yearid) {
      // let params = {
      //     "timeTableid": yearid,
      //     "schoolid": localStorage.getItem('schoolId')
      // };
      let params = {
        timeTableid: yearid,
        schoolid: localStorage.getItem("schoolId")
      };
      console.log("params:", params);
      this.$api.EducationManage.getTeaching("get", params)
        .then(res => {
          console.log("获取教师任课信息数据", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            res.data.data.subject.forEach(item => {
              item["subjectName" + item.subjectid] = item.subjectName;
              // console.log(item,'subjectName'+item.subjectid);
            });
            this.courseData = res.data.data.subject;
            res.data.data.table.forEach(item => {
              this.courseData.forEach(title => {
                // item['cellid'] = cell.id;
                item["subjectName" + title.subjectid] = "";
                item["subjectName" + title.subjectid + "id"] = 0;
                item["subjectName" + title.subjectid + "teacherid"] = 0;
                item["subjectName" + title.subjectid + "teacherName"] = "";
              });
              item.row.forEach(cell => {
                item["cellid"] = cell.id;
                item["subjectName" + cell.subjectid] = cell.subjectName;
                item["subjectName" + cell.subjectid + "id"] = cell.subjectid;
                item["subjectName" + cell.subjectid + "teacherid"] = cell.teacherid;
                item["subjectName" + cell.subjectid + "teacherName"] = cell.teacherName;
              });
            });
            this.tableData = res.data.data.table;
            console.log(" this.tableData", this.tableData);
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {});
    },
    /**
     *  @function: 修改教师任课信息--table
     *  @author: ly
     *  @date 2019-01-25
     */
    putTeaching(data) {
      // let id = 1;
      let params = {
        schoolid: localStorage.getItem("schoolId"),
        data: data
      };
      this.$api.EducationManage.putTeaching(params, this.yearid)
        .then(res => {
          console.log("修改教师任课信息", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            $(".add-teacher").removeClass("add-teacher"); //去除新增样式
            this.getTeaching(this.yearid);
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {});
    },
    /**
     *  @function: 根据排课周期下拉查询教师任课信息--table
     *  @author: ly
     *  @date 2019-01-25
     */
    changeYear(val) {
      console.log("根据排课周期下拉查询教师任课信息--table", val);
      this.getTeaching(val);
    },
    /**
     *  @function: 获取左侧树的数据(部门)
     *  @author: cs-l
     *  @date 2018-7-31
     **/
    getTreeData() {
      let params = {
        school_id: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getTeachingClassList("get", params).then(
        res => {
          console.log("教师数据", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.treeData = res.data.data;
            console.log("treeData", this.treeData);

            // this.resizeInputWidth();//重定义input宽
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        }
      );
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    //权限id数组
    this.roleActions = this.$store.state.Common.roleActions;
    this.serverUrl = Base.bd;
    this.resizeLayout(); //重新获取宽高
  },
  created() {
    // 取教师列表数据
    this.getTreeData();
    //获取教师任课排课周期列表--取教师任课信息数据
    this.getTeachingList();
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.teacher-teaching {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  display: flex;
  .m-left {
    flex-basis: 330px;
    min-width: 330px;
    text-align: center;
    background-color: #fff;
    font-size: 12px;
    overflow: hidden;
    h4 {
      width: 100%;
      height: 60px;
      line-height: 60px;
      font-size: 18px;
      font-weight: bold;
      color: #666;
      text-align: left;
      padding-left: 30px;
      border-bottom: 1px solid #e1e1e1;
      border-right: 1px solid #e1e1e1;
      background-color: #eff3f6;
    }
    .inner {
      width: 100%;
      height: 100%;
      overflow: auto;
      position: relative;
      .el-input {
        width: 90%;
        margin-top: 10px;
        margin-bottom: 10px;
      }
      .span {
        padding: 5px 20px;
      }
      .el-tree {
        padding-left: 30px;
        height: 100%;
        overflow: auto;
      }
      .custom-tree-node {
        background-color: #1cab7d;
        color: #fff;
        // border-radius: 5px;
      }
    }
  }
  .m-right {
    height: auto;
    flex: 1;
    text-align: right;
    min-width: 0;
    .teaching-top {
      min-height: 60px;
      line-height: 60px;
      .upload-demo {
        display: inline-block;
      }
      dd {
        float: left;
        margin-left: 40px;
        margin-right: 10px;
        font-size: 18px;
        font-weight: bold;
      }
      .el-select {
        float: left;
      }
      .button-div {
        margin-right: 11px;
      }
    }
    .table-box {
      width: 100%;
      height: 100%;
      overflow: auto;
      .add-teacher {
        dd {
          color: #ff4e4e;
        }
      }
      .cell {
        position: relative;
        font-size: 12px;
        dd {
          // color: red;
        }
        &:hover {
          i {
            display: block;
          }
        }
        i {
          position: absolute;
          top: 0;
          right: 0;
          font-size: 20px;
          color: #ff4e4e;
          display: none;
          cursor: pointer;
        }
      }

      /* ------------ */
      .custom-table {
        text-align: center;
        .custon-top {
          height: 40px;
          line-height: 40px;
          li {
            width: 100px;
            text-align: center;
            border: 1px solid red;
          }
        }
        .custon-content {
          overflow: hidden;
          & > li {
            width: 100%;
            text-align: center;
            span {
              float: left;
            }
            overflow: hidden;
            ul {
              float: left;
              overflow: hidden;
              li {
                float: left;
                border: 1px solid red;
              }
            }
          }
        }
      }
      /* ------------ */
    }
  }
  .member-dialog {
    /deep/ .el-dialog {
      margin-top: 15vh !important;
      .el-select__input {
        display: inline !important;
        border: none !important;
      }
      .el-dialog__body {
        padding-bottom: 0 !important;
      }
      .el-form {
        text-align: left;
        .el-form-item {
          padding-bottom: 0 !important;
        }
        .el-form-item__content {
          .el-select {
            margin-right: 10px;
          }
        }
        .el-input {
          margin-right: 10px;
          margin-bottom: 10px;
        }
      }
      .button-div {
        margin-right: 20px;
      }
    }
  }
}
</style>
