$(function () {
	$(".navbar-toggler").blur(function (event){
		var scrinwidth = window.innerWidth;
		if (scrinwidth < 768) {
			$(".navbar-collapse").collapse('hide');
		}
	});
});

(function (global) {
	var dc={};
	var homedata = "snipets/main-content.html";
	var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json";
	var categoriesTitle = "snipets/menu-snipet.html";
	var categoriesHtml = "snipets/categories-snipet.html";

	// var insertHTML = function (selector, html) {
	// 	var targetElem = document.querySelector(selector);
	// 	targetElem.innerHTML = html;
	// };

	// var showLoading = function(selector){
	// 	var html = "<div class='text-center'></div>";
	// 	insertHTML (selector, html);
	// }

	var insertProperty = function (string, propName, propValue) {
		var propToReplace = "{{" + propName + "}}";
		string = string.replace (new RegExp(propToReplace, "g"),propValue);
		return string;
	}

	document.addEventListener("DOMContentLoaded", function (event){
		$ajaxUtils.sendGetRequest(
			homedata, 
			function (responseText) {
			document.querySelector(".main-content").innerHTML = responseText;
		}, 
			false);
	});

	dc.loadMenuCategories = function (){
		$ajaxUtils.sendGetRequest(
			allCategoriesUrl, buildAndShowCategories);
	};

	function buildAndShowCategories(categories) {
		$ajaxUtils.sendGetRequest(
			categoriesTitle, function (categoriesTitle) {
				$ajaxUtils.sendGetRequest (
					categoriesHtml, function (categoriesHtml) {
						var categoriesView = buildCategories( categories, categoriesTitle, categoriesHtml);
						insertHTML("#main-content", categoriesView);
					}, false);
			}, false);
	}
	function buildCategories(categories, categoriesTitle, categoriesHtml) {
		var finalHtml = categoriesTitle;
		finalHtml+="<section class='row>'";

		for (var i = 0; i<categories.length; i++) {
			var html = categoriesHtml;
			var name = "" + categories[i].name;
			var short_name = categories[i].short_name;
			html = insertProperty(html, "name", name);
			html=insertProperty(html, "short_name", short_name);
			finalHtml+=html;
		}
		finalHtml+="</section>";
		return finalHtml;
	}
	
global.$dc = dc;
})(window);