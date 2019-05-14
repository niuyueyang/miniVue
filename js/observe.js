class Observer{
  constructor(data){
    //提供一个解析方法，完成属性分析
    this.observe(data)
  }
  //解析数据，完成对数据属性劫持
  observe(data){
    //判断数据数据有效性（必须是对象）
    if(!data||typeof data!=='object'){
      return;
    }
    //针对当前的对象属性重新定义
    var keys=Object.keys(data);
    //循环
    keys.forEach((key)=>{
      //重新定义key
      this.defineReactive(data,key,data[key]);
    })
  }
  defineReactive(obj,key,val){
    var dep=new Dep();
    Object.defineProperty(obj,key,{
      enumerable:true,//是否可以遍历
      configurable:false,//是否可以重新配置
      get(){
        //针对watcher创建时，直接完成发布订阅添加
        var watcher=Dep.target;
        Dep.target&&dep.addSub(watcher);

        return val;
      },
      set(newVal){
        val=newVal;
        dep.notify();
      }
    })
  }
}

//创建发布者（管理订阅者，通知）
class Dep{
  constructor(){
    this.subs=[]
  }
  //添加订阅
  addSub(sub){
    this.subs.push(sub);
  }
  //集体通知
  notify(){
    this.subs.forEach((sub)=>{
      sub.update();
    })
  }
}
