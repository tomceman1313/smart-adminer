<?php
    $allowed_methods = array('products', 'test');

    class Zuz{
        public static function Products(){
            $list = array();
            for($n = 0; $n < 20; $n++){
                $list[] = $n . " Item";
            }


            echo JSON(array(
                'kind' => 'productList',
                'list' => $list
            ));
        }
    }

    class Db{
        public static function Products(){
            $server_name = "localhost";
            $db_username = "penziontop4fancz";
            $db_password = "heslo";
            $db_name = "test";
            $conn = mysqli_connect($server_name, $db_username, $db_password);
            mysqli_select_db($conn, $db_name);

            $prices = array();
            $sql2 = 'SELECT * FROM react ORDER BY id';
            $result2 = mysqli_query($conn, $sql2);
            $resultCheck2 = mysqli_num_rows($result2);

            if($resultCheck2 > 0){
                while($row = mysqli_fetch_assoc($result2)){
                    $prices[] = $row;
                }
            }

            echo JSON(array(
                'kind' => 'testList',
                'list' => $prices
            ));
        }

        public static function Test(){
            $server_name = "localhost";
            $db_username = "penziontop4fancz";
            $db_password = "heslo";
            $db_name = "penzion";
            $conn = mysqli_connect($server_name, $db_username, $db_password);
            mysqli_select_db($conn, $db_name);

            $prices = array();
            $sql2 = 'SELECT * FROM cenik_pokoje ORDER BY pokoj';
            $result2 = mysqli_query($conn, $sql2);
            $resultCheck2 = mysqli_num_rows($result2);

            if($resultCheck2 > 0){
                while($row = mysqli_fetch_assoc($result2)){
                    $prices[] = $row;
                }
            }

            echo JSON(array(
                'kind' => 'pricesList',
                'list' => $prices
            ));
        }

        public static function Post(){
            $data = json_decode(file_get_contents("php://input"), true);
            $name = $data["name"];
            $age = $data["age"];
            $gender = $data["gender"];

            $server_name = "localhost";
            $db_username = "penziontop4fancz";
            $db_password = "heslo";
            $db_name = "test";

            $conn = mysqli_connect($server_name, $db_username, $db_password);
            mysqli_select_db($conn, $db_name);

            $sql = "INSERT INTO react (person, age, gender) VALUES ('$name', '$age', '$gender')";
            if (mysqli_query($conn, $sql)) {
                //echo "New record created successfully";
                mysqli_close($conn);
                return;
            } else {
                //echo "Error: " . "<br>" . mysqli_error($conn);
            }
            echo $data . "000";


        }
    }
?>