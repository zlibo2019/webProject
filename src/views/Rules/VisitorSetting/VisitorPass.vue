<template>
    <div class="visitor-pass">
        <el-container class="m-cen">
            <el-header class="title">
                访客通行证
                <div class="btns1">
                    <Button title="添加" btnClass="custom7" :data="btn1Data" btnFontSize="12px" 
                            @click="addPermit"
                            :iconLeft="true"
							v-if="roleActions.indexOf('访客通行证_@bepf@visitor@cycleSave_create_own') > -1"></Button>
                </div>
            </el-header>
            <el-main class="content">
                <el-table id="table" ref="aisleTable" height="100%" :data="permitData" tooltip-effect="dark" border
                          highlight-current-row style="width: 100%" row-key="deviceinfo_id" v-loading="tableLoading"
                          @filter-change="handleFilterChange">
                    <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>
                    <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="visitorName" label="通行人姓名" align="center" min-width="100"
                                     column-key="visitorName" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="identityNo" label="身份证号" align="center" min-width="100"
                                     column-key="identityNo" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visitorTel" label="手机号" align="center"
                                     column-key="visitorTel" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visitorCompany" label="工作单位" align="center" min-width="100"
                                     column-key="visitorCompany" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visitorReason" label="通行事由" align="center" min-width="100"
                                     column-key="visitorReason" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dayCount" label="每日通行限次" align="center" min-width="120"
                                     column-key="dayCount" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="visitorBegin" label="开始日期" align="center" min-width="100"
                                     column-key="visitorBegin" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.visitorBegin">{{ scope.row.visitorBegin.substring(0,10) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="visitorEnd" label="结束日期" align="center" min-width="100"
                                     column-key="visitorEnd" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.visitorEnd">{{ scope.row.visitorEnd.substring(0,10) }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cycleState" label="全部状态" column-key="cycleState" min-width="150"
                                     :filters=filtersData :filter-method="filterTag" :filter-multiple="false"
                                     filter-placement="bottom-end" :formatter="columFormat"></el-table-column>
                    <el-table-column fixed="right" label="操作" width="160" align="center">
                        <template slot-scope="scope">
                            <el-button class="normal" size="mini" plain @click="rowUpdate(scope.row)"
							v-if="roleActions.indexOf('访客通行证_@bepf@visitor@cycleSave_create_own') > -1">修改</el-button>
                            <el-button class="warning" size="mini" plain @click="rowDelete(scope.row)"
							v-if="roleActions.indexOf('访客通行证_@bepf@visitor@cycleDelete_delete_own') > -1">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <el-footer class="pagination-box">
                <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
            </el-footer>
            <el-dialog title="访客通行证" :visible.sync="addPermitDialog" width="880px" center class="sch-system-dialog">
                <div class="content">
                    <el-form ref="addPermitForm" label-width="100px" :model="addPermitForm" :rules="addPermitFormRules">
                        <el-form-item label="通行人姓名" prop="visitorName">
                            <el-input size="small" v-model="addPermitForm.visitorName" style="width:260px"
                                      placeholder="请输入通行人姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="identityNo">
                            <el-input size="small" v-model="addPermitForm.identityNo" style="width:260px"
                                      placeholder="请输入18位身份证号"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="visitorTel">
                            <el-input size="small" v-model="addPermitForm.visitorTel" style="width:260px"
                                      placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="工作单位" prop="visitorCompany">
                            <el-input size="small" v-model="addPermitForm.visitorCompany" style="width:260px"
                                      placeholder="请输入工作单位"></el-input>
                        </el-form-item>
                        <el-form-item label="通行日期范围" prop="permitDate">
                            <el-date-picker v-model="addPermitForm.permitDate" type="daterange" range-separator="至"
                                            start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px"
                                            size="small" value-format="yyyy-MM-dd HH:mm" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="通行限次" prop="dayCount">
                            <el-select v-model="addPermitForm.dayCount" placeholder="请选择通行限次" size="small"
                                       style="width: 200px;">
                                <el-option :key="item" :label="item" :value="item"
                                           v-for="item in 20"></el-option>
                            </el-select>
                            次/每日
                        </el-form-item>
                        <el-form-item label="通行事由" prop="visitorReason">
                            <el-input type="textarea" :rows="3" placeholder="请输入通行事由(最多100个字，不能有特殊字符)"
                                      style="width:628px;"
                                      v-model="addPermitForm.visitorReason" maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="同行人数">
                            <div class="check-box">
                                <el-input size="small" v-model="addPermitForm.userCount" style="width:260px"
                                          @blur="checkMyNumber(addPermitForm.userCount,'friendsShow','checkNumber')"></el-input>
                                <dd v-show="friendsShow">您输入的人数只能是数字</dd>
                            </div>
                        </el-form-item>
                        <el-form-item label="车牌号">
                            <div class="check-box">
                                <el-input size="small" v-model="addPermitForm.visitorCarNo" style="width:260px"
                                          @blur="checkMyNumber(addPermitForm.visitorCarNo,'carNOShow','checkCarNO', 'add')"></el-input>
                                <dd v-show="carNOShow">您输入的车牌号格式不正确</dd>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="addPermitDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveAddPermitForm('addPermitForm')"></Button>
				</span>
            </el-dialog>
            <el-dialog title="访客通行证" :visible.sync="updatePermitDialog" width="880px" center class="sch-system-dialog">
                <div class="content">
                    <el-form ref="updatePermitForm" label-width="100px" :model="updatePermitForm"
                             :rules="updatePermitFormRules">
                        <el-form-item label="通行人姓名" prop="visitorName">
                            <el-input size="small" v-model="updatePermitForm.visitorName" style="width:260px"
                                      placeholder="请输入通行人姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="身份证号" prop="identityNo">
                            <el-input size="small" v-model="updatePermitForm.identityNo" style="width:260px"
                                      placeholder="请输入18位身份证号"></el-input>
                        </el-form-item>
                        <el-form-item label="手机号" prop="visitorTel">
                            <el-input size="small" v-model="updatePermitForm.visitorTel" style="width:260px"
                                      placeholder="请输入手机号"></el-input>
                        </el-form-item>
                        <el-form-item label="工作单位" prop="visitorCompany">
                            <el-input size="small" v-model="updatePermitForm.visitorCompany" style="width:260px"
                                      placeholder="请输入工作单位"></el-input>
                        </el-form-item>
                        <el-form-item label="通行日期范围" prop="permitDate">
                            <el-date-picker v-model="updatePermitForm.permitDate" type="daterange" range-separator="至"
                                            start-placeholder="开始日期" end-placeholder="结束日期" style="width:260px"
                                            size="small" value-format="yyyy-MM-dd HH:mm" :default-time="['00:00:00', '23:59:59']">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="通行限次" prop="dayCount">
                            <el-select v-model="updatePermitForm.dayCount" placeholder="请选择" size="small"
                                       style="width: 200px;">
                                <el-option :key="item" :label="item" :value="item"
                                           v-for="item in 20"></el-option>
                            </el-select>
                            次/每日
                        </el-form-item>
                        <el-form-item label="通行事由" prop="visitorReason">
                            <el-input type="textarea" :rows="3" placeholder="请输入通行事由(最多100个字，不能有特殊字符)"
                                      style="width:628px;"
                                      v-model="updatePermitForm.visitorReason" maxlength="100"></el-input>
                        </el-form-item>
                        <el-form-item label="同行人数">
                            <div class="check-box">
                                <el-input size="small" v-model="updatePermitForm.userCount" style="width:260px"
                                          @blur="checkMyNumber(updatePermitForm.userCount,'friendsShow','checkNumber')"></el-input>
                                <dd v-show="friendsShow">您输入的人数只能是数字</dd>
                            </div>
                        </el-form-item>
                        <el-form-item label="车牌号">
                            <div class="check-box">
                                <el-input size="small" v-model="updatePermitForm.visitorCarNo" style="width:260px"
                                          @blur="checkMyNumber(updatePermitForm.visitorCarNo,'carNOShow','checkCarNO', 'update')"></el-input>
                                <dd v-show="carNOShow">您输入的车牌号格式不正确</dd>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="updatePermitDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveUpdatePermitForm('updatePermitForm')"></Button>
				</span>
            </el-dialog>
        </el-container>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import NavMenu from '@/components/NavMenu/NavMenu'
	import Toast from '@/components/Toast/Toast'
	import { Loading } from 'element-ui';

	export default {
		name: 'HelloWorld',
		components: {
			Button, NavMenu, Toast
		},
		data() {
			let validateInputChars = (rule, value, callback) => {   //输入项的特殊字符校验--文本框
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					this.checkInputChars(value, callback);
					callback();
				}
				callback();
			};
			let validateTextareaChars = (rule, value, callback) => {   //输入项的特殊字符校验--文本域
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					this.checkTextareaChars(value, callback);
					callback();
				}
				callback();
			};
			let validateTel = (rule, value, callback) => {   //输入项的校验--手机号码
				if (!$.trim(value)) {
					callback(new Error('请输入手机号码'));
				} else {
					this.checkTel(value, callback);
					callback();
				}
				callback();
			};
			let validateCardNO = (rule, value, callback) => {   //输入项的校验--身份证号
				if (!$.trim(value)) {
					callback(new Error('身份证号不能为空！'));
				} else {
					this.checkCardNO(value, callback);
					callback();
				}
				callback();
			};
			return {
				btn1Data: {
					iconL: require('../../../assets/images/add.png'),
					iconLAct: require('../../../assets/images/add.png')
				},
				friendsShow: false,    //同行人数错误提示信息，默认不显示
				carNOShow: false,    //车牌号错误提示信息，默认不显示
				permitData: [],//通行证列表数据
				filtersData: [], //过滤数据（通行证）
				aisleSelection: '',         //选中通道行的数据
				addPermitDialog: false,     //添加通行证弹窗
				updatePermitDialog: false,     //修改通行证弹窗
				addPermitForm: {   //添加通行证form
					visitorName: '',
					identityNo: '',
					visitorTel: '',
					visitorCompany: '',
					visitorReason: '',
					dayCount: '',
					permitDate: [],
					userCount: '',
					visitorCarNo: '',
				},
				addPermitFormRules: {            // 通道设备规则
					visitorName: [{required: true, validator: validateInputChars, trigger: 'blur'}],
					identityNo: [{required: true, validator: validateCardNO, trigger: 'blur'}],
					visitorTel: [{required: true, validator: validateTel, trigger: 'blur'}],
					visitorCompany: [{required: true, validator: validateInputChars, trigger: 'blur'}],
					visitorReason: [{required: true, validator: validateTextareaChars, trigger: 'blur'}],
					dayCount: [{required: true, message: '请输入通行限次', trigger: 'change'}],
					permitDate: [{required: true, message: '请选择日期范围', trigger: 'blur'}],
				},
				updatePermitForm: {   //添加通行证form
					visitorName: '',
					identityNo: '',
					visitorTel: '',
					visitorCompany: '',
					visitorReason: '',
					dayCount: '',
					permitDate: [],
					userCount: '',
					visitorCarNo: '',
				},
				updatePermitFormRules: {            // 通道设备规则
					visitorName: [{required: true, validator: validateInputChars, trigger: 'blur'}],
					identityNo: [{required: true, validator: validateCardNO, trigger: 'blur'}],
					visitorTel: [{required: true, validator: validateTel, trigger: 'blur'}],
					visitorCompany: [{required: true, validator: validateInputChars, trigger: 'blur'}],
					visitorReason: [{required: true, validator: validateTextareaChars, trigger: 'blur'}],
					dayCount: [{required: true, message: '请输入通行限次', trigger: 'change'}],
					permitDate: [{required: true, message: '请选择日期范围', trigger: 'change'}],
				},
				deviceData: [
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						device_bind: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						device_bind: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						device_bind: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						device_bind: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						device_bind: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						device_bind: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						device_bind: '未绑定',
					},
				],
				showIndex: false,
				tableLoading: false,        //表格加载动画
				allNum: 80,                  //分页总条数
				currentPage: 1,               //当前页（默认设为第一页）
				pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				isToast: false,
				toast: '',
				spanArr: [],                //跨行数据
				visitState: [               //
					{
						'label': '未开始',
						'value': 0,
					},
					{
						'label': '可通行',
						'value': 1,
					},
					{
						'label': '已失效',
						'value': 2,
					},
				],
				cycleState: null,      //选择的筛选状态
			}
		},
		methods: {
			/**
			 *  @function: 页面初始化加载表格方法
			 *  @author: wzx
			 *  @date 2018-09-15
			 */
			changePage() {
				let params = {
					"count": true,
					"page_index": this.currentPage,             //页码
					"page_size": this.pageItem,              //每页条数
					"search": {
						"schoolId": parseInt(localStorage.getItem('schoolId')),         //学校ID
						"cycleState": this.cycleState,         //访客状态
					}
				}
				this.tableLoading = true;
                this.$api.Rules.cycleList(params).then(res => {
					// console.log('22222222', res)
					this.tableLoading = false;
					if (res.data.code == 600) {
						this.permitData = res.data.data.records;
						// this.permitData.forEach((item)=>{
						// 	item.cycleState = null;
						// })
						// console.log('22222222', this.permitData)
						this.allNum = res.data.data.total_record;
						$.each(this.permitData, (a, b) => {      //添加序号，切换页面序号连增(注意函数采用ES6写法，否则this指向报错)
							this.$set(this.permitData[a], 'indexID', (this.currentPage - 1) * this.pageItem + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						})
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                   this.tableLoading = false;
                })
			},
			/**
			 *  @function: 获取通行状态数组
			 *  @author: wzx
			 *  @date 2018-09-05
			 */
			getPass() {
				this.filtersData = [
							{
								'text': "全部状态",
								'value': null
							}
						];
				for (let i = 0; i < this.visitState.length; i++) {
					this.filtersData.push(
						{
							'text': this.visitState[i].label,
							'value': this.visitState[i].value
						}
					)
				}
				// console.log("this.",this.filtersData)
			},
			/**
			 *  @function: 同行人数的校验
			 *  @author: wzx
			 *  @date 2018-09-05
			 */
			columFormat(row, column, cellValue) {               //（处理状态）星号列展示formatter
			// console.log("cellValue1",cellValue)
				if (cellValue == 0) {//
					cellValue = '未开始'
				} else if (cellValue == 1) {
					cellValue = '可通行'
				} else if (cellValue == 2) {
					cellValue = '已失效'
				}else if(cellValue == null){
					cellValue = '全部状态'
				}
				return cellValue
			},
			/**
			 *  @function: 同行人数的校验
			 *  @author: wzx
			 *  @date 2018-09-05
			 */
			checkMyNumber(value, name, funcName, btnTag) {
				/**
				 * value:要验证的内容
				 * name:控制显示隐藏的变量名
				 * funcName:验证的方法名
				 */
				// console.log(888,value)
                if(funcName == 'checkCarNO'){
	                value = value.toLocaleUpperCase();// 自动转大写
                    if(btnTag == 'add'){
	                    this.addPermitForm.visitorCarNo = value;
                    }else if(btnTag == 'update'){
	                    this.updatePermitForm.visitorCarNo = value;
                    }
                }
				// console.log(888,value)
				let state = false;
				if (value) {
					this[funcName](value, () => {
						state = true;
						// return state;
					}, 1);
				} else {
					state = false;
					// return state;
				}
				this[name] = state;
			},
			/**
			 *  @function: table 列表点击筛选(全部通行证)
			 *  @author: wzx
			 *  @date 2018-09-04
			 */
			filterTag(value, row) {
				return row.cycleState === value;
			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: wzx
			 *  @date 2018-09-15
			 */
			handleFilterChange(filters) {
				// console.log('筛选条件变化', filters);      //2018.9.15
				this.cycleState = filters.cycleState[0];
				this.changePage();
			},
			/**
			 *  @function添加通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			addPermit() {
				this.addPermitDialog = true;
				this.resetForm('addPermitForm');    //form表单置空
				this.friendsShow = false;
				this.carNOShow = false;
				this.addPermitForm.userCount = '';
				this.addPermitForm.visitorCarNo = '';
			},
			/**
			 *  @function修改通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			rowUpdate(row) {
				// console.log('修改通道', row)
				this.updatePermitDialog = true;
				this.resetForm('updatePermitForm');    //form表单置空
				this.updatePermitForm = row;
				this.friendsShow = false;
				this.carNOShow = false;
				this.updatePermitForm = {   //添加通行证form
                    visitorId:row.visitorId,
					visitorName: row.visitorName,
					identityNo: row.identityNo,
					visitorTel: row.visitorTel,
					visitorCompany: row.visitorCompany,
					visitorReason: row.visitorReason,
					dayCount: row.dayCount,
					permitDate: [row.visitorBegin, row.visitorEnd],
					userCount: row.userCount,
					visitorCarNo: row.visitorCarNo,
				}
//				this.updatePermitForm.permitDate = [row.visitorBegin,row.visitorEnd];
			},
			/**
			 *  @function添加通行证功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-9-5
			 **/
			saveAddPermitForm() {
				this.$refs['addPermitForm'].validate((valid) => {
					if (valid) {
						if (this.friendsShow || this.carNOShow) {
							return
						} else {
							Loading.service();
							let params = {
								visitorName: this.addPermitForm.visitorName,
								identityNo: this.addPermitForm.identityNo,
								visitorTel: this.addPermitForm.visitorTel,
								visitorCompany: this.addPermitForm.visitorCompany,
								visitorReason: this.addPermitForm.visitorReason,
								dayCount: this.addPermitForm.dayCount,
								visitorBegin: this.addPermitForm.permitDate[0],
								visitorEnd: this.addPermitForm.permitDate[1],
								userCount: this.addPermitForm.userCount,
								visitorCarNo: this.addPermitForm.visitorCarNo,
							}
                			this.$api.Rules.cycleSave(params).then(res => {
								// console.log('添加访客通行证', res)
								Loading.service().close();
								if (res.data.code == 600) {
									this.addPermitDialog = false;// 关闭添加通行证弹窗
									this.changePage();
								} else {
									this.isToast = true;
									this.toast = res.data.msg;
								}
							}).catch(err =>{
								Loading.service().close();
							})
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			/**
			 *  @function修改通行证功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-9-5
			 **/
			saveUpdatePermitForm() {
				this.$refs['updatePermitForm'].validate((valid) => {
					if (valid) {
						if (this.friendsShow || this.carNOShow) {
							return
						} else {
							Loading.service();
							let params = {
								visitorId: this.updatePermitForm.visitorId,
								visitorName: this.updatePermitForm.visitorName,
								identityNo: this.updatePermitForm.identityNo,
								visitorTel: this.updatePermitForm.visitorTel,
								visitorCompany: this.updatePermitForm.visitorCompany,
								visitorReason: this.updatePermitForm.visitorReason,
								dayCount: this.updatePermitForm.dayCount,
								visitorBegin: this.updatePermitForm.permitDate[0],
								visitorEnd: this.updatePermitForm.permitDate[1],
								userCount: this.updatePermitForm.userCount,
								visitorCarNo: this.updatePermitForm.visitorCarNo,
							}
                			this.$api.Rules.cycleSave(params).then(res => {
								// console.log('修改访客通行证', res)
								Loading.service().close();
								if (res.data.code == 600) {
									this.updatePermitDialog = false;// 关闭修改通行证弹窗
									this.changePage();
								} else {
									this.isToast = true;
									this.toast = res.data.msg;
								}
							}).catch(err =>{
								Loading.service().close();
							})
						}
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			/**
			 *  @function: 表格中的规则删除按钮
			 *  @author: wzx
			 *  @date 2018-7-21
			 **/
			rowDelete(row) {
				// console.log("删除规则", row)
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					Loading.service();
                	this.$api.Rules.cycleDelete({visitorId:row.visitorId}).then(res => {
						// console.log('删除访客通行证', res)
						Loading.service().close();
						if (res.data.code == 600) {
							this.changePage();
							this.$message({type: 'success', message: '删除成功!'});//请求删除成功之后提示
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}).catch(() => {//点击取消按钮
					this.$message({type: 'info', message: '已取消删除'});
				});
			},
			/**
			 *  @function设置每页显示数据条数的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.pageItem = val;
				this.currentPage = 1;
				this.changePage(this.pageItem, this.currentPage);
			},
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.changePage(this.pageItem, this.currentPage);
			},
			/**
			 * toast弹窗隐藏
			 * wzx
			 * 2018.7.18
			 */
			hideToast() {
				this.isToast = false;
			},
			/**
			 *  @function置空弹窗中表单的数据
			 *  @author: wzx
			 *  @date 2018-9-3
			 **/
			resetForm(formName) {
				if (this.$refs[formName] !== undefined) {     //防止form未加载完毕时报错
					this.$refs[formName].resetFields();
				}
			},
			/**
			 *  @function: 重新获取宽高
			 *  @author: lxr
			 *  @date 2018-7-20
			 **/
			resizeLayout() {
				setTimeout(() => {
					let icH = $('.index > .m-cen').height();
					let stH = $('.index .set-top').height();
//					let ttH = $('.buildings-devices > .m-top').height();
					let obH = $('.visitor-pass .m-cen .title').height();
					let pbH = $('.pagination-box').height();
					let tblH = icH - stH - obH - pbH;
					// console.log(66, stH, icH, obH, pbH)
					$('.visitor-pass .m-cen .content').height(tblH)
				}, 20)
			},
			/**
			 *  @function: input宽度自适应
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			resizeInputWidth() {
				//设置input的宽度
				let vThis = this;
				setTimeout(function () {//必须添加延迟，否则找不到该dom
					let actInput = $('.buildings-devices .m-top .el-input input');
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
			inputValLength(input) {
				let res = {
					numLen: 0,
					enLen: 0,
					textLen: 1
				}
				let re1 = /\d/g;                  //数字
				let re2 = /[a-zA-Z]/g;            //英文
				let re3 = /[\u4e00-\u9fa5]/g;    //汉字
				if ($(input).val().match(re1) != null) {
					res.numLen = ($(input).val().match(re1)).length;
				}
				if ($(input).val().match(re2) != null) {
					res.enLen = ($(input).val().match(re2)).length;
				}
				if ($(input).val().match(re3) != null) {
					res.textLen = Math.floor(($(input).val().match(re3)).length * 1.85);
				}
				return res
			},
			/**
			 *  @function: 设置光标始终在文本框最后
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			setCaretPosition(tObj, sPos) {
				if (tObj.setSelectionRange) {
					setTimeout(function () {
						tObj.setSelectionRange(sPos, sPos);
						tObj.focus();
					}, 0);
				} else if (tObj.createTextRange) {
					let rng = tObj.createTextRange();
					rng.move('character', sPos);
					rng.select();
				}
			}
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
			this.resizeInputWidth();//重定义input宽
			this.getPass();
			this.changePage();
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .visitor-pass {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .set-top {
            height: 6.3vh;
            background: #F5F7F8;
            /deep/ .navmenu-container {
                .navbar {
                    .nav-div {
                        text-align: center;
                        color: #c0c4cc;
                        &.actives {
                            color: #1cab7d;
                        }
                    }
                    .icon {
                        position: static;
                    }
                }
            }
        }
        .set-bottom {
            margin-top: 10px;
        }
        .m-cen {
            width: 100%;
            height: auto;
        height: 100%;
            background: #fff;
            .title {
                border: 0;
            }
            > .content {
				padding: 0;
                /deep/ .is-leaf:not(.is-center) {
                    padding: 0 10px;
                    .cell {
                        width: 100%;
                        line-height: 35px;
                        border: 1px solid #e1e1e1;
                        background: #fff;
                        border-radius: 5px;
                        .el-table__column-filter-trigger {
                            float: right;
                        }
                    }
                }
            }
            .sch-system-dialog {
                .el-form-item {
                    width: auto;
                    min-width: 49%;
                    display: inline-block;
                    text-align: left;
                    position: relative;
                    /*padding-left: 2%;*/
                    /*padding-right: 3%;*/
                    padding-bottom: 0 !important;
                    /deep/ .el-radio-group {
                        .el-radio {
                            display: inline-block;
                        }
                    }
                    .el-select {
                        margin-right: 10px;
                    }
                    .check-box {
                        position: relative;
                        dd {
                            color: #f56c6c;
                            font-size: 12px;
                            position: absolute;
                            left: 0;
                            top: 30px;
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
            .pagination-box {
				padding: 0;
                width: 100%;
                height: 60px;
                background: #fff;
                box-sizing: content-box;
                .el-pagination {
                    padding-top: 15px;
                }
                .el-pagination.is-background .el-pager li:not(.disabled).active {
                    background-color: #1cab7d;
                }
            }
        }

        .title {
            height: 60px;
            line-height: 60px;
            border-bottom: 1px solid #E4E4E4;
            padding: 0 0 0 3%;
            font-weight: bold;
            font-size: 18px;
            .btns1, .btns2 {
                display: inline-block;
                float: right;
                margin-right: 10px;
            }
            .button-div {
                /deep/ .button.custom7 {
                    background: transparent;
                    border-color: transparent;
                    color: #333;
                    img {
                        width: 20px;
                        height: 20px;
                    }
                    &:hover {
                        background: #f9fffc;
                        border: 1px solid #1cab7d;
                    }
                    &:active {
                        background: transparent;
                    }
                }
            }
        }
    }
</style>
