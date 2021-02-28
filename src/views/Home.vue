<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <div id="calendar"/>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-list-item v-for="(itm, idx) in vacationList" :key="'list-' + itm.id + idx">
          <v-list-item-avatar>
            <v-img :src="memberList[itm.userId].photoURL"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title
            >{{ memberList[itm.userId].nickName || memberList[itm.userId].displayName }}
            </v-list-item-title>
            <v-list-item-subtitle>
              <v-chip-group
                  mandatory
              >
                <v-chip
                    v-for="d in itm.vDate"
                    :key="itm.id + d"
                    x-small
                >{{ d }}</v-chip>
              </v-chip-group>
            </v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-menu
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                >
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>

              <v-list>
                <v-list-item>
                  <v-list-item-title>관리자</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>삭제</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-col>
    </v-row>
    <v-fab-transition v-if="user && user.id">
      <v-btn
          color="pink"
          dark
          fixed
          bottom
          right
          fab
          :to="{ name: 'apply-vacation' }"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-fab-transition>
  </v-container>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import mobiscroll from "@mobiscroll/javascript"
import '@mobiscroll/javascript/dist/css/mobiscroll.min.css'
import dayjs from 'dayjs'
import firebase from "firebase";

export default {
  head() {
    return {
      title: {
        inner: 'Home'
      },
      meta: [
        {
          name: 'description',
          content: `${this.appTitle} home page`,
          id: 'desc'
        }
      ]
    }
  },
  data() {
    return {
      userDB: firebase.firestore().collection('users'),
      vacationDB: firebase.firestore().collection('vacation'),
      vacationList: null,
      memberList: null
    }
  },
  computed: {
    ...mapState('app', ['appTitle']),
    ...mapState('authentication', ['user', 'userList']),
    ...mapState('vacation', ['vacations'])
  },
  watch: {
    user (newValue) {
      if (newValue && newValue.id) this.init()
    }
  },
  methods: {
    ...mapActions('authentication', ['getUser']),
    async getVacation (date) {
      const { docs } = await this.vacationDB.where('confirmState', '==', 'Y').where('vDate', 'array-contains-any', [dayjs(date).format('MM-DD-YYYY')]).get()
      this.vacationList = docs.map(doc => {
        const { id } = doc
        const data = doc.data()
        return { id, ...data }
      })
    },
    async getAllMember() {
      const { docs } = await this.userDB.where('memberYn', '==', "Y").where('delYn', '==', "N").get()
      const m = docs.map(doc => {
        const { id } = doc
        const data = doc.data()
        return { id, ...data }
      })
      this.memberList = {}
      m.forEach(el => {
        this.memberList[el.id] = el
      })
    },
    init () {
      const self = this
      this.getAllMember()
      this.$nextTick(() => {
        mobiscroll.calendar('#calendar', {
          display: 'inline',
          onSet(event, inst) {
            self.getVacation(inst.getVal())
          },
        })
        this.getVacation(dayjs())
      })
    }
  },
  mounted() {
    if (this.user && this.user.id) this.init()
  }
}
</script>
<style>
.mbsc-ios.mbsc-fr-inline .mbsc-fr-w { border: 0;}
</style>