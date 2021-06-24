function eventlistners() {
  const storeItemslist = document.querySelector(".store");

  let storeItems = document.querySelectorAll(".store-item");
  const searchBox = document.querySelector(".form-control");

  const navBtns = document.querySelector(".navigation-btns");
  const sortBtn = document.querySelector(".sortBtn");
  const cartItemsContainer = document.querySelector(".cart-items");
  const cartInfo = document.getElementById("cart-info");

  const cartList = document.querySelector(".cart");

  const clearCartBtn = document.getElementById("clear-cart");

  // =================== intializtion
  const cartItemsArr = [];

  let itemsInPage = storeItems;

  const ui = new UI();

  ui.filterItems(itemsInPage,"filter");

  ui.calculateSum(cartList);

  // ========== showing and hiding cart

  cartInfo.addEventListener("click", function () {
    cartList.classList.toggle("show-cart");
  });

  // ============= adding item to the list

  storeItemslist.addEventListener("click", function (event) {
    if (
      event.target.parentElement.classList.contains("store-item-icon") &&
      event.target.parentElement.textContent != "IN CART"
    ) {
      let imgContainer =
        event.target.parentElement.parentElement.parentElement.parentElement;

      event.preventDefault();

      let id = imgContainer.parentElement.parentElement.id;
      let price =
        imgContainer.nextElementSibling.firstElementChild.lastElementChild
          .firstElementChild.textContent;

      price = parseInt(price);

      let itemName =
        imgContainer.nextElementSibling.firstElementChild.firstElementChild
          .textContent;

      let img = imgContainer.firstElementChild.src;

      let size = event.target.parentElement.previousElementSibling.textContent;

      if (size === "S") {
        price = price;
      } else if (size === "M") {
        price += 5;
      } else {
        price += 10;
      }

      item = new CartItem(id, price, img, itemName, size);

      cartItemsArr.push(item);

      ui.addItem(cartList, item);

      event.target.parentElement.innerHTML = "IN CART";

      ui.changeCartItemStatus(storeItems, id, size, "in cart");

      ui.calculateSum(cartList);
    }
  });

  // =====================  deleting items
  cartList.addEventListener("click", function (event) {
    event.preventDefault();

    if (event.target.classList.contains("fa-trash")) {
      let id = event.target.parentElement.parentElement.id;
      let size =
        event.target.parentElement.previousElementSibling.previousElementSibling
          .firstElementChild.nextElementSibling.textContent;
      let storeItemTemp = document.querySelectorAll(".store-item");

      ui.changeCartItemStatus(storeItemTemp, id, size, "add to cart");
      ui.changeCartItemStatus(storeItems, id, size, "add to cart");
      cartItemsContainer.removeChild(event.target.parentElement.parentElement);
      ui.calculateSum(cartList);
      //         alert("Item removed from cart successfully");
    }
  });

  //======================== Clearing cart

  clearCartBtn.addEventListener("click", function (event) {
    event.preventDefault();
    const cartItems = document.querySelectorAll(".cart-item");

    cartItems.forEach((item) => {
      cartItemsContainer.removeChild(item);
    });

    let storeItemTemp = document.querySelectorAll(".store-item");

    ui.changeItemStatusClearingCart(storeItemTemp);
    ui.changeItemStatusClearingCart(storeItems);

    ui.calculateSum(cartList);
  });

  // =====================  filtering items

  sortBtn.addEventListener("click", function (event) {
    // setting the current page back to one because of the new searching query or filtering

    document.querySelector(".navBtn-text").textContent = 1;

    event.preventDefault();
    let array = Array.from(storeItems);
console.log(array);
    itemsInPage = ui.changeCategory(ui, array, event.target.dataset.filter);
  });

  // =======================searching items using the search box

  searchBox.addEventListener("input", function () {
    document.querySelector(".navBtn-text").textContent = 1;
    let text = this.value;
    let array = Array.from(storeItems);

    if (text.length > 0) {
      let newArr = array.filter(function (item) {
        return (
          item.lastElementChild.lastElementChild.firstElementChild.firstElementChild.textContent.includes(
            text
          ) === true
        );
      });
      array = newArr;
    }
    ui.filterItems(array,"filter");
    itemsInPage = array;
  });

  // ======================== navigation pages

  navBtns.addEventListener("click", function (event) {
    let currentPage = document.querySelector(".navBtn-text").textContent;

    let tempItemInPage = [];
    if (itemsInPage.length >= 3) {
      if (event.target.parentElement.classList.contains("right")) {
        if (parseInt(currentPage) < Math.trunc(itemsInPage.length / 3)) {
          let navtext = document.querySelector(".navBtn-text");

          navtext.textContent = ++currentPage;
        }
      } else if (event.target.parentElement.classList.contains("left")) {
        if (parseInt(currentPage) > 1) {
          document.querySelector(".navBtn-text").textContent = parseInt(
            --currentPage
          );
        }
      }
      for (
        var i = parseInt(currentPage * 3) - 1;
        i >= parseInt(currentPage * 3) - 3;
        i--
      ) {
        if (itemsInPage[i]) {
          tempItemInPage.push(itemsInPage[i]);
        }
      }

      ui.filterItems(tempItemInPage,"filter");
    }
  });

  // =======================increasing or decreasing items count
  cartList.addEventListener("click", function (event) {
    let currentPrice = 0;
    if (
      event.target.parentElement.classList.contains("cart-item-plus") ||
      event.target.parentElement.classList.contains("cart-item-minus")
    ) {
      // getting the the item price by the its ID

      let itemID = event.target.parentElement.parentElement.parentElement.id;
      let size =
        event.target.parentElement.parentElement.parentElement.querySelector(
          ".cart-item-size"
        ).textContent;

      console.log(size);

      storeItems.forEach((item) => {
        if (item.id === itemID) {
          currentPrice = Math.floor(
            parseFloat(
              item.firstElementChild.lastElementChild.lastElementChild
                .lastElementChild.lastElementChild.textContent
            )
          );
        }
      });

      // changing the base price depending on the size
      if (size === "S") {
        currentPrice = currentPrice;
      } else if (size === "M") {
        currentPrice += 5;
      } else {
        currentPrice += 10;
      }
    }

    //        increasing count
    if (event.target.parentElement.classList.contains("cart-item-plus")) {
      //           getting the current count to increase by the base price
      let currentCount = parseInt(
        event.target.parentElement.nextElementSibling.textContent
      );

      // changing count
      event.target.parentElement.nextElementSibling.textContent =
        currentCount + 1;

      //chaning price
      event.target.parentElement.parentElement.previousElementSibling.lastElementChild.textContent =
        currentPrice * (currentCount + 1);
      ui.calculateSum(cartList);
    } else if (
      event.target.parentElement.classList.contains("cart-item-minus")
    ) {
      let currentCount = parseInt(
        event.target.parentElement.previousElementSibling.textContent
      );
      // changing count
      if (currentCount > 0) {
        event.target.parentElement.previousElementSibling.textContent =
          currentCount - 1;
        // changing price

        event.target.parentElement.parentElement.previousElementSibling.lastElementChild.textContent =
          currentPrice * (currentCount - 1);

        ui.calculateSum(cartList);
      }
    }
  });
}

