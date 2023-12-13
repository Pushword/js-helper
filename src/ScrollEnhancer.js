/**
 * Demo in Draft
 */

class ScrollYEnhancer {
  constructor(
    selector = '.enhance-scroll-y',
    arrow = '<div class="scroller absolute left-[128px] z-10 -mt-[10px] h-[44px] w-[44px] cursor-pointer rounded-full border border-gray-200 bg-white text-center text-3xl leading-none text-gray-500 hover:text-gray-700 select-none" onclick="scrollPreviousDiv(this)">⌄</div><div class="relative z-0 -mt-8 h-8 w-full bg-gradient-to-t from-white to-transparent"></div>',
    fadeout = '<div class="sticky left-0 -top-3 z-0 -mt-3 h-3 w-full bg-gradient-to-b from-white to-transparent"></div>',
  ) {
    window.scrollPreviousDiv = this.scrollPreviousDiv
    window.manageScrollYControllerVisibility = this.manageScrollYControllerVisibility

    document.querySelectorAll(selector).forEach((element) => {
      this.arrow = element.dataset.arrow ?? arrow
      this.fadeout = element.dataset.fadeout ?? fadeout
      element.classList.remove(selector)
      this.enhanceScrollY(element)
      this.mouseSliderY(element)
      this.wheelScroll(element)
      element.onscroll = function () {
        manageScrollYControllerVisibility(this)
      }
    })
  }

  wheelScroll(element) {
    element.addEventListener('wheel', (evt) => {
      evt.preventDefault()
      //element.classList.toggle('scroll-smooth')
      const before = element.scrollTop
      element.scrollTop += evt.deltaY
      const after = element.scrollTop
      if (before === after) {
        window.scrollWithoutDoingNothing++
        if (window.scrollWithoutDoingNothing > 10) window.scrollBy(0, evt.deltaY / 2)
      } else {
        window.scrollWithoutDoingNothing = 0
      }
      //element.classList.toggle('scroll-smooth')
    })
    return this
  }

  enhanceScrollY(element) {
    if (element.scrollHeight <= element.clientHeight) return
    element.insertAdjacentHTML('afterBegin', this.fadeout)
    element.insertAdjacentHTML('afterEnd', this.arrow)
  }

  scrollPreviousDiv(element) {
    const previousDiv = element.previousElementSibling
    if (!previousDiv) return
    if (element.textContent === '⌄') {
      previousDiv.scrollTop += 25 // ~ one line
      return
    }
    previousDiv.scrollTop = 0
  }

  manageScrollYControllerVisibility(element) {
    const scroller = element.parentNode.querySelector('.scroller')
    const isAtMaxScroll = element.scrollTop >= element.scrollHeight - element.clientHeight - 12
    if (scroller.textContent === '⌄' || isAtMaxScroll) {
      if (isAtMaxScroll) {
        scroller.textContent = '⌃'
        scroller.classList.add('pt-[11px]')
        scroller.classList.add('text-gray-200')
      }
      return
    } else {
      scroller.textContent = '⌄'
      scroller.classList.remove('pt-[11px]')
      scroller.classList.remove('text-gray-200')
    }
  }

  mouseSliderY(toSlide, speed = 1) {
    if ('ontouchstart' in document.documentElement) {
      return
    }
    toSlide.classList.add('overflow-y-hidden')
    let isDown = false
    let startX
    let scrollTop
    toSlide.addEventListener('mousedown', (e) => {
      isDown = true
      //toSlide.classList.add('active');
      startX = e.pageY - toSlide.offsetTop
      scrollTop = toSlide.scrollTop
    })
    toSlide.addEventListener('mouseleave', () => {
      isDown = false
      //toSlide.classList.remove('active');
    })
    toSlide.addEventListener('mouseup', () => {
      isDown = false
      //toSlide.classList.remove('active');
    })
    toSlide.addEventListener('mousemove', (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageY - toSlide.offsetTop
      const walk = (x - startX) * speed
      toSlide.scrollTop = scrollTop - walk
    })
  }
}

