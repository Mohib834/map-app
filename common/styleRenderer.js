/* eslint no-use-before-define: 0 */  // --> OFF
/* eslint-disable */
var commonGlobals = require('./commonGlobals');
var canvasUtils =  require('./canvasUtils' );

var _commonFontObject_light;
var _commonFontObject_regular;

var DEBUG_DRAW = false;
module.exports = {





  setFonts:function(lightFont, regularFont)
  {
    _commonFontObject_light = lightFont;
    _commonFontObject_regular = regularFont;
  },

  createBarStyle1: function(ctx, canvasw, canvash, itemData, x=0, y= 0)
  {

    var styleParams = commonGlobals.style1Params;

    var textcolours = itemData.textcolours;
    console.log("textcolours", textcolours);
    var printBound =  {x:x,y:y, w: canvasw, h:canvash};// getPrintBound(imageData);
    var previewbound = commonGlobals.getPreviewStyleBound(itemData);
    var ppi = commonGlobals.getPPI(printBound.w, itemData.printSizeID,itemData.orientationID);

    var baseRatio = commonGlobals.getStyleBaseRatio(itemData.printSizeID,itemData.orientationID);
    var baseSize = Math.min(printBound.h,printBound.w);
    //var bordersize = Math.round(baseSize*commonGlobals.BORDER_RATIO);  // this ratio should match with the preview ratio on the site mapWidget
    var bordersize = Math.round( ppi * commonGlobals.BORDER_SIZE_IN_INCHES);
    //var ratio =(printBound.w / previewbound.w) * baseRatio ;
    var ratio = ppi * baseRatio;

    var sideMargin = (itemData.border) ? bordersize :  styleParams.cardSideMarginWhenNoBorder*ratio ;
    // draw
    var posLeft = this.getPositionFromRatioInBound(printBound, 0, 1);
    var posRight = this.getPositionFromRatioInBound(printBound, 1, 1);

    posLeft.x += sideMargin;
    posRight.x -= sideMargin;

    var cardBottomMarginWhenNoBorder = styleParams.cardBottomMarginWhenNoBorder*ratio;

    var bottomH = (itemData.border) ? bordersize : cardBottomMarginWhenNoBorder;
    posLeft.y -= bottomH; // bottom of the card
    posRight.y -= bottomH; // bottom of the card

    // draw from the bottom
    var textMarginBottomTextLeft = styleParams.textMarginBottomTextLeft*ratio;
    // var textMarginTop = styleParams.textMarginTopInInches*ratio;
    var textMarginBottomTextRight = styleParams.textMarginBottomTextRight*ratio;
    //var text1H = styleParams.text1H*ratio;
//  var text2H = styleParams.text2H*ratio;
    var text3H = styleParams.text3H*ratio;
    var text1FontSize = styleParams.text1FontSize*ratio;
    var text2FontSize = styleParams.text2FontSize*ratio;
    var text3FontSize = styleParams.text3FontSize*ratio;
    var cardHeight =  styleParams.cardHeightInInches*ratio; //textMarginBottomTop + textMarginBottomTop + 30;
    var tempText1Pos = null;
    var tempText2Pos = null;
    var tempText3Pos = null;

    var uppercase = styleParams.uppercase;
    var text1 = this.transformText(itemData.text1, uppercase);
    var text2 = this.transformText(itemData.text2, uppercase);
    var text3 = this.transformText(itemData.text3, uppercase);
    var text1FontWeight = styleParams.text1FontWeight;
    var text2FontWeight = styleParams.text2FontWeight;
    var text3FontWeight = styleParams.text3FontWeight;
    var font1 = this.getFont(text1FontWeight);
    var font2 = this.getFont(text2FontWeight);
    var font3 = this.getFont(text3FontWeight);

    var leftColumnHeight = 0;
    var rightColumnHeight = 0;

    // go from the bottom up
    let textBaseline = "bottom";
    // LEFT COLUMN HAS TEXT1
    var tempy = posLeft.y - textMarginBottomTextLeft;
    if(itemData.text1 != "") {
      //ctx.font = text1FontSize + 'px ' + fontFamily;
      tempText1Pos = {x:posLeft.x, y: tempy};
      //  tempy -= text1H;
      // leftColumnHeight += text1H;
    }

    // RIGHT COLUMN HAS TEXT2, TEXT3
    tempy = posLeft.y - textMarginBottomTextRight;

    if(itemData.text3 != "") {
      //ctx.font = text3FontSize + 'px ' + fontFamily;
      tempText3Pos = {x:posRight.x, y: tempy};
      tempy -= text3H;
      rightColumnHeight += text3H;
    }
    if(itemData.text2 != "") {
      //ctx.font = text2FontSize + 'px ' + fontFamily;
      tempText2Pos = {x:posRight.x, y: tempy};
      // tempy -= text2H;
      // rightColumnHeight += text2H;
    }
    //cardHeight += Math.max(leftColumnHeight, rightColumnHeight);
    ctx.fillStyle = "#FFFFFF";
    var fillHeight = Math.round( bottomH + cardHeight);
    ctx.fillRect(printBound.x , printBound.y + printBound.h - fillHeight, printBound.w, fillHeight);
    //

    if(DEBUG_DRAW) {
      // test debug
      this.debugDrawLineY(ctx,posLeft.y - textMarginBottomTextLeft, "orange");
      this.debugDrawLineY(ctx,printBound.y + printBound.h - 1, "red");
      this.debugDrawLineY(ctx,tempText1Pos.y, "blue");
      this.debugDrawFrameOverlap(ctx, printBound, ppi);
    }

    ctx.fillStyle = 'black';
    if(tempText1Pos) {
      //ctx.textAlign = 'left';
      //ctx.font = text1FontSize + 'px ' + fontFamily;
      //ctx.fillText(model.text1, tempText1Pos.x, tempText1Pos.y);
      canvasUtils.fillText(ctx, text1, tempText1Pos.x, tempText1Pos.y, font1, text1FontSize, 'left', textBaseline, [textcolours[0].colour]);

    }
    if(tempText2Pos){
      //ctx.textAlign = 'right';
      //ctx.font = text2FontSize + 'px ' + fontFamily;
      /// ctx.fillText(model.text2, tempText2Pos.x, tempText2Pos.y);
      canvasUtils.fillText(ctx, text2, tempText2Pos.x, tempText2Pos.y, font2, text2FontSize, 'right', textBaseline, [textcolours[1].colour]);

    }
    if(tempText3Pos){
      // ctx.textAlign = 'right';
      // ctx.font = text3FontSize + 'px ' + fontFamily;
      // ctx.fillText(model.text3, tempText3Pos.x, tempText3Pos.y);
      canvasUtils.fillText(ctx, text3, tempText3Pos.x, tempText3Pos.y, font3, text3FontSize, 'right', textBaseline, [textcolours[2].colour]);
    }

  },

  createFloatingCardStyle2: function(ctx, canvasw,canvash, itemData, x=0, y=0)
  {

    var textcolours = itemData.textcolours;
    console.log("textcolours", textcolours);

//    let fontObject = opentype.loadSync(__dirname + '/fonts/roboto/Roboto-Light.ttf');

    // create a canvas, draw to it. then add the text and such
    var previewbound = commonGlobals.getPreviewStyleBound(itemData);

    var printBound =  {x:x,y:y, w: canvasw, h:canvash};// getPrintBound(imageData);
    var baseRatio = commonGlobals.getStyleBaseRatio(itemData.printSizeID,itemData.orientationID);

    console.log("++++++++++++++++++ baseRatio",baseRatio);
    var baseSize = Math.min(printBound.h,printBound.w);
    //var bordersize = Math.round(baseSize*commonGlobals.BORDER_RATIO);  // this ratio should match with the preview ratio on the site mapWidget
    var ppi = commonGlobals.getPPI(canvasw, itemData.printSizeID, itemData.orientationID);
    var bordersize = ppi * commonGlobals.BORDER_SIZE_IN_INCHES;
    var scaleratio =(printBound.w / previewbound.w) ;
    var ratio = ppi * baseRatio ;
    console.log("++++++++++++++++++ ratio",ratio);
    console.log("++++++++++++++++++ previewbound",previewbound);
    console.log("++++++++++++++++++ printBound",printBound);

    // floating
    // calculate from the bottom
    let w = canvasw;
    let h = canvash;
    var overlapsize = commonGlobals.PICTURE_FRAME_OVERLAP_GAP * ppi;

    var styleParams = commonGlobals.style2Params;

    var pos = this.getPositionFromRatioInBound(printBound, 0.5, 1);
    var bottomH =  styleParams.cardBottomMargin*ratio  +( (itemData.border) ? bordersize :  overlapsize) ; //styleParams.bottomYRatio *baseSize;
    pos.y -= bottomH; // bottom of the card
    // draw from the bottom
    console.log("styleParams.cardBottomMargin", styleParams.cardBottomMargin);
    console.log("ratio", ratio);
    console.log("bottomH", bottomH);

    // keep as numbers in a commonglobals
    var textMarginBottomTop = styleParams.textMarginBottomTop *ratio;
    var textMarginLeftRight = styleParams.textMarginLeftRight *ratio;
    var text1H =  styleParams.text1H *ratio;
    var text2H =  styleParams.text2H * ratio;
    var text3H = styleParams.text3H * ratio ;
    var text1FontSize = styleParams.text1FontSize *ratio;
    var text2FontSize = styleParams.text2FontSize *ratio;
    var text3FontSize = styleParams.text3FontSize *ratio;

    var cardWidth = 0;
    var cardHeight =  (textMarginBottomTop *2);
    var tempText1Pos = null;
    var tempText2Pos = null;
    var tempText3Pos = null;
    var uppercase = styleParams.uppercase;
    var text1 = this.transformText(itemData.text1, uppercase);
    var text2 = this.transformText(itemData.text2, uppercase);
    var text3 = this.transformText(itemData.text3, uppercase);
    var fadeHeight = styleParams.fadeHeight*ratio;
    var text1FontWeight = styleParams.text1FontWeight;
    var text2FontWeight = styleParams.text2FontWeight;
    var text3FontWeight = styleParams.text3FontWeight;
    var font1 = this.getFont(text1FontWeight);
    var font2 = this.getFont(text2FontWeight);
    var font3 = this.getFont(text3FontWeight);

    // go from the bottom up
    let textBaseline = "bottom";
    var tempy = pos.y - textMarginBottomTop;
    if(itemData.text3 != "") {
      //ctx.font = text3FontSize + 'px ' + fontFamily;
      tempText3Pos = {x:pos.x, y: tempy};
      tempy -= text3H;
      cardHeight += text3H;

      cardWidth = Math.max(cardWidth, canvasUtils.measureText(text3, font3, text3FontSize).width );
      //cardWidth = Math.max(cardWidth, ctx.measureText(model.text3).width );
    }
    if(itemData.text2 != "") {
      //ctx.font = text2FontSize + 'px ' + fontFamily;
      tempText2Pos = {x:pos.x, y: tempy};
      tempy -= text2H;
      cardHeight += text2H;
      cardWidth = Math.max(cardWidth, canvasUtils.measureText(text2, font2, text2FontSize).width );
    }
    if(itemData.text1 != "") {
      // ctx.font = text1FontSize + 'px ' + fontFamily;
      tempText1Pos = {x:pos.x, y: tempy};
      tempy -= text1H;
      cardHeight += text1H;
      cardWidth = Math.max(cardWidth, canvasUtils.measureText(text1, font1, text1FontSize).width );
    }

    const TEXTBOUNDPIXELGAP =5; /// this is constant for measureText regardless of font size, so we need to manually scale it up to match the preview
    cardWidth += 2*( TEXTBOUNDPIXELGAP* (scaleratio) );
    cardWidth += textMarginLeftRight*2;

    var cardX = pos.x - cardWidth/2;
    var cardY = pos.y - cardHeight;

    console.log("Text preview cardSize:", cardX ,cardY, cardWidth, cardHeight )
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(cardX , cardY, cardWidth, cardHeight);
    //

    if(DEBUG_DRAW)
    {
      this.debugDrawFrameOverlap(ctx, printBound);
    }

    ctx.fillStyle = 'black';
    //ctx.textAlign = 'center';
    if(tempText1Pos) {
      //ctx.font = text1FontSize + 'px ' + fontFamily;
      canvasUtils.fillText(ctx, text1, tempText1Pos.x, tempText1Pos.y, font1, text1FontSize, 'center', textBaseline, [textcolours[0].colour]);
    }
    if(tempText2Pos){
      //ctx.font = text2FontSize + 'px ' + fontFamily;
      //ctx.fillText(model.text2, tempText2Pos.x, tempText2Pos.y);
      canvasUtils.fillText(ctx, text2, tempText2Pos.x, tempText2Pos.y, font2, text2FontSize, 'center', textBaseline, [textcolours[1].colour]);
    }
    if(tempText3Pos){
      //ctx.font = text3FontSize + 'px ' + fontFamily;
      //ctx.fillText(model.text3, tempText3Pos.x, tempText3Pos.y);
      canvasUtils.fillText(ctx, text3, tempText3Pos.x, tempText3Pos.y, font3, text3FontSize, 'center', textBaseline, [textcolours[2].colour]);

    }
  },

  createGradientStyle3: function(ctx, canvasw,canvash, itemData, x=0, y=0)
  {
    var textcolours = itemData.textcolours;
    console.log("textcolours", textcolours);

    // create a canvas, draw to it. then add the text and such
    var previewbound = commonGlobals.getPreviewStyleBound(itemData);

    var printBound =  {x:x,y:y, w: canvasw, h:canvash};// getPrintBound(imageData);
    var baseRatio = commonGlobals.getStyleBaseRatio(itemData.printSizeID,itemData.orientationID);

    console.log("++++++++++++++++++ baseRatio",baseRatio);
    var baseSize = Math.min(printBound.h,printBound.w);
    //var bordersize = Math.round(baseSize*commonGlobals.BORDER_RATIO);  // this ratio should match with the preview ratio on the site mapWidget
    var ppi = commonGlobals.getPPI(canvasw, itemData.printSizeID, itemData.orientationID);
    var bordersize = ppi * commonGlobals.BORDER_SIZE_IN_INCHES;
    var scaleratio =(printBound.w / previewbound.w) ;
//  var ratio =(printBound.w / previewbound.w) * baseRatio ;
    var ratio = ppi * baseRatio ;

    console.log("++++++++++++++++++ ratio",ratio);
    console.log("++++++++++++++++++ previewbound",previewbound);
    console.log("++++++++++++++++++ printBound",printBound);

    // floating
    // calculate from the bottom
    let w = canvasw;
    let h = canvash;


    let styleParams = commonGlobals.style3Params;
    var pos = this.getPositionFromRatioInBound(printBound, 0.5, 1);

    var bottomH;
    bottomH = Math.round( styleParams.cardBottomMargin*ratio); // styleParams.bottomYRatio*printBound.h;

    //console.log("styleParams.bottomYRatio",styleParams.bottomYRatio);
    console.log("bottomH",bottomH);
    var PICTURE_FRAME_OVERLAP_GAP = 0.25; // 1.4 gap between frame
    var pictureFrameOverlapGap = PICTURE_FRAME_OVERLAP_GAP * ppi;
    var cardBottomPositionY = printBound.y + Math.round( (itemData.border) ?  printBound.h - bordersize : printBound.h - pictureFrameOverlapGap );


    pos.y  = cardBottomPositionY - bottomH + 1; // bottom of the card
    // draw from the bottom
    var cardTopMargin = styleParams.cardTopMargin*ratio;
    var textMarginLeftRight = styleParams.textMarginLeftRight*ratio;

    var text1H = styleParams.text1H*ratio;
    var text2H = styleParams.text2H*ratio;
    var text3H = styleParams.text3H*ratio;
    var text1FontSize = styleParams.text1FontSize*ratio + 1; // +1 offset to match fullsize
    var text2FontSize = styleParams.text2FontSize*ratio + 1;
    var text3FontSize = styleParams.text3FontSize*ratio + 1;
    var cardHeight =  cardTopMargin ;
    var cardWidth = 0;
    var tempText1Pos = null;
    var tempText2Pos = null;
    var tempText3Pos = null;
    var uppercase = styleParams.uppercase;
    var text1 = this.transformText(itemData.text1, uppercase);
    var text2 = this.transformText(itemData.text2, uppercase);
    var text3 = this.transformText(itemData.text3, uppercase);
    var text1FontWeight = styleParams.text1FontWeight;
    var text2FontWeight = styleParams.text2FontWeight;
    var text3FontWeight = styleParams.text3FontWeight;
    var font1 = this.getFont(text1FontWeight);
    var font2 = this.getFont(text2FontWeight);
    var font3 = this.getFont(text3FontWeight);

    // go from the bottom up
    var textBaseline =  'bottom';
    ctx.textBaseline = "bottom";
    var tempy = pos.y ;
    if((text3 != "") && (text3 != null)) {
      tempText3Pos = {x:pos.x, y: tempy};
      tempy -= text3H;
      cardHeight += text3H;
      cardWidth = Math.max(cardWidth, canvasUtils.measureText(text3, font3, text3FontSize).width );

    }
    if((text2 != "") && (text2 != null)) {
      tempText2Pos = {x:pos.x, y: tempy};
      tempy -= text2H;
      cardHeight += text2H;
      cardWidth = Math.max(cardWidth,  canvasUtils.measureText(text2, font2, text2FontSize).width );
    }
    if((text1 != "") && (text1 != null)) {
      tempText1Pos = {x:pos.x, y: tempy};
      tempy -= text1H;
      cardHeight += text1H;
      cardWidth = Math.max(cardWidth, canvasUtils.measureText(text1, font1, text1FontSize).width );
    }

    cardWidth += textMarginLeftRight*2;
    var cardX = pos.x - cardWidth/2;
    var cardY = pos.y - cardHeight;

    console.log("Text preview cardSize:", cardX ,cardY, cardWidth, cardHeight );
    ctx.fillStyle = "#FFFFFF";

    if(DEBUG_DRAW)
    {
      // test debug
      this.debugDrawLineY(ctx, cardY, "orange");
      this.debugDrawFrameOverlap(ctx, printBound);
    }

    ctx.save();

    let fadeY1 = cardY;
    let fadeY2 = cardBottomPositionY  ;

    var grd = ctx.createLinearGradient(0, fadeY1, 0, fadeY2);
    grd.addColorStop(0, 'rgba(255,255,255,0)');
    //grd.addColorStop(0.24, 'rgba(255,255,255,0.08)');
    grd.addColorStop(0.25, 'rgba(255,255,255,0.5)');
    grd.addColorStop(0.5, 'rgba(255,255,255,1)');

    ctx.fillStyle = grd;
    ctx.fillRect(printBound.x ,printBound.y + fadeY1, printBound.w,fadeY2 - fadeY1 );
    ctx.restore();

    // draw a solid block to fill in the bottom for the frame overlap, if theres a border then its already covered
    if(!itemData.border)
    {
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0 , fadeY2, printBound.w, printBound.h - fadeY2 + 2 );
    }

    //ctx.fillStyle = 'black';
    //ctx.textAlign = 'center';

    if(tempText1Pos) {
      canvasUtils.fillText(ctx, text1, tempText1Pos.x, tempText1Pos.y, font1, text1FontSize, 'center', textBaseline, [textcolours[0].colour]);
      // hline(ctx,tempText1Pos.y);
    }
    if(tempText2Pos){
      canvasUtils.fillText(ctx, text2, tempText2Pos.x, tempText2Pos.y, font2, text2FontSize, 'center', textBaseline, [textcolours[1].colour]);
      // hline(ctx,tempText2Pos.y);
    }
    if(tempText3Pos){
      canvasUtils.fillText(ctx, text3, tempText3Pos.x, tempText3Pos.y, font3, text3FontSize, 'center', textBaseline, [textcolours[2].colour]);
      //  hline(ctx,tempText3Pos.y);
    }

  },




  getPositionFromRatioInBound: function(bound,rx,ry)
  {
    return {x: bound.x + bound.w*rx, y: bound.y + bound.h*ry}
  },

  debugDrawBorder: function(ctx, border, w,h){
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, w, border);
    ctx.fillRect(0, h- border, w, border);
    ctx.fillRect(0, 0, border, h);
    ctx.fillRect(w-border, 0, border, h);
    ctx.restore();
  },

  transformText: function(text,uppercase)
  {
    if(text == null) return null;
    if(uppercase) return text.toUpperCase();
    return text;
  },

  getFont: function(fontWeight)
  {
    if(fontWeight == 'regular') return _commonFontObject_regular;
    return _commonFontObject_light;
  },