//++++++++++++++++++++++++++++++  UI  ++++++++++++++++++++++++++++++

function UI() {}

// ---------------------------adding items to the cart
UI.prototype.addItem = function (element, item) {
  const divcontainer = document.querySelector(".cart-items");
  const div = document.createElement("div");
  div.classList.add(
    "cart-item",
    "d-flex",
    "justify-content-between",
    "text-capitalize",
    "my-3",
    "align-items-center"
  );
  div.id = item.id;

  const imgIndex = item.img.indexOf("img/");
  const jpegIndex = item.img.indexOf(".jpeg");
  let img = item.img.slice(imgIndex + 4, jpegIndex + 5);
  img = "img-cart/" + img;

  div.innerHTML = `<img src="${img}" alt="" class="img-fluid rounded-circle" id="img-item">
                        <div class="item-text">
                            <p id="cart-item-title" class="font-weight-bold mb-0">${item.name}</p>
                            <span id="cart-item-size" class="cart-item-size mb-3">${item.size}</span>
<span>:</span>
                            <span>$</span>
                            <span id="cart-item-price" class="cart-item-price mb-3">${item.price}</span>

                        </div>
                        <div class="item-count">
                            <span class="cart-item-plus d-block mb-0"><i class="fas fa-plus"></i></span>
                            <span class="cart-item-count d-block mb-0">1</span>
                             <span class="cart-item-minus d-block"><i class="fas fa-minus"></i></span>
                        </div>
                        <a href="" class="cart-item-remove" id="cart-item-price"><i class="fas fa-trash"></i></a>`;
  divcontainer.appendChild(div);

  //    alert("Item added to the cart sucessfully");
};

// --------------------calculating the total price of the products

UI.prototype.calculateSum = function (cartlist) {
  let element = document.querySelectorAll(".cart-item");
  let navIcon = document.getElementById("cart-info");
  let sum = 0.0;
  if (element.length > 0) {
    element.forEach((item) => {
      sum += Math.floor(
        parseFloat(
          item.firstElementChild.nextElementSibling.lastElementChild.textContent
        )
      );
    });
  }
  console.log(sum);
  cartlist.lastElementChild.previousElementSibling.lastElementChild.firstElementChild.textContent =
    sum;
  navIcon.lastElementChild.firstElementChild.textContent = element.length;
  navIcon.lastElementChild.lastElementChild.textContent = sum;
};

