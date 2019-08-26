<template>
    <div class="advanced-settings">
        <div class="center-top" ref="abc">
            <NavMenu :data="menuData" blocks="inline" dtPLeft="padding-left: 8px; font-size:15px;" :clickActive1="clickActive"
                     menuStyle="menuStyle" @click="clickMenu" actives="actives" :defArrow="defArrow"></NavMenu>
        </div>
        <div class="center-bom">
            <div class="right-center">
                <router-view></router-view>
            </div>
        </div>
    </div>

</template>

<script>
	import NavMenu from '@/components/NavMenu/NavMenu'

	export default {
		name: 'HelloWorld',
		components: {
			 NavMenu
		},
		data() {
			return {
				defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				menuData: [
					{
						title: '角色组设置',
						value: 1,
						isSubShow: true,
						icon: require('../../assets/images/roleLimit_d01.png'),
						iconActive: require('../../assets/images/roleLimit_s01.png')
					},
					{
						title: '角色组成员设置',
						value: 2,
						isSubShow: true,
						icon: require('../../assets/images/roleLimit_d02.png'),
						iconActive: require('../../assets/images/roleLimit_s02.png')
					}
				],
				clickActive: sessionStorage.getItem('pageMenuIndex')?sessionStorage.getItem('pageMenuIndex'): 0,
			}
		},
		methods: {
			clickMenu(index, item) {
				// console.log('clickMenu', index, item)
				if (item.value == 1) {
					this.$router.push('/RoleGroupSet')      //角色组设置
				} else if (item.value == 2) {
					this.$router.push('/RoleMemberSet')      //角色成员组设置
				}
				sessionStorage.setItem('pageMenuIndex',index);
			},
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .advanced-settings {
        width:100%;
        height:100%;
        /*display: flex;*/
        /*flex-direction: row;*/
        background: #E7E8EB;
        .center-top {
            height:6.3vh;
            background:#F5F7F8;
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
           /* height: 100%;
            background: #fff;
            color: #333;
            flex-basis: 200px;
            position: relative;
            overflow: hidden;
            margin-right: 20px;
            > div {
                width: 200px;
            }
            .navmenu-container{
                .navbar{
                    line-height: 5vh;
                    height: 5vh;
                    .nav-div{
                        min-height: 5vh;
                        line-height: 5vh;
                        img.icon{
                            left:30px;
                            width: 2.2vh;
                            height: 2.2vh;
                        }
                        dd{
                            line-height: 4.5vh;
                            height: 5vh;
                            span{
                                font-size: 14px;
                            }
                        }
                        img.arrow{
                            display: none;
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
            }*/
        }
        .center-bom {
            /*flex: 5;*/
            /*height: 100%;*/
            overflow-x: scroll;
            overflow: hidden;
            margin-top: 10px;

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
            }
        }
    }
</style>
