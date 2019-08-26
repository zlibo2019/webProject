<template>
    <div class="video-monitoring">
        <el-container class="m-bom">
            <el-header class="title">
                摄像头数量<span>({{ cameraData.length }})</span>
                <div class="search-div">
                    <input type="text" placeholder="请输入设备ID或场所/教室名称" ref="searchRef" v-model="searchVal"
                            @keyup.13="searchClick">
                    <img src="@/assets/images/search.png" alt="搜索" @click="searchClick">
                </div>
                <div class="btns1">
                    <Button title="添加摄像头" btnClass="custom7" :data="btn1Data" btnFontSize="12px"  @click="openCameraDialog({}, 1)"
                            :iconLeft="true" ></Button>
                            <!-- v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@addCamera_create_own') > -1" -->
                </div>
            </el-header>
            <el-main class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="cameraData" tooltip-effect="dark" border
                          style="width: 100%" v-loading="tableLoading"><!-- v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@selectCameraList_read_own') > -1"-->
                    <el-table-column prop="indexID" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="id" v-if="showIndex"></el-table-column>
                    <el-table-column prop="placeName" label="所在场所" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cameraName" label="摄像头名称" min-width="120" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cameraType" label="摄像头类型" min-width="100" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="cameraTypeData.length > 0 && scope.row.cameraType > 0">{{cameraTypeData[scope.row.cameraType-1].cameraTypeValue}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cameraIp" label="摄像头IP" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cameraUser" label="用户名" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cameraPwd" label="密码" min-width="100" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column label="操作" fixed="right" align="center" min-width="260">
                        <template slot-scope="scope">
                            <!-- v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@updateCameraList_update_own') > -1" -->
                            <el-button class="normal" size="mini" plain @click="openCameraDialog(scope.row, 2)"
                                       >修改</el-button>
                            <el-button class="normal" size="mini" plain @click="unBinding(scope.row)"
                                       >解除绑定</el-button>
                            <el-button class="warning" size="mini" plain @click="deleteCamera(scope.row)"
                                       >删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-main>
            <!-- <el-footer class="pagination-box">
				<el-pagination
						background
						layout="prev, pager, next"
						:page-size=pageSize
						:current-page.sync="currentPage"
						:total="pageAllNum" @current-change="handleCurrentChange">
				</el-pagination>
            </el-footer> -->
        </el-container>
        <!-- 添加/修改 -->
        <el-dialog :title="`${caremaDialogTitle}摄像头`" :visible.sync="addCameraDialog" width="750px" center class="sch-system-dialog camara-dialog">
            <div class="content">
                <el-form :inline="true" ref="cameraForm" :model="cameraForm" :rules="cameraFormRules"
                            label-width="95px" class="demo-form-inline">
                    <el-form-item label="所属场所：" prop="placeId">
                        <SelectTree 
							v-model="cameraForm.placeId"
							:options="treeData" 
                            @labelVal="getPlaceName"
							:props="defaultProps"
                            placeholder="请选择场所/教室"
                            size='medium'
							width="200"></SelectTree>
                        <Button btnClass="custom11"  btnFontSize="12px"  title="+添加" v-if="cameraBtnTag != 2" @click="addClick()" ></Button>
                    </el-form-item>
                    <el-form-item label=" "></el-form-item>
                    <el-form-item label="新增名称：" prop="cameraName">
						<el-input v-model="cameraForm.cameraName" placeholder=""
						    clearable style="width: 120px;" ></el-input>
                    </el-form-item>
                    <el-form-item label=" "></el-form-item>
                    <el-form-item label="摄像头类型：" prop="cameraType">
                        <el-select v-model="cameraForm.cameraType" placeholder="请选择摄像头类型"
                                    style="width: 200px;">
                            <el-option :label="item.cameraTypeValue" :value="item.cameraType" :key="index"
                                        v-for="(item,index) in cameraTypeData"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="摄像头IP：" prop="cameraIp">
                        <el-input v-model="cameraForm.cameraIp" placeholder="请输入摄像头IP"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名：" prop="cameraUser">
                        <el-input v-model="cameraForm.cameraUser" placeholder="请输入用户名" style="width: 200px;"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="cameraPwd">
                        <el-input v-model="cameraForm.cameraPwd" placeholder="请输入密码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="35px" @click="addCameraDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="35px" @click="saveCameraForm"></Button>
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
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                        @click="addDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveBtnClick"></Button>
            </span>
        </el-dialog>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import NavMenu from '@/components/NavMenu/NavMenu'
	import SelectTree from '@/components/SelectTree/SelectTree'
	import Toast from '@/components/Toast/Toast'
	import { Loading } from 'element-ui';

	export default {
		name: 'VideoMonitoring',
		components: {
			Button, NavMenu, Toast, SelectTree
		},
		data() {
			let cameraIpValidate = (rule, value, callback) => {   //输入项的特殊字符校验--文本框
				if (!$.trim(value)) {
					callback(new Error('请输入摄像头IP'));
				} else {
					this.checkIP(value, callback);//form内必填项
				}
				callback();
			};
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
				btn1Data:{
					iconL: require('../../../assets/images/add.png'),
					iconLAct: require('../../../assets/images/add.png')
				},
				showIndex:false,                // 表格列隐藏
				addCameraDialog: false,         // 添加摄像头弹窗
				cameraForm: {                   // 添加摄像头form
					placeId: '',
					cameraName: '',
					cameraType: '',
				},       
				cameraFormRules: {              // 添加摄像头form规则
					placeId: [ { required: true, message: '请选择场所' }],
					cameraName: [ { required: true, message: '请输入摄像头名称' }],
					cameraType: [ { required: true, message: '请选择摄像头类型' }],
					cameraIp: [ { required: true, validator: cameraIpValidate }],
					cameraUser: [ { required: true,message: '请输入用户名' /*validator: cameraUserValidate*/ }],
					cameraPwd: [ { required: true, message: '请输入密码' /*validator: cameraPwdValidate*/ }],
                }, 
				searchVal: "",//搜索内容
				tableLoading: false,            // 摄像头表格加载动画
				buildingData: [],               // 楼宇数据
				cameraTypeData: [               // 摄像头类型
					{
						cameraTypeValue: '海康威视',
						cameraType: 1
					},{
						cameraTypeValue: '大华',
						cameraType: 2
					}],          //摄像头类型
				cameraSideData: [
					{
						cameraDirectValue: '进门/出门',
						cameraDirect: 1
					},{
						cameraDirectValue: '进门',
						cameraDirect: 2
					},{
						cameraDirectValue: '出门',
						cameraDirect: 3
					}],          //摄像头方向
				photographType: [               // 抓拍类型
					{
						name: '开门成功抓拍',
						id: '1'
					},{
						name: '开门失败抓拍',
						id: '2'
					}],             //抓拍类型
				cameraSideData: [],
				cameraTypeData: [],
				cameraData: [],                 // 摄像头数组
				cameraData: [
                    {
                        placeName: '校门口',
                        cameraName: '校门口摄像头',
                        cameraType: '大华',
                        cameraIP: '10.100.6.121',
                        cameraUser: 'admin',
                        cameraPwd: '123456',
                    }
                ],  
				allAisleData: [],               // 新增修改摄像头使用- 全部通道数据
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
                cameraBtnTag: '',               // 选择新增还是修改 1-新增  2-修改
                caremaDialogTitle: '添加',       // 弹窗title
                addDialog:false,                // 添加场所
                addForm:{
					place_id:'',//场所
					aisleName:'',//场所
                },
                usedClassData:[                 // 所属应用
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
				],
                placeData:[],                   //所在场所数据
                placeData:[
                    {
                        place_id: '1',
                        place_name: '校门口'
                    }
                ],//所在场所数据
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
				checkAllClass: true,//是否全选
				isRepeat:false,//输入场所是否重复
                /* addDeviceForm:{         //添加设备form
                    building: '',//所属楼宇
                    classroom: '',//教室名称
                    selectedDeviceArr:[],//选中的设备
                    class:'',//班级
                    cardName:'',//班牌名称
                    openRule:'',//常开规则
                    closeRule:'',//常闭规则
                }, */
				pageAllNum:0,                   // 分页总条数
				currentPage:1,                  // 当前页（默认设为第一页）
				pageSize:20,                    // 分页时当前页显示多少条数据(默认显示20条数据)
				isToast:false,
            }
        },
		methods: {
            // 新增/修改  摄像头
            openCameraDialog(row, tag){
                this.addCameraDialog = true;// 开启弹窗
                if(tag == 1){// 新增
                    this.cameraBtnTag = 1;      // 点击了新增
                    this.caremaDialogTitle = '添加';
                    this.cameraForm = {       // 清空form
                        placeId: '',
                        cameraName: '',
                        cameraType: '',
                        cameraIp: '',                // 清空（IE必填）
                        cameraUser: '',
                        cameraPwd: '',
                    };
                    this.getPlaceTree();
                    setTimeout(() => {
                        this.$refs["cameraForm"].clearValidate();
                    })
                }else if(tag == 2){// 修改
                    this.caremaDialogTitle = '修改';
                    this.cameraId = row.cameraId;
                    this.cameraBtnTag = 2;      // 点击了修改
                    row.cameraType = parseInt(row.cameraType)
                    this.cameraForm = JSON.parse(JSON.stringify(row))
                    
                    //获取内容并赋值
                    // this.cameraForm = row;
                    // this.cameraForm.cameraType = parseInt(this.cameraForm.cameraType);// 转id为int
                    // this.cameraForm = {}
                    // this.cameraForm = {
                    //     id:row.id,
                    //     placeId: row.placeId,
                    //     placeName: row.placeName,
                    //     cameraName: row.cameraName,
                    //     cameraType: parseInt(row.cameraType),
                    //     cameraIp: row.cameraIp,
                    //     cameraUser: row.cameraUser,
                    //     cameraPwd: row.cameraPwd,
                    // }
                    console.log(15487,this.cameraForm);
                }
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
			 *  @function: 删除摄像头按钮
			 *  @author: lxr
			 *  @date 2018-9-1
			 **/
			deleteCamera(row){
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					Loading.service();
					this.$api.Rules.deleteCameraList({id:row.id}).then( res => {
						// console.log('删除摄像头是否成功', res)
						Loading.service().close();
						if (res.data.code == 600 ||　res.data.code == 0) {
							this.$message({type: 'success', message: '删除成功!'});//请求删除成功之后提示
							this.loadCameraData();//获取摄像头数据
						}else{
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
			 *  @function: 添加摄像头功能----保存按钮
			 *  @author: lxr
			 *  @date 2018-9-1
			 **/
			saveCameraForm(){
				this.$refs['cameraForm'].validate((valid) => {
					if (valid) {
						Loading.service();
						let params = {
							schoolId: localStorage.getItem('schoolId'),
							id:this.cameraForm.id,
							placeId: this.cameraForm.placeId,
							placeName: this.cameraForm.placeName,
							cameraName: this.cameraForm.cameraName,
							cameraType: this.cameraForm.cameraType,
							cameraIp: this.cameraForm.cameraIp,
							cameraUser: this.cameraForm.cameraUser,
							cameraPwd: this.cameraForm.cameraPwd,
						}
                        if(this.cameraBtnTag == 1){// 新增保存
							this.$api.Rules.addCamera(params).then( res => {
		                        // console.log('新增摄像头是否成功', res)
		                        Loading.service().close();
		                        this.isToast = true;
		                        this.toast = res.data.msg;
		                        if (res.data.code == 600 ||　res.data.code == 0) {
			                        this.addCameraDialog = false;// 关闭摄像头弹窗
			                        this.loadCameraData();//获取摄像头数据
		                        }
	                        }).catch(err =>{
								Loading.service().close();
							})
                        }else if(this.cameraBtnTag == 2){// 修改保存
                            params.cameraId = this.cameraId;
							this.$api.Rules.updateCameraList(params).then( res => {
		                        // console.log('修改摄像头是否成功', res)
		                        Loading.service().close();
		                        this.isToast = true;
		                        this.toast = res.data.msg;
		                        if (res.data.code == 600 ||　res.data.code == 0) {
			                        this.addCameraDialog = false;// 关闭摄像头弹窗
			                        this.loadCameraData();//获取摄像头数据
		                        }
	                        }).catch(err =>{
								Loading.service().close();
							})
                        }
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
			 *  @function: 上方搜索
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			searchClick() {
				this.loadCameraData();//搜索表格内容
			},
            /**
			 *  @function: 选择场所-存场所名称
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			getPlaceName(val) {
                console.log("val",val);
                
                this.cameraForm.placeName = val;
                return
                if(this.cameraBtnTag == 1){
                    //点击添加设备
                    this.aisleCameraForm.place_name = val;
                } else if(this.cameraBtnTag == 2){
                    //点击修改设备
                    this.editDeviceForm.place_name = val;
                }
                console.log('val',val);
			},
            /**
			 *  @function: 添加设备弹窗，添加按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 */
			addClick() {
                this.addBuilding = '';
                console.log('添加场所');
                this.addDialog = true;
                this.addForm = {
                    place_id:'',//场所
                    aisleName:'',//新增名称
                };
                //获取下拉列表数组
                let params = {
                    school_id: localStorage.getItem('schoolId')
                }
                this.$api.DeviceControl.placeLevel2('get',params).then(res =>{
                    console.log('获取所在场所2级下拉列表:', res.data) 
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.placeData = res.data.data.rows;
                        console.log(this.placeData,"1placeData");
                        if(this.placeData.length > 0) this.addForm.place_id = this.placeData[0].place_id;
                        
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
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
			 *  @function: 添加摄像头-添加场所->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			saveBtnClick() {
                console.log('添加摄像头 场所->点击保存按钮',this.addForm,this.checkedClass);
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
                        console.log("aisleCameraForm",this.addForm.place_id);
                        this.$loading();
                        let params = {
                            "place_name": this.addForm.aisleName, //名字
                            "place_parent_id": this.addForm.place_id,//上级id
                            "school_id": localStorage.getItem('schoolId'),
                            "is_leaf": "1",
                            "level": "3",
                        }
                        console.log(params);
                        this.$api.DeviceControl.addPlaceTree('post',params).then(res =>{
                            this.$loading().close();
                            console.log('新增场所:', res.data)
                            if (res.data.code == 600 || res.data.code == 0) {
                                this.$message({
                                    showClose: true,
                                    message: '添加成功',
                                    type: 'success',
                                    duration: this.msgDuration
                                })
                                this.addDialog = false;
                                this.getPlaceTree(res.data.data.place_id);
                                
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
					}
				});
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
			 *  @function: table 列表点击筛选(全部通道)
			 *  @author: lxr
			 *  @date 2018-08-30
			 */
			filterTag(value, row) {
				return row.channelName === value;
			},
			/**
			 *  @function: 获取楼宇数据
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			loadBuildData(){
				let params = {
					placeId: 0,// 场所id--传顶级场所 0
				}
				this.$api.Rules.getBuildList(params).then( res => {
					// console.log('楼宇数据', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.buildingData = res.data.data;
						// this.resizeInputWidth();//重定义input宽
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载摄像头数据
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			loadCameraData(){
				this.tableLoading = true;  // 开启loading
				let params = {
					count: true,
					page_index: this.currentPage,
					page_size: 10000,
					search: {
						placeId: '',// this.activeInputId,// 场所id
					}
				}
				this.$api.Rules.selectCameraList(params).then( res => {
					// console.log('根据楼宇查询通道摄像头数据', res)
					this.tableLoading = false;  // 关闭loading
					if (res.data.code == 600 ||　res.data.code == 0) {
                        this.cameraData = res.data.data.records;
                        this.cameraData.forEach((item,index)=>{
                            this.$set(this.cameraData[index],'indexID',index + 1)
                        })
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;  // 关闭loading
                })
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
             *  @function: 获取树结构
             *  @author: cs
             *  @date 2018-12-19
             */
            getPlaceTree(place_id) {
                let params = {
                    school_id: localStorage.getItem("schoolId")
                };
                this.$api.Common.getPlaceTree("get", params).then(res => {
                    console.log("获取树结构:", res.data.data);
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.treeData = res.data.data;
                        this.cameraForm.placeId = place_id; 
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err => {
                    this.tableLoading = false;
                });
            },
            /**
			 *  @function: 获取摄像头弹窗中的数据
			 *  @author: lxr
			 *  @date 2018-9-13
			 **/
            getCaremaDialogData(){
            	// 获取摄像头类型
				this.$api.Rules.getCameraType().then( res => {
					// console.log('摄像头类型', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.cameraTypeData = res.data.data;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
            },
        },
		mounted() {
			this.loadCameraData();      //获取摄像头数据
            this.getCaremaDialogData();
            this.getPlaceTree();
        }
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .video-monitoring {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .set-top{
            height:6.3vh;
            background:#F5F7F8;
            /deep/ .navmenu-container{
                .navbar{
                    .nav-div{
                        text-align: center;
                        color:#c0c4cc;
                        &.actives {
                            color: #1cab7d;
                        }
                    }
                    .icon{
                        position: static;
                    }
                }
            }
        }
        .set-bottom{
            margin-top: 10px;
        }
        .m-bom{
            height:100%;
            background: #fff;
            .title{
                border-bottom: 1px solid #e1e1e1;
                span{
                    font-size: 14px;
                    padding-left: 15px;
                    font-weight: normal;
                }
                .search-div {
                    display: inline-block;
                    width: 260px;
                    height: 100%;
                    margin-left: 10px;
                    position: relative;
                    input {
                        border: 1px solid #e1e1e1;
                        outline: none;
                        height: 30px;
                        line-height: 30px;
                        color: #999;
                        padding: 0 20px;
                        width: 220px;
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
                        right: 45px;
                        margin: auto;
                        width: 17px;
                        cursor: pointer;
                    }
                }
            }
            .table-box{
                padding: 0;
                /deep/ .is-leaf:not(.is-center){
                    padding: 0 10px;
                    /*width: 200px;*/
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
                /deep/ .el-table{
                    border-top: 0;
                    border-left: 0;
                    .el-table__fixed-right {
                        /*border-left: 1px solid #ebeef5;*/
                    }
                }
                /deep/ .is-leaf:not(.is-center){
                    padding: 0 10px;
                    /*width: 200px;*/
                    .cell{
                        border: 1px solid #e1e1e1;
                        background: #fff;
                        border-radius: 5px;
                    }
                }
                .roll-span{
                    border-bottom: 1px solid #1cab7d;
                    color: #1cab7d;
                }
                /deep/ table td:last-child .cell{
                    text-align: center;
                }
            }
            .el-footer{

                padding: 0;
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
        .camara-dialog{
            /deep/ .el-dialog--center .el-dialog__body{
                padding-bottom: 0;
                .el-form-item{
                    height: 45px;
                    line-height: 45px;
                    &:nth-of-type(1){
                        margin: 0;
                        .el-form-item__error{
                            top: 38px;
                        }
                    }
                }
                .el-form-item__content{
                    .button-div{
                        vertical-align: top;
                    }
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
        .sch-system-dialog{
            /deep/ .el-dialog--center .el-dialog__body{
                text-align: left;
            }
        }
    }
</style>
