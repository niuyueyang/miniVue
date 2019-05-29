class Routers{
  constructor(){
    this.routes={};
    this.currentUrl='';
    this.history=[];
    this.currentIndex=this.history.length-1;
    this.refresh=this.refresh.bind(this);
    this.backOff=this.backOff.bind(this);
    window.addEventListener('load',this.refresh,false);
    window.addEventListener('hashchange',this.refresh,false);
  }
  route(path,callback){
    this.routes[path]=callback||function () {}
  }
  refresh(){
    this.currentUrl=location.hash.slice(1)||'/';
    //将当前hash路由推入到数组
    this.history.push(this.currentUrl);
    this.currentIndex++;
    console.log(this.history,this.routes,this.currentUrl)
    this.routes[this.currentUrl]=function () {
      console.log(111)
    };

  }
  //后退
  backOff(){
    this.currentIndex<=0?(this.currentIndex=0):(this.currentIndex=this.currentIndex-1);
    location.hash=`#${this.history[this.currentIndex]}`;
    this.routes[this.history[this.currentIndex]]();
  }
}
new Routers();
