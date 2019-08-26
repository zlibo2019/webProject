<template>
    <div class="upload-word">
		<div class="upload-top">
			<h4>上传文档</h4>
			<Button btnClass="custom6" :iconLeft="true" :data="btn2Data" btnFontSize="12px" btnHeight="38px" title="返回上一页" @click="back"></Button>
		</div>
		<div class="upload-content">
			<el-form ref="addWrodForm" label-width="100px" :rules="rules" :model="addWrodForm">
				<el-form-item label="资源库：" prop="label_id">
					<el-select v-model="addWrodForm.label_id" placeholder="请选择资源库">
                        <el-option v-for="item in userLabels"  :key="item.id" :label="item.label_name" :value="item.id"></el-option>
					</el-select>
					<Button btnClass="custom11" btnFontSize="12px"  title="+添加"  @click="addClick" ></Button>
					<br>
					<el-checkbox v-model="addWrodForm.is_share" @change="changeShare">共享</el-checkbox>
				</el-form-item>
				<el-form-item label="标题：" prop="title">
					<el-input v-model="addWrodForm.title" maxlength="20" clearable placeholder="请输入标题"  style="width: 305px;"></el-input>
				</el-form-item>
				<el-form-item label="内容：" prop="doc_content">
					<el-input
						type="textarea"
						:rows="15"
						maxlength="1000"
						placeholder="请输入内容..."
						v-model="addWrodForm.doc_content">
						</el-input>
						<span class="limit">{{addWrodForm.doc_content.length}}/1000</span>
				</el-form-item>
			</el-form>
			<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
					@click="back"></Button>
			<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
					@click="saveUpload"></Button>
		</div>

		<!-- 新建资源库 -->
		<el-dialog title="新建资源库" :visible.sync="addDialog" width="500px" center class="upload-dialog">
            <div class="content">
                <el-form ref="addForm" label-width="100px" :rules="rules" :model="addForm">
					<el-form-item label="资源库名称：" prop="label_name" >
						<el-input v-model="addForm.label_name" placeholder="请输入资源库名称" 
						clearable style="width: 230px;" ></el-input>
                    </el-form-item>
					<el-form-item label="资源库共享：">
						<el-checkbox v-model="addForm.is_share">共享</el-checkbox>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="addDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveAddResource"></Button>
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
						@click="uploadSuccessDialog = false" v-if="roleNos.indexOf('S01') > -1"></Button>
				<Button title="发布文档" btnClass="custom8" btnFontSize="12px" btnHeight="40px"
						@click="choosePlaceDialog = true" v-if="roleNos.indexOf('S01') > -1"></Button>
				<Button title="发布文档" btnClass="custom8" btnFontSize="12px" btnHeight="40px" v-if="roleNos.indexOf('S01') == -1"
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
	export default {
		name: 'UploadWord',
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
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
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
				btn2Data:{
					iconL: require('../../../../assets/images/back_no.png'),
					iconLAct: require('../../../../assets/images/back_ac.png')
				},//返回按钮
				addDialog:false,//新增资源库弹窗
				addForm:{
					label_name:'',//资源库名称
					label_id:0,//资源库Id
					is_share:false,//资源库是否共享
				},//新增资源库弹窗form
				rules:{
                    title: [
                        {  required: true, message: '请输入标题', trigger: 'blur' }
					],
                    doc_content: [
                        {  required: true, message: '请输入内容', trigger: 'blur' }
					],
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
				publishSuccessDialog:false,//发布成功弹窗
				uploadSuccessDialog:false,//上传成功弹窗
				toCard:true,//发布到班牌 - 默认选中
				toParent:false,//发布到家长端 - 默认不选中
				userLabels:[],//自己创建的资源库
				uploadParams:{},//上传参数
				fileList:[],//上传上传的文件列表
				addWrodForm:{
					label_name:'',//资源库名称
					label_id:'',//资源库Id
					is_share:false,
					title:'',
					doc_content:'',
				},//文档上传form
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
					let ttH = $('.upload-word > .upload-top').height();
					let tblH = icH - ttH ;
					console.log(66, icH, ttH)
					$('.upload-word .upload-content').height(tblH)
				}, 50)
			},
			/**
			 *  @function: 返回上一页
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			back(){
                console.log('返回上一页',localStorage.getItem('routeParams'));
				this.$router.go(-1);
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
					label_id:0,//资源库Id
					is_share:false,//资源库是否共享
                };
                setTimeout(() => {
                   	this.$refs.addForm.resetFields();
                }, 20);
			},
			/**
			 *  @function: 上传资源-选择是否共享
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			changeShare(val){
				console.log('上传资源-选择是否共享',val)
				setTimeout(() => {
					this.$refs["addWrodForm"].clearValidate(['label_id']);
				});
			},
			/**
			 *  @function: 新建保存资源库
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			saveAddResource(){
				console.log('新建保存资源库',this.addForm)
				this.$refs['addForm'].validate((valid) => {
					if (valid) {
                        let params = {
                            label_name:this.addForm.label_name,  //标签名称
                            is_share:this.addForm.is_share?1:0,    //是否共享(默认不共享)（0不共享，1共享）
                            resource_type:3,    //资源类型（1:图片；2:视频；3:文档）
                            user_id:localStorage.getItem('userId'),//登陆者id
                            school_id:localStorage.getItem('schoolId'),//学校id
                        };
                        this.$api.Rules.modifyLabel('post',params).then( res => {
                            console.log('新增文档资源标签', res.data);
                            if (res.data.code == 600 ||　res.data.code == 0) {
                                this.addDialog = false;
                                this.addWrodForm.label_id = res.data.data.id;//此处赋资源库id值
                                this.addWrodForm.is_share = res.data.data.is_share == 1;//是否共享
                                this.getUserLabels();//获取本人创建的资源标签列表
                                
						// setTimeout(() => {
						// 	this.$refs["addWrodForm"].clearValidate(['label_id']);
						// });
                            } else {
                                this.isToast = true;
                                this.toast = res.data.msg;
                            }
                        })
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
			 *  @function: 上传之前验证
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			beforeUpload(file){
				console.log('上传之前验证:',file.type);
				// const isJPG = file.type === 'image/jpeg';
				// const isGIF = file.type === 'image/gif';
				// const isPNG = file.type === 'image/png';
				// const isLt20M = file.size / 1024 / 1024 < 2;
				// if (!isJPG && !isGIF && !isPNG) {
				// 	this.$message({
				// 		showClose: true,
				// 		type: 'warning',
				// 		message: '只能上传jpg、png、静态gif图片!',
				// 		duration: this.msgDuration
				// 	})
				// }
				// if (!isLt20M) {
				// 	this.$message({
				// 		showClose: true,
				// 		type: 'warning',
				// 		message: '上传图片大小不能超过 20MB!',
				// 		duration: this.msgDuration
				// 	})
				// }
				// if(!((isJPG || isGIF || isPNG) && isLt20M)){
				// 	console.log(1);
					
				// 	this.$refs.upload.abort()
				// }
				// return (isJPG || isGIF || isPNG) && isLt20M;
			},
			/**
			 *  @function: 添加文件、上传成功和上传失败
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			changeUpload(file, fileList){
				console.log('文件状态改变时', file, fileList);
				const isJPG = file.raw.type === 'image/jpeg';
				const isGIF = file.raw.type === 'image/gif';
				const isPNG = file.raw.type === 'image/png';
                const isLt20M = file.size / 1024 / 1024 < 2;
                const filePath = file.raw.name.toLowerCase().split(".");
                let fileType =  [];
                let isRAR =  false;
                if(filePath.length > 0){
                   fileType = filePath[filePath.length - 1]; //获得文件结尾的类型 rar
                   isRAR = fileType == 'rar';
                }
                console.log(fileType,isGIF);
				if (!isJPG && !isGIF && !isPNG && !isRAR ) {
					this.$message({
						showClose: true,
						type: 'warning',
						message: '只能上传rar、jpg、png、静态gif图片!',
						duration: this.msgDuration
                    })
				}
				if (!isLt20M) {
					this.$message({
						showClose: true,
						type: 'warning',
						message: '上传图片大小不能超过 20MB!',
						duration: this.msgDuration
					})
				}
				if(!((isJPG || isGIF || isPNG) && isLt20M)){
					fileList.forEach((item,index) => {
						if (item.uid == file.uid) {
							console.log(index);
							fileList.splice(index,1)
						}
					});
					// this.$refs.upload.abort()
				}
				console.log(fileList);
			},
			/**
			 *  @function: 上传成功
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			uploadSuccess(response, file, fileList){
				console.log('上传成功',response, file, fileList);
				this.uploadSuccessDialog = true;
				// this.$refs.upload.clearFiles();
				// this.uploadDialog = false;
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
			 *  @function: 保存上传资源
			 *  @author: cs
			 *  @date 2018-12-14
			 */
			saveUpload(){
                console.log('保存上传资源',this.addWrodForm);
                this.resourceList = [];
				this.$refs['addWrodForm'].validate((valid) => {
					if (valid) {
                        console.log("addWrodForm:",this.addWrodForm);
                        let params = {
                            "resource_type":3,//标签类型 1图片 2视频 3文档
                            "label_id": this.addWrodForm.label_id,//标签id
                            "is_share": this.addWrodForm.is_share?1:0,//是否共享
                            "title": this.addWrodForm.title,//文档标题
                            "doc_content": this.addWrodForm.doc_content,//文档内容
                            "school_id":localStorage.getItem('schoolId'),//学校id
                        };
                        console.log(params);
                        this.$api.Rules.addResource('post',params).then( res => {
                            console.log('保存上传资源', res.data);
                            this.$loading().close();
                            if (res.data.code == 600 ||　res.data.code == 0) {
                                this.uploadSuccessDialog = true;
                                this.$refs.addWrodForm.resetFields();
                                this.resourceList = res.data.data;
                                this.getPlaceTree();
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
			 *  @function: 删除资源库
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			delResource(){
				console.log('删除资源库',this.checkedResource)
				this.$confirm('这个资源库内所有文档都将被删除！同时删除班牌正在使用的资源！确定删除吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					this.editDialog = false;//关闭弹窗
					this.checkedResource = {};//选中的资源库清空
					this.$message({
						showClose: true,
						type: 'success',
						message: '删除成功!',
						duration: this.msgDuration
					});//请求删除成功之后提示
				}).catch(() => {});
            },
            /**
			 *  @function: 获取本人创建的资源标签列表
			 *  @author: cs
			 *  @date 2019-01-17
			 */
			getUserLabels(){
				console.log('获取本人创建的资源标签列表')
                let params = {
                    resource_type:3,//标签类型 1图片 2视频 3文档
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
                let placeidArr = this.listClassroom.map(item=>{
                    return item.id
                })
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_id:this.resourceList.id,//资源ID，多个ID使用逗号分隔
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    class_id:-1,//班级ID，多个ID使用逗号分隔（见文档）
                    place_id:placeidArr.join(','),//场所ID，多个ID使用逗号分隔（见文档）
                    is_show_parent:this.toParent?1:0,//发布给家长（0:否；1:是）
                    is_show_device:this.toCard?1:0,//发布到班牌（0:否；1:是）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
                console.log(params,placeidArr);
                this.$loading();
                this.$api.Rules.publishResource('post',params).then( res => {
                    console.log('资源发布', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '发布成功',
                            duration: this.msgDuration
                        });
                        this.choosePlaceDialog = false;
                        this.uploadSuccessDialog = false;
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
            if(JSON.stringify(this.$route.query) != '{}'){
                localStorage.setItem('routeParams',JSON.stringify(this.$route.query))
                console.log(111111111,localStorage.getItem('routeParams'));
            }
            this.getUserLabels();//获取本人创建的资源标签列表
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
   .upload-word{
		width: 100%;
		height: 100%;
		overflow: hidden;
		.upload-top{
			min-height: 6vh;
			height: 6vh;
			line-height: 6vh;
			background-color: #fff;
			border-bottom: 1px solid #E7E8EB;
			overflow: hidden;
			h4{
				font-size: 16px;
				font-weight: bold;
				display: inline-block;
				margin-left: 30px;
			}
			.button-div{
				float: right;
				margin-right: 20px;
				margin-top: 9px;
			}
		}
		.upload-content{
			width: 100%;
			height: 100%;
			text-align: center;
			background-color: #fff;
			padding-right: 10%;
			overflow: hidden;
			/deep/ .el-form{
				margin-top: 30px;
				margin-right: 10%;
				.el-form-item{
					text-align: left;
					.button-div{
						margin-top: 0;
						margin-left: 20px;
					}
					.el-textarea__inner{
						padding: 10px 15px 30px;
					}
					.limit{
						position: absolute;
						right: 15px;
    					bottom: 10px;
						z-index: 1;
						font-size: 12px;
						line-height: 16px;
						color: #cfcfcf;
					}
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
			}
			.button-div{
				&:nth-of-type(1){
					margin-top: 3vh;
					margin-right: 20px;
				}
				&:nth-of-type(2){
					margin-top: 3vh;
					margin-left: 20px;
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
						// .el-upload-list{
						// 	text-align: left;
						// 	max-height: 160px;
    					// 	overflow: auto;
						// 	li{
						// 		height: auto;
						// 		outline: none;
						// 		border-color: #e1e1e1;
						// 		img{
						// 			width: 20px;
						// 			height: 20px;
						// 		}
						// 		a{
						// 			margin-top: 0;
						// 			line-height: 20px;
						// 			&:hover{
						// 				color: #1cab7d;
						// 			}
						// 			i{
						// 				display: none;
						// 			}
						// 		}
						// 	}
						// }
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
