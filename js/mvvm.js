//解析视图模板
class MVVM{
  constructor(options){
    //缓存重要属性
    this.$vm=this;
    this.$el=options.el;
    this.$data=options.data;
    //判断视图是否存在
    if(this.$el){
      //添加属性观察对象（实现属性劫持）
      new Observer(this.$data)
      //创建模板编译器，解析视图
      this.$compiler=new TemplateCompiler(this.$el,this.$vm);
    }

  }
}
