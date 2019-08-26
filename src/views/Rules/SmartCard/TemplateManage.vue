<template>
    <div class="template-manage">
		<div class="template-top">
			<h4>正在运用的班牌模板</h4>
			<div class="swiper-container">
				<div class="swiper-wrapper">
					<div class="swiper-slide" v-for="(item, index) in useTemplateData" :key="index">
                        <!-- <img :onerror="defaultErrImg"
							:src="item.template_display_pic.length>0?uploadPicUrl+item.template_display_pic[0]+'?imageView2/1/w/310/h/170':''"> -->
						<div class="inner-img">
                            <img :src="item.template_display_pic[0]" :onerror="defaultErrImg">
                        </div>
						<h5>{{item.template_name}}</h5>
						<Button btnClass="custom6" btnFontSize="12px" title="查看班牌监控" btnHeight='34px'  @click="checkMonitor(item)"></Button>
					</div>
				</div>
			</div>
		</div>
		<div class="template-bot">
			<h4 class="title">班牌模板({{templateData.length}})</h4>
			<el-main class="template-list">
				<el-row :gutter="20">
					<el-col :span="6" v-for="(item, index) in templateData" :key="index">
						<div class="inner">
                            <!-- <img :onerror="defaultErrImg"
                                :src="item.template_display_pic.length>0?uploadPicUrl+item.template_display_pic[0]+'?imageView2/1/w/310/h/170':''"> -->
                            <div class="inner-img">
                                <img :src="item.template_display_pic[0]" :onerror="defaultErrImg">
                            </div>
                            <h5>{{item.template_name}}</h5>
                            <Button btnClass="custom6" btnFontSize="12px" btnHeight='34px' title="应用模板" @click="showTemplateDetail(item)"></Button>
						</div>
					</el-col>
				</el-row>
			</el-main>
		</div>

        <!-- 查看模板详情 -->
		<el-dialog title="" :visible.sync="templateDetailDialog" v-if="templateDetailDialog" width="900px" center class="template-dialog">
            <div class="swiper-container gallery-top">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in this.checkedTemplate.template_display_pic" :key="index">
                        <!-- <img :onerror="defaultErrImg" 
                            :src="uploadPicUrl+item+'?imageView2/1/w/520/h/290'"> -->
                        <img :src="item" :onerror="defaultErrImg">
                    </div>
                </div>
            </div>
            <div class="swiper-button-next"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-container gallery-thumbs">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item, index) in this.checkedTemplate.template_display_pic" :key="index">
                        <!-- <img :onerror="defaultErrImg" 
                        :src="uploadPicUrl+item+'?imageView2/1/w/120/h/70'"> -->
                        <img :src="item" :onerror="defaultErrImg">
                    </div>
                </div>
            </div>
            <div class="current-count" v-if="checkedTemplate.template_display_pic.length>0"><span>{{currentNum}}</span>/{{checkedTemplate.template_display_pic.length}}</div>
			<h5>{{checkedTemplate.template_name}}</h5>
			<p>{{checkedTemplate.desc}}</p>
			<Button btnClass="custom8" btnFontSize="12px" title="应用模板" @click="useTemplate"></Button>
        </el-dialog>

		<el-dialog title="应用模板" :visible.sync="useTemplateDialog" width="900px" center class="sch-system-dialog">
			<div class="content">
				<div class="transfer-div">
					<tree-transfer :from_data="fromData" leftTitle='选择教室' leftplaceholder='请输入教室名称' sourceDiffer="2" 
					:user_data="listClassroom" @showSelected="getSelected" @checkedClick="checkedClick"></tree-transfer>
				</div>
			</div>
			<span slot="footer" class="dialog-footer">
				<Button title="取消" btnClass="custom7" btnFontSize="12px" btnHeight="4.5vh"
						@click="useTemplateDialog = false"></Button>
				<Button title="保存" btnClass="custom8" btnFontSize="12px" btnHeight="4.5vh"
						@click="saveTemplate"></Button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import treeTransfer from '@/components/Transfer/transfer-extend'
	import Toast from '@/components/Toast/Toast'
	import Swiper from 'swiper';
	export default {
		name: 'TemplateManage',
		components: { 
			Button, treeTransfer, Toast
		},
		computed: {
			defaultErrImg() {
				return 'this.src="' + this.$store.state.Common.defaultErrImg + '"'
			}
		},
		data() {
			return {
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				swiperSpeed: 5000,//swiper速度
				useTemplateData:[
                    {
                        template_display_pic:[
                            require('../../../assets/images/moral_main.png'),
                            require('../../../assets/images/moral_pic.png'),
                            require('../../../assets/images/moral_video.png'),
                            require('../../../assets/images/moral_text.png'),
                        ],
                        template_name:'德育模板',
                    }
                ],//应用的模板数据
				templateData:[
                    {
                        template_display_pic:[
                            require('../../../assets/images/moral_main.png'),
                            require('../../../assets/images/moral_pic.png'),
                            require('../../../assets/images/moral_video.png'),
                            require('../../../assets/images/moral_text.png'),
                        ],
                        desc:'以学校德育宣传为主，主要展示图片、视频及通知公告等信息内容，对学校德育工作起到积极有效的作用',
                        template_name:'德育模板',
                        template_id:'1',
                    },
                    {
                        template_display_pic:[
                            require('../../../assets/images/functional_main.png'),
                            require('../../../assets/images/functional_pic.png'),
                            require('../../../assets/images/functional_timetable.png'),
                            require('../../../assets/images/functional_leave.png'),
                        ],
                        desc:'以班级文化建设和辅助班级管理为主，具有班级考勤、班级课程、学生个人中心班牌留言、班牌请假等互动功能，为班级管理和学生成长服务',
                        template_name:'功能性模板',
                        template_id:'2',
                    },
                ],//所有模板数据
				templateDetailDialog:false,//应用模板弹窗
                useTemplateDialog:false,//选择教室弹窗
                checkedTemplate:{},//选择的模板
				currentNum:1,//当前第几页
				listClassroom: [],          //选中的教室数组,传给后台的参数
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
					}
				],
				fromData: [{
					"id": 1000,
					"pid": 101,
					"label": "烟台一中",
					"group": 102,
					"disabled": 0,
					"children": [{
						"id": 10000,
						"pid": 1000,
						"label": "校门口",
						"disabled": 0,
						"group": 103,
						"children": [{
							"id": 10010,
							"pid": 10000,
							"label": "101",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10011,
							"pid": 10000,
							"label": "102",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10012,
							"pid": 10000,
							"label": "103",
							"disabled": 0,
							"group": 104,
							"children": []
						}]
					},{
						"id": 10001,
						"pid": 1000,
						"label": "传达室",
						"disabled": 0,
						"group": 103,
						"children": [
							{
							"id": 10020,
							"pid": 10001,
							"label": "201",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10021,
							"pid": 10001,
							"label": "202",
							"disabled": 0,
							"group": 104,
							"children": []
						}, {
							"id": 10022,
							"pid": 10001,
							"label": "203",
							"disabled": 0,
							"group": 104,
							"children": []
						}]
					}]
				}],   // 清空
			}
		},
		methods: {
			/**
			 *  @function: 重新获取宽高
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			resizeLayout() {
				setTimeout(() => {
					let icH = $('.index > .m-cen').height();
					let stH = $('.index .set-top').height();	
					let ttH = $('.template-manage > .template-top').height();
					let btH = $('.template-manage .template-bot .title').height();
					let tblH = icH - stH - ttH  - btH - 40;
					console.log(66, icH, stH, ttH, btH)
					$('.template-manage .template-list').height(tblH)
				}, 50)
			},
			/** 
			 *  @function: 查看班牌监控
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			checkMonitor(item) {
				console.log('查看班牌监控:',item);
				let params = {
					source:'TemplateManage',
					// placeName:'',
					// placeId:'',
				}
				this.$router.push({path: '/CardMonitor', query: params})
			},
			/**
			 *  @function: 应用模板按钮点击
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			showTemplateDetail(item) {
                console.log('应用模板按钮点击:',item);
                this.checkedTemplate = JSON.parse(JSON.stringify(item));
                this.template_id = item.template_id;
                this.templateDetailDialog = true;
                this.currentNum = 1;
				let vThis = this;
				let mySwiper = null;
				setTimeout(() => {
                    let galleryThumbs = new Swiper('.template-dialog .gallery-thumbs', {
						spaceBetween: 10,
						slidesPerView: this.checkedTemplate.template_display_pic.length>4?4:this.checkedTemplate.template_display_pic.length,
						freeMode: true,
						watchSlidesVisibility: true,
						watchSlidesProgress: true,
						on: {
							slideChangeTransitionStart: function(){
								//轮播之前执行
								vThis.currentNum = this.activeIndex+1;
								if (this.activeIndex > vThis.checkedTemplate.template_display_pic.length) {
									vThis.currentNum = vThis.checkedTemplate.template_display_pic.length;
								}else if(this.activeIndex == 0){
									vThis.currentNum = 1
								}
							}
						}
					});
					let galleryTop = new Swiper('.template-dialog .gallery-top', {
						spaceBetween: 10,
						navigation: {
							nextEl: '.swiper-button-next',
							prevEl: '.swiper-button-prev',
						},
						thumbs: {
							swiper: galleryThumbs
						},
						on: {
							slideChangeTransitionStart: function(){
								//轮播之前执行
								vThis.currentNum = this.activeIndex+1;
								if (this.activeIndex > vThis.checkedTemplate.template_display_pic.length) {
									vThis.currentNum = vThis.checkedTemplate.template_display_pic.length;
								}else if(this.activeIndex == 0){
									vThis.currentNum = 1
								}
								console.log(this.activeIndex);
							}
						}
					});
				}, 0);
			},
			/**
			 *  @function: 应用模板
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			useTemplate() {
                console.log('应用模板:',this.roleNos.length , this.roleNos[0]);
                if(this.roleNos.length == 1 && this.roleNos[0] == 'SYS002'){ // 班主任
                    console.log(1,this.roleNos.length , this.roleNos[0])
                }else{
                    this.useTemplateDialog = true;
                    this.getPlaceTree();
                }
				
			},
			/**
			 *  @function: 应用模板
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			saveTemplate() {
				console.log('选择教室下发模板:');
                let placeidArr = this.listClassroom.map(item=>{
                    return item.id
                })
                console.log(111,placeidArr);
                let params = {
                    "template_id": this.template_id,
                    place_id:placeidArr.join(','),//场所ID，多个ID使用逗号分隔（见文档）
                    "user_id": localStorage.getItem('userId'),//操作人id
                    "school_id": localStorage.getItem('schoolId'),
                };
                this.$api.Rules.applyTemplate('post',params).then(res => {
                    console.log('应用模板', res.data);
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.useTemplateDialog = false;
                        this.templateDetailDialog = false;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
			},
			/**
			 *  @function: table 列表点击筛选
			 *  @author: cs
			 *  @date 2018-12-07
			 */
			getSelected(data) {
				console.log('888999666',data,this.listClassroom.length)
				for(let i = 0;i<data.length;i++){
					this.listClassroom.push(
						{
							'classId': data[i].pid,
							'placeName': data[i].pname,
							'studentId': data[i].id,
							'id': data[i].id,
							'buildingName': data[i].label
						}
					)
				}
				let length = this.listClassroom.length;
				if(length == 1) return
				// console.log(444,length)
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.listClassroom[k].id == this.listClassroom[i].id){
							// console.log(11111111111111)
							this.listClassroom.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data.length, this.listClassroom.length)
			},
			/**
			 *  @function: table 列表搜索筛选
			 *  @author: cs
			 *  @date 2018-12-07
			 */
			checkedClick(data){
				console.log('data111',data,this.listClassroom)
				this.listClassroom.push(
					{
						'classId': data.pid,
						'placeName': data.pname,
						'studentId': data.id,
						'id': data.id,
						'buildingName': data.value,
					}
				)
				let length = this.listClassroom.length;
				if(length == 1) return
				for (let i = 0; i < length; i++) {
					for(let k = i+1;k < length;k++){
						if(this.listClassroom[k].id == this.listClassroom[i].id){
							this.listClassroom.splice(k,1);
							length--;
							k--;
						}
					}
				}
				// console.log(12333333, data, this.listClassroom)
			},
			/**
			 *  @function: 获取模板列表
			 *  @author: cs
			 *  @date 2019-01-16
			 */
			getDevTemplate(is_used){
				let params = {
                    is_used:is_used,//0 未使用 1正在使用 2 所有
                    school_id: localStorage.getItem('schoolId'),
                };
                this.$api.Rules.getDevTemplate('get',params).then(res => {
                    console.log('获取模板列表', res.data.data);
                    if (res.data.code == 600 || res.data.code == 0) {
                        res.data.data.forEach(item => {
                            if(item.template_display_pic){
                                item.template_display_pic = item.template_display_pic.split(',');
                            }else{
                                item.template_display_pic = [];
                            }
                        });
                        if(is_used == 0){
                            //暂时不需要 保留
                        }else if(is_used == 1){
                            this.useTemplateData = res.data.data;
                            let vThis = this;
                            let mySwiper = null;
				            setTimeout(() => {
                                mySwiper = new Swiper('.template-top .swiper-container', {
                                    autoplay: {
                                        delay: vThis.swiperSpeed,
                                        disableOnInteraction: false,
                                    },
                                    slidesPerView: vThis.useTemplateData.length<3?vThis.useTemplateData.length:3,
                                })
				            }, 0);
                        }else if(is_used == 2){
                            this.templateData = res.data.data;
                        }
                        console.log(66666666,this.useTemplateData,this.templateData);
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                })
            },
            /**
			 *  @function: 获取场所树
			 *  @author: cs
			 *  @date 2019-01-22
			 */
			getPlaceTree(){
                let params = {
                    school_id: localStorage.getItem('schoolId'),
                }
                this.$api.Common.getPlaceTree('get',params).then(res => {
                    console.log('获取场所树', res.data.data)
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.fromData = res.data.data;
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err =>{
                    this.tableLoading = false;
                })
            },
		},
		mounted() {
            //权限id数组
			this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
            // this.getDevTemplate(1);//正在使用的模板
            // this.getDevTemplate(2);//所有模板
			
         },
         created(){
         }
	}
