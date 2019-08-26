<template>
    <div id="app">
        <router-view v-if="isRouterAlive"/>
    </div>
</template>

<script>
	export default {
		name: 'app',
		provide() {
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				isRouterAlive: true
			}
		},
		methods: {
			reload() {
				//页面尺寸变化时 不刷新页面 2018-09-19
				/* this.isRouterAlive = false
				// this.$nextTick(() => (this.isRouterAlive = true))*/

				//进行登录验证
				/* if(sessionStorage.getItem('userSerial') == null || sessionStorage.getItem('userName') == null){
					// alert('登录信息已过期，请返回登录页面')
					setTimeout( ()=> {
						this.$alert('登录信息已过期，请重新登录!', '提示', {
							confirmButtonText: '确定',
							callback: action => {
								this.$router.push('/')
							}
						});
					})
				}*/
			}
		},
        mounted(){
			this.$store.commit({
				type: 'SET_ROLEACTION_LIST',
				roleActions: localStorage.getItem('roleActions') ? JSON.parse(localStorage.getItem('roleActions')) : [],// 全局获取权限
			})
	        // window.onresize = () => { //监听窗口变化，刷新当前页面
		    //     this.reload();
	        // }
		},
		watch:{
			$route(to,from){
				// console.log("从哪来，到哪去 APP",from.name,to.name);
				if(to.name == 'CardMonitor'){
					this.noSunmenu = false;
				}else{
					this.noSunmenu = true;
				}
			}
		},
	}
</script>

<style type="text/scss" lang="scss">

    html, body {
        height: 100%;
        width: 100%;
        /*min-width: 1028px;*/
        overflow: hidden;
    }

    * {
        margin: 0;
        padding: 0;
        list-style: none;
        box-sizing: border-box;
    }

    #app {
        height: 100%;
        width: 100%;
    }
</style>
