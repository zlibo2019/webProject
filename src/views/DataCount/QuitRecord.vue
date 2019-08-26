<template>
    <div class="quit-record">
        <div class="turn-top">
            <div class="turn-box">
                <span>离校/离职人员：</span>
                <el-button type="text" v-for="(person, pIdx) in quitPersons" :class="{on: onPerson == pIdx}" :key="pIdx"
                @click="clickPersonTag(pIdx)">{{ person.name }}</el-button>
            </div>
            <div class="turn-box">
                <span>时间范围：</span>
                <el-button type="text" :class="{on: onTime == 1}" @click="selectToday">今天</el-button>
                <el-date-picker v-model="daterange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" @change="changeDateRange">
                </el-date-picker>
            </div>
        </div>
        <div class="turn-bottom">
            <div class="operate-box">
                <span>{{ allNum }}位{{ onPerson == 0? '学生':'教师' }}</span>
                <!--<el-button class="exportBtn" type="primary" size="small" @click="exportExcel">导出</el-button>-->
                <!-- <form id="exportForm" :action="`${serverUrl}card/exportCard`"
                       method="post" target="id_iframe">&lt;!&ndash; 	enctype="multipart/form-data" &ndash;&gt;
                     <input type="hidden" :value="onCrew" name="searchType">
                     <input type="hidden" :value="onRange" name="userDepStr">
                     <input type="hidden" :value="onCard" name="cardState">
                     <input type="hidden" :value="mySearch" name="userNameLike" v-if="mySearch">
                 </form>-->
                <iframe id="id_iframe" name="id_iframe" style="display:none;"></iframe>
                <div class="search-box">
                    <el-input v-model="mySearch" size="small" placeholder="请输入姓名或者学/工号" @change="search">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                    </el-input>
                </div>
            </div>
            <div class="table-box"><!--学生列表-->
                <el-table :span-method="objectSpanMethod" v-loading="tableLoading1" v-show="onPerson == 0" border
                          ref="studentTable"
                          :data="tableData1"
                          height=" 100%"
                          tooltip-effect="dark"
                          style="width: 100%;">
                    <el-table-column label="学生档案">
                        <el-table-column prop="indexID" label="序号" width="65"></el-table-column>
                        <el-table-column prop="userName" label="姓名"></el-table-column>
                        <el-table-column prop="userDepname" label="班级" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="userNo" label="学号" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="userPhoto" label="档案照片">
                            <template slot-scope="props">
                                <el-popover trigger="hover" placement="bottom" v-if="props.row.userPhoto">
                                    <img :src="uploadPicUrl + props.row.userPhoto+'?imageView2/1/w/200/h/260'"
                                        :onerror="defaultErrImg" style="width: auto;">
                                    <div slot="reference" class="name-wrapper">
                                        <el-tag size="medium" style="background: none;color:#1cab7d;border:none;">预览
                                        </el-tag>
                                    </div>
                                </el-popover>
                                <span v-else>无</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="ltDate" label="离校时间" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="ltUserId" label="操作人" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column label="家长信息">
                        <el-table-column prop="family_name" label="家长姓名"></el-table-column>
                        <el-table-column prop="relationshipData" label="与学生关系" min-width="100"></el-table-column>
                        <el-table-column prop="tel" label="联系电话" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="bandingOrder" label="账号类型"></el-table-column>
                    </el-table-column>
                </el-table>
                <el-table ref="teacherTable" height="100%" v-show="onPerson == 1" :data="tableData2" border
                          highlight-current-row style="width: 100%" @row-click="toggleSelection"
                          @selection-change="handleSelectionChange" v-loading="tableLoading2">
                    <el-table-column prop="indexID" label="序号" width="100"></el-table-column>
                    <!--<el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>-->
                    <el-table-column prop="userNo" label="工号"></el-table-column>
                    <el-table-column prop="userName" label="姓名"></el-table-column>
                    <el-table-column prop="userDepname" label="部门"></el-table-column>
                    <el-table-column prop="userTel" label="联系电话"></el-table-column>
                    <el-table-column prop="dicFmtMap" label="职位" align="center">
                        <template slot-scope="scope">
                            <span>{{scope.row.dicFmtMap?scope.row.dicFmtMap.userDutycn:''}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column prop="className" label="管理班级" align="center">
                        <template slot-scope="scope">
                            <span v-if="scope.row.outDirection">{{ scope.row.outDirection }}</span>
                            <span v-else>——</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column prop="userPhoto" label="档案照片">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="bottom" v-if="scope.row.userPhoto">
                                <!--图片路径需要修改-->
                                <!--<img src="http://res-k12.weds.com.cn/15326778760.i8cfe84389bh.jpg?imageView2/0/w/200/h/300" >-->
                                <img :src="uploadPicUrl + scope.row.userPhoto+'?imageView2/1/w/200/h/260'"
                                    :onerror="defaultErrImg" style="width: auto;">
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" style="background: none;color:#1cab7d;border:none;">预览</el-tag>
                                </div>
                            </el-popover>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ltDate" label="离职时间" align="center"></el-table-column>
                    <el-table-column prop="ltUserId" label="操作人" align="center"></el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
               <!-- <el-pagination background
                        layout=" prev, pager, next"
                        :total="allNum">       &lt;!&ndash;@size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage"
                        :page-sizes="pageSize"
                        :page-size="pageSize[0]"&ndash;&gt;
                </el-pagination>-->
                <el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
                               :current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1000" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'

	export default {
		name: 'HelloWorld',
		components: {
			Button, Toast
		},
		computed: {
			defaultErrImg() {
				return 'this.src="' + this.$store.state.Common.defaultErrImg + '"'
			}
		},
		data() {
			return {
				daterange: [],   //选择的日期范围
				onTime: 1,      //选择的时间-今天
				mySearch:'',     //输入的搜索内容
				tableData1: [      //table数组
                    {
	                    userName: '王小二',
	                    userDepname: '初一年级',
	                    userNo: '20320230',
	                    userPhoto:'15349885350.118830e652g97.jpg',
	                    leaveTime: '2018-12-05 15:00',
	                    ltUser: 'admin',
	                    family_name: '李大钊',
	                    relationshipData: '母子',
	                    tel: '18744551234',
	                    accountType: '主账号',
                    },
                    {
	                    userName: '王小二',
	                    userDepname: '初一年级',
	                    userNo: '20320230',
	                    userPhoto:'15349885350.118830e652g97.jpg',
	                    leaveTime: '2018-12-05 15:00',
	                    ltUser: 'admin',
	                    family_name: '王晓晓',
	                    relationshipData: '父子',
	                    tel: '18744551234',
	                    accountType: '次账号',
                    },
					{
						userName: '王大二',
						userDepname: '初一年级',
						userNo: '20320231',
						userPhoto:'15349885350.118830e652g97.jpg',
						leaveTime: '2018-12-05 15:00',
						ltUser: 'admin',
						family_name: '王晓晓',
						relationshipData: '父子',
						tel: '18744551234',
						accountType: '次账号',
					},
					{
						userName: '王大二',
						userDepname: '初一年级',
						userNo: '20320231',
						userPhoto:'15349885350.118830e652g97.jpg',
						leaveTime: '2018-12-05 15:00',
						ltUser: 'admin',
						family_name: '李大钊',
						relationshipData: '母子',
						tel: '18744551234',
						accountType: '主账号',
					},
                    {
	                    userName: '王小三',
	                    userDepname: '初二年级',
	                    userNo: '20320220',
	                    userPhoto:'15349885350.118830e652g97.jpg',
	                    leaveTime: '2018-12-05 15:00',
	                    ltUser: 'admin',
	                    family_name: '王晓晓',
	                    relationshipData: '父子',
	                    tel: '18744551234',
	                    accountType: '次账号',
                    },
                ],
				tableData1: [],
				tableData2: [{
					className: null,
					dicFmtMap: {userDutycn: "教师"},
					// isBandingApp: null,
					// orderByFieldMap: null,
					// teacherClass: 100112,
					userDep: 100118,
					userDepname: "sll办公室",
					userDuty: "2",
					userName: "教师119",
					userNo: "119",
					userPhoto: "",
					// userSerial: 10523158,
					userTel: "17766655553",
					ltDate: "离职时间",
					ltUser: "操作人",
					userPhoto:'15349885350.118830e652g97.jpg',
				}],
				tableData2: [],
				showIndex:false,
				allNum: 0,             //table数组总条数
				currentPage:1,      //当前页（默认设为第一页）
//				pageSize:[2,50,100,200],        //分页时每页显示多少条数据的数组
				tableLoading1: false,        //表格加载动画
				tableLoading2: false,        //表格加载动画
				pageItem:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
//				allpage: 20,            //总页数
				isToast: false,
				toast: '',
				transferState: false,       //调动树形图显示，学生范围树是否显示
				treeData: [{
					"id": 10003,
					"pid": 10001,
					"lable": "班级",
					"lv": 2,
					"group": 102,
					"isLeaf": 0,
					"children": [{
						"id": 10009,
						"pid": 10003,
						"lable": "高中部",
						"lv": 3,
						"group": 103,
						"isLeaf": 0,
						"children": [{
							"id": 10013,
							"pid": 10009,
							"lable": "高三",
							"lv": 4,
							"group": 104,
							"isLeaf": 1,
							"children": []
						}, {
							"id": 10011,
							"pid": 10009,
							"lable": "高一",
							"lv": 4,
							"group": 104,
							"isLeaf": 0,
							"children": [{
								"id": 10014,
								"pid": 10011,
								"lable": "一班",
								"lv": 5,
								"group": 105,
								"isLeaf": 1,
								"children": []
							}, {
								"id": 100017,
								"pid": 10011,
								"lable": "二班",
								"lv": 5,
								"group": 105,
								"isLeaf": 1,
								"children": []
							}]
						}, {
							"id": 10012,
							"pid": 10009,
							"lable": "高二",
							"lv": 4,
							"group": 104,
							"isLeaf": 1,
							"children": []
						}]
					}, {
						"id": 10010,
						"pid": 10003,
						"lable": "初中部",
						"lv": 3,
						"group": 103,
						"isLeaf": 1,
						"children": []
					}]
				}],
				defaultProps: {
					children: 'children',
					label: 'lable'
				},
				depExpandedKeys: [],//默认展开第二级(部门)
				depStr: '',        // 学生范围model
                quitPersons: [
                {
                	name: '学生',
                },{
					name: '教师'
                }],    // 离退人员
				onPerson: 0,            //默认选择学生
				spanArr: [],                //跨行数据
			}
		},
		methods: {
			/**
			 *  @function: 选择查询时间进行搜索
			 *  @author: lxr
			 *  @date 2018-09-03
			 */
			search(){
				if(this.onPerson == 0){// 学生离校
					this.getTableData1();        // 获取学生表格数据
				}else if(this.onPerson == 1){// 教师离职
					this.getTableData2();        // 获取教师表格数据
				}
            },
			/**
			 *  @function: 导出报表
			 *  @author: lxr
			 *  @date 2018-09-25
			 */
			exportExcel(){
				$('#exportForm').submit();
			},
			/**
			 *  @function: 学生范围-树是否展示
			 *  @author: lxr
			 *  @date 2018-09-03
			 */
			depChangeClick() {
				this.transferState = !this.transferState;
				this.depExpandedKeys = [];
				this.classExpandedKeys = [];
				if (this.treeData.length > 0) {
					this.treeData.forEach((item) => {
						this.depExpandedKeys.push(item.id)
					})
				}
			},
			/**
			 *  @function: 学生范围--选择树
			 *  @author: lxr
			 *  @date 2018-09-03
			 **/
			selectDeparment(node) {
				// console.log('selectDeparment', node, node.group);
				if (node.group != 101) {
					this.depStr = node.lable;//选中部门名(新增)
					// this.formInline.userDep = node.id;//选中部门id(新增)
					// this.changeData.userDep = node.id;//选中部门id(修改)
					// this.changeData.userDepname = node.lable;//选中部门名(修改)
				} else {
					// this.formInline.userDep = '';//选中部门id(新增)
					// this.formInline.userDepname = '';//选中部门id(新增)
					// this.changeData.userDep = '';//选中部门id(修改)
					// this.changeData.userDepname = '';//选中部门名(修改)
					this.$message({
						showClose: true,
						message: '请选择部门',
						type: 'warning', duration: this.msgDuration
					})
				}
				// console.log('this.changeData', this.changeData)
				this.transferState = false;//关闭下拉框
			},
			/**
			 *  @function: 选择人员（学生or教师）
			 *  @author: lxr
			 *  @date 2018-09-04
			 **/
			clickPersonTag(index){
				// console.log('tag',index)
				this.onPerson = index;
                this.currentPage = 1;       // 初始化当前页码
                if(index == 0){//学生
	                this.getTableData1();        // 获取学生表格数据
                }else if(index == 1){// 教师
	                this.getTableData2();        // 获取教师表格数据
                }
            },
			/**
			 *  @function: 选择时间范围-今天
			 *  @author: lxr
			 *  @date 2018-9-3
			 **/
			selectToday(item){
				this.onTime = 1;  // 改变样式
				this.daterange = [];  // 清空时间范围
				if(this.onPerson == 0){// 学生离校
					this.getTableData1();        // 获取学生表格数据
                }else if(this.onPerson == 1){// 教师离职
					this.getTableData2();        // 获取教师表格数据
                }
			},
			/**
			 *  @function: 条件查询-选择时间进行搜索
			 *  @author: lxr
			 *  @date 2018-09-03
			 **/
			changeDateRange(value){
			    // console.log('changeDateRange',value)
				this.onTime = '';  // 清空今天的样式
				if(this.onPerson == 0){// 学生离校
					this.getTableData1();        // 获取学生表格数据
				}else if(this.onPerson == 1){// 教师离职
					this.getTableData2();        // 获取教师表格数据
				}
            },
			/**
			 *  @function: 获取学生表格数据
			 *  @author: lxr
			 *  @date 2018-09-04
			 **/
            getTableData1(){
            	let today ;
            	if(this.onTime == 1){// 选择了今天
		            let year = new Date().getFullYear();
		            let month = new Date().getMonth() + 1;
		            month = month < 10 ? "0" + month : month;
		            let date = new Date().getDate();
		            date = date < 10 ? "0" + date : date;
		            let hour = new Date().getHours(); //获取当前小时数(0-23)
		            hour = hour < 10 ? "0" + hour : hour;
		            let minus = new Date().getMinutes(); //获取当前分钟数(0-59)
		            minus = minus < 10 ? "0" + minus : minus;
		            let sd = new Date().getSeconds(); //获取当前秒数(0-59)
		            sd = sd < 10 ? "0" + sd : sd;
		            let dates1 = `${year}-${month}-${date} 00:00:00`;
		            let dates2 = `${year}-${month}-${date} 23:59:59`;
		            today = [dates1, dates2];
                }else{
		            today = this.daterange
	            }
            	let params = {
		            count: true,
		            page_index: this.currentPage,
		            page_size: this.pageItem,
		            search: {
			            beginDate: today[0],
			            endDate: today[1],
			            schoolId: localStorage.getItem('schoolId'),
			            userState: 2,// 人员状态  2代表查询离职
			            userNameLike: this.mySearch,    // 模糊查询条件
                    }
                }
				this.tableLoading1 = true;
				this.$api.DataCount.getStudentRecord(params).then( res => {
					// console.log('离校学生数据', res)
					this.tableLoading1 = false;
					if (res.data.code == 600 ||　res.data.code == 0) {
						if(res.data.data != null){
							this.allNum = res.data.data.total_record;   // 总条数
						}else{
							this.allNum = 0;   // 总条数
						}
						this.tableData1 = res.data.data.records;
						this.getSpanArr(this.tableData1);
						let num = 0;        // 以下为 前端写的序号
						for(let i = 0;i < this.tableData1.length;i++){
							if (i === 0) {
								num = 1
							} else {
								// 判断当前元素与上一个元素是否相同
								if ( this.tableData1[i].userNo != this.tableData1[i - 1].userNo ) {
									num += 1;
								}
							}
							this.$set(this.tableData1[i],'indexID',(this.currentPage - 1) * this.pageItem + num*1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						}
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading1 = false;
                })
            },
			/**
			 *  @function: 获取教师表格数据
			 *  @author: lxr
			 *  @date 2018-09-04
			 **/
            getTableData2(){
				let today ;
				if(this.onTime == 1){// 选择了今天
					let year = new Date().getFullYear();
					let month = new Date().getMonth() + 1;
					month = month < 10 ? "0" + month : month;
					let date = new Date().getDate();
					date = date < 10 ? "0" + date : date;
					let hour = new Date().getHours(); //获取当前小时数(0-23)
					hour = hour < 10 ? "0" + hour : hour;
					let minus = new Date().getMinutes(); //获取当前分钟数(0-59)
					minus = minus < 10 ? "0" + minus : minus;
					let sd = new Date().getSeconds(); //获取当前秒数(0-59)
					sd = sd < 10 ? "0" + sd : sd;
					let dates1 = `${year}-${month}-${date} 00:00:00`;
					let dates2 = `${year}-${month}-${date} 23:59:59`;
					today = [dates1, dates2];
				}else{
					today = this.daterange
				}
				let params = {
					count: true,
					page_index: this.currentPage,
					page_size: this.pageItem,
					search: {
						beginDate: today[0],
						endDate: today[1],
						schoolId: localStorage.getItem('schoolId'),
						userState: 2,// 人员状态  2代表查询离职
						userNameLike: this.mySearch,    // 模糊查询条件
					}
				}
				this.tableLoading2 = true;
				this.$api.DataCount.getTeacherRecord(params).then( res => {
					// console.log('离校教师数据', res.data)
					this.tableLoading2 = false;
					if (res.data.code == 600 ||　res.data.code == 0) {
						if(res.data.data != null){
							this.allNum = res.data.data.total_record;   // 总条数
						}else{
							this.allNum = 0;   // 总条数
                        }
						this.tableData2 = res.data.data.records;
						$.each(this.tableData2, (a, b) =>{      //添加序号，切换页面序号连增(注意函数采用ES6写法，否则this指向报错)
							this.$set(this.tableData2[a], 'indexID', (this.currentPage - 1) * this.pageItem + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						})
					} else {
						this.allNum = 0;   // 总条数
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading2 = false;
                })
            },
			/**
			 *  @function: 表格跨行方法
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			objectSpanMethod({row, column, rowIndex, columnIndex}) {
				// console.log(1234,row, column, rowIndex, columnIndex)
				if (columnIndex <= 6) {
					const _row = this.spanArr[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col
					}
				}
			},
			/**
			 *  @function: 表格跨行数据获取
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			getSpanArr(data) {
				this.spanArr = [];
				for (let i = 0; i < data.length; i++) {
					if (i == 0) {
						this.spanArr.push(1);
						this.pos = 0
					} else {
						// 判断当前元素与上一个元素是否相同--->找数组中相同的字段进行分组
						if (data[i].userSerial == data[i - 1].userSerial ) {
							this.spanArr[this.pos] += 1;
							this.spanArr.push(0);
						} else {
							this.spanArr.push(1);
							this.pos = i;
						}
					}
				}
			},
			/**
			 *  @function页面布局初始化的功能
			 *  @author: wzx
			 *  @date 2018-7-12
			 **/
			initLayout() {
				setTimeout(function () {
					let icH = $('.index > .m-cen').height();
					let ttH = $('.turn-top').height();
					let obH = $('.operate-box').height();
					let pbH = $('.pagination-box').height();
					let tblH = icH - ttH - obH - pbH -15;
					// console.log(666,icH,ttH,obH,pbH,tblH,$('.table-box'))
					$('.table-box').height(tblH)
					$('.table-box1').height(tblH)
					$('.table-box2').height(tblH)
				},15)
			},
			/**
			 *  @function选中的表格中的哪些行
			 *  @author: wzx
			 *  @date 2018-4-27
			 **/
			handleSelectionChange(val) {
				this.multipleSelection = val;
				// console.log(6868, this.multipleSelection)
//				this.tableData.forEach(item => {
//					this.$refs.multipleTable.toggleRowSelection(item,true);
//                })
			},
			/**
			 *  @function点击列表中某行的选中事件
			 *  @author: wzx
			 *  @date 2018-4-14
			 **/
			toggleSelection(row) {
				//console.log(666, row.deviceinfo_id, selected)
				this.$refs.multipleTable.toggleRowSelection(row);
			},
			/**
			 *  @function设置每页显示数据条数的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.pageItem = val;
				this.currentPage = 1;
				this.changePage(this.pageItem,this.currentPage);
			},
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				if(this.onPerson == 0){// 学生离校
					this.getTableData1();        // 获取学生表格数据
				}else if(this.onPerson == 1){// 教师离职
					this.getTableData2();        // 获取教师表格数据
				}
			},
			/**
			 * toast弹窗隐藏
			 * wzx
			 * 2018.7.18
			 */
			hideToast() {
				this.isToast = false;
			},
		},
		mounted() {
			let vThis = this;
			//下拉树形控件弹窗隐藏的功能
			document.body.onclick = function (e) {
				if ($(e.target).closest(".deparment").length == 0) {
					//点击.deparment之外，则触发
					vThis.transferState = false;
				}
			}
			this.initLayout();           // 初始化页面布局
			this.getTableData1();        // 获取学生表格数据
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .quit-record {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .turn-top{
            width:100%;
            height:auto;
            background:#fff;
            margin-bottom: 15px;
            padding:0 35px;
            .turn-box{
                width:100%;
                height:50px;
                border-bottom: 1px solid #E1E1E1;
                line-height: 50px;
                font-size: 12px;
                color:#333;
                span{
                    margin:0 20px;
                    margin-left: 0;
                }
                /deep/ button{
                    color:#AAAAAA;
                    margin-left: 10px;
                    span{
                        margin-right: 10px;
                    }
                }
                button.on{
                    color:#333;
                }
                /deep/ .el-date-editor{
                    margin:0 20px;
                    span{
                        margin:0;
                    }
                    input:focus{
                        border: 0!important;
                    }
                }
                .el-select{
                    .el-input{
                        input{
                            height:40px!important;
                        }
                        span{
                            margin:0;
                        }
                    }
                }

                .transfer-content {
                    height: auto !important;
                    min-height: 0 !important;
                    text-align: center;
                    display: inline-block !important;
                    position: relative;
                    margin-left: 20px;
                    vertical-align: middle;
                    .transfer-top {
                        width: 123px;
                        height: 40px;
                        line-height: 40px;
                        position: relative;
                        margin-bottom: 3px;
                        padding-left: 15px;
                        border-radius: 5px;
                        border: 1px solid #E5E5E5;
                        text-align: left;
                        cursor: pointer;
                        background: #fff;
                        span {
                            font-size: 12px;
                            display: inline-block;
                            width: 75px;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        img {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            right: 12px;
                            margin: auto;
                            -webkit-transition: 0.3s;
                            -moz-transition: 0.3s;
                            -ms-transition: 0.3s;
                            -o-transition: 0.3s;
                            transition: 0.3s;
                            width: 12px;
                        }
                        .arrow-up {
                            -webkit-transform: rotate(-180deg);
                            -moz-transform: rotate(-180deg);
                            -ms-transform: rotate(-180deg);
                            -o-transform: rotate(-180deg);
                            transform: rotate(-180deg);
                        }
                    }
                    .inner-tree {
                        width: 150px;
                        width: auto;
                        min-width: 123px;
                        height: auto;
                        max-height: 250px;
                        overflow-y: auto;
                        padding: 15px 10px;
                        background: #fff;
                        position: absolute;
                        top: 50px;
                        left: 0px;
                        z-index: 20;
                        border: 1px solid #E1E1E1;
                        border-radius: 5px;
                        -webkit-box-sizing: content-box;
                        -moz-box-sizing: content-box;
                        box-sizing: content-box;
                    }
                }

                &:last-child{
                    border: 0;
                }
            }
        }
        .turn-bottom{
            width:100%;
            height:auto;
            background:#fff;
            .operate-box{
                width:100%;
                height:60px;
                line-height:60px;
                box-sizing: content-box;
                border-bottom: 1px solid #e1e1e1;
                span{
                    font-size: 18px;
                    font-weight: bold;
                    color: #333;
                    margin-left: 35px;
                }
                .exportBtn{
                    width:90px;
                    margin: 5px 20px;
                    background:#F5F6F5!important;
                    border:1px solid #E6E6E6!important;
                    color:#333;
                }
                .exportBtn:hover{
                    background:#1cab7d!important;
                    color:#fff!important;
                }
                .search-box {
                    width: 200px;
                    height: 36px;
                    float: right;
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
                #exportForm{
                    display: none;
                }
            }
            .table-box{
                /deep/ .el-table{
                    border-left: 0;
                    border-right: 0;
                    .el-table__header {
                        thead {
                            tr {
                                cursor: default;
                                &:nth-of-type(2) {
                                    th {
                                        background-color: #fff;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            .pagination-box{
                width:100%;
                height:60px;
                background:#fff;
                box-sizing: content-box;
                .el-pagination{
                    padding-top: 15px;
                }
            }
        }
    }
    .el-popover{
        padding:36px 50px 16px;
    }
</style>