class ScrollXEnhancer {
  constructor(
    selector = '.enhance-scroll-x',
    arrowRight = '<div class="scroll-right relative left-[calc(100vw-62px)] -mt-[44px] top-1/3 z-20 h-[44px] w-[44px] cursor-pointer select-none rounded-full border border-gray-200 bg-white pt-[3px] text-center text-3xl leading-none text-gray-500 hover:text-gray-700" onclick="scrollX(this)">›</div>',
    arrowLeft = '<div class="scroll-left relative left-[22px] top-1/3 z-20 h-[44px] w-[44px] cursor-pointer select-none rounded-full border border-gray-200 bg-white pt-[3px] text-center text-3xl leading-none text-gray-500 hover:text-gray-700" onclick="scrollX(this)">‹</div>',
  ) {
    window.scrollLeft = this.scrollLeft
    window.scrollX = this.scrollX
    window.manageScrollXControllerVisibility = this.manageScrollXControllerVisibility

    document.querySelectorAll(selector).forEach((element) => {
      this.arrowLeft = element.dataset.arrowleft ?? arrowLeft
      this.arrowRight = element.dataset.arrowright ?? arrowRight
      element.classList.remove(selector)
      this.enhanceScrollX(element)
      this.mouseSliderX(element)
      this.wheelScroll(element)
      element.onscroll = function () {
        manageScrollXControllerVisibility(this)
      }
    })
  }

  wheelScroll(element) {
    element.addEventListener('wheel', (evt) => {
      evt.preventDefault()
      if (evt.target.closest('.enhance-scroll-y')) return
      if (window.isScrolling === true) return
      //element.classList.toggle('scroll-smooth')
      const before = element.scrollLeft
      element.scrollLeft += evt.deltaY
      const after = element.scrollLeft
      if (before === after) {
        window.scrollWithoutDoingNothing++
        if (window.scrollWithoutDoingNothing > 10) window.scrollBy(0, evt.deltaY / 2)
      } else {
        window.scrollWithoutDoingNothing = 0
      }
      //element.classList.toggle('scroll-smooth')
    })
  }

  enhanceScrollX(element) {
    if (element.scrollWidth <= element.clientWidth) return
    element.insertAdjacentHTML('beforebegin', this.arrowLeft + this.arrowRight)
  }

  scrollX(scroller, selector = '.enhance-scroll-x') {
    const element = scroller.parentNode.querySelector(selector)
    if (!element) return

    const scrollToRight = scroller.classList.contains('scroll-right')

    const oppositeSelector = scrollToRight ? 'scroll-left' : 'scroll-right'
    const oppositeController = element.querySelector('.' + oppositeSelector)

    const nextElementToScroll = element.children[3] // work only with equal width block
    const toScrollWidth = nextElementToScroll.offsetWidth + parseInt(window.getComputedStyle(nextElementToScroll).marginLeft)
    element.scrollLeft += scrollToRight ? toScrollWidth : -toScrollWidth
  }

  manageScrollXControllerVisibility(element) {
    const scrollLeftElement = element.parentNode.querySelector('.scroll-left')
    const scrollRightElement = element.parentNode.querySelector('.scroll-right')
    scrollRightElement.classList.remove('opacity-30')
    scrollLeftElement.classList.remove('opacity-30')

    const isAtMaxScroll = element.scrollLeft >= element.scrollWidth - element.clientWidth
    if (isAtMaxScroll) scrollRightElement.classList.add('opacity-30')
    if (element.scrollLeft === 0) scrollLeftElement.classList.add('opacity-30')
  }

  mouseSliderX(toSlide, speed = 1) {
    if ('ontouchstart' in document.documentElement) {
      return
    }
    toSlide.classList.add('overflow-x-hidden')
    let isDown = false
    let startX
    let scrollLeft
    toSlide.addEventListener('mousedown', (e) => {
      isDown = true
      startX = e.pageX - toSlide.offsetLeft
      scrollLeft = toSlide.scrollLeft
    })
    toSlide.addEventListener('mouseleave', () => {
      isDown = false
    })
    toSlide.addEventListener('mouseup', () => {
      isDown = false
    })
    toSlide.addEventListener('mousemove', (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - toSlide.offsetLeft
      const walk = (x - startX) * speed
      toSlide.scrollLeft = scrollLeft - walk
    })
  }
}

module.exports = {
  ScrollXEnhancer: ScrollXEnhancer,
  ScrollYEnhancer: ScrollYEnhancer,
}
