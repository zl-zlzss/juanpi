// console.log('xiangqingye')

// 入口函数
$(function () {
    
    // 1. 根据 cookie 中的信息
    // 判断用户信息面板中显示哪一个内容
    const nickname = getCookie('nickname')

    // 2. 根据 nickname 信息进行判断
    if (nickname) {
        // 表示存在, 不是 undefined
        $('.off').addClass('hide')
        $('.on').removeClass('hide').text(`欢迎您: ${nickname}<a class="exit">退出</a>`)
        // setCartNum()

    } else {
        // 表示不存在, 是 undefined
        $('.off').removeClass('hide')
        $('.on').addClass('hide')
    }


    // 0. 提前准备一个变量存储商品信息
    let info = null

    // 1. 拿到 cookie 中的 goods_id 属性
    const id = getCookie('goods_id')

    // 2. 根据 id 信息去请求商品数据
    getGoodsInfo()
    async function getGoodsInfo() {
        // 发送请求
        const goodsInfo = await $.get('../server/getGoodsInfo.php', {
            goods_id: id
        }, null, 'json')
        console.log(goodsInfo)

        // 渲染页面
        bindHtml(goodsInfo.info)
        info = goodsInfo.info
    }

    // 3. 渲染页面 函数
    function bindHtml(info) {
        console.log(info)

        // 1. 渲染左边放大镜位置
        $('.enlargeBox').html(`
            <div class="show">
                <div class="movemask"></div>
                <img src="${info.img}">
            </div>
            <div class="large" style="background-image:url(${info.img});">
            </div>
            <div class="list">
                <p class="active">
                    <img src="${info.img}" alt="">
                </p>
            </div>
        `)
        
        // 2. 商品详细信息渲染
        $('.goodsInfo').html(`
            <div class="goods-title">
                <p class="title" >${info.title}</p>
                <span class="sold">${info.time}</span>
            </div>
            
            <div class="goods-price">
                <span class="price-current">
                    <em>￥</em>
                    ${info.price}
                </span>
                    <span class="price-old">
                        参考价
                        <em>￥</em>
                        ${info.oldprice}
                    </span>
            </div>
            <div class="btn-group size">
                <button type="button" class="btn btn-default">S</button>
                <button type="button" class="btn btn-default">M</button>
                <button type="button" class="btn btn-default">L</button>
                <button type="button" class="btn btn-default">XL</button>
            </div>
            <div class="num">
                <button class="subNum">-</button>
                <input type="text" value="1" class="cartNum">
                <button class="addNum">+</button>
            </div>
            <div class="go">
                <button class="btn btn-success addCart">加入购物车</button>
                <button class="btn btn-warning continue" style="margin-left:10px"><a href="../html/list.html" style="color:#ff464e">继续去购物</a></button>
                <button class="btn btn-warning money" style="margin-left:10px"><a href="../html/cart.html" style="color:#ff464e">去结算</a></button>
            </div>
        `)

        
       
    }

    // 3. 点击事件
    $('.goodsInfo')
        // 3-1. 加入购物车的点击事件
        .on('click', '.addCart', function () {
            // 1. 判断 localStorage 里面有没有数组
            const cart = JSON.parse(window.localStorage.getItem('cart')) || []
            console.log(cart)
            // 判断一下 cart 数组里面有没有这个数据 
            // item.Id 代表放到购物车里的商品的 id
            // id 代表 你现在正在看的 这个商品的 id
            console.log(id)
            const flag = cart.some(item => item.Id === id)
            console.log(flag)
            if (flag) {
                // flag 为 true
                // 代表 购物车已有该商品
                // 则拿到该商品, 让他的 cart_number ++
                const cart_goods = cart.filter(item => item.Id === id)[0]
                cart_goods.cart_number = cart_goods.cart_number - 0 + ($('.cartNum').val() - 0)
            } else {
                // flag 为 false
                // 表示购物车没有
                // 将这个商品的数量改成 1
                info.cart_number = 1
                // 则 push 进去
                cart.push(info)
            }
            console.log(cart)
            // 4-5. 添加完毕还要存储到 localStorage 里面
            window.localStorage.setItem('cart', JSON.stringify(cart))
        })
        .on('click', '.subNum', function(){
                // 拿到 input 的 value 值
                let num = $('.cartNum').val() - 0
                // 进行判断
                // 如果当前是 1, 则点击后什么也不做
                if(num === 1) return
                // 如果不等于 1, 则 进行 -- 操作
                //num--
                // 并且赋值回去
                $('.cartNum').val(num - 1)    
            })
        // 3-3. -- 事件
        .on('click', '.addNum', function(){
                // 拿到 input 的 value 值
                let num = $('.cartNum').val() - 0
                // 进行 ++ 操作
                // 并且赋值回去
                $('.cartNum').val(num + 1)    
            })

        

    // 4. 当 window.scrollTop > window.height 时即显示返回顶部按钮
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > $(window).height())
            $(".side-backtop").fadeIn();
        else
            $(".side-backtop").fadeOut();
    });
    
    // 页面加载时调用一次，进行判断，因为按钮刚开始没有滚动时默认存在
    $(window).trigger("scroll");

    // 5. 点击返回顶部事件
    $(".side-backtop").click(function () {
        $("body").animate({
            scrollTop: 0
        }, 5000);
    });

    // 6. 购物车数字渲染
    let cartNum = getCartNum()
    console.log(cartNum)
    setCartNum()
    function setCartNum() {

        $('.side-cart').html(`
            <a href="./cart.html">
                <i class="i-cart"> </i>
                <em class="cartnum">${cartNum}</em>
            </a>
        `)

        $('.cart').html(`
            <span class="iconfont icon-bag" style="color: #ff464e;margin:0 11px 0 11px;"></span>
            <span>
                <span class="fl" style="margin: 0;"><a href="./cart.html">购物袋</a></span>
                <em class="num  cartnum">${cartNum}</em>
            </span>
        `)
    }

    // 7. 放大镜
    $('.goods_show')
        .on('mouseover', '.show', function(){
            $('.movemask').css('display', 'block')
            $('.large').css('display', 'block')
        })
        .on('mouseout', '.show', function () {
            $('.movemask').css('display', 'none')
            $('.large').css('display', 'none')
        })
        .on('mousemove', '.show', function (e) {
            const bg_width = parseInt($('.large').css('backgroundSize').split(' ')[0])
            const bg_height = parseInt($('.large').css('backgroundSize').split(' ')[1])
            const mask_width = $('.show').innerWidth() * $('.large').innerWidth() / bg_width
            const mask_height = $('.show').innerHeight() * $('.large').innerHeight() / bg_height
            $('.movemask').css({ 'width': mask_width, 'height': mask_height })

            e = e || window.event
            let x = e.offsetX - mask_width / 2
            let y = e.offsetY - mask_height / 2


            if (x < 0) x = 0
            if (y < 0) y = 0
            if (x >= $('.show').innerWidth() - mask_width) x = $('.show').innerWidth() - mask_width
            if (y >= $('.show').innerHeight() - mask_height) y = $('.show').innerHeight() - mask_height
            $('.movemask').css({ 'left': x, 'top': y })

            const bg_x = $('.large').innerWidth() * x / mask_width
            const bg_y = $('.large').innerHeight() * y / mask_height
            const bgp = '-' + bg_x + "px " + '-' + bg_y + "px"
            $('.large').css({ backgroundPosition: bgp })
        })

        .on('click', '.list', function (e) {
            e = e || window.event
            const target = e.target || e.srcElement
            if (target.nodeName === 'IMG') {
                const show_url = target.getAttribute('show')
                const enlarge_bg = target.getAttribute('enlarge')
                $('.show').children().src = show_url
                $('.large').css('backgroundImage', `url(${enlarge_bg})`)

                $('.list').children().removeClass('active')
                target.parentElement.classList.add('active')

            }
        })

    // 8. 点击 退出, 可以退出登录
    $('.exit').on('click', function(){
        // $('.off').removeClass('hide')
        // $('.on').addClass('hide')
        let cookie = getCookie('nickname')
        console.log(cookie)
        delCookie(cookie)
        window.location.href = './index.html'
})
})
