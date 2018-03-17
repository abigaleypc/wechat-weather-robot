## 项目启动

* `cd server` 
* `npm install` 
* `npm start`

## 输出结果

[点我](http://wechat.abigaleyu.co/public/sight.mp4)

## 实现过程 

### 准备工作

* [获取开发资格](https://mp.weixin.qq.com/debug/wxadoc/dev/)
* [下载开发工具](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/devtools.html)

### 安装并启动项目

* `git clone https://github.com/abigaleypc/wxapp-demo.git`
* 在`开发者工具`中添加以上demo，即可查看效果

<!--more-->

### 最终效果

<video src="https://github.com/abigaleypc/wxapp-demo/blob/master/wxapp.mp4?raw=true" controls="controls" autoplay="autoplay" loop="loop" style="width:50%;">
</video>

### 实现过程

> 该小程序主要由两个界面组成：好友列表 和 聊天窗口。

#### 文件介绍

* `.wxml`后缀是页面的结构文件
* `.js`后缀的是脚本文件
* `.json`后缀的文件是配置文件
* `.wxss`后缀的是样式表文件

#### “好友列表”界面

在`friends.wxml`中，显示好友列表

* 由 `<scroll-view>` 渲染可滚动视图区域，[官方文档 - scroll-view](https://mp.weixin.qq.com/debug/wxadoc/dev/component/scroll-view.html)
* 由 `wx:for` 进行列表渲染，[官方文档 - 列表渲染](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/list.html) 
* 数据绑定：在`friends.js`中定义需要绑定到页面的数据变量
* 页面跳转：`navigator`用于页面链接，此项目用于页面跳转至聊天窗口。[官方文档 - navigator](https://mp.weixin.qq.com/debug/wxadoc/dev/component/navigator.html)

```html
<view class="container">
  <view class="page-body">
    <scroll-view scroll-y="true" style="height: 900rpx;" bindscrolltoupper="upper" bindscrolltolower="lower" bindscroll="scroll" scroll-into-view="{{toView}}" scroll-top="{{scrollTop}}">
      <view wx:for="{{friends}}" wx:key="id">
        <navigator url="chat?id={{index+1}}" hover-class="navigator-hover" class="friend-item">
          <image class="avatar" src="{{item.avatarPath}}"/>
          <view class="name">{{item.name}}</view>
        </navigator>
      </view>
    </scroll-view>
  </view>
</view>

```

在 `friends.js` 中，渲染好友列表的逻辑在该文件实现，比如数据绑定，触发事件等

```JavaScript
Page({
  data: {
    greeting: 'hello',
    ... 
  },
  onLoad: function (options) {
  },
  onReady: function () {
    // Do something when page ready.
  },
  onShow: function () {
    // Do something when page show.
  },
  onHide: function () {
    // Do something when page hide.
  },
  onUnload: function () {
    // Do something when page close.
  },
  onPullDownRefresh: function () {
    // Do something when pull down.
  },
  onReachBottom: function () {
    // Do something when page reach bottom.
  },
  onShareAppMessage: function () {
    // return custom share data when user share.
  },
});
```

#### “聊天窗口”界面

在`chat.wxml`中，显示聊天记录

* 由 `wx:if` 进行条件渲染，判断每条聊天记录是来自本人还是好友，当是好友信息时显示在屏幕左边，否则显示在右边。[官方文档 - 条件渲染](https://mp.weixin.qq.com/debug/wxadoc/dev/framework/view/wxml/conditional.html)

```html
<view class="container">
  <view class="page-body">
    <scroll-view class="msg-list" enable-back-to-top scroll-y="true" scroll-top="{{scrollTop}}">
      <view wx:for="{{chatInfo.msg}}"  wx:key="$index">
        <view wx:if="{{item.type == 'friend'}}" class="friend">
         <view> <image class="avatar" src="{{chatInfo.userInfo.avatarPath}}"/></view>
         <view class="triangle">
          <view class="b-triangle f-b-triangle"></view>
          <view class="t-triangle f-t-triangle"></view>
         </view>
         <view class="item-msg">{{item.msg}}</view>
        </view>
        <view wx:else class="self">
         <view> <image class="avatar" src="{{chatInfo.userInfo.avatarPath}}"/></view>
         <view class="triangle">
          <view class="b-triangle s-b-triangle"></view>
          <view class="t-triangle s-t-triangle"></view>
         </view>
         <view class="item-msg">{{item.msg}}</view>
        </view>
      </view>
    </scroll-view>
    <view class="msg-input">
      <input class="send-input" auto-focus bindinput="msgContent" value="{{inputValue}}"/>
      <button class="send-btn" bindtap="sendMsg">发送</button>
    </view>
  </view>
</view>

```

#### 弹性布局

> 微信小程序界面布局与React Native一样，采用弹性布局(Flexbox)，Flex是Flexible Box的缩写，用来为盒状模型提供最大的灵活性。

Flex有三个常用属性：`flex-direction`, `justify-content` 和 `align-items` 

### 过程遇到的问题

* 微信小程序如果使用`input`，没办法想 `AngularJS` 或者 `VueJS`一样实现数据双向绑定，解决办法如下

```JS
// 页面结构
<view class="msg-input">
	<input class="send-input" auto-focus bindinput="msgContent" value="{{inputValue}}"/>
	<button class="send-btn" bindtap="sendMsg">发送</button>
</view>

// 脚本文件中获取页面中输入值
msgContent: function (e) {
	this.setData({
	inputValue: e.detail.value
	})
}

// 对页面输入值进行清空
sendMsg: function () {
	this.setData({
	inputValue: ''
	)
}
```

* 使用 `wx:for` 进行列表渲染，这个列表是可能被用户操作的，可能会报错，根据官方文档可查到

	> 如果列表中项目的位置会动态改变或者有新的项目添加到列表中，并且希望列表中的项目保持自己的特征和状态（如 `<input/>` 中的输入内容，`<switch/>` 的选中状态），需要使用 wx:key 来指定列表中项目的唯一的标识符。
	
	解决办法如下: 加上 `wx:key`
	
	```html
	<view wx:for="{{friends}}" wx:key="id">
	```

* 需要注意一点的是：微信小程序不能直接操作DOM，如 `document.getElementsByClassName('test');` 是错误的

