<?
if((isset($_POST['name'])&&$_POST['name']!="")&&(isset($_POST['phone'])&&$_POST['phone']!="")){ //Проверка отправилось ли наше поля name и не пустые ли они
        $to = 'formyphp@mail.ru,chinarestro@mail.ru'; //Почта получателя, через запятую можно указать сколько угодно адресов
        $subject = 'Резерв'; //Загаловок сообщения
        $message = "
                <html>
                    <head>
                        <title>".$subject."</title>
                    </head>
                    <body>
                        <p>Имя: ".$_POST['name']."</p>
                        <p>Телефон: ".$_POST['phone']."</p>";
                        if(isset($_POST['selebrate'])){
                            $message .="Резерв: ".$_POST['selebrate']."";
                        };
                         if(isset($_POST['table'])){
                            $message .="Резерв: ".$_POST['table']."";
                        };
                        if(isset($_POST['wedding'])){
                            $message .="Резерв: ".$_POST['wedding']."";
                        };
                        if(isset($_POST['birthday'])){
                            $message .="Резерв: ".$_POST['birthday']."";
                        };
           $message .= "</body>
                </html>"; //Текст нащего сообщения можно использовать HTML теги
        $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
        $headers .= "From: Китайский ресторан: Великая Стена <cp75225@vh24.timeweb.ru>\r\n"; //Наименование и почта отправителя
        mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail
}
?>
