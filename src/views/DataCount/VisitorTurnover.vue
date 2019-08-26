<template>
    <div class="visitor-turnover">
        <div class="turn-top">
            <div class="turn-box">
                <span>访客状态：</span>
                <el-button type="text" v-for="state in visitorState" :key="state.visitorState"
                           :class="{on: onState === state.visitorState}" @click="selectVisitorState(state)">
                    {{ state.visitorStateValue }}</el-button>
            </div>
            <div class="turn-box">
                <span>访客类型：</span>
                <el-button type="text" v-for="types in visitorType" :key="types.visitorType"
                           :class="{on: onType == types.visitorType}" @click="selectVisitorType(types)">
                    {{ types.visitorTypeValue }}</el-button>
            </div>
            <div class="turn-box">
                <span>日期范围：</span>
                <el-button type="text" :class="{on: onTime == 1}" @click="selectToday">今天</el-button>
                <el-date-picker v-model="daterange" type="datetimerange" range-separator="至" start-placeholder="开始日期"
                                end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :default-time="['00:00:00', '23:59:59']" @change="changeDateRange">
                </el-date-picker>
            </div>
        </div>
        <div class="turn-bottom">
            <div class="operate-box">
                <span>{{ allNum }}条访客记录</span>
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
                    <el-input v-model="mySearch" size="small" placeholder="请输入访客姓名/被访人姓名" @change="search">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                    </el-input>
                </div>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="tableData" tooltip-effect="dark"
                          highlight-current-row style="width: 100%" @row-click="toggleSelection" :span-method="objectSpanMethod"
                          @selection-change="handleSelectionChange" v-loading="tableLoading" border>
                    <!--<el-table-column type="selection" :reserve-selection="true" width="55"></el-table-column>&lt;!&ndash;&ndash;&gt;-->
                    <!--<el-table-column prop="indexID" label="序号" width="65"></el-table-column>-->
                    <!--<el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>-->
                    <el-table-column prop="visitorName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dicFmtMap" label="访客状态" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dicFmtMap.visitorStatecn">{{ scope.row.dicFmtMap.visitorStatecn }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dicFmtMap" label="访客类型" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dicFmtMap.visitorTypecn">{{ scope.row.dicFmtMap.visitorTypecn }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="visitorTel" label="电话号码" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="identityNo" label="身份证号码" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visitorReason" label="来访原因" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="touserName" label="来访对象" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visitorBegin" label="计划来访时间" min-width="110" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.visitorBegin"><!--通行证访客不显示时间180929-->
                                {{(scope.row.visitorType == 3 && scope.row.visitorBegin != '') ? scope.row.visitorBegin.substring(0,10)+'至'+scope.row.visitorEnd.substring(0,10) : scope.row.visitorBegin }}
                            </span>
                            <span v-else>——</span>
                        </template>
                    </el-table-column>
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
                    <el-table-column prop="dicFmtMap" label="进出方向" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.dicFmtMap.recordFxcn">{{ scope.row.dicFmtMap.recordFxcn }}</span>
                            <span v-else>——</span>
                        </template>
                    </el-table-column>
                   <!-- <el-table-column prop="visitorInTime" label="实际来访时间" min-width="110" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.visitorInTime">{{ scope.row.visitorInTime }}</span>
                            <span v-else>——</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="visitorOutTime" label="离校时间" min-width="110" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.visitorOutTime">{{ scope.row.visitorOutTime }}</span>
                            <span v-else>——</span>
                        </template>
                    </el-table-column>-->
                    <el-table-column prop="photoPath" label="照片抓拍">
                        <template slot-scope="scope">
                            <el-popover trigger="hover" placement="bottom" v-if="scope.row.photoPath">
                               <!-- <div class="img-div" v-for="(ph,index) in scope.row.photoPath.split(',')">
                                    <img :src="uploadPicUrl + ph+'?imageView2/1/w/480/h/270'"
                                         style="width: auto;" :onerror="defaultErrImg" v-if="ph != ''">
                                    <div v-if="index == 0 && scope.row.photoPath.split(',')[0] != ''">
                                        <div >入校照片抓拍</div>
                                        <div >{{ scope.row.visitorInTime }}</div>
                                    </div>
                                    <div v-else-if="index == 1 && scope.row.photoPath.split(',')[1] != ''">
                                        <div >离校照片抓拍</div>
                                        <div >{{ scope.row.visitorOutTime }}</div>
                                    </div>
                                </div>--><!--需求变更-->
                                <div class="img-div"><!--w/480/h/270   在样式中控制了-->
                                    <img :src="uploadPicUrl + scope.row.photoPath +'?imageView2/1/'"
                                          :onerror="defaultErrImg" v-if="scope.row.photoPath != ''">
                                    <div>
                                        <div v-if="scope.row.dicFmtMap.recordFxcn">{{ `${scope.row.dicFmtMap.recordFxcn}照片抓拍` }}</div>
                                        <div>{{ scope.row.recordTime }}</div>
                                    </div>
                                </div>
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
              <!--  <el-pagination background
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
				userNo: localStorage.getItem('userNo') ? localStorage.getItem('userNo') : '',
				daterange:'',   //选择的日期范围
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
	                    visitorName:'王小二',
	                    visitorTel:'13930232345',
	                    identityNo:'370000199901011234',
	                    visitorState:'来访中',
	                    visitorType:'受邀访客',
	                    visitorReason:'办公',
	                    touserName:'admin',
	                    visitorBegin:'2016-11-02 16:00',
	                    visitorInTime:'2016-11-02 16:00',
	                    visitorOutTime:'',
	                    photoType:'',
                    },
                    {
	                    visitorName:'毛晓玲',
	                    visitorTel:'13930232345',
	                    identityNo:'370000199901011234',
	                    visitorState:'来访结束',
	                    visitorType:'预约访客',
	                    visitorReason:'办公',
	                    touserName:'admin',
	                    visitorBegin:'',
	                    visitorInTime:'2016-11-02 16:00',
	                    visitorOutTime:'2016-11-02 16:00',
	                    photoType:'15348395260.e3h96dh5a7f09.jpg;15349885350.118830e652g97.jpg',
	                    visitorInPhoto: '15349885350.118830e652g97.jpg',
	                    visitorOutPhoto: '15348395260.e3h96dh5a7f09.jpg'
                    },
                ],
				tableData: [],
                visitorState: [     // 访客状态数据
                {
	                visitorStateValue: '来访中',
	                visitorState: '1'
                },{
                    visitorStateValue: '来访结束',
                    visitorState: '2'
                },{
                    visitorStateValue: '未到',
                    visitorState: '3'
                },{
                    visitorStateValue: '全部',
                    visitorState: ''
                }],// 访客状态
				visitorState: [],
                visitorType: [     // 访客类型数据
                {
	                visitorTypeValue: '全部',
	                visitorType: 1
                },{
                    visitorTypeValue: '受邀访客',
                    visitorType: 2
                },{
                    visitorTypeValue: '预约访客',
                    visitorType: 3
                },{
                    visitorTypeValue: '通行证访客',
                    visitorType: 4
                }],// 访客类型
				visitorType: [],
                onState: '',        // 选中的访客状态--默认选中全部
                onType: '',        // 选中的访客类型--默认选中全部
                onTime: 1,        // 选中的时间-今天
				showIndex:false,    // 错误图片路径
				allNum: 0,             //table数组总条数
				currentPage:1,      //当前页（默认设为第一页）
