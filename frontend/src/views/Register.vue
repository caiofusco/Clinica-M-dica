<template>
  <div>
    <h2>Registrar</h2>
    <form @submit.prevent="submit">
      <input v-model="name" placeholder="Nome" required/><br/>
      <input v-model="email" placeholder="email" required/><br/>
      <input v-model="password" placeholder="senha" type="password" required/><br/>
      <select v-model="role">
        <option value="patient">Paciente</option>
        <option value="secretary">Secretária</option>
      </select><br/>
      <button>Registrar</button>
    </form>
    <p v-if="msg">{{msg}}</p>
  </div>
</template>
<script>
import axios from 'axios';
export default {
  data(){ return {name:'',email:'',password:'',role:'patient', msg:'' }},
  methods:{
    async submit(){
      try{
        const res = await axios.post('http://localhost:4000/api/auth/register',{name:this.name,email:this.email,password:this.password,role:this.role});
        localStorage.setItem('token', res.data.token);
        this.msg = 'Registrado e logado.';
        this.$router.push('/dashboard');
      }catch(e){
        this.msg = e.response?.data?.error || 'Erro';
      }
    }
  }
}
</script>
