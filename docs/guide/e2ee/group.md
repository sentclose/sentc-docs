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

:::: tabs#p

@tab Javascript
```ts
//the user obj from login
const group_id = await user.createGroup();
```

@tab Flutter
```dart
//the user obj from login
String groupId = await user.createGroup();
```

@tab Rust
```rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let group_id = user.create_group(false).await.unwrap();
}
```

::::

When you use your own backend, call the prepare function. This function returns the client data for a new group. 
Make a POST request to our API (https://api.sentc.com/api/v1/group) with this data from your backend. 
Remember to include the Authorization header with the JWT.

:::: tabs#p

@tab Javascript
```ts
//the user obj from login
const group_data = await user.prepareGroupCreate();
```

@tab Flutter
```dart
//the user obj from login
String groupData = await user.prepareGroupCreate();
```

@tab Rust
````rust
use sentc::keys::StdUser;

fn example(user: &StdUser)
{
	let input = user.prepare_create_group(false).unwrap();
}
````

::::

See more at [own backend](/guide/advanced/backend-only/)

### Sign a group key

The creator can sign the group key to make sure that the key is not corrupted. Set the sign value to true.
All members can now verify the group key.

:::: tabs#p

@tab Javascript
```ts
//the user obj from login
const group_id = await user.createGroup(true);
```

@tab Flutter
```dart
//the user obj from login
String groupId = await user.createGroup(true);
```

@tab Rust

````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let group_id = user.create_group(true).await.unwrap();
}
````

````rust
use sentc::keys::StdUser;

fn example(user: &StdUser)
{
	let input = user.prepare_create_group(true).unwrap();
}
````

::::

## Fetch a group

To access the keys of a group, a user can fetch them from the API and decrypt them for their own use. 
To fetch a group, use the group ID as a parameter. This returns a group object that can be used for all group-related actions.

:::: tabs#p

@tab Javascript
```ts
//the user obj from login
const group = await user.getGroup(group_id);
```

@tab Flutter
```dart
Group group = await user.getGroup(groupId);
```

@tab Rust
In the rust version there are two different functions to call.
Data is the group of data to decrypt, and res will signal if you need to fetch more keys for the user. This can happen if
the device of the user missed a key rotation and the group invite was done by the new keys of the user. In this case,
 finish the key rotation on this device.

The second function will then decrypt the group keys when the user got all keys.

````rust
use sentc::keys::StdUser;
use sentc::group::net::GroupFetchResult;

async fn example(user: &StdUser)
{
	let (data, res) = user.prepare_get_group("group_id", None).await.unwrap();

	assert!(matches!(res, GroupFetchResult::Ok));

	let group = user.done_get_group(data, None, None).unwrap();
}
````

::::

### Fetch a group and verify the group key


:::: tabs#p

@tab Javascript
Set verifying to `1` to verify the key but ignore it when the user was deleted. Set it to `2` to throw an error if the user is not found.

```ts
//the user obj from login
const group = await user.getGroup(group_id, undefined, 1);
```

@tab Flutter
Set verify to `1` to verify the key but ignore it when the user was deleted. Set it to `2` to throw an error if the user is not found.

```dart
Group group = await user.getGroup(groupId, null, 1);
```

@tab Rust
The group keys are a vec. Each group key got the information if the key was signed and from which user and key.
Integrate over the group keys after calling `prepare_get_group` and fetch all verify-keys, or the keys you like to
verify. If you want to skip keys, then just set None in the vec of verify-keys. The index of the verify-key in the vec
has to match the index of the group key in the group key vec.

`done_get_group` will return the error client_31 if the verify-key failed:
SentcError::Sdk(SdkError::Util(SdkUtilError::Base(Error::KeyDecryptionVerifyFailed)))

````rust
use sentc::keys::StdUser;
use sentc::group::net::GroupFetchResult;

async fn example(user: &StdUser)
{
	let (data, res) = user.prepare_get_group("group_id", None).await.unwrap();

	assert!(matches!(res, GroupFetchResult::Ok));

	let mut verify_keys = Vec::with_capacity(data.keys.len());

	for key in &data.keys {
		let verify_key = if let (Some(user_id), Some(key_id)) = (&key.signed_by_user_id, &key.signed_by_user_sign_key_id) {
			//fetch here the verify-key like this:
			let verify_key: UserVerifyKeyData = user.get_user_verify_key_data(user_id, key_id).await.unwrap();

			verify_key
		} else { None };

		verify_keys.push(verify_key);
	}

	let group = user.done_get_group(data, None, Some(&verify_keys)).unwrap();
}
````
::::

