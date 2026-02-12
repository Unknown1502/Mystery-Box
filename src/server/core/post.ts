import { reddit, context } from '@devvit/web/server';

export const createPost = async () => {
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  if (!context.subredditName) {
    throw new Error('No subreddit context available');
  }

  return await reddit.submitCustomPost({
    title: `🎁 Daily Mystery Box - ${today}`,
    subredditName: context.subredditName,
  });
};
