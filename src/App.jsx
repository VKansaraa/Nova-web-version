import { useState } from 'react';
import KnowledgeBase from './KnowledgeBase.json';
import stringSimilarity from 'string-similarity';
import './App.css';
import { solveExpression } from './MathSolver';

function Nova() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // Find approximate answer using string-similarity
  const FindAnswers = (UserInput) => {
  const lowerInput = UserInput.toLowerCase().trim();
  // checks if there are numbers or math operators in the input. 
  try{
    if (/[0-9+\-*/().\s^x=,%]+$/i.test(UserInput)) {
      return solveExpression(UserInput);
    }
  } catch {
    return "Invalid math expression.";
  }
  // Use the questions array inside KnowledgeBase.questions
  const validItems = KnowledgeBase.questions.filter(item => item.question && item.answer);

  const questionsArray = validItems.map(item => item.question.toLowerCase());

  const bestMatch = stringSimilarity.findBestMatch(lowerInput, questionsArray);

  if (bestMatch.bestMatch.rating > 0.5) {
    const index = bestMatch.bestMatchIndex;
    return validItems[index].answer;
  } else {
    return "Sorry, I don't have an answer for that question.";
  }
};

  const handleSubmit = () => {
    if (!input.trim()) return;

    const answer = FindAnswers(input);

    setMessages(prev => [
      ...prev,
      { text: input, sender: "user" },
      { text: answer, sender: "bot" }
    ]);

    setInput("");
  };

  return (
    <div style={{ width: "400px", margin: "auto", fontFamily: "Arial" }}>
      <h1>Nova - Your Assistant</h1>

      <div style={{ border: "1px solid #ccc", height: "300px", padding: "10px", overflowY: "scroll" }}>
        {messages.map((msg, i) => (
          <p key={i} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender}:</b> {msg.text}
          </p>
        ))}
      </div>

      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Ask me anything..."
        onKeyDown={e => e.key === "Enter" && handleSubmit()}
        style={{ width: "70%", padding: "5px" }}
      />
      <button onClick={handleSubmit} style={{ padding: "5px 10px", marginLeft: "5px" }}>Send</button>
    </div>
  );
}

export default Nova;