// ---------------------------- filtering items using the search box (populating the store)

UI.prototype.filterItems = function (array, command) {
  let element = document.querySelector(".store-items");

  let div = document.createElement("div");
  div.classList.add("row", "store-items");
  div.id = "store-items";
  let innertext = "";

  let index = 0;

  // filtering only the first three items in the array ,cuz every page has only three items
  if (command === "filter") {
    array.forEach(function (item) {
      if (index <= 2) {
        innertext += item.outerHTML;
        index++;
      }
    });
  } else {
    array.forEach(function (item) {

      let categ = item.img.slice(0,-2) +"s";
      console.log(categ);
      innertext += `<!--   single card{store items} -->

        <div
          class="col-10 col-md-6 my-3 col-lg-4 mx-auto store-item ${categ}"
          id="${item.id}"
        >
          <div class="card single-item">
            <div class="img-container">
              <img
                src="img/${item.img}.jpeg"
                alt=""
                class="card-img-top store-img"
              />
              <div class="size-item-icons text-center">
                <span
                  class="
                    size-s size-icon
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                >
                  <p class="mr-2">S</p>
                  <span
                    class="
                      store-item-icon
                      d-flex
                      justify-content-around
                      align-items-center
                    "
                  >
                    <i
                      class="fas fa-shopping-cart align-self-center mr-1 mb-3"
                    ></i>
                    <p class="icon-text text-uppercase">add to cart</p>
                  </span>
                </span>

                <div class="line"></div>
                <span
                  class="
                    size-m size-icon
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                >
                  <p class="mr-2">M</p>
                  <span
                    class="
                      store-item-icon
                      d-flex
                      justify-content-around
                      align-items-center
                    "
                  >
                    <i class="fas fa-shopping-cart mr-1 mb-3"></i>
                    <p class="icon-text text-uppercase">add to cart</p>
                  </span>
                </span>
                <div class="line"></div>
                <span
                  class="
                    size-l size-icon
                    d-flex
                    justify-content-between
                    align-items-center
                  "
                >
                  <p class="mr-2">L</p>
                  <span
                    class="
                      store-item-icon
                      d-flex
                      justify-content-around
                      align-items-center
                    "
                  >
                    <i
                      class="fas fa-shopping-cart align-self-center mb-3"
                    ></i>
                    <p class="icon-text text-uppercase">add to cart</p>
                  </span>
                </span>
              </div>
            </div>
            <div class="card-body">
              <div
                class="
                  card-text
                  d-flex
                  justify-content-between
                  text-capitalize
                "
              >
                <h5 class="store-item-name">${item.name}</h5>
                <h5 class="store-item-value">
                  $<strong id="store-item-price">${item.price}</strong>
                </h5>
              </div>
            </div>
          </div>
        </div>`;
    });
  }

  div.innerHTML = innertext;
  element.parentElement.replaceChild(div, element);
};

// change Store Item Status from In cart to Add to cart and vice versa

UI.prototype.changeCartItemStatus = function (storeItems, id, size, value) {
  storeItems.forEach((item) => {
    if (item.id === id) {
      item.querySelectorAll(".size-icon").forEach((itemsize) => {
        if (itemsize.firstElementChild.textContent === size) {
          itemsize.lastElementChild.innerHTML = `
                 <i class="fas fa-shopping-cart align-self-center mb-3"></i> <p class="icon-text text-uppercase">${value}</p></span> `;
        }
      });
    }
  });
};

UI.prototype.changeCategory = function (ui, array, category) {
  let tempArr = array;
  if (category !== "all") {
    tempArr = array.filter(function (item) {
      return item.classList.contains(category) === true;
    });
  }

  ui.filterItems(tempArr,"filter");
  return tempArr;
};

UI.prototype.changeItemStatusClearingCart = function (storeItems) {
  storeItems.forEach((item) => {
    item.querySelectorAll(".size-icon").forEach((itemsize) => {
      if (itemsize.lastElementChild.textContent === "IN CART") {
        itemsize.lastElementChild.innerHTML = `
                   <i class="fas fa-shopping-cart align-self-center mb-3"></i> <p class="icon-text text-uppercase">add to cart</p></span> `;
      }
    });
  });
};

function CartItem(id, price, img, name, size) {
  this.id = id;
  this.img = img;
  this.price = price;
  this.name = name;
  this.size = size;
}

(function () {
  const ui = new UI();
  console.log(items);
  ui.filterItems(items, "pop");
  eventlistners();
})();
