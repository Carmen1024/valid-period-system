import { selectRegion,selectRegionCode } from '@/api/region'
import { getDataParams,getContent } from '@/utils/dataParams'

const state = {
  regionArr:[],
  regionCode:[],
  regionCodeArr:[],
}

const actions = {
  getRegion({ commit, state },regionCode) {
    
  },
  getRegionCode({ commit, state },item) {
    
  },
}

export function getRegion(code=''){
    const params = getDataParams({"#eq":["code"],"#like":["name"]},{ code });

    selectRegion(params).then(data => {
      state.region = resgetContent(data);
    });
}

export function getRegionCode(item){
  const params = getDataParams({"#like":["rg_name","rg_code"]},item);

  selectRegionCode(params).then(data => {
    state.regionCode = resgetContent(data);
  });
}

