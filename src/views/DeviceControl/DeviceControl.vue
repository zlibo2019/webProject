<template>
    <div class="device-control">
        <div class="m-top">
            <div class="turn-box">
                <span>设备状态：</span>
                <div class="state-box">
                    <el-button :class="{on:onState == item.value}" type="text" @click="selectDeviceState(item.value)"
                               v-for="item in deviceStateData" :key="item.value">{{ item.title }}
                    </el-button>
                </div>
            </div>
			<div class="turn-box">
                <span>设备类型：</span>
                <div class="state-box">
                    <el-button :class="{on:onType == index}" type="text" @click="selectDeviceType(index,item)"
                               v-for="(item,index) in deviceTypeData" :key="index">{{ item.deviceName }}
                    </el-button>
                </div>
            </div>
            <div class="turn-box">
                <span>所在区域：</span>
                <div class="state-box">
                    <el-button :class="{on:onRegion == index}" type="text" @click="selectRegion(index,item)"
                               v-for="(item,index) in regionData" :key="item.placeId">{{ item.placeName }}
                    </el-button>
                </div>
            </div>
        </div>
        <div class="m-bottom">
            <div class="operate-box">
                {{ titleName }}设备<span>({{ tableData.length }}台)</span>
            </div>
            <div class="table-box">
                <el-table id="table" border ref="multipleTable" height="100%" :data="tableData" tooltip-effect="dark"
                          highlight-current-row style="width: 100%" v-loading="tableLoading">
                    <el-table-column prop="indexID" label="序号" min-width="60" align="center"></el-table-column>
                    <el-table-column prop="id" v-if="showIndex"></el-table-column>
                    <el-table-column prop="dev_run_status" label="运行状态" min-width="100" align="center" show-overflow-tooltip><!-- :formatter="columState"-->
                        <template slot-scope="scope" class="state-col">
                            <img src="../../assets/images/online.png" alt="" v-if="scope.row.dev_run_status == 1">
                            <img src="../../assets/images/offline.png" alt="" v-if="scope.row.dev_run_status == 0">
                            <span v-if="scope.row.dev_run_status == 1">在线</span>
                            <span v-if="scope.row.dev_run_status == 0">离线</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dev_name" label="设备状态" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dev_name" label="设备名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="place_name" label="所在区域" min-width="100" align="center" show-overflow-tooltip></el-table-column><!-- :formatter="columPlace"-->
                    <el-table-column prop="dev_ip" label="设备IP" align="center" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dev_id" label="设备ID" align="center" min-width="100" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dev_type" label="设备类型" min-width="100" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.dev_type}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="last_online" label="最后在线时间" min-width="130" align="center" show-overflow-tooltip>
						<template slot-scope="scope" >
                            <span v-if="scope.row.dev_run_status == 1">/</span>
                            <span v-else-if="scope.row.dev_run_status == 0">{{scope.row.last_online?scope.row.last_online:'/'}}</span>
                        </template>
					</el-table-column>
					<el-table-column fixed="right" label="操作" min-width="250" align="center" >
							<template slot-scope="scope">
								<el-button class="normal" size="mini" plain @click="checkRuleSet(scope.row)">查看规则设置</el-button>
								<el-button class="normal" size="mini" plain @click="checkCardControl(scope.row)">查看班牌监控</el-button>
							</template>
						</el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
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
		data() {
			return {
				titleName: '全部', //查询标题
				onState: 2,        //设备状态
				onType: 0,        //设备类型 
				onRegion: 0,       //选中区域
                zPlaceId:0,         //选中区域
                placeId:0,         //选中区域
				deviceStateData: [ //设备状态条件数组
					{
						title: '全部',
						value: 2
					},{
						title: '在线',
						value: 1
					},{
						title: '离线',
						value: 0
					}],
					/* TODO */
				deviceTypeData:[
					{
						deviceName:'全部'
					},
					{
						deviceName:'考勤机'
					},
					{
						deviceName:'门禁机'
					},
					{
						deviceName:'脱机消费'
					},
					{
						deviceName:'联机消费'
					},
					{
						deviceName:'班牌设备'
					},
					{
						deviceName:'访客机'
					},
					{
						deviceName:'门卫机'
					},
				],//设备类型列表：1考勤，2门禁，3脱机消费，4联机消费，7班牌设备，21访客机，22门卫机
				regionData: [],//所在区域
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				tableData: [],//table数组
				showIndex: false,
				allNum: 0,             //table数组总条数
				currentPage: 1,      //当前页（默认设为第一页）
				tableLoading: false,        //表格加载动画
				pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
			}
		},
		methods: {
			/**
			 *  @function: 获取条件中区域列表
			 *  @author: wzx
			 *  @date 2018-7-20
			 **/
			getRegion() {
				let params = {
					placeId: this.zPlaceId
				}
				this.$api.DeviceControl.getBuildList(params).then( res =>{
					// console.log('区域111111111111', res.data.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.initLayout();//初始化布局
						this.regionData = res.data.data;
						this.regionData.unshift({"placeId": 0, "placeName": "全部"})
						// console.log('all区域', this.regionData)
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 选择设备状态条件
			 *  @author: lxr
			 *  @date 2018-7-12
			 **/
			selectDeviceState(index) {
				this.onState = index;
				if (index == 0) {//离线
					this.titleName = '离线';
				} else if (index == 1) {//在线
					this.titleName = '在线';
				} else if (index == 2) {//全部
					this.titleName = '全部';
				}
				//刷新设备数据
				this.getDevices();
			},
			/**
			 *  @function: 选择区域条件
			 *  @author: lxr
			 *  @date 2018-7-12
			 **/
			selectRegion(index,item) {
				this.onRegion = index;
				this.placeId = item.placeId
                // console.log(12312321231,index,this.placeId)
				//刷新设备数据
				this.getDevices();
			},
			/**
			 *  @function: 选择设备类型
			 *  @author: lxr
			 *  @date 2018-7-12
			 **/
			selectDeviceType(index,item) {
                console.log('选择设备类型');
				this.onType = index;
				//刷新设备数据
				this.getDevices();
			},
			/**
			 *  @function: 表格中设备运行状态的格式化函数  userType:0-->离线；1-->在线；
			 *  @author: wzx
			 *  @date 2018-7-31
			 **/
			columState(row, column, cellValue){               //（处理状态）星号列展示formatter
                // console.log(6666,cellValue)
				if(cellValue == 0){//
					cellValue = '离线'
				}else if(cellValue == 1){
					cellValue = '在线'
				}
				return cellValue
			},
			/**
			 *  @function: 表格中所在区域的格式化函数  placeId:0-->；1-->；
			 *  @author: wzx
			 *  @date 2018-7-31
			 **/
			columPlace(row, column, cellValue){               //（处理状态）星号列展示formatter
				if(cellValue == 0){//
					cellValue = ''
				}else if(cellValue == 1){
					cellValue = ''
				}
				return cellValue
			},
			/**
			 *  @function: 表格中设备类型的格式化函数  devType:0-->；1-->；
			 *  @author: wzx
			 *  @date 2018-7-31
			 **/
			columType(row, column, cellValue){               //（处理状态）星号列展示formatter
				if(cellValue == 0){//
					cellValue = ''
				}else if(cellValue == 1){
					cellValue = ''
				}
				return cellValue
			},
			/**
			 *  @function: 查询目前设备状态和所在区域条件下的表格
			 *  @author: wzx
			 *  @date 2018-7-20
			 **/
			getDevices() {
				this.tableLoading = true;
				this.tableData = []
                /* 
                //原来
                let params = {
					pageNum: this.currentPage,
					pageSize: this.pageItem,
					devState: this.onState,	//设备状态  0:离线 1:在线 2:全部
					placeId: this.placeId,	//所在区域id 全部传的null
	                schoolId: parseInt(localStorage.getItem('schoolId'))
				}
				this.$api.DeviceControl.getDevList(params).then(res => {
					// console.log('3322', res)
					this.tableLoading = false;
					if (res.data.code == 600 || res.data.code == 0) {
                        this.tableData = res.data.data.records;
                        this.allNum = res.data.data.total;
                        if(this.tableData.length>0){
	                        $.each(this.tableData, (a, b) =>{      //添加序号，切换页面序号连增(注意函数采用ES6写法，否则this指向报错)
		                        this.$set(this.tableData[a], 'indexID', (this.currentPage - 1) * this.pageItem + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
	                        })
                        }
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
                }) */
                
                
                let params = {
					page_index: this.currentPage,
					page_size: this.pageItem,
					online_status: this.onState,	//设备状态  0:离线 1:在线 2:全部
					place_id: 1,//this.placeId,	//所在区域id， 0 所有
					dev_type: 0,	//1考勤，2门禁，3消费，21访客，22门卫，0 所有
	                school_id: localStorage.getItem('schoolId')
				}
				this.$api.DeviceControl.getDevList('get',params).then(res => {
                    console.log('3322', res.data.data)
					this.tableLoading = false;
					if (res.data.code == 600 || res.data.code == 0) {
                        this.tableData = res.data.data;
                        // this.allNum = res.data.data.count;
                        this.tableData.forEach((item,index)=>{
                            this.$set(item, 'indexID', (this.currentPage - 1) * this.pageItem + index + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
                        })
                        // if(this.tableData.length>0){
	                    //     $.each(this.tableData, (a, b) =>{      //添加序号，切换页面序号连增(注意函数采用ES6写法，否则this指向报错)
		                //         this.$set(this.tableData[a], 'indexID', (this.currentPage - 1) * this.pageItem + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
	                    //     })
                        // }
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
                })
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
				this.changePage(this.pageItem, this.currentPage);
			},
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.changePage(this.pageItem, this.currentPage);
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
			 *  @function页面布局初始化的功能
			 *  @author: wzx
			 *  @date 2018-7-12
			 **/
			initLayout() {
				setTimeout( function() {
					let icH = $('.index > .m-cen').height();
					let ttH = $('.device-control > .m-top').height();
					let obH = $('.operate-box').height();
					let pbH = $('.pagination-box').height();
					let tblH = icH - ttH - obH - pbH - 15;
					// let tblH = icH - ttH - obH - 15;
					// console.log(666,icH,ttH,obH,pbH,tblH)
					$('.table-box').height(tblH)
				}, 50)
			},
			/* --------------三期------------- */
			/**
			 *  @查看规则设置
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			checkRuleSet(row) {
				console.log("查看规则设置",row);
				this.$router.push('/Index')
				this.$router.push('/SchoolRecord')
				// this.$router.push('/SchoolRecord')
			},
			/**
			 *  @查看班牌监控
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			checkCardControl(row) {
				console.log("查看班牌监控",row);
				let params = {
					source:'DeviceControl',
					placeName:row.place_name,
					placeId:'10005',
				}
				this.$router.push({path: '/CardMonitor', query: params})
			},
		},
		mounted() {
			this.initLayout();//初始化布局
		},
		created() {
			this.getDevices();//加载表格数据
			this.getRegion();//加载区域列表
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .device-control {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: #E7E8EB;
        .m-top {
            width: 100%;
            height: auto;
            background: #fff;
            margin-bottom: 15px;
            padding: 0 35px;
            .el-button {
                font-size: 12px;
            }
            .turn-box {
                width: 100%;
                height: auto;
                min-height: 50px;
                border-bottom: 1px solid #E1E1E1;
                /*line-height: 50px;*/
                font-size: 12px;
                color: #333;
                display: flex;
                flex-direction: row;
                padding:10px 0;
                span {
                    margin: 0 10px 0 0;
                    flex-basis:70px;
                    line-height: 30px;
                }
                .state-box{
                    flex:1;
                    .el-button {
                        margin-left: 10px;
                    }
                    button {
                        color: #AAAAAA;
                        padding:0;
                        line-height: 30px;
                    }
                    .on {
                        color: #333;
                    }
                }

                .el-date-editor {
                    margin: 0 20px;
                    span {
                        margin: 0;
                    }
                }
                .el-select {
                    .el-input {
                        input {
                            height: 40px !important;
                        }
                        span {
                            margin: 0;
                        }
                    }
                }
                &:last-child {
                    border: none;
                }
            }
        }
        .m-bottom {
            width: 100%;
            height: auto;
            background: #fff;
            .operate-box {
                width: 100%;
                height: 60px;
                line-height: 60px;
                border-bottom: 1px solid #e1e1e1;
                box-sizing: content-box;
                padding-left: 35px;
                font-size: 18px;
                font-weight: bold;
                span {
                    font-size: 14px;
                    padding-left: 15px;
                    font-weight: normal;
                }
            }
            .table-box {
                td:nth-of-type(2) {
                    img, span {
                        vertical-align: middle;
                    }
                    span {
                        margin-left: 5px;
                    }
                }
            }
            .pagination-box {
                width: 100%;
                height: 60px;
                background: #fff;
                box-sizing: content-box;
                 .el-pagination{
                     padding-top: 15px;
                 }
            }
        }
    }
</style>
