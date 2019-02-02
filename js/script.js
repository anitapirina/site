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
			alert(html);
			html = insertProperty(html, "short_name", short_name);
			alert(html);
			finalHtml+=html;
		}
		finalHtml+="</section>";
		return finalHtml;
	}
	//конец функции загрузки категорий меню
	
global.$dc = dc;
})(window);