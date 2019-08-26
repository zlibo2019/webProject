<template>
    <div class="resource-video">
		<div class="resource-top">
			<ul>
				<li v-for="(item, index) in navData" @click="navClick(item)" :key="index" class="clearfix" :class="{active:item.value == 1}">
					{{ item.title }}<span v-show="item.count!=''">({{ item.count }})</span>
					<img :src="defArrow">
				</li>
			</ul>
			<div class="search-box">
				<el-input v-model="searchVal" size="small" placeholder="请输入资源库名称" @change="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
				</el-input>
				<Button btnClass="custom8" :iconLeft="true" :data="btn1Data" btnFontSize="12px" title="上传视频" @click="uploadClick"></Button>
			</div>
		</div>
		<el-main class="label-list">
			<el-row :gutter="20" >
				<el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" v-for="(item, index) in labelData" :key="index"  >
					<div class="inner" style="cursor: pointer;">
						<div @click="ViewDetail(item)">
							<div class="top">
                                <img :src="item.videos.length>0?uploadPicUrl+item.videos[0].cdn_name+'?vframe/jpg/offset/0/w/246/h184':''" :onerror="defaultErrImg">
								<!-- <img :src="item.videos[0].imgUrl" :onerror="defaultErrImg"> -->
								<span v-if="item.videos.length>0">{{item.videos.length}}</span>
							</div>
							<h5>
								{{item.label_name}}
								<i class="iconfont icon-shipin3"></i>
							</h5>
						</div>
						<p>{{item.creatName}}</p>
						<el-checkbox v-model="item.is_share" disabled="" v-if="item.is_system == 0 && item.other_share == 0">共享</el-checkbox>
						<!-- <Button btnClass="custom6" v-if="!item.is_system" btnWidth="60%" btnHeight="30px" btnFontSize="12px" title="编辑" @click="changeLabels(item)"></Button>
						<Button btnClass="custom6 is-system" v-else btnWidth="100%" btnHeight="30px" btnFontSize="12px" title="平台提供资源" @click="changeLabels(item)"></Button> -->
                        
                        <Button btnClass="custom6" v-if="item.is_system == 0 && item.other_share == 0" btnWidth="60%" btnHeight="30px" btnFontSize="12px" title="编辑" @click="changeLabels(item)"></Button>
						<Button btnClass="custom6 is-system" v-if="item.is_system == 1 " btnWidth="100%" btnHeight="30px" btnFontSize="12px" title="平台提供资源" @click=""></Button>
						<Button btnClass="custom6 is-system" v-if="item.other_share == 1" btnWidth="100%" btnHeight="30px" btnFontSize="12px" title="他人共享资源" @click=""></Button>
                    </div>
				</el-col>
			</el-row>
		</el-main>

		<!-- 新建、编辑资源库 -->
		<el-dialog :title="chooseType == 0?'新建资源库':'编辑资源库'" :visible.sync="labelDialog" 
        :width="chooseType == 0?'500px':'650px'" center class="edit-dialog">
            <div class="content">
                <el-form ref="labelForm" label-width="100px" :rules="rules" :model="labelForm">
					<el-form-item label="资源库名称：" prop="label_name" >
						<el-input v-model="labelForm.label_name" placeholder="请输入资源库名称" 
						clearable style="width: 230px;" ></el-input>
                    </el-form-item>
					<el-form-item label="资源库共享：">
						<el-checkbox v-model="labelForm.is_share">共享</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <!-- <span slot="footer" class="dialog-footer">
				<div class="del-resource" @click="delResource">
					<i class="iconfont icon-shanchu1"></i>
					<span>删除资源库</span>
				</div>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveEditResource"></Button>
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="labelDialog = false"></Button>
            </span> -->
            <span slot="footer" class="dialog-footer" :class="{'add-foot':chooseType == 0}">
				<div class="del-resource" @click="delResource" v-if="chooseType == 1">
					<i class="iconfont icon-shanchu1"></i>
					<span>删除资源库</span>
				</div>
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="labelDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveLabels"></Button>
            </span>
        </el-dialog>

		<!-- 新建资源库 -->
		<!-- <el-dialog title="新建资源库" :visible.sync="labelDialog" width="500px" center class="upload-dialog">
            <div class="content">
                <el-form ref="labelForm" label-width="100px" :rules="rules" :model="labelForm">
					<el-form-item label="资源库名称：" prop="label_name" >
						<el-input v-model="labelForm.label_name" placeholder="请输入资源库名称" 
						clearable style="width: 230px;" ></el-input>
                    </el-form-item>
					<el-form-item label="资源库共享：">
						<el-checkbox v-model="labelForm.is_share">共享</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="labelDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveAddResource"></Button>
            </span>
        </el-dialog> -->

		<!-- 发布到班牌 -->
		<el-dialog title="发布到班牌" :visible.sync="choosePlaceDialog" width="900px" center class="sch-system-dialog">
			<div class="content">
				<div class="transfer-div">
					<tree-transfer :from_data="fromData" leftTitle='选择场所/教室' leftplaceholder='请输入场所/教室名称' sourceDiffer="2" 
					:user_data="listClassroom" @showSelected="getSelected" @checkedClick="checkedClick"></tree-transfer>
					<div class="checked-box">
						<el-checkbox v-model="toCard">发布到班牌</el-checkbox>
                        <el-checkbox v-model="toParent">分享到家长端</el-checkbox>
					</div>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
						@click="choosePlaceDialog = false"></Button>
				<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
						@click="publishResource"></Button>
			</span>
		</el-dialog>

		<!-- 上传视频 -->
		<el-dialog title="上传视频" :visible.sync="uploadDialog" width="650px" center class="upload-dialog">
            <div class="content">
                <el-form ref="uploadForm" label-width="100px" :rules="rules" :model="uploadForm">
					<el-form-item label="资源库：" prop="label_id">
                        <el-select v-model="uploadForm.label_id" placeholder="请选择资源库">
                            <el-option v-for="item in userLabels"  :key="item.id" :label="item.label_name" :value="item.id"> </el-option>
                        </el-select>
                        <Button btnClass="custom11" btnFontSize="12px"  title="+添加"  @click="changeLabels" ></Button>
						<br>
						<el-checkbox v-model="uploadForm.is_share" @change = "changeShare">共享资源库</el-checkbox>
                    </el-form-item>
                </el-form>
				<el-upload
					class="upload-box"
					ref="upload"
					drag
					list-type="picture"
					action="https://upload.qiniup.com"
					:data="uploadParams"
					:file-list="fileList"
					:on-change="changeUpload"
					:before-upload="beforeUpload"
					:on-success="uploadSuccess"
					:on-error="uploadError"
                    :limit="filesLimit"
                    :on-exceed="handleExceed"
                    :on-remove="handleRemove">
                    <Button btnClass="custom8" btnFontSize="12px"  title="立即上传"></Button>
					<div class="el-upload__text">点击/拖拽一个或多个文件到这里上传<br>支持mp4</div>
				</el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="uploadDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveUpload"></Button>
            </span>
        </el-dialog>

        <!-- 上传完成 -->
		<el-dialog title="上传完成" :visible.sync="uploadSuccessDialog" width="400px" center class="upload-success">
				<Button title="暂不发布" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
						@click="uploadSuccessDialog = false" v-if="roleNos.indexOf('S01') > -1"></Button>
				<Button title="发布视频" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
						@click="choosePlaceDialog = true" v-if="roleNos.indexOf('S01') > -1"></Button>
				<Button title="发布视频" btnClass="custom8" btnFontSize="12px" btnHeight="40px" v-if="roleNos.indexOf('S01') == -1"
						@click="publishResource"></Button>
                <br>
                <el-checkbox v-model="toCard" v-if="roleNos.indexOf('S01') == -1">发布到班牌</el-checkbox>
                <el-checkbox v-model="toParent" v-if="roleNos.indexOf('S01') == -1">分享到家长端</el-checkbox>
		</el-dialog>

		<!-- 发布完成 -->
		<el-dialog title="发布完成" :visible.sync="publishSuccessDialog" width="400px" center class="upload-success">
				<Button title="暂不发布" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
						@click="publishSuccessDialog = false"></Button>
				<Button title="发布到家长端" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
						@click="publishSuccessDialog = false"></Button>
		</el-dialog>
	</div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import treeTransfer from '@/components/Transfer/transfer-extend'
	import Toast from '@/components/Toast/Toast'
	import Swiper from 'swiper';
	export default {
		name: 'ResourceVideo',
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
				swiperSpeed: 5000,//swiper速度
				useTemplateData:[
					{
						templateName:'德育模板模型',
						imgUrl:require('../../../../assets/images/moral_pic_default.jpg')	
					},
					{
						templateName:'德育模板模型',
						imgUrl:require('../../../../assets/images/moral_pic_default.jpg')	
					},
					{
						templateName:'综合模板模型',
						imgUrl:require('../../../../assets/images/moral_pic_default.jpg')	
					},
					{
						templateName:'功能性模板模型',
						imgUrl:require('../../../../assets/images/moral_pic_default.jpg')		
					},
					{
						templateName:'德育模板1模型',
						imgUrl:require('../../../../assets/images/moral_pic_default.jpg')	
					},
					{
						templateName:'德育模板1模型',
						imgUrl:require('../../../../assets/images/moral_pic_default.jpg')	
					},
				],//应用的模板数据
				templateDetailDialog:false,//应用模板弹窗
				choosePlaceDialog:false,//选择教室弹窗
				listClassroom: [],          //选中的教室数组,传给后台的参数
				fromData: [{
					"id": 1000,
					"pid": 101,
					"label": "烟台一中",
					"group": 102,
					"disabled": 0,
					"children": [{
						"id": 10000,
						"pid": 1000,
						"label": "校门口",
						"disabled": 0,
						"group": 103,
						"children": [{
							"id": 10010,
							"pid": 10000,
							"label": "101",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10011,
							"pid": 10000,
							"label": "102",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10012,
							"pid": 10000,
							"label": "103",
							"disabled": 0,
							"group": 104,
							"children": []
						}]
					},{
						"id": 10001,
						"pid": 1000,
						"label": "传达室",
						"disabled": 0,
						"group": 103,
						"children": [
							{
							"id": 10020,
							"pid": 10001,
							"label": "201",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10021,
							"pid": 10001,
							"label": "202",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10022,
							"pid": 10001,
							"label": "203",
							"disabled": 0,
							"group": 104,
							"children": []
						}]
					}]
				}],   // 清空
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
						videos:[
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							}
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						videos:[
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							}
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						videos:[
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							}
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						videos:[
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							}
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						videos:[
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							}
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						videos:[
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							}
						],
					},
					{
						label_name:'学校春季运动会',
						creatName:'李浩轩',
						is_share:true,
						videos:[
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							},
							{
								imgUrl:require('../../../../assets/images/moral_pic_default.jpg')
							}
						],
					}, */
				],//文件夹列表
				checkedResource:{},//当前点击的资源库
				labelDialog:false,//新增/修改资源库弹窗
				
				labelForm:{
					label_name:'',//资源库名称
					resourceId:0,//资源库Id
					is_share:false,//资源库是否共享
				},//新增/修改资源标签form
				rules:{
                    sourceName: [
                        {  required: true, message: '请输入资源名称', trigger: 'blur' }
					],
                    label_name: [
                        {  required: true, message: '请输入资源库名称', trigger: 'blur' }
					],
					label_id:[
						{required: true, message: '请选择资源库', trigger: 'change'}
					],
				},
				uploadDialog:false,//上传弹窗
				publishSuccessDialog:false,//发布成功弹窗
				uploadSuccessDialog:false,//上传成功弹窗
				toParent:false,//发布到家长端 - 默认不选中
				toCard:true,//发布到班牌 - 默认选中
				uploadForm:{
					label_id:'',//资源库名称
					is_share:false,//资源库是否共享
				},//上传资源库弹窗form
				uploadParams:{
                    token:''
                },//上传参数
                fileList:[],//上传的文件列表
                resourceList:[],//上传成功的文件列表
                filesLimit:5,//上传文件限制数量
                chooseType:0,//点击新增还是修改 0新增 1修改
                userLabels:[],//本人创建的资源标签列表
                uploadSuccessData:[],//上传成功的返回数组
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
					let ttH = $('.resource-video > .resource-top').height();
					let tblH = icH - stH - ttH ;
					console.log(66, icH, stH, ttH)
					$('.resource-video .label-list').height(tblH)
				}, 50)
			},
			/**
			 *  @function: 上方搜索
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			navClick(item){
				if(item.value == 0){
					this.$router.push('/ResourcePic')
				}else if(item.value == 1){
					return
				}else if(item.value == 2){
					this.$router.push('/ResourceWord')
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
			uploadClick(){
				console.log('上传按钮点击:',this.uploadForm);
                this.uploadDialog = true;
                this.resourceList = [];
                this.uploadSuccessData = [];
				this.uploadForm = {
                    label_id:'',//资源库名称
					is_share:true,//资源库是否共享
                };
                setTimeout(() => {
                    this.$refs.uploadForm.resetFields();
                }, 20);
                this.getUserLabels();//获取本人创建的资源标签列表
                this.$api.Common.getQiniuUploadToken({
                    isOverride:1,
                    expireSeconds:3600
                }).then( res =>{
                    console.log('获取token:', res.data.data)
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.uploadParams.token = res.data.data;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
			},
			/**
			 *  @function: 新建、编辑保存资源库
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			saveLabels(){
				console.log('新建保存资源库',this.labelForm)
				this.$refs['labelForm'].validate((valid) => {
					if (valid) {
                        console.log('新增修改资源标签',this.labelForm)
                        let params = {
                            label_name:this.labelForm.label_name,  //标签名称
                            is_share:this.labelForm.is_share?1:0,    //是否共享(默认不共享)（0不共享，1共享）
                            resource_type:2,    //资源类型（1:图片；2:视频；3:文档）
                            school_id:localStorage.getItem('schoolId'),//学校id
                        };
                        let type = '';
                        if(this.chooseType == 0){
                            type = 'post';
                            params.user_id = localStorage.getItem('userId');//登陆者id
                        }else if(this.chooseType == 1){
                            type = 'put';
                            params.id = this.labelForm.id;
                            params.user_id = localStorage.getItem('userId');//登陆者id
                        }
                        this.$api.Rules.modifyLabel(type,params).then( res => {
                            console.log('新增修改资源标签', res.data);
                            if (res.data.code == 600 ||　res.data.code == 0) {
                                this.labelDialog = false;
                                if(this.chooseType == 0){
                                    this.uploadForm.label_id = res.data.data.id;//此处赋资源库id值
                                    this.uploadForm.is_share = res.data.data.is_share == 1;//是否共享
                                }
                                this.getUserLabels();//获取本人创建的资源标签列表
                                this.getResourcesLabels();
                                
                            } else {
                                this.isToast = true;
                                this.toast = res.data.msg;
                            }
                        })
					} else {
						this.$message({
							message: '请输入内容（*为必填项）',
							type: 'error', duration: this.msgDuration
						})
						return false;
					}
				});
			},
			/**
			 *  @function: 上传之前验证
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			beforeUpload(file){
				console.log('上传之前验证:',file.type);
				if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb','video/mpeg'].indexOf(file.type) == -1) {
					this.$message({
						showClose: true,
						type: 'warning',
						message: '请上传正确的视频格式!',
						duration: this.msgDuration
					})
					return false;
				}
				const isLt100M = file.size / 1024 / 1024 < 100;
				if (!isLt100M) {
					this.$message({
						showClose: true,
						type: 'warning',
						message: '上传视频大小不能超过 100MB!',
						duration: this.msgDuration
					})
					return false;
				}
				
			},
			/**
			 *  @function: 添加文件、上传成功和上传失败
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			changeUpload(file, fileList){
				console.log('文件状态改变时', file, fileList);
				console.log(fileList,'FkOK078k_tk3CF_6EB7QbNsj4wAH');
			},
			/**
			 *  @function: 上传成功
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			uploadSuccess(response, file, fileList){
                console.log('上传成功',response, file, fileList);
                this.resourceList = fileList;
			},
			/**
			 *  @function: 上传失败
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			uploadError(err, file, fileList){
				console.log('上传失败',err, file, fileList);
			},
			/**
			 *  @function: 移除文件
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			handleRemove( file, fileList){
                console.log('移除文件', file, fileList);
                this.resourceList = fileList;
			},
			/**
			 *  @function: 上传文件超出限制
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			handleExceed( file, fileList){
                console.log('上传文件超出限制', file, fileList);
                this.$message({
                    showClose: true,
                    type: 'warning',
                    message: `上传文件不能超过${filesLimit}个！`,
                    duration: this.msgDuration
                })
			},
			/**
			 *  @function: 上传资源-选择是否共享
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			changeShare(val){
				console.log('上传资源-选择是否共享',val)
				setTimeout(() => {
					this.$refs["uploadForm"].clearValidate(['label_id']);
				});
			},
			/**
			 *  @function: 保存上传资源
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			saveUpload(){
				console.log('保存上传资源',this.uploadForm)
                if(this.resourceList.length == 0){
                    this.$message({
                        showClose: true,
                        type: 'warning',
                        message: '请选择要上传的资源！',
                        duration: this.msgDuration
                    });
                    return
                }
				this.$refs['uploadForm'].validate((valid) => {
					if (valid) {
                        let resources = this.resourceList.map((item)=>{
                            return {
                                resource_name:item.name,
                                cdn_name:item.response.key
                            }
                        })
                        let params = {
                            resource_type:2,//标签类型 1图片 2视频 3文档
                            "from": "web",
                            "label_id": this.uploadForm.label_id,//标签id
                            "is_share": this.uploadForm.is_share?1:0,//是否共享
                            "resources": resources,//上传七牛key和name
                            "school_id":localStorage.getItem('schoolId'),//学校id
                        };
                        console.log(params);
                        this.$api.Rules.addResource('post',params).then( res => {
                            console.log('保存上传资源', res.data);
                            this.$loading().close();
                            if (res.data.code == 600 ||　res.data.code == 0) {
                                //默认发送班牌 选填家长端
                                this.toParent = false;
                                this.toCard = true;
                                this.uploadSuccessData = res.data.data;
                                this.getResourcesLabels();//获取资源标签列表
                                console.log("uploadForm:",this.uploadForm);
                                // this.$refs.upload.submit();
                                this.$refs.upload.clearFiles();
                                this.uploadDialog = false;
                                this.uploadSuccessDialog = true;
                            } else {
                                this.isToast = true;
                                this.toast = res.data.msg;
                            }
                        }).catch(err =>{
                            this.$loading().close();
                        })
					} else {
						this.$message({
							message: '请输入内容（*为必填项）',
							type: 'error', duration: this.msgDuration
						})
						return false;
					}
				});
			},
			/**
			 *  @function: 应用模板按钮点击
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			showTemplateDetail(item) {
				console.log('应用模板按钮点击:',item);
				this.templateDetailDialog = true;
				let vThis = this;
				let mySwiper = null;
				setTimeout(() => {
					let galleryThumbs = new Swiper('.template-dialog .gallery-thumbs', {
						spaceBetween: 10,
						slidesPerView: 6,
						freeMode: true,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
					});
					let galleryTop = new Swiper('.template-dialog .gallery-top', {
						spaceBetween: 10,
						navigation: {
							nextEl: '.swiper-button-next',
							prevEl: '.swiper-button-prev',
						},
						thumbs: {
							swiper: galleryThumbs
						}
					});
				}, 0);
				
			},
			/**
			 *  @function: 应用模板
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			useTemplate() {
				console.log('应用模板:');
				this.choosePlaceDialog = true;
			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: cs
			 *  @date 2018-12-07
			 */
			getSelected(data) {
				console.log('888999666',data,this.listClassroom.length)
				for(let i = 0;i<data.length;i++){
					this.listClassroom.push(
						{
							'classId': data[i].pid,
							'placeName': data[i].pname,
							'studentId': data[i].id,
							'id': data[i].id,
							'buildingName': data[i].label
						}
					)
				}
				let length = this.listClassroom.length;
				if(length == 1) return
				// console.log(444,length)
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.listClassroom[k].id == this.listClassroom[i].id){
							// console.log(11111111111111)
							this.listClassroom.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data.length, this.listClassroom.length)
			},
			/**
			 *  @function: table 列表搜索筛选
			 *  @author: cs
			 *  @date 2018-12-07
			 */
			checkedClick(data){
				console.log('data111',data,this.listClassroom)
				this.listClassroom.push(
					{
						'classId': data.pid,
						'placeName': data.pname,
						'studentId': data.id,
						'id': data.id,
						'buildingName': data.value,
					}
				)
				let length = this.listClassroom.length;
				if(length == 1) return
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.listClassroom[k].id == this.listClassroom[i].id){
							this.listClassroom.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data, this.listClassroom)

			},
			/**
			 *  @function: 查看资源详情
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			ViewDetail(item){
				console.log('查看资源详情',item)
				this.checkedResource = item;
                let params = {
					label_id:item.id,//资源标签id
					is_share:item.is_share,//是否共享
					other_share:item.other_share,//是否共享
					label_name:item.label_name,//资源标签名称
					creatName:item.user_id//创建人
                }
                this.$router.push({path: '/VideoListDetail', query: params})
			},
			/**
			 *  @function: 编辑资源库按钮点击
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			changeLabels(item){
				console.log('编辑资源库按钮点击',item)
                this.labelDialog = true;
                setTimeout(() => {
                   	this.$refs.labelForm.resetFields();
                    if(item){
                        this.chooseType = 1;
                        this.checkedResource = item;
                        this.labelForm = JSON.parse(JSON.stringify(item));
                        this.labelForm.is_share = item.is_share == 1;
                    }else{
                        this.chooseType = 0;
                        this.labelForm = {
                            label_name:'',//资源库名称
                            is_share:false,//资源库是否共享
                        };
                    }
                }, 20);
			},
			/**
			 *  @function: 删除资源库
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			delResource(){
				console.log('删除资源库',this.checkedResource)
				this.$confirm('这个资源库内所有视频都将被删除！同时删除班牌正在使用的资源！确定删除吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
                    let params = {
                        id:this.labelForm.id,  //标签id
                        user_id:localStorage.getItem('userId'),//登陆者id
                        school_id:localStorage.getItem('schoolId'),//学校id
                    };
                    this.$api.Rules.delLabel(params).then( res => {
                        console.log('删除资源标签', res.data);
                        if (res.data.code == 600 ||　res.data.code == 0) {
                            this.labelDialog = false;//关闭弹窗
                            this.checkedResource = {};//选中的资源库清空
                            this.$message({
                                showClose: true,
                                type: 'success',
                                message: '删除成功!',
                                duration: this.msgDuration
                            });//请求删除成功之后提示
                            this.getResourcesLabels();
                        } else {
                            this.isToast = true;
                            this.toast = res.data.msg;
                        }
                    })
				}).catch(() => {});
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
                    resource_type:2,//标签类型 1图片 2视频 3文档
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
             /**
			 *  @function: 获取本人创建的资源标签列表
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			getUserLabels(){
				console.log('获取本人创建的资源标签列表')
                let params = {
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    user_id:localStorage.getItem('userId'),//登陆者id
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.Rules.getUserLabels('get',params).then( res => {
                    console.log('获取本人创建的资源标签列表', res.data.data);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.userLabels = res.data.data.rows;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
            /**
			 *  @function: 资源发布
			 *  @author: cs
			 *  @date 2019-01-20
			 */
			publishResource(){
                let sosurceId = this.uploadSuccessData.map(item=>{
                    return item.id
                })
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_id:sosurceId.join(','),//资源ID，多个ID使用逗号分隔
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    class_id:'100483',//班级ID，多个ID使用逗号分隔（见文档）
                    is_show_parent:this.toParent?1:0,//发布给家长（0:否；1:是）
                    is_show_device:this.toCard?1:0,//发布到班牌（0:否；1:是）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
                this.$loading();
                this.$api.Rules.publishResource('post',params).then( res => {
                    console.log('资源发布', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.uploadSuccessDialog = false;
                        this.choosePlaceDialog = false;
                        this.$message({
                                showClose: true,
                                type: 'success',
                                message: '发布成功!',
                                duration: this.msgDuration
                            });//请求删除成功之后提示
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
            },
		},
		mounted() {
            //权限id数组
			this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
			let vThis = this;
			let mySwiper = new Swiper('.template-top .swiper-container', {
				autoplay: {
					delay: vThis.swiperSpeed,
					disableOnInteraction: false,
				},
				slidesPerView: vThis.useTemplateData.length<3?vThis.useTemplateData.length:3,
			})
         },
         created(){
             this.getResourcesLabels();//获取资源标签列表
             this.getLabelCount();//获取各种资源总数
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
   .resource-video{
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
					.top{
						position: relative;
                        padding-top: 75%;
						img{
							position: absolute;
                            top: 0;
                            left: 0;
                            width: 100%;
                            height: 100%;
						}
						span{
							position: absolute;
							left: 10px;
							bottom: 10px;
							background-color: rgba(0,0,0,0.5);
							font-size: 12px;
							color: #fff;
							padding: 3px 8px;
						}
					}
					.mid{
						margin-top: 5px;
						width: 100%;
						display: flex;
						overflow: hidden;
						li{
							flex: 1;
							overflow: hidden;
							text-align: center;
							&:nth-of-type(2){
								margin: 0 4px;
							}
							img{
								width:100%;
							}
						}
					}
					h5{
						font-size: 14px;
						line-height: 35px;
						i{
							float: right;
							color: #A0A0A0;
							font-size: 25px;
						}
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
                    /deep/ .el-checkbox{
							height: 30px;
							line-height: 30px;
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
		.edit-dialog{
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
				
				.el-dialog__footer {
					.dialog-footer {
						margin: 0 auto;
						display: block;
						padding-right: 10px;
						text-align: right;
						overflow: hidden;
						.del-resource{
							display: inline-block;
							cursor: pointer;
							line-height:40px;
                            float: left;
							i{
								color: #B6B6B6;
								font-size: 20px;
								margin-left: 10px;
							}
							span{
								font-size: 16px;
							}
						}
						.button-div {
							width: 100px;
							margin-left: 20px;
							margin-right: 0 !important;
						}
					}
                    .add-foot{
                        text-align: center;
                        .button-div {
							float: none;
							width: 100px;
							margin-left: 20px;
							margin-right: 0 !important;
						}
                    }
				}
			}
		}
		.template-dialog{
			/deep/ .el-dialog{
				.el-dialog__body{
					text-align: center;
					border: 0 !important;
					.swiper-container{
						width: 100%;
						height: 370px;
						.swiper-wrapper{
							.swiper-slide{
								width: 80%;
								overflow: hidden;
								text-align: center;
							}
						}
						.swiper-button-next{
							width: 40px;
							height: 60px;
							top: 35%;
							background: url('../../../../assets/images/next.png') no-repeat center;
							background-size: 100% ;
						}
						.swiper-button-prev{
							width: 40px;
							height: 60px;
							top: 35%;
							background: url('../../../../assets/images/next.png') no-repeat center;
							background-size: 100% ;
							-webkit-transform: rotate(-180deg);
							-moz-transform: rotate(-180deg);
							-ms-transform: rotate(-180deg);
							-o-transform: rotate(-180deg);
							transform: rotate(-180deg);
						}
						.swiper-button-disabled{
							background: url('../../../../assets/images/next_normal.png') no-repeat center;
							background-size: 100% ;
							opacity: 1;
						}
							&.gallery-top {
							height: 80%;
							.swiper-slide {
								img{
									width: 100%;
									height: 550px;
								}
							}
						}
						&.gallery-thumbs {
							height: 20%;
							box-sizing: border-box;
							padding: 10px 0;
							
						}
						&.gallery-thumbs {
							.swiper-slide {
								width: 20%;
								opacity: 0.4;
								img{
									height: 90px;
								}
							}
						}
						&.gallery-thumbs .swiper-slide-thumb-active {
							opacity: 1;
						}
					}
					
					h5{
						font-size: 16px;
						line-height: 30px;
						color: #000;
					}
					p{
						font-size: 12px;
						line-height: 16px;
						margin-bottom: 20px;
					}
				}
			}
		}
		.sch-system-dialog {
			/deep/ .el-dialog {
				/*margin-top: 8vh!important;*/
				.el-dialog__body {
					padding: 15px 25px 10px !important;
				}
                .checked-box{
                    .el-checkbox{
                        margin-left: 100px;
                        margin-top: 10px;
                        .el-checkbox__inner{
                            border-radius: 50% !important;
                        }
                        .el-checkbox__label{
                            color: #333 !important;
                        }
                        &:nth-of-type(1){
                            margin-left: 378px;
                        }
                    }
                }
			}
			/deep/ .el-form-item {
				width: 100%;
				text-align: left;
				position: relative;
				padding-left: 2%;
				padding-right: 3%;
				margin-bottom: 0 !important;
				padding-bottom: 20px !important;
				/deep/ .el-radio-group {
					.el-radio {
						display: inline-block;
					}
				}
				.search-box {
					width: 240px;
					height: 36px;
					float: right;
					margin: 0px 0px 6px 20px;
					position: relative;
					.el-input {
						
						i {
							cursor: pointer;
						}
					}
				}
				dd {
					position: absolute;
					left: 0;
					bottom: -30px;
					color: red;
					font-size: 12px;
				}
				.el-table {
					width: 800px;
				}
				&:nth-of-type(2), &:nth-of-type(3) {
					> label {
						text-align: right;
						line-height: 40px;
						float: left;
						&:before {
							content: '*';
							color: #f56c6c;
							margin-right: 4px;
							display: inline-block;
						}
					}
				}
			}
			/deep/ .el-radio-group {
				line-height: 40px;
				position: relative;
				.el-radio {
					display: inline-block;
				}
			}
			/deep/ .el-dialog__footer {
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
		.upload-dialog{
            /deep/ .el-dialog{
                margin-top: 15vh !important;
                .el-dialog__body{
                    padding-bottom: 0 ;
					.el-form{
						text-align: left;
						.el-form-item{
							padding-bottom: 0!important;
						}
						.el-form-item__error{
							padding-top: 0;
						}
						.el-checkbox{
							height: 30px;
							line-height: 30px;
							.el-checkbox__inner{
								border-radius: 50% !important;
							}
							.el-checkbox__label{
								color: #333 !important;
							}
						}
						
						.button-div {
							width: 100px;
							margin-left: 10px;
							margin-right: 0 !important;
						}
					}
					.upload-box{
						margin: 0 auto;
						width: 470px;
						margin-top: 2px;
						margin-bottom: 20px;
						.el-upload{
							width: 100%;
							.el-upload-dragger{
								width: 100%;
								height: 180px;
								&:hover{
									border-color: #1cab7d;
								}
								&:focus{
									outline: none;
								}
								.button-div{
									margin-top: 45px;
									margin-bottom: 20px;
								}
							}
						}
						.el-upload-list{
							text-align: left;
							max-height: 160px;
    						overflow: auto;
							li{
								height: auto;
								outline: none;
								border-color: #e1e1e1;
								img{
									width: 20px;
									height: 20px;
								}
								a{
									margin-top: 0;
									line-height: 20px;
									&:hover{
										color: #1cab7d;
									}
									i{
										display: none;
									}
								}
							}
						}
					}
                }
				/deep/ .el-dialog__footer {
					.dialog-footer {
						margin: 0 auto;
						display: block;
						padding-right: 10px;
						text-align: left;
						overflow: hidden;
						text-align: center;
						.button-div {
							width: 100px;
							margin-left: 20px;
							margin-right: 0 !important;
						}
					}
				}
            }
        }
		.upload-success {
			/deep/ .el-dialog {
				.el-dialog__header{
					padding: 30px 20px 20px;
					.el-dialog__title{
						font-size: 30px;
						font-weight: normal;
					}
				}
				margin-top: 35vh!important;
				.el-dialog__body {
					padding: 15px 25px 10px !important;
					border: 0;
					text-align: center;
					.button-div {
						clear: both;
						float: none;
						margin-left: 20px;
                        &:nth-of-type(1){
                            margin-left: 0;
                        }
					}
                    .el-checkbox{
                        margin-top: 20px;
                        &:nth-of-type(1){
                            margin-right: 40px;
                        }
                        .el-checkbox__inner{
                            border-radius: 50% !important;
                        }
                        .el-checkbox__label{
                            color: #333 !important;
                        }
                    }
				}
			}
		}
   }
</style>
