<template>
    <div class="rules-index">
        <div class="center-left" ref="abc">
            <NavMenu :data="menuData" blocks="block" dtPLeft="padding-left: 80px; font-size:14px;"
                     menuStyle="menuStyle" @click="clickMenu" actives="actives" :clickActive1="clickActive"></NavMenu>
        </div>
        <div class="center-right">
            <div class="right-center">
                <router-view v-if="isRouterAlive"></router-view>
            </div>
        </div>
    </div>

</template>

<script>
	import NavMenu from '@/components/NavMenu/NavMenu'

	export default {
		name: 'RulesIndex',
		components: {
			 NavMenu
		},
		data() {
			return {
				clickActive: sessionStorage.getItem('pageMenuIndex')?sessionStorage.getItem('pageMenuIndex'): 0,
				isRouterAlive: true, //路由是否加载
                menuData: [
					{
						title: '校门进出',
						value: 1,
						icon: require('../../assets/images/rule_school_gate_no.png'),
						iconActive: require('../../assets/images/rule_school_gate_ac.png')
					},{
                        title: '访客进出',
						value: 2,
						icon: require('../../assets/images/rule_visitor_no.png'),
						iconActive: require('../../assets/images/rule_visitor_ac.png')
					},{
                        title: '智慧班牌',
						value: 3,
						icon: require('../../assets/images/rule_card_no.png'),
						iconActive: require('../../assets/images/rule_card_ac.png')
                    }
				]
			}
		},
		methods: {
			clickMenu(index, item) {
                // console.log('clickMenu', index, item)
                this.isRouterAlive = false;                        //点击相同路由用来刷新页面
                this.$nextTick(() => (this.isRouterAlive = true));    //点击相同路由用来刷新页面
                sessionStorage.removeItem('childMenuIndex');// 点击左侧菜单删除右上菜单的session，避免样式去不掉180906(点击二级，不能放外面)
				if (item.value == 1) {
					this.$router.push('/BuildingsDevices')      //学生进出设置--楼宇/设备页面
				} else if (item.value == 2) {
					// this.$router.push('/VisitorDevices')       //访客进出设置
					this.$router.push('/VisitorPass')            // 访客通行证 20190226修改跳转路由
				} else if (item.value == 3) {
					this.$router.push('/TemplateManage')       //智慧班牌
				}
				sessionStorage.setItem('pageMenuIndex',index);
				// console.log('eee',sessionStorage.getItem('pageMenuIndex'))
			},
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .rules-index{
        width:100%;
        height:100%;
        display: flex;
        flex-direction: row;
        background: #E7E8EB;
        .center-left {
            height: 100%;
            background: #fff;
            color: #333;
            flex-basis: 200px;
            position: relative;
            overflow: hidden;
            margin-right: 20px;
            > div {
                width: 200px;
            }
            /deep/ .navmenu-container{
                .navbar{
                    line-height: 6vh;
                    .menuStyle{
                        background: #fff;
                        color: #000;
                        min-height: 6vh;
                        img.icon{
                            left:30px;
                        }
                        dd.dtdd{
                            height: 5vh;
                            line-height: 4.5vh;
                            span{
                                font-size: 14px;
                                vertical-align: inherit;
                            }
                        }
                        img.arrow{
                            display: none;
                        }
                        img.arrow.imgActive{
                            -webkit-transform: rotate(180deg);
                            -moz-transform: rotate(180deg);
                            -ms-transform: rotate(180deg);
                            -o-transform: rotate(180deg);
                            transform: rotate(180deg);
                        }
                    }
                    .actives { //选中菜单的样式
                        background: #1cab7d;
                        dd {
                            color: #fff;
                        }
                    }
                    .sub-menu{
                        background: #CDE7D8;
                        .scorll-div {
                            dd{
                                padding-left: 0;
                                text-align: center;
                                font-size: 14px;
                                color: #4F4F4F;
                            }
                            &:hover{
                                dd{
                                    color: #1cab7d;
                                }
                            }
                            &.actives{
                                dd{
                                    color: #1b9a71;
                                }
                            }
                        }
                    }
                }
                .navbar:hover{
                    background: #1cab7d;
                    dd {
                        color: #fff;
                    }
                }
            }
            .actives { //选中菜单的样式
                background: #1cab7d;
                dd {
                    color: #fff;
                }
            }
        }
        .center-right {
            flex: 5;
            height: 100%;
            overflow-x: scroll;
            overflow: hidden;

            .right-top {
                height: 40px;
                line-height: 40px;
                padding-left: 20px;

                span {
                    font-size: 12px;
                    font-weight: bold;
                    color: #676768;
                }
                span.navRoute {
                    font-weight: normal;
                    color: #676768;
                }
                span.navRoute2 {
                    font-weight: normal;
                    color: #0573DA;
                }
            }
            .right-center {
                height: 100%;
            }
        }
    }
</style>
