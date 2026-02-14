type Props = {
  title: string;
};

export default function Header({ title }: Props) {
  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#f6f7fb",
        padding: "14px 16px",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 900 }}>{title}</div>

      <button
        style={{
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: 999,
          padding: "8px 14px",
          fontWeight: 700,
        }}
      >
        更新
      </button>
    </div>
  );
}
