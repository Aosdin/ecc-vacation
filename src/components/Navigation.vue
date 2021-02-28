<template>
  <v-navigation-drawer v-model="isShown" absolute temporary right>
    <v-list-item v-if="user">
      <v-list-item-avatar>
        <v-img :src="user.photoURL"></v-img>
      </v-list-item-avatar>
    </v-list-item>
    <v-list-item v-if="user" link :to="{ name: 'mypage' }">
      <v-list-item-content>
        <v-list-item-title class="title">
          {{ user.nickName || user.displayName }}
        </v-list-item-title>
        <v-list-item-subtitle>{{ user.email }}</v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>
    <v-divider></v-divider>
    <v-list v-if="user" dense>
      <v-list-item v-if="user.authority > 1" link :to="{ name: 'dashboard' }">
        <v-list-item-content>
          <v-list-item-title>관리</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link :to="{ name: 'mypage' }">
        <v-list-item-content>
          <v-list-item-title>Mypage</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      <v-list-item link @click="logout">
        <v-list-item-content>
          <v-list-item-title>Logout</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import firebase from 'firebase/app'
import { mapActions, mapState } from 'vuex'

export default {
  data() {
    return {
      drawer: false,
      items: [
        { title: 'Home', icon: 'mdi-view-dashboard' },
        { title: 'About', icon: 'mdi-forum' }
      ]
    }
  },
  computed: {
    ...mapState('authentication', ['user']),
    ...mapState('app', ['navigation']),
    isShown: {
      get() {
        return this.navigation && this.user && this.user.id
      },
      set(_isShown) {
        if (!_isShown) {
          this.setNavigation(false)
        }
      }
    }
  },
  methods: {
    ...mapActions('app', ['setNavigation']),
    async logout() {
      await firebase.auth().signOut()
    }
  }
}
</script>
