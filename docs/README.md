---
home: true
heroImage: /Sentc.png
tagline: Encryption and group/user management sdk
actions:
  - text: Quick Start →
    link: /guide/
  - text: Try it out
    link: /playground/
    type: secondary
features:
- title: Easy-to-use encryption with post quantum cryptography
  details: Create secure applications with just a few lines of code and post quantum algorithm.
- title: Group management
  details: Create groups where every member can encrypt content for all other members.
  link: /guide/group/
- title: User management
  details: Register and securely log in users with ease. Optional adding Multi-factor authentication via Totp.
- title: Key rotation
  details: Renew the keys while still using the old ones.
- title: Queryable encryption
  details: Search or query sorted content without decrypting it, with searchable and sortable encryption.
- title: Encrypted files
  details: Handle large files in groups. Encryption + upload / download + decryption for every group member.
  footer: © 2022 - Sentclose
---

<br>

:::: tabs#p

@tab Javascript

Easy to install:

<code-group>
<code-group-item title="NPM" active>

```bash:no-line-numbers
npm install @sentclose/sentc
```
</code-group-item>

<code-group-item title="YARN">

```bash:no-line-numbers
yarn add @sentclose/sentc
```
</code-group-item>
<code-group-item title="Node js">

```bash:no-line-numbers
npm install @sentclose/sentc-nodejs
```
</code-group-item>

</code-group>

::: tip
The Node.js client sdk is almost as the same as the browser sdk, but instead of using Uint8Array for binary, it uses Node's Buffer.
:::

Easy to use, installed or in the browser:

<code-group>
<code-group-item title="JS" active>

```js
import Sentc from "@sentclose/sentc";

//init the javascript client
await Sentc.init({
    app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi"  // <-- your app token
});

//register a user
await Sentc.register("username", "password");

//login a user, ignoring possible Multi-factor auth
const user = await Sentc.login("username", "password", true);

//create a group
const group_id = await user.createGroup();

//load a group. returned a group obj for every user.
const group = await user.getGroup(group_id);

//encrypt a string for the group
const encrypted_string = await group.encryptString("hello there!");

//now every user in the group can decrypt the string
const decrypted_string = await group.decryptString(encrypted_string);
			
console.log(decrypted_string);  //hello there!
```
</code-group-item>

<code-group-item title="Browser">

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>Sentc example</title>
</head>
<body>
    <script src="https://cdn.jsdelivr.net/npm/@sentclose/sentc/dist/sentc.min.js"></script>

    <script>
        //init the wasm
        const sentc = window.Sentc.default;

        async function run() {
            //use your public token as the app token.
            // if a user is already logged in, this function will return the logged-in user
            await sentc.init({
                app_token: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi"
            });
			
            //now you are ready to go
            //register a user:
            await sentc.register("username", "password");

			//log in a user, ignoring possible Multi-factor auth
            const user = await sentc.login("username", "password", true);
			
            //create a group
            const group_id = await user.createGroup();
			
            //load a group. returned a group obj for every user.
            const group = await user.getGroup(group_id);
			
            //encrypt a string for the group
            const encrypted_string = await group.encryptString("hello there!");
			
            //now every user in the group can decrypt the string
            const decrypted_string = await group.decryptString(encrypted_string);
			
            console.log(decrypted_string);  //hello there!
        }
		
        run();
    </script>
</body>
</html>
```
</code-group-item>

</code-group>

@tab Flutter

Easy to install:

```bash:no-line-numbers
flutter pub add sentc
```

Easy to use:

```dart
demo() async {
  //init the client
  await Sentc.init(appToken: "5zMb6zs3dEM62n+FxjBilFPp+j9e7YUFA+7pi6Hi");

  //register a user
  await Sentc.register("userIdentifier", "password");

  //login a user, ignoring possible Multi-factor auth
  final user = await Sentc.loginForced("userIdentifier", "password");

  //create a group
  final groupId = await user.createGroup();

  //load a group. returned a group obj for every user.
  final group = await user.getGroup(groupId);

  //invite another user to the group. Not here in the example because we only got one user so far
  // await group.inviteAuto("other user id");

  //encrypt a string for the group
  final encrypted = await group.encryptString("hello there!");

  //now every user in the group can decrypt the string
  final decrypted = await group.decryptString(encrypted);

  print(decrypted); //hello there!

  //delete a group
  await group.deleteGroup();

  //delete a user
  await user.deleteUser("password");
}
```

@tab Rust

```bash:no-line-numbers
cargo add sentc
```

Please choose an implementation of the algorithms. There are StdKeys, FIPS or Rec keys. The impl cannot work together.

- StdKeys (feature = std_keys) are a pure rust implementation of the algorithms. They can be used on the web with wasm
  and on mobile.
- FIPS keys (feature = fips_keys) are FIPS approved algorithms used from Openssl Fips. This impl does not support post-quantum.
- Rec keys (feature = rec_keys) or recommended keys are a mix of FIPS keys for the classic algorithms and oqs (for post-quantum).

The net feature is necessary for the requests to the backend. The library reqwest is used to do it.

Easy to use:

````rust
use sentc::keys::{StdUser, StdGroup};

async fn example()
{
	//register a user
	let user_id = StdUser::register("base_url".to_string(), "app_token".to_string(), "the-username", "the-password").await.unwrap();

	//log in a user, ignoring possible Multi-factor auth
	let user = StdUser::login_forced("base_url".to_string(), "app_token", "username", "password").await.unwrap();

	//create a group
	let group_id = user.create_group(false).await.unwrap();

	//get a group. first check if there is any data that the user needs before decrypting the group keys.
	let (data, res) = user.prepare_get_group("group_id", None).await.unwrap();

	//if no data, then just decrypt the group keys
	assert!(matches!(res, GroupFetchResult::Ok));

	let group = user.done_get_group(data, None, None).unwrap();

	//Invite another user to the group. Not here in the example because we only got one user so far
	group.invite_auto(user.get_jwt().unwrap(), "user_id_to_invite", user_public_key, None).await.unwrap();

	//encrypt a string for the group
	let encrypted = group.encrypt_string_sync("hello there!").unwrap();

	//now every user in the group can decrypt the string
	let decrypted = group.decrypt_string_sync(encrypted, None).unwrap();

	//delete a group
	group.delete_group(user.get_jwt().unwrap()).await.unwrap();

	//delete a user
	user.delete("password", None, None).await.unwrap();
}
````

::::


## Limitations

The protocol is designed for async long-running communication between groups.
- A group member should be able to decrypt the whole communication even if they joined years after the beginning.
- Group members should get to decrypt all messages even if they were offline for years.

The both requirements make perfect forward secrecy impossible. See more [at the Protocol](/protocol/) how we solved it.

### In Browser encryption

- Make sure to protect your app against XSS attacks. The data is encrypted and can't be checked on the server. XSS attacks can also leak the private keys!
- If you are using a CDN, make sure that the CDN will not inject malicious code that could leak information instead of your original code. 
- In the browser we are using the indexed db to store the keys and the files. The db has only 2 gb of space. If the user needs to download larger files, try to use a native app instead of the browser. 


## Contact

If you want to learn more, just contact me [contact@sentclose.com](mailto:contact@sentclose.com).

<br><br>