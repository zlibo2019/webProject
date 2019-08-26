<template>
    <div class="school-record">
        <div class="normal" v-if="!startEdit">
            <div class="m-top">
                <span>学校档案</span>
                <div class="t-right">
                    <Button title="修改" btnClass="custom8" btnFontSize="14px" btnHeight="4.5vh" @click="clickEdit" v-if="isFirstEdit != 0"></Button>
                    <!-- <Button title="测试按钮" btnClass="custom8"  btnFontSize="12px" btnHeight="4.5vh" @click="testRules"></Button> -->
                </div>
            </div>
            <div class="m-bom">
                <div class="not-regist" v-if="isFirstEdit == 0">
                    <div class="title">{{ form.schoolName }}</div>
                    <div class="edit">
                        <Button title="完成学校档案" btnClass="custom8" btnFontSize="14px" btnHeight="5.5vh" @click="clickEdit"></Button>
                    </div>
                </div>
                <div class="regist-edit" v-else>
                    <div class="img-div">
                        <img :src="form.schoolLogo" alt="">
                    </div>
                    <div class="title">{{ form.schoolName }}</div>
                    <div class="edit">
                        <ul>
                            <li>
                                <div class="name">学校学制</div>
                                <div class="content"><span>{{ records.schooling }}</span></div>
                            </li>
                            <li>
                                <div class="name">班级格式</div>
                                <div class="content"><span>{{ records.shifts }}</span></div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="start-edit" v-if="startEdit">
            <div class="m-top">
                <span>学校档案</span>
                <div class="t-right">
                    <Button title="保存" btnClass="custom8" btnFontSize="14px" btnHeight="4.5vh" @click="saveRecord('form')"></Button>
                    <Button title="取消" btnClass="custom7" btnFontSize="14px" btnHeight="4.5vh" @click="cancelRecord"></Button>
                </div>
            </div>
            <div class="m-bom">
                <el-form ref="form" :model="form" :rules="rules" label-width="110px">
                    <el-form-item label="">
                        <div class="upfile-img" @click="fileClick" title="支持jpg，jpeg，png，文件小于10M"><!--clickUpfile-->
                            <span v-if="form.schoolLogo == ''">校徽</span>
                            <img class="load-img" :src="form.schoolLogo" alt="" v-else>
                            <div class="hover-img">
                                <img src="../../assets/images/upfile.png" alt="">
                            </div>
                            <input type="file" id="upfile" @change="fileChange($event)"><!--changeFile-->
                        </div>
                    </el-form-item>
                    <el-form-item label="学校名称：" prop="schoolName">
                        <el-input v-model="form.schoolName" :disabled="true" style="width: 200px"></el-input>
                        <span>注册名称不可修改</span>
                    </el-form-item>
                    <el-form-item label="学校学制：" prop="schoolSystem">
                        <el-input v-model="form.schoolSystem" :value="allSystem || form.schoolSystem" style="display: none;"></el-input>
                        <span class="system-content">{{ allSystem }}</span>
                        <Button title="选择学制" btnClass="custom8" btnFontSize="12px" btnHeight="3.5vh" @click="selSchoolSys" :dised="sysBtnDisable"></Button>
                    </el-form-item>
                    <el-form-item label="年级名称格式：" prop="gradeFormat">
                        <el-radio-group v-model="form.gradeFormat" @change="radioGroup" :disabled="gradeDisable">
                            <el-radio label="1">按照入学年份。</el-radio>
                            <span class="sel-year">选择最晚入学年份</span>
                            <el-date-picker type="year" placeholder="" v-model="selYear" style="width: 120px;" :editable="false"
                                            :disabled="(form.gradeFormat == '1' ? false: true) || yearDisable" @change="changeYear"
                                            ></el-date-picker><!--:picker-options="endDateOpt"-->
                            <span class="group-span">{{ ''+ selYears  }}</span>
                            <el-radio label="2">按照高一 高二 高三；初一初二初三；一年级 二年级 三年级</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="班级名称格式：" prop="classFormat">
                        <el-radio-group v-model="form.classFormat" :disabled="classDisable">
                            <el-radio label="1">一班，二班，三班</el-radio>
                            <el-radio label="2">1班，2班，3班</el-radio>
                            <el-radio label="3">（1）班，（2）班，（3）班</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <el-dialog title="选择学制" :visible.sync="schSystemDialog" width="650px" center class="sch-system-dialog">
                <div class="content">
                    <el-form :inline="true" :model="systemForm">
                        <!--<el-checkbox-group v-model="systemForm.systemSchool">
                            <el-checkbox label="1">小学</el-checkbox>
                            <el-checkbox label="2">初中</el-checkbox>
                            <el-checkbox label="3">高中</el-checkbox>
                            <el-radio-group v-model="systemForm.smaSch">
                                <el-radio label="五年制" :disabled="systemForm.systemSchool.indexOf('1')!=-1? false: true">五年制</el-radio>
                                <el-radio label="六年制" :disabled="systemForm.systemSchool.indexOf('1')!=-1? false: true">六年制</el-radio>
                            </el-radio-group>
                            <el-radio-group v-model="systemForm.midSch">
                                <el-radio label="三年制" :disabled="systemForm.systemSchool.indexOf('2')!=-1? false: true">三年制</el-radio>
                                <el-radio label="四年制" :disabled="systemForm.systemSchool.indexOf('2')!=-1? false: true">四年制</el-radio>
                            </el-radio-group>
                            <el-radio-group v-model="systemForm.hightSch">
                                <el-radio label="1" :disabled="systemForm.systemSchool.indexOf('3')!=-1? false: true">三年制</el-radio>
                            </el-radio-group>
                        </el-checkbox-group>-->
                        <el-form-item label="">
                            <el-checkbox v-model="systemForm.systemSchool" label="1" :disabled="groupDisable1">小学</el-checkbox>
                            <el-radio-group v-model="systemForm.smaSch" :disabled="groupDisable1">
                                <el-radio label="5" :disabled="systemForm.systemSchool.indexOf('1')!=-1? false: true">五年制</el-radio>
                                <el-radio label="6" :disabled="systemForm.systemSchool.indexOf('1')!=-1? false: true">六年制</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="">
                            <el-checkbox v-model="systemForm.systemSchool" label="2" :disabled="groupDisable2">初中</el-checkbox>
                            <el-radio-group v-model="systemForm.midSch" :disabled="groupDisable2">
                                <el-radio label="3" :disabled="systemForm.systemSchool.indexOf('2')!=-1? false: true">三年制</el-radio>
                                <el-radio label="4" :disabled="systemForm.systemSchool.indexOf('2')!=-1? false: true">四年制</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="">
                            <el-checkbox v-model="systemForm.systemSchool" label="3" :disabled="groupDisable3">高中</el-checkbox>
                            <el-radio-group v-model="systemForm.hightSch" :disabled="groupDisable3">
                                <el-radio label="3" :disabled="systemForm.systemSchool.indexOf('3')!=-1? false: true">三年制</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <span>注：学制的选择和学生组织结构有关，请谨慎勾选。</span>
                    <Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh" @click="schSystemDialog = false"></Button>
                    <Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh" @click="selectSystem"></Button>
				</span>
            </el-dialog>
        </div>
        <Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Radio from '@/components/Radio/Radio.vue'
	import Toast from '@/components/Toast/Toast'
	import { Loading } from 'element-ui';

	export default {
		name: 'school-record',
		components: {
			Button, Toast
		},
		data() {
			return {
				isFirstEdit: -1,//是否第一次填写档案
                records: {
	                schooling: '',
	                shifts: ''
                },
				startEdit: false,             //开始编辑
				radioData: [
					{
						checked: false,
						title: '备选项1'
					},{
						checked: false,
						title: '备选项2'
					},{
						checked: false,
						title: '备选项3'
					},
				],
				form: {
					schoolId: '',//学校编号
					schoolName: '',//学校名称
					schoolSystem: '',//学校学制
					gradeFormat: '1',//年级格式
					gradeEnd: '',//入学年份
					classFormat: '1',//班级名称格式
					schoolLogo: ''//校徽图片
				},
				rules: {
					schoolSystem: [
						{ required: true, message: '请选择学校学制', trigger: 'blur' },
						// { /*min: 3, max: 5,*/ message: '', trigger: 'blur' }
					],
					gradeFormat: [
						{ required: true, message: '请选择年级名称格式', trigger: 'change' }
					],
					classFormat: [
						{ required: true, message: '请选择班级名称格式', trigger: 'change' }
					]/*,
					date1: [
						{ type: 'date', required: true, message: '请选择日期', trigger: 'change' }
					],
					date2: [
						{ type: 'date', required: true, message: '请选择时间', trigger: 'change' }
					],
					type: [
						{ type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
					],
					resource: [
						{ required: true, message: '请选择活动资源', trigger: 'change' }
					],
					desc: [
						{ required: true, message: '请填写活动形式', trigger: 'blur' }
					]*/
				},
				systemForm: {   //保存学制form
					smaSch: '',//小学学制
					midSch: '',//初中学制
					hightSch: '',//高中学制
					systemSchool: []
                },
				imageUrl: '',
				imgList: [],
				loadLogo: '',                //后台取出的logo
                selYear: '',                 //选择的入学年份（格式需改，用form中的eduData接收）
                selYears: '',                //入学年份倒叙最大学制
				schSystemDialog: false,     //选择学制弹窗
				allSystem: '',               //选择学制弹窗-保存
				maxSystem: '',               //获取选择的最大学制数
				sysBtnDisable: false,       //选择学制按钮是否禁用
				groupDisable1: false,       //选择学制按钮是否禁用(小学)
				groupDisable2: false,       //选择学制按钮是否禁用(初中)
				groupDisable3: false,       //选择学制按钮是否禁用(高中)
				gradeDisable: false,        //年级格式是否禁用(年级格式)
				classDisable: false,        //班级格式是否禁用(班级格式)
				yearDisable: false,         //入学年份是否禁用(入学年份)
				startDateOpt: {
					disabledDate(time) {
						// console.log(1111)
						// console.log(time)
						// return time > 2060
						return time.getTime() > Date.now()
					}
				},
				endDateOpt:{
					disabledDate(time) {
						// let curDate = (new Date()).getTime();
						let curDate = (new Date('2060-12-31')).getTime();
						let three = (new Date('2010-01-01')).getTime();
						// let three = 90 * 24 * 3600 * 1000;
                        let timm = time.getTime()
						let threeMonths = curDate - three;
						// return time.getTime() > Date.now('2060-12-31') || time.getTime() < threeMonths;;
						return timm > Date.now();
					}
				},
				isImgType: true,            // 是否为img类型
				isToast:false,
				toast:'',
				isToast: false,
			}
		},
        computed:{
        },
		methods: {
			/**
			 *  @function: 点击编辑按钮
			 *  @author: lxr
			 *  @date 2018-7-10
			 **/
			clickEdit(){
				this.startEdit = true;
                this.isImgType = true;  // 图片类型默认为true
                this.loadSchoolInfo();//加载档案信息
            },
			radioGroup(a){
				// console.log('radioGroup!',a,this.form.gradeFormat);
            },
			/**
			 *  @function: 选择入学年份
			 *  @author: lxr
			 *  @date 2018-7-11
			 **/
			changeYear(){
				if(this.maxSystem != ''){
					let year = this.selYear;
					if(!year)return this.form.gradeEnd = '';
					this.form.gradeEnd = year.getFullYear();
					// console.log('type',typeof year.getFullYear())
					let arr = [];
					let gradeEnd = this.form.gradeEnd;
					for (let i = 0; i< this.maxSystem; i++){
						arr.push(gradeEnd-- + '级')
					}
					this.selYears ='（'+ arr.join('，')+'）';//设置倒叙最大学制的入学年份详情
                }else{
					this.form.gradeEnd = '';
					this.selYear = '';
					this.$alert('请选择学校学制', '提示', {
						confirmButtonText: '确定'
					});
                }
            },
			/**
			 *  @function: 选择学制
			 *  @author: lxr
			 *  @date 2018-7-11
			 **/
			selSchoolSys(){
                this.schSystemDialog = true;//弹窗显示
            },
			/**
			 *  @function: 选择学制-保存学制
			 *  @author: lxr
			 *  @date 2018-7-11
			 **/
			selectSystem(){
				this.schSystemDialog = false;//弹窗隐藏
                this.splicingSystem();//拼接学制
            },
			/**
			 *  @function: 拼接学制
			 *  @author: lxr
			 *  @date 2018-7-30
			 **/
			splicingSystem(){
                let arr = [];
                let arr2 = [];
                let num = [];
                if(this.systemForm.smaSch != '' && this.systemForm.systemSchool.indexOf('1') != -1){
	                let system = '';
                	if(this.systemForm.smaSch == '5'){
		                system = '五年制';
                    }else if(this.systemForm.smaSch == '6'){
		                system = '六年制';
	                }
                    arr.push('小学 ' + system)
                    arr2.push('1,' + this.systemForm.smaSch)
	                num.push(parseInt(this.systemForm.smaSch));
                }
                if(this.systemForm.midSch != '' && this.systemForm.systemSchool.indexOf('2') != -1){
	                let system = '';
	                if(this.systemForm.midSch == '3'){
		                system = '三年制';
	                }else if(this.systemForm.midSch == '4'){
		                system = '四年制';
	                }
                    arr.push('初中 ' + system)
	                arr2.push('2,' + this.systemForm.midSch)
	                num.push(parseInt(this.systemForm.midSch));
                }
                if(this.systemForm.hightSch != '' && this.systemForm.systemSchool.indexOf('3') != -1){
	                let system = '';
	                if(this.systemForm.hightSch == '3'){
		                system = '三年制';
	                }
                    arr.push('高中 ' + system)
	                arr2.push('3,' + this.systemForm.hightSch)
	                num.push(parseInt(this.systemForm.hightSch));
                }
                this.allSystem = arr.join('；');         //学校学制input的value
                this.form.schoolSystem = arr2.join(';');    //学校学制（数字）
                this.form.systemName = arr.join('；');    //学校学制(文字)
                if(num.length == 0){//判断数字大小的数组长度为零时不执行math方法
	                this.maxSystem = '';
	                // this.form.gradeEnd = '';
	                // this.selYear = '';
	                return;
                }
                this.maxSystem = Math.max.apply(null,num);//获取选择的最大学制数
				let year = this.selYear;
				if(!year)return;
				let grade = [];
				let gradeEnd = this.form.gradeEnd;
				for (let i = 0; i< this.maxSystem; i++){
					grade.push(gradeEnd-- + '级')
				}
				this.selYears ='（'+ grade.join('，')+'）';//设置倒叙最大学制的入学年份详情
            },
			/**
			 *  @function: 点击保存按钮
			 *  @author: lxr
			 *  @date 2018-7-11
			 **/
			saveRecord(formName){
				let vThis = this;
				this.$refs[formName].validate((valid) => {
					if (valid) {
						Loading.service();
						let params = JSON.parse(JSON.stringify(this.form));//深拷贝form中的值
						params.ltUserId = parseInt(localStorage.getItem('userId'));//修改者
						let str = '';//拼接总字符串
						let system;//学制
						let systemName;//年级名称
						let className;//班级名称
						let arr = [];//最终总数组
						$.each(vThis.form.schoolSystem.split(';'), function (i, sp) {
							if(sp == '')return;
							if(sp.split(',')[0] == '1'){//小学
								system = '小学 ';
								systemName = '一年级'                                         //选择学制-小学学制
							}else if(sp.split(',')[0] == '2'){//初中
								system = '初中 ';
								systemName = '初一'                                             //选择学制-初中学制
							}else if(sp.split(',')[0] == '3'){//高中
								system = '高中 ';
								systemName = '高一'                                               //选择学制-高中学制
							}
							if(vThis.form.gradeFormat == '1'){//年级按入学年份
								systemName = vThis.form.gradeEnd + '级'
							}else if(vThis.form.gradeFormat == '2'){//年级按高一、初一、一年级
								if(system == '小学'){
									systemName = '一年级'
								}else if(system == '初中'){
									systemName = '初一'
								}else if(system == '高中'){
									systemName = '高一'
								}
							}
							if(vThis.form.classFormat == '1'){//班级按一班
								className = '一班'
							}else if(vThis.form.classFormat == '2'){//班级按1班
								className = '1班'
							}else if(vThis.form.classFormat == '3'){//班级按(1)班
								className = '(1)班'
							}
							str = system + systemName + className;
							arr.push(str)
						});
						params.demoName = arr.join('；');//总的班级名称
                        // console.log('aaaa-gradeEnd',params)
                        if(!params.gradeEnd){
	                        params.gradeEnd = ''
                        }
						// console.log('valid',params.gradeFormat,params.gradeEnd)
						if(params.gradeFormat == 1 && params.gradeEnd == ''){//选择年级格式是1时：提示必填入学年份
							// this.$alert('请选择入学年份', '提示', {
							// 	confirmButtonText: '确定'
							// });
							this.$message({
								showClose: true,
								message: '请选择入学年份',
								type: 'error', duration: this.msgDuration
							})
                        }
                        this.$api.Common.getQiniuUploadToken({
                            isOverride:1,
                            expireSeconds:3600
                        }).then( res =>{
							// console.log('uptoken',res.data.data)
                            let filename = '',
								f = new FormData(),
								blob = ''; // base64图片格式 this.result
                            if(vThis.imgList.length != 0){
	                            // filename = vThis.imgList[0].file.name
	                            filename = Date.parse(new Date()) / 1000 +
		                            Math.random().toString(20) + '.jpg'
	                            blob = vThis.dataURItoBlob(vThis.imgList[0].file.src) // base64图片格式 this.result
                            }else if(!vThis.isImgType){// 图片类型不为img-- false
	                            vThis.isToast = true;
	                            vThis.toast = '上传校徽格式错误，请重新选择！';
	                            Loading.service().close();
	                            return
                            }else{}
							// console.log(vThis.imgList.length,vThis.isImgType)
							f.append('token', res.data.data)// uptoken值
							f.append('file', blob)
                            f.append('key', filename) 
                            //上传图片
                            this.$api.Common.uploadQiniu(f).then(data => {
                                // console.log('上传:', data.data)
                                if(data.data.key != ''){
	                                params.schoolLogo = data.data.key;//骑牛获取的图片名称
                                }else{
	                                params.schoolLogo = vThis.loadLogo;//原始图片
                                }
                                // console.log('stringify-params',JSON.stringify(params))
                                this.$api.BasicInfo.updateSchoolInfo(params).then(res => {
                                    Loading.service().close();
									if(res.data.code == 600){
										this.form.schoolLogo = this.uploadPicUrl +params.schoolLogo;                   //学校logo
										this.records.schooling = this.allSystem;
										this.records.shifts = arr.join('；');
										this.startEdit = false;//返回首页
										this.isFirstEdit = 1;
										localStorage.setItem('classFormat',this.form.classFormat);
										// console.log('classFormat--local',localStorage.getItem('classFormat'))
									}else {
										this.isToast = true;
										this.toast = res.data.msg;
									}
                                }).catch(err =>{
                                    Loading.service().close();
                                })
                            })
						})
					} else {
						if(this.form.gradeFormat == 1 && this.form.gradeEnd == ''){//选择年级格式是1时：提示必填入学年份
							this.$alert('请选择入学年份', '提示', {
								confirmButtonText: '确定'
							});
                        }
						return false;
					}
				});
            },
			/**
			 *  @function: 点击取消保存按钮
			 *  @author: lxr
			 *  @date 2018-7-11
			 **/
            cancelRecord(){
			    this.startEdit = false;
                // function resetFileInput(file){ file.after(file.clone().val("")); file.remove(); }
                // resetFileInput($('#upfile'));
                this.imgList = [];
                this.loadSchoolInfo();//加载档案信息
            },
			/**
			 *  @function: 点击上传校徽
			 *  @author: lxr
			 *  @date 2018-7-10
			 **/
			clickUpfile(){
				$('#upfile').click();
            },
			handleAvatarSuccess(res, file) {
				this.imageUrl = URL.createObjectURL(file.raw);
			},
			beforeAvatarUpload(file) {
				// console.log('hand',URL.createObjectURL(file.raw))
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			fileClick() {
				$('#upfile').click();
			},
			/**
			 *  @function: 点击浏览-打开文件
			 *  @author: lxr
			 *  @date 2018-7-10
			 **/
			fileChange(el) {
				// console.log('change',el.target.files[0].size,el.target.files[0].type)
				this.imgList = [];
				if (!el.target.files[0].size) {
                    this.isImgType = false;// 是否是img类型
                    // console.log(11111)
					return;
                }
				this.fileList(el.target);
				el.target.value = ''
			},
			fileList(fileList) {
				let files = fileList.files;
				for (let i = 0; i < files.length; i++) {
					//判断是否为文件夹
					if (files[i].type != '') {
                        this.fileAdd(files[i]);
					} else {
						//文件夹处理
						this.folders(fileList.items[i]);
					}
				}
			},
			//文件夹处理
			folders(files) {
				let _this = this;
				//判断是否为原生file
				if (files.kind) {
					files = files.webkitGetAsEntry();
				}
				files.createReader().readEntries(function (file) {
					for (let i = 0; i < file.length; i++) {
						if (file[i].isFile) {
							_this.foldersAdd(file[i]);
						} else {
							_this.folders(file[i]);
						}
					}
				})
			},
			foldersAdd(entry) {
				let _this = this;
				entry.file(function (file) {
					_this.fileAdd(file)
				})
			},
			fileAdd(file) {
				if (this.limit !== undefined) this.limit--;
				if (this.limit !== undefined && this.limit < 0) return;
				//总大小
				this.size = this.size + file.size;
                //判断是否为图片文件
				if (file.type.indexOf('image') == -1) {
                    this.isImgType = false;// 是否是img类型
                    this.$message({
                        showClose: true,
                        message: "仅支持jpg、jpeg、png格式，请重新选择！",
                        type: "warning",
                        duration: this.msgDuration
                    });
                    return
                } else{
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
					this.isImgType = true;
					let reader = new FileReader();
					reader.vue = this;
					reader.readAsDataURL(file);
					reader.onload = function () {
						file.src = this.result;
						this.vue.imgList.push({
							file
						});
						this.vue.form.schoolLogo = this.result;
					}
				}
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
			 *  @function: 加载学校信息
			 *  @author: lxr
			 *  @date 2018-7-26
			 **/
            loadSchoolInfo(){
                let vThis = this;
                let schoolId = localStorage.getItem('schoolId');
                let params = {
                    schoolId:localStorage.getItem('schoolId')
                }
                this.$api.BasicInfo.selectSchoolInfo(params).then(res => {
					console.log('查询学校信息',res)
					if(res.data.code == 600 || res.data.code == 0){
						this.form = {   // 清空
							schoolId: '',//学校编号
                            schoolName: '',//学校名称
                            schoolSystem: '',//学校学制
                            gradeFormat: '1',//年级格式
                            gradeEnd: '',//入学年份
                            classFormat: '1',//班级名称格式
                            schoolLogo: ''//校徽图片
						}
						let allData = {
							schoolName: res.data.data.schoolName,  //学校名称
							schoolSystem: ['初中 四年制','初中 四年制'],
							gradeFormat: '1',
							gradeEnd: '2019',
							classFormat: '2',
						}
						let limit = res.data.data.initFlag;//0为第一次；1为修改
						let schoolSystem = res.data.data.schoolSystem;
						if(schoolSystem == null){
							schoolSystem = '';  // 防止以下报错，格式问题
                        }
                        if(limit == ''){
	                        limit = 0;
                        }
						// limit = 1
						// schoolSystem = '1,5;2,4;3,3'
						// schoolSystem = ''
						// res.data.data.systemName = ''
						this.isFirstEdit = limit;
                        if(limit == 1 && res.data.data.gradeFormat != ''){
	                        this.gradeDisable = true;
                        }
                        if(limit == 1 && res.data.data.classFormat != ''){
	                        this.classDisable = true;
                        }
                        if(limit == 1 && res.data.data.gradeEnd){
	                        // console.log('年级有值',limit,res.data.data.gradeEnd)
	                        this.yearDisable = true;
                        }
						this.form.schoolId = res.data.data.schoolId;                         //学校编号
						this.form.schoolName = res.data.data.schoolName;                     //学校名称
						// this.form.schoolSystem = allData.schSystem.join('；');  //学校学制
						// this.allSystem = allData.schSystem.join('；');        //学校学制value
						this.form.schoolSystem = schoolSystem;                                 //学校学制
						this.form.schoolSystemOld = schoolSystem;                                 //学制旧值
						this.allSystem = res.data.data.systemName;                           //学校学制value
						this.form.gradeFormat = res.data.data.gradeFormat;                   //年级格式
						this.form.classFormat = res.data.data.classFormat;                   //班级名称格式
						this.form.gradeEnd = res.data.data.gradeEnd;                         //入学年份
                        if(res.data.data.gradeEnd == null){
	                        res.data.data.gradeEnd = '';        // 防止以下报错，格式问题
                        }
						this.selYear = res.data.data.gradeEnd.toString();                              //入学年份model
                        // console.log('res.data.data.schoolLogo',res.data.data.schoolLogo)
                        if(res.data.data.schoolLogo == ''){
	                        this.form.schoolLogo = ''
                        }else{
	                        this.loadLogo = res.data.data.schoolLogo;
	                        this.form.schoolLogo = this.uploadPicUrl +res.data.data.schoolLogo;                   //学校logo
                        }
						this.records.schooling = res.data.data.systemName;
						this.records.shifts = res.data.data.demoName;
						/*records: {
							schooling: ['小学六年制','初中三年制'],
								shifts: ['小学一年级1班','初中2015级1班']
                        },*/
                        
						// console.log('最大',this.systemForm.systemSchool)
						//如果返回的值学制都填完了，则不能点击选择学制按钮
						if(this.systemForm.systemSchool.indexOf('1') != -1
							&& this.systemForm.systemSchool.indexOf('2') != -1
							&& this.systemForm.systemSchool.indexOf('3') != -1
							&& (this.systemForm.smaSch == '5' || this.systemForm.smaSch == '6')
							&& (this.systemForm.midSch == '3' || this.systemForm.midSch == '4')
							&& this.systemForm.hightSch == '3'){
							//多选框及单选框禁用状态
							this.sysBtnDisable = true;
						}
						//如果小学学制选完，则该选项不能再选
						if(this.systemForm.systemSchool.indexOf('1') != -1
							&& (this.systemForm.smaSch == '5' || this.systemForm.smaSch == '6')){
							this.groupDisable1 = true;//小学学制不可选
						}
						if(this.systemForm.systemSchool.indexOf('2') != -1
							&& (this.systemForm.midSch == '3' || this.systemForm.midSch == '4')){
							this.groupDisable2 = true;//初中学制不可选
						}
						if(this.systemForm.systemSchool.indexOf('3') != -1
							&& this.systemForm.hightSch == '3'){
							this.groupDisable3 = true;//高中学制不可选
                        }
                        
						let numArr = [];//学制列表
						//选择学制弹窗
						$.each(schoolSystem.split(';'), function (i, sp) {
							if(sp == '')return;
							vThis.systemForm.systemSchool[i] = sp.split(',')[0];           //选择学制-多选框
							if(sp.split(',')[0] == '1'){//小学
								vThis.systemForm.smaSch = sp.split(',')[1];                 //选择学制-小学学制
							}else if(sp.split(',')[0] == '2'){//初中
								vThis.systemForm.midSch = sp.split(',')[1];                 //选择学制-初中学制
							}else if(sp.split(',')[0] == '3'){//高中
								vThis.systemForm.hightSch = sp.split(',')[1];               //选择学制-高中学制
							}
							numArr.push(parseInt(sp.split(',')[1]))
						});
						if(numArr.length == 0){//判断数字大小的数组长度为零时不执行math方法
							this.maxSystem = '';
							// this.form.gradeEnd = '';
							// this.selYear = '';
							return;
						}
						this.splicingSystem();//拼接学制
						// this.allSystem = res.data.data.systemName;                           //学校学制value
                        // console.log('arr',numArr)
						this.maxSystem = Math.max.apply(null,numArr);//获取选择的最大学制数
						let sysArr = [];//入学年份详情
                        if(!this.form.gradeEnd)return;
                        let gradeEnd = this.form.gradeEnd;
						for (let i = 0; i< this.maxSystem; i++){
							sysArr.push(gradeEnd-- + '级')
						}
						this.selYears = '（'+ sysArr.join('，') +'）';//设置倒叙最大学制的入学年份详情
						/*	let numArr = [];//学制列表
                            $.each(allData.schSystem, function (i, sys) {//获取最大学制
                                let sysValue = sys.split(' ')[1].slice(0,1);
                                if(sysValue == '三'){
                                    sysValue = 3;
                                }else if(sysValue == '四'){
                                    sysValue = 4;
                                }else if(sysValue == '五'){
                                    sysValue = 5;
                                }else if(sysValue == '六'){
                                    sysValue = 6;
                                }
                                numArr.push(sysValue)
                            })
                            if(numArr.length == 0){//判断数字大小的数组长度为零时不执行math方法
                                vThis.maxSystem = '';
                                // this.form.gradeEnd = '';
                                // this.selYear = '';
                                return;
                            }
                            vThis.maxSystem = Math.max.apply(null,numArr);//获取选择的最大学制数
                            let sysArr = [];//入学年份详情
                            for (let i = 0; i< vThis.maxSystem; i++){
                                sysArr.push(vThis.form.gradeEnd-- + '级')
                            }
                            vThis.selYears = sysArr.join('，');//设置倒叙最大学制的入学年份详情*/
						/*if(allData.schSystem.length == 3){//三项都选择之后选择学制按钮要禁用
                            vThis.sysBtnDisable = true;
                        }*/
					}else {
						this.isToast = true;
						this.toast = res.data.msg;
					}
				})
            }
		},
		mounted() {
            this.loadSchoolInfo();//加载学校档案信息
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .school-record{
        width: 100%;
        height: 100%;
        .normal, .start-edit{
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .m-top{
            flex-basis: 8vh;
            line-height: 8vh;
            border-bottom: 1px solid #E1E1E1;
            padding-left: 3%;
            font-size: 18px;
            position: relative;
            .t-right{
                height: 100%;
                width: 50%;
                float: right;
                text-align: right;
                overflow: hidden;
                .button-div{
                    /*position: absolute;*/
                    margin-right: 3%;
                }
            }
        }
        .m-bom{
            flex: 1;
            text-align: center;
            .not-regist{
                padding-top: 10%;
                .title{
                    color: #323232;
                    font-size: 3.2vh;
                    font-weight: bold;
                    margin-bottom: 5vh;
                }
            }
            .regist-edit{
                padding-top: 3%;
                .img-div{
                    width: 11.7vh;
                    height: 11.7vh;
                    display: inline-block;
                    margin-bottom: 35px;
                    img{
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                    }
                }
                .title{
                    color: #323232;
                    font-size: 3.2vh;
                    font-weight: bold;
                }
                .edit{
                    li{
                        margin-bottom: 20px;
                        padding-top: 35px;
                        > div{
                            line-height: 35px;
                            font-size: 16px;
                        }
                        .content{
                            span{
                                padding-bottom: 35px;
                                border-bottom: 1px dashed #E1E1E1;
                            }
                        }
                        &:last-child{
                            .content span{
                                border-bottom: 0;
                            }
                        }
                    }
                }
            }
        }
        .start-edit{
            .m-bom{
                overflow: auto;
                background: #F5F6F5;
                .el-form{
                    padding-top: 5%;
                    /*display: inline-block;*/
                    text-align: left;
                    padding-left: 35%;
                    .upfile-img{
                        width: 15vh;
                        height: 15vh;
                        /*margin: 0 auto;*/
                        text-align: center;
                        color: #ADACAC;
                        background: rgba(225,225,225,1);
                        overflow: hidden;
                        position: relative;
                        cursor: pointer;
                        span{
                            line-height: 15vh;
                            font-size: 3vh;
                            font-weight: bold;
                        }
                        .load-img{
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                        }
                        .hover-img{
                            width: 100%;
                            height: 100%;
                            background: rgba(225,225,225,0.1);
                            background: rgba(0,0,0,0.1);
                            position: absolute;
                            top: 0;
                            left: 0;
                            display: flex;
                            justify-content: center;
                            opacity: 0;
                            -webkit-transform: scale(2.6);
                            -moz-transform: scale(2.6);
                            -ms-transform: scale(2.6);
                            -o-transform: scale(2.6);
                            transform: scale(2.6);
                            -webkit-transition: all .5s ease-in-out;
                            -moz-transition: all .5s ease-in-out;
                            -ms-transition: all .5s ease-in-out;
                            -o-transition: all .5s ease-in-out;
                            transition: all .5s ease-in-out;
                            img{
                                width: 6.8vh;
                                height: 6vh;
                                margin: auto;
                            }
                        }

                        input{
                            opacity: 0;
                        }
                        &:hover{
                            background: #B4B4B4;
                            .hover-img{
                                opacity: 1;
                                transform: scale(1);
                                -webkit-transform: scale(1);
                                -ms-transform: scale(1);
                                -moz-transform: scale(1);
                                transform: scale(1);
                                -webkit-transform: scale(1);
                                -moz-transform: scale(1);
                                -ms-transform: scale(1);
                            }
                        }
                    }
                    .el-form-item{
                        font-size: 12px;
                        &:nth-of-type(1){
                            /deep/ .el-form-item__content{
                                text-align: left;
                                padding-left: 8%;
                            }
                        }
                        &:nth-of-type(2){
                            span{
                                font-size: 12px;
                                padding-left: 20px;
                                color: #BCBCBC;
                            }
                        }
                        &:nth-of-type(3){
                            .system-content{
                                font-size: 12px;
                                color: #333;
                                margin-right: 10px;
                            }
                        }
                        &:nth-of-type(4){
                            white-space: nowrap;
                            .radio-wrap{
                                height: 40px;
                                line-height: 40px;
                                /*/deep/  .title{			//此方法已验证 可以

                                }*/
                                /deep/  .radio-inner{

                                    .round{
                                        width: 16px;
                                        height: 16px;
                                        border: 1px solid #E1E1E1;
                                        span{
                                            width: 6px;
                                            height: 6px;
                                            background: transparent;
                                        }
                                        &:hover{
                                            border: 1px solid #1cab7d !important;
                                        }
                                    }
                                    .yes-round{
                                        border: 1px solid #1cab7d !important;
                                        background: #1cab7d;
                                        span{
                                            background: #fff !important;
                                        }
                                    }
                                    p{
                                        padding-left: 30px;
                                    }
                                }
                            }
                            /deep/ .el-radio-group{
                                .sel-year{
                                    margin-right: 15px;
                                }
                                .group-span{
                                    margin-left: 15px;
                                }
                                .el-radio{
                                    &:first-child{
                                        display: inline-block;
                                    }
                                }
                            }
                        }
                        /deep/ .el-radio-group{
                            .el-radio{
                                display: block;
                                line-height: 40px;
                                margin-left: 0;
                            }
                        }
                    }
                }
            }
            /deep/ .el-radio-group{
                span{
                    font-size: 12px;
                }
                .el-radio__label{
                    color: #333;
                }
                .el-radio__input, .el-radio__inner{
                    width: 16px;
                    height: 16px;
                }
                .el-radio__inner:hover{
                    border: 1px solid #1cab7d;
                }
                .el-radio__input.is-checked .el-radio__inner{
                    width: 16px;
                    height: 16px;
                    border: 1px solid #1cab7d;
                    background: #1cab7d !important;
                    &:after{
                        width: 6px;
                        height: 6px;
                    }
                }
            }
            /deep/ .el-checkbox{
                span{
                    font-size: 12px;
                }
                .el-checkbox__inner:hover{
                    border: 1px solid #1cab7d;
                }
                .el-checkbox__input.is-checked .el-checkbox__inner{
                    border: 1px solid #1cab7d;
                    background: #1cab7d;
                }
                .el-checkbox__input.is-focus .el-checkbox__inner{
                    border: 1px solid #1cab7d;
                }
                .el-checkbox__input.is-checked+.el-checkbox__label{
                    color: #333;
                }
            }
            .sch-system-dialog{
                .el-form{
                    text-align: center;
                }
                .el-form-item{
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
                    &:after{
                        content: '';
                        width: 1px;
                        height: 40px;
                        position: absolute;
                        right: 0;
                        top: 0;
                        bottom: 0;
                        margin: auto;
                        background: #E1E1E1;
                    }
                    &:last-child{
                        &:after{
                            background: transparent;
                        }
                    }
                }
                /deep/ .el-radio-group{
                    /*width: 30%;*/
                    line-height: 40px;
                    /*text-align: left;*/
                    position: relative;
                    /*margin-left: 20px;*/
                    .el-radio{
                        display: inline-block;
                    }
                    /*&:after{
                        content: '';
                        position: absolute;
                        width: 1px;
                        height: 40px;
                        right: 0;
                        top: -15px;
                        background: #e1e1e1;
                    }
                    &:last-child{
                        &:after{
                            background: transparent;
                        }
                    }*/
                }
                .el-checkbox{
                    display: block;
                    /*display: inline-block;*/
                    /*text-align: left;*/
                    /*width: 30%;*/
                    /*line-height: 30px;*/
                    /*margin-left: 20px;*/
                }
                .dialog-footer{
                    > span{
                        line-height: 30px;
                        display: block;
                        font-size: 12px;
                        color: #333;
                        text-align: left;
                        padding-left: 3%;
                        margin-bottom: 20px;
                    }
                    .button-div{
                        margin-right: 20px;
                    }
                }
            }
        }
    }
</style>
