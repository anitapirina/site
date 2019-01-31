$(function () {
	$(".navbar-toggler").blur(function (event){
		var scrinwidth = window.innerWidth;
		if (scrinwidth < 768) {
			$(".navbar-collapse").collapse('hide');
		}
	});
});

function () {
	
	var homedata = "snipets/main-content.html";

	// var insertHTML = function (selector, html) {
	// 	var targetElem = document.querySelector(selector);
	// 	targetElem.innerHTML = html;
	// };

	// var showLoading = function(selector){
	// 	var html = "<div class='text-center'></div>";
	// 	insertHTML (selector, html);
	// }

	document.addEventListener("DOMContentLoaded", function (event){
		$ajaxUtils.sendGetRequest(
			homedata, 
			function (responseText) {
			document.querySelector(".main-content").innerHTML = responseText;
		}, 
			false);
	});
	

};