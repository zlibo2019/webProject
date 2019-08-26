<template>
  <div class="layout-course-term">
    <div class="m-left">
      <h4>班级信息</h4>
      <div class="inner">
        <el-input placeholder="请输入姓名或工号" v-model="filterText" size="small"></el-input>
        <el-tree
          :data="treeData"
          ref="tree"
          node-key="id"
          default-expand-all
          :check-on-click-node="true"
          :filter-node-method="filterNode"
          @node-click="handleNodeClick"
        >
          <span class="span" :ref="data.id" slot-scope="{ node, data }">
            {{data.label}} <span v-show="data.group == 104"></span>
          </span>
        </el-tree>
      </div>
    </div>
    <div class="m-right">
      <div class="teaching-top">
        <dd>排课周期：</dd>
        <el-select v-model="yearid" placeholder="请选择学年" size="medium" style="width:270px;" @change="changeYear">
          <el-option
            v-for="item in yearData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          > </el-option>
        </el-select>
        <el-upload class="upload-demo" ref="upload" name="excel"
          :action="`${this.serverUrl}edu/importTimetables`"
          :data="uploadParams"
          :show-file-list="false"
          :on-change="changeUpload"
          :before-upload="beforeUpload"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <Button title="批量导入" btnClass="custom6" btnFontSize="12px"></Button>
        </el-upload>
        <Button title="复制往期课表" btnClass="custom6" btnFontSize="12px" @click="copyClick"></Button>
        <el-dropdown  trigger="click"  @command="batchDel">
          <el-button type="primary">
            批量删除<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="school">批量删除学校排课</el-dropdown-item>
            <el-dropdown-item command="grade">批量删除年级排课</el-dropdown-item>
            <el-dropdown-item command="class">批量删除班级排课</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="course-wrap">
        <div class="course-left">
          <div class="course-left-top">
            <dd>课程名称 <span>({{ leftCourseData.length }})</span></dd>
            <img src="../../../assets/images/add_no.png" alt="" class="add-no" @click="addCourseClick">
            <img src="../../../assets/images/add_ac.png" alt="" class="add-ac" @click="addCourseClick">
          </div>
          <ul class="course-list">
            <li
              v-for="(item, index) in leftCourseData"
              :key="index"
              :class="{ac:currentCourseId == item.id}"
              @click="chooseCourse(item)"
            >
              {{item.name}}
            </li>
          </ul>
        </div>
        <div class="course-right">
          <div class="course-right-top">
            <dd>{{checkedObj.label ? checkedObj.plabel+' '+checkedObj.label+'课表':'请选择班级'}}</dd>
            <el-checkbox v-model="isShowTeacher">任课教师</el-checkbox>
            <Button :title="saveShow?'保存':'编辑'" :btnClass="saveShow?'custom8':'custom6'" btnFontSize="12px" @click="editSave"></Button>
          </div>
          <div class="table-box">
            <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark" highlight-current-row
              style="width: 100%" @cell-click="cellClick" v-loading="tableLoading"
            >
              <el-table-column show-overflow-tooltip prop="section_name" width="160" :render-header="renderProductId"></el-table-column>
              <el-table-column :prop="week.week" min-width="100" :label="week.title" show-overflow-tooltip
                v-for="(week, index) of weekData"
                :key="index"
              >
                <template slot-scope="scope">
                  <dd>{{scope.row['subject_name'+week.week]}}</dd><!-- :'未找到任课教师' -->
                  <dd v-if="isShowTeacher && scope.row['subject_name'+week.week]">{{scope.row["subject_teacher"+week.week]?scope.row["subject_teacher"+week.week]:'未找到任课教师'}}</dd>
                  <dd v-if="isShowTeacher && !scope.row['subject_name'+week.week]"></dd>
                  <i
                    class="iconfont icon-chuyidong"
                    v-show="saveShow && checkedObj.label && scope.row['subject_name'+week.week]"
                    @click.stop="delTeacher(scope.row,week.week)"
                  ></i>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="course-percent">
            <p>排课完整率：<span>{{this.totalRate}}%</span></p>
            <dl>
              <dt>已排课程节数统计 ： </dt>
              <dd
                v-for="(item, index) in totalData"
                :key="index"
              >
                {{item.name}}<span v-if="item.section_num>0">+{{item.section_num}}</span>
              </dd>
            </dl>
          </div>
        </div>
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
    <!-- 新建，修改课程 -->
    <el-dialog title="新建课程" :visible.sync="formDialog" width="560px" center class="member-dialog">
      <div class="content">
        <el-form ref="courseForm" label-width="100px" :rules="rules" :model="courseForm">
          <el-form-item label="课程名称：" prop="name">
            <el-input v-model="courseForm.name" placeholder="请输入课程名称" style="width:300px;" size="small"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
            <el-input v-model="courseForm.remarks" placeholder="请输入备注内容" type="textarea" 
              :autosize="{ minRows: 3, maxRows: 6}" style="width:300px;" size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="formDialog = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveBtnClick"></Button>
      </span>
    </el-dialog>
    <!-- 批量删除排课 -->
    <el-dialog :title="batchTitle" :visible.sync="batchDialog" width="560px" center class="batch-dialog">
        <p v-if="batchOption == 0">确定要删除当前排课周期内，学校所有班级的排课记录吗？</p>
        <p v-else-if="batchOption == 1">确定要删除当前排课周期内，当前所选年级的排课记录吗？</p>
        <p v-else-if="batchOption == 2">确定要删除当前排课周期内，当前所选班级的排课记录吗？</p>
        <dd>删除后，数据无法恢复！</dd>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="batchDialog = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="confirmBatch"></Button>
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
  name: "LayoutCourseTerm",
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
      treeData:[],
      yearid: "1", //选中的学年
      yearData: [
        // {
        //     yearid:'1',
        //     yearName:'教学楼A',
        // },{
        //     yearid:'2',
        //     yearName:'教学楼B',
        // },{
        //     yearid:'3',
        //     yearName:'教学楼C',
        // },{
        //     yearid:'4',
        //     yearName:'教学楼D',
        // }
      ], //所属楼宇数据
      checkedObj: {
        id: -1,  //选中的班级id
        label: "",
        group: 0,
        pid: -1, //选中的(父节点)年级id
        plabel: "",
        pgroup: 0,
      }, //左侧选中的名字
      weekData: [
        {
          week: "1",
          title: "周一"
        },
        {
          week: "2",
          title: "周二"
        },
        {
          week: "3",
          title: "周三"
        },
        {
          week: "4",
          title: "周四"
        },
        {
          week: "5",
          title: "周五"
        },
        {
          week: "6",
          title: "周六"
        },
        {
          week: "7",
          title: "周日"
        }
      ],
      tableData: [], //表格
      leftCourseData: [], //课程数据
      totalRate: "", //排课完整率
      totalData: [
        {
          count: 1,
          courseName: "语文1"
        },
        {
          count: 1,
          courseName: "语文2"
        },
        {
          count: 3,
          courseName: "语文3"
        },
        {
          count: 4,
          courseName: "语文4"
        },
        {
          count: 5,
          courseName: "语文5"
        },
        {
          count: 6,
          courseName: "语文6"
        }
      ], //已排课程数据
      currentCourseId: "", //当前选中的课程id
      currentCourseName: "", //当前选中的课程id
      saveShow: false, //编辑保存按钮显示
      copyShow: false, //复制按钮显示
      copyForm: {
        yearid: ""
      }, //复制课表form
      formDialog: false, //新建、修改学年/学期弹窗
      courseForm: {
        name: "", //课程名称
        remarks: "" //备注内容
      }, //新建、修改课程from
      rules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
      },
      isShowTeacher: false, //是否显示任课教师
      teacherList: [], //教师列表
      uploadParams: {
        semester_id: 0,
        school_id: localStorage.getItem("schoolId"),
        import_type: 0,
        start_row: 3,
        begin_date: "",
        end_date: ""
      }, //上传参数
      batchTitle:'',//弹窗标题
      batchDialog:false,//删除弹窗
      batchOption:0,//删除哪一项
    };
  },
  methods: {
    /**
     *  @function:节次星期对角线
     *  @author: cs
     *  @date:2018-12-22
     **/
    renderProductId(h, { column }) {
      return h("div", [h("dd", "节次"), h("dd", "星期")]);
    },
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
        let cltH = $(".index .course-left-top").height();
        let cpH = $(".index .course-percent").height();
        let tblH = icH - etH - ttH - cltH - cpH - 50;
        $(".layout-course-term .table-box").height(tblH);
        $(".layout-course-term .course-list").height(tblH + cpH + 40);
        console.log(66, icH, etH, ttH, tblH);
        // console.log(66, icH,etH,ltH)
        let leftTreeH = icH - etH - ltH - elInputH - 30;
        $(".layout-course-term .m-left .inner .el-tree").height(leftTreeH);
      }, 50);
    },
    /**
     *  @function: 树形图点击
     *  @author: cs
     *  @date 2018-07-10
     */
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
      // return String(data.id).indexOf(value) !== -1 || data.label.indexOf(value) !== -1;
    },
    /**
     *  @function: 左侧树点击
     *  @author: cs
     *  @date 2018-12-05
     **/
    handleNodeClick(data, node) {
      console.log(data,node);
      if(data.group == 105){
        // this.checkedObj = data;
        this.checkedObj.id = data.id;
        this.checkedObj.label = data.label;
        this.checkedObj.group = data.group;
        this.checkedObj.pid = node.parent.data.id;
        this.checkedObj.plabel = node.parent.data.label;
        this.checkedObj.pgroup = node.parent.data.group;  
        console.log("---checkedObj---",this.checkedObj);
      	$('.span').removeClass('custom-tree-node')
        this.$refs[data.id].classList.add("custom-tree-node");    
        this.getTimetables(); //查询排课表格            
      }
    },
    /**
     *  @function: 单元格点击--新增教师排课
     *  @author: cs
     *  @date 2018-12-24
     **/
    cellClick(row, column, cell, event) {
      if (!this.saveShow) return;
      // if(JSON.stringify(this.checkedObj) == '{}') return
      if (this.currentCourseName == "") return;
      if (column.property == "section_name") return;
      let index = "";
      this.tableData.forEach((item, i) => {
        if (item.section_name == row.section_name) {
          index = i;
          return;
        }
      });
      console.log(row, column,row[column.property]);
      // console.log("index",index,row[column.property]);
      // console.log("checkedObj.label", this.checkedObj.label, column.property, this.currentCourseName);

      if (this.currentCourseName != row["subject_name" + column.property]) {
        row["subject_name" + column.property] = this.currentCourseName; // 左侧不等于表格值时将表格赋值为左侧
      } else {
        if (
          row["subject_name" + column.property] !=
          this.copyTableData[index]["subject_name" + column.property]
        ) {
          // 判断当前表格值跟原值是否相同，不相同则将原值赋给表格中的值
          row["subject_name" + column.property] = this.copyTableData[index][
            "subject_name" + column.property
          ];
        }
      }
      cell.classList.add("add-teacher"); //改变颜色
    },
    /**
     *  @function: 删除排课
     *  @author: cs
     *  @date 2018-12-24
     **/
    delTeacher(row, key) {
      console.log(row, key);
      row["subject_name" + key] = "";
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
      // this.saveShow = !this.saveShow;
      // if (this.saveShow) {
      //   console.log("编辑:");
      //   this.copyTableData = JSON.parse(JSON.stringify(this.tableData));
      // } else {
      //   console.log("保存:", this.tableData);
      //   $(".add-teacher").removeClass("add-teacher");
      // }
      this.saveShow = !this.saveShow;
      if (this.saveShow) {
        console.log("编辑:");
        this.copyTableData = JSON.parse(JSON.stringify(this.tableData));
      } else {
        console.log("保存:", this.tableData);
        let subjectArr = []; //给后台参数
        for (let i = 0; i < this.tableData.length; i++) {
          for (let k = 1; k < 8; k++) {
            let item = {};
            item.section_name = this.tableData[i].section_name;            
            item.week = k;
            // console.log("1111:", this.tableData[i]['subject_name' + k]);
            if(this.tableData[i]['subject_name' + k]) {   
              item.subject_id = this.leftCourseData.filter(item => {
                return item.name == this.tableData[i]['subject_name' + k];
              })[0].id; 
              subjectArr.push(item);
            } else {
              // item.subject_id = 0; 
            }
          }
        }
        console.log("subjectArr", subjectArr);
        this.postTimetables(subjectArr); //新增修改排课信息
        $(".add-teacher").removeClass("add-teacher");
      }

    },
    /**
     *  @function: 复制课表点击
     *  @author: cs
     *  @date 2018-12-25
     **/
    copyClick() {
      console.log("复制课表点击:");
      this.copyShow = true;
      this.copyForm = {
        yearid: "" //学年id
      };
      setTimeout(() => {
        this.$refs.copyForm.resetFields();
      }, 20);
    },
    /**
     *  @function: 复制课表保存
     *  @author: cs
     *  @date 2018-12-25
     **/
    saveCopyClick() {
      console.log("复制课表保存:");
      this.postTimetablesCopy(); 
      this.copyShow = false;    
    },
    /**
     *  @function: 选择排课课程
     *  @author: cs
     *  @date 2019-01-08
     **/
    chooseCourse(item) {
      console.log("选择排课课程:", item);
      this.currentCourseId = item.id;
      this.currentCourseName = item.name;
    },
    /**
     *  @function:新增课程点击
     *  @author: cs
     *  @date 2018-12-05
     **/
    addCourseClick() {
      console.log("新增课程点击");
      this.formDialog = true;
      this.courseForm = {
        name: "", //课程名称
        remarks: "" //备注内容
      }; //新建、修改课程from
      setTimeout(() => {
        this.$refs.courseForm.resetFields();
      }, 20);
    },
    /**
     *  @function: 新增,修改课程->点击保存按钮
     *  @author: cs
     *  @date 2018-12-22
     **/
    saveBtnClick() {
      console.log("新增,修改课程->点击保存按钮", this.courseForm);
      this.$refs["courseForm"].validate(valid => {
        if (valid) {
          this.formDialog = false;
          console.log("addDeviceForm", this.courseForm);
          this.postCourse();
        } else {
          this.$message({
            message: "请输入内容（*为必填项）",
            type: "error",
            duration: this.msgDuration
          });
          return false;
        }
      });
    },
    /**
     *  @function: 查询排课表格
     *  @author: cs
     *  @date 2019-01-09
     */
    getTimetables() {
      if (this.checkedObj.id == -1) return;      
      let params = {
        semester_id: this.yearid,
        class_id: this.checkedObj.id,
        school_id: localStorage.getItem("schoolId")
      };
      console.log("params", params);
      this.tableData = [];
      this.$api.EducationManage.getTimetables("get", params)
        .then(res => {
          console.log("查询排课表格", res.data.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            let data = res.data.data;
            // for (let i = 0; i < data.length; i++) {
            //     let item = {};
            //     for (let k = 0; k < data[i].length; k++) {
            //         // console.log(data[i][k].subject_name);
            //         item.section_name = data[i][k].section_name;
            //         item['subject_name'+data[i][k].week] = data[i][k].subject_name;
            //         item['subject_teacher'+data[i][k].week] = data[i][k].subject_teacher;
            //     }
            //     this.tableData.push(item)
            // }

            for (let i = 0; i < data.length; i++) {
              let item = {};
              item.section_name = data[i].sectionName;
              for (let j = 0; j < this.weekData.length; j++) {
                item['subject_name'+ (j+1)] = ''
              }
              for (let k = 0; k < data[i].detail.length; k++) {
                // console.log(data[i][k].subject_name);
                item["subject_name" + data[i].detail[k].week] = data[i].detail[k].subject_name;
                // item["subject_teacher" + data[i].detail[k].week] = data[i].detail[k].subject_teacher;
                let tmpTeacher = this.teacherList.filter(item => {
                  return item.userSerial == data[i].detail[k].teacher_id;
                });
                item["subject_teacher" + data[i].detail[k].week] = tmpTeacher.length > 0 ? tmpTeacher[0].userName : "";
              }
              this.tableData.push(item);
            }
            console.log(this.tableData);
            this.postTimetablesRate(); //排课率
            this.getSectionNum(); //已排课程数量统计
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
          console.log("err:", err);
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

      this.uploadParams.semester_id = this.yearid;
      this.uploadParams.school_id = localStorage.getItem("schoolId");
      // this.uploadParams.begin_date = this.yearid;
      // this.uploadParams.end_date = this.yearid;
      console.log("uploadParams", this.uploadParams);
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
      this.getTimetables(); //查询排课表格
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
     *  @function: 获取排课学期下拉列表
     *  @author: ly
     *  @date 2019-02-16
     */
    getTimetablesSemesterList() {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.tableLoading = true;
      this.$api.EducationManage.getTimetablesSemesterList("get", params)
        .then(res => {
          console.log("获取排课学期下拉列表", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.yearData = res.data.data;
            if (this.yearData.length > 0) {
              this.yearid = this.yearData[0].id;
            }
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
          this.tableLoading = false;
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    /**
     *  @function: 获取课程数据
     *  @author: ly
     *  @date 2019-02-16
     */
    getCourse() {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.tableLoading = true;
      this.$api.EducationManage.getCourse("get", params)
        .then(res => {
          console.log("获取课程信息", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.leftCourseData = res.data.data;
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    /**
     *  @function: 新增课程信息
     *  @author: ly
     *  @date 2019-01-23
     **/
    postCourse() {
      let params = {
        name: this.courseForm.name,
        remarks: this.courseForm.remarks,
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.postCourse("post", params)
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.getCourse(); //左侧课程信息
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    /**
     *  @function: 复制课表
     *  @author: ly
     *  @date 2019-02-16
     */
    postTimetablesCopy() {
      let params = {
        origin_semester_id: this.copyForm.yearid,
        target_semester_id: this.yearid,
        school_id: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.postTimetablesCopy("post", params)
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.getTimetables();
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    /**
     *  @function: 新增、修改排课信息--table
     *  @author: ly
     *  @date 2019-01-25
     */
    postTimetables(data) {
      let params = {
        semester_id: this.yearid,
        class_id: this.checkedObj.id,
        school_id: localStorage.getItem("schoolId"),
        arr_data: data
      };
      this.$api.EducationManage.postTimetables('post', params)
        .then(res => {
          console.log("新增、修改排课信息", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            // $(".add-teacher").removeClass("add-teacher"); //去除新增样式
            this.getTimetables(this.yearid);
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
     *  @date 2019-02-16
     */
    changeYear() {
      console.log("根据排课周期下拉查询排课信息--table");
      this.getTimetables();
    },
    /**
     *  @function: 查询已排课程科目数量
     *  @author: ly
     *  @date 2019-02-16
     */
    getSectionNum() {
      let params = {
        semester_id: this.yearid,
        class_id: this.checkedObj.id
      };
      this.tableLoading = true;
      this.$api.EducationManage.getSectionNum("get", params)
        .then(res => {
          console.log("查询已排课程节数统计", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.totalData = res.data.data;
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    /**
     *  @function: 查询排课完整率
     *  @author: ly
     *  @date 2019-02-16
     */
    postTimetablesRate() {
      let params = {
        semester_id: this.yearid,
        class_id: this.checkedObj.id,
        school_id: localStorage.getItem("schoolId")
      };
      this.tableLoading = true;
      this.$api.EducationManage.postTimetablesRate("post", params)
        .then(res => {
          console.log("查询排课完整率", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.totalRate = res.data.data;
          } else {
            this.totalRate = "";
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },
    /**
     *  @function: 加载树形组织结构列表
     *  @author: wzx
     *  @date 2018-7-27
     **/
    loadStructure() {
      let jsonParam = {
        schoolId: localStorage.getItem("schoolId")
      };
      this.$api.Common.getTreeListStudent(jsonParam).then(res => {
        if (res.data.code == 600 || res.data.code == 0) {
          console.log("加载树形组织结构列表", res.data.data);
          this.treeData = res.data.data;
          /* if (this.treeData.length > 0) {
						 if (1) {
						 //无走班 +3 ,有走班制+4  目前先按照无走班走
						 this.lv = this.treeData[0].lv + 3;
						 } else {
						 this.lv = this.treeData[0].lv + 4;
						 }
             }*/

          // this.resizeInputWidth()
        } else {
          this.isToast = true;
          this.toast = res.data.msg;
        }
      });
    },
    /**
     *  @function: 获取教师列表
     *  @author: ly
     *  @date 2019-02-16
     */
    getTeacherList() {
      let params = {
        schoolId: localStorage.getItem("schoolId")
      };
      this.tableLoading = true;
      this.$api.EducationManage.getTeacherList("get", params)
        .then(res => {
          console.log("获取教师列表", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.teacherList = res.data.data;
          } else {
            this.teacherList = [];
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
    },  
    /**
     *  @function: 批量删除
     *  @author: ly
     *  @date 2019-02-16
     */
    batchDel(command) {
      console.log(command);
      this.batchDialog = true;
      if(command == 'school'){
        //批量删除学校
        this.batchTitle = '批量删除学校排课';
        this.batchOption = 0;
      } else if(command == 'grade'){
        //批量删除年级
        this.batchTitle = '批量删除年级排课';
        this.batchOption = 1;
      } else if(command == 'class'){
        //批量删除班级
        this.batchTitle = '批量删除班级排课';
        this.batchOption = 2;
      }
    }, 
    /**
     *  @function: 批量删除确定
     *  @author: ly
     *  @date 2019-02-16
     */
    confirmBatch() {
      console.log('批量删除确定,调用接口',this.batchOption );
      let params = {};
      if(this.batchOption == 0){
        //批量删除学校
        params = {
          semester_id: this.yearid,
          school_id: localStorage.getItem("schoolId"), // 按学校删除
        };        
      } else if(this.batchOption == 1){
         //批量删除年级
        params = {
          semester_id: this.yearid,
          grade_id: this.checkedObj.pid,
          school_id: localStorage.getItem("schoolId"),
        };            
      } else if(this.batchOption == 2){
        //批量删除班级
        params = {
          semester_id: this.yearid,
          class_id: this.checkedObj.id
        };           
      }
      console.log("删除param:",params);
      this.$api.EducationManage.postTimetablesDelete("post", params)
        .then(res => {
          this.tableLoading = false;
          console.log("删除result:",res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.batchDialog = false;
            this.getTimetables();
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          this.tableLoading = false;
        });
      // this.batchDialog = false;
    },  
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
    // this.getTimetables();//查询排课表格
    this.getDictionary(); //查询字典 赋值
  },
  created() {
    this.getTimetablesSemesterList(); //排课学年下拉列表
    this.loadStructure(); //左侧班级树
    this.getCourse(); //左侧课程信息
    this.getTeacherList(); //获取教师列表
    this.getTimetables(); //查询排课表格
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.layout-course-term {
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
    border-right: 1px solid #e1e1e1;
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
    // width: 100%;
    height: auto;
    flex: 1;
    text-align: right;
    min-width: 0;
    .teaching-top {
      min-height: 59px;
      line-height: 59px;
      border-bottom: 1px solid #e1e1e1;
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
      .el-button {
        color: #999 !important;
        margin-right: 20px !important;
        background-color: #f5f6f5 !important;
        border: 1px solid #e6e6e6 !important;
        &:hover {
          background-color: #1cab7d !important;
          border: 1px solid #1b9a71 !important;
          color: #fff !important;
        }
        &:active {
          background-color: #1b9a71 !important;
          border: 1px solid #1b9a71 !important;
          color: #fff !important;
        }
      }
    }
    .course-wrap {
      width: 100%;
      height: 100%;
      display: flex;
      .course-left {
        text-align: left;
        flex-basis: 200px;
        min-width: 200px;
        border-right: 1px solid #e1e1e1;
        .course-left-top {
          position: relative;
          font-size: 16px;
          color: #666;
          height: 60px;
          line-height: 60px;
          border-bottom: 1px solid #e1e1e1;
          dd {
            margin-left: 17px;
          }
          img {
            position: absolute;
            top: 0;
            bottom: 0;
            margin: auto;
            right: 20px;
            cursor: pointer;
          }
          .add-ac {
            display: none;
          }
          .add-no {
            display: block;
          }
          &:hover {
            .add-ac {
              display: block;
            }
            .add-no {
              display: none;
            }
          }
        }
        .course-list {
          width: 100%;
          height: 100%;
          text-align: center;
          overflow-y: auto;
          li {
            width: 100%;
            height: 52px;
            line-height: 52px;
            color: #333;
            cursor: pointer;
          }
          .ac {
            background-color: #cde7d8;
            color: #1cab7d;
          }
        }
      }
      .course-right {
        flex: 1;
        padding: 0 45px;
        min-width: 0;
        .course-right-top {
          min-height: 60px;
          line-height: 60px;
          // text-align: left;
          dd {
            float: left;
            font-size: 18px;
            color: #1cab7d;
            font-weight: bold;
          }
          /deep/ .el-checkbox {
            &:nth-of-type(1) {
              margin-right: 10px;
            }
            .el-checkbox__inner {
              border-radius: 50% !important;
            }
            .el-checkbox__label {
              color: #333 !important;
            }
          }
          .button-div {
            margin-right: 50px;
          }
        }
        .table-box {
          width: 100%;
          height: 100%;
          overflow-y: auto;
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
          /deep/ .el-table {
            thead {
              tr {
                th {
                  height: 48px !important;
                  position: relative;
                  &:nth-of-type(1) {
                    .cell {
                      padding: 0;
                      width: 100%;
                      height: 100%;
                      position: relative;
                      &::after {
                        content: "";
                        display: block;
                        width: 180px;
                        height: 1px;
                        background: #e1e1e1;
                        -webkit-transform: rotate(17deg);
                        -ms-transform: rotate(17deg);
                        -moz-transform: rotate(17deg);
                        transform: rotate(17deg);
                        position: absolute;
                        top: 24px;
                        left: -8px;
                      }
                      dd {
                        display: inline-block;
                        position: absolute;
                        font-size: 15px;
                        line-height: 15px;
                        &:nth-of-type(1) {
                          left: 25px;
                          top: 28px;
                        }
                        &:nth-of-type(2) {
                          right: 25px;
                          top: 10px;
                        }
                      }
                    }
                  }
                }
              }
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
        .course-percent {
          text-align: left;
          min-height: 60px;
          margin: 20px 0;
          p {
            font-size: 18px;
            line-height: 24px;
            font-weight: bold;
            color: #737373;
            margin-bottom: 10px;
            span {
              color: #1cab7d;
            }
          }
          dt {
            display: inline-block;
          }
          dd {
            color: #888;
            display: inline-block;
            margin-right: 20px;
            span {
              color: #1cab7d;
              margin-left: 5px;
            }
          }
        }
      }
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
  .batch-dialog{
    p{
      color: #333;
      margin-top: 10px;
      margin-bottom: 20px;
    }
    dd{
      color: #ff4e4e;
    }
    .button-div{
      margin-right: 20px;
    }
  }
}
</style>
