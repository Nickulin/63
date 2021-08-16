window.addEventListener("DOMContentLoaded", ()=> {

    const tabs = document.querySelectorAll('.tabheader__item '),
        tabsContent = document.querySelectorAll(".tabcontent"),
        tabParent = document.querySelector(".tabheader__items");

        console.log('dsdaf');

    function hideContent(){
        tabsContent.forEach(item =>{
            item.classList.add("hide");
            item.classList.remove("show", 'fade');
        });

        tabs.forEach(item =>{
            item.classList.remove("tabheader__item_active");
        });
    }

    function showContent(i = 0) { // i = 0 можно так
        tabsContent[i].classList.add("show", "fade");
        tabsContent[i].classList.remove("hide");
        tabs[i].classList.add("tabheader__item_active");
    }
    hideContent();
    showContent();

    tabParent.addEventListener('click', (event)=>{
        const target = event.target;
        if (target && target.classList.contains("tabheader__item")){
            tabs.forEach((item, i)=>{ // (item, i) в скобках, как одна переменная
                if ( target == item ){
                    hideContent();
                    showContent(i);
                }
            });
        }
    });

    //timer

    const deadline = "2021-09-01";


    function getTimeRemaining(endtime){
         const t = Date.parse(endtime) - Date.parse(new Date()),
         days = Math.floor(t/(1000*60*60*24)),
         hours = Math.floor((t/1000/60/60)%24),
         minutes = Math.floor((t/1000/60)%60),
         seconds = Math.floor((t/1000)%60);

         return{
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
         };
    }
    function zero(num){
        if(num<10 && num >=0){
            return `0${num}`;
        }else{
            return num;
        }
    }

    function timeUpdate(selector, endtime){
        const a = document.querySelector(selector),
        days = a.querySelector("#days"),
        hours = a.querySelector("#hours"),
        minutes = a.querySelector("#minutes"),
        seconds = a.querySelector("#seconds"),
        setTime = setInterval(setClock, 1000);

        setClock();

        function setClock(){
           const t = getTimeRemaining(endtime);
           if (t.total <= 0){
               clearInterval(timeUpdate);
               days.innerHTML = 0;
               minutes.innerHTML = 0;
               hours.innerHTML = 0;
               seconds.innerHTML = 0;
           }else{
            days.innerHTML = zero(t.days);
            minutes.innerHTML = zero(t.minutes);
            hours.innerHTML = zero(t.hours);
            seconds.innerHTML = zero(t.seconds);
           }
        }
    }
    timeUpdate(".timer" , deadline);

    // modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
          modal = document.querySelector(".modal");

    function openModal (){
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden"; // none scroll down top
        clearInterval(modalTimeout);
    }

    modalTrigger.forEach(item =>{
        item.addEventListener("click", openModal);
    });

    function closeModal(){
        modal.classList.remove("show");
        modal.classList.add("hide");
        document.body.style.overflow = ""; // scroll , 'visible'
     }

    

    modal.addEventListener('click', (e)=>{
        if (e.target === modal || e.target.getAttribute("data-close") == ""){
            closeModal();
        }
    });

    document.addEventListener("keydown", (e) =>{//m-l.c-t.c-s("show")всегда будет срабатывать если не прописать
        if (e.code === 'Escape' && modal.classList.contains("show")){ // e.which == 27 https://keycode.info/
            closeModal();
        }
    });

    const modalTimeout = setTimeout( openModal, 50000);

    function showOnceModal(){
        if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal(); // open only in down
            window.removeEventListener('scroll', showOnceModal); // удалит саму себя, при однократном выполнении
        }
    }
    window.addEventListener('scroll', showOnceModal);

    //homework

    class MenuCard{
        constructor(src, alt, title, suptitle, total, parentSelector, ...classes){//..сlasses - rest параметр принимает все остальные классы
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.suptitle = suptitle;
            this.total = total;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.preobraz = 27;
            this.cahngeToUah();
        }
        cahngeToUah(){
            this.total = this.total * this.preobraz;
        }
        change(){
            const block = document.createElement("div");
            if(this.classes.length === 0){
                this.block = 'menu__item';
                block.classList.add(this.block);
            }else{
                this.classes.forEach(item => block.classList.add(item));
            }
            block.innerHTML = `
                <img src=${this.src} alt=${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.suptitle}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.total}</span> грн/день</div>
                </div> </div>`;
                this.parent.append(block);
        }
    }

    const getResource = async (url, data) => {
        const res = await fetch(url);

        if (!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return await res.json();
    };

    // getResource("http://localhost:3000/menu")
    //     .then(data => {
    //         data.forEach(({img, altimg, title, descr, price}) => {
    //             new MenuCard(img, altimg, title, descr, price, '.menu .container').change();
    //         });
    //     });

    axios.get("http://localhost:3000/menu")
        .then(data => {
            data.data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu .container').change();
            });
        });

    // getResource("http://localhost:3000/menu")
    //     .then(data => createCard(data));

    // function createCard(data){
    //     data.forEach(({src, alt, title, suptitle, total}) => {
    //         const element = document.createElement("div");

    //         element.classList.add("menu__item");
    //         element.innerHTML = `
    //             <img src=${src} alt=${alt}>
    //             <h3 class="menu__item-subtitle">${title}</h3>
    //             <div class="menu__item-descr">${suptitle}</div>
    //             <div class="menu__item-divider"></div>
    //             <div class="menu__item-price">
    //                 <div class="menu__item-cost">Цена:</div>
    //                 <div class="menu__item-total"><span>${total}</span> грн/день</div>
    //             </div> </div>
    //         `;

    //         document.querySelector(".menu .container");
    //     });
    // }

    //FORMS

    const forms = document.querySelectorAll('form');
    const message = {
        succes: "succes",
        loading : "icons/spinner.svg",
        failure: "failure"
    }

    forms.forEach((item)=>{
        bindPostDate(item);
    });

    const postDate = async (url, data) => {
        const res = await fetch(url, {
            method: "POST",
            headers: { 
                "Content-type": 'application/json'
            },
            body: data
        });

        return await res.json();
    };

    function bindPostDate(form){
        form.addEventListener("submit", (event)=>{
            event.preventDefault();

            const statusMessage = document.createElement("img");
            statusMessage.src = message.loading;
            statusMessage.style = `
                display: block;
                margin: 0 auto;
            `
            form.insertAdjacentElement('afterend', statusMessage);

            const formData = new FormData(form);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            // const json = JSON.stringify(object);
            
            postDate("http://localhost:3000/requests", json)
            // .then(data => data.text())// перевод в текстовый формат json формате
            .then(data => {
                    console.log(data);
                    showThanksModal(message.succes);                    
                    statusMessage.remove();
            }).catch(()=>{
                showThanksModal(message.failure);
            }).finally(()=>{
                form.reset();
            });
        });
    }

    function showThanksModal(message){
        const modalContent = document.querySelector(".modal__dialog");
        modalContent.classList.add("hide");
        openModal();

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div data-close class="modal__close">&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `;
        document.querySelector(".modal").append(thanksModal);

        setTimeout(()=>{
            modalContent.classList.add("show");
            modalContent.classList.remove("hide");
            thanksModal.remove();
            closeModal();
        },4000);
    }

    // fetch("http://localhost:3000/menu")
    //     .then(data => data.json())
    //     .then(res => console.log(res));

    //SLIDER

    const slides = document.querySelectorAll(".offer__slide"),
          slider = document.querySelector(".offer__slider"),
          prev = document.querySelector(".offer__slider-prev"),
          next = document.querySelector(".offer__slider-next"),
          current = document.querySelector("#current"),
          total = document.querySelector("#total"),
          slidesWrapper = document.querySelector(".offer__slider-wrapper"),
          slidesField = document.querySelector(".offer__slider-inner"),
          width = window.getComputedStyle(slidesWrapper).width;

    slidesField.style.width = slides.length * 100 +'%';
    slidesField.style.display = 'flex';
    slidesField.style.transition = 'all .5s';
    slidesWrapper.style.overflow = "hidden";


    slides.forEach(slide => {
            slide.style.width = width;
        }
    )

    slider.style.position = 'relative';

    const indicators = document.createElement('ol'),
          dots = [];
    
          indicators.classList.add(".carousel-indicators");
    indicators.style.cssText =`                        
            position: absolute;
            right: 0;
            bottom: 0;
            left: 0;
            z-index: 15;
            display: flex;
            justify-content: center;
            margin-right: 15%;
            margin-left: 15%;
            list-style: none; `;
    slider.append(indicators);        

    for(let i = 0; i < slides.length; i++){
        const dot = document.createElement('li');
        dot.setAttribute('data-slide-to', i+1);
        dot.style.cssText = `
            box-sizing: content-box;
            flex: 0 1 auto;
            width: 30px;
            height: 6px;
            margin-right: 3px;
            margin-left: 3px;
            cursor: pointer;
            background-color: #fff;
            background-clip: padding-box;
            border-top: 10px solid transparent;
            border-bottom: 10px solid transparent;
            opacity: .5;
            transition: opacity .6s ease;`;

        indicators.append(dot);
        dot.style.opacity = '.5';
        if(i==0){
            dot.style.opacity = 1;
        }
        dots.push(dot);
    }

    let offset = 0;
    let sliderIndex = 1;

    if(slides.length < 10){
        total.textContent = `0${slides.length}`;
    }else{
        total.textContent = slides.length;
    }
    addZero();    

    next.addEventListener("click", ()=>{
        if(offset == (+width.slice(0, width.length -2) * (slides.length-1))){
            offset = 0;
        }else{
            offset += +width.slice(0, width.length -2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(sliderIndex == slides.length){
            sliderIndex = 1;
        }else{
            sliderIndex ++;
        }

        addZero();   
        dotActive();     
    });

    prev.addEventListener("click", ()=>{
        if(offset == 0)  {
            offset = +width.slice(0, width.length -2)*(slides.length-1);
        }else{
            offset -= +width.slice(0, width.length -2);
        }
        slidesField.style.transform = `translateX(-${offset}px)`;

        if(sliderIndex == 1){
            sliderIndex = slides.length;
        }else{
            sliderIndex--;
        }        

        addZero(); 
        dotActive();
                
    });
    dots.forEach(dot => {
        dot.addEventListener('click', (e)=>{
            const slideTo = e.target.getAttribute('data-slide-to');

            sliderIndex = slideTo;
            offset = +width.slice(0, width.length -2)*(slideTo - 1);

            slidesField.style.transform = `translateX(-${offset}px)`;

            addZero();

            dots.forEach(dot => dot.style.opacity = '.5');
            dots[sliderIndex -1].style.opacity = 1; 
        })
    })

    function addZero(){
        if(slides.length < 10){
            current.textContent = `0${sliderIndex}`;
        }else{
            current.textContent = sliderIndex;
        }  
    }
   
    function dotActive(){
        dots.forEach(dot => dot.style.opacity = '.5');
        dots[sliderIndex -1].style.opacity = 1; 
    }
  
    

    // if(total.length < 10){
    //     total.textContent = `0${total.length}`;
    // }
    // if(total.length > 10){
    //     total.textContent = total.length;
    // }

    // showSlides(sliderIndex);

    // function showSlides (n){
    //     if (n > slides.length){
    //         sliderIndex = 1;
    //     }
    //     if (n < 1){
    //         sliderIndex = slides.length;
    //     }
    //     slides.forEach((item) => item.style.display = "none");
    //     slides[sliderIndex - 1].style.display = "block";

    //     if(sliderIndex < 10){
    //         current.textContent = `0${sliderIndex}`;
    //     }
    //     if(sliderIndex > 10){
    //         current.textContent = sliderIndex;
    //     }
    // }

    // function numSlider(n){
    //     showSlides(sliderIndex +=n);
    // }

    // prev.addEventListener("click", () => numSlider(-1) );
    // next.addEventListener("click", () => numSlider(1) );


});
