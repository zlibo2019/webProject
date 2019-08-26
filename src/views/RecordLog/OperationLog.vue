<template>
    <div class="turnover operation-log">
        <div class="turn-top">
            <div class="turn-box">
                <span>时间范围：</span>
                <el-button :class="{on:onRange == 0 }" type="text" @click="rangeClick">今天</el-button>
                <el-date-picker v-model="daterange" type="daterange" range-separator="至" start-placeholder="开始日期"
                        end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="dateClick">{{daterange}}
                </el-date-picker>
            </div>
            <div class="turn-box">
                <span>管理员：</span>
                <el-button :class="{on:onControll == item.value}" type="text" v-for="item in controllers"
                           :key="item.value" @click="controllClick(item.value)">{{ item.label }}</el-button>
            </div>
        </div>
        <div class="turn-bottom">
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="tableData" tooltip-effect="dark"
                          highlight-current-row style="width: 100%" row-key="deviceinfo_id" v-loading="tableLoading">
                    <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>
                    <el-table-column prop="operate_type" label="操作类型" align="center"
                                     column-key="operate_type"></el-table-column>
                    <el-table-column prop="operater" label="操作人" align="center"
                                     column-key="operater"></el-table-column>
                    <el-table-column prop="operate_result" label="执行结果" align="center" column-key="operate_result">
                        <template slot-scope="scope">
                            <!--<span class="state-color"></span>-->
                            <!--<img src="../../assets/images/offline.png" alt="" v-if="scope.row.operate_result == '成功'">-->
                            <span :class="scope.row.operate_result == '成功'? 'state-sus':'state-err'"></span>
                            <span>{{ scope.row.operate_result }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="operate_time" label="操作时间" align="center"
                                     column-key="operate_time" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="details" label="详细数据" align="center"
                                     column-key="details" show-overflow-tooltip></el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination background
                        layout=" prev, pager, next"
                        :total="allNum">
                </el-pagination>
            </div>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'

	export default {
		name: 'HelloWorld',
		components: {
			Button,Toast
		},
		data() {
			return {
				isToast:false,
				toast:'',
				userNo: localStorage.getItem('userNo') ? localStorage.getItem('userNo') : '',
				daterange:'',   //选择的日期范围
				controllers:[      //管理员数组
                    {
                    	value:'0',
                        label:'admin'
                    },
                    {
                    	value:'1',
                        label:'班主任'
                    },
                    {
                    	value:'2',
                        label:'XXX'
                    },
                ],
				onControll:0,     //默认选择的管理员
				mySearch:'',     //输入的搜索内容
				onRange: 0,     //时间范围默认选中项
				tableData:[      //table数组
                    {
	                    operate_type:'添加学生',
	                    operater:'王二小',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'管理后台',
	                    operater:'王小二',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'审批',
	                    operater:'王二小',
	                    operate_result:'失败',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'添加学生',
	                    operater:'王二小',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'管理后台',
	                    operater:'王小二',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'审批',
	                    operater:'王二小',
	                    operate_result:'失败',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'添加学生',
	                    operater:'王二小',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'管理后台',
	                    operater:'王小二',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'审批',
	                    operater:'王二小',
	                    operate_result:'失败',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'添加学生',
	                    operater:'王二小',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'管理后台',
	                    operater:'王小二',
	                    operate_result:'成功',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                    {
	                    operate_type:'审批',
	                    operater:'王二小',
	                    operate_result:'失败',
	                    operate_time:'2016-09-21  08:50:08',
	                    details:'爱上的看法克拉的疯狂拉升到付款了大反馈拉萨答复',
                    },
                ],
				showIndex:false,
				allNum: 80,             //table数组总条数
				currentPage:1,      //当前页（默认设为第一页）
//				pageSize:[2,50,100,200],        //分页时每页显示多少条数据的数组
				tableLoading: false,        //表格加载动画
				pageItem:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
//				allpage: 20,            //总页数
			}
		},
		methods: {
            /**
			 * toast弹窗隐藏
			 * wzx
			 * 2018.7.18
			 */
			hideToast() {
				this.isToast = false;
			},
			/**
			 *  @function时间范围选择--今天--点击效果
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			rangeClick() {
				this.onRange = 0;
				this.daterange = ''
			},
			/**
			 *  @function时间范围选择--自定义选择日期--点击效果
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			dateClick(){
				this.onRange = -1;
				// console.log(888, this.onRange)
			},
			/**
			 *  @function时间范围选择--自定义选择日期--点击效果
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			controllClick(index){
				this.onControll = index;
				// console.log(888, this.onControll)
			},
			/**
			 *  @function选中的表格中的哪些行
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			handleSelectionChange(val) {
				this.multipleSelection = val;
				// console.log(6868, this.multipleSelection)
			},
			/**
			 *  @function点击列表中某行的选中事件
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			toggleSelection(row) {
				//console.log(666, row.deviceinfo_id, selected)
				this.$refs.multipleTable.toggleRowSelection(row);
			},
			/**
			 *  @function设置每页显示数据条数的功能
			 *  @author: wzx
			 *  @date 2018-7-17
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
			 *  @date 2018-7-17
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.changePage(this.pageItem,this.currentPage);
			}
		},
		mounted() {
			setTimeout(function () {
				let icH = $('.index > .m-cen').height();
				let ttH = $('.turn-top').height();
//				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - ttH - pbH - 15;
				// console.log(666,icH,ttH,pbH,tblH)
				$('.table-box').height(tblH)
			},5)
		}
	}
</script>

<style type="text/scss" lang="scss">
    .operation-log {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: #E7E8EB;
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
                .on {
                    color: #333;
                }
                .el-date-editor{
                    margin:0 20px;
                    span{
                        margin:0;
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
                .el-range-editor .el-range-input{
                    line-height: normal;
                }
                &:last-child{
                    border:none;
                }
            }
        }
        .turn-bottom{
            width:100%;
            height:auto;
            background:#fff;
            .operate-box{
                width:100%;
                height:50px;
                background:#F6F8FA;
                border-bottom: 1px solid #EEEEEE;
                box-sizing: content-box;
                .exportBtn{
                    width:90px;
                    margin: 5px 20px;
                    background:#F5F6F5;
                    border:1px solid #E6E6E6!important;
                    color:#333;
                }
                .exportBtn:hover{
                    background:#1cab7d;
                    color:#fff;
                }
                .search-box{
                    width:240px;
                    height:36px;
                    float:right;
                    margin:7px 20px;
                    background:#fff;
                    border-radius: 5px;
                    border:1px solid #EEEEEE;
                    position: relative;
                    .el-input{
                        border:none;
                        height:36px;
                        input{
                            width:200px;
                            height:36px!important;
                            border:none;
                            line-height:36px;
                        }
                        .el-input__inner:focus{
                            border:none!important;
                            outline: none!important;
                        }
                    }
                    img{
                        width:23px;
                        height:23px;
                        position: absolute;
                        top:5px;
                        right:10px;
                        cursor: pointer;
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
                .el-pagination.is-background .el-pager li:not(.disabled).active{
                    background-color: #1cab7d;
                }
            }
            .state-sus{
                display: inline-block;
                width: 6px;
                height: 6px;
                background: #1cab7d;
                border-radius: 50%;
            }
            .state-err{
                display: inline-block;
                width: 6px;
                height: 6px;
                background: red;
                border-radius: 50%;
            }
        }
        input:focus {
            outline: none !important;
            border: none !important;
        }
        .el-table .cell, .el-table th div{
            padding:0 20px;
        }
    }
</style>
