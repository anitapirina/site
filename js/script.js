//Функция скрывает раскрытое меню при потере фокуса
$(function () {
	$(".navbar-toggler").blur(function (event){
		var scrinwidth = window.innerWidth;
		if (scrinwidth < 768) {
			$(".navbar-collapse").collapse('hide');
		}
	});
});


(function (global) {
	//Объявление переменных и ссылок на файлы
	var dc={};
	var homedata = "snipets/main-content.html";
	var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitle = "snipets/menu-snipet.html";
	var categoriesHtml = "snipets/categories-snipet.html";
	var menuItemUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?categories=";
	var menuItemTitle = "snipets/menu-item-title.html";
	var menuItemHtml = "snipets/menu-item.html";

	//Функция замены содержимого main-content на главной страницы при переходе на другие страницы
	var insertHTML = function (selector, html) {
	var targetElem = document.querySelector(selector);
	targetElem.innerHTML = html;
	};

	//Добавление анимации загрузки 
	var showLoading = function(selector){
	var html = "<div class='text-center'>"
	html += "<img src ='images/ajax-loader.gif'></div>";
	insertHTML (selector, html);
	}

	//Замена содержимого в шаблонах
	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.replace (new RegExp(propToReplace, "g"),propValue);
		return string;
	}

	//Запрос содержимого из файла main-content для добавления на главную страницу
	document.addEventListener("DOMContentLoaded", function (event){
		$ajaxUtils.sendGetRequest(
			homedata, 
			function (responseText) {
			document.querySelector(".main-content").innerHTML = responseText;
		}, 
			false);
	});

	//Функция загрузки категорий меню
	dc.loadMenuCategories = function (){
		showLoading(".main-content");
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl, buildAndShowCategories);
	};

	//Загрузка блюд в выбранной категорииб shortNameCategort - короткое имя выбранной категории
	dc.loadMenuItem = function(shortNameCategory){
		showLoading(".main-content");
		$ajaxUtils.sendGetRequest(
			menuItemUrl + shortNameCategory, buildAndShowMenuItems);
	};

	//
	function buildAndShowCategories(categories) {
		showLoading(".main-content");
		$ajaxUtils.sendGetRequest(
			categoriesTitle, function (categoriesTitle) {
				$ajaxUtils.sendGetRequest (
					categoriesHtml, function (categoriesHtml) {
						var categoriesView = buildCategories( categories, categoriesTitle, categoriesHtml);
						insertHTML(".main-content", categoriesView);
					}, false);
			}, false);
	}

	//фукнция конструктор, перебирает все категории в файле json и формирует вид итоговой страницы с классом row
	function buildCategories(categories, categoriesTitle, categoriesHtml) {
		var finalHtml = categoriesTitle;
		finalHtml+="<section class='row'>";

		for (var i = 0; i<categories.length; i++) {
			var html = categoriesHtml;
			var name = "" + categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "short_name", short_name);
			finalHtml+=html;
		}
		finalHtml+="</section>";
		return finalHtml;
	}
	
	function buildAndShowMenuItems(menuItems) {
		showLoading(".main-content");
		$ajaxUtils.sendGetRequest (
			menuItemTitle, function(menuItemTitle){
				$ajaxUtils.sendGetRequest (
					menuItemHtml, function(menuItemHtml){
						var itemsView = buitdItemsView(menuItems, menuItemTitle, menuItemHtml);
						insertHTML(".main-content", itemsView);
					}, false);
			}, false);
	}

	function buitdItemsView (menuItems, menuItemTitle, menuItemHtml) {

		menuItemTitle=insertProperty(menuItemTitle, "name", menuItems.category.name);
		menuItemTitle=insertProperty(menuItemTitle, "special_instructions", menuItems.category.special_instructions);

		var finalHtml=menuItemTitle;
		finalHtml+="<section class='row'>";

		var Items = menuItems.menu_items;
		var catShortName = menuItems.category.short_name;

		for (var i = 0; i<Items.length; i++) {
			var html = menuItemHtml;
			html = insertProperty(html, "short_name", Items[i].short_name);
			html = insertProperty(html, "catShortName", catShortName);
			html = insertPrice(html, "price_small", Items[i].price_small);
			html = insertPortionName(html, "small_portion_name", Items[i].small_portion_name);
			html = insertPrice(html, "price_large", Items[i].price_large);
			html = insertPortionName(html, "large_portion_name", Items[i].large_portion_name);
			html = insertProperty(html, "name", name);
			html = insertProperty(html, "description", description);

			finalHtml+=html;
		}
		finalHtml+="</section>";
		return finalHtml;
	}

		function insertPrice(html, pricePropName, priceValue){
			if (!propValue){
				return insertProperty(html, pricePropName, "");
			}
			priceValue="$"+priceValue.toFixed(2);
			html=insertProperty(html, pricePropName, priceValue);
			return html;
		}	
	function insertPortionName(html,
                               portionPropName,
                               portionValue) {
  // If not specified, return original string
  if (!portionValue) {
    return insertProperty(html, portionPropName, "");
  }

  portionValue = "(" + portionValue + ")";
  html = insertProperty(html, portionPropName, portionValue);
  return html;
}


	
global.$dc = dc;
})(window);