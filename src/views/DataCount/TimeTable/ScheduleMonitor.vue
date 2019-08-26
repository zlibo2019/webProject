<template>
    <div class="schedule-monitor">
        <div class="common-top">
            <span class="left-title">排课周期：</span>
            <el-select v-model="yearid" placeholder="请选择学年" size="medium" style="width:270px;" @change="changeYear">
                <el-option v-for="item in yearData"  :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
        </div>
        <div class="turn-top">
            <div class="turn-box">
                <span class="left-title">上课时间情况：</span>
                <el-button type="text" :class="{on: courseStatus == item.value}" v-for="(item, index) in courseStatusData" :key="index"
                           @click="selectCourseStatus(item)">{{ item.title }}</el-button>
            </div>
            <div class="turn-box">
                <span class="left-title">排课完整率：</span>
                <el-button type="text" :class="{on: courseRate == item.value}" v-for="(item, index) in courseScheduleRateData" :key="index"
                           @click="selectCourseRate(item)">{{ item.title }}</el-button>
            </div>
            <div class="turn-box">
                <span class="left-title">选择班级：</span>
                <el-button type="text" :class="{on: selectClassArr.length == 0}" @click="selectClassClick">全部</el-button>
                <SelectTree 
                    v-model="selectClassArr"
                    :options="treeData" 
                    :props="defaultProps"
                    placeholder="请选择班级"
                    size='medium'
                    width="200"></SelectTree>
            </div>
        </div>
        <div class="turn-mid">
            <div class="timetable-top">
                <p>
                    <img src="../../../assets/images/in_complete.png">
                    已指定上课时间
                    <img src="../../../assets/images/no_complete.png">
                    未指定上课时间
                </p>
                <Button title="打印" btnClass="custom8" btnFontSize="12px"></Button>
                <Button title="导出" btnClass="custom6" btnFontSize="12px" @click=""></Button>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark"
                    highlight-current-row style="width: 100%" v-loading="tableLoading" @cell-mouse-enter="cellEnter">
                    <el-table-column label="序号" type="index" width="65"></el-table-column>
                    <el-table-column label="班级" align="center" prop="className" min-width="100">
                        <template slot-scope="scope">
                            <span v-if="scope.row.className">{{scope.row.className}}</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上课教室" align="center" prop="classroomName" min-width="160"></el-table-column>
                    <el-table-column label="排课完整率" align="center" prop="timetablesRate" min-width="100">
                        <template slot-scope="scope">
                            <el-popover
                                placement="top"
                                :title="scope.row.timetablesRate == -1 || scope.row.timetablesRate == '100%'?'上课时间正常':'上课时间异常'"
                                :popper-class="scope.row.timetablesRate == -1 || scope.row.timetablesRate == '100%'?'normal-rate common-rate':'abnormal-rate common-rate'"
                                width="560"
                                trigger="click"
                                >
                                <h4>{{scope.row.classroomName}}：<span v-if="scope.row.timetablesRate != -1">排课完整率：<i :class="{'complete':scope.row.timetablesRate == 100}">{{scope.row.timetablesRate?scope.row.timetablesRate:0}}%</i></span></h4>
                                <div class="table-wrap">
                                    <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="timeTableData" tooltip-effect="dark"
                                        highlight-current-row style="width: 100%">
                                        <el-table-column show-overflow-tooltip prop="section_name" label="节次" width="60"></el-table-column>
                                        <el-table-column :prop="week.week" width="60" :label="week.title" show-overflow-tooltip v-for="(week, index) of weekData" :key="index">
                                            <template slot-scope="scope">
                                                <dd>{{scope.row['subject_name'+week.week]}}</dd>
                                                <dd v-if=" scope.row['subject_name'+week.week]">{{scope.row["subject_teacher"+week.week]?scope.row["subject_teacher"+week.week]:'未找到任课教师'}}</dd>
                                                <dd v-if=" !scope.row['subject_name'+week.week]"></dd>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                                <dd v-if="scope.row.timetablesRate == -1">该教室排课情况如上表，请检查是否完整！</dd>
                                <dd v-else-if="scope.row.timetablesRate != -1|| scope.row.timetablesRate != '100%'">请到
                                    <Button title="上课时间" btnClass="custom8" btnFontSize="12px"></Button>
                                    或
                                    <Button title="选课走班" btnClass="custom6" btnFontSize="12px"></Button>
                                    中完成排课！
                                </dd>
                                <span v-if="scope.row.timetablesRate == null" slot="reference" class="">0%</span>
                                <span  v-else-if="scope.row.timetablesRate < 0" slot="reference">--</span>
                                <span  v-else slot="reference">{{scope.row.timetablesRate}}</span>
                            </el-popover>
                        </template>
                    </el-table-column>
                    <el-table-column label="上课时间情况" align="center" prop="weeks">
                        <el-table-column :prop="'weeks'+week.weeks" width="80" :label="week.weeks+''" show-overflow-tooltip v-for="(week, index) of arrLessontimeRate" :key="index">
                            <template slot-scope="scope">
                                <el-popover
                                    placement="top"
                                    title="上课时间异常"
                                    popper-class="abnormal-pop"
                                    width="560"
                                    trigger="hover"
                                    >
                                    <h4>{{scope.row.classroomName}}：</h4>
                                    <p v-if="scope.row.arrLessontimeRate[index].arrErrDate.length > 0"><span>{{ scope.row.arrLessontimeRate[index].arrErrDate.join('、') }}</span> 共{{scope.row.arrLessontimeRate[index].arrErrDate.length}}天的上课时间未设置！</p>
                                    <dd>请到
                                        <Button title="上课时间" btnClass="custom8" btnFontSize="12px"></Button>
                                        中完善！
                                    </dd>
                                    <img slot="reference" src="../../../assets/images/no_complete.png" v-if="scope.row.arrLessontimeRate[index].rate == 0">
                                    <!-- <span slot="reference" v-if="scope.row.arrLessontimeRate[index].rate == 0" class="in-complete">X</span> -->
                                </el-popover>
                                <img src="../../../assets/images/in_complete.png" v-if="scope.row.arrLessontimeRate[index].rate == 1">
                                <!-- <span v-if="scope.row.arrLessontimeRate[index].rate == 1" class="complete">√</span> -->
                            </template>
                        </el-table-column>
                    </el-table-column>
                </el-table>
            </div>
        </div>
	</div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	import SelectTree from '@/components/SelectTree/SelectTree'
	export default {
		name: 'ScheduleMonitor',
		components: { 
			Button, Toast, SelectTree
		},
		data() {
			return {
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				yearid:'',//选中的学年
				yearData:[],//排课周期下拉列表数据
                tableData:[],//表格数据
                timeTableData:[],//查看课表数据
                weekData:[
                    {
                        week:'1',
                        title:'周一',
                    },
                    {
                        week:'2',
                        title:'周二',
                    },
                    {
                        week:'3',
                        title:'周三',
                    },
                    {
                        week:'4',
                        title:'周四',
                    },
                    {
                        week:'5',
                        title:'周五',
                    },
                    {
                        week:'6',
                        title:'周六',
                    },
                    {
                        week:'7',
                        title:'周日',
                    },
                ],
                tableLoading:false,//表格数据加载
                arrLessontimeRate:[],
                courseStatusData:[
                    {
                        title:'全部',
                        value:0
                    },
                    {
                        title:'已指定上课时间 ',
                        value:1
                    },
                    {
                        title:'未指定上课时间',
                        value:2
                    },
                ],//上课时间情况数据
                courseStatus:0,//上课时间情况筛选
                courseScheduleRateData:[
                    {
                        title:'全部',
                        value:0
                    },
                    {
                        title:'完整 ',
                        value:1
                    },
                    {
                        title:'异常',
                        value:2
                    },
                ],//排课完整率数据
                courseRate:0,//排课完整率筛选
                selectClassArr:[],//选中的班级id
                treeData: [{
					"id": 1000,
					"pid": 101,
					"label": "烟台一中",
					"group": 102,
					"isLeaf": 0,
					"isSystem": 0,
					"children": [{
						"id": 10000,
						"pid": 1000,
						"label": "初中校区",
						"group": 103,
						"isLeaf": 0,
						"isSystem": 1,
						"children": [
							{
							"id": 10010,
							"pid": 10000,
							"label": "校门口",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 1,
							"children": []
						}, {
							"id": 10011,
							"pid": 10000,
							"label": "传达室",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 1,
							"children": []
						}, {
							"id": 10012,
							"pid": 10000,
							"label": "教学楼",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 1,
							"children": []
						}]
					},{
						"id": 10001,
						"pid": 1000,
						"label": "高中校区",
						"group": 103,
						"isLeaf": 0,
						"isSystem": 0,
						"children": [
							{
							"id": 10020,
							"pid": 10001,
							"label": "校门口",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 0,
							"children": []
						}, {
							"id": 10021,
							"pid": 10001,
							"label": "传达室",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 0,
							"children": []
						}, {
							"id": 10022,
							"pid": 10001,
							"label": "教学楼",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 0,
							"children": []
						}]
					}]
                }],//树形控件数据
                defaultProps: {
					parent_id: 'pid',   // 父级唯一标识
					id: 'id',          // 唯一标识
					label: 'label',       // 标签显示
					children: 'children', // 子级
                },
			}
		},
		methods: {
			/**
			 *  @function: 重新获取宽高
			 *  @author: cs
			 *  @date 2019-02-14
			 **/
			resizeLayout() {
				setTimeout(() => {
					let icH = $('.index > .m-cen').height();
					let ctH = $('.schedule-monitor > .common-top').height();
					let ttH = $('.schedule-monitor > .turn-top').height();
					let mtH = $('.schedule-monitor .timetable-top').height();
					let tblH = icH - ctH - ttH  - 35;
					console.log(66, icH, ctH, ttH, mtH,tblH)
					$('.schedule-monitor .turn-mid').height(tblH)
					$('.schedule-monitor .table-box').height(tblH - mtH - 60)
				}, 50)
			},
			/**
			 *  @function: 获取教师任课排课周期列表
			 *  @author: cs
			 *  @date 2019-02-14
			 */
            getTeachingList() {
                let params = {
                    "schoolid": localStorage.getItem('schoolId')
                };
                this.$api.EducationManage.getTeachingList('get', params).then( res => {
                    console.log('教师任课排课周期下拉列表数据', res.data);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.yearData = res.data.data;
                        if (this.yearData.length > 0) {
                            this.yearid = this.yearData[0].id;
                        }
                        this.getTimetablesMonitor();
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
			/**
			 *  @function: 获取课表监控
			 *  @author: cs
			 *  @date 2019-02-15
			 */
            getTimetablesMonitor() {
                console.log(this.yearid);
                let params = {
                    "上课时间情况":this.courseStatus,//上课时间情况 -- 0:全部 1：已指定上课时间 2：未指定上课时间
                    "排课完整率":this.courseRate,//排课完整率 -- 0:全部 1：完整 2：异常
                    "选择班级":this.selectClassArr,//选择班级 -- 全部:[]  [···]
                    "semester_id": 1,//this.yearid,
                    "school_id": localStorage.getItem('schoolId')
                };
                this.tableLoading = true;
                this.$api.DataCount.getTimetablesMonitor('post', params).then( res => {
                    console.log('获取课表监控', res.data);
                    this.tableLoading = false;
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        res.data.data.forEach(item => {
                            item.arrLessontimeRate.forEach(week=>{
                                item['weeks'+week.weeks] = week.weeks
                            })
                        });
                        this.tableData = res.data.data;
                        if(this.tableData.length > 0){
                            this.arrLessontimeRate = this.tableData[0].arrLessontimeRate;
                        }
                        console.log(this.tableData);
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
             /**
             *  @function: 根据排课周期下拉查询教师任课信息--table
             *  @author: ly
             *  @date 2019-02-14
             */
            changeYear(val) {
                console.log("根据排课周期下拉查询教师任课信息--table",val);
            },
             /**
             *  @function: 根据排课周期下拉查询教师任课信息--table
             *  @author: ly
             *  @date 2019-02-14
             */
            cellEnter(row, column, cell, event) {
                if(!column.property) return;
                if(column.property != 'timetablesRate') return;
                // if(column.property.indexOf("weeks") > -1) return;
                console.log("根据排课周期下拉查询教师任课信息--table",row, column, cell, event,column.property);
            },
             /**
             *  @function: 筛选上课时间情况
             *  @author: cs
             *  @date 2019-02-19
             */
            selectCourseStatus(item) {
                console.log("筛选上课时间情况",item);
                this.courseStatus = item.value;
                this.getTimetablesMonitor();//获取课表监控
            },
             /**
             *  @function: 筛选排课完整率
             *  @author: cs
             *  @date 2019-02-19
             */
            selectCourseRate(item) {
                console.log("筛选排课完整率",item);
                this.courseRate = item.value;
                this.getTimetablesMonitor();//获取课表监控
            },
             /**
             *  @function: 筛选班级
             *  @author: cs
             *  @date 2019-02-19
             */
            selectClassClick() {
                console.log("筛选班级");
                this.selectClassArr = [];
                this.getTimetablesMonitor();//获取课表监控
            },

		},
		mounted() {
            //权限id数组
			this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
         },
         created(){
             this.getTeachingList();//获取教师任课排课周期列表
                this.getTimetablesMonitor();//获取课表监控
         }
	}
</script>
<style type="text/scss" lang="scss">
.common-rate{
    .el-popover__title{
        height: 22px;
        line-height: 22px;
        font-size: 22px;
        color: #1cab7d;
        font-weight: bold;
    }
    .table-wrap{
        width: 483px;
        margin: 0 auto;
        border: 1px solid #e1e1e1;
        border-radius: 5px;
    }
    h4{
        text-align: left;
        font-size: 14px;
        color: #333;
        margin-top: 37px;
        margin: 37px 58px 20px 49px;
        span{
            float: right;
            font-size: 14px;
            color: #626262;
            i{
                 font-style:normal;
                 color: #ff4e4e;
            }
        }
    }
    dd{
        font-size: 14px;
        color: #5b5b5b;
        text-align: left;
        margin-left: 49px;
        margin-top: 30px;
        .button-div{
            margin: 0 10px;
        }
    }
}
.normal-rate{
    .el-popover__title{
        color: #1cab7d;
    }
    h4{
        span{
            i{
                color: #1cab7d;
            }
        }
    }
    dd{
        margin-top: 35px;
    }
}
.abnormal-rate{
    .el-popover__title{
        color: #ff4e4e;
    }
    dd{
        margin-top: 35px;
    }
}
.abnormal-pop{
    .el-popover__title{
        height: 22px;
        line-height: 22px;
        font-size: 22px;
        color: #1cab7d;
        font-weight: bold;
    }
    h4{
        text-align: left;
        font-size: 14px;
        color: #333;
        margin-top: 37px;
        margin: 37px 58px 20px 49px;
    }
    p{
        margin-left: 49px;
        margin-right: 58px;
        text-align: left;
        span{
	        color: #ff4e4e;
        }
    }
    dd{
        font-size: 14px;
        color: #5b5b5b;
        text-align: left;
        margin-left: 49px;
        margin-top: 30px;
        .button-div{
            margin: 0 10px;
        }
    }
}
</style>

<style type="text/scss" lang="scss" scoped>
   .schedule-monitor{
		width: 100%;
		height: 100%;
        .common-top{
            width: 100%;
            height: 50px;
            line-height: 50px;
            background-color: #fff;
            margin-bottom: 20px;
            .left-title{
                margin-left: 0;
                margin-right: 40px;
                width: 85px;
                height: 50px;
                overflow:hidden;
                padding-left: 35px;
                font-size: 12px;
                color:#636363;
            }
        }
        .turn-top{
            width:100%;
            height:auto;
            background:#fff;
            margin-bottom: 15px;
            padding:0 35px;
            .turn-box{
                width:100%;
                height:50px;
                overflow: hidden;
                border-bottom: 1px solid #E1E1E1;
                line-height: 50px;
                font-size: 12px;
                color:#636363;
                &:nth-last-of-type(1){
                    border-bottom: 0;
                }
                .left-title{
                    margin:0 20px;
                    margin-left: 0;
                    width: 85px;
                    height: 50px;
                    float: left;
                    overflow:hidden;
                }
                button{
                    color:#aaa;
                    float: left;
                    margin:6px 50px 0 0;
                }
                button.on{
                    color:#636363;
                }
            }
        }
        .turn-mid{
            width: 100%;
		    height: 100%;
            padding:0 32px;
            overflow: hidden;
            background-color: #fff;
            box-sizing: border-box;
            .timetable-top{
                margin-top: 30px;
                min-height: 59px;
                line-height: 59px;
                text-align: right;
                background-color: #fff;
                border: solid 1px #e1e1e1;
                border-bottom: 0;
                dd{
                    float: left;
                    margin-left: 40px;
                    margin-right: 10px;
                    font-size: 18px;
                    font-weight: bold;
                }
                .button-div{
                    margin-right: 11px;
                }
                .el-button{
                    color: #999;
                    background-color: #F5F6F5;
                    &:hover{
                        background-color: #1cab7d;
                        color: #fff;
                    }
                    &:active{
                        background-color: #1b9a71;
                        color: #fff;
                    }
                    &:focus{
                        border-color: #e6e6e6;
                    }
                }
                p{
                    float: left;
                    display: inline-block;
                    margin-right: 20px;
                    font-size:14px;
                    color:#333;
                    span{
                        color:#1cab7d;
                        margin-left: 20px;
                    }
                    span.in-complete{
                        color: #ff4e4e;
                    }
                    img{
                        vertical-align: middle;
                        margin-left: 20px;
                    }
                }
            }
            .table-box{
                width: 100%;
                height: 100%;
                overflow-y: auto;
                border: solid 1px #e1e1e1;
                background-color: #fff;
                /deep/ .el-table{
                    .complete{
                        color: #1cab7d;
                        cursor: pointer;
                    }
                    .in-complete{
                        color: #ff4e4e;
                        cursor: pointer;
                    }
                    span{
                        img{
                            vertical-align: middle;
                        }
                    }
                }
            }
        }
        
   }
</style>
