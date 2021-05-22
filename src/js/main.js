import aos from 'aos';
import { Swiper, Parallax, Pagination } from 'swiper';
Swiper.use([ Parallax, Pagination ]);

window.addEventListener('DOMContentLoaded', () => {

    const toggleMenu = () => {
        const menuBtn = document.querySelector('.burger-btn');
        const menu = document.querySelector('.menu');
    
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('burger-btn--active');
            menu.classList.toggle('menu--active');
        });
    };
    
    const smoothScroll = () => {
        const anchors = document.querySelectorAll('a[href*="#"]');

        anchors.forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();

                const blockId = anchor.getAttribute('href');

                if (blockId === '#') {
                    return;
                }

                const block = document.querySelector(blockId);

                block.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            });

        });
    };

    const counter = (selector, offset) => {
        const counterEl = document.querySelector(selector);
        const elNumber = +counterEl.getAttribute('data-count');
        let isAnimated = false;
        
        const addDividerToNumber = (number, divider) => {
            return number.toFixed().toString().replace(/\B(?=(\d{3})+(?!\d))/g, divider);
        };

        const countTo = (el, number) => {
            const end = number;
            const increment = number / 220;

            let i = 0;

            const timer = setInterval(() => {
                if (i >= end) {
                    el.innerText = `${addDividerToNumber(elNumber, '.')}+`;
                    clearInterval(timer);
                    return;
                }

                el.innerText = `${addDividerToNumber((i += increment), '.')}`;

            }, 15);
        };


        document.addEventListener('scroll', (e) => {
            const rect = counterEl.getBoundingClientRect();
            const elemTop = rect.top;
            const elemBottom = rect.bottom; 

            if ((elemTop >= 0) && ((elemBottom + offset) <= window.innerHeight) && !isAnimated) {
                isAnimated = true;
                countTo(counterEl, elNumber);                
            }
        });
    };

    counter('.statistic__counter', 70);

    const changeProgress = (slider) => {
        const progressBar = document.querySelector('.slider__progressbar');
        const i = (slider.activeIndex + 1);
        const slides = slider.slides.length;
        const calc = ( (i) / (slides) ) * 100;

        progressBar.style.backgroundSize = `${calc}% 100%`;
        progressBar.setAttribute('aria-valuenow', calc);
    };

    const swiper = new Swiper('.swiper-container', {
        loop: false,
        speed: 1500,
        spaceBetween: 150,
        parallax: true,
        pagination: {
            el: '.swiper-pagination',
            type: 'custom',
            renderCustom: function (swiper, current, total) {
                let currentRes = current < 10 ? `0${current}` : current;
                let totalRes = total < 10 ? `0${total}` : total;

                return `<span class="current-slide">${currentRes}</span> / ${totalRes}`;
            }
        },
        on: {
            init: function() {
                changeProgress(this);
            }
        }
    });

    swiper.on('slideChange', (slider) => {
        changeProgress(slider);
    });

    aos.init();

    toggleMenu();
    smoothScroll();
});