totalDisplay = document.getElementById("wishlist-total-amount");
document
  .getElementById("wishlist-total-btn")
  .addEventListener("click", calculateTotal);

// Strip currency from the beginning of a price string.
function stripCurrency(price, currency) {
  var l = currency.length;

  // If price does not start with given currency, return 0
  if (price.slice(0, l) != currency) {
    return "0.0";
  }

  console.log(price, price.slice(l))

  return price.slice(l);
}

function calculateTotal() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: function () {
          var prices = Array.from(
            document.getElementsByClassName("a-price"),
            (element) => element.querySelector(".a-offscreen").innerText
          );

          currency = document.querySelector(".a-price-symbol")?.innerText;
          return [currency, prices];
        },
      },
      function (results) {
        resp = results[0].result;

        var priceSections = resp[1];
        if (priceSections.length <= 0) {
          console.log("No items in wishlist");
          return;
        }

        var currency = resp[0];
        console.log(currency, priceSections)
        var total =
          Math.round(
            priceSections.reduce((accumulator, current) => accumulator + parseFloat(stripCurrency(current, currency)), 0.0, ) * 100
          ) / 100;

        totalDisplay.innerText = `${currency}${total}`;
      }
    );
  });
}

calculateTotal();
