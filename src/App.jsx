//import statements
import { useState, useRef, useEffect } from 'react';
import KnowledgeBase from './KnowledgeBase.json';
import stringSimilarity from 'string-similarity';
import './App.css';
import { solveExpression } from './MathSolver';
import { Instructions } from './Instructions';
/*main chatbot function*/
function Nova() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isOpen, setSide] = useState(true);
  const [page, setPage] = useState("chat");
  const messagesEndRef = useRef(null); 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  /*changes background image when button is clicked*/
  const images=['/Images/blackscreen.jpg','/Images/bluebackground.avif',
    '/Images/greenbackground.webp',
    '/Images/pinkbackground.jpg'];
  const [Index,setIndex] = useState(0);
  const changeBackground=()=>{setIndex((Index+1)%images.length)};
  // Find approximate answer using string-similarity
  const FindAnswers = (UserInput) => {
  const lowerInput = UserInput.toLowerCase().trim();
  // checks if there are numbers or math operators in the input. 
  try{
    if (/[0-9+\-*/().\s^x=,%]+$/i.test(UserInput)) {
      return solveExpression(UserInput);/* general function for math questions*/
    }
  } catch {
    return "Invalid math expression.";
  }
  // Use the questions array inside KnowledgeBase.questions, note knowledge base is a json file that is an Object!!!
  const validItems = KnowledgeBase.questions.filter(item => item.question && item.answer);
  const questionsArray = validItems.map(item => item.question.toLowerCase());
  const bestMatch = stringSimilarity.findBestMatch(lowerInput, questionsArray);
/*finds the best match for the user input in the json file*/
  if (bestMatch.bestMatch.rating > 0.5) {
    const index = bestMatch.bestMatchIndex;
    return validItems[index].answer;
  } else if (lowerInput === "instructions") {
    setPage("instructions");
    return "Showing instructions...";
  } else {
    return "Sorry, I don't have an answer for that question.";
  }
};
/*handels the input submission and faciliates it's use in the code*/
  const handleSubmit = () => {
    if (!input.trim()) return;
    const answer = FindAnswers(input);
    setMessages(prev => [
      ...prev,
      { text: input, sender: "You" },
      { text: answer, sender: "Nova" }
    ]);
    setInput("");
  };

  return (
    //background image
    <div className="app" style={{
      backgroundImage: `url(${images[Index]})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      }}>
    {/* navigation bar */}
      <div className="sidebar">
        <div className="main">
          <button onClick={()=> setSide(!isOpen)}>
            <div> ☰ </div>
          </button>
        </div>
        <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
          <p><button onClick={() => setPage("chat")}>💬 Nova Chat</button></p>
          <p><button onClick={() => setPage("instructions")} style={{ marginTop: "8px" }}>📖 Instructions</button></p>
          <p><button onClick={changeBackground} style={{ marginTop: "8px" }}>
            🔄 Change background
          </button></p>
        </div>
      </div>
      {/* Output box */}
      <div className="output">
        {page === "chat" && (
          <div className="chat-container">
            <div className="chat-box">
              {messages.map((msg, i) => (
                <div key={i} className={`message-bubble ${msg.sender === "You" ? "user" : "nova"}`}>
                  <p>{msg.text}</p>
                </div>
              ))}
              <div ref={messagesEndRef} />
              <div className="input">
                <div className="input-area"></div>
                <div className="input-controls">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Ask me anything..."
                    onKeyDown={e => e.key === "Enter" && handleSubmit()}
                    style={{ width: "300px", padding: "5px" }}
                  />
                  <button onClick={handleSubmit} style={{ padding: "5px 10px" }}>Send</button>
                </div>
              </div>
            </div>
          </div>
        )}
        {page === "instructions" && (
          <div className="instructions-container">
            <Instructions />
            <button onClick={() => setPage("chat")} style={{ marginTop: "16px" }}>
              Back to Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
export default Nova;