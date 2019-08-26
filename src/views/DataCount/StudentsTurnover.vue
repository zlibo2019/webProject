<template>
    <div class="turnover">
        <div class="turn-top">
          <!--  <div class="turn-box">
                <span>考勤类型：</span>
                <el-button type="text">请假</el-button>
                <el-button type="text">未到</el-button>
                <el-button type="text">正常</el-button>
                <el-button type="text">全部</el-button>
            </div>
            <div class="turn-box">
                <span>审批状态：</span>
                <el-button type="text">全部</el-button>
                <el-button type="text">同意</el-button>
                <el-button type="text">拒绝</el-button>
                <el-button type="text">未审批</el-button>
                <el-button type="text">已撤销</el-button>
            </div>-->
            <div class="turn-box">
                <span>时间范围：</span>
                <el-button type="text" :class="{on: onTime == 1}" @click="selectToday">今天</el-button>
                <el-date-picker v-model="daterange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" @change="changeDateRange">
                </el-date-picker>
            </div>
            <div class="turn-box">
                <span>学生范围：</span>
                <el-button type="text" :class="{on: onAll == 1}" @click="selectAll">全部</el-button>
               <!-- <el-select v-model="section" placeholder="请选择" style="margin-left: 20px;">
                    <el-option
                            v-for="item in sections"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>-->
                <div class="deparment transfer-content">
                    <div class="transfer-top" @click="depChangeClick">
                        <span>{{ deparment }}</span>
                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':transferState}"
                             alt="">
                    </div>
                    <div class="inner-tree" v-if="transferState">
                        <el-tree :data="treeData" :props="defaultProps" node-key="id"
                                 :default-expanded-keys="depExpandedKeys" :expand-on-click-node="false"
                                 @node-click="selectDeparment"></el-tree>
                    </div>
                </div>
            </div>
        </div>
        <div class="turn-bottom">
            <div class="operate-box">
                <span>{{ allNum }}位学生</span>
                <!--<el-button class="exportBtn" type="primary" size="small" @click="exportExcel">导出</el-button>-->
               <!-- <form id="exportForm" :action="`${serverUrl}card/exportCard`"
                      method="post" target="id_iframe">&lt;!&ndash; 	enctype="multipart/form-data" &ndash;&gt;
                    <input type="hidden" :value="onCrew" name="searchType">
                    <input type="hidden" :value="onRange" name="userDepStr">
                    <input type="hidden" :value="onCard" name="cardState">
                    <input type="hidden" :value="mySearch" name="userNameLike" v-if="mySearch">
                </form>
                <iframe id="id_iframe" name="id_iframe" style="display:none;"></iframe>-->
                <div class="search-box">
                    <el-input v-model="mySearch"  size="small" placeholder="请输入姓名或者学号" @change="search">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                    </el-input>
                </div>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="tableData" border
                          highlight-current-row style="width: 100%" @row-click="toggleSelection"
                          @selection-change="handleSelectionChange" v-loading="tableLoading" :span-method="objectSpanMethod"
                         >
                    <!--<el-table-column prop="indexID" label="序号" width="65"></el-table-column>-->
                    <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>
                    <el-table-column prop="userName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userNo" label="学号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="className" label="班级" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="recordTime" label="签到日期" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.recordTime">
                                {{ scope.row.recordTime.substring(0, 10) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="recordTime" label="签到时间" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.recordTime">
                                {{ scope.row.recordTime.substring(scope.row.recordTime.lastIndexOf("\ ")+1, scope.row.recordTime.lastIndexOf("\ ").length) }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="placeName" label="签到楼宇" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dicFmtMap" label="进出方向" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dicFmtMap.customDirectioncn">{{ scope.row.dicFmtMap.customDirectioncn }}</span>
                            <span v-else>——</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="photoPath" label="照片抓拍">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="bottom" v-if="scope.row.photoPath">
                                <!--图片路径需要修改-->
                                <img :src="uploadPicUrl + scope.row.photoPath+'?imageView2/1/w/480/h/270'"
                                     style="width: auto;" :onerror="defaultErrImg">
                                <div slot="reference" class="name-wrapper">
                                    <el-tag size="medium" style="background: none;color:#1cab7d;border:none;">查看</el-tag>
                                </div>
                            </el-popover>
                            <span v-else>无</span>
                        </template>
                    </el-table-column>
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
				sections:[      //组织架构数组
                    {
                    	value:'1',
                        label:'产品'
                    },
                    {
                    	value:'2',
                        label:'设计'
                    },
                    {
                    	value:'3',
                        label:'技术'
                    },
                    {
                    	value:'4',
                        label:'人事'
                    },
                    {
                    	value:'5',
                        label:'财务'
                    },
                ],
				section:'',      //选择的部门
				mySearch:'',     //输入的搜索内容
				tableData:[      //table数组
					{
						userName:'王小二',
						userNo:'102365632',
						className:'2015级三班',
						recordTime:'2017-12-02 08:23',
						checkTime:'08:00',
						checkTime:'2017-12-02 08:23',
						placeName:'校北门',
						dicFmtMap:{
							recordDirectioncn: '进校'
                        },
						photoPath:'',
					},{
						userName:'王小二',
						userNo:'102365632',
						className:'2015级三班',
						recordTime:'2017-12-02 08:25',
						checkTime:'08:00',
						checkTime:'2017-12-02 08:25',
						placeName:'校北门',
						dicFmtMap:{
							recordDirectioncn: '进校'
						},
						photoPath:'',
					},{
						userName:'王小二',
						userNo:'102365632',
						className:'2015级三班',
						recordTime:'2017-12-03 09:25',
						// checkTime:'08:00',
						checkTime:'2017-12-03 09:25',
						placeName:'校北门',
						dicFmtMap:{
							recordDirectioncn: '进校'
						},
						photoPath:'',
					},
				],
				tableData: [],
				transferState: false,       //调动树形图显示，学生范围树是否显示
				treeData: [{
					"id": 10003,
					"pid": 10001,
					"label": "班级",
					"lv": 2,
					"group": 102,
					"isLeaf": 0,
					"children": [{
						"id": 10009,
						"pid": 10003,
						"label": "高中部",
						"lv": 3,
						"group": 103,
						"isLeaf": 0,
						"children": [{
							"id": 10013,
							"pid": 10009,
							"label": "高三",
							"lv": 4,
							"group": 104,
							"isLeaf": 1,
							"children": []
						}, {
							"id": 10011,
							"pid": 10009,
							"label": "高一",
							"lv": 4,
							"group": 104,
							"isLeaf": 0,
							"children": [{
								"id": 10014,
								"pid": 10011,
								"label": "一班",
								"lv": 5,
								"group": 105,
								"isLeaf": 1,
								"children": []
							}, {
								"id": 100017,
								"pid": 10011,
								"label": "二班",
								"lv": 5,
								"group": 105,
								"isLeaf": 1,
								"children": []
							}]
						}, {
							"id": 10012,
							"pid": 10009,
							"label": "高二",
							"lv": 4,
							"group": 104,
							"isLeaf": 1,
							"children": []
						}]
					}, {
						"id": 10010,
						"pid": 10003,
						"label": "初中部",
						"lv": 3,
						"group": 103,
						"isLeaf": 1,
						"children": []
					}]
				}],
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				depExpandedKeys: [],//默认展开第二级(部门)
				deparment: '',        // 学生范围model
				depId: '',        // 学生范围部门id
				onTime: 1,         // 选择时间-今天
				onAll: 1,         // 选择学生范围-全部     // 错误图片路径
				showIndex:false,
				allNum: 0,             //table数组总条数
				currentPage:1,      //当前页（默认设为第一页）
//				pageSize:[2,50,100,200],        //分页时每页显示多少条数据的数组
				isToast: false,
				toast: '',
				tableLoading: false,        //表格加载动画
				pageItem:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
			}
		},
		methods: {
			/**
			 *  @function: 选择查询时间进行搜索
			 *  @author: lxr
			 *  @date 2018-09-03
			 */
			search(){
				this.getTableData();        // 获取表格数据
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
				if (node.group == 105) {
					let userDepname = this.getClassName(this.treeData, node.id);
					this.deparment = userDepname;//选中部门名称
					this.depId = node.id;//选中部门id
					this.onAll = '';  // 取消选择全部的样式
					// 加载表格数据
                    this.currentPage = 1;
					this.getTableData();        // 获取表格数据
				} else {
					this.$message({
						showClose: true,
						message: '请选择班级',
						type: 'warning', duration: this.msgDuration
					})
				}
				this.transferState = false;//关闭下拉框
			},
			/**
			 *  @function:获取点击年级名称+班级名称
			 *  @author: cs
			 *  @date 2018-08-06
			 **/
			getClassName(searchData, searchVal,onName) {
				let resultArr = '';     //数组清空
				let vThis = this;
				let classArr = ''
				function ifArrVal(arr, value) {//多维数组判断是否存在某值
					for (let i = 0; i < arr.length; i++) {
						if (arr[i].children instanceof Array) {//判断是否为多维数组
							if (arr[i].children.length > 0) {
								for (let k = 0; k < arr[i].children.length; k++) {
									if (arr[i].children[k].children.length == 0) {
										//通过group判断是否选中的是班级的上一级
										if (arr[i].children[k].id == value && arr[i].group == 104) {
											classArr = arr[i].label;
											// console.log(6666666666666,classArr)
										}
									}
								}
								ifArrVal(arr[i].children, value);
							} else {
								//通过group判断是否选中的是班级
								if (arr[i].id == value && arr[i].group == 105) {
									resultArr = arr[i].label;
									if(onName){
										vThis.oneNameId = arr[i].id;
									}
									// console.log(1112212,resultArr,vThis.oneNameId)
								}
							}
						}
					}
					return -1;//不存在
				}
				ifArrVal(searchData, searchVal)
				resultArr = classArr + ` ` + resultArr;
				// console.log(999, resultArr)
				return resultArr
			},
			/**
			 *  @function: 选择学生范围-全部
			 *  @author: lxr
			 *  @date 2018-9-4
			 **/
			selectAll(item){
				this.onAll = 1;  // 改变样式
                this.deparment = '';//  清空选择部门
				this.getTableData();        // 获取表格数据
			},
			/**
			 *  @function: 选择时间范围-今天
			 *  @author: lxr
			 *  @date 2018-9-3
			 **/
			selectToday(item){
				this.onTime = 1;  // 改变样式
				this.daterange = [];  // 清空时间范围
				this.getTableData();        // 获取表格数据
			},
			/**
			 *  @function: 条件查询-选择时间进行搜索
			 *  @author: lxr
			 *  @date 2018-09-03
			 **/
			changeDateRange(value){
			    // console.log('changeDateRange',value)
                this.onTime = '';   // 清空选择今天的样式
				this.getTableData();        // 获取表格数据
            },
			/**
			 *  @function: 获取表格数据
			 *  @author: lxr
			 *  @date 2018-09-03
			 **/
            getTableData(){
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
					beginDate: today[0],
					endDate: today[1],
					depStr: this.onAll == 1 ? '' : this.depId, // 组织id
					userNameLike: this.mySearch,    // 模糊查询条件
				}
				this.tableLoading = true;
				this.$api.DataCount.studentInRecord(params).then( res => {
					// console.log('学生进出记录数据', res)
					this.tableLoading = false;
					if (res.data.code == 600 ||　res.data.code == 0) {
						if(res.data.data != null){
							this.allNum = res.data.data.total_record;   // 总条数
						}else{
							this.allNum = 0;   // 总条数
						}
						this.tableData = res.data.data.records;
						this.getSpanArr(this.tableData);
						let num = 0;        // 以下为 前端写的序号
						for(let i = 0;i < this.tableData.length;i++){
							if (i === 0) {
								num = 1
							} else {
								// 判断当前元素与上一个元素是否相同
								if ( this.tableData[i].userNo != this.tableData[i - 1].userNo
									/*&& this.tableData[i].recordTime.substring(0, 10) != this.tableData[i - 1].recordTime.substring(0, 10)*/ ){
									num += 1;
								}
							}
							// console.log(num)
							this.$set(this.tableData[i],'indexID',(this.currentPage - 1) * this.pageItem + num*1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						}
					} else {
						this.allNum = 0;   // 总条数
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.allNum = 0;   // 总条数
					this.tableLoading = false;
                })
            },
			/**
			 *  @function: 加载树形组织结构列表
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			loadStructure() {
				let params = {
					schoolId: localStorage.getItem('schoolId')
				}
                this.$api.Common.getTreeListStudent(params).then(res => {
					// console.log('加载树形组织结构列表', res)
					if (res.data.code == 600) {
						this.treeData = res.data.data;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 表格跨行方法
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			objectSpanMethod({row, column, rowIndex, columnIndex}) {
				// console.log(1234,row, column, rowIndex, columnIndex)
				if (columnIndex <= 3) {
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
					} else {// 后台返带时间的，需要前端截取
						// data[i].recordTime = data[i].recordTime.substring(0, 10);
						// data[i - 1].recordTime = data[i - 1].recordTime.substring(0, 10);
						// 判断当前元素与上一个元素是否相同--->找数组中相同的字段进行分组
						if (data[i].userNo == data[i - 1].userNo && data[i].recordTime.substring(0, 10) == data[i - 1].recordTime.substring(0, 10) ) {
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
				this.getTableData();        // 获取表格数据
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
			setTimeout(function () {
				let icH = $('.index > .m-cen').height();
				let ttH = $('.turn-top').height();
				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - ttH - obH - pbH - 15;
				// console.log(666,icH,ttH,obH,pbH,tblH,$('.table-box'))
				$('.table-box').height(tblH)
			},15)
			let vThis = this;
			//下拉树形控件弹窗隐藏的功能
			document.body.onclick = function (e) {
				if ($(e.target).closest(".deparment").length == 0) {
					//点击.deparment之外，则触发
					vThis.transferState = false;
				}
			}
			this.getTableData();        // 获取表格数据
			this.loadStructure();   // 加载学生树
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .turnover {
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
                button{
                    color:#AAAAAA;
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
                .el-table{
                    border-left: 0;
                    border-right: 0;
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
        .user-box{
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #EEEEEE;
            dl{
                width:140px;
                height:240px;
                margin-right: 50px;
                dt{
                    height:175px;
                    margin-bottom: 8px;
                    img{
                        width:100%;
                        height:100%;
                    }
                }
                dd{
                    font-size: 12px;
                    line-height: 25px;
                    text-align: center;
                }
            }
            dl:nth-of-type(2){
                margin-right: 0;
            }
        }
        p{
            line-height: 40px;
            font-size: 12px;
            span:nth-of-type(2){
                margin-left: 30px;
            }
        }
        img{
            width: auto!important;
        }
    }
</style>
