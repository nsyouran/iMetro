// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    task_id: "",
    task_title: "",

    list: [
      // {
      //   "_id": 0,
      //   "product_name": "血压计",
      //   "product_type": "HEM-7121",
      //   "product_number": "L20191323LF"
      // }
    ]
  },
  _itemtap: function (env) {
    console.log(env.currentTarget.dataset.id)
  },


  _addtest: function () {
    wx.navigateTo({
      url: '/pages/addtest/addtest?task_id=' + this.data.task_id + '&task_title=' + this.data.task_title,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({ task_id: options.id,task_title: options.title})
    wx.setNavigationBarTitle({
      title: options.title,
    })
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
    console.log(this.data.task_id)
    const db = wx.cloud.database()
    const $ = db.command.aggregate
    db.collection("tests")
    .aggregate().sort({
      date: -1
    })
    .match({
      task_id: this.data.task_id
    })
    .project({
      _id: 1,
      product_name: 1,
      product_type: 1,
      product_number: 1,
      date: $.dateToString({
        date: '$date',
        // format: '%m月%d日 %H:%M',
        // format: '%m月%d日',
        format: '%H:%M',
        timezone: 'Asia/Shanghai'
      }),
      icon: "success",
    })
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