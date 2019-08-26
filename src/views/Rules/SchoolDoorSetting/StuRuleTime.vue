<template>
    <div class="stu-rule-time">
        <div class="m-top">
            <div class="title">
                规则名称
                <div class="btns1" v-if="switchBtn">
                    <Button title="添加规则" btnClass="custom7" :data="btn1Data" btnFontSize="12px"  @click="addClick"
                            :iconLeft="true" v-if="roleActions.indexOf('进出规则_@bepf@devPlace@addInoutRule_create_own') > -1"></Button>
                    <Button title="修改" btnClass="custom7" :data="btn2Data" btnFontSize="12px"  @click="editClick"
                            :iconLeft="true" :dised1="activeInputId == ''" v-if="roleActions.indexOf('进出规则_@bepf@devPlace@updateInoutRule_update_own') > -1"></Button>
                    <Button title="删除" btnClass="custom7" :data="btn3Data" btnFontSize="12px"  @click="deleteClick"
                            :iconLeft="true" :dised1="activeInputId == ''" v-if="roleActions.indexOf('进出规则_@bepf@devPlace@deleteInoutRule_delete_own') > -1"></Button>
                </div>
                <div class="btns2" v-else>
                    <Button title="保存" btnClass="custom7" btnFontSize="12px"  @click="saveClick(addRuleModel,'checkInputChars')"></Button>
                    <Button title="取消" btnClass="custom7" btnFontSize="12px"  @click="cancel"></Button>
                </div>
            </div>
            <div class="content">
				<div class="groupBtn" @click="clickInput({id: ''}, $event, -1)">
                    <el-input class="act" placeholder="请输入内容" value="全部" size="small" readonly></el-input>
                </div>
                <div class="groupBtn" v-for="(build, bIdx) in buildingData" @click="clickInput(build, $event,bIdx)" :key="bIdx">
					<el-input placeholder="请输入内容"
						v-model="build.ruleName"
						:value="build.ruleName"
						size="small"
						readonly
						>
					</el-input>
                </div>
                <div class="groupBtn" v-if="addBuild">
                    <el-input v-model="addRuleModel"
						class="add-build-input"
						placeholder="请输入内容"
						size="small"

					></el-input>
                </div>
                <div class="shade-div"></div>
            </div>
        </div>
        <div class="m-cen">
            <div class="title">
                时段设置
                <div class="btns1">
                    <Button title="添加时段" btnClass="custom7" :data="btn1Data" btnFontSize="12px"  @click="addTimeRule"
                            :iconLeft="true" v-if="roleActions.indexOf('进出规则_@bepf@devPlace@addInoutTime_create_own') > -1"></Button>
                </div>
            </div>
            <div class="content">
                <el-table id="table" ref="aisleTable" height="100%" :data="tableData" tooltip-effect="dark" border
                          highlight-current-row style="width: 100%"  row-key="deviceinfo_id"
                           v-loading="tableLoading" :span-method="objectSpanMethod">
                    <el-table-column prop="indexID" label="序号" width="60" align="center"></el-table-column>
                    <el-table-column prop="ruleName" label="规则名称" width="100" align="center" show-overflow-tooltip></el-table-column>
				    <el-table-column  label="进校时段规则" align="center">
						<el-table-column prop="timeName1" label="时段名称" width="95" align="center" show-overflow-tooltip></el-table-column>
                    	<el-table-column prop="weekUseName1" label="适用星期" align="center" width="95" show-overflow-tooltip></el-table-column>
						<el-table-column  label="时间范围" align="center" width="95" show-overflow-tooltip>
							<template slot-scope="scope">
								<span v-if="scope.row.timeStart1 && scope.row.timeEnd1">
									{{scope.row.timeStart1?scope.row.timeStart1.substring(0,5):""}}-{{scope.row.timeEnd1?scope.row.timeEnd1.substring(0,5):""}}</span>
									<!-- <span v-else>无</span> -->
                        	</template>
						</el-table-column>
                    </el-table-column>
				    <el-table-column  label="离校时段规则" align="center">
						<el-table-column prop="timeName2" label="时段名称" align="center" width="95" show-overflow-tooltip></el-table-column>
                    	<el-table-column prop="weekUseName2" label="适用星期" align="center" width="95" show-overflow-tooltip></el-table-column>
						<el-table-column  label="时间范围" align="center" width="95" show-overflow-tooltip>
							<template slot-scope="scope">
								<span v-if="scope.row.timeStart2 && scope.row.timeEnd2">
									{{scope.row.timeStart2?scope.row.timeStart2.substring(0,5):""}}-{{scope.row.timeEnd2?scope.row.timeEnd2.substring(0,5):""}}</span>
									<!-- <span v-else>无</span> -->
                        	</template>
						</el-table-column>
					</el-table-column>
				    <el-table-column  label="常开时段规则" align="center">
						<el-table-column prop="timeName3" label="时段名称" align="center" width="95" show-overflow-tooltip></el-table-column>
                    	<el-table-column prop="weekUseName3" label="适用星期" align="center" width="95" show-overflow-tooltip></el-table-column>
						<el-table-column  label="时间范围" align="center" width="95" show-overflow-tooltip>
							<template slot-scope="scope">
								<span v-if="scope.row.timeStart3 && scope.row.timeEnd3">
									{{scope.row.timeStart3?scope.row.timeStart3.substring(0,5):""}}-{{scope.row.timeEnd3?scope.row.timeEnd3.substring(0,5):""}}</span>
									<!-- <span v-else>无</span> -->
                        	</template>
						</el-table-column>
					</el-table-column>
				    <el-table-column  label="常闭时段规则" align="center">
						<el-table-column prop="timeName4" label="时段名称" align="center" width="95" show-overflow-tooltip></el-table-column>
                    	<el-table-column prop="weekUseName4" label="适用星期" align="center" width="95" show-overflow-tooltip></el-table-column>
						<el-table-column  label="时间范围" align="center" width="95" show-overflow-tooltip>
							<template slot-scope="scope">
								<span v-if="scope.row.timeStart4 && scope.row.timeEnd4">
									{{scope.row.timeStart4?scope.row.timeStart4.substring(0,5):""}}-{{scope.row.timeEnd4?scope.row.timeEnd4.substring(0,5):""}}</span>
									<!-- <span v-else>无</span> -->
                        	</template>
						</el-table-column>
					</el-table-column>
                    <el-table-column label="起止日期" align="center" width="200" show-overflow-tooltip>
						<template slot-scope="scope">
                            <span v-if="scope.row.startDate && scope.row.endDate">{{scope.row.startDate}} 至 {{scope.row.endDate}}</span>
							<span v-else>无</span>
                        </template>
					</el-table-column>
					<el-table-column label="操作" min-width="120" align="center" fixed="right">
                        <template slot-scope="scope">
                            <!-- <span class="def-time-name" v-if="scope.row.timeName == '默认时段'">默认时段不可更改</span> -->
                            <!-- <div v-else> -->
                            <div>
                                <el-button class="normal" size="mini" plain @click="changeTimeRule(scope.row)"
                                           v-if="roleActions.indexOf('进出规则_@bepf@devPlace@updateInoutTime_update_own') > -1">修改</el-button>
                                <!-- <el-button class="warning" size="mini" plain @click="delTimeRule(scope.row)"
                                           v-if="roleActions.indexOf('进出规则_@bepf@devPlace@deleteInoutTime_delete_own') > -1">删除</el-button> -->
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
						:total="pageAllNum" @current-change="handleCurrentChange">
				</el-pagination>
                <!-- <el-pagination background layout=" prev, pager, next" :total="pageAllNum"></el-pagination> -->
            </div>
            <el-dialog title="添加时段" :visible.sync="addTimeDialog" width="900px" center class="sch-system-dialog">
                <div class="content">
                    <el-form ref="timeForm" label-width="90px" :inline="true" :model="timeForm" :rules="timeRules">
                        <el-form-item label="规则名称：" prop="ruleName">
                            <el-select v-model="timeForm.ruleName" placeholder="请选择规则名称" size="small" style="width: 150px;">
                                <el-option :label="item.ruleName" :disabled="item.ruleNum != 0" :value="item.id" :key="item.id" v-for="item in buildingData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="起止日期：" prop="startDate">
                            <!-- <el-date-picker type="date" placeholder="选择日期"
								v-model="timeForm.startDate" size="small" style="width: 150px;">
							</el-date-picker> -->
							<el-date-picker type="daterange" placeholder="选择日期"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								v-model="timeForm.startDate"
								value-format="yyyy-MM-dd"
								size="small" >
							</el-date-picker>
                        </el-form-item>
						<el-form-item label="进出时段：" class="add-time-box">
							<ul>
								<li v-for="(item,index) in enterTimeData"
								:key="index"
								:class="{'ac':index == ac}"
								@click="enterTimeClick(index)">
									{{item.title}}
								</li>
							</ul>
							<div class="tools-wrap" v-for="(item,index) in enterStepData" :key="index" v-show="ac == index">
								<div class="scroll-box">
									<div class="tools">
										<span class="tools-span">时段名称：</span>
										<el-input size="small"  style="width:160px" v-model="item.name" require></el-input>
										<span v-show="index == 2" style="margin-left:5px;"> 注：时段内可任意进出</span>
										<span v-show="index == 3" style="margin-left:5px;"> 注：时段内常闭，不可进出</span>
									</div>
									<div class="inner-box" v-for="(todo,idx) in item.timeData" :key="idx">
										<img src="../../../assets/images/del.png" title="删除时段" class="del-time" @click="delTime(item,idx)" v-show="idx != 0">
										<div class="tools">
											<span class="tools-span">适用星期：</span>
											<el-checkbox-group v-model="todo.applyWeek" @change="checkChange">
												<el-checkbox :label="week.value" :key="weekIndex" v-for="(week,weekIndex) in weekData">{{week.title}}</el-checkbox>
											</el-checkbox-group>
										</div>
										<div class="tools" >
											<span class="tools-span">起止时间：</span>
											<el-time-picker
												is-range
												v-model="todo.time"
												range-separator="至"
												start-placeholder="开始时间"
												end-placeholder="结束时间"
												placeholder="选择时间范围"
												format="HH:mm"
												value-format="HH:mm">
											</el-time-picker>
											<!-- <img src="../../../assets/images/add.png" alt="新增" title="新增"  v-if="idx == 0" @click="addTime(item,todo)"> -->
											<!-- <img src="../../../assets/images/del.png" alt="删除" title="删除" v-else @click="delTime(item,idx)"> -->
										</div>
									</div>
								</div>
								<Button title="添加时段" btnClass="custom8" btnFontSize="14px" btnHeight="4.5vh" @click="addTime(item)" class="add-time"></Button>
							</div>
						</el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <!-- <span>注：未设置的时段系统默认可刷卡进校，刷卡不可离校（请假除外）。</span> -->
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="addTimeDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveTimeForm('timeForm')"></Button>
				</span>
            </el-dialog>

			<el-dialog title="修改时段" :visible.sync="changeTimeDialog" width="900px" center class="sch-system-dialog">
                <div class="content">
                    <el-form ref="changeTimeForm" label-width="90px" :inline="true" :model="changeTimeForm" :rules="timeRules">
                        <el-form-item label="规则名称：" prop="ruleName">
                            <el-select v-model="changeTimeForm.ruleName" placeholder="请选择规则名称" size="small" style="width: 150px;">
                                   <el-option :label="item.ruleName" :disabled="true" :value="item.id" :key="item.id" v-for="item in buildingData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="起止日期：" prop="startDate">
							<el-date-picker type="daterange" placeholder="选择日期"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								v-model="changeTimeForm.startDate"
								value-format="yyyy-MM-dd"
								size="small" >
							</el-date-picker>

                        </el-form-item>
						<!-- <el-form-item label="适用星期：" prop="applyWeek">
							<el-checkbox-group v-model="changeTimeForm.applyWeek" @change="checkChange">
								<el-checkbox :label="item.value" :key="index" v-for="(item,index) in weekData">{{item.title}}</el-checkbox>
							</el-checkbox-group>
						</el-form-item> -->
						<el-form-item label="进出时段：" class="add-time-box">
							<ul>
								<li v-for="(item,index) in enterTimeData"
								:key="index"
								:class="{'ac':index == ac}"
								@click="enterTimeClick(index)">
									{{item.title}}
								</li>
							</ul>
							<div class="tools-wrap" v-for="(item,index) in enterStepData" :key="index" v-show="ac == index">
								<div class="scroll-box">
									<div class="tools">
										<span class="tools-span">时段名称：</span>
										<el-input size="small"  style="width:160px" v-model="item.name" require></el-input>
										<span v-show="index == 2" style="margin-left:5px;"> 注：时段内可任意进出</span>
										<span v-show="index == 3" style="margin-left:5px;"> 注：时段内常闭，不可进出</span>
									</div>
									<div class="inner-box" v-for="(todo,idx) in item.timeData" :key="idx">
										<img src="../../../assets/images/del.png" title="删除时段" class="del-time" @click="delTime(item,idx)" v-show="idx != 0">	
										<div class="tools">
												<span class="tools-span">适用星期：</span>
												<el-checkbox-group v-model="todo.applyWeek" @change="checkChange">
													<el-checkbox :label="week.value" :key="weekIndex" v-for="(week,weekIndex) in weekData">{{week.title}}</el-checkbox>
												</el-checkbox-group>
											</div>
										<div class="tools">
											<span class="tools-span">起止时间：</span>
											<el-time-picker
												is-range=""
												v-model="todo.time"
												range-separator="至"
												start-placeholder="开始时间"
												end-placeholder="结束时间"
												placeholder="选择时间范围"
												format="HH:mm"
												value-format="HH:mm">
											</el-time-picker>
										</div>
									</div>
								</div>
								<Button title="添加时段" btnClass="custom8" btnFontSize="14px" btnHeight="4.5vh" @click="addTime(item)" class="add-time"></Button>
							</div>
						</el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <!-- <span>注：未设置的时段系统默认可刷卡进校，刷卡不可离校（请假除外）。</span> -->
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="changeTimeDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveTimeForm('changeTimeForm')"></Button>
				</span>
            </el-dialog>
        </div>
		<Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	import { Loading } from 'element-ui';

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
					iconL: require('../../../assets/images/add.png'),
					iconLAct: require('../../../assets/images/add.png')
                },//添加按钮
				btn2Data:{
					iconL: require('../../../assets/images/edit.png'),
					iconLAct: require('../../../assets/images/edit.png')
                },//修改按钮
				btn3Data:{
					iconL: require('../../../assets/images/del.png'),
					iconLAct: require('../../../assets/images/del.png')
                },//删除按钮
				buildingData: [],//规则列表数据
				switchBtn: true,//规则切换新增/保存按钮
				addBuild: false,//添加文本框是否显示
				addRuleModel: '',//添加文本model
				activeInputId: '',//选中input的id 存一下
				buildBtnTag: '',//楼宇按钮tag标示(新增修改删除分别为123)
				addTimeDialog: false,     //添加时段弹窗
				changeTimeDialog: false,     //修改时段弹窗
				timeForm: {
					ruleName:'',        //规则名称
					startDate:[],       //启用日期
				},//添加时段form
				changeTimeForm: {
					ruleName:'',        //规则名称
					startDate:[],       //启用日期
				},//修改时段form
				timeRules: {
					ruleName: [
						{ required: true, message: '请选择规则名称', trigger: 'change' }
					],
					applyWeek: [
						{ type: 'array', required: true, message: '请选择适用星期', trigger: 'change' }
					],
					startDate: [
						{ type: "array", required: true, message: '请选择日期', trigger: 'change' }
					]
				},
				tableLoading: false,        //表格加载动画
				tableData:[],				//table数组
				pageAllNum:0,                  //分页总条数
				currentPage:1,               //当前页（默认设为第一页）
				pageSize:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				spanArr: [],                //跨行数据
				/*----------二期----------*/
				enterTimeData:[
					{
						title:'进校时段',
						value:1
					},
					{
						title:'离校时段',
						value:2
					},
					{
						title:'常开时段',
						value:3
					},
					{
						title:'常闭时段',
						value:4
					}
				],//进出时段数据tab
				ac:0,//tab选择样式
				enterStepData:[
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
				],//进出时段数据 格式
				weekData:[
					{
						title:'周一',
						value:1
					},
					{
						title:'周二',
						value:2
					},
					{
						title:'周三',
						value:3
					},
					{
						title:'周四',
						value:4
					},
					{
						title:'周五',
						value:5
					},
					{
						title:'周六',
						value:6
					},
					{
						title:'周日',
						value:7
					}
				],//多选框 周数据
				normalVal:'',//修改点击取消设成默认值
				bIdx:'',//点击修改的当前index
			}
		},
		methods: {
			/**
			 *  @function: 输入内容验----form外
			 *  @author: cs
			 *  @date 2018-09-06
			 */
			formOutTest(value,funcName,tipMsg) {
				/**
				 * value:要验证的内容
				 * funcName:验证的方法名
				*/
				//验证内容
				let state = false;
				if (value) {
					state = this[funcName](value, '',1,1,tipMsg);
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
				this.addRuleModel = '';//清空model
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
				let actInput = $('.stu-rule-time .m-top .el-input.act');
				let actInputSibling = $('.stu-rule-time .m-top .el-input.act').parent().siblings();

				if(actInput){//必须选中一个楼宇才能进行修改
					// this.activeInputId       //当前编辑项的id值
					/* if(this.activeInputId == ''){//全部选项，不能修改
						this.$message({
							showClose: true,
							message: "不能修改默认规则！",
							type: "warning",
							duration: this.msgDuration
						});
						return;
                    } */
					$(actInput).find('input').removeAttr('readonly');
					actInput.addClass('edit');
					$(actInput).find('input').focus();
					this.normalVal = $(actInput).find('input').val();
					setTimeout(()=>{
						$(actInput).find('input').val(this.normalVal)
					})
					this.switchBtn = false;//切换保存、取消按钮
                    //将遮罩层层级换成2，当前编辑input层级换成3
                    let shade = $('.stu-rule-time .m-top .content .shade-div');
                    let groupBtn = $('.stu-rule-time .m-top .el-input.act').parent();
					shade.css('z-index',2);
					groupBtn.css('z-index',3);
                    //设置光标位置始终在文本框最后
					let tObj = $(actInput).find('input')[0];
					let sPos = $(actInput).find('input').val().length;
					this.setCaretPosition(tObj, sPos);
				}else{
					this.$message({
						showClose: true,
						message: "请选择要更改的规则！",
						type: "warning",
						duration: this.msgDuration
					});
					// this.$alert('请选择要更改的规则！', '提示', {
					// 		confirmButtonText: '确定',callback: action => {}});
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
				let actInput = $('.stu-rule-time .m-top .el-input.act');
				if(actInput.length != 0) {//必须选中一个楼宇才能进行删除
					/* if(this.activeInputId == ''){//全部选项，不能修改
						this.$message({
							showClose: true,
							message: "不能删除默认规则！",
							type: "warning",
							duration: this.msgDuration
						});
						return;
					} */
					this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
					}).then(() => {//点击确定按钮进行的操作
						//删除角色接口
                		this.$api.Rules.deleteInoutRule({id:this.activeInputId}).then(res => {
							// console.log('删除规则:',res.data.data)
							if(res.data.code == 600 || res.data.code == 0){
								let buildIdArr = [];//取出数组中的id，用来查找下标进行删除操作
								$.each(this.buildingData, function (i, buildId) {
									buildIdArr.push(buildId.id);
								})
								let index = buildIdArr.indexOf(this.activeInputId);
								if (index > -1) {//找到当前选中的下标并删除
									this.buildingData.splice(index, 1);
									this.$message({type: 'success', duration: this.msgDuration, message: '删除成功!'});//请求删除成功之后提示
								}
								$('.act').removeClass('act');
								this.activeInputId = '';
								$('.groupBtn').eq(0).find('.el-input').addClass('act')
								this.loadRuleData();
								this.getTableList('');
							}else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						})
					}).catch(() => {//点击取消按钮
						this.$message({type: 'info', message: '已取消删除'});
					});
				}else{
					this.$message({
						showClose: true,
						message: "请选择要删除的规则！",
						type: "warning",
						duration: this.msgDuration
					});
					// this.$alert('请选择要删除的规则！', '提示', {
					// 		confirmButtonText: '确定',callback: action => {}});
				}
            },
			/**
			 *  @function: 楼宇点击保存按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			saveClick(value,funcName){
				if(this.buildBtnTag == 1){//点击了新增按钮
					if(this.addRuleModel){//添加楼宇的model，若不添加无法保存
						let state = this.formOutTest(value,funcName);
						// console.log(11,state)
						if(state){
							let params = {
								"ruleName": value,
								"schoolId": localStorage.getItem('schoolId')
							}
                			this.$api.Rules.addInoutRule(params).then(res => {
							// console.log('新增规则：',res.data.data)
								if(res.data.code == 600 || res.data.code == 0){
									let addC = { ruleName: this.addRuleModel };
									this.buildingData.push(addC);           //前台操作(省去刷新一步)不能省去刷新，因为无id的话无法进行编辑删除操作
									this.addBuild = false;//取消新增楼宇
									this.switchBtn = true;//切换新增、修改按钮
									this.resizeLayout();//重新获取宽高
									this.resizeInputWidth();//重定义input宽
									this.loadRuleData();
									this.getTableList(this.activeInputId?this.activeInputId:'');
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
							message: "请输入规则名称！",
							type: "warning",
							duration: this.msgDuration
						});
						setTimeout(()=>{
							$('.add-build-input input').focus();//设置光标便于输入
						},this.msgDuration)
					}
				}else if(this.buildBtnTag == 2){//点击了修改按钮
					let actInput = $('.stu-rule-time .m-top .el-input.act');
					let actInputVal = $(actInput).find('input').val();//当前修改input的值
					let state = this.formOutTest(actInputVal,funcName);
					if(state){
						//修改规则接口
						let params = {
							"ruleName": actInputVal,
							"id": this.activeInputId
						}
                		this.$api.Rules.updateInoutRule(params).then(res => {
						// console.log('修改规则：',res.data.data)
							if(res.data.code == 600 || res.data.code == 0){
								let shade = $('.role-group-set .m-top .content .shade-div');
								let groupBtn = $('.role-group-set .m-top .el-input.act').parent();
								shade.css('z-index',0);
								groupBtn.css('z-index',1);
								//获取当前选中的楼宇
								$(actInput).find('input').attr('readOnly','true')
								actInput.removeClass('edit');
								this.switchBtn = true;//切换新增、修改按钮
								this.getTableList(this.activeInputId);
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
							message: "请输入规则名称！",
							type: "warning",
							duration: this.msgDuration
							});
							setTimeout(()=>{
								$('.add-build-input input').focus();//设置光标便于输入
							},this.msgDuration)
						}
						return
					}
					//将遮罩层层级换成0，当前编辑input层级换成1（请求成功之后）
					let shade = $('.stu-rule-time .m-top .content .shade-div');
					let groupBtn = $('.stu-rule-time .m-top .el-input.act').parent();
					shade.css('z-index',0);
					groupBtn.css('z-index',1);
					//获取当前选中的楼宇
					$(actInput).find('input').attr('readOnly','true')
					actInput.removeClass('edit');
					this.switchBtn = true;//切换新增、修改按钮
				}
            },
			/**
			 *  @function: 取消保存楼宇
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			cancel(){
				// console.log(120,this.buildBtnTag)
				this.addBuild = false;//取消新增楼宇
				this.switchBtn = true;//切换新增、修改按钮
				//获取当前选中的楼宇
				let actInput = $('.stu-rule-time .m-top .el-input.act');
				$(actInput).find('input').attr('readOnly','true')
				actInput.removeClass('edit');
				if(this.buildBtnTag == 2) {//点击了编辑按钮
					//将遮罩层层级换成0，当前编辑input层级换成1
					let shade = $('.stu-rule-time .m-top .content .shade-div');
					let groupBtn = $('.stu-rule-time .m-top .el-input.act').parent();
					shade.css('z-index',0);
					groupBtn.css('z-index',1);
					setTimeout(()=>{
						$(actInput).find('input').val(this.normalVal)
						this.resizeLayout();//重新获取宽高
						this.resizeInputWidth();//重定义input宽
						this.buildingData[this.bIdx].ruleName = this.normalVal;
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
				this.activeInputId = item.id;//存选中楼宇的id，用来做修改删除
				// console.log("activeInputId",this.activeInputId)
				this.bIdx = bIdx;
				this.currentPage = 1;
				this.getTableList(this.activeInputId);

                //加载通道与规则数据
            },
			/**
			 *  @function添加通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			addTimeRule(){
				// console.log('添加时段按钮点击',this.timeForm)
				if(this.activeInputId && this.tableData.length>0){
					this.$message({
						type: 'warning',
						duration: this.msgDuration , 
						message: '当前规则下存在时段，不允许新增！'
					});//请求删除成功之后提示
					return
				}
				this.addTimeDialog = true;
				this.ac = 0;
				this.enterStepData=[
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
					{
						name:'',
						timeData:[
							{
								time:'',
								applyWeek:[],
							}
						]
					},
				];
				this.timeForm = {
					ruleName:'',
					startDate:[]
				}
				setTimeout(() => {
					this.$refs["timeForm"].resetFields();
					this.timeForm.ruleName=this.activeInputId;
				})
				setTimeout(()=>{
					$('.stu-rule-time .m-cen .sch-system-dialog .el-table__body-wrapper').css({'max-height':'25vh','overflow-y':'auto'})
                },20)
			},
			/**
			 *  @function修改通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			changeTimeRule(row){
				// console.log('修改时段按钮',row,this.changeTimeForm)
                this.$api.Rules.getInoutTimeDetail({id:row.id}).then(res => {
					// console.log('查询学校进出时间段详情:', res.data.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.changeTimeForm.ruleName = '' ;
						this.changeTimeForm.startDate = [] ;
						this.changeTimeDialog = true;
						setTimeout(() => {
							this.$refs["changeTimeForm"].resetFields();
						})
						this.ac = 0;
						let arr = res.data.data.list;
						let allArr = [];
						for(let i = 0;i<4;i++){
							let num = 0;
							let weekNum = 0;
							allArr[i] = {};
							allArr[i].name = '';
							allArr[i].timeData =[];
							allArr[i].timeData[0] = {};
							allArr[i].timeData[0].applyWeek = [];
							allArr[i].timeData[0].time = '';
							for(let j = 0;j<arr.length;j++){
								if(i == arr[j].timeruleType){
									allArr[i].name = arr[j].timeName;
									allArr[i].timeData[weekNum] = {};
									if(arr[j].weekUse != ''){
										allArr[i].timeData[weekNum].applyWeek = arr[j].weekUse.split(',');
										//每一项必须为数字格式
										
										for(let k = 0;k<allArr[i].timeData[weekNum].applyWeek.length;k++){
											allArr[i].timeData[weekNum].applyWeek[k] = allArr[i].timeData[weekNum].applyWeek[k]*1
										}
										// console.log(444,weekNum,allArr[i].timeData[weekNum].applyWeek )
										weekNum++
									}else{
										allArr[i].timeData[weekNum].applyWeek = [];
									}
									
									if(arr[j].startTime && arr[j].endTime){
										allArr[i].timeData[num].time = [arr[j].startTime,arr[j].endTime]
										num++
									}else{
										allArr[i].timeData[num].time = '';
									}
								}
							}
						}
						// console.log("allArr:",allArr);
						setTimeout(()=>{
							for(let j = 0;j<this.buildingData.length;j++){
								if(res.data.data.ruleName == this.buildingData[j].ruleName){
									this.changeTimeForm.ruleName = this.buildingData[j].id;
									break
								}
							}
							if(res.data.data.startDate && res.data.data.endDate){
								this.changeTimeForm.startDate = [ res.data.data.startDate , res.data.data.endDate];
							}else{
								this.changeTimeForm.startDate = [];
							}
							this.enterStepData= allArr;
							// console.log("this.changeTimeForm：",this.changeTimeForm)
						},20)
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function：修改通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			delTimeRule(row){
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
                	this.$api.Rules.deleteInoutTime({id:row.id}).then(res => {
						// console.log('删除学校进出时间段:', res.data.data)
						if (res.data.code == 600 || res.data.code == 0) {
							this.getTableList(this.activeInputId);
							this.$message({type: 'success', duration: this.msgDuration , message: '删除成功!'});//请求删除成功之后提示
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					})
				}).catch(() => {//点击取消按钮
					this.$message({type: 'info', duration: '1000', message: '已取消删除'});
				});
			},
			/**
			 *  @function：添加通道功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			saveTimeForm(formName){
				// console.log('添加时段--保存按钮',this[formName],this.enterStepData)
				let chooseTime = false;//至少有一项满足条件
				// let overlap = false;//是否重叠
				let enterArr =[];//进校时段数组
				let leaveArr =[];//离校时段数组
				let allOpenArr =[];//常开时段数组
				let allCloseArr =[];//常闭时段数组
				let enterOpenState = false,enterCloseState = false,leaveOpenState = false,leaveCloseState = false,openCloseState = false,enterLeaveState = false;
				let state;
				//验证
				for(let i = 0; i<this.enterStepData.length;i++){
					// console.log(11144,this.enterStepData[i].name)
					if(this.enterStepData[i].name){
						state = this.formOutTest(this.enterStepData[i].name,'checkInputChars','时段名称不能包含特殊字符');
						if(state == true) break
					}
				}
				if(state == false) return
				// console.log(66,state)
				this.$refs[formName].validate((valid) => {
					if (valid) {
						for(let i = 0;i<this.enterStepData.length;i++){
							let timeData = this.enterStepData[i].timeData;
							// console.log(999999,timeData)
							// console.log('timeData:',`数组第${i}项`,timeData)
							for(let j = 0;j<timeData.length;j++){
								
								let timeArr = timeData[j].time;
								let weekArr = timeData[j].applyWeek;
								if(Array.isArray(timeArr) && this.enterStepData[i].name && weekArr.length>0){
									//选择了起止时间和时间名称 111111111222222
									chooseTime = true;
									// console.log("起止时间和时间名称:",i,j,timeData)
									/*if(timeData.length>1){
										//本时段自身时间做对比
										// console.log('本时段自身时间做对比')
										for(let k =j+1;k< timeData.length;k++){
											let contrastArr = timeData[k].time;
											if(Array.isArray(contrastArr)){
												 if(this.timeContrast(timeArr[0],timeArr[1],contrastArr[0],contrastArr[1])){
													//本时段自身有重合
													// overlap = true;
													let msg = ''
													if(i == 0){
														msg="进校时段起止时间有冲突"
													}else if(i == 1){
														msg="离校时段起止时间有冲突"
													}else if(i == 2){
														msg="常开时段起止时间有冲突"
													}else if(i == 3){
														msg="常闭时段起止时间有冲突"
													}
													this.$message({
														showClose: true,
														message: msg,
														type: "warning",
														duration: this.msgDuration
													});
													return false
												}else{
													// console.log(99999999)
												}
											} 
										}
									}else{
										//本时段只有一个 暂不对比
										// console.log('本时段只有一个 暂不对比')
									}*/
									// return false;
								}else{
									//没选择起止时间和时间名称
									// console.log("未选择起止时间和时间名称:",i,j)

								}
							}
						}
						if(!chooseTime){
							this.$message({
								showClose: true,
								message: '请选择时段名称、适用星期和起止时间',
								type: "warning",
								duration: this.msgDuration
							});
							return
						};
						for(let i =0;i<this.enterStepData[0].timeData.length;i++){
							if(Array.isArray(this.enterStepData[0].timeData[i].time)){
								enterArr.push(this.enterStepData[0].timeData[i].time)
							}
						};
						for(let i =0;i<this.enterStepData[1].timeData.length;i++){
							if(Array.isArray(this.enterStepData[1].timeData[i].time)){
								leaveArr.push(this.enterStepData[1].timeData[i].time)
							}
						};
						for(let i =0;i<this.enterStepData[2].timeData.length;i++){
							if(Array.isArray(this.enterStepData[2].timeData[i].time)){
								allOpenArr.push(this.enterStepData[2].timeData[i].time)
							}
						};
						for(let i =0;i<this.enterStepData[3].timeData.length;i++){
							if(Array.isArray(this.enterStepData[3].timeData[i].time)){
								allCloseArr.push(this.enterStepData[3].timeData[i].time)
							}
						};
						/*if(enterArr.length>0 && allOpenArr.length>0 ){
							enterOpenState = this.timeFunc(enterArr,allOpenArr,"进校时段和常开时段的起止时间冲突");
							if(enterOpenState) return
						}
						if(enterArr.length>0 && allCloseArr.length>0 ){
							enterCloseState = this.timeFunc(enterArr,allCloseArr,"进校时段和常闭时段的起止时间冲突");
							if(enterCloseState) return
						}
						if(leaveArr.length>0 && allOpenArr.length>0 ){
							leaveOpenState = this.timeFunc(leaveArr,allOpenArr,"离校时段和常开时段的起止时间冲突");
							if(leaveOpenState) return
						}
						if(leaveArr.length>0 && allCloseArr.length>0 ){
							leaveCloseState = this.timeFunc(leaveArr,allCloseArr,"离校时段和常闭时段的起止时间冲突");
							if(leaveCloseState) return
						}
						if(allOpenArr.length>0 && allCloseArr.length>0 ){
							openCloseState = this.timeFunc(allOpenArr,allCloseArr,"常开时段和常闭时段的起止时间冲突");
							if(openCloseState) return
						}*/
						if(enterArr.length>0 && leaveArr.length>0 && allOpenArr.length == 0 && allCloseArr.length == 0){
							//只有进校和离校 起止时间不需要验证
							enterLeaveState = true;
						}
						if(chooseTime){
							//至少一个符号条件
							//发送请求
							//获取参数
							let allCheckArr = [];
							let num = 0;
							for(let i=0;i<this.enterStepData.length;i++){
								// console.log(111,this.enterStepData[i].timeData.length)
								for(let j = 0;j<this.enterStepData[i].timeData.length;j++){

									if(Array.isArray(this.enterStepData[i].timeData[j].time) &&
									this.enterStepData[i].name &&
									this.enterStepData[i].timeData[j].applyWeek.length>0){
										// console.log(6664,this.enterStepData[i].timeData[j].applyWeek)
										allCheckArr[num] = {};
										allCheckArr[num].timeruleType = i;
										allCheckArr[num].timeName = this.enterStepData[i].name;
										allCheckArr[num].weekUse = this.enterStepData[i].timeData[j].applyWeek.join(',');
										allCheckArr[num].startTime = this.enterStepData[i].timeData[j].time[0];
										allCheckArr[num].endTime = this.enterStepData[i].timeData[j].time[1];
										num++;
									}
								}
							}
							// console.log("allCheckArr",allCheckArr)

							if(formName == "timeForm" ){
								let prams = {
									id:this[formName].ruleName,
									schoolId:localStorage.getItem('schoolId'),
									// schoolName:localStorage.getItem('schoolName'),
									startDate:this[formName].startDate[0],
									endDate:this[formName].startDate[1],
									list:allCheckArr
								}
								/*if(enterArr.length > 0 && leaveArr.length == 0 && allOpenArr.length == 0 && allCloseArr.length == 0){
								
									this.saveAjax(prams,'addTimeDialog','addInoutTime');
									return
								}else if(leaveArr.length > 0 && enterArr.length == 0 && allOpenArr.length == 0 && allCloseArr.length == 0){
								
									this.saveAjax(prams,'addTimeDialog','addInoutTime');
									return
								}else if(allOpenArr.length > 0 && leaveArr.length == 0 && enterArr.length == 0 && allCloseArr.length == 0){
									
									this.saveAjax(prams,'addTimeDialog','addInoutTime');
									return
								}else if(allCloseArr.length > 0 && leaveArr.length == 0 && allOpenArr.length == 0 && enterArr.length == 0){
								
									this.saveAjax(prams,'addTimeDialog','addInoutTime');
									return
								}else if(enterOpenState||enterCloseState||leaveOpenState||leaveCloseState||openCloseState||enterLeaveState){
								}*/
									this.saveAjax(prams,'addTimeDialog','addInoutTime');
									return


							}else if(formName == "changeTimeForm"){
								let prams = {
									id:this[formName].ruleName,
									schoolId:localStorage.getItem('schoolId'),
									startDate:this[formName].startDate[0],
									endDate:this[formName].startDate[1],
									list:allCheckArr
								}
								/*if(enterArr.length > 0 && leaveArr.length == 0 && allOpenArr.length == 0 && allCloseArr.length == 0){
									
									this.saveAjax(prams,'changeTimeDialog','updateInoutTime');
									return
								}else if(leaveArr.length > 0 && enterArr.length == 0 && allOpenArr.length == 0 && allCloseArr.length == 0){
									
									this.saveAjax(prams,'changeTimeDialog','updateInoutTime');
									return
								}else if(allOpenArr.length > 0 && leaveArr.length == 0 && enterArr.length == 0 && allCloseArr.length == 0){
									
									this.saveAjax(prams,'changeTimeDialog','updateInoutTime');
									return
								}else if(allCloseArr.length > 0 && leaveArr.length == 0 && allOpenArr.length == 0 && enterArr.length == 0){
									
									this.saveAjax(prams,'changeTimeDialog','updateInoutTime');
									return
								}else if(enterOpenState||enterCloseState||leaveOpenState||leaveCloseState||openCloseState||enterLeaveState){
								}	*/
									this.saveAjax(prams,'changeTimeDialog','updateInoutTime');
									return


							}
						}

					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			/**
			 *  @function: 表格跨行方法
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
					// console.log(1234,row, column, rowIndex, columnIndex)
				if (columnIndex < 3 || columnIndex == 5 ||columnIndex == 8 || columnIndex == 11 || columnIndex > 13) {
					const _row = this.spanArr[rowIndex];
					const _col = _row > 0 ? 1 : 0;
					return {
						rowspan: _row,
						colspan: _col
					}
				}
			},
			/**
			 *  @function: 表格跨行数据获取
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			getSpanArr(data) {
				// console.log("getSpanArr:",data)
				this.spanArr = [];
				for (let i = 0; i < data.length; i++) {
					if (i === 0) {
						this.spanArr.push(1);
						this.pos = 0
					} else {
						// 判断当前元素与上一个元素是否相同--->找数组中相同的字段进行分组
						if (data[i].id == data[i - 1].id) {
							this.spanArr[this.pos] += 1;
							this.spanArr.push(0);
						} else {
							this.spanArr.push(1);
							this.pos = i;
						}
					}
				}
			},
			/**
			 *  @function: 时间范围选择--自定义选择日期--点击效果
			 *  @author: lxr
			 *  @date 2018-7-20
			 **/
			dateClick(){
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
			 *  @date 2018-7-17
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.getTableList(this.activeInputId);//加载表格列表
			},
			/**
			 *  @function: 获取规则列表数据
			 *  @author: cs
			 *  @date 2018-09-14
			 **/
            loadRuleData(){
				let params = {
						schoolId:localStorage.getItem('schoolId')
				}
                this.$api.Rules.getRuleList({schoolId:params.schoolId}).then(res => {
					// console.log('获取规则列表数据:', res.data.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.buildingData = res.data.data;
						// this.activeInputId = '';
						this.resizeInputWidth();//重定义input宽
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
            },
			/**
			 *  @function: 加载权限数据
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			loadLimitData(){
				let vThis = this
				let num = 0;
				for(let i=0;i<vThis.tableData.length;i++){

					if (i === 0) {
						num = 1
					} else {
						// 判断当前元素与上一个元素是否相同
						if (vThis.tableData[i].id != vThis.tableData[i - 1].id) {
							num++;
//						    console.log(888,num)
						}
					}
					// vThis.tableData[i].indexID = (vThis.currentPage - 1) * vThis.pageSize + num*1;

					vThis.$set(vThis.tableData[i],'indexID',(vThis.currentPage - 1) * vThis.pageSize + num*1)//序号计算(当前页码-1)*当页条数+变化的i值+1
				}

			},
			/**
			 *  @function: 重新获取宽高
			 *  @author: lxr
			 *  @date 2018-7-20
			 **/
            resizeLayout(){
	            setTimeout(()=> {
		            let icH = $('.index > .m-cen').height();
		            let stH = $('.index .set-top').height();
		            let ttH = $('.stu-rule-time > .m-top').height();
		            let obH = $('.stu-rule-time .m-cen .title').height();
		            let pbH = $('.pagination-box').height();
					let tblH = icH - stH - ttH - obH - pbH - 25 ;
					// console.log(11,icH , stH , ttH , obH , pbH,tblH)
		            $('.stu-rule-time .m-cen .content').height(tblH)
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
		            let actInput = $('.stu-rule-time .m-top .el-input input');
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
		            res.textLen = Math.floor(($(input).val().match(re3)).length * 1.85);
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
			 *  @function: 时间对比
			 *  @author: cs
			 *  @date 2018-08-30
			 **/
			timeContrast(beginTime, endTime, cBeginTime, cEndTime) {
				//beginTime:参照开始时间
				//endTime:参照结束时间
				//cBeginTime:要对比的开始时间
				//cEndTime:要对比的结束时间
				// console.log(111,beginTime, endTime, cBeginTime, cEndTime)
				let strb = beginTime.split(":");
				if (strb.length != 2) {
					return false;
				}
				let stre = endTime.split(":");
				if (stre.length != 2) {
					return false;
				}
				let strbn = cBeginTime.split(":");
				if (strbn.length != 2) {
					return false;
				}
				let stren = cEndTime.split(":");
				if (stren.length != 2) {
					return false;
				}
				let b = new Date();
				let e = new Date();
				let n = new Date();
				let be = new Date();

				b.setHours(strb[0]);
				b.setMinutes(strb[1]);
				e.setHours(stre[0]);
				e.setMinutes(stre[1]);
				n.setHours(strbn[0]);
				n.setMinutes(strbn[1]);
				be.setHours(stren[0]);
				be.setMinutes(stren[1]);
				if ((n.getTime() - b.getTime() >= 0 && n.getTime() - e.getTime() <= 0)
					|| (be.getTime() - b.getTime() >= 0 && be.getTime() - e.getTime() <= 0)){
					// console.log("重合" )
					return true;
				} else {
					// console.log("不重合")
					return false;
				}
			},
			/**
			 *  @function: 时间验证
			 *  @author: cs
			 *  @date 2018-09-01
			 **/
			timeFunc(oneArr,twoArr,msg){
				// console.log(888)
				if(oneArr.length>0 && twoArr.length>0){
					for(let i = 0;i<oneArr.length;i++){
						for(let j =0;j< twoArr.length;j++){
							if(this.timeContrast(oneArr[i][0],oneArr[i][1],twoArr[j][0],twoArr[j][1])){
								//本时段自身有重合
								this.$message({
									showClose: true,
									message: msg,
									type: "warning",
									duration: this.msgDuration
								});
								return false
							}
							else{
								return true;
							}
						}
					}
				}
			},
			/**
			 *  @function: 进出时段tab切换
			 *  @author: cs
			 *  @date 2018-08-30
			 **/
			enterTimeClick(index){
				this.ac = index;
			},
			/**
			 *  @function: 新增起止时间
			 *  @author: cs
			 *  @date 2018-08-30
			 **/
			addTime(item){
				// console.log('新增起止时间',item)
				if(item.timeData[item.timeData.length-1].time == '' || item.timeData[item.timeData.length-1].applyWeek == 0){
					this.$message({
						showClose: true,
						message: "请选择起止时间和适用星期",
						type: "warning",
						duration: this.msgDuration
					});
				}else if(item.timeData.length>4){
					this.$message({
						showClose: true,
						message: "最多能添加5个时段",
						type: "warning",
						duration: this.msgDuration
					});
				}else{
					item.timeData.push({
						time:'',
						applyWeek:[]
					})
					setTimeout(()=>{//必须加延迟，否则获取不到dom
						let scrollDiv = $('.scroll-box').eq(this.ac)[0].scrollHeight
                        $('.scroll-box').scrollTop(scrollDiv);//设置弹窗content滚动条始终在底部
                        console.log("scrollDiv",scrollDiv);
                        
						// $('.scroll-box').eq(this.ac)[0]
						// let scrollDiv = $(this.$refs.timeForm.$el).parent()[0].scrollHeight;
						// $(this.$refs.timeForm.$el).parent().scrollTop(scrollDiv);
					},10)
				}
			},
			/**
			 *  @function: 删除时段
			 *  @author: cs
			 *  @date 2018-08-30
			 **/
			delTime(item,idx){
				// console.log('删除起止时间:',item,idx)
				item.timeData.splice(idx,1)
			},
			checkChange(item){
				item.sort((num1,num2)=>{  
					let temp1 = parseInt(num1);  
					let temp2 = parseInt(num2);  
					if (temp1 < temp2) { 
						   return -1;  
					} else if(temp1 == temp2) { 
						return 0;  } 
					else { 
						return 1;  
					}
				});
				// console.log("val:",item)
			},
			/**
			 *  @function: 查询学校进出时间段信息 table列表
			 *  @author: cs
			 *  @date 2018-09-10
			 **/
			getTableList(id){
				// console.log("id:",id)
				this.tableLoading = true;
				let params = {
					"count": true,
					"page_size": this.pageSize,
					"page_index": this.currentPage,
					"search": {
						id:id
					}
				}
                this.$api.Rules.getInoutTime(params).then(res => {
					console.log('获取规则列表数据:', res.data.data.records)
					this.tableLoading = false;
					if (res.data.code == 600 || res.data.code == 0) {
						this.tableData = res.data.data.records;
						this.pageAllNum = res.data.data.total_record;//表格内容总数量
						for(let i = 0; i <this.tableData.length;i++){
							this.tableData[i].indexID = i+1;
						}
						this.getSpanArr(this.tableData);//获取跨行跨列数据(时段)
						// this.addBtnState = true;
						this.loadLimitData();
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
                })
			},
			/**
			 *  @function: 新增学校进出时间段
			 *  @author: cs
			 *  @date 2018-09-10
			 **/
			saveAjax(params,dialog,name){
				// console.log("params:",params)
				Loading.service();
				if(name === "addInoutTime"){
					this.$api.Rules.addInoutTime(params).then(res => {
						Loading.service().close();
						// console.log('新增学校进出时间段:', res.data)
						if (res.data.code == 600 || res.data.code == 0) {
							this.getTableList(this.activeInputId);
							this[dialog] = false;
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}else{
					this.$api.Rules.updateInoutTime(params).then(res => {
						Loading.service().close();
						// console.log('修改学校进出时间段:', res.data.data)
						if (res.data.code == 600 || res.data.code == 0) {
							this.getTableList(this.activeInputId);
							this[dialog] = false;
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}
                
			},
			/**
			 *  @function: 角色组权限table列表数组转换
			 *  @author: cs
			 *  @date 2018-09-10
			 **/
			transArr(data){
				if(!Array.isArray(data)) return
				if(data.length == 0) return []
				let num = 0;
				let enterStepData = [];
				let length = data.length;
				for(let i = 0;i<length;i++){
					if(3 == data[i].id){
							if(Array.isArray(enterStepData[0].timeData[0])){
								data[i].enterStepData[0].timeData.push({
									time:data[j].enterTime?data[j].enterTime.split('-'):''
								})
							}
						enterStepData = [
							{
								name:data[num].timeName1,
								applyWeek:data[num].enterWeekId,
								timeData:[
									{
										time:data[num].enterTime?data[num].enterTime.split('-'):''
									}
								],

							},
							{
								name:data[num].timeName2,
								applyWeek:data[num].leaveWeekId,
								timeData:[
									{
										time:data[num].leaveTime?data[num].leaveTime.split('-'):''
									}
								]
							},
							{
								name:data[num].timeName3,
								applyWeek:data[num].openWeekId,
								timeData:[
									{
										time:data[num].openTime?data[num].openTime.split('-'):''
									}
								]
							},
							{
								name:data[num].timeName4,
								applyWeek:data[num].closeWeekId,
								timeData:[
									{
										time:data[num].closeTime?data[num].closeTime.split('-'):''
									}
								]
							},
						];
						num++
					}
					// for(let j=i+1;j<length;j++){
					// 	if(data[i].id == data[j].id){

					// 		if(Array.isArray(data[i].enterStepData[1].timeData[0])){
					// 			data[i].enterStepData[1].timeData.push({
					// 				time:data[j].leaveTime?data[j].leaveTime.split('-'):''
					// 			})
					// 		}
					// 		if(Array.isArray(data[i].enterStepData[2].timeData[0])){
					// 			data[i].enterStepData[2].timeData.push({
					// 				time:data[j].openTime?data[j].openTime.split('-'):''
					// 			})
					// 		}
					// 		if(Array.isArray(data[i].enterStepData[3].timeData[0])){
					// 			data[i].enterStepData[3].timeData.push({
					// 				time:data[j].closeTime?data[j].closeTime.split('-'):''
					// 			})
					// 		}
					// 		data.splice(j,1);
					// 		length--;
					// 		j--;
					// 	}
					// }
				}
				// console.log(123,enterStepData)
				return data
			},

		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.loadRuleData();//获取规则数据
			setTimeout(()=>{
				this.resizeLayout();//重新获取宽高
			},100)
			this.resizeLayout();//重新获取宽高
			this.resizeInputWidth();//重定义input宽
			this.getTableList(this.activeInputId);//获取table列表
			// console.log(1111,this.tableData);

		}
	}
</script>

<style type="text/scss" lang="scss" scoped>

    .stu-rule-time {
        width: 100%;
        height: 100%;
        margin: 0 auto;

        .m-top{
            width:100%;
            height:auto;
            background:#fff;
            margin-bottom: 15px;
            .content{
                max-height: 110px;
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
        .m-cen{
            width:100%;
            height:auto;
            background:#fff;
            .title{
                border: 0;
                border-bottom: 1px solid #e1e1e1;
            }
            > .content{
                /deep/ .el-table{
                    .el-table__fixed-right {
                        border-left: 1px solid #ebeef5;
                    }
                    .def-time-name{
                        color: #828282;
                    }
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
            .sch-system-dialog{
                 .el-form-item{
                    width:95%;
                    text-align: left;
                    position: relative;
                    padding-bottom: 0;
					&:nth-of-type(1){
						display: inline-block;
						width: 31%;
						width: 250px;
					}
					&:nth-of-type(2){
						display: inline-block;
						width: 57%;
						width: 450px;
					}
					// &:nth-of-type(3){
					// 	.el-form-item__content{
					// 	  height: 35px !important;
					//  }
					// }
                    /deep/ .el-radio-group{
                        .el-radio{
                            display: inline-block;
                        }
                    }
                    span.tool-span{
                        font-size: 12px;
                        margin-left: 5%;
                        margin-right: 8px;
                    }
                    // &:nth-of-type(2){
                        // padding-bottom: 20px;
                        // border-bottom: 1px solid #E1E1E1;
                    // }

                     .delect-btn{
                         content: '';
                         color: red;
                         position: absolute;
                         bottom: -10px;
                         right: 0px;
                         width: 20px;
                         height: 20px;
                         background: url("../../../assets/images/del.png") no-repeat;
                         cursor: pointer;
                     }

                }
				.add-time-box{
					padding-top: 4px;
					ul{
						 width: 400px;
						 height: 40px;
						 overflow: hidden;
						 position: relative;
						 z-index: 5;
						 li{
							 float: left;
							 width: 100px;
							 height: 40px;
							 line-height: 40px;
							 font-size: 12px;
							 border: 1px solid #E4E7ED;
							 background-color: #fdfdfd;
							 border-right:0;
							 cursor: pointer;
							 text-align: center;
							 &:nth-of-type(1){
								 border-top-left-radius: 5px;
							 }
							 &:nth-last-of-type(1){
								 border-top-right-radius: 5px;
								  border-right: 1px solid #E4E7ED;
							 }
						 }
						 .ac{
							 color: #1cab7d;
							  border-bottom: 0;
						 }
					 }
					 /deep/ .el-form-item__content{
						  width: 82% !important;
					 }

					 .tools-wrap{
						border: 1px solid #E4E7ED;
						position: relative;
						z-index: 1;
						top: -1px;
                         border-radius: 0 0 5px 5px;
                         overflow: hidden;
                         box-sizing: content-box;
						&:before{
							content: '';
							width: 399px;
							height: 1px;
							background-color: #fdfdfd;
							position: absolute;
							left: 0;
							top: -1px;
							z-index: 3;
						 }
						.scroll-box{
							max-height: 250px;
							overflow-y: auto;
						}
						 .tools{
								text-align: left;
								margin-bottom: 15px;
								&:nth-of-type(1){
									margin-bottom: 0;
									margin-top: 15px;
								}
								span.tools-span{
									font-size: 12px;
									margin-left: 26px;
									margin-right: 8px;
								}
								.el-checkbox-group{
									display: inline-block !important;
									.el-checkbox{
										margin-left: 22px !important;
										&:nth-of-type(1){
											margin-left: 0 !important;
										}
									}
								}
								img{
									width: 30px;
									height: 30px;
									border-radius: 50%;
									display: inline-block;
									vertical-align: middle;
									margin-left: 5px;
									cursor: pointer;
								}
							}
						 .inner-box{
							position: relative;
							text-align: right;
							border-bottom: 1px solid #E4E7ED;
							&:nth-of-type(1){
								border-top: 1px solid #E4E7ED;
							}
							
							.del-time{
								width: 20px;
								position: absolute;
								right: 5px;
								top: -27px;
								cursor: pointer;
							}
							
							&:nth-last-child(1){
								border-bottom: 0;
							 }
						 }
                         /deep/ .add-time{
								width: 100%;
								cursor: pointer;
                                .button{
                                    border-radius: 0;
                                }
                        }
					 }

				}
                .el-input__inner{
                    /deep/ input{
                        border: 0!important;
                    }
                }
                /deep/ .el-radio-group{
                    line-height: 40px;
                    position: relative;
                    .el-radio{
                        display: inline-block;
                    }
                }
                /deep/ .el-dialog__body{
                    position: relative;
                    padding-right: 0;
					padding-bottom: 10px;
                    .content{
                        overflow-y: hidden;
                        max-height:415px;
                    }
					.el-range-separator{
						font-size: 12px !important;
						color: #606266 !important;
					}
                    .add-time-btn{
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        height: 45px;
                        line-height: 45px;
                        width: 100%;
                        background: #F6F8FA;
                        border-top: 1px solid #e1e1e1;
                        border-radius: 0 0 5px 5px;
                        cursor: pointer;
                        text-align: center;
                        font-size: 12px;
                        &:hover{
                            background: #1cab7d;
                            color: #fff;
                        }

                    }
                }
                /deep/ .el-dialog__footer{
                    .dialog-footer{
                        > span{
                            line-height: 30px;
                            display: block;
                            font-size: 12px;
                            color: #797979;
                            text-align: left;
                            padding-left: 3%;
                            margin-bottom: 20px;
                        }
                        .button-div{
                            margin-right: 20px;
                        }
                    }
                }
            }
        }
        .m-bom{
            .table-box{
                /deep/ .el-table thead th{
                    background: #fff;
                }
                .roll-span{
                    border-bottom: 1px solid #1cab7d;
                    color: #1cab7d;
                }
                /deep/ table td:last-child .cell{
                    text-align: center;
                }
                .operate1-div{
                    display: inline-block;
                    border: 1px solid #1cab7d;
                    color: #1cab7d;
                    padding: 2px 10px;
                    border-radius: 4px;
                    margin-right: 10px;
                }
                .operate2-div{
                    display: inline-block;
                    border: 1px solid #FF4E4E;
                    color: #FF4E4E;
                    padding: 2px 10px;
                    border-radius: 4px;
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
