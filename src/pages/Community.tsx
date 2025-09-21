import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { motion } from 'framer-motion'
import { Users, Heart, MessageCircle, Share2, Plus, Filter, Search } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../hooks/redux'
import { loadCommunityPosts, createCommunityPost } from '../store/slices/communitySlice'

export default function CommunityPage() {
  const dispatch = useAppDispatch()
  const { posts, isLoading } = useAppSelector((state) => state.community)
  const { user } = useAppSelector((state) => state.user)
  const [newPost, setNewPost] = useState('')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      await dispatch(loadCommunityPosts())
    } catch (error) {
      console.error('Failed to load community posts:', error)
    }
  }

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return

    setIsCreatingPost(true)
    try {
      await dispatch(createCommunityPost({
        content: newPost.trim(),
        isAnonymous: false
      })).unwrap()
      setNewPost('')
      setShowCreateForm(false)
    } catch (error) {
      console.error('Failed to create post:', error)
    } finally {
      setIsCreatingPost(false)
    }
  }

  const getMoodEmoji = (moodScore: number) => {
    if (moodScore >= 8) return '😊'
    if (moodScore >= 6) return '🙂'
    if (moodScore >= 4) return '😐'
    return '😔'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-xl font-semibold text-gray-700">Loading community posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Gaming Wellness Community
              </h1>
              <p className="text-gray-600">
                Connect with fellow gamers on their wellness journey
              </p>
            </div>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="gaming-button"
            >
              <Plus className="w-4 h-4 mr-2" />
              Share Your Experience
            </Button>
          </div>
        </motion.div>

        {/* Create Post Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <span>Share Your Gaming Wellness Experience</span>
                    <p className="text-sm text-gray-600 font-normal mt-1">
                      Help others by sharing your mood, games, and wellness insights
                    </p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your gaming wellness experience... What games have helped your mood lately? Any wellness tips for fellow gamers?"
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    disabled={isCreatingPost}
                  />
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={() => setShowCreateForm(false)}
                      variant="outline"
                      disabled={isCreatingPost}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || isCreatingPost}
                      className="gaming-button"
                    >
                      {isCreatingPost ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                          />
                          Posting...
                        </>
                      ) : (
                        'Share Post'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Community Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          {posts.length === 0 ? (
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-12 text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Posts Yet</h3>
                <p className="text-gray-500 mb-6">
                  Be the first to share your gaming wellness experience with the community!
                </p>
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="gaming-button"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Post
                </Button>
              </CardContent>
            </Card>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        {post.is_anonymous ? '?' : (user?.display_name?.charAt(0) || 'U')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-gray-800">
                            {post.is_anonymous ? 'Anonymous Gamer' : user?.display_name || 'User'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {new Date(post.created_at).toLocaleDateString()}
                          </Badge>
                          {post.mood_context && (
                            <Badge variant="mood" className="text-xs">
                              {getMoodEmoji(post.mood_context.energy_level)} Mood
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{post.content}</p>
                        
                        {/* Game Recommendations */}
                        {post.game_recommendations && post.game_recommendations.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold text-gray-600 mb-2">Recommended Games:</h4>
                            <div className="flex flex-wrap gap-2">
                              {post.game_recommendations.map((game, idx) => (
                                <Badge key={idx} variant="gaming" className="text-xs">
                                  {game.title}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-red-500">
                            <Heart className="w-4 h-4 mr-1" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-blue-500">
                            <MessageCircle className="w-4 h-4 mr-1" />
                            {post.comments.length}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-gray-600 hover:text-green-500">
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                        </div>

                        {/* Comments */}
                        {post.comments.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-200">
                            <h5 className="text-sm font-semibold text-gray-600 mb-3">Comments</h5>
                            <div className="space-y-3">
                              {post.comments.slice(0, 2).map((comment) => (
                                <div key={comment.id} className="flex items-start gap-3">
                                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                                    {comment.user_id.charAt(0).toUpperCase()}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {new Date(comment.created_at).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                              {post.comments.length > 2 && (
                                <p className="text-sm text-gray-500">
                                  +{post.comments.length - 2} more comments
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  )
}
