<template>
  <div >

    <template v-if="showThemeEditorTools">
      <PreviewExportTool></PreviewExportTool>
      <BlendTool></BlendTool>
      <ColourEditor></ColourEditor>
      <colour-extract-tool></colour-extract-tool>
      <ThemeEditor v-on:change="onThemeRefresh()"></ThemeEditor>
    </template>

    <MockupModal ref="mockupModal"></MockupModal>

    <ItemAddedModal ref="itemAddedModal"></ItemAddedModal>
    <!--
    <Navbar></Navbar>
-->
    <ErrorModal
            v-model="errorModalShowing"
            :message="errorModalMessage"
    ></ErrorModal>



    <EditorBase ref="editorbase" id="root" @onResizeContentToFit="onResizeContentToFit"  :showBottom="!mapWidgetLoading" contentBackgroundColour="rgb(240, 238, 232)">

      <template slot="contentOverlay">
        <img v-show="showFrame && !mapWidgetLoading && !isMobile" id="leaf" class="leaf"   :class="{ 'fadeInLeaf': fadeInLeaf}" style="position: absolute; " src="/static/assets/editor/leaf.png"  />
      </template>

      <template slot="underMapCenter">

          <template v-if="isMobile">
            <v-layout row style="width:100%" align-center v-if="!mapWidgetLoading">
              <v-btn  outline  flat round  color="secondary" style="margin-top: 6px; text-transform: none; font-size: 1.2em; padding-left: 20px; padding-right: 15px; border-color: #aaaaaa" @click="gotoPreviewCreatePage()">
                Edit Area
                <v-icon size="20" style="margin-left: 5px" >mdi-pencil</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <!--
              <HelpButton  @click.native="runTour()" :size="36" ></HelpButton>
              -->
            </v-layout>
          </template>
          <template v-else=""> <!-- desktop-->
            <v-layout row style="width:100%" align-center  justify-center v-if="!mapWidgetLoading">
             <!--
              <div style="font-size: 16px; margin-top: 20px" class="noselect">{{currentThemeLabel}} </div><ThemeIcon :size="22" style="display: inline; margin-left: 10px; margin-top: 15px" :theme="currentTheme"></ThemeIcon>
              -->
              <div id="framepreview" style="font-size: 16px; margin-top: 18px" class="noselect">

                <template v-if="showFramePreviewUI">

                  <!--
                   <v-switch
                           color="primary"
                           label=""
                           v-model="showFrame"
                           style="margin-top: 15px; margin-bottom: -20px; "
                           @click.native="onPreviewMapChangeEvent"
                           v-ga="$ga.commands.trackBorder.bind(this, border)"
                   ></v-switch>-->
                  <v-layout row>
                  <ToggleButton v-model="showFrame"></ToggleButton>
                  <label @click="showFrame = !showFrame" class="noselect  labelblock" style="margin-right: 10px; font-size:16px; color: #2A2A2A; margin-top: 0px; ; float: left;  cursor: pointer; font-weight: normal; font-style: normal;  text-decoration: none;">{{ (showFrame)? 'Frame Preview': 'Frame Preview' }}</label>

                  <HelpButton style="margin-top: 2px" @click.native="runTour(5)"></HelpButton>
                  </v-layout>

                </template>
                <!--
                <div v-else="" style="font-style: normal; color: #444444">
                  {{labelForCurrentPrintSize + ""}}
                </div>
                -->
              </div>



            </v-layout>

            <!-- colour button test-->
            <!--
            <v-speed-dial
                    v-model="backgroundColourOption"
                    
                    direction="top"
                    transition="scale-transition"
            >
              <template v-slot:activator>
                <v-btn
                        v-model="backgroundColourOption"
                        color="blue darken-2"
                        dark
                        fab
                        small
                >
                  <v-icon>mdi-pencil</v-icon>
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <v-btn
                      fab
                      dark
                      small
                      color="green"
              >

              </v-btn>
              <v-btn
                      fab
                      dark
                      small
                      color="indigo"
              >

              </v-btn>
              <v-btn
                      fab
                      dark
                      small
                      color="red"
              >

              </v-btn>
            </v-speed-dial>
            -->

          </template>
      </template>
      <template slot="sidebar-main">

        <div v-show="themeDescriptionPopUpShowing"  :style="themeDescriptionStyle" :class="{'themeDescriptionPopUpFadeOut':themeDescriptionPopUpFadeOut }" style="transition-property: top; transition-duration: 0.5s; position: absolute; top: 300px; left: 310px; width: 300px">
          <ThemeDescriptionPopUp  :themeID="themeHoverID"></ThemeDescriptionPopUp>
        </div>
        <PanelHeader  step=1 text="Edit Area" icon="" clickable  @click.native="gotoPreviewCreatePage()">
          <template slot="right">
            <v-icon dark color="grey">mdi-pencil</v-icon>
          </template>
        </PanelHeader>
        <PanelHeader topBorder step=2 text="Edit Style" icon="">
          <template slot="right">

            <HelpButton @click.native="runTour()"  ></HelpButton>

          </template>
        </PanelHeader>

        <div class="">


        <AccordianPanel buttonID="accordian-theme-button" ref="accordian-theme" heading="Theme" @click="accordianButtonClicked('accordian-theme')">
          <template slot="content">
              <!--
                        themeID: <input type="number" name="themeid" v-model="themeID" @change="onThemeIDChangeEvent"></br>
              -->
            <div id="colourscheme">

              <v-layout row class="labelblock" style="margin-top: 10px; margin-left: 5px; margin-bottom: 0px">
                <label class="" style=""> {{currentThemeLabel}}</label>
                <HelpButton @click.native="runTour(1)"></HelpButton>
              </v-layout>

              <div style="width:100%;display: flex">
                <!--
                <ThemeSelectorGrid   slot="activator" ref="themeSelectorGrid" style="margin-top: 5px" :themeID="themeID" @input="changeThemeTracked($event)" tooltips :themePageRows="6" :themePageCols="5" ></ThemeSelectorGrid>
                -->
                <ThemeSelectorGrid   slot="activator" ref="themeSelectorGrid" style="margin-top: 5px" :themeID="themeID" @input="changeThemeTracked($event)" @onThemeMouseEnter="onThemeMouseEnter($event)" @onThemeMouseLeave="onThemeMouseLeave($event)" :tooltips="false" :themePageRows="7" :themePageCols="6" ></ThemeSelectorGrid>
              </div>
            </div>
            <div class="">
              <v-layout row justify-center align-center style="margin-left: 5px; margin-top: 5px; font-size: 1.1em">
                <!--
                <label style="display: inline" > Color Scheme</label>
                -->
                <!--
                <v-flex shrink>
                  <label style="display: inline; color: #666666;">{{ currentThemeLabel }} </label>
                </v-flex>
                -->
              </v-layout>
            </div>

            <!--
            <div id="variation" style="width:100%;display: flex">
              <RandomiseButton  :maxVariation="maxVariation" :variation="variation" @click="randomiseThemeColours()"></RandomiseButton>
            </div>
            -->
            <div id="variation" style="margin-top: -10px; margin-left: 5px; margin-right: 5px">
              <v-layout row class="labelblock">
                <label class="" style=""> Color Variant</label>
                <HelpButton @click.native="runTour(2)"></HelpButton>
              </v-layout>
            <!--
            <RandomiseButtonRow :maxVariation="maxVariation" :variation="variation" ></RandomiseButtonRow>
            -->
              <VariantOptions :options="variationOptions" v-model="variation" style="margin-top: 10px"> </VariantOptions>
            </div>

            <!-- testing start -->
            <template v-if="showThemeEditorTools">
              <OpenContainerButton  label="Editor Tools" containerID="themeEditor"> </OpenContainerButton>
              <OpenContainerButton  label="Export Tools" containerID="previewExport"> </OpenContainerButton>

            </template>
              <!-- testing end -->



            <!--
            <hr/>
            <div id="water" class="flexrow">
              <label > Water </label >
              <ColourButton @click="setWaterColourEvent" :colour="colourSchemeWaterColour"> </ColourButton>
              <ColourButton @click="setWaterColourEvent" :colour="[50,50,50]"> </ColourButton>
              <ColourButton @click="setWaterColourEvent" :colour="[255,255,255]"> </ColourButton>
            </div>
            <hr/>
            -->
            <!--
            <div class="flexrow" >
              <label> Road </label>
              <ColourButton @click="setRoadColourEvent" :colour="colourSchemeRoadColour"> </ColourButton>
              <ColourButton @click="setRoadColourEvent" :colour="[50,50,50]"> </ColourButton>
              <ColourButton @click="setRoadColourEvent" :colour="[255,255,255]"> </ColourButton>
            </div>
            -->
            <!--
            <div class="flexrow-wrap">
              <div class="item" v-for="(value,index) in (nColoursInTheme-2)">
                <input class="item" type='text' :id="'colourInput' + index"  />
              </div>
              </br>

            </div>
            -->
              <!--
              <input type="number" name="txt" v-model="mapVariation" v-on:change="onVariationChangeEvent"></br>
              -->
          </template>
        </AccordianPanel>
        <!--
                <AccordianPanel ref="accordian-text" heading="Text" @click="accordianButtonClicked('accordian-text')">
                  <template slot="content">
                      <label class="labelblock"> Style</label>
                      <OptionRow :options="textStyleOptions" v-model="styleID" @click.native="onPreviewMapChangeEvent"> </OptionRow>
                      <label class="labelblock">Primary Text</label>
                      <input type="text" v-model="text1" v-on:keyup="onPreviewMapChangeEvent"></br>
                  </template>
                </AccordianPanel>
        -->

        <AccordianPanel buttonID="accordian-border-button" id="bordersection" ref="accordian-border" heading="Border" @click="accordianButtonClicked('accordian-border')">
          <template slot="content">

            <div id="border">

              <!--
              <label class="labelblock" style="float:left; margin-top: 3px;"> Border</label>
              <ToggleButton v-model="border"></ToggleButton>
              -->
              <!--
                            <v-switch
                                    color="primary"
                                    label=""
                                    v-model="border"
                                    style="margin-top: 15px; margin-bottom: -20px; "
                                    @click.native="onPreviewMapChangeEvent"
                                    v-ga="$ga.commands.trackBorder.bind(this, border)"
                            ></v-switch>
                            -->


              <v-layout row class="labelblock" style="margin-top: 10px;">
                <label class="" style="">  Inner White Border</label>
                <HelpButton @click.native="runTour(3)"></HelpButton>
              </v-layout>
              <OptionRow :options="borderOptions" v-model="border" style="margin-top: 10px"> </OptionRow>

            </div>

            <!--
            <label class="labelblock"> Border </label> <input type="number" v-model="borderSize" @change="onPreviewMapChangeEvent"></br>-->

          </template>
        </AccordianPanel>

          <AccordianPanel buttonID="accordian-text-button" id="textstylpanele" ref="accordian-text" heading="Text" @click="accordianButtonClicked('accordian-text')">
            <template slot="content">

              <!--
              <div id="border">

                <label class="labelblock" style="float:left; margin-top: 3px;"> Border</label>
                <v-switch
                        color="primary"
                        label=""
                        v-model="border"
                        style="margin-top: 15px; margin-bottom: -20px; "
                        @click.native="onPreviewMapChangeEvent"
                        v-ga="$ga.commands.trackBorder.bind(this, border)"
                ></v-switch>
              </div>
              -->
              <!--
              <label class="labelblock"> Border </label> <input type="number" v-model="borderSize" @change="onPreviewMapChangeEvent"></br>-->

              <div id="textstyle">
                <v-layout row class="labelblock" style="margin-top: 10px;">
                  <label class="" style=""> Text Style</label>
                  <HelpButton @click.native="runTour(4)"></HelpButton>
                </v-layout>
              <OptionRow :options="textStyleOptions" v-model="styleID" style="margin-top: 10px"> </OptionRow>



                <v-text-field
                        style="margin-top: 20px;"
                        v-model="text1"
                        :class="{ disabledText: textFieldsDisabled}"
                        maxlength=30
                        outline
                        label="Title"
                        placeholder=""
                        :disabled="textFieldsDisabled"
                ></v-text-field>

                <v-text-field
                        style="margin-top: -10px"
                        maxlength=50
                        v-model="text2"
                        :class="{ disabledText: textFieldsDisabled}"
                        outline
                        label="Subtitle"
                        placeholder=""
                        :disabled="textFieldsDisabled"

                ></v-text-field>

                <v-text-field
                        style="margin-top: -10px"
                        maxlength=50
                        v-model="text3"
                        :class="{ disabledText: textFieldsDisabled}"
                        outline
                        label="Tag Line"
                        placeholder=""
                        :disabled="textFieldsDisabled"
                        append-icon="mdi-refresh"
                        @click:append="resetTagLineToCoords()"
                >
                </v-text-field>
              </div>




            </template>
          </AccordianPanel>


        </div>
        <!--
               <AccordianPanel ref="accordian-preview" heading="Preview" @click="accordianButtonClicked('accordian-preview')">
                 <template slot="content">

                 <v-checkbox
                   color="blue"
                   label="Show Frame"
                   v-model="showFrame"
                   @click.native="onPreviewMapChangeEvent"
                 ></v-checkbox>
                 </template>
               </AccordianPanel>


               -->
      </template>



      <template  slot="sidebar-bottom">

        <div id="addtocart" :class="{'pulse': showButtonPulse }" style="width: 100%">

          <PanelHeader   :text="(isUpdateMode)? 'Update'  : 'Add to Cart' " icon="" bottomButton   @click.native="addToCart()">
            <template slot="right">

              <v-progress-circular v-if="addToCartLoading" indeterminate color='white' :size="24"  :width="2" ></v-progress-circular>
              <div v-else="" style="display: inline-block; ">{{$store.getters.priceForCurrentMapWithCurrencyString}}</div>
            </template>
          </PanelHeader>

          <!--
          <v-btn   @click="addToCart()"  flat class=" cartbutton hero title font-weight-light"    :loading="addToCartLoading" block dark large >
            <div v-if="isAddMode || isCityMode || isExampleMapMode">
              <div style="display: inline-block; margin-right: 20px">Add to Cart</div>
              <div style="display: inline-block; ">{{$store.getters.priceForCurrentMapWithCurrencyString}}</div>
            </div>
            <div v-else="isUpdateMode">
              Update
              <v-icon v-if="showAddButtonIcon"  right>mdi-content-save</v-icon>
            </div>
          </v-btn>
          -->
        </div>

      </template>
      <template slot="content">



        <div class="text-xs-center" v-if="mapWidgetLoading" style="margin-top:10px"  >
          <!--
          <v-progress-circular
                  :size="(isMobile) ? 60 : 80"
            indeterminate
            color="primary"
          ></v-progress-circular>-->

          <SpinnerLoader ref="spinnerLoader" :size="(isMobile) ? 60 : 100"> </SpinnerLoader>
        </div>

        <div id="previewContainer" >  <!-- some padding for the shadow -->


          <MapWidget
                    title = "Click to change variant"
                    @click.native="onMapWidgetClick()" v-show="!mapWidgetLoading" ref="mapWidget" id="scaledCanvas"  class="map-canvas"  :class="{'map-canvas-black-frame-adjust': showFrame}"
                     :printSizeID="printSizeID"
                     :orientationID="orientationID"
                     :variation="variation"
                     :segmentColours="segmentColours"
                     :waterColour="waterColour"
                     :roadColour="roadColour"
                     :border="border"
                     :styleID="styleID"
                     :text1="text1"
                     :text2="text2"
                     :text3="text3"

                     :showFrame="showFrame"
                     bgColour="#eeeeee"
                     v-on:resize="onMapWidgetResize"
                     v-on:init="onMapWidgetInit"
                     v-on:mapLoaded="onMapWidgetLoaded"

          ></MapWidget>

          <!--
          <div id="textLayer" :style="styleFrameCSSStyle">

            <template v-if="styleID == 1">
              <div style="  display: flex; flex-direction: column; justify-content: flex-end; height: 100%; padding-bottom: 0px; padding-left: 0px; padding-right: 0px ">
                <div style="background-color: #FFFFFF; padding: 10px 10px 50px 10px;align-items: center; width: 100%; height: 45px">
                  <div style="  display: flex; flex-direction: row; justify-content: space-between  ">
                    <div style="  display: flex; flex-direction: column;justify-content: flex-start ">
                      <div class="noselect"  style="font-size: 1.6em; text-align: left; ">{{text1}} </div>
                    </div>
                    <div style="  display: flex; flex-direction: column;  ">
                      <div class="noselect"  :v-show="text2 != ''"  style="font-size: 1.0em; text-align: right; ">{{text2}}</div>
                      <div class="noselect"  style="font-size: 0.6em; text-align: right; ">{{text3}}</div>
                    </div>
                  </div>
                </div>
              </div>

            </template>
            <template v-else-if="styleID == 2">
              <div style="  display: flex; flex-direction: column; justify-content: flex-end; height: 100%; padding-bottom: 55px">
                <div style="  display: flex; justify-content: center;  ">
                  <div style="background-color: #FFFFFF; padding: 5px 30px 5px 30px;align-items: center;">
                    <div class="noselect" style="font-size: 1.3em; text-align: center; ">{{text1}} </div>
                    <div class="noselect" style="font-size: 0.8em; text-align: center; ">{{text2}}</div>
                    <div class="noselect" style="font-size: 0.6em; text-align: center; ">{{text3}}</div>
                  </div>
                </div>
              </div>
            </template>
          </div>

