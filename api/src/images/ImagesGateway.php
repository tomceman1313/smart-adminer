<?php
class ImagesGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->path = $path;
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

    public function cropImage(array $cropData)
    {

        $source = "{$this->path}{$cropData["path"]}";
        set_time_limit(20);
        do {
            if (file_exists($source)) {
                $info = getimagesize($source);
                if ($info['mime'] == 'image/jpeg')
                    $image = imagecreatefromjpeg($source);

                elseif ($info['mime'] == 'image/gif')
                    $image = imagecreatefromgif($source);

                elseif ($info['mime'] == 'image/png')
                    $image = imagecreatefrompng($source);

                // Create a new image with the cropped dimensions
                $image_cropped = imagecreatetruecolor($cropData["width"], $cropData["height"]);
                // Preserve transparency
                imagesavealpha($image_cropped, true);
                $transparent = imagecolorallocatealpha($image_cropped, 0, 0, 0, 127);
                imagefill($image_cropped, 0, 0, $transparent);

                // Crop the image
                imagecopyresampled($image_cropped, $image, 0, 0, $cropData["left"], $cropData["top"], $cropData["width"], $cropData["height"], $cropData["width"], $cropData["height"]);

                if ($image_cropped !== FALSE) {
                    if ($info['mime'] == 'image/jpeg')
                        imagejpeg($image_cropped, $source);
                    elseif ($info['mime'] == 'image/gif')
                        imagegif($image_cropped, $source);
                    elseif ($info['mime'] == 'image/png') {
                        imagepng($image_cropped, $source);
                    } else
                        imagejpeg($image_cropped, $source);

                    imagedestroy($image);
                    imagedestroy($image_cropped);
                }
                break;
            }
        } while (true);
    }
}
