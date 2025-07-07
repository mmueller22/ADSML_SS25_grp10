import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Brain, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center animate-fade-in">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-6 animate-pulse-glow">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Assess Your Digital Wellness
              <span className="block text-primary-glow-dark">in 4 Questions</span>
            </h1>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Take a quick, science-based assessment to understand your digital habits 
              and receive personalized recommendations for a healthier relationship with technology.
            </p>
          </div>

          <Button
            onClick={() => navigate("/assessment")}
            size="lg"
            className="bg-white text-primary hover:bg-white/90 shadow-wellness text-lg px-8 py-4 h-auto animate-scale-in"
          >
            Start Assessment
            <Zap className="ml-2 w-5 h-5" />
          </Button>

          <p className="text-white/70 mt-4 text-sm">
            Takes less than 2 minutes • Completely anonymous
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 animate-slide-up">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Heart className="w-8 h-8 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Holistic Assessment</h3>
              <p className="text-white/80 text-sm">
                Evaluates sleep, screen time, stress, and social media usage for a complete picture.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Shield className="w-8 h-8 text-primary-glow mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Privacy First</h3>
              <p className="text-white/80 text-sm">
                Your data stays private. No registration required, no tracking, no data storage.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardContent className="p-6 text-center">
              <Brain className="w-8 h-8 text-warning mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Personalized Insights</h3>
              <p className="text-white/80 text-sm">
                Get tailored recommendations based on your unique digital wellness profile.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;