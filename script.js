let current_form = 0
let main_product = { name: "Arcade", price: 9 }
let main_product_at = "in-mo"
let ads_ons_options = []



// SIDEBAR LIST 
let lists = document.querySelectorAll(".sidebar ul li")
let forms = document.querySelectorAll(".form-section .form")

lists.forEach((list, index) => {
    list.addEventListener("click", () => {
        setActiveList(list)
        setActiveForm(index)

        current_form = index
    })
})

function setActiveList(list) {
    lists.forEach(element => element.classList.remove("active"))
    list.classList.add("active")
}
function setActiveForm(index) {
    forms.forEach(form => form.classList.remove("active"))
    forms[index].classList.add("active")
}

// FORM SECTIONS BUTTONS(BACK, NEXT)
let prev_btn = document.querySelector(".form-section .form-actions .prev-btn")
let next_btn = document.querySelector(".form-section .form-actions .next-btn")
let confirm_btn = document.querySelector(".form-section .form-actions .confirm-btn")


let confirmation_content = document.querySelector(".confirmation-content")
let summary_content = document.querySelector(".summary-content")

next_btn.addEventListener("click", () => {
    current_form += 1
    if (current_form >= forms.length) current_form = 0
    setActiveList(lists[current_form])
    setActiveForm(current_form)
})

prev_btn.addEventListener("click", () => {
    current_form -= 1
    if (current_form < 0) current_form = forms.length
    setActiveList(lists[current_form])
    setActiveForm(current_form)
})

confirm_btn.addEventListener("click", (e) => {
    e.preventDefault()

    // DOES PERSONAL INFO FIELDS ARE COMPELETED
    let personal_info_form_ready = completePersonalInfoForm()
    if (personal_info_form_ready === false) return false

    confirmation_content.classList.toggle("active")
    summary_content.classList.toggle("active")

})



// PERSONAL INFO FORM FIELDS
let text_fields = document.querySelectorAll(".personal-info-form .form-body .text-field")
let inputs = document.querySelectorAll(".personal-info-form .form-body .text-field input")

function completePersonalInfoForm() {
    let all_fields_compelte = true
    inputs.forEach((input, index) => {

        if (input.value === null || input.value === "") {
            text_fields[index].classList.add("error")
            all_fields_compelte = false
        } else text_fields[index].classList.remove("error")
    })

    if (all_fields_compelte) return true

    return false
}


// PLAN FORM TOGGLE
let toggle_container = document.querySelector(".toggle-container")
let toggle = document.querySelector(".toggle")
let cards = document.querySelector(".cards")
let form_section = document.querySelector(".form-section")

toggle.addEventListener("click", () => {
    toggle_container.classList.toggle("active")
    cards.classList.toggle("active")
    form_section.classList.toggle("yr")

    // CLEAR ADS-ONS
    clearActiveAdsOns()

    if (form_section.classList.contains("yr")) {
        main_product_at = "in-yr"
        main_product.price *= 10
    }
    else {
        main_product_at = "in-mo"
        main_product.price /= 10
    }
    makeSummaryForm()
})

// PLAN FORM CARDS
let all_card = document.querySelectorAll(".cards .card")

all_card.forEach(card => {
    card.addEventListener("click", () => {
        setActiveCard(card)
    })
})

function setActiveCard(card) {
    all_card.forEach(element => element.classList.remove("active"))
    card.classList.add("active")


    let name = card.querySelector(".card-content").querySelector(".content-title").textContent
    let price = parseInt(card.querySelector(`.${main_product_at}`).querySelector(".content-desc").textContent.split("/")[0].substring(1))
    main_product = { name, price }
    makeSummaryForm()
}


// ADDS-ONS FORM
let ads_options = document.querySelectorAll(".adds-ons-form .ads-option")

ads_options.forEach(ads_option => {
    ads_option.addEventListener("click", () => {
        ads_option.classList.toggle("checked")

        if (ads_option.classList.contains("checked")) {
            ads_option.querySelector("input").checked = true
            addAdsOns(ads_option)
        } else {
            removeAdsOns(ads_option)
            ads_option.querySelector("input").checked = false
        }
        makeSummaryForm()
    })
})

function clearActiveAdsOns() {
    ads_ons_options = []
    added_ads.innerHTML = ''
    ads_options.forEach(ads_option => {
        ads_option.classList.remove("checked")
        ads_option.querySelector("input").checked = false
    })
}

function addAdsOns(ads_option) {
    let ads_option_name = ads_option.querySelector(".card-content").querySelector(".content-title").textContent
    // let ads_option_price = ads_option.querySelector(`.${main_product_at}`).textContent
    let ads_option_price = parseInt(ads_option.querySelector(`.${main_product_at}`).textContent.split("/")[0].substring(2))

    ads_ons_options.push({ name: ads_option_name, price: ads_option_price })
}
function removeAdsOns(ads_option) {
    let ads_option_name = ads_option.querySelector(".card-content").querySelector(".content-title").textContent

    ads_ons_options = ads_ons_options.filter(option => option.name != ads_option_name)
    if(ads_ons_options.length === 0) added_ads.innerHTML = ''
}


// BUILD SUMMARY FORM

let added_ads = document.querySelector(".added-ads")
let product_name = document.querySelector(".main-product-content .card-content .content-title")
let product_price = document.querySelector(".main-product-content .content-price")
let product_total_price = document.querySelector(".summary-form .total-price .content-price2")
let product_by_period = document.querySelector(".summary-form .total-price .content-desc")

makeSummaryForm()

function makeSummaryForm() {

    let mo_or_yr = main_product_at.split("-")[1]
    product_name.textContent = main_product.name
    product_price.textContent = `$${main_product.price}/${mo_or_yr}`
    let total_price = main_product.price

    if(mo_or_yr == "mo") product_by_period.textContent = "Total (per month)"
    else product_by_period.textContent = "Total (per year)"

    if (ads_ons_options.length === 0) {
        added_ads.classList.remove("active")
        product_total_price.textContent = `+$${total_price}/${mo_or_yr}`
        return
    }
    
    added_ads.innerHTML = ''
    for (let i = 0; i < ads_ons_options.length; i++) {
        // MAKE ADDED_AD ELEMENTS
        let added_ad = document.createElement("div")
        let added_ad_name = document.createElement("span")
        let added_ad_price = document.createElement("span")

        // ADD CLASS NAMES TO ELEMENTS
        added_ad.classList.add("added-ad")
        added_ad_name.classList.add("content-desc")
        added_ad_price.classList.add("content-price")

        // PUT VALUES TO ELEMENTS
        added_ad_name.textContent = ads_ons_options[i].name
        added_ad_price.textContent = `+$${ads_ons_options[i].price}/${mo_or_yr}`

        added_ad.appendChild(added_ad_name)
        added_ad.appendChild(added_ad_price)

        added_ads.appendChild(added_ad)
        total_price += ads_ons_options[i].price
    }

    added_ads.classList.add("active")
    product_total_price.textContent = `+$${total_price}/${mo_or_yr}`
}