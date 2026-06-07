import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const MyRequest = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate();

  const bid = sessionStorage.getItem("bid");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/MyBrandRequests/${bid}/`
      );
      setRequests(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ ADD HERE
  const openChat = async (requestId) => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/GetChatRoomByRequest/${requestId}/`
      );

      navigate(`/brand/chat/${res.data.room_id}`);
    } catch (error) {
      console.log(error);
      alert("Chat not available");
    }
  };

  return (
    <div>
      <h2>My Requests</h2>

      <table border="1">
        <thead>
          <tr>
            <th>Influencer</th>
            <th>Product</th>
            <th>Status</th>
            <th>Chat</th>
          </tr>
        </thead>

        <tbody>
          {requests.map((r) => (
            <tr key={r.id}>
              <td>{r.influencer_name}</td>
              <td>{r.product_name}</td>
              <td>{r.status}</td>

              <td>
                {r.status == 1 ? (
                  <button onClick={() => openChat(r.id)}>
                    Open Chat
                  </button>
                ) : (
                  "Not Available"
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyRequest;