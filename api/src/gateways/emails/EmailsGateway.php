<?php
require __DIR__ . '/../../../phpmailer/src/Exception.php';
require __DIR__ . '/../../../phpmailer/src/PHPMailer.php';
require __DIR__ . '/../../../phpmailer/src/SMTP.php';

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
        $mail->Body = $data["message"];
        //$mail->addAttachment('attachment.txt');
        if (!$mail->send()) {
            //echo 'Mailer Error: ' . $mail->ErrorInfo;
            return false;
        } else {
            return true;
        }
    }

    public function subscribe(string $email)
    {
        $list_id = 17;
        $API_KEY = "60ee87accc21d60ee87accc21e";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "https://api2.ecomailapp.cz/lists/$list_id/subscribe");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
        curl_setopt($ch, CURLOPT_HEADER, FALSE);

        curl_setopt($ch, CURLOPT_POST, TRUE);
        curl_setopt($ch, CURLOPT_POSTFIELDS, "{
            \"subscriber_data\": {
              \"email\": \"$email\"
            }
          }");

        curl_setopt($ch, CURLOPT_HTTPHEADER, array(
            "Content-Type: application/json",
            "key: $API_KEY"
        ));

        $response = curl_exec($ch);
        curl_close($ch);

        if ($response) {
            return true;
        }
        return false;
    }
}
