<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="submit">
      <input v-model="email" placeholder="email" required/><br/>
      <input v-model="password" placeholder="senha" type="password" required/><br/>
      <button>Login</button>
    </form>
    <p v-if="msg">{{msg}}</p>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data(){ return {email:'',password:'',msg:''}},
  methods:{
    async submit(){
      try{
        const res = await axios.post('http://localhost:4000/api/auth/login',{email:this.email,password:this.password});
        localStorage.setItem('token', res.data.token);
        this.$router.push('/dashboard');
      }catch(e){
        this.msg = e.response?.data?.error || 'Erro';
      }
    }
  }
}
</script>
