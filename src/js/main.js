import aos from 'aos';
import { Swiper, Parallax, Pagination, Autoplay } from 'swiper';
Swiper.use([ Parallax, Pagination, Autoplay ]);

window.addEventListener('DOMContentLoaded', () => {

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
        autoplay: {
            delay: 6000,
            pauseOnMouseEnter: true,
        },
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


    const modal = (modalSelector) => {
        const modalEl = document.querySelector(modalSelector);
        const modalContent = modalEl.querySelector('.modal__dialog');
        const openTriggers = document.querySelectorAll('[data-modal-open]');
        const sendButton = modalEl.querySelector('button');

        const message = {
            success: 'Thank you, we will contact you as soon as possible',
        };

        openTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();

                modalEl.classList.add('modal--active');
                modalEl.firstElementChild.style.animation = 'slideIn .3s ease-out';
                document.body.style.cssText = `
                    margin-right: 8px;
                    overflow: hidden;
                `;
            });
        });

        modalEl.addEventListener('click', (e) => {
            if (e.target.getAttribute('data-modal-close') !== null) {
                modalEl.classList.remove('modal--active');
                modalEl.firstElementChild.style.animation = 'slideOut .3s ease-out';
                document.body.style.cssText = `
                    margin-right: 0;
                    overflow-x: hidden;
                `;
            }
        });

        sendButton.addEventListener('click', (e) => {
            e.preventDefault();

            modalContent.classList.add('hide');

            const thanksModal = document.createElement('div');
            thanksModal.classList.add('modal__dialog');
            thanksModal.innerHTML = `
                <div class="modal__content">
                    <span class="modal__close" data-modal-close>x</span>
                    <div class="modal__text">${message.success}</div>
                </div>
            `;

            modalEl.append(thanksModal);

            setTimeout(() => {
                thanksModal.remove();
                modalEl.classList.remove('modal--active');
                document.body.style.cssText = `
                    margin-right: 0;
                    overflow-x: hidden;
                `;
            }, 3000);

            setTimeout(() => {
                modalContent.classList.add('show');
                modalContent.classList.remove('hide');
            }, 3300);
        });
    };

    modal('.modal');

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

    aos.init();

    toggleMenu();
    smoothScroll();
});