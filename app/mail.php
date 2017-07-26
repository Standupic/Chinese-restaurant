<?php
set_time_limit (360);

$frm_name = "Vladimir";
$frm_email = "formyphp@mail.ru";

$fb = $_FILES["db"]["tmp_name"];
$subject = trim($_POST["subject"]);
copy($_FILES["db"]["tmp_name"], getcwd() . "/_tmp.csv");
copy($_FILES["html"]["tmp_name"], getcwd() . "/_tmp.html");

$message = file_get_contents(getcwd() . "/_tmp.html");

$row = 1;
if (($handle = fopen(getcwd() . "/_tmp.csv", "r")) !== FALSE) {
	while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
		$num = count($data);
		$row++;
		for ($c=0; $c < $num; $c++) {
			mail($data[$c], $subject, $message, "From: $frm_name <$frm_email>" . "\r\n" . "Reply-To: $frm_email" . "\r\n" . "X-Mailer: PHP/" . phpversion() . "\r\n" . "Content-type: text/html; charset=\"utf-8\"");
		}
	}
	fclose($handle);
	unlink(getcwd() . "/_tmp.csv");
	unlink(getcwd() . "/_tmp.html");
};