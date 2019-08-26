<template>
    <div class="visitor-set">
        <div class="set-top">
            <NavMenu :data="menuData" blocks="inline" dtPLeft="padding-left: 8px; font-size:15px;" :clickActive1="clickActive"
                     menuStyle="menuStyle" @click="clickMenu" actives="actives" :defArrow="defArrow"></NavMenu>
        </div>
        <div class="set-bottom">
            <router-view></router-view>
        </div>
    </div>
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
				defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
				menuData:[          //右侧导航数组
					{
						title: '楼宇/设备',
						value: 1,
						isSubShow: false,
						icon: require('../../../assets/images/stuRulesd_01.png'),
						iconActive: require('../../../assets/images/stuRuless_01.png')
					},
					{
						title: '访客通行证',
						value: 2,
						isSubShow: false,
						icon: require('../../../assets/images/stuRulesd_02.png'),
						iconActive: require('../../../assets/images/stuRuless_02.png')
					},
				],
				clickActive: sessionStorage.getItem('childMenuIndex')?sessionStorage.getItem('childMenuIndex'): 0,
			}
		},
		methods: {
			/**
			 *  @function: 楼宇添加按钮
			 *  @author: lxr
			 *  @date 2018-7-13
			 **/
			clickMenu(index, item) {
				// console.log('clickMenu', index, item)
				if (item.value == 1) {//
					this.$router.push('/VisitorDevices')      //楼宇/设备
				} else if (item.value == 2) {
					this.$router.push('/VisitorPass')            //访客通行证
				}
				sessionStorage.setItem('childMenuIndex',index);
			},
		},
		mounted() {
			/*setTimeout( ()=> {
				let icH = $('.index > .m-cen').height();
				let ttH = $('.visitor-set > .m-top').height();
				let obH = $('.operate-box').height();
				let pbH = $('.pagination-box').height();
				let tblH = icH - ttH - obH - pbH - 15 - 28;
				// console.log(666,icH,ttH,obH,pbH,tblH)
				$('.table-box').height(tblH)
			},5)*/
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .visitor-set {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .set-top{
            height:58px;
			line-height: 58px;
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
        }
        .set-bottom{
            margin-top: 10px;
        }
    }
</style>
