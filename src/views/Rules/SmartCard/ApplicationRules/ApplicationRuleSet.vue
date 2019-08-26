<template>
    <el-container class="application-rule-set">
        <el-header class="setting-top">
			<ul>
				<li v-for="(item, index) in navData" @click="navClick(item)" :key="index" :class="{active:item.value == clickActive}">
					{{ item.title }}
					<img :src="defArrow">
				</li>
			</ul>
		</el-header>
        <el-main class="setting-bottom">
            <router-view></router-view>
        </el-main>
    </el-container>
</template>

<script>
	import Button from '@/components/Button/Button'
	import NavMenu from '@/components/NavMenu/NavMenu'
	export default {
		name: 'ApplicationRuleSet',
		components: {
			Button,NavMenu
		},
		data() {
			return {
                defArrow: this.$store.state.Common.defaultLineArrow,       //右侧导航默认箭头
                navData:[
					{
						title:'班牌内容设置',
						value: 0 ,
					},
					{
						title:'播放规则设置',
						value: 1 ,
					},
					{
						title:'登录密码设置',
						value: 2 ,
					}
				],//tab数据
				clickActive: sessionStorage.getItem('threeMenuIndex')?sessionStorage.getItem('threeMenuIndex'): 0,
			}
		},
		methods: {
            /**
			 *  @function: tab点击
			 *  @author: cs
			 *  @date 2018-12-12
			 */
			navClick(item){
				console.log('tab点击',item);
				if(item.value == 0){
					this.$router.push('/ContentSetting')
				}else if(item.value == 1){
					this.$router.push('/PlayRuleSetting')
                }else if(item.value == 2){
					this.$router.push('/PwdSetting')
                }
                this.clickActive = item.value;
                sessionStorage.setItem('threeMenuIndex',item.value);
            },
            /**
			 *  @function: 重新获取宽高
			 *  @author: cs
			 *  @date 2018-12-07
			 **/
			resizeLayout() {
				// setTimeout(() => {
				// 	let icH = $('.index > .m-cen').height();
				// 	let stH = $('.index .set-top').height();	
				// 	let ttH = $('.content-setting > .resource-top').height();
				// 	let tblH = icH - stH - ttH ;
				// 	console.log(66, icH, stH, ttH)
				// 	// $('.content-setting .label-list').height(tblH)
				// }, 50)
			},
		},
		mounted() {
			// this.resizeLayout();
		}
	}
</script>

<style type="text/scss" lang="scss" scoped>
    .application-rule-set {
        width: 100%;
        height: 100%;
        margin: 0 auto;
        .setting-top{
			min-height: 5vh;
			height: 5vh !important;
			line-height: 5vh;
			margin-bottom: 10px;
            padding: 0;
			background-color: #fff;
			overflow: hidden;
			ul{
				display: inline-block;
				width: 100%;
				min-width: 420px;
				li{
					float: left;
					width: 125px;
					text-align: center;
					color: #6C6C6C;
					font-size: 15px;
                    font-weight: bold;
					position: relative;
					cursor: pointer;
					&:nth-last-child(1){
						img{
							display: none;
						}
					}
					img{
						position: absolute;
						top: 0;
						bottom: 0;
						right: -10px;
						margin: auto;
						height: 20px;
					}
					span{
						font-weight: normal;
						font-size: 14px;
						margin-left: 3px;
					}
					&.active{
						color: #1cab7d;
						span{
							color: #6C6C6C;
						}
					}
				}
			}
		}
        .setting-bottom{
            padding: 0;
			overflow: hidden;
        }
    }
</style>