-->

        </div>

      </template>
      <template slot="content-bottom">

        <v-layout v-if="isMobile" column >

          <MobileTabBar :tabData="tabData" v-model="activeTabIndex" @onTabClicked="onTabClicked()">
            <template slot="right">

              <!--
              <v-layout row align-center justify-end>
                <v-flex shrink >
                  <HelpButton shrink @click.native="runTour()" ></HelpButton>
                </v-flex>
              </v-layout>
              -->
              <div :class="{'pulse': showButtonPulse }"  style="">
                <v-btn id="addtocartMobile"  @click="addToCart()" :disabled="(!hasMapBeenEdited && isUpdateMode) || assetsLoading" flat class="hero cartbuttonmobile" :loading="addToCartLoading" block dark large >
                  <div v-if="isAddMode || isCityMode || isExampleMapMode">
                    <v-layout column>
                      <div>Add  </div>
                      <div style="font-weight: normal">{{$store.getters.priceForCurrentMapWithCurrencyString}}</div>
                    </v-layout>
                    <!-- <v-icon  right>mdi-cart-plus</v-icon> -->
                  </div>
                  <div v-else="isUpdateMode">
                    <v-layout column>
                      <div>Update  </div>
                      <div style="font-weight: normal">{{$store.getters.priceForCurrentMapWithCurrencyString}}</div>
                    </v-layout>
                  </div>

                </v-btn>
              </div>
            </template>
          </MobileTabBar>

          <v-tabs-items v-model="activeTabIndex" vertical>
            <v-tab-item key="0">
              <!-- empty item for when nothing is selected, 0 height so it collapses itself -->
              <div ref="tabcontent0" style="height: 0px; padding: 0px; margin: 0px"></div>
            </v-tab-item>
            <v-tab-item key="1">
              <v-card flat ref="tabcontent1">
                <v-card-text  class="tab-content">
                  <v-layout column>
                    <div  style="width:100%;display: flex; margin-right: -10px">
                      <ThemeSelectorGrid   slot="activator" ref="themeSelectorGrid" style="margin-top: 5px" :themeID="themeID" @input="changeTheme($event)" :themePageRows="3" :themePageCols="5" :showNavigation="true"></ThemeSelectorGrid>
                    </div>
                    <!--

                                        <div class="">
                                          <v-layout row justify-center align-center style="margin-left: 5px; margin-top: 5px; font-size: 1.1em">
                                            <label style="display: inline" > Color Scheme</label>
                                            <v-flex shrink>
                                              <label style="display: inline; color: #666666;">{{ currentThemeLabel }}   </label>
                                            </v-flex>
                                          </v-layout>
                                        </div>
                                        -->
                    <!--
                    <div style="width:100%;display: flex; padding: 10px">
                      <RandomiseButton  :maxVariation="maxVariation" :variation="variation" @click="randomiseThemeColours()"></RandomiseButton>
                    </div>
                      -->
                    <!--
                    <RandomiseButtonRow :maxVariation="maxVariation" :variation="variation" ></RandomiseButtonRow>-->

                    <label class="labelblock" style="margin-top: 10px;padding-left: 10px;padding-right: 10px"> Variant</label>
                    <!--
                    <RandomiseButtonRow :maxVariation="maxVariation" :variation="variation" ></RandomiseButtonRow>
                    -->
                    <OptionRow :options="variationOptions" v-model="variation" style="margin-top: 10px;padding-left: 10px;padding-right: 10px"> </OptionRow>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="2">
              <v-card flat  ref="tabcontent2">
                <v-card-text class="tab-content">
                  <v-layout column style="padding: 10px">
                    <OptionRow :options="textStyleOptions" v-model="styleID" style="margin-top: 0px"> </OptionRow>

                    <div >
                      <label class="labelblock" style="margin-top: 20px;"> Text</label>

                      <v-text-field
                              style="margin-top: 10px;"
                              v-model="text1"
                              :class="{ disabledText: textFieldsDisabled}"
                              maxlength=30
                              outline
                              label="Title"
                              placeholder=""
                              :disabled="textFieldsDisabled"
                      ></v-text-field>

                      <v-text-field
                              style="margin-top: -10px"
                              maxlength=50
                              v-model="text2"
                              :class="{ disabledText: textFieldsDisabled}"
                              outline
                              label="Subtitle"
                              placeholder=""
                              :disabled="textFieldsDisabled"

                      ></v-text-field>

                      <v-text-field
                              style="margin-top: -10px"
                              maxlength=50
                              v-model="text3"
                              :class="{ disabledText: textFieldsDisabled}"
                              outline
                              label="Tag Line"
                              placeholder=""
                              :disabled="textFieldsDisabled"

                      ></v-text-field>
                    </div>

                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item key="3">
              <v-card flat  ref="tabcontent3">
                <v-card-text  class="tab-content">
                  <v-layout column style="padding: 10px">
                    <div >
                      <!--
                      <label class="labelblock" style="margin-top: 5px;"> Border</label>
                      <v-checkbox
                              color="blue"
                              label="White Border"
                              v-model="border"
                              style="margin-top: 5px;"
                              @click.native="onPreviewMapChangeEvent"
                      ></v-checkbox>-->
                      <label class="labelblock" style="margin-top: 10px;"> Inner White Border</label>
                      <OptionRow :options="borderOptions" v-model="border" style="margin-top: 10px"> </OptionRow>

                    </div>
                  </v-layout>
                </v-card-text>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

        </v-layout>
      </template>

    </EditorBase>

    <!-- MOBILE BOTTOM TABS -->

    <template v-if="isMobile">

    </template>

  </div>
