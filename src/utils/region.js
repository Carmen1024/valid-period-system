import { getDataParams,getContent } from '@/utils/dataParams'
import { selectRegion,selectRegionCode } from '@/api/region';


export function getRegion(code=''){
    const params = getDataParams({"#eq":["code"],"#like":["name"]},{ code });
    return new Promise((resolve,reject)=>{
      selectRegion(params).then(data => {
        resolve(getContent(data));
      });
    });
}

export function getRegionCode(item={}){
  const params = getDataParams({"#like":["rg_name","rg_code"]},item);

  return new Promise((resolve,reject)=>{
    selectRegionCode(params).then(data => {
      // "value":'rg_code',"label":'rg_name'
      const newData = getContent(data).map(item=>{return {...item,value:item.rg_code,label:item.rg_name}});
      resolve(newData);
    });
  });
}

