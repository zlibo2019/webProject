<template>
    <div class="content-setting">
		<ul class="content-list">
			<li class="inner" v-for="(item, index) in listData" :key="index">
				<i class="iconfont " :class="item.iconName"></i>
				<i class="iconfont icon-chakankebiao01" v-if="item.dic_code == '班级课表'"></i>
				<i class="iconfont icon-liuyanhudong" v-else-if="item.dic_code == '学生留言'"></i>
				<i class="iconfont icon-kaoqin" v-else-if="item.dic_code == '今日考勤'"></i>
				<i class="iconfont icon-laoshikebiao" v-else-if="item.dic_code == '课程信息'"></i>
				<i class="iconfont icon-xw" v-else-if="item.dic_code == '新闻资讯'"></i>
				<h4>{{item.dic_code}}</h4>
				<p>{{item.notes}}</p>
				<Button btnClass="custom6" btnHeight="38px" btnFontSize="12px" title="编辑" @click="listClick(item)"></Button>
			</li>
		</ul>

        <!-- 编辑弹窗 -->
		<el-dialog :title="ruleForm.title" :visible.sync="ruleDialog" width="650px" center class="form-dialog">
            <div class="content">
                <el-form ref="ruleForm" label-width="100px" :rules="rules" :model="ruleForm">
					<el-form-item label="功能名称：">
						<el-input v-model="ruleForm.title" placeholder="请输入功能名称" 
						clearable style="width: 300px;" readonly=""></el-input>
                    </el-form-item>
					<el-form-item label="是否显示：">
						<el-radio-group v-model="ruleForm.is_show">
							<el-radio :label="1">是</el-radio>
							<el-radio :label="0">否</el-radio>
						</el-radio-group>
                    </el-form-item>
					<el-form-item label="替换内容：" v-if="ruleForm.lx == 1">
                        <el-select v-model="ruleForm.content_table" placeholder="请选择替换内容">
                            <el-option v-for="item in replaceData"  :key="item.id" :label="item.value" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="默认内容：" prop="content" v-if="ruleForm.lx == 234568 ">
						<el-input v-model="ruleForm.content" placeholder="请输入默认内容" 
						clearable style="width: 300px;" ></el-input>
                    </el-form-item>
					<el-form-item label="内容来源：" prop="contentSource" v-if="ruleForm.lx == 3">
                        <el-select v-model="ruleForm.news_from_id" placeholder="请选择内容来源">
                            <el-option v-for="item in newsListData"  :key="item.id" :label="item.news_name" :value="item.id"> </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="自定义内容：" prop="content_user" v-if="ruleForm.lx == 2 ">
						<el-input v-model="ruleForm.content_user" placeholder="请输入自定义内容" type="textarea" :rows="5"
						clearable style="width: 300px;" ></el-input>
                    </el-form-item>
                </el-form>
				<dd v-if="ruleForm.lx == 1" >注：可设置其他信息替换现在的班级课表</dd>
				<dd v-if="ruleForm.lx == 2 ">注：默认和自定义内容，在此功能没有数据或不显示时显示</dd>
            </div>
			<span slot="footer" class="dialog-footer">
				<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
					@click="saveForm"></Button>
				<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
					@click="ruleDialog = false"></Button>
			</span>
			
        </el-dialog>

        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'

	export default {
		name: 'ContentSetting',
		components: {
			Button, Toast
		},
		data() {
			return {
                defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
                navData:[
					{
						title:'班牌内容设置',
						value: 0 ,
					},
					{
						title:'播放规则设置',
						value: 1 ,
					}
				],//tab数据
				listData:[
					{
						title:'新闻资讯',
						explain:'最新的时事政治，热点新闻话题',
						iconName:'icon-xw',
						value:0
					},
					{
						title:'课程信息',
						explain:'班级当前时间的课程状态',
						iconName:'icon-laoshikebiao',
						value:1
					},
					{
						title:'学生留言',
						explain:'学生给家长的留言信息',
						iconName:'icon-liuyanhudong',
						value:2
					},
					{
						title:'班级课表',
						explain:'班级的课表信息',
						iconName:'icon-chakankebiao01',
						value:3
					},
					{
						title:'今日考勤',
						explain:'班级的今日考勤情况',
						iconName:'icon-kaoqin',
						value:4
					},
				],
				ruleDialog:false,//弹窗
				ruleForm:{
					title:'',//标题名称
					lx:'',//所点击规则类型
					checked:1,
					content_table:'',//替换名称
					content:'',//默认内容
					contentSource:'',//内容来源
					content_user:'',//自定义内容
				},//form
				replaceData:[
                    {
                        id:1,
                        value:'校历',
                    },{
                        id:2,
                        value:'上课时间',
                    }
				],//替换内容下拉列表 暂时写死
				newsListData:[
                   {
                       id:1,
                       news_name:'百度新闻'
                   } 
                ],//新闻来源下拉列表
				rules:{
                    sourceName: [
                        {  required: true, message: '请输入资源名称', trigger: 'blur' }
					],
                    resourceName: [
                        {  required: true, message: '请输入资源库名称', trigger: 'blur' }
					],
					selectedResource:[
						{required: true, message: '请选择资源库', trigger: 'change'}
					],
				},
			}
		},
		methods: {
			/**
			 *  @function: toast关闭
			 *  @author: cs
			 *  @date 2018-08-01
			 */
			hideToast() {
				this.isToast = false;
			},
			/**
			 *  @function: tab点击
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			navClick(item){
				console.log('tab点击',item);
				if(item.value == 0){
					return
				}else if(item.value == 1){
					this.$router.push('/PlayRuleSetting');
				}
			},
			/**
			 *  @function: 列表点击
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			listClick(item){
				console.log('列表点击：',item,item.lx);
				this.ruleForm = {
                    title:item.dic_code,//功能名称
                    lx:item.lx,//功能名称
                }
                this.getContentDetail(item.id,item.lx);
            },
            /**
			 *  @function: 获取班牌内容设置列表
			 *  @author: cs
			 *  @date 2019-01-15
			 */
			getListData(){
				let params = {
                    school_id: localStorage.getItem('schoolId')
                };
                this.$loading();
                this.$api.Rules.contentSetList('get',params).then(res => {
                    console.log('获取班牌内容设置列表', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 || res.data.code == 0) {
                        // if (res.data.data.length != 0) {
                          this.listData = res.data.data;
                        // }
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
            },
            /**
			 *  @function: 获取班牌内容设置详细
			 *  @author: cs
			 *  @date 2019-01-15
			 */
			getContentDetail(id,lx){
				let params = {
                    id: id,
                    lx: lx,
                    school_id: localStorage.getItem('schoolId'),
                };
                this.$api.Rules.contentDetail('get',params).then(res => {
                    console.log('获取班牌内容设置详细', res.data.data);
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.$set(this.ruleForm,'id',res.data.data.id);//0不显示  1显示
                        this.$set(this.ruleForm,'is_show',res.data.data.is_show);//0不显示  1显示
                        this.$set(this.ruleForm,'content_table',res.data.data.content_table*1);//替换内容
                        this.$set(this.ruleForm,'content_user',res.data.data.content_user);//自定义内容
                        this.$set(this.ruleForm,'news_from_id',res.data.data.news_from_id*1);//新闻来源
                        this.ruleDialog = true;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
            /**
			 *  @function: 获取新闻来源
			 *  @author: cs
			 *  @date 2019-01-16
			 */
			getNewsFrom(){
				let params = {
                    school_id: localStorage.getItem('schoolId'),
                };
                this.$api.Rules.getNewsFrom('get',params).then(res => {
                    console.log('获取新闻来源', res.data);
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.newsListData = res.data.data;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
			},
            /**
			 *  @function: 班牌内容设置保存
			 *  @author: cs
			 *  @date 2019-01-16
			 */
			saveForm(){
				console.log('班牌内容设置保存:',this.ruleForm);
				let params = {
                    lx: this.ruleForm.lx,
                    is_show:this.ruleForm.is_show,
                    school_id: localStorage.getItem('schoolId'),
                };
                if(this.ruleForm.lx == 1){
                    //只可选择校历值为1和作息时间值为2 暂时写死
                    params.content_table = this.ruleForm.content_table;
                    params.content = this.ruleForm.content_table;
                }else if(this.ruleForm.lx == 2){
                    params.content_user=this.ruleForm.content_user;
                }else if(this.ruleForm.lx == 3){
                    params.news_from_id= this.ruleForm.news_from_id;
                }
                this.$loading();
                this.$api.Rules.contentSetList('put',params,this.ruleForm.id).then(res => {
                    console.log('获取班牌内容设置详细', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.ruleDialog = false;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
			},
		},
		created() {
			// this.loadStructure();
			// this.changePage();
			// this.allNum = this.rightsData.length;
            this.getListData();
            this.getNewsFrom();
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			setTimeout(() => {
				let icH = $('.index > .m-cen').height();
				let stH = $('.index .set-top').height();
				let obH = $('.stu-turnover-set .stu-right .title').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - stH - obH - pbH - 10;
				$('.stu-turnover-set .stu-right .content').height(tblH)
				//左侧树状图滚动条
				let importHeight = $('.student-access').height()  - $('.stu-left .title').height();
				$('.stu-left .content').height(importHeight);
			}, 20)
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .content-setting{
		width: 100%;
		height: 100%;
		.setting-top{
			min-height: 5vh;
			height: 5vh;
			line-height: 5vh;
			background-color: #fff;
			overflow: hidden;
			ul{
				display: inline-block;
				width: 100%;
				min-width: 420px;
				li{
					float: left;
					width: 125px;
					text-align: center;
					color: #6C6C6C;
					font-size: 15px;
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
		}
		.content-list{
			width: 100%;
			// height: 100%;
			display: flex;
			// flex-wrap: wrap;
			li{
				flex: 1;
				text-align: center;
				// width: 19%;
				margin-top: 20px;
				margin-right: 20px;
				background-color: #fff;
				&:nth-last-child(1){
					margin-right: 0;
				}
				&:hover{
					i{
						color: #1cab7d;
					}
				}
				i{
					font-size: 5vw;
					height: 5vw;
					display: inline-block;
					margin-top: 20px;
					-webkit-transition: 0.3s;
					-moz-transition: 0.3s;
					-ms-transition: 0.3s;
					-o-transition: 0.3s;
					transition: 0.3s;
				}
				h4{
					font-size: 16px;
					line-height: 20px;
					font-weight: bold;
					color: #000;
					margin-top: 20px;
					margin-bottom: 10px;
				}
				p{
					overflow: hidden;
					text-overflow:ellipsis;
					white-space: nowrap;
					font-size: 14px;
					margin: 10px 20px;
				}
				.button-div {
					height: 20px;
					width: 70%;
					margin-bottom: 20px;
					background: #F2F2F2;
					> div {
						height: 20px;
					}
				}
			}
		}
		.form-dialog{
			/deep/ .el-dialog{
				margin-top: 15vh !important;
				.el-select__input{
					display: inline !important;
					border: none !important;
				}
				.el-dialog__body{
					padding-bottom: 0 !important;
				}
				.el-form{
					text-align: left;
					.el-form-item{
						padding-bottom: 0!important;
					}
					/deep/ .el-checkbox__inner{
						border-radius: 50% !important;
					}
					/deep/ .el-checkbox__label{
						color: #333 !important;
					}
				}
				dd{
					color: #f56c6c;
					font-size: 12px;
					margin-left: 17px;
					margin-bottom: 23px;
				}
				.el-dialog__footer {
					.dialog-footer {
						margin: 0 auto;
						text-align: center;
						.button-div {
							clear: both;
							float: none;
							margin-right: 20px;
						}
					}
				}
			}
		}
	}
</style>
