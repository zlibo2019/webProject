<template>
    <el-container class="stu-turnover-set">
        <el-header class="set-top">
            <NavMenu :data="menuData" blocks="inline" dtPLeft="padding-left: 8px; font-size:15px;" :clickActive1="clickActive"
                     menuStyle="menuStyle" @click="clickMenu" actives="actives" :defArrow="defArrow"></NavMenu>
        </el-header>
        <el-main class="set-bottom">
            <router-view v-if="isRouterAlive"></router-view>
        </el-main>
    </el-container>
</template>

<script>
	import Button from '@/components/Button/Button'
	import NavMenu from '@/components/NavMenu/NavMenu'
	export default {
		name: 'HelloWorld',
		components: {
			Button,NavMenu
		},
		data() {
			return {
				isRouterAlive: true, //路由是否加载
                defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				menuData:[          //右侧导航数组
                    {
	                    title: '模块管理',
	                    value: 1,
	                    isSubShow: false,
	                    icon: require('../../../assets/images/card_template_no.png'),
	                    iconActive: require('../../../assets/images/card_template_ac.png')
                    },
                    {
	                    title: '资源平台',
	                    value: 2,
	                    isSubShow: false,
	                    icon: require('../../../assets/images/card_platform_no.png'),
	                    iconActive: require('../../../assets/images/card_platform_ac.png')
                    },
                    {
	                    title: '应用规则',
	                    value: 3,
	                    isSubShow: false,
	                    icon: require('../../../assets/images/card_rule_no.png'),
	                    iconActive: require('../../../assets/images/card_rule_ac.png')
                    },
                ],
				clickActive: sessionStorage.getItem('childMenuIndex')?sessionStorage.getItem('childMenuIndex'): 0,
			}
		},
		methods: {
			clickMenu(index, item) {
				console.log('clickMenu', index, item)
				if (item.value == 1) {//
					this.$router.push('/TemplateManage')      //模板管理
				} else if (item.value == 2) {
					this.$router.push('/ResourcePic')            //资源平台-图片
				}else if (item.value == 3) {
					this.$router.push('/ContentSetting')          //应用规则
                }
                this.isRouterAlive = false;                        //点击相同路由用来刷新页面
				this.$nextTick(() => (this.isRouterAlive = true));    //点击相同路由用来刷新页面
				sessionStorage.setItem('childMenuIndex',index);
                sessionStorage.setItem('threeMenuIndex',0);
			}
		},
		mounted() {
			setTimeout(()=> {
				let icH = $('.index > .m-cen').height();
				let ttH = $('.stu-turnover-set > .m-top').height();
				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				// let tblH = icH - ttH - obH - pbH -15;
				// console.log(666,icH,ttH,obH,pbH,tblH)
				// $('.table-box').height(tblH)
                let tblH = icH - $('.stu-turnover-set .title').height() - $('.stu-turnover-set > .m-top').height()
                    - $('.stu-turnover-set > .m-cen').height() - 30;
                $('.stu-turnover-set .m-bom .table-box').height(tblH)
			},25)
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .stu-turnover-set {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .set-top{
            height:58px;
            line-height: 58px;
            padding: 0;
            background:#F5F7F8;
            margin-bottom: 10px;
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
                    .arrow{
						height: 23px;
					}
                    &:last-child{
                        .arrow{
                            display: none;
                        }
                    }
                }
            }
        }
        .set-bottom{
            padding: 0;
        }
    }
</style>
