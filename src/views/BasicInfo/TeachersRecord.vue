<template>
    <div class="teachers-record">
        <div class="center">
            <!--部门和教师选择-->
            <div class="left">
                <div class="top">部门和教师选择</div>
                <div class="bot">
                    <div class="inner">
                        <el-tree
                                :data="treeData" 
                                ref="tree"
                                show-checkbox
                                node-key="id"
                                default-expand-all
                                :expand-on-click-node="false"
                                @check="getCheckedKeys">
                            <div class="custom-tree-node" slot-scope="{ node, data }">
                                <input type="text" :value="data.label"  :class="['span','input'+data.id]" disabled  @blur="blurClick(data,treeInputVal)">
                                <ul class="hover-show" slot="reference">
                                    <!--<li v-for="(item,index) in imgData" :key="index"
                                        @click="treeClick(item.value,node, data,$event)">
                                        <img :src="item.imgNo" :alt="item.title" :title="item.title" class="img-no">
                                        <img :src="item.imgAc" :alt="item.title" :title="item.title" class="img-ac">
                                    </li>-->
                                    <li @click="treeClick(1,node, data,$event)" v-show="iconShow && roleActions.indexOf('组织架构_@bepf@dept@add_create_own') > -1">
                                        <img src="../../assets/images/add_no.png" alt="新增" title="新增" class="img-no">
                                        <img src="../../assets/images/add_ac.png" alt="新增班级" title="新增" class="img-ac">
                                    </li>
                                    <li @click="treeClick(2,node, data,$event)" v-show="iconShow && data.group != 101 && roleActions.indexOf('组织架构_@bepf@dept@delete_update_own') > -1">
                                        <img src="../../assets/images/del_no.png" alt="删除" title="删除" class="img-no">
                                        <img src="../../assets/images/del_ac.png" alt="删除" title="删除" class="img-ac">
                                    </li>
                                    <li @click="treeClick(3,node, data,$event)" v-show="iconShow && data.group != 101 && roleActions.indexOf('组织架构_@bepf@dept@modify_update_own') > -1">
                                        <img src="../../assets/images/change_no.png" alt="修改" title="修改" class="img-no">
                                        <img src="../../assets/images/change_ac.png" alt="修改" title="修改" class="img-ac">
                                    </li>
                                </ul>
                            </div>
                        </el-tree>
                        <div class="modal-wrap" v-show="addClassDialog">
                            <div class="modal-add" @click="closeAdd"></div>
                            <div class="add-content">
                                <div class="add-inner">
                                    确定要删除 <span style="color: #1cab7d;">{{addData.label}} </span>么?
                                </div>
                                <button class="btn" @click="closeAdd">取消</button>
                                <button class="btn confirm" @click="confirmAdd(addNode,addData)">确认</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!--列表展示-->
            <div class="right">
                <div class="right-t">
                    <div class="top-l">
                        <dd v-show="teacherShow || listData.length == 0">0位教师</dd>
                        <dd v-show="listData.length>0">{{pageAllNum}}位教师</dd>
                        <btns btnClass="custom6" btnFontSize="12px" title="新增教师" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@add_create_own') > -1" @click="addClick"></btns>
                        <btns btnClass="custom6" btnFontSize="12px" title="批量导入/导出" @click="importClick"></btns>
                        <btns btnClass="custom6" btnFontSize="12px" title="批量调动" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@modifyDep_update_own') > -1" @click="transferClick"></btns>
                        <btns btnClass="custom6" btnFontSize="12px" title="批量离职" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@modify_update_own') > -1" @click="leaveClick"></btns>
                    </div>
                    <div class="top-r">
                        <input type="text" placeholder="请输入工号或姓名" ref="searchRef" v-model="searchVal"
                               @keyup.13="searchClick">
                        <img src="../../assets/images/search.png" alt="搜索" @click="searchClick">
                    </div>
                </div>
                <div class="right-b">
                    <div class="table-box">
                        <el-table
								id="table-id"
                                ref="multipleTable"
                                :data="listData"
                                height=" 100%"
							  	v-loading="tableLoading"
                                tooltip-effect="dark"
                                style="width: 100%;"
								@filter-change="handleFilterChange"
                                @selection-change="handleSelectionChange">
                            <el-table-column type="selection" width="55" align="center"></el-table-column>
                            <el-table-column prop="userNo" label="工号" align="center"></el-table-column>
                            <el-table-column prop="userName" label="姓名" align="center"></el-table-column>
                            <el-table-column prop="userDepname" label="部门" align="center"></el-table-column>
                            <el-table-column prop="userTel" label="联系电话" align="center" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="dicFmtMap" label="全部职位" width="150"
                                             :filters=filtersData
                                             :filter-method="filterTag" filter-placement="bottom-end">
                                <template slot-scope="scope">
                                    <span>{{scope.row.dicFmtMap?scope.row.dicFmtMap.userDutycn:''}}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="className" label="管理班级" align="center"></el-table-column>
                            <el-table-column prop="userPhoto" label="档案照片" align="center">
                                <template slot-scope="props">
                                    <el-popover trigger="hover" placement="bottom" v-if="props.row.userPhoto">
                                        <!--图片路径需要修改-->
                                        <img :src="uploadPicUrl + props.row.userPhoto+'?imageView2/1/w/170'"
										:onerror="defaultErrImg" style="width: auto;max-width: 100px;">
                                        <div slot="reference" class="name-wrapper">
                                            <el-tag size="medium" style="background: none;color:#1cab7d;border:none;">预览
                                            </el-tag>
                                        </div>
                                    </el-popover>
                                    <span v-else>无</span>
                                </template>
                            </el-table-column>
							<el-table-column fixed="right" label="操作" width="250" align="center">
								<template slot-scope="scope">
									<el-button class="normal" size="mini" plain @click="rowClick(scope.row)">修改</el-button>
									<el-button class="normal" size="mini" plain @click="reastPwd(scope.row)" >重置密码</el-button>
									<el-button class="warning" size="mini" plain @click="delAccountClick(scope.row)">删除</el-button>
									<!-- <el-button class="warning" size="mini" plain @click=""
											v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@deleteInoutDev_delete_own') > -1">删除</el-button> -->
								</template>
							</el-table-column>
                            <!-- <el-table-column prop="isBandingApp" label="APP绑定">
                                <template slot-scope="props">
                                    <span v-if="props.row.bindingState == 0">未绑定</span>
                                    <span v-else>已绑定</span>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </div>
                    <div class="pagination">
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :page-size=pageSize
                                :current-page.sync="currentPage"
                                :total="pageAllNum" @current-change="handleCurrentChange">
                        </el-pagination>
                    </div>
                </div>
                <!--批量导入导出弹窗-->
                <div class="import-export" v-show="importShow">
                    <div class="import-t">
                        <btns btnClass="custom8" btnFontSize="12px" title="返回" @click="backClick('import')"></btns>
                    </div>
                    <div class="import-b">
                        <!-- <h5>温馨提醒</h5>
                        <div class="tip">
                            <span>完成教师档案的导入后需设置APP端登录的账号及密码。</span>
                        </div> -->
                        <ul class="top-nav">
                            <li v-for="(item,index) in recordData" :class="{'ac':index == ac}" :key="index" @click="navClick(index)">
                                {{item.title}}
                            </li>
                        </ul>
                        <!--新建档案-->
                        <div class="item1" v-show="ac==0">
                            <ul>
                                <li>
                                    <div class="item-left">1</div>
                                    <dt>下载教师档案模板，批量填写教师档案信息</dt>
									<!-- 汉字版本 -->
                                   	<a href='http://client.weds.com.cn/%E6%95%99%E8%81%8C%E5%B7%A5%E6%A1%A3%E6%A1%88%E6%A8%A1%E6%9D%BF.xlsx'>
									   <!-- 字母版本 -->
                                   	<!-- <a href='http://res-k12.weds.com.cn/jzgd.xlsx'> -->
									   <!-- 接口方式 -->
                                   	<!-- <a :href='this.serverUrl+"userInfo/download"'> -->
								    	<btns btnClass="custom8" btnFontSize="12px" title="下载" @click="downloadFile">
										</btns>
									</a>
                                </li>
                                <li>
                                    <div class="item-left">2</div>
                                    <dt>上传填写好的教师档案表</dt>
									 <form id="teacherForm" 
										:action="`${this.serverUrl}import/importTeacher`" 
									 	method="post" 
										target="teacher_iframe">
                                    <!-- <form class="up-load" id="teacherForm"> -->
										<input type="hidden" :value="schoolId" name="schoolId">
                                        <btns btnClass="custom8" btnFontSize="12px" title="选择文件" @click="upLoad('teacher')"></btns>
                                        <span class="file-text">{{fileText?fileText:"未选中任何文件"}}</span>
                                        <input name="file" type="file" style="display: none" id="teacher_file"
                                               @change="uploadFile($event,'download')" hidefocus>
                                    </form>
									<iframe id="teacher_iframe" name="teacher_iframe" style="display:none;"></iframe>
                                </li>
                            </ul>
                            <div class="btn-bot">
                                <btns btnClass="custom10" btnFontSize="12px" title="上传" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@importTeacher_create_own') > -1" @click="addUpload"></btns>
                            </div>
                        </div>
                        <!--导出档案-->
                        <div class="item1" v-show="ac==1">
                            <ul>
                                <li>
									<form id="exportClientForm" target="id_updateIframe1"
										:action="`${this.serverUrl}userInfo/exportTeacher`" 
										method="post">
										<input type="hidden" :value="schoolId" name="schoolId">
										<input type="hidden" :value="checkedKeys" name="userDep" v-if="checkedKeys.length>0">
										<input type="hidden" :value="searchVal" name="userNameLike" v-if="searchVal!=''">
									</form>
									<iframe id="id_updateIframe1" name="id_updateIframe1" style="display:none;"></iframe>
                                    <div class="item-left">1</div>
                                    <dt>选择左侧需导出的教师部门，导出档案</dt>
                                    <btns btnClass="custom8" btnFontSize="12px" title="导出" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@exportTeacher_read_own') > -1" @click="exportFile"></btns>
								</li>
                            </ul>
                        </div>
                        <!--导入档案照片-->
                        <div class="item1" v-show="ac==2">
                            <ul>
                                <li>
                                    <div class="item-left">1</div>
                                    <dt>档案照片请以教师工号或姓名命名，支持jpg或png格式。仅支持压缩包导入。</dt>
                                </li>
                                <li>
                                    <div class="item-left ">2</div>
                                    <dt class="margin-comp">导入方式</dt>
                                    <el-radio v-model="radio" label="1" @change="radioClick(1)">照片以工号命名</el-radio>
                                    <el-radio v-model="radio" label="2" @change="radioClick(2)">照片以姓名命名</el-radio>
                                </li>
                                <li>
                                    <div class="item-left">3</div>
                                    <dt>上传压缩好的教师档案照片</dt>

									<form id="compressForm" 
										:action="`${this.serverUrl}photo/stuPhoto`" 
									 	method="post" 
									 	target="compress_iframe">
										<input type="hidden" :value="schoolId" name="schoolId">
										<!-- 1：工号  2：姓名 -->
										<input type="hidden" :value="radioVal" name="nameStyle">
                                        <btns btnClass="custom8" btnFontSize="12px" title="选择压缩文件"
                                              @click="upLoad('compress')"></btns>
                                        <span class="file-text">{{compressText?compressText:"未选中任何压缩文件"}}</span>
                                        <input name="file" type="file" style="display: none;" id="compress_file"
                                               @change="uploadFile($event,'compress')" hidefocus>
                                    </form>
									<iframe id="compress_iframe" name="compress_iframe" style="display:none;"></iframe>
                                </li>
                            </ul>
                            <div class="btn-bot">
                                <btns btnClass="custom10" btnFontSize="12px" title="上传" @click="compressUpload"></btns>
                            </div>
                        </div>
                        <!--生成app初始账号密码-->
                        <div class="item1" v-show="ac==3">
                            <ul>
                                <li>
                                    <div class="item-left">1</div>
                                    <dt>请确保教师档案中的手机号无误，手机号将作为教师APP的登录账号。</dt>
                                </li>
                                <li>
                                    <div class="item-left">2</div>
                                    <dt>设置APP初始密码</dt>
									<input type="password" v-model="pwd" class="pwd" disabled="true">
                                    <!-- <span class="pwd-state">{{pwdState == 1 ?'已完成':'未完成'}}</span> -->
									<!-- <input type="password" v-model="pwd" class="pwd" :disabled="pwdState == 1">
                                    <span class="pwd-state">{{pwdState == 1 ?'已完成':'未完成'}}</span> -->
                                </li>
                            </ul>
                            <div class="btn-bot">
                                <btns btnClass="custom10" btnFontSize="12px" title="生成账号密码" @click="creatPwdClick(pwd,'checkPwd')"></btns>
                            </div>
                        </div>
                    </div>
                </div>

				<!--上传验证盒子-->
                <div class="import-export validate-box" v-show="validateShow">
                    <div class="import-t">
                        <btns btnClass="custom8" btnFontSize="12px" title="返回" @click="backClick('validate')"></btns>
                    </div>
                    <div class="import-b">
                        <div class="validate-tip">
							<h5>温馨提醒</h5>
                            <p v-show="errListData.length>0">当前表格中有{{errListData.length}}条错误，请修改后重新上传（如有误，请调整excel后重新上传）</p>
                            <p v-show="errListData.length == 0">您一共上传{{succNum}}条记录。</p>
                        </div>
                        <div class="err-table-box">
							<el-table
									ref="errTable"
									border
									:data="errListData"
									height=" 100%"
									tooltip-effect="dark"
									style="width: 100%;"
									v-if="errListData.length>0"
								>
								<el-table-column prop="row" label="行数"></el-table-column>
								<el-table-column prop="userNo" label="工号"></el-table-column>
								<el-table-column prop="userName" label="姓名"></el-table-column>
								<el-table-column prop="userTel" label="手机号" show-overflow-tooltip></el-table-column>
								<el-table-column prop="userDepname" label="部门"></el-table-column>
								<el-table-column prop="userDuty" label="职位"></el-table-column>
								<el-table-column prop="userClass" label="管理班级" show-overflow-tooltip></el-table-column>
								<el-table-column prop="msg" label="错误详情"></el-table-column>
							</el-table>
                    	</div>
						<form id="saveStudent" 
							:action="`${this.serverUrl}import/importTeacherSave`" 
							method="post" 
							target="save_iframe">
							<input type="hidden" :value="threadId" name="threadId">
						</form>
						<iframe id="save_iframe" name="save_iframe" style="display:none;"></iframe>
						<div class="err-btn">
							<btns btnClass="custom8" btnFontSize="12px" title="重新上传" @click="alignUpload('validate')" v-show="errListData.length>0"></btns>
							<!-- <btns btnClass="custom10" btnFontSize="12px" title="重新上传" @click="alignUpload('validate')" v-show="errListData.length == 0"></btns> -->
							<btns btnClass="custom8" btnFontSize="12px" title="确定" @click="confirmUpload" v-show="errListData.length == 0"></btns>
						</div>
                    </div>
                </div>
				<!--图片上传验证盒子-->
                <div class="import-export validate-box" v-show="photoValidateShow">
                    <div class="import-t">
                        <btns btnClass="custom8" btnFontSize="12px" title="返回" @click="backClick('photo')"></btns>
                    </div>
                    <div class="import-b">
                        <div class="validate-tip">
							<h5>温馨提醒</h5>
                            <p v-show="errPhtotListData.length>0">当前压缩包中有{{errPhtotListData.length}}条错误，请修改后重新上传（如有误，请调整后重新上传）</p>
                            <p v-show="succPhtotListData.length == 0 && errPhtotListData.length == 0">您一共上传{{succNum}}条记录。</p>
                            <p v-show="succPhtotListData.length > 0">您一共上传{{succNum}}条记录，重名的学生将使用相同的文件名照片，保存后可在档案中修改。 		</p>
                        </div>
                        <div class="err-table-box">
							<el-table
									ref="errTable"
									border
									:data="errPhtotListData"
									height=" 100%"
									tooltip-effect="dark"
									style="width: 100%;"
									v-if="errPhtotListData.length>0"
								>
								<el-table-column prop="fileInfo" label="文件信息"></el-table-column>
								<el-table-column prop="errMsg" label="错误详情"></el-table-column>
							</el-table>
							<el-table
									ref="errTable"
									border
									:data="succPhtotListData"
									height=" 100%"
									tooltip-effect="dark"
									style="width: 100%;"
									v-if="succPhtotListData.length>0"
								>
								<el-table-column prop="userName" label="姓名"></el-table-column>
								<el-table-column prop="userDepname" label="部门"></el-table-column>
								<el-table-column prop="userNo" label="工号"></el-table-column>
							</el-table>
                    	</div>
						<div class="err-btn">
							<btns btnClass="custom8" btnFontSize="12px" title="重新上传" @click="alignUpload('photo')" v-show="errPhtotListData.length>0"></btns>
							<!-- <btns btnClass="custom10" btnFontSize="12px" title="重新上传" @click="alignUpload('photo')" v-show="errPhtotListData.length == 0"></btns> -->
							<btns btnClass="custom8" btnFontSize="12px" title="确定" @click="photoConfirmUpload" v-show="errPhtotListData.length == 0"></btns>
						</div>
                    </div>
                </div>
            </div>
        </div>
        <!--新增教师弹窗-->
        <div class="add-box">
            <el-dialog
                    title="新增教师"
                    :visible.sync="addDialog"
                    center>
                <div class="content">
                    <div class="content-l">
                        <el-form  :validate-on-rule-change="false"
                                  :inline="true"
                                :rules="rules"
                                ref="formInline"
                                :model="formInline"
                                class="demo-form-inline">
                            <el-form-item label="工号" prop="userNo">
                                <el-input v-model="formInline.userNo"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="formInline.userName"></el-input>
                            </el-form-item>
                            <el-form-item label="部门" prop="userDepname">
                                <div class="deparment transfer-content">
                                    <div class="transfer-top" @click="depChangeClick">
                                        <span>{{formInline.userDepname}}</span>
                                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':transferState}"
                                             alt="">
                                    </div>
                                    <div class="inner-tree" v-if="transferState">
                                        <el-tree :data="treeData" node-key="id"
                                                 :default-expanded-keys="depExpandedKeys" :expand-on-click-node="false"
                                                 @node-click="selectDeparment"></el-tree>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="userTel">
                                <el-input v-model="formInline.userTel"></el-input>
                            </el-form-item>
                            <el-form-item label="职位" prop="userDuty">
                                <el-select v-model="formInline.userDuty" placeholder="" @change="selectDuty">
                                    <el-option :label="item.code_item_name" :value="item.code_item_id" :key="index"
                                               v-for="(item,index) in jobData"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="管理班级" prop="className">
                                <div class="class transfer-content">
                                    <div class="transfer-top" @click="classChangeClick">
                                        <span>{{formInline.className}}</span>
                                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':classTreeState}">
                                    </div>
                                    <div class="inner-tree" v-if="classTreeState">
                                        <el-tree :data="classTreeData" node-key="id"
                                                 :default-expanded-keys="classExpandedKeys" :expand-on-click-node="false"
                                                 @node-click="selectClass"></el-tree>
                                    </div>
                                    <div class="disabled-div" v-if="classShow"></div>
                                </div>
                            </el-form-item>
                            <el-form-item label="APP绑定" class="binding">
                                <el-input v-model="formInline.binding" placeholder="未绑定。默认密码为123456"
                                          :disabled="true"></el-input>
                            </el-form-item>
                            <dt>注：APP登录账号为手机号。初始密码为统一设置的默认密码。</dt>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box">
                            <img :src="addImgUrl?addImgUrl:requrieImg" alt="教师照片" :onerror="defaultErrImg" >
                        </div>
                        <form class="up-load" id="addImg">
                            <input name="upload" type="file" style="display: none" id="add-img"
                                   @change="uploadFile($event,'add')" hidefocus>
                        </form>
                        <btns btnClass="custom6" btnFontSize="12px" title="修改照片" @click="addPhoto"></btns>
                        <dd>最佳尺寸：200*300</dd>
                    </div>
                </div>
                <div class="bot">
                    <btns btnClass="custom7" btnFontSize="12px" @click="resetForm" title="取消"></btns>
                    <btns btnClass="custom8" btnFontSize="12px" @click="onSubmit"
                          title="保存"></btns>
                </div>
            </el-dialog>
        </div>
        <!--修改教师弹窗-->
        <div class="add-box">
            <el-dialog
                    :title="'修改'+changeData.titleName+'资料'"
                    :visible.sync="changeDialog"
                    center>
                <div class="content">
                    <div class="content-l">
                        <el-form  :validate-on-rule-change="false"
                                  :inline="true"
                                :rules="rules"
                                ref="changeData"
                                :model="changeData"
                                class="demo-form-inline">
                            <el-form-item label="工号" prop="userNo">
                                <el-input v-model="changeData.userNo"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="changeData.userName"></el-input>
                            </el-form-item>
                            <el-form-item label="部门" prop="userDepname">
                                <div class="deparment transfer-content">
                                    <div class="transfer-top" @click="depChangeClick">
                                        <span>{{changeData.userDepname}}</span>
                                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':transferState}"
                                             alt="">
                                    </div>
                                    <div class="inner-tree" v-if="transferState">
                                        <el-tree :data="treeData"  node-key="id"
                                                 :default-expanded-keys="depExpandedKeys" :expand-on-click-node="false"
                                                 @node-click="selectDeparment"></el-tree>
                                    </div>
                                </div>
                            </el-form-item>
                            <el-form-item label="联系电话" prop="userTel">
                                <el-input v-model="changeData.userTel"></el-input>
                            </el-form-item>
                            <el-form-item label="职位" prop="userDuty">
                                <el-select v-model="changeData.userDuty" placeholder="" @change="selectDuty">
                                    <el-option :label="item.code_item_name" :value="item.code_item_id"
                                               :key="item.code_item_id"
                                               v-for="item in jobData" ></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="管理班级" prop="className">
                                <div class="class transfer-content">
                                    <div class="transfer-top" @click="classChangeClick">
                                        <span>{{changeData.className}}</span>
                                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':classTreeState}"
                                             alt="">
                                    </div>
                                    <div class="inner-tree" v-if="classTreeState">
                                        <el-tree :data="classTreeData"  node-key="id"
                                                 :default-expanded-keys="classExpandedKeys" :expand-on-click-node="false"
                                                 @node-click="selectClass"></el-tree>
                                    </div>
                                    <div class="disabled-div" v-if="classShow"></div>
                                </div>
                            </el-form-item>
                            <el-form-item label="APP绑定" class="binding">
                                <el-input :value="changeData.isBandingApp == 1?'已绑定':'未绑定'"
                                          :disabled="true"></el-input>
                            </el-form-item>
                            <dt>注：APP登录账号为手机号。初始密码为统一设置的默认密码。</dt>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box">
                            <img alt="教师照片"
							:onerror="defaultErrImg"
							 :src="(changeImgUrl)?changeImgUrl:(changeData.userPhoto?uploadPicUrl + changeData.userPhoto+'?imageView2/1/w/170':requrieImg) "
                            >
                        </div>
                        <form class="up-load" id="changeImg">
                            <input name="upload" type="file" style="display: none" id="change-img"
                                   @change="uploadFile($event,'change')" hidefocus>
                        </form>
                        <btns btnClass="custom6" btnFontSize="12px" title="修改照片" @click="changePhoto"></btns>
                        <dd>最佳尺寸：200*300</dd>
                    </div>
                </div>
                <div class="bot">
                    <btns btnClass="custom7" btnFontSize="12px" @click="resetChange" title="取消"></btns>
                    <btns btnClass="custom8" btnFontSize="12px" @click="changeSubmit"
                          title="保存" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@modify_update_own') > -1"></btns>
                </div>
            </el-dialog>
        </div>
        <!--批量调动弹窗-->
        <div class="add-box transfer">
            <el-dialog
                    :title="'调动'+changeTableData.length+'名教师'"
                    :visible.sync="transferDialog"
                    center>
                <div class="name">（已选中：
                    <dd v-for="(item,index) in changeTableData" :key="index">{{item.userName}}<span>，</span></dd>
                    ）
                </div>
                <div class="transfer-select content">
                    <div class=" transfer-content deparment">
                        <div class="transfer-top" @click="transferChangeClick">
                            <span>{{transferVal}}</span>
                            <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':transferState}" alt="">
                        </div>
                        <div class="inner-tree" v-if="transferState">
                            <el-tree :data="treeData"  node-key="id"
                                     :default-expanded-keys="depExpandedKeys" :expand-on-click-node="false"
                                     @node-click="handleNodeClick"></el-tree>
                        </div>
                    </div>
                </div>
                <div class="bot">
                    <btns btnClass="custom7" btnFontSize="12px" @click="transferReset" title="取消"></btns>
                    <btns btnClass="custom8" btnFontSize="12px" @click="transferSubmit" title="保存" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@modifyDep_update_own') > -1"></btns>
                </div>
            </el-dialog>
        </div>
        <!--批量离职弹窗-->
        <div class="add-box transfer leave-box">
            <el-dialog
                    :title="'离职'+changeTableData.length+'名教师'"
                    :visible.sync="leaveDialog"
                    center>
                <div class="name">（已选中：
                    <dd v-for="(item,index) in changeTableData" :key="index">{{item.userName}}<span>，</span></dd>
                    ）
                </div>
                <div class="content leave-content">
                    <p><img src="../../assets/images/del.png">警告：离职教师会产生以下后果</p>
                    <dd>1.教职工基础信息（包括指纹，ID卡）全部删除</dd>
                    <dd>2.解除教职工绑定的APP账号</dd>
                </div>
                <div class="bot">
                    <btns btnClass="custom7" btnFontSize="12px" @click="leaveReset" title="取消"></btns>
                    <btns btnClass="custom8" btnFontSize="12px" @click="leaveSubmit" title="确定"></btns>
                </div>
            </el-dialog>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import btns from '@/components/Button/Button.vue'
	import Toast from '@/components/Toast/Toast'
	import { Loading } from 'element-ui';

	export default {
		name: 'TeachersRecord',
		components: {
			btns, Toast
		},
		computed: {
			defaultErrImg() {
				return 'this.src="' + this.$store.state.Common.defaultErrImg + '"'
			}
		},
		data() {
			let validateTel = (rule, value, callback) => {            //手机号码的验证
                if (!value) {
					callback(new Error('请输入手机号码'));
				} else {
					this.checkTel(value, callback);//form内必填项
					callback();
				}
				callback();
			};
			//form内必填项校验-- 数字
			let validateInputNumber = (rule, value, callback) => {   
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					this.checkNumber(value, callback);
					callback();
				}
				callback();
			};
			//form内必填项校验--文本框
			let validateInputChars = (rule, value, callback) => {
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					this.checkInputChars(value, callback);//form内必填项
					callback();
				}
				callback();
			};
			return {
				tableLoading:false,//表格loading
				classShow: false,//管理班级选项是否可选
				teacherShow:false,  //教师总数是否显示，默认不显示
				requrieImg: require('../../assets/images/default.png'),
				classTreeData: [],//班级组织结构树
				treeData: [],//部门组织结构树
				searchVal: "",//搜索内容
				//左侧树状图操作按钮
				// imgData: [
				// 	{
				// 		imgNo: require('../../assets/images/add_no.png'),
				// 		imgAc: require('../../assets/images/add_ac.png'),
				// 		title: '新增',
				// 		value: 1,
				// 		visible: false
				// 	},
				// 	{
				// 		imgNo: require('../../assets/images/del_no.png'),
				// 		imgAc: require('../../assets/images/del_ac.png'),
				// 		title: '删除',
				// 		value: 2,
				// 		visible: false
				// 	},
				// 	{
				// 		imgNo: require('../../assets/images/change_no.png'),
				// 		imgAc: require('../../assets/images/change_ac.png'),
				// 		title: '修改',
				// 		value: 3,
				// 		visible: false
				// 	}
				// ], //二期暂时不用 2018-09-21
				filtersData: [
					{
						'text': "班主任",
						'value': "班主任"
					},
					{
						'text': "教师",
						'value': "教师"
					}
				],//过滤数据 /*TODO*//2018-10-19 前台先写死，后期职位增加后台要新增职位接口 cs
				listData: [],//列表数据
				changeTableData: [],//table选中的数据
				addDialog: false,//新增教师弹窗显示
				changeDialog: false,//修改教师弹窗显示
				transferDialog: false,//批量调动弹窗显示
				leaveDialog: false,//批量调动弹窗显示
				//form规则验证
				rules: this.rules1,
				rules1: {
					userNo: [
						{required: true, validator: validateInputNumber, trigger: 'blur'}
					],
					userName: [
						{required: true, validator: validateInputChars, trigger: 'blur'}
					],
					userDepname: [
						{required: true, message: '请选择部门', trigger: 'blur'}
					],
					userTel: [
						{required: true, validator: validateTel, trigger: 'blur'}
					],
					userDuty: [
						{required: true, message: '请选择职位', trigger: 'change'}
					],
					className: [
						{required: true, message: '请选择管理班级', trigger: 'blur'}
					]
				},
				rules2: {
					userNo: [
						{required: true, validator: validateInputNumber, trigger: 'blur'}
					],
					userName: [
						{required: true, validator: validateInputChars, trigger: 'blur'}
					],
					userDepname: [
						{required: true, message: '请选择部门', trigger: 'blur'}
					],
					userTel: [
						{required: true, validator: validateTel, trigger: 'blur'}
					],
					userDuty: [
						{required: true, message: '请选择职位', trigger: 'change'}
					]
				},
				//新增教师弹窗内容
				formInline: {
					userNo:'',
					userName:'',
					userDepname:'',
					userTel: '',
					userDuty: '',
					className:''
				},
				changeData: {},//修改教师弹窗内容
				transferVal: '请选择',//调动输入框显示信息
				transferChange: {},//调动所选数据
				transferState: false,//调动树形图显示，新增-部门树是否显示
				transferState2: false,//调动树形图显示，新增-部门树是否显示
				classTreeState: false,//新增-班级树形图显示
				depExpandedKeys: [],//默认展开第二级(部门)
				classExpandedKeys: [],//默认展开第二级(管理班级)
				jobData: [],//职位信息数据
				importShow: false,//批量输入输出显示
				recordData: [
					{
						title: '新建档案',
						value: 1
					},
					{
						title: '导出档案',
						value: 2
					},
					{
						title: '导入档案照片',
						value: 3
					},
					// {
					// 	title: '生成APP初始账号密码',
					// 	value: 4
					// }
				],//批量导入导出中选项卡数据
				ac: 0,//批量导入导出选项卡
				fileText: '',//上传档案文件名
				compressText: '',//上传照片zip名
				radio: "1",//命名方式单选框
				radioVal: "1",//命名方式选中
				pwd: '123456',//初始密码
				// pwdState: localStorage.getItem('isExistsSysPwd'),//初始密码状态显示
				//修改照片
				addImgUrl: '',//新增教师头像图片url
				userPhoto: "",//上传的教师头像 key值
				changeImgUrl: '',//修改教师头像图片url
				imgList: [],//选中图片数组
				addClassDialog: false, //部门组织结构确认弹窗
				addNode: {},//树形图新增节点 传参用
				addData: [],//树形图新增数据 传参用
				checkedKeys: [],//部门组织结构选中的树节点
				checkedOneKeys: [],//选中的树节点 新增教师单个带入部门
				pageAllNum: 0,//教师数量
				pageSize: 20,//每页显示条数
				currentPage: 1,//当前页
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				msgDuration: 1000,//$message显示时间
				/*----------二期------------*/
				validateShow: false,//上传验证盒子显示
				photoValidateShow: false,//图片上传验证盒子显示
				succNum:0, //上传验证正确总条数
				errListData: [],  //上传失败列表数据
				errPhtotListData:[],//上传图片失败数据
				succPhtotListData:[],//上传图片成功数据
				schoolId: localStorage.getItem('schoolId'),//学校id
				threadId: '',//学生档案保存id
				oneName:'',//新增教师是否显示默认选中的班级名称
				oneNameId:'',//新增教师是否显示默认选中的班级id
				treeClickState:2,//新增:1 ，删除和默认:2 ，修改:3
				iconShow:true,//树结构 操作按钮是否展示
				treeInputVal:'',//树结构 input输入内容
				userDutys:"",//1:班主任  2：教师
			}
		},
		methods: {
			
			/**
			 *  @function: 输入内容验----form内选填
			 *  @author: cs
			 *  @date 2018-09-06
			 */
			inputCheck(value,name,funcName) {
				/**
				 * value:要验证的内容
				 * name:控制显示隐藏的变量名
				 * funcName:验证的方法名
				*/
				//验证内容
				let state = false;
				if (value) {
					this[funcName](value, ()=>{
						state = true;
						// return state;
					},1);
				} else {
					state = false;
					// return state;  
				}
				this[name] = state;
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
			/**
			 *  @function: table 列表点击筛选
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			formatter(row, column) {
				return row.address;
			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			filterTag(value, row) {
				// console.log("列表点击筛选:",value)
				return row.dicFmtMap.userDutycn === value;
			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: wzx
			 *  @date 2018-09-13
			 */
			handleFilterChange(filters) {
				// console.log('筛选条件变化', filters);      //2018.9.14
				let vThis = this;
				let idArr = [];
				Object.keys(filters).forEach(function(key){
					if(filters[key].length == 0){
						//重置
						vThis.userDutys = "";
						return
					}
					if(filters[key].length == 1){
						//选中了一个
						if(filters[key][0] == '教师'){
							vThis.userDutys = "2"
						}else if(filters[key][0] == '班主任'){
							vThis.userDutys = "1"
						}
						return
					}
					for(let i = 0;i<filters[key].length;i++){
						//选中了多个
						if(filters[key][i] == '教师'){
							vThis.userDutys = "2";
						}else if(filters[key][i] == '班主任'){
							vThis.userDutys = "1";
						}
						idArr[i] = vThis.userDutys;//给后台的数组id
					}
					idArr = idArr.sort((num1,num2)=>{  
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
					vThis.userDutys = idArr.join(',')
				});
				// console.log("idArr:",this.userDutys);
				this.currentPage = 1;
				this.getTableList();//加载表格数据
			},
			/**
			 *  @function: 左侧树操作-确认删除
			 *  @author: cs
			 *  @date 2018-08-02
			 */
			confirmAdd(node, data) {
				//console.log("删除 节点", node, data)
				const parent = node.parent;
				const children = parent.data.children || parent.data;
				const index = children.findIndex(d => d.id === data.id);
				if (children[index].children != undefined && children[index].children != '') {
					this.$message({
						showClose: true,
						message: '该部门下存在老师，不能删除',
						type: 'error', duration: this.msgDuration
					})
				} else {
					/*children.splice(index, 1);
					this.$message({
						showClose: true,
						message: '删除成功',
						type: 'success', duration: this.msgDuration
					})
					this.addClassDialog = false;*/
					this.$refs["tree"].setCheckedKeys([]);
					this.getTableList(data.id, (param)=>{
						if(param){
							this.$message({
								showClose: true,
								message: '该部门下存在老师，不能删除',
								type: 'error',
								duration: this.msgDuration
							})
							this.addClassDialog = false;
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
									this.addClassDialog = false;
									this.getTreeData();
								} else {
									this.addClassDialog = false;
									this.isToast = true;
									this.toast = res.data.msg;
								}
							})
						}
					})
				}
			},
			/**
			 *  @function: 关闭新增班级弹窗
			 *  @author: cs
			 *  @date 2018-07-20
			 */
			closeAdd() {
				this.addClassDialog = false;
				this.addNum = '';
			},
			/**
			 *  @function: 树形图点击
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			getCheckedKeys() {
				this.checkedKeys = this.$refs["tree"].getCheckedKeys();
				this.checkedOneKeys = this.$refs["tree"].getCheckedKeys(true);
				// console.log("选中班级keys checkedOneKeys:",this.checkedOneKeys)
				//如果只选中一个班级，在新增学生时展示选中的班级，多个班级不做修改
				if(this.checkedOneKeys.length == 1){
					let userDepname = this.getClassName(this.treeData, this.checkedOneKeys,1)
					this.oneName = userDepname;

				}else{
					this.oneName = '';
				}
				this.currentPage = 1;
				this.getTableList();//加载表格数据
			},
			/**
			 *  @function: 树形图input失焦
			 *  @author: cs
			 *  @date 2018-10-12
			 */
			blurClick(data,deptName){
				// console.log('点击状态',data,deptName,this.treeClickState)
				let vThis = this;
				this.iconShow = true;
				if(this.treeClickState == 1){
					// console.log('点击新增');
				}else if(this.treeClickState == 3){
					// console.log('点击修改');
					$('.input' + data.id).attr('disabled', 'true')
					if (deptName == '') {
						this.$message({
							showClose: true,
							message: '部门名称不能为空！',
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
					let jsonParam = {	
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
					});
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
				let id = 1000;
				this.iconShow = false;
				if (value === 1) {
					//点击新增
					this.treeClickState = 1;
					//console.log("点击新增", data)
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
							// console.log(11,$(e.target).val(),"---")
							if ($(e.target).val() == '') {
								this.$message({
									showClose: true,
									message: '部门名称不能为空！',
									type: 'warning',
									duration: this.msgDuration
								})
								$('.input' + newChild.id).focus();
							} else {
								$('.input' + newChild.id).attr('disabled', 'true')
								//获取当前存在的index  并删除
								const index = data.children.indexOf(newChild);
								data.children.splice(index, 1);
								let jsonParam = {
                                //    "deptId": 0,//部门id 新增不传
                                    "deptName": $(e.target).val(), //名字
                                    "isLeaf": 1,//新增固定传1 ， 修改不用传
                                    "ptDeptId": data.id,//上级id（ 高一新增  传高一的id )
                                }
								this.$api.BasicInfo.addDepTeacher(jsonParam).then(res =>{
                                    //console.log('新增班级:', res.data)
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
					this.addClassDialog = true;
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
						// console.log("vThis.treeInputVal:",vThis.treeInputVal)
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
					res.textLen = ($(input).val().match(re3)).length * 1.85;
				}
				return res
			},
			/**
			 *  @function: 上方搜索
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			searchClick() {
				this.getTableList();//搜索表格内容
				// this.getPdf('app',"125")//导出pdf
			},
			/**
			 *  @function: 新增教师
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			addClick() {
				//console.log("新增教师点击")
				this.rules = this.rules2;//每次点击默认规则为2
				this.addDialog = true;
				this.formInline = {
					userNo:'',
					userName:'',
					userDepname:'',
					userTel: '',
					userDuty: '',
					className:''
				}
				setTimeout(()=>{
					document.getElementById("addImg").reset();
				})
				this.addImgUrl = '';
				this.userPhoto = '';
				this.depExpandedKeys = [];
				this.classExpandedKeys = [];
				if (this.treeData.length > 0) {
					this.treeData.forEach((item) => {
						this.depExpandedKeys.push(item.id)
					})
				}
				if (this.classTreeData.length > 0) {
					this.classTreeData.forEach((item) => {
						this.classExpandedKeys.push(item.id)
						item.children.forEach((item2) => {
							this.classExpandedKeys.push(item2.id)
						})
					})
				}
				// console.log("this.oneName11",this.oneName)
				if(this.oneName == ''){
					setTimeout(() => {
						this.$refs['formInline'].resetFields();
						this.formInline.userDep = '';
						this.formInline.userDepname = '';
					},20)
					
				}else{
					setTimeout(() => {
						this.$refs['formInline'].resetFields();
						this.formInline.userDepname = this.oneName;
						this.formInline.userDep = this.oneNameId;
					})
				}
			},
			/**
			 *  @function: 新增教师点击确认
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			onSubmit() {
				this.$refs["formInline"].validate((valid) => {
					if (valid) {
						Loading.service();
						if (this.addImgUrl) {
							this.ajaxPic(this.addImgUrl, this.addTeacher)
						} else {
							this.addTeacher()
						}
					} else {
						//console.log('error submit!!');
						this.$message({
							showClose: true,
							message: '请输入内容（*为必填项）',
							type: 'error', duration: this.msgDuration
						})
						return false;
					}
				});
			},
			/**
			 *  @function: 新增教师点击取消
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			resetForm() {
				//console.log('点击取消!');
				this.$refs["formInline"].resetFields();
				this.addDialog = false;
			},
			/**
			 *  @function: 批量调动
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			transferClick() {
				//console.log('批量调动按钮点击')
				if (this.changeTableData.length <= 0) {
					this.$message({
						showClose: true,
						message: '请选择需调动的人员',
						type: 'warning', duration: this.msgDuration
					})
					return false
				}
				this.depExpandedKeys = [];
				if (this.treeData.length > 0) {
					this.treeData.forEach((item) => {
						this.depExpandedKeys.push(item.id)
					})
				}
				this.transferDialog = true;
				this.transferChange = {};
				this.transferVal = "请选择";
			},
			/**
			 *  @function: 批量调动树形图是否展示
			 *  @author: cs
			 *  @date 2018-07-26
			 */
			transferChangeClick() {
				this.transferState = !this.transferState;
			},
			/**
			 *  @function: 新增-部门树是否展示
			 *  @author: cs-l
			 *  @date 2018-07-31
			 */
			depChangeClick() {
				this.transferState = !this.transferState;
			},
			/**
			 *  @function: 新增-班级树是否展示
			 *  @author: cs-l
			 *  @date 2018-07-31
			 */
			classChangeClick() {
				this.classTreeState = !this.classTreeState;
			},
			/**
			 *  @function: 批量调动树形图点击展示
			 *  @author: cs
			 *  @date 2018-07-26
			 */
			handleNodeClick(data) {
				//console.log("批量调动树形图点击:",data);
				if (data.group != 101) {
					this.transferVal = data.label;
					this.transferChange = data;
				} else {
					this.transferVal = "请选择";
					this.transferChange = {};
				}
				this.transferState = false;

			},
			/**
			 *  @function: 批量调动点击确认
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			transferSubmit() {
				let vThis = this;
				//console.log('批量调动点击确认:', this.transferChange);
				if (JSON.stringify(this.transferChange) !== "{}") {
					let userIdList = []
					this.changeTableData.forEach((item) => {
						userIdList.push(item.userSerial)
					})
					Loading.service();
					let jsonParam = {
						"userList": userIdList.join(','),//人员id，逗号间隔
						"depId": this.transferChange.id, //调动后部门id
						"deptName": this.transferChange.label, //部门名称
						"userType": 3, //1：学生  3：教职工
					}
					this.$api.BasicInfo.modifyDepTeacher(jsonParam).then(res =>{
						//console.log('批量调动:', res.data);
						Loading.service().close();
						if (res.data.code == 600 || res.data.code == 0) {
							this.$message({
								showClose: true,
								message: '调动成功',
								type: 'success', duration: this.msgDuration
							})
							this.transferDialog = false;
							this.transferChange = {};
							this.getTableList();//表格列表内容
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				} else {
					this.$message({
						showClose: true,
						message: '请选择调动部门',
						type: 'error', duration: this.msgDuration
					})
					return false;
				}
			},
			/**
			 *  @function: 批量调动点击取消
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			transferReset() {
				//console.log('点击取消!');
				this.transferDialog = false;
				this.transferState = false;
			},
			/**
			 *  @function: 批量离职
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			leaveClick() {
				//console.log('批量离职')
				if (this.changeTableData.length <= 0) {
					this.$message({
						showClose: true,
						message: '请选择需调动的人员',
						type: 'warning', duration: this.msgDuration
					})
					return false
				}

				this.leaveDialog = true;
			},
			/**
			 *  @function: 批量离职点击确认
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			leaveSubmit() {
				//console.log('批量离职点击确认');
				let userIdList = []
				this.changeTableData.forEach((item) => {
					userIdList.push(item.userSerial)
				})
				Loading.service();
				let jsonParam = {
					"userList": userIdList.join(',')//人员id，逗号间隔
				}
				this.$api.BasicInfo.delUserTeacher(jsonParam).then(res =>{
					// console.log('批量离职:', res.data)
					Loading.service().close();
					if (res.data.code == 600 || res.data.code == 0) {
						this.$message({
							showClose: true,
							message: '离职成功',
							type: 'success', duration: this.msgDuration
						})
						this.leaveDialog = false;
						this.transferState = false;
						this.transferChange = {};
						this.getTableList();//表格列表内容
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    Loading.service().close();
                })
			},
			/**
			 *  @function: 批量离职点击取消
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			leaveReset() {
				//console.log('批量离职点击取消');
				this.leaveDialog = false;
			},
			/**
			 *  @function: 点击批量输入输出
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			importClick() {
				//console.log('输入输出点击')
				this.importShow = true;
				this.fileText = '';
				document.getElementById("teacherForm").reset(); 
				this.compressText = '';
				document.getElementById("compressForm").reset(); 
				// this.pwd = '';
				this.ac = 0;
				setTimeout(() => {
					let importHeight = $('.teachers-record').height() - $('.import-t').height();
					//console.log(importHeight)
					$('.import-b').height(importHeight);
				})
			},
			/**
			 *  @function: 批量输入输出返回
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			backClick(status) {
				//console.log("批量输入输出返回,清空所输入的信息")
				/*
				* import :批量输入输出页面返回
				* validate :上传验证页面返回
				*/
				if(status == "import"){
					//console.log('批量输入输出返回')
					this.importShow = false;
				}else if(status == "validate"){
					//console.log('档案上传验证页面返回')
					this.validateShow = false;
				}else if(status == "photo"){
					//console.log('图片上传验证页面返回')
					this.photoValidateShow = false;
				}
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
			 *  @function: 表格选中改变
			 *  @author: cs
			 *  @date 2018-07-09
			 */
			handleSelectionChange(val) {
				//console.log("val:", val)
				this.changeTableData = val;
			},
			/**
			 *  @function: 表格单击行
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			rowClick(row) {
				//console.log("rowClick:", row)
				row.titleName = row.userName;
				this.changeDialog = true;
				this.rules = this.rules2;//每次点击默认规则为2
				this.classShow = false;//管理班级默认可选
                setTimeout(()=>{
//	                this.$refs["changeData"].clearValidate(['className']);//重置管理班级的规则
	                this.$refs["changeData"].resetFields();
                })
				this.depExpandedKeys = [];
				this.classExpandedKeys = [];
				if (this.treeData.length > 0) {
					this.treeData.forEach((item) => {
						this.depExpandedKeys.push(item.id)
					})
				}
				if (this.classTreeData.length > 0) {
					this.classTreeData.forEach((item) => {
						this.classExpandedKeys.push(item.id)
						item.children.forEach((item2) => {
							this.classExpandedKeys.push(item2.id)
						})
					})
				}
				let rows = JSON.parse(JSON.stringify(row));//深拷贝row中的值
                setTimeout(()=>{
	                document.getElementById("changeImg").reset();
	                this.changeData = rows;
	                this.changeImgUrl = '';
	                if(!rows.userDuty){//职位为空时不赋值
		                rows.userDuty = '';
		                return
	                }
	                if(rows.userDuty == 1){//班主任
		                this.classShow = false;
		                this.rules = this.rules1;
	                }else if(rows.userDuty == 2){//教师
		                this.classShow = true;
		                this.rules = this.rules2;
	                }
	                this.changeData.userDuty = parseInt(rows.userDuty)//180807去掉（不转换好使了）
                },20)
			},
			/**
			 *  @function: 教师修改点击确认
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			changeSubmit() {
				//console.log('submit!');
				this.$refs["changeData"].validate((valid) => {
					if (valid) {
						Loading.service();
						//console.log('success!');
						if (this.changeImgUrl) {
							//更改头像
							this.ajaxPic(this.changeImgUrl, this.changeTeacher)
						} else {
							//未更改头像
							this.changeTeacher()
						}
					} else {
						this.$message({
							showClose: true,
							message: '请输入内容（*为必填项）',
							type: 'error', duration: this.msgDuration
						})
						return false;
					}
				});
			},
			/**
			 *  @function: 教师修改点击取消
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			resetChange() {
				//console.log('点击取消!');
				this.changeDialog = false;
			},
			/**
			 *  @function: 上传档案按钮点击
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			upLoad(status) {
				//console.log("区分点击上传按钮")
				//status 区分点击上传按钮
				/**
				 *  teacher：教师
				 *  compress：图片上传选择文件
				 */
				if(status == "teacher"){
					//console.log('学生上传选择文件')
					$('#teacher_file').click();
				} else if(status == "compress"){
					//console.log('图片上传选择文件')
					$('#compress_file').click();
				}
				
			},
			/**
			 *  @function: 上传档案中模板下载按钮点击
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			downloadFile() {
				//console.log("上传档案中模板下载按钮点击111")
			},
			/**
			 *  @function: 导出档案
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			exportFile() {
				//console.log("导出档案")
				let vThis = this;
				// $('#exportClientForm').ajaxSubmit({
					// beforeSend: function(xhr) {
					// 	// xhr.setRequestHeader("Content-Type",'application/json')
					// 	xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
					// }
				// })
				
				// $('#exportClientForm').ajaxForm({
				// 	headers:{"Authorization": 'Token ' + localStorage.getItem('token') },
				// 	success: function (responseText, statusText, xhr, $form) {
						// console.log('form success回调', responseText)
				// 		// $('#exportClientForm').submit();
				// 	},
				// });

				// $('#exportClientForm').ajaxSubmit({
				// 	// url : vThis.serverUrl +'userInfo/exportTeacher',
				// 	// type : 'post',
				// 	// dataType : 'json',
				// 	headers:
				// 	{
				// 		"Authorization": 'Token '+localStorage.getItem('token')
				// 	},
				// 	// beforeSend: function(xhr) {
				// 	// 	// xhr.setRequestHeader("Content-Type",'application/json')
				// 	// 	xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
				// 	// },
				// 	success: function (responseText, statusText, xhr, $form) {
						// console.log('form success回调', responseText)
						
				// 	},
				// 	error: function (xhr, status, err) {
						// console.log('form error回调',xhr, status, err)
				// 		vThis.$alert(err, '提示', {confirmButtonText: '确定'});
				// 	}
				// })

				$('#exportClientForm').submit();
			},
			formLoad1(){
				let vThis = this;
				let options = {
					// dataType: 'json',
					beforeSend: function(xhr) {
						// xhr.setRequestHeader("Content-Type",'application/json')
						xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
					},
					beforeSubmit: function (formData, jqForm, options) {
						
					},
					success: function (responseText, statusText, xhr, $form) {
						//console.log('form success回调', responseText)
						Loading.service().close();
						if(responseText.code == 600){
							//验证成功
							vThis.validateShow = true;
							vThis.errListData = [];
							vThis.succNum = responseText.data.saveCount;
							vThis.threadId = responseText.data.threadId;
							vThis.$message({
								showClose: true,
								message: '上传成功',
								type: 'success',
								duration: vThis.msgDuration
							})
							vThis.getTableList();//表格列表内容
						}else if(responseText.code == 602){
							//验证失败
							vThis.validateShow = true;
							vThis.errListData = responseText.data.records;
							if(vThis.errListData.length > 0){
								setTimeout(() => {
									let errTableHeight = $('.import-b').height() - $('.validate-tip').height() -140;
									$('.err-table-box .el-table').css({"max-height":errTableHeight})
								})
							}
						}else{
							vThis.isToast = true;
							vThis.toast = responseText.msg;
						}
					},
					error: function (xhr, status, err) {
						//console.log('form error回调',xhr, status, err)
						Loading.service().close();
						vThis.isToast = true;
						vThis.toast = err.msg?err.msg:"请求未响应";
					}
				};
				$('#teacherForm').submit(function () {
					//初始化
					$(this).ajaxSubmit(options);
					return false;   //防止表单自动提交
				});
			},
			formLoad2(){
				let vThis = this;
				let options = {
					// dataType: 'json',
					beforeSend: function(xhr) {
						// xhr.setRequestHeader("Content-Type",'application/json')
						xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
					},
					beforeSubmit: function (formData, jqForm, options) {
						
					},
					success: function (responseText, statusText, xhr, $form) {
						//console.log('form success回调',responseText.code, responseText)
						Loading.service().close();
						if(responseText.code == 600){
							vThis.photoValidateShow = true;
							if(responseText.data.succData.length>0){
								vThis.succPhtotListData = responseText.data.succData;
							}else{
								vThis.succPhtotListData = [];
							}
							vThis.succNum = responseText.data.saveCount;
							vThis.errPhtotListData = [];
							if(vThis.errPhtotListData.length > 0 || vThis.succPhtotListData.length > 0){
								setTimeout(() => {
									let errTableHeight = $('.import-b').height() - $('.validate-tip').height() -140;
									$('.err-table-box .el-table').css({"max-height":errTableHeight})
								})
							}
							vThis.$message({
								showClose: true,
								message: '上传成功',
								type: 'success',
								duration: vThis.msgDuration
							})
							vThis.getTableList();
						}else if(responseText.code == 602){
							//验证失败
							vThis.photoValidateShow = true;
							vThis.succPhtotListData = [];
							vThis.errPhtotListData = responseText.data.resData;
							if(vThis.errPhtotListData.length > 0 || vThis.succPhtotListData.length > 0){
								setTimeout(() => {
									let errTableHeight = $('.import-b').height() - $('.validate-tip').height() -140;
									$('.err-table-box .el-table').css({"max-height":errTableHeight})
								})
							}
						}else{
							vThis.isToast = true;
							vThis.toast = responseText.msg;
						}
						
					},
					error: function (xhr, status, err) {
						//console.log('form error回调',xhr, status, err)
						Loading.service().close();
						vThis.isToast = true;
						vThis.toast = err.msg?err.msg:"请求未响应";
					}
				};
				$('#compressForm').submit(function () {
					//初始化
					$(this).ajaxSubmit(options);
					return false;   //防止表单自动提交
				});
			},
			formLoad3(){
				let vThis = this;
				let options = {
					// dataType: 'json',
					beforeSend: function(xhr) {
						// xhr.setRequestHeader("Content-Type",'application/json')
						xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
					},
					beforeSubmit: function (formData, jqForm, options) {

					},
					success: function (responseText, statusText, xhr, $form) {
						//console.log('form success回调',responseText.code, responseText)
						Loading.service().close();
						if(responseText.code == 600){
							vThis.validateShow = false;
							vThis.importShow = false;
							vThis.$message({
								showClose: true,
								message: '上传成功',
								type: 'success',
								duration: vThis.msgDuration
							})
							vThis.getTableList();//表格列表内容
						}else{
							vThis.isToast = true;
							vThis.toast = responseText.msg;
						}
						
					},
					error: function ( err) {
						//console.log('form error回调', err)
						Loading.service().close();
						vThis.isToast = true;
						vThis.toast = err.msg?err.msg:"请求未响应";
					}
				};
				$('#saveStudent').submit(function () {
					//初始化
					$(this).ajaxSubmit(options);
					return false;   //防止表单自动提交
				});
			},
			/**
			 *  @function: 上传压缩文件事件
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			compressFile(event) {
               //console.log(111,event)
				let files = event.target.files;
				if (files.length > 0) {
					this.compressText = files[0].name
				}
				//console.log(files)
			},
			/**
			 *  @function: 选择命名方式
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			radioClick(value) {
				this.radioVal = value;
				if (value == 1) {
					//console.log(value, "工号命名")
				} else {
					//console.log(value, "姓名命名")
				}
			},
			/**
			 *  @function: 新增教师修改照片
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			addPhoto() {
				$('#add-img').click()
			},
			/**
			 *  @function: 修改教师资料修改照片
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			changePhoto() {
				$('#change-img').click()
			},
			/**
			 *  @function: 上传文件方法
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			uploadFile(event, source) {
				//console.log(111, source, event)
				let files = event.target.files;
				if (files.length > 0) {
					if (source == 'add') {
						//新增教师图片上传
						this.fileList(event.target, source);
					} else if (source == 'change') {
						//修改教师资料图片上传
						this.fileList(event.target, source);
					} else if (source == 'compress') {
						//导入档案照片，上传压缩文件
						this.compressText = files[0].name;
					} else if (source == 'download') {
						//新建档案照片，上传压缩文件
						this.fileText = files[0].name;
					}
				}
			},
			fileList(fileList, source) {
				let files = fileList.files;
				//console.log("fileList:", files)
				for (let i = 0; i < files.length; i++) {
					//判断是否为文件夹
					if (files[i].type != '') {
						this.fileAdd(files[i], source);
					} else {
						//文件夹处理
						this.folders(fileList.items[i], source);
					}
				}
			},
			//文件夹处理
			folders(files, source) {
				let _this = this;
				//判断是否为原生file
				if (files.kind) {
					files = files.webkitGetAsEntry();
				}
				files.createReader().readEntries(function (file) {
					for (let i = 0; i < file.length; i++) {
						if (file[i].isFile) {
							_this.foldersAdd(file[i], source);
						} else {
							_this.folders(file[i], source);
						}
					}
				})
			},
			foldersAdd(entry, source) {
				let _this = this;
				entry.file(function (file) {
					_this.fileAdd(file, source)
				})
			},
			fileAdd(file, source) {
				let vThis = this;
				if (this.limit !== undefined) this.limit--;
				if (this.limit !== undefined && this.limit < 0) return;
				//总大小
				this.size = this.size + file.size;
				// console.log("图片文件格式")
				//判断是否为图片文件
				if (file.type.indexOf('image') == -1) {
					file.src = 'default.png';
					this.imgList = file;
					//console.log('imgList1', this.imgList)
				} else {
					let suffixIndex=file.name.lastIndexOf(".");
                    let suffix=file.name.substring(suffixIndex+1).toUpperCase();
                    if(suffix!="BMP"&&suffix!="JPG"&&suffix!="JPEG"&&suffix!="PNG"){
                        this.$message({
                            showClose: true,
                            message: "仅支持jpg、jpeg、png格式，请重新选择！",
                            type: "warning",
                            duration: this.msgDuration
                        });
                        return
                    }
					let reader = new FileReader();
					reader.vue = this;
					reader.readAsDataURL(file);
					reader.onload = function () {
						file.src = this.result;
						if (source == 'add') {
							//新增教师图片上传
							vThis.imgList[0] = file;
							vThis.addImgUrl = reader.result;
						} else if (source === 'change') {
							//修改教师资料图片上传
							vThis.imgList[0] = file;
							vThis.changeImgUrl = reader.result
							// vThis.changeData.userPhoto = reader.result
						}
//                        this.vue.form.imgSrc = this.result;
						//console.log('imgList2', vThis.imgList[0].size)
					}
				}
			},
			/**
			 *  @function: 新建档案上传按钮点击
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			addUpload() {
				//console.log('新建档案上传按钮点击')
				if(this.fileText == ''){
					this.$message({
						showClose: true,
						message: '请选择文件',
						type: 'warning',
						duration: this.msgDuration
					})
					return
				}
				Loading.service();
				$('#teacherForm').submit();
				return
				//进度条
				// Loading.service({
				// 	lock: true,
				// 	text: '当前已上传100条，剩余200条',
				// 	spinner: 'el-icon-loading',
				// 	background: 'rgba(0, 0, 0, 0.4)'
				// });
				// setTimeout(() => {
				// 	Loading.service().close();
				// }, 2000);
			},
			/**
			 *  @function: 导入档案照片上传点击
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			compressUpload() {
				//console.log('导入档案照片上传点击')
				if(this.compressText == ''){
					this.$message({
						showClose: true,
						message: '请选择文件',
						type: 'warning',
						duration: this.msgDuration
					})
					return
				}
				Loading.service();
				$('#compressForm').submit();
				return
				//进度条
				// Loading.service({
				// 	lock: true,
				// 	text: '当前已上传100条，剩余200条',
				// 	spinner: 'el-icon-loading',
				// 	background: 'rgba(0, 0, 0, 0.4)'
				// });
				// // const loading = this.$loading();
				// setTimeout(() => {
				// 	Loading.service().close();
				// }, 2000);
			},
			/**
			 *  @function: 生成账号密码上传点击
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			creatPwdClick(value,funcName) {
				//console.log('生成账号密码上传点击');
				//去掉生成账号密码，固定使用 123456 2018-09-20
				// let state = this.formOutTest(value,funcName);
				// if(state){
					Loading.service();
					let params = {
						// paramValue:this.encrypt(value),
						paramValue:value,
						schoolId:localStorage.getItem('schoolId')
					}
					this.$api.BasicInfo.setSysPwdTeacher(params).then(res =>{
						Loading.service().close();
						//console.log('生成账号密码:', res.data.data)
						if (res.data.code == 600 || res.data.code == 0) {
							this.importShow = false;
							this.$message({
								showClose: true,
								message: res.data.msg,
								type: 'success',
								duration: this.msgDuration
							})
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				// }
			},
			/**
			 *  @function: 设置光标始终在文本框最后
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			setCaretPosition(tObj, sPos) {
				//console.log(tObj, sPos)
				if (tObj.setSelectionRange) {
					setTimeout(function () {
						tObj.setSelectionRange(sPos, sPos);
						tObj.select();
						tObj.focus();
					}, 0);
				} else if (tObj.createTextRange) {
					let rng = tObj.createTextRange();
					rng.move('character', sPos);
					rng.select();
				}
			},

			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			handleCurrentChange(val) {
				//console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.getTableList();//加载表格列表
			},
			/**
			 *  @function: 新增--选择部门树
			 *  @author: cs-l
			 *  @date 2018-7-31
			 **/
			selectDeparment(node) {
				//console.log('selectDeparment', node, node.group);
				if (node.group != 101) {
					this.formInline.userDep = node.id;//选中部门id(新增)
					this.formInline.userDepname = node.label;//选中部门名(新增)
					this.changeData.userDep = node.id;//选中部门id(修改)
					this.changeData.userDepname = node.label;//选中部门名(修改)
				} else {
					this.formInline.userDep = '';//选中部门id(新增)
					this.formInline.userDepname = '';//选中部门id(新增)
					this.changeData.userDep = '';//选中部门id(修改)
					this.changeData.userDepname = '';//选中部门名(修改)
					this.$message({
						showClose: true,
						message: '请选择部门',
						type: 'warning', duration: this.msgDuration
					})
				}
				//console.log('this.changeData', this.changeData)
				this.transferState = false;//关闭下拉框
			},
			/**
			 *  @function: 新增--选择班级树
			 *  @author: cs-l
			 *  @date 2018-7-31
			 **/
			selectClass(node) {
				// console.log('selectClass',node);
				if (node.group == 105) {
					let userDepname = this.getClassName(this.classTreeData,node.id)
					this.formInline.teacherClass = node.id;//选中班级id（新增）
					this.formInline.className = userDepname;//选中班级id（新增）
					this.changeData.teacherClass = node.id;//选中班级id（修改）
					this.changeData.className = userDepname;//选中班级id（修改）
				} else {
					this.formInline.teacherClass = '';//选中班级id（新增）
					this.formInline.className = '';//选中班级id（新增）
					this.changeData.teacherClass = '';//选中班级id（修改）
					this.changeData.className = '';//选中班级id（修改）
					this.$message({
						showClose: true,
						message: '请选择班级',
						type: 'warning', duration: this.msgDuration
					})
				}
				this.classTreeState = false;//关闭下拉框
			},
			/**
			 *  @function:获取点击年级名称+班级名称
			 *  @author: cs
			 *  @date 2018-08-06
			 **/
			getClassName(searchData,searchVal,onName) {
				let resultArr = '';     //数组清空
				let vThis = this;
				let classArr = ''
				function ifArrVal(arr, value) {//多维数组判断是否存在某值
					for (let i = 0; i < arr.length; i++) {
						if (arr[i].children instanceof Array) {//判断是否为多维数组
							if (arr[i].children.length > 0) {
								for(let k=0;k<arr[i].children.length;k++){
									if(arr[i].children[k].children.length == 0){
										if(arr[i].children[k].id == value){
											classArr = arr[i].label;
											if(arr[i].group == 101){
												classArr = '';
											}
											// console.log(6666666666666,classArr)
										}
									}
								}
								ifArrVal(arr[i].children, value);
							} else {
								// if(arr[i].id == value){
								// // if(arr[i].id == value && arr[i].group == 105){
								// 	resultArr = arr[i].label
									// console.log(1112212,resultArr)
								// }
								//通过group判断是否选中的是班级
								if (arr[i].id == value && arr[i].group != 101) {
									resultArr = arr[i].label;
									if(onName){
										vThis.oneNameId = arr[i].id;
										//console.log(1112212,resultArr,vThis.oneNameId)
										break;
									}
								}else{
									if(onName){
										vThis.oneName = '';
									}
									// console.log(1474147147)
								}
							}
						}
					}
					return -1;//不存在
				}

				ifArrVal(searchData, searchVal)
				classArr?resultArr = classArr +` `+ resultArr:resultArr = resultArr;//选中部门不包括根级目录
				// resultArr = classArr +` `+ resultArr;
				// resultArr = resultArr;
				//console.log(999, resultArr)
				return resultArr
			},
			/**
			 *  @function: 上传图片
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			ajaxPic(imgBase, cb) {
				//base64 为 图片的base64格式;value 为 ;cb为图片上传成功后的回调
				this.$api.Common.getQiniuUploadToken({
					isOverride:1,
					expireSeconds:3600
				}).then( res =>{
					//console.log('获取token:', res.data)
					if (res.data.code == 600 || res.data.code == 0) {
						let filename = Date.parse(new Date()) / 1000 + Math.random().toString(20) + '.jpg',
							f = new FormData(),
							blob = this.dataURItoBlob(imgBase) // 上一步中的函数
						f.append('token', res.data.data)
						f.append('file', blob)
						f.append('key', filename)
						//上传图片
						this.$api.Common.uploadQiniu(f).then(data => {
							// console.log('上传图片:', data.data.key)
							return cb(data.data.key)
						})
					}else{
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 教师新增 后台接口
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			addTeacher(key) {
				//console.log("key:", key,this.formInline)
				let jsonParam = {
					schoolId: localStorage.getItem('schoolId'),
					// schoolName: localStorage.getItem('schoolName'),//学校名称180801确定不传
					userNo: this.formInline.userNo,//工号
					userName: this.formInline.userName,//姓名
					userDep: this.formInline.userDep ? this.formInline.userDep : "20001",//部门id
					userDepname: this.formInline.userDepname,//部门名称
					userTel: this.formInline.userTel,//手机号
					userDuty: this.formInline.userDuty ? this.formInline.userDuty : '',//职务
					teacherClass: this.formInline.teacherClass ? [this.formInline.teacherClass] : [''],//管理班级
					userPassword: this.encrypt('123456'),//密码(AES加密)
					userPhoto: key ? key : '',
					userType: 3,//档案类型(1:学生；2：家长；3：教师)
				}
				//console.log("教师新增参数：", JSON.stringify(jsonParam))
				this.$api.BasicInfo.addTeacher(jsonParam).then( res => {
					Loading.service().close();
					//console.log('新增教师返回 res.data:', res.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.$message({
							showClose: true,
							message: '新增成功',
							type: 'success', duration: this.msgDuration
						})
						this.addDialog = false;
						this.getTableList();//表格列表内容
					} else {
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: 'error', duration: this.msgDuration
						})
					}
				}).catch(err =>{
                    Loading.service().close();
                })
			},
			/**
			 *  @function: 教师修改 后台接口
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			changeTeacher(key) {
				//console.log("key:", key,this.changeData)
				let jsonParam = {
					schoolId: localStorage.getItem('schoolId'),
					// schoolName: localStorage.getItem('schoolName'),//学校名称180801确定不传
					teacherClass: this.changeData.teacherClass ? [this.changeData.teacherClass] : [''],//管理班级
					userDep: this.changeData.userDep ? this.changeData.userDep : "20001",//部门id
					userDepname: this.changeData.userDepname,//部门名称
					userDuty: this.changeData.userDuty ? this.changeData.userDuty : '',//职务
					userName: this.changeData.userName,//姓名
					userNo: this.changeData.userNo,//工号
					userPassword: this.encrypt(localStorage.getItem('userPwd')),//密码(AES加密)
					userPhoto: key ? key : this.changeData.userPhoto,
					userSerial: this.changeData.userSerial,
					userTel: this.changeData.userTel,//手机号
					userType: 3,//档案类型(1:学生；2：家长；3：教师)
				}
				//console.log("教师修改参数：", JSON.stringify(jsonParam))
				this.$api.BasicInfo.modifyTeacher(jsonParam).then( res => {
					Loading.service().close();
					//console.log('修改教师返回 res.data:', res.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.$message({
							showClose: true,
							message: '修改成功',
							type: 'success', duration: this.msgDuration
						})
						this.changeDialog = false;
						this.getTableList();//表格列表内容
					} else {
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: 'error', duration: this.msgDuration
						})
					}
				}).catch(err =>{
                    Loading.service().close();
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
			 *  @function: 选择职位切换不同rule规则
			 *  @author: lxr
			 *  @date 2018-08-07(新需求)
			 **/
			selectDuty(id){
				// console.log('selectDuty', id)
				//切换rule规则
				if(id == 1){//班主任--必须填写管理班级
					this.rules = this.rules1;
					this.classShow = false;
				}else if(id == 2){//教师--不准填写管理班级
					this.rules = this.rules2;
					this.classShow = true;
					this.formInline.teacherClass = '';
					this.changeData.teacherClass = '';
					this.formInline.className = '';
					this.changeData.className = '';
				}
				// console.log("this.oneName",this.oneName)
			},

			/**
			 *  @function: 获取table数据列表
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			getTableList(deeId, cb) {
				this.tableLoading = true;
				let jsonParam = {
					"count": true,
					"page_index": this.currentPage,
					"page_size": this.pageSize,
					"search": {
						"searchType": 0,//0教师 1学生家长
						userNameLike: this.searchVal,
						"userDep": deeId?[deeId]:this.checkedKeys,
						schoolId: localStorage.getItem('schoolId'),
						userDutys:this.userDutys,//1:班主任  2：教师
					}
				}
				// console.log(JSON.stringify(jsonParam))
				this.$api.BasicInfo.getTableListTeacher(jsonParam).then( res => {
					//console.log('学生家长table列表', res.data)
					this.tableLoading = false;
					if (res.data.code == 600 || res.data.code == 0) {
						if(deeId){
							if(res.data.data.records.length > 0){
								cb(true);
							}else{
								cb(false);
							}
						}else{
							this.listData = res.data.data.records;
							this.listData.forEach((item) => {
								let str = '';
								if (!item.className) return
								str = item.className
								let splitArr = str.split('/')
								if (splitArr.length >= 2) {
									item.className = splitArr[splitArr.length - 2] + ' ' + splitArr[splitArr.length - 1]
								}
							})
							this.pageAllNum = res.data.data.total_record;//表格内容总数量
							//获取过滤数据
							let r, roleGroup = [];
							$.each(this.listData, function (a,b) {      //添加序号，切换页面序号连增
								if(b.dicFmtMap.userDutycn){
									roleGroup.push(b.dicFmtMap.userDutycn);//找出角色组部分
								}
							})
							// r = roleGroup.filter(function(element,index,self){
							// 	return self.indexOf(element) == index;     //indexOf只返回元素在数组中第一次出现的位置，如果与元素位置不一致，说明该元素在前面已经出现过，是重复元素
							// })
							// let filter = [];
							// $.each(r, function (j, c) {
							// 	console.log(j,c)
							// 	let aa = {}
							// 	aa.text = c;
							// 	aa.value = c;
							// 	filter[j] = aa
							// })
							// this.filtersData = filter;//设置过滤数据
						}
						if(this.listData.length == 0){
							this.teacherShow = true;
						}else {
							this.teacherShow = false;
						}
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    this.tableLoading = false;
                })
			},
			/**
			 *  @function: 获取左侧树的数据(部门)
			 *  @author: cs-l
			 *  @date 2018-7-31
			 **/
			getTreeData() {
				let jsonParam = {
					schoolId: localStorage.getItem('schoolId')
				}
				this.$api.Common.getTreeListTeacher(jsonParam).then( res => {
					//console.log('部门数据', res.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.treeData = res.data.data;
						this.resizeInputWidth();//重定义input宽
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载班级
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			loadStructure() {
				let jsonParam = {
					schoolId: localStorage.getItem('schoolId')
				}
                this.$api.Common.getTreeListStudent(jsonParam).then(res => {
					//console.log('加载班级', res)
//	                    return
					if (res.data.code == 600 || res.data.code == 0) {
						this.classTreeData = res.data.data;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 获取职位信息
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			getJob() {
				let jsonParam = {
					"codeNo": "CD1004",
					"deptId": 0
				}
				this.$api.BasicInfo.getJobTeacher(jsonParam).then( res => {
					// console.log('获取职位信息', res.data.data.CD1004)
					if (res.data.code == 600 || res.data.code == 0) {
						this.jobData = res.data.data.CD1004;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function页面布局初始化的功能
			 *  @author: wzx
			 *  @date 2018-7-12
			 **/
			initLayout() {
				setTimeout( ()=> {
					//计算table高度
					let icH = $('.index > .m-cen').height();
					let vHeight = $('.teachers-record').height() - $('.right-t').height();
					$('.right-b').height(vHeight);
					let tblH = icH - $('.teachers-record .right-t').height() - $('.pagination').height();
					$('.teachers-record .right-b .table-box').height(tblH);
					let vHeight1 = $('.left').height() - $('.left .top').height() - 30;
					$('.left .bot').height(vHeight1);
				}, 20)
			},

			/**
			 * ----------------二期------------------
			 *  @function:成功或失败验证重新上传按钮点击
			 *  @author: cs
			 *  @date: 2018-08-29
			 **/
			alignUpload(status) {
				//console.log("成功或失败验证重新上传按钮点击")
				if(status == 'validate'){
					this.validateShow = false;
					this.fileText = '';
					document.getElementById("teacherForm").reset(); 
				}else if(status == 'photo'){
					this.photoValidateShow = false;
					this.compressText = '';
					document.getElementById("compressForm").reset(); 
				}
			},
			/**
			 *  @function:验证成功后保存按钮
			 *  @author: cs
			 *  @date: 2018-08-29
			 **/
			confirmUpload() {
				//console.log("验证成功后保存按钮")
				// Loading.service();
				// $("#saveStudent").submit();
				this.validateShow = false;
				this.importShow = false;
				
			},
			/**
			 *  @function:图片上传验证成功后保存按钮
			 *  @author: cs
			 *  @date: 2018-08-29
			 **/
			photoConfirmUpload() {
				//console.log("验证成功后保存按钮")
				this.photoValidateShow = false;
				this.validateShow = false;
			},
			
			/**
			 *  ----------------三期------------------
			 *  @function:重置密码
			 *  @author: cs
			 *  @date: 2018-11-24
			 **/
			reastPwd(row) {
				// console.log("重置密码：",row)
				this.currentRowData = row;
				this.$confirm(`${row.userName?row.userName+'的':''}密码将被重置为123456，是否确认？`, '重置密码', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					let params = {
						newPass:this.encrypt(123456),
						userId:row.userSerial
					}
					Loading.service();
					this.$api.BasicInfo.reastPassword(params).then(res => {
						// console.log('重置密码 res：', res.data)
						Loading.service().close();
						if (res.data.code == 600 || res.data.code == 0) {
							this.$message({type: 'success', message: '重置成功，使用新密码登录',duration: this.msgDuration});
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}).catch(() => {//点击取消按钮
					// this.$message({type: 'info', message: '已取消重置密码',duration: this.msgDuration});
				});
			},
			/**
			 *  @function:删除账户按钮点击
			 *  @author: cs
			 *  @date: 2018-11-24
			 **/
			delAccountClick(row) {
				// console.log("删除账户按钮点击",row)
				this.delDialog = false;
				this.$confirm('此操作将永久删除，是否继续？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					Loading.service();
					let params = {
						"userList": row.userSerial//人员id，逗号间隔
					}
					this.$api.BasicInfo.delUserTeacher(params).then(res =>{
						// console.log('批量离职:', res.data)
						Loading.service().close();
						if (res.data.code == 600 || res.data.code == 0) {
							this.$message({
								showClose: true,
								message: '删除成功',
								type: 'success', duration: this.msgDuration
							})
							this.getTableList();//表格列表内容
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}).catch(() => {//点击取消按钮
					// this.$message({type: 'info', message: '已取消删除',duration: this.msgDuration});
				});
			},
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.getTreeData();//获取部门数据（左侧树）
			this.getTableList();//表格列表内容
			this.loadStructure();//获取班级数据(新增弹窗里的)
			this.getJob();//获取职位(新增弹窗里的)
			this.initLayout();
			this.formLoad1();//导入档案form准备
			this.formLoad2();//导入照片form准备
			// this.formLoad3();//导入档案保存准备
			let vThis = this;
			//下拉树形控件弹窗隐藏的功能
			document.body.onclick = function (e) {
				if ($(e.target).closest(".deparment").length == 0) {
					//点击.deparment之外，则触发
					vThis.transferState = false;
				}
				if ($(e.target).closest(".class").length == 0) {
					vThis.classTreeState = false;
				}
			}
		},
		created() {
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    * {
        box-sizing: border-box;
    }
    .teachers-record {
        width: 100%;
		height: 100%;
        .center {
            width: 100%;
            height: 100%;
            display: flex;
            text-align: center;
            .left {
                flex-basis: 330px;
                min-width: 330px;
                text-align: center;
                border-right: 1px solid #e1e1e1;
                .top {
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
                .bot {
                    padding-top: 30px;
                    padding-left: 30px;
                    position: relative;
                    .inner {
                        width: 100%;
                        height: 100%;
                        overflow: auto;
                        .custom-tree-node {
                            line-height: 26px;
                            display: inline;
                            .span {
                                color: #333;
                                padding-left: 5px;
                                padding-right: 5px;
                                text-align: center;
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
                }
            }
            .right {
                flex: 1;
                position: relative;
                overflow: hidden;
                .right-t {
                    width: 100%;
                    min-height: 60px;
                    line-height: 60px;
                    border-bottom: 1px solid #e1e1e1;
                    text-align: left;
                    display: flex;
                    .top-l {
                        flex: 1;
                        dd {
                            width:100px;
                            font-size: 16px;
                            font-weight: bold;
                            display: inline-block;
                            color: #333;
                            margin-left: 30px;
                            margin-right: 5px;
                        }
                       /deep/ .button-div {
                            margin-left: 25px;
                            height: 38px !important;
                            > div {
                                height: 38px;
                            }
                            &:nth-of-type(1) {
                                .custom6 {
                                    background-color: #1cab7d;
                                    color: #fff;
                                    border: 1px solid #1cab7d;
                                    &:hover {
                                        background-color: #1b9a71;
                                    }
                                }
                            }
                            &:nth-of-type(2) {
                                .custom6 {
                                    background-color: #1cab7d;
                                    color: #fff;
                                    border: 1px solid #1cab7d;
                                    &:hover {
                                        background-color: #1b9a71;
                                    }
                                }
                            }

                        }
                    }
                    .top-r {
                        flex-basis: 240px;
                        height: 100%;
                        position: relative;
                        input {
                            border: 1px solid #e1e1e1;
                            outline: none;
                            height: 30px;
                            line-height: 30px;
                            color: #999;
                            padding: 0 20px;
                            width: 200px;
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
                .right-b {
                    /deep/ .el-table, .el-table__body-wrapper {
                        overflow: auto;
                    }
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
                    .el-table__header {
                        thead {
                            tr {
                                cursor: default;
                            }
                        }
                    }
                    tr {
                        text-align: center;
                        cursor: pointer;
                        th {
                            font-weight: normal;
                            /*color: #333;*/
                            height: 5vh;
                            text-align: center;
                        }
                        td {
                            font-size: 12px;
                            height: 5vh;
                            /*color: #666;*/
                        }
                    }
                    .el-table__row:hover {
                        td {
                            background-color: #f9fffc;
                        }

					}
                    .preview {
                        color: #1cab7d;
                        position: relative;
                        .preview-img {
                            position: absolute;
                            right: 26px;
                            bottom: 12px;
                            z-index: 10;
                            background-color: #f2f2f2;
                            display: none;
                            width: 140px;
                            height: 180px;
                            -webkit-transition: 0.3s;
                            -moz-transition: 0.3s;
                            -ms-transition: 0.3s;
                            -o-transition: 0.3s;
                            transition: 0.3s;
                            img {
                                max-width: 100%;

                                position: absolute;
                                left: 0;
                                bottom: 0;
                                top: 0;
                                right: 0;
                                margin: auto;
                            }
                        }
                        &:hover {
                            .preview-img {
                                display: block;
                            }
                        }
                    }
                    .pagination {
                        width: 100%;
                        height: 60px;
                        background: #fff;
                        box-sizing: content-box;
                        .el-pagination {
                            padding-top: 15px;
                        }
                    }
                }
                /*批量输入输出盒子*/
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
                        min-height: 7vh;
                        line-height: 7vh;
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
						overflow: hidden;
						padding: 0 40px;
                        h5 {
                            font-size: 14px;
                            margin-top: 30px;
                            font-weight: normal;
                            text-align: left;
                        }
                        .tip {
                            padding: 20px;
                            margin: 20px 0;
                            font-size: 12px;
                            color: #999;
                            text-align: left;
                            background-color: #FDFDFD;
                            border: 1px solid #e1e1e1;
                        }
                        .top-nav {
							margin-top: 30px;
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
                            .btn-bot {
                                .button-div {
                                    margin-top: 5vh;
                                }
                            }
                        }
                    }
                }
				/*上传验证盒子*/
				.validate-box{
					z-index: 11;
					.validate-tip{
						position: relative;
						margin: 20px 0;
						h5{
							width: 60px;
							height: 20px;
							position:absolute;
							top: 0;
							left: 0;
							bottom: 0;
							margin: auto;
						}
						p{
							background-color: #FFF3DF;
							font-size: 14px;
							border: 1px solid #F39800;
							border-radius: 6px;
							text-align: left;
							margin-left: 80px;
							padding: 10px 25px;
						}
					}
					.err-table-box{
						height: auto;
						 .el-table, .el-table__body-wrapper {
							overflow: auto;
						}
					}
					.err-btn{
						margin-top: 30px;
					}
				}
            }
        }
        /*新增教师弹窗*/
        .add-box {
           /deep/ .el-dialog {
                overflow: initial;
                width: 750px;
                border-radius: 10px;
                .el-dialog__header {
                    padding-top: 30px;
                    position: relative;
                    overflow: hidden;
                    .el-dialog__title {
                        font-size: 22px;
                        font-weight: bold;

                    }
                    .el-dialog__headerbtn {
                        width: 100px;
                        height: 100px;
                        border-radius: 50%;
                        top: -50px;
                        right: -50px;
                        .el-dialog__close {
                            color: #fff;
                            font-size: 25px;
                            font-weight: bold;
                            position: absolute;
                            left: 17px;
                            top: 57px;
                        }
                    }
                }
                .el-dialog__body {
                    padding: 20px 50px 25px 50px;
                    border: 0;
                    margin: 0;
                    background: #fff;
                    .content {
                        display: flex;
                        border: 1px solid #e1e1e1;
                        border-radius: 5px;
                        width: 650px;
                        min-height: 350px;
                        background-color: #fdfdfd;
                        padding-bottom: 20px;
                        .content-l {
                            flex: 2;
                            padding-top: 40px;

                            input {
                                border-radius: 5px;
                                line-height: 1;
                                border: 1px solid #E5E5E5;
                                font-size: 12px;
                                &:focus {
                                    border: 1px solid #1cab7d;
                                    outline: none;
                                }
                            }
							.el-form{
								text-align:left;
							}
                            .el-form-item {
                                width: 47%;
                                .el-form-item__label {
                                    width: 40%;
                                }
                                .el-form-item__content {
                                    width: 60%;
                                }
                            }
                            .binding {
                                width: 70%;
                                .el-form-item__label {
                                    width: 27%;
                                }
                                .el-form-item__content {
                                    width: 60%;
                                }
                            }
                            dt {
                                font-size: 12px;
                                color: #999;
                                margin-left: 23px;
                            }
                        }
                        .content-r {
                            flex: 1;
                            text-align: center;
                            padding-bottom: 30px;
                            .img-box {
                                width: 170px;
                                margin: 0 auto;
                                height: 220px;
                                margin-top: 10%;
                                position: relative;
                                background-color: #F2F2F2;
                                img {
                                    position: absolute;
                                    left: 0;
                                    bottom: 0;
                                    right: 0;
                                    top: 0;
                                    margin: auto;
                                    width: auto;
                                    height: auto;
                                    max-height: 100%;
                                    max-width: 100%;
                                }
                            }

                            .button-div {
                                width: 80%;
                                height: 38px;
                                margin-top: 12px;
                                background: #F2F2F2;
                                > div {
                                    height: 38px;
                                }
                            }
                            dd {
                                font-size: 12px;
                                color: #999;
                                margin-top: 8px;
                            }
                        }
                    }
                }
                .bot {
                    width: 250px;
                    margin: 0 auto;
                    margin-top: 25px;
                    .button-div {
                        width: 100px;
                        height: 38px;
                        background: #F2F2F2;
                        > div {
                            height: 38px;
                        }
                        &:nth-of-type(2) {
                            margin-left: 40px;
                        }
                    }
                }
                .transfer-content {
                    height: auto !important;
                    min-height: 0 !important;
                    text-align: center;
                    display: inline-block !important;
                    .transfer-top {
                        width: 123px;
                        height: 40px;
                        line-height: 40px;
                        position: relative;
                        margin-bottom: 3px;
                        padding-left: 15px;
                        border-radius: 5px;
                        border: 1px solid #E5E5E5;
                        text-align: left;
                        cursor: pointer;
                        background: #fff;
                        span {
                            font-size: 12px;
                            display: inline-block;
                            width: 75px;
                            overflow: hidden;
                            white-space: nowrap;
                        }
                        img {
                            position: absolute;
                            top: 0;
                            bottom: 0;
                            right: 12px;
                            margin: auto;
                            -webkit-transition: 0.3s;
                            -moz-transition: 0.3s;
                            -ms-transition: 0.3s;
                            -o-transition: 0.3s;
                            transition: 0.3s;
                            width: 12px;
                        }
                        .arrow-up {
                            -webkit-transform: rotate(-180deg);
                            -moz-transform: rotate(-180deg);
                            -ms-transform: rotate(-180deg);
                            -o-transform: rotate(-180deg);
                            transform: rotate(-180deg);
                        }
                    }
                    .inner-tree {
                        width: 150px;
                        width: auto;
                        min-width: 123px;
                        height: auto;
                        max-height: 250px;
                        overflow-y: auto;
                        padding: 15px 10px;
                        background: #fff;
                        position: absolute;
                        top: 50px;
                        left: 0px;
                        z-index: 20;
                        border: 1px solid #E1E1E1;
                        border-radius: 5px;
                        -webkit-box-sizing: content-box;
                        -moz-box-sizing: content-box;
                        box-sizing: content-box;
                    }
                }
                .class{
                    position: relative;
                    .disabled-div{
                        position:absolute;right: 0;top: 0;width: 100%;height: 40px;
                        background: rgba(140,140,140,0.1);
                        border-radius: 4px;
                        border: 1px solid #E5E5E5;
                        cursor: not-allowed;
                    }
                }
                .el-form-item__content{
                    line-height: 1;
                }
            }
        }
        .transfer {
            .name {
                font-size: 12px;
                color: #999;
                text-align: center;
                margin-bottom: 20px;
                dd {
                    display: inline-block;

                    &:nth-last-child(1) {
                        span {
                            display: none;
                        }

                    }
                }
            }
            .el-dialog__body {
                padding-top: 5px !important;
            }
            .transfer-select {
                min-height: 0 !important;
            }
            .transfer-content {
                height: auto !important;
                min-height: 0 !important;
                text-align: center;
                padding: 20px 0 !important;
                display: inline-block !important;
                margin: auto;

                .transfer-top {
                    width: 200px !important;
                    margin: 0 auto;
                    margin-bottom: 3px;
                    height: 40px;
                    line-height: 40px;
                    border-radius: 5px;
                    border: 1px solid #E5E5E5;
                    text-align: left;
                    padding-left: 20px;
                    cursor: pointer;
                    position: relative;

                    span {
                        color: #999;
                        width: 145px!important;
                    }
                    img {
                        position: absolute;
                        top: 0;
                        bottom: 0;
                        right: 15px;
                        margin: auto;
                        -webkit-transition: 0.3s;
                        -moz-transition: 0.3s;
                        -ms-transition: 0.3s;
                        -o-transition: 0.3s;
                        transition: 0.3s;
                        width: 15px;
                    }
                    .arrow-up {
                        -webkit-transform: rotate(180deg);
                        -moz-transform: rotate(180deg);
                        -ms-transform: rotate(180deg);
                        -o-transform: rotate(180deg);
                        transform: rotate(180deg);
                    }
                }
                .inner-tree {
                    width: 200px !important;
                    max-height: 300px;
                    border: 1px solid #e1e1e1;
                    overflow: auto;
                    /*margin-left: 224px!important;*/
                    border-radius: 5px;
                    position: relative !important;
                    left: inherit !important;
                    top: initial !important;
                }

            }

        }
        .leave-box {
            .leave-content {
                display: block !important;
                text-align: left;
                min-height: 0 !important;
                padding: 20px 0;
                padding-left: 200px;
                p {
                    width: 100%;
                    color: #333;
                    line-height: 20px;
                    font-size: 14px;
                    margin-bottom: 15px;
                    font-weight: bold;
                    img {
                        display: inline-block;
                        vertical-align: middle;
                        margin-right: 5px;
                    }
                }
                dd {
                    float: none;
                    display: block;
                    font-size: 12px;
                    line-height: 25px;
                }
            }
        }

    }
</style>
