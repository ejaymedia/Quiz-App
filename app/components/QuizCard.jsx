import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native"

const URL =
  "https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple"

export default function QuizCard() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [quizFinished, setQuizFinished] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setLoading(true)
      setQuizFinished(false)
      setCurrentIndex(0)
      setScore(0)
      setSelectedAnswer(null)

      const res = await fetch(URL)
      const data = await res.json()
      setQuestions(data.results)
    } catch (err) {
      console.error("Error fetching questions:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  // Guard: if loading or no questions
  if (loading || questions.length === 0) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="white" />
      </View>
    )
  }

  const question = questions[currentIndex]

  // Handle answer selection
  const handleAnswer = (answer) => {
    setSelectedAnswer(answer)
    if (answer === question.correct_answer) {
      setScore(score + 1)
    }
  }

  // Next question
  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedAnswer(null)
    } else {
      setQuizFinished(true)
    }
  }

  // If quiz finished
  if (quizFinished) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>🎉 Quiz Finished!</Text>
        <Text style={styles.question}>
          You scored {score} / {questions.length}
        </Text>
        <TouchableOpacity style={styles.restartButton} onPress={fetchQuestions}>
          <Text style={styles.restartText}>Restart Quiz</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Shuffle answers
  const answers = [...question.incorrect_answers, question.correct_answer].sort(
    () => Math.random() - 0.5
  )

  // Progress percentage
  const progressPercent = ((currentIndex + 1) / questions.length) * 100

  return (
    <View style={styles.container}>
      {/* Progress + Score */}
      <View style={styles.topRow}>
        <Text style={styles.progress}>
          Question {currentIndex + 1} / {questions.length}
        </Text>
        <Text style={styles.progress}>Score: {score}</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View
          style={[styles.progressBarFill, { width: `${progressPercent}%` }]}
        />
      </View>

      <Text style={styles.question}>{question.question}</Text>

      {answers.map((ans, i) => {
        let btnStyle = styles.button

        if (selectedAnswer) {
          if (ans === question.correct_answer) {
            btnStyle = [styles.button, styles.correct]
          } else if (ans === selectedAnswer) {
            btnStyle = [styles.button, styles.wrong]
          }
        }

        return (
          <TouchableOpacity
            key={i}
            style={btnStyle}
            onPress={() => handleAnswer(ans)}
            disabled={!!selectedAnswer}
          >
            <Text style={styles.buttonText}>{ans}</Text>
          </TouchableOpacity>
        )
      })}

      {selectedAnswer && (
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>
            {currentIndex + 1 === questions.length ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "black",
    height: "75%",
    width: "90%",
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "white",
  },
  question: {
    fontSize: 18,
    marginVertical: 20,
    textAlign: "center",
    color: "white",
  },
  button: {
    backgroundColor: "white",
    padding: 10,
    margin: 5,
    borderRadius: 10,
    width: "90%",
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    textAlign: "center",
  },
  correct: {
    backgroundColor: "green",
  },
  wrong: {
    backgroundColor: "red",
  },
  restartButton: {
    backgroundColor: "tomato",
    padding: 12,
    marginTop: 20,
    borderRadius: 10,
    width: "60%",
  },
  restartText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  progress: {
    color: "white",
    fontSize: 16,
  },
  progressBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: "#444",
    borderRadius: 5,
    marginBottom: 15,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#2196F3",
  },
  nextButton: {
    backgroundColor: "#2196F3",
    padding: 12,
    marginTop: 20,
    borderRadius: 10,
    width: "60%",
  },
  nextText: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
})