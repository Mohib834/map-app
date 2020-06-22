<!--
Row of option buttons
-->
<template>

    <div class="rowcontainer">
        <template v-for="(option, index) in options">
                <div  class="button" v-bind:class="{ active: (value == option.value), primary: (value == option.value)}" v-on:click="onClick(option.value)" >
                    {{option.label}}
                </div>
        </template>
    </div>

</template>

<script>
  export default {
    props: {
      value: {
        type: [Number, String, Boolean],
        default: function () {
          return 1;
        }
      },
      options: {
        type: Array,
        default: function () {
          return [{value: 1, label: "DEFAULT1"},{value: 2, label: "DEFAULT2"}];
        }
      }
    },
    data () {
      return {
      }
    },
    methods:{
      onClick : function(selectedValue)
      {
        //this.value= selectedValue;
        this.$emit('input', selectedValue); // this will update the value prop (v-model).
      }
    },
    watch:{

    }
  }
</script>

<style scoped>

    .rowcontainer{
        display: flex;
        flex-direction: row;
        height: 100%;
        width: 100%;
        margin: 5px 0px;
        justify-content: space-between;

    }


    .button{
        margin: 0px;
        padding-top: 10px;
        padding-bottom: 10px;
       /* flex-basis: 100%; */
        display: flex;
    /* flex-grow: 1;*/
    align-items: center;
    align-content: center;
    background: inherit;
    justify-content: center;
    color: #222222;
    border-radius: 40px;
    border: 1px solid #ffffff;
    font-size: 1.1em;
    height: 40px !important;;
    width: 40px !important;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;

}
.button:hover{
    background: #dddddd;
    cursor: pointer;
}

.active{

    color: #FFFFFF;
}
.active:hover {
    background: #07a3e5;
}

.gap{
    margin-left: 5px;
}

</style>
