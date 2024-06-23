<?php
class Utils
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/publicFolderPath.php');
        $this->path = $path;
    }

    public function getUrlParts(): array
    {
        $uri = preg_replace('/^.*api/', "/api", $_SERVER["REQUEST_URI"]);
        $uri = preg_replace('/page=[0-9]+/', "", $uri);
        $uri = preg_replace('/\/\?\&/', "/?", $uri);
        $uri = preg_replace('/\/\?$/', "", $uri);
        $url_parts = explode("/", $uri);

        return array("url" => $uri, "url_parts" => $url_parts);
    }

    public function getUrlParams(string $param_name, $return_value)
    {
        if (isset($_GET[$param_name])) {
            return $_GET[$param_name];
        }

        return $return_value;
    }

    public function getPagination(int $page, int $limit)
    {
        $limit = 8;
        $offset = ($page > 0 ? $page - 1 : 0) * $limit;
        $pagination = "$offset, $limit";
    }

    public function getTotalPages($total_length, $limit)
    {
        if (($total_length / $limit) == 0) {
            return 0;
        } else {
            return ceil($total_length / $limit);
        }
    }


    public function checkUserAuthorization(string $method, array $permissions): bool
    {
        $method_permission = strtolower($method) . "_permission";
        if ($permissions[$method_permission]) {
            return true;
        }
        return false;
    }

    public function createImage(string $base64, int $max_width, string $path, string $name = null): string
    {
        try {
            $base64DataString = $base64;
            list($dataType, $imageData) = explode(';', $base64DataString);
            // image file extension
            $imageExtension = explode('/', $dataType)[1];
            // base64-encoded image data
            list(, $encodedImageData) = explode(',', $imageData);
            // decode base64-encoded image data
            $decodedImageData = base64_decode($encodedImageData);

            $image_name = $name ? $name : uniqid();
            file_put_contents("{$this->path}{$path}/{$image_name}.{$imageExtension}", $decodedImageData);

            $this->compress($image_name . "." . $imageExtension, $max_width, $path);

            return $image_name . "." . $imageExtension;
        } catch (Exception $e) {
            echo $e;
            return "";
        }
    }

    public function compress(string $image_name, int $max_width, string $path)
    {
        $source = "{$this->path}{$path}/{$image_name}";
        set_time_limit(20);
        do {
            if (file_exists($source)) {
                $info = getimagesize($source);
                $width = $info[0];
                $height = $info[1];
                @$exif = exif_read_data($source);

                if ($info['mime'] == 'image/jpeg')
                    $image = imagecreatefromjpeg($source);

                elseif ($info['mime'] == 'image/gif')
                    $image = imagecreatefromgif($source);

                elseif ($info['mime'] == 'image/png')
                    $image = imagecreatefrompng($source);


                if ($width > $max_width) {
                    $aspectRatio = $width / $height;
                    $imageResized = imagescale($image, $max_width, $max_width / $aspectRatio);
                } else {
                    $imageResized = $image;
                }

                if (!empty($exif['Orientation'])) {
                    switch ($exif['Orientation']) {
                        case 8:
                            $imageResized = imagerotate($imageResized, 90, 0);
                            break;
                        case 3:
                            $imageResized = imagerotate($imageResized, 180, 0);
                            break;
                        case 6:
                            $imageResized = imagerotate($imageResized, -90, 0);
                            break;
                    }
                }
                if ($info['mime'] == 'image/jpeg')
                    imagejpeg($imageResized, $source);
                elseif ($info['mime'] == 'image/gif')
                    imagegif($imageResized, $source);
                elseif ($info['mime'] == 'image/png') {
                    imagesavealpha($imageResized, true);
                    imagepng($imageResized, $source);
                } else
                    imagejpeg($imageResized, $source);
                break;
            }
        } while (true);
    }

    // public function getMonthName(int $month_number)
    // {
    //     switch ($month_number) {
    //         case 1:
    //             return "Leden";
    //         case 2:
    //             return "Únor";
    //         case 3:
    //             return "Březen";
    //         case 4:
    //             return "Duben";
    //         case 5:
    //             return "Květen";
    //         case 6:
    //             return "Červen";
    //         case 7:
    //             return "Červenec";
    //         case 8:
    //             return "Srpen";
    //         case 9:
    //             return "Září";
    //         case 10:
    //             return "Říjen";
    //         case 11:
    //             return "Listopad";
    //         case 12:
    //             return "Prosinec";
    //         default:
    //             return $month_number;
    //     }
    // }

    public function getMonthNumberFromDateInt(int $date)
    {
        $date_str = strval($date);
        $month_int = intval(substr($date_str, 4, 2));

        return $month_int;
    }

    public function createPublicFolder($folderPath)
    {
        if (!file_exists($folderPath)) {
            mkdir($folderPath, 0777, true);
        }
    }
}
