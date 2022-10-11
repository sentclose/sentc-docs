# Group

Everything is a group can be shared with every group member. Every group member get access to the keys of a group.
If you encrypt something for a group, every group member is able to decrypt it.
It can also be used for 1:1 user session for more flexibility. 

In sentc everything is a group, even the user account with all devices as members.

## Create a group

When creating a group all group private keys are encrypted in the client by the creators public key and send to the server.

## Fetch a group

## Group rank

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

## Key rotation

A group can have more keys at the same time. With a key rotation new keys are created for a group but the old keys can still be used.
The rotation is done on server side (but the server don't know the clear text keys) so it can be used for large groups as well.

Key rotation could be used after a member leaves, so every new content is encrypted by the newest key.