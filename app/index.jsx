import { StyleSheet, Text, View } from "react-native"
import QuizCard from "./components/QuizCard"

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quiz App</Text>
      <QuizCard />
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white"},
  title: {fontSize: 32, lineHeight: 40, fontWeight: "bold", paddingBottom: 20},
})
