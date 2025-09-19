<template>
  <div>
    <h2>Painel</h2>
    <div v-if="!token">
      <p>Você precisa se autenticar. <router-link to='/login'>Login</router-link></p>
    </div>
    <div v-else>
      <button @click="logout">Logout</button>
      <h3>Agendar Consulta</h3>
      <form @submit.prevent="create">
        <input v-model="date" type="date" required/><br/>
        <input v-model="time" type="time" required/><br/>
        <input v-model="cep" placeholder="CEP (somente números)" required/><br/>
        <button>Agendar</button>
      </form>
      <p v-if="msg">{{msg}}</p>
      <h3>Meus Agendamentos</h3>
      <ul>
        <li v-for="a in appointments" :key="a.id">
          {{a.date}} {{a.time}} - {{a.city || a.address}} - {{a.weather_info}}
        </li>
      </ul>
      <div v-if="isSecretary">
        <h3>Painel Administrativo - Todos Agendamentos</h3>
        <ul>
          <li v-for="a in allAppointments" :key="'adm-'+a.id">
            {{a.date}} {{a.time}} - {{a.patient_name}} - {{a.city}} - {{a.weather_info}}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
export default {
  data(){ return {token: localStorage.getItem('token'), date:'',time:'',cep:'',msg:'', appointments:[], allAppointments:[], role:''}},
  computed:{
    isSecretary(){ return this.role === 'secretary' }
  },
  created(){ this.load() },
  methods:{
    async load(){
      if (!this.token) return;
      try{
        // decode minimal info from token (naive)
        const p = JSON.parse(atob(this.token.split('.')[1]));
        this.role = p.role;
      }catch(e){}
      await this.fetch();
      if (this.isSecretary) await this.fetchAll();
    },
    async fetch(){
      try{
        const res = await axios.get('http://localhost:4000/api/appointments',{headers:{Authorization:'Bearer '+this.token}});
        this.appointments = res.data;
      }catch(e){}
    },
    async fetchAll(){
      try{
        const res = await axios.get('http://localhost:4000/api/appointments',{headers:{Authorization:'Bearer '+this.token}});
        this.allAppointments = res.data;
      }catch(e){}
    },
    async create(){
      try{
        await axios.post('http://localhost:4000/api/appointments',{date:this.date,time:this.time,cep:this.cep},{headers:{Authorization:'Bearer '+this.token}});
        this.msg = 'Agendado com sucesso';
        this.date='';this.time='';this.cep='';
        await this.fetch();
      }catch(e){
        this.msg = e.response?.data?.error || 'Erro ao agendar';
      }
    },
    logout(){ localStorage.removeItem('token'); this.token=null; this.appointments=[]; this.allAppointments=[]; this.role=''; this.$router.push('/'); }
  }
}
</script>
