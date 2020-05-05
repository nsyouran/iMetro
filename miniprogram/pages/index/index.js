//index.js
const app = getApp()

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',

    tasks: []
  },
  _add_task: function(){
    wx.navigateTo({
      url: '/pages/addtask/addtask',
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo,
                logged: true
              })
            }
          })
        }
      }
    })
    this._getOpenid()

    
  },
  onShow: function(){
    console.log("show")
    let db = wx.cloud.database()
    const $ = db.command.aggregate
    db
      .collection("tasks")
      .aggregate()
      .sort({
        date: -1
      })
      .project({
        _id: 1,
        zsdw_name: 1,
        test_addr: 1,
        date: $.dateToString({
          date: '$date',
          format: '%m/%d %H:%M',
          timezone: 'Asia/Shanghai'
        })
      })
      .limit(5)
      .end()
      .then(res=>{
        console.log(res.list)
        this.setData({
          tasks: res.list
        })
    })
  },

  _getUserInfo: function(e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
      console.log(this.data.userInfo);
    }
  },

  _getOpenid: function() {
    // 调用云函数
    // console.log(app.globalData.openid)
    wx.getStorage({
      key: 'openid',
      success: function(res){
        // console.log("ok")
        app.globalData.openid = res.data
        // console.log(app.globalData.openid)
      },
      fail: function(){
        // console.log("no id")
        wx.cloud.callFunction({
          name: 'login',
          data: {},
          success: res => {
            // console.log('[云函数] [login] user openid: ', res.result.openid)
            app.globalData.openid = res.result.openid
            wx.setStorage({
              data: app.globalData.openid,
              key: 'openid',
            })  
            // console.log(app.globalData.openid)   
          },
          fail: err => {
            // console.error('[云函数] [login] 调用失败', err)
          }
        })
      }
    })
    
  },
  _go2test: function(){

  },


  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
