/*Loading================================================================================*/
window.addEventListener('load', function () {
    const loader = document.querySelector('.loader');
    loader.classList.add('hidden');
});

/*Content_download================================================================================*/
let wrapper = document.querySelector('.wrapper');
window.addEventListener('load', (event) => {
	wrapper.classList.add('loaded');
});
//InputMask===============================================================================================================================================
function inputElements() {
    let inputPhones = document.querySelectorAll("input[data-format]");
    inputPhones.forEach(inputPhone => {
        let phoneMask = new IMask(inputPhone, {
            mask: inputPhone.getAttribute("data-format")
        });
    });
}
inputElements();
/*Animation================================================================================*/
if(document.querySelector('.anim-items')) {
    const animItems = document.querySelectorAll('.anim-items');
    window.addEventListener('load', (event) => {
        if (wrapper.classList.contains('loaded')) {
            if (animItems.length > 0) {
                window.addEventListener('scroll', animOnScroll);
                function animOnScroll(params) {
                    for (let index = 0; index < animItems.length; index++) {
                        const animItem = animItems[index];
                        const animItemHeight = animItem.offsetHeight;
                        const animItemOffset = offset(animItem).top;
                        const animStart = 4;

                        let animItemPoint = window.innerHeight - animItemHeight /animStart;
                        if (animItemHeight > window.innerHeight) {
                            animItemPoint = window.innerHeight - window.innerHeight / animStart;
                        }

                        if ((pageYOffset > animItemOffset - animItemPoint) && pageYOffset < (animItemOffset + animItemHeight)){
                            animItem.classList.add('active');
                        } else {
                            if (!animItem.classList.contains('anim-no-hide')) {
                                animItem.classList.remove('active');
                            }
                        }
                    }
                }
                function offset(el) {
                    const rect = el.getBoundingClientRect(),
                        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
                }

                setTimeout(() => {
                    animOnScroll();
                }, 300);
            }
        }
    });
}