<template>
  <div class="course-subjects">
    <div class="course-top">
      <dd>课程数量 <span>({{ tableData.length }})</span></dd>
      <!-- <div class="search-box">
				<el-input v-model="searchVal" size="small" placeholder="请输入设备ID或教室名称" @change="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
				</el-input>
			</div> -->
      <Button title="导出" btnClass="custom6" btnFontSize="12px" @click=""></Button>
      <Button title="导入" btnClass="custom6" btnFontSize="12px" @click="" ></Button>
      <Button title="新建课程" btnClass="custom8" btnFontSize="12px" @click="btnClick"></Button>
    </div>
    <div class="table-box">
      <el-table id="table" ref="multipleTable" height="100%" borderalign="center" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" v-loading="tableLoading">
        <el-table-column v-if="tableData.id" prop="id" label="ID" width="20"></el-table-column>
        <el-table-column type="index" label="序号" min-width="80" width="100"></el-table-column>
        <el-table-column prop="name" label="课程名称" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="remarks" label="备注" min-width="200" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button class="normal" size="mini" plain @click="btnClick(scope.row)" >修改</el-button>
            <el-button class="warning" size="mini" plain @click="delClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-box">
      <el-pagination
        background
        layout=" prev, pager, next"
        :total="allNum"
        :page-size=pageItem
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </div>
    <!-- 新建，修改课程 -->
    <el-dialog :title="courseForm.title" :visible.sync="formDialog" width="560px" center class="member-dialog">
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
    <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
  </div>
</template>

<script>
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";

export default {
  name: "CourseSubjects",
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
      allNum: 0, //table数组总条数
      currentPage: 1, //当前页（默认设为第一页）
      pageItem: 20, //分页时当前页显示多少条数据(默认显示20条数据)
      tableData: [], //table数组
      rules: {
        name: [{ required: true, message: "请输入课程名称", trigger: "blur" }]
      },
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
      firstTermData: [
        {
          semesterid: "1",
          semesterName: "第一学期"
        },
        {
          semesterid: "2",
          semesterName: "上学期"
        },
        {
          semesterid: "3",
          semesterName: "第1学期"
        }
      ], //学期名称
      secendTermData: [
        {
          semesterid: "1",
          semesterName: "第二学期"
        },
        {
          semesterid: "2",
          semesterName: "下学期"
        },
        {
          semesterid: "3",
          semesterName: "第2学期"
        }
      ], //学期名称
      formDialog: false, //新建、修改学年/学期弹窗
      courseForm: {
        id: 0, // 记录id
        optype: 0, // 1:新建 2:修改
        name: "", //课程名称
        remarks: "" //备注内容
      } //新建、修改课程from
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
        let obH = $(".index .course-top").height();
        let pbH = $(".pagination-box").height();
        let tblH = icH - etH - obH - 10;
        console.log(666, icH, etH, obH, pbH);
        $(".course-subjects .table-box").height(tblH);
      }, 50);
    },
    /**
     *  @function: 获取表格数据
     *  @author: cs
     *  @date 2018-12-04
     */
    getTableData() {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.tableLoading = true;
      this.$api.EducationManage.getCourse("get", params)
        .then(res => {
          console.log("获取课程信息", res.data);
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
     *  @function:新增,修改课程
     *  @author: cs
     *  @date 2018-12-05
     **/
    btnClick(row) {
      console.log("新建、修改课程", row);
      this.formDialog = true;
      this.courseForm = {
        name: "", //课程名称
        remarks: "" //备注内容
      }; //新建、修改课程from
      setTimeout(() => {
        this.$refs.courseForm.resetFields();
        if (row) {
          this.courseForm = JSON.parse(JSON.stringify(row));
          this.courseForm.title = "修改课程";
          this.courseForm.id = row.id;
          this.courseForm.optype = 2;
        }
      }, 20);
      if (!row) {
        this.courseForm.title = "新建课程";
        this.courseForm.id = 0;
        this.courseForm.optype = 1;
      }
    },
    /**
     *  @function: 新增,修改课程->点击保存按钮
     *  @author: cs
     *  @date 2018-12-22
     **/
    saveBtnClick() {
      console.log("新增课程->点击保存按钮", this.courseForm);
      this.$refs["courseForm"].validate(valid => {
        if (valid) {
          this.formDialog = false;
          console.log("addDeviceForm", this.courseForm);
          if (this.courseForm.optype == 1) {
            this.postCourse();
          } else if (this.courseForm.optype == 2) {
            this.putCourse();
          }
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
      this.$confirm("将永久删除此课程，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          //点击确定按钮进行的操作
          this.deleteCourse(row.id);
          // this.$loading();
          // this.deleteCourse(row.id);
          // setTimeout(() => {
          //     this.$loading().close();
          // }, 1000);
          this.tableData.splice(row.id - 1, 1);
        })
        .catch(() => {
          //点击取消按钮
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
            this.getTableData();
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
     *  @function: 修改课程信息
     *  @author: ly
     *  @date 2019-01-23
     **/
    putCourse() {
      let params = {
        name: this.courseForm.name,
        remarks: this.courseForm.remarks,
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.putCourse(params, this.courseForm.id)
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
          this.tableLoading = false;
        });
    },
    /**
     *  @function: 删除课程信息
     *  @author: ly
     *  @date 2019-01-23
     **/
    deleteCourse(id) {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.deleteCourse(params, id)
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
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.course-subjects {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
  .course-top {
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #e1e1e1;
    box-sizing: content-box;
    padding-left: 35px;
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
      }
      .button-div {
        margin-right: 20px;
      }
    }
  }
}
</style>
