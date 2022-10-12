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
Don't forget the Authorization header with the jwt.

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
Fetch a group with the group id. This returned a group obj which is used for all group related actions.

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
const group = await user.getGroup(group_id);
```
:::

::::

## Get all groups

To get all group ids where the user is member use this function:

:::: tabs type:card

::: tab Javascript

```ts
//the user obj from login
const groups = await user.getGroups();
```

The groups are an array and each item is from type GroupList

````ts
interface GroupList
{
	group_id: string,
	time: number,
	joined_time: number,
	rank: number,
	parent?: string
}
````

:::

::::

To fetch more groups use pagination and pass in the last fetched item:

:::: tabs type:card

::: tab Javascript
```ts
const last_item = groups[groups.length - 1];

//the user obj from login
const groups = await user.getGroups(last_item);
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
When inviting a user or accepting a join request, the group keys are encrypted by the new members actual newest public key.

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

```ts
const invites = await user.getGroupInvites();
```

The invites are an array and each item is from type GroupInviteListItem

````ts
interface GroupInviteListItem
{
	group_id: string,
	time: number
}
````

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

```ts
const req = await group.getJoinRequests();
```

The requests are an array and each item is from type GroupJoinReqListItem

````ts
interface GroupJoinReqListItem
{
	user_id: string,
	time: number
}
````

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

:::: tabs type:card

::: tab Javascript

```ts
await group.inviteAuto("user_id");
```
:::

::::

### Stop invite

When calling this function, then no non group member can send join requests and no group admin can invite more users. 

This is useful for 1:1 user session. After auto inviting the other user, close the invite.

:::: tabs type:card

::: tab Javascript

```ts
await group.stopInvites();
```
:::

::::

## Get group member

The fetch uses pagination to not fetch all members at once. 

:::: tabs type:card

::: tab Javascript

```ts
const members = await group.getMember();
```

Members are an array and each item is from type GroupUserListItem.

````ts
interface GroupUserListItem 
{
	user_id: string,
	rank: number,
	joined_time: number,
}
````

:::

::::

To fetch more use the last fetched member item:

:::: tabs type:card

::: tab Javascript

Members are from type GroupUserListItem.

```ts
const last_item = members[members.length -1];

const members = await group.getMember(last_item);
```
:::

::::


## Delete group member

A group member with rank higher than 2 (0,1,2) can delete member which are the same or lower in rank. The member can't kick themselves.

:::: tabs type:card

::: tab Javascript

```ts
const members = await group.kickUser("internal_user_id");
```
:::

::::

## Leave a group

Every member can leave a group except the creator.

:::: tabs type:card

::: tab Javascript

```ts
await group.leave();
```
:::

::::

## Parent and child group

A group can be a child of a parent group. This will create a hierarchy of groups. 
Every member of the parent group got access to the child group with the same rank as in the parent group. 
When a new member joins the parent group he/she is automatically member of all child groups.
Multiple child groups are also possible like

````
parent
    child from parent
        child from child from parent
            child from child from parent
    child from parent
````

To create a child group just call group create in the parent group not in the user scope

:::: tabs type:card

::: tab Javascript

```ts
const group_id = await group.createChildGroup();
```
:::

::::

If you want to create the group from your own backend then you can use this function 
and call your api with a post request and this input. Endpoint: `https://api.sentc.com/api/v1/group/<the_group_id>/child`

:::: tabs type:card

::: tab Javascript

```ts
const input = await group.prepareCreateChildGroup();
```
:::

::::

See more at [own backend](/guide/backend-only/)

## Key rotation

A group can have more keys at the same time. With a key rotation new keys are created for a group but the old keys can still be used.
The rotation is done on server side (but the server don't know the clear text keys) so it can be used for large groups as well.

Key rotation could be used after a member leaves, so every new content is encrypted by the newest key.

### Key rotation start

To start the rotation call this function from any group member account:

:::: tabs type:card

::: tab Javascript

```ts
await group.keyRotation();
```
:::

::::

The new keys will be created on your device, encrypted by the starter public key and send to the api. 
The api will encrypt the nw group keys for all other member, but the api still don't know the clear text keys and 
can't use them because the new keys are encrypted by an ephemeral key which is only accessible to the group members.

It doesn't matter how many members are in this group, because the user device are not doing the encryption for every member.

### Key rotation finish

To get the new key for the other member just call this function for all group member:

:::: tabs type:card

::: tab Javascript

```ts
await group.finishKeyRotation();
```
:::

::::

This will fetch all new keys for a group and prepares the new keys.

### Key rotation with own backend

If you want to control the rotation from your own backend, just call this function to start the rotation:

:::: tabs type:card

::: tab Javascript

```ts
const input = await group.prepareKeyRotation();
```
:::

::::

and call this endpoint to start the rotation with a post request: `https://api.sentc.com/api/v1/group/<group_id>/key_rotation`

Still use the finishKeyRotation function to finish the rotation.

## Delete a group

Only the creator (rank 0) or the admins (rank 1) can delete a group.

:::: tabs type:card

::: tab Javascript

```ts
await group.deleteGroup();
```
:::

::::