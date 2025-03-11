"use client";

import { generateQuiz, saveQuizResult } from "@/actions/interview";
import useFetch from "@/hooks/user-fetch";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarLoader } from "react-spinners";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import QuizResult from "./QuizResult";

const Quiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);

  //custom hook for fetching
  const {
    loading: generatingQuiz,
    fn: generateQuizFn,
    data: quizData,
  } = useFetch(generateQuiz);

  //custom hook for saving the result
  const {
    loading: savingResult,
    fn: saveQuizResultFn,
    data: resultData,
    setData: setResultData
  } = useFetch(saveQuizResult);

  console.log(resultData);
  

  //if quiz is generated then set the answers
  useEffect(() => {
    if (quizData) {
      setAnswers(new Array(quizData.length).fill(null));
    }
  }, [quizData]);

  //handle the options
  const handleAnswer = (answer) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
  };

  //handle next question
  const handleNext = () => {
    if(currentQuestion < quizData.length - 1){
        setCurrentQuestion(currentQuestion + 1);
        setShowExplanation(false);
    } else {
        finishQuiz();
    }
  };

  //logic for calculate score
  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
        if(answer === quizData[index].correctAnswer){
            correct++;
        }
    });
    return (correct / quizData.length) * 100;
  };

  //finish quiz logic
  const finishQuiz = async () => {
    const score = calculateScore();

    try {
        await saveQuizResultFn(quizData, answers, score);
        toast.success("Quiz Completed!");
    } catch (error) {
        toast.error(error.message || "Failed to save quiz results");
    }
  };

  //start new quiz
  const startNewQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowExplanation(false);
    generateQuizFn();
    setResultData(null);
  };

  //before generating quiz show a bar loader
  if (generatingQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }

  //showing result
  if(resultData){
    return (
        <QuizResult result={resultData} onStartNew={startNewQuiz} />
    );
  }

  //if user wants to start a new quiz
  if (!quizData) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={generateQuizFn}>
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }

  //current question
  const question = quizData[currentQuestion];

  return (
    <Card className="mx-2">
      <CardHeader>
        <CardTitle>
          Question {currentQuestion + 1} of {quizData.length}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg font-medium">{question.question}</p>
        <RadioGroup
          className="space-y-2"
          onValueChange={handleAnswer}
          value={answers[currentQuestion]}
        >
          {question.options.map((option, index) => {
            return (
              <div className="flex items-center space-x-2" key={index}>
                <RadioGroupItem value={option} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`}>{option}</Label>
              </div>
            );
          })}
        </RadioGroup>
        {/* explanation */}
        {showExplanation && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="font-medium">Explanation:</p>
            <p className="text-muted-foreground">{question.explanation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {!showExplanation && (
          <Button
            onClick={() => setShowExplanation(true)}
            variant="outline"
            disabled={!answers[currentQuestion]}
          >
            Show Explanation
          </Button>
        )}
        <Button
          onClick={handleNext}
          className="ml-auto"
          disabled={!answers[currentQuestion] || savingResult}
        >
          {savingResult && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {currentQuestion < quizData.length - 1
                ? "Next Question"
                : "Finish Quiz"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Quiz;
