<template>
  <div class ="login-wrapper">
    <div class = "logo-wrapper">
      <LodingIcon/>
    </div>
    
    <div class = "app-text"> 
      App
    </div>
    <div>
      <div class = 'input-wrapper'>
        <div class ="input-icon" ><UserIcon width="25" /></div>
        <div class ="input-tag"><input class = 'input-border-none'/></div>
      </div>
    
      <div class = 'input-wrapper'>
        <div class ="input-icon" ><PasswordIcon width="25" /></div>
        <div class ="input-tag"><input class = 'input-border-none'/></div>
      </div>
    </div>
    <div class = 'copyright-wrapper'> 
      Copyright(c) 2023 &nbsp; <a href = 'http://www.gemiso.com' target="_blank"><u>Gemiso.com</u></a> &nbsp; All rights Reserved.
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LodingIcon from './icon/LoadingIcon.vue';
import UserIcon from './icon/UserIcon.vue';
import PasswordIcon from './icon/PasswordIcon.vue';

export default defineComponent({
  name: 'Login-Component',
  components: {
    LodingIcon,
    UserIcon,
    PasswordIcon,
  },
  setup () {


    return {

    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  .login-wrapper{
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    
  }

  .input-wrapper {
    width: 15rem;
    height: 2.5rem;
    background-color: #fff;
    border-radius: 0.3rem;
    position: relative;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: row;
    border: 2px solid transparent;
    transition: 0.2s;

    &:hover {
      border: 2px solid #8c00ff;
      .input-icon {
        opacity: 1;
      }
    }
  }

  .input-border-none {
    border:0px;
  }

  .input-icon {
    display: flex;
    align-items: center;
    // width:100%;
    // height:100%;
    padding-left: 0.5rem;
    padding-right: 0.5rem;
    fill:#15002e;
    opacity: 0.5;
    transition: 0.2s;
  }

  .input-tag { 
    display: flex;
    align-items: center;
    input {
      width: 100%;
      height: 98%;
      font-size: 1.2rem;
      &:focus {
        outline:none;
      }
    }
  }

  .copyright-wrapper {
    font-size: 0.65rem;
  }
  
  .app-text {
    padding-bottom:2rem;
    font-size:4rem;
  }

  .logo-wrapper {
    width:100%;
    height:100%;
  }
</style>
