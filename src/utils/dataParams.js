// 查询数据结构
export function getDataParams(rule,data){
    let dataParams = {};
    for(let index in rule){
        const item = rule[index];
        let indexMap = {};
        item.map((n) => {
            if(index === '#gte' && n === "c_create_time"){
                indexMap["c_create_time"] = data["createTime"];
            }else if(index === '#lte' && n === "c_create_time"){
                indexMap["c_create_time"] = data["endTime"];
            }else{
                indexMap[n] = data[n];
            }
        });
        dataParams[index] = indexMap;
    }
    
    console.log(dataParams);
    return dataParams;
}
// 分页的数据结构
export function getPageParams(rule,data,pageSize,pageIndex){
    let dataParams = {"#content":getDataParams(rule,data)};
    dataParams["#cache"] = "refresh"; //强制刷新后台缓存
    
    dataParams["#content"]["#size"] = pageSize || 10;
    dataParams["#content"]["#start"] = pageIndex || 0;
    return dataParams;
}

export function getContent(data){
    return data["#content"];
}

export function getPageTotal(data){
    const ext = JSON.parse( data["#ext"] );
    return ext.total;
}