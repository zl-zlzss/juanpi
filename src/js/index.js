console.log('aaa')


// 0. 准备一个变量, 接受输入框的值
let value = ''
// 入口函数
$(function () {

    // 1. 根据 cookie 中的信息
    // 判断用户信息面板中显示哪一个内容
    const nickname = getCookie('nickname')
    // console.log(nickname)

    // 2. 根据 nickname 信息进行判断
    if (nickname) {
        // 表示存在, 不是 undefined
        $('.off').addClass('hide')
        $('.on').removeClass('hide').html(`欢迎您: ${nickname}<a class="exit">退出</a>`)

    } else {
        // 表示不存在, 是 undefined
        $('.off').removeClass('hide')
        $('.on').addClass('hide')
    }


    // 0. 准备一个变量, 接受所有的商品信息
    let list = null
    

    // 0. 准备一个对象, 记录所有可以影响页面主体内容的数据
    const list_info = {
        sort_method: '综合',
        sort_type: 'ASC',
        current: 1,
        pagesize: 100,
        value: '鞋子'
    }


    // 1. 渲染商品列表
    getGoods()
    async function getGoods() {
        console.log(666)

        const indexInfo = await $.get('../server/getIndexList.php', list_info, null, 'json')
        console.log(indexInfo)
        list = indexInfo.list
        console.log(list)

        // 渲染页面
        let str = ''
        indexInfo.list.forEach(item => {
            str += `
                <li>
                    <div class="goods-pic">
                        <img src="${item.img}" alt="">
                    </div>
                    <div class="goods-price">
                        <span class="price-current">
                            <em>￥</em>
                            ${item.price}
                        </span>
                        <span class="price-old">
                            <em>￥</em>
                            ${item.oldprice}
                        </span>
                    </div>
                    <div class="goods-title" data-id="${item.Id}">
                        <p class="title" data-id="${item.Id}">${item.title}</p>
                        <span class="sold">${item.time}</span>
                    </div>
                </li>
            `
        });
        $('.goods_list').html(str)
    }

    // 2. 请求总页数, 回来渲染分页器
    getTotalPage()
    async function getTotalPage() {
        // 请求分页数据
        const totalInfo = await $.get('../server/getTotalPage.php', list_info, null, 'json')
        console.log(totalInfo)

        $('.panel-body').pagination({
            pageCount: totalInfo.total,

            callback(index) {
                list_info.current = index.getCurrent()
                // 重新请求商品列表
                getGoods()
            }

        });
    }


    // 3. 当 window.scrollTop > window.height 时即显示返回顶部按钮
    $(window).on("scroll", function () {
        if ($(window).scrollTop() > $(window).height())
            $(".side-backtop").fadeIn();
        else
            $(".side-backtop").fadeOut();
    });
    // 页面加载时调用一次，进行判断，因为按钮刚开始没有滚动时默认存在
    $(window).trigger("scroll");


    // 4. 点击返回顶部事件
    $(".side-backtop").click(function () {
        $("body").animate({
            scrollTop: 0
        }, 5000);
    });


    // 5. 点击跳转到详情页
    $('.goods_list').on('click', '.goods-title', function () {
        console.log('跳转')
        // 9-2. 拿到 标签身上记录的商品 id
        const id = $(this).attr('data-id')
        // 9-3. 把这个 id 存储到 cookie 中
        setCookie('goods_id', id)
        // 9-4. 进行页面跳转
        window.location.href = '../html/detail.html'
    })

    // 6. 渲染购物车 
    bindHtml()
    function bindHtml() {
        let cartNum = getCartNum()

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
                <em class="num cartnum">${cartNum}</em>
            </span>
        `)
    }

    // 7. 搜索引擎
    $('.search-area').on('input', function () {
        // console.log('我执行了')
        // 解决: trim() 去掉首尾空
        value = $(this).val().trim()
        // 什么都没有输入,或者一直按空格
        if (!value) {
            $('.search>ul').css('display ', 'none')
            return
        }
        // console.log($(this).val())

        // 2. 请求相关内容
        // 2-1. 创建一个script 标签
        // const str = 'https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&wd=' + $(this).val() + '&req=2&bs=%E7%99%BE%E5%BA%A6&csor=6&pwd=aiqiyiu&cb='+ + '&_=1606114596861'
        const str =`https://www.baidu.com/sugrec?pre=1&p=3&ie=utf-8&json=1&prod=pc&from=pc_web&sugsid=1446,32857,33124,33061,32973,33099,33101,32962,22159&wd=${value}&req=2&csor=1&cb=fn&_=1605768936993`

        const script = document.createElement('script')
        script.src = str

        document.body.appendChild(script)

        // 问题2. 会一直创建 script
        // 解决: 卸磨杀驴
        script.remove()
    })

    // 8. 点击搜索进入 list 列表页
    $('.search-btn').on('click', function(){
        console.log('dianjile')
        window.location.href = '../html/list.html'
    })

    // 9. 点击 退出, 可以退出登录
    $('.exit').on('click', function(){
        // $('.off').removeClass('hide')
        // $('.on').addClass('hide')
        let cookie = getCookie('nickname')
        console.log(cookie)
        delCookie(cookie)
        window.location.href = './index.html'

    })
})

function fn(res){
    console.log(res.g)
    value = $('.search-area').val().trim()

    if (res.g == undefined || !res.g || !value) {
        console.log(111)
        $('.search>ul').removeClass('active')
        return
    }

    // 来到这里就是有数据的
    let str = ''
    res.g.forEach(item => {
        str += `
            <li>${item.q}</li>
        `
    })
    // console.log(str)
    $('.search>ul').html(str)
    $('.search>ul').addClass('active')

}