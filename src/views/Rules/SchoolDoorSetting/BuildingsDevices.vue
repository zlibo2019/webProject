<template>
    <div class="buildings-devices">
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
                通道与设备
                <div class="btns1">
                    <Button title="添加" btnClass="custom7" :data="btn1Data" btnFontSize="12px"  @click="addAisle"
                            :iconLeft="true" v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@addInoutDev_create_own') > -1"></Button>
                </div>
            </div>
            <div class="content">
                <el-table id="table" ref="aisleTable" height="100%" :data="aisleData" tooltip-effect="dark" border
                          style="width: 100%" @row-click="toggleSelection" row-key="deviceinfo_id"
                          @selection-change="handleSelectionChange" v-loading="tableLoading1"
                          ><!--v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@selectInoutList_read_own') > -1"-->
                    <el-table-column prop="channelId" v-if="showIndex"></el-table-column>
                    <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="placeName" label="所属楼宇" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="channelName" label="全部通道" width="150"
                                     :filters=filtersData
                                     :filter-method="filterTag" filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <span>{{scope.row.channelName?scope.row.channelName : ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="deviceName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deviceNo" label="序列号" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="deviceIp" label="设备IP" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column fixed="right" label="操作" align="center" width="150">
                        <template slot-scope="scope">
                            <el-button class="normal" size="mini" plain @click="rowUpdate(scope.row)"
                                       v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@updateInoutDev_update_own') > -1">修改</el-button>
                            <el-button class="warning" size="mini" plain @click="deleteAisle(scope.row)"
                                       v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@deleteInoutDev_delete_own') > -1">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <!-- <div class="pagination-box">
                 <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
             </div>-->
            <el-dialog title="通道与设备" :visible.sync="addAisleDialog" width="720px" center class="sch-system-dialog aisle-dialog">
                <div class="content">
                    <el-form :inline="true" ref="aisleDevForm" :model="aisleDevForm" :rules="aisleDevFormRules"
                             class="demo-form-inline" label-width="90px">
                        <el-form-item label="所属楼宇：" prop="placeId">
                            <el-select v-model="aisleDevForm.placeId" placeholder="请选择楼宇" @change="channelSelectBuild">
                                <el-option :label="item.placeName" :value="item.placeId" :key="item.placeId"
                                           v-for="item in buildingData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="通道名称：" prop="channelName">
                            <el-input v-model="aisleDevForm.channelName" placeholder="请输入通道名称"></el-input>
                        </el-form-item>
                        <el-form-item label="关联设备："><!-- prop="deviceName"-->
                            <div class="dev-select-info" v-if="devSelectInfo"><!-- v-if="devSelectInfo"-->
                                <span>设备名称</span>
                                <el-input v-model="aisleDevForm.deviceName" placeholder="请输入设备名称" style="width: 130px;"></el-input>
                                <span>门锁接口</span>
                                <el-input v-model="aisleDevForm.lockName" placeholder="" style="width: 100px;" :disabled="true"></el-input>
                            </div>
                            <div class="dev-select-info" v-if="devSelectInfo2">
                                <span>设备名称</span>
                                <el-input v-model="aisleDevForm.deviceName" placeholder="请输入设备名称" style="width: 130px;"></el-input>
                            </div>
                            <Button title="选择设备" btnClass="custom8" btnFontSize="12px" btnHeight="30px" @click="addDevBtn"></Button>
                        </el-form-item>
                        <el-form-item label=" "></el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="addAisleDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveAisleForm"></Button>
				</span>
            </el-dialog>
            <el-dialog title="选择设备" :visible.sync="addAisle_SelectDevDialog" width="800px" center class="sch-system-dialog add-dev-dialog">
                <ul slot="title" class="dialog-title">
                    <li :class="{'act-li': actDevTag == dIdx}" v-for="(dev, dIdx) in devList" :key="dIdx">
                        <span @click="addDevClickTag(dIdx)">{{ dev.name }}</span></li>
                </ul>
                <div class="content" v-if="actDevTag == 0">
                    <div class="c-top">
                        <div class="ct-title">
                            <span>选择设备：</span>
                            <el-input v-model="searchDev" style="width: 230px;float: right" size="small" placeholder="请输入设备名称或设备序号查询" @change="search">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                            </el-input>
                        </div>
                        <div class="ct-table">
                            <el-table id="table" ref="addDoorDevTable" height="100%" :data="doorData1" tooltip-effect="dark" border
                                      highlight-current-row style="width: 100%" @row-click="clickDoorDevRow"
                                      @selection-change="handleSelectionChange" v-loading="tableLoading">
                                <el-table-column prop="deviceId" v-if="showIndex"></el-table-column>
                                <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column>
                                <el-table-column prop="deviceName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceNo" label="序列号" align="center" show-overflow-tooltip></el-table-column>
                            </el-table>
                        </div>
                        <!--<div class="pagination-box">
                             <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
                         </div>-->
                    </div>
                    <div class="c-bom">
                        <div class="cb-title">
                            <span>选择门锁接口：</span>
                        </div>
                        <div class="cb-radio">
                            <el-radio  v-for="lock in doorLockList" v-model="lockValue"
                                       :label="lock.lockNo" :key="lock.lockNo" :disabled="lock.isUsed == 1? true: false">
                                {{ lock.lockNo }}号门锁接口{{ lock.isUsed == 1? '(已分配)': '(未分配)' }}</el-radio>
                        </div>
                    </div>
                </div>
                <div class="content content2" v-if="actDevTag == 1">
                    <div class="c-top">
                        <div class="ct-title">
                            <span>选择设备：</span>
                            <el-input v-model="searchDev2" style="width: 230px;float: right" size="small" placeholder="请输入设备名称或设备IP查询" @change="search">
                                <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                            </el-input>
                        </div>
                        <div class="ct-table">
                            <el-table id="table" ref="addDoorDevTable2" height="100%" :data="doorData2" tooltip-effect="dark" border
                                      highlight-current-row style="width: 100%" @row-click="clickDoorDevRow" row-key="deviceinfo_id"
                                      @selection-change="handleSelectionChange" v-loading="tableLoading">
                                <el-table-column prop="deviceId" v-if="showIndex"></el-table-column>
                                <el-table-column fixed prop="indexID" label="序号" width="80" align="center"></el-table-column>
                                <el-table-column prop="deviceName" label="设备名称" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceId" label="设备ID" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="deviceIp" label="设备IP" align="center" show-overflow-tooltip></el-table-column>
                                <el-table-column prop="isUsed" label="分配状态" align="center" show-overflow-tooltip>
                                    <template slot-scope="scope">
                                        <span v-if="scope.row.isUsed">{{ scope.row.isUsed == 1? '已分配': '未分配' }}</span>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <!-- <div class="pagination-box">
                             <el-pagination background layout=" prev, pager, next" :total="allNum"></el-pagination>
                         </div>-->
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="addAisle_SelectDevDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveSelectDoorDev"></Button>
				</span>
            </el-dialog>
        </div>
        <div class="m-bom">
            <div class="title">
                通道与摄像头
                <div class="btns1">
                    <Button title="添加" btnClass="custom7" :data="btn1Data" btnFontSize="12px"  @click="addCamera"
                            :iconLeft="true" v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@addCamera_create_own') > -1"></Button>
                </div>
            </div>
            <div class="table-box">
                <el-table id="table" ref="multipleTable" height="100%" :data="cameraData" tooltip-effect="dark" border
                          style="width: 100%" v-loading="tableLoading2"><!-- v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@selectCameraList_read_own') > -1"-->
                    <el-table-column prop="indexID" label="序号" width="80" align="center"></el-table-column>
                    <el-table-column prop="id" v-if="showIndex"></el-table-column>
                    <el-table-column prop="placeName" label="所属楼宇" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="channelName" label="全部通道" width="150"
                                     :filters=cameraFiltersData
                                     :filter-method="filterTag" filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <span>{{scope.row.channelName?scope.row.channelName : ''}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cameraDirect" label="拍照方向" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.dicFmtMap.cameraDirectcn? scope.row.dicFmtMap.cameraDirectcn: '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cameraIp" label="摄像头IP" align="center" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cameraPhoto" label="抓拍事项" align="center" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{ scope.row.dicFmtMap.cameraPhotocn? scope.row.dicFmtMap.cameraPhotocn: '' }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" fixed="right" align="center">
                        <template slot-scope="scope">
                            <el-button class="normal" size="mini" plain @click="editCamera(scope.row)"
                                       v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@updateCameraList_update_own') > -1">修改</el-button>
                            <el-button class="warning" size="mini" plain @click="deleteCamera(scope.row)"
                                       v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@updateCameraList_update_own') > -1">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog title="通道与摄像头" :visible.sync="addCameraDialog" width="750px" center class="sch-system-dialog camara-dialog">
                <div class="content">
                    <el-form :inline="true" ref="aisleCameraForm" :model="aisleCameraForm" :rules="aisleCameraFormRules"
                             label-width="95px" class="demo-form-inline">
                        <el-form-item label="所属楼宇：" prop="placeId">
                            <el-select v-model="aisleCameraForm.placeId" placeholder="请选择楼宇"
                                       @change="caremaSelectBuild" style="width: 200px;">
                                <el-option :label="item.placeName" :value="item.placeId" :key="index"
                                           v-for="(item,index) in buildingData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="通道名称：" prop="channelId">
                            <el-select v-model="aisleCameraForm.channelId" placeholder="请选择通道名称" @change="caremaSelectChannel">
                                <el-option :label="item.channelName" :value="item.channelId" :key="index"
                                           v-for="(item,index) in allAisleData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关联方向：" prop="cameraDirect">
                            <el-select v-model="aisleCameraForm.cameraDirect" placeholder="请选择关联方向"
                                        style="width: 200px;">
                                <el-option :label="item.cameraDirectValue" :value="item.cameraDirect" :key="index"
                                           v-for="(item,index) in cameraSideData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label=" "></el-form-item>
                        <el-form-item label="摄像头类型：" prop="cameraType">
                            <el-select v-model="aisleCameraForm.cameraType" placeholder="请选择摄像头类型"
                                        style="width: 200px;">
                                <el-option :label="item.cameraTypeValue" :value="item.cameraType" :key="index"
                                           v-for="(item,index) in cameraTypeData"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="摄像头IP：" prop="cameraIp">
                            <el-input v-model="aisleCameraForm.cameraIp" placeholder="请输入摄像头IP"></el-input>
                        </el-form-item>
                        <el-form-item label="用户名：" prop="cameraUser">
                            <el-input v-model="aisleCameraForm.cameraUser" placeholder="请输入用户名" style="width: 200px;"></el-input>
                        </el-form-item>
                        <el-form-item label="密码：" prop="cameraPwd">
                            <el-input v-model="aisleCameraForm.cameraPwd" placeholder="请输入密码"></el-input>
                        </el-form-item>
                        <el-form-item label="抓拍类型：" prop="cameraPhoto">
                            <el-checkbox-group v-model="aisleCameraForm.cameraPhoto">
                                <el-checkbox :label="item.id" :key="index"
                                             v-for="(item,index) in photographType">{{ item.name }}</el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="addCameraDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="saveCameraForm"></Button>
				</span>
            </el-dialog>
        </div>
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
			let channelNameValidate = (rule, value, callback) => {   //输入项的特殊字符校验--文本框
				if (!$.trim(value)) {
					callback(new Error('请输入通道名称'));
				} else {
					// this.checkInputChars(value, ()=>{
					// 	 callback(new Error('输入内容不合法11'));
					// },1);//form内选填项
					// this.checkInputChars(value, '',1,1);//form外 $message提示
					this.checkInputChars(value, callback);//form内必填项
				}
				callback();
			};
			let deviceNameValidate = (rule, value, callback) => {   //输入项的特殊字符校验--文本框
				if (!$.trim(value)) {
					callback(new Error('请关联设备'));
				} else {
					this.checkInputChars(value, callback);//form内必填项
				}
				callback();
			};
			let cameraIpValidate = (rule, value, callback) => {   //输入项的特殊字符校验--文本框
				if (!$.trim(value)) {
					callback(new Error('请输入摄像头IP'));
				} else {
					this.checkIP(value, callback);//form内必填项
				}
				callback();
			};
			let cameraUserValidate = (rule, value, callback) => {   //输入项的特殊字符校验--文本框
				if (!$.trim(value)) {
					callback(new Error('请输入用户名'));
				} else {
					this.checkName(value, callback);//form内必填项
				}
				callback();
			};
			let cameraPwdValidate = (rule, value, callback) => {   //输入项的特殊字符校验--文本框
				if (!$.trim(value)) {
					callback(new Error('请输入密码'));
				} else {
					this.checkName(value, callback);//form内必填项
				}
				callback();
			};
			return {
				btn1Data:{
					iconL: require('../../../assets/images/add.png'),
					iconLAct: require('../../../assets/images/add.png')
				},
				btn2Data:{
					iconL: require('../../../assets/images/edit.png'),
					iconLAct: require('../../../assets/images/edit.png')
				},
				btn3Data:{
					iconL: require('../../../assets/images/del.png'),
					iconLAct: require('../../../assets/images/del.png')
				},
				btn4Data:{
					iconL: require('../../../assets/images/roll.png'),
					iconLAct: require('../../../assets/images/roll.png')
				},
				buildingData: [],       // 楼宇数据
				switchBtn: true,//楼宇切换新增/保存按钮
				addBuild: false,//添加文本框是否显示
				addBuildModel: '',//添加文本model
				normalVal: '',// 楼宇修改之前的名称
				bIdx:'',//点击修改的当前index
				activeInputId: '',//选中input的id 存一下
				choosePlaceName: '',//选中input的id 存一下
				buildBtnTag: '',//楼宇按钮tag标示(新增修改删除分别为123)
                aisleBtnTag: '',        // 通道 增改tag标签
                cameraBtnTag: '',        // 摄像头 增改tag标签
				aisleData: [],              // 通道数据(门控道闸)
				allAisleData: [],           // 新增修改摄像头使用- 全部通道数据
				aisleData2: [
					{
						id:'1',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头',
						deviceID:'200818',
						deviceIP:'192.168.1.1',
						settings:'门卫使用'
					},
					{
						id:'1',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头1',
						deviceID:'200818',
						deviceIP:'192.168.1.2',
						settings:'门卫使用'
					},
					{
						id:'2',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头2',
						deviceID:'200818',
						deviceIP:'192.168.1.1',
						settings:'门卫使用'
					},
					{
						id:'3',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头3',
						deviceID:'200818',
						deviceIP:'192.168.1.1',
						settings:'门卫使用'
					},
					{
						id:'4',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头4',
						deviceID:'200818',
						deviceIP:'192.168.1.1',
						settings:'门卫使用'
					},
					{
						id:'5',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头5',
						deviceID:'200818',
						deviceIP:'192.168.1.1',
						settings:'门卫使用'
					},
					{
						id:'6',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头6',
						deviceID:'200818',
						deviceIP:'192.168.1.1',
						settings:'门卫使用'
					},
					{
						id:'7',
						aisle:'校大门',
						building:'22#',
						deviceName:'摄像头7',
						deviceID:'200818',
						deviceIP:'192.168.1.1',
						settings:'门卫使用'
					},
				],              // （考勤门禁一体机）表格数据
				aisleData2: [],
				aisleSelection: '',      //选中通道行的数据
				aisleForm: {   //添加通道form
					device_number:'',
					device_name:'',
					device_IP:'',
					device_settings:'',
					device_bind:'',
				},
				deviceData:[
					{
						device_number:20081868,
						device_name:'呼哈',
						device_IP:'192.168.1.2',
						device_settings:20081868,
						device_bind:'未绑定',
					},
					{
						device_number:20081868,
						device_name:'呼哈',
						device_IP:'192.168.1.2',
						device_settings:20081868,
						device_bind:'未绑定',
					},
					{
						device_number:20081868,
						device_name:'呼哈',
						device_IP:'192.168.1.2',
						device_settings:20081868,
						device_bind:'未绑定',
					},
					{
						device_number:20081868,
						device_name:'呼哈',
						device_IP:'192.168.1.2',
						device_settings:20081868,
						device_bind:'未绑定',
					},
					{
						device_number:20081868,
						device_name:'呼哈',
						device_IP:'192.168.1.2',
						device_settings:20081868,
						device_bind:'未绑定',
					},
					{
						device_number:20081868,
						device_name:'呼哈',
						device_IP:'192.168.1.2',
						device_settings:20081868,
						device_bind:'未绑定',
					},
					{
						device_number:20081868,
						device_name:'呼哈',
						device_IP:'192.168.1.2',
						device_settings:20081868,
						device_bind:'未绑定',
					},
				],
				deviceData: [],
				showIndex:false,
				tableLoading: false,        //表格加载动画
				tableLoading1: false,        //通道表格加载动画
				tableLoading2: false,        //摄像头表格加载动画
				cameraData: [],             //摄像头数组
				allNum:80,                  //分页总条数
				currentPage:1,               //当前页（默认设为第一页）
				pageItem:20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				isToast:false,
				toast:'',
				spanArr: [],                //跨行数据
				filtersData: [],            //过滤数据（通道）
				cameraFiltersData: [],            //过滤数据（摄像头通道）
				addAisleDialog: false,     //添加通道弹窗
				aisleDevForm: {           // 通道与设备form
					placeId: '',
					channelName: '',
					deviceName: '',
					deviceType: '',
				},            // 通道与设备form
				addDevForm: {},            // 通道与设备-选择设备form
				addAisle_SelectDevDialog: false,     //添加通道-选择设备弹窗
				devList: [                          // 添加通道与设备-选择设备中tag标签列表
					{
						name: '门控道闸'
					},{
						name: '考勤门禁一体机'
					}],
				doorData1:[],               // 门控道闸数据
				doorData2:[],               // 考勤一体机数据
				actDevTag: 0,               //添加通道-选择设备弹窗-tag标签选中状态
				searchDev: '',              //添加通道-选择设备弹窗-搜索设备搜索框model（门控道闸）
				searchDev2: '',              //添加通道-选择设备弹窗-搜索设备搜索框model（考勤一体机）
				lockValue: '',                  //选择的门锁设备
				doorLockList: [
					{
						lockNo: '1号门锁接口(未分配)',
						dis: 0,
						id: 1
					},{
						lockNo: '2号门锁接口(已分配)',
						dis: 1,
						id: 2
					},{
						lockNo: '3号门锁接口(已分配)',
						dis: 1,
						id: 3
					},{
						lockNo: '4号门锁接口(已分配)',
						dis: 0,
						id: 4
					},{
						lockNo: '5号门锁接口(已分配)',
						dis: 0,
						id: 5
					}],
				doorLockList: [],
				doorRowData: {},                // 选择设备(门控道闸)表格选择的行
				doorRowData2: {},                // 选择设备(考勤门禁一体机)表格选择的行
				devSelectInfo: false,           // 选择的设备信息，默认不展示
				devSelectInfo2: false,           // 选择的设备信息，默认不展示(考勤门禁的信息)
				aisleDevFormRules: {            // 通道设备规则
					placeId: [ { required: true, message: '请选择楼宇' }],
					channelName: [ { required: true, validator: channelNameValidate,trigger: 'blur' }],
					deviceName: [ { required: true, validator: deviceNameValidate ,trigger: 'blur'}],
				},
				addCameraDialog: false,         // 添加摄像头弹窗
				aisleCameraForm: {              // 添加摄像头form
					placeId: '',
					channelId: '',
					cameraDirect: '',
					cameraType: '',
					cameraPhoto: [],             // 抓拍类型，格式必须设为数组
				},         // 添加摄像头form
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
				cameraSideData: [],
				cameraTypeData: [               // 摄像头类型
					{
						cameraTypeValue: '海康威视',
						cameraType: 1
					},{
						cameraTypeValue: '大华',
						cameraType: 2
					}],          //摄像头类型
				cameraTypeData: [],
				photographType: [               //抓拍类型
					{
						name: '开门成功抓拍',
						id: '1'
					},{
						name: '开门失败抓拍',
						id: '2'
					}],             //抓拍类型
				aisleCameraFormRules: {         // 添加摄像头form规则
					placeId: [ { required: true, message: '请选择楼宇' }],
					channelId: [ { required: true, message: '请输入通道名称' }],
					cameraDirect: [ { required: true, message: '请选择关联方向' }],
					cameraType: [ { required: true, message: '请选择摄像头类型' }],
					cameraIp: [ { required: true, validator: cameraIpValidate }],
					cameraUser: [ { required: true,message: '请输入用户名' /*validator: cameraUserValidate*/ }],
					cameraPwd: [ { required: true, message: '请输入密码' /*validator: cameraPwdValidate*/ }],
					cameraPhoto: [ { required: true, message: '请选择抓拍类型',trigger: 'change' }],
                },       // 添加摄像头form规则
                cameraId:'',//摄像头id 修改时传
			}
		},
		methods: {
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
				let actInput = $('.buildings-devices .m-top .el-input.act');
				let actInputSibling = $('.buildings-devices .m-top .el-input.act').parent().siblings();
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
					let shade = $('.buildings-devices .m-top .content .shade-div');
					let groupBtn = $('.buildings-devices .m-top .el-input.act').parent();
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
				let actInput = $('.buildings-devices .m-top .el-input.act');
				if(actInput.length != 0) {//必须选中一个楼宇才能进行删除
					/* if(this.activeInputId == ''){//全部选项，不能修改
						this.$message({message: '不能删除默认楼宇', type: 'warning',duration: this.msgDuration});
						return;
					} */
					// 获取该楼宇下是否有设备
					let params = {
						placeId: this.activeInputId,
					}
					this.$api.Rules.beforeDeletePlace(params).then( res => {
						// console.log('当前楼宇-是否有设备', res)
						if (res.data.code == 600 ||　res.data.code == 0) {
							//该楼宇下关联通道、进出设备、访客设备，删除楼宇将一并删除，请谨慎操作。是否继续？
							//此操作将永久删除
							this.$confirm(
								`${res.data.data.msg ? '该楼宇下关联'+res.data.data.msg + '，删除楼宇将一并删除': '此操作将永久删除'}， 请谨慎操作。是否继续?`, '提示', {
								confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
							}).then(() => {//点击确定按钮进行的操作
								Loading.service();
								this.$api.Rules.deletePlace(params).then( res => {
									console.log('删除楼宇-是否成功', res)
									Loading.service().close();
									this.isToast = true;
									this.toast = res.data.msg;
									if (res.data.code == 600 ||　res.data.code == 0) {
										// this.$message({type: 'success', message: '删除成功!',duration: this.msgDuration});//请求删除成功之后提示
										$('.buildings-devices .m-top').find('.el-input').removeClass('act');//删除act input样式
										$('.buildings-devices .m-top .groupBtn:first-child').find('.el-input').addClass('act');// 默认选择全部
										this.activeInputId = '';// 清空当前选择
										this.loadBuildData();//获取楼宇数据-刷新
										this.loadAisleData();//获取通道数据
										this.loadCameraData();//获取摄像头数据
										/*let buildIdArr = [];//取出数组中的id，用来查找下标进行删除操作
										$.each(this.buildingData, function (i, buildId) {
											buildIdArr.push(buildId.id);
										})
										let index = buildIdArr.indexOf(this.activeInputId);
										if (index > -1) {//找到当前选中的下标并删除
											this.buildingData.splice(index, 1);
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
						this.$api.Rules.addPlace(params).then( res => {
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
					let actInput = $('.buildings-devices .m-top .el-input.act');//获取当前选中的楼宇
					let actInputVal = $(actInput).find('input').val();//当前修改input的值
					let state = this.formOutTest(actInputVal,funcName);
					if(state){
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
					this.$api.Rules.updatePlace(params).then( res => {
						// console.log('修改楼宇-是否成功', res)
						this.isToast = true;
						this.toast = res.data.msg;
						Loading.service().close();
						if (res.data.code == 600 ||　res.data.code == 0) {
							// this.loadBuildData();//获取楼宇数据-刷新     0920修改-不刷新，避免选中当前值变化
							//将遮罩层层级换成0，当前编辑input层级换成1（请求成功之后）
							let shade = $('.buildings-devices .m-top .content .shade-div');
							let groupBtn = $('.buildings-devices .m-top .el-input.act').parent();
							shade.css('z-index',0);
							groupBtn.css('z-index',1);
							//获取当前选中的楼宇
							$(actInput).find('input').attr('readOnly','true')
							actInput.removeClass('edit');
							this.switchBtn = true;//切换新增、修改按钮
							this.loadAisleData();//获取通道数据
							this.loadCameraData();//获取摄像头数据
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
				let actInput = $('.buildings-devices .m-top .el-input.act');
				$(actInput).find('input').attr('readOnly','true')
				actInput.removeClass('edit');
				if(this.buildBtnTag == 2) {//点击了编辑按钮
					//将遮罩层层级换成0，当前编辑input层级换成1
					let shade = $('.buildings-devices .m-top .content .shade-div');
					let groupBtn = $('.buildings-devices .m-top .el-input.act').parent();
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
				this.loadAisleData();//获取通道数据
				this.loadCameraData();//获取摄像头数据
			},
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
			 *  @function: 置空弹窗中表单的数据
			 *  @author: lxr
			 *  @date 2018-9-3
			 **/
			resetForm(formName)
			{
				if (this.$refs[formName] !== undefined) {     //防止form未加载完毕时报错
					this.$refs[formName].clearValidate();
				}
			},
			/**
			 *  @function添加通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			addAisle(){
				this.addAisleDialog = true;
				this.aisleBtnTag = 1;   // 点击了新增按钮
				this.lockValue = '';                    // 清空选择门锁接口设备
				this.devSelectInfo = false;     // info信息不展示
				this.devSelectInfo2 = false;     // info信息不展示
				this.doorRowData = {};  // 清空选中行数据
				this.doorRowData2 = {}; // 清空选中行数据
				this.aisleDevForm = {
					placeId: '',
					channelName: '',
					deviceName: '',
				};// 清空form
				setTimeout(() => {
					this.$refs["aisleDevForm"].clearValidate();
					this.aisleDevForm.placeId = this.activeInputId;//添加通道设备时，所属楼宇默认已选楼宇
					this.aisleDevForm.placeName = this.choosePlaceName;//添加通道设备时，所属楼宇默认已选楼宇
				})
				// this.resetForm('aisleDevForm');// 偶尔不好使
			},
			/**
			 *  @function: 添加通道-选择设备按钮
			 *  @author: lxr
			 *  @date 2018-8-31
			 **/
			addDevBtn(){
				this.addAisle_SelectDevDialog = true;//选择设备弹窗展示
				this.actDevTag = 0;// 切换选中状态
                this.searchDev = '';    // 清空搜索内容
                this.searchDev2 = '';   // 清空搜索内容
                setTimeout(()=>{
	                $('.add-dev-dialog .content .ct-table').height('200px');// 设置选择设备的表格高度
                })
				this.getDoorData( 2, 'doorData1', 200, 'doorRowData', 'addDoorDevTable', this.searchDev);    // 获取门控道闸数据
			},
			/**
			 *  @function: 添加通道-选择设备-弹窗点击tag标签页按钮切换选择设备
			 *  @author: lxr
			 *  @date 2018-8-31
			 **/
			addDevClickTag(devIndex){
				this.actDevTag = devIndex;// 切换选中状态
				if(devIndex == 0){// 门控道闸
					setTimeout(()=>{
						$('.add-dev-dialog .content .ct-table').height('200px');// 设置选择设备的表格高度
					})
                    this.getDoorData( 2, 'doorData1', 200, 'doorRowData', 'addDoorDevTable', this.searchDev);    // 获取门控道闸数据
				}else if(devIndex == 1){// 考勤一体机
					setTimeout(()=>{
						$('.add-dev-dialog .content2 .ct-table').height('300px');// 设置选择设备的表格高度
					})
					this.getDoorData( 1, 'doorData2', 300, 'doorRowData2', 'addDoorDevTable2', this.searchDev2);    // 获取门控道闸数据
				}
			},
			/**
			 *  @function: 添加通道-选择设备-搜索按钮
			 *  @author: lxr
			 *  @date 2018-9-13
			 **/
			search(){
				if(this.actDevTag == 0) {// 添加门控道闸设备
					this.getDoorData( 2, 'doorData1', 200, 'doorRowData', 'addDoorDevTable', this.searchDev);    // 获取门控道闸数据
				}else if(this.actDevTag == 1){// 点击考勤一体机设备
					this.getDoorData( 1, 'doorData2', 300, 'doorRowData2', 'addDoorDevTable2',this.searchDev2);    // 获取门控道闸数据
				}
            },
			/**
			 *  @function: 添加通道-选择设备-点击设备表格列表
			 *  @author: lxr
			 *  @date 2018-8-31
			 **/
			clickDoorDevRow(row){
				if(this.actDevTag == 0) {// 添加门控道闸设备
					this.getDoorLock( row.deviceId, row.deviceNo);  // 获取门锁接口
					if(JSON.stringify(this.doorRowData) == "{}"){
						this.doorRowData = row;
					}else{
						this.lockValue = '';
						let rowObj = row;
						rowObj.lockNo = this.doorRowData.lockNo;
						this.doorRowData = rowObj;
					}
				}else if(this.actDevTag == 1){// 点击考勤一体机设备
					this.doorRowData2 = row;
				}
			},
			/**
			 *  @function: 添加通道-选择设备-点击保存按钮保存设备
			 *  @author: lxr
			 *  @date 2018-8-31
			 **/
			saveSelectDoorDev(){
				this.devSelectInfo = false;                // 展示选择设备信息
				this.devSelectInfo2 = false;                // 展示选择设备信息
				if(this.actDevTag == 0){// 添加门控道闸设备
					if(JSON.stringify(this.doorRowData) == "{}"){// 选择设备
						this.$message({
							message: '请选择设备！',
							type: 'warning',
							duration: this.msgDuration
						})
						return;
					}
					if(this.lockValue == ''){
						this.$message({
							message: '请选择门锁接口！',
							type: 'warning',
							duration: this.msgDuration
						})
						return;
					}
					this.addAisle_SelectDevDialog = false;  // 关闭选择设备窗口并赋值
					this.devSelectInfo = true;                // 展示选择设备信息
					this.aisleDevForm.deviceName = this.doorRowData.deviceName; // 设置设备名称
					this.aisleDevForm.deviceNo = this.doorRowData.deviceNo; // 设置设备编号
					this.aisleDevForm.lockNo = this.lockValue; // 设置门锁接口号
					this.aisleDevForm.lockName = this.lockValue + '号门锁接口'; // 设置门锁接口名称
					this.aisleDevForm.deviceId = this.doorRowData.deviceId; // 设置设备id
					this.aisleDevForm.deviceIp = this.doorRowData.deviceIp; // 设置设备ip
					this.aisleDevForm.deviceType = this.doorRowData.deviceType; // 设置设备类型
				}else if(this.actDevTag == 1){// 添加考勤门禁一体机设备
					if(JSON.stringify(this.doorRowData2) == "{}"){// 选择设备
						this.$message({
							message: '请选择设备！',
							type: 'warning',
							duration: this.msgDuration
						})
						return;
					}
					this.addAisle_SelectDevDialog = false;  // 关闭选择设备窗口并赋值
					this.devSelectInfo2 = true;                // 展示选择设备信息
					this.aisleDevForm.deviceName = this.doorRowData2.deviceName; // 设置设备名称
					this.aisleDevForm.deviceNo = this.doorRowData2.deviceNo; // 设置设备编号
					this.aisleDevForm.deviceId = this.doorRowData2.deviceId; // 设置设备id
					this.aisleDevForm.deviceIp = this.doorRowData2.deviceIp; // 设置设备ip
					this.aisleDevForm.deviceType = this.doorRowData2.deviceType; // 设置设备类型
					this.aisleDevForm.lockNo = ''; // 清空门锁接口号
					this.aisleDevForm.lockName = ''; // 清空门锁接口名称
					setTimeout(() => {
						this.$refs["aisleDevForm"].clearValidate(['deviceName']);
					})
				}
			},
			/**
			 *  @function修改通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			rowUpdate(row){
				// console.log('修改通道',row)
				this.addAisleDialog = true;// 弹窗展示
				this.aisleBtnTag = 2;   // 点击了修改按钮
				this.aisleDevForm = {};// 清空form
				this.doorRowData = {};  // 清空选中行数据
				this.doorRowData2 = {}; // 清空选中行数据
				this.devSelectInfo = false;                // 展示选择设备信息
				this.devSelectInfo2 = false                // 展示选择设备信息
				setTimeout(() => {
					this.$refs["aisleDevForm"].clearValidate();
				})
				//获取内容并赋值
				this.aisleDevForm = JSON.parse(JSON.stringify(row));
				// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
                if(row.deviceType == 1){// 一体机
	                this.devSelectInfo2 = true;                // 展示选择设备信息
	                this.doorRowData2 = this.aisleDevForm;
                }else if(row.deviceType == 2){// 门控器
	                this.devSelectInfo = true;                // 展示选择设备信息
	                this.aisleDevForm.lockName = row.lockNo + '号门锁接口';
	                this.doorRowData = this.aisleDevForm;
                }
                // console.log(`修改通道获取数据:`,this.doorRowData2)
			},
			/**
			 *  @function:: 删除通道按钮
			 *  @author: lxr
			 *  @date 2018-9-1
			 **/
			deleteAisle(row){
				// console.log('删除通道')
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					Loading.service();
					let params = {
						placeId: row.placeId,
						channelId: row.channelId,
						deviceId: row.deviceId,
						schoolId: localStorage.getItem('schoolId'),
					}
					this.$api.Rules.deleteInoutDev(params).then( res => {
						// console.log('删除通道是否成功', res)
						Loading.service().close();
						if (res.data.code == 600 ||　res.data.code == 0) {
							this.$message({type: 'success', message: '删除成功!'});//请求删除成功之后提示
							this.loadAisleData();//获取通道数据
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
			 *  @function添加通道功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			saveAisleForm(){
				this.$refs['aisleDevForm'].validate((valid) => {
					if (valid) {
						Loading.service();
						let params = {
							placeId: this.aisleDevForm.placeId,
							placeName: this.aisleDevForm.placeName,
							channelId: this.aisleDevForm.channelId,
							channelName: this.aisleDevForm.channelName,
							deviceName: this.aisleDevForm.deviceName ? this.aisleDevForm.deviceName : '',
							deviceId: this.aisleDevForm.deviceName && this.aisleDevForm.deviceId ? this.aisleDevForm.deviceId : '',
							deviceIp: this.aisleDevForm.deviceName && this.aisleDevForm.deviceIp ? this.aisleDevForm.deviceIp : '',
							deviceType: this.aisleDevForm.deviceName && this.aisleDevForm.deviceType ? this.aisleDevForm.deviceType : '',
							lockNo: this.aisleDevForm.deviceName && this.aisleDevForm.lockNo ? this.aisleDevForm.lockNo : '',
							schoolId: localStorage.getItem('schoolId'),
							schoolName: localStorage.getItem('schoolName'),
							deviceNo: this.aisleDevForm.deviceName && this.aisleDevForm.deviceNo ? this.aisleDevForm.deviceNo : '',   // 新增序列号
						}
						// return
						if(this.aisleBtnTag == 1){// 新增保存按钮
							this.$api.Rules.addInoutDev(params).then( res => {
								// console.log('新增通道是否成功', res)
								Loading.service().close();
								this.isToast = true;
								this.toast = res.data.msg;
								if (res.data.code == 600 ||　res.data.code == 0) {
									this.addAisleDialog = false;// 关闭添加通道设备弹窗
									this.loadAisleData();//获取通道数据
								}
							}).catch(err =>{
								Loading.service().close();
							})
                        }else if(this.aisleBtnTag == 2){// 修改保存按钮
							this.$api.Rules.updateInoutDev(params).then( res => {
								// console.log('修改通道是否成功', res)
								Loading.service().close();
								this.isToast = true;
								this.toast = res.data.msg;
								if (res.data.code == 600 ||　res.data.code == 0) {
									this.addAisleDialog = false;// 关闭添加通道设备弹窗
									this.loadAisleData();//获取通道数据
								}
							},(error)=>{
								Loading.service().close();
							})
                        }
					} else {
						return false;
					}
				});
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
				this.aisleDevForm.placeName = obj.placeName;
            },
			/**
			 *  @function: 添加摄像头按钮
			 *  @author: lxr
			 *  @date 2018-9-1
			 **/
			addCamera(){
				this.addCameraDialog = true;// 开启弹窗
                this.cameraBtnTag = 1;      // 点击了新增
				this.getAisleData('');//获取全部通道数据- 增改摄像头专用
				this.aisleCameraForm = {       // 清空form
					placeId: '',
					channelId: '',
					cameraDirect: '',
					cameraType: '',
					cameraPhoto: ['1','2'],             // 抓拍类型，格式必须设为数组
					cameraIp: '',                // 清空（IE必填）
					cameraUser: '',
					cameraPwd: '',
				};
				// this.resetForm('aisleCameraForm');
				setTimeout(() => {
					this.$refs["aisleCameraForm"].clearValidate();
					this.aisleCameraForm.placeId = this.activeInputId;//添加通道设备时，所属楼宇默认已选楼宇
					this.aisleCameraForm.placeName = this.choosePlaceName;//添加通道设备时，所属楼宇默认已选楼宇
				})
                this.getCaremaDialogData();     // 加载弹窗中的下拉框数据
			},
			/**
			 *  @function: 修改摄像头按钮
			 *  @author: lxr
			 *  @date 2018-9-1
			 **/
			editCamera(row){
                console.log('修改摄像头',row)
                this.cameraId = row.cameraId;
				this.addCameraDialog = true;// 开启弹窗
				this.cameraBtnTag = 2;      // 点击了修改
				this.getAisleData('');//获取全部通道数据- 增改摄像头专用
				this.getCaremaDialogData();     // 加载弹窗中的下拉框数据
				//获取内容并赋值
				// this.aisleCameraForm = row;
				// this.aisleCameraForm.cameraType = parseInt(this.aisleCameraForm.cameraType);// 转id为int
				// this.aisleCameraForm = {}
                this.aisleCameraForm = {
					id:row.id,
	                placeId: row.placeId,
	                placeName: row.placeName,
	                channelName: row.channelName,
	                channelId: row.channelId,
	                cameraDirect: row.cameraDirect,
	                cameraType: parseInt(row.cameraType),
	                cameraIp: row.cameraIp,
	                cameraUser: row.cameraUser,
	                cameraPwd: row.cameraPwd,
	                cameraPhoto: row.cameraPhoto,
                }
				// console.log('begin',this.aisleCameraForm.cameraPhoto)
				if(this.aisleCameraForm.cameraPhoto == 3){// 全部
					this.aisleCameraForm.cameraPhoto = ['1','2']
				}else if(this.aisleCameraForm.cameraPhoto == 1){// 值为1是组件自动转为true
					this.aisleCameraForm.cameraPhoto = ['1']
				} else{
					let dataIntArr = [];
					let str = this.aisleCameraForm.cameraPhoto.toString().split();
					str.forEach(function(data,index,arr){
						dataIntArr.push(+data);
					});
					this.aisleCameraForm.cameraPhoto = str
				}
				// console.log('aqqq',JSON.stringify(this.aisleCameraForm.cameraPhoto))
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
			 *  @function: 摄像头添加-选择楼宇
			 *  @author: lxr
			 *  @date 2018-9-14
			 **/
			caremaSelectBuild( buildId ){
				let obj = {};
				obj = this.buildingData.find((item) => {//这里的deviceSeries就是上面遍历的数据源
					return item.placeId === buildId;//筛选出匹配数据
				});
				this.aisleCameraForm.placeName = obj.placeName;
				this.getAisleData(buildId);//获取全部通道数据- 增改摄像头专用
                this.aisleCameraForm.channelId = '';    // 清空通道选中
                this.aisleCameraForm.channelName = '';  // 清空通道选中
            },
			/**
			 *  @function: 通道添加-选择通道
			 *  @author: lxr
			 *  @date 2018-9-14
			 **/
			caremaSelectChannel( channelId ){
				let obj = {};
				obj = this.aisleData.find((item) => {//这里的deviceSeries就是上面遍历的数据源
					return item.channelId === channelId;//筛选出匹配数据
				});
				this.aisleCameraForm.channelName = obj.channelName;
			},
			/**
			 *  @function: 添加摄像头功能----保存按钮
			 *  @author: lxr
			 *  @date 2018-9-1
			 **/
			saveCameraForm(){
				this.$refs['aisleCameraForm'].validate((valid) => {
					if (valid) {
						Loading.service();
						// console.log('chandu',this.aisleCameraForm.cameraPhoto)
						if(this.aisleCameraForm.cameraPhoto.length == 2){// 抓拍类型格式--全选传3
							this.aisleCameraForm.cameraPhoto = '3';
                        }else{
							this.aisleCameraForm.cameraPhoto = this.aisleCameraForm.cameraPhoto.join(',')
                        }
						let params = {
							schoolId: localStorage.getItem('schoolId'),
							id:this.aisleCameraForm.id,
							placeId: this.aisleCameraForm.placeId,
							placeName: this.aisleCameraForm.placeName,
							channelName: this.aisleCameraForm.channelName,
							channelId: this.aisleCameraForm.channelId,
							cameraDirect: this.aisleCameraForm.cameraDirect,
							cameraType: this.aisleCameraForm.cameraType,
							cameraIp: this.aisleCameraForm.cameraIp,
							cameraUser: this.aisleCameraForm.cameraUser,
							cameraPwd: this.aisleCameraForm.cameraPwd,
							cameraPhoto: this.aisleCameraForm.cameraPhoto,
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
			 *  @function: 表格跨行方法
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			objectSpanMethod({ row, column, rowIndex, columnIndex }) {
				// console.log(1234,row, column, rowIndex, columnIndex)
				if (columnIndex == 1 ||　columnIndex == 2 || columnIndex == 6) {
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
				for (let i = 0; i < data.length; i++) {
					if (i === 0) {
						this.spanArr.push(1);
						this.pos = 0
					} else {
						// 判断当前元素与上一个元素是否相同--->找数组中相同的字段进行分组
						if (data[i].id === data[i - 1].id) {
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
			 *  @function: table 列表点击筛选(全部通道)
			 *  @author: lxr
			 *  @date 2018-08-30
			 */
			filterTag(value, row) {
				return row.channelName === value;
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
			 *  @function: 点击通道设备列表中某行的选中事件
			 *  @author: lxr
			 *  @date 2018-9-14
			 **/
			toggleSelection(row) {
				//console.log(666, row.deviceinfo_id, selected)
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
				this.changePage(this.pageItem,this.currentPage);
			},
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-5-24
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.changePage(this.pageItem,this.currentPage);
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
			 *  @function: 获取摄像头弹窗中的数据
			 *  @author: lxr
			 *  @date 2018-9-13
			 **/
            getCaremaDialogData(){
            	// 获取摄像头关联方向
				this.$api.Rules.getCameraFx().then( res => {
					// console.log('摄像头关联方向', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.cameraSideData = res.data.data;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
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
			/**
			 *  @function: 获取门控道闸/考勤一体机数据
			 *  @author: lxr
			 *  @date 2018-9-13
             *  @param: deviceType(设备类型，接口参数), doorData(列表赋值data), tableHeight(表格高度), doorRowData(表格行数据), refTable(表格的ref)
			 **/
            getDoorData(deviceType, doorData, tableHeight, doorRowData, refTable, searchValue){
	            let params = {
		            schoolId: localStorage.getItem('schoolId'),
		            pageNum: 1,
		            page_size: 10000,
		            deviceType: deviceType,// 设备类型（2：门控器；1：一体机；21：访客机；22：门卫机）
		            devNameLike: searchValue,// 模糊条件（设备名称）
	            }
				this.$api.Rules.selectDevList(params).then( res => {
		            // console.log('设备数据-设备类型：'+deviceType+'---->',res)
		            if (res.data.code == 600 ||　res.data.code == 0) {
			            this[doorData] = res.data.data.records;
                        if(deviceType == 1){
                            this[doorData].forEach((item,index)=>{
                                if(item.isUsed != 0){
                                    this[doorData].splice(index,1)
                                }
                            })
                        }
			            if(this[doorData].length == 0){ // 数据为空不走获取门锁接口并清空
				            this.doorLockList = [];
				            return;
                        }
			            $.each(this[doorData], (a,b)=> {      //添加序号，切换页面序号连增
				            this.$set(this[doorData][a],'indexID',(this.currentPage - 1) * this[doorData].length + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
			            })
			            // 选中设备表格第一条
			            setTimeout(()=>{
				            $('.add-dev-dialog .ct-table').height( tableHeight + 'px' );// 设置选择设备的表格高度
				            if(JSON.stringify(this[doorRowData]) == "{}"){// 第一次进来（考勤门禁一体机）
				            	// console.log(`door-第一次进来`)
					            if(this.aisleBtnTag == 1){ // 新增
						            this.$refs[refTable].setCurrentRow(this[doorData][0]);// 设置选择表格第一条
						            this[doorRowData] = this[doorData][0];// 设置选中第一条
						            if(doorRowData == 'doorRowData'){
							            // console.log('athis[doorRowData]',this[doorRowData])
							            this.getDoorLock( this[doorRowData].deviceId, this[doorRowData].deviceNo);  // 获取门接口
						            }
					            }else if(this.aisleBtnTag == 2){ // 修改
						            // console.log(`door-第一次进来-修改`,this[doorRowData])
						            if(doorRowData == 'doorRowData'){
							            this.lockValue = '';
							            this.doorLockList = [];// 清空门锁列表
						            }
                                }
				            }else{  // 第二次进来则选中之前选中的
					            // console.log(`door-第2次进来2222222`)
					            this[doorData].forEach(row => {
						            if(row.deviceId == this[doorRowData].deviceId){ // 已授权
							            // console.log(`door-第2次进来:${doorRowData+'(rowTag)'+JSON.stringify(this[doorRowData])+'>>'+row.deviceId +'=='+ this[doorRowData].deviceId}`)
							            setTimeout(()=>{// 必加延迟
								            this.$refs[refTable].setCurrentRow(row);
								            if(this.aisleBtnTag == 2 && doorRowData == 'doorRowData') { // 修改
									            this.getDoorLock( this[doorRowData].deviceId, this[doorRowData].deviceNo);  // 获取门接口
									            this.lockValue = this[doorRowData].lockNo;
								            }
							            })
						            }
					            });
                            }
			            })
		            } else {
			            this.isToast = true;
			            this.toast = res.data.msg;
		            }
	            })
            },
			/**
			 *  @function: 获取门接口数据
			 *  @author: lxr
			 *  @date 2018-9-13
			 **/
			getDoorLock( deviceId, deviceNo){
				let params = {
					deviceId: deviceId,
					deviceNo: deviceNo,    // 设备序列号
				}
				this.$api.Rules.selectLock(params).then( res => {
					// console.log('门接口数据', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.doorLockList = res.data.data;
						if(this.aisleBtnTag == 2 && this.actDevTag == 0) { // 修改-门控道法
							this.lockValue = this.doorRowData.lockNo;
						}
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
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
						this.resizeInputWidth();//重定义input宽
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载通道数据
			 *  @author: lxr
			 *  @date 2018-7-18
			 **/
			loadAisleData(){
				this.tableLoading1 = true;  // 开启loading
				let params = {
					count: true,
					page_index: this.currentPage,
					page_size: 10000,
					search: {
						placeId: this.activeInputId,// 场所id
					}
				}
				this.$api.Rules.selectInoutList(params).then( res => {
					// console.log('根据楼宇查询通道设备数据2', res)
					this.tableLoading1 = false;  // 关闭loading
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.resizeLayout();//重新获取宽高
						this.aisleData = res.data.data.records;
						let r, roleGroup = [];
						$.each(this.aisleData, (a,b)=> {      //添加序号，切换页面序号连增
							this.$set(this.aisleData[a],'indexID',(this.currentPage - 1) * this.aisleData.length + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
							if(b.channelName){
								roleGroup.push(b.channelName);//找出通道部分
							}
						})
                        r = roleGroup.filter(function(element,index,self){
                            return self.indexOf(element) == index;     //indexOf只返回元素在数组中第一次出现的位置，如果与元素位置不一致，说明该元素在前面已经出现过，是重复元素
                        })
                        let filter = [];
                        $.each(r, function (j, c) {
                            let aa = {}
                            aa.text = c;
                            aa.value = c;
                            filter[j] = aa
                        })
                        this.filtersData = filter;//设置过滤数据
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading1 = false;  // 关闭loading
                })
			},
			/**
			 *  @function: 加载摄像头数据
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			loadCameraData(){
				this.tableLoading2 = true;  // 开启loading
				let params = {
					count: true,
					page_index: this.currentPage,
					page_size: 10000,
					search: {
						placeId: this.activeInputId,// 场所id
					}
				}
				this.$api.Rules.selectCameraList(params).then( res => {
					// console.log('根据楼宇查询通道摄像头数据', res)
					this.tableLoading2 = false;  // 关闭loading
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.resizeLayout();//重新获取宽高
						this.cameraData = res.data.data.records;
						let r, roleGroup = [];
						$.each(this.cameraData, (a,b)=> {      //添加序号，切换页面序号连增
							this.$set(this.cameraData[a],'indexID',(this.currentPage - 1) * this.cameraData.length + a + 1)//序号计算(当前页码-1)*当页条数+变化的i值+1
							if(b.channelName){
								roleGroup.push(b.channelName);//找出通道部分
							}
						})
						r = roleGroup.filter(function(element,index,self){
							return self.indexOf(element) == index;     //indexOf只返回元素在数组中第一次出现的位置，如果与元素位置不一致，说明该元素在前面已经出现过，是重复元素
						})
						let filter = [];
						$.each(r, function (j, c) {
							let aa = {}
							aa.text = c;
							aa.value = c;
							filter[j] = aa
						})
						this.cameraFiltersData = filter;//设置过滤数据
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading2 = false;  // 关闭loading
                })
			},
			/**
			 *  @function: 加载通道数据--新增修改摄像头专用
			 *  @author: lxr
			 *  @date 2018-09-20
			 **/
			getAisleData(placeId){
				let params = {
					count: true,
					page_index: 1,
					page_size: 10000,
					search: {
						placeId: placeId,// 全部场所
					}
				}
				this.$api.Rules.selectInoutList(params).then( res => {
					// console.log('根据楼宇查询通道设备数据1', res)
					if (res.data.code == 600 ||　res.data.code == 0) {
						this.allAisleData = res.data.data.records;
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
			resizeLayout(){
				setTimeout(()=> {
					let icH = $('.index > .m-cen').height();
					let stH = $('.index .set-top').height();
					let ttH = $('.buildings-devices > .m-top').height();
					let obH = $('.buildings-devices .m-cen .title').height();
					let pbH = $('.pagination-box').height();
					let tblH = icH - stH - ttH - obH - 25;
					// console.log(66,icH , stH , ttH , obH )
					// $('.buildings-devices .m-cen .content').height(tblH)
					let tblH2 = icH - $('.buildings-devices .title').height() - ttH
						- $('.buildings-devices > .m-cen').height() - stH - 40;
					$('.buildings-devices .m-bom .table-box').height(tblH2)
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
			 *  @function: 输入内容验----form外
			 *  @author: cs
			 *  @date 2018-09-06
			 */
			formOutTest(value,funcName) {
				/**
				 * value:要验证的内容
				 * funcName:验证的方法名
				 */
				//验证内容
				let state = false;
				if (value) {
					state = this[funcName](value, '',1,1);
				} else {
					state = false;
				}
				return state;
			},
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
			this.resizeInputWidth();//重定义input宽
			this.loadBuildData();//获取楼宇数据
			this.loadAisleData();//获取通道数据
			this.loadCameraData();//获取摄像头数据
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .buildings-devices {
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
        .m-top{
            width:100%;
            height:auto;
            background:#fff;
            margin-bottom: 15px;
            .title{
            }
            .content{
                max-height: 100px;
                min-height: 50px;
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
        .m-cen{
            width:100%;
            height:auto;
            background:#fff;
            .title{
                border-bottom: 1px solid #e1e1e1;
            }
            > .content{
                height: 30vh;
                .el-table{
                    border-top: 0;
                    border-left: 0;
                }
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
            }
            .aisle-dialog{
                /deep/ .el-dialog--center .el-dialog__body{
                    padding-bottom: 0;
                }
            }
            .sch-system-dialog{
                /*  .el-form-item{
                      width:100%;
                      text-align: left;
                      position: relative;
                      padding-left: 2%;
                      padding-right: 3%;
                      margin-bottom: 0!important;
                      /deep/ .el-radio-group{
                          .el-radio{
                              display: inline-block;
                          }
                      }
                      .el-table{
                          width:800px;
                      }
                  }*/
                /deep/ .el-table thead th{
                    height: 35px;
                    font-size: 12px;
                }
                .c-top{
                    padding-left: 50px;
                    position: relative;
                    &:before{
                        content: '';
                        position: absolute;
                        left: 25px;
                        width: 2px;
                        height: 75%;
                        margin: 50px 0;
                        border-left: 1px dashed #1cab7d;
                    }
                    .ct-title{
                        position: relative;
                        margin-bottom: 10px;
                        line-height: 35px;
                        &:before{
                            content: '1';
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
                    .ct-table{
                    }
                    .pagination-box{
                        border: 1px solid #EBEEF5;
                        border-top: 0;
                        height:50px;
                        > div{
                            padding-top: 10px;
                        }
                    }
                }
                .c-bom{
                    padding-left: 50px;
                    .cb-title{
                        position: relative;
                        line-height: 35px;
                        &:before{
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
                    .cb-radio{
                        .el-radio+.el-radio{
                            margin-left: 0;
                        }
                        /deep/ .el-radio{
                            margin-right: 15px;
                            line-height: 30px;
                            color: #333;
                            .el-radio__inner:after{
                                width: 6px;
                                height: 6px;
                            }
                        }
                    }
                }
                .content{
                    .dev-select-info{
                        display: inline-block;
                        span{
                            padding: 0 10px;
                            &:nth-of-type(1){
                                padding-left: 0;
                            }
                        }
                    }
                    /deep/ .button-div{
                        button{
                            padding: 0 10px;
                        }
                    }
                }
                .content2{
                    .c-top{
                        padding-left: 0;
                        .ct-title{
                            &:before{
                                display: none;
                            }
                        }
                        &:before{
                            display: none;
                        }
                    }
                }
                /deep/ .el-dialog__header{
                    .dialog-title{
                        width: 70%;
                        display: inline-block;
                        li{
                            color: #BABABA;
                            font-weight: bold;
                            font-size: 20px;
                            width: 50%;
                            float: left;
                            span{
                                padding: 5px;
                                cursor: pointer;
                            }
                            &.act-li{
                                span{
                                    color: #1cab7d;
                                    border-bottom: 3px solid #1cab7d;
                                }
                            }
                        }
                    }
                }
                /deep/ .el-radio-group{
                    line-height: 40px;
                    position: relative;
                    .el-radio{
                        display: inline-block;
                    }
                }
                /deep/ .el-dialog__footer{
                    .dialog-footer{
                        margin:0 auto;
                        text-align: center;
                        .button-div{
                            clear: both;
                            float:none;
                            margin-right: 20px;
                        }
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
        }
        .m-bom{
            margin-top: 15px;
            background: #fff;
            .title{
                border-bottom: 1px solid #e1e1e1;
            }
            .table-box{
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
            .camara-dialog{
                /deep/ .el-dialog--center .el-dialog__body{
                    padding-bottom: 0;
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
        .sch-system-dialog{
            /deep/ .el-dialog--center .el-dialog__body{
                text-align: left;
            }
        }
    }
</style>
