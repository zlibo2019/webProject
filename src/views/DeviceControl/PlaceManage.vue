<template>
    <div class="place-manage">
		<div class="m-left">
			<h4>学校场所</h4>
			<div class="inner">
				<el-tree
					:data="treeData"
					ref="tree"
					show-checkbox
					node-key="id"
					default-expand-all
					:expand-on-click-node="false"
					@check="getCheckedKeys">
					<span class="custom-tree-node" slot-scope="{ node, data }">
						<input type="text" :value="data.label" :class="['span','input'+data.id]" disabled @blur="blurClick(data,treeInputVal)">
						<ul class="hover-show">
							<li @click="treeClick(1,node, data,$event)"
								v-if="iconShow && data.is_leaf == 0 ">
								<img src="../../assets/images/add_no.png" alt="新增班级" title="新增班级" class="img-no">
								<img src="../../assets/images/add_ac.png" alt="新增班级" title="新增班级" class="img-ac">
							</li>
							<li @click="treeClick(2,node, data,$event)"
							v-if="iconShow && data.is_leaf == 1 && data.is_system == 0">
								<img src="../../assets/images/del_no.png" alt="删除班级" title="删除班级" class="img-no">
								<img src="../../assets/images/del_ac.png" alt="删除班级" title="删除班级" class="img-ac">
							</li>
							<li @click="treeClick(3,node, data,$event)" 
							v-if="iconShow && data.is_system == 0 && data.pid != 0">
								<img src="../../assets/images/change_no.png" alt="修改名称" title="修改名称"
										class="img-no">
								<img src="../../assets/images/change_ac.png" alt="修改名称" title="修改名称"
										class="img-ac">
							</li>
							<li></li>
						</ul>
					</span>
				</el-tree>
				<!--树形图删除弹窗-->
				<div class="modal-wrap" v-show="deeClassDialog">
					<div class="modal-add" @click="deeClassDialog = false"></div>
					<div class="add-content">
						<div class="add-inner">
							确定要删除 <span style="color: #1cab7d;">{{addData.label}} </span>么?
						</div>
						<button class="btn" @click="deeClassDialog = false">取消</button>
						<button class="btn confirm" @click="confirmDee(addNode,addData)">确认</button>
					</div>
				</div>
			</div>
		</div>
		<div class="m-right">
			<div class="m-bottom">
				<div class="operate-box">
					<dd>设备数量 <span>({{ allNum }})</span></dd>
					<!-- <div class="search-box">
						<el-input v-model="searchVal" size="small" placeholder="请输入设备ID或教室名称" @change="search">
							<i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
						</el-input>
					</div> -->
					<Button title="添加场所" btnClass="custom8" btnFontSize="12px" btnHeight="38px" @click="addBtnClick"></Button>
				</div>
				<div class="table-box">
					<el-table id="table" ref="multipleTable" height="100%" border align="center" :data="tableData" tooltip-effect="dark"
							highlight-current-row style="width: 100%" v-loading="tableLoading">
						<el-table-column prop="indexID" label="序号" min-width="80" ></el-table-column>
						<el-table-column prop="parent_name" label="所在场所" min-width="100" show-overflow-tooltip></el-table-column>
						<el-table-column prop="place_name" label="教室/场所名称" min-width="130" show-overflow-tooltip></el-table-column>
						<el-table-column label="所属应用" min-width="100" show-overflow-tooltip>
                            <template slot-scope="scope">
                                {{scope.row.sc_dev_place_apps}}
							</template>
                        </el-table-column>
						<el-table-column  label="设备情况" min-width="100" align="center" show-overflow-tooltip>
							<template slot-scope="scope">
								<span v-if="scope.row.sc_dev_statuses.length > 0">已部署</span>
								<span v-else>/</span>
							</template>
						</el-table-column>
						<el-table-column fixed="right" label="操作" align="center" min-width="150">
							<template slot-scope="scope">
                                <!-- place_type=0为部门同步过来的，1为系统添加场所  -->
								<el-button class="normal" size="mini" plain @click="rowClick(scope.row)">修改</el-button>
								<el-button class="warning" size="mini" plain @click="delClick(scope.row)" v-if="scope.row.place_type == 0" >删除</el-button>
							</template>
						</el-table-column>
					</el-table>
				</div>
				<div class="pagination-box">
					<el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
								:current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
				</div>
			</div>
		</div>
		<!-- 添加场所 -->
		<el-dialog title="添加场所" :visible.sync="addDialog" v-if="addDialog"  width="700px" center class="member-dialog">
            <div class="content">
                <el-form ref="addForm" label-width="100px" :rules="rules" :model="addForm">
                    <el-form-item label="所在场所：" prop="place_id">
                        <el-select v-model="addForm.place_id" placeholder="请选择场所">
                            <el-option v-for="item in placeData"  :key="item.place_id" :label="item.place_name" :value="item.place_id"> </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="新增名称：" prop="aisle">
						<el-input v-model="item.aisleName" placeholder="请输入名称" @input="checkName(item.aisleName,'addForm')"
						clearable style="width: 120px;" v-for="(item, index) in addForm.aisle" :key="index"></el-input>
						<Button btnClass="custom11"  btnFontSize="12px"  title="+添加"  @click="addAisle" ></Button>
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

		<!-- 修改场所 -->
		<el-dialog title="修改场所" :visible.sync="editDialog" v-if="editDialog" width="700px" center class="member-dialog">
            <div class="content">
                <el-form ref="editForm" label-width="100px" :rules="rules" :model="editForm">
                    <el-form-item label="所在场所：" prop="place_id">
                        <el-select v-model="editForm.place_id" placeholder="请选择场所" disabled>
                            <el-option v-for="item in placeData"  :key="item.place_id" :label="item.place_name" :value="item.place_id"> </el-option>
                        </el-select>
                    </el-form-item>
					<el-form-item label="新增名称：" prop="place_name">
                        {{editForm.place_name}}
						<el-input v-model="editForm.place_name" placeholder="请输入名称" @input="checkName(editForm.place_name,'editForm')"
						clearable style="width: 120px;"></el-input>
                    </el-form-item>
                    <el-form-item label="所属应用：">
						<div class="bot">
							<Button :btnClass="checkedClass.length == usedClassData.length?'custom8' : 'custom6'" btnFontSize="12px" btnHeight="38px" title="全部" @click="handleCheckAllChange"></Button>
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
                        @click="editDialog = false"></Button>
                <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                        @click="saveEditBtnClick"></Button>
            </span>
        </el-dialog>
		<Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	let id = 2000;
	export default {
		name: 'PlaceManage',
		components: {
			Button,Toast
		},
		data() {
            //form内必填项校验--文本框
			let validateInputChars = (rule, value, callback) => { 
				if (!$.trim(value[0].aisleName)) {
					callback(new Error('必填项不能为空'));
				} else {
                    console.log("value:",value);
                    for (let i = 0; i < value.length; i++) {
                        this.checkInputChars(value[i].aisleName, callback);
                    }
					callback();
				}
			};
			return {
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				searchVal:'',     //搜索关键字
				switchBtn: true,//规则切换新增/保存按钮
				tableLoading: false,        //表格加载动画
				tableData:[],				//table数组
				allNum: 0,             //table数组总条数
				currentPage: 1,      //当前页（默认设为第一页）
                pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				addForm:{
					place_id:'',//场所
					aisle:[
						{
							aisleName:''
						}
					],//通道
					application:[],//所属应用
				},//添加form
				addDialog:false,//添加弹窗
				editDialog:false,//修改弹窗
				editForm:{
					place_id:'',//场所
					aisle:[
						{
							aisleName:''
						}
					],//通道
					application:[],//所属应用
				},//添加form
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
				checkedClass:[],//选中的应用
				checkAllClass: true,//是否全选
				rules:{
					place_id:[
						{required: true, message: '请选择场所', trigger: 'change'}
					],
					place_name:[
						{required: true, message: '请输入名称', trigger: 'blur'}
					],//修改场所名称
                    aisle: [
                         {required: true, validator: validateInputChars,trigger: 'blur' }
                    ],
				},
				placeData:[],//所在场所数据
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
                treeData:[],
				deeClassDialog: false,//教室删除弹窗显示
				addNode: {},//树形图新增节点 传参用
				addData: [],//树形图新增数据 传参用
				checkedKeys: [],//左侧树选中
				treeClickState:2,//新增:1 ，删除和默认:2 ，修改:3
				iconShow:true,//树结构 操作按钮是否展示
				treeInputVal:'',//树结构 input输入内容
				isRepeat:false,//输入场所是否重复
			}
		},
		methods: {
			/**
			 * toast弹窗隐藏
			 * wzx
			 * 2018.7.18
			 */
			hideToast() {
				this.isToast = false;
			},
			/**
			 *  @function: 确认删除班级
			 *  @author: cs
			 *  @date 2018-07-20
			 */
			confirmDee(node, data) {
				console.log("删除 节点", node, data)
				// const parent = node.parent;
				// const children = parent.data.children || parent.data;
				// const index = children.findIndex(d => d.id === data.id);
				// children.splice(index, 1);
				// this.$message({
				// 	showClose: true,
				// 	message: '删除成功',
				// 	type: 'success', duration: this.msgDuration
				// })
                this.deeClassDialog = false;
                this.$api.DeviceControl.addPlaceTree('delete',{},data.id).then(res =>{
                    console.log('修改成功:', res.data)
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success',
                            duration: this.msgDuration
                        })
                        //console.log("新增" + this.addNum + "个班级")
                        this.getTreeData();
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
				/* TODO调用接口 */
				/* this.$refs["tree"].setCheckedKeys([]);
				this.getTableList(data.id, (param)=>{
					if(param){
						this.$message({
							showClose: true,
							message: '该部门下存在老师，不能删除',
							type: 'error',
							duration: this.msgDuration
						})
						this.deeClassDialog = false;
					}else{
						this.$api.BasicInfo.delClassListTeacher({deptId:data.id}).then(res =>{
							//console.log('删除班级:', res.data)
							if (res.data.code == 600 || res.data.code == 0) {
								this.$message({
									showClose: true,
									message: '删除成功',
									type: 'success',
									duration: this.msgDuration
								})
								this.deeClassDialog = false;
								this.getTreeData();
							} else {
								this.deeClassDialog = false;
								this.isToast = true;
								this.toast = res.data.msg;
							}
						})
					}
				}) */
			},
			/**
			 *  @function: 树形图input失焦
			 *  @author: cs
			 *  @date 2018-10-12
			 */
			blurClick(data,deptName){
				console.log('点击状态',data,deptName,this.treeClickState)
				let vThis = this;
				this.iconShow = true;
				if(this.treeClickState == 1){
					// console.log('点击新增');
				}else if(this.treeClickState == 3){
					console.log('点击修改',deptName);
					$('.input' + data.id).attr('disabled', 'true')
					if (deptName == '') {
						this.$message({
							showClose: true,
							message: '场所名称不能为空！',
							type: 'warning',
							duration: this.msgDuration
						})
						setTimeout(()=>{
							$('.input' + data.id).focus();
							let tObj = $('.input' + data.id)[0];
							let sPos = $('.input' + data.id).val().length;
							this.setCaretPosition(tObj, sPos);
							let actInput = $('.inner .span');
							$.each(actInput, function (i, input) {
								let inputValLenJson = vThis.inputValLength(input);
								input.size = inputValLenJson.numLen + inputValLenJson.enLen + (inputValLenJson.textLen);
								$(input).on('input propertychange', function () {
									let inputValLenJson2 = vThis.inputValLength(input);
									input.size = inputValLenJson2.numLen + inputValLenJson2.enLen + (inputValLenJson2.textLen);
								})
							})
						})
						return
					}
					data.label = deptName;
                    /* TOTO调用接口 */
                    let jsonParam = {
                        "place_parent_id": data.pid,
                        "place_name": deptName,
                        "level": 2,
                        "is_leaf": 0,
                        "school_id": localStorage.getItem('schoolId'),
                    }
                    console.log(jsonParam,data);
                    this.$api.DeviceControl.addPlaceTree('put',jsonParam,data.id).then(res =>{
                        console.log('修改成功:', res.data)
                        if (res.data.code == 600 || res.data.code == 0) {
                            this.$message({
                                showClose: true,
                                message: '修改成功',
                                type: 'success',
                                duration: this.msgDuration
                            })
                            //console.log("新增" + this.addNum + "个班级")
                            this.getTreeData();
                        } else {
                            this.isToast = true;
                            this.toast = res.data.msg;
                        }
                    })
					/* let jsonParam = {	
						"deptId": data.id,//部门id 新增不传
						"deptName": deptName, //名字
						// "isLeaf": 1,//新增固定传1 ， 修改不用传
						// "ptDeptId": data.id,//上级id（ 高一新增  传高一的id )
					}
					this.$api.BasicInfo.modifyDepNameTeacher(jsonParam).then(res =>{
						//console.log('修改班级:', res.data)
						if (res.data.code == 600 || res.data.code == 0) {
							vThis.$message({
								showClose: true,
								message: '修改成功',
								type: 'success',
								duration: vThis.msgDuration
							})
							vThis.getTreeData();
							vThis.getTableList();
						} else {
							vThis.isToast = true;
							vThis.toast = res.data.msg;
						}
					}); */
					let tObj = $('.input' + data.id)[0];
					let sPos = $('.input' + data.id).val().length;
					this.setCaretPosition(tObj, sPos);
					let actInput = $('.inner .span');
					$.each(actInput, function (i, input) {
						let inputValLenJson = vThis.inputValLength(input);
						input.size = inputValLenJson.numLen + inputValLenJson.enLen + (inputValLenJson.textLen);
						$(input).on('input propertychange', function () {
							let inputValLenJson2 = vThis.inputValLength(input);
							input.size = inputValLenJson2.numLen + inputValLenJson2.enLen + (inputValLenJson2.textLen);
						})
					})
				}
				
			},
			/**
			 *  @function: 树形图点击增删改
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			treeClick(value, node, data, event) {
				// console.log("树形图点击:",value, node, data, event)
				let vThis = this;
				// let id = 1000;
				this.iconShow = false;
				if (value === 1) {
					//点击新增
					this.treeClickState = 1;
					// console.log("点击新增", id)
					  const newChild = {id: id++, label: '新建', children: []};
                      if (!data.children) {
                          this.$set(data, 'children', []);
                      }
                      data.children.push(newChild);
					this.resizeInputWidth();
					setTimeout(() => {
						$('.input' + newChild.id).removeAttr('disabled');
						$('.input' + newChild.id).focus()
						$('.input' + newChild.id).keyup(function (e) {//捕获文档对象的按键弹起事件
							if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
								//此处编写用户敲回车后的代码
								$(this).blur();
							}
						});
						$('.input' + newChild.id).on('blur propertychange', (e)=> {
							console.log(11,$(e.target).val(),"---",newChild)
							if ($(e.target).val() == '') {
								this.$message({
									showClose: true,
									message: '场所名称不能为空！',
									type: 'warning',
									duration: this.msgDuration
								})
								// $('.input' + newChild.id).focus();
								// console.log($('.input' + newChild.id));
								newChild.label = '';
								$('.input' + newChild.id).focus();
								let tObj = $('.input' + newChild.id)[0];
								let sPos = $('.input' + newChild.id).val().length;
								this.setCaretPosition(tObj, sPos);
								let actInput = $('.inner .span');
								$.each(actInput, function (i, input) {
									let inputValLenJson = vThis.inputValLength(input);
									input.size = inputValLenJson.numLen + inputValLenJson.enLen + (inputValLenJson.textLen);
									$(input).on('input propertychange', function () {
										let inputValLenJson2 = vThis.inputValLength(input);
										input.size = inputValLenJson2.numLen + inputValLenJson2.enLen + (inputValLenJson2.textLen);
									})
								})
							} else {
								newChild.label = $(e.target).val();
								$('.input' + newChild.id).attr('disabled', 'true')
								//获取当前存在的index  并删除
								// const index = data.children.indexOf(newChild);
								// data.children.splice(index, 1);
								/* TODO调用接口 */
								let jsonParam = {
                                    "place_name": $(e.target).val(), //名字
                                    "place_parent_id": data.id,//上级id（ 高一新增  传高一的id )
                                    "school_id": localStorage.getItem('schoolId'),
                                    "is_leaf": "1",
                                    "level": "3",
                                }
                                if(data.pid == -1){
                                    jsonParam.is_leaf = 0;
                                    jsonParam.level = 2;
                                }
                                console.log(jsonParam);
								this.$api.DeviceControl.addPlaceTree('post',jsonParam).then(res =>{
                                    console.log('新增场所:', res.data)
                                    if (res.data.code == 600 || res.data.code == 0) {
                                        this.$message({
                                            showClose: true,
                                            message: '新增成功',
                                            type: 'success',
                                            duration: this.msgDuration
                                        })
                                        //console.log("新增" + this.addNum + "个班级")
                                        this.getTreeData();

                                    } else {
                                        this.isToast = true;
                                        this.toast = res.data.msg;
                                    }
                                })
							}
						})
					}, 26)

				} else if (value === 2) {
					//console.log("点击删除")
					this.deeClassDialog = true;
					this.addNode = node;
					this.addData = data;
					this.treeClickState = 2;
					this.iconShow = true;
				} else if (value === 3) {
					//点击修改
					this.treeClickState = 3;
					$('.inner .span').attr('disabled', 'true')
					$('.input' + data.id).removeAttr('disabled');
					$('.input' + data.id).focus();
					vThis.treeInputVal = $('.input' + data.id).val();
					console.log("vThis.treeInputVal:",vThis.treeInputVal)
					$('.input' + data.id).keyup(function (e) {//捕获文档对象的按键弹起事件
						vThis.treeInputVal = $(this).val();
						// console.log("vThis.treeInputVal:",vThis.treeInputVal)
						if (e.keyCode == 13) {//按键信息对象以参数的形式传递进来了
							//此处编写用户敲回车后的代码
							$(this).blur()
						}
					});
				}
			},
			/**
			 *  @function: 重新获取宽高
			 *  @author: lxr
			 *  @date 2018-7-20
			 **/
            resizeLayout(){
	            setTimeout(()=> {
		            let mrH = $('.index .m-right').height();
		            let obH = $('.m-right .operate-box').height();
		            let pbH = $('.pagination-box').height();
					let tblH =  mrH - obH - pbH  ;
					let trH =  mrH - obH  -40;
					console.log(mrH,obH,pbH,tblH);
					$('.m-left .el-tree').height(trH);
		            $('.m-right .table-box').height(tblH)
	            },20)
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
					let actInput = $('.inner .span');
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
			/* ----------三期------------- */
			/**
			 *  @function:搜索
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			search() {
                console.log("搜索",this.searchVal);
                // this.getTableData();
            },
			/**
			 *  @function:分页
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.getTableData();
			},
			/**
			 *  @function:添加场所
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			addBtnClick() {
				console.log('添加场所');
				this.addDialog = true;
				this.addForm = {
					place_id:'',//场所
					aisle:[
						{
							aisleName:''
						}
					],//通道
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
                this.$api.DeviceControl.placeLevel2('get',params).then(res =>{
                    console.log('获取所在场所下拉列表:', res.data) 
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
			},
			/**
			 *  @function:添加通道
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			addAisle(){
				let state = false;
				this.addForm.aisle.forEach(item => {
					if(item.aisleName === ''){
						this.$message({
							message: '新增名称不能为空！',
							type: 'error', duration: this.msgDuration
						})
						state = true;
						return
					}
				});
				if(!state){
					this.addForm.aisle.push({
						aisleName:''
					})
				}
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
                        this.editDialog = false;
                        console.log("addForm",this.addForm);
                        
                        // this.$loading();
                        let params = {
                            place_id:this.addForm.place_id,//场所id
                            dic_type:["lx1"],//应用类型,
                            dic_code:["应用1"],//应用名称
                            user_id:localStorage.getItem('userId'),//操作人id
                            school_id:localStorage.getItem('schoolId'),//学校id
                        };
                        console.log(params,this.checkedClass);
                        
                        // return
                        this.$api.DeviceControl.getPlaceManageTableList('post',params).then( res => {
                            console.log('通知列表数据', res.data);
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
			 *  @function: 修改设备->点击保存按钮
			 *  @author: cs
			 *  @date 2018-12-04
			 **/
			saveEditBtnClick() {
                console.log('添加通道 场所->点击保存按钮',this.editForm);
                this.$refs['editForm'].validate((valid) => {
					if (valid) {
                        this.editDialog = false;
                        console.log("editForm",this.editForm);
                        this.$loading();
                        let params = {
                            place_id:this.editForm.place_id,//场所id
                            place_name:this.editForm.place_name,//场所id
                            dic_type:["lx1"],//应用类型,
                            dic_code:["应用1"],//应用名称
                            user_id:localStorage.getItem('userId'),//操作人id
                            school_id:localStorage.getItem('schoolId'),//学校id
                        };
                        this.$api.DeviceControl.getPlaceManageTableList('put',params).then( res => {
                            console.log('通知列表数据', res.data);
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
                        
					} else {
						this.$message({
							message: '请输入内容（*为必填项）',
                            type: 'error', 
                            duration: this.msgDuration
						})
						return false;
					}
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
                    place_id:this.checkedKeys.length>0?this.checkedKeys.join(','):0,//场所id
                    school_id:localStorage.getItem('schoolId'),//学校id
                    page_index: this.currentPage,
					page_size: this.pageItem,
                };
                this.$api.DeviceControl.getPlaceManageTableList('get',params).then( res => {
                    console.log('通知列表数据', res.data.data);
                    this.tableLoading = false;
                    // this.tableData = res.data.rows;
                    // this.allNum = res.data.count;
                    // this.tableData.forEach((item,index)=>{
                    //     this.$set(item, 'indexID', (this.currentPage - 1) * this.pageItem + index + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
                    // })
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
			 *  @function: 点击修改
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			rowClick(row) {
				console.log('点击修改',row);
				this.editDialog = true;
				setTimeout(() => {
                   	this.$refs.editForm.resetFields();
				}, 20);
				let rows = JSON.stringify(row);
                this.editForm = JSON.parse(rows);
                this.checkAllClass = true;
				this.usedClassData.forEach(item=>{
					item.checked = true;
				})
				this.checkedClass = this.usedClassData;
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
                    this.$api.DeviceControl.getPlaceManageTableList('delete',params).then(res => {
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
			 *  @function: 树形图点击
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			getCheckedKeys() {
				this.checkedKeys = this.$refs["tree"].getCheckedKeys(true);
				console.log("this.checkedKeys:",this.checkedKeys)
				this.currentPage = 1;
				this.getTableData()
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
                    this.resizeInputWidth();//重定义input宽
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
			
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			// setTimeout(()=>{
			// 	this.resizeLayout();//重新获取宽高
			// },100)
			this.resizeLayout();//重新获取宽高
			// this.initLayout();
		},
		created(){
            this.getTableData();//获取表格数据
            this.getTreeData();
            // this.getTableList(this.activeInputId);//获取table列表
            
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .place-manage {
        width: 100%;
        height: 100%;
        margin: 0 auto;
		display: flex;
		text-align: center;
		// overflow: hidden;
		background-color: #E7E8EB;
		.m-left {
			flex-basis: 330px;
			min-width: 330px;
			text-align: center;
			background-color: #fff;
			font-size: 12px;
			overflow: hidden;
			h4{
				width: 100%;
				min-height: 60px;
				line-height: 60px;
				font-size: 18px;
				font-weight: bold;
				color: #666;
				text-align: left;
				padding-left: 30px;
				border-bottom: 1px solid #e1e1e1;
				background-color: #eff3f6;
			}
			.inner{
				width: 100%;
				height: 100%;
				position: relative;
                .el-tree{
				    overflow: auto;
                }
				.custom-tree-node {
					line-height: 26px;
					display: inline;
					.span {
						padding-left: 5px;
						padding-right: 5px;
						text-align: center;
						color: #333;
						width: auto;
						border: 1px solid transparent;
						outline: none;
						display: inline-block;
						background-color: transparent;
					}
					input:disabled {
						border: 1px solid transparent !important;
						background-color: transparent !important;
						color: #333 !important;
						opacity: 1;
						-webkit-text-fill-color: #333;
					}

					.hover-show {
						display: inline-block;
						height: 26px;
						line-height: 26px;
						li {
							width: 26px;
							height: 26px;
							position: relative;
							display: inline-block;
							vertical-align: middle;
							opacity: 0;
							img {
								position: absolute;
								left: 0;
								top: 0;
								right: 0;
								bottom: 0;
								margin: auto;
							}
							.img-no {
								display: block;
							}
							.img-ac {
								display: none;
							}
							&:hover {
								.img-no {
									display: none;
								}
								.img-ac {
									display: block;
								}
							}
						}
					}

				}
				.el-tree-node__content {
					font-size: 15px;
					color: #666;

					&:hover {
						li {
							opacity: 1;
						}
					}
				}
					.modal-wrap {
					.modal-add {
						width: 100%;
						height: 100%;
						position: absolute;
						left: 0;
						top: 0;
						z-index: 10;
						background-color: rgba(0, 0, 0, .1);
					}
					.add-content {
						width: 80%;
						height: 100px;
						border: 1px solid #e1e1e1;
						border-radius: 6px;
						background-color: #fff;
						position: absolute;
						left: 0;
						right: 0;
						top: 0;
						bottom: 0;
						margin: auto;
						z-index: 11;
						.add-inner {
							margin-top: 20px;
							margin-bottom: 15px;
							font-size: 14px;
							input {
								border: 1px solid #e1e1e1;
								outline: none;
								height: 20px;
								line-height: 20px;
								color: #999;
								padding: 0 3px;
								margin: 0 3px;
								text-align: center;
								width: 30px;
								border-radius: 3px;
								&:focus {
									border: 1px solid #1cab7d;
									outline: none;
								}
							}
						}
						.btn {
							width: 40px;
							height: 22px;
							line-height: 22px;
							font-size: 13px;
							outline: none;
							background-color: #fff;
							border: 1px solid #e1e1e1;
							color: #333;
							cursor: pointer;
						}
						.confirm {
							background-color: #1cab7d;
							border: 1px solid #1cab7d;
							color: #fff;
							margin-left: 10px;
						}
					}
				}
			}
			.el-tree{
				padding-top: 20px;
            	padding-left: 30px;
                box-sizing: border-box;
			}
		}
		.m-right{
			height:auto;
			flex: 1;
			text-align: left;
			background-color: #E7E8EB;
			.m-top{
				// margin-bottom: 15px;
            	background:#fff;
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
						input{
							text-align: center;
						}
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
						&.add-build-input{
							input.el-input__inner{
								text-align: left;
							}
						}
					}
					
				}
			}
			.m-bottom {
				width: 100%;
				height: auto;
				background: #fff;
				.operate-box {
					height: 60px;
					line-height: 60px;
					/*background:#F6F8FA;*/
					border-bottom: 1px solid #e1e1e1;
					box-sizing: content-box;
					padding-left: 35px;
                    font-size: 18px;
                    font-weight: bold;
					dd{
						float: left;
						font-size: 16px;
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
					.button-div{
						float: right;
						margin-right: 30px;
						margin-top: 11px;
						height: 38px !important;
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
					/deep/ .el-table{
						thead {
							tr{
								th{
									height: 5vh !important;
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
			}
		}
		.member-dialog{
            /deep/ .el-dialog{
                margin-top: 8vh !important;
                .el-select__input{
                    display: inline !important;
                    border: none !important;
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
					.el-form-item{
						padding-bottom: 0!important;
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
                    .el-form-item__content{
                        .el-select{
                            margin-right: 10px;
                        }
                    }
					.el-input{
						margin-right: 10px;
						margin-bottom: 10px;
					}
					.button-div{
						margin-right: 0;
                        vertical-align: top;
                        margin-top: 1px;
					}
                }
                .button-div{
                    margin-right: 20px;
                }
            }
            
        }
    }
</style>