## Get all groups

To retrieve all group IDs where the user is a member, use this function:

:::: tabs#p

@tab Javascript

```ts
//the user obj from login
const groups = await user.getGroups();
```

The groups are an array, and each item is from type GroupList

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

@tab Flutter

```dart
//the user obj from login
List<ListGroups> groups = await user.getGroups();
```

The groups are a list and each item is from class ListGroups

```dart
class ListGroups {
  final String groupId;
  final String time;
  final String joinedTime;
  final int rank;
  final String? parent;
}
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let list = user.get_groups().await.unwrap();
}
````

::::

To fetch more groups, use pagination and pass in the last fetched item:

:::: tabs#p

@tab Javascript
```ts
const last_item = groups[groups.length - 1];

//the user obj from login
const groups_page_two = await user.getGroups(last_item);
```

@tab Flutter
```dart
List<ListGroups> groupsPageTwo = await user.getGroups(groups.last);
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	//To fetch more groups, use pagination and pass in the last fetched item:
	let list = user.get_groups(Some(list.last().unwrap())).await.unwrap();
}
````

::::

## Encrypt and decrypt in a group

Every group member has access to all group keys and can encrypt or decrypt data for any other group member. 
To encrypt data, the group uses the most current group key. 
To decrypt data, the group automatically retrieves the key used to encrypt the data.

:::: tabs#p

@tab Javascript
```ts
//the group object from fetch group

//encrypt a string
const encrypted_string = await group.encryptString("hello there £ Я a a 👍");

//decrypt a string. this can be a group obj from another group member
const decrypted_string = await group.decryptString(encrypted_string);
```

@tab Flutter
```dart
//the group object from fetch group

//encrypt a string
String encryptedString = await group.encryptString("hello there £ Я a a 👍");

//decrypt a string. this can be a group obj from another group member
String decryptedString = await group.decryptString(encrypted_string);
```

@tab Rust
Decrypt will fail when the key that was used is not in the group key vec. The error tells you what key is missing:
SentcError::KeyRequired. Do a key rotation in this case to fetch the key.

````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup)
{
	//encrypt a string
	let encrypted_string = group.encrypt_string_sync("hello there £ Я a a 👍").unwrap();

	//decrypt a string. this can be a group obj from another group member
	let decrypted_string = group.decrypt_string_sync(encrypted_string).unwrap();
}
````

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

:::: tabs#p

@tab Javascript
```ts
//we set the rank to 2 here
await group.updateRank("internal_user_id", 2);
```

@tab Flutter
```dart
//we set the rank to 2 here
await group.updateRank("internal_user_id", 2);
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.update_rank(jwt_from_user, "user_id_to_update", rank).await.unwrap();
}
````

::::

If you have your own backend and want to change a user's rank using a secret token, 
use this function to collect the input data for the API. 
To change the rank, make a PUT request to the following URL with the group ID 
and the input data from your backend: `https://api.sentc.com/api/v1/group/<the_group_id>/change_rank`

:::: tabs#p

@tab Javascript
```ts
//we set the rank to 2 here
const input = await group.prepareUpdateRank("internal_user_id", 2);
```

@tab Flutter
```dart
String input = await group.prepareUpdateRank("internal_user_id", 2);
```

@tab Rust
````rust
use sentc::keys::StdGroup;

fn example(group: &StdGroup)
{
	group.prepare_update_rank("user_id_to_update", rank).unwrap();
}
````

::::

See more at [own backend](/guide/advanced/backend-only/)

## Invite more users

There are two methods to add more users to a group: by invitation or by join request. 
When a user is invited or their join request is accepted, the group keys are encrypted using the new member's most current public key.

### Invite a user

Inviting a user is done by a group administrator (ranks 0-2) to a non-group member. 
The non-group member can choose to accept or reject the invitation.

Optionally, a rank can be set for the invited user.

:::: tabs#p

@tab Javascript
```ts
await group.invite("internal_user_id");

//with optional rank, in this case rank 1
await group.invite("internal_user_id", 1);
```

@tab Flutter
```dart
await group.invite("internal_user_id");

//with optional rank, in this case rank 1
await group.invite("internal_user_id", 1);
```

@tab Rust
Get the user public key first.

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.invite(jwt_from_user, "user_id_to_invite", user_public_key, None).await.unwrap();

	//with optional rank, in this case rank 1
	group.invite(jwt_from_user, "user_id_to_invite", user_public_key, Some(1)).await.unwrap();
}
````

