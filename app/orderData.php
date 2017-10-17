<?
	// $data = $_POST;
	$data = $_POST;
	// var_dump($data);
	$to = 'satndupic87@gmail.com,chinarestro@mail.ru';
    $subject = 'Доставка';
    $message = "<html><head><title>".$subject."</title></head><body>";
    $message .= "<div>";
            foreach ($data as $key => $value) {
            	// var_dump($key);
            	// var_dump($value);
                	$message .= "".$value."";

                }    
               $message .= "</div>";	

    $message .="</body></html>"; //Текст нащего сообщения можно использовать HTML теги
    	
    // $headers  = "Content-type: text/html; charset=utf-8 \r\n"; //Кодировка письма
    // $headers .= "From: Китайский ресторан: Великая Стена <cp75225@vh24.timeweb.ru>\r\n"; //Наименование и почта отправителя
    // mail($to, $subject, $message, $headers); //Отправка письма с помощью функции mail

?>
