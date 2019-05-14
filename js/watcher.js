//声明订阅者
class Watcher{
  //node代表需要使用订阅功能节点 vm全局对象 callback发布时需要做的事情
  constructor(vm,expr,callback){
    //缓存重要属性
    this.expr=expr;
    this.vm=vm;
    this.cb=callback;
    //缓存当前值
    this.value=this.get();
  }
  //获取当前值
  get(){
    Dep.target=this;
    //获取当前值
    var value=this.vm.$data[this.expr];
    //清空全局
    Dep.target=null;
    return value;
  }
  //提供一个更新办法（应对发布后方法）
  update(){
    //获取新值
    var newVal=this.vm.$data[this.expr];
    //获取老值
    var oldVal=this.value;
    if(newVal!=oldVal){
      //执行回调
      this.cb(newVal)
    }
  }
}
