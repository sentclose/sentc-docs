# Group

Everything in a group can be shared with every group member. Every group member gets access to the keys of the group. 
If you encrypt something for a group, every group member is able to decrypt it. 
It can also be used for 1:1 user sessions for more flexibility.

In sentc everything is a group, even the user account with all devices as members.

A group has a public/private key pair and symmetric key. 
All of those keys are coupled together via an internal ID. 
With a key rotation, new keys are created, but the old one can still be used. 
No extra key management is needed on your side.

## Create a group

When creating a group, all group private keys are encrypted in the client by the creator's public key and sent to the server.

Call createGroup() from the User object after logging in a user.

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
const group_id = await user.createGroup();
```
:::

::::

When you use your own backend, call the prepare function. This function returns the client data for a new group. 
Make a POST request to our API (https://api.sentc.com/api/v1/group) with this data from your backend. 
Don't forget to include the Authorization header with the JWT token.

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

To access the keys of a group, a user can fetch them from the API and decrypt them for their own use. 
To fetch a group, use the group ID as a parameter. This returns a group object that can be used for all group-related actions.

:::: tabs type:card

::: tab Javascript
```ts
//the user obj from login
const group = await user.getGroup(group_id);
```
:::

::::

## Get all groups

To retrieve all group IDs where the user is a member, use this function:

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

Every group member has access to all group keys and can encrypt or decrypt data for any other group member. 
To encrypt data, the group uses the most current group key. 
To decrypt data, the group automatically retrieves the key that was used to encrypt the data.

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

See more at [encrypt decrypt](/guide/encrypt/).

## Group rank

The user's rank in a group determines their level of access. 
An administrator or creator has full control, 
while a regular member may have limited privileges such as being unable to accept join requests. 
Ranks are assigned as numbers ranging from 0 to 4

- 0 is the creator of a group and has full control
- 1 is an administrator and has nearly full control, except for removing the creator
- 2 can manage users: accept join requests, send invites, change user ranks (up to rank 2), and remove group members (with a rank of 2 or lower)
- 3 and 4 are normal user ranks. A new member is automatically assigned rank 4. Rank 3 can be used for other actions, such as content management.

To change a user's rank, you need the Sentc API user ID and assign a new rank number:

:::: tabs type:card

::: tab Javascript
```ts
//we set the rank to 2 here
await group.updateRank("internal_user_id", 2)
```
:::

::::

If you have your own backend and want to change a user's rank using a secret token, 
use this function to obtain the input data for the API. 
To change the rank, make a PUT request to the following URL with the group ID 
and the input data from your backend: `https://api.sentc.com/api/v1/group/<the_group_id>/change_rank`

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

There are two methods to add more users to a group: by invitation or by join request. 
When a user is invited or their join request is accepted, the group keys are encrypted using the new member's most current public key.

### Invite a user

Inviting a user is done by a group administrator (ranks 0-2) to a non-group member. 
The non-group member can choose to accept or reject the invitation.

Optional, a rank can be set for the invited user.

:::: tabs type:card

::: tab Javascript
```ts
await group.invite("internal_user_id")

//with optional rank, in this case rank 1
await group.invite("internal_user_id", 1);
```
:::

::: tab Flutter
```dart
await group.invite("internal_user_id")

//with optional rank, in this case rank 1
await group.invite("internal_user_id", 1);
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

A non-group member can request to join a group by calling this function. 
A group administrator can choose to accept or reject the request. 
To request to join a group, call this function with the group ID.

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

//with optional rank, in this case rank 1
await group.acceptJoinRequest("user_id", 1);
```
:::

::: tab Flutter
```dart
await group.acceptJoinRequest("userId");

//with optional rank, in this case rank 1
await group.acceptJoinRequest("userId", 1);
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

A group administrator can use this function to automatically invite and accept a non-group member, 
without requiring any additional actions from the new member. 
This feature can be useful for one-on-one user sessions.

:::: tabs type:card

::: tab Javascript

```ts
await group.inviteAuto("user_id");
```
:::

::::

### Stop invite

Calling this function will prevent non-group members from sending join requests and group administrators from inviting more users. 
This feature can be useful for one-on-one user sessions. 
After automatically inviting the other user, you can use this function to close the invitation process.

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

A group member with a rank higher than 2 (0, 1, 2) can use this function to delete another member with the same or lower rank. 
However, a member cannot delete themselves using this function.

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

A group can be set as a child of a parent group, creating a hierarchical structure of groups. 
All members of the parent group are automatically granted access to the child group(s) 
with the same rank as in the parent group. When a new member joins the parent group, 
they are automatically added as a member to all child groups. 
Multiple child groups can also be created:

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

//get the group from a user, if not loaded, the parent group will be loaded automatically
const group = await user.getGroup(group_id);

//or get it from the parent group
const group_from_parent = await group.getChildGroup(group_id);
```
:::

::::

If you want to create a child group from your own backend, you can use this function to generate the necessary input data. 
After generating the data, call your API with a POST request and include the input data. 
The endpoint for creating a child group is: https://api.sentc.com/api/v1/group/<the_group_id>/child

:::: tabs type:card

::: tab Javascript

```ts
const input = await group.prepareCreateChildGroup();
```
:::

::::

See more at [own backend](/guide/backend-only/)

To get all children of the first level use the `getChildren()` function in the group object.

It returns a List with the child group id, the child group created time and the parent id.

