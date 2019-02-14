
 //var api = 'http://47.100.111.193:8080'
// var api = 'http://47.100.111.193:8082'
//var api = 'http://192.168.199.151:8080'
// var api = 'http://192.168.31.134:8080'
//var api='http://www.babagame.com'
//var api="http://10.137.32.216:8080"
//var api="http://192.168.0.131:8080"
// var api="http://192.168.1.33:8080"
//屏蔽错误
window.tryCode=function(callback){
	try{
		callback()
	}catch(e){
		console.warn(e) //屏蔽错误 给一个警告  提示的时候开启错误报告
		//throw e.message //依然报错 调试时候使用
	}
};

//取地址栏参数
function getSearchString(key) {
	// 获取URL中?之后的字符
	var str = location.search;
	str = str.substring(1,str.length);

	// 以&分隔字符串，获得类似name=xiaoli这样的元素数组
	var arr = str.split("&");
	var obj = new Object();

	// 将每一个数组元素以=分隔并赋给obj对象
	for(var i = 0; i < arr.length; i++) {
		var tmp_arr = arr[i].split("=");
		obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
	}
	return obj[key];
}

//cookie
function setCookie(name,value,day){
	var date=new Date();//获取时间对象
	date.setDate(date.getDate()+day);//设置过期时间
	//设置cookie
	document.cookie=name+"="+value+";expires="+date;
}
function getCookie(name){
	var arr=document.cookie.split('; ');
	for(var i=0;i<arr.length;i++){
		var arr2=arr[i].split('=');
		if(arr2[0]==name){
			return arr2[1];
		}
	}
	return '';
}
function removeCookie(name){
	setCookie(name, '1', -1);
}

var userInfor=JSON.parse(window.sessionStorage.getItem('userInfor')) || '';

window.addEventListener("storage", function (e) {
    if(e.key=='userInfor'){
        //发生改变修改user 实施监听user
        if(e.newValue==null){
            window.location.href="index.html"
        }
        userInfor=JSON.parse(e.newValue);
    }
});

// 随机分组
function radomArr(){
    var lenth=$(".fenzuList a").length;
    var teamLenth = 5
    var radomArr=[]
    while(radomArr.length<teamLenth){
        var radom= Math.floor(Math.random()*lenth)
        var flag=false;
        for(var i=0;i<radomArr.length;i++){
            if(radomArr[i]==radom){
                flag=true
                break
            }
        }
        if(!flag){
            radomArr[radomArr.length]=radom
        }
    }
    radomArr.sort(function(a,b){ return a-b})
    return radomArr
}

// 首页轮播图
function slide(){
    var len = $(".num > li").length;
    var index = 0;
    var adTimer;

    $(".slider").width($('.ad').width()*3)
    $(".num li").mouseover(function (event) {
        index = $(".num li").index(this);
        showImg(index);
        event.stopPropagation()
    }).eq(0).mouseover();

    $('.ad').hover(function () {
        clearInterval(adTimer);
    }, function () {
        adTimer = setInterval(function () {
            showImg(index)
            index++;
            if (index == len) {
                index = 0;
            }
        }, 3000);
    }).trigger("mouseleave");

    function showImg(index) {
        var adWidth = $('.ad').width();//586px
        $(".slider").stop(true, false).animate({left: -adWidth * index}, 1000);
        $(".num li").removeClass("on").eq(index).addClass("on");
    }
}
//弹出层组件
(function($){
    $.extend({
        lockScreen:function(json){
            window.addEventListener('touchmove',function(event){
                //event.preventDefault();
                window.event.returnValue = false;
            },false)
            var that=this;
            var dialog,lockScreen,loadCotent,closed;
            //$('#'+json.begin).show();
            var cloneId=$('#'+json.begin).clone(true); //append会追加删除 如何使元素追加后不删除 追加时追加元素副本
            //clone(true) true在克隆的时候保留之前元素的事件
            cloneId.show();
            //防止多次创建
            if(document.getElementById('dialog')){
                return false;
            }
            //创建元素和样式
            create()
            function create(){
                //动态创建元素骨架
                dialog=$("<div id='dialog'></div>");
                lockScreen=$("<div id='lockScreen'></div>");
                $("body").append(dialog,lockScreen);
                dialog.append(cloneId);

                //默认样式
                dialog.css({
                    width:$('#'+json.begin).outerWidth(true),
                    height:$('#'+json.begin).outerHeight(true),
                    background:$('#'+json.begin).css('background'),
                    position:"fixed",
                    zIndex:"9999",
                    left:json.left||'50%',
                    top:json.top||'50%',
                    bottom:json.bottom||'50%',
                    marginLeft:function(){
                        return -$('#'+json.begin).outerWidth(true)/2
                    },
                    marginTop:json.mtop||-$('#'+json.begin).outerHeight(true)/2,
                    'border-radius':'10px'
                });
                lockScreen.css({
                    width:"100%",
                    height:'5000px',
                    background:"#000",
                    position:"absolute",
                    zIndex:9998,
                    left:0,
                    top:0,
                    opacity:json.opacity
                })
            }
            //调用弹出层
            xpqLogin();
            function xpqLogin(){
                lockScreen.height($(window).height()+$(window).scrollTop());
            }
            $(window).resize(function(){
                xpqLogin();
            })
            $(window).scroll(function(){
                xpqLogin();
            })
            $("."+json.closed).click(function(event){
                event.stopPropagation();
                lockScreen.remove();
                dialog.remove();
                $('#'+json.begin).hide();

                window.addEventListener('touchmove',function(event){
                    //event.preventDefault();
                    window.event.returnValue = true;
                },false)
            })

			/*$(document).click(function(){
			 lockScreen.remove();
			 dialog.remove();
			 $('#'+json.begin).hide();
			 })*/

            //在元素本身上点击不执行关闭 只要不冒泡到文档上就可以
            //操作元素本身 操作的是副本 因为追加进来的是副本 操作非副本事件无效
            cloneId.click(function(event){
                event.stopPropagation();
            })
        }
    })
})(jQuery);

