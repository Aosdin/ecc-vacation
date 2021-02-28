<template>
  <v-form>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-actions>
            <v-subheader>ℹ️My info</v-subheader>
            <v-spacer></v-spacer>

            <v-btn
                icon
                @click="infoShow = !infoShow"
            >
              <v-icon>{{ infoShow ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
            </v-card-actions>
            <v-expand-transition>
              <div v-show="infoShow">
                <v-card-text>
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                          v-model="user.vPoint"
                          label="남은휴가 일수"
                          readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                          v-model="nickname"
                          :rules="rules"
                          counter="25"
                          label="Nickname"
                          required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row align="center">
                    <v-col>
                      <v-text-field
                          id="birthday"
                          v-model="birthday"
                          readonly
                          label="Birthday"
                          required
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-card-text>

                <v-card-actions>
                  <v-btn secondary block :loading="isUserPending('userUpdate')" text @click="save">
                    변경
                  </v-btn>
                </v-card-actions>
              </div>
            </v-expand-transition>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="vacationList && vacationList.length">
        <v-col>
          <v-subheader>✈️내휴가</v-subheader>
          <v-list-item v-for="(itm, idx) in vacationList" :key="'vacation' + itm.id + idx" :disabled="itm.confirmState === 'C'">
            <v-list-item-icon>
              <v-badge
                  bordered
                  :color="itm.confirmState | state2color"
                  :content="itm.confirmState | state2txt"
                  overlap
                  bottom
              >
                <v-avatar>
                  <img :src="user.photoURL">
                </v-avatar>
              </v-badge>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title
              >{{ user.nickName || user.displayName }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <v-chip-group
                    mandatory
                >
                  <v-chip
                      v-for="d in itm.vDate"
                      :key="itm.id + d"
                      x-small
                  >{{ d }}({{ dayjs(d).format('ddd') }})</v-chip>
                </v-chip-group>
              </v-list-item-subtitle>
              <v-list-item-subtitle v-if="itm.rejectDetail">
                {{ itm.rejectDetail }}
              </v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action v-if="itm.confirmState === 'N'">
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
                  <v-list-item @click="vacationCancel(itm)">
                    <v-list-item-title>취소</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script>
import {mapActions, mapGetters, mapState} from 'vuex'
import mobiscroll from '@mobiscroll/javascript'
import '@mobiscroll/javascript/dist/css/mobiscroll.min.css'
import dayjs from 'dayjs'
import firebase from "firebase";

export default {
  head() {
    return {
      title: {
        inner: 'Setting User'
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
  filters: {
    state2txt (value) {
      switch (value) {
        case 'R':
          return '리젝'
        case 'Y':
          return '컨펌'
        case 'C':
          return '취소'
        case 'N':
          return '검토중'
        default:
          return ''
      }
    },
    state2color (value) {
      switch (value) {
        case 'R':
          return 'error'
        case 'Y':
          return 'success'
        case 'C':
          return 'accent'
        case 'N':
          return 'primary'
        default:
          return ''
      }
    }
  },
  data() {
    return {
      vacationDB: firebase.firestore().collection('vacation'),
      infoShow: false,
      nickname: '',
      birthday: '',
      rules: [v => v.length <= 25 || 'Max 25 characters'],
      vacationList: null,
      dayjs
    }
  },
  computed: {
    ...mapGetters('authentication', ['isUserPending', 'vPoint']),
    ...mapState('app', ['appTitle']),
    ...mapState('authentication', ['user', 'userList'])
  },
  methods: {
    ...mapActions('authentication', ['getUser', 'putUser', 'getUserInfo']),
    ...mapActions('vacation', ['putVacation']),
    save() {
      this.putUser({
        id: this.user.id,
        nickName: this.nickname,
        birthday: this.birthday
      })
    },
    async getVacation() {
      const { docs } = await this.vacationDB.where('userId', '==', this.user.id).get()
      this.vacationList = docs.map(doc => {
        const { id } = doc
        const data = doc.data()
        return { id, ...data }
      })
    },
    vacationCancel (v) {
      this.putVacation({
        id: v.id,
        confirmState: 'C',
      }).then(() => {
        this.putUser({
          id: v.userId,
          vPoint: this.user.vPoint + v.vDate.length,
        }).then(() => {
          this.getVacation()
          this.getUserInfo()
        })
      })
    }
  },
  mounted() {
    this.nickname = this.user.nickName ? this.user.nickName : ''
    this.birthday = this.user.birthday ? this.user.birthday : ''
    if (!this.nickname || !this.birthday) this.infoShow = true
    this.getVacation()
    this.getUserInfo()
    this.$nextTick(() => {
      mobiscroll.date('#birthday', {
        display: 'bubble',
        theme: 'ios',
        returnFormat: 'MM-DD-YYYY',
        themeVariant: 'light',
        layout: 'liquid',
        touchUi: false,
        defaultValue: this.birthday,
        onSet: (ev, inst) => {
          // set the birthday field manually to update the view
          this.birthday = dayjs(inst.getVal()).format('MM-DD-YYYY')
        }
      })
    })
  }
}
</script>