::::

A user can get invites by fetching invites or from init the client.

:::: tabs#p

@tab Javascript

```ts
const invites = await user.getGroupInvites();
```

The invites are an array, and each item is from the type GroupInviteListItem

````ts
interface GroupInviteListItem
{
	group_id: string,
	time: number
}
````

@tab Flutter
```dart
List<GroupInviteReqList> invites = await user.getGroupInvites();
```

The invites are a list and each item is a class:

```dart
class GroupInviteReqList {
  final String groupId;
  final String time;
}
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let list = user.get_group_invites(None).await.unwrap();
}
````

::::

To fetch more invites pass in the last fetched item from the function:

:::: tabs#p

@tab Javascript

```ts
const last_item = invites[invites.length - 1];

const invites = await user.getGroupInvites(last_item);
```

@tab Flutter
```dart:no-line-numbers
List<GroupInviteReqList> invitesPageTwo = await user.getGroupInvites(invites.last);
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
  let list = user.get_group_invites(list.last()).await.unwrap();
}
````

::::

To accept an invitation as a user calls his function with the group id to accept:

:::: tabs#p

@tab Javascript
The group id can be got from the GroupInviteListItem

```ts
await user.acceptGroupInvite("group_id");
```

@tab Flutter
The group id can be got from the GroupInviteReqList

```dart
await user.acceptGroupInvite("group_id");
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.accept_group_invite("group_id").await.unwrap();
}
````

::::

Or reject the invite

:::: tabs#p

@tab Javascript
The group id can be got from the GroupInviteListItem

```ts
await user.rejectGroupInvite("<group_id>");
```

@tab Flutter
The group id can be got from the GroupInviteReqList

```dart
await user.rejectGroupInvite("<group_id>");
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.reject_group_invite("group_id").await.unwrap();
}
````

::::

### Join request

A non-group member can request to join a group by calling this function. 
A group administrator can choose to accept or reject the request. 
To request to join a group, call this function with the group ID.

:::: tabs#p

@tab Javascript

```ts
await user.groupJoinRequest("<group_id>");
```

@tab Flutter

```dart
await user.groupJoinRequest("<group_id>");
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.group_join_request("group_id").await.unwrap();
}
````

::::

To fetch the join requests as a group admin, use this function:

:::: tabs#p

@tab Javascript

```ts
const req = await group.getJoinRequests();
```

The requests are an array, and each item is from the type GroupJoinReqListItem

````ts
interface GroupJoinReqListItem
{
	user_id: string,
	time: number
}
````

@tab Flutter
```dart
List<GroupJoinReqList> req = await group.getJoinRequests();
```

The requests are a List of GroupJoinReqList

```dart
class GroupJoinReqList {
  final String userId;
  final String time;
  final int userType;
}
```

@tab Rust
To fetch the join requests as a group admin use this function:

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let list = group.get_join_requests(jwt_from_user, None).await.unwrap();
}
````

::::

To fetch more requests, pass in the last fetched item from the function:

:::: tabs#p

@tab Javascript

```ts
const last_item = req[req.length - 1];

const req = await group.getJoinRequests(last_item);
```

@tab Flutter
```dart
List<GroupJoinReqList> reqPageTwo = await group.getJoinRequests(req.last);
```

@tab Rust
````rust
async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let list = group.get_join_requests(jwt_from_user, list.last()).await.unwrap();
}
````

::::

A group admin can accept the request like this:

:::: tabs#p

@tab Javascript
The user id can get from the GroupJoinReqListItem.

```ts
await group.acceptJoinRequest("user_id");

//with optional rank, in this case rank 1
await group.acceptJoinRequest("user_id", 1);
```

@tab Flutter
The user id can get from the GroupJoinReqList.

```dart
await group.acceptJoinRequest("userId");

//with optional rank, in this case rank 1
await group.acceptJoinRequest("userId", 1);
```

@tab Rust
Fetch the public key of the user first.

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.accept_join_request(jwt_from_user, user_key, "user_id", None).await.unwrap();

	//with optional rank, in this case rank 1
	group.accept_join_request(jwt_from_user, user_key, "user_id", Some(1)).await.unwrap();
}
````

::::

Or reject it:

:::: tabs#p

@tab Javascript
The user id can get from the GroupJoinReqListItem.

```ts
await group.rejectJoinRequest("user_id");
```

@tab Flutter
The user id can get from the GroupJoinReqList.

```dart
await group.rejectJoinRequest("user_id");
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.reject_join_request(jwt_from_user, "user_id").await.unwrap();
}
````

