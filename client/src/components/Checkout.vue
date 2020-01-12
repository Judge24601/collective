<template>
  <div>
    <!-- Use the CSS tab above to style your Element's container. -->
    <div id="card-element" class="MyCardElement">
      <!-- Elements will create input elements here -->
    </div>

    <!-- We'll put the error messages in this element -->
    <div id="card-errors" role="alert"></div>
    <button v-on:click="purchase" id="submit">Purchase</button>
  </div>
</template>
<script src="https://js.stripe.com/v3/"></script>

<script>
let stripe = Stripe("pk_test_mCaKNqWh4ybhZDzoJ6WiMk9d00bgu8VK6V");
let elements = stripe.elements();
let cardElement = elements.create("card", style);


export default {
  mounted: function() {
    // let stripeScript = document.createElement("script");
    // stripeScript.setAttribute("src", "https://js.stripe.com/v3/");
    // document.head.appendChild(stripeScript);
    cardElement.mount("#card-element");
  },
  methods: {
    async purchase() {
      const { paymentMethod, error } = await stripe.createPaymentMethod({
        type: "card",
        card: cardElement,
        billing_details: {
          email: "jenny.rosen@example.com"
        }
      });
      try {
        const response = await fetch("/create-customer", {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: "name",  
            email: "jenny.rosen@example.com",
            payment_method: "pm_1FU2bgBF6ERF9jhEQvwnA7sX"
          })
        });
        const customer = response.json();
        // The customer has been created
      } catch (error) {
        // Handle error from server if customer wasn't created
      }
    }
  },
  watch: {
    card: () => {
      const displayError = document.getElementById("card-errors");
      if (error) {
        displayError.textContent = error.message;
      } else {
        displayError.textContent = "";
      }
    }
  }
};



let style = {
  base: {
    color: "#32325d",
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: "antialiased",
    fontSize: "16px",
    "::placeholder": {
      color: "#aab7c4"
    }
  },

  invalid: {
    color: "#fa755a",
    iconColor: "#fa755a"
  }
};
</script>
