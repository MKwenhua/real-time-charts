const Canvas2DContext = require('./canvasprototype.js');

const trendLine = (ctxId) => {
   const container = document.getElementById(ctxId);
   const c = container.querySelector('canvas');
   let ctx2 = Canvas2DContext(c);
   let trendLineColor = false ? "#f70" : "#fff";
   let openPos = [];
   const LineShift = (ctx, x, y, theWid, current) => {
      let num = current.toFixed(2);
      let theY = y + 0.5;

      ctx.beginPath()
      ctx.moveTo(0, theY)
      ctx.lineTo(theWid, theY)
      ctx.lineWidth = 1;
      ctx.strokeStyle = trendLineColor;
      ctx.stroke();
      ctx.beginPath();


      ctx2.beginPath()
         .moveTo(8, (theY - 8))
         .lineTo(0, theY)
         .lineTo(8, (theY + 8))
         .lineTo(8, (theY + 8))
         .strokeStyle("#fff")
         .stroke()
         .fillStyle("#fff")
         .fill()
         .closePath()
         .fillStyle("#fff")
         .fillRect(8, (theY - 8), 38, 16)
         .fillStyle("black")
         .font("11px Arial")
         .textAlign("start")
         .fillText(num, 8, (theY + 4));
   };
   const CallPutLines = (ctx, theWid, converter) => {
      ctx2.clearRect(0, 0, 46, 800);
      let stamp = new Date().getTime();
      if (openPos.length) {
         ctx.save();
         openPos.forEach((itm) => {
            let theY = converter(itm.unitPrice) + 0.5;
            let num = itm.unitPrice.toFixed(2);
            let theColor = itm.type === "CALL" ? "#00FF00" : "#ff0000";
            ctx.beginPath();
            ctx.setLineDash([2, 2]);
            ctx.moveTo(0, theY)
            ctx.lineTo(theWid, theY)
            ctx.lineWidth = 1;
            ctx.strokeStyle = theColor;
            ctx.stroke();

            ctx2.beginPath()
               .moveTo(8, (theY - 8))
               .lineTo(0, theY)
               .lineTo(8, (theY + 8))
               .lineTo(8, (theY + 8))
               .strokeStyle(theColor)
               .stroke()
               .fillStyle(theColor)
               .fill()
               .closePath()
               .fillStyle(theColor)
               .fillRect(8, (theY - 8), 38, 16)
               .fillStyle("black")
               .font("11px Arial")
               .textAlign("start")
               .fillText(num, 8, (theY + 4));
         });
         ctx.restore();
      }
   }

   return {
      lineShift: LineShift,
      callPutLines: CallPutLines,
      newPos: (pos) => {
         openPos = openPos.concat(pos);
      },
      posExpired: (stamp) => {
         openPos = openPos.filter((itm) => {
            return itm.timestamp !== stamp;
         });
      },
      newColor: (color) => {
         trendLineColor = color;
      }
   }
};

module.exports = trendLine;