::::

A user can fetch the sent join requests:

:::: tabs#p

@tab Javascript
```ts
interface GroupInviteListItem
{
	group_id: string,
    time: number
}

const list: GroupInviteListItem[] = await user.sentJoinReq();

//to load more use the last item of the pre fetch
const list_page_two: GroupInviteListItem[] = await user.sentJoinReq(list[list.length -1]);
```

@tab Flutter
```dart
class GroupInviteReqList {
  final String groupId;
  final String time;

  const GroupInviteReqList({
    required this.groupId,
    required this.time,
  });
}

List<GroupInviteReqList> list = await user.sentJoinReq();

//to load more use the last item of the pre fetch
List<GroupInviteReqList> listPageTwo = await user.sentJoinReq(list.last);
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	let list = user.get_sent_join_req(None).await.unwrap();

	//to load more, use the last item of the pre-fetch

	let list = user.get_sent_join_req(list.last()).await.unwrap();
}
````

::::

A user can also delete an already sent join request. The group id can be fetched from the `sentJoinReq()` function.

:::: tabs#p

@tab Javascript
```ts
await user.deleteJoinReq("<group_id>");
```

@tab Flutter
```dart
await user.deleteJoinReq("<group_id>");
```

@tab Rust
````rust
use sentc::keys::StdUser;

async fn example(user: &StdUser)
{
	user.delete_join_req("group_id").await.unwrap();
}
````

::::

### Auto invite

A group administrator can use this function to automatically invite and accept a non-group member, 
without requiring any additional actions from the new member. 
This feature can be useful for one-on-one user sessions.

:::: tabs#p

@tab Javascript

```ts
await group.inviteAuto("user_id");
```

@tab Flutter
```dart
await group.inviteAuto("user_id");
```

@tab Rust
Get the user public key.

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.invite_auto(jwt_from_user, "user_id", user_key, None).await.unwrap()
}
````

::::

### Stop invite

Calling this function will prevent non-group members from sending join requests and group administrators from inviting more users. 
This feature can be useful for one-on-one user sessions. 
After automatically inviting the other user, you can use this function to close the invitation process.

:::: tabs#p

@tab Javascript

```ts
await group.stopInvites();
```

@tab Flutter
```dart
await group.stopInvites();
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.stop_invites(jwt_from_user).await.unwrap()
}
````

::::

## Get group member

The fetch uses pagination to not fetch all members at once. 

:::: tabs#p

@tab Javascript

```ts
const members = await group.getMember();
```

Members are an array, and each item is from the type GroupUserListItem.

````ts
interface GroupUserListItem 
{
	user_id: string,
	rank: number,
	joined_time: number,
}
````

@tab Flutter
```dart
List<GroupUserListItem> member = await group.getMember(); 
```

Members are a list of class GroupUserListItem.

```dart
class GroupUserListItem {
  final String userId;
  final int rank;
  final String joinedTime;
  final int userType;
}
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let list = group.get_member(jwt_from_user, None).await.unwrap();

	//To fetch more, use the last fetched member item:

	let list = group.get_member(jwt_from_user, list.last()).await.unwrap();
}
````

::::

To fetch more, use the last fetched member item:

:::: tabs#p

@tab Javascript

Members are from the type GroupUserListItem.

```ts
const last_item = members[members.length -1];

const members_page_two = await group.getMember(last_item);
```

@tab Flutter

Members are from the type GroupUserListItem.

```dart
List<GroupUserListItem> memberPageTwo = await group.getMember(member.last); 
```

::::

## Delete group member

A group member with a rank higher than 2 (0, 1, 2) can use this function to delete another member with the same or lower rank. 
However, a member cannot delete themselves using this function.

:::: tabs#p

@tab Javascript

```ts
await group.kickUser("internal_user_id");
```

@tab Flutter
```dart
await group.kickUser("internal_user_id");
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.kick_user(jwt_from_user, "user_id").await.unwrap();
}
````

::::

## Leave a group

Every member can leave a group except the creator.

:::: tabs#p

@tab Javascript

```ts
await group.leave();
```

@tab Flutter
```dart
await group.leave();
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.leave(jwt_from_user).await.unwrap();
}
````

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

To create a child group, call group-create in the parent group, not in the user scope

:::: tabs#p

@tab Javascript

```ts
const group_id = await group.createChildGroup();

