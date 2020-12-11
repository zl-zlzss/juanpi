// console.log('aaa')


/* 
    首页的业务逻辑
        1. 确定哪些内容不属于前端
            => 商品列表
            => 分页信息
            => 肯定需要请求渲染
        2. 确定页面主体
            => 页面的主要内容是: 商品列表
            => 因为你的分页信息, 决定商品列表展示哪些内容
        3. 书写的顺序
            3-1. 确定一个对象结构数据类型
                => { 书写所有能影响列表数据的信息 }
                => 将来请求的列表数据, 根据这个对象信息里面的数据进行请求
            3-2. 确定所有可以修改对象信息的操作
                => 点击第几页
            3-3. 使用这个对象去请求列表数据
                => 渲染页面
*/

/* 
    代码逻辑
        1. 请求总页数
            => 利用 jquery-pagination 渲染分页结构
        2. 渲染商品列表
            = 需要携带整个 list_info 过去到后端
            => 拿到数据
            => 渲染页面

*/

// $('.panel-body').pagination({
//     totalData: 100,
//     showData: 5,
//     coping: true
// });




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

        // 才制作购物车联动
        // setCartNum()
    } else {
        // 表示不存在, 是 undefined
        $('.off').removeClass('hide')
        $('.on').addClass('hide')
    }


    // 0. 准备一个变量, 接受所有的商品信息
    let list = null

    // 0. 准备一个对象, 记录所有可以影响页面主体内容的数据
    const list_info = {
        classname: 'nvzhuang',
        sort_method: '综合',
        sort_type: 'ASC',
        current: 1,
        pagesize: 50,
        val:'女装'
    }



    // 1. 渲染商品列表
    getGoodsList()
    async function getGoodsList() {
        // 1-1. 请求商品列表
        const goodsList = await $.get('../server/getGoodsList.php', list_info, null, 'json')
        console.log(goodsList)

        // 1-2. 渲染页面
        let str = ''
        goodsList.list.forEach(item => {
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
                    <div class="goods-title">
                        <p class="title" data-id="${item.Id}">${item.title}</p>
                        <span class="sold">${item.time}</span>
                    </div>
                </li>
            `
        });
        $('.goods_list').html(str)

    }

    // 2. 渲染分页器
    getTotalPage()
    async function getTotalPage() {
        // 请求分页数据
        const totalInfo = await $.get('../server/getListPage.php', list_info, null, 'json')
        console.log(totalInfo)

        $('.panel-body').pagination({
            pageCount: totalInfo.total,

            callback(index) {
                list_info.current = index.getCurrent()
                // 重新请求商品列表
                getGoodsList()
            }

        });

    }

    // 3. 点击一级分类进行切换
    $('.cateOneBox').on('click', 'li', function () {
        console.log($(this))

        // // 搜索引擎的输入框 的输入为空
        // $('.search-area').value = null
        // // 更改 list_info
        list_info.val = '女装'


        // 操作类名
        $(this).addClass('active').siblings().removeClass('active')
        const className = $(this).attr('class').split(' ')[0]
        // console.log(className)

        // 修改类名
        list_info.classname = className
        // 重新渲染分类信息 和 列表数据
        getTotalPage()
        getGoodsList()

    })

    // 4. 排序方式的点击事件
    $('.sortBox').on('click', 'li', function(){
        // console.log('dianjile')
        const type = $(this).attr('data-type')       
        // 修改对象信息
        list_info.sort_type = type

        // 7-5. 重新请求
        getTotalPage()
        getGoodsList()

        // 7-6. 修改 data-type 属性
        // ASC 代表升序
        $(this)
            .attr('data-type', type === 'ASC' ? 'DESC' : 'ASC')
            // 为下一次准备
            // 点一下排序发生改变
            .siblings()
            .attr('data-type', 'ASC')
    })


    // 5. 当 window.scrollTop > window.height 时即显示返回顶部按钮
    $(window).on("scroll",function(){
        if($(window).scrollTop() > $(window).height())
            $(".side-backtop").fadeIn();
        else
            $(".side-backtop").fadeOut();
    });
    // 页面加载时调用一次，进行判断，因为按钮刚开始没有滚动时默认存在
    $(window).trigger("scroll");

    // 6. 点击返回顶部事件
    $(".side-backtop").click(function(){
        $("body").animate({
            scrollTop: 0
        },5000);
    });

    // 7.搜索引擎
    // 搜索按钮添加点击事件, 一点搜索, 获取输入框的值, 进行匹配
    $('.search-btn').on('click', function(){
        console.log('我执行了')

        // 一级菜单删除 active 样式
        $('.cateOneBox').children().removeClass('active')

        // trim() 去掉首尾空格
        value = $('.search-area').val().trim()
        // 什么都没有输入,或者一直按空格
        console.log(value)

        // 修改 list_info
        list_info.val = value
        // 重新渲染分类信息 和 列表数据
        getTotalPage()
        getGoodsList()

    })

    // 8. 点击跳转到详情页
    $('.goods_list').on('click', '.title', function(){
        console.log('跳转')
        // 9-2. 拿到 标签身上记录的商品 id
        const id = $(this).attr('data-id')
        // 9-3. 把这个 id 存储到 cookie 中
        setCookie('goods_id', id)
        // 9-4. 进行页面跳转
        window.location.href = '../html/detail.html'
    })

    // 9. 渲染购物车 
    bindHtml()
    function bindHtml(){
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

    // 10. 点击 退出, 可以退出登录
    $('.exit').on('click', function(){
        // $('.off').removeClass('hide')
        // $('.on').addClass('hide')
        let cookie = getCookie('nickname')
        console.log(cookie)
        delCookie(cookie)
        window.location.href = './index.html'




    

    })

})