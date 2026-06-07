import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import style from "./AcceptedRequest.module.css";

import {
  AssignmentTurnedIn as AssignmentTurnedInIcon,
  Business as BusinessIcon,
  Inventory2 as Inventory2Icon,
  CurrencyRupee as CurrencyRupeeIcon,
  CheckCircle as CheckCircleIcon,
  AddPhotoAlternate as AddPhotoAlternateIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";

const AcceptedRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const iid = sessionStorage.getItem("iid");
  const navigate = useNavigate();

  useEffect(() => {
    loadAcceptedRequests();
  }, []);

  const loadAcceptedRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://127.0.0.1:8000/AcceptedInfluencerRequests/${iid}/`
      );
      setRequests(res.data.data || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load accepted requests");
    } finally {
      setLoading(false);
    }
  };

  const goToAddPost = (productId) => {
    navigate(`/influencer/post/${productId}`);
  };

  return (
    <div className={style.page}>
      <div className={style.hero}>
        <div className={style.heroLeft}>
          <div className={style.heroIconWrap}>
            <AssignmentTurnedInIcon className={style.heroIcon} />
          </div>

          <div>
            <h1>Accepted Requests</h1>
            <p>View all approved brand collaborations and create posts easily</p>
          </div>
        </div>

        <div className={style.heroStats}>
          <div className={style.statCard}>
            <span className={style.statLabel}>Total Accepted</span>
            <span className={style.statValue}>{requests.length}</span>
          </div>

          <button className={style.refreshBtn} onClick={loadAcceptedRequests}>
            <RefreshIcon fontSize="small" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <div className={style.contentCard}>
        <div className={style.cardHeader}>
          <div className={style.cardHeaderLeft}>
            <div className={style.headerIconWrap}>
              <CheckCircleIcon className={style.headerIcon} />
            </div>
            <div>
              <h2>Accepted Collaboration List</h2>
              <p>Manage accepted requests and continue your posting workflow</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className={style.stateBox}>
            <div className={style.loader}></div>
            <p>Loading accepted requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className={style.emptyBox}>
            <div className={style.emptyIconWrap}>
              <AssignmentTurnedInIcon className={style.emptyIcon} />
            </div>
            <h3>No accepted requests found</h3>
            <p>
              Once a brand request is accepted, it will appear here for you to
              create a post.
            </p>
          </div>
        ) : (
          <>
            <div className={style.desktopTableWrap}>
              <table className={style.table}>
                <thead>
                  <tr>
                    <th>Brand</th>
                    <th>Product</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {requests.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className={style.cellWithIcon}>
                          <div className={style.smallIconWrap}>
                            <BusinessIcon className={style.smallIcon} />
                          </div>
                          <span>{r.brand_name}</span>
                        </div>
                      </td>

                      <td>
                        <div className={style.cellWithIcon}>
                          <div className={style.smallIconWrap}>
                            <Inventory2Icon className={style.smallIcon} />
                          </div>
                          <span>{r.product_name}</span>
                        </div>
                      </td>

                      <td>
                        <div className={style.cellWithIcon}>
                          <div className={style.smallIconWrap}>
                            <CurrencyRupeeIcon className={style.smallIcon} />
                          </div>
                          <span>₹{r.amount}</span>
                        </div>
                      </td>

                      <td>
                        <span className={style.acceptedBadge}>
                          <CheckCircleIcon fontSize="small" />
                          Accepted
                        </span>
                      </td>

                      <td>
                        <button
                          className={style.actionBtn}
                          onClick={() => goToAddPost(r.product_id)}
                        >
                          <AddPhotoAlternateIcon fontSize="small" />
                          <span>Add Post</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className={style.mobileCards}>
              {requests.map((r) => (
                <div key={r.id} className={style.requestCard}>
                  <div className={style.requestTop}>
                    <div className={style.requestTitleWrap}>
                      <div className={style.requestIconWrap}>
                        <AssignmentTurnedInIcon className={style.requestIcon} />
                      </div>
                      <div>
                        <h3>{r.product_name}</h3>
                        <p>{r.brand_name}</p>
                      </div>
                    </div>

                    <span className={style.acceptedBadge}>
                      <CheckCircleIcon fontSize="small" />
                      Accepted
                    </span>
                  </div>

                  <div className={style.infoGrid}>
                    <div className={style.infoItem}>
                      <span className={style.infoLabel}>Brand</span>
                      <span className={style.infoValue}>{r.brand_name}</span>
                    </div>

                    <div className={style.infoItem}>
                      <span className={style.infoLabel}>Product</span>
                      <span className={style.infoValue}>{r.product_name}</span>
                    </div>

                    <div className={style.infoItem}>
                      <span className={style.infoLabel}>Amount</span>
                      <span className={style.infoValue}>₹{r.amount}</span>
                    </div>

                    <div className={style.infoItem}>
                      <span className={style.infoLabel}>Status</span>
                      <span className={style.infoValue}>Accepted</span>
                    </div>
                  </div>

                  <button
                    className={style.actionBtnFull}
                    onClick={() => goToAddPost(r.product_id)}
                  >
                    <AddPhotoAlternateIcon fontSize="small" />
                    <span>Add Post</span>
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AcceptedRequest;