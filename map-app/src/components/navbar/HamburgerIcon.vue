<template>
    <div id="hamburger-toggle" :class="toggleClasses">
        <div id="hamburger">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <div id="cross">
            <span></span>
            <span></span>
        </div>
    </div>
</template>

<script>
  export default {
    props:{
      open: {
        type: [Boolean],
        default: false
      },
    },
    data () {
      return {
      }
    },
    computed: {
      toggleClasses(){
        return {open: this.open};
      }
    },
    mounted() {
    },
    watch: {

    }
  }
</script>


<style scoped>
    * {
        transition: .25s ease-in-out;
        box-sizing: border-box;
    }

    body {
        background: #d9e4ea;
    }

    span {
        display: block;
        background: #566973;
        border-radius: 2px;
    }

    #hamburger-toggle {
        width: 30px;
        height: 30px;
        margin: 0px;
        position: relative;
        cursor: pointer;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 5px;
    }
    #hamburger-toggle:hover {
        background: rgba(255, 255, 255, 0.8);
    }
    #hamburger-toggle #hamburger {
        position: absolute;
        height: 100%;
        width: 100%;
    }
    #hamburger-toggle #hamburger span {
        width: 25px;
        height: 2px;
        position: relative;
        top: 0px;
        left: 0px;
        margin: 5px 0;
    }
    #hamburger-toggle #hamburger span:nth-child(1) {
        transition-delay: .5s;
    }
    #hamburger-toggle #hamburger span:nth-child(2) {
        transition-delay: .625s;
    }
    #hamburger-toggle #hamburger span:nth-child(3) {
        transition-delay: .75s;
    }
    #hamburger-toggle #cross {
        position: absolute;
        height: 100%;
        width: 100%;
        transform: rotate(45deg);
    }
    #hamburger-toggle #cross span:nth-child(1) {
        height: 0%;
        width:  2px;
        position: absolute;
        top: 10%;
        left: 14px;
        transition-delay: 0s;
    }
    #hamburger-toggle #cross span:nth-child(2) {
        width: 0%;
        height: 2px;
        position: absolute;
        left: 10%;
        top: 14px;
        transition-delay: .25s;
    }

    #hamburger-toggle.open #hamburger span {
        width: 0%;
    }
    #hamburger-toggle.open #hamburger span:nth-child(1) {
        transition-delay: 0s;
    }
    #hamburger-toggle.open #hamburger span:nth-child(2) {
        transition-delay: .125s;
    }
    #hamburger-toggle.open #hamburger span:nth-child(3) {
        transition-delay: .25s;
    }
    #hamburger-toggle.open #cross span:nth-child(1) {
        height: 80%;
        transition-delay: .625s;
    }
    #hamburger-toggle.open #cross span:nth-child(2) {
        width: 80%;
        transition-delay: .375s;
    }



</style>