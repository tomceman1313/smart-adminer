<?php
require __DIR__ . '/../../phpmailer/src/Exception.php';
require __DIR__ . '/../../phpmailer/src/PHPMailer.php';
require __DIR__ . '/../../phpmailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        $this->env = parse_ini_file('.env');;
    }

    public function sendEmail(array $data): bool
    {
        $mail = new PHPMailer;
        $mail->CharSet = 'UTF-8';
        $mail->setLanguage = 'cs';
        $mail->isSMTP();
        $mail->SMTPDebug = 0;
        $mail->Host = 'smtp.office365.com';
        $mail->SMTPAuth = true;
        $mail->Username = $this->env["EMAIL_USERNAME"];
        $mail->Password = $this->env["EMAIL_PASSWORD"];
        $mail->SMTPSecure = "STARTTLS";
        $mail->Port = 587;
        $mail->setFrom($this->env["EMAIL_USERNAME"],  $this->env["EMAIL_NAME"]);
        $mail->addReplyTo($this->env["EMAIL_USERNAME"],  $this->env["EMAIL_NAME"]);
        $mail->addAddress($data["to"], $data["name"]);
        $mail->Subject = $data["subject"];
        //$mail->msgHTML(file_get_contents('email.html'), __DIR__);
        $mail->Body = $data["message"];

        //$mail->addAttachment('attachment.txt');
        if (!$mail->send()) {
            //echo 'Mailer Error: ' . $mail->ErrorInfo;
            return false;
        } else {
            return true;
        }

        // $mail = new PHPMailer;
        // $mail->CharSet = 'UTF-8';
        // $mail->setLanguage = 'cs';
        // $mail->isSMTP();
        // $mail->SMTPDebug = 0;
        // $mail->Host = 'smtp.hostinger.com';
        // $mail->Port = 587;
        // $mail->SMTPAuth = true;
        // $mail->Username = $this->env["EMAIL_USERNAME"];
        // $mail->Password = $this->env["EMAIL_PASSWORD"];
        // $mail->setFrom($this->env["EMAIL_USERNAME"],  $this->name);
        // $mail->addReplyTo($this->env["EMAIL_USERNAME"],  $this->name);
        // $mail->addAddress($data["to"], $data["name"]);
        // $mail->Subject = $data["subject"];
        // //$mail->msgHTML(file_get_contents('message.html'), __DIR__);
        // $mail->Body = $data["message"];
        // //$mail->addAttachment('attachment.txt');
        // if (!$mail->send()) {
        //     //echo 'Mailer Error: ' . $mail->ErrorInfo;
        //     return false;
        // } else {
        //     return true;
        // }
    }

    public function subscribe(string $email)
    {
        $list_id = $this->env["SUBSCRIPTION_LIST_ID"];
        $API_KEY = $this->env["SUBSCRIPTION_API_KEY"];

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
