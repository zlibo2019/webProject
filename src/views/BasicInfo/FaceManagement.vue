<template>
  <div class="face-management" @click="checkTarget">
    <div class="turn-top">
      <div class="turn-box" v-if="onCheck == 0">
        <span>人脸状态：</span>
        <el-button :class="{on:onCard == item.cardState}" type="text" v-for="item in faceData"
                   :key="item.cardState" @click="">{{ item.cardStateValue }}
        </el-button>
      </div>
      <div class="turn-box">
        <span>人员类型：</span>
        <el-button :class="{on:onCrew == item.value}" type="text" v-for="item in crewData"
                   :key="item.value">{{ item.title }}
        </el-button>
      </div>
      <div class="turn-box" v-if="onCrew != 2">
        <span>学生范围：</span>
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
    <div class="turn-bottom" v-show="!(uploadLeadingPage || uploadResultPage)">
      <div class="operate-box">
        <span v-if="onCheck == 0">{{ faceData[onCard].title }}</span>
        <label v-if="onCheck == 0">
          <small>{{ allNum }}位</small>
          <small v-if="onCrew != 2">{{ crewData[onCrew].title }}</small>
        </label>
        <label v-else>
          <small>{{ allNum }}位</small>
          <small v-if="onCrew != 2">{{ crewData[onCrew].title }}</small>
        </label>
        <el-button type="primary" size="mini" @click="uploadLeadingPage = true">导入人脸照片</el-button>
        <el-button v-if="batchDelete" class="normal" size="mini" @click="batchDelete = false">取消</el-button>
        <el-button v-if="batchDelete" class="warning" size="mini">删除</el-button>
        <el-button v-else="batchDelete" class="warning" size="mini" @click="batchDelete = true">批量删除</el-button>

        <div class="search-box">
          <el-input v-model="mySearch" size="small" placeholder="请输入姓名或者学/工号" @change="search">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="search"></i>
          </el-input>
        </div>
      </div>
      <div class="table-box">
        <div class="card-box" v-if="onCheck == 0" :key="onCheck">
          <el-table id="cardTable" ref="cardTable" border height="100%" :data="cardTableData"
                    tooltip-effect="dark" :row-style="{height:'100px'}"
                    highlight-current-row style="width: 100%" @selection-change="selectionChangeCard"
                    v-loading="tableLoading">
            <el-table-column v-if="batchDelete" type="selection" width="55"></el-table-column>
            <el-table-column v-else="batchDelete" type="selection" width="55">1</el-table-column>
            <el-table-column prop="deviceinfo_id" v-if="showIndex"></el-table-column>
            <el-table-column prop="userName" label="姓名" align="center"
                             column-key="userName"></el-table-column>
            <el-table-column prop="userDepname" label="班级/部门" align="center"
                             column-key="userDepname" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.userDepname?scope.row.userDepname:' '}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userNo" label="学号" align="center"
                             column-key="userNo" show-overflow-tooltip>
              <template slot-scope="scope">               <!--搜狗浏览器兼容问题要这么解决-->
                <span>{{scope.row.userNo?scope.row.userNo:' '}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="userType" label="身份" align="center" column-key="userType"
                             :formatter="columFormat"></el-table-column>


            <el-table-column prop="updateDate" label="人脸照片" align="center"
                             column-key="updateDate" width="500px">
              <template slot-scope="scope">
                <div>
                  <img src="https://tgi12.jia.com/119/529/19529864.jpg" class="face-image" width="18%">
                  <img src="https://tgi12.jia.com/119/529/19529864.jpg" class="face-image" width="18%">
                  <img src="https://tgi12.jia.com/119/529/19529864.jpg" class="face-image" width="18%">
                  <img src="https://tgi12.jia.com/119/529/19529864.jpg" class="face-image" width="18%">
                  <img src="https://tgi12.jia.com/119/529/19529864.jpg" class="face-image" width="18%">
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="cardStateName" label="人脸状态" align="center"
                             column-key="cardStateName">
              <template slot-scope="scope">               <!--搜狗浏览器兼容问题要这么解决-->
                <span>{{scope.row.cardInfoList[0].cardStateName}}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" align="center" :key="key1"
                             width="200">
              <template slot-scope="scope">
                <div class="op-box">
                  <el-button class="normal" plain size="mini" @click="editFaceImages(scope.row)">
                    修改
                  </el-button>
                  <el-button class="warning" plain size="mini" @click="reportLoss(scope.row)">
                    删除
                  </el-button>
                  <el-button class="normal" plain size="mini" @click="reportLoss(scope.row)"
                             v-if="scope.row.cardInfoList[0].cardStateName == '正常' && roleActions.indexOf('卡管理_@bepf@card@lossCard_update_own') > -1">
                    上传
                  </el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="pagination-box">
        <el-pagination background layout=" prev, pager, next" :total="allNum" :page-size=pageItem
                       :current-page.sync="currentPage" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
    <div class="popup-upload-page" id="upload-leading-page" v-show="uploadLeadingPage">
      <div class="back-management">
        <el-button class="normal" size="mini" @click="uploadLeadingPage = uploadResultPage = false">返回</el-button>
      </div>
      <div class="import-face-hint">
        <ul>
          <li>
            <div class="item-left">1</div>
            <dt>
              <div class="label">照片要求</div>
              <div class="entry">1.照片请统一使用jpg格式<br>
                2.学号命名格式：学号_1.jpg 学号_2.jpg 学号_3.jpg 学号_4.jpg 学号_5.jpg<br>
                3.建议一次导入不多于500人；<br>
                4.为保障识别效果，建议照片像素不低于480*640。
              </div>
            </dt>
          </li>
          <li>
            <div class="item-left">2</div>
            <dt>
              <div class="label">导入方式</div>
              <div class="entry">
                <el-radio>照片名与学号对应</el-radio>
              </div>
            </dt>
          </li>
          <li>
            <div class="item-left">2</div>
            <dt>
              <div class="label">导入照片</div>
              <div class="entry">
                <div class="upload-area">
                  <input id="face-image-importer" type="file" ref="uploadInput" webkitdirectory
                         @change="preprocessFiles"
                         hidden>
                  <div class="import-button" @click="openFileDialog">
                    <div id="upload-progress" :style="{width: uploadProgress + '%'}"><span>导入文件夹/图片</span></div>
                  </div>
                </div>
              </div>
            </dt>
          </li>
        </ul>
        <div class="btn-bot">
          <el-button class="normal" @click="">上传</el-button>
        </div>
      </div>
    </div>
    <div class="popup-upload-page" id="upload-result-page" v-show="uploadResultPage">
      <div class="back-management">
        <el-button class="normal" size="mini" @click="uploadLeadingPage = uploadResultPage = false">返回</el-button>
      </div>
      <el-alert
        :title="errorStack.message"
        type="warning"
        show-icon>
      </el-alert>
      <div class="error-table-box">
        <div class="error-box">
          <el-table id="errorTable" ref="cardTable" border height="100%" :data="errorStack.rows"
                    tooltip-effect="dark"
                    highlight-current-row style="width: 100%" @selection-change="selectionChangeCard"
                    v-loading="tableLoading">
            <el-table-column label="错误文件" align="center">
              <template slot-scope="scope">
                <span v-html="scope.row.files"></span>
              </template>
            </el-table-column>
            <el-table-column prop="cardStateName" label="人脸状态" align="center"
                             column-key="cardStateName">
              <template slot-scope="scope">
                <span>{{scope.row.message}}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <el-button type="primary" style="display: block; margin-left: auto; margin-right: auto">重新上传</el-button>
      </div>
    </div>
    <!--修改人脸照片弹窗-->
    <div class="edit-face">
      <el-dialog
        title="修改照片"
        :visible.sync="editFaceDialog"
        center>
        <div class="content">
          <div class="content-wrapper">
            <el-form
              :inline="true"
              ref="editFaceForm"
              :model="editFaceForm"
              class="demo-form-inline">
              <el-form-item label="学号：">
                <el-input v-model="editFaceForm.userNo" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="姓名：">
                <el-input v-model="editFaceForm.userName" :disabled="true"></el-input>
              </el-form-item>
              <el-form-item label="班级：">
                <el-input v-model="editFaceForm.userDepname" :disabled="true"></el-input>
              </el-form-item>
            </el-form>
            <el-row>
              <el-col :span="4" v-for="(o, index) in 5" :key="o" style="margin-left: 19px">
                <el-card :body-style="{ padding: '0px' }">
                  <img src="https://tgi12.jia.com/119/529/19529864.jpg" class="image" width="100%">
                  <div>
                    <div class="bottom clearfix" style="text-align: center">
                      <el-button type="text" class="button">修改照片</el-button>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="bot">
          <!-- TODO: change method name -->
          <Button btnClass="custom7" btnFontSize="12px" @click="editFaceDialog = false" title="取消"></Button>
          <Button btnClass="custom8" btnFontSize="12px" @click="" title="保存"></Button>
        </div>
      </el-dialog>
    </div>
    <Toast v-if="isToast" :modal-title="toast" duration="1000" @toastCancel="hideToast"></Toast>
  </div>
</template>

<script>
  import Button from '@/components/Button/Button'
  import Toast from '@/components/Toast/Toast'
  import axios from 'axios'
  import * as qiniu from 'qiniu-js';

  export default {
    name: 'FaceManagement',
    components: {
      Button, Toast
    },
    computed: {
      defaultErrImg() {
        return 'this.src="' + this.$store.state.Common.defaultErrImg + '"'
      },
      errorTableHeight() {

        let icH = $('.index > .m-cen').height();
        let ttH = $('.turn-top').height();
        let obH = $('.operate-box').height();
        let pbH = $('.pagination-box').height();
        let tbH = icH - ttH;
        let tblH = icH - ttH - obH - pbH - 15;
        return tblH;
      }
    },
    data() {
      return {
        /*  */
        errorStack: {
          message: '您一共上传了5张图片，识别出1个学生，详细的错误信息如下表，请处理后重新上传错误部分',
          rows: []
        },
        qiniuSetting: {
          token: '',
        },
        uploadProgress: 0,
        cardTableData: [],
        uploadLeadingPage: false,
        uploadResultPage: true,
        batchDelete: false,
        schoolId: localStorage.getItem('schoolId'),
        userNo: localStorage.getItem('userNo') ? localStorage.getItem('userNo') : '',
        treeData: [],      //组织架构数组
        section: {      //选择的部门
          id: '',
          name: ''
        },
        mySearch: '',     //输入的搜索内容
        key1: 9,
        onCheck: 0,      //身份介质默认选中项
        faceData: [      //卡片状态数组
          {
            cardState: 0,
            cardStateValue: '全部'
          },
          {
            cardState: 1,
            cardStateValue: '已采集'
          },
          {
            cardState: 2,
            cardStateValue: '未采集'
          }
        ],
        onCard: 0,      //卡片状态默认选中项
        crewData: [     //人员类型数组
          {
            value: 0,
            title: '学生'
          }
        ],
        onCrew: 0,      //人员类型默认选中项
        onRange: 0,     //学生范围默认选中项
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
        isToast: false,
        toast: '',
        editFaceDialog: false,//发卡弹窗
        editFaceForm: {
          currDate: '',
          validDate: '',
          cardNO: '',      //form内要显示的属性必须先定义，否则赋值时容易不显示
          CardType: ''      //form内要显示的属性必须先定义，否则赋值时容易不显示
        },
        disabled: false,
      }
    },
    methods: {
      /**
       * 打开文件选择
       */
      openFileDialog() {
        this.$refs.uploadInput.click();
      },
      /**
       * 预处理文件列表
       */
      preprocessFiles(event) {
        const files = event.target.files;
        const errorList = {
          wrongExtension: [], // 错误的扩展名
          wrongTarget: [], // 错误的文件命名规范、或无法解析的文件名
          wrongNumber: [], // 错误的照片数量
          wrongID: [], // 后台中不合法的学生ID
          notFace: [] // 不是人脸
        };
        console.log(files);
        const students = {};
        // 1、聚类，剔除不符合命名规范和无法解析名称的文件
        // 2、判断每个学生的照片是不是五张，不是就加到错误列表
        // 3、请求接口判断学生ID是否合法等
        // 4、上传到七牛，同时判断是不是人脸
        for (const file of files) {
          const fileName = file.name.split('.');
          // support format: 123455677_1.jpg
          if (fileName.length === 2 && /^\d+_\d$/.test(fileName[0]) && fileName[1].toLowerCase() === 'jpg') {
            const studentId = fileName[0].split('_');
            if (!students[studentId[0]]) {
              students[studentId[0]] = [];
            }
            students[studentId[0]].push(file);
            // const studentNumber = file.name.split('_')
          } else {
            // TODO: 细分错误类型
            errorList.wrongExtension.push(file);
          }
        }

        for (const id of Object.keys(students)) {
          if (students[id].length !== 5) {
            errorList.wrongNumber[id] = students[id];
            delete students[id];
          }
        }

        console.log(errorList);
        console.log(students);

        this.$api.Common.getQiniuUploadToken({
          isOverride: 1,
          expireSeconds: 3600
        }).then(res => {
          console.log('获取token:', res.data.data);
          if (res.data.code == 600 || res.data.code == 0) {
            this.qiniuSetting.token = res.data.data;
            const self = this;

            function uploadFile(file, key, token, callback) {
              return new Promise((resolve, reject) => {
                const observable = qiniu.upload(
                  file,
                  key,
                  token
                );
                observable.subscribe({
                  next(res) {
                    // console.log(res);
                  },
                  error(err) {
                    // console.log(err);
                    reject(err)
                  },
                  complete(res) {
                    resolve(res);
                  }
                })
              });
            }

            async function uploadAndVerify(qiniuToken, schoolId) {
              // 循环进行上传，并将结果添加到file对象中，等待上传信息集合到服务器
              const urlList = [];
              const verifyList = [];
              const studentKeys = Object.keys(students).sort();
              for (const id of studentKeys) {
                for (const file of students[id]) {
                  const fileKey = `${schoolId}_${(new Date()).valueOf()}_${file.name}`;
                  file.qiniu = await uploadFile(file, fileKey, qiniuToken);
                  self.uploadProgress += 2;

                  urlList.push(`http://res-mal.weds.com.cn/${fileKey}?tusdk-face/detection`);

                }
              }
              console.log(urlList);
              // TODO: 判断是否为人脸
              // for (const url of urlList) {
              //   verifyList.push($.get(url));
              // }
              // const faceResults = await Promise.all(verifyList);
              // let index = 0;
              // for (const id of studentKeys) {
              //   for (const file of students[id]) {
              //     const result = faceResults[index].data;
              //     if (result.ret !== 200) {
              //       errorList.notFace.push(file);
              //       let position = -1;
              //       for (var i = 0; i < students[id].length; i++) {
              //         if (students[id][i].name === file.name) {
              //           position = i;
              //           break;
              //         }
              //       }
              //       students[id].splice(position, 1)
              //     }
              //     index++;
              //   }
              // }
              // console.log(faceResults);
            }

            uploadAndVerify(this.qiniuSetting.token, this.schoolId).then(() => {
              console.log('Error List: ', errorList);
              console.log('Students: ', students);
              if (errorList.notFace ||
                errorList.wrongExtension ||
                errorList.wrongID ||
                errorList.wrongNumber ||
                errorList.wrongTarget) {

                // const wrongExtension = {
                //   files: '',
                //   message: '文件的扩展名错误'
                // };
                for (const wrong of errorList.wrongExtension) {
                  this.errorStack.rows.push({
                    files: `${wrong.name}`,
                    message: '文件的扩展名错误'
                  })
                }

                for (const wrong of errorList.notFace) {
                  this.errorStack.rows.push({
                    files: wrong.name,
                    message: `图片中未检测到人脸`
                  })
                }

                for (const number of Object.keys(errorList.wrongNumber)) {
                  let files = '';
                  for (const file of errorList.wrongNumber[number]) {
                    files += file.name + '<br>'
                  }
                  this.errorStack.rows.push({
                    files,
                    message: `学号为${number}的学生照片不足五张`
                  })
                }

                // this.errorStack.rows.push(wrongExtension);

                this.uploadResultPage = true;
                this.uploadLeadingPage = false;

              }
            });

          } else {
            this.isToast = true;
            this.toast = res.data.msg;
          }
        });

      },

      analyzeError() {

      },

      submitFacePictures() {

      },

      /**
       * 弹窗编辑图片
       */
      editFaceImages(row) {
        this.editFaceDialog = true; // 弹窗显示
        this.editFaceForm.userNo = row.userNo;
        this.editFaceForm.userName = row.userName;
        this.editFaceForm.userDepname = row.userDepname;
      },
      /**
       *  @function: 获取卡片状态列表
       *  @author: wzx
       *  @date 2018-09-11
       */
      getCardData() {
        this.$api.BasicInfo.getCardState().then(res => {
          if (res.data.code == 600) {
            this.faceData = res.data.data;
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
        // let params = {
        //   is_page: true,
        //   school_id: this.schoolId,
        //   page_size: 10,
        //   page_num: 1,
        // };
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
        };
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
        }).catch(err => {
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

        ifArrVal(searchData, searchVal);
        resultArr = classArr + ` ` + resultArr;
        // console.log(999, resultArr)
        return resultArr
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
          $('.error-box').height(tbH - 150)
          $('.error-table-box').height(tbH - 150)
        }, 25)
      },
      /**
       *  @function 页面点击其他地方，人员范围的树形控件弹窗隐藏的功能
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
    watch: {},
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
    }
  }
</script>

<style type="text/scss" lang="scss">
  .popup-upload-page, .popup-upload-page {
    background: #ffffff;
    .back-management {
      padding: 10px 60px;
    }

    .import-face-hint {
      padding: 10px 200px;

      ul {
        li {
          font-size: 12px;
          position: relative;
          text-align: left;
          margin-left: 40px;
          overflow-y: hidden;
          margin-top: 6px;
          padding-bottom: 4vh;

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
              height: 300vh;
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
            display: flex;

            .label {
              /*width: 120px;*/
              /*min-width: 100px;*/
              /*max-width: 100px;*/
              margin-right: 20px;
            }

            .entry {
              flex: 1;

              .import-button {
                position: relative;
                width: 322px;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                text-align: center;
                height: 32px;
                cursor: pointer;

                #upload-progress {
                  display: block;
                  position: relative;
                  background: #1cab7d;
                  height: 30px;
                  border-radius: 6px;

                  span {
                    user-select: none;
                    position: absolute;
                    width: 320px;
                    left: 0;
                    line-height: 30px;
                  }
                }
              }
            }
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

        li:first-child {
          margin-top: 4vh;
        }
      }

      .btn-bot {
        .button-div {
          margin-top: 5vh;
        }
      }
    }
  }

  .face-management {
    width: 100%;
    height: 100%;
    margin: 0 auto;
    background: #E7E8EB;

    .face-image {
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      float: left;
      width: 18%;
      margin-left: 8px;
    }

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

        &:last-child {
          border: none;
        }
      }
    }

    #upload-leading-page {
      width: 100%;
      height: auto;
      background: #fff;
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

        label {
          font-size: 18px;
          font-weight: bold;
        }

        .el-button {
          vertical-align: top;
          margin-top: 16px !important;
          margin-left: 8px;
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

        #exportClientForm {
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

        .down-box {
          width: 200px;
          height: 50px;
          padding-left: 40px;
          display: inline-block;
          line-height: 50px;
          font-size: 12px;
          background: url("../../assets/images/down_zip.png") no-repeat 0 center/32px 22px;
          cursor: pointer;

          &:hover {
            color: #1cab7d;
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

    /*修改人脸弹窗*/
    .edit-face {
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

            .content-wrapper {
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

          .el-button {
            width: 90px;
            margin: 0 10px;
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
