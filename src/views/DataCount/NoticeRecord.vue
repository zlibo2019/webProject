<template>
    <div class="notice-record">
        <div class="turn-top">
            <div class="turn-box">
                <span>接受人员：</span>
                <el-button :class="{on: onPerson == item.value}" type="text" v-for="item in crewData"
                           :key="item.value" @click="clickPerson(item.value)">{{ item.title }}
                </el-button>
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
                <!--<span v-if="onPerson == 2">{{ allNum }}位家长</span>-->
                <!--<span v-else-if="onPerson == 3">{{ allNum }}位教师</span>-->
                <span>{{ allNum }}条通知记录</span>
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
                    <el-input v-model="mySearch" size="small" placeholder="请输入姓名" @change="search">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                    </el-input>
                </div>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="tableData" border
                          highlight-current-row style="width: 100%" @row-click="toggleSelection"
                          @selection-change="handleSelectionChange" v-loading="tableLoading">
                    <el-table-column prop="indexID" label="序号" width="65"></el-table-column>
                    <el-table-column prop="noticeId" v-if="showIndex"></el-table-column>
                    <el-table-column prop="userName" label="姓名" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userTypeName" label="人员身份" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="noticeTitle" label="通知标题" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="noticeDetail" label="通知内容">
                        <template slot-scope="scope">
                            <span @click="lookNotice(scope.row)" style="background: none;color:#1cab7d;border:none;cursor: pointer;">查看内容</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="publishName" label="发布人" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="noticeDate" label="发布时间" align="center" show-overflow-tooltip></el-table-column>
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
        <el-dialog title="查看通知详情" :visible.sync="noticeDetailDialog" width="80vh" center class="look-notice">
            <div slot="title" class="dialog-title">{{ noticeTitle }}</div>
            <div class="content">
                <div class="detail" v-if="noticeContent != ''">{{ noticeContent }}</div>
                <div class="img-list" v-if="imgList">
                    <div class="img-div" v-for="(img, index) in imgList" @dblclick="clickImgZoom(img)" :key="index" v-if="img != ''">
                        <img :onerror="defaultErrImg"
                        :src="uploadPicUrl + img+'?imageView2/1'" title="双击查看原图">
                        <img :src="overImgsrc == index ? zoomS: zoomN" class="cursor-img"
                             @mouseover="overImgsrc=index" @mouseout="overImgsrc=''" title="单击查看原图" @click="clickImgZoom(img)">
                    </div>
                    <div class="zoomImg" @click="closeZoomImg" v-if="imgShow">
                        <img :onerror="defaultErrImg"
                        :src="uploadPicUrl + imgShowSrc+'?imageView2/1'">
                    </div>
                </div>
                <div class="user-info">
                    <div><label>发布时间：</label><span>{{ noticeDate }}</span></div>
                    <div><label>发布人：</label><span>{{ publishName }}</span></div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                    <!--<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="noticeDetailDialog = false"></Button>-->
                    <!--<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveSelectDoorDev"></Button>-->
                <Button title="关闭" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="noticeDetailDialog = false"></Button>
            </span>
        </el-dialog>
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
				daterange: [],   //选择的日期范围
				mySearch:'',     //输入的搜索内容
				tableData: [],
				zoomS: require('../../assets/images/zoom_s.png'),
				zoomN: require('../../assets/images/zoom_n.png'),
				showIndex:false,
				allNum: 0,             //table数组总条数
				currentPage:1,      //当前页（默认设为第一页）
