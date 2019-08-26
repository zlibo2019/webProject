<template>
    <div class="word-detail">
		<div class="detail-top">
			<h4>文档详情</h4>
			<Button btnClass="custom6" :iconLeft="true" :data="btn2Data" btnFontSize="12px" btnHeight="38px" title="返回列表" @click="back"></Button>
			<Button btnClass="custom6"  btnFontSize="12px" v-if="resourceObj.is_published != 0 && roleNos.length == 1 && roleNos[0] == 'SYS002'" btnHeight="38px" title="取消发布" @click="cancelUse"></Button>
			<Button btnClass="custom6"  btnFontSize="12px" v-if="resourceObj.is_published != 0  && roleNos.indexOf('S01') > -1" btnHeight="38px" title="取消发布" @click="manageCancelUse"></Button>
            <Button btnClass="custom8"  btnFontSize="12px" btnHeight="38px" v-if="resourceObj.is_published == 0" title="发布文档" @click="publishClick"></Button>
        </div>
		<div class="detail-content">
			<div class="top">
				<div class="left">
					<el-input v-model="titleVal" maxlength="20" clearable size="small" ref="titleInput"
					placeholder="请输入资源名称" style="width:150px;" v-show="isInput"></el-input>
					<h4 v-show="!isInput">{{resourceObj.title}}<br><span>{{resourceObj.ut_date?resourceObj.ut_date:resourceObj.ct_date}}</span></h4>
					<Button v-show="isInput" title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveEditSourceName"></Button>
					<Button v-show="isInput" title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="cancelEditSourceName"></Button>
				</div>
				<button class="btn" @click="downloadClick"><i class="iconfont icon-xiazai"></i>下载</button>
				<button class="btn" @click="delResouce({})" v-if="resourceObj.other_share == 0"><i class="iconfont icon-chuyidong"></i>删除</button>
				<button class="btn" @click="editResouceName" v-show="!isInput && resourceObj.other_share == 0"><i class="iconfont icon-xiugai"></i>修改</button>
			</div>
			<div class="content">
				<p v-show="!isInput">{{resourceObj.doc_content}}</p>
                <el-input v-model="contentVal" type="textarea" :autosize="{ minRows: 20, maxRows: 30}"
                placeholder="请输入内容" style="width:100%;" v-show="isInput"></el-input>
			</div>
		</div>
		<div class="detail-bot">
			<div class="prev common" @click="prevClick" v-if="resourceObj.prev">
				<dd>上一条</dd>
				<h5>{{resourceObj.prev.title}}</h5>
				<span>{{resourceObj.prev.ut_date?resourceObj.prev.ut_date:resourceObj.prev.ct_date}}</span>
			</div>
			<div class="next common" @click="nextClick" v-if="resourceObj.next">
				<dd>下一条</dd>
				<h5>{{resourceObj.next.title}}</h5>
				<span>{{resourceObj.next.ut_date?resourceObj.next.ut_date:resourceObj.next.ct_date}}</span>
			</div>
		</div>

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
		name: 'WordDetail',
		components: {
			Button, treeTransfer, Toast
		},
		data() {
			return {
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				choosePlaceDialog:false,//选择教室弹窗
				publishSuccessDialog:false,//发布成功弹窗
				listClassroom: [],//选中的教室数组,传给后台的参数
                fromData:[],
				// ------------------ //
				isInput:false,//是否显示input
				titleVal:'',//资源标题编辑
				contentVal:'',//资源内容编辑
				searchVal: "",//搜索内容
				resourceObj:{
                    next:{},
                    prev:{},
                },//接收传参  上部显示
				btn2Data:{
					iconL: require('../../../../assets/images/back_no.png'),
					iconLAct: require('../../../../assets/images/back_ac.png')
				},//返回按钮
				toCard:true,//发布到班牌 - 默认选中
				toParent:false,//发布到家长端 - 默认不选中
				prevObj:{
					title:'标题标题标题标题标题标题',
					date:'2018-12-18',
					id:1
				},
				nextObj:{
					title:'标题标题标题标题标题标题',
					date:'2018-12-18',
					id:2
				},
                checkedArr:[],//选中的数组
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
		methods: {
			/**
			 *  @function: 重新获取宽高
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			resizeLayout() {
				setTimeout(() => {
					let icH = $('.index > .m-cen').height();	
					let ttH = $('.word-detail  .detail-top').height();
					let dctH = $('.word-detail  .detail-content .top').height();
					let dbH = $('.word-detail  .detail-bot').height();
					let tblH = icH - ttH - dctH - dbH -20 -30;
					console.log(66, icH, ttH, dctH, dbH, tblH);
					$('.word-detail  .detail-content .content').height(tblH)
				}, 200)
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
			 *  @function: 查看上一条
			 *  @author: cs
			 *  @date 2018-12-18
			 */
			prevClick(){
                console.log('查看上一条',this.resourceObj.prev);
                this.isInput = false;
                this.getResourceDetail(this.resourceObj.prev);

                // let params = {
                //     id:this.resourceObj.prev.id,
                //     other_share:this.resourceObj.other_share
                // }
                // console.log(params);
                // this.$router.replace({path: '/WordDetail', query: params})
                // this.$router.push({path: '/WordDetail', query: params})
			},
			/**
			 *  @function: 查看下一条
			 *  @author: cs
			 *  @date 2018-12-18
			 */
			nextClick(){
				console.log('查看下一条',this.resourceObj.next);
                this.isInput = false;
                this.getResourceDetail(this.resourceObj.next)
			},
			/**
			 *  @function: 下载资源
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			downloadClick(){
				console.log('下载资源');
			},
			/**
			 *  @function: 返回上一页
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			back(){
				console.log('返回上一页');
				this.$router.go(-1);
			},
			/**
			 *  @function: 发布文档按钮点击
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			publishClick(){
                console.log('发布文档按钮点击');
                if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){
                    this.publishResource();
                }else{
                    this.choosePlaceDialog = true;
                    this.getPlaceTree();
                    this.listClassroom = [];
                }
			},
			/**
			 *  @function: 取消发布
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			cancelUse(){
				console.log('取消发布');
				this.$confirm('取消文档在所在教室的使用，取消后不可恢复！确定取消吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                }).then(() => {//点击确定按钮进行的操作
                    this.unPublishResource();
				}).catch(() => {});
			},
            /**
			 *  @function: 删除资源
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			delResouce(){
                console.log('删除资源');
				this.$confirm('这个资源将被删除！同时删除班牌正在使用的资源！确定删除吗？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                }).then(() => {//点击确定按钮进行的操作
                    let params = {
                        id:this.resourceObj.id,//	资源ID 
                        resource_type:3,//标签类型 1图片 2视频 3文档
                        school_id:localStorage.getItem('schoolId'),//学校id
                    };
                    console.log(params);
                    this.$api.Rules.delResource(params).then( res => {
                        console.log('删除资源', res.data);
                        if (res.data.code == 600 ||　res.data.code == 0) {
                            this.$message({
                                showClose: true,
                                type: 'success',
                                message: '删除成功!',
                                duration: this.msgDuration
                            });//请求删除成功之后提示
                            if(this.resourceObj.prev){
                                this.getResourceDetail(this.resourceObj.prev.id);
                            }else if(this.resourceObj.next){
                                this.getResourceDetail(this.resourceObj.next.id);
                            }else {
                                setTimeout(() => {
                                    this.$message({
                                        showClose: true,
                                        type: 'success',
                                        message: '当前资源库中已无文档，将返回上一页！',
                                        duration: this.msgDuration
                                    });//请求删除成功之后提示
                                }, this.msgDuration);
                                setTimeout(() => {
                                    this.$router.go(-1);
                                }, this.msgDuration*2);
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
			editResouceName(){
				console.log('编辑资源名称')
				if(this.isInput) return;
				this.isInput = true;
				this.titleVal = this.resourceObj.title;
				this.contentVal = this.resourceObj.doc_content;
				setTimeout(() => {
					this.$refs.titleInput.focus();
				});
			},
			/**
			 *  @function: 保存资源名称
			 *  @author: cs
			 *  @date 2018-12-13
			 */
			saveEditSourceName(){
				console.log('保存资源名称',this.titleVal,this.contentVal)
                let params = {
                    id:this.resourceObj.id,//	资源ID
                    resource_name:this.resourceObj.resource_name,//	资源名称
                    title:this.titleVal,//	标题
                    doc_content:this.contentVal,//	文档内容
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$loading();
                this.$api.Rules.putResource('put',params).then( res => {
                    // console.log('获取资源列表', res.data.data.rows);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.$set(this.resourceObj,'title',this.titleVal);
                        this.$set(this.resourceObj,'doc_content',this.contentVal);
                        this.isInput = false;
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
				console.log('取消保存资源名称')
				this.isInput = false;
            },
            /**
			 *  @function: 通过id获取资源详细 主要用于文档
			 *  @author: cs
			 *  @date 2019-01-19
			 */
			getResourceDetail(resource){
                console.log("通过id获取资源详细",resource);
                // localStorage.setItem('routeParams',JSON.stringify(resource));
                let params = {
                    id:resource.id,//	资源ID
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$loading();
                this.$api.Rules.putResource('get',params).then( res => {
                    console.log('通过id获取资源详细', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.resourceObj = res.data.data;
                        this.resourceObj.other_share = JSON.parse(localStorage.getItem('routeParams')).other_share;
                        console.log(this.resourceObj,JSON.parse(localStorage.getItem('routeParams')));
                        
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
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_id:this.resourceObj.id,//资源ID，多个ID使用逗号分隔
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    class_id:'100483',//班级ID，多个ID使用逗号分隔（见文档）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
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
                        this.getResourceDetail(this.resourceObj);
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
                if(this.listClassroom.length == 0 && this.choosePlaceDialog){
                    this.$message({
                        showClose: true,
                        type: 'warning',
                        message: '请选择场所/教室',
                        duration: this.msgDuration
                    });
                    return
                }
                let placeidArr = [];
                placeidArr = this.listClassroom.map(item=>{
                    return item.id
                })
                
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                    resource_type:3,//标签类型 1图片 2视频 3文档
                    resource_id:this.resourceObj.id,//资源ID，多个ID使用逗号分隔
                    class_id:-1,//班级ID，多个ID使用逗号分隔（见文档）
                    place_id:placeidArr.join(','),//场所ID，多个ID使用逗号分隔（见文档）
                    is_show_parent:this.toParent?1:0,//发布给家长（0:否；1:是）
                    is_show_device:this.toCard?1:0,//发布到班牌（0:否；1:是）
                    user_id:localStorage.getItem('userId'),//登陆者id
                };
                console.log(params,this.resourceObj);
                this.$loading();
                this.$api.Rules.publishResource('post',params).then( res => {
                    console.log('资源发布', res.data);
                    this.$loading().close();
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.choosePlaceDialog = false;
                        this.$message({
                            showClose: true,
                            type: 'success',
                            message: '发布成功',
                            duration: this.msgDuration
                        });
                        this.getResourceDetail(params);
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
			manageCancelUse(){
				console.log('管理者取消发布');
				this.checkedArr = [];
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
            this.resizeLayout();//重新获取宽高
         },
         created(){
            console.log(this.$route.query);
            let params = {};
            
            if(JSON.stringify(this.$route.query) != '{}'){
                console.log(1);
                localStorage.setItem('routeParams',JSON.stringify(this.$route.query))
                params = this.$route.query;
            }else{
                params = JSON.parse(localStorage.getItem('routeParams'));
                console.log(12,params);
            }
            this.getResourceDetail(params);
         },
         destroyed(){
            localStorage.removeItem('routeParams');
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
	.word-detail{
		width: 100%;
		height: 100%;
		background-color: #fff;
		overflow: hidden;
		.detail-top{
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
		.detail-content{
			.top{
				position: relative;
				height: 80px;
				line-height: 80px;
				margin-left: 30px;
				.left{
					display: inline-block;
					.button-div{
						float: none;
						// width: 70px;
						margin-left: 10px;
					}
				}
				h4{
					font-size: 16px;
					line-height: 20px;
					font-weight: bold;
					margin-top: 22px;
					display: inline-block;
					cursor: pointer;
					span{
						font-weight: normal;
						font-size: 13px;
						color: #888;
					}
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
					margin-top: 20px;
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
			.content{
				height: 100%;
				overflow-y: auto;
				margin: 0 30px;
				p{
					height: 100%;
					text-align: justify;
				}
			}
		}
		.detail-bot{
			margin:0 30px;
            height: 12vh;
			margin-top: 20px;
			.common{
				height: 6vh;
				line-height: 6vh;
				cursor: pointer;
				border-top: 1px solid #E7E8EB;
				&:nth-last-child(1){
					border-bottom: 1px solid #E7E8EB;
				}
				&:hover{
					dd{
						color: #1cab7d;
					}
					h5{
						color: #1cab7d;
					}
					span{
						color: #1cab7d;
					}
				}
				dd{
					display: inline-block;
					font-size: 15px;
					color: #888;
					margin-left: 30px;
					margin-right: 50px;
				}
				h5{
					display: inline-block;
					font-size: 16px;
					font-weight: normal;
				}
				span{
					float: right;
					margin-right: 20px;
					font-size: 13px;
					color: #888;
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
	}
</style>
