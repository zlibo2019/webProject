<template>
    <div class="student-access">
        <div class="stu-left">
            <div class="title">部门和学生选择</div>
            <div class="content">
                <!--<el-tree :data="treeData" show-checkbox node-key="id" :props="defaultProps"></el-tree>-->
                <el-tree :data="treeData" ref="tree" show-checkbox node-key="id" default-expand-all
                         :expand-on-click-node="false" @check="getCheckedKeys">
                </el-tree>
            </div>
        </div>
        <div class="stu-right">
            <div class="title">
                学生进出权限
                <div class="Button1">
                    <Button title="规则授权" btnClass="custom7" :data="btn1Data" btnFontSize="12px" 
                            @click="addRule" :iconLeft="true" v-if="roleActions.indexOf('进出规则_@bepf@devPlace@getRuleList_update_own') != -1"></Button>
                    <Button title="导入/导出" btnClass="custom7" :data="btn2Data" btnFontSize="12px" 
                            @click="exportExcel" :iconLeft="true" v-if="0"></Button><!--二期把导入/导出功能屏蔽掉-->
                    <Button title="批量删除" btnClass="custom7" :data="btn3Data" btnFontSize="12px" 
                            @click="batchDelete" :iconLeft="true" v-if="roleActions.indexOf('进出规则_@bepf@devPlace@getRuleList_update_own') != -1"></Button>
                </div>
            </div>
            <div class="content">
                <el-table id="table" ref="aisleTable" height="100%" :data="rightsData" tooltip-effect="dark" border
                          highlight-current-row style="width: 100%" row-key="deviceinfo_id" @row-click="aisleRowClick"
                          @filter-change="handleFilterChange" @selection-change="handleSelectionChange"
                          v-loading="tableLoading"><!-- v-if="roleActions.indexOf('进出规则_@bepf@devPlace@getInoutUser_read_own') != -1"-->
                    <el-table-column type="selection" width="55" align="center"></el-table-column>
                    <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column><!-- customName -->
                    <el-table-column prop="ruleName" :label="rulesName.length>6?rulesName.substring(0,6)+'...':rulesName" width="155"
                                     column-key="ruleName" show-overflow-tooltip :filters=filtersData
                                     :filter-multiple="false"
                                     :filter-method="filterTag" filter-placement="bottom-end"></el-table-column>
                    <el-table-column prop="placeName" label="场所名称" align="center"
                                     column-key="placeName" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="channelName" label="通道名称" align="center"
                                     column-key="channelName" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="studentName" label="姓名" align="center"
                                     column-key="studentName" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="userNo" label="学号" align="center"
                                     column-key="userNo" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="className" label="班级" align="center"
                                     column-key="className" show-overflow-tooltip></el-table-column>
                    <el-table-column fixed="right" label="操作" width="100" align="center">
                        <template slot-scope="scope">
                            <el-button class="warning" size="mini" plain @click="rowDelete(scope.row)"
                                       v-if="roleActions.indexOf('进出规则_@bepf@devPlace@getRuleList_update_own') != -1">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog title="规则授权" :visible.sync="addRuleDialog" width="900px" center class="sch-system-dialog">
                <div class="content">
                    <el-form ref="rightsForm" label-width="80px" :model="rightsForm" :rules="rightsFormRules">
                        <el-form-item label="规则名称" prop="ruleName">
                            <el-select v-model="rightsForm.ruleName" size="small" placeholder="请选择规则名称"
                                       @change="selectClick">
                                <el-option v-for="item in rules" :key="item.id" :label="item.ruleName"
                                           :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="授权通道">
                            <div class="search-box">
                                <!-- <span v-model="rightsForm.listPlaces"></span> -->
                                <el-input v-model="mySearch" size="small" placeholder="请输入通道名称" @change="getDevBind">
                                    <i slot="suffix" class="el-input__icon el-icon-search" @click="getDevBind"></i>
                                </el-input> 
                            </div>
                            <div class="table-div">
                                <el-table ref="deviceTable" :data="deviceData" tooltip-effect="dark"
                                          @row-click="rowClick" border
                                          style="width: 100%;" height="120" @selection-change="handleChannelChange">
                                    <el-table-column type="selection" width="55" fixed></el-table-column><!-- :selectable="checkboxTable"-->
                                    <el-table-column prop="channelName" label="通道名称" show-overflow-tooltip
                                                     align="center"></el-table-column>
                                    <el-table-column prop="placeName" label="楼宇名称" show-overflow-tooltip
                                                     align="center"></el-table-column>
                                </el-table>
                            </div>
                            <dd v-show="channelShow">请选择授权通道</dd>
                        </el-form-item>
                        <el-form-item label="授权学生">
                            <div class="transfer-div">
                                <tree-transfer :from_data="fromData" :user_data="rightsForm.listUsers" @showSelected="getSelected"
                                                @checkedClick="checkedClick"></tree-transfer><!--  v-if="addRuleDialog"-->
                            </div>
                            <dd v-show="userShow">请选择授权学生</dd>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
                            @click="addRuleDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
                            @click="saveRightsForm"></Button>
				</span>
            </el-dialog>
            <!--批量导入导出弹窗-->
            <div class="import-export" v-show="importShow">
                <div class="import-t">
                    <Button btnClass="custom8" title="返回" @click="backClick"></Button>
                </div>
                <div class="import-b">
                    <ul class="top-nav">
                        <li v-for="(item,index) in recordData" :key="index" :class="{'ac':index == ac}" @click="navClick(index)">
                            {{item.title}}
                        </li>
                    </ul>
                    <!--导出档案-->
                    <div class="item1" v-show="ac==0">
                        <ul>
                            <li>
                                <div class="item-left">1</div>
                                <dt>选择左侧需导出的学生部门，导出进出权限表</dt>
                                <Button btnClass="custom8" title="导出" @click="exportFile"></Button>
                            </li>
                        </ul>
                    </div>
                    <!--导入档案照片-->
                    <div class="item1" v-show="ac==1">
                        <ul>
                            <li>
                                <div class="item-left">1</div>
                                <dt>下载授权模板，批量填写授权学生信息。</dt>
                                <Button btnClass="custom8" title="下载"></Button>
                            </li>
                            <li>
                                <div class="item-left">3</div>
                                <dt>上传填写好的授权学生表</dt>
                                <form class="up-load">
                                    <Button btnClass="custom8" title="选择文件" @click="compressLoad"></Button>
                                    <span class="file-text">{{compressText}}</span>
                                    <!--<input id="f_file" type='text' v-model="fileText">-->
                                    <input name="upload" type="file" style="opacity:0;" id="c_file"
                                           @change="uploadFile($event,'compress')" hidefocus>
                                </form>
                            </li>
                        </ul>
                        <Button class="uploadBtn" btnClass="custom10" title="上传" @click="compressUpload"></Button>
                    </div>
                </div>
            </div>
            <div class="pagination-box">
                <el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
                               :current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import treeTransfer from '@/components/Transfer/transfer-extend'
	import Toast from '@/components/Toast/Toast'
	import { Loading } from 'element-ui';

	export default {
		name: 'StudentAccess',
		components: {
			Button, treeTransfer, Toast
		},
		data() {
			let channelValidate = (rule, value, callback) => {   //授权通道校验
				if (value.length == 0) {
					callback(new Error('请选择授权通道'));
				}
				callback();
			};
			let userValidate = (rule, value, callback) => {   //授权学生校验
				if (value.length == 0) {
					callback(new Error('请选择授权学生'));
				}
				callback();
			};
			return {
				btn1Data: {
					iconL: require('../../../assets/images/add.png'),
					iconLAct: require('../../../assets/images/add.png')
				},
				btn2Data: {
					iconL: require('../../../assets/images/export.png'),
					iconLAct: require('../../../assets/images/export.png')
				},
				btn3Data: {
					iconL: require('../../../assets/images/del.png'),
					iconLAct: require('../../../assets/images/del.png')
				},
				btn4Data: {
					iconL: require('../../../assets/images/roll.png'),
					iconLAct: require('../../../assets/images/roll.png')
				},
				treeData: [
					{
						id: 1,
						label: '威尔高中',
						children: [{
							id: 4,
							label: '2018级',
							children: [{
								id: 9,
								label: '高一班'
							}, {
								id: 10,
								label: '高二班'
							}]
						}]
					},
					{
						id: 2,
						label: '一级 2',
						children: [{
							id: 5,
							label: '二级 2-1'
						}, {
							id: 6,
							label: '二级 2-2'
						}]
					},
					{
						id: 3,
						label: '一级 3',
						children: [{
							id: 7,
							label: '二级 3-1'
						}, {
							id: 8,
							label: '二级 3-2'
						}]
					}
				],
				treeData: [],
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				rightsData: [
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '走读生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '走读生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '走读生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '住校生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
					{
						rule: '走读生规则',
						place: '校大门',
						aisle: '通道一',
						student_name: '王小二',
						student_number: '20180816',
						student_class: '2018级8班'
					},
				],            //学生权限数组
				rightsData: [],
				mySearch: '',    //模糊查询
				rightsForm: {   //添加通道form
					ruleName: '',
					listPlaces: [],          //选中的规则数组,传给后台的参数
					listUsers: [],          //选中的学生数组,传给后台的参数
				},
				rightsFormRules: {            // 通道设备规则
					ruleName: [{required: true, message: '请选择楼宇', trigger: 'change'}],
//					listPlaces: [{required: true, validator: channelValidate}],
//					listUsers: [{required: true, validator: userValidate}],
				},
				deviceData: [
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						bind_state: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						bind_state: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						bind_state: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						bind_state: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						bind_state: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						bind_state: '未绑定',
					},
					{
						device_number: 20081868,
						device_name: '呼哈',
						device_IP: '192.168.1.2',
						device_settings: 20081868,
						bind_state: '未绑定',
					},
				],
				deviceData: [],     // 清空
				fromData: [      // 穿梭框 - 源数据 - 树形
					{
						id: "1",
						pid: 0,
						lv: 0,
						label: "威尔大学东校区",
						disabled: 0,
						children: [
							{
								id: "1-1",
								pid: "1",
								lv: 1,
								label: "2018级",
								disabled: 0,
								children: [
									{
										id: "1-1-1",
										pid: "1-1",
										lv: 2,
										disabled: 0,
										children: [
											{
												id: "1-1-1-1",
												pid: "1-1-1",
												lv: 3,
												children: [],
												disabled: 1,
												label: "游勇"
											},
											{
												id: "1-1-1-2",
												pid: "1-1-1",
												lv: 3,
												children: [],
												disabled: 1,
												label: "宫鑫"
											},
											{
												id: "1-1-1-3",
												pid: "1-1-1",
												lv: 3,
												children: [],
												disabled: 1,
												label: "钱进"
											},
											{
												id: "1-1-1-4",
												pid: "1-1-1",
												lv: 3,
												children: [],
												disabled: 0,
												label: "尹两"
											},
										],
										label: "2018级1班"
									},
									{
										id: "1-1-2",
										pid: "1-1",
										lv: 2,
										disabled: 0,
										children: [
											{
												id: "1-1-2-1",
												pid: "1-1-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "南宫霸天"
											},
											{
												id: "1-1-2-2",
												pid: "1-1-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "欧阳雷电"
											},
											{
												id: "1-1-2-3",
												pid: "1-1-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "慕容风云"
											},
											{
												id: "1-1-2-4",
												pid: "1-1-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "西门惊鸿"
											},
										],
										label: "2018级2班"
									},
									{
										id: "1-1-3",
										pid: "1-1",
										lv: 2,
										children: [
											{
												id: "1-1-3-1",
												pid: "1-1-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "李小露"
											},
											{
												id: "1-1-3-2",
												pid: "1-1-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "司马飞刀"
											},
											{
												id: "1-1-3-3",
												pid: "1-1-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "张三"
											},
											{
												id: "1-1-3-4",
												pid: "1-1-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "李四"
											},
										],
										disabled: 0,
										label: "2018级3班"
									},
									{
										id: "1-1-4",
										pid: "1-1",
										lv: 2,
										children: [
											{
												id: "1-1-4-1",
												pid: "1-1-4",
												lv: 3,
												children: [],
												disabled: 0,
												label: "王五"
											},
											{
												id: "1-1-4-2",
												pid: "1-1-4",
												lv: 3,
												children: [],
												disabled: 0,
												label: "赵六"
											},
											{
												id: "1-1-4-3",
												pid: "1-1-4",
												lv: 3,
												children: [],
												disabled: 0,
												label: "刘七"
											},
											{
												id: "1-1-4-4",
												pid: "1-1-4",
												lv: 3,
												children: [],
												disabled: 0,
												label: "丁八"
											},
										],
										disabled: 0,
										label: "2018级4班"
									}
								]
							},
							{
								id: "1-2",
								pid: "1",
								lv: 1,
								label: "2017级",
								disabled: 0,
								children: [
									{
										id: "1-2-1",
										pid: "1-2",
										lv: 2,
										children: [
											{
												id: "1-2-1-1",
												pid: "1-2-1",
												lv: 3,
												children: [],
												disabled: 0,
												label: "唐九"
											},
											{
												id: "1-2-1-2",
												pid: "1-2-1",
												lv: 3,
												children: [],
												disabled: 0,
												label: "凌零"
											},
											{
												id: "1-2-1-3",
												pid: "1-2-1",
												lv: 3,
												children: [],
												disabled: 0,
												label: "柳卅"
											},
											{
												id: "1-2-1-4",
												pid: "1-2-1",
												lv: 3,
												children: [],
												disabled: 0,
												label: "尉迟卌"
											},
											{
												id: "1-2-1-5",
												pid: "1-2-1",
												lv: 3,
												children: [],
												disabled: 0,
												label: "王二小"
											},
										],
										disabled: 0,
										label: "2017级1班"
									},
									{
										id: "1-2-2",
										pid: "1-2",
										lv: 2,
										children: [
											{
												id: "1-2-2-1",
												pid: "1-2-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "李瑞"
											},
											{
												id: "1-2-2-2",
												pid: "1-2-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "凌天"
											},
											{
												id: "1-2-2-3",
												pid: "1-2-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "柳楷"
											},
											{
												id: "1-2-2-4",
												pid: "1-2-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "陈辰"
											},
											{
												id: "1-2-2-5",
												pid: "1-2-2",
												lv: 3,
												children: [],
												disabled: 0,
												label: "车丽"
											},
										],
										disabled: 0,
										label: "2017级2班"
									},
									{
										id: "1-2-3",
										pid: "1-2",
										lv: 2,
										children: [
											{
												id: "1-2-3-1",
												pid: "1-2-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "李闯"
											},
											{
												id: "1-2-3-2",
												pid: "1-2-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "严谨"
											},
											{
												id: "1-2-3-3",
												pid: "1-2-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "包池"
											},
											{
												id: "1-2-3-4",
												pid: "1-2-3",
												lv: 3,
												children: [],
												disabled: 0,
												label: "游勇"
											},
										],
										disabled: 0,
										label: "2017级3班"
									}
								]
							}
						]
					},
					{
						id: "2",
						pid: 0,
						lv: 0,
						label: "威尔大学南校区",
						disabled: 0,
						children: [
							{
								id: "2-1",
								pid: "2",
								lv: 1,
								children: [],
								disabled: 0,
								label: "二级 2-1"
							},
							{
								id: "2-2",
								lv: 1,
								pid: "2",
								label: "二级 2-2",
								disabled: 0,
								children: [
									{
										id: "2-2-1",
										pid: "2-2",
										lv: 2,
										children: [],
										disabled: 0,
										label: "二级 2-2-1"
									},
									{
										id: "2-2-2",
										pid: "2-2",
										lv: 2,
										children: [],
										disabled: 0,
										label: "二级 2-2-2"
									}
								]
							}
						]
					},
					{
						id: "3",
						pid: 0,
						lv: 0,
						label: "威尔大学西校区",
						disabled: 0,
						children: [
							{
								id: "3-1",
								pid: "3",
								lv: 1,
								disabled: 0,
								children: [
									{
										id: "6-6-6",
										lv: 2,
										pid: "3-1",
										children: [],
										disabled: 0,
										label: "三级 6-6-6"
									},
									{
										id: "6-6-7",
										lv: 2,
										pid: "3-1",
										children: [],
										disabled: 0,
										label: "三级 6-6-7"
									}
								],
								label: "二级 3-1"
							},
							{
								id: "3-2",
								lv: 1,
								pid: "3",
								children: [],
								disabled: 0,
								label: "二级 3-2"
							}
						]
					},
					{
						id: "4",
						pid: 0,
						lv: 0,
						label: "威尔大学北校区",
						disabled: 0,
						children: [
							{
								id: "4-1",
								lv: 1,
								pid: "4",
								children: [],
								disabled: 0,
								label: "二级 4-1"
							},
							{
								id: "4-2",
								lv: 1,
								pid: "4",
								children: [],
								disabled: 0,
								label: "二级 4-2"
							}
						]
					}
				],
				fromData: [],   // 清空
				tableData: [],      // 穿梭框 - 目标数据 - 右侧表格
				student: [],
				showIndex: false,
				tableLoading: false,        //表格加载动画
				allNum: 0,                  //分页总条数
				currentPage: 1,               //当前页（默认设为第一页）
				pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
				rules: [                      //规则授权数组
					{
						value: '1',
						label: '大门走读规则'
					}, {
						value: '2',
						label: '大门住宿规则'
					}, {
						value: '3',
						label: '阅读室规则'
					}, {
						value: '4',
						label: '宿舍楼规则'
					}
				],
                rules:[],       //规则列表
				spanArr: [],                //跨行数据
				importShow: false,//批量输入输出显示
				recordData: [
					{
						title: '导入授权名单',
						value: 1
					},
					{
						title: '导出授权名单',
						value: 2
					}
				],
				ac: 0,//批量导入导出选项卡
				compressText: '未上传任何文件',
				filtersData: [
//					{ text: '住校生规则', value: '住校生规则' },
//                    { text: '走读生规则', value: '走读生规则' }
				],
				ruleSelection: [],   //选中的规则数组
				ChannelSelection: [],   //选中的通道数组
				isToast: false,
				toast: '',
				addRuleDialog: false,   //规则授权弹窗默认不显示
				selectRuleId: -1,        //选择的规则的id

				classIds: '',          //选中的班级id数组,转成字符串,传给后台的参数
				curRule: '',          //当前选择的规则,传给后台的参数
				pkValue: '',          //当前选择的要删除的规则数组,传给后台的参数
				channelShow: false, //授权通道验证信息
				userShow: false,    //学生授权验证信息
				rulesName: '全部规则',//筛选规则名称展示
			}
		},
		methods: {
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
			 *  @function: 加载树形组织结构列表
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			loadStructure() {
				let params = {
					schoolId: localStorage.getItem('schoolId')
				}
                this.$api.Common.getTreeListStudent(params).then(res => {
					// console.log('加载树形组织结构列表', res)
					if (res.data.code == 600) {
						this.treeData = res.data.data;
//						this.resizeInputWidth()
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载树形组织结构列表
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			getCheckedKeys() {
				let strs = JSON.stringify(this.$refs.tree.getCheckedKeys(true));
				this.classIds = strs.substring(1, strs.length - 1)
				// console.log(333333333333333, this.classIds);//设成true就可只选班级，否则会将上级的id也放到数组中
				this.changePage();
			},
			/**
			 *  @function: 加载规则列表
			 *  @author: wzx
			 *  @date 2018-9-14
			 **/
			getRules() {
				let schoolId = localStorage.getItem('schoolId');
                this.$api.Rules.getRuleList({schoolId:schoolId}).then(res => {
					// console.log('加载规则列表', res)
					if (res.data.code == 600) {
						this.rules = res.data.data;
						this.filtersData = [
							{
								'text': "全部规则",
								'value': "全部规则"
							}
						];
						for (let i = 0; i < this.rules.length; i++) {
							this.filtersData.push(
								{
									'text': this.rules[i].ruleName,
									'value': this.rules[i].ruleName
								}
							)
						}
//						this.resizeInputWidth()
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载授权通道
			 *  @author: wzx
			 *  @date 2018-9-14
			 **/
			getDevBind() {
                this.$api.Rules.getDevBind({
					schoolId:localStorage.getItem('schoolId'),
					ruleId:this.selectRuleId,
					likeStr:this.mySearch,
					page_size:500,
					page_index:1
				}).then(res => {
					// console.log('加载授权通道', res)
					if (res.data.code == 600) {
						this.deviceData = res.data.data.records;
						this.ChannelSelection = [];
                        // 授权通道选中已授权
						if (this.deviceData) {
							this.deviceData.forEach(row => {
								if(row.state > 0){ // 已授权
									setTimeout(()=>{
										this.$refs.deviceTable.toggleRowSelection(row);
									})
								}
							});
						}
						// console.log('选中的通道',this.ChannelSelection)
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载授权学生组织架构
			 *  @author: wzx
			 *  @date 2018-9-14
			 **/
			getClassUser() {
				let params = {
					schoolId: localStorage.getItem('schoolId'),
                    ruleId:this.selectRuleId,
				}
				this.$api.Common.getStudentList(params).then(res =>{
					// console.log('加载树形组织结构列表2222', res)
					if (res.data.code == 600) {
						this.fromData = res.data.data;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载已授权学生列表
			 *  @author: wzx
			 *  @date 2018-9-21
			 **/
			getRuleUsers() {
				let params = {
					schoolId: localStorage.getItem('schoolId'),
                    ruleId:this.selectRuleId,
				}
                this.$api.Rules.getRuleUsers(params).then(res => {
					console.log('加载已授权学生列表', res)
					if (res.data.code == 600) {
						this.rightsForm.listUsers= res.data.data;
						this.rightsForm.listUsers.forEach((item)=>{
							item.id = item.studentId;
							// console.log(item.id )
                        })

					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 页面初始化加载表格方法
			 *  @author: wzx
			 *  @date 2018-9-1
			 **/
			changePage() {
				let params = {
					"count": true,
//	                "orderBy": "userNo asc",
					"page_index": this.currentPage,             //页码
					"page_size": this.pageItem,              //每页条数
					"search": {
						"schoolId": parseInt(localStorage.getItem('schoolId')),        //所在学校的id
						"classIds": this.classIds,        //选择的班级的id--数组转为字符串
						"ruleName": this.curRule,        //选择的规则名称
					}
				}
				this.tableLoading = true;
                this.$api.Rules.getInoutUser(params).then(res => {
					// console.log('22222222', res)
					this.tableLoading = false;
					if (res.data.code == 600) {
						this.rightsData = res.data.data.records;
						this.rightsData.forEach((item)=>{
							item.customName = '全部规则';
						})
						// console.log("this.rightsData,",this.rightsData)
						this.allNum = res.data.data.total_record;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
                })
			},
			/**
			 *  @function: 表格中的规则删除按钮
			 *  @author: wzx
			 *  @date 2018-7-21
			 **/
			rowDelete(row) {
				// console.log("删除规则", row)
				this.pkValue = row.id + "," + row.channelId;
				// console.log(66,this.pkValue)
				this.$confirm('此操作将永久删除, 是否继续?', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					Loading.service();
                	this.$api.Rules.deleteRuleUser({pkValue:this.pkValue}).then(res => {
						// console.log('123123123123', res)
						Loading.service().close();
						this.tableLoading = false;
						if (res.data.code == 600) {
							this.$message({type: 'success', message: '删除成功!'});//请求删除成功之后提示
							this.changePage();
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
			 *  @function: 规则授权按钮
			 *  @author: lxr
			 *  @date 2018-7-21
			 **/
			selectClick(id) {
//				this.onRange = -1;
				let obj = {};
				obj = this.rules.find((item) => {//这里的deviceType就是上面遍历的数据源
					return item.id === id;//筛选出匹配数据
				});
				this.selectRuleId = id;
				this.rightsForm.rule = obj.ruleName
				// console.log(888, id, this.rightsForm.rule)
				this.getClassUser();// 加载学生组织树-（增改页面）
				this.getDevBind();  // 加载授权通道-（增改页面）
				this.getRuleUsers ();  // 加载已授权学生列表-（增改页面）

			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: wzx
			 *  @date 2018-08-31
			 */
			getSelected(data) {
				// console.log('888999666',data,this.rightsForm.listUsers.length)
				this.userShow = false;
//				return
				for(let i = 0;i<data.length;i++){
					this.rightsForm.listUsers.push(
						{
							'classId': data[i].pid,
							'className': data[i].className,
							'studentId': data[i].id,
							'id': data[i].id,
							'studentName': data[i].label,
							'userNo': data[i].userNo
						}
					)
				}

				let length = this.rightsForm.listUsers.length;
				if(length == 1) return
				// console.log(444,length)
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.rightsForm.listUsers[k].id == this.rightsForm.listUsers[i].id){
							// console.log(11111111111111)
							this.rightsForm.listUsers.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data.length, this.rightsForm.listUsers.length)
			},
			/**
			 *  @function: table 列表搜索筛选
			 *  @author: wzx
			 *  @date 2018-08-31
			 */
			checkedClick(data){
				// console.log('data111',data)
				this.userShow = false;
				this.rightsForm.listUsers.push(
					{
						'classId': data.pid,
						'className': data.className,
						'studentId': data.id,
						'id': data.id,
						'studentName': data.value,
						'userNo': data.userNo
					}
				)
				let length = this.rightsForm.listUsers.length;
				if(length == 1) return
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.rightsForm.listUsers[k].id == this.rightsForm.listUsers[i].id){
							this.rightsForm.listUsers.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data, this.rightsForm.listUsers)

			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: wzx
			 *  @date 2018-08-31
			 */
			filterTag(value, row) {
				// console.log("列表点击筛选", row, value);
				if(value == "全部规则"){
					return  row.customName;
				}else{
					return row.ruleName === value;
				}
				
			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: wzx
			 *  @date 2018-09-13
			 */
			handleFilterChange(filters) {
				// console.log('筛选条件变化', filters,filters.ruleName[0]);      //2018.9.14
				if(filters.ruleName.length == 0){
					this.rulesName = "全部规则";
				}else if(filters.ruleName == "全部规则"){
					this.rulesName = filters.ruleName[0];
					this.curRule = '';
				}else{
					this.rulesName = filters.ruleName[0];
					this.curRule = filters.ruleName[0];
				}
				// console.log("this.rulesName :",this.rulesName )
				this.currentPage = 1;
				this.changePage();
			},
			/**
			 *  @function添加通道按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			addRule() {
				// console.log(111,this.rightsForm)
				this.addRuleDialog = true;
				this.rightsForm = {
					listPlaces: [],
					listUsers: [],
					ruleName: ""
				}
				this.deviceData = [];
				this.channelShow = false;
				this.userShow = false;
				this.selectRuleId = '';
				this.mySearch = ''; // 清空查询条件
				this.fromData = []

				setTimeout(() => {
					this.$refs['rightsForm'].resetFields();
					let pH = $(document).height();
					let sdH = $('.sch-system-dialog .el-dialog').height();
					let dtop = ( pH - sdH ) / 2;
					// console.log(6666, pH, sdH, dtop)
					$('.sch-system-dialog .el-dialog--center').css('margin-top', dtop)
					this.$refs.deviceTable.clearSelection();         //清除通道的选中状态
//					this.getClassUser();// 加载学生组织树-（增改页面）
				}, 10)
			},
			/**
			 *  @function导入导出按钮
			 *  @author: wzx
			 *  @date 2018-7-21
			 **/
			exportExcel() {
				// console.log("导入/导出")
				this.importShow = true;
				setTimeout(() => {
					let importHeight = $('.student-access').height() - $('.import-t').height();
					$('.import-b').height(importHeight);
					// console.log(importHeight)
				})
			},
			/**
			 *  @function: 批量导入导出返回
			 *  @author: wzx
			 *  @date 2018-07-25
			 */
			backClick() {
				//批量导入导出返回,清空所输入的信息
				// console.log('批量输入输出返回')
				this.importShow = false;
			},
			/**
			 *  @function: 导出档案
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			exportFile() {
				// console.log("导出授权学生表")
			},
			/**
			 *  @function: 上传压缩文件按钮点击
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			compressLoad() {
				$('#c_file').click()
			},
			/**
			 *  @function: 导入档案照片上传点击
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			compressUpload() {
				// console.log('导入授权学生表上传点击')
			},
			/**
			 *  @function: 批量输入输出选项卡点击
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			navClick(index) {
				this.ac = index;
			},
			/**
			 *  @function批量删除按钮
			 *  @author: wzx
			 *  @date 2018-7-21
			 **/
			batchDelete() {
				// console.log('批量删除')
				if (this.ruleSelection.length == 0) {
					this.$message({
						showClose: true,
						message: "请至少选择一个要删除的规则！",
						type: "warning",
						duration: this.msgDuration
					});
				} else {
               	// console.log(86,this.ruleSelection)
					let pkStr = '';
					for (let i = 0; i < this.ruleSelection.length; i++) {
						pkStr += this.ruleSelection[i].id + ',' + this.ruleSelection[i].channelId + "-"
					}
					pkStr = pkStr.substring(0, pkStr.length - 1);
					this.pkValue = pkStr;
	                console.log(86,pkStr,this.pkValue)
					this.$confirm('此操作将永久删除, 是否继续?', '提示', {
						confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
					}).then(() => {//点击确定按钮进行的操作
						// console.log(86, this.pkValue)
						Loading.service();
                		this.$api.Rules.deleteRuleUser({pkValue:this.pkValue}).then(res => {
							// console.log('123123123123', res)
							Loading.service().close();
							this.tableLoading = false;
							if (res.data.code == 600) {
								this.$message({type: 'success', message: '删除成功!'});//请求删除成功之后提示
								this.changePage();
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
				}
			},
			/**
			 *  @function添加通道功能----保存按钮
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			saveRightsForm() {
				this.$refs['rightsForm'].validate((valid) => {
					if (valid) {
						if (this.rightsForm.listPlaces.length > 0 && this.rightsForm.listUsers.length > 0) {
							// console.log(666666666,this.rightsForm.listPlaces,this.ChannelSelection)
							Loading.service();
							let params = {
								ruleId: this.selectRuleId,
								ruleName: this.rightsForm.rule,
								schoolId: localStorage.getItem('schoolId'),
								schoolName: localStorage.getItem('schoolName'),
								listPlaces: this.rightsForm.listPlaces,
								listUsers: this.rightsForm.listUsers,
							}
                			this.$api.Rules.saveRule(params).then(res => {
								// console.log('222222223333333333', res)
								Loading.service().close();
								if (res.data.code == 600) {
									this.addRuleDialog = false;
									this.changePage();
								} else {
									this.isToast = true;
									this.toast = res.data.msg;
								}
							}).catch(err =>{
								Loading.service().close();
							})
						} else {
							if (this.rightsForm.listPlaces.length == 0) {
								this.channelShow = true;
							} else {
								this.channelShow = false;
							}
							if (this.rightsForm.listUsers.length == 0) {
								this.userShow = true;
							} else {
								this.userShow = false;
							}
						}
					} else {
						// console.log(66222289999, this.rightsForm.listPlaces)
						return false;
					}
				})
			},
			/**
			 *  @function: 搜索(姓名或者学/工号的模糊查询)操作
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			search() {
				// console.log(666)
				this.changePage()
			},
			/**
			 *  @function: 选中权限表格行时选中多选框
			 *  @author: lxr
			 *  @date 2018-09-20
			 **/
			aisleRowClick(row){
				this.$refs.aisleTable.toggleRowSelection(row);
            },
			/**
			 *  @function: 选中新增通道表格的多选框
			 *  @author: lxr
			 *  @date 2018-09-20
			 **/
			checkboxTable(row, index){
                // console.log(`checkboxTable:${JSON.stringify(row)},,,,${index}`)
                if(row.state != 0){ // 多选框是否禁用
	                return 0;//true
                }else {
                	return 1;//false
                }
            },
			/**
			 *  @function: 选中新增中表格行时选中多选框
			 *  @author: lxr
			 *  @date 2018-09-20
			 **/
            rowClick(row){
				// if(row.state == 0){ // 未绑定可进行选择 与:selectable 属性一起使用
                this.$refs.deviceTable.toggleRowSelection(row);
				// }
            },
			/**
			 *  @function选中的表格中的哪些行
			 *  @author: wzx
			 *  @date 2018-4-27
			 **/
			handleSelectionChange(val) {
				this.ruleSelection = val;
				// console.log(6868, this.ruleSelection)
			},
			/**
			 *  @function选中的表格中的哪些通道
			 *  @author: wzx
			 *  @date 2018-9-14
			 **/
			handleChannelChange(val) {
				// console.log('handleChannelChange',val)
				this.ChannelSelection = val;
				// this.rightsForm.listPlaces = [];
                let pustObj = {};   // 定义传给后台的格式
                let pustArr = [];   // 定义最终数组
                $.each(val, (i, row)=>{
	                pustObj = {
		                'channelId': row.channelId,
		                'channelName': row.channelName,
		                'placeId': row.placeId,
		                'placeName': row.placeName
	                };
	                pustArr.push(pustObj);
                })
                // console.log('pustArr',pustArr);
				this.rightsForm.listPlaces = pustArr;   // 传值
			},
			/**
			 *  @function点击列表中某行的选中事件
			 *  @author: wzx
			 *  @date 2018-4-14
			 **/
			toggleSelection(row) {
				//console.log(666, row.deviceinfo_id, selected)
				this.$refs.aisleTable.toggleRowSelection(row);
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
		},
		created() {
			this.loadStructure();
			this.changePage();
//			this.getRules();
			this.allNum = this.rightsData.length;
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			setTimeout(() => {
				let icH = $('.index > .m-cen').height();
				let stH = $('.index .set-top').height();
				let obH = $('.stu-turnover-set .stu-right .title').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - stH - obH - pbH - 10;
				$('.stu-turnover-set .stu-right .content').height(tblH)
				//左侧树状图滚动条
				let importHeight = $('.student-access').height()  - $('.stu-left .title').height();
				// console.log(11,$('.student-access').height()  , $('.stu-left .title').height())
				$('.stu-left .content').height(importHeight);
			}, 20)
			this.getRules();
			
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .student-access {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        display: flex;
        flex-direction: row;
        .stu-left {
            flex-basis: 240px;
			height: 100%;
            background: #F6F8FA;
            border-right: 1px solid #E4E4E4;
            display: flex;
            flex-direction: column;
            .title {
                flex-basis: 60px;
                line-height: 60px;
                border-bottom: 1px solid #E4E4E4;
                font-weight: bold;
                font-size: 18px;
                padding: 0 0 0 10%;
            }
            .content {
                flex: 1;
				width: 100%;
                height: 100%;
                background: #fff;
                overflow-y: auto;
				.el-tree{
					margin: 10px 5%;
				}
            }
        }
        .stu-right {
            flex: 1;
            background: #fff;
            position: relative;
            .title {
                border: 0;
                border-bottom: 1px solid #E4E4E4;
            }
            > .content {
                .el-table {
                    border: 0;
				}
				/deep/ .is-leaf:not(.is-center){
					padding: 0 10px;
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
            .import-export {
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background-color: #fff;
                z-index: 10;
                .import-t {
                    width: 100%;
                    min-height: 5.5vh;
                    line-height: 5.5vh;
                    text-align: left;
                    border-bottom: 1px solid #e1e1e1;
                    .button-div {
                        width: 80px;
                        height: 38px;
                        margin-left: 40px;
                        > div {
                            height: 38px;
                        }
                    }
                }
                .import-b {
                    .top-nav {
                        padding-top: 30px;
                        margin-left: 40px;
                        text-align: center;
                        display: block;
                        &:after {
                            content: ".";
                            clear: both;
                            display: block;
                            height: 0;
                            overflow: hidden;
                            visibility: hidden;
                        }
                        li {
                            height: 4vh;
                            line-height: 4vh;
                            float: left;
                            font-size: 12px;
                            color: #666;
                            min-width: 130px;
                            padding: 0 20px;
                            border: 1px solid #e1e1e1;
                            cursor: pointer;
                            -webkit-transition: 0.2s;
                            -moz-transition: 0.2s;
                            -ms-transition: 0.2s;
                            -o-transition: 0.2s;
                            transition: 0.2s;
                            &:hover {
                                background-color: #f2f2f2;
                            }
                        }
                        .ac {
                            background-color: #979797;
                            border: 1px solid #979797;
                            color: #fff;
                            &:hover {
                                background-color: #979797;
                                border: 1px solid #979797;
                                color: #fff;
                            }
                        }
                    }

                    .item1 {
                        ul {
                            li {
                                font-size: 12px;
                                height: 3.5vh;
                                position: relative;
                                text-align: left;
                                margin-top: 4vh;
                                margin-left: 40px;
                                &:after {
                                    content: ".";
                                    clear: both;
                                    display: block;
                                    height: 0;
                                    overflow: hidden;
                                    visibility: hidden;
                                }
                                .item-left {
                                    width: 3.5vh;
                                    height: 3.5vh;
                                    line-height: 3.5vh;
                                    border: 1px solid #999;
                                    border-radius: 50%;
                                    color: #A7A7A7;
                                    float: left;
                                    text-align: center;
                                    position: relative;
                                    &:before {
                                        content: "";
                                        position: absolute;
                                        left: 0;
                                        right: 0;
                                        margin: auto;
                                        width: 0;
                                        height: 3vh;
                                        top: 4vh;
                                        border-left: 1px dashed #999;
                                    }
                                }
                                &:nth-last-child(1) {
                                    .item-left {
                                        &:before {
                                            display: none;
                                        }
                                    }
                                }
                                dt {
                                    line-height: 3.5vh;
                                    color: #666;
                                    text-align: left;
                                    float: left;
                                    margin-left: 15px;
                                }
                                .margin-comp {
                                    margin-right: 30px;
                                }
                                .file-text {
                                    color: #B7B7B7;
                                    text-align: left;
                                    margin-left: 15px;
                                    vertical-align: bottom;
                                    font-size: 12px;
                                }
                                .el-radio {
                                    line-height: 3.5vh;
                                }
                                .pwd {
                                    border: 1px solid #e1e1e1;
                                    outline: none;
                                    height: 30px;
                                    line-height: 30px;
                                    margin-left: 15px;
                                    margin-right: 15px;
                                    color: #999;
                                    padding: 0 10px;
                                    width: 140px;
                                    border-radius: 5px;
                                    &:focus {
                                        border: 1px solid #1cab7d;
                                        outline: none;
                                    }
                                }
                                .pwd-state {
                                    font-size: 12px;
                                    color: #999;
                                }
                                .button-div {
                                    height: 30px !important;
                                    margin-left: 20px;
                                    .button {
                                        height: 30px;
                                        padding: 0 10px;
                                        span {
                                            display: inline;
                                        }
                                    }
                                }
                            }
                        }
                        .uploadBtn {
                            top: 60px;
                            left: 50%;
                        }
                    }
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
            .Button1, .Button2 {
                display: inline-block;
                float: right;
                margin-right: 10px;
            }
            .button-div {
                /deep/ .button {
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
