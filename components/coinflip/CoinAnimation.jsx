export default function CoinAnimation({ side, flipping }) {
  return (
    <div
      className="flex justify-center"
      style={{
        perspective: "1000px",
      }}
    >
      <img
        src={`/${side || "heads"}.jpg`}
        alt={side}
        style={{
          width: "96px",
          height: "96px",
          borderRadius: "9999px",
          marginTop: 20,
          transition: "transform 1s",
          transform: flipping ? "rotateY(720deg)" : "rotateY(0deg)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      />
    </div>
  );
}
