<template>
    <div class="role-group-set">
        <div class="m-top">
            <div class="title">
                角色组
                <div class="btns1" v-if="switchBtn">
                    <Button title="添加角色" btnClass="custom7" :data="btn1Data" btnFontSize="12px" btnHeight="3.5vh" @click="addClick"
                            :iconLeft="true" v-if="roleActions.indexOf('角色授权_@bepf@role@add_create_own') > -1"></Button>
                    <Button title="修改" btnClass="custom7" :data="btn2Data" btnFontSize="12px" btnHeight="3.5vh" @click="editClick"
                            :iconLeft="true" v-if="roleActions.indexOf('角色授权_@bepf@role@edit_update_own') > -1"></Button>
                    <Button title="删除" btnClass="custom7" :data="btn3Data" btnFontSize="12px" btnHeight="3.5vh" @click="deleteClick"
                            :iconLeft="true" v-if="roleActions.indexOf('角色授权_@bepf@role@del_delete_own') > -1"></Button>
                </div>
                <div class="btns2" v-else>
                    <Button title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveClick(addBuildModel,'checkInputChars')"></Button>
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="cancel"></Button>
                </div>
            </div>
            <div class="content">
                <div class="groupBtn" v-for="(build, bIdx) in buildingData" 
				@click="clickInput(build, $event,bIdx)" :key="bIdx">
                    <el-input placeholder="请输入内容" 
						v-model="build.roleName" 
						:value="build.roleName" 
						size="small" 
						readonly>
					</el-input>
                </div>
                <div class="groupBtn" v-if="addBuild">
                    <el-input v-model="addBuildModel" class="add-build-input" placeholder="请输入内容" size="small"></el-input>
                </div>
                <div class="shade-div"></div>
            </div>
        </div>
        <div class="turn-bottom">
            <div class="operate-box title">
                角色组权限
                <Button :title="btnTitle?'保存':'编辑'" btnClass="custom7" :data="btn2Data" btnFontSize="12px" btnHeight="3.5vh" @click="editBtnClick"
                        :iconLeft="true" :dised1="tableData.length == 0" v-if="roleActions.indexOf('角色授权_@bepf@role@optMatrix_update_own') > -1 || roleNos.indexOf('S01') > -1"></Button>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="tableData" 
				:show-header="false" tooltip-effect="dark" border
                          highlight-current-row style="width: 100%" @row-click="toggleSelection" row-key="deviceinfo_id"
                         v-loading="tableLoading" >
                    <!-- <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column> -->
                    <!-- <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column> -->
                    <el-table-column prop="groupId"  align="left" show-overflow-tooltip width="200">
						<template slot-scope="scope">
                             <el-checkbox :indeterminate="scope.row.isIndeterminate" :disabled="isDisabled" v-model="scope.row.checkAll" @change="handleCheckAllChange">{{scope.row.actionGroups}}</el-checkbox>
                        </template>
					</el-table-column>
                    <el-table-column  align="left">
                        <template slot-scope="scope">
                            <el-checkbox-group v-model="scope.row.checkedArr" @change="handleCheckedCitiesChange">
								<el-checkbox v-for="item in scope.row.checkArr" :label="item.actionId" :disabled="isDisabled" :key="item.actionId">{{item.actionDesc}}</el-checkbox>
							</el-checkbox-group>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
		<Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	import {Loading} from 'element-ui';

	export default {
		name: 'HelloWorld',
		components: {
			Button,Toast
		},
		data() {
			return {
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				btn1Data:{
					iconL: require('../../assets/images/add.png'),
					iconLAct: require('../../assets/images/add.png')
                },//添加按钮
				btn2Data:{
					iconL: require('../../assets/images/edit.png'),
					iconLAct: require('../../assets/images/edit.png')
                },//修改按钮
				btn3Data:{
					iconL: require('../../assets/images/del.png'),
					iconLAct: require('../../assets/images/del.png')
                },//删除按钮
				buildingData: [],//角色列表数组
				switchBtn: true,//切换新增/保存按钮
				addBuild: false,//添加文本框是否显示
				addBuildModel: '',//添加文本model
				activeInputId: '',//选中input的id 存一下
				buildBtnTag: '',//楼宇按钮tag标示(新增修改删除分别为123)
				tableLoading: false,        //表格加载动画
				tableData:[],//角色组权限table列表
				rowData:{},//点击当前行.
				isDisabled:true,//是否可被点击
				btnTitle:false,//角色组权限编辑保存按钮
				normalVal:'',//修改点击取消设成默认值
				bIdx:'',//点击修改的当前index
				roleNo: '',//查询角色组权限参数
			}
		},
		methods: {
			formOutTest(value,funcName) {
				/**
				 * value:要验证的内容
				 * funcName:验证的方法名
				*/
				//验证内容
				let state = false;
				if (value) {
					state = this[funcName](value, '',1,1);
				} else {
					state = false;
				}
				return state; 
			},
			/**
			 *  @function: 楼宇添加按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			addClick(){
				setTimeout(function () {//必须设置延迟找dom
					$('.add-build-input input').focus();//设置光标便于输入
				})
				this.addBuildModel = '';//清空model
				this.addBuild = true;//新增楼宇
				this.switchBtn = false;//切换保存、取消按钮
				this.buildBtnTag = 1;//点击了新增按钮
			},
			/**
			 *  @function: 楼宇编辑按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			editClick(){
				this.buildBtnTag = 2;//点击了修改按钮
				// this.resizeInputWidth();//重定义input的宽度
				//获取当前选中的楼宇
				let actInput = $('.role-group-set .m-top .el-input.act');
				let actInputSibling = $('.role-group-set .m-top .el-input.act').parent().siblings();
				this.normalVal = $(actInput).find('input').val();
				// console.log("actInput:",actInput.length)
				if(actInput.length != 0) {//必须选中一个楼宇才能进行修改
					// this.activeInputId       //当前编辑项的id值
					// console.log(1122,this.activeInputId)
					if(!this.activeInputId){//全部选项，不能修改
						this.$message({
							showClose: true,
							message: "系统角色不可修改！",
							type: "warning",
							duration: this.msgDuration
						});
                    	return;
                    }
					$(actInput).find('input').removeAttr('readonly');
					actInput.addClass('edit');
					$(actInput).find('input').focus();
					setTimeout(()=>{
						$(actInput).find('input').val(this.normalVal)
					})
					this.switchBtn = false;//切换保存、取消按钮
					//将遮罩层层级换成2，当前编辑input层级换成3
					let shade = $('.role-group-set .m-top .content .shade-div');
					let groupBtn = $('.role-group-set .m-top .el-input.act').parent();
					shade.css('z-index',2);
					groupBtn.css('z-index',3);
					//设置光标位置始终在文本框最后
					let tObj = $(actInput).find('input')[0];
					let sPos = $(actInput).find('input').val().length;
					this.setCaretPosition(tObj, sPos);
				}else{
					this.$message({
						showClose: true,
						message: "请选择要修改的角色！",
						type: "warning",
						duration: this.msgDuration
					});
				}
			},
			/**
			 *  @function: 楼宇删除按钮
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			deleteClick(){
				let vThis = this;
				this.buildBtnTag = 3;//点击了删除按钮
				let actInput = $('.role-group-set .m-top .el-input.act');
				if(actInput.length != 0) {//必须选中一个楼宇才能进行删除
					if(!this.activeInputId){//全部选项，不能修改
						this.$message({
							showClose: true,
							message: "系统角色不可删除！",
							type: "warning",
							duration: this.msgDuration
						});
						return;
					}
					this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
					}).then(() => {//点击确定按钮进行的操作
						//删除角色接口
						this.$api.RoleAuthority.delRole({roleNo:this.roleNo}).then( res => {
							// console.log('删除角色:',res.data.data)
							if(res.data.code == 600 || res.data.code == 0){
								let buildIdArr = [];//取出数组中的id，用来查找下标进行删除操作
								$.each(this.buildingData, function (i, buildId) {
									buildIdArr.push(buildId.roleNo);
								})
								let index = buildIdArr.indexOf(this.activeInputId);
								if (index > -1) {//找到当前选中的下标并删除
									this.buildingData.splice(index, 1);
									this.$message({type: 'success', duration: '1000', message: '删除成功!'});//请求删除成功之后提示
								}
								$('.act').removeClass('act');
								// this.getTableList();
								$('.groupBtn').eq(0).find('.el-input').addClass('act')
								this.roleNo = this.buildingData[0].roleNo;
								this.getMatrixRole(this.roleNo)
							}else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						})
						
					}).catch(() => {//点击取消按钮
						this.$message({type: 'info', duration: '1000', message: '已取消删除'});
					});
				}else{
					this.$message({
						showClose: true,
						message: "请选择要删除的角色！",
						type: "warning",
						duration: this.msgDuration
					});
				}
			},
			/**
			 *  @function: 楼宇点击保存按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			saveClick(value,funcName){
				// console.log(123,value)
				if(this.buildBtnTag == 1){//点击了新增按钮
					if(this.addBuildModel){//添加楼宇的model，若不添加无法保存
						let state = this.formOutTest(value,funcName);
						// console.log(11,state)
						if(state){
							//新增角色接口
							// console.log(1,this.buildingData)
							for(let i = 0 ;i <this.buildingData.length;i++){
								if(this.buildingData[i].roleName == value){
									this.$message({
										showClose: true,
										message: "角色名称重复！",
										type: "warning",
										duration: this.msgDuration
									});
									return false
								}
							}
							let params = {
								"roleName": value
							}
							this.$api.RoleAuthority.addRole(params).then( res => {
							// console.log('新增角色：',res.data.data)
								if(res.data.code == 600 || res.data.code == 0){
									this.$message({
										showClose: true,
										message: "新增成功！",
										type: "success",
										duration: this.msgDuration
									});
									// let addC = { roleName: this.addBuildModel };
									// this.buildingData.push(addC);           //前台操作(省去刷新一步)不能省去刷新，因为无id的话无法进行编辑删除操作
									this.addBuild = false;//取消新增楼宇
									this.switchBtn = true;//切换新增、修改按钮
									this.resizeLayout();//重新获取宽高
									this.resizeInputWidth();//重定义input宽
									this.getRoleList();
									
									
									
									// setTimeout(() => {
									// 	this.roleNo = this.buildingData[this.buildingData.length-1].roleNo;
									// 	console.log(11,this.buildingData[this.buildingData.length-1].roleNo)
									// 	$('.act').removeClass('act');
									// 	$('.groupBtn').eq(this.buildingData.length-1).find('.el-input').addClass('act')
									// 	this.getMatrixRole(this.roleNo)
									// }, 100);

								}else {
									this.isToast = true;
									this.toast = res.data.msg;
								}
							})
						}else{
							// console.log(2,'验证不通过')
							return
						}
						
					}else{
						this.$message({
							showClose: true,
							message: "请输入角色名称！",
							type: "warning",
							duration: this.msgDuration
						});
						setTimeout(function () {//必须设置延迟找dom
							$('.add-build-input input').focus();//设置光标便于输入
						})
					}
				}else if(this.buildBtnTag == 2){//点击了修改按钮
					//将遮罩层层级换成0，当前编辑input层级换成1（请求成功之后）
					let actInput = $('.role-group-set .m-top .el-input.act');
					let actInputVal = $(actInput).find('input').val();//当前修改input的值
					let state = this.formOutTest(actInputVal,funcName);
					if(state){
						//修改角色接口
						let params = {
							"roleName": actInputVal,
							"roleNo": this.roleNo
						}
						this.$api.RoleAuthority.editRole(params).then( res => {
						// console.log('修改角色：',res.data.data)
							if(res.data.code == 600 || res.data.code == 0){
								let shade = $('.role-group-set .m-top .content .shade-div');
								let groupBtn = $('.role-group-set .m-top .el-input.act').parent();
								shade.css('z-index',0);
								groupBtn.css('z-index',1);
								//获取当前选中的楼宇
								$(actInput).find('input').attr('readOnly','true')
								actInput.removeClass('edit');
								this.switchBtn = true;//切换新增、修改按钮
								this.$message({
									showClose: true,
									message: "修改成功！",
									type: "success",
									duration: this.msgDuration
								});
							}else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						})
					}else{
						// console.log(2,'验证不通过')
						if(actInputVal){
							setTimeout(()=>{
								$(actInput).find('input').focus();//设置光标便于输入
							})
						}else{
							this.$message({
								showClose: true,
								message: "请输入角色名称！",
								type: "warning",
								duration: this.msgDuration
							});
							setTimeout(()=>{
								$(actInput).find('input').focus();//设置光标便于输入
							})
						}
						return
					}
					
				}
			},
			/**
			 *  @function: 取消保存楼宇
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			cancel(){
				this.addBuild = false;//取消新增楼宇
				this.switchBtn = true;//切换新增、修改按钮
				//获取当前选中的楼宇
				let actInput = $('.role-group-set .m-top .el-input.act');
				$(actInput).find('input').attr('readOnly','true')
				actInput.removeClass('edit');
				if(this.buildBtnTag == 2) {//点击了编辑按钮
					//将遮罩层层级换成0，当前编辑input层级换成1
					let shade = $('.role-group-set .m-top .content .shade-div');
					let groupBtn = $('.role-group-set .m-top .el-input.act').parent();
					shade.css('z-index',0);
					groupBtn.css('z-index',1);
					setTimeout(()=>{
						$(actInput).find('input').val(this.normalVal)
						this.resizeLayout();//重新获取宽高
						this.resizeInputWidth();//重定义input宽
						this.buildingData[this.bIdx].roleName = this.normalVal;
					})
				}
			},
			/**
			 *  @function: 点击楼宇按钮，切换数据
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			clickInput(item, even,bIdx){
				$(even.target).parent().addClass('act').parent().siblings().find('.el-input').removeClass('act');//添加act input样式
				this.activeInputId = '';
				if(!item.isSystem){
					this.activeInputId = item.roleNo;//存选中楼宇的id，用来做修改删除
				}
				this.roleNo = item.roleNo;
				this.getMatrixRole(this.roleNo);
				// console.log("this.activeInputId",item.roleNo,this.activeInputId)
				this.bIdx = bIdx;
			},
			
			
			/**
			 *  @function: 成员权限-表格操作
			 *  @author: wzx
			 *  @date 2018-7-18
			 **/
			addMember(){
				// console.log('新增成员')
				this.$router.push('/PermissionMember')
            },
			updateRights(){
				// console.log('修改权限')
            },
			updatePwd(){
				// console.log('修改密码')
            },
			deleteUser(){
				// console.log('删除用户')
            },
			/**
			 *  @function点击列表中某行的选中事件
			 *  @author: wzx
			 *  @date 2018-4-14
			 **/
			toggleSelection(row) {
				// console.log(666, row)
				this.rowData = row;
				// this.$refs.multipleTable.toggleRowSelection(row);
			},
			/**
			 *  @function: 重新获取宽高
			 *  @author: lxr
			 *  @date 2018-7-20
			 **/
			resizeLayout(){
				setTimeout( ()=> {
					let iH = $('.index').height();
					let imtH = $('.index .m-top').height();
					let imbH = $('.index .m-bom').height();
					let imcH = iH-imtH-imbH;
					$('.index .m-cen').height();
					let ictH = $('.index .center-top').height();
					let top = $('.role-group-set .m-top').height();
					let obH = $('.role-group-set .operate-box').height();
					let tblH = imcH - ictH - top  - obH - 45;
					// console.log(123,imcH,tblH)
					$('.role-group-set > .turn-bottom .table-box').height(tblH)
				},20)
			},
			/**
			 *  @function: input宽度自适应
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			resizeInputWidth(){
				//设置input的宽度
				let vThis = this;
				setTimeout(function () {//必须添加延迟，否则找不到该dom
					let actInput = $('.role-group-set .m-top .el-input input');
					$.each(actInput, function (i, input) {
						let inputValLenJson = vThis.inputValLength(input);
						input.size = inputValLenJson.numLen + inputValLenJson.enLen + (inputValLenJson.textLen);
						$(input).on('input propertychange', function () {
							let inputValLenJson2 = vThis.inputValLength(input);
							input.size = inputValLenJson2.numLen + inputValLenJson2.enLen + (inputValLenJson2.textLen);
						})
					})
				})
			},
			/**
			 *  @function: 获取input中文字、数字、英文的长度
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			inputValLength(input){
				let res = {
					numLen: 0,
					enLen: 0,
					textLen: 1
				}
				let re1=/\d/g;                  //数字
				let re2=/[a-zA-Z]/g;            //英文
				let re3=/[\u4e00-\u9fa5]/g;    //汉字
				if($(input).val().match(re1)!=null){
					res.numLen = ($(input).val().match(re1)).length;
				}
				if($(input).val().match(re2)!=null){
					res.enLen = ($(input).val().match(re2)).length;
				}
				if($(input).val().match(re3)!=null){
					res.textLen = Math.floor(($(input).val().match(re3)).length * 1.8);
				}
				return res
			},
			/**
			 *  @function: 设置光标始终在文本框最后
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			setCaretPosition(tObj, sPos){
				if(tObj.setSelectionRange){
					setTimeout(function(){
						tObj.setSelectionRange(sPos, sPos);
						tObj.focus();
					}, 0);
				}else if(tObj.createTextRange){
					let rng = tObj.createTextRange();
					rng.move('character', sPos);
					rng.select();
				}
			},
			/**
			 *  @function: 全选按钮
			 *  @author: cs
			 *  @date 2018-09-04
			 **/
			handleCheckAllChange(val) {
				let checkArr = [];
				this.rowData.checkArr.forEach(item => {
					// console.log(111,item)
						checkArr.push(item.actionId)
				});
				this.rowData.checkedArr = val ? checkArr : [];
				this.rowData.isIndeterminate = false;
			},
			/**
			 *  @function: 单选按钮
			 *  @author: cs
			 *  @date 2018-09-04
			 **/
			handleCheckedCitiesChange(value) {
					// console.log("value:",value)
					let checkedCount = value.length;
					this.rowData.checkAll = checkedCount === this.rowData.checkArr.length;
					this.rowData.isIndeterminate = checkedCount > 0 && checkedCount < this.rowData.checkArr.length;
			},
			/**
			 *  @function: 角色组权限编辑保存按钮
			 *  @author: cs
			 *  @date 2018-09-04
			 **/
			editBtnClick(){
				if(this.btnTitle){
					Loading.service();
					this.btnTitle = false;
					this.isDisabled = true;
					let listArr = [];
					this.tableData.forEach((item)=>{
						if(item.checkedArr.length>0){
							listArr.push(item.checkedArr.join(","))
							// listArr.push(...item.checkedArr)
						};
					});
					// console.log(11,[...listArr])
					listArr = listArr.join(",").split(',')
					// listArr = [...listArr];
					
					let params = {
						"actionIds": listArr,
						"roleNo": this.roleNo
					}
					this.$api.RoleAuthority.optMatrix(params).then( res => {
					//  console.log('角色资源授权：',res.data.data)
					 Loading.service().close();
						if(res.data.code == 600 || res.data.code == 0){
							let userId = localStorage.getItem('userId');
							this.$api.RoleAuthority.getUserActions({userId:userId}).then( res => {
								// console.log('权限id数组',res.data.data)
								if(res.data.code == 600 || res.data.code == 0){
									localStorage.setItem('roleActions',JSON.stringify(res.data.data))     //存储菜单权限
									this.$store.commit({
										type: 'SET_ROLEACTION_LIST',
										roleActions: localStorage.getItem('roleActions') ? JSON.parse(localStorage.getItem('roleActions')) : [],// 全局获取权限
									})
            						this.roleActions = this.$store.state.Common.roleActions;
									this.$message({
										showClose: true,
										message: "保存成功！",
										type: "success",
										duration: this.msgDuration
									});
								}else {
									this.isToast = true;
									this.toast = res.data.msg;
								}
							})
						}else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}else{
					// console.log('点击编辑按钮')
					this.btnTitle = true;
					this.isDisabled = false;
				}
			},
			/**
			 *  @function: 角色组权限table列表数组转换
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			transArr(data,checked){
				if(!Array.isArray(data)) return
				if(data.length == 0) return []
				let allArr = [];
				let length = data.length;
				for(let i = 0;i<length;i++){
					data[i].checkAll = false;
					data[i].isIndeterminate = false;
					data[i].checkArr = [];
					data[i].checkedArr = [];
					data[i].checkArr[0] = {
						actionDesc:data[i].actionDesc,
						actionId:data[i].actionId,
					}
					if(checked == 'checked'){
						data[i].checkedArr.push(data[i].actionId)
					}
					for(let j=i+1;j<length;j++){
						if(data[i].actionGroups == data[j].actionGroups){
							if(checked == 'checked'){
								data[i].checkedArr.push(data[j].actionId)
							}
							
							data[i].checkArr.push({
								actionDesc:data[j].actionDesc,
								actionId:data[j].actionId,
							})
							data.splice(j,1);
							length--;
							j--;
						}
					}
				}
				return data
			},
			
			/**
			 *  @function: 角色组权限获取table列表
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			getTableList(callback,roleNo){
				this.tableLoading = true;
				// let params = {
	            //     loginName:this.account,
	            //     pwd:this.encrypt(this.userPwd),
                //     type:"2"
			    // }
				this.$api.RoleAuthority.getAllRoleList().then( res => {
					this.tableLoading = false;
					//  console.log('角色组权限获取table列表',res.data.data)
					if(res.data.code == 600 || res.data.code == 0){
						 this.tableData = this.transArr(res.data.data)
						//  console.log("this.tableData:",this.tableData)
						 this.tableData.forEach(item => {
							if(item.checkedArr.length>0){
								item.isIndeterminate = true;
							}
						});
						if(callback){
							callback(roleNo)
						}
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
                })
			},
			/**
			 *  @function: 获取权限
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			getMatrixRole(roleNo){
				this.$api.RoleAuthority.getMatrixRole({roleNo:roleNo}).then( res => {
					// console.log('角色组权限获取选中状态列表',res.data.data)
					if(res.data.code == 600 || res.data.code == 0){
						if(res.data.data.length == 0) {
							for(let i = 0;i<this.tableData.length;i++){
								this.tableData[i].checkedArr = [];
								this.tableData[i].checkAll = false;
								this.tableData[i].isIndeterminate = false;
							}
							return
						};
						let checked = this.transArr(res.data.data,'checked');
						let length = checked.length;
						// console.log(checked[0],length)
						for(let i = 0;i<this.tableData.length;i++){
							this.tableData[i].checkedArr = [];
							for(let j = 0;j<length;j++){
								if(this.tableData[i].actionGroups == checked[j].actionGroups){
									this.tableData[i].checkedArr = checked[j].checkedArr;
									checked.splice(j,1);
									length--;
									j--;
								}
							}
							if(this.tableData[i].checkedArr.length == 0){
								//没有任何选中状态
								this.tableData[i].isIndeterminate = false;
								this.tableData[i].checkAll = false;
							}else if(this.tableData[i].checkedArr.length<this.tableData[i].checkArr.length){
								//有选中状态,左侧半选
								this.tableData[i].isIndeterminate = true;
								this.tableData[i].checkAll = false;
							}else if(this.tableData[i].checkedArr.length == this.tableData[i].checkArr.length){
								//全选
								this.tableData[i].isIndeterminate = false;
								this.tableData[i].checkAll = true;
							}
						}
						// console.log(111,this.tableData)
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 获取角色列表
			 *  @author: cs
			 *  @date 2018-09-11
			 **/
			getRoleList(){
				let deptId = 0;
				this.$api.RoleAuthority.getRoleList({deptId:deptId}).then( res => {
					// console.log('获取角色列表',res.data.data)
					if(res.data.code == 600 || res.data.code == 0){
						this.buildingData = res.data.data;
						this.resizeInputWidth();	//重定义input宽
						setTimeout(()=>{
							if($('.groupBtn') && !this.activeInputId && !this.roleNo && this.buildingData.length>0){//给第一个增加选中样式
								$('.groupBtn').eq(0).find('.el-input').addClass('act')
								this.roleNo = this.buildingData[0].roleNo;
								this.getTableList(this.getMatrixRole,this.roleNo);
							}
						})
					}else{
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: toast关闭
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			hideToast() {
				this.isToast = false;
			},
		},
		mounted() {
            this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
			this.getRoleList();
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .role-group-set {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .m-top{
            width:100%;
            height:auto;
            background:#fff;
            margin-bottom: 15px;
            .content{
                max-height: 7vh;
                /*max-height: 11.5vh;*/
                padding: 15px 2% 0;
                position: relative;
                overflow: auto;
                .groupBtn{
                    position: relative;
                    float: left;
                    display: inline-block;
                    margin-right: 10px;
                    margin-bottom: 15px;
                    z-index: 1;
                    .el-button{
                        &:hover{
                            color: #1b9a71;
                            border: 1px solid #1b9a71;
                        }
                        &:active{
                            color: #1b9a71;
                            border: 1px solid #1b9a71;
                        }
                    }
                    img{
                        width: 15px;
                        height: 15px;
                        position: absolute;
                        right: -7px;
                        top: -7px;
                    }
                }
                .shade-div{
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
                /deep/ .el-input{
                    &.act {
                        input{
                            background: #1cab7d;
                            color: #fff;
                        }
                    }
                    &.edit{
                        input{
                            background: transparent;
                            color: #333;
                        }
                    }
                }
            }
        }
        .turn-bottom{
            width:100%;
            height:auto;
            background:#fff;
            .operate-box{
                border: 0;
				position: relative;
				.button-div{
					position: absolute;
					bottom: 0;
					top: 0;
					right: 20px;
					margin: auto;
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
            .table-box{
				overflow: auto;
                /deep/ .el-table__fixed-right {
                    border-left: 1px solid #ebeef5;
                }
				/deep/ .el-table .cell, .el-table th div, .el-table--border td:first-child .cell, .el-table--border th:first-child .cell{
					padding-left: 30px !important;
					text-align: left !important;
				}
				/deep/ .is-disabled.is-checked, /deep/ .is-disabled.is-indeterminate{
					.el-checkbox__inner{
						background-color: #999 !important;
						border-color: #999 !important;
						&::after{
							border-color: #fff !important;
						}
					}
					.el-checkbox__label{
						color: #666 !important;
					}
				} 
            }
			.el-checkbox{
				// width: 20%;
				margin-left: 0;
				margin-right: 25px;
			}
        }
        .title{
            height: 5.5vh;
            line-height: 5.5vh;
            border-bottom: 1px solid #E4E4E4;
            padding:0 0 0 3%;
            font-weight: bold;
            font-size: 18px;
            .btns1, .btns2{
                display: inline-block;
                float: right;
                margin-right: 10px;
            }
            .button-div{
                /deep/ .button{
                    background: transparent;
                    border-color: transparent;
                    color: #333;
                    img{
                        width: 20px;
                        height: 20px;
                    }
                    &:hover{
                        background: #f9fffc;
                        border: 1px solid #1cab7d;
                    }
                    &:active{
                        background: transparent;
                    }
                }
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
    .op-box {
        display: flex;
        flex-direction: row;
        button {
            flex: 1;
        }
    }
</style>
