<template>
  <div class="term-manage">
    <div class="term-top">
      <dd>学年数量 <span>({{ tableData.length }})</span></dd>
      <!-- <div class="search-box">
        <el-input v-model="searchVal" size="small" placeholder="请输入设备ID或教室名称" @change="search">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
        </el-input>
      </div> -->
      <Button title="添加学年/学期" btnClass="custom8" btnFontSize="12px" @click="btnClick"></Button>
    </div>

    <div class="table-box">
      <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" v-loading="tableLoading">
        <el-table-column type="index" label="序号" min-width="80" width="80"></el-table-column>
        <el-table-column prop="yearName" label="学年名称" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="semesterName" label="学期名称" min-width="130" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startDate" label="开始日期" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endDate" label="结束日期" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="creator" label="操作人" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="createDate" label="创建日期" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column fixed="right" label="操作" align="center" min-width="150">
          <template slot-scope="scope">
            <el-button class="normal" size="mini" plain @click="btnClick(scope.row)">修改</el-button>
            <el-button class="warning" size="mini" plain @click="delClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- <div class="pagination-box">
      <el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
            :current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
    </div> -->

    <!-- 新建，修改学年/学期 -->
    <el-dialog :title="termForm.title" :visible.sync="formDialog" width="700px" center class="member-dialog">
      <div class="content">
        <el-form ref="termForm" label-width="100px" :rules="rules" :model="termForm">
          <el-form-item label="学年名称：" prop="yearid">
            <el-select v-model="termForm.yearid" placeholder="请选择学年" size="medium" style="width:270px;" @change="getSemesterCtInfo">
              <el-option :disabled="item.isCreated == 1" 
                v-for="item in semesterList" :key="item.code" :label="item.yearName" :value="item.code"
              > </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="学期名称：" prop="semesterType">
            <el-select v-model="termForm.semesterType" placeholder="请选择学期" size="medium" style="width:120px;" 
              v-if="!addSemester.firstSemester"
              >
              <el-option 
                v-for="item in firstTermData" 
                :key="item.semesterid" 
                :label="item.semesterName" 
                :value="item.semesterid"
              > </el-option>
            </el-select>
            <el-date-picker type="daterange" placeholder="选择日期"
              v-if="!addSemester.firstSemester"
              range-separator="至"
              start-placeholder="开始日期" 
              end-placeholder="结束日期"
              v-model="termForm.firstData"
              value-format="yyyy-MM-dd"
              size="medium"
              @change="changeStartDate"
              style="width:250px;"
            >
            </el-date-picker>
            <el-select v-model="termForm.semesterType" placeholder="请选择学期" size="medium" style="width:120px;"
              v-if="!addSemester.secendSemester"
            >
              <el-option
                v-for="item in secendTermData"
                :key="item.semesterid"
                :label="item.semesterName"
                :value="item.semesterid"
              > </el-option>
            </el-select>
            <el-date-picker
              type="daterange"
              placeholder="选择日期"
              v-if="!addSemester.secendSemester"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="termForm.secendData"
              value-format="yyyy-MM-dd"
              size="medium"
              @change="changeEndDate"
              style="width:250px;"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="formDialog = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveBtnClick"></Button>
      </span>
    </el-dialog>

    <el-dialog title="修改学年/学期" :visible.sync="editformDialog" width="700px" center class="member-dialog">
      <div class="content">
        <el-form ref="edittermForm" label-width="100px" :rules="rules" :model="edittermForm">
          <el-form-item label="学年名称：">
            <el-input v-model="edittermForm.yearName" disabled="" size="medium" style="width:270px">
              <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
            </el-input>
          </el-form-item>
          <el-form-item label="学期名称：" prop="semesterData">
            <el-input v-model="edittermForm.semesterName" disabled="" size="medium" style="width:120px">
              <i slot="suffix" class="el-input__icon el-icon-arrow-down"></i>
            </el-input>
            <el-date-picker
              type="daterange"
              placeholder="选择日期"
              range-separator="至"
              v-model="edittermForm.semesterData"
              value-format="yyyy-MM-dd"
              size="medium"
              @change="changeStartDate2"
              style="width:250px;"
            >
            </el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="editformDialog = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="editsaveBtnClick"></Button>
      </span>
    </el-dialog>

    <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
  </div>
</template>

<script>
import Button from "@/components/Button/Button";
import Toast from "@/components/Toast/Toast";