</template>

<script>



  /////////////////////////


  import ColourExtractTool from "../components/editor/ColourExtractTool";
  var _model;

  import currentMapDataMixin from '../mixins/currentMapDataMixin.js'
  import utilsMixin from "../mixins/utilsMixin";

  import PanelHeader from '../components/common/PanelHeader.vue'
  import OptionRow from '../components/common/OptionRow.vue'
  import ThemeSelectorGrid from '../components/editor/ThemeSelectorGrid.vue'
  import ColourButton from '../components/editor/ColourButton.vue'
  import CartButton from '../components/navbar/CartButton.vue'
  import RandomiseButton from '../components/editor/RandomiseButton.vue'
  import EditorBase from '../components/common/EditorBase.vue'
  import ItemAddedModal from '../components/editor/ItemAddedModal.vue'
  import HelpButton from '../components/common/HelpButton.vue'
  import {mapGetters} from 'vuex'
  import {mapActions} from 'vuex'
  import MapWidget from '../components/common/MapWidget.vue'
  import BottomSheet from "../components/common/BottomSheet";
  import MobileTabBar from "../components/common/MobileTabBar";
  import  commonGlobals from '../../../common/commonGlobals'
  import AccordianPanel from '../components/common/AccordianPanel.vue'
  import SpinnerLoader from '../components/common/SpinnerLoader'
  import ThemeIcon from '../components/editor/ThemeIcon'
  import MockupModal from '../components/editor/MockupModal'
  import ToggleButton from '../components/common/ToggleButton'
  import ThemeEditor from '../components/editor/ThemeEditor'
  import ColourEditor from '../components/editor/ColourEditor'
  import BlendTool from '../components/editor/BlendTool'
  import PreviewExportTool from '../components/editor/PreviewExportTool'
  import ErrorModal from '../components/common/ErrorModal'

  //const html2canvas = require('html2canvas');
  import {bus} from "../main"
  import OpenContainerButton from "../components/editor/OpenContainerButton";
  import RandomiseButtonRow from "../components/editor/RandomiseButtonRow";
  import VariantOptions from "../components/editor/VariantOptions";
  import ThemeDescriptionPopUp from "../components/editor/ThemeDescriptionPopUp";
  const localStore = require('../utils/localStore');

  const axios = require('axios');
  const apiURL = 'api';

  var _themeHoverTimeoutID = null;
  var _themeHoverHideTimeoutID = null;

  export default {
    mixins: [currentMapDataMixin, utilsMixin],
    components: {
      ThemeDescriptionPopUp,
      VariantOptions,
      RandomiseButtonRow,
      OpenContainerButton,
      ColourExtractTool,
      MockupModal,
      ThemeIcon,
      CartButton,
      ColourButton,
      OptionRow,
      ThemeSelectorGrid,
      RandomiseButton,
      EditorBase,
      ItemAddedModal,
      MapWidget,
      PanelHeader,
      HelpButton,
      BottomSheet,
      MobileTabBar,
      AccordianPanel,
      SpinnerLoader,
      ToggleButton,
      ThemeEditor,
      ColourEditor,
      BlendTool,
      PreviewExportTool,
      ErrorModal
    },
    props: {
      showThemeEditorTools:{
        type: [Boolean],
        default: function(){
          return false; // set to true for debuggin
          //return false;

        }
      },
      sampleImageNameRoute:{
        type: [String],
        default: function(){
          return "sampleMapLondon";
        }
      },
      useSampleBasemapRoute:{
        type: [Number,String, Boolean],
        default: function(){
          return false;
        }
      },
      route_mapID: {
        type: [Number,String],
        default: null
      },
      route_basemapImageData: {
        type: [ImageData],
        default: null
      },
      route_basemapID: {
        type: [Number,String],
        default: null
      },
      // this is for viewing premade examples (from the explore section)
      route_exampleMapID: {
        type: [Number,String],
        default: null
      }
      /*
        basemapIDRoute: {
          type: String,
          default: null
        },
        // optional mapIndex coming from the url route - this will be for update mode only.
        updateMode_mapIndex: {
          type: [Number,String],
          default: null
        },
        // basemapID is not null if a new basemap has generated to try out  - this state loads in the settings nad replaces the bamemap with this temp one.
        updateMode_basemapID:{
          type: [Number,String],
          default: null
        },
        // optional cityID coming from the url route - this will be for city Mode only.
        cityMode_cityID: {
          type: [Number,String],
          default: null
        },
      // load in an premade example map with specific theme
        exampleMapMode_mapID : {
          type: [Number,String],
          default: null
        }*/
    },
    data() {
      return {
        themeHoverPositionY: 10,
        themeHoverID : null,
        themeDescriptionPopUpFadeOut: false,
        themeDescriptionPopUpShowing : false,
        fadeInLeaf: false,
        mapContainerContainerRect: null,

        errorModalShowing: false,
        errorModalMessage:"",
        showFramePreviewUI: true,  // disable the toggle button if this option seems to confusing for users
        backgroundColourOption: 0,
        windowWidth: 1000,
        currentlyActivated: false,
        tabData:[
          {
            text: "Theme",
            icon: "mdi-palette"
          },
          {
            text: "Text",
            icon: "mdi-text"
          },
          {
            text: "Border",
            icon: "mdi-border-style"
          }
        ],

        activeTabIndex: 0,

        tourRunning: false,

        maxVariation: 6,
        buttonPulseTimeoutDone: false, // test a timed delay before pulsing the button
        accordianOpenRefID : null,
        showToolTipTest: true,

        cityBasemapDirty : false,
        cityBasemapListLoading : true,
        cityID : 1, // cityID
        cityPrintSizeID: 4,
        cityOrientationID : 1,
        cityOrientationOptions: [],
        cityPrintSizeOptions : [],
        cityBasemapMap : {},

        initDone : false,
        addToCartLoading : false,
        //showItemAddedModal: false,
        assetsLoading: true,
        mapWidgetLoading : true,
        navShowing: true,


        /*
        mapVariation: 1,
        themeID : 1,
        borderSize: 0,
        text1: "Country text 1",
        paperSizeID: 3,
        orientationID: 1,
        waterColour1 : [50,50,50],
*/
        showFrame: false,   /* default setting if frame is or off */

        themePageID: 0,
        themePageRows: 4,
        themePageCols: 2,

        paperSizeOptions: [{value:1, label:"24x18"},{value:2, label:"36x24"},{value:3, label:"18x18"}],
       // orientationOptions: [{value:1, label:"portrait"},{value:2, label:"landscape"}],
        textStyleOptions: [
          {
            value: commonGlobals.STYLE_ID_NONE,
            label:"None",
          },
          {
            value:commonGlobals.STYLE_ID_BAR,
            label:"Bar",
            svgIcon : "icon-style-bar"
          },
          {
            value:commonGlobals.STYLE_ID_FLOAT,
            label:"Card",
            svgIcon : "icon-style-float"
          },
          {
            value:commonGlobals.STYLE_ID_FADE,
            label:"Fade",
            svgIcon : "icon-style-fade"
          }
        ],
        showFrameOptions: [{value: 0, label:"Hide"},{value:1, label:"Show"}],
        borderOptions: [{value: false, label:"None"}, {value:true, label:"Border"}],
        variationOptions: [{value: 0, label:"1"},{value: 1, label:"2"},{value: 2, label:"3"},{value: 3, label:"4"},{value: 4, label:"5"},{value: 5, label:"6"}]
      }
    },
    methods:{
      onThemeMouseEnter: function(evtData){
      ///  console.log("onThemeMouseEnter", evtData);
        //
        if(_themeHoverHideTimeoutID  != null) clearTimeout(_themeHoverHideTimeoutID );
        if(_themeHoverTimeoutID != null) clearTimeout(_themeHoverTimeoutID);
        _themeHoverTimeoutID = setTimeout(()=>{
          this.themeDescriptionPopUpFadeOut =false;
          this.themeHoverPositionY =  evtData.event.target.offsetTop - 85;
          this.themeHoverID = evtData.themeID;
          this.themeDescriptionPopUpShowing = true;
        },250);
      },
      onThemeMouseLeave: function() {

        if(_themeHoverTimeoutID != null) clearTimeout(_themeHoverTimeoutID);
        _themeHoverTimeoutID = setTimeout(()=>{
          this.themeDescriptionPopUpFadeOut =true;
        },500);

        if(_themeHoverHideTimeoutID  != null) clearTimeout(_themeHoverHideTimeoutID );
        _themeHoverHideTimeoutID = setTimeout(()=>{
          this.themeDescriptionPopUpShowing = false;
        },1000);
      },
      onResizeContentToFit: function(){

        ///////////////////////////////
        // adjust the leaf (some phyisical objects for better context) position to be relative to the bottom right corner of the map

        console.log("here");
        let editorBase = this.$refs['editorbase'];
        const sizeInInches = 10;
     //   console.log("mapScaleValue", editorBase.mapScaleValue);

        var mapContainerDiv = document.getElementById("previewContainer");
      //  console.log("mapContainerDiv", mapContainerDiv.getBoundingClientRect());
        let  mapContainerContainerRect = mapContainerDiv.getBoundingClientRect();

        let contentBaseDiv = editorBase.$refs["contentBase"] ;
      //  console.log("contentBaseDiv", contentBaseDiv);

        if((mapContainerContainerRect != null) &&(contentBaseDiv != null)) {
          let contentBaseDivRect = contentBaseDiv.getBoundingClientRect();
      //    console.log("contentBaseDivRect", contentBaseDivRect);

          let bottom = mapContainerContainerRect.bottom;
          let right = mapContainerContainerRect.right;
          let offsetx = 280;  // leaf offset in x relative to the map corner, higher number moves it left
          let offsety = 190;  // leaf offset in y relative to the map corner, higher number moves it up

          let imgTop = (-contentBaseDivRect.top + bottom - offsety * editorBase.mapScaleValue);
          // want to make sure the bottom of the image does not get shown, as its a hard cut, so fix to the bottom if its above
          let imgHeight = Math.round(editorBase.canvasPPI * sizeInInches);
          let minImgTop =  contentBaseDivRect.bottom - imgHeight  + 2;
          imgTop = Math.max(minImgTop, imgTop);
          let imgLeft = (-contentBaseDivRect.left + right - offsetx * editorBase.mapScaleValue);


          let style = {
            height: imgHeight + 'px',
            left: imgLeft + "px",
            //top: imgTop + "px"
            top : imgTop  + "px"

          };
      //    console.log("style", style);

          $('#leaf').css(style);


        }
      },
      deactivated: function(){
        if(!this.currentlyActivated) return;
        this.currentlyActivated = false;
        bus.$off("exportLargeImagePreview", this.exportLargeImagePreview); // called from the preview export tool
        bus.$off("refreshMapWidget", this.onThemeRefresh);
        bus.$off('mapRemovedFromCart',this.onMapRemovedFromCart);
        bus.$off('cartMapClicked',this.onCartMapClicked);
        window.removeEventListener("resize", this.onWindowResize);

        this.initDone = false;
        this.mapWidgetLoading = true;
        this.$refs.mapWidget.assetsLoading = true; // rset it so it does do ops on old map
      },
      activated: function(){
        // call deactivate first if not done
        if(this.currentlyActivated){
          this.deactivated();
        }
        console.log("MapEditorPage activated" );
        //this.mapWidgetLoading = true;
        //this.$refs.mapWidget.assetsLoading = true; // rset it so it does do ops on old map

        // reset tab index
        this.activeTabIndex = 0;

        this.currentlyActivated = true;
        this.windowWidth = window.innerWidth;


        bus.$on("exportLargeImagePreview", this.exportLargeImagePreview); // called from the preview export tool
        bus.$on("refreshMapWidget", this.onThemeRefresh);
        bus.$on('mapRemovedFromCart',this.onMapRemovedFromCart);
        bus.$on('onCartMapClicked',this.onCartMapClicked);
        window.addEventListener("resize", this.onWindowResize);

        _model = this;
        var _this = this;
        this.$nextTick(function () {
          //console.log("mounted");
          // todo - find proper reference to data
          if(!_this.isThemesLoaded && !_this.isThemesLoading) {
            _this.$store.dispatch("retrieveThemesFromServer");
          }

          //initColourPickers();

          _this.$refs.mapWidget.init();

          //this.$nextTick(() => {
          _this.refreshAccordian(); // refresh the panels on next frame
          //});

          //  _this.$refs['accordian-theme'].open();



          //  resizeContentToFit();
          // $( window ).resize(resizeContentToFit);

          // custom scroll bar test
          //The first argument are the elements to which the plugin shall be initialized
          //The second argument has to be at least a empty object or a object with your desired options
          //   console.log("ovelayscrollbars", document.querySelectorAll(".sidenav-scrollcontent"));
          //   OverlayScrollbars(document.querySelectorAll(".sidenav-scrollcontentholder"), { });


        });
      },
      exportLargeImagePreview: function(){
        //disable the gradient shading and if its showing a overlay
        this.$refs.mapWidget.previewMapRenderUpdate(true);
        var canvas = this.$refs.mapWidget.getCanvas();
        var image = canvas.toDataURL("image/png", 1.0).replace("image/png", "image/octet-stream");
        var link = document.createElement('a');
        let text1= this.$store.getters.previewMap_text1;
        let themeName = this.$store.getters.currentThemeLabel;
        link.download =  ( ((text1 != "") && (text1 != null)) ?  text1 : themeName)  + ".png";
        link.href = image;
        link.click();

        // reenable it
        this.$refs.mapWidget.previewMapRenderUpdate(false);

      },
      resetTagLineToCoords: function(){
        // get the lng,lat from basemap
        //let lng = this.$store.state.basemap.lng;
        //let lat = this.$store.state.basemap.lat;
        //this.text3 = lat + '°N / ' + lng + '°E';
        this.$store.commit('setDefaultTagLine');
      },
      onWindowResize: function(){
        this.windowWidth = window.innerWidth;
      },
      onMapWidgetClick: function(){
        // randomise theme and variation
        this.randomiseThemeColours();
        /*
        this.chooseRandomTheme();
       */
        /*
        // todo try opening a pop-up with the map widget in it
        // pass the dataurl of the image to it
        var img= this.$refs.mapWidget.getCanvas();
        this.$refs.mockupModal.openWithImage(img, this.$store.state.map, this.$store.state.basemap);
        */
      },
      chooseRandomTheme: function(){
        let n = this.nThemes;
        let themeIX = Math.round(Math.floor(Math.random()*n) , n-1);
        let themeID = this.themes[themeIX].themeID;
        this.changeTheme(themeID);
      },
      onCartMapClicked: function(args){
        console.log(" onCartMapClicked", args, this.$store.state.map);
        if(args.mapID == this.mapID){

          // reset
          var map = this.$store.getters.getMapInCartByID(this.mapID);
          if (map != null) {
            this.$store.commit("setEditMapData", {
              map: map,
              dontOverrideText: false
            });
          }

        }
      },
      onMapRemovedFromCart: function(args) {
        var mapID = args.mapID;
        console.log(" mapRemovedFromCart event", mapID, this.mapID);

        if(mapID == this.mapID)
        {
          // reset back to create
          this.$router.push({ name: 'create', params: {}})
        }
      },
      onTabClicked : function(tabIndex){
        if(tabIndex == this.activeTabIndex)
        {
          //move
        }
      },
      fadeOutMapOverlay: function()
      {
        this.$refs.editorbase.fadeOutMapOverlay();
      },
      fadeInMapOverlay: function()
      {
        this.$refs.editorbase.fadeInMapOverlay();
      },
      scrollSideMenuToShowBound : function(minY, maxY){
        this.$refs.editorbase.scrollSideMenuToShowBound(minY,maxY);
      },
      handleNextTourStep : function(stepIndex){
        /*
        console.log("handleNextTourStep", stepIndex);

        var steps = $.ptJs('info').steps;
        console.log("steps", steps);
        if(stepIndex >= steps.length ) return;

        var stepID = steps[stepIndex][0].id;
        console.log("stepID", stepID);
        if(stepID == "colourscheme" )
        {
          this.openAccordian('accordian-theme');
          this.scrollSideMenuToShowBound(0, 300);
          this.fadeInMapOverlay();
        }
        else if(stepID == "variation" )
        {
          this.openAccordian('accordian-theme');
          this.scrollSideMenuToShowBound(400,500);
          this.fadeInMapOverlay();
        }
        else if(stepID == "textstyle" )
        {
          this.openAccordian('accordian-text');
          this.scrollSideMenuToShowBound(130,460);
          this.fadeInMapOverlay();
        }
        else if(stepID == "border" )
        {
          this.openAccordian('accordian-text');
          this.scrollSideMenuToShowBound(540,620);
          this.fadeInMapOverlay();
        }


        /// MOBILE

        if(stepID == "tabButton0" )
        {
        //  this.activeTabIndex = 1;
        }
        else if(stepID == "tabButton1" )
        {
       //   this.activeTabIndex = 2;
        }
        else if(stepID == "tabButton2" )
        {
        //  this.activeTabIndex =3;
        }
        */
      },
      closeTour: function()
      {
        if($('body').itour) $('body').itour('destroy');
        /*
        if(this.tourRunning) {
          this.tourRunning = false;
         // $.ptJs('end');
        }*/
      },
      runTourOnFirstVisit : function()
      {
        const storageKey = "firstEditorTourDone";
        console.log("localStore", storageKey, localStore.getItem(storageKey));
        if(!localStore.getItem(storageKey))
        {
          localStore.setItem(storageKey,"true");
         // this.runTour();
        }
      },
      runTour : async function(startAtStep = null)
      {
        await this.loadITourScripts();

        //if(this.tourRunning) return;
        //this.tourRunning = true;

        var steps;
        if(this.isDesktop) {
          steps = [
            {
              name: '#colourscheme',
              title: "Color Theme",
              content: 'Choose from monochromatic and subtle themes that work well in any room, or bright and bold themes if you are looking to add some energy into your space.',
              before:()=>{
                console.log("step here 1");
                this.openAccordian('accordian-theme');
                this.scrollSideMenuToShowBound(0, 300);
              }
            },
            {
              name: '#variation',
              title: "Variants",
              content: 'Want to tweak further? Try out some different variations to find a color combination that you like best.',
              before:()=>{
                this.openAccordian('accordian-theme');
                this.scrollSideMenuToShowBound(400,500);
              },
              delayAfter: 0
            },
            {
              name: '#border',
              title: "Border",
              content: 'Add a white border which helps to give colors an extra pop, or got without for a more immersive effect.',
              before:()=>{
                this.openAccordian('accordian-border');
                this.scrollSideMenuToShowBound(540,620);
              }
            },
            {
              name: '#textstyle',
              title: "Text",
              content: 'Add a personal touch or special message to your map. Choose from 3 different elegant styles.',
              delayBefore: 0,
              before:()=>{
                this.openAccordian('accordian-text');
                this.scrollSideMenuToShowBound(130,460);
              }
            },
            {
              name: '#framepreview',
              title: "Preview Your Map",
              content: 'Preview your map in-situ to help give you an idea of what it might look like once it\'s framed.',
              delayBefore: 0,
              before:()=>{
              }
            },
            {
              name: '#addtocart',
              title: "Add To Cart",
              content: 'When you are happy, you can save the map to your cart here.  This completes the tour, let\'s begin!',
              before:()=>{
               // this.openAccordian('accordian-theme');
              },
              after:()=>{
                 this.openAccordian('accordian-theme');
              }
            }
          ];
        }
        else{
          // isMobile
          steps = [
            {
              name: '#tabButton0',
              title: "Theme Tab",
              content: 'Try out different color schemes for your map. Press the Shuffle button to try different variations.'
            },
            {
              name: '#tabButton1',
              title: "Text Tab",
              content: 'Choose a style to display the text.'
            },
            {
              name: '#tabButton2',
              title: "Border Tab",
              content: 'Add/remove the optional white border.'
            },
            {
              name: '#addtocartMobile',
              title: "Add To Cart",
              content: 'When you are happy, you can save the map to your cart here.  This completes the tour, let\'s begin!'
            }
          ];
        }

        let userOpts = {
          localStore: localStore,
          CSSClass:'customitourtheme',
          introShow:startAtStep == null,
          introCover:'/static/assets/home/mock3.jpg',
          tourTitle:'Example «intro»',
          tourMapEnable:false,
          modalCancelVisible:true,
          tourContinue:false,
          steps:steps,
          startStep: ((startAtStep != null) && (startAtStep >= 1)) ? startAtStep : 1,
          lang: {									//Default language settings
            cancelText:	'Cancel Tour',			//The text in the cancel tour button
            hideText: 'Hide Tour Map',			//The text in the hidden tour map button
            tourMapText:'•••',					//The text in the show tour button
            tourMapTitle: 'Tour Map',			//Title of Tour map button
            nextTextDefault:'Next',				//The text in the Next Button
            prevTextDefault:'Previous',				//The text in the Prev Button
            endText:'End Tour',					//sets the text for the close button in the last step of the tour
            contDialogTitle:'Continue the unfinished tour?',										//Title of continue dialog
            contDialogContent:'Click "Continue" to start with step on which finished last time.',	//Content of continue dialog
            contDialogBtnBegin:'Start from beginning',												//Text in the start button of continue dialog
            contDialogBtnContinue:'Continue',														//Text in the continue button of continue dialog
            introTitle:'2/2 Edit Style', 											//Title of introduction dialog
            introContent:'Great, your map is now ready to preview! Try out how it looks in a range of beautiful themes and add custom text to make it your own.',				//Content of introduction dialog
            introDialogBtnStart:'Start Tour',															//Text in the start button of introduction dialog
            introDialogBtnCancel:'Skip Tour'															//Text in the cancel button of introduction dialog
          }
        };

        $('body').itour(userOpts);


        /*
        $.ptJs({
          autoDestroy:true,
          templateClass: {
            root: ['one']
          },
          templateViewWindow: '' +
                  '<div class="step-container" ptjs-id="ptjs-step-container">\n' +
                  '<span class="step-button-close" ptjs-id="button-close" >&#10006;</span>\n' +
                  '<div class="step-header" ptjs-id="header">\n' +
                  '<div class="title" ptjs-data="title"></div></div>\n' +
                  '<div class="step-body" ptjs-id="body">\n' +
                  '<div class="content" ptjs-data="content"></div></div><br>\n' +
                  '<div class="step-footer" ptjs-id="footer">\n' +
                  '<span class="step-pagination" ptjs-id="pagination" ptjs-data="pagination"></span>\n' +
                  '<div class="step-buttons">\n' +
                  '<span ptjs-id="button-start" >next</span>\n' +
                  '<span ptjs-id="button-previous" ptjs-data="button-previous" class="step-button-previous-custom"></span>\n' +
                  '<span ptjs-id="button-next" ptjs-data="button-next"></span>\n' +
                  '<span ptjs-id="button-end" >Done</span>\n' +
                  '</div>\n' +
                  '</div>\n' +
                  '</div>'
          ,
          keyboardNavigation: false,
          overlay: {
            enable: false
          },
          position:{
            relocate: true,
            location: 'rm'
          },
          animation: {
            enableOnOpen: true,
            enableOnClose: true,
            duration : 0.7
          },
          autoStart: true,
          templateData: {
            title: 'Area Editor Tour'
          },
          steps: steps,
          onButtonPreviousClick: (event, data)=>{
            console.log("onButtonPreviousClick");

            this.handleNextTourStep(data.index - 1);
          },
          onButtonNextClick: (event,data)=>{
            console.log("onButtonNextClick");
            this.handleNextTourStep(data.index + 1);
          },
          onButtonStartClick: (event,data)=>{
            console.log("onButtonStartClick");
            this.handleNextTourStep(data.index + 1);
          },
          onButtonEndClick: (event,data)=>{
            console.log("onButtonEndClick");
            this.openFirstAccordian();
            this.fadeOutMapOverlay();
            var timeout = setTimeout(()=>{
              this.scrollSideMenuToShowBound(0,0);
            },500);
            //this.tourRunning = false;
          },
          onButtonCloseClick: (event,data)=>{
            this.fadeOutMapOverlay();
           // this.tourRunning = false;
          },
          onStart :(event, data)=>{
            console.log("onStart");
           this.handleNextTourStep(0 );
           this.tourRunning = true;
          },
          onDestroy:(event,data)=>{
            console.log("onDestroy");
            // make sure tour is destroyed, as openingin as new tour before its destoroyed causes it to never open
            this.tourRunning = false;
            this.fadeOutMapOverlay();

          }
        });
        */
      },

      gotoPreviewCreatePage: function(){
        if(this.mapID != null) {
          this.$router.push({name: 'areaEdit', params: {editRoute_mapID: this.mapID, editRoute_basemapID: this.$store.state.basemap.basemapID }});
        }
        else{
          this.$router.push({ name: 'areaEditRetain', params: {}});

        }
      },
      getAccordianRefs: function(){
        let accrefs = ['accordian-theme', 'accordian-text', 'accordian-border', 'accordian-preview' ,'accordian-location'];
        return accrefs;
      },
      openFirstAccordian: function(forceOpen = false)
      {
        let accrefs = this.getAccordianRefs();
        this.openAccordian(accrefs[0],forceOpen);
      },
      refreshAccordian: function()
      {
        if(this.accordianOpenRefID == null)
        {
          this.openFirstAccordian(true);
        }
        else{
          this.openAccordian(this.accordianOpenRefID,true);
        }
      },
      accordianButtonClicked: function(refID)
      {
        console.log('accordianButtonClicked');
        // test closing all other accordians
        //this.closeAccordians();
        this.toggleAccordian(refID);
      },
      toggleAccordian: function(refID)
      {
        this.closeAccordians();
        let accordian = this.$refs[refID];
        if (accordian == null) return;

        const allowAccordianToClose =  true;
        if(allowAccordianToClose)
        {
          if(this.accordianOpenRefID == refID)
          {
            this.accordianOpenRefID = null;

          }
          else{
            accordian.open();
            this.accordianOpenRefID = refID;
          }
        }
        else {
          accordian.open();
          this.accordianOpenRefID = refID;
        }
      },
      openAccordian: function(refID, forceOpen=false)
      {
        // currently open so dont need to open again
        if(!forceOpen && (this.accordianOpenRefID == refID)) return;

        this.closeAccordians();
        let accordian = this.$refs[refID];
        console.log("accordian",refID,accordian);
        if (accordian == null) return;

        accordian.open();
        this.accordianOpenRefID = refID;
      },
      closeAccordians: function()
      {
        let accrefs = this.getAccordianRefs();
        for(let i =0 ;i < accrefs.length;++i)
        {
          let accordian = this.$refs[accrefs[i] ];
          if(accordian != null) {
            accordian.close();
          }
        }
      },
      onMapWidgetLoaded : function(){

        console.log("onMapWidgetLoaded");
        this.mapWidgetLoading = false;
        this.assetsLoading = false; // add assetLoading as a prop.sync to mapWdiget to remove this
        //$('#scaledCanvas').fadeIn(1000);
        // fadeIn map, try css animation
        setTimeout(()=>{
          this.$refs.editorbase.resizeContentToFit();
        },1);

        setTimeout(()=>{
          this.fadeInLeaf = true;
          this.$refs.editorbase.resizeContentToFit();

        },100);


      },
      onMapWidgetResize : function(){
        this.$refs.editorbase.resizeContentToFit();
      },
      onMapWidgetInit : function(){
        this.init();
      },

      addToCart: function() {
        if (this.addToCartLoading) return;
        if (this.mapWidgetLoading) return;
        if (this.assetsLoading) return;

        console.log("addToCart");
        this.addToCartLoading = true;

        // create thumbnail

          /// do test encode
          var thumbnailCanvas = this.$refs.mapWidget.getThumbnailCanvas();
          var payload = {
            thumbnailCanvas: thumbnailCanvas
          };

          if (this.isAddMode || this.isCityMode || this.isExampleMapMode) {
            // add the current item to the cart
            this.$store.dispatch("addCurrentMapToCart", payload).then((mapData) => {
              console.log("returned from promise here, mapData.mapID:", mapData);
              // show pop up, this should be after server confirmation
              this.addToCartLoading = false;
              //this.showItemAddedModal = true;
              this.$refs.itemAddedModal.showAddMode(mapData);
              this.closeTour(); // close tour if open
            });
          }
          else if(this.isUpdateMode){
            // edit exist mode
            if(this.showLocationPanel)
            {
              // city eidt mode, basemap may have change
              payload.basemap = this.cityBasemapMap[this.cityPrintSizeID][this.cityOrientationID];
            }

            this.$store.dispatch("updateCurrentMapToCart", payload).then((mapData) => {
              console.log("returned from promise here, mapData.mapID:", mapData);
              // show pop up, this should be after server confirmation
              this.addToCartLoading = false;
              //this.showItemAddedModal = true;
              this.$refs.itemAddedModal.showUpdateMode(mapData);
              // update the cart?
              this.closeTour(); // close tour if open

            }).catch((e)=>{
              this.addToCartLoading = false;
            });
          }




      },
      /*
      getPagedThemeID: function(ix)
      {
        var nThemesPerPage = this.themePageRows * this.themePageCols;
        return ix + this.themePageID*(nThemesPerPage);
      },
      nextThemePage: function()
      {
        //var nPages = nThemes/
        this.themePageID = (this.themePageID + 1);
        console.log("----themePageID", this.themePageID);

      },
      prevThemePage: function()
      {
        this.themePageID = (this.themePageID - 1);
      },*/
      // track a theme click
      changeThemeTracked: function(newThemeID)
      {
        this.$ga.event({
          eventCategory: 'theme',
          eventAction: 'select',
          eventLabel: 'theme-click',
          eventValue: newThemeID
        });
        this.changeTheme(newThemeID);
      },
      onThemeRefresh: function(){
        console.log("onThemeRefresh");
        this.changeTheme(this.themeID);
        //var theme = this.getThemeByID(this.themeID);
        //this.$refs.mapWidget.setTheme(theme.segments, theme.road, theme.water);
        this.$refs.mapWidget.manualUpdate();
      },
      changeTheme: function(newThemeID)
      {
        this.themeID = newThemeID;
        var theme = this.getThemeByID(newThemeID);
        if(theme) {
          this.roadColour = theme.road;
          this.waterColour = theme.water;
        }
        //this.$refs.mapWidget.segmentColours = (theme.segments);
        //this.$refs.mapWidget.waterColour = (theme.water);
        //this.$refs.mapWidget.setRoadColour(theme.road);

      //  this.$refs.mapWidget.previewMapRenderUpdate(/*this*/);


      },
      getThemeByID: function(themeID){
        return this.$store.getters.getThemeByID(themeID);
      },
      setWaterColourEvent : function(colour){
        // update store
        this.waterColour = colour;

        //console.log("setWaterColourEvent: " + colour);
     //   this.$refs.mapWidget.setWaterColour(colour);
      //  this.$refs.mapWidget.previewMapRenderUpdate(/*_model*/); // todo add model


      },

      setRoadColourEvent : function(colour){
        // update store
        this.roadColour = colour;
        console.log("setRoadColourEvent: " + colour);
      //  this.$refs.mapWidget.setRoadColour(colour);
     //   this.$refs.mapWidget.previewMapRenderUpdate(/*_model*/); // todo add model
      },

      onPreviewMapChangeEvent: function(evt){
     //   this.$refs.mapWidget.previewMapRenderUpdate(this);
      },
      onVariationChangeEvent : function(evt){
        this.variation = evt.target.value;
        console.log("onVariation change", this.variation);
      //  this.$refs.mapWidget.onVariationChange(this.variation);
      //  this.$refs.mapWidget.previewMapRenderUpdate(/*this*/);
      },
      setThemeVariation: function(variationID)
      {
        this.variation =  variationID ; // Math.floor( Math.random()*255);
        //  this.$refs.mapWidget.onVariationChange(this.variation);
        //  this.$refs.mapWidget.previewMapRenderUpdate(/*this*/);

        this.$ga.event({
          eventCategory: 'editor',
          eventAction: 'randomise',
          eventLabel: 'randomise',
          eventValue: this.variation
        })
      },
      randomiseThemeColours: function()
      {
        this.variation =  (this.variation +1 ) % this.maxVariation  ; // Math.floor( Math.random()*255);
      //  this.$refs.mapWidget.onVariationChange(this.variation);
      //  this.$refs.mapWidget.previewMapRenderUpdate(/*this*/);

        this.$ga.event({
          eventCategory: 'editor',
          eventAction: 'randomise',
          eventLabel: 'randomise',
          eventValue: this.variation
        })
      },
      /*
      onThemeIDChangeEvent : function(evt){
        // update store model
        this.themeID = evt.target.value;
        console.log("onThemeID change", this.themeID);
        onThemeIDChange(this.themeID);
        previewMapRenderUpdate(this);

      },*/
      /*
      onMapChangeEvent : function(evt)
      {
        console.log("onMapChange Event", evt.target.value);
        this.$refs.themeSelectorGrid.setPageIndexToSelectedTheme();

        this.$refs.mapWidget.loadMap( this );
      },*/
      init : async function(){

        var showSampleOfflineMap = true;


        if(!this.isCartLoaded) return;
        if(!this.isThemesLoaded) return;

        console.log("init");
        //console.log("basemapIDRoute", this.basemapIDRoute);
        console.log("route_exampleMapID ", this.route_exampleMapID);

        if(!this.initDone) {

          //this.$refs.mapWidget.initGL();
          //this.$refs.mapWidget.setupPreviewRendering();
          //this.$refs.mapWidget.setColourmapRendering();

          if(this.route_exampleMapID != null) {

            try {
              let map = await this.$store.dispatch("retrievePublicMapFromServer", (this.route_exampleMapID));

              //console.log("[mapEditorPage] retrieveMapFromServer result ", map, map== "");
              if ((map != null) || (map != "")) {
                // updating the map Data causes the MAp Widget props to update inturn updating the map view
                this.$store.commit("setEditMapData", {
                  map: map,
                  dontOverrideText: false
                });
                this.$store.commit("setBasemapData", map.basemap);
                // zero out the mapID so it doesn't get saved over
                this.$store.commit("setEditorModeToAddNew");// this comes after
                // custom map
                this.mapWidgetLoading = true;
                //   this.$refs.mapWidget.loadBasemap( this.basemapID);


              } else {
                // no map exists with ID in the cart show error
                console.error("no map exists with Id");
                this.errorModalShowing = true;
                this.errorModalMessage = "Oops, this map does not exist.";
                return;
              }
            }
            catch(e){
              console.error("no map exists with Id");
              this.errorModalShowing = true;
              this.errorModalMessage = "Oops, this map does not exist.";
              return;
            }
          }


          if(this.route_mapID != null) {
            // set map options and basemap options if not existing
            // this is when a map select from the cart to be edited
            // editor/map/:route_mapID
            if (this.$store.state.map.mapID != this.route_mapID) {
              // set the map data
              var map = this.$store.getters.getMapInCartByID(this.route_mapID);
              if (map != null) {
                this.$store.commit("setEditMapData", {
                  map: map,
                  dontOverrideText: false
                });
              }
              else{
                console.log("map does not exist in cart, cannot edit");
                this.errorModalShowing = true;
                this.errorModalMessage = "Oops, this map does not exist in your cart.";
                return;
              }
            }
          }


          if(this.route_basemapImageData != null)
          {
            console.log("this.route_basemapImageData here");
            // load from generated basempadata
            this.$store.commit("setPreviewMap_skuID", this.$store.getters.getSkuIDForCurrentProductTypeIDAndPrintSizeID);
            this.changeTheme(this.themeID); // forcee the colour pickers to update
            this.mapWidgetLoading = true;
            // todo - use example hardcoded map that doesnt require internet access
            this.$refs.mapWidget.loadBasemapWithImageData(this.route_basemapImageData);
            // test
            let themeObject =this.getThemeByID(this.themeID);
            if(themeObject) {
              this.$refs.spinnerLoader.setColoursFromTheme(themeObject);
            }else{
              this.$refs.spinnerLoader.setRandomColours();
            }
          }



          if(this.route_basemapID != null)
          {
            // set basemap options
            //

            // editor/basemap/:route_basemapID
            if(this.$store.state.basemap.basemapID != this.route_basemapID)
            {
              //fetch it from the server?
              if(this.useSampleBasemapRoute) {
                var data = {
                  basemapID: "FPHq3xtAu",
                  cityID: null,
                  createdAt: "2019-10-29T14:29:09.000Z",
                  createdByCartID: "e4449fe0-908a-11e9-8ca8-238ffd782d4d",
                  fullsizeStatus: null,
                  lat: 53.5034,
                  lng: -2.97147,
                  metricUnits: 0,
                  orientationID: 1,
                  previewStatus: 2,
                  printSizeID: 4,
                  searchString: "Sefton, England, United Kingdom",
                  viewed: 0,
                  zoom: 12
                }
                this.$store.commit("setBasemapData", data);
                this.$store.state.map.basemapID = data.basemapID;

              }
              else{

                var data  = await this.$store.dispatch("retrieveBasemapFromServer", this.route_basemapID);
                this.$store.commit("setBasemapData", data);
                this.$store.state.map.basemapID = this.route_basemapID;

              }


            }

          }

          if(this.basemapID != null) {


           // this.$store.commit("setEditorModeToAddNew"); // zero out the mapid
            this.$store.commit("setPreviewMap_skuID", this.$store.getters.getSkuIDForCurrentProductTypeIDAndPrintSizeID);
            this.changeTheme(this.themeID); // forcee the colour pickers to update

            this.mapWidgetLoading = true;

            // todo - use example hardcoded map that doesnt require internet access
            if(this.useSampleBasemapRoute) {
              //var sampleImageName = "sampleMapLondon";
              this.$refs.mapWidget.loadSampleBasemap("/static/assets/mapwidget/" + this.sampleImageNameRoute + ".png");
            }
            else {
              this.$refs.mapWidget.loadBasemap(this.basemapID);
            }
            // test

            let themeObject =this.getThemeByID(this.themeID);
            if(themeObject) {
              this.$refs.spinnerLoader.setColoursFromTheme(themeObject);
            }else{
              this.$refs.spinnerLoader.setRandomColours();
            }

          }

          /*
          if (this.isAddMode) {
            this.initAddMode();
          }
          else if (this.isUpdateMode) {
            this.initUpdateMode();
            //this.onModelChanged();
          }
          else if (this.isCityMode) {
            this.initCityMode();
            //this.onModelChanged();
          }
          else if (this.isExampleMapMode) {
            this.initExampleMapMode();
            //this.onModelChanged();
          }*/

          // start pulse delay - test
          var pulsetimeout = setTimeout(()=>{
            this.buttonPulseTimeoutDone = true;
          },5000);


          this.runTourOnFirstVisit();


          //loadMap(2);
          //onModelChanged(this);

        }
        else{
          // invalid
          console.log("invalid route, no basemapID or update index set");
        }

      },


      /*
      // initialise page in Edit Mode - this will allow the user to update an existing map in the cart
      initUpdateMode : function()
      {
        this.initDone = true;
        console.log("edit mode");
        var map = this.$store.getters.getMapInCartByID(this.updateMode_mapIndex);

        var basemapEdited = this.updateMode_basemapID != null;
        if(map != null) {
          // updating the map Data causes the MAp Widget props to update inturn updating the map view
          this.$store.commit("setEditMapData", {
            map: map,
            dontOverrideText: basemapEdited  //dont use the old map text as user may have chosen a differnt area
          });
          console.log("this.updateMode_basemapID", this.updateMode_basemapID);

          if(basemapEdited)
          {
            // trying out a new basemap temporaiily so override it for now
            // once saved the basemapID gets applied the the map row on the server
            this.basemapID = this.updateMode_basemapID;

            //leave the existing basemap which should relatte to the above id, this is so that when the user goes back to edit the map then it should thatof the last basemap
          }
          else{
            // override the basemap with the map one
            this.$store.commit("setBasemapData", map.basemap);
          }

          //this.$refs.mapWidget.setMapSettings(this.$store.getters.map);

          // todo - switch basemap to prop?

          // this.updateColourPickers();
          // update UI
        //  this.updateColourPickers();

          if(map.basemap.cityID != null) {
            // city map
            this.cityPrintSizeID = map.basemap.printSizeID;
            this.cityOrientationID = map.basemap.orientationID;
            this.cityID = map.basemap.cityID; /// set this last
            console.log("here-----------------------");
           // this.setCityBasemapDirty();
            this.onCityChange();
          }
          else{
            // custom map
            this.mapWidgetLoading = true;
            this.$refs.mapWidget.loadBasemap( this.basemapID);
          }
        }
        else{
          // no map exists with ID in the cart show error
          console.error("no map exists with Id in cart", this.updateMode_mapIndex);
        }
      },*/

      /*
      // load an existing example map
      initExampleMapMode : function()
      {
        this.initDone = true;
        console.log("ExampleMap mode");

        // same as the initUpdateMode but instead get the mapData from the server
        this.$store.dispatch("retrieveMapFromServer", Number.parseInt( this.exampleMapMode_mapID)).then((map)=>{
          if(map != null) {
            // updating the map Data causes the MAp Widget props to update inturn updating the map view
            this.$store.commit("setEditMapData", {
              map: map,
              dontOverrideText: false
            });
            this.$store.commit("setBasemapData", map.basemap);


            // zero out the mapID so it doesn't get saved over
            this.$store.commit("setEditorModeToAddNew");// this comes after

            //this.$refs.mapWidget.setMapSettings(this.$store.getters.map);
            if(map.basemap.cityID != null) {
              // city map
              this.cityPrintSizeID = map.basemap.printSizeID;
              this.cityOrientationID = map.basemap.orientationID;
              this.cityID = map.basemap.cityID; /// set this last
              console.log("here-----------------------");
              // this.setCityBasemapDirty();
              this.onCityChange();
            }
            else{
              // custom map
              this.mapWidgetLoading = true;
              this.$refs.mapWidget.loadBasemap( this.basemapID);
            }
          }
          else{
            // no map exists with ID in the cart show error
            console.error("no map exists with Id");
          }
        });

      },*/
/*
      // initialise page in Add Mode- this will add a new map to the cart
      initAddMode : function()
      {

        // get the basemapData from the server as it may not exist
        this.$store.dispatch("retrieveBasemapFromServer", this.basemapIDRoute).then((basemapData)=>{

          console.log("********basemapData", basemapData);

          this.$store.commit("setBasemapData", basemapData);
         // this.basemapData

          this.initDone = true;
          console.log("addnew mode basemapIDRoute" , this.basemapIDRoute);
          this.$store.commit("setEditorModeToAddNew"); // zero out the mapid
          this.$store.commit("setPreviewMap_skuID", this.$store.getters.getSkuIDForCurrentProductTypeIDAndPrintSizeID);

          // this.$refs.mapWidget.setMapSettings(this.$store.getters.map);
          this.changeTheme(this.themeID); // forcee the colour pickers to update
          this.basemapID = this.basemapIDRoute;

          // call a method to load basemap.
          this.mapWidgetLoading = true;
          this.$refs.mapWidget.loadBasemap( this.basemapID);
          // this.updateColourPickers();

        })

      },
*/

      applyMapSettings : function(){

      },
      showDefaultStyleIfHidden : function()
      {
        if(this.styleID == 0)
        {
          this.styleID = 2;
        }
      }


    },
    computed: {

      ...mapGetters([
        'currentThemeLabel', 'currentTheme',
        'nThemes', 'themes', 'isCartLoaded', 'isThemesLoaded', 'isThemesLoading',
        'printSizeOptions',
        'orientationOptions',
        'labelForCurrentPrintSize'
      ]),
      themeDescriptionStyle: function() {
        return {
          top: this.themeHoverPositionY + "px"
        }
      },
      nextButtonDisabled: function(){
        return (!this.hasMapBeenEdited && this.isUpdateMode) || this.assetsLoading;
      },
      showAddButtonIcon: function(){
        return this.windowWidth > 350;
      },
      textFieldsDisabled: function(){
        return false;
        //return this.styleID == 0;  // uncommment  to disable text inputs when the None option is chosen
      },
      styleFrameCSSStyle: function (){
        let w = 20,h ;
        console.log("------------------styleFrameCSSStyle");

        console.log("this.printSizeID", this.printSizeID);
        console.log("this.orientationID", this.orientationID);
        h = 720;

        if(this.printSizeID == commonGlobals.PAPERSIZE_18x24)
        {
            w = 540 - 1.5;
        }
        else if(this.printSizeID == commonGlobals.PAPERSIZE_24x36)
        {
           w = 480 - 2;

        }
        else if(this.printSizeID == commonGlobals.PAPERSIZE_20x20)
        {
          w = 720;
        }

        if(this.orientationID == commonGlobals.ORIENTATION_ID_LANDSCAPE)
        {
          let temp = h;
          h = w;
          w = temp;
        }

        let obj = {
          left: "25.5px",
          top: "24px",
          width: w + "px",
          height: h + "px",
          "z-index": 10,
          position: "absolute",
         //border: "1px red solid"
        }
        return obj;
      },
      isMobile : function(){
        return this.$mq == 'mobile';
      },
      isDesktop : function(){
        return !this.isMobile;
      },
      segmentColours : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.segments;
        }
        return null;
      },
      colourSchemeRoadColour : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.road;
        }
        return [255,255,255];
      },
      colourSchemeWaterColour : function(){
        if(this.$store.getters.currentTheme) {
          return this.$store.getters.currentTheme.water;
        }
        return [255,255,255];
      },

      isAddMode: function(){
        return  (this.route_mapID == null);
      },
      isUpdateMode: function(){
        return (this.route_mapID != null);
      },
      isCityMode: function(){
        // city preset
        return (this.cityMode_cityID != null) ;
      },
      isExampleMapMode: function()
      {
        return (this.route_exa != null) ;
      },
      showLocationPanel: function(){
        return (this.$store.state.basemap.cityID != null);
      },
      // has an existing map in the cart been edited
      showButtonPulse : function()
      {
        if(this.isUpdateMode)
        {
          return this.hasMapBeenEdited;
        }
        else { // isCityMode or isAddMode
          // show after a set time?
          return this.buttonPulseTimeoutDone;
        }
      },
      hasMapBeenEdited: function()
      {
        console.log("hasMapBeenEdited");

        // just return true to allow for user to pres button on maps that have been edited
        return true;

/*
        var current = this.$store.getters.map;
        var saved = this.$store.getters.getMapInCartByID(current.mapID);
        if(saved != null)
        {
          if(current.themeID != saved.themeID ) return true;
          if(current.variation != saved.variation ) return true;

          if(current.waterColour[0] != saved.waterColour[0] ) return true;
          if(current.waterColour[1] != saved.waterColour[1] ) return true;
          if(current.waterColour[2] != saved.waterColour[2] ) return true;

          if(current.roadColour[0] != saved.roadColour[0] ) return true;
          if(current.roadColour[1] != saved.roadColour[1] ) return true;
          if(current.roadColour[2] != saved.roadColour[2] ) return true;

          if(current.border != saved.border ) return true;
          if(current.styleID != saved.styleID ) return true;
          if(current.text1 != saved.text1 ) return true;
          if(current.text2 != saved.text2 ) return true;
          if(current.text3 != saved.text3 ) return true;

          if(current.basemapID != saved.basemapID ) return true; // when location changed in city mode

        }
        return false;
        */
      },

      /*

       ,nColoursInTheme : function()
      {
        return themes[this.themeID].segments.length;
      }*/
      /*,
      lastThemePageID : function()
      {
        var nThemesPerPage = this.themePageRows * this.themePageCols;
        return Math.ceil(this.nThemes/ nThemesPerPage ) -1;
      }*/
      /*,
      nThemePages : function() {
        return this.nThemes / 16;
      }*/

    },
    watch:{
      '$route' (to, from) {

        if(!this.currentlyActivated) return;
        // react to route changes...
        console.log("MapEditorPAge route change", to, from);
        //  this.cancelPreviewProcessing();
        if(to.name == "editMap")
        {
          // resfresh it
          console.log(this);
          this.activated();
        }
      },
      $mq: function(val)
      {

        if(!this.currentlyActivated) return;
        // desktop <-> mobile switch
        console.log("watch: $mq ", val);
        // close tour if open to avoid issues
        this.closeTour();

        // on switch to desktop
        if(val == 'desktop') {
          this.$nextTick(() => {
            this.openAccordian('accordian-theme', true);
          });
        }

      },
      activeTabIndex: function(newTabIndex)
      {
        if(!this.currentlyActivated) return;
       // console.log("activeTabIndex", newTabIndex);
        // scroll to bottom
        setTimeout(()=> {
          if (newTabIndex >= 0) {
            let elem = this.$refs["tabcontent" + newTabIndex];
            console.log("elem" , elem);
            var h = $(elem.$el).height();
            if(newTabIndex == 0) h = 0;
            //console.log("activeTabIndex elem h", h);
            $("html, body").animate({scrollTop: h} /*, {easing: "easeOutQuad", duration: 300}*/);
          }
        }, 10);
      },
      text1: function(value)
      {
        if(!this.currentlyActivated) return;
        console.log("text1", value);
       // this.showDefaultStyleIfHidden();
      },
      text2: function(value)
      {
        if(!this.currentlyActivated) return;
      //  this.showDefaultStyleIfHidden();
      },
      showLocationPanel: function(value)
      {
        if(!this.currentlyActivated) return;
        console.log("watch showLocationPanel");


        this.$nextTick(() => {
          this.refreshAccordian(); // refresh the panels on next frame
        });
      },
      cityOrientationID: function(value)
      {
        if(!this.currentlyActivated) return;

        this.setCityBasemapDirty();
      },
      cityPrintSizeID: function(value)
      {
        if(!this.currentlyActivated) return;

        this.updateCityOrientationOptions();
        this.setCityBasemapDirty();
      },
      cityID: function(value)
      {
        console.log("watch city");
        this.onCityChange();
      },

      waterColour : function(value)
      {
        if(!this.currentlyActivated) return;

        console.log("waterColour changed", value);
        // update the colour picker
        var water = this.waterColour;
        //$("#waterColourInput").spectrum("set", 'rgb('+water[0]+','+water[1]+', '+water[2]+')');
      },
      roadColour : function(value)
      {
        if(!this.currentlyActivated) return;

        //this.updateRoadColourPicker();
        var road = this.roadColour;

        //$("#roadColourInput").spectrum("set", 'rgb('+road[0]+','+road[1]+', '+road[2]+')');
      },

      showFrame : function(value)
      {
        if(!this.currentlyActivated) return;

        // todo - update the prop
       // this.$refs.mapWidget.setShowFrame(value);
      },
      border : function(value)
      {
        if(!this.currentlyActivated) return;

        // todo - update the prop
        //this.$refs.mapWidget.setBorder(value);
      },
      themeID: function(newVal,oldVal)
      {
        if(!this.currentlyActivated) return;

        //    initThemeColourPickers(this.getTheme(newVal));
      },
      cityMode_cityID: function(newVal, oldVal)
      {
        if(!this.currentlyActivated) return;

        this.init();
        //this.initAddMode(newVal);
        console.log("cityMode_cityID change", newVal);
      },
      basemapIDRoute: function(newVal, oldVal)
      {
        if(!this.currentlyActivated) return;

        // this is for new maps
          // dont need to wait for hte cart to load in this mode
        this.init();
        //this.initAddMode(newVal);
          console.log("basemapIDRoute change", newVal);
      },
      updateMode_mapIndex: function(newVal, oldVal)
      {
        if(!this.currentlyActivated) return;


        var mapIndex = newVal;
          // need to wait for cart to load in this case
          if(this.isCartLoaded)
          {
            this.init();
            //this.initUpdateMode(mapIndex);
            //console.log("updateMode_mapIndex change", mapIndex);
          }
      },
      isThemesLoaded : function(newVal, oldVal)
      {
        if(!this.currentlyActivated) return;

        var loaded = newVal;
        if(loaded)
        {
          this.$nextTick(() => {
            this.refreshAccordian(); // refresh the panel height

          });
          this.init();

        }
      },
      isCartLoaded : function(newVal, oldVal)
      {
        if(!this.currentlyActivated) return;

        var loaded = newVal;
          if(!this.initDone && loaded)
          {
            //if(this.isUpdateMode) this.initUpdateMode();
            //else if(this.isAddMode) this.initAddMode();
            this.init();
          }
      }
    },
    created: function(){
      console.log("MapEditorPage created");
    },
    deactivated: function(){
      this.deactivated();
    },
    // moved from mounted for as keep-alive means mounted is only called once
    activated: function(){
      this.activated();
    },
    beforeRouteLeave (to, from, next) {
      // called when the route that renders this component is about to
      // be navigated away from.
      // has access to `this` component instance.
      this.closeTour();
      next();
    },
    name: 'MapEditorPage'
  }

  /*
  function initColourPickers() {

    ////// colour picker test
    $("#waterColourInput").spectrum({
      color: "#ffffff"
    });
    $("#waterColourInput").on("move.spectrum", function (e, color) {
      _model.setWaterColourEvent([color._r, color._g, color._b]);
      //previewMapRenderUpdate(_model); // todo add model
    });
    $("#roadColourInput").spectrum({
      color: "#ffffff"
    });
    $("#roadColourInput").on("move.spectrum", function (e, color) {
      _model.setRoadColourEvent([color._r, color._g, color._b]);
      //previewMapRenderUpdate(_model); // todo add model
    });

    //initThemeColourPickers(theme);
  }*/

  /*
  function initThemeColourPickers(theme)
  {
    //destory current pickers
    for (var i = 0; i < theme.segments.length; ++i) {
      (function (ii) {
        $("#colourInput" + ii).spectrum({
          color: "#ffffff"
        });
        $("#colourInput" + ii).on("move.spectrum", function (e, color) {

          var themeColours = theme.segments;
          console.log("ii:" + ii);
          console.log("themeColours:" + themeColours);
          themeColours[ii].colour = [color._r, color._g, color._b];
          updateColourmap(themeColours);
          previewMapRenderUpdate(_model); // todo add model
        });

      })(i);
    }
  }
   */


