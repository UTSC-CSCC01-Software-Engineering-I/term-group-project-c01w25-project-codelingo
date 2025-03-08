import { db } from '../../../shared/initFirebase.js';
// import verifyToken from '../../../shared/verifyToken.js';

export default {
    createDiscussion: [
        //verifyToken,
        async (req, res) => {
            console.log(`🔥 API Gateway received request: ${req.method} ${req.url}`);
            console.log(`➡️ Forwarding request to user service at http://localhost:8082${req.url}`);
            console.log(`📦 Request Body:`, req.body);
            try {
                const { title, content } = req.body;

                if (!title || !content) {
                    return res.status(400).json({ error: 'Missing parameters in the request body' });
                }
            
                const checkExistDiscussion = await db.ref('discussions').orderByChild('title').equalTo(title).get();
                if (checkExistDiscussion.exists()) {
                    return res.status(400).json({ error: 'The discussion post is already created.' });
                }

                const newDiscussionRef = db.ref('discussions').push();

                await newDiscussionRef.set({
                    title,
                    content,
                    author: "wDGIvXiaB5cJQcAM9QbMHwS3PCZ2",
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

            let discussions = Object.values(snapshot.val());

            // Apply regex filter on title if provided
            if (titleRegex) {
                const regex = new RegExp(titleRegex, 'i'); // Case-insensitive regex
                discussions = discussions.filter(discussion => regex.test(discussion.title));
            }

            return res.status(200).json(discussions);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
        }
    }],

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

};


    