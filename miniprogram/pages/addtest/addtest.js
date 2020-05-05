
const app = getApp()
Page({
  data: {
    task_id: "",
    searchShowed: false,
    searchVal: '',
    prod_old: [],

    instru: "",
    instrus: [
      "多参数监护仪",
      "电子血压计",
      "血压计",
      "输液泵",
      "注射泵",
    ],
    product_name: "",
    product_type: "",
    product_number: "",
    product_factory: "",
    test_data: ["","",""],

    footer_bottom: 0,
    footer_show: false
  },
  _showSearch: function () {
    // console.log("show")
    this.setData({
      searchShowed: true
    });
  },
  _hideSearch: function () {
      this.setData({
        searchVal: "",
        searchShowed: false
      });
  },
  _clearSearch: function () {
      this.setData({
        searchVal: ""
      });
  },
  _searchTyping: function (e) {
      this.setData({
        searchVal: e.detail.value
      });
      // console.log(this.data.searchVal);
      const db = wx.cloud.database();
      db.collection("prod_old").where({
        "product_number":  db.RegExp({
          regexp: this.data.searchVal
        })
      }).limit(3).get().then((res)=>{
        // console.log(res.data);
        this.setData({
          prod_old: res.data
        });
      });
  },
  _searchItemSelect: function(e){
    console.log(this.data.prod_old[e.currentTarget.dataset.index].product_number);
    this.setData({
      product_name: this.data.prod_old[e.currentTarget.dataset.index].product_name,
      product_type: this.data.prod_old[e.currentTarget.dataset.index].product_type,
      product_number: this.data.prod_old[e.currentTarget.dataset.index].product_number,
      product_factory: this.data.prod_old[e.currentTarget.dataset.index].product_factory,
      instru: this.data.prod_old[e.currentTarget.dataset.index].product_name
    });
    this._hideSearch();
  },
  _instrusChange: function(env){
    this.setData({
      instru: env.detail.value,
      product_name: this.data.instrus[env.detail.value]
    })
  },
  _more_test_data: function(){
    this.data.test_data.push("")
    this.setData({
      test_data: this.data.test_data
    })
  },
  _delete_test_data: function(env){
    console.log(env.currentTarget.dataset.id);
    if(this.data.test_data.length < 2){
      wx.showToast({
        "title": '不能没有数据',
        "icon": "clear"
      })
      return;
    }
    this.data.test_data.splice(env.currentTarget.dataset.id, 1)
    this.setData({
      test_data: this.data.test_data
    })
  },
  _save: function(){
    let submit = {};
    submit.product_name = this.data.product_name;
    submit.product_type = this.data.product_type;
    submit.product_number = this.data.product_number;
    submit.product_factory = this.data.product_factory;
    submit.task_id = this.data.task_id;
    submit.date = new Date();

    console.log(submit);

    let db = wx.cloud.database()
    db.collection("tests").add({data: submit}).then((res)=>{
      wx.showToast({
        title: '保存成功',
      })
    })
  },

  onLoad: function(options) {
    console.log(options.task_id)
    this.setData({ task_id: options.task_id })
    wx.setNavigationBarTitle({
      title: options.task_title,
    }) 
  },
  submit: function(env){
    // console.log
  },

  _input_focus: function(env){
    
    let height = (env.detail.height) +"px"
    console.log(height)
    this.setData({
      footer_bottom: height,
      footer_show: true
    })
  },
  _input_blur: function(){
    this.setData({
      footer_show: false
    })
  }
})
