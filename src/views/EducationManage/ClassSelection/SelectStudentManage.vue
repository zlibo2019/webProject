<template>
    <div class="select-student-manage">
        <div class="m-left">
			<h4>走班课程
				<i class="iconfont icon-jiahao" @click="addCourse"></i>
			</h4>
			<div class="inner">
				<el-tree
					:data="treeData"
					ref="tree"
					node-key="id"
					default-expand-all
					:check-on-click-node="true"
					@node-click="handleNodeClick">
					<span class="span" :ref="data.id" slot-scope="{ node, data }">
						{{data.label}} <span v-show="data.group == 104">{{data.id}}</span>
					</span>
				</el-tree>
			</div>
		</div>
		<div class="m-right">
			<div class="teaching-top">
				<Button title="新增学生" btnClass="custom8" btnFontSize="12px" @click="btnClick"></Button>
				<Button title="导入" btnClass="custom6" btnFontSize="12px" @click=""></Button>
				<Button title="导出" btnClass="custom6" btnFontSize="12px" @click=""></Button>
			</div>
			<div class="table-box">
				<el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark"
					highlight-current-row style="width: 100%" v-loading="tableLoading">
		
					<el-table-column prop="index" label="序号" min-width="80" ></el-table-column>
					<el-table-column prop="classfied_subject_name" label="走班课程名称" min-width="100" show-overflow-tooltip></el-table-column>
					<el-table-column prop="student_name" label="姓名" min-width="100" show-overflow-tooltip></el-table-column>
					<el-table-column prop="class_name" label="班级" min-width="100" show-overflow-tooltip></el-table-column>
					<el-table-column prop="student_no" label="学号" min-width="100" show-overflow-tooltip></el-table-column>
					<el-table-column fixed="right" label="操作" align="center" min-width="150">
						<template slot-scope="scope">
							<el-button class="normal" size="mini" plain @click="btnClick(scope.row)">修改</el-button>
							<el-button class="warning" size="mini" plain @click="delClick(scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div class="pagination-box">
				<el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
							:current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
			</div>
		</div>
		<!-- 新建走班课程 -->
		<el-dialog title="新建走班课程" :visible.sync="selectFormDialog" width="800px" center class="member-dialog">
            <div class="content">
                <el-form ref="selectForm" label-width="110px" :rules="rules" :model="selectForm">
                    <el-form-item label="走班课程类型：" prop="courseType">
                        <el-select v-model="selectForm.courseType" placeholder="请选择走班课程" @change="changeCourseType" size="medium" style="width:250px;">
                            <el-option v-for="item in courseData"  :key="item.courseId" :label="item.courseName" :value="item.courseId"></el-option>
                        </el-select>
						<Button btnClass="custom11" v-show="selectForm.title == '新建走班课程'" btnFontSize="12px" btnHeight="36px" title="+添加"  @click="addCourse" ></Button>
                    </el-form-item>
                    <el-form-item label="年级：" prop="grade">
                        <el-input v-model="selectForm.grade" placeholder="请选择学年"
						 suffix-icon="el-icon-caret-bottom" style="width:250px;" size="medium"></el-input>
                    </el-form-item>
					<el-form-item label="走班课程数量：" prop="cousrseCount">
						<el-input-number v-model="selectForm.cousrseCount" :min="0" @change="handleChange" size="medium" style="width:250px;"></el-input-number>
                    </el-form-item>
					<el-form-item label="走班课程列表：" class="choose-time">
						<div class="inner-box">
							<ul class="inner-top clearfix">
								<li>序号</li>
								<li>走班课程</li>
								<li>任课教师</li>
								<li>操作</li>
							</ul>
							<ul class="time-list">
								<li v-for="(item, index) in selectForm.courseData" :key="index">
									<div>
										<span>{{index+1}}</span>
									</div>
									<div>
										<el-tooltip v-if="item.courseName" class="item" effect="dark" :content="item.courseName" placement="top">
											<el-input v-model="item.courseName" placeholder="输入走班课程" clearable size="small"></el-input>
										</el-tooltip>
										<el-input v-else v-model="item.courseName" placeholder="输入走班课程" clearable size="small"></el-input>
									</div>
									<div>
										<el-input v-model="item.teacherName" placeholder="选择教师" suffix-icon="el-icon-caret-bottom"  size="small"></el-input>
									</div>
									<div>
										<el-button class="warning" size="mini" plain @click="delCourse(item,index)">删除</el-button>
									</div>
								</li>
							</ul>
						</div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="selectFormDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveBtnClick"></Button>
            </span>
        </el-dialog>

		<!-- 新增修改学生 -->
		<el-dialog title="新增修改学生" :visible.sync="addRuleDialog" width="900px" center class="sch-system-dialog">
                <div class="content">
                    <el-form ref="rightsForm" label-width="80px" :model="rightsForm" :rules="rightsFormRules">
                        <el-form-item label="走班课程" prop="classfiedCourseName">
							<el-select
								v-model="rightsForm.classfiedCourseName"
								placeholder="请选择走班课程"
								@change="changeClassfiedCourseType"
								size="medium"
								style="width:250px;"
								>         
								<el-option
								v-for="item in classfiedCourseData"
								:key="item.id"
								:label="item.classfied_subject_name"
								:value="item.id"
							    ></el-option>
								<!--  TODO -->
							</el-select>
                            <!-- <el-select v-model="rightsForm.courseId" size="small" placeholder="请选择课程"
                                       @change="selectClick">
								<el-option v-for="item in courseData"  :key="item.courseId" :label="item.courseName" :value="item.courseId"></el-option>
                            </el-select> -->
                        </el-form-item>
                        <el-form-item label="授权学生">
                            <div class="transfer-div">
                                <tree-transfer :from_data="fromData" leftTitle='选择场所/教室' leftplaceholder='请输入场所/教室名称' sourceDiffer="2" 
					:user_data="studentList" @showSelected="getSelected" @checkedClick="checkedClick"></tree-transfer>
                            </div>
                            <dd v-show="userShow">请选择学生</dd>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="addRuleDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveClassfiedStudentClick"></Button>
				</span>
            </el-dialog>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import treeTransfer from '@/components/Transfer/transfer-extend'
	import SelectTree from '@/components/SelectTree/SelectTree'
	import Toast from '@/components/Toast/Toast'

	export default {
		name: 'SelectStudentManage',
		components: {
			Button, treeTransfer, Toast,SelectTree
		},
		data() {
			let userValidate = (rule, value, callback) => {   //授权学生校验
				if (value.length == 0) {
					callback(new Error('请选择学生'));
				}
				callback();
			};
			return {
				defaultProps: {
					parent_id: 'pid',   // 父级唯一标识
					id: 'id',          // 唯一标识
					label: 'label',       // 标签显示
					children: 'children', // 子级
                },
                defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				tableLoading:false,//表格loading
				allNum: 0,             //table数组总条数
				currentPage: 1,      //当前页（默认设为第一页）
				pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				rules:{
					courseType:[
						{required: true, message: '请选择走班课程', trigger: 'change'}
					],
					grade:[
						{required: true, message: '请选择年级', trigger: 'blur'}
					],
					cousrseCount:[
						{required: true, message: '请选择走班课程数量', trigger: 'change'}
					],
                    semesterType: [
						 { type: 'array', required: true, message: '请选择学期', trigger: 'change' }
					],
					name:[
						{required: true, message: '请输入课程名称', trigger: 'blur'}
					],
				},
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
				checkedObj:{},//左侧选中的名字
				tableData:[
					{	
						id:1,
						className:'初一一班',
						chinese:'语文',
						chineseid:'1',
						math:'数学',
						mathid:'2',
						english:'',
						englishid:'3',
					},
					{
						id:2,
						className:'初一er班',
						chinese:'语文1',
						chineseid:'1',
						math:'',
						mathid:'2',
						english:'英语1',
						englishid:'3',
					},
					{
						id:3,
						className:'初一san班',
						chinese:'',
						chineseid:'1',
						math:'数学2',
						mathid:'2',
						english:'英语2',
						englishid:'3',
					},
				],
				courseData:[
                    {
                        courseId:'1',
                        courseName:'语文',
                    },{
                        courseId:'2',
                        courseName:'数学',
                    },{
                        courseId:'3',
                        courseName:'英语',
                    },{
                        courseId:'4',
                        courseName:'历史',
                    }
				],//所属楼宇数据
				classfiedCourseData:[],
				courseName: "",
				classfiedCourseName: "",
				selectFormDialog:false,	//新建、修改走班课程弹窗
				selectForm:{
					courseType:'',	//走班课程
					courseData:[],
				},	//新建、修改走班课程from
				addRuleDialog: false,   //规则授权弹窗默认不显示
				rightsForm: {   //添加通道form
					classfiedCourseName:'',	//走班课程
					classfiedCourseData:[],
				},
				rightsFormRules: {           
					classfiedCourseName: [{required: true, message: '请选择课程', trigger: ['change','blur']}],
				},
				studentList: [],          //选中的教室数组,传给后台的参数
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
				userShow: false,    //学生授权验证信息
			}
		},
		methods: {
			/**
			 *  @function:toast弹窗隐藏
			 *  @author: cs
			 *  @date:2018-12-22
			 **/
			hideToast() {
				this.isToast = false;
			},
			/**
			 *  @function:分页
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val;
			},
			/**
			 *  @function: 重新获取宽高
			 *  @author: cs
			 *  @date:2018-12-22
			 **/
			resizeLayout() {
				setTimeout(() => {
					let icH = $('.index > .m-cen').height();
					let etH = $('.index .education-top').height();
					let ltH = $('.index .m-left h4').height();
					let ttH = $('.index .teaching-top').height();
					let pbH = $('.pagination-box').height();
					let tblH = icH - etH - ttH -pbH ;
					$('.select-student-manage .table-box').height(tblH)
					// console.log(66, icH,etH,ttH,tblH)
					// console.log(66, icH,etH,ltH)
					let leftTreeH = icH - etH - ltH -10;
					$('.select-student-manage .m-left .inner .el-tree').height(leftTreeH)
				}, 50)
			},
			/**
			 *  @function: 获取表格数据
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			getTableData() {
				let params = {
					school_id: localStorage.getItem("schoolId")
				};
                this.tableLoading = true;
                this.$api.EducationManage.getClassfiedStudent('get',params).then( res => {
                    console.log('走班学生table数据', res.data);
                    this.tableLoading = false;
                    if (res.data.code == 600 ||　res.data.code == 0) {
						this.tableData = res.data.data;					
                        this.allNum = res.data.total_record;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.tableLoading = false;
                })
			},

			/**
			 *  @function: 根据id查询走班学生 
			 *  @author: zlb
			 *  @date 2019-02-21
			 **/
			getClassfiedStudentById() {
					let arrResult = [];

				let body = {
				"school_id": localStorage.getItem("schoolId"),
				"id": 1,
				};   
				this.$api.EducationManage.getClassfiedStudentById('get', body).then( res => {

				this.tableLoading = false;
				if (res.data.code == 600 ||　res.data.code == 0) {
					this.getTableData();
				} else {
					this.isToast = true;
					this.toast = res.data.msg;
				}
				}).catch(err =>{
						console.log('yyyyyyyyyyyyyyyyyyy'+JSON.stringify(err));
				this.tableLoading = false;
				});
			},

		/**
			 *  @function: 修改走班科目
			 *  @author: zlb
			 *  @date 2019-02-21
			 **/
			putClassfiedStudentById() {
				let arrResult = [];

				let body = {
				"teacher_id": 3,
				"name": "走班课程名称"
				};   
				this.$api.EducationManage.putClassfiedStudentById('put', body).then( res => {

				this.tableLoading = false;
				if (res.data.code == 600 ||　res.data.code == 0) {
					this.getTableData();
				} else {
					this.isToast = true;
					this.toast = res.data.msg;
				}
				}).catch(err =>{
						console.log('yyyyyyyyyyyyyyyyyyy'+JSON.stringify(err));
				this.tableLoading = false;
				});
			},

			/**
			 *  @function: 删除走班科目
			 *  @author: zlb
			 *  @date 2019-02-21
			 **/
			delClassfiedStudentById(id) {
				let arrResult = [];

				let body = {
				   id:id,
				};  

				this.$api.EducationManage.delClassfiedStudentById(body,id).then( res => {

				this.tableLoading = false;
				if (res.data.code == 600 ||　res.data.code == 0) {
					this.getTableData();
				} else {
					this.isToast = true;
					this.toast = res.data.msg;
				}
				}).catch(err =>{
						console.log('yyyyyyyyyyyyyyyyyyy'+JSON.stringify(err));
				this.tableLoading = false;
				});
			},



			/**
			 *  @function: 左侧树点击
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			handleNodeClick(data,node){
				// console.log(data,node);
				if(data.group == 104){
					$('.span').removeClass('custom-tree-node')
					this.$refs[data.id].classList.add("custom-tree-node");
					this.checkedObj = data;
					console.log(this.checkedObj.label);
					this.$refs.select.blur();
				}
			},
			/**
			 *  @function: 新增走班课程
			 *  @author: cs
			 *  @date 2018-12-25
			 **/
			addCourse(){
				console.log('新增,修改走班课程');
				this.selectFormDialog = true;
				this.selectForm = {
					courseType:'',	//走班课程
					grade:'',//年级
					cousrseCount:'',
					courseData:[],
				},	//新建、修改走班课程from
				setTimeout(() => {
                   	this.$refs.selectForm.resetFields();
					
				}, 20);
			},
			/**
			 *  @function: 新增、修改学生
			 *  @author: cs
			 *  @date 2018-12-25
			 **/
			btnClick(row){
				console.log(' 新增、修改学生',row);
				this.addRuleDialog = true;
				this.rightsForm = {
					classfiedCourseName: "",
				}
				this.deviceData = [];
				this.channelShow = false;
				this.userShow = false;

				// setTimeout(() => {
				// 	this.$refs['rightsForm'].resetFields();
				// 	let pH = $(document).height();
				// 	let sdH = $('.sch-system-dialog .el-dialog').height();
				// 	let dtop = ( pH - sdH ) / 2;
				// 	// console.log(6666, pH, sdH, dtop)
				// 	$('.sch-system-dialog .el-dialog--center').css('margin-top', dtop)
				// }, 10)
				setTimeout(() => {
                   	this.$refs.rightsForm.resetFields();
					if(row){
						this.rightsForm = JSON.parse(JSON.stringify(row));
						this.rightsForm.title = '修改学生'
					}
				}, 20);
				if(!row){
					this.rightsForm.title = '新建学生'
				}
			},

			/**
			 *  @function: 表格行删除
			 *  @author: cs
			 *  @date 2018-12-22
			 */
			delClick(row) {
			this.$confirm(
				'是否继续?',
				"提示",
				{
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}
			)
			.then(() => {
				this.delClassfiedStudentById(row.id);
				//点击确定按钮进行的操作
				this.$loading();
				setTimeout(() => {
					this.$loading().close();
				}, 1000);
				})
				.catch(() => {
				//点击取消按钮
				});
			},


			/**
			 *  @function: change下拉框的值
			 *  @author: cs
			 *  @date 2018-12-25
			 */
			changeCourseType(value) {
				console.log("change下拉框的值:", value);
				this.courseData.forEach(item=>{
					if(item.id == value){
						return this.courseName = item.classfied_subject_name;
					}
				})
				console.log(this.courseName);

				// let obj = {};
				// obj = this.courseData.find((item) => {//这里的deviceType就是上面遍历的数据源
				// 	return item.courseId === value;//筛选出匹配数据
				// });
				// this.courseName = obj.classfied_subject_name
				// console.log(888, value, this.rightsForm.rule)
			},

			/**
			 *  @function: change下拉框的值
			 *  @author: cs
			 *  @date 2018-12-25
			 */
			changeClassfiedCourseType(value) {
				this.rightsForm.classfiedCourseName = value;
				let obj = {};
				obj = this.classfiedCourseData.find((item) => {//这里的deviceType就是上面遍历的数据源
					return item.id === value;//筛选出匹配数据
				});
				this.classfiedCourseName = obj.classfied_subject_name
				console.log(888, value,obj.classfied_subject_name, this.rightsForm)
			},
			/**
			 *  @function: 删除走班课程
			 *  @author: cs
			 *  @date 2018-12-25
			 */
			delCourse(id) {
				console.log("删除走班学生")
				let params = {
					"id": id
				};      
				this.$api.EducationManage.delClassfiedStudentById(params, id).then( res => {
				this.tableLoading = false;
				if (res.data.code == 600 ||　res.data.code == 0) {
					this.getTableData();
				} else {
					this.isToast = true;
					this.toast = res.data.msg;
				}
				}).catch(err =>{
				this.tableLoading = false;
				});
				// this.selectForm.courseData.splice(index,1);
				// this.selectForm.cousrseCount = this.selectForm.courseData.length;
			},
			/**
			 *  @function: 改变计数器的值
			 *  @author: cs
			 *  @date 2018-12-25
			 */
			handleChange(value) {
				console.log("改变计数器的值:", value,this.selectForm.courseData.length);
				// let courseName = this.selectForm.courseType
				if(value > this.selectForm.courseData.length){
					for (let i = this.selectForm.courseData.length; i < value; i++) {
						this.selectForm.courseData.push({
							courseName:this.selectForm.grade || this.courseName?`${this.selectForm.grade?this.selectForm.grade:''}${this.courseName?this.courseName:''}${i+1}`:'',
							teacherName:'',
						})
					}
				}else if(value < this.selectForm.courseData.length){
					for (let i = this.selectForm.courseData.length; i >= value; i--) {
						this.selectForm.courseData.splice(i,1)
					}
				}
			},

			/**
			 *  @function: 新增走班课程
			 *  @author: zlb
			 *  @date 2019-02-21
			 **/
			postClassfiedStudent() {
				let arrResult = [];
				for (let i = 0; i < this.studentList.length; i++) {
			    	arrResult.push({"student_id":this.studentList[i].id});	
				}
				let body = {
				"school_id": localStorage.getItem("schoolId"),
				"classfied_subject_id":this.rightsForm.classfiedCourseName,
				"arr_student":arrResult,
			};   
			console.log(JSON.stringify(body));  
				this.$api.EducationManage.postClassfiedStudent('post', body).then( res => {

				console.log('xxxxxxxxxxxxxx'+JSON.stringify(res));
				this.tableLoading = false;
				if (res.data.code == 600 ||　res.data.code == 0) {
					this.getTableData();
				} else {
					this.isToast = true;
					this.toast = res.data.msg;
				}
				}).catch(err =>{
						console.log('yyyyyyyyyyyyyyyyyyy'+JSON.stringify(err));
				this.tableLoading = false;
				});
			},

			/**
			 *  @function: 新增,修改走班课程->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-22
			 **/
			saveBtnClick() {
                console.log('新增,修改走班课程->点击保存按钮',this.selectForm);
                this.$refs['selectForm'].validate((valid) => {
					if (valid) {
                        this.selectFormDialog = false;
						 
						console.log("selectForm",this.selectForm);
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
			 *  @function: 新增,修改走班学生->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-22
			 **/
			saveClassfiedStudentClick() {
                console.log('添加学生->点击保存按钮',this.selectForm);
                this.$refs['rightsForm'].validate((valid) => {
					if (valid) {
                        this.addRuleDialog = false;
						  this.postClassfiedStudent();
						console.log("rightsForm",this.rightsForm);
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
			 *  @function添加通道功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			saveRightsForm() {
				this.$refs['rightsForm'].validate((valid) => {
					if (valid) {
							console.log(666666666,this.studentList)
						if (this.studentList.length > 0) {
							
						} else {
							if (this.studentList.length == 0) {
								this.userShow = true;
							} else {
								this.userShow = false;
							}
						}
					} else {
						return false;
					}
				})
			},
			/**
			 *  @function: 规则授权按钮
			 *  @author: lxr
			 *  @date 2018-7-21
			 **/
			selectClick(id) {
				let obj = {};
				obj = this.courseData.find((item) => {//这里的deviceType就是上面遍历的数据源
					return item.courseId === id;//筛选出匹配数据
				});
				this.selectRuleId = id;
				this.rightsForm.rule = obj.classfiedCourseName
				console.log(888, id, this.rightsForm.rule)

				// this.getClassUser();// 加载学生组织树-（增改页面）
				// this.getRuleUsers ();  // 加载已授权学生列表-（增改页面）

			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: cs
			 *  @date 2018-12-07
			 */
			getSelected(data) {
				console.log('888999666',data,this.studentList.length)
				this.userShow = false;
				for(let i = 0;i<data.length;i++){
					this.studentList.push(
						{
							'classId': data[i].pid,
							'placeName': data[i].pname,
							'studentId': data[i].id,
							'id': data[i].id,
							'buildingName': data[i].label
						}
					)
				}
				let length = this.studentList.length;
				if(length == 1) return
				// console.log(444,length)
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.studentList[k].id == this.studentList[i].id){
							// console.log(11111111111111)
							this.studentList.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data.length, this.studentList.length)
			},
			/**
			 *  @function: table 列表搜索筛选
			 *  @author: cs
			 *  @date 2018-12-07
			 */
			checkedClick(data){
				console.log('data111',data,this.studentList)
				this.userShow = false;
				this.studentList.push(
					{
						'classId': data.pid,
						'placeName': data.pname,
						'studentId': data.id,
						'id': data.id,
						'buildingName': data.value,
					}
				)
				let length = this.studentList.length;
				if(length == 1) return
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.studentList[k].id == this.studentList[i].id){
							this.studentList.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data, this.studentList)

			},
			/**
			 *  @function: 获取课程数据
			 *  @author: ly
			 *  @date 2019-02-16
			 */
			getClassfiedCourse() {
				let params = {
					school_id: localStorage.getItem("schoolId")
				};
				this.tableLoading = true;
				this.$api.EducationManage.getClassfiedSubject("get", params)
					.then(res => {
					console.log("获取课程信息", res.data);
					this.tableLoading = false;
					if (res.data.code == 600 || res.data.code == 0) {
						this.classfiedCourseData = res.data.data;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
					}).catch(err => {
						console.log("bbbbbbbbbbb"+JSON.stringify(err));
						this.tableLoading = false;
					});
				},
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
		},
		 created() {
			this.getTableData(); //获取表格数据
			// this.getTableList(this.activeInputId);//获取table列表
			this.getClassfiedCourse();
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .select-student-manage {
        width: 100%;
        height: 100%;
        margin: 0 auto;
		background-color: #fff;
		display: flex;
		.m-left {
			flex-basis: 330px;
			min-width: 330px;
			text-align: center;
			background-color: #fff;
			font-size: 12px;
			overflow: hidden;
			h4{
				width: 100%;
				height: 60px;
				line-height: 60px;
				font-size: 15px;
				font-weight: normal;
				color: #666;
				text-align: left;
				padding-left: 30px;
				border-bottom: 1px solid #e1e1e1;
				border-right: 1px solid #e1e1e1;
				background-color: #eff3f6;
				i{
					color: #1cab7d;
					font-weight: bold;
					float: right;
					margin-right: 20px;
					cursor: pointer;
				}
			}
			.inner{
				width: 100%;
				height: 100%;
				overflow: auto;
				position: relative;
				.el-input{
					width: 90%;
					margin-top: 10px;
					margin-bottom: 10px;
				}
				.span{
					padding: 5px 20px;
				}
				.el-tree{
            		padding-left: 30px;
					padding-top: 10px;
					height: 100%;
					overflow: auto;
				}
				.custom-tree-node {
					background-color: #1cab7d;
					color: #fff;
					// border-radius: 5px;
				}
			}
		}
		.m-right{
			min-width: 0;
			height:auto;
			flex: 1;
			text-align: right;
			.teaching-top{
				min-height: 60px;
				line-height: 60px;
				dd{
					float: left;
					margin-left: 40px;
                    margin-right: 10px;
                    font-size: 18px;
                    font-weight: bold;
				}
				.el-select{
					float: left;
				}
				.button-div{
					margin-right: 11px;
				}
			}
			.table-box{
				width: 100%;
				height: 100%;
				overflow: auto;
				.add-teacher{
					dd{
						color: #FF4E4E;
					}
				}
				.cell{
					position: relative;
					font-size: 12px;
					dd{
						// color: red;
					}
					&:hover{
						i{
							display: block;
						}
					}
					i{
						position: absolute;
						top: 0;
						right: 0;
						font-size: 20px;
						color:#FF4E4E;
						display:none;
						cursor: pointer;
					}
				}

				/* ------------ */
				.custom-table{
					text-align: center;
					.custon-top{
						height: 40px;
						line-height: 40px;
						li{
							width: 100px;
							text-align: center;
							border: 1px solid red;
						}
					}
					.custon-content{
						overflow: hidden;
						&>li{
							width: 100%;
							text-align: center;
							span{
								float: left;
							}
								overflow: hidden;
							ul{
								float: left;
								overflow: hidden;
								li{
									float: left;
									border: 1px solid red;
								}
							}
						}
					}
				}
				/* ------------ */
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
		}
		.member-dialog{
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
                    .el-form-item__content{
                        .el-select{
                            margin-right: 10px;
                        }
                    }
					.choose-time{
						.inner-box{
							width: 520px;
							overflow: hidden;
							border: 1px solid #e1e1e1;
							border-radius: 6px;
							text-align: center;
							.inner-top{
								width: 520px;
								height: 40px;
								line-height: 40px;
								display: flex;
								li{
									flex: 1;
									font-size: 12px;
									color: #606266;
									&:nth-of-type(2){
										flex-basis: 140px;
											max-width: 140px;
									}
								}
							}
							.time-list{
								width: 520px;
								max-height: 240px;
								overflow: auto;
								li{
									width: 100%;
									height: 40px;
									line-height: 40px;
									overflow: hidden;
									border-top: 1px solid #e1e1e1;
									display: flex;
									&>div{
										font-size: 12px;
										color: #606266;
										flex: 1;
										padding: 0 10px;
										&:nth-of-type(2){
											flex-basis: 140px;
											max-width: 140px;
										}
									}
								}
							}
							.button-div{
								margin: 10px 20px;
							}
						}
					}
                }
                .button-div{
                    margin-right: 20px;
                }
            }
		}
		.sch-system-dialog {
			/deep/ .el-dialog {
				/*margin-top: 8vh!important;*/
				.el-dialog__body {
					padding: 15px 25px 10px !important;
				}
			}
			/deep/ .el-form-item {
				width: 100%;
				text-align: left;
				position: relative;
				padding-left: 2%;
				padding-right: 3%;
				margin-bottom: 0 !important;
				padding-bottom: 20px !important;
				/deep/ .el-radio-group {
					.el-radio {
						display: inline-block;
					}
				}
				.search-box {
					width: 240px;
					height: 36px;
					float: right;
					margin: 0px 0px 6px 20px;
					position: relative;
					.el-input {
						
						i {
							cursor: pointer;
						}
					}
				}
				dd {
					position: absolute;
					left: 0;
					bottom: -30px;
					color: red;
					font-size: 12px;
				}
				.el-table {
					width: 800px;
				}
				&:nth-of-type(2), &:nth-of-type(3) {
					> label {
						text-align: right;
						line-height: 40px;
						float: left;
						&:before {
							content: '*';
							color: #f56c6c;
							margin-right: 4px;
							display: inline-block;
						}
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
    }
</style>





