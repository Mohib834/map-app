<template>
        <label class="el-switch el-switch-blue">
            <input type="checkbox" name="switch" v-model="model" >
            <span class="el-switch-style"></span>
        </label>
</template>

<script>

  export default {
    props: {
      value: {
        type: [Number, String, Boolean],
        default: function () {
          return true;
        }
      },
    },
    data () {
      return {
      }
    },
    computed: {
      model: {
        // getter
        get: function () {
          return this.value;
        },
        // setter
        set: function (newValue) {
          this.$emit('input', newValue); // this will update the value prop (v-model).
        }
      }
    },
    methods:{

    },
    watch:{
    }
  }

</script>

<style scoped>

    /*
 * author:evanliu2968
 * github:https://github.com/EvanLiu2968/el-checkbox
 * lincense:MIT
 */


    /*switch component*/
    .el-switch,
    .el-switch-style,
    .el-switch-style:before {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }
    .el-switch {
        display: inline-block;
        font-size: 100%;
        height: 1.6em;
        position: relative;
    }
    .el-switch .el-switch-style {
        height: 1.6em;
        left: 0;
        background: #7f8891;
        -webkit-border-radius: 0.8em;
        border-radius: 0.8em;
        display: inline-block;
        position: relative;
        top: 0;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
        width: 3em;
        cursor: pointer;
    }
    .el-switch .el-switch-style:before {
        display: block;
        content: '';
        height: 1.4em;
        position: absolute;
        width: 1.4em;
        background-color: #fff;
        -webkit-border-radius: 50%;
        border-radius: 50%;
        left: 0.1em;
        top: 0.1em;
        -webkit-transition: all 0.3s ease-in-out;
        transition: all 0.3s ease-in-out;
    }
    .el-switch > input[type="checkbox"] {
        display: none;
    }
    .el-switch > input[type="checkbox"][disabled] + .el-switch-style {
        cursor: not-allowed;
        background-color: #D3DCE6;
    }
    .el-switch > input[type="checkbox"]:checked + .el-switch-style {
        background-color: #20a0ff;
    }
    .el-switch > input[type="checkbox"]:checked + .el-switch-style:before {
        left: 50%;
    }
    .el-switch > input[type="checkbox"]:checked[disabled] + .el-switch-style {
        background-color: #b0d7f5;
    }
    .el-switch.el-switch-blue > input[type="checkbox"]:checked + .el-switch-style {
        background-color: #38383f;
    }



</style>