//get the group from a user, if not loaded, the parent group will be loaded automatically
const group = await user.getGroup(group_id);

//or get it from the parent group
const group_from_parent = await group.getChildGroup(group_id);
```

@tab Flutter

```dart
final groupId = await group.createChildGroup();

//get the group from a user, if not loaded, the parent group will be loaded automatically
final group = await await user.getGroup(groupId);

//or get it from the parent group
final groupFromParent = await group.getChildGroup(groupId); 
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let group_id = group.create_child_group(jwt_from_user).await.unwrap();
}
````

::::

If you want to create a child group from your own backend, you can use this function to generate the necessary input data. 
After generating the data, call your API with a POST request and include the input data. 
The endpoint for creating a child group is: https://api.sentc.com/api/v1/group/<the_group_id>/child

:::: tabs#p

@tab Javascript

```ts
const input = await group.prepareCreateChildGroup();
```

@tab Flutter
```dart
String input = await group.prepareCreateChildGroup();
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let (input, used_key_id) = group.create_child_group(jwt_from_user, false, None).await.unwrap();
}
````

::::

See more at [own backend](/guide/advanced/backend-only/)

To get all children of the first level use the `getChildren()` function in the group object.

It returns a List with the child group id, the child group created time, and the parent id.

:::: tabs#p

@tab Javascript
```ts
const children: GroupChildrenListItem[] = await group.getChildren();

//to get the 2nd page pass in the last child
const children_page_two: GroupChildrenListItem[] = await group.getChildren(children[children.length -1]);
```

@tab Flutter
```dart
List<GroupChildrenList> children = await group.getChildren();

//to get the 2nd page pass in the last child
final childrenPageTwo = await group.getChildren(children.last);
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let list = group.get_children(jwt_from_user, None).await.unwrap();

	//to get the 2nd page pass in the last child
	let list = group.get_children(jwt_from_user, list.last()).await.unwrap();
}
````

::::

### Create a child group and sign the group key

The sign key of the creator is needed. When a user creates a group, the sign key from the user data is used.
Get the user who signs the key.

:::: tabs#p

@tab Javascript

```ts
const group_id = await group.createChildGroup(true);

//get the group from a user, if not loaded, the parent group will be loaded automatically
const group = await user.getGroup(group_id);

//or get it from the parent group
const group_from_parent = await group.getChildGroup(group_id, 1);
```

@tab Flutter

```dart
final groupId = await group.createChildGroup(true);

//get the group from a user, if not loaded, the parent group will be loaded automatically
final group = await await user.getGroup(groupId);

//or get it from the parent group
final groupFromParent = await group.getChildGroup(groupId, 1); 
```

@tab Rust

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let group_id = group.create_child_group_with_sign(jwt_from_user, Some(&user)).await.unwrap();
}
````

To prepare, get the user who should sign the group key.

````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let (input, used_key_id) = group.prepare_create_child_group(jwt_from_user, true, Some(&user)).unwrap();
}
````

::::

## Connected groups

A group can also be a member in another group, which is not a child of this group. 
Connected groups can also have children or be a child of a parent.
Groups with access to the connected group got also access to all the child groups.
A connected group can't be a member in another group, so only normal groups can be a member in a connected group.
Normal groups can't have other groups as members except their child groups.

A connected group can be created from a normal group.


:::: tabs#p

@tab Javascript

```ts
const group_id = await group.createConnectedGroup();
```

@tab Flutter
```dart
final groupId = await group.createConnectedGroup();
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let group_id = group.create_connected_group(jwt_from_user).await.unwrap();
}
````

::::

To fetch the connected group, you can either fetch it from the group or from the user. 
From user requires the group id which was connected to the connected group.

:::: tabs#p

@tab Javascript
```ts
// from the group
const connected_group = await group.getConnectedGroup(connected_group_id);

//from the user, the group id is needed
const connected_group_by_user = await user.getGroup(connected_group_id, group_id);
```

@tab Flutter
```dart
// from the group
final connectedGroup = await group.getConnectedGroup(connectedGroupId);

