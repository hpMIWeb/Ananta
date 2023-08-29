import ContentLoader from "react-content-loader";

const CardContentSkeletonLoader = (props) => (
  <div>
    <ContentLoader
    width="100%"
    height={350}
    backgroundColor="#f5f5f5"
    foregroundColor="#dbdbdb"
    {...props}
  >
    <rect x="4" y="8" rx="3" ry="3" width="8" height="317" />
    <rect x="7" y="317" rx="3" ry="3" width="99%" height="8" />
    <rect x="99%" y="9" rx="3" ry="3" width="7" height="313" />
    <rect x="5" y="8" rx="3" ry="3" width="99%" height="7" />
    <rect x="114" y="52" rx="6" ry="6" width="80%" height="15" />
    <circle cx="77" cy="60" r="15" />
    <rect x="116" y="105" rx="6" ry="6" width="65%" height="15" />
    <circle cx="78" cy="113" r="15" />
    <rect x="115" y="158" rx="6" ry="6" width="80%" height="15" />
    <circle cx="78" cy="166" r="15" />
    <rect x="117" y="211" rx="6" ry="6" width="70%" height="15" />
    <circle cx="79" cy="219" r="15" />
    <rect x="117" y="263" rx="6" ry="6" width="80%" height="15" />
    <circle cx="80" cy="271" r="15" />
  </ContentLoader>
  </div>
);

export default CardContentSkeletonLoader;
