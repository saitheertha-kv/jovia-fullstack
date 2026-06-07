import React, { useEffect, useState } from "react";
import axios from "axios";

const Request = () => {

  const bid = sessionStorage.getItem("bid");

  const [requests, setRequests] = useState([]);

  useEffect(() => {

    axios.get(`http://127.0.0.1:8000/BrandRequests/${bid}/`)
      .then(res => setRequests(res.data.data));

  }, [])

  const getStatus = (s) => {

    if (s === "0") return "Pending";
    if (s === "1") return "Accepted";
    if (s === "2") return "Rejected";

    return s;

  }

  return (

    <div style={{ padding: 20 }}>

      <h2>My Requests</h2>

      <table border="1" cellPadding="10">

        <thead>
          <tr>
            <th>Influencer</th>
            <th>Product</th>
            <th>Amount</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>

          {requests.map(r => (

            <tr key={r.id}>

              <td>{r.influencer_name}</td>

              <td>{r.product_name}</td>

              <td>{r.amount}</td>

              <td>{getStatus(r.status)}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )

}

export default Request