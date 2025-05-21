# Encryption and decryption

Encryption can be performed by either the user or the group object. 
Additionally, a new symmetric key can be generated for encryption purposes for either a user or a group.

## Encrypt for a group

When encrypting content for a group, the content will be encrypted using the group's current key. 
In the event of a [key rotation](/guide/group/#key-rotation), the new group key will be used to encrypt new content, 
while the previous key can still be used to decrypt previously encrypted content.

::: tip
Sentc will handle key management for you, determining which key should be used for encryption and which key should be used for decryption.
:::

## Encrypt for a user

When encrypting content for a user, the content is encrypted using the user's public key. 
However, it is important to note that public/private key encryption may not be suitable for handling large amounts of data. 
To address this, the best practice is to use a symmetric key to encrypt the content  
and then encrypt the symmetric key with the user's public key (as with groups).

When encrypting content for a user, the reply user ID is required.

::: tip
We highly recommend creating a group even for one-on-one user communication. 
This allows the user who encrypts the data to also decrypt it later without any additional configuration. 
To achieve this, auto-invite the other user and use the "stop invite" feature for this group. 

For more information on auto-invite functionality, please see the [auto invite](/guide/group/#invite-more-user) section.
:::

## Encrypt raw data

Raw data are bytes.

:::: tabs#p

@tab Javascript
For javascript, Uint8Arrays are used for raw data.

For a group:
```ts
const encrypted = await group.encrypt(new Uint8Array([1,1,1,1]));
```

For a user:

```ts
const encrypted = await user.encrypt(new Uint8Array([1,1,1,1]), "<reply_id>");
```

Example to load a file as Uint8Array with the file reader:

```ts
function fileParse(file: Blob) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onloadend = (e) => {
			//@ts-ignore -> is read as array buffer
            resolve(e.target.result);
		};

		reader.onerror = (e) => {
			reject(e);
		};

		reader.readAsArrayBuffer(file);
	});
}

//Blob can be a javascript file element too
async function fileLoadingAndEncryption(file: Blob) {
	const uint8arrayFile = await fileParse(file);

	//get the group obj from outside the function
	const encryptedFile = await group.encrypt(uint8arrayFile);
	
	//do domething with the encrypted file
}
```

::: tip
For file upload you can also use the sentc [file handling](/guide/file/)
:::

@tab Flutter
For Flutter, Uint8List is used for raw data.

For a group:

```dart
final encrypted = await group.encrypt(Uint8List.fromList(elements));
```

For a user:

```dart
final encrypted = await user.encrypt(Uint8List.fromList(elements), "<reply_id>");
```

::: tip
For file upload you can also use the sentc [file handling](/guide/file/)
:::

@tab Rust

Raw data are bytes (&[u8]).

For a group:

````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup, data: &[u8])
{
	let encrypted = group.encrypt_sync(data).unwrap();
}
````

For a user:

````rust
use sentc::keys::StdUser;

fn example(user: &StdUser, data: &[u8])
{
	let encrypted = user.encrypt_sync(data, user_public_key, false).unwrap();
}
````

::::

## Decrypt raw data

For groups this is the same way around as encrypting data. Every group member can encrypt the data.

:::: tabs#p

@tab Javascript
For javascript, Uint8Arrays are used for raw data. The encrypted data should be a Uint8Array too.

```ts
const decrypted = await group.decrypt(encrypted);
```

@tab Flutter
For flutter, Uint8List is used for raw data. The encrypted data should be a Uint8List too.

```dart
final decrypted = await group.decrypt(encrypted);
```

@tab Rust
Raw data are bytes (&[u8]).

````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup, data: &[u8])
{
	let decrypted = group.decrypt_sync(data, None).unwrap();
}
````

::::

For user this is a little more complicated. Only the user which user id was used in encrypting can decrypt the content.

But the right key is automatically fetched by sentc.

:::: tabs#p

@tab Javascript
For javascript, Uint8Arrays are used for raw data. The encrypted data should be a Uint8Array too.

```ts
const decrypted = await user.decrypt(encrypted);
```

@tab Flutter

For flutter, Uint8List is used for raw data. The encrypted data should be a Uint8List too.

