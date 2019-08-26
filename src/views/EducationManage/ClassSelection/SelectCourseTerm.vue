<template>
  <div class="select-course-term">
    <div class="m-left">
			<h4>上课教室</h4>
			<div class="inner">
				<el-input placeholder="请输入姓名或工号" v-model="filterText" size="small"></el-input>
				<el-tree
					:data="treeData"
					ref="tree"
					node-key="id"
					default-expand-all
					:check-on-click-node="true"
					:filter-node-method="filterNode"
					@node-click="handleNodeClick">
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
					<el-option v-for="item in yearData"  :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
        <el-upload class="upload-demo" ref="upload" name="excel"
          :action="`${this.serverUrl}edu/importClassfiedTimetables`"
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
            <dd>走班课程 <span>({{ 0 }})</span></dd>
            <img src="../../../assets/images/add_no.png" alt="" class="add-no" @click="addCourseClick">
            <img src="../../../assets/images/add_ac.png" alt="" class="add-ac" @click="addCourseClick">
          </div>
          <div class="course-list">
            <el-tree
              :data="treeCourse"
              ref="tree"
              node-key="id"
              default-expand-all
              :check-on-click-node="true"
              :filter-node-method="filterNode"
              @node-click="handleCourseClick">
              <span class="select-span" :ref="'course'+data.id" slot-scope="{ node, data }">
                {{data.label}} <span v-show="data.group == 104"></span>
              </span>
            </el-tree>
          </div>
        </div>
        <div class="course-right">
          <div class="course-right-top">
            <dd>{{checkedClassroom.label?checkedClassroom.label+' 课表':'请选择上课教室'}}</dd>
            <el-checkbox v-model="isShowTeacher">任课教师</el-checkbox>
            <Button :title="saveShow?'保存':'编辑'" :btnClass="saveShow?'custom8':'custom6'" btnFontSize="12px" @click="editSave"></Button>
          </div>
            <div class="table-box">
              <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark"
                  highlight-current-row style="width: 100%" @cell-click="cellClick" v-loading="tableLoading">
                <el-table-column show-overflow-tooltip prop="section_name" width="160" :render-header="renderProductId"></el-table-column>
                <el-table-column :prop="week.week" min-width="100" :label="week.title" show-overflow-tooltip v-for="(week, index) of weekData" :key="index">
                  <template slot-scope="scope">
                    <dd>{{scope.row['subject_name'+week.week]}}</dd><!-- :'未找到任课教师' -->
                    <dd v-if="isShowTeacher && scope.row['subject_name'+week.week]">{{scope.row["subject_teacher"+week.week]?scope.row["subject_teacher"+week.week]:'未找到任课教师'}}</dd>
                    <dd v-else-if="isShowTeacher && !scope.row['subject_name'+week.week]"></dd>
                    <i class="iconfont icon-chuyidong" v-show="saveShow && checkedClassroom.label && checkedCourse.label && scope.row['subject_name'+week.week]" @click.stop="delTeacher(scope.row,week.week)"></i>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="course-percent">
              <p>排课完整率：<span>{{this.totalRate}}%</span></p>
              <dl>
                <dt>已排课程节数统计 ： </dt>
                <dd v-for="(item, index) in totalData" :key="index">
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
              <el-option v-for="item in yearData"  :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
          </el-form-item>
  
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                @click="copyShow = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                @click="saveCopyClick"></Button>
      </span>
    </el-dialog>
    <!-- 新建，修改课程 -->
		<el-dialog title="新建课程" :visible.sync="selectFormDialog" width="560px" center class="member-dialog">
      <div class="content">
        <el-form ref="selectForm" label-width="100px" :rules="rules" :model="selectForm">
          <el-form-item label="课程名称：" prop="name">
            <el-input v-model="selectForm.name" placeholder="请输入课程名称" style="width:300px;" size="small"></el-input>
          </el-form-item>
          <el-form-item label="备注：" prop="remarks">
              <el-input v-model="selectForm.remarks" placeholder="请输入备注内容" type="textarea" 
                :autosize="{ minRows: 3, maxRows: 6}" style="width:300px;" size="small"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                @click="selectFormDialog = false"></Button>
        <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                @click="saveBtnClick"></Button>
      </span>
    </el-dialog>
    <!-- 新建，修改走班课程 -->
		<el-dialog title="新建走班课程" :visible.sync="selectFormDialog" width="800px" center class="member-dialog">
      <div class="content">
        <el-form ref="selectForm" label-width="110px" :rules="rules" :model="selectForm">
          <el-form-item label="走班课程类型：" prop="courseType">
            <el-select v-model="selectForm.courseType" placeholder="请选择走班课程" @change="changeCourseType" size="medium" style="width:250px;">
              <el-option v-for="item in courseData"  :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="年级：" prop="grade">
            <el-select v-model="selectForm.grade" placeholder="请选择学年" @change="changeGrade" style="width:250px;" size="medium">
              <el-option
                v-for="item in gradeData"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>            
            </el-select>
          </el-form-item>
          <el-form-item label="走班课程数量：" prop="cousrseCount">
            <el-input-number v-model="selectForm.cousrseCount" :min="0" @change="handleChange" size="medium" style="width:250px;"></el-input-number>
          </el-form-item>
          <el-form-item label="走班课程列表：" class="choose-time">
            <div class="inner-box">
              <ul class="inner-top clearfix">
                <li>序号</li>
                <li>走班课程</li>
                <li>任课教师</li>
                <li>操作</li>
              </ul>
              <ul class="time-list">
                <li v-for="(item, index) in selectForm.courseData" :key="index">
                  <div>
                    <span>{{index+1}}</span>
                  </div>
                  <div>
                    <el-tooltip v-if="item.courseName" class="item" effect="dark" :content="item.courseName" placement="top">
                      <el-input v-model="item.courseName" placeholder="输入走班课程" clearable size="small"></el-input>
                    </el-tooltip>
                    <el-input v-else v-model="item.courseName" placeholder="输入走班课程" clearable size="small"></el-input>
                  </div>
                  <div>
                    <el-select v-model="item.teacherName" placeholder="选择教师" @change="changeTeacher" size="small" style="width:250px;">
                      <el-option
                        v-for="item in teacherData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                      ></el-option>
                    </el-select>
                  </div>
                  <div>
                    <el-button class="warning" size="mini" plain @click="delCourse(item,index)">删除</el-button>
                  </div>
                </li>
              </ul>
            </div>
          </el-form-item> 
        </el-form> 
      </div>             
      <span slot="footer" class="dialog-footer">
      <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="selectFormDialog = false"></Button>
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
  name: "SelectCourseTerm",
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
        // {
        //   id: 1000,
        //   pid: 101,
        //   label: "烟台一中",
        //   group: 102,
        //   isLeaf: 0,
        //   isSystem: 0,
        //   children: [
        //     {
        //       id: 10000,
        //       pid: 1000,
        //       label: "初中校区",
        //       group: 103,
        //       isLeaf: 0,
        //       isSystem: 1,
        //       children: [
        //         {
        //           id: 10010,
        //           pid: 10000,
        //           label: "校门口",
        //           group: 104,
        //           isLeaf: 1,
        //           isSystem: 1,
        //           children: []
        //         },
        //         {
        //           id: 10011,
        //           pid: 10000,
        //           label: "传达室",
        //           group: 104,
        //           isLeaf: 1,
        //           isSystem: 1,
        //           children: []
        //         },
        //         {
        //           id: 10012,
        //           pid: 10000,
        //           label: "教学楼",
        //           group: 104,
        //           isLeaf: 1,
        //           isSystem: 1,
        //           children: []
        //         }
        //       ]
        //     },
        //     {
        //       id: 10001,
        //       pid: 1000,
        //       label: "高中校区",
        //       group: 103,
        //       isLeaf: 0,
        //       isSystem: 0,
        //       children: [
        //         {
        //           id: 10020,
        //           pid: 10001,
        //           label: "校门口",
        //           group: 104,
        //           isLeaf: 1,
        //           isSystem: 0,
        //           children: []
        //         },
        //         {
        //           id: 10021,
        //           pid: 10001,
        //           label: "传达室",
        //           group: 104,
        //           isLeaf: 1,
        //           isSystem: 0,
        //           children: []
        //         },
        //         {
        //           id: 10022,
        //           pid: 10001,
        //           label: "教学楼",
        //           group: 104,
        //           isLeaf: 1,
        //           isSystem: 0,
        //           children: []
        //         }
        //       ]
        //     }
        //   ]
        // }
      ],
      treeCourse: [
        // {
        //   id: 40,
        //   label: "体育",
        //   pid: -1,
        //   children: [
        //     {
        //       id: 8,
        //       pid: 40,
        //       label: "体育11"
        //     },
        //     {
        //       id: 9,
        //       pid: 40,
        //       label: "体育2"
        //     }
        //   ]
        // },
        // {
        //   id: 50,
        //   label: "数学",
        //   pid: -1,
        //   children: [
        //     {
        //       id: 81,
        //       pid: 50,
        //       label: "数学11"
        //     },
        //     {
        //       id: 91,
        //       pid: 50,
        //       label: "数学2"
        //     }
        //   ]
        // }	
      ], //走班课程tree
      courseList: [
        // {
        //   id: 1,
        //   name: "体育11"
        // }
      ],
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
      checkedClassroom: {
        id: -1,  //选中的教室id
        label: "",
        group: 0,
        pid: -1, //选中的(父节点)年级id
        plabel: "",
        pgroup: 0,        
      }, //左侧教室选择
      checkedCourse: {}, //左侧教室选择
      courseData: [
        // {
        //   courseId: "1",
        //   courseName: "语文"
        // },
        // {
        //   courseId: "2",
        //   courseName: "数学"
        // },
        // {
        //   courseId: "3",
        //   courseName: "英语"
        // },
        // {
        //   courseId: "4",
        //   courseName: "历史"
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
      selectFormDialog: false, //新建、修改走班课程弹窗
      selectForm: {
        courseType: "", //走班课程
        grade: "", //年级
        cousrseCount: "",
        courseData: []
      }, //新建、修改走班课程from
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
        $(".select-course-term .table-box").height(tblH);
        $(".select-course-term .course-list").height(tblH + cpH + 40);
        console.log(66, icH, etH, ttH, tblH);
        // console.log(66, icH,etH,ltH)
        let leftTreeH = icH - etH - ltH - elInputH - 30;
        $(".select-course-term .m-left .inner .el-tree").height(leftTreeH);
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
      console.log(data, node);
      if (data.level == 5) {
        $(".span").removeClass("custom-tree-node");
        this.$refs[data.id].classList.add("custom-tree-node");
        // this.checkedClassroom = data;

        this.checkedClassroom.id = data.id;
        this.checkedClassroom.label = data.label;
        // this.checkedClassroom.group = data.group;
        this.checkedClassroom.pid = node.parent.data.id;
        this.checkedClassroom.plabel = node.parent.data.label;
        // this.checkedClassroom.pgroup = node.parent.data.group;  
        console.log("---checkedClassroom---",this.checkedClassroom);

        this.getTimetables();
      }      
    },
    /**
     *  @function: 左侧树点击
     *  @author: cs
     *  @date 2018-12-05
     **/
    handleCourseClick(data, node) {
      console.log(data, node);
      if (!data.children) {
        $(".select-span").removeClass("custom-tree-node");
        this.$refs["course" + data.id].classList.add("custom-tree-node");
        this.checkedCourse = data;
        console.log(this.checkedCourse.label);
      }
    },
    /**
     *  @function: 单元格点击--新增教师排课
     *  @author: cs
     *  @date 2018-12-24
     **/
    cellClick(row, column, cell, event) {
      if (!this.saveShow) return;
      if (JSON.stringify(this.checkedClassroom) == "{}") return;
      if (column.property == "section_name") return;
      // console.log(row, column, cell,row[column.property]);
      let index = "";
      this.tableData.forEach((item, i) => {
        if (item.section_name == row.section_name) {
          index = i;
          return;
        }
      });
      // console.log("index",index,row[column.property]);
      if (this.checkedCourse.label != row["subject_name" + column.property]) {
        row["subject_name" + column.property] = this.checkedCourse.label; // 左侧不等于表格值时将表格赋值为左侧
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
              item.classfied_subject_id = this.courseList.filter(item => {
                return item.name == this.tableData[i]['subject_name' + k];
              })[0].id; 
              subjectArr.push(item);
            } else {
              // item.subject_id = 0; 
            }
          }
        }
        console.log("subjectArr", subjectArr);
        this.postClassfiedTimetables(subjectArr); //新增修改排课信息
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
      this.postClassfiedTimetablesCopy(); 
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
      this.currentCourseName = item.currentCourseName;
    },
    /**
     *  @function:新增走班课程
     *  @author: cs
     *  @date 2018-12-05
     **/
    addCourseClick() {
      console.log("新增走班课程");
      this.selectFormDialog = true;
      (this.selectForm = {
        courseType: "", //走班课程
        grade: "", //年级
        cousrseCount: "",
        courseData: []
      }), //新建、修改走班课程from
        setTimeout(() => {
          this.$refs.selectForm.resetFields();
        }, 20);
    },
    /**
     *  @function: 新增,修改课程->点击保存按钮
     *  @author: cs
     *  @date 2018-12-22
     **/
    saveBtnClick() {
      console.log("新增,修改课程->点击保存按钮", this.selectForm);
      this.$refs["selectForm"].validate(valid => {
        if (valid) {
          this.selectFormDialog = false;
          console.log("addDeviceForm", this.selectForm);
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
     *  @function: 删除走班课程
     *  @author: cs
     *  @date 2018-12-25
     */
    delCourse(item, index) {
      console.log("删除走班课程:", item, index);
      this.selectForm.courseData.splice(index, 1);
    },    
    /**
     *  @function: 改变计数器的值
     *  @author: cs
     *  @date 2018-12-25
     */
    handleChange(value) {
      console.log("改变计数器的值:", value, this.selectForm.courseData.length, this.courseName);
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
     *  @function: 获取选课表格
     *  @author: cs
     *  @date 2019-01-09
     */
    changeCourseType(value) {
      console.log("change下拉框的值:", value);
      this.courseData.forEach(item => {
        if (item.id == value) {
          return (this.courseName = item.name);
        }
      });
      console.log(this.courseName);

      // this.teacherList 中取出 选中的 this.courseName 相关的 教师
      // this.teacherData = ---- do ----
      this.teacherData = [];
      this.teacherList.forEach(item => {
        return (this.teacherData.push({
          id: item.userSerial,
          name: item.userName,
        }));
      });
      console.log("this.teacherData",this.teacherData);
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
     *  @function: 查询排课表格
     *  @author: cs
     *  @date 2019-01-09
     */
    getTimetables() {
      if(this.checkedClassroom.id == -1) return;
      let params = {
        semester_id: this.yearid,
        classroom_id: this.checkedClassroom.id,
        school_id: localStorage.getItem("schoolId"),
      };
      console.log("params", params);
      this.tableData = [];
      this.$api.EducationManage.getClassfiedTimetables("get", params)
        .then(res => {
          console.log("查询排课表格", res.data.data);
          this.tableLoading = false;
          if (res.data.code == 600 || res.data.code == 0) {
            let data = res.data.data;
            // for (let i = 0; i < data.length; i++) {
            //   let item = {};
            //   for (let k = 0; k < data[i].length; k++) {
            //     // console.log(data[i][k].subject_name);
            //     item.section_name = data[i][k].section_name;
            //     item["subject_name" + data[i][k].week] = data[i][k].subject_name;
            //     item["subject_teacher" + data[i][k].week] = data[i][k].teacher_name;
            //   }
            //   this.tableData.push(item);
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
                // item["subject_teacher" + data[i].detail[k].week] = data[i].detail[k].teacher_name;
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
     *  @function: 新增走班排课
     *  @author: zlb
     *  @date 2019-02-21
     **/
    postClassfiedSubject() {
      let arrResult = [];
      let body = {
        semester_id: this.yearid,
        school_id: localStorage.getItem("schoolId"),
        classroom_id: this.checkedClassroom.id,
        arr_data: [
          {
            classfied_subject_id: 1,
            week: 2,
            section_name: "第2节"
          }
        ]
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
     *  @function: 删除走班排课
     *  @author: zlb
     *  @date 2019-02-21
     **/
    deleteClassfiedSubjectById() {
      let arrResult = [];

      let body = {
        teacher_id: 3,
        name: "走班课程名称"
      };
      this.$api.EducationManage.deleteClassfiedSubjectById("delete", body)
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
              this.getTimetables();
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
     *  @function: 新增、修改排课信息--table
     *  @author: ly
     *  @date 2019-01-25
     */
    postClassfiedTimetables(data) {
      let params = {
        semester_id: this.yearid,
        classroom_id: this.checkedClassroom.id,
        school_id: localStorage.getItem("schoolId"),
        arr_data: data
      };
      console.log("params",params);
      this.$api.EducationManage.postClassfiedTimetables('post', params)
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
     *  @function: 根据排课周期下拉查询排课信息--table
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
        classroom_id: this.checkedClassroom.id,
        school_id: localStorage.getItem("schoolId")
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
        classroom_id: this.checkedClassroom.id,
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
     *  @function: 获取树结构
     *  @author: cs
     *  @date 2018-12-19
     */
    getPlaceTree() {
      let params = {
        school_id: localStorage.getItem("schoolId")
      };
      this.$api.Common.getPlaceTree("get", params)
        .then(res => {
          console.log("查上课教室树：", res.data.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.treeData = res.data.data;
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
     *  @function: 查询树形走班科目
     *  @author: ly
     *  @date 2019-02-16
     */
    getClassfiedSubjectTree() {
      let params = {
        school_id: localStorage.getItem("schoolId")
      };
      this.tableLoading = true;
      this.$api.EducationManage.getClassfiedSubjectTree("get", params)
        .then(res => {
          console.log("查走班课程树", res.data.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.treeCourse = res.data.data;
            // 树形children结构转换一维数组courseList
            this.courseList = [];
            for(let i = 0; i < this.treeCourse.length; i++) {
              if(this.treeCourse[i].children) {
                this.treeCourse[i].children.forEach(item => {
                  this.courseList.push({
                    id: item.id,
                    name: item.label
                  });
                })
              }
            }
            console.log("this.courseList",this.courseList);
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
    postClassfiedTimetablesCopy() {
      let params = {
        origin_semester_id: this.copyForm.yearid,
        target_semester_id: this.yearid,
        school_id: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.postClassfiedTimetablesCopy("post", params)
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
        //批量删除学校
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
          schoolyear_id: this.yearid,
          school_id: localStorage.getItem("schoolId"), // 按学校删除
        };        
      } else if(this.batchOption == 1){
         //批量删除年级
        params = {
          schoolyear_id: this.yearid,
          grade_id: this.checkedClassroom.pid,
          school_id: localStorage.getItem("schoolId"),
        };            
      } else if(this.batchOption == 2){
        //批量删除班级
        params = {
          schoolyear_id: this.yearid,
          class_id: this.checkedClassroom.id
        };           
      }
      console.log("删除param:",params);
      this.$api.EducationManage.postClassfiedTimetablesDelete("post", params)
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
    /**
     *  @function: 获取课程数据
     *  @author: ly
     *  @date 2019-02-16
     */
    getCourse() {
      let params = {
        schoolid: localStorage.getItem("schoolId"),
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
    this.getPlaceTree(); //左侧上课教室树
    this.getClassfiedSubjectTree(); //中间走班课程树
    this.getTimetablesSemesterList(); //排课学年下拉列表
    this.getTimetables(); //查询排课表格

    this.getCourse(); //获取课程信息 -- 增加走班课程页面下拉列表用
    this.getTeacherList(); //获取教师列表
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.select-course-term {
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
        display: inline-block !important;
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
        flex-basis: 235px;
        min-width: 235px;
        font-size: 12px;
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
          .el-tree {
            padding: 20px 0 20px 20px;
            height: 100%;
            overflow: auto;
          }
          .select-span {
            padding: 5px 20px;
          }
          .custom-tree-node {
            background-color: #1cab7d;
            color: #fff;
            // border-radius: 5px;
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
