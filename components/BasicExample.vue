<template>
<div>
	<div v-if="msg" style="color: red">
		{{msg}}
		<br>
	</div>

	<h2>Register</h2><br>

	<form @submit.prevent="register">
		<label>
			Username
			<input type="text" v-model="username" />
		</label>

		<br>

		<label>
			Password
			<input type="text" v-model="pw" />
		</label>

		<br><br>

		<button type="submit">Register account</button>
	</form>

	<br>

	<h2>Login</h2><br>

	<form @submit.prevent="login">
		<label>
			Username
			<input type="text" v-model="username" />
		</label>

		<br>

		<label>
			Password
			<input type="text" v-model="pw" />
		</label>

		<br><br>

		<button type="submit">Login</button>
	</form>

	<br>

	<h2>Create a group</h2><br>

	<button @click="createGroup">Create a group</button>

	<br>
	<br>

	<h2>Encrypt and decrypt in a group</h2><br>

	<label>
		Text to encrypt
		<input type="text" v-model="to_encrypt" />

		<button @click="encrypt" class="btnStyle">encrypt</button>

		{{encrypted}}
	</label>

	<br><br>
	<hr>
	<br>

	<label>
		Text to decrypt
		<input type="text" v-model="to_decrypt" />

		<button @click="decrypt" class="btnStyle">decrypt</button>

		{{decrypted}}
	</label>

	<br><br>

	<h2>End the test</h2><br>

	<button @click="end">End the test</button>

	<br><br><br>
</div>
</template>

<script setup lang="ts">
import {ref, onMounted} from 'vue';
import {Group, User} from "@sentclose/sentc";
import {MemoryStorage} from "@sentclose/sentc/lib/core";

const ready = ref(false);
const msg = ref("");
const username = ref("");
const pw = ref("");

const to_encrypt = ref("");
const encrypted = ref("");

const to_decrypt = ref("");
const decrypted = ref("");


let user: User;

let group: Group;

async function register()
{
	if (!ready.value){
		return;
	}

	msg.value = "";

	if (!username.value || !pw.value || username.value === "" || pw.value === ""){
		msg.value = "no username or password";
		return;
	}

	try {
		//@ts-ignore
		const sentc = window.Sentc.default;

		await sentc.register(username.value, pw.value);
	} catch (e) {
		handle_err(e);
	}
}

async function login()
{
	if (!ready.value){
		return;
	}

	msg.value = "";

	if (!username.value || !pw.value || username.value === "" || pw.value === ""){
		msg.value = "no username or password";
		return;
	}

	try {
		//@ts-ignore
		const sentc = window.Sentc.default;

		user = await sentc.login(username.value, pw.value);
	} catch (e) {
		handle_err(e);
	}
}

async function createGroup()
{
	if (!ready.value || !user){
		return;
	}

	try {
		const group_id = await user.createGroup();
		group = await user.getGroup(group_id);
	}catch (e) {
		handle_err(e);
	}
}

async function encrypt()
{
	if (!ready.value || !user || !group){
		return;
	}

	if (!to_encrypt.value || to_encrypt.value === ""){
		msg.value = "no text to encrypt";
		return;
	}

	try {
		encrypted.value = await group.encryptString(to_encrypt.value);
	}catch (e) {
		handle_err(e);
	}
}

async function decrypt()
{
	if (!ready.value || !user || !group){
		return;
	}

	if (!to_decrypt.value || to_decrypt.value === ""){
		msg.value = "no text to decrypt";
		return;
	}

	try {
		decrypted.value = await group.decryptString(to_decrypt.value);
	}catch (e) {
		handle_err(e);
	}
}

async function end()
{
	if (!ready.value){
		return;
	}

	if (group){
		await group.deleteGroup();
	}

	if (user){
		await user.deleteUser(pw.value);
	}
}

function handle_err(e) {
	const err = JSON.parse(e);

	msg.value = err.error_message;
}

//loading script

onMounted(()=>{
	let s = document.createElement('script');
	s.setAttribute('src', 'https://cdn.jsdelivr.net/npm/@sentclose/sentc/dist/sentc.min.js');

	s.onload = () => {
		//init the sdk
		//@ts-ignore
		/** @class Sentc */
		const sentc = window.Sentc.default;

		async function run() {
			await sentc.init({
				app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi", // <-- your app token
				storage: {
					getStorage: () => {
						return Promise.resolve(new MemoryStorage());
					}
				}
			});

			ready.value = true;
		}

		run();
	};

	document.head.appendChild(s);
});

</script>

<style scoped>
	.btnStyle{
		margin-right: 4px;
		margin-left: 4px;
	}
</style>