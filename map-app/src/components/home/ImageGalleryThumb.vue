<template>
    <div class="container1 " style="width:100%">
        <a class="mbox"   :title='location' :data-title="location" :data-desc="themeName" data-rel="gallery1">
<!--
        <a class="mbox"  :href="fullsizeUrl"  :title='location' :data-title="location" :data-desc="themeName" data-rel="gallery1">-->
            <v-img :aspect-ratio="aspectRatio"
                    :src="thumbUrl" alt="Avatar" class="image" ></v-img>
            <!--
            <div class="middle" :class="{'middle-open': captionShowing}">
                <div style="margin: 15px 15px;">

                    <div class="text text1 font-weight-medium" style="display: inline;">{{location}}</div>
                    <div style="margin-top: -10px; display: inline; float: right">
                        <div class="text text3" style="display: inline">{{themeName}}</div>
                        <img  class="themebutton1" :src="themeSvg">
                    </div>
                </div>
            </div>
            -->
        </a>
    </div>

</template>

<script>


  //https://dbrekalo.github.io/simpleLightbox/#section-Installation
  export default {
    name: "ImageGalleryThumb",
    props: {
      aspectRatio:{
      },
      thumbUrl: {
        type:String
      },
      fullsizeUrl: {
        type:String
      },
      location: {
        type:String
      },
      themeName: {
        type:String
      },
      themeSvg: {
        type:String
      }

    },
    computed:{
      captionShowing: function(){
        return this.$mq == 'mobile';
      }
    },
    mounted: function () {
      console.log('ImageGalleryMounted');
    }
  }
</script>
<style>
    .mobx{

    }
</style>

<style scoped>

    .mbox{
        cursor: default;
    }

    .themebutton1 {
        width: 26px;
        -webkit-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        -moz-box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.5);
        box-shadow: 1px 1px 2px 0px rgba(0,0,0,0.59);
        border-radius: 60px;
        margin-left: 12px;
        transform:  translateY(26%) rotate(45deg);

    }


    .container1:before {
        content: '';
        position: absolute;
        left:5%;
        height: 120px;
        width: 90%;
        bottom: 10px;
        opacity: 0.0;
        transition: opacity 0.3s ease-out;
        background: linear-gradient(to bottom, transparent 0%, transparent 70%);



    }
    .container1:hover:before {
        opacity: 1.0;
    }

    .container1 {
        position: relative;
        width: 100%;
        -webkit-box-shadow: 0px 10px 10px 0px rgba(0,0,0,0.0);
        overflow: hidden;
    }

    .image {
        opacity: 1;
        display: block;
        width: 100%;
        height: auto;
        transition: .5s ease;
    }

    .middle {
        transition: .3s ease;
        opacity: 0;
        position: absolute;
        bottom: 0px;
        left: 50%;
        width: 102%;
        transform: translate(-50%, 50px);
        -ms-transform: translate(-50%,50px);
        padding-left: 0px;
        text-align: left;
        color: white;
        background-color: #444444;
    }

    .middle-open {
        opacity: 1;
        transform: translate(-50%, 0px);
        -ms-transform: translate(-50%,0px);
    }

    .image .open {
        opacity: 1.0;
        -webkit-box-shadow: 1px 20px 20px 0px rgba(0,0,0,0.5);
    }

    .container1:hover .image {
        opacity: 1.0;
        -webkit-box-shadow: 1px 20px 20px 0px rgba(0,0,0,0.5);
    }

    .container1:hover .middle {
        opacity: 1;
        transform: translate(-50%, 0px);
        -ms-transform: translate(-50%,0px);
    }


    .text {
        font-size: 16px;
    }

</style>