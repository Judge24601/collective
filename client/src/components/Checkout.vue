<template>
  <div class="container">
    <!-- Use the CSS tab above to style your Element's container. -->
    <div id="card-element" class="MyCardElement">
      <!-- Elements will create input elements here -->
      <p>hi</p>
    </div>

    <!-- We'll put the error messages in this element -->
    <div id="card-errors" role="alert"></div>
    <button v-on:click="purchase" id="submit">Purchase</button>
  </div>
</template>
<script src="https://js.stripe.com/v3/"></script>

<script>
import UserService from "@/services/UserService";
import Vue from 'vue';
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
          email: this.$auth.user.email
        }
      });
      try {
        this.$emit("exit", true)
        const response = await UserService.addUser({
          name: this.$auth.user.name,
          email: this.$auth.user.email,
          payment_method: paymentMethod
        });
        let user = await UserService.getUser(this.$auth.user.email);
        this.$store.commit('updateUser', user.data);
        const customer = response.json();
        // The customer has been created

        const { latest_invoice } = subscription;
        const { payment_intent } = latest_invoice;

        if (payment_intent) {
          const { client_secret, status } = payment_intent;

          if (status === "requires_action") {
            stripe.confirmCardPayment(client_secret).then(function(result) {
              if (result.error) {
                console.log("NO");
              } else {
                console.log("All is well!");
              }
            });
          } else {
            // No additional information was needed
            // Show a success message to your customer
          }
        }
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
    color: "#ffffff",
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