//from the user, the group id is needed
final connectedGroupByUser = await user.getGroup(connectedGroupId, groupId);
```

@tab Rust
````rust
use sentc::keys::StdGroup;
use sentc::group::net::GroupFetchResult;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let (data, res) = group.prepare_get_connected_group("connected_group_id", jwt_from_user).await.unwrap();

	assert!(matches!(res, GroupFetchResult::Ok));

	let group = group.done_get_connected_group(data).unwrap();
}
````

::::

When accessing a child group of a connected group, make sure to load the parent group first, which is connected to the user group.

To get all connected groups to a group use the `getGroups()` function in the group object. 
It returns a List of groups with the group id and the group created time.

:::: tabs#p

@tab Javascript
```ts
const connected_groups: GroupList[] = await group.getGroups();

//to get the next pages, use the last item.
const connected_groups_page_two: GroupList[] = await group.getGroups(connected_groups[connected_groups.length-1]);
```

@tab Flutter
```dart
List<ListGroups> connectedGroups = await group.getGroups();

//to get the next pages, use the last item.
List<ListGroups> connectedGroupsPageTwo = await await group.getGroups(connectedGroups.last);
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let list = group.get_groups(jwt_from_user, None).await.unwrap();

	//to get the next pages, use the last item.
	let list = group.get_groups(jwt_from_user, list.last()).await.unwrap();
}
````

::::

Like users, groups can also send join requests to connected groups.

:::: tabs#p

@tab Javascript
```ts
await group.groupJoinRequest("<group_id>");
```

@tab Flutter
```dart
await group.groupJoinRequest("<group_id>");
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.group_join_request(jwt_from_user, "group_id_to_join").await.unwrap();
}
````

::::

Groups can also fetch the sent join requests.

:::: tabs#p

@tab Javascript
```ts
const list: GroupInviteListItem[] = await group.sentJoinReq();

//to load more use the last item of the pre fetch
const list_page_two: GroupInviteListItem[] = await group.sentJoinReq(list[list.length -1]);
```

```ts
interface GroupInviteListItem
{
	group_id: string,
    time: number
}
```

@tab Flutter
```dart
List<GroupInviteReqList> list = await group.sentJoinReq();

//to load more use the last item of the pre fetch
List<GroupInviteReqList> listPageTwo = await group.sentJoinReq(list.last);
```

```dart
class GroupInviteReqList {
  final String groupId;
  final String time;

  const GroupInviteReqList({
    required this.groupId,
    required this.time,
  });
}
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let list = group.get_group_sent_join_req(jwt_from_user, None).await.unwrap();

	//to load more, use the last item of the pre-fetch
	let list = group.get_group_sent_join_req(jwt_from_user, list.last()).await.unwrap();
}
````

::::

A group can also delete an already sent join request. The group id can be fetched from the `sentJoinReq()` function.

:::: tabs#p

@tab Javascript
```ts
await group.deleteJoinReq("<group_id>");
```

@tab Flutter
```dart
await group.deleteJoinReq("<group_id>");
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	group.delete_join_req("group_id_to_delete", jwt_from_user).await.unwrap();
}
````

::::


### Create a connected group and sign the group key

The sign key of the creator is needed. When a user creates a group, the sign key from the user data is used.

:::: tabs#p

@tab Javascript

```ts
const group_id = await group.createConnectedGroup(true);
```

@tab Flutter
```dart
final groupId = await group.createConnectedGroup(true);
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt_from_user: &str)
{
	let group_id = group.create_connected_group_with_sign(jwt_from_user, Some(&user)).await.unwrap();
}
````

::::

## Child groups vs. connected groups, when use what?

The problem with child groups is that it is a fixed structure and can't be changed in the future.

A connected group can be helpful if you want to give a group (and all its parents) access to another group (and all its children).
This can be used to connect resources and users, e.g.:
- user in department groups (hr, marketing, development)
- resources like customer, employee data, devops secrets
- let dev manager access group employee data and devops secrets and marketing access customer.
- Inside each department group there are multiple child groups for each subdepartment. If the manger is in the parent group, he/she can access every subgroup

The recommended approach is to use normal groups for user and connected groups for resources.

````text:no-line-numbers
parent
    child from parent                       -->              connected group
        child from child from parent                           child from connected group
            child from child from parent
    child from parent
````

## Key rotation

A group can have multiple encryption keys at the same time. 
Key rotation is the process of generating new encryption keys for a group while still allowing the use of the old ones. 
This is done on the server side, but the server does not have access to the clear text keys, making it suitable for large groups as well.

Key rotation can be useful when a member leaves the group, ensuring that all new content is encrypted using the newest key.

The user who starts the rotation can also sign the new keys.
When the other member finishes the rotation, the signed keys can be verified to make sure that the starter is the real user.

### Key rotation start

