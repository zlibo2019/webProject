<template>
    <div class="resource-word">
		<div class="resource-top">
			<ul>
				<li v-for="(item, index) in navData" @click="navClick(item)" :key="index" class="clearfix" :class="{active:item.value == 2}">
					{{ item.title }}<span v-show="item.count!=''">({{ item.count }})</span>
					<img :src="defArrow">
				</li>
			</ul>
			<div class="search-box">
				<el-input v-model="searchVal" size="small" placeholder="请输入资源库名称" @change="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
				</el-input>
				<Button btnClass="custom8" :iconLeft="true" :data="btn1Data" btnFontSize="12px" title="上传文档" @click="uploadClick"></Button>
			</div>
		</div>
		<el-main class="label-list">
			<el-row :gutter="20" >
				<el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12" v-for="(item, index) in labelData" :key="index"  >
					<div class="inner">
						<div class="top">
							<div class="left">
								<el-input v-model="inputVal" maxlength="13" clearable :ref="'edit'+index" size="small" 
								placeholder="请输入资源库名称" style="width:150px;" v-show="item.isInput"></el-input>
								<h4 v-show="!item.isInput" @click="toList(item)">
									{{item.label_name}}
									<span class="count" v-if="item.words.length > 0">{{item.words.length}}</span>
									<span>{{item.creatName}}创建人{{item.user_id}}</span>
								</h4>
								<Button v-show="item.isInput" title="取消" btnClass="custom7" 
								btnFontSize="12px" btnHeight="3.5vh" @click="cancelEditLabel(item,index)"></Button>
								<Button v-show="item.isInput" title="保存" btnClass="custom7" 
								btnFontSize="12px" btnHeight="3.5vh" @click="saveEditLabel(item,index)"></Button>
							</div>
							<!-- <div class="right"> -->
								<Button btnClass="custom6" btnFontSize="12px" btnHeight="3.5vh" title="编辑"
								 @click="editLabel(item,index)" v-show="!item.isInput && item.other_share == 0"></Button>
								<el-checkbox v-model="item.is_share" v-if="item.is_system == 0 && item.other_share == 0" :disabled="!item.isInput">共享</el-checkbox>
							<!-- </div> -->
							<div class="line"></div>
						</div>
						<ul class="bot">
							<li v-for="(todo, idx) in item.words" :key="idx" @click="toDetail(item,todo)">
                                <!-- {{todo.ut_date}} -->
								<p>{{todo.title}}<span>{{todo.ut_date?todo.ut_date:todo.ct_date}}</span></p>
							</li>
						</ul>
					</div>
				</el-col>
			</el-row>
		</el-main>
	</div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import treeTransfer from '@/components/Transfer/transfer-extend'
	import Toast from '@/components/Toast/Toast'
	export default {
		name: 'ResourceWord',
		components: {
			Button, treeTransfer, Toast
		},
		computed: {
			defaultErrImg() {
				return 'this.src="' + this.$store.state.Common.defaultErrImg + '"'
			}
		},
		data() {
			return {
                defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				// ------------------ //
				navData:[
					{
						title:'图片',
						value: 0 ,
						count:'',
					},
					{
						title:'视频',
						value: 1 ,
						count:'',
					},
					{
						title:'文档',
						value: 2 ,
						count:'',
					}
				],//tab数据
				searchVal: "",//搜索内容
				inputVal:'',//上方编辑文件夹名称
				btn1Data:{
					iconL: require('../../../../assets/images/upload.png'),
					iconLAct: require('../../../../assets/images/upload.png')
				},//上传按钮
				labelData:[
					/* {
						label_name:'平台资源库',
						creatName:'平台提供',
						is_share:false,
						is_system:true,
						isInput:false,
						words:[
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						isInput:false,
						words:[
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						isInput:false,
						words:[
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						isInput:false,
						words:[
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
							{
								title:'平台资源库1',
								date:'2018-12-12',
								id:0
							},
						],
					}, */
				],//文件夹列表
				checkedResource:{},//当前点击的资源库
				is_share:false,//是否分享
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
					let stH = $('.index .set-top').height();	
					let ttH = $('.resource-word > .resource-top').height();
					let tblH = icH - stH - ttH -10;
					console.log(66, icH, stH, ttH)
					$('.resource-word .label-list').height(tblH)
				}, 50)
			},
			/**
			 *  @function: 上方点击
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			navClick(item){
				if(item.value == 0){
					this.$router.push('/ResourcePic')
				}else if(item.value == 1){
					this.$router.push('/ResourceVideo')
				}else if(item.value == 2){
					return
				}
			},
			/**
			 *  @function: 上方搜索
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			search() {
				console.log("search",this.searchVal);
			},
			/**
			 *  @function: 上传按钮点击
			 *  @author: cs
			 *  @date 2018-12-12
			 **/
			uploadClick(){
				console.log('上传按钮点击:',this.uploadForm);
				this.$router.push('/UploadWord');
			},
			/**
			 *  @function: 编辑资源库名称
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			editLabel(item,index) {
				console.log('编辑资源库名称:',item.is_share,index);
				this.labelData.forEach((todo,idx)=>{
                    this.$set(this.labelData[idx],'isInput',false)
				})
                this.$set(this.labelData[index],'isInput',true)
                this.inputVal = item.label_name;
                let row = JSON.parse(JSON.stringify(item));
                this.is_share = item.is_share;
				// setTimeout(() => {
				// 	console.log(this.$refs['edit'+index][0]);
				// 	this.$refs['edit'+index].focus();
				// },33);
			},
			/**
			 *  @function: 保存编辑资源库名称
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			saveEditLabel(item,index) {
                console.log('保存编辑资源库名称:',item);
                let params = {
                    id:item.id,  //标签id
                    label_name:this.inputVal,  //标签名称
                    is_share:item.is_share?1:0,    //是否共享(默认不共享)（0不共享，1共享）
                    resource_type:3,    //资源类型（1:图片；2:视频；3:文档）
                    user_id:localStorage.getItem('userId'),//登录人id
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                console.log(params);
                // return
                this.$api.Rules.modifyLabel('put',params).then( res => {
                    console.log('新增修改资源标签', res.data);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.$set(this.labelData[index],'label_name',this.inputVal);
                        this.$set(this.labelData[index],'isInput',false);
                        // this.getResourcesLabels();
                        
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
			},
			/**
			 *  @function: 关闭编辑资源库名称
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			cancelEditLabel(item) {
                console.log('关闭编辑资源库名称:',item);
				item.isInput = false;
                this.inputVal = '';
                item.is_share = this.is_share;
                // this.is_share = row.is_share;
			},
			/**
			 *  @function: 跳转列表页
			 *  @author: cs
			 *  @date 2018-12-18
			 **/
			toList(item) {
				console.log('跳转列表页:',item);
				// let params = {
				// 	is_share:item.is_share,
				// 	label_name:item.label_name,
				// 	count:item.words.length,
				// 	creatName:item.creatName
                // }
                let params = {
					label_id:item.id,//资源标签id
					is_share:item.is_share,//是否共享
					other_share:item.other_share,//是否共享
					label_name:item.label_name,//资源标签名称
					creatName:item.user_id//创建人
                }
				this.$router.push({path: 'WordListDetail', query: params})
			},
			/**
			 *  @function: 跳转详情页
			 *  @author: cs
			 *  @date 2018-12-18
			 **/
			toDetail(item,todo) {
				console.log('跳转详情页:',item,todo);
				let params = {
                    id:todo.id,
                    other_share:item.other_share
                }
				this.$router.push({path: 'WordDetail', query: params})
            },
            /**
			 *  @function: 获取资源标签列表
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			getResourcesLabels(){
				console.log('获取资源标签列表')
                this.$loading();
                let params = {
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    user_id:localStorage.getItem('userId'),//登陆者id
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.Rules.getResourcesLabels('get',params).then( res => {
                    console.log('获取资源标签列表', res.data.data.rows);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        res.data.data.rows.forEach((item)=>{
                            item.is_share = item.is_share == 1;
                        })
                        this.labelData = res.data.data.rows;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
			},
            /**
			 *  @function: 获取各种资源总数
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			getLabelCount(){
				console.log('获取各种资源总数')
                let params = {
                    user_id:localStorage.getItem('userId'),//登陆者id
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.Rules.getLabelCount('get',params).then( res => {
                    console.log('获取各种资源总数', res.data.data);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.navData.forEach(item=>{
                            if(item.title == '图片'){
                                item.count = res.data.data.picture_count;
                            }else if(item.title == '视频'){
                                item.count = res.data.data.video_count;
                            }else if(item.title == '文档'){
                                item.count = res.data.data.word_count;
                            }
                        })
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
			},
		},
		mounted() {
            //权限id数组
			this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
         },
         created(){
             this.getResourcesLabels();//获取资源标签列表
             this.getLabelCount();//获取各种资源总数
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
   .resource-word{
		width: 100%;
		height: 100%;
		.resource-top{
			min-height: 6vh;
			height: 6vh;
			line-height: 6vh;
			background-color: #fff;
			overflow: hidden;
			ul{
				display: inline-block;
				width: 50%;
				min-width: 420px;
				li{
					float: left;
					width: 125px;
					text-align: center;
					color: #6C6C6C;
					font-size: 16px;
					font-weight: bold;
					position: relative;
					cursor: pointer;
					&:nth-last-child(1){
						img{
							display: none;
						}
					}
					img{
						position: absolute;
						top: 0;
						bottom: 0;
						right: -10px;
						margin: auto;
						height: 20px;
					}
					span{
						font-weight: normal;
						font-size: 14px;
						margin-left: 3px;
					}
					&.active{
						color: #1cab7d;
						span{
							color: #6C6C6C;
						}
					}
				}
			}
			.search-box {
				width: 360px;
				height: 6vh;
				float: right;
				margin: 0px 20px 6px 20px;
				position: relative;
				.el-input {
					width: 200px;
					i {
						cursor: pointer;
					}
					margin-right: 10px;
				}
			}
		}
		.label-list{
			width: 100%;
			height: 100%;
			padding: 0;
			overflow-x: hidden;
			.el-col{
				margin-top: 20px;
				.inner{
					background-color: #fff;
					padding: 10px;
					overflow: hidden;
					position: relative;
					.top{
						height: 4vh;
						line-height: 4vh;
                        overflow: hidden;
						.left{
							width: auto;
							float: left;
							margin-left: 8px;
							h4{
								font-size: 16px;
								font-weight: bold;
								display: inline-block;
								cursor: pointer;
							}
							span{
								font-size: 12px;
								color: #6c6c6c;
								font-weight: normal;
							}
							.count{
								background-color: #1cab7d;
								color: #fff;
								padding: 3px 8px;
								border-radius: 3px;
								margin-right: 30px;
							}
							.button-div{
								margin-top: 3px;
								margin-left: 10px;
							}
						}
						.button-div{
							float: right;
							margin-top: 3px;
							margin-left: 20px;
						}
						.el-checkbox{
							float: right;
						}
                        /deep/ .el-checkbox{
							.el-checkbox__inner{
								border-radius: 50% !important;
							}
							.el-checkbox__label{
								color: #333 !important;
							}
                            .is-checked{
                                .el-checkbox__inner{
                                    background-color: #1cab7d;
                                    border-color: #1cab7d;
                                    color: #fff;
                                    &::after{
                                        border-color: #fff;
                                    }
                                }
                            }
						}
						.line{
							width: 100%;
							height: 1px;
							background-color: #e7e8eb;
							position: absolute;
							left: 0;
							top: 6vh;
						}
					}
					.bot{
						width: 100%;
						height: 150px;
						overflow: hidden;
						margin-top: 20px;
						li{
							width: 100%;
							float: left;
							height: 30px;
							// list-style: outside;
							line-height: 30px;
							// margin-left: 27px;
							position: relative;
							cursor: pointer;
							&::after{
								content: '·';
								font-size:20px;
								position: absolute;
								left: 10px;
								top: 0;
								margin: auto
							}
							&:hover{
								color: #1cab7d;
							}
							p{
								height: 30px;
								line-height: 30px;
								margin-bottom: 0;
								margin-left: 20px;
								span{
									float: right;
									text-align: right;
								}
							}
						}
					}
					h5{
						font-size: 14px;
						line-height: 35px;
					}
					p{
						font-size: 12px;
						line-height: 14px;
						margin-bottom: 8px;
					}
					/deep/ .el-checkbox__inner{
						border-radius: 50% !important;
					}
					/deep/ .el-checkbox__label{
						color: #333 !important;
					}
					.button-div {
						height: 20px;
						float: right;
						background: #F2F2F2;
						> div {
							height: 20px;
						}
					}
					
				}
			}
			
		}
   }
</style>
