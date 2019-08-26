<template>
  <div class="school-calendar">
    <div class="content-box">
      <div class="calendar-top">
        <dd>校历周期：</dd>
        <el-select v-model="yearid" placeholder="请选择学年" size="medium" style="width:270px;" @change="chooseCalendar">
          <el-option
            v-for="item in yearData"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
        <Button title="导出" btnClass="custom6" btnFontSize="12px" @click=""></Button>
      </div>
      <div class="calendar-wrap">
        <ul class="calendar-tip clearfix">
          <li
            v-for="(item, index) in typeData"
            :key="index"
          >
            <span :style="'background-color:'+colorData[item.value]"></span>
            {{item.title}}
          </li>
        </ul>
        <div class="table-box">
          <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="dateData" tooltip-effect="dark" highlight-current-row style="width: 100%"
            :span-method="objectSpanMethod" @cell-click="cellClick" :cell-class-name="cellClassName" v-loading="tableLoading"
          >
            <el-table-column label="月份" align="center" prop="month" min-width="80" class-name="month-column">
              <template slot-scope="scope">
                <span>{{monthData[scope.row.month]+'月' }}</span>
              </template>
            </el-table-column>
            <el-table-column label="周次" align="center" prop="week" min-width="100" class-name="week-column">
              <template slot-scope="scope">
                <span :class="{'current-week':scope.row.week == currentWeekIndex}">{{`第${scope.row.week+1}周`}}</span>
              </template>
            </el-table-column>
            <el-table-column :prop="item.key" min-width="100" :label="item.title"
              v-for="(item, index) in weekData"
              :key="index"
            >
              <template slot-scope="scope">
                <el-popover placement="right" v-show="scope.row.dayData[index].day" width="350" v-model="scope.row.dayData[index].visible">
                  <div class="remarks-form">
                    <i
                      class="iconfont icon-chuyidong"
                      @click="scope.row.dayData[index].visible = false;"
                    ></i>
                    <el-form ref="remarksForm" label-width="110px" label-position="right" :rules="rules" :model="remarksForm">
                      <el-form-item label="日期类型：">
                        <el-select v-model="remarksForm.remarksType" placeholder="请选择日期" size="medium" style="width:200px;">
                          <el-option
                            v-for="item in remarkTypeData"
                            :key="item.remarksType"
                            :label="item.remarksTypeName"
                            :value="item.remarksType"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="原上课日期：" v-show="remarksForm.remarksType == 2">
                        <el-date-picker v-model="remarksForm.replaceDate" type="date" placeholder="请选择原上课日期"
                          :picker-options="pickerOptions" value-format="yyyy-MM-dd" size="medium" style="width:200px;"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item label="开始日期：" v-show="remarksForm.remarksType == 3">
                        <el-date-picker v-model="remarksForm.startDate" type="date" placeholder="请选择开始日期" 
                          :picker-options="pickerOptions" :validate-event="false" value-format="yyyy-MM-dd" size="medium" style="width:200px;"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item label="结束日期：" v-show="remarksForm.remarksType == 3">
                        <el-date-picker v-model="remarksForm.endDate" type="date" placeholder="请选择结束日期"
                          :picker-options="pickerOptions" :validate-event="false" value-format="yyyy-MM-dd" size="medium" style="width:200px;"
                        ></el-date-picker>
                      </el-form-item>
                      <el-form-item label="备注内容：">
                        <el-input type="textarea" v-model="remarksForm.remarks" style="width:200px;" placeholder="请输入备注内容"></el-input>
                      </el-form-item>
                    </el-form>
                    <Button title="取消" btnClass="custom6" btnFontSize="12px" btnHeight="3.5vh" @click="scope.row.dayData[index].visible = false;"></Button>
                    <Button title="确定" btnClass="custom8" btnFontSize="12px" btnHeight="3.5vh" @click="saveChangeType(scope.row.dayData[index])"></Button>
                  </div>
                  <div slot="reference" class="inner-box">
                    <span class="day"
                      :class="{'weekend':item.key == 'Sunday' || item.key == 'Saturday',
                               'today':formatTime(new Date()) == scope.row.dayData[index].day}"
                    >
                      {{scope.row.dayData[index][item.key]}}
                    </span>
                    <span class="today-icon" v-show="formatTime(new Date()) == scope.row.dayData[index].day">今天</span>
                    <br>
                    <span>{{scope.row.dayData[index].remarks}}</span>
                  </div>
                </el-popover>
              </template>
            </el-table-column>
            <el-table-column label="校历说明" align="center" prop="remarks" min-width="200">
              <template slot-scope="scope">
                <div class="remarks">
                  <p>{{scope.row.remarks?scope.row.remarks:"点击输入校历说明"}}</p>
                  <div class="modal" @click.stop="inputShow(scope.row)">
                    <span class="edit">编辑</span>
                  </div>
                  <el-container v-show="scope.row.showInput">
                    <el-main>
                      <el-input type="textarea" placeholder="请输入校历说明" v-model="scope.row.remarks"></el-input>
                    </el-main>
                    <el-footer>
                      <el-button type="primary" size="small" @click.stop="saveRemarks(scope.row)">保存</el-button>
                    </el-footer>
                  </el-container>
                </div>

              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
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
  computed: {},
  data() {
    return {
      pickerOptions: this.setPickerOptions(),
      defArrow: this.$store.state.Common.defaultLineArrow, //右侧导航默认箭头
      isToast: false, //toast是否展示
      toast: "", //toast提示内容
      tableLoading: false, //表格loading
      yearid: "1", //选中的学年
      yearData: [], //学年数据
      remarkTypeData: [
        {
          remarksType: 1,
          remarksTypeName: "正常"
        },
        {
          remarksType: 2,
          remarksTypeName: "调课"
        },
        {
          remarksType: 3,
          remarksTypeName: "放假"
        }
        // {
        //     remarksType: 4,
        //     remarksTypeName: "特殊"
        // }
      ], //学年数据
      typeData: [
        {
          value: "0",
          title: "正常"
        },
        {
          value: "1",
          title: "周末"
        },
        {
          value: "2",
          title: "调课"
        },
        {
          value: "3",
          title: "放假"
        },
        {
          value: "4",
          title: "特殊"
        }
      ], //所属楼宇数据
      colorData: ["#303133", "#b4b4b4", "#ffc05c", "#ff7e7f", "#78d97f"], //颜色数组
      weekData: [
        {
          title: "周一",
          key: "Monday"
        },
        {
          title: "周二",
          key: "Tuesday"
        },
        {
          title: "周三",
          key: "Wednesday"
        },
        {
          title: "周四",
          key: "Thursday"
        },
        {
          title: "周五",
          key: "Friday"
        },
        {
          title: "周六",
          key: "Saturday"
        },
        {
          title: "周日",
          key: "Sunday"
        }
      ], //周
      currentWeekIndex: "", //当前周
      monthData: [
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
        "十",
        "十一",
        "十二"
      ], //月
      dateData: [], //日期数据
      startDate: "2018-09-01", //学期开始时间
      endDate: "2019-08-31", //学期结束时间
      remarksForm: {
        remarksType: 1, //类型 1正常 2调课 3放假
        replaceDate: [], //补课时间
        startDate: [], //开始时间
        endDate: [], //结束时间
        remarks: "", //备注内容
        replaceDate: "2018-12-20",
        startDate: "",
        endDate: ""
      }, //调整校历类型
      rules: {
        remarksType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        chooseDate: [
          {
            type: "date",
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ]
      },

      // add by ly
      semesterData: [], //学期数据 id、起始、名称
      monthMarkData: [], //月份备注信息 id、年月、备注
      calendarData: [], //日历信息 id、日期、类型、备注、调课日期
      //某起止日期在 this.dateData 中的 rowIndex,dayIndex
      dayIndex: {
        start: {
          rowIndex: -1,
          dayIndex: -1
        },
        end: {
          rowIndex: -1,
          dayIndex: -1
        }
      }
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
        let ctH = $(".index .calendar-top").height();
        let tipH = $(".index .calendar-tip").height();
        let tblH = icH - etH - ctH - tipH - 10;
        console.log(666, icH, etH, ctH, tipH);
        $(".school-calendar .table-box").height(tblH);
        // $(".school-calendar").height(icH - etH -15);
        $(".school-calendar").css({ "max-height": icH - etH - 10 });
      }, 20);
    },
    /**
     *  @function:日历格式
     *  @author: cs
     *  @date:2018-12-22
     **/
    formatTime(time, spliter = "-") {
      if (!time) return;
      let date = new Date(time);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
      return `${year}${spliter}${month}${spliter}${day}`;
    },
    /**
     *  @function: 获取年月格式 201901
     *  @author: ly
     *  @date:2019-01-29
     **/
    getYearMonth(time, spliter = "") {
      if (!time) return;
      let date = new Date(time);
      let year = date.getFullYear();
      let month =
        date.getMonth() + 1 >= 10
          ? date.getMonth() + 1
          : "0" + (date.getMonth() + 1);
      return `${year}${spliter}${month}`;
    },
    /**
     *  @function:通过起止时间画出日历
     *  @author: cs
     *  @date:2018-12-22
     **/
    getAllDate() {
      if (this.calendarData.length <= 0 || this.semesterData.length <= 0)
        return;
      let newArr = [];
      let startDate = this.semesterData[0].beginData;
      let endDate = this.semesterData.length > 1 ? this.semesterData[1].endData : this.semesterData[0].endData;

      let st = startDate.split("-");
      let et = endDate.split("-");
      let startTime = new Date(st[0], st[1] - 1, st[2]).getTime();
      let endTime = new Date(et[0], et[1] - 1, et[2]).getTime();
      let idx = 0;
      for (let i = startTime; i <= endTime; ) {
        // console.log("Date(i)", this.formatTime(new Date(i)));
        // if (this.calendarData[idx]) {
        //   console.log("Date(calendar)", this.calendarData[idx].date);
        // } else {
        //   console.log("Date(calendar) is null");
        // }
        if (
          !this.calendarData[idx] ||
          this.formatTime(new Date(i)) != this.calendarData[idx].date
        ) {
          // console.log("idx !!= ", idx);
          let tt_space = {
            id: 0,
            yearMonth: "",
            date: this.formatTime(new Date(i)),
            semesterid: 0,
            remarksType: 0,
            remarks: "",
            replaceDate: null
          };
          newArr.push(tt_space);
        } else {
          // console.log("idx === ", idx);
          newArr.push(this.calendarData[idx]);
          idx += 1;
        }
        i += 24 * 60 * 60 * 1000;
      }
      console.log("newArr", newArr);

      let firstSpace = 0;
      // 空结构
      let t_space = {
        id: 0,
        yearMonth: "",
        date: "",
        semesterid: 0,
        remarksType: 0,
        remarks: "",
        replaceDate: null
      };
      firstSpace = new Date(newArr[0].date).getDay();
      firstSpace = (firstSpace + 6) % 7; //getDay()得到的周几加6对7取余得到开始日期距离第一个的位置
      for (let i = 0; i < firstSpace; i++) {
        newArr.unshift(t_space); //第一行补足7条
      }
      let endSpace = 7 - (newArr.length % 7);
      for (let i = 0; i < endSpace; i++) {        
        newArr.push(t_space); //最后一行补足7条
      }

      let dateArr = [];
      let length = Math.ceil((newArr.length - firstSpace) / 7);
      console.log("newArr.length % 7", newArr.length, newArr.length % 7);

      for (let i = 0; i < length; i++) {
        let row = {};
        // row.week = `第${i + 1}周`;
        row.week = i;
        row.remarks = "";
        row.showInput = false;

        row.dayData = [];
        let monthStatus = true;
        for (let k = 0; k < 7; k++) {
          // console.log("i,k",i,k);
          if (monthStatus && newArr[7 * i + k].date) {
            row.month = new Date(newArr[7 * i + k].date).getMonth();
            monthStatus = false;
          }
          let cell = {};
          if (newArr[7 * i + k].date) {
            if (new Date(newArr[7 * i + k].date).getDay() == 1) {
              cell.Monday = new Date(newArr[7 * i + k].date).getDate();
            } else if (new Date(newArr[7 * i + k].date).getDay() == 2) {
              cell.Tuesday = new Date(newArr[7 * i + k].date).getDate();
            } else if (new Date(newArr[7 * i + k].date).getDay() == 3) {
              cell.Wednesday = new Date(newArr[7 * i + k].date).getDate();
            } else if (new Date(newArr[7 * i + k].date).getDay() == 4) {
              cell.Thursday = new Date(newArr[7 * i + k].date).getDate();
            } else if (new Date(newArr[7 * i + k].date).getDay() == 5) {
              cell.Friday = new Date(newArr[7 * i + k].date).getDate();
            } else if (new Date(newArr[7 * i + k].date).getDay() == 6) {
              cell.Saturday = new Date(newArr[7 * i + k].date).getDate();
            } else if (new Date(newArr[7 * i + k].date).getDay() == 0) {
              cell.Sunday = new Date(newArr[7 * i + k].date).getDate();
            }
            cell.day = new Date(newArr[7 * i + k].date)
              ? this.formatTime(new Date(newArr[7 * i + k].date))
              : "";
            if (cell.day == this.formatTime(new Date())) {
              console.log("cell.day", cell.day);
              this.currentWeekIndex = i;
            }
          }

          cell.id = newArr[7 * i + k].id;
          cell.yearMonth = newArr[7 * i + k].yearMonth;
          cell.semesterid = newArr[7 * i + k].semesterid;
          cell.remarksType = newArr[7 * i + k].remarksType;
          cell.remarks = newArr[7 * i + k].remarks;
          cell.replaceDate = newArr[7 * i + k].replaceDate;

          cell.visible = false;
          row.dayData.push(cell);
        }

        let ymonth = this.getYearMonth(row.dayData[0].day);
        if (ymonth === undefined) {
          ymonth = this.getYearMonth(row.dayData[6].day);
        }
        // console.log("ymonth", ymonth);
        let monthMarkid = 0;
        let remarks = "";
        this.monthMarkData.forEach((item, index) => {
          if (item.yearMonth == ymonth) {
            monthMarkid = item.id;
            remarks = item.monthRemarks;
          }
          return false;
        });
        // console.log("monthMarkid", monthMarkid);
        row.monthMarkid = monthMarkid;
        row.remarks = remarks;

        dateArr.push(row);
      }

      this.dateData = dateArr;
      this.getSpanArr(this.dateData); //获取跨行跨列数据(时段)
      console.log(1112211, this.dateData);
      setTimeout(() => {
        /* let rtH = $('.el-table__row').eq(this.currentWeekIndex).offset().top ;
                let thH = $('.el-table__header-wrapper').height();
                let ttH = $('.table-box').offset().top ;;
                let scrollH = rtH - ttH - thH;
                $('.el-table__body-wrapper').scrollTop(scrollH) */
        let currentRow = document.getElementsByClassName("el-table__row")[
          this.currentWeekIndex
        ];
        let tableBody = document.getElementsByClassName(
          "el-table__body-wrapper"
        )[0];
        tableBody.scrollTop = currentRow.offsetTop;
      }, 1000);
      this.resizeLayout();
    },
    /**
     *  @function: 表格跨行方法
     *  @author: lxr
     *  @date 2018-7-17
     **/
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log(1234,row, column, rowIndex, columnIndex)
      if (columnIndex == 0 || columnIndex == 9) {
        const _row = this.spanArr[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col
        };
      }
    },
    /**
     *  @function: 表格跨行数据获取
     *  @author: lxr
     *  @date 2018-7-17
     **/
    getSpanArr(data) {
      // console.log("getSpanArr:",data)
      this.spanArr = [];
      for (let i = 0; i < data.length; i++) {
        if (i === 0) {
          this.spanArr.push(1);
          this.pos = 0;
        } else {
          // 判断当前元素与上一个元素是否相同--->找数组中相同的字段进行分组
          if (data[i].month == data[i - 1].month) {
            this.spanArr[this.pos] += 1;
            this.spanArr.push(0);
          } else {
            this.spanArr.push(1);
            this.pos = i;
          }
        }
      }
    },
    cancelClick(id) {
      console.log(123, id);
      console.log(this.$refs["popover" + id]);
    },
    /**
     *  @function: 单元格增加样式
     *  @author: cs
     *  @date 2018-12-28
     **/
    cellClassName({ row, column, rowIndex, columnIndex }) {
      // console.log(33333,row, column, rowIndex, columnIndex);
      for (let i = 0; i < row.dayData.length; i++) {
        if (row.dayData[i][column.property]) {
          if (row.dayData[i].remarksType == 1) {
            // console.log(row.dayData[i].remarksType);
            return "normal-box";
          } else if (row.dayData[i].remarksType == 2) {
            return "adjust-box";
          } else if (row.dayData[i].remarksType == 3) {
            return "leave-box";
          } else if (row.dayData[i].remarksType == 4) {
            return "special-box";
          }
        }
      }
    },
    /**
     *  @function: 单元格点击--新增教师排课
     *  @author: cs
     *  @date 2018-12-24
     **/
    cellClick(row, column, cell, event) {
      console.log("111", row, column);
      if (column.property == "week") return;
      if (column.property == "month") return;
      if (column.property == "remarks") {
        console.log("点击了备注:", row, column.property);
        return;
      }
      let dayIndex;
      row.dayData.forEach((week, index) => {
        if (week[column.property]) {
          console.log(week, [column.property], week[column.property], index);
          dayIndex = index;
          return false;
        }
      });
      console.log("dayIndex", dayIndex);
      if (dayIndex === undefined || dayIndex === null) return;
      let rowIndex = 0;
      this.dateData.forEach((item, index) => {
        // console.log("bijiao", item.dayData,row.dayData);
        if (item.dayData == row.dayData) {
          rowIndex = index;
        }
        return false;
      });
      console.log("rowIndex", rowIndex);
      console.log(
        row,
        column,
        row.dayData[dayIndex].day,
        row.dayData[dayIndex]
      );
      this.remarksForm = JSON.parse(JSON.stringify(row.dayData[dayIndex]));
      // this.$set(this.remarksForm,'replaceDate',row.dayData[dayIndex].day)
      // this.$set(this.remarksForm,'startDate',row.dayData[dayIndex].day)
      // this.$set(this.remarksForm,'endDate',row.dayData[dayIndex].day)
      this.remarksForm.dayIndex = dayIndex;
      this.remarksForm.rowIndex = rowIndex;
    },
    /**
     *  @function: 校历说明点击--显示文本域
     *  @author: cs
     *  @date 2018-12-27
     **/
    inputShow(row) {
      console.log("校历说明点击--显示文本域:");
      this.dateData.forEach(item => {
        item.showInput = false;
      });
      row.showInput = true;
    },
    /**
     *  @function: 保存校历说明
     *  @author: cs
     *  @date 2018-12-27
     **/
    saveRemarks(row) {
      console.log("保存校历说明", row);
      let monthMarkid = row.monthMarkid;
      let params = {
        monthRemarks: row.remarks,
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.putCalendarRemark(params, monthMarkid).then(
        res => {
          console.log("保存校历说明", res.data);
          if (res.data.code == 600 || res.data.code == 0) {
            //刷新校历
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        }
      );
      row.showInput = false;
    },
    /**
     *  @function: 保存校历类型
     *  @author: cs
     *  @date 2018-12-28
     **/
    saveChangeType(row) {
      console.log("保存校历类型", row, this.remarksForm);
      console.log("this.dateData", this.dateData);
      console.log("remarksForm.rowIndex", this.remarksForm.rowIndex);
      // row.visible = false;
      let cell = this.dateData[this.remarksForm.rowIndex].dayData[
        this.remarksForm.dayIndex
      ];
      if (this.remarksForm.remarksType != 3) {
        // 等于3放假时 选中日期无效 putCalendar 成功后 另处理
        cell.remarksType = this.remarksForm.remarksType;
        cell.remarks = this.remarksForm.remarks;
      }
      // cell.replaceDate = this.remarksForm.replaceDate;
      if (this.remarksForm.remarksType == 1) {
        console.log("正常");
      } else if (this.remarksForm.remarksType == 2) {
        console.log("调课");
        if (cell.replaceDate == this.remarksForm.replaceDate) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "当前日期不能与调课日期相同",
            duration: this.msgDuration
          });
          return;
        }
      } else if (this.remarksForm.remarksType == 3) {
        console.log("放假");
        if (
          new Date(this.remarksForm.startDate) >=
          new Date(this.remarksForm.endDate)
        ) {
          this.$message({
            showClose: true,
            type: "warning",
            message: "开始日期不能大于结束日期",
            duration: this.msgDuration
          });
          return;
        }
      }

      this.putCalendar(this.remarksForm);
      row.visible = false;
    },
    /**
     *  @function: 设置时间选择范围
     *  @author: cs
     *  @date 2018-12-28
     **/
    setPickerOptions() {
      let vThis = this;
      return {
        disabledDate(time) {
          // console.log(time);
          return (
            time.getTime() < new Date(vThis.startDate).getTime() ||
            time.getTime() > new Date(vThis.endDate).getTime()
          );
        }
      };
    },
    /**
     *  @function: 校历-获取周期下拉列表
     *  @author: cs
     *  @date 2018-01-11
     **/
    getCalendarlist() {
      let params = {
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getCalendarlist("get", params).then(res => {
        console.log("校历-获取周期下拉列表", res.data.data);
        if (res.data.code == 600 || res.data.code == 0) {
          this.yearData = res.data.data;
          if (this.yearData.length > 0) {
            this.yearid = this.yearData[0].id;
            this.getCalendar(this.yearid);
          }
        } else {
          this.isToast = true;
          this.toast = res.data.msg;
        }
      });
    },
    /**
     *  @function: 获取校历接口
     *  @author: cs
     *  @date 2018-01-11
     **/
    getCalendar(val) {
      let params = {
        yearid: val,
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.getCalendar("get", params).then(res => {
        console.log("获取校历", res.data.data);
        if (res.data.code == 600 || res.data.code == 0) {
          this.semesterData = res.data.data.semester;
          this.monthMarkData = res.data.data.monthMark;
          this.calendarData = res.data.data.calendar;

          this.getAllDate();
        } else {
          this.isToast = true;
          this.toast = res.data.msg;
        }
      });
    },
    /**
     *  @function: 选择校历查看
     *  @author: cs
     *  @date 2018-01-11
     **/
    chooseCalendar(val) {
      console.log("校历-获取校历信息", val);
      this.getCalendar(val);
    },
    /**
     *  @function: 获取某起止日期在 this.dateData 中的 rowIndex,dayIndex
     *  @author: ly
     *  @date 2019-01-24
     **/
    getIndexOfDateData(startVal, endVal = "") {
      let rst = {
        start: {
          rowIndex: -1,
          dayIndex: -1
        },
        end: {
          rowIndex: -1,
          dayIndex: -1
        }
      };
      let rowid = 0;
      let dayid = 0;
      let checkType = "start";
      let val = startVal;
      if (val == "" || val == undefined) {
        return rst;
      }
      while (true) {
        if (rowid >= this.dateData.length) {
          break;
        }
        if (this.dateData[rowid].dayData[dayid].day != val) {
          rowid = dayid + 1 > 6 ? rowid + 1 : rowid;
          dayid = dayid + 1 > 6 ? 0 : dayid + 1;
        } else {
          if (checkType === "start") {
            rst.start.rowIndex = rowid;
            rst.start.dayIndex = dayid;
            if (endVal === "") {
              break;
            } else {
              checkType = "end";
              val = endVal;
              rowid = dayid + 1 > 6 ? rowid + 1 : rowid;
              dayid = dayid + 1 > 6 ? 0 : dayid + 1;
            }
          } else {
            rst.end.rowIndex = rowid;
            rst.end.dayIndex = dayid;
            break;
          }
        }
      }
      return rst;
    },

    /**
     *  @function: 修改校历信息 type: 1正常 2调课 3放假
     *  @author: ly
     *  @date 2019-01-24
     **/
    putCalendar(val) {
      console.log("校历-修改校历信息 type: 1正常 2调课 3放假", val);
      let params = {
        type: val.remarksType,
        remarks: val.remarks,
        schoolid: localStorage.getItem("schoolId")
      };
      if (val.remarksType == 2) {
        params.replaceDate = val.replaceDate;
      } else if (val.remarksType == 3) {
        params.startDate = val.startDate;
        params.ednDate = val.endDate;
      }
      let CalendarID = val.id;

      console.log("params", params);
      if (val.remarksType == 3) {
        // 获取某起止日期在 this.dateData 中的 rowIndex,dayIndex
        this.dayIndex = this.getIndexOfDateData(val.startDate, val.endDate);
        console.log("this.dayIndex", this.dayIndex);
        CalendarID = this.dateData[this.dayIndex.start.rowIndex].dayData[
          this.dayIndex.start.dayIndex
        ].id;
      }

      this.$api.EducationManage.putCalendar(params, CalendarID).then(res => {
        console.log("修改修改校历信息", res.data);
        if (res.data.code == 600 || res.data.code == 0) {
          // 放假日期为时间段时候 更新数据显示状态
          if (val.remarksType == 3) {
            let dayIndex = this.dayIndex.start.dayIndex;
            let rowIndex = this.dayIndex.start.rowIndex;
            // console.log('dayIndex,rowIndex::::::::', dayIndex,rowIndex);
            while (true) {
              // console.log('dayIndex,rowIndex', dayIndex,rowIndex,this.dateData[rowIndex].dayData[dayIndex].id,this.dateData[rowIndex].dayData[dayIndex].day);
              if (rowIndex >= this.dateData.length) {
                break;
              }
              if (this.dateData[rowIndex].dayData[dayIndex].id > 0) {
                // console.log("============day===",this.dateData[rowIndex].dayData[dayIndex].day)
                this.dateData[rowIndex].dayData[dayIndex].remarksType =
                  val.remarksType;
                this.dateData[rowIndex].dayData[dayIndex].remarks = val.remarks;
              }
              rowIndex = dayIndex + 1 > 6 ? rowIndex + 1 : rowIndex;
              dayIndex = dayIndex + 1 > 6 ? 0 : dayIndex + 1;
              if (
                rowIndex > this.dayIndex.end.rowIndex ||
                (rowIndex == this.dayIndex.end.rowIndex &&
                  dayIndex > this.dayIndex.end.dayIndex)
              ) {
                break;
              }
            }
          }
        } else {
          this.isToast = true;
          this.toast = res.data.msg;
        }
      });
    },

    /**
     *  @function: 修改校历月份备注
     *  @author: ly
     *  @date 2019-01-24
     **/
    putCalendarRemark(yearid, monthMarkid) {
      console.log("校历-修改校历月份备注", yearid);
      let params = {
        yearid: yearid,
        schoolid: localStorage.getItem("schoolId")
      };
      this.$api.EducationManage.putCalendarRemark(params, monthMarkid).then(
        res => {
          console.log("修改校历月份备注", res.data.data);
          if (res.data.code == 600 || res.data.code == 0) {
            // 刷新显示月份备注
          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        }
      );
    }
  },
  mounted() {
    //权限id数组
    this.roleActions = this.$store.state.Common.roleActions;
    // this.resizeLayout();
  },
  created() {
    // this.getAllDate(this.startDate, this.endDate);
    this.getCalendarlist(); //校历-获取周期下拉列表
  }
};
</script>

<style type="text/scss" lang="scss" scoped>
.el-popover {
  .remarks-form {
    position: relative;
    i {
      color: #93959b;
      font-size: 20px;
      position: absolute;
      right: 0;
      top: -30px;
      cursor: pointer;
      padding: 10px 5px;
    }
    .button-div {
      &:nth-of-type(1) {
        margin-right: 30px;
      }
    }
  }
  .el-form {
    text-align: left;
    .el-form-item {
      padding-bottom: 0px !important;
    }
    .el-form-item__content {
      .el-select {
        margin-right: 10px;
      }
    }
  }
}
.school-calendar {
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow-y: auto;
  background-color: #fff;
  .content-box {
    width: 1300px;
    height: 100%;
    margin: 0 auto;
    background-color: #fff;
  }
  .calendar-top {
    min-height: 60px;
    line-height: 60px;
    text-align: right;
    dd {
      float: left;
      margin-left: 40px;
      font-size: 18px;
      font-weight: bold;
      margin-right: 10px;
    }
    .el-select {
      float: left;
    }
    .button-div {
      margin-right: 11px;
    }
  }
  .calendar-wrap {
    width: 100%;
    height: 100%;

    width: 1300px;
    margin: auto;
    border: 1px solid #e1e1e1;
    .calendar-tip {
      width: 100%;
      height: 5vh;
      line-height: 5vh;
      margin-left: 20px;
      li {
        float: left;
        width: 70px;
        text-align: center;
        font-size: 14px;
        span {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
          margin-right: 5px;
        }
      }
    }
    .table-box {
      /deep/ .el-table {
        .el-table__body {
          .el-table__row {
            td {
              position: relative;
              cursor: pointer;
              padding: 0 !important;
              .cell {
                height: 100% !important;
                .inner-box {
                  height: 100%;
                }
              }
            }
            .month-column,
            .week-column {
              background-color: #eff3f6;
              .cell {
                display: table;
                width: 100%;
                height: 100%;
                position: relative;
                span {
                  position: absolute;
                  top: 0;
                  bottom: 0;
                  left: 0;
                  right: 0;
                  width: 100%;
                  height: 30px;
                  line-height: 30px;
                  font-size: 15px;
                  margin: auto;
                }
              }
            }
            .normal-box {
              background-color: #fff !important;
            }
            .adjust-box {
              background-color: #ffc05c !important;
              span {
                color: #fff;
              }
            }
            .leave-box {
              background-color: #ff7e7f !important;
              span {
                color: #fff;
              }
            }
            .special-box {
              background-color: #78d97f !important;
              span {
                color: #fff;
              }
            }
          }
          .cell {
            .day {
              font-size: 15px;
              // position: absolute;
              // left: 10px;
              // top: 5px;
              width: 100%;
              display: inline-block;
              text-align: left;
            }
            .weekend {
              color: #bdbdbd;
            }

            .current-week {
              color: #1cab7d;
            }
            .today {
              color: #1cab7d;
            }
            .today-icon {
              color: #fff;
              float: right;
              width: 40px;
              height: 20px;
              line-height: 20px;
              background-color: #1cab7d;
              text-align: center;
              position: absolute;
              right: 0;
              top: 0;
              border-top-left-radius: 6px;
              border-bottom-left-radius: 6px;
            }
          }
          .remarks {
            width: 100%;
            height: 100%;
            position: absolute;
            left: 0;
            top: 0;
            font-size: 15px;
            z-index: 1;
            p {
              width: 100%;
              height: 100%;
              text-align: left;
              padding: 10px;
              color: #bdbdbd;
            }
            &:hover {
              .modal {
                display: block;
                z-index: 2;
              }
            }
            .modal {
              width: 100%;
              height: 100%;
              position: absolute;
              background-color: #fff;
              z-index: 1;
              left: 0;
              top: 0;
              display: none;
              cursor: pointer;
              -webkit-transition: 0.3s;
              -moz-transition: 0.3s;
              -ms-transition: 0.3s;
              -o-transition: 0.3s;
              transition: 0.3s;
              &:hover {
                background-color: #eff3f6;
                .edit {
                  opacity: 1;
                }
                .tip {
                  opacity: 0;
                }
              }
              .edit {
                width: 100%;
                height: 30px;
                line-height: 30px;
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
                color: #1cab7d;
                -webkit-transition: 0.3s;
                -moz-transition: 0.3s;
                -ms-transition: 0.3s;
                -o-transition: 0.3s;
                transition: 0.3s;
                opacity: 0;
                i {
                  font-size: 20px;
                }
              }
              .tip {
                -webkit-transition: 0.3s;
                -moz-transition: 0.3s;
                -ms-transition: 0.3s;
                -o-transition: 0.3s;
                transition: 0.3s;
                opacity: 1;
                color: #bdbdbd;
                display: inline-block;
                width: 100%;
                margin-top: 10px;
                margin-left: 10px;
                text-align: left;
              }
            }
            .el-container {
              position: absolute;
              z-index: 2;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #fff;
              .el-main {
                position: relative;
                border: 1px solid #1cab7d;
                border-bottom: 0;
                .el-textarea {
                  width: 100%;
                  height: 100%;
                  position: absolute;
                  background-color: #fff;
                  z-index: 10;
                  left: 0;
                  top: 0;
                  .el-textarea__inner {
                    width: 100%;
                    height: 100%;
                    border: 0;
                    outline: none;
                    &:focus {
                      border: 0 !important;
                      outline: none;
                    }
                  }
                }
              }
              .el-footer {
                border: 1px solid #1cab7d;
                border-top: 0;
                .el-button {
                  width: 90%;
                  margin-top: 14px;
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
