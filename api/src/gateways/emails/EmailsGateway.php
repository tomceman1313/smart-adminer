<?php
require './phpmailer/src/Exception.php';
require './phpmailer/src/PHPMailer.php';
require './phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        $this->name = "Info";
        $this->username = 'info@smart-studio.cz';
        $this->password = 'Nissan.350z';
    }

    public function sendEmail(array $data): bool
    {
        $mail = new PHPMailer;
        $mail->CharSet = 'UTF-8';
        $mail->setLanguage = 'cs';
        $mail->isSMTP();
        $mail->SMTPDebug = 0;
        $mail->Host = 'smtp.hostinger.com';
        $mail->Port = 587;
        $mail->SMTPAuth = true;
        $mail->Username = $this->username;
        $mail->Password = $this->password;
        $mail->setFrom($this->username,  $this->name);
        $mail->addReplyTo($this->username,  $this->name);
        $mail->addAddress($data["to"], $data["name"]);
        $mail->Subject = $data["subject"];
        //$mail->msgHTML(file_get_contents('message.html'), __DIR__);
        $mail->Body = $data["message"] . "\nJméno: " . $data["name"] . "\nTelefon: " . $data["tel"] . "\nEmail: " . $data["email"];
        //$mail->addAttachment('attachment.txt');
        if (!$mail->send()) {
            //echo 'Mailer Error: ' . $mail->ErrorInfo;
            return false;
        } else {
            return true;
        }
    }
}
