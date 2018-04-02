

//rem适配
(function (doc, win) {
	var docEl = doc.documentElement,
	resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
	recalc = function () {
		var clientWidth = docEl.clientWidth;
		if (!clientWidth) return;
		if(clientWidth>=750){
			docEl.style.fontSize = '100px';
		}else{
			docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
		}
	};

	if (!doc.addEventListener) return;
		win.addEventListener(resizeEvt, recalc, false);
		doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

var currentProcess; // 当前的进度;

$(function(){

    var canvas = document.querySelector('#canvas');
    var ctx = canvas.getContext("2d");

    // 简单的动态设置一下画布的宽高
    var width = $('#canvas').width();
    var height = $('#canvas').height();
    $("#canvas").attr("width", width);
    $("#canvas").attr("height", height);


    /**
     * [绘制用户等级的 半圆环]
     * @param  {[type]} element   [绘制对象]
     * @param  {[type]} percent   [绘制圆环百分比, 范围[0, 100]]
     * @param  {[type]} forecolor [绘制圆环的前景色，颜色代码]
     * @param  {[type]} bgcolor   [绘制圆环的背景色，颜色代码]
     * @return {[type]}           [description]
     */
    function drawMain(element, percent, forecolor, bgcolor) {
        var W = element.width / 2;
        var H = element.height / 2;
        var R = 60;
        var start = Math.PI*5/6;    // 圆环的起始位置
        var end = Math.PI*2 + (Math.PI/6);   // 圆环的结束位置
        var scale = ( end - start ) / 100;    // 比例
        var speed = 0;

        // 绘制背景圆圈
        function backgroundCircle(){
            ctx.save();
            ctx.beginPath();
            ctx.lineWidth = 8; //设置线宽
            ctx.lineCap = "round";   // 给圆环首尾加上 椭圆
            ctx.strokeStyle = bgcolor;
            ctx.arc(W, H, R, start, end, false);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        //绘制运动进度圆环
        function foregroundCircle(n){
            ctx.save();
            ctx.strokeStyle = forecolor;
            ctx.lineWidth = 8;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.arc(W, H, R , start, start +n * scale, false); //用于绘制圆弧ctx.arc(x坐标，y坐标，半径，起始角度，终止角度，顺时针/逆时针)
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }

        //绘制文字
        function text(n){
            ctx.save(); //save和restore可以保证样式属性只运用于该段canvas元素
            ctx.fillStyle = forecolor;
            var font_size = 30;
            ctx.font = font_size + "px Helvetica";
            var text_width = ctx.measureText(n.toFixed(0)+"%").width;
            ctx.fillText(n.toFixed(0)+"%", W-text_width/2, H + font_size/2);
            ctx.restore();
        }

        //执行动画
        (function drawFrame(){
            window.requestAnimationFrame(drawFrame);    // 开始动画帧
            ctx.clearRect(0, 0, element.width, element.height);
            backgroundCircle();
            text(speed);
            if(percent) {
                foregroundCircle(speed);
            }
            if(speed >= percent) return;
            speed += 1;
        }());

        // 解决锯齿
        if (window.devicePixelRatio) {
            canvas.style.width = width + "px";
            canvas.style.height = height + "px";
            canvas.height = height * window.devicePixelRatio;
            canvas.width = width * window.devicePixelRatio;
            ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        }
    }

    drawMain(canvas, 90, "#fbec28", "#eef7e4");
});
