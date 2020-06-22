<template>
  <div >
    <div class="work-section-container">
      <HeroTextSection>
        <template slot="title">
          Frequently Asked Questions (FAQ)
        </template>
        <template slot="subtitle">
        </template>
      </HeroTextSection>

      <v-container fluid>

        <v-layout row wrap v-for="(section, index) in sections" :key="index" style="margin-top: 10px">
          <v-flex xs12>
            <h2 class="headline  font-weight-normal "     style="padding-top: 20px; " >{{section.title}} </h2>
          </v-flex>
          <v-expansion-panel expand v-for="(question, index) in section.questions" :key="index">
            <v-expansion-panel-content class="white lighten-5">
              <div slot="header" ><h3  class="subheading font-weight-bold"> {{question.question}} </h3></div>
              <v-card>
                <v-card-text class="white lighten-5" >
                  <p style="padding-left: 10px" v-html="getFormattedAnswer(question.answer)" >
                  </p>
                </v-card-text>
              </v-card>
            </v-expansion-panel-content>
          </v-expansion-panel>


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
    data () {
      return {
        sections : [
          {
            title: "Shipping",
            questions: [
              {
                question: "Will I get a tracking number?",
                answer: "Yes! Once your order has shipped you'll receive an email with a link to track your order."
              },
              {
                question: "How is my order packaged?",
                answer: "Prints will be carefully rolled, lined with paper, and packaged into sturdy tubes."
              },
              {
                question: "Who pays the customs duties & taxes?",
                answer: "As shipments may incur customs fees depending on which country you are living in, you are responsible for paying customs fees. For EU customers, VAT is included in the price of your order."
              }
            ]
          },
          {
            title: "Order",
            questions: [
              {
                question: "How can I check the status of my order?",
                answer: "You can check the status of order <b><a href='/findmyorder'> here</a></b>"
              },
              {
                question: "My Order is damaged, what's the next steps?",
                answer: "We ship the prints in sturdy tubes that should withstand bumps along the way, but should you have any damaged prints please take a picture and send to {{supportemail}} and we'll replace these for you"
              },
              {
                question: "Can I cancel my order?",
                answer: "IF the order has not yet been sent for printing then this may be possible. Please contact {{supportemail}} to enquire. Once the order has been sent for printing or has shipped then this is not possible."
              },
              {
                question: "Refunds and returns",
                answer: "By law, customized items are not subject to returns, as we usually do not accept returns unless the items are neither faulty nor damaged. BUT we understand that each case is different so please get in touch with us via {{supportemail}} if you have any problems with your received print. We unfortunately, do not offer free returns, and do not cover shipping costs. "
              },
              {
                question: "My address is wrong, can I update it?",
                answer: "If for some reason the address is incorrect, write us an email to {{supportemail}} as fast as possible so that we can change the address on our end. However, be aware that we cannot change the address once the product has been shipped from our production site!"
              }
            ]
          },
          {
            title:"Payments",
            questions: [
              {
                question: "What payment methods do you accept?",
                answer: "We range of payment methods including Visa, MasterCard, American Express and also PayPal."
              },
              {
                question: "When is my card charged?",
                answer: "Your account is charged when your card has been approved that checkout."
              }
            ]
          },
          {
            title:"Customisation",
            questions: [
              {
                question: "Can I add a pin on the map?",
                answer: "We currently do not offer this."
              },
              {
                question: "Can I choose a custom color theme that isn't one of the choices?",
                answer: "If there's a color scheme you think is missing then we'd love to hear from you. If there's enough demand we'll add it to the next update."
              },
              {
                question: "Can I add a border?",
                answer: "Yes you can! There's an option to do this in the editor."
              },
              {
                question: "Can I add text?",
                answer: "You can edit all 3 lines of optional text in the Customization Step of the Editor."
              },
              {
                question: "Why can't I zoom in/out more?",
                answer: "The zoom levels have been specially prepared to work with the system."
              },
              {
                question: "Can I zoom between levels?",
                answer: "This is not currently possible."
              },
              {
                question: "Why can't I find my road on the map?",
                answer: "If you live on a recently built road then it may not have yet been added to the mapping service that we use. We unfortunately can't speed this up as it's out of our control."
              }
            ]
          },
          {
            title:"General",
            questions: [
              {
                question: "Where are you based?",
                answer: "We are based in London, England!"
              }
            ]
          }
        ]
      }
    },
    computed: {
      ...mapGetters([
        'supportEmail'
      ]),
    },
    methods:{
      getFormattedAnswer : function(str)
      {
        return str.replace("{{supportemail}}", "<i>"+ this.supportEmail +"</i>");
      }
    },
    watch:{
    }
  }
</script>

<style scoped>

</style>
