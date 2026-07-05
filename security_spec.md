# Security Specification - AnimeNews.site

## 1. Data Invariants
- **Post Invariants**: Posts can be viewed by anyone, but can only be modified with a valid structure.
- **Comment Invariants**: A comment must contain a valid non-empty `postId`, a `userName`, a non-empty `text` string, and can only be created.
- **Contact Message Invariants**: A contact message must have a valid `name`, a valid `email` matching basic format, and a non-empty `message`. It can only be created by clients, never read.
- **Visitor Stats Invariants**: The `viewsCount` field in `visitorStats/global` must be a positive integer, and can only be updated/read, not deleted.

## 2. The "Dirty Dozen" Payloads
These 12 malicious payloads attempt to violate security boundaries and must be blocked by the Firestore rules:

1. **Malicious Comment Creation (No postId)**:
   ```json
   {
     "userName": "Hacker",
     "text": "Spam comments without post assignment"
   }
   ```
2. **Malicious Comment Modification (Attempt to edit text)**:
   ```json
   {
     "text": "Edited bad content"
   }
   ```
3. **Malicious Contact Message Reading**:
   Attempting to read `contactMessages/{messageId}` collection documents.
4. **Malicious Post View Count Inflation**:
   Attempting to set `views` to an extremely large number or negative number directly.
5. **Malicious Visitor Stats Reset**:
   Attempting to set `viewsCount` to `0` or negative number.
6. **Malicious Comment Spoofing (Setting photo to unauthorized URL)**:
   ```json
   {
     "postId": "post-1",
     "userName": "Admin Spoof",
     "userPhoto": "unauthorized-url",
     "text": "I am admin"
   }
   ```
7. **Contact Message Without Email**:
   ```json
   {
     "name": "Spammer",
     "message": "Hello world"
   }
   ```
8. **Malicious Post Creation (Client injecting post)**:
   Any unauthorized post injection by unauthenticated clients.
9. **Malicious Post Deletion**:
   Attempting to delete posts without admin permissions.
10. **Shadow Update to Posts**:
    Injecting ghost fields such as `isSystemVerified` or `isAdminOwned` into posts.
11. **ID Poisoning Attack**:
    Using path document IDs containing special characters or exceeding 128 characters.
12. **Visitor Stats Deletion**:
    Attempting to delete the `visitorStats/global` document.

## 3. Test Cases (Inherent verification)
The firestore.rules must block all of these payloads cleanly.
