// components/listItem/listItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // items: "rrrrrrrrr"
    item: {
      type: Object,
      value: {
        _id: 0,
        product_name: "多参数监护仪",
        product_type: "iMac8",
        product_number: "FF-18340215",
        date: "5月4日",
        icon: "success"
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    // name: "123"
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
