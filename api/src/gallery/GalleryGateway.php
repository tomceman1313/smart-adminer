<?php
class GalleryGateway
{
    public function __construct(Database $database)
    {
        $this->conn = $database->getConnection();
        include(dirname(__FILE__) . '/../publicFolderPath.php');
        $this->utils = new Utils($database);
        $this->path = $path;
    }

    function getAll($pagination): array
    {
        $sql = "SELECT * FROM gallery ORDER BY id DESC LIMIT $pagination";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute();

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data["data"][] = $row;
        }

        $sql = "SELECT COUNT(*) FROM gallery";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $length = $stmt->fetch(PDO::FETCH_ASSOC);
        $data["total_length"] = $length["COUNT(*)"];

        return $data;
    }

    function getByCategory(string $category_id, $pagination): array
    {
        $sql = "SELECT * FROM image_category WHERE category_id=:id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $category_id
        ]);

        $ids = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $ids[] = $row["image_id"];
        }
        if (sizeof($ids) == 0) {
            $data = [];
            $data["total_length"] = 0;
            return $data;
        }

        $sql = "SELECT * FROM gallery WHERE id IN (" . implode(',', $ids) . ") ORDER BY id DESC LIMIT $pagination";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data["data"][] = $row;
        }

        $sql = "SELECT COUNT(*) FROM gallery WHERE id IN (" . implode(',', $ids) . ") ORDER BY id DESC";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute();
        $length = $stmt->fetch(PDO::FETCH_ASSOC);
        $data["total_length"] = $length["COUNT(*)"];

        return $data;
    }

    function getByCategoryName(string $category_name, $pagination): array
    {
        $sql = "SELECT gallery.* FROM gallery_categories INNER JOIN image_category ON gallery_categories.id = image_category.category_id 
        INNER JOIN gallery ON gallery.id = image_category.image_id WHERE gallery_categories.name = :category_name LIMIT $pagination";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'category_name' => $category_name
        ]);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    //unused
    public function get(string $id): array
    {
        $sql = "SELECT * FROM gallery WHERE id = :id LIMIT 1";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'id' => $id
        ]);

        $data = $stmt->fetch(PDO::FETCH_ASSOC);
        return $data;
    }

    public function create(array $data)
    {
        $image_name = $this->utils->createImage($data["image"], 1200, "/images/gallery");

        $sql = "INSERT INTO gallery (name, title, description, date) VALUES (:name, :title, :description, :date)";
        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'name' => $image_name,
            'title' => $data["title"],
            'description' => $data["description"],
            'date' => $data["date"]
        ]);

        $categories = $data["category_id"];
        $last_id = $this->conn->lastInsertId();

        $sql_image = "INSERT INTO image_category (image_id, category_id) VALUES (:image_id, :category_id)";
        foreach ($categories as $item) {
            $stmt = $this->conn->prepare($sql_image);
            $stmt->execute([
                'image_id' => $last_id,
                'category_id' => $item["id"]
            ]);
        }
    }

    public function multipleCreate(array $data)
    {
        $images = $data["images"];
        foreach ($images as $image) {
            $image_name = $this->utils->createImage($image, 1200, "/images/gallery");

            $sql = "INSERT INTO gallery (name, date) VALUES (:name, :date)";
            $stmt = $this->conn->prepare($sql);

            $stmt->execute([
                'name' => $image_name,
                'date' => $data["date"]
            ]);

            $categories = $data["category_id"];
            $last_id = $this->conn->lastInsertId();

            $sql_image = "INSERT INTO image_category (image_id, category_id) VALUES (:image_id, :category_id)";
            foreach ($categories as $item) {
                $stmt = $this->conn->prepare($sql_image);
                $stmt->execute([
                    'image_id' => $last_id,
                    'category_id' => $item["id"]
                ]);
            }
        }
    }

    public function update(array $data)
    {
        $sql = "UPDATE gallery SET title = :title, description = :description WHERE id = :id";

        $stmt = $this->conn->prepare($sql);

        $stmt->execute([
            'title' => $data["title"],
            'description' => $data["description"],
            'id' => $data["id"]
        ]);

        $sql_select = "SELECT * FROM image_category WHERE image_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $data["id"]
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql = "DELETE FROM image_category WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);
            $stmt->execute();
        }


        $categories = $data["category_id"];

        $sql_image = "INSERT INTO image_category (image_id, category_id) VALUES (:image_id, :category_id)";
        foreach ($categories as $item) {
            $stmt = $this->conn->prepare($sql_image);
            $stmt->execute([
                'image_id' => $data["id"],
                'category_id' => $item["id"]
            ]);
        }
    }

    public function delete(string $id)
    {
        $image = $this->get($id);
        $imageName = $image["name"];

        if (file_exists("{$this->path}/images/gallery/{$imageName}")) {
            unlink("{$this->path}/images/gallery/{$imageName}");
        }

        $sql = "DELETE FROM gallery WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $sql_select = "SELECT * FROM image_category WHERE image_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql = "DELETE FROM image_category WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);
            $stmt->execute();
        }
    }

    public function multipleDelete(array $ids)
    {
        foreach ($ids as $image) {
            $this->delete($image);
        }
    }

    function getImageCategories(string $image_id): array
    {
        $sql = "SELECT * FROM image_category WHERE image_id=:id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'id' => $image_id
        ]);

        $ids = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $ids[] = $row["category_id"];
        }

        if (sizeof($ids) == 0) {
            return [];
        }

        $sql = "SELECT * FROM gallery_categories WHERE id IN (" . implode(',', $ids) . ")";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    function getCategories(): array
    {
        $sql = "SELECT * FROM gallery_categories ORDER BY name";
        $stmt = $this->conn->query($sql);

        $data = [];
        while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
            $data[] = $row;
        }

        return $data;
    }

    public function createCategory(array $data)
    {
        $sql = "INSERT INTO gallery_categories (name) VALUES (:name)";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'name' => $data["name"]
        ]);
    }

    public function updateCategory(array $data, $id)
    {
        $sql = "UPDATE gallery_categories SET name = :name WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->execute([
            'name' => $data["name"],
            'id' => $id
        ]);
    }

    public function deleteCategory(string $id)
    {
        $sql = "DELETE FROM gallery_categories WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindValue(":id", $id, PDO::PARAM_INT);
        $stmt->execute();

        $sql_select = "SELECT * FROM image_category WHERE category_id = :id";
        $stmt_select = $this->conn->prepare($sql_select);

        $stmt_select->execute([
            'id' => $id
        ]);

        while ($row = $stmt_select->fetch(PDO::FETCH_ASSOC)) {
            $sql = "DELETE FROM image_category WHERE id = :id";
            $stmt = $this->conn->prepare($sql);
            $stmt->bindValue(":id", $row["id"], PDO::PARAM_INT);
            $stmt->execute();
        }
    }
}
