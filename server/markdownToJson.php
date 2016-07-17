<?php

// echo convertMarkdownToJson('c:\Projects\mrjazz-todo\public\html\test.md');

function convertMarkdownToJson($path) {
    $content = file_get_contents($path);
    if(!$content) {
        throw new Exception('Content not found');
    }

    $result = new Item('Tasks');
    $lines = explode("\n", $content);

    $max = count($lines);
    for ($i = 0; $i < $max; $i++) {
        $level = strpos($lines[$i],'-');
        $label = substr($lines[$i], $level + 2);
        $item = new Item($label);
        if ($level == 0) {
            $i++;
            $item->setItems(process($lines, $i, 2));
            $result->add($item);
        }
    }

    return json_encode($result->toArray());
}


function process($lines, & $i, $level) {
	$result = array();
	$lastItem = null;
    $max = count($lines);
	for (; $i < $max; $i++) {
		$curLevel = strpos($lines[$i],'-');
		$label = substr($lines[$i], $curLevel + 2);

		if ($curLevel < $level) {
		    $i--;
			return $result;
		}
		if ($curLevel == $level) {
			$lastItem = new Item($label);
			$result[] = $lastItem;
			continue;
		}
		if ($curLevel > $level) {
			if ($lastItem == null) throw new Exception("Two levels at time detected", 1);
			$childs = process($lines, $i, $curLevel);
			$lastItem->setItems($childs);
		}
	}
	return $result;
}


class Item {
	private $title = '';
	private $items = array();

	public function __construct($title) {
		$this->title = $title;
	}

	public function setItems($items) {
		$this->items = $items;
	}

	public function getItems() {
		return $this->items;
	}

	public function getTitle() {
		return $this->title;
	}

	public function add($item) {
		$this->items[] = $item;
	}

	public function __toString() {
		return $this->title;
	}

	public function toArray() {
		$items = [];
		foreach ($this->items as $value) {
			$items[] = $value->toArray();
		}
        return array(
        	'title' => $this->title,
        	'items' => $items
    	);
    }
}
