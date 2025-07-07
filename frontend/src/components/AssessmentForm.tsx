import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { API, AssessmentData as ApiAssessmentData } from "@/lib/api";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface AssessmentData {
  sleepHours: number;
  screenTime: number;
  stressLevel: number;
  tiktokUsage: number;
}

const AssessmentForm = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<AssessmentData>({
    sleepHours: 7.0,
    screenTime: 5.0,
    stressLevel: 5,
    tiktokUsage: 1.0,
  });

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Convert frontend data format to API format
      const apiData: ApiAssessmentData = {
        screen_time_hours: data.screenTime,
        hours_on_TikTok: data.tiktokUsage,
        sleep_hours: data.sleepHours,
        stress_level: data.stressLevel,
      };

      // Validate data before sending
      const validationErrors = API.validateAssessmentData(apiData);
      if (validationErrors.length > 0) {
        console.error('Validation errors:', validationErrors);
        // Fallback to mock calculation if validation fails
        throw new Error('Data validation failed');
      }

      // Call the ML API
      const apiResponse = await API.predict(apiData);
      
      // Navigate to results with ML prediction data
      navigate("/results", { 
        state: { 
          data, 
          mlResult: apiResponse.result,
          isMLPrediction: true 
        } 
      });
      
    } catch (error) {
      console.error('ML API error, falling back to simple calculation:', error);
      
      // Fallback: Calculate risk score using simple rules
      let riskScore = 0;
      if (data.sleepHours < 6) riskScore += 30;
      if (data.screenTime > 8) riskScore += 25;
      if (data.stressLevel > 7) riskScore += 30;
      if (data.tiktokUsage > 3) riskScore += 15;

      // Navigate to results with fallback data
      navigate("/results", { 
        state: { 
          data, 
          riskScore,
          isMLPrediction: false,
          error: 'ML API unavailable - using simplified assessment'
        } 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Sleep Hours</h2>
              <p className="text-muted-foreground">How many hours of sleep do you get per night?</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{data.sleepHours}</span>
                <span className="text-lg text-muted-foreground ml-1">hours</span>
              </div>
              <Slider
                value={[data.sleepHours]}
                onValueChange={(value) => setData({ ...data, sleepHours: value[0] })}
                max={12}
                min={3}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>3 hours</span>
                <span>12 hours</span>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Screen Time</h2>
              <p className="text-muted-foreground">How many hours do you spend on screens daily?</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{data.screenTime}</span>
                <span className="text-lg text-muted-foreground ml-1">hours</span>
              </div>
              <Slider
                value={[data.screenTime]}
                onValueChange={(value) => setData({ ...data, screenTime: value[0] })}
                max={16}
                min={0}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 hours</span>
                <span>16 hours</span>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">TikTok Usage</h2>
              <p className="text-muted-foreground">How many hours do you spend on TikTok daily?</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{data.tiktokUsage}</span>
                <span className="text-lg text-muted-foreground ml-1">hours</span>
              </div>
              <Slider
                value={[data.tiktokUsage]}
                onValueChange={(value) => setData({ ...data, tiktokUsage: value[0] })}
                max={8}
                min={0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>0 hours</span>
                <span>8+ hours</span>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-foreground mb-2">Stress Level</h2>
              <p className="text-muted-foreground">Rate your current stress level</p>
            </div>
            <div className="space-y-4">
              <div className="text-center">
                <span className="text-4xl font-bold text-primary">{data.stressLevel}</span>
                <span className="text-lg text-muted-foreground ml-1">/10</span>
              </div>
              <Slider
                value={[data.stressLevel]}
                onValueChange={(value) => setData({ ...data, stressLevel: value[0] })}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>1 - Very Low</span>
                <span>10 - Very High</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Analyzing Your Results...</h3>
            <p className="text-muted-foreground">Please wait while we process your assessment</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
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
          <h1 className="text-3xl font-bold text-primary mb-2">Digital Wellness Assessment</h1>
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <span>Step {currentStep} of {totalSteps}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="shadow-wellness animate-fade-in">
          <CardContent className="p-8">
            {renderStep()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="flex items-center bg-gradient-primary hover:opacity-90"
          >
            {currentStep === totalSteps ? (
              <>
                <Check className="w-4 h-4 mr-2" />
                Complete Assessment
              </>
            ) : (
              <>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentForm;