<?php

class SettingsGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->utils = new Utils($database);
        $this->path = $path;
    }


    public function updateLoginImage($data)
    {
        $this->utils->createImage($data["image"], 1920, "", "login_background");
    }
}
