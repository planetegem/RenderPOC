<!DOCTYPE html>
<?php

$files = scandir("renders");

$renders = array();

foreach ($files as $file){
    if ($file == "." || $file == "..")
        continue;

    $directory = "renders/" . $file;
    if (is_dir($directory)){
        $images = scandir($directory);
        $real_images = array();

        foreach ($images as $image){
            $path = $directory . "/" . $image;
            if (is_file($path)){

                switch(pathinfo($path)['extension']){
                    case "jpg":
                    case "jpeg":
                    case "png":
                    case "webp":
                        $real_images[] = $image;
                        break;

                    case "": // Handle file extension for files ending in '.'
                    case NULL: // Handle no file extension
                }

                $renders[$file] = $real_images;
            }
        }       
    }
}
$encoded_renders = json_encode($renders);
?>


<html xmlns="https://www.w3.org/1999/xhtml" lang="nl" xml:lang="nl">
<head>
    <!-- Load render objects from folder structure & save as JS object -->
    <script type="text/javascript">
        const json = '<?php echo $encoded_renders; ?>';
        const renders = JSON.parse(json);
    </script>

    <script type="module" src="js/main.js" defer></script>

    <meta http-equiv='content-type' content='text/html; charset=UTF-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <link rel="stylesheet" href="style.css">
    <link rel="icon" type="image/x-icon" href="favicon.ico">
    <title>Render Tester</title>

</head>
<body>
    <aside>
        <label for="framerate">Framerate: </label>
        <input type="number" id="framerate" value="33" min="1" max="99" />
    </aside>
    <canvas id="canvas"></canvas>
    <nav></nav>
</body>