</script>

<style type="text/scss" lang="scss" scoped>
   .template-manage{
		width: 100%;
		height: 100%;
	   .template-top{
			width: 100%;
			height: 310px;
			background-color: #fff;
			overflow: hidden;
			h4{
				font-size: 20px;
				line-height: 40px;
				margin-top: 10px;
				text-align: center;
			}
			.swiper-container{
				width: 100%;
				height: 260px;
				overflow: hidden;
				.swiper-wrapper{
					.swiper-slide{
						width: 100%;
						text-align: center;
						img{
							// width: 227px;
                            width: 310px;
							height: 170px;
						}
						h5{
							font-size: 16px;
							line-height: 30px;
							color: #000;
						}
						.button-div{
							margin-top: 5px;
						}
					}
				}
			}
	   }
	   .template-bot{
			width: 100%;
			height: 100%;
			margin-top: 20px;
			.title{
				font-size: 20px;
				line-height: 40px;
				margin-bottom: 10px;
			}
			.template-list{
				width: 100%;
				height: 100%;
				text-align: center;
				overflow-x: hidden;
				padding: 0;
				.el-col{
					min-height: 255px;
					margin-bottom: 20px;
					.inner{
						width: 100%;
						height: 100%;
                        padding-bottom: 10px;
						min-height: 255px;
						background-color: #fff;
                        overflow: hidden;
					}
                    .inner-img{
                        position: relative;
                        padding-top: 67.5%;
                        width: 90%;
                        margin:10px auto;
                        margin-bottom: 0;
                    }
					img{
						width: 100%;
						height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        right: 0;
                        bottom: 0;
                        margin: auto;
					}
					h5{
						line-height: 40px;
                        height: 40px;
					}
				}
			}
	   }
	   .template-dialog{
		   /deep/ .el-dialog{
              	.el-dialog__body{
					text-align: center;
					border: 0 !important;
					/* .swiper-container{
						height: 370px;
						.swiper-wrapper{
							.swiper-slide{
								text-align: center;
								img{
									width: 470px;
									height: 240px;
								}
							}
						}
						.swiper-pagination{
							img{
								width: 100px;
								height: 60px;
								border-radius: 3px;
								border: 0;
								opacity: 1;
								box-sizing: border-box;
								border: 2px solid #fff;

							}
							.swiper-pagination-bullet-active{
								background: transparent ;
								border: 2px solid #1cab7d;
							}
						}
						
					} */
                    .swiper-button-next{
                        width: 40px;
                        height: 60px;
                        top: 35%;
                        right: 55px;
                        background: url('../../../assets/images/next.png') no-repeat center;
                        background-size: 100% ;
                        &:focus{
                            border: 0;
                            outline: none;
                        }
                    }
                    .swiper-button-prev{
                        width: 40px;
                        height: 60px;
                        top: 35%;
                        left: 55px;
                        background: url('../../../assets/images/next.png') no-repeat center;
                        background-size: 100% ;
                        -webkit-transform: rotate(-180deg);
                        -moz-transform: rotate(-180deg);
                        -ms-transform: rotate(-180deg);
                        -o-transform: rotate(-180deg);
                        transform: rotate(-180deg);
                        &:focus{
                            border: 0;
                            outline: none;
                        }
                    }
                    .swiper-button-disabled{
                        background: url('../../../assets/images/next_normal.png') no-repeat center;
                        background-size: 100% ;
                        opacity: 1;
                    }
                    .swiper-container{
						width: 580px;
						height: 370px;
						.swiper-wrapper{
							.swiper-slide{
								text-align: center;
							}
						}
							&.gallery-top {
							height: 80%;
							.swiper-slide {
								img{
									width: 100%;
									max-height: 430px;
								}
							}
						}
						&.gallery-thumbs {
							height: 20%;
							box-sizing: border-box;
							padding: 10px 0;
							
						}
						&.gallery-thumbs {
							.swiper-slide {
								overflow: hidden;
								width: 16%;
								img{
									width: 100%;
									border: 2px solid transparent;
								}
							}
						}
						&.gallery-thumbs .swiper-slide-thumb-active {
							img{
								border: 2px solid #1cab7d;
							}
						}
					}
					h5{
						font-size: 16px;
						line-height: 30px;
						color: #000;
					}
					p{
						font-size: 12px;
						line-height: 16px;
						margin-bottom: 20px;
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
   }
</style>
