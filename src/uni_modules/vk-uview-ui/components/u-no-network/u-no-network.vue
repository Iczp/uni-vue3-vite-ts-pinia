<template>
	<view class="u-no-network" v-if="!isConnected" :style="{'z-index': uZIndex}" @touchmove.stop.prevent="() => {}">
		<view class="u-inner">
			<image class="u-error-icon" :src="image" mode="widthFix"></image>
			<view class="u-tips">
				{{tips}}
			</view>
			<!-- 只有APP平台，才能跳转设置页，因为需要调用plus环境 -->
			<!-- #ifdef APP-PLUS -->
			<view class="u-to-setting">
				请检查网络，或前往<text class="u-setting-btn" @tap="openSettings">设置</text>
			</view>
			<!-- #endif -->
			<view class="u-retry" :hover-stay-time="150" @tap="retry" hover-class="u-retry-hover">
				重试
			</view>
		</view>
	</view>
</template>

<script>
	import getSystemInfoSync from '../../libs/function/getSystemInfoSync.js'
	/**
	 * noNetwork 无网络提示
	 * @description 该组件无需任何配置，引入即可，内部自动处理所有功能和事件。
	 * @tutorial https://www.uviewui.com/components/noNetwork.html
	 * @property {String} tips 没有网络时的提示语（默认哎呀，网络信号丢失）
	 * @property {String Number} zIndex 组件的z-index值（默认1080）
	 * @property {String} image 无网络的图片提示，可用的src地址或base64图片
	 * @event {Function} retry 用户点击页面的"重试"按钮时触发
	 * @example <u-no-network></u-no-network>
	 */
	export default {
		name: "u-no-network",
		props: {
			// 页面文字提示
			tips: {
				type: String,
				default: '哎呀，网络信号丢失'
			},
			// 一个z-index值，用于设置没有网络这个组件的层次，因为页面可能会有其他定位的元素层级过高，导致此组件被覆盖
			zIndex: {
				type: [Number, String],
				default: ''
			},
			// image 没有网络的图片提示
			image: {
				type: String,
				default: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAZAAAAEYCAMAAABFglBLAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0U3MjVFMzQwNEY1MTFFQUE4MTNDOUEzMTVBREMxQjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0U3MjVFMzUwNEY1MTFFQUE4MTNDOUEzMTVBREMxQjIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozRTcyNUUzMjA0RjUxMUVBQTgxM0M5QTMxNUFEQzFCMiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRTcyNUUzMzA0RjUxMUVBQTgxM0M5QTMxNUFEQzFCMiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkHIU9QAAAMAUExURdHW2OWiou7u7tve4dnc3/vw8N3g4sPCwvjn5+jo6M7Q0u6+vtyEhPXY2Li+wuikpPXW1uXo6dba3Pbg4Na5u+qurqqyt/HJydjb3fjo6LrAxO7Bwey1td6MjOrs7fbc3OTn6Maytf7+/vz19eqqqrzCxvzz87a8wLO6vuqxsf78/PDFxenr7L/FyNTY26+2u/z09MjMzqy0udnZ2dvb27G4vMjN0O7v8P339+Ll5u3v8NDS1ODj5frt7bC3vP76+u24uOKamtTW2MTIy9zc3N7e3vPQ0OCTk8DGyfDDw9LR0c7S1LussNbY2fPOztLU1cLHyrK6vvji4vrv78bKzPX29/np6crP0vjk5Ozu78bLzuepqczR1MHFyMDEyOq1tfTS0vP09cLIy9DU173Ex8bGxvHy88/U18vO0LK4vM7OzsTKzcPJzPLMzM/T1sbMz8HJy+7FxbW8wNTW18XKzvb3+MjLzczP0d3e3+Dh4r3Dxtna29zd3rK5vdPU1cfM0Prq6uOenuPm58HGyfHz8/ro6Lq/w8nO0bzCxcrKytjZ2uXm5vTU1LvBxbW7v+rp6eefn/39/eLi4u3t7Ozs7Pj4+Pr6+vX19fHx8erq6vPz8+Xl5ff39+fn5/v7+/z8/PLx8fX09Pb29ri4uOTk5PHw8OPj4/Py8ubm5vn5+e3s7Pb19fTz8/f29tfX1+7t7cvQ0+zr6/Ly8u3t7fr5+efm5quzuOvq6vT19uvr6/j5+a61uuy6uvb39/T09Ojn5+jq6621uvn6+t/i5KyzuPn4+Le+wvv6+s3S1fj4+fDw8OHk5vv7/Pr7++Xk5LS7v7y8vObl5fz9/ff4+OTj48DEx8XJy+Hk5euysu/x8re9wfn5+v38/Pv8/Pr6++vt7uLi4+Pi4ubl5uXk5dPV1tbV1fHMzNPX2e7u7ejn6PT19fX19PDw7/b29f39/vnr6+Hh4a+3u+7t7q61uePi48PHyf35+enp6fLz9PPz8qmxtuDg4N/f3/Dv7////////1cfN/UAAAEAdFJOU////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wBT9wclAAAlqElEQVR42uydCXwUVZrAk5CEJBAQshACCGyjIRwBJR0It6JBGZZBkRtm5PBgFXAXHBghqAMz6LjGTrd9n7lvwn0JQhARxYNxVJTMwcwOM+7uzK6Z3VXcrnTXVr2q6q7urrvfq26c+n4egXTSVfXv993veym4JkklKdoj0IBoogHRgGiiAdGAaKIB0YBoogHRgGiiAdFEA6IBUVuwx+vqet/v1YAkhxwmcNT9gvjnsAYkGcT7eN1TtThe+1TdL2o1IEkg+rrvUV90MF9oQBIqv6ijF4a3d51XA5J4jVVXx3z587ojGpDEm/QwkO9pQJJB2CvksAYk8fJUXT31xZG63ppRTwI5QgcgR35Rd1MDkgxSX1f31P33P1V3i3u936HUyc3edWSsjuEakKRRW3r9kVv+JrRsrwbklpKTnXs+z0wfONOtAUm8rJu55oqfkZ0TOzUgCZS3Zh7s54+S5RqQhNGYMsnPISkakCSiQcjkNzUgasvUDaVsBF1fb9GXd//B0ziliPzjEA2IujLqGRaMST+cawgLNpn4q30aEDV1Va+dYRqzNy00RMoYUmdpQNTzcb8sCtuKH8w9Z4iWLuIbVzQgapmOBedDOO6c0WjgENK2vKwBUUUmvBSiUbrqxwZuOU18d5MGhEe/dI6a2WvIxA0HX1hfvH7V8gUpA9Mz3x/VuVTRLxvwdAhH5aJjBj4hv39QAxIl743ITHm6azBPnOCfVLwlc6pR3upYFbLjvIuDlEUqRYZo38JYS4gVt5rNZhMQO46byksoMeG4w8QIjtvMpJA/wP1EdZ0bKvkitkh555mBA3zSLnBlSFnNnlJvEJJ95ItW3pJAamvtZhy3m/T0g7fhthJGiG+EviYgmEJ/wHFP6GsbnlZSoicoucxmGwHVguPTBz543C9LHky/Jnql1w5KxWGo8KsThsAFYneYMOb5mlnP11ZCrwOPjfgGI8RqsZuZtUOsFmbllFhZP+zEbc8vGcqzMibv7qos3rd7Mg+TrQv2vCVkiLYc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"
			}
		},
		data() {
			return {
				isConnected: true, // 是否有网络连接
				networkType: "none", // 网络类型
			}
		},
		computed: {
			uZIndex() {
				return this.zIndex ? this.zIndex : this.$u.zIndex.noNetwork;
			}
		},
		mounted() {
			this.isIOS = (getSystemInfoSync().platform === 'ios');
			uni.onNetworkStatusChange((res) => {
				this.isConnected = res.isConnected;
				this.networkType = res.networkType;
			});
			uni.getNetworkType({
				success: (res) => {
					this.networkType = res.networkType;
					if (res.networkType == 'none') {
						this.isConnected = false;
					} else {
						this.isConnected = true;
					}
				}
			});
		},
		methods: {
			retry() {
				// 重新检查网络
				uni.getNetworkType({
					success: (res) => {
						this.networkType = res.networkType;
						if (res.networkType == 'none') {
							uni.showToast({
								title: '无网络连接',
								icon: 'none',
								position: 'top'
							})
							this.isConnected = false;
						} else {
							uni.showToast({
								title: '网络已连接',
								icon: 'none',
								position: 'top'
							})
							this.isConnected = true;
						}
					}
				});
				this.$emit('retry');
			},
			async openSettings() {
				if (this.networkType == "none") {
					this.openSystemSettings();
					return;
				}
			},
			openAppSettings() {
				this.gotoAppSetting();
			},
			openSystemSettings() {
				// 以下方法来自5+范畴，如需深究，请自行查阅相关文档
				// https://ask.dcloud.net.cn/docs/
				if (this.isIOS) {
					this.gotoiOSSetting();
				} else {
					this.gotoAndroidSetting();
				}
			},
			network() {
				var result = null;
				var cellularData = plus.ios.newObject("CTCellularData");
				var state = cellularData.plusGetAttribute("restrictedState");
				if (state == 0) {
					result = null;
				} else if (state == 2) {
					result = 1;
				} else if (state == 1) {
					result = 2;
				}
				plus.ios.deleteObject(cellularData);
				return result;
			},
			gotoAppSetting() {
				if (this.isIOS) {
					var UIApplication = plus.ios.import("UIApplication");
					var application2 = UIApplication.sharedApplication();
					var NSURL2 = plus.ios.import("NSURL");
					var setting2 = NSURL2.URLWithString("app-settings:");
					application2.openURL(setting2);
					plus.ios.deleteObject(setting2);
					plus.ios.deleteObject(NSURL2);
					plus.ios.deleteObject(application2);
				} else {
					var Intent = plus.android.importClass("android.content.Intent");
					var Settings = plus.android.importClass("android.provider.Settings");
					var Uri = plus.android.importClass("android.net.Uri");
					var mainActivity = plus.android.runtimeMainActivity();
					var intent = new Intent();
					intent.setAction(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
					var uri = Uri.fromParts("package", mainActivity.getPackageName(), null);
					intent.setData(uri);
					mainActivity.startActivity(intent);
				}
			},
			gotoiOSSetting() {
				var UIApplication = plus.ios.import("UIApplication");
				var application2 = UIApplication.sharedApplication();
				var NSURL2 = plus.ios.import("NSURL");
				var setting2 = NSURL2.URLWithString("App-prefs:root=General");
				application2.openURL(setting2);
				plus.ios.deleteObject(setting2);
				plus.ios.deleteObject(NSURL2);
				plus.ios.deleteObject(application2);
			},
			gotoAndroidSetting() {
				var Intent = plus.android.importClass("android.content.Intent");
				var Settings = plus.android.importClass("android.provider.Settings");
				var mainActivity = plus.android.runtimeMainActivity();
				var intent = new Intent(Settings.ACTION_SETTINGS);
				mainActivity.startActivity(intent);
			}
		}
	}
</script>

<style lang="scss" scoped>
	@import "../../libs/css/style.components.scss";
	
	.u-no-network {
		background-color: #fff;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
	}

	.u-inner {
		height: 100vh;
		@include vue-flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: -15%;
	}

	.u-tips {
		color: $u-tips-color;
		font-size: 28rpx;
		padding: 30rpx 0;
	}

	.u-error-icon {
		width: 300rpx;
	}

	.u-to-setting {
		color: $u-light-color;
		font-size: 26rpx;
	}

	.u-setting-btn {
		font-size: 26rpx;
		color: $u-type-primary;
	}

	.u-retry {
		margin-top: 30rpx;
		border: 1px solid $u-tips-color;
		color: $u-tips-color;
		font-size: 28rpx;
		padding: 6rpx 30rpx;
		border-radius: 3px;
	}

	.u-retry-hover {
		color: #fff;
		background-color: $u-tips-color;
	}
</style>
