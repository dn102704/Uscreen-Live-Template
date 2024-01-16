const LIVE_CATEGORY_ID = 95536;
const STORE = 'etchrstudio'
$(function() {
  const nth = function(d) {
    if (d > 3 && d < 21) return 'th';
    switch (d % 10) {
      case 1:  return "st";
      case 2:  return "nd";
      case 3:  return "rd";
      default: return "th";
    }
  }
  function renderEventActions() {
    document.querySelectorAll('.livestream-page__day-table-row:not(.touched)').forEach(liveEvent => {
      let programRequestUrl = liveEvent.dataset.permalink.split('/programs/')[1]
      console.log(programRequestUrl)
      axios.get(`/api/contents/${programRequestUrl}`).then(response => {
        let program = response.data;
        let freeEvent = false;
        let signUps = 0;
        if (program.tags.length) {
          program.tags.forEach(tag => {
            if (tag.trim().toLowerCase() === 'free') {
              freeEvent = true;
            }
            if (tag.split('|')[0].trim().toLowerCase() === 'signups') {
              signUps = tag.split('|')[1].trim()
            }
          })
        }
        if (freeEvent) {
         
          if (USER_GUEST) {
            axios.get(`/api/products?c=${program.id}`).then(response => {
              let products = response.data;
              products.forEach(product => {
                if (product.type === 'freebie') {
                  console.log(product)
                  console.log('this user is guest')
                  let markup = `
                                                              <a href="${e.streamUrl}" class="leran-more">Learn More</a>

                    <a class="program-signup" href="/orders/customer_info?o=${product.id}&c=${program.id}">Sign Up</a>
                                      <span class="label-free">FREE for All</span>

                  `
                  liveEvent.querySelector('.event--actions').insertAdjacentHTML('beforeend', markup)
                }
              })
            })
          } else {
            console.log('this user is subscriber')
            let markup = `
              <span class="label-free">FREE</span>
            `
            liveEvent.querySelector('.event--actions').insertAdjacentHTML('afterBegin', markup)
            liveEvent.querySelector('.count-me').classList.add('active')
            liveEvent.querySelector('.flex-button').classList.add('active')

          }
        } else {
          console.log(program)
          console.log('this is not FREE event')
          if (USER_GUEST) {
            console.log('this user is guest')
            
            axios.get(`/api/products?c=${program.id}`).then(response => {
              let products = response.data;
              let markup = ''
              let hasFixedOffer = false;
              let offerPrice = null;
              
              products.forEach(product => {
                if (product.type === 'fixed_price') {
                  hasFixedOffer = true;
                  offerPrice = product.price_humanized
                }
              })
              if (hasFixedOffer) {
                markup = `
                                                          <a href="${e.streamUrl}" class="leran-more">Learn More</a>

                  <a class="program-signup" href="/orders/checkout?c=${program.id}">Buy Us ${offerPrice}</a>
                  <span class="label-signups"><span>FREE for subscribers</span> <span>Sign ups: <b>${signUps}</b></span></span>

                `
              } else {
                markup = `
                                                          <a href="${e.streamUrl}" class="leran-more">Learn More</a>

                  <a class="program-signup" href="/orders/checkout?c=${program.id}">Sign Up</a>
                  <span class="label-signups"><span>FREE for subscribers</span> <span>Sign ups: <b>${signUps}</b></span></span>

                `
              }
              liveEvent.querySelector('.event--actions').insertAdjacentHTML('beforeend', markup)
            })
            
            
          } else {
            axios.get(`/api/contents/${program.permalink}/access`).then(response => {
              let access = response.data.result;
              if (access) {
                console.log('this user has access to the live event')
                let markup = `
                  <span class="label-signups"><span>FREE for subscribers</span> <span>Sign ups: <b>${signUps}</b></span></span>
                `
                liveEvent.querySelector('.event--actions').insertAdjacentHTML('afterBegin', markup)
                liveEvent.querySelector('.count-me').classList.add('active')
                            liveEvent.querySelector('.flex-button').classList.add('active')

              } else {
                axios.get(`/api/products?c=${program.id}`).then(response => {
                  let products = response.data;
                  let markup = ''
                  let hasFixedOffer = false;
                  let offerPrice = null;
                  
                  products.forEach(product => {
                    if (product.type === 'fixed_price') {
                      hasFixedOffer = true;
                      offerPrice = product.price_humanized
                    }
                  })
                  if (hasFixedOffer) {
                    markup = `
                      <span class="label-signups">SIGN UPS: ${signUps}</span>
                     <a href="${e.streamUrl}" class="learn-more">Learn More</a>
                      <a class="program-signup" href="/orders/checkout?c=${program.id}">Buy Us ${offerPrice}</a>
                    
                    `
                  } else {
                    markup = `
                      <span class="label-signups">SIGN UPS: ${signUps}</span>
                                          <a href="${e.streamUrl}" class="leran-more">Learn More</a>

                      <a class="program-signup" href="/orders/checkout?c=${program.id}">Sign Up</a>
                    `
                  }
                  liveEvent.querySelector('.event--actions').insertAdjacentHTML('beforeend', markup)
                })
                
              }
            })
          }
        }
        
        
      })
      liveEvent.classList.add('touched')
    })
  }
  function renderMarkup() {
    var arrayObjects = [];
    var arrayDays = [];
    $('.live-stream-object').each(function() {
      var element = $(this);
      var obj = {
        title: element.find('.obj-title').text().split('|')[0],
        streamUrl:element.find('.obj-stream-url').text(),
        authorName: element.find('.obj-author-name').text(),
        authorAvatar: element.find('.obj-author-avatar').attr('src'),
        authorAva: element.find('.obj-author-ava').text(),
        authorLink: element.find('.obj-author-link').text(),
        description: element.find('.obj-description').text(),
        date: new Date(element.find('.obj-date').text().split('|')[0])
      }
      //console.log(element.find('.obj-date').text().split('|')[0])
      if (new Date(element.find('.obj-date').text().split('|')[0]) !== 'Invalid Date') {
        arrayObjects.push(obj);
        var dt = new Date(element.find('.obj-date').text().split('|')[0]);
        var dtpush = dt.getFullYear() + "/" + (dt.getMonth() + 1) + "/" + dt.getDate();
        arrayDays.push(dtpush)

      }

    })
    //console.log(arrayDays)
    function onlyUnique(value, index, self) {
      return self.indexOf(value) === index;
    }

    // function dateSort(value, index, self) {
    //   return new Date(b.date) - new Date(a.date);
    // }

    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    arrayDays = arrayDays.filter( onlyUnique );
    arrayDays.sort((a,b)=> {
      return new Date(b) - new Date(a)
    })
    //console.log(newDays)
    arrayDays.reverse().forEach(function(el){
      var ele = new Date(el);
      var year = ele.getFullYear();
      var month = ele.getMonth() + 1;
      var date = ele.getDate();
      var dayName = days[ele.getDay()];
      var dayHTML = '<div> <div class="date-slide" data-target="date-'+year+'-'+date+'-'+month+'"> <div class="date-slide-day"> <span>'+dayName.substr(0,3)+'<br>'+monthNames[month-1].substr(0,3)+'</span> <span>'+dayName.substr(0,3)+', '+monthNames[month-1].substr(0,3) +'</span> </div><div class="date-slide-date">'+date+'</div></div></div>'
      $('.date-slider').append(dayHTML);
      // $('.livestream-page__days').append('<div  class="livestream-page__day"><date class="livestream-page__day-date" datetime="'+ele+'">'+dayName+', '+monthNames[month-1]+' '+date+'</date><div class="livestream-page__day-table"></div></div>')
      // console.log(arrayObjects)
      arrayObjects.sort((a,b)=> {
        return new Date(b.date) - new Date(a.date)
      })
      arrayObjects.reverse().forEach(function(e){
        //console.log(String(ele))
        var dtcheck = e.date.getFullYear() + "/" + (e.date.getMonth() + 1) + "/" + e.date.getDate();
        //console.log(String(new Date(dtcheck)))
        if (String(new Date(dtcheck)) === String(ele)) {
          var rowHTML = `
            <div id="date-${year}-${date}-${month}" class="date-${year}-${date}-${month} livestream-page__day-table-row" data-description="${e.description}" data-permalink="${e.streamUrl}">
              <div class="livestream-info__ava">
                <a href="${e.streamUrl}"><img src="${e.authorAvatar}" alt="${e.title}"></a>
              </div>
              <div class="row-bordered new-border-author">
              <div class="event-n-author">
              <div class="event-author new-author">
              <div class="author-detail">
                  <img src="${e.authorAva}">
                  <a href="${e.authorLink}">${e.authorName}</a></div>
                </div>
                <div class="event-date-section">
                  <date datetime="${e.date}">
                  <div class="day-black">
                    <span class="day">${e.date.toLocaleString('en-US', { day: "2-digit" })}</span>
                    <span class="weekday">${e.date.toLocaleString('en-US', { weekday: 'short' })}</span>
                    </div>
                    <div class="month-grey">
                    <span class="month">${e.date.toLocaleString('en-US', { month: "short" })}</span>

                    <span class="hour">${e.date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</span>
                  </div>
                  </date>
                  
                </div>
                </div>
                <hr class="oragne-line">
                <h3 class="title-stream"><a href="${e.streamUrl}">${e.title}</a></h3>
                <div class="event-trunc-descriptoon stream-discription"><a href="${e.streamUrl}">${e.description.substring(0, 155)}... </a></div>
                
                <div class="flex-button">
                <div class="learn-div"> <a class="old-learn" href="${e.streamUrl}">Learn More</a></div>
                                  <div class="add-calender"><a href="" class="count-me new-count-new">Add to Calendar</a></div>
                </div>

                <div class="event--actions new-event-action">

                </div>
              </div>
            </div>
          `
          $('.livestream-page__day-table').append(rowHTML)
          
          renderEventActions()
        }
      })
    })
  }
  function checkScrollUrl() {
    if (document.location.href.includes('/pages/live')) {
      let id = document.location.href.split('#')[1]
      setTimeout(()=>{
        $('html, body').animate({
          scrollTop: $(`#${id}`).offset().top
        }, 300)
      },300)
    }
  }


  function scrollWindowScriptis() {
    var top;
    $(window).on('scroll', function() {
      top = $(this).scrollTop();
      if (top >= $('.header').innerHeight()) {
        $('.date-slider-wrapper').addClass('fixed')
      } else {
        $('.date-slider-wrapper').removeClass('fixed')
      }
      var currentSection = $('.livestream-page__day').eq(0);
      $('.livestream-page__day').each(function(){
        var sectionOffsetTop = $(this).offset().top - 120;
        if (top > sectionOffsetTop) {
          currentSection = $(this)
        }
      })
      var currentSliderDay = $('.date-slide[data-target="'+ currentSection.attr('class').substring(21) +'"]');
      $('.date-slide').removeClass('active-day')
      currentSliderDay.addClass('active-day')
      if (!currentSliderDay.parent().hasClass('slick-active')) {
        if (currentSliderDay.parent().next().hasClass('slick-active')) {
          $('.date-slider').slick("slickPrev");
        } else {
          $('.date-slider').slick("slickNext");
        }
      }

    })
  }

  function initApp() {
    // init date slider and add scripts on click for each day for scroll
    $('.date-slide').eq(0).addClass('active-day')
    $('.date-slide').on('click', function(){
      var target = $(this).data('target');
      if ($("." + target).length) $('html, body').animate({scrollTop: $("." + target).offset().top - 10}, 300);
    })
    $('.date-slider').slick({
      infinite: false,
      slidesToShow: 7,
      slidesToScroll: 1,
      arrows: true,
      responsive: [
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 5
          }
        }
      ]
    });

    // init scroll scripts for window
    // scrollWindowScriptis()

    // open modal window on livestream action click
    var modal = new tingle.modal({
        footer: true,
        stickyFooter: false,
        closeMethods: ['overlay', 'button', 'escape'],
        closeLabel: "Close",
        cssClass: ['custom-modal'],
        onOpen: function() {
        },
        onClose: function() {
        }
    });

    $('.count-me').on('click', function(e){
      e.preventDefault();
      var row = $(this).parents('.livestream-page__day-table-row');
      var src, authorAva, date, dateHTML, title, titleHTML, author, authorHTML,
      link, linkHTML;

      src= row.find('.livestream-info__ava img').attr('src');
      authorAvaHTML = '<div class="modal-author-ava"><img src="'+src+'"></div>';

      date = new Date(row.find('date').attr('datetime'));
      dateHTML = '<div class="modal-date">'+date.toLocaleDateString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true })+'</div>';

      title = row.find('.livestream-info__content h3').text();
      titleHTML = '<h2 class="modal-title">'+title+'</h2>';

      author = row.find('.livestream-info__content p').text();
      authorHTML = '<h3 class="modal-author">'+author+'</h3>';

      description = row.data('description');
      descriptionHTML = '<div class="modal-description">'+description+'</div>';

      link = row.find('.livestream--actions .join-link').attr('href');
      linkHTML = '<a class="modal-link" href="'+link+'" target="_blank">Live Class Page</a>';

      calendarHTML = '<h3 class="add-calendar-title">Add to Calendar:<h3><div id="addToCalendar"></div>'

      var myCalendar = createCalendar({
        options: {
          class: 'add-calendar-custom-class'
        },
        data: {
          // Event title
          title: title,
          // Event start date
          start: new Date(date),
          // Event duration (IN MINUTES)
          duration: 120,
          // Event Address
          address: link,
          // Event Description
          description: description
        }
      });
      
      //Saurabh - Live Class Page Link not appropriate populated 06 July, 22
      //modal.setContent(authorAvaHTML + dateHTML + titleHTML + authorHTML + linkHTML + calendarHTML);
      modal.setContent(authorAvaHTML + dateHTML + titleHTML + authorHTML + calendarHTML);
      document.querySelector('#addToCalendar').appendChild(myCalendar);

      modal.open();
    })

  }
  function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
  }
  function fetchLibraryData() {
    console.log('fetchLibraryData')

    let axiosHeaders = {
      headers: {
        'X-Fastly-Origin': STORE
      }
    }

    let one = `https://api-u-alpha.global.ssl.fastly.net/api/contents/search?category_id=${LIVE_CATEGORY_ID}&page=1`;
    let two = `https://api-u-alpha.global.ssl.fastly.net/api/contents/search?category_id=${LIVE_CATEGORY_ID}&page=2`;
    let three = `https://api-u-alpha.global.ssl.fastly.net/api/contents/search?category_id=${LIVE_CATEGORY_ID}&page=3`;

    const requestOne = axios.get(one, axiosHeaders);
    const requestTwo = axios.get(two, axiosHeaders);
    const requestThree = axios.get(three, axiosHeaders);

    axios
      .all([requestOne, requestTwo, requestThree])
      .then(
        axios.spread((...responses) => {
          let livestreams = []

          responses.map(response => {
            livestreams.push(response.data)
          })
          livestreams = [].concat.apply([], livestreams);
          

          let authorsRequest = 'https://api-u-alpha.global.ssl.fastly.net/api/authors'
          axios.get(authorsRequest, axiosHeaders).then((response) => {

            let authors = response.data
            
            console.log(authors)
            console.log(livestreams)
            
            let markup = livestreams.map(function(program){
              let authorTitle = ''
              let authorUrl =  ''
              let authorAva = ''
              if (program.author_id) {
                authors.forEach(author =>{
                  if (program.author_id === author.id) {
                    authorTitle = author.title
                    authorUrl = author.url
                    authorAva = author.avatar_url
                  }
                })
              }
              //console.log(program)
              if (program.short_description) {
                if (isValidDate(new Date(program.short_description.split('|')[0]))) {
                  return `
                    <div class="live-stream-object">
                      <div class="obj-title">${program.title.split('|')[0]}</div>
                      <div class="obj-stream-url">${program.url}</div>
                      <div class="obj-author-name">${authorTitle}</div>
                      <img class="obj-author-avatar" src="${program.main_poster}" />
                      <div class="obj-author-link">${authorUrl}</div>
                      <div class="obj-author-ava">${authorAva}</div>
                      <div class="obj-description">${program.description}</div>
                      <div class="obj-date">${program.short_description.split('|')[0]}</div>
                    </div>
                  `
                } else {
                  console.log(`Invalide date in live Event: ${program.url} ${program.title} ${program.short_description.split('|')[0]}`)
                }
              } else {
                console.log(`Empty short description: ${program.url} ${program.title}`)
              }

            }).join('')
            document.getElementById('streams-objects').innerHTML = markup
            //console.log(markup)
            renderMarkup()
            initApp()
          })



        })
      )
      .catch(errors => {
        // react on errors.
        console.error(errors);
      });

  }
  fetchLibraryData()

})
