<template>
    <div class="card-monitor">
		<div class="m-left">
			<el-tree :data="treeData"  node-key="id" :default-checked-keys="['10010']" 
			:check-on-click-node="true" default-expand-all @node-click="handleNodeClick">
				<span class="span" :ref="data.id" slot-scope="{ node, data }">{{data.label}}</span>
			</el-tree>
		</div>
		<div class="m-right">
            <div class="inner-top">
                <Button btnClass="custom6" :iconLeft="true"  :data="btn2Data" btnFontSize="12px" 
			title="返回上一页" @click="back"></Button>
			<h4>{{resourceObj.placeName}}</h4>
            </div>
			<div class="inner-content">
                <div class="inner-img">
                    <img :src="monitorImg" alt="">
                </div>
            </div>
		</div>
		<Toast v-if="isToast" :modal-title="toast" duration="1500" @toastCancel="hideToast"></Toast>
    </div>
</template>

<script>
	import Button from '@/components/Button/Button'
	import Toast from '@/components/Toast/Toast'

	export default {
		name: 'CardMonitor',
		components: {
			Button,Toast
		},
		data() {
			return {
				isToast: false,//toast是否展示
				toast: '',//toast提示内容
				btn2Data:{
					iconL: require('../../assets/images/back_no.png'),
					iconLAct: require('../../assets/images/back_ac.png')
				},//返回按钮
				treeData: [{
					"id": 1000,
					"pid": 101,
					"label": "烟台一中",
					"group": 102,
					"isLeaf": 0,
					"children": [{
						"id": 10000,
						"pid": 1000,
						"label": "初一一班教室",
						"group": 103,
						"isLeaf": 1,
						"children": []
					},{
						"id": 10001,
						"pid": 1000,
						"label": "初一二班教室",
						"group": 103,
						"isLeaf": 1,
						"children": []
					},{
						"id": 10002,
						"pid": 1000,
						"label": "初一三班教室",
						"group": 103,
						"isLeaf": 1,
						"children": []
					},{
						"id": 10003,
						"pid": 1000,
						"label": "初一四班教室",
						"group": 103,
						"isLeaf": 1,
						"children": []
					},{
						"id": 10004,
						"pid": 1000,
						"label": "初一五班教室",
						"group": 103,
						"isLeaf": 1,
						"children": []
					},{
						"id": 10005,
						"pid": 1000,
						"label": "初一五班教室",
						"group": 103,
						"isLeaf": 1,
						"children": []
					}]
                }],
                treeData:[],
				resourceObj:{
					place_id:'',
					class_id:'',
					placeName:'',
					source:'',
                },
                monitorTimer:null,
                monitorImg:'',
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
			 *  @function: 重新获取宽高
			 *  @author: lxr
			 *  @date 2018-7-20
			 **/
            resizeLayout(){
	            setTimeout(()=> {
		            let mrH = $('.index .m-right').height();
		            let mtH = $('.m-right .inner-top').height();
                    let tblH =  mrH - mtH - 40;
                    $('.m-right .inner-content').height(tblH)
	            },100)
            },
			/* ----------三期------------- */
			/**
			 *  @function: 左侧树点击
			 *  @author: cs
			 *  @date 2018-12-05
			 **/
			handleNodeClick(data,node){
				console.log(data,node);
				if (data.id == this.resourceObj.place_id) return
				if(data.is_leaf == 1){
					let params = {
						placeName:data.label,
						place_id:data.id,
						class_id:data.cid,
						source:this.resourceObj.source,
					}
					$('.span').removeClass('custom-tree-node')
					this.$refs[data.id].classList.add("custom-tree-node");
					// this.resourceObj = {};
					this.resourceObj = params;
					// this.resourceObj.place_id = data.id;
					// this.resourceObj.placeName = data.label;
					// console.log(params,this.resourceObj,111);
                    this.$router.replace({path: '/CardMonitor', query: params})
                    window.clearInterval(this.monitorTimer)
                    this.monitorTimer = setInterval(() => {
                        this.getCardMonitor(params.class_id,params.place_id);
                    }, 1000);
				}
			},
			/**
			 *  @function: 返回上一页
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			back(){
				console.log('返回上一页')
				this.$router.push(`/${this.$route.query.source}`);
            },
            /**
             *  @function: 查看班牌监控
             *  @author: cs
             *  @date 2018-12-19
             */
            getCardMonitor(class_id,place_id){
                let params = {
                    school_id: localStorage.getItem("schoolId"),
                    user_id: localStorage.getItem("userId"),
                };
                if(class_id){
                    params.class_id = class_id;
                }else if(place_id){
                    params.place_id = place_id;
                }
                this.$api.DeviceControl.getCardMonitor("post", params).then(res => {
                    //获取班牌监控
                    console.log("获取班牌监控",res.data);
                    this.monitorImg = res.data.screenshot;
                }).catch(err => {
                    this.tableLoading = false;
                });
            },
            /**
             *  @function: 获取树结构
             *  @author: cs
             *  @date 2018-12-19
             */
            getPlaceTree() {
                let params = {
                    school_id: localStorage.getItem("schoolId")
                };
                this.$api.Common.getPlaceTree("get", params).then(res => {
                    console.log("查上课教室树：", res.data.data);
                    if (res.data.code == 600 || res.data.code == 0) {
                        this.treeData = res.data.data;
                        if(this.resourceObj.place_id){
                            $('.span').removeClass('custom-tree-node')
                            console.log(66,this.resourceObj);
                            
                            this.$refs[this.resourceObj.place_id].classList.add("custom-tree-node");
                            window.clearInterval(this.monitorTimer)
                            this.monitorTimer = setInterval(() => {
                                this.getCardMonitor(this.resourceObj.class_id,this.resourceObj.place_id);
                            }, 1000);
                        }else{
                            console.log(77,this.resourceObj);
                            //设置选中第一项
                            if (this.treeData.length > 0 ) {
                                if(this.treeData[0].children && this.treeData[0].children.length>0){
                                    let data = this.treeData[0].children[0];
                                    this.$refs[data.id].classList.add("custom-tree-node");
                                    this.resourceObj.placeName = data.label;
                                    this.resourceObj.place_id = data.id;
                                    // if(this.treeData[0].children[0].children && this.treeData[0].children[0].children.length>0){
                                    // 	let data = this.treeData[0].children[0].children[0];
                                    // 	this.$refs[data.id].classList.add("custom-tree-node");
                                    // }
                                }
                            }
                        }
                    } else {
                        this.isToast = true;
                        this.toast = res.data.msg;
                    }
                }).catch(err => {
                    this.tableLoading = false;
                });
            },
		},
		mounted() {
            //权限id数组
            this.roleActions = this.$store.state.Common.roleActions;
			this.resizeLayout();//重新获取宽高
			this.resourceObj = this.$route.query;
			console.log('接收参数：',this.resourceObj,this.$route.query);
            this.getPlaceTree();
		},
		created(){
        }
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .card-monitor {
        width: 100%;
        height: 100%;
        margin: 0 auto;
		display: flex;
		text-align: center;
		overflow: hidden;
		background-color: #E7E8EB;
		.m-left {
			flex-basis: 260px;
			min-width: 260px;
			text-align: center;
			// margin-right: 20px;
			background-color: #fff;
			padding: 30px 0 30px 40px;
			font-size: 12px;
			overflow: hidden;
            overflow-y:auto;
			.span{
				padding: 5px 20px;
			}
			.custom-tree-node {
				background-color: #1cab7d;
				color: #fff;
				// border-radius: 5px;
			}
		}
		.m-right{
			height:auto;
			flex: 1;
			text-align: left;
			background-color: #fff;
			position: relative;
			.button-div{
				position: absolute;
				right: 30px;
				top: 30px;
			}
            .inner-top{
                line-height: 100px;
                height: 100px;
				text-align: center;
                h4{
                    font-size: 20px;
                    font-weight: bold;
                }
            }
			.inner-content{
                width: 90%;
                margin: 0 auto;
                overflow: hidden;
                .inner-img{
                    position: relative;
                    // padding-top: 75%;
                    width: 100%;
                    height: 100%;
                    img{
                        width: 100%;
                        height: 100%;
                        max-width: 100%;
                        max-height: 100%;
                        position: absolute;
                        left: 0;
                        top: 0;
                        bottom: 0;
                        right: 0;
                        margin: auto;
                    }
                }
            }
		}
    }
</style>
