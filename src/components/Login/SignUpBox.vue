<template>

	<div class="box container">

      <p class="header">Register an account.</p>
	    
	    <p class="">New Customer Account</p>
	    <small>Required fields *</small>
		
		<label class="label">NAME *</label>
        <p class="control">
          <input v-validate data-vv-rules="required" :class="{'input': true, 'is-danger': errors.has('name') }" name="name" type="text" v-model="newUserName">
          <span v-show="errors.has('name')" class="help is-danger">{{ errors.first('name') }}</span>
        </p>
		
		<label class="label">EMAIL *</label>
        <p class="control">
          <input v-validate data-vv-rules="required|email" :class="{'input': true, 'is-danger': errors.has('email') }" name="email" type="text" v-model="newUserEmail">
          <span v-show="errors.has('email')" class="help is-danger">{{ errors.first('email') }}</span>
        </p>
        
        <label class="label">PASSWORD *</label>
        <p class="control">
          <input v-validate data-vv-rules="required|min:6" :class="{'input': true, 'is-danger': errors.has('password') }" name="password" type="password" v-model="newUserPassword">
          <span v-show="errors.has('password')" class="help is-danger">{{ errors.first('password') }}</span>
        </p>
        
        <label class="label">CONFIRM PASSWORD *</label>
        <p class="control">
          <input v-validate data-vv-rules="required|min:6" :class="{'input': true, 'is-danger': errors.has('confirm password') }" name="confirm password" type="password" v-model="confirmPassword" v-on:keyup.enter="createNewUser">
          <span v-show="errors.has('confirm password')" class="help is-danger">{{ errors.first('confirm password') }}</span>
        </p>
        
        <a class="login-btn button is-light" @click="createNewUser()">
          <span class="icon">
            <i class="fa fa-lock fa-2x" aria-hidden="true"></i>
          </span>
          <span>REGISTER</span>
        </a>
	
	</div>

</template>

<script>

import Vue from 'vue';
import VeeValidate from 'vee-validate';
import { firebaseAuth, database } from '../../firebase/constants'
import router from '../../router/index'

Vue.use(VeeValidate);

export default {
	name: 'SignUpBox',
	data () {
		return {
		  newUserName: '',
			newUserEmail: '',
			newUserPassword: '',
			confirmPassword: '',
			submissionError: false
		}
	},
	methods: {
		createNewUser () {
		  
      // Check for validation errors
      
      this.$validator.validateAll().then(success => {
          if (!success) {
              // handle error
              this.submissionError = true;
              window.alert("Please fill out all required information.");
              return;
          }
      });
      
      // Create a new user with email and password.
      
      var email = this.newUserEmail;
      var password = this.newUserPassword; 
      
      firebaseAuth.createUserWithEmailAndPassword(email, password).catch((error) => {
    
          // Handle Errors here.
          
          if (this.newUserPassword !== this.confirmPassword) {
            router.push({ path: '/login'})
            window.alert("Passwords do not match.");
            return;
          }
          
          var errorCode = error.code;
          var errorMessage = error.message;
          
          router.push({ path: '/login' });
          return;
          // ...
      }).then(() => {
        
          // Persist user in Firebase.
        
          var user = firebaseAuth.currentUser;
          database.ref('/users/' + user.uid).set({
            name: this.newUserName,
            email: this.newUserEmail,
            isRetailer: false,
            isAdmin: false,
            location: ''
          });
          
          // Send email verification.
          
          user.sendEmailVerification().then(function() {
            // Email sent.
            }, function(error) {
            // An error happened.
          });
        
      });
      
      this.determineRoute();
      
     }
	 },
	 determineRoute () {
	    if (this.submissionError === false) {
        router.push({ path: '/' });
      } else {
        router.push({ path: '/login' });
      }
	 }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Roboto');
@import url('https://fonts.googleapis.com/css?family=Caveat');

.box {
    display: flex;
    flex-direction: column;
    width: 540px;
    margin-top: 50px;
    box-shadow: none;
    border-radius: 0px
}

label {
	margin-top: 20px;
	font-family: 'Roboto', sans-serif;
}

.button {
  font-family: 'Roboto', sans-serif;
	margin-top: 20px;
  align-self: flex-end;
}

small {
    color: #8f8f8f;
}

.header {
  font-family: 'Caveat', cursive;
  text-align: center;
  font-size: 28px;
  margin-top: 20px;
  margin-bottom: 20px;
}

/* Mobile styles */
@media only screen and (max-width: 980px) {
  .box {
    width: 100%;
    margin-right: 10px;
    margin-top: -20px;
    box-shadow: none;
    border-radius: 0px;
  }
}

</style>