```dart
final decrypted = await user.decrypt(encrypted);
```

@tab Rust

````rust
use sentc::keys::StdUser;

fn example(user: &StdUser, encrypted: &[u8])
{
	let decrypted = user.decrypt_sync(encrypted, None).unwrap();
}
````

::::

## Encrypt strings

Encrypting strings is a special case, as it requires converting the text to bytes using a UTF-8 reader before encryption.

To simplify this process, Sentc offers string encryption functions that handle this conversion for you.

:::: tabs#p

@tab Javascript

For a group:
```ts
const encrypted = await group.encryptString("hello there!");
```

For a user:

```ts
const encrypted = await user.encryptString("hello there!", "<reply_id>");
```

@tab Flutter

For a group:

```dart
final encrypted = await group.encryptString("hello there!");
```

For a user:

```dart
final encrypted = await user.encryptString("hello there!", "<reply_id>");
```

@tab Rust

````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup, data: &str)
{
	let encrypted = group.encrypt_string_sync(data).unwrap();
}
````

For user:

````rust
use sentc::keys::StdUser;

fn example(user: &StdUser, data: &str)
{
	let encrypted = user.encrypt_string_sync(data, user_public_key, false).unwrap();
}
````

::::

## Decrypt strings

The same as decrypting raw data but this time with a string as encrypted data.

:::: tabs#p

@tab Javascript

The encrypted strings are strings too.

For a group:
```ts
const decrypted = await group.decryptString(encrypted);
```

For a user:

```ts
const decrypted = await user.decryptString(encrypted);
```

@tab Flutter

The encrypted strings are strings too.

For a group:
```dart
final decrypted = await group.decryptString(encrypted);
```

For a user:
```dart
final decrypted = await user.decryptString(encrypted);
```

@tab Rust

````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup, data: &str)
{
	let decrypted = group.decrypt_string_sync(data, None).unwrap();
}
````

For user:

````rust
use sentc::keys::StdUser;

fn example(user: &StdUser, encrypted: &str)
{
	let decrypted = user.decrypt_string_sync(encrypted, None).unwrap();
}
````

::::

## Sign and verify the encrypted data

Sentc offers the ability to sign data after encryption and verify data before decryption. 
This ensures the authenticity of the encrypted data and protects against potential tampering.

### Sign

For sign, the newest sign key of the user is used.

:::: tabs#p

@tab Javascript

For a group:
```ts
//set sign to true

const encrypted = await group.encryptString("hello there!", true);
```

For a user:

```ts
const encrypted = await user.encryptString("hello there!", "<reply_id>", true);
```

@tab Flutter

```dart
//just set sign to true

final encrypted = await group.encryptString("hello there!", true);
```

For a user:

```dart
final encrypted = await user.encryptString("hello there!", "<reply_id>", true);
```

@tab Rust

For the rust version you need to get the sign key from the user for groups.

````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup, data: &str)
{
	let encrypted = group.encrypt_string_with_sign_sync(data, user_sign_key).unwrap();
}
````

For user:

````rust
use sentc::keys::StdUser;

fn example(user: &StdUser, data: &str)
{
	let encrypted = user.encrypt_string_sync(data, user_public_key, true).unwrap();
}
````

::::

### Verify

For verifying, the right verify-key is fetched, but you need to save the id of the user who encrypted the content.

:::: tabs#p

@tab Javascript

For a group:
```ts
//set sign to true

const decrypted = await group.decryptString(encrypted, true, "<user_id>");
```

For a user:

```ts
const decrypted = await user.decryptString(encrypted, true, "<user_id>");
```

@tab Flutter

```dart
final decrypted = await group.decryptString(encrypted, true, "<user_id>");
```

For a user:

```dart
final decrypted = await user.decryptString(encrypted, true, "<user_id>");
```

@tab Rust

For verifying, the right verify-key needs to be fetched first.

````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup, data: &str)
{
	let decrypted = group.decrypt_string_sync(data, Some(user_verify_key)).unwrap();
}
````

For user:

````rust
use sentc::keys::StdUser;

fn example(user: &StdUser, encrypted: &str)
{
	let decrypted = user.decrypt_string_sync(encrypted, Some(user_verify_key)).unwrap();
}
````

::::