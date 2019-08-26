<template>
  <div class="class-time">
    <div class="term-top">
      <dd>上课时间 <span>({{ allNum }})</span></dd>
      <!-- <div class="search-box">
				<el-input v-model="searchVal" size="small" placeholder="请输入设备ID或教室名称" @change="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
				</el-input>
			</div> -->
      <Button title="新建上课时间" btnClass="custom8" btnFontSize="12px" @click="btnClick"></Button>
    </div>
    <div class="table-box">
      <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark" highlight-current-row style="width: 100%" v-loading="tableLoading">
        <el-table-column prop="indexID" label="序号" min-width="80"></el-table-column>
        <el-table-column prop="timeName" label="上课时间表" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="startDate" label="开始日期" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="endDate" label="结束日期" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="classRooms" label="使用范围" min-width="100" show-overflow-tooltip></el-table-column>
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
    <div class="pagination-box">
      <el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem 
        :current-page.sync="currentPage" @current-change="handleCurrentChange"
      ></el-pagination>
    </div>

    <!-- 新建，修改上课时间 -->
    <el-dialog :title="chooseType==0?'新增上课时间':'修改上课时间'" :visible.sync="classTimeDialog" width="850px" center class="member-dialog">
      <div class="content">
        <el-form ref="classTimeForm" label-width="120px" :rules="rules" :model="classTimeForm">
          <el-form-item label="上课时间名称：" prop="timeName">
            <el-input v-model="classTimeForm.timeName" placeholder="请输入上课时间表名称，如9月-1月 夏季上课时间" style="width:340px;" size="small"></el-input>
          </el-form-item>
          <el-form-item label="日期范围：" prop="selectDate">
            <el-date-picker
              type="daterange"
              placeholder="选择日期"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              v-model="classTimeForm.selectDate"
              size="small"
              format="MM-dd"
              value-format="MM-dd"
              style="width:340px;"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="上课时间：" class="choose-time">
            <div class="inner-box">
              <ul class="inner-top clearfix">
                <li>节次<el-switch
                    v-model="classTimeForm.ctType"
                    inactive-text="自定义名称"
                  ></el-switch>
                </li>
                <li>上课时间</li>
                <li>下课时间</li>
                <li>操作</li>
              </ul>
              <ul class="time-list">
                <li
                  v-for="(item, index) in classTimeForm.times"
                  :key="index"
                >
                  <div class="section">
                    <span v-show="!classTimeForm.ctType">{{index+1}}</span>
                    <el-input v-model="item.sectionName" placeholder="请输入自定义名称" style="width:140px;"
                      v-show="classTimeForm.ctType" :readonly="item.readOnly" size="small"
                    ></el-input>
                  </div>
                  <div class="start-time">
                    <el-time-picker v-model="item.startTime" placeholder="上课时间" format="HH:mm" value-format="HH:mm" size="small">
                    </el-time-picker>
                  </div>
                  <div class="end-time">
                    <el-time-picker v-model="item.endTime" placeholder="下课时间" format="HH:mm" value-format="HH:mm" size="small">
                    </el-time-picker>
                  </div>
                  <div class="del">
                    <el-button class="warning" :disabled="index != classTimeForm.times.length -1"
                      size="mini" plain @click="delTime(item,index)"
                    >删除</el-button>
                  </div>
                </li>
              </ul>
              <Button btnClass="custom11" btnFontSize="12px" title="+添加" @click="addTime"></Button>
            </div>
          </el-form-item>
          <el-form-item label="适用范围：">
            <el-input readonly v-model="classTimeForm.classRooms" @focus="selectClassroom"
              style="width:340px;" placeholder="请选择适用范围" suffix-icon="el-icon-arrow-down" size="small"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="classTimeDialog = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveBtnClick"></Button>
      </span>
    </el-dialog>

    <!-- 适用范围 -->
    <el-dialog title="适用范围" :visible.sync="choosePlaceDialog" width="900px" center class="sch-system-dialog">
      <div class="content">
        <div class="transfer-div">
          <tree-transfer
            ref="childTree"
            :from_data="fromData"
            leftTitle='选择场所/教室'
            leftplaceholder='请输入场所/教室名称'
            rightOne='场所/教室'
            rightTwo='所在场所'
            sourceDiffer="2"
            :user_data="listClassroom"
            @showSelected="getSelected"
            @checkedClick="checkedClick"
          ></tree-transfer>
          <!-- <div class="checked-box">
            <el-checkbox
              v-model="toParent"
              v-if="roleNos.indexOf('S01') > -1"
            >发布家长端</el-checkbox>
          </div> -->
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="40px" @click="cancelSave"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="40px" @click="saveTemplate"></Button>
      </span>
    </el-dialog>
    <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
  </div>
</template>

<script>
import Button from "@/components/Button/Button";
import treeTransfer from "@/components/Transfer/transfer-extend";
import Toast from "@/components/Toast/Toast";

export default {
  name: "ClassTime",
  components: {
    Button,
    treeTransfer,
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
        timeName: [
          { required: true, message: "请选择学年", trigger: "change" }
        ],
        selectDate: [
          { required: true, message: "请选择日期", trigger: "change" }
        ]
      },
      placeData: [
        {
          placeNo: 0,
          place_name: "教学楼A"
        },
        {
          placeNo: 1,
          place_name: "教学楼B"
        },
        {
          placeNo: 2,
          place_name: "教学楼C"
        },
        {
          placeNo: 3,
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
      classTimeDialog: false, //新建、修改上课时间
      classTimeForm: {
        timeName: "", //上课时间名称
        selectDate: [], //选中的日期
        ctType: false, //是否自定义名称
        times: [
          {
            sectionName: "第1节",
            startTime: "08:00",
            endTime: "08:45"
          },
          {
            sectionName: "第2节",
            startTime: "08:00",
            endTime: "08:45"
          },
          {
            sectionName: "第3节",
            startTime: "08:00",
            endTime: "08:45"
          },
          {
            sectionName: "第4节",
            startTime: "08:00",
            endTime: "08:45"
          },
          {
            sectionName: "第5节",
            startTime: "08:00",
            endTime: "08:45"
          },
          {
            sectionName: "第6节",
            startTime: "08:00",
            endTime: "08:45"
          },
          {
            sectionName: "第7节",
            startTime: "08:00",
            endTime: "08:45"
          },
          {
            sectionName: "第8节",
            startTime: "08:00",
            endTime: "08:45"
          }
        ],
        classRooms: "" //适用范围
      }, //新建、修改上课时间
      choosePlaceDialog: false, //选择教室弹窗
      listClassroom: [], //选中的教室数组,传给后台的参数
      fromData: [
        {
          id: 1000,
          pid: 101,
          label: "烟台一中",
          group: 102,
          disabled: 0,
          children: [
            {
              id: 10000,
              pid: 1000,
              label: "校门口",
              disabled: 0,
              group: 103,
              children: [
                {
                  id: 10010,
                  pid: 10000,
                  label: "101",
                  disabled: 0,
                  group: 104,
                  children: []
                },
                {
                  id: 10011,
                  pid: 10000,
                  label: "102",
                  disabled: 0,
                  group: 104,
                  children: []
                },
                {
                  id: 10012,
                  pid: 10000,
                  label: "103",
                  disabled: 0,
                  group: 104,
                  children: []
                }
              ]
            },
            {
              id: 10001,
              pid: 1000,
              label: "传达室",
              disabled: 0,
              group: 103,
              children: [
                {
                  id: 10020,
                  pid: 10001,
                  label: "201",
                  disabled: 0,
                  group: 104,
                  children: []
                },
                {
                  id: 10021,
                  pid: 10001,
                  label: "202",
                  disabled: 0,
                  group: 104,
                  children: []
                },
                {
                  id: 10022,
                  pid: 10001,
                  label: "203",
                  disabled: 0,
                  group: 104,
                  children: []
                }
              ]
            }
          ]
        }
      ], // 清空
      toParent: false, //发布到家长端 - 默认不选中
      chooseType: 0, //点击新增还是修改 0新增 1修改
      customName: [] //自定义名称数组
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
        let obH = $(".index .term-top").height();
        let pbH = $(".pagination-box").height();
        let tblH = icH - obH - pbH;
        console.log(666, icH, obH, pbH);
        $(".class-time .table-box").height(tblH);
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
      this.$api.EducationManage.getLessontime("get", params)
        .then(res => {
          console.log("场所管理table数据", res.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            this.tableData = res.data.data;
            // this.allNum = res.data.total_record;
            this.tableData.forEach((item, index) => {
              this.$set(
                item,
                "indexID",
                (this.currentPage - 1) * this.pageItem + index + 1
              ); //序号计算(当前页码-1)*当页条数+变化的i值+1
            });
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
     *  @function: 获取上课时间明细
     *  @author: cs
     *  @date 2019-01-11
     */
    getLessontimeDetail(timeid) {
      let params = {
        timeid: timeid,
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getLessontimeDetail("get", params).then(res => {
        console.log("场所管理table数据", res.data.data);
        if (res.data.code == 600 || res.data.code == 0) {
          // this.tableData = res.data.data;
          setTimeout(() => {
            this.classTimeForm.timeid = res.data.data.timeid;
            this.classTimeForm.timeName = res.data.data.timeName;
            this.classTimeForm.ctType = res.data.data.ctType == 1;
            this.classTimeForm.selectDate = [
              res.data.data.startDate,
              res.data.data.endDate
            ];
            this.classTimeForm.times = res.data.data.times;
            this.classTimeForm.classRooms = res.data.data.classRooms;
            this.classTimeForm.roomsData = res.data.data.roomsData;
            this.getLessontimeSectionname();
          }, 20);
        } else {
          this.isToast = true;
          this.toast = res.data.msg;
        }
      });
    },
    /**
     *  @function:新增,修改学年/学期
     *  @author: cs
     *  @date 2018-12-05
     **/
    btnClick(row) {
      console.log("新增,修改学年/学期", row);
      this.classTimeDialog = true;

      setTimeout(() => {
        this.$refs.classTimeForm.resetFields();
      }, 20);
      if (row) {
        this.chooseType = 1;
        // this.classTimeForm = JSON.parse(JSON.stringify(row));
        this.getLessontimeDetail(row.timeid);
      } else {
        this.chooseType = 0;
        this.classTimeForm = {
          timeName: "", //上课时间名称
          selectDate: [], //选中的日期
          ctType: false, //是否自定义名称
          times: [
            {
              sectionid: "1",
              sectionName: "第1节",
              startTime: "08:00",
              endTime: "08:45"
            },
            {
              sectionid: "2",
              sectionName: "第2节",
              startTime: "08:00",
              endTime: "08:45"
            },
            {
              sectionid: "3",
              sectionName: "第3节",
              startTime: "08:00",
              endTime: "08:45"
            },
            {
              sectionid: "4",
              sectionName: "第4节",
              startTime: "08:00",
              endTime: "08:45"
            },
            {
              sectionid: "5",
              sectionName: "第5节",
              startTime: "08:00",
              endTime: "08:45"
            },
            {
              sectionid: "6",
              sectionName: "第6节",
              startTime: "08:00",
              endTime: "08:45"
            },
            {
              sectionid: "7",
              sectionName: "第7节",
              startTime: "08:00",
              endTime: "08:45"
            },
            {
              sectionid: "8",
              sectionName: "第8节",
              startTime: "08:00",
              endTime: "08:45"
            }
          ],
          classRooms: "" //适用范围
        }; //新建、修改上课时间
        this.getLessontimeSectionname(); //获取表格数据
      }
    },
    /**
     *  @function: 新增修改上课时间->点击保存按钮
     *  @author: cs
     *  @date 2018-12-04
     **/
    saveBtnClick() {
      console.log("添加通道 场所->点击保存按钮", this.classTimeForm);
      this.$refs["classTimeForm"].validate(valid => {
        if (valid) {
          console.log("addDeviceForm", this.classTimeForm);
          let isTimeNull = false;
          this.classTimeForm.times.forEach((item, index) => {
            item.sectionid = index + 1;
            if (!item.startTime || !item.endTime) {
              isTimeNull = true;
              return;
            }
          });
          if (isTimeNull) {
            this.$message({
              message: "上课时间和下课时间不能为空",
              type: "error",
              duration: this.msgDuration
            });
            return;
          }
          console.log(params);
          // return
          this.$loading();
          let type = "";
          if (this.chooseType == 0) {
            type = "post";
          } else if (this.chooseType == 1) {
            type = "put";
          }
          console.log("this.classTimeForm.timeid", this.classTimeForm.timeid);
          let roomsData =  this.listClassroom.map(item=>{
            return item.id
          })
          let params = {
            timeName: this.classTimeForm.timeName,
            startDate: this.classTimeForm.selectDate[0],
            endDate: this.classTimeForm.selectDate[1],
            times: this.classTimeForm.times,
            classRooms: this.classTimeForm.classRooms,
            roomsData: roomsData,
            ctType: this.classTimeForm.ctType ? 1 : 0, //创建类型 0系统默认 1自定义
            schoolid: localStorage.getItem("schoolId")
          };
          this.$api.EducationManage.getLessontime(
            type,
            params,
            this.classTimeForm.timeid
          )
            .then(res => {
              console.log("场所管理table数据", res.data);
              this.$loading().close();
              if (res.data.code == 600 || res.data.code == 0) {
                this.classTimeDialog = false;
                this.choosePlaceDialog = false;
                this.getTableData();
              } else {
                this.isToast = true;
                this.toast = res.data.msg;
              }
            })
            .catch(err => {
              this.$loading().close();
            });
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
     *  @date 2018-12-04
     */
    delClick(row) {
      console.log("delClick:", row);
      this.$confirm(
        '删除所选的"上课时间表"后，与此相关联的"教师任课关系"与所有"排课关系"，将同步删除，是否继续?',
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
          let params = {
            schoolid: localStorage.getItem("schoolId")
          };
          this.$api.EducationManage.delLessontime(params, row.timeid)
            .then(res => {
              console.log("表格行删除", res.data);
              this.$loading().close();
              if (res.data.code == 600 || res.data.code == 0) {
                this.getTableData();
              } else {
                this.isToast = true;
                this.toast = res.data.msg;
              }
            })
            .catch(err => {
              this.$loading().close();
            });
        })
        .catch(() => {
          //点击取消按钮
        });
    },
    /**
     *  @function: 增加节次
     *  @author: cs
     *  @date 2018-12-24
     */
    addTime() {
      console.log("增加节次:");
      this.classTimeForm.times.push({
        sectionName: `第${this.classTimeForm.times.length + 1}节`,
        startTime: "08:00",
        endTime: "08:45"
      });
      if (this.customName.length <= this.classTimeForm.times.length) {
        for (let i = 0; i < this.customName.length; i++) {
          this.classTimeForm.times[i].sectionName = this.customName[
            i
          ].sectionName;
          this.classTimeForm.times[i].sectionid = this.customName[i].sectionNo;
          this.classTimeForm.times[i].readOnly = true;
        }
      } else {
        for (let i = 0; i < this.classTimeForm.times.length; i++) {
          this.classTimeForm.times[i].sectionName = this.customName[
            i
          ].sectionName;
          this.classTimeForm.times[i].sectionid = this.customName[i].sectionNo;
          this.classTimeForm.times[i].readOnly = true;
        }
      }
    },
    /**
     *  @function: 删除节次
     *  @author: cs
     *  @date 2018-12-24
     */
    delTime(item, index) {
      console.log("删除节次:", item, index);
      this.classTimeForm.times.splice(index, 1);
    },
    /**
     *  @function: 选择教室
     *  @author: cs
     *  @date 2018-12-24
     **/
    selectClassroom() {
      console.log("选择教室：");
      this.choosePlaceDialog = true;
      this.fromData = [];
      
      this.getPlaceTree();
    },
    /**
     *  @function: table 列表点击筛选
     *  @author: cs
     *  @date 2018-12-07
     */
    getSelected(data) {
      console.log("888999666", data, this.listClassroom);
      for (let i = 0; i < data.length; i++) {
        this.listClassroom.push({
          classId: data[i].pid,
          placeName: data[i].pname,
          studentId: data[i].id,
          id: data[i].id,
          buildingName: data[i].label
        });
      }
      let length = this.listClassroom.length;
      if (length == 1) return;
      // console.log(444,length)
      for (let i = 0; i < length; i++) {
        for (let k = i + 1; k < length; k++) {
          if (this.listClassroom[k].id == this.listClassroom[i].id) {
            // console.log(11111111111111)
            this.listClassroom.splice(k, 1);
            length--;
            k--;
          }
        }
      }
      console.log(12333333, data.length, this.listClassroom)
    },
    /**
     *  @function: table 列表搜索筛选
     *  @author: cs
     *  @date 2018-12-07
     */
    checkedClick(data) {
      console.log("data111", data, this.listClassroom);
      this.listClassroom.push({
        classId: data.pid,
        placeName: data.pname,
        studentId: data.id,
        id: data.id,
        buildingName: data.value
      });
      let length = this.listClassroom.length;
      if (length == 1) return;
      for (let i = 0; i < length; i++) {
        for (let k = i + 1; k < length; k++) {
          if (this.listClassroom[k].id == this.listClassroom[i].id) {
            this.listClassroom.splice(k, 1);
            length--;
            k--;
          }
        }
      }
      // console.log(12333333, data, this.listClassroom)
    },
    /**
     *  @function: 应用模板
     *  @author: cs
     *  @date 2018-12-07
     **/
    saveTemplate() {
      console.log("选择教室下发模板:",this.listClassroom);
      this.choosePlaceDialog = false;
      let classRooms = [];
      classRooms = this.listClassroom.map(item=>{
        return item.buildingName
      })
      this.classTimeForm.classRooms = classRooms.join('、')
      // this.classTimeDialog = false;
    },
    /**
     *  @function: 获取节次名称-用于新增、修改时的已有节次定义
     *  @author: cs
     *  @date 2019-01-15
     **/
    getLessontimeSectionname() {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getLessontimeSectionname("get", params).then(
        res => {
          console.log("获取节次名称-用于新增、修改时的已有节次定义", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.customName = res.data.data;
            if (this.customName.length <= this.classTimeForm.times.length) {
              for (let i = 0; i < this.customName.length; i++) {
                this.classTimeForm.times[i].sectionName = this.customName[
                  i
                ].sectionName;
                this.classTimeForm.times[i].sectionid = this.customName[
                  i
                ].sectionNo;
                this.$set(this.classTimeForm.times[i], "readOnly", true);
              }
            } else {
              for (let i = 0; i < this.classTimeForm.times.length; i++) {
                this.classTimeForm.times[i].sectionName = this.customName[
                  i
                ].sectionName;
                this.classTimeForm.times[i].sectionid = this.customName[
                  i
                ].sectionNo;
                this.classTimeForm.times[i].readOnly = true;
              }
            }
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        }
      );
    },
    getPlaceTree(){
      let params = {
          school_id: localStorage.getItem('schoolId'),
      }
      this.$api.Common.getPlaceTree('get',params).then(res => {
          console.log('获取场所树', res.data.data,this.classTimeForm.roomsData)
          if (res.data.code == 600 || res.data.code == 0) {
              this.fromData = res.data.data;
              if(this.chooseType == 0){
                this.listClassroom = [];
              }else{
                setTimeout(() => {
                  this.$refs.childTree.$refs["from-tree"].setCheckedKeys(this.classTimeForm.roomsData);
                  let checkArr = [];
                  let checkedNodes = this.$refs.childTree.$refs["from-tree"].getCheckedNodes(true);
                  for (let g = 0; g < checkedNodes.length; g++) {
                    let getNode = this.$refs.childTree.$refs["from-tree"].getNode(checkedNodes[g]);
                    console.log(66,getNode);
                      checkArr.push(checkedNodes[g])
                  }
                  for (let k = 0; k < checkArr.length; k++) {
                    let getNode = this.$refs.childTree.$refs["from-tree"].getNode(checkArr[k]);
                    // console.log(getNode,checkArr[k])
                    checkArr[k].pname = getNode.parent.label
                    checkArr[k].disabled = 1;
                  }
                  this.listClassroom = checkArr;
                  checkArr.forEach(item=>{
                    item.classId = item.id,
                    item.placeName = item.pname,
                    item.studentId = item.id,
                    item.id = item.id,
                    item.buildingName = item.label,
                    item.children = []
                  })
                  console.log(this.$refs.childTree.$refs["from-tree"].getCheckedNodes(true),checkArr);
                  
                });
              }
          } else {
              this.isToast = true;
              this.toast = res.data.msg;
          }
      }).catch(err =>{
          this.tableLoading = false;
      })
    },
    cancelSave(){
      this.choosePlaceDialog = false;
      this.listClassroom = [];
    },
    
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
.class-time {
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
      margin-top: 8vh !important;
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
        .choose-time {
          .inner-box {
            width: 570px;
            overflow: hidden;
            border: 1px solid #e1e1e1;
            border-radius: 6px;
            .inner-top {
              width: 570px;
              height: 40px;
              line-height: 40px;
              li {
                float: left;
                font-size: 12px;
                color: #606266;
                width: 100px;
                margin-left: 45px;
                &:nth-of-type(1) {
                  width: 151px;
                  margin-left: 12px;
                }
                .el-switch {
                  margin-left: 10px;
                  .el-switch__label {
                    font-size: 12px;
                    margin-right: 5px;
                    color: #606266;
                    &.is-active {
                      color: #606266;
                    }
                  }
                }
                &:nth-of-type(4) {
                  width: 65px;
                }
              }
            }
            .time-list {
              width: 570px;
              max-height: 325px;
              overflow: auto;
              li {
                width: 100%;
                height: 40px;
                line-height: 40px;
                overflow: hidden;
                border-top: 1px solid #e1e1e1;
                &:nth-last-of-type(1) {
                  border-bottom: 1px solid #e1e1e1;
                }
                div {
                  font-size: 12px;
                  color: #606266;
                }
                .section {
                  width: 140px;
                  margin-left: 12px;
                  float: left;
                }
                .start-time {
                  width: 100px;
                  margin-left: 45px;
                  float: left;
                }
                .end-time {
                  width: 100px;
                  margin-left: 45px;
                  float: left;
                }
                .del {
                  width: 65px;
                  margin-left: 45px;
                  float: left;
                }
                .el-date-editor {
                  width: 100px;
                  .el-input__inner {
                    padding-right: 5px;
                    padding-left: 25px;
                  }
                }
              }
            }
            .button-div {
              margin: 10px 20px;
            }
          }
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
