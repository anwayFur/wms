var inputSelect = new Vue({
    el: '#inputSelect',
    prop: {},
    data: function () {
        return {
            baseArehouses: window.dbmessage.baseArehouses,
            watchView: false,                   //观察状态量-是否为查看
            inputSelect: [],
            multipleSelection: [],
            multiSelect: false,
            pickerOptions:_pickerOptions(),
            showLoading: false,
            currentPage: 1,
            pageSize: 10,
            currentTotal:0,
            date: [null, null],                 //主页面 选择日期 搜索
            rkRkdjNo: '',                       //主页面 入库单号 搜索
            rkStatus:'',                           //主页面 单据状态
            rkArehouseId: window.dbmessage.baseArehouses[0].baArehouseId,             //主页面 仓库 搜索
            formLabelWidth: '120px',          //表单 配置
            form: _form(),                       //表单 弹出层 信息集合
            dialogFormActive: 0,              //新建 弹出层 steps 当前进度
            dialogFormVisible: false,         //新建 弹出层 是否可见
            submitLoading: false,             //新建 弹出层 提交等待

            //detailed: formDetailed(), //表单           //查看入库明细信息 弹出层 信息集合(表单格式)
            detailed:[],
            dialogDetailedVisible: false,    //查看入库明细信息 弹出层 是否可见

            storage: [],           //查看入库储位信息 弹出层 信息集合
            dialogStorageVisible: false,     //查看入库储位信息 弹出层 是否可见

            select: _form(),                      //搜索 弹出层 信息集合,
            printf: [],                         //搜索 弹出层 信息集合,
            dialogSelectVisible: false,
            dialogPrintfVisible: false,
            selectLoading: false,
            printfLoading: false,

            printDatas: [],          // 打印数据
        }
    },
    computed: {
        // TODO 表格提交
        option: function () {
            return {
                "draw": 1,
                "pageNum": this.currentPage,
                "pageSize": this.pageSize,
                "djzt":this.rkStatus,
                "rkdh":this.rkRkdjNo.trim(),
                "xdsjStart":tsf_date(this.date[0]),
                "xdsjEnd":tsf_date(this.date[1]),
                "ckId":this.rkArehouseId,
            }
        },
        form_pop:function(){
            return{
                "draw": 1,
                "pageNum": this.currentPage,
                "pageSize": this.pageSize,
                "xdsjStart": tsf_date(this.form.rkCreatetime[0]),
                "xdsjEnd": tsf_date(this.form.rkCreatetime[1]),
                "sjsjStart": tsf_date(this.form.rkSjsj),
                "sjsjEnd": tsf_date(this.form. rkEndTime),
                "rkdh": this.form.rkRkdjNo,
                "djzt": this.form.rkStatus,
                "zzfs": this.form.rkZdfs,
                "czfs": this.form.rkStartwith,
                "ckId":this.form.rkArehouseId,
            }
        },
        search: function () {
            return {
                "draw": 1,
                "pageNum": this.currentPage,
                "pageSize": this.pageSize,
                "rkrwN": this.form.rkrwN,
                "rkrwCph": this.form.rkrwCph,
                "dds": this.form.dds,
                "pxs": this.form.pxs,
                "rkrwSjxm": this.form.rkrwSjxm,
                "rkrwDhrq": this.form.rkrwDhrq,
                "rkrwDbd": this.form.rkrwDbd,
                "rkrwCys": this.form.rkrwCys,
                "rkrwDh": this.form.rkrwDh,
                "rkrwStatus": this.form.rkrwStatus
            }
        },
        distributionForm: function () {
            return {
                distribution: this.distribution
            }
        },                                      //分配 表单
    },
    methods: {
        inlineExportInputList:function(index,row){
            obj.$confirm('导出出库单 单据单号：' + row.rjdkNo, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                p[3].post({
                    ids: [row.rkRkdjId]
                }, function (json) {
                    this.callbackAfter({status: json.status, model: "导出入库单"}, function () {
                        var url = "/static/Excel/" + json.model;
                        window.open(url);
                    })
                });
            }).catch(function () {
                obj.$message({
                    type: 'info',
                    message: '已取消导出'
                });
            });
        },                                        //TODO 行内按钮-导出入库单
        inlineExportInputDetailed:function(index,row){
            obj.$confirm('导出入库单 单据单号：' + row.rjdkNo, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                p[4].post({
                    ids: [row.rkRkdjId]
                }, function (json) {
                    this.callbackAfter({status: json.status, model: "导出入库单"}, function () {
                        var url = "/static/Excel/" + json.model;
                        window.open(url);
                    })
                });
            }).catch(function () {
                obj.$message({
                    type: 'info',
                    message: '已取消导出'
                });
            });
        },                                    //TODO 行内按钮-导出入库明细
        inlineExportInputStorage:function(index,row){
            obj.$confirm('导出入库单 单据单号：' + row.rjdkNo, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                p[5].post({
                    ids: [row.rkRkdjId]
                }, function (json) {
                    this.callbackAfter({status: json.status, model: "导出入库单"}, function () {
                        var url = "/static/Excel/" + json.model;
                        window.open(url);
                    })
                });
            }).catch(function () {
                obj.$message({
                    type: 'info',
                    message: '已取消导出'
                });
            });
        },                                     //TODO 行内按钮-导出入库储位
        inlineExportInput:function(){},                                            //TODO 行内按钮-导出入库
        inlineSelectInputDetailed:function(index,row){
            p[1].post({id: row.rkRkdjId}, function (json) {
                obj.detailed = json.model;
                obj.dialogDetailedVisible = true;
            })
        },                        //TODO 行内按钮-查看入库明细信息
        inlineSelectInputStorage:function(index,row){
            p[2].post({id: row.rkRkdjId}, function (json) {
                obj.storage = json.model;
                obj.dialogStorageVisible = true;
            })


        },                         //TODO 行内按钮-查看入库储位信息
        multiSelectClick: function () {
            this.multiSelect = !this.multiSelect;
        },                                      //多选 状态维护
        multiSelectionChange: function (val) {
            /*<debug>*/
            console.log(this.multipleSelection);
            /*</debug>*/
            this.multipleSelection = val;
        },                               //TODO 多选 选中控制
        multiExportInputList: function () {
            obj.$confirm('确定导出入库单据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                var ids = [];
                for (var i = 0; i < obj.multipleSelection.length; i++) {
                    ids.push(obj.multipleSelection[i].rkRkdjId);
                }
                p[3].post({
                    ids: ids
                }, function (json) {
                    json.status = 20000; //TODO
                    this.callbackAfter({status: json.status, model: "导出入库单"}, function () {
                        var url = "/static/Excel/" + json.model;
                        window.open(url);
                    })
                });
            }).catch(function () {
                obj.$message({
                    type: 'info',
                    message: '已取消导出'
                });
            });

        },                                  //TODO 多选 导出入库单
        multiExportInputDetailed: function () {
            obj.$confirm('确定导出入库单明细?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                var ids = [];
                for (var i = 0; i < obj.multipleSelection.length; i++) {
                    ids.push(obj.multipleSelection[i].rkRkdjId);
                }
                p[4].post({
                    ids: ids
                }, function (json) {
                    json.status = 20000; //TODO
                    this.callbackAfter({status: json.status, model: "导出入库单明细"}, function () {
                        var url = "/static/Excel/" + json.model;
                        window.open(url);
                    })
                });
            }).catch(function () {
                obj.$message({
                    type: 'info',
                    message: '已取消导出'
                });
            });

        },                              //TODO 多选 导出入库明细
        multiExportInputStorage: function () {
            obj.$confirm('确定导出入库储位?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                var ids = [];
                for (var i = 0; i < obj.multipleSelection.length; i++) {
                    ids.push(obj.multipleSelection[i].rkRkdjId);
                }
                p[5].post({
                    ids: ids
                }, function (json) {
                    json.status = 20000; //TODO
                    this.callbackAfter({status: json.status, model: "导出入库储位"}, function () {
                        var url = "/static/Excel/" + json.model;
                        window.open(url);
                    })
                });
            }).catch(function () {
                obj.$message({
                    type: 'info',
                    message: '已取消导出'
                });
            });
        },                               //TODO 多选 导出入库储位
        multiExportInput: function () {
            obj.$confirm('确定导出入库储位?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(function () {
                var ids = [];
                for (var i = 0; i < obj.multipleSelection.length; i++) {
                    ids.push(obj.multipleSelection[i].rkRkdjId);
                }
                p[5].post({
                    ids: ids
                }, function (json) {
                    json.status = 20000; //TODO
                    this.callbackAfter({status: json.status, model: "导出入库储位"}, function () {
                        var url = "/static/Excel/" + json.model;
                        window.open(url);
                    })
                });
            }).catch(function () {
                obj.$message({
                    type: 'info',
                    message: '已取消导出'
                });
            });
        },                                      //TODO 多选 导出入库
        handleSizeChange: function (val) {
            /*<debug>*/
            console.log('每页' + val + '条');
            /*</debug>*/
            this.pageSize = val;
            p[0].post( (_option ? this.form_pop : this.option));
        },                                   //分页 Size
        handleCurrentChange: function (val) {
            /*<debug>*/
            console.log('当前第' + val + '页');
            /*</debug>*/
            this.currentPage = val;
            p[0].post( (_option ? this.form_pop : this.option));
        },                                //分页 当前页
        prev: function () {
            this.dialogFormActive--;
            this.$refs.carousel.prev();
        },                                                  //新建 弹出层banner控制 前一个
        next: function () {
            this.dialogFormActive++;
            this.$refs.carousel.next();
        },                                                  //新建 弹出层banner控制 后一个
        submit: function () {
            var _this = this;
            this.dialogFormActive++;
            this.submitLoading = true;
            //TODO 此处应是ajax请求
            setTimeout(function () {
                _this.submitLoading = false;
                _this.$notify({
                    title: '成功',
                    message: '保存成功！',
                    type: 'success'
                });
                _this.dialogFormVisible = false;
                _this.form = {
                    rkRkdjNo: '',
                    rkType: '',
                    rkRemarks: '',
                    rkDocsList: [],
                    bgGoodsNo: '',
                    selectGood: {
                        value: '',
                        bgGoodsName: '',
                        count: 0,
                        bgGoodsId: ''
                    },
                    saveARkDocsList: true,
                    deleteARkDocsList: true
                };
                _this.dialogFormActive = 0;
                _this.$refs.carousel.setActiveItem(0);
                p[0].post();
            }, 1500);
        },                                                //新建 表单提交
        selectSubmit: function () {
            _option = true;
            p[0].post(obj.form_pop);
            this.dialogSelectVisible = false;
        },                                          //详细查询 提交
        printfSubmit: function () {
            var datas=[];
            var checkData=inputSelect.$refs.printf.getCheckedNodes();
            for(var i in checkData){
                if(typeof checkData[i].val2!=='undefined'){
                    datas.push(checkData[i]);
                }
            }
            this.printDatas=datas;
            this.dialogPelectVisible = !this.dialogPrintfVisible;
            wap.print(this);
        },                                          //打印 提交
        printfCheckChange: function () {

        },                                     //打印 选中维护
        selectInputDetailed: function () {
            this.dialogDetailedVisible = true;
        },                                   //行内按钮-查看入库明细信息
        selectInputStorage: function () {
            this.dialogStorageVisible = true;
        },                                    //行内按钮-入库储位信息
        detailedSubmit: function () {

        },
        storageSubmit: function () {

        },
        printfLoadNode: function (node, resolve) {
            console.log(node.data);
            switch (node.level) {
                case 0:
                    return resolve(this.printf);
                case 1:
                    postRkrwNo(this, {
                        rkrwNo:node.data.rkrwNo,
                        rkrwDhrq:node.data.rkrwDhrq
                    }, resolve);
                    break;
                case 2:
                    console.log(node.data.name);
                    postrkRkdjId(this, {
                        rkrwNo:node.data.rkrwNo,
                        rkrwDhrq:node.data.rkrwDhrq
                    }, resolve);
                    break;
                case 3:
                    return resolve([]);
            }
        },
        auto_rkStatus:function(value){
            var temp={}
            if(!isNaN(value)){
                temp={
                    1:'原始状态',
                    21:'部分分配',
                    22:'全部分配',
                    31:'部分收货',
                    32:'全部收货',
                }
            }else{
                temp={
                    '原始状态':1,
                    '部分分配':21,
                    '全部分配':22,
                    '部分收货':31,
                    '全部收货':32
                }
            }
            return temp[value];
        },                                       //入库状态
        auto_rkZdfs:function(value){
            var temp={}
            if(!isNaN(value)){
                temp={
                    1:'手动',
                    2:'导入',
                    3:'接口',
                }
            }else{
                temp={
                    '手动':1,
                    '导入':2,
                    '接口':3,
                }
            }
            return temp[value];
        },                                         //制单方式
        auto_rkStartwith:function(value){
            var temp={}
            if(!isNaN(value)){
                temp={
                    1:'电脑端',
                    2:'PDA',
                }
            }else{
                temp={
                    '电脑端':1,
                    'PDA':2,
                }
            }
            return temp[value];
        },                                    //操作方式
        auto_rksStatus:function(value){
            var temp={}
            if(!isNaN(value)){
                temp={
                    1:'初始状态',
                    21:'部分分配',
                    22:'全部分配',
                    31:'部分收货',
                    32:'全部收货',
                }
            }else{
                temp={
                    '初始状态':1,
                    '部分分配':21,
                    '全部分配':22,
                    '部分收货':31,
                    '全部收货':32
                }

            }
            return temp[value];
        },                                 //入库明细状态

    },
    watch:{
        rkRkdjNo: function () {
            /*<debug>*/
            console.log((_option ? this.form_pop : this.option));
            /*</debug>*/
            p[0].post((_option ? this.form_pop : this.option));
        },
        rkStatus: function () {
            /*<debug>*/
            console.log((_option ? this.form_pop : this.option));
            /*</debug>*/
            p[0].post((_option ? this.form_pop : this.option));
        },
        rkArehouseId: function () {
            /*<debug>*/
            console.log((_option ? this.form_pop : this.option));
            /*</debug>*/
            p[0].post((_option ? this.form_pop : this.option));
        },


    }
});
// 高级 监视器的 使用方法
inputSelect.$watch('date', function () {
    /*<debug>*/
    console.log((_option ? this.form_pop : this.option));
    /*</debug>*/
    p[0].post( (_option ? this.form_pop : this.option));
}, {deep: true});
function _form() {
    return {
        rkCreatetime:[null,null],      //模糊查询--下单时间
        rkSjsj:'',                      //模糊查询--上架开始时间
        rkEndTime:'',                   //模糊查询--上架结束时间
        rkRkdjNo:'',                    //模糊查询--入库单号
        rkStatus:'',                    //模糊查询--入库状态
        rkZdfs:'',                      //模糊查询--制单方式
        rkStartwith:'',                 //模糊查询--操作方式
        rkArehouseId:'',                //模糊查询 仓库ID
    }
}
var obj=inputSelect;
var p=[];
// 0 入库单据查询 分页查询
p[0] = autoPost({
    urlHock: "/hock/inputSelect/page.json",
    urlProd: "/route/inputSelect/0",
    success: function (json) {
        obj.$data.inputSelect = json.data;
        obj.$data.currentTotal = json.recordsFiltered;
    }
});
// 1 入库单据查询 查看入库明细信息
p[1] = autoPost({
    urlHock: "",
    urlProd: "/route/inputSelect/1",
    method:'GET',
    success: function (json) {
        obj.detailed = json.model;
        obj.dialogDetailedVisible = true;
    }
});
// 2 入库单据查询 查看入库储位信息
p[2] = autoPost({
    urlHock: "",
    urlProd: "/route/inputSelect/2",
    method:'GET',
    success: function (json) {
        obj.storage = json.model;
        obj.dialogStorageVisible = true;
    }
});
// 3 入库单据查询 根据入库单ID导出入库单据
p[3] = autoPost({
    urlHock: "",
    urlProd: "/route/inputSelect/3",
    method: 'GET',
    success: function (json) {
    }
});
// 4 入库单据查询 根据入库单ID导出入库明细
p[4] = autoPost({
    urlHock: "",
    urlProd: "/route/inputSelect/4",
    method: 'GET',
    success: function (json) {
    }
});
// 5 入库单据查询 根据入库单ID导出分配储位明细详情
p[5] = autoPost({
    urlHock: "",
    urlProd: "/route/inputSelect/5",
    method: 'GET',
    success: function (json) {
    }
});
// 6 入库单据查询 导出入库
p[6] = autoPost({
    urlHock: "",
    urlProd: "/route/inputSelect/6",
    success: function (json) {
    }
});
function formDetailed() {
    return {
        rksGoodsId: '',     // 货品编号
        rksGoodsId1: '',     // 货品名称
        mdtBatch: '',       // 货品批次
        rksCount: '',       // 货品数量
        bgGoodsTj:'',       //货品体积
        sssl: '',           // 实收数量
        sstj:'',            //实收体积
        rksStatus: '',      //入库明细状态
        sjryName: ''       // 上架人员
    }
}//明细
function formStorage() {
    return {
        rksGoodsId: '',     //货品编号
        rksGoodsId1: '',     //货品名称
        mdtBatch: '',       //货品批次
        mdtLocationId: '',  //上架库位
        mdtCount: '',       //上架数量
        sstj:'',             //实收体积
        sjryName:'',       //上架人员
        mdtSjsj: ''         //上架时间
    }
}//储位


p[0].post( inputSelect.option);


