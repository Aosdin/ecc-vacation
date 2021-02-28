<template>
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-card class="">
            <v-subheader>🎉너의 휴가는 {{ user.vPoint }}남아있습니다.</v-subheader>
            <v-card-text>
              <div id="calendar"/>
              <div v-if="dayError" caption style="color:#c30e2e;font-size: 12px;">{{ user && user.vPoint == 0 ? '사용가능한 휴가가 없습니다.' : '휴가 날자를 선택하세요.' }}</div>
            </v-card-text>
            <v-card-actions>
              <v-btn secondary block text primary @click="save">
                신청
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import mobiscroll from '@mobiscroll/javascript'
import firebase from 'firebase'
import dayjs from 'dayjs'

export default {
  head() {
    return {
      title: {
        inner: 'ApplyVacation'
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
      userList: [],
      confirmUserId: null,
      confirmUserErrorMgs: null,
      dayData: null,
      dayError: false
    }
  },
  computed: {
    ...mapState('app', ['appTitle']),
    ...mapState('authentication', ['user'])
  },
  methods: {
    ...mapActions('authentication', ['getUser', 'putUser']),
    ...mapActions('vacation', ['createVacation']),
    save () {
      if (!this.dayData.length) {
        this.dayError = true
        return false
      }
      this.dayError = false
      const dataToCreate = {
        userId: this.user.id,
        vDate: this.dayData.map(d => {
          return dayjs(d).format('MM-DD-YYYY')
        }),
        confirmState: this.user.authority > 1 ? 'Y' : 'N',
        rejectDetail: ''
      }
      if (this.user.vPoint - this.dayData.length < 0) {
        alert('신청가능한 휴가 일수가 부족합니다.')
        return false
      }
      this.createVacation(dataToCreate)
      .then(() => {
        this.putUser({
          id: this.user.id,
          vPoint: this.user.vPoint - this.dayData.length,
        }).then(() => {
          this.$router.push({ name: 'mypage' })
        })
      })
      return false
    }
  },
  mounted() {
    const self = this
    this.dayData = dayjs().format('YYYY-MM-DD')
    this.$nextTick(() => {
      mobiscroll.calendar('#calendar', {
        display: 'inline',
        select: this.user.vPoint,
        min: new Date(),
        onSet(event, inst) {
          self.dayData = inst.getVal()
        },
      })
    })
  }
}
</script>
