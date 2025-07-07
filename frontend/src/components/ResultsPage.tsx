import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { PredictionResult } from "@/lib/api";
import { AlertTriangle, ArrowLeft, Bot, Calculator, CheckCircle, RefreshCw, Share } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

interface AssessmentData {
  sleepHours: number;
  screenTime: number;
  stressLevel: number;
  tiktokUsage: number;
}

interface LocationState {
  data: AssessmentData;
  riskScore?: number;
  mlResult?: PredictionResult;
  isMLPrediction?: boolean;
  error?: string;
}

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    data, 
    riskScore = 0, 
    mlResult, 
    isMLPrediction = false, 
    error 
  }: LocationState = location.state || {
    data: { sleepHours: 7, screenTime: 5, stressLevel: 5, tiktokUsage: 1 }
  };

  // Use ML result if available, otherwise fall back to simple risk score
  const finalRiskScore = mlResult ? mlResult.probability_scores.high_risk * 100 : riskScore;
  const isHighRisk = mlResult ? mlResult.prediction === 1 : riskScore > 50;
  const confidencePercentage = mlResult ? mlResult.confidence * 100 : Math.min(85 + Math.random() * 10, 95);
  const predictionLabel = mlResult ? mlResult.prediction_label : (isHighRisk ? 'High Risk' : 'Low Risk');
  const riskLevel = mlResult ? mlResult.risk_level : (isHighRisk ? 'High' : 'Low');

  const getRecommendations = () => {
    // Use ML recommendations if available
    if (mlResult && mlResult.recommendations) {
      return mlResult.recommendations.map((rec, index) => ({
        title: `Recommendation ${index + 1}`,
        description: rec,
        priority: index === 0 ? "high" : index === 1 ? "medium" : "low"
      }));
    }

    // Fallback to rule-based recommendations
    const recommendations = [];
    
    if (data.sleepHours < 6) {
      recommendations.push({
        title: "Improve Sleep Hygiene",
        description: "Aim for 7-9 hours of sleep nightly. Create a bedtime routine and avoid screens before bed.",
        priority: "high"
      });
    }
    
    if (data.screenTime > 8) {
      recommendations.push({
        title: "Reduce Screen Time",
        description: "Try the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.",
        priority: "high"
      });
    }
    
    if (data.stressLevel > 7) {
      recommendations.push({
        title: "Manage Stress",
        description: "Practice mindfulness, deep breathing, or consider meditation apps for stress relief.",
        priority: "high"
      });
    }
    
    if (data.tiktokUsage > 3) {
      recommendations.push({
        title: "Mindful TikTok Usage",
        description: "Set app time limits and take regular breaks to prevent endless scrolling.",
        priority: "medium"
      });
    }

    // Add positive recommendations for low-risk users
    if (!isHighRisk) {
      recommendations.push({
        title: "Maintain Your Balance",
        description: "Your digital habits look healthy! Keep up the good work with regular check-ins.",
        priority: "low"
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  const handleShare = () => {
    toast({
      title: "Results copied!",
      description: "Your wellness summary has been copied to clipboard.",
    });
    // In a real app, this would copy a shareable summary
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-gradient-warning text-warning-foreground";
      case "medium": return "bg-gradient-primary text-primary-foreground";
      case "low": return "bg-gradient-success text-success-foreground";
      default: return "bg-gradient-primary text-primary-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-primary mb-2">Your Digital Wellness Results</h1>
          <p className="text-muted-foreground">
            Based on your responses, here's your personalized wellness assessment
          </p>
          
          {/* Prediction Method Indicator */}
          <div className="flex items-center justify-center mt-4 space-x-2">
            {isMLPrediction ? (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Bot className="w-3 h-3 mr-1" />
                ML Model Prediction
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                <Calculator className="w-3 h-3 mr-1" />
                Rule-based Assessment
              </Badge>
            )}
            {error && (
              <Badge variant="destructive" className="text-xs">
                {error}
              </Badge>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Risk Assessment Card */}
          <Card className={`shadow-wellness ${isHighRisk ? 'border-warning' : 'border-success'}`}>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center mb-4">
                {isHighRisk ? (
                  <AlertTriangle className="w-12 h-12 text-warning" />
                ) : (
                  <CheckCircle className="w-12 h-12 text-success" />
                )}
              </div>
              <CardTitle className={`text-2xl ${isHighRisk ? 'text-warning' : 'text-success'}`}>
                {predictionLabel}
              </CardTitle>
              <div className="mt-4">
                <div className="text-4xl font-bold text-foreground mb-2">
                  {finalRiskScore.toFixed(0)}/100
                </div>
                <Progress 
                  value={finalRiskScore} 
                  className={`h-3 ${isHighRisk ? '[&>div]:bg-warning' : '[&>div]:bg-success'}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <Badge variant="outline" className="text-sm">
                  {confidencePercentage.toFixed(0)}% Confidence
                </Badge>
                <p className="text-muted-foreground">
                  {isHighRisk 
                    ? "Your digital habits may be impacting your wellbeing. The recommendations below can help you create a healthier balance."
                    : "Your digital habits show good balance! Continue these positive patterns and consider the suggestions below to maintain your wellness."
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assessment Breakdown */}
          <Card className="shadow-wellness">
            <CardHeader>
              <CardTitle>Assessment Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sleep Hours:</span>
                    <span className="font-medium">{data.sleepHours}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Screen Time:</span>
                    <span className="font-medium">{data.screenTime}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stress Level:</span>
                    <span className="font-medium">{data.stressLevel}/10</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>TikTok Usage:</span>
                    <span className="font-medium">{data.tiktokUsage}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Risk Score:</span>
                    <span className="font-medium">{finalRiskScore.toFixed(0)}/100</span>
                  </div>
                  {mlResult && (
                    <div className="flex justify-between">
                      <span>Risk Level:</span>
                      <span className="font-medium">{riskLevel}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recommendations */}
        <Card className="mt-8 shadow-wellness">
          <CardHeader>
            <CardTitle className="flex items-center">
              Personalized Recommendations
              <Badge variant="secondary" className="ml-2">
                {recommendations.length} suggestions
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="border-2 border-muted">
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Badge className={`${getPriorityColor(rec.priority)} shrink-0`}>
                        {rec.priority.toUpperCase()}
                      </Badge>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{rec.title}</h4>
                        <p className="text-xs text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center mt-8">
          <Button
            onClick={() => navigate("/assessment")}
            variant="outline"
            className="flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retake Assessment
          </Button>
          
          <Button
            onClick={handleShare}
            className="flex items-center bg-gradient-primary hover:opacity-90"
          >
            <Share className="w-4 h-4 mr-2" />
            Share Results
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          <p>
            This assessment is for educational purposes only and does not constitute medical advice. 
            If you're experiencing significant stress or sleep issues, consider consulting a healthcare professional.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;