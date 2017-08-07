require("babel-polyfill");
global.jQuery = require("jquery");
var $ = require("jquery")
var mask = require("jquery-mask-plugin")
import axios from 'axios'
import handlebars from 'handlebars';

$(document).ready(function(){
    
    $('#phone').mask('+7'+'(999) 999-9999');

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
        product = JSON.parse(sessionStorage.getItem("product")) || [],
        total = JSON.parse(sessionStorage.getItem("total")) ||  0,
        current = "",
        totalDOM = $('.total'),
        orderDOM = $(".order"),
        orderMobileDOM = $(".mobile .order"),
        basketDOM = $(".basket"),
        quantityDishDOM = $("#dishes .quantity > span"),
        wraplistDOM = $(".wrap_list"),
        showDOM = $(".show"),
        bodyHtmlDOM = $('body, html'),
        popoverDOM = $(".popover"),
        boxDOM = $(".box");


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

        if(point > coordElem(footer) && basketDOM.hasClass('visible')){
            basketDOM.css("position","static")
            basketDOM.css("transform","translateY(0px)")
            showDOM.css('display','none')

        }else{
            basketDOM.css("position","fixed")
            if(wraplistDOM.height() < 300){
                basketDOM.css("transform","translateY("+product.length*50+"px)") 
             }else{
                basketDOM.css("transform","translateY(300px)") 
             }
            showDOM.css('display','')
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



    function resizeWindow(){
       var deleteDOM = $(".delete");
       if($(window).width() < 480){
          deleteDOM.html("&times;")
          orderMobileDOM.text(product.length)
       }else{
          deleteDOM.text("удалить")
       }
       $(window).resize(function(){
            if($(window).width() < 480){
                deleteDOM.html("&times;")
                orderMobileDOM.text(product.length)
            }else{
                deleteDOM.text("удалить")
            }
         }) 
    }  

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

    // var product = JSON.parse(SessionStorage.getItem("product")) || []


    // var total = JSON.parse(SessionStorage.getItem("total")) ||  0;
    // var current = "";
    // var totalDOM = $('.total');
    // var orderDOM = $(".order");
    // var basketDOM = $(".basket");
    // var quantityDishDOM = $("#dishes .quantity > span");
    // var wraplistDOM = $(".wrap_list");


    if(product.length){
        basketDOM.addClass("visible");
        loadLIST(product)
    }

    function basket(dishes){
        $(".button_active > button").on("click", function(obj){
            var id = $(this).attr("data-id")
            var imgs = $(this).next().children("img");
            var quantity = $(this).parent().find(".quantity span");
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
                         basketDOM.addClass("visible");
                         orderDOM.text(product.length);
                         quantity.text(e['quantity'])
                         totalDOM.text(total = total + e.price)
                         sessionStorage.setItem("product", JSON.stringify(product))
                         sessionStorage.setItem("total", JSON.stringify(total))
                         if(wraplistDOM.height() < 300){
                            basketDOM.css("transform","translateY("+product.length*50+"px)") 
                         }else{
                            basketDOM.css("transform","translateY(300px)") 
                         }
                    }
                   
                }
            })
            takeQuanity(imgs)
        })
       
    }

    function showList(){
        $(".show").on('click', function(e){
            if(product.length > 6){
                bodyHtmlDOM.addClass("not_scroll")
            }
            if(product.length < 6){
                bodyHtmlDOM.removeClass("not_scroll").css("overflow-x","hidden")
            }
            if(basketDOM.hasClass("show_list")){
                $(this).text("показать")
                 bodyHtmlDOM.removeClass("not_scroll").css("overflow-x","hidden")
            }else{ 
                $(this).text("скрыть")
            }
            e.preventDefault()
            basketDOM.toggleClass("show_list")
        })
    }

    showList()

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
            $(e).on('click', function(){decrement(this)})
            :
            $(e).on('click', function(){increment(this)})

        })
      }

    function turnOff(arr){
        arr.each(function(i,e){
            $(e).off("click")
        })
    }

    function buttonTurnOff(selector,id){
        $("#"+selector+" .button_active > button[data-id="+id+"]").removeClass("hidden")
        $("#"+selector+" .button_active > button[data-id="+id+"]").next().removeClass("visible")
    }

    function buttonTurnOn(selector,id){
        $("#"+selector+" .button_active > button[data-id="+id+"]").addClass("hidden")
        $("#"+selector+" .button_active > button[data-id="+id+"]").next().addClass("visible")
    }

    function decrement(obj){
        var id = $(obj).attr('data-id');
        var context = $(obj).attr("data-context");
        var flow = $(obj).attr("data-flow");
        var imgs = $(obj).parent().find("img")
           // product = JSON.parse(SessionStorage.getItem("product"));
            $(product).each(function(i,e){
                if(e._id == id){
                    var index = product.indexOf(e)
                    if(e.quantity > 0){
                        total = total - e.price
                        e.quantity--
                         sessionStorage.setItem("product", JSON.stringify(product))
                         sessionStorage.setItem("total", JSON.stringify(total))

                        $(obj).parent().find(".quantity > span").text(e.quantity)
                        $("#"+flow+" ."+id+" span").text(e.quantity)


                        totalDOM.text(total)
                        if(e.quantity == 0){
                            turnOff(imgs) // отключаеть обработчик если удалешь количетсво из карточки 
                            if(context == "list"){ 
                                var arr = $("#dishes img[data-id="+id+"]")
                                turnOff(arr) // отключаешь елси из корзины
                            }
                    
                            product.splice(index,1)
                            basketDOM.css("transform","translateY("+product.length*50+"px)") 


                            if(!product.length){
                                basketDOM.removeClass("show_list visible").css("transform","translateY(0px)")
                                bodyHtmlDOM.removeClass("not_scroll").css("overflow-x","hidden")
                                sessionStorage.setItem("product", JSON.stringify(product))
                            }

                            loadLIST(product) // 3 повесил обработчик 
                            orderDOM.text(product.length);
                            switch(context){
                                case "dishes":
                                    $(obj).parent().parent().find("button").removeClass('hidden')
                                    $(obj).parent().removeClass("visible")
                                break;
                                case "list":
                                    buttonTurnOff(flow,id)
                                break
                            }
                        }
                    }else{
                        return
                    }
                }
            })
        }


    function deleteFromList(){
        $(".delete").on("click", function(){
            var id = $(this).attr('data-id');
            var flow = $(this).attr("data-flow")
            $(product).each(function(i,e){
                if(e._id == id){
                    var index = product.indexOf(e)
                    product.splice(index,1)
                    loadLIST(product)
                    buttonTurnOff(flow,id)
                    orderDOM.text(product.length);
                    totalDOM.text(total = total - (e.price * e.quantity))
                    totalDOM.text(total);
                    var imgs = $("#dishes img[data-id="+e._id+"]")
                    turnOff(imgs)
                }
            })
            if(!product.length){
                 basketDOM.removeClass("show_list visible");
                 bodyHtmlDOM.removeClass("not_scroll").css("overflow-x","hidden")
            }
        })
    }


    function takeDishMobile(dishes){
         $(".select > select").change(function(){
            var array = [];
            var dish = $("select option:selected").val();
            $(dishes).each(function(i,e){
                    if(e.dish == dish){
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
    

    function increment(obj){
        var id = $(obj).attr('data-id');
        var context = $(obj).attr("data-context");
        var flow = $(obj).attr("data-flow");
            $(product).each(function(i,e){
                if(e._id == id){
                    total = total + e.price
                    e.quantity++
                    sessionStorage.setItem("product", JSON.stringify(product))
                    sessionStorage.setItem("total", JSON.stringify(total))
                    $(obj).parent().find(".quantity > span").text(e.quantity)
                    $("#"+flow+" ."+id+" span").text(e.quantity)
                }
                    totalDOM.text(total)
            })
        }


    axios.get('../dishes.json')
        .then(function(response){
            var dishes = response.data
            loadDOM(dishes)
            takeDish(dishes)
            takeMenu(dishes)
            takeDishMobile(dishes)
        })

    function takeDish(dishes){
        $(".deliver_menu ul li a").on("click", function(e){
           var array = [];
            e.preventDefault()
            var dish = $(this).attr("data-dish");
            $(dishes).each(function(i,e){
                if(e.dish == dish){
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
        var b = [];
        if(product.length){ // когда уже выбрал товар и ходишь по ассортименту
            for(var i = 0; i < product.length; ++i){
               buttonTurnOn("dishes",product[i]._id)
               $("#dishes"+" ."+product[i]._id+" span").text(product[i]['quantity'])
               var imgs = $("#dishes img[data-id="+product[i]._id+"]")
               takeQuanity(imgs)
               totalDOM.text(total);
               orderDOM.text(product.length);
               basketDOM.css("transform","translateY("+product.length*50+"px)")
            }
        }

        if($(window).width() < 480){
            orderMobileDOM.text(product.length)
            orderMobileDOM.off('click')
            orderMobileDOM.on("click", function(){
                  basketDOM.toggleClass("visible, show_list")
            })
        }
        basket(data)
    }
 
    function loadLIST(data){
        var list = {}
            list.list = data
        var template = handlebars.compile($("#template_list").html())
        clearChildren(true)
        $("#list").append(template(list))
        deleteFromList()
        takeQuanity($("#list .item ul li img"))
        resizeWindow()
    }
        $(".send_order").on('click', function(){
            // var popoverDOM = $(".popover");
            // var boxDOM = $(".box");
            popoverDOM.addClass("visible")
            boxDOM.addClass("show_list")

            console.log($(".description textarea"))
            $(".out").on("click", function(){
                popoverDOM.removeClass("visible")
                boxDOM.removeClass("show_list")
                bodyHtmlDOM.removeClass("not_scroll")
            })
            bodyHtmlDOM.addClass("not_scroll")

            var array = []
            $("#form").submit(function(e){
                e.preventDefault()
                var flag = false;
                var arr = $("form input");
                var description = $(".description textarea").val().trim()
                arr.each(function(i,e){
                    $(e).removeClass("arr")
                })
                $(":input[required]").each(function(){
                    if($(this).val() === ""){
                        $(this).addClass("err")
                        flag = true;
                    }else{

                    } 
                })
                if(flag) {return false;} else{

                    var data = {}
                    arr.each(function(i,e){
                        data[$(e).attr("name")] = $(e).val();
                    })
                    data['description'] = description;
                    var order = {};

                    order['header'] = "<h4>Информация заказа</h4><table style='border: 1px solid; text-align: center; border-collapse: collapse;'><tr><th style='border-right: 1px solid;'>Название</th><th>Количетсво</th></tr>"
                    for(var i = 0; i < product.length; ++i){

                    order['header'] += "<tr style='border: 1px solid;'><td style='border: 1px solid;'>"+product[i]['name']+"</td><td style='border: 1px solid;'>"+product[i]['quantity']+"</tr></td>";
                    }
                    order['header'] += "</table><br/><br/><h4>Информация доставки</h4>"

                    order['name'] = "<table style='border: 1px solid; border-collapse: collapse; text-align: center'>"+
                            "<tr style='border: 1px solid;'>"+
                              "<th style='border-right: 1px solid;'>Имя</th>"+
                              "<th style='border-right: 1px solid;'>Телефон</th>"+
                              "<th style='border-right: 1px solid;'>Улица</th>"+
                              "<th style='border-right: 1px solid;'>Дом</th>"+
                              "<th style='border-right: 1px solid;'>Подъезд</th>"+
                              "<th style='border-right: 1px solid;'>Домофон</th>"+
                              "<th style='border-right: 1px solid;'>Квартира</th>"+
                              "<th style='border-right: 1px solid;'>Примичание</th>"+
                            "</tr>"+
                            "<tr><td style='border-right: 1px solid;'>"+data['name']+"</td><td style='border-right: 1px solid;'>"+data['phone']+"</td><td style='border-right: 1px solid;'>"+data['street']+
                            "</td><td style='border-right: 1px solid;'>"+data['home']+"</td><td style='border-right: 1px solid;'>"+data['port']+
                            "</td><td style='border-right: 1px solid;'>"+data['intercom']+"</td><td style='border-right: 1px solid;'>"+data['flat']+
                            "</td><td style='border-right: 1px solid;'>"+data['description']+"</td></tr>"

                  $.ajax({
                    url: "/orderData.php",
                    type: "POST",
                    data: order,
                    success: function(res){
                        console.log(res)
                    }
                 })

                for(var x = 0; x < product.length; ++x){
                    buttonTurnOff("dishes",product[x]["_id"])
                }
                product = [];
                sessionStorage.clear()
                popoverDOM.removeClass("visible")
                boxDOM.removeClass("show_list")
                bodyHtmlDOM.removeClass("not_scroll")
                basketDOM.removeClass("visible");
                orderDOM.text(product.length);
                totalDOM.text(total)
                basketDOM.css("transform","translateY(0px)")
                // buttonsDOM = document.querySelectorAll("#dishes button")
                // console.log(buttonsDOM)

            }

         })
     
    })
});
















