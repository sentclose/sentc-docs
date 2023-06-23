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
- title: Easy-to-use encryption
  details: Create secure applications with just a few lines of code.
- title: Group management
  details: Create groups where every member can encrypt content for all other members.
  link: /guide/group/
- title: User management
  details: Register and securely log in users with ease.
- title: Key rotation
  details: Renew the keys while still using the old ones.
- title: Searchable encryption
  details: Search and query content without decrypting it.
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

</code-group>

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

//login a user
const user = await Sentc.login("username", "password");

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
			
            //log in a user
            const user = await sentc.login("username", "password");
			
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

  //log in a user
  final user = await Sentc.login("userIdentifier", "password");

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

::::


## Limitations

The protocol is designed for async long-running communication between groups.
- A group member should be able to decrypt the whole communication even if they joined years after the beginning.
- Group member should get decrypt all messages even if they were offline for years.

The both requirements make perfect forward secrecy impossible. See more [at the Protocol](/protocol/) how we solved it.

### In Browser encryption

- Make sure to protected your app against XSS attacks. The data is encrypted and can't be checked on the server. XSS attacks can also leak the private keys!
- If you are using a CDN, make sure that the CDN will not inject malicious code that could leak information instead of your original code. 
- In the browser we are using the indexed db to store the keys and the files. The db has only 2 gb of space. If the user needs to download larger files try to use a native app instead of the browser. 

<br><br>