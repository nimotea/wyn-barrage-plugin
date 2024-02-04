import '../style/visual.less';
import EasyDanmaku from "easy-danmaku-js";
import { Subject } from "rxjs";

export default class Visual extends WynVisual {

  private keyName:string;
  private textName:string;
  private subject:Subject<any>;
  private danmamku:EasyDanmaku;
  // private processedKeys:any = {};

  constructor(dom: HTMLDivElement, host: VisualNS.VisualHost, options: VisualNS.IVisualUpdateOptions) {
    super(dom, host, options);
    dom.id = "danmamku";
    dom.style.width="100%";
    dom.style.height="100%";
    this.danmamku = new EasyDanmaku({
      el:'#danmamku',                        //弹幕挂载节点
      colourful:true,                         //彩色弹幕
      line:10,                                //弹幕行数
      wrapperStyle:'danmaku-wrapper',         //默认弹幕样式
      speed:5,                                //弹幕播放速度
      runtime:3,                              //播放一次的时常
      loop:false,                              //开启循环播放
      hover:false,                             //鼠标移入悬停
      onComplete:()=> {                       //播放结束
          console.log('end');
      }
  });
  this.subject = new Subject();

  this.subject.subscribe({
    next : (datas:Array<any>)=> {
      datas.forEach(item => {
          this.danmamku.send(item[this.textName],'danmaku-wrapper',function(){
                console.log('发送成功');
            })
      })
    },
    error: (err) => console.log(`Received an error: ${err}`),
    complete: () => console.log('Message stream completed'),
  });
  }

  public update(options: VisualNS.IVisualUpdateOptions) {
    const plainDataView = options.dataViews[0] && options.dataViews[0].plain;

    if(plainDataView &&
      plainDataView.profile.category.values.length !=0 &&
      plainDataView.profile.values.values.length !=0 
      ){
        this.keyName = plainDataView.profile.category.values[0].display;
        this.textName = plainDataView.profile.values.values[0].display;
        this.subject.next(plainDataView.data);
      }
    
  }

  public onDestroy(): void {

  }

  public getInspectorHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getActionBarHiddenState(options: VisualNS.IVisualUpdateOptions): string[] {
    return null;
  }

  public getColorAssignmentConfigMapping(dataViews: VisualNS.IDataView[]): VisualNS.IColorAssignmentConfigMapping {
    return null;
  }
}