To start the rotation, call this function from any group member account:

:::: tabs#p

@tab Javascript

```ts
await group.keyRotation();

//with sign
await group.keyRotation(true);
```

@tab Flutter
```dart
await group.keyRotation();

//with sign
await group.keyRotation(true);
```

@tab Rust
In the rust version, you need to pass in:

- the jwt from the user
- and a ref to the user to get the keys

You can get everything from the user struct as it is shown below.

The function will return a result enum of the key fetch that tells the user if they need to fetch keys from the backend
if the key was encrypted by a user key that is not found on the client. Normally this should not happen because the user
did the rotation with their newest key.

````rust
use sentc::keys::{StdGroup, StdUser};
use sentc::group::net::GroupKeyFetchResult;

async fn example(group: &StdGroup, user: &StdUser)
{
	//first prepare to check if there are keys missing for the user
	let res = group.prepare_key_rotation(user.get_jwt().unwrap(), false, Some(user), None).await.unwrap();

	//end the rotation by fetching the new key
	let data = match res {
		GroupKeyFetchResult::Ok(data) => data,
		_ => {
			panic!("should be no missing key or done");
		}
	};

	//decrypt the newest group key by the user key.
	group.done_fetch_group_key_after_rotation(data, Some(user), None, None).unwrap();
}
````

::::

The new keys will be created on your device, encrypted by the starter public key, and sent to the API. 
The API will encrypt the new group keys for all other members. However, the API still doesn't know the clear text keys and 
can't use them because the new keys are encrypted by an ephemeral key that is only accessible to the group members.

It doesn't matter how many members are in this group because the user devices are not doing the encryption for every member.

### Key rotation finish

To get the new key for the other member, call this function for all group members:

:::: tabs#p

@tab Javascript

```ts
await group.finishKeyRotation();

//optional verify the new keys if the starter signed the keys
await group.finishKeyRotation(1);
```

@tab Flutter
```dart
await group.finishKeyRotation();

//optional verify the new keys if the starter signed the keys
await group.finishKeyRotation(1);
```

@tab Rust
````rust
use sentc::keys::{StdGroup, StdUser};
use sentc::group::net::{GroupFinishKeyRotation, GroupKeyFetchResult};

async fn example(group: &StdGroup, user: &StdUser)
{
	//This fn checks if the user needs to fetch the newest user key. If no continue
	let res = group.prepare_finish_key_rotation(user.get_jwt().unwrap(), Some(user), None).await.unwrap();

	//check if the user needs to fetch keys first
	let data = match res {
		GroupFinishKeyRotation::Ok(data) => data,
		_ => {
			panic!("Should be ok")
		}
	};

	//This function will fetch all new group keys
	let res = group.done_key_rotation(user.get_jwt().unwrap(), data, Some(user), None).await.unwrap();

	//fetch each new key after all rotations
	for key in res {
		let data = match key {
			GroupKeyFetchResult::Ok(data) => data,
			_ => panic!("should be ok"),
		};

		group.done_fetch_group_key_after_rotation(data, Some(user), None, None).unwrap();
	}
}
````


Like for group create, a new group key can be signed too. Set the sign parameter to true and get always a user even
for child or connected groups.

````rust
use sentc::keys::{StdGroup, StdUser};
use sentc::group::net::GroupKeyFetchResult;

async fn example(group: &StdGroup, user: &StdUser)
{
	//first prepare to check if there are keys missing for the user
	let res = group.prepare_key_rotation(user.get_jwt().unwrap(), true, Some(user), None).await.unwrap();

	//end the rotation by fetching the new key
	let data = match res {
		GroupKeyFetchResult::Ok(data) => data,
		_ => {
			panic!("should be no missing key or done");
		}
	};

	//decrypt the newest group key by the user key.
	group.done_fetch_group_key_after_rotation(data, Some(user), None, None).unwrap();
}
````

To get the new key for the other member, call this function for all group members:

````rust
use sentc::keys::{StdGroup, StdUser};
use sentc::group::net::{GroupFinishKeyRotation, GroupKeyFetchResult};

