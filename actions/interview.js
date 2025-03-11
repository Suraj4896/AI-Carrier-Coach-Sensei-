"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

//API for generating quiz questions by AI
export async function generateQuiz(){
    //check user authorized or not
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");
    
    //exists in databse or not
    const user = await db.user.findUnique({
        where: {
            clerkUserId: userId,
        },
        select: {
            industry: true,
            skills: true,
        },
    });
    if(!user) throw new Error("User not found");


    //promt for generating quiz
    const prompt = `
            Generate 3 technical interview questions for a ${
            user.industry
            } professional${
            user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
        }.
            
            Each question should be multiple choice with 4 options.
            
            Return the response in this JSON format only, no additional text:
            {
                "questions": [
                    {
                        "question": "string",
                        "options": ["string", "string", "string", "string"],
                        "correctAnswer": "string",
                        "explanation": "string"
                    }
                ]
            }
        `;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        // Remove unwanted markdown formatting
        const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
        
        // Try parsing JSON
        const quiz = JSON.parse(cleanedText);

        return quiz.questions;
    } catch (error) {
        console.error("Error generating quiz:", error);
        throw new Error("Failed to generate quiz questions");
    }

}

//API for saving questions
export async function saveQuizResult(questions, answers, score){
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    //exists in databse or not
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    if(!user) throw new Error("User not found");

    //details in questions
    const questionResults = questions.map((q, index) => ({
        question: q.question,
        answer: q.correctAnswer,
        userAnswer: answers[index],
        isCorrect: q.correctAnswer === answers[index],
        explanation: q.explanation,
    }));

    //wrong answers for improvement
    const wrongAnswers = questionResults.filter((q) => !q.isCorrect);
    let improvementTip = null;

    //generate improvement through gemini if answer is wrong
    if(wrongAnswers.length > 0){
        const wrongQuestionsText = wrongAnswers.map((q) =>
            `Question: "${q.question}"\nCorrect Answer: "${q.answer}"\nUser Answer: "${q.userAnswer}"`
        ).join("\n\n");

        const improvementPrompt = `
            The user got the following ${user.industry} technical interview questions wrong:

            ${wrongQuestionsText}

            Based on these mistakes, provide a concise, specific improvement tip.
            Focus on the knowledge gaps revealed by these wrong answers.
            Keep the response under 2 sentences and make it encouraging.
            Don't explicitly mention the mistakes, instead focus on what to learn/practice.
        `;

        try {
            const tipResult = await model.generateContent(improvementPrompt);

            improvementTip = tipResult.response.text().trim();
        } catch (error) {
            console.error("Error generating improvement tip:", error);
        }
    }

    try {
        const assessment = await db.assessment.create({
            data: {
                user: { connect: { id: user.id } },
                quizScore: score,
                questions: questionResults,
                category: "Technical",
                improvementTip
            },
        });

        return assessment;
        
    } catch (error) {
        console.error("Error saving quiz result:", error);
        throw new Error("Failed to save quiz result");
    }
}

//API for show interview page
export async function getAssessments(){
    const {userId} = await auth();
    if(!userId) throw new Error("Unauthorized");

    //exists in databse or not
    const user = await db.user.findUnique({
        where: { clerkUserId: userId },
      });
    if(!user) throw new Error("User not found");

    try {
        const assessments = await db.assessment.findMany({
            where: {
                userId: user.id,
            },
            orderBy: {
                createdAt: "asc",
            },
        });
        return assessments;
    } catch (error) {
        console.error("Error fetching assessments:", error);
        throw new Error("Failed to fetch assessments");
    }
}