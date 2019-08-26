<template>
    <div class="teacher-timetable">
        <div class="common-top">
            <span class="left-title">排课周期：<i></i></span>
            <el-select v-model="yearid" placeholder="请选择学年" size="medium" style="width:270px;" @change="changeYear">
                <el-option v-for="item in yearData"  :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
        </div>
        <div class="content-box">
            <div class="m-left">
                <h4>选择教师</h4>
                <div class="inner">
                    <el-input placeholder="请输入姓名或工号" v-model="filterText" size="small"></el-input>
                    <el-tree
                        :data="treeData" 
                        ref="tree"
                        node-key="id"
                        show-checkbox
                        default-expand-all
                        :check-on-click-node="false"
                        :filter-node-method="filterNode"
                        @check="getCheckedKeys">
                        <span class="span" :ref="data.id" slot-scope="{ node, data }" :title="'工号：'+data.id">
                            {{data.label}}
                        </span>
                    </el-tree>
                </div>
            </div>
            <div class="m-right">
                <div class="right-top">
                    <span class="show-options">显示选项：</span>
                    <el-select v-model="selectWeek" placeholder="请选择范围" size="medium" style="width:140px;" @change="changeWeek">
                        <el-option v-for="item in selectWeekData"  :key="item.id" :label="item.name" :value="item.id"> </el-option>
                    </el-select>
                    <el-checkbox v-model="isShowTeacher"  @change="showTeacher">显示任课教师</el-checkbox>
                    <Button title="导出" btnClass="custom6" btnFontSize="12px" @click=""></Button>
                    <Button title="打印" btnClass="custom8" btnFontSize="12px"></Button>
                </div>
                <div class="right-content">
                    <div class="table-list" v-for="(item, index) in tableListData" :key="index" v-if="tableListData.length > 0">
                        <div class="empty-box" v-for="(todo, idx) in item.detail" :key="idx">
                            <h5>教师课表：{{item.teacher_name}}课表<span>(此课表适用时间：{{todo.dateRange}}）</span></h5>
                            <div class="table-box">
                                <el-table id="table" ref="multipleTable" height="100%" border align="center" :data="todo.detail" tooltip-effect="dark"
                                    highlight-current-row style="width: 100%" v-loading="tableLoading">
                                    <el-table-column show-overflow-tooltip  width="160" prop=""
                                    :render-header="renderProductId">
                                        <template slot-scope="scope">
                                            <dd v-if="scope.row.detail.length > 0">{{scope.row.detail[0].section_name}}</dd>
                                            <dd v-if="scope.row.detail.length > 0">{{scope.row.timeRange}}</dd>
                                        </template>
                                    </el-table-column>
                                    <el-table-column :prop="week.week" min-width="100" :label="week.title" show-overflow-tooltip v-for="(week, weekIdx) of weekData" :key="weekIdx">
                                        <template slot-scope="scope">
                                            <dd>{{scope.row.detail[weekIdx].subject_name}}</dd>
                                            <!-- :class="scope.row.detail[weekIdx].subject_teacher == ''?'no-teacher':'teacher-name'" -->
                                            <dd v-if="isShowTeacher && scope.row.detail[weekIdx].subject_teacher != null"  class="teacher-name">{{ scope.row.detail[weekIdx].subject_teacher? scope.row.detail[weekIdx].subject_teacher:'未找到任课教师'}}</dd>
                                            <dd v-if="isShowTeacher && scope.row.detail[weekIdx].subject_teacher == null"></dd>
                                            <!-- <dd>{{scope.row['subject_name'+week.week]}}</dd>
                                            <dd v-if="isShowTeacher && scope.row['subject_name'+week.week]">{{scope.row["subject_teacher"+week.week]?scope.row["subject_teacher"+week.week]:'未找到任课教师'}}</dd>
                                            <dd v-if="isShowTeacher && !scope.row['subject_name'+week.week]"></dd> -->
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="pagination-box">
                    <el-pagination 
                        background 
                        layout=" prev, pager, next" 
                        :total="allNum" 
                        :page-size=pageItem 
                        :current-page.sync="currentPage" 
                        @current-change="handleCurrentChange">
                    </el-pagination>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	export default {
		name: 'TeacherTimeTable',
		components: { 
			Button, Toast
		},
		data() {
			return {
				isToast: false,//toast是否展示
                toast: '',//toast提示内容
				allNum: 0,             //table数组总条数
				currentPage:1,      //当前页（默认设为第一页）
				pageItem:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
                yearid:'',//选中的学年
				yearData:[],//排课周期下拉列表数据
                tableListData:[
                    // {
                    //     tableData:[]
                    // },
                    // {
                    //     tableData:[]
                    // },
                    // {
                    //     tableData:[]
                    // },
                    // {
                    //     tableData:[]
                    // },
                    // {
                    //     tableData:[]
                    // },
                    // {
                    //     tableData:[]
                    // },
                    // {
                    //     tableData:[]
                    // },
                ],//表格数据
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
                selectWeek:5,//选择的周范围
                selectWeekData:[
                    {
                        id:5,
                        name:'周一~周五',
                    },
                    {
                        id:7,
                        name:'周一~周日',
                    }
                ],//周范围数据
                isShowTeacher:sessionStorage.getItem('showTeacher')?true:false,//是否显示任课教师
                tableLoading:false,//表格数据加载
				checkedKeys: [],//左侧树选中
                filterText:'',//树筛选
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
                }],
			}
		},
		methods: {
			/**
			 *  @function: 重新获取宽高
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			resizeLayout() {
				setTimeout(() => {
					let icH = $('.index > .m-cen').height();
					let ttH = $('.teacher-timetable .common-top').height();
					let rtH = $('.teacher-timetable .right-top').height();
					let pbH = $('.teacher-timetable .pagination-box').height();
					let tblH = icH - ttH  - 20;
					$('.teacher-timetable .content-box').height(tblH)
					$('.teacher-timetable .el-tree').height(tblH - rtH -62)
					$('.teacher-timetable .right-content').height(tblH - rtH -pbH)
					console.log(66, icH, ttH,rtH,pbH ,tblH)
				}, 50)
            },
            /**
			 *  @function:节次星期对角线
			 *  @author: cs
			 *  @date:2018-12-22
			 **/
            renderProductId(h, {column}) {
                return h('div', [
                    h('dd', '节次'),
                    h('dd', '星期'),
                ]);
            },
            /**
			 *  @function: 树形图点击
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			filterNode(value, data) {
                console.log(value, data);
				if (!value) return true;
        		return String(data.id).indexOf(value) !== -1 || data.label.indexOf(value) !== -1;
			},
			/**
			 *  @function: 左侧树点击
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			getCheckedKeys(){
                // this.checkedKeys = this.$refs["tree"].getCheckedKeys(true);
                this.checkedKeys = [];
                let checkNodes = this.$refs["tree"].getCheckedNodes(true);
                for (let g = 0; g < checkNodes.length; g++) {
                    let getNode = this.$refs["tree"].getNode(checkNodes[g]);
                    let item = {};
                    item.id = checkNodes[g].id;
                    item.name = this.$refs["tree"].getNode(checkNodes[g]).label;
                    console.log(1111,item);
                    this.checkedKeys.push(item)
				}
                console.log("this.checkedKeys:",this.checkedKeys);
                this.currentPage = 1;
                this.getTableList();
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
                        this.getTableList();
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
             /**
             *  @function: 根据排课周期下拉查询--table
             *  @author: ly
             *  @date 2019-02-14
             */
            changeYear(val) {
                console.log("根据排课周期下拉查询--table",val);
                this.currentPage = 1;
                this.getTableList();
            },
             /**
             *  @function: 获取table列表数据
             *  @author: cs
             *  @date 2019-02-20
             */
            getTableList() {
                console.log("获取table列表数据");
                let params = {
                    "teacher":[{"id":3,"name":"第一教室"}],//this.checkedKeys,
                    "semester_id": 1,//this.yearid,
	                "week_length":this.selectWeek,
                    "page_index": this.currentPage,
					"page_size": this.pageItem,
                    "school_id": localStorage.getItem('schoolId')
                };
                this.$api.DataCount.getTimetablesTeacher('post', params).then( res => {
                    console.log('获取table列表数据', res.data);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.allNum = res.data.data.count;
                        let data = res.data.data.data;
                        for (let i = 0; i < data.length; i++) {
                            for (let k = 0; k < data[i].detail.length; k++) {
                                for (let j = 0; j < data[i].detail[k].detail.length; j++) {
                                    for (let g = 0; g < 7; g++) {
                                    // console.log(9999,data[i].detail[k].detail[j].detail[g]);
                                        if(data[i].detail[k].detail[j].detail[g]){
                                            // 展示不需要，操作需要
                                            // data[i].detail[k].detail[j]['subject_name'+data[i].detail[k].detail[j].detail[g].week] = data[i].detail[k].detail[j].detail[g].subject_name;
                                            // data[i].detail[k].detail[j]['subject_teacher'+data[i].detail[k].detail[j].detail[g].week] = data[i].detail[k].detail[j].detail[g].subject_teacher;
                                        }else{
                                            data[i].detail[k].detail[j].detail[g] = {}
                                        }
                                     }
                                    // console.log(666,item,data[i].detail[k].detail[j]);
                                }
                            }
                        }
                        this.tableListData = data;
                        console.log(this.tableListData,data);
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
             /**
             *  @function: 选择周范围筛选--table
             *  @author: cs
             *  @date 2019-02-20
             */
            changeWeek(val) {
                console.log("根据排课周期下拉查询--table",val);
                this.getTableList();
            },
             /**
             *  @function: 选择是否显示教师
             *  @author: cs
             *  @date 2019-02-20
             */
            showTeacher(val) {
                console.log("选择是否显示教师",val);
                if(val){
                    sessionStorage.setItem('showTeacher',1)
                }else{
                    sessionStorage.removeItem('showTeacher')
                }
            },
            /**
			 *  @function切换当前页的功能
			 *  @author: cs
             *  @date 2019-02-20
			 **/
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val;
                this.getTableList();
			},
		},
		mounted() {
            //权限id数组
			this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
         },
         created(){
            //  this.getTeachingList();
            this.getTableList();
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
   .teacher-timetable{
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
        .content-box{
            display: flex;
            .m-left {
                flex-basis: 270px;
                min-width: 270px;
                text-align: center;
                background-color: #fff;
                font-size: 12px;
                overflow: hidden;
                h4{
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
                .inner{
                    width: 100%;
                    height: 100%;
                    overflow: auto;
                    position: relative;
                    border-right: 1px solid #e1e1e1;
                    .el-input{
                        width: 90%;
                        margin-top: 10px;
                        margin-bottom: 10px;
                    }
                    .el-tree{
                        padding-left: 30px;
                        height: 100%;
                        overflow: auto;
                    }
                    
                }
            }
            .m-right{
                flex: 1;
                min-width: 1px;
                .right-top{
                    width: 100%;
                    height: 60px;
                    line-height: 60px;
                    background-color: #fff;
                    border-bottom: 1px solid #e1e1e1;
                    .show-options{
                        font-size: 14px;
                        color: #636363;
                        margin-left: 40px;
                        margin-right: 20px;
                    }
                    /deep/ .el-checkbox{
                        margin-left: 36px;
                        .el-checkbox__inner{
                            border-radius: 50% !important;
                        }
                        .el-checkbox__label{
                            color: #333 !important;
                        }
                    }
                    .button-div{
                        float: right;
                        margin-right: 12px;
                        margin-top: 11px;
                        &:nth-of-type(2){
                            margin-right: 55px;
                        }
                    }
                }
                .right-content{
                    width: 100%;
                    height: 100%;
                    background-color: #fff;
                    padding-left: 40px;
                    padding-right: 70px;
                    overflow-y: auto;
                    .table-list{
                        width: 100%;
                        h5{
                            height: 70px;
                            line-height: 70px;
                            font-size: 18px;
                            color: #1cab7d;
                            span{
                                font-size: 14px;
                                color: #666;
                                font-weight: normal;
                                margin-left: 20px;
                            }
                        }
                        /deep/ .el-table{
                                font-size: 16px;
                                color:#333;
                            thead {
                                tr{
                                    th{
                                        height: 48px !important;
                                        position: relative;
                                        &:nth-of-type(1){
                                            .cell{
                                                padding: 0;
                                                width: 100%;
                                                height: 100%;
                                                position: relative;
                                                &::after{
                                                    content: '';
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
                                                dd{
                                                    display: inline-block;
                                                    position: absolute;
                                                    font-size: 15px;
                                                    line-height: 15px;
                                                    &:nth-of-type(1){
                                                        left:25px;
                                                        top: 28px;
                                                    }
                                                    &:nth-of-type(2){
                                                        right:25px;
                                                        top: 10px;
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                            .teacher-name{
                                color: #666;
                                font-size: 12px;
                            }
                            .no-teacher{
                                color: #ff4e4e;
                            }
                        }
                    }
                }
                .pagination-box{
                    width:100%;
                    height:60px;
                    background:#fff;
                    box-sizing: content-box;
                    border-top: 1px solid #e1e1e1;
                    .el-pagination{
                        padding-top: 15px;
                    }
                }
            }
        }
		
   }
</style>
