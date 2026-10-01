import { useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "../../context/AppContext";

export default function Queries() {
  const { demoRole, queries, addQuery, respondToQuery } = useApp();
  const [search, setSearch] = useState("");
  
    const [showForm, setShowForm] = useState(false);
    const [querySubject, setQuerySubject] = useState("");
    const [queryMessage, setQueryMessage] = useState("");
    const [activeQueryId, setActiveQueryId] = useState(null);
    const [responseText, setResponseText] = useState("");

  const isBuilder = demoRole === "builder";

  return (
    <div className="queries-page">
      <div className="queries-header">
        <div>
          <span className="page-eyebrow">PROJECT COMMUNICATION</span>
          <h2>{isBuilder ? "Viewer Queries" : "Project Queries"}</h2>
          <p>
            {isBuilder
              ? "Review and respond to questions from project viewers."
              : "Ask the Builder questions about your project."}
          </p>
        </div>
        {!isBuilder && (
            <button
                type="button"
                className="primary-button"
                onClick={() => setShowForm(true)}
            >
                <MessageSquare size={17} />
                Submit Query
            </button>
            )}
      </div>

      <div className="queries-summary">
        <div className="queries-summary-card">
          <MessageSquare size={20} />
          <div>
            <span>Total Queries</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="queries-summary-card">
          <Clock size={20} />
          <div>
            <span>Awaiting Response</span>
            <strong>0</strong>
          </div>
        </div>

        <div className="queries-summary-card">
          <CheckCircle2 size={20} />
          <div>
            <span>Responded</span>
            <strong>0</strong>
          </div>
        </div>
      </div>

      <section className="queries-panel">
        <div className="queries-panel-header">
          <div>
            <h3>{isBuilder ? "Incoming Queries" : "My Queries"}</h3>
            <p>
              {isBuilder
                ? "Questions submitted by viewers"
                : "Your questions and their responses"}
            </p>
          </div>

          <div className="queries-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search queries..."
            />
          </div>
        </div>

        {queries.length === 0 ? (
        <div className="queries-empty">
            <MessageSquare size={30} />
            <strong>No queries yet</strong>
            <p>You haven't submitted any questions yet.</p>
        </div>
        ) : (
        <div className="queries-list">
            {queries.map((query) => (
            <div className="queries-card" key={query.id}>
                <h4>{query.subject}</h4>
                <p>{query.message}</p>
                <span>{query.status}</span>

                {query.response && (
                    <div className="query-response">
                    <strong>Builder's Response</strong>
                    <p>{query.response}</p>
                    </div>
                )}

                {isBuilder && !query.response && (
                    <div className="query-reply">
                    {activeQueryId === query.id ? (
                        <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            if (!responseText.trim()) return;

                            respondToQuery(query.id, responseText.trim());
                            setActiveQueryId(null);
                            setResponseText("");
                        }}
                        >
                        <textarea
                            value={responseText}
                            onChange={(event) => setResponseText(event.target.value)}
                            placeholder="Write your response..."
                            rows={3}
                            required
                        />
                        <button type="submit" className="primary-button">
                            <Send size={16} />
                            Send Response
                        </button>
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={() => {
                            setActiveQueryId(null);
                            setResponseText("");
                            }}
                        >
                            Cancel
                        </button>
                        </form>
                    ) : (
                        <button
                        type="button"
                        className="primary-button"
                        onClick={() => setActiveQueryId(query.id)}
                        >
                        Respond
                        </button>
                    )}
                    </div>
                )}
                </div>
            ))}
        </div>
        )}
      </section>
      {showForm && (
            <div className="team-modal-backdrop">
                <div className="team-modal">
                <div className="team-modal-header">
                    <div>
                    <h3>Submit a Query</h3>
                    <p>Send your question to the Builder.</p>
                    </div>
                    <button
                    type="button"
                    className="team-modal-close"
                    onClick={() => setShowForm(false)}
                    aria-label="Close query form"
                    >
                    ×
                    </button>
                </div>

                <form
                    onSubmit={(event) => {
                    event.preventDefault();

                    addQuery({
                        subject: querySubject.trim(),
                        message: queryMessage.trim(),
                        });
                    
                    function respondToQuery(queryId, response) {
                        setQueries((currentQueries) =>
                            currentQueries.map((query) =>
                            query.id === queryId
                                ? {
                                    ...query,
                                    response,
                                    status: "Responded",
                                    respondedAt: new Date().toISOString(),
                                }
                                : query
                            )
                        );
                        }

                    setShowForm(false);
                    setQuerySubject("");
                    setQueryMessage("");
                    }}
                >
                    <label>
                    Subject
                    <input
                        value={querySubject}
                        onChange={(event) => setQuerySubject(event.target.value)}
                        placeholder="Enter query subject"
                        required
                    />
                    </label>

                    <label>
                    Your question
                    <textarea
                        value={queryMessage}
                        onChange={(event) => setQueryMessage(event.target.value)}
                        placeholder="Describe your question..."
                        rows={4}
                        required
                    />
                    </label>

                    <div className="team-modal-actions">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => setShowForm(false)}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="primary-button">
                        <Send size={16} />
                        Submit
                    </button>
                    </div>
                </form>
                </div>
            </div>
            )}
    </div>
  );
}