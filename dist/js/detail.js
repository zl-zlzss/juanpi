"use strict";function asyncGeneratorStep(n,t,e,o,s,a,c){try{var i=n[a](c),r=i.value}catch(n){return void e(n)}i.done?t(r):Promise.resolve(r).then(o,s)}function _asyncToGenerator(i){return function(){var n=this,c=arguments;return new Promise(function(t,e){var o=i.apply(n,c);function s(n){asyncGeneratorStep(o,t,e,s,a,"next",n)}function a(n){asyncGeneratorStep(o,t,e,s,a,"throw",n)}s(void 0)})}}$(function(){var n=getCookie("nickname");n?($(".off").addClass("hide"),$(".on").removeClass("hide").text("欢迎您: ".concat(n,'<a class="exit">退出</a>'))):($(".off").removeClass("hide"),$(".on").addClass("hide"));var o=null,s=getCookie("goods_id");function t(){return(t=_asyncToGenerator(regeneratorRuntime.mark(function n(){var e;return regeneratorRuntime.wrap(function(n){for(;;)switch(n.prev=n.next){case 0:return n.next=2,$.get("../server/getGoodsInfo.php",{goods_id:s},null,"json");case 2:e=n.sent,console.log(e),t=e.info,console.log(t),$(".enlargeBox").html('\n            <div class="show">\n                <div class="movemask"></div>\n                <img src="'.concat(t.img,'">\n            </div>\n            <div class="large" style="background-image:url(').concat(t.img,');">\n            </div>\n            <div class="list">\n                <p class="active">\n                    <img src="').concat(t.img,'" alt="">\n                </p>\n            </div>\n        ')),$(".goodsInfo").html('\n            <div class="goods-title">\n                <p class="title" >'.concat(t.title,'</p>\n                <span class="sold">').concat(t.time,'</span>\n            </div>\n            \n            <div class="goods-price">\n                <span class="price-current">\n                    <em>￥</em>\n                    ').concat(t.price,'\n                </span>\n                    <span class="price-old">\n                        参考价\n                        <em>￥</em>\n                        ').concat(t.oldprice,'\n                    </span>\n            </div>\n            <div class="btn-group size">\n                <button type="button" class="btn btn-default">S</button>\n                <button type="button" class="btn btn-default">M</button>\n                <button type="button" class="btn btn-default">L</button>\n                <button type="button" class="btn btn-default">XL</button>\n            </div>\n            <div class="num">\n                <button class="subNum">-</button>\n                <input type="text" value="1" class="cartNum">\n                <button class="addNum">+</button>\n            </div>\n            <div class="go">\n                <button class="btn btn-success addCart">加入购物车</button>\n                <button class="btn btn-warning continue" style="margin-left:10px"><a href="../html/list.html" style="color:#ff464e">继续去购物</a></button>\n                <button class="btn btn-warning money" style="margin-left:10px"><a href="../html/cart.html" style="color:#ff464e">去结算</a></button>\n            </div>\n        ')),o=e.info;case 6:case"end":return n.stop()}var t},n)}))).apply(this,arguments)}!function(){t.apply(this,arguments)}(),$(".goodsInfo").on("click",".addCart",function(){var n=JSON.parse(window.localStorage.getItem("cart"))||[];console.log(n),console.log(s);var t=n.some(function(n){return n.Id===s});console.log(t),t?(t=n.filter(function(n){return n.Id===s})[0]).cart_number=+t.cart_number+ +$(".cartNum").val():(o.cart_number=1,n.push(o)),console.log(n),window.localStorage.setItem("cart",JSON.stringify(n))}).on("click",".subNum",function(){var n=+$(".cartNum").val();1!=n&&$(".cartNum").val(n-1)}).on("click",".addNum",function(){var n=+$(".cartNum").val();$(".cartNum").val(1+n)}),$(window).on("scroll",function(){$(window).scrollTop()>$(window).height()?$(".side-backtop").fadeIn():$(".side-backtop").fadeOut()}),$(window).trigger("scroll"),$(".side-backtop").click(function(){$("body").animate({scrollTop:0},5e3)});var e=getCartNum();console.log(e),$(".side-cart").html('\n            <a href="./cart.html">\n                <i class="i-cart"> </i>\n                <em class="cartnum">'.concat(e,"</em>\n            </a>\n        ")),$(".cart").html('\n            <span class="iconfont icon-bag" style="color: #ff464e;margin:0 11px 0 11px;"></span>\n            <span>\n                <span class="fl" style="margin: 0;"><a href="./cart.html">购物袋</a></span>\n                <em class="num  cartnum">'.concat(e,"</em>\n            </span>\n        ")),$(".goods_show").on("mouseover",".show",function(){$(".movemask").css("display","block"),$(".large").css("display","block")}).on("mouseout",".show",function(){$(".movemask").css("display","none"),$(".large").css("display","none")}).on("mousemove",".show",function(n){var t=parseInt($(".large").css("backgroundSize").split(" ")[0]),e=parseInt($(".large").css("backgroundSize").split(" ")[1]),o=$(".show").innerWidth()*$(".large").innerWidth()/t,t=$(".show").innerHeight()*$(".large").innerHeight()/e;$(".movemask").css({width:o,height:t});e=(n=n||window.event).offsetX-o/2,n=n.offsetY-t/2;e<0&&(e=0),n<0&&(n=0),e>=$(".show").innerWidth()-o&&(e=$(".show").innerWidth()-o),n>=$(".show").innerHeight()-t&&(n=$(".show").innerHeight()-t),$(".movemask").css({left:e,top:n});t="-"+$(".large").innerWidth()*e/o+"px -"+$(".large").innerHeight()*n/t+"px";$(".large").css({backgroundPosition:t})}).on("click",".list",function(n){var t,e=(n=n||window.event).target||n.srcElement;"IMG"===e.nodeName&&(t=e.getAttribute("show"),n=e.getAttribute("enlarge"),$(".show").children().src=t,$(".large").css("backgroundImage","url(".concat(n,")")),$(".list").children().removeClass("active"),e.parentElement.classList.add("active"))}),$(".exit").on("click",function(){var n=getCookie("nickname");console.log(n),delCookie(n),window.location.href="./index.html"})});