</script>

<style>

  </style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .fadeInLeaf{
    opacity: 1 !important;
  }

  .leaf{
    transition: opacity 0.5s;
    opacity: 0;
  }


  /deep/ .v-text-field .v-label--active {
    -webkit-transform: translateY(-10px) scale(0.90) !important;
    transform: translateY(-10px) scale(0.90) !important;;
    font-weight: bold;
    color: #7493c1;
  }

  .disabledText{
    opacity: 0.5;
  }


  html, body{
    height: 100%;
    width: 100%;
    overflow: hidden;
  }
</style >

<style scoped>

  @-webkit-keyframes themeDescriptionPopUpFadeOut {
    0% {opacity:1;}
    100% {opacity:0;}
  }
  @keyframes themeDescriptionPopUpFadeOut {
    0% {opacity:1;}
    100% {opacity:0;}
  }
  .themeDescriptionPopUpFadeOut {
    opacity:0;
    -moz-animation   : themeDescriptionPopUpFadeOut 0.25s linear;
    -webkit-animation: themeDescriptionPopUpFadeOut 0.25s linear;
    animation        : themeDescriptionPopUpFadeOut 0.25s linear;
  }

  /* ------------------------------------------------------ */



  .tab-content{
    padding-left: 0px;
    padding-right: 0px;

  }

  .cartbutton{
    border-radius: 0px;
    padding: 0px;
    margin: 0px;
    text-transform: none;
    height: 65px;
  }

  .cartbuttonmobile{
    padding-right: 20px;
    padding-left: 20px;
    border-radius: 0px;
    border-top-left-radius: 4px;
    text-transform:none;
    height: calc( 100% + 7px );
    bottom: 7px;
    margin: 0px;
    font-size: 16px;
  }

  .content {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    flex: 1 1 auto;
  }

  .map-canvas {
    position: relative;
    cursor: pointer;
    background-color: #aeaeae;
    /*  make this a bit darker than the background */
  }

  .map-canvas-black-frame-adjust{
    background-color: #3f3f3f !important;      /*  make this a bit darker to blend better with the black frame */
  }



  .flexrow {
    display: flex;
    flex-direction: row;
    margin: 8px 0px;
  }

  .item {
    flex: 1;
  }

  /* ----------------------------------------------------------------------------  */
  /*  ACCORDIAN */

  .accordion {
    background-color: #f8f8f8;
    color: #444;
    cursor: pointer;
    padding: 13px;
    width: 100%;
    text-align: left;
    outline: none;
    font-size: 17px;
    min-width: 30px;
    align-items: center;
    align-content: center;
    justify-content: center;
    border-radius: 0px;
    font-size: 1em;
    transition: 1.0s;
  }

  .active, .accordion:hover {
    background-color: #ddd;
  }

  .accordion:after {
    content: '\002B';
    color: #777;
    font-weight: bold;
    float: right;
    margin-left: 5px;
  }

  .active:after {
    content: "\2212";
  }

  .editpanel {
    padding: 0 10px;
    background-color: white;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    border-bottom: 0px solid #ccc;
    border-top: 1px solid #ccc;
  }

  .panelactive{
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;

  }

  .labelblock{
    margin: 10px 15px 0px 0px;
  }

  /* ----------------------------------------------------------------------------  */
  /*   */

  hr {
    display: block;
    height: 1px;
    border: 0;
    border-top: 1px solid #dddddd;
    margin: 10px 10px;
    padding: 0;
  }

  input {
    width: 100%;
    padding: 5px 5px;
    margin: 8px 0;
    box-sizing: border-box;
    border: 1px solid gray;
  }

  /*
  Labels liek road and water colour
  */
  label{
    display: flex;
    flex: 0 0 auto;
    margin: 0px 15px 0px 0px;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
    color: #333333;
    font-weight: 600;

  }



  .noselect {
    -webkit-touch-callout: none; /* iOS Safari */
    -webkit-user-select: none; /* Safari */
    -khtml-user-select: none; /* Konqueror HTML */
    -moz-user-select: none; /* Firefox */
    -ms-user-select: none; /* Internet Explorer/Edge */
    user-select: none; /* Non-prefixed version, currently
                                  supported by Chrome and Opera */
  }



</style>
