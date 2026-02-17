# Enabling Comments on Spiritual Sound

To complete the setup for comments on Homilies, Articles, and Prayers, follow these steps:

## 1. Update Sanity Schema

You need to add the Comment schema to your Sanity Studio codebase.

1.  Copy the content of `comment-schema.ts` (created in the root of this project) into your Sanity Studio's schemas folder.
2.  Import and add the `comment` schema to your `schemaTypes` array in `sanity.config.ts` (or `sanity.config.js`).

Example:

```typescript
import comment from './comment-schema'

export const schemaTypes = [homily, article, prayer, comment, ...]
```

3.  Deploy your Sanity Studio changes:
    ```bash
    sanity deploy
    ```

## 2. Configure Environment Variables

For the comment submission to work, you need to provide a Sanity API Token with **Editor** permissions.

1.  Go to [Sanity Manage](https://sanity.io/manage).
2.  Select your project.
3.  Go to **API > Tokens**.
4.  Create a new token with **Editor** permissions. name it "Comments API Token".
5.  Add this token to your `.env.local` file:

```env
SANITY_API_TOKEN=sk...your_token_here
```

## 3. Verify

1.  Start your development server (`npm run dev`).
2.  Navigate to a Homily, Article, or Prayer page.
3.  You should see the "Join the Conversation" section at the bottom.
4.  Submit a test comment.
5.  Check your Sanity Studio -> Desk -> Comments. You should see the new comment.
6.  Set `Approved` to `true` and publish the comment.
7.  Refresh the page on your site to see the comment appear.