//				pageSize:[2,50,100,200],        //分页时每页显示多少条数据的数组
				tableLoading: false,        //表格加载动画
				pageItem:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				isToast: false,
				toast: '',
				depStr: '',        // 学生范围model
				crewData: [     //人员类型数组0：全部 1：学生 2：家长 3：教师
					{
						value: 2,
						title: '家长'
					},
					{
						value: 3,
						title: '班主任'
					},
					{
						value: 0,
						title: '全部'
					}
				],  // 接收人员数组
				onPerson: 0,         // 选择人员
				onTime: 1,         // 选择时间-今天
				noticeDetailDialog: false,  //通知详情菜单
				noticeTitle: '',        // 通知标题
				noticeContent: '通知详情通知详情通知详情通知详情通知详情通知详情通知详情通知详情通知详情通知详情通知详情',        // 通知详情
				noticeContent: '',       // 通知详情
				publishName: '',        // 发布人
				noticeDate: '',        // 发布时间
				imgList: [],            // 通知图片列表
				imgShowSrc: '',         // 放大图片的src
				imgShow: false,         //放大图片
				overImgsrc: '',
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
			 *  @function: 选择人员（学生or教师）
			 *  @author: lxr
			 *  @date 2018-09-04
			 **/
			clickPerson(index){
				// console.log('tag',index)
				this.onPerson = index;
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
				this.onTime = -1;  // 去掉选择今天的样式
				this.getTableData();        // 获取表格数据
			},
			/**
			 *  @function: 点击查看内容
			 *  @author: lxr
			 *  @date 2018-09-04
			 **/
			lookNotice(row){
				this.noticeDetailDialog = true;//通知详情弹窗打开
				this.noticeTitle = row.noticeTitle
				this.publishName = row.publishName
                this.noticeDate = row.noticeDate
                let params = {
                    noticeId:row.noticeId
                }
				this.$api.DataCount.noticeDetail(params).then( res => {
					// console.log('通知列表数据', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.noticeContent = res.data.data.noticeContent;// 后台取出数据
						let imgStr = res.data.data.noticePhoto;// 后台取出数据
						// let imgStr = '15348395260.e3h96dh5a7f09.jpg;15349888780.f95fi5a9baf7.jpg;15349885350.118830e652g97.jpg'
						this.imgList = imgStr.split(',')
						// console.log('imgShow--',this.imgShow)
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
            },
			/**
			 *  @function: 点击查看内容--查看图片-放大
			 *  @author: lxr
			 *  @date 2018-09-04
			 **/
			clickImgZoom( img){
				this.imgShow = true;     // 放大窗口关闭
				this.imgShowSrc = img;  // 清空放大图片地址
            },
			/**
			 *  @function: 点击查看内容--查看图片-关闭放大图片
			 *  @author: lxr
			 *  @date 2018-09-04
			 **/
			closeZoomImg(){
				this.imgShow = false;
				this.imgShowSrc = '';
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
						beginDate: today[0],
						endDate: today[1],
						schoolId: localStorage.getItem('schoolId'),
						userType: this.onPerson,// 0：全部 1：学生 2：家长 3：教师
						userNameLike: this.mySearch,    // 模糊查询条件
					}
				}
				this.tableLoading = true;
				this.$api.DataCount.getNoticeRecord(params).then( res => {
					// console.log('通知列表数据', res)
				    this.tableLoading = false;
					if (res.data.code == 600 ||　res.data.code == 0) {
						if(res.data.data != null){
							this.allNum = res.data.data.total_record;   // 总条数
						}else{
							this.allNum = 0;   // 总条数
						}
						this.tableData = res.data.data.records;
						$.each(this.tableData, (a, b) =>{      //添加序号，切换页面序号连增(注意函数采用ES6写法，否则this指向报错)
							this.$set(this.tableData[a], 'indexID', (this.currentPage - 1) * this.pageItem + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						})
					} else {
						this.allNum = 0;   // 总条数
						this.isToast = true;
						this.toast = res.data.msg;
					}
					// console.log('this.allNum',this.allNum)
				}).catch(err =>{
                    this.tableLoading = false;
                })
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
		},
		mounted() {
			setTimeout(function () {
				let icH = $('.index > .m-cen').height();
				let ttH = $('.turn-top').height();
				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - ttH - obH - pbH -15;
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
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .notice-record {
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
        /deep/ .look-notice{
            .el-dialog{
                position: static;   // 去掉自带relative则不挡住图片详情
            }
            .el-dialog__body{
                height: 400px;
                overflow: auto;
                .content{
                    position: relative;
                    height: 100%;
                }
                .detail{
                    margin-bottom: 20px;
                }
                .img-list{
                    width: 100%;
                    .img-div{
                        width: 32%;
                        height: 180px;
                        display: inline-block;
                        cursor: pointer;
                        position: relative;
                        margin-right: 1%;
                        img{
                            width: 100%;
                            height: 100%;
                        }
                        .cursor-img{
                            position: absolute;
                            right: 0;
                            bottom: 0;
                            width: 25px;
                            height: 25px;
                        }
                        &:last-child{
                            margin-right: 0;
                        }
                    }
                    .zoomImg{
                        width: 100%;
                        height: 100%;
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 3000;
                        background: rgba(0,0,0,0.4);
                        img{
                            max-height: 100%;
                            max-width: 100%;
                            position: absolute;
                            left: 0;
                            right: 0;
                            top: 0;
                            bottom: 0;
                            margin: auto;
                            z-index: 3001;
                        }
                    }
                }
                .user-info{
                    /*text-align: right;*/
                    position: absolute;
                    bottom: 0;
                    right: 0;
                    div{
                        line-height: 30px;
                        label{
                            width: 100px;
                            display: inline-block;
                            text-align: right;
                        }
                        span{
                            min-width: 90px;
                            display: inline-block;
                            text-align: left;
                        }
                    }
                }
            }
            .el-dialog__header{
                position: relative;   // 加上 防止关闭按钮不占位置
            }
            .dialog-title{
                height: 30px;
                line-height: 30px;
            }
            .dialog-footer{
                font-size: 12px;
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
    }
</style>
