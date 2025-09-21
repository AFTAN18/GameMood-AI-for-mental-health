import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { CommunityState, CommunityPost, SocialConnection, Comment } from '../../types'

const initialState: CommunityState = {
  posts: [],
  connections: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const loadCommunityPosts = createAsyncThunk(
  'community/loadPosts',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage (in real app, this would be an API call)
      const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]')
      return posts
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load community posts')
    }
  }
)

export const createCommunityPost = createAsyncThunk(
  'community/createPost',
  async (postData: { content: string; isAnonymous: boolean; moodContext?: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newPost: CommunityPost = {
        id: crypto.randomUUID(),
        user_id: userId,
        content: postData.content,
        mood_context: postData.moodContext,
        game_recommendations: [],
        likes: 0,
        comments: [],
        is_anonymous: postData.isAnonymous,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      // Save to localStorage
      const existingPosts = JSON.parse(localStorage.getItem('communityPosts') || '[]')
      existingPosts.unshift(newPost)
      localStorage.setItem('communityPosts', JSON.stringify(existingPosts))

      return newPost
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create community post')
    }
  }
)

export const likePost = createAsyncThunk(
  'community/likePost',
  async (postId: string, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]')
      const postIndex = posts.findIndex((post: CommunityPost) => post.id === postId)
      
      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      posts[postIndex].likes += 1
      localStorage.setItem('communityPosts', JSON.stringify(posts))

      return { postId, likes: posts[postIndex].likes }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to like post')
    }
  }
)

export const addComment = createAsyncThunk(
  'community/addComment',
  async ({ postId, content }: { postId: string; content: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newComment: Comment = {
        id: crypto.randomUUID(),
        post_id: postId,
        user_id: userId,
        content,
        likes: 0,
        created_at: new Date().toISOString(),
      }

      const posts = JSON.parse(localStorage.getItem('communityPosts') || '[]')
      const postIndex = posts.findIndex((post: CommunityPost) => post.id === postId)
      
      if (postIndex === -1) {
        throw new Error('Post not found')
      }

      posts[postIndex].comments.push(newComment)
      localStorage.setItem('communityPosts', JSON.stringify(posts))

      return { postId, comment: newComment }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add comment')
    }
  }
)

export const loadSocialConnections = createAsyncThunk(
  'community/loadConnections',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      // Load from localStorage
      const connections = JSON.parse(localStorage.getItem(`socialConnections_${userId}`) || '[]')
      return connections
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to load social connections')
    }
  }
)

export const addSocialConnection = createAsyncThunk(
  'community/addConnection',
  async ({ friendId, connectionType }: { friendId: string; connectionType: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const newConnection: SocialConnection = {
        id: crypto.randomUUID(),
        user_id: userId,
        friend_id: friendId,
        connection_type: connectionType as any,
        permissions: {
          view_mood_data: false,
          view_gaming_activity: false,
          send_recommendations: false,
          view_wellness_goals: false,
        },
        created_at: new Date().toISOString(),
      }

      // Save to localStorage
      const existingConnections = JSON.parse(localStorage.getItem(`socialConnections_${userId}`) || '[]')
      existingConnections.push(newConnection)
      localStorage.setItem(`socialConnections_${userId}`, JSON.stringify(existingConnections))

      return newConnection
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to add social connection')
    }
  }
)

export const updateConnectionPermissions = createAsyncThunk(
  'community/updateConnectionPermissions',
  async ({ connectionId, permissions }: { connectionId: string; permissions: any }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { user: { user: any } }
      const userId = state.user.user?.id
      
      if (!userId) {
        throw new Error('User not authenticated')
      }

      const connections = JSON.parse(localStorage.getItem(`socialConnections_${userId}`) || '[]')
      const connectionIndex = connections.findIndex((conn: SocialConnection) => conn.id === connectionId)
      
      if (connectionIndex === -1) {
        throw new Error('Connection not found')
      }

      connections[connectionIndex].permissions = {
        ...connections[connectionIndex].permissions,
        ...permissions,
      }

      localStorage.setItem(`socialConnections_${userId}`, JSON.stringify(connections))

      return { connectionId, permissions: connections[connectionIndex].permissions }
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to update connection permissions')
    }
  }
)

const communitySlice = createSlice({
  name: 'community',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Load community posts
      .addCase(loadCommunityPosts.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loadCommunityPosts.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts = action.payload
      })
      .addCase(loadCommunityPosts.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create community post
      .addCase(createCommunityPost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createCommunityPost.fulfilled, (state, action) => {
        state.isLoading = false
        state.posts.unshift(action.payload)
      })
      .addCase(createCommunityPost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Like post
      .addCase(likePost.pending, (state) => {
        state.isLoading = true
      })
      .addCase(likePost.fulfilled, (state, action) => {
        state.isLoading = false
        const { postId, likes } = action.payload
        const post = state.posts.find(p => p.id === postId)
        if (post) {
          post.likes = likes
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add comment
      .addCase(addComment.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addComment.fulfilled, (state, action) => {
        state.isLoading = false
        const { postId, comment } = action.payload
        const post = state.posts.find(p => p.id === postId)
        if (post) {
          post.comments.push(comment)
        }
      })
      .addCase(addComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Load social connections
      .addCase(loadSocialConnections.pending, (state) => {
        state.isLoading = true
      })
      .addCase(loadSocialConnections.fulfilled, (state, action) => {
        state.isLoading = false
        state.connections = action.payload
      })
      .addCase(loadSocialConnections.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add social connection
      .addCase(addSocialConnection.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addSocialConnection.fulfilled, (state, action) => {
        state.isLoading = false
        state.connections.push(action.payload)
      })
      .addCase(addSocialConnection.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update connection permissions
      .addCase(updateConnectionPermissions.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateConnectionPermissions.fulfilled, (state, action) => {
        state.isLoading = false
        const { connectionId, permissions } = action.payload
        const connection = state.connections.find(c => c.id === connectionId)
        if (connection) {
          connection.permissions = permissions
        }
      })
      .addCase(updateConnectionPermissions.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError } = communitySlice.actions
export default communitySlice.reducer

