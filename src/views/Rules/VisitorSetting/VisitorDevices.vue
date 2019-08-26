<template>
    <div class="visitor-devices">
        <div class="m-top">
            <div class="title">
                楼宇
                <div class="btns1" v-if="switchBtn">
                    <Button title="添加楼宇" btnClass="custom7" :data="btn1Data" btnFontSize="12px"  @click="addClick"
                            :iconLeft="true" v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@addPlace_create_own') > -1"></Button>
                    <Button title="修改" btnClass="custom7" :data="btn2Data" btnFontSize="12px"  @click="editClick"
                            :iconLeft="true" :dised1="activeInputId == ''" v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@updatePlace_update_own') > -1"></Button>
                    <Button title="删除" btnClass="custom7" :data="btn3Data" btnFontSize="12px"  @click="deleteClick"
                            :iconLeft="true" :dised1="activeInputId == ''" v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@deletePlace_delete_own') > -1"></Button>
                </div>
                <div class="btns2" v-else>
                    <Button title="保存" btnClass="custom7" btnFontSize="12px"  @click="saveClick(addBuildModel,'checkInputChars')"></Button>
                    <Button title="取消" btnClass="custom7" btnFontSize="12px"  @click="cancel"></Button>
                </div>
            </div>
            <div class="content">
                <div class="content-div"><!-- v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@getBuildList_read_own') > -1"-->
                    <div class="groupBtn" @click="clickInput({placeId: '',placeName:''}, $event, -1)">
                        <el-input class="act" placeholder="请输入内容" value="全部" size="small" readonly></el-input>
                    </div>
                    <div class="groupBtn" v-for="(build, bIdx) in buildingData" @click="clickInput(build, $event, bIdx)" :key="bIdx">
                        <el-input placeholder="请输入内容" :value="build.placeName" size="small" readonly
                                  v-model="build.placeName"></el-input><!-- @blur="checkBlur(build.placeName)"-->
                    </div>
                    <div class="groupBtn" v-if="addBuild">
                        <el-input v-model="addBuildModel" class="add-build-input" placeholder="请输入内容" size="small"
                                  ></el-input><!--@blur="checkBlur(addBuildModel)"-->
                    </div>
                    <div class="shade-div"></div>
                </div>
            </div>
        </div>
        <div class="m-cen">
            <div class="title">
                楼宇与设备
                <div class="btns1">
                    <Button title="添加设备" btnClass="custom7" :data="btn1Data" btnFontSize="12px" 
                            @click="addAisle" :iconLeft="true" v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@addVisitorDev_create_own') > -1"></Button>
                </div>
            </div>
            <div class="content">
                <el-table id="table" ref="aisleTable" height="100%" :data="aisleData" tooltip-effect="dark" border
                          style="width: 100%" v-loading="tableLoading" :span-method="objectSpanMethod"
                    ><!-- v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@selectVisitorDev_read_own') > -1"-->
                    <!-- @row-click="toggleSelection" @selection-change="handleSelectionChange"-->
                    <el-table-column prop="placeId" v-if="showIndex"></el-table-column>
                    <el-table-column fixed prop="indexID" label="序号" width="60" align="center"></el-table-column>
                    <el-table-column prop="placeName" label="楼宇" align="center"></el-table-column>
                    <el-table-column prop="deviceName" label="设备名称" align="center"></el-table-column>
                    <el-table-column prop="deviceBh" label="设备编号" align="center"></el-table-column>
                    <el-table-column prop="deviceIp" label="设备IP" align="center"></el-table-column>
                    <el-table-column prop="deviceTypeName" label="设备类型" align="center"></el-table-column>
                    <el-table-column label="操作" width="180" align="center"><!-- fixed="right"-->
                        <template slot-scope="scope">
                            <el-button class="normal" size="mini" plain @click="rowUpdate(scope.row)"
                                       v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@modifyVisitorDev_update_own') > -1">修改</el-button>
                            <el-button class="warning" size="mini" plain @click="rowDelete(scope.row)"
                                       v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@deleteVisitorDev_delete_own') > -1">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="pagination-box">
                <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
            </div>
            <el-dialog title="添加设备" :visible.sync="addDeviceDialog" width="700px" center class="sch-system-dialog">
                <div class="content">
                    <el-form ref="addDevForm" :model="addDevForm" :rules="addDevFormRules"
                             class="demo-form-inline">
                        <el-form-item label="所属楼宇：" prop="placeId">
                            <el-select v-model="addDevForm.placeId" placeholder="请选择楼宇" @change="channelSelectBuild">
                                <el-option :label="item.placeName" :value="item.placeId" :key="index"
                                           v-for="(item,index) in buildingData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关联门卫设备：" prop="doorDeviceName">
                            <div class="dev-select-info" v-if="doorDevSelect">
                                <span>设备名称</span>
                                <el-input v-model="addDevForm.doorDeviceName"  
                                          style="width: 130px;"></el-input>
										  <img src="../../../assets/images/del.png" alt="删除设备" title="删除设备" @click="delDevice('doorDevSelect','doorDeviceName')">
                            </div>
                            <Button title="选择设备" btnClass="custom8" btnFontSize="12px" btnHeight="30px"
                                    @click="addDoorDevBtn"></Button>
                        </el-form-item>
                        <el-form-item label="关联来访设备：" prop="visitorDeviceName">
                            <div class="dev-select-info" v-if="visitorDevSelect">
                                <span>设备名称</span>
                                <el-input v-model="addDevForm.visitorDeviceName"  
                                          style="width: 130px;" ></el-input>
										   <img src="../../../assets/images/del.png" alt="删除设备" title="删除设备" @click="delDevice('visitorDevSelect','visitorDeviceName')">
                            </div>
                            <Button title="选择设备" btnClass="custom8" btnFontSize="12px" btnHeight="30px"
                                    @click="addVisitorDevBtn"></Button>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="addDeviceDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveAddDevForm"></Button>
				</span>
            </el-dialog>
            <el-dialog title="选择设备" :visible.sync="doorkeeperSelectDevDialog" width="800px" center
                       class="sch-system-dialog add-dev-dialog">
                <div class="content">
                    <div class="c-top">
                        <div class="ct-title">
                            <span>选择设备：</span>
                            <el-input v-model="searchDev" style="width: 230px;float: right" size="small"
                                      placeholder="请输入设备名称或设备IP查询" @change="search(1)">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="search(1)"></i>
                            </el-input>
                        </div>
                        <div class="ct-table">
                            <el-table id="table" ref="addDoorDevTable" height="100%" :data="doorDevData"
                                      tooltip-effect="dark" border highlight-current-row style="width: 100%" @row-click="clickDoorDevRow"
                                      @selection-change="handleSelectionChange">
                                <el-table-column prop="deviceId" v-if="showIndex"></el-table-column>
                                <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column>
                                <el-table-column prop="deviceName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceBh" label="设备编号" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceId" label="设备ID" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceIp" label="设备IP" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceTypeName" label="设备类型" align="center" show-overflow-tooltip></el-table-column>
                                <!--<el-table-column prop="isUsed" label="分配状态" align="center" show-overflow-tooltip></el-table-column>--><!--以后会添加-->
                            </el-table>
                        </div>
                        <!-- <div class="pagination-box">
                             <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
                         </div>-->
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="doorkeeperSelectDevDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveSelectDoorDev"></Button>
				</span>
            </el-dialog>
            <el-dialog title="选择设备" :visible.sync="visitorSelectDevDialog" width="800px" center
                       class="sch-system-dialog add-dev-dialog">
                <div class="content">
                    <div class="c-top">
                        <div class="ct-title">
                            <span>选择设备：</span>
                            <el-input v-model="searchDev2" style="width: 230px;float: right" size="small"
                                      placeholder="请输入设备名称或设备IP查询" @change="search(2)">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="search(2)"></i>
                            </el-input>
                        </div>
                        <div class="ct-table">
                            <el-table id="table" ref="addVisitorDevTable" height="100%" :data="visitorDevData"
                                      tooltip-effect="dark" border
                                      highlight-current-row style="width: 100%" @row-click="clickVisitorDevRow"
                                      @selection-change="handleSelectionChange" >
                                <el-table-column prop="deviceId" v-if="showIndex"></el-table-column>
                                <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column>
                                <el-table-column prop="deviceName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceBh" label="设备编号" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceId" label="设备ID" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceIp" label="设备IP" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceTypeName" label="设备类型" align="center" show-overflow-tooltip></el-table-column>
                                <!--<el-table-column prop="isUsed" label="分配状态" align="center" show-overflow-tooltip></el-table-column>--><!--以后会添加-->
                            </el-table>
                        </div>
                        <!-- <div class="pagination-box">
                             <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
                        </div>-->
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="visitorSelectDevDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveSelectVisitorDev"></Button>
				</span>
            </el-dialog>
            <el-dialog title="修改设备" :visible.sync="updateDeviceDialog" width="700px" center class="sch-system-dialog">
                <div class="content">
                    <el-form :inline="true" ref="updateDevForm" :model="updateDevForm" :rules="updateDevFormRules"
                             class="demo-form-inline">
                        <el-form-item label="所属楼宇：" prop="placeId">
                            <el-select v-model="updateDevForm.placeId" placeholder="请选择楼宇" :disabled="true">
                                <el-option :label="item.placeName" :value="item.placeId" :key="index"
                                           v-for="(item,index) in buildingData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关联门卫设备：" prop="doorDeviceName">
                            <div class="dev-select-info">
                                <span>设备名称</span>
                                <el-input v-model="updateDevForm.doorDeviceName" placeholder="请选择设备"
                                          style="width: 130px;"></el-input>
                            </div>
                            <Button title="选择设备" btnClass="custom8" btnFontSize="12px" btnHeight="30px"
                                    @click="updateDoorDevBtn"></Button>
                        </el-form-item>
                        <el-form-item label="关联来访设备：" prop="visitorDeviceName">
                            <div class="dev-select-info">
                                <span>设备名称</span>
                                <el-input v-model="updateDevForm.visitorDeviceName" placeholder="请选择设备"
                                          style="width: 130px;"></el-input>
                            </div>
                            <Button title="选择设备" btnClass="custom8" btnFontSize="12px" btnHeight="30px"
                                    @click="updateVisitorDevBtn"></Button>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="updateDeviceDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveUpdateDevForm"></Button>
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
			Button, Toast
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
			return {
				btn1Data: {
					iconL: require('../../../assets/images/add.png'),
					iconLAct: require('../../../assets/images/add.png')
				},
				btn2Data: {
					iconL: require('../../../assets/images/edit.png'),
					iconLAct: require('../../../assets/images/edit.png')
				},
				btn3Data: {
					iconL: require('../../../assets/images/del.png'),
					iconLAct: require('../../../assets/images/del.png')
				},
				btn4Data: {
					iconL: require('../../../assets/images/roll.png'),
					iconLAct: require('../../../assets/images/roll.png')
				},
				buildingData: [
					{
						buildName: '全部',
						buildingId: '0'
					},
					{
						buildName: '实验楼',
						buildingId: '1'
					},
					{
						buildName: '体育楼',
						buildingId: '2'
					},
					{
						buildName: '教学楼',
						buildingId: '3'
					},
					{
						buildName: '逸夫楼',
						buildingId: '4'
					},
				],
				buildingData: [],
				switchBtn: true,//楼宇切换新增/保存按钮
				addBuild: false,//添加文本框是否显示
				addBuildModel: '',//添加文本model
				activeInputId: '',//选中input的id 存一下
				choosePlaceName: '',//选中input的id 存一下
				normalVal: '',// 楼宇修改之前的名称
				bIdx:'',//点击修改的当前index
				buildBtnTag: '',//楼宇按钮tag标示(新增修改删除分别为123)
				aisleData: [
					{
						buildingId: '1',
						aisle: '校大门',
						buildingName: '21#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '1',
						aisle: '校大门',
						buildingName: '21#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '1',
						aisle: '校大门',
						buildingName: '21#',
						deviceName: '摄像头1',
						deviceID: '200818',
						deviceIP: '192.168.1.2',
						settings: '门卫使用'
					},
					{
						buildingId: '1',
						aisle: '校大门',
						buildingName: '21#',
						deviceName: '摄像头1',
						deviceID: '200818',
						deviceIP: '192.168.1.2',
						settings: '门卫使用'
					},
					{
						buildingId: '2',
						aisle: '校大门',
						buildingName: '22#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '2',
						aisle: '校大门',
						buildingName: '22#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '2',
						aisle: '校大门',
						buildingName: '22#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '3',
						aisle: '校大门',
						buildingName: '23#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '3',
						aisle: '校大门',
						buildingName: '23#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '3',
						aisle: '校大门',
						buildingName: '23#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '4',
						aisle: '校大门',
						buildingName: '24#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						buildingId: '4',
						aisle: '校大门',
						buildingName: '24#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
				],            //通道数据
				aisleData: [],
				aisleSelection: '',         //选中通道行的数据
				addDeviceDialog: false,     //添加设备弹窗
				updateDeviceDialog: false,     //修改设备弹窗
				doorkeeperSelectDevDialog: false, //添加通道--门卫选择设备弹窗
				visitorSelectDevDialog: false, //添加通道--访客选择设备弹窗
				searchDev: '',              //添加通道-选择设备弹窗-搜索设备搜索框model(门卫)
				searchDev2: '',              //添加通道-选择设备弹窗-搜索设备搜索框model(访客)
				lsData1: {},                // 新增修改传的参数-设备列表（门卫）
				lsData2: {},                // 新增修改传的参数-设备列表（访客）
				addDevForm: {   //添加通道form
					placeId: '',
					doorDeviceName: '',
					visitorDeviceName: '',
                    ls: []
				},
				addDevFormRules: {            // 通道设备规则
					placeId: [{required: true, message: '请选择楼宇',trigger: 'change'}],
					doorDeviceName: [{required: true, validator: validateInputChars,trigger: 'blur'}],
					visitorDeviceName: [{required: true, validator: validateInputChars,trigger: 'blur'}],
				},
				updateDevForm: {   //添加通道form
					placeId: '',
					doorDeviceName: '',
					visitorDeviceName: '',
					ls: []
				},
				updateDevFormRules: {            // 通道设备规则
					placeId: [{required: true, message: '请选择楼宇',trigger: 'change'}],
					doorDeviceName: [{required: true, validator: validateInputChars,trigger: 'blur'}],
					visitorDeviceName: [{required: true, validator: validateInputChars,trigger: 'blur'}],
				},
                fromType:0,     //默认为添加设备点击，0：添加设备；1：修改设备；
				doorDevSelect: false,           // 门卫选择的设备信息，默认不展示
				visitorDevSelect: false,        // 访客选择的设备信息，默认不展示
				doorRowData: {},                 //门卫选择的设备信息
				visitorRowData: {},             //访客选择的设备信息
				doorDevData: [
					{
						id: '1',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '1',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头1',
						deviceID: '200818',
						deviceIP: '192.168.1.2',
						settings: '门卫使用'
					},
					{
						id: '2',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头2',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '3',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头3',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '4',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头4',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '5',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头5',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '6',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头6',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '7',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头7',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '8',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头8',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '9',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头9',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '10',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头10',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '11',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头11',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
				],              // （门卫选择设备弹窗）表格数据
				doorDevData: [],
				visitorDevData: [
					{
						id: '1',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '1',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头1',
						deviceID: '200818',
						deviceIP: '192.168.1.2',
						settings: '门卫使用'
					},
					{
						id: '2',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头2',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '3',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头3',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '4',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头4',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '5',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头5',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '6',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头6',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '7',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头7',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
					{
						id: '8',
						aisle: '校大门',
						building: '22#',
						deviceName: '摄像头8',
						deviceID: '200818',
						deviceIP: '192.168.1.1',
						settings: '门卫使用'
					},
				],              // （访客选择设备弹窗）表格数据
				visitorDevData: [],
				spanArr: [],                //跨行数据
				showIndex: false,
				tableLoading: false,        //表格加载动画
				allNum: 0,                  //分页总条数
				currentPage: 1,               //当前页（默认设为第一页）
				pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				isToast: false,
				toast: '',
			}
		},
		methods: {
			/**
			 *  @function: 楼宇添加或修改的失焦方法
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			checkBlur(value){
				if(value){
					this.formOutTest(value, 'checkInputChars');
                }else{
					this.$message({
						showClose: true,
						message: "输入内容不能为空",
						type: "error",
						duration: 1000
					});
                }
            },
			/**
			 *  @function: 楼宇添加按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			clickMenu(index, item) {
				// console.log('clickMenu', index, item)
				if (item.value == 1) {//
					this.$router.push('/StudentsTurnover')      //学生进出
				} else if (item.value == 2) {
					this.$router.push('/agentManagement')       //代理商管理
				} else {
					this.$router.push('/peopleManagement')      //人员管理
				}
				sessionStorage.setItem('pageMenuIndex', index);
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
				//获取当前选中的楼宇
				let actInput = $('.visitor-devices .m-top .el-input.act');
				let actInputSibling = $('.visitor-devices .m-top .el-input.act').parent().siblings();
				if(actInput.length != 0){//必须选中一个楼宇才能进行修改
					// this.activeInputId       //当前编辑项的id值
					// console.log('this.activeInputId',this.activeInputId)
					/* if(this.activeInputId == ''){//全部选项，不能修改
						this.$message({message: '不能修改默认楼宇', type: 'warning',duration: this.msgDuration});
						return;
					} */
					$(actInput).find('input').removeAttr('readonly');
					actInput.addClass('edit');
					$(actInput).find('input').focus();
					this.normalVal = $(actInput).find('input').val();// 存上修改之前的值用来取消时使用
					setTimeout(()=>{
						$(actInput).find('input').val(this.normalVal)
					})
					this.switchBtn = false;//切换保存、取消按钮
					//将遮罩层层级换成2，当前编辑input层级换成3
					let shade = $('.visitor-devices .m-top .content .shade-div');
					let groupBtn = $('.visitor-devices .m-top .el-input.act').parent();
					shade.css('z-index',2);
					groupBtn.css('z-index',3);
					//设置光标位置始终在文本框最后
					let tObj = $(actInput).find('input')[0];
					let sPos = $(actInput).find('input').val().length;
					this.setCaretPosition(tObj, sPos);
				}else{
					this.$message({message: '请选择要修改的楼宇', type: 'warning',duration: this.msgDuration});
				}
				this.resizeInputWidth();//重定义input的宽度
			},
			/**
			 *  @function: 楼宇删除按钮
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			deleteClick(){
				let vThis = this;
				this.buildBtnTag = 3;//点击了删除按钮
				let actInput = $('.visitor-devices .m-top .el-input.act');
				if(actInput.length != 0) {//必须选中一个楼宇才能进行删除
					/* if(this.activeInputId == ''){//全部选项，不能修改
						this.$message({message: '不能删除默认楼宇', type: 'warning',duration: this.msgDuration});
						return;
					} */
					// 获取该楼宇下是否有设备
					let params = {
						placeId: this.activeInputId,
					}
                	this.$api.Rules.beforeDeletePlace(params).then(res => {
						// console.log('当前楼宇-是否有设备', res)
						if (res.data.code == 600 ||　res.data.code == 0) {
                            //该楼宇下关联通道、进出设备、访客设备，删除楼宇将一并删除，请谨慎操作。是否继续？
                            //此操作将永久删除
							this.$confirm(
								`${res.data.data.msg ? '该楼宇下关联'+res.data.data.msg + '，删除楼宇将一并删除': '此操作将永久删除'}， 请谨慎操作。是否继续?`, '提示', {
								confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
							}).then(() => {//点击确定按钮进行的操作
								Loading.service();
								let params = {
									placeId: this.activeInputId,
								}
                				this.$api.Rules.deletePlace(params).then(res => {
									// console.log('删除楼宇-是否成功', res)
									Loading.service().close();
									this.isToast = true;
									this.toast = res.data.msg;
									if (res.data.code == 600 ||　res.data.code == 0) {
										this.$message({type: 'success', message: '删除成功!',duration: this.msgDuration});//请求删除成功之后提示
										$('.visitor-devices .m-top').find('.el-input').removeClass('act');//删除act input样式
										$('.visitor-devices .m-top .groupBtn:first-child').find('.el-input').addClass('act');// 默认选择全部
										this.activeInputId = '';// 清空当前选择
										this.loadBuildData();// 获取楼宇数据-刷新
										this.loadChannelData();// 获取通道设备数据-刷新
										/*let buildIdArr = [];//取出数组中的id，用来查找下标进行删除操作
                                        $.each(this.buildingData, function (i, buildId) {
                                            buildIdArr.push(buildId.id);
                                        })
                                        let index = buildIdArr.indexOf(this.activeInputId);
                                        if (index > -1) {//找到当前选中的下标并删除
                                            this.buildingData.splice(index, 1);
                                            this.$message({type: 'success', message: '删除成功!',duration: this.msgDuration});//请求删除成功之后提示
                                        }*/
									}
								}).catch(err =>{
									Loading.service().close();
								})
							}).catch(() => {//点击取消按钮
								this.$message({type: 'info', message: '已取消删除',duration: this.msgDuration});
							});
						}
					})
				}else{
					this.$message({message: '请选择要删除的楼宇', type: 'warning',duration: this.msgDuration});
				}
			},
			/**
			 *  @function: 楼宇点击保存按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			saveClick( value, funcName ){
				if(this.buildBtnTag == 1){//点击了新增按钮
					if(this.addBuildModel != ''){//添加楼宇的model，若不添加无法保存
						let state = this.formOutTest(value,funcName);
						// console.log(11,state)
						if(state){
							// console.log(1)
						}else{
							// console.log(2,'验证不通过')
							setTimeout(()=>{
								$('.add-build-input input').focus();//设置光标便于输入
							})
							return
						}
						Loading.service();
						let params = {
							schoolId: localStorage.getItem('schoolId'),
							placeParentId: localStorage.getItem('placeTopId'), // 上级楼宇id-登录时获取
							placeName: this.addBuildModel
						}
                		this.$api.Rules.addPlace(params).then(res => {
							// console.log('新增楼宇-是否成功', res)
							this.isToast = true;
							this.toast = res.data.msg;
							Loading.service().close();
							if (res.data.code == 600 ||　res.data.code == 0) {
								this.loadBuildData();//获取楼宇数据-刷新
								/*	let addC = { placeName: this.addBuildModel };
                                    this.buildingData.push(addC);           //前台操作(省去刷新一步)不能省去刷新，因为无id的话无法进行编辑删除操作*/
								this.addBuild = false;//取消新增楼宇
								this.switchBtn = true;//切换新增、修改按钮
							}
						}).catch(err =>{
							Loading.service().close();
						})
					}else{
						this.$message({
							message: '请输入楼宇名称',
							type: 'warning',duration: this.msgDuration, onClose:()=>{
								setTimeout(()=>{
									$('.add-build-input input').focus();//设置光标便于输入
								})
							}
						});
					}
				}else if(this.buildBtnTag == 2){//点击了修改按钮
					let actInput = $('.visitor-devices .m-top .el-input.act');//获取当前选中的楼宇
					let actInputVal = $(actInput).find('input').val();//当前修改input的值
					let state = this.formOutTest(actInputVal,funcName);
					if(state){
						// console.log(1)
					}else{
						// console.log(2,'验证不通过')
						if(actInputVal){
							setTimeout(()=>{
								$(actInput).find('input').focus();//设置光标便于输入
							})
						}else{
							this.$message({
								message: '请输入楼宇名称',
								type: 'warning',duration: this.msgDuration, onClose:()=>{
									setTimeout(()=>{
										$(actInput).find('input').focus();//设置光标便于输入
									})
								}
							});
						}
						return
					}
					Loading.service();
					let params = {
						placeId: this.activeInputId,
						placeName: actInputVal
					}
                	this.$api.Rules.updatePlace(params).then(res => {
						// console.log('修改楼宇-是否成功', res)
						this.isToast = true;
						this.toast = res.data.msg;
						Loading.service().close();
						if (res.data.code == 600 ||　res.data.code == 0) {
							// this.loadBuildData();//获取楼宇数据-刷新    0920修改-不刷新，避免选中当前值变化
							//将遮罩层层级换成0，当前编辑input层级换成1（请求成功之后）
							let shade = $('.visitor-devices .m-top .content .shade-div');
							let groupBtn = $('.visitor-devices .m-top .el-input.act').parent();
							shade.css('z-index',0);
							groupBtn.css('z-index',1);
							//获取当前选中的楼宇
							$(actInput).find('input').attr('readOnly','true')
							actInput.removeClass('edit');
							this.switchBtn = true;//切换新增、修改按钮
							this.loadChannelData();// 获取通道设备数据-刷新
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}
				this.resizeLayout();//重新获取宽高
				this.resizeInputWidth();//重定义input宽
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
				let actInput = $('.visitor-devices .m-top .el-input.act');
				$(actInput).find('input').attr('readOnly','true')
				actInput.removeClass('edit');
				if(this.buildBtnTag == 2) {//点击了编辑按钮
					//将遮罩层层级换成0，当前编辑input层级换成1
					let shade = $('.visitor-devices .m-top .content .shade-div');
					let groupBtn = $('.visitor-devices .m-top .el-input.act').parent();
					shade.css('z-index',0);
					groupBtn.css('z-index',1);
					$(actInput).find('input').val(this.normalVal)
					this.buildingData[this.bIdx].placeName = this.normalVal;
				}
				this.resizeLayout();//重新获取宽高
				this.resizeInputWidth();//重定义input的宽度
			},
			/**
			 *  @function: 点击楼宇按钮，切换数据
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			clickInput(item, even, bIdx){
				// console.log("item, even, bIdx:",item, even, bIdx)
				$(even.target).parent().addClass('act').parent().siblings().find('.el-input').removeClass('act');//添加act input样式
				this.activeInputId = item.placeId;//存选中楼宇的id，用来做修改删除
				this.choosePlaceName = item.placeName;//存选中楼宇名词，用来做默认选中楼宇
				this.bIdx = bIdx;             // 存选中楼宇的index，用来做取消修改
				//加载通道与摄像头数据
				this.loadChannelData();//获取通道数据
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
			 *  @function置空弹窗中表单的数据
			 *  @author: wzx
			 *  @date 2018-9-3
			 **/
			resetForm(formName)
			{
				if (this.$refs[formName]!==undefined) {     //防止form未加载完毕时报错
					this.$refs[formName].resetFields();
				}
			},
			/**
			 *  @function添加通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			addAisle() {
				this.addDeviceDialog = true;
				this.doorDevSelect = false;
				this.visitorDevSelect = false;
				this.fromType = 0; // 点击了新增按钮
				// console.log(666,this.addDevForm)
				this.resetForm('addDevForm');
				this.doorRowData = {}; // 清空行内选中
				this.visitorRowData = {}; // 清空行内选中
				this.addDevForm.placeId = this.activeInputId;//添加通道设备时，所属楼宇默认已选楼宇
				this.addDevForm.placeName = this.choosePlaceName;//添加通道设备时，所属楼宇默认已选楼宇
				
			},
			/**
			 *  @function: 通道添加-选择楼宇
			 *  @author: lxr
			 *  @date 2018-9-13
			 **/
			channelSelectBuild( buildId ){
				// console.log('通道添加-选择楼宇',buildId)
				let obj = {};
				obj = this.buildingData.find((item) => {//这里的deviceSeries就是上面遍历的数据源
					return item.placeId === buildId;//筛选出匹配数据
				});
				this.addDevForm.placeName = obj.placeName;
			},
			/**
			 *  @function: 设备添加-删除设备
			 *  @author: cs
			 *  @date 2018-10-16
			 **/
			delDevice( status , clearName){
				this[status] = false;
				this.addDevForm[clearName] = '';
				/* setTimeout(()=>{
					this.$refs.addDevForm.clearValidate([clearName])
				}) */
			},
			/**
			 *  @function: 添加通道-选择设备-搜索按钮
			 *  @author: lxr
			 *  @date 2018-9-13
			 **/
			search( searchTag ){
				if(searchTag == 1) {// 添加门卫设备搜索
					this.getDoorData(22, 'doorDevData', this.searchDev);// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
				}else if(searchTag == 2){// 点击访客设备搜索
					this.getDoorData(21, 'visitorDevData', this.searchDev2);// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
				}
			},
			/**
			 *  @function: 添加设备-选择设备按钮-门卫
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			addDoorDevBtn() {
				this.doorkeeperSelectDevDialog = true;//选择设备弹窗展示
				this.searchDev = '';   // 清空搜索内容
				this.getDoorData(22, 'doorDevData', this.searchDev);// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
			},
			/**
			 *  @function: 添加设备-选择设备按钮-来访
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			addVisitorDevBtn() {
				this.visitorSelectDevDialog = true;//选择设备弹窗展示
                this.searchDev2 = '';   // 清空搜索内容
				this.getDoorData(21, 'visitorDevData', this.searchDev2);// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
			},
			/**
			 *  @function: 修改设备-选择门卫设备按钮
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			updateDoorDevBtn() {
				this.doorkeeperSelectDevDialog = true;//选择设备弹窗展示
				this.searchDev = '';   // 清空搜索内容
				this.getDoorData(22, 'doorDevData', this.searchDev);// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
                // console.log('aa2222',JSON.stringify(this.doorRowData))
                this.doorRowData = {"deviceBh":"1001","deviceId":402888049,"deviceIp":"10.9.7.60",
                "deviceName":"门卫机","deviceType":22,"deviceTypeName":"门卫机"}
				// 选中设备表格第一条
				setTimeout(()=>{
					// console.log('a666',this.$refs['addDoorDevTable'].setCurrentRow())
					// console.log('aa77',JSON.stringify(this.doorRowData))
					this.$refs['addDoorDevTable'].setCurrentRow(this.doorRowData);// 设置选择表格行
				},100)
			},
			/**
			 *  @function: 添加通道-选择访客设备按钮
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			updateVisitorDevBtn() {
				this.visitorSelectDevDialog = true;//选择设备弹窗展示
				this.searchDev2 = '';   // 清空搜索内容
				this.getDoorData(21, 'visitorDevData', this.searchDev2);// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
				// 选中设备表格第一条
				setTimeout(()=>{
					this.$refs['addVisitorDevTable'].setCurrentRow(this.visitorRowData);// 设置选择表格行
				})
			},
			/**
			 *  @function添加设备功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			saveAddDevForm() {
				this.addDevForm.ls = [];
				this.$refs['addDevForm'].validate((valid) => {
					if (valid) {
						Loading.service();
						// 新增保存
						this.lsData1.deviceName = this.addDevForm.doorDeviceName;    // 为了修改设备名称
						this.lsData2.deviceName = this.addDevForm.visitorDeviceName; // 为了修改设备名称
						this.addDevForm.ls.push(this.lsData1,this.lsData2)
						let params = {
							placeId: this.addDevForm.placeId,
							placeName: this.addDevForm.placeName,
							ls: this.addDevForm.ls
						}
                		this.$api.Rules.addVisitorDev(params).then(res => {
							// console.log('新增通道设备是否成功', res)
							Loading.service().close();
							if (res.data.code == 600 ||　res.data.code == 0) {
								this.addDeviceDialog = false;// 关闭添加通道设备弹窗
								this.loadChannelData();//获取通道设备数据
							} else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						}).catch(err =>{
							Loading.service().close();
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
			 *  @function修改设备功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-9-3
			 **/
			saveUpdateDevForm() {
				this.updateDevForm.ls = [];
				this.$refs['updateDevForm'].validate((valid) => {
					if (valid) {
						Loading.service();
						this.lsData1.deviceName = this.updateDevForm.doorDeviceName;    // 为了修改设备名称
						this.lsData2.deviceName = this.updateDevForm.visitorDeviceName; // 为了修改设备名称
						this.updateDevForm.ls.push(this.lsData1,this.lsData2);          // 合并设备组合，用来传参
						let params = {
							placeId: this.updateDevForm.placeId,
							placeName: this.updateDevForm.placeName,
							ls: this.updateDevForm.ls
						}
                		this.$api.Rules.modifyVisitorDev(params).then(res => {
							// console.log('修改通道设备是否成功', res)
							Loading.service().close();
							if (res.data.code == 600 ||　res.data.code == 0) {
								this.updateDeviceDialog = false;// 关闭修改通道设备弹窗
								this.loadChannelData();//获取通道设备数据
							} else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						}).catch(err =>{
							Loading.service().close();
						})
					} else {
						// console.log('error submit!!');
						return false;
					}
				});
			},
			/**
			 *  @function: 添加通道-选择设备-点击设备表格列表
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			clickDoorDevRow(row) {
				this.doorRowData = row;
			},
			/**
			 *  @function: 添加通道-选择设备-点击设备表格列表
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			clickVisitorDevRow(row) {
				this.visitorRowData = row;
			},
			/**
			 *  @function: 添加通道-门卫选择设备-点击保存按钮保存设备
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			saveSelectDoorDev() {
				// console.log('选择门卫保存按钮',this.fromType)
				if(JSON.stringify(this.doorRowData) == '{}'){// 选择设备不能为空
					this.$message({
						message: '请选择设备！',
						type: 'warning',
						duration: this.msgDuration
					})
					return;
				}
				this.doorDevSelect = true;                // 展示选择设备信息
				this.doorkeeperSelectDevDialog = false;  // 关闭选择设备窗口并赋值
                // 组合门卫设备
				this.lsData1 = {
					deviceName: this.doorRowData.deviceName,
					deviceBh: this.doorRowData.deviceBh,
					deviceId: this.doorRowData.deviceId,
					deviceIp: this.doorRowData.deviceIp,
					deviceType: this.doorRowData.deviceType,
					deviceTypeName: this.doorRowData.deviceTypeName,
					schoolId: localStorage.getItem('schoolId'),
				}
                if(this.fromType === 0){        //添加设备--门卫设备选择
	                setTimeout(() => {              //清除错误信息提示
		                this.$refs["addDevForm"].clearValidate(['doorDeviceName']);
	                })
	                this.addDevForm.doorDeviceName = this.doorRowData.deviceName; // 设置设备名称
                }else if(this.fromType === 1){     //修改设备--门卫设备选择
	                setTimeout(() => {             //清除错误信息提示
		                this.$refs["updateDevForm"].clearValidate(['doorDeviceName']);
	                })
	                this.updateDevForm.doorDeviceName = this.doorRowData.deviceName; // 设置设备名称
                }
			},
			/**
			 *  @function: 添加通道-访客选择设备-点击保存按钮保存设备
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			saveSelectVisitorDev() {
				if(JSON.stringify(this.visitorRowData) == '{}'){// 选择设备不能为空
					this.$message({
						message: '请选择设备！',
						type: 'warning',
						duration: this.msgDuration
					})
					return;
				}
				this.visitorDevSelect = true;                // 展示选择设备信息
				this.visitorSelectDevDialog = false;  // 关闭选择设备窗口并赋值
				// 组合访客设备
				this.lsData2 = {
					deviceName: this.visitorRowData.deviceName,
					deviceBh: this.visitorRowData.deviceBh,
					deviceId: this.visitorRowData.deviceId,
					deviceIp: this.visitorRowData.deviceIp,
					deviceType: this.visitorRowData.deviceType,
					deviceTypeName: this.visitorRowData.deviceTypeName,
					schoolId: localStorage.getItem('schoolId'),
				}
				if(this.fromType === 0){        //添加设备--访客设备选择
					// console.log('this.visitorRowData',this.visitorRowData)
					setTimeout(() => {             //清除错误信息提示
						this.$refs["addDevForm"].clearValidate(['visitorDeviceName']);
					})
					this.addDevForm.visitorDeviceName = this.visitorRowData.deviceName; // 设置设备名称
				}else if(this.fromType === 1){     //修改设备--访客设备选择
					setTimeout(() => {             //清除错误信息提示
						this.$refs["updateDevForm"].clearValidate(['visitorDeviceName']);
					})
					this.updateDevForm.visitorDeviceName = this.visitorRowData.deviceName; // 设置设备名称
				}
			},
			/**
			 *  @function修改通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			rowUpdate(row) {
				// console.log('修改通道', row)
                this.updateDeviceDialog = true;
				this.fromType = 1; // 点击了修改按钮
//				this.updateDevForm = row;       向后台传参：楼宇的ID，调用接口来获取修改弹窗中的设备
                setTimeout(()=>{
                })
				this.channelDetail(row.placeId);    // 获取设备通道详情
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
					let params = {
						placeId: row.placeId
                    }
                	this.$api.Rules.deleteVisitorDev(params).then(res => {
						// console.log('删除访客进出是否成功', res)
						Loading.service().close();
						if (res.data.code == 600 ||　res.data.code == 0) {
							this.$message({type: 'success', message: '删除成功!'});//请求删除成功之后提示
							this.loadChannelData();//获取通道设备数据
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
			 *  @function: 表格单元格点击事件
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			cellClick(row, column, cell, event) {
				if (column.property == 'stuRoll') {//点击学生名单列
					// console.log('点击学生名单列')

				}
			},

			/**
			 *  @function: 表格跨行方法
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
				// console.log(1234,row, column, rowIndex, columnIndex)
				if ( columnIndex == 0 || columnIndex == 1 || columnIndex == 6) {
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
				this.spanArr = [];// 必清空-不然会影响表格换行
				for (let i = 0; i < data.length; i++) {
					if (i === 0) {
						this.spanArr.push(1);
						this.pos = 0
					} else {
						// 判断当前元素与上一个元素是否相同--->找数组中相同的字段进行分组
						if (data[i].placeId == data[i - 1].placeId) {
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
			 *  @function选中的表格中的哪些行
			 *  @author: wzx
			 *  @date 2018-4-27
			 **/
			handleSelectionChange(val) {
				this.aisleSelection = val;
				// console.log(6868, this.aisleSelection)
//				this.tableData.forEach(item => {
//					this.$refs.multipleTable.toggleRowSelection(item,true);
//                })
			},
			/**
			 *  @function点击列表中某行的选中事件
			 *  @author: wzx
			 *  @date 2018-4-14
			 **/
			toggleSelection(row) {
				// console.log(666, row.deviceinfo_id, selected)
				this.$refs.aisleTable.toggleRowSelection(row);
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
			 *  @function: 获取楼宇数据
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			loadBuildData(){
				let params = {
					placeId: 0,// 场所id--传顶级场所 0
				}
                this.$api.Rules.getBuildList(params).then(res => {
					// console.log('楼宇数据', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.buildingData = res.data.data;
						this.resizeInputWidth();//重定义input宽
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 获取通道设备
			 *  @author: lxr
			 *  @date 2018-9-14
			 **/
			loadChannelData(){
				this.tableLoading = true;
				let params = {
					page_index: this.currentPage,
					page_size: this.pageItem,
					placeId: this.activeInputId,
					schoolId: localStorage.getItem('schoolId'),
				}
                this.$api.Rules.selectVisitorDev(params).then(res => {
					// console.log('通道设备数据', res)
					this.tableLoading = false;
					if(res.data.data != null){
						this.allNum = res.data.data.total_record;   // 总条数
						this.aisleData = res.data.data.records;
						this.getSpanArr(this.aisleData);
					}else{
						this.allNum = 0;   // 总条数
					}
					if (res.data.code == 600 ||　res.data.code == 0) {
						let num = 0;        // 以下为 前端写的序号
						for(let i = 0;i < this.aisleData.length;i++){
							if (i === 0) {
								num = 1
							} else {
								// 判断当前元素与上一个元素是否相同
								if ( this.aisleData[i].placeId != this.aisleData[i - 1].placeId ) {
									num += 1;
								}
							}
							this.$set(this.aisleData[i],'indexID',(this.currentPage - 1) * this.pageItem + num*1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						}
						this.resizeLayout();//重新获取宽高
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                   this.tableLoading = false;
                })
			},
			/**
			 *  @function: 获取通道设备
			 *  @author: lxr
			 *  @date 2018-9-14
			 **/
			channelDetail( placeId ){
				let params = {
					// page_index: this.currentPage,
					// page_size: this.pageItem,
					placeId: placeId,
					schoolId: parseInt(localStorage.getItem('schoolId')),
				}
                this.$api.Rules.selectVisitorDev(params).then(res => {
					// console.log('获取行通道设备数据', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
                        $.each(res.data.data.records, (i, data)=>{
                        	// console.log('data',data)
                            this.updateDevForm.placeId = data.placeId;  // 楼宇id赋值
                            this.updateDevForm.placeName = data.placeName;  // 楼宇名称赋值
                            if(data.deviceType == 22){// 门卫
	                            this.doorRowData = data; // 行赋值
	                            this.updateDevForm.doorDeviceName = data.deviceName;    // 门卫名赋值
	                            this.lsData1 = {
		                            deviceName: data.deviceName,
		                            deviceBh: data.deviceBh,
		                            deviceId: data.deviceId,
		                            deviceIp: data.deviceIp,
		                            deviceType: data.deviceType,
		                            deviceTypeName: data.deviceTypeName,
		                            schoolId: localStorage.getItem('schoolId'),
	                            }
                            }else if(data.deviceType == 21){// 访客
	                            this.visitorRowData = data; // 行赋值
	                            this.updateDevForm.visitorDeviceName = data.deviceName;  // 访客名赋值
	                            this.lsData2 = {
		                            deviceName: data.deviceName,
		                            deviceBh: data.deviceBh,
		                            deviceId: data.deviceId,
		                            deviceIp: data.deviceIp,
		                            deviceType: data.deviceType,
		                            deviceTypeName: data.deviceTypeName,
		                            schoolId: localStorage.getItem('schoolId'),
	                            }
                            }
                            // console.log('gg555',this.lsData1,this.lsData2)
	                        this.updateDevForm.ls.push(this.lsData1,this.lsData2)
                        })
                        // console.log('111aaa',this.updateDevForm.placeId)
					}
				})
			},
			/**
			 *  @function: 获取门卫/来访数据
			 *  @author: lxr
			 *  @date 2018-9-13
			 *  @param: deviceType(设备类型，接口参数), doorData(列表赋值data)
			 **/
			getDoorData(deviceType, doorData, searchValue){
				let params = {
					schoolId: localStorage.getItem('schoolId'),
					pageNum: 1,
					page_size: 10000,
					deviceType: deviceType,// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
					devNameLike: searchValue,// 模糊条件（设备名称）
				}
                this.$api.Rules.selectDevList(params).then(res => {
					// console.log('设备数据-设备类型：'+deviceType+'---->',res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this[doorData] = res.data.data.records;
						$.each(this[doorData], (a,b)=> {      //添加序号，切换页面序号连增
							this.$set(this[doorData][a],'indexID',(this.currentPage - 1) * this[doorData].length + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
						})
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
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
					let ttH = $('.visitor-devices > .m-top').height();
					let obH = $('.visitor-devices .m-cen .title').height();
					let pbH = $('.pagination-box').height();
					let tblH = icH - stH - ttH - obH - pbH - 25;
					// console.log(66, icH, stH, ttH, obH, pbH)
					$('.visitor-devices .m-cen .content').height(tblH)
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
					let actInput = $('.visitor-devices .m-top .el-input input');
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
			this.loadBuildData();//获取楼宇数据
			this.loadChannelData();//获取通道设备数据
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .visitor-devices {
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
        .m-top {
            width: 100%;
            height: auto;
            background: #fff;
            margin-bottom: 15px;
            .title {
            }
            .content {
                max-height: 100px;
                min-height: 50px;
                /*max-height: 11.5vh;*/
                padding: 15px 2% 0;
                position: relative;
                overflow: auto;
                .groupBtn {
                    position: relative;
                    float: left;
                    display: inline-block;
                    margin-right: 10px;
                    margin-bottom: 15px;
                    z-index: 1;
                    .el-button {
                        &:hover {
                            color: #1b9a71;
                            border: 1px solid #1b9a71;
                        }
                        &:active {
                            color: #1b9a71;
                            border: 1px solid #1b9a71;
                        }
                    }
                    img {
                        width: 15px;
                        height: 15px;
                        position: absolute;
                        right: -7px;
                        top: -7px;
                    }
                }
                .shade-div {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    right: 0;
                    top: 0;
                }
                /deep/ .el-input {
                    &.act {
                        input {
                            background: #1cab7d;
                            color: #fff;
                        }
                    }
                    &.edit {
                        input {
                            background: transparent;
                            color: #333;
                        }
                    }
                }
            }
        }
        .m-cen {
            width: 100%;
            height: auto;
            background: #fff;
            .title {
                border: 0;
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
                        height:360px;
                        overflow: hidden;
                    }
                    .pagination-box {
                        border: 1px solid #EBEEF5;
                        border-top: 0;
                        height: 50px;
                        > div {
                            padding-top: 10px;
                        }
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
                    .cb-radio {
                        .el-radio + .el-radio {
                            margin-left: 0;
                        }
                        /deep/ .el-radio {
                            margin-right: 15px;
                            line-height: 30px;
                            color: #333;
                            .el-radio__inner:after {
                                width: 6px;
                                height: 6px;
                            }
                        }
                    }
                }
                .content {
                    .el-form-item {
                        /*display: block;*/
                    }
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
            .pagination-box {
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