//提示组件
(function($){
    $.extend({
        Prompt:function(strPrams,fn){
            if($('.tc').length>0){
                return;
            }else{
                Tanchuang();
            }
            function Tanchuang() {
                var str = '';
                str = strPrams;
                var bod = $('body');
                bod.append('<div class="tc" style="opacity:0;padding:10px;height:30px;background:#000;color:#fff;position:fixed;bottom:0;left:0;border-radius:5px;line-height:30px;text-align:center;font-size:16px;z-index:9999;">' + str + '</div>');
                if ($('.tc')) {
                    $('.tc').css({
                        left:($(window).width()-$('.tc').innerWidth())/2
                    });
                    $('.tc').stop().animate({
                        bottom: 100 + 'px',
                        opacity: 1
                    }, 200);
                }
                setTimeout(function () {
                    $('.tc').stop(true).animate({
                        bottom: 0 + 'px',
                        opacity: 0
                    }, 200, function () {
                        $('.tc').remove();
                        fn&&fn();
                    })
                }, 3000)
            }
        }
    })
})(jQuery);

//ajaxLoading
var loading=ajaxLoading();

function ajaxLoading(){
	if($('#ajaxLoading').length>0){
		return;
	}
	var ajaxLoading=$('<div id="ajaxLoading"><p></p></div>');
	ajaxLoading.css({
		height:$(window).height(),
		width:$(window).width(),
		position:'fixed',
		top:0,
		left:0,
		opacity:.5,
		display:'none',
		background:'#000',
        zIndex:9999
	});
	ajaxLoading.find('p').css({
		width:'60px',
		height:'60px',
		position:'absolute',
		top:'50%',
		left:'50%',
		marginLeft:'-30px',
		marginTop:'-30px',
		background:'url("images/loading.gif")',
		backgroundSize:'contain'
	});
	$('body').append(ajaxLoading);

    $(window).resize(function(){
        $("#ajaxLoading").css({
            height:$(window).height(),
            width:$(window).width(),
        })
    })
	return ajaxLoading;
}

//alert
function jalert(str,code,fn){
	if($(".odiv").length>0){
		return;
	}
	var odiv=$('<div class="odiv"><p>提示</p><p>'+str+'</p><div class="jbtn"></div>');
	if(code){
		odiv.find(".jbtn").html('<a id="closed2">取消</a><a id="closed1">确定</a>')
	}else{
		odiv.find(".jbtn").html('<a id="closed1">确定</a>')
	}
	odiv.css({
		position:'fixed',
		zIndex:'9999',
		width:'400px',
		height:'120px',
		background:'#fff',
		borderRadius:'5px',
		left:'50%',
		top:'50%',
		marginLeft:'-200px',
		marginTop:'-60px'
	});

	console.log($(odiv).width());
	odiv.find('p').css({
		textAlign:'center',
		fontSize:'16px',
		marginTop:'10px'
	});
	odiv.find(".jbtn").css({
		position:'absolute',
		width:'100%',
		height:'40px',
		bottom:'0px',
		textAlign:'center',
		borderTop:'1px solid #dedede'
	});
	odiv.find(".jbtn").find('a').css({
		width:'150px',
		heihgt:'40px',
		textAlign:'center',
		lineHeight:'40px',
		display:'inline-block',
		fontSize:'16px',
		cursor:'pointer'
	});
	var zhezhao=$("<div class='zhezhao'>");
	zhezhao.css({
		position:'fixed',
		left:'0',
		top:'0',
		right:'0',
		bottom:'0',
		background:'#000',
		opacity:'0.1',
		zIndex:'9998'
	});

	odiv.appendTo($('body'));
	zhezhao.appendTo($('body'));

	odiv.find("#closed1").click(function(event){
		event.stopPropagation();
		$(this).parents('.odiv').next().remove();
		$(this).parents('.odiv').remove();
		fn&&fn($(this));
	});

	odiv.find("#closed2").click(function(){
		event.stopPropagation();
		$(this).parents('.odiv').next().remove();
		$(this).parents('.odiv').remove();
		fn&&fn($(this));
	});
}

//如果倒计时存在
function daojishi(){
    var count=getCookie('captcha')||60;
    $('.getYan_zhuce').html(count+"s重新获取").attr('disabled',true).css('background','#ccc');
    var resend = setInterval(function(){
        count--;
        if (count>0){
            $('.getYan_zhuce').html(count+"s重新获取").attr('disabled',true).css('background','#ccc');
            setCookie('captcha',count,(1/86400)*count);
        }else {
            clearInterval(resend);
            $('.getYan_zhuce').html('获取验证码').css('background','#434a54').removeAttr('disabled');
            removeCookie('captcha');
        }
    }, 1000);
}



