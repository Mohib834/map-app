<template>
  <div >
    <div class="work-section-container">

      <HeroTextSection>
        <template slot="title">
          Privacy Policy.
        </template>
        <template slot="subtitle">
        </template>
      </HeroTextSection>

      <v-container fluid>
        <v-layout row wrap>
          <v-flex xs12>
            <p class=" title"> What do we do with your information? </p>
            <p class=" body-1">
              When you purchase something from our store, as part of the buying and selling process, we collect the personal information you give us such as your name, address and email address.
              When you browse our store, we also automatically receive your computer’s internet protocol (IP) address in order to provide us with information that helps us learn about your browser and operating system.
              Email marketing (if applicable): With your permission, we may send you emails about our store, new products and other updates.
            </p>

            <p class=" title"> Consent </p>
            <p class=" body-1">
              When you provide us with personal information to complete a transaction, verify your credit card, place an order, arrange for a delivery or return a purchase, we imply that you consent to our collecting it and using it for that specific reason only.
              If we ask for your personal information for a secondary reason, like marketing, we will either ask you directly for your expressed consent, or provide you with an opportunity to say no.
              If after you opt-in, you change your mind, you may withdraw your consent for us to contact you, for the continued collection, use or disclosure of your information, at anytime, by contacting us at {{ supportEmail }}
            </p>

            <p class=" title"> Disclosure </p>
            <p class=" body-1">
              We may disclose your personal information if we are required by law to do so or if you violate our Terms of Service.
            </p>
            <p class=" title"> Third-party services
            </p>
            <p class=" body-1">
              We will never disclose, sell or share your personal information, with the exception of anonymized data for the below purposes :
            </p>
            <p class=" body-1">
              Google analytics
            </p>
            <p class=" body-1">
              Our store uses Google Analytics to help us learn about who visits our site and what pages are being looked at.
            </p>
            <p class=" body-1">
              Stripe & BrainTree, a PayPal company
            </p>
            <p class=" body-1">
              These are payment gateways and includes security protection, fraud validation and storing of transactional data as required by law.
            </p>
            <p class=" title"> Security </p>
            <p class=" body-1">
              To protect your personal information, we take reasonable precautions and follow industry best practices to make sure it is not inappropriately lost, misused, accessed, disclosed, altered or destroyed.
              All payments go via a secure payment system, which has been audited by a PCI-certified auditor and is certified to PCI Service Provider Level 1. This is the most stringent level of certification available in the payments industry. To accomplish this, we make use of best-in-class security tools and practices to maintain a high level of security at Stripe.
            </p>

            <p class=" title"> Storage Period </p>
            <p class=" body-1">
              We do not store personal data longer than is legally permitted and necessary for the purposes of providing our services. The storage period depends on the nature of the information and the purposes of processing. The maximum period may therefore vary per use.
            </p>

            <p class=" title"> Cookies </p>
            <p class=" body-1">
              By using this website you agree to the usage of cookies to allow for the site to operate correctly.
              We do not use or sell any data for marketing purposes or third party advertisers.

              We use cookies for the following purposes:

              General site operation - a cookie is used to store your basket information so that it can be saved while browsing and returning to the site.
              It is stored for 30 days from last access.

              Google analytics - to help us improving our website by learning about what pages are being looked at.

            </p>

            <p class=" title"> Changes to this privacy policy
            </p>
            <p class=" body-1">
              We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.
              If our store is acquired or merged with another company, your information may be transferred to the new owners so that we may continue to sell products to you.
            </p>

            <p class=" title"> Questions and contact information</p>
            <p class=" body-1">
              If you would like to: access, correct, amend or delete any personal information we have about you, register a complaint, or simply want more information contact our Privacy Compliance Officer at {{supportEmail}}
            </p>
          </v-flex>
        </v-layout>


      </v-container>
    </div>

    <SiteFooter></SiteFooter>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    props: {
    },
    computed: {
      ...mapGetters([
        'supportEmail'
      ]),
    },
    data () {
      return {
      }
    },
    methods:{
    },
    watch:{
    }
  }
</script>

<style scoped>


</style>
