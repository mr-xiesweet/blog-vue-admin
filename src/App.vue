<template>
  <div id="app">
    <!--显示我们的内容-->
    <router-view></router-view>
  </div>
</template>

<script>


export default {
  methods:{

  }
}
</script>

<style>
  #app{
    min-width: 1140px;
  }
  *{
    padding: 0;
    margin: 0;
  }
  .margin-padding-20{
    padding: 10px;
  }
  .list-box-navigation{
    margin-top: 10px;
    float: left;
    position: fixed;
    bottom:0;

  }
  /*浮动*/
  .float-left{
    float: left;
  }
  .float-right{
    float:right;
  }
</style>
