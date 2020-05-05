// pages/task/task.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [""],
  },  
  _itemtap: function(env){
    // console.log(env.currentTarget.dataset)
    wx.navigateTo({
      url: '/pages/test/test?id='+env.currentTarget.dataset.id + '&title=' + env.currentTarget.dataset.title,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const db = wx.cloud.database()
    const $ = db.command.aggregate
    db.collection("tasks")
    .aggregate().sort({
      date: -1
    })
    .project({
      _id: 1,
      main: "$test_addr",
      secd: "$zsdw_name",
      date: $.dateToString({
        date: '$date',
        // format: '%m月%d日 %H:%M',
        format: '%m月%d日',
        timezone: 'Asia/Shanghai'
      }),
      icon: "success",
    }).limit(10)
    .end().then(res=>{
      console.log(res)
      this.setData({ list: res.list})
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading()
    const db = wx.cloud.database()
    const _ = db.command
    const $ = db.command.aggregate
    db.collection("tasks")
    .aggregate()
    .sort({
      date: 1
    })
    .limit(1)
    .project({
      _id: 1,
      main: "$test_addr",
      secd: "$zsdw_name",
      date: $.dateToString({
        date: '$date',
        // format: '%m月%d日 %H:%M',
        format: '%m月%d日',
        timezone: 'Asia/Shanghai'
      }),
      icon: "success",
    })
    .end().then(res=>{
      console.log(res)
      if(res.list[0]._id == this.data.list[0]._id){
        console.log("==")
      }else{
        this.data.list.unshift(res.list[0])
        this.setData({list: this.data.list})
      }
      wx.hideNavigationBarLoading()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})