async fn example(group: &StdGroup, user: &StdUser)
{
	//This fn checks if the user needs to fetch the newest user key. If no continue
	let res = group.prepare_finish_key_rotation(user.get_jwt().unwrap(), Some(user), None).await.unwrap();

	//check if the user needs to fetch keys first
	let data = match res {
		GroupFinishKeyRotation::Ok(data) => data,
		_ => {
			panic!("Should be ok")
		}
	};

	//This function will fetch all new group keys
	let res = group.done_key_rotation(user.get_jwt().unwrap(), data, Some(user), None).await.unwrap();

	//fetch each new key after all rotations
	for key in res {
		let data = match key {
			GroupKeyFetchResult::Ok(data) => data,
			_ => panic!("should be ok"),
		};

		group.done_fetch_group_key_after_rotation(data, Some(user), None, Some(&verify_key_of_the_user)).unwrap();
	}
}
````

::::

This will fetch all new keys for a group and prepares the new keys.

### Key rotation with own backend

If you want to control the rotation from your own backend, call this function to start the rotation:

:::: tabs#p

@tab Javascript

```ts
const input = await group.prepareKeyRotation();
```

@tab Flutter
```dart
String input = await group.prepareKeyRotation();
```

@tab Rust
````rust
use sentc::keys::{StdGroup, StdUser};

fn example(group: &StdGroup, user: &StdUser)
{
	let input = group.manually_key_rotation(false, Some(user), None).unwrap();
}
````

::::

and call this endpoint to start the rotation with a post-request: `https://api.sentc.com/api/v1/group/<group_id>/key_rotation`

Still, use the finishKeyRotation function to finish the rotation.

## Re invite

If there is an error during the key rotation, the corresponding user won't get the new keys. 
This can happen if the user already done a user key rotation and the keys are not correctly created.

Users can be re invited to a group. It is almost the same process as the invite, but this time the user keeps the rank.

:::: tabs#p

@tab Javascript
```ts
await group.reInviteUser("<user id>");

//to re invite a group
await group.reInviteGroup("<group id");
```

@tab Flutter
```dart
await group.reInviteUser("<user id>");

//to re invite a group
await group.reInviteGroup("<group id");
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup)
{
	group.re_invite_user("user_id", user_public_key).await.unwrap();
}
````

::::

## Public group information

Only the newest public key is used. You can fetch the newest group public key.

:::: tabs#p

@tab Javascript
```ts
const public_group_key: {key: string, id: string} = await Sentc.getGroupPublicKey("<group_id>");
```

@tab Flutter
```dart
PublicGroupKeyData publicGroupKey = await Sentc.getGroupPublicKey("<group_id>");
```

```dart
class PublicGroupKeyData {
  final String id;
  final String key;
}

```

@tab Rust
````rust
use sentc::net_helper::get_group_public_key;

async fn example()
{
	let public_group_key = get_group_public_key("base_url", "app_token", "group_id").await.unwrap();
}
````

::::

## Delete a group

Only the creator (rank 0) or the admins (rank 1) can delete a group.

:::: tabs#p

@tab Javascript

```ts
await group.deleteGroup();
```

@tab Flutter

```dart
await group.deleteGroup();
```

@tab Rust
````rust
use sentc::keys::StdGroup;

async fn example(group: &StdGroup, jwt: &str)
{
	group.delete_group(jwt).await.unwrap();
}
````

::::

## Backend endpoints

To create and delete groups from your backend, the jwt of the creator is always required. 
If the jwt is not available in some situations, you can use the following endpoints to call it with your secret token.

- Deleting a group with a delete request: `https://api.sentc.com/api/v1/group/forced/<group_id_to_delete>`
  - This endpoint will delete the group
- Creating a group with a post-request: `https://api.sentc.com/api/v1/group/forced/<creator_user_id>`
  - use the `prepareGroupCreate` function in the group section to get the encrypted keys for the creator and call this endpoint with the returned string
  - This endpoint will return the group_id
- Creating a child group with a post-request: `https://api.sentc.com/api/v1/group/forced/<creator_user_id>/<parent_group_id>/child`
  - do the same as for creating a normal group but use `prepareCreateChildGroup` in the parent group to get the decrypted keys
- Create a connected group with a post-request: `https://api.sentc.com/api/v1/group/forced/<creator_user_id>/<connected_group_id>/connected`
- Add a user to the group: `https://api.sentc.com/api/v1/group/forced/<creator_user_id>/<group_id>/invite_auto/<user_id_to_invite>` (post request)
- Add a group to the group: `https://api.sentc.com/api/v1/group/forced/<creator_user_id>/<group_id>/invite_auto/<user_id_to_invite>/group` (post request)
- Kick a user from the group: `https://api.sentc.com/api/v1/group/forced/<creator_user_id>/<group_id>/kick/<user_id_to_kick>` (delete request)