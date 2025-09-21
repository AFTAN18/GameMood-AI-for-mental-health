import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Heart, Brain, Zap, Target, Award, TrendingUp } from "lucide-react";

export default function WellnessMetrics() {
  // Mock data - in real app this would come from props or state
  const metrics = {
    overallScore: 8.2,
    moodConsistency: 85,
    gamingBalance: 78,
    stressManagement: 92,
    energyLevel: 88,
    socialConnection: 75,
    achievements: [
      { title: "7-Day Wellness Streak", icon: Award, color: "text-yellow-500" },
      { title: "Mood Master", icon: Brain, color: "text-purple-500" },
      { title: "Balanced Gamer", icon: Target, color: "text-green-500" },
    ],
    weeklyGoals: [
      { name: "Daily Mood Check-ins", progress: 85, target: 100 },
      { name: "Gaming Balance", progress: 78, target: 80 },
      { name: "Stress Management", progress: 92, target: 90 },
    ]
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-blue-500";
    if (score >= 4) return "text-yellow-500";
    return "text-red-500";
  };

  const getScoreEmoji = (score: number) => {
    if (score >= 8) return "🌟";
    if (score >= 6) return "👍";
    if (score >= 4) return "👌";
    return "💪";
  };

  return (
    <div className="space-y-6">
      {/* Overall Wellness Score */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-800">
            <div className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>Overall Wellness Score</span>
              <p className="text-sm text-green-600 font-normal mt-1">
                Your comprehensive wellness rating
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="text-6xl">{getScoreEmoji(metrics.overallScore)}</span>
              <div>
                <div className={`text-5xl font-bold ${getScoreColor(metrics.overallScore)}`}>
                  {metrics.overallScore}/10
                </div>
                <p className="text-green-600 font-medium">Excellent!</p>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${(metrics.overallScore / 10) * 100}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Mood Consistency</span>
            </div>
            <div className="text-2xl font-bold text-blue-600 mb-2">{metrics.moodConsistency}%</div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.moodConsistency}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Gaming Balance</span>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-2">{metrics.gamingBalance}%</div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.gamingBalance}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Zap className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-orange-800">Energy Level</span>
            </div>
            <div className="text-2xl font-bold text-orange-600 mb-2">{metrics.energyLevel}%</div>
            <div className="w-full bg-orange-200 rounded-full h-2">
              <div 
                className="bg-orange-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.energyLevel}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <Heart className="w-5 h-5 text-red-600" />
              <span className="font-semibold text-red-800">Stress Management</span>
            </div>
            <div className="text-2xl font-bold text-red-600 mb-2">{metrics.stressManagement}%</div>
            <div className="w-full bg-red-200 rounded-full h-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.stressManagement}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-cyan-50 border-cyan-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp className="w-5 h-5 text-cyan-600" />
              <span className="font-semibold text-cyan-800">Social Connection</span>
            </div>
            <div className="text-2xl font-bold text-cyan-600 mb-2">{metrics.socialConnection}%</div>
            <div className="w-full bg-cyan-200 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${metrics.socialConnection}%` }}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-yellow-800">
            <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500">
              <Award className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>Recent Achievements</span>
              <p className="text-sm text-yellow-600 font-normal mt-1">
                Celebrate your wellness milestones
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics.achievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="flex items-center gap-3 p-3 bg-white/50 rounded-lg">
                  <IconComponent className={`w-6 h-6 ${achievement.color}`} />
                  <span className="font-medium text-yellow-800">{achievement.title}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Weekly Goals Progress */}
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-indigo-800">
            <div className="p-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <span>Weekly Goals Progress</span>
              <p className="text-sm text-indigo-600 font-normal mt-1">
                Track your wellness objectives
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.weeklyGoals.map((goal, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-indigo-800">{goal.name}</span>
                  <span className="text-sm text-indigo-600">{goal.progress}% / {goal.target}%</span>
                </div>
                <div className="w-full bg-indigo-200 rounded-full h-3">
                  <div 
                    className={`h-3 rounded-full transition-all duration-1000 ${
                      goal.progress >= goal.target 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                    }`}
                    style={{ width: `${Math.min((goal.progress / goal.target) * 100, 100)}%` }}
                  />
                </div>
                {goal.progress >= goal.target && (
                  <div className="flex items-center gap-1 text-green-600 text-sm">
                    <Award className="w-4 h-4" />
                    <span>Goal achieved!</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

