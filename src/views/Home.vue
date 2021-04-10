<template>
  <section class="home">
    <h1>GitHub Users</h1>
    <v-alert
      dismissible
      type="error"
      :value="$store.getters.getError.isVisible"
    >
      {{ $store.getters.getError.text }}
    </v-alert>
    <v-switch
      v-model="isTable"
      label="Таблица"
      :value="isTable"
      hide-details
      class="switch"
    ></v-switch>
    <v-form @submit.prevent="onSearch" v-model="isValid" class="search-form">
      <v-text-field
        v-model="query"
        label="Поиск"
        :rules="[(value) => !!value || 'Введите запрос']"
        class="search-form__field"
      />
      <v-text-field
        v-model="repos"
        type="number"
        label="Количество репозиториев"
        class="search-form__field"
      ></v-text-field
      ><v-select
        v-model="sort"
        label="Сортировать по..."
        class="search-form__field"
        clearable
        :items="[
          { text: 'Подписчикам', value: 'followers' },
          { text: 'Кол-ву репозиториев', value: 'repositories' },
          { text: 'Дате регистрации', value: 'joined' },
        ]"
      ></v-select
      ><v-select
        v-model="order"
        label="Направление сортировки..."
        class="search-form__field"
        clearable
        :items="[
          { text: 'От большего', value: 'desc' },
          { text: 'От меньшего', value: 'asc' },
        ]"
      ></v-select
      ><v-btn :loading="loading" type="submit" class="search-form__button"
        >Найти</v-btn
      ></v-form
    >
    <v-data-table
      :items="users"
      :items-per-page="-1"
      hide-default-footer
      :headers="[
        { value: 'avatar', text: 'Аватар' },
        { value: 'login', text: 'Имя пользователя' },
        { value: 'id', text: 'ID' },
      ]"
      v-if="isTable"
    >
      >
      <template v-slot:item.avatar="{ item }">
        <v-img
          :lazy-src="item.avatar_url"
          :src="item.avatar_url"
          height="36"
          width="36"
        ></v-img>
      </template>
    </v-data-table>
    <div v-else class="card-container">
      <a
        v-for="(item, id) in users"
        :key="id"
        target="blank"
        class="card-link"
        :href="item.html_url"
      >
        <v-card class="card"
          ><v-card-title class="card__title">{{ item.login }}</v-card-title
          ><v-card-text
            ><v-img
              :lazy-src="item.avatar_url"
              :src="item.avatar_url"
              height="200"
              width="200"
              class="card__image"
            ></v-img></v-card-text></v-card
      ></a>
    </div>
    <v-progress-circular
      indeterminate
      size="64"
      v-if="loading"
    ></v-progress-circular>
  </section>
</template>

<script>
export default {
  components: {},
  data() {
    return {
      users: [],
      currentPage: 1,
      usersPerPage: 30,
      query: 'Roman',
      loading: false,
      isTable: true,
      isValid: true,
      repos: '',
      sort: '',
      order: '',
    }
  },
  async created() {
    await this.$store.dispatch('fetchUsers', this.makeRequest())
    this.users = this.$store.getters.getUsers
    window.onscroll = () => {
      this.lazyLoad()
    }
  },
  methods: {
    async onSearch() {
      this.loading = true
      if (this.isValid) {
        this.currentPage = 1

        await this.$store.dispatch('fetchUsers', this.makeRequest())
        this.users = this.$store.getters.getUsers
      }
      this.loading = false
    },
    makeRequest(page = this.currentPage) {
      const payload = {
        query: this.query,
        page: page,
        per_page: this.usersPerPage,
      }

      if (this.repos !== '') {
        payload.query = payload.query + `+repos:${this.repos}`
      }

      if (this.sort) {
        payload.sort = this.sort
      }

      if (this.order) {
        payload.order = this.order
      }

      return payload
    },
    async lazyLoad() {
      if (!this.loading) {
        this.loading = true
        const windowRelativeBottom = document.documentElement.getBoundingClientRect()
          .bottom
        if (windowRelativeBottom == document.documentElement.clientHeight) {
          await this.$store.dispatch(
            'fetchMoreUsers',
            this.makeRequest(this.currentPage + 1)
          )
          this.users = this.$store.getters.getUsers
          this.currentPage++
        }
        this.loading = false
      }
    },
  },
}
</script>
<style>
.home {
  width: 80%;
  margin: auto;
  padding: 100px 0;
}
.switch {
  margin-left: 20px;
}
.search-form {
  display: flex;
  align-items: center;
  margin: 20px;
}
.search-form__button {
  margin-left: 20px;
}
.search-form__field {
  margin-right: 20px;
}

.card-link {
  margin: 20px;
  text-decoration: none;
}

.card-link:hover {
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.3),
    0px 2px 2px 0px rgba(0, 0, 0, 0.25), 0px 1px 5px 0px rgba(0, 0, 0, 0.25);
  transition: box-shadow 0.2s ease;
}
.card {
  padding: 10px;
  width: 300px;
}
.card-container {
  display: flex;
  flex-wrap: wrap;
}
.card__title {
  justify-content: center;
}

.card__image {
  margin: auto;
}
</style>
