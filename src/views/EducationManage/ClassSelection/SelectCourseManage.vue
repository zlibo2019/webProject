<template>
  <div class="select-course-manage">
    <div class="term-top">
      <dd>
        走班课程
        <span>({{ tableData.length }})</span>
      </dd>
      <!-- <div class="search-box">
				<el-input v-model="searchVal" size="small" placeholder="请输入设备ID或教室名称" @change="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
				</el-input>
      </div>-->
      <Button title="新建走班课程" btnClass="custom8" btnFontSize="12px" @click="btnClick"></Button>
    </div>

    <div class="table-box">
      <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" v-loading="tableLoading">
        <el-table-column type="index" label="序号" min-width="80" width="80"></el-table-column>
        <el-table-column prop="subject_name" label="课程类型" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="classfied_subject_name" label="走班课程名称" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="teacher_name" label="任课教师" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button class="normal" size="mini" plain @click="btnClick(scope.row)">走班学生管理</el-button>
            <el-button class="normal" size="mini" plain @click="btnClick(scope.row)">修改</el-button>
            <el-button class="warning" size="mini" plain  @click="delClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        background
        layout=" prev, pager, next"
        :total="allNum"
        :page-size="pageItem"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 新建，修改走班课程 -->
    <el-dialog
      :title="selectForm.title"
      :visible.sync="selectFormDialog"
      width="800px"
      center
      class="member-dialog"
    >
      <div class="content">
        <el-form
          ref="selectForm"
          label-width="110px"
          :rules="rules"
          :model="selectForm"
        >
          <el-form-item
            label="走班课程类型："
            prop="courseType"
          >
            <el-select
              v-model="selectForm.courseType"
              placeholder="请选择走班课程"
              @change="changeCourseType"
              size="medium"
              style="width:250px;"
            >
              <el-option
                v-for="item in courseData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
            <Button
              btnClass="custom11"
              v-show="selectForm.title == '新建走班课程'"
              btnFontSize="12px"
              btnHeight="36px"
              title="+添加"
              @click="addCourse"
            ></Button>
          </el-form-item>
          <el-form-item
            label="年级："
            prop="grade"
          >
            <el-select
              v-model="selectForm.grade"
              placeholder="请选择年级"
              @change="changeGrade"
              size="medium"
              style="width:250px;"
            >
              <el-option
                v-for="item in gradeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            label="走班课程数量："
            prop="cousrseCount"
          >
            <el-input-number
              v-model="selectForm.cousrseCount"
              :min="0"
              @change="handleChange"
              size="medium"
              style="width:250px;"
            ></el-input-number>
          </el-form-item>
          <el-form-item
            label="走班课程列表："
            class="choose-time"
          >
            <div class="inner-box">
              <ul class="inner-top clearfix">
                <li>序号</li>
                <li>走班课程</li>
                <li>任课教师</li>
                <li>操作</li>
              </ul>
              <ul class="time-list">
                {{selectForm.courseData}}
                <li
                  v-for="(item, index) in selectForm.courseData"
                  :key="index"
                >
                  <div>
                    <span>{{index+1}}</span>
                  </div>
                  <div>
                    <el-tooltip
                      v-if="item.courseName"
                      class="item"
                      effect="dark"
                      :content="item.courseName"
                      placement="top"
                    >
                      <el-input
                        v-model="item.courseName"
                        placeholder="输入走班课程"
                        clearable
                        size="small"
                      ></el-input>
                    </el-tooltip>
                    <el-input
                      v-else
                      v-model="item.courseName"
                      placeholder="输入走班课程"
                      clearable
                      size="small"
                    ></el-input>
                  </div>
                  <div>
                    <el-select
                      v-model="item.teacherName"
                      placeholder="选择教师"
                      @change="changeTeacher"
                      size="medium"
                      style="width:250px;"
                    >
                      <el-option
                        v-for="item in teacherData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>
                    <el-button
                      class="warning"
                      size="mini"
                      plain
                      @click="delCourse(item,index)"
                    >删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <Button
          title="取消"
          btnClass="custom7"
          btnFontSize="12px"
          btnHeight="4.5vh"
          @click="selectFormDialog = false"
        ></Button>
        <Button
          title="保存"
          btnClass="custom8"
          btnFontSize="12px"
          btnHeight="4.5vh"
          @click="saveClassfiedSubjectClick"
        ></Button>
      </span>
    </el-dialog>

    <!-- 新建课程 -->
    <el-dialog
      :title="courseForm.title"
      :visible.sync="courseFormDialog"
      width="560px"
      center
      class="member-dialog"
    >
      <div class="content">
        <el-form
          ref="courseForm"
          label-width="100px"
          :rules="rules"
          :model="courseForm"
        >
          <el-form-item
            label="课程名称："
            prop="name"
          >
            <el-input
              v-model="courseForm.name"
              placeholder="请输入课程名称"
              style="width:300px;"
              size="small"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="备注："
            prop="remarks"
          >
            <el-input
              v-model="courseForm.remarks"
              placeholder="请输入备注内容"
              type="textarea"
              :autosize="{ minRows: 3, maxRows: 6}"
              style="width:300px;"
              size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <Button
          title="取消"
          btnClass="custom7"
          btnFontSize="12px"
          btnHeight="4.5vh"
          @click="courseFormDialog = false"
        ></Button>
        <Button
          title="保存"
          btnClass="custom8"
          btnFontSize="12px"
          btnHeight="4.5vh"
          @click="saveClassfiedSubjectClick"
        ></Button>
      </span>
    </el-dialog>
    <Toast
      v-if="isToast"
      :modal-title="toast"
      duration="1500"
      @toastCancel="hideToast"
    ></Toast>
  </div>
