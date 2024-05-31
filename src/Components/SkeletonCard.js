import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "../Pages/RepoCard.css";
import "../Pages/SkeletonCard.css";

const SkeletonRepoCard = () => {
  return (
    <SkeletonTheme color=" #b2b1cd" highlightColor="#fff">
      <div className="repo-card skeleton">
        <div className="skeleton-content">
          <Skeleton
            height={20}
            width={300}
            style={{ marginBottom: "10px", padding: "10px" }}
          />
          <hr />
          <div className="skeleton-data-div">
            <Skeleton
              height={15}
              width={100}
              style={{ marginTop: "15px", marginBottom: "5px", padding: "5px" }}
            />
            <Skeleton
              height={15}
              width={100}
              style={{ marginTop: "15px", marginBottom: "5px", padding: "5px" }}
            />
            <Skeleton
              height={15}
              width={100}
              style={{ marginTop: "15px", marginBottom: "5px", padding: "5px" }}
            />
            <Skeleton
              height={15}
              width={100}
              style={{ marginTop: "15px", marginBottom: "5px", padding: "5px" }}
            />
            <Skeleton
              height={15}
              width={150}
              style={{ marginTop: "15px", marginBottom: "5px", padding: "5px" }}
            />
          </div>
          <button className="skeleton-button">
            <Skeleton height={30} width={120} />
          </button>
        </div>
      </div>
    </SkeletonTheme>
  );
};

export default SkeletonRepoCard;
