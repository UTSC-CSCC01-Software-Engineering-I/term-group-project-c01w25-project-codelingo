import { db } from '../../shared/initFirebase.js';
import verifyToken from '../../../shared/verifyToken.js';

export default {
    createDiscussion: [
        // verifyToken,
        async (req, res) => {
            console.log(`🔥 API Gateway received request: ${req.method} ${req.url}`);
            console.log(`➡️ Forwarding request to user service at http://localhost:8082${req.url}`);
            console.log(`📦 Request Body:`, req.body);
            try {
                const { title, content } = req.body;

                if (!title || !content) {
                    return res.status(400).json({ error: 'Missing parameters in the request body' });
                }

                // Extract the user ID from the verified token
                const author = req.headers.authorization?.split(' ')[1]; // Assuming `req.user.id` contains the user ID

                if (!author) {
                    return res.status(401).json({ error: 'Unauthorized: User ID not found' });
                }

                const checkExistDiscussion = await db.ref('discussions').orderByChild('title').equalTo(title).get();
                if (checkExistDiscussion.exists()) {
                    return res.status(400).json({ error: 'The discussion post is already created.' });
                }

                const newDiscussionRef = db.ref('discussions').push();

                await newDiscussionRef.set({
                    title,
                    content,
                    author,
                    createdAt: Date.now()
                });

                return res.status(201).json({
                    message: 'The discussion post has been successfully created',
                    uid: newDiscussionRef.uid
                });

            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
    }],

    getDiscussion: [
        //verifyToken,
        async (req, res) => {
            console.log(`🔥 API Gateway received request: ${req.method} ${req.url}`);
            console.log(`➡️ Forwarding request to user service at http://localhost:8082${req.url}`);
            console.log(`📦 Request Body:`, req.body);
        try {
            const { author, createdDate, titleRegex } = req.query; // Optional filters

            let discussionsRef = db.ref('discussions');
            let query = discussionsRef;

            // Apply filters dynamically
            if (author) {
                query = query.orderByChild('author').equalTo(author);
            }

            if (createdDate) {
                query = query.orderByChild('createdDate').equalTo(createdDate);
            }

            const snapshot = await query.get();

            if (!snapshot.exists()) {
                return res.status(404).json({ message: 'No discussions found' });
            }

            let discussions = Object.entries(snapshot.val()).map(([id, discussion]) => ({
              id, // Add the discussion ID
              ...discussion
          }));

            // Apply regex filter on title if provided
            if (titleRegex) {
                const regex = new RegExp(titleRegex, 'i'); // Case-insensitive regex
                discussions = discussions.filter(discussion => regex.test(discussion.title));
            }

            const discussionsWithAuthorNames = await Promise.all(
              discussions.map(async (discussion) => {
                  if (discussion.author) {
                      const userSnapshot = await db.ref('users').orderByKey().equalTo(discussion.author).get();
                      if (userSnapshot.exists()) {
                          const user = Object.values(userSnapshot.val())[0];
                          discussion.author = user.username; // Add the author's name
                      } else {
                           // Fallback if user not found
                      }
                  } else {
                      // Fallback if no author ID
                  }
                  return discussion;
              })
          );

            return res.status(200).json(discussionsWithAuthorNames);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }],
    getDiscussionById: [
      async (req, res) => {
          try {
              const { id } = req.params; // Discussion ID from URL
  
              if (!id) {
                  return res.status(400).json({ error: 'Discussion ID is required' });
              }
  
              // Fetch the discussion
              const discussionSnapshot = await db.ref(`discussions/${id}`).get();
  
              if (!discussionSnapshot.exists()) {
                  return res.status(404).json({ error: 'Discussion not found' });
              }
  
              const discussions = Object.entries(discussionSnapshot.val());
  
              // Fetch comments for the discussion
              const commentsSnapshot = await db.ref(`discussions/${id}/comments`).get();
              const comments = commentsSnapshot.exists() ? Object.values(commentsSnapshot.val()) : [];
              
              if (discussions.author) {
                const userSnapshot = await db.ref('users').orderByKey().equalTo(discussion.author).get();
                        if (userSnapshot.exists()) {
                            const user = Object.values(userSnapshot.val())[0];
                            discussions.author = user.username;
              }
            }
              return res.status(200).json({
                  ...discussions,
                  id, // Include the discussion ID
                  comments, // Include the comments
              });
          } catch (err) {
              console.error(err);
              res.status(500).json({ error: err.message });
          }
      }
  ],
  addCommentToDiscussion: [
    async (req, res) => {
        try {
            const { id } = req.params; // Discussion ID from URL
            const { content } = req.body; // Comment content

            const author = req.headers.authorization?.split(' ')[1];
            // const author = req.user?.id || 'Anonymous'; // Extract user ID from token or fallback to 'Anonymous'

            if (!id || !content) {
                return res.status(400).json({ error: 'Discussion ID and comment content are required' });
            }

            // Add the comment to the discussion
            const newCommentRef = db.ref(`discussions/${id}/comments/${id}`).push();
            await newCommentRef.set({
                content,
                author,
                createdAt: Date.now(),
            });

            return res.status(201).json({ message: 'Comment added successfully', commentId: newCommentRef.key });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }
],

    modifyDiscussion: [
        // verifyToken,
        async (req, res) => {
            try {
                const id = req.params.postID; // Discussion ID from URL
                const { title, content } = req.body; // Fields to update

                if (!id) {
                    return res.status(400).json({ error: 'Discussion ID is required' });
                }

                // Fetch the discussion
                const discussionRef = db.ref(`discussions/${id}`);
                const snapshot = await discussionRef.get();

                if (!snapshot.exists()) {
                    return res.status(404).json({ error: 'Discussion not found' });
                }

                // Update only the provided fields
                const updates = {};
                if (title) updates.title = title;
                if (content) updates.content = content;

                if (Object.keys(updates).length === 0) {
                    return res.status(400).json({ error: 'No valid fields provided for update' });
                }

                await discussionRef.update(updates);

                return res.status(200).json({
                    message: 'Discussion updated successfully',
                    updatedFields: updates
                });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        }
    ],
    addRankToUser: [
        async (req, res) => {
          try {
            const { username, rank } = req.body;

            if (!username || rank === undefined) {
              return res.status(400).json({ error: 'Username and rank are required' });
            }

            // Check if the user already exists
            let userSnapshot = await db.ref('users').orderByChild('username').equalTo(username).get();

            if (!userSnapshot.exists()) {
              // Create the user if not exists
              const newUserRef = db.ref('users').push();
              await newUserRef.set({ username, rank });
            } else {
              // If the user exists, update the rank
              const userKey = Object.keys(userSnapshot.val())[0];
              const userRef = db.ref(`users/${userKey}`);
              await userRef.update({ rank });
            }

            return res.status(200).json({ message: `Rank '${rank}' updated/added for user '${username}'` });
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
          }
        }
      ],

    getRankFromUser: [
        async (req, res) => {
            try {
                const username = req.query.username;

                if (!username) {
                    return res.status(400).json({ error: 'Username is required' });
                }

                const userSnapshot = await db.ref('users').orderByChild('username').equalTo(username).limitToFirst(1).get();

                if (!userSnapshot.exists()) {
                    return res.status(404).json({ error: 'User not found' });
                }

                const user = Object.values(userSnapshot.val())[0];

                if (!user.rank) {
                    return res.status(404).json({ message: `Rank not found for user '${username}'` });
                }

                return res.status(200).json({ username, rank: user.rank });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: err.message });
            }
        }
    ],

    getTopRankedUsers: [
        async (req, res) => {
          try {
            // Retrieve users and their ranks
            const usersSnapshot = await db.ref('users').get();

            if (!usersSnapshot.exists()) {
              return res.status(404).json({ message: 'No users found' });
            }

            // Map users to an array and sort by rank
            const users = Object.values(usersSnapshot.val());

            users.sort((a, b) => a.rank - b.rank);// Assuming higher rank is better

            // Get the top 10 users
            const topUsers = users.slice(0, 10);

            return res.status(200).json(topUsers);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
          }
        }
      ],

      addUser: [
        async (req, res) => {
          try {
            const { username, email, rank } = req.body;

            // Input validation
            if (!username || !email) {
              return res.status(400).json({ error: 'Username and email are required' });
            }

            // Check if user already exists
            const existingUserSnapshot = await db.ref('users').orderByChild('username').equalTo(username).get();
            if (existingUserSnapshot.exists()) {
              return res.status(400).json({ error: 'User already exists' });
            }

            // Create new user
            const newUserRef = db.ref('users').push();
            await newUserRef.set({
              username,
              email,
              rank: rank || 'Newbie', // Assign a default rank if it's not provided
            });

            return res.status(201).json({ message: 'User created successfully', userId: newUserRef.key });
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
          }
        }
      ],


  setGameScore: [
    async (req, res) => {
      try {
        const { username, score, isWin } = req.body; // isWin is a boolean

        if (!username || score == null || isWin == null) {
          return res.status(400).json({ error: 'Username, score, and isWin (true/false) are required' });
        }

        const userSnapshot = await db.ref('users').orderByChild('username').equalTo(username).limitToFirst(1).get();

        if (!userSnapshot.exists()) {
          return res.status(404).json({ error: 'User not found' });
        }

        const userKey = Object.keys(userSnapshot.val())[0];
        const userRef = db.ref(`users/${userKey}`);

        const userData = userSnapshot.val()[userKey];

        await userRef.update({
          gameScore: score,
          gameWins: isWin ? (userData.gameWins || 0) + 1 : userData.gameWins || 0,
          gameLosses: !isWin ? (userData.gameLosses || 0) + 1 : userData.gameLosses || 0,
          lastMatchResult: isWin ? 'win' : 'loss'
        });

        return res.status(200).json({ message: `Game score and record updated successfully for user '${username}'` });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    }
  ],

  getGameScore: [
    async (req, res) => {
      try {
        const username = req.query.username;

        if (!username) {
          return res.status(400).json({ error: 'Username is required' });
        }

        const userSnapshot = await db.ref('users').orderByChild('username').equalTo(username).limitToFirst(1).get();

        if (!userSnapshot.exists()) {
          return res.status(404).json({ error: 'User not found' });
        }

        const user = Object.values(userSnapshot.val())[0];

        return res.status(200).json({
          username,
          score: user.gameScore || 0,
          wins: user.gameWins || 0,
          losses: user.gameLosses || 0,
          lastMatchResult: user.lastMatchResult || 'None'
        });
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
      }
    }
  ],
};