//				pageSize:[2,50,100,200],        //分页时每页显示多少条数据的数组
				tableLoading: false,        //表格加载动画
				pageItem:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				isToast: false,
				toast: '',
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
			 *  @function: 选择访客状态
			 *  @author: lxr
			 *  @date 2018-9-3
			 **/
			selectVisitorState(item){
                this.onState = item.visitorState;  // 改变样式
				this.getTableData();        // 获取表格数据
            },
			/**
			 *  @function: 选择访客类型
			 *  @author: lxr
			 *  @date 2018-9-3
			 **/
			selectVisitorType(item){
                this.onType = item.visitorType;  // 改变样式
				this.getTableData();        // 获取表格数据
            },
			/**
			 *  @function: 选择时间范围-今天
			 *  @author: lxr
			 *  @date 2018-9-3
			 **/
			selectToday(item){
                this.onTime = 1;  // 改变样式
                this.daterange = [];    // 清空时间范围
				this.getTableData();        // 获取表格数据
            },
			/**
			 *  @function: 条件查询-选择时间进行搜索
			 *  @author: lxr
			 *  @date 2018-09-03
			 **/
			changeDateRange(value){
				// console.log('changeDateRange',value)
				this.onTime = '';  // 去掉选择今天的样式
                this.currentPage = 1;   // 定第一页
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
					search: {
						visitorState: this.onState,               // 访客状态
						visitorType: this.onType,                // 访客类型
						visitorBegin: today[0],
						visitorEnd: today[1],
						visitorName: this.mySearch,    // 模糊查询条件
						touserId: localStorage.getItem('userId'),   // 180917增参数
					}
				}
				this.tableLoading = true;
				this.$api.DataCount.getVisitorRecord(params).then( res => {
					// console.log('访客列表数据', res)
				    this.tableLoading = false;
					if (res.data.code == 600 ||　res.data.code == 0) {
						if(res.data.data != null){
							this.allNum = res.data.data.total_record;   // 总条数
						}else{
							this.allNum = 0;   // 总条数
						}
						this.tableData = res.data.data.records;
						this.getSpanArr(this.tableData)
						this.loadLimitData();
						/*$.each(this.tableData, (a, b) =>{      //添加序号，切换页面序号连增(注意函数采用ES6写法，否则this指向报错)
							this.$set(this.tableData[a], 'indexID', (this.currentPage - 1) * this.pageItem + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						})*/
					} else {
						this.allNum = 0;   // 总条数
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
                })
			},
			/**
			 *  @function: 获取访客状态数据
			 *  @author: lxr
			 *  @date 2018-09-15
			 **/
			getStateData(){
				this.$api.DataCount.getVisitorState().then( res => {
					// console.log('访客状态数据', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.visitorState = res.data.data;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
            },
			/**
			 *  @function: 获取访客类型数据
			 *  @author: lxr
			 *  @date 2018-09-15
			 **/
			getTypeData(){
				this.$api.DataCount.getVisitorType().then( res => {
					// console.log('访客类型数据', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.visitorType = res.data.data;
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
				if (columnIndex <= 8) {
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
						//不能如此定义  否则会将列表相应值改变
						// data[i].recordTime = data[i].recordTime.substring(0, 10);
						// data[i - 1].recordTime = data[i - 1].recordTime.substring(0, 10);
						if(data[i].recordTime){
                        }
						if(data[i - 1].recordTime){
                        }
						// 判断当前元素与上一个元素是否相同--->找数组中相同的字段进行分组
						if (data[i].userId == data[i - 1].userId
                        && (data[i].recordTime ? data[i].recordTime.substring(0, 10) : '') == (data[i - 1].recordTime ? data[i - 1].recordTime.substring(0, 10) : '') ) {
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
				// console.log(666, row.deviceinfo_id, selected)
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
             /**
			 *  @function: 加载权限数据
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			loadLimitData(){
				let vThis = this
				let num = 0;
				for(let i=0;i<vThis.tableData.length;i++){

					if (i === 0) {
						num = 1
					} else {
						// 判断当前元素与上一个元素是否相同
						if (vThis.tableData[i].id != vThis.tableData[i - 1].id) {
							num++;
					    //console.log(888,num)
						}
					}
					// vThis.tableData[i].indexID = (vThis.currentPage - 1) * vThis.pageSize + num*1;

					vThis.$set(vThis.tableData[i],'indexID',(vThis.currentPage - 1) * vThis.pageSize + num*1)//序号计算(当前页码-1)*当页条数+变化的i值+1
				}

			},
		},
		mounted() {
			setTimeout(function () {
				let icH = $('.index > .m-cen').height();
				let ttH = $('.turn-top').height();
				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - ttH - obH - pbH - 15;
				// console.log(666,icH,ttH,obH,pbH,tblH)
				$('.table-box').height(tblH)
			},5)
			this.getStateData();    // 加载访客状态数据
			this.getTypeData();    // 加载访客类型数据
			this.getTableData();        // 获取表格数据
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .visitor-turnover {
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
                    margin:0 10px;
                    span{
                        margin:0;
                        font-size: 12px;
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
            /deep/ .el-table__fixed-right-patch{
                background: #F7F9FB;
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
        padding:36px 50px 50px!important;
        .img-div{
            display: inline-block;
            margin: 5px 10px;
            text-align: center;
            img{
                display: block;
                width: 480px!important;
                height: 270px;
            }
            > div{
                height: 25px;
                line-height: 25px;
                &:first-child{
                    margin-top: 10px;
                }
            }
        }
    }
</style>
