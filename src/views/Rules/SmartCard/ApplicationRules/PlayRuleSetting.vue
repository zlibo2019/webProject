<template>
    <div class="content-setting">
		<div class="detail-mid">
			<ul>
				<li v-for="(item, index) in ruleTypeData" @click="navClick(item)" :key="index" :class="{active:item.value == rule_type}">
					{{ item.rule_name }}
					<img :src="defArrow">
				</li>
			</ul>
			<Button title="添加规则" btnClass="custom8" btnFontSize="12px" btnHeight="4vh"
					@click="btnClick"></Button>
		</div>
        <el-main class="rule-list">
			<el-table id="table" ref="aisleTable" height="100%" :data="tableData" tooltip-effect="dark" border highlight-current-row 
				style="width: 100%"  row-key="deviceinfo_id" v-loading="tableLoading" :span-method="objectSpanMethod">
				<el-table-column prop="indexID" label="序号" width="60" align="center"></el-table-column>
				<el-table-column prop="rule_name" label="规则名称" width="100" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column prop="rule_name" label="规则类型" width="100" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
						<span v-if="scope.row.is_system == 1">默认规则</span>
						<span v-else>创建规则</span>
					</template>
                </el-table-column>
				
				<el-table-column v-if="rule_type == 1 || rule_type == 2" prop="begin_time" label="开始时间" width="100" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="rule_type == 1 || rule_type == 2" prop="end_time" label="结束时间" width="100" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="rule_type == 1 || rule_type == 2" prop="week" label="适用星期" width="100" align="center" show-overflow-tooltip>
          <!-- <template slot-scope="scope">
						<span>{{numToWeek(scope.row.weeks).join(',')}}</span>
					</template> -->
        </el-table-column>
				
				<el-table-column v-if="rule_type == 3" prop="pic_duration" label="图片轮播间隔" width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="rule_type == 3" prop="word_duration" label="文字滚动间隔" width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="rule_type == 3" prop="new_duration" label="信息类滚动间隔" width="135" align="center" show-overflow-tooltip></el-table-column>
				
				<el-table-column v-if="rule_type == 4" prop="pic_count" label="图片展示数量" width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="rule_type == 4" prop="video_count" label="视频展示数量" width="120" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column v-if="rule_type == 4" prop="show_duration" label="信息类保留时间" width="135" align="center" show-overflow-tooltip></el-table-column>
				
				<el-table-column label="有效时间范围" align="center" width="200" show-overflow-tooltip>
					<template slot-scope="scope">
						<span v-if="scope.row.is_always == 1">一直有效</span>
						<span v-else-if="scope.row.is_always == 0 && scope.row.begin_date && scope.row.end_date">{{scope.row.begin_date}} 至 {{scope.row.end_date}}</span>
						<span v-else>无</span>
					</template>
				</el-table-column><el-table-column prop="room_list" label="适用教室" width="100" align="center" show-overflow-tooltip></el-table-column>
				<el-table-column fixed="right" label="操作" align="center" min-width="150">
					<template slot-scope="scope">
						<el-button class="normal" size="mini" plain @click="btnClick(scope.row)">修改</el-button>
						<el-button class="warning" size="mini" v-if="scope.row.is_system != 1" plain @click="delClick(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-main>
		<div class="pagination-box">
			<el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
							:current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
		</div>

		<!-- 新建，修改规则 -->
		<el-dialog :title="chooseType==0?'新建规则':'修改规则'" :visible.sync="ruleDialog" v-if="ruleDialog" width="900px" center class="add-rule-dialog">
			<div class="content">
				<el-form ref="roleForm" label-width="110px" :inline="true" :model="roleForm" :rules="rules">
					<el-form-item label="规则类型：" prop="rule_type">
						<el-select v-model="roleForm.rule_type" :disabled="chooseType==1" placeholder="请选择规则名称" size="small" style="width: 150px;" @change="chooseRuleType">
							<el-option :label="item.rule_name" :value="item.rule_type" :key="item.rule_type" v-for="item in ruleTypeData"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="规则名称：" prop="rule_name">
						<el-input v-model="roleForm.rule_name" placeholder="请输入规则名称" clearable></el-input>
					</el-form-item>
					<el-form-item label="有效时间范围：" prop="validTime">
						<el-date-picker type="daterange" placeholder="选择日期"
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
							v-model="roleForm.validTime"
							value-format="yyyy-MM-dd"
                            style="width:340px"
							size="small" >
						</el-date-picker>
					</el-form-item>
					<el-form-item label="规则内容：" class="add-time-box" v-show="roleForm.rule_type == 1 || roleForm.rule_type == 2">
						<div class="tools-wrap">
							<div class="scroll-box" >
								<div class="inner-box" v-for="(item,index) in enterStepData" :key="index">
									<img src="../../../../assets/images/del.png" title="删除时段" class="del-time" @click="delTime(item,index)" v-show="index != 0">
									<div class="tools">
										<span class="tools-span">适用星期：</span>
										<el-checkbox-group v-model="item.applyWeek" @change="checkChange">
											<el-checkbox :label="week.value" :key="weekIndex" v-for="(week,weekIndex) in weekData">{{week.title}}</el-checkbox>
										</el-checkbox-group>
									</div>
									<div class="tools" >
										<span class="tools-span">起止时间：</span>
										<el-time-picker
											is-range
											v-model="item.time"
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
							<Button title="添加时段" btnClass="custom8" btnFontSize="14px" btnHeight="4.5vh" @click="addTime" class="add-time"></Button>
						</div>
					</el-form-item>
					<el-form-item label="规则内容：" class="set-time-box" v-show="roleForm.rule_type == 3">
						<div class="time-box">
							<div class="inner-box"><dd>图片轮播间隔：</dd><el-input-number v-model="roleForm.pic_duration" :min="1"></el-input-number></div>
							<div class="inner-box"><dd>文字滚动间隔：</dd><el-input-number v-model="roleForm.word_duration" :min="1"></el-input-number></div>
							<div class="inner-box"><dd>信息类轮播间隔：</dd><el-input-number v-model="roleForm.new_duration" :min="1"></el-input-number></div>
						</div>
					</el-form-item>
					<el-form-item label="规则内容：" class="set-time-box" v-show="roleForm.rule_type == 4">
						<div class="time-box">
							<div class="inner-box"><dd>图片展示数量：</dd><el-input-number v-model="roleForm.pic_count" :min="1"></el-input-number></div>
							<div class="inner-box"><dd>视频展示数量：</dd><el-input-number v-model="roleForm.video_count" :min="1"></el-input-number></div>
							<div class="inner-box"><dd>信息类保留时间：</dd><el-input-number v-model="roleForm.show_duration" :min="1"></el-input-number></div>
						</div>
					</el-form-item>
					<el-form-item label="适用教室：">
                        <SelectTree 
							v-model="roleForm.place_id"
                            @labelVal="getPlaceName"
                            :defaultKeys="defaultKeys"
							:options="treeData" 
							:props="defaultProps"
                            placeholder="请选择场所/教室"
                            size='medium'
							width="200"></SelectTree>
					</el-form-item>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
				<!-- <span>注：未设置的时段系统默认可刷卡进校，刷卡不可离校（请假除外）。</span> -->
				<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="ruleDialog = false"></Button>
				<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveRuleForm"></Button>
			</span>
		</el-dialog>

        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	import SelectTree from '@/components/SelectTree/SelectTree'

	export default {
		name: 'ContentSetting',
		components: {
			Button, Toast,SelectTree
		},
		data() {
			return {
                defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				tableLoading: false,        //表格加载动画
				allNum: 1,             //table数组总条数
				currentPage: 1,      //当前页（默认设为第一页）
				pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				ruleDialog:false,//新增规则弹窗
				roleForm:{
					rule_type:'',	//规则类型
                    rule_name:'',	//规则名称
                    place_id:[10010],
                    // place_id:10010,
					validTime:[],	//有效时间范围
					pic_duration:'',//图片间隔
					word_duration:'',//文字间隔
					new_duration:'',//信息类间隔
					pic_count:'',//图片展示数量
					video_count:'',//视频展示数量
					show_duration:'',//信息类保留时间
				},//新增规则弹窗
				rules: {
					rule_type: [
						{ required: true, message: '请选择规则', trigger: 'change' }
					],
					rule_name: [
						{ required: true, message: '请输入规则名称', trigger: 'blur' }
					],
					applyWeek: [
						{ type: 'array', required: true, message: '请选择适用星期', trigger: 'change' }
					],
					validTime: [
						{ type: "array", required: true, message: '请选择日期', trigger: 'change' }
					]
				},
				ruleTypeData:[
					{
						rule_name:'关机设置',
						rule_type:1,
						value:'1',
					},
					{
						rule_name:'休眠设置',
						rule_type:2,
						value:'2',
					},
					{
						rule_name:'轮播设置',
						rule_type:3,
						value:'3',
					},
					{
						rule_name:'内容展示设置',
						rule_type:4,
						value:'4',
					}
				],//规则类型
				rule_type:1,//选中的规则类型
				enterStepData:[
					{
						time:'',
						applyWeek:[],
					},
				],//进出时段数据 格式
				tableData:[],
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
                chooseType:0,//点击新增还是修改 0新增 1修改
                treeData: [],
                defaultKeys: [],
                defaultProps: {
					parent_id: 'pid',   // 父级唯一标识
					id: 'id',          // 唯一标识
					label: 'label',       // 标签显示
					children: 'children', // 子级
                },
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
					let istH = $('.index .set-top').height();	
					let stH = $('.index .setting-top').height();	
					let dmH = $('.index .detail-mid').height();	
					let pbH = $('.pagination-box').height();
					let tblH = icH - istH - stH - dmH - pbH -20;
					console.log(66, icH, istH, stH, dmH, pbH , tblH)
					$('.content-setting .rule-list').height(tblH)
				}, 20)
			},
			/**
			 *  @function: toast关闭
			 *  @author: cs
			 *  @date 2018-08-01
			 */
			hideToast() {
				this.isToast = false;
			},
			/**
			 *  @function: tab点击
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			navClick(item){
                console.log('tab点击',item);
                if( this.rule_type == item.value) return
                this.rule_type = item.value;
                this.getTableData();
			},
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val;
				// this.changePage(this.pageItem, this.currentPage);
			},
			/**
			 *  @function:删除规则
			 *  @author: cs
			 *  @date 2018-12-21
			 **/
			delRule(item) {
				console.log('删除规则:',item);
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					this.$message({
						showClose: true,
						type: 'success',
						message: '删除成功!',
						duration: this.msgDuration
					});//请求删除成功之后提示
				}).catch(() => {});
			},
			/**
			 *  @function:新增规则
			 *  @author: cs
			 *  @date 2018-12-21
			 **/
			addRule() {
				console.log('新增规则:');
				this.ruleDialog = true;
				setTimeout(() => {
					// console.log(this.$refs["roleForm"]);
					this.$refs["roleForm"].resetFields();
				},20)
			},
			/**
			 *  @function:选择类型
			 *  @author: cs
			 *  @date 2018-12-21
			 **/
			chooseRuleType(val){
				console.log("val:",val)
			},
			/**
			 *  @function:选择星期
			 *  @author: cs
			 *  @date 2018-12-21
			 **/
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
				console.log("val:",item)
			},
			/**
			 *  @function: 删除时段
			 *  @author: cs
			 *  @date 2018-08-30
			 **/
			delTime(item,index){
				console.log('删除起止时间:',item,index)
				this.enterStepData.splice(index,1)
			},
			/**
			 *  @function: 新增起止时间
			 *  @author: cs
			 *  @date 2018-08-30
			 **/
			addTime(){
				// console.log('新增起止时间',this.enterStepData)
				let choose = false;
				for (let i = 0; i < this.enterStepData.length; i++) {
					if(this.enterStepData[i].time == '' || this.enterStepData[i].applyWeek.length == 0){
						choose = true;
						break
					}
				}
				if(choose){
					this.$message({
						showClose: true,
						message: "请选择起止时间和适用星期",
						type: "warning",
						duration: this.msgDuration
					});
				}else if(this.enterStepData.length>4){
					this.$message({
						showClose: true,
						message: "最多能添加5个时段",
						type: "warning",
						duration: this.msgDuration
					});
				}else{
					this.enterStepData.push({
						time:'',
						applyWeek:[]
					})
					setTimeout(()=>{//必须加延迟，否则获取不到dom
						let scrollDiv = $('.scroll-box')[0].scrollHeight;
						$('.scroll-box').scrollTop(scrollDiv);//设置弹窗content滚动条始终在底部
					},10)
				}
			},
			/**
			 *  @function: 新增规则保存
			 *  @author: cs
			 *  @date 2018-12-21
			 **/
			saveRuleForm(){
                console.log('新增规则保存',this.roleForm,this.enterStepData)
				this.$refs.roleForm.validate((valid) => {
					if (valid) {
                        let chooseTime = false;//至少有一项满足条件
                        let params = {
                            "dic_type": "a",
                            "dic_code": null,
                            "place_id": this.roleForm.place_id,
                            "rule_name": this.roleForm.rule_name,
                            "rule_type": this.roleForm.rule_type,
                            "begin_date": this.roleForm.validTime[0],
                            "end_date": this.roleForm.validTime[1],
                            "school_id": localStorage.getItem('schoolId'),
                        }
                        if(this.roleForm.rule_type == 1 || this.roleForm.rule_type == 2){
                            console.log('关机，休眠设置');
                            params.data = [];
                            for (let i = 0; i < this.enterStepData.length; i++) {
                                console.log(11,this.enterStepData[i].time,this.enterStepData[i].applyWeek,Array.isArray(this.enterStepData[i].time) , this.enterStepData[i].applyWeek.length);
                                let obj = {};
                                if(Array.isArray(this.enterStepData[i].time) && this.enterStepData[i].applyWeek.length > 0){
                                    console.log(1111);
                                    
                                    chooseTime = true;
                                    obj.begin_time = this.enterStepData[i].time[0];
                                    obj.end_time = this.enterStepData[i].time[1];
                                    obj.weeks = this.enterStepData[i].applyWeek.join(',');//this.weekToNumParams()
                                    params.data.push(obj)
                                }else if(Array.isArray(this.enterStepData[i].time) || this.enterStepData[i].applyWeek.length > 0){
                                    console.log(2222);
                                    chooseTime = false
                                    
                                }else{
                                    console.log(3333);
                                    if(this.enterStepData.length>1){
                                    console.log(4444);
                                        chooseTime = true;
                                    }
                                }
                            }
                            
                            if(!chooseTime){
                                this.$message({
                                    showClose: true,
                                    message: '请选择适用星期和起止时间',
                                    type: "warning",
                                    duration: this.msgDuration
                                });
                                return
                            };
                        }else if(this.roleForm.rule_type == 3){
                            console.log('轮播设置');
                            params.data ={};
                            params.data.pic_duration = this.roleForm.pic_duration;
                            params.data.word_duration = this.roleForm.word_duration;
                            params.data.new_duration = this.roleForm.new_duration;
                        }else if(this.roleForm.rule_type == 4){
                            console.log('内容展示设置');
                            params.data ={};
                            params.data.pic_count = this.roleForm.pic_count;
                            params.data.video_count = this.roleForm.video_count;
                            params.data.show_duration = this.roleForm.show_duration;
                        }
                        console.log("params",params);
                        this.$loading();
                        let type ='';
                        let id = ''
                        if(this.chooseType == 0){
                            type = 'post';
                        }else if(this.chooseType == 1){
                            type = 'put';
                            id = this.roleForm.id;
                        }
                        this.$api.Rules.palyRuleList(type,params,id).then(res => {
                            console.log('修改班牌规则列表', res.data);
                            this.$loading().close();
                            if (res.data.code == 600 || res.data.code == 0) {
                                this.getTableData();
                            } else {
                                this.isToast = true;
                                this.toast = res.data.msg;
                            }
                        }).catch(err =>{
                            this.$loading().close();
                        })
						this.ruleDialog = false;
                        console.log('roleForm',this.roleForm);
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
			 *  @function: 选择教室
			 *  @author: cs
			 *  @date 2018-12-21
			 **/
			selectClassroom(){
				console.log('选择教室：')
			},
			/**
			 *  @function: 表格跨行方法
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
                    // console.log(1234,row, column, rowIndex, columnIndex)
                if(this.rule_type == 3 || this.rule_type == 4) return
				if (columnIndex < 3 || columnIndex > 5 ) {
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
				// console.log(147,data)
				this.spanArr = [];
				for (let i = 0; i < data.length; i++) {
					if (i == 0) {
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
					vThis.$set(vThis.tableData[i],'indexID',(vThis.currentPage - 1) * vThis.pageItem + num*1)//序号计算(当前页码-1)*当页条数+变化的i值+1
				}

			},
			/**
			 *  @function: 获取班牌规则列表
			 *  @author: cs
			 *  @date 2019-01-15
			 **/
			getTableData(){
        console.log('获取班牌规则列表')
        let params = {
            school_id: localStorage.getItem('schoolId'),
            rule_type:this.rule_type
        };
        this.$loading();
        console.log('params', params);
        this.$api.Rules.palyRuleList('get',params).then(res => {
            console.log('获取班牌规则列表', res.data);
            this.$loading().close();
            if (res.data.code == 600 || res.data.code == 0) {
                this.tableData = res.data.data.rows;
                this.tableData.forEach(item=>{
                    if(item.weeks){
                        // console.log("item.weeks:",item.weeks.split(','));
                        let week = item.weeks.split(',');
                        let weekVal =  week.map(element=>{
                            console.log("item.weeks:",element);
                            return this.weekData[element-1].title
                            // return element
                        })

                        // let week = item.weeks.split(',');
                        // week = this.numToWeek(week);
                        this.$set(item,'week',weekVal.join(','))
                    }
                })
                // console.log( this.tableData);
                this.getSpanArr(this.tableData);//获取跨行跨列数据
                this.loadLimitData();
            } else {
                this.isToast = true;
                this.toast = res.data.msg;
            }
        }).catch(err =>{
          // console.log('errrrrrr:', err);
            this.$loading().close();
        })
      },
			/**
			 *  @function:新增，修改规则
			 *  @author: cs
			 *  @date 2018-12-21
			 **/
            btnClick(row) {
                console.log('新增,修改规则',row);
                this.getPlaceTree();
				this.ruleDialog = true;
                setTimeout(() => {
                   	this.$refs.roleForm.resetFields();
                    this.roleForm.rule_type = this.rule_type*1;
                    if(row){
                        this.chooseType = 1;
                        this.getPalyRuleDetail(row.id);
                        this.roleForm.rule_name = row.rule_name;
                    }else{
                        this.chooseType = 0;
                        this.roleForm.place_id = [];
                        this.enterStepData = [{"time": "", "applyWeek":[]}];
                        this.roleForm.rule_name = '';
                        this.roleForm.validTime = '';
                        this.defaultKeys = [];
                    }
                }, 20);
            },
            /**
			 *  @function: 表格行删除
			 *  @author: cs
			 *  @date 2019-01-16
			 */
			delClick(row) {
                console.log("delClick:", row)
                this.$confirm('将永久删除此规则，是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
                    this.$loading();
                    let params = {
                        id:row.id,
                        school_id: localStorage.getItem('schoolId'),
                    };
                    this.$api.Rules.palyRuleList('delete',params).then( res => {
                        console.log('表格行删除', res.data);
                        this.$loading().close();
                        if (res.data.code == 600 ||　res.data.code == 0) {
                            this.getTableData();
                        } else {
                            this.isToast = true;
                            this.toast = res.data.msg;
                        }
                    }).catch(err =>{
                        this.$loading().close();
                    })
				}).catch(() => {//点击取消按钮
					
				});
			},
            /**
			 *  @function: 获取规则详细
			 *  @author: cs
			 *  @date 2019-01-16
			 */
			getPalyRuleDetail(rule_id) {
                console.log("获取规则详细:" )
                let params = {
                    rule_id:rule_id,
                    school_id: localStorage.getItem('schoolId'),
                };
                this.$api.Rules.getPalyRuleDetail('get',params).then( res => {
                    console.log('获取规则详细', res.data,this.roleForm.rule_type);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        if(this.roleForm.rule_type == 1 || this.roleForm.rule_type == 2){
                            res.data.data.data.forEach((item,index) => {
                            item.time = [item.begin_time , item.end_time]
                            let week = []
                            if(item.weeks){
                                    week = item.weeks.split(',')
                                }
                                item.applyWeek =  this.weekToNum(week);
                            });
                            this.enterStepData = res.data.data.data;
                        }else if(this.roleForm.rule_type == 3){
                            this.roleForm.pic_duration = res.data.data.data[0].pic_duration;
                            this.roleForm.word_duration = res.data.data.data[0].word_duration;
                            this.roleForm.new_duration = res.data.data.data[0].new_duration;
                        }else if(this.roleForm.rule_type == 4){
                            this.roleForm.pic_count = res.data.data.data[0].pic_count;
                            this.roleForm.video_count = res.data.data.data[0].video_count;
                            this.roleForm.show_duration = res.data.data.data[0].show_duration;
                        }
                        this.roleForm.validTime = [res.data.data.begin_date,res.data.data.end_date]
                        this.roleForm.id = res.data.data.id;
                        this.roleForm.place_id = res.data.data.room_list;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
            /**
			 *  @function: 添加设备->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			getPlaceName(val) {
                console.log('val',val);
            },
            /**
             *  @function: 获取树结构
             *  @author: cs
             *  @date 2018-12-19
             */
            getPlaceTree() {
                let params = {
                    school_id: localStorage.getItem("schoolId")
                };
                this.$api.Common.getPlaceTree("get", params).then(res => {
                    console.log("查上课教室树：", res.data.data);
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.treeData = res.data.data;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err => {
                    this.tableLoading = false;
                });
            },
		},
		created() {
            this.getTableData();
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
            this.resizeLayout();//重新获取宽高
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .content-setting{
		width: 100%;
		height: 100%;
		.setting-top{
			min-height: 5vh;
			height: 5vh;
			line-height: 5vh;
			background-color: #fff;
			overflow: hidden;
			ul{
				display: inline-block;
				min-width: 420px;
				li{
					float: left;
					width: 125px;
					text-align: center;
					color: #6C6C6C;
					font-size: 15px;
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
			.button-div{
				float: right;
				margin-top: 5px;
				margin-right: 20px;
			}
		}
		.detail-mid{
		   min-height: 5vh;
		   line-height: 5vh;
		   background-color: #fff;
		   border-top: 1px solid #e7e8eb;
		   overflow: hidden;
			margin-bottom: 10px;
		    ul{
				min-width: 240px;
		   		float: left;
				height: 5vh;
			   li{
				   float: left;
				   width: 120px;
				   height: 5vh;
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
		   .button-div{
			   float: right;
			   margin-right: 20px;
               margin-top: 5px;
		   }
	   	}
		.rule-list{
			width: 100%;
			height: 100%;
			padding: 0;
			overflow-x: hidden;
			margin-bottom: 10px;
			.el-col{
				margin-top: 20px;
				.inner{
					background-color: #fff;
					padding: 15px;
					overflow: hidden;
					h4{
						font-size: 16px;
						line-height: 30px;
						font-weight: bold;
						position: relative;
						span{
							width: 40px;
							height: 24px;
							line-height: 24px;
							text-align: center;
							font-weight: normal;
							font-size: 12px;
							color: #fff;
							background-color: #FF7E7F;
							position: absolute;
							right: -15px;
							top: 2px;
							border-top-left-radius: 6px;
							border-bottom-left-radius: 6px;
						}
					}
					p{
						font-size: 13px;
						line-height: 28px;
					}
					.button-box{
						display: flex;
						margin-top: 15px;
						.el-button {
							width: 100%;
						}
					}
				}
			}
		}
		.pagination-box {
			width: 100%;
			height: 60px;
			background: #fff;
			box-sizing: content-box;
			.el-pagination{
				padding-top: 15px;
			}
		}
		.add-rule-dialog{
			/deep/ .el-dialog{
				.el-form-item{
					text-align: left;
					position: relative;
					padding-bottom: 0;
					&:nth-of-type(1){
						display: block;
						// width: 250px;
					}
					&:nth-of-type(2){
						display: inline-block;
						width: 280px;
						.el-input{
							width: 150px;
							height: 30px;
							.el-input__inner{
								height: 30px;
							}
						}
					}
					&:nth-of-type(3){
						display: inline-block;
						width: 450px;
					}
					&:nth-of-type(4){
						display: block;
						.el-form-item__content{
							width: 645px;
						}
					}
					.delect-btn{
						content: '';
						color: red;
						position: absolute;
						bottom: -10px;
						right: 0px;
						width: 20px;
						height: 20px;
						background: url("../../../../assets/images/del.png") no-repeat;
						cursor: pointer;
					}
				}
				.add-time-box{
					.tools-wrap{
						border: 1px solid #E4E7ED;
						position: relative;
						z-index: 1;
						border-radius: 6px;
						box-sizing: content-box;
						.scroll-box{
							overflow-y: auto;
							max-height: 250px;
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
							.del-time{
								width: 20px;
								position: absolute;
								right: 5px;
								top: -26px;
								cursor: pointer;
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
				.set-time-box{
					display: block;
					.time-box{
						border: 1px solid #E4E7ED;
						border-radius: 6px;
						padding-bottom: 18px;
						width: 645px;
						.inner-box{
							margin-top: 18px;
							dd{
								text-align: right;
								width: 130px;
								display: inline-block;
								margin-right: 10px;
							}
						}
					}
				}
				.el-dialog__body{
					position: relative;
					padding-right: 0;
					padding-bottom: 10px;
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
				.el-dialog__footer{
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
	}
</style>
