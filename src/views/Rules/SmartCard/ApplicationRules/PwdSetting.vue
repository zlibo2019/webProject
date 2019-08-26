<template>
	<el-container class="pwd-set-container" v-loading.lock="loadingFull">
		
		<el-main>
			<el-form :model="toolForm" :rules="rules" ref="toolForm" label-width="85px">
			
			<el-container>
				<el-header>
					<el-form-item label="选择班牌：" prop="name">
						<SelectTree 
							v-model="toolForm.name"
							:options="treeData" 
							:props="defaultProps"
                            placeholder="请选择修改密码的班牌"
                            size='medium'
							width="100%"></SelectTree>
					</el-form-item>
				</el-header>
				<el-main>
					 <el-tabs v-model="active" type="card" @tab-click="clickTabs">
						<el-tab-pane label="修改新密码" name="first">
							<el-form-item label="新密码：" prop="pwd" v-if="active == 'first'">
								<el-input v-model="toolForm.pwd" placeholder="最小长度为4个字符"></el-input>
							</el-form-item>
							<el-form-item label="确认密码：" prop="pwd2" v-if="active == 'first'">
								<el-input v-model="toolForm.pwd2" placeholder="最小长度为4个字符"></el-input>
							</el-form-item>
							<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="33px"
									@click="resetForm('toolForm')"></Button>
							<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="33px"
									@click="saveNewPassword('toolForm', 1)"></Button>
						</el-tab-pane>
						<el-tab-pane label="一键重置密码" name="second">
							<el-container>
								<el-main>
									<p>班牌的登录密码将被重置为：</p>
									<span>0000</span>
								</el-main>
								<el-footer>
									<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="33px"
											@click="resetForm('toolForm')"></Button>
									<Button title="确定" btnClass="custom8" btnFontSize="12px" btnHeight="33px"
											@click="saveNewPassword('toolForm', 2)"></Button>
								</el-footer>
							</el-container>
						</el-tab-pane>
					</el-tabs>
					
				</el-main>
			</el-container>
		</el-form>
		</el-main>
	</el-container>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	import SelectTree from '@/components/SelectTree/SelectTree'
    import {Loading} from 'element-ui';
	export default {
		name: 'PwdSetting',
		components: {
			Button,Toast, SelectTree
		},
		data() {
			var validatePass = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入密码'));
				} else {
				if (this.toolForm.pwd2 !== '') {
					this.$refs.toolForm.validateField('pwd2');
				}
					callback();
				}
			};
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.toolForm.pwd) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				isToast:false,
				toast:'',
				toolForm: {					// form model
					name: [],
					pwd: '',
					pwd2: '',
				},
				rules: {
					name: [
						{ required: true, type: 'array', message: '请选择班牌', trigger: 'change' }
					],
					pwd: [
						{ required: true, validator: validatePass, trigger: 'change' },
						{ min: 4, message: '最小长度为4个字符', trigger: 'change' }
					],
					pwd2: [
						{ required: true, validator: validatePass2, trigger: 'change' }
					],
				},
				active: 'first',			// tabs 默认选中
				treeData: [{
					"id": 1000,
					"pid": 101,
					"label": "烟台一中",
					"group": 102,
					"isLeaf": 0,
					"isSystem": 0,
					"children": [{
						"id": 10000,
						"pid": 1000,
						"label": "初中校区",
						"group": 103,
						"isLeaf": 0,
						"isSystem": 1,
						"children": [
							{
							"id": 10010,
							"pid": 10000,
							"label": "校门口",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 1,
							"children": []
						}, {
							"id": 10011,
							"pid": 10000,
							"label": "传达室",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 1,
							"children": []
						}, {
							"id": 10012,
							"pid": 10000,
							"label": "教学楼",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 1,
							"children": []
						}]
					},{
						"id": 10001,
						"pid": 1000,
						"label": "高中校区",
						"group": 103,
						"isLeaf": 0,
						"isSystem": 0,
						"children": [
							{
							"id": 10020,
							"pid": 10001,
							"label": "校门口",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 0,
							"children": []
						}, {
							"id": 10021,
							"pid": 10001,
							"label": "传达室",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 0,
							"children": []
						}, {
							"id": 10022,
							"pid": 10001,
							"label": "教学楼",
							"group": 104,
							"isLeaf": 1,
							"isSystem": 0,
							"children": []
						}]
					}]
                }],
                defaultProps: {
					parent_id: 'pid',   	// 父级唯一标识
					id: 'id',          		// 唯一标识
					label: 'label',       	// 标签显示
					children: 'children', 	// 子级
				},
				loadingFull: false,			// loading
			}
		},
		methods: {
			// 点击标签页切换
			clickTabs(tab, event){
				console.log(tab, event);
			},
			// 保存新密码
			saveNewPassword(formName, tab){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.loadingFull = true;
						if(tab == 1){// 修改新密码
							// 成功后
							this.loadingFull = false;
							this.resetForm(formName);
						}else if(tab == 2){// 重置密码

						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			// toast弹窗隐藏
			hideToast() {
				this.isToast = false;
			},
		},
		mounted() {
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .pwd-set-container, .el-container {
        height: 100%;
        background: #fff;
		-webkit-justify-content: center;
		-moz-justify-content: center;
		-ms-justify-content: center;
		-o-justify-content: center;
		justify-content: center;
		> .el-main{
			text-align: center;
			display: inline-block;
			overflow: auto;
		}
        .el-form{
			text-align: left;
			display: inline-block;
			padding-top: 5vh;
			.el-header{
				padding: 0;
				height: auto !important;
				/deep/ .el-form-item__content{
					line-height: 1;
				}
			}
			.el-main{
				padding: 0;
				overflow: hidden;
				/deep/ .el-tabs{
					.el-tabs__item{
						width: 240px;
						text-align: center;
						font-size: 12px;
						color: #606266;
						&.is-active{
							color: #1cab7d;
						}
					}
					.el-tabs__header{
						margin: 0;
					}
					.el-tabs__content{
						height: 260px;
						padding: 35px 0 0px;
						border: 1px solid #e4e7ed;
						border-top: none;
						text-align: center;
						.el-tab-pane{
							width: 300px;
								height: 100%;
							display: inline-block;
							/deep/ .button-div{
								margin-top: 10px;
								margin-right: 20px;
								button{
									border-radius: 4px;
									padding: 0 30px;
								}
							}
							.el-main{
								padding: 20px 0;
								p{
									font-size: 12px;
									margin-bottom: 10px;
								}
								span{
									font-weight: bold;
									font-size: 20px;
								}
							}
							.el-footer{
								height: 83px !important;
							}
						}
					}
				}
			}
        }
    }
</style>
