<template>
    <div class="card-management" @click="checkTarget">
        <div class="turn-top">
            <!--<div class="turn-box identity">-->
                <!--<span>身份介质：</span>-->
                <!--<el-button :class="{on:onCheck == item.value}" type="text" v-for="(item,index) in checkData"-->
                           <!--:key="item.value" @click="checkClick(item.value)">{{ item.title }}-->
                <!--</el-button>-->
            <!--</div>-->
            <div class="turn-box" v-if="onCheck == 0">
                <span>卡片状态：</span>
                <el-button :class="{on:onCard == item.cardState}" type="text" v-for="item in cardData"
                           :key="item.cardState" @click="cardClick(item.cardState)">{{ item.cardStateValue }}
                </el-button>
                <a v-show="false" class="downZip" href="http://client.weds.com.cn/JBrowser_card2017062401.rar">下载</a>
            </div>
            <div class="turn-box">
                <span>人员类型：</span>
                <el-button :class="{on:onCrew == item.value}" type="text" v-for="item in crewData"
                           :key="item.value" @click="crewClick(item.value)">{{ item.title }}
                </el-button>
            </div>
            <div class="turn-box" v-if="onCrew != 2">
                <span>人员范围：</span>
                <el-button :class="{on:onRange == 0 }" type="text" @click="rangeClick">全部</el-button>
                <div class="select-box" id="tree">
                    <div class="input-box" @click="selectClick">
                        <el-input size="small" v-model="section.name" placeholder="请选择人员范围" readonly></el-input>
                    </div>
                    <div class="tree-box" v-if="showTree">
                        <el-tree :data="treeData" node-key="id" :props="defaultProps" :expand-on-click-node="false"
                                 :default-expanded-keys="expandedKeys" @node-click="handleNodeClick"></el-tree>
                    </div>
                </div>
            </div>
        </div>
        <div class="turn-bottom">
            <div class="operate-box">
                <span v-if="onCheck == 0">{{ cardData[onCard].title }}</span>
                <span v-else>{{ checkData[onCheck].title }}录入</span>
                <label v-if="onCheck == 0">
                    <small>{{ allNum }}位</small>
                    <small v-if="onCrew != 2">{{ crewData[onCrew].title }}</small>
                </label>
                <label v-else>
                    <small>{{ allNum }}位</small>
                    <small v-if="onCrew != 2">{{ crewData[onCrew].title }}</small>
                </label>
                <el-button class="batchBtn" type="primary" size="small" @click="batchCard"
                           v-if="onCheck == 0 && onCard == 2">连续发卡
                </el-button>
                <el-button class="exportBtn" type="primary" size="small" @click="exportExcel">导出</el-button>
                <form id="exportClientForm"
					:action="`${this.serverUrl}card/exportCard`"
                    method="post" target="id_updateIframe1"><!-- 	enctype="multipart/form-data" -->
                    <input type="hidden" :value="schoolId" name="schoolId">
                    <input type="hidden" :value="onCrew" name="searchType">
                    <input type="hidden" :value="onRange" name="userDepStr">
                    <input type="hidden" :value="onCard" name="cardState">
                    <input type="hidden" :value="mySearch" name="userNameLike" v-if="mySearch">
                </form>
                <iframe id="id_updateIframe1" name="id_updateIframe1" style="display:none;"></iframe>
                <div class="down-box" @click="downZip">下载读卡程序</div>
                <el-button class="deleteBtn" type="primary" size="small" @click="cardDelete" v-if="onCheck == 1">批量删除</el-button>

                <div class="search-box">
                    <el-input v-model="mySearch" size="small" placeholder="请输入姓名或者学/工号" @change="search">
                        <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
                    </el-input>
                </div>
            </div>
            <div class="table-box">
                <div class="card-box" v-if="onCheck == 0" :key="onCheck">
                    <el-table id="cardTable" ref="cardTable" border height="100%" :data="cardTableData"
                              tooltip-effect="dark"
                              highlight-current-row style="width: 100%" @selection-change="selectionChangeCard"
                              v-loading="tableLoading"><!-- @row-click="toggleSelectionCard"  row-key="device_id"-->
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>
                        <el-table-column prop="userName" label="姓名" align="center"
                                         column-key="userName"></el-table-column>
                        <el-table-column prop="userDepname" label="班级/部门" align="center"
                                         column-key="userDepname" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.userDepname?scope.row.userDepname:' '}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userNo" label="学/工号" align="center" sortable
                                         column-key="userNo" show-overflow-tooltip>
                            <template slot-scope="scope">               <!--搜狗浏览器兼容问题要这么解决-->
                                <span>{{scope.row.userNo?scope.row.userNo:' '}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="userType" label="身份" align="center" column-key="userType"
                                         :formatter="columFormat"></el-table-column>
                        <el-table-column prop="cardNo" label="卡号" align="center"
                                         column-key="cardNo" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <span>{{scope.row.cardInfoList[0].cardNo}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cardAddDate" label="发卡日期" align="center"
                                         column-key="cardAddDate">
                            <template slot-scope="scope">
                                <span>{{scope.row.cardInfoList[0].cardAddDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="beginDate" label="启用日期" align="center"
                                         column-key="beginDate">
                            <template slot-scope="scope">
                                <span>{{scope.row.cardInfoList[0].beginDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="endDate" label="结束日期" align="center"
                                         column-key="endDate">
                            <template slot-scope="scope">
                                <span>{{scope.row.cardInfoList[0].endDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updateDate" label="更新时间" align="center"
                                         column-key="updateDate">
                            <template slot-scope="scope">
                                <span>{{scope.row.cardInfoList[0].updateDate}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="cardStateName" label="卡片状态" align="center"
                                         column-key="cardStateName">
                            <template slot-scope="scope">               <!--搜狗浏览器兼容问题要这么解决-->
                                <span>{{scope.row.cardInfoList[0].cardStateName}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" align="center" :key="key1"
                                         width="200">
                            <template slot-scope="scope">
                                <div class="op-box">
                                    <el-button class="normal" plain size="mini" @click="sendCard(scope.row)"
                                               v-if="(scope.row.cardInfoList[0].cardStateName == '未发卡' || scope.row.cardInfoList[0].cardStateName == '退卡') && roleActions.indexOf('卡管理_@bepf@card@issueSlaveCard_create_own') > -1 ">发卡
                                    </el-button>
                                    <el-button class="normal" plain size="mini" @click="reportLoss(scope.row)"
                                               v-if="scope.row.cardInfoList[0].cardStateName == '正常' && roleActions.indexOf('卡管理_@bepf@card@lossCard_update_own') > -1">挂失
                                    </el-button>
                                    <el-button class="normal" plain size="mini" @click="returnCard(scope.row)"
                                               v-if="scope.row.cardInfoList[0].cardStateName == '正常' && roleActions.indexOf('卡管理_@bepf@card@revokeSlaveCard_update_own') > -1">退卡
                                    </el-button>
                                    <!--<el-button class="normal" plain size="mini" @click="holdRetrun(scope.row)" v-if="onCard == 1">持卡退卡</el-button>-->
                                    <el-button class="normal" plain size="mini" @click="reissueCard(scope.row)"
                                               v-if="scope.row.cardInfoList[0].cardStateName == '挂失' && roleActions.indexOf('卡管理_@bepf@card@reissueSlaveCard_create_own') > -1">补卡
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <!--<div class="finger-box" v-else-if="onCheck == 1" :key="onCheck">
                    <el-table id="fingerTable" ref="fingerTable" height="100%" :data="fingerTableData" border
                              tooltip-effect="dark"
                              highlight-current-row style="width: 100%" @selection-change="selectionChangeFinger"
                              v-loading="tableLoading">
                        &lt;!&ndash; @row-click="toggleSelectionFinger" row-key="deviceinfo_id"&ndash;&gt;
                        <el-table-column type="selection" width="55"></el-table-column>
                        <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>
                        <el-table-column prop="userName" label="姓名" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="userDepname" label="班级/部门" align="center" show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="userNo" label="学/工号" align="center" sortable show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column prop="userType" label="身份" align="center" show-overflow-tooltip
                                         :formatter="columFormat">
                        </el-table-column>
                        <el-table-column label="左手" align="center" show-overflow-tooltip>
                            <el-table-column label="小拇指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger0" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="无名指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger1" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="中指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger2" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="食指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger3" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="大拇指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger4" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        <el-table-column label="右手" align="center" show-overflow-tooltip>
                            <el-table-column prop="" label="小拇指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger5" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="无名指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger6" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="中指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger7" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="食指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger8" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column prop="" label="大拇指" align="center" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <el-checkbox v-model="scope.row.finger9" disabled></el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table-column>
                        &lt;!&ndash;<el-table-column :prop="item.prop" :label="item.label" align="center"
                                         :column-key="item.prop" show-overflow-tooltip v-for="(item,index) in fingerThData"
                                         :key="index">
                            <el-table-column :prop="finger.prop" :label="finger.label" align="center"
                                             :column-key="finger.prop" show-overflow-tooltip :key="findex"
                                             v-for="(finger,findex) in fingerThData[index].left" v-if="item.left">
                                <template slot-scope="scope">{{fingerTableData[0].fingerInfo}}
                                    <el-checkbox v-model="defVal" :true-label="finger.id"></el-checkbox>
                                </template>
                            </el-table-column>
                            <el-table-column :prop="finger.prop" :label="finger.label" align="center"
                                             :column-key="finger.prop" show-overflow-tooltip :key="findexs"
                                             v-for="(finger,findexs) in fingerThData[index].right" v-if="item.right">
                                <template slot-scope="scope">
                                    <el-checkbox v-model="finger.prop" :true-label="finger.id"></el-checkbox>
                                </template>
                            </el-table-column>
                        </el-table-column>&ndash;&gt;
                        <el-table-column fixed="right" label="操作" width="180" align="center">
                            <template slot-scope="scope">
                                <div class="op-box">
                                    <el-button class="normal" plain size="mini" @click="inputFingerprint(scope.row)">
                                        录入指纹
                                    </el-button>
                                    <el-button class="warning" plain size="mini" @click="rowDelete(scope.row)">删除
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>-->
            </div>
            <div class="pagination-box">
                <el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
                               :current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
            </div>
        </div>
        <!--发卡弹窗-->
        <div class="go-face">
            <el-dialog
                    title="发卡"
                    :visible.sync="goCardDialog"
                    center>
                <div class="content">
                    <div class="content-l">
                        <el-form
                                :inline="true"
                                ref="goCardForm"
                                :model="goCardForm"
                                class="demo-form-inline">
                            <el-form-item label="学/工号：">
                                <el-input v-model="goCardForm.userNo" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <el-input v-model="goCardForm.userName" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="部门：">
                                <el-input v-model="goCardForm.userDepname" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="账户类型：">
								<!-- TODO 消费时使用 暂时使用 1：学生 3：教师 -->
                                <el-input :value="goCardForm.userType == 1?'学生':'教师'" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="启用日期：">
                                <el-date-picker style="width: 133px" v-model="goCardForm.currDate"
                                                type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束日期：">
                                <el-date-picker style="width: 133px" v-model="goCardForm.validDate" type="date"
                                                placeholder="选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="卡片类型：">
                                <el-input :value="goCardForm.CardType?goCardForm.CardType == 148 ?'S50卡':goCardForm.CardType == 149 ?'CPU卡':goCardForm.CardType == 154 ?'S70卡':'':''" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物理卡号：">
                                <el-input v-model="goCardForm.CardNo" :disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box">
                            <img :onerror="defaultErrImg"
							:src="(goCardForm.userPhoto?uploadPicUrl + goCardForm.userPhoto+'?imageView2/1/w/170':requrieImg) ">
                        </div>
                    </div>
                </div>
                <div class="bot">
                    <Button btnClass="custom7" btnFontSize="12px" @click="editFaceDialog = false" title="取消"></Button>
                    <Button btnClass="custom8" btnFontSize="12px" @click="goCardSubmit" title="发卡"></Button>
                </div>
            </el-dialog>
        </div>
        <!--挂失弹窗-->
        <div class="go-face">
            <el-dialog
                    title="挂失"
                    :visible.sync="reportLossDialog"
                    center>
                <div class="content" style="padding-bottom:0;">
                    <div class="content-l">
                        <el-form
                                :inline="true"
                                ref="reportLossForm"
                                :model="reportLossForm"
                                class="demo-form-inline">
                            <el-form-item label="学/工号：">
                                <el-input v-model="reportLossForm.userNo" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <el-input v-model="reportLossForm.userName" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="部门：">
                                <el-input v-model="reportLossForm.userDepname" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="账户类型：">
                                <el-input :value="reportLossForm.userType == 1?'学生':'教师'" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物理卡号：">
                                <el-input v-model="reportLossForm.cardNo" :disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box" style="width:140px;height:180px;">
                            <img :onerror="defaultErrImg"
							:src="(reportLossForm.userPhoto?uploadPicUrl + reportLossForm.userPhoto+'?imageView2/1/w/170':requrieImg) ">
                        </div>
                    </div>
                </div>
                <div class="bot">
                    <Button btnClass="custom7" btnFontSize="12px" @click="reportLossDialog = false" title="取消"></Button>
                    <Button btnClass="custom8" btnFontSize="12px" @click="reportLossConfirm"
                            title="挂失"></Button>
                </div>
            </el-dialog>
        </div>
        <!--退卡弹窗-->
        <div class="go-face">
            <el-dialog
                    title="退卡"
                    :visible.sync="returnCardDialog"
                    center>
                <div class="content" style="padding-bottom:0;">
                    <div class="content-l">
                        <el-form
                                :inline="true"
                                ref="returnCardForm"
                                :model="returnCardForm"
                                class="demo-form-inline">
                            <el-form-item label="学/工号：">
                                <el-input v-model="returnCardForm.userNo" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <el-input v-model="returnCardForm.userName" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="部门：">
                                <el-input v-model="returnCardForm.userDepname" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="账户类型：">
                                <el-input :value="returnCardForm.userType == 1?'学生':'教师'" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物理卡号：">
                                <el-input v-model="returnCardForm.cardNo" :disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box" style="width:140px;height:180px;">
                            <img :onerror="defaultErrImg"
							:src="(returnCardForm.userPhoto?uploadPicUrl + returnCardForm.userPhoto+'?imageView2/1/w/170':requrieImg) ">
                        </div>
                    </div>
                </div>
                <div class="bot">
                    <Button btnClass="custom7" btnFontSize="12px" @click="returnCardDialog = false" title="取消"></Button>
                    <Button btnClass="custom8" btnFontSize="12px" @click="returnCardConfirm"
                            title="退卡"></Button>
                </div>
            </el-dialog>
        </div>
        <!--补卡弹窗-->
        <div class="go-face">
            <el-dialog
                    title="补卡"
                    :visible.sync="reissueCardDialog"
                    center>
                <div class="content">
                    <div class="content-l">
                        <el-form
                                :inline="true"
                                ref="reissueCardForm"
                                :model="reissueCardForm"
                                class="demo-form-inline">
                            <el-form-item label="学/工号：">
                                <el-input v-model="reissueCardForm.userNo" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <el-input v-model="reissueCardForm.userName" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="部门：">
                                <el-input v-model="reissueCardForm.userDepname" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="账户类型：">
                                <el-input :value="reissueCardForm.userType == 1?'学生':'教师'" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="启用日期：">
                                <el-date-picker style="width: 133px"
                                                v-model="reissueCardForm.currDate" type="date"
                                                placeholder="选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束日期：">
                                <el-date-picker style="width: 133px"
                                                v-model="reissueCardForm.validDate" type="date"
                                                placeholder="选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="卡片类型：">
                                <el-input :value="reissueCardForm.CardType?reissueCardForm.CardType == 148 ?'S50卡':reissueCardForm.CardType == 149 ?'CPU卡':reissueCardForm.CardType == 154 ?'S70卡':'':''" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物理卡号：">
                                <el-input v-model="reissueCardForm.CardNo" :disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box">
                            <img :onerror="defaultErrImg"
							:src="(reissueCardForm.userPhoto?uploadPicUrl + reissueCardForm.userPhoto+'?imageView2/1/w/170':requrieImg) ">
                        </div>
                    </div>
                </div>
                <div class="bot">
                    <Button btnClass="custom7" btnFontSize="12px" @click="reissueCardDialog = false"
                            title="取消"></Button>
                    <Button btnClass="custom8" btnFontSize="12px" @click="reissueCardSubmit" title="补卡"></Button>
                </div>
            </el-dialog>
        </div>
        <!--连续发卡弹窗-->
        <div class="go-face">
            <el-dialog title="连续发卡" :visible.sync="seriesCardDialog" center>
                <p>（已选择{{ cardSelection.length }}人待发卡，当前第{{ m+1 }}人）</p>
                <div class="content">
                    <div class="content-l">
                        <el-form :inline="true" ref="goCardForm" :model="goCardForm" class="demo-form-inline">
                            <el-form-item label="学/工号：">
                                <el-input v-model="goCardForm.userNo" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="姓名：">
                                <el-input v-model="goCardForm.userName" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="部门：">
                                <el-input v-model="goCardForm.userDepname" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="账户类型：">
                                <el-input :value="goCardForm.userType == 1?'学生':'教师'" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="启用日期：">
                                <el-date-picker style="width: 133px" v-model="goCardForm.currDate"
                                                type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="结束日期：">
                                <el-date-picker style="width: 133px" v-model="goCardForm.validDate" type="date"
                                                placeholder="选择日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="卡片类型：">
                                <el-input :value="goCardForm.CardType?goCardForm.CardType == 148 ?'S50卡':goCardForm.CardType == 149 ?'CPU卡':goCardForm.CardType == 154 ?'S70卡':'':''" :disabled="true"></el-input>
                            </el-form-item>
                            <el-form-item label="物理卡号：">
                                <el-input v-model="goCardForm.CardNo" :disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="content-r">
                        <div class="img-box">
                            <img :onerror="defaultErrImg"
							:src="(goCardForm.userPhoto?uploadPicUrl + goCardForm.userPhoto+'?imageView2/1/w/170':requrieImg) ">
                        </div>
                    </div>
                </div>
                <div class="bot">
                    <el-button class="custom7" type="info" size="normal" @click="seriesCardDialog = false" plain>取消</el-button>
                    <el-button class="custom8" type="primary" size="normal" @click="infiniteCard" :disabled="disabled">连续发卡</el-button>
                </div>
            </el-dialog>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1000" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'
	import {garen_define} from '@/assets/js/jmjlink_card.js'
	import CO from 'co'
	import {Loading} from 'element-ui';

	export default {
		name: 'HelloWorld',
		components: {
			Button, Toast
		},
		computed: {
			defaultErrImg() {
				return 'this.src="' + this.$store.state.Common.defaultErrImg + '"'
			}
		},
		data() {
			return {
				/*  */
				requrieImg: require('../../assets/images/default.png'),
				schoolId:localStorage.getItem('schoolId'),
				defVal: true,
				userNo: localStorage.getItem('userNo') ? localStorage.getItem('userNo') : '',
				daterange: '',   //选择的日期范围
				treeData: [],      //组织架构数组
				section: {      //选择的部门
					id: '',
					name: ''
				},
				mySearch: '',     //输入的搜索内容
				key1: 9,
				checkData: [      //身份介质数组
					{
						value: 0,
						title: '卡片'
					},
					{
						value: 1,
						title: '指纹'
					},
					/*{
                        value:2,
                        title:'人脸'
                    }*/
				],
				onCheck: 0,      //身份介质默认选中项
				faceData: [      //卡片状态数组
					{
						cardState: 0,
						cardStateValue: '全部'
					},
					{
						cardState: 1,
						cardStateValue: '正常'
					},
					{
						cardState: 2,
						cardStateValue: '未发卡'
					},
					{
						cardState: 3,
						cardStateValue: '已挂失'
					},
					/*{
                        value:4,
                        title:'已补卡'
                    }*/
				],
				onCard: 0,      //卡片状态默认选中项
				crewData: [     //人员类型数组
					{
						value: 0,
						title: '学生'
					},
					{
						value: 1,
						title: '教师'
					},
					{
						value: 2,
						title: '全部'
					}
				],
				onCrew: 0,      //人员类型默认选中项
				onRange: 0,     //学生范围默认选中项
//				thData: [],     //table表格列名数组
				cardThData: [       //卡片table表格列名数组
					{
						label: '学/工号',
						prop: 'number'
					},
					{
						label: '姓名',
						prop: 'name'
					},
					{
						label: '身份',
						prop: 'identity'
					},
					{
						label: '班级/部门',
						prop: 'grade'
					},
					{
						label: '开户',
						prop: 'open'
					},
					{
						label: '卡类型',
						prop: 'card_type'
					},
					{
						label: '物理卡号',
						prop: 'card_number'
					},
					{
						label: '卡片状态',
						prop: 'card_status'
					}
				],
				fingerThData: [       //卡片table表格列名数组
					{
						label: '姓名',
						prop: 'userName'
					},
					{
						label: '班级/部门',
						prop: 'userDepname'
					},
					{
						label: '学/工号',
						prop: 'userNo'
					},
					{
						label: '身份',
						prop: 'userType'
					},
					{
						label: '左手',
						fingerInfo: {},
						left: [
							{
								label: '小拇指',
								prop: 'finger0',
								id: 0
							},
							{
								label: '无名指',
								prop: 'finger1',
								id: 1
							},
							{
								label: '中指',
								prop: 'finger2',
								id: 2
							},
							{
								label: '食指',
								prop: 'finger3',
								id: 3
							},
							{
								label: '大拇指',
								prop: 'finger4',
								id: 4
							},
						]
					},
					{
						label: '右手',
						right: [
							{
								label: '小拇指',
								prop: 'finger5',
								id: 5
							},
							{
								label: '无名指',
								prop: 'finger6',
								id: 6
							},
							{
								label: '中指',
								prop: 'finger7',
								id: 7
							},
							{
								label: '食指',
								prop: 'finger8',
								id: 8
							},
							{
								label: '大拇指',
								prop: 'finger9',
								id: 9
							},
						]
					}
				],
				cardSelection: [],          //卡片状态下选中表格的哪些行
				fingerSelection: [],        //指纹状态下选中表格的哪些行
				cardTableData: [      //table数组
					/*{
						userNo: '2014',
						userName: '花样年华',
						userType: '学生',
						userDepname: '马戏班',
						openState: '已开户',
						cardInfoList:[
						    {
						        cardTypeName:''
						    }，
						    {
						        cardNo:''
						    }，
						    {
						        cardStateName:''
						    }
						]
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						userNo: '2015',
						userName: '花样年华',
						userType: '学生2',
						userDepname: '马戏班2',
						openState: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2016',
						student_name: '花样年华',
						student_grade: '学生3',
						check_type: '马戏班3',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2014',
						student_name: '花样年华',
						student_grade: '学生',
						check_type: '马戏班',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2014',
						student_name: '花样年华',
						student_grade: '学生',
						check_type: '马戏班',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2014',
						student_name: '花样年华',
						student_grade: '学生',
						check_type: '马戏班',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2014',
						student_name: '花样年华',
						student_grade: '学生',
						check_type: '马戏班',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2014',
						student_name: '花样年华',
						student_grade: '学生',
						check_type: '马戏班',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2014',
						student_name: '花样年华',
						student_grade: '学生',
						check_type: '马戏班',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},
					{
						student_number: '2014',
						student_name: '花样年华',
						student_grade: '学生',
						check_type: '马戏班',
						leave_time: '已开户',
						leave_type: '金卡',
						approval_status: '20180618',
						leave_school_time: '未发卡',
						back_school_time: '未发卡',
					},*/
				],
				fingerTableData: [
					/*{
						userName: '王二小',
						userDepname: '2018级8班',
						userNo: '20180818',
						userType: '学生',
						finger0: '',
						finger1: false,
						finger2: false,
						finger3: true,
						finger4: false,
						finger5: false,
						finger6: false,
						finger7: false,
						finger8: false,
						finger9: false
					},
					{
						userName: '王二小',
						userDepname: '2018级8班',
						userNo: '20180818',
						userType: '学生',
						finger0: false,
						finger1: false,
						finger2: true,
						finger3: false,
						finger4: false,
						finger5: false,
						finger6: false,
						finger7: false,
						finger8: false,
						finger9:false
					},
					{
						userName: '王二小',
						userDepname: '2018级8班',
						userNo: '20180818',
						userType: '学生',
						finger0: false,
						finger1: false,
						finger2: false,
						finger3: false,
						finger4: false,
						finger5: true,
						finger6: true,
						finger7: false,
						finger8: false,
						finger9: false
					},
					{
						userName: '王二小',
						userDepname: '2018级8班',
						userNo: '20180818',
						userType: '学生',
						finger0: 0,
						finger1: 0,
						finger2: 0,
						finger3: 1,
						finger4: 0,
						finger5: 0,
						finger6: 0,
						finger7: 0,
						finger8: 0,
						finger9: 0
					}*/
				],
				showIndex: false,
				allNum: 0,             //table数组总条数
				currentPage: 1,        //当前页（默认设为第一页）
//				pageSize:[20,50,100,200],        //分页时每页显示多少条数据的数组
				tableLoading: false,          //表格加载动画
				pageItem: 20,                 //分页时当前页显示多少条数据(默认显示20条数据)
//				allpage: 20,              //总页数
				showTree: false,         //树形下拉框不显示
				expandedKeys: [],        //下拉树默认展开的数组节点
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				fastDuration: '1000',
				isToast: false,
				toast: '',
				reportLossDialog: false, //挂失弹窗
				reportLossForm: {}, //挂失form
				returnCardDialog: false, //退卡弹窗
				returnCardForm: {}, //退卡form
				editFaceDialog: false,//发卡弹窗
				goCardForm: { //发卡form
					currDate: '',
					validDate: '',
					cardNO: '',      //form内要显示的属性必须先定义，否则赋值时容易不显示
					CardType: ''      //form内要显示的属性必须先定义，否则赋值时容易不显示
				},
				reissueCardDialog: false,//补卡弹窗
				reissueCardForm: { //补卡form
					currDate: '',
					validDate: '',
					cardNO: '',      //form内要显示的属性必须先定义，否则赋值时容易不显示
					CardType: ''      //form内要显示的属性必须先定义，否则赋值时容易不显示
				},
				seriesCardDialog: false,//连续发卡弹窗
				seriesCardForm: {}, //连续发卡form
				jobData: [],
				jobData: [
					{
						code_item_name: '班主任',
						code_item_id: '1'
					},
					{
						code_item_name: '教师',
						code_item_id: '2'
					}
				],
				m: 0,    //连续发卡时第几个学生,默认是第一个
				cardOneTimer: null,     //发卡定时器
				cardTestTimer: null,     //连续发卡定时器
				cardRepairTimer: null,     //补卡定时器
				noCardTimer: null,     //发卡定时器 验证卡是否读卡成功
				cardArr:[],//存放已发过卡号
				disabled:false,
			}
		},
		methods: {
			/**
			 *  @function: 获取卡片状态列表
			 *  @author: wzx
			 *  @date 2018-09-11
			 */
			downZip(){
				$('.downZip')[0].click();
            },
			/**
			 *  @function: 获取卡片状态列表
			 *  @author: wzx
			 *  @date 2018-09-11
			 */
			getCardData() {
                this.$api.BasicInfo.getCardState().then(res => {
					if (res.data.code == 600) {
						this.cardData = res.data.data;
						// console.log('66668888', this.faceData)
					} else if (res.data.code == 601) {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
			},
			/**
			 *  @function: 起止日期的默认日期初始化功能
			 *  @author: wzx
			 *  @date 2018-08-31
			 */
			defaultDate(form) {
				let now = new Date();
				let startDate = new Date(
					Date.UTC(now.getFullYear(), now.getMonth(), now.getDate())
				).toISOString().slice(0, 10);
				let endDate = new Date(
					Date.UTC(now.getFullYear() + 20, now.getMonth(), now.getDate())
				).toISOString().slice(0, 10);
				form.currDate = '';        //清除
				form.validDate = '';       //清除
				form.currDate = startDate;  //赋值
				form.validDate = endDate;   //赋值
				// console.log(11111111111111, form.currDate, form.validDate)
			},
			/**
			 *  @function: toast关闭
			 *  @author: cs
			 *  @date 2018-08-01
			 */
			hideToast() {
				this.isToast = false;
			},
			handleSelectionChange(val) {
				// console.log("val:", val)
			},
			/**
			 *  @function: 加载树形组织结构列表
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			loadStructure() {
				let params = {
					schoolId: localStorage.getItem('schoolId')
				}
				if (this.onCrew == 0) {
                	this.$api.Common.getTreeListStudent(params).then(res => {
						// console.log('66667777', res)
						if (res.data.code == 600) {
							this.treeData = res.data.data;
						} else if (res.data.code == 601) {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					})
				} else if (this.onCrew == 1) {
                	this.$api.Common.getTreeListTeacher(params).then(res => {
						// console.log('4444', res)
						if (res.data.code == 600) {
							this.treeData = res.data.data;
						} else {
							this.isToast = true;
							this.toast = res.data.msg;
						}
					})
				} else {
					this.treeData = [];
				}
			},
			/**
			 *  @function: 页面初始化加载表格方法
			 *  @author: wzx
			 *  @date 2018-7-25
			 **/
			changePage() {
				let params = {
					"count": true,
//	                "orderBy": "userNo asc",
					"pageIndex": this.currentPage,             //页码
					"pageSize": this.pageItem,              //每页条数
					"searchStr": {
						"cardState": this.onCard,         //卡片状态
						"depStr": this.section.id,        //选择的人员范围的id
						"idenType": this.onCheck,          //身份介质
						"userDepLike": "",
						"userNameLike": this.mySearch,    //模糊查询
						"userNoLike": "",
						"userType": this.onCrew           //人员类型
					}
				}
				this.tableLoading = true;
                this.$api.BasicInfo.getCardList(params).then(res => {
					// console.log('22222222', res)
					this.tableLoading = false;
					if (res.data.code == 600) {
						if (this.onCheck == 0) {
							this.cardTableData = res.data.data.records;
							this.allNum = res.data.data.total_record;
						} else if (this.onCheck == 1) {     //介质为指纹时的列表，二期可隐藏不用
							this.fingerTableData = res.data.data.records;
							this.allNum = res.data.data.total_record;
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
			 *  @function: 搜索(姓名或者学/工号的模糊查询)操作
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			search() {
				// console.log(666)
				this.changePage()
			},
			exportExcel() {
				/*this.isToast = true;
				this.toast = '该功能开发中';
				return;*/
				// console.log("导出档案")
                this.disabled = true;
				$('#exportClientForm').submit();
			},
			cardDelete() {
				this.isToast = true;
				this.toast = '该功能开发中';
				return;
			},
			/**
			 *  @function: 点击选择身份介质  1：卡片  2：指纹
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			checkClick(index) {
				this.onCheck = index;
				// console.log(index, this.onCard)
				this.currentPage = 1;
				this.initLayout();
				this.changePage();
			},
			/**
			 *  @function: 点击选择卡片状态
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			cardClick(index) {
				this.onCard = index;
				// console.log(index)
				this.currentPage = 1;
				this.changePage();
			},
			/**
			 *  @function: 点击选择人员类型，切换树形部门结构
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			crewClick(index) {
				this.onCrew = index;
				this.section.id = 0;
				this.section.name = '';
				this.onRange = 0;
				this.currentPage = 1;
				// console.log(index)
				this.initLayout();
				this.loadStructure();
				this.changePage();
			},
			/**
			 *  @function: 点击选择人员范围
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			rangeClick() {
				this.onRange = 0;
				this.section.id = 0;
				this.section.name = '';
				this.currentPage = 1;
				this.changePage();
			},
			/**
			 *  @function: 点击选择人员范围，加载树形部门结构，默认展开一级菜单
			 *  @author: wzx
			 *  @date 2018-7-26
			 **/
			selectClick() {
				this.onRange = 0;
				this.showTree = !this.showTree
				// console.log(888, this.onRange)
				if (this.showTree) {
					this.expandedKeys = [];
					if (this.treeData.length > 0) {
						this.treeData.forEach((item) => {
							this.expandedKeys.push(item.id)
						})
					}
					// console.log(2222,this.treeData)
				}
			},
			/**
			 *  @function: 表格中身份列的格式化函数  userType:1-->学生；2-->家长；3-->教师
			 *  @author: wzx
			 *  @date 2018-7-27
			 **/
			columFormat(row, column, cellValue) {               //（处理状态）星号列展示formatter
				if (cellValue == 1) {                           //
					cellValue = '学生'
				} else if (cellValue == 2) {
					cellValue = '家长'
				} else if (cellValue == 3) {
					cellValue = '教师'
				}
				return cellValue
			},
			/**
			 *  @function: 表格中身份列的格式化函数  openType:0-->未开户；1-->已开户；
			 *  @author: wzx
			 *  @date 2018-7-30
			 **/
			openFormat(row, column, cellValue) {               //（处理状态）星号列展示formatter
				if (cellValue == 0) {//
					cellValue = '未开户'
				} else if (cellValue == 1) {
					cellValue = '已开户'
				}
				return cellValue
			},
			/**
			 *  @function: 点击下拉树形控件后，树形控件隐藏并将选择的值传到文本框
			 *  @author: wzx
			 *  @date 2018-7-30
			 **/
			handleNodeClick(node) {
				// console.log(7777, node);
				this.showTree = false
				if (node.group == 105) {    //只有最后一级是班级--105，才把年级+班级名称拼接起来返回
					// console.log(7777, node.group, userDepname)
					let userDepname = this.getClassName(this.treeData, node.id)
					this.section.name = userDepname;
					this.section.id = node.id;
					this.onRange = node.id;
					// console.log(6666, node.group, userDepname,this.section)
				} else {
					this.section.name = node.label;
					this.section.id = node.id;
					this.onRange = node.id;
				}
				this.changePage();
			},
			/**
			 *  @function:获取点击年级名称+班级名称
			 *  @author: cs
			 *  @date 2018-08-06
			 **/
			getClassName(searchData, searchVal) {
				let resultArr = '';     //数组清空
				let vThis = this;
				let classArr = '';
				function ifArrVal(arr, value) {//多维数组判断是否存在某值
					for (let i = 0; i < arr.length; i++) {
						if (arr[i].children instanceof Array) {//判断是否为多维数组
							if (arr[i].children.length > 0) {
								for (let k = 0; k < arr[i].children.length; k++) {
									if (arr[i].children[k].children.length == 0) {
										if (arr[i].children[k].id == value) {
											classArr = arr[i].label;
											// console.log(6666666666666,classArr,arr[i])
										}
									}
								}
								ifArrVal(arr[i].children, value);
							} else {
								if (arr[i].id == value) {
									resultArr = arr[i].label
									// console.log(1112212,resultArr,arr[i])
								}
							}
						}
					}
					return -1;//不存在
				}

				ifArrVal(searchData, searchVal)
				resultArr = classArr + ` ` + resultArr;
				// console.log(999, resultArr)
				return resultArr
			},
			/**
			 *  @function: 表格操作-连续发卡
			 *  @author: wzx
			 *  @date 2018-8-30
			 **/
			batchCard() {
				let vThis = this;
				this.m = 0;
				this.disabled = false;
//				this.goCardForm = {}
				if (this.cardSelection.length === 0) {
					this.isToast = true;
					this.toast = '请至少选择一位要发卡的教师';
				} else {
					this.defaultDate(this.goCardForm);
					let rows = this.cardSelection[this.m];
					this.seriesCardDialog = true;
					// console.log(3333, rows)
					this.goCardForm.userSerial = rows.userSerial;
					this.goCardForm.userNo = rows.userNo;
					this.goCardForm.userName = rows.userName;
					this.goCardForm.userDepname = rows.userDepname;
					this.goCardForm.userType = rows.userType;
					this.goCardForm.CardNo = '';//卡号
					this.goCardForm.CardType = '';//卡类型
					this.disabled = true;
					window.clearInterval(this.cardTestTimer)
					this.cardTestTimer = setInterval(()=>{
						if(vThis.m<vThis.cardSelection.length){
//							this.goCardForm.CardNo = '';//卡号
//							this.goCardForm.CardType = '';//卡类型
							vThis.readCardInfo(rows,'goCardForm',2);
						}else{
							window.clearInterval(vThis.cardTestTimer)
							return
                        }
					},3000)
				}
			},
			/**
			 *  @function: 读卡器读卡功能
			 *  @author: wzx
			 *  @date 2018-9-12
			 **/
			readCardInfo(rows,formName,differ) {
				//row:当前行数据 formName:form名 differ: 1--发卡 2--连续发卡 3--补卡

				if(this.seriesCardDialog == false && differ == 2){
					return
                }
				this[formName].CardNo = '';//卡号
				this[formName].CardType = '';//卡类型
				let vThis = this;
				//获取发卡卡号信息
				let cardInfo;
				let cardObj = this.$router.cardObj;
				CO(function* () {
					cardInfo = yield cardObj.readCard();
					// console.log(666888, cardInfo)
					if (cardInfo.ErrCode == 0) {//成功
						//进行发卡提交
						vThis[formName].CardNo = cardInfo.retData.CardNo;//卡号
						vThis[formName].CardType = cardInfo.retData.CardType;//卡类型
                        if(vThis.m == 0 && differ == 2){
	                        vThis.disabled = false;
						}
						// if(differ == 1){
						// 	vThis.editFaceDialog = true;//发卡弹窗显示
						// }else if(differ == 2){
						// 	vThis.reissueCardDialog = true;//连续发卡弹窗显示
						// }else if(differ == 3){
						// 	vThis.seriesCardDialog = true;//补卡弹窗显示
						// }
					}else {
						// vThis.isToast = true;
						// vThis.toast = cardInfo.msg;
						vThis.$message({
							showClose: true,
							message: cardInfo.msg,
							type: "error",
							duration: vThis.msgDuration
						});
					}
				})
			},
			/**
			 *  @function: 连续发卡方法
			 *  @author: wzx
			 *  @date 2018-09-12
			 */
			infiniteCard() {
				let vThis = this;
				if (!this.goCardForm.currDate) {
					this.$message({
						message: '请选择开始时间！',
						type: 'error', duration: this.msgDuration
					})
					return
				} else if (!this.goCardForm.validDate) {
					this.$message({
						message: '请选择结束时间！',
						type: 'error', duration: this.msgDuration
					})
					return
				} else if (this.goCardForm.currDate >= this.goCardForm.validDate) {
					this.$message({
						message: '启用时间不能大于结束时间！',
						type: 'error', duration: this.msgDuration
					})
					return;
				}
				// console.log(77777777777,this.goCardForm.CardNo)
				if(this.goCardForm.CardNo != ''){
					window.clearInterval(this.noCardTimer)
					this.noCardTimer = setInterval(()=>{
						vThis.submitSendCard();
					},3000)
				}
			},
			/**
			 *  @function: 连续发卡提交功能
			 *  @author: wzx
			 *  @date 2018-9-15
			 **/
            submitSendCard(){
				this.disabled = true;
	            let params = {
		            "appAccountId": this.goCardForm.userSerial,//应用账户id
		            "cardNo": this.goCardForm.CardNo,//卡号
		            "ctUserId": localStorage.getItem('userId'),//操作人
		            "currDateTime": this.goCardForm.currDate,//开始日期
		            "depId": this.goCardForm.userDep,//部门ID
		            "depositAmt": 0,//卡押金
		            "idenTypeId": this.goCardForm.userType,//身份类型id
		            "isMasterCard": 0,//是否是1主卡0副卡
		            "jobStat": 1,//在职状态
		            "mediaType": this.goCardForm.CardType,//介质类型---------------------???
		            "payMode": 1,//支付方式
		            // "personId": vThis.goCardForm.userSerial,//人员ID
		            // "tradUnitId": 0,//交易发生地单位ID
		            // "userUnitId": 0,//持卡人单位ID
		            "validDate": this.goCardForm.validDate//结束日期
	            }
	            Loading.service();
                this.$api.BasicInfo.issueSlaveCard(params).then(res => {
		            // console.log('点击连续发卡', res.data)
		            Loading.service().close();
		            if (res.data.code == 600) {
			            this.$message({
				            message: res.data.msg,
				            type: 'success', duration: this.fastDuration
			            })
//                        this.cardArr.push(this.goCardForm.CardNo)
			            if(this.m < this.cardSelection.length-1){
				            this.m++;
				            this.goCardForm.userSerial = '';
				            this.goCardForm.userNo = '';
				            this.goCardForm.userName = '';
				            this.goCardForm.userDepname = '';
				            this.goCardForm.userType = '';
				            this.goCardForm.CardNo = '';//卡号
				            this.goCardForm.CardType = '';//卡类型
				            let rows = this.cardSelection[this.m];
				            // console.log(33332222, rows)
				            this.goCardForm.userSerial = rows.userSerial;
				            this.goCardForm.userNo = rows.userNo;
				            this.goCardForm.userName = rows.userName;
				            this.goCardForm.userDepname = rows.userDepname;
				            this.goCardForm.userType = rows.userType;
			            }else{
							this.seriesCardDialog = false;
				            window.clearInterval(this.noCardTimer)
				            this.changePage();
				            return
			            }
		            } else {
						this.$message({
							showClose: true,
							message: res.data.msg,
							type: "error",
							duration: this.msgDuration
						});
		            }
	            }).catch(err =>{
                    Loading.service().close();
					window.clearInterval(this.noCardTimer)
                })
            },
			/**
			 *  @function: 表格操作-发卡
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			sendCard(row) {
				// console.log('发卡:', row)
				if(!localStorage.getItem('downZip')) {
					this.$message({
						showClose: true,
						message: '请下载安装读卡程序！',
						type: "error",
						duration: this.msgDuration
					});
					return
                }
				let rows = JSON.parse(JSON.stringify(row));//深拷贝row中的值
				this.defaultDate(this.goCardForm);     //日期选择默认值初始化
				let vThis = this;
				//获取发卡卡号信息
				let cardInfo;
				let cardObj = vThis.$router.cardObj;
				this.goCardDialog = true;//发卡弹窗显示
				vThis.goCardForm.userNo = rows.userNo;
				vThis.goCardForm.userName = rows.userName;
				vThis.goCardForm.userDepname = rows.userDepname;
				vThis.goCardForm.userType = rows.userType;
				vThis.goCardForm.cardInfoList = rows.cardInfoList;
				vThis.goCardForm.userSerial = rows.userSerial;
				vThis.goCardForm.userDep = rows.userDep;
				vThis.goCardForm.userPhoto = rows.userPhoto;
				vThis.goCardForm.cardStateName = rows.cardInfoList[0].cardStateName;//卡状态名称
				vThis.goCardForm.cardAddDate = rows.cardInfoList[0].cardAddDate;//卡状态名称
				vThis.goCardForm.beginDate = rows.cardInfoList[0].beginDate;//启用日期
				vThis.goCardForm.endDate = rows.cardInfoList[0].endDate;//结束日期
				vThis.goCardForm.updateDate = rows.cardInfoList[0].updateDate;//更新日期

				CO(function* () {
					cardInfo = yield cardObj.readCard();
					window.clearInterval(vThis.cardOneTimer)
					vThis.cardOneTimer = setInterval(()=>{
						vThis.readCardInfo(rows,'goCardForm',1);
					},3000)
					if (cardInfo.ErrCode == 0) {//成功
						//进行发卡提交
						vThis.goCardForm.CardNo = cardInfo.retData.CardNo;//卡号
						vThis.goCardForm.CardType = cardInfo.retData.CardType;//卡类型

						// console.log(3333, vThis.goCardForm)
					} else {//获取卡信息不成功
						// vThis.isToast = true;
						// vThis.toast = cardInfo.msg;
						vThis.$message({
							showClose: true,
							message: cardInfo.msg,
							type: "error",
							duration: vThis.msgDuration
						});


					}
				})
			},
			/**
			 *  @function: 表格操作-挂失
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			reportLoss(row) {
//				this.isToast = true;
//				this.toast = '该功能开发中';
//				return;
				this.reportLossDialog = true; //挂失弹窗显示
				this.reportLossForm = row;
				if (this.reportLossForm.cardInfoList.length > 0) {
					this.reportLossForm.cardTypeName = this.reportLossForm.cardInfoList[0].cardTypeName;
					this.reportLossForm.cardNo = this.reportLossForm.cardInfoList[0].cardNo;
				}
				// console.log("挂失row：", row);
			},
			/**
			 *  @function: 表格操作-退卡
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			returnCard(row) {
				/*this.isToast = true;
				this.toast = '该功能开发中';
				return;*/
				this.returnCardDialog = true; //发卡弹窗显示
				this.returnCardForm = row;
				if (this.returnCardForm.cardInfoList.length > 0) {
					this.returnCardForm.cardTypeName = this.returnCardForm.cardInfoList[0].cardTypeName;
					this.returnCardForm.cardNo = this.returnCardForm.cardInfoList[0].cardNo;
				}
				// console.log("退卡row：", row);
			},
			/**
			 *  @function: 表格操作-补卡
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			reissueCard(row) {
				if(!localStorage.getItem('downZip')) {
					this.$message({
						showClose: true,
						message: '请下载安装读卡程序！',
						type: "error",
						duration: this.msgDuration
					});
					return
				}
				let rows = JSON.parse(JSON.stringify(row));//深拷贝row中的值
				this.defaultDate(this.reissueCardForm);     //日期选择默认值初始化
				let vThis = this;
				vThis.reissueCardDialog = true;//发卡弹窗显示
				vThis.reissueCardForm.userNo = rows.userNo;
				vThis.reissueCardForm.userName = rows.userName;
				vThis.reissueCardForm.userDepname = rows.userDepname;
				vThis.reissueCardForm.userType = rows.userType;
				vThis.reissueCardForm.cardInfoList = rows.cardInfoList;
				vThis.reissueCardForm.userSerial = rows.userSerial;
				vThis.reissueCardForm.userDep = rows.userDep;
				vThis.reissueCardForm.userPhoto = rows.userPhoto;
				vThis.reissueCardForm.cardStateName = rows.cardInfoList[0].cardStateName;//卡状态名称
				vThis.reissueCardForm.cardAddDate = rows.cardInfoList[0].cardAddDate;//卡状态名称
				vThis.reissueCardForm.beginDate = rows.cardInfoList[0].beginDate;//启用日期
				vThis.reissueCardForm.endDate = rows.cardInfoList[0].endDate;//结束日期
				vThis.reissueCardForm.updateDate = rows.cardInfoList[0].updateDate;//更新日期
				//获取补卡卡号信息
				let cardInfo;
				let cardObj = this.$router.cardObj;
				CO(function* () {
					cardInfo = yield cardObj.readCard();
					// console.log(666888, cardInfo)
					window.clearInterval(vThis.cardRepairTimer)
					vThis.cardRepairTimer = setInterval(()=>{
						vThis.readCardInfo(rows,'reissueCardForm',3);
					},3000)
					if (cardInfo.ErrCode == 0) {//成功
						//进行补卡提交

						vThis.reissueCardForm.CardNo = cardInfo.retData.CardNo;//卡号
						vThis.reissueCardForm.CardType = cardInfo.retData.CardType;//卡类型
						// console.log(3333, vThis.reissueCardForm)
					} else {//获取卡信息不成功
						vThis.$message({
							showClose: true,
							message: cardInfo.msg,
							type: "error",
							duration: vThis.msgDuration
						});

					}
				})
			},
			/**
			 *  @function: 表格操作-录入指纹
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			inputFingerprint(row) {
				this.isToast = true;
				this.toast = '该功能开发中';
				return;
			},
			/**
			 *  @function: 表格操作-录入指纹删除
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			rowDelete(row) {
				this.isToast = true;
				this.toast = '该功能开发中';
				return;
			},
			/**
			 *  @function卡片状态下选中的表格中的哪些行
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			selectionChangeCard(val) {
				this.cardSelection = val;
				// console.log(6868, this.cardSelection)
			},
			/**
			 *  @function指纹状态下选中的表格中的哪些行
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			selectionChangeFinger(val) {
				this.fingerSelection = val;
				// console.log(6868, this.fingerSelection)
			},
			/**
			 *  @function点击列表中某行的选中事件
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			toggleSelectionCard(row) {
				// console.log(777, row)
				this.$refs.cardTable.toggleRowSelection(row);
			},
			/**
			 *  @function点击列表中某行的选中事件
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			toggleSelectionFinger(row) {
				// console.log(777, row)
				this.$refs.fingerTable.toggleRowSelection(row);
			},
			/**
			 *  @function设置每页显示数据条数的功能
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			handleSizeChange(val) {
				// console.log(`每页 ${val} 条`);
				this.pageItem = val;
				this.currentPage = 1;
				this.changePage();
			},
			/**
			 *  @function切换当前页的功能
			 *  @author: wzx
			 *  @date 2018-7-17
			 **/
			handleCurrentChange(val) {
				// console.log(`当前页: ${val}`);
				this.currentPage = val;
				this.changePage();
			},
			/**
			 *  @function页面布局初始化的功能
			 *  @author: wzx
			 *  @date 2018-7-12
			 **/
			initLayout() {
				let vThis = this;
				setTimeout(() => {
					let icH = $('.index > .m-cen').height();
					let ttH = $('.turn-top').height();
					let obH = $('.operate-box').height();
					let pbH = $('.pagination-box').height();
					let tbH = icH - ttH;
					let tblH = icH - ttH - obH - pbH - 15;
					// console.log(666, icH, ttH, obH, pbH, tblH, tbH)
					$('.turn-bottom').height(tbH)
					$('.table-box').height(tblH)
					$('.card-box').height(tblH)
					$('.finger-box').height(tblH)
				}, 25)
			},
			/**
			 *  @function页面点击其他地方，人员范围的树形控件弹窗隐藏的功能
			 *  @author: wzx
			 *  @date 2018-7-30
			 **/
			checkTarget(e) {
//				console.log(6666,event.currentTarget)
				if ($(e.target).closest("#tree").length == 0) {
					//点击id为tree之外，则触发
					this.showTree = false
				}
			},
			/**
			 *  @function: 发卡点击确认
			 *  @author: lxr
			 *  @date 2018-08-04
			 */
			goCardSubmit() {
				let vThis = this;
				// console.log('123:', this.goCardForm)
				//发卡按钮点击 清空定时器

				if (!this.goCardForm.currDate) {
					this.$message({
						message: '请选择开始时间！',
						type: 'error', duration: this.msgDuration
					})
					return
				} else if (!this.goCardForm.validDate) {
					this.$message({
						message: '请选择结束时间！',
						type: 'error', duration: this.msgDuration
					})
					return
				} else if (this.goCardForm.currDate >= this.goCardForm.validDate) {
					this.$message({
						message: '启用时间不能大于结束时间！',
						type: 'error', duration: this.msgDuration
					})
					return;
				}
				let params = {
					"appAccountId": this.goCardForm.userSerial,//应用账户id
					"cardNo": this.goCardForm.CardNo,//卡号
					"ctUserId": localStorage.getItem('userId'),//操作人
					"currDateTime": this.goCardForm.currDate,//开始日期
					"depId": this.goCardForm.userDep,//部门ID
					"depositAmt": 0,//卡押金
					"idenTypeId": this.goCardForm.userType,//身份类型id
					"isMasterCard": 0,//是否是1主卡0副卡
					"jobStat": 1,//在职状态
					"mediaType": this.goCardForm.CardType,//介质类型---------------------???
					"payMode": 1,//支付方式
					// "personId": vThis.goCardForm.userSerial,//人员ID
					// "tradUnitId": 0,//交易发生地单位ID
					// "userUnitId": 0,//持卡人单位ID
					"validDate": this.goCardForm.validDate//结束日期
				}
				// console.log("params",params)
				Loading.service();
                this.$api.BasicInfo.issueSlaveCard(params).then(res => {
					// console.log('点击发卡', res.data)
					Loading.service().close();
					if (res.data.code == 600) {
						window.clearInterval(vThis.cardOneTimer);
						this.goCardDialog = false;//关闭弹窗
						this.$message({
							message: res.data.msg,
							type: 'success', duration: this.msgDuration
						})
						this.changePage();
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    Loading.service().close();
					window.clearInterval(this.noCardTimer)
                })
			},
			/**
			 *  @function: 确认点击挂失
			 *  @author: wzx
			 *  @date 2018-08-30
			 */
			reportLossConfirm() {
				// console.log("确认点击挂失", this.reportLossForm);
				if (this.reportLossForm.cardInfoList) {

				}
				Loading.service();
				let params = {
					appAccountId: this.reportLossForm.userSerial,// 0,//应用账户id
					cardLogicNo: this.reportLossForm.cardInfoList[0].cardSerial,//逻辑卡号    this.returnCardForm
					ctUserId: localStorage.getItem('userId'),//操作人
					depId: this.reportLossForm.userDep,//0,//部门ID
					depositAmt: 0,//卡押金 //没有 先传 0
					idenTypeId: this.reportLossForm.userType,//0,//身份类型id
					jobStat: 1,//在职状态 	 没有先传 1
					// personId: 0,//人员ID
					// tradUnitId: 0,//交易发生地单位ID
					// userUnitId: 0//持卡人单位ID
				};
                this.$api.BasicInfo.lossCard(params).then(res => {
					// console.log("确认点击挂失", res);
					Loading.service().close();
					if (res.data.code == 600) {
						this.reportLossDialog = false;
						this.$message({
							message: res.data.msg,
							type: 'success', duration: this.msgDuration
						})
						this.changePage();
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    Loading.service().close();
                })
			},
			/**
			 *  @function: 确认点击退卡
			 *  @author: cs
			 *  @date 2018-08-04
			 */
			returnCardConfirm() {
				// console.log("确认点击退卡", this.returnCardForm);
				if (this.returnCardForm.cardInfoList) {

				}
				Loading.service();
				let params = {
					appAccountId: this.returnCardForm.userSerial,// 0,//应用账户id
					cardLogicNo: this.returnCardForm.cardInfoList[0].cardSerial,//逻辑卡号    this.returnCardForm
					ctUserId: localStorage.getItem('userId'),//操作人
					depId: this.returnCardForm.userDep,//0,//部门ID
					depositAmt: 0,//卡押金 //没有 先传 0
					idenTypeId: this.returnCardForm.userType,//0,//身份类型id
					jobStat: 1,//在职状态 	 没有先传 1
					// personId: 0,//人员ID
					// tradUnitId: 0,//交易发生地单位ID
					// userUnitId: 0//持卡人单位ID
				};
                this.$api.BasicInfo.revokeSlaveCard(params).then(res => {
					// console.log("确认点击退卡", res);
					Loading.service().close();
					if (res.data.code == 600) {
						this.returnCardDialog = false;
						this.$message({
							message: res.data.msg,
							type: 'success', duration: this.msgDuration
						})
						this.changePage();
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    Loading.service().close();
                })
			},

			/**
			 *  @function: 补卡点击确认
			 *  @author: lxr
			 *  @date 2018-08-04
			 */
			reissueCardSubmit() {
				// console.log('123:', this.reissueCardForm)
				if (!this.reissueCardForm.currDate) {
					this.$message({
						message: '请选择开始时间！',
						type: 'error', duration: this.msgDuration
					})
					return
				} else if (!this.reissueCardForm.validDate) {
					this.$message({
						message: '请选择结束时间！',
						type: 'error', duration: this.msgDuration
					})
					return
				} else if (this.reissueCardForm.currDate >= this.reissueCardForm.validDate) {
					this.$message({
						message: '启用时间不能大于结束时间！',
						type: 'error', duration: this.msgDuration
					})
					return;
				}

				let params = {
					"appAccountId": this.reissueCardForm.userSerial,//应用账户id
					"cardNo": this.reissueCardForm.CardNo,//卡号
					"ctUserId": localStorage.getItem('userId'),//操作人
					"currDateTime": this.reissueCardForm.currDate,//开始日期
					"depId": this.reissueCardForm.userDep,//部门ID
					"depositAmt": 0,//卡押金
					"idenTypeId": this.reissueCardForm.userType,//身份类型id
					"isMasterCard": 0,//是否是1主卡0副卡
					"jobStat": 1,//在职状态
					"mediaType": this.reissueCardForm.CardType,//介质类型---------------------???
					"payMode": 1,//支付方式
					"lossCardLogicNo": this.reissueCardForm.cardInfoList[0].cardSerial,//逻辑卡号,
					// "personId": vThis.goCardForm.userSerial,//人员ID
					// "tradUnitId": 0,//交易发生地单位ID
					// "userUnitId": 0,//持卡人单位ID
					"validDate": this.reissueCardForm.validDate ? this.reissueCardForm.validDate : ''//结束日期
				}
				Loading.service();
                this.$api.BasicInfo.reissueSlaveCard(params).then(res => {
					// console.log('点击补卡', res.data)
					Loading.service().close();
					if (res.data.code == 600) {
						window.clearInterval(this.cardRepairTimer);//补卡定时器清空
						this.reissueCardDialog = false;//关闭弹窗
						this.$message({
							message: "补卡成功",
							type: 'success', duration: this.msgDuration
						})
						this.changePage();
					} else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				}).catch(err =>{
                    Loading.service().close();
					window.clearInterval(this.cardRepairTimer);//补卡定时器清空
                })
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
			 *  @function: 关闭弹窗
			 *  @author: cs
			 *  @date 2018-09-20
			 */
			closeDialog(dialogName) {
				// console.log(`${dialogName}关闭弹窗`)
				this[dialogName] = false;
			},
		},
		watch: {
			editFaceDialog(state){
				//单次发卡监听
				// console.log(66,state)
				if(state == false){
					window.clearInterval(this.cardOneTimer);//单次发卡定时器清空
				}
			},
			seriesCardDialog(state){
				//连续发卡监听
				// console.log(66,state)
				if(state == false){
					window.clearInterval(this.cardTestTimer);//连续发卡定时器清空
					window.clearInterval(this.noCardTimer);//连续发卡方法
				}
			},
			reissueCardDialog(state){
				//补卡监听
				// console.log(66,state)
				if(state == false){
					window.clearInterval(this.cardRepairTimer);//补卡定时器清空
				}
			},
		},
		created() {
			this.loadStructure();
			this.getCardData();
			this.changePage();
//			this.defaultDate();
		},
		mounted() {
			// console.log(111,this.serverUrl,this.uploadPicUrl)
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.initLayout();
			let vThis = this;
//			localStorage.removeItem('downZip');//测试使用
			let downZip = localStorage.getItem('downZip');
			let isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
			let isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
//			if (isMac) return "Mac";
			let isUnix = (navigator.platform == "X11") && !isWin && !isMac;
//			if (isUnix) return "Unix";
			let isLinux = (String(navigator.platform).indexOf("Linux") > -1);
//			if (isLinux) return "Linux";
			if (isWin) {
				if (!downZip) {
					vThis.$alert('请重新下载读卡器服务并安装！', '提示', {
						confirmButtonText: '点击下载',
						callback: action => {
							// console.log('action', action)
							if (action == 'cancel'){
								// console.log(1,localStorage.getItem('downZip'))
								return;
                            }
							localStorage.setItem('downZip', 1);
							$('.downZip')[0].click();
						setTimeout(()=>{
//							history.go(0)
							vThis.$router.cardObj = garen_define();
							let cardObj = vThis.$router.cardObj;
							cardObj.load('jmjcard', '160629001', function (jtype, jtext, jpre_str) {
//								console.log(7777, jtype, jtext, jpre_str)
								if (jtype == 2) {
									vThis.$alert('读卡器服务连接失败,请下载并安装读卡程序！', '提示', {
										confirmButtonText: '确定',
										callback: action => {
//								history.go(0)
										}
									});
									return;
								}
								CO(function* () {
									try {
										let result;
										let param = {}
										result = yield cardObj.init(param);
										if (0 != result.ErrCode) {
//											console.log(22222222222222,result.ErrCode)
											self.$alert("读卡器服务连接失败,请下载并安装读卡程序！", "提示", {"type": "info"});
											yield cardObj.errorBeep();
											return;
										}
										yield cardObj.successBeep();
										return
									} catch (err) {
										// console.log('err', err)
										self.$alert(err.msg, "提示", {"type": "info"});
										return;
									}
								});
							});
                        },1000)
						}
					});
					return;
				}
//				console.log('aaa', garen_define())
				vThis.$router.cardObj = garen_define();
				let cardObj = vThis.$router.cardObj;
				cardObj.load('jmjcard', '160629001',  (jtype, jtext, jpre_str)=> {
//					console.log(7777, jtype, jtext, jpre_str)
					if (jtype == 2) {
						vThis.$alert('读卡器服务连接失败,请下载并安装读卡程序！', '提示', {
							confirmButtonText: '确定',
							callback: action => {
//								history.go(0)
							}
						});
						return;
					}
					CO(function* () {
						try {
							let result
							let param = {
//							readerKeyInfo : readerKeyInfo
							}
							result = yield cardObj.init(param);
							if (0 != result.ErrCode) {
//								console.log(6666666666,result.ErrCode)
								self.$alert("读卡器服务连接失败,请下载并安装读卡程序！", "提示", {"type": "info"});
								yield cardObj.errorBeep();
								return;
							}
							yield cardObj.successBeep();
							return
						} catch (err) {
							// console.log('err', err)
							self.$alert(err.msg, "提示", {"type": "info"});
							return;
						}
						return;
					});
				});
			} else if (isMac || isUnix || isLinux) {
				setTimeout(() => {
					alert('本版本程序发卡功能暂时只支持Windows系统！')
				}, 25)
				return
			}
		},
		destroyed(){
			window.clearInterval(this.cardOneTimer);//单次发卡定时器清空
			window.clearInterval(this.cardTestTimer);//连续发卡定时器清空
			window.clearInterval(this.noCardTimer);//连续发卡方法
			window.clearInterval(this.cardRepairTimer);//补卡定时器清空
		}
	}
</script>

<style type="text/scss" lang="scss">
    .card-management {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        background: #E7E8EB;
        /*overflow: hidden;*/
        .turn-top {
            width: 100%;
            height: auto;
            background: #fff;
            margin-bottom: 15px;
            padding: 0 35px;
            .turn-box {
                width: 100%;
                height: 50px;
                border-bottom: 1px solid #E1E1E1;
                line-height: 50px;
                font-size: 12px;
                color: #333;
                span {
                    margin: 0 20px;
                }
                button {
                    color: #AAAAAA;
                }
                .on {
                    color: #333;
                }
                .el-date-editor {
                    margin: 0 20px;
                    span {
                        margin: 0;
                    }
                }
                .select-box {
                    display: inline-block;
                    position: relative;
                    .input-box {
                        .el-input {
                            width: 200px;
                            input {
                                height: 40px !important;
                            }
                            span {
                                margin: 0;
                            }
                        }
                    }
                    .tree-box {
                        width: 100%;
                        height: auto;
                        max-height: 300px;
                        overflow-y: auto;
                        padding: 15px 10px;
                        background: #fff;
                        position: absolute;
                        top: 50px;
                        left: 0px;
                        z-index: 20;
                        border: 1px solid #E1E1E1;
                        border-radius: 5px;
                        span {
                            margin: 0;
                        }
                    }
                }
                &:last-child{
                    border: none;
                }
            }
        }
        .turn-bottom {
            width: 100%;
            height: auto;
            background: #fff;
            .operate-box {
                width: 100%;
                height: 60px;
                line-height: 60px;
                background: #fff;
                /*box-sizing: content-box;*/
                padding-left: 50px;
                border-bottom: 1px solid #e1e1e1;
                > span {
                    font-size: 18px;
                }
                label{
                    font-size: 18px;
                    font-weight: bold;
                }
                .el-button{
                    height: 38px;
                    vertical-align: top;
                    margin-top: 10px !important;
                }
                .batchBtn, .deleteBtn {
                    width: 90px;
                    margin: 0px 20px;
                    background: #1cab7d !important;
                    border: 1px solid #1cab7d !important;
                    color: #fff;
                }
                .batchBtn:hover, .deleteBtn:hover {
                    background: #1b9a71 !important;
                }
                #exportClientForm{
                    display: none;
                }
                .exportBtn {
                    width: 90px;
                    margin: 0px 20px;
                    background: #F5F6F5 !important;
                    border: 1px solid #E6E6E6 !important;
                    color: #333;
                }
                .exportBtn:hover {
                    background: #1b9a71 !important;
                    color: #fff !important;
                }
                .down-box{
                    width:200px;
                    height:50px;
                    padding-left: 40px;
                    display: inline-block;
                    line-height: 50px;
                    font-size: 12px;
                    background:url("../../assets/images/down_zip.png") no-repeat 0 center/32px 22px;
                    cursor: pointer;
                    &:hover{
                        color:#1cab7d;
                    }
                }
                .search-box {
                    width: 240px;
                    height: 36px;
                    float: right;
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
            }
            .table-box {
                width: 100%;
                .card-box {
                    width: 100%;
                    /*height:100%;*/
                }
                .el-table__fixed-right {
                    border-left: 1px solid #ebeef5;
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

            }
        }
        /*发卡弹窗*/
        .go-face {
            .el-dialog {
                overflow: initial;
                width: 800px;
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
                p {
                    margin-bottom: 15px;
                    text-align: center;
                    color: #FF0000;
                }
                .el-dialog__body {
                    padding: 5px 50px 25px 50px;
                    border: 0;
                    margin: 0;
                    background: #fff;
                    .content {
                        display: flex;
                        border: 1px solid #e1e1e1;
                        border-radius: 5px;
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
                                    outline: none;
                                }
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
                            position: relative;
                            .img-box {
                                width: 170px;
                                height: 220px;
                                background-color: #F2F2F2;
                                position: absolute;
                                top: 0;
                                bottom: 0;
                                right: 0;
                                left: 0;
                                margin: auto;
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
                    .el-button{
                        width:90px;
                        margin:0 10px;
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
                    }
                }
            }
        }
    }

    .op-box {
        white-space: nowrap;
    }

    .el-popover {
        padding: 36px 50px 16px;
        .user-box {
            display: flex;
            flex-direction: row;
            border-bottom: 1px solid #EEEEEE;
            dl {
                width: 140px;
                height: 240px;
                margin-right: 50px;
                dt {
                    height: 175px;
                    margin-bottom: 8px;
                    img {
                        width: 100%;
                        height: 100%;
                    }
                }
                dd {
                    font-size: 12px;
                    line-height: 25px;
                    text-align: center;
                }
            }
            dl:nth-of-type(2) {
                margin-right: 0;
            }
        }
        p {
            line-height: 40px;
            font-size: 12px;
            span:nth-of-type(2) {
                margin-left: 30px;
            }
        }
    }
</style>
