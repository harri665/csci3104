import { useEffect, useState } from 'react'

export default function Home() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [postResponse, setPostResponse] = useState(null)

  useEffect(() => {
    fetch('/api/health')
      .then((r) => r.json())
      .then(setHealth)
      .catch((e) => setError(e.message))
    
    fetchMessages()
  }, [])

  const fetchMessages = () => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then((data) => setMessages(data.messages))
      .catch((e) => console.error('Error fetching messages:', e))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputValue }),
      })
      const data = await response.json()
      setPostResponse(data)
      setInputValue('')
      fetchMessages()
    } catch (e) {
      setError(e.message)
    }
  }

  return (
    <section className="p-6 space-y-4">
      <h1 className="text-4xl font-bold">Home</h1>
      
      <div className="rounded border p-4">
        <h2 className="font-semibold mb-2">Send a Message</h2>
        <form onSubmit={handleSubmit} className="space-y-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Send POST Request
          </button>
        </form>
        {postResponse && (
          <div className="mt-4">
            <h3 className="font-semibold mb-1">Server Response:</h3>
            <pre className="text-sm bg-green-50 p-2 rounded border border-green-200">
              {JSON.stringify(postResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>

      <div className="rounded border p-4">
        <h2 className="font-semibold mb-2">All Messages</h2>
        {messages.length > 0 ? (
          <div className="space-y-2">
            {messages.map((msg) => (
              <div key={msg.id} className="bg-gray-50 p-3 rounded border">
                <p className="font-medium">{msg.data.message}</p>
                <p className="text-xs text-gray-500 mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No messages yet. Send one above!</p>
        )}
      </div>

      <div className="rounded border p-4">
        <h2 className="font-semibold mb-2">API Health</h2>
        {error && <p className="text-red-600">Error: {error}</p>}
        {health ? (
          <pre className="text-sm bg-gray-100 p-2 rounded">{JSON.stringify(health, null, 2)}</pre>
        ) : (
          <p className="text-gray-600">Loading...</p>
        )}
      </div>
    </section>
  )
}
