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

When you are using your own backend, call the prepare function. This returns the client data for a new group. 
Just call our Api with a post request and this data from your backend: `https://api.sentc.com/api/v1/group`

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
const group_data = await user.prepareGroupCreate();
```
:::

::::

See more at [own backend](/guide/backend-only/)

## Fetch a group

When a user got access to a group the keys can be fetched from the api and got decrypt for the caller. 
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
An admin or creator can do everything but a normal member can't even accept join requests.
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
here is the function to get the input data for the api.
Just call our Api with a put request, the group id and this data from your backend: `https://api.sentc.com/api/v1/group/<the_group_id>/change_rank`

:::: tabs type:card

::: tab Javascript
```ts
//we set the rank to 2 here
const input = await group.prepareUpdateRank("internal_user_id", 2)
```
:::

::::

See more at [own backend](/guide/backend-only/)

## Invite more user

There are two methods how to get more users to a group, by invite and by join request.

### Invite a user

This is called from a group admin (rank 0 - 2) to a non group member. The non group member can accept or reject the invite.

:::: tabs type:card

::: tab Javascript
```ts
await group.invite("internal_user_id")
```
:::

::::

A user can get invites by fetching invites or from init the client.

:::: tabs type:card

::: tab Javascript
The invites are from type GroupInviteListItem

```ts
const invites = await user.getGroupInvites();
```
:::

::::

To fetch more invites just pass in the last fetched item from the function:

:::: tabs type:card

::: tab Javascript

```ts
const last_item = invites[invites.length - 1];

const invites = await user.getGroupInvites(last_item);
```
:::

::::

To accept an invitation as user call his function with the group id to accept:

:::: tabs type:card

::: tab Javascript
The group id can be got from the GroupInviteListItem

```ts
await user.acceptGroupInvite("group_id");
```
:::

::::

Or reject the invite

:::: tabs type:card

::: tab Javascript
The group id can be got from the GroupInviteListItem

```ts
await user.rejectGroupInvite("group_id");
```
:::

::::

### Join request

This is called from a non group member to get access to a group. A group admin can accept or reject the request. Call it with the group id.

:::: tabs type:card

::: tab Javascript

```ts
await user.groupJoinRequest("group_id");
```
:::

::::

To fetch the join requests as a group admin use this function:

:::: tabs type:card

::: tab Javascript
The requests are from type GroupJoinReqListItem

```ts
const req = await group.getJoinRequests();
```
:::

::::

To fetch more requests just pass in the last fetched item from the function:

:::: tabs type:card

::: tab Javascript

```ts
const last_item = req[req.length - 1];

const req = await group.getJoinRequests(last_item);
```
:::

::::

A group admin can accept the request like this:

:::: tabs type:card

::: tab Javascript
The user id can get from the GroupJoinReqListItem.

```ts
await group.acceptJoinRequest("user_id");
```
:::

::::

Or reject it:

:::: tabs type:card

::: tab Javascript
The user id can get from the GroupJoinReqListItem.

```ts
await group.rejectJoinRequest("user_id");
```
:::

::::

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