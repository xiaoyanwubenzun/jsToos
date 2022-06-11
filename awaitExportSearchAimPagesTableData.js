// 數據導出
function exportToExcel(id){
    var _this = this;
    var fixed_table,data,table_write,total_page,now_data,size;
    var api_arr = [];
    var data_list = [];
    if(_this.total_num === 0){
        // tipsCon("當前查詢項目0條！","center");
        return
    };
    size = 100; //數據分塊大小
    total_page = Math.ceil(_this.total_num/size);
    for(var i=1;i<=total_page;i++){
        api_arr.push({
            now_page: i
        });
    }
    function* loopApi(){
        for(var i = 0; i <api_arr.length; i++){
            now_data = yield _this.getOneSliceData(size,api_arr[i].now_page);
            data_list = data_list.concat(now_data);
            // console.log(api_arr[i].now_page);
        }
        // console.log(data_list);
        vm.exportList = data_list;
    };
    function asyncToGenerator(generatorFunc) {
        return function() {
            var gen = generatorFunc.apply(this, arguments)
            return new Promise((resolve, reject) => {
                function step(key, arg) {
                    var generatorResult
                    try {
                        generatorResult = gen[key](arg)
                    } catch (error) {
                        return reject(error)
                    }

                    // const { value, done } = generatorResult;
                    var value = generatorResult.value;
                    var done = generatorResult.done;

                    if (done) {
                        return resolve(value)
                    } else {
                        return Promise.resolve(value)
                            .then(function (val) {
                                step("next", val)
                            })
                    }
                }
                step("next")
            })
        }
    }
    var yel = asyncToGenerator(loopApi);
    // loadPreview("show");
    _this.un_export = false;
    yel()
        .then(function () {
            tipsCon("數據準備完成，開始導出！","center");
            _this.$nextTick(function () {
                fixed_table = document.querySelector(`#${id}>.el-table__fixed`);
                if(fixed_table){ //判断要导出的节点中是否有fixed的表格，如果有，转换excel时先将该dom移除，然后append回去
                    data = XLSX.utils.table_to_book(document.querySelector(`#${id}`).removeChild(fixed_table));
                    document.querySelector(`#${id}`).appendChild(fixed_table);
                }else{
                    data = XLSX.utils.table_to_book(document.querySelector(`#${id}`));
                }
                table_write = XLSX.write(data, {
                    bookType: "xlsx",
                    bookSST: true,
                    type: "array"
                });
                try {
                    saveAs(
                        new Blob([table_write], { type: "application/octet-stream" }),
                        "機台設置數據.xlsx"
                    );
                } catch (e) {
                    if (typeof console !== "undefined") console.log(e, table_write);
                }
                return table_write;
            })
        })
        .then(function () {
            loadPreview("hide");
            // tipsCon("數據導出完畢！","center");
            vm.exportList = [];
            _this.un_export = true;
        })
        .catch(function (err) {
            loadPreview("hide");
            tipsCon("數據填充出錯！","center");
            _this.un_export = true;
            console.log(err);
        })
};
function getOneSliceData(size,now_page){
    var data,new_pro;
    data = {
        "pageNum": now_page,
        "pageSize": size,
    };
    new_pro = new Promise(function (resolve, reject) {
        doQuery(data)
            .then(function (res) {
                resolve(res.resultMap.resultList);
            })
            .catch(function (err) {
                reject(err);
            })
    })
    return new_pro;
}