<template>
    <div class="video-list-detail">
        <!-- <a href="http://www.w3school.com.cn/i/movie.ogg" download="test.mp4">54646</a> -->
		<div class="detail-top">
			<div class="left">
                <el-input v-model="inputVal" clearable ref="labelName" maxlength="20" size="small" placeholder="请输入资源库名称" style="width:150px;" v-show="isInput"></el-input>
                <h4 v-show="!isInput">
                    {{resourceObj.label_name}}
                    <span class="count">{{resourceObj.count}}</span>
                    <span>{{resourceObj.creatName}}创建人{{isUse}}</span>
                </h4>
                <Button v-show="isInput" title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveEditLabel"></Button>
                <Button v-show="isInput" title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="cancelEditLabel"></Button>
                <!-- <Button title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveClick(addBuildModel,'checkInputChars')"></Button>
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="cancel"></Button> -->
			</div>
			<div class="right">	
				<Button btnClass="custom8" :iconLeft="true" v-show="!modalShow && resourceObj.other_share == 0" :data="btn1Data" btnFontSize="12px" title="上传视频" @click="uploadClick"></Button>
				<Button btnClass="custom6" btnFontSize="12px" v-show="!modalShow" title="批量管理" @click="batchManage"></Button>
				<Button btnClass="custom6" btnFontSize="12px" v-show="!modalShow && !isInput && resourceObj.other_share == 0" title="编辑" @click="editLabel"></Button>
				<Button btnClass="custom6" :iconLeft="true" v-show="!modalShow" :data="btn2Data" btnFontSize="12px" title="返回上一页" @click="back"></Button>
				
				<Button btnClass="custom6"  v-show="modalShow"  btnFontSize="12px" title="完成" @click="closeModal"></Button>
				<Button btnClass="custom6"  v-show="modalShow"  btnFontSize="12px" title="下载" @click="modalShow = false"></Button>
				<Button btnClass="custom12"  v-show="modalShow && resourceObj.other_share == 0"  btnFontSize="12px" title="删除" @click="delResouce({})"></Button>
				<Button btnClass="custom8"  v-show="modalShow && isUse == 0"  btnFontSize="12px" title="发布视频" @click="publishClick"></Button>
				<Button btnClass="custom6"  v-show="modalShow && isUse == 1"  btnFontSize="12px" title="取消使用" @click="cancelUse"></Button>
			
			</div>
		</div>
		<div class="detail-mid">
			<ul v-if="roleNos.length == 1 && roleNos[0] == 'SYS002'">
				<li v-for="(item, index) in tabData" :key="index" @click="tabClick(item)" :class="{active:item.value == isUse}">
					{{item.title}}
					<span>({{ item.count }})</span>
					<img :src="defArrow">
				</li>
			</ul>
			<dd v-else>使用教室数量：20</dd>
			<div class="search-box">
				<el-input v-model="searchVal" size="small" placeholder="请输入资源名称" @change="search">
					<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
				</el-input>
			</div>
		</div>
		<el-main class="label-list">
			<el-row :gutter="20" v-show="isUse == 0">
				<el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" v-for="(item, index) in labelData" :key="index"  >
					<div class="inner">
						<div @click="ViewDetail(item,index)">
							<div class="top">
								<i class="iconfont icon-shipin1"></i>
                                <img :src="uploadPicUrl+item.cdn_name+'?vframe/jpg/offset/0/w/250'" :onerror="defaultErrImg">
							</div>
							<p>{{item.resource_name}}</p>
						</div>
						<div class="button-box" v-show="!modalShow">
                            <Button btnClass="custom6"  btnHeight="30px" btnFontSize="12px" title="取消发布" v-if="item.is_published != 0 && roleNos.indexOf('S01') > -1" @click="manageCancelUse(item)"></Button>
							
                            <!-- <Button btnClass="custom6"  btnHeight="30px" btnFontSize="12px" title="取消发布" v-if="item.is_published == 1 && roleNos.length == 1 && roleNos[0] == 'SYS002'" @click="manageCancelUse(item)"></Button>
							<Button btnClass="custom6"  btnHeight="30px" btnFontSize="12px" title="取消发布" v-if="item.is_published == 1 || (roleNos.length != 1 && roleNos[0] != 'SYS002')" @click="manageCancelUse(item)"></Button> -->
							<Button btnClass="custom8"  btnHeight="30px" btnFontSize="12px" title="发布视频" @click="publishClick(item)"></Button>
						</div>
						<div class="hover-box">
							<button class="btn" v-if="resourceObj.other_share == 0" @click="editClick(item,index)"><i class="iconfont icon-xiugai"></i>修改</button>
							<button class="btn" v-if="resourceObj.other_share == 0" @click="delResouce(item,index)"><i class="iconfont icon-chuyidong"></i>删除</button>
							<button class="btn" @click="downloadClick(item,index)"><i class="iconfont icon-xiazai"></i>下载</button>
						</div>
					</div>
					<div class="modal" v-show="modalShow" @click.stop="checkResource(item)">
						<div class="check-box">
							<i class="iconfont icon-duihao1" v-show="item.checked"></i>
						</div>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20" v-show="isUse == 1">
				<el-col :xs="12" :sm="8" :md="6" :lg="4" :xl="4" v-for="(item, index) in labelData" :key="index"  >
					<div class="inner">
						<div @click="ViewDetail(item,index)">
							<div class="top">
                                <img :src="uploadPicUrl+item.cdn_name+'?vframe/jpg/offset/0/w/250'" :onerror="defaultErrImg">
								<!-- <video src="http://10.1.0.31/mov.mp4" :ref="'video'+index" @click="videoClick(index)">
								您的浏览器不支持 video 标签。
								</video> -->
							</div>
							<p>{{item.resource_name}}</p>
						</div>
						<!-- <Button btnClass="custom6"  btnHeight="30px" btnFontSize="12px" title="发布视频" @click="publishClick(item)"></Button> -->
						<div class="button-box" v-show="!modalShow">
							<Button btnClass="custom6"  btnHeight="30px" 
							btnFontSize="12px" title="取消发布" @click="manageCancelUse(item)"></Button>
						</div>
						<div class="hover-box">
							<button class="btn" v-if="resourceObj.other_share == 0" @click="editClick(item,index)"><i class="iconfont icon-xiugai"></i>修改</button>
							<button class="btn" v-if="resourceObj.other_share == 0" @click="delResouce(item,index)"><i class="iconfont icon-chuyidong"></i>删除</button>
							<button class="btn" @click="downloadClick(item,index)"><i class="iconfont icon-xiazai"></i>下载</button>
						</div>
					</div>
					<div class="modal" v-show="modalShow" @click.stop="checkResource(item)">
						<div class="check-box">
							<i class="iconfont icon-duihao1" v-show="item.checked"></i>
						</div>
					</div>
				</el-col>
			</el-row>
			<div class="modal-bot" v-show="modalShow">
				<div class="left">
					<Button btnClass="custom8" btnFontSize="12px" :title="isCheckAll?'取消全选':'全选'" @click="checkAll"></Button>
				</div>
				<div class="right">
					<Button btnClass="custom8"  v-show="isUse == 0"  btnFontSize="12px" title="发布视频" @click="publishClick"></Button>
					<Button btnClass="custom6"  v-show="isUse == 1"  btnFontSize="12px" title="取消使用" @click="cancelUse"></Button>
					<Button btnClass="custom12" v-show="resourceObj.other_share == 0" btnFontSize="12px" title="删除" @click="delResouce({})"></Button>
					<!-- <Button btnClass="custom12" v-show="resourceObj.other_share == 0" btnFontSize="12px" title="删除" @click="delResouce(labelData[currentNum-1],currentNum-1)"></Button> -->
					<Button btnClass="custom6" btnFontSize="12px" title="完成" @click="closeModal"></Button>
				</div>
			</div>
		</el-main>

		<!-- 编辑资源 -->
		<el-dialog title="编辑资源" :visible.sync="editDialog" width="500px" center class="edit-dialog">
            <div class="content">
                <el-form ref="editForm" label-width="100px" :rules="rules" :model="editForm">
					<el-form-item label="资源名称：" prop="resource_name" >
						<el-input v-model="editForm.resource_name" placeholder="请输入资源名称" 
						clearable style="width: 230px;" ></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
                        @click="editDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
                        @click="saveEditResource"></Button>
            </span>
        </el-dialog>

		<!-- 预览视频 -->
		<el-dialog  :visible.sync="viewDetailDialog" width="900px" v-if="viewDetailDialog" center class="video-play">
			<div class="video">
				<video src="http://10.1.0.31/mov.mp4" ref="video" controls>
					您的浏览器不支持 video 标签。
				</video>
			</div>
        </el-dialog>
 
		<!-- 取消发布 -->
		<el-dialog title="取消发布" :visible.sync="cancelDialog" width="950px" center class="cancel-dialog">
			<div class="top" v-if="checkedArr.length>0">
                <img :src="uploadPicUrl+checkedArr[0].cdn_name+'?vframe/jpg/offset/0/w/250'" :onerror="defaultErrImg">
				<dd>{{checkedArr[0].resource_name}}</dd>
				<h4>发布教室：16</h4>
			</div>
			<div class="bot">
				<Button btnClass="custom6" btnFontSize="12px" btnHeight="38px" :title="checkAllClass?'全部取消':'全部选中'" @click="handleCheckAllChange"></Button>
				<ul class="clearfix">
					<li v-for="(item,index) in usedClassData" :key="index" :class="{ac:item.checked}" @click="handleCheckedCitiesChange(item)">
						{{item.className}}
					</li>
				</ul>
			</div>
			<span slot="footer" class="dialog-footer">
				<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
						@click="cancelDialog = false"></Button>
				<Button title="确定" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
						@click="cancelUse"></Button>
			</span>
		</el-dialog>

		<!-- 发布视频 -->
		<el-dialog title="发布视频" :visible.sync="publishDialog" width="900px" center class="publish-dialog">
			<!-- <div class="content"> -->
				<el-row :gutter="10">
					<el-col :span="4" v-for="(item, index) in checkedArr" :key="index">
						<div class="inner">
							<i class="iconfont icon-shanchu1" @click="reduceResource(index)"></i>
							<i class="iconfont icon-shipin1"></i>
                            <img :src="uploadPicUrl+item.cdn_name+'?vframe/jpg/offset/0/w/250'" :onerror="defaultErrImg">
						</div>
					</el-col>
				</el-row>
			<!-- </div> -->
			<span slot="footer" class="dialog-footer">
                <div class="checked-box" v-if="roleNos.indexOf('S01') == -1">
					<el-checkbox v-model="toCard">发布到班牌</el-checkbox>
					<el-checkbox v-model="toParent">发布家长端</el-checkbox>
				</div>
				<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
						@click="publishDialog = false"></Button>
				<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="40px" v-if="roleNos.indexOf('S01') > -1"
						@click="choosePlaceDialog = true"></Button>
				<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="40px" v-else
						@click="publishResource"></Button>
			</span>
		</el-dialog>

		<!-- 发布到班牌 -->
		<el-dialog title="发布到班牌" :visible.sync="choosePlaceDialog" width="900px" center class="sch-system-dialog">
			<div class="content">
				<div class="transfer-div">
					<tree-transfer :from_data="fromData" leftTitle='选择场所/教室' leftplaceholder='请输入场所/教室名称' sourceDiffer="2" 
					:user_data="listClassroom" @showSelected="getSelected" @checkedClick="checkedClick"></tree-transfer>
					<div class="checked-box">
						<el-checkbox v-model="toCard">发布到班牌</el-checkbox>
					    <el-checkbox v-model="toParent">发布家长端</el-checkbox>
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

		<!-- 上传完成 -->
		<el-dialog title="上传完成" :visible.sync="uploadSuccessDialog" width="400px" center class="upload-success">
				<Button title="暂不发布" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
						@click="uploadSuccessDialog = false"></Button>
				<Button title="发布到班牌" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
						@click="choosePlaceDialog = true"></Button>
		</el-dialog>

		<!-- 发布完成 -->
		<el-dialog title="发布完成" :visible.sync="publishSuccessDialog" width="400px" center class="upload-success">
				<Button title="暂不发布" btnClass="custom7" btnFontSize="12px" btnHeight="40px"
						@click="publishSuccessDialog = false"></Button>
				<Button title="发布到家长端" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
						@click="publishSuccessDialog = false"></Button>
		</el-dialog>

		<!-- 上传视频 -->
		<el-dialog title="上传视频" :visible.sync="uploadDialog" width="650px" center class="upload-dialog">
            <div class="content">
                <el-form ref="uploadForm" label-width="100px" :rules="rules" :model="uploadForm">
					<el-form-item label="资源库：" prop="label_id">
                        <el-select v-model="uploadForm.label_id" placeholder="请选择资源库">
                            <el-option v-for="item in userLabels"  :key="item.id" :label="item.label_name" :value="item.id"> </el-option>
                        </el-select>
						<br>
						<el-checkbox v-model="uploadForm.checked" @change = "changeShare">共享资源库</el-checkbox>
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
					<div class="el-upload__text">点击/拖拽一个或多个文件到这里上传<br>支持rar、jpg、png、静态gif</div>
				</el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="uploadDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveUpload"></Button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import treeTransfer from '@/components/Transfer/transfer-extend'
	import Toast from '@/components/Toast/Toast'
	import Swiper from 'swiper';
	export default {
		name: 'VideoListDetail',
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
				usedClassData:[
					{
						className:'德育模板模型1',
						classId:1,
						checked:true
					},
					{
						className:'德育模板模型2',
						classId:2,
						checked:true
					},
					{
						className:'德育模板模型3',
						classId:3,
						checked:true
					},
					{
						className:'德育模板模型4',
						classId:4,
						checked:true	
					},
					{
						className:'德育模板模型5',
						classId:5,
						checked:true
					},
					{
						className:'德育模板模型6',
						classId:6,
						checked:true	
					},
					{
						className:'德育模板模型7',
						classId:7,
						checked:true	
					},
				],//正在使用此资源的教室
				checkedClass:[],//选中的教室
				checkAllClass: true,//是否全选
				templateDetailDialog:false,//应用模板弹窗
				viewDetailDialog:false,//播放视频弹窗
				choosePlaceDialog:false,//选择教室弹窗
				publishSuccessDialog:false,//发布成功弹窗
				uploadSuccessDialog:false,//上传成功弹窗
				uploadDialog:false,//上传弹窗
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
				inputVal:'',//上方编辑文件夹名称
				isInput:false,//是否显示input
				sourceVal:'',//资源名称编辑
				isSource:false,//是否显示input-资源名称
				isCheckAll:false,//全选/取消全选
				searchVal: "",//搜索内容
				tabData:[
					{
						title:'未发布',
						count:'',
						value:0,
					},
					{
						title:'已发布',
						count:'',
						value:1,
					},
				],
				resourceObj:{},//接收传参  上部显示
				btn1Data:{
					iconL: require('../../../../assets/images/upload.png'),
					iconLAct: require('../../../../assets/images/upload.png')
				},//上传按钮
				btn2Data:{
					iconL: require('../../../../assets/images/back_no.png'),
					iconLAct: require('../../../../assets/images/back_ac.png')
				},//返回按钮
				isUse:0,//是否在使用  0 未使用  1使用
				checkedArr:[],//选中的数组
				labelData:[
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供1',
						checked:false,
						uploadDate:'2018-11-21'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供2',
						checked:false,
						uploadDate:'2018-11-22'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供3',
						checked:false,
						uploadDate:'2018-11-23'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供',
						checked:false,
						uploadDate:'2018-11-24'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供',
						checked:false,
						uploadDate:'2018-11-28'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供',
						checked:false,
						uploadDate:'2018-11-28'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供',
						checked:false,
						uploadDate:'2018-11-28'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供',
						checked:false,
						uploadDate:'2018-11-28'
					},
					{
						cdn_name:require('../../../../assets/images/moral_pic_default.jpg'),
						resource_name:'平台提供9',
						checked:false,
						uploadDate:'2018-11-29'
					},
				],//文件夹列表=
				currentNum:1,//当前第几页
				editDialog:false,//编辑资源弹窗
				publishDialog:false,//发布资源弹窗
				cancelDialog:false,//取消发布弹窗
				editForm:{
					resource_name:'',//资源库名称
					checked:false,//资源库是否共享
				},//编辑资源弹窗form
				uploadForm:{
					label_id:'',//资源库名称
					checked:false,//资源库是否共享
				},//上传资源库弹窗form
				rules:{
                    resource_name: [
                        {  required: true, message: '请输入资源名称', trigger: 'blur' }
					],
                    label_name: [
                        {  required: true, message: '请输入资源库名称', trigger: 'blur' }
					],
					label_id:[
						{required: true, message: '请选择资源库', trigger: 'change'}
					],
				},
				modalShow:false,//蒙版显示 批量操作
				toCard:true,//发布到班牌 - 默认选中
				toParent:false,//发布到家长端 - 默认不选中
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
        watch:{
            /**
			 *  @function: 加载场所树
			 *  @author: cs
			 *  @date 2019-02-23
			 **/
            choosePlaceDialog(val){
                console.log(val);
                if(val){
                    this.getPlaceTree();
                }
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
					let ttH = $('.video-list-detail > .detail-top').height();
					let dmH = $('.video-list-detail > .detail-mid').height();
					let tblH = icH - ttH - dmH;
					console.log(66, icH, ttH ,dmH, tblH)
					$('.video-list-detail .label-list').height(tblH)
				}, 200)
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
				this.uploadDialog = true;
                this.resourceList = [];
                this.uploadSuccessData = [];
				this.uploadForm = {
                    label_id:'',//资源库名称
					is_share:false,//资源库是否共享
                };
                setTimeout(() => {
                    this.$refs.uploadForm.resetFields();
                    this.uploadForm.label_id = this.resourceObj.label_id;//此处赋资源库id值
                    this.uploadForm.is_share = this.resourceObj.is_share;//此处赋资源库id值
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
			 *  @function: 查看视频
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			ViewDetail(item,index){
				console.log('查看大图',index)
				this.viewDetailDialog = true;
				this.currentNum = index+1;
				setTimeout(() => {
					// this.$refs.video.pause();
					this.$refs.video.play();
				}, 20);
			},
			/**
			 *  @function: 编辑资源
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			editClick(item,index){
                console.log('编辑资源',item)
				this.editForm.resource_name = '';
                this.editDialog = true;
                this.currentNum = index+1;
				setTimeout(() => {
                   	this.$refs.editForm.resetFields();
				    this.editForm = JSON.parse(JSON.stringify(item));
                }, 20);
			},
			/**
			 *  @function: 下载资源
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			downloadClick(item){
				console.log('下载资源',item);
			},
			/**
			 *  @function: 播放视频
			 *  @author: cs
			 *  @date 2018-12-17
			 */
			videoClick(index){
				console.log('播放视频',index);
				// this.$refs['video'+index][0].play();
				// this.$refs['video'+index][0].addEventListener('ended', function () {  
				// 	console.log(111);
				// }, false);
			},
			/**
			 *  @function: 返回上一页
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			back(){
				console.log('返回上一页')
				this.$router.push('/ResourceVideo');
			},
			/**
			 *  @function: 批量管理按钮点击
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			batchManage(){
				console.log('批量管理按钮点击')
				this.modalShow = true;
				this.isCheckAll = false;
                this.checkedArr = [];
                this.resourceList = [];
                this.uploadSuccessData = [];
				this.labelData.forEach(item=>{
					item.checked = false;
				})
			},
			/**
			 *  @function: 发布视频按钮点击
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			publishClick(item){
				console.log('发布视频按钮点击');
				if(!item){
					if(this.checkedArr.length == 0){
						this.$message({
							showClose: true,
							type: 'warning',
							message: '请选择要发布的资源！',
							duration: this.msgDuration
						});
						return
					}
				}else{
					this.checkedArr = [];
					this.checkedArr.push(item);
				}
				console.log("checkedArr:",this.checkedArr);
				this.publishDialog = true;
			},
			/**
			 *  @function: 删除不想发布的视频
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			reduceResource(index){
				console.log('删除不想发布的视频');
				this.checkedArr.splice(index,1);
				if(this.checkedArr.length == 0){
					this.publishDialog = false;//关闭弹窗
					this.modalShow = false;//关闭蒙版
				}
			},
			/**
			 *  @function: 管理者取消发布
			 *  @author: cs
			 *  @date 2018-12-19
			 */
			manageCancelUse(item){
				console.log('管理者取消发布');
				this.checkedArr = [];
				this.checkedArr.push(item);
				this.cancelDialog = true;
				this.checkedClass = this.usedClassData;
			},
			/**
			 *  @function: 取消发布
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			cancelUse(item){
				console.log('取消发布');
				if(!item){
					if(this.checkedArr.length == 0){
						this.$message({
							showClose: true,
							type: 'warning',
							message: '请选择要取消的资源！',
							duration: this.msgDuration
						});
						return
					}
				}else{
					this.checkedArr = [];
					this.checkedArr.push(item);
				}
				console.log("checkedArr:",this.checkedArr);
				this.$confirm('取消选中视频在所在教室的使用，取消后不可恢复！确定取消吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                }).then(() => {//点击确定按钮进行的操作
                    this.unPublishResource();
				}).catch(() => {});
			},
			/**
			 *  @function: 编辑资源库名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			editLabel(){
				console.log('编辑资源库名称')
				this.isInput = true;
				this.inputVal = this.resourceObj.label_name;
				setTimeout(() => {
					this.$refs.labelName.focus();
				});
			},
			/**
			 *  @function: 保存资源库名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			saveEditLabel(){
				console.log('保存资源库名称')
				this.isInput = false;
				this.resourceObj.label_name = this.inputVal;
			},
			/**
			 *  @function: 取消保存资源库名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			cancelEditLabel(){
				console.log('取消保存资源库名称')
				this.isInput = false;
			},
			/**
			 *  @function: 删除资源
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			delResouce(item,index){
                console.log('删除资源',item,index,this.checkedArr);
				this.$confirm('这个资源将被删除！同时删除班牌正在使用的资源！确定删除吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                }).then(() => {//点击确定按钮进行的操作
                    let params = {
                        // id:item.id,//	资源ID 多个传id","字符串
                        resource_type:2,//标签类型 1图片 2视频 3文档
                        school_id:localStorage.getItem('schoolId'),//学校id
                    };
                    let sosurceId = this.checkedArr.map(item=>{
                        return item.id
                    })
                    if(index){
                        params.id =  item.id;//	资源ID 
                    }else{
                        params.id =  sosurceId.join(',');//	资源ID 多个传id","字符串
                    }
                    console.log(sosurceId,params);
                    this.$api.Rules.delResource(params).then( res => {
                        console.log('删除资源', res.data);
                        if (res.data.code == 600 ||　res.data.code == 0) {
                            this.$message({
                                showClose: true,
                                type: 'success',
                                message: '删除成功!',
                                duration: this.msgDuration
                            });//请求删除成功之后提示
                            if(!index){
                                this.checkedArr = [];
                                this.modalShow = false;
                                this.isCheckAll = false;
                            }
                            this.getResources();
                        } else {
                            this.isToast = true;
                            this.toast = res.data.msg;
                        }
                    })   
				}).catch(() => {});
			},
			/**
			 *  @function: 编辑资源名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			editResouceName(){
				console.log('编辑资源名称')
				if(this.isSource) return;
				this.isSource = true;
				this.sourceVal = this.labelData[this.currentNum-1].resource_name;
				setTimeout(() => {
					this.$refs['source'+this.currentNum].focus();
				});
			},
			/**
			 *  @function: 保存资源名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			saveEditSourceName(){
				console.log('保存资源名称')
				this.isSource = false;
				this.labelData[this.currentNum-1].resource_name = this.sourceVal;
			},
			/**
			 *  @function: 取消保存资源名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			cancelEditSourceName(){
				console.log('取消保存资源名称')
				this.isSource = false;
			},
			/**
			 *  @function: 多选操作
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			checkResource(item){
				console.log('多选操作',item)
				item.checked = !item.checked;
				this.checkedArr = [];//选中的数组
				this.labelData.forEach((items,index)=>{
					if(items.checked == true){
						this.checkedArr.push(items)
					}
				})
				//全选、反选
				if(this.checkedArr.length == this.labelData.length){
					this.isCheckAll = true;
				}else{
					this.isCheckAll = false;
				}
				console.log(this.checkedArr);
			},
			/**
			 *  @function: 全选/取消全选
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			checkAll(){
				console.log('全选/取消全选')
				this.isCheckAll = !this.isCheckAll;
				if(this.isCheckAll){
					this.checkedArr = this.labelData;
					this.labelData.forEach(item=>{
						item.checked = true;
					})
				}else{
					this.checkedArr = [];
					this.labelData.forEach(item=>{
						item.checked = false;
					})
				}
			},
			/**
			 *  @function: 点击完成按钮-关闭弹出
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			closeModal(){
				console.log('点击完成按钮-关闭弹出')
				this.modalShow = false;
			},
			/**
			 *  @function: 编辑保存资源
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			saveEditResource(){
				console.log('编辑保存资源')
				this.$refs['editForm'].validate((valid) => {
					if (valid) {
                        this.editDialog = false;
                        console.log("editForm:",this.editForm);
                        this.putResource(this.editForm);
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
			 *  @function: 保存上传资源
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			saveUpload(){
                console.log('保存上传资源',this.uploadForm,this.resourceList)
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
                                this.$refs.upload.clearFiles();
                                this.uploadDialog = false;
                                this.uploadSuccessDialog = true;
                                if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){
                                    if(this.isUse == 0){
                                        this.getUnpublishedResources();//获取未发布资源列表
                                    }else{
                                        this.getPublishedResources();//获取发布资源列表
                                    }
                                }else{
                                    this.getResources();//获取资源列表
                                }
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
			 *  @function: 上传之前验证
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			beforeUpload(file){
				console.log('上传之前验证:',file.type);
				if (['video/mp4', 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb'].indexOf(file.type) == -1) {
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
			 *  @function: 使用未使用tab切换
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			tabClick(item){
				if(this.modalShow) return;//批量操作时不允许切换
                if(this.isUse == item.value) return
                console.log('tab切换');
				this.isUse = item.value;
                this.checkedArr = [];
                console.log(item);
                if(item.value == 0){
                    this.getUnpublishedResources();
                }else if(item.value == 1){
                    this.getPublishedResources();
                }
			},
			/**
			 *  @function: 全选/全不选教室
			 *  @author: cs
			 *  @date 2018-12-19
			 */
			handleCheckAllChange(){
				console.log('全选/全不选教室');
				this.checkAllClass = !this.checkAllClass;
				if(this.checkAllClass){
					this.checkedClass = this.usedClassData;
					this.usedClassData.forEach(item=>{
						item.checked = true;
					})
				}else{
					this.checkedClass = [];
					this.usedClassData.forEach(item=>{
						item.checked = false;
					})
				}
			},
			/**
			 *  @function: 多选框change教室
			 *  @author: cs
			 *  @date 2018-12-19
			 */
			handleCheckedCitiesChange(item){
				console.log('多选框change',item);
				item.checked = !item.checked;
				this.checkedClass = [];
				this.usedClassData.forEach(item=>{
					if(item.checked){
						this.checkedClass.push(item);
					}
				})
				this.checkAllClass = this.checkedClass.length === this.usedClassData.length;
				console.log("选中的教室：",this.checkedClass);
				
            },
            /**
			 *  @function: 获取资源列表
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			getResources(){
                this.$loading();
                console.log(this.resourceObj);
                
                let params = {
                    // user_id:localStorage.getItem('userId'),//	创建人
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    label_id:this.resourceObj.label_id,//资源库ID
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.Rules.getResources('get',params).then( res => {
                    console.log('获取资源列表', res.data.data.rows);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        // this.resourceObj.count = res.data.data.count;
                        this.$set(this.resourceObj,'count',res.data.data.count);
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
			 *  @function: 获取已发布资源列表
			 *  @author: cs
			 *  @date 2019-01-18
			 */
            getPublishedResources(){
                this.$loading();
                let params = {
                    user_id:localStorage.getItem('userId'),//	创建人
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    label_id:this.resourceObj.label_id,//资源库ID
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.Rules.getPublishedResources('get',params).then( res => {
                    console.log('获取已发布资源列表', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.labelData = res.data.data.rows;
                        this.tabData.forEach(item=>{
                            if(item.value == 0){
                                this.$set(item,'count',res.data.data.another_count);
                            }else if(item.value == 1){
                                this.$set(item,'count',res.data.data.count)
                            }
                        })
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
            },
            /**
			 *  @function: 获取未发布资源列表
			 *  @author: cs
			 *  @date 2019-01-18
			 */
            getUnpublishedResources(){
                this.$loading();
                let params = {
                    user_id:localStorage.getItem('userId'),//	创建人
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    label_id:this.resourceObj.label_id,//资源库ID
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.Rules.getUnpublishedResources('get',params).then( res => {
                    console.log('获取未发布资源列表', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.labelData = res.data.data.rows;
                        this.tabData.forEach(item=>{
                            if(item.value == 0){
                                this.$set(item,'count',res.data.data.count);
                            }else if(item.value == 1){
                                this.$set(item,'count',res.data.data.another_count)
                            }
                        })
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
            },
            /**
			 *  @function: 修改资源名称
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			putResource(resource){
                console.log("修改资源名称",resource,this.currentNum);
                let params = {
                    id:resource.id,//	资源ID
                    resource_name:resource.resource_name,//	资源名称
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$loading();
                this.$api.Rules.putResource('put',params).then( res => {
                    console.log('获取资源列表', res.data.data.rows);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.editDialog = false;
                        this.$set(this.labelData[this.currentNum-1],'resource_name',resource.resource_name)
                        // this.getResources();
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
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
			 *  @function: 取消资源发布
			 *  @author: cs
			 *  @date 2019-01-20
			 */
			unPublishResource(){
                let sosurceId = this.checkedArr.map(item=>{
                    return item.id
                })
                let placeidArr = this.checkedClass.map(item=>{
                    return item.classId
                })
                console.log(sosurceId,this.checkedClass,placeidArr);
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_id:sosurceId.join(','),//资源ID，多个ID使用逗号分隔
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    class_id:-1,//班级ID，多个ID使用逗号分隔（见文档）
                    place_id:placeidArr.join(','),//场所ID，多个ID使用逗号分隔（见文档）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
                this.$loading();
                this.$api.Rules.unPublishResource('post',params).then( res => {
                    console.log('取消资源发布', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
					    this.cancelDialog = false;//关闭取消发布弹窗
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '取消成功!',
                            duration: this.msgDuration
                        });//请求取消成功之后提示
                        this.getPublishedResources();
                        this.modalShow = false;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
            },
            /**
			 *  @function: 资源发布
			 *  @author: cs
			 *  @date 2019-01-20
			 */
			publishResource(){
                let sosurceId = [];
                if(this.uploadSuccessData.length > 0){
                    sosurceId = this.uploadSuccessData.map(item=>{
                        return item.id
                    })
                }else{
                    sosurceId = this.checkedArr.map(item=>{
                        return item.id
                    })
                }
                let placeidArr = this.listClassroom.map(item=>{
                    return item.id
                })
                console.log(sosurceId,this.uploadSuccessData);
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_id:sosurceId.join(','),//资源ID，多个ID使用逗号分隔
                    resource_type:2,//标签类型 1图片 2视频 3文档
                    class_id:-1,//班级ID，多个ID使用逗号分隔（见文档）
                    place_id:placeidArr.join(','),//场所ID，多个ID使用逗号分隔（见文档）
                    is_show_parent:this.toParent?1:0,//发布给家长（0:否；1:是）
                    is_show_device:this.toCard?1:0,//发布到班牌（0:否；1:是）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
                this.$loading();
                this.$api.Rules.publishResource('post',params).then( res => {
                    console.log('资源发布', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){
                            if(this.isUse == 0){
                                this.getUnpublishedResources();//获取未发布资源列表
                            }else{
                                this.getPublishedResources();//获取发布资源列表
                            }
                        }else{
                            this.getResources();//获取资源列表
                        }
                        this.choosePlaceDialog = false;
                        this.uploadSuccessDialog = false;
                        this.publishDialog = false;
                        this.modalShow = false;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.$loading().close();
                })
            },
            /**
			 *  @function: 获取场所树
			 *  @author: cs
			 *  @date 2019-01-22
			 */
			getPlaceTree(){
                let params = {
                    school_id: localStorage.getItem('schoolId'),
                }
                this.$api.Common.getPlaceTree('get',params).then(res => {
                    console.log('获取场所树', res.data.data)
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.fromData = res.data.data;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.tableLoading = false;
                })
            },
		},
		mounted() {
            //权限id数组
			this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
         },
         created(){
			console.log(this.$route.query);
            this.resourceObj = this.$route.query;
            if(JSON.stringify(this.$route.query) != '{}'){
                console.log(1);
                localStorage.setItem('routeParams',JSON.stringify(this.$route.query))
            }else{
                this.resourceObj = JSON.parse(localStorage.getItem('routeParams'));
                console.log(12,this.resourceObj);
            }
            if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){
                this.getUnpublishedResources();//获取未发布资源列表
            }else{
                this.getResources();//获取资源列表
            }
            this.$nextTick(() => {
               this.resizeLayout();//重新获取宽高
            });
         },
         destroyed(){
            localStorage.removeItem('routeParams');
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
   .video-list-detail{
		width: 100%;
		height: 100%;
	   .detail-top{
		   height: 6vh;
		   min-height: 6vh;
				line-height: 5.5vh;
		   background-color: #fff;
		   overflow: hidden;
			.left{
				float: left;
				height: 6vh;
				line-height: 6vh;
				margin-left: 25px;
				h4{
					font-size: 16px;
					font-weight: bold;
					display: inline-block;
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
			}
			.right{
				float: right;
				.button-div{
					margin-right: 10px;
				}
			}
		  
	   }
	   .detail-mid{
		   height: 5vh;
		   line-height: 5vh;
		   background-color: #fff;
		   border-top: 1px solid #e7e8eb;
		    ul{
				display: inline-block;
				min-width: 240px;
			   li{
				   float: left;
				   width: 120px;
				   text-align: center;
				   color: #6C6C6C;
				   font-size: 12px;
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
				width: 200px;
				height: 5vh;
				float: right;
				margin-right: 10px;
				position: relative;
				.el-input {
					width: 200px;
					i {
						cursor: pointer;
					}
					margin-right: 10px;
				}
			}
			dd{
				float: left;
				margin-left: 25px;
				font-size: 13px;
				color: #6c6c6c;
			}
	   }
	   .label-list{
		   width: 100%;
		   height: 100%;
		   padding: 0;
		   overflow-x: hidden;
		   .el-col{
			   margin-top: 20px;
			   position: relative;
			   	.inner{
					background-color: #fff;
					padding: 10px;
					position: relative;
					.top{
						position: relative;
						width: 100%;
						img{
							width: 100%;
						}
						i{
							font-size: 50px;
							width: 50px;
							height: 50px;
							position: absolute;
							left: 0;
							right: 0;
							bottom: 0;
							top: 0;
							margin: auto;
						}
					}
					.mid{
						margin-top: 5px;
						height: 55px;
						width: 100%;
						display: flex;
						overflow: hidden;
						li{
							flex: 1;
							height: 55px;
							overflow: hidden;
							text-align: center;
							&:nth-of-type(2){
								margin: 0 4px;
							}
							img{
								width:100%;
								height:100%;
							}
						}
					}
					p{
						font-size: 12px;
						line-height: 20px;
                        height: 20px;
						margin-bottom: 4px;
					}
					&:hover .hover-box{
						display: block;
					}
					.hover-box{
						display: none;
						width: 100%;
						height: 40px;
						overflow: hidden;
						position: absolute;
						background-color: #fff;
						border-top: 1px solid #e7e8eb;
						left: 0;
						bottom: -40px;
						z-index: 10;
						.btn{
							float: left;
							width: 33.3%;
							outline: none;
							border: none;
							background-color: transparent;
							height: 40px;
							line-height: 40px;
							font-size: 14px;
							cursor: pointer;
							color: #666;
							i{
								font-size: 20px;
								color: #bfbfbf;
							}
							&:hover{
								color: #1cab7d;
								i{
									color: #1cab7d;
								}
							}
							&:nth-of-type(2):hover{
								color: #FF4E4E;
								i{
									color: #FF4E4E;
								}
							}
						}
					}
					.button-box{
						display: flex;
						/deep/ .button-div{
							flex: 1;
							.button{
								padding: 0 10px;
							}
						}
					}
					.button-div {
						width: 100%;
						height: 20px;
						float: right;
						&:nth-of-type(1){
							margin-right: 5px;
						}
                        background: #F2F2F2;
                        > div {
                            height: 20px;
						}
					}
				}
				.modal{
					position: absolute;
					left: 0;
					top: 0;
					width: 100%;
					height: 100%;
					background-color: transparent;
					z-index: 1;
					cursor: pointer;
					.check-box{
						width: 25px;
						height: 25px;
						line-height: 25px;
						text-align: center;
						border-radius: 50%;
						margin-left: 25px;
						margin-top: 15px;
						background-color: #fff;
						i{
							color: #1cab7d;
							font-size: 20px;
						}
					}
				}
			}
		   .modal-bot{
			   position: absolute;
			   left: 0;
			   bottom: 0;
			   width: 100%;
			   height: 100px;
			   background-color: rgba(0,0,0,.5);
			   line-height: 100px;
			   z-index: 10;
			   .left{
				   float: left;
				   margin-left: 200px;
			   }
			   .right{
					float: right;
					.button-div{
						// &:nth-last-child(1){
							margin-right: 10px;
						// }
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
               
				/deep/ .el-dialog__footer {
					.dialog-footer {
						margin: 0 auto;
						display: block;
						padding-right: 10px;
						text-align: center;
						overflow: hidden;
						.del-resource{
							display: inline-block;
							cursor: pointer;
							line-height:40px;
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
				}
            }
            
        }
	   .video-play{
		   /deep/ .el-dialog{
				.el-dialog__header{
					padding: 0;
				}
				.el-dialog__body{
					text-align: center;
					border: 0 !important;
					.video{
						width: 100%;
						video{
							width:100%;
						}
					}
				}
			}
	   }
	   .publish-dialog {
			/deep/ .el-dialog {
				/*margin-top: 8vh!important;*/
				.el-dialog__body {
					padding: 15px 25px 25px !important;
					margin: 20px 40px !important;
					.el-col{
						margin-top: 10px;
						.inner{
							background-color: #fff;
							position: relative;
							i{
								position: absolute;
								right: -8px;
								top: -8px;
								color:#FF4E4E;
								font-size: 16px;
								cursor: pointer;
								display: none;
							}
							&:hover i{
								display: block;
							}
							img{
								width: 100%;
								height: 100%;
								max-height: 89px;
								display: block;
							}
						}
					}
				}
				.el-dialog__footer {
					padding-top: 0;
					.dialog-footer {
						margin: 0 auto;
						text-align: center;
						.checked-box{
							margin-bottom: 20px;
							.el-checkbox{
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
						.button-div {
							clear: both;
							float: none;
							&:nth-of-type(2){
								margin-left: 40px;
							}
						}
					}
				}
			}
		}
		.cancel-dialog {
			/deep/ .el-dialog {
				.el-dialog__body {
					padding: 30px 50px !important;
					margin: 20px 40px !important;
					.top{
						overflow: hidden;
						height: 120px;
						img{
							width: 160px;
							height: 120px;
							float: left;
							margin-right: 20px;
						}
						dd{
							font-size: 16px;
							color: #000;
							line-height: 30px;
							margin: 10px 0;
						}
						h4{
							font-size: 16px;
							font-weight: bold;
						}
					}
					.bot{
						.button-div{
							margin-top: 20px;
						}
						ul{
							width: 100%;
							max-height: 260px;
							overflow: auto;
							li{
								float: left;
								width: 141px;
								height: 38px;
								line-height: 38px;
								border-radius: 10px;
								text-align: center;
								cursor: pointer;
								border: 1px solid #e7e8eb;
								margin-right: 15px;
								margin-top: 15px;
								&:nth-child(5n){
									margin-right: 0;
								}
								&.ac{
									background-color: #1cab7d;
									color: #fff;
								}
							}

						}
					}
				}
				.el-dialog__footer {
					padding-top: 0;
					.dialog-footer {
						margin: 0 auto;
						text-align: center;
						.button-div {
							clear: both;
							float: none;
							&:nth-of-type(1){
								margin-right: 40px;
							}
						}
					}
				}
			}
		}
	    .sch-system-dialog {
			/deep/ .el-dialog {
				/*margin-top: 8vh!important;*/
				.el-dialog__body {
					padding: 15px 25px 10px !important;
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
   }
</style>
