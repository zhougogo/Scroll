/**
 * Created by yqh1 on 2018/1/3.
 */
/*
 *   mScroll 滑屏
 *   el:滑屏区域
 *   dir:"x" || "y",
 *   start:fn(手指按下的回调),
 *   move:fn(手指移动的回调),
 *   end:fn(手指弹起的回调)
 * */
function Scroll(options) {
    this.options = {
        el:options.el,
        dir:options.dir,
        start:options.start,
        move:options.move,
        end:options.end
    };
    this.swiper = this.options.el.children[0];
    this.startPiont = {};//手指的开始位置
    this.lastPiont = {};//手指的最后一次位置
    this.startEl = {};//元素位置
    this.max = {};//元素可移动的最大距离
    //translate的参数
    this.translate = {
        x:"translateX",
        y:"translateY"
    };
    //判断在x,y方向上允许移动
    this.isMove = {
        x:false,
        y:false
    };
    //判断是否第一次移动
    this.isFrist = true;
    this.isBeginMove = false;

    this.init();
    //判断可以移动
}
Scroll.prototype = {
    constructor: Scroll,
    init:function () {
        var self = this;
        //记录这是第一次滑动
        //设置swiper的初始位置
        this.swiper.style.transform = this.translate[this.options.dir]+'(0px)';
        // css(this.swiper,this.translate[this.options.dir],0);
        //初始化浏览器的默认事件
        document.addEventListener('touchmove',function (e) {
            e.preventDefault()
        });
        var differ = {
            x:parseInt(this.swiper.offsetWidth - this.options.el.offsetWidth),
            y:parseInt(this.swiper.offsetHeight - this.options.el.offsetHeight)
        };
        if(differ[this.options.dir] > 5){
            this.isBeginMove = true;
        }

        this.options.el.addEventListener('touchstart',function (e) {
            self.isBeginMove && self.touchStart(e);
        });
        this.options.el.addEventListener('touchmove',function (e) {
            self.isBeginMove && self.touchMove(e);
        });
        this.options.el.addEventListener('touchend',function (e) {
            self.isBeginMove && self.touchEnd(e);

        })
    },
    touchStart:function (e) {
        var touch = e.changedTouches[0];
        this.options.start&&this.options.start();
        //手指点击的位置
        this.startPiont = {
            x:Math.round(touch.pageX),
            y:Math.round(touch.pageY)
        };

        this.lastPiont = {
            x:this.startPiont.x,
            y:this.startPiont.y
        }

        //获取元素移动的开始位置参数
        this.startEl = {};
        this.startEl[this.options.dir] = parseInt(this.swiper.style.transform.substring(11));


        // startEl = {
        //     x:css(swiper,"translateX"),
        //     y:css(swiper,"translateY")
        // };
        //元素能移动的最大位置
        this.max = {
            x:parseInt(this.options.el.offsetWidth - this.swiper.offsetWidth),
            y:parseInt(this.options.el.offsetHeight - this.swiper.offsetHeight)
        }
    },
    touchMove:function (e) {
        this.options.move&&this.options.move();
        var touch = e.changedTouches[0];
        //手指当前的位置
        var nowPoint = {
            x:Math.round(touch.pageX),
            y:Math.round(touch.pageY)
        };
        //判断手指开始位置与结束位置的距离
        if(this.lastPiont.x == nowPoint.x && this.lastPiont.y == nowPoint.y){
            return;
        }

        //手指移动的距离
        var dis = {
            x:nowPoint.x - this.startPiont.x,
            y:nowPoint.y - this.startPiont.y
        };
        //判断在那个方向移动
        //这个判断只在哦手指按下时，第一次move时才会执行
        if(Math.abs(dis.x) - Math.abs(dis.y) > 2 && this.isFrist){
            this.isMove.x = true;
            this.isFrist = false;
        }else if(Math.abs(dis.y) - Math.abs(dis.x) > 2 && this.isFrist){
            this.isMove.y = true;
            this.isFrist = false;
        }
        //获取元素swiper移动的距离
        var target = {};
        target[this.options.dir] = this.startEl[this.options.dir] + dis[this.options.dir];
        //设置元素swiper移动的距离
        this.isMove[this.options.dir] && (this.swiper.style.transform = this.translate[this.options.dir]+'('+target[this.options.dir]+'px)');

        this.lastPiont.x = nowPoint.x;
        this.lastPiont.y = nowPoint.y;
    },
    touchEnd:function (e) {
        var self  = this;
        this.options.end&&this.options.end();
        var now = parseInt(this.swiper.style.transform.substring(11));
        if(now < this.max[this.options.dir]){
            n = this.max[this.options.dir];
            var timer = setInterval(function () {
                now += 5;
                self.swiper.style.transform = self.translate[self.options.dir]+'('+now+'px)';
                if(now >= n){
                    clearInterval(timer)
                }
            },1)
        }else if(now > 0){
            n = 0;
            var timer = setInterval(function () {
                now -= 5;
                self.swiper.style.transform = self.translate[self.options.dir]+'('+now+'px)';
                if(now <= n){
                    clearInterval(timer)
                }
            },1)
        }

        this.isMove = {
            x:false,
            y:false
        };
        this.isFrist = true;
    }

}
