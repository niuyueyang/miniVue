//编译{{}},v-命令
/*
* 解析指令
* 1.把模板放入内存中
* 2.在内存中操作
* 3.把内存中结果返回到页面上
* */
class TemplateCompiler{
  //分别代表视图线索，全局MVVM this对象，包含所有内容
  constructor(el,vm){
    //缓存重要属性
    this.el=this.isElementNode(el)?el:document.querySelector(el);
    this.vm=vm;
    //判断是否存在视图
    if(this.el){
      //1.把模板内容放入内存
      var fragment=this.node2fragment(this.el);
      //2.解析模板
      this.compile(fragment);
      //3.把内存中结果返回到页面上
      this.el.appendChild(fragment);
    }
  }
  //工具方法
  isElementNode(node){
    return node.nodeType===1;
  }
  isTextNode(node){
    return node.nodeType===3;
  }
  toArray(fakeArray){
    return [].slice.call(fakeArray)
  }
  isDirective(attrName){
    return attrName.indexOf('v-')>=0;
  }

  //核心方法
  //把模板放入内存等待解析
  node2fragment(node){
    //1.创建内存片断
    var fragment=document.createDocumentFragment(),child;
    //2.把模板内容放到内存
    while(child=node.firstChild){
      fragment.appendChild(child);
    }
    //3.返回内存
    return fragment;
  }
  compile(parent){
    var compiler=this;
    //1.获取子节点
    var chidNodes=parent.childNodes;
    //2.遍历每一个节点
    var arr=this.toArray(chidNodes);
    arr.forEach((node)=>{
      //3.判断节点类型
      if(compiler.isElementNode(node)){
        //元素节点，指令在元素节点身上，解析指令
        compiler.compileElement(node);
      }
      else{
        //文本节点（解析文本）
        var textReg=/\{\{(.+)\}\}/;
        var expr=node.textContent;
        if(textReg.test(expr)){
          expr=RegExp.$1; //取到第一个组，这里{{message}}取到是message
          //调用方法
          compiler.compileText(node,expr)
        }
      }

      //4.如果子节点内部还有子节点，递归遍历
    })
  }
  //解析元素节点指令
  compileElement(node){
    //1.获取当前元素节点所有属性
    var arrs=this.toArray(node.attributes);
    var compiler=this;
    //2.遍历所有属性
    arrs.forEach(attr=>{
      //3.判断属性是否为指令属性
      var attrName=attr.name;
      if(compiler.isDirective(attrName)){
        //4.收集
         //指令类型，截取v-后面内容
         var type=attrName.substr(2); //text model
         //属性值
         var expr=attr.value;
        //5.找帮手
        switch(type){
          case 'text':
            CompilerUtils['text'](node,compiler.vm,expr);
            break;
          case 'model':
            CompilerUtils['model'](node,compiler.vm,expr);
            break;
          default:
            CompilerUtils['text'](node,compiler.vm,expr);
        }
      }

    })
  }
  //解析文本节点（表达式）
  compileText(node,expr){
    CompilerUtils.text(node,this.vm,expr)
  }


}

//帮手
CompilerUtils={
  //解析text【node谁身上指令，vm mvvm全局this，expr指令值】
  text(node,vm,expr){
    //找到更新方法
    var updateFn=this.updater['textUpdater'];
    //执行方法
    updateFn&&updateFn(node,vm.$data[expr]);

    //添加订阅者
    new Watcher(vm,expr,(newValue)=>{
      //触发订阅时，按照之前规则对节点更新
      updateFn&&updateFn(node,newValue);
    })
  },

  //解析model
  model(node,vm,expr){
    //找到更新方法
    var updateFn=this.updater['modelUpdater'];
    //执行方法
    updateFn&&updateFn(node,vm.$data[expr]);
    //model指令也添加一个订阅者
    new Watcher(vm,expr,(newValue)=>{
      //触发订阅时，按照之前规则对节点更新
      updateFn&&updateFn(node,newValue);
    })

    //视图到模型
    node.addEventListener('input',function (e) {
      var newValue=e.target.value;
      vm.$data[expr]=newValue;
    })
  },

  //更新规则对象(执行方法)
  updater:{
    textUpdater(node,value){
      node.textContent=value;
    },
    modelUpdater(node,value){
      node.value=value;
    }
  }
}
