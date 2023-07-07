
function ibg(){
		let ibg=document.querySelectorAll(".ibg");
	for (var i = 0; i < ibg.length; i++) {
		if(ibg[i].querySelector('img')){
			ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
		}
	}
}
ibg();

$('.wrapper').addClass('loaded');

$(document).ready(function(){
	$('.icon-menu').click(function(event) {
		$(this).toggleClass('active');
		$('.menu__body').toggleClass('active');
		$('body').toggleClass('lock');
	});
});

//burger=====================================================================================================================================================
$('.menu-header__icon').click(function(event) {
	$(this).toggleClass('active');
	$('.menu-header__menu').toggleClass('active');
	if($(this).hasClass('active')){
		$('body').data('scroll',$(window).scrollTop());
	}
		$('body').toggleClass('lock');
	if(!$(this).hasClass('active')){
		$('body,html').scrollTop(parseInt($('body').data('scroll')));
	}
});

//Paralax=====================================================================================================================================================
$(window).scroll(function(event) {
		var s=0-$(this).scrollTop()/2;
	$('.main__image').css('transform','translate3d(0,'+s+'px,0)');
});