export default {
  name: "SchoolCalendar",
  components: {
    Button,
    Toast
  },
  data() {
    //form内必填项校验-- 数字
    let validateInputNumber = (rule, value, callback) => {
      if (!value) {
        callback(new Error("必填项不能为空"));
      } else {
        setTimeout(() => {
          if (
            this.termForm.firstData.length > 0 ||
            this.termForm.secendData.length > 0
          ) {
            callback();
          } else {
            callback(new Error("至少选择一个学期"));
          }
        }, 20);
      }
    };
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
        yearid: [{ required: true, message: "请选择学年", trigger: "change" }],
        semesterType: [
          // { required: true, message: '至少选择一个学期', trigger: 'change' },
          { required: true, validator: validateInputNumber, trigger: "change" }
        ],
        semesterData: [
          { required: true, message: "请选择日期", trigger: "change" }
        ]
      },
      semesterList: [], //学年学期下拉数据
      firstTermData: [
        // {
        //     semesterid:'1',
        //     semesterName:'第一学期',
        // },{
        //     semesterid:'2',
        //     semesterName:'上学期',
        // },{
        //     semesterid:'3',
        //     semesterName:'第1学期',
        // }
      ], //学期名称
      secendTermData: [
        // {
        //     semesterid:'1',
        //     semesterName:'第二学期',
        // },{
        //     semesterid:'2',
        //     semesterName:'下学期',
        // },{
        //     semesterid:'3',
        //     semesterName:'第2学期',
        // }
      ], //学期名称
      formDialog: false, //新建、修改学年/学期弹窗
      termForm: {
        yearid: "", //学年id
        yearName: "", //学年名称
        semesterType: "", //学期类型
        firstData: [], //第一学期选中时间
        secendData: [] //第二学期选中时间
      }, //新建、修改学年/学期from
      addSemester: {}, //是否可以新建学期

      editformDialog: false,
      edittermForm: {
        yearid: 0, //学年id
        yearName: "", //学年名称
        semesterid: 0,
        semesterName: "",
        semesterData: []
      }
    };
  },
  methods: {
    /**
     *  @function:开始日期修改
     *  @author: cs
     *  @date:2018-12-29
     **/
    changeStartDate(val) {
      if (val) {
        this.termForm.firstData = val;
      } else {
        setTimeout(() => {
          this.termForm.firstData = [];
          console.log(this.termForm);
        });
      }
    },
    /**
     *  @function:日期修改
     *  @author: ly
     *  @date:2019-01-24
     **/

    changeStartDate2(val) {
      if (val) {
        this.edittermForm.semesterData = val;
      } else {
        setTimeout(() => {
          this.edittermForm.semesterData = [];
          console.log(this.termForm);
        });
      }
    },
    /**
     *  @function:结束日期修改
     *  @author: cs
     *  @date:2018-12-29
     **/
    changeEndDate(val) {
      if (val) {
        this.termForm.secendData = val;
      } else {
        setTimeout(() => {
          this.termForm.secendData = [];
          console.log(this.termForm);
        });
      }
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
        // let pbH = $('.pagination-box').height();
        let tblH = icH - etH - obH - 10;
        console.log(666, icH, etH, obH);
        $(".term-manage .table-box").height(tblH);
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
      // let id = 3;
      this.tableLoading = true;
      this.$api.EducationManage.getEduSemester("get", params)
        .then(res => {
          console.log("学年/学期table数据", res.data);
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
     *  @function:新增,修改学年/学期
     *  @author: cs
     *  @date 2018-12-05
     **/
    btnClick(row) {
      console.log("新增,修改学年/学期", row);
      // this.formDialog = true;
      // this.termForm = {
      //   yearid:'',	//学年id
      //   yearName: '', //学年名称
      // 	semesterType:'',	//学期类型
      // 	firstData:[],//第一学期选中时间
      // 	secendData:[],//第二学期选中时间
      // }	//新建、修改学年/学期from

      setTimeout(() => {
        // this.$refs.edittermForm.resetFields();
        if (row) {
          // this.termForm = JSON.parse(JSON.stringify(row));
          // this.termForm.title = '修改学年/学期';
          (this.edittermForm = {
            yearid: 0, //学年id
            yearName: "", //学年名称
            semesterid: 0,
            semesterName: "",
            semesterData: []
          }),
            (this.editformDialog = true);
          let tmp = JSON.parse(JSON.stringify(row));
          this.edittermForm.yearid = tmp.yearid;
          this.edittermForm.yearName = tmp.yearName;
          this.edittermForm.semesterid = tmp.id;
          this.edittermForm.semesterName = tmp.semesterName;
          this.edittermForm.semesterData.push(tmp.startDate);
          this.edittermForm.semesterData.push(tmp.endDate);
          console.log("edittermForm", this.edittermForm);
        }
      }, 20);
      if (!row) {
        this.termForm = {
          yearid: "", //学年id
          yearName: "", //学年名称
          semesterType: "", //学期类型
          firstData: [], //第一学期选中时间
          secendData: [] //第二学期选中时间
        }; //新建、修改学年/学期from
        this.formDialog = true;
        this.termForm.title = "新建学年/学期";
        this.getEduSemesterlist(); //获取学年下拉列表
      }
    },
    /**
     *  @function: 新增,修改学年/学期->点击保存按钮
     *  @author: cs
     *  @date 2018-12-22
     **/
    saveBtnClick() {
      console.log("添加通道 场所->点击保存按钮", this.termForm);
      this.$refs["termForm"].validate(valid => {
        if (valid) {
          console.log("addDeviceForm", this.termForm);
          this.postSemester();
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
        '删除所选的"学年/学期"后，与此相关联的"教师任课关系"与所有"排课关系"，将同步删除，是否继续?',
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          //点击确定按钮进行的操作
          this.$loading();
          this.deleteSemester(row.id);
          setTimeout(() => {
            this.$loading().close();
          }, 1000);
        })
        .catch(() => {
          //点击取消按钮
        });
    },
    /**
     *  @function: 学年下拉列表
     *  @author: cs
     *  @date 2018-12-22
     */
    getEduSemesterlist() {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getEduSemesterlist("get", params)
        .then(res => {
          console.log("学年下拉列表", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.semesterList = res.data.data;
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
     *  @function: 修改学年/学期->点击保存按钮
     *  @author: ly
     *  @date 2019-01-24
     **/
    editsaveBtnClick() {
      console.log("添加通道 场所->点击保存按钮", this.edittermForm);
      this.$refs["edittermForm"].validate(valid => {
        if (valid) {
          console.log("edittermForm", this.edittermForm);
          this.putSemester();
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
     *  @function: 获取学期名称列表
     *  @author: ly
     *  @date 2019-01-22
     */
    getEduSemesterDicList() {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getEduSemesterDicList("get", params)
        .then(res => {
          console.log("获取学期名称列表数据", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.firstTermData = res.data.data.firstSemester;
            this.secendTermData = res.data.data.secendSemester;
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {});
    },
    /**
     *  @function: 获取学期的创建情况
     *  @author: ly
     *  @date 2019-01-22
     */
    getSemesterCtInfo(val) {
      let params = {
        code: val,
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getSemesterCtInfo("get", params)
        .then(res => {
          console.log("获取学期的创建情况数据", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.addSemester = res.data.data;
            this.termForm.semesterType = res.data.data.semesterid;
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        })
        .catch(err => {});
    },

    /**
     *  @function: 新增学期学年
     *  @author: ly
     *  @date 2019-01-22
     */
    postSemester() {
      let res = this.semesterList.filter(item => {
        return item.code == this.termForm.yearid;
      });
      let yearName = res[0].yearName;
      let params = {
        code: this.termForm.yearid,
        yearName: yearName,
        semesterType: this.termForm.semesterType,
        schoolid: localStorage.getItem("schoolId")
      };
      if (this.termForm.firstData.length == 2) {
        params.firStartDate = this.termForm.firstData[0];
        params.firEndDate = this.termForm.firstData[1];
      } else {
        params.firStartDate = "";
        params.firEndDate = "";
      }
      if (this.termForm.secendData.length == 2) {
        params.secStartDate = this.termForm.secendData[0];
        params.secEndDate = this.termForm.secendData[1];
      } else {
        params.secStartDate = "";
        params.secEndDate = "";
      }
      console.log("params:" + JSON.stringify(params));
      this.$api.EducationManage.postSemester("post", params)
        .then(res => {
          console.log("保存学期学年", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.formDialog = false;
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
     *  @function: 修改学期学年
     *  @author: ly
     *  @date 2019-01-22
     */

    putSemester() {
      let params = {
        startDate: this.edittermForm.semesterData[0],
        endDate: this.edittermForm.semesterData[1],
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.putSemester(
        params,
        this.edittermForm.semesterid
      )
        .then(res => {
          console.log("修改学期学年", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.editformDialog = false;
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
     *  @function: 删除学期学年
     *  @author: ly
     *  @date 2019-01-22
     */
    deleteSemester(id) {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.deleteSemester(params, id)
        .then(res => {
          console.log("删除学期学年", res.data);
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
    this.getEduSemesterDicList(); // 获取学期名称列表数据
    // this.getTableList(this.activeInputId);//获取table列表
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.term-manage {
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
        padding-bottom: 10px !important;
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
