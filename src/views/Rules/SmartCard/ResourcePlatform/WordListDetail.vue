<template>
    <div class="word-list-detail">
		<div class="detail-top">
			<div class="left">
					<el-input v-model="inputVal" maxlength="13" clearable ref="labelName" size="small" placeholder="请输入资源库名称" style="width:150px;" v-show="isInput"></el-input>
					<h4 v-show="!isInput">
						{{resourceObj.label_name}}
						<span class="count">{{resourceObj.count}}</span>
						<span>{{resourceObj.creatName}}</span>
					</h4>
					<Button v-show="isInput" title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveEditLabel"></Button>
                    <Button v-show="isInput" title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="cancelEditLabel"></Button>
			</div>
			<div class="right">	
				<Button btnClass="custom8" :iconLeft="true" v-show="!modalShow && resourceObj.other_share == 0" :data="btn1Data" btnFontSize="12px"  btnHeight="38px" title="上传文档" @click="uploadClick"></Button>
				<Button btnClass="custom6" btnFontSize="12px" btnHeight="38px" v-show="!modalShow" title="批量管理" @click="batchManage"></Button>
				<Button btnClass="custom6" btnFontSize="12px" btnHeight="38px" v-show="!modalShow && !isInput && resourceObj.other_share == 0" title="编辑" @click="editLabel"></Button>
				<Button btnClass="custom6" :iconLeft="true" v-show="!modalShow" :data="btn2Data" btnFontSize="12px" btnHeight="38px" title="返回上一页" @click="back"></Button>
				
				<Button btnClass="custom6"  v-show="modalShow"  btnFontSize="12px" btnHeight="38px" title="完成" @click="closeModal"></Button>
				<!-- <Button btnClass="custom6"  v-show="modalShow"  btnFontSize="12px" btnHeight="38px" title="下载" @click="modalShow = false"></Button> -->
				<Button btnClass="custom12"  v-show="modalShow && resourceObj.other_share == 0"  btnFontSize="12px" btnHeight="38px" title="删除" @click="delResouce({})"></Button>
				<Button btnClass="custom8"  v-show="modalShow && isUse == 0"  btnFontSize="12px" btnHeight="38px" title="发布文档" @click="publishClick"></Button>
				<Button btnClass="custom6"  v-show="modalShow && isUse == 1"  btnFontSize="12px" btnHeight="38px" title="取消发布" @click="cancelUse"></Button>
			
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
				<el-col :span="24" v-for="(item, index) in labelData" :key="index"  >
					<div class="inner">
						<div class="modal" v-show="modalShow" @click.stop="checkResource(item,index)">
							<!-- <div class="check-box">
								<i class="iconfont icon-duihao1" v-show="item.checked"></i>
							</div> -->
						</div>
						<div class="check-box" v-show="modalShow">
							<i class="iconfont icon-duihao1" v-show="item.checked"></i>
						</div>
						<div class="top">
							<div class="left">
                                {{item.isInput}}
								<el-input v-model="sourceVal" maxlength="20" clearable size="small" :ref="'edit'+index"
								placeholder="请输入资源名称" style="width:150px;" v-show="item.isInput"></el-input>
								<h4 @click="ViewDetail(item,index)" v-show="!item.isInput">{{item.title}}<br><span>{{item.uploadDate}}</span></h4>
								<Button v-show="item.isInput" title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveEditSourceName(item,index)"></Button>
								<Button v-show="item.isInput" title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="cancelEditSourceName(item,index)"></Button>
							</div>
							<!-- <Button btnClass="custom6"  btnHeight="38px" btnFontSize="12px" title="取消发布" @click="manageCancelUse(item)"></Button>
							<Button btnClass="custom8"  btnHeight="38px" btnFontSize="12px" title="发布文档" @click="publishClick(item)"></Button> -->
							<Button btnClass="custom6"  btnHeight="38px" btnFontSize="12px" title="取消发布" v-if="item.is_published != 0 && roleNos.indexOf('S01') > -1" @click="manageCancelUse(item)"></Button>
							<Button btnClass="custom8"  btnHeight="38px" btnFontSize="12px" title="发布文档" v-if="roleNos.indexOf('S01') > -1" @click="publishClick(item)"></Button>
							<Button title="发布文档" btnClass="custom8" btnFontSize="14px" btnHeight="38px" v-if="roleNos.length == 1 && roleNos[0] == 'SYS002'"
								@click="publishResource(item)"></Button>
							<button class="btn" @click="downloadClick(item,index)"><i class="iconfont icon-xiazai"></i>下载</button>
							<button class="btn" v-if="resourceObj.other_share == 0" @click="delResouce(item,index)"><i class="iconfont icon-chuyidong"></i>删除</button>
							<button class="btn" v-if="!item.isInput && resourceObj.other_share == 0" @click="editResouceName(item,index)"><i class="iconfont icon-xiugai"></i>修改</button>
						</div>
						<p @click="ViewDetail(item,index)">{{item.doc_content}}</p>
					</div>
				</el-col>
			</el-row>
			<el-row :gutter="20" v-show="isUse == 1">
				<el-col :span="24" v-for="(item, index) in labelData" :key="index" @click.stop="checkResource(item,index)" >
					<div class="inner">
							<div class="modal" v-show="modalShow" >
								<!-- <div class="check-box">
									<i class="iconfont icon-duihao1" v-show="item.checked"></i>
								</div> -->
							</div>
							<div class="check-box" v-show="modalShow">
								<i class="iconfont icon-duihao1" v-show="item.checked"></i>
							</div>
							<div class="top">
								<div class="left">
									<el-input v-model="sourceVal" maxlength="20" clearable size="small" :ref="'edit'+index"
									placeholder="请输入资源名称" style="width:150px;" v-show="item.isInput"></el-input>
									<h4 @click="ViewDetail(item,index)" v-show="!item.isInput">{{item.title}}<br><span>{{item.uploadDate}}</span></h4>
									<Button v-show="item.isInput" title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveEditSourceName(item,index)"></Button>
									<Button v-show="item.isInput" title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="cancelEditSourceName(item,index)"></Button>
								</div>
								<Button title="取消发布" btnClass="custom6" btnFontSize="14px" btnHeight="38px"
								 @click="cancelUse(item)"></Button>
								<button class="btn" @click="downloadClick(item,index)"><i class="iconfont icon-xiazai"></i>下载</button>
								<button class="btn" v-if="resourceObj.other_share == 0" @click="delResouce(item,index)"><i class="iconfont icon-chuyidong"></i>删除</button>
								<button class="btn" v-if="!item.isInput && resourceObj.other_share == 0" @click="editResouceName(item,index)"><i class="iconfont icon-xiugai"></i>修改</button>
							</div>
							<p @click="ViewDetail(item,index)">{{item.doc_content}}</p>
					</div>
				</el-col>
			</el-row>
			<div class="modal-bot" v-show="modalShow">
				<div class="left">
					<Button btnClass="custom8" btnFontSize="12px" btnHeight="38px" :title="isCheckAll?'取消全选':'全选'" @click="checkAll"></Button>
				</div>
				<div class="right">
					<Button btnClass="custom8"  v-show="isUse == 0"  btnFontSize="12px" btnHeight="38px" title="发布文档" @click="publishClick"></Button>
					<Button btnClass="custom6"  v-show="isUse == 1"  btnFontSize="12px" btnHeight="38px" title="取消发布" @click="cancelUse"></Button>
					<Button btnClass="custom12" btnFontSize="12px" v-show="resourceObj.other_share == 0" btnHeight="38px" title="删除" @click="delResouce({})"></Button>
					<Button btnClass="custom6" btnFontSize="12px" btnHeight="38px" title="完成" @click="closeModal"></Button>
				</div>
			</div>
		</el-main>

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

		<!-- 发布完成 -->
		<el-dialog title="发布完成" :visible.sync="publishSuccessDialog" width="400px" center class="upload-success">
				<Button title="暂不发布" btnClass="custom7" btnFontSize="12px" btnHeight="38px"
						@click="publishSuccessDialog = false"></Button>
				<Button title="发布到家长端" btnClass="custom8" btnFontSize="12px" btnHeight="38px"
						@click="publishSuccessDialog = false"></Button>
		</el-dialog>

        <!-- 取消发布 -->
		<el-dialog title="取消发布" :visible.sync="cancelDialog" v-if="cancelDialog" width="950px" center class="cancel-dialog">
			<div class="top" v-if="checkedArr.length>0">
                <img :src="uploadPicUrl+checkedArr[0].cdn_name+'?imageView2/1/w/100/h/75'" :onerror="defaultErrImg">
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
	</div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import treeTransfer from '@/components/Transfer/transfer-extend'
	import Toast from '@/components/Toast/Toast'
	export default {
		name: 'WordListDetail',
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
				viewDetailDialog:false,//应用模板弹窗
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
						title:'未使用',
						count:20,
						value:0,
					},
					{
						title:'正在使用',
						count:8,
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
						title:'平台提供1',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-21',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供2',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-22',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供3',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-23',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-24',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-28',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-28',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-28',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-28',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
					{
						title:'平台提供9',
						checked:false,
						id:0,
						isInput:false,
						uploadDate:'2018-11-29',
						doc_content:'测试数据测试数据测试数据测试数据测试数据测试数据测试数据',
					},
				],//文件夹列表=
				currentNum:1,//当前第几页
				editDialog:false,//编辑资源弹窗
				addDialog:false,//新增资源库弹窗
				publishDialog:false,//发布资源弹窗
				editForm:{
					title:'',//资源库名称
					checked:false,//资源库是否共享
				},//编辑资源弹窗form
				addForm:{
					label_name:'',//资源库名称
					resourceId:0,//资源库Id
					checked:false,//资源库是否共享
				},//新增资源库弹窗form
				uploadForm:{
					selectedResource:'',//资源库名称
					checked:false,//资源库是否共享
				},//上传资源库弹窗form
				resourceData:[
                    {
                        resourceNo:0,
                        label_name:'教学楼A',
                    },{
                        resourceNo:1,
                        label_name:'教学楼B',
                    },{
                        resourceNo:2,
                        label_name:'教学楼C',
                    },{
                        resourceNo:3,
                        label_name:'教学楼D',
                    }
                ],//所属楼宇数据
				rules:{
                    title: [
                        {  required: true, message: '请输入资源名称', trigger: 'blur' }
					],
                    label_name: [
                        {  required: true, message: '请输入资源库名称', trigger: 'blur' }
					],
					selectedResource:[
						{required: true, message: '请选择资源库', trigger: 'change'}
					],
				},
				modalShow:false,//蒙版显示 批量操作
				toCard:true,//发布到班牌 - 默认选中
                toParent:false,//发布到家长端 - 默认不选中
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
                cancelDialog:false,//取消发布弹窗
                checkedClass:[],//选中的教室
				checkAllClass: true,//是否全选
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
					let ttH = $('.word-list-detail  .detail-top').height();
					let dmH = $('.word-list-detail  .detail-mid').height();
					let tblH = icH - ttH - dmH;
					console.log(66, icH, ttH, dmH, tblH)
					$('.word-list-detail .label-list').height(tblH)
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
                console.log('上传按钮点击',this.resourceObj)
				this.$router.push({path: '/UploadWord', query: this.resourceObj})
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
			 *  @function: 查看文档详情
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			ViewDetail(item,index){
				console.log('查看文档详情',item,index)
				let params = {
                    id:item.id,
                    other_share:item.other_share
				}
				this.$router.push({path: '/WordDetail', query: params})
			},
			/**
			 *  @function: 编辑资源
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			editClick(item){
				console.log('编辑资源',item)
				this.editDialog = true;
				this.editForm.title = item.title;
			},
			/**
			 *  @function: 新增资源库
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			addClick(){
				console.log('新增资源库')
				this.addDialog = true;
				this.addForm = {
                    label_name:'',//资源库名称
					resourceId:0,//资源库Id
					checked:false,//资源库是否共享
                };
                setTimeout(() => {
                   	this.$refs.addForm.resetFields();
                }, 20);
			},
			/**
			 *  @function: 下载资源
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			downloadClick(item,index){
				console.log('下载资源',item,index);
			},
			/**
			 *  @function: 返回上一页
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			back(){
				console.log('返回上一页')
                this.$router.push('/ResourceWord');
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
				this.labelData.forEach((item,index)=>{
                    item.checked = false;
				})
			},
			/**
			 *  @function: 发布文档按钮点击
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			publishClick(item){
				console.log('发布文档按钮点击');
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
				this.choosePlaceDialog = true;
			},
			/**
			 *  @function: 删除不想发布的文档
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			reduceResource(index){
				console.log('删除不想发布的文档');
				this.checkedArr.splice(index,1);
				if(this.checkedArr.length == 0){
					this.publishDialog = false;//关闭弹窗
					this.modalShow = false;//关闭蒙版
				}
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
				this.$confirm('取消选中文档在所在教室的使用，取消后不可恢复！确定取消吗？', '提示', {
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
                console.log('保存资源库名称',this.resourceObj,this.inputVal)
                let params = {
                    id:this.resourceObj.label_id,  //标签id
                    label_name:this.inputVal,  //标签名称
                    is_share:this.resourceObj.is_share?1:0,    //是否共享(默认不共享)（0不共享，1共享）
                    resource_type:3,    //资源类型（1:图片；2:视频；3:文档）
                    user_id:localStorage.getItem('userId'),//登录人id
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                console.log(params);
                // return
                this.$api.Rules.modifyLabel('put',params).then( res => {
                    console.log('新增修改资源标签', res.data);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.$set(this.resourceObj,'label_name',this.inputVal);
                        this.isInput = false;
                        // this.getResourcesLabels();
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
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
                console.log('删除资源',item,index);
				this.$confirm('这个资源将被删除！同时删除班牌正在使用的资源！确定删除吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                }).then(() => {//点击确定按钮进行的操作
                    let params = {
                        // id:item.id,//	资源ID 
                        resource_type:3,//标签类型 1图片 2视频 3文档
                        school_id:localStorage.getItem('schoolId'),//学校id
                    };
                    let sosurceId = this.checkedArr.map(item=>{
                        return item.id
                    })
                    if(!this.modalShow){
                        params.id =  item.id;//	资源ID 
                    }else{
                        params.id =  sosurceId.join(',');//	资源ID 多个传id","字符串
                    }
                    console.log(sosurceId,params);
                    // return
                    this.$api.Rules.delResource(params).then( res => {
                        console.log('删除资源', res.data);
                        if (res.data.code == 600 ||　res.data.code == 0) {
                            this.$message({
                                showClose: true,
                                type: 'success',
                                message: '删除成功!',
                                duration: this.msgDuration
                            });//请求删除成功之后提示
                            this.modalShow = false;
                            this.isCheckAll = false;
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
                    })   
				}).catch(() => {});
			},
			/**
			 *  @function: 编辑资源名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			editResouceName(item,index){
				console.log('编辑资源名称',item,index)
				if(item.isInput) return;
				this.isSource = true;
				this.labelData.forEach(item=>{
					item.isInput = false;
				})
                item.isInput = true;
                // this.labelData.forEach((todo,idx)=>{
                //     this.$set(this.labelData[idx],'isInput',false)
				// })
                this.$set(this.labelData[index],'isInput',true)
				this.sourceVal = item.title;
				setTimeout(() => {
					console.log('编辑资源名称',this.$refs['edit'+index])
					// this.$refs['edit'+index].focus();
				},33);
			},
			/**
			 *  @function: 保存资源名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			saveEditSourceName(item,index){
                console.log('保存资源名称',item,index,this.sourceVal)
                let params = {
                    id:item.id,//	资源ID
                    resource_name:item.resource_name,//	资源名称
                    title:this.sourceVal,//	标题
                    doc_content:item.doc_content,//	文档内容
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$loading();
                this.$api.Rules.putResource('put',params).then( res => {
                    // console.log('获取资源列表', res.data.data.rows);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.$set(this.labelData[index],'title',this.sourceVal);
                        this.$set(this.labelData[index],'isInput',false)
                        console.log(111111111,this.labelData[index]);
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
			 *  @function: 取消保存资源名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			cancelEditSourceName(item,index){
				console.log('取消保存资源名称',item)
				item.isInput = false;
			},
			/**
			 *  @function: 多选操作
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			checkResource(item,index){
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
				console.log(this.checkedArr,this.isCheckAll);
                // }, 20);
                
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
			 *  @function: 新建保存资源库
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			saveAddResource(){
				console.log('新建保存资源库')
				this.$refs['addForm'].validate((valid) => {
					if (valid) {
						this.addDialog = false;
						this.uploadForm.selectedResource = parseInt(this.addForm.resourceId);//此处赋资源库id值
						this.uploadForm.checked = this.addForm.checked;//是否共享
                        console.log("addForm:",this.addForm);
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
				console.log('保存上传资源')
				this.$refs['uploadForm'].validate((valid) => {
					if (valid) {
                        // this.uploadDialog = false;
                        console.log("uploadForm:",this.uploadForm);
						this.$refs.upload.submit();
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
			 *  @function: 上传资源-选择是否共享
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			changeShare(val){
				console.log('上传资源-选择是否共享',val)
				setTimeout(() => {
					this.$refs["uploadForm"].clearValidate(['selectedResource']);
				});
			},
			/**
			 *  @function: 删除资源
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			delResource(){
				console.log('删除资源')
				this.$confirm('这个资源将被删除！同时删除班牌正在使用的资源！确定删除吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					this.editDialog = false;//关闭弹窗
					this.$message({
						showClose: true,
						type: 'success',
						message: '删除成功!',
						duration: this.msgDuration
					});//请求删除成功之后提示
				}).catch(() => {});
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
			 *  @function: 获取资源列表
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			getResources(){
                this.$loading();
                let params = {
                    // user_id:localStorage.getItem('userId'),//登陆者id
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    label_id:this.resourceObj.label_id,//资源库ID
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.Rules.getResources('get',params).then( res => {
                    console.log('获取资源列表', res.data.data.rows);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.$set(this.resourceObj,'count',res.data.data.count);
                        this.labelData = res.data.data.rows;
                        this.labelData.forEach((item,index)=>{
                            this.$set(item,'checked',false)
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
			 *  @function: 获取已发布资源列表
			 *  @author: cs
			 *  @date 2019-01-18
			 */
            getPublishedResources(){
                this.$loading();
                let params = {
                    user_id:localStorage.getItem('userId'),//登陆者id
                    resource_type:3,//标签类型 1图片 2视频 3文档
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
                    user_id:localStorage.getItem('userId'),//登陆者id
                    resource_type:3,//标签类型 1图片 2视频 3文档
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
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_id:sosurceId.join(','),//资源ID，多个ID使用逗号分隔
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    class_id:-1,//班级ID，多个ID使用逗号分隔（见文档）
                    place_id:placeidArr.join(','),//场所ID，多个ID使用逗号分隔（见文档）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
                console.log(params);
                this.$loading();
                this.$api.Rules.unPublishResource('post',params).then( res => {
                    console.log('取消资源发布', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '取消成功!',
                            duration: this.msgDuration
                        });//请求取消成功之后提示
                        this.cancelDialog = false;
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
            },
            /**
			 *  @function: 资源发布
			 *  @author: cs
			 *  @date 2019-01-20
			 */
			publishResource(item){
                let sosurceId = [];
                    sosurceId = this.checkedArr.map(element=>{
                        return element.id
                    })
                let placeidArr = this.listClassroom.map(element=>{
                    return element.id
                })
                
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    class_id:-1,//班级ID，多个ID使用逗号分隔（见文档）
                    place_id:placeidArr.join(','),//场所ID，多个ID使用逗号分隔（见文档）
                    is_show_parent:this.toParent?1:0,//发布给家长（0:否；1:是）
                    is_show_device:this.toCard?1:0,//发布到班牌（0:否；1:是）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
                if(item){
                    params.resource_id = item.id;
                }else{
                    let sosurceId = [];
                    sosurceId = this.checkedArr.map(element=>{
                        return element.id
                    })
                    params.resource_id  = sosurceId.join(',')
                }
                console.log(item,params);
                // return
                this.$loading();
                this.$api.Rules.publishResource('post',params).then( res => {
                    console.log('资源发布', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.choosePlaceDialog = false;
                        this.modalShow = false;
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '发布成功',
                            duration: this.msgDuration
                        });
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
            console.log(147,this.resourceObj);
            
         },
         created(){
			console.log(66,this.$route.query,localStorage.getItem('routeParams'));
            if(JSON.stringify(this.$route.query) != '{}'){
                this.resourceObj = this.$route.query;
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
   .word-list-detail{
		width: 100%;
		height: 100%;
		overflow: hidden;
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
			   width: 100%;
			   height: 130px;
			   overflow: hidden;
			   .inner{
					background-color: #fff;
					padding: 10px;
					height: 100%;
					overflow: hidden;
					position: relative;
					&:hover{
						background-color: #f5f6f5 ;
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
					}
					.check-box{
						width: 25px;
						height: 25px;
						line-height: 25px;
						text-align: center;
						border-radius: 50%;
						border: 1px solid #bfbfbf;
						margin-left: 13px;
						margin-top: 10px;
						background-color: #fff;
						float: left;
						i{
							color: #1cab7d;
							font-size: 20px;
						}
					}
					.top{
						position: relative;
						height: 42px;
						margin-left: 60px;
						.left{
							display: inline-block;
						}
						h4{
							font-size: 16px;
							font-weight: bold;
							margin-top: 10px;
							display: inline-block;
							cursor: pointer;
							span{
								font-weight: normal;
								font-size: 13px;
								color: #888;
							}
						}
						.button-div{
							float: right;
								margin-left: 10px;
						}
						.btn{
							outline: none;
							border: none;
							background-color: transparent;
							height: 40px;
							line-height: 40px;
							font-size: 14px;
							cursor: pointer;
							color: #666;
							margin-right: 15px;
							float: right;
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
					p{
						font-size: 14px;
						line-height: 20px;
						max-height: 40px;
						overflow: hidden;
						margin-bottom: 4px;
						margin-top: 10px;
						color: #888;
						margin-left: 60px;
						cursor: pointer;
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
						text-align: left;
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
							float: right;
							width: 100px;
							margin-left: 20px;
							margin-right: 0 !important;
						}
					}
				}
            }
            
        }
	   .show-detail{
		   /deep/ .el-dialog{
				.el-dialog__header{
					// padding: 20px 100px 0 35px;
					padding: 0;
					text-align: left;
					.dialog-header{
						margin-top: 20px;
						border-bottom: 1px solid #e7e8eb;
						overflow: hidden;
						.left{
							float: left;
							width: 400px;
							margin-left: 35px;
							padding-bottom: 20px;
							.source-name{
								float: left;
								min-width: 160px;
								overflow: hidden;
								.el-input{
									display: block;
								}
								dd{
									font-size: 16px;
									line-height: 32px;
									font-weight: bold;
									color: #333;
								}
								span{
									font-weight: normal;
									font-size: 14px;
								}
								.button-div{
									margin-left: 10px;
								}
							}
							.button-div{
								margin-left: 10px;
							}
						}
						.right{
							float: right;
							.btn{
								outline: none;
								border: none;
								background-color: transparent;
								height: 40px;
								line-height: 40px;
								font-size: 14px;
								cursor: pointer;
								color: #666;
								margin-right: 10px;
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
							.button-div{
								margin-right: 100px;
							}
						}
						
					}
				}
				.el-dialog__body{
					text-align: center;
					border: 0 !important;
					.swiper-container{
						width: 580px;
						height: 370px;
						.swiper-wrapper{
							.swiper-slide{
								text-align: center;
							}
						}
							&.gallery-top {
							height: 80%;
							.swiper-slide {
								img{
									width: 100%;
									max-height: 430px;
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
								overflow: hidden;
								width: 16%;
								img{
									width: 100%;
									border: 2px solid transparent;
								}
							}
						}
						&.gallery-thumbs .swiper-slide-thumb-active {
							img{
								border: 2px solid #1cab7d;
							}
						}
					}
					.current-count {
						min-width: 70px;
						height: 35px;
						line-height: 35px;
						font-size: 16px;
						color: #000;
						text-align: center;
						position: absolute;
						right: 0;
						left: 0;
						bottom: 24px;
						margin: auto;
						z-index: 5;
						span{
							color: #1cab7d;
						}
					}
					.swiper-button-next{
						width: 40px;
						height: 60px;
						top: 42%;
						right: 55px;
						background: url('../../../../assets/images/next.png') no-repeat center;
						background-size: 100% ;
						&:focus{
							outline: none;
						}
					}
					.swiper-button-prev{
						width: 40px;
						height: 60px;
						top: 42%;
						left: 55px;
						background: url('../../../../assets/images/next.png') no-repeat center;
						background-size: 100% ;
						-webkit-transform: rotate(-180deg);
						-moz-transform: rotate(-180deg);
						-ms-transform: rotate(-180deg);
						-o-transform: rotate(-180deg);
						transform: rotate(-180deg);
						&:focus{
							outline: none;
						}
					}
					.swiper-button-disabled{
						background: url('../../../../assets/images/next_normal.png') no-repeat center;
						background-size: 100% ;
						opacity: 1;
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
