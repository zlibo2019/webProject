<template>
    <div class="role-member-set">
        <div class="turn-bottom">
            <div class="operate-box title">
                角色组成员设置
                <div class="btns1">
                    <Button title="添加成员" btnClass="custom7" :data="btn1Data" btnFontSize="12px"  @click="addMember"
                            :iconLeft="true" v-if="roleActions.indexOf('角色授权_@bepf@role@bindUser_update_own') > -1"></Button>
                	<div class="top-r">
                        <input type="text" placeholder="请输入用户编号或姓名" ref="searchRef" v-model="searchVal"
                               @keyup.13="searchClick(searchVal)">
                        <img src="../../assets/images/search.png" alt="搜索" @click="searchClick(searchVal)">
                    </div>
				</div>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="tableData" tooltip-effect="dark" border
                          highlight-current-row style="width: 100%"  row-key="deviceinfo_id"
						  v-loading="tableLoading"
                          @selection-change="handleSelectionChange" 
						  @filter-change="handleFilterChange">
                    <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column
                            width="180"
							prop="roleNos"
							column-key="roleNos"
							:filter-multiple="false"
							:label="roleGroupName.length>6?roleGroupName.substring(0,6)+'...':roleGroupName"
                            :filters="filtersData"
                            :filter-method="filterTag"
                            filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <span>{{ scope.row.roleNos }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="userNo" label="用户编号" align="center"
                                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userName" label="姓名" align="center"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column prop="ctDate" label="创建日期" align="center"
                                      show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userTel" label="联系电话" align="center"
                                     show-overflow-tooltip></el-table-column>
                    <el-table-column fixed="right" label="账号管理" width="290" align="center">
                        <template slot-scope="scope">
                            <div class="op-box">
                                <el-button class="normal" size="mini" plain @click="updateRights(scope.row)"
                                           v-if="roleActions.indexOf('角色授权_@bepf@role@bindUser_update_own') > -1">修改权限</el-button>
                                <el-button class="normal" size="mini" plain @click="updatePwd(scope.row)"
                                           v-if="roleActions.indexOf('档案管理_@bepf@userInfo@modify_update_own') > -1">修改密码</el-button>
								<el-button class="warning" size="mini" plain @click="deleteUser(scope.row)"
                                           v-if="userId != scope.row.userSerial && roleActions.indexOf('角色授权_@bepf@role@bindUser_update_own') > -1">删除</el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
				<el-pagination
						background
						layout="prev, pager, next"
						:page-size=pageSize
						:current-page.sync="currentPage"
						:total="pageAllNum"
						@current-change="pageChange">
				</el-pagination>
            </div>
            <el-dialog title="添加成员" :visible.sync="addRuleDialog" width="900px" center class="member-dialog">
                <div class="content">
                    <el-form ref="rightsForm" label-width="100px" :rules="rules" :model="rightsForm">
                        <el-form-item label="选择角色组：" prop="rule">
                            <el-select v-model="rightsForm.rule" placeholder="请选择角色组">
                                <el-option v-for="item in filtersData"  :key="item.roleNo" :label="item.roleName" :value="item.roleNo"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="指定成员：" prop="teacher">
							<el-select v-model="rightsForm.teacher" multiple filterable placeholder="请输入教师姓名搜索">
								<el-option
										v-for="item in teacherData"
										:key="item.userSerial"
										:label="item.userName"
										:value="item.userSerial">
									<span style="float: left">{{ item.userName }}</span>
									<span style="float: right; color: #8492a6; font-size: 13px">{{ item.className }}</span>
								</el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="授权权限：">
                             <div class="transfer-div">
                                 <div class="transfer-left">
                                     <h3 class="transfer-title">
                                         <span class="u-right">部门权限设置</span>
                                     </h3>
                                     <div class="transfer-main">
                                        <el-tree ref='departmentAddTree' :data="departmentTreeData" 
											show-checkbox node-key="id"
											default-expand-all
											@check="departmentCheck('add')">
                                        </el-tree>
                                     </div>
                                 </div>
                                 <div class="transfer-right">
                                     <h3 class="transfer-title">
                                         <span class="u-right">场所权限设置</span>
                                     </h3>
                                     <div class="transfer-main">
                                        <el-tree 
											ref='placeAddTree' 
											:data="placeTreeData" 
											:props="placeProps" 
											show-checkbox 
											node-key="placeId"
											default-expand-all
											@check="placeCheck('add')">
                                         </el-tree>
                                     </div>
                                 </div>
                             </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="addRuleDialog = false"></Button>
                    <Button title="保存并继续添加" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveMemberForm('rightsForm','again')"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveMemberForm('rightsForm')"></Button>
				</span>
            </el-dialog>
            <el-dialog title="修改权限" :visible.sync="editRuleDialog" width="900px" center class="edit-dialog">
                <div class="content">
                    <el-form ref="editForm" label-width="100px" :rules="rules" :model="editForm">
                        <el-form-item label="选择角色组：" prop="rule">
                            <el-select v-model="editForm.rule" placeholder="请选择角色组">
                                <el-option v-for="item in filtersData"  :key="item.roleNo" :label="item.roleName" :value="item.roleNo"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="授权权限：">
                             <div class="transfer-div">
                                 <div class="transfer-left">
                                     <h3 class="transfer-title">
                                         <span class="u-right">部门权限设置</span>
                                     </h3>
                                     <div class="transfer-main">
										<!-- :default-checked-keys='["1-1-1-2"]' -->
										<el-tree 
										ref='departmentChangeTree' 
										:data="departmentTreeData" 
										show-checkbox node-key="id"
										:default-checked-keys="departDefaultKeys"
										default-expand-all 
										@check="departmentCheck('change')">
										</el-tree>
                                     </div>
                                 </div>
                                 <div class="transfer-right">
                                     <h3 class="transfer-title">
                                         <span class="u-right">场所权限设置</span>
                                     </h3>
                                     <div class="transfer-main">
										<el-tree 
										ref='placeChangeTree' 
										:data="placeTreeData" 
										:props="placeProps" 
										show-checkbox 
										node-key="placeId"
										:default-checked-keys="placeDefaultKeys"
										default-expand-all 
										@check="placeCheck('change')">
										</el-tree>
                                     </div>
                                 </div>
                             </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="editRuleDialog = false"></Button>
                    <Button title="保存并继续添加" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                             @click="saveMemberForm('editForm','again')"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveMemberForm('editForm')"></Button>
				</span>
            </el-dialog>
            <el-dialog title="修改密码" :visible.sync="editPwdDialog" width="" center class="edit-pwd-dialog">
                <div class="content">
                    <el-form ref="pwdForm" label-width="100px" :rules="rules" :model="pwdForm">
                        <el-form-item label="输入旧密码：" prop="oldPwd">
                            <el-input size="small" v-model="pwdForm.oldPwd" style="width:260px"></el-input>
                        </el-form-item>
                        <el-form-item label="输入新密码：" prop="newPwd">
                            <el-input size="small" v-model="pwdForm.newPwd" style="width:260px"></el-input>
                        </el-form-item>
                        <el-form-item label="确认新密码：" prop="newPwd2">
                            <el-input size="small" v-model="pwdForm.newPwd2" style="width:260px"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="editPwdDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="savePwd"></Button>
                    <Button title="重置" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="resetForm('pwdForm')"></Button>
				</span>
            </el-dialog>
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
			Button, Toast
		},
		data() {
			let validateInputOldPwd = (rule, value, callback) => {   
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					this.checkPwdNumLetter(value, callback);
					callback()
				}
			};
			let validateInputNewPwd = (rule, value, callback) => {   
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					if(this.pwdForm.oldPwd){
						if(this.checkPwdNumLetter(value, callback)){
							if(this.pwdForm.oldPwd == value){
								callback(new Error('新密码与旧密码一致'));
							}
						}else{
							this.checkPwdNumLetter(value, callback)
							callback()
						}
					}else{
						this.checkPwdNumLetter(value, callback)
						callback()
					}

					if(this.pwdForm.newPwd2){
						if(this.checkPwdNumLetter(value, callback)){
							if(value != this.pwdForm.newPwd2){
								callback(new Error('新密码与确认密码不一致'));
							}else{
								this.$refs.pwdForm.clearValidate(['newPwd2'])
								callback()
							}
						}else{
							this.checkPwdNumLetter(value, callback)
							callback()
						}
					}else{
						this.checkPwdNumLetter(value, callback)
						callback()
					}
				}
			};
			let validateInputNewPwd2 = (rule, value, callback) => { 
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					if(this.pwdForm.newPwd){
						if(this.checkPwdNumLetter(value, callback)){
							if(this.pwdForm.newPwd != this.pwdForm.newPwd2){
								callback(new Error('新密码与确认密码不一致'));
							}else{
								this.$refs.pwdForm.clearValidate(['newPwd'])
								callback();
							}
						}else{
							this.checkPwdNumLetter(value, callback)
							callback()
						}
					}else{
						this.checkPwdNumLetter(value, callback)
						callback()
					}
				}
			};
			return {
				tableLoading: false,        //表格加载动画
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
				roleGroupName: '',//筛选标题，默认显示全部角色组
				tableData:[],
				filtersData: [],            //筛选内容
				spanArr: [],                 //跨行数据
				addRuleDialog: false,      //规则授权弹窗
				editRuleDialog: false,     //修改授权弹窗
				editPwdDialog: false,     //修改密码弹窗
				rightsForm: {   //添加通道form
					rule: '',
					device_name: '',
					device_IP: '',
					device_settings: '',
					device_bind: '',
					account: '',
					pwd: '',
					teacher: '',
				},
				editForm: {   //修改授权form
					rule: '',
					device_name: '',
					device_IP: '',
					device_settings: '',
					device_bind: '',
					account: '',
					pwd: '',
					teacher: '',
				},
				pwdForm: {   //修改密码form
					oldPwd: '',
					newPwd: '',
					newPwd2: '',
				},
				fromData: [],// 穿梭框 - 源数据 - 树形
				departmentTreeData:[],//部门权限树
				departCheckedKeys:[],//部门权限树选中id
				departDefaultKeys:[], //部门权限树默认选中id
				placeTreeData:[],//场所权限树
				placeProps: {
					children: 'children',
					label: 'placeName',
					id:'placeId'
				},
				placeCheckedKeys:[],//场所权限树选中id
				placeDefaultKeys:[],//场所权限树默认选中id
				filtersData: [],//规则授权数组
				teacherData: [],//指定成员数组
				rules:{
					oldPwd:[
						{required: true, validator: validateInputOldPwd,trigger: 'blur' }
					],
					newPwd:[
						{required: true, validator: validateInputNewPwd,trigger: 'blur' }
					],
					newPwd2:[
						{required: true, validator: validateInputNewPwd2,trigger: 'blur' }
					],
					rule:[
						{required: true, message: '请选择角色组', trigger: 'change'}
					],
					teacher:[
						{required: true, message: '请选择成员', trigger: 'change'}
					],
				},
				classManageType:'',//部门权限是否全选 3:全选 新增修改传1
				placeManageType:'',//部门权限是否全选 3:全选 新增修改传1
				pageAllNum: 0,                  //table数组总条数
				pageSize: 20,//每页显示条数
				currentPage: 1,//当前页
				schoolId:localStorage.getItem('schoolId'),//学校id
				userId:localStorage.getItem('userId'),//用户id
				userSerial:'',//修改密码使用 用户id
				searchVal:'',//模糊查询
			}
		},
		methods: {
			/**
			 *  @function: toast关闭
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			hideToast() {
				this.isToast = false;
			},
			
			/**
			 *  @function: 成员权限-表格操作
			 *  @author: wzx
			 *  @date 2018-7-18
			 **/
			addMember(){
				// console.log('新增成员')
				this.rightsForm = {
					rule : '',
					teacher : ''
				}
				this.userSerial = localStorage.getItem('userId');
				this.rightsForm.rule = this.roleNo;
				this.getList('rightsForm','addRuleDialog');
				// console.log(6666666,this.userSerial)
				// this.addRuleDialog = true;
            },
			updateRights(row){
				// console.log('修改权限',row,this.filtersData)
				this.editForm.rule = '';
				this.editForm.rule = this.roleNo;
				this.userSerial = row.userSerial;
				this.getList('editForm','editRuleDialog');
				// this.editRuleDialog = true;
				// this.$refs["editForm"].resetFields();
            },
			updatePwd(row){
				// console.log('修改密码',row.userSerial)
				this.userSerial = row.userSerial
				this.editPwdDialog = true;
				this.pwdForm = {   
					oldPwd: '',
					newPwd: '',
					newPwd2: ''
				},
				setTimeout(()=>{
	                this.$refs["pwdForm"].resetFields();
                })
            },
			deleteUser(row){
				// console.log('删除用户',row)
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					Loading.service();
					let params = {
						"roleNo": this.roleNo,
						"userId": row.userSerial
					}
					this.$api.RoleAuthority.unbindUser(params).then( res => {
						// console.log('删除用户:',res.data.data)
						Loading.service().close();
						if(res.data.code == 600 || res.data.code == 0){
							this.getTableList(this.roleNo);
							this.$message({type: 'success', duration: this.msgDuration, message: '删除成功!'});//请求删除成功之后提示
						}else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
					
					
				}).catch(() => {//点击取消按钮
					this.$message({type: 'info', duration: this.msgDuration, message: '已取消删除'});
				});
            },
			filterTag(value, row, column) {
				// console.log(111,value,row)
				return  row.roleNos = value;//筛选标题
			},
			/**
			 *  @function: 保存角色接口
			 *  @author: cs
			 *  @date 2018-09-14
			 **/
			saveAjax(dialog,again,userList,formName) {
				// console.log(22,userList)
				let params = {
					"classManageType": this.classManageType,
					"classSelected": this.departCheckedKeys,
					"placeManageType": this.placeManageType,
					"placeSelected": this.placeCheckedKeys,
					"roleNo": this[formName].rule,
					"userList": userList,
				}
				this.$api.RoleAuthority.optManageInfoToUserList(params).then( res => {
					console.log('保存角色接口:', res.data.data)
					Loading.service().close();
					if (res.data.code == 600 || res.data.code == 0) {
						if(!again){
							this[dialog] = false;
						}
						if(formName == 'rightsForm' && again != ''){
							this.classManageType = 1;
							this.placeManageType = 1;
							this.rightsForm.teacher = [];
							this.departCheckedKeys = [];
							this.placeCheckedKeys = [];
							this.$refs.departmentAddTree.setCheckedKeys([]);//清空tree选择
							this.$refs.placeAddTree.setCheckedKeys([]);//清空tree选择
							this.$refs['rightsForm'].resetFields(['teacher']);
							// console.log(11111,this.rightsForm.teacher ,'---',this.departDefaultKeys,'-----',this.placeDefaultKeys)	
						}
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: 'success', 
							duration: this.msgDuration
						})
						this.getTableList(this.roleNo)
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    Loading.service().close();
                })
			},
			/**
			 *  @function: 保存按钮
			 *  @author: lxr
			 *  @date 2018-7-24
			 **/
			saveMemberForm(formName,again) {
				// console.log(11,formName,again)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						Loading.service();
						if(formName == 'rightsForm'){
							if(!again){
								this.addRuleDialog = false;
								// console.log('新增保存按钮')
								this.saveAjax('addRuleDialog','',this.rightsForm.teacher,'rightsForm');
								return
							}
							// console.log('新增保存继续添加按钮')
							this.saveAjax('addRuleDialog','again',this.rightsForm.teacher,'rightsForm');
							
						}else if(formName == 'editForm'){
							if(!again){
								// console.log('修改保存按钮')
								this.saveAjax('editRuleDialog','',[this.userSerial],'editForm');
								return
							}
							this.saveAjax('editRuleDialog','again',[this.userSerial],'editForm');
							// console.log('修改保存继续添加按钮')
						}
					} else {
						// console.log('error submit!!');
						this.$message({
							showClose: true,
							message: '请输入内容（*为必填项）！',
							type: 'error', duration: this.msgDuration
						})
					}
				});
				
				
			},
			/**
			 *  @function: 部门权限选择
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			departmentCheck(status){
				// console.log('部门选择树')
                let nodes = [];
                this.departCheckedKeys = [];
				if(status == 'add'){
                    // this.departCheckedKeys = this.$refs["departmentAddTree"].getCheckedKeys();
                    nodes = this.$refs["departmentAddTree"].getCheckedNodes(true);
                    // this.departCheckedKeys =  nodes.map((item)=>{
                    //     if(item.isLeaf == 1){
                    //         return item.id
                    //     }
                    // })
                    for (let i = 0; i < nodes.length; i++) {
                        if(nodes[i].isLeaf == 1){
                            this.departCheckedKeys.push(nodes[i].id)
                        }
                    }
				}else if(status == 'change'){
					// this.departCheckedKeys = this.$refs["departmentChangeTree"].getCheckedKeys();
                    nodes = this.$refs["departmentChangeTree"].getCheckedNodes(true);
                    for (let i = 0; i < nodes.length; i++) {
                        if(nodes[i].isLeaf == 1){
                            this.departCheckedKeys.push(nodes[i].id)
                        }
                    }
				}
				//判断是否全选
				if(this.departCheckedKeys.includes(this.departmentTreeData[0].id)){
					this.classManageType = 3;
				}else{
					this.classManageType = 1;
				}
				console.log("部门 keys:",this.departCheckedKeys);
            },
			/**
			 *  @function: 场所权限选择
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			placeCheck(status){
				// console.log('场所选择树')
                let nodes = [];
                this.placeCheckedKeys = [];
				if(status == 'add'){
					// this.placeCheckedKeys = this.$refs["placeAddTree"].getCheckedKeys();
                    nodes = this.$refs["placeAddTree"].getCheckedNodes(true);
                    for (let i = 0; i < nodes.length; i++) {
                        if(nodes[i].isLeaf == 1){
                            this.placeCheckedKeys.push(nodes[i].placeId)
                        }
                    }
				}else if(status == 'change'){
                    // this.placeCheckedKeys = this.$refs["placeChangeTree"].getCheckedKeys();
                    nodes = this.$refs["placeChangeTree"].getCheckedNodes(true);
                    for (let i = 0; i < nodes.length; i++) {
                        if(nodes[i].isLeaf == 1){
                            this.placeCheckedKeys.push(nodes[i].placeId)
                        }
                    }
				}
				//判断是否全选
				if(this.placeCheckedKeys.includes(this.placeTreeData[0].placeId)){
					this.placeManageType = 3;
				}else{
					this.placeManageType = 1;
				}
				console.log("场所 Keys:",this.placeCheckedKeys,nodes)
            },
			/**
			 *  @function: 修改密码-重置方法
			 *  @author: lxr
			 *  @date 2018-7-25
			 **/
			resetForm(formName) {
				this.$refs[formName].resetFields();
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
			 *  @function设置每页显示数据条数的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.pageSize = val;
				this.currentPage = 1;
				this.changePage(this.pageSize,this.currentPage);
			},
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.changePage(this.pageSize,this.currentPage);
			},
			/**
			 *  @function: 加载角色数据
			 *  @author: lxr
			 *  @date 2018-7-21
			 **/
			loadRoleData(){
				let vThis = this;
				let roleGroup = [];
				let r,arr = ['apple', 'strawberry', 'banana', 'pear', 'apple', 'orange', 'orange', 'strawberry'];
				$.each(vThis.tableData, function (a,b) {      //添加序号，切换页面序号连增
					vThis.$set(vThis.tableData[a],'indexID',(vThis.currentPage - 1) * vThis.pageSize + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
					roleGroup.push(b.roleGroup);//找出角色组部分
				})
				// r = roleGroup.filter(function(element,index,self){
				// 	return self.indexOf(element) == index;     //indexOf只返回元素在数组中第一次出现的位置，如果与元素位置不一致，说明该元素在前面已经出现过，是重复元素
				// })
				// let filter = [];
				// $.each(r, function (j, c) {
				// 	let aa = {}
				// 	aa.text = c;
				// 	aa.value = c;
				// 	filter[j] = aa
				// })
				// this.filtersData = filter;//设置过滤数据
			},
			/**
			 *  @function: 查看用户可管理的班级与场所
			 *  @author: cs
			 *  @date 2018-09-05
			 **/
			getList(formName,dialog){
				this.$api.RoleAuthority.manageInfoByUser({
					schoolId:this.schoolId,
					userId:this.userSerial
				}).then( res => {
					console.log('查看用户可管理的班级与场所',res.data.data)
					if(res.data.code == 600 || res.data.code == 0){
						this.placeTreeData = res.data.data.placeList;
						this.departmentTreeData = res.data.data.classList;
						//部门权限是否全选
						if(formName == "rightsForm"){
							this[dialog] = true;
							this.classManageType = 1;
							this.placeManageType = 1;
							setTimeout(()=>{
								this.$refs[formName].resetFields();
								this.$refs.departmentAddTree.setCheckedKeys([]);//清空tree选择
								this.$refs.placeAddTree.setCheckedKeys([]);//清空tree选择
							})
						}else if(formName == "editForm"){
							this[dialog] = true;
							this.classManageType = res.data.data.classManageType;
							this.placeManageType = res.data.data.placeManageType;
							if(this.classManageType == 3 && this.departmentTreeData.length>0){
								this.departDefaultKeys = [this.departmentTreeData[0].id]
							}else{
								this.departDefaultKeys  = res.data.data.classSelected;
							}
							this.departCheckedKeys = this.departDefaultKeys;
							console.log(this.departCheckedKeys,this.departDefaultKeys);
							
							//场所权限是否全选
							if(this.placeManageType == 3 && this.placeTreeData.length>0){
								this.placeDefaultKeys = [this.placeTreeData[0].placeId]
							}else{
								this.placeDefaultKeys = res.data.data.placeSelected;
							}
							this.placeCheckedKeys = this.placeDefaultKeys;
							setTimeout(()=>{
								this.$refs[formName].resetFields();
								this.$refs.departmentChangeTree.setCheckedKeys(this.departDefaultKeys);//设置tree选中
								this.$refs.placeChangeTree.setCheckedKeys(this.placeDefaultKeys);//设置tree选中
							})
						}
						
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 获取角色组成员设置列表
			 *  @author: cs
			 *  @date 2018-09-13
			 **/
			getTableList(roleNo){
				this.tableLoading = true;
				let params = {
					"count": true,
					"page_index": this.currentPage,
					"page_size": this.pageSize,
					"search": {
						"userNameLike": this.searchVal,
						"roleNo": roleNo
					}
				}
				this.$api.RoleAuthority.getUserList(params).then( res => {
					this.tableLoading = false;
					// console.log('获取角色组成员设置列表:',res.data.data)
					if(res.data.code == 600 || res.data.code == 0){
						this.tableData = res.data.data.records;
						this.pageAllNum = res.data.data.total_record;
						// this.tableData = res.data.data;
						this.loadRoleData();
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
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
						this.filtersData = res.data.data;
						this.filtersData.forEach(item=>{
							item.text=item.roleName;
							item.value=item.roleName;
						});
						// console.log("filtersData:",this.filtersData)
						if(this.filtersData.length>0){
							this.roleNo = this.filtersData[0].roleNo;
							// this.currentPage = 1;
							this.getTableList(this.roleNo);
							this.roleGroupName = this.filtersData[0].text;
						}
					
					}else{
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: table列表筛选单选
			 *  @author: cs
			 *  @date 2018-09-13
			 **/
			handleFilterChange(filters){
				// console.log(22,filters.roleNos,this.filtersData)
				for(let i = 0 ; i <this.filtersData.length;i++){
					if(filters.roleNos == this.filtersData[i].roleName){
						this.roleGroupName = this.filtersData[i].text;
						this.roleNo = this.filtersData[i].roleNo;
						this.currentPage = 1;
						this.getTableList(this.roleNo);
						break
					}
				}
			},
			/**
			 *  @function: 获取指定成员
			 *  @author: cs
			 *  @date 2018-09-13
			 **/
			getPeopleList(){
				this.$api.RoleAuthority.getTeacherListAll({schoolId:this.schoolId}).then( res => {
					// console.log('获取指定成员', res.data.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.teacherData = res.data.data;
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 修改密码点击保存按钮
			 *  @author: cs
			 *  @date 2018-09-14
			 **/
			savePwd(){
				this.$refs["pwdForm"].validate((valid) => {
					if (valid) {
						Loading.service();
						let params = {
							"oldPass": this.encrypt(this.pwdForm.oldPwd),
							"newPass": this.encrypt(this.pwdForm.newPwd),
							"userId": this.userSerial
						}
						// console.log('mima:',params)
						this.$api.RoleAuthority.modifyPwd(params).then( res => {
							// console.log('修改密码', res.data.data)
							Loading.service().close();
							if (res.data.code == 600 || res.data.code == 0) {
								this.$message({
									showClose: true,
									message: "修改成功",
									type: 'success', 
									duration: this.msgDuration
								})
								this.editPwdDialog = false;
							}else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						}).catch(err =>{
							Loading.service().close();
						})
						// this.addDialog = false;
					} else {
						this.$message({
							showClose: true,
							message: '输入内容有误，请重新输入！',
							type: 'error', duration: this.msgDuration
						})
					}
				});
			},
			/**
			 *  @function: 上方搜索
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			searchClick(value) {
				// console.log(value)
				this.currentPage = 1;
				this.getTableList(this.roleNo);
			},
			/**
			 *  @function: 当前页
			 *  @author: cs
			 *  @date 2018-08-02
			 **/
			pageChange(val) {
				// console.log("pageChange", val)
				this.currentPage = val;
				this.getTableList(this.roleNo);
			},
		},
		mounted() {
            //权限id数组
            console.log(11,this.roleActions);
            this.roleActions = this.$store.state.Common.roleActions;
			setTimeout( ()=> {
				let icH = $('.index > .m-cen').height();
				let stH = $('.index .advanced-settings .center-top').height();
				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - stH - obH - pbH - 10;
				$('.role-member-set > .turn-bottom .table-box').height(tblH)
			},20)
			this.getRoleList();
			this.getPeopleList();
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>

    .role-member-set {
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
                /deep/ .is-leaf:not(.is-center){
                    padding: 0 10px;
					.cell{
                        line-height: 35px;
                        border: 1px solid #e1e1e1;
                        background: #fff;
                        border-radius: 5px;
                        .el-table__column-filter-trigger{
                            float: right;
                        }
                    }
                }
            }
            /deep/ .el-form-item{
                margin-bottom: 24px  !important;
				padding-bottom: 0px !important;
				.el-select{
					width: 266px;
				}
				&:nth-of-type(1){
					.el-form-item__content{
						height: 45px;
					}
				}
				&:nth-of-type(2){
					.el-form-item__content{
						min-width: 200px !important;
						max-width: 592px !important;
						min-height: 45px;
					}
					.el-select__tags{
						max-height: 85px ;
						overflow-y: auto;
					}
				}
            }
            .member-dialog{
                /deep/ .el-dialog{
                    margin-top: 8vh !important;
                    .el-table th{
                        font-size: 12px;
                        height: 40px;
                    }
					.el-select__input{
						display: inline !important;
						border: none !important;
					}
					.el-form{
						text-align: left;
					}
				}
                .button-div{
                    margin-right: 20px;
                    margin-top: 11px;
				}
			}
			
            .transfer-div {
                position: relative;
                height: 33vh;
                overflow: hidden;
                margin-right: 10%;
                .transfer-left {
                    position: absolute;
                    top: 0;
                    left: 0;
                }

                .transfer-right {
                    position: absolute;
                    top: 0;
                    right: 0;
                }

                .transfer-main {
                    padding: 10px;
                    height: calc(100% - 41px);
                    box-sizing: border-box;
                    overflow: auto;
                }
                .transfer-title {
                    border-bottom: 1px solid #e1e1e1;
                    padding: 0 30px;
                    height: 40px;
                    line-height: 40px;
                    color: #333;
                    font-size: 16px;
                    background-color: #F6F8FA;
                    font-weight: normal;
                }

                .transfer-left,
                .transfer-right {
                    border: 1px solid #e1e1e1;
                    width: 45%;
                    height: 100%;
                    box-sizing: border-box;
                    vertical-align: middle;
                }
            }
			.edit-pwd-dialog{
				.el-form-item{
					margin-bottom: 18px !important
				}
			}
        }
        .title{
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid #E4E4E4;
            padding:0 0 0 3%;
            font-weight: bold;
            font-size: 18px;
            .btns1, .btns2{
                display: inline-block;
                float: right;
                margin-right: 10px;
				position: relative;
				.top-r {
					width: 200px;
					float: right;
					height: 100%;
					margin-left: 20px;
					input {
						border: 1px solid #e1e1e1;
						outline: none;
						height: 30px;
						line-height: 30px;
						color: #999;
						padding: 0 20px;
						width: 200px;
						border-radius: 5px;
						font-size: 13px;
						&:focus {
							border: 1px solid #1cab7d;
							outline: none;
						}
					}
					img {
						position: absolute;
						top: 0;
						bottom: 0;
						right: 15px;
						margin: auto;
						width: 17px;
						cursor: pointer;
					}
				}
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
</style>