</template>

<script>
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";

export default {
  name: "SelectCourseManage",
  components: {
    Button,
    Toast
  },
  data() {
    return {
      defArrow: this.$store.state.Common.defaultLineArrow, //右侧导航默认箭头
      isToast: false, //toast是否展示
      toast: "", //toast提示内容
      tableLoading: false, //表格加载动画
      tableData: [], //table数组
      allNum: 0, //table数组总条数
      currentPage: 1, //当前页（默认设为第一页）
      pageItem: 20, //分页时当前页显示多少条数据(默认显示20条数据)
      rules: {
        courseType: [
          { required: true, message: "请选择走班课程", trigger: "change" }
        ],
        grade: [{ required: true, message: "请选择年级", trigger: "blur" }],
        cousrseCount: [
          { required: true, message: "请选择走班课程数量", trigger: "change" }
        ],
        semesterType: [
          {
            type: "array",
            required: true,
            message: "请选择学期",
            trigger: "change"
          }
        ],
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
      },
      courseData: [
        // {
        //     courseId:'1',
        //     courseName:'语文11',
        // },{
        //     courseId:'2',
        //     courseName:'数学',
        // },{
        //     courseId:'3',
        //     courseName:'英语',
        // },{
        //     courseId:'4',
        //     courseName:'历史',
        // }
      ], //所属楼宇数据
      gradeData: [
        {
          id: "1",
          name: "一年级"
        },
        {
          id: "2",
          name: "二年级"
        },
        {
          id: "3",
          name: "三年级"
        }
      ], //所属楼宇数据
      teacherData: [
        {
          id: "1",
          name: "张三"
        },
        {
          id: "2",
          name: "李四"
        },
        {
          id: "3",
          name: "三年级"
        }
      ], //所属楼宇数据
      courseName: "",
      gradeName: "",
      selectFormDialog: false, //新建、修改走班课程弹窗
      selectForm: {
        courseType: "", //走班课程
        grade: 0, //年级
        cousrseCount: "",

        teacher: "" //走班课程
      }, //新建、修改走班课程from
      courseFormDialog: false, //新建课程弹窗
      courseForm: {
        name: "", //课程名称
        remarks: "" //备注内容
      }, //新建、修改课程from
      grade: 0,
      subjectId: 0,
      classfiedSubjectName: ""
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
     *  @function:分页
     *  @author: cs
     *  @date 2018-12-05
     **/
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      // this.getTableData(this.pageItem, this.currentPage);
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
        let obH = $(".index .term-top").height();
        let pbH = $(".pagination-box").height();
        let tblH = icH - etH - obH - pbH - 10;
        console.log(666, icH, etH, obH, pbH);
        $(".select-course-manage .table-box").height(tblH);
      }, 50);
    },
    /**
     *  @function: 获取表格数据
     *  @author: cs
     *  @date 2018-12-04
     */
    getTableData() {
      let params = {
        school_id: localStorage.getItem("schoolId")
      };
      this.tableLoading = true;
      this.$api.EducationManage.getClassfiedSubject("get", params)
        .then(res => {
          console.log("走班课程table数据", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.tableData = res.data.data;
            this.allNum = res.data.total_record;
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
     *  @function:新增,修改走班课程
     *  @author: cs
     *  @date 2018-12-25
     **/
    btnClick(row) {
      console.log("新增,修改走班课程", row, this.courseData);
      this.selectFormDialog = true;
      (this.selectForm = {
        courseType: "", //走班课程
        grade: "", //年级
        cousrseCount: "",
        courseData: []
      }), //新建、修改走班课程from
        setTimeout(() => {
          this.$refs.selectForm.resetFields();
          if (row) {
            this.selectForm = JSON.parse(JSON.stringify(row));
            this.selectForm.title = "修改走班课程";
          }
        }, 20);
      if (!row) {
        this.selectForm.title = "新建走班课程";
      }
    },
    /**
     *  @function:新增课程
     *  @author: cs
     *  @date 2018-12-25
     **/
    addCourse() {
      console.log("新增,修改走班课程");
      this.courseFormDialog = true;
      this.courseForm = {
        name: "", //课程名称
        remarks: "" //备注内容
      }; //新建、修改课程from
      this.courseForm.title = "新建课程";
      setTimeout(() => {
        this.$refs.courseForm.resetFields();
      }, 20);
    },

    /**
     *  @function: 新增走班课程
     *  @author: zlb
     *  @date 2019-02-21
     **/
    postClassfiedSubject() {
      let arrResult = [];
      for (let i = 0; i < this.selectForm.courseData.length; i++) {
        arrResult.push({
          classfied_subject_name: this.selectForm.courseData[i].courseName,
          teacher_id: this.selectForm.courseData[i].teacherName
        });
      }
      let body = {
        school_id: localStorage.getItem("schoolId"),
        grade_id: this.selectForm.grade,
        subject_id: this.selectForm.courseType,
        classfied_subject_teacher: arrResult
      };
      this.$api.EducationManage.postClassfiedSubject("post", body)
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.getTableData();
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          console.log("yyyyyyyyyyyyyyyyyyy" + JSON.stringify(err));
          this.tableLoading = false;
        });
    },

    /**
     *  @function: 根据id查询走班科目
     *  @author: zlb
     *  @date 2019-02-21
     **/
    loadClassfiedSubjectById() {
      let arrResult = [];

      let body = {
        school_id: localStorage.getItem("schoolId"),
        id: 1
      };
      this.$api.EducationManage.loadClassfiedSubjectById("get", body)
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.getTableData();
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          console.log("yyyyyyyyyyyyyyyyyyy" + JSON.stringify(err));
          this.tableLoading = false;
        });
    },

    /**
     *  @function: 修改走班科目
     *  @author: zlb
     *  @date 2019-02-21
     **/
    putClassfiedSubjectById() {
      let arrResult = [];

      let body = {
        teacher_id: 3,
        name: "走班课程名称"
      };
      this.$api.EducationManage.putClassfiedSubjectById("put", body)
        .then(res => {
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.getTableData();
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          console.log("yyyyyyyyyyyyyyyyyyy" + JSON.stringify(err));
          this.tableLoading = false;
        });
    },

    /**
     *  @function: 删除走班科目
     *  @author: zlb
     *  @date 2019-02-21
     **/
    deleteClassfiedSubjectById(id) {
      let arrResult = [];

      let body = {
        id: id
      };
      this.$api.EducationManage.deleteClassfiedSubjectById("delete", body)
        .then(res => {
             console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxx");
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.getTableData();
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {
          console.log("yyyyyyyyyyyyyyyyyyy" + JSON.stringify(err));
          this.tableLoading = false;
        });
    },

    /**
     *  @function: 新增课程->点击保存按钮
     *  @author: cs
     *  @date 2018-12-25
     **/
    saveClassfiedSubjectClick() {
      console.log("新增课程->点击保存按钮", this.courseForm);
      this.$refs["selectForm"].validate(valid => {
        if (valid) {
          this.selectFormDialog = false;
          //   this.selectForm.courseType = this.courseForm.name;
          /* TODO 此处最后要换成id值 */
          // this.selectForm.courseType = this.courseForm.id;
          this.postClassfiedSubject();
          console.log("selectForm", this.selectForm);
        } else {
          this.$message({
            message: "请输入内容（*为必填项）",
            type: "error",
            duration: this.msgDuration
          });
        }
      });
    },
    /**
     *  @function: 新增,修改走班课程->点击保存按钮
     *  @author: cs
     *  @date 2018-12-22
     **/
    saveBtnClick() {
      console.log("添加通道 场所->点击保存按钮", this.selectForm);
      this.$refs["selectForm"].validate(valid => {
        if (valid) {
          this.selectFormDialog = false;
          console.log("selectForm", this.selectForm);
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
     *  @function: 表格行删除
     *  @author: cs
     *  @date 2018-12-22
     */
    delClick(row) {
      console.log("delClick:", row);
      this.$confirm(
        '删除所选的"走班课程"后，与此相关联的"教师任课关系"与所有"排课关系"，将同步删除，是否继续?',
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.deleteClassfiedSubjectById(row.id);
          //点击确定按钮进行的操作
          this.$loading();
          setTimeout(() => {
            this.$loading().close();
          }, 1000);
        })
        .catch(() => {
          //点击取消按钮
        });
    },

    /**
     *  @function: 改变计数器的值
     *  @author: cs
     *  @date 2018-12-25
     */
    handleChange(value) {
      console.log(
        "改变计数器的值:",
        value,
        this.selectForm.courseData.length,
        this.courseName
      );
      // let courseName = this.selectForm.courseType
      if (value > this.selectForm.courseData.length) {
        for (let i = this.selectForm.courseData.length; i < value; i++) {
          this.selectForm.courseData.push({
            courseName:
              this.selectForm.grade || this.courseName
                ? `${this.selectForm.grade ? this.selectForm.grade : ""}${
                    this.courseName ? this.courseName : ""
                  }${i + 1}`
                : "",
            teacherName: this.teacherName
          });
        }
      } else if (value < this.selectForm.courseData.length) {
        for (let i = this.selectForm.courseData.length; i >= value; i--) {
          this.selectForm.courseData.splice(i, 1);
        }
      }
    },
    /**
     *  @function: change下拉框的值
     *  @author: cs
     *  @date 2018-12-25
     */
    changeCourseType(value) {
      console.log("change下拉框的值:", value);
      this.courseData.forEach(item => {
        if (item.id == value) {
          return (this.courseName = item.name);
        }
      });
      console.log(this.courseName);
    },
    changeTeacher(value) {
      console.log("change下拉框的值:", value);
      this.teacherData.forEach(item => {
        if (item.id == value) {
          return (this.teacherName = item.name);
        }
      });
      console.log(this.teacherName);
    },
    changeGrade(value) {
      console.log("change下拉框的值:", value);
      this.gradeData.forEach(item => {
        if (item.id == value) {
          return (this.gradeName = item.name);
        }
      });
      console.log(this.gradeName);
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
            this.courseData = res.data.data;
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
    }
  },
  mounted() {
    //权限id数组
    this.roleActions = this.$store.state.Common.roleActions;
    this.resizeLayout(); //重新获取宽高
  },
  created() {
    this.getTableData(); //获取表格数据
    // this.getTableList(this.activeInputId);//获取table列表
    this.getCourse();
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.select-course-manage {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  .term-top {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: content-box;
    padding-left: 35px;
    font-size: 18px;
    dd {
      float: left;
      font-size: 18px;
      font-weight: bold;
      span {
        font-size: 14px;
        font-weight: normal;
      }
    }
    .search-box {
      width: 200px;
      height: 36px;
      float: left;
      margin: 0px 80px 0px 20px;
      margin-right: 10px;
      background: #fff;
      position: relative;
      .el-input {
        i {
          cursor: pointer;
        }
      }
    }
    .button-div {
      float: right;
      margin-right: 20px;
      margin-top: 11px;
    }
  }
  .table-box {
    td:nth-of-type(2) {
      img,
      span {
        vertical-align: middle;
      }
      span {
        margin-left: 5px;
      }
    }
    /deep/ .el-table {
      thead {
        tr {
          th {
            height: 5vh !important;
          }
        }
      }
    }
  }
  .pagination-box {
    width: 100%;
    height: 60px;
    background: #fff;
    box-sizing: content-box;
    .el-pagination {
      padding-top: 15px;
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
        .choose-time {
          .inner-box {
            width: 520px;
            overflow: hidden;
            border: 1px solid #e1e1e1;
            border-radius: 6px;
            text-align: center;
            .inner-top {
              width: 520px;
              height: 40px;
              line-height: 40px;
              display: flex;
              li {
                flex: 1;
                font-size: 12px;
                color: #606266;
                &:nth-of-type(2) {
                  flex-basis: 140px;
                  max-width: 140px;
                }
              }
            }
            .time-list {
              width: 520px;
              max-height: 240px;
              overflow: auto;
              li {
                width: 100%;
                height: 40px;
                line-height: 40px;
                overflow: hidden;
                border-top: 1px solid #e1e1e1;
                display: flex;
                & > div {
                  font-size: 12px;
                  color: #606266;
                  flex: 1;
                  padding: 0 10px;
                  &:nth-of-type(2) {
                    flex-basis: 140px;
                    max-width: 140px;
                  }
                }
              }
            }
            .button-div {
              margin: 10px 20px;
            }
          }
        }
      }
      .button-div {
        margin-right: 20px;
      }
    }
  }
}
</style>