:::: tabs type:card

::: tab Javascript
```ts
const children: GroupChildrenListItem[] = await group.getChildren();

//to get the 2nd page pass in the last child
const children_page_two: GroupChildrenListItem[] = await group.getChildren(children[children.length -1]);
```
::: 

::: tab Flutter
```dart
List<GroupChildrenList> children = await group.getChildren();

//to get the 2nd page pass in the last child
final childrenPageTwo = await group.getChildren(children.last);
```
:::

::::

## Connected groups

A group can also be a member in another group which is not a child of this group. 
Connected groups can also have children or be a child of a parent.
Groups with access to the connected group got also access to all the child groups.
A connected group can't be member in another group, so only normal groups can be a member in a connected group.
Normal groups can't have other groups as member except their child groups.

A connected group can be created from a normal group.


:::: tabs type:card

::: tab Javascript

```ts
const group_id = await group.createConnectedGroup();
```
:::

::: tab Flutter
```dart
final groupId = await group.createConnectedGroup();
```
:::

::::

To fetch the connected group you can either fetch it from the group or from the user. 
From user requires the group id which was connected to the connected group.

:::: tabs type:card

::: tab Javascript
```ts
// from the group
const connected_group = await group.getConnectedGroup(connected_group_id);

//from the user, the group id is needed
const connected_group_by_user = await user.getGroup(connected_group_id, group_id);
```
:::

::: tab Flutter
```dart
// from the group
final connectedGroup = await group.getConnectedGroup(connectedGroupId);

//from the user, the group id is needed
final connectedGroupByUser = await user.getGroup(connectedGroupId, groupId);
```
:::

::::

When accessing a child group of a connected group, make sure to load the parent group first which is connected to the user group.

To get all connected groups to a group use the `getGroups()` function in the group object. 
It returns a List of groups with the group id and the group created time.

:::: tabs type:card

::: tab Javascript
```ts
const connected_groups: GroupList[] = await group.getGroups();

//to get the next pages, use the last item.
const connected_groups_page_two: GroupList[] = await group.getGroups(connected_groups[connected_groups.length-1]);
```
:::

::: tab Flutter
```dart
List<ListGroups> connectedGroups = await group.getGroups();

//to get the next pages, use the last item.
List<ListGroups> connectedGroupsPageTwo = await await group.getGroups(connectedGroups.last);
```
:::

::::

## Child groups vs connected groups, when use what?

The problem with child groups is that it is a fixed structure and can't be changed in the future.

A connected group can be helpfully if you want to give a group (and all its parents) access to another group (and all its children).
This can be used to connect resources and users together, e.g.:
- user in department groups (hr, marketing, development)
- resources like customer, employee data, devops secrets
- let dev manager access group employee data and devops secrets and marketing access customer.
- Inside each department group there are multiple child groups for each sub department. If the manger is in the parent group, he/she can access every subgroup

The recommended approach is to use normal groups for user and connected groups for resources.

````
parent
    child from parent                               -->              connected group
        child from child from parent                                    child from connected group
            child from child from parent
    child from parent
````

## Key rotation

A group can have multiple encryption keys at the same time. 
Key rotation is the process of generating new encryption keys for a group while still allowing the use of the old ones. 
This is done on the server side, but the server does not have access to the clear text keys, making it suitable for large groups as well.

Key rotation can be useful when a member leaves the group, ensuring that all new content is encrypted using the newest key.

The user who starts the rotation can also sign the new keys.
When the other member finish the rotation, the signed keys can be verified to make sure that the starter is the real user.

### Key rotation start

To start the rotation call this function from any group member account:

:::: tabs type:card

::: tab Javascript

```ts
await group.keyRotation();

//with sign
await group.keyRotation(true);
```
:::

::: tab Flutter
```dart
await group.keyRotation();

//with sign
await group.keyRotation(true);
```
:::

::::

The new keys will be created on your device, encrypted by the starter public key, and sent to the API. 
The API will encrypt the new group keys for all other members, but the API still doesn't know the clear text keys and 
can't use them because the new keys are encrypted by an ephemeral key that is only accessible to the group members.

It doesn't matter how many members are in this group because the user devices are not doing the encryption for every member.

### Key rotation finish

To get the new key for the other member just call this function for all group member:

:::: tabs type:card

::: tab Javascript

```ts
await group.finishKeyRotation();

//optional verify the new keys if the starter signed the keys
await group.finishKeyRotation(true);
```
:::

::: tab Flutter
```dart
await group.finishKeyRotation();

//optional verify the new keys if the starter signed the keys
await group.finishKeyRotation(true);
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

## Re invite

If there is an error during the key rotation, the corresponding user won't get the new keys. 
This can happen if the user already done a user key rotation and the keys are not correctly created.

Users can be re invited to a group. It is almost the same process as the invite but this time the user keeps the rank.

:::: tabs type:card

::: tab Javascript
```ts
await group.reInviteUser("<user id>");

//to re invite a group
await group.reInviteGroup("<group id");
```
:::

::: tab Flutter
```dart
await group.reInviteUser("<user id>");

//to re invite a group
await group.reInviteGroup("<group id");
```
:::

::::

## Delete a group

Only the creator (rank 0) or the admins (rank 1) can delete a group.

:::: tabs type:card

::: tab Javascript

```ts
await group.deleteGroup();
```
:::

::::