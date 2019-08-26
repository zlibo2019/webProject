<template>
    <div class="parents-record">
        <div class="center">
            <!--部门和教师选择-->
            <div class="left">
                <div class="top">组织结构</div>
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
							<span class="custom-tree-node" slot-scope="{ node, data }">
								<input type="text" :value="data.label" :class="['span','input'+data.id]" disabled>
								<ul class="hover-show">
									<!--<li v-for="(item,index) in imgData" :key="index"
									         @click="treeClick(item.value,node, data,$event)">
										<img :src="item.imgNo" :alt="item.title" :title="item.title" class="img-no">
										<img :src="item.imgAc" :alt="item.title" :title="item.title" class="img-ac">
									</li>-->
                                    <!--<li @click="treeClick(1,node, data,$event)"
                                        v-if="data.group == 104 || data.lv == (lv-1)">-->
									<li @click="treeClick(1,node, data,$event)"
                                        v-if="data.group == 104 && roleActions.indexOf('组织架构_@bepf@dept@add_create_own') > -1">
										<img src="../../assets/images/add_no.png" alt="新增班级" title="新增班级" class="img-no">
										<img src="../../assets/images/add_ac.png" alt="新增班级" title="新增班级" class="img-ac">
									</li>
                                    <!--<li @click="treeClick(2,node, data,$event)" v-if="data.lv == lv">-->
									<li @click="treeClick(2,node, data,$event)" v-if="data.group == 105 && roleActions.indexOf('组织架构_@bepf@dept@delete_update_own') > -1">
										<img src="../../assets/images/del_no.png" alt="删除班级" title="删除班级" class="img-no">
										<img src="../../assets/images/del_ac.png" alt="删除班级" title="删除班级" class="img-ac">
									</li>
                                    <!--<li @click="treeClick(3,node, data,$event)"
                                        v-if=" data.lv == lv-1  && data.group != 104">
                                        <img src="../../assets/images/change_no.png" alt="修改名称" title="修改名称"
                                             class="img-no">
                                        <img src="../../assets/images/change_ac.png" alt="修改名称" title="修改名称"
                                             class="img-ac">
                                    </li>-->
									<li></li>
								</ul>
							</span>
                        </el-tree>
                    </div>
                    <transition name="slide">
                        <!--树形图新增弹窗-->
                        <div class="modal-wrap" v-show="addClassDialog">
                            <div class="modal-add" @click="closeAdd"></div>
                            <div class="add-content">
                                <div class="add-inner">
                                    <span style="color: #1cab7d;">{{addData.label}} </span>新增
                                    <input type="number" ref="addInput" v-model="addNum"
                                           @keyup.13="confirmAdd(addData)">
                                    {{addContent}}
                                </div>
                                <button class="btn" @click="closeAdd">取消</button>
                                <button class="btn confirm" @click="confirmAdd(addData)">确认</button>
                            </div>
                        </div>
                    </transition>
                    <!--树形图删除弹窗-->
                    <div class="modal-wrap" v-show="deeClassDialog">
                        <div class="modal-add" @click="closeAdd"></div>
                        <div class="add-content">
                            <div class="add-inner">
                                确定要删除 <span style="color: #1cab7d;">{{addData.label}} </span>么?
                            </div>
                            <button class="btn" @click="closeAdd">取消</button>
                            <button class="btn confirm" @click="confirmDee(addNode,addData)">确认</button>
                        </div>
                    </div>

                </div>
            </div>
            <!--列表展示-->
            <div class="right">
                <div class="right-t">
                    <div class="top-l">
                        <dd v-show="studentShow || listData.length == 0">0位学生</dd>
                        <dd v-show="listData.length>0">{{pageAllNum}}位学生</dd>
                        <btns btnClass="custom6" btnFontSize="12px" title="新增学生" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@add_create_own') > -1" @click="addClick" ></btns>
                        <btns btnClass="custom6" btnFontSize="12px" title="批量导入/导出" @click="importClick"></btns>
                        <btns btnClass="custom6" btnFontSize="12px" title="批量调动" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@modifyDep_update_own') > -1" @click="transferClick"></btns>
                        <btns btnClass="custom6" btnFontSize="12px" title="学生毕业" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@delStudents_update_own') > -1" @click="leaveClick"></btns>
                    </div>
                    <div class="top-r">
                        <input type="text" placeholder="请输入学号或姓名" ref="searchRef" v-model="searchVal"
                               @keyup.13="searchClick">
                        <img src="../../assets/images/search.png" alt="搜索" @click="searchClick">
                    </div>
                </div>
                <div class="right-b">
                    <el-table :span-method="objectSpanMethod" border
                              ref="multipleTable"
                              :data="listData"
                              height=" 100%"
							  v-loading="tableLoading"
                              tooltip-effect="dark"
                              style="width: 100%;"
                              @selection-change="handleSelectionChange">
                        <el-table-column label="学生档案">
                            <el-table-column type="selection" width="55"></el-table-column>
                            <el-table-column prop="userName" label="姓名"></el-table-column>
                            <el-table-column prop="userDepname" label="班级" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="userNo" label="学号" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="userPhoto" min-width="90" label="档案照片">
                                <template slot-scope="props">
                                    <el-popover trigger="hover" placement="bottom" v-if="props.row.userPhoto">
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
                        </el-table-column>
                        <el-table-column label="家长信息">
                            <el-table-column prop="family_name" min-width="90" label="家长姓名"></el-table-column>
                            <el-table-column prop="relationshipData" label="与学生关系" min-width="100"></el-table-column>
                            <el-table-column prop="tel" min-width="90" label="联系电话" show-overflow-tooltip></el-table-column>
                            <el-table-column prop="bandingOrder" min-width="90" label="账号类型"></el-table-column>
                            <el-table-column prop="isBandingApp" min-width="90" label="账号状态"></el-table-column>
                        </el-table-column>
						<el-table-column fixed="right" label="操作" min-width="300" align="center" >
							<template slot-scope="scope">
								<el-button class="normal" size="mini" plain @click="rowClick(scope.row)">修改</el-button>
								<el-button class="normal" size="mini" plain @click="reastPwd(scope.row)" v-if="roleNos.indexOf('S01') > -1">重置密码</el-button>
								<el-button class="warning" size="mini" plain @click="delAccountClick(scope.row)"
								v-if="scope.row.bandingOrder == '主账户' && roleNos.indexOf('S01') > -1">删除</el-button>
								<el-button class="normal" size="mini" plain @click="modifyAccountType(scope.row)"
								v-if="scope.row.bandingOrder != '主账户' && roleNos.indexOf('S01') > -1">更改为主账户</el-button>
								<!-- <el-button class="warning" size="mini" plain @click=""
										v-if="roleActions.indexOf('设备与场所_@bepf@devPlace@deleteInoutDev_delete_own') > -1">删除</el-button> -->
							</template>
						</el-table-column>
                    </el-table>
                    <div class="pagination">
                        <el-pagination
                                background
                                layout="prev, pager, next"
                                :page-size=pageSize
                                :current-page.sync="currentPage"
                                :total="pageAllNum"
                                @current-change="pageChange">
                        </el-pagination>
                    </div>
                </div>
                <!--批量导入导出盒子-->
                <div class="import-export" v-show="importShow">
                    <div class="import-t">
                        <btns btnClass="custom8" btnFontSize="12px" title="返回" @click="backClick('import')"></btns>
                    </div>
                    <div class="import-b">
                        <!-- <h5>温馨提醒</h5>
                        <div class="tip">
                            <span>完成学生档案的导入后需设置APP端登录的账号及密码。</span>
                        </div> -->
                        <ul class="top-nav">
                            <li v-for="(item,index) in recordData" :class="{'ac':index == ac}" :key="index" @click="navClick(index)">
                                {{item.title}}
                            </li>
                        </ul>
                        <!--新建学生档案-->
                        <div class="item1" v-show="ac==0">
                            <ul>
                                <li>
                                    <div class="item-left">1</div>
                                    <dt>下载学生档案模板，批量填写学生档案信息</dt>
									<!-- 汉字版本 -->
                                   	<a href='http://client.weds.com.cn/%E5%AD%A6%E7%94%9F%E5%AE%B6%E9%95%BF%E6%A1%A3%E6%A1%88%E6%A8%A1%E6%9D%BF%281%29.xlsx'>
									   <!-- 字母版本 -->
                                   	<!-- <a href='http://res-k12.weds.com.cn/xsd.xlsx'> -->
									<!-- 接口方式 -->
                                   	<!-- <a :href='this.serverUrl+"userInfo/download"'> -->
								    	<btns btnClass="custom8" btnFontSize="12px" title="下载" ></btns>
									</a>
                                </li>
                                <li>
                                    <div class="item-left">2</div>
                                    <dt>上传填写好的学生档案表</dt>
									 <form id="studentForm"
										:action="`${this.serverUrl}import/importStu`"
									 	method="post"
										target="student_iframe">
										<input type="hidden" :value="schoolId" name="schoolId">
                                        <btns btnClass="custom8" btnFontSize="12px" title="选择文件" @click="upLoad('student')"></btns>
                                        <span class="file-text">{{fileText?fileText:"未选中任何文件"}}</span>
                                        <input name="file" type="file" style="display: none" id="student_file"
                                               @change="uploadFile($event,'download')" hidefocus>
                                    </form>
									<iframe id="student_iframe" name="student_iframe" style="display:none;"></iframe>
                                </li>
                            </ul>
                            <div class="btn-bot">
                                <btns btnClass="custom10" btnFontSize="12px" title="上传" @click="studentUpload" v-if="roleActions.indexOf('档案管理_@bepf@import@importStu_create_own') > -1"></btns>
                            </div>
                        </div>

                        <!--导出档案-->
                        <div class="item1" v-show="ac==1">
                            <ul>
                                <li>
                                    <div class="item-left">1</div>
                                    <dt>选择左侧需导出的学生部门，导出档案</dt>
                                    <btns btnClass="custom8" btnFontSize="12px" title="导出" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@exportStuExcel_read_own') > -1"  @click="exportFile"></btns>
									<form id="exportClientForm"
										:action="`${this.serverUrl}userInfo/exportStuExcel`"
										method="post"
										target="id_updateIframe1">
										<input type="hidden" :value="schoolId" name="schoolId">
										<input type="hidden" :value="checkedKeys" name="userDep" v-if="checkedKeys.length>0">
										<input type="hidden" :value="searchVal" name="userNameLike" v-if="searchVal!=''">
									</form>
									<iframe id="id_updateIframe1" name="id_updateIframe1" style="display:none;"></iframe>
								</li>
                            </ul>
                        </div>
                        <!--导入档案照片-->
                        <div class="item1" v-show="ac==2">
                            <ul>
                                <li>
                                    <div class="item-left">1</div>
                                    <dt>档案照片请以学生学号或姓名命名，支持jpg或png格式。仅支持压缩包导入。</dt>
                                </li>
                                <li>
                                    <div class="item-left ">2</div>
                                    <dt class="margin-comp">导入方式</dt>
                                    <el-radio v-model="radio" label="1" @change="radioClick(1)">照片以学号命名</el-radio>
                                    <el-radio v-model="radio" label="2" @change="radioClick(2)">照片以姓名命名</el-radio>
                                </li>
                                <li>
                                    <div class="item-left">3</div>
                                    <dt>上传压缩好的学生档案照片</dt>

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
                                    <dt>请确保学生档案中的手机号无误，手机号将作为学生APP的登录账号。</dt>
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

				<!--档案上传验证盒子-->
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
									v-if="errListData.length>0">
								<el-table-column prop="row" label="行数"></el-table-column>
								<el-table-column prop="userNo" label="学号"></el-table-column>
								<el-table-column prop="userName" label="姓名"></el-table-column>
								<el-table-column prop="userTel" label="手机号" show-overflow-tooltip></el-table-column>
								<el-table-column prop="userDepname" label="班级" show-overflow-tooltip></el-table-column>
								<el-table-column prop="msg" label="错误详情"></el-table-column>
							</el-table>
                    	</div>

						<form id="saveStudent"
							:action="`${this.serverUrl}import/importStuSave`"
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
								<el-table-column prop="userDepname" label="班级"></el-table-column>
								<el-table-column prop="userNo" label="学号"></el-table-column>
							</el-table>
                    	</div>
						<div class="err-btn">
							<btns btnClass="custom8" btnFontSize="12px" title="重新上传" @click="alignUpload('photo')" v-show="errPhtotListData.length>0"></btns>
							<!-- <btns btnClass="custom10" btnFontSize="12px" title="重新上传" @click="alignUpload('photo')" v-show="errPhtotListData.length == 0"></btns> -->
							<btns btnClass="custom8" btnFontSize="12px" title="确定" @click="photoConfirmUpload" v-show="errPhtotListData.length == 0"></btns>
							<!-- 图片上传不使用保存按钮  方小强 -->
						</div>
                    </div>
                </div>
            </div>
        </div>
        <!--新增学生弹窗-->
        <div class="add-box">
            <el-dialog
                    title="新增学生"
                    :visible.sync="addDialog"
                    center>
                <div class="content">
                    <div class="content-l">
                        <el-form
                                :inline="true"
                                :rules="rules"
                                ref="formInline"
                                :model="formInline"
                                class="demo-form-inline">
                            <el-form-item label="学号" prop="userNo">
                                <el-input v-model="formInline.userNo" ></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="formInline.userName"></el-input>
                            </el-form-item>
                            <el-form-item label="班级" prop="userDepname">
                                <div class="other-show">
                                    <div class="transfer-top" @click="transferChangeClick">
                                        <span>{{formInline.userDepname}}</span>
                                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':transferState}"
                                             alt="">
                                    </div>
                                    <div class="inner-tree" v-if="transferState">
                                        <el-tree :data="treeData"  node-key="id"
                                                 :default-expanded-keys="expandedKeys" :expand-on-click-node="false"
                                                 @node-click="handleNodeClick"></el-tree>
                                    </div>
                                </div>
                            </el-form-item>
                            <div class="line"></div>
                            <el-form-item label="家长姓名">
								<div class="selection-check">
                                    <el-input v-model="formInline.family_name" @blur="inputCheck(formInline.family_name,'parNameShow','checkInputChars')"></el-input>
                                    <dd v-show="parNameShow">不能包含特殊字符</dd>
                                </div>
                            </el-form-item>
                            <el-form-item label="与学生关系">
                                <el-select v-model="formInline.relationshipData" >
                                    <el-option :label="item.code_item_name" :value="item.code_item_id"
                                               :key="item.code_item_id"
                                               v-for="item in getRelationshipData"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <div class="selection-check">
                                    <el-input v-model="formInline.tel" @blur="inputCheck(formInline.tel,'telShow','checkTel')"></el-input>
                                    <dd v-show="telShow">手机号格式不正确</dd>
                                </div>
                            </el-form-item>
                            <el-form-item label="APP绑定" class="binding">
                                <el-input v-model="formInline.bandingOrder" placeholder="未绑定。默认密码为123456"
                                          :disabled="true"></el-input>
                            </el-form-item>
                            <dt>注：APP登录账号为手机号。初始密码为统一设置的默认密码。</dt>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box">
                            <img :src="addImgUrl?addImgUrl:requrieImg" :onerror="defaultErrImg" alt="学生照片">
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
                    :visible.sync="changeMainDialog"
                    center>
                <div class="content">
                    <div class="content-l">
                        <el-form
							:inline="true"
							:rules="rules"
							ref="changeData"
							:model="changeData"
							class="demo-form-inline">
                            <el-form-item label="学号" prop="userNo">
                                <el-input v-model="changeData.userNo"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名" prop="userName">
                                <el-input v-model="changeData.userName"></el-input>
                            </el-form-item>
                            <el-form-item label="班级" prop="userDepname" class="width-change">
                                <div class="other-show">
                                    <div class="transfer-top" @click="transferChangeClick">
                                        <span>{{changeData.userDepname}}</span>
                                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':transferState}"
                                             alt="">
                                    </div>
                                    <div class="inner-tree" v-if="transferState">
                                        <el-tree :data="treeData"  node-key="id"
                                                 :default-expanded-keys="expandedKeys" :expand-on-click-node="false"
                                                 @node-click="handleNodeClick"></el-tree>
                                    </div>
                                </div>
                            </el-form-item>

                            <div class="line"></div>
                            <el-form-item label="家长姓名">
								<div class="selection-check">
									<el-input v-model="changeData.family_name"
										@blur="inputCheck(changeData.family_name,'parNameShow','checkInputChars')"
                                        :disabled="changeData.bandingOrder != '主账户'"></el-input>
                                    <dd v-show="parNameShow">不能包含特殊字符</dd>
									<dd v-if="nameTipState">修改信息不能为空</dd>
                                </div>
                            </el-form-item>
                            <el-form-item label="与学生关系">
                                <el-select v-model="changeData.relationshipId"
                                           @change="changeRelationship"
                                           :disabled="changeData.bandingOrder != '主账户'">
                                    <el-option :label="item.code_item_name" :value="item.code_item_id"
                                               :key="item.code_item_id"
                                               v-for="item in getRelationshipData"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="联系电话">
                                <div class="selection-check">
                                    <el-input v-model="changeData.tel" :disabled="changeData.bandingOrder != '主账户'"
                                              @blur="inputCheck(changeData.tel,'telShow','checkTel')"></el-input>
                                    <dd v-show="telShow">手机号格式不正确</dd>
									<dd v-if="telTipState">修改信息不能为空</dd>
                                </div>
                            </el-form-item>
                            <el-form-item label="APP绑定" class="binding">
                                <el-input v-model="changeData.isBandingApp"
                                          :disabled="true" v-show="changeData.isBandingApp == '未绑定'"></el-input>
                                <el-input v-model="changeData.bandingOrder"
									:disabled="true" v-show="changeData.isBandingApp == '已绑定'"></el-input>
                            </el-form-item>
                            <dt>注：APP登录账号为手机号。初始密码为统一设置的默认密码。</dt>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box">
                            <img alt="学生照片"
								:onerror="defaultErrImg"
                                :src="(changeImgUrl)?changeImgUrl:(changeData.userPhoto?uploadPicUrl + changeData.userPhoto+'?imageView2/1/w/170':requrieImg) ">
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
                          title="保存" v-if="roleActions.indexOf('档案管理_@bepf@userInfo@modify_update_own') != -1"></btns>
                </div>

            </el-dialog>

        </div>
        <!--批量调动弹窗-->
        <div class="add-box transfer">
            <el-dialog
                    :title="'调动'+changeTableData.length+'名学生'"
                    :visible.sync="transferDialog"

                    center>
                <dl class="name">（已选中：
                    <dd v-for="(item,index) in changeTableData" :key="index">{{item.userName}}<span>，</span></dd>
                    ）
                </dl>
                <div class="content transfer-content other-show">
                    <div class="transfer-top" @click="transferChangeClick">
                        <span>{{transferVal}}</span>
                        <img src="../../assets/images/arrow_down.png" :class="{'arrow-up':transferState}" alt="">
                    </div>
                    <div class="inner-tree" v-if="transferState">
                        <el-tree :data="treeData"  node-key="id"
                                 :default-expanded-keys="expandedKeys" :expand-on-click-node="false"
                                 @node-click="handleNodeClick"></el-tree>
                    </div>
                </div>
                <div class="bot">
                    <btns btnClass="custom7" btnFontSize="12px" @click="transferReset" title="取消"></btns>
                    <btns btnClass="custom8" btnFontSize="12px" @click="transferSubmit" title="保存" ></btns>
                </div>
            </el-dialog>
        </div>
        <!--毕业学生弹窗-->
        <div class="add-box transfer leave-box">
            <el-dialog
                    title="毕业学生"
                    :visible.sync="leaveDialog"
                    center>
                <dl class="name">（已选中：
                    <dd v-for="(item,index) in changeTableData" :key="index">{{item.userName}}<span>，</span></dd>
                    ）
                </dl>
                <div class="content leave-content">
                    <p><img src="../../assets/images/del.png">警告：毕业学生会产生以下后果.</p>
                    <dd>1.学生基础信息(包活指纹,ID卡)全部删除</dd>
                </div>
                <div class="bot">
                    <btns btnClass="custom7" btnFontSize="12px" @click="leaveReset" title="取消"></btns>
                    <btns btnClass="custom8" btnFontSize="12px" @click="leaveSubmit" title="确定" ></btns>
                </div>
            </el-dialog>
        </div>
		 <!--删除弹窗-->
        <div class="del-box">
            <el-dialog title="提示" :visible.sync="delDialog" >
				<div class="dialog-content">
					<div class="dialog-tip"><img src="../../assets/images/dialog_icon.png" alt="">此操作讲永久删除，是否继续？</div>
					<div class="change-account" v-show="accountList.length>0">
						<p>点击勾选把此账户更改为主账户</p>
						<el-radio-group v-model="accountRadio">
							<!-- @change="checkAccount" -->
							<el-radio :label="item.userSerial" :key="item.userSerial" v-for="item in accountList">
								<span class="name" v-show="item.userName">{{item.userName}}</span>
								<span class="relationship" v-show="item.relationshipData">{{item.relationshipData}}</span>
								<span class="tel" v-show="item.userTel">{{item.userTel}}</span></el-radio>
						</el-radio-group>
					</div>
				</div>
                <div class="bot">
                    <btns btnClass="custom8" btnFontSize="12px" @click="delAccount(currentRowData)" title="确定"></btns>
                    <btns btnClass="custom7" btnFontSize="12px" @click="delDialog = false" title="取消"></btns>
                </div>
            </el-dialog>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import btns from '@/components/Button/Button.vue'
	import Toast from '@/components/Toast/Toast'
	import {Loading} from 'element-ui';

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
			//form内必填项校验-- 数字
			let validateInputNumber = (rule, value, callback) => {
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					this.checkNumber(value, callback);
					callback();
				}
			};
			//form内必填项校验--文本框
			let validateInputChars = (rule, value, callback) => {
				if (!$.trim(value)) {
					callback(new Error('必填项不能为空'));
				} else {
					this.checkInputChars(value, callback);//form内必填项
					callback();
				}
			};
			return {
				tableLoading:false,//表格loading
				oneName:'',//新增班级是否显示默认选中的班级名称
				oneNameId:'',//新增班级是否显示默认选中的班级id
				telShow: false,//手机号码的验证
				telTipState:false,//手机号码错误提示状态
				parNameShow: false,//家长姓名的验证
				nameTipState:false,//家长姓名错误提示状态
				studentShow: false,//学生数目显示
				requrieImg: require('../../assets/images/default.png'),
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				treeData: [],//左侧树状图展示数据
				searchVal: "",//搜索内容
				//左侧树状图操作按钮
				// imgData: [
				// 	{
				// 		imgNo: require('../../assets/images/add_no.png'),
				// 		imgAc: require('../../assets/images/add_ac.png'),
				// 		title: '新增',
				// 		value: 1
				// 	},
				// 	{
				// 		imgNo: require('../../assets/images/del_no.png'),
				// 		imgAc: require('../../assets/images/del_ac.png'),
				// 		title: '删除',
				// 		value: 2
				// 	},
				// 	{
				// 		imgNo: require('../../assets/images/change_no.png'),
				// 		imgAc: require('../../assets/images/change_ac.png'),
				// 		title: '修改',
				// 		value: 3
				// 	}
				// ],//二期暂时不用 2018-09-21
				listData: [],  //列表数据
				changeTableData: [],//table选中的数据
				addDialog: false,//新增教师弹窗显示
				changeMainDialog: false,//修改教师弹窗显示
				transferDialog: false,//批量调动弹窗显示
				leaveDialog: false,//批量调动弹窗显示
				//form规则验证
				rules: {
					userNo:[
						{required: true, validator: validateInputNumber,trigger: 'blur' }
					],
					userName: [
						{required: true, validator: validateInputChars,trigger: 'blur' }
					],
					family_name: [
						{required: true, message: '请输入家长姓名', trigger: 'blur'}
					],
					userDepname: [
						{required: true, message: '请选择班级', trigger: 'blur'}
					],
					relationshipData: [
						{required: true, message: '请选择与学生关系', trigger: 'blur'}
					],

				},
				//新增学生家长弹窗内容
				formInline: {
					userNo: '',
					userName: '',
					family_name: '',
					userDepname: '',
					tel: '',
					relationshipData: '',
					bandingOrder: ''
				},
				changeData: {},//修改学生家长弹窗内容
				getRelationshipData: [],//与学生关系
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
				ac: 0,//批量导入导出选项卡 索引
				fileText: '',//上传档案文件名
				compressText: '',//上传照片zip名
				radio: "1",//命名方式单选框
				radioVal: "1",//命名方式选中
				pwd: '123456',//初始密码
				// pwdState: localStorage.getItem('isExistsSysPwd'),//初始密码状态显示
				//修改照片
				addImgUrl: '',//新增教师头像图片url
				changeImgUrl: '',//修改教师头像图片url
				imgList: [],//选中图片数组
				transferVal: '请选择',//调动输入框显示信息
				transferChange: {},//调动所选数据
				transferState: false,//新增学生树形图显示
				expandedKeys: [],//默认展开第二级
				spanArr: [],                //跨行数据
				addClassDialog: false,//教室新增弹窗显示
				deeClassDialog: false,//教室删除弹窗显示
				addNum: '',//教室新增数量
				addNode: {},//树形图新增节点 传参用
				addData: [],//树形图新增数据 传参用
				checkedKeys: [],//左侧树选中
				pageAllNum: 0,//学生总数
				pageSize: 20,//每页显示条数
				currentPage: 1,//当前页
				// lv: 0,//左侧树形图 操作按钮显示 暂时不用
				addContent: '',//新增提示内容
				/*----------二期------------*/
				validateShow: false,//档案上传验证盒子显示
				photoValidateShow: false,//图片上传验证盒子显示
				succNum:0, //上传验证正确总条数
				errListData: [],  //上传失败列表数据
				errPhtotListData:[],//上传图片失败数据
				succPhtotListData:[],//上传图片成功数据
				schoolId: localStorage.getItem('schoolId'),//学校id
				threadId: '',//学生档案验证后保存id
				//修改档案提示调整
				nameTelNull:false,
				nameRelationNull:false,
				telRelationNull:false,
				nameNull:false,
				telNull:false,
				relationNull:false,
				allHave:false,
				delDialog:false,//档案删除弹窗
				currentRowData:{},//当前行数据
				accountRadio:'',//单选框选中第几个
				accountList:[],//次账户数据
			}
		},
		methods: {
			/**
			 *  @function: toast关闭
			 *  @author: cs
			 *  @date 2018-08-01
			 */
			hideToast() {
				this.isToast = false;
			},
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
			 *  @function: 下拉选中
			 *  @author: cs
			 *  @date 2018-08-01
			 */
			changeRelationship(val) {
				// console.log("下拉选中:",val)
				this.changeRelationshipId = val;
			},
			/**
			 *  @function: 树形图点击
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			getCheckedKeys() {
				this.checkedKeys = this.$refs["tree"].getCheckedKeys(true);
				// console.log("this.checkedKeys:",this.checkedKeys)
				this.currentPage = 1;
				//如果只选中一个班级，在新增学生时展示选中的班级，多个班级不做修改
				if(this.checkedKeys.length == 1){
					let userDepname = this.getClassName(this.treeData, this.checkedKeys,1)
					this.oneName = userDepname;
					// console.log("this.oneName:",this.oneName)
				}else{
					this.oneName = '';
				}
				this.getTableList()
			},
			/**
			 *  @function: 关闭新增班级弹窗
			 *  @author: cs
			 *  @date 2018-07-20
			 */
			closeAdd() {
				this.addClassDialog = false;
				this.deeClassDialog = false;
				this.addNode = {};
				this.addData = [];
				this.addNum = '';
			},
			/**
			 *  @function: 确认新增班级
			 *  @author: cs
			 *  @date 2018-07-20
			 */
			confirmAdd(data) {
				// console.log("新增班级:", data, data.id);
				if (parseInt(this.addNum) > 0) {
					let arr = data.children;
					let changeNum = "";
					let endNum = "";
					let deptName = "";
					let parmsArr = [];
					let showType = localStorage.getItem('classFormat'); //1: 一班 ，2: 1班 ，3:（1）班
					if (arr.length > 0) {
						if (showType == 1) {
							changeNum = arr[arr.length - 1].label.substr(0, arr[arr.length - 1].label.length - 1);
							endNum = this.ChineseToNumber(changeNum);
							// console.log("changeNum 1", changeNum, endNum);
						} else if (showType == 2) {
							endNum = arr[arr.length - 1].label.substr(0, arr[arr.length - 1].label.length - 1);
							// console.log("changeNum 3", changeNum, endNum);
						} else if (showType == 3) {
							// console.log(arr, arr[arr.length - 1].label.length - 2);
							endNum = arr[arr.length - 1].label.substring(1, arr[arr.length - 1].label.length - 2);
							// console.log("changeNum 2", changeNum, endNum);
						}
					} else {
						endNum = 0;
					}
					for (let i = parseInt(endNum); i < parseInt(this.addNum * 1 + endNum * 1); i++) {
						let jsonParam = {};
						if (showType == 1) {
							deptName = this.NumberToChinese(i + 1) + "班";
						} else if (showType == 2) {
							deptName = i + 1 + "班";
						} else if (showType == 3) {
							deptName = "(" + (i + 1) + ")" + "班";
						}
						jsonParam = {
							deptName: deptName, //名字
							isLeaf: 1, //新增固定传1 ， 修改不用传
							ptDeptId: data.id, //上级id（ 高一新增  传高一的id )
							fullDeptName: data.label, //上级id（ 高一新增  传高一的id )
							groupId: 105,
							//"remark": "string",
							showOrder: i + 1
						};
						parmsArr.push(jsonParam);
						// console.log(jsonParam);
					}
					// console.log(66, JSON.stringify(parmsArr));
					this.$api.BasicInfo.addClassListStudent(parmsArr).then( res => {
							// console.log("新增班级:", res.data);
							this.addClassDialog = false;
							if (res.data.code == 600 || res.data.code == 0) {
								this.$message({
									showClose: true,
									message: "新增成功",
									type: "success",
									duration: this.msgDuration
								});
								this.loadStructure();
								// console.log("新增" + this.addNum + "个班级",this.addNum * 1 + endNum * 1);
							} else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						}).catch(err =>{
							this.addClassDialog = false;
						})

				} else {
					this.$message({
						showClose: true,
						message: "请输入大于0的整数",
						type: "warning",
						duration: this.msgDuration
					});
					this.addNum = "";
				}
				// console.log("xinz", this.addNum);
			},
			/**
			 *  @function: 确认删除班级
			 *  @author: cs
			 *  @date 2018-07-20
			 */
			confirmDee(node, data) {
				// console.log("删除 树结构：", node, data)
				this.getTableList(data.id, (parm) => {
					if (parm) {
						this.$message({
							showClose: true,
							message: '该班级下还有学生，不能删除',
							type: 'error',
							duration: this.msgDuration
						})
						this.deeClassDialog = false;
						return
					} else {
						this.$api.BasicInfo.delClassListStudent({deptId:data.id}).then(res =>{
							// console.log('删除班级:', res.data)
							this.deeClassDialog = false;
							if (res.data.code == 600 || res.data.code == 0) {
								this.$message({
									showClose: true,
									message: '删除成功',
									type: 'success',
									duration: this.msgDuration
								})
								this.loadStructure();
								// console.log("删除班级成功：")
							} else {
								this.isToast = true;
								this.toast = res.data.msg;
							}
						}).catch(err =>{
							this.deeClassDialog = false;
						})
					}
				})
			},
			/**
			 *  @function: 树形图点击增删改
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			treeClick(value, node, data, event) {
				// console.log("树形图点击:",value, node, data)
				let vThis = this;
				if (value == 1) {
					//点击新增
					// console.log("点击新增", data)
					this.addClassDialog = true;
					this.addNum = '';
					this.addData = data;
					this.addContent = "个班级";
					setTimeout(() => {
						this.$refs.addInput.focus();
					}, 26)

					/* console.log(data.lv, this.lv)
					 if (data.lv == this.lv - 1) {
					 this.addContent = "个班级";
					 } else {
					 this.addContent = "个走班";
					 }*/

				} else if (value == 2) {
					//点击删除
					// console.log("点击删除")
					this.deeClassDialog = true;
					this.addNode = node;
					this.addData = data;
					return
					const parent = node.parent;
					const children = parent.data.children || parent.data;
					const index = children.findIndex(d => d.id == data.id);
					// console.log("index", (children[index].children != undefined && children[index].children != ''), children[0].children, children[0].children != '')
					if ((children[index].children != undefined && children[index].children != '') || (children[0].children != undefined && children[0].children != '')) {
						this.$message({
							showClose: true,
							message: '该班级下还有学生，不能删除',
							type: 'error',
							duration: this.msgDuration
						})
					} else {
						children.splice(index, 1);
						this.$message({
							showClose: true,
							message: '删除成功',
							type: 'success',
							duration: this.msgDuration
						})
					}
				} else if (value == 3) {
					//点击修改
	                // console.log("event",$('.input'+data.id))
					$('.inner .span').attr('disabled', 'true')
					$('.input' + data.id).removeAttr('disabled');
					$('.input' + data.id).focus()
					$('.input' + data.id).on('blur propertychange', function () {
						// console.log("给后台", $(this).val(), vThis.treeData)
						$('.input' + data.id).attr('disabled', 'true')
					})
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
					let inputL = localStorage.getItem('classFormat') == 3 ? 2 : 1.85;
					res.textLen = ($(input).val().match(re3)).length * inputL;
				}
				return res
			},
			/**
			 *  @function: 上方搜索
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			searchClick() {
				this.getTableList()
			},
			/**
			 *  @function: 新增学生
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			addClick() {
				// console.log("新增学生")
				this.addDialog = true;
				this.formInline.userNo = '';
				this.formInline.userName = '';
				this.formInline.family_name = '';
				this.formInline.userDepname = '';
				this.formInline.tel = '';
				this.formInline.relationshipData = '';
				this.formInline.bandingOrder = '';
				this.transferState = false;
				this.addImgUrl = '';
				this.expandedKeys = [];
				setTimeout(()=>{
					document.getElementById("addImg").reset();
                })
				if (this.treeData.length > 0) {
					this.treeData.forEach((item) => {
						this.expandedKeys.push(item.id)
						item.children.forEach((item2) => {
							this.expandedKeys.push(item2.id)
						})
					})
				}
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
				this.telShow = false;
				this.parNameShow = false;
			},
			/**
			 *  @function: 新增教师点击确认
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			onSubmit() {
				// console.log('submit! 新增教师');
				this.$refs["formInline"].validate((valid) => {
					if (valid) {
						if (this.parNameShow) {
							this.$message({
								showClose: true,
								message: '家长姓名不能包含特殊字符',
								type: 'error',
								duration: this.msgDuration
							})
							return
						}else if(this.formInline.family_name == '' && this.formInline.relationshipData != ''){
							this.$message({
								showClose: true,
								message: '请输入家长姓名',
								type: 'error',
								duration: this.msgDuration
							})
							return
						}else if (this.telShow) {
							this.$message({
								showClose: true,
								message: '手机号格式不正确',
								type: 'error',
								duration: this.msgDuration
							})
							return
						}
						Loading.service();
						if (this.addImgUrl) {
							this.ajaxPic(this.addImgUrl, this.addStudent)
						} else {
							this.addStudent()
						}
					} else {
						this.$message({
							showClose: true,
							message: '请输入内容（*为必填项）',
							type: 'error',
							duration: this.msgDuration
						})
					}
				});
			},
			/**
			 *  @function: 新增教师点击取消
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			resetForm() {
				// console.log('点击取消!');
				this.$refs["formInline"].resetFields();
				this.addDialog = false;
			},
			/**
			 *  @function: 批量调动
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			transferClick() {
				// console.log('批量调动按钮点击')
				if (this.changeTableData.length <= 0) {
					this.$message({
						showClose: true,
						message: '请选择需调动的人员',
						type: 'warning',
						duration: this.msgDuration
					})
					return false
				}
				this.expandedKeys = [];
				if (this.treeData.length > 0) {
					this.treeData.forEach((item) => {
						this.expandedKeys.push(item.id)
						item.children.forEach((item2) => {
							this.expandedKeys.push(item2.id)
						})
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
			 *  @function: 批量调动树形图点击展示
			 *  @author: cs
			 *  @date 2018-07-26
			 */
			handleNodeClick(data) {
				// console.log("批量调动树形图点击:",data, data.id);
				if (data.group == 105) {
					let userDepname = this.getClassName(this.treeData, data.id)
					this.transferVal = userDepname;
					this.transferChange = data;
					this.formInline.userDepname = userDepname;
					this.formInline.userDep = data.id;
					this.changeData.userDepname = userDepname;
					this.changeData.userDep = data.id;
				} else {
					this.transferVal = "请选择";
					this.transferChange = {};
					this.formInline.userDepname = '';
					this.formInline.userDep = '';
					this.changeData.userDepname = '';
					this.changeData.userDep = '';
					this.$message({
						showClose: true,
						message: '请选择班级',
						type: 'warning',
						duration: this.msgDuration
					})
				}
				this.transferState = false;

			},
			/**
			 *  @function:获取点击年级名称+班级名称
			 *  @author: cs
			 *  @date 2018-08-06
			 **/
			getClassName(searchData, searchVal,onName) {
				let resultArr = '';     //数组清空
				let vThis = this;
				let classArr = ''
				function ifArrVal(arr, value) {//多维数组判断是否存在某值
					for (let i = 0; i < arr.length; i++) {
						if (arr[i].children instanceof Array) {//判断是否为多维数组
							if (arr[i].children.length > 0) {
								for (let k = 0; k < arr[i].children.length; k++) {
									if (arr[i].children[k].children.length == 0) {
										//通过group判断是否选中的是班级的上一级
										if (arr[i].children[k].id == value && arr[i].group == 104) {
											classArr = arr[i].label;
										}
									}
								}
								ifArrVal(arr[i].children, value);
							} else {
								//通过group判断是否选中的是班级
								if (arr[i].id == value && arr[i].group == 105) {
									resultArr = arr[i].label;
									if(onName){
										vThis.oneNameId = arr[i].id;
										// console.log("vThis.oneNameId:",resultArr,vThis.oneNameId)
										break;
									}
								}else{
									vThis.oneName = '';
								}
							}
						}
					}
					return -1;//不存在
				}

				ifArrVal(searchData, searchVal)
				resultArr = classArr + ` ` + resultArr;
				// console.log("return 值：", resultArr)
				return resultArr
			},
			/**
			 *  @function: 批量调动点击确认
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			transferSubmit() {
				let vThis = this;
				// console.log('批量调动点击确认 submit!', this.transferChange);
				if (JSON.stringify(this.transferChange) != "{}") {
					let userIdList = [];
					this.changeTableData.forEach((item) => {
						userIdList.push(item.userSerial)
					})
					Loading.service();
					let jsonParam = {
						"userList": userIdList.join(','),//人员id，逗号间隔
						"depId": this.transferChange.id, //调动后部门id
						"deptName": this.transferVal, //部门名称
						"userType": 1, //1：学生  3：教职工
					}
					this.$api.BasicInfo.modifyDepStudent(jsonParam).then( res => {
						// console.log('批量调动:', res.data)
						Loading.service().close();
						if (res.data.code == 600 || res.data.code == 0) {
							this.$message({
								showClose: true,
								message: '调动成功',
								type: 'success',
								duration: this.msgDuration
							})
							// console.log("调动成功：", this.transferChange)
							this.transferDialog = false;
							this.transferChange = {};
							this.getTableList();
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
						message: '请选择调动班级',
						type: 'error',
						duration: this.msgDuration
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
				// console.log('点击取消!');
				this.transferDialog = false;
				this.transferState = false;
			},

			/**
			 *  @function: 学生毕业
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			leaveClick() {
				// console.log('学生毕业')
				if (this.changeTableData.length <= 0) {
					this.$message({
						showClose: true,
						message: '请选择毕业的学生',
						type: 'warning',
						duration: this.msgDuration
					})
					return false
				}
				this.leaveDialog = true;
			},
			/**
			 *  @function: 学生毕业点击确认
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			leaveSubmit() {
				let vThis = this;
				// console.log('学生毕业点击确认');
				let userIdList = [];
				this.changeTableData.forEach((item) => {
					userIdList.push(item.userSerial)
				})
				Loading.service();
				let jsonParam = {
					"userList": userIdList.join(',')
				}
				this.$api.BasicInfo.delUserStudent(jsonParam).then( res => {
					// console.log('学生毕业:', res.data)
					Loading.service().close();
					if (res.data.code == 600 || res.data.code == 0) {
						this.$message({
							showClose: true,
							message: '毕业成功',
							type: 'success',
							duration: this.msgDuration
						})
						this.leaveDialog = false;
						this.getTableList();
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    Loading.service().close();
                })

			},
			/**
			 *  @function: 学生毕业点击取消
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			leaveReset() {
				// console.log('学生毕业点击取消');
				this.leaveDialog = false;
			},
			/**
			 *  @function: 点击批量输入输出
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			importClick() {
				// console.log('输入输出')
				this.importShow = true;
				this.fileText = '';
				document.getElementById("studentForm").reset();
				this.compressText = '';
				document.getElementById("compressForm").reset();
				this.ac = 0;
				setTimeout(() => {
					let importHeight = $('.parents-record').height() - $('.import-t').height();
					$('.import-b').height(importHeight);
					// console.log(importHeight)
				},20)
			},
			/**
			 *  @function: 批量输入输出返回
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			backClick(status) {
				//批量输入输出返回,清空所输入的信息
				/*
				* import :批量输入输出页面返回
				* validate :上传验证页面返回
				*/
				if(status == "import"){
					// console.log('批量输入输出返回')
					this.importShow = false;
				}else if(status == "validate"){
					// console.log('档案上传验证页面返回')
					this.validateShow = false;
				}else if(status == "photo"){
					// console.log('图片上传验证页面返回')
					this.photoValidateShow = false;
				}
			},
			/**
			 *  @function: 批量输入输出选项卡点击
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			navClick(index) {
				// console.log('navClick:',index)
				this.ac = index;
			},
			/**
			 *  @function: 表格选中改变
			 *  @author: cs
			 *  @date 2018-07-09
			 */
			handleSelectionChange(selection) {
				// console.log("selection:", selection)
				this.changeTableData = this.union(selection);
			},
			/**
			 *  @function: 遍历数组，去除userSerial相同的项
			 *  @author: cs
			 *  @date 2018-07-26
			 */
			union(arr) {
				arr = arr || [];
				let tmp = {};
				for (let i = 0, len = arr.length; i < len; i++) {
					let obj = arr[i];
					if (obj.userSerial in tmp) {
						//有相同的
					} else {
						tmp[obj.userSerial] = obj;
					}
				}

				let result = [];
				for (let key in tmp) {
					result.push(tmp[key]);
				}
                // console.log(result)
				return result;
			},
			/**
			 *  @function: 表格单击行
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			rowClick(row) {
				this.telShow = false;
				this.parNameShow = false;
				this.changeMainDialog = true;
				this.nameTelNull = false;
				this.nameRelationNull = false;
				this.telRelationNull = false;
				this.nameNull = false;
				this.telNull = false;
				this.relationNull = false;
				this.allHave = false;
				this.telTipState = false;
				this.nameTipState = false;
				let rows = JSON.stringify(row);
                setTimeout(()=>{
	                document.getElementById("changeImg").reset();
	                this.changeData = JSON.parse(rows);
	                this.changeData.titleName = this.changeData.userName;

	                this.changeImgUrl = '';
	                this.changeRelationshipId = '';
	                if (this.changeData.relationshipId < 0) {
		                this.changeData.relationshipId = ''
	                }
	                this.expandedKeys = [];
	                if (this.treeData.length > 0) {
		                this.treeData.forEach((item) => {
			                this.expandedKeys.push(item.id)
			                item.children.forEach((item2) => {
				                this.expandedKeys.push(item2.id)
			                })
		                })
					}
					 if(this.changeData.family_name == '' && this.changeData.tel == '' && this.changeData.relationshipId == ''){
							//三项都为空
							// console.log('三项都为空')
						}else if(this.changeData.family_name == '' && this.changeData.tel == ''){
							//姓名和电话为空
							// console.log('姓名和电话为空')
							this.nameTelNull = true;
						}else if(this.changeData.family_name == '' && this.changeData.relationshipId == ''){
							//姓名和关系为空
							// console.log('姓名和关系为空')
							this.nameRelationNull = true;
						}else if(this.changeData.tel == '' && this.changeData.relationshipId == ''){
							//电话和关系为空
							// console.log('电话和关系为空')
							this.telRelationNull = true;
						}else if(this.changeData.family_name == ''){
							//只有姓名为空
							// console.log('只有姓名为空')
							this.nameNull= true;
						}else if(this.changeData.tel == ''){
							//只有电话为空
							// console.log('只有电话为空')
							this.telNull= true;
						}else if(this.changeData.relationshipId == ''){
							//只有关系为空
							// console.log('只有关系为空')
							this.relationNull= true;
						}else{
							//全有
							// console.log('全有')
							this.allHave= true;
						}
				},20)

				// console.log("rowClick:", row, this.changeData)
			},
			/**
			 *  @function: 教师修改点击确认
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			changeSubmit() {
				this.telTipState = false;
				this.nameTipState = false;
				// console.log('教师修改点击确认!',this.changeData);
				this.$refs["changeData"].validate((valid) => {
					if (valid) {
						 if(this.nameTelNull){
							// console.log('姓名和电话可以为空')
							if(this.changeData.relationshipId == ''){
								return
							}
						}else if(this.nameRelationNull){
							// console.log('姓名和关系可以为空')
							if(this.changeData.tel == ''){
								this.telTipState = true;
								return
							}
						}else if(this.telRelationNull){
							// console.log('关系和电话可以为空')
							if(this.changeData.family_name == ''){
								this.nameTipState =  true;
								return
							}
						}else if(this.nameNull){
							// console.log('姓名可以为空')
							if(this.changeData.tel == '' || this.changeData.relationshipId == ''){
								this.telTipState =  true;
								return
							}
						}else if(this.telNull){
							// console.log('电话可以为空')
							if(this.changeData.family_name == '' || this.changeData.relationshipId == ''){
								this.nameTipState =  true;
								return
							}
						}else if(this.relationNull){
							// console.log('关系可以为空')
							if(this.changeData.family_name == '' || this.changeData.tel == ''){
								return
							}
						}else if(this.allHave){
							// console.log('都不可以为空')
							if(this.changeData.family_name == ''){
								this.nameTipState =  true;
								return
							}
							if(this.changeData.tel == ''){
								this.telTipState =  true;
								return
							}
							// console.log("this.nameTipState",this.nameTipState,this.telTipState)
						}
						if(this.changeData.family_name == '' && this.changeData.relationshipId != ''){
							this.$message({
								showClose: true,
								message: '请输入家长姓名',
								type: 'error',
								duration: this.msgDuration
							})
							return
						}
						this.nameTipState =  false;
						this.telTipState =  false;
						// console.log("this.nameTipState",this.nameTipState,this.telTipState)
						if (this.parNameShow) {
							setTimeout(()=>{
								this.$message({
									showClose: true,
									message: '家长姓名不能包含特殊字符',
									type: 'error',
									duration: this.msgDuration
								})
							},20)
							return
						}else if (this.telShow) {
							setTimeout(()=>{
								this.$message({
									showClose: true,
									message: '手机号格式不正确',
									type: 'error',
									duration: this.msgDuration
								})
							},20)
							return
						}
						Loading.service();
						if (this.changeImgUrl) {
							//更改头像
							this.ajaxPic(this.changeImgUrl, this.changeStudent)
						} else {
							//未更改头像
							this.changeStudent()
						}
					} else {
						this.$message({
							showClose: true,
							message: '请输入内容（*为必填项）',
							type: 'error',
							duration: this.msgDuration
						})
					}
				});
			},
			/**
			 *  @function: 教师修改点击取消
			 *  @author: cs
			 *  @date 2018-07-10
			 */
			resetChange() {
				// console.log('点击取消!');
				this.changeMainDialog = false;
			},
			/**
			 *  @function: 上传档案按钮点击
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			upLoad(status) {
				//status 区分点击上传按钮
				/**
				 *  parent：家长
				 *  student：学生
				 *  compress：图片上传选择文件
				 */
				if(status == "student"){
					// console.log('学生上传选择文件')
					$('#student_file').click();
				}else if(status == "compress"){
					// console.log('图片上传选择文件')
					$('#compress_file').click();
				}

			},
			/**
			 *  @function: 导出档案
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			exportFile() {
				// console.log("导出档案")
				$('#exportClientForm').submit();
			},
			/**
			 *  @function: 选择命名方式
			 *  @author: cs
			 *  @date 2018-07-12
			 */
			radioClick(value) {
				this.radioVal = value;
				if (value == 1) {
					// console.log(value, "工号命名")
				} else {
					// console.log(value, "姓名命名")
				}
			},
			/**
			 *  @function: 新增教师修改照片
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			addPhoto() {
				$('#add-img').click();
			},
			/**
			 *  @function: 修改教师资料修改照片
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			changePhoto() {
				$('#change-img').click();
			},
			/**
			 *  @function: 上传文件方法
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			uploadFile(event, source) {
				// console.log("上传文件:", source, event)
				if (event.target.files.length <= 0) return;
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
						// this.fileList(event.target, source);
						this.fileText = files[0].name;
					}
				}
				// console.log(files)
			},
			fileList(fileList, source) {
				let files = fileList.files;
				// console.log("fileList:", fileList.items,files)
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
				//判断是否为图片文件
				if (file.type.indexOf('image') == -1) {
					file.src = 'default.png';
					this.imgList = file;
					// console.log('imgList1', this.imgList)
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
						file.src = reader.result;
						// console.log(333, file, this)
						if (source == 'add') {
							//新增教师图片上传
							vThis.imgList[0] = file;
							vThis.addImgUrl = reader.result
						} else if (source == 'change') {
							//修改教师资料图片上传
							vThis.imgList[0] = file;
							vThis.changeImgUrl = reader.result
						}
						// console.log('imgList2', vThis.imgList[0].size)
					}
				}
			},
			/**
			 *  @function: 新建学生档案上传按钮点击
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			studentUpload() {
				// console.log('新建学生档案上传按钮点击');
				let vThis = this;
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
				$('#studentForm').submit();
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
			formLoad1(){
				let vThis = this;
				let options = {
					beforeSend: function(xhr) {
						xhr.setRequestHeader('Authorization', 'Token ' + localStorage.getItem('token'))
					},
					beforeSubmit: function (formData, jqForm, options) {
 						// console.log('formbeforeSubmit',formData)
					},
					success: function (responseText, statusText, xhr, $form) {
						// console.log('form success回调', responseText)
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
								// console.log(vThis.errListData)
								setTimeout(() => {
									let errTableHeight = $('.import-b').height() - $('.validate-tip').height() -140;
									$('.err-table-box .el-table').css({"max-height":errTableHeight})
									// console.log($('.import-b').height() , $('.validate-tip').height())
								})
							}
						}else{
							vThis.isToast = true;
							vThis.toast = responseText.msg;
						}
					},
					error: function (xhr, status, err) {
						// console.log('form error回调',xhr, status, err)
						Loading.service().close();
						vThis.isToast = true;
						vThis.toast = err.msg?err.msg:"请求未响应";
					}
				};
				$('#studentForm').submit(function () {
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
						// let clientId = { name: "clientId", value: vThis.clientSelected.clientId }; //clientId
						// formData.push(clientId);
 						// console.log('formbeforeSubmit',formData)
					},
					success: function (responseText, statusText, xhr, $form) {
						// console.log('form success回调',responseText.code, responseText)
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
								// console.log(vThis.errPhtotListData)
								setTimeout(() => {
									let errTableHeight = $('.import-b').height() - $('.validate-tip').height() -140;
										// $('.err-table-box').height(errTableHeight)
										$('.err-table-box .el-table').css({"max-height":errTableHeight})
									// $('.err-table-box').height(errTableHeight);
									// console.log($('.import-b').height() , $('.validate-tip').height())
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
								// console.log(vThis.errPhtotListData)
								setTimeout(() => {
									let errTableHeight = $('.import-b').height() - $('.validate-tip').height() -140;
										// $('.err-table-box').height(errTableHeight)
										$('.err-table-box .el-table').css({"max-height":errTableHeight})
									// $('.err-table-box').height(errTableHeight);
									// console.log($('.import-b').height() , $('.validate-tip').height())
								})
							}
						}else{
							vThis.isToast = true;
							vThis.toast = responseText.msg;
						}

					},
					error: function ( err) {
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
						// let clientId = { name: "clientId", value: vThis.clientSelected.clientId }; //clientId
						// formData.push(clientId);
 						// console.log('formbeforeSubmit',formData)
					},
					success: function (responseText, statusText, xhr, $form) {
						// console.log('form success回调',responseText.code, responseText)
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
							vThis.getTableList();
						}else{
							vThis.isToast = true;
							vThis.toast = responseText.msg;
						}

					},
					error: function ( err) {
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
			 *  @function: 导入档案照片上传点击
			 *  @author: cs
			 *  @date 2018-07-13
			 */
			compressUpload() {
				// console.log('导入档案照片上传点击')
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
				// console.log('生成账号密码上传点击');
				// let state = this.formOutTest(value,funcName);
				// console.log(11,state)
				// if(state){
					Loading.service();
					let prams = {
						paramValue:value,
						schoolId:localStorage.getItem('schoolId')
					}
					this.$api.BasicInfo.setSysPwdStudent(prams).then( res => {
						Loading.service().close();
						// console.log('生成账号密码:', res.data.data)
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
			 *  @function: 表格跨行方法
			 *  @author: lxr
			 *  @date 2018-7-17
			 **/
			objectSpanMethod({row, column, rowIndex, columnIndex}) {
				// console.log(1234,row, column, rowIndex, columnIndex)
				if (columnIndex <= 4) {
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
						if (data[i].userSerial == data[i - 1].userSerial) {
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
			 *  @function: 设置光标始终在文本框最后
			 *  @author: lxr
			 *  @date 2018-7-16
			 **/
			setCaretPosition(tObj, sPos) {
				// console.log(tObj, sPos)
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
			 *  @function: 把阿拉伯数字变为大写数字
			 *  @author: cs
			 *  @date 2018-08-02
			 **/
			NumberToChinese(Num) {
				for (let i = Num.length - 1; i >= 0; i--) {
					Num = Num.replace(",", "")//替换Num中的“,”
					Num = Num.replace(" ", "")//替换Num中的空格
				}
				if (isNaN(Num)) { //验证输入的字符是否为数字
					//alert("请检查小写金额是否正确");
					return;
				}
				//字符处理完毕后开始转换，采用前后两部分分别转换
				let part = String(Num).split(".");
				let newchar = "";
				//小数点前进行转化
				for (let i = part[0].length - 1; i >= 0; i--) {
					if (part[0].length > 10) {
						//alert("位数过大，无法计算");
						return "";
					}//若数量超过拾亿单位，提示
					let tmpnewchar = ""
					let perchar = part[0].charAt(i);
					switch (perchar) {
						case "0":
							tmpnewchar = "零" + tmpnewchar;
							break;
						case "1":
							tmpnewchar = "一" + tmpnewchar;
							break;
						case "2":
							tmpnewchar = "二" + tmpnewchar;
							break;
						case "3":
							tmpnewchar = "三" + tmpnewchar;
							break;
						case "4":
							tmpnewchar = "四" + tmpnewchar;
							break;
						case "5":
							tmpnewchar = "五" + tmpnewchar;
							break;
						case "6":
							tmpnewchar = "六" + tmpnewchar;
							break;
						case "7":
							tmpnewchar = "七" + tmpnewchar;
							break;
						case "8":
							tmpnewchar = "八" + tmpnewchar;
							break;
						case "9":
							tmpnewchar = "九" + tmpnewchar;
							break;
					}
					switch (part[0].length - i - 1) {
						case 0:
							tmpnewchar = tmpnewchar;
							break;
						case 1:
							if (perchar != 0) tmpnewchar = tmpnewchar + "十";
							break;
						case 2:
							if (perchar != 0) tmpnewchar = tmpnewchar + "百";
							break;
						case 3:
							if (perchar != 0) tmpnewchar = tmpnewchar + "千";
							break;
						case 4:
							tmpnewchar = tmpnewchar + "万";
							break;
						case 5:
							if (perchar != 0) tmpnewchar = tmpnewchar + "十";
							break;
						case 6:
							if (perchar != 0) tmpnewchar = tmpnewchar + "百";
							break;
						case 7:
							if (perchar != 0) tmpnewchar = tmpnewchar + "千";
							break;
						case 8:
							tmpnewchar = tmpnewchar + "亿";
							break;
						case 9:
							tmpnewchar = tmpnewchar + "十";
							break;
					}
					newchar = tmpnewchar + newchar;
				}
				//替换所有无用汉字，直到没有此类无用的数字为止
				while (newchar.search("零零") != -1 || newchar.search("零亿") != -1 || newchar.search("亿万") != -1 || newchar.search("零万") != -1) {
					newchar = newchar.replace("零亿", "亿");
					newchar = newchar.replace("亿万", "亿");
					newchar = newchar.replace("零万", "万");
					newchar = newchar.replace("零零", "零");
				}
				//替换以“一十”开头的，为“十”
				if (newchar.indexOf("一十") == 0) {
					newchar = newchar.substr(1);
				}
				//替换以“零”结尾的，为“”
				if (newchar.lastIndexOf("零") == newchar.length - 1) {
					newchar = newchar.substr(0, newchar.length - 1);
				}
				return newchar;
			},
			/**
			 *  @function: 把大写数字变为阿拉伯数字
			 *  @author: cs
			 *  @date 2018-08-02
			 **/
			ChineseToNumber(chnStr) {
				let rtn = 0;
				let section = 0;
				let number = 0;
				let secUnit = false;
				let str = chnStr.split('');
				let chnNumChar = {
					零: 0,
					一: 1,
					二: 2,
					三: 3,
					四: 4,
					五: 5,
					六: 6,
					七: 7,
					八: 8,
					九: 9
				};
				let chnNameValue = {
					十: {value: 10, secUnit: false},
					百: {value: 100, secUnit: false},
					千: {value: 1000, secUnit: false},
					万: {value: 10000, secUnit: true},
					亿: {value: 100000000, secUnit: true}
				}

				for (let i = 0; i < str.length; i++) {
					let num = chnNumChar[str[i]];
					// console.log(11,num)
					if (typeof num !== 'undefined') {
						number = num;
						if (i === str.length - 1) {
							section += number;
						}
					} else {
						let unit = chnNameValue[str[i]].value;
						secUnit = chnNameValue[str[i]].secUnit;
						// console.log(11111, unit, secUnit)
						if (secUnit) {
							section = (section + number) * unit;
							rtn += section;
							section = 0;
						} else {
							if (str[0] == '十') {
								number = 1;
							}
							section += (number * unit);
						}
						number = 0;
					}
				}
				return rtn + section;
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
						"searchType": "1",
						"userDep": deeId ? [deeId] : this.checkedKeys,
						"userNameLike": this.searchVal,
						schoolId: localStorage.getItem('schoolId'),//学校id
					}
				}
				this.$api.BasicInfo.getTableListStudent(jsonParam).then( res => {
					// console.log('学生家长table列表', res.data);
					this.tableLoading = false;
					if (res.data.code == 600 || res.data.code == 0) {
						if (deeId) {
							if (res.data.data.records.length > 0) {
								cb(true);
							} else {
								cb(false);
							}
						} else {
							this.listData = [];
							this.listData = res.data.data.records;
							this.pageAllNum = res.data.data.total_record;
							this.getSpanArr(this.listData);//获取跨行跨列数据(家长档案)
							// console.log(11122, this.listData);
						}
						if (this.listData.length == 0) {
							this.studentShow = true;
						} else {
							this.studentShow = false;
						}
						// console.log(333, this.studentShow)
					} else {
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: 'error',
							duration: this.msgDuration
						})
					}
				}).catch(err =>{
                    this.tableLoading = false;
                })

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
					// console.log('获取token:', res.data.data)
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
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},

			/**
			 *  @function: 学生家长新增 后台接口
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			addStudent(key) {
				// console.log("key:", key, this.formInline)
				let jsonParam = {
					schoolId: localStorage.getItem('schoolId'),//学校id
					userDep: this.formInline.userDep,//部门id
					userDepname: this.formInline.userDepname,//部门名称
					userName: this.formInline.userName,//姓名
					userNo: this.formInline.userNo,//工学号
					userPassword: this.encrypt("123456"),//密码(AES加密) 默认123456
					parentInfo: [{
						parentName: this.formInline.family_name,//家长姓名
						parentTele: this.formInline.tel,//家长电话
					}],
					userInfo: {
						userRela: this.formInline.relationshipData,//与学生关系
					},
					userPhoto: key ? key : '',
					userType: "1",//档案类型（3：教师档案；1：学生家长）
				}
				// console.log("教师新增参数：", JSON.stringify(jsonParam))
                this.$api.BasicInfo.addStudent(jsonParam).then(res => {
						// console.log('学生家长新增 res.data:', res.data)
						Loading.service().close();
						if (res.data.code == 600 || res.data.code == 0) {
							this.$message({
								showClose: true,
								message: '新增成功',
								type: 'success',
								duration: this.msgDuration
							})
							this.addDialog = false;
							this.getTableList();

						} else {
							this.$message({
								showClose: true,
								message: res.data.msg,
								type: 'error',
								duration: this.msgDuration
							})
						}
					}).catch(err =>{
						Loading.service().close();
					})
			},
			/**
			 *  @function: 学生家长修改 后台接口
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			changeStudent(key) {
				// console.log("key:", key, this.changeData)
				let jsonParam = {
					schoolId: localStorage.getItem('schoolId'),//学校id
					userSerial: this.changeData.userSerial,//学生id
					userDep: this.changeData.userDep,//部门id
					userDepname: this.changeData.userDepname,//部门名称
					userName: this.changeData.userName,//姓名
					userNo: this.changeData.userNo,//工学号
					parentInfo: [{
						parentName: this.changeData.family_name,//家长姓名
						parentTele: this.changeData.tel,//家长电话
						parentId: this.changeData.parentId//家长id
					}],
					userInfo: {
						userRela: this.changeRelationshipId ? this.changeRelationshipId : this.changeData.relationshipId,//与学生关系
					},
					userPhoto: key ? key : this.changeData.userPhoto ,
					userType: "1",//档案类型（3：教师档案；1：学生家长）
				}
				// console.log("教师修改参数：", JSON.stringify(jsonParam))
//                return
                this.$api.BasicInfo.modifyStudent(jsonParam).then(res => {
					// console.log('学生家长修改 res.data:', res.data)
					Loading.service().close();
					if (res.data.code == 600 || res.data.code == 0) {
						this.$message({
							showClose: true,
							message: '修改成功',
							type: 'success',
							duration: this.msgDuration
						})
						this.changeMainDialog = false;
						this.getTableList();
					} else {
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: 'error',
							duration: this.msgDuration
						})
					}
				}).catch(err =>{
					Loading.service().close();
				})
			},
			/**
			 *  @function: 获取学生家长关系
			 *  @author: cs
			 *  @date 2018-7-27
			 **/
			getRelationship() {
				let params = {
					"codeNo": "CD1005",
					"deptId": 0
				}
                this.$api.BasicInfo.getRelationshipStudent(params).then(res => {
					// console.log('获取学生家长关系', res.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.getRelationshipData = res.data.data.CD1005;
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 加载树形组织结构列表
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			loadStructure() {
				let jsonParam = {
					schoolId: localStorage.getItem('schoolId')
				}
                this.$api.Common.getTreeListStudent(jsonParam).then(res => {
					// console.log('加载树形组织结构列表', res)
					if (res.data.code == 600 || res.data.code == 0) {
						this.treeData = res.data.data;
						/* if (this.treeData.length > 0) {
						 if (1) {
						 //无走班 +3 ,有走班制+4  目前先按照无走班走
						 this.lv = this.treeData[0].lv + 3;
						 } else {
						 this.lv = this.treeData[0].lv + 4;
						 }
						 }*/
						this.resizeInputWidth()
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 当前页
			 *  @author: cs
			 *  @date 2018-08-02
			 **/
			pageChange(val) {
				// console.log(pageChange, val)
				this.currentPage = val;
				this.getTableList();
			},
			/**
			 *  @function页面布局初始化的功能
			 *  @author: wzx
			 *  @date 2018-7-12
			 **/
			initLayout() {
				setTimeout(function () {
					//计算table高度
					let icH = $('.index > .m-cen').height();
					let vHeight = $('.parents-record').height() - $('.right-t').height() - $('.pagination').height();
					$('.right-b').height(vHeight);
					let tblH = icH - $('.parents-record .right-t').height();
					$('.parents-record .right-b .table-box').height(tblH)
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
				// console.log("成功或失败验证重新上传按钮点击")
				if(status == 'validate'){
					this.validateShow = false;
					this.fileText = '';
					document.getElementById("studentForm").reset();
				}else if(status == 'photo'){
					this.photoValidateShow = false;
					this.compressText = '';
					document.getElementById("compressForm").reset();
				}
				// this.fileText = "";
			},
			/**
			 *  @function:验证成功后保存按钮
			 *  @author: cs
			 *  @date: 2018-08-29
			 **/
			confirmUpload() {
				// console.log("验证成功后保存按钮")
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
				// console.log("验证成功后保存按钮")
				this.photoValidateShow = false;
				this.importShow = false;
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
				this.$confirm(`${row.family_name?row.family_name+'的':''}密码将被重置为123456，是否确认？`, '重置密码', {
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
				this.currentRowData = row;
				this.delDialog = true;
				this.accountRadio = "";
				let params = {
					"student_id": this.currentRowData.userSerial
				}
				this.$api.BasicInfo.getSubAccount(params).then(res => {
					// console.log('根据学生id获取次账户数据 res：', res.data)
					if (res.data.code == 600 || res.data.code == 0) {
						this.accountList = res.data.data;
						this.accountList.forEach(item=>{
							if(item.userInfo.userRela == 1){
								item.relationshipData = '爸爸';
							}else if(item.userInfo.userRela == 2){
								item.relationshipData = '妈妈';
							}else if(item.userInfo.userRela == 3){
								item.relationshipData = '爷爷';
							}else if(item.userInfo.userRela == 4){
								item.relationshipData = '奶奶';
							}else if(item.userInfo.userRela == 5){
								item.relationshipData = '姥爷';
							}else if(item.userInfo.userRela == 6){
								item.relationshipData = '姥姥';
							}else{
								item.relationshipData = '';
							}
						})
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function:删除账户
			 *  @author: cs
			 *  @date: 2018-11-24
			 **/
			delAccount() {
				// console.log("删除账户走接口：")
				this.delDialog = false;
				let params = {
					"delParentId": this.currentRowData.parentId,
					"newParentId": this.accountRadio,
					"studentId": this.currentRowData.userSerial
				}
				Loading.service();
				this.$api.BasicInfo.delAccount(params).then(res => {
					// console.log('删除账户走接口 res：', res.data)
					Loading.service().close();
					if (res.data.code == 600 || res.data.code == 0) {
						this.getTableList();
						this.$message({type: 'success', message: '删除成功',duration: this.msgDuration});
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
					Loading.service().close();
				})

			},
			/**
			 *  @function:修改账户类型 是次账户时显示
			 *  @author: cs
			 *  @date: 2018-11-24
			 **/
			modifyAccountType(row) {
				// console.log("修改账户类型：",row)
				this.currentRowData = row;
				this.$confirm('把此账户更改为主账户，是否继续？', '提示', {
					confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
				}).then(() => {//点击确定按钮进行的操作
					Loading.service();
					let params = {
						"olderSlaveParentId": row.parentId,
  						"studentId": row.userSerial
					}
					this.$api.BasicInfo.modifyAccountType(params).then(res => {
						// console.log('把此账户更改为主账户 res：', res.data)
						Loading.service().close();
						if (res.data.code == 600 || res.data.code == 0) {
							this.$message({type: 'success', message: '更改成功',duration: this.msgDuration});
							this.getTableList();
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					}).catch(err =>{
						Loading.service().close();
					})
				}).catch(() => {//点击取消按钮
					// this.$message({type: 'info', message: '已取消更改',duration: this.msgDuration});
				});
			}
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.formLoad1();//导入档案form准备
			this.formLoad2();//导入照片form准备
			// this.formLoad3();//导入档案保存准备
			this.resizeInputWidth();//重定义input宽
			this.getRelationship();
			this.initLayout();
			let vThis = this;
			document.body.onclick = function (e) {
				if ($(e.target).closest(".other-show").length == 0) {
					//点击id为tree之外，则触发
					vThis.transferState = false;
				}
			}

			// console.log(3311,this.ChineseToNumber('十'))
		},
		created() {
			this.loadStructure();
			this.getTableList();
			// this.serverUrl = 'http://10.1.0.11:8091/bepf/';
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .el-popover {
        text-align: center;
        padding: 30px 0;
    }
	.el-loading-spinner{
		i{
			font-size: 40px;
			color: #fff;
		}

		.el-loading-text{
			color: #fff;
		}
	}

    .parents-record {
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
                    }
                    .modal-wrap {
                        .modal-add {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            left: 0;
                            top: 0;
                            z-index: 10;
                            background-color: rgba(0, 0, 0, 0.1);

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
                            margin: auto;
                            top: 0;
                            bottom: 0;
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
                                height: 20px;
                                line-height: 20px;
                                font-size: 13px;
                                outline: none;
                                background-color: #fff;
                                border: 1px solid #e1e1e1;
                                color: #666;
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
                            width: 100px;
                            font-size: 16px;
                            font-weight: bold;
                            display: inline-block;
                            color: #333;
                            margin-left: 30px;
                            margin-right: 5px;
                            span {
                                font-size: 14px;
                                color: #666;
                                margin-left: 15px;
                            }
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
                    /deep/.el-table, .el-table__body-wrapper {
                        overflow: auto;
                        border-left: 0px;
                        border-top: 0px;
                    }
                    .el-table__header {
                        thead {
                            tr {
                                cursor: default;
                                &:nth-of-type(2) {
                                    th {
                                        background-color: #fff;
                                    }
                                }
                            }
                        }
                    }
                    tr {
                        text-align: center;
                        cursor: pointer;
                        th {
                            font-weight: normal;
                            /*color: #666;*/
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
                            // margin: 20px 0;
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
						.button-div{
							margin-right: 40px;
						}
					}
				}
            }
        }
        /*新增教师弹窗*/
        .add-box {
            /deep/ .el-dialog {
                overflow: initial;
                width: 800px;
                border-radius: 10px;
                .el-dialog__header {
                    padding-top: 30px;
                    overflow: hidden;
                    position: relative;
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
                    .content {
                        display: flex;
                        border: 1px solid #e1e1e1;
                        border-radius: 5px;
                        width: 700px;
                        min-height: 350px;
                        background-color: #fdfdfd;
                        .content-l {
                            flex: 2;
                            padding-top: 40px;
                            /*padding-right: 100px;*/
                            margin-right: 60px;
							text-align:left;
                            input {
                                border-radius: 5px;
                                border: 1px solid #E5E5E5;
                                line-height: 1;
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
								margin-bottom: 23px !important;
                                padding-bottom: 0;
                                .el-form-item__label {
                                    width: 42%;
                                }
                                .el-form-item__content {
                                    width: 58%;
                                }
                            }
                            .binding {
                                width: 315px;
                                position: absolute;
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
                                margin-bottom: 23px;
                            }
                            .line {
                                width: 94%;
                                height: 1px;
                                margin: 24px auto;
                                margin-top: 5px;
                                background-color: #e1e1e1;
                            }
                            .other-show {
                                position: relative;

                                display: inline;

                                min-height: 60px;
                                .transfer-top {
                                    min-width: 116px;
                                    margin: 0 auto;
                                    margin-bottom: 3px;
                                    height: 40px;
                                    line-height: 40px;
                                    border-radius: 5px;
                                    border: 1px solid #E5E5E5;
                                    text-align: left;
                                    padding-left: 16px;
                                    cursor: pointer;
                                    position: relative;

                                    span {
                                        font-size: 12px;
                                        display: inline-block;
                                        min-width: 65px;
                                        max-width: 275px;
                                        overflow: hidden;
                                        white-space: nowrap;
                                        margin-right: 35px;

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
                                    position: absolute;
                                    left: 0;
                                    /*top: 0;*/
                                    background-color: #fff;
                                    min-width: 116px;
                                    padding: 15px 9px;
                                    overflow: auto;
                                    max-height: 300px;
                                    border: 1px solid #e1e1e1;
                                    border-radius: 5px;
                                    z-index: 9999;
                                    -webkit-box-sizing: content-box;
                                    -moz-box-sizing: content-box;
                                    box-sizing: content-box;
                                }
                            }
                            .width-change {
                                width: auto !important;
                                .el-form-item__label {
                                    width: 85px !important;
                                }
                                .el-form-item__content {
                                    width: auto !important;
                                }
                            }
                            .selection-check {
                                position: relative;
                                dd {
                                    color: #f56c6c;
                                    font-size: 12px;
                                    position: absolute;
                                    left: 0;
                                    top: 30px;
                                }
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
            .transfer-content {
                height: auto !important;
                min-height: 0 !important;
                text-align: center;
                padding: 20px 0 !important;
                display: inline-block !important;

                .transfer-top {
                    width: 200px;
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
                        font-size: 12px;
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
                    width: 200px;
                    max-height: 300px;
                    border: 1px solid #e1e1e1;
                    overflow: auto;
                    margin-left: 249px;
                    border-radius: 5px;
                    -webkit-box-sizing: content-box;
                    -moz-box-sizing: content-box;
                    box-sizing: content-box;
                }
            }
        }
        .leave-box {
            .leave-content {
                display: block !important;
                text-align: left;
                min-height: 0 !important;
                padding: 20px 0;
                padding-left: 235px;
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
		.del-box{
			/deep/ .el-dialog {
                overflow: initial;
                width: 450px;
                border-radius: 6px;
                .el-dialog__header {
                    padding-top: 20px;
					padding-bottom: 0;
                    overflow: hidden;
                    position: relative;
                    .el-dialog__title {
                    	color: #303133;
                        font-size: 18px;
                        font-weight: normal;
                    }
                    .el-dialog__headerbtn {
						position: absolute;
						top: 20px;
						right: 20px;
						padding: 0;
						width: 16px;
						height: 16px;
						background: transparent;
						border: none;
						outline: none;
						cursor: pointer;
						font-size: 16px;
                        .el-dialog__close {
                            color: #909399;
                            font-size: 16px;
							left: 0;
							top: 0;
                        }
                    }
                }
                .el-dialog__body {
                    padding: 10px 20px;
                    border: 0;
                    margin: 0;
                }
				.dialog-content{
					width: 100%;
					// border: 1px solid red;
					.dialog-tip{
						vertical-align: middle;
						line-height: 32px;
						font-size: 14px;
						img{
							display: inline-block;
							float: left;
							margin-right: 10px;
						}
					}
					.change-account{
						margin-top: 15px;
						border-top: 1px solid #e1e1e1;
						p{
							font-size: 14px;
							line-height: 24px;
							margin-top: 15px;
						}
						.el-radio{
							display: block;
							margin-top: 15px;
							margin-left: 0;
						}
						span{
							// margin-right: 10px;
							font-size: 12px;
						}
						.name{
							min-width: 50px;
							display: inline-block;
						}
						.relationship{
							width: 35px;
							display: inline-block;
						}

					}
				}
                .bot {
                    width: 100%;
                    margin: 0 auto;
                    margin-top: 25px;
                        	height: 32px;
                    .button-div {
                        width: 60px;
                        	height: 32px !important;
                        background: #F2F2F2;
						float: right;
						.button{
							padding: 0;
                        	height: 32px;
						}
						.custom7{
							background-color: #fff;
							&:hover{
								background-color: #f2f2f2;
								border:1px solid #e6e6e6;
							}
						}
                        &:nth-of-type(2) {
                            margin-right: 10px;
                        }
                    }
                }
            }
		}

    }
</style>