//draw the half cm overlap to check
  debugDrawFrameOverlap: function(ctx, printBound, dpi)
  {
    // draw debug 0.5cm overlap with a frame
    ctx.fillStyle = "green";
    var frameOverlapGap = dpi * commonGlobals.PICTURE_FRAME_OVERLAP_GAP;
    ctx.fillRect(0, printBound.h - frameOverlapGap, printBound.w, 2);
    ctx.fillRect(frameOverlapGap, 0, 2, printBound.h);
    ctx.fillRect(printBound.w - frameOverlapGap, 0, 2, printBound.h);
    ctx.fillRect(0, frameOverlapGap, printBound.w, 2);
  },

  debugDrawLineY: function(ctx,y, col = "red")
  {
    ctx.save();
    ctx.fillStyle =col;
    ctx.fillRect(0, y, 20000 ,  2);
    ctx.restore();
  },

  //helper
  // fit to bound while maintaining ratio. used to center the image inside the border
  getScaleToFillBound: function(canvasWidth, canvasHeight, bound)
  {
    var canvasRatio = canvasWidth / canvasHeight;
    var ratioBound = bound.w / bound.h;
    if (canvasRatio > ratioBound) {
      // fit to height
      var h = bound.h;
      var scale = h / canvasHeight;
      var w = scale * canvasWidth;
      var y = bound.y;
      var x = bound.x -  (w - bound.w) / 2; // centerx
      console.log("getScaleToFillBound", x,y,w,h);
      console.log("getScaleToFillBound", canvasWidth,canvasHeight);

      return {x: x, y: y, w: w, h: h};
    } else {
      // fit to width
      var w = bound.w;
      var scale = w / canvasWidth;
      var h = scale * canvasHeight;
      var x = bound.x;
      var y = bound.y - (h - bound.h) / 2; // centery
      return {x: x, y: y, w: w, h: h};
    }
  },

  drawBorder: function(ctx, border, w,h, x = 0, y = 0){
    ctx.save();
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, w, border);
    ctx.fillRect(x,  y + h- border, w, border);
    ctx.fillRect(x, y, border, h);
    ctx.fillRect(x + w-border, y, border, h);
    ctx.restore();
  },

  getBorderBound : function(bordersize, canvasWidth, canvasHeight)
  {
    var innerBound = {x: bordersize, y:bordersize ,w: canvasWidth - 2*bordersize, h: canvasHeight-  2*bordersize};
    return innerBound;
  }

};