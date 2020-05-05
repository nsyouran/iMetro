
const app = getApp()
Page({
  data: {
    zsdw_name: "",
    test_addr: "",
  },
  _zsdw_input: function(env){
    this.setData({
      zsdw_name: env.detail.value,
    })
    console.log(this.data.zsdw_name)
  },
  _addr_input: function(env){
    this.setData({
      test_addr: env.detail.value,
    })
    console.log(this.data.test_addr)
  },
  _save: function(){
    let submit = {};
    submit.zsdw_name = this.data.zsdw_name;
    submit.test_addr = this.data.test_addr;
    submit.date = new Date();
    console.log(submit);
    if(submit.zsdw_name=="" || submit.test_addr==""){
      wx.showModal({
        title: "提示",
        content: "数据不得为空"
      })
      return
    }
    let db = wx.cloud.database()
    db.collection("tasks").add({data: submit}).then((res)=>{
      wx.showToast({
        title: '保存成功',
      })
      this.setData({
        zsdw_name: "",
        test_addr: ""
      })
    })
  },

  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }  
  }
})
