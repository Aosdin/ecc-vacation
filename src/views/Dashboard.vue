<template>
    <v-container>
      <v-row v-if="newUserList && newUserList.length">
        <v-col cols="12">
          <v-card class="">
            <v-subheader>🎉New Member</v-subheader>
            <v-card-text>
              <v-list-item v-for="itm in newUserList" :key="'newMember' + itm.id">
                <v-list-item-avatar>
                  <v-img :src="itm.photoURL"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                    >{{ itm.nickName || itm.displayName }}
                    <v-chip
                      v-if="itm.authority > 1"
                      small
                      class="ma-3"
                      :color="itm.authority === 3 ? 'secondary' : 'primary'"
                    >
                      관리자
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ itm.email }}
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
                      <v-list-item @click="putMember(itm.id, 'Y', 'N', 1)">
                          <v-list-item-title>멥버추가</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="putMember(itm.id, 'N', 'Y', 0)">
                        <v-list-item-title>삭제</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="vacationList && vacationList.length">
        <v-col cols="12">
          <v-card class="">
            <v-subheader>✈️휴가요청</v-subheader>
            <v-card-text>
              <v-list-item v-for="(itm, idx) in vacationList" :key="'vacation' + itm.id + idx">
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
                      >{{ d }}({{ dayjs(d).format('ddd') }})</v-chip>
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
                      <v-list-item @click="confirmVacation(itm.id, 'Y', '')">
                          <v-list-item-title>승인</v-list-item-title>
                      </v-list-item>
                      <v-list-item @click="showRejectPop(itm.id)">
                        <v-list-item-title>리젝</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-card-text>

            <v-divider class="mx-4"></v-divider>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card>
            <v-tabs center-active v-model="activeTab">
              <v-tab @click="getAllMember">전체멤버</v-tab>
              <v-tab @click="getDelMember">삭제멤버</v-tab>
            </v-tabs>
          </v-card>
        </v-col>
      </v-row>
      <v-row v-if="userList && userList.length">
        <v-col>
          <v-card>
            <v-card-text>
              <v-list-item v-for="itm in userList" :key="'member' + itm.id">
                <v-list-item-avatar>
                  <v-img :src="itm.photoURL"></v-img>
                </v-list-item-avatar>

                <v-list-item-content>
                  <v-list-item-title
                  >{{ itm.nickName || itm.displayName }}
                    <v-chip
                        v-if="itm.authority > 1"
                        small
                        class="ma-3"
                        :color="itm.authority === 3 ? 'secondary' : 'primary'"
                    >
                      관리자
                    </v-chip>
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    {{ itm.email }}
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
                      <v-list-item v-if="activeTab === 0 && itm.authority === 1" @click="putMember(itm.id, 'Y', 'N', 2)">
                        <v-list-item-title>관리자임명</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="activeTab === 0 && itm.authority > 1" @click="putMember(itm.id, 'Y', 'N', 1)">
                        <v-list-item-title>관리자명제</v-list-item-title>
                      </v-list-item>
                      <v-list-item v-if="activeTab === 0" @click="putMember(itm.id, 'N', 'Y', 0)">
                        <v-list-item-title>삭제</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-list-item-action>
              </v-list-item>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <v-dialog
          v-model="rejectPop"
          persistent
          max-width="600px"
      >
        <v-card>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col>
                  <v-textarea
                      v-model="rejectDetails"
                      label="리젝내용"
                      rows="3"
                  ></v-textarea>
                </v-col>
              </v-row>
            </v-container>
            <small>*선택사항</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="blue darken-1"
                text
                @click="rejectPop = false"
            >
              갠슬
            </v-btn>
            <v-btn
                color="blue darken-1"
                text
                @click="confirmVacation(rejectId, 'R', rejectDetails)"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import firebase from 'firebase'
import dayjs from 'dayjs'

export default {
  head() {
    return {
      title: {
        inner: 'Dashboard'
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
      dayjs,
      userDB: firebase.firestore().collection('users'),
      vacationDB: firebase.firestore().collection('vacation'),
      newUserList: null,
      userList: null,
      vacationList: null,
      memberList: null,
      activeTab: 0,
      rejectDetails: '',
      rejectPop: false,
      rejectId: null
    }
  },
  computed: {
    ...mapState('app', ['appTitle']),
    ...mapState('authentication', ['user'])
  },
  watch: {
    activeTab (newValue) {
      if (newValue === 0) this.getAllMember()
      if (newValue === 1) this.getDelMember()
    }
  },
  methods: {
    ...mapActions('authentication', ['getUser', 'putUser']),
    ...mapActions('vacation', ['putVacation']),
    putMember (id, m, d, a) {
      this.putUser({
        id,
        memberYn: m,
        delYn: d,
        authority: a,
        updateTimestamp: firebase.firestore.FieldValue.serverTimestamp()
      }, {merge: true}).then(() => {
        this.getNewUser()
        if (this.activeTab === 0) this.getAllMember()
        if (this.activeTab === 1) this.getDelMember()
      })
    },
    confirmVacation (id, s, rd) {
      this.putVacation({
        id,
        confirmState: s,
        rejectDetail: rd,
      }).then(() => {
        this.getVacation()
        this.rejectPop = false
        this.rejectId = null
        this.rejectDetails = null
      })
    },
    showRejectPop (id) {
      this.rejectId = id
      this.rejectPop = true
    },
    // eslint-disable-next-line consistent-return
    async getNewUser() {
      const { docs } = await this.userDB.where('memberYn', '==', "N").where('delYn', '==', "N").get()
      this.newUserList = docs.map(doc => {
        const { id } = doc
        const data = doc.data()
        return { id, ...data }
      })
    },
    async getAllMember() {
      const { docs } = await this.userDB.where('memberYn', '==', "Y").where('delYn', '==', "N").get()
      this.userList = docs.map(doc => {
        const { id } = doc
        const data = doc.data()
        return { id, ...data }
      })
      this.memberList = {}
      this.userList.forEach(el => {
        this.memberList[el.id] = el
      })
    },
    async getVacation() {
      const { docs } = await this.vacationDB.where('confirmState', '==', "N").get()
      this.vacationList = docs.map(doc => {
        const { id } = doc
        const data = doc.data()
        return { id, ...data }
      })
    },
    async getDelMember() {
      const { docs } = await this.userDB.where('delYn', '==', "Y").get()
      this.userList = docs.map(doc => {
        const { id } = doc
        const data = doc.data()
        return { id, ...data }
      })
    }
  },
  mounted() {
    this.getNewUser()
    this.getAllMember()
    this.getVacation()
  }
}
</script>
