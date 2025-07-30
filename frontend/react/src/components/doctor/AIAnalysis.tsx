import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Upload, Brain, CheckCircle, Zap, Cpu, Activity, X } from 'lucide-react';
import { toast } from '../../hooks/use-toast';
import type { AIAnalysisResult } from '../../entities';
import { useDropzone } from 'react-dropzone';
import { useClassifyImage } from '../../features/ai/hooks';
import { useNavigate } from 'react-router-dom';

export const AIAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maxPhrases, setMaxPhrases] = useState<string>("12");
  const [topK, setTopK] = useState<string>("5");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<AIAnalysisResult | null>(null);

  const { mutateAsync: classifyImage } = useClassifyImage();

  // Function to handle file selection through dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        // Create a preview URL for the selected image
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        toast({
          title: "Image selected",
          description: `Selected: ${file.name}`,
        });
      } else {
        toast({
          title: "Invalid file type",
          description: "Please select an image file (JPG, PNG, etc.)",
          variant: "destructive",
        });
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize: 10485760, // 10MB in bytes
    multiple: false
  });

  // Function to clear the selected file
  const clearSelectedFile = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleAnalysis = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select an image file first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      if (maxPhrases && !isNaN(Number(maxPhrases))) {
        formData.append('max_phrases', maxPhrases);
      }

      if (topK && !isNaN(Number(topK))) {
        formData.append('top_k', topK);
      }

      const result = await classifyImage({
        formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        }
      });

      setAnalysisResult(result);
      toast({
        title: "Analysis complete",
        description: "AI analysis has been completed successfully",
      });
    } catch (error: any) {
      console.error('Analysis error:', error);
      let errorMsg = "There was an error processing the image";

      if (error.response) {
        // Handle specific error status codes
        switch (error.response.status) {
          case 400:
            errorMsg = "Invalid file type. Please upload a valid medical image.";
            break;
          case 401:
            errorMsg = "Authentication required. Please log in again.";
            break;
          case 403:
            errorMsg = "You don't have permission to use this feature.";
            break;
          case 500:
            errorMsg = "Server error during classification. Please try again later.";
            break;
          default:
            errorMsg = error.response.data?.message || errorMsg;
        }
      }

      toast({
        title: "Analysis failed",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  const resetAnalysis = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    setMaxPhrases("12");
    setTopK("5");
    setAnalysisResult(null);
  };

  // Function to determine color class based on confidence score
  const getConfidenceColorClass = (score: number) => {
    if (score >= 0.8) return "bg-green-500"; // High confidence
    if (score >= 0.5) return "bg-yellow-500"; // Medium confidence
    return "bg-gray-400"; // Low confidence
  };

  return (
    <div className="space-y-6">
      {/* Header section with history button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">
          AI Medical Image Analysis
        </h2>
        <Button
          variant="outline"
          onClick={() => navigate('/doctor/ai/history')}
          className="flex items-center gap-2"
        >
          <Activity className="h-4 w-4" />
          View History
        </Button>
      </div>

      <Card className="ai-card border-0 backdrop-blur-sm">
        <CardHeader className="neural-bg">
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="relative">
              <Brain className="h-8 w-8 text-primary ai-pulse" />
              <div className="absolute -top-1 -right-1">
                <Zap className="h-4 w-4 text-ai-accent animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <h2 className="text-2xl font-semibold leading-tight">
                <span className="inline-block w-full bg-gradient-to-r from-primary to-ai-secondary bg-clip-text text-transparent">
                  AI Medical Image Analysis
                </span>
              </h2>
              <div className="flex items-center gap-2 text-sm font-normal text-muted-foreground">
                <Cpu className="h-3 w-3" />
                <span>MedCLIP Classifier</span>
                <Activity className="h-3 w-3 animate-pulse text-green-400" />
                <span>Online</span>
              </div>
            </div>
          </CardTitle>
          <CardDescription className="text-base mt-3">
            Advanced AI-powered diagnostic assistance using deep learning neural networks for
            precise medical image analysis and disease prediction
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {!analysisResult ? (
            <>
              {/* File Upload Section with Dropzone */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="image-upload" className="text-sm font-medium">
                    Medical Image
                  </Label>
                  <div className="mt-2">
                    <div className="w-full">
                      <div
                        {...getRootProps()}
                        className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 circuit-pattern ${isDragActive
                          ? "border-ai-accent bg-ai-primary/10"
                          : "border-ai-primary/30 bg-gradient-to-br from-ai-primary/5 to-ai-secondary/5"
                          } hover:border-ai-primary/50 hover:shadow-ai-glow hover:from-ai-primary/10 hover:to-ai-secondary/10`}
                      >
                        <input {...getInputProps()} />

                        {previewUrl ? (
                          <div className="relative w-full h-full p-4 flex flex-col items-center">
                            <div className="absolute top-2 right-2 z-10">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  clearSelectedFile();
                                }}
                                className="h-6 w-6 rounded-full bg-black/40 hover:bg-black/60 text-white"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="relative flex-1 w-full h-40 overflow-hidden flex items-center justify-center">
                              <img
                                src={previewUrl}
                                alt="Preview"
                                className="max-h-full max-w-full object-contain"
                              />
                            </div>
                            <div className="text-center mt-2">
                              <p className="text-sm text-foreground">
                                <span className="font-semibold text-ai-accent">{selectedFile?.name}</span>
                              </p>
                              <p className="text-xs text-muted-foreground">
                                Click or drop to replace • Ready for AI analysis
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-12 h-12 mb-3 text-ai-primary animate-pulse" />
                            <p className="mb-2 text-sm text-foreground">
                              <span className="font-semibold">Drag & drop</span> or <span className="font-semibold">click</span> to upload
                            </p>
                            <p className="text-xs text-muted-foreground">
                              PNG, JPG, JPEG up to 10MB • Secure & encrypted
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analysis Parameters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="max-phrases" className="text-sm font-medium flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-ai-primary" />
                      Max Phrases
                    </Label>
                    <Input
                      id="max-phrases"
                      type="number"
                      value={maxPhrases}
                      onChange={(e) => setMaxPhrases(e.target.value)}
                      placeholder="12"
                      min="1"
                      max="20"
                      className="mt-2 circuit-pattern border-ai-primary/20 focus:border-ai-primary/50 focus:shadow-ai-glow/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Maximum phrases to sample per disease
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="top-k" className="text-sm font-medium flex items-center gap-2">
                      <Activity className="h-4 w-4 text-ai-secondary" />
                      Top Results (K)
                    </Label>
                    <Input
                      id="top-k"
                      type="number"
                      value={topK}
                      onChange={(e) => setTopK(e.target.value)}
                      placeholder="5"
                      min="1"
                      max="10"
                      className="mt-2 circuit-pattern border-ai-secondary/20 focus:border-ai-secondary/50 focus:shadow-ai-glow/50"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Number of top predictions to return
                    </p>
                  </div>
                </div>

                {/* Upload Progress */}
                {isAnalyzing && uploadProgress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span>Uploading and analyzing...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} max={100} className="h-2" />
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    onClick={handleAnalysis}
                    disabled={!selectedFile || isAnalyzing}
                    className="flex-1 bg-gradient-to-r from-ai-primary to-ai-secondary hover:from-ai-primary/90 hover:to-ai-secondary/90 text-white border-0 shadow-lg hover:shadow-ai-glow transition-all duration-300"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <Brain className="h-4 w-4 animate-pulse" />
                          <span>AI Processing...</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        <Zap className="h-4 w-4 mr-2" />
                        Initiate AI Analysis
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={resetAnalysis}
                    disabled={isAnalyzing}
                    className="border-ai-primary/30 hover:bg-ai-primary/5"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Analysis Results */
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg neural-bg border border-ai-primary/20">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-ai-accent ai-pulse" />
                  <div>
                    <span className="font-semibold text-lg text-ai-accent">Analysis Complete</span>
                    <p className="text-xs text-muted-foreground">AI classification successful</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Activity className="h-3 w-3 animate-pulse text-green-400" />
                  <span>MedCLIP active</span>
                </div>
              </div>

              {/* Show the analyzed image */}
              {previewUrl && (
                <div className="flex justify-center p-4 border border-ai-primary/20 rounded-lg bg-card">
                  <img
                    src={previewUrl}
                    alt="Analyzed image"
                    className="max-h-64 object-contain"
                  />
                </div>
              )}

              {/* Top Disease Results */}
              <Card className="ai-card border-ai-primary/30">
                <CardHeader className="neural-bg">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-ai-primary" />
                    Disease Classification Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {analysisResult.results.map((result, index) => (
                    <div key={index} className="p-4 rounded-lg transition-all duration-300 hover:bg-ai-primary/5">
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="font-bold text-xs text-muted-foreground">{index + 1}</span>
                        </div>
                        <div className="space-y-2 w-full">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">
                              {result.disease_name}
                            </h3>
                            <span className={`text-sm font-bold ${result.score >= 0.8 ? "text-green-600" :
                              result.score >= 0.5 ? "text-yellow-600" :
                                "text-gray-500"
                              }`}>
                              {(result.score * 100).toFixed(1)}%
                            </span>
                          </div>

                          <div className="flex items-center gap-2 w-full">
                            <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                              <div
                                className={`${getConfidenceColorClass(result.score)} h-full rounded-full transition-all duration-1000`}
                                style={{ width: `${result.score * 100}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="text-sm italic bg-muted/40 p-2 rounded border-l-2 border-ai-primary/30">
                            "{result.best_phrase}"
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="text-xs text-muted-foreground flex items-center gap-1 mt-2">
                    <Activity className="h-3 w-3 animate-pulse text-green-400" />
                    <span>Results ordered by confidence score</span>
                  </div>
                </CardContent>
              </Card>

              <div className="flex space-x-4">
                <Button onClick={resetAnalysis} variant="outline" className="flex-1 border-ai-primary/30 hover:bg-ai-primary/5">
                  <Brain className="h-4 w-4 mr-2" />
                  New Analysis
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};