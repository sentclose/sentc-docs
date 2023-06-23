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

	<p v-if="user_id !== ''">Your user id = {{ user_id }}</p>
	<br>

	<h2>Create a group</h2><br>

	<button @click="createGroup">Create a group</button>

	<p v-if="group_id !== ''">Your group id = {{ group_id }}</p>

	<br><br>

	<h3>Optional invite other users to your group</h3><br>

	<form @submit.prevent="inviteUser">
		<label>
			User id
			<input type="text" v-model="user_to_invite_id" />
		</label>

		<br><br>

		<button type="submit">Invite user</button>
	</form>

	<br><br>

	<h3>Optional fetch other group</h3><br>

	<form @submit.prevent="fetchGroup">
		<label>
			Group id
			<input type="text" v-model="group_id_to_fetch" />
		</label>

		<br><br>

		<button type="submit">fetch other group</button>
	</form>

	<br><br>

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
const user_to_invite_id = ref("");
const group_id_to_fetch = ref("");

const to_encrypt = ref("");
const encrypted = ref("");

const to_decrypt = ref("");
const decrypted = ref("");


let user_obj: User;
const user_id = ref("");

let group: Group;
const group_id = ref("");

let group1: Group;

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

		user_obj = await sentc.login(username.value, pw.value);

		user_id.value = user_obj.user_data.user_id;
	} catch (e) {
		handle_err(e);
	}
}

async function createGroup()
{
	if (!ready.value || !user_obj){
		return;
	}

	try {
		group_id.value = await user_obj.createGroup();
		group = await user_obj.getGroup(group_id.value);
	}catch (e) {
		handle_err(e);
	}
}

async function inviteUser()
{
	if (!ready.value || !user_obj || !group){
		return;
	}

	if (!user_to_invite_id.value || user_to_invite_id.value === ""){
		msg.value = "User id";
		return;
	}

	try {
		await group.inviteAuto(user_to_invite_id.value);
	}catch (e) {
		handle_err(e);
	}
}

async function fetchGroup()
{
	if (!ready.value || !user_obj){
		return;
	}

	if (!group_id_to_fetch.value || group_id_to_fetch.value === ""){
		msg.value = "User id";
		return;
	}

	try {
		group1 = await user_obj.getGroup(group_id_to_fetch.value);
	}catch (e) {
		handle_err(e);
	}
}

async function encrypt()
{
	if (!ready.value || !user_obj || (!group && !group1)){
		return;
	}

	if (!to_encrypt.value || to_encrypt.value === ""){
		msg.value = "no text to encrypt";
		return;
	}

	try {
		if (group){
			encrypted.value = await group.encryptString(to_encrypt.value);
		}else if (group1){
			encrypted.value = await group1.encryptString(to_encrypt.value);
		}
	}catch (e) {
		handle_err(e);
	}
}

async function decrypt()
{
	if (!ready.value || !user_obj || (!group && !group1)){
		return;
	}

	if (!to_decrypt.value || to_decrypt.value === ""){
		msg.value = "no text to decrypt";
		return;
	}

	try {
		if (group){
			decrypted.value = await group.decryptString(to_decrypt.value);
		}else if (group1){
			decrypted.value = await group1.decryptString(to_decrypt.value);
		}
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

	if (user_obj){
		await user_obj.deleteUser(pw.value);
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