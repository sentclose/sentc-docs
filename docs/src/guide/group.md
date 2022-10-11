# Group

Everything is a group can be shared with every group member. Every group member get access to the keys of a group.
If you encrypt something for a group, every group member is able to decrypt it.
It can also be used for 1:1 user session for more flexibility. 

In sentc everything is a group, even the user account with all devices as members.

A group has a public / private key pair, symmetric key and for user groups a sign / verify key pair. 
All of those keys are coupled together via an internal id. 
With a key rotation new keys are created but the old one can still be used.
No extra key management is needed from your side.

## Create a group

When creating a group all group private keys are encrypted in the client by the creators public key and send to the server.

Call create group from the user obj from login a user.

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
const group_id = await user.createGroup();
```
:::

::::

When having your own backend call use the prepare function. This returns the client data for a new group. 
Just call our Api with this data from your backend: `https://api.sentc.com/api/v1/group`

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
const group_data = await user.prepareGroupCreate();
```
:::

::::

## Fetch a group

When a user got access to a group it can be fetched and the keys got decrypt for the caller. 
Fetch a group with the group id. This returned a group obj.

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
const group = await user.getGroup(group_id);
```
:::

::::

## Encrypt and decrypt in a group

Every group member has access to all group keys and can encrypt or decrypt for every group member. 
For encrypt the group uses the actual newest group key. 
For decrypt the group fetches automatically the right key which was used to encrypt the data.

:::: tabs type:card

::: tab Javascript
```ts
//the group object from fetch group

//encrypt a string
const encrypted_string = await group.encryptString("hello there £ Я a a 👍");

//decrypt a string. this can be a group obj from another group member
const decrypted_string = await group.decryptString(encrypted_string);
```
:::

::::

## Group rank

The higher the rank, the more rights the user has in a group. 
An admin or creator can everything but a normal member can't even accept join requests.
The rank is a number from 0 to 3.

- 0 is the creator of a group and can do everything
- 1 is an admin and can do almost everything, except kicking the creator
- 2 can change user: accept join requests, make invite, change user rank (just to max rank 2), kick group members (when the rank is not higher than 2)
- 3 and 4 are normal user ranks. A new member is automatically rank 4. So you can use rank 3 for other actions like content.

To change a rank you just need the sentc api user id and set a new rank number:

:::: tabs type:card

::: tab Javascript
```ts
//we set the rank to 2 here
await group.updateRank("internal_user_id", 2)
```
:::

::::

If you have your own backend and want to change the rank from the secret token, 
here is the function to get the input data for the api:

:::: tabs type:card

::: tab Javascript
```ts
//we set the rank to 2 here
const input = await group.prepareUpdateRank("internal_user_id", 2)
```
:::

::::

## Invite more user

There are two methods how to get more users to a group.

### Invite a user

This is called from a group admin to a non group member. The non group member can accept or reject the invite.

### Join request

This is called from a non group member to get access to a group. A group admin can accept or reject the request.

### Auto invite

This is also called from a group admin, but this time the non group member is automatically invited and accepted without any actions. 
This can be useful for 1:1 user sessions.

### Stop invite

When calling this function, then no non group member can send join requests and no group admin can invite more users. 

This is useful for 1:1 user session. After auto inviting the other user, close the invite.

## Get group member

## Delete group member

## Parent and child group

## Key rotation

A group can have more keys at the same time. With a key rotation new keys are created for a group but the old keys can still be used.
The rotation is done on server side (but the server don't know the clear text keys) so it can be used for large groups as well.

Key rotation could be used after a member leaves, so every new content is encrypted by the newest key.