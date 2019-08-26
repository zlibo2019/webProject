<template>
    <div class="school-enter-exit">
        <div class="m-bottom">
            <div class="operate-box">
                <dd>设备数量 <span>({{ tableData.length }})</span></dd>
				<div class="search-box">
                    <el-input v-model="searchVal" size="small" placeholder="请输入设备ID或教室名称" @change="search('table')">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="search('table')"></i>
                    </el-input>
                </div>
                <Button btnClass="custom8" btnFontSize="12px" title="添加设备" btnHeight="38px"  @click="addDeviceClick" ></Button>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" align="center" border :data="tableData" tooltip-effect="dark"
                          highlight-current-row style="width: 100%" v-loading="tableLoading">
                    <el-table-column prop="indexID" label="序号" width="80" ></el-table-column>
                    <el-table-column prop="place_name" label="所在场所" min-width="100"  show-overflow-tooltip></el-table-column>
                    <el-table-column prop="classroomName" label="教室/场所名称" min-width="130" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dev_name" label="设备名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dev_id" label="设备ID" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="dev_ip" label="设备IP" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                   
                    <!-- <el-table-column label="班级信息" align="center" >
                        <el-table-column prop="bindingClass" label="绑定班级" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="classShowName" label="班级显示名称" min-width="130" align="center" show-overflow-tooltip></el-table-column>
                    </el-table-column>
                    <el-table-column  label="门禁规则" align="center">
                        <el-table-column label="常开规则" align="center" show-overflow-tooltip>
                             <el-table-column prop="openRuleName" label="规则名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="openTimeName" label="时段名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="openWeek" label="适用星期" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="openTime" label="起止时间" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="openTimeRange" label="有效时间范围" min-width="130" align="center" show-overflow-tooltip></el-table-column>
                        </el-table-column>
                        <el-table-column  label="常闭规则" align="center" show-overflow-tooltip>
                             <el-table-column prop="closeRuleName" label="规则名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="closeTimeName" label="时段名称" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="closeWeek" label="适用星期" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="closeTime" label="起止时间" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                             <el-table-column prop="closeTimeRange" label="有效时间范围" min-width="130" align="center" show-overflow-tooltip></el-table-column>
                        </el-table-column>
                    </el-table-column> -->
                    <el-table-column fixed="right" label="操作" min-width="250" align="center" >
                        <template slot-scope="scope">
                            <el-button class="normal" size="mini" plain @click="rowClick(scope.row)">修改</el-button>
                            <el-button class="normal" size="mini" plain @click="unBinding(scope.row)">解除绑定</el-button>
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

        <!-- 添加设备 -->
        <el-dialog title="添加设备" :visible.sync="addDeviceDialog" v-if="addDeviceDialog" width="800px" center class="member-dialog">
            <div class="content">
                <el-form ref="addDeviceForm" label-width="115px" :rules="rules" :model="addDeviceForm">
                    <el-form-item label="场所/教室名称：" prop="building">
                        <!-- <el-select v-model="addDeviceForm.building" placeholder="请选择场所/教室">
                            <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                        </el-select> -->
                        {{addDeviceForm.building}}
                        <SelectTree 
							v-model="addDeviceForm.building"
							:options="treeData" 
                            @labelVal="getPlaceName"
							:props="defaultProps"
                            placeholder="请选择场所/教室"
                            size='medium'
							width="200"></SelectTree>
                        <Button btnClass="custom11"  btnFontSize="12px"  title="+添加"  @click="addClick('build')" ></Button>
                        <!-- <div class="add-btn" v-show="!addBuildingShow">
                            <el-input v-model="addBuilding" ref="addBuilding" clearable style="width: 130px;"></el-input>
                            <Button title="保存" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="saveAddBtnClick(addBuilding,'checkInputChars')"></Button>
                            <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="3.5vh" @click="addBuildingShow = true"></Button>
                        </div> -->
                    </el-form-item>
                    <el-form-item label="设备名称：" prop="selectedDeviceArr">
                        <div class="dev-select-info" v-if="addDeviceForm.selectedDeviceArr.length > 0">
                            <div class="select-dev-list" v-for="(item, index) in addDeviceForm.selectedDeviceArr" :key="index">
                                <el-input v-model="item.dev_name" style="width: 130px; height:38px;" readonly></el-input>
								<img src="../../../assets/images/del.png" alt="删除设备" title="删除设备" @click="delSelectDev('add',item,index)">
                            </div>
                        </div>
                        <Button btnClass="custom8" btnFontSize="12px" title="选择设备"  @click="addClick('device')" ></Button>
                    </el-form-item>
                    <!-- <el-form-item label="绑定班级：">
                        <el-select v-model="addDeviceForm.class" placeholder="请选择班级" @change="selectClass">
                            <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班牌显示名称：" >
                       <el-input v-model="addDeviceForm.cardName" clearable placeholder="请输入名称"  style="width: 200px;"></el-input>
                    </el-form-item> -->
                    <!-- <div class="open-close" >
                        <dd @click="showOpenClose = !showOpenClose">
                            <span>常开常闭规则设置</span>
                            <i class="iconfont icon-jiantou-copy-copy-copy" :class="{arrow:showOpenClose}"></i>
                        </dd>
                    </div> -->
                    <div class="show-wrap" v-show="showOpenClose">
                        <el-form-item label="常开规则：">
                            <el-select v-model="addDeviceForm.openRule" placeholder="请选择常开规则">
                                <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="常闭规则：">
                            <el-select v-model="addDeviceForm.closeRule" placeholder="请选择常闭规则">
                                <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="addDeviceDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveDevice('addDeviceForm')"></Button>
            </span>
        </el-dialog>

        <!-- 修改设备 -->
        <el-dialog title="修改设备" :visible.sync="editDeviceDialog" v-if="editDeviceDialog" width="800px" center class="member-dialog">
            <div class="content">
                <el-form ref="editDeviceForm" label-width="115px" :rules="rules" :model="editDeviceForm">
                    <el-form-item label="场所/教室名称：" prop="building">
                        <!-- <el-select v-model="editDeviceForm.building" placeholder="请选择场所/教室">
                            <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                        </el-select> -->
                        <SelectTree 
							v-model="editDeviceForm.building" 
							:options="treeData" 
                            @labelVal="getPlaceName"
							:props="defaultProps"
                            placeholder="请选择场所/教室"
                            size='medium'
							width="200"></SelectTree>
                    </el-form-item>
                    <el-form-item label="设备名称：" prop="selectedDeviceArr">
                        <div class="dev-select-info" v-if="editDeviceForm.selectedDeviceArr.length > 0">
                            <div class="select-dev-list" v-for="(item, index) in editDeviceForm.selectedDeviceArr" :key="index">
                                <el-input v-model="item.dev_name" style="width: 130px; height:38px;" readonly></el-input>
								<img src="../../../assets/images/del.png" alt="删除设备" title="删除设备" @click="delSelectDev('edit',item,index)">
                            </div>
                            <!-- <span v-for="(item, index) in editDeviceForm.selectedDeviceArr" :key="index">{{item.dev_name}}</span> -->
                        </div>
                        <Button btnClass="custom8" btnFontSize="12px" title="选择设备"  @click="addClick('device')" ></Button>
                    </el-form-item>
                    <!-- <el-form-item label="绑定班级：">
                        <el-select v-model="editDeviceForm.class" placeholder="请选择班级" @change="selectClass">
                            <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="班牌显示名称：" >
                       <el-input v-model="editDeviceForm.cardName" clearable placeholder="请输入名称"  style="width: 200px;"></el-input>
                    </el-form-item> -->

                    <!-- <div class="open-close" >
                        <dd @click="showOpenClose = !showOpenClose">
                            <span>常开常闭规则设置</span>
                            <i class="iconfont icon-jiantou-copy-copy-copy" :class="{arrow:showOpenClose}"></i>
                        </dd>
                    </div> -->
                    <div class="show-wrap" v-show="showOpenClose">
                        <el-form-item label="常开规则：">
                            <el-select v-model="editDeviceForm.openRule" placeholder="请选择常开规则">
                                <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="常闭规则：">
                            <el-select v-model="editDeviceForm.closeRule" placeholder="请选择常闭规则">
                                <el-option v-for="item in buildingData"  :key="item.buildNo" :label="item.buildName" :value="item.buildNo"> </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="editDeviceDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveDevice('editDeviceForm')"></Button>
            </span>
        </el-dialog>

        <!-- 选择设备 -->
        <el-dialog title="选择设备" :visible.sync="selectDevDialog" width="800px" center
                       class="sch-system-dialog add-dev-dialog" >
            <div class="content">
                <div class="c-top">
                    <div class="ct-title">
                        <span>选择设备：</span>
                        <el-input v-model="searchDevice" style="width: 230px;float: right" size="small"
                                    placeholder="请输入设备名称或设备IP查询" @change="search('device')">
                            <i slot="suffix" class="el-input__icon el-icon-search" @click="search('device')"></i>
                        </el-input>
                    </div>
                    <div class="ct-table">
                        <el-table id="table" ref="addDoorDevTable" height="100%" :data="deviceData"
                                    tooltip-effect="dark" border highlight-current-row style="width: 100%" 
                                    @selection-change="handleSelectionChange" v-if="selectDevDialog">
                            <el-table-column type="selection" width="55" :selectable="checkboxInit"></el-table-column>
                            <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
                            <el-table-column prop="dev_name" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="dev_id" label="设备ID" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="dev_ip" label="设备IP" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="isUsed" label="分配状态" align="center" show-overflow-tooltip></el-table-column>
                        </el-table>
                    </div>
                    <!-- <div class="pagination-box">
                            <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
                        </div>-->
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="selectDevDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveSelectDevice"></Button>
            </span>
        </el-dialog>

        <!-- 添加场所 -->
		<el-dialog title="添加场所" :visible.sync="addDialog" v-if="addDialog"  width="700px" center class="member-dialog">
            <div class="content">
                <el-form ref="addForm" label-width="100px" :rules="rules" :model="addForm">
                    <el-form-item label="所在场所：" prop="place_id">
                        <el-select v-model="addForm.place_id" placeholder="请选择场所">
                            <el-option v-for="item in placeData"  :key="item.place_id" :label="item.place_name" :value="item.place_id"> </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="新增名称：" prop="aisleName">
						<el-input v-model="addForm.aisleName" placeholder="请输入名称" @input="checkName(addForm.aisleName,'addForm')"
						clearable style="width: 120px;" ></el-input>
                    </el-form-item>
                    <el-form-item label="所属应用：">
						<div class="bot">
							<Button :btnClass="checkAllClass?'custom8' : 'custom6'" btnFontSize="12px" btnHeight="38px" title="全部" @click="handleCheckAllChange"></Button>
							<!-- <Button btnClass="custom6" btnFontSize="12px" btnHeight="38px" title="全部" @click="handleCheckAllChange"></Button> -->
							<ul class="clearfix">
								<li v-for="(item,index) in usedClassData" :key="index" :class="{ac:item.checked}" @click="handleCheckedCitiesChange(item)">
									{{item.className}}
								</li>
							</ul>
						</div>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="addDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveBtnClick"></Button>
            </span>
        </el-dialog>
        <Toast v-if="isToast" :modal-title="toast" duration="1000" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	import SelectTree from '@/components/SelectTree/SelectTree'

	export default {
		name: 'AddDevice',
		components: {
			Button, Toast,SelectTree
		},
		data() {
            //form内必填项校验--文本框
			let validateInputChars = (rule, value, callback) => { 
                    console.log("value:",value);
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
                        this.checkInputChars(value, callback);
					callback();
				}
			};
			return {
				isToast: false,//toast是否展示
                toast: '',//toast提示内容
				searchVal:'',     //页面设备ID或教室名称搜索
				searchDevice:'',     //弹窗内搜索设备
				tableData: [],//table数组
				allNum: 0,             //table数组总条数
				currentPage: 1,      //当前页（默认设为第一页）
				tableLoading: false,        //表格加载动画
                pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
                selectDevDialog:false,//选择设备弹窗
                addDeviceDialog:false,//添加设备弹窗
                addDeviceForm:{
                    building: '',//所属楼宇
                    classroom: '',//教室名称
                    selectedDeviceArr:[],//选中的设备
                    class:'',//班级
                    cardName:'',//班牌名称
                    openRule:'',//常开规则
                    closeRule:'',//常闭规则
                },//添加设备form
                editDeviceDialog:false,//修改设备弹窗
                editDeviceForm:{
                    building: '',//所属楼宇
                    classroom: '',//教室名称
                    selectedDeviceArr:[],//选中的设备
                    class:'',//班级
                    cardName:'',//班牌名称
                    openRule:'',//常开规则
                    closeRule:'',//常闭规则
                },//修改设备form
                rules:{
                    building: [{required: true, message: '请选择场所/教室', trigger: ['change','blur']}],
					classroom:[
						{required: true, message: '请选择教室', trigger: 'change'}
                    ],
                    selectedDeviceArr: [
                        { type: 'array', required: true, message: '请选择设备', trigger: 'change' }
                    ],
                    place_id:[
						{required: true, message: '请选择场所', trigger: 'change'}
					],
                    aisleName: [
                         {required: true, validator: validateInputChars,trigger: 'blur' }
                    ],
                },
                buildingData:[
                    {
                        buildNo:'0',
                        buildName:'教学楼A',
                    },{
                        buildNo:'1',
                        buildName:'教学楼B',
                    },{
                        buildNo:'2',
                        buildName:'教学楼C',
                    },{
                        buildNo:'3',
                        buildName:'教学楼D',
                    }
                ],//所属楼宇数据
                deviceData:[],//设备表格数据
                selectedDevice:[],//选中的设备 没点击保存按钮
                addBuilding:'',//新增楼宇
                addClassroom:'',//新增楼教室
                addClassroomShow:true,//新增教室按钮点击 确定取消显示  为false时显示
                showOpenClose:false,//常开常闭显示
                chooseType:0 ,//选择新增还是修改 0-新增  1-修改
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
					parent_id: 'pid',   // 父级唯一标识
					id: 'id',          // 唯一标识
					label: 'label',       // 标签显示
					children: 'children', // 子级
                },
                addDialog:false,//添加场所
                addForm:{
					place_id:'',//场所
					aisleName:'',//场所
					application:[],//所属应用
                },//添加form
				checkedClass:[],//选中的应用
				checkAllClass: true,//是否全选
                placeData:[],//所在场所数据
                usedClassData:[
					{
						className:'校门进出',
						classId:1,
						checked:true
					},
					{
						className:'访客管理',
						classId:2,
						checked:true
					},
					{
						className:'智慧班牌',
						classId:3,
						checked:true
					}
				],//所属应用
				isRepeat:false,//输入场所是否重复
			}
		},
		methods: {
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val;
				// this.getTableData(this.pageItem, this.currentPage);
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
			 *  @function页面布局初始化的功能
			 *  @author: wzx
			 *  @date 2018-7-12
			 **/
			initLayout() {
				setTimeout( function() {
					let icH = $('.index > .m-cen').height();
					let obH = $('.operate-box').height();
					let pbH = $('.pagination-box').height();
					let tblH = icH  - obH - pbH ;
					// console.log(666,icH,ttH,obH,pbH,tblH)
					$('.table-box').height(tblH)
				}, 50)
			},
			/* --------三期----------- */
			/**
			 *  @function:搜索
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			search(val) {
                console.log("搜索",val,this.searchVal);
                if(val === 'table'){
                    //搜索设备ID和教室名称
                    this.getTableData();
                }else if(val === 'device'){
                    //弹窗内搜索设备
                    
                }
            },
            /**
			 *  @function: 表格行修改
			 *  @author: cs
			 *  @date 2018-12-20
			 */
			rowClick(row) {
                console.log("表格行修改:", row)
                this.chooseType = 1;
                this.editDeviceDialog = true;
				setTimeout(() => {
                   	this.$refs.editDeviceForm.resetFields();
				});
                let rows = JSON.stringify(row);
                this.editDeviceForm = JSON.parse(rows);
                // this.editDeviceForm.selectedDeviceArr = [];
                this.editDeviceForm = {
                    building: rows.building,//所属楼宇
                    classroom: rows.classroom,//教室名称
                    selectedDeviceArr:[],//选中的设备
                    class:rows.class,//班级
                    cardName:rows.cardName,//班牌名称
                    openRule:rows.openRule,//常开规则
                    closeRule:rows.closeRule,//常闭规则
                },//修改设备form
                console.log("editDeviceForm",this.editDeviceForm);
                this.getDeviceTableData();//获取设备表格数据
			},
            /**
			 *  @function: 表格行删除
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			unBinding(row) {
                console.log("delClick:", row)
                this.$confirm('此操作将解除绑定, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
                    this.$loading();
                    setTimeout(() => {
                        this.$loading().close();
                    }, 1000);
				}).catch(() => {//点击取消按钮
					this.$message({type: 'info', message: '已取消删除'});
				});
			},
            /**
			 *  @function: 表格行删除
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			delClick(row) {
                console.log("delClick:", row)
                this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
                }).then(() => {//点击确定按钮进行的操作
                    let params = {
                        id:row.id,
                        school_id: localStorage.getItem('schoolId')
                    };
                    this.$loading();
                    this.$api.DeviceControl.devicePlaceRelation('delete',params).then(res => {
                        console.log('删除场所应用关系：', res.data);
                        this.$loading().close();
                        this.getTableData();
                        if (res.data.code == 600 || res.data.code == 0) {
                            this.getTableData();
                        } else {
                            this.isToast = true;
                            this.toast = res.data.msg;
                        }
                    }).catch(err =>{
                        this.$loading().close();
                    })
				}).catch(() => {//点击取消按钮
					this.$message({type: 'info', message: '已取消删除'});
				});
			},
            /**
			 *  @function: 获取表格数据
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			getTableData() {
                this.tableLoading = true;
                let params = {
                    querystr:'',
                    school_id:localStorage.getItem('schoolId'),//学校id
                    page_index: this.currentPage,
					page_size: this.pageItem,
                };
                this.$api.DeviceControl.getChooseDeviceList('get',params).then( res => {
                    console.log('通知列表数据', res.data);
                    // this.tableData = res.data.rows;
                    // this.allNum = res.data.count;
                    // this.tableData.forEach((item,index)=>{
                    //     this.$set(item, 'indexID', (this.currentPage - 1) * this.pageItem + index + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
                    // })
                    this.tableLoading = false;
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.tableData = res.data.data.rows;
                        this.allNum = res.data.data.count*1;
                        this.tableData.forEach((item,index)=>{
                            this.$set(item, 'indexID', (this.currentPage - 1) * this.pageItem + index + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
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
			 *  @function: 获取设备表格数据
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			getDeviceTableData() {
                let params = {
                    school_id:localStorage.getItem('schoolId'),//学校id
                };
                this.$api.DeviceControl.getSchoolDeviceTable('get',params).then( res => {
                    console.log('获取设备表格数据', res.data);
                    // this.deviceData = res.data.rows;
                    // this.deviceData.forEach((item,index)=>{
                    //     this.$set(item, 'index', index+1)
                    // })
                    console.log( this.deviceData);
                    if (res.data.code == 600 ||　res.data.code == 0) {
                        this.deviceData = res.data.data.rows;
                        this.deviceData.forEach((item,index)=>{
                            this.$set(item, 'index', index+1)
                        })
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
			},
            /**
			 *  @function: 点击添加设备
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			addDeviceClick() {
                console.log("点击添加设备 弹窗");
                this.chooseType = 0;
                this.addDeviceDialog = true;
                this.addDeviceForm.selectedDeviceArr = [];
                this.addDeviceForm = {
                    building: '10001',//所属楼宇
                    classroom: '',//教室名称
                    selectedDeviceArr:[],//选中的设备
                    class:'',//班级
                    cardName:'',//班牌名称
                    openRule:'',//常开规则
                    closeRule:'',//常闭规则
                };
                setTimeout(() => {
                   this.$refs.addDeviceForm.resetFields();
                }, 20);
                this.getDeviceTableData();//获取设备表格数据
                this.getTreeData();//获取树结构
			},
            /**
			 *  @function: 添加设备弹窗，添加按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			addClick(val) {
                console.log("点击添加设备",val);
                let formName = '';
                if(this.chooseType == 0){
                    //点击添加设备
                    formName = 'addDeviceForm';
                } else if(this.chooseType == 1){
                    //点击修改设备
                    formName = 'editDeviceForm';
                }
                if(val === 'build'){
                    //点击添加设备
                    this.addBuilding = '';
                    console.log('添加场所');
                    this.addDialog = true;
                    this.addForm = {
                        place_id:'',//场所
                        aisleName:'',//新增名称
                        application:[],//所属应用
                    };
                    this.checkAllClass = true;
                    this.usedClassData.forEach(item=>{
                        item.checked = true;
                    })
                    this.checkedClass = this.usedClassData;
                    setTimeout(() => {
                        this.$refs.addForm.resetFields();
                    }, 20);
                    //获取下拉列表数组
                    let params = {
                        school_id: localStorage.getItem('schoolId')
                    }
                    this.$api.DeviceControl.addPlaceTree('get',params).then(res =>{
                        console.log('获取所在场所下拉列表:', res.data.data)
                        if (res.data.code == 600 || res.data.code == 0) {
                            this.placeData = res.data.data.rows;
                            console.log(this.placeData,"1placeData");
                            if(this.placeData.length > 0) this.addForm.place_id = this.placeData[0].place_id;
                        } else {
                            this.isToast = true;
                            this.toast = res.data.msg;
                        }
                    })
                    console.log(this.checkedClass,this.checkAllClass);
                }else if(val === 'device'){
                    //点击选择设备
                    this.selectDevDialog = true;
                    this.deviceData.forEach(item=>{
                        item.disabled = false;
                    })
                    for (let i = 0; i < this[formName].selectedDeviceArr.length; i++) {
                        for (let k = 0; k < this.deviceData.length; k++) {
                            if(this[formName].selectedDeviceArr[i].dev_id == this.deviceData[k].dev_id){
                                this.deviceData[k].disabled = true;
                            }
                        }
                    }
                    console.log("点击选择设备:",this[formName].selectedDeviceArr,this.deviceData);
                }
            },
            /**
			 *  @function: 输入内容验----form外
			 *  @author: cs
			 *  @date 2018-09-06
			 */
			formOutTest(value,funcName) {
				/**
				 * value:要验证的内容
				 * funcName:验证的方法名
				 */
				// console.log("value:",value,funcName)
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
			 *  @function: 添加按钮 保存按钮点击
			 *  @author: cs
			 *  @date 2018-12-05
			 */
			saveAddBtnClick(value, funcName) {
                console.log("添加按钮 保存按钮点击",this.addBuilding);
                let state = this.formOutTest(value,funcName);
                //新增楼宇
                if(this.addBuilding === ''){
                    this.$message({
                        message: '内容不能为空！',
                        type: 'warning',
                        duration: this.msgDuration
                    })
                    return
                }
                if(!state){
                    this.$refs.addBuilding.focus();
                    return;
                };
                this.addBuildingShow = true;
                this.addDeviceForm.building = this.addBuilding;
            },
            /**
			 *  @function:选择教室
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			selectClassroom(val) {
                console.log(val);
                this.buildingData.forEach(item=>{
                    if(item.buildNo == val){
                         this.addDeviceForm.cardName = item.buildName;
                    }
                })
            },
            /**
			 *  @function:绑定班级
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			selectClass(val) {
                console.log(val);
                this.buildingData.forEach(item=>{
                    if(item.buildNo == val){
                         this.addDeviceForm.cardName = item.buildName;
                    }
                })
			},
            /**
			 *  @function:添加设备-选中的设备
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			handleSelectionChange(val) {
                console.log(val);
                this.selectedDevice = val;
			},
            /**
			 *  @function: 添加设备->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			saveDevice(formName) {
                console.log('添加设备->点击保存按钮',this[formName]);
                this.$refs[formName].validate((valid) => {
					if (valid) {
                        console.log(formName,this[formName]);
                        this.$loading();
                        let dev_id = [];
                        let dev_name = [];
                        let dev_type = [];
                        let dev_type_name = [];
                        for (let i = 0; i < this[formName].selectedDeviceArr.length; i++) {
                            dev_id.push(this[formName].selectedDeviceArr[i].dev_id?this[formName].selectedDeviceArr[i].dev_id:'');
                            dev_name.push(this[formName].selectedDeviceArr[i].dev_name?this[formName].selectedDeviceArr[i].dev_name:'');
                            dev_type.push(this[formName].selectedDeviceArr[i].dev_type?this[formName].selectedDeviceArr[i].dev_type:'');
                            dev_type_name.push(this[formName].selectedDeviceArr[i].dev_type_name?this[formName].selectedDeviceArr[i].dev_type_name:'');
                        }
                        let params = {
                            "place_id": this[formName].building,
                            "place_name":this[formName].place_name,
                            "dev_id":dev_id.join(','),
                            "dev_name":dev_name.join(','),
                            "dev_type":dev_type.join(','),
                            "dev_type_name":dev_type_name.join(','),
                            "dev_bh":"100123",
                            "school_id":localStorage.getItem('schoolId')
                        }
                        if(this.chooseType == 0){
                            //点击添加设备
                            this.addDeviceDialog = false;
                        } else if(this.chooseType == 1){
                            //点击修改设备
                            this.editDeviceDialog = false;
                        }
                        this.$api.DeviceControl.devicePlaceRelation('post',params).then(res => {
                            console.log('新增场所应用关系：', res.data);
                            this.$loading().close();
                            this.getTableData();
                            if (res.data.code == 600 || res.data.code == 0) {
                                this.getTableData();
                                // this.tableData.forEach((item,index)=>{
                                //     this.$set(item, 'indexID', (this.currentPage - 1) * this.pageItem + index + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
                                // })
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
			 *  @function: 添加设备->选择设备->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			saveSelectDevice() {
                let formName = '';
                if(this.chooseType == 0){
                    //点击添加设备
                    formName = 'addDeviceForm';
                } else if(this.chooseType == 1){
                    //点击修改设备
                    formName = 'editDeviceForm';
                };
                this[formName].selectedDeviceArr = this.selectedDevice;
                if(this[formName].selectedDeviceArr.length == 0){// 选择设备不能为空
					this.$message({
						message: '请选择设备！',
						type: 'warning',
						duration: this.msgDuration
					})
					return;
                }
                this.selectDevDialog = false;
                setTimeout(() => {
					this.$refs[formName].clearValidate(['selectedDeviceArr']);
				});
			},
            /**
			 *  @function: 删除所选的设备
			 *  @author: cs
			 *  @date 2019-01-09
			 **/
			delSelectDev(value,item,index) {
                if(value === 'add'){
                    this.addDeviceForm.selectedDeviceArr.splice(index,1);
                }else if(value === 'edit'){
                    this.editDeviceForm.selectedDeviceArr.splice(index,1);
                }
			},
            /**
			 *  @function: 设置表格不可被选中
			 *  @author: cs
			 *  @date 2019-01-11
			 **/
			checkboxInit(row,index){
                // console.log("设置表格不可被选中",row,index);
            　　if (row.disabled){//这个判断根据你的情况而定
            　　　　return 0;//不可勾选
                } else{
            　　　　return 1;//可勾选
                }
            },
            /**
			 *  @function: 获取树结构
			 *  @author: cs
			 *  @date 2018-12-19
			 */
			getTreeData(item){
				let params = {
                    school_id: localStorage.getItem('schoolId'),
                }
                this.$api.Common.getPlaceTree('get',params).then(res => {
                    console.log('查询设备表格：', res.data.data)
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.treeData = res.data.data;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.tableLoading = false;
                })
            },
            /**
			 *  @function: 验证是否重复
			 *  @author: cs
			 *  @date 2019-01-14
			 */
			checkName(name,formName){
                console.log("验证是否重复:",name,this[formName].place_id);
                let params = {
                    place_parent_id: this[formName].place_id,
                    place_name: name,
                    school_id: localStorage.getItem('schoolId'),
                }
                console.log("params",params);
                this.$api.DeviceControl.checkPlaceName('get',params).then(res => {
                    console.log('验证是否重复', res.data)
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.isRepeat = true;
                    } else {
                        // this.isToast = true;
                        // this.toast = res.data.msg;
                        this.isRepeat = false;
                        this.$message({
							message: `${name}重复`,
                            type: 'error', 
                            duration: this.msgDuration
						})
                    }
                })
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
			 *  @function: 添加设备->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			saveBtnClick() {
                console.log('添加通道 场所->点击保存按钮',this.addForm,this.checkedClass);
                this.$refs['addForm'].validate((valid) => {
					if (valid) {
                        if(!this.isRepeat) {
                            this.$message({
                                message: '新增名称重复！',
                                type: 'error', 
                                duration: this.msgDuration
                            })
                            return
                        }
                        console.log("addDeviceForm",this.addForm.place_id);
                        
                        this.$loading();
                        let params = {
                            place_id:this.addForm.place_id,//场所id
                            dic_type:["lx1"],//应用类型,
                            dic_code:["应用1"],//应用名称
                            user_id:localStorage.getItem('userId'),//操作人id
                            school_id:localStorage.getItem('schoolId'),//学校id
                        };
                        this.$api.DeviceControl.getPlaceManageTableList('post',params).then( res => {
                            console.log('通知列表数据', res.data);
                            this.addDialog = false;
                            this.addDeviceForm.building = 10010
                            this.$loading().close();
                            if (res.data.code == 600 ||　res.data.code == 0) {
                               
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
			 *  @function: 添加设备->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			getPlaceName(val) {
                if(this.chooseType == 0){
                    //点击添加设备
                    this.addDeviceForm.place_name = val;
                } else if(this.chooseType == 1){
                    //点击修改设备
                    this.editDeviceForm.place_name = val;
                }
                console.log('val',val);
			},
        },
        watch:{
            // addDeviceForm(val){
            //     console.log(111,val);
            // }
        },
		mounted() {
			this.initLayout();//初始化布局
		},
		created() {
            this.getTableData();//获取表格数据
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .school-enter-exit {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: #E7E8EB;
        .m-bottom {
            width: 100%;
            height: auto;
            background: #fff;
            .operate-box {
                height: 60px;
                line-height: 60px;
                border-bottom: 1px solid #e1e1e1;
                box-sizing: content-box;
                padding-left: 35px;
                font-size: 18px;
                font-weight: bold;
				dd{
					float: left;
					span {
                        font-size: 14px;
                        font-weight: normal;
					}
				}
				.search-box {
                    width: 200px;
                    height: 36px;
                    float: left;
                    margin: 0px 80px 0px 20px;
                    margin-right: 10px;
                    background: #fff;
                    position: relative;
                    .el-input {
                        i {
                            cursor: pointer;
                        }
                    }
                }
                /deep/ .button-div {
                    float: right;
                    margin-right: 30px;
                    margin-top: 11px;
                    height: 38px !important;
                    > div {
                        height: 38px;
                    }
                }
            }
            .table-box {
                td:nth-of-type(2) {
                    img, span {
                        vertical-align: middle;
                    }
                    span {
                        margin-left: 5px;
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
        }
        .member-dialog{
            /deep/ .el-dialog{
                margin-top: 8vh !important;
                .el-select__input{
                    display: inline !important;
                    border: none !important;
                }
                .el-select .el-input.is-focus .el-input__inner{
                    border-color: #1cab7d!important;
                }
                .el-dialog__body{
                    padding-bottom: 0 !important;
                }
                .el-form{
                    text-align: left;
                    .add-btn{
                        display: inline-block;
                        .button-div{
                            margin-right: 0;
                            /deep/ .button.custom7{
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
                    .open-close{
                        border-top: 1px dashed #e1e1e1;
                        dd{
                          display: block;
                            // margin: 20px 0 20px 40px;
                            margin-left: 40px;  
                            height: 60px;
                            line-height: 60px;
                            overflow: hidden;
                            cursor: pointer;
                            span{
                               float: left;
                                margin-top: 0;
                                
                            }
                            i{
                                font-size: 30px;
                                color: #1cab7d;
                                 float: left;
                                -webkit-transition: 0.3s;
                                -moz-transition: 0.3s;
                                -ms-transition: 0.3s;
                                -o-transition: 0.3s;
                                transition: 0.3s;
                            }
                            .arrow{
                                -webkit-transform: rotate(-180deg);
                                -moz-transform: rotate(-180deg);
                                -ms-transform: rotate(-180deg);
                                -o-transform: rotate(-180deg);
                                transform: rotate(-180deg);
                            }
                        }
                    }
                    .el-form-item{
                        &:nth-of-type(3){
                            display: block;
                            border-bottom: 1px dashed #e1e1e1;
                            padding-bottom: 20px !important;
                        }
                        &:nth-of-type(4){
                            margin-right: 50px;
                            margin-bottom: 10px !important;
                        }
                        &:nth-of-type(5){
                            margin-bottom: 10px !important;
                        }
                        .bot{
							overflow: hidden;
							.button-div{
								float: left;
							}
							ul{
								overflow: auto;
								float: left;
								li{
									float: left;
									height: 38px;
									line-height: 38px;
									border-radius: 5px;
									text-align: center;
									cursor: pointer;
									margin-left: 10px;
									padding: 0 10px;
									font-size: 12px;
									letter-spacing: 2px;
									background: #F5F6F5;
									border: 1px solid #e6e6e6;
									color: #999;
									&:nth-child(5n){
										margin-right: 0;
									}
									&.ac{
										background-color: #1cab7d;
										color: #fff;
                                    }
                                    &.ac:hover{
										background-color: #1b9a71;
									}
                                    &.ac:active{
										background-color: #1b9a71;
									}
								}

							}
						}
                    }
                    .show-wrap{
                        .el-form-item{
                            display: block ;
                        }
                    }
                    .el-form-item__content{
                        .el-select{
                            margin-right: 10px;
                        }
                    }
                    .dev-select-info {
                        display: inline-block;
                        position: relative;
                        // span {
                        //     padding: 0 15px;
                        //     &:nth-of-type(1) {
                        //         padding-left: 0;
                        //     }
                        // }
                        .select-dev-list{
                            display: inline-block;
                            height: 38px;
                            position: relative;
                        }
                        .el-input{
                            margin-right: 10px;
                        }
                        img{
                            position: absolute;
                            top: -10px;
                            right: 0px;
                            cursor: pointer;
                        }
                    }
                }
                .button-div{
                    margin-right: 20px;
                    vertical-align: top;
                    .custom7{
                        margin-top: 4px;
                    }
                }
            }
            
        }
        .sch-system-dialog {
            .el-form{
                text-align: left;
            }
            /deep/ .el-table thead th {
                height: 35px;
                font-size: 12px;
            }
            .c-top {
                padding-left: 0px;
                position: relative;
                .ct-title {
                    position: relative;
                    margin-bottom: 10px;
                    line-height: 35px;
                }
                .ct-table {
                    height: 300px;
                    overflow: hidden;
                }
            }
            .c-bom {
                padding-left: 50px;
                .cb-title {
                    position: relative;
                    line-height: 35px;
                    &:before {
                        content: '2';
                        position: absolute;
                        left: -40px;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                        text-align: center;
                        color: #1cab7d;
                        font-weight: bold;
                        border: 2px solid #1cab7d;
                        border-radius: 50%;
                    }
                }
            }
            .content {
                .dev-select-info {
                    display: inline-block;
                    position: relative;
                    span {
                        padding: 0 15px;
                        &:nth-of-type(1) {
                            padding-left: 0;
                        }
                    }
                    .el-input{
                        margin-right: 10px;
                    }
                    img{
                        position: absolute;
                        top: -10px;
                        right: 0px;
                        cursor: pointer;
                    }
                }
                /deep/ .button-div {
                    button {
                        padding: 0 15px;
                    }
                }
            }
            .content2 {
                .c-top {
                    padding-left: 0;
                    .ct-title {

                    }
                }
            }
            /deep/ .el-dialog__header {
                .dialog-title {
                    width: 70%;
                    display: inline-block;
                    li {
                        color: #BABABA;
                        font-weight: bold;
                        font-size: 20px;
                        width: 50%;
                        float: left;
                        span {
                            padding: 5px;
                            cursor: pointer;
                        }
                        &.act-li {
                            span {
                                color: #1cab7d;
                                border-bottom: 3px solid #1cab7d;
                            }
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
