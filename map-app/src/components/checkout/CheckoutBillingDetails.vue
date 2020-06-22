<template>
  <div >
    <v-layout justify-center>
      <v-flex xs12 sm10 md8 lg6>
        <v-card ref="form">
          <v-card-text>
            <v-text-field
              ref="name"
              v-model="name"
              :rules="[() => !!name || 'This field is required']"
              :error-messages="errorMessages"
              label="Full Name"
              placeholder="John Doe"
              required
            ></v-text-field>
            <v-text-field
              ref="address"
              :rules="[
              () => !!address || 'This field is required',
              () => !!address && address.length <= 25 || 'Address must be less than 25 characters',
              addressCheck
            ]"
              v-model="address"
              label="Address Line"
              placeholder="Snowy Rock Pl"
              counter="25"
              required
            ></v-text-field>
            <v-text-field
              ref="city"
              :rules="[() => !!city || 'This field is required', addressCheck]"
              v-model="city"
              label="City"
              placeholder="El Paso"
              required
            ></v-text-field>
            <v-text-field
              ref="state"
              v-model="state"
              :rules="[() => !!state || 'This field is required']"
              label="State/Province/Region"
              required
              placeholder="TX"
            ></v-text-field>
            <v-text-field
              ref="zip"
              :rules="[() => !!zip || 'This field is required']"
              v-model="zip"
              label="ZIP / Postal Code"
              required
              placeholder="79938"
            ></v-text-field>
            <v-autocomplete
              ref="country"
              :rules="[() => !!country || 'This field is required']"
              :items="countries"
              v-model="country"
              label="Country"
              placeholder="Select..."
              required
            ></v-autocomplete>
          </v-card-text>
          <v-divider class="mt-5"></v-divider>
          <v-card-actions>
            <v-btn flat>Cancel</v-btn>
            <v-spacer></v-spacer>
            <v-slide-x-reverse-transition>
              <v-tooltip
                v-if="formHasErrors"
                left
              >
                <v-btn
                  slot="activator"
                  icon
                  class="my-0"
                  @click="resetForm"
                >
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
                <span>Refresh form</span>
              </v-tooltip>
            </v-slide-x-reverse-transition>
            <v-btn color="primary" flat @click="submit">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>


    <h3>Billing Details</h3>

    <div class="group">
      <label>
        <span>Card</span>
        <div id="card-element" class="field"></div>
      </label>
    </div>
    <div class="group">
      <label>
        <span>Name</span>
        <input id="name" name="name" class="field" placeholder="Jane Doe" />
      </label>
    </div>

    <div class="group">
      <label>
        <span>Address</span>
        <input id="address-line1" name="address_line1" class="field" placeholder="77 Winchester Lane" />
      </label>
      <label>
        <span>Address (cont.)</span>
        <input id="address-line2" name="address_line2" class="field" placeholder="" />
      </label>
      <label>
        <span>City</span>
        <input id="address-city" name="address_city" class="field" placeholder="Coachella" />
      </label>
      <label>
        <span>State</span>
        <input id="address-state" name="address_state" class="field" placeholder="CA" />
      </label>
      <label>
        <span>ZIP</span>
        <input id="address-zip" name="address_zip" class="field" placeholder="92236" />
      </label>
      <label>
        <span>Country</span>
        <input id="address-country" name="address_country" class="field" placeholder="United States" />
      </label>
    </div>

  </div>
</template>

<script>
  export default {
    data () {
      return {
      }
    },
    props: {
    },
    computed: {
    },
    methods:{
    },
    watch:{
    }
  }
</script>

<style scoped>
</style>
