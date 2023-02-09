<?php 
$data = array();
$date = "2022-10-23";
$category = "work";

$bitMask = ($category == "work"? 4 : ( $category == "daily"? 2 : 1));

if(!array_key_exists($date, $data))
{
    $data[$date] = 0 | $bitMask;
}
$data[$date] |= $bitMask;

echo $data[$date];
?>