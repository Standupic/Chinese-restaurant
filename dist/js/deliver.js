global.jQuery = require("jquery");
var $ = require("jquery")
var mask = require("jquery-mask-plugin")
import axios from 'axios'
import handlebars from 'handlebars';

$(document).ready(function(){
	var body = $(".body"),
        overlay = $(".overlay"),
        overlay_body = $(".body_overlay"),
        wrap = $(".wrap"), 
        $header   = $(".header"), 
        $window    = $(window),
        h  = $header.outerHeight(),
        burger = $(".mobile_menu > .burger"),
        burger_sidebar = $(".body_overlay .krest .burger"),
    	sidemenu = $(".sidemenu"),
        current = "";


	burger.on("click",function(){
        $(window).off("scroll")
        body.addClass("menu_open")
        overlay.addClass("menu_is_open")
        overlay_body.addClass("menu_is_open")
        wrap.addClass("menu_is_open")
        $(this).css("display","none")
	})

    burger_sidebar.on("click", function(){
        $(window).on("scroll", debounce(fixedMenu))
        body.removeClass("menu_open")
        overlay.removeClass("menu_is_open")
        overlay_body.removeClass("menu_is_open")
        wrap.removeClass("menu_is_open")
        burger.css("display","block")
        
    })

    // ================PAGE=================
    function fixedMenu(){
        if ($(this).scrollTop() <= h && $header.hasClass("fixed")) {
            $header.fadeOut('fast', function(){
                $header.removeClass("fixed")
                $header.fadeIn('fast')
            })

        }
    	if ($window.scrollTop() > h && $header.hasClass("fixed") == false){
             $header.fadeOut('fast', function(){
                $header.addClass("fixed")
                $header.fadeIn('fast')
             })
        }
        footerFixed()
    }

    function footerFixed(){
        var footer = document.querySelector(".footer");
        var point = (window.scrollY + window.innerHeight);
        // console.log(point)
        // console.log(coordElem(footer))
        if(point > coordElem(footer) && $(".basket").hasClass('visible')){
            $(".basket").css("position","static")
        }else{
            $(".basket").css("position","fixed")
        }
    }

    function coordElem(elem){ // Координата footer
        var offsets = getScrollOffsets();
        var box = elem.getBoundingClientRect();
        var y = box.top + offsets.y
        return y
    }

    function getScrollOffsets(w){ // Координаты полосы прокрутки
        w = w || window;
        if(w.pageXOffset != null) return {x: w.pageXOffset, y: w.pageYOffset}
        var d = w.document;
        if(document.compatMode == "CSS1Compat")
            return {x:d.documentElement.scrollLeft,y:d.documentElement.scrollTop};
        return {x:d.body.scrollLeft, y: d.body.scrollTop}   
    }

   function showList(){
    $(".show").on('click', function(e){
        e.preventDefault()
        $(this).text("скрыть")
        $(".basket").toggleClass("show_list")
    })
   }

   showList()

    $(window).on("scroll", debounce(fixedMenu))

    function debounce(func, wait = 10, immediate = true) {
      var timeout;
      return function() {
        var context = this, args = arguments;
        var later = function() {
          timeout = null;
          if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
      };
    };

    // ================PAGE=================

    // ================PRODUCT AND DATA=================
    var product = [];
    var total = 0;

    function basket(dishes){
        $(".button_active > button").on("click", function(obj){
            var id = $(this).attr("data-id")
            var imgs = $(this).next().children("img");
            var quantity = $(this).next().children(".quantity").find('span');
            $(this).addClass('hidden')
            $(this).next().addClass("visible")
            $(dishes).each(function(i,e){
                if(e._id == id){
                    e['quantity'] = 1;
                    if(product.indexOf(e) >= 0){
                        return
                    }else{
                         product.push(e)
                         loadLIST(product)

                         $("#list .item ul li .decrement").on("click",function(){
                                decrimentList(this)
                                console.log("heloo")
                            })

                         $(".basket").addClass("visible");
                         $(".order").text(product.length);
                         quantity.text(e['quantity'])
                         $(".total").text(total = total + e.price)


                    }
                   
                }
            })
            takeQuanity(imgs)
        })
       
    }

    function clearChildren(flag){
        if(flag){
            var children_list = $("#list").children()
            l = children_list.length;
            if(l >= 2){
                for(var i = 1; i < l; ++i){
                    children_list[i].remove()
                }
            }
        }else{
            var children_dish = $("#dishes").children(),
                l = children_dish.length;
                if(l >= 2){
                    for(var i = 1; i < l; ++i){
                        children_dish[i].remove()
                    }
                }
            }
    }

    function takeQuanity(arr){
        $(arr).each(function(i,e){
            $(e).attr('class') == 'decrement' 
            ? 
            $(e).on('click', function(){decriment(this)})
            :
            $(e).on('click', function(){increment(this)})

        })
      }

    function decriment(obj){
        var id = $(obj).attr('data-id');
            $(product).each(function(i,e){
                if(e._id == id){
                    var index = product.indexOf(e)
                    if(e.quantity > 0){
                        total = total - e.price
                        e.quantity--

                        $("#list"+" ."+id+" span").text(e.quantity) // меняем значение в листк заказа 

                        $($(obj).next().children().eq(0)).text(e.quantity) //$(obj).find(".quantity").next()

                        $('.total').text(total)
                        if(e.quantity == 0){

                            $(obj).next().next().off("click") //  $(obj).find(".increment")
                           

                            product.splice(index,1)
                            loadLIST(product)
                            $(".order").text(product.length);

                            $(obj).parent().prev().removeClass("hidden")
                            $(obj).parent().removeClass("visible")
                        }
                    }else{
                        return
                    }
                }
            })
        }

    function decrimentList(obj){
        var id = $(obj).attr('data-id');
            $(product).each(function(i,e){
                if(e._id == id){
                     var index = product.indexOf(e)
                     if(e.quantity > 0){

                         total = total - e.price
                         e.quantity--
                         $(obj).next().text(e.quantity)
                         $('.total').text(total)

                         if(e.quantity == 0){

                            $("#dishes .increment").off("click")
                            $("#dishes .decrement").off("click")

                            product.splice(index,1)
                            loadLIST(product)

                            $(".order").text(product.length);
                            $("#dishes "+"."+id+"").removeClass("hidden").next().removeClass('visible')
                        }
                    }
                }
            })
    }

    // $("#list .item ul li .decriment").on("click",function(){
    //     decrimentList()
    // })

    function deleteFromList(){
        $(".delete").on("click", function(){
            var id = $(this).attr('data-id');
            $(product).each(function(i,e){
                if(e._id == id){
                    var index = product.indexOf(e)
                    product.splice(index,1)
                    loadLIST(product)
                    $("#dishes "+"."+id+"").removeClass("hidden").next().removeClass('visible')
                    $(".order").text(product.length);
                    $(".total").text(total = total - (e.price * e.quantity))
                    $(".total").text(total);
                }
            })
        })
    }


    function increment(obj){
         var id = $(obj).attr('data-id');
            $(product).each(function(i,e){
                if(e._id == id){
                    total = total + e.price
                    console.log("increment")
                    e.quantity++
                    $($(obj).prev().children().eq(0)).text(e.quantity)
                    $("#list"+" ."+id+" span").text(e.quantity)  
                }
                    $('.total').text(total)
            })
        }


    axios.get('../dishes.json')
        .then(function(response){
            var dishes = response.data
            loadDOM(dishes)
            takeDish(dishes)
            takeMenu(dishes)
        })

    function takeDish(dishes){
        $(".deliver_menu ul li a").on("click", function(e){
           var children = $("#dishes").children(),
               l = children.length,
               array = [];
            e.preventDefault()
            var dish = $(this).attr("data-dish");
            $(dishes).each(function(i,e){
                if(e.dish == dish && current != dish){
                    array.push(e)
                    current = dish;
                }else{
                    current = "";
                    return
                }
            })
            loadDOM(array)
        })
    }

    function takeMenu(dishes){
       var toogle = $(".toogle ul li");
        toogle.on('click',function(){
            var menu = $(this).attr("data-menu");
            menu == "main" 
            ? loadDOM(dishes) : console.log("Меню доставки")
            $(this).siblings().removeClass("active")
            $(this).addClass("active")
        })
        current = "";
    }

    function loadDOM(data){
        var dishes = {};
            dishes.dishes = data;
        var template = handlebars.compile($("#template_dish").html())
        clearChildren() 
        $("#dishes").append(template(dishes))
        basket(data)
    }

    function loadLIST(data){
        var list = {}
            list.list = data
        var template = handlebars.compile($("#template_list").html())
        clearChildren(true)
        console.log(data)
        $("#list").append(template(list))
        deleteFromList()
    }

})

/*
связать обработчики количества товара для объетка list 
сейчас завязан на basket функции чей контекст функции dishes блюда
каждый раз когда нажимаешь на кнопку добавить в корзину устанавливаються обработчики на выбор количетва товара
*/