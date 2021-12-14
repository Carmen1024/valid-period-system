export const commonColor= [
    "#fc758e","#F9CDAD","#4fbdaa","#5169ca","#f15369","#b8d38f",
    "#f2debd","#ffe543","#cf8888",
    "#d9b8f1","#f28a63","#ed987b","#ac5e74","#b8d38f","#b8f1ed",

];

export const commonColorList = commonColor.map(c=>[c,getColorRgb(c,'.1')]);

// export function getColorList(color){

// }

// 获取rgba颜色
export function getColorRgb(color,opacity=1){
    var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    var sColor = color.toLowerCase();
    if(sColor && reg.test(sColor)){
      if(sColor.length === 4){
        var sColorNew = "#";
        for(var i=1; i<4; i+=1){
          sColorNew += sColor.slice(i,i+1).concat(sColor.slice(i,i+1));	
        }
        sColor = sColorNew;
      }
      //处理六位的颜色值
      var sColorChange = [];
      for(var i=1; i<7; i+=2){
        sColorChange.push(parseInt("0x"+sColor.slice(i,i+2)));	
      }
    //   return "rgba(" + sColorChange.join(",") + ")";
      return `rgba(${sColorChange.join(",")}${(opacity==1 || opacity=="100%") ? "" : ","+opacity})`
    }else{
      return sColor;	
    }
  }

//获得随机颜色
