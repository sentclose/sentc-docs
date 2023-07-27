# Group

A groups helps to gain access to resources for some users.
As long as a user is in a group he/she can access all protected content. 

Sentc provides simple checks for your backend to see if a user is in a group. Just link resources with the group.

## Create a group

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

::::

When you use your own backend, make a POST request to our API (https://api.sentc.com/api/v1/group) from your backend.
Don't forget to include the Authorization header with the JWT.

## Fetch a group

To access the data of a group, a user can fetch them from the API.
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

::::

## Get all groups

To retrieve all group IDs where the user is a member, use this function:

:::: tabs#p

@tab Javascript

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

::::

To fetch more groups use pagination and pass in the last fetched item:

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

::::

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

::::

If you have your own backend and want to change a user's rank using a secret token,
use this function to obtain the input data for the API.
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

::::

See more at [own backend](/guide/advanced/backend-only/)

## Invite more user

There are two methods to add more users to a group: by invitation or by join request.

### Invite a user

Inviting a user is done by a group administrator (ranks 0-2) to a non-group member.
The non-group member can choose to accept or reject the invitation.

Optional, a rank can be set for the invited user.

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

::::

A user can get invites by fetching invites or from init the client.

:::: tabs#p

@tab Javascript

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

::::

To fetch more invites just pass in the last fetched item from the function:

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

::::

To accept an invitation as user call his function with the group id to accept:

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

::::

### Join request

A non-group member can request to join a group by calling this function.
A group administrator can choose to accept or reject the request. 

:::: tabs#p

@tab Javascript

```ts
await user.groupJoinRequest("<group_id>");
```

@tab Flutter

```dart
await user.groupJoinRequest("<group_id>");
```

::::

To fetch the join requests as a group admin use this function:

:::: tabs#p

@tab Javascript

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

::::

To fetch more requests just pass in the last fetched item from the function:

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

::::

### Auto invite

A group administrator can use this function to automatically invite and accept a non-group member,
without requiring any additional actions from the new member.

:::: tabs#p

@tab Javascript

```ts
await group.inviteAuto("user_id");
```

@tab Flutter
```dart
await group.inviteAuto("user_id");
```

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

::::

## Get group member

The fetch uses pagination to not fetch all members at once.

:::: tabs#p

@tab Javascript

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

::::

To fetch more use the last fetched member item:

:::: tabs#p

@tab Javascript

Members are from type GroupUserListItem.

```ts
const last_item = members[members.length -1];

const members_page_two = await group.getMember(last_item);
```

@tab Flutter

Members are from type GroupUserListItem.

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

::::

To get all children of the first level use the `getChildren()` function in the group object.

It returns a List with the child group id, the child group created time and the parent id.

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

::::

## Connected groups

A group can also be a member in another group which is not a child of this group.
Connected groups can also have children or be a child of a parent.
Groups with access to the connected group got also access to all the child groups.
A connected group can't be member in another group, so only normal groups can be a member in a connected group.
Normal groups can't have other groups as member except their child groups.

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

::::

To fetch the connected group you can either fetch it from the group or from the user.
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

::::

When accessing a child group of a connected group, make sure to load the parent group first which is connected to the user group.

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

````text:no-line-numbers
parent
    child from parent                       -->              connected group
        child from child from parent                           child from connected group
            child from child from parent
    child from parent
````

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

::::